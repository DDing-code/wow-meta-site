// 모든 KB 견본 코드를 풀었다가 다시 써서 같은 문자열이 나오는지 본다.
const fs = require('node:fs'); const path = require('node:path');
const {encode, picksOf, hashOf, D} = require('./encode-talents.cjs');
const KB = 'C:/wowmeta/kb/08-직업별-Knowledge-Base';
let ok = 0, bad = 0;
for (const c of fs.readdirSync(KB)) { const cd = path.join(KB, c); if (!fs.statSync(cd).isDirectory()) continue;
  for (const s of fs.readdirSync(cd)) { const f = path.join(cd, s, 'Meta', 'guide-12.1.json'); if (!fs.existsSync(f)) continue;
    for (const b of JSON.parse(fs.readFileSync(f, 'utf8')).talentBuilds) {
      const {picks, free, d} = picksOf(b.code); const again = encode(d.spec, picks, free, hashOf(b.code));
      const strip = x => x.replace(/A+$/, '');
      if (strip(again) === strip(b.code)) ok++; else { bad++; console.log('다름', c, s, b.id, '\n ', b.code, '\n ', again); }
    } } }
console.log('같음', ok, '다름', bad);
