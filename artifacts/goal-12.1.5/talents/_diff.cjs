// 12.1.0(db768b52, oct7 사본) ↔ 12.1.5(5537d881) trait_data 비교
const fs=require('fs');
const path=require('path');
const RE=/^\s*\{\s*([\d,\s-]+),\s*"((?:\\.|[^"\\])*)",\s*\{([^}]+)\},\s*\{([^}]+)\},\s*(\d+),\s*(\d+)\s*\}/;
function parse(f){const out=new Map();for(const line of fs.readFileSync(f,'utf8').split('\n')){const m=line.match(RE);if(!m)continue;const n=m[1].split(',').map(Number);out.set(n[2],{n,name:m[2],specs:m[3].replace(/\s/g,''),starters:m[4].replace(/\s/g,''),hero:+m[5],type:+m[6]});}return out;}
const a=parse(path.join(__dirname,'../../goal-12.1-resume-20261008/trait_data-oct7.inc')),b=parse(path.join(__dirname,'trait_data.inc'));
const keys=['tree','cls','entry','node','max','req','def','spell','rep','over','row','col','idx'];
const changes=[];
for(const [e,x] of a){const y=b.get(e);if(!y){changes.push({kind:'removed',entry:e,node:x.n[3],cls:x.n[1],tree:x.n[0],name:x.name,spell:x.n[7],specs:x.specs});continue;}
 const d={};x.n.forEach((v,i)=>{if(v!==y.n[i])d[keys[i]]=[v,y.n[i]]});for(const k of ['name','specs','starters','hero','type'])if(x[k]!==y[k])d[k]=[x[k],y[k]];
 if(Object.keys(d).length)changes.push({kind:'changed',entry:e,node:x.n[3],cls:x.n[1],tree:x.n[0],name:x.name,spell:x.n[7],specs:x.specs,diff:d});}
for(const [e,y] of b)if(!a.has(e))changes.push({kind:'added',entry:e,node:y.n[3],cls:y.n[1],tree:y.n[0],name:y.name,spell:y.n[7],specs:y.specs});
fs.writeFileSync(path.join(__dirname,'trait-diff.json'),JSON.stringify(changes,null,2)+'\n');
for(const c of changes)console.log(c.kind,c.entry,'node',c.node,'cls',c.cls,'tree',c.tree,c.name,c.specs,c.diff?JSON.stringify(c.diff):'');
console.log('total',changes.length);
