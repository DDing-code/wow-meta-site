// Wowhead에서 비전 마법사 스킬 전체 데이터 추출
const { chromium } = require('playwright');
const fs = require('fs');

const skillIds = [
  '30451', '5143', '44425', '365350', '321507', '12051', '153626',
  '263725', '36032', '448604', '451073', '759', '205025', '212653',
  '2139', '342245', '157980', '376103', '1449', '114923', '449400',
  '45438', '66', '55342', '130'
];

async function extractSkillData(page, id) {
  try {
    await page.goto(`https://www.wowhead.com/ko/spell=${id}`, {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    await page.waitForTimeout(2000); // 페이지 로딩 대기

    const data = await page.evaluate(() => {
      // 제목에서 한국어 스킬명 추출
      const title = document.title;
      const koreanName = title.split(' - ')[0]?.trim() || '';

      // 메인 툴팁에서 정보 추출
      const tooltip = document.querySelector('.tooltip') || document.querySelector('[data-tooltip]');

      // 설명 추출
      const descElements = document.querySelectorAll('.q, .q1, .q2');
      let description = '';
      descElements.forEach(el => {
        description += el.textContent.trim() + ' ';
      });

      // 상세 정보 테이블에서 데이터 추출
      const detailsTable = document.querySelector('table.infobox');
      const details = {};

      if (detailsTable) {
        const rows = detailsTable.querySelectorAll('tr');
        rows.forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length >= 2) {
            const key = cells[0].textContent.trim();
            const value = cells[1].textContent.trim();
            details[key] = value;
          }
        });
      }

      // 아이콘명 추출
      let icon = '';
      const iconLink = document.querySelector('a[href*="/icon="]');
      if (iconLink) {
        const match = iconLink.href.match(/icon=(\d+)\/([\w-]+)/);
        if (match) icon = match[2];
      }

      return {
        koreanName,
        description: description.trim(),
        icon,
        details
      };
    });

    console.log(`✅ [${id}] ${data.koreanName}`);
    return { id, ...data };

  } catch (error) {
    console.log(`❌ [${id}] 추출 실패: ${error.message}`);
    return null;
  }
}

(async () => {
  console.log('🔍 Wowhead에서 비전 마법사 스킬 데이터 추출 시작...\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const results = [];

  for (const id of skillIds) {
    const skillData = await extractSkillData(page, id);
    if (skillData) {
      results.push(skillData);
    }
    await page.waitForTimeout(1000); // Rate limiting
  }

  await browser.close();

  // 결과 저장
  const outputPath = './arcane-mage-wowhead-data.json';
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');

  console.log(`\n✨ 추출 완료: ${results.length}/${skillIds.length}개`);
  console.log(`📄 저장 위치: ${outputPath}`);

  // 요약 출력
  console.log('\n📊 추출된 스킬 목록:');
  results.forEach((skill, idx) => {
    console.log(`${idx + 1}. [${skill.id}] ${skill.koreanName}`);
  });
})();
