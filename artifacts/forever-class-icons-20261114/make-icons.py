# 포에버 직업 가이드 목록(/forever/classes)의 도트 아이콘을 만든다.
#   직업 아이콘: 공식 직업 아이콘(src/classicon_<직업>.jpg, 56px)을 28칸 도트로 줄인다.
#   전문화 아이콘: 리테일 직업 가이드 목록의 흰 전문화 아이콘(public/assets/spec-icons-white-v1.png)을
#                 24칸 도트로 줄이고 직업 색을 입힌다.
# 사용: python artifacts/forever-class-icons-20261114/make-icons.py   (site 폴더에서)
# 결과: public/images/forever/icons/class-<직업>.png, spec-<직업>-<전문화>.png (한 칸 = 8픽셀)
import os
import re
import sys
from PIL import Image, ImageEnhance

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.abspath(os.path.join(HERE, '..', '..'))
OUT = os.path.join(SITE, 'public', 'images', 'forever', 'icons')
ATLAS = os.path.join(SITE, 'public', 'assets', 'spec-icons-white-v1.png')
CROPS = os.path.join(SITE, 'src', 'data', 'guideSpecIcons.js')
CELL = 8          # 도트 한 칸을 몇 픽셀로 내보낼지
CLASS_GRID = 28   # 직업 아이콘 칸 수
SPEC_GRID = 24    # 전문화 아이콘 칸 수
SPEC_BODY = 20    # 전문화 문양이 차지하는 칸 수(둘레 2칸 여백)

# foreverGuide.js의 CLASS_COLORS와 같다.
CLASS_COLORS = {
    'warrior': '#C69B6D', 'paladin': '#F48CBA', 'hunter': '#AAD372', 'rogue': '#FFF468', 'priest': '#FFFFFF',
    'shaman': '#0070DD', 'mage': '#3FC7EB', 'warlock': '#8788EE', 'druid': '#FF7C0A',
}
# 포에버 전문화 → 리테일 목록 아이콘. 이름이 다른 둘만 따로 적는다.
SPECS = {
    'warrior': ['arms', 'fury', 'protection'], 'paladin': ['holy', 'protection', 'retribution'],
    'hunter': ['beast-mastery', 'marksmanship', 'survival'], 'rogue': ['assassination', 'combat', 'subtlety'],
    'priest': ['discipline', 'holy', 'shadow'], 'shaman': ['elemental', 'enhancement', 'restoration'],
    'mage': ['arcane', 'fire', 'frost'], 'warlock': ['affliction', 'demonology', 'destruction'],
    'druid': ['balance', 'feral', 'restoration'],
}
RETAIL_NAME = {'hunter/beast-mastery': 'hunter-beastmastery', 'rogue/combat': 'rogue-outlaw'}

INK = (8, 6, 4)
TILE = (27, 21, 15)
TILE_DARK = (17, 13, 9)
TILE_LIGHT = (43, 34, 24)


def rgb(value):
    return tuple(int(value[i:i + 2], 16) for i in (1, 3, 5))


def mix(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def upscale(image):
    return image.resize((image.width * CELL, image.height * CELL), Image.NEAREST)


def class_icon(name):
    source = Image.open(os.path.join(HERE, 'src', f'classicon_{name}.jpg')).convert('RGB')
    # 원본 테두리 2픽셀은 어두운 틀이라 잘라 낸다.
    source = source.crop((2, 2, 54, 54))
    small = source.resize((CLASS_GRID, CLASS_GRID), Image.LANCZOS)
    # 줄이면서 흐려진 만큼 색과 명암을 올리고, 색 수를 줄여 도트 면으로 묶는다.
    small = ImageEnhance.Color(small).enhance(1.3)
    small = ImageEnhance.Contrast(small).enhance(1.18)
    small = ImageEnhance.Sharpness(small).enhance(1.6)
    small = small.quantize(colors=14, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGB')
    return upscale(small)


# 가는 틈이 점선으로 깨지는 문양만 문턱값을 따로 준다(값이 클수록 틈이 또렷해진다).
THRESHOLD = {'warrior-protection': 150}


def spec_mask(crop, threshold=104):
    box = crop.point(lambda v: 255 if v > 48 else 0).getbbox()
    glyph = crop.crop(box)
    scale = SPEC_BODY / max(glyph.size)
    width, height = max(1, round(glyph.width * scale)), max(1, round(glyph.height * scale))
    small = glyph.resize((width, height), Image.LANCZOS)
    grid = [[False] * SPEC_GRID for _ in range(SPEC_GRID)]
    left, top = (SPEC_GRID - width) // 2, (SPEC_GRID - height) // 2
    for y in range(height):
        for x in range(width):
            grid[top + y][left + x] = small.getpixel((x, y)) >= threshold
    return grid


def spec_icon(grid, color):
    base = rgb(color)
    light = mix(base, (255, 255, 255), 0.42)
    dark = mix(base, (0, 0, 0), 0.42)
    n = SPEC_GRID
    on = lambda x, y: 0 <= x < n and 0 <= y < n and grid[y][x]
    image = Image.new('RGB', (n, n), TILE)
    px = image.load()
    # 파인 칸: 위·왼쪽은 어둡게, 아래·오른쪽은 밝게.
    for i in range(n):
        px[i, 0] = px[0, i] = TILE_DARK
    for i in range(1, n):
        px[i, n - 1] = px[n - 1, i] = TILE_LIGHT
    for y in range(n):
        for x in range(n):
            if on(x, y):
                if not on(x, y - 1):
                    px[x, y] = light
                elif not on(x, y + 1) or not on(x + 1, y):
                    px[x, y] = dark
                else:
                    px[x, y] = base
            elif any(on(x + dx, y + dy) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (-1, 1))):
                px[x, y] = INK
    return upscale(image)


def main():
    os.makedirs(OUT, exist_ok=True)
    crops = {name: (int(x) - 88, int(y) - 88) for name, x, y in re.findall(r"\['([a-z-]+)', (\d+), (\d+)\]", open(CROPS, encoding='utf-8').read())}
    atlas = Image.open(ATLAS).convert('L')
    made = []
    for name, color in CLASS_COLORS.items():
        class_icon(name).save(os.path.join(OUT, f'class-{name}.png'), optimize=True)
        made.append(f'class-{name}')
        for spec in SPECS[name]:
            retail = RETAIL_NAME.get(f'{name}/{spec}', f'{name}-{spec}')
            x, y = crops[retail]
            grid = spec_mask(atlas.crop((x, y, x + 176, y + 176)), THRESHOLD.get(retail, 104))
            spec_icon(grid, color).save(os.path.join(OUT, f'spec-{name}-{spec}.png'), optimize=True)
            made.append(f'spec-{name}-{spec}')
    if '--sheet' in sys.argv:
        tile = SPEC_GRID * CELL
        sheet = Image.new('RGB', (4 * (tile + 16) + 16, len(CLASS_COLORS) * (tile + 16) + 16), (13, 10, 8))
        for row, name in enumerate(CLASS_COLORS):
            for col, item in enumerate([f'class-{name}'] + [f'spec-{name}-{spec}' for spec in SPECS[name]]):
                icon = Image.open(os.path.join(OUT, f'{item}.png')).resize((tile, tile), Image.NEAREST)
                sheet.paste(icon, (16 + col * (tile + 16), 16 + row * (tile + 16)))
        sheet.save(os.path.join(HERE, 'sheet.png'))
    print(len(made), 'icons ->', OUT)


if __name__ == '__main__':
    main()
