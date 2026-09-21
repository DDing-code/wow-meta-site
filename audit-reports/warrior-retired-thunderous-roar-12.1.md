# Remove retired Thunderous Roar

Checked 2026-09-22. This removes stale ability exposure, not a declaration that every warrior graph is verified.

- 384318 is absent from trait_data.inc, specialization_spells.inc and the warrior module at SimC revision 774babde5ddc7c5fc9f1abb129b473f8a076df70.
- Current Icy Veins Protection guide explicitly lists Thunderous Roar among removed talents. Arms and Fury guides also describe its removal. Existence of a historical Wowhead spell tooltip is not evidence of current learnability.
- Deleted canonical spell record and sync-state mapping. Removed the ID from participants/related IDs and removed direct incoming skill references.
- Renamed the shared AoE and Arms bleed notes to remove the retired spell from displayed graph names. Updated incoming links and sync-state paths together. Stable graph IDs remain unchanged for compatibility.
- Removed generic utility-note text recommending the retired cooldown. Rewrote the affected shared AoE introduction and Arms bleed explanation without assigning another skill as a drop-in replacement.
- No guide manuscript currently referenced the retired name/ID, so no unrelated prose was changed. Generated spell and synergy databases were resynchronized.
- Historical changelog entry is retained as history. Other old graph associations and patch labels remain pending full review.

Sources:
- https://www.icy-veins.com/wow/protection-warrior-pve-tank-guide
- https://www.icy-veins.com/wow/arms-warrior-pvp-guide
- https://www.icy-veins.com/wow/fury-warrior-pvp-guide
- https://raw.githubusercontent.com/simulationcraft/simc/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/trait_data.inc
- https://raw.githubusercontent.com/simulationcraft/simc/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/specialization_spells.inc
- https://raw.githubusercontent.com/simulationcraft/simc/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/class_modules/sc_warrior.cpp

Regression: `node scripts/verify-warrior-rend-kb.cjs` checks absent ability/graph references and the renamed Arms graph.
