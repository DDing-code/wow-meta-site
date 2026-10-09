const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const owner = '20261010-025144-z2_B/t1v';
const hub = 'http://127.0.0.1:7700';
let activeSocket;
let currentWidth, currentHeight;
async function act(action, args = {}) {
  const r = await fetch(`${hub}/api/browser/act`, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({owner,action,...args})});
  const value = await r.json();
  assert(r.ok, value.error);
  return value;
}
async function viewport(width, height = 860, scale = 1) {
  currentWidth=width; currentHeight=height;
  const {tabs} = await fetch(`${hub}/api/browser`).then(r=>r.json());
  const tab = tabs.find(t=>t.owner === owner && t.where === 'oddin');
  assert(tab, 'Open this task in ODDIN first');
  // Only resize this task's existing ODDIN tab; all navigation/capture uses ODDIN.
  const port = fs.readFileSync('F:/01_프로젝트/90_개발/ai-hub/data/browser-profile/DevToolsActivePort','utf8').split(/\r?\n/)[0];
  const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then(r=>r.json());
  activeSocket?.close();
  const ws = activeSocket = new WebSocket(targets.find(t=>t.id === tab.id).webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
  await new Promise((resolve,reject)=>{
    ws.onmessage=e=>{const r=JSON.parse(e.data);if(r.id===1) r.error?reject(new Error(r.error.message)):resolve();};
    ws.send(JSON.stringify({id:1,method:'Emulation.setDeviceMetricsOverride',params:{width,height,screenWidth:width,screenHeight:height,deviceScaleFactor:1,mobile:false,dontSetVisibleSize:true,scale}}));
  });
  await new Promise((resolve,reject)=>{
    ws.onmessage=e=>{const r=JSON.parse(e.data);if(r.id===2) r.error?reject(new Error(r.error.message)):resolve();};
    ws.send(JSON.stringify({id:2,method:'Emulation.setVisibleSize',params:{width,height}}));
  });
  await new Promise((resolve,reject)=>{
    ws.onmessage=e=>{const r=JSON.parse(e.data);if(r.id===3) r.error?reject(new Error(r.error.message)):resolve();};
    ws.send(JSON.stringify({id:3,method:'Page.bringToFront'}));
  });
  await new Promise((resolve,reject)=>{
    ws.onmessage=e=>{const r=JSON.parse(e.data);if(r.id===4) r.error?reject(new Error(r.error.message)):resolve();};
    ws.send(JSON.stringify({id:4,method:'Emulation.setFocusEmulationEnabled',params:{enabled:true}}));
  });
  return (await act('eval',{expression:'({width:innerWidth,height:innerHeight})'})).value;
}
async function shot(name) {
  if(activeSocket) await new Promise((resolve,reject)=>{
    activeSocket.onmessage=e=>{const r=JSON.parse(e.data);if(r.id===5) r.error?reject(new Error(r.error.message)):resolve();};
    activeSocket.send(JSON.stringify({id:5,method:'Page.bringToFront'}));
  });
  const clear = (await act('eval', {expression:"!document.elementFromPoint(1,1)?.closest('a,button,summary,input,textarea')"})).value;
  assert(clear, 'Screenshot corner must be clear');
  await act('click', {x:1,y:1});
  // 캡처할 때만 축소한다. 클릭 좌표는 원래 배율을 유지한다.
  if(currentWidth>1280) await viewport(currentWidth,currentHeight,1280/currentWidth);
  let r;
  try { for (let attempt=0;attempt<2;attempt++) {
    try { r = await act('screenshot'); break; }
    catch (e) { if(attempt===1)throw e; console.log('화면 캡처를 다시 시도합니다.'); }
  } } finally { if(currentWidth>1280) await viewport(currentWidth,currentHeight); }
  const target = path.join(__dirname, `${name}.png`);
  fs.writeFileSync(target,Buffer.from(r.image,'base64'));
  return target;
}
module.exports = {act,viewport,shot};
if(require.main===module) (async()=>{
  if(process.argv[2]==='viewport') {
    console.log(await viewport(Number(process.argv[3])));
    process.stdin.on('data', async data => console.log(await viewport(Number(data.toString().trim()))));
    process.stdin.resume();
  }
  if(process.argv[2]==='shot') console.log(await shot(process.argv[3]));
})().catch(e=>{console.error(e);process.exitCode=1;});
