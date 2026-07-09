#!/usr/bin/env python3
"""Mark detected feature centers onto each T1 template for visual verification."""

import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
T1 = ROOT / "templates" / "T1"
OUT = T1 / "_features_debug"
OUT.mkdir(exist_ok=True)

try:
    from scipy import ndimage
except ImportError:
    print("Need scipy: pip install scipy"); sys.exit(1)

try:
    LBL_FONT = ImageFont.truetype("arial.ttf", 18)
except OSError:
    LBL_FONT = ImageFont.load_default()


def find_largest_white_blob(arr, y_min, y_max, x_min=0, x_max=None):
    if x_max is None: x_max = arr.shape[1]
    white = (arr[:,:,0] > 240) & (arr[:,:,1] > 240) & (arr[:,:,2] > 240)
    region = np.zeros_like(white)
    region[y_min:y_max, x_min:x_max] = white[y_min:y_max, x_min:x_max]
    labeled, n = ndimage.label(region)
    if n == 0: return None
    sizes = ndimage.sum(region, labeled, range(1, n+1))
    biggest = np.argmax(sizes) + 1
    ys, xs = np.where(labeled == biggest)
    return {
        "x_min": int(xs.min()), "x_max": int(xs.max()),
        "y_min": int(ys.min()), "y_max": int(ys.max()),
        "x_center": int((xs.min() + xs.max()) // 2),
        "y_center": int((ys.min() + ys.max()) // 2),
        "size": int(sizes[biggest - 1]),
    }


def find_largest_color_blob(arr, target, tol, y_min=0, y_max=None, x_min=0, x_max=None):
    if y_max is None: y_max = arr.shape[0]
    if x_max is None: x_max = arr.shape[1]
    diff = np.abs(arr.astype(int) - np.array(target)).sum(axis=2)
    mask = diff < tol
    region = np.zeros_like(mask)
    region[y_min:y_max, x_min:x_max] = mask[y_min:y_max, x_min:x_max]
    labeled, n = ndimage.label(region)
    if n == 0: return None
    sizes = ndimage.sum(region, labeled, range(1, n+1))
    biggest = np.argmax(sizes) + 1
    ys, xs = np.where(labeled == biggest)
    return {
        "x_min": int(xs.min()), "x_max": int(xs.max()),
        "y_min": int(ys.min()), "y_max": int(ys.max()),
        "x_center": int((xs.min() + xs.max()) // 2),
        "y_center": int((ys.min() + ys.max()) // 2),
        "size": int(sizes[biggest - 1]),
    }


def mark(d, b, color, name):
    if not b: return
    d.rectangle([(b["x_min"], b["y_min"]), (b["x_max"], b["y_max"])], outline=color, width=4)
    d.ellipse([(b["x_center"]-7, b["y_center"]-7), (b["x_center"]+7, b["y_center"]+7)], fill=color)
    d.text((b["x_min"], max(0, b["y_min"] - 24)), f'{name} ({b["x_center"]},{b["y_center"]})',
           fill=color, font=LBL_FONT)


for src in sorted(T1.glob("slide*.png")):
    if "_" in src.parent.name and "_grid" not in src.parent.name:
        pass
    if any(x in str(src) for x in ["_grid", "_slots_debug", "_features_debug"]):
        continue
    im = Image.open(src).convert("RGBA")
    arr = np.array(im.convert("RGB"))
    overlay = im.copy()
    d = ImageDraw.Draw(overlay)

    # Pills
    if src.stem == "slide1_hook":
        b = find_largest_color_blob(arr, [150,107,237], 30, y_max=900)
        mark(d, b, (0, 200, 0, 255), "purple_pill")
    elif src.stem == "slide2_error1":
        b = find_largest_color_blob(arr, [220,60,80], 50, y_max=400)
        mark(d, b, (255, 0, 255, 255), "red_pill")
    elif src.stem == "slide3_error2":
        b = find_largest_color_blob(arr, [220,60,80], 50, y_max=400)
        mark(d, b, (255, 0, 255, 255), "red_pill")
    elif src.stem == "slide4_error3":
        b = find_largest_color_blob(arr, [220,60,80], 50, y_max=400)
        mark(d, b, (255, 0, 255, 255), "red_pill")
    elif src.stem == "slide5_fix":
        b = find_largest_color_blob(arr, [90,200,130], 60, y_max=400)
        mark(d, b, (0, 0, 255, 255), "green_pill")

    # Yellow Example tab (top-left of card area, slides 2/3/4/5)
    if src.stem in ("slide2_error1", "slide3_error2", "slide4_error3", "slide5_fix"):
        b = find_largest_color_blob(arr, [255,213,80], 40, y_min=400)
        mark(d, b, (255, 140, 0, 255), "yellow_tab")

    # White card body — biggest white blob in middle band (between top and bottom 25%)
    h = arr.shape[0]
    if src.stem in ("slide2_error1", "slide3_error2", "slide4_error3", "slide5_fix"):
        b = find_largest_white_blob(arr, y_min=h*1//3, y_max=h*5//6)
        mark(d, b, (255, 0, 0, 255), "white_card")

    # Speech bubble — small white blob in lower-left, smaller than card
    # Search lower-left quadrant for blobs not the card and not the cat
    if src.stem in ("slide2_error1", "slide3_error2", "slide4_error3"):
        b = find_largest_white_blob(arr, y_min=h*2//3, y_max=h, x_max=arr.shape[1]//2)
        mark(d, b, (0, 255, 255, 255), "speech_bubble")
    if src.stem == "slide5_fix":
        b = find_largest_white_blob(arr, y_min=int(h*0.83), y_max=h, x_max=arr.shape[1]//2)
        mark(d, b, (0, 255, 255, 255), "speech_bubble")

    out = OUT / src.name
    overlay.save(out)
    print(f"wrote {out}")
