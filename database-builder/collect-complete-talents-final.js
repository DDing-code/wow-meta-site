const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function collectCompleteTalents() {
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

  // 페이지 완전 로딩 대기
  await new Promise(resolve => setTimeout(resolve, 8000));

  console.log('📊 특성 데이터 수집 중...');

  const talentData = await page.evaluate(() => {
    const result = {
      classTalents: [],
      specTalents: [],
      heroTalents: {
        packLeader: [],
        darkRanger: []
      },
      connections: []
    };

    // 모든 특성 노드 수집
    const allTalents = document.querySelectorAll('a.dragonflight-talent-tree-talent');

    allTalents.forEach(talent => {
      const spellMatch = talent.href.match(/spell=(\d+)/);
      if (!spellMatch) return;

      const spellId = parseInt(spellMatch[1]);
      const name = talent.textContent || talent.getAttribute('data-wh-rename-link') || '';
      const row = parseInt(talent.getAttribute('data-row')) || 1;
      const column = parseInt(talent.getAttribute('data-column')) || 1;
      const cell = parseInt(talent.getAttribute('data-cell')) || 0;
      const talentType = parseInt(talent.getAttribute('data-talent-type')) || 0;

      // 부모 컨테이너로 트리 타입 구분
      const isClassTree = talent.closest('.dragonflight-talent-tree-class');
      const isSpecTree = talent.closest('.dragonflight-talent-tree-spec');
      const isHeroTree = talent.closest('.dragonflight-talent-tree-hero');

      const talentInfo = {
        id: spellId,
        name: name,
        position: { row, col: column },
        cell: cell,
        talentType: talentType
      };

      // 트리 타입별로 분류
      if (isClassTree) {
        result.classTalents.push(talentInfo);
      } else if (isSpecTree) {
        result.specTalents.push(talentInfo);
      } else if (isHeroTree) {
        // 영웅 특성은 이름으로 구분
        if (name.includes('Pack') || name.includes('Vicious') || name.includes('Frenzied') ||
            name.includes('Furious') || name.includes('Den Recovery')) {
          result.heroTalents.packLeader.push(talentInfo);
        } else if (name.includes('Shadow') || name.includes('Dark') || name.includes('Black') ||
                   name.includes('Smoke Screen') || name.includes('Withering Fire')) {
          result.heroTalents.darkRanger.push(talentInfo);
        }
      } else {
        // 트리 타입을 못 찾은 경우, 위치로 추정
        if (cell < 70) {
          result.classTalents.push(talentInfo);
        } else if (cell < 140) {
          result.specTalents.push(talentInfo);
        } else {
          // 영웅 특성
          result.heroTalents.packLeader.push(talentInfo);
        }
      }
    });

    // 연결선 정보 수집 (있다면)
    const connections = document.querySelectorAll('.dragonflight-talent-tree-connection');
    connections.forEach(conn => {
      const from = conn.getAttribute('data-from');
      const to = conn.getAttribute('data-to');
      if (from && to) {
        result.connections.push({
          from: parseInt(from),
          to: parseInt(to)
        });
      }
    });

    return result;
  });

  console.log('\n📈 수집된 특성 통계:');
  console.log(`- 클래스 특성: ${talentData.classTalents.length}개`);
  console.log(`- 전문화 특성: ${talentData.specTalents.length}개`);
  console.log(`- 무리의 지도자: ${talentData.heroTalents.packLeader.length}개`);
  console.log(`- 어둠 순찰자: ${talentData.heroTalents.darkRanger.length}개`);
  const total = talentData.classTalents.length +
                talentData.specTalents.length +
                talentData.heroTalents.packLeader.length +
                talentData.heroTalents.darkRanger.length;
  console.log(`- 총 특성: ${total}개`);
  console.log(`- 연결 정보: ${talentData.connections.length}개`);

  // 기존 한국어 DB 로드
  let koreanDB = {};
  try {
    koreanDB = JSON.parse(fs.readFileSync(
      path.join(__dirname, 'tww-s3-refined-database.json'),
      'utf-8'
    ));
  } catch (e) {
    console.log('⚠️ 한국어 DB 로드 실패, 영어명 사용');
  }

  // 특성별 상세 정보 수집 (아이콘, 설명 등)
  console.log('\n🔍 특성 상세 정보 수집 중...');

  const detailedTalents = {
    classTalents: {},
    specTalents: {},
    packLeaderTalents: {},
    darkRangerTalents: {}
  };

  // 클래스 특성 처리
  for (const talent of talentData.classTalents) {
    const koreanInfo = findKoreanInfo(koreanDB, talent.id);
    detailedTalents.classTalents[talent.id] = {
      id: talent.id,
      koreanName: koreanInfo?.koreanName || talent.name,
      englishName: talent.name,
      icon: getIconName(talent.id, talent.name),
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
      maxRank: 1,
      position: talent.position,
      connections: []
    };
  }

  // 전문화 특성 처리
  for (const talent of talentData.specTalents) {
    const koreanInfo = findKoreanInfo(koreanDB, talent.id);
    detailedTalents.specTalents[talent.id] = {
      id: talent.id,
      koreanName: koreanInfo?.koreanName || talent.name,
      englishName: talent.name,
      icon: getIconName(talent.id, talent.name),
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
      maxRank: 1,
      position: talent.position,
      connections: []
    };
  }

  // 영웅 특성 처리 - 무리의 지도자
  for (const talent of talentData.heroTalents.packLeader) {
    const koreanInfo = findKoreanInfo(koreanDB, talent.id);
    detailedTalents.packLeaderTalents[talent.id] = {
      id: talent.id,
      koreanName: koreanInfo?.koreanName || talent.name,
      englishName: talent.name,
      icon: getIconName(talent.id, talent.name),
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
  }

  // 영웅 특성 처리 - 어둠 순찰자
  for (const talent of talentData.heroTalents.darkRanger) {
    const koreanInfo = findKoreanInfo(koreanDB, talent.id);
    detailedTalents.darkRangerTalents[talent.id] = {
      id: talent.id,
      koreanName: koreanInfo?.koreanName || talent.name,
      englishName: talent.name,
      icon: getIconName(talent.id, talent.name),
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
  }

  // 연결 정보 추가
  detailedTalents.connections = talentData.connections;

  // 파일 저장
  const outputPath = path.join(__dirname, '..', 'src', 'data', 'beastMasteryCompleteTalentTree.js');
  const fileContent = `// WoW 11.0.5 야수 사냥꾼 완전한 특성 트리
// Wowhead 실시간 데이터 기반 (${new Date().toISOString()})
// 총 ${total}개 특성 포함

export const beastMasteryCompleteTalentTree = ${JSON.stringify(detailedTalents, null, 2)};
`;

  fs.writeFileSync(outputPath, fileContent, 'utf-8');
  console.log(`\n✅ 특성 데이터 저장 완료: ${outputPath}`);

  await browser.close();
}

// 한국어 정보 찾기
function findKoreanInfo(db, spellId) {
  for (const className in db) {
    for (const skillId in db[className]) {
      if (parseInt(skillId) === spellId) {
        return db[className][skillId];
      }
    }
  }
  return null;
}

// 아이콘 이름 생성
function getIconName(spellId, englishName) {
  // 일반적인 아이콘 이름 패턴
  const nameMap = {
    'Kill Shot': 'ability_hunter_assassinate',
    'Hunter\'s Mark': 'ability_hunter_markedfordeath',
    'Tranquilizing Shot': 'spell_nature_drowsy',
    'Multi-Shot': 'ability_upgrademoonglaive',
    'Concussive Shot': 'spell_frost_stun',
    'Barbed Shot': 'ability_hunter_barbedshot',
    'Kill Command': 'ability_hunter_killcommand',
    'Beast Cleave': 'pet_bat',
    'Call of the Wild': 'ability_hunter_callofthewild',
    'Bloodshed': 'ability_druid_primaltenacity',
    'Dire Beast': 'ability_hunter_longevity',
    'Cobra Shot': 'ability_hunter_cobrashot',
    'Aspect of the Wild': 'spell_nature_protectionformnature',
    'Bestial Wrath': 'ability_druid_ferociousbite'
  };

  return nameMap[englishName] || `spell_${spellId}`;
}

collectCompleteTalents().catch(console.error);