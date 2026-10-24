// rogue-outlaw 단일 딜사이클 스조라크 대조 — 근거: digests/rogue-outlaw.md, apl/rogue_outlaw.simc, sources/rogue-outlaw.txt
// 오프닝·단일 반복은 기만자 로그 11개와 같은 순서라 그대로 둔다. 두 오프닝 맨 앞에 풀링 직전 은신만 넣는다
// (심크 우선순위 precombat stealth,precombat_seconds=2 · Icy "Always try to open from Stealth").
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const rep = (text, from, to) => { if (!text.includes(from)) throw new Error('바꿀 문장을 못 찾음: ' + from.slice(0, 30)); return text.replace(from, to); };

module.exports = {
  evidenceNote: '단일 딜사이클 스조라크 대조(2026-10-24): 스조라크 신화(12.1.5) WCL 상위 로그 12개(기만자 11·운명결속 1)의 실제 시전 순서와 심크 우선순위(midnight 3af1a757)·Icy Veins·Method 프리풀을 대조했습니다. 기만자 로그는 아드레날린 촉진 → 뼈주사위 → 도박의 연속 → 사악한 일격·미간 적중 → 광기의 학살자 → 마음가짐 → 두 번째 아드레날린 촉진 → 광기의 학살자로 지금 오프닝과 같았고(두 번째 촉진은 15~17초), 단일 반복도 같아 순서를 바꾸지 않았습니다. 두 오프닝 맨 앞에 풀링 직전 은신만 넣었습니다.',
  changelog: [
    '- 두 영웅 특성 오프닝(연습 장 타임라인·영웅 탭) 맨 앞에 은신(풀링 직전) 추가 (근거: 심크 우선순위 precombat stealth, Icy Veins "Always try to open from Stealth")',
    '- 오프닝 장 한 줄 원리·첫 문단에 은신으로 붙어 시작한다는 문장 추가',
    '- 그대로 둔 것: 오프닝(기만자 로그 11개 중 8개가 아드레날린 촉진 → 뼈주사위로 시작, 10개가 도박의 연속, 11개 모두 미간 적중 뒤 광기의 학살자, 마음가짐 뒤 두 번째 촉진·광기의 학살자 15~17초), 단일 반복 rail·우선순위(사악한 일격 → 속결/미간 적중, 아드레날린 촉진 → 광기의 학살자·미간 적중이 로그와 같음). 운명결속은 로그 1개라 바꾸지 않음',
    '- 보류: 질풍 칼날은 스조라크 상위 로그 12개 모두 시전 0회(특성 미선택). 지금처럼 "골랐다면" 조건으로 둠',
  ].join('\n'),
  apply(m) {
    const block = t => m.blocks.find(b => b.title.startsWith(t));
    const opener = block('쿨기와 오프닝');
    opener.concept = rep(opener.concept, '오프닝은 첫 상태 준비', '오프닝은 은신으로 붙은 뒤 첫 상태 준비');
    opener.paragraphs[0] = rep(opener.paragraphs[0],
      '전투 직전, 점수가 낮을 때 아드레날린 촉진을 켭니다.',
      '은신한 채 네임드에 붙어 시작합니다. 풀링 직전, 점수가 낮을 때 아드레날린 촉진을 켭니다.');
    for (const r of tlOf(opener)[0].rails) {
      r.nodes = [{skillId: '1784', caption: '풀링 직전'}, ...r.nodes.filter(n => n.skillId !== '1784')];
    }
    const stealthStep = {skillId: '1784', label: '은신', note: '은신한 채 네임드 가까이 붙어 풀링합니다. 무기의 독은 미리 발라 둡니다.', phase: '전투 전', trigger: '풀링 직전'};
    for (const h of m.heroBranches) {
      h.opener.steps = [stealthStep, ...h.opener.steps.filter(s => s.skillId !== '1784')];
    }
    return m;
  },
};
