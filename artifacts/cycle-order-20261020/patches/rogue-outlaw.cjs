// rogue-outlaw 딜사이클 순서 수정 — 근거: digests/rogue-outlaw.md, apl/rogue_outlaw.simc
const tl = b => (Array.isArray(b.timeline) ? b.timeline : b.timeline ? [b.timeline] : []);
const block = (m, start) => {
  const b = m.blocks.find(x => x.title.startsWith(start));
  if (!b) throw new Error('장 없음: ' + start);
  return b;
};
const rail = (b, label) => {
  for (const t of tl(b)) for (const r of t.rails || []) if (r.label.startsWith(label)) return r;
  throw new Error('rail 없음: ' + label);
};
const hero = (m, label) => {
  const h = m.heroBranches.find(x => x.label === label);
  if (!h) throw new Error('영웅 없음: ' + label);
  return h;
};
const replaceText = (arr, from, to) => {
  const i = arr.findIndex(x => x.includes(from));
  if (i < 0) {
    if (arr.some(x => x.includes(to))) return;
    throw new Error('문장 없음: ' + from);
  }
  arr[i] = arr[i].replace(from, to);
};

// 오프닝 줄(두 영웅 공통 뼈대): 아드레날린 촉진 → 난도질 → 뼈주사위 → … → 미간 적중 → 광기의 학살자 → 마음가짐 → 아드레날린 촉진 → 광기의 학살자
const openerNodes = c => [
  {skillId: '13750', caption: c.ar},
  {skillId: '315496', caption: c.snd},
  {skillId: '315508', caption: c.rtb},
  {skillId: '381989', caption: c.ki},
  {skillId: '13877', caption: '적 2명 이상일 때만'},
  {skillId: '271877', caption: c.br},
  {skillId: '193315', caption: c.ss},
  {skillId: '315341', caption: c.bte},
  {skillId: '51690', caption: '돌아온 점수로 바로'},
  {skillId: '1277933', caption: '세 쿨기를 쓴 뒤'},
  {skillId: '13750', caption: '첫 촉진이 끝나면 다시'},
  {skillId: '51690', caption: c.ks2},
];

function rebuildHeroOpener(h, heroNote) {
  const s = h.opener.steps;
  const by = id => {
    const r = s.find(x => x.skillId === id);
    if (!r) throw new Error(h.label + ' 오프닝 행 없음: ' + id);
    return r;
  };
  const ar = by('13750'), rtb = by('315508'), snd = by('315496'), ki = by('381989'), bf = by('13877'), br = by('271877'), ss = by('193315'), bte = by('315341'), ks = by('51690');
  snd.note = '아드레날린 촉진 연마로 채운 점수로 공격 속도를 먼저 준비하고 뼈주사위로 넘어갑니다. 연마를 선택하지 않아 점수가 없다면 전투에 들어가 먼저 생성해야 합니다.';
  ks.label = '광기의 학살자';
  ks.trigger = '미간 적중 직후 · 안전한 채널';
  ks.note = heroNote.ks;
  return [
    ar, snd, rtb, ki, bf, br, ss, bte, ks,
    {skillId: '1277933', label: '마음가짐', phase: '쿨기 초기화', trigger: '세 쿨기를 쓴 뒤', note: '아드레날린 촉진·미간 적중·광기의 학살자를 실제로 쓴 뒤 초기화합니다. 그사이에는 단일·광역 우선순위대로 미간 적중·속결과 생성기를 이어 갑니다.'},
    {skillId: '13750', label: '두 번째 아드레날린 촉진', phase: '두 번째 극딜', trigger: '첫 촉진이 끝난 뒤', note: '첫 아드레날린 촉진 효과가 끝나면 초기화된 촉진을 다시 켭니다. 연마가 있다면 점수가 낮을 때 켜서 채운 점수를 바로 다음 광기의 학살자에 씁니다.'},
    {skillId: '51690', label: '두 번째 광기의 학살자', phase: '두 번째 극딜', trigger: '촉진 직후 · 6점 이상', note: heroNote.ks2},
  ];
}

module.exports = {
  evidenceNote: '딜사이클 순서 대조(2026-10-20): 12.1.5 이후 WCL 상위 레이드 6개·쐐기 8개(모두 기만자, 운명결속 로그 없음)의 실제 시전 순서와 심크 APL(midnight d91a5707)을 대조해, 오프닝을 아드레날린 촉진 → 난도질 → 뼈주사위 → … → 미간 적중 → 광기의 학살자 → 마음가짐 → 두 번째 아드레날린 촉진 → 광기의 학살자로 바꾸고, 반복 흐름에서 아드레날린 촉진 바로 뒤에 광기의 학살자가 오도록, 미간 적중이 함께 준비됐으면 미간 적중을 먼저 쓰도록 맞췄습니다. 운명결속은 로그가 없어 영웅과 무관한 APL 줄(사전 준비·마음가짐·마무리 순서)만 같은 뼈대로 반영했습니다.',
  changelog: [
    '- 오프닝(2부 오프닝 장 두 줄, 두 영웅 탭 오프닝): … 사악한 일격 → 미간 적중 → 권총 사격(부족한 점수) → 광기의 학살자 ⇒ … 사악한 일격 → 미간 적중 → 광기의 학살자 → 마음가짐 → 아드레날린 촉진 → 광기의 학살자. 근거: 기만자 레이드 오프닝 6개 중 5개가 미간 적중 → 광기의 학살자(그 사이 생성기는 3개 없음·2개 사악한 일격, 권총 사격 0개 — 첫 권총 사격은 5개가 광기의 학살자 뒤, 1개는 미간 적중 앞), 6개 모두 전투 10초 안에 마음가짐을 쓰고 첫 촉진이 끝날 무렵(10초 안팎) 아드레날린 촉진 → 광기의 학살자를 다시 씀(예: https://www.warcraftlogs.com/reports/vaVzfBrCmj9yHGYn#fight=5&source=31 ). APL cds preparation(=마음가짐),if=cooldown.adrenaline_rush.remains>30&!cooldown.between_the_eyes.ready&!cooldown.killing_spree.ready, adrenaline_rush,if=!buff.adrenaline_rush.up, finish 목록 between_the_eyes → killing_spree.',
    '- 오프닝 사전 준비: 아드레날린 촉진 → 뼈주사위 → 난도질 ⇒ 아드레날린 촉진 → 난도질 → 뼈주사위. 근거: APL precombat adrenaline_rush → slice_and_dice → roll_the_bones, 난도질을 쓴 로그 3개 모두 뼈주사위보다 먼저(나머지 3개는 오프닝에 난도질 없음).',
    '- 단일 반복 rail: 아드레날린 촉진 가지를 1번 사악한 일격 위 → 미간 적중 다음 사악한 일격 위로, 뼈주사위 가지를 1번 자리로 맞바꿈. 근거: 레이드 반복 다음 스킬 표 아드레날린 촉진 → 광기의 학살자 54%·미간 적중 23%, 쐐기에서도 아드레날린 촉진 직후(또는 미간 적중 하나 뒤) 광기의 학살자.',
    '- 광역 반복 rail: 광기의 학살자 가지를 미간 적중 위 → 속결 위로. 근거: 쐐기 로그에서 아드레날린 촉진 → 미간 적중 → 광기의 학살자 순서가 다수, APL finish 목록 between_the_eyes가 killing_spree보다 위. 두 영웅 탭 단일·광역 광기의 학살자 행 note와 3장 본문도 "미간 적중이 함께 준비됐으면 미간 적중 먼저"로 맞춤.',
    '- 그대로 둔 것: 단일·광역 우선순위 행 순서(조건 note로 해결), 폭풍의 칼날·질풍 칼날 오프닝 단계(조건부, 레이드 로그에는 질풍 칼날 없음), 운명결속 고유 조건(5점 속결·2단계 연장). 운명결속은 12.1.5 이후 상위 로그가 없어 직접 대조하지 못함. 화면에 안 나오는 상단 opener는 건드리지 않음.',
  ].join('\n'),
  apply(m) {
    // 1) 오프닝 두 줄과 두 영웅 탭 오프닝
    const openBlock = block(m, '쿨기와 오프닝');
    const tr = rail(openBlock, '오프닝 — 기만자');
    tr.nodes = openerNodes({ar: '전투 직전 · 낮은 점수', snd: '연마로 얻은 점수로', rtb: '버프가 없거나 낮은 단계', ki: '3단계 이상이면 연장', br: '골랐고 경로가 안전하면', ss: '6점 이상까지 모으기', bte: '첫 피해 버프', ks2: '초기화된 두 번째'});
    tr.note = '세트 무료 속결이 뜨면 추가 생성보다 소비를 먼저 확인합니다. 미간 적중 뒤 점수가 모자라면 필요한 만큼만 채우고 광기의 학살자로 갑니다. 기회가 쌓인 권총 사격은 광기의 학살자 뒤에 처리합니다. 마음가짐 뒤 두 번째 촉진까지는 단일·광역 우선순위대로 돌립니다.';
    const fr = rail(openBlock, '오프닝 — 운명결속');
    fr.nodes = openerNodes({ar: '낮은 점수 · 곧게 선 동전', snd: '효과가 없을 때', rtb: '효과 없음·낮은 단계', ki: '좋은 결과면 연장', br: '골랐고 안전할 때', ss: '운명과의 타협 점수 포함', bte: '일반 6점 이상', ks2: '두 번째 · 이후 속결 5점'});
    fr.note = '동전은 자동으로 던져지는 결과라 오프닝에서 따로 쓰는 스킬이 아닙니다. 첫 강한 소비 뒤 일반 속결은 5점 이상으로 돌립니다. 마음가짐 뒤 두 번째 촉진까지는 우선순위대로 생성·소비를 이어 갑니다.';

    const trick = hero(m, '기만자');
    trick.opener.steps = rebuildHeroOpener(trick, {
      ks: '미간 적중 뒤 돌아온 점수로 바로 씁니다. 점수가 모자라면 사악한 일격이나 기회 권총 사격으로 필요한 만큼만 채웁니다. 채널 후 되돌아온 점수와 기만자 발동을 확인합니다.',
      ks2: '초기화된 광기의 학살자를 촉진으로 채운 점수로 씁니다. 그 뒤에는 돌아온 점수와 기만자 발동을 보고 단일·광역 우선순위로 넘어갑니다.',
    });
    trick.opener.summary = '아드레날린 촉진 연마·6점 이상 상한과 주요 사용 특성을 선택한 예시입니다. 이미 남은 상태는 생략하고 점수가 부족하면 생성 단계를 반복합니다. 첫 미간 적중 뒤 광기의 학살자로 진입하고, 마음가짐으로 되돌린 아드레날린 촉진과 광기의 학살자를 첫 촉진이 끝난 뒤 한 번 더 씁니다. 무료 속결·탄환 보상은 실제 발동에 맞춰 끼웁니다.';
    const fate = hero(m, '운명결속');
    fate.opener.steps = rebuildHeroOpener(fate, {
      ks: '미간 적중 뒤 돌아온 점수로 바로 씁니다. 점수가 모자라면 사악한 일격이나 기회 권총 사격으로 필요한 만큼만 채우고, 강화 상태와 실제 사거리를 확인합니다.',
      ks2: '초기화된 광기의 학살자를 촉진으로 채운 점수로 씁니다. 이후 일반 속결 5점 이상, 무료 속결 별도 조건으로 우선순위를 이어갑니다.',
    });
    fate.opener.summary = '기본 사용 특성과 아드레날린 촉진 연마를 선택한 예시입니다. 처음에는 공통 상태와 첫 강한 마무리 일격을 준비하고, 마음가짐으로 되돌린 아드레날린 촉진과 광기의 학살자를 한 번 더 쓴 뒤 일반 속결은 5점 이상으로 돌립니다. 동전은 자동 결과이며 직접 누르는 오프닝 기술이 아닙니다.';

    openBlock.concept = '오프닝은 첫 상태 준비(아드레날린 촉진·난도질·뼈주사위), 첫 소비(미간 적중 → 광기의 학살자), 그리고 마음가짐으로 되돌린 두 번째 아드레날린 촉진 → 광기의 학살자로 나눕니다. 두 영웅 특성의 순서는 같고, 단계마다 보는 조건이 조금 다릅니다.';
    replaceText(openBlock.paragraphs, '이어서 뼈주사위를 굴리고, 채워진 점수로 난도질을 켭니다.', '이어서 채워진 점수로 난도질을 켜고 뼈주사위를 굴립니다.');
    replaceText(openBlock.paragraphs, '미간 적중 뒤 비장의 일격이나 도굴꾼으로 점수가 돌아왔는지 보고, 부족한 점수만 채워 광기의 학살자로 들어갑니다.', '미간 적중 뒤 비장의 일격이나 도굴꾼으로 점수가 돌아왔는지 보고, 바로 광기의 학살자로 들어갑니다. 점수가 모자랄 때만 필요한 만큼 채웁니다.');
    replaceText(openBlock.paragraphs, '첫 상태 준비가 끝나면 단일·광역 우선순위로 돌아갑니다.', '첫 아드레날린 촉진·미간 적중·광기의 학살자를 모두 썼다면 마음가짐으로 쿨다운을 되돌립니다. 그사이에는 생성과 소비를 이어 가다가, 첫 아드레날린 촉진 효과가 끝나면 되돌린 촉진을 다시 켜고 광기의 학살자로 잇습니다. 여기까지 끝나면 단일·광역 우선순위로 돌아갑니다.');

    // 2) 단일 반복 rail: 아드레날린 촉진은 미간 적중 뒤(바로 광기의 학살자로), 뼈주사위는 맨 앞
    const stBlock = block(m, '허수아비 첫 연습');
    const st = rail(stBlock, '반복 흐름 — 단일');
    st.nodes = [
      {skillId: '193315', caption: '점수가 모자라면 생성', above: {skillId: '315508', when: '효과가 없거나 1단계 이하면 다시 굴리기'}},
      {skillId: '185763', caption: '기회 6중첩이면 처리'},
      {skillId: '315341', caption: '6점 이상 · 피해 버프', above: {skillId: '2098', when: '세트 무료 속결이 뜨면 점수와 상관없이 먼저'}},
      {skillId: '193315', caption: '돌아온 점수 확인 뒤 생성', above: {skillId: '13750', when: '쿨이 돌았고 2점 이하면 먼저 켜기'}},
      {skillId: '2098', caption: '6점 이상 소비', above: {skillId: '51690', when: '쿨이 돌았고 6점 이상이면 속결보다 먼저'}},
      {skillId: '193315', caption: '점수 생성'},
      {skillId: '185763', caption: '낮은 점수 · 기회 3중첩', above: {skillId: '271877', when: '골랐고 안전하게 맞힐 수 있으면'}},
      {skillId: '2098', caption: '6점 이상 소비'},
    ];
    st.note = '점수가 이미 충분하면 생성기를 건너뛰고 바로 마무리 일격을 씁니다. 아드레날린 촉진 연마로 점수가 차면 사이의 생성기를 건너뛰고 바로 광기의 학살자로 갑니다. 미간 적중과 광기의 학살자 뒤에는 돌아온 점수부터 봅니다. 운명결속은 일반 속결을 5점 이상에서 씁니다.';

    // 3) 광역 반복 rail: 광기의 학살자는 미간 적중 다음(속결보다 먼저)
    const aoe = rail(block(m, '광역:'), '반복 흐름 — 광역');
    const n4 = aoe.nodes[3], n5 = aoe.nodes[4];
    if (n4.skillId !== '315341' || n5.skillId !== '2098') throw new Error('광역 rail 원본 순서가 예상과 다름');
    if (n4.above && n4.above.skillId === '51690') {
      delete n4.above;
      n5.above = {skillId: '51690', when: '6점 이상·안전한 정신 집중이면 속결보다 먼저'};
    }

    // 4) 광기의 학살자 행 note: 미간 적중이 함께 준비됐으면 미간 적중 먼저
    for (const h of [trick, fate]) {
      for (const mode of [h.singleTarget, h.aoe]) {
        const ks = mode.priority.find(r => r.skillId === '51690');
        if (!ks) throw new Error(h.label + ' 광기의 학살자 행 없음');
        const notes = {
          '기만자/singleTarget': '6점 이상으로 안전하게 채널합니다. 아드레날린 촉진·과충전기와 연결합니다. 미간 적중도 준비돼 있다면 미간 적중으로 피해 버프를 먼저 깔고 바로 이어서 씁니다.',
          '기만자/aoe': '6점 이상에서 안전하게 사용합니다. 미간 적중도 준비돼 있다면 먼저 써서 피해 버프를 깔고 바로 이어서 씁니다. 위험 패턴 때문에 채널을 못 마칠 순간은 피합니다.',
          '운명결속/singleTarget': '6점 이상에서 준비된 강화와 함께 사용합니다. 미간 적중도 준비돼 있다면 미간 적중으로 피해 버프를 먼저 깔고 바로 이어서 쓰되, 정렬을 만들려고 장시간 보류하지 않습니다.',
          '운명결속/aoe': '높은 점수와 준비된 강화를 안전한 채널에 사용합니다. 미간 적중도 준비돼 있다면 먼저 쓰고 바로 이어서 씁니다. 운명결속이라고 이 마무리 일격을 삭제하거나 항상 속결 뒤로 미루지 않습니다.',
        };
        ks.note = notes[h.label + '/' + (mode === h.aoe ? 'aoe' : 'singleTarget')];
      }
    }
    const b3 = block(m, '강한 마무리 일격');
    replaceText(b3.paragraphs, '미간 적중과 광기의 학살자가 함께 준비됐다면 미간 적중으로 피해 버프를 먼저 깔 수 있지만, 이 정렬을 만들려고 한쪽을 오래 묶어 두지는 않습니다.', '미간 적중과 광기의 학살자가 함께 준비됐다면 미간 적중으로 피해 버프를 먼저 깔고 바로 광기의 학살자를 씁니다. 다만 이 정렬을 만들려고 한쪽을 오래 묶어 두지는 않습니다.');
    return m;
  },
};
