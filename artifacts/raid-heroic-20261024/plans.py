# -*- coding: utf-8 -*-
"""영웅 레이드 글 탭의 배치도를 영웅 통합 영상 v2 장면에서 뽑는다.

영상 장면 하나 = 영웅 글의 행동 하나라서(heroic.cjs), 장면의 지도 부분(1440x810, 화면 0,100부터)을
이동이 끝난 마지막 프레임에서 잘라 쓴다. 머리글·오른쪽 전투 흐름·아래 자막은 사이트 글과 겹치므로 뺀다.
지도·20인 자리·징표·이름표는 영상 생성기(heroic-raid-integrated-20261024/build.py, heroic_content.py)를
그대로 쓴다 — 영상과 글과 그림이 같은 원고에서 나온다. 생성기는 읽기만 한다.

  python artifacts/raid-heroic-20261024/plans.py      # public/images/raid/plan/heroic-<네임드>-NN-{960,1600}.webp
그 뒤 node artifacts/raid-heroic-20261024/heroic.cjs → npm run sync-kb
"""
import json
import os
import sys
from pathlib import Path

from PIL import Image

SITE = Path(__file__).resolve().parents[2]
HEROIC = Path(r'F:\01_프로젝트\90_개발\ai-hub\workspace\outputs\heroic-raid-integrated-20261024')
OUT = SITE / 'public' / 'images' / 'raid' / 'plan'
SHEET = Path(__file__).resolve().parent / 'shots' / 'plans-sheet.jpg'

sys.stdout.reconfigure(encoding='utf-8')
os.chdir(HEROIC)
sys.path.insert(0, str(HEROIC))
import build  # noqa: E402

video = build.Video()
made = []
counts = {}
for index, row in enumerate(video.rows):
    if row['kind'] != 'action':
        continue
    boss = row['boss']
    counts[boss] = counts.get(boss, 0) + 1
    key = f'heroic-{boss}-{counts[boss]:02d}'
    im = video.frame(index, row['frames'] - 1).crop((0, 100, build.MW, 100 + build.MH))
    for width in (960, 1600):
        im.resize((width, width * 9 // 16), Image.LANCZOS).save(OUT / f'{key}-{width}.webp', 'WEBP', quality=84, method=6)
    made.append(dict(plan=key, boss=boss, title=row['title'], arena=row.get('arena') or video.bosses[boss]['arena']))
    print(key, row['title'])

# 눈으로 훑어보는 한 장(4열)
cols, tw, th = 4, 480, 270
sheet = Image.new('RGB', (cols * tw, -(-len(made) // cols) * th), (11, 15, 19))
for i, item in enumerate(made):
    thumb = Image.open(OUT / f"{item['plan']}-960.webp").resize((tw, th))
    sheet.paste(thumb, ((i % cols) * tw, (i // cols) * th))
SHEET.parent.mkdir(exist_ok=True)
sheet.save(SHEET, quality=82)
(Path(__file__).resolve().parent / 'plans.json').write_text(json.dumps(made, ensure_ascii=False, indent=1), encoding='utf-8')
print(len(made), 'plans')
