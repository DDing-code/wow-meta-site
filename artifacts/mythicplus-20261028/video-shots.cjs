// 영상 칸 눈 확인: 던전 머리 아래 영상 칸(유튜브 iframe·장면 단추), 풀링 카드의 '영상 M:SS' 단추, 네임드의 '영상에서 보기' 단추를 찍고,
// 장면 단추를 누르면 iframe 주소에 start= 가 붙는지 검사한다. 사용: TEST_ORIGIN=https://wowmeta.vercel.app node artifacts/mythicplus-20261028/video-shots.cjs [출력 폴더=live-video]
const path = require('node:path');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const ORIGIN = process.env.TEST_ORIGIN || 'http://127.0.0.1:4428';
const OUT = path.join(__dirname, process.argv[2] || 'live-video');
const guide = require('../../src/data/mythicPlusGuide.json');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const report = [];
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    for (const id of ['altar-of-fangs', 'ruby-life-pools']) {
      const dungeon = guide.dungeons.find(d => d.id === id);
      await page.goto(`${ORIGIN}/mythicplus/${id}`, { waitUntil: 'networkidle' });
      const facts = await page.evaluate(() => ({
        video: document.querySelector('[data-video]')?.getAttribute('data-video'),
        iframe: document.querySelector('[data-video] iframe')?.getAttribute('src'),
        chapters: document.querySelectorAll('[data-video] [data-video-second]').length,
        pullButtons: document.querySelectorAll('[data-pull] [data-video-second]').length,
        bossButtons: document.querySelectorAll('section[data-boss] [data-video-second]').length,
        watch: document.querySelector('[data-video] a[href^="https://www.youtube.com/watch"]')?.getAttribute('href'),
        overflow: document.documentElement.scrollWidth > window.innerWidth,
      }));
      assert.equal(facts.video, dungeon.video.youtubeId, `${id}: video id`);
      assert.ok(facts.iframe.startsWith(`https://www.youtube.com/embed/${dungeon.video.youtubeId}`), `${id}: iframe`);
      assert.equal(facts.chapters, dungeon.video.chapters.length, `${id}: chapters`);
      assert.equal(facts.pullButtons, dungeon.pulls.filter(p => p.videoSecond != null).length, `${id}: pull buttons`);
      assert.equal(facts.bossButtons, dungeon.bosses.filter(b => b.videoSecond != null).length, `${id}: boss buttons`);
      assert.equal(facts.watch, `https://www.youtube.com/watch?v=${dungeon.video.youtubeId}`, `${id}: watch link`);
      assert.ok(!facts.overflow, `${id}: overflow`);
      const panel = page.locator('[data-video]').first();
      await panel.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1500);
      await panel.screenshot({ path: path.join(OUT, `${w}-${id}-video.png`) });
      // 장면 단추(세 번째: 풀링 1부터)를 누르면 그 시각부터 재생하는 주소로 바뀐다.
      const chapter = dungeon.video.chapters[2];
      await page.locator(`[data-video] [data-video-second="${chapter.second}"]`).first().click();
      await page.waitForTimeout(800);
      const after = await page.evaluate(() => document.querySelector('[data-video] iframe')?.getAttribute('src'));
      assert.ok(after.includes(`start=${chapter.second}`) && after.includes('autoplay=1'), `${id}: chapter jump → ${after}`);
      await panel.screenshot({ path: path.join(OUT, `${w}-${id}-video-jump.png`) });
      // 풀링 카드와 첫 네임드의 영상 단추
      const pull = page.locator('[data-pull="1"]').first();
      await pull.scrollIntoViewIfNeeded(); await page.waitForTimeout(300);
      await pull.screenshot({ path: path.join(OUT, `${w}-${id}-pull1-button.png`) });
      const boss = page.locator('section[data-boss]').first();
      await boss.scrollIntoViewIfNeeded(); await page.waitForTimeout(300);
      await boss.screenshot({ path: path.join(OUT, `${w}-${id}-boss-button.png`) });
      const bossSecond = dungeon.bosses.find(b => b.videoSecond != null);
      await page.locator(`section[data-boss] [data-video-second="${bossSecond.videoSecond}"]`).first().click();
      await page.waitForTimeout(800);
      const jumped = await page.evaluate(() => document.querySelector('[data-video] iframe')?.getAttribute('src'));
      assert.ok(jumped.includes(`start=${bossSecond.videoSecond}`), `${id}: boss jump → ${jumped}`);
      report.push({ w, id, ...facts, chapterJump: after, bossJump: jumped });
    }
    if (errors.length) report.push({ w, errors });
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 1));
  const bad = report.filter(r => r.errors);
  console.log(bad.length ? `문제 ${bad.length}건` : '문제 0건');
  process.exit(bad.length ? 1 : 0);
})();
