// warrior-fury 단일 딜사이클 스조라크 대조 — 근거: digests/warrior-fury.md, apl/warrior_fury.simc, sources/warrior-fury.txt
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const rep = (text, from, to) => { if (!text.includes(from)) throw new Error('바꿀 문장을 못 찾음: ' + from.slice(0, 30)); return text.replace(from, to); };

module.exports = {
  evidenceNote: '단일 딜사이클 스조라크 대조(2026-10-24): 스조라크 신화(12.1.5) WCL 상위 로그(학살자 11개·산왕 4개)의 실제 시전 순서와 심크 우선순위(midnight 3af1a757)·Icy Veins·Method 오프닝을 대조해, 학살자 오프닝의 오딘의 격노를 무모한 희생 앞에서 칼날폭풍 뒤 첫 광란 다음으로 옮기고(무모한 희생 앞에 쓴 로그는 오딘의 격노를 쓴 7개 중 1개, 심크 우선순위 slayer 의 odyns_fury 는 bladestorm 아래), 산왕 오프닝은 투신 직후 우레 작렬을 광란 앞에 두었습니다(4개 중 3개). 영웅 탭 단일 우선순위에 무모한 희생(두 영웅 특성)·투신·마무리 일격(산왕)을 넣었습니다. 단일 반복 흐름은 로그와 맞아 그대로 두었고, 프리풀은 심크 우선순위·공개 가이드 모두 돌진으로 시작해 넣을 것이 없었습니다.',
  changelog: [
    '- 학살자 오프닝(연습 장 타임라인·영웅 탭): 돌진 → 오딘의 격노 → 무모한 희생 → 광란 → 칼날폭풍 → 광란 → 분쇄의 타격 → 광란 → 돌진 → 무모한 희생 → 광란 → 칼날폭풍 → 광란 → 오딘의 격노 → 분쇄의 타격 → 광란 (근거: 스조라크 학살자 로그 11개 모두 무모한 희생 → 광란 → 칼날폭풍. 오딘의 격노를 쓴 7개 중 무모한 희생 앞 1개, 무모한 희생과 칼날폭풍 사이 3개, 칼날폭풍 뒤 3개로 갈림 → 심크 우선순위 slayer 에서 odyns_fury 가 bladestorm·crushing_blow 아래이고 Icy Veins 쿨기 중 우선순위도 칼날폭풍 뒤라 칼날폭풍 뒤에 두고 note 에 로그마다 다름 표시)',
    '- 산왕 오프닝(연습 장 타임라인·영웅 탭): 돌진 → 무모한 희생 → 투신 → 광란 → 우레 작렬 → … → 돌진 → 무모한 희생 → 투신 → 우레 작렬 → 광란 → … (근거: 스조라크 산왕 로그 4개 중 3개가 투신 직후 우레 작렬, 심크 우선순위 thane 의 thunder_blast 2중첩 조건)',
    '- 영웅 탭 단일 우선순위: 학살자·산왕 맨 위에 무모한 희생, 산왕에 투신과 마무리 일격 추가 (근거: 분당 무모한 희생 학살자 1.36·산왕 1.06회, 투신 1.06회, 산왕 마무리 일격 1.96회, 심크 우선순위 slayer·thane 첫 줄 recklessness, thane 의 avatar·execute)',
    '- 단일 연습 장 본문: 공통 우선순위 문장에서 오딘의 격노를 생성기 바로 앞으로, 생성기 순서 근거를 스조라크 로그로 바꿈(학살자 피의 갈증 분당 2.7회·분노의 강타 12.5회, 산왕은 광란 뒤 피의 갈증이 가장 많음). 반복 흐름 rail 순서는 그대로',
    '- 프리풀: 심크 우선순위 precombat 은 광전사 태세뿐이고 Icy Veins·Method 모두 돌진으로 시작, 로그 음수 초 시전 0 → 추가 없음',
  ].join('\n'),
  apply(m) {
    const block = t => m.blocks.find(b => b.title.startsWith(t));

    // 2부 단일 연습: 본문
    const single = block('허수아비 첫 연습');
    single.paragraphs[0] = rep(single.paragraphs[0],
      '광란 → 오딘의 격노 → 무모한 희생 → 영웅 쿨기(칼날폭풍 또는 투신) → 산왕의 우레 작렬 → 피범벅·분쇄의 타격(막무가내 중) → 피의 갈증',
      '광란 → 무모한 희생 → 영웅 쿨기(칼날폭풍 또는 투신) → 산왕의 우레 작렬 → 피범벅·분쇄의 타격(막무가내 중) → 오딘의 격노 → 피의 갈증'
    );
    single.paragraphs[1] = rep(single.paragraphs[1],
      '12.1.5 이후 상위 레이드 기록에서도 무모한 희생 밖 광란 뒤 첫 생성기는 대부분 분노의 강타였습니다. 산왕은 피의 갈증이 우레 작렬을 주기 때문에 피의 갈증을 먼저 쓴 경우가 더 많았습니다.',
      '스조라크 신화 상위 로그에서도 학살자는 분노의 강타를 분당 12회 넘게 썼고 피의 갈증은 3회도 안 됐습니다. 산왕은 피의 갈증이 우레 작렬을 주기 때문에 광란 뒤 피의 갈증을 먼저 쓴 경우가 가장 많았습니다.'
    );

    // 2부 오프닝 연습
    const opener = block('쿨기와 오프닝');
    opener.concept = rep(opener.concept,
      '돌진으로 첫 분노를 얻고, 광란이나 오딘의 격노로 격노를 빨리 켠 뒤 무모한 희생 구간에 광란을 몰아 쓰는 것입니다.',
      '돌진으로 첫 분노를 얻고, 무모한 희생을 켠 뒤 광란으로 격노를 빨리 켜고 그 구간에 광란을 몰아 쓰는 것입니다.'
    );
    opener.paragraphs[0] = rep(opener.paragraphs[0],
      '오딘의 격노를 골랐다면 첫 쿨기 전에 격노를 열 수 있고, 아니면 첫 광란으로 격노를 켭니다.',
      '두 영웅 특성 모두 무모한 희생을 먼저 켜고 첫 광란으로 격노를 켭니다.'
    );
    opener.paragraphs[1] = rep(opener.paragraphs[1],
      '학살자는 돌진 → 오딘의 격노(선택 시) → 무모한 희생 → 광란 → 칼날폭풍 순서로 들어갑니다.',
      '학살자는 돌진 → 무모한 희생 → 광란 → 칼날폭풍 순서로 들어갑니다.'
    );
    opener.paragraphs[1] = rep(opener.paragraphs[1],
      '잔혹한 마무리를 골랐다면 이 광란이 50% 강해집니다. 그 뒤로는',
      '잔혹한 마무리를 골랐다면 이 광란이 50% 강해집니다. 오딘의 격노를 골랐다면 이 광란 다음에 씁니다. 그 뒤로는'
    );
    opener.paragraphs[1] = rep(opener.paragraphs[1],
      '12.1.5 이후 상위 레이드 기록 8개 모두 칼날폭풍 다음 손으로 쓴 첫 스킬이 광란이었습니다.',
      '스조라크 신화 상위 로그 11개가 모두 무모한 희생 → 광란 → 칼날폭풍으로 들어갔고, 10개는 칼날폭풍 다음 손으로 쓴 첫 공격이 광란이었습니다.'
    );
    opener.paragraphs[2] = rep(opener.paragraphs[2],
      '산왕은 돌진 → 무모한 희생 → 투신 → 광란 순서입니다. 투신을 직접 쓰면 폭풍의 화신으로 우레 작렬 2중첩을 얻고 천둥벼락 쿨다운이 초기화됩니다. 우레 작렬은 2중첩이 되거나 투신이 곧 끝날 때 씁니다.',
      '산왕은 돌진 → 무모한 희생 → 투신 → 우레 작렬 → 광란 순서입니다. 투신을 직접 쓰면 폭풍의 화신으로 우레 작렬 2중첩을 얻고 천둥벼락 쿨다운이 초기화됩니다. 2중첩이니 우레 작렬을 바로 한 번 쓰고 광란으로 격노를 켭니다. 그 뒤 우레 작렬은 2중첩이 되거나 투신이 곧 끝날 때 씁니다.'
    );
    const rails = tlOf(opener)[0].rails;
    const slayerRail = rails.find(r => r.label === '학살자 오프닝');
    slayerRail.nodes = [
      {skillId: '100', caption: '첫 분노 확보'},
      {skillId: '1719', caption: '광란 반복 구간 시작'},
      {skillId: '184367', caption: '분노 비우기 · 격노'},
      {skillId: '227847', caption: '격노 상태로 진입'},
      {skillId: '184367', caption: '잔혹한 마무리면 50%'},
      {skillId: '385059', caption: '선택했다면 여기서'},
      {skillId: '335097', caption: '막무가내 · 광란 사이'},
      {skillId: '184367', caption: '격노 끝나기 전 다시'},
    ];
    slayerRail.note = '오딘의 격노는 심크 우선순위대로 칼날폭풍 뒤 첫 광란 다음에 두었습니다. 스조라크 신화 상위 로그에서 오딘의 격노를 쓴 7개 중 3개가 칼날폭풍 뒤, 3개가 무모한 희생과 칼날폭풍 사이에 썼습니다(로그마다 다름). 칼날폭풍 중에 찍히는 피범벅은 불안정한 정신을 골랐을 때 자동으로 나가는 공격입니다. 급살이 뜨면 광란 사이에 마무리 일격을 끼웁니다. 이 칼날폭풍 빌드에는 투신이 없습니다.';
    const thaneRail = rails.find(r => r.label === '산왕 오프닝');
    thaneRail.nodes = [
      {skillId: '100', caption: '첫 분노 확보'},
      {skillId: '1719', caption: '투신과 함께 큰 구간'},
      {skillId: '107574', caption: '우레 작렬 2중첩'},
      {skillId: '435607', caption: '2중첩 바로 하나'},
      {skillId: '184367', caption: '격노 켜기'},
      {skillId: '335096', caption: '4세트 치명타 쌓기'},
      {skillId: '335097', caption: '2세트 구간 연장'},
      {skillId: '184367', caption: '격노 끝나기 전 다시'},
    ];
    thaneRail.note = '스조라크 신화 상위 로그 4개 중 3개가 투신 직후 우레 작렬을 먼저 쓰고 광란을 이었습니다. 피범벅과 분쇄의 타격은 막무가내를 골랐을 때 무모한 희생 중 바뀐 생성기입니다. 4세트·2세트 조건은 세트를 갖췄을 때만 챙깁니다. 피범벅과 분쇄의 타격의 앞뒤, 그 사이 광란 횟수는 로그마다 다릅니다.';

    // 영웅 특성 탭 — 학살자
    const slayer = m.heroBranches.find(h => h.label === '학살자');
    slayer.opener.summary = '돌진 뒤 무모한 희생을 켜고 광란으로 분노를 비운 다음 칼날폭풍을 넣습니다. 칼날폭풍이 끝나면 바로 광란을 쓰고, 오딘의 격노를 골랐다면 이어서 씁니다. 그 뒤 광란과 분쇄의 타격을 번갈아 쓰고, 급살은 발동했을 때 광란 사이에 소비합니다. 이 칼날폭풍 빌드에는 투신이 없습니다.';
    const ss = {};
    slayer.opener.steps.forEach(s => { (ss[s.skillId] = ss[s.skillId] || []).push(s); });
    slayer.opener.steps = [
      ss['100'][0],
      ss['1719'][0],
      ss['184367'][0],
      ss['227847'][0],
      ss['184367'][1],
      {...ss['385059'][0], note: '선택했다면 칼날폭풍 뒤 첫 광란 다음에 씁니다. 스조라크 신화 상위 로그에는 무모한 희생과 칼날폭풍 사이에 쓴 기록도 있습니다(로그마다 다름).', phase: '무모한 희생 중 추가 피해', trigger: '오딘의 격노 선택·칼날폭풍 뒤 광란 다음'},
      ss['335097'][0],
      ss['184367'][2],
    ];
    if (slayer.opener.steps.some(s => !s)) throw new Error('학살자 오프닝 단계 누락');
    slayer.singleTarget.priority = [
      {skillId: '1719', label: '무모한 희생', note: '쿨다운이 돌면 바로 켭니다. 칼날폭풍은 이 구간 안에 넣습니다.'},
      ...slayer.singleTarget.priority.filter(p => p.skillId !== '1719'),
    ];
    slayer.singleTarget.summary = '고정 순서가 아니라 매 사용 후 다시 위에서부터 확인하는 조건표입니다. 무모한 희생이 돌면 먼저 켜고, 칼날폭풍 직전에는 광란으로 분노를 비웁니다.';

    // 영웅 특성 탭 — 산왕
    const thane = m.heroBranches.find(h => h.label === '산왕');
    thane.opener.summary = '돌진 후 무모한 희생과 투신을 맞추고, 투신으로 받은 우레 작렬 2중첩 중 하나를 바로 쓴 뒤 광란으로 격노를 켭니다. 그 뒤 우레 작렬은 중첩 과충전이나 투신 종료 전에 처리하고, 시즌 2 세트가 있으면 강화 생성기를 함께 봅니다.';
    const ts = {};
    thane.opener.steps.forEach(s => { (ts[s.skillId] = ts[s.skillId] || []).push(s); });
    thane.opener.steps = [
      ts['100'][0],
      ts['1719'][0],
      ts['107574'][0],
      {...ts['435607'][0], note: '투신으로 받은 2중첩 중 하나를 바로 씁니다. 스조라크 신화 상위 로그 4개 중 3개가 광란보다 먼저 썼습니다.', trigger: '투신 직후·우레 작렬 2중첩'},
      {...ts['184367'][0], note: '우레 작렬 다음, 분노가 모이면 격노를 켭니다.'},
      ts['335096'][0],
      ts['335097'][0],
      ts['184367'][1],
    ];
    if (thane.opener.steps.some(s => !s)) throw new Error('산왕 오프닝 단계 누락');
    const tp = thane.singleTarget.priority.filter(p => !['1719', '107574', '5308'].includes(p.skillId));
    const rbIdx = tp.findIndex(p => p.skillId === '85288');
    thane.singleTarget.priority = [
      {skillId: '1719', label: '무모한 희생', note: '쿨다운이 돌면 투신과 함께 켭니다.'},
      {skillId: '107574', label: '투신', note: '무모한 희생과 함께 씁니다. 폭풍의 화신으로 우레 작렬 2중첩을 받습니다.'},
      ...tp.slice(0, rbIdx + 1),
      {skillId: '5308', label: '마무리 일격', note: '급살이 떴거나 마무리 구간이면 생성기 사이에 씁니다. 광란을 밀어내지는 않습니다.'},
      ...tp.slice(rbIdx + 1),
    ];
    thane.singleTarget.summary = '광란과 격노 유지가 기본입니다. 무모한 희생과 투신은 돌면 함께 켭니다. 투신 중 우레 작렬 2중첩, 피범벅의 4세트, 분쇄의 타격의 2세트를 서로 다른 조건으로 확인합니다. 무모한 희생 밖에서는 우레 작렬을 주는 피의 갈증을 분노의 강타보다 먼저 봅니다.';
    return m;
  },
};
