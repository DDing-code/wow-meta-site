// shaman-elemental 딜사이클 순서 수정 — 근거: digests/shaman-elemental.md, apl/shaman_elemental.simc
// 지난 라운드에 고친 것(단일 반복 줄의 전격의 불길·화염 충격 설명)은 그대로 둔다.
// 1) 선견자 단일 오프닝: 폭풍수호자 강화 번개 화살 두 번을 승천 전에 쓰고, 사전 시전 용암 폭발과 승천 전 전격의 불길을 뺀다.
//    (레이드 로그 7개 중 5개가 강화 번개 화살을 승천 전에 씀, 사전 시전 용암 폭발은 1개, 승천 전 전격의 불길은 2개.
//     APL single_target 의 lightning_bolt,if=set_bonus.mid2_4pc&buff.stormkeeper.up&cooldown.ascendance.remains<2*gcd
//     와 flame_shock/voltaic_blaze 의 cooldown.ascendance.remains>5 조건, precombat 에 lava_burst 없음)
// 2) 선견자 광역 진입: 전격의 불길로 풀을 열고, 폭풍수호자 강화 연쇄 번개 두 번을 승천 전에 쓴다(쐐기 풀 15개 중 13개가 전격의 불길을 폭풍수호자보다 먼저 씀,
//    폭풍수호자·승천을 쓴 풀 10개 중 7개가 강화 연쇄 번개 두 번을 승천 전에 씀, 승천 다음 지진 8개. APL aoe 의 chain_lightning,if=buff.stormkeeper.up&…&set_bonus.mid2_4pc 가 ascendance 위).
// 3) 광역 반복 줄: 전격의 불길 → 용암 폭발 → 지진 (쐐기 로그 8개에서 전격의 불길 다음 용암 폭발 58%, 지진 7%).
// 4) 폭풍인도자 오프닝: 로그는 없지만 APL 이 폭풍인도자도 강화 번개 화살을 승천 전에 쓰라고 적어 같은 자리로 옮긴다.
//    나머지(전격의 불길 위치 등)는 근거가 APL 하나라 그대로 둔다.
// 상단 opener·priority 는 건드리지 않는다.
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const rep = (text, from, to) => { if (!text.includes(from)) throw new Error('바꿀 문장을 못 찾음: ' + from.slice(0, 30)); return text.replace(from, to); };
const clone = x => JSON.parse(JSON.stringify(x));

module.exports = {
  evidenceNote: '딜사이클 순서 대조(2026-10-20): 12.1.5 이후 WCL 상위 레이드 7개·쐐기 8개(모두 선견자)의 실제 시전 순서와 심크 APL(midnight d91a5707)을 대조해, 선견자 오프닝과 광역 진입에서 폭풍수호자 강화 번개 화살·연쇄 번개 두 번을 승천 전에 쓰도록 고치고, 오프닝의 사전 시전 용암 폭발과 승천 전 전격의 불길을 뺐으며, 광역은 전격의 불길로 시작해 바로 용암 폭발로 잇도록 바꿨습니다. 폭풍인도자는 로그가 없어 APL에 적힌 강화 번개 화살 위치만 맞췄습니다.',
  changelog: [
    '- 선견자 단일 오프닝: 폭풍수호자 → 용암 폭발(사전 시전) → 선조의 신속함 → 용암 폭발 → 전격의 불길 → 승천 → 강화 번개 화살 → 정기 작렬 을 폭풍수호자 → 강화 번개 화살 → 강화 번개 화살 → 선조의 신속함 → 승천 → 용암 폭발 → 정기 작렬 → 용암 폭발 로 바꿈 (근거: 레이드 로그 7개 중 5개가 강화 번개 화살을 승천 전에 씀, 사전 시전 용암 폭발 1개, 승천 전 전격의 불길 2개, 승천 뒤 용암 폭발·정기 작렬 교대 5개. 예: https://www.warcraftlogs.com/reports/nRWZVA2J3NKHxqPw#fight=35&source=3. APL single_target 의 lightning_bolt prespend 줄, flame_shock/voltaic_blaze 의 cooldown.ascendance.remains>5).',
    '- 선견자 광역 진입: 폭풍수호자 → 선조의 신속함 → 전격의 불길 → 승천 → 용암 폭발 → 강화 연쇄 번개 를 전격의 불길 → 폭풍수호자 → 강화 연쇄 번개 → 선조의 신속함 → 승천 → 지진 → 용암 폭발 로 바꾸고, 영웅 탭 광역 우선순위도 전격의 불길 → 폭풍수호자 → 강화 연쇄 번개 → 선조의 신속함 → 승천 → 용암 폭발(정화의 불길) → 지진 → 정기 작렬 → 연쇄 번개 로 맞춤 (근거: 쐐기 광역 풀 15개 중 13개가 전격의 불길을 폭풍수호자보다 먼저 씀, 폭풍수호자·승천을 쓴 풀 10개 중 7개가 강화 연쇄 번개 두 번을 승천 전에 씀, 승천 다음 지진 10개 중 8개. APL aoe 의 stormkeeper 강화 chain_lightning 줄이 ascendance 위, earthquake,if=buff.call_of_the_ancestors.up).',
    '- 광역 반복 줄: 연쇄 번개(위 전격의 불길) → 지진 → 연쇄 번개 → 용암 폭발 → 연쇄 번개 → 지진 을 전격의 불길 → 용암 폭발 → 지진 → 연쇄 번개 → 연쇄 번개 → 지진 으로 바꿈 (근거: 쐐기 로그 8개 전격의 불길 1,275회 중 바로 다음 용암 폭발 58%·지진 7%, 용암 폭발 다음 지진 25%).',
    '- 단일 우선순위·단일 반복 줄의 승천 설명을 "강화 번개 화살 두 번 뒤"로 맞춤(순서는 그대로). 3부 쐐기 장 본문·예시의 광역 시작 순서도 같은 순서로 맞춤.',
    '- 폭풍인도자 오프닝: 강화 번개 화살을 승천 뒤에서 폭풍수호자 바로 뒤로 옮김 (근거: 12.1.5 이후 상위 로그 없음. APL single_target 주석 "Prespend SK charges before going into Ascendance - Farseer only in 1t, SB in both 1t and 2t"). 나머지 순서는 근거가 APL 하나라 그대로 둠.',
  ].join('\n'),
  apply(m) {
    const fs = m.heroBranches.find(h => h.label === '선견자');
    const sb = m.heroBranches.find(h => h.label === '폭풍인도자');
    if (!fs || !sb) throw new Error('영웅 특성 이름이 다름');
    const pick = (rows, id, nth = 1) => { let c = 0; const r = rows.find(x => x.skillId === id && ++c === nth); if (!r) throw new Error('행 없음 ' + id); return clone(r); };

    // ── 1. 선견자 단일 오프닝 ──
    const o = fs.opener.steps;
    const sk = pick(o, '191634');
    sk.phase = '전투 전';
    sk.trigger = '전투 약 3초 전';
    const lb1 = {skillId: '188196', label: '강화 번개 화살', phase: '전투 시작', trigger: '폭풍수호자 강화 1',
      note: '폭풍수호자로 즉시 시전이 된 강화 번개 화살을 전투 시작에 바로 씁니다. 여러 적이면 연쇄 번개로 바꿉니다.'};
    const lb2 = {skillId: '188196', label: '강화 번개 화살', phase: '승천 전', trigger: '폭풍수호자 강화 2',
      note: '남은 강화도 승천 전에 다 씁니다. 4세트라면 폭풍수호자가 끝나며 생기는 강화 생성기 두 번과 무료 소비기를 승천 안에서 쓰게 됩니다.'};
    const anc = pick(o, '443454');
    anc.phase = '승천 직전';
    anc.trigger = '강화 두 번 뒤';
    anc.note = '선조를 부르고 다음 시전 주문을 준비합니다. 이미 즉시 시전인 강화 번개 화살이나 대지 충격으로 소비됐다고 착각하지 않습니다.';
    const asc = pick(o, '114050');
    asc.phase = '극딜 진입';
    asc.trigger = '선조와 함께';
    asc.note = '승천이 시작하며 최대 6명에게 화염 충격을 걸어 주므로 오프닝에서 전격의 불길이나 화염 충격을 따로 먼저 쓰지 않아도 됩니다. 전투 전체 사용 횟수를 잃지 않습니다.';
    const lvb1 = pick(o, '51505', 2);
    lvb1.phase = '승천 구간';
    lvb1.trigger = '신속함으로 소비';
    lvb1.note = '시전 시간이 있는 용암 폭발로 선조의 신속함을 소비해 쿨다운을 시작합니다. 원소의 대가를 골랐다면 다음 강한 주문을 준비합니다.';
    const eb = pick(o, '117014');
    eb.phase = '승천 구간';
    eb.trigger = '원소의 대가·무료 소비';
    eb.note = '용암 폭발 바로 뒤 원소의 대가와 4세트 무료 소비를 정기 작렬에 씁니다. 대지 충격을 골랐다면 대지 충격으로 읽습니다.';
    const lvb2 = {skillId: '51505', label: '용암 폭발', phase: '우선순위 전환', trigger: '승천 중 교대',
      note: '승천 동안 용암 폭발과 소비기를 번갈아 쓰고, 오프닝이 끝나면 단일 우선순위로 돌아갑니다.'};
    fs.opener.steps = [sk, lb1, lb2, anc, asc, lvb1, eb, lvb2];
    fs.opener.summary = '폭풍수호자 강화 번개 화살 두 번을 먼저 쓰고 선조의 신속함·승천을 엽니다. 선조의 신속함은 실제 시전 시간이 있는 주문에 소비해야 쿨다운이 시작됩니다.';

    // ── 1-1. 선견자 단일 우선순위: 순서 그대로, 승천 설명만 ──
    const stAsc = fs.singleTarget.priority.find(r => r.skillId === '114050');
    stAsc.note = '폭풍수호자 강화 번개 화살 두 번을 먼저 쓴 뒤 사용합니다. 선조와 함께 공격할 시간이 남아 있는 대상인지, 기믹으로 시전이 끊길지를 먼저 봅니다.';

    // ── 2. 선견자 광역 우선순위 ──
    const a = fs.aoe.priority;
    const vb = pick(a, '470057');
    vb.label = '풀 시작 전격의 불길';
    vb.note = '탱커가 몹을 모으면 먼저 써서 화염 충격을 겁니다. 정화의 불길을 골랐다면 다음 용암 폭발이 화염 충격을 퍼뜨립니다. 그 뒤에도 쿨마다 씁니다.';
    const aSk = pick(a, '191634');
    const cl1 = {skillId: '188443', label: '강화 연쇄 번개',
      note: '폭풍수호자로 즉시 시전이 된 강화 연쇄 번개 두 번을 승천 전에 씁니다. 4세트라면 폭풍수호자가 끝나며 강화 생성기와 무료 소비기가 생깁니다.'};
    const aAnc = pick(a, '443454');
    const aAsc = pick(a, '114050');
    aAsc.note = '강화 연쇄 번개를 쓴 뒤 선조와 함께 사용합니다. 짧게 사라지는 추가 적 때문에 네임드의 다음 큰 피해 구간을 놓치지 않습니다.';
    const aLvb = pick(a, '51505');
    aLvb.label = '전격 뒤 용암 폭발';
    aLvb.note = '정화의 불길을 골랐다면 전격의 불길 뒤 첫 용암 폭발로 화염 충격을 퍼뜨립니다. 이런 선택 조건이 없는 3대상 구간에 단일 교대 규칙을 강제하지 않습니다.';
    const aEq = pick(a, '61882');
    aEq.note = '기본 정기 작렬 견본은 4대상 이상에서 지진을 봅니다. 승천 직후처럼 선조가 나와 있으면 용암 폭발보다 먼저 깝니다. 다른 선택의 소비 손익과 우선 대상 피해는 별도로 확인합니다.';
    fs.aoe.priority = [vb, aSk, cl1, aAnc, aAsc, aLvb, aEq, pick(a, '117014'), pick(a, '188443')];
    fs.aoe.summary = '몹이 모이면 전격의 불길로 시작하고, 폭풍수호자 강화 연쇄 번개 두 번을 쓴 뒤 선조의 신속함·승천을 엽니다. 2대상부터 생성기를 연쇄 번개로 바꾸고 소비기는 실제 견본의 손익 기준을 적용합니다.';

    // ── 4. 폭풍인도자 오프닝: 강화 번개 화살을 승천 전으로 ──
    const so = sb.opener.steps;
    const sbLb = pick(so, '188196');
    sbLb.phase = '승천 전';
    sbLb.trigger = '폭풍수호자 강화';
    sbLb.note = '폭풍수호자로 강화한 번개 화살 두 번을 승천 전에 씁니다. 여러 대상에서는 연쇄 번개로 바꾸고 폭풍을 단일 버튼으로 오인하지 않습니다.';
    sb.opener.steps = [pick(so, '191634'), sbLb, pick(so, '470057'), pick(so, '114050'), pick(so, '51505'), pick(so, '452201'), pick(so, '117014')];
    const sbAsc = sb.singleTarget.priority.find(r => r.skillId === '114050');
    sbAsc.note = '폭풍수호자 강화 번개 화살 두 번을 먼저 쓴 뒤 사용합니다. 이동이나 대상 변경으로 강화 주문을 버리지 않도록 실제 시전 가능 시간을 봅니다.';

    // ── 2부 단일 장 ──
    const st = m.blocks.find(b => b.title.startsWith('첫 연습은 단일 대상'));
    st.paragraphs[0] = rep(st.paragraphs[0], '승천(폭풍수호자 뒤)', '승천(폭풍수호자 강화 두 번을 쓴 뒤)');
    const stRail = tlOf(st)[0].rails.find(r => r.label.startsWith('평시 반복'));
    const ascNode = stRail.nodes.find(n => n.above?.skillId === '114050');
    if (!ascNode) throw new Error('단일 반복 줄에 승천 가지 없음');
    ascNode.above = {skillId: '114050', when: '강화 번개 두 번 뒤'};

    // ── 2부 오프닝 장 ──
    const op = m.blocks.find(b => b.title.startsWith('쿨기와 오프닝'));
    op.concept = '선견자 오프닝은 전투 약 3초 전 폭풍수호자로 시작해, 강화 번개 화살 두 번을 먼저 쓰고 선조의 신속함으로 선조를 부른 뒤 승천을 엽니다. 오프닝이 끝나면 정해진 순서가 아니라 우선순위로 돌아갑니다.';
    op.paragraphs[0] = rep(op.paragraphs[0],
      '이어서 용암 폭발을 전투 시작에 도착하도록 사전 시전합니다. 화염 충격이 아직 없는 첫 시전에는 확정 치명타를 가정하지 않습니다.',
      '전투가 시작되면 즉시 시전이 된 강화 번개 화살 두 번을 바로 쓰고, 승천은 그 뒤에 엽니다. 4세트를 갖췄다면 폭풍수호자가 끝날 때 생기는 강화 생성기 두 번과 무료 소비기 한 번을 승천 안에서 쓰게 됩니다.');
    op.paragraphs[1] = rep(op.paragraphs[1], '그래서 바로 다음 칸이 용암 폭발입니다.', '그래서 선조의 신속함 뒤 승천을 열고, 그다음 첫 시전 주문인 용암 폭발로 소비합니다.');
    op.paragraphs[2] = '승천은 시작할 때 최대 6명에게 화염 충격을 걸어 주므로, 오프닝에서 전격의 불길이나 화염 충격을 따로 먼저 쓰지 않아도 됩니다. 승천 동안에는 용암 폭발과 정기 작렬을 번갈아 쓰며 원소의 대가와 무료 소비를 챙기고, 선조 구간과 강화 주문을 겹치되 전투 전체 사용 횟수를 잃지 않습니다. 그 뒤 단일 우선순위로 돌아갑니다. 여러 적이면 번개 화살을 연쇄 번개로 바꾸고 광역 장의 진입 순서를 씁니다.';
    op.mistakes[1] = '폭풍수호자 강화 번개 화살을 남긴 채 승천부터 엽니다.';
    const opTl = tlOf(op)[0];
    const fsRail = opTl.rails.find(r => r.label.startsWith('오프닝 — 선견자'));
    fsRail.nodes = [
      {skillId: '191634', caption: '전투 약 3초 전'},
      {skillId: '188196', caption: '강화 번개 화살 1'},
      {skillId: '188196', caption: '승천 전 강화 2'},
      {skillId: '443454', caption: '승천 직전'},
      {skillId: '114050', caption: '화염 충격 자동'},
      {skillId: '51505', caption: '신속함으로 소비'},
      {skillId: '117014', caption: '원소의 대가·무료 소비'},
      {skillId: '51505', caption: '이후 단일 우선순위'},
    ];
    fsRail.note = '강화 번개 화살 두 번은 승천 전에 다 씁니다. 승천이 시작할 때 화염 충격을 걸어 주므로 오프닝에서는 전격의 불길이나 화염 충격을 따로 먼저 쓰지 않아도 됩니다. 정기 작렬은 고른 소비기로 읽습니다.';
    const sbRail = opTl.rails.find(r => r.label.startsWith('오프닝 — 폭풍인도자'));
    sbRail.nodes = [
      {skillId: '191634', caption: '전투 전 시전'},
      {skillId: '188196', caption: '승천 전 강화 두 번'},
      {skillId: '470057', caption: '골랐다면 화염 충격 준비'},
      {skillId: '114050', caption: '폭풍수호자 뒤'},
      {skillId: '51505', caption: '원소의 대가 준비'},
      {skillId: '452201', caption: '발동이 있을 때만'},
      {skillId: '117014', caption: '소용돌이·무료 소비 정리'},
    ];
    sbRail.note = '폭풍인도자에는 선조의 신속함이 없습니다. 강화 번개 화살 두 번은 선견자처럼 승천 전에 씁니다. 첫 풀에 폭풍 발동이 반드시 있다고 가정하지 않고, 없으면 그 칸을 건너뜁니다.';

    // ── 2부 광역 장 ──
    const ao = m.blocks.find(b => b.title.startsWith('광역은 적이 지진 안에'));
    ao.paragraphs[0] = '광역 진입은 전격의 불길 → 폭풍수호자 → 강화 연쇄 번개 두 번 → 선조의 신속함 → 승천 → 지진 순서가 기본입니다. 탱커가 몹을 모으면 전격의 불길로 화염 충격부터 겁니다. 선견자 선조는 화염 충격을 거는 일부 주문에도 반응하므로, 전격의 불길을 승천보다 먼저 써 두면 화염 충격 대상과 선조 반응을 한꺼번에 준비할 수 있습니다. 폭풍수호자로 강화한 연쇄 번개 두 번은 승천 전에 다 쓰고, 승천 뒤 선조가 나와 있는 동안에는 지진부터 깝니다. 승천은 시작할 때 최대 6명에게 화염 충격을 걸고 50% 효율의 용암 폭발을 시전합니다.';
    const aoTl = tlOf(ao)[0];
    const entry = aoTl.rails.find(r => r.label.startsWith('광역 진입 — 선견자'));
    entry.nodes = [
      {skillId: '470057', caption: '몹이 모이면 먼저'},
      {skillId: '191634', caption: '추가 적이 모인 구간'},
      {skillId: '188443', caption: '강화 두 번 먼저'},
      {skillId: '443454', caption: '승천 직전'},
      {skillId: '114050', caption: '선조와 함께'},
      {skillId: '61882', caption: '선조 중 먼저'},
      {skillId: '51505', caption: '전격 뒤 퍼뜨리기'},
    ];
    entry.note = '전격의 불길은 탱커가 몹을 모은 뒤 씁니다. 폭풍수호자로 강화한 연쇄 번개 두 번은 승천 전에 다 씁니다. 선조의 신속함은 시전 주문에 소비합니다.';
    const loop = aoTl.rails.find(r => r.label.startsWith('반복 흐름 — 광역'));
    loop.nodes = [
      {skillId: '470057', caption: '쿨마다 · 몹이 모인 뒤'},
      {skillId: '51505', caption: '정화의 불길로 퍼뜨리기'},
      {skillId: '61882', caption: '적이 머무를 자리에', above: {skillId: '1296626', when: '4세트 무료 지진'}},
      {skillId: '188443', caption: '소용돌이 생성', above: {skillId: '443454', when: '쿨 돌면 선조 부르기'}},
      {skillId: '188443', caption: '선조 중 실제 시전', above: {skillId: '191634', when: '쿨 돌면 강화 연쇄 번개'}},
      {skillId: '61882', caption: '넘치기 전에 비우기'},
    ];
    loop.note = '전격의 불길은 쿨마다 쓰고 바로 용암 폭발로 잇습니다. 적 수가 줄면 단일로 돌아갑니다. 지진은 시전 수가 아니라 적이 머문 시간으로 평가합니다.';

    // ── 3부 쐐기 한 판 ──
    const mp = m.blocks.find(b => b.title.startsWith('쐐기 한 판'));
    mp.paragraphs[0] = rep(mp.paragraphs[0],
      '몹이 멈추면 폭풍수호자 → 선조의 신속함 → 전격의 불길 → 승천으로 광역을 열고,',
      '몹이 멈추면 전격의 불길 → 폭풍수호자 → 강화 연쇄 번개 두 번 → 선조의 신속함 → 승천으로 광역을 열고,');
    mp.example = {...mp.example, text: rep(mp.example.text,
      '폭풍수호자와 선조의 신속함, 전격의 불길, 승천으로 광역을 엽니다.',
      '전격의 불길, 폭풍수호자와 강화 연쇄 번개 두 번, 선조의 신속함, 승천으로 광역을 엽니다.')};
    return m;
  },
};
