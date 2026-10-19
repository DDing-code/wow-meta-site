// druid-feral 딜사이클 순서 수정 — 근거: digests/druid-feral.md, apl/druid_feral.simc
const tl = b => (Array.isArray(b.timeline) ? b.timeline : b.timeline ? [b.timeline] : []);
const block = (m, start) => {
  const b = m.blocks.find(x => x.title.startsWith(start));
  if (!b) throw new Error('장 없음: ' + start);
  return b;
};
const rail = (b, label) => {
  for (const t of tl(b)) for (const r of t.rails || []) if (r.label.startsWith(label)) return r;
  throw new Error('rail 없음: ' + label);
};
const hero = (m, label) => {
  const h = m.heroBranches.find(x => x.label === label);
  if (!h) throw new Error('영웅 없음: ' + label);
  return h;
};
const pick = (rows, id, n = 0) => {
  const hit = rows.filter(r => r.skillId === id);
  if (!hit[n]) throw new Error('행 없음: ' + id + '#' + n);
  return hit[n];
};

module.exports = {
  evidenceNote: '딜사이클 순서 대조(2026-10-20): 12.1.5 이후 WCL 상위 레이드 13개(발톱의 드루이드 5·야생추적자 8)·쐐기 8개(발톱의 드루이드, 화신을 쓴 광역 풀 39개)의 실제 시전 순서와 심크 APL(midnight d91a5707)을 대조해, 발톱의 드루이드 쐐기 첫 풀에서 화신을 원시 분노 앞(호랑이의 분노와 같은 순간)으로 옮기고 화신 중 숨기 → 은신 갈퀴 발톱을 더했으며, 야생추적자 단일 우선순위에서 갈퀴 발톱 갱신을 기습 공격 칼날 발톱보다 위로 올렸습니다. 두 영웅 특성의 레이드 오프닝은 로그 과반과 같아 그대로 두었습니다.',
  changelog: [
    '- 발톱의 드루이드 쐐기 첫 풀(2부 광역 장 "첫 풀 흐름" 줄, 영웅 탭 광역 시작 단계): 호랑이의 분노 → 원시 분노 → 화신 → 날뛰는 광란 → 찢어발기기 ⇒ 호랑이의 분노 → 화신 → 원시 분노 → 날뛰는 광란 → 찢어발기기 → 숨기 → 갈퀴 발톱. 근거: 쐐기 로그 8개에서 호랑이의 분노와 화신을 함께 쓴 광역 풀 39개 중 29개가 두 쿨기 뒤에 원시 분노(→ 날뛰는 광란 → 찢어발기기), 두 쿨기 사이에 원시 분노를 둔 풀은 4개(예: https://www.warcraftlogs.com/reports/6LFAJ1Khm732jwNX#fight=4&source=4 ). 같은 39개 중 23개가 그 뒤 화신 중 숨기 → 갈퀴 발톱. APL cooldown 목록은 berserk(=화신)를 호랑이의 분노 직후·frantic_frenzy를 그 뒤에, aoe_builder 첫 줄에 prowl(갈퀴 발톱 갱신 대상)을 둠. 광역 우선순위에도 "숨기 · 화신 중 한 번" 행을 생성기 맨 위에 더함. 호랑이의 분노가 먼저인 풀 25개·화신이 먼저인 풀 14개로 APL 순서(호랑이의 분노 → 화신)를 유지하고 "같은 순간"으로 적음.',
    '- 야생추적자 단일 우선순위(영웅 탭): 칼날 발톱(기습 공격) → 갈퀴 발톱(유지 판단) ⇒ 갈퀴 발톱(유지 판단) → 칼날 발톱(기습 공격). 근거: APL builder 목록에서 기습 공격 칼날 발톱 줄(shred,if=buff.sudden_ambush.up&hero_tree.druid_of_the_claw)은 발톱의 드루이드 전용이고, 야생추적자는 rake → moonfire_cat → shred 순서. 2부 단일 장 우선순위 문단에 같은 설명을 한 문장 더함.',
    '- 야생추적자 레이드 오프닝 note: 광폭화와 야성의 광기 앞뒤가 로그 8개 중 3개에서 바뀌어 "로그마다 다름"을 적음(순서는 과반 5/8 그대로).',
    '- 그대로 둔 것: 두 영웅 특성 레이드 오프닝(발톱 3/5, 야생추적자 6/8이 호랑이의 분노 → 갈퀴 발톱 → 광폭화·야성의 광기 → 도려내기 → 영혼 소집 → 흉포한 이빨), 단일 반복 rail, 광역 반복 rail, 야생추적자 광역(쐐기 로그 없음).',
  ].join('\n'),
  apply(m) {
    // 1) 발톱의 드루이드 쐐기 첫 풀: 화신을 원시 분노 앞으로
    const aoeBlock = block(m, '광역은 원시 분노로');
    const firstPull = rail(aoeBlock, '첫 풀 흐름 — 발톱의 드루이드');
    firstPull.nodes = [
      {skillId: '5215', caption: '기절이 필요할 때만'},
      {skillId: '1822', caption: '탱커 진입 뒤 오래 살 적'},
      {skillId: '106785', caption: '5점까지 필요한 만큼'},
      {skillId: '5217', caption: '교전 뒤 · 목숨을 끊는 일격'},
      {skillId: '102543', caption: '호랑이의 분노와 함께'},
      {skillId: '285381', caption: '5점 · 적이 모임'},
      {skillId: '1243807', caption: '낮은 점수에서'},
      {skillId: '441591', caption: '변환 확인 · 적이 앞에'},
      {skillId: '5215', caption: '화신 중 한 번 더'},
      {skillId: '1822', caption: '은신 갈퀴 발톱'},
    ];
    firstPull.note = '감염된 상처를 고르고 거친 베기를 고르지 않은 갈퀴 발톱 유지 예시입니다. 거친 베기 경로라면 생성기 판단을 휘둘러치기 쪽으로 바꿉니다. 화신과 호랑이의 분노는 같은 순간에 누르고 원시 분노로 출혈을 겁니다. 쿨기 전에 이미 5점이라면 원시 분노를 먼저 한 번 쓰고 들어가도 됩니다. 화신 중에는 전투 중에도 숨기를 한 번 쓸 수 있으니, 찢어발기기 뒤 은신 갈퀴 발톱을 오래 살 적에게 겁니다.';

    const claw = hero(m, '발톱의 드루이드');
    const s = claw.aoe.steps;
    const stealth = pick(s, '5215'), rake = pick(s, '1822'), swipe = pick(s, '106785'), tf = pick(s, '5217');
    const pw = pick(s, '285381'), inc = pick(s, '102543'), ff = pick(s, '1243807'), rav = pick(s, '441591');
    inc.phase = '광역 극딜';
    inc.trigger = '호랑이의 분노와 함께';
    inc.note = '큰 무리에 배정한 강화를 호랑이의 분노와 같은 순간에 시작합니다. 이 경로에서는 영혼 소집을 별도 필수 버튼으로 넣지 않습니다.';
    pw.note = '화신이 켜진 채 오래 살아남을 적들에게 도려내기를 적용합니다. 쿨기 전에 이미 5점이었다면 먼저 한 번 써도 됩니다. 아직 범위 밖에 있는 적을 이미 맞힌 것으로 생각하지 않습니다.';
    const stealth2 = {skillId: '5215', label: '숨기', phase: '화신 중', trigger: '전투 중 한 번', note: '화신 중에는 전투 중에도 숨기를 한 번 쓸 수 있습니다. 찢어발기기까지 쓴 뒤 다시 은신해 다음 갈퀴 발톱을 은신 상태로 겁니다.'};
    const rake2 = {skillId: '1822', label: '은신 갈퀴 발톱', phase: '화신 중', trigger: '갱신이 필요한 오래 살 적', note: '은신 상태의 갈퀴 발톱으로 강한 출혈을 겁니다. 이후에는 아래 광역 우선순위로 돌아가 출혈과 발동을 판단합니다.'};
    rav.note = '준비된 변환을 적 무리에 맞힙니다. 무료가 아닌 경우 실제 기력·점수 비용을 확인합니다.';
    claw.aoe.steps = [stealth, rake, swipe, tf, inc, pw, ff, rav, stealth2, rake2];
    // 광역 우선순위: 화신 중 숨기 → 은신 갈퀴 발톱을 생성기 맨 위에 (APL aoe_builder 첫 줄 prowl)
    const pr = claw.aoe.priority;
    if (!pr.some(r => r.skillId === '5215')) {
      const at = pr.findIndex(r => r.skillId === '1822');
      pr.splice(at, 0, {skillId: '5215', label: '숨기 · 화신 중 한 번', note: '화신 중에는 전투 중에도 숨기를 한 번 쓸 수 있습니다. 갈퀴 발톱 갱신이 필요한 오래 살 적이 있으면 숨기 뒤 은신 갈퀴 발톱을 겁니다.'});
    }

    // 2) 야생추적자 단일: 갈퀴 발톱 유지 판단을 기습 공격 칼날 발톱보다 위로
    const wild = hero(m, '야생추적자');
    const p = wild.singleTarget.priority;
    const ia = p.findIndex(r => r.skillId === '5221' && r.label.includes('기습'));
    const ib = p.findIndex(r => r.skillId === '1822' && r.label.includes('유지'));
    if (ia < 0 || ib < 0) throw new Error('야생추적자 단일 행을 찾지 못함');
    if (ia < ib) {
      const shred = p[ia], rk = p[ib];
      rk.note = '출혈이 없거나 팬데믹이면 갱신하고, 단일 강화 교체가 필요한지 따로 봅니다. 기습 공격이 떠 있어도 갱신이 필요하면 갈퀴 발톱이 먼저입니다. 기본 출혈 유지로 덩굴 발생 기회를 확보합니다.';
      p[ia] = rk;
      p[ib] = shred;
    }
    const st = block(m, '허수아비 첫 연습');
    const i0 = st.paragraphs.findIndex(x => x.startsWith('단일 우선순위를 줄이면'));
    if (i0 < 0) throw new Error('단일 우선순위 문단 없음');
    if (!st.paragraphs[i0].includes('야생추적자는 찢어발기기가 없고')) {
      st.paragraphs[i0] += ' 야생추적자는 찢어발기기가 없고, 기습 공격이 떠 있어도 갈퀴 발톱 갱신을 칼날 발톱보다 먼저 봅니다.';
    }

    // 광역 끼워 넣기 줄에 발톱 화신 중 숨기
    const ins = rail(aoeBlock, '영웅 특성별로 끼워 넣는 것');
    if (!ins.nodes.some(n => n.skillId === '5215')) {
      const at = ins.nodes.findIndex(n => n.skillId === '102543');
      ins.nodes.splice(at + 1, 0, {skillId: '5215', caption: '발톱 · 화신 중 숨기 한 번'});
    }

    // 3) 야생추적자 오프닝 note: 광폭화·야성의 광기 앞뒤는 로그마다 다름
    const op = rail(block(m, '쿨기와 오프닝'), '오프닝 — 야생추적자');
    op.note = '덩굴은 자동으로 생깁니다. 덩굴이 보일 때까지 기다렸다가 전투를 시작하지 않습니다. 광폭화와 야성의 광기의 앞뒤는 로그마다 다르니 둘을 붙여서 씁니다.';
    return m;
  },
};
