import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import ForeverPage from './ForeverPage.js';
import Navigation from '../components/Navigation.js';
import { foreverDetailGuides, foreverGuides, foreverPages, foreverSources, isForeverPageActive } from '../data/foreverGuide.js';
import { getPageMeta, SITE_ORIGIN } from '../data/siteMeta.js';

test('새 안내 네 쪽은 모든 본문·표·목차·공식 근거와 검색 주소를 연결한다', () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  try {
    for (const [id, data] of Object.entries(foreverGuides)) {
      const path = `/forever/${id}`;
      act(() => root.render(<MemoryRouter key={id} initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Navigation /><ForeverPage section={id} /></MemoryRouter>));
      expect(container.querySelector('h1').textContent).toBe(data.title);
      expect(container.querySelector('[data-forever-section]').getAttribute('data-forever-section')).toBe(id);
      expect(container.querySelector('#primary-navigation a[aria-current="page"]').getAttribute('href')).toBe(path);
      expect([...container.querySelectorAll('#primary-navigation a')].map(link => link.textContent)).toEqual(foreverPages.map(page => page.label));
      expect(container.querySelector('[aria-label="게임 버전"] [data-edition="retail"]').getAttribute('href')).toBe('/');
      for (const block of data.sections) {
        const element = container.querySelector(`#${block.id}`);
        expect(element).not.toBeNull();
        // 본문이 한 칸뿐인 쪽은 목차를 그리지 않는다.
        if (data.sections.length > 1) expect(container.querySelector(`a[href="#${block.id}"]`)).not.toBeNull();
        expect(element.querySelector('h2').textContent).toBe(block.title);
        if (block.art) {
          const image = element.querySelector('img');
          expect(image.alt).toBe(block.art.alt);
          expect(image.getAttribute('src')).toContain(`/images/forever/${block.art.id}-`);
          expect(image.getAttribute('loading')).toBe('lazy');
        }
        block.items?.forEach(item => expect(element.textContent).toContain(item.body));
        if (block.table) {
          expect(element.querySelectorAll('tbody tr')).toHaveLength(block.table.rows.length);
          expect(element.querySelector('[role="region"]')).not.toBeNull();
          block.table.rows.flat().forEach(cell => expect(element.textContent).toContain(cell));
        }
        for (const source of block.sources) expect(container.querySelector(`footer a[href="${foreverSources[source].url}"]`)).not.toBeNull();
      }
      expect(getPageMeta(path)).toMatchObject({ index: true, canonical: `${SITE_ORIGIN}${path}` });
      expect(container.querySelectorAll('a[href^="/guide/"]')).toHaveLength(0);
    }
  } finally {
    act(() => root.unmount());
    container.remove();
  }
});

test('직업·종족 상세 가이드는 목록·특성 견본·원문·검색 주소를 연결한다', () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  try {
    for (const [id, data] of Object.entries(foreverDetailGuides)) {
      const path = `/forever/${id}`;
      act(() => root.render(<MemoryRouter key={id} initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Navigation /><ForeverPage section={id} /></MemoryRouter>));
      expect(container.querySelector('h1').textContent).toBe(data.title);
      expect(container.querySelector('nav[aria-label="가이드 목록으로"] a').getAttribute('href')).toBe(data.back.path);
      const tab = foreverPages.filter(page => isForeverPageActive(page, path));
      expect(tab.map(page => page.id)).toEqual([data.parent === 'leveling' ? 'races' : 'classes']);
      expect(container.querySelector('nav[aria-label="포에버 안내"] [aria-current="page"]').getAttribute('href')).toBe(tab[0].path);
      expect(container.querySelector('#primary-navigation a[aria-current="page"]').getAttribute('href')).toBe(tab[0].path);
      expect(getPageMeta(path)).toMatchObject({ index: true, title: `${data.title} | wowmeta`, canonical: `${SITE_ORIGIN}${path}` });
      for (const block of data.sections) {
        const section = container.querySelector(`#${block.id}`);
        expect(section.querySelector('h2').textContent).toBe(block.title);
        expect(container.querySelector(`a[href="#${block.id}"]`)).not.toBeNull();
        for (const link of block.links || []) {
          const anchor = section.querySelector(`a[href="${link.path}"]`);
          expect(anchor.textContent).toBe(link.label + (link.description || ''));
          if (link.path.startsWith('https:')) expect(anchor.rel).toBe('noopener noreferrer');
        }
        if (block.table) expect(section.querySelectorAll('tbody tr')).toHaveLength(block.table.rows.length);
        for (const source of block.sources) expect(container.querySelector(`footer a[href="${foreverSources[source].url}"]`)).not.toBeNull();
      }
      expect(container.querySelectorAll('a[href^="/guide/"]')).toHaveLength(0);
    }
  } finally {
    act(() => root.unmount());
    container.remove();
  }
});

test('직업 가이드·레벨링 가이드 탭은 목록 칸에서 모든 상세 쪽으로 이어진다', () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  try {
    const listed = [];
    for (const [id, expectedCount] of [['classes', 27], ['races', 10]]) {
      const path = `/forever/${id}`;
      act(() => root.render(<MemoryRouter key={id} initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Navigation /><ForeverPage section={id} /></MemoryRouter>));
      const index = foreverGuides[id].index;
      const panel = container.querySelector(`#${index.id}`);
      expect(panel.querySelector('h2').textContent).toBe(index.title);
      const cards = [...panel.querySelectorAll('li > a')];
      expect(cards).toHaveLength(expectedCount);
      for (const card of cards) {
        const target = foreverDetailGuides[card.getAttribute('href').slice('/forever/'.length)];
        expect(target).toBeDefined();
        expect(getPageMeta(card.getAttribute('href')).index).toBe(true);
        listed.push(card.getAttribute('href'));
      }
      for (const group of index.groups) expect(panel.querySelector(`h3#${index.id}-${group.id}`).textContent).toBe(group.label);
      expect(container.querySelector('#primary-navigation a[aria-current="page"]').textContent).toBe(id === 'classes' ? '직업 가이드' : '레벨링 가이드');
    }
    // 직업 제목은 직업 페이지, 칸은 전문화·종족 페이지로 간다.
    const expected = Object.entries(foreverDetailGuides).filter(([, page]) => page.specialization || page.parent === 'leveling').map(([key]) => `/forever/${key}`);
    expect(listed.sort()).toEqual(expected.sort());
  } finally {
    act(() => root.unmount());
    container.remove();
  }
});
