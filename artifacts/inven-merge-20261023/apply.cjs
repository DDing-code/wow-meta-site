#!/usr/bin/env node
// 2026-10-23 인벤 레이드 게시판 신화 글 비교 결과를 레이드 가이드 정본(KB raid-guide.json)에 넣는다.
// 기준: 서로 다른 글쓴이 둘 이상이 같은 말을 하고 반대 의견이 없는 것만 '역할별 실전 팁'에 보충한다.
//       공대마다 갈리는 방식은 '갈리는 택틱'에 참고로만 적는다(이 글이 정하지 않은 갈림은 open: true).
// 한 번만 돌린다(이미 넣은 팁이 있으면 멈춘다).
const fs = require('node:fs');
const path = require('node:path');

const FILE = path.resolve(__dirname, '..', '..', '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base', '00-공통', '공용', 'Meta', 'raid-guide.json');
const guide = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const boss = id => guide.episodes.flatMap(e => e.bosses).find(b => b.id === id);
const INVEN = id => `https://www.inven.co.kr/board/wow/2081/${id}`;

if (guide.sources['inven-altar']) throw new Error('already applied');

Object.assign(guide.sources, {
  'inven-kithix': { title: '레키엘 · 키식스 패턴 설명(인벤)', href: INVEN(231702), note: '2026-10-03 · 10월 13일 보충 글(231821) 포함. 마지막 구간 피해 증가가 끝까지 이어져 초반 쿨기를 권하는 국내 의견' },
  'inven-nekzali': { title: '레키엘 · 네크잘리 신화 공략(인벤)', href: INVEN(231113), note: '2026-08-25 작성, 9월 29일 보충 · 해제는 가장 바깥, 장비가 좋은 공대의 우물 조 운영. 댓글의 실전 보충도 함께 봄' },
  'inven-sentinels': { title: '인벤 질문 글 · 파수꾼 신화 두 대상 딜', href: INVEN(231545), note: '2026-09-20 · 두 네임드 함께 치기와 같이 맞기에서 빼는 인원(답 여러 건 일치). 9월 29일 글(231648)도 같은 답' },
  'inven-explorers': { title: '동그란기린 · 길 잃은 탐험가 게보 광폭 공략(인벤)', href: INVEN(231594), note: '2026-09-23(9월 7일 첫 글 231321의 수정본) · 공대마다 갈리는 쉬운 공략. 넉백 주기는 10월 6일 글(231728) 답으로 확인' },
  'inven-explorers-tip': { title: '극려 · 길 잃은 탐험가 신화 팁(인벤)', href: INVEN(231129), note: '2026-08-26 · 물고기 순서 게보 → 이쿠 → 나마. 8월 26일 질문 글(231136)의 NSRT 시간표 답도 같은 순서' },
  'inven-vashnik': { title: '인벤 질문 글 · 바쉬니크 추방이 꼭 필요한가', href: INVEN(231612), note: '2026-09-25 · 핵심은 불 쫄을 동시에 죽이지 않는 것(답 여러 건 일치). 추방 여부는 공대 화력에 따라 갈림' },
  'inven-vashnik-heal': { title: '인벤 질문 글 · 바쉬니크 신화 힐러 5명', href: INVEN(231328), note: '2026-09-08 · 딜보다 회복 부담이 큰 네임드라는 답 두 건' },
  'inven-sszorak': { title: '인벤 질문 글 · 신화 스조라크 바람 상쇄', href: INVEN(231334), note: '2026-09-08 · 직각으로 만나도 선만 닿으면 상쇄된다는 답 여러 건, 성기사 구출 담당' },
  'inven-sszorak-2': { title: '인벤 질문 글 · 스조라크 회오리 짝짓기', href: INVEN(231396), note: '2026-09-11 · 2명 대 2명은 되고 2명 대 1명은 한 명이 날아감, 넉백 저항 기술 주의. 9월 7일 글(231315)에서 실제 사례 확인' },
  'inven-sszorak-3': { title: '인벤 질문 글 · 신화 스조라크 뭉치기', href: INVEN(231796), note: '2026-10-11 · 분노 집결 14명은 지정 대상을 뺀 숫자(답 두 건 일치)' },
  'inven-sszorak-tip': { title: '극려 · 스조라크 신화 팁(인벤)', href: INVEN(231337), note: '2026-09-08 · 회오리 피하기가 가장 중요. 10월 20일 후기(231882)도 같은 지점을 꼽음' },
  'inven-altar': { title: '애기트럴 · 맹독심연 7·8넴 공략(인벤)', href: INVEN(231856), note: '2026-10-17 · 10월 14일 완화 뒤 킬 공대의 똬리의 제단·울라텍 공략. 조 배정과 직업 구성은 그 공대의 선택' },
  'inven-altar-soul': { title: '인벤 질문 글 · 똬리의 제단 영혼 회수', href: INVEN(231802), note: '2026-10-12 · 자기 영혼 셋을 모아야 하는 세 경우(답 여러 건 일치). 9월 6일 글(231306) 답도 같음' },
  'inven-ulatek': { title: 'Lucide · 신화 울라텍 공략(인벤)', href: INVEN(231826), note: '2026-10-14 · 완화 뒤 킬 공대. 송곳니 1+5와 6개 동시는 공대 선택으로 봄' },
  'inven-ulatek-p1': { title: '열반 · 신화 울라텍 1페 팁(인벤)', href: INVEN(231697), note: '2026-10-03 · 보이지 않는 꼬리 파도는 좌·우 경우마다 자리와 순서가 정해져 있음(Method 매크로 안내와 같은 패턴이라는 답)' },
  'inven-ulatek-dk': { title: '인벤 질문 글 · 울라텍 신화 죽음의 기사 수', href: INVEN(231615), note: '2026-09-25 · 마지막 단계 죽음의 손아귀 4번 때문에 죽음의 기사 2명(답 여러 건 일치)' },
});

const addTips = (id, tips) => boss(id).tips.push(...tips);
const addSources = (id, keys) => { const b = boss(id); for (const k of keys) if (!b.sources.includes(k)) b.sources.push(k); };
const choice = (id, title) => { const c = boss(id).choices.find(x => x.title === title); if (!c) throw new Error(`${id}: choice ${title}`); return c; };

// 키식스 — 쿨기 시점은 갈림. 국내 공략 하나가 더 초반 사용안이다.
Object.assign(choice('kithix', '공격 쿨기 시점'), {
  alt: '국내 실전 공략 두 곳(이당이당, 레키엘)은 초반에 쓰는 안을 택했습니다. 마지막 구간의 피해 증가는 잡을 때까지 이어지므로 그때 쿨기를 모을 이유가 적다는 설명입니다.',
  why: '공대 화력과 전투 길이에 따라 한 안만 고르고 섞지 않습니다. 다른 안은 참고로만 봅니다.',
});
addSources('kithix', ['inven-kithix']);

// 네크잘리
addTips('nekzali', [
  { role: '해제', text: '디버프 해제는 늘 방 가장 바깥에서 받습니다. 공대가 모인 가운데에서 풀지 않습니다.', source: 'inven-nekzali' },
  { role: '우물 안 원거리', text: '우물 안에서는 가장 바깥쪽에 붙거나 검은 우물 위에 서면, 방을 도는 영혼을 신경 쓰지 않고 서서 딜할 수 있습니다. 영혼이 나오는 방향만 피합니다.', source: 'inven-nekzali' },
]);
boss('nekzali').choices.push({
  title: '우물 조를 줄이는 운영',
  picked: '1단계와 2단계 모두 두 조가 번갈아 우물에 들어갑니다(raidstrats·Method).',
  alt: '장비가 좋은 공대는 처음부터 피의 욕망을 쓰고 우물 조를 2단계에만 넣거나, 1단계에 한 번 넣고 사잇단계에는 들어가지 않습니다. 아무도 안 들어가면 우물 쫄이 한동안 시전하지 않고, 시전이 끝나기 전에 단계가 넘어가면 사라지기 때문입니다(인벤 레키엘 공략 9월 29일 보충).',
  why: '공대 화력에 따라 고르는 운영이라 참고로만 봅니다. 우물 쫄 시전이 끝나기 전에 단계를 넘길 화력이 있을 때만 검토합니다.',
});
addSources('nekzali', ['inven-nekzali']);

// 매장된 파수꾼
addTips('sentinels', [
  { role: '두 대상 딜', text: '두 네임드를 함께 칠 수 있는 딜러(파괴 흑마법사·암흑 사제·조화 드루이드)는 양쪽 디버프 중첩을 보며 둘을 같이 칩니다. 독 쫄이 나오면 그 쫄도 함께 칩니다.', source: 'inven-sentinels' },
  { role: '같이 맞기 인원', text: '두 대상 딜러는 붉은 바닥 같이 맞기에서 빼 줍니다. 한 조에서 빼는 인원은 2명까지로 둡니다.', source: 'inven-sentinels' },
]);
addSources('sentinels', ['inven-sentinels']);

// 길 잃은 탐험가 — 물고기 순서와 쉬운 공략은 갈림.
Object.assign(choice('explorers', '물고기 강화 순서'), {
  alt: 'Method 공개안은 게보 → 이쿠 → 나마, raidstrats 추천은 게보 → 나마 → 이쿠. 인벤 신화 팁 글과 NSRT 시간표(1분 게보·3분 이쿠·5분 나마)도 게보 → 이쿠 → 나마를 씁니다.',
  why: '순서 자체보다 미리 정해 두고 세 네임드 체력을 맞추는 것이 핵심입니다. 공대마다 다르니 다른 순서는 참고로만 봅니다.',
});
boss('explorers').choices.push({
  title: '게보만 광폭시키는 쉬운 공략',
  picked: '세 네임드의 체력을 맞추며 물고기 셋을 차례로 먹입니다.',
  alt: '이쿠와 나마를 붙여 먼저 잡고 게보만 광폭시키는 방식도 쓰입니다. 둘이 죽어 게보가 광폭하면 버섯과 상자가 나오지 않고, 탱커만 약 10초마다 크게 밀려납니다. 죽음의 기사는 죽음의 진군으로 버틸 수 있습니다. 전멸 시전은 계속되므로 게보에게도 물고기는 먹입니다(인벤 동그란기린 공략).',
  why: '버섯과 상자를 보지 않는 대신 딜 요구량이 있고 탱커가 넉백을 버텨야 합니다. 이 글의 기본안이 아니니 참고로만 봅니다.',
});
addSources('explorers', ['inven-explorers-tip', 'inven-explorers']);

// 바쉬니크
addTips('vashnik', [
  { role: '구성', text: '딜 요구량보다 회복 부담이 큰 네임드입니다. 힐러 5명으로 가도 딜이 모자라지 않는다는 실전 답이 많습니다.', source: 'inven-vashnik-heal' },
]);
boss('vashnik').choices.push({
  title: '셋째 불 쫄 추방',
  picked: '셋째 불 쫄은 흑마법사가 추방해 두었다가 앞의 둘이 죽은 뒤 당깁니다(raidstrats·Method).',
  alt: '장비가 오른 뒤에는 추방 없이 이동 속도 감소만 걸어 두고, 연달아 죽이지만 않는 공대도 많습니다. 트라이 중인 공대는 둘이나 셋을 동시에 잡으면 사망자가 나온다는 답도 있습니다(인벤 질문 글 댓글).',
  why: '핵심은 추방이 아니라 불 쫄을 동시에 죽이지 않는 것입니다. 회복이 밀리는 공대는 추방을 그대로 쓰고, 다른 안은 참고로만 봅니다.',
});
addSources('vashnik', ['inven-vashnik', 'inven-vashnik-heal']);

// 스조라크
addTips('sszorak', [
  { role: '상쇄', text: '신화 띄워 올리기는 반대 화살표 짝과 일직선이 아니어도, 직각(ㄱ자)으로 만나 선만 닿으면 상쇄됩니다. 2명 대 2명은 되지만 2명 대 1명이면 한 명이 날아갑니다. 혼자 끊을 수단이 없는 성기사 같은 직업에는 구출 담당을 붙입니다.', source: 'inven-sszorak' },
  { role: '넉백 저항', text: '죽음의 진군처럼 넉백을 버티는 기술을 쓰면 나는 뜨지 않지만, 짝은 부딪힐 상대가 없어 날아갑니다. 짝을 맞춘 띄워 올리기에는 쓰지 않습니다.', source: 'inven-sszorak-2' },
  { role: '집결 인원', text: '분노 집결의 14명은 지정 대상을 뺀 숫자입니다. 지정 대상까지 15명이 모입니다.', source: 'inven-sszorak-3' },
  { role: '회오리', text: '실전에서 가장 많이 무너지는 곳은 바람보다 회오리입니다. 회오리 사이 빈틈에 미리 서 두고, 회오리 피하기를 딜보다 먼저 합니다.', source: 'inven-sszorak-tip' },
]);
addSources('sszorak', ['inven-sszorak', 'inven-sszorak-2', 'inven-sszorak-3', 'inven-sszorak-tip']);

// 똬리의 제단
addTips('coiled-altar', [
  { role: '영혼 회수', text: '자기 영혼 셋을 모아야 하는 사람은 셋입니다. 암영폭탄 대상자, 폭탄 범위에 같이 맞은 사람, 탱커를 향한 전방 공격(브레스)에 스친 사람입니다. 같이 맞거나 브레스에 스친 경우는 따로 경고가 뜨지 않으니 자기 디버프를 확인합니다.', source: 'inven-altar-soul' },
  { role: '구슬과 바닥', text: '구슬과 바닥이 함께 나오는 때(1단계 세 번째 구슬 등)에는 개인 생존기를 켜고 옮깁니다.', source: 'inven-altar' },
  { role: '초록 줄 길목', text: '강화 사잇단계에는 말라크라스와 줄잔을 잇는 초록 줄에 영혼이 가려 잘 보이지 않습니다. 한두 명이 그 길목을 따로 막습니다.', source: 'inven-altar' },
  { role: '3단계 단두대', text: '3단계 단두대는 마법 피해라, 성기사의 주문 수호의 축복을 받은 사람이 조에 들어가 피해 없이 받을 수 있습니다.', source: 'inven-altar' },
]);
boss('coiled-altar').choices.push({
  title: '두 번째 단두대 도발',
  picked: '탱커 둘이 생존기로 받고, 그동안 무기 전사가 투사의 혼을 켜고 도발해 네임드를 붙잡습니다(raidstrats).',
  alt: '인벤 실전 공략(10월 14일 완화 뒤 킬)은 딜이 모자라던 때의 방식이라 이제는 하지 않아도 된다고 씁니다.',
  why: '완화 뒤 공대 화력에 따라 고르는 부분이라 다른 안은 참고로만 봅니다.',
});
addSources('coiled-altar', ['inven-altar', 'inven-altar-soul']);
if (!guide.skills.some(s => s.name === '주문 수호의 축복')) guide.skills.push({ name: '주문 수호의 축복', id: 204018 });
if (!guide.skills.some(s => s.name === '죽음의 진군')) guide.skills.push({ name: '죽음의 진군', id: 48265 });

// 울라텍
addTips('ulatek', [
  { role: '구성', text: '마지막 단계 시작에 쫄을 죽음의 손아귀로 네 번 당겨야 해서 죽음의 기사 2명이 필요합니다. 둘 다 혈기 탱커가 아니어도 딜 죽음의 기사가 있으면 됩니다.', source: 'inven-ulatek-dk' },
  { role: '꼬리 파도', text: '1단계 두 번째 파도 구간에서 보이지 않는 꼬리의 파도는 미리 표시되지 않습니다. 대신 꼬리가 좌·우 어디에 나오느냐에 따라 자리와 순서가 정해져 있으니, 자기 자리에서 두 경우의 피할 순서를 미리 외웁니다.', source: 'inven-ulatek-p1' },
  { role: '심장 딜 중 파도', text: '심장 딜 중에도 파도가 두 번 옵니다. 두 번째 파도가 특히 위험하니 딜하면서 방향을 보고, 한 명이 콜합니다.', source: 'inven-ulatek' },
  { role: '큰 알 쫄 탱킹', text: '큰 알에서 나온 차단 쫄은 공격 대상이 평타 거리 밖에 있으면 시전하지 않고 따라오기만 합니다. 탱커는 시전을 신경 쓰지 말고 먼저 자리로 달려, 심장 바로 옆에 바짝 붙여 세웁니다. 심장은 맞는 범위가 작아 멀리 세우면 광역 딜에 녹지 않습니다.', source: 'inven-ulatek' },
  { role: '큰 알 쫄 차단', text: '큰 알 쫄 차단은 탱커 둘과 근접 둘이 한 마리씩 맡고, 원거리가 놓치기 쉬운 차단을 받쳐 줍니다.', source: 'inven-altar' },
  { role: '흡수 담당', text: '마지막 단계 흡수는 원이 걸린 대상자 셋에 흡수 담당 3명이 더 들어가야 터집니다. 무적기가 있는 직업을 넣고, 흡수 뒤 화살표가 터질 때 무적기를 씁니다. 이어지는 지속 피해에는 외부 생존기를 줍니다.', source: 'inven-altar' },
  { role: '두·세 번째 흡수', text: '두 번째와 세 번째 흡수는 탱커 둘에 한 명을 더합니다. 세 번째는 독물 안에서도 버티며 회복할 수 있는 신성 성기사·신성 사제 같은 힐러가 맡습니다.', source: 'inven-ulatek' },
]);
Object.assign(choice('ulatek', '송곳니 해제'), {
  alt: 'MATE식 6개 동시 해제. 인벤 킬 공대 두 곳(애기트럴·Lucide)도 완화 뒤에는 6개 동시로 끊어도 사고가 거의 없었다고 씁니다.',
  why: '널리 쓰는 방식을 우선해 1+5를 택했습니다. 공대 사정에 따라 6개 동시안을 택할 수도 있지만 생존기 표를 섞지 않고, 다른 안은 참고로만 봅니다.',
});
boss('ulatek').choices.push(
  {
    title: '남쪽 방 알 순서',
    open: true,
    picked: '보호막 알 둘을 먼저 깨고 집은 뒤 큰 알을 집습니다. 쫄이 늦게 나와 광폭 관리가 쉽지만, 정한 시간 안에 보호막을 깨야 합니다.',
    alt: '큰 알부터 바로 집습니다. 보호막을 칠 필요가 없어 택틱은 쉽지만, 쫄이 남쪽 방에서 먼저 나와 이동하는 동안 광폭 시간을 조심해야 합니다.',
    why: '인벤 실전 공략은 두 방식 모두 많이 쓰인다고 씁니다. 공대 사정에 맞게 하나를 고르고 참고로만 봅니다.',
  },
  {
    title: '첫 번째 흡수 담당',
    open: true,
    picked: '탱커를 빼고 무적기가 돌아오는 딜러 3명(사냥꾼·조화 드루이드 등)을 넣습니다. 탱커가 넉백과 죽음의 손아귀에 집중할 수 있습니다(인벤 애기트럴 공략).',
    alt: '죽음의 기사 탱커 한 명에 도적·증강 기원사를 넣습니다. 회복 부담이 줄어듭니다(인벤 Lucide 공략).',
    why: '담당 3명이 무적기를 갖추면 어느 쪽이든 됩니다. 공대 구성에 맞춰 고르고 참고로만 봅니다.',
  },
);
addSources('ulatek', ['inven-ulatek', 'inven-ulatek-p1', 'inven-ulatek-dk', 'inven-altar']);

// 읽기 전 안내와 기준 메모
guide.page.notes.splice(1, 0, '인벤 레이드 게시판의 신화 실전 글(10월 21일 글까지)은 여러 글이 같은 말을 하는 부분만 역할별 실전 팁에 보충했습니다. 공대마다 갈리는 방식은 ‘갈리는 택틱’에 적었으니 참고로만 보세요.');
guide.basisNotes.push('인벤 레이드 게시판의 신화 글 50여 건(8월 25일~10월 21일)을 댓글까지 읽고 비교했습니다. 서로 다른 글쓴이 둘 이상이 같은 말을 하고 반대 의견이 없는 내용만 팁에 넣었고, 한 공대의 배정·직업 구성이나 갈리는 택틱은 ‘갈리는 택틱’에 참고로만 남겼습니다. 한 글에만 나오거나 지금도 되는지 확인되지 않은 내용은 넣지 않았습니다.');
guide.metadata.updated = '2026-10-23';

fs.writeFileSync(FILE, JSON.stringify(guide, null, 2) + '\n');
const tips = guide.episodes.flatMap(e => e.bosses).reduce((n, b) => n + b.tips.length, 0);
const choices = guide.episodes.flatMap(e => e.bosses).reduce((n, b) => n + b.choices.length, 0);
console.log(`applied: ${tips} tips, ${choices} choices, ${Object.keys(guide.sources).length} sources`);
