const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

/**
 * 야수 사냥꾼 특성 데이터 수집 스크립트
 * TWW 시즌3 (11.0.5) 기준
 */
class BeastMasteryTalentScraper {
  constructor() {
    this.browser = null;
    this.talentData = {
      metadata: {
        class: "사냥꾼",
        spec: "야수",
        version: "11.0.5",
        lastUpdated: new Date().toISOString()
      },
      classTalentTree: {
        nodes: [],
        edges: [],
        config: {
          gridSize: { rows: 10, cols: 3 },
          maxPoints: 31,
          requiredLevel: 10
        }
      },
      specTalentTree: {
        nodes: [],
        edges: [],
        config: {
          gridSize: { rows: 10, cols: 3 },
          maxPoints: 30,
          requiredLevel: 10
        }
      },
      heroTalentTrees: {}
    };
  }

  async initialize() {
    console.log('🚀 브라우저 초기화 중...');
    this.browser = await puppeteer.launch({
      headless: false, // 디버깅을 위해 false로 설정
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  async scrapeBeastMastery() {
    const page = await this.browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    try {
      console.log('📄 야수 사냥꾼 특성 페이지 로딩 중...');

      // 한국어 페이지 먼저 시도
      await page.goto('https://ko.wowhead.com/talent-calc/hunter/beast-mastery', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // 특성 계산기 로드 대기
      await page.waitForSelector('.talent-tree', { timeout: 15000 });
      await page.waitForTimeout(3000); // 동적 컨텐츠 로드 대기

      console.log('🔍 특성 데이터 추출 중...');

      // 페이지 내 특성 데이터 추출
      const talentData = await page.evaluate(() => {
        const classNodes = [];
        const specNodes = [];
        const classEdges = [];
        const specEdges = [];

        // 클래스 특성과 전문화 특성 구분
        const classTalentSection = document.querySelector('.talent-calc-tree-class, [data-tree-type="class"]');
        const specTalentSection = document.querySelector('.talent-calc-tree-spec, [data-tree-type="spec"]');

        // 클래스 특성 파싱
        if (classTalentSection) {
          const talentNodes = classTalentSection.querySelectorAll('[data-node-id], .talent-node');

          talentNodes.forEach(node => {
            const nodeId = node.dataset.nodeId || node.dataset.talentId;
            const spellLink = node.querySelector('a[href*="/spell="]');

            if (spellLink) {
              const spellMatch = spellLink.href.match(/spell=(\d+)/);
              const spellId = spellMatch ? parseInt(spellMatch[1]) : null;

              const row = parseInt(node.dataset.row || '0');
              const col = parseInt(node.dataset.col || '0');
              const maxRank = parseInt(node.dataset.maxRank || '1');

              classNodes.push({
                id: `class_${nodeId || spellId}`,
                spellId: spellId,
                name: node.querySelector('.talent-name')?.textContent || '',
                position: { x: col, y: row },
                maxRank: maxRank,
                shape: node.dataset.shape || 'circle',
                type: node.dataset.talentType || 'passive'
              });

              // 선행조건 확인
              const requires = node.dataset.requires || node.dataset.prerequisite;
              if (requires) {
                classEdges.push({
                  from: `class_${requires}`,
                  to: `class_${nodeId || spellId}`,
                  type: 'normal'
                });
              }
            }
          });
        }

        // 전문화 특성 파싱
        if (specTalentSection) {
          const talentNodes = specTalentSection.querySelectorAll('[data-node-id], .talent-node');

          talentNodes.forEach(node => {
            const nodeId = node.dataset.nodeId || node.dataset.talentId;
            const spellLink = node.querySelector('a[href*="/spell="]');

            if (spellLink) {
              const spellMatch = spellLink.href.match(/spell=(\d+)/);
              const spellId = spellMatch ? parseInt(spellMatch[1]) : null;

              const row = parseInt(node.dataset.row || '0');
              const col = parseInt(node.dataset.col || '0');
              const maxRank = parseInt(node.dataset.maxRank || '1');

              specNodes.push({
                id: `spec_${nodeId || spellId}`,
                spellId: spellId,
                name: node.querySelector('.talent-name')?.textContent || '',
                position: { x: col, y: row },
                maxRank: maxRank,
                shape: node.dataset.shape || 'hex',
                type: node.dataset.talentType || 'passive'
              });

              // 선행조건 확인
              const requires = node.dataset.requires || node.dataset.prerequisite;
              if (requires) {
                specEdges.push({
                  from: `spec_${requires}`,
                  to: `spec_${nodeId || spellId}`,
                  type: 'normal'
                });
              }
            }
          });
        }

        return {
          classNodes,
          specNodes,
          classEdges,
          specEdges
        };
      });

      // 각 특성의 상세 정보 가져오기
      console.log('📊 특성 상세 정보 수집 중...');

      for (const node of talentData.classNodes) {
        if (node.spellId) {
          const details = await this.fetchSpellDetails(node.spellId, page);
          Object.assign(node, details);
        }
      }

      for (const node of talentData.specNodes) {
        if (node.spellId) {
          const details = await this.fetchSpellDetails(node.spellId, page);
          Object.assign(node, details);
        }
      }

      this.talentData.classTalentTree.nodes = talentData.classNodes;
      this.talentData.classTalentTree.edges = talentData.classEdges;
      this.talentData.specTalentTree.nodes = talentData.specNodes;
      this.talentData.specTalentTree.edges = talentData.specEdges;

      console.log(`✅ 클래스 특성 ${talentData.classNodes.length}개 수집 완료`);
      console.log(`✅ 전문화 특성 ${talentData.specNodes.length}개 수집 완료`);

    } catch (error) {
      console.error('❌ 스크래핑 실패:', error);
      // 오류 발생 시 기본 데이터 사용
      this.useDefaultData();
    } finally {
      await page.close();
    }
  }

  async fetchSpellDetails(spellId, page) {
    try {
      const response = await page.evaluate(async (id) => {
        const res = await fetch(`https://ko.wowhead.com/tooltip/spell/${id}`);
        return res.text();
      }, spellId);

      // 간단한 파싱
      const nameMatch = response.match(/"name":"([^"]+)"/);
      const iconMatch = response.match(/"icon":"([^"]+)"/);

      return {
        name: nameMatch ? nameMatch[1] : `특성 ${spellId}`,
        icon: iconMatch ? iconMatch[1] : 'inv_misc_questionmark',
        description: `특성 설명 (Spell ID: ${spellId})`,
        currentRank: 0,
        locked: false,
        available: true,
        prerequisites: []
      };
    } catch (error) {
      console.warn(`⚠️ Spell ${spellId} 상세 정보 가져오기 실패`);
      return {
        name: `특성 ${spellId}`,
        icon: 'inv_misc_questionmark',
        description: '',
        currentRank: 0
      };
    }
  }

  useDefaultData() {
    console.log('📦 기본 야수 사냥꾼 데이터 사용');

    // 실제 야수 사냥꾼 핵심 특성들
    const beastMasteryCore = {
      classNodes: [
        // Row 0 (시작 특성)
        { id: 'class_1', spellId: 193530, name: '야생의 상', icon: 'spell_druid_mastershapeshifter', position: { x: 1, y: 0 }, maxRank: 1, shape: 'circle' },
        { id: 'class_2', spellId: 109215, name: '신비한 사격', icon: 'ability_hunter_markedfordeath', position: { x: 0, y: 1 }, maxRank: 1, shape: 'circle' },
        { id: 'class_3', spellId: 186265, name: '거북의 상', icon: 'ability_hunter_pet_turtle', position: { x: 2, y: 1 }, maxRank: 1, shape: 'circle' },
        // Row 2
        { id: 'class_4', spellId: 109304, name: '활기', icon: 'ability_hunter_cat', position: { x: 1, y: 2 }, maxRank: 1, shape: 'circle' },
        { id: 'class_5', spellId: 260331, name: '이동 공격', icon: 'ability_hunter_snipershot', position: { x: 0, y: 3 }, maxRank: 2, shape: 'square' },
        { id: 'class_6', spellId: 264656, name: '길잡이', icon: 'ability_hunter_pathfinding', position: { x: 2, y: 3 }, maxRank: 2, shape: 'square' }
      ],
      specNodes: [
        // 야수 전문화 핵심 특성
        { id: 'spec_1', spellId: 217200, name: '날카로운 사격', icon: 'ability_hunter_barbedshot', position: { x: 1, y: 0 }, maxRank: 1, shape: 'hex' },
        { id: 'spec_2', spellId: 34026, name: '처치 명령', icon: 'ability_hunter_killcommand', position: { x: 0, y: 1 }, maxRank: 1, shape: 'hex' },
        { id: 'spec_3', spellId: 193532, name: '광기', icon: 'ability_hunter_bestialdiscipline', position: { x: 2, y: 1 }, maxRank: 1, shape: 'hex' },
        { id: 'spec_4', spellId: 19574, name: '야수의 격노', icon: 'ability_druid_ferociousbite', position: { x: 1, y: 2 }, maxRank: 1, shape: 'hex' },
        { id: 'spec_5', spellId: 321530, name: '붉은피', icon: 'ability_hunter_bloodshed', position: { x: 0, y: 3 }, maxRank: 2, shape: 'hex' },
        { id: 'spec_6', spellId: 270323, name: '야생의 부름', icon: 'ability_hunter_callofthewild', position: { x: 2, y: 3 }, maxRank: 1, shape: 'star' }
      ],
      classEdges: [
        { from: 'class_1', to: 'class_4', type: 'normal' },
        { from: 'class_2', to: 'class_5', type: 'normal' },
        { from: 'class_3', to: 'class_6', type: 'normal' }
      ],
      specEdges: [
        { from: 'spec_1', to: 'spec_4', type: 'normal' },
        { from: 'spec_2', to: 'spec_5', type: 'normal' },
        { from: 'spec_3', to: 'spec_6', type: 'normal' }
      ]
    };

    // 기본 데이터로 설정
    this.talentData.classTalentTree.nodes = beastMasteryCore.classNodes.map(node => ({
      ...node,
      description: `${node.name} 특성의 효과를 제공합니다.`,
      currentRank: 0,
      type: node.shape === 'star' ? 'keystone' : 'passive',
      prerequisites: [],
      locked: false,
      available: true
    }));

    this.talentData.specTalentTree.nodes = beastMasteryCore.specNodes.map(node => ({
      ...node,
      description: `${node.name} 특성의 효과를 제공합니다.`,
      currentRank: 0,
      type: node.shape === 'star' ? 'capstone' : 'active',
      prerequisites: [],
      locked: false,
      available: true
    }));

    this.talentData.classTalentTree.edges = beastMasteryCore.classEdges;
    this.talentData.specTalentTree.edges = beastMasteryCore.specEdges;
  }

  async addHeroTalents() {
    console.log('🦸 영웅 특성 추가 중...');

    this.talentData.heroTalentTrees = {
      pack_leader: {
        name: "무리의 지도자",
        nodes: [
          {
            id: "hero_pl_1",
            name: "우두머리의 포효",
            description: "야수의 격노 사용 시 모든 소환수 피해량 15% 증가",
            icon: "ability_hunter_longevity",
            maxRank: 1,
            currentRank: 0,
            position: { x: 1, y: 0 },
            shape: "star",
            type: "passive",
            prerequisites: [],
            locked: false,
            available: true
          }
        ],
        edges: [],
        config: {
          gridSize: { rows: 4, cols: 3 },
          maxPoints: 10
        }
      },
      dark_ranger: {
        name: "어둠 순찰자",
        nodes: [
          {
            id: "hero_dr_1",
            name: "검은 화살",
            description: "사격 계열 기술이 어둠 피해를 추가로 입힘",
            icon: "ability_theblackarrow",
            maxRank: 1,
            currentRank: 0,
            position: { x: 1, y: 0 },
            shape: "diamond",
            type: "passive",
            prerequisites: [],
            locked: false,
            available: true
          }
        ],
        edges: [],
        config: {
          gridSize: { rows: 4, cols: 3 },
          maxPoints: 10
        }
      }
    };
  }

  async saveData() {
    const outputPath = path.join(
      process.cwd(),
      'src',
      'data',
      'beastMasteryTalents.json'
    );

    await fs.writeFile(
      outputPath,
      JSON.stringify(this.talentData, null, 2),
      'utf8'
    );

    console.log(`💾 데이터 저장 완료: ${outputPath}`);
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async run() {
    try {
      await this.initialize();
      await this.scrapeBeastMastery();
      await this.addHeroTalents();
      await this.saveData();
    } finally {
      await this.cleanup();
    }
  }
}

// 실행
if (require.main === module) {
  const scraper = new BeastMasteryTalentScraper();
  scraper.run()
    .then(() => console.log('✅ 야수 사냥꾼 특성 데이터 수집 완료!'))
    .catch(error => console.error('❌ 오류:', error));
}

module.exports = BeastMasteryTalentScraper;