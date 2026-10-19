// warlock-affliction 딜사이클 순서 수정 — 근거: digests/warlock-affliction.md, apl/warlock_affliction.simc
// 영혼 수확자: 오프닝·단일에서 암흑시선을 수확보다 먼저, 오프닝 끝 손아귀 → 어둠의 화살, 광역은 고통 여럿 → 씨앗 → 출몰 순.
// 지옥소환사: 적개심(→ 암흑시선) → 수확 순서(오프닝·단일·광역). 지옥소환사 광역의 고통·씨앗 순서는 쐐기 로그가 없어 그대로 둔다.
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const rep = (text, from, to) => { if (!text.includes(from)) throw new Error('바꿀 문장을 못 찾음: ' + from.slice(0, 40)); return text.replace(from, to); };
const pick = (rows, skillId, nth = 0) => {
  const hit = rows.filter(r => r.skillId === skillId)[nth];
  if (!hit) throw new Error(`행을 못 찾음: ${skillId} #${nth}`);
  return {...hit};
};

module.exports = {
  evidenceNote: '딜사이클 순서 대조(2026-10-20): 12.1.5 이후 WCL 상위 레이드 12개(영혼 수확자 6·지옥소환사 6)·쐐기 8개(영혼 수확자)의 실제 시전 순서와 심크 APL(midnight d91a5707, 고통 APL은 9월 19일 수정)을 대조했습니다. 영혼 수확자 오프닝은 상위 레이드 6개 중 4개처럼 암흑시선을 수확보다 먼저 켜는 순서로 바꾸고, 6개 모두 쓰지 않은 재앙의 손아귀 대신 어둠의 화살로 끝냈습니다. 영혼 수확자 광역은 쐐기 광역 풀 7개 모두처럼 고통을 여러 적에게 먼저 건 뒤 씨앗으로 퍼뜨리는 순서로 바꿨습니다. 지옥소환사는 6명 중 5명이 반복 구간에서 적개심을 켠 직후(또는 암흑시선 뒤) 수확을 써서, 오프닝·단일·광역 모두 적개심을 수확보다 앞에 두었습니다.',
  changelog: [
    '- 영혼 수확자 오프닝(연습 장 타임라인·영웅 탭): 출몰 → 고통 → 부패 → 불안정한 고통 ×2 → 암흑의 수확 → 암흑시선 → 불안정한 고통 ×2 → 재앙의 손아귀 를 출몰 → 고통 → 부패 → 암흑시선 → 불안정한 고통 ×2 → 암흑의 수확 → 불안정한 고통 ×2 → 어둠의 화살 로 (근거: 상위 레이드 6개 중 4개가 암흑시선을 수확 전에 씀 — 예 https://www.warcraftlogs.com/reports/D8p476PHTxCNRgqd#fight=63&source=710 ; 재앙의 손아귀는 6개 모두 첫 22회에 없고 레이드 반복 분당 0회, 어둠의 화살은 6개 모두 첫 12회 안. APL SH_st 의 summon_darkglare,if=cooldown.dark_harvest.remains 는 수확 뒤지만 12.1.5 전 수정이라 로그를 따름)',
    '- 영혼 수확자 단일 우선순위(영웅 탭·연습 장 반복 rail 위 가지): 암흑의 수확 → 암흑시선 을 암흑시선 → 암흑의 수확 으로. 재앙의 손아귀 행·위 가지는 "골랐을 때만"으로 표시',
    '- 영혼 수확자 광역(영웅 탭·연습 장 광역 rail): 출몰 → 씨앗 → 수확 → 씨앗 → 고통 → 암흑시선 … 을 고통 → 씨앗 → 출몰 → 암흑시선 → 수확 → 씨앗 … 으로 (근거: 쐐기 광역 풀 시작 7개 모두 고통을 1~7번 먼저 건 뒤 씨앗, 출몰은 7개 중 5개가 첫 씨앗 뒤, 암흑시선·수확이 함께 나온 풀 3개 중 2개가 암흑시선 먼저. APL SH_aoe 는 haunt → seed → dark_harvest → agony 순이지만 로그를 따름)',
    '- 지옥소환사 오프닝·단일·광역(영웅 탭): 암흑의 수확 → 적개심 → 암흑시선 을 적개심 → 암흑시선 → 암흑의 수확 으로(광역은 적개심 → 수확) (근거: 레이드 반복 구간 적개심 직후 1~2회 안에 수확 18번, 반대 2번 — 6명 중 5명. 오프닝에서도 6개 중 4개가 수확을 적개심·암흑시선 앞에 두지 않음. APL HC_st·HC_aoe 는 dark_harvest → malevolence 순이지만 12.1.5 전 수정)',
    '- 연습 장 단일·오프닝·광역의 한 줄 원리·본문·요점, 쐐기 한 판 장의 한 줄 원리·본문·예시, 지옥소환사 장 본문을 같은 순서로 맞춤',
    '- 그대로 둔 것: 지옥소환사 광역의 출몰·씨앗·고통 순서(쐐기 로그 0개), 지옥소환사 오프닝의 적개심·암흑시선 앞뒤(로그 3:3), 지옥소환사 오프닝의 재앙의 손아귀(6개 중 2개 사용 — 고르지 않았을 때를 note에 적음)',
  ].join('\n'),
  apply(m) {
    const block = t => {
      const b = m.blocks.find(x => x.title.startsWith(t));
      if (!b) throw new Error('장을 못 찾음: ' + t);
      return b;
    };
    const sh = m.heroBranches.find(h => h.label === '영혼 수확자');
    const hc = m.heroBranches.find(h => h.label === '지옥소환사');

    // ── 영혼 수확자 영웅 탭 ──
    {
      const o = sh.opener.steps;
      const haunt = pick(o, '48181'), agony = pick(o, '980'), corr = pick(o, '172');
      const ua1 = pick(o, '1259790', 0), ua2 = pick(o, '1259790', 1), ua3 = pick(o, '1259790', 2), ua4 = pick(o, '1259790', 3);
      const harvest = pick(o, '1257052'), glare = pick(o, '205180');
      glare.phase = '극딜 시작';
      glare.trigger = '고통·부패 적용 뒤';
      glare.note = '상위 레이드 로그 다수처럼 수확보다 먼저 켭니다. 수확 정신 집중과 받은 조각 소비를 모두 소환 시간 안에 넣습니다. 곧 이동하거나 네임드가 사라질 구간이면 소환 시점을 먼저 판단합니다.';
      harvest.trigger = '암흑시선 중·채널 자리 확보';
      ua4.note = '남은 소비 기회를 회수합니다. 5조각에 오래 머물지 않게 하고, 일몰이 쌓였으면 다음 어둠의 화살로 넘어갑니다.';
      const bolt = {
        skillId: '686',
        label: '어둠의 화살',
        phase: '일몰 소비',
        trigger: '일몰 보유·소비 정리 뒤',
        note: '일몰이 붙은 어둠의 화살로 사악한 수확과 종지부를 회수합니다. 재앙의 손아귀를 골랐다면 암흑시선 중 이 자리에 씁니다. 이후는 이 순서 반복이 아니라 단일 우선순위로 돌아갑니다.',
      };
      sh.opener.steps = [haunt, agony, corr, glare, ua1, ua2, harvest, ua3, ua4, bolt];
      sh.opener.summary = '출몰 → 고통 → 부패 → 암흑시선 → 수확 순서의 예시입니다. 12.1.5 이후 상위 레이드 로그 다수처럼 암흑시선을 수확보다 먼저 켭니다. 처음 조각 수에 따라 반복 소비를 줄이고, 세트·가속 조건은 해당 특성과 장비가 있을 때만 적용합니다. 사전 소환수와 선택한 희생은 전투 전에 준비합니다.';

      const p = sh.singleTarget.priority;
      const sGlare = pick(p, '205180'), sHarvest = pick(p, '1257052');
      sGlare.note = '쿨이 돌았고 고통·부패가 걸려 있으면 켭니다. 수확도 준비됐다면 암흑시선을 먼저 켜고 그 안에서 수확합니다. 다음 피해 배정과 전투 종료 전 사용 횟수를 함께 봅니다.';
      sHarvest.note = '2조각 이하, 유지 DoT가 채널 끝까지 남는 상태에서 사용합니다. 암흑시선을 기다리며 미루지 않고, 쏟아지는 재앙·4세트 준비도 짧게만 기다립니다.';
      const grasp1 = pick(p, '1261153', 0);
      grasp1.note = '재앙의 손아귀를 골랐다면 암흑시선 중 일몰이 많이 쌓였거나 소환이 곧 끝날 때 우선 확인합니다. 대상의 불안정한 고통을 준비하고 이동 전에 채널을 회수할 수 있는지 봅니다.';
      sh.singleTarget.priority = [p[0], p[1], p[2], sGlare, sHarvest, grasp1, ...p.slice(6)];

      const a = sh.aoe.priority;
      const aHaunt = pick(a, '48181'), aSeedSpread = pick(a, '27243', 0), aHarvest = pick(a, '1257052'), aSeedSet = pick(a, '27243', 1);
      const aAgony = pick(a, '980'), aGlare = pick(a, '205180'), aGrasp = pick(a, '1261153'), aSeedSpend = pick(a, '27243', 2);
      const aUa = pick(a, '1259790'), aBolt = pick(a, '686');
      aAgony.note = '풀 시작에 오래 살 적 여럿에 먼저 겁니다. 상위 쐐기 로그는 씨앗보다 고통을 먼저 돌립니다. 고뇌 나눔으로 이미 걸린 적과 곧 죽을 쫄은 건너뛰고, 그 뒤에는 끝나기 전에만 갱신합니다.';
      aHaunt.note = '씨앗을 띄운 뒤 살아남을 우선 대상에 겁니다. 전체 광역을 위해 처리해야 할 적의 증폭을 놓치지 않습니다.';
      aGlare.note = '준비된 무리가 오래 살면 수확보다 먼저 켭니다. 광선의 여러 대상 적중은 황천의 장갑판과 적의 10미터 밀집 여부를 확인합니다.';
      sh.aoe.priority = [aAgony, aSeedSpread, aHaunt, aGlare, aHarvest, aSeedSet, aGrasp, aSeedSpend, aUa, aBolt];
      sh.aoe.summary = '씨앗 뿌리기를 선택한 밀집 3대상 이상 예시입니다. 풀 시작은 상위 쐐기 로그처럼 고통을 여럿에 먼저 걸고 씨앗으로 퍼뜨립니다. 미선택은 보통 6대상 이상에서 씨앗 소비를 고려하며, 두 대상·단일의 별도 조건과 짧게 죽는 적을 구분합니다.';
    }

    // ── 지옥소환사 영웅 탭 ──
    {
      const o = hc.opener.steps;
      const haunt = pick(o, '48181'), agony = pick(o, '980'), wither = pick(o, '445468');
      const harvest = pick(o, '1257052'), malev = pick(o, '442726'), glare = pick(o, '205180');
      const ua1 = pick(o, '1259790', 0), ua2 = pick(o, '1259790', 1), grasp = pick(o, '1261153'), ua3 = pick(o, '1259790', 2);
      glare.note = '암흑시선의 실제 공격 시간을 확보합니다. 상위 로그에서는 적개심과의 앞뒤가 반반으로 갈립니다. 둘을 연달아 켜고 다음 사용 횟수를 잃지 않습니다.';
      harvest.phase = '지속 피해';
      harvest.trigger = '적개심 뒤·서서 채널할 자리';
      harvest.note = '적개심의 가속 안에서 정신 집중합니다. 해로운 지속 효과가 있는 적에게 피해를 주며, 영혼 수확자와 달리 세 조각을 공급하는 단계가 아닙니다.';
      grasp.note = '재앙의 손아귀를 골랐다면 준비한 지속 피해를 회수합니다. 고르지 않았다면 이 자리에 어둠의 화살이나 영혼 흡수를 씁니다. 고정된 8초 중단 규칙은 적용하지 않습니다.';
      hc.opener.steps = [haunt, agony, wither, malev, glare, harvest, ua1, ua2, grasp, ua3];
      hc.opener.summary = '출몰 → 쇠퇴 → 적개심 → 암흑시선 → 수확 순서의 단일 예시입니다. 상위 레이드 로그처럼 적개심을 수확보다 먼저 켭니다. 쇠퇴 전파가 필요한 광역에서는 씨앗과 대상 준비를 먼저 보며, 수확의 조각 재충전을 전제로 하지 않습니다.';

      const p = hc.singleTarget.priority;
      const sHarvest = pick(p, '1257052'), sMalev = pick(p, '442726'), sGlare = pick(p, '205180');
      sMalev.note = '쇠퇴가 준비된 적에게 사용합니다. 수확이 함께 준비됐다면 적개심을 먼저 켜고 바로 수확합니다. 암흑시선만 기다리며 60초 적개심의 횟수를 줄이지 않습니다.';
      sHarvest.note = '적개심 직후, 지속 피해가 채널 끝까지 남고 적이 유효할 때 사용합니다. 조각 두 개 이하를 영혼 수확자와 같은 필수 재충전 조건으로 적용하지 않습니다.';
      hc.singleTarget.priority = [p[0], p[1], p[2], sMalev, sGlare, sHarvest, ...p.slice(6)];

      const a = hc.aoe.priority;
      const aHarvest = pick(a, '1257052'), aAgony = pick(a, '980'), aMalev = pick(a, '442726');
      aMalev.note = '씨앗으로 쇠퇴가 퍼지고 대상 수와 수명이 준비되면 수확보다 먼저 사용합니다. 시작 중첩과 붕괴를 피해로 회수할 수 있어야 하며 끝난 무리에 늦게 켜지 않습니다.';
      aHarvest.note = '적개심 뒤, 지속 피해가 묻은 무리가 채널 동안 살아남으면 사용합니다. 이 영웅 특성에서 조각 재충전은 기대하지 않습니다.';
      hc.aoe.priority = [a[0], a[1], aMalev, aHarvest, aAgony, ...a.slice(5)];
    }

    // ── 2부 단일 연습 ──
    {
      const b = block('훈련용 허수아비로 하는 첫 연습');
      b.concept = '단일은 위에서부터 조건을 보고 처음으로 맞는 스킬을 씁니다. 출몰 유지 → 고통·부패 유지 → 암흑시선·수확 → 발동 소비 → 조각 소비 → 필러 순서로 생각하면 됩니다.';
      b.paragraphs[0] = '영혼 수확자 단일 우선순위를 줄이면 이렇습니다. 유령 출몰 → 고통 갱신 → 부패 유지 → 암흑시선 소환(쿨이 돌았을 때, 수확보다 먼저) → 암흑의 수확(2조각 이하, 지속 피해가 채널 끝까지 남을 때) → 재앙의 손아귀(골랐다면, 암흑시선 중 일몰이 쌓였거나 소환이 곧 끝날 때) → 어둠의 화살(암흑시선 밖에서 일몰이 쌓였을 때) → 조건부 무료 씨앗 → 불안정한 고통 → 재앙의 손아귀 → 어둠의 화살. 위쪽 스킬이라도 지금 조건이 맞지 않으면 건너뜁니다.';
      b.paragraphs[1] = rep(b.paragraphs[1], '지옥소환사라면 부패 자리에 쇠퇴를 쓰고, 적개심을 쇠퇴가 걸린 적에게 쓰며,', '지옥소환사라면 부패 자리에 쇠퇴를 쓰고, 적개심을 쇠퇴가 걸린 적에게 수확보다 먼저 쓰며,');
      const t = tlOf(b)[0];
      const loop = t.rails.find(r => r.loop);
      const n = loop.nodes;
      const harvestAbove = n[3].above, glareAbove = n[4].above;
      if (harvestAbove.skillId !== '1257052' || glareAbove.skillId !== '205180') throw new Error('단일 rail 위 가지가 예상과 다름');
      n[3] = {...n[3], above: {skillId: '205180', when: '쿨이 돌면 · 수확보다 먼저'}};
      n[4] = {...n[4], above: {skillId: '1257052', when: '2조각 이하 · 유지 주문 넉넉'}};
      loop.note = '조각이 5개에 가까우면 어느 자리에서든 불안정한 고통이 먼저입니다. 무료 발동이 끝나 가면 소비를 미루지 않습니다. 재앙의 손아귀는 그 특성을 골랐을 때만 씁니다. 영혼 흡수를 골랐다면 어둠의 화살 자리를 영혼 흡수로 바꿉니다.';
      const ins = t.rails.find(r => r.kind === 'inserts');
      const mal = ins.nodes.find(x => x.skillId === '442726');
      mal.caption = '지옥소환사 · 수확보다 먼저';
    }

    // ── 2부 오프닝 연습 ──
    {
      const b = block('쿨기와 오프닝');
      b.concept = '영혼 수확자 오프닝은 출몰 → 고통 → 부패로 준비하고 암흑시선을 먼저 켭니다. 불안정한 고통으로 조각을 두 개 이하로 줄인 뒤 수확을 끝까지 정신 집중하고, 받은 조각을 쓴 다음 단일 우선순위로 넘어갑니다.';
      b.paragraphs[1] = rep(b.paragraphs[1], '이어서 고통과 부패를 걸고 불안정한 고통으로 첫 소비를 합니다.', '이어서 고통과 부패를 걸고 암흑시선을 켠 뒤, 불안정한 고통으로 첫 소비를 합니다.');
      b.paragraphs[2] = '수확 직전에는 조각 두 개 이하와 지속 피해의 남은 시간을 확인합니다. 죽음의 그림자로 정신 집중 중 매초 조각 1개, 기본 세 조각이 들어오니 받을 자리를 만들어 두는 것입니다. 수확은 암흑시선이 나와 있는 동안 끝까지 정신 집중하고, 받은 조각을 불안정한 고통으로 씁니다. 그다음 일몰이 붙은 어둠의 화살을 쓰고 단일 우선순위로 넘어갑니다. 12.1.5 이후 상위 레이드 로그 6개 중 4개가 이렇게 암흑시선을 수확보다 먼저 켰습니다. 9월 19일 공개 시뮬레이션 우선순위는 수확 뒤에 암흑시선을 두지만, 12.1.5 전 자료라 로그 쪽을 따랐습니다. 재앙의 손아귀를 골랐다면 암흑시선 중 어둠의 화살 자리에 씁니다. 대조한 상위 레이드 영혼 수확자 로그에서는 손아귀를 쓰지 않았습니다.';
      b.paragraphs[3] = rep(b.paragraphs[3], '수확 → 적개심 → 암흑시선을 거친 뒤 준비한 조각을 소비합니다.', '적개심 → 암흑시선 → 수확을 거친 뒤 준비한 조각을 소비합니다. 상위 로그에서는 적개심을 켠 직후 수확을 쓰는 순서가 꾸준히 나옵니다. 적개심의 가속 8% 안에서 정신 집중하는 셈입니다.');
      b.bullets[0] = '영혼 수확자: 암흑시선을 먼저 켜고, 조각 두 개 이하에서 수확을 끝까지 정신 집중합니다.';
      const t = tlOf(b)[0];
      t.intro = '전투 전 사전 시전부터 첫 소비 묶음까지입니다. 마지막 아이콘 뒤에는 정해진 순서가 아니라 단일 반복 흐름으로 돌아갑니다.';
      const shRail = t.rails.find(r => r.label.includes('영혼 수확자'));
      shRail.nodes = [
        {skillId: '48181', caption: '사전 시전 · 풀 타이머'},
        {skillId: '980', caption: '중첩과 조각 시작'},
        {skillId: '172', caption: '일몰 준비'},
        {skillId: '205180', caption: '수확 전 · 극딜 시작'},
        {skillId: '1259790', caption: '첫 소비'},
        {skillId: '1259790', caption: '2조각 이하 · 가속 준비'},
        {skillId: '1257052', caption: '끝까지 · 조각 셋'},
        {skillId: '1259790', caption: '받은 조각 소비'},
        {skillId: '1259790', caption: '남은 소비 회수'},
        {skillId: '686', caption: '일몰 소비 · 이후 단일'},
      ];
      shRail.note = '처음 조각이 적으면 반복 소비를 줄입니다. 암흑시선 앞뒤에 넣는 불안정한 고통 수는 로그마다 다릅니다. 재앙의 손아귀를 골랐다면 마지막 어둠의 화살 자리에 씁니다. 쏟아지는 재앙·4세트 조건은 그 특성과 장비가 있을 때만 챙깁니다.';
      const hcRail = t.rails.find(r => r.label.includes('지옥소환사'));
      hcRail.nodes = [
        {skillId: '48181', caption: '사전 시전 · 우선 대상'},
        {skillId: '980', caption: '유지 준비'},
        {skillId: '445468', caption: '부패 대신 쇠퇴'},
        {skillId: '442726', caption: '쇠퇴 걸린 적에'},
        {skillId: '205180', caption: '공격 시간 확보'},
        {skillId: '1257052', caption: '적개심 가속 안에서'},
        {skillId: '1259790', caption: '같은 적의 쇠퇴 확인'},
        {skillId: '1259790', caption: '조각·무료 발동'},
        {skillId: '1261153', caption: '추가 틱 회수'},
        {skillId: '1259790', caption: '이후 단일 흐름으로'},
      ];
      hcRail.note = '광역 풀이라면 적개심 전에 씨앗으로 쇠퇴를 먼저 퍼뜨립니다. 수확 자리는 로그마다 조금 다릅니다(적개심·암흑시선 바로 뒤, 또는 첫 소비 뒤). 수확이 조각을 다시 채워 준다는 전제를 두지 않습니다. 재앙의 손아귀를 고르지 않았다면 그 자리에 어둠의 화살이나 영혼 흡수를 씁니다.';
    }

    // ── 2부 광역 연습 ──
    {
      const b = block('광역: 전파와 소비를 나눠 봅니다');
      b.concept = '영혼 수확자는 적이 모이면 오래 살 적 여럿에 고통을 먼저 걸고, 씨앗으로 부패를 퍼뜨린 뒤 암흑시선·수확을 쓰고 조각을 씨앗이나 불안정한 고통으로 씁니다. 씨앗 뿌리기가 있으면 3대상부터, 없으면 보통 6대상부터 씨앗 소비를 고려합니다.';
      b.paragraphs[0] = rep(b.paragraphs[0], '무리가 모이면 씨앗으로 부패를 먼저 퍼뜨립니다.', '무리가 모이면 오래 살 적 여럿에 고통을 먼저 걸고, 씨앗으로 부패를 퍼뜨립니다. 12.1.5 이후 상위 쐐기 영혼 수확자 로그는 광역 풀마다 고통을 여러 번 건 뒤 씨앗을 시작했습니다.');
      b.paragraphs[1] = rep(b.paragraphs[1], '지속 피해가 묻은 적들이 정신 집중 동안 살아 있으면 수확을 쓰고, 무리가 충분히 오래 살면 암흑시선을 켭니다.', '무리가 충분히 오래 살면 암흑시선을 먼저 켜고, 지속 피해가 묻은 적들이 정신 집중 동안 살아 있으면 수확을 씁니다.');
      b.paragraphs[2] = rep(b.paragraphs[2], '고통은 무리 전체의 숫자보다 남은 수명으로 고릅니다.', '풀 시작에 거는 고통도 무리 전체의 숫자보다 남은 수명으로 고릅니다.');
      b.paragraphs[2] = rep(b.paragraphs[2], '출몰은 광역에서도 처리할 우선 대상에 유지합니다.', '출몰은 광역에서도 처리할 우선 대상에 유지합니다. 지옥소환사는 이번에 쐐기 로그가 없어 영웅 특성 탭의 순서(출몰 → 씨앗 전파 → 적개심 → 수확 → 고통)를 따릅니다.');
      b.bullets[0] = '먼저 퍼뜨리고(고통 여럿 → 씨앗), 그다음 쿨기(암흑시선 → 수확), 그다음 소비.';
      const t = tlOf(b)[0];
      const loop = t.rails.find(r => r.loop);
      loop.nodes = [
        {skillId: '980', caption: '오래 살 적 여럿에 먼저'},
        {skillId: '27243', caption: '전파 · 대기 씨앗 없을 때'},
        {skillId: '48181', caption: '오래 살 우선 대상에'},
        {skillId: '1257052', caption: '지속 피해 묻은 무리에', above: {skillId: '205180', when: '무리가 오래 살면 · 먼저'}},
        {skillId: '27243', caption: '조각·무료 발동 광역 소비', above: {skillId: '1261153', when: '암흑시선 중 일몰이 쌓이면'}},
        {skillId: '1259790', caption: '우선 대상 집중이 필요하면'},
        {skillId: '27243', caption: '모여 있으면 씨앗 소비'},
        {skillId: '686', caption: '할 일이 없을 때'},
      ];
      const ins = t.rails.find(r => r.kind === 'inserts');
      const mal = ins.nodes.find(x => x.skillId === '442726');
      mal.caption = '지옥소환사 · 퍼진 뒤 수확 전';
    }

    // ── 3부 쐐기 한 판 ──
    {
      const b = block('쐐기 한 판');
      b.concept = '쐐기에서는 탱커가 적을 모을 때까지 준비하고, 모이면 오래 살 적 여럿에 고통을 걸고 씨앗으로 퍼뜨린 뒤 암흑시선·수확과 광역 소비를 몰아 씁니다. 오래 살 적에 고통·출몰을 유지하고, 곧 죽을 쫄마다 주문을 따로 걸지 않습니다.';
      b.paragraphs[0] = rep(b.paragraphs[0], '적이 멈추면 씨앗으로 부패를 퍼뜨리고, 오래 살 우선 대상에 출몰과 고통을 겁니다. 지속 피해가 묻은 적들이 정신 집중 동안 살아 있으면 수확을 쓰고, 무리가 충분히 오래 살면 암흑시선을 켭니다.', '적이 멈추면 오래 살 적 여럿에 고통을 먼저 걸고, 씨앗으로 부패를 퍼뜨린 뒤 우선 대상에 출몰을 겁니다. 무리가 충분히 오래 살면 암흑시선을 켜고, 지속 피해가 묻은 적들이 정신 집중 동안 살아 있으면 수확을 씁니다. 12.1.5 이후 상위 쐐기 로그의 광역 풀 시작 7개는 모두 고통을 여러 번 먼저 걸었고, 대부분 씨앗 → 출몰 → 암흑시선이 뒤따랐습니다.');
      b.paragraphs[2] = rep(b.paragraphs[2], '곧 죽을 쫄마다 고통을 손으로 걸면 실제 피해 시간이 늦어집니다.', '풀 시작에 오래 살 적 여럿에 고통을 거는 것과 달리, 곧 죽을 쫄마다 고통을 손으로 걸면 실제 피해 시간이 늦어집니다.');
      b.paragraphs[3] = rep(b.paragraphs[3], '씨앗 전파와 고통 유지로 시작합니다.', '고통과 씨앗 전파로 시작합니다.');
      b.example.text = rep(b.example.text, '적이 멈추면 씨앗으로 부패를 퍼뜨리고, 오래 살 시전자에 출몰과 고통을 겁니다. 수확과 암흑시선을 쓰고 조각은 씨앗으로 씁니다.', '적이 멈추면 시전자 둘과 큰 쫄에 고통을 먼저 걸고, 씨앗으로 부패를 퍼뜨린 뒤 오래 살 시전자에 출몰을 겁니다. 암흑시선을 켜고 수확을 쓴 다음 조각은 씨앗으로 씁니다.');
    }

    // ── 4부 지옥소환사 ──
    {
      const b = block('지옥소환사');
      b.paragraphs[0] = rep(b.paragraphs[0], '이번 미국·한국 로그 대조에 나오지 않았지만', '10월 8일 미국·한국 로그 대조에는 나오지 않았지만');
      b.paragraphs[2] = rep(b.paragraphs[2], '적개심의 수치와 활성 시간이 달라집니다.', '적개심의 수치와 활성 시간이 달라집니다. 12.1.5 이후 상위 레이드 로그에서는 적개심을 켠 직후(2분마다는 암흑시선 뒤) 수확을 쓰는 순서가 꾸준히 나옵니다.');
      b.bullets[0] = '쇠퇴 걸기 → 적개심 → 수확 → 같은 적에게 불안정한 고통 소비가 기본 순서입니다.';
    }
    return m;
  },
};
