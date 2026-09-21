# Arms attack records and Slayer trigger review

Reviewed 2026-09-22; full warrior migration remains open.

## Evidence and corrections

Fetched Korean Wowhead tooltips at `https://nether.wowhead.com/tooltip/spell/{id}?dataEnv=1&locale=1` for 7384, 12294, 1273062, 316440, 385571, 444775 and 444769.

- Overpower's expanded tooltip contains malformed follow-up percentages. Replaced its raw dump with free attack, 12-second base recharge, avoidance exceptions and conditional Improved Overpower two charges/+15% damage.
- Mortal Strike: 30 Rage, 6-second base cooldown, 10-second 50% healing reduction. This is not a player damage bonus.
- Current learned Martial Prowess is 1273062 in the fixed 12.1 trait data, not 316440. Updated the canonical record in place, sync-state and both graph references. The old spell resolving in Wowhead does not establish it as the learned talent. Overpower/Slam prepare next Mortal Strike +5% per stack, max 3; not Cleave.
- Reap the Storm: Arms Cleave actual 3+ hits or Fury Improved Whirlwind-cleaved Rampage actual 3+ hits, 20% chance, reduced damage beyond 8. Imminent Demise supplies a separate Sudden Death consumption trigger. Removed descriptions that made Overpower the direct trigger.
- Imminent Demise: three Slayer's Strikes grant Sudden Death; consuming it prepares an extra Bladestorm attack up to three without extending total duration. Acquisition and consumption are distinct.

The fixed simulation source corroborates Cleave's target-count trigger, Execute's Sudden Death/Imminent Demise path, and Martial Prowess creation/consumption:
https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/class_modules/sc_warrior.cpp

Current talent membership:
https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/trait_data.inc

## Scope and verification

Updated six canonical records, current-build/graph notes, generated skill/graph DBs, and guide paragraphs. Added the shared trigger-path graph. The regression script checks IDs, current conditions and removal of the invalid learned ID. Build and production mobile rendering are separate checks. This does not certify complete opener priorities, all Fury interactions, or every remaining warrior talent. No PTR bug behavior or log-derived DPS increase was presented as current fact.
