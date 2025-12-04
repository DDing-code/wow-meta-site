const { chromium } = require('playwright');
const fs = require('fs');

// 비전 마법사 스킬 ID 목록
const skillIds = [
  { id: 5143, key: 'arcanemissiles' },
  { id: 30451, key: 'arcaneblast' },
  { id: 44425, key: 'arcanebarrage' },
  { id: 153626, key: 'arcaneorb' },
  { id: 1449, key: 'arcaneexplosion' },
  { id: 210824, key: 'touchofthemagi' },
  { id: 12051, key: 'evocation' },
  { id: 116014, key: 'arcanecharges' },
  { id: 205025, key: 'presenceofmind' },
  { id: 66, key: 'invisibility' },
  { id: 80353, key: 'timewarp' },
  { id: 1459, key: 'arcaneintellect' },
  { id: 212653, key: 'shimmer' },
  { id: 414658, key: 'netherprecision' }
];

async function extractIconFromWowhead(skillId) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log(`스킬 ID ${skillId} 확인 중...`);
    await page.goto(`https://www.wowhead.com/ko/spell=${skillId}`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // 아이콘 요소가 로드될 때까지 대기
    await page.waitForSelector('a[href*="/icon="]', { timeout: 10000 }).catch(() => null);

    // 아이콘 정보 추출
    const iconName = await page.evaluate(() => {
      const iconElement = document.querySelector('a[href*="/icon="]');
      if (iconElement) {
        const text = iconElement.textContent.trim();
        return text;
      }
      return null;
    });

    if (iconName) {
      console.log(`  ✅ ${skillId}: ${iconName}`);
    } else {
      console.log(`  ❌ ${skillId}: 아이콘 찾을 수 없음`);
    }

    await browser.close();
    return iconName;
  } catch (error) {
    console.error(`  ❌ ${skillId}: 오류 - ${error.message}`);
    await browser.close();
    return null;
  }
}

async function main() {
  console.log('비전 마법사 스킬 아이콘 추출 시작...\n');

  const results = {};

  for (const skill of skillIds) {
    const icon = await extractIconFromWowhead(skill.id);
    results[skill.key] = {
      id: skill.id,
      icon: icon || 'bnet-large'
    };

    // Rate limiting (Wowhead 부하 방지)
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n=== 추출 결과 ===');
  console.log(JSON.stringify(results, null, 2));

  // 결과를 파일로 저장
  fs.writeFileSync(
    'arcane-mage-icons-result.json',
    JSON.stringify(results, null, 2),
    'utf8'
  );

  console.log('\n결과가 arcane-mage-icons-result.json에 저장되었습니다.');
}

main().catch(console.error);
