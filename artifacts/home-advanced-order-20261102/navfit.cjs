// 상단 메뉴가 '직업 가이드'로 길어진 뒤 781~1100px에서 줄바꿈·넘침이 없는지 센다. 사용: node navfit.cjs [origin]
const path = require('path');
const { chromium } = require(path.resolve(__dirname, '..', '..', '..', 'node_modules', 'playwright'));
const base = process.argv[2] || 'http://127.0.0.1:3127';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1100, height: 600 } });
  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  const rows = [];
  for (const width of [781, 800, 840, 900, 960, 1024, 1100]) {
    await page.setViewportSize({ width, height: 600 });
    await page.waitForTimeout(200);
    rows.push({ width, ...(await page.evaluate(() => {
      const links = [...document.querySelectorAll('header a, nav a')].filter(a => a.offsetParent && /^(홈|초보자 안내|(?:직업 )?가이드|레이드 가이드|쐐기 가이드|스펠 DB|소식)$/.test(a.textContent.trim()));
      const tops = new Set(links.map(a => Math.round(a.getBoundingClientRect().top)));
      const right = Math.max(...links.map(a => a.getBoundingClientRect().right));
      return { links: links.length, rows: tops.size, wrapped: links.filter(a => a.getBoundingClientRect().height > 44).length, rightEdge: Math.round(right), overflow: document.documentElement.scrollWidth - innerWidth };
    })) });
  }
  console.log(JSON.stringify(rows));
  if (rows[0].links) await page.setViewportSize({ width: 800, height: 120 }), await page.screenshot({ path: path.join(__dirname, process.env.SHOTS_DIR || 'shots', 'nav-800.png') });
  await browser.close();
})();
