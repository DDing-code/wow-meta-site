// 한국 공식 API의 시간별 관측을 저장한다. 인증 값은 실행 환경에서만 받는다.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const BASE = 'https://kr.api.blizzard.com/data/wow/ruleset/1/auctions/';
const DAY = 86400000;
const HOUSES = [[110, '얼라이언스'], [111, '얼라이언스'], [113, '호드'], [114, '호드']];

function candles(previous, price, quantity, at, interval) {
  const result = previous.map(row => ({ ...row }));
  let before = 0;
  for (const row of result) {
    assert.ok(Number.isSafeInteger(row.time) && row.time > before && row.time % interval === 0, '기존 봉 날짜 오류');
    assert.ok(['open', 'high', 'low', 'close'].every(key => Number.isSafeInteger(row[key]) && row[key] > 0), '기존 봉 가격 오류');
    assert.ok(row.low <= Math.min(row.open, row.close) && row.high >= Math.max(row.open, row.close), '기존 봉 범위 오류');
    before = row.time;
  }
  const time = Math.floor(at / interval) * interval;
  const last = result[result.length - 1];
  assert.ok(!last || last.time <= time, '이전 시각의 자료로 봉을 덮어쓸 수 없음');
  if (last?.time === time) Object.assign(last, { high: Math.max(last.high, price), low: Math.min(last.low, price), close: price, quantity });
  else result.push({ time, open: price, high: price, low: price, close: price, quantity });
  return result;
}

function marketSnapshot(houseId, faction, auctions, at, previous) {
  assert.ok(Array.isArray(auctions), '경매 매물 배열 누락');
  assert.ok(Number.isSafeInteger(at) && at > 0 && at <= Date.now(), '공식 자료 시각 오류');
  const prices = new Map();
  for (const row of auctions) {
    const id = row.item?.id;
    assert.ok(Number.isSafeInteger(id) && id > 0, '아이템 번호 오류');
    assert.ok(Number.isSafeInteger(row.quantity) && row.quantity > 0, '매물 수량 오류');
    const item = prices.get(id) || { minimum: Infinity, quantity: 0 };
    prices.set(id, item);
    const total = row.unit_price ?? row.buyout;
    if (total === undefined || total === 0) continue;
    assert.ok(Number.isSafeInteger(total) && total > 0, '즉시구매가 오류');
    const price = row.unit_price === undefined ? Math.floor(total / row.quantity) : total;
    assert.ok(price > 0, '개당 즉시구매가 오류');
    item.minimum = Math.min(item.minimum, price);
    item.quantity += row.quantity;
    assert.ok(Number.isSafeInteger(item.quantity), '매물 수량 범위 초과');
  }
  const market = `forever.house-${houseId}.kr`;
  assert.ok(!previous || previous.market === market, '한국 경매장 이력 불일치');
  const history = new Map(previous?.items.map(item => [item.id, item]));
  return {
    market, houseId, marketLabel: `한국 · ${faction} · 경매장 ${houseId}`, rulesetVerified: false,
    referenceUrl: 'https://wowfah.com/about', snapshotAt: at,
    items: [...new Set([...history.keys(), ...prices.keys()])].map(id => {
      const old = history.get(id);
      assert.ok(!old?.observedAt || old.observedAt <= at, '오래된 응답으로 이력을 덮어쓸 수 없음');
      const quote = prices.get(id) || { minimum: Infinity, quantity: 0 };
      const available = Number.isFinite(quote.minimum);
      const fresh = available && (!old?.observedAt || old.observedAt < at);
      return {
        id, name: old?.name || `아이템 ${id}`, nameVerified: old?.nameVerified ?? Boolean(old?.name),
        nameSource: old?.nameSource || `https://www.wowhead.com/forever/ko/item=${id}`,
        sourceUrl: 'https://develop.battle.net/', observedAt: available ? at : old?.observedAt || null,
        available, listedQuantity: quote.quantity,
        candles: fresh ? candles(old?.candles || [], quote.minimum, quote.quantity, at, DAY) : old?.candles || [],
        hourlyCandles: fresh ? candles(old?.hourlyCandles || [], quote.minimum, quote.quantity, at, DAY / 24) : old?.hourlyCandles || [],
      };
    }),
  };
}

async function itemNames(markets, read) {
  const known = new Map(markets.flatMap(m => m.items).filter(item => item.nameVerified).map(item => [item.id, item]));
  const missing = [...new Set(markets.flatMap(m => m.items).map(item => item.id))].filter(id => !known.has(id));
  // shortcut: 포에버 API 미등록 품목은 번호로 표시, 공식 이름이 제공되면 다음 수집에서 갱신한다.
  for (let offset = 0; offset < missing.length; offset += 10) {
    await Promise.all(missing.slice(offset, offset + 10).map(async id => {
      const nameSource = `https://kr.api.blizzard.com/data/wow/item/${id}?namespace=static-forever-kr&locale=ko_KR`;
      const result = await read(`https://kr.api.blizzard.com/data/wow/item/${id}`, 'static-forever-kr', true);
      if (typeof result?.data.name === 'string' && result.data.name.trim()) known.set(id, { name: result.data.name, nameSource });
    }));
  }
  for (const market of markets) for (const item of market.items) {
    const metadata = known.get(item.id);
    if (metadata) Object.assign(item, { name: metadata.name, nameSource: metadata.nameSource, nameVerified: true });
  }
}

async function collect(credentials = process.env) {
  const { BLIZZARD_CLIENT_ID: id, BLIZZARD_CLIENT_SECRET: secret } = credentials;
  assert.ok(id && secret, '블리자드 인증 환경 변수가 필요합니다');
  const auth = await fetch('https://oauth.battle.net/token', {
    method: 'POST', headers: { Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials', signal: AbortSignal.timeout(20000),
  });
  assert.ok(auth.ok, `블리자드 인증 실패: HTTP ${auth.status}`);
  const { access_token: token } = await auth.json();
  assert.ok(typeof token === 'string' && token, '인증 응답 형식 오류');
  async function read(url, namespace = 'dynamic-forever-kr', optional = false) {
    const response = await fetch(`${url}?namespace=${namespace}&locale=ko_KR`, {
      headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(60000),
    });
    if (optional && response.status === 404) return null;
    assert.ok(response.ok, `한국 경매장 요청 실패: HTTP ${response.status}`);
    return { data: await response.json(), at: Date.parse(response.headers.get('last-modified')) };
  }
  const output = process.env.AUCTION_OUTPUT || path.resolve(__dirname, '../src/data/foreverAuctionKr.json');
  const previous = fs.existsSync(output) ? JSON.parse(fs.readFileSync(output, 'utf8')) : { markets: [] };
  assert.ok(Array.isArray(previous.markets) && previous.markets.every(m => HOUSES.some(([id]) => m.market === `forever.house-${id}.kr`)), '기존 자료에 다른 시장이 섞임');
  const index = await read(BASE);
  assert.ok(Array.isArray(index.data.auctions), '경매장 목록 형식 오류');
  const markets = [];
  for (const [houseId, faction] of HOUSES) {
    assert.ok(index.data.auctions.some(house => house.id === houseId && house.name === `${faction} 경매장`), '공식 경매장 진영 불일치');
    const market = previous.markets.find(m => m.houseId === houseId);
    // 장비와 재료는 서로 다른 응답·갱신 시각을 가지므로 해당 품목 이력만 갱신한다.
    const parts = await Promise.all([read(`${BASE}${houseId}`), read(`${BASE}${houseId}/commodities`)]);
    assert.ok(parts.every(part => Array.isArray(part.data.auctions)), '경매 매물 배열 누락');
    const ids = parts.map(part => new Set(part.data.auctions.map(row => row.item?.id)));
    assert.ok(![...ids[0]].some(id => ids[1].has(id)), '장비·재료 응답에 품목 중복');
    const items = parts.flatMap((part, index) => marketSnapshot(houseId, faction, part.data.auctions, part.at, market && {
      ...market, items: market.items.filter(item => ids[index].has(item.id) || (!ids[1 - index].has(item.id) && (item.auctionKind || 'commodities') === (index ? 'commodities' : 'auctions'))),
    }).items.map(item => ({ ...item, auctionKind: index ? 'commodities' : 'auctions' })));
    markets.push({ ...marketSnapshot(houseId, faction, [], Math.max(...parts.map(part => part.at))), items });
  }
  await itemNames(markets, read);
  const snapshot = { catalogVersion: 1, edition: 'forever', region: 'kr', provider: 'blizzard', fetchedAt: new Date().toISOString(), markets };
  // 네 곳이 모두 정상일 때만 교체해 통신 실패 시 기존 자료를 보존한다.
  fs.writeFileSync(`${output}.tmp`, `${JSON.stringify(snapshot)}\n`);
  fs.renameSync(`${output}.tmp`, output);
  console.log(`한국 경매장 ${markets.length}곳 수집 완료`);
  return { houses: markets.length };
}

if (require.main === module) collect().catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { candles, marketSnapshot, itemNames, collect };
