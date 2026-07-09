#!/usr/bin/env python3
"""Overlay a 50px grid on each T1 template for slot coordinate measurement.

Usage: python debug-grid.py
Outputs: marketing/templates/T1/_grid/slideN_grid.png
"""

from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEMPLATES = ROOT / "templates" / "T1"
OUT = TEMPLATES / "_grid"
OUT.mkdir(exist_ok=True)

GRID_MAJOR = 100
GRID_MINOR = 50

slides = sorted(TEMPLATES.glob("slide*.png"))

for src in slides:
    if "_grid" in str(src):
        continue
    im = Image.open(src).convert("RGBA")
    overlay = Image.new("RGBA", im.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    w, h = im.size

    for x in range(0, w, GRID_MINOR):
        color = (255, 0, 255, 80) if x % GRID_MAJOR else (255, 0, 255, 160)
        d.line([(x, 0), (x, h)], fill=color, width=1)
    for y in range(0, h, GRID_MINOR):
        color = (255, 0, 255, 80) if y % GRID_MAJOR else (255, 0, 255, 160)
        d.line([(0, y), (w, y)], fill=color, width=1)

    try:
        font = ImageFont.truetype("arial.ttf", 16)
    except OSError:
        font = ImageFont.load_default()
    for x in range(0, w, GRID_MAJOR):
        d.text((x + 2, 2), str(x), fill=(255, 0, 255, 255), font=font)
    for y in range(0, h, GRID_MAJOR):
        if y == 0:
            continue
        d.text((2, y + 2), str(y), fill=(255, 0, 255, 255), font=font)

    composed = Image.alpha_composite(im, overlay)
    composed.save(OUT / src.name)
    print(f"wrote {OUT / src.name}")
