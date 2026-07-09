"""Test: paste text fields from a JSON record onto the douyin template image.

Strategy: mask the existing example text/blank regions with their local background
colour, then draw the new text from DATA on top — so the result reflects DATA, not
the template's placeholder strings.

Positions were derived from pixel analysis of the template:
  - dashes "——" (purple) at y≈260..285, x≈88..453        -> percentage
  - line-2 chars (black) at y≈370..440, x≈329..801       -> headline_top
  - line-3 black "都在这里" x≈70..456, "！" x≈758..777, with
    purple "____" blank x≈473..729, y≈500..580            -> headline_bottom
  - warning bar (purple bg) y≈633..710, blank x≈240..308  -> warning_number, warning_text
  - speech bubble interior y≈1100..1240, x≈80..460        -> speech_bubble
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).parent
SRC = HERE / "27710b3c-e561-4572-a824-a7385a55ea5f.png"
OUT = HERE / "rendered.png"

YAHEI_BOLD = r"C:\Windows\Fonts\msyhbd.ttc"

PURPLE = (45, 27, 180)
BLACK = (0, 0, 0)
WHITE = (253, 253, 253)
WHITE_BG = (250, 250, 253)         # page background
BAR_BG = (57, 38, 178)             # warning-bar purple background

DATA = {
    "percentage": "90",
    "headline_top": "的雅思考生",
    "headline_bottom": "都在这里丢分！",
    "warning_number": "3",
    "warning_text": "个错误正在拉低你的分数",
    "speech_bubble": "别再这样写了！",
}


def mask(draw, box, fill):
    """Paint a rectangle with the given fill (used to erase existing text)."""
    draw.rectangle(box, fill=fill)


def render():
    img = Image.open(SRC).convert("RGB")
    draw = ImageDraw.Draw(img)

    # ---- 1. Percentage: erase "——" dashes, draw "90" baseline-aligned to "%" ----
    mask(draw, (60, 252, 470, 295), WHITE_BG)
    f_pct = ImageFont.truetype(YAHEI_BOLD, 200)
    draw.text((265, 295), DATA["percentage"], font=f_pct, fill=PURPLE, anchor="mb")

    # ---- 2. Headline top "的雅思考生": erase old chars, redraw ----
    mask(draw, (325, 365, 810, 450), WHITE_BG)
    f_head = ImageFont.truetype(YAHEI_BOLD, 92)
    draw.text((329, 437), DATA["headline_top"], font=f_head, fill=BLACK, anchor="ls")

    # ---- 3. Headline bottom "都在这里丢分！": erase entire line, redraw ----
    mask(draw, (60, 495, 790, 585), WHITE_BG)
    draw.text((70, 577), DATA["headline_bottom"], font=f_head, fill=BLACK, anchor="ls")

    # ---- 4 & 5. Warning bar: erase text region (keep purple bg), redraw ----
    # Erase right of warning icon, keep ⚠️ icon at left (x≈100-200) intact
    mask(draw, (200, 635, 920, 708), BAR_BG)
    f_warn = ImageFont.truetype(YAHEI_BOLD, 40)
    draw.text((215, 700), DATA["warning_number"], font=f_warn, fill=WHITE, anchor="lb")
    # offset warning_text after number based on its width
    num_w = draw.textlength(DATA["warning_number"] + " ", font=f_warn)
    draw.text((215 + num_w, 700), DATA["warning_text"], font=f_warn, fill=WHITE, anchor="lb")

    # ---- 6. Speech bubble: bubble is empty, just draw centered text ----
    f_bubble = ImageFont.truetype(YAHEI_BOLD, 44)
    draw.text((265, 1165), DATA["speech_bubble"], font=f_bubble, fill=BLACK, anchor="mm")

    img.save(OUT)
    print(f"Saved: {OUT}")


if __name__ == "__main__":
    render()
