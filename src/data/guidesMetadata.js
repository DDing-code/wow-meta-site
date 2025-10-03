// 가이드 메타데이터 중앙 관리
// 새 가이드 추가 시 이 파일만 업데이트하면 됩니다

export const guidesMetadata = [
  {
    id: 'warlock-affliction',
    class: '흑마법사',
    classEng: 'warlock',
    spec: '고통',
    specEng: 'affliction',
    title: '고통 흑마법사',
    patch: '11.2',
    difficulty: '중급',
    updateDate: '2025-10-02',
    link: '/guide/warlock/affliction',
    classColor: '#8788EE'
  },
  {
    id: 'warlock-demonology',
    class: '흑마법사',
    classEng: 'warlock',
    spec: '악마',
    specEng: 'demonology',
    title: '악마 흑마법사',
    patch: '11.2',
    difficulty: '고급',
    updateDate: '2025-10-01',
    link: '/guide/warlock/demonology',
    classColor: '#8788EE'
  },
  {
    id: 'warlock-destruction',
    class: '흑마법사',
    classEng: 'warlock',
    spec: '파괴',
    specEng: 'destruction',
    title: '파괴 흑마법사',
    patch: '11.2',
    difficulty: '중급',
    updateDate: '2025-10-03',
    link: '/guide/warlock/destruction',
    classColor: '#8788EE',
    description: '강력한 직접 피해와 보장된 극대화를 활용한 대규모 공격 특화 전문화'
  },
  {
    id: 'hunter-beast-mastery',
    class: '사냥꾼',
    classEng: 'hunter',
    spec: '야수',
    specEng: 'beast-mastery',
    title: '야수 사냥꾼',
    patch: '11.2',
    difficulty: '초급',
    updateDate: '2025-09-29',
    link: '/guide/hunter/beast-mastery',
    classColor: '#AAD372'
  },
  {
    id: 'evoker-devastation',
    class: '기원사',
    classEng: 'evoker',
    spec: '황폐',
    specEng: 'devastation',
    title: '황폐 기원사',
    patch: '11.2',
    difficulty: '중급',
    updateDate: '2025-09-29',
    link: '/guide/evoker/devastation',
    classColor: '#33937F'
  },
  {
    id: 'shaman-elemental',
    class: '주술사',
    classEng: 'shaman',
    spec: '정기',
    specEng: 'elemental',
    title: '정기 주술사',
    patch: '11.2',
    difficulty: '중급',
    updateDate: '2025-10-01',
    link: '/guide/shaman/elemental',
    classColor: '#0070DD'
  },
  {
    id: 'warrior-fury',
    class: '전사',
    classEng: 'warrior',
    spec: '분노',
    specEng: 'fury',
    title: '분노 전사',
    patch: '11.2',
    difficulty: '중급',
    updateDate: '2025-10-03',
    link: '/guide/warrior/fury',
    classColor: '#C69B6D',
    description: '양손 무기를 휘둘러 폭발적인 피해를 입히는 근접 DPS 전문화',
    reviewer: '자의식-아즈샤라'
  }
];

// 최신순으로 정렬된 가이드 반환
export const getRecentGuides = (limit = 4) => {
  return [...guidesMetadata]
    .sort((a, b) => new Date(b.updateDate) - new Date(a.updateDate))
    .slice(0, limit);
};

// 특정 클래스의 가이드 반환
export const getGuidesByClass = (classEng) => {
  return guidesMetadata.filter(guide => guide.classEng === classEng);
};

// 특정 전문화 가이드 반환
export const getGuideBySpec = (classEng, specEng) => {
  return guidesMetadata.find(
    guide => guide.classEng === classEng && guide.specEng === specEng
  );
};
