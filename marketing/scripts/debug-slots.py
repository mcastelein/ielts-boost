#!/usr/bin/env python3
"""Overlay slot bounding boxes onto each T1 template — visual debug for slot spec.

Reads marketing/templates/T1/slots.json and draws each region's bounding box
on top of the template, labeled with the region name.

Output: marketing/templates/T1/_slots_debug/<slide>.png
"""

import json
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = sys.argv[1] if len(sys.argv) > 1 else "T1"
TEMPLATE_DIR = ROOT / "templates" / TEMPLATE
OUT_DIR = TEMPLATE_DIR / "_slots_debug"
OUT_DIR.mkdir(exist_ok=True)


def anchor_origin(anchor, x, y, w, h):
    horiz, vert = anchor[0], anchor[1]
    if horiz == "t": y0 = y
    elif horiz == "m": y0 = y - h // 2
    else: y0 = y - h
    if vert == "l": x0 = x
    elif vert == "c": x0 = x - w // 2
    else: x0 = x - w
    return x0, y0


spec = json.loads((TEMPLATE_DIR / "slots.json").read_text(encoding="utf-8"))
try:
    label_font = ImageFont.truetype("arial.ttf", 22)
except OSError:
    label_font = ImageFont.load_default()

for slide_name, slide in spec["slides"].items():
    src = TEMPLATE_DIR / slide["template_file"]
    im = Image.open(src).convert("RGBA")
    overlay = Image.new("RGBA", im.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    for region_name, r in slide["regions"].items():
        x0, y0 = anchor_origin(r["anchor"], r["x"], r["y"], r["max_width"], r["max_height"])
        x1 = x0 + r["max_width"]
        y1 = y0 + r["max_height"]
        d.rectangle([(x0, y0), (x1, y1)], outline=(255, 0, 0, 255), width=3)
        d.rectangle([(x0, y0 - 30), (x0 + len(region_name) * 14 + 8, y0)],
                    fill=(255, 0, 0, 200))
        d.text((x0 + 4, y0 - 28), region_name, fill=(255, 255, 255, 255), font=label_font)
        d.ellipse([(r["x"] - 5, r["y"] - 5), (r["x"] + 5, r["y"] + 5)],
                  fill=(255, 255, 0, 255))
    composed = Image.alpha_composite(im, overlay)
    out = OUT_DIR / slide["template_file"]
    composed.save(out)
    print(f"wrote {out}")
