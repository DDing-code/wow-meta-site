# Arms apex: 12.1 scoped review

Reviewed 2026-09-22. This does not certify the complete Arms guide or warrior migration.

## Sources

- Korean Wowhead tooltips: https://nether.wowhead.com/tooltip/spell/1269314?dataEnv=1&locale=1
- Heroic Strike: https://nether.wowhead.com/tooltip/spell/1269383?dataEnv=1&locale=1
- Intermediate talent: https://nether.wowhead.com/tooltip/spell/1269306?dataEnv=1&locale=1
- Final talent: https://nether.wowhead.com/tooltip/spell/1269307?dataEnv=1&locale=1
- Fixed simulation implementation: https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/class_modules/sc_warrior.cpp
- Fixed trait ranks/spec membership: https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/trait_data.inc

## Findings and changes

- 1269314 replaces Slam with Heroic Strike on a proc; Slam modifiers carry over. The tooltip's 100 ms internal cooldown is not an active player cooldown.
- 1269383 costs 20 Rage before modifiers. It grants 3% armor penetration for 30 seconds per stack. The official icon is ability_rogue_ambush, despite its filename.
- Independent expiration is corroborated by the simulation's ASYNCHRONOUS master_of_warfare buff, not inferred from the Korean tooltip alone. Another application does not refresh all older stacks.
- 1269306 has two investable ranks. The tooltip shows 2.5% damage and critical damage per stack at one point for Mortal Strike, Cleave and Overpower. This is not critical chance. The KB explicitly labels the one-point value rather than presenting it as the fully invested value.
- 1269307 prepares a separate 3% per-stack bonus, up to five stacks, for the next Colossus Smash. Simulation code transfers heroic_might_accumulator to heroic_might at Colossus Smash and expires the accumulator. Armor penetration stacks are not consumed by that operation.
- Updated the four canonical records, added a five-participant synergy and explained both stack layers in the guide. No proc rate, optimal delay threshold or log-derived DPS gain was invented.

## Verification scope

`node scripts/verify-warrior-rend-kb.cjs` checks generated IDs, spec membership, patch, icon, resource cost, descriptions and synergy participants after KB sync. It is a regression check, not independent proof of game mechanics. Full build and public-page rendering are separate checks. Remaining guide sections and old KB entries still need review.
