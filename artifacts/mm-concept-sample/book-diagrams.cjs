// 사격 개념서 장별 스킬 구조 도식.
// 층(layers)을 위에서 아래로 읽는다. 층 사이의 link는 "앞 층이 뒤 층에 주는 것"이고, loop는 맨 아래에서 맨 위로 되돌아가는 설명이다.
// 수치·효과는 같은 장의 본문(KB 공식 툴팁 기준)에만 있는 것을 쓴다. 새 사실을 더하지 않는다.
// node.kind: core(이 장의 중심 스킬) · skill(기본) · buff(발동·강화 상태) · talent(선택 특성) · effect(스킬이 아닌 결과)

const DIAGRAMS = {
  '사격은 조준 사격 충전을 굴리는 전문화입니다': {
    title: '조준 사격 충전을 당겨 주는 스킬과 돌려받는 것',
    layers: [
      {
        link: '충전을 당겨 주는 스킬',
        nodes: [
          { skillId: '257044', label: '속사', note: '한 발마다 충전 시간 단축' },
          { skillId: '260242', label: '정밀 사격', kind: 'buff', note: '소비할 때마다 집중력으로 1초 단축' },
          { skillId: '56641', label: '고정 사격', note: '한 번에 2초 단축' },
          { skillId: '288613', label: '정조준', note: '충전이 돌아오는 속도 40% 증가' },
        ],
      },
      {
        link: '충전이 더 빨리 찬다',
        nodes: [
          { skillId: '19434', label: '조준 사격', kind: 'core', note: '집중 35 · 2.5초 시전 · 충전 2회, 한 충전 15초. 두 충전이 다 찬 채로 두면 다음 충전이 멈춥니다.' },
        ],
      },
      {
        link: '쏘면 돌려주는 것',
        nodes: [
          { skillId: '260242', label: '정밀 사격', kind: 'buff', note: '다음 신비한 사격·일제 사격을 강화' },
          { skillId: '391559', label: '쇄도 사격', kind: 'talent', note: '15% 확률로 속사 초기화' },
        ],
      },
    ],
    loop: '돌려받은 정밀 사격과 속사가 다시 맨 위에서 다음 조준 사격 충전을 당깁니다.',
  },

  '정밀 사격 하나에 두 가지 이득이 붙습니다': {
    title: '정밀 사격이 도는 길',
    layers: [
      {
        nodes: [
          { skillId: '19434', label: '조준 사격', kind: 'core', note: '쏘면 정밀 사격이 준비됩니다' },
        ],
      },
      {
        link: '준비',
        nodes: [
          { skillId: '260242', label: '정밀 사격', kind: 'buff', note: '다음 소비 스킬 피해 50% 증가 · 집중 60% 절감' },
        ],
      },
      {
        link: '소비처 — 상황에 맞는 하나',
        nodes: [
          { skillId: '185358', label: '신비한 사격', tag: '단일', note: '집중 40 → 16' },
          { skillId: '257620', label: '일제 사격', tag: '적 여럿', note: '집중 30 → 12' },
          { skillId: '53351', label: '마무리 사격', tag: '쓸 수 있을 때', note: '피해 증가를 받으니 강화 소비 자리에' },
          { skillId: '466930', label: '검은 화살', tag: '어둠 순찰자', note: '마무리 사격 자리를 대신함' },
        ],
      },
      {
        link: '소비할 때마다',
        nodes: [
          { skillId: '378767', label: '집중력', kind: 'talent', note: '조준 사격 충전 1초 단축' },
          { skillId: '466872', label: '척후병의 징표', kind: 'buff', note: '강화 공격이 맞으면 확률로 생김 · 다음 조준 사격 피해 증가 (파수꾼은 파수꾼의 표식)' },
        ],
      },
    ],
    loop: '당겨진 충전과 징표가 붙은 대상에게 다음 조준 사격을 쏘면 맨 위로 돌아갑니다.',
    note: '예외: 조준 사격 바로 다음에 속사를 쓴다면 사이에 소비를 끼우지 않아도 됩니다. 쏟아내기가 속사 시작에 자동 신비한 사격을 쏴서 정밀 사격을 가져갑니다.',
  },

  '속사와 조준 사격은 서로 시간을 벌어 줍니다': {
    title: '속사와 조준 사격이 서로 돌려주는 것',
    layers: [
      {
        nodes: [
          { skillId: '257044', label: '속사', kind: 'core', note: '2초 정신 집중 · 쿨다운 16초 · 이동 중 사용 가능. 중간에 끊으면 아래 감소분도 잃습니다.' },
        ],
      },
      {
        link: '속사가 조준 사격에 주는 것',
        nodes: [
          { skillId: '1273132', label: '조준하기', kind: 'talent', note: '한 발마다 충전 0.5초 단축 · 7발 3.5초, 빠른 사격 10발 5초' },
          { skillId: '389020', label: '총알 세례', kind: 'buff', note: '다음 조준 사격 20% 강화 · 물량 공세면 한 번 더' },
          { skillId: '473385', label: '조준경은 거들 뿐', kind: 'talent', note: '속사가 정밀 사격도 줌' },
        ],
      },
      {
        link: '당겨지고 강화된',
        nodes: [
          { skillId: '19434', label: '조준 사격', kind: 'core', note: '속사 직후 총알 세례를 받은 조준 사격을 실제로 쐈는지 확인' },
        ],
      },
      {
        link: '조준 사격이 속사에 돌려주는 것',
        nodes: [
          { skillId: '391559', label: '쇄도 사격', kind: 'talent', note: '15% 확률로 속사 초기화' },
          { skillId: '1277546', label: '화력 집중', kind: 'talent', note: '초기화로 돌아온 속사 20% 강화' },
        ],
      },
    ],
    loop: '초기화된 속사는 오래 들고 있지 말고 바로 써서 맨 위부터 다시 돕니다.',
  },

  '폭발 사격은 쿨다운을 되돌려 줍니다': {
    title: '폭발 사격이 쿨다운을 되돌리는 길',
    layers: [
      {
        nodes: [
          { skillId: '212431', label: '폭발 사격', kind: 'core', note: '집중 20 · 쿨다운 30초 · 즉시' },
        ],
      },
      {
        link: '지속 피해',
        nodes: [
          { label: '1초마다 피해', kind: 'effect', note: '기본 3초 · 주 대상 피해 + 주변 8야드에 50%' },
          { skillId: '471369', label: '정밀 폭파', kind: 'talent', note: '지속시간 +1초' },
          { label: '시즌 2 2세트', kind: 'effect', tag: '세트 효과', note: '지속시간 +1초' },
        ],
      },
      {
        link: '시즌 2 4세트 — 피해가 한 번 들어갈 때마다',
        nodes: [
          { skillId: '19434', label: '조준 사격', note: '쿨다운 0.5초 단축' },
          { skillId: '257044', label: '속사', note: '쿨다운 0.5초 단축' },
        ],
      },
      {
        link: '같은 칸의 선택 특성 — 운용이 갈림',
        nodes: [
          { skillId: '473520', label: '유동성 제동장치', kind: 'talent', note: '폭발 사격 뒤 3초 안에 한 번 더' },
          { skillId: '1301406', label: '전술 재장전', kind: 'talent', note: '폭발 사격마다 실탄 장전 → 다음 조준 사격을 즉시, 집중 없이' },
        ],
      },
    ],
    note: '4세트 감소는 맞은 적 수가 아니라 지속 피해가 들어간 횟수로 셉니다. 서로 다른 두 적에게 따로 걸면 감소도 두 갈래로 들어옵니다.',
  },

  '광역은 교묘한 사격 켜기부터': {
    title: '교묘한 사격을 켜고 튕기는 순서',
    layers: [
      {
        link: '켜는 방법',
        nodes: [
          { skillId: '257620', label: '일제 사격', note: '3명 이상 맞히면 켜짐' },
          { skillId: '260243', label: '연발 공격', note: '6초 동안 깔려 있는 동안 계속 켜 줌' },
        ],
      },
      {
        link: '켜지면',
        nodes: [
          { skillId: '257622', label: '교묘한 사격', kind: 'core', note: '다음 조준 사격·속사가 최대 5명에게 튕김 · 튕김 피해는 일반 공격력의 75%' },
        ],
      },
      {
        link: '켜진 상태로 쏘는 스킬',
        nodes: [
          { skillId: '19434', label: '조준 사격', note: '교묘한 사격이 없으면 한 명만 맞힘' },
          { skillId: '257044', label: '속사', note: '교묘한 사격이 없으면 한 명만 맞힘' },
        ],
      },
      {
        link: '함께 고르는 선택 특성',
        nodes: [
          { skillId: '400456', label: '연사', kind: 'talent', note: '연발 공격에 맞은 적 최대 2명에게 폭발 사격이 저절로 걸림' },
          { skillId: '470945', label: '히드라의 상', kind: 'talent', tag: '두 대상 전투', note: '조준 사격·속사가 추가 대상 한 명에게 35% · 일제 사격 3명 적중을 기다리지 않음' },
        ],
      },
    ],
  },

  '파수꾼: 표식을 만들고 조준 사격으로 거둡니다': [
    {
      title: '파수꾼의 표식을 만들고 거두는 길',
      layers: [
        {
          nodes: [
            { skillId: '260242', label: '정밀 사격', kind: 'buff', note: '신비한 사격·일제 사격으로 소비' },
          ],
        },
        {
          link: '강화 공격이 맞으면 확률로',
          nodes: [
            { skillId: '1253601', label: '파수꾼의 표식', kind: 'buff', note: '척후병의 징표 대신 남음 · 다음 조준 사격 피해 증가' },
            { skillId: '1253825', label: '달의 축복', kind: 'talent', note: '표식이 붙을 때마다 조준 사격 1초 단축' },
          ],
        },
        {
          link: '표식 있는 대상에게',
          nodes: [
            { skillId: '19434', label: '조준 사격', kind: 'core', note: '추가 피해 · 표식 소비' },
          ],
        },
        {
          link: '표식이 소비되면',
          nodes: [
            { skillId: '1253732', label: '달의 폭풍', note: '주변에 비전 피해' },
          ],
        },
      ],
      loop: '적이 여럿이면 표식 없는 적에게 소비해 새 표식을 만들고, 표식 있는 적에게 조준 사격을 쏩니다.',
    },
    {
      title: '정조준 뒤에 따로 챙기는 것',
      layers: [
        {
          nodes: [
            { skillId: '288613', label: '정조준', note: '쓴 뒤 15초 동안' },
          ],
        },
        {
          link: '15초 안에 한 번, 저절로 나가지 않음',
          nodes: [
            { skillId: '1264949', label: '달빛 회전 표창', kind: 'core', note: '남은 시간이 넉넉하면 주력기 사이에, 곧 끝나면 다른 소비보다 먼저' },
            { skillId: '1266069', label: '추적과 타격', kind: 'talent', note: '표창이 실탄 장전도 줌' },
          ],
        },
      ],
    },
  ],

  '어둠 순찰자: 준비와 사용을 구분합니다': [
    {
      title: '검은 화살이 열리는 조건',
      layers: [
        {
          nodes: [
            { skillId: '19434', label: '조준 사격', note: '확률로 죽음의 인도자를 띄움' },
          ],
        },
        {
          link: '예약',
          nodes: [
            { skillId: '1302277', label: '죽음의 인도자', kind: 'buff', note: '다음 조준 사격이 죽음의 강타를 주도록 예약 · 이 단계에서는 검은 화살이 아직 꺼져 있음' },
          ],
        },
        {
          link: '다음 조준 사격을 쏘면',
          nodes: [
            { skillId: '378770', label: '죽음의 강타', kind: 'buff', note: '생명력 조건 없이 검은 화살 사용 가능' },
            { skillId: '469638', label: '영혼 흡수자', kind: 'talent', tag: '지름길', note: '속사가 확정으로 죽음의 강타를 줌 · 속사 직후 검은 화살 확인' },
          ],
        },
        {
          link: '쓸 수 있을 때',
          nodes: [
            { skillId: '466930', label: '검은 화살', kind: 'core', note: '생명력 80% 이상·20% 미만은 조건 없이, 그 밖에는 죽음의 강타가 있어야 함 · 정밀 사격이 있으면 단일 맨 위' },
          ],
        },
      ],
    },
    {
      title: '정조준 뒤에 따로 챙기는 것',
      layers: [
        {
          nodes: [
            { skillId: '288613', label: '정조준', note: '쓴 뒤 15초 동안' },
          ],
        },
        {
          link: '죽음의 통곡을 골랐다면 그 자리가',
          nodes: [
            { skillId: '392060', label: '울부짖는 화살', kind: 'core', note: '시전 시간이 있으니 이동 직전에 몰지 말고 쓸 수 있을 때 처리' },
          ],
        },
      ],
    },
  ],
};

module.exports = { DIAGRAMS };
