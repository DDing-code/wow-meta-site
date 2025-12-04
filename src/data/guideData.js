// WoW 전문화 가이드 데이터 (TWW 시즌3 11.2.5 패치)
// 레이드/장비 데이터 제거됨 - 2025-11-28
// 스킬/로테이션/특성 데이터에 집중
//
// 📌 필수 참조 문서:
//   - C:/wowmeta/WoW-Meta-Knowledge/99-META/Guide-of-Guides.md (전체 시스템 이해)
//   - C:/wowmeta/WoW-Meta-Knowledge/99-META/Guide-Generation-Instructions.md (가이드 생성 지침)

export const guideData = {
  hunter: {
    'beast-mastery': {
      className: '사냥꾼',
      specName: '야수',
      specIcon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_bestialdiscipline.jpg',
      patch: '11.2.5',
      overview: {
        role: '원거리 물리 딜러',
        tier: 'S',
        difficulty: '★★★☆☆',
        description: '야수 사냥꾼은 다양한 야수 펫을 활용하여 높은 기동성과 안정적인 딜을 제공하는 원거리 딜러입니다.',
        strengths: [
          '100% 이동 중 딜 가능',
          '강력한 단일 대상 및 광역 딜',
          '펫을 통한 유틸리티',
          '낮은 진입 장벽'
        ],
        weaknesses: [
          '펫 관리 필요',
          '복잡한 쿨다운 관리',
          '근접 전투 취약'
        ]
      },
      mechanics: {
        resources: {
          primary: '집중',
          secondary: '야수의 격노',
          tertiary: '광기 중첩'
        },
        coreMechanics: [
          {
            name: '야수의 격노',
            description: '펫의 공격 속도를 25% 증가시키고 추가 효과 부여',
            icon: 'ability_hunter_ferociousinspiration'
          },
          {
            name: '살상 명령',
            description: '주요 집중 소비 기술, 펫에게 추가 공격 명령',
            icon: 'ability_hunter_killcommand'
          },
          {
            name: '가시 사격',
            description: '집중 생성 기술, 광기 중첩 생성',
            icon: 'ability_hunter_barbedshot'
          }
        ]
      },
      talents: {
        raid: {
          heroTalent: '무리의 지도자',
          classTree: [
            { id: 19290, points: 1, tier: 1 },
            { id: 19291, points: 1, tier: 1 },
            { id: 19292, points: 2, tier: 2 }
          ],
          specTree: [
            { id: 53270, points: 1, tier: 1 },
            { id: 53271, points: 2, tier: 2 }
          ],
          heroTree: [
            { id: 90001, points: 1, tier: 1 }
          ],
          loadoutString: 'BwPAvcSwFu2eTjpJR0kKJJJRSSSSjEAAAAAAAAAAAAAQSSSSSSSSJJJJJJJRSSSSkkEJRSA',
          description: '단일 대상 레이드 보스에 최적화된 빌드'
        },
        mythicplus: {
          heroTalent: '무리의 지도자',
          classTree: [],
          specTree: [],
          heroTree: [],
          loadoutString: 'BwPAvcSwFu2eTjpJR0kKJJJRSSSSjEBAAAAAAAAAAAAQSSSSSSSSJJJJJJJRSSSSkkEJRSA',
          description: '신화+ 던전 광역 딜에 최적화된 빌드'
        },
        aoe: {
          heroTalent: '어둠 순찰자',
          classTree: [],
          specTree: [],
          heroTree: [],
          loadoutString: 'BwPAvcSwFu2eTjpJR0kKJJJRSSSSjECAAAAAAAAAAAAQSSSSSSSSJJJJJJJRSSSSkkEJRSA',
          description: '대규모 광역 상황에 특화된 빌드'
        }
      },
      stats: {
        priority: [
          { stat: '가속', weight: 1.0, color: '#ff6b6b' },
          { stat: '치명타', weight: 0.85, color: '#f4c430' },
          { stat: '특화', weight: 0.75, color: '#4ecdc4' },
          { stat: '유연성', weight: 0.65, color: '#95e77e' },
          { stat: '민첩', weight: 0.50, color: '#868e96' }
        ],
        pawnString: '( Pawn: v1: "야수_사냥꾼": Agility=0.50, CritRating=0.85, HasteRating=1.0, MasteryRating=0.75, Versatility=0.65 )',
        softCaps: {
          haste: { value: 3000, description: '가속 소프트캡 - GCD 최적화' },
          crit: { value: 4500, description: '치명타 40% 달성' }
        },
        recommendations: '가속을 최우선으로 확보하여 집중 생성과 펫 공격 속도를 최대화합니다.'
      },
      rotation: {
        opener: [
          { skill: '사냥꾼의 징표', icon: 'ability_hunter_markedfordeath', time: '-2s' },
          { skill: '쐐기 사격', icon: 'ability_hunter_barbedshot', time: '-1s' },
          { skill: '야수의 격노', icon: 'ability_hunter_ferociousinspiration', time: '0s' },
          { skill: '살상 명령', icon: 'ability_hunter_killcommand', time: '0.5s' },
          { skill: '광포한 야수', icon: 'ability_hunter_lonewolf', time: '1s' },
          { skill: '코브라 사격', icon: 'ability_hunter_cobrashot', time: '2s' }
        ],
        priority: [
          {
            priority: 1,
            action: '야수의 격노',
            condition: '쿨다운이 돌아왔을 때 즉시 사용'
          },
          {
            priority: 2,
            action: '쐐기 사격',
            condition: '광기 중첩이 2 이하일 때'
          },
          {
            priority: 3,
            action: '살상 명령',
            condition: '집중 30 이상'
          },
          {
            priority: 4,
            action: '광포한 야수',
            condition: '야수의 격노 버프 중'
          },
          {
            priority: 5,
            action: '코브라 사격',
            condition: '집중 50 이상, 살상 명령 쿨다운 2초 이상'
          },
          {
            priority: 6,
            action: '복수의 명령',
            condition: '대상이 3개 이상'
          }
        ],
        cooldowns: {
          major: [
            { name: '야수의 격노', cd: '90초', usage: '버스트 딜 타이밍' },
            { name: '광포한 야수', cd: '120초', usage: '야수의 격노와 함께 사용' }
          ],
          minor: [
            { name: '살상 명령', cd: '7.5초', usage: '쿨마다 사용' },
            { name: '쐐기 사격', cd: '충전식 12초', usage: '광기 유지' }
          ]
        }
      },
      simcApl: `
# SimulationCraft APL for Beast Mastery Hunter
# TWW Season 3 (11.2.5)

actions.precombat=flask
actions.precombat+=/augmentation
actions.precombat+=/food
actions.precombat+=/snapshot_stats
actions.precombat+=/hunters_mark,if=debuff.hunters_mark.down
actions.precombat+=/barbed_shot

actions=auto_attack
actions+=/call_action_list,name=cds
actions+=/call_action_list,name=rotation

actions.cds=bestial_wrath
actions.cds+=/berserking
actions.cds+=/blood_fury
actions.cds+=/ancestral_call
actions.cds+=/fireblood

actions.rotation=barbed_shot,if=pet.main.buff.frenzy.up&pet.main.buff.frenzy.remains<=gcd.max
actions.rotation+=/kill_command
actions.rotation+=/barbed_shot,if=charges_fractional>1.4
actions.rotation+=/cobra_shot,if=focus>50&(buff.bestial_wrath.up|cooldown.bestial_wrath.remains>30)
actions.rotation+=/dire_beast
      `,
      weakauras: [
        {
          name: '광기 추적기',
          import: 'https://wago.io/bm-frenzy-tracker',
          description: '펫 광기 중첩 시각화'
        },
        {
          name: '쿨다운 타이머',
          import: 'https://wago.io/bm-cooldowns',
          description: '주요 쿨다운 추적'
        }
      ],
      macros: [
        {
          name: '펫 부활 매크로',
          code: '#showtooltip 펫 부활\n/cast [@pet,dead] 펫 부활\n/cast [nopet] 펫 소환 1'
        },
        {
          name: '인터럽트 매크로',
          code: '#showtooltip 역회전 사격\n/cast [@focus,exists,harm][@target] 역회전 사격'
        },
        {
          name: 'WFK 버스트 매크로',
          code: '#showtooltip 야수의 격노\n/cast [조건] 야수의 격노\n/cast [조건] 광폭한 야수\n/cast [조건] 야생의 부름\n/use 13\n/use 14'
        }
      ],
      wfkOptimization: {
        batchWindow: '0.1초',
        latencyCompensation: '20-30ms 예측',
        theoreticalMaxDps: '1,250,000',
        achievableDps: '1,185,000',
        optimizationGap: '5.2%',
        animationCancel: '가시사격 → 살상명령',
        breakpoints: [
          { stat: '가속', value: '3247', effect: 'GCD 1.25초', priority: 'critical' },
          { stat: '가속', value: '4820', effect: '광기 갱신 최적', priority: 'high' },
          { stat: '치명타', value: '40%', effect: '안정적 크리', priority: 'medium' },
          { stat: '특화', value: '35%', effect: '펫 데미지 소프트캐', priority: 'low' }
        ]
      },
      hiddenMechanics: [
        {
          name: '광기 스냅샷팅',
          description: '광기 3중첩에서 가시사격 사용 시 버프가 고정되어 전체 지속시간 동안 유지',
          value: '1.5초 추가 지속'
        },
        {
          name: '펫 AI 틱 조작',
          description: '타겟 스위칭 0.05초 전 입력으로 펫 공격 지연 최소화',
          value: '0.1초 DPS 증가'
        },
        {
          name: '살상명령 배치',
          description: 'GCD 끝자락에 살상명령 큐잉으로 다음 GCD 시작과 동시 발동',
          value: '0.05초 단축'
        },
        {
          name: '비전투 자원 축적',
          description: '비전투 중 최대 125 집중 축적 가능 (일반적 100 한계)',
          value: '25 추가 집중'
        },
        {
          name: '히든 헤이스트 브레이크',
          description: '가속 10737에서 숨겨진 0.01초 GCD 감소',
          value: '10737 가속'
        }
      ]
    },
    'marksmanship': {},
    'survival': {}
  },
  warrior: {},
  paladin: {}
};

export default guideData;
