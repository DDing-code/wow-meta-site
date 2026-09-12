# 12.1 update status

Checked against the runtime manuscript map on 2026-09-12. The objective remains all 40 specializations, including canonical KB notes, generated spell/synergy data, authored guide text and charts. A patch label or a passing structural test alone is not completion evidence.

## Updated in this rollout

### Blood Death Knight

- Manually reviewed Wowhead, Icy Veins, Method Reholy and current Korean tooltip effects. Source dates and access limits are recorded in the manuscript.
- Replaced the 12.0.5 manuscript in place; canonical source: `../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/01-죽음의기사/혈기/Meta/guide-12.1.json`.
- Added Season 2 Blood Debt, Bloodshot, Ebon Blade Endurance, Blood-Soaked Ground and Blood Shield KB records and relationships; corrected Consumption empower stages, Gift of the San'layn, Vampiric Aura and Blood/Frost Exterminate scope.
- Bone Shield is stored as a buff, not a separately cast defensive. The Blood Shield shorthand resolves to the official mastery icon/tooltip.
- The opener uses actual cast buttons with conditional hero/tier steps. The defensive chart uses authored damage-type/recovery conditions, not arbitrary spell ordering.
- The canonical synergy builder now preserves an optional manually authored frontmatter `description`; the guide displays it before generic relationship text. The builder remains in the existing parent `scripts/kb-sync` directory, outside this site repository.
- Manuscript/KB equality and regression checks pass. Online icon/name checks passed for 21 explicitly referenced spells. Desktop, 390px and 320px opener layouts and hero switching were inspected; no document overflow or broken image was found in these checks.
- Final production build and its prebuild checks passed on 2026-09-12. Existing global KB link warnings (87), mixed-patch warnings and the large bundle warning remain; these checks are not evidence that all 40 guides are current.
- Limits: Archon M+ values were available only in search results; current raid aggregate data and the Blizzard patch-note body were inaccessible. Consumption rank advice differs between guide authors and remains conditional. This is not a claim that every older Blood/common atomic note or every graph layout has completed a full re-audit.

### Frost Death Knight

- Replaced the old manuscript in place with 15 manually authored sections. Canonical source: `../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/01-죽음의기사/냉기/Meta/guide-12.1.json`.
- Reviewed current Wowhead Korean tooltips, Wowhead Khazak, Icy Veins Bicepspump, Method Taeznak and the available Mythicstats M+ sample. Access limits and conflicting source advice remain explicit.
- Removed the obsolete draining Breath ID 152279 from the current DB and replaced it with 1249658. Updated Empower Rune Weapon, Obliteration, Rime, Frozen Dominion, Frostwyrm cast/recall, apex nodes and Season 2 effects in original KB notes and generated data.
- Current live set values are 1% attack speed and 2% Icy Death Torrent damage per stack, not the older PTR 2%/4% values. The graph uses the actual Freezing Tempest buff instead of an internal 4-piece placeholder icon; the internal effect still has a separate DB record.
- Authored eight synergy notes with explicit participants and explanations. Fixed the shared graph renderer so a synergy without the center spell no longer receives an invented center edge; a runnable regression check covers this behavior.
- Rider raid and Deathbringer non-Breath AoE openers use actual cast buttons. Passive Exterminate, automatic Winter and tier procs are conditions, not cast steps. Removed the old illustrative cooldown chart.
- Canonical manuscript equality, gameplay regression checks, prebuild validation and production build passed on 2026-09-12. Online icon/name checks passed for 16 explicitly referenced spell IDs. Desktop, 390px and 320px opener layouts and hero switching were checked, with no page overflow or broken images found in those checks.
- Limits: current raid aggregate/event data and the Blizzard patch-note body were inaccessible. Mythicstats covers 800 top +17-20 logs from 226 characters, not all players. Shared older DK notes and the dense graph's node/label layout still require re-audit; native anchor navigation worked on a fresh desktop render. Existing global KB link warnings (87) and the bundle-size warning remain.

## Previously labeled 12.1, not yet re-audited in this rollout

Devourer Demon Hunter, Arcane Mage, Balance Druid, Devastation Evoker, Mistweaver Monk, Elemental Shaman, Holy Priest, Restoration Druid, Holy Paladin, Preservation Evoker.

## Still 12.0.5: 28 manuscripts

| Class | Specializations |
| --- | --- |
| Death Knight | Unholy |
| Demon Hunter | Havoc, Vengeance |
| Druid | Guardian, Feral |
| Evoker | Augmentation |
| Hunter | Beast Mastery, Marksmanship, Survival |
| Mage | Fire, Frost |
| Monk | Brewmaster, Windwalker |
| Paladin | Protection, Retribution |
| Priest | Discipline, Shadow |
| Rogue | Assassination, Outlaw, Subtlety |
| Shaman | Enhancement, Restoration |
| Warlock | Affliction, Demonology, Destruction |
| Warrior | Protection, Arms, Fury |

## Remaining gates

- Complete fresh manual research and KB/DB/guide updates for the 28 older manuscripts; next: Unholy Death Knight.
- Re-audit the ten previously labeled 12.1 manuscripts against current sources rather than assuming their labels prove freshness.
- Recheck shared and older atomic notes, current talent availability, base versus talent-adjusted cooldowns, hero-specific flows and source disagreements.
- Replace any remaining placeholder chart content; inspect each specialization's rendered flow and graph rather than extrapolating from Blood.
- Resolve existing global KB link warnings and mixed-patch metadata when the underlying records are genuinely updated. Do not bulk relabel them to suppress warnings.
- Finish scoped visual checks, builds and commit/push for each verified batch. Netlify production availability is a separate billing issue; a Git push does not prove wowmeta.xyz is serving the new build.
