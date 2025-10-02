const { chromium } = require('playwright');
const fs = require('fs');

// 나머지 16개 특성 ID 목록
const remainingTalentIds = [
  '387393', '387441', '387163', '119898',
  '196098', '387157', '387158', '270580',
  '193396', '193440', '111897', '196099',
  '119905', '267214', '456552', '455145'
];

async function extractTalent(page, talentId) {
  const url = `https://www.wowhead.com/ko/spell=${talentId}`;
  console.log(`${talentId} 추출 중...`);

  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(3000);

  const talentData = await page.evaluate((id) => {
    const bodyText = document.body.innerText;

    // Korean name from h1
    const koreanName = document.querySelector('h1')?.textContent.trim() || '';

    // English name
    const englishMatch = bodyText.match(/영어:\s*(.+)/);
    const englishName = englishMatch ? englishMatch[1].trim() : '';

    // Icon name
    const iconMatch = bodyText.match(/아이콘:\s*([\w_]+)/);
    const icon = iconMatch ? iconMatch[1].replace(/__/g, '_') : '';

    // Description - find main description
    const descLines = bodyText.split('\n');
    let description = '';
    for (let i = 0; i < descLines.length; i++) {
      const line = descLines[i].trim();
      if (line.length > 20 && !line.includes('영어:') && !line.includes('아이콘:') &&
          !line.includes('레벨:') && !line.includes('직업:') && !line.includes('패치') &&
          (line.includes('피해') || line.includes('증가') || line.includes('감소') ||
           line.includes('소환') || line.includes('생성') || line.includes('지속') ||
           line.includes('적용') || line.includes('효과') || line.includes('대상'))) {
        description = line;
        break;
      }
    }

    // Cast time
    const castMatch = bodyText.match(/즉시|(\d+\.?\d*)\s*초\s*주문\s*시전\s*시간/);
    const castTime = castMatch ? (castMatch[0].includes('즉시') ? '즉시' : castMatch[1] + ' 초') : '해당 없음';

    // Cooldown
    const cooldownMatch = bodyText.match(/재사용\s*대기시간\s*(\d+\.?\d*)\s*(초|분)/);
    const cooldown = cooldownMatch ? cooldownMatch[1] + ' ' + cooldownMatch[2] : '해당 없음';

    // Range
    const rangeMatch = bodyText.match(/(\d+)\s*야드/);
    const range = rangeMatch ? rangeMatch[0] : '해당 없음';

    // Resource cost
    const manaCostMatch = bodyText.match(/(\d+\.?\d*%)\s*\(기본\s*마나\s*중\)/);
    const shardCostMatch = bodyText.match(/영혼의\s*조각\s*(\d+)개/);
    let resourceCost = '없음';
    if (manaCostMatch) {
      resourceCost = manaCostMatch[0];
    } else if (shardCostMatch) {
      resourceCost = shardCostMatch[0];
    }

    // Resource gain
    const shardGainMatch = bodyText.match(/영혼의\s*조각\s*\d+개.*생성/);
    const resourceGain = shardGainMatch ? shardGainMatch[0].match(/영혼의\s*조각\s*\d+개/)[0] : '없음';

    return {
      id,
      koreanName,
      englishName,
      icon,
      description,
      castTime,
      cooldown,
      resourceCost,
      resourceGain,
      range,
      type: '특성',
      spec: '악마'
    };
  }, talentId);

  console.log(`✓ ${talentId} - ${talentData.koreanName} 추출 완료`);
  return talentData;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // 기존 2개 특성 로드
  const existingTalents = JSON.parse(
    fs.readFileSync('extracted-demonology-talents.json', 'utf8')
  );

  const allTalents = [...existingTalents];

  // 나머지 16개 추출
  for (const talentId of remainingTalentIds) {
    try {
      const talent = await extractTalent(page, talentId);
      allTalents.push(talent);
      await page.waitForTimeout(1000); // Rate limiting
    } catch (error) {
      console.error(`✗ ${talentId} 추출 실패:`, error.message);
    }
  }

  // 전체 저장
  fs.writeFileSync(
    'extracted-demonology-talents.json',
    JSON.stringify(allTalents, null, 2),
    'utf8'
  );

  console.log(`\n=== 추출 완료 ===`);
  console.log(`총 ${allTalents.length}개 특성 추출 완료`);

  await browser.close();
})();