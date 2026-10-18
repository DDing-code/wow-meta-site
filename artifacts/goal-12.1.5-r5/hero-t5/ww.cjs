const { load, save, swapBuild, insertEvidence } = require('./lib.cjs');
const g = load('07-수도사/풍운'); const j = g.j;
const WH = 'https://www.wowhead.com/ko/guide/classes/monk/windwalker/talent-builds-pve-dps';
const CONDUIT_MP = 'C0QAAAAAAAAAAAAAAAAAAAAAAMzYMgxYZmx2MAAAAAAAAAAAALDzEmhhBMjhZmZGmthZYWmJAgFmtxMmZmZAAsYmlZZMBBAMjBwMAjlBiZmZzA';
j.talentBuilds = j.talentBuilds.map(b => {
  if (b.id === 'mythic-plus') return swapBuild(b, { code: CONDUIT_MP, sourceUrl: WH, sourceLabel: '천신의 대변자 · Mythic+  (High Keys)', heroLabel: '천신의 대변자', heroTreeId: 64, specId: 269,
    note: '쐐기용 견본입니다. 던전과 파티에 맞춰 차단·군중 제어·해제 선택을 조정하세요. 12.1.5 이후 상위 쐐기 로그 다수와 Icy Veins 12.1.5판 쐐기 빌드가 모두 천신의 대변자라 음영파 견본에서 바꿨습니다. Wowhead는 주간 쐐기에 음영파, 고단 쐐기에 천신의 대변자를 둡니다.' });
  if (b.id === 'single-target' || b.id === 'raid') return { ...b, note: `${b.note} 12.1.5 이후 신화 님리사 상위 랭킹은 천신의 대변자가 95%지만 Icy Veins·Wowhead 12.1.5판이 레이드에 음영파를 권해 음영파 견본을 유지합니다.` };
  return b;
});
const iv = j.sources.find(s => s.label === 'Icy Veins 영웅 특성 공개 추천 재대조');
iv.updated = '12 Oct. 2026 (Reviewed for Patch 12.1.5) / 2026-10-19 확인';
iv.note = '12.1.5 검토판은 레이드(모든 네임드)에 음영파, 쐐기 빌드에 천신의 대변자를 둡니다. 단일·광역 모두 두 분기가 비슷하며, 음영파는 단순하고 실수에 관대하고 천신의 대변자는 상한이 조금 높지만 어렵고 실수의 손해가 크다고 적었습니다.';
const wh = j.sources.find(s => s.label === 'Wowhead 풍운 특성 빌드');
wh.updated = '2026-10-13 / 2026-10-19 확인';
wh.note = '음영파를 모든 콘텐츠의 일반 추천(레이드 단일·광역 Recommended, 주간 쐐기)으로 두고, 천신의 대변자는 숙련자용 레이드(Advanced)와 고단 쐐기 빌드로 둡니다. 쐐기 특성 견본은 이 자료의 천신의 대변자 Mythic+(High Keys) 코드입니다. 상호 배타적인 선택 노드를 동시에 필수 기술로 넣지 않습니다.';
j.sources.push({
  tier: 'S',
  label: 'WCL 12.1.5 이후 상위 랭킹 대조',
  url: 'https://www.warcraftlogs.com/reports/QhwxjpvWZ6HGcMtL#fight=6&source=2',
  updated: '2026-10-18 집계 / 2026-10-19 확인',
  note: '신화 님리사 랭킹 첫 100행(12.1.5 파티션)과 쐐기 시즌 2 상위 100행 중 12.1.5 이후 행을 실제 영웅 선택 노드로 판정했습니다. 전 지역 레이드는 판정된 99행 중 천신의 대변자 95%, 쐐기 34행 중 판정된 31행 모두 천신의 대변자이고, 한국도 레이드 50행 중 96%, 쐐기 13행 모두 천신의 대변자입니다. 주소는 천신의 대변자 레이드 최상위 전투입니다. 랭킹 상위 행이며 전체 사용률이 아닙니다.',
});
const sp = j.heroBranches.find(b => b.label === '음영파');
const cc = j.heroBranches.find(b => b.label === '천신의 대변자');
const s0 = sp.summary, c0 = cc.summary;
sp.summary = sp.summary.replace('이번 한국 검수: 레이드 1건·쐐기 0건. 선택·시전 사례이며 상대 분기보다 강하다는 증명이 아닙니다.',
  '12.1.5 적용 전 한국 검수: 레이드 1건·쐐기 0건. 선택·시전 사례이며 상대 분기보다 강하다는 증명이 아닙니다. 12.1.5 이후 WCL 상위 랭킹에서 음영파는 신화 님리사 5%, 쐐기 0%였지만(전체 사용률이 아님) Icy Veins·Wowhead 12.1.5판은 레이드에 음영파를 권해 레이드·단일 견본은 음영파로 둡니다.');
cc.summary = cc.summary.replace('이번 한국 검수: 레이드 1건·쐐기 1건. 선택·시전 사례이며 상대 분기보다 강하다는 증명이 아닙니다.',
  '12.1.5 적용 전 한국 검수: 레이드 1건·쐐기 1건. 선택·시전 사례이며 상대 분기보다 강하다는 증명이 아닙니다. 12.1.5 이후 WCL 상위 랭킹에서는 신화 님리사 95%, 쐐기 100%가 천신의 대변자였고(전체 사용률이 아님), Icy Veins 12.1.5판도 쐐기 빌드를 천신의 대변자로 두어 쐐기 특성 견본을 이 분기로 바꿨습니다.');
if (sp.summary === s0 || cc.summary === c0) throw new Error('heroBranches 치환 실패');
j.logReview.heroConclusion.conclusion = '공개 저자 12.1.5판(Icy Veins 10월 12일, Wowhead 10월 13일)은 레이드에 음영파를 권하고, 쐐기는 Icy Veins가 천신의 대변자, Wowhead가 주간 쐐기 음영파·고단 쐐기 천신의 대변자를 둡니다. 12.1.5 이후 WCL 상위 랭킹은 신화 님리사 95%, 쐐기 100%가 천신의 대변자입니다. 쐐기는 두 근거가 같아 견본을 천신의 대변자로 바꾸고, 레이드·단일은 두 근거가 달라 음영파 견본을 유지합니다. 랭킹 상위 행은 전체 사용률이 아니며 확정 순위가 아닙니다.';
const ci = j.caveats.findIndex(x => x.startsWith('현재 상위 로그 사용률·평균 DPS는 확보하지 못했습니다.'));
if (ci < 0) throw new Error('caveat 없음');
j.caveats[ci] = '전체 로그 사용률·평균 DPS는 확보하지 못했습니다. 12.1.5 이후 영웅 선택은 WCL 랭킹 상위 행으로만 대조했습니다. 영웅 특성 선택과 장비 비교는 가이드 추천이며 특정 점수나 상승률을 보장하지 않습니다.';
j.caveats.push('logReview의 개별 전투·집계(10월 7~9일)와 한국 검수는 12.1.5(10월 13일 미국 적용) 전 기록입니다. 12.1.5 이후 쐐기 행은 시즌 전체 상위 100행 중 일부라 높은 단수 쪽으로 치우칩니다.');
insertEvidence(j, '12.1.5 이후 영웅 특성 대조(2026-10-19): 10월 13일 미국 적용 뒤 WCL 신화 님리사 랭킹 첫 100행에서 천신의 대변자 95%, 쐐기 12.1.5 이후 34행 중 판정된 31행 모두 천신의 대변자였습니다. 한국(10월 15일 06:00 이후)도 레이드 50행 중 96%, 쐐기 13행 모두 천신의 대변자입니다. Icy Veins 12.1.5판 쐐기 빌드가 천신의 대변자라 쐐기 견본을 Wowhead 12.1.5판 천신의 대변자 고단 쐐기 코드로 바꿨고, 레이드는 Icy Veins·Wowhead가 음영파를 권해 기본을 바꾸지 않았습니다. 랭킹 상위 행은 전체 사용률이 아닙니다.');
save(g); console.log('saved');
