const fs = require('fs').promises;
const { chromium } = require('playwright');

// 기존 DB에서 스킬 목록 가져오기
const EXISTING_DB = require('./tww-s3-complete-database-final.json');

async function collectCompleteSkillData(page, skillId, existingData) {
  console.log(`    🔍 [${skillId}] ${existingData.koreanName} 완전한 데이터 수집 중...`);

  try {
    // 기본 데이터 유지
    let skillData = {
      id: skillId,
      englishName: existingData.englishName,
      koreanName: existingData.koreanName,
      icon: existingData.icon,
      description: existingData.description,
      type: existingData.type || "기본",
      spec: existingData.spec || "공용",
      heroTalent: existingData.heroTalent || null,
      level: existingData.level || 1,
      pvp: existingData.pvp || false
    };

    // 영문 페이지 접속
    await page.goto(`https://www.wowhead.com/spell=${skillId}`, {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    await page.waitForTimeout(1500); // 페이지 로딩 대기

    // 영문 페이지에서 데이터 수집
    try {
      const englishData = await page.evaluate(() => {
        const data = {};

        // Quick Facts 테이블에서 정보 추출
        const tables = document.querySelectorAll('table.infobox, .grid');
        for (const table of tables) {
          const rows = table.querySelectorAll('tr');

          for (const row of rows) {
            const th = row.querySelector('th');
            const td = row.querySelector('td');

            if (th && td) {
              const label = th.textContent.trim().toLowerCase();
              const value = td.textContent.trim();

              // 각종 필드 매핑
              if (label.includes('cooldown')) {
                data.cooldown = value;
              } else if (label.includes('cast time')) {
                data.castTime = value;
              } else if (label.includes('range')) {
                data.range = value;
              } else if (label.includes('cost')) {
                data.resourceCost = value;
              } else if (label.includes('duration')) {
                data.duration = value;
              } else if (label.includes('gcd')) {
                data.gcd = value;
              } else if (label.includes('school')) {
                data.school = value;
              } else if (label.includes('mechanic')) {
                data.mechanic = value;
              } else if (label.includes('dispel')) {
                data.dispelType = value;
              }
            }
          }
        }

        // 툴팁에서 추가 정보 추출
        const tooltip = document.querySelector('.q, .tooltip-content, #tooltip-generic');
        if (tooltip) {
          const text = tooltip.textContent || tooltip.innerText || '';

          // 효과 범위
          const radiusMatch = text.match(/(\d+)\s*(yard|yd|meter)/i);
          if (radiusMatch) {
            data.radius = radiusMatch[1] + ' ' + radiusMatch[2];
          }

          // 최대 타겟
          const targetsMatch = text.match(/(\d+)\s*targets?/i);
          if (targetsMatch) {
            data.maxTargets = parseInt(targetsMatch[1]);
          }

          // 중첩
          const stacksMatch = text.match(/stacks?\s*up\s*to\s*(\d+)/i);
          if (stacksMatch) {
            data.stacks = parseInt(stacksMatch[1]);
          }

          // 충전
          const chargesMatch = text.match(/(\d+)\s*charges?/i);
          if (chargesMatch) {
            data.charges = parseInt(chargesMatch[1]);
          }

          // 확률
          const procMatch = text.match(/(\d+)%\s*chance/i);
          if (procMatch) {
            data.proc = procMatch[1] + '%';
          }
        }

        return data;
      });

      // 영문 데이터 병합
      Object.assign(skillData, englishData);

    } catch (e) {
      console.log(`      ⚠️ 영문 데이터 수집 일부 실패`);
    }

    // 한국어 페이지 접속
    await page.goto(`https://ko.wowhead.com/spell=${skillId}`, {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    await page.waitForTimeout(1500);

    // 한국어 페이지에서 데이터 수집
    try {
      const koreanData = await page.evaluate(() => {
        const data = {};

        // 한국어 테이블에서 정보 추출
        const tables = document.querySelectorAll('table.infobox, .grid');
        for (const table of tables) {
          const rows = table.querySelectorAll('tr');

          for (const row of rows) {
            const th = row.querySelector('th');
            const td = row.querySelector('td');

            if (th && td) {
              const label = th.textContent.trim();
              const value = td.textContent.trim();

              // 한국어 레이블 처리
              if (label.includes('재사용') || label.includes('쿨다운')) {
                data.cooldown = value;
              } else if (label.includes('시전 시간')) {
                data.castTime = value;
              } else if (label.includes('사거리') || label.includes('사정거리')) {
                data.range = value;
              } else if (label.includes('소모') || label.includes('비용')) {
                data.resourceCost = value;
              } else if (label.includes('지속시간')) {
                data.duration = value;
              } else if (label.includes('생성')) {
                data.resourceGain = value;
              }
            }
          }
        }

        // 설명 업데이트
        const descElement = document.querySelector('.q, .tooltip-content');
        if (descElement) {
          data.description = descElement.textContent.trim();
        }

        return data;
      });

      // 한국어 데이터 병합 (한국어 우선)
      if (koreanData.cooldown) skillData.cooldown = koreanData.cooldown;
      if (koreanData.castTime) skillData.castTime = koreanData.castTime;
      if (koreanData.range) skillData.range = koreanData.range;
      if (koreanData.resourceCost) skillData.resourceCost = koreanData.resourceCost;
      if (koreanData.resourceGain) skillData.resourceGain = koreanData.resourceGain;
      if (koreanData.duration) skillData.duration = koreanData.duration;
      if (koreanData.description) skillData.description = koreanData.description;

    } catch (e) {
      console.log(`      ⚠️ 한국어 데이터 수집 일부 실패`);
    }

    // 기본값 설정
    if (!skillData.cooldown) skillData.cooldown = "없음";
    if (!skillData.castTime) skillData.castTime = "즉시 시전";
    if (!skillData.range) skillData.range = "자신";
    if (!skillData.resourceCost) skillData.resourceCost = "없음";
    if (!skillData.resourceGain) skillData.resourceGain = "없음";

    console.log(`    ✅ [${skillId}] 수집 완료 - 쿨다운: ${skillData.cooldown}, 시전: ${skillData.castTime}`);
    return skillData;

  } catch (error) {
    console.log(`    ❌ [${skillId}] 수집 실패: ${error.message}`);
    // 실패 시 기존 데이터에 기본값만 추가
    return {
      ...existingData,
      cooldown: "없음",
      castTime: "즉시 시전",
      range: "자신",
      resourceCost: "없음",
      resourceGain: "없음"
    };
  }
}

async function rebuildCompleteDatabase() {
  console.log('🚀 TWW 시즌3 완전한 데이터베이스 재구축 시작\n');
  console.log('⏰ 예상 소요 시간: 약 2-3시간 (1,180개 스킬)\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  // 에러 무시
  page.on('pageerror', () => {});
  page.on('error', () => {});

  const completeDatabase = {};
  let totalProcessed = 0;
  let totalSkills = 0;

  // 총 스킬 수 계산
  for (const skills of Object.values(EXISTING_DB)) {
    totalSkills += Object.keys(skills).length;
  }

  console.log(`📊 총 ${totalSkills}개 스킬 처리 예정\n`);

  // 각 클래스별로 처리
  for (const [className, skills] of Object.entries(EXISTING_DB)) {
    console.log(`\n=== ${className} 클래스 처리 중 (${Object.keys(skills).length}개 스킬) ===`);

    completeDatabase[className] = {};
    const skillIds = Object.keys(skills);

    // 5개씩 배치 처리 (서버 부하 방지)
    const batchSize = 5;
    const totalBatches = Math.ceil(skillIds.length / batchSize);

    for (let i = 0; i < skillIds.length; i += batchSize) {
      const batchNum = Math.floor(i / batchSize) + 1;
      console.log(`  📦 배치 ${batchNum}/${totalBatches} 처리 중...`);

      const batch = skillIds.slice(i, i + batchSize);

      for (const skillId of batch) {
        const existingData = skills[skillId];
        const completeData = await collectCompleteSkillData(page, skillId, existingData);

        completeDatabase[className][skillId] = completeData;
        totalProcessed++;

        // 진행률 표시
        if (totalProcessed % 50 === 0) {
          const progress = ((totalProcessed / totalSkills) * 100).toFixed(1);
          console.log(`\n  📊 전체 진행률: ${progress}% (${totalProcessed}/${totalSkills})`);
        }
      }

      // 배치 간 대기 (서버 부하 방지)
      if (i + batchSize < skillIds.length) {
        await page.waitForTimeout(3000);
      }
    }

    // 클래스 완료 후 중간 저장
    await fs.writeFile(
      './tww-s3-ultimate-database.json',
      JSON.stringify(completeDatabase, null, 2),
      'utf8'
    );

    console.log(`  💾 ${className} 저장 완료`);
  }

  // 최종 통계
  console.log('\n================================');
  console.log('✨ 완전한 데이터베이스 재구축 완료!');
  console.log('================================');
  console.log(`📊 처리된 스킬: ${totalProcessed}개`);
  console.log('📁 저장 경로: tww-s3-ultimate-database.json');
  console.log('================================\n');

  // 클래스별 통계
  console.log('📋 클래스별 스킬 수:');
  for (const [className, skills] of Object.entries(completeDatabase)) {
    console.log(`  ${className}: ${Object.keys(skills).length}개`);
  }

  await browser.close();
}

// 실행
rebuildCompleteDatabase().catch(console.error);