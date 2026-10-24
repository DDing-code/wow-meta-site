// deathknight-frost 단일 딜사이클 스조라크 대조 — 근거: digests/deathknight-frost.md, apl/deathknight_frost.simc, sources/deathknight-frost.txt
// 죽음의 인도자만 고친다. 종말의 기수는 스조라크 12.1.5 상위 로그가 없어 그대로 둔다.
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const rep = (text, from, to) => { if (!text.includes(from)) throw new Error('바꿀 문장을 못 찾음: ' + from.slice(0, 30)); return text.replace(from, to); };

module.exports = {
  evidenceNote: '단일 딜사이클 스조라크 대조(2026-10-24): 스조라크 신화(12.1.5) WCL 상위 로그 8개(모두 죽음의 인도자)의 실제 시전 순서와 심크 우선순위(midnight 3af1a757)·Icy Veins·Method 오프닝을 대조해, 죽음의 인도자 오프닝에서 얼음 기둥과 신드라고사의 숨결 사이의 절멸을 빼고(8개 모두 사이에 절멸 없음, 심크 우선순위 breath_of_sindragosa,use_off_gcd=1,if=buff.pillar_of_frost.up), 첫 서리고룡의 격노를 숨결 뒤 첫 절멸 다음으로 옮겼습니다(8개 중 5개). 단일 반복 흐름은 로그와 맞아 그대로 두었고, 프리풀은 심크 우선순위·공개 가이드 모두 룬 무기 강화로 시작해 넣을 것이 없었습니다. 종말의 기수는 로그가 없어 바꾸지 않았습니다.',
  changelog: [
    '- 죽음의 인도자 오프닝(연습 장 타임라인·영웅 탭): 룬 무기 강화 → 사신의 징표 → 얼음 기둥 → 절멸 → 신드라고사의 숨결 → 서리고룡의 격노 → 절멸 → … → 룬 무기 강화 → 사신의 징표 → 얼음 기둥 → 신드라고사의 숨결 → 절멸 → 서리고룡의 격노 → 절멸 → 룬 무기 강화 → 절멸 → 서리고룡의 격노 (근거: 스조라크 신화 상위 로그 8개 모두 기둥·징표·숨결을 한꺼번에 쓰고 그 사이에 절멸 없음, 8개 중 5개가 숨결 뒤 첫 절멸 다음 첫 서리고룡. 심크 우선순위 cooldowns 의 breath_of_sindragosa(use_off_gcd, pillar_of_frost.up), frostwyrms_fury(… buff.bonegrinder_frost.up). 룬 마력이 모자랄 때의 준비 절멸은 Icy Veins 오프닝처럼 기둥 앞에 둔다)',
    '- 연습 장 본문·요점, 단일 연습 장 우선순위 문장, 영웅 탭 단일 서리고룡 설명을 같은 순서로 맞춤. 오프닝 회수 근거를 스조라크 로그(8개 모두 첫 서리고룡 뒤 6초 안 회수)로 바꿈',
    '- 단일 반복: 절멸 → 냉기의 일격 → 울부짖는 한파 흐름이 로그 이웃 쌍 70~90%로 맞아 그대로. 몰살은 절멸에서 자동으로 나가는 시전이라 버튼으로 넣지 않음',
    '- 프리풀: 심크 우선순위 precombat 은 준비 항목뿐이고 Icy Veins 오프닝은 룬 무기 강화로 시작, 로그 음수 초 시전 0/8 → 추가 없음',
    '- 종말의 기수: 스조라크 상위 로그 0개라 바꾸지 않음',
  ].join('\n'),
  apply(m) {
    const block = t => m.blocks.find(b => b.title.startsWith(t));

    // 2부 단일 연습: 우선순위 문장
    const single = block('첫 연습: 단일 대상');
    single.paragraphs[0] = rep(single.paragraphs[0],
      '신드라고사의 숨결 → 서리고룡의 격노 → 절멸(도살기·몰살) → 울부짖는 한파(단단한 얼음)',
      '신드라고사의 숨결 → 절멸(도살기·몰살) → 서리고룡의 격노(기둥 중 절멸 뒤) → 울부짖는 한파(단단한 얼음)'
    );

    // 2부 오프닝 연습
    const opener = block('쿨기와 오프닝');
    opener.paragraphs[0] = rep(opener.paragraphs[0],
      '숨결 비용 60이 모자라면 얼음 기둥을 켠 뒤 절멸 한 번으로 맞추고 바로 숨결을 시작합니다.',
      '숨결 비용 60이 모자라면 얼음 기둥을 켜기 전에 절멸 한 번으로 맞춥니다. 기둥을 켠 뒤에는 절멸 없이 바로 숨결을 시작합니다.'
    );
    opener.paragraphs[1] = rep(opener.paragraphs[1],
      '이어서 얼음 기둥, 신드라고사의 숨결, 서리고룡의 격노를 같은 공격 구간에 엽니다.',
      '이어서 얼음 기둥과 신드라고사의 숨결을 함께 열고, 절멸 한 번 뒤 서리고룡의 격노를 보냅니다.'
    );
    opener.paragraphs[2] = rep(opener.paragraphs[2],
      '12.1.5 이후 상위 레이드 기록은 첫 서리고룡 뒤 절멸 → 룬 무기 강화 → 절멸을 쓰고, 대개 몇 초 뒤 같은 기둥 안에서 서리고룡을 회수했습니다.',
      '스조라크 신화 상위 로그 8개는 모두 얼음 기둥·사신의 징표·숨결을 한꺼번에 쓰고 그 사이에 절멸을 넣지 않았습니다. 5개는 숨결 뒤 첫 절멸 다음에 첫 서리고룡을 썼고, 이어 절멸과 룬 무기 강화로 도살기를 쓰다가 8개 모두 6초 안에 같은 기둥 안에서 서리고룡을 회수했습니다.'
    );
    opener.bullets[0] = rep(opener.bullets[0],
      '처음 자원이 없을 때: 룬 무기 강화 → (징표 → 기둥) → 절멸로 룬 마력 60 확인.',
      '처음 자원이 없을 때: 룬 무기 강화 → (모자라면 절멸로 룬 마력 60 확인) → 징표 → 기둥과 숨결.'
    );
    const rails = tlOf(opener)[0].rails;
    const dbRail = rails.find(r => r.label.startsWith('오프닝 — 죽음의 인도자 · 숨결'));
    dbRail.nodes = [
      {skillId: '47568', caption: '충전·도살기 확인'},
      {skillId: '439843', caption: '기둥 직전 징표'},
      {skillId: '51271', caption: '극딜 시작'},
      {skillId: '1249658', caption: '기둥과 함께 · 전방'},
      {skillId: '49020', caption: '숨결 켜지면 바로'},
      {skillId: '279302', caption: '첫 절멸 뒤'},
      {skillId: '49020', caption: '몰살·도살기 소비'},
      {skillId: '47568', caption: '두 번째 충전'},
      {skillId: '49020', caption: '도살기 바로 소비'},
      {skillId: '279302', caption: '같은 기둥 회수'},
    ];
    dbRail.note = '사신의 징표에는 룬 2가 필요하니 준비 중에 룬을 모두 쓰지 않습니다. 숨결 비용 60이 모자라면 기둥 전에 절멸 한 번으로 맞춥니다. 스조라크 신화 상위 로그 8개 모두 기둥과 숨결 사이에 절멸을 넣지 않았고, 5개는 첫 절멸 다음에 서리고룡의 격노를 썼습니다. 회수 뒤에는 단일 반복 흐름으로 돌아가 냉기의 일격과 울부짖는 한파를 이어 씁니다.';

    // 영웅 특성 탭 — 죽음의 인도자
    const hero = m.heroBranches.find(h => h.label === '죽음의 인도자');
    hero.opener.summary = '룬 무기 강화로 준비하고 사신의 징표를 기둥 직전에 붙인 뒤 얼음 기둥과 신드라고사의 숨결을 함께 엽니다. 절멸 한 번 뒤 서리고룡의 격노를 보내고, 절멸 → 룬 무기 강화 → 절멸로 몰살과 도살기를 쓴 다음 같은 기둥 안에서 서리고룡을 회수합니다. 냉기파멸을 고른 숨결 없는 광역 변형은 본문 오프닝 차트에 따로 있습니다.';
    const s = hero.opener.steps;
    const [erw, mark, pillar, , breath, fwf1, obl2, erw2, obl3, fwf2] = s;
    if (!fwf2 || breath.skillId !== '1249658' || fwf1.skillId !== '279302') throw new Error('죽음의 인도자 오프닝 단계 구조가 다름');
    hero.opener.steps = [
      erw,
      mark,
      pillar,
      {...breath, note: '얼음 기둥과 거의 함께 시작합니다. 룬 마력 60으로 시작하고 룬 무기 강화 1충전을 돌려받습니다. 룬 마력이 모자라면 기둥 전에 절멸 한 번으로 맞춥니다.', trigger: '기둥 직후 · 룬 마력 60 · 전방 적중'},
      {skillId: '49020', label: '절멸', note: '숨결이 켜지면 바로 도살기를 절멸로 씁니다. 도살기 소비는 숨결도 늘립니다.', phase: '도살기 소비', trigger: '숨결 시작 직후 · 도살기'},
      {...fwf1, note: '첫 절멸 다음에 첫 서리고룡을 보냅니다. 스조라크 신화 상위 로그 8개 중 5개가 이 자리였습니다. 서리고룡족의 선택을 골랐다면 12초 가속도 이때 시작합니다.'},
      obl2,
      erw2,
      obl3,
      fwf2,
    ];
    const fwfP = hero.singleTarget.priority.find(p => p.skillId === '279302');
    fwfP.note = rep(fwfP.note, '첫 사용은 숨결 직후,', '첫 사용은 숨결 뒤 절멸 한 번 다음,');
    return m;
  },
};
