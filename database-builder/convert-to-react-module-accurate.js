const fs = require('fs');
const path = require('path');

// 최종 DB 파일 읽기
const dbPath = path.join(__dirname, 'tww-s3-final-ultimate-database.json');
const heroTalentsPath = path.join(__dirname, 'tww-s3-hero-talents-mapping.json');
const specMappingPath = path.join(__dirname, 'skill-spec-mapping.json');

console.log('📚 TWW S3 최종 DB를 React 모듈로 변환 중 (정확한 전문화 매핑)...');

// 클래스명 매핑 (영문 -> 한글)
const classNameMapping = {
  'WARRIOR': '전사',
  'PALADIN': '성기사',
  'HUNTER': '사냥꾼',
  'ROGUE': '도적',
  'PRIEST': '사제',
  'SHAMAN': '주술사',
  'MAGE': '마법사',
  'WARLOCK': '흑마법사',
  'MONK': '수도사',
  'DRUID': '드루이드',
  'DEMONHUNTER': '악마사냥꾼',
  'DEMON HUNTER': '악마사냥꾼',
  'DEATHKNIGHT': '죽음의기사',
  'DEATH KNIGHT': '죽음의기사',
  'EVOKER': '기원사'
};

// 전문화 매핑 로드
const loadSpecMapping = () => {
  try {
    const specMapping = JSON.parse(fs.readFileSync(specMappingPath, 'utf8'));

    // ID 기반 역매핑 테이블 생성
    const idToSpec = {};

    Object.entries(specMapping).forEach(([className, specs]) => {
      Object.entries(specs).forEach(([specName, skillIds]) => {
        skillIds.forEach(skillId => {
          idToSpec[skillId] = {
            class: className,
            spec: specName
          };
        });
      });
    });

    return idToSpec;
  } catch (error) {
    console.warn('⚠️ 전문화 매핑 파일을 찾을 수 없습니다. 기본값 사용.');
    return {};
  }
};

const idToSpec = loadSpecMapping();

// 전문화 판별 함수
function determineSpec(skill, className) {
  const koreanClassName = classNameMapping[className] || className;

  // ID 기반 정확한 매핑 확인
  const skillId = String(skill.id);
  if (idToSpec[skillId]) {
    return idToSpec[skillId].spec;
  }

  // 영웅특성이 있으면 특성 기반 전문화
  if (skill.heroTalent) {
    // 영웅특성에 따른 전문화 매핑
    const heroToSpec = {
      // 전사
      '거신': '무기',
      '산왕': '분노',
      '학살자': '무기',
      // 성기사
      '빛의 대장장이': '보호',
      '기사단': '보호',
      '태양의 사자': '징벌',
      // 사냥꾼
      '어둠 순찰자': '사격',
      '무리의 지도자': '야수',
      '파수꾼': '사격',
      // 도적
      '기만자': '무법',
      '운명결속': '암살',
      '죽음추적자': '암살',
      // 사제
      '예언자': '수양',
      '집정관': '신성',
      '공허술사': '암흑',
      // 주술사
      '선견자': '정기',
      '토템술사': '복원',
      '폭풍인도자': '고양',
      // 마법사
      '성난태양': '화염',
      '서리불꽃': '냉기',
      '주문술사': '비전',
      // 흑마법사
      '악마학자': '악마',
      '지옥소환사': '파괴',
      '영혼 수확자': '고통',
      // 수도사
      '천신의 대변자': '운무',
      '음영파': '풍운',
      '천상의 대리자': '양조',
      // 드루이드
      '야생추적자': '야성',
      '숲의 수호자': '회복',
      '엘룬의 대리자': '조화',
      '발톱의 드루이드': '수호',
      // 악마사냥꾼
      '알드라치 파괴자': '파멸',
      '지옥상흔': '복수',
      // 죽음의기사
      '산레인': '혈기',
      '종말의 기수': '냉기',
      '죽음의 인도자': '부정',
      // 기원사
      '불꽃형성자': '황폐',
      '시간 감시자': '보존',
      '비늘사령관': '증강'
    };

    if (heroToSpec[skill.heroTalent]) {
      return heroToSpec[skill.heroTalent];
    }
  }

  // 타입이 '특성'이고 특정 전문화 이름이 포함된 경우
  if (skill.type === '특성' && skill.koreanName) {
    const specNames = {
      '전사': ['무기', '분노', '방어'],
      '성기사': ['신성', '보호', '징벌'],
      '사냥꾼': ['야수', '사격', '생존'],
      '도적': ['암살', '무법', '잠행'],
      '사제': ['수양', '신성', '암흑'],
      '주술사': ['정기', '고양', '복원'],
      '마법사': ['비전', '화염', '냉기'],
      '흑마법사': ['고통', '악마', '파괴'],
      '수도사': ['양조', '운무', '풍운'],
      '드루이드': ['조화', '야성', '수호', '회복'],
      '악마사냥꾼': ['파멸', '복수'],
      '죽음의기사': ['혈기', '냉기', '부정'],
      '기원사': ['황폐', '보존', '증강']
    };

    const classSpecs = specNames[koreanClassName];
    if (classSpecs) {
      for (const spec of classSpecs) {
        if (skill.koreanName.includes(spec)) {
          return spec;
        }
      }
    }
  }

  return '공용';
}

try {
  // 데이터베이스 읽기
  const database = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const heroTalentsData = JSON.parse(fs.readFileSync(heroTalentsPath, 'utf8'));

  // 배열로 변환 (모든 클래스의 스킬을 하나의 배열로)
  const allSkills = [];

  // 통계를 위한 카운터
  const stats = {
    totalSkills: 0,
    skillsWithSpec: 0,
    skillsBySpec: {}
  };

  Object.entries(database).forEach(([className, classSkills]) => {
    Object.entries(classSkills).forEach(([skillId, skill]) => {
      // 클래스명을 한글로 변환
      const koreanClassName = classNameMapping[className] || className;

      // 전문화 판별
      const spec = determineSpec(skill, className);

      // 통계 업데이트
      stats.totalSkills++;
      if (spec !== '공용') {
        stats.skillsWithSpec++;
        const key = `${koreanClassName}-${spec}`;
        stats.skillsBySpec[key] = (stats.skillsBySpec[key] || 0) + 1;
      }

      // 필드 정규화
      const normalizedSkill = {
        id: skill.id || skillId,
        koreanName: skill.koreanName || skill.name || '',
        englishName: skill.englishName || skill.nameEn || '',
        icon: skill.icon || 'inv_misc_questionmark',
        description: skill.description || '',
        class: koreanClassName,  // 한글 클래스명 사용
        spec: spec,  // 정확한 전문화
        type: skill.type || '기본',
        cooldown: skill.cooldown || '',
        castTime: skill.castTime || '',
        range: skill.range || '',
        resourceCost: skill.resourceCost || skill.resource || '',
        resourceGain: skill.resourceGain || '',
        heroTalent: skill.heroTalent || null,
        level: skill.level || 1,
        pvp: skill.pvp || false,
        // 강화된 필드들
        radius: skill.radius || null,
        maxTargets: skill.maxTargets || null,
        stacks: skill.stacks || null,
        charges: skill.charges || null,
        proc: skill.proc || null,
        duration: skill.duration || null,
        damageCoefficient: skill.damageCoefficient || null,
        healingCoefficient: skill.healingCoefficient || null,
        school: skill.school || null,
        dispelType: skill.dispelType || null,
        gcd: skill.gcd || null,
        velocity: skill.velocity || null,
        // 추가 메타데이터
        patch: '11.2',
        season: 'TWW S3'
      };

      allSkills.push(normalizedSkill);
    });
  });

  console.log(`✅ 총 ${allSkills.length}개 스킬 변환 완료`);
  console.log(`📊 전문화 할당 통계:`);
  console.log(`  - 전문화 할당됨: ${stats.skillsWithSpec}개 (${(stats.skillsWithSpec / stats.totalSkills * 100).toFixed(1)}%)`);
  console.log(`  - 공용 스킬: ${stats.totalSkills - stats.skillsWithSpec}개`);

  // 전문화별 스킬 수 출력
  console.log(`\n📈 전문화별 스킬 분포:`);
  Object.entries(stats.skillsBySpec)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([key, count]) => {
      console.log(`  - ${key}: ${count}개`);
    });

  // 영웅특성 매핑 데이터 정리
  const heroTalentsFormatted = {};
  Object.entries(heroTalentsData).forEach(([className, talents]) => {
    const koreanClassName = classNameMapping[className] || className;
    heroTalentsFormatted[koreanClassName] = Object.keys(talents);
  });

  // React 모듈 생성
  const moduleContent = `// TWW Season 3 (11.2 패치) 최종 스킬 데이터베이스
// 자동 생성됨: ${new Date().toISOString()}
// 총 ${allSkills.length}개 스킬, 정확한 전문화 매핑

export const twwS3SkillDatabase = ${JSON.stringify(allSkills, null, 2)};

export const heroTalentsData = ${JSON.stringify(heroTalentsFormatted, null, 2)};

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

// 통계 정보
export const databaseStats = {
  totalSkills: ${allSkills.length},
  enhancedSkills: ${allSkills.filter(s => s.radius || s.maxTargets || s.stacks || s.charges || s.proc).length},
  skillsWithSpec: ${stats.skillsWithSpec},
  classes: 13,
  patch: '11.2',
  season: 'TWW Season 3',
  lastUpdated: '${new Date().toISOString()}'
};

export default twwS3SkillDatabase;
`;

  // 파일 저장
  const outputPath = path.join(__dirname, '..', 'src', 'data', 'twwS3SkillDatabase.js');
  fs.writeFileSync(outputPath, moduleContent, 'utf8');

  console.log(`\n✅ React 모듈 생성 완료: ${outputPath}`);

} catch (error) {
  console.error('❌ 변환 실패:', error);
}