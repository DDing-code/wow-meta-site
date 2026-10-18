// 사용: node tl-context.cjs <가이드 ID> <skillId>... — 타임라인 노드 캡션, 견본 선택 여부, 최근 전투 시전 상위 목록
const fs=require('fs'),path=require('path');
const {loadContent,kbGuidePath}=require('../book-rebuild/lib.cjs');
const {makeDecoder,defaultFile}=require('../goal-12.1.5/talents/decode-talents.cjs'); const D=makeDecoder(defaultFile);
const [id,...sids]=process.argv.slice(2);
const c=loadContent(id); const hits=[];
const walk=(o,label)=>{ if(!o||typeof o!=='object') return; if(Array.isArray(o)) return o.forEach(x=>walk(x,label));
  if (o.label && o.nodes) label=o.label;
  if (o.skillId && sids.includes(o.skillId)) hits.push(`[${label||''}] ${o.skillId} ${o.caption||o.when||o.note||''}${o.above?` (위: ${o.above.skillId} ${o.above.when})`:''}`);
  if (o.above && sids.includes(o.above.skillId)) hits.push(`[${label||''}] 위 ${o.above.skillId} ${o.above.when} (줄: ${o.skillId} ${o.caption})`);
  for (const v of Object.values(o)) walk(v,label); };
walk(c.blocks||c,null);
console.log(hits.slice(0,12).join('\n'));
const g=JSON.parse(fs.readFileSync(kbGuidePath(id).file,'utf8'));
for (const t of g.talentBuilds){ const x=D.decode(t.code); console.log('견본',t.label,t.heroLabel, sids.map(s=>s+':'+(x.selected.some(v=>String(v.spell)===s)?'선택':'-')).join(' ')); }
const dir='logs/combats'; for (const f of fs.readdirSync(dir).filter(f=>f.startsWith(id+'-raid-')||f.startsWith(id+'-mythicPlus-'))) { const j=JSON.parse(fs.readFileSync(path.join(dir,f),'utf8')); console.log(f.replace(id+'-',''), j.heroLabel, j.region, j.tables.casts.data.entries.sort((a,b)=>b.total-a.total).slice(0,14).map(e=>e.name+':'+e.total).join(', ')); }
