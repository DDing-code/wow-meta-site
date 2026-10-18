const { load, save, insertEvidence } = require('./lib.cjs');
const g = load('08-성기사/보호'); const j = g.j;
const WH = 'https://www.wowhead.com/ko/guide/classes/paladin/protection/talent-builds-pve-tank';
const tail = ' Icy Veins·Wowhead 12.1.5판 추천과 12.1.5 이후 상위 로그도 빛의 대장장이입니다.';
j.talentBuilds = j.talentBuilds.map(b => ({ ...b, note: b.note + tail }));
const ivh = j.sources.find(s => s.label === 'Icy Veins 영웅 특성 공개 추천 재대조');
ivh.updated = '12 Oct. 2026 (Updated for Patch 12.1.5) / 2026-10-19 확인';
ivh.note = '12.1.5판 현재 추천은 레이드·쐐기 모두 빛의 대장장이입니다. 신성화 상향으로 빛의 대장장이가 방어와 공격을 함께 갖춰 대부분의 콘텐츠에서 낫고, 기사단은 아주 짧은 구간의 집중 피해가 높아 주간 쐐기·구렁처럼 그 피해를 살릴 수 있는 곳에서 고를 수 있다고 적었습니다. 영웅 특성 소개 단락에는 아직 기사단 추천 문장이 남아 있습니다.';
const ivs = j.sources.find(s => s.label === 'Icy Veins 보호 특성');
ivs.updated = '2026-10-12 (12.1.5) / 2026-10-19 확인';
ivs.note = '12.1.5판은 레이드·단일과 쐐기(주간·고단) 빌드를 빛의 대장장이로, 구렁 빌드를 기사단으로 둡니다. 공개 추천은 작성자의 판단이며 최신 상위 로그 사용률과 같은 자료가 아닙니다.';
j.sources.push({
  tier: 'A',
  label: 'Wowhead 보호 성기사 특성 빌드 (12.1.5판)',
  url: WH,
  updated: '2026-10-13 / 2026-10-19 확인',
  note: '빛의 대장장이 레이드·쐐기 빌드를 최선(Best)으로, 기사단은 구렁 빌드를 최선으로 둡니다. 특성 견본 세 개는 이 자료의 빛의 대장장이 Raid·Mythic+ 코드입니다.',
});
j.sources.push({
  tier: 'S',
  label: 'WCL 12.1.5 이후 상위 랭킹 대조',
  url: 'https://www.warcraftlogs.com/reports/2MKmqkYwDXH9nTVh#fight=1&source=8',
  updated: '2026-10-18 집계 / 2026-10-19 확인',
  note: '신화 님리사 랭킹 첫 100행(12.1.5 파티션)과 쐐기 시즌 2 상위 100행 중 12.1.5 이후 행을 실제 영웅 선택 노드로 판정했습니다. 전 지역 레이드는 판정된 98행 모두 빛의 대장장이, 쐐기는 53행 중 판정된 50행 모두 빛의 대장장이이고, 한국은 레이드 41행 중 98%, 쐐기 17행 모두 빛의 대장장이입니다. 주소는 빛의 대장장이 레이드 최상위 전투입니다. 랭킹 상위 행이며 전체 사용률이 아닙니다.',
});
const tp = j.heroBranches.find(b => b.label === '기사단');
const ls = j.heroBranches.find(b => b.label === '빛의 대장장이');
const t0 = tp.summary, l0 = ls.summary;
tp.summary = tp.summary
  .replace('공개 가이드의 현재 레이드·쐐기 기본 추천입니다.', '이 가이드 차트의 첫 예시입니다. 공개 저자 12.1.5판은 레이드·쐐기에 빛의 대장장이를 권하고, 기사단은 짧은 집중 피해를 살릴 수 있는 주간 쐐기·구렁의 선택으로 둡니다.')
  .replace('이번 한국 검수: 레이드 0건·쐐기 1건. 선택·시전 사례이며 상대 분기보다 강하다는 증명이 아닙니다.',
    '12.1.5 적용 전 한국 검수: 레이드 0건·쐐기 1건. 선택·시전 사례이며 상대 분기보다 강하다는 증명이 아닙니다. 12.1.5 이후 WCL 상위 랭킹에서 기사단은 신화 님리사·쐐기 모두 0%였습니다(한국 레이드 41행 중 1행, 전체 사용률이 아님).');
ls.summary = ls.summary
  .replace('무장과 파티 보조를 활용하는 대안입니다.', '공개 저자 12.1.5판의 레이드·쐐기 추천이고 특성 견본 세 개도 이 분기입니다. 무장과 파티 보조를 활용합니다.')
  .replace('이번 한국 검수: 레이드 1건·쐐기 1건. 선택·시전 사례이며 상대 분기보다 강하다는 증명이 아닙니다.',
    '12.1.5 적용 전 한국 검수: 레이드 1건·쐐기 1건. 선택·시전 사례이며 상대 분기보다 강하다는 증명이 아닙니다. 12.1.5 이후 WCL 상위 랭킹에서는 신화 님리사 판정된 98행, 쐐기 판정된 50행이 모두 빛의 대장장이였습니다(전체 사용률이 아님).');
if (!tp.summary.includes('주간 쐐기') || !tp.summary.includes('41행') || !ls.summary.includes('98행') || !ls.summary.includes('특성 견본 세 개')) throw new Error('heroBranches 치환 실패');
const pr = j.playstyle.find(p => p.label === '레이드'), pm = j.playstyle.find(p => p.label === '쐐기');
const pr0 = pr.text, pm0 = pm.text;
pr.text = pr.text.replace('기사단을 기본 예시로 봅니다.', '특성 견본과 공개 저자 12.1.5판 추천은 빛의 대장장이이고, 아래 차트 첫 예시는 기사단입니다. 기사단이라면');
pm.text = pm.text.replace('현재 공개 가이드는 기사단을 권장하며 빛의 대장장이는 다른 운용 선택입니다.', '공개 저자 12.1.5판은 쐐기에도 빛의 대장장이를 권하고, 기사단은 주간 쐐기처럼 짧은 집중 피해를 살릴 수 있는 곳의 선택입니다.');
if (pr.text === pr0 || pm.text === pm0) throw new Error('playstyle 치환 실패');
j.logReview.heroConclusion.conclusion = '공개 저자 12.1.5판(Icy Veins 10월 12일, Wowhead 10월 13일)은 레이드·쐐기 모두 빛의 대장장이를 권하고, 기사단은 짧은 집중 피해를 살리는 주간 쐐기·구렁의 선택으로 둡니다. 12.1.5 이후 WCL 상위 랭킹도 신화 님리사 판정된 98행·쐐기 판정된 50행 모두 빛의 대장장이이며, 특성 견본 세 개도 빛의 대장장이입니다. Icy Veins 영웅 특성 소개 단락에는 아직 기사단 추천 문장이 남아 있습니다. 랭킹 상위 행은 전체 사용률이 아니며 확정 순위가 아닙니다.';
j.caveats.push('logReview의 개별 전투·집계(10월 7~9일)와 한국 검수는 12.1.5(10월 13일 미국 적용) 전 기록입니다. 아래 차트의 첫 예시는 기사단 순서지만 12.1.5 이후 공개 저자·상위 로그·특성 견본은 모두 빛의 대장장이입니다.');
insertEvidence(j, '12.1.5 이후 영웅 특성 대조(2026-10-19): 10월 13일 미국 적용 뒤 WCL 신화 님리사 랭킹 첫 100행 중 판정된 98행, 쐐기 12.1.5 이후 53행 중 판정된 50행이 모두 빛의 대장장이였습니다. 한국(10월 15일 06:00 이후)도 레이드 41행 중 98%, 쐐기 17행 모두 빛의 대장장이입니다. Icy Veins·Wowhead 12.1.5판도 레이드·쐐기에 빛의 대장장이를 권해 특성 견본과 결론 문장을 맞췄습니다. 랭킹 상위 행은 전체 사용률이 아닙니다.');
save(g); console.log('saved');
