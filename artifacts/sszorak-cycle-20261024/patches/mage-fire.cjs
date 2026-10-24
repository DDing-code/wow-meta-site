// mage-fire 단일 딜사이클 스조라크 대조 — 근거: digests/mage-fire.md, apl/mage_fire.simc, sources/mage-fire.txt
// 성난태양 로그 8개. 오프닝·발화 진입·평시 순서가 로그와 맞아 순서는 그대로 두고, 프리풀 불덩이 작렬 표시와 근거 문장만 바꾼다.
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const rep = (text, from, to) => { if (!text.includes(from)) throw new Error('바꿀 문장을 못 찾음: ' + from.slice(0, 30)); return text.replace(from, to); };

module.exports = {
  evidenceNote: '단일 딜사이클 스조라크 대조(2026-10-24): 스조라크 신화(12.1.5) WCL 상위 로그 8개(모두 성난태양)의 실제 시전 순서와 심크 우선순위(midnight 3af1a757)·Icy Veins·Method 프리풀을 대조했습니다. 풀링 직전 불덩이 작렬 미리 시전은 심크 우선순위 전투 전 목록·Method 오프닝이 같고 로그 8개 중 4개가 풀 0.0~0.3초에 불덩이 작렬을 맞혀 전투 전 단계로 표시했습니다. 첫 발화는 로그 8개 모두 풀 뒤 15~35초에 썼고, 발화 43번 모두 불덩이 작렬 직접 시전 중에 켰으며 그중 39번은 바로 앞에 유성을 눌러 지금 순서와 같았습니다. 평시 반복(화염 작렬 다음 불덩이 작렬 84%)도 맞아 순서는 바꾸지 않았습니다. 서리불꽃은 로그가 없어 순서를 바꾸지 않았습니다.',
  changelog: [
    '- 오프닝 첫 불덩이 작렬(성난태양·서리불꽃 연습 장 rail 캡션, 영웅 탭 1번)을 전투 전·풀링 직전 미리 시전으로 표시 (근거: 심크 우선순위 precombat `pyroblast`(영웅 특성 조건 없음), Method 오프닝 "precasting Pyroblast", 성난태양 로그 4/8이 풀 0.0~0.3초에 불덩이 작렬 완료, 2/8은 화염구 미리 시전)',
    '- 발화 10초 rail note·오프닝 장 본문의 근거 문장을 님리사(12.1.5 레이드 5개 중 4개)에서 스조라크 상위 로그 8개(발화 43번 중 39번이 유성 → 불덩이 작렬 직접 시전 → 발화)로 바꿈. 예: https://www.warcraftlogs.com/reports/vH8x4DXqjbQAYzMr#fight=39&source=238',
    '- 그대로 둔 것: 성난태양 오프닝·발화 진입·평시 반복·영웅 탭 단일 우선순위(로그와 심크 우선순위 sf_combustion·sf_filler 목록과 맞음), 서리불꽃 순서(스조라크 로그 없음)',
  ].join('\n'),
  apply(m) {
    const block = t => m.blocks.find(b => b.title.startsWith(t));

    // 2부 단일 연습: 발화 rail 근거
    const single = block('첫 연습은 단일 대상');
    const comb = tlOf(single)[0].rails.find(r => r.label.startsWith('발화 10초'));
    comb.note = rep(comb.note, '12.1.5 상위 레이드 로그 5개 중 4개가 이 순서였습니다.', '스조라크 신화 상위 로그 8개에서도 발화 43번 중 39번이 이 순서였습니다.');

    // 2부 오프닝 연습
    const opener = block('쿨기와 오프닝');
    opener.paragraphs[0] = rep(opener.paragraphs[0],
      '방화광을 고른 일반적인 시작은 풀에 맞춘 불덩이 작렬 직접 시전입니다.',
      '방화광을 고른 일반적인 시작은 풀링 직전에 미리 시전한 불덩이 작렬입니다.');
    opener.paragraphs[2] = rep(opener.paragraphs[2], '12.1.5 상위 레이드 로그 5개 중 4개가 이 순서였습니다.', '스조라크 신화 상위 로그 8개에서도 발화 43번 모두 불덩이 작렬 직접 시전 중에 켰고, 그중 39번은 바로 앞에 유성을 눌렀습니다.');
    for (const r of tlOf(opener)[0].rails) {
      if (String(r.nodes[0].skillId) === '11366' && r.nodes[0].caption === '풀에 맞춘 직접 시전') r.nodes[0] = {...r.nodes[0], caption: '풀링 직전 미리 시전'};
      else throw new Error('오프닝 첫 칸이 예상과 다름: ' + r.label);
    }

    // 영웅 특성 탭 — 두 영웅 특성 오프닝 첫 칸
    for (const h of m.heroBranches) {
      const s = h.opener.steps[0];
      if (String(s.skillId) !== '11366') throw new Error('영웅 탭 첫 칸이 불덩이 작렬이 아님: ' + h.label);
      h.opener.steps[0] = {...s, phase: '전투 전', trigger: '풀링 직전'};
    }
    return m;
  },
};
