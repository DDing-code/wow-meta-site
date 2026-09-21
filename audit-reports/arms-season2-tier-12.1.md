# Arms season 2 tier review

Reviewed 2026-09-22. Full warrior migration remains open.

## Evidence

- https://nether.wowhead.com/tooltip/spell/1296643?dataEnv=1&locale=1
- https://nether.wowhead.com/tooltip/spell/1296644?dataEnv=1&locale=1
- https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/class_modules/sc_warrior.cpp
- https://www.icy-veins.com/wow/arms-warrior-pve-dps-gear-best-in-slot

The current Korean tooltip specifies 2pc: Mortal Strike/Execute +10%, Slam additional 100% AP damage around the target within 8 yards, reduced beyond 5 targets. The 4pc is Overpower +15%, Mortal Strike/Overpower building +20% next Slam damage up to 5 stacks. The names remain English in Korean Wowhead; trade_engineering is its actual icon, not a fallback selected by this site.

In the fixed simulation implementation, slam_base_t executes concussive_slam and expires winding_up; Heroic Strike inherits this implementation. Background Fervor attacks also use it. This supports explaining why manual Slam casts alone cannot measure set consumption. It does not establish a log-derived damage gain or a universal five-stack priority.

## Changes

Added missing canonical set records and their shared consumption synergy, then a hand-written guide section. Replaced the misleading June source-status header with an explicit partial-12.1-review status. Kept the old guide patch label until the remaining opener and priority review is complete; did not certify the entire spec by adding these records.

## Checks

`node scripts/verify-warrior-rend-kb.cjs` covers generated set IDs, spec membership, official icon, passive classification, numerical descriptions and seven synergy participants. Build and public mobile rendering are checked separately. Other gear recommendations and old guide sections are not certified by this test.
