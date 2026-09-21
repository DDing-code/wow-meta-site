# Fury defensive effects: 12.1 review

Verified 2026-09-22. Scope: 184364, 208154, 383468, 383848, 440277.

- Enraged Regeneration: base 2-minute cooldown, 8 seconds, 30% damage reduction; Bloodthirst adds 20% maximum-health healing. Usable while stunned/incapacitated does not mean Bloodthirst automatically attacks.
- Warpaint: 10% damage reduction only while Enrage is active.
- Invigorating Fury: Enraged Regeneration lasts 3 seconds longer (11 seconds total) and immediately heals 10% maximum health on use; not a heal on every Enrage proc.
- Frenzied Enrage: 15% haste, 10% movement speed during Enrage.
- Powerful Enrage: 15% mastery, 3% leech during Enrage; not flat final damage, instant healing, or damage reduction.
- Frenzied/Powerful Enrage share choice node 90398 (entries 112267/119112); their bonuses cannot be added together. Other reviewed entries are 112264, 112263, 136890 and remain available to Fury (72).

Sources: live English spell pages and Korean tooltip endpoints for all five IDs, plus the pinned 12.1 trait table:

- https://www.wowhead.com/spell=184364/enraged-regeneration
- https://www.wowhead.com/spell=208154/warpaint
- https://www.wowhead.com/spell=383468/invigorating-fury
- https://www.wowhead.com/spell=383848/frenzied-enrage
- https://www.wowhead.com/spell=440277/powerful-enrage
- Korean endpoint pattern: https://nether.wowhead.com/tooltip/spell/184364?dataEnv=1&locale=1
- https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/trait_data.inc

Canonical descriptions and usage rewritten manually; current Korean names/icons retained. Guide explains the mutually exclusive choice and defensive conditions. Scoped assertions cover generated descriptions and passive status. This does not certify all Fury recommendations, rotations, synergies, or the full warrior migration.
