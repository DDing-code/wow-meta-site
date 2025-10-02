// 모든 기원사 스킬을 메인 데이터베이스에 통합하는 포괄적인 스크립트
const fs = require('fs').promises;
const path = require('path');

async function integrateAllEvokerSkills() {
  try {
    console.log('🔄 모든 기원사 스킬 통합 시작...');

    // 1. 기존 기원사 데이터베이스 파일 로드
    const refinedDBPath = path.join(__dirname, 'tww-s3-refined-database-with-evoker.json');
    const refinedDBContent = await fs.readFile(refinedDBPath, 'utf-8');
    const refinedDB = JSON.parse(refinedDBContent);

    // 2. 기원사 스킬 추출
    const evokerSkills = [];
    const evokerData = refinedDB.EVOKER || refinedDB.기원사 || {};

    console.log(`📊 검색된 기원사 스킬 카테고리:`, Object.keys(evokerData));

    // 각 카테고리에서 스킬 추출
    for (const [category, skills] of Object.entries(evokerData)) {
      if (typeof skills === 'object' && skills !== null) {
        for (const [skillKey, skillData] of Object.entries(skills)) {
          if (skillData && typeof skillData === 'object') {
            // 메인 DB 형식으로 변환
            const formattedSkill = {
              id: skillData.id || skillKey,
              englishName: skillData.englishName || skillData.name_en || '',
              koreanName: skillData.koreanName || skillData.name || '',
              icon: skillData.icon || 'inv_misc_questionmark',
              type: skillData.type || getSkillType(category),
              spec: skillData.spec || getSpecFromCategory(category),
              heroTalent: skillData.heroTalent || null,
              level: skillData.level || 1,
              pvp: skillData.pvp || false,
              duration: skillData.duration || "n/a",
              school: skillData.school || "Physical",
              mechanic: skillData.mechanic || "n/a",
              dispelType: skillData.dispelType || "n/a",
              gcd: skillData.gcd || "Normal",
              resourceCost: skillData.resourceCost || "없음",
              range: skillData.range || "0 야드",
              castTime: skillData.castTime || "즉시",
              cooldown: skillData.cooldown || "없음",
              description: skillData.description || "",
              coefficient: skillData.coefficient || null,
              resourceGain: skillData.resourceGain || "없음",
              class: "EVOKER"
            };

            // 중복 체크
            if (!evokerSkills.some(s => s.id === formattedSkill.id)) {
              evokerSkills.push(formattedSkill);
            }
          }
        }
      }
    }

    console.log(`✅ ${evokerSkills.length}개의 기원사 스킬을 추출했습니다.`);

    // 3. 메인 DB 로드
    const mainDBPath = path.join(__dirname, '..', 'src', 'data', 'twwS3FinalCleanedDatabase.js');
    const mainDBContent = await fs.readFile(mainDBPath, 'utf-8');

    const dataMatch = mainDBContent.match(/export const twwS3SkillDatabase = (\[[\s\S]*\]);/);
    if (!dataMatch) {
      throw new Error('메인 데이터베이스 형식을 파싱할 수 없습니다.');
    }

    const mainDatabase = eval(dataMatch[1]);
    console.log(`📊 현재 DB 스킬 수: ${mainDatabase.length}개`);

    // 4. 기존 기원사 스킬 제거
    const nonEvokerSkills = mainDatabase.filter(skill => skill.class !== 'EVOKER');
    console.log(`📊 기원사 제외 스킬 수: ${nonEvokerSkills.length}개`);

    // 5. 새 기원사 스킬 추가
    const updatedDatabase = [...nonEvokerSkills, ...evokerSkills];

    // 6. 클래스별로 정렬
    updatedDatabase.sort((a, b) => {
      const classOrder = [
        'WARRIOR', 'PALADIN', 'HUNTER', 'ROGUE',
        'PRIEST', 'SHAMAN', 'MAGE', 'WARLOCK',
        'MONK', 'DRUID', 'DEMONHUNTER', 'DEATHKNIGHT', 'EVOKER'
      ];
      const aIndex = classOrder.indexOf(a.class);
      const bIndex = classOrder.indexOf(b.class);
      if (aIndex !== bIndex) {
        return aIndex - bIndex;
      }
      return parseInt(a.id) - parseInt(b.id);
    });

    // 7. 새 파일 내용 생성
    const newContent = `// TWW Season 3 최종 정리된 데이터베이스 (기원사 전체 포함)
// 생성: ${new Date().toISOString()}
// 총 ${updatedDatabase.length}개 스킬

export const twwS3SkillDatabase = ${JSON.stringify(updatedDatabase, null, 2)};
`;

    // 8. 백업 파일 생성
    const backupPath = mainDBPath.replace('.js', `-backup-${Date.now()}.js`);
    await fs.copyFile(mainDBPath, backupPath);
    console.log(`📦 백업 파일 생성: ${path.basename(backupPath)}`);

    // 9. 메인 DB 업데이트
    await fs.writeFile(mainDBPath, newContent);
    console.log(`✅ 메인 데이터베이스 업데이트 완료`);

    // 10. 통계 출력
    const classCounts = {};
    updatedDatabase.forEach(skill => {
      classCounts[skill.class] = (classCounts[skill.class] || 0) + 1;
    });

    console.log('\n📊 클래스별 스킬 수:');
    Object.entries(classCounts).forEach(([cls, count]) => {
      console.log(`  ${cls}: ${count}개`);
    });

    // 11. 기원사 스킬 샘플 출력
    console.log('\n📋 기원사 주요 스킬 샘플:');
    const sampleSkills = evokerSkills.slice(0, 10);
    sampleSkills.forEach(skill => {
      console.log(`  - ${skill.koreanName} (${skill.englishName})`);
    });

    return {
      success: true,
      totalSkills: updatedDatabase.length,
      evokerSkills: evokerSkills.length
    };

  } catch (error) {
    console.error('❌ 통합 실패:', error);
    throw error;
  }
}

// 헬퍼 함수들
function getSkillType(category) {
  const typeMap = {
    '기본기술': '기본',
    '주요기술': '주요',
    '특성': '특성',
    '패시브': '패시브',
    '영웅특성': '영웅특성',
    '유틸리티': '유틸리티',
    '방어': '방어',
    '황폐': '기본',
    '보존': '기본',
    '증강': '기본'
  };
  return typeMap[category] || '기본';
}

function getSpecFromCategory(category) {
  const specMap = {
    '황폐': '황폐',
    '보존': '보존',
    '증강': '증강',
    '공용': '공용',
    '기본기술': '공용',
    '유틸리티': '공용',
    '방어': '공용'
  };
  return specMap[category] || '공용';
}

// 실행
if (require.main === module) {
  integrateAllEvokerSkills()
    .then(result => {
      console.log('\n✨ 기원사 데이터베이스 완전 통합 완료!');
      console.log(`   총 ${result.evokerSkills}개의 기원사 스킬이 추가되었습니다.`);
      process.exit(0);
    })
    .catch(err => {
      console.error('Fatal error:', err);
      process.exit(1);
    });
}

module.exports = { integrateAllEvokerSkills };