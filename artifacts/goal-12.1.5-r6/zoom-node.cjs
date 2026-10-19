// 타임라인에서 특정 글이 든 노드 주변을 확대 캡처한다. 사용: node zoom-node.cjs <origin> <경로> <폭> <글> <파일>
const path = require('path');
const { chromium } = require(path.resolve(__dirname, '..', '..', '..', 'node_modules', 'playwright'));
const [base, route, width, text, file] = process.argv.slice(2);
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: Number(width), height: 860 }, deviceScaleFactor: 2 });
  await page.goto(base + route, { waitUntil: 'networkidle' });
  const node = page.locator('[data-timeline-node]').filter({ hasText: text }).first();
  await node.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const row = node.locator('xpath=ancestor::ol[1]');
  await row.screenshot({ path: file });
  console.log(await node.evaluate(n => n.outerHTML.length));
  await browser.close();
})();
