// 프리풀(풀 전 준비) 확인용: Icy Veins 딜사이클 페이지와 Method 플레이스타일 페이지를 받아 오프닝·프리풀 부분 글만 남긴다.
// 원본 HTML: sources/<가이드 ID>-icy.html · -method.html, 발췌: sources/<가이드 ID>.txt
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const SLUG = {
  'warrior-arms': 'arms-warrior', 'warrior-fury': 'fury-warrior', 'paladin-retribution': 'retribution-paladin',
  'rogue-assassination': 'assassination-rogue', 'rogue-outlaw': 'outlaw-rogue', 'rogue-subtlety': 'subtlety-rogue',
  'deathknight-frost': 'frost-death-knight', 'deathknight-unholy': 'unholy-death-knight', 'monk-windwalker': 'windwalker-monk',
  'druid-feral': 'feral-druid', 'demonhunter-havoc': 'havoc-demon-hunter', 'shaman-enhancement': 'enhancement-shaman',
  'hunter-survival': 'survival-hunter', 'hunter-beastmastery': 'beast-mastery-hunter', 'hunter-marksmanship': 'marksmanship-hunter',
  'priest-shadow': 'shadow-priest', 'demonhunter-devourer': 'devourer-demon-hunter', 'shaman-elemental': 'elemental-shaman',
  'mage-arcane': 'arcane-mage', 'mage-fire': 'fire-mage', 'mage-frost': 'frost-mage', 'warlock-affliction': 'affliction-warlock',
  'warlock-demonology': 'demonology-warlock', 'warlock-destruction': 'destruction-warlock', 'druid-balance': 'balance-druid',
  'evoker-devastation': 'devastation-evoker', 'evoker-augmentation': 'augmentation-evoker',
};
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
const dir = path.join(__dirname, 'sources');
function get(url, file) {
  if (!fs.existsSync(file) || fs.statSync(file).size < 20000) execFileSync('curl', ['-s', '-L', '-A', UA, '-o', file, url]);
  return fs.readFileSync(file, 'utf8');
}
function text(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<(br|\/p|\/li|\/h\d|\/div|\/tr)[^>]*>/gi, '\n').replace(/<li[^>]*>/gi, '\n- ').replace(/<h(\d)[^>]*>/gi, '\n## ')
    .replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, "'").replace(/&quot;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<')
    .replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n').trim();
}
function excerpt(t) {
  const lines = t.split('\n');
  const keep = new Set();
  lines.forEach((l, i) => {
    if (/opener|pre-?pull|precombat|pre-?cast|before the pull|prepull|seconds? before/i.test(l)) for (let k = i - 2; k <= i + 25; k++) if (k >= 0 && k < lines.length) keep.add(k);
  });
  const out = [];
  let last = -2;
  for (const i of [...keep].sort((a, b) => a - b)) { if (i !== last + 1) out.push('…'); out.push(lines[i]); last = i; }
  return out.join('\n').slice(0, 14000);
}
for (const [id, slug] of Object.entries(SLUG)) {
  const role = /devastation|augmentation|evoker/.test(slug) || true ? 'dps' : 'dps';
  const icyUrl = `https://www.icy-veins.com/wow/${slug}-pve-${role}-rotation-cooldowns-abilities`;
  const methodUrl = `https://www.method.gg/guides/${slug}/playstyle-and-rotation`;
  const parts = [];
  for (const [name, url] of [['icy', icyUrl], ['method', methodUrl]]) {
    try {
      const html = get(url, path.join(dir, `${id}-${name}.html`));
      const title = (html.match(/<title>([^<]*)<\/title>/i) || [])[1] || '';
      const upd = (html.match(/(Last updated|Updated)[^<]{0,60}/i) || [])[0] || '';
      parts.push(`# ${name} ${url}\n제목: ${title.trim()}\n${upd}\n${excerpt(text(html))}`);
    } catch (e) { parts.push(`# ${name} ${url}\n받기 실패: ${e.message}`); }
  }
  fs.writeFileSync(path.join(dir, id + '.txt'), parts.join('\n\n'));
  console.log(id, parts.map(p => p.length).join('/'));
}
