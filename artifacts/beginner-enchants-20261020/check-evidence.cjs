// KB에 넣은 마법부여 묶음의 이름·아이콘·효과 수치를 Wowhead 한국어 툴팁(nether, locale=1)과 대조하고 원문을 item-evidence.json에 남긴다.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const kb = require(path.resolve(__dirname, '../../../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/00-공통/공용/Meta/beginner-consumables.json'));
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
const items = kb.groups.filter(g => g.id.startsWith('enchants-')).flatMap(g => g.items.map(i => ({ ...i, group: g.id })));
const out = []; const problems = [];
for (const it of items) {
  const j = JSON.parse(execFileSync('curl', ['-s', '-A', UA, `https://nether.wowhead.com/tooltip/item/${it.id}?locale=1`], { encoding: 'utf8' }));
  const text = j.tooltip.replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
  const use = (text.match(/사용 효과: ([^\n]*)/) || [])[1] || '';
  if (j.name !== it.name) problems.push(`${it.id} 이름 ${j.name} ≠ ${it.name}`);
  if (j.icon !== it.icon) problems.push(`${it.id} 아이콘 ${j.icon} ≠ ${it.icon}`);
  for (const n of it.effect.match(/\d+%?/g) || []) {
    if (!new RegExp(`(?<![\d.])${n.replace('%', '%?')}(?!\d)`).test(use)) problems.push(`${it.id} 효과 수치 ${n} 이 툴팁에 없음: ${use}`);
  }
  out.push({ id: it.id, group: it.group, name: j.name, icon: j.icon, effect: it.effect, tooltipUse: use.trim(), url: it.source });
}
fs.writeFileSync(path.join(__dirname, 'item-evidence.json'), JSON.stringify({ verifiedAt: new Date().toISOString().slice(0, 10), method: 'Wowhead 한국어 툴팁(nether.wowhead.com/tooltip/item/<id>?locale=1) 대조 · 목록은 사용자 크롬에서 Wowhead 한국어 아이템 검색(한밤 확장팩)으로 확인', items: out }, null, 2) + '\n');
console.log(items.length, '개 대조,', problems.length ? '문제:\n' + problems.join('\n') : '문제 없음');
process.exitCode = problems.length ? 1 : 0;
