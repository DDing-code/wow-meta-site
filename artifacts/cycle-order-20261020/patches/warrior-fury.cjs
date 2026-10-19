// warrior-fury 딜사이클 순서 수정 — 근거: digests/warrior-fury.md, apl/warrior_fury.simc
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const rep = (text, from, to) => { if (!text.includes(from)) throw new Error('바꿀 문장을 못 찾음: ' + from.slice(0, 30)); return text.replace(from, to); };

module.exports = {
  evidenceNote: '딜사이클 순서 대조(2026-10-20): 12.1.5 이후 WCL 상위 레이드 13개(학살자 8·산왕 5)·쐐기 16개(학살자 8·산왕 8)의 실제 시전 순서와 심크 APL(midnight d91a5707)을 대조해 학살자 오프닝의 칼날폭풍 뒤를 광란 → 분쇄의 타격 → 광란으로 고치고(레이드 8개 모두 칼날폭풍 다음 손으로 쓴 첫 스킬이 광란), 산왕은 무모한 희생 밖에서 피의 갈증을 분노의 강타보다 먼저 두었으며(광란 뒤 첫 생성기 220회 중 144회), 산왕 광역은 천둥벼락으로 복제를 먼저 켜고 투신 뒤 우레 작렬을 쓰도록 맞췄습니다. 학살자 광역에는 분노의 강타를 넣었습니다.',
  changelog: [
    '- 학살자 오프닝(연습 장 타임라인·영웅 탭): … → 칼날폭풍 → 마무리 일격 → 광란 을 … → 칼날폭풍 → 광란 → 분쇄의 타격 → 광란 으로. 마무리 일격은 급살이 뜨면 광란 사이에 끼우는 것으로 note에 옮김 (근거: 상위 레이드 8개 중 8개가 칼날폭풍(자동으로 나가는 피범벅 제외) 바로 다음 광란, 6개가 그다음 분쇄의 타격. 예: https://www.warcraftlogs.com/reports/grLRwJZ1TxvXDdQA#fight=2&source=10)',
    '- 연습 장 단일 끼워 넣기 rail: 학살자 칼날폭풍 → 마무리 일격 → 광란 을 칼날폭풍 → 광란 → 마무리 일격 으로. 본문의 피의 갈증·분노의 강타 설명을 영웅 특성별로 나눔',
    '- 산왕 단일 우선순위(영웅 탭): 분노의 강타 → 피의 갈증 을 피의 갈증 → 분노의 강타 로 (근거: 산왕 레이드 5개, 무모한 희생 밖 광란 뒤 첫 생성기 피의 갈증 144회·분노의 강타 76회. APL thane 의 bloodthirst 가 조건 없는 raging_blow 위)',
    '- 산왕 광역 우선순위(영웅 탭): 천둥벼락을 3번에서 1번(복제가 없을 때)으로, 피의 갈증 추가 (근거: 산왕 쐐기 풀(적 3명 이상) 14개 중 8개가 첫 광란 전에 천둥벼락을 씀, 나머지는 피의 갈증으로 시작. 쐐기 피의 갈증 분당 4.3회. APL thane_aoe 의 thunder_clap(improved_whirlwind&stack=0))',
    '- 연습 장 광역 끼워 넣기 rail: 산왕 우레 작렬 → 투신 을 투신 → 우레 작렬 로 (근거: 산왕 쐐기 풀에서 투신 8회 중 6회가 바로 뒤, 2회가 광란 하나 뒤 우레 작렬. 레이드도 투신 다음 우레 작렬 50%)',
    '- 학살자 광역 우선순위(영웅 탭): 분쇄의 타격 뒤에 분노의 강타 추가 (근거: 학살자 쐐기 광역 분당 9.3회, APL slayer_aoe 의 raging_blow 가 bloodthirst 위)',
    '- 그대로 둔 것: 공통 오프닝 뼈대·공통 단일/광역 반복 rail, 산왕 오프닝(로그 5개가 대체로 일치, 피범벅과 분쇄의 타격 사이 광란 여부만 갈림 → note에 적음), 오딘의 격노 위치(로그마다 무모한 희생 앞뒤가 다름)',
  ].join('\n'),
  apply(m) {
    const block = t => m.blocks.find(b => b.title.startsWith(t));

    // 2부 단일 연습
    const single = block('허수아비 첫 연습');
    single.paragraphs[1] = '피의 갈증과 분노의 강타 중 무엇을 먼저 쓸지는 영웅 특성마다 다릅니다. 학살자는 광란 뒤 충전 반환이나 초기화가 생겼다면 분노의 강타로 분노를 채웁니다. 12.1.5 이후 상위 레이드 기록에서도 무모한 희생 밖 광란 뒤 첫 생성기는 대부분 분노의 강타였습니다. 산왕은 피의 갈증이 우레 작렬을 주기 때문에 피의 갈증을 먼저 쓴 경우가 더 많았습니다. 위 타임라인은 두 흐름을 함께 담아 광란 → 돌아온 분노의 강타 → 피의 갈증 → 남은 분노의 강타 → 광란으로 그렸습니다. 막무가내를 골랐다면 무모한 희생 동안 같은 자리에 분쇄의 타격과 피범벅이 들어가고, 이때는 광란과 강화된 생성기를 하나씩 번갈아 쓰는 경우가 많습니다.';
    const singleInserts = tlOf(single)[0].rails.find(r => r.kind === 'inserts');
    singleInserts.nodes = [
      {skillId: '227847', caption: '학살자 · 광란으로 분노 비운 뒤'},
      {skillId: '184367', caption: '학살자 · 칼날폭풍 뒤 첫 광란'},
      {skillId: '5308', caption: '학살자 · 급살 발동 때만'},
      {skillId: '107574', caption: '산왕 · 무모한 희생과 함께'},
      {skillId: '435607', caption: '산왕 · 2중첩 전 · 투신 끝나기 전'},
      {skillId: '6343', caption: '산왕 · 다른 핵심 기술이 비면'},
    ];

    // 2부 오프닝 연습
    const opener = block('쿨기와 오프닝');
    opener.paragraphs[1] = rep(opener.paragraphs[1],
      '급살이 떴을 때만 마무리 일격을 쓰고, 잔혹한 마무리를 골랐다면 칼날폭풍 뒤 첫 광란이 50% 강해집니다.',
      '칼날폭풍이 끝나면 바로 광란을 씁니다. 잔혹한 마무리를 골랐다면 이 광란이 50% 강해집니다. 그 뒤로는 광란과 분쇄의 타격(막무가내 선택 시)을 번갈아 쓰고, 급살이 떴을 때만 광란 사이에 마무리 일격을 끼웁니다. 12.1.5 이후 상위 레이드 기록 8개 모두 칼날폭풍 다음 손으로 쓴 첫 스킬이 광란이었습니다.'
    );
    const rails = tlOf(opener)[0].rails;
    const slayerRail = rails.find(r => r.label === '학살자 오프닝');
    slayerRail.nodes = [
      {skillId: '100', caption: '첫 분노 확보'},
      {skillId: '385059', caption: '선택했다면 · 격노 열기'},
      {skillId: '1719', caption: '광란 반복 구간 시작'},
      {skillId: '184367', caption: '분노 비우기 · 격노'},
      {skillId: '227847', caption: '격노 상태로 진입'},
      {skillId: '184367', caption: '잔혹한 마무리면 50%'},
      {skillId: '335097', caption: '막무가내 · 광란 사이'},
      {skillId: '184367', caption: '격노 끝나기 전 다시'},
    ];
    slayerRail.note = '오딘의 격노는 로그마다 무모한 희생 앞뒤가 다릅니다. 칼날폭풍 중에 찍히는 피범벅은 불안정한 정신을 골랐을 때 자동으로 나가는 공격입니다. 급살이 뜨면 광란 사이에 마무리 일격을 끼웁니다. 이 칼날폭풍 빌드에는 투신이 없습니다.';
    const thaneRail = rails.find(r => r.label === '산왕 오프닝');
    thaneRail.note = '피범벅과 분쇄의 타격은 막무가내를 골랐을 때 무모한 희생 중 바뀐 생성기입니다. 4세트·2세트 조건은 세트를 갖췄을 때만 챙깁니다. 피범벅과 분쇄의 타격 사이에 광란이 한 번 더 들어가는 기록도 있습니다(로그마다 다름).';

    // 2부 광역 연습: 산왕은 투신 뒤 우레 작렬
    const aoe = block('광역은 소용돌이부터');
    const aoeInserts = tlOf(aoe)[0].rails.find(r => r.kind === 'inserts');
    aoeInserts.nodes = [
      {skillId: '227847', caption: '학살자 · 모인 대상에게'},
      {skillId: '184367', caption: '학살자 · 3명 이상 적중'},
      {skillId: '5308', caption: '학살자 · 급살 발동 소비'},
      {skillId: '6343', caption: '산왕 · 복제 준비 · 여섯 넘으면'},
      {skillId: '107574', caption: '산왕 · 무모한 희생과 함께'},
      {skillId: '435607', caption: '산왕 · 투신 뒤 바로'},
    ];

    // 영웅 특성 탭 — 학살자
    const slayer = m.heroBranches.find(h => h.label === '학살자');
    slayer.opener.summary = '첫 격노를 열고 광란으로 분노를 비운 뒤 칼날폭풍을 넣습니다. 칼날폭풍이 끝나면 바로 광란을 쓰고, 광란과 분쇄의 타격을 번갈아 씁니다. 급살은 발동했을 때 광란 사이에 소비하며, 오딘의 격노는 선택했을 때만 사용합니다. 이 칼날폭풍 빌드에는 투신이 없습니다.';
    const oldSlayerSteps = slayer.opener.steps;
    slayer.opener.steps = [
      oldSlayerSteps[0],
      {...oldSlayerSteps[1], note: '선택했다면 무모한 희생 앞뒤에 써서 격노를 엽니다. 로그마다 위치가 다릅니다.'},
      oldSlayerSteps[2],
      oldSlayerSteps[3],
      oldSlayerSteps[4],
      {skillId: '184367', label: '광란', note: '칼날폭풍이 끝나면 바로 씁니다. 잔혹한 마무리를 골랐다면 이 광란의 피해가 50% 늘어납니다.', phase: '칼날폭풍 뒤 첫 광란', trigger: '칼날폭풍 종료·광란 비용 확보'},
      {skillId: '335097', label: '분쇄의 타격', note: '막무가내를 골랐다면 무모한 희생 중 분노의 강타가 바뀐 기술입니다. 광란 사이에 하나씩 넣습니다.', phase: '강화 생성기', trigger: '막무가내 선택·무모한 희생 중'},
      {skillId: '184367', label: '광란', note: '분노가 다시 차거나 격노가 끝나기 전에 순환을 이어 갑니다. 급살이 뜨면 이 사이에 마무리 일격을 끼웁니다.', phase: '격노·분노 순환', trigger: '격노 만료 임박 또는 분노 과충전 전·광란 비용 확보'},
    ];
    slayer.bullets = slayer.bullets.map(b => (b.startsWith('오프닝/운용 변화:')
      ? rep(b, '오딘의 격노를 선택했다면 첫 쿨기 전에 격노를 열고, 광란으로 분노를 비운 뒤 칼날폭풍을 사용합니다. 급살 마무리 일격은 발동했을 때만 광란 사이에 배치합니다.',
        '오딘의 격노를 선택했다면 무모한 희생 무렵에 격노를 열고(로그마다 앞뒤가 다름), 광란으로 분노를 비운 뒤 칼날폭풍을 사용합니다. 칼날폭풍이 끝나면 바로 광란을 쓰고, 급살 마무리 일격은 발동했을 때만 광란 사이에 배치합니다.')
      : b));
    slayer.aoe.priority = [
      ...slayer.aoe.priority.slice(0, 6),
      {skillId: '85288', label: '분노의 강타', note: '무모한 희생 밖에서는 피의 갈증보다 먼저 써서 다음 광란 분노를 채웁니다. 복제가 남았을 때 쓰면 추가 대상도 맞습니다.'},
      slayer.aoe.priority[6],
    ];

    // 영웅 특성 탭 — 산왕
    const thane = m.heroBranches.find(h => h.label === '산왕');
    thane.singleTarget.summary = '광란과 격노 유지가 기본입니다. 투신 중 우레 작렬 2중첩, 피범벅의 4세트, 분쇄의 타격의 2세트를 서로 다른 조건으로 확인합니다. 무모한 희생 밖에서는 우레 작렬을 주는 피의 갈증을 분노의 강타보다 먼저 봅니다.';
    const st = thane.singleTarget.priority;
    thane.singleTarget.priority = [
      st[0], st[1], st[2], st[3], st[4],
      {skillId: '23881', label: '피의 갈증', note: '무모한 희생 밖에서는 분노의 강타보다 먼저 씁니다. 분노와 격노 기회, 35% 확률의 우레 작렬을 줍니다.'},
      {skillId: '85288', label: '분노의 강타', note: '피의 갈증 다음에 써서 다음 광란 분노를 채웁니다. 충전이 넘칠 것 같으면 먼저 씁니다.'},
      st[7],
    ];
    thane.aoe.summary = '산왕은 천둥벼락으로 소용돌이 연마의 복제를 먼저 켜고 광란으로 격노를 엽니다. 우레 작렬은 묵히지 않고, 여섯 대상 초과에서는 천둥벼락의 직접 적중도 더 중요해집니다.';
    const ao = thane.aoe.priority;
    thane.aoe.priority = [
      {skillId: '6343', label: '천둥벼락', note: '소용돌이 연마의 복제가 없으면 광란보다 먼저 써서 다시 켭니다. 대상이 여섯을 넘으면 직접 적중도 중요해집니다.'},
      ao[0],
      ao[1],
      ao[3],
      ao[4],
      {skillId: '23881', label: '피의 갈증', note: '무모한 희생 밖에서는 분노의 강타보다 먼저 써서 분노와 우레 작렬 기회를 얻습니다.'},
      ao[5],
      ao[6],
    ];
    return m;
  },
};
