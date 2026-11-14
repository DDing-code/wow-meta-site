import React, { useEffect, useId, useRef, useState } from 'react';
import atlas from '../../data/foreverVisuals.json';
import '../../styles/ForeverVisuals.css';

const places = new Map([...atlas.regions, ...atlas.places].map(place => [place.id, place]));

export default function LevelingJourney({ race, early, later }) {
  const [phase, setPhase] = useState('early');
  const [step, setStep] = useState(0);
  const [leg, setLeg] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [choices, setChoices] = useState({});
  const [wholeMap, setWholeMap] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(false);
  const frame = useRef(null);
  const arrowId = useId().replace(/:/g, '');
  const plan = atlas.journeys[race];
  const isLater = phase === 'later';
  const rows = isLater ? later : early;
  const stages = isLater ? atlas.laterJourneys[plan.faction] : plan.stages;
  const stage = stages[step];
  const row = rows[step];
  const route = stages.flatMap((item, index) => {
    const previous = isLater
      ? (index ? choices[index - 1] || stages[index - 1].points[0] : plan.stages.at(-1).points.at(-1))
      : (index ? stages[index - 1].points.at(-1) : null);
    const targets = isLater ? [choices[index] || item.points[0]] : item.points;
    const stops = [previous, ...targets].filter((id, i, all) => id && id !== all[i - 1]).map(id => places.get(id));
    return Array.from({ length: Math.max(1, stops.length - 1) }, (_, leg) => ({ step: index, leg, path: stops.slice(leg, leg + 2) }));
  });
  const current = route.findIndex(item => item.step === step && item.leg === leg);
  const { path } = route[current];
  const routeKey = `${phase}-${step}-${leg}-${path.at(-1).id}`;
  const xs = path.map(place => place.x), ys = path.map(place => place.y);
  // 지도 범위를 잇는 선이며 실제 도로나 승강장 좌표가 아니다.
  const width = Math.min(903, Math.max(190, Math.max(...xs) - Math.min(...xs) + 100, (Math.max(...ys) - Math.min(...ys) + 90) * 1.5));
  const height = width * 640 / 903;
  const zoom = [Math.max(0, Math.min(903 - width, (Math.max(...xs) + Math.min(...xs) - width) / 2)), Math.max(0, Math.min(640 - height, (Math.max(...ys) + Math.min(...ys) - height) / 2)), width, height];
  const [x, y, w, h] = wholeMap ? [0, 0, 903, 640] : zoom;
  const transport = isLater ? '후보 비교 · 추정' : path.length === 1 ? '출발·퀘스트 진행' : atlas.journeyTransports[path.map(place => place.id).join('>')] || '지역 이동';
  const finished = current === route.length - 1;

  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!query) return;
    const update = () => { setReduced(query.matches); if (query.matches) setPlaying(false); };
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (!window.IntersectionObserver) { setVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(frame.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!playing || !visible) return;
    const timer = setInterval(() => {
      if (document.hidden) return;
      const next = route[current + 1];
      if (next) { setStep(next.step); setLeg(next.leg); }
      else setPlaying(false);
    }, 6000);
    return () => clearInterval(timer);
  }, [playing, visible, current, route]);

  const chooseStep = next => { setStep(next.step); setLeg(next.leg); setPlaying(false); };
  const choosePhase = next => { setPhase(next); setStep(0); setLeg(0); setPlaying(false); };
  const play = () => { if (!playing && finished) { setStep(0); setLeg(0); } setPlaying(!playing); };
  const name = id => places.get(id).name;

  return <div className="fv-journey" ref={frame} data-phase={phase} data-step={step}>
    <div className="fv-journey-phases" aria-label="레벨 구간">
      <button type="button" aria-pressed={!isLater} onClick={() => choosePhase('early')}>1~30 · 종족별 출발</button>
      <button type="button" aria-pressed={isLater} onClick={() => choosePhase('later')}>30~60 · 추천 후보 · 추정</button>
    </div>
    <ol className="fv-journey-steps" style={{ '--stages': stages.length }} aria-label="레벨별 이동 순서">{stages.map((item, index) => <li key={index} data-complete={index < step}>
      <button type="button" data-stage={index} data-leg={index === step ? leg : 0} aria-label={`${rows[index][0]} · ${item.points.map(name).join(' → ')}`} title={`${rows[index][0]} · ${item.points.map(name).join(' → ')}`} aria-current={index === step ? 'step' : undefined} onClick={() => chooseStep({ step: index, leg: 0 })}><span>{String(index + 1).padStart(2, '0')}</span><strong>{rows[index][0]}</strong><small>{name(isLater ? choices[index] || item.points[0] : item.points.at(-1))}</small></button>
    </li>)}</ol>
    <div className="fv-journey-heading" aria-live={playing ? 'off' : 'polite'}>
      <h3>{row[0]} · {row[1]}</h3>
      <span>{isLater ? '추천 후보 · 이동 연결은 추정' : '외부 퀘스트 가이드 견본'}</span>
    </div>
    <div className="fv-journey-leg">
      <strong>{transport}</strong>
      {isLater && <div className="fv-journey-options" aria-label="이 구간의 지역 후보">{stage.points.map(id => <button type="button" key={id} aria-pressed={path.at(-1).id === id} onClick={() => { setChoices({ ...choices, [step]: id }); setLeg(0); setPlaying(false); }}>{name(id)}</button>)}</div>}
    </div>
    <div className="fv-journey-map" data-running={playing && visible && !failed}>
      {!failed ? <>
        <div className="fv-journey-tools">
          <button type="button" aria-pressed={playing} onClick={play}>{playing ? '일시정지' : finished ? '다시 재생' : '경로 재생'}</button>
          <button type="button" aria-pressed={wholeMap} onClick={() => setWholeMap(!wholeMap)}>{wholeMap ? '구간 확대' : '세계 지도'}</button>
        </div>
        <div className="fv-journey-viewport">
        <div className="fv-journey-camera" data-viewbox={`${x} ${y} ${w} ${h}`} style={{ transform: `translate(${-x / w * 100}%, ${-y / h * 100}%) scale(${903 / w})`, '--pin-scale': w / 903 }}>
        <svg viewBox="0 0 903 640" role="img" aria-label={`${row[0]} 지역 이동: ${path.map(place => place.name).join(' → ')}`}>
          <defs><marker id={arrowId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#fff0a6" /></marker></defs>
          <image href="/images/forever/world-atlas-1536.webp" width="903" height="640" onError={() => { setFailed(true); setPlaying(false); }} />
          {path.slice(1).map((place, index) => {
            const from = path[index];
            const distance = Math.hypot(place.x - from.x, place.y - from.y);
            const inset = Math.min(w * 0.022, distance / 4);
            const dx = distance ? (place.x - from.x) / distance * inset : 0, dy = distance ? (place.y - from.y) / distance * inset : 0;
            const line = { x1: from.x + dx, y1: from.y + dy, x2: place.x - dx, y2: place.y - dy };
            return <g key={routeKey}>
              <defs><mask id={`${arrowId}-reveal`} maskUnits="userSpaceOnUse" x="0" y="0" width="903" height="640"><line {...line} pathLength="1" className="fv-journey-reveal" stroke="white" strokeWidth={w / 30} /></mask></defs>
              <g mask={`url(#${arrowId}-reveal)`}><line {...line} stroke="#101216" strokeWidth={w / 95} /><line {...line} stroke="#fff0a6" strokeWidth={w / 240} strokeDasharray={isLater ? `${w / 80} ${w / 130}` : undefined} markerEnd={`url(#${arrowId})`} /></g>
              {!reduced && <circle className="fv-journey-traveler" aria-hidden="true" cx={place.x} cy={place.y} r={w / 80} style={{ '--travel-x': `${from.x - place.x}px`, '--travel-y': `${from.y - place.y}px` }} fill="#fff8da" stroke="#17212a" strokeWidth={w / 240} />}
            </g>;
          })}
        </svg>
        {path.map((place, index) => <span key={`${index}-${place.id}`} className={`fv-journey-pin ${index === path.length - 1 ? 'is-destination' : ''} ${(place.x - x) / w < 0.23 ? 'is-left' : (place.x - x) / w > 0.77 ? 'is-right' : ''} ${(place.y - y) / h > 0.7 ? 'is-bottom' : ''}`} style={{ left: `${place.x / 903 * 100}%`, top: `${place.y / 640 * 100}%`, '--arrival-delay': path.length > 1 ? '1500ms' : '600ms' }}><b key={routeKey}>{current === 0 && index === 0 && path.length > 1 ? '·' : current + index + (path.length === 1 ? 1 : 0)}</b><span>{place.name}</span></span>)}
        </div>
        <span className="fv-north" aria-hidden="true">↑ 북</span>
        </div>
      </> : <p className="fv-map-error" role="status">지도를 불러오지 못했습니다. 위 이동 순서와 아래 안내로 확인하세요.</p>}
    </div>
    <div className="fv-journey-instructions" key={routeKey}>
      <div><h4>{step === 0 && !isLater ? '이곳에서 시작' : '이 구간에서 할 일'}</h4><p>{row[2]}</p></div>
      <div><h4>다음 지역으로 가는 방법</h4><p>{stage.travel}</p></div>
    </div>
    <p className="fv-caption">{isLater ? '점선은 고른 지역 후보를 잇는 추정 연결입니다. ' : '화살표는 지역·경유지의 방문 순서입니다. '}표식은 지역 범위이며 실제 도로·항로·승강장 위치가 아닙니다.</p>
    {step === stages.length - 1 && !isLater && <button className="fv-journey-continue" type="button" onClick={() => choosePhase('later')}>30~60레벨 추천 후보로 이어 보기 →</button>}
  </div>;
}
