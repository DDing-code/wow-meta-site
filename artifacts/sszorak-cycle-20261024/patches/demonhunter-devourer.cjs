// demonhunter-devourer 단일 딜사이클 스조라크 대조 — 근거: digests/demonhunter-devourer.md, apl/demonhunter_devourer.simc, sources/demonhunter-devourer.txt
// 오프닝 첫 두 단계(풀링 1초 전 영혼 제물 → 흡수로 풀링)는 두 영웅 특성 모두 그대로 둔다(심크 우선순위 precombat soul_immolation → consume 과도 같다).
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const rep = (text, from, to) => { if (!text.includes(from)) throw new Error('바꿀 문장을 못 찾음: ' + from.slice(0, 30)); return text.replace(from, to); };

module.exports = {
  evidenceNote: '단일 딜사이클 스조라크 대조(2026-10-24): 스조라크 신화(12.1.5) WCL 상위 로그 18개(궤멸자 10·공허상흔 8)의 실제 시전 순서와 심크 우선순위(midnight 3af1a757)·Icy Veins·Method 프리풀을 대조해, 궤멸자는 첫 붕괴하는 별 바로 뒤를 공허 광선 대신 도태로(10개 중 9개, 심크 우선순위 annihilator_meta 의 별 다음 reaps) 바꾸고, 공허상흔은 첫 진입의 복수의 퇴각을 선택으로 돌리고(8개 중 3개만 사용) 장막 관통 뒤 공허 광선 없이 바로 붕괴하는 별을 쓰도록(8개 중 7개) 고쳤습니다. 풀링 1초 전 영혼 제물 → 흡수로 풀링하는 첫 두 단계는 그대로 두었습니다.',
  changelog: [
    '- 궤멸자 오프닝(연습 장 타임라인·영웅 탭): … 공허 광선 → 붕괴하는 별 → 공허 광선 → 집어삼키기 → 도태 → … 공허 광선 → 붕괴하는 별 → 도태 → 집어삼키기 → 도태 (근거: 스조라크 로그 10개 중 9개가 첫 별 바로 뒤 도태, 심크 우선순위 annihilator_meta 는 collapsing_star 다음 reaps(4개 이상). 예: https://www.warcraftlogs.com/reports/1xDYz6FTwZac49vJ#fight=30&source=9)',
    '- 궤멸자 탈태 안 반복 rail: 붕괴하는 별 → 집어삼키기 → 도태 → 붕괴하는 별 → 도태 → 집어삼키기 (근거: 반복 구간 별 바로 다음 도태 약 절반·집어삼키기 약 4할, 로그마다 다름을 rail note 에 적음). 님리사 근거 문장을 스조라크 근거로',
    '- 공허상흔 첫 진입: 공허칼날 → 복수의 퇴각 → 사냥 → 공허칼날 → 사냥 (근거: 8개 중 5개가 퇴각 없이 사냥, 3개만 사이에 퇴각 — 심크 우선순위 hunt_entry 는 퇴각을 넣으므로 note 에 선택으로 남김)',
    '- 공허상흔 첫 탈태 안: 사신의 대가 → 장막 관통 → 공허 광선 → 붕괴하는 별 → 사신의 대가 → 장막 관통 → 붕괴하는 별 (근거: 8개 중 7개가 관통 뒤 광선 없이 별, 광선은 사신의 대가 앞이나 별 뒤 연계 사이). 별 뒤 포식자의 각성: 별 107번 중 90번이 6초 안',
    '- 2부 단일·오프닝 장 본문·요점, 4부 공허상흔 장 근거 문장, 영웅 탭 메모의 님리사 근거를 스조라크 근거로 바꿈. 풀링 1초 전 영혼 제물 → 흡수로 풀링은 그대로',
  ].join('\n'),
  apply(m) {
    const block = t => m.blocks.find(b => b.title.startsWith(t));

    // 2부 단일 연습
    const single = block('허수아비 첫 연습');
    single.paragraphs[1] = rep(single.paragraphs[1],
      '4개 이상 거둘 수 있으면 도태로 다음 별에 쓸 파편을 모읍니다. 별 직후에는 거둘 파편이 모자라니 집어삼키기로 파편을 만든 뒤 도태를 씁니다.',
      '별 바로 뒤에 4개 이상 거둘 수 있으면 도태로 다음 별에 쓸 파편을 모으고, 집어삼키기로 격노와 파편을 만든 뒤 다시 도태를 씁니다.');
    single.bullets = single.bullets.map(s => (s.startsWith('안(궤멸자):')
      ? '안(궤멸자): 발동 집어삼키기 → 공허 광선 → 붕괴하는 별 → 4개 이상이면 도태 → 집어삼키기로 파편 모으기 → 공허칼날(포식자의 이빨).' : s));
    const meta = tlOf(single)[0].rails.find(r => r.label === '반복 흐름 — 탈태 안, 단일 (궤멸자)');
    meta.nodes = [
      {skillId: '1217610', caption: '영혼분출 발동이면'},
      {skillId: '473728', caption: '영혼이 넘치지 않으면'},
      {skillId: '1221167', caption: '영혼 30개'},
      {skillId: '1245453', caption: '4개 이상 · 별 바로 뒤'},
      {skillId: '1217610', caption: '격노 16 · 파편', above: {skillId: '1241937', when: '탈태가 끝날 무렵'}},
      {skillId: '1245412', caption: '포식자의 이빨이면'},
    ];
    meta.note = '두 번째 공허 광선 뒤에도 멈추지 않고 별과 도태, 집어삼키기로 탈태를 끌어 다음 별을 엽니다. 스조라크 신화 상위 로그(궤멸자 10개)에서 별 바로 뒤에는 도태가 절반 정도로 가장 많았고, 집어삼키기를 먼저 몇 번 쓰는 경우도 많아 로그마다 다릅니다. 4개 이상 거둘 수 없으면 집어삼키기로 파편부터 만듭니다.';

    // 2부 오프닝 연습
    const opener = block('쿨기와 오프닝');
    opener.paragraphs[0] = rep(opener.paragraphs[0],
      '12.1.5 이후 상위 레이드 로그에는 영혼 제물이 전투 시작 뒤에 찍힌 경우가 많았지만,',
      '스조라크 신화 상위 로그에는 영혼 제물이 전투 시작 뒤에 찍힌 경우가 많았지만,');
    opener.paragraphs[1] = rep(opener.paragraphs[1],
      '별 다음에는 공허 광선이 돌아오는 대로 쓰고, 집어삼키기로 격노와 파편을 만든 뒤 4개 이상 모이면 도태로 다음 별에 쓸 파편을 거둡니다.',
      '별 바로 뒤에는 도태로 파편을 거두고, 집어삼키기로 격노와 파편을 만들어 다음 도태와 별을 준비합니다. 공허 광선은 쿨이 돌면 다시 씁니다. 스조라크 신화 상위 로그 10개 중 9개가 첫 별 바로 뒤에 도태를 썼습니다.');
    opener.paragraphs[2] = '공허상흔은 첫 탈태 직전에 공허칼날로 굶주린 베기 발동을 띄우고, 사냥이 준비됐다면 사냥으로 돌진하면서 탈태를 누릅니다. 돌진할 거리가 없다면 그 사이에 복수의 퇴각으로 거리를 벌립니다. 탈태에 들어가면 들고 온 발동이 끝나기 전에 사신의 대가부터 쓰고, 장막 관통을 맞힌 뒤 바로 붕괴하는 별을 씁니다. 별이 사냥 쿨다운을 초기화하면 바로 포식자의 각성을 쓰고, 다시 생긴 발동을 사신의 대가로 쓴 뒤 도태와 공허 광선으로 단일 유지에 들어갑니다. 공허 광선은 쿨이 돌면 근접 연계 사이에 끼워 씁니다. 스조라크 신화 상위 로그 8개도 대부분 이 순서였습니다.';
    opener.bullets = opener.bullets.map(s => (s.startsWith('공허상흔은 진입 직전')
      ? '공허상흔은 진입 직전 공허칼날 → 사냥으로 이어서 씁니다. 돌진할 거리가 없을 때만 그 사이에 복수의 퇴각을 넣고, 하나를 기다리느라 탈태를 미루지 않습니다.' : s));
    const rails = tlOf(opener)[0].rails;
    const an = rails.find(r => r.label === '궤멸자 오프닝');
    if (an.nodes[0].skillId !== '1241937' || an.nodes[1].skillId !== '473662') throw new Error('궤멸자 첫 두 단계가 다름');
    an.nodes = [
      ...an.nodes.slice(0, 8), // 영혼 제물 → 흡수 → 수확 → 공허 광선 → 공허칼날 → 공허 탈태 → 공허 광선 → 붕괴하는 별
      {skillId: '1245453', caption: '별 바로 뒤 회수'},
      {skillId: '1217610', caption: '격노·파편'},
      {skillId: '1245453', caption: '다음 별 파편'},
    ];
    an.note = '한밤 마지막 단계가 없다면 진입 직후 별을 억지로 쓰지 말고 실제로 쌓인 영혼을 확인합니다. 포식자의 이빨을 고르지 않았다면 공허칼날은 건너뜁니다. 풀링 1초 전에 영혼 제물을 쓰고, 흡수로 풀링합니다. 스조라크 신화 상위 로그 10개 중 9개가 첫 별 바로 뒤에 도태를 썼고, 공허 광선은 쿨이 돌면 다시 썼습니다. 진입 전 공허 광선은 흡수와 번갈아 두세 번 쓰기도 합니다.';
    const v1 = rails.find(r => r.label === '공허상흔 ① 전투 전부터 첫 진입까지');
    if (v1.nodes[0].skillId !== '1241937' || v1.nodes[1].skillId !== '473662') throw new Error('공허상흔 첫 두 단계가 다름');
    v1.nodes = v1.nodes.filter(n => n.skillId !== '344866');
    v1.note = '공허칼날로 굶주린 베기를 띄운 뒤 6초 안에 탈태로 가져갑니다. 스조라크 신화 상위 로그 8개 중 5개는 공허칼날 뒤 바로 사냥으로 들어갔고, 3개는 그 사이에 복수의 퇴각으로 거리를 벌렸습니다(심크 우선순위도 퇴각을 넣습니다). 사냥이 쿨이면 사냥 없이 바로 들어갑니다. 격렬한 변신이 진입 때 공허칼날과 영혼 제물의 쿨다운을 초기화합니다.';
    const v2 = rails.find(r => r.label === '공허상흔 ② 첫 탈태 안');
    v2.nodes = [
      {skillId: '1245470', caption: '들고 온 발동 · 먼저'},
      {skillId: '1245483', caption: '별보다 먼저'},
      {skillId: '1221167', caption: '영혼 30개 · 사냥 초기화'},
      {skillId: '1259431', caption: '돌아온 사냥'},
      {skillId: '1245470', caption: '각성이 만든 발동'},
      {skillId: '1245453', caption: '4개 이상·최대 충전'},
      {skillId: '473728', caption: '쿨이 돌면 → 반복'},
    ];
    v2.note = '영혼분출 발동 집어삼키기가 있으면 먼저 확인합니다. 단일은 이 뒤에도 두 번째 광선 후 일부러 멈추지 않습니다. 스조라크 신화 상위 로그 8개 중 7개가 들고 온 발동이 끝나기 전에 사신의 대가를 공허 광선보다 먼저 썼고, 7개가 장막 관통 뒤 공허 광선 없이 바로 별을 썼습니다. 광선은 사신의 대가 앞이나 별 뒤 연계 사이에 넣어 로그마다 다릅니다.';

    // 4부 공허상흔 장
    const vs = block('공허상흔:');
    vs.paragraphs[1] = rep(vs.paragraphs[1],
      '다만 12.1.5 이후 상위 레이드 로그에서는 진입 직전 사냥 때문에 포식자의 각성이 대개 쿨이라, 별을 먼저 쓰고 초기화된 포식자의 각성을 바로 쓰는 장면이 대부분이었습니다(별 98번 중 별 직후 78번, 별 앞 1번). 첫 진입 때는 들고 온 발동이 끝나기 전에 사신의 대가를 공허 광선보다 먼저 쓴 로그가 7개 중 6개였습니다.',
      '다만 스조라크 신화 상위 로그에서는 진입 직전 사냥 때문에 포식자의 각성이 대개 쿨이라, 별을 먼저 쓰고 초기화된 포식자의 각성을 바로 쓰는 장면이 대부분이었습니다(별 107번 중 별 직후 90번, 별 앞 5번). 첫 진입 때는 들고 온 발동이 끝나기 전에 사신의 대가를 공허 광선보다 먼저 쓴 로그가 8개 중 7개였습니다.');

    // 영웅 특성 탭 — 공허상흔
    const vh = m.heroBranches.find(h => h.label === '공허상흔');
    vh.opener.summary = rep(vh.opener.summary, '12.1.5 이후 상위 레이드 로그 7개의 실제 순서를', '스조라크 신화 상위 로그 8개의 실제 순서를');
    const vo = vh.opener.steps;
    if (vo[0].skillId !== '1241937' || vo[1].skillId !== '473662') throw new Error('공허상흔 탭 첫 두 단계가 다름');
    const firstRayIdx = vo.findIndex((s, i) => i > 8 && s.skillId === '473728');
    vh.opener.steps = vo
      .filter((s, i) => s.skillId !== '344866' && i !== firstRayIdx)
      .map(s => {
        if (s.skillId === '1246167') return {...s, note: '사냥으로 돌진하는 동안 탈태를 누릅니다(Wowhead 10월 14일). 스조라크 상위 로그 8개 중 3개는 그 앞에 복수의 퇴각으로 거리를 만들었습니다. 착지 자리가 안전하고 돌진할 거리가 없을 때만 넣습니다. 사냥이 쿨이면 바로 들어갑니다.'};
        if (s.skillId === '1245470' && s.trigger === '들고 온 발동') return {...s, note: '진입 직전 띄운 굶주린 베기의 강화형입니다. 발동이 끝나기 전에 공허 광선보다 먼저 씁니다(스조라크 상위 로그 8개 중 7개).'};
        if (s.skillId === '1245483') return {...s, note: '공허칼날의 강화형입니다. 이어서 바로 붕괴하는 별을 씁니다(8개 중 7개).'};
        if (s.skillId === '1259431') return {...s, note: '돌아온 사냥의 강화형입니다. 별 바로 뒤에 대상과 경로를 확인하고 씁니다. 스조라크 상위 로그에서 별 107번 중 90번이 6초 안에 이어 썼습니다.'};
        if (s.skillId === '473728' && s.phase === '단일 유지') return {...s, trigger: '쿨이 돌면', note: '공허 광선은 쿨이 돌면 근접 연계 사이에 끼워 씁니다. 도태와 집어삼키기로 이어 가며 다음 별을 준비하고, 두 번째 광선 뒤 일부러 멈추지 않습니다.'};
        return s;
      });
    vh.singleTarget.priority = vh.singleTarget.priority.map(p => {
      if (p.skillId === '344866') return {...p, note: rep(p.note, '상위 레이드 로그에서도', '스조라크 상위 로그에서도')};
      if (p.skillId === '1259431') return {...p, note: rep(p.note, '상위 레이드 로그처럼', '스조라크 상위 로그처럼')};
      return p;
    });

    // 영웅 특성 탭 — 궤멸자
    const ah = m.heroBranches.find(h => h.label === '궤멸자');
    ah.opener.summary = rep(ah.opener.summary,
      '12.1.5 이후 상위 레이드 로그 8개에 맞춰 첫 별 뒤에 공허 광선을 넣었고,',
      '스조라크 신화 상위 로그 10개 중 9개에 맞춰 첫 별 바로 뒤에 도태를 넣었고,');
    const ao = ah.opener.steps;
    if (ao[0].skillId !== '1241937' || ao[1].skillId !== '473662') throw new Error('궤멸자 탭 첫 두 단계가 다름');
    const starIdx = ao.findIndex(s => s.skillId === '1221167');
    const cull = ao.find(s => s.skillId === '1245453');
    const devour = ao.find(s => s.skillId === '1217610');
    ah.opener.steps = [
      ...ao.slice(0, starIdx + 1).map(s => (s.skillId === '1245412' ? {...s, note: rep(s.note, '상위 레이드 로그 8개에서는 진입 전 공허칼날이 없었습니다.', '스조라크 상위 로그 10개에서는 진입 전 공허칼날이 없었습니다.')} : s)),
      {skillId: '1245453', label: '도태', phase: '별 뒤 회수', trigger: '별 직후 · 4개 이상', note: '별 바로 뒤에 파편을 거둡니다. 스조라크 상위 로그 10개 중 9개가 첫 별 바로 뒤에 썼습니다. 공허내림 3중첩도 함께 소비합니다.'},
      {...devour},
      {...cull, note: '다음 별에 쓸 파편을 거둡니다. 공허 광선은 쿨이 돌면 다시 씁니다. 박멸을 골랐다면 광선 뒤에는 박멸로 나갑니다.'},
    ];
    ah.singleTarget.priority = ah.singleTarget.priority.map(p => (p.skillId === '1245453'
      ? {...p, note: rep(p.note, '별 직후에는 파편이 모자라 보통 집어삼키기 몇 번 뒤에 옵니다.', '스조라크 상위 로그에서는 별 바로 뒤에 쓰는 경우가 가장 많았습니다. 거둘 파편이 모자라면 집어삼키기 뒤로 미룹니다.')} : p));
    return m;
  },
};
