"""Generate the PWA / web app icons from a source artwork image.

Usage: python scripts/make-icons.py <source-image>

Writes public/icons/icon-192.png, icon-512.png and apple-touch-icon.png.
"""
import os
import sys

from PIL import Image

SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "icons")


def main():
    with Image.open(SRC) as img:
        art = img.convert("RGB")

    w, h = art.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    art = art.crop((left, top, left + side, top + side))

    def save(img, name):
        img.quantize(colors=256, method=Image.MEDIANCUT, dither=Image.FLOYDSTEINBERG).save(
            os.path.join(OUT, name), optimize=True
        )

    for size in (192, 512):
        save(art.resize((size, size), Image.LANCZOS), f"icon-{size}.png")

    save(art.resize((180, 180), Image.LANCZOS), "apple-touch-icon.png")
    print("icons written")


if __name__ == "__main__":
    main()
