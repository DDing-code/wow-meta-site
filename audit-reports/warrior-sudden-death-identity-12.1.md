# Sudden Death identity and spec branches

Verified 2026-09-22. Previous turn bf6544ca was progress. Followed its unresolved ID mismatch through current trait tables and runtime before migrating.

Pinned 12.1 trait table identifies Sudden Death as 29725: Arms entry 112126, Fury 112301, Protection hero-area entry 132884. SimC resolves each spec's talent, shares the talent handle, and creates the actual buff from 52437. 280721 does not occur in that module or specialization-spell table. Live 29725 tooltip explicitly separates Fury/Protection health bypass from Arms free, 40-Rage-equivalent damage.

Moved canonical 29725 to the common talent folder; kept explicit spec branches in its description. Removed the obsolete Fury 280721 canonical talent, updated incoming wiki links, Fury related ID and both sync maps. This is not a deletion of the actual proc buff. Protection eligibility does not claim every Protection build automatically has the hero talent.

Guide now distinguishes Sudden Death from Fury Improved Execute's cost removal and generation. No proc-rate guarantee or new reset behavior inferred.

## Sources read

- https://www.wowhead.com/spell=29725/sudden-death
- https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/trait_data.inc (entries read in previous turn)
- https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/specialization_spells.inc
- https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/class_modules/sc_warrior.cpp

Full warrior guide migration and remaining graph prose remain open.
