#!/usr/bin/env node
// 2026-10-23 사용자 지시 "출처는 인벤은 적지 말고 상위 공대 이름만 적어"를 레이드 가이드 정본(KB raid-guide.json)에 반영한다.
// - 인벤 글 출처 17개(inven-* 16개 + kithix-kr)를 출처 목록과 네임드별 '근거'에서 뺀다.
// - 그 출처를 가리키던 팁은 source 칸을 지운다(팁 출처는 화면에 보이지 않고, 그랄 영상 시각만 보인다).
// - 화면 글에서 인벤과 글쓴이 닉네임을 빼고, 이미 근거가 있는 상위 공대 이름(Method·MATE 등)만 남긴다.
//   인벤 글에는 글쓴이 공대 이름이 없어 공대 이름으로 바꾸지 않는다(지어내지 않음).
const fs = require('node:fs');
const path = require('node:path');

const FILE = path.resolve(__dirname, '..', '..', '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base', '00-공통', '공용', 'Meta', 'raid-guide.json');
const guide = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const bosses = guide.episodes.flatMap(e => e.bosses);
const boss = id => bosses.find(b => b.id === id);
const choice = (id, title) => { const c = boss(id).choices.find(x => x.title === title); if (!c) throw new Error(`${id}: choice ${title}`); return c; };
const swap = (obj, field, from, to) => {
  if (!obj[field].includes(from)) throw new Error(`not found in ${field}: ${from}`);
  obj[field] = obj[field].replace(from, to);
};

const dropped = Object.keys(guide.sources).filter(key => key.startsWith('inven-') || key === 'kithix-kr');
if (!dropped.length) throw new Error('already applied');
for (const key of dropped) delete guide.sources[key];
let untied = 0;
for (const b of bosses) {
  b.sources = b.sources.filter(key => !dropped.includes(key));
  for (const tip of b.tips) if (dropped.includes(tip.source)) { delete tip.source; untied++; }
}

swap(choice('kithix', '공격 쿨기 시점'), 'alt', '국내 실전 공략 두 곳(이당이당, 레키엘)은 초반에 쓰는 안을 택했습니다.', '초반에 쓰는 안도 있습니다.');
swap(choice('nekzali', '우물 조를 줄이는 운영'), 'alt', '사라지기 때문입니다(인벤 레키엘 공략 9월 29일 보충).', '사라지기 때문입니다.');
swap(choice('explorers', '물고기 강화 순서'), 'alt', ' 인벤 신화 팁 글과 NSRT 시간표(1분 게보·3분 이쿠·5분 나마)도 게보 → 이쿠 → 나마를 씁니다.', '');
swap(choice('explorers', '게보만 광폭시키는 쉬운 공략'), 'alt', '물고기는 먹입니다(인벤 동그란기린 공략).', '물고기는 먹입니다.');
swap(choice('vashnik', '셋째 불 쫄 추방'), 'alt', '사망자가 나온다는 답도 있습니다(인벤 질문 글 댓글).', '사망자가 나온다는 실전 의견도 있습니다.');
swap(choice('coiled-altar', '두 번째 단두대 도발'), 'alt', '인벤 실전 공략(10월 14일 완화 뒤 킬)은 딜이 모자라던 때의 방식이라 이제는 하지 않아도 된다고 씁니다.', '완화 뒤에는 딜이 모자라던 때의 방식이라며 도발 없이 잡는 공대도 있습니다.');
swap(choice('ulatek', '송곳니 해제'), 'alt', ' 인벤 킬 공대 두 곳(애기트럴·Lucide)도 완화 뒤에는 6개 동시로 끊어도 사고가 거의 없었다고 씁니다.', ' 완화 뒤에는 6개 동시로 끊어도 사고가 거의 없었다는 킬 공대도 있습니다.');
swap(choice('ulatek', '남쪽 방 알 순서'), 'why', '인벤 실전 공략은 두 방식 모두 많이 쓰인다고 씁니다.', '두 방식 모두 쓰입니다.');
swap(choice('ulatek', '첫 번째 흡수 담당'), 'picked', '집중할 수 있습니다(인벤 애기트럴 공략).', '집중할 수 있습니다.');
swap(choice('ulatek', '첫 번째 흡수 담당'), 'alt', '회복 부담이 줄어듭니다(인벤 Lucide 공략).', '회복 부담이 줄어듭니다.');

const noteAt = guide.page.notes.findIndex(n => n.startsWith('인벤 레이드 게시판'));
if (noteAt < 0) throw new Error('page note');
guide.page.notes[noteAt] = '신화 킬 공대들의 실전 글(10월 21일 글까지)은 여러 글이 같은 말을 하는 부분만 역할별 실전 팁에 보충했습니다. 공대마다 갈리는 방식은 ‘갈리는 택틱’에 적었으니 참고로만 보세요.';
const basisAt = guide.basisNotes.findIndex(n => n.startsWith('인벤 레이드 게시판'));
if (basisAt < 0) throw new Error('basis note');
guide.basisNotes[basisAt] = '신화 실전 글 50여 건(8월 25일~10월 21일)을 댓글까지 읽고 비교했습니다. 서로 다른 글쓴이 둘 이상이 같은 말을 하고 반대 의견이 없는 내용만 팁에 넣었고, 한 공대의 배정·직업 구성이나 갈리는 택틱은 ‘갈리는 택틱’에 참고로만 남겼습니다. 한 글에만 나오거나 지금도 되는지 확인되지 않은 내용은 넣지 않았습니다. 출처에는 상위 공대와 공개 공략 이름만 적습니다.';

const text = JSON.stringify(guide);
for (const word of ['인벤', 'inven', '이당이당', '레키엘', '애기트럴', 'Lucide', '동그란기린', '극려', '열반']) {
  if (text.includes(word)) throw new Error(`left: ${word}`);
}
fs.writeFileSync(FILE, JSON.stringify(guide, null, 2) + '\n');
console.log(`dropped ${dropped.length} sources, untied ${untied} tips, ${Object.keys(guide.sources).length} sources left`);
