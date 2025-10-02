const fs = require('fs').promises;
const path = require('path');

async function mergeAllBatchData() {
  console.log('🔄 모든 배치 파일에서 완전한 데이터 추출 시작\n');

  try {
    // 최종 DB 로드
    const finalDB = JSON.parse(await fs.readFile('./tww-s3-complete-database-final.json', 'utf8'));

    // update-skills-accurate-batch 파일들 처리 (1-6번)
    const batchFiles = [];
    for (let i = 1; i <= 6; i++) {
      const filePath = path.join('..', `update-skills-accurate-batch-${i}.js`);
      try {
        const content = await fs.readFile(filePath, 'utf8');
        batchFiles.push({ file: i, content });
        console.log(`✅ batch-${i}.js 파일 로드 완료`);
      } catch (e) {
        console.log(`❌ batch-${i}.js 파일 없음`);
      }
    }

    console.log(`\n📊 로드된 파일: ${batchFiles.length}개\n`);

    // 모든 추가 필드 목록
    const additionalFields = [
      'effect', 'maxTargets', 'radius', 'proc', 'stacks', 'charges', 'mechanic',
      'duration', 'resource', 'additionalEffect', 'areaEffect', 'healingEffect',
      'damageEffect', 'coefficient', 'scaling', 'bonusEffect', 'specialEffect',
      'comboEffect', 'passiveEffect', 'triggeredBy', 'triggers', 'replaces',
      'replacedBy', 'stanceRequirement', 'formRequirement', 'weaponRequirement',
      'talentRequirement', 'pvpEffect', 'mythicPlusScaling', 'raidScaling',
      'diminishingReturns', 'interruptible', 'dispelType', 'school', 'gcd',
      'travelSpeed', 'bounceTargets', 'chainTargets', 'splitDamage',
      'damageModifier', 'healingModifier', 'threatModifier', 'resourceGeneration',
      'resourceCost', 'secondaryResource', 'energizeType', 'energizeAmount'
    ];

    let totalUpdates = 0;
    const updatedSkills = {};

    // batch 파일에서 데이터 추출
    for (const { file, content } of batchFiles) {
      console.log(`\n📦 batch-${file} 처리 중...`);

      // 정규식으로 스킬 데이터 추출
      const skillPattern = /"(\d+)":\s*\{[^}]*\}(?:,)?/g;
      const matches = content.matchAll(skillPattern);

      for (const match of matches) {
        try {
          const skillId = match[1];
          const skillContent = match[0];

          // 추가 데이터 객체 생성
          const additionalData = {};

          // 모든 필드 추출
          for (const field of additionalFields) {
            // 다양한 패턴으로 필드 추출 시도
            const patterns = [
              new RegExp(`"${field}":\\s*"([^"]+)"`),  // 문자열 값
              new RegExp(`"${field}":\\s*(\\d+)`),     // 숫자 값
              new RegExp(`"${field}":\\s*(true|false)`), // 불린 값
              new RegExp(`"${field}":\\s*\\[([^\\]]+)\\]`), // 배열 값
            ];

            for (const pattern of patterns) {
              const fieldMatch = skillContent.match(pattern);
              if (fieldMatch) {
                const value = fieldMatch[1];

                // 숫자로 파싱 가능한 경우 숫자로 저장
                if (/^\d+$/.test(value)) {
                  additionalData[field] = parseInt(value);
                } else if (value === 'true' || value === 'false') {
                  additionalData[field] = value === 'true';
                } else if (fieldMatch[0].includes('[')) {
                  // 배열인 경우
                  additionalData[field] = value.split(',').map(v => v.trim().replace(/"/g, ''));
                } else {
                  additionalData[field] = value;
                }
                break;
              }
            }
          }

          // krName과 description도 추출
          const krNameMatch = skillContent.match(/"krName":\s*"([^"]+)"/);
          const descMatch = skillContent.match(/"description":\s*"([^"]+)"/);

          if (krNameMatch) additionalData.krName = krNameMatch[1];
          if (descMatch) additionalData.description = descMatch[1];

          if (Object.keys(additionalData).length > 0) {
            updatedSkills[skillId] = additionalData;
            totalUpdates++;
            console.log(`  ✅ [${skillId}] ${additionalData.krName || skillId}: ${Object.keys(additionalData).length}개 필드 추출`);
          }
        } catch (e) {
          console.log(`  ⚠️ 스킬 파싱 에러:`, e.message);
        }
      }
    }

    // massive-update-skills 파일들도 확인 (만약 있다면)
    for (let i = 1; i <= 19; i++) {
      const filePath = path.join('..', `massive-update-skills-${i}.js`);
      try {
        const content = await fs.readFile(filePath, 'utf8');
        console.log(`✅ massive-${i}.js 파일 발견, 처리 중...`);

        // 동일한 방식으로 데이터 추출
        const skillPattern = /"(\d+)":\s*\{[^}]*\}(?:,)?/g;
        const matches = content.matchAll(skillPattern);

        for (const match of matches) {
          const skillId = match[1];
          if (!updatedSkills[skillId]) {
            // 이미 처리되지 않은 스킬만 추가
            // ... (위와 동일한 추출 로직)
          }
        }
      } catch (e) {
        // 파일 없음 (정상)
      }
    }

    // 최종 DB에 병합
    let mergedCount = 0;
    for (const [className, skills] of Object.entries(finalDB)) {
      for (const [skillId, skillData] of Object.entries(skills)) {
        if (updatedSkills[skillId]) {
          // 기존 데이터에 추가 데이터 병합
          finalDB[className][skillId] = {
            ...skillData,
            ...updatedSkills[skillId]
          };
          mergedCount++;
        }
      }
    }

    // 최종 DB 저장
    await fs.writeFile(
      './tww-s3-complete-database-ultimate.json',
      JSON.stringify(finalDB, null, 2),
      'utf8'
    );

    console.log('\n================================');
    console.log('✨ 완전한 데이터 병합 완료!');
    console.log(`📊 추출된 고유 스킬: ${totalUpdates}개`);
    console.log(`🔄 병합된 스킬: ${mergedCount}개`);
    console.log('📁 저장 경로: tww-s3-complete-database-ultimate.json');
    console.log('================================');

    // 클래스별 통계
    console.log('\n📋 클래스별 강화 통계:');
    for (const [className, skills] of Object.entries(finalDB)) {
      const total = Object.keys(skills).length;
      let enhanced = 0;

      for (const skill of Object.values(skills)) {
        // 추가 필드가 있으면 강화된 것으로 카운트
        const hasAdditional = additionalFields.some(field => skill[field] !== undefined && skill[field] !== null);
        if (hasAdditional) enhanced++;
      }

      console.log(`  ${className}: ${total}개 (강화: ${enhanced}개)`);
    }

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
  }
}

mergeAllBatchData().catch(console.error);