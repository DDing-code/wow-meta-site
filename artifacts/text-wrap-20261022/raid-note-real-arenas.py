# -*- coding: utf-8 -*-
# 2026-10-22 배치도 전장 바탕을 실제 지도대로 다시 그린 뒤, KB 레이드 가이드 정본의 안내문·기록을 그에 맞게 고친다. 다시 돌려도 같은 결과.
import io
import json
import os

KB = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base', '00-공통', '공용', 'Meta', 'raid-guide.json')
g = json.load(io.open(KB, encoding='utf-8'))
MID = '이 글은 영상용 스토리보드(5편 74컷)의 내용을 글로 옮기고, 컷마다 그린 위에서 본 배치도를 해당 행동 옆에 붙인 것입니다. 배치도의 자리·인원은 예시이며, 영상은 다음 단계에서 붙습니다.'
NOW = '이 글은 영상용 스토리보드(5편 74컷)의 내용을 글로 옮기고, 컷마다 그린 위에서 본 배치도를 해당 행동 옆에 붙인 것입니다. 배치도의 전장 모양과 바닥 문양은 실제 게임의 위에서 본 지도를 따라 그렸고, 자리·인원은 예시입니다. 영상은 다음 단계에서 붙습니다.'
g['basisNotes'] = [NOW if n == MID else n for n in g['basisNotes']]
assert NOW in g['basisNotes'], 'basis note missing'
g['metadata']['storyboard'] = ('ai-hub workspace/outputs/mythic-raid-storyboard-20261022 (5편 74컷·팁 108개)의 내레이션·팁을 글로 옮기고, 위에서 본 배치도 74장(plan/)과 '
                               '네임드 스프라이트를 사이트 public/images/raid에 WebP로 넣었다. 배치도의 전장 바탕 10장은 2026-10-22 raidstrats.gg 플래너의 실제 위에서 본 '
                               '지도를 참고 그림으로 붙여 같은 윤곽·바닥 문양으로 다시 그렸다(예전 판은 assets/arenas/_before-real). 영상은 다음 단계.')
io.open(KB, 'w', encoding='utf-8', newline='\n').write(json.dumps(g, ensure_ascii=False, indent=2) + '\n')
print('kb note updated')
