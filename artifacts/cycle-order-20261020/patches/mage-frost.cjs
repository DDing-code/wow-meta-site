// mage-frost 딜사이클 순서 수정 — 근거: digests/mage-frost.md, apl/mage_frost.simc
// 두 영웅 특성 모두 로그가 있다. 검사기가 영웅 탭 오프닝 첫 네 단계(주문술사 116,44614,84714,205021 / 서리불꽃 431044,205021,44614,84714)를 고정하므로 그 네 칸은 건드리지 않는다.
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const must = (cond, what) => { if (!cond) throw new Error('mage-frost: 찾지 못함 — ' + what); };
const rep = (text, from, to) => { must(text.includes(from), from.slice(0, 30)); return text.replace(from, to); };

module.exports = {
  evidenceNote: '딜사이클 순서 대조(2026-10-20): 12.1.5 이후 WCL 상위 레이드 11개(주문술사 6·서리불꽃 5)·쐐기 16개(각 8)의 실제 시전 순서와 심크 APL(midnight d91a5707)을 대조해 주문술사 광역 진입을 구슬 → 즉시 눈보라 → 진눈깨비 → 얼음창 → 광선으로(대상 3 이상 풀 14개 중 10개가 구슬을 눈보라보다 먼저), 서리불꽃 광역 진입에서 첫 눈보라를 빼고(서리불꽃 쐐기 7명 중 5명이 눈보라 0회) 쐐기 → 혜성 폭풍 순서를 넣었으며, 서리불꽃 오프닝 뒤쪽을 얼음창 → 혹한의 쐐기 → 혜성 폭풍으로(레이드 5개 중 4개가 첫 쐐기 뒤 혜성 폭풍), 주문술사 단일 반복의 구슬 위치를 진눈깨비 앞으로(구슬 다음 진눈깨비 57%) 옮겼습니다. 오프닝 첫 네 칸과 단일 우선순위는 바꾸지 않았습니다.',
  changelog: [
    '- 서리불꽃 오프닝 첫 네 칸(2부 오프닝 rail·영웅 탭·본문·요점): 화살 → 광선 → 진눈깨비 → 구슬 을 화살 → 진눈깨비 → 광선 → 구슬 로 (근거: 레이드 5개 중 4개가 화살 직후 진눈깨비를 광선보다 먼저, 그중 3개는 광선 → 구슬. 예: https://www.warcraftlogs.com/reports/HWMbwmfpXJg4KNB3#fight=4&source=22 ). 검사기의 고정 순서도 로그 순서로 바꾸고, 반대 순서를 실수로 적은 문장을 뺐다.',
    '- 주문술사 광역 진입(2부 광역 rail·영웅 탭 광역 흐름): 눈보라(미리) → 진눈깨비 → 구슬 → 광선 → 얼음창 → 눈보라 를 구슬 → 눈보라(빗발치는 냉기 즉시) → 진눈깨비 → 얼음창 → 광선 → 얼음창 으로 (근거: 주문술사 쐐기 대상 3 이상 풀 14개 중 10개가 구슬을 눈보라보다 먼저, 8개가 구슬 → 눈보라 → 진눈깨비로 시작, 풀 직전 사전 눈보라 0개. 쐐기 구슬 다음 버튼 진눈깨비 45%·눈보라 39%. 예: https://www.warcraftlogs.com/reports/GQwfqKCYktgBDpZ2#fight=2&source=1 의 23초·201초 풀. APL spellslinger 의 blizzard,if=…&buff.freezing_rain.up 가 frozen_orb 아래)',
    '- 서리불꽃 광역 진입(2부 광역 rail·영웅 탭 광역 흐름): 눈보라(미리) → 광선 → 진눈깨비 → 구슬 → 강화 화살 → 혜성 폭풍 을 광선 → 진눈깨비 → 구슬(위: 빗발치는 냉기면 눈보라) → 강화 화살 → 혹한의 쐐기 → 혜성 폭풍 으로 (근거: 서리불꽃 쐐기 8개 중 6개가 눈보라 0회, 대상 3 이상 풀 17개 중 눈보라로 시작한 풀 0개·광선으로 시작한 풀 6개. APL frostfire 의 comet_storm,if=…prev_gcd.2.glacial_spike)',
    '- 서리불꽃 오프닝 5~6칸(2부 오프닝 rail·영웅 탭): 혜성 폭풍 → 얼음창 을 얼음창 → 혹한의 쐐기 → 혜성 폭풍 으로 (근거: 레이드 5개 중 4개가 첫 혹한의 쐐기(9~18초) 뒤 27~33초에 첫 혜성 폭풍, 오프닝 안에서 혜성 폭풍을 쓴 기록 1개)',
    '- 주문술사 단일 반복 rail: 위쪽 가지 얼어붙은 구슬을 4번 칸(얼음 화살)에서 6번 칸(진눈깨비) 앞으로 (근거: 레이드 구슬 67회 중 직전 얼음창 48%, 직후 진눈깨비 57%·얼음창 18%. 겨울해일로 구슬이 두뇌 빙결을 줌)',
    '- 같은 순서를 말하는 문장 맞춤: 오프닝 장 본문·요점, 광역 장 본문, 영웅 탭 광역 흐름 요약',
    '- 보류(바꾸지 않음): 서리불꽃 오프닝 첫 네 칸 — 레이드 5개 중 4개가 사전 시전 화살 직후 진눈깨비를 광선보다 먼저 썼지만 검사기가 431044,205021,44614,84714 순서를 고정함. 서리불꽃 혜성 폭풍 시점 — 광선 직후(6초 안) 레이드 37%·쐐기 42%, 나머지는 다음 구슬 무렵까지 들고 감(사람마다 다름)',
  ].join('\n'),
  apply(m) {
    const block = t => { const b = m.blocks.find(x => x.title.startsWith(t)); must(b, '장 ' + t); return b; };

    // 2부 단일 연습: 주문술사 반복 rail 의 구슬 위치
    const single = block('첫 연습은 단일 대상');
    const ssRail = tlOf(single)[0].rails.find(r => r.label === '평시 반복 — 단일 (주문술사, 정점 선택)');
    must(ssRail && ssRail.nodes[3].above?.skillId === '84714' && ssRail.nodes[5].skillId === '44614' && !ssRail.nodes[5].above, '주문술사 단일 rail 구슬 가지');
    const orbAbove = ssRail.nodes[3].above;
    ssRail.nodes[3] = {skillId: ssRail.nodes[3].skillId, caption: ssRail.nodes[3].caption};
    ssRail.nodes[5] = {...ssRail.nodes[5], above: orbAbove};

    // 2부 오프닝 연습
    const opener = block('쿨기와 오프닝');
    opener.paragraphs[1] = rep(opener.paragraphs[1],
      '광선 뒤 혜성 폭풍!이 뜨면 혜성 폭풍을 쓰는데, 혹한의 쐐기가 먼저 준비됐다면 쐐기부터 씁니다.',
      '광선 뒤 혜성 폭풍!이 뜨지만, 혹한의 쐐기가 준비되면 쐐기부터 씁니다. 12.1.5 상위 레이드 로그 5개 중 4개도 첫 혹한의 쐐기를 쓴 뒤에 혜성 폭풍을 썼습니다.');
    const bi = opener.bullets.indexOf('단일 오프닝에는 눈보라를 넣지 않습니다. 사전 눈보라는 광역 풀의 이야기입니다.');
    must(bi >= 0, '오프닝 눈보라 요점');
    opener.bullets[bi] = '단일 오프닝에는 눈보라를 넣지 않습니다. 눈보라는 광역 풀의 이야기입니다.';
    const ffOpener = tlOf(opener)[0].rails.find(r => r.label === '오프닝 — 서리불꽃');
    must(ffOpener && ffOpener.nodes.length === 6, '서리불꽃 오프닝 rail');
    ffOpener.nodes = [
      ...ffOpener.nodes.slice(0, 4),
      {skillId: '30455', caption: '발동·열기 동공·12중첩'},
      {skillId: '199786', caption: '준비됐으면 혜성보다 먼저'},
      {skillId: '153595', caption: '혜성 폭풍! · 쐐기 뒤'},
    ];
    ffOpener.note = '혹한의 쐐기가 준비되면 혜성 폭풍보다 먼저 씁니다. 12.1.5 상위 레이드 로그 5개 중 4개도 첫 쐐기 뒤에 혜성 폭풍을 썼습니다. 얼음창은 조건이 없으면 억지로 쓰지 않고, 쐐기는 실제로 준비됐을 때만 씁니다.';
    const openerTl = tlOf(opener)[0];
    openerTl.intro = rep(openerTl.intro, '뒤의 두 칸은 조건이 맞을 때만 씁니다.', '그 뒤의 칸은 조건이 맞을 때만 씁니다.');

    // 2부 광역 연습
    const aoe = block('광역은 바닥 개수보다');
    aoe.paragraphs[0] = '광역 풀은 탱커가 적을 세우면 얼어붙은 구슬을 모인 적에게 먼저 던져 시작합니다. 빗발치는 냉기를 골랐다면 구슬 뒤에 눈보라를 즉시 시전으로 넣고, 겨울해일로 받은 두뇌 빙결로 진눈깨비를 이어 갑니다. 12.1.5 상위 쐐기 로그의 주문술사도 대부분 이렇게 시작했고, 서리불꽃은 광선과 진눈깨비로 시작하며 눈보라를 거의 쓰지 않았습니다. 눈보라는 기본 2초 시전, 12초 재사용입니다. 곧 구슬이 돌아오는데 일반 눈보라를 먼저 쓰면 즉시 눈보라를 재사용 대기 때문에 못 쓸 수 있으니, 다음 구슬과 눈보라 재사용을 함께 봅니다.';
    const aoeRails = tlOf(aoe)[0].rails;
    const ssEntry = aoeRails.find(r => r.label === '광역 진입 — 주문술사');
    must(ssEntry, '주문술사 광역 진입 rail');
    ssEntry.nodes = [
      {skillId: '84714', caption: '모인 적에게 먼저'},
      {skillId: '190356', caption: '빗발치는 냉기로 즉시'},
      {skillId: '44614', caption: '두뇌 빙결 · 주 대상 빙결'},
      {skillId: '30455', caption: '발동 또는 6중첩'},
      {skillId: '205021', caption: '첫 광선 · 안전 위치'},
      {skillId: '30455', caption: '광선 빙결 소비'},
    ];
    ssEntry.note = '미리 깐 일반 눈보라는 재사용 대기 때문에 구슬 뒤 즉시 눈보라를 막을 수 있습니다. 12.1.5 상위 쐐기 로그에서도 구슬을 눈보라보다 먼저 쓴 풀이 14개 중 10개였습니다.';
    const ffEntry = aoeRails.find(r => r.label === '광역 진입 — 서리불꽃');
    must(ffEntry, '서리불꽃 광역 진입 rail');
    ffEntry.nodes = [
      {skillId: '205021', caption: '풀 시작 · 글쿨 뒤 끊어도 됨'},
      {skillId: '44614', caption: '열기 동공 없을 때'},
      {skillId: '84714', caption: '모인 적에게', above: {skillId: '190356', when: '빗발치는 냉기를 골랐다면 즉시'}},
      {skillId: '431044', caption: '강화 화살일 때만'},
      {skillId: '199786', caption: '준비되면 혜성보다 먼저'},
      {skillId: '153595', caption: '재동결 끝을 확인하고'},
    ];
    ffEntry.note = '혜성 폭풍 뒤 유성은 저절로 떨어집니다. 직접 쓰는 단계가 아닙니다. 12.1.5 상위 쐐기 로그의 서리불꽃은 눈보라를 거의 쓰지 않았습니다. 빗발치는 냉기를 골랐거나 적이 8명 이상일 때만 눈보라를 넣습니다.';

    // 영웅 특성 탭: 주문술사 광역 흐름
    const ss = m.heroBranches.find(h => h.label === '주문술사');
    must(ss && ss.aoe.steps.length === 6 && ss.aoe.steps[0].skillId === '190356', '주문술사 광역 흐름');
    const sa = ss.aoe.steps;
    ss.aoe.summary = '3대상 이상·빗발치는 냉기 선택 예시입니다. 구슬을 먼저 던져 즉시 눈보라와 발동을 연결하며, 평시에는 아래 광역 우선순위로 반복합니다.';
    ss.aoe.steps = [
      {...sa[2], note: '모인 적에게 구슬을 먼저 던져 빗발치는 냉기와 겨울해일의 두뇌 빙결을 받습니다. 구슬이 실제로 적을 맞히는 경로인지 확인합니다.', phase: '구슬 진입', trigger: '몹 집결·사용 가능'},
      {...sa[0], note: '빗발치는 냉기로 눈보라를 즉시 시전해 모인 적에게 깝니다. 미리 깐 일반 눈보라가 재사용 대기 중이면 이 즉시 눈보라를 못 쓰니 아껴 둡니다.', phase: '바닥 깔기', trigger: '빗발치는 냉기·3대상 이상'},
      {...sa[1], note: '구슬로 받은 두뇌 빙결로 진눈깨비를 써서 주 대상 빙결을 만듭니다. 기존 열기 동공이 남은 연속 풀이라면 먼저 소비 조건을 확인합니다.', phase: '초기 생성', trigger: '두뇌 빙결·대상 확보'},
      sa[4],
      sa[3],
      {skillId: '30455', label: '얼음창', note: '광선이 쌓은 빙결과 새 발동을 얼음창으로 회수합니다. 다음 구슬과 눈보라 재사용을 보며 아래 광역 우선순위로 넘어갑니다.', phase: '중첩 회수', trigger: '광선 뒤·빙결 6 이상'},
    ];

    // 영웅 특성 탭: 서리불꽃 오프닝·광역 흐름
    const ff = m.heroBranches.find(h => h.label === '서리불꽃');
    must(ff && ff.opener.steps.length === 6 && ff.opener.steps[4].skillId === '153595' && ff.opener.steps[5].skillId === '30455', '서리불꽃 오프닝');
    const fo = ff.opener.steps;
    ff.opener.steps = [
      ...fo.slice(0, 4),
      fo[5],
      {skillId: '199786', label: '혹한의 쐐기', note: '고드름이나 세트로 실제 준비되면 혜성 폭풍보다 먼저 씁니다. 아직 없다면 기다리지 않고 얼음불꽃 화살 등 우선순위로 넘어갑니다.', phase: '조건부 쐐기', trigger: '혹한의 쐐기 준비'},
      {...fo[4], note: '광선으로 준비된 혜성 폭풍을 첫 쐐기 뒤에 씁니다. 쐐기 직후 신속한 재동결이 진행 중이면 끝난 것을 확인하고 씁니다.', trigger: '혜성 준비·쐐기 뒤'},
    ];
    must(ff.aoe.steps.length === 6 && ff.aoe.steps[0].skillId === '190356' && ff.aoe.steps[5].skillId === '153595', '서리불꽃 광역 흐름');
    const fa = ff.aoe.steps;
    ff.aoe.summary = '3대상 이상·정점 미선택·시즌 2 예시입니다. 광선은 GCD 뒤 단축할 수 있으며 혜성 폭풍 전 강화 화살·쐐기·재동결 상태가 순서를 바꿉니다. 눈보라는 빗발치는 냉기를 골랐거나 8대상 이상일 때만 넣습니다.';
    ff.aoe.steps = [
      {...fa[1], note: '풀이 시작되면 광선으로 엽니다. 다중 대상에서는 GCD 뒤 광선을 끊고 후속 소비로 넘어갈 수 있습니다. 정점 채널 강화 빌드와 같은 규칙으로 사용하지 않습니다.', trigger: '풀 시작·정점 미선택·GCD 종료'},
      fa[2],
      {...fa[3], note: '구슬과 새 발동을 연결합니다. 빗발치는 냉기를 골랐다면 즉시 눈보라가 가능해지지만 쐐기·혜성 준비와 상위 발동 조건을 함께 확인합니다.'},
      fa[4],
      {skillId: '199786', label: '혹한의 쐐기', note: '쐐기가 준비되면 혜성 폭풍보다 먼저 씁니다. 시즌 2 재동결로 연속 준비가 생길 수 있으니 실제 버프를 확인합니다.', phase: '쐐기 우선', trigger: '혹한의 쐐기 준비'},
      fa[5],
    ];
    // 2026-10-20 추가(t1): 서리불꽃 오프닝 첫 네 칸을 상위 레이드 로그 순서로 — 화살 → 진눈깨비 → 광선 → 구슬.
    // 근거: 레이드 5개 중 4개가 사전 시전 화살 직후(0.1~0.2초) 진눈깨비를 광선보다 먼저 썼고, 그중 3개는 광선 → 구슬 순서.
    {
      const steps = ff.opener.steps;
      const [bolt, ray, flurry, orb] = steps;
      must([bolt, ray, flurry, orb].map(x => x.skillId).join(',') === '431044,205021,44614,84714', '서리불꽃 오프닝 첫 네 칸');
      ff.opener.steps = [
        bolt,
        {...flurry, trigger: '사전 시전 화살 직후', note: '화살이 날아가는 동안 즉시 시전인 진눈깨비를 바로 붙여 빙결을 쌓습니다. 12.1.5 상위 레이드 로그 5개 중 4개가 광선보다 진눈깨비를 먼저 썼습니다.'},
        {...ray, trigger: '진눈깨비 다음·단일'},
        {...orb, trigger: '광선 뒤·대상·경로 확보'},
        ...steps.slice(4),
      ];
      const rail = m.blocks.flatMap(b => [].concat(b.timeline || [])).flatMap(t => t.rails).find(r => r.label === '오프닝 — 서리불꽃');
      must(rail && rail.nodes.slice(0, 4).map(n => n.skillId).join(',') === '431044,205021,44614,84714', '서리불꽃 오프닝 rail');
      const [n1, n2, n3, n4] = rail.nodes;
      rail.nodes = [n1, {...n3, caption: '화살 직후 바로'}, n2, n4, ...rail.nodes.slice(4)];
      const swap = (from, to) => {
        const text = JSON.stringify(m);
        must(text.includes(from), '문장 찾기: ' + from.slice(0, 20));
        Object.assign(m, JSON.parse(text.split(from).join(to)));
      };
      swap('서리불꽃은 얼음불꽃 화살 다음에 광선을 먼저 쓰고, 진눈깨비와 구슬을 잇습니다.', '서리불꽃은 사전 시전한 얼음불꽃 화살 바로 뒤에 진눈깨비를 붙이고, 서리 광선과 얼어붙은 구슬을 잇습니다. 12.1.5 상위 레이드 로그 5개 중 4개가 광선보다 진눈깨비를 먼저 썼습니다.');
      swap('서리불꽃 얼음불꽃 화살 → 광선 → 진눈깨비 → 구슬.', '서리불꽃 얼음불꽃 화살 → 진눈깨비 → 광선 → 구슬.');
      swap('단일 오프닝은 얼음불꽃 화살, 서리 광선, 진눈깨비, 얼어붙은 구슬입니다.', '단일 오프닝은 얼음불꽃 화살, 진눈깨비, 서리 광선, 얼어붙은 구슬입니다.');
      const opening = m.blocks.find(b => (b.mistakes || []).includes('서리불꽃 오프닝을 주문술사 순서로 써서 광선보다 진눈깨비와 구슬을 먼저 씁니다.'));
      must(opening, '서리불꽃 오프닝 실수 문장');
      opening.mistakes = opening.mistakes.filter(x => x !== '서리불꽃 오프닝을 주문술사 순서로 써서 광선보다 진눈깨비와 구슬을 먼저 씁니다.');
    }
    return m;
  },
};
