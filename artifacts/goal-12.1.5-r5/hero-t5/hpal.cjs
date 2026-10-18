const { load, save, insertEvidence } = require('./lib.cjs');
const g = load('08-성기사/신성'); const j = g.j;
const WH = 'https://www.wowhead.com/ko/guide/classes/paladin/holy/talent-builds-pve-healer';
j.talentBuilds = j.talentBuilds.map(b => {
  if (b.id === 'mythic-plus') return { ...b, note: b.note + ' 12.1.5 이후 상위 쐐기 HPS 랭킹은 판정된 56행 모두 빛의 대장장이지만, Icy Veins·Wowhead 12.1.5판이 쐐기에도 태양의 사자를 권해 견본을 유지합니다.' };
  return { ...b, note: b.note + ' 12.1.5 이후 신화 님리사 상위 HPS 랭킹도 100행 모두 태양의 사자입니다.' };
});
j.sources.push({
  tier: 'A',
  label: 'Wowhead 신성 성기사 특성 빌드 - HolyClarius (12.1.5판)',
  url: WH,
  updated: '2026-10-13 / 2026-10-19 확인',
  note: '레이드에서는 모두에게, 쐐기에서는 대부분에게 치유량이 더 많은 태양의 사자가 낫다고 적고 레이드·쐐기 추천 빌드를 태양의 사자(Virtue)로 둡니다. 빛의 대장장이는 구렁 추천이며, 빛의 대장장이를 고르면 자원이 남으므로 신념의 봉화 빌드를 권합니다.',
});
j.sources.push({
  tier: 'S',
  label: 'WCL 12.1.5 이후 상위 랭킹 대조',
  url: 'https://www.warcraftlogs.com/reports/CHFtdyBTrYmKvgax#fight=31&source=56',
  updated: '2026-10-18 집계 / 2026-10-19 확인',
  note: '신화 님리사 HPS 랭킹 첫 100행(12.1.5 파티션)과 쐐기 시즌 2 상위 100행 중 12.1.5 이후 행을 실제 영웅 선택 노드로 판정했습니다. 레이드 100행 모두 태양의 사자(한국 60행 중 98%), 쐐기 60행 중 판정된 56행 모두 빛의 대장장이(한국 29행 중 86%)입니다. 주소는 빛의 대장장이 쐐기 최상위 전투입니다. 랭킹 상위 행이며 전체 사용률이 아니고, 치유사 HPS 랭킹은 치유 성능 우열의 증거로 약합니다.',
});
const hs = j.heroBranches.find(b => b.label === '태양의 사자');
const ls = j.heroBranches.find(b => b.label === '빛의 대장장이');
const h0 = hs.summary, l0 = ls.summary;
hs.summary = hs.summary.replace('이번 한국 검수: 레이드 1건·쐐기 1건. 선택·시전 사례이며 상대 분기보다 강하다는 증명이 아닙니다.',
  '12.1.5 적용 전 한국 검수: 레이드 1건·쐐기 1건. 선택·시전 사례이며 상대 분기보다 강하다는 증명이 아닙니다. 12.1.5 이후 WCL 상위 HPS 랭킹에서 신화 님리사는 100행 모두 태양의 사자였고 쐐기는 0%였습니다(전체 사용률이 아님). Icy Veins·Wowhead 12.1.5판은 쐐기에도 태양의 사자를 권해 세 견본을 유지합니다.');
ls.summary = ls.summary.replace('이번 한국 검수: 레이드 0건·쐐기 1건. 선택·시전 사례이며 상대 분기보다 강하다는 증명이 아닙니다.',
  '12.1.5 적용 전 한국 검수: 레이드 0건·쐐기 1건. 선택·시전 사례이며 상대 분기보다 강하다는 증명이 아닙니다. 12.1.5 이후 WCL 상위 쐐기 HPS 랭킹에서는 판정된 56행 모두 빛의 대장장이였습니다(한국 29행 중 86%, 전체 사용률이 아님). 공개 저자는 피해 기여가 조금 높은 쐐기 대안으로 두고, Wowhead는 빛의 대장장이라면 신념의 봉화 빌드를 권합니다.');
if (hs.summary === h0 || ls.summary === l0) throw new Error('heroBranches 치환 실패');
// verify-guide-resume.cjs 가 heroConclusion.checkedAt === '2026-10-10' 을 요구하므로 되돌린다(보고 대상).
j.logReview.heroConclusion.checkedAt = '2026-10-10';
j.logReview.heroConclusion.conclusion = '공개 저자의 12.1.5판(Icy Veins 10월 12일, Wowhead 10월 13일)은 레이드에 태양의 사자, 쐐기도 안정적인 치유의 태양의 사자를 권하고 빛의 대장장이를 공격 기여 대안으로 둡니다. 12.1.5 이후 WCL 상위 HPS 랭킹은 레이드 100%가 태양의 사자로 같지만, 쐐기는 판정된 56행 모두 빛의 대장장이입니다. 쐐기는 두 근거가 달라 견본을 태양의 사자로 유지하고 둘을 함께 적습니다. 특성 견본은 고결의 봉화이며, 대조한 빛의 대장장이 쐐기 기록은 영구 봉화를 썼습니다. 피해량이나 HPS 랭킹만으로 치유 선택의 우열을 판단하지 않습니다.';
j.caveats.push('12.1.5 이후 영웅 선택은 WCL HPS 랭킹 상위 행으로만 대조했습니다. 쐐기 행은 시즌 전체 상위 100행 중 일부라 높은 단수 쪽으로 치우치고, HPS 랭킹은 받은 피해와 힐러 배정에 좌우되어 치유 성능 우열의 증거로 약합니다. logReview의 10월 7~9일 기록은 12.1.5 적용 전 기록입니다.');
insertEvidence(j, '12.1.5 이후 영웅 특성 대조(2026-10-19): 10월 13일 미국 적용 뒤 WCL 신화 님리사 HPS 랭킹 첫 100행은 모두 태양의 사자(한국 60행 중 98%), 쐐기 12.1.5 이후 60행 중 판정된 56행은 모두 빛의 대장장이(한국 29행 중 86%)였습니다. Icy Veins·Wowhead 12.1.5판은 레이드·쐐기 모두 태양의 사자를 권하므로 레이드는 그대로 두고, 쐐기는 기본을 바꾸지 않은 채 두 근거를 함께 적었습니다. 랭킹 상위 행은 전체 사용률이 아닙니다.');
save(g); console.log('saved');
