// 사격 사냥꾼 개념서형 샘플 반영 도구.
// 1) KB 정본(guide-12.1.json)을 읽어 book-content.cjs의 새 구성으로 바꾼다.
// 2) KB 정본을 저장하고, 같은 객체를 사격 원고 파일(src/data/manuscripts/hunter-marksmanship.js)에 그대로 이식한다.
// 사용: node artifacts/mm-concept-sample/apply.cjs [--dry]
const fs = require('fs');
const path = require('path');

const SITE = path.resolve(__dirname, '..', '..');
const KB_JSON = path.join(SITE, '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base', '05-사냥꾼', '사격', 'Meta', 'guide-12.1.json');
const ID = 'hunter-marksmanship';
// 원고는 전문화마다 파일 하나다(src/data/guideManuscripts.js 는 모으기만 한다).
const MANUSCRIPTS = path.join(SITE, 'src', 'data', 'manuscripts', `${ID}.js`);
const dry = process.argv.includes('--dry');

const content = require('./book-content.cjs');
const original = JSON.parse(fs.readFileSync(KB_JSON, 'utf8'));
const next = content.transform(original);

const IDENT = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const q = s => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r')}'`;
function lit(v, ind) {
  const pad = ' '.repeat(ind);
  const inner = ' '.repeat(ind + 2);
  if (Array.isArray(v)) {
    if (!v.length) return '[]';
    return '[\n' + v.map(x => inner + lit(x, ind + 2) + ',').join('\n') + '\n' + pad + ']';
  }
  if (v && typeof v === 'object') {
    const keys = Object.keys(v);
    if (!keys.length) return '{}';
    return '{\n' + keys.map(k => `${inner}${IDENT.test(k) ? k : q(k)}: ${lit(v[k], ind + 2)},`).join('\n') + '\n' + pad + '}';
  }
  if (typeof v === 'string') return q(v);
  return JSON.stringify(v);
}

function blockEnd(text, openIdx) {
  let depth = 0;
  for (let i = openIdx; i < text.length; i++) {
    const c = text[i];
    if (c === '"' || c === "'" || c === '`') {
      for (i++; i < text.length && text[i] !== c; i++) if (text[i] === '\\') i++;
      continue;
    }
    if (c === '/' && text[i + 1] === '/') { while (i < text.length && text[i] !== '\n') i++; continue; }
    if (c === '{' || c === '[') depth++;
    else if (c === '}' || c === ']') { depth--; if (depth === 0) return i; }
  }
  throw new Error('unbalanced block');
}

let src = fs.readFileSync(MANUSCRIPTS, 'utf8');
const definition = src.match(/^const manuscript = \{/m);
if (!definition) throw new Error(`${ID}: 원고 정의("const manuscript = {")를 찾지 못함`);
const open = definition.index + definition[0].length - 1;
const end = blockEnd(src, open);
// 본문 들여쓰기(4칸)는 한 파일이던 때와 같게 두고, 파일 맨 바깥 객체의 닫는 중괄호만 맨 앞 칸에 둔다.
src = src.slice(0, open) + lit(next, 2).replace(/\n {2}\}$/, '\n}') + src.slice(end + 1);

const stats = {
  blocks: next.blocks.length,
  parts: next.book.parts.length,
  voices: next.book.voices.length,
  tips: next.tips.length,
  sources: next.sources.length,
  fieldTips: next.blocks.reduce((n, b) => n + (b.fieldTips || []).length, 0),
  quiz: next.blocks.reduce((n, b) => n + (b.quiz || []).length, 0),
};
if (dry) {
  console.log('dry run', stats);
} else {
  fs.writeFileSync(KB_JSON, JSON.stringify(next, null, 2) + '\n');
  fs.writeFileSync(MANUSCRIPTS, src);
  console.log('applied', stats);
}
