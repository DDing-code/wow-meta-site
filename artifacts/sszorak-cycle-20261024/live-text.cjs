// 운영 사이트에서 바뀐 문장이 실제로 보이는지 확인: node live-text.cjs <origin>
const {chromium} = require('F:/01_프로젝트/90_개발/wowmeta/node_modules/playwright');
const {loadRegistry} = require('C:/wowmeta/site/artifacts/book-rebuild/lib.cjs');
const CHECKS = [['warrior-arms', '스조라크 신화 상위 로그 8개 중 7개'], ['warlock-demonology', '공포사냥개를 먼저 불렀고'], ['demonhunter-devourer', '풀링 1초 전']];
(async () => {
  const base = process.argv[2];
  const reg = loadRegistry();
  const browser = await chromium.launch();
  let bad = 0;
  for (const [id, text] of CHECKS) {
    const page = await browser.newPage({viewport: {width: 1440, height: 1000}});
    await page.goto(base + reg.find(s => s.id === id).path, {waitUntil: 'networkidle'});
    await page.waitForSelector('[data-book-part]');
    const ok = (await page.evaluate(() => document.body.innerText)).includes(text);
    if (!ok) bad++;
    console.log(id, ok ? '보임' : '안 보임', text);
    await page.close();
  }
  await browser.close();
  process.exitCode = bad ? 1 : 0;
})();
