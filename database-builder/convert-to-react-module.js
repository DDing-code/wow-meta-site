const fs = require('fs');
const path = require('path');

// 최종 DB 파일 읽기
const dbPath = path.join(__dirname, 'tww-s3-final-ultimate-database.json');
const heroTalentsPath = path.join(__dirname, 'tww-s3-hero-talents-mapping.json');

console.log('📚 TWW S3 최종 DB를 React 모듈로 변환 중...');

try {
  // 데이터베이스 읽기
  const database = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const heroTalentsData = JSON.parse(fs.readFileSync(heroTalentsPath, 'utf8'));

  // 배열로 변환 (모든 클래스의 스킬을 하나의 배열로)
  const allSkills = [];

  Object.entries(database).forEach(([className, classSkills]) => {
    Object.entries(classSkills).forEach(([skillId, skill]) => {
      // 필드 정규화
      const normalizedSkill = {
        id: skill.id || skillId,
        koreanName: skill.koreanName || skill.name || '',
        englishName: skill.englishName || skill.nameEn || '',
        icon: skill.icon || 'inv_misc_questionmark',
        description: skill.description || '',
        class: skill.class || className,
        spec: skill.spec || '공용',
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
    heroTalentsFormatted[className] = Object.keys(talents);
  });

  // React 모듈 생성
  const moduleContent = `// TWW Season 3 (11.2 패치) 최종 스킬 데이터베이스
// 자동 생성됨: ${new Date().toISOString()}
// 총 ${allSkills.length}개 스킬, 570개 강화된 필드 포함

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
  - 강화된 필드 보유: ${allSkills.filter(s => s.radius || s.maxTargets || s.stacks || s.charges || s.proc).length}개
  - 클래스: 13개
  - 패치: 11.2 (TWW Season 3)`);

} catch (error) {
  console.error('❌ 변환 실패:', error);
}