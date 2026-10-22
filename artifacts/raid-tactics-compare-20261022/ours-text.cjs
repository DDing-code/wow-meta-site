// KB raid-guide.json 네임드 글을 경로와 함께 풀어 쓴다. node ours-text.cjs → ours/<boss>.txt
const fs = require('fs'), path = require('path');
const g = JSON.parse(fs.readFileSync('C:/wowmeta/kb/08-직업별-Knowledge-Base/00-공통/공용/Meta/raid-guide.json', 'utf8'));
fs.mkdirSync(path.join(__dirname, 'ours'), { recursive: true });
g.episodes.forEach((e, ei) => e.bosses.forEach((b, bi) => {
  const out = [];
  const walk = (o, p) => {
    if (typeof o === 'string') { if (!/^(sprites|figure)/.test(p)) out.push(`${p}: ${o}`); return; }
    if (o && typeof o === 'object') for (const k in o) if (k !== 'sprites') walk(o[k], p ? `${p}.${k}` : k);
  };
  walk(b, '');
  fs.writeFileSync(path.join(__dirname, 'ours', `${b.id}.txt`), `# episodes[${ei}].bosses[${bi}] ${b.name}\n` + out.join('\n'));
}));
