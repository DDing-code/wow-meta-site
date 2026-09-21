# Fury season 2 tier: current versus launch values

Manual check 2026-09-22. Whole Fury guide remains a migration in progress.

## Current primary evidence

- https://nether.wowhead.com/tooltip/spell/1296645?dataEnv=1&locale=1 : Raging Blow +15% damage; while Recklessness active, extends it 2 sec per use, max 6 sec.
- https://nether.wowhead.com/tooltip/spell/1296646?dataEnv=1&locale=1 : Bloodthirst +10% damage; while Recklessness active, increases its critical strike bonus by 3%, max 6%.
- https://www.wowhead.com/spell=1296646 : live spell details show effect values 3 and 2, matching the two increments, not launch 5/10.
- https://nether.wowhead.com/tooltip/spell/1719?dataEnv=1&locale=1 : base Recklessness 1.5-minute cooldown, 12 seconds, +50% rage generation and +20% ability critical strike chance.
- https://worldofwarcraft.blizzard.com/en-us/news/24296142/hotfixes-september-2-2026 : official indexed hotfix text explicitly changes Fury 4-piece from 5%/10% to 3%/6%, alongside a baseline damage adjustment. Search excerpt was accessible; opening the slugless article returned 403. Do not claim a precise change date from the page title alone.

## Conflicting source resolved

https://www.wowhead.com/guide/classes/warrior/fury/midnight-season-2 (updated 2026-08-18) still prints 5%/10%. Current Korean tooltip, live spell detail and official hotfix excerpt agree on 3%/6%; use those, not the older guide value. Names of both set effects remain English even in locale=1, icons trade_engineering; no invented official Korean name.

## Work and remaining scope

Two manually authored canonical set notes plus a direct five-node synergy. Updated Recklessness atomic note and manuscript cooldown section, including separate caps and warning against interpreting pre-cooldown casts as accumulated bonuses. Retired the manuscript's June aggregate as current meta evidence. Removed unsupported fixed 10-15% delay-loss threshold.

`node scripts/verify-warrior-rend-kb.cjs` checks generated values, scope and graph nodes. It does not prove full hero-talent, build, current logs or rotation completion.
