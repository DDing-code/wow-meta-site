const fs = require('fs');
const path = require('path');

console.log('📦 정제된 DB를 React 모듈로 변환 중...');

// 정제된 데이터베이스 경로
const refinedDbPath = path.join(__dirname, 'tww-s3-refined-database.json');

// 클래스명 매핑
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

try {
  // 정제된 데이터베이스 읽기
  const database = JSON.parse(fs.readFileSync(refinedDbPath, 'utf8'));

  // 배열로 변환
  const allSkills = [];

  // 통계
  const stats = {
    totalSkills: 0,
    skillsByType: {},
    skillsBySpec: {},
    skillsWithSpec: 0,
    basicSkills: 0,
    talentSkills: 0
  };

  Object.entries(database).forEach(([className, classSkills]) => {
    const koreanClassName = classNameMapping[className] || className;

    Object.entries(classSkills).forEach(([skillId, skill]) => {
      // 한글 클래스명 사용
      const normalizedSkill = {
        id: skill.id || skillId,
        koreanName: skill.koreanName || '',
        englishName: skill.englishName || '',
        icon: skill.icon || 'inv_misc_questionmark',
        description: skill.description || '',
        class: koreanClassName,
        spec: skill.spec || '공용',
        type: skill.type || '기본',
        cooldown: skill.cooldown || '',
        castTime: skill.castTime || '',
        range: skill.range || '',
        resourceCost: skill.resourceCost || '',
        resourceGain: skill.resourceGain || '',
        heroTalent: skill.heroTalent || null,
        level: skill.level || 1,
        pvp: skill.pvp || false,
        // 추가 필드들
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
        // 메타데이터
        patch: '11.2',
        season: 'TWW S3'
      };

      allSkills.push(normalizedSkill);

      // 통계 업데이트
      stats.totalSkills++;

      // 타입별 통계
      stats.skillsByType[normalizedSkill.type] = (stats.skillsByType[normalizedSkill.type] || 0) + 1;

      // 전문화별 통계
      if (normalizedSkill.spec !== '공용') {
        stats.skillsWithSpec++;
        const specKey = `${koreanClassName}-${normalizedSkill.spec}`;
        stats.skillsBySpec[specKey] = (stats.skillsBySpec[specKey] || 0) + 1;
      }

      // 기본/특성 통계
      if (normalizedSkill.type === '기본') {
        stats.basicSkills++;
      } else if (normalizedSkill.type === '특성') {
        stats.talentSkills++;
      }
    });
  });

  console.log(`✅ 총 ${allSkills.length}개 스킬 변환 완료`);
  console.log(`📊 통계:`);
  console.log(`  - 기본 스킬: ${stats.basicSkills}개`);
  console.log(`  - 특성: ${stats.talentSkills}개`);
  console.log(`  - 전문화 할당: ${stats.skillsWithSpec}개 (${(stats.skillsWithSpec / stats.totalSkills * 100).toFixed(1)}%)`);

  // 영웅특성 데이터 정리
  const heroTalentsData = {
    '전사': ['거신', '산왕', '학살자'],
    '성기사': ['빛의 대장장이', '기사단', '태양의 사자'],
    '사냥꾼': ['어둠 순찰자', '무리의 지도자', '파수꾼'],
    '도적': ['기만자', '운명결속', '죽음추적자'],
    '사제': ['예언자', '집정관', '공허술사'],
    '주술사': ['선견자', '토템술사', '폭풍인도자'],
    '마법사': ['성난태양', '서리불꽃', '주문술사'],
    '흑마법사': ['악마학자', '지옥소환사', '영혼 수확자'],
    '수도사': ['천신의 대변자', '음영파', '천상의 대리자'],
    '드루이드': ['야생추적자', '숲의 수호자', '엘룬의 대리자', '발톱의 드루이드'],
    '악마사냥꾼': ['알드라치 파괴자', '지옥상흔'],
    '죽음의기사': ['산레인', '종말의 기수', '죽음의 인도자'],
    '기원사': ['불꽃형성자', '시간 감시자', '비늘사령관']
  };

  // React 모듈 생성
  const moduleContent = `// TWW Season 3 (11.2 패치) 정제된 스킬 데이터베이스
// 자동 생성됨: ${new Date().toISOString()}
// 총 ${allSkills.length}개 스킬 - 데이터 정제 완료

export const twwS3SkillDatabase = ${JSON.stringify(allSkills, null, 2)};

export const heroTalentsData = ${JSON.stringify(heroTalentsData, null, 2)};

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
  totalSkills: ${stats.totalSkills},
  basicSkills: ${stats.basicSkills},
  talentSkills: ${stats.talentSkills},
  skillsWithSpec: ${stats.skillsWithSpec},
  enhancedSkills: ${allSkills.filter(s => s.radius || s.maxTargets || s.stacks || s.charges || s.proc).length},
  classes: 13,
  patch: '11.2',
  season: 'TWW Season 3',
  lastUpdated: '${new Date().toISOString()}',
  dataQuality: {
    descriptionsFixed: true,
    typesClassified: true,
    specsAccurate: true
  }
};

export default twwS3SkillDatabase;
`;

  // 파일 저장
  const outputPath = path.join(__dirname, '..', 'src', 'data', 'twwS3RefinedSkillDatabase.js');
  fs.writeFileSync(outputPath, moduleContent, 'utf8');

  console.log(`\n✅ React 모듈 생성 완료: ${outputPath}`);
  console.log(`📈 데이터 품질:`);
  console.log(`  - 설명 정제 완료`);
  console.log(`  - 타입 분류 완료 (기본: ${stats.basicSkills}, 특성: ${stats.talentSkills})`);
  console.log(`  - 전문화 매핑 완료 (${stats.skillsWithSpec}개)`);

} catch (error) {
  console.error('❌ 변환 실패:', error);
}