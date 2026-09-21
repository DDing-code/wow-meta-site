# Fervor of Battle: preserve the verified trigger

Verified 2026-09-22. Current Korean tooltip 202316 still states that Cleave or Whirlwind hitting at least three targets triggers Slam against the primary target, with 50% additional damage.

Source: https://nether.wowhead.com/tooltip/spell/202316?dataEnv=1&locale=1

The fixed SimulationCraft 12.1 implementation agrees: Cleave and Whirlwind construct a child Slam action, test actual targets hit, and the Slam multiplier checks from_fervor before applying the bonus.

Source: https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/class_modules/sc_warrior.cpp

Icy Veins' glossary summarizes this as direct Cleave/Whirlwind damage and a Collateral Damage interaction. That summary was not taken as proof that the automatic Slam mechanic was removed. No unverified blanket damage multiplier or automatic Collateral Damage stack grant was published.

Rewrote the canonical note, added a targeted trigger relationship, and explained actual target count and triggered-versus-manual Slam in the guide. Existing historical source notes were not rewritten as new tuning evidence. This does not certify all remaining Arms mechanics.
