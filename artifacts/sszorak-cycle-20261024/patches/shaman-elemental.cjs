// shaman-elemental 단일 딜사이클 스조라크 대조 — 근거: digests/shaman-elemental.md, apl/shaman_elemental.simc, sources/shaman-elemental.txt
// 선견자 11개 로그. 오프닝·단일 반복 순서는 과반과 맞아 그대로 두고, 근거 문장과 영웅 탭 단일 우선순위의 화염 충격만 보탠다. 폭풍인도자는 로그가 없어 그대로.
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const rep = (text, from, to) => { if (!text.includes(from)) throw new Error('바꿀 문장을 못 찾음: ' + from.slice(0, 30)); return text.replace(from, to); };

module.exports = {
  evidenceNote: '단일 딜사이클 스조라크 대조(2026-10-24): 스조라크 신화(12.1.5) WCL 상위 로그 11개(모두 선견자)의 실제 시전 순서와 심크 우선순위(midnight 3af1a757)·Icy Veins·Method 프리풀을 대조했고 오프닝·단일 반복 순서는 바꾸지 않았습니다(11개 중 6개가 강화 번개 화살 두 번 → 승천 → 용암 폭발 → 정기 작렬 순서, 4개는 풀링하자마자 승천). 풀링 약 3초 전 폭풍수호자는 심크 우선순위 precombat·Icy Veins·Method가 같고 9개 로그의 첫 폭풍수호자가 35~44초에 다시 찍혀 그대로 두었습니다. 11개 모두 전격의 불길 없이 화염 충격을 직접 갱신해, 그 근거로 단일 반복 메모를 바꾸고 영웅 특성 탭 단일 우선순위에 화염 충격을 넣었습니다.',
  changelog: [
    '- 선견자 오프닝: 순서 그대로 (근거: 스조라크 로그 11개 중 6개가 강화 번개 화살 2회 → 승천 → 용암 폭발 → 정기 작렬 → 용암 폭발, 4개는 풀링 직후 승천을 열고 용암 폭발·번개 화살 교대. rail note 에 로그마다 다름을 적음. 예: https://www.warcraftlogs.com/reports/mBPad8fFDJCLtykR#fight=21&source=20)',
    '- 프리풀: 폭풍수호자(풀링 약 3초 전) 그대로 (심크 우선순위 precombat stormkeeper, Icy Veins·Method 3초 전, 첫 폭풍수호자가 35~44초에 다시 찍힌 로그 9개). 풀링 1.5초 전 용암 폭발은 Icy Veins·Method에만 있고 심크 우선순위 precombat 에 없으며 로그 2개뿐이라 넣지 않음',
    '- 단일 반복 rail note: 님리사 기록 2건(전격의 불길) 근거를 스조라크 근거(11개 모두 전격의 불길 0회, 화염 충격 직접 12~22회)로 바꿈',
    '- 선견자 영웅 탭 단일 우선순위: 전격의 불길 앞에 화염 충격 추가, 단일 장 우선순위 요약 문장도 맞춤 (근거: 분당 1회 이상, 심크 우선순위 single_target 의 flame_shock refreshable)',
    '- 폭풍인도자: 스조라크 로그 0개라 바꾸지 않음',
  ].join('\n'),
  apply(m) {
    const block = t => m.blocks.find(b => b.title.startsWith(t));

    // 2부 단일 연습
    const single = block('첫 연습은 단일 대상');
    single.paragraphs[0] = rep(single.paragraphs[0],
      '→ 전격의 불길(화염 충격 갱신) → 번개 화살.',
      '→ 화염 충격(6초 안팎이면 갱신, 비었으면 맨 먼저) → 전격의 불길(골랐다면 화염 충격 갱신) → 번개 화살.');
    const loop = tlOf(single)[0].rails.find(r => r.label.startsWith('평시 반복'));
    loop.note = '정기 작렬은 대지 충격을 골랐다면 대지 충격으로 읽습니다. 화염 충격이 비면 무엇보다 먼저 복구합니다. 스조라크 신화 상위 로그 11개(선견자)는 모두 전격의 불길 없이 화염 충격을 직접 갱신했습니다(전투마다 12~22회). 이 가이드의 단일·레이드 견본도 전격의 불길을 찍지 않았으니 화염 충격으로 갱신하고, 전격의 불길을 골랐다면 그 쿨마다 갱신합니다.';

    // 2부 오프닝 연습 — 순서는 그대로, 근거만
    const opener = block('쿨기와 오프닝');
    const fs = tlOf(opener)[0].rails.find(r => r.label.startsWith('오프닝 — 선견자'));
    fs.note = '강화 번개 화살 두 번은 승천 전에 다 씁니다. 승천이 시작할 때 화염 충격을 걸어 주므로 오프닝에서는 전격의 불길이나 화염 충격을 따로 먼저 쓰지 않아도 됩니다. 정기 작렬은 고른 소비기로 읽습니다. 스조라크 신화 상위 로그 11개 중 6개가 이 순서였고, 4개는 풀링하자마자 승천을 열어 용암 폭발과 번개 화살을 번갈아 써서 로그마다 다릅니다.';

    // 영웅 특성 탭 — 선견자 단일: 화염 충격 추가
    const fsr = m.heroBranches.find(h => h.label === '선견자');
    const pr = fsr.singleTarget.priority.filter(p => p.skillId !== '188389');
    const vb = pr.findIndex(p => p.skillId === '470057');
    if (vb < 0) throw new Error('전격의 불길 행 없음');
    fsr.singleTarget.priority = [
      ...pr.slice(0, vb),
      {skillId: '188389', label: '화염 충격', note: '비었으면 위 순서보다 먼저 복구하고, 남은 시간이 6초 안팎이면 갱신합니다. 원소의 대가가 켜져 있으면 소비기를 먼저 씁니다. 스조라크 상위 로그 11개 모두 전격의 불길 없이 화염 충격으로 직접 갱신했습니다.'},
      ...pr.slice(vb),
    ];
    return m;
  },
};
