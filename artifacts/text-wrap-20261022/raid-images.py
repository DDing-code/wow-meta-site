# 레이드 스토리보드 배치도(plan/*.png 1920x1080)와 네임드 스프라이트를 사이트용 WebP로 줄인다.
# 출력: public/images/raid/plan/<컷>-960.webp, <컷>-1600.webp / public/raid/sprites/<id>.webp (투명 유지, 여백 잘라 320px)
from PIL import Image
import glob, os
SB = r'F:/01_프로젝트/90_개발/ai-hub/workspace/outputs/mythic-raid-storyboard-20261022'
OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'images', 'raid')
for src in sorted(glob.glob(SB + '/plan/*.png')):
    key = os.path.splitext(os.path.basename(src))[0]
    im = Image.open(src).convert('RGB')
    for w, q in ((960, 78), (1600, 80)):
        im.resize((w, w * 9 // 16), Image.LANCZOS).save(os.path.join(OUT, 'plan', f'{key}-{w}.webp'), 'WEBP', quality=q, method=6)
for src in sorted(glob.glob(SB + '/assets/sprites/b_*.png')):
    key = os.path.splitext(os.path.basename(src))[0][2:]
    im = Image.open(src).convert('RGBA')
    box = im.getchannel('A').point(lambda a: 255 if a > 8 else 0).getbbox()
    im = im.crop(box)
    side = max(im.size)
    sq = Image.new('RGBA', (side, side), (0, 0, 0, 0))
    sq.paste(im, ((side - im.width) // 2, side - im.height))
    sq.resize((320, 320), Image.LANCZOS).save(os.path.join(OUT, 'sprites', f'{key}.webp'), 'WEBP', quality=86, method=6)
print('done')
