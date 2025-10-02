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
    updateDate: '2025-10-02',
    link: '/guide/warlock/demonology',
    classColor: '#8788EE'
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
    updateDate: '2025-10-02',
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
    updateDate: '2025-10-02',
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
    updateDate: '2025-10-02',
    link: '/guide/shaman/elemental',
    classColor: '#0070DD'
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
