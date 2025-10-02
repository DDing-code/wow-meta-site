const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

console.log('🚀 클래스별 특성 계산기에서 완전한 데이터 수집...');

// 클래스별 특성 계산기 URL (TWW 시즌 3)
const classUrls = {
  'warrior': {
    name: '전사',
    url: 'https://ko.wowhead.com/talent-calc/warrior',
    specs: ['무기', '분노', '방어']
  },
  'paladin': {
    name: '성기사',
    url: 'https://ko.wowhead.com/talent-calc/paladin',
    specs: ['신성', '보호', '징벌']
  },
  'hunter': {
    name: '사냥꾼',
    url: 'https://ko.wowhead.com/talent-calc/hunter',
    specs: ['야수', '사격', '생존']
  },
  'rogue': {
    name: '도적',
    url: 'https://ko.wowhead.com/talent-calc/rogue',
    specs: ['암살', '무법', '잠행']
  },
  'priest': {
    name: '사제',
    url: 'https://ko.wowhead.com/talent-calc/priest',
    specs: ['수양', '신성', '암흑']
  },
  'shaman': {
    name: '주술사',
    url: 'https://ko.wowhead.com/talent-calc/shaman',
    specs: ['정기', '고양', '복원']
  },
  'mage': {
    name: '마법사',
    url: 'https://ko.wowhead.com/talent-calc/mage',
    specs: ['비전', '화염', '냉기']
  },
  'warlock': {
    name: '흑마법사',
    url: 'https://ko.wowhead.com/talent-calc/warlock',
    specs: ['고통', '악마', '파괴']
  },
  'monk': {
    name: '수도사',
    url: 'https://ko.wowhead.com/talent-calc/monk',
    specs: ['양조', '운무', '풍운']
  },
  'druid': {
    name: '드루이드',
    url: 'https://ko.wowhead.com/talent-calc/druid',
    specs: ['조화', '야성', '수호', '회복']
  },
  'demon-hunter': {
    name: '악마사냥꾼',
    url: 'https://ko.wowhead.com/talent-calc/demon-hunter',
    specs: ['파멸', '복수']
  },
  'death-knight': {
    name: '죽음의기사',
    url: 'https://ko.wowhead.com/talent-calc/death-knight',
    specs: ['혈기', '냉기', '부정']
  },
  'evoker': {
    name: '기원사',
    url: 'https://ko.wowhead.com/talent-calc/evoker',
    specs: ['황폐', '보존', '증강']
  }
};

async function collectClassData(browser, className, classInfo) {
  const page = await browser.newPage();
  const collectedSkills = {};

  try {
    console.log(`\n📚 ${classInfo.name} 데이터 수집 중...`);

    await page.goto(classInfo.url, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    // 페이지 로딩 대기
    await page.waitForTimeout(5000);

    // 특성 데이터 추출
    const talentData = await page.evaluate(() => {
      const skills = {};

      // 모든 특성 노드 수집
      const talentNodes = document.querySelectorAll('[data-spell-id], .talent-node, .tiered-talent-node');

      talentNodes.forEach(node => {
        try {
          // 스킬 ID 추출
          const spellId = node.getAttribute('data-spell-id') ||
                         node.getAttribute('data-node-id') ||
                         node.getAttribute('data-talent-id');

          if (!spellId) return;

          // 툴팁 또는 노드 정보 추출
          const tooltipContent = node.querySelector('.tooltip-content, .spell-tooltip');
          const nameElement = node.querySelector('.talent-name, .node-name, b');
          const descElement = node.querySelector('.talent-description, .node-description, .q');

          if (nameElement) {
            const skill = {
              id: spellId,
              koreanName: nameElement.textContent.trim(),
              type: '특성', // 특성 계산기에서 가져온 것은 모두 특성
            };

            // 설명 추출
            if (descElement) {
              skill.description = descElement.textContent.trim()
                .replace(/\n+/g, ' ')
                .replace(/\s+/g, ' ');
            }

            // 아이콘 추출
            const iconElement = node.querySelector('.icon img, .talent-icon img, ins');
            if (iconElement) {
              const src = iconElement.src || iconElement.style.backgroundImage || '';
              const match = src.match(/\/([^\/]+)\.(jpg|png)/);
              if (match) {
                skill.icon = match[1];
              }
            }

            // 전문화 판별 (노드 위치나 부모 요소로)
            const specContainer = node.closest('[data-spec], .spec-tree, .talent-tree');
            if (specContainer) {
              const specId = specContainer.getAttribute('data-spec') ||
                           specContainer.getAttribute('data-tree-id');
              if (specId) {
                skill.specId = specId;
              }
            }

            skills[spellId] = skill;
          }
        } catch (e) {
          console.error('노드 처리 오류:', e);
        }
      });

      // 기본 스킬 수집 (특성이 아닌 것들)
      const baselineSkills = document.querySelectorAll('.spell-icon-list .spell-icon, .baseline-spell');
      baselineSkills.forEach(spell => {
        const spellId = spell.getAttribute('data-spell-id');
        const nameElement = spell.querySelector('.spell-name, a');

        if (spellId && nameElement) {
          skills[spellId] = {
            id: spellId,
            koreanName: nameElement.textContent.trim(),
            type: '기본',
            spec: '공용'
          };
        }
      });

      return skills;
    });

    // 각 전문화별로 상세 정보 수집
    for (const spec of classInfo.specs) {
      console.log(`  🎯 ${spec} 전문화 확인 중...`);

      // 전문화 버튼 클릭 시도
      try {
        await page.evaluate((specName) => {
          // 전문화 탭 찾기
          const specTabs = document.querySelectorAll('.spec-tab, .spec-button, [data-spec-name]');
          specTabs.forEach(tab => {
            if (tab.textContent.includes(specName)) {
              tab.click();
            }
          });
        }, spec);

        await page.waitForTimeout(2000);

        // 현재 활성화된 전문화의 스킬 수집
        const specSkills = await page.evaluate((specName) => {
          const skills = {};
          const activeNodes = document.querySelectorAll('.talent-node.active, .talent-node.selected');

          activeNodes.forEach(node => {
            const spellId = node.getAttribute('data-spell-id');
            if (spellId) {
              const nameElement = node.querySelector('.talent-name');
              if (nameElement) {
                skills[spellId] = {
                  spec: specName
                };
              }
            }
          });

          return skills;
        }, spec);

        // 병합
        Object.assign(talentData, specSkills);

      } catch (e) {
        console.log(`    ⚠️ ${spec} 전문화 데이터 수집 실패`);
      }
    }

    // 수집된 데이터 정리
    Object.entries(talentData).forEach(([skillId, skill]) => {
      collectedSkills[skillId] = {
        ...skill,
        class: classInfo.name
      };
    });

    console.log(`  ✅ ${Object.keys(collectedSkills).length}개 스킬 수집 완료`);

  } catch (error) {
    console.error(`❌ ${classInfo.name} 수집 실패:`, error.message);
  } finally {
    await page.close();
  }

  return collectedSkills;
}

async function main() {
  const browser = await puppeteer.launch({
    headless: false, // UI 확인용
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const completeDatabase = {};

  try {
    // 각 클래스별 수집
    for (const [classKey, classInfo] of Object.entries(classUrls)) {
      const classSkills = await collectClassData(browser, classKey, classInfo);
      completeDatabase[classKey] = classSkills;

      // 중간 저장
      const tempPath = path.join(__dirname, `talent-data-${classKey}.json`);
      fs.writeFileSync(tempPath, JSON.stringify(classSkills, null, 2), 'utf8');

      // 서버 부하 방지
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

  } catch (error) {
    console.error('수집 중 오류:', error);
  } finally {
    await browser.close();
  }

  // 최종 데이터베이스 생성
  const outputPath = path.join(__dirname, 'tww-s3-talent-database.json');
  fs.writeFileSync(outputPath, JSON.stringify(completeDatabase, null, 2), 'utf8');

  // 통계
  let totalSkills = 0;
  let talentSkills = 0;
  let baselineSkills = 0;

  Object.values(completeDatabase).forEach(classSkills => {
    Object.values(classSkills).forEach(skill => {
      totalSkills++;
      if (skill.type === '특성') talentSkills++;
      if (skill.type === '기본') baselineSkills++;
    });
  });

  console.log('\n✅ 수집 완료!');
  console.log('📊 통계:');
  console.log(`  - 총 스킬: ${totalSkills}개`);
  console.log(`  - 특성: ${talentSkills}개`);
  console.log(`  - 기본 스킬: ${baselineSkills}개`);
  console.log(`\n💾 저장 위치: ${outputPath}`);
}

main().catch(console.error);