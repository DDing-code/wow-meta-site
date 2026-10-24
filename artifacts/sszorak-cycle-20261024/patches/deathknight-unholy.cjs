// deathknight-unholy 단일 딜사이클 스조라크 대조 — 근거: digests/deathknight-unholy.md, apl/deathknight_unholy.simc, sources/deathknight-unholy.txt
// 순서는 로그와 맞아 그대로 두고, 산레인 영웅 탭의 예전 근거 문장만 스조라크 로그로 바꾼다.
const rep = (text, from, to) => { if (!text.includes(from)) throw new Error('바꿀 문장을 못 찾음: ' + from.slice(0, 30)); return text.replace(from, to); };

module.exports = {
  evidenceNote: '단일 딜사이클 스조라크 대조(2026-10-24): 스조라크 신화(12.1.5) WCL 상위 로그(산레인 9개·종말의 기수 1개)의 실제 시전 순서와 심크 우선순위(midnight 3af1a757)·Icy Veins·Method 오프닝을 대조했고 순서를 바꾸지 않았습니다. 산레인은 9개 중 8개가 돌발 열병 → 고름 일격 → 부패의 낫 → 사자의 군대 → 어둠의 변신 → 부패 → 괴저 고리로 시작했고, 9개 모두 영혼 수확자 다음에 역병내림(18~25초)을 쓰고 바로 부패로 이었습니다. 영웅 탭의 예전 레이드 로그 근거 문장만 스조라크 로그로 바꿨습니다. 프리풀은 심크 우선순위 precombat 의 시체 되살리기(상시 소환수)뿐이라 넣지 않았습니다.',
  changelog: [
    '- 순서 변경 없음: 산레인 오프닝 로그 9개 중 8개가 지금 순서와 같고, 9개 모두 영혼 수확자 → (부패) → 역병내림 → 부패. 종말의 기수 로그 1개도 지금 순서와 같음. 단일 반복(고름 일격 → 부패의 낫 → 스컬지의 일격·죽음의 고리)도 맞음',
    '- 산레인 영웅 탭 근거 문장 교체: 오프닝 요약·괴저 고리 단계(상위 레이드 로그 7개 → 스조라크 로그 9개 중 8개, 괴저 고리 두세 번 → 한두 번), 단일 우선순위 부패의 낫·흡혈의 일격·괴저 고리 설명',
    '- 프리풀: 심크 우선순위 precombat 은 시체 되살리기(상시 구울 소환)뿐이고 Icy Veins 오프닝은 돌발 열병으로 시작, 로그 음수 초 시전 0/9 → 추가 없음',
  ].join('\n'),
  apply(m) {
    const hero = m.heroBranches.find(h => h.label === '산레인');
    hero.opener.summary = rep(hero.opener.summary,
      '12.1.5 이후 상위 레이드 로그 7개 중 6개가 돌발 열병부터 괴저 고리까지 이 순서였고, 나머지 하나는 돌발 열병 대신 부패로 질병을 걸었습니다.',
      '스조라크 신화 상위 로그 9개 중 8개가 돌발 열병부터 괴저 고리까지 이 순서였고, 나머지 하나는 고름 일격과 부패의 낫 뒤에 돌발 열병을 걸었습니다.'
    );
    const step = id => hero.opener.steps.find(s => s.skillId === id);
    step('1242174').note = rep(step('1242174').note,
      '부패 다음에는 괴저 고리를 두세 번 먼저 씁니다. 상위 로그 7개가 모두 이 순서였습니다.',
      '부패 다음에는 괴저 고리를 한두 번 먼저 씁니다. 스조라크 신화 상위 로그 9개 중 8개가 이 순서였습니다.'
    );
    const pr = id => hero.singleTarget.priority.filter(p => p.skillId === id);
    const scythe = pr('458128')[0];
    scythe.note = rep(scythe.note,
      '상위 로그에서도 고름 일격 뒤 열에 아홉은 낫이었습니다.',
      '스조라크 신화 상위 로그에서도 고름 일격 바로 다음은 낫이 가장 많았습니다.'
    );
    const necrotic = pr('1242174')[0];
    necrotic.note = rep(necrotic.note, '오프닝에서는 부패 다음에 두세 번 먼저 씁니다.', '오프닝에서는 부패 다음에 한두 번 먼저 씁니다.');
    const vamp = pr('433895').find(p => p.note.includes('가장 많이 누른 버튼'));
    if (!vamp) throw new Error('흡혈의 일격 설명을 못 찾음');
    vamp.note = rep(vamp.note,
      '상위 로그에서 가장 많이 누른 버튼입니다.',
      '스조라크 신화 상위 로그에서 죽음의 고리와 함께 가장 많이 누른 버튼입니다(분당 약 14회).'
    );
    return m;
  },
};
