// /raid 맨 아래 '이 글의 기준과 한계' 접힌 목록을 펼쳐 캡처한다.   사용: node basis-shot.cjs <origin> [출력 폴더]
const path = require('node:path');
const { chromium } = require('F:/01_프로젝트/90_개발/wowmeta/node_modules/playwright');
(async () => {
  const base = process.argv[2]; const OUT = path.join(__dirname, process.argv[3] || 'shots');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  await page.goto(base + '/raid', { waitUntil: 'networkidle' });
  const sum = page.getByText('이 글의 기준과 한계', { exact: false }).first();
  await sum.click(); await page.waitForTimeout(400);
  const li = page.getByText('이 글이 고른 방식', { exact: false }).first();
  await li.evaluate(n => n.scrollIntoView({ block: 'center' })); await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, 'raid-basis-notes.png') });
  await browser.close();
})();
