const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { kbGuidePath, manuscriptFile, replaceManuscript, lit } = require('../book-rebuild/lib.cjs');
const decisions = require('./decisions.json');
const pages = require('./source-review.json').pages;
const extra = require('./kr-extra-final.json');
const fire = require('./kr-fire-additional-bosses.json');
const root = path.resolve(__dirname, '../..');
const scope = '상위 기록은 전체 사용률이나 같은 조건의 성능 비교가 아닙니다. 추천 조건을 검수한 것이며 영웅 특성의 확정 순위를 뜻하지 않습니다.';
for (const [id, d] of Object.entries(decisions)) {
  assert(pages[id].title.includes('12.1.5'), `${id}: current public source missing`);
  assert(d.choice && d.evidence);
  const canonical = kbGuidePath(id).file;
  const m = JSON.parse(fs.readFileSync(canonical, 'utf8'));
  assert.equal(m.patch, '12.1.5');
  m.status = '실전 심화 공략';
  const oldConclusion = m.logReview.heroConclusion.conclusion;
  const conclusion = `${d.choice} ${d.evidence} ${scope}`;
  const chapter = m.blocks.find(b => b.part === 'field');
  assert(chapter?.paragraphs?.length);
  assert(!chapter.paragraphs.includes(d.choice), 'Run this migration once');
  chapter.paragraphs.unshift(d.choice);
  m.logReview.heroConclusion = { ...m.logReview.heroConclusion, checkedAt: '2026-10-19', conclusion, confirmedRanking: false };
  m.sourceStatus = '2026-10-19 · 12.1.5 추천 조건 검수. 레이드·일반 쐐기·고단과 학습 난도를 나눠 견본의 목적을 구분합니다. 자료 간 의견 차이와 관측 기록 한계는 본문에 명시합니다.';
  m.sourceNote = `${m.sourceNote.replace(oldConclusion, '').replace('최신 로그 비교와 전체 세부 검수는 진행 중입니다. ', '').trim()} ${conclusion}`;
  m.evidence.push(`12.1.5 추천 조건 재검수(2026-10-19): ${d.evidence}`);
  if (id === 'druid-feral') m.caveats = m.caveats.map(x => x.replace('한국 레이드 행은 3행뿐입니다.', '당시 한국 님리사 신화는 3행뿐이었으며, 이번에는 다른 신화 네임드의 한국 적용 후 기록을 추가 대조했습니다.'));
  m.caveats.push(scope);
  const source = m.sources.find(s => s.url === pages[id].url);
  const date = pages[id].text.match(/Last Updated:\s*([^\n]+)/)?.[1];
  assert(date, `${id}: source date missing`);
  const fresh = {tier: 'A', label: 'Icy Veins 12.1.5 추천 조건 재검수', url: pages[id].url, updated: `${date} 갱신 / 2026-10-19 브라우저 확인`, note: d.evidence};
  if (source) Object.assign(source, fresh); else m.sources.push(fresh);
  if (extra[id]) m.sources.push({tier: 'S', label: "WCL 한국 12.1.5 Nek'zali 신화 순위", url: extra[id].url, updated: '2026-10-19 브라우저 확인', note: d.evidence});
  if (id === 'mage-fire') {
    m.sources.push({tier: 'S', label: 'WCL 한국 12.1.5 화염 신화 다른 네임드', url: 'https://www.warcraftlogs.com/zone/rankings/53?class=Mage&spec=Fire&region=3&difficulty=5', updated: '2026-10-19 브라우저 확인', note: d.evidence});
    m.sources.push({tier: 'S', label: 'WCL 한국 12.1.5 화염 님리사 영웅 난이도', url: require('./kr-fire-heroic.json').url, updated: '2026-10-19 브라우저 확인', note: '10월 15~18일 서로 다른 한국 플레이어 5명, 성난태양. 신화 난이도 표본과 합산하지 않습니다.'});
  }
  m.logReview.publicationReview = { checkedAt: '2026-10-19', patch: '12.1.5', choice: d.choice, evidence: d.evidence, scope, sourceUrl: pages[id].url };
  const contentFile = path.join(root, 'artifacts/book-rebuild', id, 'content.cjs');
  const content = fs.readFileSync(contentFile, 'utf8');
  const start = content.indexOf("part: 'field'");
  const insert = content.indexOf('paragraphs: [', start) + 'paragraphs: ['.length;
  assert(start > 0 && insert > start, `${id}: content field chapter not found`);
  fs.writeFileSync(contentFile, `${content.slice(0, insert)}\n      ${lit(d.choice, 6)},${content.slice(insert)}`);
  fs.writeFileSync(canonical, JSON.stringify(m, null, 2) + '\n');
  const target = manuscriptFile(id);
  fs.writeFileSync(target, replaceManuscript(fs.readFileSync(target, 'utf8'), id, m));
  console.log(`${id}: 추천 조건·공개 출처·원고·KB 정본 반영`);
}
// 새 표본은 한국 적용 후 기록만 쓰고, 영웅 선택이 화면에 없는 행을 판정하지 않는다.
for (const id of ['druid-feral', 'shaman-enhancement', 'hunter-survival']) {
  const rows = extra[id].rows.filter(r => r.hero);
  assert(rows.length >= 5);
  assert(rows.every(r => /KR/.test(r.realm) && Date.parse(r.startedAt) >= Date.parse('2026-10-15T04:00:00Z')));
}
assert(fire.flatMap(x => x.rows).every(r => r.hero === 'Sunfury'));
console.log('추가 한국 표본의 날짜·지역·영웅 선택 확인 통과');
