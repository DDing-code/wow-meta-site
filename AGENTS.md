# WoWmeta 작업 규칙

- 가이드나 로그 분석을 수정할 때 관련 원본 KB와 생성 DB를 같은 작업에서 함께 갱신한다.
- 새 스킬·특성은 `extraSkills`로 우회하지 말고 `WoW-Meta-Knowledge/08-직업별-Knowledge-Base`에 먼저 기록한 뒤 `npm run sync-kb`를 실행한다.
- 검증을 통과한 KB 생성 JSON과 사이트 변경을 같은 커밋으로 푸시한다.
