// Playwright를 사용한 대량 Wowhead 스킬 정보 수집 스크립트
const playwright = require('playwright');
const fs = require('fs');
const path = require('path');

// TWW Season 3 주요 스킬들 (전사부터 시작)
const skillsToFetch = [
  // 전사 기본 스킬
  { id: '1464', name: 'Slam', class: 'Warrior' },
  { id: '6552', name: 'Pummel', class: 'Warrior' },
  { id: '100', name: 'Charge', class: 'Warrior' },
  { id: '118778', name: 'Die by the Sword', class: 'Warrior' },
  { id: '97462', name: 'Rallying Cry', class: 'Warrior' },
  { id: '1719', name: 'Recklessness', class: 'Warrior' },
  { id: '6544', name: 'Heroic Leap', class: 'Warrior' },
  { id: '23920', name: 'Spell Reflection', class: 'Warrior' },
  { id: '1680', name: 'Whirlwind', class: 'Warrior' },
  { id: '85288', name: 'Raging Blow', class: 'Warrior' },
  { id: '184367', name: 'Rampage', class: 'Warrior' },
  { id: '5308', name: 'Execute', class: 'Warrior' },
  { id: '6343', name: 'Thunder Clap', class: 'Warrior' },
  { id: '190411', name: 'Sweeping Strikes', class: 'Warrior' },
  { id: '167105', name: 'Colossus Smash', class: 'Warrior' },
  { id: '260643', name: 'Skullsplitter', class: 'Warrior' },
  { id: '262161', name: 'Warbreaker', class: 'Warrior' },
  { id: '227847', name: 'Bladestorm', class: 'Warrior' },
  { id: '152277', name: 'Ravager', class: 'Warrior' },
  { id: '107574', name: 'Avatar', class: 'Warrior' },

  // 성기사 주요 스킬
  { id: '853', name: 'Hammer of Justice', class: 'Paladin' },
  { id: '633', name: 'Lay on Hands', class: 'Paladin' },
  { id: '642', name: 'Divine Shield', class: 'Paladin' },
  { id: '1022', name: 'Blessing of Protection', class: 'Paladin' },
  { id: '1044', name: 'Blessing of Freedom', class: 'Paladin' },
  { id: '31884', name: 'Avenging Wrath', class: 'Paladin' },
  { id: '20473', name: 'Holy Shock', class: 'Paladin' },
  { id: '85222', name: 'Light of Dawn', class: 'Paladin' },
  { id: '35395', name: 'Crusader Strike', class: 'Paladin' },
  { id: '184575', name: 'Blade of Justice', class: 'Paladin' },
  { id: '24275', name: 'Hammer of Wrath', class: 'Paladin' },
  { id: '255937', name: 'Wake of Ashes', class: 'Paladin' },
  { id: '31935', name: 'Avenger\'s Shield', class: 'Paladin' },

  // 사냥꾼 주요 스킬
  { id: '186265', name: 'Aspect of the Turtle', class: 'Hunter' },
  { id: '193530', name: 'Aspect of the Wild', class: 'Hunter' },
  { id: '147362', name: 'Counter Shot', class: 'Hunter' },
  { id: '109304', name: 'Exhilaration', class: 'Hunter' },
  { id: '187650', name: 'Freezing Trap', class: 'Hunter' },
  { id: '195645', name: 'Wing Clip', class: 'Hunter' },
  { id: '19574', name: 'Bestial Wrath', class: 'Hunter' },
  { id: '193455', name: 'Cobra Shot', class: 'Hunter' },
  { id: '217200', name: 'Barbed Shot', class: 'Hunter' },
  { id: '34026', name: 'Kill Command', class: 'Hunter' },
];

async function fetchSkillDetails(page, skill) {
  try {
    console.log(`📊 스킬 ${skill.id} (${skill.name}) 정보 수집 중...`);

    // Wowhead 페이지로 이동
    await page.goto(`https://ko.wowhead.com/spell=${skill.id}`, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // 페이지 로드 대기
    await page.waitForTimeout(2000);

    // 스킬 정보 추출
    const skillInfo = await page.evaluate(() => {
      const info = {};

      // 한글명 추출
      const titleElement = document.querySelector('h1.heading-size-1');
      if (titleElement) {
        info.koreanName = titleElement.textContent.trim().replace(/\s*\n\s*/g, '');
      }

      // 영문명 추출 (간단 정보에서)
      const englishMatch = document.body.textContent.match(/영어:\s*([A-Za-z\s'-]+)/);
      if (englishMatch) {
        info.englishName = englishMatch[1].trim();
      }

      // 설명 추출 - 더 정확한 선택자 사용
      const descElement = document.querySelector('div.q0, .spell-tooltip-description');
      if (!descElement) {
        // 대체 방법: 테이블에서 설명 찾기
        const tables = document.querySelectorAll('table.grid');
        for (const table of tables) {
          const cells = table.querySelectorAll('td');
          for (const cell of cells) {
            const text = cell.textContent;
            if (text && text.length > 30 && !text.includes('재사용 대기시간') && !text.includes('즉시')) {
              const cleanText = text.replace(/\s+/g, ' ').trim();
              if (!cleanText.includes('요구 레벨') && !cleanText.includes('직업:')) {
                info.description = cleanText;
                break;
              }
            }
          }
          if (info.description) break;
        }
      } else {
        info.description = descElement.textContent.replace(/\s+/g, ' ').trim();
      }

      // 재사용 대기시간
      const cooldownMatch = document.body.textContent.match(/(\d+(?:\.\d+)?)\s*초\s*재사용 대기시간/);
      if (cooldownMatch) {
        info.cooldown = cooldownMatch[1] + '초';
      }

      // 자원 비용
      const resourcePatterns = [
        /(\d+)\s*(분노|마나|기력|룬 마력|집중|신성한 힘|고통|원한|정기|영혼의 파편)/,
        /(\d+)%\s*기본 마나/,
        /마나\s*(\d+)/
      ];

      for (const pattern of resourcePatterns) {
        const match = document.body.textContent.match(pattern);
        if (match) {
          info.resource = match[0];
          break;
        }
      }

      // 사거리
      const rangeMatch = document.body.textContent.match(/(\d+)\s*(미터|야드)/);
      if (rangeMatch) {
        info.range = rangeMatch[0];
      } else if (document.body.textContent.includes('근접 사정거리')) {
        info.range = '근접';
      }

      // 시전 시간
      if (document.body.textContent.includes('즉시')) {
        info.castTime = '즉시';
      } else {
        const castMatch = document.body.textContent.match(/(\d+(?:\.\d+)?)\s*초\s*시전/);
        if (castMatch) {
          info.castTime = castMatch[1] + '초';
        }
      }

      // 아이콘 이름 추출
      const iconLink = document.querySelector('td a[href*="/icon="]');
      if (iconLink) {
        const iconText = iconLink.textContent;
        if (iconText) {
          info.iconName = iconText.trim();
        }
      }

      return info;
    });

    return {
      ...skill,
      ...skillInfo,
      fetchedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error(`❌ 스킬 ${skill.id} 처리 중 오류:`, error.message);
    return {
      ...skill,
      error: true,
      errorMessage: error.message
    };
  }
}

async function main() {
  const browser = await playwright.chromium.launch({
    headless: true // 배경 실행
  });

  const context = await browser.newContext({
    locale: 'ko-KR',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });

  const page = await context.newPage();

  const results = {};
  const batchSize = 5; // 5개씩 배치 처리

  for (let i = 0; i < skillsToFetch.length; i += batchSize) {
    const batch = skillsToFetch.slice(i, i + batchSize);
    console.log(`\n📦 배치 ${Math.floor(i/batchSize) + 1}/${Math.ceil(skillsToFetch.length/batchSize)} 처리 중...`);

    for (const skill of batch) {
      const result = await fetchSkillDetails(page, skill);
      results[skill.id] = result;

      if (result.koreanName) {
        console.log(`✅ ${skill.name} → ${result.koreanName}`);
      }

      // 요청 간 대기
      await page.waitForTimeout(1500);
    }

    // 배치 간 추가 대기
    if (i + batchSize < skillsToFetch.length) {
      console.log('⏳ 다음 배치 대기 중...');
      await page.waitForTimeout(3000);
    }
  }

  // 결과 저장
  const outputPath = path.join(__dirname, 'src', 'data', 'wowhead-translations.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');

  console.log(`\n✅ 총 ${Object.keys(results).length}개 스킬 정보 수집 완료`);
  console.log(`📄 저장 위치: ${outputPath}`);

  // 통계 출력
  const successful = Object.values(results).filter(r => !r.error).length;
  const failed = Object.values(results).filter(r => r.error).length;
  console.log(`📊 성공: ${successful}개, 실패: ${failed}개`);

  await browser.close();
}

// 실행
main().catch(console.error);