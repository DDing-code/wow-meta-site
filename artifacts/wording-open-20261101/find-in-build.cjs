// 빌드 번들(build/static/js)에 문장이 들어갔는지 찾는다. 한글이 \uXXXX 로 바뀐 경우도 찾는다.
// 사용: node find-in-build.cjs "문장" ["문장" …]
const fs = require('node:fs');
const path = require('node:path');
const dir = path.resolve(__dirname, '..', '..', 'build', 'static', 'js');
const esc = s => [...s].map(c => (c.charCodeAt(0) > 127 ? '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0') : c)).join('');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
for (const t of process.argv.slice(2)) {
  const hits = files.filter(f => {
    const s = fs.readFileSync(path.join(dir, f), 'utf8');
    return s.includes(t) || s.toLowerCase().includes(esc(t).toLowerCase());
  });
  console.log(`${t} → ${hits.join(', ') || '없음'}`);
}
