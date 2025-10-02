// TWW Season 3 (11.2 패치) 모든 클래스 특성 수집기
// PvP 특성 제외, 현재 활성 특성만 포함

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class TWWTalentCollector {
  constructor() {
    this.browser = null;
    this.page = null;
    this.collectedTalents = {};

    // TWW Season 3 클래스별 특성 트리 URL
    this.classUrls = {
      deathknight: 'https://www.wowhead.com/talent-calc/death-knight',
      demonhunter: 'https://www.wowhead.com/talent-calc/demon-hunter',
      druid: 'https://www.wowhead.com/talent-calc/druid',
      evoker: 'https://www.wowhead.com/talent-calc/evoker',
      hunter: 'https://www.wowhead.com/talent-calc/hunter',
      mage: 'https://www.wowhead.com/talent-calc/mage',
      monk: 'https://www.wowhead.com/talent-calc/monk',
      paladin: 'https://www.wowhead.com/talent-calc/paladin',
      priest: 'https://www.wowhead.com/talent-calc/priest',
      rogue: 'https://www.wowhead.com/talent-calc/rogue',
      shaman: 'https://www.wowhead.com/talent-calc/shaman',
      warlock: 'https://www.wowhead.com/talent-calc/warlock',
      warrior: 'https://www.wowhead.com/talent-calc/warrior'
    };

    // 영웅 특성 (TWW Season 3)
    this.heroTalents = {
      deathknight: ['deathbringer', 'san-layn', 'rider-of-the-apocalypse'],
      demonhunter: ['aldrachi-reaver', 'fel-scarred'],
      druid: ['keeper-of-the-grove', 'elunes-chosen', 'wildstalker'],
      evoker: ['flameshaper', 'scalecommander', 'chronowarden'],
      hunter: ['pack-leader', 'dark-ranger', 'sentinel'],
      mage: ['sunfury', 'frostfire', 'spellslinger'],
      monk: ['master-of-harmony', 'shado-pan', 'conduit-of-the-celestials'],
      paladin: ['herald-of-the-sun', 'lightsmith', 'templar'],
      priest: ['voidweaver', 'oracle', 'archon'],
      rogue: ['deathstalker', 'fatebound', 'trickster'],
      shaman: ['totemic', 'stormbringer', 'farseer'],
      warlock: ['diabolist', 'soul-harvester', 'hellcaller'],
      warrior: ['mountain-thane', 'colossus', 'slayer']
    };

    // 전문화 매핑
    this.specializations = {
      deathknight: ['blood', 'frost', 'unholy'],
      demonhunter: ['havoc', 'vengeance'],
      druid: ['balance', 'feral', 'guardian', 'restoration'],
      evoker: ['devastation', 'preservation', 'augmentation'],
      hunter: ['beast-mastery', 'marksmanship', 'survival'],
      mage: ['arcane', 'fire', 'frost'],
      monk: ['brewmaster', 'mistweaver', 'windwalker'],
      paladin: ['holy', 'protection', 'retribution'],
      priest: ['discipline', 'holy', 'shadow'],
      rogue: ['assassination', 'outlaw', 'subtlety'],
      shaman: ['elemental', 'enhancement', 'restoration'],
      warlock: ['affliction', 'demonology', 'destruction'],
      warrior: ['arms', 'fury', 'protection']
    };
  }

  async initialize() {
    console.log('🌐 브라우저 초기화...');
    this.browser = await chromium.launch({
      headless: false, // 디버깅용
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const context = await this.browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      viewport: { width: 1920, height: 1080 }
    });

    this.page = await context.newPage();
    console.log('✅ 브라우저 준비 완료\n');
  }

  async collectClassTalents(className) {
    try {
      const url = this.classUrls[className];
      console.log(`\n🎯 ${className} 클래스 특성 수집...`);
      console.log(`   URL: ${url}`);

      await this.page.goto(url, {
        waitUntil: 'networkidle',
        timeout: 60000
      });

      await this.page.waitForTimeout(3000);

      // 클래스 특성 수집
      const classTalents = await this.page.evaluate(() => {
        const talents = [];
        const classTalentTree = document.querySelector('.talent-tree-class, [data-tree-type="class"]');

        if (!classTalentTree) return talents;

        // 모든 특성 노드 찾기
        const nodes = classTalentTree.querySelectorAll('.talent-node, [data-node-id]');

        nodes.forEach(node => {
          try {
            // 스킬 ID 추출
            const spellIdMatch = node.className ? node.className.match(/spell-(\d+)/) : null;
            const dataSpellId = node.dataset?.spellId;
            const spellId = spellIdMatch ? spellIdMatch[1] : dataSpellId;

            if (!spellId) return;

            // 스킬명 추출
            const nameEl = node.querySelector('.talent-name, [data-talent-name], .tooltip-content h2');
            const name = nameEl ? nameEl.textContent.trim() : '';

            // 아이콘 추출
            const iconEl = node.querySelector('img, .icon');
            const iconSrc = iconEl?.src || '';
            const iconName = iconSrc ? iconSrc.split('/').pop().split('.')[0] : '';

            if (name && spellId) {
              talents.push({
                id: spellId,
                name: name,
                icon: iconName,
                type: 'talent',
                category: 'class'
              });
            }
          } catch (e) {
            console.error('노드 파싱 오류:', e);
          }
        });

        return talents;
      });

      console.log(`   ✅ ${classTalents.length}개 클래스 특성 발견`);

      // 전문화별 특성 수집
      const specTalents = {};
      for (const spec of this.specializations[className]) {
        console.log(`   🔍 ${spec} 전문화 특성 수집...`);

        // 전문화 탭 클릭
        const specClicked = await this.page.evaluate((specName) => {
          const specButton = document.querySelector(`[data-spec="${specName}"], [data-specialization="${specName}"]`);
          if (specButton) {
            specButton.click();
            return true;
          }
          return false;
        }, spec);

        if (specClicked) {
          await this.page.waitForTimeout(2000);
        }

        // 전문화 특성 수집
        const talents = await this.page.evaluate(() => {
          const talents = [];
          const specTalentTree = document.querySelector('.talent-tree-spec, [data-tree-type="spec"]');

          if (!specTalentTree) return talents;

          const nodes = specTalentTree.querySelectorAll('.talent-node, [data-node-id]');

          nodes.forEach(node => {
            try {
              const spellIdMatch = node.className ? node.className.match(/spell-(\d+)/) : null;
              const dataSpellId = node.dataset?.spellId;
              const spellId = spellIdMatch ? spellIdMatch[1] : dataSpellId;

              if (!spellId) return;

              const nameEl = node.querySelector('.talent-name, [data-talent-name], .tooltip-content h2');
              const name = nameEl ? nameEl.textContent.trim() : '';

              const iconEl = node.querySelector('img, .icon');
              const iconSrc = iconEl?.src || '';
              const iconName = iconSrc ? iconSrc.split('/').pop().split('.')[0] : '';

              if (name && spellId) {
                talents.push({
                  id: spellId,
                  name: name,
                  icon: iconName,
                  type: 'talent',
                  category: 'specialization'
                });
              }
            } catch (e) {
              console.error('노드 파싱 오류:', e);
            }
          });

          return talents;
        });

        console.log(`      ✅ ${talents.length}개 전문화 특성 발견`);
        specTalents[spec] = talents;
      }

      // 영웅 특성 수집
      const heroTalentData = {};
      for (const heroTree of this.heroTalents[className]) {
        console.log(`   🦸 ${heroTree} 영웅 특성 수집...`);

        // 영웅 특성 URL로 이동
        const heroUrl = `${url}/${heroTree}`;
        await this.page.goto(heroUrl, {
          waitUntil: 'networkidle',
          timeout: 60000
        });

        await this.page.waitForTimeout(2000);

        const heroTalents = await this.page.evaluate(() => {
          const talents = [];
          const heroTalentTree = document.querySelector('.hero-talent-tree, [data-tree-type="hero"]');

          if (!heroTalentTree) return talents;

          const nodes = heroTalentTree.querySelectorAll('.talent-node, [data-node-id]');

          nodes.forEach(node => {
            try {
              const spellIdMatch = node.className ? node.className.match(/spell-(\d+)/) : null;
              const dataSpellId = node.dataset?.spellId;
              const spellId = spellIdMatch ? spellIdMatch[1] : dataSpellId;

              if (!spellId) return;

              const nameEl = node.querySelector('.talent-name, [data-talent-name], .tooltip-content h2');
              const name = nameEl ? nameEl.textContent.trim() : '';

              const iconEl = node.querySelector('img, .icon');
              const iconSrc = iconEl?.src || '';
              const iconName = iconSrc ? iconSrc.split('/').pop().split('.')[0] : '';

              if (name && spellId) {
                talents.push({
                  id: spellId,
                  name: name,
                  icon: iconName,
                  type: 'heroTalent',
                  category: 'hero'
                });
              }
            } catch (e) {
              console.error('노드 파싱 오류:', e);
            }
          });

          return talents;
        });

        console.log(`      ✅ ${heroTalents.length}개 영웅 특성 발견`);
        heroTalentData[heroTree] = heroTalents;
      }

      // 수집된 데이터 저장
      this.collectedTalents[className] = {
        classTalents: classTalents,
        specializationTalents: specTalents,
        heroTalents: heroTalentData
      };

      return this.collectedTalents[className];

    } catch (error) {
      console.error(`❌ ${className} 수집 실패:`, error.message);
      return null;
    }
  }

  async collectAllClasses() {
    const results = {};

    for (const className of Object.keys(this.classUrls)) {
      const classData = await this.collectClassTalents(className);
      if (classData) {
        results[className] = classData;
      }

      // 속도 제한
      await this.page.waitForTimeout(5000);
    }

    return results;
  }

  async saveToDatabase() {
    const dbPath = path.join(__dirname, 'src/data/tww-s3-talents.json');

    // 통계 계산
    let totalTalents = 0;
    Object.values(this.collectedTalents).forEach(classData => {
      totalTalents += classData.classTalents.length;
      Object.values(classData.specializationTalents).forEach(specTalents => {
        totalTalents += specTalents.length;
      });
      Object.values(classData.heroTalents).forEach(heroTalents => {
        totalTalents += heroTalents.length;
      });
    });

    const output = {
      metadata: {
        patch: '11.2.0',
        season: 'TWW Season 3',
        collectionDate: new Date().toISOString(),
        totalClasses: Object.keys(this.collectedTalents).length,
        totalTalents: totalTalents,
        excludes: ['PvP talents', 'Removed abilities']
      },
      talents: this.collectedTalents
    };

    fs.writeFileSync(dbPath, JSON.stringify(output, null, 2), 'utf8');
    console.log(`\n✅ 데이터베이스 저장 완료: ${dbPath}`);
    console.log(`📊 총 ${totalTalents}개 특성 수집 (PvP 제외)`);
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log('\n🔚 브라우저 종료');
    }
  }
}

// 실행
async function main() {
  const collector = new TWWTalentCollector();

  try {
    console.log('🚀 TWW Season 3 특성 수집기 시작\n');
    console.log('📌 PvP 특성 제외, 현재 활성 특성만 수집\n');

    await collector.initialize();

    // 죽음의 기사부터 시작
    console.log('========= 죽음의 기사 수집 시작 =========');
    const dkData = await collector.collectClassTalents('deathknight');

    if (dkData) {
      console.log('\n✅ 죽음의 기사 수집 완료!');
      collector.collectedTalents.deathknight = dkData;
      await collector.saveToDatabase();
    }

    // 나머지 클래스도 수집할지 확인
    console.log('\n📝 죽음의 기사 수집 완료. 나머지 클래스도 계속 수집합니다...\n');

    // 나머지 클래스 수집
    for (const className of Object.keys(collector.classUrls)) {
      if (className === 'deathknight') continue; // 이미 수집함

      console.log(`\n========= ${className} 수집 시작 =========`);
      const classData = await collector.collectClassTalents(className);

      if (classData) {
        console.log(`✅ ${className} 수집 완료!`);
        await collector.saveToDatabase();
      }

      // 속도 제한
      await collector.page.waitForTimeout(5000);
    }

    console.log('\n🎉 모든 클래스 특성 수집 완료!');

  } catch (error) {
    console.error('❌ 수집기 오류:', error);
  } finally {
    await collector.close();
  }
}

// 모듈 내보내기
module.exports = { TWWTalentCollector };

// 직접 실행 시
if (require.main === module) {
  main();
}