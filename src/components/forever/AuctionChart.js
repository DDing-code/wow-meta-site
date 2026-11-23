import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { CandlestickChart, TrendingUp, Crosshair, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import koreanSnapshot from '../../data/foreverAuctionKr.json';

const DAY = 86400000;
const KOREAN_PRICES = 'https://raw.githubusercontent.com/DDing-code/wow-meta-site/auction-data/forever-auction-kr.json';
const date = time => new Intl.DateTimeFormat('ko-KR', { timeZone: 'UTC', month: 'numeric', day: 'numeric' }).format(time);
const hour = time => `${date(time)} ${new Intl.DateTimeFormat('ko-KR', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', hour12: false }).format(time)}`;
const stamp = time => new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(time));
const COINS = {
  gold: { label: '금', edge: '#7a4c0c', face: '#f0c048', shine: '#fff0b0' },
  silver: { label: '은', edge: '#5f6470', face: '#d2d6de', shine: '#ffffff' },
  copper: { label: '동', edge: '#6a3114', face: '#cd7642', shine: '#f7c39c' },
};
function moneyParts(copper) {
  const gold = Math.floor(copper / 10000);
  const silver = Math.floor(copper % 10000 / 100);
  return [gold && ['gold', gold], silver && ['silver', silver], (copper % 100 || (!gold && !silver)) && ['copper', copper % 100]].filter(Boolean);
}
export function auctionMoney(copper) {
  return moneyParts(copper).map(([unit, amount]) => `${amount.toLocaleString('ko-KR')}${COINS[unit].label}`).join(' ');
}
function Coin({ unit }) {
  const { edge, face, shine } = COINS[unit];
  return <svg className={`auction-coin auction-coin-${unit}`} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <circle cx="8" cy="8" r="7.5" fill={edge} /><circle cx="8" cy="8" r="6" fill={face} />
    <circle cx="8" cy="8" r="3.6" fill="none" stroke={edge} strokeOpacity=".35" /><circle cx="5.6" cy="5.4" r="1.6" fill={shine} opacity=".85" />
  </svg>;
}
// 게임처럼 숫자 뒤에 금·은·동 주화를 붙인다. 화면 읽기 프로그램과 복사한 글에는 '1금 2은 3동'이 남는다.
export function Money({ copper }) {
  return <span className="auction-money">{moneyParts(copper).map(([unit, amount], index) => <React.Fragment key={unit}>
    {index ? ' ' : ''}<span className="auction-coin-part">{amount.toLocaleString('ko-KR')}<Coin unit={unit} /><span className="auction-sr">{COINS[unit].label}</span></span>
  </React.Fragment>)}</span>;
}
// 축 글자 칸 너비 어림(11px 숫자 6.6px, 주화 9px+간격). 금이 붙어도 칸이 넘치지 않게 한다.
const axisLabelWidth = maximum => {
  const gold = Math.floor(maximum / 10000).toLocaleString('ko-KR').length;
  const segments = maximum >= 10000 ? [gold, 2, 2] : maximum >= 100 ? [2, 2] : [2];
  return Math.ceil(14 + segments.reduce((sum, digits) => sum + digits * 6.6 + 14, 0));
};
function AxisMoney({ x, y, width, copper, className = '' }) {
  return <foreignObject x={x} y={y - 9} width={width} height="18" pointerEvents="none">
    <div className={`auction-axis-money ${className}`}><Money copper={copper} /></div>
  </foreignObject>;
}

const Content = styled.div`
  font-variant-numeric: tabular-nums;
  word-break: keep-all;
  min-width: 0;
  .auction-markets { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 12px; font-size: .8rem; color: #bfb4a0; }
  .auction-markets select { max-width: 100%; min-height: 40px; padding: 8px 30px 8px 12px; border: 1px solid #5c513b; background-color: #211b14; color: #f3dfaa; font: inherit; }
  .auction-markets select:focus-visible { outline: 2px solid #8dd9f5; outline-offset: 2px; }
  .auction-market { color: #f6cf5f; margin: 0 0 6px; }
  .auction-note { color: #bfb4a0; font-size: .8rem; line-height: 1.8; }
  .auction-workspace { display: grid; grid-template-columns: minmax(0, 1fr) 250px; background-color: #17191e; border: 1px solid #393b42; margin-top: 16px; }
  .auction-main { min-width: 0; }
  .auction-toolbar, .auction-range { display: flex; align-items: center; gap: 4px; padding: 6px 10px; flex-wrap: wrap; }
  .auction-toolbar { border-bottom: 1px solid #30323a; }
  .auction-toolbar .auction-interval { display: flex; border-right: 1px solid #41434b; padding-right: 6px; margin-right: 2px; }
  .auction-toolbar .auction-note { margin-left: auto; }
  button { display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-height: 36px; border: 0; border-radius: 0; background-color: transparent; color: #c5c8d1; padding: 6px 9px; cursor: pointer; font: inherit; font-size: .8rem; }
  button svg { flex: none; }
  button:hover:not(:disabled) { background-color: #2b3039; color: #fff; }
  button[aria-pressed='true'] { background-color: #263746; color: #a9e6ff; }
  button:disabled { opacity: .35; cursor: default; }
  button:focus-visible, summary:focus-visible { outline: 2px solid #8dd9f5; outline-offset: -2px; }
  .auction-heading { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; padding: 16px 16px 2px; }
  .auction-heading h3 { font-size: 1rem; color: #eee9df; margin: 0; }
  .auction-money { position: relative; display: inline-flex; align-items: center; gap: .4em; white-space: nowrap; vertical-align: middle; }
  .auction-coin-part { display: inline-flex; align-items: center; gap: .14em; }
  .auction-coin { width: .86em; height: .86em; flex: none; filter: drop-shadow(0 1px 0 #0008); }
  .auction-sr { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; border: 0; }
  .auction-axis-money { display: flex; align-items: center; height: 18px; padding-left: 6px; font-size: 11px; line-height: 1; color: #9ca2b1; }
  .auction-axis-money.is-cross { color: #e7eaf2; }
  .auction-axis-money.is-last { color: #101419; font-weight: 700; }
  .auction-heading strong { font-size: 1.25rem; color: #fff4db; }
  .auction-date { padding: 0 16px; margin-top: 4px; font-size: .75rem; color: #a9adba; }
  .auction-values { display: flex; flex-wrap: wrap; gap: 6px 18px; margin: 8px 16px 14px; font-size: .75rem; }
  .auction-values > div { display: flex; gap: 6px; }
  .auction-values dt { color: #9298a8; }
  .auction-values dd { margin: 0; color: #e6e8ee; }
  .auction-canvas { display: grid; grid-template-columns: 42px minmax(0, 1fr); }
  .auction-tools { display: flex; flex-direction: column; border-right: 1px solid #30323a; align-items: center; gap: 4px; padding-top: 4px; }
  .auction-tools button { padding: 8px; }
  .auction-plot { min-width: 0; }
  .auction-plot > svg { display: block; width: 100%; font-family: inherit; }
  .auction-plot text { fill: #9ca2b1; font-size: 11px; }
  .auction-plot [role=button] { cursor: crosshair; outline: none; }
  .auction-plot [role=button]:focus-visible .auction-hit { stroke: #fff4db; stroke-width: 2; }
  .auction-plot .auction-axis-label { fill: #e7eaf2; }
  .auction-range { border-top: 1px solid #30323a; font-size: .75rem; }
  .auction-range .auction-note { margin-left: auto; }
  .auction-watchlist { border-left: 1px solid #393b42; min-width: 0; }
  .auction-watchlist h4 { padding: 15px 14px; margin: 0; border-bottom: 1px solid #30323a; color: #e6e8ee; font-size: .85rem; }
  .auction-watch-head, .auction-items button { display: grid; grid-template-columns: minmax(0, 1fr) 76px 58px; text-align: right; gap: 4px; }
  .auction-watch-head { color: #9ca2b1; padding: 10px 12px; font-size: .65rem; }
  .auction-watch-head span:first-child, .auction-items button > span:first-child { text-align: left; }
  .auction-items button { width: 100%; min-height: 48px; padding: 10px 12px; font-size: .75rem; border-left: 2px solid transparent; }
  .auction-items button[aria-pressed='true'] { border-left-color: #8dd9f5; }
  .auction-up { color: #ef8872; }
  .auction-down { color: #8dd9f5; }
  .auction-quote { padding: 18px 14px; border-top: 1px solid #30323a; margin-top: 14px; }
  .auction-quote strong { display: block; font-size: 1.6rem; margin: 8px 0; color: #eee9df; }
  .auction-quote p { margin: 0 0 6px; }
  .auction-legend { display: flex; gap: 12px; flex-wrap: wrap; margin: 12px 0 6px; font-size: .75rem; }
  .auction-empty { padding: 32px 16px; color: #bfb4a0; }
  details { margin-top: 16px; }
  summary { cursor: pointer; color: #8dd9f5; }
  .auction-table { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: .8rem; white-space: nowrap; }
  th, td { padding: 8px 6px; text-align: right; border-bottom: 1px solid #3a2d1e; }
  th:first-child { text-align: left; }
  caption { text-align: left; padding: 10px 0; color: #bfb4a0; }
  a { color: #8dd9f5; }
  @media (max-width: 900px) {
    .auction-workspace { grid-template-columns: minmax(0, 1fr); }
    .auction-watchlist { border-left: 0; border-top: 1px solid #393b42; }
    .auction-watch-head, .auction-items button { grid-template-columns: minmax(0, 1fr) 90px 80px; }
    .auction-quote { display: none; }
  }
  @media (max-width: 560px) {
    .auction-heading { padding: 12px 10px 2px; }
    .auction-heading strong { font-size: 1.1rem; }
    .auction-date { padding: 0 10px; }
    .auction-values { margin: 8px 10px; gap: 4px 12px; }
    .auction-canvas { grid-template-columns: 34px minmax(0, 1fr); }
    .auction-tools button { padding: 6px; }
    .auction-range { padding: 4px; gap: 0; }
    .auction-range button { min-height: 40px; }
  }
`;

function dailyChange(candles) {
  const last = candles[candles.length - 1];
  const previous = candles[candles.length - 2];
  if (!previous || last.time - previous.time !== DAY || !previous.close) return null;
  return (last.close / previous.close - 1) * 100;
}
const changeText = value => value === null ? '—' : `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;

function Candles({ item }) {
  const host = useRef(null);
  const [width, setWidth] = useState(720);
  const [selectedTime, setSelectedTime] = useState(null);
  const [cursorY, setCursorY] = useState(null);
  const [crosshair, setCrosshair] = useState(true);
  const [mode, setMode] = useState('candles');
  const [resolution, setResolution] = useState('d1');
  const [view, setView] = useState(null);
  useEffect(() => {
    if (!host.current || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(160, entry.contentRect.width)));
    observer.observe(host.current);
    return () => observer.disconnect();
  }, [item.candles.length]);
  const hourly = resolution === 'h1';
  const interval = hourly ? DAY / 24 : DAY;
  const labelDate = hourly ? hour : date;
  const candles = hourly ? item.hourlyCandles : item.candles;
  if (!candles.length) return <p className="auction-empty" role="status">이 아이템의 가격 관측 기록이 없습니다.</p>;
  const last = candles[candles.length - 1];
  const totalBars = (last.time - candles[0].time) / interval + 1;
  const bars = Math.min(totalBars, view?.bars || totalBars);
  const offset = Math.min(totalBars - bars, view?.offset || 0);
  const endTime = last.time - offset * interval;
  const firstTime = endTime - (bars - 1) * interval;
  const visible = candles.filter(candle => candle.time >= firstTime && candle.time <= endTime);
  const selected = visible.find(candle => candle.time === selectedTime) || visible[visible.length - 1];
  const top = 24;
  const bottom = width < 420 ? 254 : 334;
  const allHigh = Math.max(...candles.map(candle => candle.high));
  const axis = Math.min(Math.max(64, axisLabelWidth(allHigh * 1.15 + 1)), Math.floor(width / 2));
  const right = width - axis;
  const step = (right - 8) / bars;
  const high = Math.max(...(visible.length ? visible : [last]).map(candle => candle.high));
  const low = Math.min(...(visible.length ? visible : [last]).map(candle => candle.low));
  const padding = Math.max(1, (high - low) * .12);
  const minimum = Math.max(0, low - padding);
  const maximum = high + padding;
  const x = time => 8 + ((time - firstTime) / interval + .5) * step;
  const y = price => bottom - (price - minimum) / (maximum - minimum) * (bottom - top);
  const crossY = cursorY ?? (selected ? y(selected.close) : top);
  const crossPrice = Math.round(minimum + (bottom - crossY) / (bottom - top) * (maximum - minimum));
  const currentBucket = Math.floor(Date.now() / interval) * interval;
  const values = selected ? [['시가', selected.open], ['고가', selected.high], ['저가', selected.low], ['종가', selected.close]] : [];
  const change = dailyChange(item.candles);
  const dateWidth = Math.min(right - 8, hourly ? 104 : 62);
  const tickCount = Math.min(bars, Math.max(1, Math.floor((right - 8) / (hourly ? 112 : 65))));
  const select = time => { setSelectedTime(time); setCursorY(null); };
  const setWindow = (nextBars, nextOffset = offset) => {
    const count = Math.max(1, Math.min(totalBars, nextBars));
    setView({ bars: count, offset: Math.max(0, Math.min(totalBars - count, nextOffset)) });
    select(null);
  };
  return <>
    <div className="auction-toolbar" role="group" aria-label="차트 표시">
      <div className="auction-interval" role="group" aria-label="봉 시간 단위">
        <button type="button" disabled title="1분봉 자료가 연결되지 않았습니다">1분</button>
        <button type="button" disabled={!item.hourlyCandles?.length} aria-pressed={hourly} onClick={() => { setResolution('h1'); setView(null); select(null); }}>1시간</button>
        <button type="button" aria-pressed={!hourly} onClick={() => { setResolution('d1'); setView(null); select(null); }}>1일</button>
      </div>
      <button type="button" aria-pressed={mode === 'candles'} onClick={() => setMode('candles')}><CandlestickChart size={16} aria-hidden="true" />캔들</button>
      <button type="button" aria-pressed={mode === 'line'} onClick={() => setMode('line')}><TrendingUp size={16} aria-hidden="true" />선</button>
      <span className="auction-note">최저 즉시구매가 · 1분봉 미연결</span>
    </div>
    <div className="auction-heading"><h3>{item.name}</h3><strong><Money copper={last.close} /></strong><span className={change > 0 ? 'auction-up' : 'auction-down'} title="전일 종가 대비">{changeText(change)}</span></div>
    <div aria-live="polite" aria-atomic="true">
      <p className="auction-date">{selected ? `${labelDate(selected.time)} · UTC${selected.time === currentBucket ? ' · 집계 중' : ''} · ${selected.close > selected.open ? '상승' : selected.close < selected.open ? '하락' : '보합'}` : '이 기간에는 관측 기록이 없습니다.'}</p>
      <dl className="auction-values">{values.map(([label, value]) => <div key={label}><dt>{label}</dt><dd><Money copper={value} /></dd></div>)}</dl>
    </div>
    <div className="auction-canvas">
    <div className="auction-tools" role="group" aria-label="차트 도구">
      <button type="button" aria-label="십자선" title="십자선" aria-pressed={crosshair} onClick={() => setCrosshair(!crosshair)}><Crosshair size={18} aria-hidden="true" /></button>
      <button type="button" aria-label="차트 확대" title="봉 간격 넓히기" disabled={bars <= Math.min(2, totalBars)} onClick={() => setWindow(Math.max(2, Math.floor(bars / 1.5)))}><ZoomIn size={18} aria-hidden="true" /></button>
      <button type="button" aria-label="차트 축소" title="봉 간격 좁히기" disabled={bars === totalBars} onClick={() => setWindow(Math.ceil(bars * 1.5))}><ZoomOut size={18} aria-hidden="true" /></button>
      <button type="button" aria-label="전체 기간으로 초기화" title="전체 기간으로 초기화" onClick={() => { setView(null); select(null); }}><RotateCcw size={18} aria-hidden="true" /></button>
    </div>
    <div className="auction-plot" ref={host}>
    <svg viewBox={`0 0 ${width} ${bottom + 36}`} role="group" aria-label={`${item.name} ${hourly ? '1시간' : '하루'} 단위 ${mode === 'candles' ? '캔들' : '선'}차트`} onMouseLeave={() => select(null)}>
      <text x={right + 8} y="14">가격</text>
      {[0, 1, 2, 3, 4].map(tick => {
        const price = minimum + (maximum - minimum) * tick / 4;
        return <g key={tick}><line x1="8" x2={right} y1={y(price)} y2={y(price)} stroke="#2b2e36" /><AxisMoney x={right + 2} y={y(price)} width={axis - 2} copper={Math.round(price)} /></g>;
      })}
      <line x1={right} x2={right} y1={top} y2={bottom} stroke="#383b43" />
      {visible.map((candle, index) => {
        const rising = candle.close >= candle.open;
        const color = rising ? '#ef8872' : '#8dd9f5';
        const center = x(candle.time);
        const bar = step * .7;
        const label = `${labelDate(candle.time)} · UTC · 시가 ${auctionMoney(candle.open)}, 고가 ${auctionMoney(candle.high)}, 저가 ${auctionMoney(candle.low)}, 종가 ${auctionMoney(candle.close)}`;
        return <g key={candle.time} role="button" tabIndex="0" aria-label={label} aria-pressed={selected.time === candle.time}
          onPointerMove={event => {
            setSelectedTime(candle.time);
            const bounds = event.currentTarget.ownerSVGElement.getBoundingClientRect();
            setCursorY(Math.max(top, Math.min(bottom, (event.clientY - bounds.top) * (bottom + 36) / bounds.height)));
          }} onFocus={() => select(candle.time)} onClick={() => select(candle.time)}
          onKeyDown={event => {
            const next = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: visible.length - 1 }[event.key];
            if (next !== undefined) {
              event.preventDefault();
              const target = Math.max(0, Math.min(visible.length - 1, next));
              event.currentTarget.ownerSVGElement.querySelectorAll('[role=button]')[target].focus();
            } else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(candle.time); }
          }}>
          <title>{label}</title>
          <rect className="auction-hit" x={center - step / 2} y={top} width={step} height={bottom - top} fill="transparent" />
          <line className="auction-wick" x1={center} x2={center} y1={mode === 'candles' ? y(candle.high) : y(candle.close)} y2={mode === 'candles' ? y(candle.low) : y(candle.close)} stroke={color} strokeWidth={Math.min(1.5, step * .15)} />
          {mode === 'candles' ? <rect className="auction-body" x={center - bar / 2} y={Math.min(y(candle.open), y(candle.close))} width={bar} height={Math.max(2, Math.abs(y(candle.open) - y(candle.close)))} fill={rising ? '#17191e' : color} stroke={color} strokeWidth={Math.min(1.5, step * .15)} /> : <circle cx={center} cy={y(candle.close)} r="3" fill="#8dd9f5" />}
        </g>;
      })}
      {Array.from({ length: tickCount }, (_, index) => {
        const time = firstTime + Math.floor((index + .5) * bars / tickCount) * interval;
        const center = Math.max(dateWidth / 2 + 8, Math.min(right - dateWidth / 2, x(time)));
        return <g key={time} pointerEvents="none"><line x1={x(time)} x2={x(time)} y1={top} y2={bottom} stroke="#ffffff05" /><text x={center} y={bottom + 23} textAnchor="middle">{labelDate(time)}</text></g>;
      })}
      {mode === 'line' && <path className="auction-line" d={visible.map((candle, index) => `${index && candle.time - visible[index - 1].time === interval ? 'L' : 'M'} ${x(candle.time)} ${y(candle.close)}`).join(' ')} stroke="#8dd9f5" strokeWidth="2" fill="none" pointerEvents="none" />}
      {last.time >= firstTime && last.time <= endTime && <g pointerEvents="none"><line x1="8" x2={right} y1={y(last.close)} y2={y(last.close)} stroke={last.close >= last.open ? '#ef8872' : '#8dd9f5'} strokeDasharray="3 4" opacity=".7" /><rect x={right} y={y(last.close) - 10} width={axis} height="20" fill={last.close >= last.open ? '#ef8872' : '#8dd9f5'} /><AxisMoney x={right} y={y(last.close)} width={axis} copper={last.close} className="is-last" /></g>}
      {crosshair && selected && selectedTime !== null && <g className="auction-crosshair" pointerEvents="none">
        <line x1={x(selected.time)} x2={x(selected.time)} y1={top} y2={bottom} stroke="#9da4b2" strokeDasharray="4 4" />
        <line x1="8" x2={right} y1={crossY} y2={crossY} stroke="#9da4b2" strokeDasharray="4 4" />
        <rect x={right} y={crossY - 10} width={axis} height="20" fill="#4b5362" /><AxisMoney x={right} y={crossY} width={axis} copper={crossPrice} className="is-cross" />
        <rect x={Math.max(8, Math.min(right - dateWidth, x(selected.time) - dateWidth / 2))} y={bottom + 5} width={dateWidth} height="26" fill="#4b5362" /><text className="auction-axis-label" x={Math.max(8 + dateWidth / 2, Math.min(right - dateWidth / 2, x(selected.time)))} y={bottom + 23} textAnchor="middle">{labelDate(selected.time)}</text>
      </g>}
    </svg>
    </div></div>
    <div className="auction-range" role="group" aria-label="차트 기간">
      <button type="button" aria-pressed={bars === 7 * DAY / interval && offset === 0 && totalBars > bars} disabled={totalBars <= 7 * DAY / interval} onClick={() => setWindow(7 * DAY / interval, 0)}>7일</button>
      <button type="button" aria-pressed={bars === totalBars} onClick={() => { setView(null); select(null); }}>전체</button>
      <button type="button" aria-label="이전 기간" disabled={offset + bars >= totalBars} onClick={() => setWindow(bars, offset + Math.max(1, Math.floor(bars / 2)))}><ChevronLeft size={16} aria-hidden="true" /></button>
      <button type="button" aria-label="다음 기간" disabled={!offset} onClick={() => setWindow(bars, offset - Math.max(1, Math.floor(bars / 2)))}><ChevronRight size={16} aria-hidden="true" /></button>
      <span className="auction-note">{labelDate(firstTime)}–{labelDate(endTime)} · UTC</span>
    </div>
  </>;
}

export default function AuctionChart({ data: suppliedData }) {
  const [snapshot, setSnapshot] = useState(koreanSnapshot);
  const [refreshFailed, setRefreshFailed] = useState(false);
  useEffect(() => {
    if (suppliedData) return;
    const controller = new AbortController();
    let timer;
    async function refresh() {
      try {
        const response = await fetch(KOREAN_PRICES, { cache: 'no-cache', signal: controller.signal });
        if (!response.ok) throw new Error('시세 요청 실패');
        const next = await response.json();
        if (next.edition !== 'forever' || next.region !== 'kr' || next.provider !== 'blizzard' || !Number.isFinite(Date.parse(next.fetchedAt)) ||
          !Array.isArray(next.markets) || next.markets.length !== 4 ||
          ![110, 111, 113, 114].every(id => next.markets.some(m => m.houseId === id && m.market === `forever.house-${id}.kr` &&
            typeof m.marketLabel === 'string' && Array.isArray(m.items) && m.items.every(item =>
              Number.isSafeInteger(item.id) && typeof item.name === 'string' && Number.isSafeInteger(item.listedQuantity) && item.listedQuantity >= 0 &&
              typeof item.available === 'boolean' && (item.observedAt === null || (Number.isSafeInteger(item.observedAt) && item.observedAt > 0)) &&
              ['candles', 'hourlyCandles'].every(key => Array.isArray(item[key]) && item[key].every(candle =>
                ['time', 'open', 'high', 'low', 'close'].every(field => Number.isSafeInteger(candle[field]) && candle[field] > 0))))))) throw new Error('한국 시세 형식 오류');
        if (!controller.signal.aborted) { setSnapshot(current => Date.parse(next.fetchedAt) >= Date.parse(current.fetchedAt) ? next : current); setRefreshFailed(false); }
      } catch {
        if (!controller.signal.aborted) setRefreshFailed(true);
      } finally {
        if (!controller.signal.aborted) timer = setTimeout(refresh, 300000);
      }
    }
    refresh();
    return () => { controller.abort(); clearTimeout(timer); };
  }, [suppliedData]);
  const data = suppliedData || snapshot;
  const availableMarkets = data.markets || [data];
  const [selectedMarket, setSelectedMarket] = useState(availableMarkets[0]?.market);
  const market = availableMarkets.find(entry => entry.market === selectedMarket) || availableMarkets[0];
  const [selectedId, setSelectedId] = useState(null);
  const item = market?.items.find(entry => entry.id === selectedId) || market?.items[0];
  const last = item?.candles[item.candles.length - 1];
  return <Content>
    {availableMarkets.length > 1 && <label className="auction-markets">경매장
      <select aria-label="경매장 선택" value={market.market} onChange={event => { setSelectedMarket(event.target.value); setSelectedId(null); }}>
        {availableMarkets.map(entry => <option value={entry.market} key={entry.market}>{entry.marketLabel}{!entry.items.length ? ' · 연결 대기' : ''}</option>)}
      </select>
      <span>{data.provider === 'blizzard' ? '일반·전쟁 구분 미확인 · 경매장 번호별 시세' : '지역·규칙·진영별 별도 시세'}</span>
    </label>}
    <p className="auction-market">{market?.marketLabel}</p>
    <p className="auction-note">{data.provider === 'blizzard' ? '블리자드 한국 경매장의 개당 최저 즉시구매가입니다. 매시간 수집하며, 일반·전쟁은 게임 매물 대조 전이라 경매장 번호로 표시합니다.' : market?.items.length ? '플레이어가 관측한 최저 즉시구매가입니다. 저장된 시험 자료이며 실시간 가격이 아닙니다.' : '한국 시세 수집을 준비 중입니다. 가격이 연결되면 이곳에 표시됩니다.'}</p>
    {!suppliedData && refreshFailed && <p className="auction-note" role="status">새 가격을 불러오지 못해 마지막 저장 자료를 표시합니다. 아래 관측 시각을 확인해 주세요.</p>}
    {data.provider === 'blizzard' && <p className="auction-note">한국 가격 기록은 2026년 11월 23일부터 쌓입니다. 이전 시세와 관측이 없는 시간은 채우지 않습니다.</p>}
    <div className="auction-workspace">
      <div className="auction-main">{item ? <Candles key={`${market.market}:${item.id}`} item={item} /> : <div className="auction-empty" role="status"><p>저장된 가격 자료가 없습니다.</p>{market?.referenceUrl && <p><a href={market.referenceUrl} target="_blank" rel="noopener noreferrer">{market.marketLabel} 외부 시세 확인 ↗</a></p>}</div>}</div>
      <aside className="auction-watchlist" aria-label="관심 재료">
        <h4>관심 재료</h4>
        <div className="auction-watch-head"><span>아이템</span><span>종가</span><span>전일 대비</span></div>
        <div className="auction-items" role="group" aria-label="시세 아이템 선택">{market?.items.map(entry => {
          const close = entry.candles[entry.candles.length - 1]?.close;
          const change = dailyChange(entry.candles);
          return <button type="button" key={entry.id} aria-pressed={item.id === entry.id} onClick={() => setSelectedId(entry.id)}><span>{entry.name}</span><span>{close === undefined ? '—' : <Money copper={close} />}</span><span className={change > 0 ? 'auction-up' : 'auction-down'}>{changeText(change)}</span></button>;
        })}</div>
        {item && <div className="auction-quote"><p>{item.name}</p><strong>{last ? <Money copper={last.close} /> : '—'}</strong><p className="auction-note">마지막 기록의 종가 · 개당</p>{item.listedQuantity !== undefined && <p className="auction-note">현재 즉시구매 매물 {item.listedQuantity.toLocaleString('ko-KR')}개{item.available === false ? ' · 마지막 관측 가격 표시' : ''}</p>}<p className="auction-note">{market.marketLabel}</p></div>}
      </aside>
    </div>
    {item && <div className="auction-legend"><span className="auction-up">▲ 상승 · 속이 빈 봉</span><span className="auction-down">▼ 하락 · 채운 봉</span><span className="auction-note">봉을 누르거나 올려 가격 확인 · 키보드 ← → 이동</span></div>}
    {item && <>
    <p className="auction-note">마지막 관측: {item.observedAt ? `${stamp(item.observedAt)} (한국 시간)` : '확인되지 않음'}</p>
    {(!item.observedAt || Date.now() - item.observedAt > DAY) && <p className="auction-note" role="status">하루 이내의 관측이 없습니다. 현재 경매장 가격과 다를 수 있습니다.</p>}
    <details><summary>가격표와 읽는 법</summary>
      <p className="auction-note">한 봉은 선택한 1일 또는 1시간 동안 관측한 최저 즉시구매가의 첫 값·최고·최저·마지막 값입니다. 거래 체결가나 거래량을 뜻하지 않습니다. 관측이 없는 구간은 빈칸으로 남깁니다. 1분봉은 연결되지 않았습니다.</p>
      <p className="auction-note">날짜는 세계 표준시(UTC), 하루는 한국 시간 오전 9시부터입니다. 전일 대비는 전날 종가와 비교하며, 전날 기록이 없으면 표시하지 않습니다.</p>
      <div className="auction-table" tabIndex="0" role="region" aria-label="날짜별 가격표"><table><caption>{item.name} · 일봉 개당 가격 (100동 = 1은, 100은 = 1금)</caption>
        <thead><tr>{['날짜 (UTC)', '시가', '고가', '저가', '종가'].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead>
        <tbody>{item.candles.map(candle => <tr key={candle.time}><th scope="row">{date(candle.time)}</th>{['open', 'high', 'low', 'close'].map(key => <td key={key}><Money copper={candle[key]} /></td>)}</tr>)}</tbody>
      </table></div>
    </details>
    <p className="auction-note"><a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">가격 원자료 ↗</a> · <a href={item.nameSource} target="_blank" rel="noopener noreferrer">아이템 정보 ↗</a></p>
    </>}
    {market?.source && <p className="auction-note">자료: <a href={market.source} target="_blank" rel="noopener noreferrer">auctionhouse.fyi ↗</a> · 가져온 시각: {stamp(market.fetchedAt)} (한국 시간)</p>}
    {data.provider === 'blizzard' && <p className="auction-note">자료: <a href="https://develop.battle.net/" target="_blank" rel="noopener noreferrer">블리자드 API ↗</a> · 가져온 시각: {stamp(data.fetchedAt)} (한국 시간)</p>}
  </Content>;
}
