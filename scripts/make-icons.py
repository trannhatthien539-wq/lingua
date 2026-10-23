"""Generate the PWA / web app icons from a source artwork image.

Usage: python scripts/make-icons.py <source-image>

Trims the near-white canvas, then writes the PWA and Apple touch icons.
"""
import os
import sys

from PIL import Image, ImageChops

SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "icons")


def main():
    with Image.open(SRC) as img:
        art = img.convert("RGBA")

    background = Image.new("RGBA", art.size, "white")
    background.alpha_composite(art)
    art = background.convert("RGB")

    difference = ImageChops.difference(art, Image.new("RGB", art.size, "white")).convert("L")
    bounds = difference.point(lambda value: 255 if value > 8 else 0).getbbox()
    if not bounds:
        raise ValueError("Source image does not contain any artwork.")

    left, top, right, bottom = bounds
    center_x = (left + right) / 2
    center_y = (top + bottom) / 2
    side = max(right - left, bottom - top) * 1.08
    half_side = side / 2
    left = max(0, int(center_x - half_side))
    top = max(0, int(center_y - half_side))
    right = min(art.width, int(center_x + half_side))
    bottom = min(art.height, int(center_y + half_side))
    art = art.crop((left, top, right, bottom))

    side = max(art.size)
    square = Image.new("RGB", (side, side), "white")
    square.paste(art, ((side - art.width) // 2, (side - art.height) // 2))
    art = square

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
