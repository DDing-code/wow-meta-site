import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { marksmanshipGraph, relationKinds, spellKind, spellKinds, spellName, matchesSpell } from '../data/spellRelations';
import './SpellRelationMap.css';

const graphNeighbors = (graph, id) => graph.edges
  .filter(edge => edge.source === id || edge.target === id)
  .map(edge => edge.source === id ? edge.target : edge.source);

export function SpellIcon({ record }) {
  return record.type === 'synergy'
    ? <span className="note-icon" aria-hidden="true">◇</span>
    : <img src={record.iconUrls?.medium || record.iconUrl} alt="" width="32" height="32" loading="lazy" />;
}

export function SpellReference({ record, children, onClick, ...props }) {
  const [anchor, setAnchor] = useState(null);
  const tooltipId = useId();
  const show = event => {
    const rect = event.currentTarget.getBoundingClientRect();
    setAnchor({
      left: Math.max(10, Math.min(rect.left, window.innerWidth - 322)),
      top: Math.max(10, Math.min(rect.bottom + 8, window.innerHeight - 310)),
    });
  };
  return <>
    <button type="button" {...props}
      aria-describedby={anchor ? tooltipId : undefined}
      onClick={event => { setAnchor(null); onClick?.(event); }}
      onMouseEnter={show} onMouseLeave={() => setAnchor(null)}
      onFocus={show} onBlur={() => setAnchor(null)}
      onKeyDown={event => { if (event.key === 'Escape') setAnchor(null); }}>
      {children || <><SpellIcon record={record} />{spellName(record)}</>}
    </button>
    {anchor && <div id={tooltipId} role="tooltip" className="tooltip" style={anchor}>
      <div className="tooltip-head"><SpellIcon record={record} />{spellName(record)}</div>
      <p className="description">{record.description || '저장된 설명이 없습니다.'}</p>
    </div>}
  </>;
}

export function SpellDetail({ record, onSelect, onClear, graph = marksmanshipGraph }) {
  const graphById = new Map(graph.nodes.map(node => [node.id, node]));
  const kind = record ? spellKind(record) : null;
  const related = record ? graphNeighbors(graph, record.id).map(id => graphById.get(id)) : [];
  const directions = record?.type === 'synergy' ? record.relations || [] : [];
  return (
    <aside className="detail" aria-label="선택한 스킬 상세" aria-live="polite">
      <div className="detail-top">
        <span>{record ? '선택한 ' + spellKinds[kind].label : '스킬 상세'}</span>
        {record && <button type="button" onClick={onClear} aria-label="선택 해제">×</button>}
      </div>
      {!record ? (
        <div className="detail-placeholder"><strong>연결의 시작점을 골라 보세요.</strong>
          점이나 이름을 누르면 원문 설명과 연결된 관계가 나타납니다.</div>
      ) : (
        <>
          <div className="detail-title" style={{ '--node-color': spellKinds[kind].color }}>
            <SpellIcon record={record} />
            <div><h2>{spellName(record)}</h2><div className="type-label">{spellKinds[kind].label}</div></div>
          </div>
          <p className="description">{record.description || '저장된 설명이 없습니다.'}</p>
          <div className="facts">
            {kind !== 'note' && <span>주문 번호 {record.id}</span>}
            <span>기록 패치 {record.patch}</span><span>DB 원문</span>
            {kind !== 'note' && <a href={'https://ko.wowhead.com/spell=' + record.id} target="_blank" rel="noreferrer">Wowhead ↗</a>}
          </div>
          {directions.length > 0 && <>
            <div className="relations-heading">방향과 조건 <span>{directions.length}개</span></div>
            {directions.map((relation, index) => (
              <div className="direction" key={index}>
                <div className="direction-path">
                  {[relation.from, relation.to].map((id, position) => (
                    <React.Fragment key={id + position}>
                      {position === 1 && <span aria-label="에서 다음으로">→</span>}
                      <SpellReference record={graphById.get(id)} onClick={() => onSelect(graphById.get(id))} />
                    </React.Fragment>
                  ))}
                </div>
                <div className="direction-kind">{relationKinds[relation.kind]}</div>
                <p className="direction-condition">{relation.condition}</p>
                {relation.requires?.length > 0 && <div className="requirements" aria-label="필요한 특성 또는 상태">
                  {relation.requires.map(id => (
                    <SpellReference className="requirement" key={id} record={graphById.get(id)}
                      aria-label={spellName(graphById.get(id)) + ', ' + spellKinds[spellKind(graphById.get(id))].label}
                      onClick={() => onSelect(graphById.get(id))} />
                  ))}
                </div>}
              </div>
            ))}
          </>}
          <div className="relations-heading">{kind === 'note' ? '이 관계의 스킬·특성' : '연결된 관계 노트'} <span>{related.length}개</span></div>
          {related.map(item => (
            <SpellReference className="relation" key={item.id} record={item} onClick={() => onSelect(item)}>
              <SpellIcon record={item} /><span>{spellName(item)}{item.kind === 'buff' ? ' · 버프' : ''}</span><span className="arrow">↗</span>
            </SpellReference>
          ))}
          {related.length === 0 && kind !== 'note' && <p className="direction-condition">이 스킬의 관계는 아직 연결하지 않았습니다.</p>}
          <details className="source"><summary>원본 위치 확인</summary><p>{record.source?.kbPath}</p></details>
        </>
      )}
    </aside>
  );
}

function nodeLines(node) {
  if (node.kind !== 'note') return [spellName(node)];
  const lines = [];
  for (const word of spellName(node).split(' ')) {
    if (!lines.length || (lines[lines.length - 1] + ' ' + word).length > 19) lines.push(word);
    else lines[lines.length - 1] += ' ' + word;
  }
  return lines;
}

// 움직이는 좌표는 React 상태에 넣지 않고 SVG에 그린다.
function useMapMotion(svgRef, graph, nodes, edges, onSelect, motion, setZoomValue) {
  const controller = useRef(null);
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;
  const motionRef = useRef(motion);
  motionRef.current = motion;
  const positions = useRef(new Map());
  useEffect(() => {
    const svg = svgRef.current;
    const viewport = svg.querySelector('[data-viewport]');
    const graphById = new Map(graph.nodes.map(node => [node.id, node]));
    const byId = positions.current;
    graph.nodes.forEach(node => {
      if (!byId.has(node.id)) byId.set(node.id, { ...node, homeX: node.x, homeY: node.y, vx: 0, vy: 0 });
    });
    const moving = nodes.map(node => byId.get(node.id));
    const nodeElements = [...svg.querySelectorAll('[data-node-id]')];
    const edgeElements = [...svg.querySelectorAll('[data-edge]')];
    const springs = edges.map(edge => {
      const a = byId.get(edge.source), b = byId.get(edge.target);
      const ah = graphById.get(a.id), bh = graphById.get(b.id);
      return { ...edge, length: Math.hypot(ah.x - bh.x, ah.y - bh.y) };
    });
    let scale = 1, targetScale = 1, panX = 0, panY = 0, drag = null, frame = 0, cameraFrame = 0, energy = 0;
    const transform = () => viewport.setAttribute('transform', 'translate(' + (500 + panX) + ' ' + (360 + panY) + ') scale(' + scale + ') translate(-500 -360)');
    const cameraTo = (x, y, zoom = targetScale) => {
      cancelAnimationFrame(cameraFrame);
      const startX = panX, startY = panY, startScale = scale, start = performance.now();
      const animate = now => {
        const progress = motionRef.current ? Math.min(1, (now - start) / 360) : 1;
        const ease = 1 - Math.pow(1 - progress, 3);
        panX = startX + (x - startX) * ease; panY = startY + (y - startY) * ease;
        scale = startScale + (zoom - startScale) * ease;
        transform();
        cameraFrame = progress < 1 ? requestAnimationFrame(animate) : 0;
      };
      animate(start);
    };
    const paint = () => {
      nodeElements.forEach(element => {
        const node = byId.get(element.dataset.nodeId);
        element.setAttribute('transform', 'translate(' + node.x + ',' + node.y + ')');
      });
      edgeElements.forEach((element, index) => {
        const a = byId.get(edges[index].source), b = byId.get(edges[index].target);
        element.setAttribute('x1', a.x); element.setAttribute('y1', a.y);
        element.setAttribute('x2', b.x); element.setAttribute('y2', b.y);
      });
    };
    const tick = () => {
      frame = 0;
      if (!motionRef.current) return;
      moving.forEach(node => { node.vx += (node.homeX - node.x) * .012; node.vy += (node.homeY - node.y) * .012; });
      springs.forEach(edge => {
        const a = byId.get(edge.source), b = byId.get(edge.target);
        const dx = b.x - a.x, dy = b.y - a.y, distance = Math.hypot(dx, dy) || 1;
        const force = (distance - edge.length) * .018 / distance;
        a.vx += dx * force; a.vy += dy * force; b.vx -= dx * force; b.vy -= dy * force;
      });
      for (let i = 0; i < moving.length; i++) for (let j = i + 1; j < moving.length; j++) {
        const a = moving[i], b = moving[j], dx = b.x - a.x, dy = b.y - a.y;
        if (Math.abs(dx) < (a.kind === 'note' || b.kind === 'note' ? 160 : 100) && Math.abs(dy) < 65) {
          const push = (65 - Math.abs(dy)) * .035 * (dy >= 0 ? 1 : -1);
          a.vy -= push; b.vy += push;
        }
      }
      moving.forEach(node => {
        if (drag?.node === node) { node.vx = 0; node.vy = 0; return; }
        node.vx *= .76; node.vy *= .76;
        node.x = Math.max(70, Math.min(930, node.x + node.vx));
        node.y = Math.max(65, Math.min(655, node.y + node.vy));
      });
      paint(); energy *= .96;
      // 이동 후 잠깐만 계산하고 멈춰 유휴 상태에서는 프레임을 쓰지 않는다.
      if (drag?.moved || energy > .02) frame = requestAnimationFrame(tick);
    };
    const wake = () => { energy = 1; if (motionRef.current && !frame) frame = requestAnimationFrame(tick); };
    const point = event => new DOMPoint(event.clientX, event.clientY).matrixTransform(viewport.getScreenCTM().inverse());
    const down = event => {
      if (event.button !== 0 || drag) return;
      cancelAnimationFrame(cameraFrame); cameraFrame = 0;
      targetScale = scale; setZoomValue(Math.round(scale * 100));
      const node = byId.get(event.target.closest('[data-node-id]')?.dataset.nodeId);
      const p = point(event);
      drag = { pointer: event.pointerId, node, x: event.clientX, y: event.clientY, panX, panY, offsetX: node ? node.x - p.x : 0, offsetY: node ? node.y - p.y : 0, moved: false };
      svg.setPointerCapture(event.pointerId);
    };
    const move = event => {
      if (!drag || event.pointerId !== drag.pointer) return;
      const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 5) drag.moved = true;
      if (!drag.moved) return;
      if (drag.node) {
        const p = point(event);
        drag.node.x = Math.max(70, Math.min(930, p.x + drag.offsetX));
        drag.node.y = Math.max(65, Math.min(655, p.y + drag.offsetY));
        paint(); wake();
      } else {
        const rect = svg.getBoundingClientRect(), ratio = Math.min(rect.width / 1000, rect.height / 720);
        panX = drag.panX + dx / ratio; panY = drag.panY + dy / ratio; transform();
      }
    };
    const up = event => {
      if (!drag || event.pointerId !== drag.pointer) return;
      const previous = drag; drag = null;
      if (svg.hasPointerCapture(event.pointerId)) svg.releasePointerCapture(event.pointerId);
      if (!previous.moved && previous.node && event.type === 'pointerup') selectRef.current(graphById.get(previous.node.id));
      if (previous.moved && previous.node) wake();
    };
    const zoom = factor => {
      targetScale = Math.min(2.5, Math.max(.6, targetScale * factor));
      setZoomValue(Math.round(targetScale * 100)); cameraTo(panX, panY);
    };
    // 모바일 세로 스크롤은 지도의 위아래에서 이어가고, 휠은 페이지 스크롤을 유지한다.
    controller.current = {
      zoom,
      reset() {
        cancelAnimationFrame(frame); frame = 0;
        moving.forEach(node => Object.assign(node, { x: node.homeX, y: node.homeY, vx: 0, vy: 0 }));
        targetScale = 1; paint(); cameraTo(0, 0); setZoomValue(100); wake();
      },
      focus(id) {
        const node = byId.get(id);
        if (!node) return;
        cameraTo((500 - node.x) * targetScale, (360 - node.y) * targetScale); wake();
      },
      stop() { cancelAnimationFrame(frame); frame = 0; },
      wake,
    };
    svg.addEventListener('pointerdown', down);
    svg.addEventListener('pointermove', move);
    svg.addEventListener('pointerup', up);
    svg.addEventListener('pointercancel', up);
    svg.addEventListener('lostpointercapture', up);
    if (motionRef.current) moving.forEach(node => {
      node.x = 500 + (node.x - 500) * .9; node.y = 360 + (node.y - 360) * .9;
    });
    paint(); transform(); setZoomValue(100); wake();
    return () => {
      cancelAnimationFrame(frame); cancelAnimationFrame(cameraFrame); controller.current = null;
      svg.removeEventListener('pointerdown', down); svg.removeEventListener('pointermove', move);
      svg.removeEventListener('pointerup', up); svg.removeEventListener('pointercancel', up);
      svg.removeEventListener('lostpointercapture', up);
    };
  }, [graph, nodes, edges, svgRef, setZoomValue]);
  useEffect(() => { if (motion) controller.current?.wake(); else controller.current?.stop(); }, [motion]);
  return controller;
}

export default function SpellRelationMap({ selected, onSelect, onClear, query = '', kind = 'all', resetFilters, graph = marksmanshipGraph, label = '사격 사냥꾼' }) {
  const graphById = useMemo(() => new Map(graph.nodes.map(node => [node.id, node])), [graph]);
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const [local, setLocal] = useState(!!graph.centerId);
  const [zoomValue, setZoomValue] = useState(100);
  const [motion, setMotion] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [tooltip, setTooltip] = useState(null);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => { if (media.matches) setMotion(false); };
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);
  const selectedId = selected?.id;
  useEffect(() => {
    if (!selectedId || query) setLocal(false);
  }, [selectedId, query]);
  const nodes = useMemo(() => {
    let records = graph.nodes;
    if (query) {
      const hits = records.filter(node => matchesSpell(node, query));
      const ids = new Set(hits.flatMap(node => [node.id, ...graphNeighbors(graph, node.id)]));
      records = records.filter(node => ids.has(node.id));
    }
    if (local && selectedId) {
      const ids = new Set([selectedId, ...graphNeighbors(graph, selectedId)]);
      records = records.filter(node => ids.has(node.id));
    }
    return kind === 'all' ? records : records.filter(node => node.kind === kind);
  }, [graph, query, kind, local, selectedId]);
  const edges = useMemo(() => {
    const ids = new Set(nodes.map(node => node.id));
    return graph.edges.filter(edge => ids.has(edge.source) && ids.has(edge.target));
  }, [graph, nodes]);
  const controller = useMapMotion(svgRef, graph, nodes, edges, onSelect, motion, setZoomValue);
  const activeId = hovered || selectedId;
  const near = new Set(graphNeighbors(graph, activeId));
  useEffect(() => {
    if (selectedId) controller.current?.focus(selectedId);
  }, [selectedId, controller]);
  const showTooltip = (record, event) => {
    setHovered(record.id); setTooltip(record);
    const box = event.currentTarget.getBoundingClientRect();
    if (tooltipRef.current) {
      tooltipRef.current.style.left = Math.max(10, Math.min(event.clientX || box.x, window.innerWidth - 322)) + 'px';
      tooltipRef.current.style.top = Math.max(10, Math.min((event.clientY || box.y) + 20, window.innerHeight - 310)) + 'px';
    }
  };
  const hideTooltip = () => { setHovered(null); setTooltip(null); };
  const reset = () => { setLocal(false); resetFilters?.(); controller.current?.reset(); };
  return (
    <>
      <section className="workbench" aria-label={`${label} 관계 지도`}>
        <div className="map-area">
          <div className="map-top">
            <span className="map-count" role="status">{nodes.length}개 노드 / {edges.length}개 연결</span>
            <div className="map-actions">
              <button type="button" aria-pressed={motion} onClick={() => setMotion(value => !value)}>움직임 {motion ? '켜짐' : '꺼짐'}</button>
              <button type="button" aria-pressed={local && !!selectedId} disabled={!selectedId || !graphById.has(selectedId)} onClick={() => setLocal(value => !value)}>선택 주변만 보기</button>
            </div>
          </div>
          {selected && <div className="mobile-selection" aria-hidden="true"><SpellIcon record={selected} /><span>{spellName(selected)}</span></div>}
          <svg ref={svgRef} className="canvas" viewBox="0 0 1000 720" role="group" aria-label={`${label} 시너지 그래프. 탭으로 이동하고 엔터로 선택하세요.`} onPointerDown={hideTooltip}>
            <g data-viewport="">
              <g aria-hidden="true">{edges.map(edge => (
                <line key={edge.source + edge.target} data-edge="" className={'edge' + (activeId ? edge.source === activeId || edge.target === activeId ? ' emphasis' : ' muted' : '')} />
              ))}</g>
              {nodes.map(node => (
                <g key={node.id} data-node-id={node.id}
                  className={['node', node.id === graph.centerId ? 'graph-center-node' : '', node.kind, node.id === selectedId ? 'selected' : near.has(node.id) ? 'related' : activeId ? 'muted' : ''].join(' ')}
                  style={{ '--node-color': spellKinds[node.kind].color }}
                  tabIndex="0" role="button" aria-pressed={node.id === selectedId}
                  aria-label={spellName(node) + ', ' + spellKinds[node.kind].label + (node.kind === 'note' ? '' : ', 주문 번호 ' + node.id)}
                  onKeyDown={event => {
                    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(node); hideTooltip(); }
                    if (event.key === 'Escape') { onClear(); hideTooltip(); }
                  }}
                  onMouseEnter={event => showTooltip(node, event)} onMouseLeave={hideTooltip}
                  onFocus={event => showTooltip(node, event)} onBlur={hideTooltip}>
                  {node.id === graph.centerId && <title>{spellName(node)} · {graph.centerConnections}개 시너지 연결</title>}
                  <rect className="hit" x={node.kind === 'note' ? -115 : -70} y="-22" width={node.kind === 'note' ? 230 : 140} height="68" />
                  <circle className="ring" r={node.id === selectedId ? 15 : 13} />
                  {node.kind === 'note' ? <path className="dot" d="M0 -7 L7 0 L0 7 L-7 0Z" /> : <circle className="dot" r={node.id === selectedId ? 8 : node.kind === 'skill' ? 6 : 5} />}
                  {graph.centerId && node.kind !== 'note' && <image href={node.iconUrls?.medium || node.iconUrl} x="-9" y="-9" width="18" height="18" />}
                  <text y="24">{nodeLines(node).map((line, index) => <tspan key={index} x="0" dy={index ? 16 : 0}>{line}</tspan>)}
                    {node.kind === 'buff' && <tspan x="0" dy="15" className="qualifier">버프</tspan>}
                  </text>
                </g>
              ))}
            </g>
          </svg>
          {nodes.length === 0 && <div className="empty"><div><strong>표시할 연결이 없습니다</strong><span>검색어나 유형 필터를 바꿔 보세요.</span><button type="button" onClick={reset}>전체 다시 보기</button></div></div>}
          <div className="map-bottom">
            <span className="instructions">노드 끌기 → 연결도 함께 이동 · 빈 곳 끌기 → 지도 이동</span>
            <span className="mobile-hint">점을 끌면 연결도 따라와요.<br />누르면 아래에 설명이 나와요.</span>
            <div className="zoom" aria-label="지도 확대 축소">
              <button type="button" aria-label="축소" disabled={zoomValue <= 60} onClick={() => controller.current?.zoom(1 / 1.2)}>−</button>
              <output>{zoomValue}%</output>
              <button type="button" aria-label="확대" disabled={zoomValue >= 250} onClick={() => controller.current?.zoom(1.2)}>+</button>
              <button type="button" className="fit" aria-label="지도와 노드 배치 초기화" onClick={() => controller.current?.reset()}>⌖</button>
            </div>
          </div>
        </div>
        <SpellDetail record={selected} onSelect={onSelect} onClear={onClear} graph={graph} />
      </section>
      <div className="map-footer">
        <p>선 = 확인된 관계에 참여한 스킬·특성<br />딜사이클 순서는 아닙니다. 발동·강화의 방향과 조건은 관계 노트에서 확인하세요.</p>
        <p>{label} 관계 {graph.nodes.filter(node => node.kind === 'note').length}개<br />이름·설명은 KB에서 생성한 DB 원문입니다.</p>
      </div>
      <div ref={tooltipRef} className="tooltip" role="tooltip" hidden={!tooltip}>
        {tooltip && <><div className="tooltip-head"><SpellIcon record={tooltip} />{spellName(tooltip)}</div><p className="description">{tooltip.description}</p></>}
      </div>
    </>
  );
}
