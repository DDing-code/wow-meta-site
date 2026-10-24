// evoker-augmentation 단일 딜사이클 스조라크 빌드 기준 — 근거: bd/evoker-augmentation.md, ../sszorak-cycle-20261024/apl/evoker_augmentation.simc, ../sszorak-cycle-20261024/sources/evoker-augmentation.txt
// 기준 영웅 특성은 시간 감시자(스조라크 상위 ALL 200행·KR 100행 모두). 기본 탭은 그대로다. 지원형이라 지금 원고의 구조(강화 부여 흐름)를 따른다.
// 오프닝: 예지 두 칸을 한 칸 ×2 로 묶고(10개 중 9개), 시간 건너뛰기 뒤 예지 ×2(8개가 다시 두 번, 5개가 두 번째 불의 숨결 앞)를 넣는다.
//   두 번째 칠흑의 힘은 8개가 다시 걸었지만 자리가 앞뒤 4개씩이라 rail 에서는 위쪽 가지, 영웅 탭에서는 단계 note 로 둔다.
//   새 견본에 끓어오르는 비늘이 없어 전투 전 비늘 단계는 '골랐다면'으로 바꾼다.
// 단일 반복: 순서 그대로(분출·시간의 불꽃 이어 누른 횟수 중앙값 1, 사분위 1~2라 횟수 표시 없음).
// 비늘사령관 rail·탭 순서는 그대로 둔다(스조라크 로그 0개).
const rep = (text, from, to) => { if (!text.includes(from)) throw new Error('바꿀 문장을 못 찾음: ' + from.slice(0, 30)); return text.replace(from, to); };
const tlOf = b => [].concat(b.timeline);

module.exports = {
  evidenceNote: '단일 딜사이클 스조라크 빌드 기준(2026-10-24): 스조라크 신화(12.1.5) 상위 랭킹 영웅 특성(ALL 200행·KR 100행 모두 시간 감시자)과 시간 감시자 로그 10개의 실제 순서·반복 횟수로 오프닝·단일 반복을 다시 보고 단일 견본을 스조라크 대표 빌드로 바꿨습니다(전체 103위 기록, 시간 건너뛰기·시시각각 선택, 끓어오르는 비늘 없음). 오프닝은 10개 중 9개가 영겁의 숨결 전에 예지를 두 번 써 칸 하나 ×2 로 묶었고, 8개가 시간 건너뛰기 뒤 분출 전에 예지 두 번과 칠흑의 힘을 다시 써 예지 ×2 칸과 칠흑의 힘 끼워 넣기를 더했습니다(Icy Veins 시간 감시자 오프닝도 같음). 첫 칠흑의 힘은 6개가 영겁의 숨결 뒤라 그대로 두었습니다. 단일 반복은 분출·시간의 불꽃 이어 누른 횟수 중앙값이 1이라 순서와 표시를 그대로 두었습니다.',
  buildNote: '시간 건너뛰기·시시각각을 골랐고 끓어오르는 비늘과 진압은 빠진 빌드입니다. 탱커 지원이나 차단을 맡는다면 두 특성을 다시 찍으세요.',
  changelog: [
    '- 오프닝(2부 오프닝 장 시간 감시자 rail·영웅 탭 오프닝): 예지 두 칸을 한 칸 ×2 로 묶음(스조라크 시간 감시자 로그 10개 중 9개). 시간 건너뛰기 뒤 예지 ×2 칸 추가(8/10 이 분출 전에 다시 두 번, 5/10 이 두 번째 불의 숨결 앞), 두 번째 불의 숨결에 칠흑의 힘 끼워 넣기(8/10 이 다시 걸었고 자리는 앞뒤 4개씩). 근거: 예 https://www.warcraftlogs.com/reports/1a4vTXr2YJcmBFCW#fight=30&source=4 , Icy Veins 시간 감시자 오프닝(Time Skip → Ebon Might → Fire Breath → Prescience ×2 → Eruption)',
    '- 전투 전 끓어오르는 비늘: 새 단일 견본에 없어 "골랐다면"으로 바꿈(Method "if talented"). 순서는 그대로',
    '- 단일 반복: 순서 그대로(분출 중앙값 1·사분위 1~2, 시간의 불꽃 1·1~2). rail note 에 스조라크 근거 추가',
    '- 영웅 탭 요약·3부 시간 감시자 장·4부 비늘사령관 장: "이번 한국 검수: 레이드 1건" 문장을 스조라크·님리사 상위 행 수로 바꿈',
  ].join('\n'),
  apply(m) {
    const block = t => m.blocks.find(b => b.title.startsWith(t));

    // ── 2부 오프닝 장 ──
    const op = block('쿨기와 오프닝');
    const rail = tlOf(op)[0].rails.find(r => r.label === '오프닝 — 시간 감시자');
    if (!rail) throw new Error('시간 감시자 오프닝 rail 없음');
    rail.nodes = [
      {skillId: '360827', caption: '골랐다면 · 탱커에게'},
      {skillId: '431443', caption: '풀링 1.5초 전'},
      {skillId: '409311', count: 2, caption: '공격 담당 둘'},
      {skillId: '403631', caption: '짧고 안전하게 적중'},
      {skillId: '395152', caption: '착지 후 즉시'},
      {skillId: '370553', caption: '불의 숨결 준비됨'},
      {skillId: '357208', caption: '즉시 최대 단계'},
      {skillId: '396286', caption: '단일은 1단계'},
      {skillId: '404977', caption: '선택 · 두 강화 재사용 중'},
      {skillId: '409311', count: 2, caption: '돌아온 충전'},
      {skillId: '357208', caption: '건너뛰기 뒤 다시', above: {skillId: '395152', when: '끝나 가면 갱신'}},
      {skillId: '396286', caption: '두 번째도 1단계'},
      {skillId: '395160', caption: '이후 단일 우선순위로'},
    ];
    rail.note = '시간 건너뛰기는 고른 경우에만 씁니다. 엮인 실타래 빌드는 그 칸과 뒤의 두 번째 불의 숨결·지각 변동을 건너뛰고 바로 분출로 넘어갑니다. 스조라크 신화 상위 기록 10개 중 9개가 영겁의 숨결 전에 예지를 두 번 썼고, 8개가 시간 건너뛰기 뒤 분출 전에 예지 두 번과 칠흑의 힘을 다시 썼습니다. 다시 거는 칠흑의 힘은 두 번째 불의 숨결 앞과 지각 변동 뒤가 4개씩이라 끝나 가는 때에 맞춥니다. 첫 칠흑의 힘은 10개 중 4개가 영겁의 숨결보다 먼저 걸었습니다.';
    op.concept = rep(op.concept,
      '두 순서를 섞어 같은 주문을 두 번 넣지 않습니다.',
      '두 순서를 섞어 시작에 칠흑의 힘을 두 번 넣지 않습니다.');
    op.paragraphs[0] = rep(op.paragraphs[0],
      '두 오프닝 모두 전투 전에 끓어오르는 비늘을 지금 공격받을 탱커에게 준비하고,',
      '두 오프닝 모두 끓어오르는 비늘을 골랐다면 전투 전에 지금 공격받을 탱커에게 준비하고,');
    op.paragraphs[1] = rep(op.paragraphs[1],
      '건너뛰기가 끝나면 돌아온 불의 숨결과 지각 변동을 한 번 더 쓰고, 그 앞뒤로 예지와 끝나 가는 칠흑의 힘을 다시 겁니다.',
      '건너뛰기가 끝나면 충전이 돌아온 예지를 두 대상에 다시 걸고, 돌아온 불의 숨결과 지각 변동을 한 번 더 씁니다. 칠흑의 힘이 끝나 가면 그 앞뒤로 다시 겁니다.');
    op.bullets[1] = rep(op.bullets[1],
      '시간 감시자: 시간 건너뛰기 뒤 불의 숨결·지각 변동을 한 번 더 쓰고 분출로 넘어갑니다.',
      '시간 감시자: 시간 건너뛰기 뒤 예지 두 번, 불의 숨결·지각 변동을 한 번 더 쓰고 분출로 넘어갑니다.');

    // ── 2부 단일 장 ──
    const st = block('첫 연습은 단일 대상');
    const loop = tlOf(st)[0].rails.find(r => r.loop && r.label.includes('시간 감시자'));
    loop.note = loop.note + ' 스조라크 신화 상위 기록 10개(모두 시간 감시자)도 강화 주문 뒤 분출과 시간의 불꽃을 한두 번씩 번갈아 썼고, 같은 스킬을 이어 누른 횟수는 대부분 한 번이었습니다.';

    // ── 영웅 탭: 시간 감시자 ──
    const chrono = m.heroBranches.find(h => h.label === '시간 감시자');
    chrono.summary = rep(chrono.summary,
      '여기서는 영겁의 숨결 뒤 칠흑의 힘을 쓰는 오프닝을 채택하며, 현재 실제 WCL 채택률이나 모든 조합에서의 우위를 확보한 것은 아닙니다. 이번 한국 검수: 레이드 1건·쐐기 1건. 선택·시전 사례이며 상대 분기보다 강하다는 증명이 아닙니다.',
      '단일 네임드인 스조라크 신화 상위 200행(한국 100행)도 모두 시간 감시자였고, 오프닝·단일은 이 기록과 대표 빌드를 기준으로 합니다. 영겁의 숨결 뒤 칠흑의 힘을 쓰는 오프닝은 이 기록 10개 중 6개와 같습니다.');
    const s = chrono.opener.steps;
    const byId = id => s.filter(x => x.skillId === id);
    const [scales, flame] = s;
    const [eons] = byId('403631');
    const [ebon] = byId('395152');
    const [tip] = byId('370553');
    const [fb1, fb2] = byId('357208');
    const [uph1, uph2] = byId('396286');
    const [skip] = byId('404977');
    const [erupt] = byId('395160');
    if (!fb2 || !uph2 || !skip || !erupt || scales.skillId !== '360827' || flame.skillId !== '431443') throw new Error('시간 감시자 오프닝 단계 모양이 예상과 다름');
    chrono.opener = {
      ...chrono.opener,
      summary: rep(chrono.opener.summary,
        '건너뛰기 뒤에는 돌아온 불의 숨결·지각 변동을 한 번 더 쓰고 분출로 넘어갑니다.',
        '건너뛰기 뒤에는 예지를 두 대상에 다시 걸고 돌아온 불의 숨결·지각 변동을 한 번 더 쓴 뒤 분출로 넘어갑니다. 스조라크 신화 상위 기록 10개 중 7개가 두 강화 주문을 한 번씩 더 쓴 뒤 분출을 시작했습니다.'),
      steps: [
        {...scales, trigger: '골랐다면 · 탱커에게 미리', note: '끓어오르는 비늘을 골랐다면 현재 공격받을 탱커에게 미리 준비합니다. 스조라크 대표 빌드처럼 고르지 않았다면 이 단계는 건너뜁니다.'},
        flame,
        {skillId: '409311', phase: '대상 준비', label: '예지', count: 2, trigger: '공격 담당 둘', note: '첫 피해 구간에 공격할 두 대상에게 하나씩 겁니다. 같은 대상에 두 번 쓰는 순서가 아니며, 사정거리와 남은 충전을 확인합니다.'},
        eons,
        ebon,
        tip,
        fb1,
        uph1,
        skip,
        {skillId: '409311', phase: '대상 갱신', label: '예지', count: 2, trigger: '건너뛰기 뒤 돌아온 충전', note: '시간 건너뛰기 뒤 돌아온 예지 충전을 두 대상에 다시 겁니다. 스조라크 상위 기록 10개 중 8개가 분출 전에 예지를 두 번 더 썼습니다. 엮인 실타래 빌드는 충전이 돌아왔을 때만 씁니다.'},
        {...fb2, note: '시간 건너뛰기로 돌아온 불의 숨결을 바로 한 번 더 씁니다. 칠흑의 힘이 끝나 가면 이 앞이나 지각 변동 뒤에 다시 겁니다(상위 기록 10개 중 8개가 다시 걸었고 자리는 앞뒤 반반). 엮인 실타래 빌드는 이 단계가 없습니다.'},
        uph2,
        erupt,
      ],
    };
    chrono.singleTarget = {...chrono.singleTarget, summary: '단일 네임드용 순서입니다. ' + chrono.singleTarget.summary};

    // ── 영웅 탭: 비늘사령관(순서 그대로, 요약 근거만) ──
    const scale = m.heroBranches.find(h => h.label === '비늘사령관');
    scale.summary = rep(scale.summary,
      '이번 한국 검수: 레이드 0건·쐐기 1건. 선택·시전 사례이며 상대 분기보다 강하다는 증명이 아닙니다.',
      '단일 네임드인 스조라크와 쫄이 섞이는 님리사 신화 상위 기록에는 없었습니다(0행).');

    // ── 3부 시간 감시자 장 · 4부 비늘사령관 장: 영웅 특성 선택 문장 ──
    const chronoCh = block('레이드와 고단은 시간 감시자');
    chronoCh.bullets[4] = rep(chronoCh.bullets[4],
      '이번 한국 검수는 레이드 1건·쐐기 1건의 선택·시전 사례이며, 비늘사령관보다 강하다는 증명이 아닙니다.',
      '단일 네임드인 스조라크 신화 상위 200행(한국 100행)도 모두 시간 감시자였고, 오프닝·단일 딜사이클과 단일 견본은 이 기록을 기준으로 합니다.');
    const scaleCh = block('비늘사령관:');
    scaleCh.bullets[3] = rep(scaleCh.bullets[3],
      '이번 한국 검수에서 비늘사령관은 쐐기 1건이 확인됐고, 시간 감시자보다 강하다는 증명이 아닙니다.',
      '스조라크·님리사 신화 상위 기록에는 비늘사령관이 없었고(0행), 쐐기 상위 기록에서만 보였습니다.');
    return m;
  },
};
