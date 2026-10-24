// hunter-marksmanship 단일 딜사이클 스조라크 대조 — 근거: digests/hunter-marksmanship.md, apl/hunter_marksmanship.simc, sources/hunter-marksmanship.txt
// 파수꾼 오프닝·단일 반복은 스조라크 로그 8개와 맞아 순서를 그대로 둔다.
// 프리풀 조준 사격은 심크 우선순위 precombat(aimed_shot)·Icy Veins(around 2.5 seconds before)·Method(before combat)가 같아 '풀링 2.5초 전'으로 표기를 맞춘다(두 영웅 특성 모두).
// 오프닝 rail note 의 님리사 근거 문장을 스조라크 근거로 바꾼다. 어둠 순찰자는 로그가 없어 순서를 바꾸지 않는다.
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const must = (cond, what) => { if (!cond) throw new Error('hunter-marksmanship: 찾지 못함 — ' + what); };
const rep = (text, from, to) => { must(text.includes(from), from.slice(0, 40)); return text.replace(from, to); };

module.exports = {
  evidenceNote: '단일 딜사이클 스조라크 대조(2026-10-24): 스조라크 신화(12.1.5) WCL 상위 로그 8개(모두 파수꾼)의 실제 시전 순서와 심크 우선순위(midnight 3af1a757)·Icy Veins·Method 프리풀을 대조했고 순서를 바꾸지 않았습니다. 8개 모두 폭발 사격 → 연발 공격 → 정조준 → 속사로 열었고(4개는 조준 사격 사전 시전 뒤 폭발 사격 두 번), 속사 바로 뒤 신비한 사격이 5개·조준 사격이 3개였습니다. 단일 반복은 조준 사격 다음 신비한 사격 77%, 속사 다음 신비한 사격 71%로 지금 흐름과 같습니다. 사전 조준 사격은 심크 우선순위 precombat·Icy Veins(약 2.5초 전)·Method가 같아 풀링 2.5초 전으로 표기했고, 오프닝 rail note 의 님리사 근거를 스조라크 근거로 바꿨습니다. 어둠 순찰자는 로그가 없어 순서를 그대로 두었습니다.',
  changelog: [
    '- 파수꾼 오프닝·단일 반복·영웅 탭 우선순위: 순서 그대로 (근거: 스조라크 신화 상위 로그 8개 모두 폭발 사격 → 연발 공격 → 정조준 → 속사, 조준 사격 사전 시전·폭발 사격 두 번은 4개, 속사 뒤 신비한 사격 5개·조준 사격 3개. 예: https://www.warcraftlogs.com/reports/jpMK7W6vtqzNmYCr#fight=40&source=13 . Icy Veins 파수꾼 오프닝 Aimed(2.5초 전) → Explosive ×2 → Volley → Trueshot → Rapid Fire → Arcane → Aimed → Arcane 과 같음. 심크 우선순위 sentst 와 영웅 탭 단일 같음)',
    '- 프리풀: 사전 조준 사격 단계를 전투 전·풀링 2.5초 전으로 표기(2부 오프닝 rail 두 줄·영웅 탭 두 분기·오프닝 장 본문) (근거: 심크 우선순위 precombat aimed_shot, Icy Veins "Aimed Shot around 2.5 seconds before combat begins", Method "Cast Aimed Shot before combat", 로그 4/8 이 0~1.2초에 조준 사격 적중). 사냥꾼의 징표는 Icy Veins·Method 모두 풀 전에 걸라고 해 그대로 둠',
    '- 파수꾼 오프닝 rail note: 님리사 근거(6개 중 3개가 속사 뒤 조준 사격)를 스조라크 근거(8개 중 5개 신비한 사격, 3개 조준 사격)로 바꿈',
    '- 어둠 순찰자: 스조라크 로그 0개라 풀링 뒤 순서는 그대로(프리풀 표기만 심크 우선순위·Icy Veins·Method 어둠 순찰자 오프닝과 같아 맞춤)',
  ].join('\n'),
  apply(m) {
    const op = m.blocks.find(b => b.title.startsWith('정조준과 오프닝'));
    must(op, '오프닝 장');
    op.paragraphs[2] = rep(op.paragraphs[2], '풀 카운트에 맞춰 조준 사격을 미리 시전합니다.', '풀링 약 2.5초 전에 조준 사격을 미리 시전합니다.');
    const rails = tlOf(op)[0].rails;
    const sent = rails.find(r => r.label.startsWith('오프닝 — 파수꾼'));
    const dr = rails.find(r => r.label.startsWith('오프닝 — 어둠 순찰자'));
    must(sent && dr, '오프닝 rail');
    must(sent.nodes[1].skillId === '19434' && dr.nodes[1].skillId === '19434', '사전 조준 사격 노드');
    sent.nodes[1] = {...sent.nodes[1], caption: '풀링 2.5초 전'};
    dr.nodes[1] = {...dr.nodes[1], caption: '풀링 2.5초 전'};
    sent.note = rep(sent.note,
      '12.1.5 이후 상위 레이드 로그 6개 중 3개는 속사 뒤 조준 사격을 먼저 써서 로그마다 다릅니다.',
      '스조라크 신화 상위 로그 8개 중 5개가 속사 바로 뒤 신비한 사격을, 3개는 조준 사격을 먼저 써서 로그마다 다릅니다.');
    for (const label of ['파수꾼', '어둠 순찰자']) {
      const h = m.heroBranches.find(x => x.label === label);
      must(h && h.opener.steps[1].skillId === '19434', label + ' 영웅 오프닝 사전 조준 사격');
      h.opener.steps[1] = {...h.opener.steps[1], phase: '전투 전', trigger: '풀링 2.5초 전'};
    }
    return m;
  },
};
