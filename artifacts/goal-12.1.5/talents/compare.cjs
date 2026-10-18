// 페이지에서 뽑은 행과 현재 KB 견본을 12.1.5 디코더로 비교한다.
// 사용: node compare.cjs <guideId> <pageKey> [<pageKey>...]
const path = require('node:path');
const {makeDecoder} = require('./decode-talents.cjs');
const {rows} = require('./rows-from-html.cjs');
const NEW = makeDecoder(path.join(__dirname, 'trait_data.inc'));
const detail = require('./audit-detail.json');
const [guideId, ...keys] = process.argv.slice(2);
const kb = detail.filter(d => d.guideId === guideId);
const spec = {}; // specId 는 KB 견본에서
const specId = require('./audit-detail.json').find(d => d.guideId === guideId) && NEW.decode(kb[0].code).spec;
const heroName = d => d.hero;
const diffNames = (a, b) => {
  const ka = new Map(a.selected.filter(t => t.tree !== 4).map(t => [t.node + ':' + t.spell, t]));
  const kb2 = new Map(b.selected.filter(t => t.tree !== 4).map(t => [t.node + ':' + t.spell, t]));
  const minus = [...ka].filter(([k, t]) => !kb2.has(k) || kb2.get(k).rank !== t.rank).map(([, t]) => `${t.name}${t.rank > 1 ? ' r' + t.rank : ''}`);
  const plus = [...kb2].filter(([k, t]) => !ka.has(k) || ka.get(k).rank !== t.rank).map(([, t]) => `${t.name}${t.rank > 1 ? ' r' + t.rank : ''}`);
  return {minus, plus};
};
for (const k of kb) {
  const d = NEW.decode(k.code, specId);
  console.log(`KB ${k.buildId}: hero ${heroName(d)} (${d.hero})`);
}
for (const key of keys) {
  for (const r of rows(key)) {
    const c = NEW.check(r.code, specId);
    const inKb = kb.filter(k => k.code === r.code).map(k => k.buildId);
    let line = `[${key}] ${r.heading} | ${r.row.replace(/복사.*$/, '').trim()} | ${c.ok ? 'OK' : 'BAD ' + c.problems.join('; ')} | hero ${c.decoded ? heroName(c.decoded) : '?'}${inKb.length ? ' | KB와 같음: ' + inKb.join(',') : ''}`;
    console.log(line);
    if (c.decoded && !inKb.length) for (const k of kb) {
      const kd = NEW.decode(k.code, specId);
      if (kd.hero !== c.decoded.hero) continue;
      const {minus, plus} = diffNames(kd, c.decoded);
      console.log(`     vs KB ${k.buildId}: -[${minus.join(', ')}] +[${plus.join(', ')}]`);
    }
    console.log('     ' + r.code);
  }
}
