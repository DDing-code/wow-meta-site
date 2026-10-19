// KB 원본 beginner-consumables.json에 12.1.5 마법부여·다리 강화·조준경 묶음을 넣는다(한 번만 실행).
// 각 마법부여는 품질 두 단계라 높은 단계 아이템을 링크하고, 효과 수치도 그 아이템의 Wowhead 한국어 툴팁 값이다.
const fs = require('fs');
const path = require('path');
const file = path.resolve(__dirname, '../../../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/00-공통/공용/Meta/beginner-consumables.json');
const ev = 'inv_12_profession_enchanting_enchantedvellum_';
const item = (id, name, icon, effect) => ({ id, name, icon: icon.startsWith('_') ? ev + icon.slice(1) : icon, effect, hearty: false, source: `https://www.wowhead.com/ko/item=${id}` });
const groups = [
  { id: 'enchants-weapon', title: '마법부여 · 무기', intro: '주문·능력을 쓸 때 일정 확률로 효과가 발동합니다. 능력치를 올리는 것과 피해·보호막을 더하는 것을 구별하세요.', items: [
    item(243973, '무기 마법부여 - 광전사의 분노', '_purple', '발동 시 15초 동안 가속 +124'),
    item(243971, '무기 마법부여 - 잔알라이의 정밀함', '_purple', '발동 시 15초 동안 치명타 및 극대화 +124'),
    item(244031, '무기 마법부여 - 비전 숙련', '_purple', '발동 시 15초 동안 특화 +124'),
    item(244001, '무기 마법부여 - 세계혼의 끈기', '_purple', '발동 시 15초 동안 유연성 +124'),
    item(244029, '무기 마법부여 - 렌도레이의 명민함', '_purple', '발동 시 15초 동안 주 능력치 +67'),
    item(273072, '무기 마법부여 - 하셰이의 의례', '_purple', '발동 시 15초 동안 무작위 보조 능력치 +139 · 생명력 80% 이상이면 가장 높은 보조 능력치 우선'),
    item(244027, '무기 마법부여 - 신도레이의 불꽃', '_purple', '일정 확률로 10초 화염 지속 피해 후 주위 폭발'),
    item(243969, '무기 마법부여 - 할라지의 힘', '_purple', '피해를 입힐 때 일정 확률로 18초 출혈 피해'),
    item(243997, '무기 마법부여 - 세계혼의 요람', '_purple', '치유할 때 일정 확률로 대상에게 피해 흡수 방벽'),
    item(243999, '무기 마법부여 - 세계혼 아이기스', '_purple', '피해를 받을 때 일정 확률로 방벽 · 소진되면 주위 자연 피해'),
  ] },
  { id: 'enchants-chest', title: '마법부여 · 가슴보호구', intro: '주 능력치를 올립니다. 힘·민첩성·지능 전용인지, 모든 주 능력치에 맞는지 확인하세요.', items: [
    item(243977, '가슴보호구 마법부여 - 세계혼의 징표', '_blue', '주 능력치 +50'),
    item(243947, '가슴보호구 마법부여 - 날로라크의 징표', '_blue', '힘 +40·체력 +116'),
    item(243975, '가슴보호구 마법부여 - 뿌리감시관의 징표', '_blue', '민첩성 +40·이동 속도 +15'),
    item(244003, '가슴보호구 마법부여 - 마법학자의 징표', '_blue', '지능 +40·최대 마나 5%'),
  ] },
  { id: 'enchants-ring', title: '마법부여 · 반지', intro: '보조 능력치 하나를 올립니다. 반지는 두 개이므로 두 번 바를 수 있습니다. 같은 능력치에 수치가 낮은 값싼 마법부여도 있고, 독수리의 눈은 수치 대신 비율(%)로 올립니다.', items: [
    item(243987, '반지 마법부여 - 자연의 격노', '_blue', '치명타 및 극대화 +29'),
    item(243985, '반지 마법부여 - 자연의 천벌', '_green', '치명타 및 극대화 +24'),
    item(244015, '반지 마법부여 - 실버문의 기민함', '_blue', '가속 +29'),
    item(244011, '반지 마법부여 - 탈라시안 가속', '_green', '가속 +24'),
    item(243959, '반지 마법부여 - 줄진의 특화', '_blue', '특화 +29'),
    item(243955, '반지 마법부여 - 아마니의 특화', '_green', '특화 +24'),
    item(244017, '반지 마법부여 - 실버문의 끈기', '_blue', '유연성 +29'),
    item(244013, '반지 마법부여 - 탈라시안 유연성', '_green', '유연성 +24'),
    item(243957, '반지 마법부여 - 독수리의 눈', '_blue', '치명타 및 극대화 2%'),
  ] },
  { id: 'enchants-helm', title: '마법부여 · 투구', intro: '광역회피·생기흡수·이동 속도 중 하나를 올립니다. ‘강화된’ 마법부여는 한밤 지역 야외에서 적을 처치할 때 추가 효과가 있습니다.', items: [
    item(244007, '투구 마법부여 - 강화된 광역회피의 룬', '_blue', '광역회피 +37 · 야외 처치 시 이동 속도 증가'),
    item(244005, '투구 마법부여 - 광역회피의 룬', '_green', '광역회피 +22'),
    item(243951, '투구 마법부여 - 강화된 생기흡수의 사술', '_blue', '생기흡수 +55 · 야외 처치 시 생명력 3% 회복'),
    item(243949, '투구 마법부여 - 생기흡수의 사술', '_green', '생기흡수 +33'),
    item(243981, '투구 마법부여 - 강화된 속도의 축복', '_blue', '이동 속도 +22 · 야외 처치 시 하늘비행 사용 횟수 1회'),
    item(243979, '투구 마법부여 - 속도의 축복', '_green', '이동 속도 +13'),
  ] },
  { id: 'enchants-boots', title: '마법부여 · 장화', intro: '셋 모두 체력을 함께 올립니다. 같이 오르는 능력치만 다릅니다.', items: [
    item(243953, '장화 마법부여 - 스라소니의 기민함', '_blue', '광역회피 +19·체력 +232'),
    item(243983, '장화 마법부여 - 샬라드라실의 뿌리', '_blue', '생기흡수 +28·체력 +232'),
    item(244009, '장화 마법부여 - 원정순찰대의 추적', '_blue', '이동 속도 +11·체력 +232'),
  ] },
  { id: 'enchants-shoulder', title: '마법부여 · 어깨보호구', intro: '광역회피·생기흡수·이동 속도 중 하나를 올립니다. 같은 능력치에 수치가 낮은 값싼 마법부여도 있습니다.', items: [
    item(243991, '어깨보호구 마법부여 - 아미드랏실의 은혜', '_blue', '광역회피 +111'),
    item(243989, '어깨보호구 마법부여 - 자연의 은혜', '_green', '광역회피 +67'),
    item(244021, '어깨보호구 마법부여 - 실버문의 치유', '_blue', '생기흡수 +166'),
    item(244019, '어깨보호구 마법부여 - 탈라시안 회복', '_green', '생기흡수 +99'),
    item(243963, '어깨보호구 마법부여 - 아킬존의 신속함', '_blue', '이동 속도 +65'),
    item(243961, '어깨보호구 마법부여 - 독수리의 비행', '_green', '이동 속도 +39'),
  ] },
  { id: 'enchants-legs', title: '다리 강화 · 마법실타래 · 방어구 강화도구', intro: '다리는 마법부여 대신 재봉술의 마법실타래(지능)나 가죽세공의 방어구 강화도구(민첩성·힘)를 씁니다.', items: [
    item(240133, '태양불꽃 비단 마법실타래', 'inv_tailoring_spellthread_orange_spellthread', '지능 +41·체력 +115'),
    item(240155, '비전매듭 마법실타래', 'inv_12_tailoring_spellthread_violet_spellthread', '지능 +41·최대 마나 4%'),
    item(240157, '빛나는 리넨 마법실타래', 'inv_12_tailoring_spellthread_blue_spellthread', '지능 +24'),
    item(244641, '숲 사냥꾼의 방어구 강화도구', 'inv_12_profession_leatherworking_amani_armor_kit', '민첩성 또는 힘 +41·체력 +115'),
    item(244643, '혈기사의 방어구 강화도구', 'inv_12_profession_leatherworking_thalassian_amor_kit', '민첩성 또는 힘 +41·방어도 +27'),
    item(244645, '탈라시안 정찰병 방어구 강화도구', 'inv_12_profession_leatherworking_standart_armor_kit', '민첩성 또는 힘 +24'),
  ] },
  { id: 'enchants-scope', title: '원거리 무기 · 조준경', intro: '활·총·석궁 같은 원거리 무기에만 바르는 기계공학 물품입니다.', items: [
    item(257746, '원정순찰대원의 매의 눈', 'inv_10_engineering_scope_color4', '일정 확률로 치명타 및 극대화 +19'),
    item(257748, '밀수업자의 눈썰미', 'inv_10_engineering_scope_color2', '일정 확률로 특화 +19'),
  ] },
];
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
// 검색창에 '마부'처럼 줄여 써도 이 묶음이 나오도록 검색 낱말을 붙인다.
for (const group of groups) group.keywords = '마부 마법부여 인챈트 enchant';
data.groups = data.groups.filter(group => !group.id.startsWith('enchants-')).concat(groups);
data.metadata.verifiedAt = '2026-10-20';
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log(groups.reduce((n, g) => n + g.items.length, 0), 'enchant items;', data.groups.reduce((n, g) => n + g.items.length, 0), 'total');
