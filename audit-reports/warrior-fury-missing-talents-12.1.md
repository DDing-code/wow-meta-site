# Fury missing talents: 12.1

Reviewed 2026-09-22. This is a scoped correction, not completion of the warrior guides.

## Coverage gap

Existing Fury records being labeled 12.1 did not prove the DB contained the current tree. Five selectable Fury talents in the pinned trait table were absent from the exported DB. Added canonical notes, official Korean names and icons, and regenerated the DB:

| Spell | Korean name | Verified condition |
| --- | --- | --- |
| 1265355 | 피의 향기 | Rampage increases next Bloodthirst damage by 10%, up to two stacks; not critical strike chance. |
| 1265356 | 분노를 마시는 자 | Bloodthirst critical hit: additional 3% healing and Raging Blow damage +10% for four seconds. |
| 1265359 | 아드레날린의 쇄도 | Raging Blow self-reset: auto-attack damage and attack speed +30% for six seconds. |
| 1265361 | 죽거나 죽이거나 | Fatal damage requires a living killer; eight seconds to kill that specific enemy or die. Five-minute lockout; success preserves at least 20% maximum health. |
| 1265570 | 집행인의 격노 | Execute generates five additional Rage and increases Rampage damage by 10% for four seconds. |

## Source conflict resolved

The Korean talent tooltip for 1265359 says movement speed. Both the Korean and English **buff** tooltip for 1265560 say auto-attack speed and damage. The pinned 12.1 spell data lists 30-point aura effects 319 and 344, and the warrior module applies the buff in its attack/effect parsing. The KB and guide therefore describe auto-attack speed, while documenting the Korean talent-text discrepancy. Do not copy the movement-speed wording back from that single tooltip.

The old guide's unconditional assertion that Fury has no death-prevention talent was removed. This talent does not guarantee survival on a boss that cannot die within eight seconds. No empirical raid reliability claim is made.

Added the explicit Rampage / Scent of Blood / Bloodthirst / Ragedrinker / Raging Blow relationship, separating guaranteed damage amplification from a conditional critical-hit trigger. It is not a fixed rotation instruction.

## Sources inspected

- Korean tooltip endpoints: `https://nether.wowhead.com/tooltip/spell/{id}?dataEnv=1&locale=1`, for all five IDs above.
- Buff tooltip 1265560, Korean and English (locale 1 and 0).
- https://www.wowhead.com/spell=1265361/kill-or-be-killed
- https://www.wowhead.com/spell=1265359/surge-of-adrenaline
- https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/trait_data.inc
- https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/sc_spell_data.inc
- https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/class_modules/sc_warrior.cpp

## Verification scope

`node scripts/verify-warrior-rend-kb.cjs` checks these five records, conditions, explicit synergy participants and removal of the old blanket survival claim. It does not prove full tree coverage, current optimal rotations, live implementation of every effect, or completion of Arms/Protection.
