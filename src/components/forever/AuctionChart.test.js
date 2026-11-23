import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import AuctionChart, { auctionMoney } from './AuctionChart';
import ForeverPage from '../../pages/ForeverPage';
import snapshot from '../../data/foreverAuction.json';
import koreanSnapshot from '../../data/foreverAuctionKr.json';

let container;
let root;
const originalFetch = global.fetch;
beforeEach(() => {
  global.fetch = jest.fn(() => new Promise(() => {}));
  global.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  global.fetch = originalFetch;
});
const render = data => act(() => root.render(<AuctionChart data={data} />));

test('경매장 독립 탭은 공식 한국 가격만 보여 주고 미국 시험 가격은 공개하지 않는다', () => {
  act(() => root.render(<MemoryRouter initialEntries={['/forever/auction']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><ForeverPage section="auction" /></MemoryRouter>));
  const section = container.querySelector('#auction');
  expect(container.querySelector('h1').textContent).toBe('포에버 경매장');
  expect(container.querySelector('a[aria-current="page"]').getAttribute('href')).toBe('/forever/auction');
  expect(section.querySelectorAll('select option')).toHaveLength(4);
  expect(section.textContent).toContain('블리자드 한국 경매장');
  expect(section.textContent).toContain('일반·전쟁 구분 미확인');
  expect(section.textContent).not.toContain('미국');
  expect(section.querySelector('.auction-plot')).not.toBeNull();
  act(() => root.render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><ForeverPage /></MemoryRouter>));
  expect(container.querySelector('#auction a').getAttribute('href')).toBe('/forever/auction');
  expect(container.querySelector('.auction-workspace')).toBeNull();
});

test('미확정 일반·전쟁 이름을 붙이지 않고 한국 네 경매장 가격·수량을 따로 보여 준다', () => {
  act(() => root.render(<AuctionChart />));
  const select = container.querySelector('select');
  for (const market of koreanSnapshot.markets) {
      act(() => {
        select.value = market.market;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      });
      expect(container.querySelector('.auction-market').textContent).toBe(market.marketLabel);
      expect(container.querySelector('.auction-heading strong').textContent).toBe(auctionMoney(market.items[0].candles.at(-1).close));
      expect(container.querySelector('.auction-quote').textContent).toContain(`매물 ${market.items[0].listedQuantity.toLocaleString('ko-KR')}개`);
  }
  expect([...select.options].every(option => option.value.endsWith('.kr'))).toBe(true);
});

test('공개 한국 자료로 갱신하고 다른 지역·망가진 응답·통신 실패에는 마지막 가격을 유지한다', async () => {
  const newer = { ...koreanSnapshot, fetchedAt: '2026-11-24T00:00:00.000Z', markets: koreanSnapshot.markets.map(m => ({ ...m, items: m.items.map(i => ({ ...i, candles: i.candles.map(c => ({ ...c, open: 12345, high: 12345, low: 12345, close: 12345 })) })) })) };
  for (const result of [newer, { ...newer, region: 'us' }, { ...newer, markets: [] }, null]) {
    global.fetch = result ? jest.fn().mockResolvedValue({ ok: true, json: async () => result }) : jest.fn().mockRejectedValue(new Error('연결 실패'));
    await act(async () => root.render(<AuctionChart key={String(result?.region) + result?.markets.length} />));
    const valid = result === newer;
    expect(container.querySelector('.auction-heading strong').textContent).toBe(auctionMoney(valid ? 12345 : koreanSnapshot.markets[0].items[0].candles.at(-1).close));
    expect(container.textContent.includes('마지막 저장 자료를 표시')).toBe(!valid);
    expect(global.fetch.mock.calls[0][0]).toContain('/auction-data/forever-auction-kr.json');
  }
});
test('아이템과 날짜를 바꾸면 실제 원본 OHLC와 선택 상태가 함께 바뀐다', () => {
  render(snapshot);
  act(() => container.querySelectorAll('.auction-items button')[1].click());
  expect(container.querySelector('h3').textContent).toBe('구리 광석');
  const candles = container.querySelectorAll('svg [role=button]');
  act(() => candles[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })));
  expect(candles[0].getAttribute('aria-pressed')).toBe('true');
  expect([...container.querySelectorAll('.auction-values dd')].map(node => node.textContent)).toEqual(['open', 'high', 'low', 'close'].map(key => auctionMoney(snapshot.items[1].candles[0][key])));
  expect(container.querySelectorAll('tbody tr')).toHaveLength(snapshot.items[1].candles.length);
});
test('빈 관측은 0원 봉으로 그리지 않고 같은 가격 한 봉도 유한 좌표로 그린다', () => {
  render({ ...snapshot, items: [{ ...snapshot.items[0], candles: [] }] });
  expect(container.querySelector('svg')).toBeNull();
  expect(container.textContent).toContain('관측 기록이 없습니다');
  render({ ...snapshot, items: [{ ...snapshot.items[0], candles: [{ time: 1794787200000, open: 1, high: 1, low: 1, close: 1, quantity: 0 }] }] });
  expect(container.querySelectorAll('svg [role=button]')).toHaveLength(1);
  expect(container.innerHTML).not.toMatch(/NaN|Infinity/);
  expect(container.textContent).toContain('보합');
  render({ ...snapshot, items: [] });
  expect(container.textContent).toContain('저장된 가격 자료가 없습니다');
});
test('누락된 날은 날짜 간격으로 남기고 동을 반올림하지 않는다', () => {
  const item = snapshot.items[0];
  render({ ...snapshot, items: [{ ...item, candles: [item.candles[0], item.candles[1], item.candles[3]] }] });
  const xs = [...container.querySelectorAll('.auction-wick')].map(node => Number(node.getAttribute('x1')));
  expect(xs[2] - xs[1]).toBeCloseTo(2 * (xs[1] - xs[0]));
  expect(auctionMoney(0)).toBe('0동');
  expect(auctionMoney(1)).toBe('1동');
  expect(auctionMoney(100)).toBe('1은');
  expect(auctionMoney(10203)).toBe('1금 2은 3동');
});

const button = label => [...container.querySelectorAll('button')].find(node => node.getAttribute('aria-label') === label || node.textContent === label);
const click = label => act(() => button(label).click());

test('선 전환·기간 선택·확대·이동·초기화는 실제 날짜 범위에 적용된다', () => {
  render(snapshot);
  click('선');
  expect(container.querySelector('.auction-line')).not.toBeNull();
  click('7일');
  expect(container.querySelectorAll('svg [role=button]')).toHaveLength(7);
  expect(container.querySelector('svg [role=button]').getAttribute('aria-label')).toContain('11. 17.');
  click('이전 기간');
  expect(container.querySelector('svg [role=button]').getAttribute('aria-label')).toContain('11. 16.');
  expect(button('이전 기간').disabled).toBe(true);
  click('다음 기간');
  expect(button('다음 기간').disabled).toBe(true);
  click('차트 확대');
  expect(container.querySelectorAll('svg [role=button]')).toHaveLength(4);
  click('차트 축소');
  expect(container.querySelectorAll('svg [role=button]')).toHaveLength(6);
  click('전체 기간으로 초기화');
  expect(container.querySelectorAll('svg [role=button]')).toHaveLength(8);
  expect(button('차트 축소').disabled).toBe(true);
});

test('키보드 십자선은 날짜와 가격을 함께 바꾸고 끌 수 있다', () => {
  render(snapshot);
  const candles = container.querySelectorAll('svg [role=button]');
  act(() => candles[0].focus());
  expect(container.querySelector('.auction-crosshair')).not.toBeNull();
  act(() => candles[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })));
  expect(document.activeElement).toBe(candles[1]);
  expect([...container.querySelectorAll('.auction-values dd')].map(node => node.textContent)).toEqual(['open', 'high', 'low', 'close'].map(key => auctionMoney(snapshot.items[0].candles[1][key])));
  click('십자선');
  expect(container.querySelector('.auction-crosshair')).toBeNull();
});

test('선차트도 관측이 없는 날을 연결하지 않고 전일 대비를 만들지 않는다', () => {
  const item = snapshot.items[0];
  render({ ...snapshot, items: [{ ...item, candles: [item.candles[0], item.candles[2]] }] });
  click('선');
  expect(container.querySelector('.auction-line').getAttribute('d').match(/M/g)).toHaveLength(2);
  expect(container.querySelector('.auction-items button').textContent).toContain('—');
});

test('시간봉 전환은 정각·관측 공백을 보존하고 일봉으로 돌아오면 기간을 초기화한다', () => {
  const item = snapshot.items[0];
  const start = item.candles[0].time;
  const hourlyCandles = [0, 1, 3].map(offset => ({ ...item.candles[0], time: start + offset * 3600000 }));
  render({ ...snapshot, items: [{ ...item, hourlyCandles }] });
  expect(button('1분').disabled).toBe(true);
  click('차트 확대');
  click('1시간');
  expect(button('1시간').getAttribute('aria-pressed')).toBe('true');
  expect(container.querySelectorAll('svg [role=button]')).toHaveLength(3);
  expect(container.querySelector('.auction-plot svg').getAttribute('aria-label')).toContain('1시간 단위');
  expect(container.querySelector('.auction-date').textContent).toContain('03:00 · UTC');
  const xs = [...container.querySelectorAll('.auction-wick')].map(node => Number(node.getAttribute('x1')));
  expect(xs[2] - xs[1]).toBeCloseTo(2 * (xs[1] - xs[0]));
  click('선');
  expect(container.querySelector('.auction-line').getAttribute('d').match(/M/g)).toHaveLength(2);
  expect(container.querySelector('.auction-line').getAttribute('d').match(/L/g)).toHaveLength(1);
  click('차트 확대');
  click('1일');
  expect(container.querySelectorAll('svg [role=button]')).toHaveLength(item.candles.length);
  expect(button('차트 축소').disabled).toBe(true);
});

test('시간봉 자료가 없으면 전환을 막고 다른 단위로 채우지 않는다', () => {
  const { hourlyCandles, ...item } = snapshot.items[0];
  render({ ...snapshot, items: [item] });
  expect(button('1시간').disabled).toBe(true);
  click('1시간');
  expect(button('1일').getAttribute('aria-pressed')).toBe('true');
  expect(container.querySelectorAll('svg [role=button]')).toHaveLength(item.candles.length);
});

test('시간봉에서 7일은 168시간이며 기간 이동도 시간 단위로 계산한다', () => {
  const item = snapshot.items[0];
  const start = item.candles[0].time;
  const hourlyCandles = Array.from({ length: 200 }, (_, index) => ({ ...item.candles[0], time: start + index * 3600000 }));
  render({ ...snapshot, items: [{ ...item, hourlyCandles }] });
  click('1시간');
  click('7일');
  expect(container.querySelectorAll('.auction-wick')).toHaveLength(168);
  expect(container.querySelector('svg [role=button]').getAttribute('aria-label')).toContain('11. 17. 08:00');
  click('이전 기간');
  expect(container.querySelector('svg [role=button]').getAttribute('aria-label')).toContain('11. 16. 00:00');
  expect(button('이전 기간').disabled).toBe(true);
  click('다음 기간');
  expect(button('다음 기간').disabled).toBe(true);
});

test('캔들 너비와 간격은 큰 화면·좁은 화면·확대에서 함께 바뀌며 겹치지 않는다', () => {
  let resize;
  const original = global.ResizeObserver;
  global.ResizeObserver = class {
    constructor(callback) { resize = callback; }
    observe() {}
    disconnect() {}
  };
  try {
    render(snapshot);
    for (const width of [960, 180]) {
      act(() => resize([{ contentRect: { width } }]));
      for (const zoom of ['전체 기간으로 초기화', '차트 확대']) {
        click(zoom);
        const bodies = [...container.querySelectorAll('.auction-body')];
        const wicks = [...container.querySelectorAll('.auction-wick')];
        const step = Number(wicks[1].getAttribute('x1')) - Number(wicks[0].getAttribute('x1'));
        const bodyWidth = Number(bodies[0].getAttribute('width'));
        expect(bodyWidth / step).toBeCloseTo(.7);
        expect(bodyWidth + Number(bodies[0].getAttribute('stroke-width'))).toBeLessThan(step);
        expect(Number(wicks[0].getAttribute('stroke-width'))).toBeLessThan(step);
      }
    }
  } finally {
    global.ResizeObserver = original;
  }
});

test('가격은 금·은·동 주화 아이콘으로 보여주고 읽는 글에는 단위를 남긴다', () => {
  render({ ...snapshot, items: [{ ...snapshot.items[0], candles: [{ time: 1794787200000, open: 10203, high: 10203, low: 10203, close: 10203, quantity: 1 }], hourlyCandles: [] }] });
  const heading = container.querySelector('.auction-heading strong');
  expect([...heading.querySelectorAll('.auction-coin')].map(node => node.getAttribute('class'))).toEqual(['auction-coin auction-coin-gold', 'auction-coin auction-coin-silver', 'auction-coin auction-coin-copper']);
  expect(heading.querySelectorAll('svg[aria-hidden=true]')).toHaveLength(3);
  expect(heading.textContent).toBe('1금 2은 3동');
  expect(container.querySelector('.auction-plot').textContent).not.toContain('가격 · 동');
  expect(container.querySelectorAll('.auction-plot foreignObject .auction-coin-gold').length).toBeGreaterThan(0);
  expect(container.querySelector('tbody td .auction-coin-copper')).not.toBeNull();
});
