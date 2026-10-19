import kbData from './kb-skills.json';
import kbSynergies from './kb-synergies.json';
import { buildSpellGraph, marksmanshipGraph, matchesSpell, matchesSpellSpec, spellKind } from './spellRelations';

test('사격 지도는 방향과 조건을 기록한 KB 관계만 연결한다', () => {
  const nodes = new Map(marksmanshipGraph.nodes.map(node => [node.id, node]));
  const notes = marksmanshipGraph.nodes.filter(node => node.kind === 'note');
  expect(notes).toHaveLength(7);
  expect(marksmanshipGraph.nodes).toHaveLength(26);
  expect(notes.reduce((total, note) => total + note.relations.length, 0)).toBe(18);
  for (const edge of marksmanshipGraph.edges) {
    const note = nodes.get(edge.source);
    expect(note.relations.some(relation => [relation.from, relation.to, ...relation.requires].includes(edge.target))).toBe(true);
    expect(nodes.has(edge.target)).toBe(true);
    expect(kbSynergies.synergies[note.id].participants).toContain(edge.target);
  }
  expect(nodes.get('260240').kind).toBe('talent');
  expect(nodes.get('260242').kind).toBe('buff');
  expect(nodes.has('470943')).toBe(false);
});

test('누락된 스킬이나 검증되지 않은 연결은 조용히 추측하지 않는다', () => {
  const layout = { relation: [0, 0], '19434': [1, 1] };
  const synergies = { relation: {
    id: 'relation', participants: ['19434', 'missing'],
    relations: [{ from: '19434', to: 'missing', requires: [], kind: 'triggers', condition: '조건' }],
  } };
  expect(() => buildSpellGraph(kbData.skills, synergies, layout)).toThrow('Invalid spell relation');
});

test('검색은 주문 번호·한국어 띄어쓰기·영문명을 지원한다', () => {
  expect(matchesSpell(kbData.skills['19434'], '19434')).toBe(true);
  expect(matchesSpell(kbData.skills['19434'], '조준사격')).toBe(true);
  expect(matchesSpell(kbData.skills['19434'], 'Aimed Shot')).toBe(true);
  expect(matchesSpell(kbData.skills['19434'], '얼음화살')).toBe(false);
  expect(spellKind(kbData.skills['1253599'])).toBe('hero');
});

test('다른 전문화의 공용 특성을 섞지 않는다', () => {
  const spec = { kbSpecAliases: ['사격', 'Marksmanship'] };
  expect(matchesSpellSpec({ spec: '공용', specs: ['BeastMastery'] }, spec)).toBe(false);
  expect(matchesSpellSpec({ spec: '공용', specs: ['Marksmanship', 'Survival'] }, spec)).toBe(true);
  expect(matchesSpellSpec({ spec: '공용' }, spec)).toBe(true);
  expect(matchesSpellSpec({ spec: '사격' }, spec)).toBe(true);
  expect(matchesSpellSpec({ spec: '생존' }, spec)).toBe(false);
});
