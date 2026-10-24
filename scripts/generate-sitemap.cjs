#!/usr/bin/env node
// public/sitemap.xml을 만든다(구글 검색 등록용).
// 주소 목록: src/data/siteMeta.js의 STATIC_PAGES, 가이드 레지스트리의 40개 가이드,
// 레이드 가이드 편(raidGuide.json), 로그 분석 리포트(logReportRegistry.js).
// --check: 파일을 쓰지 않고 지금 목록과 같은지만 검사한다(npm run validate:seo).
const fs = require('fs');
const path = require('path');

const SITE_ROOT = path.resolve(__dirname, '..');
const DATA = path.join(SITE_ROOT, 'src', 'data');
const SITEMAP_PATH = path.join(SITE_ROOT, 'public', 'sitemap.xml');
const ROBOTS_PATH = path.join(SITE_ROOT, 'public', 'robots.txt');

function loadModule(file, names) {
  const source = fs.readFileSync(path.join(DATA, file), 'utf8')
    .replace(/^import .*$/gm, '')
    .replace(/\bexport const\b/g, 'const')
    .replace(/\bexport function\b/g, 'function');
  return new Function(`${source}\nreturn { ${names.join(', ')} };`)();
}

function readSiteMeta() {
  const source = fs.readFileSync(path.join(DATA, 'siteMeta.js'), 'utf8');
  const origin = source.match(/export const SITE_ORIGIN = '([^']+)';/);
  const block = source.match(/const STATIC_PAGES = \{\r?\n([\s\S]*?)\r?\n\};/);
  if (!origin || !block) throw new Error('siteMeta.js: SITE_ORIGIN 또는 STATIC_PAGES를 찾지 못함');
  const staticPaths = [...block[1].matchAll(/^  '(\/[^']*)': \{/gm)].map(match => match[1]);
  return { origin: origin[1], staticPaths };
}

function collectPaths() {
  const { origin, staticPaths } = readSiteMeta();
  const { getAllGuideSpecs } = loadModule('guideRegistry.js', ['getAllGuideSpecs']);
  const { logReports } = loadModule('logReportRegistry.js', ['logReports']);
  const raidGuide = JSON.parse(fs.readFileSync(path.join(DATA, 'raidGuide.json'), 'utf8'));
  const paths = [
    ...staticPaths,
    ...getAllGuideSpecs().map(spec => spec.path),
    ...raidGuide.episodes.map(episode => `/raid/${episode.id}`),
    ...(raidGuide.heroic ? raidGuide.heroic.bosses.map(boss => `/raid/heroic/${boss.id}`) : []),
    ...logReports.map(report => report.path),
  ];
  return { origin, paths: [...new Set(paths)] };
}

function render({ origin, paths }) {
  const urls = paths.map(item => `  <url><loc>${origin}${item}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

const result = collectPaths();
const expected = render(result);

if (process.argv.includes('--check')) {
  const errors = [];
  const current = fs.existsSync(SITEMAP_PATH) ? fs.readFileSync(SITEMAP_PATH, 'utf8') : '';
  if (current.replace(/\r\n/g, '\n') !== expected) {
    errors.push('public/sitemap.xml이 지금 주소 목록과 다릅니다. node scripts/generate-sitemap.cjs 로 다시 만드세요.');
  }
  const robots = fs.existsSync(ROBOTS_PATH) ? fs.readFileSync(ROBOTS_PATH, 'utf8') : '';
  if (!robots.includes(`Sitemap: ${result.origin}/sitemap.xml`)) errors.push('public/robots.txt에 Sitemap 줄이 없습니다.');
  if (/^Disallow:\s*\/\s*$/m.test(robots)) errors.push('public/robots.txt가 사이트 전체를 막고 있습니다.');
  if (errors.length) {
    errors.forEach(message => console.error(`❌ ${message}`));
    process.exit(1);
  }
  console.log(`✅ 사이트맵 ${result.paths.length}개 주소·robots.txt 확인`);
} else {
  fs.writeFileSync(SITEMAP_PATH, expected);
  console.log(`sitemap.xml: ${result.paths.length}개 주소`);
}
