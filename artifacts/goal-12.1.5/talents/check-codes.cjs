// 코드 몇 개를 12.1.5 디코더로 판정하고 KB 견본과 비교한다.
// 사용: node check-codes.cjs <guideId> <label=code> [...]
const path = require('node:path');
const {makeDecoder} = require('./decode-talents.cjs');
const NEW = makeDecoder(path.join(__dirname, 'trait_data.inc'));
const detail = require('./audit-detail.json');
const [guideId, ...pairs] = process.argv.slice(2);
const kb = detail.filter(d => d.guideId === guideId);
const specId = NEW.decode(kb[0].code).spec;
const diffNames = (a, b) => {
  const ka = new Map(a.selected.filter(t => t.tree !== 4).map(t => [t.node + ':' + t.spell, t]));
  const kb2 = new Map(b.selected.filter(t => t.tree !== 4).map(t => [t.node + ':' + t.spell, t]));
  return {minus: [...ka].filter(([k, t]) => !kb2.has(k) || kb2.get(k).rank !== t.rank).map(([, t]) => t.name + (t.rank > 1 ? ' r' + t.rank : '')),
          plus: [...kb2].filter(([k, t]) => !ka.has(k) || ka.get(k).rank !== t.rank).map(([, t]) => t.name + (t.rank > 1 ? ' r' + t.rank : ''))};
};
for (const p of pairs) {
  const i = p.indexOf('='); const label = p.slice(0, i), code = p.slice(i + 1);
  const c = NEW.check(code, specId);
  console.log(`${label}: ${c.ok ? 'OK' : 'BAD ' + c.problems.join('; ')} hero ${c.decoded?.hero} pts ${JSON.stringify(c.points)} bits ${c.decoded?.remainingBits}`);
  if (c.decoded) {
    const tree3 = c.decoded.selected.filter(t => t.tree === 3).map(t => `${t.name}${t.purchased ? '' : '(무료)'} r${t.rank}`);
    if (process.env.SHOW_HERO) console.log('   hero:', tree3.join(', '));
    for (const k of kb) { const kd = NEW.decode(k.code, specId); if (kd.hero !== c.decoded.hero) continue; const d = diffNames(kd, c.decoded); console.log(`   vs KB ${k.buildId}: -[${d.minus.join(', ')}] +[${d.plus.join(', ')}]`); }
  }
}
