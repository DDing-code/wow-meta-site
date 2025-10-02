/**
 * 모든 스킬 아이콘을 Wowhead에서 가져오기
 * Playwright를 사용하여 실제 아이콘 이름 수집
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
        const krRegex = new RegExp(`${id}:[^}]*kr:\\s*['"]([^'"]+)['"]`);
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

async function fetchIconsInBatch(skillIds) {
  const browser = await chromium.launch({
    headless: true,
    args: ['--lang=en-US'] // 영어로 설정하여 안정성 향상
  });

  const results = {};
  const errors = [];

  try {
    const page = await browser.newPage();

    // 기존 결과 로드
    const existingResultsPath = path.join(__dirname, 'wowhead-all-icons.json');
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
        const url = `https://www.wowhead.com/spell=${skill.id}`;

        await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: 15000
        });

        // 잠시 대기
        await page.waitForTimeout(300);

        // 아이콘 이미지 URL 추출
        const iconData = await page.evaluate(() => {
          // 여러 방법으로 아이콘 찾기
          const iconSelectors = [
            '.iconlarge ins',
            '.icon-56 ins',
            '.iconmedium ins',
            '[data-icon] ins',
            '.icon56 ins',
            '#icon56 ins'
          ];

          for (const selector of iconSelectors) {
            const iconElem = document.querySelector(selector);
            if (iconElem) {
              const style = iconElem.getAttribute('style') || '';
              const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/);
              if (match) {
                const url = match[1];
                const iconMatch = url.match(/\/icons\/[^/]+\/([^/]+)\.(jpg|png)/);
                if (iconMatch) {
                  return iconMatch[1];
                }
              }
            }
          }

          // 대체 방법: img 태그
          const img = document.querySelector('img[src*="/icons/"]');
          if (img) {
            const match = img.src.match(/\/icons\/[^/]+\/([^/]+)\.(jpg|png)/);
            if (match) {
              return match[1];
            }
          }

          return null;
        });

        if (iconData) {
          results[skill.id] = iconData;
          processed++;
          console.log(`✅ [${processed}/${total}] ${skill.id}: '${iconData}' // ${skill.kr || skill.name}`);
        } else {
          errors.push({ id: skill.id, name: skill.kr || skill.name, reason: 'no icon found' });
          processed++;
          console.log(`⚠️ [${processed}/${total}] ${skill.id}: 아이콘을 찾을 수 없음 // ${skill.kr || skill.name}`);
        }

        // 진행률 표시
        if (processed % 10 === 0) {
          console.log(`📊 진행률: ${Math.round(processed/total*100)}% (${processed}/${total})`);

          // 중간 저장
          fs.writeFileSync(
            path.join(__dirname, 'wowhead-all-icons.json'),
            JSON.stringify(results, null, 2),
            'utf8'
          );
        }

        // 요청 간 딜레이
        await page.waitForTimeout(500);

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
  const outputPath = path.join(__dirname, 'wowhead-all-icons.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');

  console.log(`\n✅ 총 ${Object.keys(results).length}개의 아이콘 매핑 완료`);
  console.log(`❌ ${errors.length}개의 오류 발생`);
  console.log(`📝 결과 저장: ${outputPath}`);

  // JavaScript 파일로 변환
  const jsContent = `// Wowhead에서 가져온 실제 아이콘 매핑
// 생성일: ${new Date().toLocaleDateString('ko-KR')}
// 총 ${Object.keys(results).length}개의 매핑

export const wowheadIconMapping = ${JSON.stringify(results, null, 2)};`;

  fs.writeFileSync(
    path.join(__dirname, '..', 'src', 'data', 'wowheadIconMapping.js'),
    jsContent,
    'utf8'
  );

  return results;
}

// 메인 실행
async function main() {
  console.log('🔄 모든 스킬 아이콘 수집 시작...\n');

  // 모든 스킬 ID 수집
  const allSkills = collectAllSkillIds();
  console.log(`📚 총 ${allSkills.length}개의 스킬 발견\n`);

  // 배치로 처리
  await fetchIconsInBatch(allSkills);

  console.log('\n✨ 작업 완료!');
}

main().catch(console.error);