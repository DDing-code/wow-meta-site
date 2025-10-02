const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

console.log('🎯 기존 데이터베이스 특성 정보 강화 시작...');

// 기존 데이터베이스 로드
const dbPath = path.join(__dirname, 'tww-s3-final-ultimate-database.json');
const existingDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// 클래스별 특성 계산기 URL과 전문화
const classConfigs = {
  'WARRIOR': {
    name: '전사',
    url: 'https://ko.wowhead.com/talent-calc/warrior/arms',
    specs: {
      'arms': '무기',
      'fury': '분노',
      'protection': '방어'
    }
  },
  'PALADIN': {
    name: '성기사',
    url: 'https://ko.wowhead.com/talent-calc/paladin/holy',
    specs: {
      'holy': '신성',
      'protection': '보호',
      'retribution': '징벌'
    }
  },
  'HUNTER': {
    name: '사냥꾼',
    url: 'https://ko.wowhead.com/talent-calc/hunter/beast-mastery',
    specs: {
      'beast-mastery': '야수',
      'marksmanship': '사격',
      'survival': '생존'
    }
  },
  'ROGUE': {
    name: '도적',
    url: 'https://ko.wowhead.com/talent-calc/rogue/assassination',
    specs: {
      'assassination': '암살',
      'outlaw': '무법',
      'subtlety': '잠행'
    }
  },
  'PRIEST': {
    name: '사제',
    url: 'https://ko.wowhead.com/talent-calc/priest/discipline',
    specs: {
      'discipline': '수양',
      'holy': '신성',
      'shadow': '암흑'
    }
  },
  'SHAMAN': {
    name: '주술사',
    url: 'https://ko.wowhead.com/talent-calc/shaman/elemental',
    specs: {
      'elemental': '정기',
      'enhancement': '고양',
      'restoration': '복원'
    }
  },
  'MAGE': {
    name: '마법사',
    url: 'https://ko.wowhead.com/talent-calc/mage/arcane',
    specs: {
      'arcane': '비전',
      'fire': '화염',
      'frost': '냉기'
    }
  },
  'WARLOCK': {
    name: '흑마법사',
    url: 'https://ko.wowhead.com/talent-calc/warlock/affliction',
    specs: {
      'affliction': '고통',
      'demonology': '악마',
      'destruction': '파괴'
    }
  },
  'MONK': {
    name: '수도사',
    url: 'https://ko.wowhead.com/talent-calc/monk/brewmaster',
    specs: {
      'brewmaster': '양조',
      'mistweaver': '운무',
      'windwalker': '풍운'
    }
  },
  'DRUID': {
    name: '드루이드',
    url: 'https://ko.wowhead.com/talent-calc/druid/balance',
    specs: {
      'balance': '조화',
      'feral': '야성',
      'guardian': '수호',
      'restoration': '회복'
    }
  },
  'DEMONHUNTER': {
    name: '악마사냥꾼',
    url: 'https://ko.wowhead.com/talent-calc/demon-hunter/havoc',
    specs: {
      'havoc': '파멸',
      'vengeance': '복수'
    }
  },
  'DEATHKNIGHT': {
    name: '죽음의기사',
    url: 'https://ko.wowhead.com/talent-calc/death-knight/blood',
    specs: {
      'blood': '혈기',
      'frost': '냉기',
      'unholy': '부정'
    }
  },
  'EVOKER': {
    name: '기원사',
    url: 'https://ko.wowhead.com/talent-calc/evoker/devastation',
    specs: {
      'devastation': '황폐',
      'preservation': '보존',
      'augmentation': '증강'
    }
  }
};

async function collectClassTalentData(browser, className, config) {
  const page = await browser.newPage();
  const classData = {
    baselineSkills: new Set(),
    talentSkills: new Set(),
    specSkills: {}
  };

  try {
    console.log(`\n📚 ${config.name} 특성 계산기 분석 중...`);

    // 특성 계산기 페이지 접속
    await page.goto(config.url, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    // 페이지 완전 로딩 대기
    await page.waitForTimeout(5000);

    // 특성 트리 데이터 추출
    console.log(`  🔍 클래스 트리 분석 중...`);
    const treeData = await page.evaluate(() => {
      const baselineSkills = new Set();
      const talentSkills = new Set();

      // 모든 특성 노드 찾기
      const allNodes = document.querySelectorAll('[data-node-id], [data-spell-id], [data-talent-id]');

      allNodes.forEach(node => {
        // 스킬 ID 추출
        const skillId =
          node.getAttribute('data-spell-id') ||
          node.getAttribute('data-node-id') ||
          node.getAttribute('data-talent-id');

        if (!skillId) return;

        // 노드 타입 확인
        const isBaseline =
          node.classList.contains('talent-node-baseline') ||
          node.classList.contains('talent-baseline') ||
          node.classList.contains('talent-granted') ||
          node.getAttribute('data-default') === 'true' ||
          node.getAttribute('data-baseline') === 'true';

        if (isBaseline) {
          baselineSkills.add(skillId);
        } else {
          talentSkills.add(skillId);
        }
      });

      // 클래스 트리와 전문화 트리 구분
      const classTrees = document.querySelectorAll('[data-tree-type="class"], .talent-tree-class');
      const specTrees = document.querySelectorAll('[data-tree-type="spec"], .talent-tree-spec');

      classTrees.forEach(tree => {
        const nodes = tree.querySelectorAll('[data-spell-id]');
        nodes.forEach(node => {
          const id = node.getAttribute('data-spell-id');
          if (id) {
            // 클래스 트리의 노드는 보통 특성
            talentSkills.add(id);
          }
        });
      });

      return {
        baseline: Array.from(baselineSkills),
        talents: Array.from(talentSkills)
      };
    });

    classData.baselineSkills = new Set(treeData.baseline);
    classData.talentSkills = new Set(treeData.talents);
    console.log(`    ✅ 기본 스킬: ${treeData.baseline.length}개`);
    console.log(`    ✅ 특성: ${treeData.talents.length}개`);

    // 각 전문화별 스킬 수집
    for (const [specId, specName] of Object.entries(config.specs)) {
      console.log(`  🎯 ${specName} 전문화 분석 중...`);

      // 전문화 탭 URL로 이동
      const specUrl = config.url.replace(/\/[^\/]+$/, `/${specId}`);
      try {
        await page.goto(specUrl, {
          waitUntil: 'domcontentloaded',
          timeout: 30000
        });

        await page.waitForTimeout(3000);

        // 전문화 트리에서 스킬 수집
        const specSkills = await page.evaluate(() => {
          const skills = new Set();

          // 현재 활성화된 전문화 트리
          const specTrees = document.querySelectorAll('[data-tree-type="spec"], .talent-tree-spec, .spec-tree');

          specTrees.forEach(tree => {
            const nodes = tree.querySelectorAll('[data-spell-id], [data-node-id], [data-talent-id]');
            nodes.forEach(node => {
              const skillId =
                node.getAttribute('data-spell-id') ||
                node.getAttribute('data-node-id') ||
                node.getAttribute('data-talent-id');
              if (skillId) {
                skills.add(skillId);
              }
            });
          });

          return Array.from(skills);
        });

        classData.specSkills[specName] = new Set(specSkills);
        console.log(`      ✅ ${specSkills.length}개 스킬 수집`);

      } catch (e) {
        console.log(`      ⚠️ ${specName} 전문화 데이터 수집 실패: ${e.message}`);
      }
    }

  } catch (error) {
    console.error(`❌ ${config.name} 수집 실패:`, error.message);
  } finally {
    await page.close();
  }

  return classData;
}

async function main() {
  const browser = await chromium.launch({
    headless: false,
    args: ['--window-size=1920,1080']
  });

  const collectedData = {};

  try {
    // 각 클래스별 데이터 수집
    for (const [className, config] of Object.entries(classConfigs)) {
      const classData = await collectClassTalentData(browser, className, config);
      collectedData[className] = classData;

      // 서버 부하 방지를 위한 대기
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

  } catch (error) {
    console.error('수집 중 오류:', error);
  } finally {
    await browser.close();
  }

  // 기존 데이터베이스 업데이트
  console.log('\n📊 데이터베이스 업데이트 중...');

  let updateCount = {
    baseline: 0,
    talents: 0,
    specAssigned: 0
  };

  // 수집된 데이터를 기반으로 기존 DB 업데이트
  Object.entries(existingDb).forEach(([className, classSkills]) => {
    const collected = collectedData[className];
    if (!collected) return;

    Object.entries(classSkills).forEach(([skillId, skill]) => {
      // 기본/특성 타입 업데이트
      if (collected.baselineSkills.has(skillId)) {
        if (skill.type !== '기본') {
          skill.type = '기본';
          updateCount.baseline++;
        }
      } else if (collected.talentSkills.has(skillId)) {
        if (skill.type !== '특성') {
          skill.type = '특성';
          updateCount.talents++;
        }
      }

      // 전문화 할당
      for (const [specName, specSkills] of Object.entries(collected.specSkills)) {
        if (specSkills.has(skillId)) {
          if (skill.spec !== specName) {
            skill.spec = specName;
            updateCount.specAssigned++;
          }
          break; // 첫 번째 매칭된 전문화만 할당
        }
      }
    });
  });

  console.log('\n✅ 업데이트 완료!');
  console.log(`  - 기본 스킬로 변경: ${updateCount.baseline}개`);
  console.log(`  - 특성으로 변경: ${updateCount.talents}개`);
  console.log(`  - 전문화 할당: ${updateCount.specAssigned}개`);

  // 업데이트된 데이터베이스 저장
  const outputPath = path.join(__dirname, 'tww-s3-enhanced-final-database.json');
  fs.writeFileSync(outputPath, JSON.stringify(existingDb, null, 2), 'utf8');
  console.log(`\n💾 저장 완료: ${outputPath}`);

  // React 모듈 생성
  const allSkills = [];
  Object.values(existingDb).forEach(classSkills => {
    Object.values(classSkills).forEach(skill => {
      allSkills.push(skill);
    });
  });

  const moduleContent = `// TWW Season 3 특성 계산기 기반 강화된 최종 데이터베이스
// 생성: ${new Date().toISOString()}

export const twwS3SkillDatabase = ${JSON.stringify(allSkills, null, 2)};

export const classData = {
  '전사': { name: '전사', color: '#C79C6E', specs: ['무기', '분노', '방어'] },
  '성기사': { name: '성기사', color: '#F58CBA', specs: ['신성', '보호', '징벌'] },
  '사냥꾼': { name: '사냥꾼', color: '#ABD473', specs: ['야수', '사격', '생존'] },
  '도적': { name: '도적', color: '#FFF569', specs: ['암살', '무법', '잠행'] },
  '사제': { name: '사제', color: '#FFFFFF', specs: ['수양', '신성', '암흑'] },
  '주술사': { name: '주술사', color: '#0070DE', specs: ['정기', '고양', '복원'] },
  '마법사': { name: '마법사', color: '#69CCF0', specs: ['비전', '화염', '냉기'] },
  '흑마법사': { name: '흑마법사', color: '#9482C9', specs: ['고통', '악마', '파괴'] },
  '수도사': { name: '수도사', color: '#00FF96', specs: ['양조', '운무', '풍운'] },
  '드루이드': { name: '드루이드', color: '#FF7D0A', specs: ['조화', '야성', '수호', '회복'] },
  '악마사냥꾼': { name: '악마사냥꾼', color: '#A330C9', specs: ['파멸', '복수'] },
  '죽음의기사': { name: '죽음의기사', color: '#C41E3A', specs: ['혈기', '냉기', '부정'] },
  '기원사': { name: '기원사', color: '#33937F', specs: ['황폐', '보존', '증강'] }
};

export const databaseStats = {
  totalSkills: ${allSkills.length},
  baselineSkills: ${allSkills.filter(s => s.type === '기본').length},
  talentSkills: ${allSkills.filter(s => s.type === '특성').length},
  skillsWithSpec: ${allSkills.filter(s => s.spec && s.spec !== '공용').length},
  lastUpdated: '${new Date().toISOString()}'
};

export default twwS3SkillDatabase;
`;

  const reactModulePath = path.join(__dirname, '..', 'src', 'data', 'twwS3EnhancedFinalDatabase.js');
  fs.writeFileSync(reactModulePath, moduleContent, 'utf8');
  console.log(`📦 React 모듈 저장: ${reactModulePath}`);
}

main().catch(console.error);