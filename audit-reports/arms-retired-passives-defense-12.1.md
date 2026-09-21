# Arms passive availability and defense review

Reviewed 2026-09-22. Full warrior migration remains open.

## Current availability

Removed Arms Valor in Victory 383338 and Arms Deft Experience 389308 from the live canonical KB. Neither ID occurs in the current trait definitions or specialization-granted spell list, and the current warrior implementation contains no Arms binding for either. The exact removal date was not established; this review is about current availability, not attribution to a particular hotfix.

- https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/trait_data.inc
- https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/specialization_spells.inc
- https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/class_modules/sc_warrior.cpp

Both old IDs still resolve through Wowhead. That does not establish learnability. Fury Deft Experience 383295 is present under specialization 72 but was missing from this KB. Added its separate canonical record after fetching its current Korean tooltip: one-point Bloodthirst critical chance +5%, Enrage extension 0.5 seconds while already Enraged, doubled on a primary-target critical strike; two investable ranks. Removed the single remaining Valor in Victory synergy edge and backlink. No sync-state entries for the two obsolete IDs existed.

## Die by the Sword

Current Korean and English tooltip: https://nether.wowhead.com/tooltip/spell/118038?dataEnv=1&locale=1

Two-minute base cooldown, eight-second duration, +100% parry chance and 30% damage reduction. Replaced generic stale KB text and added a guide explanation distinguishing parryable attacks from magic/periodic damage; no immunity or extra obsolete 30-second cooldown reduction is assumed.

## Verification

The warrior check rejects both obsolete IDs in skills and synergy participants, preserves Fury's distinct talent and checks the current defensive values. Full build and public mobile rendering are verified separately. This scoped cleanup does not certify the complete Arms talent tree or remaining guide priorities.
