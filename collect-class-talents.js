// TWW Season 3 클래스별 특성 트리 수집기
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class TalentTreeCrawler {
  constructor() {
    this.browser = null;
    this.page = null;
    this.talentData = {};
    this.errors = [];

    // TWW Season 3 클래스별 특성 계산기 URL
    this.classUrls = {
      warrior: 'https://www.wowhead.com/talent-calc/warrior',
      paladin: 'https://www.wowhead.com/talent-calc/paladin',
      hunter: 'https://www.wowhead.com/talent-calc/hunter',
      rogue: 'https://www.wowhead.com/talent-calc/rogue',
      priest: 'https://www.wowhead.com/talent-calc/priest',
      deathknight: 'https://www.wowhead.com/talent-calc/death-knight',
      shaman: 'https://www.wowhead.com/talent-calc/shaman',
      mage: 'https://www.wowhead.com/talent-calc/mage',
      warlock: 'https://www.wowhead.com/talent-calc/warlock',
      monk: 'https://www.wowhead.com/talent-calc/monk',
      druid: 'https://www.wowhead.com/talent-calc/druid',
      demonhunter: 'https://www.wowhead.com/talent-calc/demon-hunter',
      evoker: 'https://www.wowhead.com/talent-calc/evoker'
    };

    // 전문화 매핑
    this.specializations = {
      warrior: ['arms', 'fury', 'protection'],
      paladin: ['holy', 'protection', 'retribution'],
      hunter: ['beast-mastery', 'marksmanship', 'survival'],
      rogue: ['assassination', 'outlaw', 'subtlety'],
      priest: ['discipline', 'holy', 'shadow'],
      deathknight: ['blood', 'frost', 'unholy'],
      shaman: ['elemental', 'enhancement', 'restoration'],
      mage: ['arcane', 'fire', 'frost'],
      warlock: ['affliction', 'demonology', 'destruction'],
      monk: ['brewmaster', 'mistweaver', 'windwalker'],
      druid: ['balance', 'feral', 'guardian', 'restoration'],
      demonhunter: ['havoc', 'vengeance'],
      evoker: ['devastation', 'preservation', 'augmentation']
    };
  }

  async initialize() {
    console.log('🌐 브라우저 초기화...');
    this.browser = await chromium.launch({
      headless: false, // 디버깅을 위해 false로 설정
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const context = await this.browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      viewport: { width: 1920, height: 1080 }
    });

    this.page = await context.newPage();
    console.log('✅ 브라우저 준비 완료\n');
  }

  async crawlClassTalents(className) {
    try {
      const url = this.classUrls[className];
      console.log(`\n🎯 ${className} 클래스 특성 수집 시작...`);
      console.log(`   URL: ${url}`);

      await this.page.goto(url, {
        waitUntil: 'networkidle',
        timeout: 60000
      });

      // 페이지 로드 대기
      await this.page.waitForTimeout(3000);

      // 특성 데이터 추출
      const talents = await this.page.evaluate(() => {
        const talentNodes = [];

        // 클래스 특성 트리 선택
        const classTalentTree = document.querySelector('.talent-tree-class');
        if (!classTalentTree) {
          console.log('클래스 특성 트리를 찾을 수 없음');
          return talentNodes;
        }

        // 모든 특성 노드 찾기
        const nodes = classTalentTree.querySelectorAll('.talent-node');

        nodes.forEach(node => {
          try {
            // 특성 정보 추출
            const spellIdMatch = node.className.match(/spell-(\d+)/);
            const spellId = spellIdMatch ? spellIdMatch[1] : null;

            if (!spellId) return;

            // 특성명 추출
            const nameEl = node.querySelector('.talent-name');
            const name = nameEl ? nameEl.textContent.trim() : '';

            // 아이콘 추출
            const iconEl = node.querySelector('.talent-icon img');
            const iconUrl = iconEl ? iconEl.src : '';
            const iconName = iconUrl ? iconUrl.split('/').pop().split('.')[0] : '';

            // 특성 유형 (active/passive)
            const isPassive = node.classList.contains('passive');
            const type = isPassive ? 'passive' : 'active';

            // 특성 위치 (row, column)
            const row = node.dataset.row || '';
            const column = node.dataset.column || '';

            // 최대 랭크
            const maxRank = node.dataset.maxRank || '1';

            talentNodes.push({
              id: spellId,
              name: name,
              icon: iconName,
              type: type,
              row: parseInt(row) || 0,
              column: parseInt(column) || 0,
              maxRanks: parseInt(maxRank) || 1,
              tree: 'class'
            });
          } catch (e) {
            console.error('노드 파싱 오류:', e);
          }
        });

        return talentNodes;
      });

      console.log(`   ✅ ${talents.length}개 클래스 특성 발견`);

      // 전문화별 특성 수집
      const specs = this.specializations[className];
      const classData = {
        className: className,
        classTalents: talents,
        specializationTalents: {}
      };

      for (const spec of specs) {
        console.log(`   🔍 ${spec} 전문화 특성 수집...`);
        const specTalents = await this.crawlSpecTalents(className, spec);
        classData.specializationTalents[spec] = specTalents;
        await this.page.waitForTimeout(2000); // 속도 제한
      }

      this.talentData[className] = classData;
      return classData;

    } catch (error) {
      console.error(`❌ ${className} 크롤링 실패:`, error.message);
      this.errors.push({
        class: className,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      return null;
    }
  }

  async crawlSpecTalents(className, specName) {
    try {
      // 전문화 탭 클릭
      const specButton = await this.page.$(`button[data-spec="${specName}"]`);
      if (specButton) {
        await specButton.click();
        await this.page.waitForTimeout(2000);
      }

      // 전문화 특성 추출
      const specTalents = await this.page.evaluate((spec) => {
        const talentNodes = [];

        // 전문화 특성 트리 선택
        const specTalentTree = document.querySelector('.talent-tree-spec');
        if (!specTalentTree) {
          console.log('전문화 특성 트리를 찾을 수 없음');
          return talentNodes;
        }

        // 모든 특성 노드 찾기
        const nodes = specTalentTree.querySelectorAll('.talent-node');

        nodes.forEach(node => {
          try {
            const spellIdMatch = node.className.match(/spell-(\d+)/);
            const spellId = spellIdMatch ? spellIdMatch[1] : null;

            if (!spellId) return;

            const nameEl = node.querySelector('.talent-name');
            const name = nameEl ? nameEl.textContent.trim() : '';

            const iconEl = node.querySelector('.talent-icon img');
            const iconUrl = iconEl ? iconEl.src : '';
            const iconName = iconUrl ? iconUrl.split('/').pop().split('.')[0] : '';

            const isPassive = node.classList.contains('passive');
            const type = isPassive ? 'passive' : 'active';

            const row = node.dataset.row || '';
            const column = node.dataset.column || '';
            const maxRank = node.dataset.maxRank || '1';

            talentNodes.push({
              id: spellId,
              name: name,
              icon: iconName,
              type: type,
              row: parseInt(row) || 0,
              column: parseInt(column) || 0,
              maxRanks: parseInt(maxRank) || 1,
              tree: 'specialization',
              specialization: spec
            });
          } catch (e) {
            console.error('노드 파싱 오류:', e);
          }
        });

        return talentNodes;
      }, specName);

      console.log(`      ✅ ${specTalents.length}개 전문화 특성 발견`);
      return specTalents;

    } catch (error) {
      console.error(`   ❌ ${specName} 전문화 크롤링 실패:`, error.message);
      return [];
    }
  }

  async crawlAllClasses() {
    const allTalents = {};

    for (const className of Object.keys(this.classUrls)) {
      const result = await this.crawlClassTalents(className);
      if (result) {
        allTalents[className] = result;
      }

      // 속도 제한 (5초 대기)
      await this.page.waitForTimeout(5000);
    }

    return allTalents;
  }

  async saveData() {
    const outputPath = path.join(__dirname, 'src/data/tww-talent-trees.json');

    const outputData = {
      metadata: {
        patch: '11.2.0',
        season: 'TWW Season 3',
        collectionDate: new Date().toISOString(),
        totalClasses: Object.keys(this.talentData).length,
        totalTalents: this.countTotalTalents(),
        errors: this.errors.length
      },
      talents: this.talentData,
      errors: this.errors
    };

    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf8');
    console.log(`\n✅ 특성 데이터 저장 완료: ${outputPath}`);
    console.log(`📊 총 ${outputData.metadata.totalTalents}개 특성 수집`);
  }

  countTotalTalents() {
    let total = 0;

    Object.values(this.talentData).forEach(classData => {
      total += classData.classTalents.length;

      Object.values(classData.specializationTalents).forEach(specTalents => {
        total += specTalents.length;
      });
    });

    return total;
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
  const crawler = new TalentTreeCrawler();

  try {
    console.log('🚀 TWW Season 3 특성 트리 크롤러 시작\n');
    console.log('📌 모든 클래스 및 전문화 특성 수집\n');

    await crawler.initialize();

    // 테스트: 성기사만 먼저 수집
    const testResult = await crawler.crawlClassTalents('paladin');

    if (testResult) {
      console.log('\n✅ 테스트 성공! 전체 수집을 시작하시겠습니까?');
      // 전체 수집은 주석 처리 (필요시 활성화)
      // await crawler.crawlAllClasses();

      crawler.talentData = { paladin: testResult }; // 테스트 데이터만 저장
      await crawler.saveData();
    }

  } catch (error) {
    console.error('❌ 크롤러 오류:', error);
  } finally {
    await crawler.close();
  }
}

// 모듈 내보내기
module.exports = { TalentTreeCrawler };

// 직접 실행 시
if (require.main === module) {
  main();
}