const { test } = require('node:test');
const assert = require('node:assert/strict');
const { marketSnapshot } = require('./update-forever-auction-kr.cjs');
const start = Date.UTC(2026, 10, 22, 3);
const quote = (price, quantity = 2) => ({ item: { id: 14047 }, unit_price: price, quantity });
const snapshot = (rows, at = start, old) => marketSnapshot(110, '얼라이언스', rows, at, old);

test('개당 최저가와 현재 수량을 쓰며 같은 공식 관측을 중복 집계하지 않는다', () => {
  const first = snapshot([quote(701, 20), quote(500, 3), { item: { id: 14047 }, quantity: 1 }]);
  assert.equal(first.items[0].candles[0].close, 500);
  assert.equal(first.items[0].listedQuantity, 23);
  assert.deepEqual(snapshot([quote(999)], start, first).items[0].candles, first.items[0].candles);
  assert.equal(first.rulesetVerified, false);
  assert.equal(first.market, 'forever.house-110.kr');
});
test('시간·일봉 OHLC를 합치고 누락된 시간에 봉을 만들지 않는다', () => {
  const first = snapshot([quote(500)]);
  const second = snapshot([quote(700)], start + 1800000, first);
  assert.deepEqual(second.items[0].hourlyCandles[0], { time: start, open: 500, high: 700, low: 500, close: 700, quantity: 2 });
  const third = snapshot([quote(400)], start + 10800000, second);
  assert.equal(third.items[0].hourlyCandles.length, 2);
  assert.equal(third.items[0].hourlyCandles[1].time - start, 10800000);
  assert.equal(third.items[0].candles.length, 1);
  assert.equal(third.items[0].candles[0].low, 400);
});
test('매물이 없으면 옛 가격과 관측 시각을 보존하고 현재 매물 없음으로 표시한다', () => {
  const first = snapshot([quote(500)]);
  const empty = snapshot([], start + 3600000, first).items[0];
  assert.equal(empty.available, false);
  assert.equal(empty.listedQuantity, 0);
  assert.equal(empty.observedAt, start);
  assert.deepEqual(empty.candles, first.items[0].candles);
  assert.equal(first.items[1].candles.length, 0);
});
test('잘못된 가격·수량·시장·이전 응답은 거절한다', () => {
  assert.throws(() => snapshot([quote(-1)]));
  assert.throws(() => snapshot([quote(5, 0)]));
  assert.throws(() => snapshot({}, start));
  const first = snapshot([quote(500)]);
  assert.throws(() => snapshot([quote(5)], start - 1000, first));
  assert.throws(() => snapshot([quote(5)], start, { ...first, market: 'forever.normal.horde.us' }));
});
