// shaman-restoration 후속(2026-10-20, 사용자 "다 최신 메타에 맞게"):
// 1) 화염 충격(188389)·용암 폭발(51505)을 KB에서 복원도 쓰도록 연 뒤 순서 칸에 넣는다(레이드 8개 중 6개가 첫 피해 전 화염 충격, 분당 2.2·1.4회).
// 2) 쐐기 견본을 상위 쐐기 토템술사 대표 빌드로 바꾼다(84행 중 48+23행이 생명 폭발, 지금 견본에는 없음). 생명 폭발을 토템술사 광역·끼워 넣기에 넣는다.
//    시전 기록: 쐐기 토템술사 8개에서 생명 폭발 분당 1.92회, 바로 앞은 성난 해일 134·연쇄 치유 106, 바로 뒤는 치유의 물결 99·연쇄 치유 80.
const must = (cond, what) => { if (!cond) throw new Error('shaman-restoration 후속: 찾지 못함 — ' + what); };
const DAY = '2026-10-20';
const MYTHIC = {
  code: 'CgQAAAAAAAAAAAAAAAAAAAAAAAAAAgBAAAAzMzsstMmZmZMzYMjhFYDmxiGbDIzAbYmZY2mZMaWWmZ2MjZjFjZGDmlZAAYAMzgZGAGDG',
  sha256: '1309f7eda39ea0b63d3f58c6d048f6de0c29974d4706c976e35220c84170d0ab',
  sourceUrl: 'https://www.warcraftlogs.com/reports/CZVL9gHnbrWzpJmD#fight=19',
  sourceLabel: 'WCL 12.1.5 이후 쐐기 상위 토템술사 대표 빌드(전체 1위, 같은 빌드 6행, 2026-10-16)',
};
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);

module.exports = function followup(m) {
  const blk = t => { const b = m.blocks.find(x => x.title.startsWith(t)); must(b, '장 ' + t); return b; };
  const rail = (b, start) => { const r = tlOf(b)[0].rails.find(x => x.label.startsWith(start)); must(r, 'rail ' + start); return r; };

  // 쐐기 견본 교체
  const i = m.talentBuilds.findIndex(b => b.id === 'mythic-plus');
  must(i >= 0, '쐐기 견본');
  const old = m.talentBuilds[i];
  m.talentBuilds[i] = {...old, code: MYTHIC.code, url: 'https://www.wowhead.com/ko/talent-calc/blizzard/' + MYTHIC.code,
    sourceUrl: MYTHIC.sourceUrl, sourceLabel: MYTHIC.sourceLabel, checkedAt: DAY, heroLabel: '토템술사',
    note: '쐐기용 견본입니다. 12.1.5 이후 쐐기 상위 토템술사 84행에서 가장 많이 겹친 실제 빌드로, 생명 폭발을 골랐습니다(상위 행 84개 중 71개). 레이드 견본에는 생명 폭발이 없습니다. 던전과 파티에 맞춰 차단·군중 제어·해제 선택을 조정하세요.',
    validation: {...old.validation, heroTreeId: 54, checkedAt: DAY,
      browser: {checkedAt: DAY, points: [34, 34, 13], parentConnections: true, available: true, sha256: MYTHIC.sha256},
      scope: '12.1.5 상위 로그 특성으로 만든 코드. SimC midnight(5537d881, 12.1.5.70448) 전문화·노드·랭크·포인트 문턱과 한국어 Wowhead 계산기 포인트·선택 가능 여부·부모 연결 확인.'}};

  // 2부 한 명 치유 반복: 끝에 화염 충격(위: 용암 폭발)
  const one = blk('첫 연습');
  const r1 = rail(one, '반복 흐름 — 한 명이 위험할 때');
  must(!r1.nodes.some(n => n.skillId === '188389'), '한 명 치유 화염 충격 중복');
  r1.nodes = [...r1.nodes, {skillId: '188389', caption: '파티가 안전할 때', above: {skillId: '51505', when: '화염 충격 대상에'}}];
  const ins1 = tlOf(one)[0].rails.find(x => x.kind === 'inserts');
  must(ins1, '한 명 치유 끼워 넣기');
  if (!ins1.nodes.some(n => n.caption === '쐐기 견본 · 성난 해일 뒤')) ins1.nodes = [...ins1.nodes, {skillId: '73685', caption: '쐐기 견본 · 성난 해일 뒤'}];

  // 2부 오프닝: 쇄도하는 토템 뒤 화염 충격(위: 용암 폭발)
  const op = blk('쿨기와 오프닝');
  const r2 = rail(op, '오프닝 — 토템술사');
  const at = r2.nodes.findIndex(n => n.skillId === '444995');
  must(at >= 0 && !r2.nodes.some(n => n.skillId === '188389'), '오프닝 쇄도하는 토템');
  r2.nodes = [...r2.nodes.slice(0, at + 1), {skillId: '188389', caption: '피해 전 여유 글쿨', above: {skillId: '51505', when: '이어서 같은 대상'}}, ...r2.nodes.slice(at + 1)];

  // 2부 광역: 끼워 넣기에 토템술사 쐐기 생명 폭발, 반복 note
  const aoeB = blk('광역 치유 흐름');
  const r3 = rail(aoeB, '반복 흐름 — 파티·공대 피해');
  if (!r3.note.includes('생명 폭발')) r3.note += ' 쐐기 견본은 생명 폭발을 골랐습니다. 상위 쐐기 기록은 성난 해일 뒤, 연쇄 치유나 치유의 물결 앞에 분당 약 두 번 썼습니다.';
  const ins3 = tlOf(aoeB)[0].rails.find(x => x.kind === 'inserts');
  must(ins3, '광역 끼워 넣기');
  if (!ins3.nodes.some(n => n.caption === '토템 쐐기 · 연쇄 치유 앞')) {
    const k = ins3.nodes.findIndex(n => n.skillId === '73685');
    ins3.nodes = [...ins3.nodes.slice(0, k + 1), {skillId: '73685', caption: '토템 쐐기 · 연쇄 치유 앞'}, ...ins3.nodes.slice(k + 1)];
  }

  // 영웅 탭: 토템술사
  const h = m.heroBranches.find(x => x.label === '토템술사');
  must(h, '토템술사');
  const os = h.opener.steps;
  const oi = os.findIndex(s => s.skillId === '444995');
  must(oi >= 0 && !os.some(s => s.skillId === '188389'), '토템술사 오프닝 행');
  h.opener.steps = [...os.slice(0, oi + 1),
    {skillId: '188389', label: '화염 충격', phase: '피해 전', trigger: '첫 피해 전 여유 글쿨', note: '아직 치유할 피해가 없으면 화염 충격을 걸고 용암 폭발을 잇습니다. 상위 레이드 기록 8개 중 6개가 첫 피해 전에 걸었습니다. 피해가 들어오면 바로 치유로 돌아갑니다.'},
    ...os.slice(oi + 1)];
  const sp = h.singleTarget.priority;
  must(!sp.some(s => s.skillId === '188389'), '토템술사 단일 화염 충격 중복');
  h.singleTarget.priority = [...sp,
    {skillId: '188389', label: '화염 충격', note: '파티가 안전하고 차단이 준비됐을 때 주 대상에 겁니다. 상위 레이드 기록은 분당 약 두 번 썼습니다. 치유가 필요한 아군이 있으면 걸지 않습니다.'},
    {skillId: '51505', label: '용암 폭발', note: '화염 충격이 걸린 대상에게 씁니다. 2초 시전이라 곧 피해가 오거나 움직여야 하면 미루고, 여유 글쿨에만 넣습니다.'}];
  const ap = h.aoe.priority;
  const ai = ap.findIndex(s => s.skillId === '61295');
  must(ai >= 0 && !ap.some(s => s.skillId === '73685'), '토템술사 광역 성난 해일');
  h.aoe.priority = [...ap.slice(0, ai + 1),
    {skillId: '73685', label: '생명 폭발', note: '쐐기 견본처럼 생명 폭발을 골랐다면 성난 해일 뒤에 써서 다음 연쇄 치유나 치유의 물결을 강화합니다. 상위 쐐기 기록은 분당 약 두 번 썼고, 레이드 견본에는 없습니다.'},
    ...ap.slice(ai + 1)];
  if (!h.aoe.summary.includes('생명 폭발')) h.aoe.summary += ' 쐐기 견본은 생명 폭발을 골라 성난 해일 뒤에 다음 치유를 강화합니다.';

  m.evidence = [...(m.evidence || []).filter(x => !x.startsWith('최신 메타 후속')),
    '최신 메타 후속(2026-10-20): KB에서 화염 충격·용암 폭발의 사용 전문화에 복원을 더하고(용암 폭발은 SimC 트리 자료상 정기·복원 직업 노드, 복원 견본 3개 모두 선택), 토템술사 오프닝(쇄도하는 토템 뒤)·한 명 치유 흐름 끝·단일 우선순위에 넣었습니다(상위 레이드 8개 중 6개가 첫 피해 전 화염 충격, 분당 2.2·1.4회). 쐐기 견본은 상위 쐐기 토템술사 84행 중 71행이 고른 생명 폭발이 빠져 있어, 같은 빌드가 가장 많은 실제 빌드(전체 1위)로 바꾸고 한국어 Wowhead 계산기로 확인했습니다. 생명 폭발은 쐐기 토템술사 기록 8개에서 분당 1.92회, 성난 해일 뒤·치유의 물결/연쇄 치유 앞에 많아 토템술사 광역 우선순위와 끼워 넣기에 넣었습니다.'];
  return m;
};
