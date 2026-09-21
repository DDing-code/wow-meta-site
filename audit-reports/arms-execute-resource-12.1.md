# Arms Execute resource review

Reviewed 2026-09-22. Full warrior migration remains open.

## Evidence

Current Korean Wowhead tooltips: 316405, 389306, 383703, 400205 at `https://nether.wowhead.com/tooltip/spell/{id}?dataEnv=1&locale=1`.

Fixed simulation data and implementation:
- https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/trait_data.inc
- https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/class_modules/sc_warrior.cpp

All four IDs are current Arms talents. Critical Thinking permits two points and its Korean name is now 치명적 감각. The text explicitly labels its one-point 5% Execute critical chance and 10% additional refund. Improved Execute's tooltip requires the target to survive for no own cooldown and 10% refund. Simulation simplifies the survival check, so the guide retains the tooltip condition rather than copying that simplification.

The simulation calculates refunds from last_resource_cost, not the damage-equivalent Rage of a free Sudden Death Execute. Fatality is a target-specific mark, 50% application chance and max 5 stacks. Overpowering Finish requires target health below 35%, not merely an available Sudden Death proc.

## Changes and checks

Hand-rewrote four canonical records, added the actual-cost refund synergy and guide explanations. Renamed the Critical Thinking note and affected synergy filename to the current Korean wording, preserving their IDs and updating incoming KB references. Synced generated skill/graph DBs. The warrior regression script checks names, ranks, conditions and participants. Full build and public mobile checks follow independently; other passives and complete priority lists remain under review.
