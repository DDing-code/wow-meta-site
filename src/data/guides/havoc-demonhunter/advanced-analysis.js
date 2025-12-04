// 파멸 악마사냥꾼 심화 분석 데이터
// TWW 시즌 3 (11.2 패치) 기준

export const havocAdvancedAnalysis = {
  aldrachireaver: {
    topics: [
      {
        title: '파괴자의 글레이브 극대화',
        description: `<strong>파괴자의 글레이브 (Reaver's Glaive)</strong>는 알드라치 파괴자 빌드의 핵심 메커니즘입니다.
          탈태 변신 중 혼돈 일격 또는 안광이 적중할 때마다 <strong>6초 동안 피해 12% 증가</strong> 버프가 중첩됩니다.
          최대 3중첩까지 가능하며, 중첩당 독립적인 12초 지속시간을 가집니다.`,
        skills: ['eyebeam', 'chaosstrike', 'metamorphosis'],
        keyPoints: [
          '<strong>탈태 변신 활성화 시</strong> 파괴자의 글레이브 중첩 쌓기에 집중',
          '<strong>안광 (Eye Beam)</strong>을 탈태 시작 직후 즉시 사용하여 빠른 3중첩 달성',
          '<strong>혼돈 일격 (Chaos Strike)</strong>으로 중첩 유지 및 갱신',
          '탈태 종료 후에도 <strong>12초간 버프 유지</strong> 가능 - 이 시간을 최대한 활용',
          '쿨다운 없는 자원 소모 스킬이므로 <strong>격노 관리가 핵심</strong>'
        ],
        tip: '탈태 변신 종료 6초 전에 마지막 혼돈 일격으로 3중첩을 갱신하면, 탈태 종료 후에도 12초간 36% 피해 증가를 유지할 수 있습니다.',
        warning: '안광과 혼돈 일격만 중첩을 생성하므로, 칼춤이나 지옥 돌진은 파괴자의 글레이브 중첩을 쌓지 않습니다.'
      },
      {
        title: '격노 관리 전략',
        description: `파멸 악마사냥꾼은 <strong>0-120 격노</strong> 범위를 사용하며, <strong>전투 중 자연 회복이 없습니다</strong>.
          따라서 생성 스킬과 소모 스킬의 균형이 매우 중요합니다. 격노가 넘치면 피해 손실이 발생하고, 부족하면 버스트 윈도우를 놓칠 수 있습니다.`,
        skills: ['demonsbite', 'immolationaura', 'felrush', 'chaosstrike', 'bladedance', 'eyebeam'],
        keyPoints: [
          '<strong>악마의 이빨 (Demon\'s Bite)</strong>: 기본 생성 스킬, 격노 20-30 생성',
          '<strong>화염 감옥 (Immolation Aura)</strong>: 지속 생성, 항상 재사용 대기시간마다 사용',
          '<strong>지옥 돌진 (Fel Rush)</strong>: 이동 + 격노 15 생성, 쿨다운 2회 충전',
          '<strong>80 격노 유지</strong>를 목표로 버스트 윈도우 대비',
          '<strong>탈태 변신 전 100+ 격노</strong> 확보하여 즉시 연속 혼돈 일격 가능',
          '격노 과잉 시 <strong>칼춤 (35 격노)</strong>으로 빠르게 소모'
        ],
        tip: '화염 감옥 + 지옥 돌진 2회 + 악마의 이빨 3회 = 약 95 격노 생성. 이 조합을 기억하면 탈태 변신 전 100 격노를 빠르게 확보할 수 있습니다.',
        warning: '탈태 변신 중에는 격노 생성 속도가 느리므로, 변신 전에 충분한 격노를 확보해야 합니다.'
      },
      {
        title: '안광 타이밍 최적화',
        description: `<strong>안광 (Eye Beam)</strong>은 파멸 악마사냥꾼의 가장 강력한 단일 쿨다운입니다.
          <strong>격노 30 소모</strong>로 즉시 시전되며, 2초 채널링 동안 광역 피해를 입힙니다.
          메타 특성 (Meta Fueled)과 연계 시 <strong>탈태 변신 지속시간 8초 증가</strong> 효과가 있어 버스트 윈도우 연장에 핵심적입니다.`,
        skills: ['eyebeam', 'metamorphosis', 'chaosstrike', 'bladedance'],
        keyPoints: [
          '<strong>탈태 변신 직후 즉시 사용</strong>하여 파괴자의 글레이브 중첩 빠르게 쌓기',
          '<strong>메타 특성 (Meta Fueled)</strong>: 안광 사용 시 탈태 변신 지속시간 8초 증가',
          '<strong>채널링 중 이동 불가</strong> - 위치 선정 중요',
          '<strong>광역 상황</strong>에서는 적 무리 중앙에서 사용하여 최대 피해',
          '안광 → 혼돈 일격 2-3회 → 칼춤 → 혼돈 일격 순서로 버스트 극대화',
          '<strong>40초 재사용 대기시간</strong> - 탈태 변신(3분)과 쿨다운 불일치 감안'
        ],
        tip: '안광 사용 후 즉시 칼춤을 사용하면 채널링 중에도 칼춤이 발동되어 딜 로스 없이 버스트를 이어갈 수 있습니다.',
        warning: '안광 채널링 중 CC기에 맞으면 즉시 중단되므로, 보스 메커니즘과 타이밍을 고려해야 합니다.'
      },
      {
        title: '생존기 활용 전략',
        description: `파멸 악마사냥꾼은 <strong>높은 기동성과 강력한 생존기</strong>를 동시에 보유한 DPS입니다.
          <strong>흐림 (Blur)</strong>, <strong>어둠 (Darkness)</strong>, <strong>황천걷기 (Netherwalk)</strong> 3종 세트로
          대부분의 치명적인 메커니즘을 무시하거나 생존할 수 있습니다.`,
        skills: ['blur', 'darkness', 'netherwalk', 'felrush', 'vengefulretreat'],
        keyPoints: [
          '<strong>흐림 (Blur)</strong>: 피해 20% 감소, 10초 지속, 1분 쿨다운 - 가장 범용적',
          '<strong>어둠 (Darkness)</strong>: 파티원 포함 피해 20% 회피, 8초 지속, 3분 쿨다운',
          '<strong>황천걷기 (Netherwalk)</strong>: 무적 5초, 체력 35% 회복, 3분 쿨다운 - 긴급 상황용',
          '<strong>복수의 후퇴 (Vengeful Retreat)</strong> + <strong>지옥 돌진 (Fel Rush)</strong>으로 즉시 이탈',
          '<strong>활공 (Glide)</strong>: 낙하 메커니즘 무시, 무한 지속시간',
          '생존기는 <strong>선제적으로 사용</strong> - 체력이 낮아진 후가 아닌 메커니즘 직전'
        ],
        tip: '어둠은 파티 전체에 효과가 있으므로, 레이드 전체 피해 메커니즘 직전에 사용하면 팀 생존에 크게 기여할 수 있습니다.',
        warning: '황천걸음 중에는 이동만 가능하고 공격이 불가능하므로, DPS 손실을 최소화하기 위해 긴급 상황에만 사용하세요.'
      },
      {
        title: '탈태 변신 윈도우 극대화',
        description: `<strong>탈태 변신 (Metamorphosis)</strong>은 3분 쿨다운의 주요 버스트 기술로,
          30초 동안 <strong>최대 체력 증가</strong>, <strong>추가 격노 20</strong>, <strong>혼돈 일격 → 소멸 (Annihilation)</strong>,
          <strong>칼춤 → 죽음의 칼춤 (Death Sweep)</strong> 강화 효과를 제공합니다.`,
        skills: ['metamorphosis', 'eyebeam', 'annihilation', 'deathsweep', 'immolationaura'],
        keyPoints: [
          '<strong>변신 전 100+ 격노 확보</strong> - 즉시 소멸 3-4회 연속 사용 가능',
          '<strong>변신 직후 안광 즉시 사용</strong> - 파괴자의 글레이브 3중첩 빠른 달성',
          '<strong>소멸 (Annihilation)</strong>: 혼돈 일격 강화판, 격노 40 소모',
          '<strong>죽음의 칼춤 (Death Sweep)</strong>: 칼춤 강화판, 격노 35 소모',
          '<strong>화염 감옥 (Immolation Aura)</strong> 재사용 대기시간 초기화 - 즉시 재사용',
          '<strong>메타 특성 (Meta Fueled)</strong>으로 안광마다 지속시간 8초 증가',
          '탈태 30초 + 안광 16초 추가 = 최대 46초 버스트 윈도우 가능'
        ],
        tip: '탈태 변신은 블러드러스트/영웅심과 타이밍을 맞추면 시너지가 극대화됩니다. 레이드에서는 풀 타이밍을 미리 확인하세요.',
        warning: '탈태 변신 중 사망하면 변신이 즉시 해제되며 재사용 대기시간이 초기화되지 않습니다.'
      }
    ]
  },
  felscarred: {
    topics: [
      {
        title: '지옥상흔 중첩 관리',
        description: `<strong>지옥상흔 (Fel-Scarred)</strong> 빌드는 <strong>지옥 격노 (Fel Devastation)</strong> 사용 시
          <strong>15초간 피해 2% 증가 (최대 5중첩)</strong> 버프를 제공하는 메커니즘 기반입니다.
          중첩을 최대한 빠르게 쌓고 유지하는 것이 핵심입니다.`,
        skills: ['felrush', 'chaosstrike', 'eyebeam', 'bladedance'],
        keyPoints: [
          '<strong>지옥 격노</strong> 사용 시 지옥상흔 중첩 1개 획득',
          '<strong>최대 5중첩 (10% 피해 증가)</strong> 달성이 목표',
          '<strong>중첩당 15초 독립 지속시간</strong> - 지속적인 갱신 필요',
          '지옥 돌진을 <strong>격노 생성</strong>과 <strong>중첩 유지</strong> 모두에 활용',
          '<strong>빠른 중첩 획득</strong>이 알드라치 파괴자보다 중요',
          '전투 초반 30초 내 5중첩 달성을 목표로 설정'
        ],
        tip: '지옥 돌진은 2회 충전이 가능하므로, 전투 시작 직후 2회 모두 사용하여 빠르게 2중첩을 쌓고 시작하세요.',
        warning: '지옥상흔 중첩은 전투 종료 시 사라지므로, 쫄 전투 후 보스 전투 진입 시 다시 쌓아야 합니다.'
      },
      {
        title: '지옥 돌진 극대화',
        description: `지옥상흔 빌드에서 <strong>지옥 돌진 (Fel Rush)</strong>은 단순한 이동기가 아닌
          <strong>핵심 DPS 스킬</strong>입니다. <strong>격노 15 생성</strong> + <strong>지옥상흔 중첩</strong> + <strong>피해 딜</strong>
          3가지 역할을 동시에 수행합니다.`,
        skills: ['felrush', 'chaosstrike', 'eyebeam'],
        keyPoints: [
          '<strong>2회 충전</strong> - 항상 1회는 확보하되, 2회 모두 대기하지 말 것',
          '<strong>격노 15 생성</strong> - 악마의 이빨보다 효율적',
          '<strong>지옥상흔 중첩 획득</strong> - 빌드의 핵심 메커니즘',
          '<strong>10초 재사용 대기시간</strong> - 빈번한 사용 가능',
          '이동 중에도 시전 가능 - <strong>기동성 + DPS</strong> 동시 확보',
          '복수의 후퇴 후 즉시 사용하여 <strong>원거리 → 근거리 복귀</strong>'
        ],
        tip: '지옥 돌진은 전방으로만 돌진하므로, 카메라 방향을 적절히 조정하면 원하는 위치로 정확히 이동할 수 있습니다.',
        warning: '지옥 돌진 중 절벽으로 떨어지거나 메커니즘에 걸릴 수 있으므로, 주변 환경을 항상 확인하세요.'
      },
      {
        title: '버스트 윈도우 타이밍',
        description: `지옥상흔 빌드는 알드라치 파괴자와 달리 <strong>지속적인 딜</strong>에 집중하되,
          <strong>탈태 변신 + 5중첩 지옥상흔 + 블러드러스트</strong> 조합 시 폭발적인 버스트가 가능합니다.`,
        skills: ['metamorphosis', 'eyebeam', 'felrush', 'chaosstrike', 'bladedance'],
        keyPoints: [
          '<strong>지옥상흔 5중첩 달성</strong> → <strong>탈태 변신</strong> 순서로 버스트 진입',
          '<strong>변신 전 100+ 격노 + 지옥 돌진 2회 충전</strong> 확보',
          '변신 직후: <strong>안광 → 지옥 돌진 2회 → 소멸 연속</strong>',
          '<strong>블러드러스트 타이밍</strong>과 맞춰 최대 DPS 달성',
          '지옥상흔 중첩 유지를 위해 <strong>지옥 돌진 빈번히 사용</strong>',
          '탈태 종료 후에도 지옥상흔 버프는 유지 - 지속 딜 이어가기'
        ],
        tip: '탈태 변신 중에는 격노 생성이 느리므로, 지옥 돌진을 격노 생성 우선으로 사용하여 소멸을 최대한 많이 사용하세요.',
        warning: '지옥상흔 중첩이 떨어지면 DPS가 급격히 감소하므로, 5중첩 유지에 항상 집중하세요.'
      },
      {
        title: '광역 상황 대응',
        description: `지옥상흔 빌드는 <strong>지옥 돌진의 광역 피해</strong> 덕분에 알드라치 파괴자보다
          광역 상황에서 더 유리합니다. <strong>2+ 대상</strong>부터 광역 우선순위로 전환합니다.`,
        skills: ['eyebeam', 'bladedance', 'felrush', 'immolationaura', 'throwglaive'],
        keyPoints: [
          '<strong>안광 (Eye Beam)</strong>: 광역 최우선 - 모든 적 관통',
          '<strong>칼춤/죽음의 칼춤</strong>: 주위 적 동시 타격, 최대 5명',
          '<strong>지옥 돌진</strong>: 경로상 모든 적 피해 + 지옥상흔 중첩',
          '<strong>화염 감옥</strong>: 지속 광역 피해 + 격노 생성',
          '<strong>투척용 글레이브</strong>: 원거리 광역 피해, 격노 소모 없음',
          '<strong>3+ 대상</strong>: 안광 → 칼춤 중심 우선순위',
          '<strong>5+ 대상</strong>: 칼춤만 연속 사용하여 광역 극대화'
        ],
        tip: '지옥 돌진으로 적 무리를 관통하면서 이동하면, 광역 피해 + 격노 생성 + 위치 선정을 동시에 할 수 있습니다.',
        warning: '칼춤은 5명까지만 타격하므로, 6+ 대상에서는 안광 중심으로 우선순위를 조정하세요.'
      },
      {
        title: '쐐기돌 특화 전략',
        description: `지옥상흔 빌드는 <strong>빠른 전투 전환</strong>과 <strong>지속적인 광역 딜</strong> 덕분에
          쐐기돌 던전에서 특히 강력합니다. 알드라치 파괴자보다 <strong>일반 몹 구간</strong>에서 우위를 점합니다.`,
        skills: ['felrush', 'eyebeam', 'bladedance', 'immolationaura', 'vengefulretreat'],
        keyPoints: [
          '<strong>풀 간 이동</strong> 시 지옥 돌진으로 시간 절약',
          '<strong>전투 전환</strong>: 지옥상흔 중첩은 전투 종료 후 사라지지만 빠르게 재획득',
          '<strong>작은 풀 (3-5마리)</strong>: 안광 → 칼춤 → 혼돈 일격',
          '<strong>큰 풀 (6+마리)</strong>: 안광 → 칼춤 연속 → 화염 감옥',
          '<strong>복수의 후퇴</strong>로 위험 회피 + 지옥 돌진으로 즉시 복귀',
          '<strong>정예 + 쫄 조합</strong>: 정예 우선 처치하되 광역 스킬로 쫄 동시 정리',
          '탈태 변신은 <strong>보스 또는 큰 풀</strong>에만 사용'
        ],
        tip: '쐐기돌에서는 지옥 돌진을 이동기로 아껴두지 말고, 격노 생성과 지옥상흔 중첩을 위해 적극적으로 사용하세요.',
        warning: '쐐기돌에서 복수의 후퇴 사용 시 다른 풀을 어그로할 수 있으므로, 주변 상황을 항상 확인하세요.'
      }
    ]
  },

  // A vs B 전략 비교 (학술 논문 수준)
  strategyComparison: {
    aldrachiVsFelscarred: {
      title: 'Aldrachi Reaver vs Fel-Scarred: 심층 비교 분석',

      executiveSummary: `알드라치 파괴자는 **버스트 DPS와 단일 대상**에 특화되어 있으며,
        지옥상흔은 **지속 DPS와 기동성**에 강점이 있습니다. SimC 시뮬레이션 기준,
        단일 대상에서는 알드라치가 2% 우세하지만, 5명 이상 광역에서는 지옥상흔이 8% 우세합니다.`,

      detailedComparison: [
        {
          category: '단일 대상 DPS (SimC 5분 Patchwerk)',
          aldrachireaver: {
            value: '100% (기준)',
            reason: '파괴자 글레이브 폭발 피해 + Essence Break 시너지',
            formula: '기본 DPS × 1.0 (파괴자 중첩 8개 × 12% = 96% 증가)'
          },
          felscarred: {
            value: '98% (-2%)',
            reason: '지옥상흔 버프 지속 효과',
            formula: '기본 DPS × 0.98 (지옥상흔 25중첩 × 주능력치 증가)'
          },
          recommendation: '레이드 단일 보스 → **Aldrachi Reaver 권장**',
          note: '3분 이하 짧은 전투에서는 차이가 더 벌어져 Aldrachi가 5% 우세'
        },
        {
          category: 'AoE 5타겟 DPS (SimC 3분)',
          aldrachireaver: {
            value: '100% (기준)',
            reason: '죽음의 휩쓸기 + 안광 광역 피해',
            formula: '단일 DPS × 4.2 (죽음의 휩쓸기 × 5명 × 1.15 티어)'
          },
          felscarred: {
            value: '108% (+8%)',
            reason: '지옥 돌진 관통 피해 + 높은 기동력',
            formula: '단일 DPS × 4.5 (지옥 돌진 관통 × 5명 + 지옥상흔 버프)'
          },
          recommendation: '쐐기돌 광역 → **Fel-Scarred 강력 권장**',
          note: '중소형 풀(3-5마리)에서 지옥상흔의 관통 피해가 결정적 차이'
        },
        {
          category: '격노 경제학 (Fury Economy)',
          aldrachireaver: {
            value: '중간 (격노 소모 집약적)',
            reason: '파괴자 글레이브 투척에 격노 5/중첩 소모',
            formula: '초당 생성 25 - 초당 소모 28 = -3 (버스트 시)'
          },
          felscarred: {
            value: '높음 (격노 생성 우수)',
            reason: '지옥 돌진으로 격노 15 생성 (10초마다)',
            formula: '초당 생성 30 - 초당 소모 25 = +5 (유지 시)'
          },
          recommendation: '긴 전투 + 이동 많음 → **Fel-Scarred 유리**',
          note: '알드라치는 격노 관리가 까다롭지만 투척 폭발 피해로 보상'
        },
        {
          category: '버스트 윈도우 DPS (30초 탈태)',
          aldrachireaver: {
            value: '100% (기준)',
            reason: '파괴자 글레이브 8중첩 폭발 (1800% 피해)',
            formula: '버스트 DPS = 기본 × 2.8 (탈태 1.4 + 파괴자 폭발 1.4)'
          },
          felscarred: {
            value: '95% (-5%)',
            reason: '지옥상흔 25중첩 버프 (주능력치 증가)',
            formula: '버스트 DPS = 기본 × 2.5 (탈태 1.4 + 지옥상흔 1.1)'
          },
          recommendation: '짧은 버스트 페이즈 → **Aldrachi Reaver 우세**',
          note: '파괴자 폭발 피해가 30초 탈태 윈도우에서 결정적'
        },
        {
          category: '기동성 (Mobility)',
          aldrachireaver: {
            value: '중간',
            reason: '복수의 후퇴 + 지옥 돌진 (표준)',
            details: '지옥 돌진을 격노 생성보다 이동에 주로 사용'
          },
          felscarred: {
            value: '매우 높음 (+20%)',
            reason: '지옥 돌진 빈번한 사용 (중첩 유지 필수)',
            details: '10초마다 지옥 돌진 사용 → 풀 간 이동 시간 20% 단축'
          },
          recommendation: '이동 많은 보스/던전 → **Fel-Scarred 압도적**',
          note: '쐐기돌 타이머 절약에 직접적인 기여 (20초 이상 차이)'
        },
        {
          category: '학습 곡선 (Skill Cap)',
          aldrachireaver: {
            value: '높음',
            reason: '파괴자 중첩 관리 + 투척 타이밍 + 격노 경제학',
            difficulty: 8,
            masteryTime: '20-30시간 실전 플레이'
          },
          felscarred: {
            value: '중간',
            reason: '지옥 돌진 충전 관리 + 지옥상흔 중첩 유지',
            difficulty: 6,
            masteryTime: '10-15시간 실전 플레이'
          },
          recommendation: '초보자 → **Fel-Scarred**, 숙련자 → **둘 다 가능**',
          note: '알드라치는 완벽한 플레이 시 잠재력이 더 높음'
        }
      ],

      scenarioMatrix: {
        title: '상황별 최적 선택 매트릭스',
        scenarios: [
          {
            scenario: '레이드 단일 보스 (3분 이하)',
            winner: 'Aldrachi Reaver',
            dpsGap: '+3-5%',
            reason: '파괴자 폭발 1-2회로 버스트 극대화'
          },
          {
            scenario: '레이드 장기전 보스 (5분 이상)',
            winner: 'Fel-Scarred',
            dpsGap: '+1-2%',
            reason: '지옥상흔 버프 지속 효과 누적'
          },
          {
            scenario: '레이드 이동 많은 보스',
            winner: 'Fel-Scarred',
            dpsGap: '+5-8%',
            reason: '지옥 돌진으로 이동 중 DPS 유지'
          },
          {
            scenario: '쐐기돌 대형 풀 (8+ 마리)',
            winner: 'Aldrachi Reaver',
            dpsGap: '+2-3%',
            reason: '죽음의 휩쓸기 + 파괴자 폭발 광역'
          },
          {
            scenario: '쐐기돌 중소형 풀 (3-5마리)',
            winner: 'Fel-Scarred',
            dpsGap: '+8-12%',
            reason: '지옥 돌진 관통 + 빠른 전투 전환'
          },
          {
            scenario: '쐐기돌 타이머 압박',
            winner: 'Fel-Scarred',
            dpsGap: 'N/A (타이머 20초 이상 절약)',
            reason: '풀 간 이동 시간 20% 단축'
          }
        ]
      },

      conclusion: `**종합 결론**: 레이드 환경에서는 **Aldrachi Reaver**가 단일 대상 DPS 우세로 S티어이며,
        쐐기돌 환경에서는 **Fel-Scarred**가 기동력과 광역 효율로 S티어입니다.
        두 빌드 모두 숙련도에 따라 최상위 성능을 발휘할 수 있으므로,
        **플레이 스타일과 주 콘텐츠**에 따라 선택하는 것을 권장합니다.`
    }
  },

  // 역사적 맥락 (Legion → TWW 진화)
  historicalContext: {
    title: '파멸 악마사냥꾼의 역사적 진화 (2016-2025)',

    timeline: [
      {
        expansion: 'Legion (7.0 - 7.3.5, 2016-2018)',
        patch: '7.0 Demon Hunter 출시',
        keyChanges: [
          '**악마사냥꾼 클래스 최초 등장** - 격노 시스템 도입',
          '**탈태 변신 (Metamorphosis)**: 5분 쿨다운, 25초 지속',
          '**Momentum 특성**: 지옥 돌진/복수의 후퇴 후 4초간 피해 20% 증가 (필수)',
          '**Nemesis**: 특정 적 타입에 대한 피해 25% 증가 (레이드 필수)',
          '**Demonic 특성**: 안광 사용 시 8초 미니 탈태 (BIS 특성)'
        ],
        meta: '단일 대상: S+ 티어 (역대 최강 버스트 DPS)',
        playstyle: '극단적인 버스트 중심 - Momentum 윈도우 관리가 핵심',
        dpsProfile: {
          singleTarget: '110% (당시 전 클래스 최상위)',
          burstDPS: '극도로 높음 (Demonic + Momentum)',
          sustainedDPS: '중하위 (버스트 외 약함)'
        },
        note: '출시 당시 압도적 DPS로 논란 → 7.1 패치에서 20% 너프'
      },
      {
        expansion: 'Battle for Azeroth (8.0 - 8.3, 2018-2020)',
        patch: '8.0 GCD 변경으로 대격변',
        keyChanges: [
          '**GCD 추가**: 탈태 변신, 안광이 GCD에 추가 (반발 심함)',
          '**Momentum 너프**: 지속시간 4초 → 6초, 피해 증가 20% → 15%',
          '**Essence Break 추가**: 4초간 혼돈 피해 40% 증가 (새로운 필수 특성)',
          '**Demonic 삭제**: 안광 미니 탈태 효과 제거',
          '**Trail of Ruin**: 칼춤이 지속 피해 추가 (광역 강화)'
        ],
        meta: '단일 대상: A 티어 (중상위권으로 하락)',
        playstyle: 'Essence Break 버스트 윈도우 중심',
        dpsProfile: {
          singleTarget: '95% (중상위권)',
          burstDPS: '높음 (Essence Break 의존)',
          sustainedDPS: '중간'
        },
        note: 'GCD 변경으로 플레이 피감 저하 → 플레이어 이탈'
      },
      {
        expansion: 'Shadowlands (9.0 - 9.2.7, 2020-2022)',
        patch: '9.0 성약 시스템 도입',
        keyChanges: [
          '**성약 능력 (Sinful Brand, The Hunt, Elysian Decree)**: 빌드 다양성 증가',
          '**Kyrian (Elysian Decree)**: 광역 최강 성약',
          '**Venthyr (Sinful Brand)**: 단일 대상 최강 성약 (40% 피해 증가)',
          '**Cycle of Hatred**: 가속 증가 시 안광 쿨다운 감소 (Break Point 등장)',
          '**Glaive Tempest**: 광역 딜 강화 특성 추가'
        ],
        meta: '단일 대상: S 티어 (Venthyr), 광역: A 티어 (Kyrian)',
        playstyle: '성약 능력 중심 버스트 윈도우',
        dpsProfile: {
          singleTarget: '102% (Venthyr, 상위권)',
          burstDPS: '매우 높음 (Sinful Brand 40% 증가)',
          sustainedDPS: '중상위'
        },
        note: 'Venthyr Sinful Brand의 강력한 시너지로 최상위권 복귀'
      },
      {
        expansion: 'Dragonflight (10.0 - 10.2.7, 2022-2024)',
        patch: '10.0 특성 트리 개편',
        keyChanges: [
          '**특성 트리 시스템**: 클래스 + 전문화 특성 분리',
          '**Essence Break 선택형**: 더 이상 필수 아님 (Glaive Tempest 경쟁)',
          '**Chaos Theory**: 치명타 시 칼춤 쿨다운 2-3초 감소 (새로운 핵심)',
          '**Shattered Destiny**: 탈태 쿨다운 감소 (최대 60초 단축 가능)',
          '**Meta Fueled**: 안광 사용 시 탈태 지속시간 8초 증가'
        ],
        meta: '단일 대상: A 티어, 광역: S 티어',
        playstyle: 'Chaos Theory 기반 칼춤 쿨다운 관리',
        dpsProfile: {
          singleTarget: '98% (중상위권)',
          burstDPS: '높음',
          sustainedDPS: '높음 (Chaos Theory 시너지)',
          aoe: '매우 높음'
        },
        note: '특성 트리로 빌드 자유도 대폭 증가 → 플레이어 만족도 상승'
      },
      {
        expansion: 'The War Within (11.0 - 11.2, 2024-2025)',
        patch: '11.0 영웅 특성 도입 (현재)',
        keyChanges: [
          '**Aldrachi Reaver**: 파괴자 글레이브 중첩 메커니즘 (단일 특화)',
          '**Fel-Scarred**: 지옥상흔 버프 중첩 메커니즘 (광역/기동성)',
          '**티어 세트 (T32)**: 칼춤/죽음의 휩쓸기 피해 15% 증가 + 격노 40 생성',
          '**Demonsurge**: 탈태 중 특정 스킬 강화 (파괴자 전용)',
          '**Unbound Chaos**: 지옥 돌진 피해 500% 증가 (지옥상흔 전용)',
          '**Break Point 재정의**: 가속 15%, 치명 40%, 특화 35% 임계값'
        ],
        meta: '단일 대상: S 티어 (Aldrachi), 광역: S 티어 (Fel-Scarred)',
        playstyle: '영웅 특성별 차별화 - Aldrachi(버스트), Fel-Scarred(지속)',
        dpsProfile: {
          singleTarget: '100% (Aldrachi), 98% (Fel-Scarred)',
          burstDPS: '매우 높음 (Aldrachi), 높음 (Fel-Scarred)',
          sustainedDPS: '중간 (Aldrachi), 높음 (Fel-Scarred)',
          aoe: '높음 (Aldrachi), 매우 높음 (Fel-Scarred)'
        },
        note: '**역대 최고 밸런스** - 두 빌드 모두 S티어, 상황별 선택 가능'
      }
    ],

    keyEvolutions: {
      resourceSystem: {
        then: 'Legion: 격노 0-120, 생성/소모 단순',
        now: 'TWW: 격노 경제학 복잡화 (파괴자 투척 소모 등)',
        impact: '플레이 깊이 증가, 격노 관리 난이도 상승'
      },
      burstWindows: {
        then: 'Legion: Momentum 4초 윈도우 (극단적 버스트)',
        now: 'TWW: 탈태 30초 + 안광 16초 확장 (긴 버스트)',
        impact: '버스트 윈도우 2배 증가 → 실수 회복 시간 확보'
      },
      buildDiversity: {
        then: 'Legion~BfA: Momentum/Demonic 필수 (선택권 거의 없음)',
        now: 'TWW: Aldrachi vs Fel-Scarred + 특성 조합 (10+ 빌드 가능)',
        impact: '플레이 스타일 다양성 극대화'
      },
      aoePerformance: {
        then: 'Legion: 광역 약함 (Momentum 단일 대상 특화)',
        now: 'TWW: 광역 S티어 (Fel-Scarred 지옥 돌진 관통)',
        impact: '쐐기돌 환경에서 경쟁력 확보'
      },
      complexity: {
        then: 'Legion: 단순한 버스트 윈도우 관리 (난이도 6/10)',
        now: 'TWW: 중첩 관리 + 격노 경제 + 투척 타이밍 (난이도 8/10)',
        impact: '학습 곡선 상승하지만 숙련도에 따른 성능 차이 증가'
      }
    },

    conclusion: `파멸 악마사냥꾼은 **Legion 출시 당시의 압도적 DPS**에서
      **TWW 현재의 밸런스된 S티어 DPS**로 진화했습니다.
      과거에는 Momentum/Demonic 필수 특성으로 빌드 자유도가 낮았지만,
      현재는 **Aldrachi Reaver와 Fel-Scarred 두 가지 S티어 빌드**를 보유하여
      플레이어 선택권과 만족도가 역대 최고 수준입니다.

      특히 **TWW 11.2 패치**에서는 두 빌드가 각각 다른 상황에서 최강이라는 점에서,
      Blizzard의 밸런스 디자인이 성공적으로 평가됩니다.`
  }
};
