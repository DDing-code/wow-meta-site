# Fury weapons and mastery

Verified 2026-09-22. Previous turn 635c2ade was progress. All three records 46917, 81099, 76856 are granted Fury specialization spells in pinned 12.1 data, not selectable talent nodes. Do not delete them based on absence from trait_data.

46917 Titan's Grip is a passive weapon-equipping permission, not an active rotation button. 81099 Titan's Grip: Single-Minded Fury currently enables two-hand to one-hand transmog; old one-hand damage-build assumptions do not apply. Both incorrectly classified records are now passive. Canonical filenames retained for incoming links.

76856 Mastery: Unshackled Fury applies conditionally while Enrage is active. SimC parses mastery with an Enrage condition and invalidates the damage multiplier on mastery changes. External tooltip 11.0% is not a universal geared-character value. Corrected the previously reviewed Enrage description and its guide paragraph to avoid fixed-value and double-counting interpretations. Updated the existing scoped assertion rather than preserving the earlier 11% wording merely to pass it.

## Evidence

- Live Korean Wowhead tooltip endpoints for 46917, 81099, 76856, 184361 and 184362 read with dataEnv=1 and locale=1.
- https://www.wowhead.com/spell=46917/titans-grip
- https://www.wowhead.com/spell=76856/mastery-unshackled-fury
- https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/specialization_spells.inc
- https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/class_modules/sc_warrior.cpp

No new stat weights, gearing rankings, or overall Fury completion claim. Existing official Korean names and icons matched live endpoints.
