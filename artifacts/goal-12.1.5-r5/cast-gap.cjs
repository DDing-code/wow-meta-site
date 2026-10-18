// 12.1.5 이후 최상위 전투의 시전 상위 주문(전 지역)이 가이드 원고 파일에 한 번도 안 나오는지 본다.
// 원고에 ID가 없고 kb-skills.json 에 같은 이름의 다른 ID가 원고에 있으면 '다른 ID로 언급'으로 본다.
const fs=require('fs'); const path=require('path');
const S=require('./logs/summary.json'); const {skills}=require('../../src/data/kb-skills.json');
const ignore=/^(Roll|Kick|Rebuke|Feint|Provoke|Divine Steed|Spear Hand Strike|Shadowstep|Wind Shear|Counterspell|Pummel|Mind Freeze|Disrupt|Skull Bash|Solar Beam|Quell|Silence|Muzzle|Counter Shot|Blink|Shimmer|Heroic Leap|Charge|Death's Advance|Fel Rush|Vengeful Retreat|Sprint|Dash|Stampeding Roar|Hover|Door of Shadows|Demonic Gateway|Health Stone|Healthstone|Unknown)$/i;
const out=[];
for (const id of [...new Set(S.map(r=>r.id))]) {
  const text=fs.readFileSync(path.join(__dirname,'../../src/data/manuscripts',id+'.js'),'utf8');
  const rows=S.filter(r=>r.id===id && !/KR/.test(r.scope||r.region||''));
  const gaps=new Map();
  for (const r of rows) for (const c of r.topCombats||[]) for (const t of (c.topCasts||[]).slice(0,12)) {
    if (ignore.test(t.name)) continue;
    const sid=String(t.id); if (text.includes(`'${sid}'`)||text.includes(`"${sid}"`)||text.includes(`=${sid}`)) continue;
    const kn=skills[sid]?.koreanName; if (kn && text.includes(kn)) continue;
    const key=sid; const g=gaps.get(key)||{id:sid,name:kn||t.name,modes:new Set(),heroes:new Set(),count:0}; g.modes.add(r.mode); g.heroes.add(c.hero); g.count=Math.max(g.count,t.count); gaps.set(key,g);
  }
  if (gaps.size) out.push(`${id}: `+[...gaps.values()].map(g=>`${g.name}(${g.id}, ${[...g.modes].join('/')}, ${[...g.heroes].join('/')}, 최대 ${g.count}회)`).join('; '));
}
console.log(out.join('\n')||'없음');
