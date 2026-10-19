// monk-mistweaver 딜사이클 순서 수정 — 근거: digests/monk-mistweaver.md, events/monk-mistweaver-*.json (치유 전문화라 심크 APL 없음)
const find = (m, prefix) => {
  const block = m.blocks.find(b => b.title.startsWith(prefix));
  if (!block) throw new Error(`장을 찾지 못함: ${prefix}`);
  return block;
};
const tl = block => (Array.isArray(block.timeline) ? block.timeline[0] : block.timeline);
const hero = (m, label) => {
  const h = m.heroBranches.find(x => x.label === label);
  if (!h) throw new Error(`영웅 특성을 찾지 못함: ${label}`);
  return h;
};
const rep = (obj, key, from, to) => {
  if (typeof obj[key] !== 'string' || !obj[key].includes(from)) throw new Error(`원문에 없음: ${String(key)} / ${from}`);
  obj[key] = obj[key].replace(from, to);
};
const row = (rows, id, nth = 0, where = '') => {
  const r = rows.filter(s => s.skillId === id)[nth];
  if (!r) throw new Error(`행 없음 ${where} ${id}#${nth}`);
  return r;
};

module.exports = {
  evidenceNote: '딜사이클 순서 대조(2026-10-20): 12.1.5 이후 WCL 상위 천신의 대변자 레이드 8개·쐐기 8개, 조화의 종사 레이드 5개(쐐기 없음)의 실제 시전 순서를 대조했습니다. 천신의 대변자 레이드에서 집중의 천둥 차 다음 버튼은 소생의 안개 84%, 바로 앞 버튼은 질풍차기 41%였고 풀 직후에도 8개 중 6개가 차 → 소생의 안개 순서였습니다. 그래서 오프닝의 소생의 안개 → 차 → 질풍차기를 질풍차기 → 차 → 소생의 안개로 고쳤습니다. 조화의 종사는 차 다음 버튼이 질풍차기 90%였고 그 뒤 셰이룬의 선물과 번갈아 썼으므로, 오프닝·광역 흐름의 차 → 포용의 안개·생기 충전을 차 → 질풍차기 → 셰이룬의 선물로 고쳤습니다. 쐐기 해오름차기 빌드는 차 다음 해오름차기 83%라 반복 흐름 note에 적었습니다.',
  changelog: [
    '- 천신의 대변자 오프닝(2부 타임라인·영웅 탭 피해 준비): 소생의 안개 → 집중의 천둥 차 → 질풍차기 → 생기 충전 → 천신합일 → … ⇒ 소생의 안개 → 질풍차기 → 집중의 천둥 차 → 소생의 안개 → 생기 충전 → 천신합일 → … (근거: 레이드 차 119회 중 다음 버튼 소생의 안개 84%·질풍차기 7%, 앞 버튼 질풍차기 41%, 풀 직후 차 → 소생의 안개 8개 중 6개. 예: https://www.warcraftlogs.com/reports/tZPXha6kfjrbDB4N#fight=38&source=1055)',
    '- 조화의 종사 오프닝(2부 타임라인·영웅 탭): … 집중의 천둥 차 → 포용의 안개 → 생기 충전 → 기의 고치 → 마나 차 ⇒ … 집중의 천둥 차 → 질풍차기 → 셰이룬의 선물 → 포용의 안개 → 기의 고치 → 마나 차 (근거: 차 68회 중 다음 버튼 질풍차기 90%, 질풍차기 다음 셰이룬의 선물 47%, 로그 5개 중 4개가 차 뒤 질풍차기·셰이룬의 선물을 번갈아 씀. 예: https://www.warcraftlogs.com/reports/AaGPxMCWmRgqjbtf#fight=1&source=4)',
    '- 조화의 종사 광역 흐름(2부 타임라인·영웅 탭 파티·공대 피해): 차 → 생기 충전 → 셰이룬의 선물 ⇒ 차 → 질풍차기 → 셰이룬의 선물 → … 생기 충전 (같은 근거)',
    '- 2부 "첫 연습" 반복 흐름: 차의 끼워 넣기 조건 "질풍차기·소생을 비운 뒤" ⇒ "질풍차기 직후 · 다음 주문 강화", note에 영웅·빌드별 차 다음 버튼(천신 레이드 소생의 안개, 조화·쐐기 해오름차기 빌드는 차기)을 적음. 2부 오프닝·광역 장 본문을 같은 순서로 맞춤',
    '- 천신합일 앞뒤(질풍차기 → 천신합일 → 질풍차기·생기 충전)와 천신의 대변자 광역 흐름은 로그와 맞아 유지. 풀 직후 기의 고치(8개 중 5개)는 오프닝 note에만 적음',
  ].join('\n'),
  apply(m) {
    // 2부 첫 연습 — 반복 흐름의 차 끼워 넣기 조건
    const d1 = find(m, '첫 연습');
    const r0 = tl(d1).rails[0];
    const teaNode = r0.nodes.find(n => n.above && n.above.skillId === '116680');
    if (!teaNode) throw new Error('첫 연습 차 위쪽 가지 없음');
    teaNode.above = {skillId: '116680', when: '질풍차기 직후 · 다음 주문 강화'};
    r0.note = '해오름차기 빌드라면 질풍차기 자리에 해오름차기를 쓰고, 빈 시간은 후려차기와 범의 장풍으로 채웁니다. 집중의 천둥 차 뒤에는 천신의 대변자 레이드 견본은 소생의 안개를, 조화의 종사와 해오름차기 빌드는 질풍차기·해오름차기를 바로 씁니다.';

    // 2부 쿨기와 오프닝
    const d2 = find(m, '쿨기와 오프닝');
    rep(d2.paragraphs, 0, '피해 전에 소생의 안개를 다칠 사람들에게 퍼뜨리고, 대상이 모자라면 집중의 천둥 차와 소생의 안개로 보강합니다. 질풍차기로 기본 치유를 잇고, 소생 대상 여러 명이 다치면 생기 충전으로 회복합니다.', '피해 전에 소생의 안개를 다칠 사람들에게 퍼뜨립니다. 대상이 모자라면 질풍차기를 먼저 쓴 뒤 집중의 천둥 차를 쓰고, 바로 강화된 소생의 안개로 보강합니다. 소생 대상 여러 명이 다치면 생기 충전으로 회복합니다.');
    rep(d2.paragraphs, 1, '피해가 시작되는 순간 집중의 천둥 차로 저장한 효과를 꺼냅니다. 그 뒤 위험한 사람에게 포용의 안개를 쓰고, 다음 큰 단일 피해에는 기의 고치를 따로 배정합니다.', '피해가 시작되는 순간 집중의 천둥 차로 저장한 효과를 꺼냅니다. 차 뒤에는 질풍차기를 바로 쓰고 셰이룬의 선물과 번갈아 회복합니다. 위험한 사람에게는 포용의 안개를 쓰고, 다음 큰 단일 피해에는 기의 고치를 따로 배정합니다.');
    const cRail = tl(d2).rails[0];
    cRail.nodes = [
      {skillId: '115151', caption: '피해 전 · 충전 여유'},
      {skillId: '467307', caption: '차 전에 먼저'},
      {skillId: '116680', caption: '다음 소생 강화'},
      {skillId: '115151', caption: '차 직후 바로'},
      {skillId: '116670', caption: '소생 대상 여럿 부상'},
      {skillId: '443028', caption: '근거리 다수 부상'},
      {skillId: '467307', caption: '옥룡의 마음 중 회수'},
      {skillId: '115151', caption: '돌아온 충전'},
      {skillId: '116670', caption: '부상이 이어지면'},
    ];
    cRail.note = '천신합일이 끝나면 내면의 단결이 자동으로 발동합니다. 따로 누르는 단계가 아닙니다. 다음 피해에 쓸 위론과 재활은 여기서 같이 쓰지 않습니다. 풀 직후 큰 타격이 바로 오는 네임드라면 기의 고치를 먼저 줍니다(상위 레이드 로그 8개 중 5개).';
    const hRail = tl(d2).rails[1];
    hRail.nodes = [
      {skillId: '115151', caption: '첫 피해 전'},
      {skillId: '467307', caption: '안전하게 칠 수 있으면'},
      {skillId: '116670', caption: '아군이 다치면'},
      {skillId: '116680', caption: '활력 준비 · 피해 시작'},
      {skillId: '467307', caption: '차 뒤 바로'},
      {skillId: '399491', caption: '질풍과 번갈아'},
      {skillId: '124682', caption: '위험 대상에게'},
      {skillId: '116849', caption: '다음 큰 단일 피해'},
      {skillId: '115869', caption: '피해가 약한 구간'},
    ];

    // 2부 광역 치유 흐름 — 조화의 종사
    const d3 = find(m, '광역 치유 흐름');
    rep(d3.paragraphs, 2, '저장한 활력을 집중의 천둥 차로 실제 다중 피해에 꺼냅니다. 소생 대상 여러 명이 다쳤으면', '저장한 활력을 집중의 천둥 차로 실제 다중 피해에 꺼냅니다. 차 뒤에는 질풍차기를 바로 쓰고, 소생 대상 여러 명이 다쳤으면');
    const harmRail = tl(d3).rails.find(r => r.label.includes('조화의 종사'));
    if (!harmRail) throw new Error('조화의 종사 광역 rail 없음');
    harmRail.nodes = [
      {skillId: '115151', caption: '다음 회수 대상 준비'},
      {skillId: '116680', caption: '저장한 활력을 피해에'},
      {skillId: '467307', caption: '차 뒤 바로'},
      {skillId: '399491', caption: '실제 큰 피해에 맞춰', above: {skillId: '115310', when: '다른 큰 치유가 없으면'}},
      {skillId: '115151', caption: '돌아온 충전'},
      {skillId: '116670', caption: '남은 부상 회수', above: {skillId: '322118', when: '긴 광역 피해면'}},
    ];

    // 영웅 탭: 천신의 대변자 피해 준비
    const c = hero(m, '천신의 대변자');
    const cs = c.opener.steps;
    const cRm1 = row(cs, '115151', 0, '천신'), cTea = row(cs, '116680', 0, '천신'), cRwk1 = row(cs, '467307', 0, '천신'), cViv1 = row(cs, '116670', 0, '천신'),
      cCond = row(cs, '443028', 0, '천신'), cRwk2 = row(cs, '467307', 1, '천신'), cRm2 = row(cs, '115151', 1, '천신'), cViv2 = row(cs, '116670', 1, '천신');
    c.opener.summary = '천신합일을 배정한 피해의 예시입니다. 질풍차기 뒤 집중의 천둥 차로 소생의 안개를 강화해 대상을 늘리고, 종료 뒤 자동 내면의 단결과 옥룡의 마음을 회수하며 다음 피해의 위론·재활까지 동시에 쓰지 않습니다.';
    c.opener.steps = [
      cRm1,
      {...cRwk1, phase: '차 준비', note: '집중의 천둥 차를 쓰기 직전에 질풍차기를 먼저 씁니다. 아침 바람을 골랐다면 차가 질풍차기 쿨다운을 당겨 주므로 먼저 써야 손해가 없습니다. 해오름차기 선택 빌드는 해오름차기로 바꿉니다.'},
      {...cTea, note: '바로 다음 소생의 안개를 강화합니다. 상위 공격대 로그에서 차 다음 버튼은 대부분 소생의 안개였습니다. 피해가 한참 남았으면 큰 쿨기와 억지로 겹치지 않습니다.'},
      {skillId: '115151', label: '소생의 안개', phase: '대상 보강', trigger: '집중의 천둥 차 직후', note: '강화된 소생의 안개를 다칠 대상에게 바로 써서 생기 충전이 닿을 대상을 늘립니다.'},
      cViv1,
      cCond,
      cRwk2,
      cRm2,
      cViv2,
    ];

    // 영웅 탭: 조화의 종사 피해 준비·광역
    const h = hero(m, '조화의 종사');
    const hs = h.opener.steps;
    const hRm = row(hs, '115151', 0, '조화'), hRwk = row(hs, '467307', 0, '조화'), hViv = row(hs, '116670', 0, '조화'), hTea = row(hs, '116680', 0, '조화'),
      hEnv = row(hs, '124682', 0, '조화'), hCoc = row(hs, '116849', 0, '조화'), hMana = row(hs, '115869', 0, '조화');
    h.opener.summary = '천신합일 없이 활력을 모아 집중의 천둥 차로 실제 부상 시점에 꺼냅니다. 차 뒤에는 질풍차기를 바로 쓰고 셰이룬의 선물과 번갈아 회복합니다. 저장 효과와 직접 구조 주문을 따로 판단합니다.';
    h.opener.steps = [
      hRm,
      hRwk,
      hViv,
      hTea,
      {skillId: '467307', label: '질풍차기', phase: '저장 효과 사용', trigger: '집중의 천둥 차 직후', note: '차 바로 뒤에 질풍차기를 씁니다. 상위 공격대 로그는 차 다음 버튼이 거의 언제나 질풍차기였고, 그 뒤 셰이룬의 선물과 번갈아 썼습니다.'},
      {skillId: '399491', label: '셰이룬의 선물', phase: '저장 효과 사용', trigger: '실제 피해 구간', note: '실제로 다친 사람이 있는 피해 구간이면 질풍차기와 번갈아 씁니다. 가벼운 피해에 소모해서 다음 급락의 회복 수단을 없애지 않습니다.'},
      {...hEnv, trigger: '위험 대상 존재', note: '포용의 안개와 강화 선택을 위험 대상에게 씁니다. 이미 한 명이 급사 중이면 저장 준비보다 즉시 구조가 먼저입니다.'},
      hCoc,
      hMana,
    ];
    const ha = h.aoe.priority;
    const aRm = row(ha, '115151', 0, '조화 광역'), aTea = row(ha, '116680', 0, '조화 광역'), aViv = row(ha, '116670', 0, '조화 광역'), aGift = row(ha, '399491', 0, '조화 광역');
    const aRest = ha.filter(r => !['115151', '116680', '116670', '399491'].includes(r.skillId));
    h.aoe.priority = [
      aRm,
      aTea,
      {skillId: '467307', label: '질풍차기', note: '집중의 천둥 차 직후에 써서 피해와 치유를 함께 냅니다. 상위 공격대 로그는 차 다음 버튼이 대부분 질풍차기였습니다.'},
      aGift,
      aViv,
      ...aRest,
    ];
    return m;
  },
};
