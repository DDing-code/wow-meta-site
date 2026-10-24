# priest-shadow — 스조라크 단일 딜사이클 대조 자료
생성 2026-10-24T00:05:54.154Z · 로그: 독사의 심연 신화 스조라크(3420), WCL 12.1.5 구간 랭킹 상위(영웅 트리별 전 지역 상위 8 + KR 상위 3) 시전 이벤트, 풀 8초 전부터. 이름 뒤 * = KB에 없는 ID(WCL 영어 이름). [ ] = 캡션, {위: } = 위쪽 가지.
랭킹 영웅 특성 분포(12.1.5 구간 상위 행): ALL 199행: 집정관 45, 공허술사 154 / KR 99행: 집정관 25, 공허술사 74
주의: 스조라크는 단일 네임드다. 밀어내기 사잇단계(대략 100~125초, 227~252초)에는 이동·구슬 처리로 딜이 끊길 수 있어 반복 통계에서 뺐다. 풀 전(음수 초)은 로그에 남은 사전 시전만 보인다 — 버프·징표·소환수 등 로그 창 밖 준비는 심크 우선순위 precombat와 공개 가이드로 판단한다.
심크 우선순위(APL): F:/01_프로젝트/90_개발/wowmeta/wow-meta-site/artifacts/sszorak-cycle-20261024/apl/priest_shadow.simc (마지막 수정 2026-09-27 4c7c7362)
공개 가이드 오프닝·프리풀 발췌: F:/01_프로젝트/90_개발/wowmeta/wow-meta-site/artifacts/sszorak-cycle-20261024/sources/priest-shadow.txt (원본 HTML 같은 폴더 -icy.html / -method.html)

## 1. 지금 가이드의 단일·오프닝 순서
### blocks[6] (drill) 첫 연습은 단일 대상: 지속 피해 → 광기 → 생성기 — 단일 딜사이클 타임라인
- rail "반복 흐름 — 단일 (두 영웅 공통)" (반복): 흡혈의 손길(34914)[끝나기 전 갱신] {위: 어둠의 권능: 고통(589) 깨어난 악몽이면 고통도} → 어둠의 권능: 광기(335467)[만료·넘침 전 소비] {위: 공허의 형상(228260) 배정한 극딜 구간이면} → 촉수 격돌(1227280)[충전이 가득 차면] {위: 공허 연사(1242173) 세트·종료 임박 사용권} → 정신 분열(8092)[충전을 묵히지 않기] → 정신의 채찍(15407)[빈 시간 채우기] {위: 어둠의 권능: 죽음(32379) 처형 조건이 맞으면} → 어둠의 권능: 광기(335467)[다음 생성 전 소비] → 정신 분열(8092)[돌아오면 다시] → 정신의 채찍(15407)[빈 시간]
  - note: 정해진 순서를 외우는 줄이 아닙니다. 위에서부터 조건을 확인하고 맞는 스킬 하나를 쓴 뒤 다시 판단합니다. 쓸 수 없는 스킬을 기다리며 멈추지 않습니다.
- rail "영웅 특성별로 끼워 넣는 것" kind=inserts: 후광(120644)[집정관 · 계속 칠 수 있을 때] → 정신의 채찍: 광기(391403)[집정관 · 후광 뒤 강화 채찍] → 공허 연사(1242173)[집정관 · 형상 끝나기 전] → 공허의 격류(263165)[공허술사 · 다음 격류] → 공허의 폭발(450983)[공허술사 · 균열 중 분열 대신] → 어둠의 권능: 죽음(32379)[공허술사 · 보호막 적에 죽음]
### blocks[7] (drill) 쿨기와 오프닝: 정신 분열을 풀 시각에 맞추고 형상 버튼을 비웁니다 — 오프닝 타임라인 (시즌 2 4세트·깨어난 악몽, 단일)
- rail "오프닝 — 집정관": 정신 분열(8092)[풀 시각에 적중] → 촉수 격돌(1227280)[교전 뒤 손길·세트] → 어둠의 권능: 고통(589)[깨어난 악몽이면] → 공허 연사(1242173)[격돌 뒤 세트 연사] → 후광(120644)[형상 직전 후광] → 공허의 형상(228260)[극딜 진입] → 마력 주입(10060)[형상과 맞추기] → 어둠의 권능: 광기(335467)[이후 단일 우선순위]
  - note: 불행이면 고통 칸을, 4세트가 없으면 공허 연사 칸을 건너뜁니다. 후광은 주변 비전투 몹을 끌어오지 않을 위치인지 보고 씁니다.
- rail "오프닝 — 공허술사": 정신 분열(8092)[풀 시각에 적중] → 촉수 격돌(1227280)[교전 뒤 손길·세트] → 어둠의 권능: 고통(589)[깨어난 악몽이면] → 공허 연사(1242173)[4세트 사용권 처리] → 공허의 형상(228260)[연사 처리 뒤 진입] → 마력 주입(10060)[형상 구간] → 어둠의 권능: 광기(335467)[격류 받을 여유 만들기] → 공허의 격류(263165)[균열 열기]
  - note: 후광 대신 첫 광기 뒤 공허의 격류로 혼돈의 균열을 여는 것이 집정관과 다른 점입니다. 형상에 들어간다고 균열이 저절로 생기지는 않습니다.
### blocks[8] 광역은 손길을 펼친 뒤 주 대상 하나에 광기를 둡니다 — 광역 딜사이클 타임라인 (불행 기준) (광역: 이번 범위 아님, 생략)
### heroBranches "집정관"
- opener: 1.정신 분열(8092)[전투 직전] 2.촉수 격돌(1227280)[전투 시작] 3.어둠의 권능: 고통(589)[지속 피해] 4.공허 연사(1242173)[격돌 직후] 5.후광(120644)[형상 직전] 6.공허의 형상(228260)[극딜 진입] 7.마력 주입(10060)[극딜 정렬] 8.어둠의 권능: 광기(335467)[유지 시작]
- singleTarget: 1.흡혈의 손길(34914) 2.어둠의 권능: 고통(589) 3.후광(120644) 4.공허의 형상(228260) 5.어둠의 권능: 광기(335467) 6.공허 연사(1242173) 7.촉수 격돌(1227280) 8.정신 분열(8092) 9.정신의 채찍: 광기(391403) 10.어둠의 권능: 죽음(32379) 11.정신의 채찍(15407)
### heroBranches "공허술사"
- opener: 1.정신 분열(8092)[전투 직전] 2.촉수 격돌(1227280)[전투 시작] 3.어둠의 권능: 고통(589)[지속 피해] 4.공허 연사(1242173)[형상 전] 5.공허의 형상(228260)[극딜 진입] 6.마력 주입(10060)[극딜 정렬] 7.어둠의 권능: 광기(335467)[균열 준비] 8.공허의 격류(263165)[균열 시작]
- singleTarget: 1.흡혈의 손길(34914) 2.어둠의 권능: 고통(589) 3.공허의 형상(228260) 4.어둠의 권능: 죽음(32379) 5.어둠의 권능: 광기(335467) 6.공허의 폭발(450983) 7.공허 연사(1242173) 8.촉수 격돌(1227280) 9.공허의 격류(263165) 10.정신 분열(8092) 11.정신의 채찍(15407)

## 2. 스조라크 로그 — 집정관 (8개)
### 풀 전(0초 전) 사전 시전 — 전투 수/8
  없음
### 오프닝 (풀 −8초부터 첫 24회)
- ALL #1 EU Grendini 305초 <https://www.warcraftlogs.com/reports/f7vhCg28Km3TrYcj#fight=37&source=6>
  0.1 정신 분열 → 0.2 촉수 격돌 → 1.1 Shadowy Apparition* → 1.3 Shadowy Apparition* → 1.4 어둠의 권능: 고통 → 2.3 후광 → 2.7 Shadowy Apparition* → 3.2 공허 연사 → 4.1 공허의 형상 → 5.0 마력 주입 → 5.0 마력 주입 → 5.4 촉수 격돌 → 6.1 정신 분열 → 6.3 Shadowy Apparition* → 6.4 Shadowy Apparition* → 6.9 어둠의 권능: 광기 → 6.9 Shadowy Apparition* → 6.9 Shadowy Apparition* → 7.6 Shadowy Apparition* → 7.7 정신의 채찍: 광기 → 7.7 Shadowy Apparition* → 8.5 공허 연사 → 9.2 공허 연사 → 9.9 어둠의 권능: 광기
- ALL #11 KR Ekms 304초 <https://www.warcraftlogs.com/reports/BchC9HqJfA3pavLF#fight=66&source=481>
  0.6 정신 분열 → 0.6 촉수 격돌 → 1.5 Shadowy Apparition* → 1.6 Shadowy Apparition* → 1.8 어둠의 권능: 고통 → 2.8 후광 → 3.8 공허 연사 → 4.8 공허의 형상 → 5.8 공허 연사 → 6.3 Empowering Venom* → 6.3 마력 주입 → 6.3 마력 주입 → 6.5 Potion of Recklessness* → 6.8 어둠의 권능: 광기 → 6.8 Shadowy Apparition* → 6.8 Shadowy Apparition* → 7.4 Shadowy Apparition* → 7.6 정신 분열 → 8.4 공허 연사 → 9.2 공허 연사 → 10.0 촉수 격돌 → 10.8 공허 연사 → 10.9 Shadowy Apparition* → 11.0 Shadowy Apparition*
- ALL #12 US Buffpriest 304초 <https://www.warcraftlogs.com/reports/WpQdPwgVMDqZ47h6#fight=14&source=3>
  0.1 촉수 격돌 → 1.0 Shadowy Apparition* → 1.1 Shadowy Apparition* → 1.3 어둠의 권능: 고통 → 2.2 공허 연사 → 3.1 후광 → 4.0 Shadowy Apparition* → 4.0 공허의 형상 → 4.9 Potion of Recklessness* → 5.0 Vampiric Embrace* → 5.0 마력 주입 → 5.0 공허 연사 → 5.0 마력 주입 → 5.9 정신 분열 → 6.6 어둠의 권능: 광기 → 6.6 Shadowy Apparition* → 7.3 공허 연사 → 7.9 Shadowy Apparition* → 8.1 촉수 격돌 → 8.9 Shadowy Apparition* → 8.9 정신의 채찍: 광기 → 9.0 Shadowy Apparition* → 9.2 Shadowy Apparition* → 9.5 Shadowy Apparition*
- ALL #13 KR 노인틀니강탈 333초 <https://www.warcraftlogs.com/reports/HBfwTR48XDFc27GY#fight=23&source=205>
  0.9 공허의 형상 → 1.2 어둠의 권능: 고통 → 2.1 촉수 격돌 → 3.0 Vampiric Embrace* → 3.0 마력 주입 → 3.0 마력 주입 → 3.1 Shadowy Apparition* → 3.1 공허 연사 → 3.2 Shadowy Apparition* → 3.5 Light's Potential* → 3.7 Shadowy Apparition* → 3.9 공허 연사 → 4.7 공허 연사 → 5.4 정신 분열 → 6.2 Shadowy Apparition* → 6.3 어둠의 권능: 광기 → 6.3 Shadowy Apparition* → 6.7 Shadowy Apparition* → 7.0 공허 연사 → 7.8 촉수 격돌 → 8.5 Shadowy Apparition* → 8.5 정신의 채찍: 광기 → 8.6 Shadowy Apparition* → 8.7 Shadowy Apparition*
- ALL #17 EU Jktrollings 297초 <https://www.warcraftlogs.com/reports/QMAvZTHYRC9XgLKa#fight=50&source=302>
  0.2 정신 분열 → 0.3 촉수 격돌 → 1.2 Shadowy Apparition* → 1.4 Shadowy Apparition* → 1.5 어둠의 권능: 고통 → 2.5 후광 → 3.4 공허 연사 → 4.4 공허의 형상 → 4.4 Shadowy Apparition* → 5.3 공허 연사 → 5.6 Potion of Recklessness* → 5.8 Vampiric Embrace* → 5.8 마력 주입 → 5.8 마력 주입 → 6.3 촉수 격돌 → 7.1 어둠의 권능: 광기 → 7.2 Shadowy Apparition* → 7.2 Shadowy Apparition* → 7.2 Shadowy Apparition* → 7.4 Shadowy Apparition* → 8.3 정신 분열 → 9.1 Shadowy Apparition* → 9.1 정신의 채찍: 광기 → 9.6 Shadowy Apparition*
- ALL #19 EU Amâterasu 277초 <https://www.warcraftlogs.com/reports/At2qPvN9Fzn16kr4#fight=17&source=29>
  0.5 정신 분열 → 0.5 촉수 격돌 → 1.4 Shadowy Apparition* → 1.5 어둠의 권능: 고통 → 1.6 Shadowy Apparition* → 2.4 공허 연사 → 3.4 후광 → 4.2 Shadowy Apparition* → 4.4 공허의 형상 → 5.3 촉수 격돌 → 5.5 Potion of Recklessness* → 5.5 마력 주입 → 5.5 마력 주입 → 6.2 Shadowy Apparition* → 6.3 정신 분열 → 6.4 Shadowy Apparition* → 7.1 Shadowy Apparition* → 7.1 정신의 채찍: 광기 → 7.7 Shadowy Apparition* → 7.9 어둠의 권능: 광기 → 7.9 Shadowy Apparition* → 8.6 공허 연사 → 8.8 Shadowy Apparition* → 9.4 공허 연사
- ALL #23 EU Piepriest 284초 <https://www.warcraftlogs.com/reports/RtHcmfLyTAdhGCa9#fight=23&source=10>
  0.5 정신 분열 → 0.5 촉수 격돌 → 1.4 Shadowy Apparition* → 1.6 Shadowy Apparition* → 1.7 어둠의 권능: 고통 → 2.7 후광 → 3.6 공허 연사 → 4.5 공허의 형상 → 5.5 Vampiric Embrace* → 5.5 마력 주입 → 5.6 촉수 격돌 → 5.8 Potion of Recklessness* → 6.4 정신 분열 → 6.6 Shadowy Apparition* → 6.7 Shadowy Apparition* → 7.2 어둠의 권능: 광기 → 7.3 Shadowy Apparition* → 7.3 Shadowy Apparition* → 8.0 Shadowy Apparition* → 8.0 정신의 채찍: 광기 → 8.9 공허 연사 → 9.2 Shadowy Apparition* → 9.6 공허 연사 → 10.4 Shadowy Apparition*
- ALL #30 KR Yzis 295초 <https://www.warcraftlogs.com/reports/nHavrDhPVtBYkMXA#fight=43&source=10>
  0.6 정신 분열 → 0.7 촉수 격돌 → 1.6 Shadowy Apparition* → 1.6 어둠의 권능: 고통 → 1.8 Shadowy Apparition* → 2.5 공허 연사 → 3.0 Potion of Recklessness* → 3.5 후광 → 4.4 공허의 형상 → 4.9 Shadowy Apparition* → 5.3 Hex Lord's Doom* → 5.5 마력 주입 → 5.5 마력 주입 → 5.8 정신 분열 → 6.5 촉수 격돌 → 7.3 어둠의 권능: 광기 → 7.3 Shadowy Apparition* → 7.3 Shadowy Apparition* → 7.4 Shadowy Apparition* → 7.6 Shadowy Apparition* → 8.0 공허 연사 → 8.8 공허 연사 → 9.5 공허 연사 → 10.3 어둠의 권능: 광기
### 반복(풀 25초 이후, 사잇단계 제외) — 분당 시전(전투 평균)
  Shadowy Apparition*(341263) 41.64 · 정신의 채찍(15407) 9.35 · 어둠의 권능: 광기(335467) 8.70 · 공허 연사(1242173) 7.31 · 정신 분열(8092) 6.63 · 촉수 격돌(1227280) 5.10 · 정신의 채찍: 광기(391403) 4.37 · 어둠의 권능: 죽음(32379) 1.48 · 어둠의 권능: 고통(589) 1.48 · 소실(586) 1.47 · 신의 권능: 보호막(17) 1.27 · 후광(120644) 0.97 · 마력 주입(10060) 0.87 · 천사의 깃털(121536) 0.56 · 구원의 기도(19236) 0.50 · 공허의 형상(228260) 0.44 · Vampiric Embrace*(15286) 0.27 · 분산(47585) 0.20 · Hex Lord's Doom*(1295885) 0.17
### 반복 — 바로 다음에 누른 스킬(상위 4, 10회 이상)
- Shadowy Apparition* (1240) → Shadowy Apparition* 35%, 공허 연사 12%, 정신의 채찍 12%, 정신의 채찍: 광기 11%
- 정신의 채찍 (276) → Shadowy Apparition* 36%, 어둠의 권능: 광기 17%, 정신 분열 13%, 촉수 격돌 11%
- 어둠의 권능: 광기 (261) → Shadowy Apparition* 100%, 공허 연사 0%
- 공허 연사 (218) → Shadowy Apparition* 47%, 어둠의 권능: 광기 17%, 정신의 채찍 13%, 정신 분열 7%
- 정신 분열 (196) → Shadowy Apparition* 35%, 정신의 채찍 16%, 공허 연사 14%, 어둠의 권능: 광기 11%
- 촉수 격돌 (150) → Shadowy Apparition* 90%, 공허 연사 4%, 소실 2%, Vampiric Embrace* 1%
- 정신의 채찍: 광기 (131) → Shadowy Apparition* 40%, 어둠의 권능: 광기 18%, 정신의 채찍 14%, 정신 분열 9%
- 어둠의 권능: 고통 (45) → Shadowy Apparition* 36%, 촉수 격돌 13%, 정신의 채찍 9%, 어둠의 권능: 광기 7%
- 소실 (44) → Shadowy Apparition* 39%, 정신의 채찍 20%, 구원의 기도 14%, 어둠의 권능: 광기 11%
- 어둠의 권능: 죽음 (44) → Shadowy Apparition* 27%, 어둠의 권능: 광기 23%, 정신의 채찍 16%, 정신 분열 11%
- 신의 권능: 보호막 (39) → 어둠의 권능: 광기 28%, Shadowy Apparition* 21%, 정신의 채찍 13%, 소실 8%
- 후광 (29) → Shadowy Apparition* 38%, 공허의 형상 24%, 어둠의 권능: 광기 17%, 정신 분열 14%
- 마력 주입 (26) → 마력 주입 46%, 어둠의 권능: 광기 23%, Shadowy Apparition* 12%, 촉수 격돌 8%
- 천사의 깃털 (16) → 후광 13%, 어둠의 권능: 광기 13%, 어둠의 권능: 죽음 13%, 소실 13%
- 구원의 기도 (15) → Shadowy Apparition* 27%, 정신 분열 27%, 정신의 채찍 20%, 소실 7%
- 공허의 형상 (13) → 마력 주입 38%, 공허 연사 23%, Hex Lord's Doom* 15%, Shadowy Apparition* 8%
### 반복 예시 1 (ALL #1 Grendini, 130~175초)
  130.5 공허 연사 → 131.3 Shadowy Apparition* → 131.3 정신의 채찍: 광기 → 131.7 Shadowy Apparition* → 132.3 어둠의 권능: 광기 → 132.3 Shadowy Apparition* → 133.2 촉수 격돌 → 133.4 Shadowy Apparition* → 134.1 Shadowy Apparition* → 134.1 Shadowy Apparition* → 134.2 공허 연사 → 134.3 Shadowy Apparition* → 135.2 공허 연사 → 136.1 정신 분열 → 136.2 Shadowy Apparition* → 136.3 Shadowy Apparition* → 137.1 어둠의 권능: 광기 → 137.1 Shadowy Apparition* → 138.0 Shadowy Apparition* → 138.0 정신의 채찍: 광기 → 139.0 공허 연사 → 139.9 Shadowy Apparition* → 140.0 Shadowy Apparition* → 140.0 정신의 채찍: 광기 → 141.0 어둠의 권능: 광기 → 141.0 Shadowy Apparition* → 141.0 Shadowy Apparition* → 142.1 정신의 채찍 → 143.0 Shadowy Apparition* → 143.2 정신 분열 → 144.4 촉수 격돌 → 145.3 Shadowy Apparition* → 145.4 Shadowy Apparition* → 145.7 공허 연사 → 147.2 Shadowy Apparition* → 147.2 정신의 채찍: 광기 → 147.8 Shadowy Apparition* → 148.4 어둠의 권능: 광기 → 148.5 Shadowy Apparition* → 148.5 Shadowy Apparition* → 149.5 정신의 채찍 → 150.9 정신 분열 → 152.0 Shadowy Apparition* → 152.5 어둠의 권능: 광기 → 152.6 Shadowy Apparition* → 153.7 신의 권능: 보호막 → 153.7 소실 → 154.8 정신의 채찍 → 155.4 Shadowy Apparition* → 155.4 Shadowy Apparition* → 156.2 촉수 격돌 → 157.2 Shadowy Apparition* → 157.3 Shadowy Apparition* → 157.3 정신의 채찍 → 157.4 Shadowy Apparition* → 158.7 정신 분열 → 159.8 공허 연사 → 160.9 어둠의 권능: 광기 → 160.9 Shadowy Apparition* → 162.0 정신의 채찍 → 163.0 정신 분열 → 164.1 정신의 채찍 → 164.2 Shadowy Apparition* → 164.5 Shadowy Apparition* → 165.3 공허 연사 → 166.4 정신의 채찍 → 167.6 어둠의 권능: 광기 → 167.7 Shadowy Apparition* → 168.8 촉수 격돌 → 169.6 Shadowy Apparition* → 169.8 Shadowy Apparition* → 170.6 정신의 채찍 → 170.6 Shadowy Apparition* → 171.8 정신 분열 → 173.2 공허 연사 → 174.2 Shadowy Apparition* → 174.4 Spatial Rift*
### 반복 예시 2 (ALL #11 Ekms, 130~175초)
  130.3 후광 → 131.6 공허의 형상 → 132.7 Shadowy Apparition* → 132.8 공허 연사 → 133.7 Empowering Venom* → 133.7 마력 주입 → 133.7 마력 주입 → 133.9 어둠의 권능: 광기 → 134.0 Shadowy Apparition* → 134.0 Shadowy Apparition* → 134.9 정신 분열 → 135.8 공허 연사 → 136.8 공허 연사 → 137.6 Shadowy Apparition* → 137.7 어둠의 권능: 광기 → 137.8 Shadowy Apparition* → 138.2 Shadowy Apparition* → 138.7 Shadowy Apparition* → 138.7 정신의 채찍: 광기 → 139.8 Shadowy Apparition* → 139.8 정신의 채찍: 광기 → 140.2 Shadowy Apparition* → 141.0 촉수 격돌 → 141.9 Shadowy Apparition* → 141.9 Shadowy Apparition* → 141.9 공허 연사 → 142.0 Shadowy Apparition* → 142.8 정신 분열 → 143.5 Shadowy Apparition* → 143.6 어둠의 권능: 광기 → 143.6 Shadowy Apparition* → 143.7 Shadowy Apparition* → 144.7 Shadowy Apparition* → 144.7 정신의 채찍: 광기 → 145.8 정신의 채찍 → 146.9 어둠의 권능: 광기 → 146.9 Shadowy Apparition* → 147.9 Shadowy Apparition* → 147.9 정신의 채찍: 광기 → 148.2 Shadowy Apparition* → 149.1 정신의 채찍 → 150.1 정신 분열 → 151.3 정신의 채찍 → 151.9 Shadowy Apparition* → 152.4 어둠의 권능: 광기 → 152.5 Shadowy Apparition* → 153.6 정신의 채찍 → 154.6 Shadowy Apparition* → 154.7 촉수 격돌 → 155.6 Shadowy Apparition* → 155.8 Shadowy Apparition* → 155.9 공허 연사 → 157.0 어둠의 권능: 죽음 → 158.2 정신의 채찍 → 159.3 정신 분열 → 160.4 Shadowy Apparition* → 160.5 어둠의 권능: 광기 → 160.5 Shadowy Apparition* → 160.5 Shadowy Apparition* → 161.0 Vampiric Embrace* → 161.6 정신의 채찍 → 163.8 정신의 채찍 → 166.0 촉수 격돌 → 166.9 Shadowy Apparition* → 167.1 Shadowy Apparition* → 167.3 정신 분열 → 168.5 어둠의 권능: 죽음 → 168.9 Shadowy Apparition* → 168.9 Shadowy Apparition* → 169.7 어둠의 권능: 광기 → 169.7 Shadowy Apparition* → 169.7 Shadowy Apparition* → 170.8 정신의 채찍 → 172.3 공허 연사 → 173.5 공허 연사 → 174.7 어둠의 권능: 광기 → 174.7 Shadowy Apparition* → 174.8 Shadowy Apparition*

## 2. 스조라크 로그 — 공허술사 (10개)
### 풀 전(0초 전) 사전 시전 — 전투 수/10
  없음
### 오프닝 (풀 −8초부터 첫 24회)
- ALL #2 EU Cutejustice 303초 <https://www.warcraftlogs.com/reports/JqtkHf8pYQCBMKaL#fight=15&source=83>
  0.3 정신 분열 → 0.4 촉수 격돌 → 1.3 Shadowy Apparition* → 1.5 Shadowy Apparition* → 1.7 어둠의 권능: 고통 → 2.4 Shadowy Apparition* → 2.7 공허 연사 → 3.6 공허의 형상 → 4.7 공허 연사 → 5.0 Freightrunner's Flask* → 5.0 마력 주입 → 5.0 마력 주입 → 5.5 Potion of Recklessness* → 5.7 어둠의 권능: 광기 → 5.8 Shadowy Apparition* → 5.8 Shadowy Apparition* → 6.0 Shadowy Apparition* → 6.5 공허의 격류 → 7.5 Shadowy Apparition* → 9.1 Shadowy Apparition* → 9.7 공허의 폭발 → 10.5 촉수 격돌 → 11.3 어둠의 권능: 광기 → 11.4 Shadowy Apparition*
- ALL #3 KR 박근수 299초 <https://www.warcraftlogs.com/reports/CRBwpKLmyrFnA6QG#fight=29&source=7>
  0.3 정신 분열 → 0.3 촉수 격돌 → 1.2 Shadowy Apparition* → 1.3 Shadowy Apparition* → 1.5 어둠의 권능: 고통 → 2.1 Shadowy Apparition* → 2.4 공허 연사 → 3.3 공허의 형상 → 4.2 공허 연사 → 4.8 마력 주입 → 4.8 마력 주입 → 5.0 Potion of Recklessness* → 5.2 어둠의 권능: 광기 → 5.2 Shadowy Apparition* → 5.3 Shadowy Apparition* → 6.0 공허의 격류 → 6.4 Shadowy Apparition* → 9.0 공허의 폭발 → 9.7 공허의 폭발 → 10.0 Shadowy Apparition* → 10.5 공허 연사 → 11.2 어둠의 권능: 광기 → 11.3 Shadowy Apparition* → 11.3 Shadowy Apparition*
- ALL #4 CN 有时消逝的风 334초 <https://www.warcraftlogs.com/reports/8FBrMj2zQYAph3tW#fight=9&source=4>
  0.1 정신 분열 → 0.1 어둠의 권능: 고통 → 0.1 Shadowy Apparition* → 1.2 촉수 격돌 → 1.5 소실 → 2.1 Shadowy Apparition* → 2.2 공허 연사 → 2.3 Shadowy Apparition* → 3.0 공허의 형상 → 4.0 마력 주입 → 4.0 마력 주입 → 4.0 Hex Lord's Doom* → 4.1 Potion of Recklessness* → 4.2 공허의 격류 → 4.8 Shadowy Apparition* → 6.7 Shadowy Apparition* → 7.4 공허의 폭발 → 7.4 Shadowy Apparition* → 8.1 어둠의 권능: 광기 → 8.2 Shadowy Apparition* → 8.9 공허의 폭발 → 9.6 촉수 격돌 → 10.4 공허 연사 → 10.5 Shadowy Apparition*
- ALL #5 CN 风度丶 327초 <https://www.warcraftlogs.com/reports/mVcCny6W1bJ4HKqf#fight=17&source=15>
  0.2 촉수 격돌 → 1.1 Shadowy Apparition* → 1.2 Shadowy Apparition* → 1.4 어둠의 권능: 고통 → 2.5 공허 연사 → 3.4 공허의 형상 → 4.3 Shadowy Apparition* → 4.3 촉수 격돌 → 4.9 Potion of Recklessness* → 4.9 마력 주입 → 4.9 마력 주입 → 5.2 Shadowy Apparition* → 5.2 공허의 격류 → 5.4 Shadowy Apparition* → 7.2 Shadowy Apparition* → 7.2 Shadowy Apparition* → 8.3 공허의 폭발 → 9.1 공허의 폭발 → 9.8 어둠의 권능: 광기 → 9.9 Shadowy Apparition* → 10.6 공허 연사 → 11.3 Shadowy Apparition* → 11.4 어둠의 권능: 광기 → 11.4 Shadowy Apparition*
- ALL #6 CN 圆敏丶 346초 <https://www.warcraftlogs.com/reports/z8xk37dcRABTH614#fight=15&source=17>
  0.4 정신 분열 → 0.4 어둠의 권능: 고통 → 1.6 촉수 격돌 → 2.5 Shadowy Apparition* → 2.5 공허 연사 → 2.6 Shadowy Apparition* → 2.8 Shadowy Apparition* → 3.4 공허의 형상 → 4.4 Potion of Recklessness* → 4.5 마력 주입 → 4.5 마력 주입 → 4.8 촉수 격돌 → 5.6 공허의 격류 → 5.6 Shadowy Apparition* → 5.7 Shadowy Apparition* → 5.9 Shadowy Apparition* → 7.5 Shadowy Apparition* → 7.8 Shadowy Apparition* → 8.6 공허의 폭발 → 9.3 공허의 폭발 → 10.1 어둠의 권능: 광기 → 10.1 Shadowy Apparition* → 10.8 어둠의 권능: 광기 → 10.9 Shadowy Apparition*
- ALL #7 EU Иксдватрисус 339초 <https://www.warcraftlogs.com/reports/VACtnJL7hZ6PY4NM#fight=16&source=3>
  0.6 정신 분열 → 0.7 어둠의 권능: 고통 → 1.9 촉수 격돌 → 2.3 Potion of Recklessness* → 2.8 Shadowy Apparition* → 2.8 공허의 격류 → 2.9 Shadowy Apparition* → 3.1 Shadowy Apparition* → 6.0 공허 연사 → 7.0 공허의 형상 → 8.1 Hex Lord's Doom* → 8.1 마력 주입 → 8.1 마력 주입 → 8.3 어둠의 권능: 광기 → 8.3 Shadowy Apparition* → 8.3 Shadowy Apparition* → 9.0 공허의 폭발 → 9.8 공허의 폭발 → 10.5 촉수 격돌 → 11.4 공허 연사 → 11.4 Shadowy Apparition* → 11.5 Shadowy Apparition* → 11.6 Shadowy Apparition* → 12.2 공허 연사
- ALL #8 US Sica 392초 <https://www.warcraftlogs.com/reports/b1rB3QRknjHt9WfK#fight=5&source=1>
  0.2 정신 분열 → 0.3 촉수 격돌 → 1.2 Shadowy Apparition* → 1.3 Shadowy Apparition* → 1.5 어둠의 권능: 고통 → 2.4 공허 연사 → 3.3 Shadowy Apparition* → 3.3 공허의 형상 → 4.3 촉수 격돌 → 5.1 마력 주입 → 5.1 마력 주입 → 5.1 Shadowy Apparition* → 5.3 공허의 격류 → 5.3 Shadowy Apparition* → 6.6 Shadowy Apparition* → 7.4 Shadowy Apparition* → 8.1 Shadowy Apparition* → 8.3 공허의 폭발 → 9.1 어둠의 권능: 광기 → 9.1 Shadowy Apparition* → 9.9 공허의 폭발 → 10.5 Shadowy Apparition* → 10.6 공허의 폭발 → 11.4 공허 연사
- ALL #9 CN 昆仑丶煮雪 301초 <https://www.warcraftlogs.com/reports/YQCTD8qArnzkNvjL#fight=5&source=20>
  0.1 정신 분열 → 0.2 촉수 격돌 → 1.1 Shadowy Apparition* → 1.3 Shadowy Apparition* → 1.4 어둠의 권능: 고통 → 2.5 공허 연사 → 3.5 공허의 형상 → 3.9 Shadowy Apparition* → 4.5 Potion of Recklessness* → 4.5 마력 주입 → 4.5 마력 주입 → 4.7 공허의 격류 → 7.9 공허의 폭발 → 8.6 어둠의 권능: 광기 → 8.7 Shadowy Apparition* → 8.7 Shadowy Apparition* → 9.4 촉수 격돌 → 9.6 Shadowy Apparition* → 10.2 공허의 폭발 → 10.3 Shadowy Apparition* → 10.4 Shadowy Apparition* → 10.9 공허 연사 → 11.1 Shadowy Apparition* → 11.7 어둠의 권능: 광기
- KR #4 KR Emoji 312초 <https://www.warcraftlogs.com/reports/g1HG8nXjBcTZ46NR#fight=57&source=7>
  0.6 정신 분열 → 0.6 촉수 격돌 → 1.5 어둠의 권능: 고통 → 1.5 Shadowy Apparition* → 1.5 Shadowy Apparition* → 1.6 Shadowy Apparition* → 2.3 공허 연사 → 3.2 공허의 형상 → 4.1 공허 연사 → 4.6 Hex Lord's Doom* → 4.6 마력 주입 → 4.6 마력 주입 → 4.7 Shadowy Apparition* → 5.1 어둠의 권능: 광기 → 5.1 Shadowy Apparition* → 5.2 Shadowy Apparition* → 5.9 공허의 격류 → 7.9 Shadowy Apparition* → 9.1 공허의 폭발 → 9.8 공허의 폭발 → 10.6 공허 연사 → 11.3 촉수 격돌 → 12.1 어둠의 권능: 광기 → 12.1 Shadowy Apparition*
- KR #5 KR 시미터즈 305초 <https://www.warcraftlogs.com/reports/1vmkK2hTXq3fndQc#fight=37&source=14>
  0.4 정신 분열 → 0.5 촉수 격돌 → 1.4 Shadowy Apparition* → 1.4 어둠의 권능: 고통 → 1.5 Shadowy Apparition* → 2.3 공허 연사 → 3.1 Shadowy Apparition* → 3.3 공허의 형상 → 4.2 촉수 격돌 → 4.5 Potion of Recklessness* → 4.7 마력 주입 → 4.7 마력 주입 → 5.1 Shadowy Apparition* → 5.1 공허의 격류 → 5.2 Shadowy Apparition* → 5.8 Shadowy Apparition* → 7.2 Shadowy Apparition* → 7.8 Shadowy Apparition* → 8.1 공허의 폭발 → 8.9 공허의 폭발 → 9.7 어둠의 권능: 광기 → 9.7 Shadowy Apparition* → 10.1 Shadowy Apparition* → 10.4 공허의 폭발
### 반복(풀 25초 이후, 사잇단계 제외) — 분당 시전(전투 평균)
  Shadowy Apparition*(341263) 39.84 · 어둠의 권능: 광기(335467) 8.51 · 공허 연사(1242173) 7.16 · 정신 분열(8092) 7.06 · 정신의 채찍(15407) 6.38 · 공허의 폭발(450983) 5.97 · 촉수 격돌(1227280) 5.09 · 공허의 격류(263165) 2.09 · 어둠의 권능: 고통(589) 1.47 · 어둠의 권능: 죽음(32379) 1.19 · 소실(586) 1.08 · 마력 주입(10060) 0.79 · 신의 권능: 보호막(17) 0.70 · 구원의 기도(19236) 0.47 · 공허의 형상(228260) 0.34 · 천사의 깃털(121536) 0.19 · Hex Lord's Doom*(1295885) 0.16
### 반복 — 바로 다음에 누른 스킬(상위 4, 10회 이상)
- Shadowy Apparition* (1656) → Shadowy Apparition* 34%, 공허 연사 13%, 정신 분열 10%, 공허의 폭발 9%
- 어둠의 권능: 광기 (355) → Shadowy Apparition* 99%, 공허의 폭발 1%, 공허 연사 0%, 촉수 격돌 0%
- 공허 연사 (297) → Shadowy Apparition* 43%, 어둠의 권능: 광기 15%, 정신의 채찍 10%, 정신 분열 6%
- 정신 분열 (295) → Shadowy Apparition* 32%, 정신의 채찍 19%, 어둠의 권능: 광기 12%, 정신 분열 9%
- 정신의 채찍 (255) → Shadowy Apparition* 36%, 어둠의 권능: 광기 17%, 정신 분열 17%, 촉수 격돌 13%
- 공허의 폭발 (247) → Shadowy Apparition* 34%, 어둠의 권능: 광기 21%, 공허의 폭발 15%, 공허 연사 10%
- 촉수 격돌 (212) → Shadowy Apparition* 96%, 어둠의 권능: 광기 1%, 공허의 격류 0%, Concentrated Silvermoon Health Potion* 0%
- 공허의 격류 (82) → Shadowy Apparition* 77%, 공허의 폭발 17%, 어둠의 권능: 광기 2%, 촉수 격돌 1%
- 어둠의 권능: 고통 (64) → Shadowy Apparition* 48%, 어둠의 권능: 광기 11%, 정신의 채찍 11%, 정신 분열 9%
- 어둠의 권능: 죽음 (49) → Shadowy Apparition* 33%, 어둠의 권능: 광기 20%, 정신 분열 10%, 공허 연사 8%
- 소실 (45) → Shadowy Apparition* 24%, 정신의 채찍 16%, 구원의 기도 13%, 촉수 격돌 13%
- 마력 주입 (33) → 마력 주입 48%, 어둠의 권능: 광기 21%, Shadowy Apparition* 9%, 촉수 격돌 9%
- 신의 권능: 보호막 (31) → 정신 분열 23%, Shadowy Apparition* 19%, 어둠의 권능: 광기 19%, 어둠의 권능: 고통 13%
- 구원의 기도 (20) → 정신 분열 20%, 소실 15%, 공허 연사 15%, 어둠의 권능: 고통 10%
- 공허의 형상 (14) → 마력 주입 36%, Shadowy Apparition* 21%, 공허 연사 14%, Hex Lord's Doom* 14%
### 반복 예시 1 (ALL #2 Cutejustice, 130~175초)
  130.6 공허 연사 → 131.2 Shadowy Apparition* → 131.4 마력 주입 → 131.4 마력 주입 → 131.8 공허 연사 → 132.3 Shadowy Apparition* → 132.8 어둠의 권능: 광기 → 132.8 Shadowy Apparition* → 133.1 소실 → 133.9 공허의 격류 → 137.0 공허의 폭발 → 138.0 Shadowy Apparition* → 138.0 촉수 격돌 → 138.9 Shadowy Apparition* → 138.9 Shadowy Apparition* → 139.0 공허의 폭발 → 139.1 Shadowy Apparition* → 139.4 Shadowy Apparition* → 140.0 공허 연사 → 141.1 어둠의 권능: 광기 → 141.1 Shadowy Apparition* → 142.1 공허 연사 → 143.1 정신의 채찍 → 143.4 Shadowy Apparition* → 143.7 Shadowy Apparition* → 144.1 공허의 폭발 → 145.2 정신의 채찍 → 145.9 Shadowy Apparition* → 146.2 어둠의 권능: 광기 → 146.3 Shadowy Apparition* → 147.3 공허의 폭발 → 148.4 촉수 격돌 → 149.3 Shadowy Apparition* → 149.5 Shadowy Apparition* → 149.6 정신의 채찍 → 151.9 Shadowy Apparition* → 152.4 공허 연사 → 153.6 어둠의 권능: 광기 → 153.6 Shadowy Apparition* → 153.9 소실 → 154.7 정신 분열 → 156.0 정신 분열 → 156.2 Shadowy Apparition* → 157.5 공허 연사 → 158.7 촉수 격돌 → 159.6 Shadowy Apparition* → 159.7 Shadowy Apparition* → 159.9 공허 연사 → 161.1 어둠의 권능: 광기 → 161.1 Shadowy Apparition* → 161.1 Shadowy Apparition* → 162.2 정신의 채찍 → 163.8 Shadowy Apparition* → 164.3 공허의 격류 → 166.4 Shadowy Apparition* → 166.4 Shadowy Apparition* → 167.5 어둠의 권능: 고통 → 167.7 Shadowy Apparition* → 168.5 어둠의 권능: 광기 → 168.6 Shadowy Apparition* → 169.6 공허의 폭발 → 170.7 공허의 폭발 → 171.7 Shadowy Apparition* → 171.8 촉수 격돌 → 172.7 Shadowy Apparition* → 172.7 Shadowy Apparition* → 172.8 Shadowy Apparition* → 172.9 정신의 채찍
### 반복 예시 2 (ALL #3 박근수, 130~175초)
  130.1 Shadowy Apparition* → 130.4 Shadowy Apparition* → 132.9 공허의 폭발 → 133.8 공허의 폭발 → 134.8 어둠의 권능: 광기 → 134.8 Shadowy Apparition* → 134.8 Shadowy Apparition* → 135.4 Shadowy Apparition* → 135.7 공허의 폭발 → 136.6 공허 연사 → 137.2 Shadowy Apparition* → 137.5 어둠의 권능: 광기 → 137.6 Shadowy Apparition* → 137.6 Shadowy Apparition* → 138.4 정신의 채찍 → 139.3 촉수 격돌 → 139.6 Shadowy Apparition* → 140.3 Shadowy Apparition* → 140.3 공허의 폭발 → 140.4 Shadowy Apparition* → 141.2 공허 연사 → 141.3 Shadowy Apparition* → 142.1 공허의 폭발 → 143.2 어둠의 권능: 광기 → 143.2 Shadowy Apparition* → 143.2 Shadowy Apparition* → 144.3 정신의 채찍 → 145.4 정신 분열 → 146.4 정신의 채찍 → 147.5 Shadowy Apparition* → 147.5 촉수 격돌 → 148.4 Shadowy Apparition* → 148.6 Shadowy Apparition* → 148.6 공허 연사 → 149.7 정신의 채찍 → 150.7 정신 분열 → 151.8 정신 분열 → 152.2 Shadowy Apparition* → 152.9 공허 연사 → 153.7 Shadowy Apparition* → 154.0 어둠의 권능: 광기 → 154.0 Shadowy Apparition* → 155.1 어둠의 권능: 광기 → 155.1 Shadowy Apparition* → 156.3 촉수 격돌 → 156.7 Shadowy Apparition* → 156.7 Shadowy Apparition* → 157.2 Shadowy Apparition* → 157.3 Shadowy Apparition* → 157.4 공허 연사 → 158.6 정신의 채찍 → 159.8 정신 분열 → 160.5 Shadowy Apparition* → 160.9 정신의 채찍 → 161.0 Shadowy Apparition* → 162.2 어둠의 권능: 광기 → 162.2 Shadowy Apparition* → 163.3 공허의 격류 → 166.4 공허의 폭발 → 166.7 Shadowy Apparition* → 167.9 공허의 폭발 → 169.0 어둠의 권능: 고통 → 170.2 어둠의 권능: 광기 → 170.2 Shadowy Apparition* → 170.3 Shadowy Apparition* → 171.4 공허의 폭발 → 172.5 정신의 채찍 → 173.7 촉수 격돌 → 173.8 Shadowy Apparition* → 174.6 Shadowy Apparition* → 174.8 Shadowy Apparition* → 174.9 공허 연사

## 3. 자동 대조 표시 (판단은 사람이 — 위 원자료를 볼 것)
- 집정관 오프닝 각 단계가 로그 오프닝 몇 번째에 나오나(중앙값, 나온 전투 수/8): 정신 분열=1(8), 촉수 격돌=2(8), 어둠의 권능: 고통=5(8), 공허 연사=7(8), 후광=6(7), 공허의 형상=8(8), 마력 주입=11(8), 어둠의 권능: 광기=16(8)
  - 분당 1회 이상인데 영웅 탭 단일 우선순위에 없음: 신의 권능: 보호막(17) 1.27/분, 소실(586) 1.47/분
  - 단일 우선순위에 있는데 스조라크 로그 분당 0.1 미만(다른 ID·피해로 찍히는지 확인): 흡혈의 손길(34914) 0/분
  - [집정관] 단일 반복 rail "반복 흐름 — 단일 (두 영웅 공통)" 이웃 쌍(A 뒤 3회 안에 B / B 뒤 3회 안에 A): 흡혈의 손길→어둠의 권능: 광기 -% / 반대 0% · 어둠의 권능: 광기→촉수 격돌 15% / 반대 1% · 촉수 격돌→정신 분열 8% / 반대 24% · 정신 분열→정신의 채찍 28% / 반대 27% · 정신의 채찍→어둠의 권능: 광기 40% / 반대 31% · 어둠의 권능: 광기→정신 분열 17% / 반대 44% · 정신 분열→정신의 채찍 28% / 반대 27%
- 공허술사 오프닝 각 단계가 로그 오프닝 몇 번째에 나오나(중앙값, 나온 전투 수/10): 정신 분열=1(9), 촉수 격돌=2(10), 어둠의 권능: 고통=4(10), 공허 연사=7(10), 공허의 형상=8(10), 마력 주입=10(10), 어둠의 권능: 광기=19(10), 공허의 격류=14(10)
  - 순서 뒤바뀜(가이드 앞 → 로그에선 뒤): 어둠의 권능: 광기→공허의 격류
  - 분당 1회 이상인데 영웅 탭 단일 우선순위에 없음: 소실(586) 1.08/분
  - 단일 우선순위에 있는데 스조라크 로그 분당 0.1 미만(다른 ID·피해로 찍히는지 확인): 흡혈의 손길(34914) 0/분
  - [공허술사] 단일 반복 rail "반복 흐름 — 단일 (두 영웅 공통)" 이웃 쌍(A 뒤 3회 안에 B / B 뒤 3회 안에 A): 흡혈의 손길→어둠의 권능: 광기 -% / 반대 0% · 어둠의 권능: 광기→촉수 격돌 15% / 반대 6% · 촉수 격돌→정신 분열 6% / 반대 22% · 정신 분열→정신의 채찍 40% / 반대 34% · 정신의 채찍→어둠의 권능: 광기 36% / 반대 19% · 어둠의 권능: 광기→정신 분열 18% / 반대 36% · 정신 분열→정신의 채찍 40% / 반대 34%
