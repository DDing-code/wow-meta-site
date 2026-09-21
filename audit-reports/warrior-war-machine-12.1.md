# War Machine and Rage capacity, 12.1

Checked 2026-09-22. Follow-up to warrior-rage-passives-12.1.md; not an all-class completion claim.

## Conflicting tooltip resolved to source-specific statements

The Korean and English tooltips for https://www.wowhead.com/spell=262231/war-machine show 1050% for Arms and 50% for Fury/Protection. The same page's effect details instead list 10%, 20%, 50% in effects 2, 3, 4.

The fixed 12.1.0.69875 data at https://raw.githubusercontent.com/simulationcraft/simc/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/sc_spell_data.inc contains effect IDs 623312, 1197897, 1197898 with base values 10, 20, 50. The warrior module's melee constructor selects effects 2, 3, 4 for Arms, Fury and Protection respectively and multiplies auto-attack Rage by one plus that percentage. The module does not override these values through a War Machine hotfix.

This establishes the model and underlying effect values, not a live in-game experiment. The KB/DB explicitly attributes 10/20/50 to effect data and SimC, retains the tooltip conflict, and does not claim a verified live 1050% effect. Guide prose describes auto-attack generation and kill rewards without presenting a disputed percentage as measured fact. The precise cause of the tooltip discrepancy is not established.

## Capacity

https://nether.wowhead.com/tooltip/spell/382767?dataEnv=1&locale=1 confirms Overwhelming Rage adds 30 maximum Rage. The current trait data lists one rank. Base 100 therefore becomes 130 in the stated baseline case, not an immediate gain of 30 Rage.

Both canonical records, generated DB and all three warrior guides were updated. Assertions cover the explicit conflict wording so later generation cannot silently drop the caveat.
