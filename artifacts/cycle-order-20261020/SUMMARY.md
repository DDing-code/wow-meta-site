# 딜사이클 순서 대조 결과 (2026-10-20)

- 근거: 12.1.5 이후 WCL 랭킹 상위 전투 787개(영웅 트리별 전 지역 상위 5 + KR 상위 3)의 실제 시전 이벤트, 심크 midnight APL(d91a5707, 2026-10-19), 기존 원고의 공개 가이드 출처. 로그와 공개 자료가 다르면 상위 로그를 따랐다(사용자 결정).
- 탱커 6개: 영웅 탭을 딜사이클(오프닝·레이드 단일·쐐기 광역)과 탱사이클(레이드·쐐기, 각 특성 견본 연결)로 나누고, 3부 쐐기·공격대 장에 탱사이클 타임라인을 넣었다.
- 도구: fetch-events.cjs(시전 이벤트) → digest.cjs(대조 자료 digests/) → patches/<ID>.cjs + apply-patch.cjs(KB 정본·원고·변경 기록 동시 갱신) → shots.cjs·caplines.cjs(화면 확인).

| 가이드 | 판정 |
|---|---|
| deathknight-blood | 고침 (죽음의 인도자 쐐기 탱사이클만 로그 없이 APL 기준 참고용) |
| deathknight-frost | 고침 (죽음의 인도자만. 종말의 기수는 12.1.5 이후 상위 로그 0개라 그대로) |
| deathknight-unholy | 고침 |
| demonhunter-devourer | 고침(일부 보류) |
| demonhunter-havoc | 일부 보류 |
| demonhunter-vengeance | 고침 / 일부 보류 (알드라치 두 강화 순서, 알드라치 쐐기 탱사이클) |
| druid-balance | 고침 |
| druid-feral | 고침 |
| druid-guardian | 고침 (발톱의 드루이드는 일부 보류) |
| druid-restoration | 고침(일부 보류) |
| evoker-augmentation | 고침 (시간 감시자만, 비늘사령관 보류) |
| evoker-devastation | 고침 (비늘사령관만. 불꽃형성자는 레이드 로그가 없어 그대로) |
| evoker-preservation | 고침(일부 보류) |
| hunter-beastmastery | 변경 없음(무리의 지도자 오프닝 rail note에 "로그마다 다름" 한 문장만 추가) |
| hunter-marksmanship | 고침(최소, 광역 rail 한 줄) |
| hunter-survival | 고침(일부 보류) |
| mage-arcane | 고침 (성난태양만. 주문술사는 로그가 없어 그대로) |
| mage-fire | 고침 (성난태양만. 서리불꽃은 로그가 없어 그대로) |
| mage-frost | 일부 보류 (고친 것과 보류한 것이 함께 있음) |
| monk-brewmaster | 고침 |
| monk-mistweaver | 고침 |
| monk-windwalker | 고침 |
| paladin-holy | 일부 보류 (태양의 사자 고침 · 빛의 대장장이 보류) |
| paladin-protection | 고침 (일부 보류) |
| paladin-retribution | 변경 없음 (evidence에 대조 기록만 추가) |
| priest-discipline | 고침 (공허술사 오프닝) · 예언자는 변경 없음(note만 보강) |
| priest-holy | 고침 (예언자) · 집정관은 변경 없음(상위 로그 없음) |
| priest-shadow | 고침 (일부 보류) |
| rogue-assassination | 고침 |
| rogue-outlaw | 고침 (운명결속은 일부 보류) |
| rogue-subtlety | 고침 |
| shaman-elemental | 고침 (폭풍인도자 일부 보류) |
| shaman-enhancement | 고침 (토템술사 변경 없음) |
| shaman-restoration | 고침(일부 보류) |
| warlock-affliction | 고침 (지옥소환사 광역 일부 보류) |
| warlock-demonology | 고침 (악마학자 오프닝 뒷부분만, 영혼 수확자 보류) |
| warlock-destruction | 고침 (두 영웅 특성 오프닝만) |
| warrior-arms | 고침 (학살자만. 거신은 12.1.5 이후 상위 로그 0개라 그대로) |
| warrior-fury | 고침 (일부 그대로 — 공통 rail·산왕 오프닝) |
| warrior-protection | 고침 (일부 보류) |

가이드별 근거·보류·사용자 확인 사항은 reports/<ID>.md, 바뀐 순서 전후는 patches/<ID>.diff.md.
