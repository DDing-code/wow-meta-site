// priest-shadow 딜사이클 순서 수정 — 근거: digests/priest-shadow.md, apl/priest_shadow.simc
// 1) 집정관 단일 오프닝: 촉수 격돌로 받은 세트 공허 연사를 후광보다 먼저 쓴다(레이드 로그 8개 중 7개).
//    검사기가 상단 opener 와 집정관 opener 가 같기를 요구하므로 상단 opener 도 같은 값으로 맞춘다.
// 2) 공허술사 광역: 깨어난 악몽이면 고통을 여러 적에게 직접 건다(쐐기 로그 6개 중 4개, APL invoked_nightmare 줄).
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const rep = (text, from, to) => { if (!text.includes(from)) throw new Error('바꿀 문장을 못 찾음: ' + from.slice(0, 30)); return text.replace(from, to); };
const clone = x => JSON.parse(JSON.stringify(x));

module.exports = {
  evidenceNote: '딜사이클 순서 대조(2026-10-20): 12.1.5 이후 WCL 상위 레이드 9개(집정관 8·공허술사 1)·쐐기 14개(집정관 8·공허술사 6)의 실제 시전 순서와 심크 APL(midnight d91a5707)을 대조해 집정관 단일 오프닝에서 촉수 격돌로 받은 세트 공허 연사를 후광보다 먼저 쓰도록 고치고, 공허술사 광역에 깨어난 악몽일 때의 고통 직접 적용을 더했습니다. 단일 반복 흐름과 공허술사 오프닝은 로그와 크게 어긋나지 않거나 로그가 1개뿐이라 그대로 두었습니다.',
  changelog: [
    '- 집정관 단일 오프닝: 정신 분열 → 촉수 격돌 → 고통 → 후광 → 세트 공허 연사 → 공허의 형상 → 마력 주입 → 광기 를 정신 분열 → 촉수 격돌 → 고통 → 세트 공허 연사 → 후광 → 공허의 형상 → 마력 주입 → 광기 로 바꿈 (근거: 레이드 로그 8개 중 7개가 후광보다 먼저 연사를 씀(촉수 격돌 뒤 2~4번째 시전), 후광과 형상을 오프닝에 쓴 6개 중 5개가 연사 → 후광 → 형상. 예: https://www.warcraftlogs.com/reports/fpmhYJX9gTtVDx4Z#fight=10&source=7). 영웅 탭·2부 오프닝 타임라인·본문, 검사기가 같기를 요구하는 상단 opener 를 함께 맞춤.',
    '- 집정관 광역 시작 줄 note: 쐐기 풀에서 후광과 4세트 연사의 앞뒤가 로그마다 다르다고 적음 (쐐기 로그 8개의 큰 풀 21개에서 후광 먼저 10개·연사 먼저 11개로 갈림, 순서는 그대로).',
    '- 공허술사 광역: 우선순위 3번째에 "깨어난 악몽이면 고통"을 넣고, 2부 광역 시작 줄의 손길 위에 같은 조건 가지를 둠 (근거: 쐐기 로그 6개 중 4개가 풀 시작에 고통을 여러 적에게 직접 걸어 분당 4.7~6.3회. APL main 의 shadow_word_pain,if=talent.invoked_nightmare&refreshable&target.time_to_die>12).',
  ].join('\n'),
  apply(m) {
    // 1. 집정관 오프닝: 세트 연사 → 후광
    const arch = m.heroBranches.find(h => h.label === '집정관');
    const by = id => { const s = arch.opener.steps.find(x => x.skillId === id); if (!s) throw new Error('집정관 오프닝에 ' + id + ' 없음'); return clone(s); };
    const volley = by('1242173');
    volley.phase = '격돌 직후';
    volley.note = '촉수 격돌로 받은 연사를 바로 처리해 형상 버튼을 비웁니다. 세트가 없으면 이 단계의 연사가 없으므로 생략합니다.';
    const halo = by('120644');
    halo.phase = '형상 직전';
    halo.note = '세트 연사로 형상 버튼을 비운 뒤 형상 바로 앞에 씁니다. 후광과 이어지는 추가 생성으로 강화 채찍을 얻기 시작합니다. 주변 비전투 몹을 끌어오지 않을 위치인지 확인합니다.';
    arch.opener.steps = [by('8092'), by('1227280'), by('589'), volley, halo, by('228260'), by('10060'), by('335467')];
    m.opener = clone(arch.opener);

    const drillOpener = m.blocks.find(b => b.title.startsWith('쿨기와 오프닝'));
    const archRail = tlOf(drillOpener)[0].rails.find(r => r.label === '오프닝 — 집정관');
    archRail.nodes = [
      {skillId: '8092', caption: '풀 시각에 적중'},
      {skillId: '1227280', caption: '교전 뒤 손길·세트'},
      {skillId: '589', caption: '깨어난 악몽이면'},
      {skillId: '1242173', caption: '격돌 뒤 세트 연사'},
      {skillId: '120644', caption: '형상 직전 후광'},
      {skillId: '228260', caption: '극딜 진입'},
      {skillId: '10060', caption: '형상과 맞추기'},
      {skillId: '335467', caption: '이후 단일 우선순위'},
    ];
    drillOpener.paragraphs[1] = rep(drillOpener.paragraphs[1],
      '집정관은 후광을 써서 강화 채찍을 얻기 시작한 뒤, 세트 연사를 처리해 형상 버튼을 비우고 공허의 형상으로 들어갑니다.',
      '집정관은 촉수 격돌로 받은 세트 연사를 바로 처리해 형상 버튼을 비우고, 후광으로 강화 채찍을 얻기 시작한 뒤 공허의 형상으로 들어갑니다.');

    // 2. 공허술사 광역: 깨어난 악몽이면 고통
    const vw = m.heroBranches.find(h => h.label === '공허술사');
    const rows = vw.aoe.priority.filter(r => r.skillId !== '589');
    const at = rows.findIndex(r => r.skillId === '34914');
    if (at < 0) throw new Error('공허술사 광역에 손길 없음');
    rows.splice(at + 1, 0, {
      skillId: '589',
      label: '깨어난 악몽이면 고통',
      note: '깨어난 악몽을 골랐다면 손길이 걸린, 12초 넘게 살 적에게 고통을 하나씩 직접 겁니다. 불행이면 손길과 함께 걸리니 이 줄은 건너뜁니다.',
    });
    vw.aoe.priority = rows;
    vw.aoe.summary = rep(vw.aoe.summary,
      '형상·주입 → 광기 → 격류로 시작합니다. ',
      '형상·주입 → 광기 → 격류로 시작합니다. 깨어난 악몽이면 격돌 앞뒤로 오래 살 적에게 고통을 직접 겁니다. ');

    const drillAoe = m.blocks.find(b => b.title.startsWith('광역은 손길을 펼친 뒤'));
    const archAoeRail = tlOf(drillAoe)[0].rails.find(r => r.label === '광역 시작 — 집정관');
    archAoeRail.note = rep(archAoeRail.note,
      '불행이면 손길로 고통도 같이 걸리니 대상마다 고통을 따로 쓰지 않습니다.',
      '불행이면 손길로 고통도 같이 걸리니 대상마다 고통을 따로 쓰지 않습니다. 쐐기 풀에서는 후광과 4세트 연사의 앞뒤가 로그마다 다릅니다. 둘 다 형상 전에 끝내면 됩니다.');
    const vwRail = tlOf(drillAoe)[0].rails.find(r => r.label === '광역 시작 — 공허술사');
    if (vwRail.nodes[0].skillId !== '34914') throw new Error('공허술사 광역 시작 첫 칸이 손길이 아님');
    vwRail.nodes[0] = {...vwRail.nodes[0], above: {skillId: '589', when: '깨어난 악몽이면 고통'}};
    drillAoe.paragraphs[0] = rep(drillAoe.paragraphs[0],
      '몹이 모이면 촉수 격돌로 손길을 넓히고, 집정관은 교전이 시작된 뒤 후광을 씁니다.',
      '몹이 모이면 촉수 격돌로 손길을 넓히고, 집정관은 교전이 시작된 뒤 후광을 씁니다. 깨어난 악몽을 골랐다면 손길을 펼친 뒤 오래 살 적에게 고통을 하나씩 직접 겁니다. 불행이면 손길과 함께 걸리니 따로 쓰지 않습니다.');
    return m;
  },
};
