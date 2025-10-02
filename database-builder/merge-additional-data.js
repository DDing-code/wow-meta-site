const fs = require('fs').promises;
const path = require('path');

async function extractAdditionalData() {
  console.log('🔄 추가 데이터 추출 및 병합 시작\n');

  try {
    // 최종 DB 로드
    const finalDB = JSON.parse(await fs.readFile('./tww-s3-complete-database-final.json', 'utf8'));

    // update-skills-accurate-batch 파일들 처리
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

    // massive-update-skills 파일들도 확인
    const massiveFiles = [];
    for (let i = 1; i <= 19; i++) {
      const filePath = path.join('..', `massive-update-skills-${i}.js`);
      try {
        const content = await fs.readFile(filePath, 'utf8');
        massiveFiles.push({ file: i, content });
        console.log(`✅ massive-${i}.js 파일 로드 완료`);
      } catch (e) {
        // 파일 없음
      }
    }

    console.log(`\n📊 로드된 파일: batch ${batchFiles.length}개, massive ${massiveFiles.length}개\n`);

    // 추가 데이터 추출
    let additionalDataCount = 0;
    const additionalFields = ['effect', 'maxTargets', 'radius', 'proc', 'stacks', 'charges', 'mechanic'];

    // batch 파일에서 데이터 추출
    for (const { file, content } of batchFiles) {
      // accurateBatch 객체 추출
      const batchMatch = content.match(/const accurateBatch\d+ = \{[\s\S]*?\n\};/);
      if (batchMatch) {
        try {
          // eval 대신 안전한 파싱
          const objectStr = batchMatch[0]
            .replace(/const accurateBatch\d+ = /, '')
            .replace(/\.\.\.skillData\["?\d+"?\],?/g, '')
            .replace(/\};$/, '}');

          // JSON 형식으로 변환 시도
          const cleanedStr = objectStr
            .replace(/(\w+):/g, '"$1":')  // 키에 따옴표 추가
            .replace(/'/g, '"')            // 작은따옴표를 큰따옴표로
            .replace(/,\s*}/g, '}')        // 마지막 쉼표 제거
            .replace(/undefined/g, 'null');

          // 스킬별로 파싱
          const skillMatches = objectStr.matchAll(/"(\d+)":\s*\{([^}]+)\}/g);

          for (const match of skillMatches) {
            const skillId = match[1];
            const skillContent = match[2];

            // 추가 필드 추출
            const additionalData = {};

            // effect 추출
            const effectMatch = skillContent.match(/"effect":\s*"([^"]+)"/);
            if (effectMatch) additionalData.effect = effectMatch[1];

            // maxTargets 추출
            const maxTargetsMatch = skillContent.match(/"maxTargets":\s*"?(\d+)"?/);
            if (maxTargetsMatch) additionalData.maxTargets = parseInt(maxTargetsMatch[1]);

            // radius 추출
            const radiusMatch = skillContent.match(/"radius":\s*"([^"]+)"/);
            if (radiusMatch) additionalData.radius = radiusMatch[1];

            // proc 추출
            const procMatch = skillContent.match(/"proc":\s*"([^"]+)"/);
            if (procMatch) additionalData.proc = procMatch[1];

            // stacks 추출
            const stacksMatch = skillContent.match(/"stacks":\s*"?(\d+)"?/);
            if (stacksMatch) additionalData.stacks = parseInt(stacksMatch[1]);

            // charges 추출
            const chargesMatch = skillContent.match(/"charges":\s*"?(\d+)"?/);
            if (chargesMatch) additionalData.charges = parseInt(chargesMatch[1]);

            // 해당 스킬을 DB에서 찾아서 업데이트
            let updated = false;
            for (const [className, skills] of Object.entries(finalDB)) {
              if (skills[skillId]) {
                // 기존 데이터에 추가 데이터 병합
                skills[skillId] = {
                  ...skills[skillId],
                  ...additionalData
                };
                updated = true;
                additionalDataCount++;
                break;
              }
            }

            if (updated && Object.keys(additionalData).length > 0) {
              console.log(`  [${skillId}] 추가 데이터 병합:`, Object.keys(additionalData).join(', '));
            }
          }
        } catch (e) {
          console.log(`  ⚠️ batch-${file} 파싱 에러:`, e.message);
        }
      }
    }

    // 최종 DB 저장
    await fs.writeFile('./tww-s3-complete-database-enhanced.json', JSON.stringify(finalDB, null, 2), 'utf8');

    console.log('\n================================');
    console.log('✨ 추가 데이터 병합 완료!');
    console.log(`📊 업데이트된 스킬: ${additionalDataCount}개`);
    console.log('📁 저장 경로: tww-s3-complete-database-enhanced.json');
    console.log('================================');

    // 통계 출력
    console.log('\n📋 클래스별 스킬 수:');
    for (const [className, skills] of Object.entries(finalDB)) {
      const count = Object.keys(skills).length;

      // 추가 데이터가 있는 스킬 수 계산
      let enhancedCount = 0;
      for (const skill of Object.values(skills)) {
        if (skill.effect || skill.maxTargets || skill.radius || skill.proc) {
          enhancedCount++;
        }
      }

      console.log(`  ${className}: ${count}개 (강화: ${enhancedCount}개)`);
    }

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
  }
}

extractAdditionalData().catch(console.error);