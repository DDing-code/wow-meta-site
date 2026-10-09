const fs=require('node:fs');
const assert=require('node:assert/strict');
const {act,viewport,shot}=require('./oddin.cjs');
const guides=require('../scope.json').filter(g=>['warrior-protection','deathknight-unholy','monk-brewmaster','priest-holy','priest-discipline','hunter-marksmanship','evoker-preservation'].includes(g.id));
const widths=[320,390,1440];
const base=process.argv[2]||'http://localhost:3002';
const output=['localhost','127.0.0.1'].includes(new URL(base).hostname)?'local-release':'public-ui';
async function choose(selector,index) {
 await act('eval',{expression:`document.querySelectorAll(${JSON.stringify(selector)})[${index}].scrollIntoView({behavior:'instant',block:'center'});document.querySelectorAll('[data-oddin-ref]').forEach(e=>e.removeAttribute('data-oddin-ref'))`});
 await act('read');
 const chosen=(await act('eval',{expression:`(()=>{const ref=document.querySelectorAll(${JSON.stringify(selector)})[${index}].getAttribute('data-oddin-ref');return {ref,unique:[...document.querySelectorAll('[data-oddin-ref]')].filter(e=>e.getAttribute('data-oddin-ref')===ref).length===1}})()`})).value;
 const ref=chosen.ref;
 assert(ref,selector);
 assert(chosen.unique,`${selector}: 중복 검사 번호`);
 await act('click',{ref});
}
async function images() {
 for(let attempt=0;attempt<3;attempt++) {
  const ready=(await act('eval',{expression:`(async()=>{const images=[...document.images].filter(i=>{const r=i.getBoundingClientRect();return i.checkVisibility({contentVisibilityAuto:true,checkOpacity:true,checkVisibilityCSS:true})&&r.width&&r.height&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth});await Promise.race([Promise.all(images.map(i=>i.decode().catch(()=>{}))),new Promise(r=>setTimeout(r,4000))]);return images.every(i=>i.naturalWidth>0)})()`})).value;
  if(ready)return;
 }
}
(async()=>{
 const resultFile=`${__dirname}/${output}.json`;
 const expectedBundle=require('./build-proof.json').bundle;
 const results=fs.existsSync(resultFile)?JSON.parse(fs.readFileSync(resultFile,'utf8')).filter(r=>r.bundle.endsWith(expectedBundle)):[];
 assert(results.every(r=>widths.includes(r.width)&&r.modeChecks.length===6&&!r.overflow));
 await act('open',{chrome:false,url:base+'/guide/mage/arcane'});
 for(const width of widths) {
  await viewport(width);
  for(const g of guides) {
   if(results.some(r=>r.id===g.id&&r.width===width))continue;
   await act('open',{chrome:false,url:base+g.path});
   await viewport(width);
   await act('eval',{expression:'document.fonts.ready'});
   const title=(await act('eval',{expression:`document.querySelector('h1')?.innerText`})).value;
   assert((await act('eval',{expression:"document.querySelector('main').innerText.includes('2026-10-10')"})).value, g.id+': 최신 반영 날짜');
   assert(title.includes(g.spec),`${g.id}: title`);
   const legacy=(await act('eval',{expression:"[...document.querySelectorAll('#skills [data-wowhead],#synergies [data-wowhead]')].filter(a=>/spell=(321377|372309|388193|391154|391387|204883)(?:&|$)/.test(a.dataset.wowhead)).map(a=>a.dataset.wowhead)"})).value;
   assert.deepEqual(legacy,[],g.id+': 과거 주문은 현재 스킬·시너지 추천에서 제외');
   const matchedSources=(await act('eval',{expression:"[...document.querySelectorAll('#sources a')].filter(a=>a.querySelector('strong')?.textContent.startsWith('WCL 조건 ')).map(a=>a.href)"})).value;
   const manuscript=require('../manuscripts/'+g.id+'.json');
   const heroLabels=(await act('eval',{expression:"[...document.querySelectorAll('[aria-label=\"영웅 특성 선택\"] button')].map(e=>e.textContent)"})).value;
   assert.deepEqual(heroLabels,manuscript.heroBranches.map(h=>h.label),g.id+': 검수한 영웅 명칭 공개 표시');
   assert((await act('eval',{expression:"/이번 한국 검수:/.test(document.querySelector('[data-guide-block=\"hero-branches\"]').textContent)"})).value,g.id+': 영웅별 근거 범위 표시');
   assert.deepEqual(matchedSources,[...manuscript.logReview.individual.combats,...manuscript.logReview.mythicPlus.combats].map(c=>c.url),g.id+': 새 근거 공개 표시');
   const conclusion=(await act('eval',{expression:"(()=>{const h=[...document.querySelectorAll('h3')].find(h=>h.textContent==='참고한 자료');const li=h.parentElement.querySelector('ul').lastElementChild;li.scrollIntoView({behavior:'instant',block:'center'});return li.textContent})()"})).value;
   assert(conclusion.includes('한국 최신 메타나 영웅 특성 간 우열을 확정하는 자료로 사용하지 않습니다.'),g.id);
   const comparison=await shot(`${output}-${g.id}-${width}-comparison`);
   await act('eval',{expression:`document.querySelector('#guide-talents').scrollIntoView({behavior:'instant'});scrollBy({top:-80,behavior:'instant'})`});
   for(let i=0;i<3;i++) {
    await choose('#guide-talents summary',i);
    const code=(await act('eval',{expression:`(()=>{const t=document.querySelectorAll('#guide-talents textarea')[${i}];return {code:t.value,readOnly:t.readOnly,fit:t.getBoundingClientRect().width<=innerWidth};})()`})).value;
    assert(code.readOnly&&code.fit&&/^[A-Za-z0-9+/]+$/.test(code.code),g.id);
    assert.equal(code.code,require('../manuscripts/'+g.id+'.json').talentBuilds[i].code,g.id);
   }
   await act('eval',{expression:`document.querySelector('#guide-talents').scrollIntoView({behavior:'instant'});scrollBy({top:-80,behavior:'instant'})`});
   await images();
   const talents=await shot(`${output}-${g.id}-${width}-talents`);
   const modeChecks=[];
   for(let hero=0;hero<2;hero++) {
    await choose('[aria-label="영웅 특성 선택"] button',hero);
    assert((await act('eval',{expression:`document.querySelectorAll('[aria-label="영웅 특성 선택"] button')[${hero}].getAttribute('aria-pressed')==='true'`})).value,g.id);
    for(let mode=0;mode<3;mode++) {
     await choose('[aria-label="전투 상황 선택"] button',mode);
     await act('eval',{expression:`document.querySelector('[data-guide-rotation-modes]').scrollIntoView({behavior:'instant'});scrollBy({top:-80,behavior:'instant'})`});
     await images();
     const data=(await act('eval',{expression:`({width:innerWidth,mode:document.querySelector('[data-rotation-mode]').dataset.rotationMode,icons:document.querySelectorAll('[data-rotation-mode] img').length,missing:[...document.querySelectorAll('[data-rotation-mode] img')].filter(i=>{const r=i.getBoundingClientRect();return i.checkVisibility({contentVisibilityAuto:true,checkOpacity:true,checkVisibilityCSS:true})&&r.width&&r.height&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth&&!i.naturalWidth}).map(i=>i.src),overflow:document.documentElement.scrollWidth>innerWidth,fit:[...document.querySelectorAll('[aria-label="전투 상황 선택"] button')].every(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth})})`})).value;
     assert.equal(data.width,width);
     assert.equal(data.mode,['opener','singleTarget','aoe'][mode]);
     assert(!data.overflow&&data.fit&&data.icons>=6&&!data.missing.length,`${g.id}: hero ${hero} mode ${mode} ${JSON.stringify(data)}`);
     modeChecks.push({hero,...data});
     if(hero===0&&mode===0) await shot(`${output}-${g.id}-${width}-flow`);
     if(['druid-guardian','shaman-elemental','mage-arcane','shaman-restoration'].includes(g.id))await shot(`${output}-${g.id}-${width}-${hero}-${data.mode}`);
    }
   }
   const data=(await act('eval',{expression:`({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,builds:document.querySelectorAll('#guide-talents textarea').length,missingVisibleIcons:[...document.querySelectorAll('a[data-wowhead]')].filter(a=>{const r=a.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight&&!a.closest('svg')&&!a.querySelector('img')}).length,bundle:[...document.scripts].find(s=>s.src.includes('/static/js/main.'))?.src})`})).value;
   assert(!data.overflow&&data.builds===3&&data.missingVisibleIcons===0&&data.bundle.endsWith(expectedBundle),g.id);
   results.push({id:g.id,title,talents,comparison,matchedSources,modeChecks,...data});
   fs.writeFileSync(`${__dirname}/${output}.json`,JSON.stringify(results,null,2));
   console.log(`${width}px ${g.id} 통과 (${results.length}/21)`);
  }
 }
 assert.equal(results.length,21);
 console.log(JSON.stringify({guides:7,widths,routeViews:21,heroModeChecks:126,talentViews:63,base}));
 await act('close');
 process.exit(0);
})().catch(e=>{console.error(e);process.exit(1);});
