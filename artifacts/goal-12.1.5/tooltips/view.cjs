// 12.1.5 확인용: 지정한 주문 한두 개의 한국어 툴팁(nether)을 Playwright로 열어 본다. 일괄 수집용이 아님.
const { chromium } = require('F:/01_프로젝트/90_개발/wowmeta/node_modules/playwright');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ userAgent: UA });
  for (const id of process.argv.slice(2)) {
    await p.goto(`https://nether.wowhead.com/tooltip/spell/${id}?locale=1`);
    const j = JSON.parse(await p.innerText('body'));
    console.log(id, j.name, '|', j.tooltip.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  }
  await b.close();
})();
