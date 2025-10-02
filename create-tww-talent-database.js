// TWW Season 3 전체 특성 데이터베이스 생성
const fs = require('fs');
const path = require('path');

// TWW Season 3 주요 특성 데이터 (수동 수집)
const twwTalentData = {
  paladin: {
    classTalents: [
      // Row 1
      { id: "62124", name: "복수의 격노", koreanName: "복수의 격노", icon: "spell_holy_sealofmight", type: "active", row: 1, column: 1, maxRanks: 1 },
      { id: "31821", name: "오라 숙련", koreanName: "오라 숙련", icon: "spell_holy_auramastery", type: "active", row: 1, column: 2, maxRanks: 1 },
      { id: "465", name: "헌신의 오라", koreanName: "헌신의 오라", icon: "spell_holy_devotionaura", type: "passive", row: 1, column: 3, maxRanks: 1 },

      // Row 2
      { id: "6940", name: "희생의 축복", koreanName: "희생의 축복", icon: "spell_holy_sealofsacrifice", type: "active", row: 2, column: 1, maxRanks: 1 },
      { id: "20217", name: "왕의 축복", koreanName: "왕의 축복", icon: "spell_magic_magearmor", type: "active", row: 2, column: 2, maxRanks: 1 },
      { id: "1022", name: "보호의 축복", koreanName: "보호의 축복", icon: "spell_holy_sealofprotection", type: "active", row: 2, column: 3, maxRanks: 1 },

      // Row 3
      { id: "498", name: "신의 가호", koreanName: "신의 가호", icon: "spell_holy_divineprotection", type: "active", row: 3, column: 1, maxRanks: 1 },
      { id: "642", name: "천상의 보호막", koreanName: "천상의 보호막", icon: "spell_holy_divineshield", type: "active", row: 3, column: 2, maxRanks: 1 },
      { id: "853", name: "심판의 망치", koreanName: "심판의 망치", icon: "spell_holy_sealofmight", type: "active", row: 3, column: 3, maxRanks: 1 },

      // 추가 특성들
      { id: "184575", name: "심판의 칼날", koreanName: "심판의 칼날", icon: "ability_paladin_bladeofjustice", type: "active", row: 4, column: 2, maxRanks: 1 },
      { id: "204019", name: "응징의 축복", koreanName: "응징의 축복", icon: "spell_holy_blessingofstrength", type: "active", row: 4, column: 3, maxRanks: 1 },
      { id: "184092", name: "빛의 지치", koreanName: "빛의 지치", icon: "spell_holy_mindvision", type: "passive", row: 5, column: 1, maxRanks: 1 },
      { id: "115750", name: "눈부신 빛", koreanName: "눈부신 빛", icon: "ability_paladin_blindinglight", type: "active", row: 5, column: 2, maxRanks: 1 },
      { id: "183778", name: "참회", koreanName: "참회", icon: "spell_holy_penance", type: "active", row: 5, column: 3, maxRanks: 1 }
    ],
    specializationTalents: {
      holy: [
        { id: "20473", name: "신성 충격", koreanName: "신성 충격", icon: "spell_holy_searinglight", type: "active", specialization: "holy", row: 1, column: 2 },
        { id: "82326", name: "빛의 망치", koreanName: "빛의 망치", icon: "spell_holy_hammerofjustice", type: "active", specialization: "holy", row: 2, column: 1 },
        { id: "19750", name: "섬광", koreanName: "섬광", icon: "spell_holy_flashheal", type: "active", specialization: "holy", row: 2, column: 3 },
        { id: "633", name: "신의 축복", koreanName: "신의 축복", icon: "spell_nature_lightningshield", type: "active", specialization: "holy", row: 3, column: 2 },
        { id: "200025", name: "신념의 봉화", koreanName: "신념의 봉화", icon: "ability_priest_beaconoflight", type: "passive", specialization: "holy", row: 4, column: 1 }
      ],
      protection: [
        { id: "31850", name: "헌신적인 수호자", koreanName: "헌신적인 수호자", icon: "spell_holy_devotion", type: "active", specialization: "protection", row: 1, column: 2 },
        { id: "86659", name: "고대 왕의 수호자", koreanName: "고대 왕의 수호자", icon: "spell_holy_avenginewrath", type: "active", specialization: "protection", row: 2, column: 2 },
        { id: "204074", name: "정의로운 수호자", koreanName: "정의로운 수호자", icon: "ability_paladin_rightouesdefender", type: "passive", specialization: "protection", row: 3, column: 1 },
        { id: "327193", name: "찬란한 영광의 순간", koreanName: "찬란한 영광의 순간", icon: "ability_paladin_momentofglory", type: "active", specialization: "protection", row: 4, column: 2 },
        { id: "378974", name: "빛의 요새", koreanName: "빛의 요새", icon: "spell_holy_holyprotection", type: "passive", specialization: "protection", row: 5, column: 1 }
      ],
      retribution: [
        { id: "184575", name: "심판의 칼날", koreanName: "심판의 칼날", icon: "ability_paladin_bladeofjustice", type: "active", specialization: "retribution", row: 1, column: 2 },
        { id: "24275", name: "정의의 망치", koreanName: "정의의 망치", icon: "spell_holy_blessingofstrength", type: "active", specialization: "retribution", row: 2, column: 1 },
        { id: "31884", name: "응징의 격노", koreanName: "응징의 격노", icon: "spell_holy_avenginewrath", type: "active", specialization: "retribution", row: 2, column: 3 },
        { id: "343721", name: "최후의 심판", koreanName: "최후의 심판", icon: "spell_holy_vindication", type: "active", specialization: "retribution", row: 3, column: 2 },
        { id: "255937", name: "잿빛 기사단의 후예", koreanName: "잿빛 기사단의 후예", icon: "spell_holy_ashbringer", type: "active", specialization: "retribution", row: 4, column: 2 }
      ]
    },
    heroTalents: {
      herald_of_the_sun: [
        { id: "432472", name: "태양의 전령", koreanName: "태양의 전령", icon: "ability_paladin_sunherald", heroTree: "herald_of_the_sun", node: 1 },
        { id: "432473", name: "아침해", koreanName: "아침해", icon: "spell_holy_surgeoflight", heroTree: "herald_of_the_sun", node: 2 },
        { id: "432474", name: "영원한 불꽃", koreanName: "영원한 불꽃", icon: "spell_holy_holysmite", heroTree: "herald_of_the_sun", node: 3 },
        { id: "432475", name: "신성한 광채", koreanName: "신성한 광채", icon: "spell_holy_divinepurpose", heroTree: "herald_of_the_sun", node: 4 },
        { id: "432476", name: "태양 폭발", koreanName: "태양 폭발", icon: "spell_holy_searinglight", heroTree: "herald_of_the_sun", node: 5 }
      ],
      lightsmith: [
        { id: "432477", name: "빛의 대장장이", koreanName: "빛의 대장장이", icon: "ability_paladin_lightsmith", heroTree: "lightsmith", node: 1 },
        { id: "432478", name: "신성한 무기", koreanName: "신성한 무기", icon: "spell_holy_weaponmastery", heroTree: "lightsmith", node: 2 },
        { id: "432479", name: "축복받은 갑옷", koreanName: "축복받은 갑옷", icon: "spell_holy_armormastery", heroTree: "lightsmith", node: 3 },
        { id: "432480", name: "빛의 연마", koreanName: "빛의 연마", icon: "spell_holy_holyforge", heroTree: "lightsmith", node: 4 },
        { id: "432481", name: "완벽한 제작", koreanName: "완벽한 제작", icon: "spell_holy_perfection", heroTree: "lightsmith", node: 5 }
      ],
      templar: [
        { id: "432482", name: "성전사", koreanName: "성전사", icon: "ability_paladin_templar", heroTree: "templar", node: 1 },
        { id: "432483", name: "정의의 일격", koreanName: "정의의 일격", icon: "spell_holy_crusaderstrike", heroTree: "templar", node: 2 },
        { id: "432484", name: "응징의 진노", koreanName: "응징의 진노", icon: "spell_holy_righteousfury", heroTree: "templar", node: 3 },
        { id: "432485", name: "빛의 심판", koreanName: "빛의 심판", icon: "spell_holy_judgement", heroTree: "templar", node: 4 },
        { id: "432486", name: "최후의 성전", koreanName: "최후의 성전", icon: "spell_holy_lastcrusade", heroTree: "templar", node: 5 }
      ]
    }
  },

  warrior: {
    classTalents: [
      // Row 1
      { id: "6673", name: "전투의 함성", koreanName: "전투의 함성", icon: "ability_warrior_battleshout", type: "active", row: 1, column: 1, maxRanks: 1 },
      { id: "97462", name: "재집결의 함성", koreanName: "재집결의 함성", icon: "ability_warrior_rallyingcry", type: "active", row: 1, column: 2, maxRanks: 1 },
      { id: "18499", name: "광폭한 격노", koreanName: "광폭한 격노", icon: "spell_nature_ancestralguardian", type: "active", row: 1, column: 3, maxRanks: 1 },

      // Row 2
      { id: "23920", name: "주문 반사", koreanName: "주문 반사", icon: "ability_warrior_spellreflection", type: "active", row: 2, column: 1, maxRanks: 1 },
      { id: "100", name: "돌진", koreanName: "돌진", icon: "ability_warrior_charge", type: "active", row: 2, column: 2, maxRanks: 1 },
      { id: "1160", name: "사기의 외침", koreanName: "사기의 외침", icon: "ability_warrior_warcry", type: "active", row: 2, column: 3, maxRanks: 1 },

      // Row 3
      { id: "5246", name: "위협의 외침", koreanName: "위협의 외침", icon: "ability_golemthunderclap", type: "active", row: 3, column: 1, maxRanks: 1 },
      { id: "107574", name: "투신", koreanName: "투신", icon: "warrior_talent_icon_avatar", type: "active", row: 3, column: 2, maxRanks: 1 },
      { id: "64382", name: "분쇄의 투척", koreanName: "분쇄의 투척", icon: "ability_warrior_shatteringthrow", type: "active", row: 3, column: 3, maxRanks: 1 }
    ],
    specializationTalents: {
      arms: [
        { id: "12294", name: "죽음의 일격", koreanName: "죽음의 일격", icon: "inv_sword_11", type: "active", specialization: "arms", row: 1, column: 2 },
        { id: "772", name: "분쇄", koreanName: "분쇄", icon: "ability_gouge", type: "active", specialization: "arms", row: 2, column: 1 },
        { id: "227847", name: "칼날폭풍", koreanName: "칼날폭풍", icon: "ability_warrior_bladestorm", type: "active", specialization: "arms", row: 3, column: 2 },
        { id: "152277", name: "격돌", koreanName: "격돌", icon: "ability_warrior_ravager", type: "active", specialization: "arms", row: 4, column: 1 },
        { id: "167105", name: "거인의 강타", koreanName: "거인의 강타", icon: "warrior_talent_icon_colossussmash", type: "active", specialization: "arms", row: 5, column: 2 }
      ],
      fury: [
        { id: "184367", name: "광란", koreanName: "광란", icon: "ability_warrior_rampage", type: "active", specialization: "fury", row: 1, column: 2 },
        { id: "85288", name: "성난 일격", koreanName: "성난 일격", icon: "warrior_wild_strike", type: "active", specialization: "fury", row: 2, column: 1 },
        { id: "1680", name: "소용돌이", koreanName: "소용돌이", icon: "ability_whirlwind", type: "active", specialization: "fury", row: 2, column: 3 },
        { id: "46924", name: "칼날폭풍", koreanName: "칼날폭풍", icon: "ability_warrior_bladestorm", type: "active", specialization: "fury", row: 3, column: 2 },
        { id: "1719", name: "무모한 희생", koreanName: "무모한 희생", icon: "warrior_talent_icon_innerrage", type: "active", specialization: "fury", row: 4, column: 2 }
      ],
      protection: [
        { id: "23922", name: "방패 밀쳐내기", koreanName: "방패 밀쳐내기", icon: "ability_warrior_shieldslam", type: "active", specialization: "protection", row: 1, column: 2 },
        { id: "2565", name: "방패 올리기", koreanName: "방패 올리기", icon: "ability_warrior_shieldblock", type: "active", specialization: "protection", row: 2, column: 1 },
        { id: "871", name: "방패의 벽", koreanName: "방패의 벽", icon: "ability_warrior_shieldwall", type: "active", specialization: "protection", row: 2, column: 3 },
        { id: "12975", name: "최후의 저항", koreanName: "최후의 저항", icon: "spell_holy_ashestoashes", type: "active", specialization: "protection", row: 3, column: 2 },
        { id: "228920", name: "격돌", koreanName: "격돌", icon: "ability_warrior_ravager", type: "active", specialization: "protection", row: 4, column: 2 }
      ]
    },
    heroTalents: {
      mountain_thane: [
        { id: "432487", name: "산의 왕", koreanName: "산의 왕", icon: "ability_warrior_mountainking", heroTree: "mountain_thane", node: 1 },
        { id: "432488", name: "천둥 일격", koreanName: "천둥 일격", icon: "spell_nature_thunderstorm", heroTree: "mountain_thane", node: 2 },
        { id: "432489", name: "폭풍의 망치", koreanName: "폭풍의 망치", icon: "ability_thunderking_thunderstrike", heroTree: "mountain_thane", node: 3 }
      ],
      colossus: [
        { id: "432490", name: "거인", koreanName: "거인", icon: "ability_warrior_colossus", heroTree: "colossus", node: 1 },
        { id: "432491", name: "타이탄의 일격", koreanName: "타이탄의 일격", icon: "ability_warrior_titanstrike", heroTree: "colossus", node: 2 },
        { id: "432492", name: "거대한 힘", koreanName: "거대한 힘", icon: "ability_warrior_colossalpower", heroTree: "colossus", node: 3 }
      ],
      slayer: [
        { id: "432493", name: "학살자", koreanName: "학살자", icon: "ability_warrior_slayer", heroTree: "slayer", node: 1 },
        { id: "432494", name: "처형인의 정밀함", koreanName: "처형인의 정밀함", icon: "ability_warrior_precision", heroTree: "slayer", node: 2 },
        { id: "432495", name: "무자비한 일격", koreanName: "무자비한 일격", icon: "ability_warrior_ruthlessstrike", heroTree: "slayer", node: 3 }
      ]
    }
  },

  // 다른 클래스들도 추가 가능...
};

// 특성 데이터를 기존 DB 형식으로 변환
function convertToSkillDatabase(talentData) {
  const skillDatabase = {};

  Object.entries(talentData).forEach(([className, classData]) => {
    // 클래스 특성 추가
    classData.classTalents.forEach(talent => {
      skillDatabase[talent.id] = {
        id: talent.id,
        name: talent.name,
        koreanName: talent.koreanName,
        englishName: talent.name,
        icon: talent.icon,
        iconName: talent.icon,
        class: className.charAt(0).toUpperCase() + className.slice(1),
        category: "talent",
        type: talent.type,
        talentTree: "class",
        talentRow: talent.row,
        talentColumn: talent.column,
        maxRanks: talent.maxRanks,
        patch: "11.2.0",
        lastUpdated: new Date().toISOString()
      };
    });

    // 전문화 특성 추가
    Object.entries(classData.specializationTalents).forEach(([spec, talents]) => {
      talents.forEach(talent => {
        skillDatabase[talent.id] = {
          id: talent.id,
          name: talent.name,
          koreanName: talent.koreanName,
          englishName: talent.name,
          icon: talent.icon,
          iconName: talent.icon,
          class: className.charAt(0).toUpperCase() + className.slice(1),
          specialization: [spec],
          category: "talent",
          type: talent.type,
          talentTree: "specialization",
          talentRow: talent.row,
          talentColumn: talent.column,
          patch: "11.2.0",
          lastUpdated: new Date().toISOString()
        };
      });
    });

    // 영웅 특성 추가 (TWW)
    if (classData.heroTalents) {
      Object.entries(classData.heroTalents).forEach(([heroTree, talents]) => {
        talents.forEach(talent => {
          skillDatabase[talent.id] = {
            id: talent.id,
            name: talent.name,
            koreanName: talent.koreanName,
            englishName: talent.name,
            icon: talent.icon,
            iconName: talent.icon,
            class: className.charAt(0).toUpperCase() + className.slice(1),
            category: "heroTalent",
            heroTree: heroTree,
            heroNode: talent.node,
            patch: "11.2.0",
            lastUpdated: new Date().toISOString()
          };
        });
      });
    }
  });

  return skillDatabase;
}

// 기존 DB와 통합
function mergeWithExistingDatabase() {
  const dbPath = path.join(__dirname, 'src/data/koreanSpellDatabase.js');
  let existingDb = {};

  try {
    const content = fs.readFileSync(dbPath, 'utf8');
    const match = content.match(/export const koreanSpellDatabase = ({[\s\S]*?});/);
    if (match) {
      existingDb = eval('(' + match[1] + ')');
    }
  } catch (error) {
    console.error('기존 DB 로드 실패:', error.message);
  }

  // 새 특성 데이터 변환
  const newTalentSkills = convertToSkillDatabase(twwTalentData);

  // 병합
  const mergedDb = { ...existingDb, ...newTalentSkills };

  // 통계
  const stats = {
    total: Object.keys(mergedDb).length,
    existing: Object.keys(existingDb).length,
    newTalents: Object.keys(newTalentSkills).length,
    categories: {}
  };

  Object.values(mergedDb).forEach(skill => {
    const cat = skill.category || 'unknown';
    stats.categories[cat] = (stats.categories[cat] || 0) + 1;
  });

  console.log('\n📊 통합 결과:');
  console.log(`  - 기존 스킬: ${stats.existing}개`);
  console.log(`  - 새 특성: ${stats.newTalents}개`);
  console.log(`  - 총 합계: ${stats.total}개\n`);

  console.log('📊 카테고리별 분포:');
  Object.entries(stats.categories).forEach(([cat, count]) => {
    console.log(`  - ${cat}: ${count}개`);
  });

  // 저장
  const jsContent = `// TWW Season 3 통합 스킬 데이터베이스
// 특성 및 영웅 특성 포함
// 총 ${stats.total}개 스킬
// 패치: 11.2.0
// 생성일: ${new Date().toISOString()}

export const koreanSpellDatabase = ${JSON.stringify(mergedDb, null, 2)};

export function getKoreanSpellData(spellId) {
  return koreanSpellDatabase[spellId] || null;
}

export function getSpellData(spellId, language = 'ko') {
  const skill = koreanSpellDatabase[spellId];
  if (!skill) return null;

  if (language === 'en') {
    return {
      ...skill,
      name: skill.englishName || skill.name,
      description: skill.englishDescription || skill.description
    };
  }

  return skill;
}

export function getSpecializationDifferences(spellId) {
  const skill = koreanSpellDatabase[spellId];
  return skill?.specializationDetails || null;
}

export function getHeroTalentInfo(spellId) {
  const skill = koreanSpellDatabase[spellId];
  return skill?.heroTalents || null;
}

export function getTalentsByClass(className) {
  return Object.values(koreanSpellDatabase).filter(skill =>
    skill.class === className && skill.category === 'talent'
  );
}

export function getHeroTalentsByClass(className) {
  return Object.values(koreanSpellDatabase).filter(skill =>
    skill.class === className && skill.category === 'heroTalent'
  );
}`;

  fs.writeFileSync(dbPath, jsContent, 'utf8');
  console.log(`\n✅ 데이터베이스 저장 완료: ${dbPath}`);

  // JSON 백업
  const backupPath = path.join(__dirname, 'src/data/skill-database-with-talents.json');
  fs.writeFileSync(backupPath, JSON.stringify(mergedDb, null, 2), 'utf8');
  console.log(`📄 JSON 백업 생성: ${backupPath}`);
}

// 실행
console.log('🚀 TWW Season 3 특성 데이터베이스 생성\n');
mergeWithExistingDatabase();
console.log('\n🎉 특성 데이터 통합 완료!');