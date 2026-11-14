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
  document.timeline = { currentTime: 42 };
  Element.prototype.scrollIntoView = jest.fn();
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  delete document.timeline;
  delete Element.prototype.scrollIntoView;
});

const toggle = id => container.querySelector(`[aria-label="게임 버전"] a[data-edition="${id}"]`);
const menuLabels = () => [...container.querySelectorAll('#primary-navigation a')].map(link => link.textContent);

const clickStep = index => act(() => container.querySelector(`.fv-journey-steps button[data-stage="${index}"]`).click());
const clickJourney = text => act(() => [...container.querySelectorAll('.fv-journey button')].find(button => button.textContent === text).click());

test('종족 열 쪽의 단계 선택은 실제 경유지와 확대 지도에 연결된다', () => {
  for (const [id, page] of Object.entries(foreverDetailGuides).filter(([, page]) => page.parent === 'leveling')) {
    render(<ForeverPage section={id} />, `/forever/${id}`);
    const rows = page.sections.find(block => block.id === 'route').table.rows;
    const buttons = [...container.querySelectorAll('.fv-journey-steps button')];
    expect(buttons).toHaveLength(rows.length);
    buttons.forEach((button, index) => {
      act(() => button.click());
      expect(container.querySelector('.fv-journey-heading').textContent).toContain(rows[index][1]);
      expect(container.querySelector('.fv-journey-instructions').textContent).toContain(rows[index][2]);
      const svg = container.querySelector('.fv-journey-map svg');
      const [x, y, w, h] = container.querySelector('.fv-journey-camera').dataset.viewbox.split(' ').map(Number);
      expect(x).toBeGreaterThanOrEqual(0); expect(y).toBeGreaterThanOrEqual(0);
      expect(x + w).toBeLessThanOrEqual(903.000001); expect(y + h).toBeLessThanOrEqual(640.000001);
      const traveler = container.querySelector('.fv-journey-traveler');
      expect(x + w / 2).toBeCloseTo(parseFloat(traveler.style.left) * 903 / 100);
      expect(y + h / 2).toBeCloseTo(parseFloat(traveler.style.top) * 640 / 100);
      expect(w).toBeLessThanOrEqual(240);
      expect(svg.getAttribute('aria-label')).not.toMatch(/undefined|NaN/);
    });
    clickJourney('30~60레벨 추천 후보로 이어 보기 →');
    expect(container.querySelector('.fv-journey').dataset.phase).toBe('later');
    expect(container.querySelectorAll('.fv-journey-steps button')).toHaveLength(7);
    expect(container.querySelector('.fv-journey-heading').textContent).toContain('추정');
    expect(container.querySelector('.fv-journey-traveler').textContent).toBe('01');
    clickJourney('가시덤불 골짜기');
    expect(container.querySelector('.fv-journey-map svg').getAttribute('aria-label')).toContain('가시덤불 골짜기');
    clickStep(1);
    expect(container.querySelector('.fv-journey-map svg').getAttribute('aria-label')).toContain('가시덤불 골짜기');
    clickJourney('1~30 · 종족별 출발');
    expect(container.querySelector('.fv-journey').dataset.step).toBe('0');
  }
});

test('레벨 구간은 한 점씩 표시하고 고른 구간의 경로를 표식이 따라간다', () => {
  render(<ForeverPage section="leveling/human" />, '/forever/leveling/human');
  const journey = container.querySelector('.fv-journey');
  expect(journey.querySelector('.fv-journey-controls')).toBeNull();
  expect(journey.querySelector('.fv-journey-tools')).toBeNull();
  expect(container.querySelector('#starting-map').textContent).not.toContain('경로 재생');
  expect(journey.textContent).not.toMatch(/동작 재생|경로 재생|일시정지|세계 지도|다음 →|← 이전|6초마다/);
  expect(journey.querySelectorAll('ol')).toHaveLength(1);
  expect(journey.querySelector('.fv-journey-stops')).toBeNull();
  expect(journey.querySelectorAll('[aria-current="step"]')).toHaveLength(1);
  expect(journey.querySelectorAll('.fv-journey-steps button')).toHaveLength(7);
  expect(journey.querySelector('.fv-journey-traveler').textContent).toBe('01');
  const transfer = journey.querySelector('.fv-journey-steps button[data-stage="3"]');
  act(() => transfer.click());
  expect(transfer.getAttribute('aria-current')).toBe('step');
  expect(journey.querySelector('svg').getAttribute('aria-label')).toContain('붉은마루 산맥 → 스톰윈드');
  expect(journey.querySelectorAll('li[data-complete=true]')).toHaveLength(3);
  const pins = [...journey.querySelectorAll('.fv-journey-pin')];
  const traveler = journey.querySelector('.fv-journey-traveler');
  expect(traveler.textContent).toBe('04');
  expect(pins[0].classList.contains('is-origin')).toBe(true);
  expect(pins.at(-1).classList.contains('is-destination')).toBe(true);
  expect(Number(traveler.dataset.legs)).toBe(pins.length - 1);
  expect([traveler.style.left, traveler.style.top]).toEqual([pins.at(-1).style.left, pins.at(-1).style.top]);
  expect(journey.querySelectorAll('.fv-journey-leg-line')).toHaveLength(pins.length - 1);
  clickStep(0);
  expect(journey.querySelectorAll('.fv-journey-leg-line')).toHaveLength(0);
  expect(journey.querySelectorAll('.fv-journey-pin')).toHaveLength(1);
});

test('구간을 고르면 표식과 지도가 같은 속도로 움직여 플레이어를 중앙에 유지한다', () => {
  const calls = [];
  const original = Element.prototype.animate;
  Element.prototype.animate = function animate(keyframes, options) { const animation = { cancel: jest.fn() }; calls.push({ target: this, keyframes, options, animation }); return animation; };
  try {
    render(<ForeverPage section="leveling/skyborne-alliance" />);
    expect(container.querySelector('.fv-journey').dataset.moving).toBe('true');
    expect(calls.at(-1).keyframes[0].opacity).toBe(0);
    clickStep(1);
    const svg = container.querySelector('.fv-journey-map svg');
    expect(svg.getAttribute('aria-label')).toContain('제프라스 섬 → 달라란 (경유) → 스톰윈드');
    expect(container.querySelector('.fv-journey-leg').textContent).toContain('배 → 스카이본 전용 차원문');
    const pins = [...container.querySelectorAll('.fv-journey-pin')];
    const { target, keyframes, options, animation } = calls.at(-2);
    const follow = calls.at(-1);
    expect(target).toBe(container.querySelector('.fv-journey-traveler'));
    expect(keyframes.map(frame => [frame.left, frame.top])).toEqual(pins.map(pin => [pin.style.left, pin.style.top]));
    expect(keyframes.map(frame => frame.offset)).toEqual([0, 0.5, 1]);
    expect(options).toMatchObject({ delay: 600, duration: 2200, fill: 'backwards' });
    expect(follow.target).toBe(container.querySelector('.fv-journey-camera'));
    expect(follow.options).toEqual(options);
    expect(animation.startTime).toBe(42);
    expect(follow.animation.startTime).toBe(animation.startTime);
    expect(pins.map(pin => pin.style.getPropertyValue('--arrival-delay'))).toEqual(['0ms', '1700ms', '2800ms']);
    const [, , w, h] = container.querySelector('.fv-journey-camera').dataset.viewbox.split(' ').map(Number);
    pins.forEach((pin, index) => {
      const px = parseFloat(pin.style.left) * 903 / 100, py = parseFloat(pin.style.top) * 640 / 100;
      const frame = follow.keyframes[index];
      const [, tx, ty, zoom] = frame.transform.match(/translate\(([-\d.]+)%, ([-\d.]+)%\) scale\(([-\d.]+)\)/).map(Number);
      expect(tx + px / 903 * zoom * 100).toBeCloseTo(50);
      expect(ty + py / 640 * zoom * 100).toBeCloseTo(50);
      expect(frame.offset).toBe(keyframes[index].offset);
      expect(frame.easing).toBe(keyframes[index].easing);
      expect(px - w / 2).toBeGreaterThanOrEqual(0);
      expect(py - h / 2).toBeGreaterThanOrEqual(0);
      expect(px + w / 2).toBeLessThanOrEqual(903.000001);
      expect(py + h / 2).toBeLessThanOrEqual(640.000001);
    });
    const count = calls.length;
    act(() => container.querySelector('.fv-journey-heading').click());
    expect(calls).toHaveLength(count);
    clickStep(2);
    expect(calls.length).toBe(count + 2);
    expect(animation.cancel).toHaveBeenCalledTimes(1);
    expect(follow.animation.cancel).toHaveBeenCalledTimes(1);
    expect(container.querySelector('.fv-journey-map svg').getAttribute('aria-label')).toContain('스톰윈드 → 서부 몰락지대');
    clickStep(2);
    expect(calls.length).toBe(count + 4);
  } finally { Element.prototype.animate = original; }
});

test.each([false, true])('지도가 화면 밖이면 먼저 보이게 한 뒤 클릭한 이동을 재생한다 (동작 줄이기: %s)', reduced => {
  const oldQuery = window.matchMedia;
  const oldObserver = window.IntersectionObserver;
  const oldAnimate = Element.prototype.animate;
  const events = [];
  window.matchMedia = () => ({ matches: reduced, addEventListener: jest.fn(), removeEventListener: jest.fn() });
  window.IntersectionObserver = jest.fn(() => ({ observe: jest.fn(), disconnect: jest.fn() }));
  Element.prototype.scrollIntoView.mockImplementation(function scroll(options) { events.push({ target: this, options }); });
  Element.prototype.animate = jest.fn(() => { events.push('animate'); return { cancel: jest.fn() }; });
  try {
    render(<ForeverPage section="leveling/human" />);
    expect(events).toHaveLength(0);
    clickStep(1);
    expect(events).toEqual([
      { target: container.querySelector('.fv-journey-viewport'), options: { block: 'nearest', behavior: 'instant' } },
      'animate', 'animate',
    ]);
    expect(container.querySelector('.fv-journey').dataset.moving).toBe('true');
    clickStep(1);
    expect(events.slice(3)).toEqual(events.slice(0, 3));
  } finally {
    window.matchMedia = oldQuery;
    window.IntersectionObserver = oldObserver;
    Element.prototype.animate = oldAnimate;
  }
});

test('동작 줄이기는 자동 재생만 막고 직접 고른 구간은 다시 재생한다', () => {
  const old = window.matchMedia;
  const original = Element.prototype.animate;
  Element.prototype.animate = jest.fn(() => ({ cancel: jest.fn() }));
  const preference = { matches: true, addEventListener: jest.fn(), removeEventListener: jest.fn() };
  window.matchMedia = () => preference;
  try {
    render(<ForeverPage section="leveling/skyborne-horde" />);
    expect(container.querySelector('.fv-journey').dataset.moving).toBe('false');
    expect(Element.prototype.animate).not.toHaveBeenCalled();
    clickStep(1);
    expect(container.querySelector('.fv-journey').dataset.moving).toBe('true');
    expect(Element.prototype.animate).toHaveBeenCalledTimes(2);
    const first = Element.prototype.animate.mock.results[0].value;
    const firstCamera = Element.prototype.animate.mock.results[1].value;
    const pins = [...container.querySelectorAll('.fv-journey-pin')];
    expect(Element.prototype.animate.mock.calls[0][0].map(frame => [frame.left, frame.top])).toEqual(pins.map(pin => [pin.style.left, pin.style.top]));
    clickStep(1);
    expect(first.cancel).toHaveBeenCalledTimes(1);
    expect(firstCamera.cancel).toHaveBeenCalledTimes(1);
    expect(Element.prototype.animate).toHaveBeenCalledTimes(4);
    const updatePreference = preference.addEventListener.mock.calls[0][1];
    act(() => updatePreference());
    expect(container.querySelector('.fv-journey').dataset.moving).toBe('false');
    expect(Element.prototype.animate.mock.results[2].value.cancel).toHaveBeenCalledTimes(1);
    expect(Element.prototype.animate.mock.results[3].value.cancel).toHaveBeenCalledTimes(1);
    expect(container.querySelector('.fv-journey-instructions').textContent).toContain('은빛소나무 숲 직행 배');
    act(() => container.querySelector('.fv-journey-map image').dispatchEvent(new Event('error')));
    expect(container.querySelector('.fv-journey [role=status]').textContent).toContain('지도를 불러오지 못했습니다');
    expect(container.querySelector('.fv-journey-steps [aria-current="step"]').textContent).toContain('멀고어·잊혀진 땅 사이 고원');
  } finally { window.matchMedia = old; Element.prototype.animate = original; }
});

test('퀘스트의 위협은 도적 스킬로 연결하지 않고 전사 본문은 전사 스킬을 연결한다', () => {
  render(<ForeverPage section="raids" />, '/forever/raids');
  expect(container.querySelector('#alliance-attunement').textContent).toContain('용혈족의 위협');
  expect(container.querySelector('#alliance-attunement .fv-spell')).toBeNull();
  render(<ForeverPage section="classes/warrior/arms" />, '/forever/classes/warrior/arms');
  expect(container.querySelector('#combat-principle p [data-spell-id="12294"]')).not.toBeNull();
});

test('전투 흐름은 순서와 스킬 버튼을 유지하고 표는 좁은 화면용 항목명을 갖는다', () => {
  render(<ForeverPage section="classes/warrior/arms" />, '/forever/classes/warrior/arms');
  const flows = container.querySelectorAll('#combat-flow .fv-flow');
  expect(flows).toHaveLength(3);
  for (const flow of flows) {
    expect(flow.querySelectorAll('.fv-flow-node')).toHaveLength(flow.children.length);
    expect(flow.querySelector('.fv-flow-node button[data-spell-id]')).not.toBeNull();
  }
  const table = container.querySelector('#talents table');
  const headings = [...table.querySelectorAll('thead th')].map(th => th.textContent);
  for (const row of table.querySelectorAll('tbody tr')) {
    expect([...row.querySelectorAll('td')].map(td => td.dataset.label)).toEqual(headings.slice(1));
  }
  const sources = container.querySelector('#combat-flow .fv-block-sources');
  expect(sources.open).toBe(false);
  expect(sources.querySelectorAll('a').length).toBeGreaterThan(0);

  render(<ForeverPage section="raids" />, '/forever/raids');
  const longFlow = container.querySelector('#alliance-attunement .fv-flow-long');
  expect(longFlow.children.length).toBeGreaterThan(3);
  expect(longFlow.querySelectorAll('.fv-action-node')).toHaveLength(longFlow.children.length);
});

test('전문화 27쪽은 별도 KB의 한국어 설명과 아이콘·키보드 툴팁을 연결한다', () => {
  for (const [id, page] of Object.entries(foreverDetailGuides).filter(([, page]) => page.specialization)) {
    render(<ForeverPage section={id} />, `/forever/${id}`);
    const spells = page.sections.find(block => block.id === 'talent-effects').spells;
    const block = container.querySelector('#talent-effects');
    for (const spell of spells) {
      const link = block.querySelector(`button[data-spell-id="${spell.id}"]`);
      expect(link.querySelector('img').src).toContain(spell.icon);
      expect(link.textContent).toContain(spell.name);
      act(() => link.dispatchEvent(new FocusEvent('focusin', { bubbles: true })));
      const tooltip = document.getElementById(link.getAttribute('aria-describedby'));
      expect(tooltip.getAttribute('role')).toBe('tooltip');
      expect(tooltip.textContent).toContain(spell.verified ? spell.description : '한국어 설명 확인 전');
      expect(link.closest('dt').nextElementSibling.textContent).toContain(spell.verified ? spell.description : spell.reason);
      act(() => link.dispatchEvent(new FocusEvent('focusout', { bubbles: true })));
    }
  }
});

test('종족 열 쪽은 30~60레벨 추정 후보와 공식 던전 범위를 구분한다', () => {
  for (const [id, page] of Object.entries(foreverDetailGuides).filter(([, page]) => page.parent === 'leveling')) {
    render(<ForeverPage section={id} />, `/forever/${id}`);
    expect(container.querySelector('#leveling-guide h2').textContent).toContain('레벨업 가이드');
    expect(container.querySelector('#leveling-guide').textContent).toContain('30~60레벨 · 추정');
    const block = container.querySelector('#after-30');
    expect(block.querySelectorAll('tbody tr')).toHaveLength(7);
    expect(block.textContent).toContain('추정');
    expect(container.querySelector('#route-notes').textContent).toContain('공식 소개 범위');
    expect(block.textContent).toContain('검은아귀 요새');
    expect(block.querySelector('a[href*="from-30-to-60"]')).not.toBeNull();
  }
});

test('종족별 출발 여덟 경로와 스카이본 이동을 구분하고 합류 뒤 60까지 잇는다', () => {
  const rows = race => foreverDetailGuides[`leveling/${race}`].sections.find(block => block.id === 'route').table.rows;
  const races = Object.entries(foreverDetailGuides).filter(([, page]) => page.parent === 'leveling');
  expect(new Set(races.map(([id]) => JSON.stringify(rows(id.split('/')[1])))).size).toBe(8);
  expect(rows('dwarf')).toEqual(rows('gnome'));
  expect(rows('orc')).toEqual(rows('troll'));
  for (const race of ['human', 'dwarf', 'gnome', 'skyborne-alliance']) expect(rows(race).at(-1)[0]).toBe('27~30');
  expect(rows('night-elf').at(-1)[0]).toBe('28~30');
  expect(rows('orc')[1][1]).toBe('티리스팔 숲');
  expect(rows('tauren')[1][1]).toBe('은빛소나무 숲 · 언더시티');
  expect(rows('night-elf').some(row => row[1] === '저습지')).toBe(true);
  for (const [id, page] of races) {
    const early = page.sections.find(block => block.id === 'route');
    const late = page.sections.find(block => block.id === 'after-30');
    expect(early.table.rows[0][0]).toMatch(/^1~/);
    expect(early.table.rows[early.table.rows.length - 1][0]).toContain('30');
    expect(late.table.rows.map(row => row[0])).toEqual(['30~35 안팎', '35~40 안팎', '40~45 안팎', '45~50 안팎', '50~53 안팎', '53~55 안팎', '55~60 안팎']);
    expect(late.lead).toContain(early.table.rows[early.table.rows.length - 1][1]);
    render(<ForeverPage section={id} />, `/forever/${id}`);
    expect(container.querySelector('#route tbody').textContent).toContain(early.table.rows[1][1]);
    expect(container.querySelector('#leveling-guide').textContent).toMatch(/합류|합쳐/);
    expect(container.querySelector('#start').textContent).not.toContain('도착지를 확정하지');
  }
  render(<ForeverPage section="leveling/skyborne-alliance" />, '/forever/leveling/skyborne-alliance');
  expect(container.querySelector('#start').textContent).toContain('전용 차원문');
  expect(container.querySelector('#route').textContent).toContain('던전 진행이 아님');
  render(<ForeverPage section="leveling/skyborne-horde" />, '/forever/leveling/skyborne-horde');
  expect(container.querySelector('#start').textContent).toContain('은빛소나무 숲에 바로 도착하지');
  expect(container.querySelector('#route').textContent).toContain('멀고어·잊혀진 땅 사이 고원');
  render(<ForeverPage section="leveling/human" />, '/forever/leveling/human');
  clickStep(rows('human').length - 1);
  expect(container.querySelector('.fv-journey-leg').textContent).toContain('메네실 항구 → 사우스쇼어 경유 → 아우버다인 배');
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
        const link = block.querySelector(`button[data-spell-id="${spell.id}"]`);
        expect(link.querySelector('img')).not.toBeNull();
        act(() => link.dispatchEvent(new FocusEvent('focusin', { bubbles: true })));
        expect(document.getElementById(link.getAttribute('aria-describedby')).textContent).toContain(spell.verified ? spell.description : '한국어 설명 확인 전');
        act(() => link.dispatchEvent(new FocusEvent('focusout', { bubbles: true })));
        expect(block.textContent).toContain(reason);
      }
      for (const source of spec.sources) expect(block.querySelector(`a[href="${foreverSources[source].url}"]`)).not.toBeNull();
    }
    const ids = [...container.querySelectorAll('[id]')].map(node => node.id);
    expect(new Set(ids).size).toBe(ids.length);
  }
});

test('모든 전문화는 배분표와 레벨별 계산기를 보여 주며 추가 견본은 한계를 알린다', () => {
  let added = 0;
  for (const [id, page] of Object.entries(foreverDetailGuides).filter(([, page]) => page.specialization)) {
    render(<ForeverPage section={id} />, `/forever/${id}`);
    const block = container.querySelector('#talents');
    expect(block).not.toBeNull();
    const data = page.sections.find(section => section.id === 'talents');
    expect(block.querySelectorAll('tbody tr')).toHaveLength(data.table.rows.length);
    for (const link of data.links) expect(block.querySelector(`a[href="${link.path}"]`).textContent).toBe(link.label);
    if (data.links[0].path.startsWith('https://foreverdb.net/')) {
      added++;
      expect(data.table.rows.map(row => row[0])).toEqual(['20레벨', '30레벨', '40레벨', '50레벨', '60레벨']);
      expect(block.textContent).toContain('실전 검증');
      expect(block.textContent).toContain('초기화');
    }
  }
  expect(added).toBe(18);
});

test('힘의 전환의 원문 표시 문제는 설명과 툴팁 모두에 남는다', () => {
  render(<ForeverPage section="classes/druid/feral" />, '/forever/classes/druid/feral');
  const link = container.querySelector('#talent-effects button[data-spell-id="1322605"]');
  expect(link.closest('dt').nextElementSibling.textContent).toContain('기본 마나의 55%');
  expect(link.closest('dt').nextElementSibling.textContent).toContain('마나 실소모량 미확인');
  act(() => link.dispatchEvent(new FocusEvent('focusin', { bubbles: true })));
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
    ['home', 2 + foreverHome.differences.length, foreverHome.next.length],
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
