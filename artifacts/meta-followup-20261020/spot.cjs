// 특정 문구가 들어간 영역을 찾아 찍는다. 사용: node spot.cjs <origin> <가이드 ID> <폭> <파일 이름> <문구> [탭 이름...]
// 탭 이름을 주면 문구 영역을 찾기 전에 그 버튼들을 차례로 누른다(예: 영웅 특성 탭 → 모드 탭).
const path = require('node:path');
const {chromium} = require('F:/01_프로젝트/90_개발/wowmeta/node_modules/playwright');
const {loadRegistry} = require('C:/wowmeta/site/artifacts/book-rebuild/lib.cjs');
const [base, id, width, name, text, ...tabs] = process.argv.slice(2);
(async () => {
  const spec = loadRegistry().find(s => s.id === id);
  const browser = await chromium.launch();
  const page = await browser.newPage({viewport: {width: Number(width), height: 1000}});
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(base + spec.path, {waitUntil: 'networkidle'});
  for (const t of tabs) { await page.getByRole('button', {name: t, exact: true}).first().click(); await page.waitForTimeout(400); }
  const el = page.getByText(text, {exact: false}).first();
  await el.scrollIntoViewIfNeeded();
  const box = await el.evaluateHandle(n => n.closest('section, article, figure, [class*="diagram"], [class*="Timeline"], [class*="timeline"], [class*="talent"], [class*="Talent"]') || n.parentElement);
  await box.asElement().screenshot({path: path.join(__dirname, 'shots', name + '.png')});
  const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(name, '가로 넘침', over, '오류', errors.length);
  await browser.close();
})();
