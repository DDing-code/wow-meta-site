# Avatar and inactive Torment talents, 12.1

Checked 2026-09-22. Scope is current learnability and the specified effects, not full warrior completion.

## Remove inactive entries

IDs 390123, 390135, 390138 and 390140 still have Wowhead tooltip pages, but none appear in the current trait data, specialization spell grants or warrior module at the fixed 12.1.0.69875 revision:

- https://raw.githubusercontent.com/simulationcraft/simc/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/trait_data.inc
- https://raw.githubusercontent.com/simulationcraft/simc/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/specialization_spells.inc
- https://raw.githubusercontent.com/simulationcraft/simc/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/class_modules/sc_warrior.cpp

The four canonical talent records, shared graph participants/backlink and sync-state entries were removed. A surviving tooltip URL is not evidence that a character can select the talent. Exact historical removal dates are not established here.

## Current descriptions

- https://nether.wowhead.com/tooltip/spell/107574?dataEnv=1&locale=1 : Avatar has a 1.5-minute base cooldown, 20-second duration, 20% damage increase. Arms additionally takes 5% less area damage; Protection takes 3% less all damage; Fury gains 5% movement speed. These specialization extras are not cumulative.
- https://nether.wowhead.com/tooltip/spell/382764?dataEnv=1&locale=1 : Crushing Force boosts Arms Mortal Strike, Fury Bloodthirst or Protection Shield Slam damage and critical damage by 5%. It does not improve Rend or critical chance. Current trait data has one rank in the shared class tree.

Both records and all three guide descriptions were updated. The verifier rejects all four inactive IDs in the skill DB and synergy DB and checks Avatar/Crushing Force semantics. Other shared graph participants remain subject to review; this is not a certification of the full existing graph.
