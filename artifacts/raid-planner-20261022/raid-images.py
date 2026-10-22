# 레이드 배치도 중 raidstrats 플랜 자리로 다시 그린 편(님리사·맹독 심연 1~6넴·똬리의 제단)만 사이트 WebP로 내보낸다.
# 사이트가 실제로 쓰는 컷(src/data/raidGuide.json 의 figure)만 내보내, 2026-10-22 뺀 '한 장 복습' 그림이 되살아나지 않게 한다.
import json, os
from PIL import Image
SITE = os.path.join(os.path.dirname(__file__), '..', '..')
SB = r'F:/01_프로젝트/90_개발/ai-hub/workspace/outputs/mythic-raid-storyboard-20261022'
OUT = os.path.join(SITE, 'public', 'images', 'raid', 'plan')
EPISODES = ('02-nymrissa', '03-venomous-1-6', '04-coiled-altar')
guide = json.load(open(os.path.join(SITE, 'src', 'data', 'raidGuide.json'), encoding='utf-8'))
plans = set()
def walk(o):
    if isinstance(o, dict):
        if 'plan' in o and isinstance(o['plan'], str): plans.add(o['plan'])
        for v in o.values(): walk(v)
    elif isinstance(o, list):
        for v in o: walk(v)
walk(guide)
done = 0
for key in sorted(plans):
    if not key.startswith(EPISODES): continue
    im = Image.open(os.path.join(SB, 'plan', key + '.png')).convert('RGB')
    for w, q in ((960, 78), (1600, 80)):
        im.resize((w, w * 9 // 16), Image.LANCZOS).save(os.path.join(OUT, f'{key}-{w}.webp'), 'WEBP', quality=q, method=6)
    done += 1
print('exported', done, 'plans')
