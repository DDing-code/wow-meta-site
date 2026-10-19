// 공사 중(부분 검수) 해제 판단: 5라운드 12.1.5 이후 WCL 판정 자료(judged.json)와 5라운드에서 근거가 갈린 목록으로 기준 ②·③을 따진다.
// 기준 ① 한국 12.1.5 적용 확인은 korea/ 자료로 40개 공통 충족, ④ 검사·화면은 이번 라운드 결과로 따로 확인한다.
const path = require('path');
const judged = require(path.join(__dirname, '../goal-12.1.5-r5/logs/judged.json'));
// 5라운드 진행 기록: 로그와 12.1.5판 공개 가이드가 갈려 기본을 유지하고 두 근거를 병기한 곳 + 혼재 구간.
const conflict = {
  'druid-balance': '레이드: 로그 숲의 수호자 ↔ 공개 가이드 엘룬의 대행자',
  'monk-brewmaster': '레이드 로그 음영파·쐐기 로그 조화의 종사 ↔ 공개 가이드는 반대',
  'monk-windwalker': '레이드: 로그 천신의 대변자 ↔ 공개 가이드 음영파',
  'paladin-holy': '쐐기: 로그 빛의 대장장이 ↔ 공개 가이드 태양의 사자',
  'rogue-assassination': '쐐기: 로그 죽음추적자(표본 작음) ↔ 견본·공개 가이드 운명결속',
  'demonhunter-havoc': '쐐기: 전 지역 로그 알드라치 파괴자 ↔ 견본 지옥상흔, KR 쐐기 7:7',
  'rogue-subtlety': '순수 단일: 로그와 공개 가이드가 갈림',
  'warrior-fury': '쐐기 혼재: 전 지역 산왕 59% ↔ KR 학살자 59%',
  'mage-frost': '쐐기 혼재: 전 지역 서리불꽃 67% ↔ KR 주문술사 57%',
};
const done = new Set(['druid-guardian', 'rogue-outlaw', 'priest-shadow', 'priest-discipline']);
const by = {};
for (const x of judged) {
  const n = Object.values(x.byHero).reduce((a, h) => a + h.count, 0);
  const top = Object.entries(x.byHero).sort((a, b) => b[1].count - a[1].count)[0];
  (by[x.id] ||= {})[`${x.mode}_${x.scope}`] = { n, top: top && top[1].count ? `${top[0]} ${Math.round(top[1].share * 100)}%` : '-' };
}
const MIN_KR = 5;
const rows = Object.entries(by).map(([id, m]) => {
  const reasons = [];
  if (conflict[id]) reasons.push(conflict[id]);
  if (m.raid_KR.n < MIN_KR) reasons.push(`한국 레이드 12.1.5 이후 판정 ${m.raid_KR.n}건(<${MIN_KR})`);
  if (m.mythicPlus_KR.n < MIN_KR) reasons.push(`한국 쐐기 12.1.5 이후 판정 ${m.mythicPlus_KR.n}건(<${MIN_KR})`);
  return { id, done: done.has(id), pass: !reasons.length, reasons,
    evidence: `레이드 전체 ${m.raid_ALL.n} ${m.raid_ALL.top} / KR ${m.raid_KR.n} ${m.raid_KR.top} · 쐐기 전체 ${m.mythicPlus_ALL.n} ${m.mythicPlus_ALL.top} / KR ${m.mythicPlus_KR.n} ${m.mythicPlus_KR.top}` };
});
for (const group of [['통과(부분 검수 → 해제 대상)', r => r.pass && !r.done], ['이미 완료', r => r.done], ['미통과', r => !r.pass && !r.done]]) {
  const list = rows.filter(group[1]);
  console.log(`## ${group[0]} ${list.length}`);
  for (const r of list) console.log(`- ${r.id}: ${r.evidence}${r.reasons.length ? ` — ${r.reasons.join('; ')}` : ''}`);
}
require('fs').writeFileSync(path.join(__dirname, 'release-check.json'), JSON.stringify(rows, null, 2));

// 현재 원고의 특성 견본(단일·쐐기·레이드) 영웅과 기본 영웅 탭이 12.1.5 이후 로그 다수와 같은지 다시 본다.
const { loadGuideManuscript } = require(path.join(__dirname, '../../scripts/lib/guideManuscripts.cjs'));
console.log('\n## 현재 원고 견본·기본 탭 ↔ 12.1.5 이후 로그 다수(전 지역·KR)');
for (const r of rows.filter(x => x.pass && !x.done)) {
  const m = loadGuideManuscript(r.id);
  const builds = Object.fromEntries((m.talentBuilds || []).map(t => [t.label, t.heroLabel]));
  const def = m.heroBranches?.[m.defaultHeroBranchIndex || 0]?.label;
  const major = (mode, scope) => judged.find(x => x.id === r.id && x.mode === mode && x.scope === scope);
  const topOf = x => Object.entries(x.byHero).sort((a, b) => b[1].count - a[1].count)[0][0];
  const raidTop = topOf(major('raid', 'ALL')), raidKr = topOf(major('raid', 'KR'));
  const mpTop = topOf(major('mythicPlus', 'ALL')), mpKr = topOf(major('mythicPlus', 'KR'));
  const raidSample = Object.entries(builds).find(([k]) => /레이드/.test(k))?.[1];
  const mpSample = Object.entries(builds).find(([k]) => /쐐기/.test(k))?.[1];
  const ok = raidSample === raidTop && raidSample === raidKr && mpSample === mpTop && mpSample === mpKr;
  r.sampleCheck = { raidSample, mpSample, defaultTab: def, raidTop, raidKr, mpTop, mpKr, ok };
  if (!ok) { r.pass = false; r.reasons.push('현재 견본 영웅과 로그 다수가 다름'); }
  console.log(`${ok ? '일치' : '다름'} ${r.id}: 견본 레이드 ${raidSample}·쐐기 ${mpSample} / 기본 탭 ${def} ↔ 로그 레이드 ${raidTop}(KR ${raidKr})·쐐기 ${mpTop}(KR ${mpKr})`);
}
require('fs').writeFileSync(path.join(__dirname, 'release-check.json'), JSON.stringify(rows, null, 2));
console.log(`\n최종 해제 대상 ${rows.filter(x => x.pass && !x.done).length}개`);
