# 폭풍의 흐름 토템: 12.1 단계 구분

확인일: 2026-09-22. 동일한 공식 한국어명을 사용하는 세 특성은 별도 ID로 유지한다.

- [1267016](https://www.wowhead.com/spell=1267016/stormstream-totem): 성난 해일 6% 발동으로 다음 치유의 토템 강화. 강화 토템 치유량 10%, 추가 1명 100% 효율, 사용 시 다친 2명 즉시 치유. 확률 발동은 자동 설치가 아니다.
- [1267093](https://www.wowhead.com/spell=1267093/stormstream-totem): 토템 치유량 보정. 기본 툴팁과 효과 값 30%지만 Trait #141301 및 #141739의 Rank 1/2 표시는 20/40이다. 랭크별 최종 효과를 확정하지 않고 별도 검수 대상으로 남겼다.
- [1267120](https://www.wowhead.com/spell=1267120/stormstream-totem): 자연의 신속함 또는 선조의 신속함으로 사용권 부여. 폭풍의 흐름 토템 사용 시 치유의 토템 충전 비소모.
- [445034](https://www.wowhead.com/spell=445034/lively-totems): 복원에서는 치유의 토템, 치유의 해일 토템, 정신의 고리 토템 소환이 무료 즉시 연쇄 치유를 발동한다. 모든 토템으로 일반화하지 않았다.

각 ID의 한국어 이름과 설명은 nether.wowhead.com/tooltip/spell/{id}?dataEnv=1&locale=1 응답과 대조했다. 토템술사 설명 안에 위치하더라도 정점 특성을 토템술사 전용으로 표시하지 않는다.

## 랭크 검수 갱신

앞서 미확정으로 둔 1267093은 1포인트 20%, 2포인트 총 40%로 갱신했다. Wowhead 주문 상세의 Trait #141739 랭크 값 20/40, 고정 SimulationCraft 774babde5ddc7c5fc9f1abb129b473f8a076df70 trait_data.inc의 복원 entry 136976 / definition 141739 / 최대 2랭크 / 효과 곡선 98612, Wowhead 12.1 운용 가이드의 완성 특성 40% 설명을 대조했다. 기본 효과 30%는 랭크가 적용된 최종 값으로 사용하지 않는다.
