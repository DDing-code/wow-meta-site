const { test } = require('node:test');
const assert = require('node:assert/strict');
const { marketSnapshot, itemNames, collect } = require('./update-forever-auction-kr.cjs');
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
  assert.equal(first.items.length, 1);
});

test('관심 재료 밖의 모든 즉구 품목을 보존하고 장비 묶음 가격은 개당으로 바꾼다', () => {
  const first = snapshot([quote(500), { item: { id: 99999 }, buyout: 1200, quantity: 3 }, { item: { id: 77777 }, quantity: 1, bid: 500 }]);
  const equipment = first.items.find(item => item.id === 99999);
  assert.equal(equipment.candles[0].close, 400);
  assert.equal(equipment.listedQuantity, 3);
  assert.equal(equipment.name, '아이템 99999');
  assert.equal(first.items.length, 3);
  assert.equal(first.items.find(item => item.id === 77777).candles.length, 0);
  const next = snapshot([quote(600)], start + 3600000, first);
  assert.equal(next.items.find(item => item.id === 99999).available, false);
  assert.deepEqual(next.items.find(item => item.id === 99999).candles, equipment.candles);
  assert.throws(() => snapshot([{ item: { id: -1 }, unit_price: 10, quantity: 1 }]));
});

test('한국어 이름은 포에버 API에서 한 번씩 읽고 미등록 품목은 번호를 유지한다', async () => {
  const markets = [snapshot([{ item: { id: 99999 }, buyout: 1000, quantity: 1 }, quote(500)]), snapshot([quote(600)])];
  const calls = [];
  const read = async (url, namespace) => { calls.push([url, namespace]); return url.endsWith('/14047') ? { data: { name: '룬무늬 옷감' } } : null; };
  await itemNames(markets, read);
  assert.equal(calls.length, 2);
  assert.ok(calls.every(([, namespace]) => namespace === 'static-forever-kr'));
  assert.equal(markets[0].items[0].name, '아이템 99999');
  assert.equal(markets[0].items[0].nameVerified, false);
  assert.equal(markets[1].items[0].name, '룬무늬 옷감');
  calls.length = 0;
  await itemNames(markets, read);
  assert.equal(calls.length, 1);
});

test('실제 수집 흐름은 네 시장의 장비·재료를 각각 읽고 실패 시 파일을 보존한다', async () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const os = require('node:os');
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'forever-auction-'));
  const output = path.join(folder, 'prices.json');
  const originalFetch = global.fetch;
  const originalOutput = process.env.AUCTION_OUTPUT;
  process.env.AUCTION_OUTPUT = output;
  let fail = false;
  const requests = [];
  global.fetch = async url => {
    requests.push(url);
    const headers = { get: () => new Date(start).toUTCString() };
    if (url.includes('/token')) return { ok: true, json: async () => ({ access_token: 'test-only' }) };
    if (url.includes('/item/')) return { ok: true, headers, json: async () => ({ name: url.includes('/14047?') ? '룬무늬 옷감' : '시험 장비' }) };
    if (url.includes('/auctions/?')) return { ok: true, headers, json: async () => ({ auctions: [110, 111, 113, 114].map(id => ({ id, name: `${id < 113 ? '얼라이언스' : '호드'} 경매장` })) }) };
    if (fail) return { ok: false, status: 503 };
    return { ok: true, headers, json: async () => ({ auctions: url.includes('/commodities?') ? [quote(500)] : [{ item: { id: 99999 }, buyout: 1000, quantity: 1 }] }) };
  };
  try {
    await collect({ BLIZZARD_CLIENT_ID: 'test', BLIZZARD_CLIENT_SECRET: 'test' });
    const saved = fs.readFileSync(output, 'utf8');
    const data = JSON.parse(saved);
    assert.equal(data.markets.length, 4);
    assert.ok(data.markets.every(m => m.items.length === 2 && m.items.find(i => i.id === 99999).name === '시험 장비'));
    assert.equal(requests.filter(url => url.includes('/item/')).length, 2);
    fail = true;
    await assert.rejects(collect({ BLIZZARD_CLIENT_ID: 'test', BLIZZARD_CLIENT_SECRET: 'test' }));
    assert.equal(fs.readFileSync(output, 'utf8'), saved);
  } finally {
    global.fetch = originalFetch;
    if (originalOutput === undefined) delete process.env.AUCTION_OUTPUT;
    else process.env.AUCTION_OUTPUT = originalOutput;
    fs.rmSync(folder, { recursive: true });
  }
});
test('잘못된 가격·수량·시장·이전 응답은 거절한다', () => {
  assert.throws(() => snapshot([quote(-1)]));
  assert.throws(() => snapshot([quote(5, 0)]));
  assert.throws(() => snapshot({}, start));
  const first = snapshot([quote(500)]);
  assert.throws(() => snapshot([quote(5)], start - 1000, first));
  assert.throws(() => snapshot([quote(5)], start, { ...first, market: 'forever.normal.horde.us' }));
});
