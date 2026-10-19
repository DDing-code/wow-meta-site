// hunter-marksmanship 딜사이클 순서 수정 — 근거: digests/hunter-marksmanship.md, apl/hunter_marksmanship.simc (10월 13일 판)
// 사용자 샘플 가이드라 최소로 고친다: 2부 광역 rail(조준 사격·속사 뒤마다 일제 사격)과 그 장 본문 두 문장, 파수꾼 오프닝 rail note 한 문장.
// 현장 팁 인용·영웅 탭·단일 rail·오프닝 순서는 건드리지 않는다.
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const must = (cond, what) => { if (!cond) throw new Error('hunter-marksmanship: 찾지 못함 — ' + what); };
const rep = (text, from, to) => { must(text.includes(from), from.slice(0, 40)); return text.replace(from, to); };

module.exports = {
  evidenceNote: '딜사이클 순서 대조(2026-10-20): 12.1.5 이후 WCL 상위 레이드 6개·쐐기 8개(파수꾼 7·어둠 순찰자 1)의 실제 시전 순서와 심크 APL(midnight d91a5707, 10월 13일 12.1.5 반영판)을 대조해 2부 광역 반복 흐름을 조준 사격 → 일제 사격 → 속사 → 일제 사격 순서로 고쳤습니다(쐐기 광역 구간 조준 사격 다음 일제 사격 65%·속사 2%, 속사 다음 일제 사격 60%, APL sentaoe 의 정밀 사격 일제 사격이 속사보다 위). 오프닝·단일 반복·영웅 탭은 로그·APL과 같아 바꾸지 않았고, 파수꾼 오프닝의 속사 다음 버튼은 로그 6개 중 3개씩 갈려 "로그마다 다름"만 적었습니다. 어둠 순찰자는 상위 레이드 로그가 없어 그대로 둡니다.',
  changelog: [
    '- 2부 광역 반복 rail: 일제 사격 → 조준 사격 → 속사 → 일제 사격 → 조준 사격 을 일제 사격 → 조준 사격 → 일제 사격(정밀 사격 소비) → 속사 → 일제 사격(속사가 준 정밀 사격 소비) → 조준 사격으로, 정조준은 속사 바로 앞에 (근거: 파수꾼 쐐기 7개(광역 구간이 잡힌 5개)에서 조준 사격 281회 중 다음 버튼 일제 사격 65%·속사 2%, 속사 132회 중 다음 일제 사격 60%·직전 일제 사격 46%. 예: https://www.warcraftlogs.com/reports/d2hV4Fgyr7x3CzqP#fight=1&source=5 . APL sentaoe 줄 multishot,if=buff.precise_shots.up&!talent.aspect_of_the_hydra 가 rapid_fire 보다 위. 4부 심화 장과 영웅 탭 광역 설명 "조준 사격과 속사 뒤에는 일제 사격"과도 맞춤)',
    '- 같은 장(광역은 교묘한 사격 켜기부터) 본문 두 문장과 rail note를 같은 순서로 맞춤',
    '- 파수꾼 오프닝 rail note에 "속사 다음 버튼은 상위 레이드 로그 6개 중 3개가 신비한 사격, 3개가 조준 사격"을 덧붙임(순서 변경 없음)',
    '- 그대로 둔 것: 파수꾼 오프닝(로그 6개 중 5개가 조준 사격 → 폭발 사격 두 번 → 정조준 → 속사), 단일 반복 rail(조준 사격 다음 신비한 사격 56%, 속사 다음 신비한 사격 55%, 신비한 사격 다음 조준 사격 45%), 영웅 탭 단일·광역 우선순위(APL sentst·sentaoe 순서와 같음), 어둠 순찰자(레이드 로그 0개, 쐐기 1명뿐), 현장 팁 인용',
  ].join('\n'),
  apply(m) {
    const block = t => { const b = m.blocks.find(x => x.title.startsWith(t)); must(b, '장 ' + t); return b; };

    // 2부 광역 연습
    const aoe = block('광역은 교묘한 사격 켜기부터');
    aoe.paragraphs[0] = rep(aoe.paragraphs[0],
      '교묘한 사격이 없으면 일제 사격으로 켜고, 켜진 상태로 조준 사격과 속사를 씁니다.',
      '교묘한 사격이 없으면 일제 사격으로 켜고, 켜진 상태로 조준 사격과 속사를 씁니다. 조준 사격과 속사가 준 정밀 사격은 바로 다음 일제 사격으로 쓰니, 둘 뒤에 일제 사격이 한 번씩 들어갑니다.');
    aoe.paragraphs[1] = rep(aoe.paragraphs[1],
      '그동안은 일제 사격으로 다시 켤 필요가 없으니 조준 사격과 속사에 집중합니다.',
      '그동안은 교묘한 사격을 켜려고 일제 사격을 따로 쓸 필요가 없습니다. 정밀 사격을 쓰는 일제 사격만 조준 사격과 속사 뒤에 붙입니다.');
    const rail = tlOf(aoe)[0].rails.find(r => r.label === '반복 흐름 — 광역 (파수꾼·어둠 순찰자 공통)');
    must(rail, '광역 반복 rail');
    rail.nodes = [
      {skillId: '257620', caption: '3명 이상 적중 → 교묘한 사격', above: {skillId: '260243', when: '적이 멈추면 먼저'}},
      {skillId: '19434', caption: '최대 5명에게 튕김', above: {skillId: '212431', when: '쿨이 돌면 · 오래 살 적에게'}},
      {skillId: '257620', caption: '정밀 사격 소비', above: {skillId: '212431', when: '다른 큰 적에게 한 번 더'}},
      {skillId: '257044', caption: '튕김 · 끝까지 유지', above: {skillId: '288613', when: '쿨이 돌면 · 속사 바로 앞'}},
      {skillId: '257620', caption: '속사가 준 정밀 사격 소비'},
      {skillId: '19434', caption: '교묘한 사격 남았는지 확인'},
    ];
    rail.note = '조준 사격과 속사 뒤에는 일제 사격으로 정밀 사격을 바로 씁니다. 연발 공격이 깔린 6초 동안은 교묘한 사격이 유지되니 교묘한 사격을 켜려고 일제 사격을 따로 쓸 필요는 없습니다. 교묘한 사격이 꺼졌으면 일제 사격으로 다시 켜고, 집중이 부족하면 고정 사격으로 채웁니다.';

    // 2부 오프닝: 파수꾼 rail note 한 문장
    const op = block('정조준과 오프닝');
    const sRail = tlOf(op)[0].rails.find(r => r.label.startsWith('오프닝 — 파수꾼'));
    must(sRail, '파수꾼 오프닝 rail');
    sRail.note = rep(sRail.note,
      '10월 13일 쏟아내기 삭제 뒤 공개 가이드 오프닝은 속사 바로 뒤에 신비한 사격을 넣습니다.',
      '10월 13일 쏟아내기 삭제 뒤 공개 가이드 오프닝은 속사 바로 뒤에 신비한 사격을 넣습니다. 12.1.5 이후 상위 레이드 로그 6개 중 3개는 속사 뒤 조준 사격을 먼저 써서 로그마다 다릅니다.');
    return m;
  },
};
