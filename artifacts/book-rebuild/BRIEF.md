# 개념서형 리빌딩 작성 지침 (사격 사냥꾼 기준, 2026-10-10)

사격 사냥꾼 가이드(`hunter-marksmanship`)를 처음 하는 사람도 읽을 수 있는 "개념서"로 바꾼 방식을 나머지 전문화에 똑같이 적용한다.
작업자는 **자기 전문화 폴더의 `content.cjs` 하나만** 만든다. KB 정본·사이트 원고 파일(`src/data/manuscripts/<가이드 ID>.js` — 전문화마다 파일 하나, `src/data/guideManuscripts.js`는 모으기만 함)·화면 코드는 고치지 않는다(반영은 조율 담당이 `apply.cjs`로 한꺼번에 한다).

## 참고할 것
- 사격 원고(문체·밀도 기준): `artifacts/mm-concept-sample/book-content.cjs`, `book-diagrams.cjs`, `book-timelines.cjs`
- 내 전문화의 현재 원고(사실의 원천): KB 정본 `C:\wowmeta\kb\08-직업별-Knowledge-Base\<직업>\<전문화>\Meta\guide-12.1.json`
  - `blocks`(기존 장), `priority`, `opener`, `heroBranches[].opener/singleTarget/aoe`, `tips`, `playstyle`, `evidence`, `caveats`, `logReview`
- 내 전문화 KB 스킬 노트: `C:\wowmeta\kb\08-직업별-Knowledge-Base\<직업>\<전문화|공용>\Skills|Talents|Hero-Talents\*.md`
- 생성 DB(스킬 ID·이름·툴팁 확인): `src/data/kb-skills.json` (`skills["<ID>"]`)
- 검사기에서 내 전문화 전용 규칙: `scripts/validate-guide-manuscripts.js`, `scripts/verify-*.cjs` 에서 가이드 ID·한글 전문화명으로 검색해, 기존 장 제목·문구를 요구하는 규칙이 있으면 새 원고에서도 지킨다.

## 사실 규칙 (가장 중요)
- 수치·효과·조건은 **KB 노트와 현재 원고에 이미 있는 것만** 쓴다. 새 수치나 메커니즘을 지어내지 않는다. 확인이 안 되면 쓰지 않는다.
- 스킬 이름은 kb-skills.json의 한국어 이름 그대로(ko.wowhead 기준). 스킬 설명 문장을 임의로 바꾸지 않는다.
- 현재 원고의 우선순위·오프닝·영웅 특성 운용 결론을 바꾸지 않는다(구성만 바꾸고 설명을 쉽게 푼다).
- 현장의 목소리(`book.voices`)와 장별 현장 팁(`fieldTips`)은 **실제로 읽은 공개 자료가 있을 때만** 넣는다. 이번 라운드는 넣지 않는다(빈 채로 둔다). 인용·사람 이름을 만들어 내지 않는다.
- 공격대 장의 네임드 이름은 사이트에 이미 쓰인 표기만 쓴다: 울라텍, 스조라크, 쌍둥이 송곳니, 똬리의 제단, 네크잘리, 악성의 바쉬니크, 님리사, 매장된 파수꾼. 네임드 기술 이름은 번역하지 말고 "매번 같은 시점에 오는 피해 증폭 구간"처럼 기능으로 쓴다. 원고·근거에 없는 네임드별 공략은 지어내지 않는다. 근거가 없으면 공격대 장은 일반 원칙(쿨기 횟수 세기, 사라짐·이동 구간, 쫄 등장, 대상 2개 전투, 생존기 배치)과 현재 원고의 레이드 내용으로 쓴다.

## 말투·용어
- 처음 하는 사람에게 설명하듯 짧고 자연스러운 한국어. 번역투·영어 섞기 금지(스킬명은 한국어).
- 고정 용어: 네임드(보스), 쫄(잡몹; 조사 쫄이·쫄을·쫄은·쫄과), 딜사이클, 오프닝, 쐐기, 공격대, 글쿨, 쿨기, 탱커, 정신 집중, 극딜, 발동, 유지율. "우두머리·졸개·로테이션·오프너·신화+·프록" 금지.

## 목차 (모든 전문화 공통 뼈대, 사용자 확정)
`book.parts`의 id 순서는 반드시 `start → concept → drill → field → review`.

| id | label | 제목 예 | 들어갈 장 |
|---|---|---|---|
| start | 0부 | 시작 전 준비 | **"내 스킬 한눈에 보기" 한 장만.** 특성·쓰는 말(용어) 장은 넣지 않는다(사용자 결정). |
| concept | 1부 | 원리 이해 — ○○은 무엇으로 굴러가나 | 이 전문화의 핵심 자원·순환 원리 3~5장 |
| drill | 2부 | 허수아비 연습 (치유사: 기본기 연습, 탱커: 혼자 연습) | ① 단일 대상 ② 쿨기와 오프닝 ③ 광역 ④ 이동·특수 상황 — 앞의 셋은 타임라인 필수 |
| field | 3부 | 실전 | ① 기본으로 고르는 영웅 특성 운용 ② 피해 말고 맡는 일(차단·해제·생존기, 탱커는 방어 유지, 치유사는 위기 대응) ③ 쐐기 한 판 ④ 공격대 네임드 운용 |
| review | 4부 | 심화·부록 | ① 다른 영웅 특성(다른 선택지) ② 고급 기술 하나(있으면) ③ 내 로그 복기하기 |

- 영웅 특성 둘의 선택 비율이 비슷하거나 콘텐츠마다 갈리면 3부 ①에서 "기본"이라 단정하지 말고 "레이드는 A, 쐐기는 B"처럼 현재 원고 결론대로 쓴다. 그래도 장 배치는 3부에 하나, 4부에 하나.
- 장 수는 14~17장. 장 제목은 "~합니다/~부터" 같은 한 문장형도 좋다(사격 참고).

## content.cjs 형식
```js
// <전문화> 개념서 본문. 수치·효과는 KB 노트와 기존 검수 원고에서만 가져온다.
const PARTS = [
  { id: 'start', label: '0부', title: '시작 전 준비', summary: '30자 이상' },
  { id: 'concept', label: '1부', title: '…', summary: '…' },
  { id: 'drill', label: '2부', title: '…', summary: '…' },
  { id: 'field', label: '3부', title: '…', summary: '…' },
  { id: 'review', label: '4부', title: '…', summary: '…' },
];
const BLOCKS = [
  {
    part: 'start',
    title: '내 스킬 한눈에 보기',
    concept: '한 줄 원리(20자 이상)',
    skillGroups: [                         // 3~6묶음. 아이콘과 이름으로 그려진다.
      { label: '주력기', skillIds: ['19434', '257044'], note: '무엇을 하는 묶음인지 한 줄' },
      { label: '소비기', skillIds: [...], note: '…' },
      { label: '쿨기', skillIds: [...], note: '…' },
      { label: '차단·해제', skillIds: [...], note: '…' },
      { label: '생존기', skillIds: [...], note: '…' },
    ],
    paragraphs: ['이 묶음을 어떻게 읽으면 되는지 1~2문단'],
    bullets: ['…'],
  },
  {
    part: 'concept',
    title: '…',
    concept: '한 줄 원리',
    paragraphs: ['2~3문단'],
    bullets: ['2~4개'],
    example: { title: '상황', text: '이럴 땐 이렇게' },      // 선택
    mistakes: ['자주 하는 실수'],                          // 선택
    quiz: [{ q: '10자 이상', a: '20자 이상' }],             // 선택(전체 6개 이상 권장)
    aside: { title: '세트를 갖췄다면', text: '…' },          // 선택: 조건부 이야기를 본문에서 떼어 낼 때
    diagram: { …사격 book-diagrams.cjs 형식… },           // 1부 장마다 하나 권장, 3부·4부 영웅 장에도
    timeline: { …사격 book-timelines.cjs 형식… },         // 2부 단일·오프닝·광역 필수
  },
  …
];
module.exports = {
  researchedAt: '2026-10-10',
  summary: '80자 이상. "이 가이드는 준비 → 원리 → 연습 → 실전 → 심화 순서로 읽도록 짰습니다" 취지 포함',
  book: {
    title: '○○ ○○ 개념서',
    intro: '처음이라면 0부부터 순서대로 … 해 봤다면 위쪽 영웅 특성별 딜사이클 차트를 빠른 참고로 …',
    start: {
      beginner: { label: '처음이세요?', text: '0부 "내 스킬 한눈에 보기"부터 순서대로 읽으세요.' },
      expert: { label: '이미 해 봤다면', text: '영웅 특성별 딜사이클 차트로 바로 가서 확인하세요.' },
    },
    parts: PARTS,
    labels: { concept: '한 줄 원리', example: '이럴 땐 이렇게', diagram: '스킬 구조', timeline: '딜사이클 타임라인', mistakes: '자주 하는 실수', quiz: '확인 문제', skillGroups: '내 스킬', aside: '참고' },
  },
  blocks: BLOCKS,
  evidenceNote: '개념서형 개편(2026-10-10): 기존 검수 본문과 KB 공식 툴팁을 처음 하는 사람이 읽는 순서(준비 → 원리 → 연습 → 실전 → 심화)로 다시 엮었습니다. 우선순위·오프닝·영웅 특성 결론은 바꾸지 않았고, 현장의 목소리는 아직 모으지 않았습니다.',
};
```

### 타임라인(timeline) 규칙 — 사용자가 고른 "사진 형태"
- 굵은 가로줄 위에 스킬 아이콘을 **손이 가는 순서대로** 놓는다. `nodes: [{ skillId, caption? }]` — caption은 아이콘 밑 짧은 말(15자 안팎).
- 조건이 됐을 때 그 자리에 끼워 넣는 스킬(쿨기·발동·대체)은 `above: { skillId, when }` 로 줄 위에 올린다.
- 반복 흐름 줄은 `loop: true`. 영웅 특성별로 끼워 넣는 것만 모은 줄은 `kind: 'inserts'`.
- 2부 "쿨기와 오프닝" 장: 영웅 특성별 오프닝 줄(현재 원고 `heroBranches[].opener.steps` 순서 그대로).
- 2부 "단일 대상" 장: 반복 흐름(loop) + 영웅 특성별 끼워 넣기(inserts). 오프닝 줄은 넣지 않는다(오프닝 장으로 갔다).
- 2부 "광역" 장: 광역 반복 흐름 + 끼워 넣기.
- 순서·조건은 현재 원고의 `heroBranches[].opener/singleTarget/aoe`와 `priority`에서만 가져온다. 줄 하나는 6~10개 아이콘.
- 치유사: 단일 = "한 명 치유/딜 넣기 흐름", 광역 = "광역 치유 흐름"으로 바꿔 쓴다. 탱커: 단일·광역 딜사이클에 방어 유지 스킬을 above로 올린다.

### 흐름도(diagram) 규칙
- `layers` 위에서 아래로 읽는다. 둘째 층부터 `link`(앞 층이 뒤 층에 주는 것). 마지막에 `loop`(선택).
- node: `{ skillId, label, kind?: core|skill|buff|talent|effect, tag?, note? }` — `effect`만 skillId 없이 쓸 수 있다.
- 같은 장 본문에 있는 사실만 쓴다.

## 확인 방법 (끝내기 전에 반드시)
1. `node artifacts/book-rebuild/preview.cjs <가이드 ID>` — 실제 파일을 바꾸지 않고 원고 검사기를 돌린다. **"이 가이드 관련 오류"가 0개**가 될 때까지 고친다.
   (다른 가이드 오류로 hunter-marksmanship 이 보이면 조율 담당이 고치는 중이니 무시)
2. `artifacts/book-rebuild/<가이드 ID>/preview.json` 에서 장 순서·문장을 다시 읽어 본다.
3. 원고에 쓴 모든 skillId가 kb-skills.json에 있고, 그 전문화가 실제로 쓰는 스킬인지 확인한다.

## 하지 말 것
- KB 정본·원고 파일(`src/data/manuscripts/*.js`, `guideManuscripts.js`)·GuideDetailPage.js·검사기·kb-skills.json 수정, `npm run sync-kb`·빌드·배포·git 커밋(조율 담당이 한다).
- WebFetch로 Wowhead 접근. 새 스크래퍼 작성.
- 기존 특성 견본(talentBuilds)·로그 검수(logReview)·heroBranches·priority·opener·sources 를 바꾸는 것(content.cjs에 넣지 않으면 그대로 유지된다).

## 앞선 작업자에게서 나온 보충 (2026-10-10)
- 화면에 보이는 문장에 "원고"라는 낱말을 쓰지 않는다(원고 검사기 금지어). "본문"으로 쓴다. "누르는 버튼" 같은 표현도 문구 검사에 걸리니 "쓰는 스킬"로 쓴다.
- preview.cjs 는 원고 검사기와 문구 검사기를 함께 돌린다. "문구 검사 오류"도 0개여야 한다.
- 영웅 특성별 오프닝(`heroBranches[].opener`)이 기본 빌드의 오프닝이 아니라 변형이면, 맨 위 `opener`(기본 오프닝)를 첫 줄로 쓰고 변형은 따로 줄을 만들어 이름을 밝힌다.
- 공식 이름이 영어로만 있는 세트·효과는 이름을 번역하지 말고 "시즌 2 4세트"처럼 기능으로 적는다.
- 사이트에 한글 이름이 없는 던전·네임드는 이름을 쓰지 않는다.

## 2라운드 추가 (2026-10-10)
- 이미 반영된 개념서 예시(같은 역할부터 참고): 탱커 `deathknight-blood/content.cjs`, 치유사 `priest-discipline/content.cjs`, 근접 `demonhunter-havoc/content.cjs`, 원거리 `mage-fire/content.cjs`, 기준 샘플 `../mm-concept-sample/book-content.cjs`.
- 끝내기 전 확인은 세 가지 모두 0개여야 한다.
  1. `node artifacts/book-rebuild/preview.cjs <ID>` — 이 가이드 관련 오류·문구 검사 오류 0개
  2. `node artifacts/book-rebuild/factcheck.cjs <ID>` — 스킬 ID 누락·다른 전문화 스킬·오프닝 순서 불일치는 반드시 고친다. "숫자 못 찾음"은 원본 로그(`logReview.individual.combats[].durationMs·casts`)에서 계산한 값이나 확인 문제의 가정 수치면 그대로 둬도 되지만, 그 밖의 숫자는 근거를 찾거나 지운다.
  3. `node artifacts/book-rebuild/regress.cjs <ID>` — 전문화 전용 검사 스크립트가 기대하는 문구가 깨지면, 같은 사실을 새 본문에 담아 살린다. 사실이 바뀐 경우가 아니면 검사 스크립트 쪽을 고쳐 달라고 하지 않는다.
- `apply.cjs`·`npm run sync-kb`는 돌리지 않는다(여러 작업자가 같은 원고 파일을 동시에 쓰면 서로 지운다). 반영은 조율 담당이 한꺼번에 한다.
- 원본 로그 기록의 영어 네임드·던전 이름(Nymrissa Wavecaller, Altar of Fangs 등)은 화면 문장에 옮기지 않는다. 사이트 표기가 있는 네임드(님리사 등)만 한글로 쓰고, 없으면 "신화 네임드", "쐐기 20단"처럼 쓴다.
