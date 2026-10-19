// paladin-holy 딜사이클 순서 수정 — 근거: digests/paladin-holy.md, events/paladin-holy-*.json (치유 전문화라 심크 APL 없음)
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

module.exports = {
  evidenceNote: '딜사이클 순서 대조(2026-10-20): 12.1.5 이후 WCL 상위 태양의 사자 레이드 8개·쐐기 3개, 빛의 대장장이 레이드 1개·쐐기 8개의 실제 시전 순서를 대조했습니다. 태양의 사자는 천상의 종 71회 중 60회 이상이 신성 충격 없이 소비기 두세 번으로 바로 이어졌고, 신성 충격·심판으로 자원을 모은 뒤 응징의 격노 → 고결의 봉화 → 천상의 종 순서를 썼습니다. 그래서 오프닝의 "첫 소비 → 신성 충격 → 두 번째 소비"를 "두 소비를 바로 이어 쓴 뒤 신성 충격"으로 고치고 심판을 자원 준비 단계에 넣었습니다. 반복 흐름은 영원의 불꽃 다음 신성 충격(레이드 32%·쐐기 46%)이 심판(10~11%)보다 많아 순서를 바꾸고, 거의 쓰지 않는 신성화(레이드 분당 0.4회·쐐기 0.15회 미만)를 조건부 끼워 넣기로 옮겼습니다. 빛의 대장장이는 상위 로그가 이 가이드 견본과 다른 특성 구성(정의의 방패·천벌의 망치 중심, 고결의 봉화·천상의 종·신성화 거의 없음)이라 바꾸지 않고 보류했습니다.',
  changelog: [
    '- 태양의 사자 오프닝(2부 타임라인·영웅 탭 피해 준비): 빛의 봉화 → 신성 충격 → 응징의 격노 → 고결의 봉화 → 천상의 종 → 영원의 불꽃 → 신성 충격 → 영원의 불꽃 ⇒ 빛의 봉화 → 신성 충격 → 심판 → 응징의 격노 → 고결의 봉화 → 천상의 종 → 영원의 불꽃 → 영원의 불꽃 → 신성 충격 (근거: 천상의 종 71회 중 신성 충격을 사이에 넣은 경우 1회, 소비기 두세 번 연속 60회 이상. 심판은 레이드 오프닝 첫 12번 안에 8개 중 7개. 예: https://www.warcraftlogs.com/reports/DWZGtkCmKyLrQV1a#fight=18&source=4)',
    '- 2부 "첫 연습" 반복 흐름: 신성 충격 → 영원의 불꽃 → 심판 → 신성화 → 신성 충격 → 정의의 방패 ⇒ 신성 충격 → 영원의 불꽃 → 신성 충격 → 심판(위: 신성화, 적이 오래 머물 때만) → 정의의 방패 (근거: 영원의 불꽃 다음 신성 충격 32%·46%, 심판 다음 신성 충격 35~38%, 신성화 분당 0.4회 이하)',
    '- 같은 장 본문(신성화 문장)과 2부 오프닝 본문, 3부 태양의 사자 장의 "첫 소비기 → 생성기 → 두 번째 소비기" 문장을 새 순서에 맞춤',
    '- 빛의 대장장이: 보류(상위 로그가 다른 특성 구성이라 순서만 바꿀 수 없음), 광역 흐름의 오라 숙련·고결의 봉화 선후는 로그가 갈려(고결의 봉화 먼저 8회·뒤 5회) 그대로 둠',
  ].join('\n'),
  apply(m) {
    // 2부 첫 연습 — 반복 흐름
    const d1 = find(m, '첫 연습');
    rep(d1.paragraphs, 0, '신성화는 적이 머무는 위치에 두고,', '신성화는 적이 오래 머무는 위치에서만 넣고,');
    tl(d1).rails[0].nodes = [
      {skillId: '20473', caption: '충전을 놀리지 않기', above: {skillId: '19750', when: '빛 주입과 급한 대상이 있으면'}},
      {skillId: '461432', caption: '3 이상, 가장 다친 한 명', above: {skillId: '85222', when: '여럿이 고르게 다쳐 넘칠 때'}},
      {skillId: '20473', caption: '다음 자원 모으기'},
      {skillId: '20271', caption: '여유가 있으면 빛 주입은 심판', above: {skillId: '26573', when: '적이 오래 머물 때만'}},
      {skillId: '53600', caption: '다음 피해가 멀 때만'},
    ];

    // 2부 쿨기와 오프닝 — 태양의 사자
    const d2 = find(m, '쿨기와 오프닝');
    rep(d2.paragraphs, 0, '신성 충격으로 첫 소비 자원을 준비하되 5에 닿으면 더 만들지 않습니다.', '신성 충격과 심판으로 첫 소비 자원을 준비하되 5에 닿으면 더 만들지 않습니다.');
    rep(d2.paragraphs, 0, '첫 영원의 불꽃을 위험한 사람에게, 신성 충격으로 자원을 다시 모은 뒤 두 번째 영원의 불꽃을 다친 사람에게 씁니다.', '첫 영원의 불꽃을 위험한 사람에게, 두 번째 영원의 불꽃을 바로 이어 다친 사람에게 쓰고, 그다음 신성 충격으로 자원을 다시 모읍니다. 두 번째 소비에 자원이 모자랄 때만 신성 충격을 사이에 넣습니다.');
    const hRail = tl(d2).rails[0];
    hRail.nodes = [
      {skillId: '53563', caption: '영구 봉화 선택 시'},
      {skillId: '20473', caption: '자원 2 이하에서'},
      {skillId: '20271', caption: '자원 모으기'},
      {skillId: '31884', caption: '긴 피해 직전'},
      {skillId: '200025', caption: '고결 선택 시·피해 직전'},
      {skillId: '375576', caption: '여러 명 부상·자원 2 이하'},
      {skillId: '461432', caption: '첫 소비 · 새벽빛'},
      {skillId: '461432', caption: '바로 두 번째 소비'},
      {skillId: '20473', caption: '다음 자원 모으기', above: {skillId: '19750', when: '빛 주입이면 급한 대상에게 먼저'}},
    ];
    hRail.note = '빛의 봉화와 고결의 봉화는 특성에 따라 둘 중 하나만 들어갑니다. 응징의 격노 뒤 티르의 해방은 자동이라 따로 쓰지 않습니다. 상위 공격대 로그는 천상의 종 뒤 신성 충격을 끼우지 않고 소비기 두 번을 바로 이었습니다.';

    // 3부 태양의 사자 장
    const f1 = find(m, '태양의 사자:');
    rep(f1.paragraphs, 1, '시작 기술 뒤에는 첫 소비기, 신성 충격 같은 생성기, 두 번째 소비기를 빠르게 이어 새벽빛 두 개를 실제 부상자에게 남깁니다.', '시작 기술 뒤에는 첫 소비기와 두 번째 소비기를 바로 이어 새벽빛 두 개를 실제 부상자에게 남깁니다. 자원이 모자랄 때만 신성 충격 같은 생성기를 사이에 넣습니다.');

    // 영웅 탭: 태양의 사자 피해 준비
    const h = hero(m, '태양의 사자');
    const rows = h.opener.steps;
    const byId = (id, nth = 0) => {
      const r = rows.filter(s => s.skillId === id)[nth];
      if (!r) throw new Error(`태양의 사자 오프닝 행 없음 ${id}#${nth}`);
      return r;
    };
    const beacon = byId('53563'), shock1 = byId('20473', 0), wings = byId('31884'), virtue = byId('200025'), toll = byId('375576'), ef1 = byId('461432', 0), ef2 = byId('461432', 1);
    h.opener.summary = '봉화 종류와 피해 배정에 맞춘 예시입니다. 천상의 종 뒤에는 신성 충격을 끼우지 않고 두 소비기를 바로 이어 새벽빛을 남기며, 실제 부상자가 없으면 치유를 억지로 시작하지 않습니다.';
    h.opener.steps = [
      beacon,
      shock1,
      {skillId: '20271', label: '심판', phase: '자원 준비', trigger: '신성 충격 쿨다운 중', note: '신성 충격 사이에 심판으로 자원을 더 모읍니다. 빛 주입이 있으면 심판에 써서 추가 신성한 힘을 챙기고, 5에 닿으면 소비가 먼저입니다.'},
      wings,
      virtue,
      toll,
      ef1,
      {...ef2, trigger: '첫 소비 직후·새벽빛 준비', note: '첫 소비 바로 뒤에 다친 대상에게 두 번째 소비를 넣어 새벽빛을 남깁니다. 자원이 모자랄 때만 신성 충격으로 채운 뒤 씁니다.'},
      {skillId: '20473', label: '신성 충격', phase: '다음 자원', trigger: '두 소비 뒤 충전 가능', note: '두 소비가 끝나면 신성 충격으로 다음 자원을 모읍니다. 빛 주입을 얻었다면 급한 대상에 빛의 섬광을 먼저 씁니다.'},
    ];
    return m;
  },
};
