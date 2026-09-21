# Ravager 12.1 scope and effect

Manual check 2026-09-22. This does not mark Arms or Protection fully updated.

## Evidence

- https://nether.wowhead.com/tooltip/spell/228920?dataEnv=1&locale=1 : 쇠날발톱, warrior_talent_icon_ravager. Base 40 yards, instant, 1.5-minute cooldown, one charge; 12-second weapon, damage reduced beyond eight targets. Enemies damaged take 50% increased damage from the caster's bleeds for 12 seconds. Protection clause separately grants 10 rage when dealing damage; Arms clause does not.
- https://www.wowhead.com/guide/classes/warrior/protection/midnight-season-2 : 12.1 redesign removes Revenge/Thunder Clap direct damage amplification and replaces it with bleed vulnerability.
- SimulationCraft fixed commit `774babde5ddc7c5fc9f1abb129b473f8a076df70`, `engine/dbc/generated/trait_data.inc`, build 12.1.0.69875: Ravager 228920 has Arms 71 entry 136702 / definition 141474 and Protection 73 entry 132880 / definition 137666. No Fury 72 row. Tooltip also presents only Arms/Protection branches.

## Correction

Kept one shared atomic note with accurate Arms/Protection scope. Removed Ravager from the all-three-spec hub rather than creating a Fury edge to an unavailable skill. Added two three-node specialization-specific bleed synergies; avoids importing the Arms direct Rend node into Protection. Guide paragraphs and Arms opener note now describe bleed amplification rather than Cleave direct damage.

## Follow-up discovered

Canonical legacy Death Dance 390713 (Arms) and Storm of Steel 382953 (Fury) still mention obsolete Ravager interactions. Both IDs return historical tooltips with completion_category 0 but neither occurs in the fixed current trait data. Audit their replacements and all graph callers before removal; tooltip availability alone is not proof of a current selectable talent. They remain unverified 12.0.5 notes, not newly validated effects.

The Ravager tooltip includes a conditional 1719 substitution to 75%, despite the selectable scope above; the new guide uses the verified default 50%, not an invented universally available Recklessness/Ravager interaction.

Run `npm run sync-kb` and `node scripts/verify-warrior-rend-kb.cjs`.
