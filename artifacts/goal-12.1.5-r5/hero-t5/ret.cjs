const { load, save, swapBuild, insertEvidence } = require('./lib.cjs');
const g = load('08-성기사/징벌'); const j = g.j;
const WH = 'https://www.wowhead.com/ko/guide/classes/paladin/retribution/talent-builds-pve-dps';
const RAID = 'CYEAAAAAAAAAAAAAAAAAAAAAAAAAAAANbbzMzywMDAAAAAAzUGzwMjtxsNMz2MGjxwMWYbAYWmtZmZrBBAAsAYAwYGmBzYmZDYmZYMjBD';
const MP = 'CYEAAAAAAAAAAAAAAAAAAAAAAAAAAAwoZbbmZWGzMzAAAAAAYmyYGmZsNmthZ2mxYMGmxCbAYWmtZmZrBBAAsAYAwYGGYGzMbAzMDjZMYA';
const base = { sourceUrl: WH, heroLabel: '태양의 사자', heroTreeId: 50, specId: 70 };
const why = '12.1.5 이후 상위 로그 다수와 Icy Veins 12.1.5판 기본 빌드가 모두 태양의 사자라 기사단 견본에서 바꿨습니다.';
j.talentBuilds = j.talentBuilds.map(b => {
  if (b.id === 'single-target') return swapBuild(b, { ...base, code: RAID, sourceLabel: 'Herald of the Sun · Raid  (Best)', note: `단일 네임드 전투용 견본입니다. ${why}` });
  if (b.id === 'mythic-plus') return swapBuild(b, { ...base, code: MP, sourceLabel: 'Herald of the Sun · Mythic+  (Best)', note: `쐐기용 견본입니다. 던전과 파티에 맞춰 차단·군중 제어·해제 선택을 조정하세요. ${why}` });
  if (b.id === 'raid') return swapBuild(b, { ...base, code: RAID, sourceLabel: 'Herald of the Sun · Raid  (Best)', note: `현재 원문에서 단일 네임드용과 일반 레이드용으로 같은 견본을 사용합니다. ${why}` });
  return b;
});
// 출처
const iv = j.sources.find(s => s.label === 'Icy Veins 영웅 특성 공개 추천 재대조');
iv.updated = '12 Oct. 2026 (Updated for Patch 12.1.5) / 2026-10-19 확인';
iv.note = '12.1.5판 기본 빌드(레이드·단일, 광역·쐐기)는 태양의 사자입니다. 기사단은 단일에서 근소하게 앞서고 방어가 강하며 짧은 광역 집중 피해가 강하고, 태양의 사자는 날개 안 집중 피해와 지속 광역이 강하다고 적었습니다. 두 분기를 상황에 따라 쓰는 것이 최선이지만 기본 빌드는 전반적으로 나은 태양의 사자라고 밝혔습니다.';
j.sources.push({
  tier: 'A',
  label: 'Wowhead 징벌 특성 빌드 - Bolas (12.1.5판)',
  url: WH,
  updated: '2026-10-13 / 2026-10-19 확인',
  note: '기사단과 태양의 사자 모두 레이드·쐐기 최선(Best) 빌드로 둡니다. 기사단은 단일·광역의 짧은 집중 피해와 방어가, 태양의 사자는 지속 광역과 긴 구간 집중 피해가 강하며, 쐐기에서는 빨리 죽는 적·생존이 필요할 때 기사단, 긴 풀에 태양의 사자라고 적었습니다. 특성 견본 세 개는 이 페이지의 태양의 사자 Raid·Mythic+ 코드입니다.',
});
j.sources.push({
  tier: 'S',
  label: 'WCL 12.1.5 이후 상위 랭킹 대조',
  url: 'https://www.warcraftlogs.com/reports/H3ZkGC1qhfTxrDa4#fight=11&source=16',
  updated: '2026-10-18 집계 / 2026-10-19 확인',
  note: '신화 님리사 랭킹 첫 100행(12.1.5 파티션)과 쐐기 시즌 2 상위 100행 중 12.1.5 이후 행을 실제 영웅 선택 노드로 판정했습니다. 전 지역 레이드 100행 중 태양의 사자 95%, 쐐기 53행 중 100%, 한국 레이드 45행·쐐기 27행 모두 태양의 사자입니다. 주소는 태양의 사자 레이드 최상위 전투입니다. 랭킹 상위 행이며 전체 사용률이 아닙니다.',
});
// 영웅 분기 문장(배열 순서 유지)
const herald = j.heroBranches.find(b => b.label === '태양의 사자');
herald.summary = herald.summary
  .replace('현재 공개 추천의 기본 예시입니다.', 'Icy Veins 12.1.5판(10월 12일) 기본 빌드이고, 12.1.5 이후 WCL 상위 랭킹에서도 다수입니다(신화 님리사 100행 중 95%, 쐐기 53행 중 100%, 전체 사용률이 아님).')
  .replace('이번 한국 검수: 레이드 1건·쐐기 1건.', '12.1.5 적용 전 한국 검수: 레이드 1건·쐐기 1건.');
const templar = j.heroBranches.find(b => b.label === '기사단');
templar.summary = templar.summary
  .replace('이번 한국 검수: 레이드 0건·쐐기 0건. 이 분기는 이번 한국 로그에 없어 조정 후 성능을 직접 비교하지 못했습니다.',
    '12.1.5 적용 전 한국 검수: 레이드 0건·쐐기 0건. 12.1.5 이후 WCL 상위 랭킹에서는 신화 님리사 100행 중 5%, 쐐기 53행 중 0%입니다(전체 사용률이 아님). Wowhead 12.1.5판(10월 13일)은 두 분기를 모두 최선으로 두고, 짧은 집중 피해·빨리 죽는 적·생존이 필요한 구간에 기사단을 권합니다.');
if (!herald.summary.includes('95%') || !templar.summary.includes('5%')) throw new Error('heroBranches 치환 실패');
// 결론(검사기 규칙상 checkedAt 2026-10-10 유지)
j.logReview.heroConclusion.conclusion = '12.1.5 이후 WCL 상위 랭킹(신화 님리사 100행 중 태양의 사자 95%, 쐐기 53행 중 100%)과 Icy Veins 12.1.5판(10월 12일) 기본 빌드가 모두 태양의 사자라 특성 견본 세 개를 태양의 사자로 맞췄습니다. Wowhead 12.1.5판(10월 13일)은 두 분기를 모두 최선으로 두고 짧은 집중 피해와 생존에 기사단을 권합니다. 랭킹 상위 행은 전체 사용률이 아니며 확정 순위가 아닙니다.';
insertEvidence(j, '12.1.5 이후 영웅 특성 대조(2026-10-19): 10월 13일 미국 적용 뒤 WCL 신화 님리사 랭킹 첫 100행 중 태양의 사자 95%, 쐐기 시즌 2 상위 100행 중 12.1.5 이후 53행 중 100%였습니다. 한국(10월 15일 06:00 이후)도 레이드 45행·쐐기 27행 모두 태양의 사자입니다. Icy Veins 12.1.5판 기본 빌드도 태양의 사자라 단일·쐐기·레이드 견본을 Wowhead 12.1.5판의 태양의 사자 코드로 바꿨습니다. 랭킹 상위 행은 전체 사용률이 아니고 쐐기 표본은 높은 단수 쪽으로 치우칩니다.');
j.caveats.push('logReview의 개별 전투·집계(10월 7~9일)와 한국 검수는 12.1.5(10월 13일 미국 적용) 전 기록입니다. 12.1.5 이후 영웅 선택은 WCL 랭킹 상위 행으로만 대조했으며 영웅 특성 간 확정 순위가 아닙니다.');
save(g); console.log('saved', g.file);
