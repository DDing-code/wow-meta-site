# Warrior stances and passive defenses, 12.1

Verified 2026-09-22. Scope: six records, not all warrior content.

## Sources and corrections

Korean JSON tooltips: `https://nether.wowhead.com/tooltip/spell/{id}?dataEnv=1&locale=1`, IDs 386208, 386164, 1280961, 382939, 382549, 1271926.

- Defensive Stance: Korean damage increase wording contradicts https://www.wowhead.com/spell=386208/defensive-stance English text, buff and effect 2 (-10%). Arms/Fury deal 10% less damage, not more; Protection has no such damage penalty. All three receive 15% damage reduction. Instant, 3-second cooldown.
- Battle Stance: Arms/Protection only, not Fury. Ability critical chance +3%, movement-impairment duration -10%.
- Stance Mastery: Arms/Protection Battle Stance adds critical damage 3%; Fury Berserker Stance adds auto-attack speed 3%. Defensive Stance's additional 15% reduction is conditional on an attack exceeding 20% maximum health. Do not sum several small hits to satisfy this condition or claim unconditional damage reduction.
- Reinforced Plates: 5% Stamina and Armor per point, maximum two points. Not universal damage reduction.
- Pain and Gain: taking damage heals 2% maximum health, at most once per 10 seconds. Passive, not manual or unconditional periodic healing.
- Field Dressing: received healing +3%, self-healing additional +10%. Do not apply the self-healing bonus to all external healing or invent a final combined percentage.

Rank limits and specialization membership were checked against https://raw.githubusercontent.com/simulationcraft/simc/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/trait_data.inc . Field Dressing is marked NYI in this revision's warrior simulation module; its behavior here is sourced to the tooltip, not asserted to be fully simulated.

Canonical records, shared synergy explanation, generated DB and warrior guides updated. Assertions check specialization ownership, damage direction and conditional effects. Full rotation and remaining historical source claims are still under review.
