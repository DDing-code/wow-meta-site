// evoker-devastation 후속(2026-10-20, 사용자 "다 최신 메타에 맞게"): 1부 강화 주문 그림의 하늘빛 휩쓸기 칸을 '골랐을 때만'으로 표시한다.
// 근거: 특성 견본 3개(모두 비늘사령관)에 하늘빛 휩쓸기(노드 93273)가 없고, 12.1.5 상위 비늘사령관 로그도 쓰지 않음.
// 불꽃형성자 쐐기 2명 중 1명은 썼으므로 칸을 지우지 않고 선택 특성으로 표시한다.
const must = (cond, what) => { if (!cond) throw new Error('evoker-devastation 후속: 찾지 못함 — ' + what); };

module.exports = function followup(m) {
  const b = m.blocks.find(x => x.title.startsWith('불의 숨결과 영원의 쇄도는'));
  must(b && b.diagram, '강화 주문 그림');
  const node = b.diagram.layers.flatMap(l => l.nodes || []).find(n => n.skillId === '1265872');
  must(node, '하늘빛 휩쓸기 칸');
  node.tag = '골랐을 때만';
  node.note = '기본 견본에는 없음 · 골랐다면 영원의 쇄도 뒤 다음 하늘빛 일격이 바뀜';
  m.evidence = [...(m.evidence || []).filter(x => !x.startsWith('최신 메타 후속')),
    '최신 메타 후속(2026-10-20): 1부 강화 주문 그림의 하늘빛 휩쓸기 칸을 "골랐을 때만"으로 표시했습니다. 특성 견본 3개(모두 비늘사령관)에 이 특성이 없고 12.1.5 이후 상위 비늘사령관 로그도 쓰지 않았습니다. 불꽃형성자 쐐기 기록 2명 중 1명은 써서 칸은 남겼습니다.'];
  return m;
};
