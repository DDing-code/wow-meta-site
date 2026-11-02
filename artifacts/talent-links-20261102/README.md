# 특성 ↔ 스킬 연결 도식 — 영상 v10을 만든 8개 가이드로 넓힘 (2026-11-02)

- 요청: "사이트 글/기초 가이드에도 상호연동 해주고". 영상 v10(전사·성기사·사냥꾼)에 쓴 특성 ↔ 스킬 연결 표를 사이트 가이드 글에도 넣는다.
- 표: ai-hub `outputs/pixel-guides/engine/talent-links/tables/<id>.cjs`의 사본(영상과 같은 연결). 무기 전사는 2026-11-01 `talent-links-20261101`에서 이미 넣었다.
- 적용: `node artifacts/talent-links-20261102/apply.cjs <id>` (원본 `orig/<id>.json`, 원고·KB 정본 동시, 글은 바꾸지 않음, KB patch-changelog 한 번 기록).
- 대상: warrior-fury, warrior-protection, paladin-holy, paladin-protection, paladin-retribution, hunter-beastmastery, hunter-marksmanship, hunter-survival.
- 2026-11-02 오후 도적 심화편 업로드('업로드/사이트 상호보완')와 함께 rogue-assassination, rogue-outlaw, rogue-subtlety 도 넣었다(`_rogue.cjs`, 영상 표 사본). 붙는 스킬이 없는 암살 엉겅퀴 차 두 상자(469779·1298826)는 affects 칸을 만들지 않고, 검사기가 이 둘만 예외로 둔다.
- 2026-11-02 오후 사제 심화편 업로드('업로드/사이트 상호보완')와 함께 priest-discipline, priest-holy, priest-shadow 도 넣었다(`_priest.cjs`, 영상 표 사본). 신성 궁극의 평온(1246517)은 KB 노트 종류가 `atomic-talent` 하나뿐이라 검사기 TIMELINE_TALENT_TYPES 에 그 종류를 더했다.
- 2026-11-02 오후 죽음의 기사 심화편 업로드('진행시켜')와 함께 deathknight-frost, deathknight-unholy, deathknight-blood 도 넣었다(`_deathknight.cjs`, 영상 표 사본). 기수의 용사(444005)·신속하고 고통스럽게(443560)는 붙는 스킬이 없어 affects 칸을 만들지 않는다. 혈기 탐식(273953)·피의 희열(317614)은 KB 노트 type 이 atomic-skill 로 잘못 적혀 있어 talent 로 바로잡고 sync-kb 했다.
- 2026-11-02 오후 주술사 심화편 업로드('사이트/유튜브 동기화 작업 ㄱㄱ')와 함께 shaman-elemental, shaman-enhancement, shaman-restoration 도 넣었다(`_shaman.cjs`, 영상 표 사본). 격류(200072)는 KB 종류가 시전 스킬이라 흐름도 상자 연결만 있고 타임라인 특성 칸에는 넣지 않는다.
- 순서 주의: 특성 연결을 넣은 뒤 원고가 바뀌면(심화편 단추 등) `refresh-orig.cjs <id>`로 원본 스냅샷을 다시 맞춘 다음에 apply.cjs 를 돌린다. 2026-11-02 사냥꾼 단추를 넣은 뒤 8개 모두 다시 맞췄다.
