#!/usr/bin/env python3
"""Overlay post content onto a template's blank slots.

Usage:
    python overlay-text.py --template T1 --content path/to/content.json --output-dir path/to/out

Markup tags inside text strings:
    {P}text{/P}   — color text in `purple` (color key from slots.json)
    {U}text{/U}   — yellow wavy underline
    {H}text{/H}   — both purple AND yellow underline (the common headline emphasis)
    {Y}text{/Y}   — yellow underline (alias for {U}, used for English-phrase highlights)
"""

import argparse
import json
import math
import re
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]


def hex_to_rgba(h: str) -> tuple:
    h = h.lstrip("#")
    if len(h) == 6:
        return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), 255)
    if len(h) == 8:
        return tuple(int(h[i:i+2], 16) for i in (0, 2, 4, 6))
    raise ValueError(f"bad hex color: {h}")


# --- Markup parsing -----------------------------------------------------------

TAG_RE = re.compile(r"\{(/?)(P|U|H|Y)\}")


def parse_markup(text: str):
    """Convert a string with {P}/{U}/{H}/{Y} tags into a list of (char, attrs)
    where attrs is a dict possibly containing 'color' and 'underline'."""
    out = []
    pos = 0
    stack = []  # stack of attr dicts being applied
    while pos < len(text):
        m = TAG_RE.search(text, pos)
        if not m:
            for ch in text[pos:]:
                out.append((ch, _merge(stack)))
            break
        # everything before tag
        for ch in text[pos:m.start()]:
            out.append((ch, _merge(stack)))
        closing, tag = m.group(1), m.group(2)
        if closing:
            # pop matching tag (allow loose nesting)
            for i in range(len(stack) - 1, -1, -1):
                if stack[i]["_tag"] == tag:
                    stack.pop(i)
                    break
        else:
            attr = {"_tag": tag}
            if tag in ("P", "H"):
                attr["color_override"] = "purple"
            if tag in ("U", "H", "Y"):
                attr["underline"] = "yellow"
            stack.append(attr)
        pos = m.end()
    return out


def _merge(stack):
    out = {}
    for a in stack:
        if "color_override" in a:
            out["color_override"] = a["color_override"]
        if "underline" in a:
            out["underline"] = a["underline"]
    return out


# --- Layout / wrapping --------------------------------------------------------

def wrap_chars(chars, font, max_width: int):
    """Wrap a list of (char, attrs) into a list of lines (each line a list of
    (char, attrs)). Splits on \\n hard breaks and on max_width otherwise."""
    lines = [[]]
    cur_w = 0

    def char_width(ch):
        return int(font.getlength(ch))

    # Try Latin-style word wrap if the text contains spaces and only ASCII.
    text_only = "".join(c for c, _ in chars if c != "\n")
    is_latin = text_only.isascii() and " " in text_only
    if is_latin:
        # group by words (preserving attrs of each char)
        i = 0
        n = len(chars)
        while i < n:
            ch, _ = chars[i]
            if ch == "\n":
                lines.append([])
                cur_w = 0
                i += 1
                continue
            # accumulate a word until next space or end
            j = i
            while j < n and chars[j][0] != " " and chars[j][0] != "\n":
                j += 1
            word = chars[i:j]
            word_w = sum(char_width(c) for c, _ in word)
            space_w = char_width(" ") if cur_w > 0 else 0
            if cur_w + space_w + word_w > max_width and lines[-1]:
                lines.append([])
                cur_w = 0
                space_w = 0
            if space_w:
                lines[-1].append((" ", {}))
                cur_w += space_w
            for c, a in word:
                lines[-1].append((c, a))
                cur_w += char_width(c)
            i = j
            # consume spaces (attach to current line as-is, but skip leading)
            while i < n and chars[i][0] == " ":
                if cur_w > 0 and cur_w + char_width(" ") <= max_width:
                    lines[-1].append((" ", {}))
                    cur_w += char_width(" ")
                i += 1
        return lines

    # CJK / mixed: char-by-char
    for ch, attrs in chars:
        if ch == "\n":
            lines.append([])
            cur_w = 0
            continue
        w = char_width(ch)
        if cur_w + w > max_width and lines[-1]:
            lines.append([])
            cur_w = 0
        lines[-1].append((ch, attrs))
        cur_w += w
    return lines


def measure_block(lines, font, line_spacing):
    """Return (max_width, total_visible_height, line_advance, top_offset)."""
    if not lines or all(not ln for ln in lines):
        return 0, 0, 0, 0
    widths = []
    for ln in lines:
        w = sum(font.getlength(c) for c, _ in ln)
        widths.append(int(w))
    sample = "".join(c for c, _ in lines[0]) or "字Aj"
    l, t, r, b = font.getbbox(sample)
    visible_line_h = b - t
    top_offset = t
    ascent, descent = font.getmetrics()
    line_advance = int((ascent + descent) * line_spacing)
    total_h = int(visible_line_h + line_advance * (len(lines) - 1)) if lines else 0
    return max(widths) if widths else 0, total_h, line_advance, top_offset


def fit_text(chars, font_path, base_size, max_w, max_h, line_spacing, auto_fit,
             min_size_factor=0.45):
    size = base_size
    min_size = max(12, int(base_size * min_size_factor))
    while True:
        font = ImageFont.truetype(str(font_path), size)
        lines = wrap_chars(chars, font, max_w)
        w, h, _, _ = measure_block(lines, font, line_spacing)
        if not auto_fit:
            return font, lines
        if h <= max_h and w <= max_w:
            return font, lines
        if size <= min_size:
            return font, lines
        size -= 2


# --- Underline drawing --------------------------------------------------------

def draw_wavy_underline(draw, x0, x1, y, color, amplitude=5, period=18, width=6):
    """Draw a marker-stroke-style wavy line from x0 to x1 at vertical center y."""
    if x1 <= x0:
        return
    # Extend slightly past the text edges so the underline feels organic.
    pad = max(4, width)
    x0 -= pad
    x1 += pad
    step = 2
    pts = []
    x = x0
    while x <= x1:
        yy = y + amplitude * math.sin((x - x0) / period * math.pi * 2)
        pts.append((x, yy))
        x += step
    for i in range(len(pts) - 1):
        draw.line([pts[i], pts[i + 1]], fill=color, width=width)


def draw_straight_underline(draw, x0, x1, y, color, width=7):
    if x1 > x0:
        pad = max(4, width)
        draw.line([(x0 - pad, y), (x1 + pad, y)], fill=color, width=width)


# --- Anchors ------------------------------------------------------------------

def anchor_origin(anchor: str, x: int, y: int, w: int, h: int):
    vert, horiz = anchor[0], anchor[1]  # vert first letter, horiz second
    if vert not in "tmb" or horiz not in "lcr":
        raise ValueError(f"bad anchor {anchor}")
    y0 = y if vert == "t" else (y - h // 2 if vert == "m" else y - h)
    x0 = x if horiz == "l" else (x - w // 2 if horiz == "c" else x - w)
    return x0, y0


# --- Region rendering ---------------------------------------------------------

def render_region(canvas, region, text, fonts_map, colors_map):
    if not text:
        return
    font_path = fonts_map[region["font"]]
    base_size = region["size"]
    max_w = region["max_width"]
    max_h = region["max_height"]
    line_spacing = region.get("line_spacing", 1.1)
    auto_fit = region.get("auto_fit", True)
    underline_style = region.get("underline_style", "wavy")  # "wavy" | "straight"
    default_color = hex_to_rgba(colors_map[region["color"]])
    purple_color = hex_to_rgba(colors_map.get("purple", "#3A2E8C"))
    underline_color = hex_to_rgba(colors_map.get("yellow", "#FFD93D"))

    chars = parse_markup(text)
    font, lines = fit_text(chars, font_path, base_size, max_w, max_h,
                           line_spacing, auto_fit)
    block_w, block_h, line_advance, top_offset = measure_block(lines, font, line_spacing)
    x0, y0 = anchor_origin(region["anchor"], region["x"], region["y"], block_w, block_h)

    draw = ImageDraw.Draw(canvas)
    cy = y0 - top_offset
    ascent, descent = font.getmetrics()

    for line in lines:
        line_w = int(sum(font.getlength(c) for c, _ in line))
        cx = x0 + (block_w - line_w) // 2
        # Draw chars first
        x_run_start = None
        run_attrs = None
        run_segments = []  # (start_x, end_x) of underlined runs in this line
        x_iter = cx
        for ch, attrs in line:
            cw = int(font.getlength(ch))
            color = purple_color if attrs.get("color_override") == "purple" else default_color
            draw.text((x_iter, cy), ch, font=font, fill=color)
            if attrs.get("underline"):
                if x_run_start is None:
                    x_run_start = x_iter
                x_run_end = x_iter + cw
                run_attrs = attrs
            else:
                if x_run_start is not None:
                    run_segments.append((x_run_start, x_run_end))
                    x_run_start = None
            x_iter += cw
        if x_run_start is not None:
            run_segments.append((x_run_start, x_run_end))
        # Draw underlines below the line baseline
        # Underline y = cy + ascent + small gap
        underline_y = cy + top_offset + (ascent + descent) * 0.92
        for (sx, ex) in run_segments:
            stroke_w = max(6, font.size // 10)
            if underline_style == "straight":
                draw_straight_underline(draw, sx, ex, int(underline_y),
                                        underline_color, width=stroke_w)
            else:
                draw_wavy_underline(draw, sx, ex, int(underline_y),
                                    underline_color,
                                    amplitude=max(4, font.size // 12),
                                    period=max(14, font.size // 3),
                                    width=stroke_w)
        cy += line_advance


def compose_slide(template_path, regions, content, fonts_map, colors_map, out_path):
    canvas = Image.open(template_path).convert("RGBA")
    for region_name, region_spec in regions.items():
        text = content.get(region_name, "")
        if text:
            render_region(canvas, region_spec, text, fonts_map, colors_map)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.convert("RGB").save(out_path, format="PNG")
    return out_path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--template", required=True)
    ap.add_argument("--content", required=True)
    ap.add_argument("--output-dir", required=True)
    args = ap.parse_args()

    template_dir = ROOT / "templates" / args.template
    spec = json.loads((template_dir / "slots.json").read_text(encoding="utf-8"))
    fonts_map = {k: ROOT / v for k, v in spec["fonts"].items()}
    colors_map = spec["colors"]

    content = json.loads(Path(args.content).read_text(encoding="utf-8"))
    out_dir = Path(args.output_dir)

    written = []
    for slide_name, slide_spec in spec["slides"].items():
        template_path = template_dir / slide_spec["template_file"]
        slide_content = content["slides"].get(slide_name, {})
        out_path = out_dir / slide_spec["template_file"]
        compose_slide(template_path, slide_spec["regions"], slide_content,
                      fonts_map, colors_map, out_path)
        written.append(str(out_path))

    print(json.dumps({"composed": written, "out_dir": str(out_dir)}, indent=2))


if __name__ == "__main__":
    main()
