const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const {loadRegistry} = require('../book-rebuild/lib.cjs');
const decisions = require('./decisions.json');
const [base = 'http://127.0.0.1:4410', folder = 'choices', ...only] = process.argv.slice(2);
const selected = Object.entries(decisions).filter(([id]) => !only.length || only.includes(id));
assert(selected.length > 0);
const out = path.join(__dirname, folder);
fs.mkdirSync(out, {recursive: true});
(async () => {
  const browser = await chromium.launch();
  const results = [];
  try {
    for (const width of [320,390,1440]) {
      const page = await browser.newPage({viewport: {width, height: width === 1440 ? 1000 : 860}});
      const errors = [];
      page.on('pageerror', e => errors.push(String(e)));
      await page.goto(base + '/guide', {waitUntil: 'networkidle'});
      assert.equal(await page.locator('main section a').count(), 40);
      assert.equal(await page.getByText('공사 중', {exact:true}).count(), 0);
      assert(!(await page.locator('body').innerText()).includes('전환·검수 중'));
      await page.screenshot({path: path.join(out, `list-${width}.png`)});
      for (const [id, d] of selected) {
        const spec = loadRegistry().find(x => x.id === id);
        await page.goto(base + spec.path, {waitUntil: 'networkidle'});
        const p = page.getByText(d.choice.replaceAll('두 분기', '두 선택지'), {exact:true});
        assert.equal(await p.count(), 1, `${id}: new choice paragraph missing or duplicated`);
        await p.scrollIntoViewIfNeeded();
        await p.evaluate(el => window.scrollBy(0, el.getBoundingClientRect().top - 180));
        await page.waitForTimeout(150);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
        assert(!overflow, `${id}/${width}: horizontal overflow`);
        const broken = await page.locator('img').evaluateAll(imgs => imgs.filter(i => i.complete && !i.naturalWidth).length);
        assert.equal(broken, 0, `${id}/${width}: broken image`);
        await page.screenshot({path: path.join(out, `${id}-${width}.png`)});
        results.push({id, width, paragraph: true, overflow, broken, errors: [...errors]});
        assert.equal(errors.length, 0);
        console.log(`${id}/${width}: 추천 문장·아이콘·넘침·오류 통과`);
      }
      await page.close();
    }
  } finally {
    await browser.close();
    fs.writeFileSync(path.join(out, 'check.json'), JSON.stringify(results, null, 2));
  }
})().catch(e => {console.error(e); process.exitCode = 1;});
