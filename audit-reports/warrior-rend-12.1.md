# Warrior Rend application audit

Checked 2026-09-22. This is a scoped correction, not completion of any warrior guide.

## Evidence

- https://nether.wowhead.com/tooltip/spell/772?dataEnv=1&locale=1 : Rend, rage 10, melee, instant, single target, 15-second bleed. Replaces the old AoE/20-rage/6-second description.
- https://nether.wowhead.com/tooltip/spell/845?dataEnv=1&locale=1 : Cleave, rage 20, base cooldown 4.5 seconds, reduced damage beyond five targets; applies Rend only if learned.
- https://nether.wowhead.com/tooltip/spell/12950?dataEnv=1&locale=1 : next four single-target attacks cleave to four additional targets at 65%; extra one rage per Whirlwind target, total cap eight; no Rend application in this talent.
- https://nether.wowhead.com/tooltip/spell/190411?dataEnv=1&locale=1 : Whirlwind generates three rage innately.
- https://www.wowhead.com/guide/classes/warrior/fury/midnight-season-2 (2026-08-18): Storm of Blood is the separate Rend application talent. Its Korean name and ID still require verification before adding a new DB node.
- https://www.icy-veins.com/wow/arms-warrior-pve-dps-guide : direct Rend is Arms-only; Cleave applies learned Rend; Thunder Clap no longer applies it innately.

Canonical notes 772/845/12950 were hand-edited, then synchronized to site DB. Relevant Arms and Fury manuscript claims corrected. Do not interpret historical June build popularity as current season evidence.

## Remaining

Verify current shared talent-tree replacement for legacy Rend 394062 before removing it and migrating all graph callers. Add verified Storm of Blood and Protection application nodes. Rework warrior hero talents, tier bonuses, rotations, current evidence and remaining generic KB descriptions before setting whole guides to 12.1 complete.

Run: `node scripts/verify-warrior-rend-kb.cjs` after `npm run sync-kb`.
