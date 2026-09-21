# Enrage and Bloodthirst baseline

Checked 2026-09-22. Scoped correction, not complete Fury certification.

- Kept Enrage 184362: this is the actual buff used by the current warrior module. Specialization grant 184361 is the passive; absence of 184362 from grant tables does not make it removed.
- Replaced broken KB summaries whose inline wiki links disappeared from generated prose. Baseline Enrage: 4 seconds, 11% damage, Rampage guaranteed, Bloodthirst 30% chance. Selected enhancement talents are not combined into unconditional defaults.
- Bloodthirst: base 4.5s cooldown, 3% maximum-health heal, 8 Rage, 30% Enrage chance. The raw 80 Rage-unit field is 8 Rage, not 80. Conditions from the malformed combined tooltip are not flattened into a single final amount.
- SimC bloodthirst_t rolls Enrage after a successful primary result, independently of whether that result crits. Current modifiers/extensions remain separate. This is not an in-game experiment and does not prescribe a universal rotation.
- Updated canonical KB, generated DB, guide explanation and scoped tests. The current buff ID remains available to existing graphs and log analysis.

Sources:
- https://www.wowhead.com/spell=184361/enrage
- https://www.wowhead.com/spell=184362/enrage
- https://www.wowhead.com/spell=23881/bloodthirst
- https://raw.githubusercontent.com/simulationcraft/simc/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/class_modules/sc_warrior.cpp
- https://raw.githubusercontent.com/simulationcraft/simc/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/sc_spell_data.inc

Regression: `node scripts/verify-warrior-rend-kb.cjs` after KB sync.
