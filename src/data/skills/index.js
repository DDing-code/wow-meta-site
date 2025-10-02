// 통합 스킬 데이터베이스 인덱스

const warriorSkills = require('./warrior');
const paladinSkills = require('./paladin');
const hunterSkills = require('./hunter');
const rogueSkills = require('./rogue');
const priestSkills = require('./priest');
const deathknightSkills = require('./deathknight');
const shamanSkills = require('./shaman');
const mageSkills = require('./mage');
const warlockSkills = require('./warlock');
const monkSkills = require('./monk');
const druidSkills = require('./druid');
const demonhunterSkills = require('./demonhunter');
const evokerSkills = require('./evoker');

// 모든 클래스 스킬 데이터베이스
const allClassSkills = {
  warrior: warriorSkills,
  paladin: paladinSkills,
  hunter: hunterSkills,
  rogue: rogueSkills,
  priest: priestSkills,
  deathknight: deathknightSkills,
  shaman: shamanSkills,
  mage: mageSkills,
  warlock: warlockSkills,
  monk: monkSkills,
  druid: druidSkills,
  demonhunter: demonhunterSkills,
  evoker: evokerSkills
};

// 클래스별 전문화 매핑
const classSpecializations = {
  warrior: ['arms', 'fury', 'protection'],
  paladin: ['retribution', 'holy', 'protection'],
  hunter: ['beast_mastery', 'marksmanship', 'survival'],
  rogue: ['assassination', 'outlaw', 'subtlety'],
  priest: ['discipline', 'holy', 'shadow'],
  deathknight: ['blood', 'frost', 'unholy'],
  shaman: ['elemental', 'enhancement', 'restoration'],
  mage: ['arcane', 'fire', 'frost'],
  warlock: ['affliction', 'demonology', 'destruction'],
  monk: ['brewmaster', 'mistweaver', 'windwalker'],
  druid: ['balance', 'feral', 'guardian', 'restoration'],
  demonhunter: ['havoc', 'vengeance'],
  evoker: ['devastation', 'preservation', 'augmentation']
};

// 역할별 전문화 분류
const roleSpecializations = {
  tank: [
    { class: 'warrior', spec: 'protection' },
    { class: 'paladin', spec: 'protection' },
    { class: 'deathknight', spec: 'blood' },
    { class: 'monk', spec: 'brewmaster' },
    { class: 'druid', spec: 'guardian' },
    { class: 'demonhunter', spec: 'vengeance' }
  ],
  healer: [
    { class: 'paladin', spec: 'holy' },
    { class: 'priest', spec: 'discipline' },
    { class: 'priest', spec: 'holy' },
    { class: 'shaman', spec: 'restoration' },
    { class: 'monk', spec: 'mistweaver' },
    { class: 'druid', spec: 'restoration' },
    { class: 'evoker', spec: 'preservation' }
  ],
  dps: [
    { class: 'warrior', spec: 'arms' },
    { class: 'warrior', spec: 'fury' },
    { class: 'paladin', spec: 'retribution' },
    { class: 'hunter', spec: 'beast_mastery' },
    { class: 'hunter', spec: 'marksmanship' },
    { class: 'hunter', spec: 'survival' },
    { class: 'rogue', spec: 'assassination' },
    { class: 'rogue', spec: 'outlaw' },
    { class: 'rogue', spec: 'subtlety' },
    { class: 'priest', spec: 'shadow' },
    { class: 'deathknight', spec: 'frost' },
    { class: 'deathknight', spec: 'unholy' },
    { class: 'shaman', spec: 'elemental' },
    { class: 'shaman', spec: 'enhancement' },
    { class: 'mage', spec: 'arcane' },
    { class: 'mage', spec: 'fire' },
    { class: 'mage', spec: 'frost' },
    { class: 'warlock', spec: 'affliction' },
    { class: 'warlock', spec: 'demonology' },
    { class: 'warlock', spec: 'destruction' },
    { class: 'monk', spec: 'windwalker' },
    { class: 'druid', spec: 'balance' },
    { class: 'druid', spec: 'feral' },
    { class: 'demonhunter', spec: 'havoc' },
    { class: 'evoker', spec: 'devastation' },
    { class: 'evoker', spec: 'augmentation' }
  ]
};

// 특정 클래스/전문화의 스킬 가져오기
function getClassSkills(className, specialization = null) {
  const classData = allClassSkills[className];
  if (!classData) {
    console.error(`클래스를 찾을 수 없습니다: ${className}`);
    return null;
  }

  if (specialization) {
    const specData = classData[specialization];
    if (!specData) {
      console.error(`전문화를 찾을 수 없습니다: ${className}/${specialization}`);
      return null;
    }
    // 공통 스킬과 전문화 스킬 결합
    return {
      ...classData.common,
      ...specData
    };
  }

  return classData;
}

// 특정 스킬 검색
function findSkill(skillName) {
  const results = [];

  for (const [className, classData] of Object.entries(allClassSkills)) {
    // 공통 스킬 검색
    for (const [korName, skillData] of Object.entries(classData.common || {})) {
      if (korName === skillName || skillData.name === skillName || skillData.id === skillName) {
        results.push({
          class: className,
          specialization: 'common',
          skill: skillData,
          koreanName: korName
        });
      }
    }

    // 전문화별 스킬 검색
    const specs = classSpecializations[className];
    for (const spec of specs) {
      const specData = classData[spec];
      if (specData) {
        for (const [korName, skillData] of Object.entries(specData)) {
          if (korName === skillName || skillData.name === skillName || skillData.id === skillName) {
            results.push({
              class: className,
              specialization: spec,
              skill: skillData,
              koreanName: korName
            });
          }
        }
      }
    }

    // PvP 특성 검색
    if (classData.pvp_talents) {
      for (const [korName, skillData] of Object.entries(classData.pvp_talents)) {
        if (korName === skillName || skillData.name === skillName || skillData.id === skillName) {
          results.push({
            class: className,
            specialization: 'pvp_talents',
            skill: skillData,
            koreanName: korName
          });
        }
      }
    }
  }

  return results;
}

// 특정 역할의 모든 스킬 가져오기
function getRoleSkills(role) {
  const specs = roleSpecializations[role];
  if (!specs) {
    console.error(`역할을 찾을 수 없습니다: ${role}`);
    return null;
  }

  const roleSkills = {};
  for (const { class: className, spec } of specs) {
    const key = `${className}_${spec}`;
    roleSkills[key] = getClassSkills(className, spec);
  }

  return roleSkills;
}

// 스킬 타입별 분류
function getSkillsByType(type) {
  const skillsByType = {};

  for (const [className, classData] of Object.entries(allClassSkills)) {
    const classSkillsByType = [];

    // 공통 스킬 확인
    for (const [korName, skillData] of Object.entries(classData.common || {})) {
      if (skillData.type === type) {
        classSkillsByType.push({
          koreanName: korName,
          ...skillData,
          specialization: 'common'
        });
      }
    }

    // 전문화별 스킬 확인
    const specs = classSpecializations[className];
    for (const spec of specs) {
      const specData = classData[spec];
      if (specData) {
        for (const [korName, skillData] of Object.entries(specData)) {
          if (skillData.type === type) {
            classSkillsByType.push({
              koreanName: korName,
              ...skillData,
              specialization: spec
            });
          }
        }
      }
    }

    if (classSkillsByType.length > 0) {
      skillsByType[className] = classSkillsByType;
    }
  }

  return skillsByType;
}

// 전체 스킬 개수 통계
function getSkillStatistics() {
  const stats = {};

  for (const [className, classData] of Object.entries(allClassSkills)) {
    const classStats = {
      common: Object.keys(classData.common || {}).length,
      specializations: {},
      pvp: Object.keys(classData.pvp_talents || {}).length,
      total: 0
    };

    const specs = classSpecializations[className];
    for (const spec of specs) {
      const specData = classData[spec];
      if (specData) {
        classStats.specializations[spec] = Object.keys(specData).length;
      }
    }

    classStats.total = classStats.common +
                       Object.values(classStats.specializations).reduce((a, b) => a + b, 0) +
                       classStats.pvp;

    stats[className] = classStats;
  }

  return stats;
}

module.exports = {
  allClassSkills,
  classSpecializations,
  roleSpecializations,
  getClassSkills,
  findSkill,
  getRoleSkills,
  getSkillsByType,
  getSkillStatistics,

  // 개별 클래스 exports
  warriorSkills,
  paladinSkills,
  hunterSkills,
  rogueSkills,
  priestSkills,
  deathknightSkills,
  shamanSkills,
  mageSkills,
  warlockSkills,
  monkSkills,
  druidSkills,
  demonhunterSkills,
  evokerSkills
};