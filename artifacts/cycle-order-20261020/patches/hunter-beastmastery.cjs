// hunter-beastmastery 딜사이클 순서 대조 — 근거: digests/hunter-beastmastery.md, apl/hunter_beast_mastery.simc
// 순서는 바꾸지 않는다. 무리의 지도자 오프닝 rail note에 "격노 앞 순서는 로그마다 다름"만 적는다.
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const must = (cond, what) => { if (!cond) throw new Error('hunter-beastmastery: 찾지 못함 — ' + what); };

module.exports = {
  evidenceNote: '딜사이클 순서 대조(2026-10-20): 12.1.5 이후 WCL 상위 레이드 8개·쐐기 8개(모두 무리의 지도자)의 실제 시전 순서와 심크 APL(midnight d91a5707, 9월 30일 판)을 대조했고 순서를 바꾸지 않았습니다. 단일 반복(살상 명령과 날카로운 사격·코브라 사격 번갈아, 날카로운 사격 다음 살상 명령 62%·코브라 사격 다음 살상 명령 52%)과 쐐기 광역 시작(난타로 열고 격노 직후 난타, 풀 시작 7곳 모두 격노 다음 난타)이 가이드와 같습니다. 오프닝은 8개 중 5개가 격노 전에 날카로운 사격 두 번을 썼고, 4개는 풀 직후 살상 명령을 먼저 써서 로그마다 다르다고 적었습니다. 어둠 순찰자는 상위 로그가 없어 그대로 둡니다.',
  changelog: [
    '- 순서 변경 없음. 무리의 지도자 오프닝 rail note에 "상위 레이드 로그 8개 중 4개는 풀 직후 살상 명령을 먼저 한 번 쓰고 격노를 켰다(로그마다 다름)"를 덧붙임 (근거: 레이드 8개 중 격노 전 날카로운 사격 두 번 5개, 첫 버튼 살상 명령 4개. 예: https://www.warcraftlogs.com/reports/gHVM8yRq27rNp6Qn#fight=44&source=1032 . APL st 줄 barbed_shot,if=cooldown.bestial_wrath.remains<gcd → bestial_wrath 순서는 가이드와 같음)',
    '- 그대로 둔 것: 단일 반복 rail·영웅 탭 단일(살상 명령 다음 코브라 사격 42%·날카로운 사격 26%, APL st 순서와 같음), 광역 시작·반복(쐐기 풀 시작 7곳 모두 격노 직후 마구잡이 난타, APL cleave 1줄 wild_thrash,if=prev_gcd.1.bestial_wrath), 어둠 순찰자 전체(상위 로그 0개)',
  ].join('\n'),
  apply(m) {
    const op = m.blocks.find(b => b.title.startsWith('쿨기와 오프닝'));
    must(op, '오프닝 장');
    const rail = tlOf(op)[0].rails.find(r => r.label === '오프닝 — 무리의 지도자');
    must(rail, '무리의 지도자 오프닝 rail');
    const add = ' 12.1.5 이후 상위 레이드 로그 8개 중 4개는 풀 직후 살상 명령을 먼저 한 번 쓰고 격노를 켜, 격노 앞 순서는 로그마다 다릅니다.';
    if (!rail.note.includes('로그마다 다릅니다')) rail.note = rail.note + add;
    return m;
  },
};
