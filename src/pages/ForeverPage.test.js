import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import ForeverPage from './ForeverPage.js';
import Navigation from '../components/Navigation.js';
import { foreverHome, foreverRules, foreverSources, foreverStart } from '../data/foreverGuide.js';
import { getPageMeta, SITE_ORIGIN } from '../data/siteMeta.js';

let container;
let root;
const render = (node, path = '/') => act(() => root.render(
  <MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{node}</MemoryRouter>
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

const toggle = id => container.querySelector(`[aria-label="게임 버전"] a[data-edition="${id}"]`);
const menuLabels = () => [...container.querySelectorAll('#primary-navigation a')].map(link => link.textContent);

test('포에버 홈은 요약 네 칸과 리테일과 다른 점, 근거 공지를 보여 준다', () => {
  render(<ForeverPage section="home" />, '/forever');
  expect(container.querySelector('h1').textContent).toBe(foreverHome.title);
  expect(container.querySelectorAll('dl > div')).toHaveLength(4);
  expect(container.textContent).toContain('2026년 11월 5일');
  expect(container.textContent).toContain('지하 심굴 10인, 하이잘 정상 20인, 오닉시아의 둥지 40인');
  expect(container.querySelectorAll('section[aria-labelledby="forever-differences"] li')).toHaveLength(foreverHome.differences.length);
  expect(container.querySelector('a[href="/forever/start"]')).not.toBeNull();
  expect(container.querySelector('a[href="/forever/rules"]')).not.toBeNull();
  const sources = [...container.querySelectorAll('footer a')];
  expect(sources.length).toBeGreaterThan(0);
  for (const link of sources) expect(link.href).toMatch(/^https:\/\/(worldofwarcraft|news)\.blizzard\.com\/ko-kr\//);
  expect(container.querySelector(`footer a[href="${foreverSources.launch.url}"]`)).not.toBeNull();
});

test('시작하기는 여섯 단계와 사전 설정 비교표, 규칙 페이지 링크를 보여 준다', () => {
  render(<ForeverPage section="start" />, '/forever/start');
  expect(container.querySelectorAll('ol[aria-label="시작 여섯 단계"] li')).toHaveLength(6);
  foreverStart.steps.forEach((step, index) => {
    expect(container.querySelector(`#step-${index + 1} h3`).textContent).toBe(step.title);
  });
  const rows = [...container.querySelectorAll('#step-3 tbody tr')];
  expect(rows).toHaveLength(foreverStart.presets.rows.length);
  expect(rows[0].textContent).toBe('캐릭터 모델표준 해상도고해상도');
  expect(container.querySelector('#step-4 a[href="/forever/rules"]')).not.toBeNull();
  expect(container.querySelectorAll('kbd')).toHaveLength(foreverStart.keys.length);
});

test('규칙·진영은 규칙 다섯 가지와 진영 제한, 같이 하기 조건을 보여 준다', () => {
  render(<ForeverPage section="rules" />, '/forever/rules');
  const cards = [...container.querySelectorAll('section[aria-labelledby="forever-rule-list"] li')];
  expect(cards.map(card => card.querySelector('h3').firstChild.textContent)).toEqual(['일반', 'PvP', '롤플레이', '롤플레이 PvP', '하드코어']);
  expect(cards[1].textContent).toContain('한쪽 진영만 만들 수 있음');
  expect(cards[4].textContent).toContain('출시 뒤 추가 예정');
  expect(container.textContent).toContain(foreverRules.factionNote);
  expect(container.querySelectorAll('section[aria-labelledby="forever-together"] li')).toHaveLength(foreverRules.together.length);
  expect(container.querySelectorAll('[aria-label="안 됩니다"]')).toHaveLength(2);
});

test('토글은 리테일 화면에서 포에버 짝 페이지나 포에버 홈으로 보낸다', () => {
  render(<Navigation />, '/beginner');
  expect(toggle('retail').getAttribute('aria-current')).toBe('true');
  expect(toggle('forever').getAttribute('aria-current')).toBeNull();
  expect(toggle('forever').getAttribute('href')).toBe('/forever/start');
  expect(menuLabels()).toContain('직업 가이드');
  expect(menuLabels()).not.toContain('규칙·진영');
});

test('짝이 없는 리테일 화면에서는 포에버 홈으로 보낸다', () => {
  render(<Navigation />, '/raid/kithix');
  expect(toggle('forever').getAttribute('href')).toBe('/forever');
  expect(toggle('retail').getAttribute('href')).toBe('/raid/kithix');
});

test('포에버 화면에서는 포에버 메뉴만 보이고 토글이 리테일로 되돌린다', () => {
  render(<Navigation />, '/forever/rules');
  expect(toggle('forever').getAttribute('aria-current')).toBe('true');
  expect(toggle('retail').getAttribute('href')).toBe('/');
  expect(menuLabels()).toEqual(['포에버 홈', '시작하기', '규칙·진영']);
  expect(container.querySelector('#primary-navigation a[aria-current="page"]').textContent).toBe('규칙·진영');
  // 로고는 지금 버전의 홈으로 간다.
  expect(container.querySelector('nav a').getAttribute('href')).toBe('/forever');
});

test('시작하기에서 리테일로 바꾸면 초보자 안내로 간다', () => {
  render(<Navigation />, '/forever/start');
  expect(toggle('retail').getAttribute('href')).toBe('/beginner');
});

test('포에버 세 쪽은 검색에 노출되는 제목과 대표 주소를 가진다', () => {
  const titles = ['/forever', '/forever/start', '/forever/rules'].map(path => {
    const meta = getPageMeta(path);
    expect(meta.index).toBe(true);
    expect(meta.canonical).toBe(`${SITE_ORIGIN}${path}`);
    expect(meta.title).toContain('포에버');
    return meta.title;
  });
  expect(new Set(titles).size).toBe(3);
  expect(getPageMeta('/forever/unknown').index).toBe(false);
});
