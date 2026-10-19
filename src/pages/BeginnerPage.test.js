import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { Simulate } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import BeginnerPage from './BeginnerPage.js';
import { beginnerSections } from '../data/beginnerGuide.js';

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
  search('마부');
  expect(container.querySelector('#consumables')).toBeNull();
  act(() => container.querySelector('a[href="#consumables"]').click());
  expect(container.querySelector('input').value).toBe('');
  expect(container.querySelector('#consumables')).not.toBeNull();
});
