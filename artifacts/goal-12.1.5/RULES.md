# 12.1.5 반영 공통 규칙 (조율: t1 Claude, 2026-10-18)

배경: 12.1.5는 미국 2026-10-13 라이브. 근거는 이 폴더의 changes.json·changes-summary.md·notes-ko.txt·notes-en.txt·hotfix-*.txt.
공식 노트 URL: https://worldofwarcraft.blizzard.com/ko-kr/news/24304162 (영문 en-us 같은 번호), 12.1.5 이후 핫픽스: https://news.blizzard.com/ko-kr/article/24307310

## 고쳐도 되는 것 (담당 전문화만)
- KB 정본 `C:\wowmeta\kb\08-직업별-Knowledge-Base\<직업>\<전문화>\Meta\guide-12.1.json` 의 blocks·book 을 **제외한** 필드
  (summary, playstyle, sources, evidence, caveats, heroBranches, tips, priority, opener, logReview 의 설명 문장).
  ※ blocks·book 은 `C:\wowmeta\site\artifacts\book-rebuild\<가이드 ID>\content.cjs` 에서 고친다(사격만 `artifacts\mm-concept-sample\book-*.cjs`).
  ※ JSON은 읽고 → 고치고 → 2칸 들여쓰기로 다시 쓴다. 다른 필드 순서를 바꾸지 않는다.
- KB 스킬 노트(`Skills|Talents|Hero-Talents\*.md`): 12.1.5에서 바뀐 수치·동작만. 고친 노트는 frontmatter `patch: "12.1.5"`, `verified_date: "2026-10-18"`, source 에 `"patch_notes_1215":"https://worldofwarcraft.blizzard.com/ko-kr/news/24304162"` 추가. 새 노트는 `C:\wowmeta\kb\99-META\KB-FORMAT-12.0.5.md` 형식.
- 한국어 툴팁 확인은 Playwright(`F:\01_프로젝트\90_개발\wowmeta\node_modules\playwright`, 일반 Chrome 사용자 에이전트)로 `https://nether.wowhead.com/tooltip/spell/<id>?locale=1` 을 열어 읽는다. WebFetch로 Wowhead 금지. 새 스크래퍼(일괄 수집기) 금지 — 필요한 주문만 하나씩 본다.

## 고치면 안 되는 것
- 정본의 `patch`·`status` 필드(조율 담당이 40개를 한꺼번에 바꾼다), `talentBuilds`(특성 견본 감사 담당이 따로 제안), 다른 전문화, src/ 아래 파일, scripts/ 검사기, kb-skills.json.
- `apply.cjs`, `npm run sync-kb`, 빌드, git, 배포 (사격 담당만 `artifacts/mm-concept-sample/apply.cjs` 허용).

## 쓰는 법
- 한국어 문구는 공식 한국어 노트 표현을 따른다. 임의 수치·임의 번역 금지. 근거 없는 딜사이클 결론 변경 금지.
- "12.1.5 적용 전/예고/PTR" 문장은 "10월 13일(미국) 적용" 사실로 바꾼다. 본문 화면 문장에는 패치 번호 대신 "10월 13일 적용된 변경"처럼 써도 된다.
- 로그 근거(logReview, 비교 전투)는 12.1.5 전 기록이므로, 바뀐 스킬과 관련된 결론에는 "적용 전 기록" 주의를 짧게 단다. 로그 수치를 지우지 않는다.
- sources 에 12.1.5 노트 항목이 없으면 추가: `{ "label": "Blizzard 12.1.5 콘텐츠 업데이트 노트", "url": "https://worldofwarcraft.blizzard.com/ko-kr/news/24304162", "tier": (같은 정본의 기존 공식 노트 항목과 같은 값), "updated": "2026-10-02 게시 / 2026-10-13 적용 / 2026-10-18 확인", "note": "<이 전문화 관련 변경 한 줄>" }` — 기존 항목 키 구성을 따라 한다. 이미 있으면 updated·note 를 고친다.
- 끝나면 사이트 폴더에서 담당 전문화마다: `node artifacts/book-rebuild/preview.cjs <ID>`(오류 0), `node artifacts/book-rebuild/factcheck.cjs <ID>`, `node artifacts/book-rebuild/regress.cjs <ID>`(깨짐 0).
