# 12.1.5 이후 로그 대조 — 영웅 특성 결론·특성 견본 정정 지침 (조율: t1 Claude, 2026-10-19)

## 배경
- 12.1.5는 미국 2026-10-13 적용. 12.1.5 이후 WCL 랭킹 상위 행 집계: `C:\wowmeta\site\artifacts\goal-12.1.5-r5\logs\summary.md`(전문화별 절 `### <가이드 ID>`), `summary.json`, `judged.json`, `combats\`(시전 표). 기준: KR 이외 2026-10-13T15:00Z 이후, KR 2026-10-15T06:00+09:00 이후(한국 적용 시각 미확인이라 보수적). 레이드는 WCL 12.1.5 파티션, 쐐기는 시즌 2 파티션의 상위 100행 중 12.1.5 이후 행(높은 단수 쪽 치우침). 랭킹 상위 행 = 전체 사용률이 아님(특히 치유사 HPS 랭킹은 성능 우열 증거로 약함).
- 영웅 판정 근거 트리: `C:\wowmeta\site\artifacts\goal-12.1.5\talents\trait_data.inc`(SimC midnight 5537d881, 12.1.5.70448).

## 판단 규칙
1. 전문화×콘텐츠(단일·쐐기·레이드)마다 (a) 12.1.5 이후 로그 다수 영웅, (b) 12.1.5에 맞춰 갱신된 공개 저자 추천(Icy Veins·Wowhead·Method 등, 페이지의 갱신일·패치 표기를 반드시 확인)을 본다.
2. (a)와 (b)가 같은 쪽이면 그 영웅을 해당 콘텐츠의 기본으로 정정한다. 둘이 다르면 기본을 바꾸지 말고, 원고에 "12.1.5 이후 상위 로그는 X가 n%로 다수, 공개 저자는 Y를 권함"처럼 두 근거를 함께 적는다. 공개 저자가 12.1.5판으로 갱신되지 않았으면 그 사실을 적고 로그를 우선 근거로 쓰되 "확정 순위 아님"을 유지한다.
3. 수치·효과는 KB 노트(`C:\wowmeta\kb\08-직업별-Knowledge-Base\...`)와 현재 원고에 있는 것만 쓴다. 새 메커니즘·수치를 지어내지 않는다. 스킬 이름은 `src/data/kb-skills.json` 한국어 이름 그대로(`npm run kb:brief -- <ID>` / `--find <낱말>`, 사이트 폴더에서).
4. 용어 고정: 네임드, 쫄(쫄이·쫄을·쫄은·쫄과), 딜사이클, 오프닝, 쐐기, 공격대, 글쿨, 쿨기, 탱커, 극딜, 발동, 유지율. 금지: 우두머리·졸개·로테이션·오프너·신화+·프록.
5. Wowhead는 WebFetch 금지. 공개 페이지는 Playwright 도구로 연다: 본문 글자 `node C:\wowmeta\site\artifacts\goal-12.1.5-r5\page.cjs <url> <저장 파일>`, 특성 코드가 있는 빌드 페이지 `node C:\wowmeta\site\artifacts\goal-12.1.5\talents\fetch-guide.cjs <key> <url>`(→ talents\pages\<key>.json/.txt), 툴팁 한 건 `node C:\wowmeta\site\artifacts\goal-12.1.5-r5\tip.cjs <spellId>`. 새 일괄 수집기 작성 금지. 저장한 원문은 `artifacts\goal-12.1.5-r5\src\` 에 둔다.

## 고칠 수 있는 파일 (담당 전문화만)
- 개념서 본문: `C:\wowmeta\site\artifacts\book-rebuild\<가이드 ID>\content.cjs` (사격만 다른 경로 — 이번 담당에 없음)
- KB 정본 `C:\wowmeta\kb\08-직업별-Knowledge-Base\<직업>\<전문화>\Meta\guide-12.1.json` 의 blocks·book·patch·status 를 **제외한** 필드: summary, playstyle, sources, evidence, caveats, heroBranches(문장·bullets·opener 설명; **배열 순서는 바꾸지 않는다**), tips, priority, opener, logReview(heroConclusion 등), talentBuilds, 필요하면 최상위 `defaultHeroBranchIndex`(0/1; 냉기 죽음의 기사 정본이 예시). JSON은 읽고 → 고치고 → 2칸 들여쓰기 + 끝 줄바꿈으로 다시 쓴다. 다른 필드 순서를 바꾸지 않는다.
  - 주의: 최상위 `opener`는 기본 영웅 분기의 opener와 같아야 하는 검사가 있을 수 있다(예: 징벌 `heroBranches[0].opener`). `scripts\validate-guide-manuscripts.js`·`scripts\verify-*.cjs`에서 내 가이드 ID·한글 전문화명으로 grep 해서 전용 규칙을 먼저 읽고 지킨다. 규칙과 정정이 충돌하면 규칙을 고치지 말고 보고한다(조율 담당이 고침).
- 고치면 안 되는 것: 다른 전문화, `src/` 아래 모든 파일, `scripts/`, `kb-skills.json`·`kb-synergies.json`, KB 스킬 노트(필요하면 보고만). `apply.cjs`, `npm run sync-kb`, 빌드, git, 배포 금지.

## 개념서(content.cjs) 정정 방법
- 목차 뼈대 유지: book.parts id 순서 start → concept → drill → field → review, 0부는 "내 스킬 한눈에 보기" 한 장, 장 수 14~17. 3부 ①장 = 기본 영웅 특성 운용, 4부 ①장 = 다른 영웅 특성. 기본 영웅이 바뀌면 두 장의 내용(제목·개념·본문·타임라인 등)을 맞바꾸고 앞뒤 장의 "다른 영웅 특성" 언급·부 요약(book.parts[].summary)·book.summary/intro 를 맞춘다. 콘텐츠마다 갈리면 "레이드는 A, 쐐기는 B"처럼 3부 ①에 쓰고 4부 ①에 다른 쪽.
- 2부 타임라인은 기본 영웅 기준이면 그에 맞게 영웅 전용 스킬 캡션을 바꾼다. 기존 사실 범위에서만.
- 로그 근거 문장은 "12.1.5 이후(10월 13일 미국 적용 뒤) WCL 상위 랭킹 n행 중 X m%"처럼 쓰고 "전체 사용률이 아님"을 붙인다. 예전 로그 수치는 지우지 말고 "12.1.5 적용 전 기록" 주의를 단다.
- 원본 형식은 `C:\wowmeta\site\artifacts\book-rebuild\BRIEF.md` 참고.

## 특성 견본(talentBuilds) 정정 방법
- 바꾸는 조건: 그 콘텐츠의 기본 영웅을 정정했는데 견본이 다른 영웅일 때만. 단일·쐐기·레이드 3개 구성과 id·label 유지.
- 새 코드 출처 우선순위: 12.1.5판 공개 빌드 페이지의 해당 영웅·콘텐츠 코드(Wowhead `https://www.wowhead.com/ko/guide/classes/<class>/<spec>/talent-builds-pve-<role>` 등, fetch-guide.cjs). 없으면 Icy Veins 빌드 페이지의 코드.
- 검증: `node C:\wowmeta\site\artifacts\goal-12.1.5\talents\check-codes.cjs <가이드 ID> <label=code>` 가 OK(포인트 34/34/12~13, 남는 비트 정상)이고 hero 가 기대 트리여야 한다. 그다음 `node C:\wowmeta\site\artifacts\goal-12.1.5\talents\calc-check.cjs <out.json> <code>` 로 한국어 계산기 포인트·선택 가능·부모 연결을 확인하고, 결과의 points·sha256 으로 기존 항목과 같은 구조의 `validation`(specId, heroTreeId, points, checkedAt "2026-10-19", traitDataCommit "5537d8813dfc59707927722b1e23ffa6fd67ee59", gameBuild "12.1.5.70448", browser{checkedAt, points, parentConnections, available, sha256}, scope 문구)을 채운다. code·url(`https://www.wowhead.com/ko/talent-calc/blizzard/<code>`)·sourceUrl·sourceLabel·checkedAt·note·heroLabel 도 갱신. 기존 항목의 키 순서를 따른다.
- 검증을 통과한 코드를 못 구하면 견본은 그대로 두고 원고·caveats 에 "견본은 Y, 12.1.5 이후 로그 다수는 X"를 적고 보고한다.

## 끝나면 (사이트 폴더 C:\wowmeta\site 에서, 담당 전문화마다)
- `node artifacts/book-rebuild/preview.cjs <ID>`(오류 0), `node artifacts/book-rebuild/factcheck.cjs <ID>`, `node artifacts/book-rebuild/regress.cjs <ID>`(깨짐 0)
- 보고: 전문화×콘텐츠별 (로그 다수, 공개 저자 12.1.5판 추천, 최종 결론, 견본 교체 여부·새 코드 출처), 바꾼 장, 검사 결과, 조율 담당에게 넘길 검사기 충돌.
