import React, { useState } from 'react';
import atlas from '../../data/foreverVisuals.json';
import '../../styles/ForeverVisuals.css';

const bounds = { world: [0, 0, 903, 640], west: [130, 0, 290, 530], east: [600, 100, 250, 450], island: [450, 70, 140, 150] };
const continents = { world: '세계', west: '칼림도어', east: '동부 왕국', island: '제프라스 섬' };
const continent = place => place.x < 400 ? 'west' : place.x > 600 ? 'east' : 'island';
export function mapPlaces(config) {
  const route = atlas.routes[config.race];
  if (route) return [...route.map(id => [...atlas.regions, ...atlas.places].find(p => p.id === id)), ...atlas.places.filter(p => p.kind === 'dungeon' && continent(p) === continent([...atlas.regions,...atlas.places].find(p=>p.id===route[0])))];
  return atlas.places.filter(p => config.ids ? config.ids.includes(p.id) : config.kind ? p.kind === config.kind : true);
}

export default function ForeverMap({ config = {} }) {
  const places = mapPlaces(config);
  const [selected, setSelected] = useState(places[0].id);
  const [view, setView] = useState(continent(places[0]));
  const [failed, setFailed] = useState(false);
  const place = places.find(item => item.id === selected) || places[0];
  const [x,y,w,h] = bounds[view];
  const visible = places.filter(p => view === 'world' || continent(p) === view);
  const choose = id => { const next = places.find(p=>p.id===id); setSelected(id); if (view !== 'world') setView(continent(next)); };
  const path = (atlas.routes[config.race] || []).map(id => places.find(p=>p.id===id));
  const status = place.kind === 'zone' || place.kind === 'route' ? '지역 범위 표식' : place.marker ? '와우헤드 지도 표식 확인 · 입구 주변 길은 현장 확인' : '지역 위치 확인 · 정확한 입구 확인 중';
  return <div className="fv-map">
    <div className="fv-map-tabs" aria-label="지도 범위">{Object.entries(continents).map(([key,label])=><button key={key} type="button" aria-pressed={view===key} onClick={()=>setView(key)}>{label}</button>)}</div>
    <div className="fv-map-layout">
      <div>
        <div className="fv-map-canvas" data-view={view} style={{aspectRatio:`${w} / ${h}`}}>
          {!failed ? <svg viewBox={`${x} ${y} ${w} ${h}`} aria-label="북쪽이 위인 포에버 도트 지형 지도" role="img">
            <image href="/images/forever/world-atlas-1536.webp" x="0" y="0" width="903" height="640" onError={()=>setFailed(true)} />
            {path.slice(1).map((p,i)=>path[i].id !== 'teldrassil' && continent(p)===continent(path[i]) ? <line key={p.id} x1={path[i].x} y1={path[i].y} x2={p.x} y2={p.y} stroke="#e9d397" strokeWidth="2" strokeDasharray="5 5" /> : null)}
          </svg> : <p className="fv-map-error">지도를 불러오지 못했습니다. 아래 위치 안내를 확인하세요.</p>}
          {!failed && visible.map(p=><button key={p.id} className={`fv-map-pin ${p.marker?'is-door':'is-area'} ${p.kind==='raid'?'is-raid':''}`} type="button" style={{left:`${(p.x-x)/w*100}%`,top:`${(p.y-y)/h*100}%`}} aria-label={`${p.name} 지도에서 선택`} aria-pressed={selected===p.id} onClick={()=>choose(p.id)}><span>{places.indexOf(p)+1}</span></button>)}
          <span className="fv-north" aria-hidden="true">↑ 북</span>
        </div>
        <p className="fv-caption">□ 던전 지도 표식 · ▣ 레이드 지도 표식 · ○ 지역 범위<br />{config.race ? '점선은 추정 경로의 지역 순서이며 실제 도로·배편이 아닙니다. 섬 사이 이동선은 표시하지 않았습니다.' : '번호를 누르면 장소 설명과 주변 확대 지도를 볼 수 있습니다.'}{view==='world' && <span className="fv-small-map-note">작은 화면의 세계 지도에는 선택한 장소만 표시합니다. 아래 목록에서 장소를 고르세요.</span>}</p>
      </div>
      <aside className="fv-map-detail" aria-label="선택한 장소">
        <span className="fv-map-kicker">{place.kind==='raid'?'레이드':place.kind==='dungeon'?'던전':'지역'} · {places.indexOf(place)+1}</span>
        <h3>{place.name}</h3><p className="fv-map-level">{place.level}</p><p>{place.zone}</p>
        <p className="fv-note">{status}</p>
        {place.kind==='raid' && <img className="fv-raid-art" src={`/images/forever/raid-${place.id}-512.webp`} alt={`${place.name}의 분위기를 표현한 도트 삽화`} loading="lazy" />}
        <h4>접근과 준비</h4><p>{place.approach}</p>
        {!failed && <svg className="fv-map-zoom" viewBox={`${place.x-48} ${place.y-36} 96 72`} role="img" aria-label={`${place.name} 주변 확대 · ${place.marker?'지도 표식':'지역 범위'}`}>
          <image href="/images/forever/world-atlas-1536.webp" x="0" y="0" width="903" height="640" />
          <circle cx={place.x} cy={place.y} r={place.marker?3:13} fill={place.marker?'#8dd9f5':'#8dd9f522'} stroke="#e4f5ff" strokeWidth="1" strokeDasharray={place.marker?undefined:'2 2'} />
        </svg>}
        <p className="fv-caption">표시 레벨은 콘텐츠 소개 범위입니다. 최소 입장 레벨과 다를 수 있습니다. 도트 지도상의 배치이며 게임 좌표가 아닙니다.</p>
        <a href="https://www.wowhead.com/forever/ko/world-map" target="_blank" rel="noopener noreferrer">와우헤드 원본 지도 ↗</a>
      </aside>
    </div>
    <div className="fv-place-list" aria-label="장소 목록">{places.map((p,i)=><button type="button" key={p.id} aria-pressed={selected===p.id} onClick={()=>choose(p.id)}><span>{i+1}</span><strong>{p.name}</strong><small>{p.level}{!p.marker && p.kind!=='zone' && p.kind!=='route'?' · 입구 확인 중':''}</small></button>)}</div>
  </div>;
}
