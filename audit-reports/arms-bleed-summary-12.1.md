# Arms bleed summary consistency review

Reviewed 2026-09-22. This is not full Arms completion.

## Evidence

Re-fetched the Korean tooltips for 772, 1261060, 1261062, 1258398, 383154 and 845 from `https://nether.wowhead.com/tooltip/spell/{id}?dataEnv=1&locale=1`.

Rend is single-target, costs 10 Rage and has a 15-second bleed. Learned Rend is applied by Cleave. Bloodletting additionally applies learned Rend through Mortal Strike below 35% target health. Deep Wounds is a separate talent bleed from Execute; Fatal Wounds adds Mortal Strike and Slam critical strikes as application sources. The mastery provides two-handed weapon damage independently of these bleeds.

The rotation reference https://www.icy-veins.com/wow/arms-warrior-pve-dps-rotation-cooldowns-abilities distinguishes single target and 3+ target Cleave usage. This review does not import its entire dynamically filtered priority list or claim new log statistics.

## Corrections

The detailed guide already had current bleed mechanics, but the introduction, core conclusion, tips and priority captions still described old assumptions. Removed internal graph-layout justification from the opening and an unsupported current-use-rate claim. Rewrote those passages around target count, actual applications and conditional refreshes. Added the Bloodletting path to the canonical Rend description and linked its existing synergy; updated the canonical build note's bleed review entry.

## Verification

The scoped warrior script now checks the generated Rend condition and rejects the replaced stale guide claims. Full build and public mobile checks follow independently. The opener, complete priority list, older hero paragraphs and remaining warrior KB still require review.
