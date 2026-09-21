# Arms 12.1: missing and redesigned talents

Verified 2026-09-22. Four talent notes and three direct mechanic connections; not full Arms migration.

## Evidence

Current Korean tooltips at `https://nether.wowhead.com/tooltip/spell/{id}?dataEnv=1&locale=1`:
- 1261051 Tactical Edge: Colossus Smash grants one Sudden Death.
- 1261049 Broad Strokes: Colossus Smash grants six Sweeping Strikes stacks, not seconds.
- 383154 Bloodletting: abilities gain 5% crit against Rend targets; Mortal Strike applies learned Rend below 35%; Deep Wounds duration +33%, not Rend duration.
- 262150 Dreadnaught: 140% AP wave, 10m line, reduced beyond five; affected by Overpower damage modifiers.

The four talent IDs appear in Arms (spec 71) in SimulationCraft build 12.1.0.69875 trait data:
https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/trait_data.inc

The same snapshot's `dreadnaught_t` explicitly uses `secondary_targets_only()` for 12.1; this resolves the primary-target exclusion not stated clearly in the Korean tooltip:
https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/class_modules/sc_warrior.cpp

The 12.1 changes are independently listed at https://www.icy-veins.com/wow/arms-warrior-pve-dps-guide . No recommended build percentages or simulated DPS gain were inferred.

## Check

`npm run sync-kb` followed by `node scripts/verify-warrior-rend-kb.cjs` checks values and graph participants. Guide-wide priorities, old mastery/bleed notes and the broad legacy synergy clusters still require review.
