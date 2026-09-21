# Fury upgraded generators

Verified 2026-09-22. Previous goal turn 8d7b89ee made progress. Four canonical notes and guide explanation updated, without certifying the whole Fury rotation.

- Wrath and Fury 392936: 15% Raging Blow/Crushing Blow damage; Enrage gates only the additional 10 percentage-point self-reset chance. SimC checks Improved Raging Blow plus this talent plus Enrage and rolls the sum. This is not a Mountain Thane lightning talent.
- Reckless Abandon 396749: Recklessness activation grants 50 Rage, then enables upgraded generators while active. Old generated description truncated the bleed effect; replaced with concise complete prose.
- Bloodbath 335096: base 4.5-second cooldown, 8 Rage, 3% health heal, 30% Enrage chance; six-second bleed extends six seconds on the same affected target. No fixed gear-independent damage or stacking cap claimed.
- Crushing Blow 335097: base eight-second recharge, one charge/two with Improved Raging Blow, 12 Rage, additional 20% critical damage (not chance); tooltip reset 25%, conditional Wrath bonus separate.

## Sources

- https://www.wowhead.com/spell=392936/wrath-and-fury
- https://www.wowhead.com/spell=396749/reckless-abandon
- Korean Wowhead tooltip endpoints for 392936, 396749, 335096, 335097 read with dataEnv=1 and locale=1; existing official names/icons retained.
- https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/trait_data.inc
- https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/class_modules/sc_warrior.cpp

Trait entries 112255 and 119139 both retain Fury eligibility, one rank. Upgraded attack identities are granted by the talent, not independently selectable talent nodes. Primary coefficients omitted from prose intentionally; old 60% AP Bloodbath bleed was stale relative to the live tooltip's 187.26%. Base Rage is distinguished from modified in-combat gains.
