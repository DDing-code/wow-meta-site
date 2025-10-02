// TWW Season 3 죽음의 기사 특성 추가
// PvP 특성 제외, 11.2 패치 기준

const fs = require('fs');
const path = require('path');

function addDeathKnightTalents() {
  const dbPath = path.join(__dirname, 'src/data/koreanSpellDatabase.js');
  let content = fs.readFileSync(dbPath, 'utf8');

  console.log('🔍 TWW Season 3 죽음의 기사 특성 추가...\n');

  // 죽음의 기사 클래스 특성 (TWW S3)
  const deathKnightClassTalents = {
    // Row 1
    "376079": {
      name: "사슬 고리",
      icon: "spell_deathknight_chainlink",
      type: "talent",
      class: "DEATHKNIGHT",
      category: "class",
      koreanName: "사슬 고리",
      englishName: "Chains of Ice"
    },
    "48265": {
      name: "죽음의 진군",
      icon: "spell_shadow_deadofnight",
      type: "talent",
      class: "DEATHKNIGHT",
      category: "class",
      koreanName: "죽음의 진군",
      englishName: "Death's Advance"
    },
    "47528": {
      name: "정신 얼리기",
      icon: "spell_deathknight_mindfreeze",
      type: "talent",
      class: "DEATHKNIGHT",
      category: "class",
      koreanName: "정신 얼리기",
      englishName: "Mind Freeze"
    },

    // Row 2
    "48707": {
      name: "대마법 보호막",
      icon: "spell_shadow_antimagicshell",
      type: "talent",
      class: "DEATHKNIGHT",
      category: "class",
      koreanName: "대마법 보호막",
      englishName: "Anti-Magic Shell"
    },
    "51271": {
      name: "지옥불 칼날",
      icon: "ability_deathknight_pillaroffrost",
      type: "talent",
      class: "DEATHKNIGHT",
      category: "class",
      koreanName: "지옥불 칼날",
      englishName: "Pillar of Frost"
    },
    "48792": {
      name: "얼음같은 인내력",
      icon: "spell_deathknight_iceboundfortitude",
      type: "talent",
      class: "DEATHKNIGHT",
      category: "class",
      koreanName: "얼음같은 인내력",
      englishName: "Icebound Fortitude"
    },

    // Row 3
    "377048": {
      name: "피의 끓어오름",
      icon: "ability_blood_scentofblood",
      type: "talent",
      class: "DEATHKNIGHT",
      category: "class",
      koreanName: "피의 끓어오름",
      englishName: "Blood Boil"
    },
    "56222": {
      name: "어둠의 명령",
      icon: "spell_nature_shamanrage",
      type: "talent",
      class: "DEATHKNIGHT",
      category: "class",
      koreanName: "어둠의 명령",
      englishName: "Dark Command"
    },
    "43265": {
      name: "죽음과 부패",
      icon: "spell_shadow_deathanddecay",
      type: "talent",
      class: "DEATHKNIGHT",
      category: "class",
      koreanName: "죽음과 부패",
      englishName: "Death and Decay"
    }
  };

  // 죽음의 기사 전문화별 특성
  const deathKnightSpecTalents = {
    // 혈기 (Blood) 특성
    blood: {
      "195182": {
        name: "골수 분쇄",
        icon: "ability_deathknight_marrowrend",
        type: "talent",
        class: "DEATHKNIGHT",
        spec: "blood",
        category: "specialization",
        koreanName: "골수 분쇄",
        englishName: "Marrowrend"
      },
      "50842": {
        name: "피의 끓어오름",
        icon: "spell_deathknight_bloodboil",
        type: "talent",
        class: "DEATHKNIGHT",
        spec: "blood",
        category: "specialization",
        koreanName: "피의 끓어오름",
        englishName: "Blood Boil"
      },
      "206931": {
        name: "흡혈",
        icon: "spell_shadow_lifedrain",
        type: "talent",
        class: "DEATHKNIGHT",
        spec: "blood",
        category: "specialization",
        koreanName: "흡혈",
        englishName: "Blooddrinker"
      }
    },

    // 냉기 (Frost) 특성
    frost: {
      "152279": {
        name: "숨결 고정",
        icon: "ability_deathknight_breathofsindragosa",
        type: "talent",
        class: "DEATHKNIGHT",
        spec: "frost",
        category: "specialization",
        koreanName: "숨결 고정",
        englishName: "Breath of Sindragosa"
      },
      "49020": {
        name: "냉기 돌풍",
        icon: "spell_deathknight_empowerruneblade2",
        type: "talent",
        class: "DEATHKNIGHT",
        spec: "frost",
        category: "specialization",
        koreanName: "냉기 돌풍",
        englishName: "Obliteration"
      },
      "194913": {
        name: "빙하 진군",
        icon: "ability_deathknight_glacialadvance",
        type: "talent",
        class: "DEATHKNIGHT",
        spec: "frost",
        category: "specialization",
        koreanName: "빙하 진군",
        englishName: "Glacial Advance"
      }
    },

    // 부정 (Unholy) 특성
    unholy: {
      "275699": {
        name: "재앙의 일격",
        icon: "spell_deathknight_apocalypse",
        type: "talent",
        class: "DEATHKNIGHT",
        spec: "unholy",
        category: "specialization",
        koreanName: "재앙의 일격",
        englishName: "Apocalypse"
      },
      "152280": {
        name: "악의의 광란",
        icon: "spell_shadow_unholyfrenzy",
        type: "talent",
        class: "DEATHKNIGHT",
        spec: "unholy",
        category: "specialization",
        koreanName: "악의의 광란",
        englishName: "Unholy Frenzy"
      },
      "207317": {
        name: "유행성 역병",
        icon: "spell_shadow_plaguecloud",
        type: "talent",
        class: "DEATHKNIGHT",
        spec: "unholy",
        category: "specialization",
        koreanName: "유행성 역병",
        englishName: "Epidemic"
      }
    }
  };

  // 영웅 특성 (Hero Talents)
  const deathKnightHeroTalents = {
    // 죽음인도자 (Deathbringer)
    deathbringer: {
      "440002": {
        name: "죽음인도자",
        icon: "achievement_raid_ulduar_algalon_01",
        type: "heroTalent",
        class: "DEATHKNIGHT",
        heroTree: "deathbringer",
        koreanName: "죽음인도자",
        englishName: "Deathbringer"
      },
      "440003": {
        name: "피의 열정",
        icon: "spell_shadow_bloodboil",
        type: "heroTalent",
        class: "DEATHKNIGHT",
        heroTree: "deathbringer",
        koreanName: "피의 열정",
        englishName: "Blood Fever"
      }
    },

    // 산레인 (San'layn)
    sanlayn: {
      "440004": {
        name: "산레인",
        icon: "spell_shadow_bloodboil",
        type: "heroTalent",
        class: "DEATHKNIGHT",
        heroTree: "san-layn",
        koreanName: "산레인",
        englishName: "San'layn"
      },
      "440005": {
        name: "흡혈귀의 피",
        icon: "spell_shadow_lifedrain",
        type: "heroTalent",
        class: "DEATHKNIGHT",
        heroTree: "san-layn",
        koreanName: "흡혈귀의 피",
        englishName: "Vampiric Blood"
      }
    },

    // 종말의 기수 (Rider of the Apocalypse)
    rider: {
      "440006": {
        name: "종말의 기수",
        icon: "spell_deathknight_summondeathcharger",
        type: "heroTalent",
        class: "DEATHKNIGHT",
        heroTree: "rider-of-the-apocalypse",
        koreanName: "종말의 기수",
        englishName: "Rider of the Apocalypse"
      },
      "440007": {
        name: "묵시의 군마",
        icon: "ability_mount_dreadsteed",
        type: "heroTalent",
        class: "DEATHKNIGHT",
        heroTree: "rider-of-the-apocalypse",
        koreanName: "묵시의 군마",
        englishName: "Apocalypse Steed"
      }
    }
  };

  // 데이터베이스에 추가
  let addCount = 0;

  // 클래스 특성 추가
  Object.entries(deathKnightClassTalents).forEach(([id, skill]) => {
    if (!content.includes(`"${id}"`)) {
      const skillEntry = `  "${id}": ${JSON.stringify(skill, null, 2).replace(/\n/g, '\n  ')},\n`;
      const insertPos = content.lastIndexOf('};');
      content = content.slice(0, insertPos) + skillEntry + content.slice(insertPos);
      addCount++;
      console.log(`  ✅ 클래스 특성 추가: ${skill.koreanName} (${id})`);
    }
  });

  // 전문화별 특성 추가
  Object.values(deathKnightSpecTalents).forEach(specTalents => {
    Object.entries(specTalents).forEach(([id, skill]) => {
      if (!content.includes(`"${id}"`)) {
        const skillEntry = `  "${id}": ${JSON.stringify(skill, null, 2).replace(/\n/g, '\n  ')},\n`;
        const insertPos = content.lastIndexOf('};');
        content = content.slice(0, insertPos) + skillEntry + content.slice(insertPos);
        addCount++;
        console.log(`  ✅ 전문화 특성 추가: ${skill.koreanName} (${id})`);
      }
    });
  });

  // 영웅 특성 추가
  Object.values(deathKnightHeroTalents).forEach(heroTalents => {
    Object.entries(heroTalents).forEach(([id, skill]) => {
      if (!content.includes(`"${id}"`)) {
        const skillEntry = `  "${id}": ${JSON.stringify(skill, null, 2).replace(/\n/g, '\n  ')},\n`;
        const insertPos = content.lastIndexOf('};');
        content = content.slice(0, insertPos) + skillEntry + content.slice(insertPos);
        addCount++;
        console.log(`  ✅ 영웅 특성 추가: ${skill.koreanName} (${id})`);
      }
    });
  });

  // 파일 저장
  fs.writeFileSync(dbPath, content, 'utf8');

  console.log(`\n📊 죽음의 기사 특성 추가 완료:`);
  console.log(`  - 총 ${addCount}개 특성 추가`);
  console.log(`  - 클래스 특성: ${Object.keys(deathKnightClassTalents).length}개`);
  console.log(`  - 전문화 특성: ${Object.values(deathKnightSpecTalents).reduce((sum, spec) => sum + Object.keys(spec).length, 0)}개`);
  console.log(`  - 영웅 특성: ${Object.values(deathKnightHeroTalents).reduce((sum, hero) => sum + Object.keys(hero).length, 0)}개`);
}

// 실행
addDeathKnightTalents();

console.log('\n✅ 죽음의 기사 특성 추가 완료!');
console.log('📌 TWW Season 3 기준, PvP 특성 제외');