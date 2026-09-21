# Raging Blow and Rampage baseline

Checked 2026-09-22. Scoped correction, full Fury rotation remains under review.

- Raging Blow 85288: base one charge, eight-second recharge before haste, 12 Rage generated. Improved Raging Blow 383854 grants two charges and 25% self-reset; not an unconditional base effect or the same proc as Hack and Slash.
- Rampage 184367: base 80 Rage and four follow-up attacks, Enrage. Conditional modified cost is not always 80. Cast count and damage-event count are distinct.
- Replaced old four-AoE-strike replacement wording. Current Rampaging Ruin (1265357, 빗발치는 광란) adds an AoE hit on the final strike with the Improved Whirlwind buff active; it is not every build's unconditional base effect.
- Canonical KB, generated DB, guide explanation and scoped tests updated.

Sources:
- https://www.wowhead.com/spell=85288/raging-blow
- https://www.wowhead.com/spell=383854/improved-raging-blow
- https://www.wowhead.com/spell=184367/rampage
- https://www.wowhead.com/spell=1265357/rampaging-ruin
- https://raw.githubusercontent.com/simulationcraft/simc/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/class_modules/sc_warrior.cpp

Regression: `node scripts/verify-warrior-rend-kb.cjs` after KB sync.
