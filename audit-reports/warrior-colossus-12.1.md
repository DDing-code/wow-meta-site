# Warrior Colossus 12.1 audit

Verified 2026-09-22. This is a scoped mechanic correction, not completion of either warrior guide.

## Evidence

- https://nether.wowhead.com/tooltip/spell/436358?dataEnv=1&locale=1 : Demolish, base 30-second cooldown, 2-second channel; channel allows block/parry/dodge and certain defensive abilities, grants 10% damage reduction and stun/knockback/forced-movement immunity. Last strike hits nearby enemies within 10m, reduced beyond 8.
- https://nether.wowhead.com/tooltip/spell/429634?dataEnv=1&locale=1 : Colossal Might, 5% next Demolish damage per stack, base cap 5. Arms gains from Mortal Strike or Cleave hitting at least 3; Protection gains from Shield Slam or Revenge hitting at least 3.
- https://nether.wowhead.com/tooltip/spell/429636?dataEnv=1&locale=1 : Dominance, cap 10; affected enemies take up to 10% more damage from the caster and deal up to 20% less to the caster for 10 seconds, scaling with consumed stacks. No overflow cooldown reduction.
- https://www.icy-veins.com/wow/arms-warrior-pve-dps-guide : 12.1 change list independently identifies cooldown reduction removal and Demolish 45 to 30 seconds.

## Changes and limits

Hand-rewrote the three canonical talents and three direct synergy notes. Restricted the latter to mechanically supported participants instead of a whole hero-tree cluster. Updated both guide descriptions and removed claims that overflow stacks accelerate Demolish. No current popularity or DPS gain is inferred from these tooltips. Old guide-wide build recommendations and additional hero talents still need review.

Run `npm run sync-kb` then `node scripts/verify-warrior-rend-kb.cjs`. The check covers these values and graph membership, not every warrior mechanic.
