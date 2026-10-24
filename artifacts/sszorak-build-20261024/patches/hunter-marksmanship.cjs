// hunter-marksmanship 단일 딜사이클 스조라크 빌드 기준 — 근거: bd/hunter-marksmanship.md, ../sszorak-cycle-20261024/apl/hunter_marksmanship.simc, ../sszorak-cycle-20261024/sources/hunter-marksmanship.txt
// 기준 영웅 특성은 파수꾼(스조라크 상위 ALL 200행·KR 100행 모두). 기본 탭은 그대로다.
// 오프닝: 순서는 로그와 같아 그대로 두고, 폭발 사격 두 칸을 한 칸 ×2 로 묶는다(새 견본 유동성 제동장치 300/300, 반복 구간 65묶음 중 61묶음이 두 번).
// 단일 반복: 순서 그대로. 폭발 사격은 위쪽 가지라 count 를 못 달아 조건 글에 '두 번'을 적고, 단일 우선순위에서 히드라의 상 두 대상 갈래를 뺀다.
// 어둠 순찰자 rail·탭 순서는 그대로 둔다(스조라크 로그 0개).
const rep = (text, from, to) => { if (!text.includes(from)) throw new Error('바꿀 문장을 못 찾음: ' + from.slice(0, 30)); return text.replace(from, to); };
const tlOf = b => [].concat(b.timeline);

module.exports = {
  evidenceNote: '단일 딜사이클 스조라크 빌드 기준(2026-10-24): 스조라크 신화(12.1.5) 상위 랭킹 영웅 특성(ALL 200행·KR 100행 모두 파수꾼)과 파수꾼 로그 8개의 실제 순서·반복 횟수로 오프닝·단일 반복을 다시 보고 단일 견본을 스조라크 대표 빌드로 바꿨습니다(전체 31위 기록, 또렷한 시야·유동성 제동장치·추적과 타격 선택). 오프닝은 8개 모두 폭발 사격 → 연발 공격 → 정조준 → 속사였고, 풀링 전 조준 사격을 쓴 4개는 모두 폭발 사격을 두 번 이어 썼으며, 속사 바로 뒤는 5개가 신비한 사격이라 순서를 그대로 두고 폭발 사격을 칸 하나 ×2 로 묶었습니다. 반복 구간 폭발 사격은 65묶음 중 61묶음이 두 번 연속이었고, 다른 스킬은 이어 누른 횟수 중앙값이 1입니다. 단일 우선순위에서 히드라의 상 두 대상 갈래를 뺐습니다.',
  buildNote: '사격 지휘 대신 또렷한 시야(정조준 2분), 유동성 제동장치·추적과 타격을 고른 빌드입니다.',
  changelog: [
    '- 오프닝(2부 오프닝 장 파수꾼 rail·영웅 탭 오프닝): 순서 그대로. 폭발 사격 두 칸을 한 칸 ×2 로 묶음 (근거: 스조라크 파수꾼 로그 8개 모두 폭발 사격 → 연발 공격 → 정조준 → 속사, 사전 조준 사격 4개는 모두 폭발 사격 ×2, 속사 뒤 신비한 사격 5/8. 새 견본 유동성 제동장치 300/300. 예: https://www.warcraftlogs.com/reports/RanbCzckZWDQqXg7#fight=31&source=10)',
    '- 단일 반복: 순서 그대로. 폭발 사격 위쪽 가지 조건에 "두 번"을 적음(반복 구간 65묶음 중 61묶음이 ×2, 위쪽 가지는 count 를 쓰지 않음). 영웅 탭 단일 속사 행의 히드라의 상 두 대상 갈래를 뺌(새 견본에 히드라의 상 없음, 광역은 그대로)',
    '- 영웅 탭 요약·3부 파수꾼 장·4부 어둠 순찰자 장: "이번 한국 검수: 레이드 1건", "실제 선택 비율도 대부분" 같은 문장을 스조라크·님리사·쐐기 상위 행 수로 바꿈',
    '- 프리풀: 사냥꾼의 징표·조준 사격(풀링 2.5초 전) 그대로(심크 우선순위 precombat aimed_shot, Icy Veins·Method 같음, 로그 4/8)',
  ].join('\n'),
  apply(m) {
    const block = t => m.blocks.find(b => b.title.startsWith(t));

    // ── 2부 오프닝 장 ──
    const op = block('정조준과 오프닝');
    const rail = tlOf(op)[0].rails.find(r => r.label.startsWith('오프닝 — 파수꾼'));
    if (!rail) throw new Error('파수꾼 오프닝 rail 없음');
    const i = rail.nodes.findIndex(n => n.skillId === '212431');
    if (rail.nodes[i + 1]?.skillId !== '212431') throw new Error('폭발 사격 두 칸이 아님');
    rail.nodes.splice(i, 2, {skillId: '212431', count: 2, caption: '유동성 제동장치'});
    rail.note = '전술 재장전이면 폭발 사격을 한 번만 쓰고 실탄 장전 상태를 봅니다. 스조라크 신화 상위 기록 8개 모두 폭발 사격 → 연발 공격 → 정조준 → 속사 순서였고, 풀링 전에 조준 사격을 쏜 4개는 모두 폭발 사격을 두 번 이어 썼습니다. 속사 바로 뒤는 8개 중 5개가 신비한 사격, 3개가 조준 사격이었습니다. 마지막 단계 뒤에는 정해진 순서가 아니라 앞 장의 반복 흐름으로 돌아갑니다.';

    // ── 2부 단일 장 ──
    const st = block('훈련용 허수아비로 하는 첫 연습');
    const loop = tlOf(st)[0].rails.find(r => r.loop);
    const first = loop.nodes[0];
    if (first.above?.skillId !== '212431') throw new Error('폭발 사격 위쪽 가지 없음');
    first.above = {...first.above, when: '쿨이 돌면 먼저 · 두 번'};
    loop.note = loop.note + ' 스조라크 신화 상위 기록 8개(모두 파수꾼)도 조준 사격과 신비한 사격을 번갈아 썼고, 폭발 사격은 65묶음 중 61묶음이 두 번 연속이었습니다.';

    // ── 영웅 탭: 파수꾼 ──
    const sen = m.heroBranches.find(h => h.label === '파수꾼');
    sen.summary = rep(sen.summary,
      '최신 상위 로그 사용률을 측정한 추천은 아닙니다. 이번 한국 검수: 레이드 1건·쐐기 1건. 선택·시전 사례이며 상대 분기보다 강하다는 증명이 아닙니다.',
      '스조라크 신화 상위 200행(한국 100행)이 모두 파수꾼이었고, 오프닝·단일은 이 단일 네임드 기록과 대표 빌드 기준입니다. 님리사 신화 상위 100행과 쐐기 상위 24행도 모두 파수꾼이었습니다.');
    sen.bullets[1] = rep(sen.bullets[1],
      '단일 우선순위는 폭발 사격과 주력기 회복을 챙기고,',
      '단일 네임드에서는 폭발 사격을 쿨마다 두 번 이어 쓰고(스조라크 상위 기록 65묶음 중 61묶음) 주력기 회복을 챙기며,');
    const steps = sen.opener.steps;
    const e = steps.findIndex(s => s.skillId === '212431');
    if (steps[e + 1]?.skillId !== '212431') throw new Error('영웅 탭 폭발 사격 두 단계가 아님');
    steps.splice(e, 2, {
      skillId: '212431',
      label: '폭발 사격',
      count: 2,
      phase: '지속 피해',
      trigger: '유동성 제동장치',
      note: '전투 시작 후 지속 피해를 준비하고, 유동성 제동장치가 준 3초 안에 한 번 더 씁니다. 시즌 2 세트 효과가 있다면 다음 주력기 회복과 연결됩니다. 전술 재장전을 선택했다면 한 번만 씁니다.',
    });
    sen.opener.summary = rep(sen.opener.summary,
      '전술 재장전이면 두 번째 폭발 사격을 생략하고 실탄 장전 상태를 봅니다.',
      '전술 재장전이면 폭발 사격을 한 번만 쓰고 실탄 장전 상태를 봅니다. 스조라크 신화 상위 기록 8개 모두 폭발 사격 → 연발 공격 → 정조준 → 속사 순서였습니다.');
    sen.singleTarget.summary = '단일 네임드용 순서입니다. ' + sen.singleTarget.summary;
    const rf = sen.singleTarget.priority.find(r => r.skillId === '257044');
    rf.note = rep(rf.note, ' 히드라의 상으로 두 대상 이상이면 그대로 씁니다.', '');

    // ── 영웅 탭: 어둠 순찰자 ──
    const dark = m.heroBranches.find(h => h.label === '어둠 순찰자');
    dark.summary = rep(dark.summary,
      '현재 기본 추천인 파수꾼과 다른 선택이며, 최신 로그 채택률로 우세를 단정하지 않습니다. 이번 한국 검수: 레이드 0건·쐐기 0건. 이 분기는 이번 한국 로그에 없어 조정 후 성능을 직접 비교하지 못했습니다.',
      '현재 기본인 파수꾼과 다른 선택입니다. 스조라크·님리사 신화 상위 기록에는 없었고(0행), 쐐기 상위 기록도 한국 18행 중 1행뿐이라 조정 후 성능을 직접 비교하지 못했습니다.');

    // ── 3부 파수꾼 장 · 4부 어둠 순찰자 장: 영웅 특성 선택 문장 ──
    const senCh = block('파수꾼:');
    senCh.paragraphs[0] = rep(senCh.paragraphs[0],
      '공개 가이드와 시뮬레이션이 모두 파수꾼을 권하고, 실제 선택 비율도 대부분 파수꾼입니다.',
      '공개 가이드와 시뮬레이션이 모두 파수꾼을 권하고, 스조라크 신화 상위 200행과 님리사 신화 상위 100행도 모두 파수꾼이었습니다. 그래서 오프닝·단일 딜사이클과 단일 견본은 파수꾼 스조라크 기록을 기준으로 합니다.');
    const darkCh = block('어둠 순찰자:');
    darkCh.paragraphs[0] = rep(darkCh.paragraphs[0],
      '고르는 사람이 적고 시뮬레이션에서도 파수꾼이 앞서니,',
      '스조라크·님리사 신화 상위 기록에는 없고(0행) 시뮬레이션에서도 파수꾼이 앞서니,');
    return m;
  },
};
