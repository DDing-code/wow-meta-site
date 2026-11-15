import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import ForeverPage from './ForeverPage';
import { foreverDetailGuides } from '../data/foreverGuide';

test('공개한 종족 영상만 연결하고 후반 추정 안내를 함께 표시한다', () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement('div');
  const root = createRoot(container);
  const urls = new Set();
  try {
    for (const race of ['human', 'dwarf', 'gnome', 'night-elf', 'skyborne-alliance', 'orc', 'troll']) {
      const section = `leveling/${race}`;
      act(() => root.render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><ForeverPage section={section} /></MemoryRouter>));
      const panel = container.querySelector('#video');
      expect(panel.textContent).toContain('30~60레벨의 이동 동선과 구간 연결은 추정');
      const link = panel.querySelector('a[href^="https://www.youtube.com/watch?v="]');
      expect(link.href).toMatch(/^https:\/\/www\.youtube\.com\/watch\?v=[\w-]{11}$/);
      expect(link.textContent).toContain('유튜브에서 보기');
      urls.add(link.href);
    }
    expect(urls.size).toBe(5);
    for (const race of ['tauren', 'undead', 'skyborne-horde']) {
      expect(foreverDetailGuides[`leveling/${race}`].sections.some(block => block.id === 'video')).toBe(false);
    }
  } finally {
    act(() => root.unmount());
  }
});
