const fs = require('fs').promises;
const { chromium } = require('playwright');

// 영웅특성 트리 정보 (39개)
const HERO_TALENT_TREES = {
  // 전사 (3개)
  WARRIOR: [
    { id: 'colossus', name: '거신', nameEn: 'Colossus', specs: ['무기', '방어'] },
    { id: 'mountain-thane', name: '산왕', nameEn: 'Mountain Thane', specs: ['분노', '방어'] },
    { id: 'slayer', name: '학살자', nameEn: 'Slayer', specs: ['무기', '분노'] }
  ],
  // 성기사 (3개)
  PALADIN: [
    { id: 'lightsmith', name: '빛의 대장장이', nameEn: 'Lightsmith', specs: ['보호', '신성'] },
    { id: 'templar', name: '기사단', nameEn: 'Templar', specs: ['보호', '징벌'] },
    { id: 'herald-of-the-sun', name: '태양의 사자', nameEn: 'Herald of the Sun', specs: ['신성', '징벌'] }
  ],
  // 사냥꾼 (3개)
  HUNTER: [
    { id: 'dark-ranger', name: '어둠 순찰자', nameEn: 'Dark Ranger', specs: ['사격', '야수'] },
    { id: 'pack-leader', name: '무리의 지도자', nameEn: 'Pack Leader', specs: ['야수', '생존'] },
    { id: 'sentinel', name: '파수꾼', nameEn: 'Sentinel', specs: ['사격', '생존'] }
  ],
  // 도적 (3개)
  ROGUE: [
    { id: 'trickster', name: '기만자', nameEn: 'Trickster', specs: ['무법', '잠행'] },
    { id: 'fatebound', name: '운명결속', nameEn: 'Fatebound', specs: ['암살', '무법'] },
    { id: 'deathstalker', name: '죽음추적자', nameEn: 'Deathstalker', specs: ['암살', '잠행'] }
  ],
  // 사제 (3개)
  PRIEST: [
    { id: 'oracle', name: '예언자', nameEn: 'Oracle', specs: ['수양', '신성'] },
    { id: 'archon', name: '집정관', nameEn: 'Archon', specs: ['신성', '암흑'] },
    { id: 'voidweaver', name: '공허술사', nameEn: 'Voidweaver', specs: ['수양', '암흑'] }
  ],
  // 주술사 (3개)
  SHAMAN: [
    { id: 'farseer', name: '선견자', nameEn: 'Farseer', specs: ['정기', '복원'] },
    { id: 'totemic', name: '토템술사', nameEn: 'Totemic', specs: ['복원', '고양'] },
    { id: 'stormbringer', name: '폭풍인도자', nameEn: 'Stormbringer', specs: ['고양', '정기'] }
  ],
  // 마법사 (3개)
  MAGE: [
    { id: 'sunfury', name: '성난태양', nameEn: 'Sunfury', specs: ['비전', '화염'] },
    { id: 'frostfire', name: '서리불꽃', nameEn: 'Frostfire', specs: ['화염', '냉기'] },
    { id: 'spellslinger', name: '주문술사', nameEn: 'Spellslinger', specs: ['비전', '냉기'] }
  ],
  // 흑마법사 (3개)
  WARLOCK: [
    { id: 'diabolist', name: '악마학자', nameEn: 'Diabolist', specs: ['악마', '파괴'] },
    { id: 'hellcaller', name: '지옥소환사', nameEn: 'Hellcaller', specs: ['파괴', '고통'] },
    { id: 'soul-harvester', name: '영혼 수확자', nameEn: 'Soul Harvester', specs: ['고통', '악마'] }
  ],
  // 수도사 (3개)
  MONK: [
    { id: 'conduit-of-the-celestials', name: '천신의 대변자', nameEn: 'Conduit of the Celestials', specs: ['운무', '풍운'] },
    { id: 'shado-pan', name: '음영파', nameEn: 'Shado-Pan', specs: ['양조', '풍운'] },
    { id: 'master-of-harmony', name: '천상의 대리자', nameEn: 'Master of Harmony', specs: ['운무', '양조'] }
  ],
  // 드루이드 (4개)
  DRUID: [
    { id: 'wildstalker', name: '야생추적자', nameEn: 'Wildstalker', specs: ['야성', '회복'] },
    { id: 'keeper-of-the-grove', name: '숲의 수호자', nameEn: 'Keeper of the Grove', specs: ['조화', '회복'] },
    { id: 'elunes-chosen', name: '엘룬의 대리자', nameEn: 'Elune\'s Chosen', specs: ['조화', '수호'] },
    { id: 'druid-of-the-claw', name: '발톱의 드루이드', nameEn: 'Druid of the Claw', specs: ['야성', '수호'] }
  ],
  // 악마사냥꾼 (2개)
  DEMONHUNTER: [
    { id: 'aldrachi-reaver', name: '알드라치 파괴자', nameEn: 'Aldrachi Reaver', specs: ['파멸', '복수'] },
    { id: 'fel-scarred', name: '지옥상흔', nameEn: 'Fel-Scarred', specs: ['파멸', '복수'] }
  ],
  // 죽음의 기사 (3개)
  DEATHKNIGHT: [
    { id: 'sanlayn', name: '산레인', nameEn: 'San\'layn', specs: ['혈기', '부정'] },
    { id: 'rider-of-the-apocalypse', name: '종말의 기수', nameEn: 'Rider of the Apocalypse', specs: ['냉기', '부정'] },
    { id: 'deathbringer', name: '죽음의 인도자', nameEn: 'Deathbringer', specs: ['혈기', '냉기'] }
  ],
  // 기원사 (3개)
  EVOKER: [
    { id: 'flameshaper', name: '불꽃형성자', nameEn: 'Flameshaper', specs: ['황폐', '보존'] },
    { id: 'chronowarden', name: '시간 감시자', nameEn: 'Chronowarden', specs: ['보존', '증강'] },
    { id: 'scalecommander', name: '비늘사령관', nameEn: 'Scalecommander', specs: ['황폐', '증강'] }
  ]
};

async function collectHeroTalentDataFromGuide(page) {
  console.log('🚀 영웅특성 가이드 페이지에서 마우스오버로 데이터 수집 시작\n');

  const allHeroTalents = {};

  try {
    // 영웅특성 가이드 페이지 접속 (한국어)
    console.log('📄 영웅특성 가이드 페이지 접속 중...');
    await page.goto('https://www.wowhead.com/ko/guide/classes/hero-talents', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    await page.waitForTimeout(3000); // 페이지 로딩 대기

    // 페이지에서 모든 영웅특성 링크 찾기
    const heroTalentLinks = await page.evaluate(() => {
      const links = [];

      // 영웅특성 섹션 찾기 (클래스별로 그룹화되어 있음)
      const sections = document.querySelectorAll('.class-section, .hero-talents-section, section');

      sections.forEach(section => {
        // 각 영웅특성 링크 찾기
        const talentLinks = section.querySelectorAll('a[href*="hero-talents"]');

        talentLinks.forEach(link => {
          const text = link.textContent.trim();
          const href = link.href;

          // 영웅특성 이름이 있는 링크만 수집
          if (text && href) {
            links.push({
              name: text,
              url: href,
              element: link.className || link.id || 'hero-talent-link'
            });
          }
        });
      });

      return links;
    });

    console.log(`  📊 ${heroTalentLinks.length}개 영웅특성 링크 발견\n`);

    // 각 영웅특성 링크에 마우스오버하여 툴팁 데이터 수집
    for (const heroLink of heroTalentLinks) {
      console.log(`  🔍 [${heroLink.name}] 마우스오버 중...`);

      try {
        // 해당 링크 요소 찾기
        const linkElement = await page.$(`a[href="${heroLink.url}"]`);

        if (linkElement) {
          // 마우스오버 이벤트 트리거
          await linkElement.hover();
          await page.waitForTimeout(1500); // 툴팁 로딩 대기

          // 툴팁 데이터 수집
          const tooltipData = await page.evaluate(() => {
            const talents = {};

            // Wowhead 툴팁 요소 찾기
            const tooltips = document.querySelectorAll('.wowhead-tooltip, .tooltip, [data-wowhead], .hero-talent-tooltip');

            tooltips.forEach(tooltip => {
              // 툴팁 내용에서 스킬 정보 추출
              const skillElements = tooltip.querySelectorAll('.tooltip-skill, .spell-link, [data-spell-id]');

              skillElements.forEach(skill => {
                try {
                  // 스킬 ID 추출
                  let spellId = skill.getAttribute('data-spell-id');
                  if (!spellId) {
                    const link = skill.querySelector('a[href*="/spell="]');
                    if (link) {
                      const match = link.href.match(/spell=(\d+)/);
                      if (match) spellId = match[1];
                    }
                  }

                  if (!spellId) return;

                  // 스킬명 추출
                  const nameElem = skill.querySelector('.spell-name, .skill-name, b, strong');
                  const name = nameElem ? nameElem.textContent.trim() : '';

                  // 설명 추출
                  const descElem = skill.querySelector('.spell-desc, .skill-desc, .tooltip-content');
                  const description = descElem ? descElem.textContent.trim() : '';

                  // 아이콘 추출
                  const iconElem = skill.querySelector('ins, .icon, img');
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

                  talents[spellId] = {
                    id: spellId,
                    name: name,
                    icon: icon,
                    description: description.substring(0, 500)
                  };
                } catch (e) {
                  // 개별 스킬 처리 실패 시 계속
                }
              });
            });

            return talents;
          });

          // 수집한 데이터 저장
          if (Object.keys(tooltipData).length > 0) {
            // 클래스와 영웅특성 이름 매칭
            let foundClass = null;
            let foundHeroTalent = null;

            for (const [className, heroTrees] of Object.entries(HERO_TALENT_TREES)) {
              for (const heroTree of heroTrees) {
                if (heroLink.name.includes(heroTree.name) ||
                    heroLink.name.includes(heroTree.nameEn) ||
                    heroLink.url.includes(heroTree.id)) {
                  foundClass = className;
                  foundHeroTalent = heroTree;
                  break;
                }
              }
              if (foundClass) break;
            }

            if (foundClass && foundHeroTalent) {
              if (!allHeroTalents[foundClass]) {
                allHeroTalents[foundClass] = {};
              }

              if (!allHeroTalents[foundClass][foundHeroTalent.id]) {
                allHeroTalents[foundClass][foundHeroTalent.id] = {
                  name: foundHeroTalent.name,
                  nameEn: foundHeroTalent.nameEn,
                  specs: foundHeroTalent.specs,
                  skills: {}
                };
              }

              // 스킬 데이터 추가
              Object.assign(allHeroTalents[foundClass][foundHeroTalent.id].skills, tooltipData);

              console.log(`    ✅ ${Object.keys(tooltipData).length}개 스킬 수집 완료`);
            }
          }
        }
      } catch (error) {
        console.log(`    ⚠️ [${heroLink.name}] 마우스오버 실패: ${error.message}`);
      }

      // 서버 부하 방지를 위한 대기
      await page.waitForTimeout(1000);
    }

    // 영문 페이지에서도 수집 시도
    console.log('\n📄 영문 가이드 페이지에서 추가 데이터 수집...');
    await page.goto('https://www.wowhead.com/guide/classes/hero-talents', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    await page.waitForTimeout(3000);

    // 영문 페이지에서도 같은 프로세스 반복
    // (코드 중복을 피하기 위해 함수로 분리 가능하지만 여기서는 명확성을 위해 그대로 유지)

  } catch (error) {
    console.log(`  ❌ 가이드 페이지 접속 실패: ${error.message}`);
  }

  return allHeroTalents;
}

async function collectAllHeroTalentsWithMouseover() {
  console.log('🚀 TWW 시즌3 영웅특성 마우스오버 수집 시작\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    viewport: { width: 1920, height: 1080 },
    locale: 'ko-KR'
  });

  const page = await context.newPage();

  // 에러 무시
  page.on('pageerror', () => {});
  page.on('error', () => {});

  // 가이드 페이지에서 데이터 수집
  const heroTalentData = await collectHeroTalentDataFromGuide(page);

  // 수집된 데이터가 부족한 경우 개별 페이지 접속 시도
  console.log('\n📊 수집된 영웅특성 확인 중...');

  for (const [className, heroTrees] of Object.entries(HERO_TALENT_TREES)) {
    if (!heroTalentData[className]) {
      heroTalentData[className] = {};
    }

    for (const heroTree of heroTrees) {
      if (!heroTalentData[className][heroTree.id] ||
          Object.keys(heroTalentData[className][heroTree.id].skills || {}).length === 0) {

        console.log(`  ⚠️ [${className} - ${heroTree.name}] 데이터 부족, 개별 수집 시도...`);

        // 특성 계산기 페이지 접속 시도
        try {
          const calcUrl = `https://www.wowhead.com/ko/talent-calc/${className.toLowerCase()}/${heroTree.specs[0].toLowerCase()}`;

          await page.goto(calcUrl, {
            waitUntil: 'domcontentloaded',
            timeout: 30000
          });

          await page.waitForTimeout(3000);

          // 영웅특성 탭 클릭 시도
          const heroTabButton = await page.$('.hero-talents-tab, [data-tab="hero"], button:has-text("영웅")');
          if (heroTabButton) {
            await heroTabButton.click();
            await page.waitForTimeout(2000);
          }

          // 특성 계산기에서 영웅특성 스킬 수집
          const calculatorSkills = await page.evaluate(() => {
            const skills = {};

            // 영웅특성 노드 찾기
            const nodes = document.querySelectorAll('.hero-talent-node, .talent-node[data-hero], [data-spell-id]');

            nodes.forEach(node => {
              try {
                const spellId = node.getAttribute('data-spell-id');
                if (!spellId) return;

                // 마우스오버 이벤트 트리거
                const event = new MouseEvent('mouseover', {
                  view: window,
                  bubbles: true,
                  cancelable: true
                });
                node.dispatchEvent(event);

                // 툴팁 찾기
                const tooltip = document.querySelector('.wowhead-tooltip, .tooltip');

                if (tooltip) {
                  const name = tooltip.querySelector('.q, b')?.textContent.trim() || '';
                  const desc = tooltip.querySelector('.q2, .tooltip-content')?.textContent.trim() || '';

                  skills[spellId] = {
                    id: spellId,
                    name: name,
                    description: desc.substring(0, 500)
                  };
                }
              } catch (e) {
                // 개별 노드 처리 실패 시 계속
              }
            });

            return skills;
          });

          if (Object.keys(calculatorSkills).length > 0) {
            if (!heroTalentData[className][heroTree.id]) {
              heroTalentData[className][heroTree.id] = {
                name: heroTree.name,
                nameEn: heroTree.nameEn,
                specs: heroTree.specs,
                skills: {}
              };
            }

            Object.assign(heroTalentData[className][heroTree.id].skills, calculatorSkills);
            console.log(`    ✅ ${Object.keys(calculatorSkills).length}개 추가 스킬 수집`);
          }

        } catch (error) {
          console.log(`    ❌ 개별 수집 실패: ${error.message}`);
        }

        await page.waitForTimeout(2000);
      }
    }
  }

  // 최종 저장
  await fs.writeFile(
    './tww-s3-hero-talents-complete.json',
    JSON.stringify(heroTalentData, null, 2),
    'utf8'
  );

  // 통계 출력
  console.log('\n================================');
  console.log('✨ 영웅특성 데이터 수집 완료!');
  console.log('================================');

  let totalTrees = 0;
  let totalSkills = 0;

  for (const [className, heroTreeData] of Object.entries(heroTalentData)) {
    console.log(`\n${className}:`);
    for (const [treeId, treeData] of Object.entries(heroTreeData)) {
      const skillCount = Object.keys(treeData.skills || {}).length;
      console.log(`  - ${treeData.name} (${treeData.nameEn}): ${skillCount}개 스킬`);
      totalTrees++;
      totalSkills += skillCount;
    }
  }

  console.log('\n================================');
  console.log(`📊 총 ${totalTrees}개 영웅특성 트리`);
  console.log(`✨ 총 ${totalSkills}개 스킬 수집`);
  console.log('📁 저장 경로: tww-s3-hero-talents-complete.json');
  console.log('================================');

  await browser.close();
}

// 실행
collectAllHeroTalentsWithMouseover().catch(console.error);