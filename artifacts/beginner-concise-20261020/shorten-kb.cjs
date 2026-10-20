// 초보자 안내 KB 원본의 설명 글을 한두 줄로 줄인다(2026-10-20 사용자 원칙 '글은 적게, 그림은 많이').
// 대상: 00-공통/공용/Meta/beginner-crafting.json(단계 설명·그림 설명·장식 목록 안내), beginner-consumables.json(묶음 안내).
// Wowhead에서 가져온 아이템 이름·효과·요구 조건은 건드리지 않는다. 돌린 뒤 npm run sync-kb.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const meta = path.resolve(__dirname, '../../../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/00-공통/공용/Meta');
const craftingPath = path.join(meta, 'beginner-crafting.json');
const consumablesPath = path.join(meta, 'beginner-consumables.json');
const crafting = JSON.parse(fs.readFileSync(craftingPath, 'utf8'));
const consumables = JSON.parse(fs.readFileSync(consumablesPath, 'utf8'));

crafting.section.intro = '원하는 부위와 능력치를 정해 제작자에게 맡깁니다.';
crafting.section.note = '장비와 장식 조합을 정한 뒤 재료를 삽니다. 수수료는 제작자와 확인합니다.';
const steps = {
  '01': ['내 전문화가 쓰는 부위 중 오래 쓸 것부터. 티어 세트가 끊기는지 확인합니다.', '전문 기술을 직접 배울 필요는 없습니다.'],
  '02': ['장식은 제작 장비에 붙는 추가 효과. 장식됨 장비는 동시에 최대 두 개입니다.', '마법부여·보석과는 별개입니다.'],
  '03': ['제작자를 찾아 아이템·아이템 레벨·품질·능력치·장식을 말하고 재료와 수수료를 묻습니다.', '“이 장비를 이 레벨로, 이 능력치와 장식으로”라고 물으면 됩니다.'],
  '04': ['기본 재료와 선택 재료를 나눠 봅니다. 귀속 재료는 내가 준비합니다.', '옛 시즌 재료를 이름만 보고 사지 않습니다.'],
  '05': ['서신으로 보조 능력치를, 장식 재료로 추가 효과를 정합니다.', '조합이 되는지 제작자에게 먼저 확인합니다.'],
  '06': ['재료 품질과 완성품 품질은 다른 표시. 완성품 품질이 아이템 레벨을 정합니다.', '이름 색깔(희귀도)과 품질은 다릅니다.'],
  '07': ['NPC에게 말을 걸고 개인·길드·공개 주문 중 고릅니다. 품질은 최소 품질로 정합니다.', '품질이 중요하면 개인 주문. 이름과 서버를 확인합니다.'],
  '08': ['아이템·재료·품질·제작자·수수료를 다시 보고 보냅니다. 완성품은 우편으로 옵니다.', '받은 장비의 능력치·장식·품질을 확인합니다.'],
  '09': ['기존 장비에 재료를 더해 아이템 레벨·품질·선택 재료를 바꿉니다.', '새로 만들기 전에 재제작이 되는지 확인합니다.'],
  '10': ['장식을 바꾸거나 빼려면 재제작과 제거 재료 지원을 확인합니다. 뺀 재료는 돌려받지 못합니다.', '바꾼 뒤에도 장식됨 장비는 두 개 이하여야 합니다.'],
};
for (const entry of crafting.section.entries) {
  const number = entry.term.slice(0, 2);
  assert(steps[number], `unknown step ${entry.term}`);
  [entry.description, entry.tip] = steps[number];
}

const screens = {
  browse: ['주문 제작 NPC에게 말을 걸면 열립니다. 경매장과 비슷합니다.', {
    '검색창': '장비 이름을 넣고 빨간 검색 단추를 누릅니다.',
    '부위 목록': '재질 → 부위 순서로 고릅니다.',
    '제작법 목록': '보라색 이름이 제작 장비. 누르면 주문 화면으로 갑니다.',
    '재제작 주문 시작': '받은 장비를 올리거나 장식을 바꿀 때. 네 번째 화면을 보세요.',
  }],
  reagents: ['왼쪽이 재료, 오른쪽이 주문 내용. 위가 기본 재료, 아래가 선택 재료입니다.', {
    '재료 제공 목록': '◆ 재료는 품질별 수량을 정합니다. 귀속 재료는 내가 넣습니다.',
    '힘 주입': '완성품 아이템 레벨을 정하는 재료 칸입니다.',
    '보조 능력치 증폭': '서신으로 가속·치명타 등을 정하는 칸입니다.',
    '장식 추가': '장식 재료를 넣는 칸. 효과가 정해진 장비에는 없습니다.',
  }],
  order: ['누구에게 보낼지와 수수료를 정합니다. 품질이 중요하면 개인 주문입니다.', {
    '주문 종류': '공개·길드·개인 중 고릅니다.',
    '받는이와 최소 품질': '제작자 이름은 서버까지. 최소 품질은 처음에 ‘없음’입니다.',
    '제작 참고 사항': '원하는 장식·능력치를 적는 메모입니다.',
    '수수료와 기간': '수수료는 제작자 몫, 망치 단추로 시세 확인. 기간은 48시간입니다.',
    '총 가격과 주문 의뢰하기': '총 가격을 보고 누릅니다. 진행은 내 주문에서 봅니다.',
  }],
  recraft: ['첫 화면의 재제작 주문 시작을 누르고 장비를 고르면 나옵니다.', {
    '재제작할 장비': '왼쪽이 올린 장비, 오른쪽이 결과입니다.',
    '다시 드는 재료': '일부만 다시 듭니다. 창에 보이는 수량만 준비합니다.',
    '선택 재료 바꾸기': '오른쪽 클릭으로 빼고 새로 넣습니다. 뺀 재료는 돌려받지 못합니다.',
    '개인 주문으로 보내기': '보내는 법은 같습니다. 개인 주문이 안전합니다.',
  }],
  result: ['완성품은 우편으로 옵니다. 장착 전 설명에서 네 가지를 봅니다.', {
    '우편으로 받기': '우편함에서 받고 장비 위에 마우스를 올립니다.',
    '고유 장착: 장식됨 (2)': '이 줄이 있으면 장식됨 장비. 두 개까지만 낍니다.',
    '보조 능력치': '서신으로 정한 능력치가 맞는지 봅니다.',
    '장식 효과와 품질': '초록 장착 효과가 장식 효과. ◆ 숫자가 높을수록 아이템 레벨도 높습니다.',
  }],
};
for (const screen of crafting.screens) {
  const [summary, legend] = screens[screen.id];
  screen.summary = summary;
  for (const item of screen.legend) {
    assert(legend[item.label], `unknown legend ${screen.id}/${item.label}`);
    item.text = legend[item.label];
  }
  assert.equal(Object.keys(legend).length, screen.legend.length, `legend count ${screen.id}`);
}

crafting.catalog.intro = '장식 재료 14종과 효과가 붙은 제작 장비 30종. 추천 순위가 아닙니다.';
crafting.catalog.note = '장식됨 장비는 동시에 최대 두 개. 수치는 예시이며 품질·아이템 레벨에 따라 다릅니다.';
const catalogIntros = {
  'season-2-reagents': '적용 가능한 제작법이 다릅니다. 주문 창의 선택 재료 칸을 확인합니다.',
  'lining-reagents': '기본 장식 효과가 없는 제작 장비에 넣는 재료입니다.',
  'darkmoon-sigils': '제작할 때 넣는 재료. ‘다크문 지배’ 장신구와 다릅니다.',
  'built-in-plate': '효과가 정해진 장비. 장식을 더 넣지 않습니다.',
  'built-in-mail': '‘2개 세트 효과’는 두 부위를 함께 껴야 발동합니다.',
  'built-in-leather': '같은 세트 이름끼리 조합해야 세트 효과가 납니다.',
  'built-in-cloth': '태양불꽃·비전매듭 세트는 두 부위 필요. 허리는 자체 효과입니다.',
  'built-in-jewelry': '보석 색상과 연계되는 효과도 있습니다.',
  'built-in-trinkets': '장신구도 ‘장식됨’ 제한에 들어갑니다.',
  'built-in-weapons': '쓸 수 있는 직업인지 확인합니다.',
};
for (const group of crafting.catalog.groups) {
  assert(catalogIntros[group.id], `unknown catalog group ${group.id}`);
  group.intro = catalogIntros[group.id];
}

const consumableIntros = {
  flasks: '오래 유지할 보조 능력치를 고릅니다.',
  'combat-potions': '순간적으로 전투 능력을 높입니다. 사용 조건을 확인합니다.',
  'recovery-potions': '생명력용과 마나용을 구별합니다.',
  'primary-food': '힘·민첩·지능을 올리는 개인 음식입니다.',
  'primary-feasts': '함께 먹고 주 능력치와 체력을 얻습니다.',
  'secondary-food': '가장 높은 보조 능력치를 올립니다.',
  'secondary-feasts': '함께 먹고 가장 높은 보조 능력치와 체력을 얻습니다.',
  'specific-food': '음식마다 정해진 능력치를 올립니다.',
  'runes-oils': '룬은 주 능력치, 기름은 무기의 임시 효과입니다.',
  drinks: '전투 사이에 앉아서 마나를 회복합니다.',
  'gems-peridot': '가속 중심. 일반 보석과 무결한 보석을 비교합니다.',
  'gems-amethyst': '특화 중심. 일반 보석과 무결한 보석을 비교합니다.',
  'gems-garnet': '치명타 중심. 일반 보석과 무결한 보석을 비교합니다.',
  'gems-lapis': '유연성 중심. 일반 보석과 무결한 보석을 비교합니다.',
  'gems-diamonds': '주 능력치와 추가 효과. 탈라시안 다이아몬드는 종류를 합쳐 하나만 장착합니다.',
  'enchants-weapon': '확률로 발동하는 효과. 능력치형과 피해·보호막형을 구별합니다.',
  'enchants-chest': '주 능력치를 올립니다. 전용 능력치인지 확인합니다.',
  'enchants-ring': '보조 능력치 하나. 반지는 두 개라 두 번 바릅니다.',
  'enchants-helm': '광역회피·생기흡수·이동 속도 중 하나. ‘강화된’은 한밤 야외 추가 효과.',
  'enchants-boots': '셋 모두 체력을 함께 올립니다.',
  'enchants-shoulder': '광역회피·생기흡수·이동 속도 중 하나를 올립니다.',
  'enchants-legs': '다리는 마법실타래(지능)나 방어구 강화도구(민첩성·힘)를 씁니다.',
  'enchants-scope': '활·총·석궁에만 바르는 기계공학 물품입니다.',
};
for (const group of consumables.groups) {
  assert(consumableIntros[group.id], `unknown consumable group ${group.id}`);
  group.intro = consumableIntros[group.id];
}

fs.writeFileSync(craftingPath, JSON.stringify(crafting, null, 2) + '\n');
fs.writeFileSync(consumablesPath, JSON.stringify(consumables, null, 2) + '\n');
const longest = [...crafting.section.entries.flatMap(e => [e.description, e.tip]), ...crafting.screens.flatMap(s => [s.summary, ...s.legend.map(l => l.text)]), ...Object.values(consumableIntros), ...Object.values(catalogIntros)].map(t => t.length);
console.log(JSON.stringify({ steps: crafting.section.entries.length, screens: crafting.screens.length, groups: consumables.groups.length, longest: Math.max(...longest) }));
