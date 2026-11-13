# -*- coding: utf-8 -*-
"""raw/<이름>.png(그림 생성 원본)를 사이트용 webp로 바꿔 public/images/forever에 넣는다.
  python build.py            # 전부
  python build.py 이름…      # 고른 것만
대표 그림(hero-*)은 768·1536, 정사각(basic-*)은 512·1024, 나머지는 640·1280 폭으로 만든다(ForeverPage.js의 ART_WIDTHS와 같아야 한다).
sheet.jpg는 한눈에 보는 모음이다."""
import os
import sys

from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "raw")
OUT = os.path.join(HERE, "..", "..", "public", "images", "forever")


def widths(name):
    if name.startswith("hero-"):
        return (768, 1536)
    if name.startswith("basic-"):
        return (512, 1024)
    return (640, 1280)


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    os.makedirs(OUT, exist_ok=True)
    names = sys.argv[1:] or sorted(f[:-4] for f in os.listdir(RAW) if f.endswith(".png"))
    total = 0
    for name in names:
        im = Image.open(os.path.join(RAW, name + ".png")).convert("RGB")
        square = name.startswith("basic-")
        ratio = im.width / im.height
        assert abs(ratio - (1 if square else 1.5)) < 0.02, f"{name}: 비율이 다름 {im.size}"
        for w in widths(name):
            h = w if square else round(w * 2 / 3)
            # 도트 경계가 뭉개지지 않게 축소는 LANCZOS, 저장은 높은 품질로.
            out = im if im.size == (w, h) else im.resize((w, h), Image.LANCZOS)
            dst = os.path.join(OUT, f"{name}-{w}.webp")
            out.save(dst, "WEBP", quality=88, method=6)
            total += os.path.getsize(dst)
        print(name, im.size)
    print(f"{len(names)}장, 합계 {total / 1024 / 1024:.1f}MB")

    # 한눈에 보는 모음
    all_names = sorted(f[:-4] for f in os.listdir(RAW) if f.endswith(".png"))
    cols, tw, th = 5, 480, 320
    sheet = Image.new("RGB", (cols * tw, ((len(all_names) + cols - 1) // cols) * th), (11, 15, 19))
    draw = ImageDraw.Draw(sheet)
    for k, name in enumerate(all_names):
        im = Image.open(os.path.join(RAW, name + ".png")).convert("RGB")
        im.thumbnail((tw, th), Image.LANCZOS)
        x, y = (k % cols) * tw + (tw - im.width) // 2, (k // cols) * th
        sheet.paste(im, (x, y))
        draw.rectangle((x, y, x + 8 * len(name) + 8, y + 16), fill=(0, 0, 0))
        draw.text((x + 4, y + 2), name, fill=(255, 230, 120))
    sheet.save(os.path.join(HERE, "sheet.jpg"), quality=88)


if __name__ == "__main__":
    main()
