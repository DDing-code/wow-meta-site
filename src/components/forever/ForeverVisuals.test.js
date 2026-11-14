import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import ForeverSpell, { ForeverText } from './ForeverSpell';
import ForeverMap, { mapPlaces } from './ForeverMap';
import visuals from '../../data/foreverVisuals.json';
import spells from '../../data/foreverSpells.json';
import talents from '../../data/foreverTalents.json';

let container,root;
beforeEach(()=>{global.IS_REACT_ACT_ENVIRONMENT=true;container=document.createElement('div');document.body.appendChild(container);root=createRoot(container);});
afterEach(()=>{act(()=>root.unmount());container.remove();});
const click=el=>act(()=>el.dispatchEvent(new MouseEvent('click',{bubbles:true})));

test('터치 상세창은 원문·실제 등급을 보이며 Escape로 닫고 초점을 되돌린다',()=>{
 const spell={...talents.classes.warrior[0],rank:3};
 act(()=>root.render(<ForeverSpell spell={spell}/>));
 const trigger=container.querySelector('button');
 act(()=>trigger.focus());
 expect(document.querySelector('[role=tooltip]').textContent).toContain('3등급');
 click(trigger);
 expect(document.querySelector('[role=tooltip]')).toBeNull();
 const dialog=document.querySelector('dialog');
 dialog.close=jest.fn(()=>dialog.removeAttribute('open'));
 expect(dialog.textContent).toContain(spell.description);
 expect(dialog.querySelector('a').href).toBe(spell.source);
 expect(dialog.querySelector('a').dataset.wowhead).toBe('ignore');
 act(()=>dialog.dispatchEvent(new Event('cancel',{bubbles:true,cancelable:true})));
 expect(dialog.close).toHaveBeenCalledTimes(1);
 expect(document.querySelector('dialog')).toBeNull();
 expect(document.activeElement).toBe(trigger);
 expect(document.querySelector('[role=tooltip]')).toBeNull();
 act(()=>trigger.dispatchEvent(new MouseEvent('mouseover',{bubbles:true})));
 expect(document.querySelector('[role=tooltip]')).toBeNull();
 act(()=>trigger.dispatchEvent(new MouseEvent('mouseout',{bubbles:true,relatedTarget:document.body})));
 act(()=>trigger.dispatchEvent(new MouseEvent('mouseover',{bubbles:true})));
 expect(document.querySelector('[role=tooltip]')).not.toBeNull();
});

test('본문은 긴 주문 이름부터 연결하고 아이콘 오류에도 이름을 보존한다',()=>{
 const known=[{...talents.classes.warrior[0],name:'방패'},{...talents.classes.warrior[1],name:'방패 막기'}];
 act(()=>root.render(<ForeverText spells={known}>방패 막기 다음 방패</ForeverText>));
 expect([...container.querySelectorAll('button')].map(b=>b.textContent)).toEqual(['방패 막기','방패']);
 act(()=>container.querySelector('img').dispatchEvent(new Event('error')));
 expect(container.querySelector('.fv-icon-fallback')).not.toBeNull();
 expect(container.textContent).toContain('방패 막기');
});

test('지도와 장소 목록은 같은 선택을 공유하고 그림 오류에도 접근 설명을 남긴다',()=>{
 act(()=>root.render(<ForeverMap config={{kind:'dungeon'}}/>));
 expect(container.querySelectorAll('.fv-place-list button')).toHaveLength(9);
 click(container.querySelector('[aria-label="달라란 지도에서 선택"]'));
 expect(container.querySelector('aside h3').textContent).toBe('달라란');
 expect(container.querySelector('.fv-place-list [aria-pressed=true]').textContent).toContain('달라란');
 click(container.querySelector('.fv-place-list button'));
 expect(container.querySelector('aside').textContent).toContain('정확한 입구 확인 중');
 act(()=>container.querySelector('image').dispatchEvent(new Event('error')));
 expect(container.textContent).toContain('지도를 불러오지 못했습니다');
 expect(container.querySelectorAll('.fv-place-list button')).toHaveLength(9);
});

test('전문화 27개·종족 10개 모두 자료와 연결되고 미확인 주문을 공격 순서로 단정하지 않는다',()=>{
 const known=new Map([...Object.values(spells.classes).flat(),...Object.values(talents.classes).flat()].map(s=>[s.id,s]));
 expect(Object.keys(visuals.combat)).toHaveLength(27);
 for(const combat of Object.values(visuals.combat)) {
  expect(combat.principle).toHaveLength(3);expect(combat.flows).toHaveLength(3);
  for(const s of [...combat.principle,...combat.flows.flatMap(f=>f.steps)]) if(s.id) expect(known.get(s.id)?.verified).toBe(true);
 }
 expect(Object.keys(visuals.routes)).toHaveLength(10);
 for(const race of Object.keys(visuals.routes)) expect(mapPlaces({race}).every(Boolean)).toBe(true);
 expect(visuals.places.filter(p=>p.kind==='raid')).toHaveLength(3);
 expect(visuals.places.filter(p=>p.kind==='zone')).toHaveLength(4);
});
