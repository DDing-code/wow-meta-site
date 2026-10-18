// 12.1.5 감사용 디코더 사본. 원본: artifacts/goal-12.1-round-2/decode-talents.cjs (수정하지 않음)
// 차이: trait_data 파일을 인자로 받는다. 기본값은 같은 폴더의 trait_data.inc
//   (SimC midnight 5537d8813dfc59707927722b1e23ffa6fd67ee59, wow build 12.1.5.70448)
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const RE = /^\s*\{\s*([\d,\s-]+),\s*"((?:\\.|[^"\\])*)",\s*\{([^}]+)\},\s*\{([^}]+)\},\s*(\d+),\s*(\d+)\s*\}/;
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function loadTraits(file) {
  const source = fs.readFileSync(file, 'utf8');
  const traits = [];
  for (const line of source.split('\n')) {
    const m = line.match(RE);
    if (!m) continue;
    const n = m[1].split(',').map(Number);
    assert.equal(n.length, 13);
    traits.push({tree:n[0],cls:n[1],entry:n[2],node:n[3],max:n[4],required:n[5],spell:n[7],row:n[10],col:n[11],index:n[12],name:m[2],specs:m[3].split(',').map(Number),starters:m[4].split(',').map(Number),hero:Number(m[5]),type:Number(m[6])});
  }
  const build = source.match(/wow build ([\d.]+)/)?.[1];
  return {traits, build};
}

function makeDecoder(file) {
  const {traits, build} = loadTraits(file);
  function decode(code, expectedSpec) {
    assert.match(code, /^[A-Za-z0-9+/]+$/);
    let cursor = 0;
    const bit = n => {
      assert(cursor + n <= code.length * 6, 'Truncated talent export');
      let v = 0;
      for (let i = 0; i < n; i++, cursor++) v += ((alphabet.indexOf(code[Math.floor(cursor / 6)]) >> (cursor % 6)) & 1) * 2 ** i;
      return v;
    };
    assert.equal(bit(8), 2, 'Serialization version');
    const spec = bit(16);
    if (expectedSpec) assert.equal(spec, expectedSpec, 'Wrong specialization');
    for (let i = 0; i < 16; i++) bit(8);
    const cls = traits.find(t => t.tree === 4 && t.specs.includes(spec))?.cls;
    assert(cls, 'Unknown specialization');
    const nodes = new Map();
    for (const t of traits.filter(t => t.cls === cls)) {
      if (!nodes.has(t.node)) nodes.set(t.node, []);
      nodes.get(t.node).push(t);
    }
    const selected = [];
    for (const [node, entries] of [...nodes].sort((a, b) => a[0] - b[0])) {
      if (!bit(1)) continue;
      let trait = entries[0];
      const purchased = bit(1);
      let rank = purchased ? (trait.type === 1 ? entries.reduce((n, t) => n + t.max, 0) : trait.max) : 1;
      if (purchased) {
        if (bit(1)) { const max = rank; rank = bit(6); assert(rank > 0 && rank < max, 'Invalid partial rank'); }
        if (bit(1)) { assert([2, 3].includes(trait.type), 'Unexpected choice node'); const index = bit(2); assert(index < entries.length, 'Choice index'); trait = entries[index]; assert(rank <= trait.max, 'Choice rank'); }
      }
      assert(trait.tree === 3 || trait.specs.every(x => x === 0) || trait.specs.includes(spec), 'Trait unavailable to specialization: ' + trait.name);
      if (trait.type === 1) {
        for (const t of entries) { const r = Math.min(rank, t.max); if (r) selected.push({...t, rank: r, purchased: true}); rank -= r; if (!rank) break; }
      } else selected.push({...trait, rank, purchased: Boolean(purchased)});
    }
    const heroes = [...new Set(selected.filter(t => t.tree === 4).map(t => t.hero))];
    assert.equal(heroes.length, 1, 'Exactly one hero tree');
    const inactive = selected.filter(t => t.tree === 3 && !heroes.includes(t.hero));
    assert(inactive.every(t => !t.purchased), 'Purchased inactive hero talents: ' + JSON.stringify(inactive.map(t => ({name: t.name, hero: t.hero, purchased: t.purchased}))));
    const points = {};
    for (const t of selected) points[t.tree] = (points[t.tree] || 0) + (t.purchased ? t.rank : 0);
    return {spec, cls, hero: heroes[0], points, selected: selected.filter(t => t.tree !== 3 || heroes.includes(t.hero)), inactive: inactive.length, remainingBits: code.length * 6 - cursor};
  }
  // prepare-audit.cjs 의 validate 와 같은 판정(남는 비트, 34/34/12~13, 관문). 실패하면 문제 목록을 돌려준다.
  function check(code, spec) {
    const problems = [];
    let d;
    try { d = decode(code, spec); } catch (e) { return {ok: false, problems: [e.message]}; }
    if (!(d.remainingBits >= 0 && d.remainingBits < 6)) problems.push(`남는 비트 ${d.remainingBits}`);
    const active = d.selected.filter(t => t.tree !== 3 || t.hero === d.hero);
    const points = {};
    for (const t of active) points[t.tree] = (points[t.tree] || 0) + (t.purchased ? t.rank : 0);
    if (!(points[1] >= 34 && points[1] <= 35)) problems.push(`직업 포인트 ${points[1]}`);
    if (points[2] !== 34) problems.push(`전문화 포인트 ${points[2]}`);
    if (!(points[3] >= 12 && points[3] <= 13)) problems.push(`영웅 포인트 ${points[3]}`);
    for (const t of active.filter(t => t.required)) {
      const earlier = active.filter(v => v.tree === t.tree && v.required < t.required).reduce((n, v) => n + v.rank, 0) + (t.tree === 3 ? 1 : 0);
      if (earlier < t.required) problems.push(`${t.name}: 관문 ${t.required} 미달(앞 포인트 ${earlier})`);
    }
    return {ok: !problems.length, problems, decoded: d, points};
  }
  return {decode, check, traits, build};
}

module.exports = {makeDecoder, loadTraits, defaultFile: path.join(__dirname, 'trait_data.inc')};
