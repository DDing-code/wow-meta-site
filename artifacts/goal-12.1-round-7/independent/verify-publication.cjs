const fs = require('node:fs');
const cp = require('node:child_process');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname,'../../..');
const source = fs.readFileSync(path.join(root,'src/data/guideUpdates.js'),'utf8').replace(/export (const|function)/g,'$1');
const {guideUpdates,getGuidePublication} = new Function(source+';return {guideUpdates,getGuidePublication}')();
const date = cp.execFileSync('git',['show','-s','--format=%cI','df833379'],{cwd:root,encoding:'utf8'}).trim().slice(0,10);
const ids = require('../scope.json').map(g=>g.id);
let partial = 0;
for(const id of ids) {
  const entry = guideUpdates.find(e=>e.guideIds.includes(id));
  assert.equal(entry.date,date,id);
  assert.deepEqual(entry.commits,['df833379'],id);
  partial += Number(getGuidePublication(id,{patch:'12.1'}).partial);
}
assert.equal(partial,36);
for(const name of ['kb-skills','kb-synergies']) {
  const file = `src/data/${name}.json`;
  const before = JSON.parse(cp.execFileSync('git',['show',`a7702c01:${file}`],{cwd:root,encoding:'utf8',maxBuffer:64*1024*1024}));
  const after = JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
  delete before.metadata.generatedAt;
  delete after.metadata.generatedAt;
  assert.deepEqual(after,before,`${name}: 동기화 후 내용 동일`);
}
console.log(JSON.stringify({date,contentCommit:'df833379',guides:ids.length,complete:ids.length-partial,partial,generatedContentUnchanged:true}));
