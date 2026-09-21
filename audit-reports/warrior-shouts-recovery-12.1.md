# Warrior shouts and recovery, 12.1

Checked 2026-09-22. Scope is eight records and practical guide distinctions; full warrior migration is not complete.

Sources: current Korean Wowhead tooltips from `https://nether.wowhead.com/tooltip/spell/{id}?dataEnv=1&locale=1` for 6673, 97462, 34428, 202168, 18499, 23920, 1243660 and 424742. English Rallying Cry at https://www.wowhead.com/spell=97462/rallying-cry confirms temporary and maximum health, rather than direct damage reduction. Trait membership and Impending Victory's replacement of Victory Rush were cross-checked against https://raw.githubusercontent.com/simulationcraft/simc/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/trait_data.inc .

## Verified distinctions

- Battle Shout: 5% attack power, 100-meter application range, one hour. Not universal damage or spell power.
- Rallying Cry: base 10% temporary/maximum health for ten seconds, 40-meter radius, three-minute cooldown. The 50% non-raid increase gives a baseline 15%, not 50% maximum health. Additional talents modify the base separately.
- Victory Rush: qualifying XP/honor kill, twenty-second use window, 10% maximum-health recovery.
- Impending Victory: replaces Victory Rush; normally 10 Rage, 25-second cooldown, 30% recovery. Qualifying kills reset cooldown and allow no-cost use; kills are not required for normal use.
- Berserker Rage: six-second removal/immunity for specified fear/incapacitation categories, not every stun and not Fury Enrage.
- Spell Reflection: first reflectable incoming spell plus a five-second 20% magic-damage-reduction effect; not all damage immunity or repeated universal reflection. No claim about per-boss reflectability or unverified post-reflection buff lifetime is made.
- Resonant Voice modifies shout duration by 20%, not radius, amount or cooldown.
- Battlefield Commander changes different shouts differently: Battle Shout +3% AP; Rallying Cry +2% health amount and +3 seconds; Piercing Howl/Berserker Shout double radius; Intimidating Shout cooldown -15 seconds. No unverified combined talent/non-raid stacking formula is asserted.

Canonical KB, generated DB and warrior guide explanations updated. Tests check base costs/cooldowns, kill gating, replacement behavior wording and raid/non-raid distinction.
