import os
import base64
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_IMAGE = r"C:\Users\0364869801\.gemini\antigravity\brain\350726dd-aeab-4e20-82bc-9827a3c2939e\.user_uploaded\media_1792769101890_d08ceac9.jpg"
ICONS_DIR = os.path.join(BASE_DIR, "public", "icons")

def generate_icons():
    print("Reading source uploaded image...")
    orig = Image.open(SRC_IMAGE)
    
    # 1. Tách phần icon vuông bo góc (Squircle) chính xác, bỏ hoàn toàn nền ca-rô
    # Vùng chứa icon trong ảnh gốc: x in [287, 736], y in [136, 626]
    crop = orig.crop((287, 136, 736, 626))  # size: 449 x 490
    sq1024 = crop.resize((1024, 1024), Image.Resampling.LANCZOS)
    
    # Tạo mask bo góc siêu mịn 4x supersampled (4096 x 4096)
    mask_hires = Image.new("L", (4096, 4096), 0)
    draw_hires = ImageDraw.Draw(mask_hires)
    radius_hires = int(4096 * 0.222)
    draw_hires.rounded_rectangle((0, 0, 4095, 4095), radius=radius_hires, fill=255)
    mask1024 = mask_hires.resize((1024, 1024), Image.Resampling.LANCZOS)
    
    # Áp dụng mask trong suốt 4 góc
    squircle_1024 = sq1024.copy()
    squircle_1024.putalpha(mask1024)
    
    # 2. Tạo nền full-bleed cho Maskable Icon (Android Adaptive) & Apple Touch Icon
    # Gradient navy đậm từ đỉnh (36, 82, 126) xuống đáy (13, 17, 62) khớp chuẩn màu nền của icon
    fullbleed_1024 = Image.new("RGBA", (1024, 1024))
    c_top = (36, 82, 126)
    c_bottom = (13, 17, 62)
    for y in range(1024):
        t = y / 1023.0
        r = int(c_top[0] + (c_bottom[0] - c_top[0]) * t)
        g = int(c_top[1] + (c_bottom[1] - c_top[1]) * t)
        b = int(c_top[2] + (c_bottom[2] - c_top[2]) * t)
        for x in range(1024):
            fullbleed_1024.putpixel((x, y), (r, g, b, 255))
            
    # Đặt icon squircle ở trung tâm vùng an toàn (82% scale) cho Android Maskable
    scale = 0.82
    scaled_w = int(1024 * scale)
    scaled_h = int(1024 * scale)
    scaled_sq = squircle_1024.resize((scaled_w, scaled_h), Image.Resampling.LANCZOS)
    offset_x = (1024 - scaled_w) // 2
    offset_y = (1024 - scaled_h) // 2
    
    # Thêm bóng đổ mềm (subtle drop shadow) phía sau squircle trên nền full-bleed
    shadow = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
    shadow_mask = Image.new("L", (scaled_w, scaled_h), 0)
    s_draw = ImageDraw.Draw(shadow_mask)
    s_draw.rounded_rectangle((0, 0, scaled_w - 1, scaled_h - 1), radius=int(scaled_w * 0.222), fill=80)
    shadow.paste((5, 10, 25, 100), (offset_x, offset_y + 8), mask=shadow_mask)
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=16))
    
    maskable_1024 = fullbleed_1024.copy()
    maskable_1024.alpha_composite(shadow)
    maskable_1024.alpha_composite(scaled_sq, (offset_x, offset_y))
    
    # 3. Xuất các file icon ra thư mục public/icons
    os.makedirs(ICONS_DIR, exist_ok=True)
    
    # A. icon-192.png & icon-512.png (Squircle trong suốt 4 góc)
    icon_192 = squircle_1024.resize((192, 192), Image.Resampling.LANCZOS)
    icon_192.save(os.path.join(ICONS_DIR, "icon-192.png"), format="PNG", optimize=True)
    print("  -> Exported icon-192.png (192x192 squircle)")
    
    icon_512 = squircle_1024.resize((512, 512), Image.Resampling.LANCZOS)
    icon_512.save(os.path.join(ICONS_DIR, "icon-512.png"), format="PNG", optimize=True)
    print("  -> Exported icon-512.png (512x512 squircle)")
    
    # B. icon-maskable-192.png & icon-maskable-512.png (Android Adaptive)
    mask_192 = maskable_1024.resize((192, 192), Image.Resampling.LANCZOS)
    mask_192.save(os.path.join(ICONS_DIR, "icon-maskable-192.png"), format="PNG", optimize=True)
    print("  -> Exported icon-maskable-192.png (192x192 maskable)")
    
    mask_512 = maskable_1024.resize((512, 512), Image.Resampling.LANCZOS)
    mask_512.save(os.path.join(ICONS_DIR, "icon-maskable-512.png"), format="PNG", optimize=True)
    print("  -> Exported icon-maskable-512.png (512x512 maskable)")
    
    # C. apple-touch-icon.png (180x180 cho iOS)
    apple_180 = maskable_1024.resize((180, 180), Image.Resampling.LANCZOS)
    apple_180.save(os.path.join(ICONS_DIR, "apple-touch-icon.png"), format="PNG", optimize=True)
    print("  -> Exported apple-touch-icon.png (180x180 iOS)")
    
    # D. Cập nhật tree.svg để đồng bộ hiển thị vector nhúng
    with open(os.path.join(ICONS_DIR, "icon-512.png"), "rb") as f:
        b64_png = base64.b64encode(f.read()).decode("utf-8")
    svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" width="512" height="512" fill="none" role="img" aria-label="Lingua - Celestial Feather &amp; Book Icon">
  <image href="data:image/png;base64,{b64_png}" width="512" height="512" />
</svg>
'''
    with open(os.path.join(ICONS_DIR, "tree.svg"), "w", encoding="utf-8") as f:
        f.write(svg_content)
    print("  -> Updated tree.svg with new high-res artwork")
    
    print("All icons successfully generated from user artwork!")

if __name__ == "__main__":
    generate_icons()
