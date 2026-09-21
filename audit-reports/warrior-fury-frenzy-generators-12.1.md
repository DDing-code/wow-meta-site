# Fury haste and generator modifiers

Verified 2026-09-22. Previous goal turn c516c7e3 was progress. This update covers three passives; full class migration remains open.

- 335077 Frenzy / 광기 was incorrectly typed as an active skill. It is a one-rank passive: Rampage grants 2% haste for 12 seconds, overlapping instances, 0.5-second trigger cooldown. SimC creates the buff with ASYNCHRONOUS stack behavior. No all-stack refresh, target-switch reset or guessed stack cap asserted.
- 383297 Critical Thinking / 치명적 감각 has two ranks, each adding 5 percentage points critical chance and 5% critical damage to Raging Blow and Crushing Blow, not Bloodthirst.
- 392931 Cruelty / 무자비함 has two ranks, each adding 5% damage to Bloodthirst/Raging Blow and their upgraded attacks while Enraged. SimC explicitly checks Enrage rather than registering an unconditional passive. This is not a reset-chance bonus.

Retained canonical paths and existing graph links to avoid dangling references. Updated type, patch, English names, passive classification, descriptions and manually written guide paragraphs. Official Korean tooltip names/icons matched existing assets.

## Evidence

- https://www.wowhead.com/spell=335077/frenzy
- https://www.wowhead.com/spell=383297/critical-thinking
- https://www.wowhead.com/spell=392931/cruelty
- Korean tooltip endpoints for all three IDs, with dataEnv=1 and locale=1, read directly.
- https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/trait_data.inc
- https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/class_modules/sc_warrior.cpp

Trait entries 112275/112296/112299 retain Fury eligibility and maximum ranks 1/2/2 respectively. No new current-log popularity or DPS claim. Other graph relationships and rotation priorities are not certified by these checks.
