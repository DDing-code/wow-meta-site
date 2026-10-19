import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import SpellRelationMap from './SpellRelationMap';
import { marksmanshipGraph } from '../data/spellRelations';

let container, root, frames, nextFrame, now, reduced;
const props = { selected: null, onSelect: jest.fn(), onClear: jest.fn(), query: '', kind: 'all', resetFilters: jest.fn() };
const render = extra => act(() => root.render(<SpellRelationMap {...props} {...extra} />));
const step = () => act(() => {
  now += 16;
  const pending = [...frames.values()]; frames.clear();
  pending.forEach(callback => callback(now));
});
const click = label => act(() => container.querySelector(`[aria-label="${label}"]`).click());

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  frames = new Map(); nextFrame = 0; now = 0; reduced = false;
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
    frames.set(++nextFrame, callback); return nextFrame;
  });
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => frames.delete(id));
  jest.spyOn(performance, 'now').mockImplementation(() => now);
  window.matchMedia = jest.fn(() => ({ matches: reduced, addEventListener() {}, removeEventListener() {} }));
  container = document.createElement('div'); document.body.append(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  expect(frames.size).toBe(0);
  container.remove(); jest.restoreAllMocks();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test('진입 모션은 연결선과 함께 움직이고 유휴 상태에서는 멈춘다', () => {
  render();
  const node = container.querySelector('[data-node-id="19434"]');
  const before = node.getAttribute('transform');
  step();
  expect(node.getAttribute('transform')).not.toBe(before);
  const edge = marksmanshipGraph.edges[0];
  const source = container.querySelector(`[data-node-id="${edge.source}"]`).getAttribute('transform');
  const line = container.querySelector('[data-edge]');
  expect(source).toBe(`translate(${line.getAttribute('x1')},${line.getAttribute('y1')})`);
  for (let i = 0; i < 160; i++) step();
  expect(frames.size).toBe(0);
});

test('확대와 선택 이동은 중간 프레임을 거치고 빠른 확대 입력도 누적한다', () => {
  render();
  click('확대'); click('확대');
  expect(container.querySelector('output').textContent).toBe('144%');
  const viewport = container.querySelector('[data-viewport]');
  step(); expect(viewport.getAttribute('transform')).not.toContain('scale(1.44)');
  for (let i = 0; i < 30; i++) step();
  expect(viewport.getAttribute('transform')).toContain('scale(1.44)');
  const before = viewport.getAttribute('transform');
  render({ selected: marksmanshipGraph.nodes.find(node => node.id === '257044') });
  expect(viewport.getAttribute('transform')).toBe(before);
  step(); expect(viewport.getAttribute('transform')).not.toBe(before);
});

test('움직임 줄이기에서는 즉시 이동하고 켜기·끄기가 계산을 제어한다', () => {
  reduced = true; render();
  expect(frames.size).toBe(0);
  click('확대');
  expect(container.querySelector('[data-viewport]').getAttribute('transform')).toContain('scale(1.2)');
  const toggle = [...container.querySelectorAll('button')].find(button => button.textContent === '움직임 꺼짐');
  act(() => toggle.click()); expect(frames.size).toBeGreaterThan(0);
  act(() => toggle.click()); expect(frames.size).toBe(0);
});

test('가이드의 노드 선택과 상세 연결에 다른 전문화의 지도를 섞지 않는다', () => {
  const skill = { id: '100', koreanName: '가이드 스킬', type: 'skill', kind: 'skill', description: '가이드 원문', x: 400, y: 300 };
  const note = { id: 'guide-note', name: '가이드 시너지', type: 'synergy', kind: 'note', x: 600, y: 400 };
  const graph = { nodes: [skill, note], edges: [{ source: note.id, target: skill.id }] };
  const onSelect = jest.fn();
  render({ graph, label: '가이드 전문화', selected: skill, onSelect });
  expect(container.querySelector('section').getAttribute('aria-label')).toBe('가이드 전문화 관계 지도');
  expect(container.querySelectorAll('[data-node-id]')).toHaveLength(2);
  expect(container.querySelector('.detail').textContent).toContain('가이드 원문');
  expect(container.querySelector('.detail').textContent).toContain('주문 번호 100');
  act(() => container.querySelector('.detail .relation').click());
  expect(onSelect).toHaveBeenLastCalledWith(note);
  const node = container.querySelector('[data-node-id="guide-note"]');
  act(() => node.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })));
  expect(onSelect).toHaveBeenLastCalledWith(note);
  expect(container.textContent).not.toContain('조준 사격');
});
