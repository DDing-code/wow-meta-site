// 탱커·힐러 영상 연결과 소식 탭 확인: node shots.cjs <주소> [출력 폴더]
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const assert = require('assert/strict');
const manifest = require('F:/01_프로젝트/90_개발/ai-hub/workspace/outputs/pixel-guides/youtube-manifest.json').slice(27);
const origin = process.argv[2] || 'http://localhost:3571';
const out = path.join(__dirname, process.argv[3] || 'shots');
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  for (const item of manifest) {
    const [cls, spec] = item.id.split('-');
    await page.goto(`${origin}/guide/${cls}/${spec}`, { waitUntil: 'networkidle' });
    const src = await page.locator('#guide-video iframe').getAttribute('src');
    assert.ok(src.includes(`/embed/${item.youtubeId}`), `${item.id} 영상 ${src}`);
    const title = await page.locator('#guide-video strong').textContent();
    assert.equal(title, item.title);
    if (['warrior-protection', 'priest-discipline'].includes(item.id)) {
      await page.waitForTimeout(1500);
      await page.locator('#guide-video').screenshot({ path: path.join(out, `${item.id}-1440-video.png`) });
    }
    console.log('영상 연결', item.id, item.youtubeId);
  }
  for (const [width, height] of [[1440, 900], [390, 844]]) {
    const p = await browser.newPage({ viewport: { width, height } });
    await p.goto(`${origin}/news`, { waitUntil: 'networkidle' });
    const first = await p.locator('article h2').first().textContent();
    assert.equal(first, '탱커·힐러 13개 가이드에 공략 영상 연결');
    const overflow = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    assert.ok(overflow <= 0, `가로 넘침 ${overflow}`);
    await p.screenshot({ path: path.join(out, `news-${width}-top.png`) });
    await p.screenshot({ path: path.join(out, `news-${width}-full.png`), fullPage: true });
    await p.click('article >> nth=1 >> a:has-text("레이드 가이드")');
    await p.waitForURL(/\/raid/);
    console.log('소식', width, '첫 글', first, '레이드 연결', p.url());
    await p.close();
  }
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
