const {encode, picksOf, hashOf, D, nodesOf} = require('./encode-talents.cjs');
const code = process.argv[2];
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const {picks, free, d} = picksOf(code);
const again = encode(d.spec, picks, free, hashOf(code));
const bitsOf = s => [...s].flatMap(ch => { const v = alphabet.indexOf(ch); return [0,1,2,3,4,5].map(i => (v >> i) & 1); });
const a = bitsOf(code), b = bitsOf(again);
let i = 0; while (i < a.length && a[i] === b[i]) i++;
console.log('첫 차이 비트', i);
// 노드 경계 추적(원 코드 기준)
let cur = 24 + 128; const bit = n => { let v = 0; for (let k = 0; k < n; k++, cur++) v += a[cur] * 2 ** k; return v; };
for (const [node, entries] of nodesOf(d.cls)) {
  const start = cur; const sel = bit(1); let info = '';
  if (sel) { const p = bit(1); info = 'p' + p; if (p) { if (bit(1)) info += ' rank' + bit(6); if (bit(1)) info += ' choice' + bit(2); } }
  if (cur > i - 1 && start <= i + 2) { console.log(node, entries.map(t => `${t.name}/${t.type}/max${t.max}/e${t.entry}`).join(' | '), 'sel', sel, info, 'picks', entries.map(t => picks.get(t.entry) || 0)); }
  if (start > i + 2) break;
}
