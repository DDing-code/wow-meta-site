# Additional retired Arms talents

Verified 2026-09-22. Removed canonical records and live graph references for:
- 383317 Merciless Bonegrinder / 무자비한 해골분쇄자
- 383219 Exhilarating Blows / 전율의 강타
- 248621 In For The Kill / 살상의 기회
- 383442 Blunt Instruments / 둔기류 활용법
- 400314 Spiteful Serenity / 원한의 평화

Blizzard explicitly lists these removals: https://news.blizzard.com/en-us/article/24244455/midnight-pre-expansion-content-update-notes

No corresponding talent rows appear in the fixed 12.1.0.69875 snapshot: https://github.com/simulationcraft/simc/blob/774babde5ddc7c5fc9f1abb129b473f8a076df70/engine/dbc/generated/trait_data.inc

English spell identities were cross-checked against Wowhead tooltip endpoints with dataEnv=1 and locale=0. Continued tooltip availability was not mistaken for current talent availability.

Removed the old passive-stat-support graph, which grouped Die by the Sword with passive stat nodes to avoid isolated nodes rather than documenting an actual mechanic. Kept the underlying current abilities; no fabricated replacement relationship was introduced.

No manuscript or shared guide-component references to these five names or IDs were found. DB synchronization updates the guide's linked skills and graph. Regression checks reject all five IDs and the deleted graph. Full Arms rotation, current builds, and remaining talents are not certified by this cleanup.
