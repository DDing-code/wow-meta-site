// 한 주문의 nether 한국어 툴팁을 Playwright(일반 Chrome UA)로 열어 글자로 보여 준다. 사용: node tip.cjs <spellId>
const { chromium } = require('F:/01_프로젝트/90_개발/wowmeta/node_modules/playwright');
(async () => {
  const id = process.argv[2];
  const browser = await chromium.launch();
  const page = await browser.newPage({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36' });
  const res = await page.goto(`https://nether.wowhead.com/tooltip/spell/${id}?locale=${process.argv[3]||1}`, { waitUntil: 'domcontentloaded' });
  const body = await page.evaluate(() => document.body.innerText);
  let data; try { data = JSON.parse(body); } catch { console.log(res.status(), body.slice(0, 500)); await browser.close(); return; }
  await page.setContent(`<div id=t>${data.tooltip || ''}</div><hr><div id=b>${data.buff || ''}</div>`);
  const t = await page.evaluate(() => document.getElementById('t').innerText);
  const b = await page.evaluate(() => document.getElementById('b').innerText);
  console.log(`[${id}] ${data.name} (icon ${data.icon})\n${t}${b.trim() ? `\n--- 효과 ---\n${b}` : ''}`);
  await browser.close();
})();
