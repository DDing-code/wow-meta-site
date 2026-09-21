# Fury apex: Rampaging Berserker

Verified 2026-09-22. Canonical KB notes 1269308/1269309/1269310 manually rewritten, generated DB synchronized, guide cooldown section expanded.

- First stage: Rampage damage +10%; a Rampage use grants an 8-second, +3% Strength Berserk stack, 500 ms internal cooldown. SimC uses ASYNCHRONOUS stacks: new stacks do not refresh every old stack.
- Middle stage: maximum two points, -15 Rage and +5% Rampage damage per point during Recklessness only. Two points give -30 Rage/+10%; with no other cost modifiers, 80 becomes 50. This is not an unconditional cost of 50 or a refund of 30 after spending 80.
- Final stage: using Recklessness grants three Berserk stacks and increases Recklessness duration by 50%; base 12 becomes 18 seconds before other duration effects. This does not extend Berserk's own eight-second duration.

## Evidence

Live Korean tooltip endpoints for all three IDs returned the official name/icon and effects. English middle-stage details also expose rank scaling. Pinned 12.1 trait data has Fury entries 137004/137003/137002 with max ranks 1/2/1 in node 110412. `sc_warrior.cpp` directly applies middle-stage cost/damage during Recklessness, grants three stacks on Recklessness use, and configures independent stack expiration.

- https://nether.wowhead.com/tooltip/spell/1269308?dataEnv=1&locale=1
- https://nether.wowhead.com/tooltip/spell/1269309?dataEnv=1&locale=1
- https://nether.wowhead.com/tooltip/spell/1269310?dataEnv=1&locale=1
- https://www.wowhead.com/spell=1269309/rampaging-berserker
- https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/trait_data.inc
- https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/class_modules/sc_warrior.cpp

No maximum simultaneous Berserk stack count, damage gain estimate, or whole-guide certification asserted. Hero recommendations and complete rotation migration remain open.
