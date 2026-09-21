# Warrior Rage passives, 12.1

Checked 2026-09-22. Scoped review only; the all-class goal remains open.

## Verified

- https://nether.wowhead.com/tooltip/spell/279423?dataEnv=1&locale=1 : Seasoned Soldier increases Rage from critical auto attacks by 10% and reduces incoming area damage by 5%. Neither applies to every attack or every source of Rage.
- https://nether.wowhead.com/tooltip/spell/392792?dataEnv=1&locale=1 : Frothing Berserker has a 20% chance to refund 10% of spent Rage for Arms Mortal Strike/Cleave and Fury Rampage; Protection Revenge refunds 50% on proc.
- https://raw.githubusercontent.com/simulationcraft/simc/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/class_modules/sc_warrior.cpp : Mortal Strike, Cleave, Rampage and Revenge compute this refund from last_resource_cost. Free casts do not refund a nominal base cost. Seasoned Soldier is used in auto-attack critical Rage generation.
- The same revision's generated trait data lists Frothing Berserker in the shared class tree. Seasoned Soldier is obtained through the specialization spell lookup, not as a manually cast talent.

Canonical records and all three warrior guide explanations were updated. Generated DB checks cover specialization-specific refund rates and actual-cost wording.

## Unresolved

https://nether.wowhead.com/tooltip/spell/262231?dataEnv=1&locale=1 still displays Arms War Machine as 1050%, compared with 50% for Fury/Protection. The SimC module uses specialization-specific effect indices, but that alone does not prove the actual Arms percentage. Do not silently replace it with an assumed 10%, 50% or another value. This record is not certified as a finished 12.1 correction; verify current effect data and modifiers before relying on a numerical Rage budget.
