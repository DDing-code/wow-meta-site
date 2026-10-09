const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const base='https://wowmeta.vercel.app',build=path.resolve(__dirname,'../../../build'),proof=require('./build-proof.json'),scope=require('../scope.json');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const files=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else files.push(path.relative(build,p).replaceAll('\\','/'));}}
walk(build);assert.equal(files.length,6);assert.equal(scope.length,40);
(async()=>{
 const checkedFiles=await Promise.all(files.map(async file=>{const r=await fetch(base+'/'+file);assert.equal(r.status,200,file);const local=fs.readFileSync(path.join(build,file)),remote=Buffer.from(await r.arrayBuffer());assert.equal(sha(remote),sha(local),file);return {file,status:r.status,bytes:remote.length,sha256:sha(remote)};}));
 const routes=[];
 for(let i=0;i<scope.length;i+=5)routes.push(...await Promise.all(scope.slice(i,i+5).map(async g=>{const r=await fetch(base+g.path);assert.equal(r.status,200,g.id);const html=await r.text();assert(html.includes(proof.bundle),g.id);return {id:g.id,url:base+g.path,status:r.status,bundle:proof.bundle};})));
 assert.equal(routes.length,40);assert.equal(checkedFiles.find(f=>'/'+f.file===proof.bundle).sha256,proof.sha256);
 const data={checkedAt:new Date().toISOString(),base,bundle:proof.bundle,bundleSha256:proof.sha256,files:checkedFiles,routes,publicUiScope:'별도 public-ui.json의 7개 가이드·21화면. 이 40개 경로 검사는 HTML과 공개 번들 일치 확인.',deploymentId:proof.deploymentId,deploymentUrl:proof.deploymentUrl,deploymentStatus:proof.deploymentStatus,contentCommit:proof.newCommit};
 fs.writeFileSync(__dirname+'/public-deploy.json',JSON.stringify(data,null,2));
 console.log(JSON.stringify({files:checkedFiles.length,routes:routes.length,bundle:proof.bundle,allBytesMatch:true}));
})().catch(e=>{console.error(e.message);process.exitCode=1;});
