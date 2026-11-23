const { test } = require('node:test');
const assert = require('node:assert/strict');
const { parseItem } = require('./update-forever-auction.cjs');
const day = 86400000;
const base = { market: 'forever.normal.horde.us', item: 14047, live: false, now: 20781 * day };
const history = { ...base, res: 'd1', candles: [[20780 * day, 100, 200, 50, 150, 20]] };
const quote = { ...base, row: [150, 20, 20780 * day + 30000] };
const parse = (h = history, q = quote) => parseItem(h, q, 14047, '룬무늬 옷감');

test('원본 동 단위와 관측 시각을 보존하며 날짜 두 형식이 일치한다', () => {
  const item = parse();
  assert.deepEqual(item.candles[0], { time: 20780 * day, open: 100, high: 200, low: 50, close: 150, quantity: 20 });
  assert.equal(item.observedAt, quote.row[2]);
  assert.deepEqual(parse({ ...history, candles: [[20780, 100, 200, 50, 150, 20]] }).candles, item.candles);
});
test('없는 관측과 빈 일봉을 0원으로 채우지 않는다', () => {
  assert.deepEqual(parse({ ...history, candles: [] }, { ...quote, row: null }).candles, []);
  assert.equal(parse(history, { ...quote, row: null }).observedAt, null);
  assert.equal(parse(history, { ...quote, row: [null, null, quote.row[2]] }).observedAt, quote.row[2]);
});
test('다른 시장·시간 단위·아이템과 깨진 가격은 저장 전에 거부한다', () => {
  for (const change of [{ market: 'forever.pvp.horde.us' }, { item: 2589 }, { res: 'h1' }, { live: true }]) assert.throws(() => parse({ ...history, ...change }));
  for (const row of [[20780, 100, 90, 50, 150, 20], [20780, 0, 200, 0, 100, 20], [20780, null, 200, 50, 150, 20], [20780, 100, 200, 50, 150, -1], [1795392000, 100, 200, 50, 150, 20]]) assert.throws(() => parse({ ...history, candles: [row] }));
  assert.throws(() => parse({ ...history, candles: [...history.candles, ...history.candles] }));
  assert.throws(() => parse(history, { ...quote, row: [150, 20, base.now + 1] }));
});

test('시간봉은 정각 Unix ms만 받고 일봉·분봉과 혼동하지 않는다', () => {
  const time = 20780 * day + 3600000;
  const hourly = { ...history, res: 'h1', candles: [[time, 100, 200, 50, 150, 20]] };
  assert.equal(parseItem(hourly, quote, 14047, '룬무늬 옷감', 'h1').candles[0].time, time);
  for (const at of [20780, time / 1000, time + 60000]) {
    assert.throws(() => parseItem({ ...hourly, candles: [[at, 100, 200, 50, 150, 20]] }, quote, 14047, '룬무늬 옷감', 'h1'));
  }
  assert.throws(() => parseItem(hourly, quote, 14047, '룬무늬 옷감', 'm1'));
});
