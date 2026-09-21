# Warrior movement and control, 12.1

Checked 2026-09-22. Nine canonical records plus guide explanations; full warrior review remains open.

## Source

Current Korean Wowhead JSON tooltips fetched individually: `https://nether.wowhead.com/tooltip/spell/{id}?dataEnv=1&locale=1` for 100, 6544, 3411, 6552, 107570, 46968, 202163, 103827 and 391271. Trait membership/rank checked in https://raw.githubusercontent.com/simulationcraft/simc/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/trait_data.inc . The three passive modifiers are one-rank shared class talents.

## Distinctions preserved

- Charge: 8-25 yards, base 20-second cooldown and one charge, generates 20 Rage, baseline one-second root rather than an unconditional stun.
- Heroic Leap: base 45 seconds, 8-40-yard targeting and 8-yard landing damage. Protection additionally resets Taunt; do not apply that benefit to Arms/Fury.
- Intervene: 25-yard initial targeting, six-second melee/ranged attack interception, protected ally must remain within 10 yards. Not all spell/area damage interception.
- Pummel: base 15 seconds, melee range, five-second school lockout on successful interrupt, not a stun.
- Storm Bolt: base 30 seconds, 20-yard targeting, four-second primary stun. Additional target behavior is conditional and not included as a guaranteed baseline effect.
- Shockwave: base 40 seconds, forward 10-yard cone, two-second stun; not omnidirectional.
- Bounding Stride: Leap cooldown -15 seconds, movement speed +70% for three seconds; baseline adjusted cooldown 30 seconds.
- Double Time: Charge +1 maximum charge and cooldown -3 seconds; baseline adjusted state two charges/17 seconds.
- Honed Reflexes: listed utility cooldowns and specialization defensive cooldown -10%; actual spell interrupt grants 5% damage to that enemy for ten seconds. Stuns and unsuccessful interrupt attempts do not establish this trigger.

Tooltips also include legacy/conditional spell-name fragments. Descriptions separate verified base effects from conditional extras rather than flattening all branches into one ability. Generated DB checks cover ranges, duration, base versus modified cooldowns and successful-interrupt conditions.
