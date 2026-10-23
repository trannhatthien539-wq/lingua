import os
import math
import pymupdf
from PIL import Image, ImageDraw, ImageFilter

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SVG_PATH = os.path.join(BASE_DIR, "public", "icons", "tree.svg")
ICONS_DIR = os.path.join(BASE_DIR, "public", "icons")

def create_gradient_background(width, height):
    """Tạo nền vũ trụ gradient #080E24 -> #0F172A -> #06212B."""
    bg = Image.new("RGBA", (width, height))
    draw = ImageDraw.Draw(bg)
    
    c_start = (8, 14, 36)     # #080E24
    c_mid   = (15, 23, 42)    # #0F172A
    c_end   = (6, 33, 43)     # #06212B
    
    max_dist = math.sqrt(width**2 + height**2)
    for y in range(height):
        for x in range(width):
            dist = math.sqrt(x**2 + y**2) / max_dist
            if dist < 0.45:
                t = dist / 0.45
                r = int(c_start[0] + (c_mid[0] - c_start[0]) * t)
                g = int(c_start[1] + (c_mid[1] - c_start[1]) * t)
                b = int(c_start[2] + (c_mid[2] - c_start[2]) * t)
            else:
                t = (dist - 0.45) / 0.55
                r = int(c_mid[0] + (c_end[0] - c_mid[0]) * t)
                g = int(c_mid[1] + (c_end[1] - c_mid[1]) * t)
                b = int(c_mid[2] + (c_end[2] - c_mid[2]) * t)
            bg.putpixel((x, y), (r, g, b, 255))
            
    # Thêm vầng sáng mềm (subtle cyan/indigo glow) ở tâm
    glow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    cx, cy = width // 2, int(height * 0.48)
    r_glow = int(min(width, height) * 0.38)
    glow_draw.ellipse(
        (cx - r_glow, cy - r_glow, cx + r_glow, cy + r_glow),
        fill=(56, 189, 248, 48)  # #38BDF8 with ~19% opacity
    )
    glow = glow.filter(ImageFilter.GaussianBlur(radius=r_glow // 2))
    bg.alpha_composite(glow)
    return bg

def render_feather(target_size):
    """Render chiếc lông vũ từ tree.svg ở độ phân giải cao và resize mượt mà."""
    doc = pymupdf.open(SVG_PATH)
    page = doc[0]
    zoom = 1024.0 / 128.0
    mat = pymupdf.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat, alpha=True)
    feather = Image.frombytes("RGBA", (pix.width, pix.height), pix.samples)
    
    # Crop vừa vặn theo bbox của nét vẽ
    bbox = feather.getbbox()
    if bbox:
        feather = feather.crop(bbox)
        
    # Scale giữ tỷ lệ vừa vào target_size
    fw, fh = feather.size
    scale = min(target_size[0] / fw, target_size[1] / fh)
    nw, nh = int(fw * scale), int(fh * scale)
    return feather.resize((nw, nh), Image.Resampling.LANCZOS)

def build_squircle_icon(size):
    """
    Icon vuông bo góc (Squircle) với 4 góc ngoài TRONG SUỐT (alpha = 0).
    Dành cho Web App / Desktop / Any purpose, không bao giờ lộ viền trắng khi nền tối.
    """
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    
    # Nền gradient vũ trụ
    bg = create_gradient_background(size, size)
    
    # Mask vuông bo góc squircle (radius 22%)
    radius = int(size * 0.225)
    mask = Image.new("L", (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle((0, 0, size, size), radius=radius, fill=255)
    
    # Áp mask vào nền để có 4 góc trong suốt hoàn hảo
    squircle_bg = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    squircle_bg.paste(bg, (0, 0), mask=mask)
    
    # Viền vi diệu tinh tế (Subtle luminous border: vàng kim + lam ngọc)
    border_img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    b_draw = ImageDraw.Draw(border_img)
    b_width = max(1, int(size * 0.015))
    b_draw.rounded_rectangle(
        (0, 0, size - 1, size - 1),
        radius=radius,
        outline=(253, 224, 71, 75),  # Gold rim
        width=b_width
    )
    squircle_bg.alpha_composite(border_img)
    
    # Đặt chiếc lông vũ ở trung tâm
    feather_target_size = (int(size * 0.72), int(size * 0.72))
    feather = render_feather(feather_target_size)
    fx = (size - feather.width) // 2
    fy = (size - feather.height) // 2
    squircle_bg.alpha_composite(feather, (fx, fy))
    
    return squircle_bg

def build_maskable_icon(size):
    """
    Icon thích ứng Android Maskable (Full-bleed 100% không bo góc).
    Launcher của điện thoại (Pixel circle, Samsung squircle, Xiaomi) tự cắt theo hình của máy.
    Không có viền trắng, vùng an toàn 80% đảm bảo lông vũ luôn trọn vẹn.
    """
    bg = create_gradient_background(size, size)
    
    # Vùng an toàn của Maskable Icon là vòng tròn 80% (bán kính 40% từ tâm)
    feather_target_size = (int(size * 0.62), int(size * 0.62))
    feather = render_feather(feather_target_size)
    fx = (size - feather.width) // 2
    fy = (size - feather.height) // 2
    bg.alpha_composite(feather, (fx, fy))
    
    return bg

def main():
    print("Generating PWA & Android app icons...")
    
    # 1. Squircle Icons (purpose: any) - 4 corners transparent, rounded squircle
    icon_192 = build_squircle_icon(192)
    icon_192.save(os.path.join(ICONS_DIR, "icon-192.png"), format="PNG", optimize=True)
    print("  -> Created icon-192.png (Squircle with transparent corners)")
    
    icon_512 = build_squircle_icon(512)
    icon_512.save(os.path.join(ICONS_DIR, "icon-512.png"), format="PNG", optimize=True)
    print("  -> Created icon-512.png (Squircle with transparent corners)")
    
    # 2. Maskable Icons (purpose: maskable) - Full-bleed for Android Adaptive Launcher
    maskable_192 = build_maskable_icon(192)
    maskable_192.save(os.path.join(ICONS_DIR, "icon-maskable-192.png"), format="PNG", optimize=True)
    print("  -> Created icon-maskable-192.png (Full-bleed Android Adaptive)")
    
    maskable_512 = build_maskable_icon(512)
    maskable_512.save(os.path.join(ICONS_DIR, "icon-maskable-512.png"), format="PNG", optimize=True)
    print("  -> Created icon-maskable-512.png (Full-bleed Android Adaptive)")
    
    # 3. Apple Touch Icon (180x180 Full-bleed - iOS clips to squircle automatically)
    apple_icon = build_maskable_icon(180)
    apple_icon.save(os.path.join(ICONS_DIR, "apple-touch-icon.png"), format="PNG", optimize=True)
    print("  -> Created apple-touch-icon.png (iOS Retina squircle)")
    
    print("All icons successfully generated!")

if __name__ == "__main__":
    main()
