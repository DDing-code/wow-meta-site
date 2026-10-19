# 눈 검수 4조 (30장)

표기: 1 = 문제 확인, 의심 = 확실하지 않음(아래 목록에 위치 적음), 0 = 문제 없음. "한 글자씩·짧은 글자가 꺾인 것"은 README 기준대로 빈칸 칸에 셌다.

| 파일 | 넘침 | 깨진 아이콘 | 겹침 | 빈칸 | 메모 |
|---|---|---|---|---|---|
| druid-balance-320.png | 0 | 0 | 0 | 1 | 첫 화면 위쪽 띠 "← 가이드 목 / 록" 두 줄로 꺾임 |
| druid-balance-390.png | 0 | 0 | 0 | 0 | |
| druid-balance-1440.png | 0 | 0 | 0 | 0 | |
| evoker-devastation-320.png | 0 | 0 | 0 | 1 | 첫 화면 "← 가이드 목 / 록" 꺾임 |
| evoker-devastation-390.png | 0 | 0 | 0 | 0 | |
| evoker-devastation-1440.png | 0 | 0 | 0 | 0 | |
| evoker-augmentation-320.png | 0 | 0 | 0 | 1 | 흐름도 첫 화살표 문구 "…늘어난다 ( 시간의 모래" 다음 줄에 ")" 한 글자만 꺾임 |
| evoker-augmentation-390.png | 0 | 0 | 0 | 0 | |
| evoker-augmentation-1440.png | 0 | 0 | 0 | 0 | |
| paladin-holy-320.png | 0 | 0 | 0 | 1 | 첫 화면 "← 가이드 목 / 록" 꺾임, 목차 "1 / 부"·"2 / 부" 부 번호 꺾임 |
| paladin-holy-390.png | 0 | 0 | 0 | 0 | |
| paladin-holy-1440.png | 0 | 0 | 0 | 의심 | 첫 화면 왼쪽 목차 "1부 원리 이해 — 신성 성기사는 무엇으로 굴 / 러가나" 낱말 중간에서 꺾임 |
| priest-discipline-320.png | 0 | 0 | 0 | 1 | 목차 "2 / 부" 꺾임. 흐름도 '정신 분열' 상자 설명 없음(의심) |
| priest-discipline-390.png | 0 | 0 | 0 | 의심 | 흐름도 '정신 분열' 상자 제목만 있고 설명 없음 |
| priest-discipline-1440.png | 0 | 0 | 0 | 의심 | 흐름도 '정신 분열' 상자 제목만 있고 설명 없음 |
| priest-holy-320.png | 0 | 0 | 0 | 1 | 첫 화면 "← 가이드 목 / 록" 꺾임, 목차 "2 / 부" 꺾임 |
| priest-holy-390.png | 0 | 0 | 0 | 0 | |
| priest-holy-1440.png | 0 | 0 | 0 | 0 | |
| shaman-restoration-320.png | 0 | 0 | 0 | 1 | 목차 "2 / 부" 꺾임 |
| shaman-restoration-390.png | 0 | 0 | 0 | 0 | |
| shaman-restoration-1440.png | 0 | 0 | 0 | 0 | |
| monk-mistweaver-320.png | 0 | 0 | 0 | 1 | 목차 "2 / 부" 꺾임 |
| monk-mistweaver-390.png | 0 | 0 | 0 | 0 | |
| monk-mistweaver-1440.png | 0 | 0 | 0 | 0 | |
| druid-restoration-320.png | 0 | 0 | 0 | 1 | 목차 "1 / 부"·"2 / 부" 꺾임 |
| druid-restoration-390.png | 0 | 0 | 0 | 0 | |
| druid-restoration-1440.png | 0 | 0 | 0 | 0 | |
| evoker-preservation-320.png | 0 | 0 | 의심 | 1 | 첫 화면 "← 가이드 목 / 록" 꺾임, 목차 "2 / 부" 꺾임. 타임라인 가지 문구가 윗줄 이름표에 붙음(의심) |
| evoker-preservation-390.png | 0 | 0 | 의심 | 0 | 타임라인 가지 문구가 윗줄 이름표에 붙고, 아랫줄 이름표끼리 거의 맞닿음 |
| evoker-preservation-1440.png | 0 | 0 | 0 | 0 | |

## 문제·의심 목록

### 문제(확인)
1. **첫 화면 "← 가이드 목록" 두 줄 꺾임 (320px)**: druid-balance, evoker-devastation, paladin-holy, priest-holy, evoker-preservation. 첫 화면 위쪽 띠 왼쪽에서 "가이드 목 / 록"으로 꺾인다. 다섯 개 모두 띠 오른쪽에 로그 분석 아이콘(막대그래프)과 "12.1.5 전환 중 · 전체 검수 진행 중"이 함께 있는 가이드다. 아이콘이 없는 가이드(evoker-augmentation, priest-discipline, shaman-restoration, monk-mistweaver, druid-restoration)는 한 줄로 나온다.
2. **목차 부 번호 "1부"·"2부" 꺾임 (320px)**: 부 제목이 두 줄인 줄에서 번호가 "1 / 부", "2 / 부"로 세로로 꺾인다.
   - paladin-holy: 1부, 2부
   - druid-restoration: 1부, 2부
   - priest-discipline, priest-holy, shaman-restoration, monk-mistweaver, evoker-preservation: 2부
   - 부 제목이 한 줄에 들어가는 0부·3부·4부는 정상이다.
3. **evoker-augmentation-320 흐름도 문구 꺾임**: '스킬 구조' 첫 화살표 문구 "살아 있는 동안 쓰면 늘어난다 ( 시간의 모래"에서 닫는 괄호 ")" 하나만 다음 줄로 꺾인다. 괄호 안쪽 띄어쓰기 "( 시간의 모래 )"는 390·1440에도 있다.

### 의심
4. **priest-discipline 흐름도 '정신 분열' 상자(320·390·1440)**: 다른 상자는 모두 제목 아래 한 줄 설명이 있는데, 이 상자만 제목만 있고 설명이 없다. 1440에서는 가운데 줄의 둘째 상자다.
5. **evoker-preservation 타임라인 가지 문구 붙음**
   - 320: 첫 '반복 흐름' 둘째 줄 첫 칸의 이름표 "메아리 대상이 다치면" 바로 아래에, 셋째 줄 가지 문구 "쐐기 마력의 순환 빌드면 남는 정수로"의 '쐐기'가 틈 없이 붙는다. 가지 아이콘 아래쪽도 본 아이콘 윗변에 닿는다.
   - 390: 첫 줄 셋째 칸 "위험한 대상에게" 바로 아래에 같은 가지 문구 '쐐기'가 붙는다. 둘째 줄 이름표 "쌍둥이 메아리 소비"와 "여유 있으면 적에게"는 좌우로 거의 맞닿는다.
   - 포개지지는 않았지만 틈이 없다.
6. **paladin-holy-1440 왼쪽 목차 꺾임**: 첫 화면 왼쪽 목차의 1부 제목이 "굴 / 러가나"로 낱말 중간에서 꺾인다. 다른 가이드는 같은 자리에서 "무엇으로 / 굴러가나"처럼 낱말 단위로 꺾인다.

### 문제로 세지 않은 것(참고)
- 흐름도 화살표 문구의 스킬 이름 앞뒤 띄어쓰기 어색함: evoker-devastation "( 용의 분노 중에는 확정)", "정수 폭발 로 쓴다", shaman-restoration "성난 해일 이 붙은 대상에게".
- 0부 스킬 본문에서 줄 첫머리가 쉼표·가운뎃점으로 시작하는 꺾임: evoker-preservation-320·390 "위기 대응·해제" 칸.
- 320·390 타임라인에서 가지 없는 줄 위의 여백은 기존 설계라 제외했다.
