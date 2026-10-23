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

## 가이드 용어 (사용자 고정, 2026-10-10)

- 보스는 "네임드"로 쓴다. "우두머리"로 바꾸지 않는다.
- 잡몹·추가로 나오는 적은 "쫄"로 쓴다. "졸개"로 바꾸지 않는다. 받침이 있으므로 조사는 "쫄이·쫄을·쫄은·쫄과"로 쓴다.
- 문장을 다듬거나 게임 용어로 바꿀 때도 이 두 용어는 유지한다. 개념서형(`book`) 가이드는 `validate-guide-manuscripts.js`가 검사한다.

## 검색 노출 (2026-10-22)

- 페이지별 제목·설명·대표 주소(canonical)는 `src/data/siteMeta.js`가 정하고 `src/components/RouteMeta.js`가 붙인다. 새 페이지 경로를 만들면 `STATIC_PAGES`에 넣는다.
- `public/sitemap.xml`은 `npm run seo:sitemap`으로 만든다(직접 고치지 않음). 가이드·레이드 편·로그 리포트가 늘거나 경로가 바뀌면 다시 만든다. `npm run validate:seo`가 목록과 다르면 막는다.
- `public/google2591626ad1cc3f8d.html`은 구글 서치 콘솔 소유 확인 파일이다. 지우면 확인이 풀린다(속성 `https://wowmeta.vercel.app/`, sunwait777 계정).

## 홈 화면·로그 분석 (2026-10-23)

- 홈(`src/pages/HomePage.js`)은 유튜브 첫 화면처럼 분류 칩 → 재생목록별 영상 줄(탱커·힐러·근딜·원딜) → 레이드 가이드 줄 → 바로가기 순서다. 머리글·부제는 두지 않고 '와우가 처음이신가요?' 안내만 맨 위에 둔다(사용자 지시).
- 영상·재생목록 번호는 `src/data/youtubePlaylists.js` 하나에 있고 ai-hub `outputs/pixel-guides/youtube-playlists.json`과 같아야 한다. 영상을 바꾸면 둘을 함께 고친다. `npm run validate:home`이 검사한다.
- 로그 분석(`/logs`, `/guide/.../log-analysis/...`)은 상단 메뉴와 가이드 페이지에서 뺐고 주소(링크)로만 연다. 다시 붙이지 않는다(`validate:home`이 막는다).
