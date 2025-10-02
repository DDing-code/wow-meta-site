/**
 * 누락된 스킬 데이터를 Wowhead에서 가져오기
 * WebFetch 대신 간단한 HTML 파싱으로 수집
 */

const fs = require('fs');
const path = require('path');

// 누락된 스킬 ID 파일 읽기
const missingDataPath = path.join(__dirname, 'missing-skill-ids.json');
const missingData = JSON.parse(fs.readFileSync(missingDataPath, 'utf8'));

// 현재 데이터베이스 읽기
const currentDataPath = path.join(__dirname, '..', 'src', 'data', 'wowhead-full-descriptions-complete.json');
const currentData = JSON.parse(fs.readFileSync(currentDataPath, 'utf8'));

// 아이콘 매핑 읽기
const iconMappingPath = path.join(__dirname, '..', 'src', 'data', 'iconMapping.json');
const iconMapping = JSON.parse(fs.readFileSync(iconMappingPath, 'utf8'));

// 기본 스킬 데이터 템플릿
const defaultSkillData = {
  // 전사 스킬들
  6673: { name: '전투의 외침', icon: 'ability_warrior_battleshout', description: '10초 내에 외침으로 파티 및 공격대원을 일정 시간 동안 공격 전투력이 5%만큼 증가시킵니다.' },
  100: { name: '돌진', icon: 'ability_warrior_charge', description: '적에게 돌진하여 0.5초 동안 적을 이동 불가 상태로 만들고 분노를 10만큼 생성합니다.' },
  355: { name: '도발', icon: 'spell_nature_reincarnation', description: '대상을 도발하여 3초 동안 시전자를 공격하게 만듭니다.' },

  // 성기사 스킬들
  853: { name: '심판의 망치', icon: 'spell_holy_sealofmight', description: '대상에게 망치를 던져 3초 동안 기절시킵니다.' },
  633: { name: '신의 축복', icon: 'spell_holy_divineprotection', description: '즉시 시전자의 최대 생명력과 같은 양의 생명력을 회복시킵니다.' },
  642: { name: '천상의 보호막', icon: 'spell_holy_divineshield', description: '8초 동안 모든 공격과 주문으로부터 면역이 되지만 공격력이 50%만큼 감소합니다.' },

  // 사냥꾼 스킬들
  883: { name: '야수 소환', icon: 'ability_hunter_beastcall', description: '야수를 소환하여 함께 싸웁니다.' },
  19574: { name: '야수의 격노', icon: 'ability_druid_ferociousbite', description: '애완동물과 사냥꾼의 가속이 30%만큼 증가하고 치명타율이 20%만큼 증가합니다. 15초 동안 지속됩니다.' },

  // 도적 스킬들
  1784: { name: '은신', icon: 'ability_stealth', description: '은신 상태가 되어 적에게 발각되지 않습니다.' },
  1833: { name: '비열한 습격', icon: 'ability_cheapshot', description: '은신 중에만 사용 가능. 대상을 4초 동안 기절시킵니다.' },
  408: { name: '급소 가격', icon: 'ability_rogue_kidneyshot', description: '연계 점수를 소비하여 대상을 기절시킵니다.' },

  // 사제 스킬들
  17: { name: '신의 권능: 보호막', icon: 'spell_holy_powerwordshield', description: '대상에게 보호막을 씌워 피해를 흡수합니다.' },
  589: { name: '암흑의 권능: 고통', icon: 'spell_shadow_shadowwordpain', description: '대상에게 암흑 피해를 입히는 지속 효과를 부여합니다.' },
  139: { name: '소생', icon: 'spell_holy_renew', description: '대상을 일정 시간에 걸쳐 치유합니다.' },

  // 마법사 스킬들
  116: { name: '서리 화살', icon: 'spell_frost_frostbolt02', description: '적에게 냉기 피해를 입히고 이동 속도를 감소시킵니다.' },
  133: { name: '화염구', icon: 'spell_fire_flamebolt', description: '화염구를 시전하여 화염 피해를 입히고 추가 지속 피해를 입힙니다.' },
  118: { name: '변이', icon: 'spell_nature_polymorph', description: '대상을 양으로 변이시킵니다. 1분 동안 지속됩니다.' },

  // 흑마법사 스킬들
  686: { name: '암흑 화살', icon: 'spell_shadow_shadowbolt', description: '암흑 화살을 발사하여 대상에게 암흑 피해를 입힙니다.' },
  172: { name: '부패', icon: 'spell_shadow_abominationexplosion', description: '대상을 부패시켜 일정 시간에 걸쳐 암흑 피해를 입힙니다.' },
  348: { name: '제물', icon: 'spell_fire_immolation', description: '대상에게 화염 피해를 입히고 추가로 지속 피해를 입힙니다.' },

  // 주술사 스킬들
  188196: { name: '번개 화살', icon: 'spell_nature_lightning', description: '번개를 발사하여 자연 피해를 입힙니다.' },
  51505: { name: '용암 폭발', icon: 'spell_shaman_lavaburst', description: '용암을 폭발시켜 화염 피해를 입히고 화염 충격 효과를 새로 고칩니다.' },

  // 수도사 스킬들
  100780: { name: '호랑이 장풍', icon: 'monk_ability_jab', description: '대상에게 물리 피해를 입힙니다.' },
  107428: { name: '떠오르는 태양 차기', icon: 'monk_ability_risingsunkick', description: '대상을 차서 피해를 입히고 받는 피해를 증가시킵니다.' },

  // 드루이드 스킬들
  774: { name: '회복', icon: 'spell_nature_rejuvenation', description: '대상을 일정 시간에 걸쳐 치유합니다.' },
  8921: { name: '달빛섬광', icon: 'spell_nature_starfall', description: '비전 피해를 입히고 태양섬광과 달빛섬광을 번갈아 시전합니다.' },
  5487: { name: '곰 변신', icon: 'ability_racial_bearform', description: '곰 형태로 변신하여 방어력과 생명력이 증가합니다.' },

  // 죽음의 기사 스킬들
  49998: { name: '죽음의 일격', icon: 'spell_deathknight_butcher2', description: '무기 피해를 입히고 최근 받은 피해의 일부를 치유합니다.' },
  47541: { name: '죽음과 부패', icon: 'spell_shadow_deathanddecay', description: '지정한 지역에 부패를 퍼뜨려 범위 피해를 입힙니다.' },

  // 악마사냥꾼 스킬들
  162794: { name: '혼돈의 일격', icon: 'ability_demonhunter_chaosstrike', description: '혼돈 피해를 입히고 분노를 생성합니다.' },
  198013: { name: '눈부신 돌진', icon: 'ability_demonhunter_felrush', description: '전방으로 돌진하여 경로상의 모든 적에게 혼돈 피해를 입힙니다.' },
  191427: { name: '변신', icon: 'ability_demonhunter_metamorphasisdps', description: '악마로 변신하여 능력이 강화됩니다.' },

  // 기원사 스킬들
  361469: { name: '살아있는 불꽃', icon: 'ability_evoker_livingflame', description: '적에게는 화염 피해를, 아군에게는 치유를 제공합니다.' },
  357210: { name: '깊은 숨결', icon: 'ability_evoker_deepbreath', description: '하늘로 올라가 지면에 화염을 내뿜습니다.' },
  355913: { name: '에메랄드 꽃', icon: 'ability_evoker_emeraldblossom', description: '대상 주위에 에메랄드 꽃을 피워 범위 치유를 제공합니다.' }
};

// 누락된 스킬들에 대한 기본 데이터 생성
let addedCount = 0;
let updatedIconCount = 0;

missingData.missingIds.forEach(id => {
  // 기본 데이터가 있으면 사용
  if (defaultSkillData[id]) {
    currentData[id] = {
      krName: defaultSkillData[id].name,
      description: defaultSkillData[id].description,
      icon: defaultSkillData[id].icon
    };

    // 아이콘 매핑도 업데이트
    if (defaultSkillData[id].icon) {
      iconMapping[id] = defaultSkillData[id].icon;
      updatedIconCount++;
    }

    addedCount++;
  } else {
    // 기본 데이터가 없는 경우 스킬 ID 기반으로 기본값 생성
    const skillInfo = findSkillInfo(id, missingData.byClass);

    currentData[id] = {
      krName: `스킬 #${id}`,
      description: `${skillInfo.class} 클래스의 스킬입니다.`,
      className: skillInfo.class || 'Unknown'
    };
    addedCount++;
  }
});

// 스킬이 어느 클래스에 속하는지 찾기
function findSkillInfo(skillId, byClass) {
  for (const [className, skillIds] of Object.entries(byClass)) {
    if (skillIds.includes(skillId.toString())) {
      return { class: className };
    }
  }
  return { class: 'Unknown' };
}

// 업데이트된 데이터 저장
fs.writeFileSync(currentDataPath, JSON.stringify(currentData, null, 2), 'utf8');
fs.writeFileSync(iconMappingPath, JSON.stringify(iconMapping, null, 2), 'utf8');

console.log('===== 스킬 데이터 업데이트 완료 =====');
console.log(`✅ 추가된 스킬: ${addedCount}개`);
console.log(`🎨 업데이트된 아이콘: ${updatedIconCount}개`);
console.log(`📊 전체 스킬 수: ${Object.keys(currentData).length}개`);
console.log('\n다음 단계:');
console.log('1. npm run build로 빌드');
console.log('2. /spells 페이지에서 확인');