# Fury Execute talents

Verified 2026-09-22. Previous turn 0853ac4c was progress. Two manually rewritten canonical notes synchronized with DB and the guide.

- 206315 Massacre: target health below 35%, cooldown reduced 1.5 seconds, not global cooldown. Trait entry 112279 retains Fury eligibility and one rank. SimC Fury Execute sets execute_pct from effect 2 and reduces its cooldown by effect 3.
- 316402 Improved Execute: removes Rage cost and generates base 20 Rage. This is not Arms refund behavior, and generation is not expenditure for Anger Management. Trait entry 112300 retains Fury eligibility and one rank.

## Sources

- https://www.wowhead.com/spell=206315/massacre
- https://nether.wowhead.com/tooltip/spell/206315?dataEnv=1&locale=1
- https://nether.wowhead.com/tooltip/spell/316402?dataEnv=1&locale=1
- https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/trait_data.inc
- https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/class_modules/sc_warrior.cpp

The English Improved Execute page was robots-blocked; the live Korean tooltip endpoint was successfully read. Existing official Korean names/icons matched.

## Open finding

Fury Sudden Death in trait entry 112301 points to 29725, while the current Fury KB still uses 280721. Do not delete or relabel solely from this mismatch: shared Arms data, triggered spells, graph participants and consumers need tracing together. Full Fury rotation and all-class migration remain incomplete.
