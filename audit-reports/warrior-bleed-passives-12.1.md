# Warrior bleed and passive talents, 12.1

Checked 2026-09-22. This is a scoped correction, not completion of the warrior or all-class migration.

## Evidence

Current Korean Wowhead JSON tooltips were retrieved for spells 383103, 384361, 383287, 383341, 383430 and 400803 from `https://nether.wowhead.com/tooltip/spell/{id}?dataEnv=1&locale=1`.

- Fueled by Violence: Arms 85%, Protection 125% of Rend/Deep Wounds damage as healing, not maximum health.
- Bloodsurge: Rend damage has a chance to generate 5 Rage; not guaranteed per application.
- Bloodborne: bleed damage and critical damage, not critical chance.
- Sharpened Blades: Mortal Strike, Cleave and Execute damage/critical damage.
- Impale: ability critical damage, not critical chance.
- Strength of Arms: Overpower/Slam damage, critical damage and critical chance; not old fixed Rage generation.

Rank limits and specialization membership were cross-checked against the 12.1.0.69875 trait data at https://raw.githubusercontent.com/simulationcraft/simc/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/trait_data.inc . The three two-point effects are described at one point, with maximum investment stated separately.

## Integration

Canonical Fueled by Violence and Bloodsurge records moved to shared warrior talents with Arms/Protection membership. Incoming KB links were repaired. Four Arms passive records were updated. Guide prose distinguishes damage, critical damage, chance, actual Rage and actual healing. Generated DB assertions check the published descriptions, not just canonical files.

This does not establish current build popularity or validate all openers. Remaining warrior hero/priority sections and other unverified specializations still require review.
