// 파멸 악마사냥꾼 게임 메커니즘 데이터
// TWW 시즌 3 (11.2 패치) 기준

export const havocMechanisms = {
  aldrachireaver: {
    mechanisms: [
      {
        title: '파괴자의 글레이브 (Reaver\'s Glaive)',
        importance: 'critical',
        description: `탈태 변신 중 혼돈 일격 또는 안광 적중 시 <strong>6초간 피해 12% 증가</strong> 버프 획득.
          최대 3중첩 (36% 피해 증가)까지 가능하며, 각 중첩은 <strong>독립적인 12초 지속시간</strong>을 가집니다.
          알드라치 파괴자 빌드의 핵심 메커니즘으로, 탈태 변신 버스트 윈도우에서 DPS를 극대화합니다.
          <strong>Thrill of the Fight</strong> 버프와 상호작용하며, <strong>영혼 파편 RNG</strong>에 따라 추가 충전을 얻을 수 있습니다.
          <strong>⚠️ AoE 주의:</strong> 광역 상황에서는 <strong>파괴자의 글레이브 → 혼돈 일격 → 칼춤 순서를 반드시 준수</strong>해야 합니다.`,
        skills: ['eyebeam', 'chaosstrike', 'metamorphosis', 'annihilation'],
        details: [
          '<strong>중첩 생성</strong>: 탈태 변신 중 혼돈 일격/소멸 또는 안광 적중 시',
          '<strong>지속시간</strong>: 각 중첩당 12초 독립 지속',
          '<strong>최대 중첩</strong>: 3중첩 (36% 피해 증가)',
          '<strong>버프 유지</strong>: 탈태 종료 후에도 12초간 유지 가능',
          '<strong>Thrill of the Fight 상호작용</strong>: Thrill of the Fight 버프가 3초 이상 남았거나 Glaive Flurry/Rending Strike 사용 전에는 파괴자의 글레이브 사용 보류',
          '<strong>영혼 파편 RNG</strong>: 영혼 파편 생성 RNG에 따라 오프너 중 파괴자의 글레이브를 2회 사용할 수 있음 (추가 충전 가능)',
          '<strong>⚠️ AoE 강제 순서</strong>: 광역 상황에서는 파괴자의 글레이브 → 혼돈 일격 → 칼춤/죽음의 칼춤 순서 필수 (칼춤 먼저 사용 시 DPS 손실)',
          '<strong>최적화</strong>: 탈태 시작 시 안광 즉시 사용하여 빠른 3중첩 달성'
        ]
      },
      {
        title: '메타 특성 (Meta Fueled)',
        importance: 'high',
        description: `<strong>안광 (Eye Beam)</strong> 사용 시 <strong>탈태 변신 지속시간 8초 증가</strong> 효과를 제공합니다.
          이를 통해 30초 기본 지속시간을 최대 46초까지 연장할 수 있어,
          버스트 윈도우를 극대화하고 파괴자의 글레이브 중첩을 더 오래 유지할 수 있습니다.`,
        skills: ['eyebeam', 'metamorphosis'],
        details: [
          '<strong>기본 지속시간</strong>: 탈태 변신 30초',
          '<strong>안광 사용 시</strong>: +8초 연장 (총 38초)',
          '<strong>안광 2회 사용</strong>: +16초 연장 (총 46초 가능)',
          '<strong>전략</strong>: 탈태 직후 안광 사용 → 30초 후 재사용 → 총 46초 버스트',
          '<strong>격노 효율</strong>: 긴 탈태 지속시간 = 더 많은 소멸 사용 기회'
        ]
      },
      {
        title: '격노 시스템',
        importance: 'critical',
        description: `파멸 악마사냥꾼의 주 자원으로, <strong>0-120 격노</strong> 범위를 사용합니다.
          <strong>전투 중 자연 회복이 없어</strong> 생성 스킬과 소모 스킬의 균형이 매우 중요합니다.
          탈태 변신 시 <strong>최대 격노 +20</strong> 보너스를 받아 총 120 격노를 사용할 수 있습니다.`,
        skills: ['demonsbite', 'immolationaura', 'felrush', 'chaosstrike', 'bladedance', 'eyebeam'],
        details: [
          '<strong>최대 격노</strong>: 120 (탈태 변신 중 140)',
          '<strong>자연 회복</strong>: 없음 (생성 스킬 필수)',
          '<strong>주요 생성</strong>: 악마의 이빨 (20-30), 화염 감옥 (지속), 지옥 돌진 (15)',
          '<strong>주요 소모</strong>: 혼돈 일격 (40), 칼춤 (35), 안광 (30)',
          '<strong>목표</strong>: 80+ 격노 유지하여 버스트 윈도우 대비',
          '<strong>탈태 전</strong>: 100+ 격노 확보하여 즉시 소멸 연속 사용'
        ]
      },
      {
        title: '탈태 변신 강화 효과',
        importance: 'critical',
        description: `<strong>탈태 변신 (Metamorphosis)</strong>은 30초 동안 악마사냥꾼을 강화된 형태로 변신시킵니다.
          <strong>최대 체력 증가</strong>, <strong>격노 +20</strong>, <strong>스킬 강화</strong>, <strong>화염 감옥 초기화</strong> 등
          다양한 버프를 제공하여 폭발적인 버스트 윈도우를 가능하게 합니다.`,
        skills: ['metamorphosis', 'annihilation', 'deathsweep', 'immolationaura'],
        details: [
          '<strong>지속시간</strong>: 30초 (메타 특성으로 최대 46초)',
          '<strong>최대 격노</strong>: +20 (100 → 120)',
          '<strong>체력 증가</strong>: 최대 체력 대폭 증가',
          '<strong>혼돈 일격 → 소멸</strong>: 강화된 버전, 동일 격노 소모',
          '<strong>칼춤 → 죽음의 칼춤</strong>: 강화된 버전, 동일 격노 소모',
          '<strong>화염 감옥 초기화</strong>: 재사용 대기시간 즉시 초기화'
        ]
      },
      {
        title: '혼돈 일격 → 소멸 변환',
        importance: 'high',
        description: `탈태 변신 중 <strong>혼돈 일격 (Chaos Strike)</strong>이 <strong>소멸 (Annihilation)</strong>로 자동 변환됩니다.
          소멸은 혼돈 일격의 강화 버전으로 <strong>더 높은 피해</strong>를 입히며,
          파괴자의 글레이브 중첩을 생성하는 핵심 스킬입니다.`,
        skills: ['chaosstrike', 'annihilation', 'metamorphosis'],
        details: [
          '<strong>격노 소모</strong>: 동일 (40 격노)',
          '<strong>피해 증가</strong>: 소멸이 혼돈 일격보다 약 20% 높은 피해',
          '<strong>재사용 대기시간</strong>: 없음 (격노만 있으면 연속 사용)',
          '<strong>파괴자의 글레이브</strong>: 적중 시 피해 12% 증가 중첩 생성',
          '<strong>최적화</strong>: 탈태 중 소멸을 최대한 많이 사용하여 DPS 극대화'
        ]
      },
      {
        title: '칼춤 → 죽음의 칼춤 변환',
        importance: 'medium',
        description: `탈태 변신 중 <strong>칼춤 (Blade Dance)</strong>이 <strong>죽음의 칼춤 (Death Sweep)</strong>으로 자동 변환됩니다.
          죽음의 칼춤은 칼춤의 강화 버전으로 <strong>더 넓은 범위</strong>와 <strong>높은 피해</strong>를 제공하여
          광역 상황에서 더욱 효과적입니다.`,
        skills: ['bladedance', 'deathsweep', 'metamorphosis'],
        details: [
          '<strong>격노 소모</strong>: 동일 (35 격노)',
          '<strong>피해 증가</strong>: 죽음의 칼춤이 칼춤보다 약 25% 높은 피해',
          '<strong>최대 타겟</strong>: 5명 (칼춤과 동일)',
          '<strong>재사용 대기시간</strong>: 15초 (칼춤과 동일)',
          '<strong>광역 효율</strong>: 3+ 대상 시 소멸보다 우선순위 높음'
        ]
      },
      {
        title: '화염 감옥 지속 생성',
        importance: 'high',
        description: `<strong>화염 감옥 (Immolation Aura)</strong>은 15초 동안 <strong>지속적으로 격노를 생성</strong>하는 핵심 버프입니다.
          <strong>1초당 격노 3-5</strong>를 생성하며, 주위 적에게 광역 피해를 입힙니다.
          탈태 변신 사용 시 <strong>재사용 대기시간이 즉시 초기화</strong>되어 연속 사용이 가능합니다.`,
        skills: ['immolationaura', 'metamorphosis'],
        details: [
          '<strong>지속시간</strong>: 15초',
          '<strong>격노 생성</strong>: 1초당 3-5 (총 45-75 격노)',
          '<strong>재사용 대기시간</strong>: 1분',
          '<strong>광역 피해</strong>: 8야드 범위 지속 피해',
          '<strong>탈태 변신 시</strong>: 재사용 대기시간 즉시 초기화',
          '<strong>전략</strong>: 항상 재사용 대기시간마다 사용, 탈태 직후 재사용'
        ]
      },
      {
        title: 'Initiative 윈도우 동기화',
        importance: 'high',
        description: `<strong>Initiative</strong> 특성을 선택한 경우, <strong>복수의 후퇴 (Vengeful Retreat)</strong> 사용 시
          <strong>6초간 피해 10% 증가</strong> 버프를 획득합니다. 이 버프를 <strong>안광 (Eye Beam) 윈도우와 동기화</strong>하여
          버스트 DPS를 극대화하는 것이 핵심 전략입니다. No-Mover 빌드에서는 전투 시작 전 Initiative 체크가 필수입니다.`,
        skills: ['vengefulretreat', 'eyebeam', 'immolationaura'],
        details: [
          '<strong>Initiative 버프</strong>: 6초간 피해 10% 증가',
          '<strong>복수의 후퇴 재사용</strong>: 20초',
          '<strong>안광 재사용</strong>: 30초 (메타 특성 미선택 시)',
          '<strong>동기화 전략</strong>: 안광 사용 직전 복수의 후퇴 사용하여 Initiative 버프 획득',
          '<strong>No-Mover 빌드</strong>: 전투 시작 전 반드시 Initiative 특성 활성화 체크',
          '<strong>Exergy 특성 선택 시</strong>: 복수의 후퇴를 재사용 대기시간마다 사용 가능 (The Hunt가 추가 uptime 제공하여 100% 유지 용이)',
          '<strong>전략</strong>: 안광 윈도우에 맞춰 복수의 후퇴 사용하여 6초 버스트 극대화'
        ]
      }
    ]
  },
  felscarred: {
    mechanisms: [
      {
        title: '지옥상흔 중첩 시스템',
        importance: 'critical',
        description: `<strong>지옥 격노 (Fel Devastation)</strong> 사용 시 <strong>15초간 피해 2% 증가</strong> 버프를 획득합니다.
          최대 5중첩 (10% 피해 증가)까지 가능하며, 각 중첩은 <strong>독립적인 15초 지속시간</strong>을 가집니다.
          지옥상흔 빌드의 핵심 메커니즘으로, 지속적인 중첩 유지가 DPS의 핵심입니다.`,
        skills: ['felrush', 'chaosstrike', 'eyebeam', 'bladedance'],
        details: [
          '<strong>중첩 생성</strong>: 지옥 격노 (지옥 돌진) 사용 시',
          '<strong>지속시간</strong>: 각 중첩당 15초 독립 지속',
          '<strong>최대 중첩</strong>: 5중첩 (10% 피해 증가)',
          '<strong>획득 조건</strong>: 지옥 돌진 적중 시 중첩 +1',
          '<strong>최적화</strong>: 전투 초반 30초 내 5중첩 달성 목표'
        ]
      },
      {
        title: '지옥 돌진 다중 역할',
        importance: 'critical',
        description: `지옥상흔 빌드에서 <strong>지옥 돌진 (Fel Rush)</strong>은 단순한 이동기가 아닌 핵심 DPS 스킬입니다.
          <strong>격노 15 생성</strong>, <strong>지옥상흔 중첩 획득</strong>, <strong>광역 피해</strong> 3가지 역할을 동시에 수행하여
          알드라치 파괴자 대비 더 공격적이고 기동적인 플레이를 가능하게 합니다.`,
        skills: ['felrush'],
        details: [
          '<strong>격노 생성</strong>: 15 격노 (악마의 이빨과 동일 효율)',
          '<strong>지옥상흔 중첩</strong>: 적중 시 +1 중첩',
          '<strong>광역 피해</strong>: 경로상 모든 적에게 피해',
          '<strong>충전 횟수</strong>: 2회 (10초마다 1회 충전)',
          '<strong>이동 거리</strong>: 20야드 전방 돌진',
          '<strong>전략</strong>: 빈번히 사용하여 격노 생성 + 중첩 유지 동시 달성'
        ]
      },
      {
        title: '격노 시스템 (지옥상흔)',
        importance: 'critical',
        description: `파멸 악마사냥꾼의 주 자원으로, 지옥상흔 빌드는 <strong>지옥 돌진의 격노 생성</strong>을
          적극 활용하여 더 빠른 격노 순환을 달성합니다. 알드라치 파괴자보다 <strong>격노 생성 속도가 빠르나</strong>
          중첩 유지를 위해 지옥 돌진을 자주 사용해야 하므로 <strong>더 공격적인 자원 관리</strong>가 필요합니다.`,
        skills: ['demonsbite', 'immolationaura', 'felrush', 'chaosstrike', 'bladedance', 'eyebeam'],
        details: [
          '<strong>최대 격노</strong>: 120 (탈태 변신 중 140)',
          '<strong>자연 회복</strong>: 없음',
          '<strong>주요 생성</strong>: 지옥 돌진 (15) + 악마의 이빨 (20-30) + 화염 감옥 (지속)',
          '<strong>주요 소모</strong>: 혼돈 일격 (40), 칼춤 (35), 안광 (30)',
          '<strong>차이점</strong>: 지옥 돌진을 자주 사용하여 알드라치보다 격노 생성 빠름',
          '<strong>목표</strong>: 80+ 격노 유지 + 지옥상흔 5중첩 동시 유지'
        ]
      },
      {
        title: '탈태 변신 강화 효과',
        importance: 'critical',
        description: `<strong>탈태 변신 (Metamorphosis)</strong>은 지옥상흔 빌드에서도 주요 버스트 쿨다운입니다.
          알드라치 파괴자와 동일한 강화 효과를 받으나, <strong>지옥상흔 5중첩 + 지옥 돌진 빈번 사용</strong>을
          통해 더욱 폭발적인 버스트를 달성할 수 있습니다. <strong>⚠️ 중요:</strong> 오프너 중 첫 번째 안광 후
          소멸을 사용하지 않고 바로 탈태 변신을 사용하면 <strong>악마 쇄도 (Demonsurge)를 잃게 되므로 반드시 회피</strong>해야 합니다.`,
        skills: ['metamorphosis', 'annihilation', 'deathsweep', 'felrush', 'immolationaura'],
        details: [
          '<strong>지속시간</strong>: 30초 (메타 특성으로 최대 46초)',
          '<strong>최대 격노</strong>: +20 (100 → 120)',
          '<strong>체력 증가</strong>: 최대 체력 대폭 증가',
          '<strong>소멸 연속 사용</strong>: 지옥 돌진으로 격노 빠르게 재생성',
          '<strong>지옥상흔 유지</strong>: 탈태 중에도 지옥 돌진으로 중첩 유지',
          '<strong>⚠️ 악마 쇄도 손실 방지</strong>: 오프너 중 첫 번째 안광 → 소멸 → 탈태 변신 순서 준수 필수 (소멸 누락 시 악마 쇄도 손실)',
          '<strong>전략</strong>: 5중첩 달성 후 탈태 사용하여 최대 버스트'
        ]
      },
      {
        title: '광역 피해 시너지',
        importance: 'high',
        description: `지옥상흔 빌드는 <strong>지옥 돌진의 광역 피해</strong> 덕분에 알드라치 파괴자보다
          광역 상황에서 더 강력합니다. <strong>2+ 대상</strong>부터 광역 우선순위로 전환하며,
          지옥 돌진으로 적 무리를 관통하며 동시에 격노 생성 + 지옥상흔 중첩 + 광역 피해를 달성합니다.`,
        skills: ['felrush', 'eyebeam', 'bladedance', 'deathsweep', 'immolationaura'],
        details: [
          '<strong>지옥 돌진</strong>: 경로상 모든 적 피해 + 격노 15 + 중첩 +1',
          '<strong>안광</strong>: 모든 적 관통 최고 광역 딜',
          '<strong>칼춤/죽음의 칼춤</strong>: 최대 5명 동시 타격',
          '<strong>화염 감옥</strong>: 8야드 지속 광역 피해',
          '<strong>3+ 대상</strong>: 안광 → 칼춤 → 지옥 돌진 우선순위',
          '<strong>5+ 대상</strong>: 칼춤만 연속 사용하여 광역 극대화'
        ]
      },
      {
        title: '기동성과 DPS의 균형',
        importance: 'medium',
        description: `지옥상흔 빌드는 지옥 돌진을 <strong>이동기가 아닌 DPS 스킬</strong>로 사용해야 하므로,
          알드라치 파괴자보다 <strong>기동성이 제한적</strong>입니다. 하지만 복수의 후퇴와 조합하면
          여전히 높은 기동성을 유지할 수 있습니다.`,
        skills: ['felrush', 'vengefulretreat', 'glide'],
        details: [
          '<strong>지옥 돌진</strong>: DPS 우선 사용 → 이동 목적으로 아끼지 말 것',
          '<strong>복수의 후퇴</strong>: 후방 도약 25야드 → 위험 회피 전용',
          '<strong>활공</strong>: 낙하 중 활성화 → 수직 이동 시 활용',
          '<strong>전략</strong>: 지옥 돌진 2회 충전 중 1회는 항상 확보',
          '<strong>긴급 이동</strong>: 복수의 후퇴 → 즉시 지옥 돌진으로 복귀',
          '<strong>주의</strong>: 지옥 돌진을 이동만을 위해 사용하지 말 것'
        ]
      },
      {
        title: '화염 감옥/섭렵의 불길 하드캡 시스템',
        importance: 'high',
        description: `<strong>화염 감옥 (Immolation Aura)</strong>은 동시에 최대 <strong>5개의 Spell ID</strong>까지만 활성화 가능하며,
          탈태 변신 중 강화 버전인 <strong>섭렵의 불길 (Consuming Fire)</strong>은 <strong>4개까지</strong> 제한됩니다.
          <strong>A Fire Inside</strong> 특성으로 proc이 자주 발생하는 경우, 하드캡을 초과하지 않도록 주의해야 합니다.
          하드캡 초과 시 추가 사용이 낭비되므로 <strong>연속 5회 이상 사용 금지</strong>가 필수입니다.`,
        skills: ['immolationaura', 'metamorphosis'],
        details: [
          '<strong>화염 감옥 하드캡</strong>: 최대 5개 Spell ID 동시 활성화',
          '<strong>섭렵의 불길 하드캡</strong>: 최대 4개 Spell ID 동시 활성화 (탈태 변신 중)',
          '<strong>A Fire Inside proc</strong>: 높은 proc 확률로 빠른 충전 → 하드캡 주의',
          '<strong>연속 사용 제한</strong>: 화염 감옥/섭렵의 불길을 연속 5회 이상 사용 금지 (하드캡 초과 방지)',
          '<strong>오프너 최적화</strong>: 오프너 중 화염 감옥 5회 사용 후 중단 (추가 사용 시 낭비)',
          '<strong>탈태 중 주의</strong>: 섭렵의 불길 4회 사용 후 1충전 남기기 (하드캡 방지)',
          '<strong>전략</strong>: A Fire Inside proc 시 현재 활성 화염 감옥 개수 확인 후 사용 여부 결정'
        ]
      },
      {
        title: 'Screaming Brutality AoE 자동화',
        importance: 'medium',
        description: `<strong>Screaming Brutality</strong> 특성을 선택한 AoE 빌드에서는
          <strong>불타는 상처 (Burning Wound)</strong> 디버프가 자동으로 적용되어 관리 부담이 대폭 줄어듭니다.
          이로 인해 광역 상황에서 칼춤을 더 자유롭게 사용할 수 있으며, 단일 대상과 달리 불타는 상처 유지를 위한
          추가 조작이 불필요합니다. 오프너 중 <strong>칼춤 조기 사용</strong>도 이 자동화 덕분에 가능합니다.`,
        skills: ['bladedance', 'deathsweep'],
        details: [
          '<strong>Screaming Brutality 효과</strong>: AoE 빌드에서 불타는 상처 자동 적용',
          '<strong>관리 부담 제거</strong>: 단일 대상과 달리 불타는 상처 유지 조작 불필요',
          '<strong>칼춤 자유도 증가</strong>: 디버프 걱정 없이 칼춤/죽음의 칼춤 연속 사용 가능',
          '<strong>오프너 최적화</strong>: 오프너 초반에 칼춤을 즉시 사용하여 광역 피해 시작 (불타는 상처 자동 적용)',
          '<strong>AoE 우선순위</strong>: 3+ 대상 시 칼춤/죽음의 칼춤 우선순위 상승',
          '<strong>전략</strong>: Screaming Brutality 선택 시 단일 대상 메커니즘과 다른 우선순위 사용'
        ]
      }
    ]
  }
};
