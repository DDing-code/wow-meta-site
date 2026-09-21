# Fury conditional passives

Verified 2026-09-22. Canonical notes 385703 Bloodborne, 383486 Focus in Chaos, 383852 Spite manually rewritten and synchronized with guide explanations.

- Bloodborne is an eight-second +20% own-bleed damage buff triggered by Bloodthirst, not an unconditional damage increase or an application of a bleed. SimC also triggers it from Bloodbath; no new attack-priority claim made.
- Focus in Chaos makes auto-attacks unable to miss while Enrage is active. It does not remove melee downtime, increase range, or guarantee critical strikes/all-ability hits. SimC's auto-attack composite_hit condition confirms the Enrage requirement.
- Spite gives 2.5% damage and additional 2.5% critical damage per rank to Bloodthirst/Raging Blow, maximum two ranks. It does not give critical chance or amplify all damage.

Evidence: Korean tooltip endpoints with `dataEnv=1&locale=1`; English endpoints with locale 0 for Bloodborne and Spite; English Focus in Chaos spell page; pinned 12.1 trait entries 112270/112272/112266 (Fury 72; ranks 1/1/2) and warrior module.

- https://nether.wowhead.com/tooltip/spell/385703?dataEnv=1&locale=1
- https://nether.wowhead.com/tooltip/spell/383486?dataEnv=1&locale=1
- https://nether.wowhead.com/tooltip/spell/383852?dataEnv=1&locale=1
- https://www.wowhead.com/spell=383486/focus-in-chaos
- https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/trait_data.inc
- https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/class_modules/sc_warrior.cpp

Whole-guide migration remains open. Existing unrelated graph associations are not certified by these three corrected records.
