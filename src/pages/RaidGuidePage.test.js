import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RaidGuidePage from './RaidGuidePage.js';
import raidGuide from '../data/raidGuide.json';
import kbSkills from '../data/kb-skills.json';

let container;
let root;

function mount(path = '/raid') {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(
    <MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/raid" element={<RaidGuidePage />} />
        <Route path="/raid/:episodeId" element={<RaidGuidePage />} />
      </Routes>
    </MemoryRouter>
  ));
}

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

const allBosses = raidGuide.episodes.flatMap(episode => episode.bosses);
const allText = JSON.stringify(raidGuide);

test('첫 편(키식스)을 기본으로 보여 주고 다섯 편 탭과 네임드 목차를 그린다', () => {
  mount();
  const tabs = container.querySelectorAll('nav[aria-label="레이드 편 선택"] a');
  expect(tabs).toHaveLength(5);
  expect(Array.from(tabs).map(tab => tab.getAttribute('href'))).toEqual(raidGuide.episodes.map(episode => `/raid/${episode.id}`));
  expect(container.querySelector('nav[aria-label="레이드 편 선택"] a[aria-current="page"]').textContent).toContain('키식스');
  expect(container.querySelector('#kithix')).not.toBeNull();
  expect(container.querySelector('nav[aria-label="이 편의 네임드"] a[href="#kithix"]')).not.toBeNull();
  for (const phase of allBosses[0].phases) expect(container.querySelector(`#kithix-${phase.id}`)).not.toBeNull();
  expect(container.querySelector('a[href="/guide"]')).not.toBeNull();
  expect(container.textContent).toContain('쫄은 따로 · 구슬은 먼저');
});

test('주소의 편 이름으로 다른 편을 열고 네임드 여섯 곳을 모두 그린다', () => {
  mount('/raid/venomous-1-6');
  const episode = raidGuide.episodes.find(item => item.id === 'venomous-1-6');
  expect(episode.bosses).toHaveLength(6);
  for (const boss of episode.bosses) {
    expect(container.querySelector(`#${boss.id}`)).not.toBeNull();
    expect(container.querySelector(`[data-tips="${boss.id}"] li`)).not.toBeNull();
    expect(container.querySelectorAll(`[data-tips="${boss.id}"] > li`)).toHaveLength(boss.tips.length);
  }
  expect(container.querySelector('#kithix')).toBeNull();
  mount('/raid/없는편');
  expect(container.querySelector('#kithix')).not.toBeNull();
});

test('스토리보드 팁 108개에 실전 글 공통 팁 20개를 더한 128개와 단계 69개가 모두 들어 있고 네임드마다 확인 항목이 셋이다', () => {
  expect(allBosses).toHaveLength(10);
  expect(allBosses.reduce((sum, boss) => sum + boss.tips.length, 0)).toBe(128);
  expect(allBosses.reduce((sum, boss) => sum + boss.phases.reduce((n, phase) => n + phase.steps.length, 0), 0)).toBe(69);
  for (const boss of allBosses) {
    expect(boss.checks).toHaveLength(3);
    expect(boss.phases.length).toBeGreaterThan(0);
    for (const tip of boss.tips) if (tip.source != null) expect(raidGuide.sources[tip.source]).toBeDefined();
    for (const key of boss.sources) expect(raidGuide.sources[key]).toBeDefined();
  }
  expect(new Set(allBosses.map(boss => boss.id)).size).toBe(10);
});

test('가이드 용어를 지킨다: 네임드·쫄만 쓰고 우두머리·졸개·보스·로테이션은 쓰지 않는다', () => {
  for (const banned of ['우두머리', '졸개', '보스', '로테이션', '오프너', '신화+', '버스트', '문서']) {
    expect(allText).not.toContain(banned);
  }
  expect(allText).toContain('네임드');
  expect(allText).toContain('쫄');
});

test('님리사 얼음 구슬은 무적기 예시를 아이콘 툴팁 링크로 그리고 9개를 나눠 처리한다고 적는다', () => {
  mount('/raid/nymrissa');
  const section = container.querySelector('#nymrissa');
  for (const id of ['31224', '186265', '642']) {
    const term = section.querySelector(`a[data-term-id="${id}"]`);
    expect(term).not.toBeNull();
    expect(term.getAttribute('href')).toBe(`https://ko.wowhead.com/spell=${id}`);
    expect(term.getAttribute('data-wowhead')).toBe(`spell=${id}&domain=ko`);
    expect(term.querySelector('img')).not.toBeNull();
  }
  const orbStep = Array.from(section.querySelectorAll('li[data-kind]')).find(step => step.textContent.includes('얼음 구슬 9개 처리'));
  // 2026-10-23 사용자 정리: 9개를 어떻게든 처리하면 되고 무적기는 중첩이 쌓이지 않아 쉬워질 뿐이다. 얼음 방패 설명은 뺀다.
  expect(orbStep.querySelector('a[data-term-id="1260837"]')).not.toBeNull();
  expect(orbStep.textContent).toContain('중첩이 쌓이지 않아');
  expect(orbStep.textContent).not.toContain('얼음 방패');
  expect(section.textContent).not.toContain('무적조');
  // 2026-10-23 사용자 정정: 죽음의 기사는 대마법 보호막(48707)을 켜면 중첩이 쌓이지 않는다. 9개 = 대상자 3명 × 3개.
  expect(orbStep.querySelector('a[data-term-id="48707"]')).not.toBeNull();
  expect(orbStep.textContent).toContain('대상자 3명이 3개씩');
  expect(section.textContent).not.toContain('단단한 사람');
});

test('똬리의 제단은 공식 번호를 확인한 기술 9개를 툴팁 칩으로 보이고 본문에서도 긴 이름을 먼저 잡는다', () => {
  mount('/raid/coiled-altar');
  const chips = container.querySelectorAll('[data-spell-id]');
  expect(chips).toHaveLength(9);
  expect(Array.from(chips).map(chip => chip.getAttribute('data-spell-id'))).toEqual(raidGuide.spells.filter(spell => spell.boss === 'coiled-altar').map(spell => String(spell.id)));
  for (const chip of chips) {
    expect(chip.getAttribute('data-wowhead')).toMatch(/^spell=\d+&domain=ko$/);
    expect(chip.querySelector('img').getAttribute('src')).toMatch(/\/icons\/medium\/[a-z0-9_]+\.jpg$/);
  }
  const altar = container.querySelector('#coiled-altar');
  expect(altar.querySelector('a[data-term-id="1286620"]').textContent).toBe('영혼 절단');
  expect(altar.querySelector('a[data-term-id="1299680"]').textContent).toBe('절단');
  expect(altar.querySelector('a[data-term-id="1285643"]')).not.toBeNull();
  expect(altar.querySelector('a[data-term-id="1310882"]')).not.toBeNull();
  expect(altar.querySelector('a[data-term-id="1309987"]')).not.toBeNull();
  const grarlLinks = Array.from(altar.querySelectorAll('a[href^="https://www.youtube.com/watch?v=HWLx3GB_m2I&t="]'));
  expect(grarlLinks.length).toBe(raidGuide.episodes.find(e => e.id === 'coiled-altar').bosses[0].tips.filter(tip => tip.grarlSecond != null).length);
  expect(grarlLinks[0].textContent).toContain('그랄 설명회 5:45');
});

test('본문의 직업 스킬은 KB에 있는 이름·번호와 같고, 울라텍 송곳니는 1+5 안이다', () => {
  const kbByName = new Map(Object.values(kbSkills.skills).map(skill => [skill.koreanName || skill.name, String(skill.id)]));
  for (const skill of raidGuide.skills) expect(kbByName.get(skill.name)).toBe(String(skill.id));
  mount('/raid/ulatek');
  const fangs = Array.from(container.querySelectorAll('#ulatek li[data-kind]')).find(step => step.textContent.includes('송곳니'));
  expect(fangs.getAttribute('data-kind')).toBe('선택 택틱');
  expect(fangs.textContent).toContain('한 명이 먼저 끊고');
  expect(fangs.textContent).toContain('나머지 다섯');
  expect(container.querySelector('[data-choice="송곳니 해제"]').textContent).toContain('MATE');
  // 2026-10-23 갈리는 택틱은 참고로만 보게 안내하고, 이 글이 고르지 않은 갈림은 '한 안 / 다른 안'으로 보인다.
  expect(container.querySelector('#ulatek [data-choices-lead]').textContent).toContain('참고로만');
  const open = container.querySelector('[data-choice="남쪽 방 알 순서"]');
  expect(open.getAttribute('data-open')).toBe('true');
  expect(open.querySelector('dt').textContent).toBe('한 안');
  expect(container.querySelector('[data-choice="송곳니 해제"] dt').textContent).toBe('이 글');
});

test('스토리보드 배치도를 행동 옆에 붙이고 네임드 스프라이트를 보여 주며, 누르면 큰 그림으로 연다', () => {
  mount('/raid/coiled-altar');
  const boss = raidGuide.episodes.find(item => item.id === 'coiled-altar').bosses[0];
  const steps = boss.phases.flatMap(phase => phase.steps);
  const figured = container.querySelectorAll('li[data-figure] figure img');
  expect(figured).toHaveLength(steps.filter(step => step.figure).length);
  expect(figured[0].getAttribute('src')).toBe(`/images/raid/plan/${steps[0].figure.plan}-960.webp`);
  expect(container.querySelector(`figure[data-plan="${boss.figure.plan}"]`)).not.toBeNull();
  expect(boss.recap).toBeUndefined();
  expect(container.textContent).not.toContain('한 장 복습');
  expect(container.querySelectorAll('#coiled-altar img[src^="/images/raid/sprites/"]')).toHaveLength(boss.sprites.length);
  act(() => container.querySelector('li[data-figure] figure button').click());
  const dialog = container.querySelector('[role="dialog"]');
  expect(dialog.querySelector('img').getAttribute('src')).toBe(`/images/raid/plan/${steps[0].figure.plan}-1600.webp`);
  act(() => dialog.querySelector('button[aria-label="닫기"]').click());
  expect(container.querySelector('[role="dialog"]')).toBeNull();
});

test('이름표 바로 뒤 조사는 이름표와 한 덩어리로 묶어 조사만 다음 줄로 떨어지지 않게 한다', () => {
  mount('/raid/coiled-altar');
  const glued = Array.from(container.querySelectorAll('[data-term-piece]')).map(piece => piece.textContent);
  expect(glued).toContain('영혼결속으로');
  expect(glued.every(text => !/^\s|\s$/.test(text))).toBe(true);
});
