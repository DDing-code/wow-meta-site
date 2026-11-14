# 포에버 게임 창 테두리·바탕 도트 그림을 만든다. 사용: python make-ui.py  → public/images/forever/ui/*.png
# 공식 공지 화면(규칙 고르기 창·유산 창)의 단면을 본떴다: 어두운 외곽 → 청동 띠 → 어두운 골 → 얇은 안쪽 줄, 모서리는 비스듬히 깎음.
# 도트 한 칸 = 화면 2px. 고해상도 화면에서도 번지지 않게 그림은 한 칸을 6픽셀로 저장하고 CSS에서 3분의 1로 줄여 쓴다.
# 모서리 조각은 화면 16px(8칸, 그림 48픽셀)이고 CSS border-image 가 직선 부분만 늘린다.
import os, random
from PIL import Image

OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'images', 'forever', 'ui')
U = 6  # 도트 한 칸을 저장하는 픽셀 수

def hexa(c, a=255):
    c = c.lstrip('#'); return (int(c[0:2], 16), int(c[2:4], 16), int(c[4:6], 16), a)

def save(grid, name):
    n = len(grid)
    im = Image.new('RGBA', (n, n), (0, 0, 0, 0))
    for y, row in enumerate(grid):
        for x, c in enumerate(row):
            if c: im.putpixel((x, y), c)
    im = im.resize((n * U, n * U), Image.NEAREST)
    im.save(os.path.join(OUT, name), optimize=True)
    print(name, im.size, os.path.getsize(os.path.join(OUT, name)), 'bytes')

def frame(n, cut, lit, shade, diag_lit, diag_mid, diag_shade):
    """n칸 정사각 9조각 테두리. lit/shade 는 바깥→안쪽 색 띠, cut 은 모서리를 깎는 칸 수."""
    depth_max = len(lit)
    grid = [[None] * n for _ in range(n)]
    for y in range(n):
        for x in range(n):
            left, top, right, bottom = x, y, n - 1 - x, n - 1 - y
            # 네 모서리의 비스듬한 면까지의 깊이(도트 계단)
            diags = {'tl': left + top - cut, 'tr': right + top - cut, 'bl': left + bottom - cut, 'br': right + bottom - cut}
            corner, diag = min(diags.items(), key=lambda kv: kv[1])
            if diag < 0: continue
            diag_depth = (diag * 3) // 4
            straight = min(left, top, right, bottom)
            depth = min(straight, diag_depth)
            if depth >= depth_max: continue
            if diag_depth < straight:
                palette = {'tl': diag_lit, 'tr': diag_mid, 'bl': diag_mid, 'br': diag_shade}[corner]
            else:
                palette = lit if straight in (left, top) and (top <= bottom and left <= right or straight == top and top < bottom or straight == left and left < right) else shade
                if straight == top and top <= bottom: palette = lit
                elif straight == left and left <= right: palette = lit
                else: palette = shade
            grid[y][x] = hexa(palette[depth])
    return grid

# 1. 창 테두리: 6칸(12px) 두께, 모서리 4칸 깎음.
LIT   = ['#050403', '#b39766', '#8a7049', '#4d3c24', '#0b0806', '#43341f']
SHADE = ['#050403', '#77603f', '#5d4a30', '#33271a', '#0b0806', '#2f2416']
DLIT  = ['#050403', '#cdb07a', '#9a7f55', '#57452b', '#0b0806', '#4b3a23']
DMID  = ['#050403', '#95794f', '#73593a', '#40311f', '#0b0806', '#392c1b']
DSHD  = ['#050403', '#65502f', '#4f3e27', '#2c2116', '#0b0806', '#281f13']
save(frame(24, 4, LIT, SHADE, DLIT, DMID, DSHD), 'window-frame.png')

# 2. 말풍선(툴팁) 테두리: 3칸(6px) 두께, 모서리 2칸 깎음.
T_LIT   = ['#050403', '#c9ab72', '#1a130c']
T_SHADE = ['#050403', '#8f7648', '#1a130c']
save(frame(12, 2, T_LIT, T_SHADE, T_LIT, T_LIT, T_SHADE), 'tooltip-frame.png')

# 3. 창 바탕: 어두운 갈색 가죽결. 32칸 타일(64px).
random.seed(1114)
N = 32
base = (23, 17, 12)
tile = [[None] * N for _ in range(N)]
for y in range(N):
    for x in range(N):
        d = random.choice([-3, -2, -1, -1, 0, 0, 0, 0, 1, 1, 2])
        if random.random() < 0.035: d = 6       # 드문 밝은 점
        if random.random() < 0.03: d = -6       # 드문 어두운 점
        tile[y][x] = (max(0, base[0] + d), max(0, base[1] + d), max(0, base[2] + d), 255)
save(tile, 'window-fill.png')
