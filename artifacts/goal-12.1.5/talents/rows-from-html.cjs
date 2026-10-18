// 저장된 공개 빌드 페이지 HTML(pages/<key>.html)에서 표의 행(라벨·코드)과 표 머리글을 뽑는다(정규식, 스크립트 실행 없음).
// 사용: node rows-from-html.cjs <key>   또는 require('./rows-from-html.cjs').rows(key)
const fs = require('node:fs');
const path = require('node:path');
const strip = s => s.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
function rows(key) {
  const html = fs.readFileSync(path.join(__dirname, 'pages', key + '.html'), 'utf8');
  const out = [];
  const tableRe = /<table[\s\S]*?<\/table>/g;
  let t;
  while ((t = tableRe.exec(html))) {
    const table = t[0];
    if (!/talent-calc\/blizzard\/|talent-calc\/[a-z-]+\/[a-z-]+\//.test(table) && !/[A-Za-z0-9+/]{80,}/.test(table)) continue;
    const trs = table.match(/<tr[\s\S]*?<\/tr>/g) || [];
    const head = trs.length ? strip(trs[0]) : '';
    // 표 앞 1500자 안의 마지막 제목
    const before = html.slice(Math.max(0, t.index - 4000), t.index);
    const hs = [...before.matchAll(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/g)];
    const heading = hs.length ? strip(hs[hs.length - 1][1]) : '';
    for (const tr of trs) {
      const m = tr.match(/talent-calc\/blizzard\/([A-Za-z0-9+/]{40,})/) || tr.match(/>\s*([A-Za-z0-9+/]{80,})\s*</) || tr.match(/(?:data-clipboard-text|value)="([A-Za-z0-9+/]{80,})"/);
      if (!m) continue;
      out.push({table: head, heading, row: strip(tr), code: m[1]});
    }
  }
  return out;
}
module.exports = {rows};
if (require.main === module) console.log(JSON.stringify(rows(process.argv[2]), null, 1));
