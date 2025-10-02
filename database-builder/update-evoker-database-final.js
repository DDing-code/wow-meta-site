// 기원사 데이터베이스 최종 업데이트 스크립트
const fs = require('fs').promises;
const path = require('path');

async function updateEvokerDatabaseFinal() {
  try {
    console.log('📚 기원사 데이터베이스 최종 업데이트 시작...');

    // 1. 검증된 번역 데이터 로드
    const verifiedPath = path.join(__dirname, 'evoker-skills-verified-final.json');
    const verifiedContent = await fs.readFile(verifiedPath, 'utf-8');
    const verified = JSON.parse(verifiedContent);

    // 2. 현재 데이터베이스 로드
    const dbPath = path.join(__dirname, 'tww-s3-refined-database.json');
    const dbContent = await fs.readFile(dbPath, 'utf-8');
    const database = JSON.parse(dbContent);

    // 3. 업데이트 매핑 생성
    const updateMap = {};

    // 모든 전문화의 검증된 번역 처리
    for (const [spec, skills] of Object.entries(verified.translations)) {
      if (spec === 'missing_skills' || spec === 'translation_map' || spec === 'summary') continue;

      for (const [skillId, skillData] of Object.entries(skills)) {
        if (skillData.verified) {
          updateMap[skillId] = {
            koreanName: skillData.koreanName,
            englishName: skillData.englishName,
            spec: spec === 'common' ? '공용' : spec,
            notes: skillData.notes
          };
        }
      }
    }

    // 4. 데이터베이스 업데이트
    let updateCount = 0;
    let addCount = 0;
    let notFoundCount = 0;
    const notFoundSkills = [];

    for (const [skillId, updateData] of Object.entries(updateMap)) {
      if (database[skillId]) {
        // 기존 스킬 업데이트
        const before = database[skillId].koreanName;
        database[skillId].koreanName = updateData.koreanName;
        database[skillId].englishName = updateData.englishName;

        if (updateData.spec && updateData.spec !== '공용') {
          database[skillId].spec = updateData.spec;
        }

        if (before !== updateData.koreanName) {
          console.log(`✅ ${skillId}: ${before} → ${updateData.koreanName} (${updateData.englishName})`);
          updateCount++;
        } else {
          console.log(`✓ ${skillId}: ${updateData.koreanName} (변경 없음)`);
        }
      } else {
        // 스킬이 데이터베이스에 없는 경우 - 새로 추가
        database[skillId] = {
          id: skillId,
          englishName: updateData.englishName,
          koreanName: updateData.koreanName,
          spec: updateData.spec,
          type: "기본",
          level: 1,
          pvp: false,
          icon: "inv_misc_questionmark", // 나중에 수정 필요
          description: "스킬 설명 추가 필요",
          castTime: "즉시",
          cooldown: "해당 없음",
          range: "25 야드",
          resourceCost: "없음",
          resourceGain: "없음"
        };
        console.log(`➕ ${skillId}: 새로 추가됨 - ${updateData.koreanName} (${updateData.englishName})`);
        addCount++;
      }
    }

    // 5. 백업 생성
    const backupPath = path.join(__dirname, `tww-s3-refined-database-backup-${Date.now()}.json`);
    await fs.copyFile(dbPath, backupPath);
    console.log(`\n📦 원본 파일 백업: ${backupPath}`);

    // 6. 업데이트된 데이터베이스 저장
    await fs.writeFile(dbPath, JSON.stringify(database, null, 2));
    console.log(`✅ 데이터베이스 업데이트 완료: ${dbPath}`);

    // 7. 통계 출력
    console.log(`\n📊 업데이트 통계:`);
    console.log(`- 업데이트된 스킬: ${updateCount}개`);
    console.log(`- 새로 추가된 스킬: ${addCount}개`);
    console.log(`- 총 처리: ${updateCount + addCount}개`);

    // 8. 주요 변경 사항 요약
    console.log(`\n🔄 주요 번역 수정:`);
    const majorChanges = [
      '푸른 비늘 → 하늘빛 일격 (Azure Strike)',
      '장염룡포 → 기염 (Pyre)',
      '분해의 불길 → 파열 (Disintegrate)',
      '청록빛 꽃 → 에메랄드 꽃 (Emerald Blossom)',
      '정령의 꽃 → 영혼 만개 (Spiritbloom)',
      '푸른 포옹 → 신록의 품 (Verdant Embrace)',
      '반향 → 메아리 (Echo)',
      '되돌리기 → 되돌리기 (Reversion)',
      '정지 → 정지장 (Stasis)',
      '칠흑의 세력 → 칠흑의 힘 (Ebon Might)',
      '선제의 일격 → 예지 (Prescience)',
      '운명의 숨결 → 영겁의 숨결 (Breath of Eons)',
      '대변동 → 대격변 (Upheaval)',
      '쇄신 → 소생의 불길 (Renewing Blaze)',
      '엮어짜기 → 업화 (Engulf)'
    ];

    majorChanges.forEach(change => console.log(`  ${change}`));

    return { updateCount, addCount, notFoundCount };

  } catch (error) {
    console.error('❌ 업데이트 실패:', error);
    throw error;
  }
}

// 실행
if (require.main === module) {
  updateEvokerDatabaseFinal()
    .then(result => {
      console.log('\n✨ 기원사 데이터베이스 최종 업데이트 완료!');
      process.exit(0);
    })
    .catch(err => {
      console.error('Fatal error:', err);
      process.exit(1);
    });
}

module.exports = { updateEvokerDatabaseFinal };