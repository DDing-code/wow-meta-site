// hunter-beastmastery 단일 딜사이클 스조라크 대조 — 근거: digests/hunter-beastmastery.md, apl/hunter_beast_mastery.simc, sources/hunter-beastmastery.txt
// 무리의 지도자 오프닝·단일 반복은 스조라크 로그 8개와 맞아 순서를 그대로 두고, 오프닝 rail note 의 님리사 근거 문장만 스조라크 근거로 바꾼다.
// 어둠 순찰자는 스조라크 로그가 없어 그대로 둔다.
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const must = (cond, what) => { if (!cond) throw new Error('hunter-beastmastery: 찾지 못함 — ' + what); };
const rep = (text, from, to) => { must(text.includes(from), from.slice(0, 40)); return text.replace(from, to); };

module.exports = {
  evidenceNote: '단일 딜사이클 스조라크 대조(2026-10-24): 스조라크 신화(12.1.5) WCL 상위 로그 8개(모두 무리의 지도자)의 실제 시전 순서와 심크 우선순위(midnight 3af1a757)·Icy Veins·Method 프리풀을 대조했고 순서를 바꾸지 않았습니다. 8개 중 5개가 날카로운 사격 두 번 → 야수의 격노 → 살상 명령으로 열었고(나머지 3개는 날카로운 사격 한 번 뒤 격노), Icy Veins·Method 오프닝도 같습니다. 단일 반복은 살상 명령 다음 코브라 사격 42%·날카로운 사격 25%, 날카로운 사격 다음 살상 명령 67%로 지금 흐름과 같습니다. 오프닝 rail note 의 님리사 근거만 스조라크 근거로 바꿨고, 어둠 순찰자는 로그가 없어 그대로 두었습니다.',
  changelog: [
    '- 무리의 지도자 오프닝·단일 반복·영웅 탭 우선순위: 순서 그대로 (근거: 스조라크 신화 상위 로그 8개 중 5개가 날카로운 사격 → 날카로운 사격 → 야수의 격노 → 살상 명령, 3개는 날카로운 사격 한 번 뒤 격노. 격노 앞 살상 명령 0/8. 예: https://www.warcraftlogs.com/reports/2t4aXzbQWDmy3Phw#fight=26&source=18 . Icy Veins·Method 무리의 지도자 오프닝 Barbed → Barbed → Bestial Wrath → Kill Command → Cobra → Barbed → Kill Command 와 같음. 심크 우선순위 st 순서와 영웅 탭 단일 우선순위 같음)',
    '- 오프닝 rail note: 님리사 근거(8개 중 4개가 격노 앞 살상 명령)를 스조라크 근거로 바꿈',
    '- 프리풀: 사냥꾼의 징표는 Icy Veins·Method 모두 풀 전에 걸라고 해 그대로 둠(심크 우선순위 precombat 에는 소환수 소환·물약만 있어 새 노드 없음)',
    '- 광포한 야수(분당 8.7회)는 살상 명령과 같은 시각에 찍히는 자동 소환이고 철수는 이동기라 단일 우선순위에 넣지 않음. 어둠 순찰자는 스조라크 로그 0개라 그대로 둠',
  ].join('\n'),
  apply(m) {
    const op = m.blocks.find(b => b.title.startsWith('쿨기와 오프닝'));
    must(op, '오프닝 장');
    const pl = tlOf(op)[0].rails.find(r => r.label.startsWith('오프닝 — 무리의 지도자'));
    must(pl, '무리의 지도자 오프닝 rail');
    pl.note = rep(pl.note,
      '12.1.5 이후 상위 레이드 로그 8개 중 4개는 풀 직후 살상 명령을 먼저 한 번 쓰고 격노를 켜, 격노 앞 순서는 로그마다 다릅니다.',
      '스조라크 신화 상위 로그 8개 중 5개가 이 순서로 열었고, 3개는 날카로운 사격을 한 번만 쓰고 격노를 켰습니다.');
    return m;
  },
};
