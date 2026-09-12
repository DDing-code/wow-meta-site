# 12.1 update status

Checked against the runtime manuscript map on 2026-09-13. The objective remains all 40 specializations, including canonical KB notes, generated spell/synergy data, authored guide text and charts. A patch label or a passing structural test alone is not completion evidence.

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

### Unholy Death Knight

- Replaced the old manuscript in place with 15 manually authored practical sections, role-specific summaries, tips, a default opener and separate Rider/Sanlayn combat flows. Canonical source: `../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/01-죽음의기사/부정/Meta/guide-12.1.json`.
- Updated 40 Unholy atomic notes and ten authored synergies, then regenerated the spell/synergy DB. The site diff also corrects two shared Rider records; unrelated manuscripts are unchanged.
- Corrected Army 90s/30s/eight-ghoul orders, Soul Reaper ghoul-ready stack consumption, Putrid Echoes multi-charge consumption, Lord of the Dead, specialization apex nodes, Season 2 pet spells and execute effects.
- Separated actual casts from effects/talents: Dark Transformation 1233448/63560, Festering Scythe 458128/455397, Blightfall 1271967/1271974. Pet spells and passive buffs never appear as opener buttons.
- Added current passive Clawing Shadows 1241567/1241569 (live 10% chain reduction, not the cached 20% or old active 207311), Harbinger of Doom and Menacing Magus. Apocalypse Now now resolves for both Frost and Unholy; its missing scope had suppressed Unholy inline icons.
- Read SimC APL commit `8de87ce5b2bf373ea36be556afd1481557dc3fe0` (2026-09-07). The normal three-target/apex four-target baseline is labeled as a model, not collected WCL evidence. Old June usage percentages were removed.
- Removed the placeholder cooldown chart. The graph uses Putrefy and five actual direct synergy connections. Fixed shared relation cards that had inserted an unrelated center spell, and classified buffs as effects. Added runnable regression checks for these cases and for patch-version headings being incorrectly stripped as chapter numbers.
- Canonical equality, scoped gameplay assertions, all prebuild checks and production build passed on 2026-09-13. Online atomic tooltip/metadata/link checks passed for 40 notes; explicit guide spell-name/icon checks passed for 19 IDs, both with zero errors/warnings.
- Desktop, 390px and 320px opener/hero-flow checks found no page overflow or broken images. Hero switching and the final production bundle `main.50e2d332.js` were verified in the browser. The Sanlayn relation no longer invents Putrefy participation.
- Limits: latest raid/M+ aggregate data, personal simulations, the Blizzard 12.1 patch-note body and private Acherus messages were not obtained. The guide states these limits instead of inventing usage rates or DPS. Dense graph labels, older shared DK notes, 87 global KB link warnings, mixed-patch metadata and the large bundle still require work. Original Markdown remains outside the site Git repository; this commit preserves generated DB and site content.

### Havoc Demon Hunter

- Replaced the old manuscript in place with 13 manually authored sections and separate Fel-Scarred/Aldrachi explanations, resource conditions, practical tips and log-review criteria. Canonical source: `../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/02-악마사냥꾼/파멸/Meta/guide-12.1.json`.
- Reviewed Wowhead Shadarek, Icy Veins Wordup, Method Hype, current Korean spell effects and SimC APL commit `7606c71c1c44f7a501929b634debc58cb5a5f123` (2026-09-08). Differences between author recommendations remain explicit; no current WCL usage percentages were invented.
- Rewrote 27 existing atomic notes, added 27, removed obsolete Sigil of Doom, and authored 11 synergies. The current Havoc scope contains 54 numeric atomic notes. Corrected seven shared spell/hero records and two hero-tree notes, then regenerated DB and sync-state metadata.
- Replaced covenant Hunt 323639 with current cast 370965, and Fury of the Aldrachi damage effect 444806 with talent 442718. Corrected base cooldowns/costs, passive versus active classification, apex next-cast reset, Season 2 set effects, movement talents and Aldrachi consumption order.
- Fixed title-only DB descriptions by using the existing canonical parser's description heading. Regression checks now require real descriptions for all 54 Havoc notes and seven referenced shared records. Added aliases so references to the middle/last Eternal Hunt node resolve to the correct tooltip.
- Fel-Scarred's 15-step flow and Aldrachi's 12-step AoE flow contain only real player casts; automatic procs remain conditions. Removed the old placeholder cooldown chart.
- Fixed shared rendering that truncated manually authored openers at 12 steps: both chart variants now reuse the full authored flow mapper. Removed note line-clamping so step conditions remain readable. Non-numeric hero-tree IDs no longer become broken Wowhead spell links in guide text/cards/graphs. Runnable checks cover the step limit and invalid IDs.
- Online atomic tooltip/metadata/link validation passed for 54 notes with zero errors/warnings; explicit guide name/icon validation passed for 24 IDs. Canonical equality, scoped mechanic assertions, all prebuild checks and production build passed on 2026-09-13.
- Inspected desktop, 390px and 320px flows and hero switching. Final bundle `main.4ec850af.js` renders 15/12 steps, no clipped step paragraphs, no document overflow, no broken loaded images and no non-numeric spell links in these checks. The graph centers on Eye Beam with six direct synergy connections.
- Limits: Blizzard patch-note body, latest raid/M+ aggregates and private Fel Hammer messages were unavailable. Inertia duration and adjusted Immolation Aura generation differ between live tooltips and guides and remain flagged. Dense graph labels still overlap in places; old shared DH notes and the other DH manuscripts need separate re-audits. Global 87 KB link warnings, mixed-patch metadata and the large bundle remain. Original Markdown is outside the site Git repository; the commit contains the generated DB and site changes.

### Vengeance Demon Hunter

- Replaced the old manuscript in place with 15 manually authored sections, practical tips, Annihilator/Aldrachi explanations, separate 14/12-step openers and conditional 16/18-row priorities. Canonical source: `../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/02-악마사냥꾼/복수/Meta/guide-12.1.json`.
- Reviewed current Korean tooltips, Wowhead Itamae, Icy Veins Meyra and Method Meyra/Fel Hammer public guides. The available SimC Vengeance file was last changed in April; it is explicitly historical, not proof of the current optimal rotation.
- Manually authored 44 local atomic notes and 12 synergy notes, corrected shared Aldrachi/Annihilator scopes and specialization-dependent effects, updated canonical source/sync metadata, and regenerated spell/synergy JSON.
- Corrected personal Fiery Brand damage reduction, Spirit Bomb cooldown/cost, manual Untethered Rage activation, passive Soul Barrier, Fury-based Feed the Demon, Meteoric Fall stack consumption, Worldkiller cooldown reduction and target-specific Season 2 bonuses. Openers contain actual casts, with passives and selected talents represented as conditions.
- Re-audited seven shared DH utility notes and three common relationships. Blur is limited to Havoc/Devourer, Chaos Brand is a passive debuff, and unrelated shared skills no longer appear in every common synergy. Other older shared notes were not bulk relabeled.
- The existing priority renderer now uses an authored selected-hero priority when present, with the same hero state as the opener. Priority and specialist-chart sections use the existing full-width layout instead of the narrow sidebar track. Shared-spell labels use the displayed specialization instead of the original storage folder name.
- Canonical equality, scoped mechanic/scope assertions, all prebuild checks and production build passed on 2026-09-13. Online strict metadata/name/link validation passed for all 44 local atomic notes and 16 numeric shared notes; explicit guide name/icon validation passed for 26 IDs. Shared metadata validation is not a claim that all 16 shared mechanics were fully re-audited.
- Inspected desktop, 390px and 320px flow, priority switching and defensive-chart layouts. Final production bundle `main.ea1b4a00.js` displays the correct specialization label, no Blur links, no broken loaded images and no document overflow in these checks. All 443 rendered spell href attributes are numeric, including SVG graph links. The graph centers on Spirit Bomb with six actual direct synergy connections.
- Limits: Blizzard patch-note body, latest raid/M+ aggregate data, personal simulations and private Fel Hammer messages were not obtained. Source disagreements remain explicit; no usage percentages or guaranteed DPS gain were invented. Dense graph labels, older shared records, 87 global KB link warnings, mixed-patch metadata and the large bundle remain. Original KB Markdown/JSON is outside the site Git repository; this commit preserves generated DB and site changes.

## Previously labeled 12.1, not yet re-audited in this rollout

Devourer Demon Hunter, Arcane Mage, Balance Druid, Devastation Evoker, Mistweaver Monk, Elemental Shaman, Holy Priest, Restoration Druid, Holy Paladin, Preservation Evoker.

## Still 12.0.5: 25 manuscripts

| Class | Specializations |
| --- | --- |
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

- Complete fresh manual research and KB/DB/guide updates for the 25 older manuscripts; next: Guardian Druid.
- Re-audit the ten previously labeled 12.1 manuscripts against current sources rather than assuming their labels prove freshness.
- Recheck shared and older atomic notes, current talent availability, base versus talent-adjusted cooldowns, hero-specific flows and source disagreements.
- Replace any remaining placeholder chart content; inspect each specialization's rendered flow and graph rather than extrapolating from Blood.
- Resolve existing global KB link warnings and mixed-patch metadata when the underlying records are genuinely updated. Do not bulk relabel them to suppress warnings.
- Finish scoped visual checks, builds and commit/push for each verified batch. Netlify production availability is a separate billing issue; a Git push does not prove wowmeta.xyz is serving the new build.
