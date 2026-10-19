// hunter-survival 딜사이클 순서 수정 — 근거: digests/hunter-survival.md, apl/hunter_survival.simc (10월 8일 판)
// 1) 2부 단일 반복 rail: 살상 명령 한 번 → 창끝 공격 두 번 → 다시 살상 명령 리듬으로 (로그 간격 2회가 57~58%, 3회는 18~19%)
// 2) 무리의 지도자 오프닝: 제압 → 살상 명령 → 폭탄 → 붐스틱 → 폭탄 (붐스틱 전 폭탄 두 번은 로그 5개 중 0개)
// 3) 파수꾼 오프닝·무리의 지도자 오프닝 note에 "로그마다 다름"을 적는다.
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const must = (cond, what) => { if (!cond) throw new Error('hunter-survival: 찾지 못함 — ' + what); };
const rep = (text, from, to) => { must(text.includes(from), from.slice(0, 40)); return text.replace(from, to); };

module.exports = {
  evidenceNote: '딜사이클 순서 대조(2026-10-20): 12.1.5 이후 WCL 상위 레이드 11개(파수꾼 6·무리의 지도자 5)·쐐기 11개의 실제 시전 순서와 심크 APL(midnight d91a5707, 10월 8일 판)을 대조해 단일 반복 흐름을 살상 명령 한 번 → 창끝 공격 두 번 → 다시 살상 명령 리듬으로 고치고(레이드 반복 구간에서 살상 명령 사이 버튼이 두 번인 경우 파수꾼 58%·무리의 지도자 57%, 세 번은 19%·18%), 무리의 지도자 오프닝의 두 번째 폭탄을 붐스틱 뒤로 옮겼습니다(제압 뒤 붐스틱 전에 폭탄을 두 번 쓴 로그 5개 중 0개). 파수꾼 오프닝·광역 진입은 로그가 갈려 순서를 두고 note에 "로그마다 다름"만 적었습니다.',
  changelog: [
    '- 2부 단일 반복 rail: 살상 명령 → 폭탄 → 일격 → 휩쓸기 → 살상 명령 → 폭탄 → 일격 → 휩쓸기 를 살상 명령 → 폭탄 → 일격 → 살상 명령 → 휩쓸기 → 일격 → 살상 명령 → 휩쓸기 → 폭탄으로 (근거: 레이드 반복 구간 살상 명령 사이 버튼 수 2회 파수꾼 58%·무리의 지도자 57%, 3회 19%·18%. 랩터의 일격 다음 살상 명령 45%·휩쓸기 35%, 휩쓸기 다음 살상 명령 49%. 예: https://www.warcraftlogs.com/reports/cy2L71n8ABZdaRPt#fight=9&source=4 . APL sentst 1줄 kill_command,if=buff.tip_of_the_spear.stack=0 — 창끝이 비면 명령. 1부 "명령 한 번 → 강화 공격 두 번 → 다시 명령" 설명과도 맞춤)',
    '- 무리의 지도자 오프닝(2부 오프닝 rail·영웅 탭): … 제압 → 살상 명령 → 폭탄 → 폭탄 → 붐스틱 을 … 제압 → 살상 명령 → 폭탄 → 붐스틱 → 폭탄(붐스틱 뒤 돌아온 충전)으로 (근거: 무리의 지도자 레이드 5개 중 붐스틱 전에 폭탄 두 번 0개, 살상 명령 뒤 붐스틱까지 0~1손 4개. 예: https://www.warcraftlogs.com/reports/MJR2kyNVXdLTc3D8#fight=7&source=61 . APL plst 줄 wildfire_bomb,if=…lethal_calibration&full_recharge_time<4+gcd 뒤 boomstick)',
    '- 같은 순서를 말하는 문장 맞춤: 오프닝 장 본문(무리의 지도자 문단), 영웅 탭 오프닝 요약, 단일 rail note, 단일 장 실수 한 줄',
    '- note만 덧붙임: 파수꾼 오프닝(붐스틱 앞 한두 손이 로그마다 다름 — 6개 중 2개 살상 명령, 2개 랩터의 일격·휩쓸기), 무리의 지도자 오프닝(5개 중 4개가 제압 전에 살상 명령을 쓰지 않음 — 쌍둥이 송곳니를 고르면 제압이 창끝을 줌)',
    '- 그대로 둔 것: 영웅 탭 단일·광역 우선순위(APL sentst·plst 순서와 같음), 광역 반복 rail(쐐기 광역 구간 붐스틱 직전 살상 명령 43%·직후 폭탄 45%로 같음), 파수꾼 광역 진입(제압을 붐스틱 앞에 둔 순서 — 쐐기 풀 3곳뿐이라 보류)',
  ].join('\n'),
  apply(m) {
    const block = t => { const b = m.blocks.find(x => x.title.startsWith(t)); must(b, '장 ' + t); return b; };
    const hero = l => { const h = m.heroBranches.find(x => x.label === l); must(h, '영웅 ' + l); return h; };

    // 2부 단일 연습
    const single = block('훈련용 허수아비로 하는 첫 연습');
    single.mistakes = single.mistakes.map(x => x === '"명령 → 폭탄 → 일격 → 휩쓸기"를 정해진 순서로만 외워 붐스틱이 늦게 나갑니다.'
      ? '"명령 → 폭탄 → 일격 → 명령"을 정해진 순서로만 외워 붐스틱이 늦게 나갑니다.' : x);
    const sRail = tlOf(single)[0].rails.find(r => r.label === '반복 흐름 — 단일 (두 영웅 특성 공통 뼈대)');
    must(sRail, '단일 반복 rail');
    sRail.nodes = [
      {skillId: '259489', caption: '창끝이 없을 때', above: {skillId: '1261193', when: '쿨이 돌고 집중 50이면 먼저'}},
      {skillId: '259495', caption: '창끝 소비 · 완충 전에'},
      {skillId: '186270', caption: '창끝 소비 · 다음은 휩쓸기'},
      {skillId: '259489', caption: '창끝이 비면 다시'},
      {skillId: '1262293', caption: '창끝 실어 사용'},
      {skillId: '186270', caption: '다음은 휩쓸기'},
      {skillId: '259489', caption: '창끝이 비면 다시', above: {skillId: '1250646', when: '쿨이 돌면 · 빌드 조건대로'}},
      {skillId: '1262293', caption: '창끝 실어 사용'},
      {skillId: '259495', caption: '충전이 있으면'},
    ];
    sRail.note = '정해진 순서가 아니라 조건을 확인하는 흐름입니다. 원시의 쇄도를 고르면 살상 명령 한 번에 창끝이 두 개라, 명령 한 번 → 창끝 공격 두 번 → 다시 명령이 기본 리듬입니다. 랩터의 일격과 휩쓸기는 번갈아 나옵니다. 폭탄 두 충전이 곧 다 차면 랩터보다 폭탄이 먼저이고, 붐스틱이 돌아오면 언제든 앞으로 끼워 넣습니다.';

    // 2부 오프닝 연습
    const op = block('쿨기와 오프닝');
    op.paragraphs[2] = rep(op.paragraphs[2],
      '그 뒤 폭탄으로 강화를 쓰고, 집중을 확보해 붐스틱 네 발을 맞힙니다.',
      '그 뒤 폭탄 하나로 강화를 쓰고 붐스틱 네 발을 맞힌 다음, 붐스틱으로 앞당겨진 폭탄을 이어 씁니다. 붐스틱 전에 폭탄을 두 번 연달아 쓰지 않습니다.');
    const rails = tlOf(op)[0].rails;
    const sent = rails.find(r => r.label.startsWith('오프닝 — 파수꾼'));
    must(sent, '파수꾼 오프닝 rail');
    if (!sent.note.includes('로그마다 다릅니다')) {
      sent.note += ' 12.1.5 이후 상위 레이드 로그 6개 중 2개는 붐스틱 직전에 살상 명령을, 2개는 4부 심화 시작처럼 랩터의 일격·휩쓸기를 먼저 넣어 붐스틱 앞 한두 손은 로그마다 다릅니다.';
    }
    const pl = rails.find(r => r.label.startsWith('오프닝 — 무리의 지도자'));
    must(pl, '무리의 지도자 오프닝 rail');
    must(pl.nodes.length === 9 && pl.nodes[6].skillId === '259495' && pl.nodes[7].skillId === '1261193', '무리의 지도자 오프닝 노드');
    pl.nodes = [
      ...pl.nodes.slice(0, 6),
      {skillId: '1261193', caption: '네 발 다 맞히기'},
      {skillId: '259495', caption: '붐스틱 뒤 돌아온 충전'},
      pl.nodes[8],
    ];
    pl.note = '붐스틱 앞 폭탄은 하나만 쓰고, 두 번째 폭탄은 붐스틱으로 앞당겨진 충전으로 씁니다. 12.1.5 이후 상위 레이드 로그 5개 중 제압 뒤 붐스틱 전에 폭탄을 두 번 쓴 로그는 없었습니다. 첫 붐스틱에 멧돼지 강화가 반드시 붙어 있다고 가정하지 않습니다. 쌍둥이 송곳니를 골랐다면 제압이 창끝을 직접 주니 앞의 살상 명령 준비가 필요 없습니다(상위 로그 5개 중 4개가 제압 전에 살상 명령을 쓰지 않았습니다).';

    // 영웅 탭: 무리의 지도자 오프닝
    const ph = hero('무리의 지도자');
    const st = ph.opener.steps;
    must(st.length === 9 && st[5].skillId === '259495' && st[6].skillId === '259495' && st[7].skillId === '1261193', '무리의 지도자 영웅 오프닝 행');
    ph.opener.summary = rep(ph.opener.summary,
      '연속 폭탄은 실제 회복된 충전이 있을 때만 사용합니다.',
      '붐스틱 앞 폭탄은 하나만 쓰고, 두 번째 폭탄은 붐스틱으로 앞당겨진 충전으로 씁니다.');
    ph.opener.steps = [
      ...st.slice(0, 5),
      {...st[5], note: '제압 강화 중 폭탄 하나를 씁니다. 두 번째 충전까지 연달아 쓰지 않고 바로 붐스틱으로 넘어갑니다. 다음 공격에 필요한 창끝도 함께 확인합니다.'},
      st[7],
      {...st[6], phase: '충전 소비', trigger: '붐스틱 뒤 돌아온 충전', note: '붐스틱 발사로 앞당겨진 충전이 있으면 이어 씁니다. 충전이 돌아오지 않았다면 고정 순서를 기다리지 말고 단일 조건으로 돌아갑니다.'},
      st[8],
    ];
    return m;
  },
};
