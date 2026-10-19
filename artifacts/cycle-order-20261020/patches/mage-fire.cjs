// mage-fire 딜사이클 순서 수정 — 근거: digests/mage-fire.md, apl/mage_fire.simc
// 성난태양만 고친다. 서리불꽃은 12.1.5 이후 상위 로그가 없어 그대로 둔다(공통 광역 반복 rail 에서는 서리불꽃 유성 시점을 끼워 넣기로 따로 적는다).
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const must = (cond, what) => { if (!cond) throw new Error('mage-fire: 찾지 못함 — ' + what); };
const rep = (text, from, to) => { must(text.includes(from), from.slice(0, 30)); return text.replace(from, to); };

module.exports = {
  evidenceNote: '딜사이클 순서 대조(2026-10-20): 12.1.5 이후 WCL 상위 레이드 5개·쐐기 7개(모두 성난태양)의 실제 시전 순서와 심크 APL(midnight d91a5707, sf_combustion 목록)을 대조해 성난태양 유성을 발화보다 먼저(레이드 발화 26번 중 18번, 레이드 5명 중 4명, 쐐기 7명 중 4명) 누르고 유성으로 받은 화염 파열 직접 시전 중에 발화를 켜는 순서로 오프닝·발화 10초·광역 진입·영웅 탭을 고쳤고, 평시 rail 의 중간 유성 조건을 쿨마다로 바꿨습니다(레이드 5개 모두 발화 사이에 유성 한 번). 서리불꽃은 로그가 없어 바꾸지 않았습니다.',
  changelog: [
    '- 성난태양 오프닝(2부 오프닝 rail·영웅 탭): … → 진입 A 불덩이 작렬 → 진입 B 불태우기 → 발화 → 유성 → 불덩이 작렬 을 … → 유성 → 진입 A 불덩이 작렬 → 진입 B 불태우기 → 발화 → 불덩이 작렬 로 (근거: 레이드 5개 중 4개가 첫 발화 1.5~1.9초 전에 유성, 그 뒤 불덩이 작렬·불기둥 직접 시전 중에 발화. 예: https://www.warcraftlogs.com/reports/T3VrzW2LFBdf6Aat#fight=1&source=14 14.3 유성 → 15.2 불덩이 작렬 → 16.2 발화. APL sf_combustion 의 meteor,if=buff.combustion.down&talent.sunfury_execution 이 진입 주문보다 위, combustion 은 진입 시전 끝나기 직전 또는 유성 착탄 0.3초 전)',
    '- 성난태양 발화 10초 rail(2부 단일 연습): 발화 → 유성 → 불덩이 작렬 → … 를 유성 → 불덩이 작렬(화염 파열 진입, 위: 불태우기) → 발화 → 화염 작렬 → 불덩이 작렬 → 불태우기 → 불덩이 작렬로 (근거: 레이드 발화 26번 중 18번이 직전 4회 안에 유성, 발화 다음 버튼 화염 작렬 77%)',
    '- 성난태양 평시 rail 의 위쪽 유성 조건: "발화 안 착탄이 가능하면" → "중간 유성 · 쿨이 돌면" (근거: 레이드 5개 모두 발화 사이 약 30초 지점에 유성을 한 번씩 씀. APL sf_filler 의 meteor,if=talent.blast_zone&time>combustion_delay)',
    '- 성난태양 광역 진입 rail·영웅 탭 광역 흐름: 불태우기 → 화염 작렬 → 발화 → 유성 → 불기둥 을 유성 → 불기둥(화염 파열 직접 시전, 위: 불태우기) → 발화 → 화염 작렬 → 불기둥 → 화염 작렬로 (근거: 쐐기 발화 156번 중 92번이 유성 먼저·23번만 유성 나중, 진입 주문은 불기둥 직접 시전이 가장 흔함. APL sf_combustion 의 flamestrike,if=buff.combustion.down&!buff.hot_streak.react&buff.pyroclasm.up)',
    '- 영웅 탭 성난태양 단일·광역 우선순위: 1 발화 → 2 유성 을 1 유성 → 2 발화 로 바꾸고 설명을 맞춤',
    '- 공통 광역 반복 rail: 위쪽 가지를 유성(1번 칸) → 발화(2번 칸)로 옮기고, 서리불꽃 유성(발화 후반)은 상황별 끼워 넣기에 따로 적음',
    '- 같은 순서를 말하는 문장 맞춤: 유성 장 본문, 단일 연습 본문(우선순위 요약), 오프닝 장 한 줄 원리·본문, 성난태양 장 본문, 쐐기 한 판 본문·예시',
    '- 그대로 둔 것: 오프닝 앞부분(풀 직접 불덩이 작렬 → 화염구 → 화염 작렬 → 불덩이 작렬, 레이드 5개 모두 일치), 진입 B 불태우기(레이드 1명이 사용), 서리불꽃 전체(로그 0개)',
  ].join('\n'),
  apply(m) {
    const block = t => { const b = m.blocks.find(x => x.title.startsWith(t)); must(b, '장 ' + t); return b; };

    // 1부 발화·유성 장: 영웅별 유성 시점
    const cds = block('발화 10초와 유성 하나가');
    cds.paragraphs[1] = rep(cds.paragraphs[1],
      '적이 바닥 위에 머물러야 상향분을 받습니다.',
      '적이 바닥 위에 머물러야 상향분을 받습니다. 성난태양은 발화보다 1~2초 먼저 눌러 발화 초반에 떨어뜨리고, 서리불꽃은 발화 후반 남은 8초 안에 씁니다.');

    // 2부 단일 연습
    const single = block('첫 연습은 단일 대상');
    single.paragraphs[0] = rep(single.paragraphs[0],
      '발화 → 유성(발화 안 착탄) → 불덩이 작렬(몰아치는 열기!)',
      '유성(발화 직전, 발화 안 착탄) → 발화(진입 시전 끝나기 전) → 불덩이 작렬(몰아치는 열기!)');
    single.paragraphs[1] = rep(single.paragraphs[1],
      '유성으로 받은 화염 파열은 완충 위험이 없고 시전을 끝낼 여유가 있을 때 씁니다.',
      '발화가 돌아오면 유성을 먼저 누르고, 유성으로 받은 화염 파열로 불덩이 작렬 직접 시전을 시작한 뒤 그 시전이 끝나기 전에 발화를 켭니다. 그 밖에 유성으로 받은 화염 파열은 완충 위험이 없고 시전을 끝낼 여유가 있을 때 씁니다.');
    const singleRails = tlOf(single)[0].rails;
    const normal = singleRails.find(r => r.label === '평시 반복 — 단일 (성난태양 기준)');
    must(normal && normal.nodes[2].above && normal.nodes[2].above.skillId === '153561', '평시 rail 유성 가지');
    normal.nodes[2].above = {skillId: '153561', when: '중간 유성 · 쿨이 돌면'};
    normal.note = '몰아치는 열기!가 이미 있으면 화염 작렬을 건너뛰고 바로 소비합니다. 화염 파열 직접 시전은 서서 끝낼 수 있을 때만 합니다. 폭발 지대의 중간 유성은 발화를 기다리지 않고 쿨이 돌면 씁니다.';
    const comb = singleRails.find(r => r.label === '발화 10초 — 단일 (성난태양 기준)');
    must(comb, '발화 10초 rail');
    comb.nodes = [
      {skillId: '153561', caption: '발화 1~2초 전에 먼저'},
      {skillId: '11366', caption: '화염 파열 직접 진입', above: {skillId: '2948', when: '화염 파열 없으면 대신'}},
      {skillId: '190319', caption: '진입 시전 끝나기 전'},
      {skillId: '108853', caption: '열기만 있을 때'},
      {skillId: '11366', caption: '몰아치는 열기! 소비', above: {skillId: '11366', when: '화염 파열 · 끝낼 시간과 충전 여유'}},
      {skillId: '2948', caption: '화염 작렬 충전이 없으면'},
      {skillId: '11366', caption: '소비'},
    ];
    comb.note = '유성은 누르고 3초 뒤에 떨어지니 발화보다 먼저 눌러 발화 초반에 맞힙니다. 12.1.5 상위 레이드 로그 5개 중 4개가 이 순서였습니다. 광열로 충전이 돌아오면 다시 즉시 소비 중심으로 돌아갑니다. 정해진 횟수만큼 불태우기를 억지로 넣지 않습니다.';

    // 2부 오프닝 연습
    const opener = block('쿨기와 오프닝');
    opener.concept = rep(opener.concept,
      '진입 주문의 시전이 끝나기 전에 발화를 켭니다.',
      '진입 주문의 시전이 끝나기 전에 발화를 켭니다. 성난태양은 그 전에 유성을 먼저 누릅니다.');
    opener.paragraphs[2] = rep(opener.paragraphs[2],
      '버프가 없다면 성난태양은 불태우기, 서리불꽃은 얼음불꽃 화살로 진입합니다.',
      '버프가 없다면 성난태양은 불태우기, 서리불꽃은 얼음불꽃 화살로 진입합니다. 성난태양은 진입 주문보다 유성을 먼저 누릅니다. 유성은 누르고 3초 뒤에 떨어지니 발화보다 1~2초 먼저 누르면 발화 초반에 착탄하고, 성난태양 처형자로 받은 화염 파열을 그대로 진입 불덩이 작렬에 쓸 수 있습니다. 12.1.5 상위 레이드 로그 5개 중 4개가 이 순서였습니다.');
    const sunOpener = tlOf(opener)[0].rails.find(r => r.label === '오프닝 — 성난태양');
    must(sunOpener, '성난태양 오프닝 rail');
    sunOpener.nodes = [
      {skillId: '11366', caption: '풀에 맞춘 직접 시전'},
      {skillId: '133', caption: '방화광 · 90% 초과'},
      {skillId: '108853', caption: '시전 중 열기 전환'},
      {skillId: '11366', caption: '화염구 끝에 즉시 소비'},
      {skillId: '153561', caption: '발화 직전 · 먼저 누르기'},
      {skillId: '11366', caption: '진입 A · 화염 파열 직접 시전'},
      {skillId: '2948', caption: '진입 B · 화염 파열 없을 때만'},
      {skillId: '190319', caption: '진입 시전 끝나기 직전'},
      {skillId: '11366', caption: '이후 단일 우선순위로'},
    ];
    sunOpener.note = '진입 A와 B는 둘 중 가능한 하나만 씁니다. 연달아 쓰는 순서가 아닙니다. 유성은 발화보다 1~2초 먼저 눌러 발화 초반에 떨어뜨리고, 받은 화염 파열로 진입 A를 씁니다. 첫 치명타 결과에 따라 앞부분 반복 횟수가 달라집니다.';

    // 2부 광역 연습
    const aoe = block('광역은 무엇을 빨리 죽일지');
    const aoeRails = tlOf(aoe)[0].rails;
    const sunAoe = aoeRails.find(r => r.label === '광역 진입 — 성난태양');
    must(sunAoe, '성난태양 광역 진입 rail');
    sunAoe.nodes = [
      {skillId: '153561', caption: '모인 지점 · 발화 직전'},
      {skillId: '2120', caption: '화염 파열 직접 진입', above: {skillId: '2948', when: '화염 파열 없으면 대신'}},
      {skillId: '190319', caption: '진입 시전 끝나기 전'},
      {skillId: '108853', caption: '열기만 있을 때'},
      {skillId: '2120', caption: '몰아치는 열기! 즉시 소비'},
      {skillId: '108853', caption: '다음 불기둥 준비'},
    ];
    sunAoe.note = '유성을 발화보다 1~2초 먼저 눌러 발화 초반에 모인 지점에 떨어뜨립니다. 유성으로 받은 화염 파열로 불기둥을 직접 시전하고, 그 시전이 끝나기 전에 발화를 켭니다. 화염 파열이 없으면 불태우기로 진입합니다.';
    const loop = aoeRails.find(r => r.label === '반복 흐름 — 광역 (두 영웅 공통)');
    must(loop && loop.nodes[0].above?.skillId === '190319' && loop.nodes[2].above?.skillId === '153561', '공통 광역 반복 rail');
    loop.nodes[0] = {...loop.nodes[0], above: {skillId: '153561', when: '성난태양 · 발화 직전 먼저'}};
    loop.nodes[1] = {...loop.nodes[1], above: {skillId: '190319', when: '적이 모였고 시간이 충분하면'}};
    loop.nodes[2] = {skillId: loop.nodes[2].skillId, caption: loop.nodes[2].caption};
    loop.note = '기본 주문까지 긴 불기둥 시전으로 바꾸지 않습니다. 다음 화염 작렬을 누르기 전에 열기와 소비 상태를 다시 봅니다. 성난태양은 유성을 발화보다 먼저 누르고, 서리불꽃은 발화 안 후반에 씁니다.';
    const inserts = aoeRails.find(r => r.label === '상황별로 끼워 넣는 것');
    must(inserts && inserts.nodes.length === 4, '광역 끼워 넣기 rail');
    inserts.nodes = [...inserts.nodes, {skillId: '153561', caption: '서리불꽃 · 발화 후반 착탄'}];

    // 3부 성난태양 장
    const sun = block('성난태양: 구슬로 불사조를 키우고');
    sun.paragraphs[3] = rep(sun.paragraphs[3],
      '성난태양 처형자는 유성이 화염 파열을 주게 하고 보너스도 20% 높입니다.',
      '성난태양 처형자는 유성이 화염 파열을 주게 하고 보너스도 20% 높입니다. 그래서 발화 직전에 유성을 먼저 누르면 받은 화염 파열을 발화 진입 직접 시전에 바로 쓸 수 있습니다.');

    // 3부 쐐기 한 판
    const mplus = block('쐐기 한 판');
    mplus.paragraphs[0] = rep(mplus.paragraphs[0],
      '적이 멈추면 발화를 켜고, 실제로 모인 지점에 유성을 떨어뜨린 뒤 불기둥으로 몰아칩니다.',
      '적이 멈추면 실제로 모인 지점에 유성을 먼저 누르고, 유성으로 받은 화염 파열 불기둥을 직접 시전하면서 발화를 켠 뒤 불기둥으로 몰아칩니다.');
    mplus.example = {...mplus.example, text: rep(mplus.example.text, '적이 멈추면 발화와 유성을 쓰고,', '적이 멈추면 유성을 먼저 누르고 발화를 켠 뒤,')};

    // 영웅 특성 탭: 성난태양
    const hero = m.heroBranches.find(h => h.label === '성난태양');
    must(hero, '성난태양 영웅 탭');
    const os = hero.opener.steps;
    must(os.length === 9 && os[6].skillId === '190319' && os[7].skillId === '153561', '성난태양 오프닝 7·8단계');
    hero.opener.summary = '방화광을 선택한 단일 시작입니다. 첫 치명타 결과에 따라 반복 횟수가 달라집니다. 유성은 발화보다 먼저 누르고, 발화 진입은 화염 파열 직접 불덩이 작렬 또는 불태우기 중 가능한 하나만 사용하세요.';
    hero.opener.steps = [
      ...os.slice(0, 4),
      {skillId: '153561', label: '유성', note: '발화를 켜기 1~2초 전에 누릅니다. 3초 뒤 착탄해 발화 초반에 맞고, 성난태양 처형자로 받은 화염 파열을 다음 진입 시전에 씁니다.', phase: '발화 준비', trigger: '발화 직전·착탄 가능'},
      {...os[4], note: '유성으로 받은 화염 파열로 직접 시전을 시작합니다. 즉시 버프가 없고 시전을 끝낼 수 있어야 하며 다음 불태우기 단계는 생략합니다.'},
      os[5],
      os[6],
      os[8],
    ];
    const st = hero.singleTarget.priority;
    must(st[0].skillId === '190319' && st[1].skillId === '153561', '성난태양 단일 1·2순위');
    hero.singleTarget.priority = [
      {...st[1], note: '발화가 돌아오면 발화보다 1~2초 먼저 눌러 발화 초반에 착탄시키고, 받은 화염 파열을 진입 직접 시전에 씁니다. 폭발 지대의 중간 유성은 발화 사이에 쿨이 돌면 쓰고 화염 파열 2중첩 낭비를 확인합니다.'},
      {...st[0], note: '유성을 누른 뒤 진입 직접 시전이 끝나기 전에 켭니다. 첫 방화광 구간은 마친 뒤 사용하고, 공격을 이어 갈 수 있을 때 진입합니다.'},
      ...st.slice(2),
    ];
    const ap = hero.aoe.priority;
    must(ap[0].skillId === '190319' && ap[1].skillId === '153561', '성난태양 광역 1·2순위');
    hero.aoe.priority = [
      {...ap[1], note: '모인 적에게 발화보다 1~2초 먼저 떨어뜨려 발화 안에 맞히고, 성난태양 처형자의 화염 파열을 진입 불기둥에 씁니다. 적이 곧 흩어지거나 죽으면 고정된 타이밍을 기다리지 않습니다.'},
      {...ap[0], note: '유성 뒤 진입 시전이 끝나기 전에 켭니다. 방화광 첫 구간과 다음 큰 풀 배정은 별도 판단하며 무조건 모든 풀에 지연하지 않습니다.'},
      ...ap.slice(2),
    ];
    const as = hero.aoe.steps;
    must(as.length === 6 && as[0].skillId === '2948' && as[3].skillId === '153561', '성난태양 광역 흐름');
    hero.aoe.steps = [
      {skillId: '153561', label: '유성', note: '모인 지점에 발화보다 1~2초 먼저 떨어뜨립니다. 성난태양 처형자로 받은 화염 파열을 다음 진입 시전에 씁니다.', phase: '진입 준비', trigger: '몹 집결·발화 직전'},
      {skillId: '2120', label: '불기둥', note: '화염 파열을 받은 직접 시전으로 진입합니다. 화염 파열이 없으면 불태우기로 대신합니다.', phase: '진입', trigger: '화염 파열·4대상 이상'},
      as[2],
      {...as[1], note: '열기를 몰아치는 열기!로 바꿉니다. 이미 몰아치는 열기!가 있으면 충전을 더 쓰지 않고 소비로 넘어갑니다.'},
      as[4],
      as[5],
    ];
    return m;
  },
};
