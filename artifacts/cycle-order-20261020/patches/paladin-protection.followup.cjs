// paladin-protection 후속(2026-10-20, 사용자 "다 최신 메타에 맞게"): 쐐기 광역 우선순위표를 풀 시작 순서로.
// 근거(이미 2부 타임라인에 반영한 것과 같음): 쐐기 풀 시작 7개 중 6개가 처음 두 번 안에 축복받은 망치,
// 풀 21개 중 18개가 심판 → 응징의 방패, 19개 중 16개가 심판 → 신성화, 파수꾼·천상의 종을 쓴 풀 7개 모두 응징의 방패가 먼저.
const must = (cond, what) => { if (!cond) throw new Error('paladin-protection 후속: 찾지 못함 — ' + what); };

const LEAD = {
  '204019': '풀에 달려가며 먼저 써서 신성한 힘을 모으고 보복의 인장을 겁니다. 상위 쐐기 풀 시작 7개 중 6개가 처음 두 번 안에 썼습니다. 그 뒤에도 망치가 실제 적에게 닿도록 씁니다.',
  '275779': '먼저 닿는 적에게 심판을 써서 선봉대와 자원을 준비합니다. 상위 쐐기 풀 21개 중 18개는 응징의 방패보다 심판이 먼저였습니다. 중요한 적의 재결도 함께 유지합니다.',
};

module.exports = function followup(m) {
  for (const h of m.heroBranches) {
    const p = h.aoe.priority;
    const take = id => { const i = p.findIndex(r => r.skillId === id); must(i >= 0, `${h.label} ${id}`); return p.splice(i, 1)[0]; };
    const isLight = h.label !== '기사단';
    // 풀 시작 순서: 축복받은 망치 → 심판 → 응징의 방패 → 신성화 → 정의의 방패 → 파수꾼 → 천상의 종 → (영웅 버튼) → 천벌의 망치 → 영광의 서약 → 나머지
    const hammer = take('204019'), judg = take('275779'), shield = take('31935'), cons = take('26573'), sotr = take('53600'), sentinel = take('389539'), toll = take('375576');
    const hero = isLight ? take('432472') : take('427453');
    const wrath = take('1241413'), word = take('85673');
    const rest = p.splice(0);
    h.aoe.priority = [
      {...hammer, note: LEAD['204019']},
      {...judg, note: LEAD['275779']},
      shield, cons,
      {...sotr, note: '적이 붙기 시작하면 첫 근접 공격 전에 방어를 확보합니다. 방어가 급하면 표의 위치와 상관없이 먼저 씁니다. 여러 강화 방패가 자원을 만들면 일반 글쿨 사이에 소비해 과충전을 막습니다.'},
      sentinel, toll, hero, wrath, word, ...rest,
    ];
    h.aoe.summary = h.aoe.summary.replace(/ ?표는 풀 시작 순서대로 적었습니다\./, '') + ' 표는 상위 쐐기 기록의 풀 시작 순서대로 적었습니다.';
  }
  m.evidence = [...(m.evidence || []).filter(x => !x.startsWith('최신 메타 후속')),
    '최신 메타 후속(2026-10-20): 쐐기 광역 우선순위표(두 영웅 특성)를 2부 타임라인과 같은 풀 시작 순서(축복받은 망치 → 심판 → 응징의 방패 → 신성화 → 정의의 방패 → 파수꾼 → 천상의 종)로 바꿨습니다. 근거는 상위 빛의 대장장이 쐐기 기록의 풀 시작 순서입니다(축복받은 망치 처음 두 번 안 6/7, 심판 → 응징의 방패 18/21, 심판 → 신성화 16/19, 파수꾼·천상의 종 앞 응징의 방패 7/7). 기사단은 쐐기 기록이 없어 같은 뼈대에 빛의 망치를 얹었습니다.'];
  return m;
};
