/**
 * Wowhead에서 실제 스킬 설명을 가져오기
 * 한국어 버전으로 가져옴
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// 모든 스킬 ID를 수집
function collectAllSkillIds() {
  const skillsDir = path.join(__dirname, '..', 'src', 'data', 'skills');
  const allSkillIds = [];

  const classFiles = [
    'wowdbWarriorSkillsComplete.js',
    'wowdbPaladinSkillsComplete.js',
    'wowdbHunterSkillsComplete.js',
    'wowdbRogueSkillsComplete.js',
    'wowdbPriestSkillsComplete.js',
    'wowdbMageSkillsComplete.js',
    'wowdbWarlockSkillsComplete.js',
    'wowdbShamanSkillsComplete.js',
    'wowdbMonkSkillsComplete.js',
    'wowdbDruidSkillsComplete.js',
    'wowdbDeathKnightSkillsComplete.js',
    'wowdbDemonHunterSkillsComplete.js',
    'wowdbEvokerSkillsComplete.js'
  ];

  classFiles.forEach(file => {
    const filePath = path.join(skillsDir, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');

      // 스킬 ID 추출 (숫자: { 형태)
      const regex = /(\d+):\s*\{[^}]*name:\s*['"]([^'"]+)['"]/g;
      let match;

      while ((match = regex.exec(content)) !== null) {
        const id = parseInt(match[1]);
        const name = match[2];

        // 한글 이름 추출
        const krRegex = new RegExp(`${id}:[^}]*kr:\\s*['"]([^'"]+)['"]\n`, 's');
        const krMatch = content.match(krRegex);
        const krName = krMatch ? krMatch[1] : null;

        allSkillIds.push({
          id,
          name,
          kr: krName,
          class: file.replace('wowdb', '').replace('SkillsComplete.js', '').toLowerCase()
        });
      }
    }
  });

  return allSkillIds;
}

async function fetchDescriptionsInBatch(skillIds) {
  const browser = await chromium.launch({
    headless: true,
    args: ['--lang=ko-KR'] // 한국어로 설정
  });

  const results = {};
  const errors = [];

  try {
    const page = await browser.newPage();

    // 한국어 설정
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'ko-KR,ko;q=0.9'
    });

    // 기존 결과 로드
    const existingResultsPath = path.join(__dirname, 'wowhead-descriptions.json');
    if (fs.existsSync(existingResultsPath)) {
      const existing = JSON.parse(fs.readFileSync(existingResultsPath, 'utf8'));
      Object.assign(results, existing);
      console.log(`📂 기존 결과 로드: ${Object.keys(existing).length}개`);
    }

    let processed = 0;
    const total = skillIds.length;

    for (const skill of skillIds) {
      // 이미 처리된 스킬은 건너뛰기
      if (results[skill.id]) {
        processed++;
        continue;
      }

      try {
        // 한국어 사이트로 접속
        const url = `https://ko.wowhead.com/spell=${skill.id}`;

        await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: 15000
        });

        // 잠시 대기
        await page.waitForTimeout(500);

        // 스킬 정보 추출
        const skillData = await page.evaluate(() => {
          const data = {};

          // 한국어 이름
          const titleElem = document.querySelector('h1.heading-size-1');
          if (titleElem) {
            data.krName = titleElem.textContent.trim();
          }

          // 설명 추출 (여러 방법 시도)
          const tooltipSelectors = [
            '#tt[skillId]',
            '.tooltip-content',
            '#tooltip-generic',
            '.q0',
            '[data-visible="yes"] .q0',
            '.spell-tooltip .q0'
          ];

          for (const selector of tooltipSelectors) {
            const elem = document.querySelector(selector);
            if (elem) {
              data.description = elem.textContent.trim();
              break;
            }
          }

          // 대체 방법: 페이지에서 직접 설명 찾기
          if (!data.description) {
            const descElem = document.querySelector('#spelldetails') ||
                           document.querySelector('#main-contents .text');
            if (descElem) {
              const textNodes = descElem.querySelectorAll('.q0, .q, .spell-desc');
              if (textNodes.length > 0) {
                data.description = Array.from(textNodes)
                  .map(n => n.textContent.trim())
                  .filter(t => t.length > 10)
                  .join(' ');
              }
            }
          }

          // 쿨다운, 시전 시간 등
          const quickFactsElem = document.querySelector('.quick-facts');
          if (quickFactsElem) {
            const cooldownMatch = quickFactsElem.textContent.match(/재사용 대기시간:\s*([^\n]+)/);
            const castMatch = quickFactsElem.textContent.match(/시전 시간:\s*([^\n]+)/);
            const rangeMatch = quickFactsElem.textContent.match(/사거리:\s*([^\n]+)/);

            if (cooldownMatch) data.cooldown = cooldownMatch[1].trim();
            if (castMatch) data.castTime = castMatch[1].trim();
            if (rangeMatch) data.range = rangeMatch[1].trim();
          }

          return data;
        });

        if (skillData && (skillData.krName || skillData.description)) {
          results[skill.id] = {
            ...skillData,
            originalName: skill.name,
            class: skill.class
          };
          processed++;
          console.log(`✅ [${processed}/${total}] ${skill.id}: ${skillData.krName || skill.kr || skill.name}`);

          if (skillData.description) {
            console.log(`   📝 설명: ${skillData.description.substring(0, 50)}...`);
          }
        } else {
          errors.push({ id: skill.id, name: skill.kr || skill.name, reason: 'no description found' });
          processed++;
          console.log(`⚠️ [${processed}/${total}] ${skill.id}: 설명을 찾을 수 없음 // ${skill.kr || skill.name}`);
        }

        // 진행률 표시 및 중간 저장
        if (processed % 10 === 0) {
          console.log(`📊 진행률: ${Math.round(processed/total*100)}% (${processed}/${total})`);

          // 중간 저장
          fs.writeFileSync(
            path.join(__dirname, 'wowhead-descriptions.json'),
            JSON.stringify(results, null, 2),
            'utf8'
          );
        }

        // 요청 간 딜레이
        await page.waitForTimeout(1000);

      } catch (error) {
        errors.push({ id: skill.id, name: skill.kr || skill.name, error: error.message });
        processed++;
        console.log(`❌ [${processed}/${total}] ${skill.id}: 에러 - ${error.message}`);
      }
    }

  } finally {
    await browser.close();
  }

  // 최종 저장
  const outputPath = path.join(__dirname, 'wowhead-descriptions.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');

  console.log(`\n✅ 총 ${Object.keys(results).length}개의 스킬 설명 수집 완료`);
  console.log(`❌ ${errors.length}개의 오류 발생`);
  console.log(`📝 결과 저장: ${outputPath}`);

  // JavaScript 파일로 변환
  const jsContent = `// Wowhead에서 가져온 실제 스킬 설명
// 생성일: ${new Date().toLocaleDateString('ko-KR')}
// 총 ${Object.keys(results).length}개의 설명

export const wowheadDescriptions = ${JSON.stringify(results, null, 2)};`;

  fs.writeFileSync(
    path.join(__dirname, '..', 'src', 'data', 'wowheadDescriptions.js'),
    jsContent,
    'utf8'
  );

  return results;
}

// 메인 실행
async function main() {
  console.log('🔄 Wowhead 스킬 설명 수집 시작...\n');

  // 모든 스킬 ID 수집
  const allSkills = collectAllSkillIds();
  console.log(`📚 총 ${allSkills.length}개의 스킬 발견\n`);

  // 처음 50개만 먼저 테스트
  const testSkills = allSkills.slice(0, 50);

  // 배치로 처리
  await fetchDescriptionsInBatch(testSkills);

  console.log('\n✨ 작업 완료!');
}

main().catch(console.error);