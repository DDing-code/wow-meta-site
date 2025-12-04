// 파멸 악마사냥꾼 가이드 시각화 데이터
// 표, 차트, 플로우차트, 다이어그램 데이터 정의

export const havocVisuals = {
  // ==================== 표 (TABLE) ====================

  // 스탯 우선순위 표
  statPriorityTable: {
    aldrachireaver: {
      columns: ['스탯', '우선순위', '목표 수치', '설명'],
      rows: [
        ['민첩성', '1순위', '최대화', '주 능력치, 모든 피해량 증가'],
        ['치명타', '2순위', '35%', '치명타 피해 증가, 글레이브 중첩 생성'],
        ['가속', '3순위', '20%', 'GCD 감소, 더 많은 스킬 사용 가능'],
        ['특화', '4순위', '15%', '혼돈 피해 증가'],
        ['유연', '5순위', '최소화', '회피율 증가 (DPS 기여도 낮음)']
      ]
    },
    felscarred: {
      columns: ['스탯', '우선순위', '목표 수치', '설명'],
      rows: [
        ['민첩성', '1순위', '최대화', '주 능력치, 모든 피해량 증가'],
        ['가속', '2순위', '25%', '지옥불 격노 중첩 빠르게 생성'],
        ['치명타', '3순위', '30%', '치명타 피해 증가'],
        ['특화', '4순위', '15%', '혼돈 피해 증가'],
        ['유연', '5순위', '최소화', '회피율 증가']
      ]
    }
  },

  // 티어 세트 비교 표
  tierSetComparison: {
    columns: ['세트', '2세트 효과', '4세트 효과', '주요 시너지'],
    rows: [
      [
        '11.2 티어',
        '칼날 춤 피해 12% 증가',
        '탈태 변신 중 치명타 +15%',
        '알드라치: 글레이브 중첩 가속\n지옥상흔: 격노 생성 증가'
      ],
      [
        '11.1 티어',
        '파멸의 칼날 피해 10% 증가',
        '안광 재사용 대기시간 -5초',
        '단일 대상 DPS 향상'
      ]
    ]
  },

  // 스킬 리소스 비용/생성 표
  skillResourceTable: {
    columns: ['스킬', '격노 소모', '격노 생성', '쿨다운', '주요 용도'],
    rows: [
      ['악마의 이빨', '-', '20-30', '없음', '기본 격노 생성'],
      ['칼날 춤', '35', '-', '9초 (2중첩)', '주력 딜링 스킬'],
      ['죽음의 휩쓸기', '50', '-', '없음', '격노 덤핑, 글레이브 중첩'],
      ['안광', '30', '-', '30초', '버스트 윈도우 시작'],
      ['탈태 변신', '-', '-', '3분', '최강 버스트 쿨다운']
    ]
  },

  // ==================== 차트 (CHART) ====================

  // DPS 시뮬레이션 결과 (단일 대상)
  dpsSimulation: {
    singleTarget: [
      { name: '알드라치 파괴자', value: 1250000 },
      { name: '지옥상흔', value: 1180000 }
    ],
    aoe3Target: [
      { name: '알드라치 (3타겟)', value: 2100000 },
      { name: '지옥상흔 (3타겟)', value: 2300000 }
    ]
  },

  // 스탯 분포 차트 (권장 수치)
  statDistribution: {
    aldrachireaver: [
      { name: '치명타', value: 35 },
      { name: '가속', value: 20 },
      { name: '특화', value: 15 },
      { name: '유연', value: 10 }
    ],
    felscarred: [
      { name: '가속', value: 25 },
      { name: '치명타', value: 30 },
      { name: '특화', value: 15 },
      { name: '유연', value: 10 }
    ]
  },

  // ==================== 플로우차트 (FLOWCHART) ====================

  // 로테이션 결정 트리
  rotationFlowChart: {
    aldrachireaver: `
      graph TD
        START[전투 시작<br/>격노 80-100 확보] --> META{탈태 변신<br/>사용 가능?}
        META -->|Yes| META_USE[탈태 변신 사용]
        META -->|No| SUSTAIN[유지 페이즈]

        META_USE --> EYE1[안광<br/>파괴자 글레이브 중첩 시작]
        EYE1 --> DS1[죽음의 휩쓸기<br/>격노 소모 + 중첩 생성]
        DS1 --> ANNI[소멸<br/>격노 소모 + 중첩 생성]
        ANNI --> CHECK{글레이브<br/>8중첩?}
        CHECK -->|No| DS2[죽음의 휩쓸기/소멸 반복]
        DS2 --> CHECK
        CHECK -->|Yes| META_END[탈태 변신 종료<br/>글레이브 8중첩 유지]

        SUSTAIN --> FURY{격노<br/>80 이상?}
        FURY -->|Yes| BLADE[칼날 춤<br/>주력 딜링]
        FURY -->|No| DEMON[악마의 이빨<br/>격노 생성]
        BLADE --> SUSTAIN
        DEMON --> SUSTAIN

        style START fill:#66bb6a
        style META_USE fill:#ffa500
        style META_END fill:#ff6b6b
        style SUSTAIN fill:#4fc3f7
    `,
    felscarred: `
      graph TD
        START[전투 시작<br/>격노 확보] --> META{탈태 변신<br/>사용 가능?}
        META -->|Yes| META_USE[탈태 변신 사용]
        META -->|No| SUSTAIN[유지 페이즈]

        META_USE --> STUDENT[학생<br/>지옥불 격노 중첩 +8]
        STUDENT --> DS1[죽음의 휩쓸기<br/>중첩 소모 + 딜링]
        DS1 --> CHECK{지옥불<br/>격노 중첩?}
        CHECK -->|8중첩| DS2[죽음의 휩쓸기<br/>반복 사용]
        CHECK -->|< 8중첩| BLADE1[칼날 춤<br/>중첩 생성]
        DS2 --> CHECK
        BLADE1 --> CHECK

        SUSTAIN --> FURY{격노<br/>충분?}
        FURY -->|Yes| BLADE2[칼날 춤<br/>주력 딜링]
        FURY -->|No| DEMON[악마의 이빨<br/>격노 생성]
        BLADE2 --> SUSTAIN
        DEMON --> SUSTAIN

        style START fill:#66bb6a
        style META_USE fill:#ffa500
        style STUDENT fill:#ff4444
        style SUSTAIN fill:#4fc3f7
    `
  },

  // ==================== 다이어그램 (DIAGRAM) ====================

  // 탈태 변신 버스트 윈도우 타임라인
  metamorphosisTimeline: {
    aldrachireaver: `
      gantt
        title 알드라치 파괴자 탈태 변신 버스트 윈도우 (30초)
        dateFormat ss
        axisFormat %Ss

        section 탈태 시작 (0-5초)
        탈태 변신 사용             :a1, 00, 1s
        안광 (첫 GCD)              :a2, 01, 2s
        죽음의 휩쓸기              :a3, 03, 1s
        소멸                       :a4, 04, 1s

        section 중첩 쌓기 (5-15초)
        죽음의 휩쓸기 (중첩 +1)    :b1, 05, 1s
        소멸 (중첩 +1)             :b2, 06, 1s
        죽음의 휩쓸기 (중첩 +1)    :b3, 07, 1s
        칼날 춤 (중첩 +1)          :b4, 08, 2s
        죽음의 휩쓸기 (중첩 +1)    :b5, 10, 1s
        소멸 (중첩 +1)             :b6, 11, 1s
        죽음의 휩쓸기 (8중첩)      :b7, 12, 1s

        section 8중첩 유지 (15-30초)
        칼날 춤                    :c1, 15, 2s
        칼날 춤                    :c2, 18, 2s
        죽음의 휩쓸기              :c3, 21, 1s
        칼날 춤                    :c4, 24, 2s
        안광 (재사용)              :c5, 27, 2s
        탈태 변신 종료             :c6, 30, 1s
    `,
    felscarred: `
      gantt
        title 지옥상흔 탈태 변신 버스트 윈도우 (30초)
        dateFormat ss
        axisFormat %Ss

        section 탈태 시작 (0-3초)
        탈태 변신 사용             :a1, 00, 1s
        학생 (지옥불 격노 +8)      :a2, 01, 1s
        죽음의 휩쓸기              :a3, 02, 1s

        section 중첩 소모 (3-15초)
        죽음의 휩쓸기 (중첩 -1)    :b1, 03, 1s
        칼날 춤 (중첩 +1)          :b2, 04, 2s
        죽음의 휩쓸기 (중첩 -1)    :b3, 06, 1s
        칼날 춤 (중첩 +1)          :b4, 07, 2s
        죽음의 휩쓸기 (중첩 -1)    :b5, 09, 1s
        칼날 춤 (중첩 +1)          :b6, 10, 2s
        죽음의 휩쓸기              :b7, 12, 1s

        section 유지 (15-30초)
        칼날 춤                    :c1, 15, 2s
        죽음의 휩쓸기              :c2, 18, 1s
        칼날 춤                    :c3, 20, 2s
        죽음의 휩쓸기              :c4, 23, 1s
        칼날 춤                    :c5, 25, 2s
        탈태 변신 종료             :c6, 30, 1s
    `
  }
};
