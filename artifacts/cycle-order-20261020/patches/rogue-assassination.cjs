// rogue-assassination 딜사이클 순서 수정 — 근거: digests/rogue-assassination.md, apl/rogue_assassination.simc
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

module.exports = {
  evidenceNote: '딜사이클 순서 대조(2026-10-20): 12.1.5 이후 WCL 상위 레이드 8개(운명결속 7·죽음추적자 1)·쐐기 10개(운명결속 2·죽음추적자 8)의 실제 시전 순서와 심크 APL(midnight d91a5707)을 대조해, 운명결속 오프닝의 두 번째 강화 목조르기를 죽음표식 뒤 소멸 → 목조르기로 옮기고, 단일 반복에서 죽음표식을 독살 뒤로 맞추고 소멸을 넣었으며, 죽음추적자 쐐기 풀 시작의 파열 뒤 두 번째 목조르기를 적었습니다. 죽음추적자 레이드 오프닝은 로그가 1개뿐이라 그대로 두었습니다.',
  changelog: [
    '- 운명결속 오프닝(2부 오프닝 장 줄, 영웅 탭 오프닝, 화면에 안 나오는 상단 opener도 검사기 규칙대로 같게): 목조르기 → 절단 → 파열 → 목조르기(강화 적용 시간 안) → 절단 → 독살 → 죽음표식 → 왕의 파멸 → 독살 ⇒ 목조르기 → 절단 → 파열 → 절단 → 독살 → 죽음표식 → 왕의 파멸 → 독살 → 소멸 → 목조르기. 근거: 레이드 오프닝 7개 중 5개가 소멸 → 강화 목조르기를 썼고 그중 4개는 죽음표식 → 왕의 파멸 → 독살 뒤(예: https://www.warcraftlogs.com/reports/FZdJWm3GTL1RBAxj#fight=26&source=56 ), 소멸 없이 파열 뒤 강화 적용 시간 안에 목조르기를 다시 쓴 로그는 2개. APL vanish 목록(vanish,if=…improved_garrote&…dot.deathmark.ticking). 2개 로그의 방식은 절단 위 가지와 note로 남김. 같은 장 한 줄 원리·본문·확인 문제를 맞춤.',
    '- 단일 반복 rail(두 영웅 공통): 죽음표식을 파열 뒤 절단 위 → 독살 뒤 절단 위로, 왕의 파멸을 마지막 독살 위로 옮기고, 맨 앞 목조르기 위에 소멸(죽음표식 중)을 더함. 근거: 레이드 반복 다음 스킬 표 죽음표식 → 왕의 파멸 79%, 왕의 파멸 → 독살 90%, 소멸 → 목조르기 93%. 운명결속 레이드 소멸 19회 중 18회가 죽음표식 앞뒤 6초 안이고 18회가 곧바로 목조르기로 이어짐(죽음표식 뒤 11회, 앞 7회). APL deathmark 조건 buff.envenom.remains>2(독살 뒤).',
    '- 운명결속 단일 우선순위(영웅 탭): 왕의 파멸 다음에 "소멸 · 죽음표식에 맞춰" 행 추가, 목조르기 행 note에 소멸 직후 재적용을 적음. 2부 단일 장 우선순위 문단도 맞춤.',
    '- 죽음추적자 광역(영웅 탭 원본 목조르기 행 note, 2부 광역 장 끼워 넣기 줄): 은신 목조르기로 풀을 열었으면 강화 적용 시간 안(보통 첫 파열 무렵)에 다른 오래 살 적에게 목조르기를 한 번 더. 근거: 죽음추적자 쐐기 광역 풀 시작 33개 중 22개가 첫 10회 안에 목조르기를 두 번 씀(16개는 파열 뒤, 6개는 파열 앞, 대표 순서 목조르기 → 칼날 부채 → 파열 → 목조르기 → 혈폭풍, 예: https://www.warcraftlogs.com/reports/wbR9tDc7v8y21gp6#fight=5&source=5 ).',
    '- 그대로 둔 것: 죽음추적자 레이드 오프닝(로그 1개), 운명결속 광역(쐐기 로그 2개·풀 9개로 적음), 매복 행(사각 지대 조건부, 로그 거의 없음 — 다른 시전 번호 없음).',
  ].join('\n'),
  apply(m) {
    // 1) 운명결속 오프닝
    const openBlock = block(m, '쿨기와 오프닝');
    const fbRail = rail(openBlock, '오프닝 — 운명결속');
    fbRail.nodes = [
      {skillId: '703', caption: '은신 · 강화 출혈'},
      {skillId: '1329', caption: '5점 이상까지', above: {skillId: '8676', when: '무료 매복이면 활용'}},
      {skillId: '1943', caption: '5점 이상 · 주 대상'},
      {skillId: '1329', caption: '다시 5점 이상까지', above: {skillId: '703', when: '소멸 없이 · 강화 시간 안'}},
      {skillId: '32645', caption: '독 발동 확률 준비', above: {skillId: '1298826', when: '수동 선택 · 기력 부족 시'}},
      {skillId: '360194', caption: '출혈·공격 시간 확보'},
      {skillId: '385627', caption: '죽음표식 직후'},
      {skillId: '32645', caption: '점수 확인 뒤 소비'},
      {skillId: '1856', caption: '죽음표식 중'},
      {skillId: '703', caption: '소멸 직후 · 강화 출혈'},
    ];
    fbRail.note = '동전 결과를 기다리느라 첫 극딜을 늦추지 않습니다. 추가 점수가 생기면 생성 단계를 줄입니다. 수동 엉겅퀴 차는 기력이 실제로 모자랄 때만 끼워 넣고, 자동 선택이면 직접 쓸 일이 없습니다. 소멸을 생존용으로 남긴다면 파열 직후 강화 적용 시간 안에 목조르기를 한 번 더 쓰고 소멸 단계를 건너뜁니다. 마지막 단계 뒤에는 생성·독살 반복으로 돌아갑니다.';

    const fb = hero(m, '운명결속');
    const os = fb.opener.steps;
    const garrote1 = os[0], muti1 = os[1], rupture = os[2], muti2 = os[4], env1 = os[5], dm = os[6], kb = os[7];
    if (garrote1.skillId !== '703' || muti1.skillId !== '1329' || rupture.skillId !== '1943' || muti2.skillId !== '1329' || env1.skillId !== '32645' || dm.skillId !== '360194' || kb.skillId !== '385627') {
      throw new Error('운명결속 오프닝 원본 순서가 예상과 다름');
    }
    muti2.note = '파열에서 점수를 소비했으므로 독살 전에 다시 생성합니다. 추가 점수가 생기면 생성기 횟수를 줄입니다. 소멸을 생존용으로 남긴다면 이 앞에서 강화 적용 시간 안에 목조르기를 한 번 더 씁니다.';
    dm.note = '오래 살 주 대상에 사용합니다. 이어서 쓸 소멸과 강화 목조르기까지 죽음표식이 걸린 16초 안에 들어가게 계획합니다.';
    fb.opener.steps = [
      garrote1, muti1, rupture, muti2, env1, dm, kb,
      {skillId: '32645', label: '독살', phase: '극딜 중', trigger: '5점 이상', note: '왕의 파멸이 만든 점수까지 보고 5점 이상이면 소비합니다. 점수가 모자라면 절단으로 보충한 뒤 씁니다.'},
      {skillId: '1856', label: '소멸', phase: '극딜 중', trigger: '죽음표식이 걸린 동안', note: '목조르기 연마를 골랐다면 전투 중 은신을 다시 열어 강화 목조르기를 바를 기회를 만듭니다. 생존이나 이동에 소멸이 꼭 필요한 전투라면 그쪽을 먼저 정합니다.'},
      {skillId: '703', label: '강화 목조르기', phase: '극딜 중', trigger: '소멸 직후', note: '은신 중이거나 은신 해제 후 6초 안에 목조르기를 다시 써서 죽음표식이 걸린 대상에 강화 출혈을 겁니다. 이후에는 단일 우선순위로 생성·독살을 이어 갑니다.'},
    ];
    fb.opener.summary = '은신과 독을 준비한 기본 예시입니다. 생성 단계는 표시된 횟수가 아니라 연계 점수 조건을 채울 때까지 반복합니다. 두 번째 강화 목조르기는 죽음표식 뒤 소멸로 은신을 다시 열어 바릅니다. 수동 엉겅퀴 차를 선택했다면 기력이 부족할 때 별도로 사용하며, 자동 선택은 누를 버튼이 아닙니다.';
    // 검사기 규칙: 기본(상단) 오프닝은 운명결속 오프닝과 같아야 한다
    m.opener = JSON.parse(JSON.stringify(fb.opener));

    openBlock.concept = '오프닝은 은신 목조르기로 시작해 파열을 깔고, 독살로 독 발동 확률을 올린 다음 죽음표식과 왕의 파멸로 들어가는 흐름입니다. 강화 목조르기를 한 번 더 바르는 자리는 영웅 특성 예시마다 다릅니다. 운명결속은 죽음표식 뒤 소멸로, 죽음추적자는 파열 직후 강화 적용 시간 안에 바릅니다.';
    replaceText(openBlock.paragraphs, '은신에서 벗어난 뒤 강화 적용 시간이 남아 있다면 목조르기를 한 번 더 써서 강화 출혈을 이어 둡니다. 일반 목조르기로 강화 출혈을 덮어쓰라는 뜻이 아닙니다. 파열에 점수를 썼으니 다시 절단으로 5점 이상을 모으고 독살을 써서 독 발동 확률을 올려 둡니다.', '파열에 점수를 썼으니 다시 절단으로 5점 이상을 모으고 독살을 써서 독 발동 확률을 올려 둡니다. 죽음추적자 예시는 그 전에, 은신에서 벗어난 뒤 강화 적용 시간이 남아 있을 때 목조르기를 한 번 더 써서 강화 출혈을 이어 둡니다. 일반 목조르기로 강화 출혈을 덮어쓰라는 뜻이 아닙니다.');
    replaceText(openBlock.paragraphs, '왕의 파멸도 연계 점수 1점을 만드니 직후 점수를 확인하고 생성·독살 반복으로 넘어갑니다. 소멸을 이 구간에 맞출 계획이라면 강화 목조르기를 실제로 다시 바를 시각까지 함께 정합니다.', '왕의 파멸도 연계 점수 1점을 만드니 직후 점수를 확인하고 독살로 씁니다. 운명결속 예시는 여기서 소멸을 쓰고 바로 목조르기를 다시 발라, 죽음표식이 걸린 대상에 강화 출혈을 겁니다. 그 뒤에는 생성·독살 반복으로 넘어갑니다.');
    const q = openBlock.quiz.find(x => x.q.startsWith('오프닝에서 목조르기를 두 번'));
    if (!q) throw new Error('확인 문제 없음');
    q.a = '강화 목조르기를 한 번 더 바르기 위해서입니다. 목조르기 연마는 은신 중이거나 은신 해제 후 6초 동안 쓴 목조르기를 강화합니다. 운명결속 예시는 죽음표식 뒤 소멸로 이 시간을 다시 열고, 죽음추적자 예시는 첫 은신 해제 뒤 6초 안에 바로 씁니다. 이 시간이 지났다면 일반 목조르기로 강화 출혈을 덮어쓰지 않습니다.';

    // 2) 단일 반복 rail: 죽음표식은 독살 뒤, 왕의 파멸은 그다음 독살 앞, 소멸 → 목조르기
    const stBlock = block(m, '허수아비 첫 연습');
    const st = rail(stBlock, '반복 흐름 — 단일');
    st.nodes = [
      {skillId: '703', caption: '끝나기 전 갱신', above: {skillId: '1856', when: '죽음표식에 맞춰'}},
      {skillId: '1329', caption: '점수 모으기', above: {skillId: '8676', when: '무료 매복이 뜨면 대신'}},
      {skillId: '1943', caption: '5점 이상 · 필요할 때만'},
      {skillId: '1329', caption: '다시 점수 모으기'},
      {skillId: '32645', caption: '5점 이상 독살'},
      {skillId: '1329', caption: '점수 모으기', above: {skillId: '360194', when: '독살 뒤 · 쿨이 돌면'}},
      {skillId: '32645', caption: '넘치기 전에 소비', above: {skillId: '385627', when: '죽음표식 직후 · 쿨마다'}},
    ];
    st.note = '목조르기와 파열은 끝나기 전에, 남은 전투에서 회수될 만큼만 갱신합니다. 아직 오래 남았다면 건너뛰고 생성과 독살을 이어 갑니다. 죽음표식은 독살 효과가 켜진 뒤 쓰고, 바로 왕의 파멸과 독살로 잇습니다. 목조르기 연마를 골랐다면 죽음표식에 맞춰 소멸 → 목조르기로 강화 출혈을 다시 바릅니다. 왕의 파멸은 1분마다 돌아오니 죽음표식이 없는 중간 사용도 놓치지 않습니다.';
    replaceText(stBlock.paragraphs, '목조르기 확인 → 파열 유지 → 죽음표식 → 왕의 파멸 → 5점 이상 독살 → 무료 매복 → 절단.', '목조르기 확인 → 파열 유지 → 죽음표식 → 왕의 파멸 → 소멸(죽음표식에 맞춰) → 5점 이상 독살 → 무료 매복 → 절단.');

    // 3) 운명결속 단일 우선순위: 왕의 파멸 뒤 소멸
    const p = fb.singleTarget.priority;
    if (!p.some(r => r.skillId === '1856')) {
      const at = p.findIndex(r => r.skillId === '385627');
      p.splice(at + 1, 0, {skillId: '1856', label: '소멸 · 죽음표식에 맞춰', note: '목조르기 연마를 골랐다면 죽음표식 직전이나 직후에 소멸을 쓰고 바로 목조르기를 다시 발라 강화 출혈을 만듭니다. 생존이나 이동에 소멸이 꼭 필요한 전투라면 그쪽을 먼저 정합니다.'});
    }
    const g = p.find(r => r.skillId === '703');
    g.note = '끝나기 전에 필요한 갱신을 준비합니다. 기존 강화 출혈을 일반 출혈로 일찍 덮어쓰지 않으며, 적이 곧 죽으면 남은 시간을 먼저 봅니다. 소멸 직후에는 남은 시간과 관계없이 강화 목조르기를 다시 바릅니다.';

    // 4) 죽음추적자 광역: 파열 뒤 강화 적용 시간 안에 두 번째 목조르기
    const ds = hero(m, '죽음추적자');
    const dg = ds.aoe.priority.find(r => r.skillId === '703');
    dg.note = '오래 살 적의 출혈을 준비합니다. 은신 목조르기로 풀을 열었다면 강화 적용 시간 안(보통 첫 파열 무렵)에 다른 오래 살 적에게 목조르기를 한 번 더 겁니다. 징표·출혈 원본·부식성 분사 대상이 어디인지 따로 확인하세요.';
    const aoeIns = rail(block(m, '광역은 원본 출혈을'), '영웅 특성별로 끼워 넣는 것');
    if (!aoeIns.nodes.some(n => n.skillId === '703')) {
      const at = aoeIns.nodes.findIndex(n => n.skillId === '1293340');
      aoeIns.nodes.splice(at, 0, {skillId: '703', caption: '죽음추적자 · 강화 시간 안 한 번 더'});
    }
    return m;
  },
};
