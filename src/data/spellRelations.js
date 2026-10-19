import kbData from './kb-skills.json';
import kbSynergies from './kb-synergies.json';

export const spellKinds = {
  skill: { label: '스킬', color: '#aad372' },
  talent: { label: '특성', color: '#8ba7bc' },
  buff: { label: '버프', color: '#b5a2c9' },
  hero: { label: '영웅 특성', color: '#6cb9a8' },
  note: { label: '관계 노트', color: '#d2b373' },
};

export const relationKinds = {
  triggers: '발동', enhances: '강화', recovers: '회복', resets: '초기화', maintains: '유지',
};

export function spellKind(record) {
  if (record.type === 'synergy') return 'note';
  if (/hero/.test(record.type)) return 'hero';
  if (/buff|proc/.test(record.type)) return 'buff';
  if (/talent/.test(record.type)) return 'talent';
  return 'skill';
}

export const spellName = record => record.koreanName || record.name;
export const normalizeSpell = value => String(value || '').toLowerCase().replace(/\s+/g, '');
export const matchesSpell = (record, query) => normalizeSpell([
  spellName(record), record.englishName, record.id, ...(record.aliases || []),
].join(' ')).includes(normalizeSpell(query));

export function matchesSpellSpec(record, spec) {
  if (!spec) return true;
  const aliases = spec.kbSpecAliases;
  if (record.specs?.length) return record.specs.some(value => aliases.includes(value));
  return ['공용', 'Common', 'All', 'all', ''].includes(record.spec || '') || aliases.includes(record.spec);
}

// 시안의 좌표만 보관한다. 설명·참여 스킬·방향·조건은 생성 DB에서 읽는다.
const positions = {
  '19434': [465,390], '257044': [265,320], '257620': [385,170], '257621': [100,160],
  '257622': [180,65], '260243': [75,285], '473385': [445,55], '260242': [690,310],
  '185358': [845,180], '391559': [85,500], '1277546': [255,485], '260240': [715,65],
  '378767': [570,650], '288613': [305,655], '471366': [135,625],
  '1253599': [900,350], '1253601': [925,520], '1253732': [800,640], '1253846': [665,610],
  hunter_mm_trick_multishot: [235,200], hunter_mm_rapid_precise: [445,275],
  hunter_mm_surging_focusfire: [165,415], hunter_mm_precise_aimed: [640,165],
  hunter_mm_precise_focused: [580,505], hunter_mm_trueshot_tensile: [335,555],
  hunter_mm_sentinel_aimed: [790,455],
};

export function buildSpellGraph(skills, synergies, layout) {
  const notes = Object.keys(layout).map(id => synergies[id]).filter(note => note?.relations?.length);
  const nodes = new Map();
  const edges = [];
  for (const note of notes) {
    const ids = new Set();
    for (const relation of note.relations) {
      const participants = [relation.from, relation.to, ...(relation.requires || [])];
      // 불완전한 관계를 추측으로 보충하지 않는다.
      if (!relationKinds[relation.kind] || !relation.condition ||
          participants.some(id => !skills[id] || !layout[id] || !note.participants.includes(id))) {
        throw new Error('Invalid spell relation: ' + note.id);
      }
      participants.forEach(id => ids.add(id));
    }
    nodes.set(note.id, { ...note, kind: 'note', x: layout[note.id][0], y: layout[note.id][1] });
    ids.forEach(id => {
      const record = skills[id];
      nodes.set(id, { ...record, kind: spellKind(record), x: layout[id][0], y: layout[id][1] });
      edges.push({ source: note.id, target: id });
    });
  }
  return { nodes: [...nodes.values()], edges };
}

export const marksmanshipGraph = buildSpellGraph(kbData.skills, kbSynergies.synergies, positions);

export function buildGuideSpellGraph(model) {
  const nodes = new Map();
  const edges = [];
  const centerId = String(model.center?.skill?.id || '');
  const placements = new Map(model.skillNodes.map(node => [String(node.skill.id), node]));
  if (centerId) placements.set(centerId, model.centerPoint);
  model.synergyNodes.forEach((note, index) => {
    const angle = -Math.PI / 2 + index * 2 * Math.PI / model.synergyNodes.length;
    nodes.set(note.synergy.id, {
      ...note.synergy, kind: 'note',
      x: 500 + Math.cos(angle) * 370, y: 360 + Math.sin(angle) * 245,
    });
    note.allLinkedSkills.forEach(skill => {
      const id = String(skill.id);
      if (!nodes.has(id)) {
        const point = placements.get(id);
        const angle = nodes.size * 2.399963;
        nodes.set(id, {
          ...skill, id, kind: spellKind(skill),
          x: point?.x ?? 500 + Math.cos(angle) * 400,
          y: point ? point.y * 720 / model.height : 360 + Math.sin(angle) * 275,
        });
      }
      edges.push({ source: note.synergy.id, target: id });
    });
  });
  // 관계의 방향은 실제로 표시하는 참여 항목이 모두 있을 때만 보여 준다.
  nodes.forEach(node => {
    if (node.kind === 'note') node.relations = (node.relations || []).filter(relation =>
      [relation.from, relation.to, ...(relation.requires || [])].every(id => nodes.has(String(id))));
  });
  return { nodes: [...nodes.values()], edges, centerId, centerConnections: model.center?.connectionCount || 0 };
}
