// rogue-subtlety 단일 딜사이클 스조라크 대조 — 근거: digests/rogue-subtlety.md, apl/rogue_subtlety.simc, sources/rogue-subtlety.txt
// 기만자: 오프닝 순서는 로그 11개와 같다. 소멸 뒤 기습(7/11)을 단계로 드러내고, 단일 우선순위에 피아귀의 이빨·어둠의 춤을 넣는다.
// 죽음추적자: 스조라크 로그 없음 — 풀링 뒤 순서는 그대로, 프리풀 은신만(심크 precombat stealth · Icy·Method 모두 은신 시작).
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const rep = (text, from, to) => { if (!text.includes(from)) throw new Error('바꿀 문장을 못 찾음: ' + from.slice(0, 30)); return text.replace(from, to); };

module.exports = {
  evidenceNote: '단일 딜사이클 스조라크 대조(2026-10-24): 스조라크 신화(12.1.5) WCL 상위 기만자 로그 11개의 실제 시전 순서와 심크 우선순위(midnight 3af1a757)·Icy Veins·Method 프리풀을 대조해, 두 오프닝 맨 앞에 풀링 직전 은신을 두고, 기만자 오프닝에 소멸 뒤 기습(6점까지, 로그 7개)을 단계로 넣고, 기만자 단일 우선순위에 피아귀의 이빨·어둠의 춤을 더했습니다. 그림자 일격 → 절개 → 소멸 → 그림자 일격 → 피아귀의 이빨 → 어둠의 칼날·어둠의 춤 → 은밀한 기술 순서는 로그와 같아 그대로 두었습니다. 죽음추적자는 스조라크 상위 로그가 없어 풀링 뒤 순서를 바꾸지 않았습니다.',
  changelog: [
    '- 두 영웅 특성 오프닝(연습 장 타임라인·영웅 탭) 맨 앞에 은신(풀링 직전) 추가 (근거: 심크 우선순위 precombat stealth, Icy Veins "Always start the fight in Stealth", Method "Start from Stealth")',
    '- 기만자 오프닝: 소멸 → 그림자 일격 뒤에 기습(6점까지 채우기) 단계 추가 (근거: 스조라크 기만자 로그 11개 중 7개가 소멸 뒤 기습 1~2번, 2개는 절개, 2개는 바로 피아귀의 이빨)',
    '- 기만자 단일 우선순위(영웅 탭): 맨 앞에 피아귀의 이빨 → 어둠의 춤 추가 (근거: 로그 분당 어둠의 춤 2.81회·피아귀의 이빨 1.09회, 피아귀의 이빨 뒤 어둠의 춤 53%, 어둠의 춤 뒤 은밀한 기술 80%. 심크 우선순위 cds 의 goremaws_bite·shadow_dance(unseen_blade, secret_technique 준비))',
    '- 기만자 오프닝 근거 문장(영웅 탭 노트·rail note)을 스조라크 로그 기준으로 바꿈: 첫 춤 전 절개·소멸 11/11, 피아귀의 이빨 춤 직전 8/11·춤 첫 행동 3/11, 은밀한 기술 바로 뒤 그림자 일격 6/11',
    '- 그대로 둔 것: 공통 단일 반복 rail(기습 → 절개, 피아귀의 이빨 → 춤 → 은밀한 기술 → 그림자 일격 → 절개가 로그와 같음), 죽음추적자 오프닝·단일(스조라크 로그 없음)',
    '- 넣지 않은 것: Icy Veins 의 "풀링 20초 이상 전에 어둠의 춤 한 번(과충전기 켜기)" — 심크 우선순위 precombat 에 없고 로그 창(풀 8초 전부터) 밖이라 확인 불가',
  ].join('\n'),
  apply(m) {
    const block = t => m.blocks.find(b => b.title.startsWith(t));
    const opener = block('쿨기와 오프닝');
    const rails = tlOf(opener)[0].rails;
    const trick = rails.find(r => r.label.startsWith('오프닝 — 기만자'));
    const death = rails.find(r => r.label.startsWith('오프닝 — 죽음추적자'));
    const tn = trick.nodes.filter(n => n.skillId !== '1784' && n.skillId !== '53');
    // 그림자 일격 → 절개 → 소멸 → 그림자 일격 다음에 기습
    if (tn[2].skillId !== '1856' || tn[3].skillId !== '185438') throw new Error('기만자 오프닝 rail 위치가 예상과 다름');
    trick.nodes = [{skillId: '1784', caption: '풀링 직전'}, ...tn.slice(0, 4), {skillId: '53', caption: '6점까지 채우기'}, ...tn.slice(4)];
    trick.note = rep(trick.note,
      '소멸 뒤 점수가 6점에 못 미치면 기습으로 채우고 춤을 켭니다. 피아귀의 이빨은 춤 직전에 쓰는 로그와 춤 첫 행동으로 쓰는 로그가 갈리니, 은밀한 기술 전에만 쓰면 됩니다.',
      '스조라크 신화 상위 기만자 로그 11개 중 7개가 소멸 뒤 그림자 일격 다음에 기습을 1~2번 더 써서 6점을 채웠습니다. 이미 6점이면 기습을 건너뜁니다. 피아귀의 이빨은 11개 중 8개가 춤 직전, 3개가 춤 첫 행동이었으니 은밀한 기술 전에만 쓰면 됩니다.');
    death.nodes = [{skillId: '1784', caption: '풀링 직전'}, ...death.nodes.filter(n => n.skillId !== '1784')];

    // 영웅 특성 탭
    const stealthStep = {skillId: '1784', label: '은신', note: '은신 상태로 풀링합니다. 첫 그림자 일격을 은신에서 씁니다. 무기의 독은 미리 발라 둡니다.', phase: '전투 전', trigger: '풀링 직전'};
    const ds = m.heroBranches.find(h => h.label === '죽음추적자');
    ds.opener.steps = [stealthStep, ...ds.opener.steps.filter(s => s.skillId !== '1784')];

    const tr = m.heroBranches.find(h => h.label === '기만자');
    const st = tr.opener.steps.filter(s => s.skillId !== '1784' && s.skillId !== '53');
    if (st[1].skillId !== '196819' || st[3].skillId !== '185438' || st[4].skillId !== '426591' || st[8].skillId !== '185438') throw new Error('기만자 오프닝 단계 위치가 예상과 다름');
    st[1] = {...st[1], note: '점수를 한 번 비웁니다. 스조라크 신화 상위 기만자 로그 11개가 모두 첫 춤 전에 절개와 소멸을 썼습니다.'};
    st[3] = {...st[3], note: '은신 그림자 일격으로 점수를 다시 채웁니다. 6점에 못 미치면 다음 기습으로 채웁니다.'};
    st[4] = {...st[4], note: '마무리 일격 강화 효과를 준비합니다. 스조라크 상위 로그 11개 중 8개는 춤 직전, 3개는 춤 첫 행동으로 썼으니 은밀한 기술 전에만 쓰면 됩니다.'};
    st[8] = {...st[8], note: '점수를 채우고 무형검을 발동시킵니다. 스조라크 상위 로그 11개 중 6개가 은밀한 기술 바로 뒤에 썼고, 3개는 절개를 먼저 썼습니다. 광역에서는 표창 폭풍으로 전환합니다.'};
    const ambushStep = {skillId: '53', label: '기습으로 채우기', phase: '재생성', trigger: '6점 미만일 때', note: '소멸 뒤 그림자 일격으로도 6점이 안 되면 기습을 1~2번 더 써서 채웁니다. 이미 6점이면 건너뜁니다. 스조라크 상위 로그 11개 중 7개가 이 자리에 기습을 썼습니다.'};
    tr.opener.steps = [stealthStep, ...st.slice(0, 4), ambushStep, ...st.slice(4)];
    tr.opener.summary = rep(tr.opener.summary,
      '첫 절개 뒤 소멸로 그림자 일격을 한 번 더 넣어 점수를 맞추고,',
      '은신으로 시작해 첫 절개 뒤 소멸로 그림자 일격을 한 번 더 넣고, 모자라면 기습으로 6점을 맞춘 뒤,');

    const pri = tr.singleTarget.priority.filter(s => s.skillId !== '426591' && s.skillId !== '185313');
    tr.singleTarget.priority = [
      {skillId: '426591', label: '피아귀의 이빨', note: '쓸 수 있으면 다음 춤 직전에 씁니다. 춤을 켠 직후 첫 행동으로 써도 되지만 은밀한 기술보다는 먼저 씁니다.'},
      {skillId: '185313', label: '어둠의 춤', note: '춤 밖에서 6점 이상이고 은밀한 기술이 준비됐을 때 켭니다. 어둠의 칼날이 돌았다면 함께 켜고, 칼날 중에는 두 번째 춤도 넣습니다. 칼날이 10초 안에 돌아오면 춤 충전을 아껴 둡니다.'},
      ...pri,
    ];
    tr.singleTarget.summary = '피아귀의 이빨을 춤 전에 준비하고 6점 이상, 은밀한 기술이 준비됐을 때 춤에 들어갑니다. 어둠의 칼날 중 두 번째 춤은 은밀한 기술이 아직 대기 중인 예외가 가능합니다.';
    return m;
  },
};
