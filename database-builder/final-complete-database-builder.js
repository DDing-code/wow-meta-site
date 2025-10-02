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
      type: existingData.type || "기본",
      spec: existingData.spec || "공용",
      heroTalent: existingData.heroTalent || null,
      level: existingData.level || 1,
      pvp: existingData.pvp || false
    };

    // 영문 페이지 접속
    await page.goto(`https://www.wowhead.com/spell=${skillId}`, {
      waitUntil: 'domcontentloaded',
      timeout: 20000
    });

    await page.waitForTimeout(2000); // 페이지 완전 로딩 대기

    // 영문 페이지에서 데이터 수집
    try {
      const englishData = await page.evaluate(() => {
        const data = {};

        // Quick Facts 테이블에서 정보 추출
        const tables = document.querySelectorAll('table.infobox, .grid, .icontab');
        for (const table of tables) {
          const rows = table.querySelectorAll('tr');

          for (const row of rows) {
            const th = row.querySelector('th');
            const td = row.querySelector('td');

            if (th && td) {
              const label = th.textContent.trim().toLowerCase();
              const value = td.textContent.trim();

              // 각종 필드 매핑
              if (label.includes('cooldown') || label.includes('recharge')) {
                data.cooldown = value;
              } else if (label.includes('cast time') || label.includes('casting')) {
                data.castTime = value;
              } else if (label.includes('range')) {
                data.range = value;
              } else if (label.includes('cost')) {
                data.resourceCost = value;
              } else if (label.includes('duration')) {
                data.duration = value;
              } else if (label.includes('gcd') || label.includes('global')) {
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

        // 툴팁 전체 텍스트 수집 (설명)
        const tooltipElements = document.querySelectorAll('.q, .q0, .q1, .q2, .q3, .q4, .q5, .tooltip-content');
        let fullDescription = '';
        for (const elem of tooltipElements) {
          if (elem && elem.textContent) {
            const text = elem.textContent.trim();
            if (text.length > fullDescription.length) {
              fullDescription = text;
            }
          }
        }

        // 설명이 너무 길면 처음 500자만 저장
        if (fullDescription.length > 500) {
          data.description = fullDescription.substring(0, 497) + '...';
        } else {
          data.description = fullDescription;
        }

        // 툴팁에서 추가 정보 추출
        const tooltipText = fullDescription || '';

        // 효과 범위
        const radiusMatch = tooltipText.match(/(\d+)\s*(yard|yd|meter|m)\s*(radius|range)?/i);
        if (radiusMatch) {
          data.radius = radiusMatch[1] + ' ' + (radiusMatch[2].includes('y') ? 'yards' : 'meters');
        }

        // 최대 타겟
        const targetsMatch = tooltipText.match(/(\d+)\s*(targets?|enemies)/i);
        if (targetsMatch) {
          data.maxTargets = parseInt(targetsMatch[1]);
        }

        // 중첩
        const stacksMatch = tooltipText.match(/stacks?\s*up\s*to\s*(\d+)|(\d+)\s*stacks?/i);
        if (stacksMatch) {
          data.stacks = parseInt(stacksMatch[1] || stacksMatch[2]);
        }

        // 충전
        const chargesMatch = tooltipText.match(/(\d+)\s*charges?|charges?:\s*(\d+)/i);
        if (chargesMatch) {
          data.charges = parseInt(chargesMatch[1] || chargesMatch[2]);
        }

        // 확률
        const procMatch = tooltipText.match(/(\d+)%\s*(chance|probability)/i);
        if (procMatch) {
          data.proc = procMatch[1] + '%';
        }

        // 계수 (주문력/공격력)
        const coefficientMatch = tooltipText.match(/(\d+(?:\.\d+)?%?)\s*(?:of\s+)?(?:spell|attack)\s*power/i);
        if (coefficientMatch) {
          data.coefficient = coefficientMatch[1];
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
      timeout: 20000
    });

    await page.waitForTimeout(2000);

    // 한국어 페이지에서 데이터 수집
    try {
      const koreanData = await page.evaluate(() => {
        const data = {};

        // 한국어 테이블에서 정보 추출
        const tables = document.querySelectorAll('table.infobox, .grid, .icontab');
        for (const table of tables) {
          const rows = table.querySelectorAll('tr');

          for (const row of rows) {
            const th = row.querySelector('th');
            const td = row.querySelector('td');

            if (th && td) {
              const label = th.textContent.trim();
              const value = td.textContent.trim();

              // 한국어 레이블 처리
              if (label.includes('재사용') || label.includes('쿨다운') || label.includes('재충전')) {
                data.cooldown = value;
              } else if (label.includes('시전 시간') || label.includes('캐스팅')) {
                data.castTime = value;
              } else if (label.includes('사거리') || label.includes('사정거리')) {
                data.range = value;
              } else if (label.includes('소모') || label.includes('비용')) {
                data.resourceCost = value;
              } else if (label.includes('지속시간')) {
                data.duration = value;
              } else if (label.includes('생성') || label.includes('획득')) {
                data.resourceGain = value;
              }
            }
          }
        }

        // 한국어 설명 수집 (더 정확한 선택자 사용)
        const descElements = document.querySelectorAll('.q, .q0, .q1, .q2, .q3, .q4, .q5, .tooltip-content');
        let koreanDesc = '';
        for (const elem of descElements) {
          if (elem && elem.textContent) {
            const text = elem.textContent.trim();
            if (text.length > koreanDesc.length && !text.includes('Quick Facts')) {
              koreanDesc = text;
            }
          }
        }

        // 설명이 너무 길면 처음 500자만 저장
        if (koreanDesc.length > 500) {
          data.description = koreanDesc.substring(0, 497) + '...';
        } else if (koreanDesc) {
          data.description = koreanDesc;
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
    if (!skillData.description) skillData.description = existingData.description || "";

    // 수집된 추가 필드 개수 계산
    const additionalFields = ['radius', 'maxTargets', 'stacks', 'charges', 'proc',
                            'coefficient', 'duration', 'gcd', 'school', 'mechanic', 'dispelType'];
    const collectedAdditional = additionalFields.filter(field => skillData[field]).length;

    console.log(`    ✅ [${skillId}] 완료 - 쿨다운: ${skillData.cooldown}, 시전: ${skillData.castTime}, 추가: ${collectedAdditional}개 필드`);
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
      resourceGain: "없음",
      description: existingData.description || ""
    };
  }
}

async function buildFinalCompleteDatabase() {
  console.log('🚀 TWW 시즌3 최종 완전한 데이터베이스 구축 시작\n');
  console.log('⏰ 예상 소요 시간: 약 3-4시간 (1,180개 스킬)\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--disable-features=IsolateOrigins,site-per-process']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
    locale: 'ko-KR'
  });

  const page = await context.newPage();

  // 에러 무시
  page.on('pageerror', () => {});
  page.on('error', () => {});
  page.on('console', () => {});

  const completeDatabase = {};
  let totalProcessed = 0;
  let totalSkills = 0;
  let enhancedCount = 0;

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

    // 3개씩 배치 처리 (서버 부하 방지 + 안정성)
    const batchSize = 3;
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

        // 추가 필드가 있으면 카운트
        if (completeData.radius || completeData.maxTargets || completeData.stacks ||
            completeData.charges || completeData.proc || completeData.coefficient) {
          enhancedCount++;
        }

        // 진행률 표시
        if (totalProcessed % 30 === 0) {
          const progress = ((totalProcessed / totalSkills) * 100).toFixed(1);
          console.log(`\n  📊 전체 진행률: ${progress}% (${totalProcessed}/${totalSkills}) - 강화: ${enhancedCount}개`);
        }
      }

      // 배치 간 대기 (서버 부하 방지)
      if (i + batchSize < skillIds.length) {
        await page.waitForTimeout(3000);
      }
    }

    // 클래스 완료 후 저장
    await fs.writeFile(
      './tww-s3-final-ultimate-database.json',
      JSON.stringify(completeDatabase, null, 2),
      'utf8'
    );

    console.log(`  💾 ${className} 저장 완료 (${Object.keys(completeDatabase[className]).length}개)`);
  }

  // 최종 통계
  console.log('\n================================');
  console.log('✨ 최종 완전한 데이터베이스 구축 완료!');
  console.log('================================');
  console.log(`📊 처리된 스킬: ${totalProcessed}개`);
  console.log(`✨ 강화된 스킬: ${enhancedCount}개`);
  console.log('📁 저장 경로: tww-s3-final-ultimate-database.json');
  console.log('================================\n');

  // 클래스별 상세 통계
  console.log('📋 클래스별 스킬 수:');
  for (const [className, skills] of Object.entries(completeDatabase)) {
    const total = Object.keys(skills).length;
    let enhanced = 0;
    for (const skill of Object.values(skills)) {
      if (skill.radius || skill.maxTargets || skill.stacks ||
          skill.charges || skill.proc || skill.coefficient) {
        enhanced++;
      }
    }
    console.log(`  ${className}: ${total}개 (강화: ${enhanced}개)`);
  }

  await browser.close();
}

// 실행
buildFinalCompleteDatabase().catch(console.error);