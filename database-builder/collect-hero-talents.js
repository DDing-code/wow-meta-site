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

async function collectHeroTalentData(page, heroTreeUrl, heroTreeInfo, className) {
  console.log(`  🔍 [${heroTreeInfo.name}] 영웅특성 수집 중...`);

  const talents = {};

  try {
    // 영웅특성 페이지 접속
    await page.goto(heroTreeUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    await page.waitForTimeout(3000); // 페이지 로딩 대기

    // 영웅특성 스킬 수집
    const heroTalentData = await page.evaluate(() => {
      const talents = {};

      // 특성 트리에서 스킬 정보 추출
      const talentElements = document.querySelectorAll('[data-spell-id], .talent-node, .hero-talent-node');

      for (const elem of talentElements) {
        try {
          // 스킬 ID 추출
          let spellId = elem.getAttribute('data-spell-id');
          if (!spellId) {
            const link = elem.querySelector('a[href*="/spell="]');
            if (link) {
              const match = link.href.match(/spell=(\d+)/);
              if (match) spellId = match[1];
            }
          }

          if (!spellId) continue;

          // 스킬명 추출
          const nameElem = elem.querySelector('.talent-name, .spell-name, b');
          const name = nameElem ? nameElem.textContent.trim() : '';

          // 아이콘 추출
          const iconElem = elem.querySelector('ins, .icon');
          let icon = 'inv_misc_questionmark';
          if (iconElem) {
            const style = iconElem.getAttribute('style');
            if (style) {
              const iconMatch = style.match(/\/([^\/]+)\.(jpg|png)/);
              if (iconMatch) {
                icon = iconMatch[1];
              }
            }
          }

          // 설명 추출
          const descElem = elem.querySelector('.talent-desc, .spell-desc, .tooltip-content');
          const description = descElem ? descElem.textContent.trim() : '';

          // Tier 정보 추출 (있으면)
          const tierMatch = elem.className.match(/tier-(\d+)/);
          const tier = tierMatch ? parseInt(tierMatch[1]) : null;

          talents[spellId] = {
            id: spellId,
            name: name,
            icon: icon,
            description: description.substring(0, 500),
            tier: tier
          };
        } catch (e) {
          // 개별 특성 처리 실패 시 계속
          continue;
        }
      }

      return talents;
    });

    // 한국어 페이지에서 번역 수집
    const koUrl = heroTreeUrl.replace('www.wowhead.com', 'ko.wowhead.com');
    await page.goto(koUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    await page.waitForTimeout(2000);

    // 한국어 번역 수집
    const koTalentData = await page.evaluate(() => {
      const talents = {};

      const talentElements = document.querySelectorAll('[data-spell-id], .talent-node, .hero-talent-node');

      for (const elem of talentElements) {
        try {
          let spellId = elem.getAttribute('data-spell-id');
          if (!spellId) {
            const link = elem.querySelector('a[href*="/spell="]');
            if (link) {
              const match = link.href.match(/spell=(\d+)/);
              if (match) spellId = match[1];
            }
          }

          if (!spellId) continue;

          const nameElem = elem.querySelector('.talent-name, .spell-name, b');
          const name = nameElem ? nameElem.textContent.trim() : '';

          const descElem = elem.querySelector('.talent-desc, .spell-desc, .tooltip-content');
          const description = descElem ? descElem.textContent.trim() : '';

          talents[spellId] = {
            koreanName: name,
            koreanDescription: description.substring(0, 500)
          };
        } catch (e) {
          continue;
        }
      }

      return talents;
    });

    // 데이터 병합
    for (const [spellId, talentData] of Object.entries(heroTalentData)) {
      const koData = koTalentData[spellId] || {};

      talents[spellId] = {
        id: spellId,
        englishName: talentData.name,
        koreanName: koData.koreanName || talentData.name,
        icon: talentData.icon,
        description: koData.koreanDescription || talentData.description,
        type: '영웅특성',
        heroTalent: heroTreeInfo.name,
        className: className,
        specs: heroTreeInfo.specs,
        tier: talentData.tier
      };
    }

    console.log(`    ✅ [${heroTreeInfo.name}] 완료 - ${Object.keys(talents).length}개 특성 수집`);
    return talents;

  } catch (error) {
    console.log(`    ❌ [${heroTreeInfo.name}] 수집 실패:`, error.message);
    return {};
  }
}

async function collectAllHeroTalents() {
  console.log('🚀 TWW 시즌3 영웅특성 데이터 수집 시작\n');
  console.log('📊 총 39개 영웅특성 트리 처리 예정\n');

  const browser = await chromium.launch({
    headless: true,
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
  let totalTrees = 0;
  let totalTalents = 0;

  // 각 클래스별로 처리
  for (const [className, heroTrees] of Object.entries(HERO_TALENT_TREES)) {
    console.log(`\n=== ${className} 클래스 영웅특성 처리 (${heroTrees.length}개 트리) ===`);

    allHeroTalents[className] = {};

    for (const heroTree of heroTrees) {
      // Wowhead 영웅특성 페이지 URL 생성
      const heroTreeUrl = `https://www.wowhead.com/guide/classes/${className.toLowerCase()}/hero-talents/${heroTree.id}`;

      const talents = await collectHeroTalentData(page, heroTreeUrl, heroTree, className);

      // 결과 저장
      for (const [spellId, talentData] of Object.entries(talents)) {
        allHeroTalents[className][spellId] = talentData;
        totalTalents++;
      }

      totalTrees++;

      // 서버 부하 방지를 위한 대기
      await page.waitForTimeout(2000);
    }

    console.log(`  💾 ${className} 영웅특성 수집 완료 (${Object.keys(allHeroTalents[className]).length}개)`);
  }

  // 최종 저장
  await fs.writeFile(
    './tww-s3-hero-talents-complete.json',
    JSON.stringify(allHeroTalents, null, 2),
    'utf8'
  );

  console.log('\n================================');
  console.log('✨ 영웅특성 데이터 수집 완료!');
  console.log('================================');
  console.log(`📊 처리된 트리: ${totalTrees}개`);
  console.log(`✨ 수집된 특성: ${totalTalents}개`);
  console.log('📁 저장 경로: tww-s3-hero-talents-complete.json');
  console.log('================================');

  await browser.close();
}

// 실행
collectAllHeroTalents().catch(console.error);