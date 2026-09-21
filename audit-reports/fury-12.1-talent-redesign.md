# Fury 12.1 talent redesign

Manual review 2026-09-22. This records a partial migration, not a finished current Fury guide.

## Primary spell evidence

- https://nether.wowhead.com/tooltip/spell/383877?dataEnv=1&locale=1 : 자르고 베기, ability_rogue_rollthebones02. Rampage has 75% chance to refund a Raging Blow charge and increase next Raging Blow damage 20%. 500ms is internal cooldown, not an active spell cooldown.
- https://nether.wowhead.com/tooltip/spell/1265357?dataEnv=1&locale=1 : 빗발치는 광란, ability_warrior_trauma. While Improved Whirlwind active, final Rampage strike deals additional physical damage around the target in 8 yards, reduced beyond five; base tooltip coefficient 372.289% AP.
- https://nether.wowhead.com/tooltip/spell/1300463?dataEnv=1&locale=1 : 새기는 칼날, inv_knife_1h_goblinrogue_c_01. Whirlwind +50% damage only when hitting one target.
- https://nether.wowhead.com/tooltip/spell/280392?dataEnv=1&locale=1 : 고기칼, warrior_talent_icon_mastercleaver. Whirlwind +50% damage when hitting at least three targets; Crashing Thunder condition extends to Thunder Clap.
- https://nether.wowhead.com/tooltip/spell/436707?dataEnv=1&locale=1 : current Crashing Thunder inheritance list omits Carving Blades; do not invent this extra interaction.

## Trait selection evidence

SimulationCraft fixed commit `774babde5ddc7c5fc9f1abb129b473f8a076df70`, `engine/dbc/generated/trait_data.inc`, build 12.1.0.69875:

- 383877: entry 112276, definition 117281, Fury 72.
- 1265357: entry 112260, definition 117265, Fury 72.
- 1300463: entry 137487, definition 142247, node 109967, Fury 72.
- 280392: entry 136452, definition 141225, same node 109967, Fury 72. Both rows mark a choice node; not simultaneously selected.

Author cross-check: https://www.wowhead.com/guide/classes/warrior/fury/midnight-season-2 (Archimtiros, updated 2026-08-18). Changes match the four current spell tooltips. Operational advice distinguishes guaranteed effects from probabilistic refunds and damage caps from target caps. No new ranking or simulated DPS claim.

## Changes and check

Manually updated two canonical talents and added two missing talents. Added direct three-node synergies for the conditional Rampage hit and charge refund; linked through existing manuscripts. Generated DB retains specialization restrictions and official Korean names/icons.

Run `npm run sync-kb` then `node scripts/verify-warrior-rend-kb.cjs`.
Still open: full Fury core/tier/hero/build/log evidence review and other warrior specs.
