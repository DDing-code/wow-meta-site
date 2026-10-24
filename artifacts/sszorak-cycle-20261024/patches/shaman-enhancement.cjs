// shaman-enhancement 단일 딜사이클 스조라크 대조 — 근거: digests/shaman-enhancement.md, apl/shaman_enhancement.simc, sources/shaman-enhancement.txt
// 폭풍인도자만 고친다. 토템술사는 12.1.5 구간 스조라크 상위 로그가 없어 그대로 둔다.
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const rep = (text, from, to) => { if (!text.includes(from)) throw new Error('바꿀 문장을 못 찾음: ' + from.slice(0, 30)); return text.replace(from, to); };

module.exports = {
  evidenceNote: '단일 딜사이클 스조라크 대조(2026-10-24): 스조라크 신화(12.1.5) WCL 상위 로그 10개(모두 폭풍인도자)의 실제 시전 순서와 심크 우선순위(midnight 3af1a757)·Icy Veins·Method 프리풀을 대조해, 폭풍인도자 오프닝의 풀링 전 낙뢰를 빼고(심크 우선순위 precombat 에 없고 로그 풀 전 시전 0개) 전격의 불길 → 낙뢰 → 승천 → 바람의 일격 순서로 고쳤습니다. 세계의 분리·용암 채찍은 10개 모두 오프닝에 쓰지 않아 고른 경우에만 넣는 메모로 옮겼습니다. 단일 반복 흐름은 로그와 맞아 그대로 두었고, 토템술사는 스조라크 로그가 없어 바꾸지 않았습니다.',
  changelog: [
    '- 폭풍인도자 오프닝(연습 장 타임라인·영웅 탭): 낙뢰(사전) → 전격의 불길 → 세계의 분리 → 용암 채찍 → 승천 → 바람의 일격 → 낙뢰 → 전격의 불길 → 낙뢰 → 승천 → 바람의 일격 → 낙뢰 (근거: 스조라크 로그 10개 중 7개가 전격의 불길로 시작, 6개가 승천 전에 낙뢰, 10개 모두 세계의 분리·용암 채찍 없이 풀링 뒤 1.5~4.8초에 승천. 풀 전 시전 0개, 심크 우선순위 precombat 은 무기 강화·번개 보호막·물약뿐. 예: https://www.warcraftlogs.com/reports/g1HG8nXjBcTZ46NR#fight=57&source=16)',
    '- 세계의 분리(태고의 폭풍·솟구치는 정기)·용암 채찍(채찍 화염)은 골랐을 때만 승천 앞에 넣는다는 메모로 옮김(심크 우선순위 single_sb 의 sundering·lava_lash 조건, Icy Veins 오프닝)',
    '- 오프닝 장 한 줄 원리·본문·요점·확인 문제를 같은 순서로 맞춤',
    '- 단일 반복 rail·영웅 탭 단일 우선순위: 그대로 (전격의 불길 → 낙뢰 49%, 낙뢰 → 폭풍의 일격 71%, 폭풍의 일격 ↔ 번개 화살 약 6할. 파멸의 바람 8.45/분은 승천 중 자동으로 나가는 469270 이라 버튼으로 넣지 않음)',
    '- 토템술사: 스조라크 로그 0개라 바꾸지 않음',
  ].join('\n'),
  apply(m) {
    const block = t => m.blocks.find(b => b.title.startsWith(t));

    const opener = block('쿨기와 오프닝');
    opener.concept = rep(opener.concept, '폭풍인도자는 낙뢰·전격의 불길 뒤 승천', '폭풍인도자는 전격의 불길·낙뢰 뒤 바로 승천');
    opener.paragraphs[0] = rep(opener.paragraphs[0],
      '폭풍인도자는 적을 당기지 않는 위치에서 낙뢰로 12초 강화를 미리 걸고, 전격의 불길로 화염 충격을 붙이며 들어갑니다. 세계의 분리는 태고의 폭풍·솟구치는 정기를 골랐을 때, 용암 채찍은 채찍 화염을 골랐을 때만 넣습니다.',
      '폭풍인도자는 전격의 불길로 화염 충격을 붙이며 들어가고, 낙뢰로 12초 강화를 건 뒤 바로 승천을 엽니다. 세계의 분리는 태고의 폭풍·솟구치는 정기를 골랐을 때, 용암 채찍은 채찍 화염을 골랐을 때만 승천 앞에 넣습니다.');
    opener.bullets = opener.bullets.map(s => (s.startsWith('상위 로그 한 건의 시작은')
      ? '스조라크 신화 상위 로그 10개는 모두 세계의 분리·용암 채찍 없이 풀링 뒤 몇 초 안에 승천을 열었습니다. 내 빌드에 없는 기술을 찾느라 승천을 늦추지 않습니다.' : s));
    if (!opener.bullets.some(s => s.startsWith('스조라크 신화 상위 로그 10개는'))) throw new Error('요점 못 찾음');
    opener.quiz = [
      {
        q: '폭풍인도자로 채찍 화염을 골랐습니다. 용암 채찍은 오프닝 어디에 넣을까요?',
        a: '승천 앞에 한 번 넣어 대상의 화염 충격 피해를 강화합니다. 고르지 않았다면 넣지 않고 전격의 불길·낙뢰 뒤 바로 승천을 엽니다. 선택하지 않은 효과를 위해 승천을 늦추지 않습니다.',
      },
    ];
    const sb = tlOf(opener)[0].rails.find(r => r.label.startsWith('폭풍인도자 오프닝'));
    sb.nodes = [
      {skillId: '470057', caption: '풀링 · 화염 충격'},
      {skillId: '187874', caption: '승천 전 강화'},
      {skillId: '114051', caption: '계속 칠 수 있을 때'},
      {skillId: '115356', caption: '승천 직후 바로'},
      {skillId: '187874', caption: '다시 준비되면 사이에'},
    ];
    sb.note = '스조라크 신화 상위 로그 10개 중 7개가 전격의 불길로 시작했고, 6개가 승천 전에 낙뢰를 썼습니다. 낙뢰를 전격의 불길보다 먼저 쓰거나 승천 뒤로 미룬 로그도 있습니다. 세계의 분리·채찍 화염을 골랐다면 승천 앞에 넣습니다. 승천을 열면 바람의 일격부터 씁니다. 하강하는 하늘을 골랐다면 승천으로 폭풍이 준비되는 것도 봅니다.';

    const hero = m.heroBranches.find(h => h.label === '폭풍인도자');
    hero.opener.summary = '수동 승천·토림의 기원 예시입니다. 전격의 불길과 낙뢰 뒤 바로 승천을 엽니다. 세계의 분리·채찍 화염은 선택했을 때만 승천 앞에 넣으며, 진입 후에는 고정 순서보다 세트로 돌아오는 전격의 불길·낙뢰를 확인합니다.';
    const s = hero.opener.steps;
    const by = (id, i = 0) => s.filter(x => x.skillId === id)[i];
    hero.opener.steps = [
      {...by('470057'), trigger: '풀링 · 주 대상 사거리'},
      {...by('187874', 0), phase: '승천 준비', trigger: '승천 전', note: '12초 강화 효과를 걸고 승천으로 넘어갑니다. 스조라크 상위 로그 10개 중 6개가 승천 전에 썼습니다.'},
      {...by('114051'), note: '파멸의 바람을 따로 누르지 않습니다. 세계의 분리·채찍 화염을 골랐다면 그 둘을 먼저 넣습니다. 하강하는 하늘을 선택했다면 폭풍이 준비되는 것도 확인합니다. 이동·면역 직전에는 공격 시간을 잃지 않도록 주의합니다.'},
      by('115356'),
      by('187874', 1),
    ];
    return m;
  },
};
