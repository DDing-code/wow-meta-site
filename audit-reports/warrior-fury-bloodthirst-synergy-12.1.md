# Fury Bloodthirst healing relationships

Reviewed 2026-09-22. Prior turn 6c7f8238 made verified progress; this turn updates the canonical relationship note and its generated DB record, not the entire Fury migration.

The old relationship selected Rampage and Raging Blow as participants while hiding the actual bleed/healing talents in related IDs. GuideDetailPage.getSynergySkills uses explicit participants when present, so those talents did not participate in this relationship's graph. Its prose also grouped unrelated triggers without explaining their conditions.

Retained the stable relationship ID and filename. Restricted participants to Bloodthirst, Cold Steel Hot Blood, Bloodborne, Enraged Regeneration and Invigorating Fury. Added a manually written description via the existing canonical frontmatter field; the builder already exports it and describeSynergyRecord already displays it. No renderer or synchronization abstraction added.

The guide's existing defensive section now distinguishes unavailable attack targets, healing during the defensive buff, and talent-driven immediate healing. No guaranteed effective healing or damage-to-healing percentage inferred.

## Sources read this turn

- https://www.wowhead.com/spell=383959/cold-steel-hot-blood
- https://www.wowhead.com/spell=385703/bloodborne
- https://www.wowhead.com/spell=184364/enraged-regeneration
- https://www.wowhead.com/spell=383468/invigorating-fury
- https://www.wowhead.com/spell=393950/bloodcraze (separate Raging Blow damage path, not included in this healing relationship)

Spell records and Korean names were retained from the preceding audited 12.1 updates. This does not certify the remaining graph records, rotation, or all classes.
