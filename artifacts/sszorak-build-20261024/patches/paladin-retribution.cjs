// paladin-retribution 단일 딜사이클 스조라크 빌드 기준 — 근거: bd/paladin-retribution.md, ../sszorak-cycle-20261024/apl/paladin_retribution.simc, sources/paladin-retribution.txt
// 기준 영웅 특성 태양의 사자(스조라크 상위 전 지역 200행 중 193행, 한국 100행 중 97행), 기본 탭 그대로. 로그 9개.
// 성전의 강타(자동 공격)·천상의 군마·신의 가호·물약·장신구는 버튼 순서로 보지 않는다.
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const rep = (text, from, to) => { if (!text.includes(from)) throw new Error('바꿀 문장을 못 찾음: ' + from.slice(0, 30)); return text.replace(from, to); };

module.exports = {
  evidenceNote: '단일 딜사이클 스조라크 빌드 기준(2026-10-24): 스조라크 신화(12.1.5) 상위 랭킹 영웅 특성(전 지역 200행 중 태양의 사자 193행, 한국 100행 중 97행)과 태양의 사자 로그 9개의 실제 순서를 대조했습니다. 오프닝 순서(심판의 칼날 → 응징의 격노 → 사형 선고 → 파멸의 재 → 최후의 선고 → 천상의 종)는 로그와 같아 그대로 두고, 파멸의 재 뒤 두 칸으로 나뉘어 있던 최후의 선고를 한 칸 ×2로 합쳤습니다(9개 중 6개가 두 번, 2개가 세 번). 단일 오프닝에서 "2대상 이상이면 천상의 폭풍" 갈래를 뺐습니다. 단일 반복은 최후의 선고를 이어 쓴 묶음이 940개 중 54개뿐이라 횟수를 달지 않았고, 단일 견본은 스조라크 대표 빌드로 바꿨습니다.',
  changelog: [
    '- 태양의 사자 오프닝(2부 오프닝 장·영웅 탭): 파멸의 재 뒤 최후의 선고 두 칸 → 한 칸 ×2 (근거: 스조라크 로그 9개 중 6개가 두 번, 2개가 세 번 쓰고 천상의 종. 예: https://www.warcraftlogs.com/reports/m29DbtXLyBF3qGcM#fight=24&source=1). 순서는 그대로(심판의 칼날 시작 9개 중 7개, 응징의 격노 → 사형 선고 → 파멸의 재 9개 중 6개)',
    '- 단일 오프닝의 광역 갈래 삭제: 2부 오프닝 장 줄 캡션·근거 문장·본문, 태양의 사자 영웅 탭 오프닝 단계의 "2대상 이상이면 천상의 폭풍". 확인 문제(첫 최후의 선고를 광역이라 폭풍으로)를 단일 문제로 바꿈. 기사단 줄 마지막 캡션의 "광역은 폭풍"도 뺌(순서는 그대로)',
    '- 영웅 탭 요약: 스조라크 상위 근거(200행 중 193행)와 단일 네임드 기준을 적고, "12.1.5 적용 전 한국 검수" 문장을 뺌. 3부 태양의 사자 장에 스조라크 근거 한 문장 추가',
    '- 단일 반복 줄은 그대로(생성기 하나 뒤 최후의 선고 하나 교대가 로그와 같음), 근거 문장만 추가',
  ].join('\n'),
  apply(m) {
    const block = t => m.blocks.find(b => b.title.startsWith(t));

    // ── 2부 단일: 근거 문장
    const single = block('허수아비 첫 연습');
    const loop = tlOf(single)[0].rails.find(r => r.loop);
    loop.note = loop.note + ' 스조라크 신화 상위 기록(태양의 사자 9개)도 생성기 하나 뒤 최후의 선고 하나를 번갈아 썼고, 날개 중에는 천벌의 망치와 최후의 선고가 번갈아 나왔습니다(최후의 선고를 이어 쓴 묶음은 940개 중 54개).';

    // ── 2부 오프닝
    const opener = block('쿨기와 오프닝');
    opener.paragraphs[0] = rep(opener.paragraphs[0],
      '→ 파멸의 재 → 최후의 선고 → 다음 소비기 → 천상의 종입니다.',
      '→ 파멸의 재 → 최후의 선고 두 번 → 천상의 종입니다. 스조라크 신화 상위 기록 9개 중 6개가 파멸의 재 뒤 최후의 선고를 두 번(2개는 세 번) 쓰고 천상의 종으로 넘어갔습니다.');
    opener.paragraphs[1] = rep(opener.paragraphs[1],
      '두 번째 소비기는 단일이면 최후의 선고, 2대상 이상이면 천상의 폭풍이 기본이고, 4세트 천상의 심판관이 남았다면 무료로 쓴 것과 다른 소비기로 바꿉니다.',
      '두 번째 소비기도 최후의 선고이고, 4세트 천상의 심판관이 남았다면 무료로 쓴 것과 다른 소비기(천상의 폭풍)를 한 번 끼웁니다(9개 중 3개).');
    opener.quiz = opener.quiz.map(q => (q.q.startsWith('태양의 사자 오프닝에서 첫 최후의 선고를 광역이라')
      ? {
        q: '태양의 사자 오프닝에서 파멸의 재를 쓴 뒤 천상의 종 전에 최후의 선고를 몇 번 쓸까요?',
        a: '두 번입니다. 파멸의 재가 두 소비기에 새벽빛을 걸고, 첫 최후의 선고는 최고천의 유산으로 천상의 폭풍을 자동으로 함께 씁니다. 스조라크 상위 기록 9개 중 6개가 이렇게 썼습니다.',
      }
      : q));
    if (!opener.quiz.some(q => q.q.includes('몇 번 쓸까요'))) throw new Error('오프닝 확인 문제를 못 찾음');
    const rails = tlOf(opener)[0].rails;
    const herald = rails.find(r => r.label.startsWith('오프닝 — 태양의 사자'));
    const ids = herald.nodes.map(n => n.skillId).join(',');
    if (ids !== '184575,31884,343527,255937,383328,383328,375576') throw new Error('태양의 사자 오프닝 칸이 예상과 다름 ' + ids);
    herald.nodes = [
      ...herald.nodes.slice(0, 4),
      {skillId: '383328', caption: '새벽빛 · 첫 번은 자동 폭풍', count: 2},
      herald.nodes[6],
    ];
    herald.note = '스조라크 신화 상위 기록(태양의 사자 9개) 중 7개가 심판의 칼날로 열었고, 6개가 응징의 격노 → 사형 선고 → 파멸의 재 순서였습니다. 파멸의 재 뒤에는 6개가 최후의 선고를 두 번(2개는 세 번) 쓰고 천상의 종으로 넘어갔습니다. 4세트 천상의 심판관이 남았다면 그사이 천상의 폭풍을 한 번 끼웁니다(9개 중 3개). 천상의 종 뒤에는 최후의 선고와 천벌의 망치를 번갈아 씁니다.';
    const templar = rails.find(r => r.label === '오프닝 — 기사단');
    templar.nodes = templar.nodes.map(n => (n.skillId === '383328' && n.caption === '단일 기본 · 광역은 폭풍' ? {...n, caption: '후속 자원 소비'} : n));
    if (templar.nodes.some(n => n.caption?.includes('광역'))) throw new Error('기사단 줄 광역 캡션이 남음');

    // ── 영웅 특성 탭 — 태양의 사자(기준)
    const hr = m.heroBranches.find(h => h.label === '태양의 사자');
    hr.summary = rep(hr.summary,
      'Icy Veins 12.1.5판(10월 12일) 기본 빌드이고, 12.1.5 이후 WCL 상위 랭킹에서도 다수입니다(신화 님리사 100행 중 95%, 쐐기 53행 중 100%, 전체 사용률이 아님).',
      'Icy Veins 12.1.5판(10월 12일) 기본 빌드이고 단일 네임드의 기준 영웅 특성입니다. 12.1.5 이후 WCL 상위 랭킹은 신화 스조라크 200행 중 193행(한국 100행 중 97행), 신화 님리사 100행 중 95행, 쐐기 53행 모두 태양의 사자였습니다(전체 사용률이 아님).');
    hr.summary = rep(hr.summary, ' 12.1.5 적용 전 한국 검수: 레이드 1건·쐐기 1건. 선택·시전 사례이며 상대 분기보다 강하다는 증명이 아닙니다.', '');
    const hs = hr.opener.steps;
    if (hs.map(s => s.skillId).join(',') !== '184575,31884,343527,255937,383328,383328,375576') throw new Error('태양의 사자 영웅 탭 오프닝이 예상과 다름');
    hr.opener = {
      ...hr.opener,
      steps: [
        ...hs.slice(0, 4),
        {
          ...hs[4],
          phase: '두 소비',
          trigger: '최고천의 유산·새벽빛',
          count: 2,
          note: '파멸의 재 뒤 두 소비기에 새벽빛이 붙습니다. 첫 최후의 선고는 최고천의 유산으로 천상의 폭풍을 자동으로 함께 씁니다. 4세트 천상의 심판관이 남았다면 두 번째를 무료로 쓴 것과 다른 소비기로 바꿉니다. 스조라크 상위 기록 9개 중 6개가 두 번(2개는 세 번) 쓰고 천상의 종으로 넘어갔습니다.',
        },
        hs[6],
      ],
    };

    // ── 영웅 특성 탭 — 기사단
    const tp = m.heroBranches.find(h => h.label === '기사단');
    tp.summary = rep(tp.summary, ' 12.1.5 적용 전 한국 검수: 레이드 0건·쐐기 0건.', '');
    tp.summary = rep(tp.summary, '12.1.5 이후 WCL 상위 랭킹에서는 신화 님리사 100행 중 5%, 쐐기 53행 중 0%입니다(전체 사용률이 아님).',
      '12.1.5 이후 WCL 상위 랭킹에서는 신화 스조라크 200행 중 7행, 신화 님리사 100행 중 5행, 쐐기 53행 중 0행입니다(전체 사용률이 아님).');

    // ── 3부 태양의 사자 장: 스조라크 근거
    const hrCh = block('태양의 사자:');
    const last = hrCh.paragraphs.length - 1;
    hrCh.paragraphs[last] = rep(hrCh.paragraphs[last],
      '한국도 레이드 45행·쐐기 27행이 모두 태양의 사자입니다.',
      '한국도 레이드 45행·쐐기 27행이 모두 태양의 사자입니다. 단일 네임드인 신화 스조라크도 200행 중 193행이 태양의 사자였습니다.');
    return m;
  },
};
