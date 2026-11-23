// 공개 일봉 시험판 갱신: node scripts/update-forever-auction.cjs (키·로그인 불필요).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const MARKET = 'forever.normal.horde.us';
const BASE = 'https://auctionhouse.fyi/api/v1/ah';
const DAY = 86400000;
// 한국어 포에버 아이템 화면에서 확인(2026-11-23). 가격 자료는 리테일 KB에 넣지 않는다.
const ITEMS = [[14047, '룬무늬 옷감'], [2770, '구리 광석'], [2589, '리넨 옷감']];

function parseItem(history, quote, id, name, resolution = 'd1') {
  assert.ok(['d1', 'h1'].includes(resolution), '지원하지 않는 시간 단위');
  const interval = resolution === 'h1' ? DAY / 24 : DAY;
  for (const data of [history, quote]) {
    assert.equal(data.market, MARKET, '시장 불일치');
    assert.equal(data.item, id, '아이템 불일치');
    assert.equal(data.live, false, '공개 시세 형식 변경');
    assert.ok(Number.isSafeInteger(data.now) && data.now > 0, '서버 시각 누락');
  }
  assert.equal(history.res, resolution, '요청한 시간 단위와 불일치');
  assert.ok(Array.isArray(history.candles), '캔들 배열 누락');
  let previous = 0;
  const candles = history.candles.map(row => {
    assert.ok(Array.isArray(row) && row.length === 6, '캔들 열 불일치');
    const [bucket, open, high, low, close, quantity] = row;
    assert.ok(row.every(Number.isSafeInteger), '가격·수량·날짜는 정수여야 함');
    // 문서는 epoch 일수, 실제 응답은 Unix ms(2026-11-23). 두 표현만 명시적으로 받는다.
    const time = resolution === 'd1' && bucket < 1000000 ? bucket * DAY : bucket;
    assert.ok(time > previous && time % interval === 0 && time <= history.now, '날짜 순서·단위 오류');
    assert.ok(low > 0 && low <= Math.min(open, close) && high >= Math.max(open, close) && quantity >= 0, '가격 범위·수량 오류');
    previous = time;
    return { time, open, high, low, close, quantity };
  });
  let observedAt = null;
  if (quote.row !== null) {
    assert.ok(Array.isArray(quote.row) && quote.row.length === 3, '최근 관측 형식 오류');
    const [price, quantity, at] = quote.row;
    assert.ok(price === null || (Number.isSafeInteger(price) && price > 0), '최근 가격 오류');
    assert.ok(quantity === null || (Number.isSafeInteger(quantity) && quantity >= 0), '최근 수량 오류');
    assert.ok(Number.isSafeInteger(at) && at > 0 && at <= quote.now, '관측 시각 오류');
    observedAt = at;
  }
  return { id, name, nameSource: `https://www.wowhead.com/forever/ko/item=${id}`, sourceUrl: `${BASE}/${MARKET}/${id}/candles?res=${resolution}`, observedAt, candles };
}

async function read(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`가격 자료 요청 실패: HTTP ${response.status}${response.status === 429 ? ` (재시도 대기 ${response.headers.get('retry-after') || '미지정'}초)` : ''}`);
  return response.json();
}

async function main() {
  const items = [];
  for (const [id, name] of ITEMS) {
    const url = `${BASE}/${MARKET}/${id}`;
    const history = await read(`${url}/candles?res=d1`);
    const hourly = await read(`${url}/candles?res=h1`);
    const quote = await read(url);
    items.push({ ...parseItem(history, quote, id, name), hourlyCandles: parseItem(hourly, quote, id, name, 'h1').candles });
  }
  const snapshot = { edition: 'forever', market: MARKET, marketLabel: '미국 · 일반 · 호드', source: 'https://auctionhouse.fyi/docs/api', fetchedAt: new Date().toISOString(), items };
  const output = path.resolve(__dirname, '../src/data/foreverAuction.json');
  // 전부 받은 뒤 교체해 통신·검증 실패 시 기존 자료를 보존한다.
  fs.writeFileSync(`${output}.tmp`, `${JSON.stringify(snapshot, null, 2)}\n`);
  fs.renameSync(`${output}.tmp`, output);
  console.log(`포에버 시세 저장: ${items.length}종, 일봉 ${items.reduce((sum, item) => sum + item.candles.length, 0)}개, 시간봉 ${items.reduce((sum, item) => sum + item.hourlyCandles.length, 0)}개`);
}

if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { parseItem };
