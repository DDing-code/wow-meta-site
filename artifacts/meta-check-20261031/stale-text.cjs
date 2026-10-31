// 화면에 보이는 원고 글(근거·주의·책 본문·팁·영웅 분기)에서 "단일 … <영웅> 견본"처럼
// 지금 단일 견본(talentBuilds single-target)과 다른 영웅을 단일 견본으로 말하는 문장을 찾는다. 읽기만 한다.
const {loadGuideManuscripts} = require('C:/wowmeta/site/scripts/lib/guideManuscripts.cjs');
const all = loadGuideManuscripts();
const strings = (v, path, out) => {
  if (typeof v === 'string') out.push([path, v]);
  else if (Array.isArray(v)) v.forEach((x, i) => strings(x, path + '[' + i + ']', out));
  else if (v && typeof v === 'object') for (const k of Object.keys(v)) strings(v[k], path + '.' + k, out);
  return out;
};
const VISIBLE = ['summary', 'evidence', 'caveats', 'book', 'tips', 'heroBranches', 'priority', 'opener', 'playstyle'];
for (const [id, m] of Object.entries(all)) {
  const single = m.talentBuilds?.find(b => b.id === 'single-target')?.heroLabel;
  const heroes = [...new Set((m.heroBranches || []).map(b => b.label))];
  const others = heroes.filter(h => h !== single);
  if (!single || !others.length) continue;
  const hits = [];
  for (const f of VISIBLE) for (const [p, s] of strings(m[f], f, [])) {
    for (const sent of s.split(/(?<=[.다요])\s+/)) {
      for (const o of others) {
        const re = new RegExp(`(단일[^.]{0,20}${o}[^.]{0,6}견본|${o}[^.]{0,4}단일 견본|단일 견본[은는이가]? ?${o})`);
        if (re.test(sent)) hits.push(`${p}: ${sent.slice(0, 160)}`);
      }
    }
  }
  if (hits.length) { console.log(`## ${id} (단일 견본 ${single})`); [...new Set(hits)].forEach(h => console.log('  - ' + h)); }
}
