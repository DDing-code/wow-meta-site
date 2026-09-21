# Inactive shared warrior talents, 12.1

Verified 2026-09-22. This removes inactive selectable entries; it does not certify every remaining warrior spell or guide.

## Evidence

Each ID below was checked against the fixed 12.1.0.69875 trait data, specialization spell grants and warrior module. None occurs as a current talent or specialization grant, and neither the IDs nor their associated implementation names occur in the warrior module.

- https://raw.githubusercontent.com/simulationcraft/simc/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/trait_data.inc
- https://raw.githubusercontent.com/simulationcraft/simc/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/specialization_spells.inc
- https://raw.githubusercontent.com/simulationcraft/simc/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/class_modules/sc_warrior.cpp

| ID | Removed entry |
| --- | --- |
| 382948 | Piercing Challenge / 꿰뚫는 도전 |
| 384404 | Sidearm / 보조 무기 |
| 383762 | Bitter Immunity / 사기적인 면역 |
| 391572 | Uproar / 소요 |
| 386284 | Champion's Might / 용사의 힘 |
| 384969 | Thunderous Words / 우레와 같은 말 |
| 275338 | Menace / 위협 |
| 382954 | Cacophonous Roar / 재앙의 포효 |
| 382956 | Seismic Reverberation / 지진의 반향 |
| 383115 | Concussive Blows / 충격 강타 |

Their Korean tooltip endpoints (`https://nether.wowhead.com/tooltip/spell/{id}?dataEnv=1&locale=1`) still resolve. This does not establish current learnability. Historical removal dates and possible later incorporation of individual effects into other spells are not inferred from this removal.

## Integration

Removed ten canonical records, their sync-state keys, shared/specialization graph participants and related IDs, and incoming links. The Arms control note retains its Shockwave link but no longer recommends Menace. Current guide prose had no named references to the ten removed entries; no replacement prose was manufactured merely to create a guide diff. The generated spell DB and guide graph inputs are updated together.

Regression assertions reject all ten IDs in both generated skills and synergies. Parent abilities are not removed by association: their current descriptions and availability require their own review. Other warrior records and full openers remain unfinished.
