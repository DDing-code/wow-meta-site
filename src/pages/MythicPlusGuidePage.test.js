import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import MythicPlusGuidePage from './MythicPlusGuidePage.js';
import mythicPlusGuide from '../data/mythicPlusGuide.json';

let container;
let root;

function mount(path = '/mythicplus') {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(
    <MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/mythicplus" element={<MythicPlusGuidePage />} />
        <Route path="/mythicplus/:dungeonId" element={<MythicPlusGuidePage />} />
      </Routes>
    </MemoryRouter>
  ));
}

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

const first = mythicPlusGuide.dungeons[0];

test('첫 던전을 기본으로 보여 주고 던전 8곳 탭과 순서 목차를 그린다', () => {
  mount();
  const tabs = container.querySelectorAll('nav[aria-label="쐐기 던전 선택"] a');
  expect(tabs).toHaveLength(8);
  expect(Array.from(tabs).map(tab => tab.getAttribute('href'))).toEqual(mythicPlusGuide.dungeons.map(dungeon => `/mythicplus/${dungeon.id}`));
  expect(container.querySelector('nav[aria-label="쐐기 던전 선택"] a[aria-current="page"]').textContent).toContain(first.name);
  expect(container.querySelector(`#${first.id}-route`)).not.toBeNull();
  expect(container.querySelector(`#${first.id}-pulls`)).not.toBeNull();
  for (const boss of first.bosses) expect(container.querySelector(`#${first.id}-boss-${boss.id}`)).not.toBeNull();
  expect(container.querySelector(`nav[aria-label="이 던전의 순서"] a[href="#${first.id}-pulls"]`)).not.toBeNull();
  expect(container.querySelectorAll('[data-pull]')).toHaveLength(first.pulls.length);
});

test('주소의 던전 이름으로 다른 던전을 열고 풀링·네임드·도식·몹 설명을 모두 그린다', () => {
  const dungeon = mythicPlusGuide.dungeons.find(item => item.id === 'kings-rest');
  mount('/mythicplus/kings-rest');
  expect(container.querySelector(`#${first.id}-route`)).toBeNull();
  expect(container.querySelectorAll('[data-pull]')).toHaveLength(dungeon.pulls.length);
  expect(container.querySelectorAll('[data-boss-pull="true"]')).toHaveLength(dungeon.pulls.filter(pull => pull.boss).length);
  for (const boss of dungeon.bosses) {
    expect(container.querySelectorAll(`[data-steps="${boss.id}"] > li`)).toHaveLength(boss.steps.length);
    expect(container.querySelectorAll(`[data-steps="${boss.id}"] figure[data-figure]`)).toHaveLength(boss.steps.filter(step => step.figure).length);
    expect(container.querySelectorAll(`[data-key-spells="${boss.id}"] [data-spell-id]`)).toHaveLength(boss.keySpells.length);
  }
  const cards = container.querySelectorAll('[data-mob]');
  expect(cards).toHaveLength(dungeon.pulls.reduce((sum, pull) => sum + pull.newMobs.length, 0));
  mount('/mythicplus/없는던전');
  expect(container.querySelector(`#${first.id}-route`)).not.toBeNull();
});

test('본문의 몹 스킬 이름은 아이콘이 붙은 한국어 툴팁 링크가 되고, 두 글자 이름은 본문에서 바꾸지 않는다', () => {
  mount('/mythicplus/altar-of-fangs');
  const dungeon = mythicPlusGuide.dungeons.find(item => item.id === 'altar-of-fangs');
  const terms = Array.from(container.querySelectorAll('a[data-term-id]'));
  expect(terms.length).toBeGreaterThan(10);
  for (const term of terms) {
    const id = term.getAttribute('data-term-id');
    expect(dungeon.spells[id]).toBeDefined();
    expect(dungeon.spells[id].name.length).toBeGreaterThanOrEqual(3);
    expect(term.getAttribute('href')).toBe(`https://ko.wowhead.com/spell=${id}`);
    expect(term.getAttribute('data-wowhead')).toBe(`spell=${id}&domain=ko`);
    expect(term.textContent).toBe(dungeon.spells[id].name);
  }
  // '대규모 독살'은 통째로 잡고 '독살'(두 글자)은 본문에서 따로 잡지 않는다.
  const massPoison = Object.entries(dungeon.spells).find(([, spell]) => spell.name === '대규모 독살');
  expect(container.querySelector(`a[data-term-id="${massPoison[0]}"]`)).not.toBeNull();
  const poison = Object.entries(dungeon.spells).find(([, spell]) => spell.name === '독살');
  expect(container.querySelector(`a[data-term-id="${poison[0]}"]`)).toBeNull();
  // 몹 카드의 스킬 칩에는 표시(차단·해제…)와 공식 설명이 함께 보인다.
  const chip = container.querySelector(`[data-mob] [data-spell-id="${poison[0]}"]`);
  expect(chip).not.toBeNull();
  expect(chip.textContent).toContain('차단');
});

test('영상 번호가 없으면 영상 칸을 그리지 않고, 있으면 장면 단추와 함께 그린다', () => {
  mount('/mythicplus/altar-of-fangs');
  if (/^[A-Za-z0-9_-]{11}$/.test(first.video.youtubeId || '')) {
    expect(container.querySelector(`[data-video="${first.video.youtubeId}"] iframe`)).not.toBeNull();
    expect(container.querySelectorAll('[data-video] [data-video-second]')).toHaveLength(first.video.chapters.length);
  } else {
    expect(container.querySelector('[data-video]')).toBeNull();
    expect(container.querySelector('iframe')).toBeNull();
  }
});

test('가이드 용어를 지킨다: 네임드·쫄·쐐기만 쓰고 우두머리·졸개·보스·신화+는 쓰지 않는다', () => {
  const prose = JSON.stringify({ page: mythicPlusGuide.page, dungeons: mythicPlusGuide.dungeons.map(d => ({ ...d, spells: undefined })) });
  for (const banned of ['우두머리', '졸개', '보스', '로테이션', '오프너', '신화+', '버스트']) expect(prose).not.toContain(banned);
  expect(prose).toContain('네임드');
  expect(prose).toContain('쫄');
  expect(mythicPlusGuide.page.title).toBe('쐐기 가이드');
});
