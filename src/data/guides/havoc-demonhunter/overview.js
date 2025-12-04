// 파멸 악마사냥꾼 개요 데이터
// TWW 시즌 3 (11.2 패치) 기준

export const havocOverview = {
  description: `파멸 악마사냥꾼은 격노를 관리하여 폭발적인 근접 피해를 입히는 기동성 높은 근접 DPS 전문화입니다.
    빠른 이동 속도, 강력한 버스트 윈도우, 그리고 뛰어난 생존기를 가지고 있어 레이드와 쐐기돌 모두에서 활약합니다.
    현재 시즌에서는 알드라치 파괴자가 주류 빌드이며, 파괴자의 글레이브 활용이 핵심입니다.`,

  resourceSystem: {
    primary: '격노',
    max: 120,
    regeneration: '전투 중 자연 회복 없음',

    generators: [
      { skill: 'demonsbite', amount: '20-30' },
      { skill: 'immolationaura', amount: '지속 생성' },
      { skill: 'felrush', amount: '15' }
    ],

    spenders: [
      { skill: 'chaosstrike', amount: '40' },
      { skill: 'bladedance', amount: '35' },
      { skill: 'eyebeam', amount: '30' }
    ]
  },

  coreSkills: [
    'demonsbite',
    'chaosstrike',
    'bladedance',
    'eyebeam',
    'metamorphosis',
    'felrush'
  ]
};
