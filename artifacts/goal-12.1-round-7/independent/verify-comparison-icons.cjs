const fs=require('node:fs');
const assert=require('node:assert/strict');
const {act,viewport,shot}=require('./oddin.cjs');
(async()=>{
  await act('open',{url:'http://127.0.0.1:4178/guide/paladin/protection',chrome:false});
  await viewport(390);
  await act('read');
  const data=(await act('eval',{expression:`(async()=>{
    const h=[...document.querySelectorAll('h3')].find(h=>h.textContent==='참고한 자료');
    h.parentElement.querySelector('ul').lastElementChild.scrollIntoView({block:'center',behavior:'instant'});
    const imgs=[...document.images].filter(i=>{const r=i.getBoundingClientRect();return r.width&&r.top<innerHeight&&r.bottom>0&&r.right>0&&r.left<innerWidth});
    await Promise.all(imgs.map(i=>i.decode().catch(()=>{})));
    return {images:imgs.map(i=>({src:i.src,loaded:i.naturalWidth>0})),overflow:document.documentElement.scrollWidth>innerWidth};
  })()`})).value;
  assert(data.images.length>0);
  assert(data.images.every(i=>i.loaded));
  assert.equal(data.overflow,false);
  data.screenshot=await shot('local-paladin-protection-390-comparison-icons');
  fs.writeFileSync(__dirname+'/comparison-icons.json',JSON.stringify(data,null,2));
  await act('close');
  console.log(JSON.stringify(data));
  process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
