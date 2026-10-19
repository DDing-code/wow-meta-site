// shaman-enhancement 딜사이클 순서 수정 — 근거: digests/shaman-enhancement.md, apl/shaman_enhancement.simc(2026-10-15, 12.1.5 뒤)
// 대조 자료의 '파멸의 바람' 9.2회/분은 Doom Winds(469270)가 승천 중 1초마다 자동으로 찍힌 것이고,
// 바람의 일격·폭풍의 일격·낙뢰와 같은 시각에 찍힌 번개 화살·연쇄 번개·폭풍은 토림의 기원 자동 시전이라 둘 다 빼고 셌다.
// 1) 폭풍인도자 오프닝: 승천 직후 바람의 일격 → 낙뢰 (레이드 8개 모두 승천 바로 다음이 바람의 일격).
//    검사(verify-enhancement-kb.cjs)가 상단 opener 와 폭풍인도자 opener 가 같기를 요구하므로 상단 opener 도 같은 값으로 맞춘다.
// 2) 폭풍인도자 광역 우선순위: 낙뢰를 승천 위로 (쐐기 풀 37개 중 33개가 승천 전에 낙뢰).
// 3) 폭풍인도자 단일·광역 반복 줄: 용암 채찍을 폭풍의 일격 뒤 고정 칸에서 빼고 "폭풍의 일격 충전이 없으면" 가지로 옮김,
//    번개 화살 뒤에는 용암 채찍 대신 낙뢰 (번개 화살 바로 다음 용암 채찍 레이드 0%·쐐기 1%, 폭풍의 일격 44~46%·낙뢰 29~31%.
//    용암 채찍 분당 1.1~1.8회 대 폭풍의 일격 14~17회. APL single_sb 의 stormstrike 가 lava_lash 보다 위).
// 토템술사는 12.1.5 이후 로그가 없어 그대로 둔다.
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const rep = (text, from, to) => { if (!text.includes(from)) throw new Error('바꿀 문장을 못 찾음: ' + from.slice(0, 30)); return text.replace(from, to); };
const clone = x => JSON.parse(JSON.stringify(x));

module.exports = {
  evidenceNote: '딜사이클 순서 대조(2026-10-20): 12.1.5 이후 WCL 상위 레이드 8개·쐐기 8개(모두 폭풍인도자)의 실제 시전 순서와 심크 APL(midnight d91a5707, 10월 15일 갱신)을 대조했습니다. 승천 중 자동으로 찍히는 파멸의 바람과 토림의 기원 자동 번개는 빼고 셌습니다. 폭풍인도자 오프닝에서 승천 직후 바람의 일격을 먼저 쓰도록, 광역에서 낙뢰를 승천보다 먼저 쓰도록 고쳤고, 반복 줄에서 용암 채찍을 폭풍의 일격 충전이 없을 때 끼우는 자리로 옮겼습니다. 토템술사는 상위 로그가 없어 그대로 두었습니다.',
  changelog: [
    '- 폭풍인도자 오프닝: … → 승천 → 다시 준비된 낙뢰 → 바람의 일격 을 … → 승천 → 바람의 일격 → 다시 준비된 낙뢰 로 바꿈 (근거: 레이드 로그 8개 모두 승천 바로 다음이 바람의 일격, 전체 승천 직후 바람의 일격 레이드 27회 중 22회·쐐기 95회 중 66회. 예: https://www.warcraftlogs.com/reports/jVpbr1RdBzhmF2gv#fight=2&source=22). 검사 스크립트가 같기를 요구하는 상단 opener 도 같은 값으로 맞춤.',
    '- 폭풍인도자 광역 우선순위: 전격의 불길 → 세계의 분리 → 승천 → 태고의 폭풍 → 낙뢰 … 를 전격의 불길 → 세계의 분리 → 낙뢰 → 승천 → 태고의 폭풍 … 으로 바꿈 (근거: 쐐기에서 처음 12회 안에 승천을 쓴 풀 37개 중 33개가 승천 전에 낙뢰, 그중 27개는 전격의 불길 → 낙뢰 순서).',
    '- 폭풍인도자 단일 반복 줄: 전격의 불길 → 낙뢰 → 폭풍의 일격 → 용암 채찍 → 번개 화살 → 폭풍의 일격 → 용암 채찍 → 번개 화살 을 전격의 불길 → 낙뢰 → 폭풍의 일격 → 폭풍의 일격(위 용암 채찍: 충전이 없으면) → 번개 화살 → 낙뢰 → 폭풍의 일격 → 번개 화살 로 바꾸고, 광역 반복 줄도 같은 방식으로 용암 채찍을 가지로 옮김 (근거: 번개 화살 바로 다음 용암 채찍 레이드 245회 중 1회·쐐기 729회 중 6회, 폭풍의 일격 44~46%·낙뢰 29~31%, 폭풍의 일격 다음 폭풍의 일격 26~31%. 용암 채찍 분당 1.1~1.8회. APL single_sb 의 stormstrike 줄이 lava_lash 줄보다 위). 같은 장 본문·확인 문제와 1부 정기의 속도 장의 해당 문장을 맞춤.',
    '- 토템술사: 12.1.5 이후 상위 로그가 없어 바꾸지 않음.',
  ].join('\n'),
  apply(m) {
    const sb = m.heroBranches.find(h => h.label === '폭풍인도자');
    if (!sb) throw new Error('폭풍인도자 없음');
    const pick = (rows, id, nth = 1) => { let c = 0; const r = rows.find(x => x.skillId === id && ++c === nth); if (!r) throw new Error('행 없음 ' + id); return clone(r); };
    const sameSt = JSON.stringify(m.priority) === JSON.stringify(sb.singleTarget.priority);

    // ── 1. 폭풍인도자 오프닝 ──
    const o = sb.opener.steps;
    const ws = pick(o, '115356');
    ws.phase = '승천 직후';
    ws.trigger = '승천 바로 다음';
    ws.note = '승천을 연 직후 바로 씁니다. 토림의 기원으로 자원을 소비합니다. 낙뢰가 다시 사용 가능해지면 사이사이 넣습니다.';
    const cl2 = pick(o, '187874', 2);
    cl2.trigger = '바람의 일격 사이';
    cl2.note = '세트·발동으로 돌아왔다면 바람의 일격 사이에 씁니다. 아직 쿨다운이면 바람의 일격을 이어 갑니다.';
    sb.opener.steps = [pick(o, '187874', 1), pick(o, '470057'), pick(o, '197214'), pick(o, '60103'), pick(o, '114051'), ws, cl2];
    m.opener = clone(sb.opener);
    if (sameSt) m.priority = clone(sb.singleTarget.priority);

    // ── 2. 폭풍인도자 광역 우선순위: 낙뢰를 승천 위로 ──
    const a = sb.aoe.priority;
    const aCl = pick(a, '187874');
    aCl.note = '추가 자연 피해를 유지하고 폭풍 해방 발동에 반응합니다. 무리에 들어가면 승천보다 먼저 써 둡니다. 피해가 최대 5명에게 나뉜다는 점을 구분합니다.';
    const aAsc = pick(a, '114051');
    aAsc.note = '낙뢰 강화를 건 뒤 적들이 모이고 공격할 시간이 확보될 때.';
    const rest = a.filter(r => !['470057', '197214', '187874', '114051', '1218090'].includes(r.skillId));
    sb.aoe.priority = [pick(a, '470057'), pick(a, '197214'), aCl, aAsc, pick(a, '1218090'), ...rest.map(clone)];
    if (sb.aoe.priority.length !== a.length) throw new Error('광역 행 수가 달라짐');

    // ── 3. 2부 단일 장 ──
    const st = m.blocks.find(b => b.title.startsWith('허수아비 첫 연습'));
    const stRail = tlOf(st)[0].rails.find(r => r.label.startsWith('반복 흐름 — 단일'));
    stRail.nodes = [
      {skillId: '470057', caption: '세트 · 돌아오면 바로', above: {skillId: '197214', when: '선택 특성 · 승천과 맞출 수 있으면'}},
      {skillId: '187874', caption: '12초 강화 · 쿨마다'},
      {skillId: '17364', caption: '중첩 모으기', above: {skillId: '114051', when: '쿨이 돌고 계속 칠 수 있을 때'}},
      {skillId: '17364', caption: '충전·초기화되면 또', above: {skillId: '60103', when: '폭풍의 일격 충전이 없으면'}},
      {skillId: '188196', caption: '10중첩 · 즉시 시전', above: {skillId: '452201', when: '폭풍이 발동했으면 번개 화살 대신'}},
      {skillId: '187874', caption: '발동으로 돌아오면'},
      {skillId: '17364', caption: '정기의 속도로 당겨짐'},
      {skillId: '188196', caption: '빈틈 · 5중첩 이상'},
    ];
    st.paragraphs[1] = rep(st.paragraphs[1],
      '전격의 불길과 낙뢰가 돌아왔으면 먼저 쓰고, 폭풍의 일격과 용암 채찍으로 중첩을 모읍니다. 10중첩이 되면 번개 화살로 쓰고, 정기의 속도로 당겨진 타격기를 바로 씁니다.',
      '전격의 불길과 낙뢰가 돌아왔으면 먼저 쓰고, 폭풍의 일격으로 중첩을 모읍니다. 용암 채찍은 폭풍의 일격 충전이 없을 때 끼웁니다. 10중첩이 되면 번개 화살로 쓰고, 다시 준비된 낙뢰와 정기의 속도로 당겨진 폭풍의 일격을 바로 씁니다.');
    st.quiz[0] = {
      q: st.quiz[0].q,
      a: '폭풍의 일격에 충전이 있으면 폭풍의 일격입니다. 정기의 속도가 두 타격기의 쿨다운을 함께 당기지만, 폭풍인도자 우선순위에서는 폭풍의 일격이 용암 채찍보다 위입니다. 낙뢰나 전격의 불길이 돌아와 있다면 그쪽을 먼저 보고, 폭풍의 일격 충전이 없을 때 용암 채찍을 씁니다.',
    };

    // ── 4. 2부 오프닝 장 ──
    const op = m.blocks.find(b => b.title.startsWith('쿨기와 오프닝'));
    op.paragraphs[1] = rep(op.paragraphs[1],
      '승천 뒤에는 다시 준비된 낙뢰와 바람의 일격을 이어 갑니다.',
      '승천을 열면 바로 바람의 일격부터 쓰고, 낙뢰가 다시 준비되면 바람의 일격 사이에 넣습니다.');
    const sbRail = tlOf(op)[0].rails.find(r => r.label.startsWith('폭풍인도자 오프닝'));
    sbRail.nodes = [
      {skillId: '187874', caption: '사전 · 당기지 않는 위치'},
      {skillId: '470057', caption: '시작 · 화염 충격'},
      {skillId: '197214', caption: '선택 시 · 전방 정렬'},
      {skillId: '60103', caption: '채찍 화염 선택 시'},
      {skillId: '114051', caption: '계속 칠 수 있을 때'},
      {skillId: '115356', caption: '승천 직후 바로'},
      {skillId: '187874', caption: '다시 준비되면 사이에'},
    ];
    sbRail.note = '사전 낙뢰가 어렵다면 전격의 불길 바로 뒤에 씁니다. 승천을 열면 바람의 일격부터 씁니다. 하강하는 하늘을 골랐다면 승천으로 폭풍이 준비되는 것도 봅니다.';

    // ── 5. 2부 광역 장 ──
    const ao = m.blocks.find(b => b.title.startsWith('광역은 연쇄 번개로'));
    const aoRail = tlOf(ao)[0].rails.find(r => r.label.startsWith('반복 흐름 — 광역'));
    aoRail.nodes = [
      {skillId: '470057', caption: '오래 살 주 대상에게', above: {skillId: '197214', when: '선택 특성 · 전방에 적이 모이면'}},
      {skillId: '187874', caption: '낙뢰 강화 유지', above: {skillId: '114051', when: '낙뢰 뒤 · 무리가 모이면'}},
      {skillId: '17364', caption: '중첩 모으기'},
      {skillId: '17364', caption: '충전·초기화되면 또', above: {skillId: '60103', when: '폭풍의 일격 충전이 없으면'}},
      {skillId: '188443', caption: '9중첩 이상', above: {skillId: '452201', when: '발동·10중첩이면 먼저'}},
      {skillId: '187874', caption: '세트·발동으로 돌아오면'},
      {skillId: '17364', caption: '당겨진 타격기'},
      {skillId: '188443', caption: '빈틈 · 5중첩 이상'},
    ];

    // ── 6. 1부 정기의 속도 장: 번개 화살 뒤 타격기 문장 ──
    const tempo = m.blocks.find(b => b.title.startsWith('쓰고 나면 타격기가'));
    tempo.paragraphs[1] = rep(tempo.paragraphs[1],
      '번개 화살을 쓴 직후 폭풍의 일격이나 용암 채찍이 돌아와 있다면 바로 씁니다.',
      '번개 화살을 쓴 직후 폭풍의 일격이 돌아와 있다면 바로 씁니다. 폭풍인도자는 용암 채찍을 폭풍의 일격 충전이 없을 때 씁니다.');
    return m;
  },
};
