// 특성 불러오기 문자열 인코더 — goal-12.1.5/talents/decode-talents.cjs 의 반대 방향.
// 선택(entry → rank) 목록을 받아 같은 직업 노드 순서(노드 번호 오름차순)로 비트를 쓴다.
// 트리 해시 128비트는 0으로 둔다(게임·Wowhead 모두 0 해시를 받아들임). 무료(선택됐지만 구매 안 함) 노드는 참고 코드에서 가져온다.
const path = require('node:path');
const {makeDecoder, defaultFile} = require('C:/wowmeta/site/artifacts/goal-12.1.5/talents/decode-talents.cjs');
const D = makeDecoder(defaultFile);
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function nodesOf(cls) {
  const nodes = new Map();
  for (const t of D.traits.filter(t => t.cls === cls)) { if (!nodes.has(t.node)) nodes.set(t.node, []); nodes.get(t.node).push(t); }
  return [...nodes].sort((a, b) => a[0] - b[0]);
}

// picks: Map(entry → points). freeNodes: Set(node) — 선택됐지만 구매하지 않은 노드.
function encode(spec, picks, freeNodes, hash = null) {
  const cls = D.traits.find(t => t.tree === 4 && t.specs.includes(spec)).cls;
  const bits = [];
  const put = (v, n) => { for (let i = 0; i < n; i++) bits.push((v >> i) & 1); };
  put(2, 8); put(spec, 16);
  for (let i = 0; i < 16; i++) put(hash ? hash[i] : 0, 8);
  for (const [node, entries] of nodesOf(cls)) {
    const hit = entries.map((t, i) => [t, i, picks.get(t.entry) || 0]).filter(x => x[2] > 0);
    if (!hit.length) {
      if (freeNodes.has(node)) { put(1, 1); put(0, 1); } else put(0, 1);
      continue;
    }
    const first = entries[0];
    put(1, 1); put(1, 1); // 선택·구매
    if (first.type === 1) { // 단계 노드: 항목들의 랭크를 합친다
      const total = hit.reduce((n, x) => n + x[2], 0);
      const max = entries.reduce((n, t) => n + t.max, 0);
      if (total < max) { put(1, 1); put(total, 6); } else put(0, 1);
      put(0, 1);
      continue;
    }
    if (hit.length !== 1) throw new Error(`노드 ${node}: 항목 ${hit.length}개 선택`);
    const [t, idx, rank] = hit[0];
    if (rank < t.max) { put(1, 1); put(rank, 6); } else put(0, 1);
    if ([2, 3].includes(first.type)) { put(1, 1); put(idx, 2); } else put(0, 1);
  }
  let out = '';
  for (let i = 0; i < bits.length; i += 6) { let v = 0; for (let j = 0; j < 6 && i + j < bits.length; j++) v |= bits[i + j] << j; out += alphabet[v]; }
  return out;
}

// 참고 코드에서 무료 노드·선택 목록을 뽑는다(왕복 검사용).
function picksOf(code, spec) {
  const d = D.decode(code, spec);
  const picks = new Map();
  for (const t of d.selected) if (t.purchased) picks.set(t.entry, (picks.get(t.entry) || 0) + t.rank);
  return {picks, free: freeNodesOf(code, d.cls), d};
}
// 원 비트에서 '선택됐지만 구매 안 함' 노드를 읽는다(비활성 영웅 트리의 첫 노드 포함).
function freeNodesOf(code, cls) {
  let cursor = 24 + 128;
  const bit = n => { let v = 0; for (let i = 0; i < n; i++, cursor++) v += ((alphabet.indexOf(code[Math.floor(cursor / 6)]) >> (cursor % 6)) & 1) * 2 ** i; return v; };
  const free = new Set();
  for (const [node] of nodesOf(cls)) {
    if (!bit(1)) continue;
    if (!bit(1)) { free.add(node); continue; }
    if (bit(1)) bit(6);
    if (bit(1)) bit(2);
  }
  return free;
}
function hashOf(code) { // 원래 코드의 해시 바이트(왕복 비교용)
  let cursor = 24; const out = [];
  const bit = n => { let v = 0; for (let i = 0; i < n; i++, cursor++) v += ((alphabet.indexOf(code[Math.floor(cursor / 6)]) >> (cursor % 6)) & 1) * 2 ** i; return v; };
  for (let i = 0; i < 16; i++) out.push(bit(8));
  return out;
}
module.exports = {encode, picksOf, freeNodesOf, hashOf, D, nodesOf};
