#!/usr/bin/env python3
"""Pixel-detect feature bounds in T1 templates.

Detects:
- Red pill (slides 2/3/4 — error label)
- Green pill (slide 5 — fix label)
- Purple pill (slide 1 — sublabel; slide 6 — CTA)
- Yellow Example: tab (slides 2/3/4/5)
- White card (slides 2/3/4/5)
- White speech bubble (slides 2/3/4/5)

Output: prints suggested slot coords. Manually copy into slots.json.
"""

import sys
from pathlib import Path
from PIL import Image
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
TEMPLATE_DIR = ROOT / "templates" / "T1"

# Color targets (RGB) — measured empirically
COLORS = {
    "red_pill":     ([220, 60, 80], 50),       # bright red errors pill
    "green_pill":   ([90, 200, 130], 60),      # green fix pill
    "purple_pill":  ([150, 107, 237], 30),     # deep purple
    "yellow_tab":   ([255, 213, 80], 40),      # yellow Example tab
}


def find_bounds(arr, target_rgb, tolerance, y_min=0, y_max=None, x_min=0, x_max=None):
    if y_max is None: y_max = arr.shape[0]
    if x_max is None: x_max = arr.shape[1]
    region = arr[y_min:y_max, x_min:x_max]
    target = np.array(target_rgb)
    diff = np.abs(region.astype(int) - target).sum(axis=2)
    mask = diff < tolerance
    ys, xs = np.where(mask)
    if len(ys) == 0:
        return None
    return {
        "x_min": int(xs.min() + x_min),
        "x_max": int(xs.max() + x_min),
        "y_min": int(ys.min() + y_min),
        "y_max": int(ys.max() + y_min),
        "x_center": int((xs.min() + xs.max()) // 2 + x_min),
        "y_center": int((ys.min() + ys.max()) // 2 + y_min),
        "width": int(xs.max() - xs.min()),
        "height": int(ys.max() - ys.min()),
        "px_count": int(len(ys)),
    }


def find_white_card(arr, y_search_start=400):
    """Find a large near-white rounded rectangle in the lower portion. Returns the
    largest contiguous white-ish region."""
    # White-ish: RGB > 240 in all channels
    mask = (arr[:, :, 0] > 235) & (arr[:, :, 1] > 235) & (arr[:, :, 2] > 235)
    # Restrict to below y_search_start
    mask[:y_search_start] = False
    ys, xs = np.where(mask)
    if len(ys) == 0:
        return None
    return {
        "x_min": int(xs.min()), "x_max": int(xs.max()),
        "y_min": int(ys.min()), "y_max": int(ys.max()),
        "x_center": int((xs.min() + xs.max()) // 2),
        "y_center": int((ys.min() + ys.max()) // 2),
        "px_count": int(len(ys)),
    }


def report_slide(slide_path, label):
    print(f"\n=== {label} ({slide_path.name}) ===")
    im = Image.open(slide_path).convert("RGB")
    arr = np.array(im)
    h, w = arr.shape[:2]
    print(f"  dims: {w}x{h}")
    for name, (rgb, tol) in COLORS.items():
        b = find_bounds(arr, rgb, tol)
        if b and b["px_count"] > 200:
            print(f"  {name:14s}: x={b['x_min']}-{b['x_max']} y={b['y_min']}-{b['y_max']} "
                  f"center=({b['x_center']},{b['y_center']}) px={b['px_count']}")


for f in sorted(TEMPLATE_DIR.glob("slide*.png")):
    if "_grid" in str(f) or "_slots_debug" in str(f):
        continue
    report_slide(f, f.stem)
