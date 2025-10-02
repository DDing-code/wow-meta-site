/**
 * Wowhead에서 스킬 상세 설명 가져오기
 * Playwright를 사용하여 실제 툴팁 내용을 수집
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// 전사 주요 스킬 ID들
const warriorSkills = [
  100,    // 돌진 (Charge)
  355,    // 도발 (Taunt)
  845,    // 회전베기 (Cleave)
  871,    // 방패의 벽 (Shield Wall)
  1160,   // 사기의 외침 (Demoralizing Shout)
  1464,   // 격돌 (Slam)
  1680,   // 소용돌이 (Whirlwind)
  1715,   // 무력화 (Hamstring)
  1719,   // 무모한 희생 (Recklessness)
  2565,   // 방패 올리기 (Shield Block)
  5308,   // 마무리 일격 (Execute)
  6343,   // 천둥벼락 (Thunder Clap)
  6544,   // 영웅의 도약 (Heroic Leap)
  6552,   // 들이치기 (Pummel)
  6572,   // 복수 (Revenge)
  6673,   // 전투의 외침 (Battle Shout)
  7384,   // 제압 (Overpower)
  12294,  // 필사의 일격 (Mortal Strike)
  23881,  // 피의 갈증 (Bloodthirst)
  23922,  // 방패 밀쳐내기 (Shield Slam)
];

async function fetchDescriptions() {
  const browser = await chromium.launch({
    headless: false,
    args: ['--lang=ko-KR']
  });

  const context = await browser.newContext({
    locale: 'ko-KR',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });

  const page = await context.newPage();

  const descriptions = {};
  const outputPath = path.join(__dirname, 'wowhead-full-descriptions.json');

  // 기존 데이터 로드
  if (fs.existsSync(outputPath)) {
    const existing = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    Object.assign(descriptions, existing);
  }

  console.log('🎯 Wowhead에서 스킬 상세 설명 가져오기 시작');

  for (const skillId of warriorSkills) {
    if (descriptions[skillId]) {
      console.log(`✓ ${skillId} 이미 존재함`);
      continue;
    }

    try {
      const url = `https://ko.wowhead.com/spell=${skillId}`;
      console.log(`\n📖 ${skillId} 스킬 정보 가져오는 중...`);

      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // 페이지 로드 대기
      await page.waitForTimeout(3000);

      // 스킬 정보 추출
      const skillData = await page.evaluate(() => {
        // 스킬 이름
        const nameElem = document.querySelector('h1.heading-size-1');
        const krName = nameElem ? nameElem.textContent.trim() : '';

        // 툴팁 내용 찾기
        let tooltip = '';

        // 방법 1: 툴팁 div에서 직접 가져오기
        const tooltipElem = document.querySelector('.q0, .q1, .q2, .q3, .q4, .q5, .q6');
        if (tooltipElem) {
          tooltip = tooltipElem.innerText || tooltipElem.textContent || '';
        }

        // 방법 2: 테이블에서 가져오기
        if (!tooltip) {
          const tables = document.querySelectorAll('table.grid');
          for (const table of tables) {
            const text = table.innerText || table.textContent || '';
            if (text.includes('사정거리') || text.includes('시전') || text.includes('재사용')) {
              tooltip = text;
              break;
            }
          }
        }

        // 방법 3: 스크립트에서 가져오기
        if (!tooltip && window.WH && window.WH.Tooltip) {
          const scripts = document.querySelectorAll('script');
          for (const script of scripts) {
            const content = script.textContent || '';
            if (content.includes('tooltip_')) {
              const match = content.match(/tooltip[^"]*":\s*"([^"]+)"/);
              if (match) {
                tooltip = match[1]
                  .replace(/\\n/g, '\n')
                  .replace(/\\"/g, '"')
                  .replace(/<[^>]+>/g, '');
              }
            }
          }
        }

        // 기본 정보들
        const range = document.querySelector('.q0:contains("야드"), .q1:contains("야드")');
        const castTime = document.querySelector('.q0:contains("시전"), .q1:contains("시전")');
        const cooldown = document.querySelector('.q0:contains("재사용"), .q1:contains("재사용")');

        return {
          krName,
          tooltip: tooltip.trim(),
          range: range ? range.textContent : '',
          castTime: castTime ? castTime.textContent : '',
          cooldown: cooldown ? cooldown.textContent : ''
        };
      });

      if (skillData.krName) {
        descriptions[skillId] = {
          id: skillId,
          krName: skillData.krName,
          description: skillData.tooltip || `${skillData.range} ${skillData.castTime} ${skillData.cooldown}`.trim(),
          fullTooltip: skillData.tooltip
        };

        console.log(`✅ ${skillId}: ${skillData.krName}`);
        if (skillData.tooltip) {
          console.log(`   설명: ${skillData.tooltip.substring(0, 100)}...`);
        }

        // 중간 저장
        fs.writeFileSync(outputPath, JSON.stringify(descriptions, null, 2), 'utf8');
      }

      // 과부하 방지
      await page.waitForTimeout(2000);

    } catch (error) {
      console.error(`❌ ${skillId} 실패:`, error.message);
    }
  }

  await browser.close();

  console.log(`\n✅ 완료! ${Object.keys(descriptions).length}개 스킬 설명 수집됨`);
  console.log(`📁 저장 위치: ${outputPath}`);
}

fetchDescriptions().catch(console.error);