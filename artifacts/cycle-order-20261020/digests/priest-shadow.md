# priest-shadow — 딜사이클 순서 대조 자료
생성 2026-10-19T17:20:04.148Z · 로그: 12.1.5 이후 랭킹 상위(전 지역 상위 5 + KR 상위 3, 영웅 트리별) 시전 이벤트. 이름 뒤 * = KB에 없는 ID(WCL 영어 이름). [ ] = 캡션, {위: } = 위쪽 가지.
주의: 레이드는 독사의 심연 신화 님리사(쫄이 나오는 네임드)라 레이드 반복에도 광역기가 섞인다. 풀 5초보다 먼저 쓴 사전 준비(징표·버프 등)는 로그 창 밖이라 안 보인다. 쐐기 광역 풀 = 시전 간격 7초 넘게 끊긴 구간 중 첫 30회 대상이 4명 이상인 구간.
심크 APL: F:/01_프로젝트/90_개발/wowmeta/wow-meta-site/artifacts/cycle-order-20261020/apl/priest_shadow.simc (마지막 수정 2026-09-27 4c7c7362 Update Generated Files e5c4bc0)

## 1. 지금 가이드의 순서
### blocks[6] 첫 연습은 단일 대상: 지속 피해 → 광기 → 생성기 — 단일 딜사이클 타임라인
- rail "반복 흐름 — 단일 (두 영웅 공통)" (반복): 흡혈의 손길(34914)[끝나기 전 갱신] {위: 어둠의 권능: 고통(589) 깨어난 악몽이면 고통도} → 어둠의 권능: 광기(335467)[만료·넘침 전 소비] {위: 공허의 형상(228260) 배정한 극딜 구간이면} → 촉수 격돌(1227280)[충전이 가득 차면] {위: 공허 연사(1242173) 세트·종료 임박 사용권} → 정신 분열(8092)[충전을 묵히지 않기] → 정신의 채찍(15407)[빈 시간 채우기] {위: 어둠의 권능: 죽음(32379) 처형 조건이 맞으면} → 어둠의 권능: 광기(335467)[다음 생성 전 소비] → 정신 분열(8092)[돌아오면 다시] → 정신의 채찍(15407)[빈 시간]
  - note: 정해진 순서를 외우는 줄이 아닙니다. 위에서부터 조건을 확인하고 맞는 스킬 하나를 쓴 뒤 다시 판단합니다. 쓸 수 없는 스킬을 기다리며 멈추지 않습니다.
- rail "영웅 특성별로 끼워 넣는 것" kind=inserts: 후광(120644)[집정관 · 계속 칠 수 있을 때] → 정신의 채찍: 광기(391403)[집정관 · 후광 뒤 강화 채찍] → 공허 연사(1242173)[집정관 · 형상 끝나기 전] → 공허의 격류(263165)[공허술사 · 다음 격류] → 공허의 폭발(450983)[공허술사 · 균열 중 분열 대신] → 어둠의 권능: 죽음(32379)[공허술사 · 보호막 적에 죽음]
### blocks[7] 쿨기와 오프닝: 정신 분열을 풀 시각에 맞추고 형상 버튼을 비웁니다 — 오프닝 타임라인 (시즌 2 4세트·깨어난 악몽, 단일)
- rail "오프닝 — 집정관": 정신 분열(8092)[풀 시각에 적중] → 촉수 격돌(1227280)[교전 뒤 손길·세트] → 어둠의 권능: 고통(589)[깨어난 악몽이면] → 후광(120644)[교전·범위 확인] → 공허 연사(1242173)[4세트 사용권 처리] → 공허의 형상(228260)[극딜 진입] → 마력 주입(10060)[형상과 맞추기] → 어둠의 권능: 광기(335467)[이후 단일 우선순위]
  - note: 불행이면 고통 칸을, 4세트가 없으면 공허 연사 칸을 건너뜁니다. 후광은 주변 비전투 몹을 끌어오지 않을 위치인지 보고 씁니다.
- rail "오프닝 — 공허술사": 정신 분열(8092)[풀 시각에 적중] → 촉수 격돌(1227280)[교전 뒤 손길·세트] → 어둠의 권능: 고통(589)[깨어난 악몽이면] → 공허 연사(1242173)[4세트 사용권 처리] → 공허의 형상(228260)[연사 처리 뒤 진입] → 마력 주입(10060)[형상 구간] → 어둠의 권능: 광기(335467)[격류 받을 여유 만들기] → 공허의 격류(263165)[균열 열기]
  - note: 후광 대신 첫 광기 뒤 공허의 격류로 혼돈의 균열을 여는 것이 집정관과 다른 점입니다. 형상에 들어간다고 균열이 저절로 생기지는 않습니다.
### blocks[8] 광역은 손길을 펼친 뒤 주 대상 하나에 광기를 둡니다 — 광역 딜사이클 타임라인 (불행 기준)
- rail "광역 시작 — 집정관": 흡혈의 손길(34914)[모이는 동안 손길] {위: 소실(586) 위협 관리가 필요하면} → 촉수 격돌(1227280)[모이면 격돌] → 후광(120644)[교전 뒤 후광] → 공허 연사(1242173)[4세트 사용권 처리] → 공허의 형상(228260)[살아 있는 무리에] → 마력 주입(10060)[형상과 함께] → 어둠의 권능: 광기(335467)[주 대상에 광기]
  - note: 불행이면 손길로 고통도 같이 걸리니 대상마다 고통을 따로 쓰지 않습니다.
- rail "광역 시작 — 공허술사": 흡혈의 손길(34914)[모이는 동안 손길] → 촉수 격돌(1227280)[교전 뒤 격돌] → 공허 연사(1242173)[4세트 사용권 처리] → 공허의 형상(228260)[살아 있는 무리에] → 마력 주입(10060)[형상과 함께] → 어둠의 권능: 광기(335467)[주 대상에 광기] → 공허의 격류(263165)[모였을 때 균열]
  - note: 탱커가 이동하거나 몹이 바뀌면 주 대상을 다시 정합니다.
- rail "반복 흐름 — 광역 (두 영웅 공통)" (반복): 촉수 격돌(1227280)[안 걸린 적에 격돌] → 흡혈의 손길(34914)[빠진 장수명 적만] → 어둠의 권능: 광기(335467)[주 대상 광기 유지] {위: 공허의 형상(228260) 무리가 오래 살면} → 정신 분열(8092)[광기 대상에 분열] {위: 공허 연사(1242173) 세트·종료 임박 사용권} → 어둠의 권능: 광기(335467)[넘치기 전 소비] → 정신의 채찍(15407)[빈 시간 채찍]
  - note: 새 무리가 합류하면 맨 위 손길 적용부터 다시 봅니다. 차단이나 생존 대응이 필요하면 이 흐름을 멈춥니다.
- rail "영웅 특성별로 끼워 넣는 것" kind=inserts: 후광(120644)[집정관 · 교전 뒤 후광] → 정신의 채찍: 광기(391403)[집정관 · 원혼 보낼 강화 채찍] → 공허의 격류(263165)[공허술사 · 모였을 때 격류] → 공허의 폭발(450983)[공허술사 · 균열 안 폭발] → 어둠의 권능: 광기(335467)[공허술사 · 균열 중 직접 광기]
### heroBranches "집정관"
- opener: 1.정신 분열(8092) 2.촉수 격돌(1227280) 3.어둠의 권능: 고통(589) 4.후광(120644) 5.공허 연사(1242173) 6.공허의 형상(228260) 7.마력 주입(10060) 8.어둠의 권능: 광기(335467)
- singleTarget: 1.흡혈의 손길(34914) 2.어둠의 권능: 고통(589) 3.후광(120644) 4.공허의 형상(228260) 5.어둠의 권능: 광기(335467) 6.공허 연사(1242173) 7.촉수 격돌(1227280) 8.정신 분열(8092) 9.정신의 채찍: 광기(391403) 10.어둠의 권능: 죽음(32379) 11.정신의 채찍(15407)
- aoe: 1.촉수 격돌(1227280) 2.흡혈의 손길(34914) 3.후광(120644) 4.공허의 형상(228260) 5.어둠의 권능: 광기(335467) 6.공허 연사(1242173) 7.정신 분열(8092) 8.정신의 채찍: 광기(391403) 9.정신의 채찍(15407)
### heroBranches "공허술사"
- opener: 1.정신 분열(8092) 2.촉수 격돌(1227280) 3.어둠의 권능: 고통(589) 4.공허 연사(1242173) 5.공허의 형상(228260) 6.마력 주입(10060) 7.어둠의 권능: 광기(335467) 8.공허의 격류(263165)
- singleTarget: 1.흡혈의 손길(34914) 2.어둠의 권능: 고통(589) 3.공허의 형상(228260) 4.어둠의 권능: 죽음(32379) 5.어둠의 권능: 광기(335467) 6.공허의 폭발(450983) 7.공허 연사(1242173) 8.촉수 격돌(1227280) 9.공허의 격류(263165) 10.정신 분열(8092) 11.정신의 채찍(15407)
- aoe: 1.촉수 격돌(1227280) 2.흡혈의 손길(34914) 3.어둠의 권능: 광기(335467) 4.공허의 형상(228260) 5.공허의 격류(263165) 6.공허의 폭발(450983) 7.어둠의 권능: 광기(335467) 8.공허 연사(1242173) 9.정신 분열(8092) 10.정신의 채찍(15407)

## 2. 로그 — 집정관 (레이드 8개 · 쐐기 8개)
### 레이드 오프닝 (풀 −5초부터 첫 22회, 초 단위)
- ALL #1 CN 一之濑空 318초 <https://www.warcraftlogs.com/reports/fpmhYJX9gTtVDx4Z#fight=10&source=7>
  0.1 정신 분열 → 0.2 촉수 격돌 → 1.1 Shadowy Apparition* → 1.2 Shadowy Apparition* → 1.5 어둠의 권능: 고통 → 2.6 공허 연사 → 3.4 Shadowy Apparition* → 3.7 후광 → 4.6 공허의 형상 → 5.6 Potion of Recklessness* → 5.6 마력 주입 → 5.6 마력 주입 → 6.0 어둠의 권능: 광기 → 6.1 Shadowy Apparition* → 6.4 Shadowy Apparition* → 6.9 정신 분열 → 7.1 Shadowy Apparition* → 7.7 공허 연사 → 8.5 Shadowy Apparition* → 8.5 정신의 채찍: 광기 → 9.4 어둠의 권능: 광기 → 9.4 Shadowy Apparition*
- ALL #2 EU Grendini 285초 <https://www.warcraftlogs.com/reports/j369qgtaYZQBv2AK#fight=51&source=2>
  0.4 정신 분열 → 0.5 촉수 격돌 → 1.4 Shadowy Apparition* → 1.5 Shadowy Apparition* → 1.6 정신의 채찍 → 3.3 공허 연사 → 4.2 정신의 채찍 → 4.6 Shadowy Apparition* → 5.7 촉수 격돌 → 6.6 정신 분열 → 6.6 Shadowy Apparition* → 6.8 Shadowy Apparition* → 7.5 정신의 채찍 → 7.5 Shadowy Apparition* → 8.6 어둠의 권능: 광기 → 8.7 Shadowy Apparition* → 9.4 Shadowy Apparition* → 9.4 정신의 채찍 → 11.1 정신의 채찍 → 12.1 정신 분열 → 12.9 어둠의 권능: 광기 → 13.0 Shadowy Apparition*
- ALL #3 CN 阿婆请自重 334초 <https://www.warcraftlogs.com/reports/aW7qRBLGzM3bVDxQ#fight=34&source=1887>
  1.1 촉수 격돌 → 1.9 Shadowy Apparition* → 2.1 Shadowy Apparition* → 2.2 공허 연사 → 2.9 Shadowy Apparition* → 3.4 정신 분열 → 5.1 정신의 채찍 → 7.5 어둠의 권능: 광기 → 7.5 Shadowy Apparition* → 8.6 정신의 채찍 → 9.2 소실 → 9.6 정신 분열 → 9.9 Shadowy Apparition* → 10.5 정신의 채찍 → 12.4 Shadowy Apparition* → 13.9 촉수 격돌 → 14.8 Shadowy Apparition* → 14.8 공허 연사 → 14.9 Shadowy Apparition* → 15.7 어둠의 권능: 광기 → 15.7 Shadowy Apparition* → 16.6 정신 분열
- ALL #4 CN Utell 400초 <https://www.warcraftlogs.com/reports/AdfQVDNr8zLpaGPC#fight=7&source=23>
  0.6 정신 분열 → 0.6 촉수 격돌 → 1.4 Liquid Luster* → 1.5 Shadowy Apparition* → 1.7 Shadowy Apparition* → 1.8 후광 → 3.7 공허 연사 → 4.5 Shadowy Apparition* → 4.5 공허의 형상 → 5.6 Freightrunner's Flask* → 5.6 마력 주입 → 5.7 촉수 격돌 → 6.4 정신 분열 → 6.6 Shadowy Apparition* → 6.7 Shadowy Apparition* → 7.2 Shadowy Apparition* → 7.2 정신의 채찍: 광기 → 8.1 Shadowy Apparition* → 8.1 정신의 채찍: 광기 → 8.2 Shadowy Apparition* → 8.6 Shadowy Apparition* → 9.0 정신의 채찍
- ALL #5 EU Jorar 289초 <https://www.warcraftlogs.com/reports/4ZWGR8fpDk9yN3KL#fight=1&source=11>
  0.1 정신 분열 → 0.1 촉수 격돌 → 1.0 Shadowy Apparition* → 1.2 Shadowy Apparition* → 1.4 공허 연사 → 2.4 정신의 채찍 → 3.9 후광 → 4.5 Shadowy Apparition* → 4.9 공허의 형상 → 6.0 어둠의 권능: 광기 → 6.0 Shadowy Apparition* → 6.2 Vampiric Embrace* → 6.3 마력 주입 → 6.3 마력 주입 → 6.9 정신 분열 → 7.1 Shadowy Apparition* → 7.7 Shadowy Apparition* → 7.7 정신의 채찍: 광기 → 8.6 공허 연사 → 8.9 Potion of Recklessness* → 9.4 공허 연사 → 10.2 어둠의 권능: 광기
- KR #1 KR 박근수 271초 <https://www.warcraftlogs.com/reports/Dx4Y7r6H2kdtXRJw#fight=82&source=1560>
  0.3 촉수 격돌 → 1.2 Shadowy Apparition* → 1.4 Shadowy Apparition* → 1.5 공허 연사 → 2.8 정신 분열 → 3.7 후광 → 4.7 공허의 형상 → 5.6 공허 연사 → 6.2 마력 주입 → 6.2 마력 주입 → 6.5 흡혈의 손길 → 7.4 Potion of Recklessness* → 7.5 어둠의 권능: 광기 → 7.5 Shadowy Apparition* → 7.5 Shadowy Apparition* → 8.2 공허 연사 → 9.0 촉수 격돌 → 9.3 Shadowy Apparition* → 9.7 정신 분열 → 9.9 Shadowy Apparition* → 10.1 Shadowy Apparition* → 10.5 공허 연사
- KR #2 KR Yzis 356초 <https://www.warcraftlogs.com/reports/8bg9JVBD1dXTCfQK#fight=4&source=17>
  0.4 정신 분열 → 0.5 촉수 격돌 → 1.4 Shadowy Apparition* → 1.5 어둠의 권능: 고통 → 1.6 Shadowy Apparition* → 2.4 공허 연사 → 2.7 Shadowy Apparition* → 2.8 Potion of Recklessness* → 3.3 후광 → 4.3 공허의 형상 → 5.3 Hex Lord's Doom* → 5.6 마력 주입 → 5.6 마력 주입 → 6.0 Shadowy Apparition* → 6.2 촉수 격돌 → 7.0 정신 분열 → 7.1 Shadowy Apparition* → 7.3 Shadowy Apparition* → 7.7 어둠의 권능: 광기 → 7.8 Shadowy Apparition* → 7.8 Shadowy Apparition* → 8.5 공허 연사
- KR #3 KR 특임시마주테러함 279초 <https://www.warcraftlogs.com/reports/Jwxdqy3Hpa2cXLYG#fight=1&source=13>
  0.8 정신 분열 → 0.8 촉수 격돌 → 1.7 Shadowy Apparition* → 1.7 Potion of Recklessness* → 1.8 Shadowy Apparition* → 2.3 공허 연사 → 3.2 후광 → 4.2 공허의 형상 → 5.0 Shadowy Apparition* → 5.1 Vampiric Embrace* → 5.1 공허 연사 → 5.2 Living Flame* → 6.0 어둠의 권능: 광기 → 6.0 Shadowy Apparition* → 6.2 Shadowy Apparition* → 6.3 마력 주입 → 6.9 정신 분열 → 7.7 공허 연사 → 8.4 Shadowy Apparition* → 8.4 정신의 채찍: 광기 → 9.3 공허 연사 → 10.1 Shadowy Apparition*
### 레이드 반복(풀 25초 이후) — 분당 시전(전투 평균)
  Shadowy Apparition*(341263) 41.1 · 어둠의 권능: 광기(335467) 9.1 · 정신의 채찍(15407) 8.6 · 공허 연사(1242173) 6.9 · 정신 분열(8092) 6.2 · 촉수 격돌(1227280) 5.1 · 정신의 채찍: 광기(391403) 3.8 · 신의 권능: 보호막(17) 1.9 · 어둠의 권능: 죽음(32379) 1.5 · 흡혈의 손길(34914) 1.1 · 소실(586) 1.0 · 후광(120644) 0.9 · 천사의 깃털(121536) 0.9 · 마력 주입(10060) 0.7 · 구원의 기도(19236) 0.5 · 어둠의 권능: 고통(589) 0.5 · 공허의 형상(228260) 0.4
### 레이드 반복 — 바로 다음에 누른 스킬(상위 3, 10회 이상)
- Shadowy Apparition* (1585) → Shadowy Apparition* 35%, 공허 연사 11%, 정신의 채찍 11%
- 어둠의 권능: 광기 (354) → Shadowy Apparition* 99%, 공허 연사 0%, 정신 분열 0%
- 정신의 채찍 (328) → Shadowy Apparition* 41%, 어둠의 권능: 광기 16%, 정신 분열 13%
- 공허 연사 (266) → Shadowy Apparition* 40%, 어둠의 권능: 광기 21%, 정신 분열 10%
- 정신 분열 (239) → Shadowy Apparition* 31%, 정신의 채찍 26%, 어둠의 권능: 광기 12%
- 촉수 격돌 (195) → Shadowy Apparition* 90%, 공허 연사 4%, 어둠의 권능: 광기 2%
- 정신의 채찍: 광기 (146) → Shadowy Apparition* 57%, 어둠의 권능: 광기 14%, 정신 분열 8%
- 신의 권능: 보호막 (74) → Shadowy Apparition* 30%, 촉수 격돌 24%, 어둠의 권능: 광기 15%
- 어둠의 권능: 죽음 (56) → Shadowy Apparition* 27%, 정신의 채찍 23%, 어둠의 권능: 광기 20%
- 흡혈의 손길 (45) → Shadowy Apparition* 29%, 흡혈의 손길 27%, 정신의 채찍 11%
- 소실 (38) → 정신의 채찍 24%, Shadowy Apparition* 18%, 구원의 기도 16%
- 후광 (36) → Shadowy Apparition* 39%, 공허의 형상 19%, 신의 권능: 보호막 8%
- 천사의 깃털 (34) → 촉수 격돌 47%, Shadowy Apparition* 21%, 어둠의 권능: 고통 9%
- 마력 주입 (28) → 마력 주입 39%, 어둠의 권능: 광기 36%, Shadowy Apparition* 11%
- 구원의 기도 (20) → Shadowy Apparition* 40%, 소실 25%, 정신의 채찍 20%
- 어둠의 권능: 고통 (20) → Shadowy Apparition* 45%, 정신의 채찍 10%, 어둠의 권능: 죽음 10%
- 공허의 형상 (17) → 공허 연사 29%, Shadowy Apparition* 29%, 마력 주입 18%
### 레이드 반복 예시 (최상위 전투 90~135초)
  90.2 정신의 채찍 → 91.4 Shadowy Apparition* → 91.5 어둠의 권능: 죽음 → 93.5 신의 권능: 보호막 → 94.8 촉수 격돌 → 95.7 Shadowy Apparition* → 95.9 Shadowy Apparition* → 96.1 공허 연사 → 97.2 어둠의 권능: 광기 → 97.2 Shadowy Apparition* → 98.4 영혼의 절규 → 99.2 Shadowy Apparition* → 100.3 정신의 채찍 → 102.6 어둠의 권능: 광기 → 102.6 Shadowy Apparition* → 103.8 정신 분열 → 105.0 신의 권능: 보호막 → 105.2 Shadowy Apparition* → 106.1 정신의 채찍 → 107.9 흡혈의 손길 → 110.5 천사의 깃털 → 111.6 촉수 격돌 → 112.5 Shadowy Apparition* → 112.7 Shadowy Apparition* → 112.7 공허 연사 → 114.2 정신의 채찍 → 115.2 Shadowy Apparition* → 115.4 정신 분열 → 117.0 정신의 채찍 → 118.6 정신의 채찍 → 119.8 Shadowy Apparition* → 120.3 어둠의 권능: 광기 → 120.3 Shadowy Apparition* → 121.7 정신의 채찍 → 122.2 Shadowy Apparition* → 123.0 신의 권능: 인내 → 124.2 정신 분열 → 125.5 흡혈의 손길 → 126.8 후광 → 127.1 Shadowy Apparition* → 128.0 공허의 형상 → 129.4 마력 주입 → 129.5 마력 주입 → 129.9 어둠의 권능: 광기 → 129.9 Shadowy Apparition* → 130.7 Shadowy Apparition* → 130.8 공허 연사 → 130.8 Shadowy Apparition* → 131.7 공허 연사 → 132.7 공허 연사
### 쐐기 광역 풀(적 4명 이상) — 분당 시전 · (레이드 대비 배율)
  Shadowy Apparition*(341263) 40.0 (×1.0) · 어둠의 권능: 광기(335467) 8.6 (×0.9) · 정신의 채찍(15407) 7.2 (×0.8) · 공허 연사(1242173) 7.0 (×1.0) · 정신 분열(8092) 6.8 (×1.1) · 촉수 격돌(1227280) 5.0 (×1.0) · 정신의 채찍: 광기(391403) 3.7 (×1.0) · 신의 권능: 보호막(17) 1.9 (×1.0) · 어둠의 권능: 죽음(32379) 1.8 (×1.2) · 소실(586) 1.4 (×1.4) · 흡혈의 손길(34914) 1.3 (×1.2) · 마력 주입(10060) 1.0 (×1.3) · 후광(120644) 0.9 (×1.0) · 천사의 깃털(121536) 0.8 (×0.9) · 침묵(15487) 0.7 (×레이드 0) · 구원의 기도(19236) 0.6 (×1.1) · 공허의 형상(228260) 0.5 (×1.2) · Vampiric Embrace*(15286) 0.5 (×3.7) · 영혼의 절규(8122) 0.3 (×3.2) · 순간 치유(2061) 0.2 (×레이드 0) · Glide*(358733) 0.2 (×2.8)
### 쐐기 광역 풀 시작 순서 (첫 16회)
- ALL #4 +21 于笙 풀 1.6초 대상 4: 신의 권능: 보호막 → 신의 권능: 인내 → 순간 치유 → 신의 권능: 보호막 → 천사의 깃털 → 소실 → 흡혈의 손길 → 흡혈의 손길 → 흡혈의 손길 → 흡혈의 손길 → 흡혈의 손길 → Liquid Luster* → 구원의 기도 → 흡혈의 손길 → Shadowy Apparition* → 흡혈의 손길
- ALL #4 +21 于笙 풀 173.3초 대상 4: 신의 권능: 보호막 → 천사의 깃털 → 신의 권능: 보호막 → 천사의 깃털 → 후광 → 촉수 격돌 → Shadowy Apparition* → Shadowy Apparition* → 촉수 격돌 → Shadowy Apparition* → Shadowy Apparition* → 정신 분열 → Shadowy Apparition* → 공허 연사 → 공허 연사 → Hex Lord's Doom*
- ALL #7 +20 Twicks 풀 1.6초 대상 4: 순간 치유 → 신의 권능: 인내 → 순간 치유 → 천사의 깃털 → 촉수 격돌 → Shadowy Apparition* → Shadowy Apparition* → 신의 권능: 보호막 → Shadowy Apparition* → 흡혈의 손길 → 흡혈의 손길 → 소실 → 공허 연사 → 후광 → Shadowy Apparition* → 공허의 형상
- ALL #10 +20 Konsta 풀 16.9초 대상 4: 신의 권능: 보호막 → 천사의 깃털 → 흡혈의 손길 → 흡혈의 손길 → 흡혈의 손길 → 흡혈의 손길 → 흡혈의 손길 → Shadowy Apparition* → 흡혈의 손길 → 촉수 격돌 → Shadowy Apparition* → Shadowy Apparition* → Liquid Luster* → 침묵 → 촉수 격돌 → Shadowy Apparition*
- ALL #11 +20 Reckxican 풀 8.9초 대상 5: 천사의 깃털 → 촉수 격돌 → Shadowy Apparition* → Shadowy Apparition* → 신의 권능: 보호막 → Shadowy Apparition* → 흡혈의 손길 → 흡혈의 손길 → 흡혈의 손길 → 흡혈의 손길 → 촉수 격돌 → Shadowy Apparition* → Shadowy Apparition* → 공허 연사 → 어둠의 권능: 광기 → Shadowy Apparition*
- ALL #15 +20 丁悄悄丶 풀 9.1초 대상 4: 신의 권능: 보호막 → 천사의 깃털 → Glide* → Glide* → 흡혈의 손길 → 흡혈의 손길 → 후광 → Shadowy Apparition* → 촉수 격돌 → Shadowy Apparition* → Shadowy Apparition* → 소실 → 촉수 격돌 → Shadowy Apparition* → 공허 연사 → Shadowy Apparition*
- KR #15 +17 세체빛 풀 26.6초 대상 4: 촉수 격돌 → Shadowy Apparition* → Shadowy Apparition* → 촉수 격돌 → Shadowy Apparition* → Shadowy Apparition* → 정신 분열 → Shadowy Apparition* → 후광 → 공허 연사 → 공허 연사 → Shadowy Apparition* → 공허의 형상 → Vampiric Embrace* → 마력 주입 → 마력 주입

## 2. 로그 — 공허술사 (레이드 1개 · 쐐기 6개)
### 레이드 오프닝 (풀 −5초부터 첫 22회, 초 단위)
- ALL #80 EU Surania 403초 <https://www.warcraftlogs.com/reports/TBRCFQGrdhzfb3P2#fight=16&source=232>
  1.2 공허의 형상 → 2.4 마력 주입 → 2.4 Shadowy Apparition* → 2.5 Freightrunner's Flask* → 3.1 Draught of Rampant Abandon* → 3.8 촉수 격돌 → 4.6 촉수 격돌 → 4.8 Shadowy Apparition* → 5.4 공허의 격류 → 5.5 Shadowy Apparition* → 5.7 Shadowy Apparition* → 6.8 Shadowy Apparition* → 8.6 어둠의 권능: 광기 → 8.6 Shadowy Apparition* → 8.7 Shadowy Apparition* → 9.5 공허의 폭발 → 9.5 Shadowy Apparition* → 10.2 공허의 폭발 → 10.9 공허 연사 → 11.7 Shadowy Apparition* → 11.7 공허 연사 → 12.5 어둠의 권능: 광기
### 레이드 반복(풀 25초 이후) — 분당 시전(전투 평균)
  Shadowy Apparition*(341263) 43.9 · 어둠의 권능: 광기(335467) 8.9 · 정신 분열(8092) 7.6 · 정신의 채찍(15407) 6.4 · 공허 연사(1242173) 6.4 · 촉수 격돌(1227280) 4.9 · 공허의 폭발(450983) 2.7 · 신의 권능: 보호막(17) 2.4 · 공허의 격류(263165) 1.9 · 어둠의 권능: 죽음(32379) 1.6 · 흡혈의 손길(34914) 0.8 · 소실(586) 0.6 · 공허의 형상(228260) 0.5 · 마력 주입(10060) 0.5 · Freightrunner's Flask*(1250533) 0.5 · 구원의 기도(19236) 0.3 · Vampiric Embrace*(15286) 0.2 · Draught of Rampant Abandon*(1236998) 0.2 · Healthstone*(6262) 0.2 · Concentrated Silvermoon Health Potion*(1295247) 0.2 · 신의의 도약(73325) 0.2
### 레이드 반복 — 바로 다음에 누른 스킬(상위 3, 10회 이상)
- Shadowy Apparition* (276) → Shadowy Apparition* 36%, 공허 연사 13%, 정신 분열 12%
- 어둠의 권능: 광기 (56) → Shadowy Apparition* 100%
- 정신 분열 (48) → Shadowy Apparition* 33%, 정신의 채찍 17%, 정신 분열 15%
- 정신의 채찍 (40) → Shadowy Apparition* 48%, 어둠의 권능: 광기 18%, 정신 분열 13%
- 공허 연사 (40) → Shadowy Apparition* 55%, 어둠의 권능: 광기 18%, 공허의 폭발 5%
- 촉수 격돌 (31) → Shadowy Apparition* 94%, Healthstone* 3%, 어둠의 권능: 광기 3%
- 공허의 폭발 (17) → Shadowy Apparition* 47%, 어둠의 권능: 광기 29%, 공허의 폭발 6%
- 신의 권능: 보호막 (15) → 촉수 격돌 47%, Shadowy Apparition* 40%, 흡혈의 손길 7%
- 공허의 격류 (12) → Shadowy Apparition* 75%, 어둠의 권능: 광기 25%
### 레이드 반복 예시 (최상위 전투 90~135초)
  90.1 Shadowy Apparition* → 90.3 Shadowy Apparition* → 90.4 공허 연사 → 91.5 Shadowy Apparition* → 92.1 정신 분열 → 93.1 어둠의 권능: 광기 → 93.1 Shadowy Apparition* → 94.1 정신의 채찍 → 94.5 Shadowy Apparition* → 95.2 정신 분열 → 96.2 정신 분열 → 98.0 정신의 채찍 → 98.3 Shadowy Apparition* → 99.1 공허의 격류 → 99.1 Shadowy Apparition* → 102.0 촉수 격돌 → 102.9 Shadowy Apparition* → 102.9 Shadowy Apparition* → 103.0 Shadowy Apparition* → 103.1 어둠의 권능: 광기 → 103.1 Shadowy Apparition* → 104.2 Shadowy Apparition* → 104.2 공허 연사 → 105.3 공허의 폭발 → 106.5 어둠의 권능: 광기 → 106.5 Shadowy Apparition* → 107.4 Shadowy Apparition* → 107.6 공허의 폭발 → 107.6 Shadowy Apparition* → 108.8 정신의 채찍 → 110.7 어둠의 권능: 광기 → 110.7 Shadowy Apparition* → 111.1 Shadowy Apparition* → 111.9 촉수 격돌 → 112.8 Shadowy Apparition* → 112.9 Shadowy Apparition* → 113.0 어둠의 권능: 죽음 → 113.3 Shadowy Apparition* → 114.0 공허 연사 → 115.1 정신 분열 → 116.9 정신의 채찍 → 117.5 Shadowy Apparition* → 118.0 어둠의 권능: 광기 → 118.0 Shadowy Apparition* → 118.0 Shadowy Apparition* → 119.6 Shadowy Apparition* → 120.0 정신 분열 → 121.5 소실 → 122.6 정신의 채찍 → 123.7 공허의 형상 → 124.7 마력 주입 → 124.8 Shadowy Apparition* → 124.8 Freightrunner's Flask* → 125.7 촉수 격돌 → 126.6 Shadowy Apparition* → 126.7 공허 연사 → 126.8 Shadowy Apparition* → 127.6 어둠의 권능: 광기 → 127.6 Shadowy Apparition* → 127.6 Shadowy Apparition* → 127.6 Shadowy Apparition* → 128.5 정신 분열 → 129.3 Shadowy Apparition* → 129.4 정신 분열 → 130.3 공허의 격류 → 132.3 Shadowy Apparition* → 133.6 어둠의 권능: 광기 → 133.6 Shadowy Apparition* → 134.4 공허 연사 → 134.5 Shadowy Apparition*
### 쐐기 광역 풀(적 4명 이상) — 분당 시전 · (레이드 대비 배율)
  Shadowy Apparition*(341263) 41.6 (×0.9) · 어둠의 권능: 광기(335467) 8.4 (×0.9) · 공허 연사(1242173) 6.3 (×1.0) · 정신 분열(8092) 5.6 (×0.7) · 촉수 격돌(1227280) 4.8 (×1.0) · 어둠의 권능: 고통(589) 4.7 (×레이드 0) · 공허의 폭발(450983) 4.7 (×1.7) · 정신의 채찍(15407) 4.4 (×0.7) · 어둠의 권능: 죽음(32379) 2.0 (×1.2) · 공허의 격류(263165) 1.6 (×0.8) · 신의 권능: 보호막(17) 1.3 (×0.5) · 소실(586) 1.2 (×1.9) · 흡혈의 손길(34914) 1.0 (×1.2) · 침묵(15487) 0.9 (×레이드 0) · 천사의 깃털(121536) 0.7 (×레이드 0) · 마력 주입(10060) 0.6 (×1.3) · 구원의 기도(19236) 0.5 (×1.5) · 공허의 형상(228260) 0.4 (×0.9) · 영혼의 절규(8122) 0.4 (×레이드 0) · 신의 권능: 인내(21562) 0.3 (×레이드 0) · Vampiric Embrace*(15286) 0.2 (×1.4) · Glide*(358733) 0.2 (×레이드 0) · 순간 치유(2061) 0.2 (×레이드 0)
### 쐐기 광역 풀 시작 순서 (첫 16회)
- ALL #20 +20 Robenlly 풀 9.1초 대상 5: 신의 권능: 보호막 → 어둠의 권능: 고통 → Shadowy Apparition* → 어둠의 권능: 고통 → 어둠의 권능: 고통 → 어둠의 권능: 고통 → Shadowy Apparition* → 어둠의 권능: 고통 → 촉수 격돌 → Shadowy Apparition* → Shadowy Apparition* → 어둠의 권능: 고통 → Shadowy Apparition* → 어둠의 권능: 고통 → 어둠의 권능: 고통 → 어둠의 권능: 고통
- ALL #23 +20 暗中灯 풀 9.6초 대상 4: Glide* → Glide* → 소실 → 촉수 격돌 → Glide* → Shadowy Apparition* → Shadowy Apparition* → 어둠의 권능: 고통 → 어둠의 권능: 고통 → 흡혈의 손길 → 어둠의 권능: 고통 → 촉수 격돌 → Shadowy Apparition* → Shadowy Apparition* → Shadowy Apparition* → 어둠의 권능: 고통
- ALL #49 +19 Mazzu 풀 10.0초 대상 5: 소실 → 신의 권능: 보호막 → 순간 치유 → 신의 권능: 보호막 → 순간 치유 → 흡혈의 손길 → 흡혈의 손길 → 흡혈의 손길 → 흡혈의 손길 → 촉수 격돌 → Shadowy Apparition* → Shadowy Apparition* → Shadowy Apparition* → 촉수 격돌 → Shadowy Apparition* → Shadowy Apparition*
- ALL #58 +19 Cahraela 풀 20.2초 대상 6: 천사의 깃털 → 소실 → 어둠의 권능: 고통 → Shadowy Apparition* → 어둠의 권능: 고통 → 어둠의 권능: 고통 → 어둠의 권능: 고통 → 어둠의 권능: 고통 → 어둠의 권능: 고통 → Shadowy Apparition* → Potion of Recklessness* → 어둠의 권능: 고통 → 어둠의 권능: 고통 → 어둠의 권능: 고통 → Shadowy Apparition* → 침묵
- ALL #67 +19 Shuckmanp 풀 8.4초 대상 6: 신의 권능: 인내 → 천사의 깃털 → 흡혈의 손길 → Shadowy Apparition* → 촉수 격돌 → Shadowy Apparition* → Shadowy Apparition* → 공허 연사 → 신의 권능: 보호막 → 소실 → 천사의 깃털 → 흡혈의 손길 → 어둠의 권능: 고통 → 촉수 격돌 → Shadowy Apparition* → Shadowy Apparition*
- KR #11 +18 Mactaylor 풀 20.5초 대상 4: 천사의 깃털 → 촉수 격돌 → Shadowy Apparition* → 촉수 격돌 → Shadowy Apparition* → 공허 연사 → Shadowy Apparition* → Shadowy Apparition* → Shadowy Apparition* → 공허 연사 → 흡혈의 손길 → 공허의 형상 → Shadowy Apparition* → Shadowy Apparition* → 공허 연사 → 공허 연사

## 3. 자동 대조 표시 (판단은 사람이 — 순서 근거로 쓰기 전에 위 원자료를 볼 것)
- 집정관 오프닝(영웅 탭) 각 단계가 로그 오프닝 몇 번째에 처음 나오나(중앙값, 나온 전투 수/8): 정신 분열=1(8), 촉수 격돌=2(8), 어둠의 권능: 고통=5(2), 후광=7(6), 공허 연사=6(8), 공허의 형상=9(6), 마력 주입=12(6), 어둠의 권능: 광기=13(7)
  - 레이드에서 분당 1회 이상인데 영웅 탭 단일 우선순위에 없음: 신의 권능: 보호막(17) 1.91/분, 소실(586) 1/분
  - 쐐기 광역에서 분당 1회 이상인데 영웅 탭 광역 우선순위에 없음: 신의 권능: 보호막(17) 1.92/분, 소실(586) 1.36/분, 어둠의 권능: 죽음(32379) 1.82/분
  - [집정관] 단일 반복 rail "반복 흐름 — 단일 (두 영웅 공통)" 이웃 쌍: A 뒤 3회 안에 B가 오는 비율 / B 뒤 3회 안에 A: 흡혈의 손길→어둠의 권능: 광기 22% / 반대 1% · 어둠의 권능: 광기→촉수 격돌 10% / 반대 16% · 촉수 격돌→정신 분열 10% / 반대 13% · 정신 분열→정신의 채찍 45% / 반대 25% · 정신의 채찍→어둠의 권능: 광기 44% / 반대 29% · 어둠의 권능: 광기→정신 분열 18% / 반대 36% · 정신 분열→정신의 채찍 45% / 반대 25%
- 공허술사 오프닝(영웅 탭) 각 단계가 로그 오프닝 몇 번째에 처음 나오나(중앙값, 나온 전투 수/1): 정신 분열=없음(0), 촉수 격돌=6(1), 어둠의 권능: 고통=없음(0), 공허 연사=19(1), 공허의 형상=1(1), 마력 주입=2(1), 어둠의 권능: 광기=13(1), 공허의 격류=9(1)
  - 순서 뒤바뀜(가이드 앞 → 로그에선 뒤): 촉수 격돌→공허의 형상, 촉수 격돌→마력 주입, 공허 연사→공허의 형상, 공허 연사→마력 주입, 공허 연사→어둠의 권능: 광기, 공허 연사→공허의 격류, 어둠의 권능: 광기→공허의 격류
  - 영웅 탭 오프닝에 있는데 로그 첫 22회에 한 번도 없음: 정신 분열, 어둠의 권능: 고통
  - 레이드에서 분당 1회 이상인데 영웅 탭 단일 우선순위에 없음: 신의 권능: 보호막(17) 2.39/분
  - 영웅 탭 단일 우선순위에 있는데 레이드 로그 분당 0.1 미만(다른 ID로 찍히는지 확인): 어둠의 권능: 고통(589) 0/분
  - 쐐기 광역에서 분당 1회 이상인데 영웅 탭 광역 우선순위에 없음: 신의 권능: 보호막(17) 1.27/분, 소실(586) 1.22/분, 어둠의 권능: 고통(589) 4.71/분, 어둠의 권능: 죽음(32379) 1.97/분
  - [공허술사] 단일 반복 rail "반복 흐름 — 단일 (두 영웅 공통)" 이웃 쌍: A 뒤 3회 안에 B가 오는 비율 / B 뒤 3회 안에 A: 흡혈의 손길→어둠의 권능: 광기 60% / 반대 2% · 어둠의 권능: 광기→촉수 격돌 7% / 반대 3% · 촉수 격돌→정신 분열 0% / 반대 10% · 정신 분열→정신의 채찍 42% / 반대 30% · 정신의 채찍→어둠의 권능: 광기 38% / 반대 23% · 어둠의 권능: 광기→정신 분열 18% / 반대 31% · 정신 분열→정신의 채찍 42% / 반대 30%
