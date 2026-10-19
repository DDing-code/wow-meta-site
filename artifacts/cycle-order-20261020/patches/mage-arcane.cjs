// mage-arcane 딜사이클 순서 수정 — 근거: digests/mage-arcane.md, apl/mage_arcane.simc
// 성난태양만 고친다. 주문술사는 12.1.5 이후 상위 로그가 없어 그대로 둔다.
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const must = (cond, what) => { if (!cond) throw new Error('mage-arcane: 찾지 못함 — ' + what); };
const rep = (text, from, to) => { must(text.includes(from), from.slice(0, 30)); return text.replace(from, to); };

module.exports = {
  evidenceNote: '딜사이클 순서 대조(2026-10-20): 12.1.5 이후 WCL 상위 레이드 8개·쐐기 8개(모두 성난태양)의 실제 시전 순서와 심크 APL(midnight d91a5707, sunfury 목록)을 대조해 성난태양 평시 반복을 화살 → 오색 화살 → 탄막으로(오색 화살 다음 탄막 레이드 78%·쐐기 82%), 비전의 영혼 구간을 탄막 연속(쇄도 31번 중 29번이 탄막 4번 이상 연속, 대개 5번)으로, 오프닝의 여파 뒤를 화살 → 오색 화살 → 탄막(레이드 8개 중 7개)으로 고쳤습니다. 주문술사는 로그가 없어 바꾸지 않았습니다.',
  changelog: [
    '- 성난태양 단일 반복 rail(2부 단일 연습): 화살 → 탄막 → 오색 화살 → … 를 화살 → 오색 화살 → 탄막 → 화살 → 탄막(25) → 보주 → 작렬로 (근거: 레이드 8개 오색 화살 241회 중 다음 버튼 탄막 78%, 탄막 뒤 3회 안 오색 화살 34%뿐. 탄막 사이 흐름은 [화살 오색] 96회·[화살 화살 오색] 58회가 [오색 화살] 14회보다 훨씬 많음. 오색 화살이 충전물 4개를 채우고 탄막이 충전물 4개를 요구하는 APL sunfury 줄과 같은 흐름)',
    '- 성난태양 비전의 영혼 rail: 화살 → 탄막 → 화살 → 탄막 → 오색 화살 → 탄막(반복)을 화살(12 미만이면) → 탄막 4번 연속 → 화살(평시로)로, 반복 표시 제거 (근거: 레이드 8개의 쇄도 31번 중 29번이 쇄도 18~21초 뒤 탄막 4번 이상 연속(28번은 4~6번), 사이에 화살 없음. APL sunfury 의 arcane_barrage …|buff.arcane_soul.up)',
    '- 성난태양 오프닝(2부 오프닝 rail·영웅 탭): 여파 → 오색 화살 → 화살 → 탄막을 여파 → 화살 → 오색 화살 → 탄막으로 (근거: 레이드 8개 중 7개가 여파 뒤 화살을 오색 화살보다 먼저, 5개는 화살 두 번. 예: https://www.warcraftlogs.com/reports/hrQKRBjACbvqHdMG#fight=50&source=7 . APL sunfury 1줄 arcane_missiles(번뜩임·연사 12 미만)이 맨 위)',
    '- 성난태양 광역 반복 rail(2부 광역 연습): 화살 → 탄막 → 보주 → 오색 화살 → … 를 화살 → 오색 화살 → 탄막 → 보주 → 화살 → 탄막 → 작렬로 (근거: 쐐기 8개 오색 화살 1014회 중 다음 버튼 탄막 82%, 보주 154회 중 직전 탄막 60%·직후 오색 화살 0%)',
    '- 같은 순서를 말하는 문장 맞춤: 오프닝 장 본문·요점, 성난태양 장 본문·실수, rail note',
    '- 그대로 둔 것: 영웅 탭 단일·광역 우선순위(APL sunfury 순서와 같고 오색 화살이 일반 탄막보다 위), 주문술사 전체(12.1.5 이후 상위 로그 0개)',
  ].join('\n'),
  apply(m) {
    const block = t => { const b = m.blocks.find(x => x.title.startsWith(t)); must(b, '장 ' + t); return b; };

    // 2부 단일 연습: 평시 반복·비전의 영혼 rail
    const single = block('첫 연습은 단일 대상');
    const singleRails = tlOf(single)[0].rails;
    const normal = singleRails.find(r => r.label === '평시 반복 — 단일 (성난태양 기준)');
    must(normal, '평시 반복 rail');
    normal.nodes = [
      {skillId: '5143', caption: '번뜩임 · 연사 12 미만', above: {skillId: '365350', when: '90초 · 배정한 극딜 구간'}},
      {skillId: '1295924', caption: '발동했으면 탄막 전에'},
      {skillId: '44425', caption: '번뜩임 · 연사 12 이상', above: {skillId: '321507', when: '45초 · 탄막이 날아가는 동안'}},
      {skillId: '5143', caption: '받은 번뜩임으로 다시 쌓기'},
      {skillId: '44425', caption: '연사 25면 번뜩임 없어도'},
      {skillId: '153626', caption: '충전물 0이면 복구'},
      {skillId: '30451', caption: '위 조건이 모두 없을 때'},
    ];
    normal.note = '오색 화살은 충전물 4개를 채워 주니, 켜져 있으면 탄막보다 먼저 씁니다. 12.1.5 상위 레이드 로그에서도 화살 → 오색 화살 → 탄막 순서가 가장 많습니다. 4세트가 있으면 축적된 힘 8중첩을 노리되 덮어쓰기와 시전 공백을 만들면서 기다리지 않습니다.';
    const soul = singleRails.find(r => r.label === '쇄도가 끝난 뒤 비전의 영혼 — 단일 (성난태양)');
    must(soul, '비전의 영혼 rail');
    delete soul.loop;
    soul.nodes = [
      {skillId: '5143', caption: '번뜩임 · 12 미만이면 먼저'},
      {skillId: '44425', caption: '영혼 탄막 · 연사 그대로'},
      {skillId: '44425', caption: '받은 충전물로 연달아'},
      {skillId: '44425', caption: '12 이상이면 계속 탄막'},
      {skillId: '44425', caption: '영혼 끝까지 탄막'},
      {skillId: '5143', caption: '끝나면 평시 조건으로'},
    ];
    soul.note = '비전의 영혼 중 탄막은 번뜩임과 충전물 4개, 연사 5중첩을 주고 연사를 소비하지 않습니다. 영혼에 들어갈 때 연사가 12 미만이면 화살을 먼저 쓰고, 12 이상이면 영혼이 끝날 때까지 탄막을 연달아 씁니다. 12.1.5 상위 레이드 로그에서도 영혼 동안 탄막을 대개 4~6번 이어 썼습니다.';

    // 2부 오프닝 연습
    const opener = block('쿨기와 오프닝');
    opener.paragraphs[1] = rep(opener.paragraphs[1],
      '오색 화살이 이미 떴다면 그 투사체가 날아가는 동안 여파를 붙이는 것도 고려할 수 있습니다.',
      '오색 화살이 이미 떴다면 그 투사체가 날아가는 동안 여파를 붙이는 것도 고려할 수 있습니다. 여파를 붙인 뒤에는 남은 번뜩임으로 신비한 화살을 먼저 쓰고, 오색 화살이 떴다면 그다음에 써서 충전물 4개를 채운 뒤 탄막을 씁니다.');
    must(opener.bullets[1].startsWith('연결 단계:'), '오프닝 연결 단계 요점');
    opener.bullets[1] = '연결 단계: 비전 탄막 발사 → 투사체가 맞기 전에 비전의 여파 → 남은 번뜩임으로 신비한 화살 → 오색 화살 → 비전 탄막.';
    const sunOpener = tlOf(opener)[0].rails.find(r => r.label === '오프닝 — 성난태양');
    must(sunOpener, '성난태양 오프닝 rail');
    sunOpener.nodes = [
      {skillId: '153626', caption: '충전물이 모자랄 때만 준비'},
      {skillId: '365350', caption: '풀 카운트에 맞춰 시전'},
      {skillId: '5143', caption: '번뜩임 · 연사 12 미만'},
      {skillId: '44425', caption: '충전물 4 · 투사체 발사'},
      {skillId: '321507', caption: '탄막이 맞기 전에'},
      {skillId: '5143', caption: '번뜩임 남으면 다시 화살'},
      {skillId: '1295924', caption: '발동했다면 탄막 전에'},
      {skillId: '44425', caption: '충전물 4 · 연사 12 이상'},
    ];
    sunOpener.note = '비전 충전물 4개를 준비한 예시입니다. 이미 4개면 보주를 건너뜁니다. 여파 뒤에는 남은 번뜩임으로 화살을 먼저 쓰고(한두 번), 오색 화살은 그다음입니다. 12.1.5 상위 레이드 로그 8개 중 7개가 이 순서였습니다. 쇄도가 끝난 뒤 비전의 영혼까지 한 구간으로 봅니다.';

    // 2부 광역 연습: 성난태양 광역 반복 rail
    const aoe = block('광역은 적 숫자보다');
    const sunAoe = tlOf(aoe)[0].rails.find(r => r.label === '광역 반복 — 적 5명 이상 (성난태양)');
    must(sunAoe, '성난태양 광역 rail');
    sunAoe.nodes = [
      {skillId: '5143', caption: '번뜩임 · 12 미만', above: {skillId: '365350', when: '무리가 충분히 오래 살면'}},
      {skillId: '1295924', caption: '발동 · 살아 있는 무리에'},
      {skillId: '44425', caption: '연사 12 이상 · 보주 준비됨', above: {skillId: '321507', when: '오래 살 적 · 탄막 비행 중'}},
      {skillId: '153626', caption: '탄막 뒤 충전물 복구'},
      {skillId: '5143', caption: '받은 번뜩임으로'},
      {skillId: '44425', caption: '번뜩임 · 12 이상 또는 25'},
      {skillId: '30451', caption: '조건이 모두 없을 때'},
    ];
    sunAoe.note = '오색 화살이 켜져 있으면 탄막보다 먼저 써서 충전물 4개를 채웁니다. 12.1.5 상위 쐐기 로그에서도 오색 화살 다음 버튼은 대개 탄막이었습니다. 보주가 준비됐다는 말은 실제로 적에게 맞혀 충전물을 돌려받을 위치라는 뜻까지 포함합니다. 흩어진 적이나 지형에 막힌 방향으로 던지지 않습니다.';

    // 3부 성난태양 장: 비전의 영혼 문장
    const sun = block('성난태양: 쇄도로 불사조를 부르고');
    sun.paragraphs[2] = rep(sun.paragraphs[2],
      '영혼에 들어간 뒤에도 번뜩임 + 12 미만 화살 조건부터 확인하고 탄막을 잇습니다.',
      '영혼에 들어간 뒤에도 번뜩임 + 12 미만 화살 조건부터 확인하고, 연사가 12 이상이면 영혼이 끝날 때까지 탄막을 연달아 씁니다. 12.1.5 상위 레이드 로그에서도 영혼 동안 탄막을 대개 4~6번 이어 썼습니다.');
    const mi = sun.mistakes.indexOf('비전의 영혼 중 탄막만 연타해 번뜩임 + 12 미만 화살 조건을 건너뜁니다.');
    must(mi >= 0, '성난태양 장 실수 문장');
    sun.mistakes[mi] = '비전의 영혼 중 연사가 12 미만인데도 탄막만 연타해 화살 조건을 건너뜁니다.';

    // 영웅 특성 탭: 성난태양 오프닝
    const hero = m.heroBranches.find(h => h.label === '성난태양');
    must(hero, '성난태양 영웅 탭');
    const steps = hero.opener.steps;
    must(steps.length === 8 && steps[5].skillId === '1295924' && steps[6].skillId === '5143' && steps[7].skillId === '44425', '성난태양 오프닝 6~8단계');
    const base = {phase: '조건 확인', trigger: '사용 조건 충족 시'};
    hero.opener.steps = [
      ...steps.slice(0, 5),
      {skillId: '5143', label: '신비한 화살', note: '여파 뒤에는 남은 번뜩임으로 화살을 먼저 씁니다. 연사가 12 미만이고 번뜩임이 또 남아 있으면 한 번 더 씁니다.', ...base},
      {skillId: '1295924', label: '오색 화살', note: '발동했다면 화살 다음, 탄막 앞에 써서 충전물 4개를 채웁니다. 축적된 힘 8중첩을 기다리다가 다음 발동이나 공격 시간을 잃지 않습니다.', ...base},
      {skillId: '44425', label: '비전 탄막', note: '충전물 4개와 번뜩임·연사 12 이상을 확인하고 소비합니다. 쇄도가 끝나 비전의 영혼이 시작되면 탄막을 연달아 잇고, 그 뒤 단일 우선순위로 돌아갑니다.', ...base},
    ];
    return m;
  },
};
