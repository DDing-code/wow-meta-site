# Anger Management: actual expenditure and cooldown targets

Checked 2026-09-22. This is a scoped correction, not completion of warrior guides.

152278 is a passive class talent, not an active utility skill. Current Wowhead Korean/English descriptions specify 20 Rage per second of cooldown reduction:
- Arms: attack expenditure, Avatar and Colossus Smash.
- Fury: attack expenditure, Avatar and Recklessness.
- Protection: Rage expenditure, Avatar and Shield Wall.

SimulationCraft revision 774babde5ddc7c5fc9f1abb129b473f8a076df70 uses last_resource_cost and only applies reduction for positive expenditure. Its three effect divisors are 20. This is implementation evidence, not a live-server measurement or a promise of a fixed cooldown cycle.

The Fury synergy previously omitted Anger Management from participants while including Odyn's Fury and several tangential talents. Canonical participants are now Rampage, Anger Management, Recklessness and Avatar. Prose explicitly describes actual expenditure and the two reduction destinations, not generic cooldown grouping. The Fury guide explains that generation/free casts do not count as original-cost spending and that different initial use times need not converge.

Canonical KB and generated spell/synergy DB were updated together. Regression assertions cover passive display, specialization targets and exact graph membership.

Still open: the old shared AoE graph, Thunderous Roar availability/removal audit, Bladestorm duration discrepancy (Korean tooltip 6s in both specs versus English Fury 4s), and full rotation revalidation. No conclusion about those was silently inferred from this correction.

Sources:
- https://www.wowhead.com/spell=152278/anger-management
- https://nether.wowhead.com/tooltip/spell/152278?dataEnv=1&locale=1
- https://raw.githubusercontent.com/simulationcraft/simc/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/class_modules/sc_warrior.cpp

Check: `node scripts/verify-warrior-rend-kb.cjs` after `npm run sync-kb`.
