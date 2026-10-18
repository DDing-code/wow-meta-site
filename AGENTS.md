# WoWmeta 작업 규칙

- 가이드나 로그 분석을 수정할 때 관련 원본 KB와 생성 DB를 같은 작업에서 함께 갱신한다.
- 새 스킬·특성은 `extraSkills`로 우회하지 말고 `WoW-Meta-Knowledge/08-직업별-Knowledge-Base`에 먼저 기록한 뒤 `npm run sync-kb`를 실행한다.
- 검증을 통과한 KB 생성 JSON과 사이트 변경을 같은 커밋으로 푸시한다.
- 가이드 원고는 `src/data/manuscripts/<전문화>.js`(전문화마다 파일 하나, 파일 이름 = 가이드 ID, 예: `mage-frost.js`)에 있다. 한 전문화만 고칠 때 그 파일만 읽는다. `src/data/guideManuscripts.js`는 그 파일들을 모으기만 한다(검사 스크립트는 `scripts/lib/guideManuscripts.cjs`로 읽는다).
- 전문화의 스킬·특성·영웅 특성은 `npm run kb:brief -- <가이드 ID>`로 한 번에 본다(`--find <낱말>` 찾기, `--id <Spell ID>` 하나만 전체, `--full` 설명 전체). KB 노트는 고치거나 새로 쓸 때만 연다.
- 작업 중 검증은 `npm run validate:quiet`로 한다. 고친 범위의 단계만 줘도 된다(예: `npm run validate:quiet -- guide-copy guide-manuscripts`). 끝낼 때 인자 없이 전체를 한 번 돌린다. 실패한 단계의 전체 출력은 `logs/validate-last.log`에 있다.
- `npm run sync-kb`는 KB를 고친 뒤 한 번만 돌린다(전체 검증의 첫 단계가 한 번 돌리므로 그 앞뒤로 따로 돌리지 않는다).
- 배포본을 파일 목록으로 만들 때 `src/data/manuscripts/`와 `scripts/lib/guideManuscripts.cjs`를 빼먹지 않는다.

## 가이드 용어 (사용자 고정, 2026-10-10)

- 보스는 "네임드"로 쓴다. "우두머리"로 바꾸지 않는다.
- 잡몹·추가로 나오는 적은 "쫄"로 쓴다. "졸개"로 바꾸지 않는다. 받침이 있으므로 조사는 "쫄이·쫄을·쫄은·쫄과"로 쓴다.
- 문장을 다듬거나 게임 용어로 바꿀 때도 이 두 용어는 유지한다. 개념서형(`book`) 가이드는 `validate-guide-manuscripts.js`가 검사한다.
