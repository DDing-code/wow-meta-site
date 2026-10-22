// raidstrats 공략 JSON(references/planner/plans/<boss>-strat.json)을 읽기 좋은 글로 푼다. node strat-text.cjs → text/<boss>.txt
const fs = require('fs'), path = require('path');
const DIR = 'F:/01_프로젝트/90_개발/ai-hub/workspace/outputs/mythic-raid-storyboard-20261022/references/planner/plans';
const strip = (h) => String(h || '').replace(/<br\s*\/?>/g, '\n').replace(/<\/(p|li|h\d)>/g, '\n').replace(/<li>/g, '- ').replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\n{2,}/g, '\n').trim();
fs.mkdirSync(path.join(__dirname, 'text'), { recursive: true });
for (const f of fs.readdirSync(DIR).filter((f) => f.endsWith('-strat.json'))) {
  const s = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
  const out = [`# ${s.boss.name} (${s.difficulty}) by ${s.author_name} updated ${s.updated_at}`, '## overview', strip(s.overview), '## quick', strip(s.quick_overview?.description), strip(s.quick_overview?.recommended_raid_comment)];
  for (const p of s.phases || []) {
    out.push(`\n## PHASE ${p.name}`, strip(p.description));
    if (p.wipe_notes) out.push('### wipe notes', strip(p.wipe_notes));
    for (const a of p.abilities || []) {
      const extra = Object.entries(a).filter(([k, v]) => typeof v === 'string' && v.length > 20 && !/icon|image|url|description_raw/i.test(k) && k !== 'name');
      out.push(`### [${a.spell_id || a.id}] ${a.name}`);
      for (const [k, v] of extra) out.push(`  (${k}) ${strip(v)}`);
    }
  }
  fs.writeFileSync(path.join(__dirname, 'text', f.replace('-strat.json', '.txt')), out.join('\n'));
}
