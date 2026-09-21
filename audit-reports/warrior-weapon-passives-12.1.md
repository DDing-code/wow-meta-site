# Warrior weapon and damage passives, 12.1

Checked 2026-09-22. Scope: eight records and related guide explanations; not completion of the whole migration.

Korean Wowhead tooltip sources were fetched for IDs 382900, 383082, 382946, 382896, 384124, 392777, 382895, 382258 using `https://nether.wowhead.com/tooltip/spell/{id}?dataEnv=1&locale=1`.

Current rank and specialization membership: https://raw.githubusercontent.com/simulationcraft/simc/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/trait_data.inc .

## Corrected scope

- Two-Handed Weapon Specialization belongs to Arms, Dual Wield Specialization to Fury, One-Handed Weapon Specialization to Protection. All were previously exposed as shared across three specs. Each has up to two points; tooltips are described at one point.
- Armored to the Teeth: one point converts Armor to Strength at 5% for Arms/Fury, 2% for Protection, up to two points. This is not a percentage increase to existing Strength. https://www.wowhead.com/spell=384124/armored-to-the-teeth confirms specialization-specific effects and rank scaling.
- Barbaric Training: damage +10%, critical damage +5%, with different abilities for each spec. Fury Thunder Clap inclusion requires Crashing Thunder, not universal class ownership.
- Wild Strikes: one point gives 1% Haste and auto-attack criticals trigger 10% auto-attack speed for ten seconds; eight-second internal cooldown. https://www.wowhead.com/spell=382946/wild-strikes lists rank scaling on both permanent Haste and triggered effect amount, so neither is presented as fixed at all investments.
- Cruel Strikes: one point gives 1% critical chance and 5% Execute critical damage, maximum two points; not a universal 5% damage modifier.
- Leeching Strikes: passive 3% Leech, not an active attack, periodic maximum-health heal or damage reduction.

Canonical records, generated DB and all three warrior guide explanations updated. Assertions cover weapon-talent ownership and rank/target distinctions. Remaining utility records, hero mechanics and complete combat flows still need review.
