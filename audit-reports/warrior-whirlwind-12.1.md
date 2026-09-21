# Whirlwind spell ownership

Checked 2026-09-22. The DB lacked Arms 1680 and exposed Fury 190411 to both specs. Existing Arms synergy records already used 1680, leaving their participant unresolved.

- Added canonical Arms 1680: 20 Rage expenditure, nearby physical AoE, reduced damage beyond five, conditional Fervor of Battle interaction.
- Restricted 190411 to Fury: base 3 Rage generation, conditional Improved Whirlwind cleave and Storm of Blood Rend. Kept its existing canonical path to avoid breaking Fury links; explicit specs governs page filtering.
- GuideDetailPage recordMatchesGuide rejects specific scope mismatches before allowing common records. No new resolver needed. Verify rendered Arms/Fury links separately.
- 1680's displayed 100-yard range is an internal Vision range, not a ranged AoE claim. It was not imported into the public range field.
- Canonical KB, generated DB and Arms prose updated. Existing Arms synergy IDs now resolve to the correct spell. Full warrior rotation review remains open.

Sources:
- https://www.wowhead.com/spell=1680/whirlwind
- https://www.wowhead.com/spell=190411/whirlwind
- https://www.wowhead.com/spell=202316/fervor-of-battle
- https://raw.githubusercontent.com/simulationcraft/simc/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/specialization_spells.inc

Check: `node scripts/verify-warrior-rend-kb.cjs` after KB sync.
