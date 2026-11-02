// 특성 ↔ 스킬 연결 도식 화면 확인(2026-11-02, 8개 가이드): 1440·390px 에서 연결선·붙는 스킬 아이콘·타임라인 특성 칸을 세고,
// 첫 연결 흐름도·마우스를 올린 강조 상태·첫 타임라인을 찍는다. 오류·가로 넘침·깨진 아이콘이 있으면 실패.
// 사용: node artifacts/talent-links-20261102/shots.cjs [origin=http://127.0.0.1:4420]   (SHOTS_DIR=live 로 운영 결과를 따로 저장)
const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '..', '..', '..', 'node_modules', 'playwright'));
const base = process.argv[2] || 'http://127.0.0.1:4420';
const out = path.join(__dirname, process.env.SHOTS_DIR || 'shots');
fs.mkdirSync(out, { recursive: true });
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';
const GUIDES = {
  'warrior-fury': '/guide/warrior/fury',
  'warrior-protection': '/guide/warrior/protection',
  'paladin-holy': '/guide/paladin/holy',
  'paladin-protection': '/guide/paladin/protection',
  'paladin-retribution': '/guide/paladin/retribution',
  'hunter-beastmastery': '/guide/hunter/beast-mastery',
  'hunter-marksmanship': '/guide/hunter/marksmanship',
  'hunter-survival': '/guide/hunter/survival',
  'rogue-assassination': '/guide/rogue/assassination',
  'rogue-outlaw': '/guide/rogue/outlaw',
  'rogue-subtlety': '/guide/rogue/subtlety',
  'priest-discipline': '/guide/priest/discipline',
  'priest-holy': '/guide/priest/holy',
  'priest-shadow': '/guide/priest/shadow',
  'deathknight-frost': '/guide/deathknight/frost',
  'deathknight-unholy': '/guide/deathknight/unholy',
  'deathknight-blood': '/guide/deathknight/blood',
  'shaman-elemental': '/guide/shaman/elemental',
  'shaman-enhancement': '/guide/shaman/enhancement',
  'shaman-restoration': '/guide/shaman/restoration',
  'mage-arcane': '/guide/mage/arcane',
  'mage-fire': '/guide/mage/fire',
  'mage-frost': '/guide/mage/frost',
};
const only = process.argv.slice(3);
(async () => {
  const browser = await chromium.launch();
  const results = [];
  for (const [id, route] of Object.entries(GUIDES)) {
    if (only.length && !only.includes(id)) continue;
    for (const width of [1440, 390]) {
      const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 1000 : 860 }, userAgent: UA, deviceScaleFactor: 1 });
      const errors = [];
      page.on('pageerror', error => errors.push(String(error)));
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
      await page.waitForSelector('[data-book-box="diagram"]');
      await page.waitForTimeout(800);
      const info = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        diagrams: document.querySelectorAll('[data-book-box="diagram"]').length,
        diagramsWithLinks: [...document.querySelectorAll('[data-book-box="diagram"]')].filter(el => el.querySelector('[data-diagram-links]')).length,
        linkPaths: document.querySelectorAll('[data-diagram-link] path').length,
        affectIcons: document.querySelectorAll('[aria-label="붙는 스킬"] a[data-wowhead]').length,
        talentCells: document.querySelectorAll('[data-timeline-talents]').length,
        talentIcons: document.querySelectorAll('[data-timeline-talents] a[data-wowhead]').length,
        brokenIcons: [...document.querySelectorAll('[data-book-box] img')].filter(img => img.complete && img.naturalWidth === 0).length,
      }));
      const r = { id, width, ...info, errors, files: [] };
      const shot = async (loc, name) => {
        await loc.scrollIntoViewIfNeeded(); await page.waitForTimeout(300);
        const file = path.join(out, `${id}-${width}-${name}.png`);
        await loc.screenshot({ path: file }); r.files.push(file);
      };
      const diagram = page.locator('[data-book-box="diagram"]:has([aria-label="붙는 스킬"])').first();
      await shot(diagram, 'diagram');
      if (width === 1440) {
        const talent = diagram.locator('[data-diagram-key]').filter({ has: page.locator('[aria-label="붙는 스킬"]') }).first();
        await talent.hover(); await page.waitForTimeout(250);
        r.hover = await page.evaluate(() => ({
          active: document.querySelectorAll('[data-diagram-active]').length,
          related: document.querySelectorAll('[data-diagram-related]').length,
          activeLinks: document.querySelectorAll('[data-diagram-link-active]').length,
        }));
        await shot(diagram, 'diagram-hover');
        await page.mouse.move(0, 0);
      }
      await shot(page.locator('[data-book-box="timeline"]:has([data-timeline-talents])').first(), 'timeline');
      r.ok = !errors.length && !info.overflow && !info.brokenIcons && info.affectIcons > 0 && info.talentIcons > 0 && (width !== 1440 || info.linkPaths > 0);
      results.push(r);
      await page.close();
    }
  }
  await browser.close();
  fs.writeFileSync(path.join(out, 'check.json'), JSON.stringify(results, null, 2));
  console.log(results.map(r => `${r.ok ? '통과' : '실패'} ${r.id} ${r.width} 선 ${r.linkPaths} 붙는스킬 ${r.affectIcons} 특성칸 ${r.talentIcons}${r.hover ? ` 강조 ${r.hover.related}/${r.hover.activeLinks}` : ''}${r.errors.length ? ' 오류 ' + r.errors.length : ''}`).join('\n'));
  if (!results.every(r => r.ok)) process.exit(1);
})();
