const fs = require('fs');
const path = require('path');

// 최종 DB 파일 읽기
const dbPath = path.join(__dirname, 'tww-s3-final-ultimate-database.json');
const heroTalentsPath = path.join(__dirname, 'tww-s3-hero-talents-mapping.json');

console.log('📚 TWW S3 최종 DB를 React 모듈로 변환 중 (전문화 데이터 포함)...');

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

// 전문화 매핑을 위한 키워드
const specKeywords = {
  '전사': {
    '무기': ['무기', '필사', '치명타', '압도'],
    '분노': ['분노', '광폭', '피의 갈증', '격노'],
    '방어': ['방어', '방패', '보호', '수호']
  },
  '성기사': {
    '신성': ['신성', '치유', '빛의', '축복'],
    '보호': ['보호', '방패', '수호자', '헌신'],
    '징벌': ['징벌', '응징', '심판', '정의']
  },
  '사냥꾼': {
    '야수': ['야수', '펫', '동물', '길들이기'],
    '사격': ['사격', '조준', '정밀', '사격술'],
    '생존': ['생존', '덫', '독', '야생']
  },
  '도적': {
    '암살': ['암살', '독', '출혈', '절개'],
    '무법': ['무법', '권총', '도박', '해적'],
    '잠행': ['잠행', '은신', '그림자', '어둠']
  },
  '사제': {
    '수양': ['수양', '보호막', '속죄', '고통 억제'],
    '신성': ['신성', '치유', '회복', '천상의'],
    '암흑': ['암흑', '어둠', '정신', '촉수']
  },
  '주술사': {
    '정기': ['정기', '번개', '원소', '대지'],
    '고양': ['고양', '질풍', '폭풍', '무기'],
    '복원': ['복원', '치유', '물', '토템']
  },
  '마법사': {
    '비전': ['비전', '신비', '마나', '폴리모프'],
    '화염': ['화염', '불', '작열', '발화'],
    '냉기': ['냉기', '서리', '얼음', '빙결']
  },
  '흑마법사': {
    '고통': ['고통', '저주', '부패', '고뇌'],
    '악마': ['악마', '소환', '임프', '지옥'],
    '파괴': ['파괴', '혼돈', '제물', '황폐']
  },
  '수도사': {
    '양조': ['양조', '맥주', '시간차', '취권'],
    '운무': ['운무', '안개', '치유', '기원'],
    '풍운': ['풍운', '주먹', '호랑이', '학']
  },
  '드루이드': {
    '조화': ['조화', '별', '달', '천체'],
    '야성': ['야성', '표범', '곰', '변신'],
    '수호': ['수호', '곰', '철갑', '나무'],
    '회복': ['회복', '치유', '자연', '회생']
  },
  '악마사냥꾼': {
    '파멸': ['파멸', '혼돈', '안광', '변신'],
    '복수': ['복수', '악마', '고통', '인장']
  },
  '죽음의기사': {
    '혈기': ['혈기', '피', '흡혈', '뼈'],
    '냉기': ['냉기', '서리', '룬', '얼음'],
    '부정': ['부정', '역병', '구울', '시체']
  },
  '기원사': {
    '황폐': ['황폐', '화염', '용의 분노', '심원'],
    '보존': ['보존', '치유', '시간', '되돌리기'],
    '증강': ['증강', '강화', '축복', '용의 힘']
  }
};

// 전문화 판별 함수
function determineSpec(skill, className) {
  if (!skill.koreanName && !skill.description) return '공용';

  const koreanClass = classNameMapping[className] || className;
  const specs = specKeywords[koreanClass];

  if (!specs) return '공용';

  const textToCheck = (skill.koreanName || '') + ' ' + (skill.description || '');

  for (const [specName, keywords] of Object.entries(specs)) {
    for (const keyword of keywords) {
      if (textToCheck.includes(keyword)) {
        return specName;
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

  Object.entries(database).forEach(([className, classSkills]) => {
    Object.entries(classSkills).forEach(([skillId, skill]) => {
      // 클래스명을 한글로 변환
      const koreanClassName = classNameMapping[className] || className;

      // 전문화 판별
      const spec = determineSpec(skill, className);

      // 필드 정규화
      const normalizedSkill = {
        id: skill.id || skillId,
        koreanName: skill.koreanName || skill.name || '',
        englishName: skill.englishName || skill.nameEn || '',
        icon: skill.icon || 'inv_misc_questionmark',
        description: skill.description || '',
        class: koreanClassName,  // 한글 클래스명 사용
        spec: spec,  // 판별된 전문화
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

  // 영웅특성 매핑 데이터 정리
  const heroTalentsFormatted = {};
  Object.entries(heroTalentsData).forEach(([className, talents]) => {
    const koreanClassName = classNameMapping[className] || className;
    heroTalentsFormatted[koreanClassName] = Object.keys(talents);
  });

  // React 모듈 생성
  const moduleContent = `// TWW Season 3 (11.2 패치) 최종 스킬 데이터베이스
// 자동 생성됨: ${new Date().toISOString()}
// 총 ${allSkills.length}개 스킬, 전문화 데이터 포함

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
  skillsWithSpec: ${allSkills.filter(s => s.spec !== '공용').length},
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

  console.log(`✅ React 모듈 생성 완료: ${outputPath}`);
  console.log(`📊 통계:
  - 총 스킬: ${allSkills.length}개
  - 전문화 할당: ${allSkills.filter(s => s.spec !== '공용').length}개
  - 강화된 필드 보유: ${allSkills.filter(s => s.radius || s.maxTargets || s.stacks || s.charges || s.proc).length}개
  - 클래스: 13개
  - 패치: 11.2 (TWW Season 3)`);

} catch (error) {
  console.error('❌ 변환 실패:', error);
}