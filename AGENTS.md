# WoWmeta 작업 규칙

- 가이드나 로그 분석을 수정할 때 관련 원본 KB와 생성 DB를 같은 작업에서 함께 갱신한다.
- 새 스킬·특성은 `extraSkills`로 우회하지 말고 `WoW-Meta-Knowledge/08-직업별-Knowledge-Base`에 먼저 기록한 뒤 `npm run sync-kb`를 실행한다.
- 검증을 통과한 KB 생성 JSON과 사이트 변경을 같은 커밋으로 푸시한다.
- 가이드 원고는 `src/data/manuscripts/<전문화>.js`(전문화마다 파일 하나, 파일 이름 = 가이드 ID, 예: `mage-frost.js`)에 있다. 한 전문화만 고칠 때 그 파일만 읽는다. `src/data/guideManuscripts.js`는 그 파일들을 모으기만 한다(검사 스크립트는 `scripts/lib/guideManuscripts.cjs`로 읽는다).
- 전문화의 스킬·특성·영웅 특성은 `npm run kb:brief -- <가이드 ID>`로 한 번에 본다(`--find <낱말>` 찾기, `--id <Spell ID>` 하나만 전체, `--full` 설명 전체). KB 노트는 고치거나 새로 쓸 때만 연다.
- 작업 중 검증은 `npm run validate:quiet`로 한다. 고친 범위의 단계만 줘도 된다(예: `npm run validate:quiet -- guide-copy guide-manuscripts`). 끝낼 때 인자 없이 전체를 한 번 돌린다. 실패한 단계의 전체 출력은 `logs/validate-last.log`에 있다.
- `npm run sync-kb`는 KB를 고친 뒤 한 번만 돌린다(전체 검증의 첫 단계가 한 번 돌리므로 그 앞뒤로 따로 돌리지 않는다).
- 배포본을 파일 목록으로 만들 때 `src/data/manuscripts/`와 `scripts/lib/guideManuscripts.cjs`를 빼먹지 않는다.
- 레이드 가이드(`/raid`, `src/pages/RaidGuidePage.js`)의 글은 KB `08-직업별-Knowledge-Base/00-공통/공용/Meta/raid-guide.json` 하나가 정본이다. 고친 뒤 `npm run sync-kb`로 `src/data/raidGuide.json`을 다시 만들고(직접 고치지 않음), `npm run validate:raid-guide`와 `src/pages/RaidGuidePage.test.js`로 확인한다. 본문 속 직업 스킬은 `skills`, 네임드 기술은 `spells`(번호·아이콘은 한국어 공식 툴팁으로 확인)에 등록해야 아이콘·툴팁이 붙는다.
- 쐐기 가이드(`/mythicplus`, `src/pages/MythicPlusGuidePage.js`)의 정본은 KB `00-공통/공용/Meta/mythicplus-guide.json` 하나다. 이 파일과 그림(`public/images/mythicplus`)은 ai-hub 스토리보드(`workspace/outputs/mythicplus-dungeon-storyboard-20261026`)에서 `artifacts/mythicplus-20261028/build.py`로 만든다(요령·풀링·몹 글을 고치려면 스토리보드 자료를 고치고 다시 돌린다). `npm run sync-kb`가 `src/data/mythicPlusGuide.json`을 만들고, `npm run validate:mythicplus-guide`와 `src/pages/MythicPlusGuidePage.test.js`로 확인한다. 던전 영상 번호는 정본의 `dungeons[].video.youtubeId`에 넣는다(비어 있으면 영상 칸을 그리지 않는다). 번호는 `artifacts/mythicplus-20261028/apply-youtube-ids.py`가 ai-hub 업로드 기록(`outputs/mythicplus-dungeon-storyboard-20261026/youtube-upload.json`, 와우메타 채널 공개분만)에서 정본과 `youtube-ids.json`에 넣고, `build.py`는 `youtube-ids.json`을 읽어 다시 돌려도 번호를 지우지 않는다. 몹 스킬 설명은 와우헤드 한국어·게임 공식 문장 그대로이고 임의로 쓰지 않는다.

## 가이드 용어 (사용자 고정, 2026-10-10)

- 보스는 "네임드"로 쓴다. "우두머리"로 바꾸지 않는다.
- 잡몹·추가로 나오는 적은 "쫄"로 쓴다. "졸개"로 바꾸지 않는다. 받침이 있으므로 조사는 "쫄이·쫄을·쫄은·쫄과"로 쓴다.
- 문장을 다듬거나 게임 용어로 바꿀 때도 이 두 용어는 유지한다. 개념서형(`book`) 가이드는 `validate-guide-manuscripts.js`가 검사한다.

## 검색 노출 (2026-10-22)

- 페이지별 제목·설명·대표 주소(canonical)는 `src/data/siteMeta.js`가 정하고 `src/components/RouteMeta.js`가 붙인다. 새 페이지 경로를 만들면 `STATIC_PAGES`에 넣는다.
- `public/sitemap.xml`은 `npm run seo:sitemap`으로 만든다(직접 고치지 않음). 가이드·레이드 편·로그 리포트가 늘거나 경로가 바뀌면 다시 만든다. `npm run validate:seo`가 목록과 다르면 막는다.
- `public/google2591626ad1cc3f8d.html`은 구글 서치 콘솔 소유 확인 파일이다. 지우면 확인이 풀린다(속성 `https://wowmeta.vercel.app/`, sunwait777 계정).

## 홈 화면·로그 분석 (2026-10-23)

- 홈(`src/pages/HomePage.js`)은 유튜브 첫 화면처럼 분류 칩 → 재생목록별 기본편 줄(탱커·힐러·근딜·원딜) → 직업 심화편 줄(직업별 묶음) → 레이드 가이드 줄(신화·영웅 링크) → 쐐기 가이드 줄(던전 영상 링크) → 바로가기 순서다. 머리글·부제는 두지 않고 '와우가 처음이신가요?' 안내만 맨 위에 둔다(사용자 지시).
- 심화편 줄과 기본편 칸의 '심화편' 링크는 원고의 `advancedVideo`를 그대로 읽는다(따로 적지 않음). 영상은 계속 늘거나 바뀌므로 홈에 영상·편 개수를 적지 않는다(2026-11-02 지시, `validate:home`이 막는다).
- 영상·재생목록 번호는 `src/data/youtubePlaylists.js` 하나에 있고 ai-hub `outputs/pixel-guides/youtube-playlists.json`과 같아야 한다. 영상을 바꾸면 둘을 함께 고친다. `npm run validate:home`이 검사한다.
- 로그 분석(`/logs`, `/guide/.../log-analysis/...`)은 상단 메뉴와 가이드 페이지에서 뺐고 주소(링크)로만 연다. 다시 붙이지 않는다(`validate:home`이 막는다).

## 포에버 (2026-11-14)

- 사이트는 상단 토글 `[리테일 | 포에버]`로 게임 버전을 가른다. 버전은 저장하지 않고 주소로만 정한다(`/forever` 아래는 포에버, 나머지는 리테일). 규칙은 `src/data/gameEditions.js`에 있다: 짝이 있는 페이지(`/`↔`/forever`, `/beginner`↔`/forever/start`)는 짝으로, 없으면 그 버전의 홈으로 보낸다. 기존 리테일 주소는 바꾸지 않는다.
- 포에버 글은 `src/data/foreverGuide.js`, 화면은 `src/pages/ForeverPage.js`, 포에버 메뉴는 `Navigation.js`의 `foreverNavItems`다. 공식 사실은 블리자드 한국어 공지로 확인한다. 직업별 특성·종족별 레벨업 안내는 실제 읽은 포에버 전용 외부 가이드도 추려 재구성한다(2026-11-14 사용자 요청). 항목마다 `sources`를 달고 추천·추정과 공식 사실을 구분한다. 읽지 못한 원문을 근거로 쓰지 않는다.
- 직업별 상세는 `/forever/classes/<id>`, 종족별 상세는 `/forever/leveling/<id>`이며 `foreverDetailGuides`가 정본이다. 기존 일곱 쪽 메뉴는 유지하고 상위 목록에서 각 상세로 연결한다. 새 상세는 `siteMeta.js`의 `STATIC_PAGES`와 사이트맵에도 넣는다. 특성 표의 분야별 합계는 연결한 계산기 견본과 같아야 하며 `validate:forever`가 검사한다.
- 포에버 자료를 리테일 KB(`08-직업별-Knowledge-Base`)·`kb-skills.json`·`kb-synergies.json`에 넣지 않는다. 리테일 KB는 주문 번호 하나로 색인해서 서로 덮어쓴다. 포에버 직업·스킬 자료를 만들 때는 KB를 따로 둘 자리부터 정한다.
- 포에버 핵심 특성 설명의 정본은 KB `09-포에버/talents.json`이다. `npm run sync-kb`가 `src/data/foreverTalents.json`으로 복사한다. `verified:false`인 설명은 빈 문자열로 유지하고, 와우헤드 한국어 포에버 개별 주문 화면에서 대조한 뒤 채운다(계산기에 미리 담긴 설명과 실제 툴팁 수치가 다른 항목이 있다). 리테일 스킬과 같은 번호여도 합치지 않는다.
- 포에버 일반 주문은 같은 KB의 `spells.json` → `src/data/foreverSpells.json`으로 동기화한다. 전투 해설·지도 표식·종족 경로는 `src/data/foreverVisuals.json`, 표시 부품은 `src/components/forever/`다. 지도 좌표는 903×640 기준 그림 좌표이며 게임 좌표가 아니다. `marker:false`는 지역 범위만 표시한다. 지형·표식 근거는 `artifacts/forever-visual-20261114/map-evidence.json`, 새 그림 내보내기는 같은 폴더 `export-art.py`다.
- 포에버 그림은 블리자드 공식 아트·공지 스크린샷을 도트로 다시 그린 것이다(2026-11-14 요청). 파일은 `public/images/forever/<id>-<폭>.webp`, 어느 그림을 어디에 쓰는지는 `foreverGuide.js`의 `art`(id·alt·focus)가 정한다. 새 그림은 `artifacts/forever-art-20261114/gen.py`에 지시문을 더해 만들고 `build.py`로 변환한다. 그림에 글자·로고를 넣지 않고, 근거 아래 '실제 게임 화면과 다릅니다' 안내(`FOREVER_ART_NOTE`)를 지우지 않는다. `validate:forever`가 파일·alt·안 쓰는 그림을 검사한다.
- 포에버 페이지를 더하면 `App.js` 경로, `foreverPages`, `foreverNavItems`, `siteMeta.js`의 `STATIC_PAGES`, `npm run seo:sitemap`을 함께 고친다. 검사는 `npm run validate:forever`와 `src/pages/ForeverPage.test.js`, 화면 확인은 `artifacts/forever-20261114/shots.cjs`.
