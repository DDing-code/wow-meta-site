const fs = require('node:fs');
const assert = require('node:assert/strict');
const {act,viewport,shot} = require('./oddin.cjs');
const base = process.argv[2] || 'http://127.0.0.1:4178';
const prefix = new URL(base).hostname === '127.0.0.1' ? 'local' : 'public';
const expectedBundle = require('./build-proof.json').bundle;
const results = [];
(async()=>{
  for (const width of [320,390,1440]) {
    for (const route of ['/news','/guide','/guide/deathknight/unholy']) {
      await act('open',{url:base+route,chrome:false});
      await viewport(width);
      await act('eval',{expression:'document.fonts.ready'});
      const data = (await act('eval',{expression:`({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,text:document.querySelector('main').innerText,commits:[...document.querySelectorAll('[aria-label="Git 변경 근거"] a')].slice(0,2).map(a=>a.href),cards:document.querySelectorAll('main section a').length,partial:document.querySelectorAll('main [aria-label="12.1 전환 중 · 전체 검수 진행 중"]').length,bundle:[...document.scripts].find(s=>s.src.includes('/static/js/main.'))?.src})`})).value;
      assert.equal(data.width,width);
      assert.equal(data.overflow,false);
      assert(data.bundle.endsWith(expectedBundle));
      if(route==='/news') {
        assert(data.text.startsWith('업데이트'));
        assert(data.text.includes('수치 차이 3건을 해결했습니다.'));
        assert.equal(data.commits.length,2);
        assert(data.commits.every(u=>u.endsWith('/df833379')));
        assert(data.text.indexOf('2026-10-10') < data.text.indexOf('2026-10-08'));
      } else if(route==='/guide') {
        assert.equal(data.cards,40);
        assert.equal(data.partial,36);
      } else {
        assert(data.text.includes('GIT 반영\n2026-10-10'));
        assert(data.text.includes('전체 검수 진행 중'));
      }
      delete data.text;
      const screenshot = await shot(`${prefix}-${route.split('/').filter(Boolean).join('-')}-${width}-metadata`);
      results.push({route,...data,screenshot});
      fs.writeFileSync(`${__dirname}/${prefix}-metadata.json`,JSON.stringify(results,null,2));
      console.log(`${width}px ${route} 날짜·상태 통과`);
    }
  }
  assert.equal(results.length,9);
  await act('close');
  process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});
