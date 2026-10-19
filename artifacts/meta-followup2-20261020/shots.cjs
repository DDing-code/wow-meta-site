// 최신 메타 후속 2 화면 확인: 방어 전사 사기의 외침(천둥군주) 문단·예시·퀴즈·1부 그림, 복수 오프닝 불지옥 일격 진입 가지·궤멸자 오프닝 탭.
// 사용: node shots.cjs <origin>   결과: shots/*.png, shots/check.json
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('F:/01_프로젝트/90_개발/wowmeta/node_modules/playwright');
const {loadRegistry} = require('C:/wowmeta/site/artifacts/book-rebuild/lib.cjs');
const OUT = path.join(__dirname, 'shots');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';

// 글자를 포함한 가장 작은 블록(본문 장 단위)을 찾아 찍는다.
async function shotText(page, text, file) {
  const handle = await page.evaluateHandle(t => {
    const hit = [...document.querySelectorAll('p, li, div, figcaption, small, span')].filter(e => e.textContent.includes(t));
    const leaf = hit.find(e => ![...e.children].some(c => c.textContent.includes(t))) || hit[hit.length - 1];
    if (!leaf) return null;
    let box = leaf;
    while (box.parentElement && box.getBoundingClientRect().height < 220) box = box.parentElement;
    return box;
  }, text);
  const el = handle.asElement();
  if (!el) return {text, found: false};
  await el.scrollIntoViewIfNeeded();
  await el.screenshot({path: path.join(OUT, file)}).catch(() => {});
  const m = await el.evaluate(e => ({overflow: e.scrollWidth > e.clientWidth + 1, broken: [...e.querySelectorAll('img')].filter(i => i.complete && !i.naturalWidth).length}));
  return {text, found: true, file, ...m};
}

(async () => {
  const base = process.argv[2];
  fs.mkdirSync(OUT, {recursive: true});
  const reg = loadRegistry();
  const browser = await chromium.launch();
  const results = [];
  for (const width of [320, 390, 1440]) {
    // 방어 전사
    {
      const spec = reg.find(s => s.id === 'warrior-protection');
      const page = await browser.newPage({viewport: {width, height: width === 1440 ? 1000 : 860}, userAgent: UA});
      const errors = [];
      page.on('pageerror', e => errors.push(String(e)));
      await page.goto(`${base}${spec.path}`, {waitUntil: 'networkidle'});
      await page.waitForSelector('[data-book-part]');
      // 접힌 상자(조건·예외, 확인 문제)를 모두 펼친다.
      await page.evaluate(() => document.querySelectorAll('details').forEach(d => { d.open = true; }));
      const r = {id: 'warrior-protection', width, errors, shots: []};
      r.thunderlordLinks = await page.evaluate(() => document.querySelectorAll('a[href*="spell=385840"]').length);
      r.shots.push(await shotText(page, '천둥군주를 골랐다면 범위가 15미터로', `warrior-protection-${width}-field.png`));
      r.shots.push(await shotText(page, '30초 뒤에 돌아온다고 장담할 수 없으니', `warrior-protection-${width}-example.png`));
      r.shots.push(await shotText(page, '천둥군주를 골랐다면 천둥벼락이 쿨다운을 줄여', `warrior-protection-${width}-quiz.png`));
      r.shots.push(await shotText(page, '천둥군주면 천둥벼락마다 줄어듦', `warrior-protection-${width}-diagram.png`));
      r.docOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      results.push(r);
      await page.close();
    }
    // 복수
    {
      const spec = reg.find(s => s.id === 'demonhunter-vengeance');
      const page = await browser.newPage({viewport: {width, height: width === 1440 ? 1000 : 860}, userAgent: UA});
      const errors = [];
      page.on('pageerror', e => errors.push(String(e)));
      await page.goto(`${base}${spec.path}`, {waitUntil: 'networkidle'});
      await page.waitForSelector('[data-book-part]');
      const r = {id: 'demonhunter-vengeance', width, errors, shots: []};
      for (const box of await page.$$('[data-book-box="timeline"]')) {
        const has = await box.evaluate(el => el.textContent.includes('멀리서 진입할 때'));
        if (!has) continue;
        await box.scrollIntoViewIfNeeded();
        const file = `demonhunter-vengeance-${width}-opener.png`;
        await box.screenshot({path: path.join(OUT, file)}).catch(() => {});
        r.shots.push({text: '멀리서 진입할 때', found: true, file, ...(await box.evaluate(el => ({overflow: el.scrollWidth > el.clientWidth + 1, broken: [...el.querySelectorAll('img')].filter(i => i.complete && !i.naturalWidth).length, isIcon: !!el.querySelector('img[src*="infernalstrike"], a[href*="spell=189110"]')})))});
      }
      const heroGroup = page.getByRole('group', {name: '영웅 특성 선택', exact: true});
      if (await heroGroup.count()) await heroGroup.getByRole('button', {name: '궤멸자', exact: true}).first().click().catch(() => {});
      const wrap = page.locator('[data-guide-rotation-modes]').first();
      await wrap.getByRole('button', {name: '오프닝', exact: true}).first().click();
      await page.locator('[data-rotation-mode="opener"]').first().waitFor();
      await wrap.scrollIntoViewIfNeeded();
      const file = `demonhunter-vengeance-${width}-hero-opener.png`;
      await wrap.screenshot({path: path.join(OUT, file)}).catch(() => {});
      r.shots.push({text: '궤멸자 오프닝 탭', found: await wrap.evaluate(el => el.textContent.includes('불지옥 일격으로 진입해도')), file,
        overflow: await wrap.evaluate(el => el.scrollWidth > el.clientWidth + 1)});
      r.docOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      results.push(r);
      await page.close();
    }
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'check.json'), JSON.stringify(results, null, 1));
  for (const r of results) {
    const bad = r.shots.filter(s => !s.found || s.overflow || s.broken);
    console.log(r.id, r.width, `오류 ${r.errors.length}`, `문서 넘침 ${r.docOverflow}`, r.thunderlordLinks != null ? `천둥군주 링크 ${r.thunderlordLinks}` : '', `문제 ${bad.length}`, bad.map(s => s.text.slice(0, 20)).join(' / '));
  }
})().catch(e => { console.error(e); process.exitCode = 1; });
