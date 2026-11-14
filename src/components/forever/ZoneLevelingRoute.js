import React, { useEffect, useId, useRef, useState } from 'react';
import atlas from '../../data/foreverVisuals.json';
import leveling from '../../data/foreverLevelingRoutes.json';

const names = new Map([...atlas.regions, ...atlas.places].map(place => [place.id, place.name]));

// 좌표는 그대로 두고 가까운 거점의 번호만 비켜 놓는다.
export function arrangeRouteLabels(stops, width) {
  const height = width * 668 / 1002;
  const offsets = [-80, -40, 0, 40, 80].flatMap(x => [-80, -40, 0, 40, 80].map(y => [x, y]))
    .sort((a, b) => Math.hypot(...a) - Math.hypot(...b));
  const placed = [];
  for (const stop of stops) {
    const candidates = offsets.map(([dx, dy]) => ({ x: Math.max(20, Math.min(width - 20, stop.x * width / 100 + dx)), y: Math.max(20, Math.min(height - 20, stop.y * height / 100 + dy)) }));
    placed.push(candidates.find(p => placed.every(q => Math.hypot(p.x - q.x, p.y - q.y) >= 40)) || candidates[0]);
  }
  return placed.map(p => ({ x: p.x / width * 100, y: p.y / height * 100 }));
}

export default function ZoneLevelingRoute({ zoneIds, faction }) {
  const options = zoneIds.filter(id => leveling.routes[id]?.some(route => route.faction === faction));
  const [zone, setZone] = useState(options.at(-1));
  const [stop, setStop] = useState(0);
  const [failed, setFailed] = useState(false);
  const [width, setWidth] = useState(600);
  const map = useRef(null);
  const headingId = useId();
  const route = leveling.routes[zone]?.find(item => item.faction === faction);
  useEffect(() => {
    const node = map.current;
    if (!node) return;
    if (node.clientWidth) setWidth(node.clientWidth);
    if (!window.ResizeObserver) return;
    const observer = new ResizeObserver(([entry]) => { if (entry.contentRect.width) setWidth(entry.contentRect.width); });
    observer.observe(node);
    return () => observer.disconnect();
  }, [zone, failed]);
  if (!route) return <p className="fv-caption">이 구간은 확인된 지역 안 세부 경로가 아직 없습니다. 위 지역 이동 안내를 참고하세요.</p>;
  const point = route.stops[stop];
  const labels = arrangeRouteLabels(route.stops, width);

  return <section className="fv-zone-route" aria-labelledby={headingId}>
    <header><h4 id={headingId}>지역 안 레벨업 경로</h4><span>거점 번호를 눌러 진행 순서 보기</span></header>
    {options.length > 1 && <div className="fv-journey-options" aria-label="세부 경로 지역">{options.map(id => <button type="button" key={id} aria-pressed={zone === id} onClick={() => { setZone(id); setStop(0); setFailed(false); }}>{names.get(id)}</button>)}</div>}
    <p className="fv-zone-summary"><strong>{names.get(zone)}</strong> · {route.levels}</p>
    <div className="fv-zone-layout">
      {!failed ? <div className="fv-zone-map" ref={map}>
        <img src={route.image} alt={`${names.get(zone)} 지역 지도`} loading="lazy" onError={() => setFailed(true)} />
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <polyline points={route.stops.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#151d23" strokeWidth="5" vectorEffect="non-scaling-stroke" />
          <polyline points={route.stops.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#fff0a6" strokeWidth="2.5" strokeDasharray="6 4" vectorEffect="non-scaling-stroke" />
          {route.stops.map((p, index) => <g key={index}><line x1={p.x} y1={p.y} x2={labels[index].x} y2={labels[index].y} stroke="#fff0a6" strokeWidth="1.5" vectorEffect="non-scaling-stroke" /><circle cx={p.x} cy={p.y} r=".6" fill="#fff0a6" /></g>)}
        </svg>
        {route.stops.map((p, index) => <button type="button" key={index} className="fv-zone-pin" style={{ left: `${labels[index].x}%`, top: `${labels[index].y}%` }} aria-label={`${index + 1}. ${p.name}`} aria-pressed={index === stop} onClick={() => setStop(index)}>{index + 1}</button>)}
      </div> : <p className="fv-map-error" role="status">지역 지도를 불러오지 못했습니다. 옆의 거점 순서와 안내로 확인하세요.</p>}
      <ol className="fv-zone-stops" aria-label={`${names.get(zone)} 거점 방문 순서`}>{route.stops.map((p, index) => <li key={index}>
        <button type="button" aria-pressed={index === stop} onClick={() => setStop(index)}><b>{index + 1}</b>{p.name}</button>
      </li>)}</ol>
    </div>
    <div className="fv-zone-instruction" aria-live="polite"><strong>{stop + 1}. {point.name}</strong><p>{point.note}</p></div>
    <p className="fv-caption">{route.note} 점선은 거점 방문 순서이며, 실제 도로·동굴 안 이동 경로가 아닙니다. 퀘스트 반납을 위한 왕복은 생략했습니다. <a href={route.source} target="_blank" rel="noopener noreferrer">지역별 원문·지도 근거 ↗</a></p>
  </section>;
}
