// 이번 라운드 화면 확인: 목록 화면과 직업별 대표 가이드를 320·390·1440px로 열어 넘침·오류·기본 영웅 탭·공사 중 안내를 세고 캡처한다.
// 사용: node artifacts/goal-12.1.5-r5/shots.cjs <origin> <가이드 ID>...  결과: artifacts/goal-12.1.5-r5/ui/*.png, ui-check.json
const path=require('path'), fs=require('fs');
const {chromium}=require(path.resolve(__dirname,'..','..','..','node_modules','playwright'));
const {loadRegistry}=require('../book-rebuild/lib.cjs');
const [base,...ids]=process.argv.slice(2); const out=path.join(__dirname,'ui'); const reg=loadRegistry();
const UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
(async()=>{
  const browser=await chromium.launch(); const results=[];
  for (const width of [320,390,1440]) {
    const page=await browser.newPage({viewport:{width,height:width===1440?1000:860},userAgent:UA}); const errors=[];
    page.on('pageerror',e=>errors.push(String(e)));
    await page.goto(`${base}/guide`,{waitUntil:'networkidle'});
    const info=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>window.innerWidth+1, notice:[...document.querySelectorAll('*')].map(e=>e.childNodes.length&&[...e.childNodes].some(n=>n.nodeType===3&&/전환·검수 중/.test(n.textContent))?e.textContent.trim():null).find(Boolean)||null, construction:document.querySelectorAll('a[href^="/guide/"] svg.lucide-construction, a[href^="/guide/"] [class*="onstruction"]').length}));
    const el=await page.$('text=/전환·검수 중/'); if (el) await el.scrollIntoViewIfNeeded();
    await page.screenshot({path:path.join(out,`list-${width}.png`)});
    results.push({id:'list',width,...info,errors}); await page.close();
  }
  for (const id of ids) { const spec=reg.find(s=>s.id===id);
    for (const width of [320,390,1440]) {
      const page=await browser.newPage({viewport:{width,height:width===1440?1000:860},userAgent:UA}); const errors=[];
      page.on('pageerror',e=>errors.push(String(e)));
      await page.goto(`${base}${spec.path}`,{waitUntil:'networkidle'}); await page.waitForSelector('[data-book-part]');
      const info=await page.evaluate(()=>{ const pressed=[...document.querySelectorAll('button[aria-pressed="true"], [role="tab"][aria-selected="true"]')].map(b=>b.textContent.trim()).slice(0,6);
        const field=[...document.querySelectorAll('[id^="guide-section-"]')].find(s=>/3부|실전/.test(s.closest('[data-book-part]')?.textContent?.slice(0,30)||''));
        return {overflow:document.documentElement.scrollWidth>window.innerWidth+1, brokenImg:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).length, pressed, chapters:document.querySelectorAll('[id^="guide-section-"]').length, timelines:document.querySelectorAll('[data-book-box="timeline"]').length}; });
      await page.screenshot({path:path.join(out,`${id}-${width}-top.png`)});
      const parts=await page.$$('[data-book-part]'); if (parts[3]) { await parts[3].scrollIntoViewIfNeeded(); await page.waitForTimeout(200); await page.screenshot({path:path.join(out,`${id}-${width}-field.png`)}); }
      const tl=await page.$('[data-book-box="timeline"]'); if (tl) { await tl.scrollIntoViewIfNeeded(); await page.waitForTimeout(200); await page.screenshot({path:path.join(out,`${id}-${width}-timeline.png`)}); }
      results.push({id,width,...info,errors}); await page.close(); } }
  await browser.close(); fs.writeFileSync(path.join(out,'ui-check.json'),JSON.stringify(results,null,2));
  const bad=results.filter(r=>r.overflow||r.brokenImg||r.errors.length); console.log(`화면 ${results.length}개, 문제 ${bad.length}개`); bad.forEach(b=>console.log(JSON.stringify(b)));
  console.log(JSON.stringify(results.filter(r=>r.id==='list')));
})();
