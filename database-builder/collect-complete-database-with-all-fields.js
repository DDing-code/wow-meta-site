const fs = require('fs').promises;
const { chromium } = require('playwright');

// 모든 클래스의 스킬 데이터
const CLASS_SKILLS = {
  WARRIOR: require('./tww-s3-complete-database-final.json').WARRIOR,
  PALADIN: require('./tww-s3-complete-database-final.json').PALADIN,
  HUNTER: require('./tww-s3-complete-database-final.json').HUNTER,
  ROGUE: require('./tww-s3-complete-database-final.json').ROGUE,
  PRIEST: require('./tww-s3-complete-database-final.json').PRIEST,
  SHAMAN: require('./tww-s3-complete-database-final.json').SHAMAN,
  MAGE: require('./tww-s3-complete-database-final.json').MAGE,
  WARLOCK: require('./tww-s3-complete-database-final.json').WARLOCK,
  MONK: require('./tww-s3-complete-database-final.json').MONK,
  DRUID: require('./tww-s3-complete-database-final.json').DRUID,
  DEMONHUNTER: require('./tww-s3-complete-database-final.json').DEMONHUNTER,
  DEATHKNIGHT: require('./tww-s3-complete-database-final.json').DEATHKNIGHT,
  EVOKER: require('./tww-s3-complete-database-final.json').EVOKER
};

async function collectCompleteSkillDetails(page, skillId, existingData) {
  console.log(`    🔍 [${skillId}] ${existingData.koreanName} 완전한 데이터 수집 중...`);

  try {
    // 기존 데이터 복사
    let skillData = { ...existingData };

    // 영문 페이지 접속
    await page.goto(`https://www.wowhead.com/spell=${skillId}`, {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    await page.waitForTimeout(1000); // 페이지 안정화 대기

    // 추가 필드 수집
    try {
      // Quick Facts 테이블에서 정보 추출
      const quickFactsData = await page.evaluate(() => {
        const data = {};

        // Quick Facts 테이블 찾기
        const tables = document.querySelectorAll('table.infobox');
        for (const table of tables) {
          const rows = table.querySelectorAll('tr');

          for (const row of rows) {
            const th = row.querySelector('th');
            const td = row.querySelector('td');

            if (th && td) {
              const label = th.textContent.trim().toLowerCase();
              const value = td.textContent.trim();

              // 다양한 레이블 매핑
              if (label.includes('effect') || label.includes('효과')) {
                data.effect = value;
              } else if (label.includes('mechanic') || label.includes('메커니즘')) {
                data.mechanic = value;
              } else if (label.includes('dispel') || label.includes('해제')) {
                data.dispelType = value;
              } else if (label.includes('school') || label.includes('속성')) {
                data.school = value;
              } else if (label.includes('gcd') || label.includes('global cooldown')) {
                data.gcd = value;
              } else if (label.includes('duration') || label.includes('지속시간')) {
                data.duration = value;
              }
            }
          }
        }

        // 툴팁 정보에서 추가 데이터 추출
        const tooltip = document.querySelector('.tooltip-content');
        if (tooltip) {
          const text = tooltip.textContent;

          // 최대 타겟 수 추출
          const maxTargetsMatch = text.match(/(\d+)\s*targets?|최대\s*(\d+)/i);
          if (maxTargetsMatch) {
            data.maxTargets = parseInt(maxTargetsMatch[1] || maxTargetsMatch[2]);
          }

          // 범위 추출
          const radiusMatch = text.match(/(\d+)\s*(yard|yd|미터|m)\s*radius/i);
          if (radiusMatch) {
            data.radius = radiusMatch[1] + ' ' + radiusMatch[2];
          }

          // 발동 확률 추출
          const procMatch = text.match(/(\d+)%\s*(chance|확률)/i);
          if (procMatch) {
            data.proc = procMatch[1] + '%';
          }

          // 중첩 추출
          const stacksMatch = text.match(/stacks?\s*up\s*to\s*(\d+)|최대\s*(\d+)\s*중첩/i);
          if (stacksMatch) {
            data.stacks = parseInt(stacksMatch[1] || stacksMatch[2]);
          }

          // 충전 횟수 추출
          const chargesMatch = text.match(/(\d+)\s*charges?|(\d+)\s*충전/i);
          if (chargesMatch) {
            data.charges = parseInt(chargesMatch[1] || chargesMatch[2]);
          }
        }

        return data;
      });

      // 추가 데이터 병합
      skillData = { ...skillData, ...quickFactsData };

    } catch (e) {
      console.log(`      ⚠️ 추가 필드 수집 실패: ${e.message}`);
    }

    // 한국어 페이지에서 한글 정보 수집
    await page.goto(`https://ko.wowhead.com/spell=${skillId}`, {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    await page.waitForTimeout(1000);

    try {
      // 한국어 상세 정보 추출
      const koreanDetails = await page.evaluate(() => {
        const data = {};

        // 테이블에서 한국어 정보 추출
        const tables = document.querySelectorAll('table.infobox');
        for (const table of tables) {
          const rows = table.querySelectorAll('tr');

          for (const row of rows) {
            const th = row.querySelector('th');
            const td = row.querySelector('td');

            if (th && td) {
              const label = th.textContent.trim();
              const value = td.textContent.trim();

              if (label.includes('효과') && !data.effectKr) {
                data.effectKr = value;
              } else if (label.includes('메커니즘') && !data.mechanicKr) {
                data.mechanicKr = value;
              } else if (label.includes('속성') && !data.schoolKr) {
                data.schoolKr = value;
              }
            }
          }
        }

        return data;
      });

      // 한국어 데이터 추가
      if (koreanDetails.effectKr) skillData.effectKr = koreanDetails.effectKr;
      if (koreanDetails.mechanicKr) skillData.mechanicKr = koreanDetails.mechanicKr;
      if (koreanDetails.schoolKr) skillData.schoolKr = koreanDetails.schoolKr;

    } catch (e) {
      console.log(`      ⚠️ 한국어 추가 정보 수집 실패: ${e.message}`);
    }

    // 누락된 필드 기본값 설정
    if (!skillData.effect) skillData.effect = null;
    if (!skillData.maxTargets) skillData.maxTargets = null;
    if (!skillData.radius) skillData.radius = null;
    if (!skillData.proc) skillData.proc = null;
    if (!skillData.stacks) skillData.stacks = null;
    if (!skillData.charges) skillData.charges = null;
    if (!skillData.mechanic) skillData.mechanic = null;
    if (!skillData.dispelType) skillData.dispelType = null;
    if (!skillData.school) skillData.school = null;
    if (!skillData.gcd) skillData.gcd = null;
    if (!skillData.duration) skillData.duration = null;

    console.log(`    ✅ [${skillId}] 수집 완료 (추가 필드: ${Object.keys(skillData).filter(k => !existingData[k]).length}개)`);
    return skillData;

  } catch (error) {
    console.log(`    ❌ [${skillId}] 수집 실패: ${error.message}`);
    return existingData; // 실패 시 기존 데이터 반환
  }
}

async function collectAllClassesCompleteData() {
  console.log('🚀 TWW 시즌3 완전한 데이터베이스 구축 시작\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  // 페이지 에러 무시
  page.on('pageerror', () => {});
  page.on('error', () => {});

  const completeDatabase = {};
  let totalSkills = 0;
  let enhancedSkills = 0;

  // 각 클래스별로 처리
  for (const [className, skills] of Object.entries(CLASS_SKILLS)) {
    console.log(`\n=== ${className} 클래스 처리 중 (${Object.keys(skills).length}개 스킬) ===`);

    completeDatabase[className] = {};
    const skillIds = Object.keys(skills);

    // 10개씩 배치 처리
    const batchSize = 10;
    const totalBatches = Math.ceil(skillIds.length / batchSize);

    for (let i = 0; i < skillIds.length; i += batchSize) {
      const batchNum = Math.floor(i / batchSize) + 1;
      console.log(`  📦 배치 ${batchNum}/${totalBatches} 처리 중...`);

      const batch = skillIds.slice(i, i + batchSize);

      for (const skillId of batch) {
        const existingData = skills[skillId];
        const completeData = await collectCompleteSkillDetails(page, skillId, existingData);

        completeDatabase[className][skillId] = completeData;
        totalSkills++;

        // 추가 필드가 있으면 강화된 것으로 카운트
        if (completeData.effect || completeData.maxTargets || completeData.radius ||
            completeData.proc || completeData.stacks || completeData.charges) {
          enhancedSkills++;
        }
      }

      // 배치 간 대기
      if (i + batchSize < skillIds.length) {
        console.log(`  ⏳ 다음 배치 대기 중...`);
        await page.waitForTimeout(2000);
      }
    }

    // 클래스 완료 후 중간 저장
    await fs.writeFile(
      './tww-s3-complete-database-ultimate.json',
      JSON.stringify(completeDatabase, null, 2),
      'utf8'
    );

    console.log(`  💾 ${className} 저장 완료 (${Object.keys(completeDatabase[className]).length}개)`);
  }

  // 최종 통계
  console.log('\n================================');
  console.log('✨ 완전한 데이터베이스 구축 완료!');
  console.log('================================');
  console.log(`📊 전체 스킬: ${totalSkills}개`);
  console.log(`✨ 강화된 스킬: ${enhancedSkills}개`);
  console.log('📁 저장 경로: tww-s3-complete-database-ultimate.json');
  console.log('================================');

  // 클래스별 통계
  console.log('\n📋 클래스별 상세:');
  for (const [className, skills] of Object.entries(completeDatabase)) {
    const total = Object.keys(skills).length;
    let enhanced = 0;

    for (const skill of Object.values(skills)) {
      if (skill.effect || skill.maxTargets || skill.radius ||
          skill.proc || skill.stacks || skill.charges) {
        enhanced++;
      }
    }

    console.log(`  ${className}: ${total}개 (강화: ${enhanced}개)`);
  }

  await browser.close();
}

// 실행
collectAllClassesCompleteData().catch(console.error);