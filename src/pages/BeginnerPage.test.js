import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { Simulate } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import BeginnerPage from './BeginnerPage.js';
import { beginnerCraftingScreens, beginnerEmbellishments, beginnerSections } from '../data/beginnerGuide.js';
import consumables from '../data/beginnerConsumables.json';

let container;
let root;
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><BeginnerPage /></MemoryRouter>));
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

function search(value) {
  act(() => Simulate.change(container.querySelector('input'), { target: { value } }));
}

test('전체 항목과 실제 섹션을 가리키는 목차를 표시한다', () => {
  expect(container.querySelectorAll('dt')).toHaveLength(beginnerSections.reduce((sum, section) => sum + section.entries.length, 0));
  for (const section of beginnerSections) {
    expect(container.querySelector(`#${section.id}`)).not.toBeNull();
    expect(container.querySelector(`nav a[href="#${section.id}"]`)).not.toBeNull();
  }
  expect(container.querySelector('a[href="/guide"]')).not.toBeNull();
});

test('줄임말과 영문 대소문자로 검색하고 일치한 항목만 남긴다', () => {
  search('  마부  ');
  expect(container.querySelectorAll('dt')).toHaveLength(1);
  expect(container.querySelector('dt').textContent).toBe('마법부여 · 보석');
  expect(container.querySelector('[role="status"]').textContent).toContain('검색 결과 1개');
  search('iLvL');
  expect(container.querySelector('dt').textContent).toBe('아이템 레벨');
  expect(container.querySelectorAll('nav a')).toHaveLength(1);
});

test('검색 결과가 없으면 안내하고 전체 설명으로 돌아갈 수 있다', () => {
  search('없는말12345');
  expect(container.querySelectorAll('dt')).toHaveLength(0);
  expect(container.textContent).toContain('일치하는 설명이 없습니다');
  act(() => Array.from(container.querySelectorAll('button')).find(button => button.textContent === '전체 설명 보기').click());
  expect(container.querySelector('input').value).toBe('');
  expect(container.querySelector('#consumables')).not.toBeNull();
});

test('상황별 바로가기는 검색을 지워 이동할 섹션을 복원한다', () => {
  search('어그로');
  expect(container.querySelector('#consumables')).toBeNull();
  act(() => container.querySelector('a[href="#consumables"]').click());
  expect(container.querySelector('input').value).toBe('');
  expect(container.querySelector('#consumables')).not.toBeNull();
});

test('소모품을 능력치와 용도별로 나누고 이름과 아이콘을 같은 링크로 묶는다', () => {
  const items = consumables.groups.flatMap(group => group.items);
  expect(new Set(items.map(item => item.id)).size).toBe(items.length);
  expect(container.querySelectorAll('[data-item-id]')).toHaveLength(items.length);
  for (const item of items) {
    const link = container.querySelector(`[data-item-id="${item.id}"]`);
    expect(link.href).toBe(`https://www.wowhead.com/ko/item=${item.id}`);
    expect(link.querySelector('img').src).toContain(`/${item.icon}.jpg`);
    expect(link.textContent).toContain(item.name);
  }
  expect(container.querySelector('[data-item-group="primary-food"] h4').textContent).toContain('1차 스탯');
  expect(container.querySelector('[data-item-group="secondary-food"] h4').textContent).toContain('2차 스탯');
  expect(container.querySelector('[data-item-id="242747"]').textContent).toContain('사망 후 유지');
});

test('설명에 없는 아이템 이름도 검색하고 결과를 지우면 전체 목록이 복원된다', () => {
  search('농축된 실버문');
  expect(container.querySelectorAll('dt')).toHaveLength(0);
  expect(container.querySelectorAll('[data-item-id]')).toHaveLength(1);
  expect(container.querySelector('[data-item-id="271884"]')).not.toBeNull();
  expect(container.querySelector('#consumables')).not.toBeNull();
  expect(container.querySelector('[role="status"]').textContent).toContain('아이템 1종');
  expect(container.textContent).not.toContain('일치하는 설명이 없습니다');
  act(() => container.querySelector('[aria-label="검색 지우기"]').click());
  expect(container.querySelectorAll('[data-item-id]')).toHaveLength(consumables.groups.reduce((n, g) => n + g.items.length, 0));
});

test('보석 전체와 이름 검색 결과를 표시하고 아이콘도 설명 링크에 포함한다', () => {
  const gems = consumables.groups.filter(group => group.id.startsWith('gems-'));
  expect(gems.map(group => group.items.length)).toEqual([8, 8, 8, 8, 4]);
  expect(container.querySelector('[aria-label="현재 버전 소모품·보석·마법부여 목록"]')).not.toBeNull();
  search('보석');
  expect(container.querySelectorAll('[data-item-id]')).toHaveLength(36);
  search('무결한 쾌속의 감람석');
  expect(container.querySelectorAll('[data-item-id]')).toHaveLength(1);
  const link = container.querySelector('[data-item-id="240888"]');
  expect(link.querySelector('img')).not.toBeNull();
  expect(link.href).toBe('https://www.wowhead.com/ko/item=240888');
  expect(container.querySelector('nav a[href="#consumables"]')).not.toBeNull();
  search('영원노래 다이아몬드');
  expect(container.querySelectorAll('[data-item-id]')).toHaveLength(4);
  expect(container.textContent).toContain('종류를 합쳐 하나만 장착');
});

test('마법부여를 부위별로 나누고 줄임말 검색과 높은 품질 단계 링크를 쓴다', () => {
  const enchants = consumables.groups.filter(group => group.id.startsWith('enchants-'));
  expect(enchants.map(group => group.id)).toEqual(['enchants-weapon', 'enchants-chest', 'enchants-ring', 'enchants-helm', 'enchants-boots', 'enchants-shoulder', 'enchants-legs', 'enchants-scope']);
  expect(enchants.map(group => group.items.length)).toEqual([10, 4, 9, 6, 3, 6, 6, 2]);
  for (const group of enchants) expect(container.querySelector(`[data-item-group="${group.id}"] h4`).textContent).toBe(group.title);
  search('마부');
  expect(container.querySelectorAll('[data-item-id]')).toHaveLength(46);
  expect(container.querySelector('nav a[href="#consumables"]')).not.toBeNull();
  search('광전사의 분노');
  expect(container.querySelectorAll('[data-item-id]')).toHaveLength(1);
  const link = container.querySelector('[data-item-id="243973"]');
  expect(link.href).toBe('https://www.wowhead.com/ko/item=243973');
  expect(link.textContent).toContain('가속 +124');
  search('다시 바르기');
  expect(container.querySelector('#consumables dt').textContent).toContain('마법부여 고르기 · 다시 바르기');
});

test('주문제작 안내를 목차와 검색으로 찾고 장식 제한과 재제작을 확인한다', () => {
  expect(container.querySelector('#crafting dt').textContent).toContain('어떤 제작 장비');
  expect(container.querySelector('nav a[href="#crafting"]')).not.toBeNull();
  search('주문제작');
  expect(container.querySelectorAll('#crafting dt')).toHaveLength(10);
  expect(container.querySelector('#crafting').textContent).toContain('동시에 최대 두 개');
  expect(container.querySelector('#crafting').textContent).toContain('최소 품질');
  expect(container.querySelector('#crafting').textContent).toContain('개인 주문');
  search('리크래프트');
  expect(container.querySelectorAll('dt')).toHaveLength(1);
  expect(container.querySelector('dt').textContent).toContain('재제작');
});

test('장식 재료와 효과가 붙은 장비를 구분하고 이름만 검색해도 목록과 목차를 남긴다', () => {
  const items = beginnerEmbellishments.groups.flatMap(group => group.items);
  expect(items).toHaveLength(44);
  expect(new Set(items.map(item => item.id)).size).toBe(items.length);
  expect(container.querySelectorAll('[data-embellishment-id]')).toHaveLength(items.length);
  for (const item of items) {
    const link = container.querySelector(`[data-embellishment-id="${item.id}"]`);
    expect(link.href).toBe(`https://www.wowhead.com/ko/item=${item.id}`);
    expect(link.querySelector('img').src).toContain(`/${item.icon}.jpg`);
    expect(link.textContent).toContain(item.effect);
    expect(item.effect).not.toMatch(/primaryStat|\|1|(?<!\d)0만큼/);
  }
  expect(container.querySelector('[data-embellishment-group="season-2-reagents"] h4').textContent).toContain('이번 시즌');
  expect(container.querySelector('[data-embellishment-id="244610"]').textContent).toContain('2개 세트 효과');
  search('치장된 송곳니');
  expect(container.querySelectorAll('dt')).toHaveLength(0);
  expect(container.querySelectorAll('[data-embellishment-id]')).toHaveLength(1);
  expect(container.querySelector('nav a[href="#crafting"]')).not.toBeNull();
  expect(container.querySelector('[role="status"]').textContent).toContain('아이템 1종');
  search('장식');
  expect(container.querySelectorAll('[data-embellishment-id]')).toHaveLength(items.length);
  act(() => container.querySelector('[aria-label="검색 지우기"]').click());
  expect(container.querySelectorAll('[data-embellishment-id]')).toHaveLength(items.length);
  expect(container.querySelectorAll('[data-item-id]')).toHaveLength(129);
});

test('주문 창을 본뜬 화면 5장을 번호 상자와 설명으로 보여 주고 검색에도 남긴다', () => {
  expect(container.querySelectorAll('[data-screen-id]')).toHaveLength(5);
  expect(beginnerCraftingScreens.map(screen => screen.id)).toEqual(['browse', 'reagents', 'order', 'recraft', 'result']);
  for (const screen of beginnerCraftingScreens) {
    const figure = container.querySelector(`[data-screen-id="${screen.id}"]`);
    const callouts = Array.from(figure.querySelectorAll('[data-callout]')).map(node => Number(node.dataset.callout)).sort((a, b) => a - b);
    expect(callouts).toEqual(screen.legend.map((item, index) => index + 1));
    expect(figure.querySelectorAll('ol li')).toHaveLength(screen.legend.length);
    expect(figure.querySelector('[role="img"]').getAttribute('aria-label')).toContain('본뜬 그림');
    for (const step of screen.steps) expect(figure.textContent).toContain(step);
  }
  expect(container.querySelector('[data-screen-id="reagents"]').textContent).toContain('장식 추가');
  expect(container.querySelector('[data-screen-id="result"]').textContent).toContain('고유 장착: 장식됨 (2)');
  search('최소 품질');
  expect(container.querySelectorAll('[data-screen-id]')).toHaveLength(1);
  expect(container.querySelector('[data-screen-id="order"]')).not.toBeNull();
  expect(container.querySelector('nav a[href="#crafting"]')).not.toBeNull();
  search('없는말12345');
  expect(container.querySelectorAll('[data-screen-id]')).toHaveLength(0);
});
