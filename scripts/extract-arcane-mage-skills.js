/**
 * 비전 마법사 주요 스킬 추출 스크립트
 *
 * Wowhead에서 Playwright로 스킬 정보 추출
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// 추출할 스킬 ID 목록
const ARCANE_SKILLS = [
  { id: 5143, name: 'Arcane Missiles' },
  { id: 30451, name: 'Arcane Blast' },
  { id: 44425, name: 'Arcane Barrage' },
  { id: 153626, name: 'Arcane Orb' },
  { id: 1449, name: 'Arcane Explosion' },
  { id: 321507, name: 'Touch of the Magi' },
  { id: 12051, name: 'Evocation' },
  { id: 116014, name: 'Arcane Charges' },
  { id: 205025, name: 'Presence of Mind' },
  { id: 66, name: 'Invisibility' },
  { id: 80353, name: 'Time Warp' },
  { id: 1459, name: 'Arcane Intellect' },
  { id: 212653, name: 'Shimmer' },
  { id: 414658, name: 'Nether Precision' },
  { id: 210824, name: 'Touch of the Magi' }
];

async function extractSkillData(skillId, skillName) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // 한글 페이지 접속
    const koUrl = `https://www.wowhead.com/ko/spell=${skillId}`;
    await page.goto(koUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);

    const skillData = await page.evaluate(() => {
      // 페이지 제목에서 한글명 추출
      const title = document.title;
      const koreanName = title.split(' - ')[0]?.trim();

      // 툴팁 설명 추출
      const tooltipDiv = document.querySelector('.wowhead-tooltip');
      let description = '';
      if (tooltipDiv) {
        const textNodes = Array.from(tooltipDiv.querySelectorAll('div')).map(d => d.textContent.trim());
        description = textNodes.filter(t => t.length > 10).join(' ');
      }

      // 아이콘 URL에서 이름 추출
      const iconImg = document.querySelector('img[src*="icons/"]');
      let icon = '';
      if (iconImg) {
        const iconUrl = iconImg.src;
        const match = iconUrl.match(/icons\/[^/]+\/([^.]+)/);
        icon = match ? match[1] : '';
      }

      return { koreanName, description, icon };
    });

    // 영문 페이지에서 영문명 추출
    const enUrl = `https://www.wowhead.com/spell=${skillId}`;
    await page.goto(enUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    const englishName = await page.evaluate(() => {
      const title = document.title;
      return title.split(' - ')[0]?.trim();
    });

    await browser.close();

    return {
      id: skillId,
      koreanName: skillData.koreanName || skillName,
      englishName: englishName || skillName,
      icon: skillData.icon || 'spell_nature_starfall',
      description: skillData.description || '스킬 설명',
      cooldown: '없음',
      castTime: '즉시',
      range: '40 야드',
      resourceCost: '없음',
      resourceGain: '없음',
      type: '기본',
      spec: 'arcane',
      level: 1,
      pvp: false
    };

  } catch (error) {
    console.error(`❌ ${skillName} (${skillId}) 추출 실패:`, error.message);
    await browser.close();
    return null;
  }
}

async function extractAllSkills() {
  console.log(`🔍 비전 마법사 스킬 ${ARCANE_SKILLS.length}개 추출 시작...\n`);

  const results = {};
  let success = 0;
  let failed = 0;

  for (const skill of ARCANE_SKILLS) {
    console.log(`  추출 중: ${skill.name} (${skill.id})...`);
    const data = await extractSkillData(skill.id, skill.name);

    if (data) {
      const key = skill.name.toLowerCase().replace(/\s+/g, '');
      results[key] = data;
      console.log(`  ✅ ${data.koreanName} - ${data.icon}`);
      success++;
    } else {
      failed++;
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  console.log(`\n📊 추출 완료: 성공 ${success}개, 실패 ${failed}개`);

  // 결과 저장
  const outputPath = path.join(__dirname, '../temp/arcane-mage-skills.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`💾 저장 완료: ${outputPath}`);

  return results;
}

// 실행
extractAllSkills().catch(console.error);
