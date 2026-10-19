// 12.1.5 이후 상위 랭킹 행의 특성으로 견본 후보를 만든다.
// 사용: node from-logs.cjs <가이드 ID> <raid|mythic> <heroTreeId> [필수 특성 이름...]
// 각 행을 인코딩·검사하고, 모든 행의 노드 선택 빈도와 가장 많이 겹치는 실제 행(대표 빌드)을 고른다.
const fs = require('node:fs');
const {encode, freeNodesOf, D} = require('./encode-talents.cjs');
const {kbGuidePath} = require('C:/wowmeta/site/artifacts/book-rebuild/lib.cjs');
const LOGS = 'C:/wowmeta/site/artifacts/goal-12.1.5-r5/logs';
const [id, mode, heroArg, ...must] = process.argv.slice(2);
const hero = Number(heroArg);
const judged = require(LOGS + '/judged.json').filter(e => e.id === id && e.mode === mode);
const raw = require(`${LOGS}/rankings/${id}.json`);
const key = mode === 'raid' ? 'raid' : 'mythic';
const ref = JSON.parse(fs.readFileSync(kbGuidePath(id).file, 'utf8')).talentBuilds[0].code;
const refD = D.decode(ref);
const free = freeNodesOf(ref, refD.cls);
const nodeOf = new Map(D.traits.filter(t => t.cls === refD.cls).map(t => [t.entry, t]));
const rows = [];
for (const e of judged) {
  const list = raw[e.scope]?.data?.worldData?.[key]?.characterRankings?.rankings || [];
  for (const r of e.rows.filter(r => r.after === true && r.heroTreeId === hero)) {
    const src = list.find(x => x.report.code === r.report.code && x.report.fightID === r.report.fightID && x.name === r.name);
    if (!src?.talents) continue;
    const picks = new Map();
    for (const t of src.talents) { const tr = nodeOf.get(t.talentID); if (!tr || free.has(tr.node)) continue; picks.set(t.talentID, t.points); }
    let code; try { code = encode(refD.spec, picks, free); } catch (err) { continue; }
    const c = D.check(code, refD.spec);
    if (!c.ok || c.decoded.hero !== hero) continue;
    const sel = new Set(c.decoded.selected.filter(t => t.purchased && t.tree !== 4).map(t => `${t.node}:${t.entry}:${t.rank}`));
    rows.push({scope: e.scope, rank: r.rank, name: r.name, region: r.region, url: r.url, amount: r.amount, startedAt: r.startedAt, code, sel, names: c.decoded.selected.filter(t => t.purchased && t.tree !== 4)});
  }
}
const seen = new Map();
for (const r of rows) if (!seen.has(r.code)) seen.set(r.code, r);
const uniq = [...seen.values()];
const freq = new Map();
for (const r of rows) for (const k of r.sel) freq.set(k, (freq.get(k) || 0) + 1);
// 다수결 빌드(절반 이상이 고른 노드 선택)와 어긋나는 칸 수가 적을수록 좋다. 같으면 겹침 합이 큰 쪽.
const major = new Set([...freq].filter(([, n]) => n > rows.length / 2).map(([k]) => k));
const miss = r => [...r.sel].filter(k => !major.has(k)).length + [...major].filter(k => !r.sel.has(k)).length;
const overlap = r => [...r.sel].reduce((n, k) => n + freq.get(k), 0) / rows.length;
const score = r => overlap(r) - 100 * miss(r);
const mustOk = r => must.every(m => r.names.some(t => t.name === m));
uniq.sort((a, b) => score(b) - score(a));
console.log(`${id} ${mode} hero ${hero}: 유효 행 ${rows.length}, 서로 다른 빌드 ${uniq.length}, 같은 코드 최다 ${Math.max(...[...new Set(rows.map(r=>r.code))].map(c=>rows.filter(r=>r.code===c).length))}`);
const best = uniq.filter(mustOk).slice(0, 3);
for (const r of best) console.log('다수결과 다른 칸 ' + miss(r), overlap(r).toFixed(1), rows.filter(x => x.code === r.code).length + '행 같음', r.scope, '#' + r.rank, r.name, r.region, r.startedAt, r.url, '\n ', r.code);
// 대표 빌드와 다수결이 갈리는 노드(대표 빌드 기준)
const top = best[0];
const allKeys = [...freq].sort((a, b) => b[1] - a[1]);
const nm = k => { const [node, entry, rank] = k.split(':'); const t = nodeOf.get(Number(entry)); return `${t.name}(${t.spell})${rank > 1 ? ' r' + rank : ''}`; };
console.log('대표에 있지만 절반 미만:', [...top.sel].filter(k => freq.get(k) < rows.length / 2).map(k => nm(k) + ' ' + freq.get(k) + '/' + rows.length).join(', '));
console.log('대표에 없지만 절반 이상:', allKeys.filter(([k, n]) => n >= rows.length / 2 && !top.sel.has(k)).map(([k, n]) => nm(k) + ' ' + n + '/' + rows.length).join(', '));
fs.writeFileSync(`cand-${id}-${mode}-${hero}.json`, JSON.stringify({id, mode, hero, rows: rows.length, best: best.map(r => ({...r, sel: undefined, names: r.names.map(t => `${t.name}(${t.spell})${t.rank > 1 ? ' r' + t.rank : ''}`), score: score(r)}))}, null, 1));
