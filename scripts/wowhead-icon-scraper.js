/**
 * Wowhead에서 스킬 아이콘 정보 스크래핑
 * Playwright를 사용하여 실제 아이콘 이름 수집
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// 확인할 스킬 ID 목록 (주요 스킬들)
const skillsToCheck = [
  // 전사
  { id: 100, name: '돌진' },
  { id: 355, name: '도발' },
  { id: 1715, name: '무력화' },
  { id: 6552, name: '들이치기' },
  { id: 6673, name: '전투의 외침' },
  { id: 6544, name: '영웅의 도약' },
  { id: 1680, name: '소용돌이' },
  { id: 34428, name: '연전연승' },
  { id: 57755, name: '영웅의 투척' },
  { id: 97462, name: '재집결의 함성' },
  { id: 12294, name: '필사의 일격' },
  { id: 167105, name: '거인의 강타' },
  { id: 260708, name: '휩쓸기 일격' },
  { id: 845, name: '회전베기' },
  { id: 118038, name: '투사의 혼' },
  { id: 227847, name: '칼날폭풍' },
  { id: 7384, name: '제압' },
  { id: 1464, name: '격돌' },
  { id: 23881, name: '피의 갈증' },
  { id: 85288, name: '분노의 강타' },
  { id: 184367, name: '광란' },
  { id: 5308, name: '마무리 일격' },
  { id: 1719, name: '무모한 희생' },
  { id: 184361, name: '격노' },
  { id: 184364, name: '격노의 재생력' },
  { id: 23922, name: '방패 밀쳐내기' },
  { id: 2565, name: '방패 올리기' },
  { id: 871, name: '방패의 벽' },
  { id: 401150, name: '화신' },
  { id: 190456, name: '고통 감내' },
  { id: 6343, name: '천둥벼락' },
  { id: 6572, name: '복수' },
  { id: 12975, name: '최후의 저항' },
  { id: 23920, name: '주문 반사' },
  { id: 1160, name: '사기의 외침' },

  // 성기사 주요 스킬
  { id: 853, name: '심판의 망치' },
  { id: 633, name: '신의 보호막' },
  { id: 642, name: '천상의 보호막' },
  { id: 1022, name: '보호의 손길' },
  { id: 1044, name: '자유의 손길' },
  { id: 31884, name: '응징의 격노' },
];

async function scrapeWowheadIcons() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--lang=ko-KR']
  });

  const results = {};

  try {
    const page = await browser.newPage();

    // 한국어 설정
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'ko-KR,ko;q=0.9'
    });

    for (const skill of skillsToCheck) {
      try {
        const url = `https://www.wowhead.com/spell=${skill.id}`;
        console.log(`🔍 확인 중: ${skill.name} (${skill.id})`);

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });

        // 아이콘 이미지 URL 추출
        const iconUrl = await page.evaluate(() => {
          // 아이콘 이미지 찾기
          const iconImg = document.querySelector('.iconlarge ins') ||
                         document.querySelector('.icon-56 ins') ||
                         document.querySelector('[data-icon] ins');

          if (iconImg) {
            const style = iconImg.getAttribute('style') || '';
            const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/);
            if (match) {
              return match[1];
            }
          }

          // 대체 방법
          const img = document.querySelector('img[src*="/icons/"]');
          return img ? img.src : null;
        });

        if (iconUrl) {
          // URL에서 아이콘 이름 추출
          const match = iconUrl.match(/\/icons\/[^/]+\/([^/]+)\.(jpg|png)/);
          if (match) {
            const iconName = match[1];
            results[skill.id] = iconName;
            console.log(`  ✅ ${skill.id}: '${iconName}', // ${skill.name}`);
          }
        } else {
          console.log(`  ⚠️ ${skill.id}: 아이콘을 찾을 수 없음`);
        }

        // 요청 간 딜레이
        await page.waitForTimeout(500);

      } catch (error) {
        console.log(`  ❌ ${skill.id}: 에러 - ${error.message}`);
      }
    }

  } finally {
    await browser.close();
  }

  // 결과 저장
  const outputPath = path.join(__dirname, 'wowhead-icons.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');

  console.log(`\n✅ 총 ${Object.keys(results).length}개의 아이콘 매핑 완료`);
  console.log(`📝 결과 저장: ${outputPath}`);

  // JavaScript 코드 생성
  console.log('\n📋 복사할 코드:\n');
  console.log('const spellIdToIcon = {');
  Object.entries(results).forEach(([id, icon]) => {
    const skill = skillsToCheck.find(s => s.id === parseInt(id));
    console.log(`  ${id}: '${icon}', // ${skill ? skill.name : ''}`);
  });
  console.log('};');

  return results;
}

// 실행
scrapeWowheadIcons().catch(console.error);