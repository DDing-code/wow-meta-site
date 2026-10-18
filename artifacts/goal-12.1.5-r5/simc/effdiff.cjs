// SimC 두 판의 주문 효과 줄을 비교한다. 사용: node effdiff.cjs <spellId> [...]
const fs=require('fs');
const load=f=>{const t=fs.readFileSync(f,'utf8');const i=t.indexOf('__spelleffect_data[');const j=t.indexOf('__spelleffect_id_index');return t.slice(i,j).split('\n');};
const A=load('spell-db768b52b425db274e4ebd3ce3d5efc26c8882b5.inc'), B=load('spell-5537d881.inc');
const bySpell=(L,id)=>L.filter(l=>{const m=l.match(/^\s*\{\s*(\d+),\s*(\d+),/);return m&&m[2]===String(id);});
for(const id of process.argv.slice(2)){const a=bySpell(A,id),b=bySpell(B,id);
 const key=l=>l.match(/^\s*\{\s*(\d+)/)[1];
 const ma=new Map(a.map(l=>[key(l),l.trim()])), mb=new Map(b.map(l=>[key(l),l.trim()]));
 console.log(`== ${id}: 12.1.0 ${a.length}개 / 12.1.5 ${b.length}개`);
 for(const k of new Set([...ma.keys(),...mb.keys()])) if(ma.get(k)!==mb.get(k)) console.log(' -',ma.get(k)||'(없음)','\n +',mb.get(k)||'(없음)');}
