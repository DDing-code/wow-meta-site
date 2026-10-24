// priest-shadow 단일 딜사이클 스조라크 대조 — 근거: digests/priest-shadow.md, apl/priest_shadow.simc, sources/priest-shadow.txt
// 1) 집정관 오프닝: 고통 → 공허 연사 → 후광 을 고통 → 후광 → 공허 연사 로 (로그 7개 중 4개, 심크 우선순위 cds 의 halo 가 void_volley 위, Icy Veins·Method 모두 후광 → 연사)
// 2) 공허술사 오프닝: 마력 주입 → 광기 → 격류 를 마력 주입 → 격류 → 공허의 폭발 → 광기 로 (로그 10개 중 7개)
// 3) 단일 반복 rail: 흡혈의 손길 직접 시전 0회(촉수 격돌이 걸어 줌), 촉수 격돌 다음 공허 연사가 가장 많아 격돌 → 연사 → 광기 흐름으로
// 4) 프리풀 정신 분열: 전투 전·풀링 직전으로 표기(심크 우선순위 precombat mind_blast,if=set_bonus.mid2_4pc + Icy·Method 첫 정신 분열)
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const must = (cond, what) => { if (!cond) throw new Error('priest-shadow: 찾지 못함 — ' + what); };
const rep = (text, from, to) => { must(text.includes(from), from.slice(0, 40)); return text.replace(from, to); };
const ids = arr => arr.map(s => s.skillId).join(',');

module.exports = {
  evidenceNote: '단일 딜사이클 스조라크 대조(2026-10-24): 스조라크 신화(12.1.5) WCL 상위 로그 18개(집정관 8·공허술사 10)의 실제 시전 순서와 심크 우선순위(midnight 3af1a757)·Icy Veins·Method 프리풀을 대조해, 집정관 오프닝은 후광을 공허 연사 앞으로(후광이 있는 7개 중 4개, 심크 우선순위·Icy Veins·Method도 후광 먼저), 공허술사 오프닝은 마력 주입 뒤 공허의 격류 → 공허의 폭발 → 광기로(10개 중 7개가 격류를 광기보다 먼저) 고쳤습니다. 단일 반복 흐름은 흡혈의 손길 직접 시전이 18개 모두 0회라 촉수 격돌(손길 갱신) → 공허 연사 → 광기로 바꿨습니다(격돌 다음 공허 연사 집정관 65%·공허술사 48%). 첫 정신 분열은 심크 우선순위 precombat·Icy Veins·Method가 같아 풀링 직전 사전 시전으로 두었습니다.',
  changelog: [
    '- 집정관 오프닝(2부 오프닝 rail·영웅 탭): 정신 분열 → 촉수 격돌 → 고통 → 공허 연사 → 후광 → 형상 → 마력 주입 → 광기 를 정신 분열 → 촉수 격돌 → 고통 → 후광 → 공허 연사 → 형상 → 마력 주입 → 광기로 (근거: 스조라크 신화 상위 로그 8개 중 후광이 있는 7개에서 후광 먼저 4개·연사 먼저 3개. 예: https://www.warcraftlogs.com/reports/f7vhCg28Km3TrYcj#fight=37&source=6 . 심크 우선순위 cds 의 halo 가 main 의 void_volley 보다 먼저 확인됨, Icy Veins·Method 집정관 4세트 오프닝 Halo → Void Volley → Voidform)',
    '- 공허술사 오프닝(2부 오프닝 rail·영웅 탭): … 형상 → 마력 주입 → 광기 → 공허의 격류 를 … 형상 → 마력 주입 → 공허의 격류 → 공허의 폭발 → 광기로(영웅 탭은 오프닝 8단계 검사에 맞춰 공허의 폭발을 격류 단계 설명에 넣음) (근거: 상위 로그 10개 중 7개가 격류를 광기보다 먼저 쓰고 그중 6개가 격류 바로 뒤 공허의 폭발. 예: https://www.warcraftlogs.com/reports/z8xk37dcRABTH614#fight=15&source=17 . Icy Veins·Method·심크 우선순위는 형상 안 광기를 먼저 둬서 rail note 에 함께 적음)',
    '- 2부 단일 반복 rail(두 영웅 공통): 흡혈의 손길 → 광기 → 촉수 격돌{위 공허 연사} → 정신 분열 → 정신의 채찍 → … 를 촉수 격돌(손길 갱신) → 공허 연사 → 광기 → 정신의 채찍 → 정신 분열 → 광기 → 정신의 채찍으로 (근거: 반복 구간 흡혈의 손길 직접 시전 18개 모두 0회 — 촉수 격돌이 손길을 걺. 격돌 다음 공허 연사 집정관 65%·공허술사 48%, 연사 다음 광기 31%·27%, 광기 다음 정신의 채찍 34%·18%, 채찍 다음 정신 분열·광기, 분열 다음 광기·채찍. 심크 우선순위 main 의 tentacle_slam(손길 갱신)이 vampiric_touch 보다 위)',
    '- 같은 순서를 말하는 문장 맞춤: 오프닝 장 본문(집정관·공허술사 문단), 오프닝 rail note, 영웅 탭 오프닝 요약·단계 설명, 4부 공허술사 장 격류 준비 문장',
    '- 프리풀: 첫 정신 분열을 전투 전·풀링 직전으로 표기 (심크 우선순위 precombat mind_blast,if=set_bonus.mid2_4pc, Icy Veins "Pre-Cast Mind Blast", Method 4세트 오프닝 첫 단계 Mind Blast, 로그 15/18 이 0.1~0.6초에 정신 분열 적중)',
    '- 화면에 안 나오는 상단 opener 는 검사기(Default Shadow flow must match Archon)에 맞춰 집정관 영웅 탭 오프닝과 같게 맞춤',
    '- 그대로 둔 것: 영웅 탭 단일 우선순위(심크 우선순위 main 순서와 같음), 끼워 넣기 rail. 소실·신의 권능: 보호막은 생존·위협 관리라 넣지 않음. 원혼(Shadowy Apparition)은 자동 발동이라 순서 판단에서 뺌',
  ].join('\n'),
  apply(m) {
    const block = t => { const b = m.blocks.find(x => x.title.startsWith(t)); must(b, '장 ' + t); return b; };
    const hero = l => { const h = m.heroBranches.find(x => x.label === l); must(h, '영웅 ' + l); return h; };

    // ── 2부 단일 연습: 반복 흐름 ──
    const single = block('첫 연습은 단일 대상');
    const sRail = tlOf(single)[0].rails.find(r => r.label === '반복 흐름 — 단일 (두 영웅 공통)');
    must(sRail, '단일 반복 rail');
    sRail.nodes = [
      {skillId: '1227280', caption: '손길 갱신 · 충전 전', above: {skillId: '589', when: '깨어난 악몽이면 고통도'}},
      {skillId: '1242173', caption: '격돌 뒤 세트 연사'},
      {skillId: '335467', caption: '만료·넘침 전 소비', above: {skillId: '228260', when: '배정한 극딜 구간이면'}},
      {skillId: '15407', caption: '빈 시간 채우기', above: {skillId: '32379', when: '처형 조건이 맞으면'}},
      {skillId: '8092', caption: '충전을 묵히지 않기'},
      {skillId: '335467', caption: '다음 생성 전 소비'},
      {skillId: '15407', caption: '빈 시간'},
    ];
    sRail.note = '정해진 순서를 외우는 줄이 아닙니다. 위에서부터 조건을 확인하고 맞는 스킬 하나를 쓴 뒤 다시 판단합니다. 쓸 수 없는 스킬을 기다리며 멈추지 않습니다. 흡혈의 손길은 촉수 격돌이 걸어 주니, 격돌 충전이 없을 때만 직접 겁니다. 스조라크 신화 상위 로그 18개에서 흡혈의 손길 직접 시전은 없었고, 촉수 격돌 바로 다음에 공허 연사를 쓴 경우가 집정관 65%·공허술사 48%로 가장 많았습니다.';

    // ── 2부 오프닝 연습 ──
    const op = block('쿨기와 오프닝');
    must(op.paragraphs[1].startsWith('집정관은 촉수 격돌로 받은 세트 연사를'), '오프닝 둘째 문단');
    op.paragraphs[1] = '집정관은 고통 다음에 후광으로 강화 채찍을 얻기 시작하고, 촉수 격돌로 받은 세트 연사를 형상 직전에 처리해 형상 버튼을 비운 뒤 공허의 형상으로 들어갑니다. 공허술사는 후광 없이 세트 연사와 형상으로 넘어가고, 마력 주입 뒤 바로 공허의 격류로 혼돈의 균열을 엽니다. 균열 동안 공허의 폭발을 넣고 그다음 광기를 씁니다. 격류는 광기를 만드는 기술이라, 광기가 거의 가득 찼다면 광기로 먼저 한 번 비우고 격류를 엽니다.';
    const rails = tlOf(op)[0].rails;
    const ar = rails.find(r => r.label === '오프닝 — 집정관');
    const vr = rails.find(r => r.label === '오프닝 — 공허술사');
    must(ar && vr, '오프닝 rail');
    must(ids(ar.nodes) === '8092,1227280,589,1242173,120644,228260,10060,335467', '집정관 오프닝 노드 ' + ids(ar.nodes));
    ar.nodes = [
      {skillId: '8092', caption: '풀링 직전 시전'},
      {skillId: '1227280', caption: '교전 뒤 손길·세트'},
      {skillId: '589', caption: '깨어난 악몽이면'},
      {skillId: '120644', caption: '고통 뒤 후광'},
      {skillId: '1242173', caption: '형상 직전 세트 연사'},
      {skillId: '228260', caption: '극딜 진입'},
      {skillId: '10060', caption: '형상과 맞추기'},
      {skillId: '335467', caption: '이후 단일 우선순위'},
    ];
    ar.note = '불행이면 고통 칸을, 4세트가 없으면 공허 연사 칸을 건너뜁니다. 후광은 주변 비전투 몹을 끌어오지 않을 위치인지 보고 씁니다. 스조라크 신화 상위 로그 8개 중 후광을 쓴 7개에서 후광 먼저가 4개, 공허 연사 먼저가 3개라 둘의 앞뒤는 로그마다 다릅니다.';
    must(ids(vr.nodes) === '8092,1227280,589,1242173,228260,10060,335467,263165', '공허술사 오프닝 노드 ' + ids(vr.nodes));
    vr.nodes = [
      {skillId: '8092', caption: '풀링 직전 시전'},
      {skillId: '1227280', caption: '교전 뒤 손길·세트'},
      {skillId: '589', caption: '깨어난 악몽이면'},
      {skillId: '1242173', caption: '4세트 사용권 처리'},
      {skillId: '228260', caption: '연사 처리 뒤 진입'},
      {skillId: '10060', caption: '형상 구간'},
      {skillId: '263165', caption: '균열 열기'},
      {skillId: '450983', caption: '균열 중 분열 대신'},
      {skillId: '335467', caption: '이후 단일 우선순위'},
    ];
    vr.note = '후광 대신 공허의 격류로 혼돈의 균열을 여는 것이 집정관과 다른 점입니다. 형상에 들어간다고 균열이 저절로 생기지는 않습니다. 스조라크 신화 상위 로그 10개 중 7개가 마력 주입 뒤 광기보다 격류를 먼저 쓰고 공허의 폭발을 이었습니다. 공개 가이드와 심크 우선순위는 형상 안에서 광기를 먼저 두니, 광기가 거의 가득 찼다면 광기로 먼저 비웁니다.';

    // ── 4부 공허술사 장 ──
    const vw = block('쐐기는 공허술사');
    vw.paragraphs[0] = rep(vw.paragraphs[0],
      '주 대상 지속 피해와 광기를 먼저 준비하고 다음 생성량을 받을 여유를 만들어 두세요.',
      '주 대상 지속 피해를 먼저 걸고, 다음 생성량을 받을 광기 여유를 만들어 두세요.');

    // ── 영웅 탭: 집정관 ──
    const ah = hero('집정관');
    const as = ah.opener.steps;
    must(ids(as) === '8092,1227280,589,1242173,120644,228260,10060,335467', '집정관 영웅 오프닝 ' + ids(as));
    ah.opener.summary = '깨어난 악몽을 선택한 단일 예시입니다. 불행이면 고통 단계를 생략합니다. 고통 다음 후광, 형상 직전 세트 연사 순서이고, 4세트가 없으면 형상 전 연사를 생략합니다. 차트 끝에서는 단일 우선순위로 전환합니다. 전투 전에 어둠의 형상과 인내를 확인하세요.';
    ah.opener.steps = [
      {...as[0], phase: '전투 전', trigger: '풀링 직전'},
      as[1],
      as[2],
      {...as[4], phase: '형상 전', trigger: '교전·범위 확인', note: '고통 다음에 씁니다. 후광과 이어지는 추가 생성으로 강화 채찍을 얻기 시작합니다. 주변 비전투 몹을 끌어오지 않을 위치인지 확인합니다.'},
      {...as[3], phase: '형상 직전', note: '촉수 격돌로 받은 연사를 형상 직전에 처리해 형상 버튼을 비웁니다. 세트가 없으면 이 단계의 연사가 없으므로 생략합니다.'},
      as[5],
      as[6],
      as[7],
    ];

    // ── 영웅 탭: 공허술사 ──
    const vh = hero('공허술사');
    const vs = vh.opener.steps;
    must(ids(vs) === '8092,1227280,589,1242173,228260,10060,335467,263165', '공허술사 영웅 오프닝 ' + ids(vs));
    vh.opener.summary = '깨어난 악몽 단일 예시입니다. 불행이면 고통 직접 시전을 생략하고 4세트가 없으면 형상 전 연사를 생략합니다. 집정관의 후광 대신 마력 주입 뒤 격류로 균열을 열고, 공허의 폭발을 넣은 다음 광기를 쓰는 것이 핵심입니다.';
    vh.opener.steps = [
      {...vs[0], phase: '전투 전', trigger: '풀링 직전'},
      vs[1], vs[2], vs[3], vs[4], vs[5],
      {...vs[7], phase: '균열 시작', trigger: '형상·주입 직후', note: '격류로 혼돈의 균열을 엽니다. 이어서 균열 동안 정신 분열 자리에 나오는 공허의 폭발을 넣고 광기를 씁니다. 광기가 거의 가득 찼다면 광기로 먼저 한 번 비우고 엽니다. 암흑 마력 선택 시 움직이며 이어갈 수 있습니다.'},
      {...vs[6], phase: '균열 안', trigger: '공허의 폭발 뒤', note: '균열 안에서 공허의 폭발 다음에 주 대상에 광기를 적용하고 단일 우선순위로 넘어갑니다. 광기가 부족하면 생성기로 확보하며 무작정 기다리지 않습니다.'},
    ];
    // 화면에 안 나오는 예전 상단 opener 는 검사기(Default Shadow flow must match Archon)가 집정관 오프닝과 같기를 요구한다.
    m.opener = JSON.parse(JSON.stringify(ah.opener));
    return m;
  },
};
