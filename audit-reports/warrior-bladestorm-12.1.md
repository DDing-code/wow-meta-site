# Bladestorm specialization correction

Checked 2026-09-22. Scoped correction; full warrior migration remains open.

- Korean 227847 tooltip repeats 6 seconds for both specs. English distinguishes Arms 6 seconds and Fury 4 seconds, before haste and additional attacks.
- SimC revision 774babde5ddc7c5fc9f1abb129b473f8a076df70: base duration 6000ms, Fury aura 137050 effect 1032435 modifies duration by -2000ms. The effect family mask matches Bladestorm.
- Main-hand strike 50622 has a 5 Rage energize effect. bladestorm_tick_t explicitly disables energize for Arms. The guide does not claim per-target generation or a guaranteed total.
- Imminent Demise compresses tick intervals for extra attacks rather than simply extending the channel. Haste affects observed duration; 4/6 seconds are not promised log durations.
- Canonical KB, generated DB, Fury hero-branch text and scoped assertions updated. Existing specialization ownership stays Arms/Fury, not Protection.

Sources:
- https://www.wowhead.com/spell=227847/bladestorm
- https://nether.wowhead.com/tooltip/spell/227847?dataEnv=1&locale=0
- https://nether.wowhead.com/tooltip/spell/227847?dataEnv=1&locale=1
- https://raw.githubusercontent.com/simulationcraft/simc/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/sc_spell_data.inc
- https://raw.githubusercontent.com/simulationcraft/simc/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/class_modules/sc_warrior.cpp

Regression: `node scripts/verify-warrior-rend-kb.cjs` after KB sync. No in-game experiment claimed.
