import React from 'react';
import ForeverSpell, { ForeverText } from './ForeverSpell';

export function Flow({ title, steps, note }) {
 return <figure className="fv-visual" aria-label={title}>{title && <h3>{title}</h3>}<ol className="fv-flow">{steps.map((s,i)=><li key={i}><span className="fv-step">{String(i+1).padStart(2,'0')} · {s.title}</span>{s.id && <ForeverSpell id={s.id} size={40}/>}<p><ForeverText>{s.body}</ForeverText></p>{s.relation && <span className="fv-relation">{s.relation}</span>}</li>)}</ol>{note && <figcaption className="fv-caption">{note}</figcaption>}</figure>;
}
export function SkillGroups({ combat }) {
 return <><div className="fv-facts"><span>{combat.role}</span><span>{combat.resource}</span><span>육성·파티 운용</span></div><div className="fv-skill-groups">{[['전투를 이루는 기술·특성',combat.core],['생존·지원·연계',combat.support]].filter(([,ids])=>ids.length).map(([label,ids])=><div className="fv-skill-group" key={label}><h3>{label}</h3>{ids.map(id=><ForeverSpell key={id} id={id} size={32}/>)}</div>)}</div><p className="fv-caption">한국어 원문을 확인한 주요 기술·특성입니다. 아이콘이나 이름을 누르면 설명을 펼칠 수 있습니다. 배우는 시점과 등급은 마법책에서 함께 확인하세요.</p></>;
}
export function TalentGrowth({ table }) {
 const fields=table.columns[1].split(' / ');
 return <figure className="fv-visual" aria-label="특성 투자 흐름"><ol className="fv-growth">{table.rows.map(([level,distribution,total])=>{const points=distribution.split(' / ').map(Number);const sum=points.reduce((a,b)=>a+b,0);return <li key={level}><header><strong>{level}</strong><span>{total}</span></header><div className="fv-growth-bar" aria-hidden="true">{points.map((p,i)=><span key={i} style={{width:`${p/sum*100}%`}}/>)}</div><small>{points.map((p,i)=>`${fields[i]} ${p}점`).join(' · ')}</small></li>;})}</ol><figcaption className="fv-caption">분야별 누적 투자량입니다. 세부 선행 조건과 실제 배치는 아래 계산기를 확인하세요.</figcaption></figure>;
}
export function Facilities({ table, arts }) {
 return <div className="fv-facilities">{table.rows.map(([profession,name,note],i)=><div className="fv-facility" key={profession}><img src={`/images/forever/${arts[i].id}-512.webp`} alt={arts[i].alt} loading="lazy"/><div><small className="fv-muted">{profession}</small><strong style={{display:'block'}}>{name}</strong><p>{note}</p></div></div>)}</div>;
}
