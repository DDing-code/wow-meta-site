import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import atlas from '../../data/foreverVisuals.json';
import '../../styles/ForeverVisuals.css';

const places = new Map([...atlas.regions, ...atlas.places].map(place => [place.id, place]));
// 카메라가 새 구간으로 옮겨 간 뒤 표식이 출발한다. 한 구간(지역 → 지역)마다 같은 시간이 걸린다.
export const JOURNEY_TIMING = { camera: 600, leg: 1100 };
const at = place => ({ left: `${place.x / 903 * 100}%`, top: `${place.y / 640 * 100}%` });

export default function LevelingJourney({ race, early, later }) {
  const [phase, setPhase] = useState('early');
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState({});
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false);
  const [motionRequest, setMotionRequest] = useState(0);
  const [visible, setVisible] = useState(false);
  const frame = useRef(null);
  const traveler = useRef(null);
  const viewport = useRef(null);
  const [mapWidth, setMapWidth] = useState(860);
  const maskId = useId().replace(/:/g, '');
  const plan = atlas.journeys[race];
  const isLater = phase === 'later';
  const rows = isLater ? later : early;
  const stages = isLater ? atlas.laterJourneys[plan.faction] : plan.stages;
  const stage = stages[step];
  const row = rows[step];
  const pick = index => choices[index] || stages[index].points[0];
  const previous = isLater
    ? (step ? pick(step - 1) : plan.stages.at(-1).points.at(-1))
    : (step ? stages[step - 1].points.at(-1) : null);
  // 이 구간의 출발지와 경유지를 차례대로 모두 잇는다(같은 지역이 이어지면 하나로).
  const path = [previous, ...(isLater ? [pick(step)] : stage.points)]
    .filter((id, i, all) => id && id !== all[i - 1]).map(id => places.get(id));
  const legs = path.slice(1).map((place, index) => ({ from: path[index], to: place }));
  const routeKey = `${phase}-${step}-${path.map(place => place.id).join('>')}-${motionRequest}`;
  const xs = path.map(place => place.x), ys = path.map(place => place.y);
  // 지도 범위를 잇는 선이며 실제 도로나 승강장 좌표가 아니다.
  const w = Math.min(903, Math.max(190, Math.max(...xs) - Math.min(...xs) + 100, (Math.max(...ys) - Math.min(...ys) + 90) * 1.5));
  const h = w * 640 / 903;
  const x = Math.max(0, Math.min(903 - w, (Math.max(...xs) + Math.min(...xs) - w) / 2));
  const y = Math.max(0, Math.min(640 - h, (Math.max(...ys) + Math.min(...ys) - h) / 2));
  const transports = legs.map(({ from, to }) => atlas.journeyTransports[`${from.id}>${to.id}`] || '지역 이동').filter((item, i, all) => item !== all[i - 1]);
  const transport = isLater ? '후보 비교 · 추정' : legs.length ? transports.join(' → ') : '출발·퀘스트 진행';
  const name = id => places.get(id).name;
  // 선 굵기는 화면 픽셀 기준이다(좁은 화면에서도 같은 굵기로 보이게).
  const px = size => size * w / mapWidth;
  const delay = leg => JOURNEY_TIMING.camera + leg * JOURNEY_TIMING.leg;

  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!query) return;
    const update = () => { setReduced(query.matches); setMotionRequest(0); };
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (!window.IntersectionObserver) { setVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(frame.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const node = viewport.current;
    if (!node || !window.ResizeObserver) return;
    const observer = new ResizeObserver(([entry]) => { if (entry.contentRect.width) setMapWidth(entry.contentRect.width); });
    observer.observe(node);
    return () => observer.disconnect();
  }, [failed]);
  // 지도가 처음 보일 때 그 구간의 이동을 한 번만 보여 준다(화면 밖에 있으면 기다린다).
  const [motionKey, setMotionKey] = useState(null);
  // 동작 줄이기에서는 자동 효과를 끄되, 직접 고른 경로의 이동은 보여 준다.
  const canMove = !reduced || motionRequest > 0;
  const moving = canMove && motionKey === routeKey;
  useLayoutEffect(() => {
    if (canMove && visible && motionKey !== routeKey) setMotionKey(routeKey);
  }, [routeKey, visible, canMove, motionKey]);
  // 표식이 출발지에서 경유지를 하나씩 거쳐 도착지까지 간다.
  useLayoutEffect(() => {
    const token = traveler.current;
    if (!moving || !token?.animate) return;
    const scale = `translate(-50%,-50%) scale(${w / 903})`;
    const options = { delay: JOURNEY_TIMING.camera, fill: 'backwards' };
    const animation = legs.length
      ? token.animate(path.map((place, index) => ({ ...at(place), offset: index / legs.length, easing: 'cubic-bezier(.45,0,.2,1)' })), { ...options, duration: legs.length * JOURNEY_TIMING.leg })
      : token.animate([{ transform: `${scale} translateY(-30px)`, opacity: 0 }, { transform: scale, opacity: 1 }], { ...options, duration: 520, easing: 'cubic-bezier(.3,1.5,.5,1)' });
    return () => animation.cancel();
  }, [moving, routeKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const chooseStep = index => { setStep(index); setMotionRequest(request => request + 1); };
  const choosePhase = next => { setPhase(next); chooseStep(0); };

  return <div className="fv-journey" ref={frame} data-phase={phase} data-step={step} data-moving={moving}>
    <div className="fv-journey-phases" aria-label="레벨 구간">
      <button type="button" aria-pressed={!isLater} onClick={() => choosePhase('early')}>1~30 · 종족별 출발</button>
      <button type="button" aria-pressed={isLater} onClick={() => choosePhase('later')}>30~60 · 추천 후보 · 추정</button>
    </div>
    <ol className="fv-journey-steps" style={{ '--stages': stages.length }} aria-label="레벨별 이동 순서">{stages.map((item, index) => <li key={index} data-complete={index < step}>
      <button type="button" data-stage={index} aria-label={`${rows[index][0]} · ${item.points.map(name).join(' → ')}`} title={`${rows[index][0]} · ${item.points.map(name).join(' → ')}`} aria-current={index === step ? 'step' : undefined} onClick={() => chooseStep(index)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{rows[index][0]}</strong><small>{name(isLater ? pick(index) : item.points.at(-1))}</small></button>
    </li>)}</ol>
    <div className="fv-journey-heading" aria-live="polite">
      <h3>{row[0]} · {row[1]}</h3>
      <span>{isLater ? '추천 후보 · 이동 연결은 추정' : '외부 퀘스트 가이드 견본'}</span>
    </div>
    <div className="fv-journey-leg">
      <strong>{transport}</strong>
      {isLater && <div className="fv-journey-options" aria-label="이 구간의 지역 후보">{stage.points.map(id => <button type="button" key={id} aria-pressed={path.at(-1).id === id} onClick={() => { setChoices({ ...choices, [step]: id }); chooseStep(step); }}>{name(id)}</button>)}</div>}
    </div>
    <div className="fv-journey-map">
      {!failed ? <div className="fv-journey-viewport" ref={viewport}>
        <div className="fv-journey-camera" data-viewbox={`${x} ${y} ${w} ${h}`} style={{ transform: `translate(${-x / w * 100}%, ${-y / h * 100}%) scale(${903 / w})`, '--pin-scale': w / 903 }}>
          <svg viewBox="0 0 903 640" role="img" aria-label={`${row[0]} 지역 이동: ${path.map(place => place.name).join(' → ')}`}>
            <defs><marker id={`${maskId}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#fff0a6" /></marker></defs>
            <image href="/images/forever/world-atlas-1536.webp" width="903" height="640" onError={() => setFailed(true)} />
            {legs.map(({ from, to }, index) => {
              const distance = Math.hypot(to.x - from.x, to.y - from.y);
              const inset = Math.min(px(24), distance / 3);
              const dx = distance ? (to.x - from.x) / distance * inset : 0, dy = distance ? (to.y - from.y) / distance * inset : 0;
              const line = { x1: from.x + dx, y1: from.y + dy, x2: to.x - dx, y2: to.y - dy };
              return <g key={`${routeKey}-${index}`} className="fv-journey-leg-line">
                <defs><mask id={`${maskId}-${index}`} maskUnits="userSpaceOnUse" x="0" y="0" width="903" height="640"><line {...line} pathLength="1" className="fv-journey-reveal" style={{ animationDelay: `${delay(index)}ms`, animationDuration: `${JOURNEY_TIMING.leg}ms` }} stroke="white" strokeWidth={px(24)} /></mask></defs>
                <g mask={`url(#${maskId}-${index})`}><line {...line} stroke="#101216" strokeWidth={px(7)} strokeLinecap="round" /><line {...line} stroke="#fff0a6" strokeWidth={px(3)} strokeDasharray={isLater ? `${px(9)} ${px(6)}` : undefined} markerEnd={`url(#${maskId}-arrow)`} /></g>
              </g>;
            })}
          </svg>
          {path.map((place, index) => {
            const last = index === path.length - 1;
            const side = (place.x - x) / w < 0.23 ? 'is-left' : (place.x - x) / w > 0.77 ? 'is-right' : '';
            return <span key={`${routeKey}-${index}`} className={`fv-journey-pin ${index === 0 && legs.length ? 'is-origin' : ''} ${last ? 'is-destination' : ''} ${side} ${(place.y - y) / h > 0.7 ? 'is-bottom' : ''}`} style={{ ...at(place), '--arrival-delay': `${index ? delay(index) : 0}ms` }}><b /><span>{place.name}</span></span>;
          })}
          <span ref={traveler} key={routeKey} className="fv-journey-traveler" data-legs={legs.length} aria-hidden="true" style={{ ...at(path.at(-1)), '--arrive': `${delay(legs.length)}ms` }}>{String(step + 1).padStart(2, '0')}</span>
        </div>
        <span className="fv-north" aria-hidden="true">↑ 북</span>
      </div> : <p className="fv-map-error" role="status">지도를 불러오지 못했습니다. 위 이동 순서와 아래 안내로 확인하세요.</p>}
    </div>
    <div className="fv-journey-instructions" key={routeKey}>
      <div><h4>{step === 0 && !isLater ? '이곳에서 시작' : '이 구간에서 할 일'}</h4><p>{row[2]}</p></div>
      <div><h4>다음 지역으로 가는 방법</h4><p>{stage.travel}</p></div>
    </div>
    <p className="fv-caption">{isLater ? '점선은 고른 지역 후보를 잇는 추정 연결입니다. ' : '화살표는 지역·경유지의 방문 순서입니다. '}표식은 지역 범위이며 실제 도로·항로·승강장 위치가 아닙니다.</p>
    {step === stages.length - 1 && !isLater && <button className="fv-journey-continue" type="button" onClick={() => choosePhase('later')}>30~60레벨 추천 후보로 이어 보기 →</button>}
  </div>;
}
