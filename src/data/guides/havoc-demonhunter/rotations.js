// 파멸 악마사냥꾼 로테이션 데이터
// TWW 시즌 3 (11.2 패치) 기준

export const havocRotations = {
  // 티어 세트 효과 (TWW 시즌 3)
  tierSet: {
    '2set': {
      name: '순간의 혼돈',
      description: `<strong>칼춤</strong>과 <strong>죽음의 칼춤</strong>의 피해가 <strong>15% 증가</strong>하고,
        사용 시 <strong>40격노</strong>를 생성합니다. 이는 일반적으로 약 <strong>15-20격노</strong>만 생성하는 것에 비해
        큰 격노 생성 버프입니다.`
    },
    '4set': {
      name: '영혼 분열의 지옥불',
      description: `<strong>영혼 분열</strong> 사용 후 <strong>10초 동안</strong> 다음 스킬들의 피해가 증가합니다:
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li><strong>안광 (Eye Beam)</strong>: 40% 증가</li>
          <li><strong>지옥 돌진 (Fel Rush)</strong>: 40% 증가</li>
          <li><strong>투척 (Throw Glaive)</strong>: 40% 증가</li>
          <li><strong>글레이브 투척 (Glaive Tempest)</strong>: 40% 증가</li>
        </ul>
        영혼 분열을 반드시 <strong>안광 직전</strong> 또는 <strong>버스트 윈도우 시작 시</strong>에 사용하세요.`
    }
  },

  // 알드라치 파괴자 (Aldrachi Reaver)
  aldrachireaver: {
    playstyle: {
      preparation: `
        <h4 style="color: #ffa500; margin-bottom: 15px;">전투 준비 (Pre-pull)</h4>
        <p><strong>탈태 변신 전 격노 관리</strong>가 핵심입니다. 이상적으로는 <strong>80-100 격노</strong>를 확보한 상태에서 전투를 시작하세요.</p>
        <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>복수의 후퇴</strong>: 전투 시작 직전 사용하여 격노 20 생성</li>
          <li><strong>화염 분출</strong>: 쿨다운 확인 (탈태 변신 중 재사용 대기시간 초기화됨)</li>
          <li><strong>안광</strong>: 쿨다운 확인 (탈태 변신 첫 GCD에 사용할 예정)</li>
          <li><strong>보스 타이머</strong>: Pull 10초 전부터 준비 시작</li>
        </ul>
      `,
      burst: `
        <h4 style="color: #ffa500; margin-bottom: 15px;">버스트 페이즈 (Metamorphosis 윈도우)</h4>
        <p><strong>탈태 변신 (Metamorphosis)</strong>은 <strong>4분 쿨다운 (240초)</strong>으로, <strong>30초 동안</strong> 다음 효과를 제공합니다:</p>
        <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>최대 격노 +20</strong> 획득 (즉시)</li>
          <li><strong>급속 25% 증가</strong> (공격 속도, GCD 감소)</li>
          <li><strong>최대 생명력 50% 증가</strong> (생존력 향상)</li>
          <li><strong>안광 쿨다운 초기화</strong> (즉시 사용 가능)</li>
          <li><strong>이동 속도 30% 증가</strong> (기동력)</li>
        </ul>

        <h5 style="color: #66bb6a; margin: 20px 0 10px 0;">탈태 변신 활성화 순간</h5>
        <ol style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>탈태 변신 사용</strong> → 즉시 최대 격노 +20 획득</li>
          <li><strong>안광 (Eye Beam)</strong> → 파괴자의 글레이브 중첩 생성 시작</li>
          <li><strong>죽음의 휩쓸기 (Death Sweep)</strong> → 탈태 중 칼춤 강화판</li>
          <li><strong>소멸 (Annihilation)</strong> → 탈태 중 혼돈 일격 강화판</li>
          <li><strong>격노 소모</strong> → 소멸/죽음의 휩쓸기로 격노를 빠르게 소비</li>
        </ol>

        <h5 style="color: #66bb6a; margin: 20px 0 10px 0;">파괴자의 글레이브 극대화</h5>
        <p><strong>파괴자의 글레이브 (Reaver's Glaive)</strong>는 탈태 변신 중 <strong>소멸 또는 안광 적중 시</strong> 중첩을 생성하며, 최대 <strong>3중첩 (36% 피해 증가)</strong>까지 쌓입니다.</p>
        <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>중첩 생성</strong>: 소멸 또는 안광 적중 시 1중첩 생성 (중첩당 12% 피해 증가)</li>
          <li><strong>지속시간</strong>: 각 중첩당 12초 독립 지속 (탈태 종료 후에도 유지)</li>
          <li><strong>효과</strong>: 투척 피해 증가 + 투척 시 격노 5 생성</li>
          <li><strong>목표</strong>: 탈태 변신 종료 전 <strong>3중첩 달성 (36% 피해 증가)</strong></li>
        </ul>

        <h5 style="color: #66bb6a; margin: 20px 0 10px 0;">탈태 변신 종료 전 체크리스트</h5>
        <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>파괴자의 글레이브 3중첩</strong> 달성 확인</li>
          <li><strong>화염 분출 재사용 대기시간 초기화</strong> 활용 (탈태 직전 사용 금지)</li>
          <li><strong>격노 80-100 유지</strong> (탈태 종료 후 즉시 혼돈 일격 가능하도록)</li>
          <li><strong>안광 쿨다운</strong> 다시 준비되면 탈태 종료 직전 한 번 더 사용</li>
        </ul>
      `,
      sustain: `
        <h4 style="color: #ffa500; margin-bottom: 15px;">유지 페이즈 (탈태 변신 쿨다운 중)</h4>
        <p>탈태 변신 쿨다운 중에는 <strong>격노 80-100 스위트 스팟</strong>을 유지하면서 다음 탈태 변신을 준비합니다.</p>

        <h5 style="color: #66bb6a; margin: 20px 0 10px 0;">격노 관리 (80-100 범위 유지)</h5>
        <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>80 미만</strong>: 생성 스킬 우선 (악마의 이빨, 지옥 돌진, 화염 분출)</li>
          <li><strong>80-100</strong>: 이상적인 범위, 균형 유지</li>
          <li><strong>100-120</strong>: 소모 스킬 우선 (혼돈 일격, 칼춤)</li>
          <li><strong>120 도달</strong>: 추가 격노 생성 낭비, 즉시 소모</li>
        </ul>

        <h5 style="color: #66bb6a; margin: 20px 0 10px 0;">파괴자의 글레이브 중첩 유지</h5>
        <p>탈태 변신 종료 시 쌓아둔 <strong>3중첩 (36% 피해 증가)</strong>을 최대한 오래 유지하세요.</p>
        <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>투척 (Throw Glaive)</strong>: 중첩 소모 시 격노 5 생성 + 강화된 피해</li>
          <li><strong>중첩 지속시간</strong>: 각 중첩당 12초, 순차적으로 만료됨</li>
          <li><strong>중첩 관리</strong>: 3중첩 이하로 떨어지기 전 투척 사용</li>
          <li><strong>다음 탈태 준비</strong>: 탈태 변신 1분 전부터 중첩 소모 자제</li>
        </ul>

        <h5 style="color: #66bb6a; margin: 20px 0 10px 0;">안광 (Eye Beam) 쿨다운 관리</h5>
        <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>쿨다운마다 사용</strong>: 40-50초 쿨다운, 탈태와 무관하게 사용</li>
          <li><strong>격노 30 이상</strong> 확보 후 사용 (충분한 피해 보장)</li>
          <li><strong>탈태 변신 15초 전</strong>: 안광 사용 자제 (탈태 중 사용 우선)</li>
          <li><strong>이동 메커니즘 타이밍</strong>: 2초 채널링 중 이동 불가 주의</li>
        </ul>
      `,
      scenarios: `
        <h4 style="color: #ffa500; margin-bottom: 15px;">실전 시나리오</h4>

        <h5 style="color: #66bb6a; margin: 20px 0 10px 0;">시나리오 1: 블러드러스트 타이밍</h5>
        <p><strong>레이드/쐐기돌</strong>에서 블러드러스트는 보통 <strong>전투 시작</strong> 또는 <strong>30% 체력 이하</strong>에 사용됩니다.</p>
        <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>시작 블러드러스트</strong>: 오프너 탈태 변신과 동기화 (최대 효율)</li>
          <li><strong>30% 블러드러스트</strong>: 탈태 변신 쿨다운 확인 후 동기화</li>
          <li><strong>쿨다운 불일치 시</strong>: 블러드러스트에 맞춰 탈태 지연 (10-15초 허용)</li>
        </ul>

        <h5 style="color: #66bb6a; margin: 20px 0 10px 0;">시나리오 2: 보스 메커니즘 대응</h5>
        <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>이동 메커니즘</strong>: 지옥 돌진 (2회 충전) 활용, 안광은 이동 중 중단됨</li>
          <li><strong>광역 피해</strong>: 흐림 (1분 쿨) 또는 어둠 (3분 쿨) 사용</li>
          <li><strong>보스 무적 페이즈</strong>: 탈태 변신 지연, 쫄 처리 시 안광/칼춤 활용</li>
          <li><strong>DPS 체크</strong>: 탈태 변신 + 블러드러스트 동기화 필수</li>
        </ul>

        <h5 style="color: #66bb6a; margin: 20px 0 10px 0;">시나리오 3: 쐐기돌 풀링 최적화</h5>
        <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>작은 풀 (2-4마리)</strong>: 단일 대상 우선순위 유지, 안광만 사용</li>
          <li><strong>중간 풀 (5-7마리)</strong>: 안광 → 칼춤 → 혼돈 일격 순서</li>
          <li><strong>큰 풀 (8+마리)</strong>: 안광 → 칼춤 연속, 혼돈 일격 생략</li>
          <li><strong>보스 + 쫄</strong>: 보스 우선 타겟, 광역 스킬로 쫄 동시 정리</li>
          <li><strong>탈태 변신 타이밍</strong>: 보스 또는 큰 풀(8+)에만 사용</li>
        </ul>

        <h5 style="color: #66bb6a; margin: 20px 0 10px 0;">시나리오 4: 격노 낭비 방지</h5>
        <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>문제</strong>: 120 격노 도달 시 추가 생성 모두 낭비</li>
          <li><strong>해결책</strong>: 100 격노 이상 시 혼돈 일격/칼춤 우선 사용</li>
          <li><strong>생성 스킬 대기</strong>: 격노 100 이상일 때 악마의 이빨 사용 자제</li>
          <li><strong>화염 분출 타이밍</strong>: 격노 80 이하일 때 사용 (15초 지속)</li>
        </ul>
      `
    },
    singleTarget: {
      opener: [
        'vengefulretreat',
        'immolationaura',
        'eyebeam',
        'metamorphosis',
        'deathsweep',
        'annihilation',
        'bladedance',
        'chaosstrike',
        'felrush',
        'throwglaive',
        'demonsbite'
      ],
      priority: [
        {
          skill: 'eyebeam',
          condition: '쿨다운 완료 + 격노 30 이상',
          priority: 0,
          why: '가장 강력한 딜 쿨다운 - 준비되면 즉시 사용',
          simulationEvidence: 'SimC APL default Line 26-27: eye_beam,if=!talent.essence_break&(...) | eye_beam,if=talent.essence_break&(...)',
          mathematicalModel: {
            formula: '안광 총 피해 = 기본 피해 × (1 + 격노/30 × 0.15) × 탈태 배율(1.4)',
            example: '격노 90, 탈태 중: 기본 피해 × 1.45 × 1.4 = 2.03배',
            furyCost: '격노 소모 없음 (30 이상 시 피해 15% 증가)',
            reaverStacks: '탈태 중 사용 시 파괴자의 글레이브 1-3중첩 생성 (타격 수에 비례)'
          }
        },
        {
          skill: 'metamorphosis',
          condition: '쿨다운 완료',
          priority: 1,
          why: '탈태 변신으로 최대 격노 +20, 안광 재사용 대기시간 초기화',
          simulationEvidence: 'SimC APL cooldown Line 1: metamorphosis,if=(!talent.initiative|cooldown.vengeful_retreat.remains)&(...)',
          mathematicalModel: {
            formula: '탈태 윈도우 DPS 증가 = (공속 1.25배) × (안광 2회) × (소멸 강화) × 30초',
            example: '탈태 30초: 기본 DPS × 1.25 + 안광 2회 + 파괴자 3중첩 (36% 증가) = ~2.5배 DPS',
            furyGain: '+20 최대 격노 (120 → 140)',
            cooldownReset: '안광 쿨다운 즉시 초기화 + 화염 분출 쿨다운 리셋'
          }
        },
        {
          skill: 'annihilation',
          condition: '탈태 중 + 격노 40 이상',
          priority: 2,
          why: '탈태 중에는 혼돈의 일격 대신 파멸 사용 (더 강력함)',
          simulationEvidence: 'SimC APL meta Line 2: annihilation,if=buff.metamorphosis.remains<gcd.max',
          mathematicalModel: {
            formula: '소멸 DPS per Fury = 혼돈 일격 × 1.5 (탈태 강화) × (1 + 파괴자 중첩 × 0.12)',
            example: '격노 40 소모, 파괴자 3중첩: 혼돈 일격 × 1.5 × 1.36 = 2.04배',
            furyEfficiency: '격노당 DPS: 소멸 > 혼돈 일격 × 1.5 (탈태 중에만)',
            reaverStacks: '적중 시 파괴자의 글레이브 1중첩 생성 (최대 3중첩, 탈태 중)'
          }
        },
        {
          skill: 'deathsweep',
          condition: '탈태 중 + 격노 25 이상',
          priority: 3,
          why: '탈태 중에는 칼춤 대신 죽음의 휩쓸기 사용',
          simulationEvidence: 'SimC APL meta Line 1: death_sweep,if=buff.metamorphosis.remains<gcd.max',
          mathematicalModel: {
            formula: '죽음의 휩쓸기 피해 = 칼춤 × 1.5 × 적 수 (최대 5)',
            example: '5명 타격: 칼춤 × 1.5 × 5 = 7.5배 (단일 대비)',
            furyEfficiency: '격노 25 소모, AoE 계수 100%',
            tierBonus: 'T32 2세트: 피해 15% 증가 + 격노 40 생성'
          }
        },
        {
          skill: 'chaosstrike',
          condition: '격노 40 이상',
          priority: 4,
          why: '주요 격노 소모 스킬 - 격노가 넘치지 않게 관리',
          simulationEvidence: 'SimC APL default Line 32: chaos_strike,if=debuff.essence_break.up',
          mathematicalModel: {
            formula: '혼돈 일격 DPS per Fury = 기본 피해 / 격노 40',
            example: '격노 100 → 40 소모: 격노 효율 100% (낭비 방지)',
            furyEconomy: '격노 80-100 유지 시 DPS 극대화 (낭비 0%)',
            critBonus: '치명타 시 격노 20 환불 (40% 확률 with 특성)'
          }
        },
        {
          skill: 'bladedance',
          condition: '쿨다운 완료 + 격노 25 이상',
          priority: 5,
          why: '쿨다운마다 사용하여 딜 극대화',
          simulationEvidence: 'SimC APL default Line 28: blade_dance,if=cooldown.eye_beam.remains>gcd.max|cooldown.eye_beam.up',
          mathematicalModel: {
            formula: '칼춤 총 피해 = 기본 피해 × 적 수 (최대 5) × T32 2세트 (1.15)',
            example: '5명 타격 + 티어: 기본 × 5 × 1.15 = 5.75배',
            cooldown: '9초 쿨다운 (가속 영향)',
            tierBonus: 'T32 2세트: 피해 15% 증가 + 격노 40 생성 (net cost: -15)'
          }
        },
        {
          skill: 'throwglaive',
          condition: '파괴자의 글레이브 버프',
          priority: 6,
          why: '파괴자의 글레이브 버프 소모 - 격노 생성 및 추가 피해',
          simulationEvidence: 'SimC APL default Line 33: throw_glaive,if=full_recharge_time<=cooldown.blade_dance.remains&(...)',
          mathematicalModel: {
            formula: '투척 피해 = 기본 × (1 + 파괴자 중첩 × 0.12) + 격노 5 생성',
            example: '파괴자 3중첩 소모: 기본 × 1.36 + 격노 15 생성 (3중첩 × 5)',
            stackManagement: '3중첩 유지 후 투척하여 격노 생성 극대화',
            duration: '각 중첩 12초 독립 지속 (순차 만료)'
          }
        },
        {
          skill: 'felrush',
          condition: '쿨다운 완료',
          priority: 7,
          why: '기동력 + 격노 15 생성',
          simulationEvidence: 'SimC APL default Line 7: fel_rush,if=buff.unbound_chaos.up&buff.unbound_chaos.remains<gcd.max*2',
          mathematicalModel: {
            formula: '지옥 돌진 = 이동 피해 + 격노 15 × 충전 수 (최대 2)',
            example: '2회 충전: 격노 30 생성 + 이동 20야드 × 2',
            charges: '2회 충전, 쿨다운 10초 (충전당)',
            unboundChaos: '무한의 혼돈 버프 시 피해 400% 증가 + 격노 추가 생성'
          }
        },
        {
          skill: 'immolationaura',
          condition: '쿨다운 완료',
          priority: 8,
          why: '지속 격노 생성 + 추가 피해',
          simulationEvidence: 'SimC APL default Line 12-17: immolation_aura,if=active_enemies>2&talent.ragefire&(...)',
          mathematicalModel: {
            formula: '화염 분출 = (DoT 피해 × 15초) + (격노 6 × 15초 / 2초) = 격노 45',
            example: '15초 지속: 격노 초당 3 × 15 = 격노 45 총 생성',
            charges: '2회 충전, 쿨다운 20초 (충전당)',
            furyGeneration: '2초마다 격노 6 생성 (15초 = 7틱)'
          }
        },
        {
          skill: 'demonsbite',
          condition: '항상',
          priority: 9,
          why: '격노 생성 필러 스킬',
          simulationEvidence: 'SimC APL default Line 38: demons_bite',
          mathematicalModel: {
            formula: '악마의 이빨 = 격노 20-40 (평균 30)',
            example: 'GCD 1.5초당 격노 30 = 초당 격노 20 생성',
            gcd: '1.5초 (가속 영향)',
            furyPerSecond: '격노 20/초 (지속 사용 시)'
          }
        }
      ]
    },
    aoe: {
      opener: [
        'vengefulretreat',
        'immolationaura',
        'eyebeam',
        'metamorphosis',
        'deathsweep',
        'bladedance',
        'chaosstrike',
        'felrush'
      ],
      priority: [
        {
          skill: 'eyebeam',
          condition: '쿨다운 완료',
          priority: 0,
          why: '광역 딜의 핵심 - 최우선 사용',
          simulationEvidence: 'SimC APL default Line 26: eye_beam,if=!talent.essence_break&(...active_enemies>desired_targets*2...)',
          mathematicalModel: {
            formula: '안광 AoE = 기본 × 적 수 × 1.4(탈태) × (1 + 격노/30 × 0.15)',
            example: '5명, 격노 90, 탈태: 기본 × 5 × 1.4 × 1.45 = 10.15배',
            aoeCap: '최대 5명까지 100% 피해 (6명부터 감소)',
            reaverStacks: '탈태 중 타격당 파괴자 1중첩 (5명 = 3-5중첩)'
          }
        },
        {
          skill: 'metamorphosis',
          condition: '쿨다운 완료',
          priority: 1,
          why: '탈태로 광역 딜 극대화',
          simulationEvidence: 'SimC APL cooldown Line 1: metamorphosis,if=(...&active_enemies>2|!talent.chaotic_transformation...)',
          mathematicalModel: {
            formula: 'AoE 탈태 DPS = (안광 2회 × 5명) + (죽음의 휩쓸기 × 공속 1.25)',
            example: '5명 타격: 단일 대상 대비 5배 DPS 증가',
            aoeBenefit: '광역 상황일수록 탈태 효율 극대화 (선형 증가)',
            timing: '큰 풀(5+ 적) 또는 보스에만 사용'
          }
        },
        {
          skill: 'deathsweep',
          condition: '탈태 중 + 격노 25 이상',
          priority: 2,
          why: '탈태 중 강력한 광역 스킬',
          simulationEvidence: 'SimC APL meta Line 8: death_sweep',
          mathematicalModel: {
            formula: '죽음의 휩쓸기 총 DPS = 칼춤 × 1.5 × 적 수 × 1.15(티어)',
            example: '5명 + 티어: 칼춤 × 1.5 × 5 × 1.15 = 8.625배',
            priority: 'AoE 시 소멸보다 우선 (격노 효율 높음)',
            furyEfficiency: '격노 25당 8.625배 피해 = 격노당 0.345배'
          }
        },
        {
          skill: 'bladedance',
          condition: '쿨다운 완료 + 격노 25 이상',
          priority: 3,
          why: '주요 광역 딜 스킬',
          simulationEvidence: 'SimC APL default Line 28: blade_dance,if=cooldown.eye_beam.remains>gcd.max|cooldown.eye_beam.up',
          mathematicalModel: {
            formula: '칼춤 AoE = 기본 × 적 수 × 1.15(티어) + 격노 40 생성',
            example: '5명 + 티어: 기본 × 5.75 + 격노 40 (net cost: -15)',
            cooldownValue: '9초마다 격노 -15로 AoE 피해 5.75배',
            reaverCombo: '칼춤 후 파괴자 중첩 소모로 격노 추가 생성'
          }
        },
        {
          skill: 'annihilation',
          condition: '탈태 중 + 격노 40 이상',
          priority: 4,
          why: '탈태 중 단일 대상 필러',
          simulationEvidence: 'SimC APL meta Line 12: annihilation,if=cooldown.blade_dance.remains>gcd.max*2|fury>60|...',
          mathematicalModel: {
            formula: 'AoE에서 소멸 = 단일 대상 피해만 (광역 0%)',
            example: '죽음의 휩쓸기 쿨다운 중에만 사용 (격노 낭비 방지)',
            aoePriority: '죽음의 휩쓸기 > 소멸 (AoE 계수 차이)',
            situation: '죽음의 휩쓸기 CD 중 격노 100+ 시에만'
          }
        },
        {
          skill: 'chaosstrike',
          condition: '격노 40 이상',
          priority: 5,
          why: '격노 소모 필러',
          simulationEvidence: 'SimC APL default Line 35: chaos_strike,if=cooldown.eye_beam.remains>gcd.max*2|fury>80',
          mathematicalModel: {
            formula: 'AoE에서 혼돈 일격 = 단일 피해만 (비효율)',
            example: '격노 120 방지용으로만 사용 (AoE 우선순위 최하)',
            furyWaste: '칼춤/죽음의 휩쓸기 우선, 격노 넘칠 때만 사용',
            efficiency: '단일 대상 대비 AoE 효율 1/5 (5명 기준)'
          }
        },
        {
          skill: 'felrush',
          condition: '쿨다운 완료',
          priority: 6,
          why: '이동 + 격노 생성',
          simulationEvidence: 'SimC APL meta Line 17: fel_rush,if=buff.unbound_chaos.down&recharge_time<cooldown.eye_beam.remains&...',
          mathematicalModel: {
            formula: '지옥 돌진 AoE = 이동 피해 × 적 관통 + 격노 15',
            example: '5명 관통: 단일 대상 × 5 + 격노 15 생성',
            aoeBenefit: '모든 적 관통 (무제한) + 위치 조정',
            mobility: 'AoE 풀 중앙 진입 또는 안전 지대 이동용'
          }
        },
        {
          skill: 'demonsbite',
          condition: '항상',
          priority: 7,
          why: '격노 생성 필러',
          simulationEvidence: 'SimC APL meta Line 18: demons_bite',
          mathematicalModel: {
            formula: 'AoE에서 악마의 이빨 = 격노 20-40 (단일 피해만)',
            example: 'AoE에서는 거의 사용 안 함 (격노 넘침)',
            furyGeneration: '화염 분출 + 칼춤으로 격노 충분 (초당 40+)',
            usage: '모든 AoE 스킬 쿨다운 중에만 사용'
          }
        }
      ]
    }
  },

  // 지옥상흔 (Fel-Scarred)
  felscarred: {
    playstyle: {
      preparation: `
        <h4 style="color: #ffa500; margin-bottom: 15px;">전투 준비 (Pre-pull)</h4>
        <p><strong>지옥 돌진 충전 관리</strong>가 핵심입니다. 지옥상흔 빌드는 <strong>지옥 돌진을 최대한 많이 사용</strong>하여 중첩을 쌓는 것이 목표입니다.</p>
        <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>지옥 돌진 충전</strong>: 2회 충전 모두 확보된 상태로 시작</li>
          <li><strong>복수의 후퇴</strong>: 지옥 돌진 충전 1회 추가 생성 (Pull 5초 전 사용)</li>
          <li><strong>격노 80-100</strong>: 탈태 변신 전 격노 확보</li>
          <li><strong>안광 쿨다운</strong>: 준비 완료 확인 (탈태 중 사용 예정)</li>
        </ul>
      `,
      burst: `
        <h4 style="color: #ffa500; margin-bottom: 15px;">버스트 페이즈 (Metamorphosis + 지옥상흔)</h4>
        <p><strong>지옥상흔 (Fel-Scarred)</strong> 버프는 <strong>안광 또는 지옥 돌진 사용 시 중첩</strong>을 쌓으며, 최대 <strong>5중첩 (10% 피해 증가)</strong>까지 가능합니다.</p>

        <h5 style="color: #66bb6a; margin: 20px 0 10px 0;">탈태 변신 활성화 순간</h5>
        <ol style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>탈태 변신 사용</strong> → 최대 격노 +20, 공격 속도 25% 증가</li>
          <li><strong>안광 (Eye Beam)</strong> → 지옥상흔 중첩 생성 시작 (약 5-7중첩)</li>
          <li><strong>지옥 돌진 (Fel Rush)</strong> → 중첩 추가 생성 (충전 모두 사용)</li>
          <li><strong>소멸/죽음의 휩쓸기</strong> → 격노 소모 및 피해 극대화</li>
          <li><strong>지옥 돌진 추가 사용</strong> → 충전 준비되면 즉시 사용하여 중첩 유지</li>
        </ol>

        <h5 style="color: #66bb6a; margin: 20px 0 10px 0;">지옥상흔 중첩 극대화 전략</h5>
        <p><strong>지옥상흔 버프</strong>는 중첩당 <strong>피해 2% 증가</strong> 효과를 제공합니다 (최대 5중첩 = 10% 증가).</p>
        <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>중첩 생성</strong>: 안광 또는 지옥 돌진 사용 시 중첩 생성</li>
          <li><strong>최대 중첩</strong>: 5중첩 (중첩당 2%, 총 10% 피해 증가)</li>
          <li><strong>지속시간</strong>: 15초 (각 중첩 독립 지속, 갱신 가능)</li>
          <li><strong>효과</strong>: 전체 피해 증가 (모든 스킬에 적용)</li>
          <li><strong>목표</strong>: 탈태 변신 중 5중첩 달성 후 지속 유지</li>
        </ul>

        <h5 style="color: #66bb6a; margin: 20px 0 10px 0;">지옥 돌진 최적화 (핵심 메커니즘)</h5>
        <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>충전 관리</strong>: 지옥 돌진은 2회 충전, 쿨다운 10초</li>
          <li><strong>복수의 후퇴 연계</strong>: 복수의 후퇴 사용 시 지옥 돌진 충전 1회 즉시 생성</li>
          <li><strong>탈태 변신 중 우선순위</strong>: 지옥 돌진 충전 준비되면 즉시 사용</li>
          <li><strong>이동 활용</strong>: 보스 메커니즘 대응하면서 지옥 돌진 사용 (피해 + 이동)</li>
          <li><strong>충전 낭비 방지</strong>: 2회 충전 모두 대기 중일 때 재사용 시간 낭비</li>
        </ul>

        <h5 style="color: #66bb6a; margin: 20px 0 10px 0;">탈태 변신 종료 전 체크리스트</h5>
        <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>지옥상흔 5중첩</strong> 달성 확인</li>
          <li><strong>지옥 돌진 충전</strong> 최소 1회 확보 (탈태 종료 후 바로 사용)</li>
          <li><strong>격노 80-100</strong> 유지</li>
          <li><strong>안광 쿨다운</strong> 다시 준비되면 탈태 종료 직전 사용</li>
        </ul>
      `,
      sustain: `
        <h4 style="color: #ffa500; margin-bottom: 15px;">유지 페이즈 (탈태 변신 쿨다운 중)</h4>
        <p>탈태 변신 쿨다운 중에는 <strong>지옥상흔 중첩 유지</strong>와 <strong>지옥 돌진 활용</strong>이 핵심입니다.</p>

        <h5 style="color: #66bb6a; margin: 20px 0 10px 0;">지옥상흔 중첩 유지 (15초 지속시간)</h5>
        <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>중첩 갱신</strong>: 지옥 돌진 또는 안광 사용 시 15초 지속시간 갱신</li>
          <li><strong>유지 목표</strong>: 4-5중첩을 최대한 오래 유지 (다음 탈태까지)</li>
          <li><strong>안광 쿨다운</strong>: 40-50초마다 사용하여 중첩 갱신</li>
          <li><strong>지옥 돌진</strong>: 충전 준비되면 즉시 사용하여 중첩 유지</li>
          <li><strong>중첩 만료 주의</strong>: 10초 이하 남았을 때 지옥 돌진 또는 안광 사용</li>
        </ul>

        <h5 style="color: #66bb6a; margin: 20px 0 10px 0;">지옥 돌진 충전 관리</h5>
        <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>2회 충전 대기 금지</strong>: 충전이 2회 모두 준비되면 재사용 시간 낭비</li>
          <li><strong>복수의 후퇴 연계</strong>: 복수의 후퇴(2분 쿨) 사용 시 지옥 돌진 충전 1회 즉시 생성</li>
          <li><strong>이동 메커니즘 활용</strong>: 보스 메커니즘 대응 시 지옥 돌진으로 이동 + 피해</li>
          <li><strong>탈태 변신 15초 전</strong>: 지옥 돌진 충전 1회 확보 (탈태 중 사용 예정)</li>
        </ul>

        <h5 style="color: #66bb6a; margin: 20px 0 10px 0;">격노 관리 (80-100 범위 유지)</h5>
        <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>80 미만</strong>: 악마의 이빨, 지옥 돌진, 화염 분출 우선</li>
          <li><strong>80-100</strong>: 이상적인 범위, 균형 유지</li>
          <li><strong>100-120</strong>: 혼돈 일격, 칼춤 우선 사용</li>
          <li><strong>120 도달</strong>: 즉시 격노 소모 (생성 낭비 방지)</li>
        </ul>
      `,
      scenarios: `
        <h4 style="color: #ffa500; margin-bottom: 15px;">실전 시나리오</h4>

        <h5 style="color: #66bb6a; margin: 20px 0 10px 0;">시나리오 1: 이동 메커니즘 극대화</h5>
        <p><strong>지옥상흔 빌드의 강점</strong>은 <strong>높은 기동력</strong>과 <strong>이동 중 피해</strong>입니다.</p>
        <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>지옥 돌진 (2회 충전)</strong>: 이동 + 피해 + 격노 15 생성</li>
          <li><strong>복수의 후퇴 (2분 쿨)</strong>: 후방 이동 + 지옥 돌진 충전 1회 생성</li>
          <li><strong>활공 (1.5분 쿨)</strong>: 15초간 낙하 속도 감소</li>
          <li><strong>보스 메커니즘 예시</strong>:
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>소용돌이 회피: 지옥 돌진 2회 연속 사용</li>
              <li>넓은 광역 회피: 복수의 후퇴 → 지옥 돌진</li>
              <li>빠른 위치 변경: 지옥 돌진으로 피해 유지하며 이동</li>
            </ul>
          </li>
        </ul>

        <h5 style="color: #66bb6a; margin: 20px 0 10px 0;">시나리오 2: 쐐기돌 대량 풀링</h5>
        <p><strong>지옥상흔 빌드</strong>는 <strong>광역 상황에서도 강력</strong>합니다.</p>
        <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>큰 풀 (8+마리)</strong>:
            <ol style="margin: 10px 0; padding-left: 20px;">
              <li>탈태 변신 사용</li>
              <li>안광 (광역 피해 + 지옥상흔 중첩)</li>
              <li>지옥 돌진 2회 (모든 적 관통 피해)</li>
              <li>죽음의 휩쓸기 연속 (격노 소모)</li>
              <li>복수의 후퇴 → 지옥 돌진 추가 (충전 생성)</li>
            </ol>
          </li>
          <li><strong>지옥 돌진 관통 피해</strong>: 모든 적을 관통하여 광역 피해 극대화</li>
          <li><strong>지옥상흔 중첩 효과</strong>: 5중첩 시 지옥 돌진 피해 대폭 증가</li>
        </ul>

        <h5 style="color: #66bb6a; margin: 20px 0 10px 0;">시나리오 3: 복수의 후퇴 타이밍 최적화</h5>
        <p><strong>복수의 후퇴 (2분 쿨)</strong>는 지옥상흔 빌드의 핵심 스킬입니다.</p>
        <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>효과</strong>:
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>후방 20야드 이동 (즉시)</li>
              <li>격노 20 생성</li>
              <li>지옥 돌진 충전 1회 즉시 생성 ← <strong>핵심</strong></li>
            </ul>
          </li>
          <li><strong>최적 사용 타이밍</strong>:
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>탈태 변신 직전: 격노 20 + 지옥 돌진 충전 확보</li>
              <li>지옥 돌진 충전 0회: 즉시 복수의 후퇴로 충전 생성</li>
              <li>보스 메커니즘: 후방 이동 필요 시 + 지옥 돌진 충전 생성</li>
            </ul>
          </li>
          <li><strong>주의사항</strong>: 탈태 변신 쿨다운과 동기화 (2분 vs 3분)</li>
        </ul>

        <h5 style="color: #66bb6a; margin: 20px 0 10px 0;">시나리오 4: 지옥상흔 중첩 만료 방지</h5>
        <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>문제</strong>: 지옥상흔 중첩은 15초 지속, 갱신하지 않으면 만료</li>
          <li><strong>해결책</strong>:
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li><strong>안광 쿨다운 추적</strong>: 40-50초마다 사용하여 중첩 갱신</li>
              <li><strong>지옥 돌진 활용</strong>: 중첩 10초 이하 남았을 때 지옥 돌진 사용</li>
              <li><strong>보스 무적 페이즈</strong>: 무적 전 지옥 돌진/안광으로 중첩 갱신</li>
              <li><strong>쐐기돌 풀 간 이동</strong>: 지옥 돌진으로 이동하며 중첩 유지</li>
            </ul>
          </li>
          <li><strong>중첩 재시작 비용</strong>: 5중첩 재생성에는 탈태 변신 1회 필요 (매우 비쌈)</li>
        </ul>
      `
    },
    singleTarget: {
      opener: [
        'vengefulretreat',
        'immolationaura',
        'eyebeam',
        'metamorphosis',
        'annihilation',
        'chaosstrike',
        'bladedance',
        'felrush',
        'demonsbite'
      ],
      priority: [
        {
          skill: 'eyebeam',
          condition: '쿨다운 완료 + 격노 30 이상',
          priority: 0,
          why: '가장 강력한 딜 쿨다운 - 지옥상흔 버프 획득',
          simulationEvidence: 'SimC APL default Line 26-27: eye_beam,if=!talent.essence_break&(...) | eye_beam,if=talent.essence_break&(...)',
          mathematicalModel: {
            formula: '안광 총 피해 = 기본 피해 × (1 + 격노/30 × 0.15) × 탈태 배율(1.4)',
            example: '격노 90, 탈태 중: 기본 피해 × 1.45 × 1.4 = 2.03배',
            felScarredStacks: '5-7중첩 생성 (타격 수에 비례)',
            buffDuration: '지옥상흔 15초 지속시간 갱신',
            furyCost: '격노 소모 없음 (30 이상 시 피해 15% 증가)'
          }
        },
        {
          skill: 'metamorphosis',
          condition: '쿨다운 완료',
          priority: 1,
          why: '탈태 변신으로 지옥상흔 효과 강화',
          simulationEvidence: 'SimC APL cooldown Line 1: metamorphosis,if=(!talent.initiative|cooldown.vengeful_retreat.remains)&(...)',
          mathematicalModel: {
            formula: '탈태 윈도우 DPS 증가 = (공속 1.25배) × (안광 2회) × (지옥 돌진 강화) × 30초',
            example: '탈태 30초: 기본 DPS × 1.25 + 안광 2회 + 지옥 돌진 강화 = ~2.5배 DPS',
            furyGain: '+20 최대 격노 (120 → 140)',
            cooldownReset: '안광 쿨다운 즉시 초기화',
            felScarredSynergy: '탈태 중 지옥 돌진 피해 대폭 증가 (5중첩 = 10% 버프)'
          }
        },
        {
          skill: 'annihilation',
          condition: '탈태 중 + 격노 40 이상',
          priority: 2,
          why: '탈태 중 주력 스킬',
          simulationEvidence: 'SimC APL meta Line 12: annihilation,if=cooldown.blade_dance.remains>gcd.max*2|fury>60|...',
          mathematicalModel: {
            formula: '소멸 피해 = 혼돈 일격 × 1.5 × 탈태 배율(1.4)',
            example: '탈태 중: 혼돈 일격 × 1.5 × 1.4 = 2.1배 피해',
            furyEfficiency: '격노 40당 2.1배 피해 = 격노당 0.0525배',
            usage: '칼춤 쿨다운 2 GCD 이상 또는 격노 60 이상 시'
          }
        },
        {
          skill: 'chaosstrike',
          condition: '격노 40 이상',
          priority: 3,
          why: '주요 격노 소모 스킬',
          simulationEvidence: 'SimC APL default Line 35: chaos_strike,if=cooldown.eye_beam.remains>gcd.max*2|fury>80',
          mathematicalModel: {
            formula: '혼돈 일격 DPS = 기본 피해 × 크리티컬 확률 × (1 + 지옥상흔 버프 10%)',
            example: '크리 40%, 지옥상흔 5중첩: 기본 × 1.4 × 1.10 = 1.54배',
            furyEfficiency: '격노 40당 기본 피해 = 격노당 0.025배',
            usage: '안광 쿨다운 2 GCD 이상 남았거나 격노 80 이상'
          }
        },
        {
          skill: 'bladedance',
          condition: '쿨다운 완료 + 격노 25 이상',
          priority: 4,
          why: '쿨다운마다 사용',
          simulationEvidence: 'SimC APL default Line 28: blade_dance,if=cooldown.eye_beam.remains>gcd.max|cooldown.eye_beam.up',
          mathematicalModel: {
            formula: '칼춤 총 효율 = 기본 피해 × 1.15(티어) + 격노 40 생성',
            example: '티어 세트: 기본 × 1.15 + 격노 40 생성 = 실질 격노 -5만 소모',
            netFuryCost: '-15 격노 (25 소모 - 40 생성)',
            cooldown: '9초 (신속 증가 시 감소)',
            priority: '안광 쿨다운과 충돌하지 않도록 타이밍 조절'
          }
        },
        {
          skill: 'felrush',
          condition: '쿨다운 완료',
          priority: 5,
          why: '기동력 + 격노 생성 + 지옥상흔 중첩',
          simulationEvidence: 'SimC APL default Line 7: fel_rush,if=buff.unbound_chaos.up&buff.unbound_chaos.remains<gcd.max*2',
          mathematicalModel: {
            formula: '지옥 돌진 효율 = 관통 피해 × (1 + 지옥상흔 10%) + 격노 15 생성',
            example: '5중첩: 관통 피해 × 1.10 + 격노 15 = 높은 효율',
            charges: '2회 충전, 쿨다운 10초 (충전당)',
            felScarredStacks: '1-2중첩 생성 (충전당)',
            mobility: '20야드 이동 + 피해 (메커니즘 대응 핵심)'
          }
        },
        {
          skill: 'immolationaura',
          condition: '쿨다운 완료',
          priority: 6,
          why: '지속 격노 생성',
          simulationEvidence: 'SimC APL default Line 20-25: immolation_aura,if=buff.unbound_chaos.down&full_recharge_time<gcd.max*2&(...)',
          mathematicalModel: {
            formula: '화염 분출 격노 = 15초 동안 3초마다 격노 3 = 총 45 격노',
            example: '15초: 격노 45 생성, 초당 3 생성',
            furyPerSecond: '3 격노/초 (지속 생성)',
            cooldown: '15초 (2회 충전 가능)',
            usage: '쿨다운마다 사용하여 지속 격노 확보'
          }
        },
        {
          skill: 'demonsbite',
          condition: '항상',
          priority: 7,
          why: '격노 생성 필러',
          simulationEvidence: 'SimC APL default Line 38: demons_bite',
          mathematicalModel: {
            formula: '악마의 이빨 격노 = 20-40 (평균 30)',
            example: '평균 격노 30, 초당 약 20 생성 (GCD 기준)',
            furyPerSecond: '~20 격노/초 (스킬 사용 시간 고려)',
            usage: '모든 스킬 쿨다운 중에만 사용 (최저 우선순위)'
          }
        }
      ]
    },
    aoe: {
      opener: [
        'vengefulretreat',
        'immolationaura',
        'eyebeam',
        'metamorphosis',
        'deathsweep',
        'bladedance',
        'chaosstrike',
        'felrush'
      ],
      priority: [
        {
          skill: 'eyebeam',
          condition: '쿨다운 완료',
          priority: 0,
          why: '광역 딜 + 지옥상흔 버프',
          simulationEvidence: 'SimC APL default Line 26: eye_beam,if=!talent.essence_break&(...active_enemies>desired_targets*2...)',
          mathematicalModel: {
            formula: '안광 AoE 피해 = 기본 피해 × 적 수 (최대 5명) × (1 + 격노/30 × 0.15) × 1.4(탈태)',
            example: '5명, 격노 90, 탈태 중: 기본 × 5 × 1.45 × 1.4 = 10.15배',
            aoeCap: '5명까지 전체 피해 (5명 이상 시 피해 감소)',
            felScarredStacks: '5-7중첩 생성 + 15초 지속시간 갱신',
            priority: 'AoE 시 최우선 (광역 피해 + 버프 생성)'
          }
        },
        {
          skill: 'metamorphosis',
          condition: '쿨다운 완료',
          priority: 1,
          why: '탈태로 광역 딜 극대화',
          simulationEvidence: 'SimC APL cooldown Line 1: metamorphosis,if=(...&active_enemies>2|!talent.chaotic_transformation...)',
          mathematicalModel: {
            formula: '탈태 AoE 윈도우 = (공속 1.25배) × (안광 2회 × 5명) × (죽음의 휩쓸기 강화) × 30초',
            example: 'AoE: 기본 DPS × 1.25 + 안광 2회(×5명) + 죽음의 휩쓸기 = ~3.5배 DPS',
            furyGain: '+20 최대 격노 (120 → 140)',
            cooldownReset: '안광 쿨다운 초기화 (AoE 2회 사용)',
            aoeActivation: '2명 이상 적 시 사용 권장 (죽음의 휩쓸기 활성화)'
          }
        },
        {
          skill: 'deathsweep',
          condition: '탈태 중 + 격노 25 이상',
          priority: 2,
          why: '탈태 중 광역 스킬',
          simulationEvidence: 'SimC APL meta Line 8: death_sweep',
          mathematicalModel: {
            formula: '죽음의 휩쓸기 총 DPS = 칼춤 × 1.5 × 적 수 × 1.15(티어)',
            example: '5명 + 티어: 칼춤 × 1.5 × 5 × 1.15 = 8.625배',
            netFuryCost: '-15 격노 (25 소모 - 40 생성, 티어 세트)',
            aoeScaling: '모든 적에게 100% 피해 (제한 없음)',
            usage: '탈태 중 격노 소모 최우선 (AoE 폭발 피해)'
          }
        },
        {
          skill: 'bladedance',
          condition: '쿨다운 완료 + 격노 25 이상',
          priority: 3,
          why: '주요 광역 딜',
          simulationEvidence: 'SimC APL default Line 28: blade_dance,if=cooldown.eye_beam.remains>gcd.max|cooldown.eye_beam.up',
          mathematicalModel: {
            formula: '칼춤 AoE 피해 = 기본 피해 × 적 수 × 1.15(티어) + 격노 40 생성',
            example: '5명 + 티어: 기본 × 5 × 1.15 + 격노 40 = 실질 격노 -5만 소모',
            netFuryCost: '-15 격노 (25 소모 - 40 생성)',
            aoeScaling: '모든 적에게 100% 피해',
            priority: '안광 쿨다운과 충돌하지 않도록 타이밍 조절'
          }
        },
        {
          skill: 'annihilation',
          condition: '탈태 중 + 격노 40 이상',
          priority: 4,
          why: '탈태 중 필러',
          simulationEvidence: 'SimC APL meta Line 12: annihilation,if=cooldown.blade_dance.remains>gcd.max*2|fury>60|...',
          mathematicalModel: {
            formula: '소멸 단일 피해 = 혼돈 일격 × 1.5 × 1.4(탈태)',
            example: 'AoE에서 단일 피해: 혼돈 일격 × 1.5 × 1.4 = 2.1배',
            usage: 'AoE에서 낮은 우선순위 (칼춤 쿨다운 2 GCD 이상 남았을 때만)',
            aoeNote: '단일 대상 스킬 - 광역 스킬 쿨다운 중에만 사용'
          }
        },
        {
          skill: 'chaosstrike',
          condition: '격노 40 이상',
          priority: 5,
          why: '격노 소모',
          simulationEvidence: 'SimC APL default Line 35: chaos_strike,if=cooldown.eye_beam.remains>gcd.max*2|fury>80',
          mathematicalModel: {
            formula: '혼돈 일격 단일 피해 = 기본 피해 × 크리티컬 확률',
            example: 'AoE에서 단일 피해: 기본 × 1.4 (크리 40%)',
            usage: 'AoE에서 최저 우선순위 (격노 120 방지용)',
            aoeNote: '단일 대상 - 광역 스킬 모두 쿨다운 중일 때만'
          }
        },
        {
          skill: 'felrush',
          condition: '쿨다운 완료',
          priority: 6,
          why: '이동 + 격노 + 지옥상흔 중첩',
          simulationEvidence: 'SimC APL meta Line 17: fel_rush,if=buff.unbound_chaos.down&recharge_time<cooldown.eye_beam.remains&...',
          mathematicalModel: {
            formula: '지옥 돌진 AoE 피해 = 관통 피해 × 적 수 × (1 + 지옥상흔 10%) + 격노 15',
            example: '5명, 5중첩: 관통 × 5 × 1.10 + 격노 15 = 5.5배 + 격노',
            aoeScaling: '모든 적 관통 (100% 피해, 제한 없음)',
            felScarredStacks: '1-2중첩 생성 (충전당)',
            mobility: 'AoE 풀 간 이동 + 피해 (쐐기돌 핵심 메커니즘)'
          }
        },
        {
          skill: 'demonsbite',
          condition: '항상',
          priority: 7,
          why: '격노 생성',
          simulationEvidence: 'SimC APL meta Line 18: demons_bite',
          mathematicalModel: {
            formula: 'AoE에서 악마의 이빨 = 격노 20-40 (단일 피해만)',
            example: 'AoE에서는 거의 사용 안 함 (격노 넘침)',
            furyGeneration: '칼춤 + 지옥 돌진으로 격노 충분 (초당 40+)',
            usage: '모든 AoE 스킬 쿨다운 중에만 사용'
          }
        }
      ]
    }
  }
};
