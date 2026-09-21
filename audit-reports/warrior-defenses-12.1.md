# Warrior defensive identity audit

Verified 2026-09-22 against Korean Wowhead tooltips and fixed SimulationCraft trait rows.

## Distinct Ignore Pain spells

- Arms 1277297: no Rage cost, instant, 20-second base cooldown, 50% damage diverted to absorb, expires after 12 seconds or exhaustion.
- Protection 190456: 35 Rage, instant, 1-second base cooldown, 50% damage diverted to absorb, accumulated amount capped at 30% of maximum health.
- The 190456 tooltip contains Arms/Fury branches, but the 12.1 trait tree lists 1277297 for Arms and 190456 for Protection. Do not infer learnability from tooltip branches alone.
- Both external tooltips render their character-dependent absorb calculation as zero. No zero absorption or fabricated fixed amount was published.

## Shield Block

- 2565: 30 Rage, six-second block effect, base recharge 16 seconds; Protection has 30% Shield Slam damage during the effect.
- 231847 is a passive giving two charges, not another active Shield Block. Do not count its presence as a cast.

Sources: `https://nether.wowhead.com/tooltip/spell/{id}?dataEnv=1&locale=1` for 1277297, 190456, 2565, 231847.
Trait snapshot: https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/trait_data.inc

Four canonical spell records, two spec-specific Colossus absorb synergies, and Arms/Protection guide copy updated. Run `npm run sync-kb` and `node scripts/verify-warrior-rend-kb.cjs`. This does not certify remaining warrior abilities or complete guides.
