import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import ForeverPage from './ForeverPage.js';
import Navigation from '../components/Navigation.js';
import { foreverGuides, foreverPages, foreverSources } from '../data/foreverGuide.js';
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
        expect(container.querySelector(`a[href="#${block.id}"]`)).not.toBeNull();
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
          expect(element.querySelector('[role="region"]').getAttribute('tabindex')).toBe('0');
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
