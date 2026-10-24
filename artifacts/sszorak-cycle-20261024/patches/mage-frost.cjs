// mage-frost 단일 딜사이클 스조라크 대조 — 근거: digests/mage-frost.md, apl/mage_frost.simc, sources/mage-frost.txt
// 주문술사 로그 9개는 지금 오프닝·반복과 맞는다. 서리불꽃은 로그 1개뿐이라 풀링 뒤 순서는 바꾸지 않는다(보고서에 보류로 적음).
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);

module.exports = {
  evidenceNote: '단일 딜사이클 스조라크 대조(2026-10-24): 스조라크 신화(12.1.5) WCL 상위 로그 10개(주문술사 9개·서리불꽃 1개)의 실제 시전 순서와 심크 우선순위(midnight 3af1a757)·Icy Veins·Method 프리풀을 대조했습니다. 첫 화살 미리 시전은 심크 우선순위 전투 전 목록과 Icy Veins(주문술사는 얼음 화살, 서리불꽃은 풀링 2초 전 얼음불꽃 화살)가 같고 주문술사 로그 9개 중 7개가 풀 0.2~0.5초에 얼음 화살을 맞혀 전투 전 단계로 표시했습니다. 주문술사 오프닝(얼음 화살 → 진눈깨비 → 얼어붙은 구슬 → 서리 광선 → 얼음창, 구슬 → 광선 7/9)과 평시 반복(진눈깨비 다음 얼음창 74%, 얼어붙은 구슬 다음 진눈깨비 81%)은 그대로 맞아 순서를 바꾸지 않았습니다. 서리불꽃은 로그가 1개뿐이라 풀링 뒤 순서를 바꾸지 않았습니다.',
  changelog: [
    '- 오프닝 첫 화살(연습 장 rail 캡션·영웅 탭 1번)을 전투 전 미리 시전으로 표시: 주문술사 얼음 화살 "풀링 직전", 서리불꽃 얼음불꽃 화살 "풀링 2초 전" (근거: 심크 우선순위 precombat `frostbolt`, Icy Veins 주문술사 "Pre-cast Frostbolt"·서리불꽃 "Pre-cast Frostfire Bolt at 2 seconds on the countdown", 주문술사 로그 7/9가 풀 0.2~0.5초에 얼음 화살 완료)',
    '- 그대로 둔 것: 주문술사 오프닝·평시 반복·영웅 탭 단일 우선순위(로그 9개와 심크 우선순위 spellslinger 목록에 맞음. 예: https://www.warcraftlogs.com/reports/nHavrDhPVtBYkMXA#fight=43&source=16)',
    '- 보류: 서리불꽃 오프닝 진눈깨비·서리 광선 순서 — 스조라크 로그 1개와 Icy Veins는 광선 → 진눈깨비 → 구슬, 예전 님리사 로그 5개 중 4개는 진눈깨비 먼저. 로그가 1개뿐이라 바꾸지 않음',
  ].join('\n'),
  apply(m) {
    const block = t => m.blocks.find(b => b.title.startsWith(t));

    // 2부 오프닝 연습 rail 첫 칸 캡션
    const opener = block('쿨기와 오프닝');
    const caps = {'오프닝 — 주문술사': ['116', '풀링 직전 미리 시전'], '오프닝 — 서리불꽃': ['431044', '풀링 2초 전 미리 시전']};
    for (const r of tlOf(opener)[0].rails) {
      const c = caps[r.label];
      if (!c || String(r.nodes[0].skillId) !== c[0]) throw new Error('오프닝 첫 칸이 예상과 다름: ' + r.label);
      r.nodes[0] = {...r.nodes[0], caption: c[1]};
    }

    // 영웅 특성 탭 오프닝 첫 칸
    const trig = {'주문술사': ['116', '풀링 직전'], '서리불꽃': ['431044', '풀링 2초 전']};
    for (const h of m.heroBranches) {
      const s = h.opener.steps[0];
      const t = trig[h.label];
      if (!t || String(s.skillId) !== t[0]) throw new Error('영웅 탭 첫 칸이 예상과 다름: ' + h.label);
      h.opener.steps[0] = {...s, phase: '전투 전', trigger: t[1]};
    }
    return m;
  },
};
