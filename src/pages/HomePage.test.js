import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { Simulate } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './HomePage.js';
import Navigation from '../components/Navigation.js';
import { youtubePlaylists } from '../data/youtubePlaylists.js';
import raidGuide from '../data/raidGuide.json';

let container;
let root;
const render = node => act(() => root.render(
  <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{node}</MemoryRouter>
));

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

const shelf = id => container.querySelector(`[data-shelf="${id}"]`);
const chip = label => [...container.querySelectorAll('button[aria-pressed]')].find(button => button.textContent === label);

test('머리글 없이 초보자 안내와 재생목록 줄, 레이드 줄을 보여 준다', () => {
  render(<HomePage />);
  expect(container.textContent).not.toContain('전문화별 실전 가이드');
  expect(container.querySelector('a[href="/beginner"]').textContent).toContain('와우가 처음이신가요?');
  for (const list of youtubePlaylists) {
    expect(shelf(list.role)).not.toBeNull();
    expect(shelf(list.role).querySelector(`a[href="https://www.youtube.com/playlist?list=${list.playlistId}"]`)).not.toBeNull();
  }
  // 넓은 화면(jsdom 기본 5칸)은 한 줄만 보인다.
  expect(shelf('melee').querySelectorAll('li')).toHaveLength(5);
  expect(shelf('raid').querySelectorAll('li')).toHaveLength(raidGuide.episodes.length);
  expect(container.querySelector('a[href="/raid/kithix"]')).not.toBeNull();
});

test('모두 보기와 분류 칩으로 한 재생목록을 다 펼친다', () => {
  render(<HomePage />);
  const melee = youtubePlaylists.find(list => list.role === 'melee');
  act(() => Simulate.click(shelf('melee').querySelector('button[aria-expanded]')));
  expect(shelf('melee').querySelectorAll('li')).toHaveLength(melee.items.length);

  const healers = youtubePlaylists.find(list => list.role === 'healers');
  act(() => Simulate.click(chip('힐러')));
  expect(container.querySelectorAll('[data-shelf]')).toHaveLength(1);
  expect(shelf('healers').querySelectorAll('li')).toHaveLength(healers.items.length);
  expect(shelf('healers').querySelector('button[aria-expanded]')).toBeNull();
  const first = shelf('healers').querySelector('li');
  expect(first.querySelector(`a[href^="https://www.youtube.com/watch?v=${healers.items[0][1]}"]`)).not.toBeNull();
  expect(first.querySelector('a[href="/guide/paladin/holy"]')).not.toBeNull();
});

test('상단 메뉴에 로그 분석 탭이 없다', () => {
  render(<Navigation />);
  expect(container.textContent).not.toContain('로그 분석');
  expect(container.querySelector('a[href="/logs"]')).toBeNull();
});
