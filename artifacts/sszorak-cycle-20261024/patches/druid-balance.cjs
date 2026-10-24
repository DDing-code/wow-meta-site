// druid-balance 단일 딜사이클 스조라크 대조 — 근거: digests/druid-balance.md, apl/druid_balance.simc, sources/druid-balance.txt
// 1) 엘룬의 대행자 오프닝: 화신 → 별빛섬광(즉시) → 별빛쇄도 를 화신 → 별빛쇄도 → … → 별빛섬광(즉시 시전부터) 으로 (로그 6개 중 5개)
// 2) 숲의 수호자 오프닝: 영혼 소집·천체의 정렬 빌드(로그 10개 모두)로, 태양섬광 → 자연의 군대 → 천체의 정렬 → 별빛쇄도 → 영혼 소집 (10개 중 7개)
//    화신 빌드 순서(일월식 (태양) → 천벌 → 자연의 군대 → 화신)는 note·요약에 남긴다(심크 우선순위 opener·Method).
// 3) 프리풀 천벌: 전투 전·풀링 4초 전으로 표기(심크 우선순위 precombat wrath×2~3, Icy Veins 'approximately 4-seconds … precast two Wrath', Method 'Wrath at 3-4 seconds')
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const must = (cond, what) => { if (!cond) throw new Error('druid-balance: 찾지 못함 — ' + what); };
const rep = (text, from, to) => { must(text.includes(from), from.slice(0, 40)); return text.replace(from, to); };
const ids = arr => arr.map(s => s.skillId).join(',');

module.exports = {
  evidenceNote: '단일 딜사이클 스조라크 대조(2026-10-24): 스조라크 신화(12.1.5) WCL 상위 로그 16개(엘룬의 대행자 6·숲의 수호자 10)의 실제 시전 순서와 심크 우선순위(midnight 3af1a757)·Icy Veins·Method 프리풀을 대조해, 엘룬의 대행자 오프닝은 화신 바로 뒤 별빛쇄도를 먼저 쓰고 즉시 시전 별빛섬광을 그 뒤로(6개 중 5개), 숲의 수호자 오프닝은 영혼 소집·천체의 정렬 빌드 기준 태양섬광 → 자연의 군대 → 천체의 정렬 → 별빛쇄도 → 영혼 소집으로 고쳤습니다(10개 모두 영혼 소집·천체의 정렬, 7개가 이 순서). 화신 빌드 순서는 심크 우선순위·Method와 같아 설명으로 남겼습니다. 풀링 4초 전 천벌은 심크 우선순위 precombat·Icy Veins·Method가 같아 그대로 두었고, 단일 반복 흐름은 로그와 맞아 바꾸지 않았습니다.',
  changelog: [
    '- 엘룬의 대행자 오프닝(2부 오프닝 rail·영웅 탭): … 화신(A)/일월식 (달)(B) → 별빛섬광(구간 첫 즉시 시전) → 별빛쇄도 → 별똥별 → 영혼 소집 → 별빛섬광 → 별빛쇄도 를 … 화신(A)/일월식 (달)(B) → 별빛쇄도 → 별똥별 → 영혼 소집 → 별빛섬광(즉시 시전부터) → 별빛쇄도로 (근거: 스조라크 신화 상위 로그 6개 중 5개가 화신 바로 뒤 별빛쇄도, 1개만 별빛섬광 먼저. 예: https://www.warcraftlogs.com/reports/t8C9BWZPhKHm4TNV#fight=74&source=1600 . 일월식 (달)은 WCL 1233272 Lunar Eclipse 로 찍혀 2개가 화신 앞에 씀)',
    '- 숲의 수호자 오프닝(2부 오프닝 rail·영웅 탭): 천벌 → 달빛섬광 → 태양섬광 → 일월식 (태양) → 천벌 → 자연의 군대 → 화신 → 천벌(꿈의 폭발) → 별빛쇄도 를 천벌(풀링 4초 전) → 태양섬광 → 자연의 군대 → 천체의 정렬 → 별빛쇄도 → 영혼 소집 → 별빛쇄도 → 천벌로 (근거: 상위 로그 10개 모두 천체의 정렬 194223·영혼 소집 사용(화신 0회), 7개가 태양섬광(·달빛섬광) 뒤 바로 자연의 군대 → 천체의 정렬 → 별빛쇄도 2~4번 → 영혼 소집, 3개는 일월식 (태양)(WCL 1233346)·천벌을 먼저 넣음. 예: https://www.warcraftlogs.com/reports/VwzAqghML8mF4YDd#fight=19&source=1 . 심크 우선순위 opener 의 moonfire·eclipse·wrath 가 talent.convoke_the_spirits 면 건너뛰고 fury_of_elune → force_of_nature → celestial_alignment, Method 숲의 수호자 오프닝 "if you\'re playing Convoke you can skip" · "Celestial Alignment if you\'re playing Convoke")',
    '- 숲의 수호자 영웅 탭 단일 우선순위: 화신 줄을 천체의 정렬(화신을 골랐다면 화신)로, 그 뒤에 영혼 소집(숲의 조화 중·천공의 힘 40 아래) 줄 추가 (근거: 심크 우선순위 kotg_st convoke_the_spirits,if=astral_power<40&buff.harmony_of_the_grove.up, 로그 천체의 정렬 사용·화신 0회)',
    '- 같은 순서를 말하는 문장 맞춤: 2부 단일 장 숲의 수호자 문단, 오프닝 장 본문·요점, 4부 숲의 수호자 장 첫 문단, 오프닝 rail note(숲의 수호자 note 의 님리사 근거를 스조라크 근거로), 영웅 탭 오프닝 요약',
    '- 프리풀: 첫 천벌을 전투 전·풀링 4초 전으로 표기 (심크 우선순위 precombat wrath·wrath·wrath(dream_surge), Icy Veins "At approximately 4-seconds on the pull timer, precast two Wrath", Method "Start pressing Wrath at 3-4 seconds", 로그 엘룬의 대행자 3/6·숲의 수호자 9/10 이 0~1초에 천벌 적중, 엘룬의 대행자 2/6 은 별빛섬광 사전 시전)',
    '- 그대로 둔 것: 단일 반복 rail(엘룬의 대행자 별빛섬광 다음 별빛섬광 39%·별빛쇄도 34%, 별빛쇄도 다음 별빛섬광 52%, 일월식 다음 별빛쇄도 49%)·끼워 넣기 rail·엘룬의 대행자 영웅 탭 단일 우선순위. 야생의 돌진은 이동기라 넣지 않음. 야생 버섯은 숲의 수호자 로그 0회지만 선택 특성 조건이라 그대로 둠',
  ].join('\n'),
  apply(m) {
    const block = t => { const b = m.blocks.find(x => x.title.startsWith(t)); must(b, '장 ' + t); return b; };
    const hero = l => { const h = m.heroBranches.find(x => x.label === l); must(h, '영웅 ' + l); return h; };
    const KOTG_OLD_ORDER = '달빛섬광 → 태양섬광 → 일월식 (태양) → 천벌 → 자연의 군대 → 화신';

    // ── 2부 단일 연습: 숲의 수호자 문단 ──
    const single = block('첫 연습은 단일 대상');
    single.paragraphs[2] = rep(single.paragraphs[2],
      '전투 시작만은 일월식 (태양)을 먼저 열고 자원을 모은 뒤 자연의 군대와 화신을 씁니다.',
      '전투 시작은 태양섬광 뒤 바로 자연의 군대와 천체의 정렬을 쓰고, 별빛쇄도 뒤 영혼 소집을 넣습니다. 영혼 소집 대신 화신을 골랐다면 일월식 (태양)부터 엽니다.');

    // ── 2부 오프닝 연습 ──
    const op = block('쿨기와 오프닝');
    must(op.paragraphs[2].startsWith('구간이 열리면 승천자의 일월식으로'), '오프닝 셋째 문단');
    op.paragraphs[2] = rep(op.paragraphs[2],
      '구간이 열리면 승천자의 일월식으로 즉시 시전되는 별빛섬광을 한 번 먼저 쓰고, 단일은 별빛쇄도, 오래 사는 3대상 이상은 별똥별로 첫 자원을 씁니다.',
      '구간이 열리면 단일은 별빛쇄도, 오래 사는 3대상 이상은 별똥별로 들고 들어간 자원부터 씁니다. 승천자의 일월식으로 즉시 시전되는 별빛섬광은 그 뒤에 씁니다. 스조라크 신화 상위 로그 6개 중 5개가 화신 바로 뒤 별빛쇄도부터 썼습니다.');
    op.paragraphs[2] = rep(op.paragraphs[2], '그 뒤로는 별빛섬광으로 다시 채우고,', '그다음 별빛섬광으로 다시 채우고,');
    op.bullets = op.bullets.map(x => x === '숲의 수호자 오프닝은 일월식 (태양)부터 열고, 천벌로 천공의 힘을 모은 뒤 자연의 군대와 화신을 이어서 씁니다.'
      ? '숲의 수호자 오프닝은 태양섬광 뒤 바로 자연의 군대와 천체의 정렬을 잇고, 별빛쇄도 뒤 영혼 소집을 씁니다. 화신을 골랐다면 일월식 (태양)부터 엽니다.' : x);
    must(op.bullets.some(x => x.startsWith('숲의 수호자 오프닝은 태양섬광')), '오프닝 요점 숲의 수호자');

    const rails = tlOf(op)[0].rails;
    const er = rails.find(r => r.label.startsWith('오프닝 — 엘룬의 대행자'));
    const kr = rails.find(r => r.label.startsWith('오프닝 — 숲의 수호자'));
    must(er && kr, '오프닝 rail');
    must(ids(er.nodes) === '5176,8921,93402,202770,102560,48518,194153,78674,191034,391528,194153,78674', '엘룬 오프닝 노드 ' + ids(er.nodes));
    er.nodes = [
      {...er.nodes[0], caption: '풀링 4초 전 2~3회'},
      er.nodes[1], er.nodes[2], er.nodes[3], er.nodes[4], er.nodes[5],
      {skillId: '78674', caption: '구간 첫 소비'},
      er.nodes[8],
      er.nodes[9],
      {skillId: '194153', caption: '즉시 시전부터 모으기'},
      er.nodes[11],
    ];
    er.note = 'A와 B는 둘 중 하나만 씁니다. 스조라크 신화 상위 로그 6개 중 5개가 화신 바로 뒤 별빛쇄도부터 썼고, 승천자의 일월식으로 즉시 시전되는 별빛섬광은 그 뒤에 썼습니다. 별빛쇄도와 별똥별도 대상 수에 맞는 하나만 씁니다. 영혼 소집은 고르지 않았다면 건너뜁니다.';

    must(ids(kr.nodes) === '5176,8921,93402,48517,5176,205636,102560,5176,78674', '숲 오프닝 노드 ' + ids(kr.nodes));
    kr.nodes = [
      {skillId: '5176', caption: '풀링 4초 전 2~3회'},
      {skillId: '93402', caption: '첫 글쿨'},
      {skillId: '205636', caption: '나무정령 소환'},
      {skillId: '194223', caption: '자연의 군대 직후'},
      {skillId: '78674', caption: '숲의 조화 중 몰아 쓰기'},
      {skillId: '391528', caption: '천공의 힘 40 아래'},
      {skillId: '78674', caption: '남은 자원 소비'},
      {skillId: '5176', caption: '이후 단일 우선순위'},
    ];
    kr.note = '영혼 소집과 천체의 정렬을 고른 빌드의 시작입니다. 스조라크 신화 상위 로그 10개 모두 이 두 스킬을 썼고, 7개가 태양섬광 뒤 바로 자연의 군대 → 천체의 정렬 → 별빛쇄도 2~4번 → 영혼 소집 순서였습니다. 달빛섬광은 5개만 첫 글쿨 근처에 넣어 로그마다 다릅니다. 영혼 소집 대신 화신을 골랐다면 ' + KOTG_OLD_ORDER + ' 순서로 엽니다. 여러 대상이면 별빛쇄도 자리가 별똥별입니다.';

    // ── 4부 숲의 수호자 장 ──
    const kotg = block('숲의 수호자:');
    kotg.paragraphs[0] = rep(kotg.paragraphs[0],
      '전투 시작은 예외로, 일월식 (태양)을 먼저 열고 천벌로 천공의 힘을 모은 뒤 자연의 군대와 화신을 함께 씁니다.',
      '전투 시작은 예외로, 영혼 소집을 골랐다면 태양섬광 뒤 바로 자연의 군대와 천체의 정렬을 쓰고 별빛쇄도 뒤 영혼 소집을 넣습니다. 화신을 골랐다면 일월식 (태양)을 먼저 열고 천벌로 천공의 힘을 모은 뒤 자연의 군대와 화신을 함께 씁니다.');

    // ── 영웅 탭: 엘룬의 대행자 ──
    const eh = hero('엘룬의 대행자');
    const es = eh.opener.steps;
    must(ids(es) === '5176,8921,93402,202770,102560,48518,194153,78674,191034,391528,194153,78674', '엘룬 영웅 오프닝 ' + ids(es));
    eh.opener.summary = rep(eh.opener.summary,
      '구간을 연 직후에는 즉시 시전되는 별빛섬광을 한 번 먼저 씁니다.',
      '구간을 연 직후에는 별빛쇄도로 들고 들어간 자원부터 쓰고, 즉시 시전되는 별빛섬광은 그 뒤에 씁니다.');
    eh.opener.steps = [
      {...es[0], phase: '전투 전', trigger: '풀링 4초 전'},
      es[1], es[2], es[3], es[4], es[5],
      {...es[7], trigger: '화신·일월식 직후'},
      es[8],
      es[9],
      {...es[10], label: '별빛섬광 · 즉시 시전부터', note: '승천자의 일월식으로 즉시 시전되는 별빛섬광부터 쓰고, 이동 전까지 연속 시전해 자원을 다시 만듭니다. 엘룬의 대행자의 단일·광역 기본 생성기입니다.'},
      es[11],
    ];

    // ── 영웅 탭: 숲의 수호자 ──
    const kh = hero('숲의 수호자');
    const ks = kh.opener.steps;
    must(ids(ks) === '5176,8921,93402,48517,5176,205636,102560,5176,78674', '숲 영웅 오프닝 ' + ids(ks));
    kh.opener.summary = '영혼 소집과 천체의 정렬을 고른 빌드의 시작입니다. 전투 전 천벌 뒤 태양섬광을 걸고, 자연의 군대와 천체의 정렬을 바로 이어 씁니다. 숲의 조화가 켜진 동안 별빛쇄도를 몰아 쓰고, 천공의 힘이 40 아래로 내려가면 영혼 소집을 씁니다. 영혼 소집 대신 화신을 골랐다면 ' + KOTG_OLD_ORDER + ' 순서로 엽니다. 쫄이 정해진 시간에 나오는 네임드라면 자연의 군대와 큰 구간을 그 무리에 맞춥니다.';
    kh.opener.steps = [
      {...ks[0], phase: '전투 전', trigger: '풀링 4초 전'},
      {...ks[2], trigger: '첫 글쿨', note: '숲의 조화 구간 안에서 도트 글쿨을 쓰지 않게 먼저 적용합니다. 달빛섬광은 이 앞뒤에 넣기도 하고 첫 구간 뒤로 미루기도 해 로그마다 다릅니다.'},
      {...ks[5], trigger: '태양섬광 직후'},
      {skillId: '194223', label: '천체의 정렬', phase: '큰 구간', trigger: '자연의 군대 직후', note: '자연의 군대 바로 다음 글쿨에 열어 숲의 조화와 겹칩니다. 영혼 소집 대신 화신을 골랐다면 이 자리에 화신: 엘룬의 선택을 씁니다.'},
      ks[8],
      {skillId: '391528', label: '영혼 소집', phase: '선택 쿨기', trigger: '천공의 힘 40 아래', note: '숲의 조화가 켜져 있고 천공의 힘이 40 아래일 때 씁니다. 정신 집중 동안 움직이지 않아도 되는 자리인지 먼저 봅니다.'},
      {skillId: '78674', label: '별빛쇄도', phase: '남은 자원 소비', trigger: '영혼 소집 뒤', note: '영혼 소집이 만든 천공의 힘을 상한 전에 씁니다. 항성 증폭은 우선 대상 한 명에게 둡니다.'},
      {skillId: '5176', label: '천벌', phase: '우선순위 복귀', trigger: '구간 뒤', note: '천벌로 다시 천공의 힘을 모으고 단일 우선순위로 돌아갑니다.'},
    ];
    const kp = kh.singleTarget.priority;
    must(kp[2] && kp[2].skillId === '102560', '숲 단일 우선순위 화신 줄');
    kh.singleTarget.summary = rep(kh.singleTarget.summary,
      '자연의 군대와 다음 글쿨의 일월식·화신을 한 묶음으로 반복합니다.',
      '자연의 군대와 다음 글쿨의 일월식·천체의 정렬(화신)을 한 묶음으로 반복합니다.');
    kh.singleTarget.priority = [
      kp[0], kp[1],
      {skillId: '194223', label: '천체의 정렬 · 묶음 구간', note: '자연의 군대 직후에 열어 숲의 조화와 겹칩니다. 영혼 소집 대신 화신을 골랐다면 이 자리에 화신: 엘룬의 선택을 씁니다.'},
      {skillId: '391528', label: '영혼 소집 · 숲의 조화 중', note: '골랐다면 숲의 조화가 켜져 있고 천공의 힘이 40 아래일 때 씁니다.'},
      ...kp.slice(3),
    ];
    return m;
  },
};
