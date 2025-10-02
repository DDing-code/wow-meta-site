const fs = require('fs').promises;
const { chromium } = require('playwright');

// 클래스별 특성 계산기 URL
const TALENT_CALC_URLS = {
  WARRIOR: [
    { spec: 'arms', url: 'https://www.wowhead.com/talent-calc/warrior/arms' },
    { spec: 'fury', url: 'https://www.wowhead.com/talent-calc/warrior/fury' },
    { spec: 'protection', url: 'https://www.wowhead.com/talent-calc/warrior/protection' }
  ],
  PALADIN: [
    { spec: 'holy', url: 'https://www.wowhead.com/talent-calc/paladin/holy' },
    { spec: 'protection', url: 'https://www.wowhead.com/talent-calc/paladin/protection' },
    { spec: 'retribution', url: 'https://www.wowhead.com/talent-calc/paladin/retribution' }
  ],
  HUNTER: [
    { spec: 'beast-mastery', url: 'https://www.wowhead.com/talent-calc/hunter/beast-mastery' },
    { spec: 'marksmanship', url: 'https://www.wowhead.com/talent-calc/hunter/marksmanship' },
    { spec: 'survival', url: 'https://www.wowhead.com/talent-calc/hunter/survival' }
  ],
  ROGUE: [
    { spec: 'assassination', url: 'https://www.wowhead.com/talent-calc/rogue/assassination' },
    { spec: 'outlaw', url: 'https://www.wowhead.com/talent-calc/rogue/outlaw' },
    { spec: 'subtlety', url: 'https://www.wowhead.com/talent-calc/rogue/subtlety' }
  ],
  PRIEST: [
    { spec: 'discipline', url: 'https://www.wowhead.com/talent-calc/priest/discipline' },
    { spec: 'holy', url: 'https://www.wowhead.com/talent-calc/priest/holy' },
    { spec: 'shadow', url: 'https://www.wowhead.com/talent-calc/priest/shadow' }
  ],
  SHAMAN: [
    { spec: 'elemental', url: 'https://www.wowhead.com/talent-calc/shaman/elemental' },
    { spec: 'enhancement', url: 'https://www.wowhead.com/talent-calc/shaman/enhancement' },
    { spec: 'restoration', url: 'https://www.wowhead.com/talent-calc/shaman/restoration' }
  ],
  MAGE: [
    { spec: 'arcane', url: 'https://www.wowhead.com/talent-calc/mage/arcane' },
    { spec: 'fire', url: 'https://www.wowhead.com/talent-calc/mage/fire' },
    { spec: 'frost', url: 'https://www.wowhead.com/talent-calc/mage/frost' }
  ],
  WARLOCK: [
    { spec: 'affliction', url: 'https://www.wowhead.com/talent-calc/warlock/affliction' },
    { spec: 'demonology', url: 'https://www.wowhead.com/talent-calc/warlock/demonology' },
    { spec: 'destruction', url: 'https://www.wowhead.com/talent-calc/warlock/destruction' }
  ],
  MONK: [
    { spec: 'brewmaster', url: 'https://www.wowhead.com/talent-calc/monk/brewmaster' },
    { spec: 'mistweaver', url: 'https://www.wowhead.com/talent-calc/monk/mistweaver' },
    { spec: 'windwalker', url: 'https://www.wowhead.com/talent-calc/monk/windwalker' }
  ],
  DRUID: [
    { spec: 'balance', url: 'https://www.wowhead.com/talent-calc/druid/balance' },
    { spec: 'feral', url: 'https://www.wowhead.com/talent-calc/druid/feral' },
    { spec: 'guardian', url: 'https://www.wowhead.com/talent-calc/druid/guardian' },
    { spec: 'restoration', url: 'https://www.wowhead.com/talent-calc/druid/restoration' }
  ],
  DEMONHUNTER: [
    { spec: 'havoc', url: 'https://www.wowhead.com/talent-calc/demon-hunter/havoc' },
    { spec: 'vengeance', url: 'https://www.wowhead.com/talent-calc/demon-hunter/vengeance' }
  ],
  DEATHKNIGHT: [
    { spec: 'blood', url: 'https://www.wowhead.com/talent-calc/death-knight/blood' },
    { spec: 'frost', url: 'https://www.wowhead.com/talent-calc/death-knight/frost' },
    { spec: 'unholy', url: 'https://www.wowhead.com/talent-calc/death-knight/unholy' }
  ],
  EVOKER: [
    { spec: 'devastation', url: 'https://www.wowhead.com/talent-calc/evoker/devastation' },
    { spec: 'preservation', url: 'https://www.wowhead.com/talent-calc/evoker/preservation' },
    { spec: 'augmentation', url: 'https://www.wowhead.com/talent-calc/evoker/augmentation' }
  ]
};

async function collectHeroTalentsFromCalculator() {
  console.log('🚀 특성 계산기에서 영웅특성 데이터 수집 시작\n');

  const browser = await chromium.launch({
    headless: false,  // UI 표시하여 확인
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  // 에러 무시
  page.on('pageerror', () => {});
  page.on('error', () => {});

  const allHeroTalents = {};

  // 각 클래스별로 처리
  for (const [className, specs] of Object.entries(TALENT_CALC_URLS)) {
    console.log(`\n=== ${className} 클래스 처리 중 ===`);
    allHeroTalents[className] = {};

    // 첫 번째 전문화만 처리 (영웅특성은 모든 전문화에서 동일)
    const spec = specs[0];
    console.log(`  📊 ${spec.spec} 전문화 특성 계산기 접속...`);

    try {
      await page.goto(spec.url, {
        waitUntil: 'networkidle',
        timeout: 60000
      });

      // 페이지 완전 로딩 대기
      await page.waitForTimeout(5000);

      // 영웅특성 탭 찾기 및 클릭
      const heroTalentTab = await page.$('button:has-text("Hero Talents"), .hero-tab, #hero-talents-tab, [data-tab="hero"]');

      if (heroTalentTab) {
        console.log('    영웅특성 탭 발견, 클릭...');
        await heroTalentTab.click();
        await page.waitForTimeout(3000);
      }

      // 영웅특성 데이터 수집
      const heroTalentData = await page.evaluate(() => {
        const talents = [];

        // 영웅특성 노드 찾기
        const talentNodes = document.querySelectorAll('[data-talent-id], [data-spell-id], .hero-talent-node, .talent-node');

        talentNodes.forEach(node => {
          try {
            // 스킬 ID 추출
            let spellId = node.getAttribute('data-spell-id') || node.getAttribute('data-talent-id');

            if (!spellId) {
              const link = node.querySelector('a[href*="/spell="]');
              if (link) {
                const match = link.href.match(/spell=(\d+)/);
                if (match) spellId = match[1];
              }
            }

            if (!spellId) return;

            // 스킬명 추출
            const nameElem = node.querySelector('.talent-name, .spell-name, .name');
            const name = nameElem ? nameElem.textContent.trim() : '';

            // 아이콘 추출
            const iconElem = node.querySelector('ins, .icon, img');
            let icon = 'inv_misc_questionmark';

            if (iconElem) {
              const style = iconElem.getAttribute('style');
              const src = iconElem.getAttribute('src');

              if (style) {
                const iconMatch = style.match(/\/([^\/]+)\.(jpg|png)/);
                if (iconMatch) icon = iconMatch[1];
              } else if (src) {
                const iconMatch = src.match(/\/([^\/]+)\.(jpg|png)/);
                if (iconMatch) icon = iconMatch[1];
              }
            }

            // 설명 추출 (툴팁)
            const descElem = node.querySelector('.talent-desc, .description, .tooltip-content');
            const description = descElem ? descElem.textContent.trim() : '';

            // 영웅특성 트리 이름 추출
            const treeElem = node.closest('.hero-tree, .talent-tree');
            const treeName = treeElem ? treeElem.getAttribute('data-tree-name') : '';

            talents.push({
              id: spellId,
              name: name,
              icon: icon,
              description: description.substring(0, 500),
              tree: treeName
            });

          } catch (e) {
            console.error('노드 처리 오류:', e);
          }
        });

        return talents;
      });

      console.log(`    수집된 영웅특성 스킬: ${heroTalentData.length}개`);

      // 한국어 페이지에서도 수집 시도
      const koUrl = spec.url.replace('www.wowhead.com', 'ko.wowhead.com');
      console.log(`    한국어 페이지 접속 중...`);

      await page.goto(koUrl, {
        waitUntil: 'networkidle',
        timeout: 60000
      });

      await page.waitForTimeout(5000);

      // 영웅특성 탭 클릭 (한국어)
      const koHeroTab = await page.$('button:has-text("영웅 특성"), button:has-text("Hero"), .hero-tab');
      if (koHeroTab) {
        await koHeroTab.click();
        await page.waitForTimeout(3000);
      }

      // 한국어 데이터 수집
      const koHeroTalentData = await page.evaluate(() => {
        const talents = {};

        const talentNodes = document.querySelectorAll('[data-talent-id], [data-spell-id], .hero-talent-node, .talent-node');

        talentNodes.forEach(node => {
          try {
            let spellId = node.getAttribute('data-spell-id') || node.getAttribute('data-talent-id');

            if (!spellId) {
              const link = node.querySelector('a[href*="/spell="]');
              if (link) {
                const match = link.href.match(/spell=(\d+)/);
                if (match) spellId = match[1];
              }
            }

            if (!spellId) return;

            const nameElem = node.querySelector('.talent-name, .spell-name, .name');
            const name = nameElem ? nameElem.textContent.trim() : '';

            const descElem = node.querySelector('.talent-desc, .description, .tooltip-content');
            const description = descElem ? descElem.textContent.trim() : '';

            talents[spellId] = {
              koreanName: name,
              koreanDescription: description.substring(0, 500)
            };

          } catch (e) {
            // 개별 노드 처리 실패 시 계속
          }
        });

        return talents;
      });

      // 데이터 병합
      for (const talent of heroTalentData) {
        const koData = koHeroTalentData[talent.id] || {};

        allHeroTalents[className][talent.id] = {
          id: talent.id,
          englishName: talent.name,
          koreanName: koData.koreanName || talent.name,
          icon: talent.icon,
          description: koData.koreanDescription || talent.description,
          type: '영웅특성',
          heroTalent: talent.tree || '미분류'
        };
      }

      console.log(`  ✅ ${className} 완료: ${Object.keys(allHeroTalents[className]).length}개 스킬`);

    } catch (error) {
      console.log(`  ❌ ${className} 처리 실패: ${error.message}`);
    }

    // 서버 부하 방지
    await page.waitForTimeout(3000);
  }

  // 최종 저장
  await fs.writeFile(
    './tww-s3-hero-talents-calculator.json',
    JSON.stringify(allHeroTalents, null, 2),
    'utf8'
  );

  // 통계 출력
  console.log('\n================================');
  console.log('✨ 영웅특성 데이터 수집 완료!');
  console.log('================================');

  let totalSkills = 0;
  for (const [className, skills] of Object.entries(allHeroTalents)) {
    const count = Object.keys(skills).length;
    console.log(`${className}: ${count}개`);
    totalSkills += count;
  }

  console.log(`\n📊 총 ${totalSkills}개 영웅특성 스킬 수집`);
  console.log('📁 저장 경로: tww-s3-hero-talents-calculator.json');
  console.log('================================');

  await browser.close();
}

// 실행
collectHeroTalentsFromCalculator().catch(console.error);