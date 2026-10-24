# druid-balance — 단일 딜사이클 스조라크 빌드 기준 자료
- 스조라크 신화(12.1.5) 상위 랭킹 영웅 특성: ALL {"엘룬의 대행자":5,"숲의 수호자":193} · KR {"엘룬의 대행자":2,"숲의 수호자":97} → **단일 기준 영웅 특성: 숲의 수호자**
- 참고(다른 전투, 이번에 고치지 않음): 신화 님리사(쫄 있는 레이드) 상위 ALL 엘룬의 대행자 2·숲의 수호자 98 / KR 엘룬의 대행자 11·숲의 수호자 74 · 쐐기 상위 ALL 엘룬의 대행자 26·숲의 수호자 0 / KR 엘룬의 대행자 16·숲의 수호자 0 (goal-12.1.5-r5, 2026-10-20 집계)
- 영웅 탭: [0] 엘룬의 대행자 · [1] 숲의 수호자 / 기본 탭 지금 [0] → 이번 결정 [1] 숲의 수호자 — 처음 열리는 오프닝·단일 탭이 스조라크 상위 기록의 영웅 특성과 맞도록 바꿈
- 새 단일 견본(apply-patch 가 자동으로 넣음, 원고에서 따로 고치지 않음): 지금(엘룬의 대행자) → 스조라크 대표 빌드(숲의 수호자) · 대표 행 ALL #33 Superdruid CN https://www.warcraftlogs.com/reports/hxVnAJLQBMD1cF4t#fight=25 · 유효 행 290
  - 지금 견본에서 빠지는 칸: 태풍, Improved Stampeding Roar, 쌍둥이 달, Incarnation: Chosen of Elune, 엘룬의 분노, Astral Insight, 비전 친화, 영원한 달, Lunar Insight, 달의 부름, Glistening Fur, Stellar Command, Elune's Grace, 달의 수호자, Atmospheric Exposure, 0, Light of the Sun, Bask in Moonlight, 반그늘의 팽창, 쏟아지는 별, Nature's Grace
  - 새로 들어오는 칸: Killer Instinct 2, 영혼 소집, 자연의 군대, Soul of the Forest, Astral Communion, Lycara's Inspiration, 풍성한 개화, 꿈의 통제, Protective Growth, Grove's Inspiration, 달의 나무정령, Blooming Infusion, Expansiveness, 세나리우스의 권능, Power of Nature, 숲의 조화, 0, Spirit of the Thicket, Dryad's Dance, 녹음의 유혹
- 둘 중 하나 고르는 칸(기준 영웅 특성 상위 290행의 선택 수, 시전 버튼이 있는 칸·갈리는 칸 먼저):
  - 야생의 돌진(102401) 290 / Tiger Dash(252216) 0 — 새 견본: 야생의 돌진(102401)
  - Mass Entanglement(102359) 2 / 우르솔의 회오리(102793) 274 — 새 견본: 우르솔의 회오리(102793)
  - 달래기(2908) 280 / Cyclone(33786) 10 — 새 견본: 달래기(2908)
  - Incarnation: Chosen of Elune(394013) 0 / 영혼 소집(391528) 290 — 새 견본: 영혼 소집(391528)
  - 행동 불가의 포효(99) 3 / Mighty Bash(5211) 0 — 새 견본: 안 고름
  - Circle of the Wild(474530) 0 / Circle of the Heavens(474541) 290 — 새 견본: Circle of the Heavens(474541)
  - Sunseeker Mushroom(468936) 142 / 야생 버섯(88747) 0 — 새 견본: 안 고름
  - Sundered Firmament(394094) 270 / Orbit Breaker(383197) 20 — 새 견본: Sundered Firmament(394094)
  - Whirling Stars(468743) 290 / Orbital Strike(390378) 0 — 새 견본: Whirling Stars(468743)
  - 별재봉사(393940) 0 / 별의 동료(393954) 290 — 새 견본: 별의 동료(393954)
  - Nature's Grace(450347) 1 / Elune's Challenge(1240283) 0 — 새 견본: 안 고름
  - 풍성한 개화(429215) 287 / Early Spring(428937) 3 — 새 견본: 풍성한 개화(429215)
  - Power of the Dream(434220) 0 / 꿈의 통제(434249) 290 — 새 견본: 꿈의 통제(434249)
  - Grove's Inspiration(429402) 262 / Potent Enchantments(429420) 28 — 새 견본: Grove's Inspiration(429402)
  - Power of Nature(428859) 290 / Durability of Nature(429227) 0 — 새 견본: Power of Nature(428859)

## 기준 영웅 특성(숲의 수호자) 스조라크 로그 10개 — 오프닝 (풀 −8초부터 첫 32회, 같은 스킬 연속은 ×n)
- ALL #1 EU Hawked 293초 <https://www.warcraftlogs.com/reports/R9zp3rQZP1kyHxb8#fight=23&source=186>
  0.5 천벌 → 0.7 태양섬광 → 1.6 자연의 군대 → 2.1 Potion of Recklessness* → 2.4 천체의 정렬 → 2.6 별빛쇄도 ×3 → 4.9 영혼 소집 → 8.7 별빛쇄도 ×2 → 10.2 천벌 ×5 → 14.2 별빛쇄도 ×3 → 16.4 천벌 → 17.2 태양섬광 → 18.0 Solar Eclipse* → 18.6 천벌 ×4 → 21.9 별빛쇄도 ×3 → 24.2 천벌 ×3
- ALL #2 US Porlix 302초 <https://www.warcraftlogs.com/reports/VwzAqghML8mF4YDd#fight=19&source=1>
  0.3 천벌 ×2 → 1.5 태양섬광 → 2.5 자연의 군대 → 3.0 Light's Potential* → 3.0 천체의 정렬 → 3.3 별빛쇄도 ×4 → 6.3 영혼 소집 → 10.5 별빛쇄도 ×3 → 12.8 천벌 ×6 → 17.3 태양섬광 → 18.0 천벌 ×2 → 19.6 Solar Eclipse* → 20.2 별빛쇄도 ×3 → 22.5 천벌 ×5
- ALL #3 KR Lerepam 299초 <https://www.warcraftlogs.com/reports/CRBwpKLmyrFnA6QG#fight=29&source=189>
  1.0 천벌 → 1.0 태양섬광 → 1.9 자연의 군대 → 2.2 Potion of Recklessness* → 2.3 천체의 정렬 → 2.7 별빛쇄도 ×4 → 5.8 영혼 소집 → 9.9 별빛섬광 → 10.7 별빛쇄도 ×2 → 12.3 천벌 ×2 → 13.9 별빛쇄도 ×2 → 15.5 천벌 ×2 → 17.3 별빛쇄도 → 18.1 태양섬광 → 19.0 천벌 ×4 → 23.0 Solar Eclipse* → 23.5 별빛쇄도 ×3 → 26.0 천벌 → 26.7 야생의 돌진 → 26.9 달빛섬광
- ALL #4 US Clecia 328초 <https://www.warcraftlogs.com/reports/z2Wc7PNJAMDZ1KkC#fight=44&source=26>
  0.5 천벌 → 0.5 태양섬광 → 1.4 달빛섬광 → 2.3 Solar Eclipse* → 2.8 천벌 → 3.7 자연의 군대 → 4.1 Potion of Recklessness* → 4.2 천체의 정렬 → 4.4 별빛쇄도 ×4 → 7.4 영혼 소집 → 11.5 별빛쇄도 ×2 → 12.9 천벌 → 13.7 별빛쇄도 → 14.4 천벌 ×2 → 16.0 별빛쇄도 → 16.8 천벌 ×3 → 19.2 태양섬광 → 20.0 천벌 ×3 → 22.5 Solar Eclipse* → 23.0 별빛쇄도 ×3 → 25.4 천벌
- ALL #5 EU Miikeulq 298초 <https://www.warcraftlogs.com/reports/Vvfcy8q7XhzxDkAj#fight=24&source=39>
  0.1 천벌 ×2 → 1.4 달빛섬광 → 2.3 태양섬광 → 2.8 Light's Potential* → 3.3 Solar Eclipse* → 3.8 천벌 → 4.3 Freightrunner's Flask* → 4.7 자연의 군대 → 5.0 천체의 정렬 → 5.4 별빛쇄도 ×2 → 6.5 나무 껍질 → 6.9 별빛쇄도 → 7.7 별빛섬광 → 8.4 별빛쇄도 → 9.2 영혼 소집 → 13.5 별빛쇄도 ×2 → 15.0 천벌 ×3 → 17.2 태양섬광 → 18.0 별빛쇄도 ×2 → 19.5 재생 → 20.2 천벌 ×4 → 23.7 Solar Eclipse* → 24.2 별빛쇄도
- ALL #6 US Recruitie 322초 <https://www.warcraftlogs.com/reports/7A9M8yf1r6t2qkcd#fight=20&source=21>
  0.8 천벌 → 0.8 태양섬광 → 1.8 자연의 군대 → 2.5 Potion of Recklessness* → 2.5 천체의 정렬 → 2.7 별빛쇄도 ×2 → 4.3 영혼 소집 → 8.4 별빛쇄도 ×4 → 11.6 별빛섬광 → 12.3 천벌 ×3 → 14.6 별빛쇄도 ×2 → 16.1 태양섬광 → 16.8 천벌 ×3 → 19.4 Solar Eclipse* → 19.9 별빛쇄도 → 20.8 천벌 ×3 → 23.3 별빛쇄도 → 24.1 천벌 ×2 → 25.8 별빛쇄도 → 26.6 천벌
- ALL #7 EU Boltxb 312초 <https://www.warcraftlogs.com/reports/rbPfxXjWnkdHBFqm#fight=23&source=1>
  0.4 달빛섬광 → 1.5 태양섬광 → 2.5 자연의 군대 → 3.2 Light's Potential* → 3.2 천체의 정렬 → 3.4 별빛쇄도 ×4 → 6.4 영혼 소집 → 10.7 별빛쇄도 ×2 → 12.2 천벌 ×3 → 14.7 별빛쇄도 → 15.4 천벌 ×3 → 17.7 별빛쇄도 → 18.6 천벌 → 19.4 태양섬광 → 20.2 천벌 ×2 → 21.8 Solar Eclipse* → 22.5 나무 껍질 → 22.8 별빛쇄도 ×3 → 25.0 천벌 ×2 → 26.8 야생의 돌진
- ALL #8 US Boomcant 308초 <https://www.warcraftlogs.com/reports/3MGr7fF96KdANway#fight=13&source=15>
  0.8 천벌 ×2 → 0.9 Solar Eclipse* → 2.3 태양섬광 → 3.2 달빛섬광 → 4.4 자연의 군대 → 4.8 천체의 정렬 → 4.8 Light's Potential* → 5.1 별빛쇄도 ×3 → 7.4 영혼 소집 → 11.9 별빛쇄도 ×2 → 13.4 천벌 ×3 → 15.7 별빛쇄도 ×3 → 18.1 천벌 ×3 → 20.5 태양섬광 → 21.3 천벌 ×3 → 23.9 Solar Eclipse* → 24.5 별빛쇄도 ×3 → 27.1 천벌
- KR #2 KR 펩시짱 295초 <https://www.warcraftlogs.com/reports/nHavrDhPVtBYkMXA#fight=43&source=11>
  0.4 천벌 → 0.4 태양섬광 → 1.6 자연의 군대 → 1.8 Light's Potential* → 2.1 천체의 정렬 → 2.5 별빛섬광 → 3.3 별빛쇄도 ×4 → 6.3 영혼 소집 → 10.4 천벌 → 11.2 별빛쇄도 → 11.9 천벌 ×3 → 14.2 별빛쇄도 ×2 → 15.7 천벌 → 16.5 태양섬광 → 17.2 천벌 ×2 → 18.0 Solar Eclipse* → 19.3 별빛쇄도 ×3 → 21.6 천벌 ×4 → 24.7 달빛섬광 → 25.5 별빛쇄도
- KR #3 KR 뿌솜이 365초 <https://www.warcraftlogs.com/reports/Gg1XC4dkL3Qv98y7#fight=36&source=12>
  0.1 천벌 → 0.1 태양섬광 → 1.4 달빛섬광 → 2.2 자연의 군대 → 2.6 천체의 정렬 → 3.0 별빛쇄도 ×3 → 3.2 Potion of Recklessness* → 5.2 영혼 소집 → 9.5 별빛쇄도 ×2 → 11.0 천벌 ×3 → 13.3 태양섬광 → 14.0 천벌 → 14.8 별빛쇄도 → 15.5 천벌 ×3 → 18.8 Solar Eclipse* → 19.3 별빛쇄도 ×2 → 21.1 천벌 → 21.9 별빛쇄도 ×2 → 23.5 천벌 ×4 → 26.9 야생의 돌진

## 반복 구간 예시 (130~175초, 같은 스킬 연속은 ×n)
- ALL #1 Hawked: 130.7 천벌 ×3 → 134.3 별빛쇄도 → 135.4 천벌 ×2 → 137.8 태양섬광 → 138.9 천벌 → 140.1 야생의 징표 → 141.1 천벌 → 142.2 달빛섬광 → 143.3 천벌 ×3 → 146.7 태양섬광 → 147.8 Solar Eclipse* → 148.3 별빛쇄도 ×2 → 150.4 천벌 → 151.5 별빛쇄도 → 152.5 천벌 → 153.8 야생의 돌진 → 154.6 별빛쇄도 → 155.3 나무 껍질 → 155.7 달빛섬광 → 156.8 천벌 ×2 → 159.1 별빛쇄도 → 160.3 달빛섬광 → 161.9 태양섬광 → 163.0 달빛섬광 → 164.1 별빛쇄도 → 165.3 태양섬광 → 166.7 천벌 ×2 → 168.9 달빛섬광 → 170.0 천벌 ×5
- ALL #2 Porlix: 130.5 별빛쇄도 → 131.7 달빛섬광 → 132.7 별빛쇄도 → 133.6 천벌 ×7 → 140.7 별빛쇄도 ×2 → 142.7 천벌 ×4 → 146.9 태양섬광 → 148.0 Solar Eclipse* → 148.6 별빛쇄도 ×4 → 152.7 천벌 → 153.9 야생의 돌진 → 154.2 별빛쇄도 ×2 → 156.2 달빛섬광 → 156.8 Healthstone* → 157.3 천벌 ×5 → 162.2 별빛쇄도 → 163.1 태양섬광 ×2 → 165.1 별빛쇄도 → 166.0 천벌 ×3 → 169.1 별빛쇄도 → 169.7 나무 껍질 → 170.2 천벌 ×4
- ALL #3 Lerepam: 130.8 천벌 → 132.0 Solar Eclipse* → 132.5 별빛쇄도 ×3 → 135.3 천벌 ×3 → 138.0 별빛쇄도 ×2 → 139.9 천벌 ×2 → 141.9 별빛쇄도 → 142.9 천벌 ×3 → 145.9 별빛쇄도 → 147.0 태양섬광 → 148.1 천벌 ×2 → 150.8 달빛섬광 → 151.9 천벌 ×2 → 154.3 야생의 돌진 → 154.6 태양섬광 → 155.9 천벌 ×2 → 158.4 Solar Eclipse* → 158.9 별빛쇄도 ×4 → 162.9 천벌 ×4 → 166.9 자연의 군대 → 167.7 별빛쇄도 ×2 → 169.6 천벌 ×3 → 173.6 태양섬광 → 174.6 별빛섬광
- ALL #4 Clecia: 130.7 천벌 ×2 → 132.7 Solar Eclipse* → 133.2 별빛쇄도 ×2 → 135.2 천벌 → 136.2 별빛쇄도 → 137.2 천벌 ×2 → 139.2 별빛쇄도 → 139.3 정신 자극 → 140.2 별빛쇄도 → 141.3 천벌 ×3 → 144.6 별빛쇄도 ×2 → 146.7 천벌 ×3 → 149.9 태양섬광 → 150.9 달빛섬광 → 152.0 천벌 ×2 → 154.1 별빛쇄도 → 154.9 나무 껍질 → 155.2 별빛쇄도 ×2 → 157.2 천벌 ×3 → 160.3 별빛쇄도 ×2 → 162.3 태양섬광 → 163.5 천벌 ×2 → 165.5 별빛쇄도 → 166.5 천벌 → 167.5 달빛섬광 → 168.5 태양섬광 → 170.0 천벌 ×2 → 173.0 자연의 군대 → 173.8 Solar Eclipse* → 174.3 별빛쇄도

## 반복 구간(풀 25초 뒤, 사잇단계 제외) 스킬별 '이어서 누른 횟수' — 묶음 수, 중앙값(25~75%), 분포
- 천벌(5176) 묶음 471개: 중앙값 2 (1~3) · 1번 174, 2번 142, 3번 87, 4번 33, 5번 23, 6+번 12
- 별빛쇄도(78674) 묶음 401개: 중앙값 1 (1~2) · 1번 238, 2번 106, 3번 38, 4번 15, 5번 4
- 태양섬광(93402) 묶음 182개: 중앙값 1 (1~1) · 1번 178, 2번 4
- 달빛섬광(8921) 묶음 129개: 중앙값 1 (1~1) · 1번 128, 2번 1
- 야생의 돌진(102401) 묶음 44개: 중앙값 1 (1~1) · 1번 44
- 자연의 군대(205636) 묶음 31개: 중앙값 1 (1~1) · 1번 31
- 나무 껍질(22812) 묶음 29개: 중앙값 1 (1~1) · 1번 29
- 재생(8936) 묶음 20개: 중앙값 1 (1~1) · 1번 20

원자료·다른 영웅 특성·지금 가이드 구조: ../sszorak-cycle-20261024/digests/druid-balance.md · 지난 판정: ../sszorak-cycle-20261024/reports/druid-balance.md · 심크 우선순위: ../sszorak-cycle-20261024/apl/ · 공개 가이드 발췌: ../sszorak-cycle-20261024/sources/druid-balance.txt · 지금 원고 보기: ../sszorak-cycle-20261024/views/druid-balance.json (예전 판일 수 있음 — 정본은 patches/orig/druid-balance.json)
