# Warrior utility passives, 12.1

Verified 2026-09-22. Six records corrected; Thunder Clap and remaining combat flows still require separate review.

Sources: current Korean JSON tooltips for 275339, 382260, 1271925, 29838, 203201 and 1271948 using `https://nether.wowhead.com/tooltip/spell/{id}?dataEnv=1&locale=1`. Current one-rank shared trait entries verified at https://raw.githubusercontent.com/simulationcraft/simc/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/trait_data.inc .

- Rumbling Earth: Shockwave range +6 meters and cooldown -15 seconds on at least three actual targets hit. Forward cone remains a cone.
- Fast Footwork: movement speed +5%, not Haste.
- Fearless: Berserker Rage cooldown -50% and movement-impairment removal. Not universal stun immunity or general dispel.
- Second Wind: six percent healing per second after five damage-free seconds, plus a separate below-35%-health healing condition beginning at two percent and increasing nearer death. No invented scaling formula or combined total is asserted. English text at https://www.wowhead.com/spell=29838/second-wind corroborates the two conditions.
- Crackling Thunder: Thunder Clap radius +50% and additional slow 20%, not a root or stun.
- Javelineer: throwing range +5 meters, damage bonuses on specified throws, three-second silence only from Shattering/Wrecking Throw against nonplayers, not Champion's Spear.

Javelineer's former `inv_spear_01` icon was a substitute. The current tooltip identifies `8026700`; both small and large files at `https://wow.zamimg.com/images/wow/icons/{size}/8026700.jpg` returned HTTP 200 with image/jpeg. Canonical icon and generated DB now use that official asset.

Guide prose distinguishes real hit counts, safe recovery conditions and silence eligibility. Tests cover both healing conditions and the official icon. This does not certify unrelated guide recommendations or whole-class completion.
