// evoker-augmentation 단일 딜사이클 스조라크 대조 — 근거: digests/evoker-augmentation.md, apl/evoker_augmentation.simc, sources/evoker-augmentation.txt
// 시간 감시자 로그 10개는 지금 오프닝·반복과 맞는다. 비늘사령관은 로그가 없어 풀링 뒤 순서는 그대로 두고 프리풀 시각만 공개 가이드로 맞춘다.
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const rep = (text, from, to) => { if (!text.includes(from)) throw new Error('바꿀 문장을 못 찾음: ' + from.slice(0, 30)); return text.replace(from, to); };

module.exports = {
  evidenceNote: '단일 딜사이클 스조라크 대조(2026-10-24): 스조라크 신화(12.1.5) WCL 상위 로그 10개(모두 시간 감시자)의 실제 시전 순서와 심크 우선순위(midnight 3af1a757)·Icy Veins·Method 프리풀을 대조했습니다. 끓어오르는 비늘과 필러 미리 시전은 심크 우선순위 전투 전 목록과 Icy Veins가 같아 그대로 두고, 필러 시각을 Icy Veins 기준 풀링 1.5초 전으로 적었습니다(시간 감시자 로그 10개 중 8개가 풀 0.1~0.7초에 시간의 불꽃 완료). 시간 감시자 오프닝(예지 두 번 → 영겁의 숨결 → 칠흑의 힘 → 전세역전 → 불의 숨결 → 지각 변동 → 시간 건너뛰기 → 불의 숨결 → 지각 변동 → 분출)은 로그와 맞아 순서를 바꾸지 않았고, 근거 문장만 스조라크로 바꿨습니다. 비늘사령관은 로그가 없어 풀링 뒤 순서를 바꾸지 않았습니다.',
  changelog: [
    '- 오프닝 필러 미리 시전 시각: 시간 감시자 시간의 불꽃·비늘사령관 살아있는 불꽃을 "풀 타이머에 맞춰" → "풀링 1.5초 전"(연습 장 rail 캡션·영웅 탭 trigger·오프닝 장 본문) (근거: Icy Veins "Precast Chrono Flame 1.5s"·"Precast Living Flame at 1.5s", 심크 우선순위 precombat `living_flame`, Method "Pre-cast Living Flame", 시간 감시자 로그 8/10이 풀 0.1~0.7초에 시간의 불꽃 완료)',
    '- 시간 감시자 오프닝 근거 문장: 12.1.5 레이드 6개 → 스조라크 상위 로그 10개 중 7개가 시간 건너뛰기 뒤 불의 숨결·지각 변동을 한 번 더 쓴 뒤 분출 시작. 첫 칠흑의 힘을 영겁의 숨결보다 먼저 건 로그 4/10(뒤 6/10)을 rail note 에 "로그마다 다름"으로 적음. 예: https://www.warcraftlogs.com/reports/j4mzNJ6P9TBYb7wM#fight=16&source=9',
    '- 그대로 둔 것: 끓어오르는 비늘 전투 전 단계(심크 우선순위 precombat `blistering_scales,target_if=target.role.tank`, Icy Veins "Cast Blistering Scales on the main tank"), 시간 감시자 단일 반복(불의 숨결 뒤 지각 변동, 지각 변동 뒤 분출 80%), 비늘사령관 풀링 뒤 순서(스조라크 로그 없음)',
  ].join('\n'),
  apply(m) {
    const block = t => m.blocks.find(b => b.title.startsWith(t));

    const opener = block('쿨기와 오프닝');
    opener.paragraphs[0] = rep(opener.paragraphs[0], '풀 타이머에 맞춰 필러를 하나 미리 시전합니다.', '풀링 1.5초 전에 필러를 하나 미리 시전합니다.');
    opener.paragraphs[1] = rep(opener.paragraphs[1],
      '12.1.5 이후 상위 레이드 시간 감시자 로그 6개가 모두 이렇게 두 강화 주문을 한 번씩 더 쓴 뒤 분출을 시작했습니다.',
      '스조라크 신화 상위 시간 감시자 로그 10개 중 7개가 이렇게 두 강화 주문을 한 번씩 더 쓴 뒤 분출을 시작했습니다.');
    const rails = tlOf(opener)[0].rails;
    const cw = rails.find(r => r.label === '오프닝 — 시간 감시자');
    if (String(cw.nodes[1].skillId) !== '431443') throw new Error('시간 감시자 두 번째 칸이 시간의 불꽃이 아님');
    cw.nodes[1] = {...cw.nodes[1], caption: '풀링 1.5초 전'};
    cw.note = rep(cw.note, '그 자리는 로그마다 다릅니다.', '그 자리는 로그마다 다릅니다. 첫 칠흑의 힘도 스조라크 상위 로그 10개 중 4개는 영겁의 숨결보다 먼저 걸었습니다.');
    const sc = rails.find(r => r.label === '오프닝 — 비늘사령관');
    if (String(sc.nodes[1].skillId) !== '361469') throw new Error('비늘사령관 두 번째 칸이 살아있는 불꽃이 아님');
    sc.nodes[1] = {...sc.nodes[1], caption: '풀링 1.5초 전'};

    for (const h of m.heroBranches) {
      const s = h.opener.steps[1];
      if (!['431443', '361469'].includes(String(s.skillId))) throw new Error('영웅 탭 두 번째 칸이 필러가 아님: ' + h.label);
      h.opener.steps[1] = {...s, trigger: '풀링 1.5초 전'};
    }
    return m;
  },
};
