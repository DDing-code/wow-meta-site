# Arms two-target mechanics, 12.1

Verified 2026-09-22. Current Korean tooltip evidence (`https://nether.wowhead.com/tooltip/spell/{id}?dataEnv=1&locale=1`):

- 260708: instant, 30-second cooldown; next 12 single-target attacks within 30 seconds hit one additional target within 8m for 75% damage.
- 1261050: Powerful Momentum / 강력한 기세 increases Sweeping Strikes secondary-target damage by 20%. Missing from the previous canonical DB; now added with icon inv_1115_warrior_crushingblow.
- 334779: actual second-target damage during Sweeping Strikes grants 25% next Cleave/Whirlwind damage, max three stacks.
- 1261049 was verified in the previous turn: six Sweeping Strikes stacks from Colossus Smash, not six seconds.

SimulationCraft build 12.1.0.69875 lists 1261050 and 334779 in spec 71 and has no Improved Sweeping Strikes trait:
https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/trait_data.inc

Removed Improved Sweeping Strikes (383155) was already absent from canonical notes and the generated DB; no removal claimed this turn. Its old Wowhead tooltip still exists, reinforcing why tooltip availability alone is insufficient.

Hand-authored the three notes and a direct secondary-hit/follow-up synergy; replaced guide section 9's old population-statistics discussion with concrete two-target mechanics. No damage-ratio promise, current population estimate or complete Arms-guide certification is made.

Run `npm run sync-kb`, `node scripts/verify-warrior-rend-kb.cjs`, then `npm run build`.
