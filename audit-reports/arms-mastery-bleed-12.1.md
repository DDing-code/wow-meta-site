# Arms mastery and bleed separation

Verified 2026-09-22. The previous DB incorrectly exposed historical mastery 262111 and omitted current mastery 1258398, while Deep Wounds 1261060 was limited to Protection.

## Evidence

Current Korean tooltip endpoints (`https://nether.wowhead.com/tooltip/spell/{id}?dataEnv=1&locale=1`):
- 1258398: official name 특화: 무기 전문가, icon warrior_talent_icon_igniteweapon, two-handed weapon damage increase. 9.0% is the base tooltip, not a universal gear-independent amount.
- 1261060: Execute applies Deep Wounds; six-second base bleed carries remaining damage into reapplications.
- 1261062: Mortal Strike and Slam critical hits apply Deep Wounds at 100% effectiveness.
- 262115: the resulting bleed, not a separately pressed rotation ability.
- 262111: historical Mastery: Deep Wounds tooltip still responds but has completion_category 0; availability of a tooltip is not proof of current use.

SimulationCraft fixed 12.1 snapshot lists Deep Wounds in spec 71, 72 and 73, and Mortal Wounds in spec 71:
https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/trait_data.inc

Icy Veins overview and spell glossary describe the new mastery, while its stat-priority page still describes the previous debuff-dependent mastery. Used current spell identity and effect instead of treating every 12.1-labeled page as internally consistent.

## Changes

Removed old mastery note/ID; added current mastery and Mortal Wounds; moved the shared Deep Wounds note into common talents with all three specialization scopes. Updated inbound wiki references, removed false mastery/bleed application claims, and added a direct Arms bleed-source graph. The legacy broad synergy clusters and full warrior guides are not certified complete.

Run `npm run sync-kb`, then `node scripts/verify-warrior-rend-kb.cjs`.
