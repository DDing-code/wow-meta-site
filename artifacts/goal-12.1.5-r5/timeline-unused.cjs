// 개념서 2부 타임라인의 줄 위 스킬(조건부 above 제외)이 12.1.5 이후 최상위 전투(전 지역·KR, 모든 영웅) 시전 표에 한 번도 없으면 표시한다.
// 같은 한국어 이름의 다른 ID가 시전됐으면 시전된 것으로 본다. 결과는 대조용 후보 목록이며 오류 판정이 아니다.
const fs=require('fs'), path=require('path');
const {skills}=require('../../src/data/kb-skills.json');
const {loadContent}=require('../book-rebuild/lib.cjs');
const dir=path.join(__dirname,'logs/combats'); const files=fs.readdirSync(dir);
const ids=[...new Set(files.map(f=>f.replace(/-(raid|mythicPlus)-.*$/,'')))];
const out=[];
for (const id of ids) {
  if (id==='hunter-marksmanship') continue;
  const castIds=new Set(), castNames=new Set();
  for (const f of files.filter(f=>f.startsWith(id+'-raid-')||f.startsWith(id+'-mythicPlus-'))) { const j=JSON.parse(fs.readFileSync(path.join(dir,f),'utf8')); for (const e of j.tables.casts.data.entries) { castIds.add(String(e.guid)); castNames.add(String(e.name).toLowerCase()); if (skills[String(e.guid)]) castNames.add(skills[String(e.guid)].koreanName); } }
  const c=loadContent(id); const nodes=[];
  const walk=(o,inTl)=>{ if(!o||typeof o!=='object') return; if(Array.isArray(o)) return o.forEach(x=>walk(x,inTl));
    for (const [k,v] of Object.entries(o)) { if (k==='timeline') walk(v,true); else if (k==='above') continue; else if (inTl && k==='nodes' && Array.isArray(v)) v.forEach(n=>n.skillId&&nodes.push(n)); else walk(v,inTl); } };
  walk(c,false);
  const miss=new Map();
  for (const n of nodes) { const s=skills[n.skillId]; if (!s) continue; if (s.type!=='atomic-skill' && s.type!=='skill' && s.type!=='hero-talent' && s.type!=='talent') continue;
    if (castIds.has(n.skillId) || castNames.has(s.koreanName) || castNames.has(String(s.englishName||'').toLowerCase())) continue; miss.set(n.skillId,`${s.koreanName}(${n.skillId}·${s.type})`); }
  if (miss.size) out.push(`${id}: ${[...miss.values()].join(', ')}`);
}
console.log(out.join('\n')||'없음');
