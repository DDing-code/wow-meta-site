// 12.1.5 직업 변경 수집 → changes.json (조사용 임시 스크립트, 사이트 코드 아님)
const fs = require('fs');
const path = require('path');
const { section, tree, flat } = require('./_parse.cjs');
const SITE = path.resolve(__dirname, '..', '..');
const skills = require(path.join(SITE, 'src/data/kb-skills.json')).skills;
const MS_DIR = path.join(SITE, 'src/data/manuscripts');
const manuscripts = Object.fromEntries(fs.readdirSync(MS_DIR).filter(f => f.endsWith('.js')).map(f => [f.replace(/\.js$/, ''), fs.readFileSync(path.join(MS_DIR, f), 'utf8')]));

const CLASS = { 'DEMON HUNTER': ['DemonHunter', 'demonhunter'], DRUID: ['Druid', 'druid'], EVOKER: ['Evoker', 'evoker'], HUNTER: ['Hunter', 'hunter'], MAGE: ['Mage', 'mage'], MONK: ['Monk', 'monk'], PRIEST: ['Priest', 'priest'], ROGUE: ['Rogue', 'rogue'], SHAMAN: ['Shaman', 'shaman'], WARRIOR: ['Warrior', 'warrior'] };
const SPEC_GUIDE = { Devourer: 'devourer', Restoration: 'restoration', Augmentation: 'augmentation', Preservation: 'preservation', Marksmanship: 'marksmanship', Survival: 'survival', Arcane: 'arcane', Frost: 'frost', Discipline: 'discipline', Holy: 'holy', Assassination: 'assassination', Outlaw: 'outlaw', Subtlety: 'subtlety', Enhancement: 'enhancement', Protection: 'protection', Guardian: 'guardian' };
const SPEC_KO = { Guardian: '수호', Restoration: '회복' };

// 노트 항목 주석: 인덱스(_parse.cjs 평탄화 순서) → 종류, 언급 스킬 [영문, 한국어]
const NOTE_ITEMS = {
  3: ['메커니즘', [['Collapsing Star', '붕괴하는 별']]],
  4: ['메커니즘', [['Collapsing Star', '붕괴하는 별']]],
  5: ['메커니즘', [['Collapsing Star', '붕괴하는 별']]],
  8: ['수치', [['Soulforged Blades', '영혼벼림 칼날'], ['Hungering Slash', '굶주린 베기'], ['Voidblade', '공허칼날']]],
  9: ['수치', [['Voidpurge', '공허정화'], ['Void Ray', '공허 광선'], ['Void Metamorphosis', '공허 탈태']]],
  10: ['메커니즘', [['The Hunt', '사냥'], ['Eradicate', '박멸']]],
  14: ['메커니즘', [['Demonic Intensity', '악마의 격화'], ['Collapsing Star', '붕괴하는 별'], ['The Hunt', '사냥']]],
  15: ['수치', [['Demonic Intensity', '악마의 격화'], ['The Hunt', '사냥']]],
  16: ['메커니즘', [['Violent Transformation', '격렬한 변신'], ['Soul Immolation', '영혼 제물']]],
  17: ['메커니즘', [['Violent Transformation', '격렬한 변신'], ['The Hunt', '사냥']]],
  18: ['메커니즘', [['Violent Transformation', '격렬한 변신'], ['The Hunt', '사냥'], ['Soul Immolation', '영혼 제물']]],
  19: ['수치', [['Monster Rising', '괴물의 각성']]],
  20: ['수치', [['Monster Rising', '괴물의 각성'], ['Collapsing Star', '붕괴하는 별']]],
  24: ['메커니즘', [["Nature's Bounty", '자연의 선물'], ['Regrowth', '재생'], ['Rejuvenation', '회복']]],
  28: ['메커니즘', [['Temporality', '시간성'], ['Mastery: Timewalker', '특화: 시간여행단']]],
  29: ['메커니즘', [['Temporal Burst', '시간의 폭발'], ['Mastery: Timewalker', '특화: 시간여행단']]],
  31: ['수치', [['Melt Armor', '방어구 녹이기']]],
  33: ['수치', [["Merithra's Blessing", '메리스라의 축복']]],
  34: ['메커니즘', [['Consume Flame', '화염 흡수']]],
  36: ['버그 수정', [['Fire Breath', '불의 숨결'], ['Double-time', '시시각각'], ["Life-Giver's Flame", '생명을 베푸는 자의 불꽃']]],
  37: ['버그 수정', [['Afterimage', '잔상'], ['Deep Breath', '깊은 숨결'], ['Living Flame', '살아있는 불꽃']]],
  40: ['수치', [['Consume Flame', '화염 흡수']]],
  44: ['신규', [['Blood Fletching', '피의 깃'], ['Aimed Shot', '조준 사격'], ['Master Marksman', '사격의 명수']]],
  45: ['버그 수정', [['Explosive Shot', '폭발 사격']]],
  46: ['삭제', [['Unload', '쏟아내기']]],
  48: ['버그 수정', [['Umbral Reach', '암영의 영역'], ['Trick Shots', '교묘한 사격'], ['Bleak Powder', '황폐의 화약']]],
  50: ['버그 수정', [['Strike as One', '한마음 한뜻으로'], ['Raptor Swipe', '랩터의 휩쓸기'], ['Aspect of the Eagle', '독수리의 상']]],
  51: ['버그 수정', [['Raptor Swipe', '랩터의 휩쓸기'], ['Aspect of the Eagle', '독수리의 상']]],
  54: ['시각 효과', []],
  56: ['버그 수정', [['Splitting Ice', '갈라지는 얼음'], ['Frostbolt', '얼음 화살']]],
  57: ['버그 수정', [['Frostfire Bolt', '얼음불꽃 화살'], ['Splitting Ice', '갈라지는 얼음'], ['Frostbolt', '얼음 화살']]],
  58: ['버그 수정', [['Splitting Ice', '갈라지는 얼음'], ['Frostbolt', '얼음 화살']]],
  59: ['버그 수정', [['Shatter', '산산조각'], ['Ice Lance', '얼음창'], ['Fingers of Frost', '서리의 손가락'], ['Thermal Void', '열기 동공']]],
  60: ['버그 수정', [['Crystalline Refraction', '결정화된 굴절'], ['Ray of Frost', '서리 광선'], ['Fingers of Frost', '서리의 손가락']]],
  62: ['버그 수정', [['Frostfire Empowerment', '서리불꽃 강화'], ['Frostfire Bolt', '얼음불꽃 화살'], ['Splitting Ice', '갈라지는 얼음']]],
  63: ['시각 효과', [['Frostfire Infusion', '서리불꽃 주입']]],
  65: ['시각 효과', [['Splinterstorm', '쇄편폭풍']]],
  66: ['메커니즘', [['Splinterstorm', '쇄편폭풍']]],
  68: ['버그 수정', [['Transcendence: Transfer', '해탈: 전환'], ['Transcendence: Linked Spirits', '해탈: 영혼 연결']]],
  71: ['수치', [['Master the Darkness', '어둠 지배']]],
  73: ['메커니즘', [['Holy Celerity', '신성한 기민함'], ['Ultimate Serenity', '궁극의 평온']]],
  76: ['시각 효과', [['Shiv', '독칼']]],
  78: ['시각 효과', [['Mutilate', '절단']]],
  79: ['시각 효과', [['Crimson Tempest', '혈폭풍']]],
  81: ['수치', [['Deft Maneuvers', '날렵한 몸놀림'], ['Blade Flurry', '폭풍의 칼날']]],
  84: ['메커니즘', [['Secret Technique', '은밀한 기술'], ['Shadowed Finishers', '어둠에 물든 마무리 일격'], ['Shadow Clone', '그림자 복제'], ['Shadow Blades', '어둠의 칼날'], ["Goremaw's Bite", '피아귀의 이빨'], ['Lingering Shadow', '머무는 그림자']]],
  86: ['시각 효과', [['Shadow Blades', '어둠의 칼날']]],
  87: ['수치', []],
  91: ['버그 수정', [['Static Accumulation', '전하 축적'], ['Maelstrom Weapon', '소용돌이치는 무기'], ['Ascendance', '승천'], ['Doom Winds', '파멸의 바람']]],
  93: ['메커니즘', [['Riptide', '성난 해일'], ['Swelling Tides', '너울대는 물결']]],
  94: ['버그 수정', [["Nature's Swiftness", '자연의 신속함'], ['Ancestral Swiftness', '선조의 신속함'], ['Healing Rain', '치유의 비']]],
  97: ['수치', [['Execute', '마무리 일격']]],
  100: ['메커니즘', [['Practiced Strikes', '숙련된 공격'], ['Execute', '마무리 일격'], ['Revenge', '복수']]],
};
// 하위 항목을 부모 문장에 합치는 노트 항목(개발자 한마디 제외)
const MERGE_CHILDREN = new Set([5]);

const OTHER = [
  // PvP 절
  { class: 'EVOKER', specEn: 'Preservation', specKo: '보존', pvpOnly: true, source: 'notes', date: '2026-10-13',
    en: "Merithra's Blessing is now considered an Arcane spell, and can be cast when locked out of Nature.",
    ko: '메리스라의 축복이 이제 비전 주문으로 간주되어, 자연 주문을 사용할 수 없는 상황에서도 시전할 수 있습니다.',
    kind: '메커니즘', names: [["Merithra's Blessing", '메리스라의 축복']] },
  // 12.1.5 핫픽스 문서(24307310) — 영문 October 14, 한국어 표기 10월 15일
  { class: 'DRUID', specEn: 'Guardian', specKo: '수호', source: 'hotfix', date: '2026-10-14',
    en: 'Fixed an issue causing Rebirth in Bear Form to have an incorrect mana cost.',
    ko: '곰 변신 상태에서 환생의 마나 소모량이 비정상적으로 적용되던 문제를 수정하였습니다.',
    kind: '버그 수정', names: [['Rebirth', '환생'], ['Bear Form', '곰 변신']] },
  { class: 'DRUID', specEn: 'Guardian', specKo: '수호', source: 'hotfix', date: '2026-10-14',
    en: 'Fixed an issue preventing the Bear Form version of Heart of the Wild from being cast.',
    ko: '곰 변신 버전의 야생의 정수를 시전할 수 없던 문제를 수정하였습니다.',
    kind: '버그 수정', names: [['Heart of the Wild', '야생의 정수'], ['Bear Form', '곰 변신']] },
  { class: 'DRUID', specEn: 'Guardian', specKo: '수호', source: 'hotfix', date: '2026-10-14',
    en: 'Fixed an issue causing Persistence to grant an incorrect amount of armor.',
    ko: '끈기가 비정상적인 방어도를 부여하던 문제를 수정하였습니다.',
    kind: '버그 수정', names: [['Persistence', '끈기']] },
  { class: 'DRUID', specEn: 'Restoration', specKo: '회복', source: 'hotfix', date: '2026-10-14',
    en: "Fixed an issue where Nature's Bounty could cause Abundance to fall off the Druid early.",
    ko: '자연의 선물이 드루이드의 풍요를 일찍 감쇠시킬 수 있던 문제를 수정하였습니다.',
    kind: '버그 수정', names: [["Nature's Bounty", '자연의 선물'], ['Abundance', '풍요']] },
];

const isDev = t => /^​?Developers[’']? notes|^개발자의 한마디/.test(t.trim());
const norm = s => String(s || '').replace(/[\s'’:·\-]/g, '').toLowerCase();

function findSpells(cls, specEn, en, ko) {
  const hits = [];
  for (const id in skills) {
    const s = skills[id];
    if (s.class !== cls) continue;
    const names = [s.koreanName, s.name].map(norm);
    const enOk = norm(s.englishName) === norm(en);
    const koOk = names.includes(norm(ko));
    if (!enOk && !koOk) continue;
    if (s.englishName && !enOk) continue; // 영문 이름이 있으면 영문도 일치해야 함(독칼/독 칼 같은 오매칭 방지)
    const specs = s.specs || [s.spec];
    hits.push({ id, specMatch: !specEn || specs.includes(specEn), ko: s.koreanName || s.name, en: s.englishName, enOk, koOk });
  }
  const spec = hits.filter(h => h.specMatch);
  return spec.length ? spec : hits;
}

const HANGUL = '[\\uac00-\\ud7a3]';
const PARTICLE = '(?:으로|로|은|는|이|가|을|를|의|와|과|도|에|만|까지|부터|처럼|보다)?';
function guideHits(ids, namesKo, guidePrefix) {
  const out = {};
  for (const [gid, txt] of Object.entries(manuscripts)) {
    for (const id of ids) {
      const re = new RegExp(`(?:['"]|spell=)${id}(?![0-9A-Za-z])`);
      if (re.test(txt)) (out[gid] = out[gid] || new Set()).add('id:' + id);
    }
    if (!gid.startsWith(guidePrefix + '-')) continue;
    for (const n of namesKo) {
      if (!n || n.length < 2) continue;
      const esc = n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(`(?<!${HANGUL})${esc}${PARTICLE}(?!${HANGUL})`);
      if (re.test(txt)) (out[gid] = out[gid] || new Set()).add('name:' + n);
    }
  }
  return out;
}

const en = flat(tree(section(path.join(__dirname, 'notes-en.txt'), '## CLASSES')), [], []);
const ko = flat(tree(section(path.join(__dirname, 'notes-ko.txt'), '## 직업')), [], []);
const raw = [];
for (const [idx, [kind, names]] of Object.entries(NOTE_ITEMS)) {
  const i = Number(idx), e = en[i], k = ko[i];
  const clsKey = e.path[0] || e.text;
  const specEn = e.path[1] && SPEC_GUIDE[e.path[1]] ? e.path[1] : null;
  const specKo = specEn ? k.path[1] : null;
  const hero = e.path[2] ? { en: e.path[2], ko: k.path[2] } : null;
  let enText = e.text, koText = k.text;
  if (MERGE_CHILDREN.has(i)) {
    enText += ' / ' + e.node.children.map(c => c.text).join(' / ');
    koText += ' / ' + k.node.children.map(c => c.text).join(' / ');
  }
  // 바로 아래 개발자 한마디는 note로 붙인다
  const devEn = e.node.children.filter(c => isDev(c.text)).map(c => c.text.trim());
  const devKo = k.node.children.filter(c => isDev(c.text)).map(c => c.text.trim());
  raw.push({ order: i, class: clsKey, specEn, specKo, hero, pvpOnly: false, source: 'notes', date: '2026-10-13', en: enText, ko: koText, kind, names, devNoteEn: devEn[0], devNoteKo: devKo[0] });
}
OTHER.forEach((o, j) => raw.push({ order: 1000 + j, hero: null, pvpOnly: false, ...o }));

const result = raw.sort((a, b) => a.order - b.order).map(r => {
  const [cls, prefix] = CLASS[r.class];
  const spellIds = [], skillNamesKo = [], unmatched = [];
  for (const [nEn, nKo] of r.names) {
    const hits = findSpells(cls, r.specEn, nEn, nKo);
    if (!hits.length) { unmatched.push(`${nKo} (${nEn})`); continue; }
    for (const h of hits) { if (!spellIds.includes(h.id)) spellIds.push(h.id); }
    if (!skillNamesKo.includes(nKo)) skillNamesKo.push(nKo);
  }
  const prefixGuides = r.specEn ? `${prefix}-${SPEC_GUIDE[r.specEn]}` : prefix;
  const hits = guideHits(spellIds, r.names.map(n => n[1]), prefix);
  let guideIds = Object.keys(hits).sort();
  // 전문화 항목은 같은 전문화 가이드 우선, 다른 가이드는 참고로 분리
  const primary = guideIds.filter(g => g.startsWith(prefixGuides));
  const others = guideIds.filter(g => !g.startsWith(prefixGuides) && [...hits[g]].some(x => x.startsWith('id:')));
  if (r.specEn && !primary.includes(prefixGuides) && manuscripts[prefixGuides]) primary.unshift(prefixGuides);
  const item = {
    class: cls,
    spec: r.specEn ? { en: r.specEn, ko: r.specKo } : 'all',
    heroTree: r.hero || undefined,
    pvpOnly: r.pvpOnly,
    source: r.source,
    date: r.date,
    en: r.en,
    ko: r.ko || '',
    spellIds,
    skillNamesKo,
    guideIds: r.specEn ? primary : guideIds,
    otherGuideHits: r.specEn && others.length ? others : undefined,
    guideMatchBasis: Object.fromEntries(Object.entries(hits).map(([g, s]) => [g, [...s]])),
    unmatchedInKb: unmatched.length ? unmatched : undefined,
    kind: r.kind,
    devNoteEn: r.devNoteEn || undefined,
    devNoteKo: r.devNoteKo || undefined,
  };
  if (r.specEn && !Object.keys(hits).includes(prefixGuides)) item.guideNote = `${prefixGuides} 원고에 해당 ID·이름 언급 없음(전문화 가이드로만 연결)`;
  return item;
});

fs.writeFileSync(path.join(__dirname, 'changes.json'), JSON.stringify(result, null, 2) + '\n');
console.log('items', result.length, 'pve', result.filter(r => !r.pvpOnly).length, 'notes', result.filter(r => r.source === 'notes').length);
for (const r of result) console.log(`[${r.kind}] ${r.class}/${r.spec === 'all' ? 'all' : r.spec.en} ids=${r.spellIds.join(',')} guides=${r.guideIds.join(',')} other=${(r.otherGuideHits || []).join(',')} miss=${(r.unmatchedInKb || []).join('; ')} | ${r.en.slice(0, 60)}`);
