// 정제된 기원사 데이터베이스에서 메인 DB로 통합
const fs = require('fs').promises;
const path = require('path');

async function integrateEvokerFromRefinedDB() {
  try {
    console.log('🔄 정제된 기원사 데이터 통합 시작...');

    // 1. 정제된 DB 파일 로드
    const refinedDBPath = path.join(__dirname, 'tww-s3-refined-database-with-evoker.json');
    const refinedDBContent = await fs.readFile(refinedDBPath, 'utf-8');
    const refinedDB = JSON.parse(refinedDBContent);

    // 2. 기원사 스킬 필터링 (전문화로 구분)
    const evokerSpecs = ['황폐', '보존', '증강', '공용'];
    const evokerSkills = [];

    console.log('📊 기원사 스킬 추출 중...');
    for (const [skillId, skillData] of Object.entries(refinedDB)) {
      // 기원사 전문화인 경우만 추출
      if (skillData.spec && (
        evokerSpecs.includes(skillData.spec) ||
        skillData.spec.includes('황폐') ||
        skillData.spec.includes('보존') ||
        skillData.spec.includes('증강')
      )) {
        // 메인 DB 형식으로 변환
        const formattedSkill = {
          id: skillData.id || skillId,
          englishName: skillData.englishName || '',
          koreanName: skillData.koreanName || '',
          icon: skillData.icon || 'inv_misc_questionmark',
          type: skillData.type || '기본',
          spec: skillData.spec,
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
        evokerSkills.push(formattedSkill);
      }
    }

    console.log(`✅ ${evokerSkills.length}개의 기원사 스킬을 추출했습니다.`);

    // 전문화별 카운트
    const specCounts = {};
    evokerSkills.forEach(skill => {
      specCounts[skill.spec] = (specCounts[skill.spec] || 0) + 1;
    });
    console.log('📊 전문화별 스킬 수:');
    Object.entries(specCounts).forEach(([spec, count]) => {
      console.log(`  - ${spec}: ${count}개`);
    });

    // 3. 메인 DB 로드
    const mainDBPath = path.join(__dirname, '..', 'src', 'data', 'twwS3FinalCleanedDatabase.js');
    const mainDBContent = await fs.readFile(mainDBPath, 'utf-8');

    const dataMatch = mainDBContent.match(/export const twwS3SkillDatabase = (\[[\s\S]*\]);/);
    if (!dataMatch) {
      throw new Error('메인 데이터베이스 형식을 파싱할 수 없습니다.');
    }

    const mainDatabase = eval(dataMatch[1]);
    console.log(`\n📊 현재 DB 스킬 수: ${mainDatabase.length}개`);

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
    const newContent = `// TWW Season 3 최종 정리된 데이터베이스 (기원사 완전 통합)
// 생성: ${new Date().toISOString()}
// 총 ${updatedDatabase.length}개 스킬 (기원사 ${evokerSkills.length}개 포함)

export const twwS3SkillDatabase = ${JSON.stringify(updatedDatabase, null, 2)};
`;

    // 8. 백업 파일 생성
    const backupPath = mainDBPath.replace('.js', `-backup-${Date.now()}.js`);
    await fs.copyFile(mainDBPath, backupPath);
    console.log(`\n📦 백업 파일 생성: ${path.basename(backupPath)}`);

    // 9. 메인 DB 업데이트
    await fs.writeFile(mainDBPath, newContent);
    console.log(`✅ 메인 데이터베이스 업데이트 완료`);

    // 10. 통계 출력
    const classCounts = {};
    updatedDatabase.forEach(skill => {
      classCounts[skill.class] = (classCounts[skill.class] || 0) + 1;
    });

    console.log('\n📊 최종 클래스별 스킬 수:');
    Object.entries(classCounts).forEach(([cls, count]) => {
      console.log(`  ${cls}: ${count}개`);
    });

    // 11. 기원사 주요 스킬 샘플
    console.log('\n📋 기원사 주요 스킬 샘플:');
    const mainSkills = ['불의 숨결', '영원의 쇄도', '기염', '용의 분노', '파열', '살아있는 불꽃', '하늘빛 일격'];
    const foundSkills = evokerSkills.filter(skill =>
      mainSkills.includes(skill.koreanName)
    );
    foundSkills.forEach(skill => {
      console.log(`  - ${skill.koreanName} (${skill.englishName}) - ${skill.spec}`);
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

// 실행
if (require.main === module) {
  integrateEvokerFromRefinedDB()
    .then(result => {
      console.log('\n✨ 기원사 데이터베이스 정제 통합 완료!');
      console.log(`   총 ${result.evokerSkills}개의 기원사 스킬이 추가되었습니다.`);
      process.exit(0);
    })
    .catch(err => {
      console.error('Fatal error:', err);
      process.exit(1);
    });
}

module.exports = { integrateEvokerFromRefinedDB };