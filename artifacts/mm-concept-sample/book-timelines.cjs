// 사격 개념서 딜사이클 타임라인: 굵은 가로줄 위에 스킬 아이콘을 순서대로 놓고,
// 조건이 됐을 때 끼워 넣는 스킬(쿨기·발동·대체)은 줄 위로 올린다(above). 구간 설명은 아이콘 밑 짧은 말(caption)로 쓴다.
// 순서·조건은 같은 가이드의 영웅별 오프닝(heroBranches.*.opener)과 우선순위, 해당 장 본문에서만 가져온다.
// 형식: { title, intro?, rails: [{ label, kind?: 'inserts', loop?: true, nodes: [{ skillId, caption?, above?: { skillId, when } }], note? }] }

const TIMELINES = {
  '훈련용 허수아비로 하는 첫 연습: 단일 대상': {
    title: '단일 딜사이클 타임라인',
    intro: '굵은 줄이 손이 가는 순서입니다. 줄 위로 올라간 스킬은 그 조건이 됐을 때 그 자리에 끼워 넣습니다. 아이콘에 마우스를 올리면 스킬 설명이 뜹니다.',
    rails: [
      {
        label: '오프닝 — 파수꾼 (시즌 2 · 유동성 제동장치 · 연발 공격 예시)',
        nodes: [
          { skillId: '257284', caption: '전투 전' },
          { skillId: '19434', caption: '풀 카운트에 맞춰 사전 시전' },
          { skillId: '212431', caption: '지속 피해' },
          { skillId: '212431', caption: '유동성 제동장치면 3초 안에 한 번 더' },
          { skillId: '260243', caption: '골랐다면' },
          { skillId: '288613', caption: '공격 가능한 구간' },
          { skillId: '257044', caption: '정조준 직후' },
          { skillId: '19434', caption: '총알 세례 회수' },
          { skillId: '185358', caption: '정밀 사격 소비' },
          { skillId: '19434', caption: '이후 반복 흐름으로' },
        ],
        note: '전술 재장전이면 두 번째 폭발 사격을 생략하고 실탄 장전 상태를 봅니다. 마지막 단계 뒤에는 정해진 순서가 아니라 아래 반복 흐름으로 돌아갑니다.',
      },
      {
        label: '오프닝 — 어둠 순찰자',
        nodes: [
          { skillId: '257284', caption: '전투 전' },
          { skillId: '19434', caption: '사전 시전' },
          { skillId: '466930', caption: '실제 사용 가능할 때' },
          { skillId: '212431', caption: '지속 피해' },
          { skillId: '212431', caption: '유동성 제동장치면 한 번 더' },
          { skillId: '260243', caption: '골랐다면' },
          { skillId: '288613' },
          { skillId: '19434' },
          { skillId: '466930', caption: '사용 가능 · 정밀 사격 소비' },
          { skillId: '257044', caption: '이후 반복 흐름으로' },
        ],
        note: '공개 작성자마다 일부 순서가 다릅니다. 첫 검은 화살은 실제 사용 가능 조건을 확인하고 씁니다.',
      },
      {
        label: '반복 흐름 — 단일 (파수꾼·어둠 순찰자 공통)',
        loop: true,
        nodes: [
          { skillId: '19434', caption: '2충전 전에', above: { skillId: '212431', when: '쿨이 돌면 먼저' } },
          { skillId: '185358', caption: '정밀 사격 소비', above: { skillId: '53351', when: '쓸 수 있으면 대신' } },
          { skillId: '19434', above: { skillId: '288613', when: '쿨이 돌면' } },
          { skillId: '257044', caption: '준비되면 · 끝까지 유지', above: { skillId: '260243', when: '골랐다면 · 쿨이 돌면' } },
          { skillId: '19434', caption: '총알 세례 회수', above: { skillId: '19434', when: '실탄 장전 뜨면 즉시' } },
          { skillId: '185358', caption: '정밀 사격 소비', above: { skillId: '56641', when: '집중 부족하면 대신' } },
        ],
        note: '초기화된 속사는 바로 다시 씁니다. 조준 사격 바로 뒤에 속사를 쓴다면 사이에 소비를 끼우지 않아도 됩니다. 조준 사격이 곧 2충전이면 소비보다 조준 사격이 먼저입니다.',
      },
      {
        label: '영웅 특성별로 끼워 넣는 것',
        kind: 'inserts',
        nodes: [
          { skillId: '1264949', caption: '파수꾼 · 정조준 뒤 15초 안에 한 번' },
          { skillId: '19434', caption: '파수꾼 · 표식 있는 대상에게' },
          { skillId: '466930', caption: '어둠 순찰자 · 쓸 수 있고 정밀 사격 있으면 맨 먼저' },
          { skillId: '392060', caption: '어둠 순찰자 · 죽음의 통곡 · 정조준 뒤 15초' },
        ],
      },
    ],
  },

  '광역은 교묘한 사격 켜기부터': {
    title: '광역 딜사이클 타임라인 (적 셋 이상)',
    intro: '교묘한 사격이 켜져 있는지부터 봅니다. 줄 위로 올라간 쿨기는 조건이 되면 그 자리에 끼워 넣습니다.',
    rails: [
      {
        label: '반복 흐름 — 광역 (파수꾼·어둠 순찰자 공통)',
        loop: true,
        nodes: [
          { skillId: '257620', caption: '3명 이상 적중 → 교묘한 사격', above: { skillId: '260243', when: '적이 멈추면 먼저' } },
          { skillId: '19434', caption: '최대 5명에게 튕김', above: { skillId: '212431', when: '쿨이 돌면 · 오래 살 적에게' } },
          { skillId: '257044', caption: '튕김 · 끝까지 유지', above: { skillId: '212431', when: '다른 큰 적에게 한 번 더' } },
          { skillId: '257620', caption: '정밀 사격 소비', above: { skillId: '288613', when: '쿨이 돌면' } },
          { skillId: '19434', caption: '교묘한 사격 남았는지 확인' },
        ],
        note: '연발 공격이 깔린 6초 동안은 교묘한 사격이 유지되니 일제 사격으로 다시 켤 필요가 없습니다. 교묘한 사격이 꺼졌으면 일제 사격으로 다시 켜고, 집중이 부족하면 고정 사격으로 채웁니다.',
      },
      {
        label: '영웅 특성별로 끼워 넣는 것',
        kind: 'inserts',
        nodes: [
          { skillId: '257620', caption: '파수꾼 · 표식 없는 적에게 소비' },
          { skillId: '19434', caption: '파수꾼 · 표식 있는 적에게' },
          { skillId: '1264949', caption: '파수꾼 · 정조준 뒤 15초 안' },
          { skillId: '466930', caption: '어둠 순찰자 · 쓸 수 있고 정밀 사격 있으면' },
        ],
      },
      {
        label: '두 대상이 오래 함께 있을 때 — 히드라의 상',
        loop: true,
        nodes: [
          { skillId: '19434', caption: '추가 대상에게 35%' },
          { skillId: '257044', caption: '추가 대상에게 35%' },
        ],
        note: '이 빌드에서는 일제 사격 세 명 적중을 기다리지 않습니다.',
      },
    ],
  },
};

module.exports = { TIMELINES };
