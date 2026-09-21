# Retired Arms talent dependency cleanup

Verified 2026-09-22. Removed Skullsplitter 260643, Storm of Swords 385512, Storm Wall 388807, and Test of Might 385008 from canonical KB and regenerated live DB.

Evidence:
- Blizzard explicitly lists all four as removed Arms talents: https://news.blizzard.com/en-us/article/24244455/midnight-pre-expansion-content-update-notes
- None appears in the 12.1.0.69875 trait definitions: https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/trait_data.inc

Removed the obsolete Skullsplitter-centered bleed graph and its inbound links instead of inventing an equivalent current ability. Remaining graph participants and narrative references were cleaned. Replaced the manuscript's Skullsplitter advice with the verified distinction between Rend and Deep Wounds.

Current external Slam tooltip still displays a conditional Storm of Swords Rage-generation fragment: https://nether.wowhead.com/tooltip/spell/1464?dataEnv=1&locale=1 . This does not establish current learnability. Removed that misleading fragment from the published description; did not certify every other part of the old Slam record.

Regression check: `node scripts/verify-warrior-rend-kb.cjs`. Full Arms build and rotation certification remains open; old broad graph notes have not been relabeled as fully reviewed.
