# Fury: Odyn's Fury and Bloodthirst support

Verified 2026-09-22. Five canonical KB notes manually rewritten and synchronized to DB; guide paragraphs updated. Official Korean names/icons retained.

- 385059 Odyn's Fury: 45-second base cooldown, 12-yard AoE, four-second bleed, reduced damage beyond eight targets, Enrage and 20 base Rage. The old generated description was truncated before completing its Rage effect. Do not copy the malformed repeated AP-percent expression or treat it as an eight-target hard cap.
- 215568 Fresh Meat: guaranteed Enrage on the first Bloodthirst hit per target; tooltip additionally states 15% increased Enrage chance. This is not a guarantee on each cast or every switch back to an already-hit target. No extra numeric aggregate proc probability asserted from SimC; its action constructor reads the Bloodthirst effect and the explicit per-target guarantee is independently visible.
- 393950 Bloodcraze: Raging Blow strengthens the next Bloodthirst by 5% per stack, maximum five. This is damage, not critical chance. SimC expires the buff after Bloodthirst executes; old user comments about expiring only after a crit are not current evidence.
- 383959 Cold Steel, Hot Blood: Bloodthirst crit triggers bleed and 4 additional Rage. In SimC the 0.5-second cooldown gates the Rage gain, while the bleed application is outside that guard. Tooltip says six-second bleed and healing equal to damage dealt. Do not publish literal tooltip damage 9 as a gear-independent combat value; exact damage/healing remains log-dependent.
- 383885 Vicious Contempt: Bloodthirst damage +25% below target 35% health. Not the player's health and not a global damage bonus.

## Sources

All five live Korean endpoints were read with `?dataEnv=1&locale=1`, alongside English spell pages:

- https://www.wowhead.com/spell=385059/odyns-fury
- https://www.wowhead.com/spell=215568/fresh-meat
- https://www.wowhead.com/spell=393950/bloodcraze
- https://www.wowhead.com/spell=383959/cold-steel-hot-blood
- https://www.wowhead.com/spell=383885/vicious-contempt
- https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/trait_data.inc
- https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/class_modules/sc_warrior.cpp

Trait entries 136735, 112268, 112274, 112271, 136448 retain Fury (72) eligibility. Reviewed `odyns_fury_t`, `bloodthirst_t`, `bloodbath_t`, Bloodcraze trigger/expiration and per-target Fresh Meat state. Scope does not certify hero recommendations, all rotation priorities, or the entire warrior guide; the migration remains open.
