# Warrior Rend application audit

Checked 2026-09-22. This is a scoped correction, not completion of any warrior guide.

## Evidence

- https://nether.wowhead.com/tooltip/spell/772?dataEnv=1&locale=1 : Rend, rage 10, melee, instant, single target, 15-second bleed. Replaces the old AoE/20-rage/6-second description.
- https://nether.wowhead.com/tooltip/spell/845?dataEnv=1&locale=1 : Cleave, rage 20, base cooldown 4.5 seconds, reduced damage beyond five targets; applies Rend only if learned.
- https://nether.wowhead.com/tooltip/spell/12950?dataEnv=1&locale=1 : next four single-target attacks cleave to four additional targets at 65%; extra one rage per Whirlwind target, total cap eight; no Rend application in this talent.
- https://nether.wowhead.com/tooltip/spell/190411?dataEnv=1&locale=1 : Whirlwind generates three rage innately.
- https://www.wowhead.com/guide/classes/warrior/fury/midnight-season-2 (2026-08-18): Storm of Blood is the separate Rend application talent.
- https://www.icy-veins.com/wow/arms-warrior-pve-dps-guide : direct Rend is Arms-only; Cleave applies learned Rend; Thunder Clap no longer applies it innately.

Canonical notes 772/845/12950 were hand-edited, then synchronized to site DB. Relevant Arms and Fury manuscript claims corrected. Do not interpret historical June build popularity as current season evidence.

## Remaining

Rework remaining warrior hero talents, tier bonuses, rotations, current evidence and generic KB descriptions before setting whole guides to 12.1 complete. Historical large synergy hubs still need full review; removing one retired participant does not validate the other edges.

## Class-tree split verified

SimulationCraft fixed commit `774babde5ddc7c5fc9f1abb129b473f8a076df70`, `engine/dbc/generated/trait_data.inc`, header `wow build 12.1.0.69875`:

- entry 135597 / definition 140353 / spell 772 / spec 71: Rend, Arms only.
- entry 137471 / definition 142231 / spell 384277 / spec 73: Blood and Thunder, Protection only.
- entry 137472 / definition 142232 / spell 1299025 / spec 72: Storm of Blood, Fury only.
- spell 394062 does not occur in these current trait definitions. Combined with the three replacement rows, this supports retiring the legacy shared selectable node, not deleting the underlying historical spell from Warcraft itself.
- https://nether.wowhead.com/tooltip/spell/1299025?dataEnv=1&locale=1 : Korean name 피의 폭풍, icon ability_ironmaidens_whirlofblood, 15-second Rend from Whirlwind. Conditional spell substitution 436707 adds Thunder Clap.
- https://nether.wowhead.com/tooltip/spell/384277?dataEnv=1&locale=1 : Korean name 피와 번개, icon warrior_talent_icon_bloodandthunder, 15-second Rend from Thunder Clap.
- https://nether.wowhead.com/tooltip/spell/436707?dataEnv=1&locale=1 : Crashing Thunder now grants 10% Thunder Clap damage, 5% Nature/Stormstrike damage for both specs. Fury alone has the eight-rage and Whirlwind-talent inheritance clauses, including Storm of Blood.

Removed canonical shared 394062, its sync-state entry and all matching KB graph references. Added two class talents with specialization restrictions and two small explicit application synergies. Corrected Crashing Thunder shared KB and Protection/Fury manuscript descriptions. No invented current log sample or translated talent name.

Run: `node scripts/verify-warrior-rend-kb.cjs` after `npm run sync-kb`.
