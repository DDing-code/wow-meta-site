const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function collectAccurateTalents() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();

  console.log('🔍 Wowhead 야수 사냥꾼 특성 페이지 접속 중...');
  await page.goto('https://www.wowhead.com/talent-calc/hunter/beast-mastery', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  // 페이지 로딩 대기
  await new Promise(resolve => setTimeout(resolve, 5000));

  console.log('📊 특성 데이터 수집 중...');

  const talentData = await page.evaluate(() => {
    const result = {
      classTalents: [],
      specTalents: [],
      heroTalents: {
        packLeader: [],
        darkRanger: []
      },
      connections: [] // 노드 간 연결 정보
    };

    // 클래스 특성 수집
    const classTree = document.querySelector('.talent-tree-class');
    if (classTree) {
      const classTalents = classTree.querySelectorAll('.talent-cell');
      classTalents.forEach((cell, index) => {
        const link = cell.querySelector('a[href*="/spell="]');
        if (link) {
          const spellId = link.href.match(/spell=(\d+)/)?.[1];
          const name = link.querySelector('.talent-name')?.textContent ||
                       link.getAttribute('data-wh-rename-link') || '';
          const icon = cell.querySelector('img')?.src || '';
          const maxRank = cell.querySelector('.talent-ranks')?.textContent || '1';

          // 위치 정보 추출
          const cellNum = cell.getAttribute('data-cell') || index;
          const row = Math.floor(cellNum / 7) + 1;
          const col = (cellNum % 7) || 7;

          // 연결 정보 추출
          const connections = [];
          const lines = cell.querySelectorAll('.talent-connection');
          lines.forEach(line => {
            const targetCell = line.getAttribute('data-target-cell');
            if (targetCell) {
              connections.push(parseInt(targetCell));
            }
          });

          result.classTalents.push({
            id: parseInt(spellId),
            name: name,
            icon: icon,
            position: { row, col },
            cellNumber: parseInt(cellNum),
            maxRank: parseInt(maxRank) || 1,
            connections: connections
          });
        }
      });
    }

    // 전문화 특성 수집
    const specTree = document.querySelector('.talent-tree-spec');
    if (specTree) {
      const specTalents = specTree.querySelectorAll('.talent-cell');
      specTalents.forEach((cell, index) => {
        const link = cell.querySelector('a[href*="/spell="]');
        if (link) {
          const spellId = link.href.match(/spell=(\d+)/)?.[1];
          const name = link.querySelector('.talent-name')?.textContent ||
                       link.getAttribute('data-wh-rename-link') || '';
          const icon = cell.querySelector('img')?.src || '';
          const maxRank = cell.querySelector('.talent-ranks')?.textContent || '1';

          // 위치 정보 추출
          const cellNum = cell.getAttribute('data-cell') || index;
          const row = Math.floor(cellNum / 7) + 1;
          const col = (cellNum % 7) || 7;

          // 연결 정보 추출
          const connections = [];
          const lines = cell.querySelectorAll('.talent-connection');
          lines.forEach(line => {
            const targetCell = line.getAttribute('data-target-cell');
            if (targetCell) {
              connections.push(parseInt(targetCell));
            }
          });

          result.specTalents.push({
            id: parseInt(spellId),
            name: name,
            icon: icon,
            position: { row, col },
            cellNumber: parseInt(cellNum),
            maxRank: parseInt(maxRank) || 1,
            connections: connections
          });
        }
      });
    }

    // 영웅 특성 수집
    const heroTrees = document.querySelectorAll('.hero-talent-tree');
    heroTrees.forEach(tree => {
      const treeTitle = tree.querySelector('.hero-tree-title')?.textContent || '';
      const isPackLeader = treeTitle.includes('Pack Leader') || treeTitle.includes('무리');
      const isDarkRanger = treeTitle.includes('Dark Ranger') || treeTitle.includes('어둠');

      const talents = tree.querySelectorAll('.hero-talent-node');
      talents.forEach((node, index) => {
        const link = node.querySelector('a[href*="/spell="]');
        if (link) {
          const spellId = link.href.match(/spell=(\d+)/)?.[1];
          const name = link.querySelector('.talent-name')?.textContent ||
                       link.getAttribute('data-wh-rename-link') || '';
          const icon = node.querySelector('img')?.src || '';

          // 영웅 특성 위치 (3열 구조)
          const row = Math.floor(index / 3) + 1;
          const col = (index % 3) + 1;

          const talentInfo = {
            id: parseInt(spellId),
            name: name,
            icon: icon,
            position: { row, col },
            nodeIndex: index
          };

          if (isPackLeader) {
            result.heroTalents.packLeader.push(talentInfo);
          } else if (isDarkRanger) {
            result.heroTalents.darkRanger.push(talentInfo);
          }
        }
      });
    });

    // 전체 연결 정보 수집
    document.querySelectorAll('.talent-connection-line').forEach(line => {
      const from = line.getAttribute('data-from-cell');
      const to = line.getAttribute('data-to-cell');
      if (from && to) {
        result.connections.push({
          from: parseInt(from),
          to: parseInt(to),
          type: line.classList.contains('active') ? 'active' : 'inactive'
        });
      }
    });

    return result;
  });

  // 통계 출력
  console.log('\n📈 수집된 특성 통계:');
  console.log(`- 클래스 특성: ${talentData.classTalents.length}개`);
  console.log(`- 전문화 특성: ${talentData.specTalents.length}개`);
  console.log(`- 무리의 지도자: ${talentData.heroTalents.packLeader.length}개`);
  console.log(`- 어둠 순찰자: ${talentData.heroTalents.darkRanger.length}개`);
  console.log(`- 총 특성: ${
    talentData.classTalents.length +
    talentData.specTalents.length +
    talentData.heroTalents.packLeader.length +
    talentData.heroTalents.darkRanger.length
  }개`);
  console.log(`- 연결 정보: ${talentData.connections.length}개`);

  // 아이콘 URL에서 파일명 추출
  function extractIconName(url) {
    if (!url) return '';
    const match = url.match(/\/([^\/]+)\.(jpg|png)$/);
    return match ? match[1] : '';
  }

  // 한국어 번역 데이터 로드
  const koreanDB = JSON.parse(fs.readFileSync(
    path.join(__dirname, 'tww-s3-refined-database.json'),
    'utf-8'
  ));

  // 특성 데이터 통합 및 보강
  const enrichedData = {
    classTalents: {},
    specTalents: {},
    packLeaderTalents: {},
    darkRangerTalents: {}
  };

  // 클래스 특성 보강
  talentData.classTalents.forEach(talent => {
    const koreanInfo = findKoreanInfo(koreanDB, talent.id);
    enrichedData.classTalents[talent.id] = {
      id: talent.id,
      koreanName: koreanInfo?.koreanName || talent.name,
      englishName: talent.name,
      icon: extractIconName(talent.icon),
      description: koreanInfo?.description || '',
      cooldown: koreanInfo?.cooldown || '없음',
      castTime: koreanInfo?.castTime || '즉시 시전',
      range: koreanInfo?.range || '0',
      resourceCost: koreanInfo?.resourceCost || '없음',
      resourceGain: koreanInfo?.resourceGain || '없음',
      type: '특성',
      spec: '공용',
      level: 10,
      pvp: false,
      maxRank: talent.maxRank,
      position: talent.position,
      connections: talent.connections
    };
  });

  // 전문화 특성 보강
  talentData.specTalents.forEach(talent => {
    const koreanInfo = findKoreanInfo(koreanDB, talent.id);
    enrichedData.specTalents[talent.id] = {
      id: talent.id,
      koreanName: koreanInfo?.koreanName || talent.name,
      englishName: talent.name,
      icon: extractIconName(talent.icon),
      description: koreanInfo?.description || '',
      cooldown: koreanInfo?.cooldown || '없음',
      castTime: koreanInfo?.castTime || '즉시 시전',
      range: koreanInfo?.range || '0',
      resourceCost: koreanInfo?.resourceCost || '없음',
      resourceGain: koreanInfo?.resourceGain || '없음',
      type: '특성',
      spec: '야수',
      level: 10,
      pvp: false,
      maxRank: talent.maxRank,
      position: talent.position,
      connections: talent.connections
    };
  });

  // 영웅 특성 보강
  talentData.heroTalents.packLeader.forEach(talent => {
    const koreanInfo = findKoreanInfo(koreanDB, talent.id);
    enrichedData.packLeaderTalents[talent.id] = {
      id: talent.id,
      koreanName: koreanInfo?.koreanName || talent.name,
      englishName: talent.name,
      icon: extractIconName(talent.icon),
      description: koreanInfo?.description || '',
      cooldown: koreanInfo?.cooldown || '없음',
      castTime: koreanInfo?.castTime || '즉시 시전',
      range: koreanInfo?.range || '0',
      resourceCost: koreanInfo?.resourceCost || '없음',
      resourceGain: koreanInfo?.resourceGain || '없음',
      type: '영웅특성',
      spec: '무리의 지도자',
      level: 70,
      pvp: false,
      maxRank: 1,
      position: talent.position,
      connections: []
    };
  });

  talentData.heroTalents.darkRanger.forEach(talent => {
    const koreanInfo = findKoreanInfo(koreanDB, talent.id);
    enrichedData.darkRangerTalents[talent.id] = {
      id: talent.id,
      koreanName: koreanInfo?.koreanName || talent.name,
      englishName: talent.name,
      icon: extractIconName(talent.icon),
      description: koreanInfo?.description || '',
      cooldown: koreanInfo?.cooldown || '없음',
      castTime: koreanInfo?.castTime || '즉시 시전',
      range: koreanInfo?.range || '0',
      resourceCost: koreanInfo?.resourceCost || '없음',
      resourceGain: koreanInfo?.resourceGain || '없음',
      type: '영웅특성',
      spec: '어둠 순찰자',
      level: 70,
      pvp: false,
      maxRank: 1,
      position: talent.position,
      connections: []
    };
  });

  // 연결 정보 추가
  enrichedData.connections = talentData.connections;

  // 파일 저장
  const outputPath = path.join(__dirname, '..', 'src', 'data', 'beastMasteryAccurateTalentTree.js');
  const fileContent = `// WoW 11.0.5 야수 사냥꾼 정확한 특성 트리
// Wowhead 실시간 데이터 기반

export const beastMasteryAccurateTalentTree = ${JSON.stringify(enrichedData, null, 2)};
`;

  fs.writeFileSync(outputPath, fileContent, 'utf-8');
  console.log(`\n✅ 특성 데이터 저장 완료: ${outputPath}`);

  await browser.close();
}

// 한국어 정보 찾기 헬퍼 함수
function findKoreanInfo(db, spellId) {
  // 모든 클래스를 순회하며 스킬 ID로 검색
  for (const className in db) {
    for (const skillId in db[className]) {
      if (parseInt(skillId) === spellId) {
        return db[className][skillId];
      }
    }
  }
  return null;
}

collectAccurateTalents().catch(console.error);