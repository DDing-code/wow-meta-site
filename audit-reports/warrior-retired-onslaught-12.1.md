# Remove retired Fury Onslaught and Tenderize

Checked 2026-09-22. Scope: obsolete generator and its dependent talent; full Fury rotation remains under review.

- Onslaught 315720 and Tenderize 388933 are absent from current trait and specialization-grant data and the warrior module at SimC revision 774babde5ddc7c5fc9f1abb129b473f8a076df70. Current Wowhead Fury overview lists Onslaught among removed active abilities.
- Deleted the two canonical records, sync mappings, participant/related IDs and direct incoming links. Renamed the generator graph and updated incoming paths; stable graph ID retained.
- Removed Onslaught from Fury prose, section title, practical bullet and log-review criterion. Also replaced chart-authoring instructions in that affected passage with player-facing resource/Enrage checks.
- Build chart validation caught a remaining hardcoded Onslaught uptime row in GuideDetailPage; removed it rather than assigning fabricated timings to a replacement spell.
- No other-class Onslaught names were removed. Historical changelog remains history.
- Canonical KB and generated DB synchronized. The revised text does not invent a replacement cooldown or claim all current priorities are verified.

Sources:
- https://www.wowhead.com/guide/classes/warrior/fury/overview-pve-dps
- https://www.icy-veins.com/wow/fury-warrior-pvp-guide
- https://raw.githubusercontent.com/simulationcraft/simc/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/trait_data.inc
- https://raw.githubusercontent.com/simulationcraft/simc/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/specialization_spells.inc
- https://raw.githubusercontent.com/simulationcraft/simc/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/class_modules/sc_warrior.cpp

Regression: `node scripts/verify-warrior-rend-kb.cjs` after KB sync.
