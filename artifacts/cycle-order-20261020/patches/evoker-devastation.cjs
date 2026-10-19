// evoker-devastation 딜사이클 순서 수정 — 근거: digests/evoker-devastation.md, apl/evoker_devastation.simc
// 비늘사령관만 고친다. 불꽃형성자는 레이드 로그가 없고 쐐기 로그 3개(2명)라 그대로 둔다.
// 하늘빛 휩쓸기(1265872)는 전문화 특성 노드(Azure Sweep, 노드 93273)다. 이 가이드의 특성 견본 세 개(모두 비늘사령관)에 없고,
// 12.1.5 상위 비늘사령관 로그 16개(레이드 8·쐐기 8) 모두 0회라 비늘사령관 반복에서 빼고 "골랐다면" 끼워 넣기로 옮긴다.
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const must = (cond, what) => { if (!cond) throw new Error('evoker-devastation: 찾지 못함 — ' + what); };
const rep = (text, from, to) => { must(text.includes(from), from.slice(0, 30)); return text.replace(from, to); };
const SWEEP = '1265872';

module.exports = {
  evidenceNote: '딜사이클 순서 대조(2026-10-20): 12.1.5 이후 WCL 상위 레이드 8개·쐐기 8개(모두 비늘사령관)의 실제 시전 순서와 심크 APL(midnight d91a5707)을 대조해 비늘사령관 반복·오프닝·광역에서 하늘빛 휩쓸기를 뺐고(특성 견본 세 개에 그 특성이 없고 로그 16개 모두 0회), 오프닝에 용의 분노 직후 전세역전을 넣었으며(레이드 8개 중 5개), 두 번째 영원의 쇄도 뒤 불의 숨결을 바로 잇는 순서로(8개 중 5개) 고쳤습니다. 불꽃형성자는 레이드 로그가 없어 바꾸지 않았습니다.',
  changelog: [
    '- 하늘빛 휩쓸기(1265872): 비늘사령관 단일 반복 rail·오프닝 rail 마지막 칸·광역 진입·광역 반복·영웅 탭(오프닝 11번·단일 7번·광역 7번)에서 뺌. 2부 끼워 넣기 rail 에 "골랐다면 · 영원의 쇄도 뒤"로 남기고, 1부 강화 주문 장·스킬 한눈에 보기·팁의 설명에 "골랐다면"을 붙임 (근거: 하늘빛 휩쓸기는 전문화 특성 노드 93273인데 단일·쐐기·레이드 견본 해독 결과 셋 다 미선택. 레이드 8개·쐐기 8개 비늘사령관 로그 모두 0회이고 다른 시전 번호로도 찍히지 않음. 불꽃형성자 쐐기 2명 중 1명만 사용)',
    '- 비늘사령관 오프닝(2부 오프닝 rail·영웅 탭): 용의 분노 → 영원의 쇄도(위: 전세역전, 지연 때) 를 용의 분노 → 전세역전 → 영원의 쇄도 로 (근거: 레이드 8개 중 5개가 용의 분노와 1초 안에 전세역전, 그 뒤 첫 강화 주문. 예: https://www.warcraftlogs.com/reports/6NcFCGDaZ9KqbpmR#fight=1&source=10 . APL sc 의 tip_the_scales 는 첫 강화 주문 무렵)',
    '- 비늘사령관 오프닝 뒤쪽: 두 번째 깊은 숨결 → 영원의 쇄도 → 파열 → 불의 숨결 → 하늘빛 휩쓸기 를 두 번째 깊은 숨결 → 영원의 쇄도 → 불의 숨결 → 대규모 파열 로 (근거: 레이드 8개 중 5개가 두 번째 영원의 쇄도 바로 뒤 불의 숨결, 사이에 파열을 넣은 기록 2개). 두 번째 깊은 숨결 "7~8초쯤"은 로그상 첫 깊은 숨결 뒤 10~17초(4개 중 3개가 약 16.5초)라 숫자를 고침',
    '- 비늘사령관 광역 진입 rail: … → 기염 → 하늘빛 휩쓸기 → 기염 을 … → 기염 → 파열(대규모 파열 남았으면) → 기염 으로 (근거: 기염이 든 쐐기 풀 47개에서 첫 기염 다음 버튼은 파열 23번이 가장 많고 하늘빛 휩쓸기는 0번. 예: 깊은 숨결 → 용의 분노 → 영원의 쇄도 → 불의 숨결 → 파열 → 기염 → 파열 → 기염)',
    '- 영웅 탭 비늘사령관 단일 우선순위: 전세역전을 5번(불의 숨결 뒤)에서 3번(용의 분노 뒤, 영원의 쇄도 앞)으로 옮김 (근거: 레이드 전세역전 다음 버튼 영원의 쇄도 56%·불의 숨결 44%, 용의 분노 직후 사용 25회 중 13회)',
    '- 같은 순서를 말하는 문장 맞춤: 단일 연습 본문(우선순위 요약), 오프닝 장 본문, 광역 장 본문, 심화 장 두 번째 깊은 숨결 시점',
    '- 그대로 둔 것: 첫 깊은 숨결 → 용의 분노(레이드 8개 중 4개만, 나머지는 용의 분노부터), 첫 영원의 쇄도·불의 숨결 앞뒤(4:4), 불꽃형성자 전체(레이드 로그 0개)',
  ].join('\n'),
  apply(m) {
    const block = t => { const b = m.blocks.find(x => x.title.startsWith(t)); must(b, '장 ' + t); return b; };

    // 0부 스킬 한눈에 보기: 하늘빛 휩쓸기 설명에 "골랐다면"
    const start = m.blocks.find(b => b.part === 'start');
    const gen = start.skillGroups.find(g => g.label === '정수를 모으는 생성기');
    must(gen, '생성기 묶음');
    gen.note = rep(gen.note, '영원의 쇄도 뒤에는 하늘빛 휩쓸기로 바뀝니다.', '하늘빛 휩쓸기 특성을 골랐다면 영원의 쇄도 뒤에 하늘빛 휩쓸기로 바뀝니다.');

    // 1부 강화 주문 장
    const emp = block('불의 숨결과 영원의 쇄도는 보통 1단으로');
    emp.concept = rep(emp.concept, '다음 대규모 파열·하늘빛 휩쓸기를 일찍', '다음 대규모 파열을 일찍');
    emp.paragraphs[1] = rep(emp.paragraphs[1],
      '이동이나 위험한 패턴 때문에 영원의 쇄도 시전이 밀릴 때 쓰는 경우가 많습니다. 안전한 구간이라면 아끼지 말고 쿨다운을 돌립니다. 영원의 쇄도를 쓰면 다음 하늘빛 일격이 하늘빛 휩쓸기로 바뀝니다. 주위 모든 적을 공격하는 강화 생성기이니,',
      '용의 분노를 켠 직후 첫 강화 주문에 쓰거나, 이동이나 위험한 패턴 때문에 영원의 쇄도 시전이 밀릴 때 씁니다. 안전한 구간이라면 아끼지 말고 쿨다운을 돌립니다. 하늘빛 휩쓸기 특성을 골랐다면 영원의 쇄도를 쓸 때 다음 하늘빛 일격이 하늘빛 휩쓸기로 바뀝니다. 기본 비늘사령관 견본에는 이 특성이 없습니다. 골랐다면 주위 모든 적을 공격하는 강화 생성기이니,');
    const eb = emp.bullets.indexOf('영원의 쇄도 뒤 하늘빛 휩쓸기를 사용 가능한 채로 오래 묵히지 않습니다.');
    must(eb >= 0, '강화 주문 장 휩쓸기 요점');
    emp.bullets[eb] = '하늘빛 휩쓸기를 골랐다면 영원의 쇄도 뒤 사용 가능한 채로 오래 묵히지 않습니다.';
    emp.quiz[0] = {...emp.quiz[0], a: rep(emp.quiz[0].a, '적개심 연장과 하늘빛 휩쓸기가 빨라집니다.', '적개심 연장과 다음 대규모 파열이 빨라집니다.')};
    emp.quiz[1] = {...emp.quiz[1], q: rep(emp.quiz[1].q, '영원의 쇄도를 막 썼고', '하늘빛 휩쓸기 특성을 골랐고, 영원의 쇄도를 막 썼으며')};

    // 2부 단일 연습
    const single = block('첫 연습은 단일 대상');
    single.paragraphs[0] = rep(single.paragraphs[0],
      '깊은 숨결 → 용의 분노 → 영원의 쇄도 1단 → 불의 숨결 1단 → 전세역전(지연 방지) → 대규모 파열·파열 → 하늘빛 휩쓸기 → 해방된 불길(3등급 빌드만)',
      '깊은 숨결 → 용의 분노 → 전세역전(용의 분노 직후·지연 방지) → 영원의 쇄도 1단 → 불의 숨결 1단 → 대규모 파열·파열 → 해방된 불길(3등급 빌드만)');
    single.paragraphs[1] = rep(single.paragraphs[1],
      '영원의 쇄도 뒤에 생긴 하늘빛 휩쓸기는 자원 초과를 처리한 다음 바로 씁니다.',
      '하늘빛 휩쓸기는 그 특성을 골랐을 때만 영원의 쇄도 뒤에 자원 초과를 처리하고 씁니다. 기본 견본에는 없고, 12.1.5 상위 비늘사령관 로그에서도 쓰지 않았습니다.');
    const sRails = tlOf(single)[0].rails;
    const sLoop = sRails.find(r => r.label === '반복 흐름 — 단일 (비늘사령관)');
    must(sLoop && sLoop.nodes[4].skillId === SWEEP && sLoop.nodes[2].above?.skillId === '370553', '비늘사령관 단일 rail');
    sLoop.nodes = sLoop.nodes.filter(n => n.skillId !== SWEEP);
    sLoop.nodes[2] = {...sLoop.nodes[2], above: {skillId: '370553', when: '용의 분노 직후 · 시전이 밀릴 때'}};
    const sIns = sRails.find(r => r.kind === 'inserts');
    must(sIns && !sIns.nodes.some(n => n.skillId === SWEEP), '단일 끼워 넣기 rail');
    sIns.nodes = [...sIns.nodes, {skillId: SWEEP, caption: '휩쓸기를 골랐다면 · 영원의 쇄도 뒤'}];

    // 2부 오프닝 연습
    const opener = block('쿨기와 오프닝');
    opener.paragraphs[0] = rep(opener.paragraphs[0],
      '그다음 영원의 쇄도와 불의 숨결을 1단으로 넣어',
      '용의 분노 직후 전세역전을 눌러 첫 강화 주문을 즉시 처리하는 기록이 많습니다(12.1.5 상위 레이드 로그 8개 중 5개). 그다음 영원의 쇄도와 불의 숨결을 1단으로 넣어');
    opener.paragraphs[1] = '두 번째 깊은 숨결은 임박한 파괴 할인을 두 번 이상 쓴 다음입니다. 12.1.5 상위 레이드 로그에서는 첫 깊은 숨결 뒤 10~17초에 다시 날아올랐습니다. 사상자와 4세트로 돌아온 영원의 쇄도를 1단으로 바로 쓰고 불의 숨결도 이어서 쓴 뒤, 생긴 대규모 파열로 정수를 비웁니다. 하늘빛 휩쓸기는 그 특성을 골랐을 때만 영원의 쇄도 뒤에 씁니다. 전세역전은 용의 분노 직후 첫 강화 주문에 쓰거나, 이동·시전 지연이 있을 때 씁니다.';
    const scOpener = tlOf(opener)[0].rails.find(r => r.label === '오프닝 — 비늘사령관');
    must(scOpener && scOpener.nodes.length === 11, '비늘사령관 오프닝 rail');
    scOpener.nodes = [
      {skillId: '361469', caption: '풀링 약 2초 전'},
      {skillId: '357210', caption: '맞히자마자 착지'},
      {skillId: '375087', caption: '착지 직후'},
      {skillId: '370553', caption: '용의 분노 직후'},
      {skillId: '359073', caption: '1단 · 첫 연장'},
      {skillId: '357208', caption: '1단 · 둘째 연장'},
      {skillId: '356995', caption: '대규모 파열 · 정수가 떨어질 때까지'},
      {skillId: '357210', caption: '할인 2회 이상 쓴 뒤'},
      {skillId: '359073', caption: '사상자로 돌아오면 1단'},
      {skillId: '357208', caption: '이어서 바로 1단'},
      {skillId: '356995', caption: '대규모 파열 · 끝까지'},
    ];
    must(opener.quiz[0]?.a.startsWith('전세역전을 영원의 쇄도에 써서'), '오프닝 확인 문제');
    opener.quiz[0] = {...opener.quiz[0], a: '전세역전을 영원의 쇄도에 써서 즉시 최대 단계로 처리합니다. 오프닝 순서대로 용의 분노 직후 전세역전을 이미 눌렀다면 그대로 이어지는 영원의 쇄도가 즉시 나갑니다. 적개심 연장을 늦추지 않고 바로 다음 단계로 넘어갑니다.'};
    // 검사 스크립트가 찾는 "분노 상승 3등급 … 1등급이면 이 단계가 없습니다" 문장은 그대로 둔다.
    scOpener.note = rep(scOpener.note, '광역이면 5대상 이상에서 기염으로 정수를 비웁니다.', '전세역전은 이동·시전 지연이 예상될 때도 씁니다. 광역이면 5대상 이상에서 기염으로 정수를 비웁니다.');

    // 2부 광역 연습
    const aoe = block('광역은 대상 수 기준과');
    aoe.paragraphs[2] = rep(aoe.paragraphs[2], '하늘빛 휩쓸기는 주위 모든 적을 공격하고', '하늘빛 휩쓸기를 골랐다면 그 주문은 주위 모든 적을 공격하고');
    const aRails = tlOf(aoe)[0].rails;
    const aEntry = aRails.find(r => r.label === '광역 진입 — 비늘사령관 (5대상 이상)');
    must(aEntry && aEntry.nodes[6].skillId === SWEEP && aEntry.nodes.length === 8, '비늘사령관 광역 진입 rail');
    aEntry.nodes = [
      ...aEntry.nodes.slice(0, 6),
      {skillId: '356995', caption: '대규모 파열 남았으면'},
      aEntry.nodes[7],
    ];
    const aLoop = aRails.find(r => r.label === '반복 흐름 — 광역 (비늘사령관)');
    must(aLoop && aLoop.nodes[4].skillId === SWEEP, '비늘사령관 광역 반복 rail');
    aLoop.nodes = aLoop.nodes.filter(n => n.skillId !== SWEEP);
    const aIns = aRails.find(r => r.kind === 'inserts');
    must(aIns && !aIns.nodes.some(n => n.skillId === SWEEP), '광역 끼워 넣기 rail');
    aIns.nodes = [...aIns.nodes, {skillId: SWEEP, caption: '휩쓸기를 골랐다면 · 영원의 쇄도 뒤'}];

    // 4부 심화: 두 번째 깊은 숨결 시점
    const deep = block('심화: 두 번째 깊은 숨결');
    deep.paragraphs[1] = rep(deep.paragraphs[1],
      '이 할인을 두 번 이상 쓴 다음, 첫 깊은 숨결 뒤 7~8초쯤 두 번째 깊은 숨결로 다시 날아오릅니다.',
      '이 할인을 두 번 이상 쓴 다음 두 번째 깊은 숨결로 다시 날아오릅니다. 12.1.5 상위 레이드 로그에서는 첫 깊은 숨결 뒤 10~17초였습니다.');

    // 팁: 하늘빛 휩쓸기 설명에 "골랐다면"
    const ti = m.tips.findIndex(t => t.startsWith('9월 22일 하늘빛 휩쓸기 피해가 50% 올랐습니다.'));
    must(ti >= 0, '휩쓸기 팁');
    m.tips[ti] = rep(m.tips[ti], '영원의 쇄도 뒤에는', '하늘빛 휩쓸기 특성을 골랐다면 영원의 쇄도 뒤에');

    // 영웅 특성 탭: 비늘사령관
    const sc = m.heroBranches.find(h => h.label === '비늘사령관');
    must(sc, '비늘사령관 영웅 탭');
    const os = sc.opener.steps;
    must(os.length === 11 && os[10].skillId === SWEEP && os[3].skillId === '359073', '비늘사령관 오프닝 단계');
    sc.opener.summary = 'Icy Veins 비늘사령관 단일 오프닝을 12.1.5 상위 레이드 로그로 맞춘 순서입니다. 살아있는 불꽃을 미리 보내고 깊은 숨결을 대상에 맞히자마자 착지해 용의 분노를 엽니다. 용의 분노 직후 전세역전을 쓰고 영원의 쇄도와 불의 숨결을 1단으로 넣어 정수가 떨어질 때까지 파열을 쓴 뒤, 임박한 파괴 할인을 두 번 이상 소비하고 두 번째 깊은 숨결로 다시 진입합니다.';
    sc.opener.steps = [
      os[0], os[1], os[2],
      {skillId: '370553', label: '전세역전', note: '용의 분노를 켠 직후 눌러 첫 강화 주문을 즉시 최대 단계로 처리합니다. 12.1.5 상위 레이드 로그 8개 중 5개가 이렇게 시작했습니다.', phase: '강화 주문 준비', trigger: '용의 분노 직후'},
      {...os[3], note: '단일은 1단으로 빠르게 씁니다. 전세역전을 눌렀다면 즉시 최대 단계로 나가며, 어느 쪽이든 첫 적개심 연장을 늦추지 않습니다.', trigger: '용의 분노·전세역전 직후'},
      os[4], os[5],
      {...os[6], note: '할인된 파열을 두 번 이상 쓴 다음 다시 날아오릅니다. 12.1.5 상위 레이드 로그에서는 첫 깊은 숨결 뒤 10~17초였습니다. 할인을 남긴 채 쓰지 않습니다.'},
      os[7],
      {...os[9], note: '돌아온 영원의 쇄도 바로 뒤에 1단으로 이어 써 용의 분노를 다시 늘립니다. 같은 용의 분노 안에서는 연장 효과가 25%씩 줄어도 생략하지 않습니다.', trigger: '영원의 쇄도 직후'},
      {...os[8], label: '대규모 파열', note: '두 강화 주문이 만든 대규모 파열을 마지막 틱까지 채널해 정수를 비웁니다. 정수 폭발 2중첩이면 먼저 비우고, 이후 단일 우선순위로 돌아갑니다.', trigger: '정수가 떨어질 때까지'},
    ];
    const st = sc.singleTarget.priority;
    must(st[4].skillId === '370553' && st[6].skillId === SWEEP, '비늘사령관 단일 우선순위');
    sc.singleTarget.summary = rep(sc.singleTarget.summary, '남는 글쿨을 하늘빛 휩쓸기와 살아있는 불꽃으로 채웁니다.', '남는 글쿨을 살아있는 불꽃으로 채웁니다. 하늘빛 휩쓸기는 그 특성을 골랐을 때만 영원의 쇄도 뒤에 씁니다.');
    sc.singleTarget.priority = [
      st[0], st[1],
      {...st[4], label: '전세역전 · 용의 분노 직후', note: '용의 분노를 켠 직후 첫 강화 주문(주로 영원의 쇄도)에 써서 즉시 최대 단계로 처리합니다. 이동이나 위험 패턴 때문에 강화 주문 시전이 밀릴 때도 씁니다.'},
      st[2], st[3], st[5], st[7], st[8], st[9],
    ];
    const ap = sc.aoe.priority;
    must(ap[6].skillId === SWEEP, '비늘사령관 광역 우선순위');
    sc.aoe.priority = ap.filter(r => r.skillId !== SWEEP);
    return m;
  },
};
