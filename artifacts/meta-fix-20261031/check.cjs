// 2026-10-31 메타 점검 반영 확인(읽기만). 실패하면 종료 코드 1.
//  - 10월 27일 직업 조정이 7개 가이드 근거에 들어갔는지
//  - 10월 24일 단일 견본 교체 뒤 반대가 된 낡은 문장이 화면·영웅 결론에 남지 않았는지
//  - KB 정본(Meta/guide-12.1.json)과 사이트 원고가 같은 객체인지, 새 KB 노트가 생성 DB에 있는지
const fs = require('node:fs');
const SITE = 'C:/wowmeta/site';
const {loadGuideManuscripts} = require(SITE + '/scripts/lib/guideManuscripts.cjs');
const {kbGuidePath} = require(SITE + '/artifacts/book-rebuild/lib.cjs');
const skills = require(SITE + '/src/data/kb-skills.json').skills;
const all = loadGuideManuscripts();
const problems = [];
const strings = (v, out = []) => { if (typeof v === 'string') out.push(v); else if (Array.isArray(v)) v.forEach(x => strings(x, out)); else if (v && typeof v === 'object') Object.values(v).forEach(x => strings(x, out)); return out; };
const text = id => strings(all[id]).join('\n');

const TUNED = {
  'druid-feral': /야성의 모든 공격력이 5%만큼 증가/,
  'mage-fire': /화염의 모든 공격력이 5%만큼 증가/,
  'warlock-affliction': /불안정한 고통의 공격력이 20%만큼 증가/,
  'warlock-destruction': /불의 비의 공격력이 20%만큼 증가/,
  'hunter-marksmanship': /도탄 공격력을 85%만큼 증가.*기존 75%/,
  'rogue-subtlety': /모든 능력의 공격력이 8%만큼 감소.*당혹이 받는 피해를 5%만큼 증가/,
  'druid-restoration': /푸른 신록의 치유량이 60%.*신속한 치유 연마가 신속한 치유의 치유량을 40%만큼 증가/,
};
for (const [id, re] of Object.entries(TUNED)) {
  if (!all[id].evidence.some(e => e.startsWith('10월 27일 직업 조정') && re.test(e))) problems.push(`${id}: 근거에 10월 27일 직업 조정이 없음`);
  if (!all[id].sources.some(s => s.url.includes('24307310') && /2026-10-31/.test(s.updated))) problems.push(`${id}: 10월 27일 긴급 수정 출처가 없음`);
}
const STALE = [
  ['hunter-marksmanship', /현재 한국어 툴팁도 75%|튕김 피해는 일반 공격력의 75%이고/],
  ['rogue-subtlety', /죽음추적자 단일 견본|단일 견본을 유지했습니다|7%가 됐습니다\(PvP 제외\)/],
  ['monk-windwalker', /단일·레이드 음영파/],
  ['druid-balance', /엘룬 견본은 기본 학습용|기존 엘룬의 대행자 견본 유지 근거|한 분기부터 익힌다면 엘룬의 대행자로 시작/],
  ['demonhunter-devourer', /단일·쐐기·레이드 모두 궤멸자|님리사\(100행 중 85행\)와 쐐기|님리사 상위 100행 중 85행\)와/],
];
for (const [id, re] of STALE) { const m = text(id).match(re); if (m) problems.push(`${id}: 낡은 문장 남음 — ${m[0]}`); }
if (!all['demonhunter-devourer'].evidence.some(e => e.startsWith('상위 기록 재집계(2026-10-31)'))) problems.push('demonhunter-devourer: 10월 31일 재집계 근거 없음');
if (!all['hunter-survival'].evidence.some(e => e.startsWith('아웃랜드 맹독 재검토(2026-10-31)'))) problems.push('hunter-survival: 아웃랜드 맹독 근거 없음');
if (all['demonhunter-devourer'].talentBuilds.find(b => b.id === 'raid').heroLabel !== '궤멸자') problems.push('demonhunter-devourer: 레이드 견본이 바뀜(근거가 갈려 유지해야 함)');
if (!skills['470549'] || skills['470549'].name !== '신속한 치유 연마') problems.push('kb-skills.json: 신속한 치유 연마(470549) 없음');
const canon = v => JSON.stringify(v, (k, x) => (x && typeof x === 'object' && !Array.isArray(x) ? Object.fromEntries(Object.keys(x).sort().map(k2 => [k2, x[k2]])) : x));
for (const id of [...Object.keys(TUNED), 'monk-windwalker', 'druid-balance', 'demonhunter-devourer', 'hunter-survival']) {
  const kb = JSON.parse(fs.readFileSync(kbGuidePath(id).file, 'utf8'));
  if (canon(kb) !== canon(all[id])) problems.push(`${id}: KB 정본과 사이트 원고가 다름`);
}
if (problems.length) { console.log('실패 ' + problems.length + '건'); problems.forEach(p => console.log('  - ' + p)); process.exit(1); }
console.log('메타 점검 반영 확인 통과: 직업 조정 7개 가이드, 낡은 문장 0건, KB·원고 일치 11개');
