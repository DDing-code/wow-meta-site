# Inactive Fury talent records

Checked 2026-09-22 against SimC revision 774babde5ddc7c5fc9f1abb129b473f8a076df70 (12.1.0.69875).

The following IDs are absent from trait_data.inc and specialization_spells.inc; neither their IDs nor corresponding named implementation exists in sc_warrior.cpp:

| ID | Korean name | English name |
| --- | --- | --- |
| 383459 | 신속한 일격 | Swift Strikes |
| 383922 | 광기의 심연 | Depths of Insanity |
| 388004 | 학살의 일격 | Slaughtering Strikes |
| 388049 | 분노의 무장 | Raging Armaments |
| 389603 | 걷잡을 수 없는 야성 | Unbridled Ferocity |
| 391683 | 춤추는 칼날 | Dancing Blades |
| 392536 | 잿빛 돌격 | Ashen Juggernaut |
| 394329 | 티탄의 분노 | Titanic Rage |

Their historical Wowhead tooltip names/effects still resolve, but that is not proof of current learnability. No historical removal date or replacement talent is claimed here.

Deleted canonical notes, sync mappings and graph participant/related-ID references. Removed prose predicated on these talents rather than substituting unverified equivalents. Current guide manuscript and chart renderer had no direct references to these eight names, so they were left unchanged. Generated spell and synergy DB were synchronized.

The absence scan also returned Last Stand, Shield Slam, Enrage, replacement attacks and triggered effects. Those were NOT deleted: absence from these two learnability tables alone is insufficient for non-talent spell records. Their individual grant/trigger paths remain to be checked. Full warrior migration is still open.

Sources:
- https://raw.githubusercontent.com/simulationcraft/simc/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/trait_data.inc
- https://raw.githubusercontent.com/simulationcraft/simc/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/specialization_spells.inc
- https://raw.githubusercontent.com/simulationcraft/simc/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/class_modules/sc_warrior.cpp
- https://www.wowhead.com/guide/classes/warrior/fury/overview-pve-dps

Regression: `node scripts/verify-warrior-rend-kb.cjs` after KB sync.
