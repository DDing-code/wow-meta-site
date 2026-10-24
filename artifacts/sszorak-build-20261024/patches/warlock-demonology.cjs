// warlock-demonology 단일 딜사이클 스조라크 빌드 기준 — 근거: bd/warlock-demonology.md, ../sszorak-cycle-20261024/digests/warlock-demonology.md, ../sszorak-cycle-20261024/apl/warlock_demonology.simc, ../sszorak-cycle-20261024/sources/warlock-demonology.txt
// 기준 영웅 특성: 악마학자(스조라크 상위 ALL 200행·KR 100행 모두). 기본 탭은 이미 악마학자, 단일 견본은 apply-patch 자동.
// 1) 악마학자 오프닝: 순서는 로그 과반과 같다(사전 악마 화살 → 공포사냥개 → 흑마법서 → 어둠의 화살 → 폭군 → 굴단의 손 ×2 → 어둠의 화살 → 파열).
//    폭군 뒤 굴단의 손 두 칸을 ×2 한 칸으로(9개 중 8개). 파열 뒤에 로그 9개 모두 있던 어둠의 화살을 ×2~4(9개 중 8개)로 넣고, 마지막 굴단의 손에 ×2(9개 중 6개).
//    사전 악마 화살은 전투 전·풀링 4초 전(심크 precombat demonbolt(ruination&!summon_doomguard), Icy Veins Pre-cast Demonbolt, Method 1x Demonbolt, 기본 4.5초 시전, 로그 4/9).
//    오프닝 장 rail·비교 카드·요점·실수 순서를 악마학자 먼저로.
// 2) 단일 반복: 공통 rail 이 로그(굴단의 손 → 악마 화살 41%, 악마 화살 → 굴단의 손 62%)·심크 diabolist 와 맞아 그대로. 이어서 누른 횟수 중앙값 모두 1 → count 없음.
// 3) 글: 영웅 탭 summary(님리사·쐐기·스조라크 행 수), 3부 악마학자 장 한 줄 원리·곁글, 공격대 장 한 줄 원리, 4부 영혼 수확자 장 한 줄 원리.
const pick = (rows, skillId, nth = 0) => {
  const hit = rows.filter(r => r.skillId === skillId)[nth];
  if (!hit) throw new Error(`행을 못 찾음: ${skillId} #${nth}`);
  return {...hit};
};

module.exports = {
  evidenceNote: '단일 딜사이클 스조라크 빌드 기준(2026-10-24): 스조라크 신화(12.1.5) 상위 랭킹 영웅 특성(전체 200행·한국 100행 모두 악마학자)과 악마학자 로그 9개의 실제 순서·반복 횟수로 오프닝을 다시 확인하고 단일 견본을 스조라크 악마학자 대표 빌드로 바꿨습니다. 오프닝 순서는 로그 과반과 같아 그대로 두고, 폭군 뒤 굴단의 손을 ×2(9개 중 8개)로 묶었으며, 파열 뒤 로그 9개 모두에 있던 어둠의 화살을 ×2~4(9개 중 8개)로 넣고 그 뒤 굴단의 손을 ×2(9개 중 6개)로 표시했습니다. 사전 악마 화살은 심크 우선순위 전투 전 목록·Icy Veins·Method가 같아 전투 전·풀링 4초 전으로 적었습니다. 단일 반복은 로그·심크 우선순위와 맞아 바꾸지 않았고, 이어서 누른 횟수는 모두 중앙값 1이라 달지 않았습니다. 영혼 수확자는 스조라크·님리사·쐐기 상위 기록에 한 행도 없습니다(10월 20일 집계).',
  buildNote: '파열과 흑마법서: 임프 군주를 고르고, 악마의 부름 2점으로 공포사냥개가 무료 즉시 시전인 빌드입니다.',
  changelog: [
    '- 악마학자 오프닝(오프닝 장 타임라인·영웅 탭): 폭군 뒤 굴단의 손 두 칸 → ×2 한 칸(로그 9개 중 8개), 파열 뒤 어둠의 화살 ×2~4 칸 추가(9개 모두 파열 다음 어둠의 화살, 8개가 2~4번), 마지막 굴단의 손 ×2(9개 중 6개). 예 https://www.warcraftlogs.com/reports/4T1z8LyRKPq3HdBt#fight=22&source=23',
    '- 프리풀: 사전 악마 화살을 전투 전·풀링 4초 전으로 표기 (심크 우선순위 precombat `demonbolt,if=!buff.power_siphon.up&(talent.ruination&!talent.grimoire_imp_lord|talent.ruination&!talent.summon_doomguard)` — 단일 견본은 파멸수호병 없음, Icy Veins "Pre-cast Demonbolt", Method "Pre cast 2x Shadow Bolt / 1x Demonbolt", 기본 4.5초 시전, 로그 4/9 악마 화살·2/9 어둠의 화살로 시작)',
    '- 오프닝 장 rail·비교 카드·요점·실수를 악마학자 먼저로, 한 줄 원리·본문을 스조라크 순서(폭군 뒤·파열 뒤 굴단의 손 두 번)로',
    '- 단일 반복: 그대로(분당 굴단의 손 15.8·악마 화살 11.6·어둠의 화살 8.2·파열 3.3·공포사냥개 2.6·황폐 1.8·지옥불 화살 1.7, 이어서 누른 횟수 중앙값 모두 1)',
    '- 글: 영웅 탭 두 summary("이번 한국 검수" 문장 → 스조라크·님리사·쐐기 행 수), 악마학자 단일 우선순위 summary 에 단일 견본 선택, 3부 악마학자 장 한 줄 원리·곁글, 공격대 장 한 줄 원리(순수 단일이면 영혼 수확자처럼 읽히던 문장), 4부 영혼 수확자 장 한 줄 원리',
    '- 그대로 둔 것: 영혼 수확자 오프닝·단일(상위 기록 0행), 광역 장·광역 탭, 쐐기 장',
  ].join('\n'),
  apply(m) {
    const block = t => {
      const b = m.blocks.find(x => x.title.startsWith(t));
      if (!b) throw new Error('장을 못 찾음: ' + t);
      return b;
    };
    const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
    const sh = m.heroBranches.find(h => h.label === '영혼 수확자');
    const di = m.heroBranches.find(h => h.label === '악마학자');

    // ── 영웅 탭: 악마학자(기준) ──
    di.summary = '스조라크 같은 단일 네임드와 레이드·쐐기 모두의 기준 영웅 특성입니다. 스조라크 신화(12.1.5) 상위 200행과 한국 상위 100행이 모두 악마학자였고, 10월 20일 집계의 님리사·쐐기 상위 기록도 모두 악마학자였습니다. 악마의 의식을 끝내고 악마술을 굴단의 손으로 소비해야 큰 악마와 후속 강화 주문이 이어집니다. 폭군 전 5조각을 준비하는 흐름과 지옥불 화살의 3조각 생성, 무료 황폐를 구분합니다. Icy Veins 12.1.5판은 순수 단일에서 영혼 수확자를 약 3% 높게 보지만, 상위 기록에는 영혼 수확자가 없습니다.';
    {
      const o = di.opener.steps;
      if (o.length !== 10 || o[5].skillId !== '105174' || o[6].skillId !== '105174' || o[8].skillId !== '196277') throw new Error('악마학자 오프닝 모양이 예상과 다름');
      const dbolt = {...o[0], phase: '전투 전', trigger: '풀링 4초 전', note: '기본 4.5초 시전이라 풀링 4초쯤 전에 시작해 전투 시작에 맞춰 적중시킵니다. 스조라크 상위 로그 9개 중 4개가 이렇게 시작했고 2개는 어둠의 화살로 시작했습니다. 전투가 이미 시작됐고 핵이 없다면 긴 악마 화살 대신 어둠의 화살로 조각을 생성합니다.'};
      const hog1 = {...o[5], count: 2, note: '3개를 소비하고 마지막 아르거스 노드로 1개를 돌려받습니다. 5개에서 시작했다면 3개가 남으므로 바로 한 번 더 이어 씁니다. 스조라크 상위 로그 9개 중 8개가 폭군 뒤 굴단의 손을 두 번 이어 썼습니다.'};
      const sb2 = {...o[7], note: '두 번째 굴단의 손 뒤 남은 조각을 채웁니다. 스조라크 상위 로그 9개 중 5개가 여기서 한 번 썼고, 3개는 바로 파열로 넘어갔습니다. 핵이 있으면 악마 화살을 쓰고, 지옥불 화살은 2개 이하에서 3개를 받는 별도 조건을 봅니다.'};
      const sb3 = {
        skillId: '686',
        label: '어둠의 화살',
        count: '2~4',
        phase: '조각 보충',
        trigger: '파열 뒤·다음 3조각까지',
        note: '파열 뒤에는 다음 굴단의 손을 위해 조각을 채웁니다. 스조라크 상위 로그 9개 모두 파열 다음에 어둠의 화살을 썼고, 8개가 두 번에서 네 번 이어 썼습니다. 핵이 있으면 악마 화살로 대신합니다.',
      };
      const hog3 = {...o[9], count: 2, note: '3조각을 다시 채운 뒤 씁니다. 스조라크 상위 로그 9개 중 6개가 여기서도 굴단의 손을 두 번 이어 썼습니다. 폭군이 끝났더라도 중간 노드 2점의 차원문은 25초이므로 남은 구간을 버리지 않습니다. 이후는 단일 우선순위로 돌아갑니다.'};
      di.opener.steps = [dbolt, o[1], o[2], o[3], o[4], hog1, sb2, o[8], sb3, hog3];
      di.opener.summary = '파열·지옥으로부터의 귀환·아르거스의 지배자와 임프 군주를 선택한 단일 시작입니다. 지옥수호병은 전투 전에 소환합니다. 스조라크 신화 상위 로그 9개처럼 공포사냥개를 먼저 부르고 흑마법서를 쓴 뒤 5조각에서 폭군을 엽니다. 폭군 뒤와 파열 뒤에 굴단의 손을 두 번씩 이어 쓰고, 그 사이를 어둠의 화살로 채웁니다. 단일 견본은 악마의 부름 2점이라 공포사냥개가 무료 즉시 시전입니다. 마력 착취 빌드는 이 흐름과 별개입니다.';
      di.singleTarget.summary = '순서를 고정 반복하지 않고 위에서부터 현재 조건을 확인합니다. 기본은 파열 빌드이며, 스조라크 단일 견본은 파멸수호병과 파멸을 고르지 않았으니 그 줄은 고른 경우에만 봅니다. 생존, 기믹, 조각·핵 상한과 발동 만료는 항상 함께 봅니다.';
    }

    // ── 영웅 탭: 영혼 수확자(기준 아님) — summary 만 ──
    sh.summary = 'Icy Veins 12.1.5판이 순수 단일에서 약 3% 높게 보는 선택지의 학습 예시입니다. 죽음의 그림자로 폭군 사용 시 조각 3개를 얻으므로, 악마학자와 반대로 먼저 자리를 비웁니다. 탐스러운 영혼 소비는 악마의 영혼과 영혼 파문으로 이어집니다. 다만 10월 20일 집계의 스조라크 상위 200행, 님리사 상위 99행, 쐐기 상위 36행에 영혼 수확자는 한 행도 없어, 아래 순서는 실전 로그로 확인하지 못한 예시입니다.';

    // ── 2부 오프닝 장 ──
    {
      const b = block('쿨기와 오프닝');
      b.concept = '악마학자 오프닝은 사전 악마 화살 → 공포사냥개 → 흑마법서로 시작해 5조각에서 폭군을 엽니다. 영혼 수확자는 폭군 전 2조각 이하를 만듭니다.';
      b.paragraphs = ['스조라크 신화 상위 악마학자 로그 9개 모두 공포사냥개를 먼저 불렀고, 8개가 폭군 뒤 굴단의 손을 두 번 이어 썼습니다. 파열 뒤에는 9개 모두 어둠의 화살로 조각을 채웠습니다. 조건이 안 된 단계는 건너뜁니다.'];
      b.bullets = [
        '사전 악마 화살 뒤 공포사냥개 → 흑마법서 순서입니다.',
        '악마학자는 공포사냥개가 살아 있을 때 5조각으로 폭군을 엽니다.',
        '폭군 뒤와 파열 뒤에 굴단의 손을 두 번씩 이어 씁니다.',
        '영혼 수확자는 폭군 전 2조각 이하를 만듭니다.',
      ];
      b.mistakes = [b.mistakes[1], b.mistakes[0]];
      const cards = b.cards;
      const same = cards.items.find(x => x.label === '같은 시작');
      const shCard = cards.items.find(x => x.label.startsWith('영혼 수확자'));
      const diCard = cards.items.find(x => x.label.startsWith('악마학자'));
      if (!same || !shCard || !diCard) throw new Error('오프닝 카드 모양이 예상과 다름');
      b.cards = {...cards, items: [same, diCard, shCard]};
      const t = tlOf(b)[0];
      const shRail = t.rails.find(r => r.label.includes('영혼 수확자'));
      const diRail = t.rails.find(r => r.label.includes('악마학자'));
      if (!shRail || !diRail) throw new Error('오프닝 rail 을 못 찾음');
      const diNew = {
        ...diRail,
        nodes: [
          {skillId: '264178', caption: '전투 전 · 풀링 4초 전'},
          {skillId: '104316', caption: '먼저 · 공포사냥개 2마리'},
          {skillId: '1276452', caption: '이어서 · 조각 1개'},
          {skillId: '686', caption: '5조각까지 · 사냥개 생존'},
          {skillId: '265187', caption: '5조각 · 극딜 시작'},
          {skillId: '105174', count: 2, caption: '3개 쓰고 1개 반환'},
          {skillId: '686', caption: '남은 조각 보충'},
          {skillId: '196277', caption: '임프 모이면 바로'},
          {skillId: '686', count: '2~4', caption: '다음 3조각까지'},
          {skillId: '105174', count: 2, caption: '차원문 중 다시'},
        ],
        note: '지옥수호병은 전투 전에 부릅니다. 스조라크 상위 로그 9개 모두 공포사냥개를 먼저 불렀고, 8개가 폭군 뒤 굴단의 손을 두 번 이어 썼습니다. 파열 뒤 어둠의 화살은 9개 중 8개가 두 번에서 네 번, 그 뒤 굴단의 손은 6개가 두 번이었습니다. 이미 5조각이면 폭군 전 어둠의 화살은 건너뛰고, 준비가 길어져 공포사냥개가 사라지지 않게 합니다.',
      };
      t.rails = [diNew, shRail];
    }

    // ── 3부 악마학자 장 ──
    {
      const b = block('악마학자');
      b.concept = b.concept.replace('레이드·쐐기 모두 악마학자가 기본입니다.', '단일 네임드·레이드·쐐기 모두 악마학자가 기본입니다.');
      if (!b.concept.startsWith('단일 네임드')) throw new Error('악마학자 장 한 줄 원리를 못 바꿈');
      b.aside = {...b.aside, text: '12.1.5 이후 신화 스조라크 상위 200행, 님리사 99행, 쐐기 36행이 모두 악마학자였고 Wowhead 10월 13일판도 같습니다. Icy Veins는 순수 단일만 영혼 수확자를 약 3% 높게 봅니다. 랭킹 행 수가 몇 % 강하다는 뜻은 아닙니다.'};
    }

    // ── 3부 공격대 네임드 장 ──
    {
      const b = block('공격대 네임드');
      const from = '영웅 특성은 순수 단일인지, 추가 대상이 있는지로 고릅니다.';
      if (!b.concept.includes(from)) throw new Error('공격대 장 한 줄 원리를 못 찾음');
      b.concept = b.concept.replace(from, '단일 네임드도 악마학자가 기준입니다.');
    }

    // ── 4부 영혼 수확자 장 ──
    {
      const b = block('영혼 수확자');
      const from = '순수 단일에서 Icy Veins 12.1.5판이 약 3% 높게 보는 쪽입니다.';
      if (!b.concept.includes(from)) throw new Error('영혼 수확자 장 한 줄 원리를 못 찾음');
      b.concept = b.concept.replace(from, 'Icy Veins가 순수 단일에서 약 3% 높게 보지만 상위 기록엔 없습니다.');
    }
    return m;
  },
};
