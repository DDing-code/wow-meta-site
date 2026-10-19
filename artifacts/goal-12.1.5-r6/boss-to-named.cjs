// '보스' → '네임드' (site AGENTS.md 2026-10-10 사용자 고정 용어). 원고와 KB 정본에 같은 규칙을 적용한다.
const fs = require('fs');
const path = require('path');
const site = path.resolve(__dirname, '../..');
const kbRoot = path.resolve(site, '../WoW-Meta-Knowledge/08-직업별-Knowledge-Base');
const special = [
  ['보스전에서', '네임드 전투에서'],
  ['보스전 비교 로그', '네임드 전투 비교 로그'],
];
// 스킬 이름·공식 툴팁·고유 이름 안의 '보스'는 이 목록에 넣어 건너뛴다(현재 해당 없음).
const keep = [];
function convert(text) {
  let out = text;
  for (const [a, b] of special) out = out.split(a).join(b);
  const guarded = keep.map((k, i) => [k, `\u0000KEEP${i}\u0000`]);
  for (const [k, g] of guarded) out = out.split(k).join(g);
  out = out.split('보스').join('네임드');
  for (const [k, g] of guarded) out = out.split(g).join(k);
  return out;
}
const files = [];
for (const f of fs.readdirSync(path.join(site, 'src/data/manuscripts'))) files.push(path.join(site, 'src/data/manuscripts', f));
for (const cls of fs.readdirSync(kbRoot)) {
  const clsDir = path.join(kbRoot, cls);
  if (!fs.statSync(clsDir).isDirectory()) continue;
  for (const spec of fs.readdirSync(clsDir)) {
    const p = path.join(clsDir, spec, 'Meta', 'guide-12.1.json');
    if (fs.existsSync(p)) files.push(p);
  }
}
const dry = process.argv.includes('--dry');
let total = 0;
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const n = (src.match(/보스/g) || []).length;
  if (!n) continue;
  const next = convert(src);
  total += n;
  console.log(`${n}\t${path.relative(path.resolve(site, '..'), f)}`);
  if (!dry) fs.writeFileSync(f, next);
}
console.log('합계', total, dry ? '(미적용)' : '(적용)');
