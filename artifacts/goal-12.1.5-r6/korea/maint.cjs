// 한국 블리자드 고객지원 '서버 정기 점검' 공지를 일반 Chrome 사용자 에이전트로 열어 본문을 저장한다.
const fs = require('fs'); const path = require('path');
const { chromium } = require('F:/01_프로젝트/90_개발/wowmeta/node_modules/playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', locale: 'ko-KR' });
  const url = 'https://kr.support.blizzard.com/ko/help/article/000358479';
  const res = await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(2000);
  const text = await p.evaluate(() => document.body.innerText);
  fs.writeFileSync(path.join(__dirname, 'maintenance-ko.txt'), `${url}\nHTTP ${res.status()} · ${new Date().toISOString()}\n\n${text}`);
  console.log(res.status(), text.length); await b.close();
})();
