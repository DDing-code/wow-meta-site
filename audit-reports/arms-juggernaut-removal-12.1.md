# Retired Arms Juggernaut

Verified 2026-09-22. Removed canonical talent 383292 and its references in two older synergy notes, then regenerated the live spell and synergy databases.

Evidence:
- Blizzard explicitly lists Juggernaut among removed Arms talents: https://news.blizzard.com/en-us/article/24244455/midnight-pre-expansion-content-update-notes
- SimulationCraft trait definitions at build 12.1.0.69875 contain neither 383292 nor Juggernaut: https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/trait_data.inc

The old Wowhead tooltip remaining available is not evidence that this talent is learnable. The stale KB combined that tooltip with generic 12.0.5 prose and unrelated area-damage graph links.

No guide manuscript reference was found. Graph notes still contain other unreviewed historical abilities; their patch and verification dates were deliberately not upgraded. Full Arms migration is not complete. Run `node scripts/verify-warrior-rend-kb.cjs` after KB synchronization to reject reintroduction into the live DB or graph.
