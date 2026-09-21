# Warrior hero passives, 12.1

Checked 2026-09-22 using current Korean Wowhead tooltip JSON, including specialization-specific `spells` branches:

- 444767: Slayer's Dominance, Arms 25%, Fury 15%. Both grant Executioner, 3% Execute damage per stack for 12 seconds. The 500ms restriction is not a user-cast cooldown.
- 444774: Opportunist, Arms Tactician reset grants next Overpower 20% damage and critical damage; Fury Raging Blow self-reset grants next Raging Blow 10% for both. Cap 2 stacks. Critical damage is not critical chance.
- 429641: Tide of Battle, 3% per Colossal Might stack; Arms Overpower/Execute, Protection Revenge/Execute.
- 429644: No Stranger to Pain, Ignore Pain prevention amount +30%, not a universal 30% damage reduction or permanent accumulating bonus.

Source format: `https://nether.wowhead.com/tooltip/spell/{id}?dataEnv=1&locale=1`.
The official 12.1 note URL was found but returned 403 on open; no unobserved text from it was used. Current tooltip branches are the evidence for the class-specific values.

Canonical notes, generated DB, four narrowly scoped synergy notes and all three warrior guide explanations updated. Verify with `node scripts/verify-warrior-rend-kb.cjs` after sync. This check does not certify all warrior talents or guide recommendations. The old broad Slayer graph remains a separate review item; Ignore Pain's generated specialization scope also needs an independent audit.
