# Colossus Smash replaces the old Warbreaker branch

Verified 2026-09-22:
- Blizzard removed Warbreaker and folded its effects into Colossus Smash: https://news.blizzard.com/en-us/article/24244455/midnight-pre-expansion-content-update-notes
- SimulationCraft 12.1.0.69875 lists Arms 167105, not 262161: https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/trait_data.inc
- Current Korean tooltip 167105: 45-second base cooldown, 10-yard area, 10-second personal damage increase of 30% against struck enemies, reduced direct damage above eight targets: https://nether.wowhead.com/tooltip/spell/167105?dataEnv=1&locale=1

Removed old canonical spell 262161. Rewired KB links and graph IDs to 167105; renamed two synergy notes with their inbound links. Stable synergy IDs retained. Guide prose, opener, priority list, hero spell list and shared chart resolver now use one active spell, not separate single-target and area versions.

The two older broad graph notes retain their previous review status: replacing this retired reference does not certify their other participants. Full Arms talents, build recommendations and rotation still need review. No blanket patch-label upgrade was performed.
