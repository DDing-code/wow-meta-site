// mage-arcane 단일 딜사이클 스조라크 대조 — 근거: digests/mage-arcane.md, apl/mage_arcane.simc, sources/mage-arcane.txt
// 성난태양만 로그가 있다(10개). 주문술사는 로그가 없고 심크 우선순위 precombat 이 쇄도 사전 시전을 성난태양에만 두므로 그대로 둔다.
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const rep = (text, from, to) => { if (!text.includes(from)) throw new Error('바꿀 문장을 못 찾음: ' + from.slice(0, 30)); return text.replace(from, to); };

module.exports = {
  evidenceNote: '단일 딜사이클 스조라크 대조(2026-10-24): 스조라크 신화(12.1.5) WCL 상위 로그 10개(모두 성난태양)의 실제 시전 순서와 심크 우선순위(midnight 3af1a757)·Icy Veins·Method 프리풀을 대조했습니다. 비전 쇄도 사전 시전은 심크 우선순위(성난태양 전투 전 목록)·Icy Veins·Method가 모두 같아 전투 전 단계로 표시했고, 여파 뒤 두 번째 탄막 앞은 로그 10개 중 7개가 오색 화살 없이 탄막을 써서(4개는 비전 작렬로 채운 뒤) 기본을 비전 작렬로 바꾸고 오색 화살은 발동했을 때 쓰는 갈래로 남겼습니다. 평시 반복(오색 화살 다음 탄막 85%)과 비전의 영혼 탄막 연속(33번 모두 4~6번)은 그대로 맞아 근거만 스조라크로 바꿨습니다. 주문술사는 로그가 없어 바꾸지 않았습니다.',
  changelog: [
    '- 성난태양 오프닝(연습 장 타임라인·영웅 탭): 비전 쇄도를 전투 전·풀링 직전 사전 시전으로 표시 (근거: 심크 우선순위 precombat `arcane_surge,if=talent.spellfire_spheres`, Icy Veins "pre-cast Arcane Surge", Method 성난태양 오프닝 "Precast Arcane Surge", 로그 10개 중 7개가 풀 0.1~1.8초에 쇄도 완료)',
    '- 성난태양 오프닝 7번째: 오색 화살 → 비전 작렬(오색 화살 없으면 채우기). 오색 화살은 발동했을 때 탄막 앞에 쓰는 갈래로 note 에 남김 (근거: 여파 → 화살 뒤 두 번째 탄막 전에 오색 화살을 쓴 로그 3/10, 오색 화살 없이 탄막 7/10 중 비전 작렬로 채운 것 4/10. 예: https://www.warcraftlogs.com/reports/g97C1GjtB2TqAb4r#fight=9&source=4)',
    '- 오프닝 장 본문·요점, 평시 반복 rail note, 비전의 영혼 rail note, 성난태양 장 본문의 근거 문장을 님리사·12.1.5 레이드 기록에서 스조라크 상위 로그 10개로 바꿈 (오색 화살 다음 탄막 85%, 영혼 구간 33번 모두 탄막 4~6번 연속)',
    '- 그대로 둔 것: 성난태양 평시 반복 순서·영웅 탭 단일 우선순위(로그·심크 우선순위 sunfury 목록과 맞음), 비전 보주 준비 단계(충전물이 모자랄 때만 — 로그 3/10이 풀 직후 보주로 시작), 주문술사 전체(스조라크 로그 없음, 심크 우선순위 precombat 은 주문술사에 쇄도 사전 시전을 두지 않아 공개 가이드와 갈림)',
  ].join('\n'),
  apply(m) {
    const block = t => m.blocks.find(b => b.title.startsWith(t));

    // 2부 단일 연습: 근거 문장만 스조라크로
    const single = block('첫 연습은 단일 대상');
    const sRails = tlOf(single)[0].rails;
    const loop = sRails.find(r => r.label.startsWith('평시 반복'));
    loop.note = '오색 화살은 충전물 4개를 채워 주니, 켜져 있으면 탄막보다 먼저 씁니다. 스조라크 신화 상위 로그 10개에서도 오색 화살 다음은 85%가 탄막이었습니다. 4세트가 있으면 축적된 힘 8중첩을 노리되 덮어쓰기와 시전 공백을 만들면서 기다리지 않습니다.';
    const soul = sRails.find(r => r.label.startsWith('쇄도가 끝난 뒤 비전의 영혼'));
    soul.note = rep(soul.note, '12.1.5 상위 레이드 로그에서도 영혼 동안 탄막을 대개 4~6번 이어 썼습니다.', '스조라크 신화 상위 로그 10개에서도 영혼 구간 33번 모두 탄막을 4~6번 이어 썼습니다.');

    // 2부 오프닝 연습
    const opener = block('쿨기와 오프닝');
    opener.paragraphs[1] = rep(opener.paragraphs[1],
      '여파를 붙인 뒤에는 남은 번뜩임으로 신비한 화살을 먼저 쓰고, 오색 화살이 떴다면 그다음에 써서 충전물 4개를 채운 뒤 탄막을 씁니다.',
      '여파를 붙인 뒤에는 남은 번뜩임으로 신비한 화살을 먼저 씁니다. 그다음 오색 화살이 떴다면 오색 화살로 충전물 4개를 채우고, 없으면 비전 작렬로 채운 뒤 탄막을 씁니다.');
    opener.bullets[1] = '연결 단계: 비전 탄막 발사 → 투사체가 맞기 전에 비전의 여파 → 남은 번뜩임으로 신비한 화살 → 비전 작렬(오색 화살이 떴다면 오색 화살) → 비전 탄막.';
    const oRails = tlOf(opener)[0].rails;
    const sunO = oRails.find(r => r.label === '오프닝 — 성난태양');
    sunO.nodes = [
      {skillId: '153626', caption: '충전물이 모자랄 때만 준비'},
      {skillId: '365350', caption: '풀링 직전 미리 시전'},
      {skillId: '5143', caption: '번뜩임 · 연사 12 미만'},
      {skillId: '44425', caption: '충전물 4 · 투사체 발사'},
      {skillId: '321507', caption: '탄막이 맞기 전에'},
      {skillId: '5143', caption: '번뜩임 남으면 다시 화살'},
      {skillId: '30451', caption: '오색 화살 없으면 채우기'},
      {skillId: '44425', caption: '충전물 4 · 연사 12 이상'},
    ];
    sunO.note = '비전 충전물 4개를 준비한 예시입니다. 이미 4개면 보주를 건너뜁니다. 여파 뒤에는 남은 번뜩임으로 화살을 먼저 씁니다. 그다음은 발동에 따라 다릅니다. 스조라크 신화 상위 로그 10개 중 3개는 오색 화살 → 탄막, 4개는 비전 작렬로 채운 뒤 탄막, 나머지 3개는 작렬 없이 탄막이었습니다. 오색 화살이 떴다면 작렬 대신 탄막 앞에 씁니다. 쇄도가 끝난 뒤 비전의 영혼까지 한 구간으로 봅니다.';

    // 3부 성난태양 장: 근거 문장
    const sun = block('성난태양:');
    sun.paragraphs[2] = rep(sun.paragraphs[2], '12.1.5 상위 레이드 로그에서도 영혼 동안 탄막을 대개 4~6번 이어 썼습니다.', '스조라크 신화 상위 로그에서도 영혼 동안 탄막을 4~6번 이어 썼습니다.');

    // 영웅 특성 탭 — 성난태양 오프닝
    const hero = m.heroBranches.find(h => h.label === '성난태양');
    const st = hero.opener.steps;
    st[1] = {...st[1], note: '풀 카운트가 끝날 때 맞도록 미리 시전합니다. 비전의 여파를 쇄도 종료 직전까지 의무적으로 기다리는 옛 순서를 적용하지 않습니다.', phase: '전투 전', trigger: '풀링 직전'};
    st[6] = {skillId: '30451', label: '비전 작렬', note: '오색 화살이 없으면 비전 작렬로 충전물을 채운 뒤 탄막을 씁니다. 오색 화살이 떴다면 작렬 대신 오색 화살을 탄막 앞에 씁니다.', phase: st[6].phase, trigger: st[6].trigger};
    return m;
  },
};
