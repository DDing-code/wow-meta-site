// warrior-arms 단일 딜사이클 스조라크 대조 — 근거: digests/warrior-arms.md, apl/warrior_arms.simc, sources/warrior-arms.txt
// 학살자만 고친다. 거신은 스조라크 12.1.5 상위 로그가 없어 그대로 둔다.
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const rep = (text, from, to) => { if (!text.includes(from)) throw new Error('바꿀 문장을 못 찾음: ' + from.slice(0, 30)); return text.replace(from, to); };

module.exports = {
  evidenceNote: '단일 딜사이클 스조라크 대조(2026-10-24): 스조라크 신화(12.1.5) WCL 상위 로그 8개(모두 학살자)의 실제 시전 순서와 심크 우선순위(midnight 3af1a757)·Icy Veins·Method 오프닝을 대조해 학살자 오프닝의 투신을 거인의 강타 바로 뒤로 옮기고(8개 중 7개), 칼날폭풍 중 폭풍망치를 넣었습니다(8개 중 5개, 심크 우선순위 slayer_st storm_bolt,if=buff.bladestorm.up). 단일 반복 순서는 로그와 맞아 그대로 두었고, 프리풀은 심크 우선순위·공개 가이드 모두 돌진으로 시작해 넣을 것이 없었습니다. 거신은 로그가 없어 바꾸지 않았습니다.',
  changelog: [
    '- 학살자 오프닝(연습 장 타임라인·영웅 탭): 돌진 → 회전베기 → 투신 → 거인의 강타 → 마무리 일격 → 칼날폭풍 → 필사의 일격 → 돌진 → 회전베기 → 거인의 강타 → 투신 → 마무리 일격 → 칼날폭풍 → 폭풍망치(칼날폭풍 중) → 필사의 일격 (근거: 스조라크 신화 상위 로그 8개 중 7개가 거인의 강타 다음 투신, 5개가 칼날폭풍 중 폭풍망치. 심크 우선순위 slayer_st 의 avatar,if=debuff.colossus_smash.up…·storm_bolt,if=buff.bladestorm.up, Method 학살자 오프닝 Colossus Smash → Avatar + Execute → Bladestorm)',
    '- 학살자 단일: 영웅 탭 우선순위에서 투신을 거인의 강타 뒤로(오프닝과 같은 순서, 심크 우선순위 avatar 조건은 거인의 강타 약화 효과가 걸렸거나 거인의 강타 쿨 10초 안), 영웅 탭 우선순위와 연습 장 끼워 넣기 rail 에 칼날폭풍 중 폭풍망치(붉은돌격대의 무자비함) 추가. 반복 흐름 rail 순서는 그대로, note 근거를 스조라크 로그(분쇄 직접 사용 0회·회전베기 분당 약 2.8회)로 바꿈',
    '- 프리풀: 심크 우선순위 precombat 은 전투 태세뿐이고 Icy Veins·Method 모두 돌진으로 시작, 로그 음수 초 시전 0/8 → 추가 없음',
    '- 거신: 스조라크 상위 로그 0개라 바꾸지 않음',
  ].join('\n'),
  apply(m) {
    const block = t => m.blocks.find(b => b.title.startsWith(t));

    // 2부 단일 연습: 반복 rail note 근거, 영웅 특성별 끼워 넣기
    const single = block('허수아비 첫 연습');
    const singleRails = tlOf(single)[0].rails;
    const loopRail = singleRails.find(r => r.loop);
    loopRail.note = rep(loopRail.note,
      '12.1.5 이후(10월 13일 미국 적용 뒤) WCL 상위 레이드 기록 2건(학살자)은 분쇄를 직접 한 번도 쓰지 않고 회전베기(18·21회)로 걸었고, 쐐기 기록도 같았습니다.',
      '스조라크 신화 상위 로그 8개(학살자)는 모두 분쇄를 직접 쓰지 않고 회전베기(분당 약 2.8회)로 걸었습니다.'
    );
    const singleInserts = singleRails.find(r => r.kind === 'inserts');
    singleInserts.nodes = [
      {skillId: '163201', caption: '학살자 · 칼날폭풍 직전'},
      {skillId: '227847', caption: '학살자 · 거인의 강타 초반'},
      {skillId: '107570', caption: '학살자 · 칼날폭풍 중'},
      {skillId: '12294', caption: '학살자 · 칼날폭풍 뒤 강화'},
      {skillId: '12294', caption: '거신 · 거인의 힘 쌓기'},
      {skillId: '436358', caption: '거신 · 거인의 강타 안에서'},
      {skillId: '12294', caption: '거신 · 쇄파 뒤 치명타 보상'},
    ];

    // 2부 오프닝 연습
    const opener = block('쿨기와 오프닝');
    opener.concept = rep(opener.concept,
      '분쇄를 건 뒤 투신과 거인의 강타로 첫 구간을 여는 흐름입니다.',
      '분쇄를 건 뒤 거인의 강타와 투신으로 첫 구간을 여는 흐름입니다.'
    );
    opener.paragraphs[0] = rep(opener.paragraphs[0],
      '학살자는 바로 회전베기로 분쇄를 걸고 투신과 거인의 강타를 엽니다. 첫 필사의 일격은 칼날폭풍 뒤에 씁니다. 12.1.5 이후 상위 레이드 기록 7개가 모두 이 순서였고, 분쇄를 직접 쓴 기록은 없었습니다.',
      '학살자는 바로 회전베기로 분쇄를 걸고 거인의 강타를 연 뒤 곧바로 투신을 겹칩니다. 첫 필사의 일격은 칼날폭풍 뒤에 씁니다. 스조라크 신화 상위 로그 8개가 모두 회전베기로 시작했고, 7개는 거인의 강타 다음에 투신을 썼습니다. 분쇄를 직접 쓴 기록은 없었습니다.'
    );
    opener.paragraphs[1] = rep(opener.paragraphs[1],
      '불안정한 정신을 골랐다면 칼날폭풍 중에 필사의 일격이 자동으로 나가고, 잔혹한 마무리는',
      '불안정한 정신을 골랐다면 칼날폭풍 중에 필사의 일격이 자동으로 나갑니다. 붉은돌격대의 무자비함으로 칼날폭풍 중에 폭풍망치도 던질 수 있으니 쿨다운이면 이때 씁니다. 잔혹한 마무리는'
    );
    const openerRails = tlOf(opener)[0].rails;
    const slayerOpenerRail = openerRails.find(r => r.label === '학살자 오프닝');
    slayerOpenerRail.nodes = [
      {skillId: '100', caption: '붙으며 분노 확보'},
      {skillId: '845', caption: '분쇄 걸기'},
      {skillId: '167105', caption: '공격 가능한 10초'},
      {skillId: '107574', caption: '강타 바로 뒤에'},
      {skillId: '163201', caption: '급살 먼저 쓰기'},
      {skillId: '227847', caption: '구간 초반에 겹치기'},
      {skillId: '107570', caption: '칼날폭풍 중에'},
      {skillId: '12294', caption: '칼날폭풍 뒤 강화'},
    ];
    slayerOpenerRail.note = '투신은 거인의 강타 바로 뒤에 겹쳐 씁니다. 스조라크 신화 상위 로그 8개 중 7개가 이 순서였고, 5개는 칼날폭풍 중에 폭풍망치를 던졌습니다. 쇠날발톱을 골랐다면 거인의 강타 바로 앞에 맞힙니다. 칼날폭풍 중에 나가는 필사의 일격은 불안정한 정신의 자동 시전이고, 칼날폭풍은 쇄파와 함께 쓰는 순서가 아닙니다.';

    // 영웅 특성 탭 — 학살자
    const hero = m.heroBranches.find(h => h.label === '학살자');
    hero.opener.summary = '돌진 뒤 회전베기로 분쇄를 걸고 거인의 강타를 연 뒤 바로 투신을 겹칩니다. 급살 마무리 일격을 먼저 쓰고 칼날폭풍을 넣고, 칼날폭풍 중에 폭풍망치를 던진 뒤 첫 필사의 일격을 씁니다. 쇠날발톱은 선택했다면 거인의 강타 직전에 추가합니다.';
    const st = Object.fromEntries(hero.opener.steps.map(s => [s.skillId, s]));
    hero.opener.steps = [
      st['100'],
      st['845'],
      {...st['167105'], trigger: '분쇄 적용 뒤·대상 공격 가능'},
      {...st['107574'], note: '선택했다면 거인의 강타 바로 뒤에 겹쳐 씁니다. 스조라크 신화 상위 로그 8개 중 7개가 이 순서였습니다.', trigger: '투신 선택·거인의 강타 직후'},
      st['163201'],
      st['227847'],
      {skillId: '107570', label: '폭풍망치', note: '붉은돌격대의 무자비함으로 칼날폭풍 중에 던질 수 있습니다. 스조라크 신화 상위 로그 8개 중 5개가 이 자리에서 썼습니다.', phase: '칼날폭풍 중 추가 피해', trigger: '칼날폭풍 중·폭풍망치 쿨다운'},
      st['12294'],
    ];
    const pr = Object.fromEntries(hero.singleTarget.priority.map(p => [p.skillId, p]));
    hero.singleTarget.priority = [
      pr['845'],
      pr['167105'],
      {...pr['107574'], note: '선택했다면 거인의 강타를 연 직후에 겹쳐 씁니다. 거인의 강타가 10초 안에 돌아오는 때라면 먼저 써도 구간이 겹칩니다.'},
      pr['163201'],
      pr['227847'],
      {skillId: '107570', label: '폭풍망치(칼날폭풍 중)', note: '붉은돌격대의 무자비함으로 칼날폭풍 중에 쓸 수 있습니다. 칼날폭풍이 돌 때 쿨다운이면 던집니다.'},
      pr['12294'],
      pr['7384'],
      pr['1269383'],
      pr['1464'],
    ];
    if (hero.singleTarget.priority.some(p => !p)) throw new Error('학살자 단일 우선순위 항목 누락');
    hero.singleTarget.summary = '각 기술 사용 후 위에서 다시 확인하는 조건표입니다. 분쇄는 회전베기로 겁니다. 거인의 강타 뒤에는 급살 마무리 일격을 먼저 쓰고 칼날폭풍을 겹치며, 칼날폭풍 중에는 폭풍망치를 던집니다.';
    return m;
  },
};
