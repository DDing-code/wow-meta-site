import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import talents from '../../data/foreverTalents.json';
import abilities from '../../data/foreverSpells.json';
import '../../styles/ForeverVisuals.css';

export const foreverSpellById = new Map([...Object.values(abilities.classes).flat(), ...Object.values(talents.classes).flat()].map(spell => [spell.id, spell]));
export function classSpells(classId) {
  return [...(abilities.classes[classId] || []), ...(talents.classes[classId] || [])];
}

function SpellIcon({ spell, size }) {
  const [failed, setFailed] = useState(false);
  return failed ? <span className="fv-icon-fallback" style={{ width: size, height: size }} aria-hidden="true">✦</span>
    : <img src={`https://wow.zamimg.com/images/wow/icons/medium/${spell.icon}.jpg`} alt="" width={size} height={size} loading="lazy" onError={() => setFailed(true)} />;
}

function SpellDescription({ spell }) {
  return <>
    <div className="fv-tip-heading"><SpellIcon spell={spell} size={40} /><strong>{spell.name}</strong></div>
    <p className="fv-muted">포에버{spell.rank ? ` · ${spell.rank}등급` : ''}{spell.passive ? ' · 지속 효과' : ''}</p>
    {spell.conditions && <p className="fv-spell-conditions">{spell.conditions}</p>}
    <p className="fv-spell-description">{spell.verified ? spell.description : `한국어 설명 확인 전\n${spell.reason}`}</p>
    {spell.note && <p className="fv-note">원문 표시 주의 · {spell.note}</p>}
  </>;
}

export default function ForeverSpell({ spell, id, size = 24 }) {
  const data = spell || foreverSpellById.get(id);
  const uid = useId();
  const trigger = useRef(null);
  const tip = useRef(null);
  const dialog = useRef(null);
  const restoringFocus = useRef(false);
  const [hover, setHover] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [position, setPosition] = useState({ left: 8, top: 8, visibility: 'hidden' });
  const close = () => {
    restoringFocus.current = true;
    // 브라우저의 모달 잠금을 먼저 풀어야 원래 버튼으로 초점을 옮길 수 있다.
    if (dialog.current?.open && dialog.current.close) dialog.current.close();
    setPinned(false); setHover(false);
    trigger.current?.focus();
  };

  useLayoutEffect(() => {
    if (!hover || pinned || !tip.current) return undefined;
    const place = () => {
      const anchor = trigger.current.getBoundingClientRect();
      const box = tip.current.getBoundingClientRect();
      const left = Math.max(8, Math.min(anchor.left, window.innerWidth - box.width - 8));
      const top = anchor.bottom + box.height + 12 < window.innerHeight ? anchor.bottom + 8 : Math.max(8, anchor.top - box.height - 8);
      setPosition({ left, top, visibility: 'visible' });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    const escape = event => { if (event.key === 'Escape') setHover(false); };
    window.addEventListener('keydown', escape);
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); window.removeEventListener('keydown', escape); };
  }, [hover, pinned]);

  useEffect(() => {
    if (pinned && dialog.current) {
      if (dialog.current.showModal) dialog.current.showModal();
      else dialog.current.setAttribute('open', '');
      dialog.current.querySelector('button')?.focus();
    }
  }, [pinned]);
  if (!data) return null;
  return <>
    <button ref={trigger} type="button" className="fv-spell" data-spell-id={data.id}
      aria-haspopup="dialog" aria-describedby={hover && !pinned ? uid : undefined}
      onMouseEnter={() => { if (!restoringFocus.current) setHover(true); }} onMouseLeave={() => { restoringFocus.current = false; setHover(false); }}
      onFocus={() => { if (!restoringFocus.current) setHover(true); }} onBlur={() => { restoringFocus.current = false; setHover(false); }} onClick={() => { setHover(false); setPinned(true); }}>
      <SpellIcon spell={data} size={size} /><strong>{data.name}</strong>
    </button>
    {hover && !pinned && createPortal(<div ref={tip} id={uid} role="tooltip" className="fv-tooltip" style={position}><SpellDescription spell={data} /></div>, document.body)}
    {pinned && createPortal(<dialog ref={dialog} className="fv-spell-dialog" aria-label={`${data.name} · 포에버 한국어 설명`}
      onCancel={event => { event.preventDefault(); close(); }} onClose={close} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div className="fv-dialog-body"><button type="button" className="fv-close" onClick={close} aria-label="설명 닫기">닫기 ×</button>
        <SpellDescription spell={data} /><a className="fv-source" href={data.source} target="_blank" rel="noopener noreferrer" data-wowhead="ignore">와우헤드 한국어 원문 ↗</a>
      </div>
    </dialog>, document.body)}
  </>;
}

// 본문에서 이미 등록한 이름만 연결한다. 이름이 겹치면 긴 이름을 먼저 찾는다.
export function ForeverText({ children, spells }) {
  const text = String(children ?? '');
  const known = [...new Map((spells || [...foreverSpellById.values()]).map(spell => [spell.name, spell])).values()].sort((a, b) => b.name.length - a.name.length);
  if (!known.length) return text;
  const names = new Map(known.map(spell => [spell.name, spell]));
  const pattern = new RegExp(`(${known.map(spell => spell.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
  return text.split(pattern).map((part, index) => names.has(part) ? <ForeverSpell key={index} spell={names.get(part)} /> : part);
}
