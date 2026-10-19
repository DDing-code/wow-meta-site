// monk-brewmaster 후속(2026-10-20, 사용자 "다 최신 메타에 맞게"): 특성 견본을 12.1.5 이후 상위 로그 쪽으로.
// 레이드·단일 = 음영파(님리사 신화 상위 99행 중 다수결과 2칸 차이인 실제 빌드), 쐐기 = 조화의 종사(상위 42행 중 다수결과 1칸 차이).
// 코드는 artifacts/meta-followup-20261020/from-logs.cjs 로 랭킹 행 특성을 인코딩했고, 디코더(34/34/13)와 한국어 Wowhead 계산기(calc-brm.json)로 확인했다.
const must = (cond, what) => { if (!cond) throw new Error('monk-brewmaster 후속: 찾지 못함 — ' + what); };
const rep = (text, from, to) => { must(typeof text === 'string' && text.includes(from), from.slice(0, 40)); return text.replace(from, to); };
const DAY = '2026-10-20';
const COMMIT = '5537d8813dfc59707927722b1e23ffa6fd67ee59';
const RAID = {
  code: 'CwQAAAAAAAAAAAAAAAAAAAAAAAAAAwMbbGzYGWmxGmZMAAAAAAALLYEzMwMMzGDmZmZY2GmxMLDLb22GzYWAAgNEAAgZbWamZmFzwGAzMMNGAAwA',
  sha256: '6b909e6360249f6112049bd11e907fd1fe218ba9645285b624df377546263e36', heroTreeId: 65, heroLabel: '음영파',
  sourceUrl: 'https://www.warcraftlogs.com/reports/7DwYjHR9h64Ga81t#fight=1',
  sourceLabel: 'WCL 12.1.5 이후 신화 님리사 상위 음영파 대표 빌드(전체 27위, 2026-10-17)',
};
const MYTHIC = {
  code: 'CwQAAAAAAAAAAAAAAAAAAAAAAAAAAgZbzYGGzyMzGzMjBAAAAAAYZBzEzMwMM2gxMzMDzGzMmZZYZ7B22mNMLAAwysMtMbzsMAAQAMsBmZATjBAAMA',
  sha256: '1bc6ec47d47b81b29522602d62e1b1b653a8c757d335376265fbce0452a7544f', heroTreeId: 66, heroLabel: '조화의 종사',
  sourceUrl: 'https://www.warcraftlogs.com/reports/hwNnztfcYvbLR9Dq#fight=41',
  sourceLabel: 'WCL 12.1.5 이후 쐐기 상위 조화의 종사 대표 빌드(전체 16위, 2026-10-14)',
};
const SCOPE = '12.1.5 상위 로그 특성으로 만든 코드. SimC midnight(5537d881, 12.1.5.70448) 전문화·노드·랭크·포인트 문턱과 한국어 Wowhead 계산기 포인트·선택 가능 여부·부모 연결 확인.';
const build = (old, src, note) => ({
  ...old, code: src.code, url: 'https://www.wowhead.com/ko/talent-calc/blizzard/' + src.code,
  sourceUrl: src.sourceUrl, sourceLabel: src.sourceLabel, checkedAt: DAY, note, heroLabel: src.heroLabel,
  validation: {specId: 268, heroTreeId: src.heroTreeId, points: {1: 34, 2: 34, 3: 13, 4: 1}, checkedAt: DAY, traitDataCommit: COMMIT, gameBuild: '12.1.5.70448',
    browser: {checkedAt: DAY, points: [34, 34, 13], parentConnections: true, available: true, sha256: src.sha256}, scope: SCOPE},
});
const RAID_NOTE = '12.1.5 이후 신화 님리사 상위 99행에서 고른 대표 빌드입니다(음영파·흑우주·해독·폭발하는 맥주통). 상위 행의 다수 선택과 두 칸만 다릅니다. Icy Veins·Wowhead 12.1.5판은 방어 레이드에 조화의 종사를 권하니, 생존이 더 급한 전투라면 그쪽도 비교하세요.';
const CHOICE = '레이드 견본은 음영파, 쐐기 견본은 조화의 종사입니다. 12.1.5 이후 상위 로그가 이렇게 고릅니다. 생존이 더 급한 레이드라면 공개 가이드가 권하는 조화의 종사를, 쫄이 많은 낮은 단수 쐐기라면 음영파를 비교합니다.';
const KEEP = '두 분기는 모두 선택 가능하며 견본은 방어 레이드·일반 쐐기라는 목적을 유지합니다.';
const KEEP_NEW = '두 분기는 모두 선택 가능하며, 2026-10-20 견본은 상위 로그 쪽(레이드 음영파·쐐기 조화의 종사)으로 맞췄습니다.';

module.exports = function followup(m) {
  const tb = id => { const b = m.talentBuilds.find(x => x.id === id); must(b, '견본 ' + id); return b; };
  m.talentBuilds = [
    build(tb('single-target'), RAID, '단일 네임드 전투용 견본입니다. ' + RAID_NOTE),
    build(tb('mythic-plus'), MYTHIC, '쐐기용 견본입니다. 12.1.5 이후 쐐기 상위 42행에서 고른 대표 빌드입니다(조화의 종사·흑우주·해독). 상위 조화의 종사 쐐기 로그는 폭발하는 맥주통을 고르지 않았습니다. 던전과 파티에 맞춰 차단·군중 제어·해제 선택을 조정하세요. Icy Veins·Wowhead 12.1.5판은 일반 쐐기에 음영파를 권합니다.'),
    build(tb('raid'), RAID, '단일 네임드용과 일반 레이드용으로 같은 견본을 씁니다. ' + RAID_NOTE),
  ];

  const hero = l => { const h = m.heroBranches.find(x => x.label === l); must(h, '영웅 ' + l); return h; };
  const findPara = test => { const b = m.blocks.find(x => (x.paragraphs || []).some(test)); must(b, String(test)); return [b, b.paragraphs.findIndex(test)]; };
  const setPara = (from, to) => { const [b, i] = findPara(p => p.includes(from)); b.paragraphs[i] = b.paragraphs[i].replace(from, to); };

  // 단일 장: 조화의 종사도 흑우주를 고른다
  setPara('조화의 종사는 레이드 견본에 흑우주가 없어 그 자리가 빠지고, 후려차기 다음에 기의 파동과 천신의 주입이 옵니다.',
    '조화의 종사도 흑우주(골랐다면)가 맨 앞이고, 후려차기 다음에 기의 파동과 천신의 주입이 옵니다.');
  // 실전 영웅 장: 선택 조건 문단(공개 추천 검사가 이 문장을 본문에서 찾는다)
  const old = m.logReview.publicationReview.choice;
  const [cb, ci] = findPara(p => p === old);
  cb.paragraphs[ci] = CHOICE;
  setPara('위쪽 쐐기 특성 견본은 음영파, 레이드·단일 견본은 조화의 종사로 짜여 있습니다.', '위쪽 레이드·단일 특성 견본은 음영파, 쐐기 견본은 조화의 종사로 짜여 있습니다.');
  setPara('그래서 견본은 그대로 두고 두 근거를 함께 적습니다.', '견본은 상위 로그 쪽(레이드 음영파·쐐기 조화의 종사)으로 맞추고, 공개 가이드의 방어 위주 선택은 비교 대상으로 남깁니다.');
  setPara('쐐기 견본은 음영파 그대로이며, 높은 단수를 준비한다면 이 장의 조화의 종사도 함께 비교하세요.', '쐐기 견본은 이 상위 로그를 따라 조화의 종사로 짰습니다. 쫄이 많은 낮은 단수라면 공개 가이드가 권하는 음영파도 비교하세요.');
  // 공격대 장 레이드 탱사이클 note
  const raidRail = m.blocks.flatMap(b => (Array.isArray(b.timeline) ? b.timeline : b.timeline ? [b.timeline] : [])).flatMap(t => t.rails || [])
    .find(r => (r.note || '').includes('레이드 견본(조화의 종사)에는 흑우주가 없지만'));
  must(raidRail, '레이드 탱사이클 note');
  raidRail.note = rep(raidRail.note, '레이드 견본(조화의 종사)에는 흑우주가 없지만 상위 로그 16개는 모두 흑우주를 골랐습니다.', '레이드 견본(음영파)도 상위 로그 16개처럼 흑우주를 골랐습니다.');

  const sh = hero('음영파'), ha = hero('조화의 종사');
  sh.summary = rep(rep(sh.summary, '표준 쐐기와 공격형 레이드 예시입니다.', '레이드 견본의 영웅 특성입니다.'),
    '공개 저자 12.1.5판은 쐐기에 음영파를 권해 쐐기 견본을 유지합니다.', '레이드 견본은 이 상위 로그를 따라 음영파로 짰습니다. 공개 저자 12.1.5판은 일반 쐐기에 음영파를 권합니다.');
  sh.tankRaid.summary = rep(sh.tankRaid.summary, '연결된 레이드 견본은 조화의 종사라 흑우주가 없지만, 상위 로그 16개는 두 영웅 특성 모두 흑우주를 골랐습니다.', '연결된 레이드 견본도 상위 로그처럼 음영파·흑우주입니다.');
  sh.tankMythic.summary = rep(rep(sh.tankMythic.summary, '쐐기 견본(음영파) 기준 큰 풀 흐름입니다.', '음영파로 쐐기를 할 때의 큰 풀 흐름입니다. 연결된 쐐기 견본은 조화의 종사라 영웅 특성만 바꿔 읽습니다.'),
    ' 쐐기 견본에는 레이드 견본에 없는 해독이 있습니다.', ' 두 견본 모두 해독을 골랐습니다.');
  ha.summary = rep(rep(ha.summary, '방어 레이드와 고단 쐐기의 학습 예시입니다.', '쐐기 견본의 영웅 특성입니다.'),
    '공개 저자 12.1.5판은 레이드에 조화의 종사를 권해 레이드·단일 견본을 유지합니다.', '쐐기 견본은 이 상위 로그를 따라 조화의 종사로 짰습니다. 공개 저자 12.1.5판은 방어 레이드에 조화의 종사를 권합니다.');
  ha.tankRaid.summary = rep(ha.tankRaid.summary, '상위 로그는 레이드 견본에 없는 흑우주도 골랐습니다.', '연결된 레이드 견본은 음영파라, 조화의 종사로 레이드를 할 때는 영웅 특성만 바꿔 읽습니다. 상위 로그는 흑우주도 골랐습니다.');
  const brew = ha.tankRaid.steps.find(s => s.skillId === '115399');
  must(brew, '조화 레이드 탱사이클 흑우주');
  brew.note = rep(brew.note, '레이드 견본에는 없지만 상위 조화의 종사 로그 8개 모두 골랐습니다.', '상위 조화의 종사 로그 8개 모두 골랐고 두 견본에도 들어 있습니다.');
  ha.tankMythic.summary = rep(ha.tankMythic.summary, '연결된 쐐기 견본은 음영파라, 조화의 종사로 쐐기를 할 때는 영웅 특성만 바꿔 읽습니다.', '연결된 쐐기 견본도 조화의 종사입니다.');
  // 조화의 종사 우선순위표 맨 앞에 흑우주(쐐기 견본·상위 로그 모두 선택)
  for (const k of ['singleTarget', 'aoe']) {
    const p = ha[k].priority;
    must(p[0].skillId !== '115399' && sh[k].priority[0].skillId === '115399', '조화 ' + k + ' 흑우주');
    p.unshift({...sh[k].priority[0]});
  }

  const lr = m.logReview;
  lr.publicationReview = {...lr.publicationReview, checkedAt: DAY, choice: CHOICE, evidence: rep(lr.publicationReview.evidence, KEEP, KEEP_NEW)};
  lr.heroConclusion = {...lr.heroConclusion, checkedAt: DAY, conclusion: rep(rep(lr.heroConclusion.conclusion, old, CHOICE), KEEP, KEEP_NEW)};

  m.evidence = [...(m.evidence || []).filter(x => !x.startsWith('최신 메타 후속')),
    '최신 메타 후속(2026-10-20): 사용자 결정으로 특성 견본을 12.1.5 이후 상위 로그 쪽으로 바꿨습니다. 레이드·단일 견본은 신화 님리사 상위 음영파 99행, 쐐기 견본은 쐐기 상위 조화의 종사 42행에서 다수 선택과 가장 가까운 실제 빌드를 골라 불러오기 코드로 만들고, SimC 트리 자료와 한국어 Wowhead 계산기(34/34/13, 연결 끊김 0)로 확인했습니다. 두 견본 모두 흑우주·해독을 고르고, 쐐기 견본에는 폭발하는 맥주통이 없습니다. 조화의 종사 우선순위표 맨 앞에도 흑우주를 넣었습니다. Icy Veins·Wowhead 12.1.5판의 방어 위주 추천은 비교 대상으로 남겼습니다.'];
  return m;
};
