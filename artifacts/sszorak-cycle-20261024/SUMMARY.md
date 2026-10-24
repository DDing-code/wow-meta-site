# 단일 딜사이클 스조라크 대조 결과 (2026-10-24)

- 근거: 독사의 심연 신화 스조라크(WCL 3420) 12.1.5 구간 랭킹 상위 — 영웅 트리별 전 지역 상위 8 + KR 상위 3, 딜러 27개 전투 356개의 시전 이벤트(풀 8초 전부터). 프리풀은 심크 midnight 3af1a757(2026-10-23) precombat과 Icy Veins·Method 오프닝 글을 함께 봤다.
- 범위: 오프닝·단일 반복만. 광역·쐐기·견본·기본 영웅 탭은 그대로. 포식 '풀링 1초 전 영혼 제물 → 흡수' 유지.
- 도구: fetch-rankings.cjs → analyze.cjs → fetch-events.cjs → fetch-sources.cjs → digest.cjs → patches/<ID>.cjs + apply-patch.cjs → guard.cjs(범위 검사) → shots.cjs(화면).

| 가이드 | 판정 |
|---|---|
| deathknight-frost | 고침 (죽음의 인도자만, 종말의 기수는 로그 없음) |
| deathknight-unholy | 변경 없음 (순서 그대로, 산레인 영웅 탭의 예전 근거 문장만 스조라크 로그로 교체) |
| demonhunter-devourer | 고침 |
| demonhunter-havoc | 고침 (알드라치 영웅 탭 오프닝은 보류) |
| druid-balance | 고침 |
| druid-feral | 고침 |
| evoker-augmentation | 고침(프리풀 시각·근거 문장만, 순서 변경 없음) |
| evoker-devastation | 고침 |
| hunter-beastmastery | 변경 없음 (오프닝 rail note 의 근거 문장만 스조라크로 교체) |
| hunter-marksmanship | 변경 없음 (프리풀 표기·근거 문장만 맞춤) |
| hunter-survival | 고침 (파수꾼 오프닝) / 무리의 지도자는 근거 문장만 교체 |
| mage-arcane | 고침 (성난태양만, 주문술사는 로그 없음) |
| mage-fire | 고침(프리풀 표시·근거 문장만, 순서 변경 없음) |
| mage-frost | 고침(프리풀 표시만) / 서리불꽃 일부 보류 |
| monk-windwalker | 고침 |
| paladin-retribution | 변경 없음 |
| priest-shadow | 고침 |
| rogue-assassination | 고침 (죽음추적자 오프닝은 일부 보류) |
| rogue-outlaw | 변경 없음(프리풀 은신만 추가) |
| rogue-subtlety | 고침(기만자), 죽음추적자는 프리풀만 |
| shaman-elemental | 일부 고침 (순서 변경 없음, 근거·화염 충격 보탬) |
| shaman-enhancement | 고침 (폭풍인도자만, 토템술사는 로그 없음) |
| warlock-affliction | 고침 |
| warlock-demonology | 고침(악마학자만, 영혼 수확자는 로그 없음) |
| warlock-destruction | 고침(악마학자 오프닝·두 영웅 특성 프리풀 표시) / 지옥소환사 풀링 뒤 순서는 변경 없음 |
| warrior-arms | 고침 (학살자만, 거신은 로그 없음) |
| warrior-fury | 고침 |

가이드별 근거·보류는 reports/<ID>.md, 바뀐 줄은 patches/<ID>.diff.md.
