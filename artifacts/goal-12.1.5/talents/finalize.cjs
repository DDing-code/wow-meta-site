// 디코더 감사(audit-detail.json) + 계산기 확인(calc-kb.json, calc-cand.json)을 합쳐
// audit.json, proposals.json, revalidated.json, no-evidence.json 을 만든다. KB·src 는 건드리지 않는다.
const fs = require('node:fs');
const path = require('node:path');
const {makeDecoder} = require('./decode-talents.cjs');
const {rows} = require('./rows-from-html.cjs');
const KB = 'C:/wowmeta/kb/08-직업별-Knowledge-Base';
const NEW = makeDecoder(path.join(__dirname, 'trait_data.inc'));
const COMMIT = '5537d8813dfc59707927722b1e23ffa6fd67ee59';
const BUILD = NEW.build; // 12.1.5.70448
const DAY = '2026-10-18';
const SCOPE = `12.1.5 SimC midnight(${COMMIT.slice(0, 8)}, ${BUILD}) 전문화·노드·랭크·포인트 문턱과 한국어 Wowhead 계산기 포인트·선택 가능 여부·부모 연결 확인.`;
const detail = require('./audit-detail.json');
const calc = [...require('./calc-kb.json'), ...require('./calc-cand.json')];
const calcOf = code => calc.find(c => c.code === code && !c.error);

function browserOf(code) {
  const c = calcOf(code);
  if (!c) return null;
  return {checkedAt: DAY, points: c.points, parentConnections: c.grids.every(g => !g.orphaned.length), available: c.grids.every(g => !g.unavailable.length), sha256: c.sha256};
}
function calcProblems(code) {
  const c = calcOf(code);
  if (!c) return ['계산기 확인 없음'];
  const p = [];
  const names = ['직업', '전문화', '영웅'];
  c.points.forEach((v, i) => { if (v !== c.max[i]) p.push(`계산기 ${names[i]} ${v}/${c.max[i]}`); });
  for (const g of c.grids) {
    for (const o of g.orphaned) p.push(`계산기 부모 연결 없음: ${o.name}`);
    for (const o of g.unavailable) p.push(`계산기 선택 불가: ${o.name}`);
  }
  return p;
}
// 디코더 선택과 계산기 선택을 비교해 계산기가 버린 특성을 찾는다(한국어 이름은 계산기 표시 그대로).
function droppedByCalc(code, spec) {
  const c = calcOf(code);
  if (!c) return [];
  const d = NEW.decode(code, spec);
  const calcSpells = new Set(c.grids.flatMap(g => g.selected.map(s => s.spell)));
  const nodeSpells = node => NEW.traits.filter(x => x.node === node).map(x => x.spell);
  return [...new Map(d.selected.filter(t => t.purchased && t.tree !== 4 && !nodeSpells(t.node).some(sp => calcSpells.has(sp))).map(t => [t.node, `${t.name}(${t.spell})`])).values()];
}

const files = {};
for (const c of fs.readdirSync(KB)) {
  const cdir = path.join(KB, c);
  if (!fs.statSync(cdir).isDirectory()) continue;
  for (const s of fs.readdirSync(cdir)) { const f = path.join(cdir, s, 'Meta', 'guide-12.1.json'); if (fs.existsSync(f)) files[path.relative(KB, f)] = f; }
}
const kbBuild = d => JSON.parse(fs.readFileSync(files[d.file], 'utf8')).talentBuilds.find(b => b.id === d.buildId);

// ---- 대체 견본 근거 ----
const UA_NOTE = '일반 Chrome 사용자 에이전트';
const whDev = rows('wh-devourer');
const pick = (list, heading, re) => { const r = list.find(x => x.heading === heading && re.test(x.row)); if (!r) throw Error(heading + ' ' + re); return r; };
const ivHtml = fs.readFileSync(path.join(__dirname, 'pages/iv-mm.html'), 'utf8');
const ivCode = label => { const i = ivHtml.indexOf(label); const m = ivHtml.slice(i).match(/C4P[A-Za-z0-9+/]{80,}/); return m[0]; };
const DEV_URL = 'https://www.wowhead.com/ko/guide/classes/demon-hunter/devourer/talent-builds-pve-dps';
const IV_MM = 'https://www.icy-veins.com/wow/marksmanship-hunter-pve-dps-spec-builds-talents';
const replacements = {
  'demonhunter-devourer': {
    'single-target': {row: pick(whDev, 'Annihilator', /^Raid ST \(Best\)/), sourceUrl: DEV_URL, sourceLabel: 'Annihilator Raid ST (Best)', heroLabel: '궤멸자',
      note: '기존 견본은 12.1.5 트리에서 한국어 Wowhead 계산기가 전문화 33/34로 불러와(특성 위치 이동으로 한 칸이 빠짐) 그대로 쓸 수 없습니다. Wowhead 빌드 페이지(2026-10-13 갱신)가 12.1.5의 공허상흔·전문화 트리 변경 뒤 궤멸자를 거의 모든 상황의 추천으로 바꿔, 단일 레이드 견본을 궤멸자 Raid ST (Best)로 교체합니다. 사냥·박멸이 중간 관문으로 내려온 새 트리 기준입니다. 영웅 특성이 공허상흔에서 궤멸자로 바뀝니다.',
      alt: pick(whDev, 'Devourer Demon Hunter Talent Import Codes', /^Raid ST /), altLabel: 'Void-Scarred Raid ST', altHero: '공허상흔'},
    'mythic-plus': {row: pick(whDev, 'Annihilator', /^Mythic\+ \(Best\)/), sourceUrl: DEV_URL, sourceLabel: 'Annihilator Mythic+ (Best)', heroLabel: '궤멸자',
      note: '기존 견본은 12.1.5 트리에서 한국어 Wowhead 계산기가 전문화 33/34로 불러와(공허정화 자리 이동으로 한 칸이 빠짐) 그대로 쓸 수 없습니다. Wowhead 빌드 페이지(2026-10-13 갱신)의 궤멸자 Mythic+ (Best)로 교체합니다.'},
    'raid': {row: pick(whDev, 'Annihilator', /^Raid Cleave \(Best\)/), sourceUrl: DEV_URL, sourceLabel: 'Annihilator Raid Cleave (Best)', heroLabel: '궤멸자',
      note: 'Wowhead 빌드 페이지(2026-10-13 갱신)가 12.1.5 변경 뒤 궤멸자를 추천으로 바꿔, 추가 대상이 있는 레이드 견본을 궤멸자 Raid Cleave (Best)로 교체합니다. 페이지는 대상이 거의 하나인 전투라면 악마의 본능 대신 두 번째 포식을 고르라고 안내합니다. 영웅 특성이 공허상흔에서 궤멸자로 바뀝니다.',
      alt: pick(whDev, 'Devourer Demon Hunter Talent Import Codes', /^Raid Cleave /), altLabel: 'Void-Scarred Raid Cleave', altHero: '공허상흔'},
  },
  'hunter-marksmanship': {
    'mythic-plus': {row: {code: ivCode('Marksmanship Mythic+ - Sentinel'), row: 'Marksmanship Mythic+ - Sentinel'}, sourceUrl: IV_MM, sourceLabel: 'Quick Start Import Codes: Marksmanship Mythic+ - Sentinel', heroLabel: '파수꾼',
      note: '12.1.5에서 쏟아내기가 삭제되고 같은 자리에 피의 깃이 들어왔습니다. 기존 견본은 적용 전 로그 견본이라, 12.1.5 기준으로 갱신된 Icy Veins 빌드 페이지(2026-10-12 갱신, 12.1.5 표기)의 파수꾼 쐐기 견본으로 교체합니다. Wowhead 원문 견본은 이번에도 영웅 포인트가 14/13으로 표시되어 쓰지 않았습니다.'},
    'raid': {row: {code: ivCode('Marksmanship Raid AoE/Cleave - Sentinel'), row: 'Marksmanship Raid AoE/Cleave - Sentinel'}, sourceUrl: IV_MM, sourceLabel: 'Quick Start Import Codes: Marksmanship Raid AoE/Cleave - Sentinel', heroLabel: '파수꾼',
      note: '12.1.5에서 쏟아내기가 삭제되고 같은 자리에 피의 깃이 들어왔습니다. 기존 견본은 적용 전 로그 견본이라, 12.1.5 기준으로 갱신된 Icy Veins 빌드 페이지(2026-10-12 갱신, 12.1.5 표기)의 파수꾼 레이드 광역·다중 대상 견본으로 교체합니다. 추가 대상이 있는 레이드 전투용이며, 단일 네임드 견본과 다를 수 있습니다.'},
  },
};
const noEvidence = {
  'hunter-marksmanship': {
    'single-target': '12.1.5 공개 단일 견본이 모두 무효: Wowhead Single Target (Best)는 계산기 영웅 14/13, Icy Veins Marksmanship Single-Target - Sentinel은 비활성 영웅 특성(SimC 이름 Black Arrow) 구매로 계산기 영웅 14/13. 기존 코드는 구조상 유효하며 쏟아내기 자리가 피의 깃으로 읽힙니다.',
  },
};

// ---- 판정 ----
const audit = [], proposals = [], revalidated = [], noEv = [];
const order = ['single-target', 'mythic-plus', 'raid'];
detail.sort((a, b) => a.guideId.localeCompare(b.guideId) || order.indexOf(a.buildId) - order.indexOf(b.buildId));
for (const d of detail) {
  const spec = NEW.decode(d.code).spec;
  const decoderProblems = d.problems.filter(p => !p.startsWith('같은 코드의 뜻이 바뀜'));
  const meaning = d.problems.filter(p => p.startsWith('같은 코드의 뜻이 바뀜'));
  const cp = calcProblems(d.code);
  const dropped = cp.length ? droppedByCalc(d.code, spec) : [];
  if (dropped.length) cp.push('계산기가 빼고 불러온 특성: ' + dropped.join(', '));
  const problems = [...decoderProblems, ...cp];
  const valid = !problems.length;
  const rep = replacements[d.guideId]?.[d.buildId];
  const ne = noEvidence[d.guideId]?.[d.buildId];
  const action = rep ? '대체 제안' : ne ? '근거 없음(기존 유지)' : '재검증(코드 유지)';
  audit.push({guideId: d.guideId, buildId: d.buildId, label: d.label, valid, problems, touchesChangedNodes: d.touchesChangedNodes, meaningChanged: meaning.map(m => m.replace('같은 코드의 뜻이 바뀜: ', '')), action, calculator: calcOf(d.code) ? {points: calcOf(d.code).points, hero: calcOf(d.code).hero} : null});
  const old = kbBuild(d);
  if (rep) {
    const code = rep.row.code;
    const c = NEW.check(code, spec);
    if (!c.ok) throw Error(`${d.guideId}/${d.buildId}: 제안 코드 디코더 실패 ${c.problems}`);
    if (calcProblems(code).length) throw Error(`${d.guideId}/${d.buildId}: 제안 코드 계산기 실패 ${calcProblems(code)}`);
    const replace = {id: old.id, label: old.label, code, url: 'https://www.wowhead.com/ko/talent-calc/blizzard/' + code, sourceUrl: rep.sourceUrl, sourceLabel: rep.sourceLabel, checkedAt: DAY, note: rep.note,
      validation: {specId: spec, heroTreeId: c.decoded.hero, points: c.points, checkedAt: DAY, traitDataCommit: COMMIT, gameBuild: BUILD, browser: browserOf(code), scope: SCOPE}, heroLabel: rep.heroLabel};
    const entry = {guideId: d.guideId, buildId: d.buildId, replace, previousCode: d.code, evidence: {page: rep.sourceUrl, pageUpdated: rep.sourceUrl.includes('icy-veins') ? '2026-10-12 (Last Updated: Oct 12, 2026, 제목 12.1.5)' : '2026-10-13 (업데이트됨: 2026/10/13, 12.1.5 패치 언급)', fetchedAt: DAY, fetchedWith: rep.sourceUrl.includes('icy-veins') ? 'curl + ' + UA_NOTE : 'Playwright + ' + UA_NOTE, calculatorUrl: replace.url, calculatorHero: calcOf(code).hero}};
    if (rep.alt) {
      const ac = NEW.check(rep.alt.code, spec);
      entry.alternatives = [{why: `영웅 특성을 ${rep.altHero}로 유지하려면 같은 페이지의 갱신된 ${rep.altLabel} 견본(페이지는 현재 비추천으로 표기)`, code: rep.alt.code, sourceLabel: rep.altLabel, heroLabel: rep.altHero, heroTreeId: ac.decoded.hero, decoderOk: ac.ok, calculator: browserOf(rep.alt.code)}];
    }
    proposals.push(entry);
  } else {
    if (!valid) throw Error(`${d.guideId}/${d.buildId}: 무효인데 대체 없음`);
    const c = NEW.check(d.code, spec);
    const replace = JSON.parse(JSON.stringify(old));
    replace.validation = {...replace.validation, specId: spec, heroTreeId: c.decoded.hero, points: c.points, checkedAt: DAY, traitDataCommit: COMMIT, gameBuild: BUILD, browser: browserOf(d.code), scope: SCOPE};
    if (ne) replace.note = '12.1.5에서 쏟아내기가 삭제되고 같은 자리에 피의 깃이 들어와, 이 코드를 불러오면 피의 깃이 찍힙니다. 12.1.5 기준 공개 단일 견본은 계산기에서 영웅 포인트가 14/13으로 표시되어 교체하지 않았습니다. 근거 로그는 12.1.5 적용 전 기록입니다. 레이드 견본은 전체 네임드 집계이며 단일 전투에만 제한된 결과는 아닙니다.';
    const entry = {guideId: d.guideId, buildId: d.buildId, replace};
    if (meaning.length) entry.remark = meaning.join(' / ');
    revalidated.push(entry);
    if (ne) noEv.push({guideId: d.guideId, buildId: d.buildId, reason: ne, checked: [{url: 'https://www.wowhead.com/ko/guide/classes/hunter/marksmanship/talent-builds-pve-dps', updated: '2026-10-13'}, {url: IV_MM, updated: '2026-10-12'}]});
  }
}
const w = (f, v) => fs.writeFileSync(path.join(__dirname, f), JSON.stringify(v, null, 2) + '\n');
w('audit.json', audit); w('proposals.json', proposals); w('revalidated.json', revalidated); w('no-evidence.json', noEv);
console.log(JSON.stringify({builds: audit.length, valid: audit.filter(a => a.valid).length, invalid: audit.filter(a => !a.valid).map(a => [a.guideId, a.buildId, a.problems]), proposals: proposals.length, revalidated: revalidated.length, noEvidence: noEv.length, simc: COMMIT, build: BUILD}, null, 1));
