// rogue-assassination 단일 딜사이클 스조라크 대조 — 근거: digests/rogue-assassination.md, apl/rogue_assassination.simc, sources/rogue-assassination.txt
// 운명결속 오프닝: 두 번째 강화 목조르기를 죽음표식 앞으로(로그 11개 중 8개). 두 영웅 특성 오프닝 맨 앞에 은신(심크 precombat stealth·Icy "open from Stealth").
// 죽음추적자: 로그 3개뿐이라 오프닝 순서는 그대로 두고, 단일 우선순위에 칼날 부채(어둡고 어두운 밤 1점 보충)만 더한다.
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const rep = (text, from, to) => { if (!text.includes(from)) throw new Error('바꿀 문장을 못 찾음: ' + from.slice(0, 30)); return text.replace(from, to); };

module.exports = {
  evidenceNote: '단일 딜사이클 스조라크 대조(2026-10-24): 스조라크 신화(12.1.5) WCL 상위 로그 14개(운명결속 11·죽음추적자 3)의 실제 시전 순서와 심크 우선순위(midnight 3af1a757)·Icy Veins·Method 프리풀을 대조해, 두 오프닝 맨 앞에 풀링 직전 은신을 두고, 운명결속 오프닝의 두 번째 강화 목조르기를 죽음표식 뒤 소멸 단계에서 독살 앞(첫 은신 해제 뒤 강화 시간 안)으로 옮겼으며(로그 11개 중 8개), 죽음추적자 단일 우선순위에 칼날 부채(어둡고 어두운 밤 최대 점수 1점 보충)를 넣었습니다. 죽음추적자 오프닝은 로그가 3개뿐이라 그대로 두었습니다.',
  changelog: [
    '- 두 영웅 특성 오프닝(연습 장 타임라인·영웅 탭) 맨 앞에 은신(풀링 직전) 추가 (근거: 심크 우선순위 precombat stealth, Icy Veins "Always make sure to open from Stealth", 로그 14개 모두 첫 시전이 은신 목조르기)',
    '- 운명결속 오프닝: 목조르기 → 절단 → 파열 → 절단 → 독살 → 죽음표식 → 왕의 파멸 → 독살 → 소멸 → 목조르기 를 은신 → 목조르기 → 절단 → 파열 → 절단 → 목조르기(강화 시간 안) → 독살 → 죽음표식 → 왕의 파멸 → 독살 로 (근거: 스조라크 운명결속 로그 11개 중 8개가 죽음표식 전에 두 번째 목조르기, 그중 5개는 두 번째 절단 뒤, 3개는 바로 앞에 소멸. 죽음표식 뒤 소멸 → 목조르기는 2개. Icy Veins 오프닝도 파열 뒤 목조르기로 강화 목조르기 연장)',
    '- 죽음추적자 단일 우선순위·끼워 넣기 rail: 칼날 부채 추가 — 어둡고 어두운 밤이고 최대 점수까지 1점 모자랄 때 (근거: 죽음추적자 로그 분당 1.21회·뒤 79% 독살, 심크 우선순위 generate 의 fan_of_knives,if=buff.darkest_night.up&combo_points.deficit=1, Icy Veins "exactly 6 CP → Shiv or Fan of Knives")',
    '- 오프닝 장 한 줄 원리·본문·확인 문제, 영웅 탭 운명결속 오프닝 요약을 같은 순서로 맞춤',
    '- 그대로 둔 것: 공통 단일 반복 rail(절단 → 독살 반복, 독살 뒤 죽음표식 → 왕의 파멸 → 독살이 로그와 같음), 운명결속 단일 우선순위, 죽음추적자 오프닝(로그 3개 중 2개는 소멸 → 목조르기를 독살 뒤에 쓰지만 표본이 적고 Icy Veins 오프닝과 지금 순서가 같아 보류)',
  ].join('\n'),
  apply(m) {
    const block = t => m.blocks.find(b => b.title.startsWith(t));

    // 2부 단일 연습: 죽음추적자 문단·끼워 넣기 rail 에 칼날 부채
    const single = block('허수아비 첫 연습');
    single.paragraphs[2] = rep(single.paragraphs[2],
      '독 묻은 스틸레토를 골랐다면 독칼을 값싼 생성기로 섞습니다.',
      '독 묻은 스틸레토를 골랐다면 독칼을 값싼 생성기로 섞습니다. 최대 점수까지 1점만 모자라면 칼날 부채로 채웁니다.');
    const singleInserts = tlOf(single)[0].rails.find(r => r.kind === 'inserts');
    singleInserts.nodes = [
      ...singleInserts.nodes.filter(n => n.skillId !== '51723'),
      {skillId: '51723', caption: '죽음추적자 · 1점 모자랄 때'},
    ];

    // 2부 오프닝 연습
    const opener = block('쿨기와 오프닝');
    opener.concept = '오프닝은 은신 목조르기로 시작해 파열을 깔고, 강화 목조르기를 한 번 더 바른 뒤 독살로 독 발동 확률을 올리고 죽음표식과 왕의 파멸로 들어가는 흐름입니다. 두 번째 목조르기는 두 영웅 특성 모두 죽음표식 전, 첫 은신 해제 뒤 강화 적용 시간 안에 바릅니다.';
    opener.paragraphs[1] = '파열에 점수를 썼으니 다시 절단으로 5점 이상을 모읍니다. 독살을 쓰기 전에, 은신에서 벗어난 뒤 강화 적용 시간이 남아 있을 때 목조르기를 한 번 더 써서 강화 출혈을 이어 둡니다. 운명결속은 두 번째 절단 뒤에, 죽음추적자 예시는 파열 바로 뒤에 씁니다. 그다음 독살을 써서 독 발동 확률을 올려 둡니다. 일반 목조르기로 강화 출혈을 덮어쓰라는 뜻이 아닙니다.';
    opener.paragraphs[2] = rep(opener.paragraphs[2],
      '운명결속 예시는 여기서 소멸을 쓰고 바로 목조르기를 다시 발라, 죽음표식이 걸린 대상에 강화 출혈을 겁니다. 그 뒤에는',
      '그 뒤에는');
    opener.paragraphs[2] = rep(opener.paragraphs[2],
      '사용 장신구와 물약은 자신의 전투 계획과 장비에 맞춥니다.',
      '사용 장신구와 물약은 자신의 전투 계획과 장비에 맞춥니다. 소멸을 쓰는 자리는 로그마다 다릅니다. 두 번째 목조르기 바로 앞에 써서 강화 시간을 다시 열기도 하고, 죽음표식이 걸린 동안 소멸 → 목조르기로 한 번 더 바르기도 합니다.');
    opener.quiz[0] = {
      ...opener.quiz[0],
      a: '강화 목조르기를 한 번 더 바르기 위해서입니다. 목조르기 연마는 은신 중이거나 은신 해제 후 6초 동안 쓴 목조르기를 강화합니다. 두 영웅 특성 모두 첫 은신 해제 뒤 이 시간 안에, 죽음표식 전에 한 번 더 씁니다. 바로 앞에 소멸을 쓰면 이 시간이 다시 열립니다. 이 시간이 지났다면 일반 목조르기로 강화 출혈을 덮어쓰지 않습니다.',
    };
    const rails = tlOf(opener)[0].rails;
    const fate = rails.find(r => r.label === '오프닝 — 운명결속');
    fate.nodes = [
      {skillId: '1784', caption: '풀링 직전'},
      {skillId: '703', caption: '은신 · 강화 출혈'},
      {skillId: '1329', caption: '5점 이상까지', above: {skillId: '8676', when: '무료 매복이면 활용'}},
      {skillId: '1943', caption: '5점 이상 · 주 대상'},
      {skillId: '1329', caption: '다시 5점 이상까지'},
      {skillId: '703', caption: '강화 시간 안 · 한 번 더', above: {skillId: '1856', when: '로그 일부 · 바로 앞에'}},
      {skillId: '32645', caption: '독 발동 확률 준비', above: {skillId: '1298826', when: '수동 선택 · 기력 부족 시'}},
      {skillId: '360194', caption: '출혈·공격 시간 확보'},
      {skillId: '385627', caption: '죽음표식 직후'},
      {skillId: '32645', caption: '점수 확인 뒤 소비'},
    ];
    fate.note = '동전 결과를 기다리느라 첫 극딜을 늦추지 않습니다. 추가 점수가 생기면 생성 단계를 줄입니다. 수동 엉겅퀴 차는 기력이 실제로 모자랄 때만 끼워 넣고, 자동 선택이면 직접 쓸 일이 없습니다. 스조라크 신화 상위 운명결속 로그 11개 중 8개가 죽음표식 전에 두 번째 목조르기를 썼습니다. 파열 바로 뒤에 쓰거나 바로 앞에 소멸을 쓰는 등 로그마다 조금씩 다릅니다. 마지막 단계 뒤에는 생성·독살 반복으로 돌아갑니다.';
    const death = rails.find(r => r.label === '오프닝 — 죽음추적자');
    death.nodes = [{skillId: '1784', caption: '풀링 직전'}, ...death.nodes.filter(n => n.skillId !== '1784')];

    // 영웅 특성 탭
    const stealthStep = {skillId: '1784', label: '은신', note: '은신 상태로 풀링합니다. 첫 목조르기를 은신에서 써야 강화 출혈이 됩니다. 무기의 독은 미리 발라 둡니다.', phase: '전투 전', trigger: '풀링 직전'};
    const fb = m.heroBranches.find(h => h.label === '운명결속');
    fb.opener.summary = '은신과 독을 준비한 기본 예시입니다. 생성 단계는 표시된 횟수가 아니라 연계 점수 조건을 채울 때까지 반복합니다. 두 번째 강화 목조르기는 독살과 죽음표식 전에, 첫 은신 해제 뒤 강화 적용 시간 안에 바릅니다. 수동 엉겅퀴 차를 선택했다면 기력이 부족할 때 별도로 사용하며, 자동 선택은 누를 버튼이 아닙니다.';
    const fs = fb.opener.steps;
    const garrote1 = fs[0], build1 = fs[1], rupture = fs[2], build2 = fs[3], env1 = fs[4], dm = fs[5], kb = fs[6], env2 = fs[7];
    if (garrote1.skillId !== '703' || build2.skillId !== '1329' || dm.skillId !== '360194' || env2.skillId !== '32645') throw new Error('운명결속 오프닝 단계 위치가 예상과 다름');
    fb.opener.steps = [
      stealthStep,
      garrote1,
      build1,
      rupture,
      {...build2, note: '파열에서 점수를 소비했으므로 독살 전에 다시 생성합니다. 추가 점수가 생기면 생성기 횟수를 줄입니다.'},
      {skillId: '703', label: '강화 목조르기', phase: '극딜 준비', trigger: '은신 해제 후 6초 안', note: '첫 은신 해제 뒤 강화 적용 시간이 남아 있을 때 목조르기를 한 번 더 써서 강화 출혈을 이어 둡니다. 스조라크 신화 상위 운명결속 로그 11개 중 8개가 죽음표식 전에 이렇게 썼고, 일부는 바로 앞에 소멸을 써서 강화 시간을 다시 열었습니다.'},
      env1,
      {...dm, note: '오래 살 주 대상에 사용합니다. 두 출혈과 독살 효과가 켜진 뒤 씁니다.'},
      kb,
      {...env2, note: '왕의 파멸이 만든 점수까지 보고 5점 이상이면 소비합니다. 점수가 모자라면 절단으로 보충한 뒤 씁니다. 이후에는 단일 우선순위로 생성·독살을 이어 갑니다.'},
    ];
    // 검사기(validate-guide-manuscripts)가 상단 opener 와 기본 영웅(운명결속) 오프닝이 같기를 요구한다.
    if (m.opener) m.opener = JSON.parse(JSON.stringify(fb.opener));
    const ds = m.heroBranches.find(h => h.label === '죽음추적자');
    ds.opener.steps = [stealthStep, ...ds.opener.steps.filter(s => s.skillId !== '1784')];
    const pri = ds.singleTarget.priority.filter(s => s.skillId !== '51723');
    const at = pri.findIndex(s => s.skillId === '5938');
    pri.splice(at + 1, 0, {skillId: '51723', label: '칼날 부채로 1점 채우기', note: '어둡고 어두운 밤이 켜졌고 최대 점수까지 1점만 모자랄 때 씁니다. 바로 강화 독살로 잇습니다. 심크 우선순위와 공개 가이드도 이 자리에서 칼날 부채나 독칼로 1점을 채웁니다.'});
    ds.singleTarget.priority = pri;
    return m;
  },
};
