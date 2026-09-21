# Retired warrior talent cleanup

Manual audit 2026-09-22. Does not complete the full warrior migration.

## Evidence

- https://nether.wowhead.com/tooltip/spell/390713?dataEnv=1&locale=1 : historical Dance of Death tooltip still exists (completion_category 0). Its old effect concerned kills during Bladestorm/Ravager, not Execute health range.
- https://nether.wowhead.com/tooltip/spell/382953?dataEnv=1&locale=1 : historical Storm of Steel tooltip still exists (completion_category 0), describing charge/damage changes to Bladestorm/Ravager.
- SimulationCraft commit `774babde5ddc7c5fc9f1abb129b473f8a076df70`, generated `trait_data.inc`, build 12.1.0.69875: neither spell ID nor either English name is in the current trait list. Combined with the historical tooltip category, they must not be presented as current selectable talents. This does not claim the underlying historical spell was erased or date its original removal.
- https://nether.wowhead.com/tooltip/spell/29725?dataEnv=1&locale=1 : Arms Sudden Death bypasses health requirement, free next Execute, damage equivalent to 40 rage spent. Not rage gain.
- https://nether.wowhead.com/tooltip/spell/281001?dataEnv=1&locale=1 : Massacre allows Execute below 35% health; not a free cast effect.

## Changes

Deleted both legacy atomic notes and sync-state entries. Removed all matching participant/related IDs, direct links and unsupported prose from warrior synergy notes. Replaced the misleading execute hub with a three-node current availability explanation; renamed its file and all exact inbound wiki references, retaining its stable internal ID for compatibility. Updated Arms Sudden Death/Massacre notes and the corresponding manuscript paragraph.

All canonical KB text was searched for remaining IDs and obsolete note paths after cleanup. `node scripts/verify-warrior-rend-kb.cjs` asserts absent generated spells/edges and current availability mechanics. Other old synergy edges are not validated by this scoped cleanup.
