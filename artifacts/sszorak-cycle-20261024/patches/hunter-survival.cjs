// hunter-survival 단일 딜사이클 스조라크 대조 — 근거: digests/hunter-survival.md, apl/hunter_survival.simc, sources/hunter-survival.txt
// 1) 파수꾼 오프닝: 붐스틱 → 제압 을 제압 → 폭탄 → 표창 → 살상 명령 → 붐스틱 으로 (로그 11개 중 7개가 제압을 붐스틱보다 먼저)
// 2) 무리의 지도자 오프닝: 순서는 그대로(로그 4개), 님리사 근거 문장을 스조라크 근거로 바꾸고 '풀 직후 바로 제압' 표현을 뺀다(4개 중 1개만)
// 3) 프리풀 폭탄 단계 표기를 '전투 전 · 풀링 1초 전'으로 맞춘다(심크 precombat wildfire_bomb,if=active_enemies=1 + Icy Veins 'around 1 sec before')
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const must = (cond, what) => { if (!cond) throw new Error('hunter-survival: 찾지 못함 — ' + what); };
const rep = (text, from, to) => { must(text.includes(from), from.slice(0, 40)); return text.replace(from, to); };

module.exports = {
  evidenceNote: '단일 딜사이클 스조라크 대조(2026-10-24): 스조라크 신화(12.1.5) WCL 상위 로그 15개(파수꾼 11·무리의 지도자 4)의 실제 시전 순서와 심크 우선순위(midnight 3af1a757)·Icy Veins·Method 프리풀을 대조해 파수꾼 오프닝을 제압 → 야생불 폭탄 → 달빛 회전 표창 → 살상 명령 → 붐스틱으로 고쳤습니다(11개 중 7개가 붐스틱보다 제압을 먼저, 9개가 제압 바로 다음에 폭탄). 무리의 지도자 오프닝 순서는 그대로 두고 근거 문장만 스조라크 기록으로 바꿨습니다(4개 모두 제압 바로 다음 살상 명령). 풀링 1초 전 야생불 폭탄은 심크 우선순위 precombat와 Icy Veins가 같아 그대로 두었고, 단일 반복 흐름과 영웅 탭 단일 우선순위는 로그·심크 우선순위와 맞아 바꾸지 않았습니다.',
  changelog: [
    '- 파수꾼 오프닝(2부 오프닝 rail·영웅 탭): 징표 → 폭탄(풀링 1초 전) → 붐스틱(창끝 없이) → 제압 → 폭탄 → 표창 → 랩터의 일격 을 징표 → 폭탄(풀링 1초 전) → 제압 → 폭탄 → 달빛 회전 표창 → 살상 명령 → 붐스틱 → 랩터의 일격으로 (근거: 스조라크 신화 상위 로그 11개 중 7개가 붐스틱보다 제압을 먼저 씀, 제압 바로 다음 폭탄 9/11, 붐스틱 직전 살상 명령은 제압 먼저 쓴 7개 중 5개. 예: https://www.warcraftlogs.com/reports/c9NX3Q4wbLdfFMR8#fight=90&source=1913 . Method 오프닝도 제압 → 폭탄 → 붐스틱. 붐스틱을 먼저 쓴 4개 중 2개는 4부 심화 시작처럼 랩터 공격으로 격노를 쌓음)',
    '- 같은 순서를 말하는 문장 맞춤: 오프닝 장 한 줄 원리·파수꾼 문단·실수·확인 문제, 4부 심화 장 한 줄 원리, 파수꾼 영웅 탭 요약·오프닝 요약',
    '- 무리의 지도자 오프닝: 순서 그대로. rail note·영웅 탭 요약의 님리사 근거(5개 중 4개 풀 직후 제압)를 스조라크 근거(4개 모두 제압 바로 다음 살상 명령, 제압 앞 한두 손은 로그마다 다름)로 바꾸고 "풀 직후 바로 제압" 표현을 뺌 (4개 중 1개만 풀 직후 제압)',
    '- 프리풀: 야생불 폭탄 단계를 전투 전·풀링 1초 전으로 표기 (심크 우선순위 precombat wildfire_bomb,if=active_enemies=1, Icy Veins "Wildfire Bomb around 1 sec before combat begins"). 사냥꾼의 징표는 Icy Veins·Method 모두 풀 전에 걸라고 해 그대로 둠',
    '- 그대로 둔 것: 단일 반복 rail·끼워 넣기 rail·영웅 탭 단일 우선순위(살상 명령 다음 휩쓸기 29%·일격 27%·폭탄 26%, 일격·휩쓸기 다음 살상 명령 44~53%로 명령 한 번 → 창끝 공격 두 번 리듬과 같음, 심크 우선순위 sentst·plst 순서와 같음). 무리의 지도자 광포한 야수(분당 2.0회)는 살상 명령과 같은 시각에 찍히는 소환이라 버튼으로 넣지 않음',
  ].join('\n'),
  apply(m) {
    const block = t => { const b = m.blocks.find(x => x.title.startsWith(t)); must(b, '장 ' + t); return b; };
    const hero = l => { const h = m.heroBranches.find(x => x.label === l); must(h, '영웅 ' + l); return h; };

    // ── 2부 오프닝 연습 ──
    const op = block('쿨기와 오프닝');
    op.concept = '파수꾼은 제압으로 창끝과 표식을 먼저 받고 폭탄·표창을 잇고, 무리의 지도자는 제압을 쓰고 바로 살상 명령으로 소환을 실행합니다. 오프닝이 끝나면 정해진 순서를 반복하지 말고 우선순위로 돌아갑니다.';
    must(op.paragraphs[1].startsWith('파수꾼은 첫 붐스틱을 창끝 없이 쏩니다.'), '파수꾼 오프닝 문단');
    op.paragraphs[1] = '파수꾼은 제압부터 엽니다. 제압을 쓰면 쌍둥이 송곳니가 창끝을, 달의 부름이 표식을 준비합니다. 바로 표식 대상에게 폭탄을 맞히고, 달빛 회전 표창을 던진 뒤 살상 명령으로 창끝을 다시 채워 붐스틱 네 발을 맞힙니다. 그다음 우선순위로 돌아갑니다. 추적과 타격을 골랐다면 폭탄이 비어 있을 때 표창을 던져야 10초 회복이 낭비되지 않습니다. 스조라크 신화 상위 로그 11개 중 7개가 붐스틱보다 제압을 먼저 썼고, 9개가 제압 바로 다음에 폭탄을 던졌습니다.';
    op.paragraphs[2] = rep(op.paragraphs[2],
      '제압이 창끝 세 개를 직접 주니 풀 직후 바로 제압을 쓰고, 이어서 살상 명령을 눌러 포효와 쇄도를 실행합니다.',
      '제압이 창끝 세 개를 직접 주니 제압 앞에 창끝을 따로 만들 필요가 없습니다. 제압을 쓰면 이어서 바로 살상 명령을 눌러 포효와 쇄도를 실행합니다.');
    op.mistakes = op.mistakes.map(x => x === '파수꾼 첫 붐스틱의 무창끝 예외를 전투 중 모든 붐스틱에 적용합니다.'
      ? '파수꾼 제압 뒤 표식이 준비됐는데 폭탄보다 랩터 공격을 먼저 써서 표식 강화를 늦춥니다.' : x);
    must(op.quiz[0].q.startsWith('파수꾼 단일 오프닝에서 첫 붐스틱을'), '오프닝 확인 문제');
    op.quiz[0] = {
      q: '파수꾼 단일 오프닝에서 제압을 막 썼습니다. 바로 다음에 누를 버튼은 무엇일까요?',
      a: '야생불 폭탄입니다. 제압이 창끝과 표식을 준비하니 표식 대상에게 폭탄을 먼저 맞히고, 이어서 달빛 회전 표창을 던집니다. 붐스틱은 살상 명령으로 창끝을 다시 채운 뒤 씁니다.',
    };

    const rails = tlOf(op)[0].rails;
    const sent = rails.find(r => r.label.startsWith('오프닝 — 파수꾼'));
    must(sent, '파수꾼 오프닝 rail');
    sent.nodes = [
      {skillId: '257284', caption: '전투 전 · 오래 칠 네임드'},
      {skillId: '259495', caption: '풀링 1초 전'},
      {skillId: '1250646', caption: '창끝과 표식 준비'},
      {skillId: '259495', caption: '표식 소비'},
      {skillId: '1264949', caption: '사용 기회 안에'},
      {skillId: '259489', caption: '창끝 다시 채우기'},
      {skillId: '1261193', caption: '네 발 다 맞히기'},
      {skillId: '186270', caption: '이후 우선순위로'},
    ];
    sent.note = '스조라크 신화 상위 로그 11개 중 7개가 붐스틱보다 제압을 먼저 썼고, 9개가 제압 바로 다음에 폭탄을 던졌습니다. 표창과 붐스틱의 앞뒤는 로그마다 다릅니다. 붐스틱을 제압보다 먼저 쓴 로그 4개 중 2개는 4부 심화 시작처럼 랩터 공격으로 격노를 먼저 쌓았습니다.';

    const pl = rails.find(r => r.label.startsWith('오프닝 — 무리의 지도자'));
    must(pl, '무리의 지도자 오프닝 rail');
    must(pl.nodes[1].skillId === '259495' && pl.nodes[2].skillId === '1250646', '무리의 지도자 오프닝 노드');
    pl.nodes[1] = {...pl.nodes[1], caption: '풀링 1초 전'};
    pl.nodes[2] = {...pl.nodes[2], caption: '첫 쿨기 열기'};
    pl.note = rep(pl.note,
      '12.1.5 이후 상위 레이드 로그 5개 중 4개가 풀 직후 바로 제압을 썼습니다.',
      '스조라크 신화 상위 로그 4개 모두 제압 바로 다음에 살상 명령을 썼습니다. 제압 앞 한두 손은 로그마다 다릅니다.');

    // ── 4부 심화 ──
    const deep = block('심화: 파수꾼 단일에서 격노를');
    deep.concept = rep(deep.concept,
      '기본 오프닝은 붐스틱으로 격노를 준비하고 제압을 잇는 짧은 시작입니다.',
      '기본 오프닝은 제압부터 여는 짧은 시작입니다.');

    // ── 영웅 탭: 파수꾼 ──
    const sh = hero('파수꾼');
    sh.summary = rep(sh.summary,
      '단일 시작의 붐스틱 선사용과 전투 중 광역의 창끝 준비는 서로 다른 조건입니다.',
      '단일 시작은 제압부터 열고, 붐스틱은 살상 명령으로 창끝을 다시 채운 뒤 씁니다.');
    sh.opener.summary = '쌍둥이 송곳니·시즌 2를 사용하는 짧은 시작 예시입니다. 제압으로 창끝과 표식을 먼저 받고 폭탄·표창을 이은 뒤, 살상 명령으로 창끝을 채워 붐스틱을 씁니다. 아래 순서를 반복하지 말고 시작 후 단일 우선순위로 전환하세요. 근접 진입 후에는 랩터의 일격과 휩쓸기 상태도 확인합니다.';
    const ss = sh.opener.steps;
    const sid = ss.map(s => s.skillId).join(',');
    must(sid === '257284,259495,1261193,1250646,259495,1264949,186270', '파수꾼 영웅 오프닝 행 ' + sid);
    sh.opener.steps = [
      ss[0],
      {...ss[1], phase: '전투 전', trigger: '풀링 1초 전'},
      {...ss[3], trigger: '풀링 직후 · 쌍둥이 송곳니'},
      ss[4],
      ss[5],
      {skillId: '259489', label: '살상 명령', phase: '창끝 준비', trigger: '창끝이 비었을 때', note: '폭탄과 표창으로 창끝을 쓰고 나면 살상 명령으로 다시 채웁니다. 다음 붐스틱에 창끝을 싣기 위한 단계입니다.'},
      {skillId: '1261193', label: '붐스틱', phase: '후속 공격', trigger: '집중 50·창끝', note: '창끝을 실어 네 발을 모두 맞힙니다. 공격할 수 있는 방향과 3초를 먼저 확보합니다.'},
      ss[6],
    ];

    // ── 영웅 탭: 무리의 지도자 ──
    const ph = hero('무리의 지도자');
    ph.summary = rep(ph.summary,
      '12.1.5 이후 상위 레이드 로그 5개 중 4개가 풀 직후 바로 제압을 썼습니다.',
      '스조라크 신화 상위 로그 4개 모두 제압 바로 다음에 살상 명령을 썼습니다.');
    ph.opener.summary = rep(ph.opener.summary, '풀 직후 제압으로 창끝을 받고', '제압으로 창끝을 받고');
    const ps = ph.opener.steps;
    must(ps[1].skillId === '259495' && ps[2].skillId === '1250646', '무리의 지도자 영웅 오프닝 행');
    ps[1] = {...ps[1], phase: '전투 전', trigger: '풀링 1초 전'};
    ps[2] = {...ps[2], trigger: '첫 쿨기 · 송곳니 없으면 창끝 두 개 뒤'};
    return m;
  },
};
