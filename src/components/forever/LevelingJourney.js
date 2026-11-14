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
  const strip = useRef(null);
  const arrowId = useId().replace(/:/g, '');
  const plan = atlas.journeys[race];
  const isLater = phase === 'later';
  const rows = isLater ? later : early;
  const stages = isLater ? atlas.laterJourneys[plan.faction] : plan.stages;
  const stage = stages[step];
  const row = rows[step];
  const previous = isLater
    ? (step ? choices[step - 1] || stages[step - 1].points[0] : plan.stages.at(-1).points.at(-1))
    : (step ? stages[step - 1].points.at(-1) : null);
  const targets = isLater ? [choices[step] || stage.points[0]] : stage.points;
  const ids = [previous, ...targets].filter((id, index, all) => id && id !== all[index - 1]);
  const stops = ids.map(id => places.get(id));
  const path = stops.slice(leg, leg + 2);
  const xs = path.map(place => place.x), ys = path.map(place => place.y);
  // 지도 범위를 잇는 선이며 실제 도로나 승강장 좌표가 아니다.
  const width = Math.min(903, Math.max(190, Math.max(...xs) - Math.min(...xs) + 100, (Math.max(...ys) - Math.min(...ys) + 90) * 1.5));
  const height = Math.min(640, width / 1.5);
  const zoom = [Math.max(0, Math.min(903 - width, (Math.max(...xs) + Math.min(...xs) - width) / 2)), Math.max(0, Math.min(640 - height, (Math.max(...ys) + Math.min(...ys) - height) / 2)), width, height];
  const [x, y, w, h] = wholeMap ? [0, 0, 903, 640] : zoom;
  const transport = isLater ? '후보 비교 · 추정' : path.length === 1 ? '출발·퀘스트 진행' : atlas.journeyTransports[path.map(place => place.id).join('>')] || '지역 이동';
  const finished = step === stages.length - 1 && leg >= stops.length - 2;

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
      if (leg < stops.length - 2) setLeg(leg + 1);
      else if (step < stages.length - 1) { setStep(step + 1); setLeg(0); }
      else setPlaying(false);
    }, 6000);
    return () => clearInterval(timer);
  }, [playing, visible, step, stages.length, leg, stops.length]);

  useEffect(() => {
    // 좁은 화면에서 가로로 넘기는 단계 띠는 지금 단계가 보이게 옆으로만 옮긴다(세로 스크롤은 건드리지 않음).
    const list = strip.current, item = list?.children[step];
    if (!item || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo?.({ left: item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2, behavior: reduced ? 'auto' : 'smooth' });
  }, [step, phase, reduced]);

  const chooseStep = next => { setStep(next); setLeg(0); setPlaying(false); };
  const choosePhase = next => { setPhase(next); setStep(0); setLeg(0); setPlaying(false); };
  const play = () => { if (!playing && finished) { setStep(0); setLeg(0); } setPlaying(!playing); };
  const name = id => places.get(id).name;

  return <div className="fv-journey" ref={frame} data-phase={phase} data-step={step}>
    <div className="fv-journey-phases" aria-label="레벨 구간">
      <button type="button" aria-pressed={!isLater} onClick={() => choosePhase('early')}>1~30 · 종족별 출발</button>
      <button type="button" aria-pressed={isLater} onClick={() => choosePhase('later')}>30~60 · 추천 후보 · 추정</button>
    </div>
    <ol className="fv-journey-steps" ref={strip} style={{ '--steps': rows.length }} aria-label="레벨별 이동 순서">{rows.map(([level, title], index) => <li key={index}>
      <button type="button" title={`${level} · ${title}`} aria-current={index === step ? 'step' : undefined} onClick={() => chooseStep(index)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{level}</strong><small>{title}</small></button>
    </li>)}</ol>
    <div className="fv-journey-heading" aria-live={playing ? 'off' : 'polite'}>
      <h3>{row[0]} · {row[1]}</h3>
      <span>{isLater ? '추천 후보 · 이동 연결은 추정' : '외부 퀘스트 가이드 견본'} · {step + 1} / {stages.length}</span>
    </div>
    <div className="fv-journey-leg">
      <strong>{transport}</strong>
      {isLater
        ? <div className="fv-journey-options" aria-label="이 구간의 지역 후보"><span>{name(previous)}에서 →</span>{stage.points.map(id => <button type="button" key={id} aria-pressed={targets[0] === id} onClick={() => { setChoices({ ...choices, [step]: id }); setLeg(0); setPlaying(false); }}>{name(id)}</button>)}</div>
        : <ol className="fv-journey-stops" aria-label="선택 구간의 이동 지점">{stops.map((place, index) => <li key={`${index}-${place.id}`}>{stops.length > 2
          ? <button type="button" aria-pressed={index === leg || index === leg + 1} aria-label={`${place.name} 이동 구간 보기`} onClick={() => { setLeg(Math.min(index, stops.length - 2)); setPlaying(false); }}><b>{index + 1}</b>{place.name}</button>
          : <span><b>{index + 1}</b>{place.name}</span>}{index < stops.length - 1 && <i aria-hidden="true">→</i>}</li>)}</ol>}
    </div>
    <div className="fv-journey-map" data-running={playing && visible && !failed} style={{ aspectRatio: `${w} / ${h}` }}>
      {!failed ? <>
        <svg viewBox={`${x} ${y} ${w} ${h}`} role="img" aria-label={`${row[0]} 지역 이동: ${path.map(place => place.name).join(' → ')}`}>
          <defs><marker id={arrowId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#fff0a6" /></marker></defs>
          <image href="/images/forever/world-atlas-1536.webp" width="903" height="640" onError={() => { setFailed(true); setPlaying(false); }} />
          {path.slice(1).map((place, index) => {
            const from = path[index];
            const distance = Math.hypot(place.x - from.x, place.y - from.y);
            const inset = Math.min(w * 0.022, distance / 4);
            const dx = (place.x - from.x) / distance * inset, dy = (place.y - from.y) / distance * inset;
            const line = { x1: from.x + dx, y1: from.y + dy, x2: place.x - dx, y2: place.y - dy };
            return <g key={`${index}-${place.id}`}><line {...line} stroke="#101216" strokeWidth={w / 95} /><line {...line} stroke="#fff0a6" strokeWidth={w / 240} strokeDasharray={isLater ? `${w / 80} ${w / 130}` : undefined} markerEnd={`url(#${arrowId})`} /></g>;
          })}
        </svg>
        <span key={`${phase}-${step}-${leg}-${targets.join('-')}`} aria-hidden="true" className="fv-journey-traveler" style={{ '--start-x': `${(path[0].x - x) / w * 100}%`, '--start-y': `${(path[0].y - y) / h * 100}%`, '--end-x': `${(path.at(-1).x - x) / w * 100}%`, '--end-y': `${(path.at(-1).y - y) / h * 100}%` }}/>
        {path.map((place, index) => <span key={`${index}-${place.id}`} className={`fv-journey-pin ${index === path.length - 1 ? 'is-destination' : ''} ${(place.x - x) / w < 0.23 ? 'is-left' : (place.x - x) / w > 0.77 ? 'is-right' : ''} ${(place.y - y) / h > 0.7 ? 'is-bottom' : ''}`} style={{ left: `${(place.x - x) / w * 100}%`, top: `${(place.y - y) / h * 100}%` }}><b>{leg + index + 1}</b><span>{place.name}</span></span>)}
        <div className="fv-journey-tools">
          <button type="button" aria-pressed={playing} onClick={play}>{playing ? '일시정지' : finished ? '다시 재생' : '경로 재생'}</button>
          <button type="button" aria-pressed={wholeMap} onClick={() => setWholeMap(!wholeMap)}>{wholeMap ? '구간 확대' : '세계 지도'}</button>
        </div>
        <span className="fv-north" aria-hidden="true">↑ 북</span>
      </> : <p className="fv-map-error" role="status">지도를 불러오지 못했습니다. 위 이동 순서와 아래 안내로 확인하세요.</p>}
    </div>
    <div className="fv-journey-instructions">
      <div><h4>{step === 0 && !isLater ? '이곳에서 시작' : '이 구간에서 할 일'}</h4><p>{row[2]}</p></div>
      <div><h4>다음 지역으로 가는 방법</h4><p>{stage.travel}</p></div>
    </div>
    <p className="fv-caption">{isLater ? '점선은 고른 지역 후보를 잇는 추정 연결입니다. ' : '화살표는 지역·경유지의 방문 순서입니다. '}표식은 지역 범위이며 실제 도로·항로·승강장 위치가 아닙니다.</p>
    {step === stages.length - 1 && !isLater && <button className="fv-journey-continue" type="button" onClick={() => choosePhase('later')}>30~60레벨 추천 후보로 이어 보기 →</button>}
  </div>;
}
