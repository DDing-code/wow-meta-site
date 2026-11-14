import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import ForeverPage from './ForeverPage.js';
import Navigation from '../components/Navigation.js';
import { FOREVER_ART_NOTE, foreverDetailGuides, foreverHome, foreverPages, foreverRules, foreverSources, foreverStart } from '../data/foreverGuide.js';
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

test('전문화 27쪽은 별도 KB의 한국어 설명과 아이콘·키보드 툴팁을 연결한다', () => {
  for (const [id, page] of Object.entries(foreverDetailGuides).filter(([, page]) => page.specialization)) {
    render(<ForeverPage section={id} />, `/forever/${id}`);
    const spells = page.sections.find(block => block.id === 'talent-effects').spells;
    const block = container.querySelector('#talent-effects');
    for (const spell of spells) {
      const link = block.querySelector(`a[href="${spell.source}"]`);
      expect(link.querySelector('img').src).toContain(spell.icon);
      expect(link.textContent).toContain(spell.name);
      const tooltip = document.getElementById(link.getAttribute('aria-describedby'));
      expect(tooltip.getAttribute('role')).toBe('tooltip');
      expect(tooltip.textContent).toContain(spell.verified ? spell.description : '한국어 설명 확인 전');
      expect(link.closest('dt').nextElementSibling.textContent).toContain(spell.verified ? spell.description : spell.reason);
    }
  }
});

test('종족 열 쪽은 30~60레벨 추정 후보와 공식 던전 범위를 구분한다', () => {
  for (const [id, page] of Object.entries(foreverDetailGuides).filter(([, page]) => page.parent === 'leveling')) {
    render(<ForeverPage section={id} />, `/forever/${id}`);
    expect(container.querySelector('#leveling-guide h2').textContent).toContain('레벨업 가이드');
    expect(container.querySelector('#leveling-guide').textContent).toContain('30~60레벨 · 추정');
    const block = container.querySelector('#after-30');
    expect(block.querySelectorAll('tbody tr')).toHaveLength(5);
    expect(block.textContent).toContain('추정');
    expect(block.textContent).toContain('공식 소개 범위');
    expect(block.textContent).toContain('검은아귀 요새');
    expect(block.querySelector('a[href*="from-30-to-60"]')).not.toBeNull();
  }
});

test('27개 전문화의 추천 순서와 KB 툴팁은 중복 ID 없이 연결된다', () => {
  const specializations = Object.entries(foreverDetailGuides).filter(([, page]) => page.specialization);
  expect(specializations).toHaveLength(27);
  for (const [id, page] of specializations) {
    render(<ForeverPage section={id} />, `/forever/${id}`);
    const paths = page.sections.filter(block => block.id.startsWith('talent-guide-'));
    expect(paths).toHaveLength(1);
    for (const spec of paths) {
      const block = container.querySelector(`#${spec.id}`);
      expect(block.querySelectorAll('ol li')).toHaveLength(spec.milestones.length);
      for (const { spell, reason } of spec.milestones) {
        const link = block.querySelector(`a[href="${spell.source}"]`);
        expect(link.querySelector('img')).not.toBeNull();
        expect(document.getElementById(link.getAttribute('aria-describedby')).textContent).toContain(spell.verified ? spell.description : '한국어 설명 확인 전');
        expect(block.textContent).toContain(reason);
      }
      for (const source of spec.sources) expect(block.querySelector(`a[href="${foreverSources[source].url}"]`)).not.toBeNull();
    }
    const ids = [...container.querySelectorAll('[id]')].map(node => node.id);
    expect(new Set(ids).size).toBe(ids.length);
  }
});

test('힘의 전환의 원문 표시 문제는 설명과 툴팁 모두에 남는다', () => {
  render(<ForeverPage section="classes/druid/feral" />, '/forever/classes/druid/feral');
  const link = container.querySelector('#talent-effects a[href*="spell=1322605/"]');
  expect(link.closest('dt').nextElementSibling.textContent).toContain('기본 마나의 55%');
  expect(document.getElementById(link.getAttribute('aria-describedby')).textContent).toContain('0의 마나');
});

test('직업 선택에서 각 전문화의 별도 주소로 이동한다', () => {
  for (const [id, page] of Object.entries(foreverDetailGuides).filter(([, page]) => page.parent === 'classes')) {
    render(<ForeverPage section={id} />, `/forever/${id}`);
    const links = [...container.querySelectorAll('#specializations a[href^="/forever/classes/"]')];
    expect(links).toHaveLength(3);
    for (const link of links) {
      const target = foreverDetailGuides[link.getAttribute('href').slice('/forever/'.length)];
      expect(target.parent).toBe(id);
      expect(target.specialization).toBe(true);
      expect(link.querySelector('strong').textContent).toBe(target.label);
      expect(getPageMeta(link.getAttribute('href')).index).toBe(true);
    }
    expect(container.querySelector('[id^="talent-guide-"]')).toBeNull();
  }
});

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

test('세 쪽 모두 대표 그림과 항목별 도트 그림을 설명과 함께 보여 준다', () => {
  const pages = [
    ['home', 1 + foreverHome.differences.length, foreverHome.next.length],
    ['start', 1 + foreverStart.steps.length + foreverStart.basics.length + 1, 0],
    ['rules', 1 + foreverRules.rules.length + 1, 0],
  ];
  for (const [section, described, decorative] of pages) {
    render(<ForeverPage section={section} />, '/forever');
    const images = [...container.querySelectorAll('img')];
    expect(images.filter(image => image.alt)).toHaveLength(described);
    expect(images.filter(image => !image.alt)).toHaveLength(decorative);
    for (const image of images) {
      expect(image.getAttribute('src')).toMatch(/^\/images\/forever\/[a-z0-9-]+-\d+\.webp$/);
      expect(image.getAttribute('srcset')).toContain(image.getAttribute('src'));
      expect(image.getAttribute('width')).not.toBeNull();
    }
    // 맨 위 대표 그림만 바로 받고 나머지는 보일 때 받는다.
    expect(images[0].getAttribute('loading')).toBe('eager');
    expect(images.slice(1).every(image => image.getAttribute('loading') === 'lazy')).toBe(true);
    expect(container.querySelector('footer').textContent).toContain(FOREVER_ART_NOTE);
  }
  render(<ForeverPage section="rules" />, '/forever/rules');
  expect(container.querySelector('section[aria-labelledby="forever-rule-list"] li img').alt).toBe(foreverRules.rules[0].art.alt);
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
  expect(menuLabels()).toEqual(foreverPages.map(page => page.label));
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


test('포에버 안내 메뉴는 현재 페이지를 표시하고 세 페이지를 연결한다', () => {
  for (const [section, path] of [['home', '/forever'], ['start', '/forever/start'], ['rules', '/forever/rules']]) {
    act(() => root.unmount());
    root = createRoot(container);
    render(<ForeverPage section={section} />, path);
    const nav = container.querySelector('nav[aria-label="포에버 안내"]');
    expect([...nav.querySelectorAll('a')].map(link => link.getAttribute('href')))
      .toEqual(foreverPages.map(page => page.path));
    expect(nav.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
    expect(nav.querySelector('[aria-current="page"]').getAttribute('href')).toBe(path);
  }
});
