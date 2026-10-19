// warlock-demonology 딜사이클 순서 수정 — 근거: digests/warlock-demonology.md, apl/warlock_demonology.simc
// 악마학자 오프닝 끝부분만 고친다(폭군 → 굴단의 손 ×2 → 어둠의 화살 → 파열). 영혼 수확자는 12.1.5 이후 상위 로그가 없어 그대로 둔다.
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const rep = (text, from, to) => { if (!text.includes(from)) throw new Error('바꿀 문장을 못 찾음: ' + from.slice(0, 40)); return text.replace(from, to); };

module.exports = {
  evidenceNote: '딜사이클 순서 대조(2026-10-20): 12.1.5 이후 WCL 상위 레이드 8개·쐐기 8개(모두 악마학자)의 실제 시전 순서와 심크 APL(midnight d91a5707, 악마 APL은 8월 30일 수정)을 대조했습니다. 악마학자 오프닝은 레이드 8개 중 7개가 폭군 뒤 굴단의 손 두 번 → 어둠의 화살(또는 지옥불 화살) → 파열 순서여서, 파열 앞의 악마 화살·굴단의 손을 빼고 이 순서로 고쳤습니다. 단일·광역 우선순위와 반복 흐름은 로그(굴단의 손 ↔ 악마 화살 반복, 쐐기 풀마다 공포사냥개 → 폭군 → 굴단의 손 → 파열)와 맞아 바꾸지 않았고, 영혼 수확자는 상위 로그가 없어 그대로 두었습니다.',
  changelog: [
    '- 악마학자 오프닝(연습 장 타임라인·영웅 탭): … 폭군 → 굴단의 손 → 굴단의 손 → 악마 화살 → 굴단의 손 → 파열 을 … 폭군 → 굴단의 손 → 굴단의 손 → 어둠의 화살 → 파열 → 굴단의 손 으로 (근거: 상위 레이드 8개 중 7개가 두 번째 굴단의 손 뒤 어둠의 화살 1~2번(1개는 지옥불 화살) 다음 바로 파열 — 예 https://www.warcraftlogs.com/reports/F8DM36ZXTrxfhvbA#fight=28&source=20 ; 두 번째 악마 화살은 첫 12회 안에 3개만. APL diabolist 의 implosion,if=buff.wild_imps.stack>=6&talent.to_hell_and_back 이 hand_of_guldan 보다 위)',
    '- 오프닝 장 본문·요점에 같은 순서를 적음',
    '- 그대로 둔 것: 흑마법서·공포사냥개 앞뒤(로그 3:3, note에 "로그마다 다름"), 단일·광역 우선순위와 반복 rail(로그와 맞음), 파멸수호병 소환 행(상위 로그 사용 0회지만 "고른 빌드" 조건 행), 영혼 수확자 전체(12.1.5 이후 상위 로그 0개)',
  ].join('\n'),
  apply(m) {
    const block = t => {
      const b = m.blocks.find(x => x.title.startsWith(t));
      if (!b) throw new Error('장을 못 찾음: ' + t);
      return b;
    };
    const dia = m.heroBranches.find(h => h.label === '악마학자');
    {
      const s = dia.opener.steps;
      const ids = s.map(r => r.skillId).join(',');
      if (ids !== '264178,1276452,104316,686,265187,105174,105174,264178,105174,196277') throw new Error('악마학자 오프닝이 예상과 다름: ' + ids);
      const filler = {
        skillId: '686',
        label: '어둠의 화살',
        phase: '조각 보충',
        trigger: '1~2조각·핵 없음',
        note: '두 번째 굴단의 손 뒤 남은 조각을 채웁니다. 핵이 있으면 악마 화살을 쓰고, 지옥불 화살이 준비됐다면 2개 이하에서 3개를 받는 별도 조건을 봅니다.',
      };
      const implosion = {
        ...s[9],
        trigger: '임프 6마리·굴단의 손 불가',
        note: '폭군 뒤 두 번의 굴단의 손으로 임프가 모이면 바로 터뜨립니다. 지옥으로부터의 귀환으로 강화 임프를 돌려받습니다. 핵 상한이나 적의 사망이 임박하면 현재 조건을 다시 판단합니다.',
      };
      const hog = {
        ...s[8],
        note: '어둠의 화살·악마 화살로 3조각을 다시 채운 뒤 씁니다. 폭군이 끝났더라도 중간 노드 2점의 차원문은 25초이므로 남은 구간을 버리지 않습니다. 이후는 단일 우선순위로 돌아갑니다.',
      };
      dia.opener.steps = [s[0], s[1], s[2], s[3], s[4], s[5], s[6], filler, implosion, hog];
    }

    const b = block('쿨기와 오프닝');
    b.paragraphs[2] = rep(b.paragraphs[2], '마지막 아르거스 노드가 있으면 5개에서 굴단의 손을 쓴 뒤 3개가 남아 바로 한 번 더 쓸 수 있기 때문입니다.', '마지막 아르거스 노드가 있으면 5개에서 굴단의 손을 쓴 뒤 3개가 남아 바로 한 번 더 쓸 수 있기 때문입니다. 12.1.5 이후 상위 레이드 악마학자 로그 8개 중 7개는 그 두 번의 굴단의 손 뒤 어둠의 화살 한두 번을 거쳐 바로 파열을 썼습니다.');
    b.bullets = [b.bullets[0], b.bullets[1], b.bullets[2], '악마학자는 폭군 뒤 굴단의 손 두 번 → 어둠의 화살 → 파열 순서로 임프를 바꿉니다.', ...b.bullets.slice(3)];
    const t = tlOf(b)[0];
    const rail = t.rails.find(r => r.label.includes('악마학자'));
    rail.nodes = [
      {skillId: '264178', caption: '사전 시전 · 긴 화살'},
      {skillId: '1276452', caption: '조각 1개로 소환'},
      {skillId: '104316', caption: '공포사냥개 2마리'},
      {skillId: '686', caption: '5조각까지 · 사냥개 생존'},
      {skillId: '265187', caption: '5조각 · 극딜 시작'},
      {skillId: '105174', caption: '3개 쓰고 1개 반환'},
      {skillId: '105174', caption: '반환 뒤 연속 소비'},
      {skillId: '686', caption: '남은 조각 보충'},
      {skillId: '196277', caption: '임프 모이면 바로'},
      {skillId: '105174', caption: '3조각 모이면 · 차원문'},
    ];
    rail.note = '지옥수호병은 전투 전에 부릅니다. 흑마법서와 공포사냥개의 앞뒤는 로그마다 다릅니다. 이미 5조각이면 어둠의 화살 단계는 건너뛰고, 준비가 길어져 공포사냥개가 사라지지 않게 합니다.';
    return m;
  },
};
