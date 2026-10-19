// druid-restoration 딜사이클 순서 수정 — 근거: digests/druid-restoration.md, events/druid-restoration-*.json
// 치유 전문화라 심크 APL(druid_restoration.simc)은 딜 위주(2026-03-15 수정)라 참고만 했다.
// 고친 것: 광역 흐름 맨 앞 피어나는 생명, 꽃피우기를 누르는 순서에서 조건부 끼워 넣기로, 쐐기 한 판 본문의 신속한 치유·급속 성장 순서.
// 그대로 둔 것: 레이드 오프닝(로그가 갈림 — 메모만 추가), 한 명 급락 순서, 숲의 수호자 오프닝(레이드 로그 없음).
const must = (cond, what) => { if (!cond) throw new Error('druid-restoration: 찾지 못함 — ' + what); };
const rep = (text, from, to) => { must(typeof text === 'string' && text.includes(from), from.slice(0, 40)); return text.replace(from, to); };

module.exports = {
  evidenceNote: '딜사이클 순서 대조(2026-10-20): 12.1.5 이후 WCL 상위 레이드 8개(야생추적자)·쐐기 10개(야생추적자 8·숲의 수호자 2)의 실제 시전 순서를 대조했습니다(치유 전문화라 심크 APL은 참고만). 쐐기 광역 풀 64개 중 48개가 처음 세 번 안에 피어나는 생명을 걸어 광역 흐름 맨 앞에 넣었고, 18개 기록 모두 꽃피우기를 직접 누르지 않아(견본 3개 모두 생명의 바느질 선택) 반복 흐름의 고정 단계에서 조건부 끼워 넣기로 옮겼습니다. 쐐기 풀에서 신속한 치유가 급속 성장보다 먼저인 경우가 61개 중 36개라 쐐기 한 판 본문을 같은 순서로 맞췄습니다. 레이드 오프닝은 로그가 갈려 순서를 바꾸지 않았습니다.',
  changelog: [
    '- 광역 치유 흐름 rail(2부)·영웅 탭 광역(야생추적자·숲의 수호자): 회복 → 신속한 치유 → 급속 성장 … 앞에 피어나는 생명(풀 시작 · 3중첩 확인)을 넣음 (근거: 쐐기 광역 풀 64개 중 48개가 처음 세 번 안에 피어나는 생명 — 야생추적자 53개 중 38개, 숲의 수호자 11개 중 10개. 예: https://www.warcraftlogs.com/reports/2c9yCJzXFmhHtM1W#fight=54&source=366 풀마다 피어나는 생명 → 회복 → 신속한 치유 → 급속 성장)',
    '- 꽃피우기: 한 명 치유 반복 rail·광역 rail의 고정 단계에서 빼고 피어나는 생명 위쪽 가지(꽃 밖에 모였을 때만)로 옮김. 영웅 탭 야생추적자 광역 7번 → 맨 끝(조건부)으로 (근거: 레이드 8개·쐐기 10개 모두 꽃피우기 직접 시전 0회, Efflorescence 이름의 다른 시전 번호도 없음. 특성 견본 3개 모두 생명의 바느질 — 피어나는 생명 대상 발밑에 꽃피우기가 저절로 자람)',
    '- 쐐기 한 판 장 본문·예시: "급속 성장을 쓰고 신속한 치유로" → "신속한 치유로 … 이어서 급속 성장" (근거: 쐐기 풀 61개 중 36개가 신속한 치유 먼저, 2부 광역 rail과 같은 순서)',
    '- 그대로 둔 것: 야생추적자 레이드 오프닝 순서(레이드 8개 중 신속한 치유 → 급속 성장 5개, 급속 성장 → 영혼 소집 5개 중 5개로 가이드와 같음. 회복 묶음과 재생·신속한 치유 중 무엇이 먼저인지는 4:2로 갈려 메모만 추가). 영혼 소집을 첫 25초 안에 쓴 5개 중 4개가 자연의 신속함-재생을 앞뒤에 붙였지만 전체 8개 중 4개라 메모로만 적음. 한 명 급락 순서·단일 위기 탭(위기 상황은 로그로 구분 불가), 숲의 수호자 오프닝(레이드 로그 0개)',
  ].join('\n'),
  apply(m) {
    const block = t => { const b = m.blocks.find(x => x.title.startsWith(t)); must(b, '장 ' + t); return b; };
    const railOf = (b, label) => { const r = b.timeline.rails.find(x => x.label.startsWith(label)); must(r, 'rail ' + label); return r; };
    const hero = label => { const h = m.heroBranches.find(x => x.label === label); must(h, '영웅 ' + label); return h; };
    const row = (list, id) => { const r = list.find(x => x.skillId === id); must(r, 'row ' + id); return r; };

    // 2부 첫 연습: 한 명 치유 반복 흐름 — 꽃피우기를 조건부 가지로
    const single = block('첫 연습: 한 명 치유와 딜 넣기 흐름');
    single.paragraphs[0] = rep(single.paragraphs[0],
      '풍요가 켜진 동안 다친 사람은 재생으로 채우고, 꽃피우기는 세 명 이상이 실제로 머무는 곳에 둡니다.',
      '풍요가 켜진 동안 다친 사람은 재생으로 채웁니다. 꽃피우기는 생명의 바느질로 피어나는 생명 대상 발밑에 자라니, 꽃 밖에 사람이 모였을 때만 다시 둡니다.');
    const loop = railOf(single, '반복 흐름 — 파티가 안정적일 때');
    must(loop.nodes.map(n => n.skillId).join(',') === '33763,18562,774,8936,145205,5176', '한 명 치유 반복 rail 원래 순서');
    loop.nodes = [
      {skillId: '33763', caption: '3중첩 · 4.5초 안 갱신', above: {skillId: '145205', when: '꽃 밖에 모였을 때만'}},
      loop.nodes[1],
      loop.nodes[2],
      loop.nodes[3],
      loop.nodes[5],
    ];
    loop.note = '천벌은 다음 피해 준비와 해제가 끝난 안전한 시간에만 씁니다. 번뜩임이 뜨면 강화된 무료 재생을 실제로 다친 대상에게 씁니다. 12.1.5 이후 WCL 상위 기록 18건(레이드 8·쐐기 10)은 꽃피우기를 한 번도 직접 누르지 않았습니다. 생명의 바느질로 피어나는 생명 대상 발밑에 꽃피우기가 자라기 때문이니, 꽃 밖에 사람이 모였을 때만 다시 둡니다.';

    // 2부 오프닝: 순서는 그대로, 로그마다 다른 점만 메모
    const opener = block('쿨기와 오프닝');
    const wsOpener = railOf(opener, '오프닝 — 야생추적자');
    wsOpener.note = '피어나는 생명은 공격대에서는 자신, 쐐기에서는 파티와 함께 서는 대상에 겁니다. 영혼 소집은 시전자 형태로 씁니다. 상위 레이드 기록 8개는 앞부분이 로그마다 달랐습니다. 절반은 풀 직후 재생과 신속한 치유를 먼저 쓰고 회복을 묶었고, 첫 25초 안에 영혼 소집을 쓴 5개 중 4개는 자연의 신속함-재생을 그 앞뒤에 붙였습니다.';

    // 2부 광역 치유 흐름: 맨 앞 피어나는 생명, 꽃피우기는 조건부
    const aoe = block('광역 치유 흐름');
    aoe.concept = rep(aoe.concept,
      '회복 5개와 신속한 치유가 돈 상태에서',
      '피어나는 생명을 확인하고, 회복 5개와 신속한 치유가 돈 상태에서');
    aoe.paragraphs[0] = rep(aoe.paragraphs[0],
      '여러 명이 다칠 피해가 보이면 4~6초 전에 회복 5개로 풍요를 켜고,',
      '먼저 피어나는 생명이 걸려 있는지 봅니다. 쐐기 상위 기록은 광역 풀 넷 중 셋에서 처음 세 번 안에 탱커에게 피어나는 생명을 걸었습니다. 여러 명이 다칠 피해가 보이면 4~6초 전에 회복 5개로 풍요를 켜고,');
    aoe.paragraphs[1] = rep(aoe.paragraphs[1],
      '꽃피우기는 세 명 이상이 실제로 머무는 곳에 두고 탱커가 이동하면 다시 둡니다.',
      '꽃피우기는 생명의 바느질을 골랐다면 피어나는 생명 대상 발밑에 저절로 자랍니다. 상위 기록 18건도 직접 누르지 않았으니 순서에 넣지 않고, 파티가 꽃 밖에 모여 있을 때만 다시 둡니다.');
    const aoeLoop = railOf(aoe, '반복 흐름 — 파티·공대 피해');
    must(aoeLoop.nodes.map(n => n.skillId).join(',') === '774,18562,48438,8936,8936,145205,774', '광역 rail 원래 순서');
    aoeLoop.nodes = [
      {skillId: '33763', caption: '풀 시작 · 3중첩 확인', above: {skillId: '145205', when: '꽃 밖에 모였을 때만'}},
      aoeLoop.nodes[0],
      aoeLoop.nodes[1],
      aoeLoop.nodes[2],
      aoeLoop.nodes[3],
      aoeLoop.nodes[4],
      aoeLoop.nodes[6],
    ];
    aoeLoop.note = '쐐기에서는 풀마다 피어나는 생명을 탱커에게 먼저 겁니다. 5개를 크게 넘기는 추가 회복은 곧 피해를 받을 대상이 분명할 때만 씁니다. 급락한 한 명과 해제는 별도로 처리합니다.';

    // 3부 쐐기 한 판: 신속한 치유 → 급속 성장
    const mplus = block('쐐기 한 판');
    mplus.paragraphs[0] = rep(mplus.paragraphs[0],
      '네임드 시전이 시작되면 급속 성장을 쓰고 신속한 치유로 즉시 회복과 상록숲 만개를 함께 얻습니다.',
      '네임드 시전이 시작되면 신속한 치유로 즉시 회복과 상록숲 만개를 얻고, 이어서 급속 성장을 씁니다.');
    must(mplus.example && mplus.example.text, '쐐기 한 판 예시');
    mplus.example.text = rep(mplus.example.text,
      '회복으로 풍요를 켜고 급속 성장과 신속한 치유로 받은 뒤',
      '회복으로 풍요를 켜고 신속한 치유와 급속 성장으로 받은 뒤');

    // 영웅 탭 광역
    const ws = hero('야생추적자');
    const wsList = ws.aoe.priority;
    must(wsList.map(r => r.skillId).join(',') === '774,18562,48438,391528,740,8936,145205,29166', '야생추적자 광역 원래 순서');
    const wsEff = row(wsList, '145205');
    ws.aoe.summary = '피어나는 생명을 먼저 확인하고, 회복 5개-풍요-재생과 피어나는 생명-신속한 치유-상록숲 만개를 유지한 채 급속 성장과 큰 치유 기술을 피해 구간에 얹습니다. 마나는 급속 성장 사용 시점에서 가장 크게 갈립니다.';
    ws.aoe.priority = [
      {skillId: '33763', label: '피어나는 생명 · 풀 시작', note: '쐐기 상위 기록은 광역 풀 넷 중 셋에서 처음 세 번 안에 피어나는 생명을 걸었습니다. 탱커처럼 파티와 함께 서는 대상에 3중첩을 유지하고, 공격대에서는 자신에게 둡니다.'},
      ...wsList.filter(r => r.skillId !== '145205'),
      {...wsEff, label: '꽃피우기 · 꽃 밖에 모였을 때', note: '상위 기록 18건은 직접 누르지 않았습니다. 생명의 바느질을 골랐다면 피어나는 생명 대상 발밑에 자라니, 세 명 이상이 꽃 밖에 모여 있을 때만 다시 둡니다.'},
    ];

    const kotg = hero('숲의 수호자');
    must(kotg.aoe.priority.map(r => r.skillId).join(',') === '774,18562,48438,391528,740,8936,29166', '숲의 수호자 광역 원래 순서');
    kotg.aoe.summary = '피어나는 생명 3중첩을 먼저 확인하고, 숲 수호자 발동을 피해 구간에 겹치는 것이 목표입니다. 발동 수보다 발동 시점이 중요하고, 급속 성장 마나가 이 분기의 가장 큰 제한입니다.';
    kotg.aoe.priority = [
      {skillId: '33763', label: '피어나는 생명 · 풀 시작', note: '숲의 수호자 쐐기 기록 2건도 광역 풀 11번 중 10번은 처음 세 번 안에 피어나는 생명을 걸었습니다. 3중첩이 있어야 다음 신속한 치유가 숲 수호자와 상록숲 만개를 함께 엽니다.'},
      ...kotg.aoe.priority,
    ];
    return m;
  },
};
