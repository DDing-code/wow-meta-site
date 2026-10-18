// 필요한 주문만 하나씩 nether 한국어 툴팁 확인 (일괄 수집기 아님)
const { chromium } = require('F:/01_프로젝트/90_개발/wowmeta/node_modules/playwright');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ userAgent: UA, locale: 'ko-KR' })).newPage();
  const out = {};
  for (const id of process.argv.slice(2)) {
    const r = await p.goto(`https://nether.wowhead.com/tooltip/spell/${id}?locale=1`, { waitUntil: 'domcontentloaded' });
    const raw = await p.evaluate(() => document.body.innerText);
    let j; try { j = JSON.parse(raw); } catch { j = { raw: raw.slice(0, 300) }; }
    const txt = s => (s || '').replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/[ \t]+/g, ' ').replace(/\n\s+/g, '\n').trim();
    out[id] = { status: r.status(), name: j.name, icon: j.icon, tooltip: txt(j.tooltip), buff: txt(j.buff) };
    console.log(`=== ${id} [${r.status()}] ${j.name} (${j.icon})\n${out[id].tooltip}\n`);
  }
  require('fs').writeFileSync(`tooltips-${Date.now()}.json`, JSON.stringify(out, null, 2));
  await b.close();
})();
