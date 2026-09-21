# Thunder Clap: specialization boundaries

Checked 2026-09-22. Scoped correction, not completion of the warrior migration.

- Canonical 6343 retained all three class-tree memberships. Updated the generic 12.0.5 description to actual base behavior and conditional Rend paths.
- Wowhead 6343 tooltip confirms 8m, 6s, 20% movement slow for 10s. Its unresolved target-count and zero-resource fragments are not usable as universal final values.
- Wowhead 436707 explicitly scopes cost removal and 8 Rage generation to Fury. Protection must not inherit this number.
- SimC revision 774babde5ddc7c5fc9f1abb129b473f8a076df70, sc_spell_data.inc power records 306017/312437: 20 Rage is bound to Arms/Fury auras, not Protection.
- The same revision's thunder_clap_t::impact requires Blood and Thunder for Protection Rend, or Storm of Blood plus Crashing Thunder for Fury Rend. No 12.1 Arms Rend application path.
- Fury guide now explains cost removal, resource generation and the conditional Improved Whirlwind buff alongside the existing Rend condition.
- Protection's final Rage gain and talent-modified target soft caps remain unresolved here. No fabricated final amount was added.

Sources:
- https://www.wowhead.com/spell=6343/thunder-clap
- https://www.wowhead.com/spell=436707/crashing-thunder
- https://raw.githubusercontent.com/simulationcraft/simc/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/class_modules/sc_warrior.cpp
- https://raw.githubusercontent.com/simulationcraft/simc/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/sc_spell_data.inc

Runnable regression check: `node scripts/verify-warrior-rend-kb.cjs` after `npm run sync-kb`.
