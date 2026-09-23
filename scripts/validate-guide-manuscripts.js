#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SITE_ROOT = path.resolve(__dirname, '..');
const REGISTRY_PATH = path.join(SITE_ROOT, 'src', 'data', 'guideRegistry.js');
const MANUSCRIPT_PATH = path.join(SITE_ROOT, 'src', 'data', 'guideManuscripts.js');
const SKILLS_PATH = path.join(SITE_ROOT, 'src', 'data', 'kb-skills.json');
const EXPECTED_PATCH = process.env.WOWMETA_EXPECTED_PATCH || '12.0.5';
const EXPECTED_GUIDE_COUNT = Number(process.env.WOWMETA_EXPECTED_GUIDE_COUNT || 40);
const GUIDE_PATCH_OVERRIDES = new Map([
  ['deathknight-blood', '12.1'],
  ['deathknight-frost', '12.1'],
  ['deathknight-unholy', '12.1'],
  ['demonhunter-havoc', '12.1'],
  ['demonhunter-vengeance', '12.1'],
  ['druid-guardian', '12.1'],
  ['druid-feral', '12.1'],
  ['evoker-augmentation', '12.1'],
  ['hunter-beastmastery', '12.1'],
  ['hunter-marksmanship', '12.1'],
  ['hunter-survival', '12.1'],
  ['mage-arcane', '12.1'],
  ['mage-fire', '12.1'],
  ['mage-frost', '12.1'],
  ['monk-brewmaster', '12.1'],
  ['paladin-protection', '12.1'],
  ['paladin-retribution', '12.1'],
  ['priest-discipline', '12.1'],
  ['priest-shadow', '12.1'],
  ['rogue-assassination', '12.1'],
  ['rogue-outlaw', '12.1'],
  ['rogue-subtlety', '12.1'],
  ['warlock-affliction', '12.1'],
  ['warlock-demonology', '12.1'],
  ['warlock-destruction', '12.1'],
  ['demonhunter-devourer', '12.1'],
  ['priest-holy', '12.1'],
  ['druid-restoration', '12.1'],
  ['paladin-holy', '12.1'],
  ['evoker-preservation', '12.1'],
  ['monk-mistweaver', '12.1'],
  ['monk-windwalker', '12.1'],
  ['shaman-elemental', '12.1'],
  ['evoker-devastation', '12.1'],
  ['druid-balance', '12.1'],
]);

const MINIMUMS = {
  sources: 10,
  openerSteps: 6,
  priorityItems: 6,
  evidenceItems: 5,
  blockItems: 10,
  tipItems: 8,
  tipCharacters: 38,
  tipTotalCharacters: 520,
  heroBranches: 2,
  heroBranchSummaryCharacters: 80,
  heroBranchBullets: 4,
  heroBranchBulletCharacters: 32,
  heroBranchSimilarityMax: 0.55,
  manuscriptCharacters: 18000,
};

const TRUST_TIERS = new Set(['S', 'A', 'B', 'C']);
const NON_ACTION_CHART_KEYS = new Set([
  'demonhunter-devourer:1246160',
  'deathknight-frost:51128',
  'deathknight-frost:59052',
  'deathknight-frost:455993',
  'deathknight-frost:207057',
  'deathknight-frost:51714',
  'druid-guardian:203964',
  'druid-guardian:424058',
  'druid-guardian:424113',
  'druid-guardian:429523',
  'druid-guardian:429539',
  'druid-guardian:441583',
  'druid-guardian:135288',
  'druid-guardian:238049',
  'druid-guardian:371905',
  'druid-feral:391881',
  'druid-feral:441583',
  'druid-balance:393940',
  'druid-balance:450356',
  'evoker-devastation:359618',
  'evoker-devastation:436335',
  'evoker-devastation:434300',
  'evoker-preservation:1256577',
  'evoker-preservation:396187',
  'monk-brewmaster:115069',
  'monk-brewmaster:450508',
  'monk-brewmaster:450615',
  'rogue-subtlety:1268932',
  'priest-holy:114255',
  'priest-holy:390992',
  'priest-holy:392988',
]);
const OPENER_FLOW_PATTERN = /전투 흐름|피해 대응|진입|풀링|지원 구간|상태 전환/i;
const LIST_LIKE_OPENER_PATTERN = /오프닝 딜사이클|오프닝 순서표|오프닝 목록|아이콘 레일|레일 컴포넌트/i;
const INTERNAL_COPY_PATTERN = /원고|가이드 원고|프로토타입|내부 문서|내부 채널|디스코드 내부|직접 문장|이 문서|문서에서|문서에서는|시각화 배치 기준|이 페이지의 시각화|보조 시각화|차트 배치/i;
const GENERAL_AWKWARD_COPY_PATTERN = /고가치|품질|피해 기여|딜 기여|중심축|판단축|상위 행동|복구축|전환 축|피해 주문 축|유지 축|영웅 특성 축|압축/i;
const PRIEST_AWKWARD_COPY_PATTERN = /고가치|피해 기여|딜 기여|중심축|상위 행동|판단 축|복구축|전환 축|피해 주문 축|유지 축|영웅 특성 축|영웅 특성 분기|예열 압축|품질/i;
const CLASS_AWKWARD_COPY_PATTERNS = [
  [/^druid-/, /고가치|피해 기여|딜 기여|중심축|판단축|품질|영웅 특성 축|쿨다운 압축|소비기 압축|압축합니다/i],
  [/^evoker-/, /고가치|피해 기여|딜 기여|중심축|품질|영웅 특성 축|기본 운용 축|분기 오류|쿨다운 압축|소비기 압축|압축합니다/i],
];
const LOG_SOURCE_PATTERN = /Archon|WCL|Warcraft Logs/i;
const LOG_RAID_SOURCE_PATTERN = /raid|레이드|all-bosses/i;
const LOG_MYTHIC_PLUS_SOURCE_PATTERN = /mythic-plus|쐐기|dungeons|high-keys/i;
const COMMUNITY_SOURCE_PATTERN = /Discord|Dreamgrove|Fel Hammer|Acherus|Death's Advance|Skyhold|Ravenholdt|Earthshrine|Warcraft Priests|Peak of Serenity|Wyrmrest|Ancestral Guidance|Altered Time|Trueshot Lodge|Hammer of Wrath|Method|Questionably Epic|Warlock Discord|LockOneStopShop|공개 서버|공개 경로|디스코드|컴펜디엄/i;
const CLASS_PUBLIC_SOURCE_PATTERN = /Discord|Dreamgrove|Fel Hammer|Acherus|Death's Advance|Skyhold|Ravenholdt|Earthshrine|Warcraft Priests|Peak of Serenity|Wyrmrest|Ancestral Guidance|Altered Time|Trueshot Lodge|Hammer of Wrath|Mage Hub|LockOneStopShop|Warlock Discord|Evoker Discord/i;
const NAMED_CLASS_PUBLIC_SOURCE_PATTERN = /Dreamgrove|Fel Hammer|Acherus|Death's Advance|Skyhold|Ravenholdt|Earthshrine|Warcraft Priests|Peak of Serenity|Wyrmrest|Ancestral Guidance|Altered Time|Trueshot Lodge|Hammer of Wrath|Mage Hub|LockOneStopShop|Warlock Discord|Evoker Discord/i;
const STRONG_COMMUNITY_SOURCE_PATTERN = /theory|theorycraft|SimulationCraft|SimC|author|writer|Method|Mage Hub|LockOneStopShop|Questionably Epic|Warlock Discord|Evoker Discord|Hammer of Wrath|Skyhold 관리자|Ravenholdt.*SimC|Whispyr|Stealthi|Archimtiros|Dutchmagoz|Khaelt|Motoko|Toegrinder|Voulk|Grafe|Joki|Mwahi|Mandl|Panthea|Reholy|Pumps|Tactyks|Meyra|Nate|Bicepspump|Taeznak|Hype|Voodoo|Wordup|Gamz|Drufearr|Daylea|Blueprint|Saeldur|Azortharion|Qenjua|Symex|Sinzhu|Babylonius|J-Funk|Dhaubbs|Tincell|Seliathan|Guy|Weber|작성자|이론공식|컴펜디엄/i;
const WOWHEAD_DISCORD_LIST_PATTERN = /wowhead\.com\/discord-servers/i;
const LOG_EVIDENCE_PATTERN = /표본|parses?|DPS|HPS|쐐기돌|사용률|채택률|추천 .*빌드|상위 50%|상위 5%|최근 14일/i;
const NON_KOREAN_WOWHEAD_GUIDE_PATTERN = /https:\/\/www\.wowhead\.com\/guide\//i;
const HERO_BRANCH_CONTENT_TERMS = [
  'Archon',
  'WCL',
  'raid',
  'all-bosses',
  '\uB85C\uADF8',
  '\uC0C1\uC704',
  '\uC3D0\uAE30',
  '\uB808\uC774\uB4DC',
  '\uACE0\uB2E8',
  '\uBCF4\uC2A4',
  '\uB358\uC804',
  '\uD30C\uD2F0',
  '\uACF5\uB300',
  '\uC804\uD22C',
];
const HERO_BRANCH_ROLE_TERMS = [
  'DPS',
  'HPS',
  'DTPS',
  '\uD53C\uD574',
  '\uB51C',
  '\uCE58\uC720',
  '\uD68C\uBCF5',
  '\uBC29\uC5B4',
  '\uC644\uD654',
  '\uC0DD\uC874',
  '\uC9C0\uC6D0',
  '\uBC84\uD504',
  '\uB9C8\uB098',
  '\uC790\uC6D0',
  '\uC870\uAC01',
  '\uAE30\uB825',
  '\uBD84\uB178',
  '\uB8EC',
  '\uC9D1\uC911',
  '\uAD11\uAE30',
  '\uC18C\uC6A9\uB3CC\uC774',
  '\uC2E0\uC131\uD55C \uD798',
  '\uC5F0\uACC4 \uC810\uC218',
];
const PRACTICAL_TIP_ACTION_PATTERN = /\uBA3C\uC800|\uD655\uC778|\uB9C9|\uBE44\uC6B0|\uB9DE\uCD94|\uC720\uC9C0|\uC4F0|\uB204\uB974|\uBC30\uC815|\uB04A|\uD53C\uD558|\uC900\uBE44|\uBCF4\uC874|\uC608\uC57D|\uBD84\uB9AC|\uBB36|\uC904\uC774|\uD68C\uC218|\uC313|\uC5F4|\uACE0\uC815|\uD655\uBCF4|\uB118\uAE30|\uC815\uB9AC|\uC544\uB07C|\uC18C\uBE44|\uAE30\uB2E4\uB9AC|\uB2F9\uAE30|\uAE54|\uB193\uCE58|\uBCF4\uC138\uC694|\uBD05\uB2C8\uB2E4|\uC9C1\uC804|\uC804\uC5D0|\uD6C4\uC5D0|\uB9D0\uACE0/u;
const PRACTICAL_TIP_CONTEXT_PATTERN = /레이드|쐐기|단일|광역|풀|보스|파티|공대|로그|전투/u;
const HERO_BRANCH_CORE_DIFF_PATTERN = /핵심|차이|달라|중심|기본|흐름|구간|발동|타이밍|유지|소비|생성|배정|묶|강화|전환|먼저|방어|치유|지원|피해|풀|대상|위치|횟수|비율|스킬|주문|버튼|역할|루프|연계|직전|준비|낭비|전에|만들|안전|후속|복귀|사라지/i;
const HERO_BRANCH_CONTENT_PATTERN = /레이드|쐐기|단일|광역|로그|상위|고단|보스|던전|선택률|채택률|표본|기준|해석|풀|파티|공대|구간|타이머|위치|대상|스킬|유지|고른|선택|현재|빌드|가치|운용|상황|전투|피해|흐름|보조|생성|회복|회전|전후|후속|착지|말미|핫픽스|심|역할|비교|기본|리듬|연결|자원/i;
const HERO_BRANCH_WARNING_PATTERN = /주의|실수|낭비|손실|공백|밀리|늦|끊|먼저|무너지|빠지|잃|위험|안 됩니다|실패|과충전|헛|보다|나눕|방치|정당화하지|기대하지|않|못|줄어|떨어|지연|밀어내|확인|아닙니다|로그|타성|비었|약하므로|없으면|없다면|요구|충돌|검수|보존|안정|별도|대상|같이|재시동|직전|뒤집힌/i;
const HERO_BRANCH_CHECK_PATTERN = /로그|확인|점검|체크|검토|지표|횟수|유지율|타이밍|공백|완료율|대상 수|적중|가동률|채널|소모|생성/i;
const HERO_BRANCH_OPENER_PATTERN = /오프닝|전투 시작|전투 전|초반|진입|풀링|첫|시작|예열|쿨기|구간|직전|후속|착지|사전|피해 전/i;
const HERO_BRANCH_PRIORITY_PATTERN = /우선순위|먼저|다음|이후|소비|생성|유지|쿨다운|재사용|지연|횟수|빈도|스택|자원|마무리|치유|회복|방어|완화|지원|버프|정렬|맞추|묶|과치유|공백/i;
const SPECIAL_MANUSCRIPT_PROFILES = new Map([
  ['evoker-augmentation', 'support'],
]);
const ROLE_FLOW_PATTERNS = {
  tanks: {
    opener: /방어|완화|생존|위협|진입|풀링|피해|탱/i,
    priority: /방어|완화|생존|위협|피해|자원|유지|복구|탱/i,
  },
  healers: {
    opener: /치유|회복|피해|예열|복구|보호막|마나|힐/i,
    priority: /치유|회복|피해|복구|보호막|마나|해제|외생기|힐/i,
  },
  support: {
    opener: /지원|버프|강화|파티|예지|칠흑의 힘|영겁의 숨결/i,
    priority: /지원|버프|강화|파티|예지|칠흑의 힘|영겁의 숨결/i,
  },
  melee: {
    opener: /피해|딜|극딜|자원|발동|소비|쿨기|단일|광역|구간/i,
    priority: /피해|딜|극딜|자원|발동|소비|쿨기|단일|광역|우선/i,
  },
  ranged: {
    opener: /피해|딜|극딜|자원|발동|소비|쿨기|단일|광역|구간/i,
    priority: /피해|딜|극딜|자원|발동|소비|쿨기|단일|광역|우선/i,
  },
};
const ROLE_CHART_LANGUAGE_REQUIREMENTS = {
  tanks: {
    terms: [
      '\uBC29\uC5B4',
      '\uC644\uD654',
      '\uC0DD\uC874',
      '\uD0F1\uCEE4',
      '\uC704\uD611',
      '\uD53C\uD574 \uC804',
      '\uC8FD\uC74C',
      '\uAE09\uC0AC',
      '\uBC29\uD328',
    ],
    minHits: 4,
  },
  healers: {
    terms: [
      '\uCE58\uC720',
      '\uD68C\uBCF5',
      '\uBCF5\uAD6C',
      '\uC608\uC5F4',
      '\uB9C8\uB098',
      '\uBCF4\uD638\uB9C9',
      '\uC678\uC0DD\uAE30',
      '\uD574\uC81C',
      '\uD53C\uD574 \uC804',
      '\uAE09\uC0AC',
    ],
    minHits: 4,
  },
  support: {
    terms: [
      '\uC9C0\uC6D0',
      '\uBC84\uD504',
      '\uAC15\uD654',
      '\uD30C\uD2F0',
      '\uC608\uC9C0',
      '\uCE60\uD751\uC758 \uD798',
      '\uC601\uAC81\uC758 \uC228\uACB0',
      '\uC720\uC9C0',
    ],
    minHits: 4,
  },
  melee: {
    terms: [
      '\uB2E8\uC77C',
      '\uAD11\uC5ED',
      '\uADF9\uB51C',
      '\uC790\uC6D0',
      '\uBC1C\uB3D9',
      '\uAD6C\uAC04',
      '\uCFE8\uAE30',
      '\uC18C\uBE44',
      '\uC6B0\uC120\uC21C\uC704',
    ],
    minHits: 4,
  },
  ranged: {
    terms: [
      '\uB2E8\uC77C',
      '\uAD11\uC5ED',
      '\uADF9\uB51C',
      '\uC790\uC6D0',
      '\uBC1C\uB3D9',
      '\uAD6C\uAC04',
      '\uCFE8\uAE30',
      '\uC18C\uBE44',
      '\uC6B0\uC120\uC21C\uC704',
    ],
    minHits: 4,
  },
};
const REQUIRED_HOTFIXES = new Map([
  ['deathknight-blood', {
    date: '2026-06-02',
    keywords: [/춤추는 룬 무기|Dancing Rune Weapon/i, /죽음의 일격|Death Strike/i],
  }],
  ['demonhunter-vengeance', {
    date: '2026-05-(12|26)',
    keywords: [/악마의 수호|Demonic Wards/i, /공허의 약탈자|Void Reaver/i],
  }],
  ['druid-guardian', {
    date: '2026-06-02',
    keywords: [/난타|Thrash/i, /엘룬의 총애|Elune.?s Favored/i],
  }],
  ['hunter-marksmanship', {
    date: '2026-06-02',
    keywords: [/폭발 사격|Explosive Shot/i, /실탄 장전|Lock and Load/i],
  }],
  ['paladin-protection', {
    date: '2026-06-02',
    keywords: [/황혼의 축복|Blessing of Dusk/i, /헌신적인 수호자|Ardent Defender/i],
  }],
  ['shaman-restoration', {
    date: '2026-06-02',
    keywords: [/폭우|Downpour/i, /자연의 신속함|Nature.?s Swiftness/i],
  }],
  ['warlock-demonology', {
    date: '2026-05-26',
    keywords: [/악마의 눈|Diabolic Oculi/i],
  }],
  ['warlock-destruction', {
    date: '2026-05-26',
    keywords: [/악마의 눈|Diabolic Oculi/i],
  }],
  ['warrior-protection', {
    date: '2026-05-12',
    keywords: [/고통 감내|Ignore Pain/i, /불길을 지나|Fight Through Flames/i],
  }],
]);
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function loadSourceModule(filePath, returnExpression) {
  const executable = read(filePath)
    .replace(/\bexport const\b/g, 'const')
    .replace(/\bexport function\b/g, 'function')
    .replace(/export default [^;]+;/g, '');

  return new Function(`${executable}\nreturn ${returnExpression};`)();
}

function combinedSourceText(manuscript) {
  return [
    manuscript.sourceStatus,
    manuscript.sourceNote,
    ...(manuscript.evidence || []),
    ...(manuscript.caveats || []),
    ...(manuscript.sources || []).flatMap(source => [
      source.label,
      source.url,
      source.updated,
      source.note,
    ]),
  ].filter(Boolean).join(' ');
}

function combinedManuscriptText(manuscript) {
  return JSON.stringify(manuscript);
}

function normalizedGuideTerm(value) {
  return String(value || '').replace(/\s+/g, '').trim();
}

function includesAnyTerm(value, terms) {
  return terms.some(term => String(value || '').includes(term));
}

function normalizedComparableText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function comparableTokenSet(value) {
  return new Set(
    String(value || '')
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .filter(token => token.length >= 2)
  );
}

function tokenOverlapRatio(left, right) {
  const leftTokens = comparableTokenSet(left);
  const rightTokens = comparableTokenSet(right);

  if (!leftTokens.size || !rightTokens.size) return 0;

  let shared = 0;
  for (const token of leftTokens) {
    if (rightTokens.has(token)) shared += 1;
  }

  return shared / Math.min(leftTokens.size, rightTokens.size);
}

function combinedBodyBlockText(manuscript) {
  return (manuscript.blocks || [])
    .map(block => [
      block.title,
      ...(block.paragraphs || []),
      ...(block.bullets || []),
    ].filter(Boolean).join(' '))
    .join(' ');
}

function skillName(skill) {
  return skill?.koreanName || skill?.name || skill?.englishName || '';
}

function getExtraSkillMap(manuscript) {
  return new Map((manuscript.extraSkills || []).map(skill => [String(skill.id), skill]));
}

function resolveGuideSkill(id, manuscript, kbSkills) {
  const extraSkills = getExtraSkillMap(manuscript);
  return extraSkills.get(String(id)) || kbSkills[String(id)] || null;
}

function isInactiveGuideSkill(skill) {
  return /legacy|removed|deprecated/i.test(String(skill?.type || ''));
}

function isBranchDefiningAnchor(skill) {
  return /hero|talent|tree|proc|passive/i.test(String(skill?.type || ''));
}

function escapeRegExp(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasInactiveSkillContext(manuscript, skill) {
  const name = skillName(skill);
  if (!name) return false;

  const escapedName = escapeRegExp(name);
  const exclusionWords = '(제거|삭제|구버전|예전|오래된|빠졌|빠진|넣지|금지|폐기|아니|제외|오염|패치 기준|현재 전투 버튼에서 빠졌)';
  const pattern = new RegExp(`(${escapedName}.{0,140}${exclusionWords}|${exclusionWords}.{0,140}${escapedName})`, 'u');

  return pattern.test(combinedManuscriptText(manuscript));
}

function collectActiveSkillRefs(manuscript) {
  const skillRefs = [];

  if (manuscript.graphCenterSkillId) {
    skillRefs.push(['graphCenterSkillId', manuscript.graphCenterSkillId]);
  }

  (manuscript.opener?.steps || []).forEach((step, index) => {
    skillRefs.push([`opener.steps[${index}].skillId`, step.skillId]);
  });

  (manuscript.priority || []).forEach((item, index) => {
    skillRefs.push([`priority[${index}].skillId`, item.skillId]);
  });

  (manuscript.heroBranches || []).forEach((branch, branchIndex) => {
    (branch.skillIds || []).forEach((skillId, skillIndex) => {
      skillRefs.push([`heroBranches[${branchIndex}].skillIds[${skillIndex}]`, skillId]);
    });
    (branch.priority || []).forEach((item, index) => {
      skillRefs.push([`heroBranches[${branchIndex}].priority[${index}].skillId`, item.skillId]);
    });
    for (const mode of ['opener', 'singleTarget', 'aoe']) {
      for (const field of ['steps', 'priority']) {
        (branch[mode]?.[field] || []).forEach((row, index) => {
          skillRefs.push([`heroBranches[${branchIndex}].${mode}.${field}[${index}].skillId`, row.skillId]);
        });
      }
    }
  });

  return skillRefs;
}

function validateSource(spec, source, index) {
  const prefix = `${spec.id}.sources[${index}]`;

  assert(TRUST_TIERS.has(source.tier), `${prefix}: tier must be one of S/A/B/C`);
  assert(source.label, `${prefix}: label is missing`);
  assert(source.url && /^https?:\/\//.test(source.url), `${prefix}: url must be an absolute web URL`);
  assert(source.updated, `${prefix}: updated date/context is missing`);
  assert(source.note && source.note.length >= 30, `${prefix}: note is too thin`);
}

function sourceText(source) {
  return [
    source.label,
    source.url,
    source.updated,
    source.note,
  ].filter(Boolean).join(' ');
}

function hasSource(sources, pattern, predicate = () => true) {
  return sources.some(source => pattern.test(sourceText(source)) && predicate(source));
}

function validateSourceCoverage(spec, manuscript) {
  const prefix = spec.id;
  const sources = manuscript.sources || [];
  const logSources = sources.filter(source => LOG_SOURCE_PATTERN.test(sourceText(source)));
  const communitySources = sources.filter(source => COMMUNITY_SOURCE_PATTERN.test(sourceText(source)));
  const classPublicSources = sources.filter(source => CLASS_PUBLIC_SOURCE_PATTERN.test(sourceText(source)));
  const namedCommunitySources = communitySources.filter(source => !WOWHEAD_DISCORD_LIST_PATTERN.test(String(source.url || '')));
  const strongCommunitySources = communitySources.filter(source => STRONG_COMMUNITY_SOURCE_PATTERN.test(sourceText(source)));

  assert(
    hasSource(sources, /Blizzard|news\.blizzard/i, source => source.tier === 'S'),
    `${prefix}: sources[] must include a Tier S Blizzard source`
  );
  assert(
    hasSource(sources, /Wowhead/i, source => source.tier === 'S' || source.tier === 'A'),
    `${prefix}: sources[] must include a Tier S/A Wowhead source`
  );
  assert(
    hasSource(sources, /Icy Veins/i, source => source.tier === 'A'),
    `${prefix}: sources[] must include a Tier A Icy Veins source`
  );
  assert(
    logSources.some(source => source.tier === 'A'),
    `${prefix}: sources[] must include a Tier A log source such as Archon/WCL`
  );
  assert(
    logSources.some(source => LOG_RAID_SOURCE_PATTERN.test(sourceText(source))),
    `${prefix}: log sources must include raid evidence, not only a generic log mention`
  );
  assert(
    logSources.some(source => LOG_MYTHIC_PLUS_SOURCE_PATTERN.test(sourceText(source))),
    `${prefix}: log sources must include Mythic+ evidence, not only raid logs`
  );
  assert(
    logSources.some(source => LOG_EVIDENCE_PATTERN.test(source.note || '')),
    `${prefix}: log source note must include sample size, usage, output, or key-level evidence`
  );
  assert(
    communitySources.length > 0,
    `${prefix}: sources[] must include a class Discord/public community source`
  );
  assert(
    communitySources.some(source => source.tier === 'B' || source.tier === 'A'),
    `${prefix}: class Discord/public community source must be Tier A/B`
  );
  assert(
    classPublicSources.some(source => source.tier === 'B' || source.tier === 'A'),
    `${prefix}: sources[] must include an explicit class Discord/public server path, not only third-party guides`
  );
  assert(
    classPublicSources.some(source => (source.tier === 'B' || source.tier === 'A') && NAMED_CLASS_PUBLIC_SOURCE_PATTERN.test(sourceText(source))),
    `${prefix}: class Discord/public source must name the actual class community, not only a generic Discord directory`
  );
  assert(
    namedCommunitySources.some(source => source.tier === 'B' || source.tier === 'A'),
    `${prefix}: community evidence must include a named public community/author source, not only the Wowhead Discord server directory`
  );
  assert(
    strongCommunitySources.some(source => source.tier === 'B' || source.tier === 'A'),
    `${prefix}: strengthened source set must include public author/theorycraft/community guide evidence, not just a Discord path`
  );
}

function validateSkillReferences(spec, manuscript, kbSkills) {
  const extraSkills = new Set((manuscript.extraSkills || []).map(skill => String(skill.id)));
  const skillRefs = collectActiveSkillRefs(manuscript);

  skillRefs.forEach(([field, value]) => {
    const id = String(value || '');
    assert(id, `${spec.id}.${field}: skill id is missing`);
    assert(kbSkills[id] || extraSkills.has(id), `${spec.id}.${field}: skill id ${id} is not in KB or extraSkills`);
  });
}

function validateInactiveSkillSafety(spec, manuscript, kbSkills) {
  const activeRefs = collectActiveSkillRefs(manuscript);
  const activeIds = new Set(activeRefs.map(([, value]) => String(value || '')).filter(Boolean));

  activeRefs.forEach(([field, value]) => {
    const id = String(value || '');
    if (!id) return;

    const skill = resolveGuideSkill(id, manuscript, kbSkills);
    assert(
      !isInactiveGuideSkill(skill),
      `${spec.id}.${field}: inactive/removed skill id ${id} (${skillName(skill) || 'unknown'}) cannot be used in the active opener, priority, or hero-talent flow`
    );
  });

  (manuscript.extraSkills || []).forEach((skill, index) => {
    if (!isInactiveGuideSkill(skill)) return;

    const id = String(skill.id || '');
    assert(
      !activeIds.has(id),
      `${spec.id}.extraSkills[${index}]: inactive skill ${skillName(skill) || id} is referenced in the active guide flow`
    );
    assert(
      hasInactiveSkillContext(manuscript, skill),
      `${spec.id}.extraSkills[${index}]: inactive skill ${skillName(skill) || id} must be explained as removed/legacy instead of being left as a current tooltip term`
    );
  });
}

function validatePriorityActionItems(spec, manuscript) {
  (manuscript.opener?.steps || []).forEach((step, index) => {
    const id = String(step.skillId || '');
    const key = `${spec.id}:${id}`;
    assert(
      !NON_ACTION_CHART_KEYS.has(key),
      `${spec.id}.opener.steps[${index}]: skill id ${id} is a passive/proc/talent condition; attach it to a direct spell note instead`
    );
  });

  (manuscript.priority || []).forEach((item, index) => {
    const id = String(item.skillId || '');
    const key = `${spec.id}:${id}`;
    assert(
      !NON_ACTION_CHART_KEYS.has(key),
      `${spec.id}.priority[${index}]: skill id ${id} is a passive/proc/talent condition; attach it to a direct spell note instead`
    );
  });
}

function validateSpecSpecificCurrentPatchRules(spec, manuscript) {
  const prefix = spec.id;
  const text = combinedManuscriptText(manuscript);
  const sourceTextForSpec = combinedSourceText(manuscript);

  assert(
    !GENERAL_AWKWARD_COPY_PATTERN.test(text.replace(/마력 압축/g, '')),
    `${prefix}: contains awkward/internal analysis wording; use player-facing guide terms`
  );

  if (spec.id.startsWith('priest-')) {
    const textWithoutAllowedRapture = text.replace(/어둠의 환희/g, '');

    assert(
      !/환희|Rapture/i.test(textWithoutAllowedRapture),
      `${prefix}: old Priest Rapture/환희 must not appear in current guide copy`
    );
    assert(
      !PRIEST_AWKWARD_COPY_PATTERN.test(text),
      `${prefix}: contains awkward/internal analysis wording; use player-facing guide terms`
    );
  }

  CLASS_AWKWARD_COPY_PATTERNS.forEach(([idPattern, copyPattern]) => {
    if (idPattern.test(spec.id)) {
      assert(
        !copyPattern.test(text),
        `${prefix}: contains awkward/internal analysis wording; use player-facing guide terms`
      );
    }
  });

  if (spec.id === 'druid-restoration') {
    assert(text.includes('상록숲'), `${prefix}: must cover 상록숲/Everbloom Apex talent`);
    assert(
      (manuscript.sources || []).some(source => /상록숲|392167/.test(sourceText(source))),
      `${prefix}: sources[] must include official 상록숲 392167 tooltip evidence`
    );
    assert(
      /숲 수호자.{0,120}(패시브|발동)/.test(text),
      `${prefix}: must frame 숲 수호자 as a passive/proc, not an active opener button`
    );
  }

  const requiredHotfix = REQUIRED_HOTFIXES.get(spec.id);
  // These dated requirements belong to the Season 1 manuscripts only.
  if (requiredHotfix && manuscript.patch === '12.0.5') {
    const hotfixPattern = new RegExp(requiredHotfix.date);
    const hasHotfixSource = (manuscript.sources || []).some(source => (
      source.tier === 'S'
      && /Blizzard/i.test(sourceText(source))
      && hotfixPattern.test(sourceText(source))
    ));

    assert(
      hasHotfixSource,
      `${prefix}: must include Tier S Blizzard ${requiredHotfix.date} hotfix source`
    );
    assert(
      hotfixPattern.test(sourceTextForSpec),
      `${prefix}: must mention ${requiredHotfix.date} hotfix in source/evidence/caveat text`
    );

    requiredHotfix.keywords.forEach(pattern => {
      assert(
        pattern.test(sourceTextForSpec),
        `${prefix}: ${requiredHotfix.date} hotfix coverage missing keyword ${pattern}`
      );
    });
  }
}

function effectiveManuscriptProfile(spec) {
  return SPECIAL_MANUSCRIPT_PROFILES.get(spec.id) || spec.role;
}

function validateRoleSpecificFlow(spec, manuscript) {
  const profile = effectiveManuscriptProfile(spec);
  const requirements = ROLE_FLOW_PATTERNS[profile];
  if (!requirements) {
    assert(false, `${spec.id}: no role flow requirement for profile "${profile}"`);
    return;
  }

  const openerText = [
    manuscript.opener?.title,
    manuscript.opener?.summary,
    ...(manuscript.opener?.steps || []).flatMap(step => [
      step.phase,
      step.label,
      step.trigger,
      step.note,
    ]),
  ].filter(Boolean).join(' ');
  const priorityText = (manuscript.priority || [])
    .flatMap(item => [item.label, item.note])
    .filter(Boolean)
    .join(' ');

  assert(
    requirements.opener.test(openerText),
    `${spec.id}: opener combat flow does not read like a ${profile} guide`
  );
  assert(
    requirements.priority.test(priorityText),
    `${spec.id}: priority list does not read like a ${profile} guide`
  );
}

function validateRoleSpecificChartLanguage(spec, manuscript) {
  const profile = effectiveManuscriptProfile(spec);
  const requirements = ROLE_CHART_LANGUAGE_REQUIREMENTS[profile];
  if (!requirements) {
    assert(false, `${spec.id}: no role chart language requirement for profile "${profile}"`);
    return;
  }

  const chartText = [
    manuscript.opener?.title,
    manuscript.opener?.summary,
    ...(manuscript.opener?.steps || []).flatMap(step => [
      step.phase,
      step.label,
      step.trigger,
      step.note,
    ]),
    ...(manuscript.priority || []).flatMap(item => [
      item.label,
      item.note,
    ]),
    ...(manuscript.playstyle || []).flatMap(item => [
      item.label,
      item.text,
    ]),
    ...(manuscript.tips || []),
  ].filter(Boolean).join(' ');
  const hits = requirements.terms.filter(term => chartText.includes(term));

  assert(
    hits.length >= requirements.minHits,
    `${spec.id}: ${profile} charts must use role-appropriate guide language; found ${hits.length}/${requirements.minHits} (${hits.join(', ') || 'none'})`
  );
}

function validatePracticalTips(spec, manuscript) {
  const tips = manuscript.tips || [];
  const tipText = tips.join(' ');

  assert(
    tipText.length >= MINIMUMS.tipTotalCharacters,
    `${spec.id}: practical tips are too thin as a group`
  );
  assert(
    tips.every(tip => String(tip || '').length >= MINIMUMS.tipCharacters),
    `${spec.id}: each practical tip must be substantial enough to stand alone`
  );
  assert(
    tips.some(tip => PRACTICAL_TIP_ACTION_PATTERN.test(String(tip || ''))),
    `${spec.id}: practical tips must include at least one concrete action/check`
  );
  assert(
    tips.some(tip => PRACTICAL_TIP_CONTEXT_PATTERN.test(String(tip || ''))),
    `${spec.id}: practical tips must mention real encounter/log/content context`
  );
}

function validateHeroBranches(spec, manuscript, kbSkills) {
  const branches = manuscript.heroBranches || [];
  const labels = branches.map(branch => String(branch.label || '').trim()).filter(Boolean);
  const requiredBulletCount = MINIMUMS.heroBranchBullets;
  const bodyBlockText = normalizedGuideTerm(combinedBodyBlockText(manuscript));
  const sourceEvidenceText = normalizedGuideTerm(combinedSourceText(manuscript));

  assert(
    branches.length >= MINIMUMS.heroBranches,
    `${spec.id}: needs separate hero talent branch explanations`
  );
  assert(
    new Set(labels).size === labels.length,
    `${spec.id}: hero talent branch labels must be distinct`
  );

  branches.forEach((branch, index) => {
    const prefix = `${spec.id}.heroBranches[${index}]`;
    const bullets = branch.bullets || [];
    const branchSkillIds = branch.skillIds || [];
    const branchSkills = branchSkillIds
      .map(skillId => resolveGuideSkill(skillId, manuscript, kbSkills))
      .filter(Boolean);
    const visibleAnchorSkills = branchSkills.slice(0, 3);
    const otherBranchSkillIds = new Set(
      branches.flatMap((otherBranch, otherIndex) => (otherIndex === index ? [] : otherBranch.skillIds || []))
    );
    const uniqueBranchSkillIds = branchSkillIds.filter(skillId => !otherBranchSkillIds.has(skillId));
    const uniqueBranchSkillNames = uniqueBranchSkillIds
      .map(skillId => skillName(resolveGuideSkill(skillId, manuscript, kbSkills)))
      .filter(name => name && name.length >= 2);
    const bodySkillNameHits = uniqueBranchSkillNames
      .filter(name => bodyBlockText.includes(normalizedGuideTerm(name)));
    const comparisonText = [
      branch.summary,
      ...bullets,
    ].filter(Boolean).join(' ');
    const branchText = normalizedGuideTerm(comparisonText);
    const branchSkillNameHits = uniqueBranchSkillNames
      .filter(name => branchText.includes(normalizedGuideTerm(name)));

    assert(branch.label, `${prefix}: label is missing`);
    assert(
      bodyBlockText.includes(normalizedGuideTerm(branch.label)),
      `${prefix}: hero talent branch must also be explained in the narrative body, not only in heroBranches cards`
    );
    assert(
      sourceEvidenceText.includes(normalizedGuideTerm(branch.label)),
      `${prefix}: hero talent branch label must also appear in source/evidence notes, got "${branch.label}"`
    );
    assert(
      String(branch.summary || '').length >= MINIMUMS.heroBranchSummaryCharacters,
      `${prefix}: summary must explain when this hero talent branch is chosen`
    );
    assert(
      branchSkillIds.length >= 3,
      `${prefix}: skillIds must include branch-specific skill/talent anchors`
    );
    assert(
      new Set(branchSkillIds).size === branchSkillIds.length,
      `${prefix}: skillIds must not contain duplicate anchors`
    );
    assert(
      branchSkills.length === branchSkillIds.length,
      `${prefix}: all hero talent branch skillIds must resolve to KB or extraSkills entries`
    );
    assert(
      visibleAnchorSkills.some(isBranchDefiningAnchor),
      `${prefix}: the first three visible anchors must include a talent/hero/proc/passive that defines this branch`
    );
    assert(
      uniqueBranchSkillIds.length >= 2,
      `${prefix}: skillIds must include at least two anchors unique to this hero talent branch`
    );
    assert(
      bodySkillNameHits.length >= Math.min(2, uniqueBranchSkillNames.length),
      `${prefix}: narrative body must explain at least two unique hero-branch skill anchors, got ${bodySkillNameHits.join(', ') || 'none'}`
    );
    assert(
      branchSkillNameHits.length >= Math.min(2, uniqueBranchSkillNames.length),
      `${prefix}: hero talent branch card must explain at least two unique branch skill anchors, got ${branchSkillNameHits.join(', ') || 'none'}`
    );
    assert(
      includesAnyTerm(comparisonText, HERO_BRANCH_CONTENT_TERMS),
      `${prefix}: hero talent branch must mention real content, combat, or log context`
    );
    assert(
      includesAnyTerm(comparisonText, HERO_BRANCH_ROLE_TERMS),
      `${prefix}: hero talent branch must mention role-specific mechanics such as damage, healing, defense, support, or resources`
    );
    assert(
      HERO_BRANCH_OPENER_PATTERN.test(comparisonText),
      `${prefix}: hero talent branch must explain opener, early-fight, or pre-damage timing differences`
    );
    assert(
      HERO_BRANCH_PRIORITY_PATTERN.test(comparisonText),
      `${prefix}: hero talent branch must explain priority, resource, cooldown, or maintenance differences`
    );
    assert(
      bullets.length >= requiredBulletCount,
      `${prefix}: needs at least ${requiredBulletCount} practical bullets for this hero talent branch`
    );
    assert(
      bullets.every(item => String(item || '').length >= MINIMUMS.heroBranchBulletCharacters),
      `${prefix}: each hero talent bullet must be substantial enough to stand alone`
    );
    assert(
      HERO_BRANCH_CORE_DIFF_PATTERN.test(String(bullets[0] || '')),
      `${prefix}: first hero talent bullet must explain the branch-specific playstyle change`
    );
    assert(
      HERO_BRANCH_CONTENT_PATTERN.test(String(bullets[1] || '')),
      `${prefix}: second hero talent bullet must explain the content/log context for this branch`
    );
    assert(
      HERO_BRANCH_WARNING_PATTERN.test(String(bullets[2] || '')),
      `${prefix}: third hero talent bullet must explain a practical mistake or warning`
    );
    assert(
      HERO_BRANCH_CHECK_PATTERN.test(String(bullets[3] || '')),
      `${prefix}: fourth hero talent bullet must be a concrete log/check point`
    );
    assert(
      /레이드|쐐기|단일|광역|로그|피해|생존|치유|탱킹|풀|전투|구간|대상/.test(comparisonText),
      `${prefix}: hero talent explanation must mention real content, combat, or log context`
    );
  });

  if (branches.length >= 2) {
    const normalized = branches.map(branch => [
      branch.summary,
      ...(branch.bullets || []),
    ].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim());
    const summaries = branches.map(branch => normalizedComparableText(branch.summary));
    const bulletSlotCount = Math.max(...branches.map(branch => (branch.bullets || []).length));

    assert(
      new Set(normalized).size === normalized.length,
      `${spec.id}: hero talent branch explanations must not be duplicated`
    );
    assert(
      new Set(summaries).size === summaries.length,
      `${spec.id}: hero talent branch summaries must be distinct`
    );

    for (let slot = 0; slot < bulletSlotCount; slot += 1) {
      const slotBullets = branches
        .map(branch => normalizedComparableText((branch.bullets || [])[slot]))
        .filter(Boolean);

      assert(
        new Set(slotBullets).size === slotBullets.length,
        `${spec.id}: hero talent branch bullet ${slot + 1} must be written separately for each branch`
      );
    }

    for (let leftIndex = 0; leftIndex < branches.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < branches.length; rightIndex += 1) {
        const leftText = normalized[leftIndex];
        const rightText = normalized[rightIndex];
        const similarity = tokenOverlapRatio(leftText, rightText);

        assert(
          similarity <= MINIMUMS.heroBranchSimilarityMax,
          `${spec.id}: hero talent branches "${branches[leftIndex].label}" and "${branches[rightIndex].label}" read too similarly (${similarity.toFixed(2)})`
        );
      }
    }
  }
}

function validateManuscript(spec, manuscript, kbSkills) {
  const prefix = spec.id;
  const sources = manuscript.sources || [];
  const openerSteps = manuscript.opener?.steps || [];
  const priority = manuscript.priority || [];
  const evidence = manuscript.evidence || [];
  const blocks = manuscript.blocks || [];
  const tips = manuscript.tips || [];
  const sourceText = combinedSourceText(manuscript);
  const manuscriptText = combinedManuscriptText(manuscript);
  const sourceStatus = manuscript.sourceStatus || '';
  const openerText = [
    manuscript.opener?.title,
    manuscript.opener?.summary,
  ].filter(Boolean).join(' ');

  const expectedPatch = GUIDE_PATCH_OVERRIDES.get(spec.id) || EXPECTED_PATCH;
  assert(manuscript.patch === expectedPatch, `${prefix}: patch must be ${expectedPatch}`);
  assert(manuscript.researchedAt, `${prefix}: researchedAt is missing`);
  assert(manuscriptText.length >= MINIMUMS.manuscriptCharacters, `${prefix}: manuscript is too thin for an expert guide`);
  assert(manuscript.summary && manuscript.summary.length >= 80, `${prefix}: summary is too thin`);
  assert(sourceStatus && sourceStatus.length >= 40, `${prefix}: sourceStatus is missing or too thin`);
  assert(manuscript.sourceNote && manuscript.sourceNote.length >= 120, `${prefix}: sourceNote is too thin`);
  assert(!INTERNAL_COPY_PATTERN.test(manuscriptText), `${prefix}: contains internal/prototype copy`);
  assert(!NON_KOREAN_WOWHEAD_GUIDE_PATTERN.test(manuscriptText), `${prefix}: Wowhead guide URLs must use /ko/guide/`);
  assert(!/\d{4}-\d{2}-\d{2}개\s*로그/.test(manuscriptText), `${prefix}: malformed log-date wording; use "YYYY-MM-DD 로그 집계"`);
  assert(!/(수동\s*)?확인했습니다/.test(sourceStatus), `${prefix}: sourceStatus should be concise, not first-person audit prose`);
  assert(manuscript.graphCenterSkillId, `${prefix}: graphCenterSkillId is missing`);
  assert(sources.length >= MINIMUMS.sources, `${prefix}: needs at least ${MINIMUMS.sources} sources`);
  assert(openerSteps.length >= MINIMUMS.openerSteps, `${prefix}: needs at least ${MINIMUMS.openerSteps} combat-flow steps`);
  assert(OPENER_FLOW_PATTERN.test(openerText), `${prefix}: opener must be framed as a combat-flow chart`);
  assert(!LIST_LIKE_OPENER_PATTERN.test(openerText), `${prefix}: opener must not be framed as a list/rail`);
  assert(priority.length >= MINIMUMS.priorityItems, `${prefix}: needs at least ${MINIMUMS.priorityItems} priority items`);
  assert(evidence.length >= MINIMUMS.evidenceItems, `${prefix}: needs at least ${MINIMUMS.evidenceItems} evidence notes`);
  assert(blocks.length >= MINIMUMS.blockItems, `${prefix}: needs at least ${MINIMUMS.blockItems} narrative blocks`);
  assert(tips.length >= MINIMUMS.tipItems, `${prefix}: needs at least ${MINIMUMS.tipItems} practical tips`);

  assert(/Blizzard|news\.blizzard/i.test(sourceText), `${prefix}: Blizzard source evidence is missing`);
  assert(/Wowhead/i.test(sourceText), `${prefix}: Wowhead source evidence is missing`);
  assert(/Icy Veins/i.test(sourceText), `${prefix}: Icy Veins source evidence is missing`);
  assert(/Archon|WCL/i.test(sourceText), `${prefix}: log/Archon evidence is missing`);
  assert(CLASS_PUBLIC_SOURCE_PATTERN.test(sourceText), `${prefix}: class Discord/public community evidence is missing`);
  assert(!/Maxroll/i.test(sourceText), `${prefix}: Maxroll must not be used as a guide source`);

  openerSteps.forEach((step, index) => {
    const stepPrefix = `${prefix}.opener.steps[${index}]`;
    assert(step.skillId, `${stepPrefix}: skillId is missing; opener flow steps must render as skill-icon nodes`);
    assert(step.phase && String(step.phase).length >= 2, `${stepPrefix}: phase is missing or too thin`);
    assert(step.label, `${stepPrefix}: label is missing`);
    assert(step.trigger && String(step.trigger).length >= 3, `${stepPrefix}: trigger is missing or too thin`);
    assert(step.note && step.note.length >= 8, `${stepPrefix}: note is too thin`);
  });

  priority.forEach((item, index) => {
    const itemPrefix = `${prefix}.priority[${index}]`;
    assert(item.label, `${itemPrefix}: label is missing`);
    assert(item.note && item.note.length >= 12, `${itemPrefix}: note is too thin`);
  });

  sources.forEach((source, index) => validateSource(spec, source, index));
  validateSourceCoverage(spec, manuscript);
  validateSkillReferences(spec, manuscript, kbSkills);
  validateInactiveSkillSafety(spec, manuscript, kbSkills);
  validatePriorityActionItems(spec, manuscript);
  validateSpecSpecificCurrentPatchRules(spec, manuscript);
  validateRoleSpecificFlow(spec, manuscript);
  validateRoleSpecificChartLanguage(spec, manuscript);
  validatePracticalTips(spec, manuscript);
  validateHeroBranches(spec, manuscript, kbSkills);
}

function validateManuscriptSourceShape() {
  assert(PRACTICAL_TIP_CONTEXT_PATTERN.test('쐐기'), 'Practical context matching must accept correctly spelled Korean Mythic+');
  const manuscriptSource = read(MANUSCRIPT_PATH);

  assert(
    !/const\s+guideTipAdditions\b/.test(manuscriptSource),
    'guideManuscripts.js must not use a detached guideTipAdditions fallback; write practical tips inside each spec manuscript'
  );
  assert(
    !/const\s+guideDeepeningAdditions\b/.test(manuscriptSource),
    'guideManuscripts.js must not use detached guideDeepeningAdditions; write evidence, blocks, and tips inside each spec manuscript'
  );
  assert(
    !/guideManuscripts\[[^\]]+\]\.tips\s*=/.test(manuscriptSource),
    'guideManuscripts.js must not assign tips through post-processing; each spec must own its practical tips'
  );
  assert(
    !/guideManuscripts\[[^\]]+\]\.(evidence|blocks|tips)\s*=/.test(manuscriptSource),
    'guideManuscripts.js must not assign manuscript arrays through post-processing; each spec must own its final content'
  );
  assert(
    !/\?\.\s*tips\?\.\s*length/.test(manuscriptSource),
    'guideManuscripts.js must not conditionally backfill missing tips after the manuscript object'
  );
}

function main() {
  validateManuscriptSourceShape();

  const registry = loadSourceModule(REGISTRY_PATH, '{ getReadyGuideSpecs }');
  const manuscripts = loadSourceModule(MANUSCRIPT_PATH, 'guideManuscripts');
  const kbSkills = JSON.parse(read(SKILLS_PATH)).skills || {};
  const readySpecs = registry.getReadyGuideSpecs();

  const windwalker = manuscripts['monk-windwalker'];
  const windwalkerSource = path.join(SITE_ROOT, '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base', '07-수도사', '풍운', 'Meta', 'guide-12.1.json');
  if (fs.existsSync(windwalkerSource)) {
    assert(JSON.stringify(JSON.parse(read(windwalkerSource))) === JSON.stringify(windwalker), 'Windwalker must match its canonical 12.1 manuscript');
  }
  const windwalkerNotes = Object.values(kbSkills).filter(skill => /[\\/]07-수도사[\\/]풍운[\\/]/.test(skill.source?.kbPath || ''));
  assert(windwalkerNotes.length >= 60 && windwalkerNotes.every(skill => skill.patch === '12.1' && skill.description?.length >= 25), 'Windwalker notes must retain reviewed 12.1 descriptions');
  assert(!windwalker.extraSkills?.length && !kbSkills['137639'], 'Windwalker must not revive Storm, Earth, and Fire or bypass canonical skills');
  assert(['1296621', '1296624'].every(id => kbSkills[id]?.type === 'passive') && kbSkills['1297033']?.type === 'buff' && kbSkills['1297033'].description.includes('20초'), 'Windwalker S2 effects must remain distinct from the 20-second consumer buff');
  assert(['1261703', '1261844', '1261849', '1272694', '1250566'].every(id => kbSkills[id]?.type === 'talent'), 'Windwalker apex nodes and enabling talents must not become casts');
  assert(['1272696', '443028', '467307'].every(id => kbSkills[id]?.type === 'atomic-skill' && kbSkills[id].specs.includes('Windwalker')), 'Windwalker flows require real Stomp, Conduit and Rushing Wind Kick casts');
  assert(kbSkills['432181']?.description.includes('물리') && !kbSkills['432181'].specs.includes('Brewmaster'), 'Windwalker Dance of the Wind must not borrow the Brewmaster dodge node');
  assert(kbSkills['100780']?.description.includes('60') && kbSkills['100784']?.description.includes('기 1') && kbSkills['1248989']?.description.includes('1분'), 'Windwalker costs and Xuen-gated Conduit must survive sync');
  assert(['443421', '443616', '1238904', '116768', '325202', '1250554'].every(id => kbSkills[id]?.type === 'buff'), 'Windwalker proc and Jade Heart variants must stay separate');
  for (const branch of windwalker.heroBranches) {
    assert(branch.opener.steps.length >= 8 && branch.singleTarget.priority.length >= 10 && branch.aoe.priority.length >= 10, 'Both Windwalker heroes need authored opener, ST and AoE');
    assert(JSON.stringify(branch.singleTarget.priority) !== JSON.stringify(branch.aoe.priority), 'Windwalker single-target and AoE conditions must differ');
    for (const mode of [branch.opener, branch.singleTarget, branch.aoe]) {
      for (const row of [...(mode.steps || []), ...(mode.priority || [])]) {
        assert(kbSkills[row.skillId]?.type === 'atomic-skill' && row.note.length > 25, 'Windwalker chart rows must be real casts with complete conditions');
      }
    }
  }
  assert(!JSON.stringify(windwalker.heroBranches[0]).includes('"skillId":"123904"') && !JSON.stringify(windwalker.heroBranches[0]).includes('"skillId":"443028"'), 'Shado-Pan must not borrow Conduit cast buttons');
  assert(!JSON.stringify(windwalker).includes('99.9%'), 'Windwalker must not reuse stale Season 1 usage statistics');


  const affliction = manuscripts['warlock-affliction'];
  const afflictionSource = path.join(SITE_ROOT, '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base', '12-흑마법사', '고통', 'Meta', 'guide-12.1.json');
  if (fs.existsSync(afflictionSource)) {
    assert(JSON.stringify(JSON.parse(read(afflictionSource))) === JSON.stringify(affliction), 'Affliction must match its canonical 12.1 manuscript');
  }
  const afflictionNotes = Object.values(kbSkills).filter(skill => /[\\/]12-흑마법사[\\/]고통[\\/]/.test(skill.source?.kbPath || ''));
  assert(afflictionNotes.length === 52 && afflictionNotes.every(skill => skill.patch === '12.1' && skill.description?.length >= 25), 'All 52 Affliction notes must retain reviewed descriptions');
  assert(!affliction.extraSkills?.length && ['316099', '70388', '387016', '63106', '1260271', '1260285'].every(id => !kbSkills[id]), 'Affliction must not restore obsolete casts or removed talents');
  assert(['1259790', '27243', '1257052', '1261153'].every(id => kbSkills[id]?.type === 'atomic-skill'), 'Affliction requires current player-cast IDs');
  assert(['452999', '1261149', '1261984', '1311969', '1312998'].every(id => kbSkills[id]?.type === 'spec-talent'), 'Affliction enabling talents must remain distinct from casts');
  assert(['1305774', '264571', '1260269', '449793'].every(id => kbSkills[id]?.type === 'buff') && kbSkills['1262710']?.type === 'passive', 'Affliction proc records must survive canonical sync');
  assert(kbSkills['686']?.specs.includes('Affliction') && kbSkills['389623']?.type === 'class-talent' && kbSkills['389623'].specs.includes('Destruction'), 'Warlock shared scope must not lose Affliction filler or misclassify Gorefiend');
  assert(kbSkills['440043']?.description.includes('그 대상') && kbSkills['1296569']?.description.includes('20%') && kbSkills['205180']?.description.includes('연장하는 기술은 아니다'), 'Affliction target, tier and Darkglare mechanics must survive sync');
  for (const branch of affliction.heroBranches) {
    assert(branch.opener.steps.length === 10 && branch.singleTarget.priority.length >= 10 && branch.aoe.priority.length >= 10, 'Both Affliction heroes need complete opener, ST and AoE');
    assert(JSON.stringify(branch.singleTarget.priority) !== JSON.stringify(branch.aoe.priority), 'Affliction ST and AoE conditions must differ');
    for (const mode of [branch.opener, branch.singleTarget, branch.aoe]) {
      for (const row of [...(mode.steps || []), ...(mode.priority || [])]) {
        assert(kbSkills[row.skillId]?.type === 'atomic-skill' && row.note.length > 25, 'Affliction flow rows must be real casts with complete conditions');
      }
    }
  }
  assert(!JSON.stringify(affliction.heroBranches[0]).includes('"skillId":"442726"') && !JSON.stringify(affliction.heroBranches[1]).includes('"skillId":"172"'), 'Affliction heroes must not borrow incompatible casts');
  assert(!/99\.7%|96\.2%|98\.7%/.test(JSON.stringify(affliction)), 'Affliction must not reuse June usage rates');
  const afflictionSynergies = Object.values(JSON.parse(read(path.join(SITE_ROOT, 'src/data/kb-synergies.json'))).synergies).filter(note => note.class === 'Warlock' && note.spec === 'Affliction');
  assert(afflictionSynergies.length === 15 && afflictionSynergies.every(note => note.participants.length >= 3 && note.participants.every(id => /^\d+$/.test(id) && kbSkills[id])), 'All 15 Affliction relationships must export real participant IDs, not display names');
  assert(afflictionSynergies.filter(note => note.participants.includes(affliction.graphCenterSkillId)).length === 10, 'Unstable Affliction must retain its ten authored relationships');

  const demonology = manuscripts['warlock-demonology'];
  const demonologySource = path.join(SITE_ROOT, '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base', '12-흑마법사', '악마', 'Meta', 'guide-12.1.json');
  if (fs.existsSync(demonologySource)) {
    assert(JSON.stringify(JSON.parse(read(demonologySource))) === JSON.stringify(demonology), 'Demonology must match its canonical 12.1 manuscript');
  }
  const demonologyNotes = Object.values(kbSkills).filter(skill => /[\\/]12-흑마법사[\\/]악마[\\/]/.test(skill.source?.kbPath || ''));
  assert(demonologyNotes.length === 65 && demonologyNotes.every(skill => skill.patch === '12.1' && skill.description?.length >= 25), 'All 65 Demonology notes must retain reviewed descriptions');
  assert(!demonology.extraSkills?.length && !kbSkills['186185'], 'Demonology must not restore NPC Demonic Sacrifice or bypass canonical skills');
  assert(['105174', '264178', '265187', '434506', '434635', '1276672'].every(id => kbSkills[id]?.type === 'atomic-skill'), 'Demonology flows require actual player-cast IDs');
  assert(['1251778', '460551', '1276163', '1276190', '1276222'].every(id => kbSkills[id]?.type === 'spec-talent'), 'Demonology Vilefiend, Doom and apex nodes must not become cast buttons');
  assert(kbSkills['264173']?.type === 'buff' && kbSkills['267102']?.type === 'passive' && kbSkills['1276166']?.type === 'buff', 'Demonology proc rules and active buffs require separate identities');
  assert(kbSkills['105174']?.description.includes('3개를 고정') && kbSkills['264178']?.description.includes('2개를 생성') && kbSkills['434506']?.description.includes('악마는 조각 3개'), 'Demonology costs and hero-specific generation must survive sync');
  assert(kbSkills['1276190']?.description.includes('최대 2점') && kbSkills['1276190']?.description.includes('25초') && kbSkills['1276222']?.description.includes('사용 후 조각 1개'), 'Demonology apex rank and post-cast refund conditions must survive sync');
  assert(kbSkills['1296573']?.type === 'passive' && kbSkills['1296574']?.type === 'passive' && kbSkills['1306077']?.type === 'proc', 'Demonology set explosions must not become additional player casts');
  for (const branch of demonology.heroBranches) {
    assert(branch.opener.steps.length === 10 && branch.singleTarget.priority.length >= 10 && branch.aoe.priority.length >= 10, 'Both Demonology heroes need a complete opener, ST and AoE');
    assert(JSON.stringify(branch.singleTarget.priority) !== JSON.stringify(branch.aoe.priority), 'Demonology ST and AoE conditions must differ');
    for (const mode of [branch.opener, branch.singleTarget, branch.aoe]) {
      const rows = [...(mode.steps || []), ...(mode.priority || [])];
      assert(!(rows.some(row => row.skillId === '196277') && rows.some(row => row.skillId === '264130')), 'Implosion and Power Siphon must never appear in one build flow');
      for (const row of rows) {
        assert(kbSkills[row.skillId]?.type === 'atomic-skill' && kbSkills[row.skillId]?.specs.includes('Demonology') && row.note.length > 25, 'Demonology flow rows must be scoped casts with complete conditions');
      }
    }
  }
  const soulHarvester = demonology.heroBranches.find(branch => branch.label === '영혼 수확자');
  const diabolist = demonology.heroBranches.find(branch => branch.label === '악마학자');
  assert(soulHarvester?.opener.steps.find(row => row.skillId === '265187')?.trigger.includes('2조각 이하'), 'Soul Harvester must leave room for the three Tyrant shards');
  assert(diabolist?.opener.steps.find(row => row.skillId === '265187')?.trigger.includes('5조각'), 'Diabolist must retain its distinct Tyrant preparation');
  assert(!JSON.stringify(soulHarvester).includes('"skillId":"434506"') && !JSON.stringify(soulHarvester).includes('"skillId":"434635"'), 'Soul Harvester must not borrow Diabolist cast buttons');
  const demonologySynergies = Object.values(JSON.parse(read(path.join(SITE_ROOT, 'src/data/kb-synergies.json'))).synergies).filter(note => note.class === 'Warlock' && note.spec === 'Demonology');
  assert(demonologySynergies.length === 18 && demonologySynergies.every(note => note.participants.length >= 3 && note.participants.every(id => /^\d+$/.test(id) && kbSkills[id]?.specs.includes('Demonology'))), 'All 18 Demonology relationships must use real, correctly scoped numeric IDs');
  assert(demonology.graphCenterSkillId === '105174' && demonologySynergies.filter(note => note.participants.includes('105174')).length === 12, 'Hand of Guldan must retain its twelve actual relationships');
  assert(!/93\.0%|99\.2%|99\.9%|190\.8k/.test(JSON.stringify(demonology)), 'Demonology must not reuse June usage or DPS as current evidence');

  const destruction = manuscripts['warlock-destruction'];
  const destructionSource = path.join(SITE_ROOT, '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base', '12-흑마법사', '파괴', 'Meta', 'guide-12.1.json');
  if (fs.existsSync(destructionSource)) {
    assert(JSON.stringify(JSON.parse(read(destructionSource))) === JSON.stringify(destruction), 'Destruction must match its canonical 12.1 manuscript');
  }
  const destructionNotes = Object.values(kbSkills).filter(skill => /[\\/]12-흑마법사[\\/]파괴[\\/]/.test(skill.source?.kbPath || ''));
  assert(destructionNotes.length === 66 && destructionNotes.every(skill => skill.patch === '12.1' && skill.description?.length >= 25), 'All 66 Destruction notes must retain reviewed descriptions');
  assert(!destruction.extraSkills?.length, 'Destruction must not bypass canonical skills');
  assert(['348', '1122', '5740', '6353', '17877', '17962', '29722', '80240', '116858', '152108'].every(id => kbSkills[id]?.type === 'atomic-skill'), 'Destruction flows require current player casts');
  assert(['1280868', '387108', '454735', '1265770', '1265772', '1265774'].every(id => kbSkills[id]?.type === 'spec-talent'), 'Destruction passive talents and apex nodes must not become cast buttons');
  assert(kbSkills['80240']?.description.includes('50%') && kbSkills['387108']?.description.includes('항상 치명타'), 'Destruction must retain the redesigned Havoc and Conflagration of Chaos');
  assert(kbSkills['17877']?.description.includes('20% 미만') && kbSkills['1245664']?.type === 'buff' && kbSkills['1245664'].description.includes('생명력 제한'), 'Shadowburn execute and free-proc conditions must remain distinct');
  assert(kbSkills['117828']?.type === 'buff' && kbSkills['196406']?.type === 'spec-talent' && kbSkills['417282']?.description.includes('8회를 공유'), 'Backdraft identity and shared Crashing Chaos charges must survive sync');
  assert(kbSkills['454735']?.aliases.includes('전문화 황폐') && kbSkills['434589']?.aliases.includes('거대마귀의 혼돈의 화살'), 'Same-name passive and pet spells require unambiguous inline aliases');
  assert(['428522', '434635'].every(id => kbSkills[id]?.description.includes('악독한 임프')) && kbSkills['434589']?.type === 'proc', 'Ruination summons a Diabolic Imp, not the Avatar Overfiend');
  assert(kbSkills['1296571']?.type === 'passive' && kbSkills['1296571'].description.includes('10%p') && kbSkills['1296572']?.type === 'passive' && kbSkills['1305711']?.description.includes('6초'), 'Destruction Season 2 effects must retain their proc and target identities');
  for (const branch of destruction.heroBranches) {
    assert(branch.opener.steps.length === 10 && branch.singleTarget.priority.length >= 10 && branch.aoe.priority.length >= 10, 'Both Destruction heroes need complete opener, ST and AoE');
    assert(JSON.stringify(branch.singleTarget.priority) !== JSON.stringify(branch.aoe.priority), 'Destruction ST and AoE must have distinct conditions');
    for (const mode of [branch.opener, branch.singleTarget, branch.aoe]) {
      for (const row of [...(mode.steps || []), ...(mode.priority || [])]) {
        assert(kbSkills[row.skillId]?.type === 'atomic-skill' && kbSkills[row.skillId]?.specs.includes('Destruction') && row.note.length > 25, 'Destruction flow rows must be scoped actual casts with complete conditions');
        if (row.skillId === '434635') assert(!row.note.includes('거대마귀를 연결'), 'Ruination must not grant the Overfiend resource effect');
      }
    }
  }
  const hellcaller = destruction.heroBranches.find(branch => branch.label === '지옥소환사');
  const destructionDiabolist = destruction.heroBranches.find(branch => branch.label === '악마학자');
  assert(!JSON.stringify(hellcaller).includes('"skillId":"434635"') && !JSON.stringify(hellcaller).includes('"skillId":"434506"') && !JSON.stringify(destructionDiabolist).includes('"skillId":"445468"') && !JSON.stringify(destructionDiabolist).includes('"skillId":"442726"'), 'Destruction heroes must not borrow incompatible spells');
  const destructionSynergies = Object.values(JSON.parse(read(path.join(SITE_ROOT, 'src/data/kb-synergies.json'))).synergies).filter(note => note.class === 'Warlock' && note.spec === 'Destruction');
  assert(destructionSynergies.length === 18 && destructionSynergies.every(note => note.participants.length >= 3 && note.participants.every(id => /^\d+$/.test(id) && kbSkills[id]?.specs.includes('Destruction'))), 'All 18 Destruction relationships must use correctly scoped numeric IDs');
  assert(destruction.graphCenterSkillId === '116858' && destructionSynergies.filter(note => note.participants.includes('116858')).length === 12, 'Chaos Bolt must retain its twelve actual relationships');

  const assassination = manuscripts['rogue-assassination'];
  const assassinationSource = path.join(SITE_ROOT, '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base', '10-도적', '암살', 'Meta', 'guide-12.1.json');
  if (fs.existsSync(assassinationSource)) {
    assert(JSON.stringify(JSON.parse(read(assassinationSource))) === JSON.stringify(assassination), 'Assassination must match its canonical 12.1 manuscript');
  }
  for (const branch of assassination.heroBranches) {
    assert(branch.opener.steps.length >= 8 && branch.singleTarget.priority.length >= 7 && branch.aoe.priority.length >= 7, 'Assassination heroes need authored opener, single-target and AoE flows');
    const casts = [...branch.opener.steps, ...branch.singleTarget.priority, ...branch.aoe.priority];
    assert(casts.every(row => kbSkills[row.skillId]?.type === 'atomic-skill' && kbSkills[row.skillId].specs.includes('Assassination')), 'Assassination charts must use correctly scoped cast buttons');
    assert(casts.every(row => !['381623', '469779', '1265387'].includes(row.skillId)), 'Automatic tea and apex effects must not be cast buttons');
    assert(branch.label !== '운명결속' || !casts.some(row => row.skillId === '1293340'), 'Fatebound must not borrow Mark for Death');
  }
  assert(JSON.stringify(assassination.opener) === JSON.stringify(assassination.heroBranches[0].opener), 'Default Assassination opener must match Fatebound');
  assert(assassination.sourceNote.includes('403') && !JSON.stringify(assassination).includes('99.2%'), 'Assassination must disclose missing current log evidence instead of recycling June usage');

  const shadow = manuscripts['priest-shadow'];
  const shadowSource = path.join(SITE_ROOT, '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base', '09-사제', '암흑', 'Meta', 'guide-12.1.json');
  if (fs.existsSync(shadowSource)) {
    assert(JSON.stringify(JSON.parse(read(shadowSource))) === JSON.stringify(shadow), 'Shadow must match its canonical 12.1 manuscript');
  }
  for (const branch of shadow.heroBranches) {
    assert(branch.opener.steps.length === 8 && branch.singleTarget.priority.length >= 8 && branch.aoe.priority.length >= 8, 'Shadow heroes need their own opener, single-target and AoE flows');
    const casts = [...branch.opener.steps, ...branch.singleTarget.priority, ...branch.aoe.priority];
    assert(casts.every(row => kbSkills[row.skillId]?.type === 'atomic-skill' && kbSkills[row.skillId].specs.includes('Shadow')), 'Shadow charts must use real Shadow casts, not talents or automatic damage');
    const ids = casts.map(row => row.skillId);
    assert(branch.label === '집정관' ? !ids.includes('263165') && !ids.includes('450983') : !ids.includes('120644') && !ids.includes('391403'), 'Shadow heroes must not borrow incompatible casts');
  }
  assert(JSON.stringify(shadow.opener) === JSON.stringify(shadow.heroBranches[0].opener), 'Default Shadow flow must match Archon');
  assert(!GENERAL_AWKWARD_COPY_PATTERN.test('마력 압축'.replace(/마력 압축/g, '')) && GENERAL_AWKWARD_COPY_PATTERN.test('마력 압축으로 압축합니다'.replace(/마력 압축/g, '')), 'Official talent names must not hide awkward prose outside the name');

  const discipline = manuscripts['priest-discipline'];
  const disciplineSource = path.join(SITE_ROOT, '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base', '09-사제', '수양', 'Meta', 'guide-12.1.json');
  if (fs.existsSync(disciplineSource)) {
    assert(JSON.stringify(JSON.parse(read(disciplineSource))) === JSON.stringify(discipline), 'Discipline must match its canonical 12.1 manuscript');
  }
  const disciplineNotes = Object.values(kbSkills).filter(skill => /[\\/]09-사제[\\/]수양[\\/]/.test(skill.source?.kbPath || ''));
  assert(disciplineNotes.length === 62 && disciplineNotes.every(skill => skill.patch === '12.1' && skill.description?.length > 20), 'All 62 Discipline notes must retain reviewed descriptions');
  assert(!discipline.extraSkills?.length && !kbSkills['1252215'] && !kbSkills['214621'], 'Discipline must not bypass canonical data or revive obsolete spell IDs');
  assert(kbSkills['81749']?.type === 'passive' && kbSkills['81749'].description.includes('46%') && kbSkills['194384']?.type === 'buff', 'Atonement passive, current rate and applied buff must remain distinct');
  assert(kbSkills['1253591']?.type === 'buff' && kbSkills['1253828']?.type === 'proc' && kbSkills['1307795']?.type === 'buff', 'Void Shield uses, reflection and set bonus are not cast buttons');
  assert(kbSkills['1296577']?.description.includes('시전할 때') && kbSkills['1296577'].description.includes('2초') && kbSkills['1296578']?.description.includes('25%'), 'Discipline tier must retain per-cast reduction and next-shield enhancement');
  assert(kbSkills['1298779']?.description.includes('40%') && kbSkills['1298779'].description.includes('0.3초'), 'Grim Deliverance must not regress to launch values');
  assert(kbSkills['390693']?.description.includes('확률') && kbSkills['390693'].description.includes('보호막'), 'Inner Focus increases critical chance for its actual spell list, not critical heal amount');
  assert(kbSkills['1250293']?.description.includes('암흑') && kbSkills['1250293'].description.includes('15%') && !kbSkills['1250293'].description.includes('대기시간'), 'Occultist is Shadow damage/healing, not Mind Blast cooldown reduction');
  assert(kbSkills['1253724']?.description.startsWith('성스러운 일격 시전') && !kbSkills['1253724'].description.includes('회개 후'), 'Greater Smite must be triggered by Smite, not Penance');
  assert(kbSkills['1280137']?.type === 'talent' && kbSkills['1280137'].specs.join() === 'Discipline' && kbSkills['1230339']?.specs.join() === 'Shadow', 'Mindbender passives must retain separate spec scope');
  for (const branch of discipline.heroBranches) {
    assert(branch.opener.steps.length >= 7 && branch.singleTarget.priority.length >= 7 && branch.aoe.priority.length >= 7, 'Both Discipline heroes need complete situation-specific healing modes');
    assert(JSON.stringify(branch.singleTarget.priority) !== JSON.stringify(branch.aoe.priority), 'Discipline single-person rescue must not duplicate group healing');
    assert([branch.opener.tabLabel, branch.singleTarget.tabLabel, branch.aoe.tabLabel].join('|') === '피해 준비|한 명 급락|파티·공대 피해', 'Discipline modes must use healing situation labels');
    const rows = [...branch.opener.steps, ...branch.singleTarget.priority, ...branch.aoe.priority];
    assert(rows.every(row => kbSkills[row.skillId]?.type === 'atomic-skill' && kbSkills[row.skillId]?.specs.includes('Discipline') && row.note.length > 25), 'Discipline flow rows must be scoped actual casts with meaningful conditions');
    if (branch.label === '예언자') assert(!rows.some(row => row.skillId === '450215'), 'Oracle must not cast Void Blast');
  }
  const disciplineSynergies = Object.values(JSON.parse(read(path.join(SITE_ROOT, 'src/data/kb-synergies.json'))).synergies).filter(note => note.class === 'Priest' && note.spec === 'Discipline');
  assert(disciplineSynergies.length === 21 && disciplineSynergies.every(note => note.participants.length >= 3 && note.participants.every(id => /^\d+$/.test(id) && kbSkills[id]?.specs.includes('Discipline'))), 'All 21 Discipline relationships must retain scoped numeric participants');
  assert(discipline.graphCenterSkillId === '81749' && disciplineSynergies.filter(note => note.participants.includes('81749')).length === 11, 'Atonement must retain its eleven actual relationships');

  const retribution = manuscripts['paladin-retribution'];
  const retributionSource = path.join(SITE_ROOT, '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base', '08-성기사', '징벌', 'Meta', 'guide-12.1.json');
  if (fs.existsSync(retributionSource)) {
    assert(JSON.stringify(JSON.parse(read(retributionSource))) === JSON.stringify(retribution), 'Retribution must match its canonical 12.1 manuscript');
  }
  const retributionNotes = Object.values(kbSkills).filter(skill => /[\\/]08-성기사[\\/]징벌[\\/]/.test(skill.source?.kbPath || ''));
  assert(retributionNotes.length === 69 && retributionNotes.every(skill => skill.patch === '12.1' && skill.description?.trim()), 'All 69 Retribution notes must retain reviewed descriptions');
  assert(!retribution.extraSkills?.length && !kbSkills['267344'] && kbSkills['406064']?.type === 'talent', 'Retribution must use current Art of War without extraSkills');
  assert(kbSkills['403876']?.type === 'atomic-skill' && kbSkills['184662']?.type === 'buff' && kbSkills['1261562']?.type === 'talent', 'Shield of Vengeance must remain an effect of the actual Divine Protection cast');
  assert(kbSkills['375576']?.specs.includes('Retribution') && kbSkills['375576']?.description.includes('50% 강화 심판'), 'Divine Toll must have canonical Retribution scope and mechanics');
  assert(kbSkills['1261113']?.description.includes('두 발동 특성') && kbSkills['1261113']?.description.includes('80%'), 'Light Within must retain current strength and mutually exclusive proc talents');
  assert(kbSkills['1296660']?.description.includes('10%p') && kbSkills['1296661']?.description.includes('다른 종류'), 'Retribution tier effects must retain chance and different-spender conditions');
  assert(['1306161', '1306162', '1310461'].every(id => kbSkills[id]?.type === 'buff') && kbSkills['1306923']?.type === 'proc', 'Divine Arbiter states and automatic damage must not become player casts');
  assert(kbSkills['156322']?.type === 'atomic-skill' && kbSkills['24275']?.description.includes('심판'), 'Eternal Flame and current Hammer of Wrath must retain their actual roles');
  for (const branch of retribution.heroBranches) {
    const rows = [...branch.opener.steps, ...branch.singleTarget.priority, ...branch.aoe.priority];
    assert(rows.every(row => kbSkills[row.skillId]?.type === 'atomic-skill' && kbSkills[row.skillId]?.specs.includes('Retribution')), 'Retribution flows must contain correctly scoped casts only');
    assert(!rows.some(row => ['35395', '184662', '1241413', '275779', '429826'].includes(row.skillId)), 'Selected Retribution flows must not contain passive replacements, buffs or Protection casts');
    assert(JSON.stringify(branch.singleTarget.priority) !== JSON.stringify(branch.aoe.priority), 'Retribution target modes must retain distinct conditions');
    if (branch.label === '태양의 사자') assert(!rows.some(row => row.skillId === '427453'), 'Herald must not borrow Hammer of Light');
    if (branch.label === '기사단') assert(branch.opener.steps[3].skillId === '255937' && branch.opener.steps[4].skillId === '427453', 'Templar must open Hammer of Light with Wake, not Divine Toll');
  }
  assert(retribution.heroBranches[0].label === '태양의 사자' && JSON.stringify(retribution.opener) === JSON.stringify(retribution.heroBranches[0].opener), 'Default Retribution flow must match the selected Herald example');
  const retributionSynergies = Object.values(JSON.parse(read(path.join(SITE_ROOT, 'src/data/kb-synergies.json'))).synergies).filter(note => note.class === 'Paladin' && note.spec === 'Retribution');
  assert(retributionSynergies.length === 23 && retributionSynergies.every(note => note.participants.length >= 3 && note.participants.every(id => /^\d+$/.test(id) && kbSkills[id]?.specs.includes('Retribution'))), 'All 23 Retribution relationships must retain scoped numeric participants');
  assert(retribution.graphCenterSkillId === '383328' && retributionSynergies.filter(note => note.participants.includes('383328')).length === 10, 'Final Verdict must retain its ten actual relationships');

  const protection = manuscripts['paladin-protection'];
  const protectionSource = path.join(SITE_ROOT, '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base', '08-성기사', '보호', 'Meta', 'guide-12.1.json');
  if (fs.existsSync(protectionSource)) {
    assert(JSON.stringify(JSON.parse(read(protectionSource))) === JSON.stringify(protection), 'Protection must match its canonical 12.1 manuscript');
  }
  const protectionNotes = Object.values(kbSkills).filter(skill => /[\\/]08-성기사[\\/]보호[\\/]/.test(skill.source?.kbPath || ''));
  assert(protectionNotes.length === 65 && protectionNotes.every(skill => skill.patch === '12.1' && skill.description?.length >= 25), 'All 65 Protection notes must retain reviewed descriptions');
  assert(!protection.extraSkills?.length && !kbSkills['171648'], 'Protection must not revive Sanctified Wrath or bypass canonical spells');
  assert(kbSkills['389539']?.type === 'atomic-skill' && kbSkills['385438']?.type === 'buff', 'Sentinel cast and buff must stay distinct');
  assert(['275779', '1241413'].every(id => kbSkills[id]?.specs.length === 1 && kbSkills[id].specs[0] === 'Protection'), 'Protection must use its own Judgment and Hammer of Wrath');
  assert(kbSkills['427453']?.castTime === '즉시' && kbSkills['427453']?.resourceCost.includes('3개'), 'Hammer of Light must remain a real three-power cast');
  assert(kbSkills['431398']?.type === 'proc' && kbSkills['434132']?.type === 'buff', 'Automatic hero effects must not become player casts');
  assert(kbSkills['31850']?.description.includes('12초') && kbSkills['31850']?.description.includes('30%') && kbSkills['86659']?.cooldown.includes('3분'), 'Current defensive duration and cooldowns must survive sync');
  assert(kbSkills['1296659']?.description.includes('모든 신성 공격') && kbSkills['1300662']?.type === 'proc', 'Season 2 must distinguish triggered damage from a universal vulnerability');
  assert(!kbSkills['498']?.specs.includes('Protection') && !kbSkills['20271']?.specs.includes('Protection') && kbSkills['204018']?.specs.length === 1, 'Paladin specialization scopes must not regress');
  for (const branch of protection.heroBranches) {
    const rows = [...branch.opener.steps, ...branch.singleTarget.priority, ...branch.aoe.priority];
    assert(rows.every(row => kbSkills[row.skillId]?.type === 'atomic-skill' && kbSkills[row.skillId]?.specs.includes('Protection')), 'Protection flows must contain correctly scoped player casts only');
    assert(!rows.some(row => ['20271', '24275', '385438', '53595'].includes(row.skillId)), 'Selected Blessed Hammer flows must not borrow foreign IDs, buffs or the alternative hammer');
    assert(JSON.stringify(branch.singleTarget.priority) !== JSON.stringify(branch.aoe.priority), 'Protection single-target and AoE conditions must differ');
    if (branch.label === '기사단') assert(!rows.some(row => ['432459', '432472'].includes(row.skillId)), 'Templar must not borrow Lightsmith armaments');
    if (branch.label === '빛대장장이') assert(!rows.some(row => row.skillId === '427453'), 'Lightsmith must not borrow Hammer of Light');
  }
  const protectionSynergies = Object.values(JSON.parse(read(path.join(SITE_ROOT, 'src/data/kb-synergies.json'))).synergies).filter(note => note.class === 'Paladin' && note.spec === 'Protection');
  assert(protectionSynergies.length === 18 && protectionSynergies.every(note => note.participants.length >= 3 && note.participants.every(id => /^\d+$/.test(id) && kbSkills[id]?.specs.includes('Protection'))), 'Protection must retain eighteen correctly scoped numeric relationships');
  assert(protection.graphCenterSkillId === '53600' && protectionSynergies.filter(note => note.participants.includes('53600')).length === 11, 'Shield of the Righteous must retain its eleven actual relationships');

  const brewmaster = manuscripts['monk-brewmaster'];
  const brewmasterSource = path.join(SITE_ROOT, '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base', '07-수도사', '양조', 'Meta', 'guide-12.1.json');
  if (fs.existsSync(brewmasterSource)) {
    assert(JSON.stringify(JSON.parse(read(brewmasterSource))) === JSON.stringify(brewmaster), 'Brewmaster must match its canonical 12.1 manuscript');
  }
  const brewmasterNotes = Object.values(kbSkills).filter(skill => /[\\/]07-수도사[\\/]양조[\\/]/.test(skill.source?.kbPath || ''));
  assert(brewmasterNotes.length === 74 && brewmasterNotes.every(skill => skill.patch === '12.1' && skill.description?.length >= 25), 'All 74 Brewmaster notes must retain reviewed descriptions');
  assert(!brewmaster.extraSkills?.length && !kbSkills['292601'], 'Brewmaster must not include Druid Ironfur or bypass canonical skills');
  assert(kbSkills['101546']?.specs.includes('Brewmaster') && kbSkills['101546']?.specs.includes('Windwalker') && kbSkills['101546']?.castTime === '1.5초 채널', 'Spinning Crane Kick must be one shared cast with spec-specific costs');
  assert(kbSkills['115450']?.specs.join(',') === 'Mistweaver' && kbSkills['218164']?.specs.includes('Brewmaster'), 'Brewmaster energy Detox must not borrow Mistweaver magic Detox');
  assert(['115069', '322120', '117906', '216519'].every(id => kbSkills[id]?.type === 'passive'), 'Brewmaster defensive passives must not become cast buttons');
  assert(['1265307', '1265140', '1265145', '1270990', '1301477'].every(id => kbSkills[id]?.type === 'buff') && kbSkills['1301410']?.type === 'debuff', 'Brewmaster prepared, healing and target effects need distinct identities');
  assert(['1265129', '1265138', '1265141'].every(id => kbSkills[id]?.type === 'talent') && kbSkills['1265138']?.description.includes('100%'), 'All Bring Me Another nodes must preserve rank-based costs');
  assert(kbSkills['322507']?.cooldown === '90초' && kbSkills['1241059']?.cooldown === '90초' && kbSkills['205523']?.cooldown === '4초', 'Brewmaster base cooldowns must retain 12.1 values');
  assert(kbSkills['1241059']?.description.includes('30%') && kbSkills['1241059']?.description.includes('16초') && kbSkills['1265141']?.description.includes('아군 2명'), 'Infusion and apex drink conditions must survive sync');
  assert(kbSkills['450529']?.description.includes('공급하지 않고') && kbSkills['1272821']?.description.includes('불의 숨결'), 'Harmony vitality and Shado-Pan fire loops must not be merged');
  for (const branch of brewmaster.heroBranches) {
    assert(branch.opener.steps.length >= 10 && branch.singleTarget.priority.length >= 10 && branch.aoe.priority.length >= 10, 'Both Brewmaster heroes need authored opener, ST and AoE modes');
    assert(JSON.stringify(branch.singleTarget.priority) !== JSON.stringify(branch.aoe.priority), 'Brewmaster ST and AoE must retain different conditions');
    for (const mode of [branch.opener, branch.singleTarget, branch.aoe]) {
      for (const row of [...(mode.steps || []), ...(mode.priority || [])]) {
        assert(kbSkills[row.skillId]?.type === 'atomic-skill' && row.note.length > 25, 'Brewmaster flow rows must be actual casts with readable conditions');
      }
    }
  }

  const mageFrost = manuscripts['mage-frost'];
  const mageFrostSource = path.join(SITE_ROOT, '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base', '06-마법사', '냉기', 'Meta', 'guide-12.1.json');
  if (fs.existsSync(mageFrostSource)) {
    assert(JSON.stringify(JSON.parse(read(mageFrostSource))) === JSON.stringify(mageFrost), 'Frost must match its canonical 12.1 manuscript');
  }
  const mageFrostNotes = Object.values(kbSkills).filter(skill => /[\\/]06-마법사[\\/]냉기[\\/]/.test(skill.source?.kbPath || ''));
  assert(mageFrostNotes.length === 63 && mageFrostNotes.every(skill => skill.patch === '12.1' && skill.description?.length >= 25), 'All 63 Frost notes must retain reviewed descriptions');
  assert(!mageFrost.extraSkills?.length && !kbSkills['12472'], 'Frost must not revive Icy Veins or bypass canonical spells');
  assert(kbSkills['1246769']?.type === 'passive' && kbSkills['1221389']?.type === 'debuff', 'Shatter passive and target Freezing stacks must remain distinct');
  assert(['44544', '190446', '205473', '1222865', '1247730', '1247778', '1310248'].every(id => kbSkills[id]?.type === 'buff'), 'Frost proc and prepared effects must not appear as casts');
  assert(['1262935', '1262981', '1263249'].every(id => kbSkills[id]?.type === 'talent') && kbSkills['1263263']?.type === 'buff', 'All Hand of Frost nodes and its damage buff must remain distinct');
  assert(kbSkills['1246832']?.description.includes('6초') && kbSkills['11426']?.description.includes('35%') && kbSkills['1244069']?.description.includes('물리 피해를 10%'), 'Time-based Icicles and current defensive values must survive sync');
  assert(['1296585', '1296586'].every(id => kbSkills[id]?.type === 'passive') && kbSkills['1296585']?.description.includes('4%') && kbSkills['1296586']?.description.includes('1초'), 'Frost S2 effects must remain passive with distinct proc conditions');
  assert(String(mageFrost.graphCenterSkillId) === '30455', 'Frost graph must center on the actual Ice Lance cast');
  for (const branch of mageFrost.heroBranches) {
    assert(branch.opener.steps.length >= 6 && branch.singleTarget.priority.length >= 8 && branch.aoe.priority.length >= 8, 'Each Frost hero needs authored opener, ST and AoE modes');
    assert(JSON.stringify(branch.singleTarget.priority) !== JSON.stringify(branch.aoe.priority), 'Frost ST and AoE must retain distinct conditions');
    for (const mode of [branch.opener, branch.singleTarget, branch.aoe]) {
      for (const row of [...(mode.steps || []), ...(mode.priority || [])]) {
        assert(kbSkills[row.skillId]?.type === 'atomic-skill' && row.note.length > 25, 'Frost flows must use actual casts and complete conditions');
      }
    }
  }
  const frostSpellslinger = mageFrost.heroBranches.find(branch => branch.label === '주문술사');
  const frostFrostfire = mageFrost.heroBranches.find(branch => branch.label === '서리불꽃');
  assert(frostSpellslinger.opener.steps.slice(0, 4).map(row => row.skillId).join(',') === '116,44614,84714,205021', 'Spellslinger must retain its sourced opening order');
  assert(frostFrostfire.opener.steps.slice(0, 4).map(row => row.skillId).join(',') === '431044,205021,44614,84714', 'Frostfire must retain its distinct sourced opening order');
  assert(JSON.stringify(frostFrostfire).includes('정점') && JSON.stringify(frostFrostfire.aoe).includes('GCD') && JSON.stringify(frostFrostfire.aoe).includes('신속한 재동결'), 'Frostfire AoE must retain no-apex, channel clipping and tier conditions');

  const fire = manuscripts['mage-fire'];
  const fireSource = path.join(SITE_ROOT, '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base', '06-마법사', '화염', 'Meta', 'guide-12.1.json');
  if (fs.existsSync(fireSource)) {
    assert(JSON.stringify(JSON.parse(read(fireSource))) === JSON.stringify(fire), 'Fire must match its canonical 12.1 manuscript');
  }
  const fireNotes = Object.values(kbSkills).filter(skill => /[\\/]06-마법사[\\/]화염[\\/]/.test(skill.source?.kbPath || ''));
  assert(fireNotes.length === 53 && fireNotes.every(skill => skill.patch === '12.1' && skill.description?.length >= 25), 'All 53 Fire notes must retain reviewed descriptions');
  assert(!fire.extraSkills?.length && !kbSkills['383860'], 'Fire must not revive obsolete Hyperthermia or bypass canonical spells');
  assert(['383874', '269651', '1257350', '458964', '48107', '48108'].every(id => kbSkills[id]?.type === 'buff'), 'Fire proc buffs must not appear as direct casts');
  assert(['1257343', '1257349', '1257348'].every(id => kbSkills[id]?.type === 'spec-talent'), 'All three Fired Up nodes must remain distinct');
  assert(kbSkills['1296584']?.type === 'passive' && kbSkills['1296584']?.description.includes('25%'), 'Fire S2 4pc must retain the current tooltip bonus');
  assert(kbSkills['431044']?.type === 'atomic-skill' && kbSkills['449596']?.description.includes('12%p'), 'Frostfire Bolt and revised Rondurmancy must retain their current identities');
  for (const branch of fire.heroBranches) {
    assert(branch.opener.steps.length >= 6 && branch.singleTarget.priority.length >= 8 && branch.aoe.priority.length >= 8, 'Each Fire hero needs authored opener, ST and AoE modes');
    assert(JSON.stringify(branch.singleTarget.priority) !== JSON.stringify(branch.aoe.priority), 'Fire ST and AoE must retain distinct conditions');
    for (const mode of [branch.opener, branch.singleTarget, branch.aoe]) {
      for (const row of [...(mode.steps || []), ...(mode.priority || [])]) {
        assert(kbSkills[row.skillId]?.type === 'atomic-skill' && row.note.length > 25, 'Fire flows must use actual casts and complete conditions');
      }
    }
  }

  const survival = manuscripts['hunter-survival'];
  const survivalSource = path.join(SITE_ROOT, '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base', '05-사냥꾼', '생존', 'Meta', 'guide-12.1.json');
  if (fs.existsSync(survivalSource)) {
    assert(JSON.stringify(JSON.parse(read(survivalSource))) === JSON.stringify(survival), 'Survival must match its canonical 12.1 manuscript');
  }
  const survivalNotes = Object.values(kbSkills).filter(skill => /[\\/]05-사냥꾼[\\/]생존[\\/]/.test(skill.source?.kbPath || ''));
  assert(survivalNotes.length === 58 && survivalNotes.every(skill => skill.patch === '12.1' && skill.description?.length >= 25), 'All 58 Survival notes must retain reviewed descriptions');
  assert(!survival.extraSkills?.length && !kbSkills['1251592'], 'Survival must not revive removed Flamefang Pitch or bypass canonical spells');
  assert(kbSkills['1262293']?.type === 'atomic-skill' && ['1259003', '1259017', '1259019'].every(id => kbSkills[id]?.type === 'spec-talent') && kbSkills['1273155']?.type === 'buff', 'Raptor Swipe cast, all apex nodes and prepared buff must remain distinct');
  assert(kbSkills['260285']?.type === 'spec-talent' && kbSkills['260286']?.type === 'buff', 'Tip of the Spear talent and consumable buff need separate IDs');
  assert(kbSkills['1261229']?.description.includes('3초') && kbSkills['1253825']?.description.includes('6초'), 'Survival shell and Moon Blessing reductions must retain 12.1 values');
  assert(kbSkills['459843']?.description.includes('60%') && kbSkills['1250646']?.cooldown === '1.5분' && kbSkills['1250646']?.description.includes('90초'), 'Grenade recharge speed and Takedown base cooldown must remain current');
  assert(['1296636', '1296635'].every(id => kbSkills[id]?.type === 'passive') && kbSkills['1296636']?.description.includes('2세트') && kbSkills['1296635']?.description.includes('1초'), 'S2 internal names must not reverse the actual 2pc and 4pc effects');
  assert(survival.graphCenterSkillId === '259495' || survival.graphCenterSkillId === 259495, 'Survival graph must use the actual central Wildfire Bomb spell');
  for (const branch of survival.heroBranches) {
    assert(branch.opener.steps.length >= 6 && branch.singleTarget.priority.length >= 8 && branch.aoe.priority.length >= 8, 'Each Survival hero needs authored opener, ST and AoE modes');
    assert(JSON.stringify(branch.singleTarget.priority) !== JSON.stringify(branch.aoe.priority), 'Survival ST and AoE must retain distinct conditions');
    for (const mode of [branch.opener, branch.singleTarget, branch.aoe]) {
      for (const row of [...(mode.steps || []), ...(mode.priority || [])]) {
        assert(kbSkills[row.skillId]?.type === 'atomic-skill' && row.note.length > 25, 'Survival flows must use actual casts and complete conditions');
      }
    }
  }
  const packLeaderSurvival = survival.heroBranches.find(branch => branch.label === '무리의 지도자');
  assert(!JSON.stringify(packLeaderSurvival).includes('"skillId":"1264949"') && packLeaderSurvival.opener.steps.find(row => row.skillId === '1250646').trigger.includes('두 개'), 'Pack Leader must not borrow Chakram or lose its non-Twin-Fangs Takedown condition');
  const survivalTakedown = packLeaderSurvival.opener.steps.findIndex(row => row.skillId === '1250646');
  assert(packLeaderSurvival.opener.steps[survivalTakedown + 1]?.skillId === '259489', 'Pack Leader must execute its prepared summon after Takedown');

  const marksmanship = manuscripts['hunter-marksmanship'];
  const marksmanshipSource = path.join(SITE_ROOT, '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base', '05-사냥꾼', '사격', 'Meta', 'guide-12.1.json');
  if (fs.existsSync(marksmanshipSource)) {
    assert(JSON.stringify(JSON.parse(read(marksmanshipSource))) === JSON.stringify(marksmanship), 'Marksmanship must match its canonical 12.1 manuscript');
  }
  const marksmanshipNotes = Object.values(kbSkills).filter(skill => /[\\/]05-사냥꾼[\\/]사격[\\/]/.test(skill.source?.kbPath || ''));
  assert(marksmanshipNotes.length === 58 && marksmanshipNotes.every(skill => skill.patch === '12.1' && skill.description?.length >= 25), 'All 58 Marksmanship records, including passive set effects, must survive sync');
  assert(!marksmanship.extraSkills?.length && ['473370', '264198', '473379'].every(id => !kbSkills[id]), 'Marksmanship must not revive obsolete Double Tap or unavailable old traits');
  assert(['260240', '257621', '389019'].every(id => kbSkills[id]?.type === 'spec-talent') && ['260242', '257622', '389020'].every(id => kbSkills[id]?.type === 'buff'), 'Marksmanship talents and consumable buffs need separate IDs');
  assert(kbSkills['471428']?.name === '물량 공세' && kbSkills['471428']?.description.includes('추가로 적용') && kbSkills['473520']?.name === '유동성 제동장치', 'Renamed Marksmanship talents must retain their current identities and additional-cast effect');
  assert(['1273132', '1273129', '1273128'].every(id => kbSkills[id]?.type === 'spec-talent') && kbSkills['1301098']?.type === 'buff', 'All three Take Aim nodes and the separate Rapid Fire mark must exist');
  assert(kbSkills['1302277']?.type === 'buff' && kbSkills['467897']?.description.includes('다음 조준 사격'), 'Death Bringer preparation must not become immediate Deathblow for Marksmanship');
  assert(['1296633', '1296634', '1253733', '1253836', '1266096'].every(id => kbSkills[id]?.type === 'passive' && kbSkills[id]?.description.length > 25), 'Set and automatic hero effects must not disappear in an unsupported folder');
  assert(kbSkills['1296634']?.description.includes('0.5초') && kbSkills['1253825']?.description.includes('1초'), 'S2 periodic-event and Moon Blessing reductions must keep their distinct conditions');
  assert(kbSkills['1264902']?.type === 'hero-talent' && kbSkills['1264949']?.type === 'atomic-skill' && kbSkills['1264949']?.specs.join(',') === 'Marksmanship,Survival', 'Chakram talent and shared real cast must remain distinct');
  for (const branch of marksmanship.heroBranches) {
    assert(branch.opener.steps.length >= 6 && branch.singleTarget.priority.length >= 8 && branch.aoe.priority.length >= 8, 'Each Marksmanship hero needs separately authored opener, ST and AoE modes');
    assert(JSON.stringify(branch.singleTarget.priority) !== JSON.stringify(branch.aoe.priority), 'Marksmanship ST and AoE must not duplicate one priority list');
    for (const mode of [branch.opener, branch.singleTarget, branch.aoe]) {
      for (const row of [...(mode.steps || []), ...(mode.priority || [])]) {
        assert(kbSkills[row.skillId]?.type === 'atomic-skill' && row.note.length > 25, 'Marksmanship flows must use real casts and preserve their conditions');
      }
    }
    assert(branch.opener.steps.filter(row => row.skillId === '212431').length === 2 && branch.opener.summary.includes('유동성 제동장치'), 'Double Explosive Shot openers must retain their build condition');
  }
  assert(!JSON.stringify(marksmanship.heroBranches[0]).includes('"skillId":"466930"') && !JSON.stringify(marksmanship.heroBranches[1]).includes('"skillId":"1264949"'), 'Marksmanship hero casts must not leak across branches');

  const beastMastery = manuscripts['hunter-beastmastery'];
  const beastMasterySource = path.join(SITE_ROOT, '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base', '05-사냥꾼', '야수', 'Meta', 'guide-12.1.json');
  if (fs.existsSync(beastMasterySource)) {
    assert(JSON.stringify(JSON.parse(read(beastMasterySource))) === JSON.stringify(beastMastery), 'Beast Mastery must match its canonical 12.1 manuscript');
  }
  const beastMasteryNotes = Object.values(kbSkills).filter(skill => /[\\/]05-사냥꾼[\\/]야수[\\/]/.test(skill.source?.kbPath || ''));
  assert(beastMasteryNotes.length === 42 && beastMasteryNotes.every(skill => skill.patch === '12.1' && skill.description?.length >= 25 && !skill.description.startsWith('#')), 'All 42 Beast Mastery records need reviewed effect descriptions');
  assert(!beastMastery.extraSkills?.length && !kbSkills['321530'], 'Beast Mastery must use current canonical spells, not old Bloodshed or extraSkills');
  assert(kbSkills['1272099']?.type === 'spec-talent' && kbSkills['120679']?.type === 'spec-talent', 'Bloodshed and Dire Beast must remain passive');
  assert(kbSkills['19574']?.cooldown.includes('90초') && kbSkills['231548']?.description.includes('60초'), 'Bestial Wrath base cooldown and talent reduction must remain distinct');
  assert(kbSkills['115939']?.description.includes('10초') && kbSkills['115939']?.description.includes('70%') && kbSkills['378207']?.description.includes('20%'), 'Beast Cleave and Kill Cleave must not share one coefficient');
  assert(kbSkills['393933']?.description.includes('3초') && kbSkills['424558']?.description.includes('0.5초'), 'War Orders and Master Handler must retain separate cooldown reductions');
  assert(kbSkills['1276720']?.type === 'buff' && ['1273043', '1273065', '1273126'].every(id => kbSkills[id]?.type === 'spec-talent'), 'All three apex talents and their actual buff must remain distinct');
  assert(kbSkills['471876']?.type === 'hero-talent' && kbSkills['471878']?.type === 'buff', 'Howl talent and effect IDs must remain distinct');
  assert(kbSkills['1299389']?.type === 'buff' && kbSkills['1296632']?.description.includes('20%') && kbSkills['1296632']?.description.includes('30%'), 'S2 Cobra Fang must retain conditional ST and AoE values');
  assert(kbSkills['53351']?.specs.join(',') === 'Marksmanship', 'Kill Shot must not leak into Beast Mastery');
  for (const branch of beastMastery.heroBranches) {
    assert(branch.opener.steps.length >= 6 && branch.singleTarget.priority.length >= 6 && branch.aoe.priority.length >= 8, 'Each Beast Mastery hero needs separately authored opener, ST and AoE modes');
    assert(JSON.stringify(branch.singleTarget.priority) !== JSON.stringify(branch.aoe.priority), 'Beast Mastery ST and AoE must retain distinct conditions');
    for (const mode of [branch.opener, branch.singleTarget, branch.aoe]) {
      for (const row of [...(mode.steps || []), ...(mode.priority || [])]) {
        assert(kbSkills[row.skillId]?.type === 'atomic-skill' && row.note.length > 25, 'Beast Mastery flows must contain actual casts and complete conditions');
      }
    }
    const wrath = branch.aoe.steps.findIndex(row => row.skillId === '19574');
    assert(branch.aoe.steps[wrath + 1]?.skillId === '1264359', 'Apex AoE examples must apply Wild Thrash to the newly summoned pet');
  }
  assert(!JSON.stringify(beastMastery.heroBranches[0]).includes('"skillId":"466930"') && beastMastery.heroBranches[1].singleTarget.priority.some(row => row.skillId === '392060'), 'Pack Leader must not borrow Dark Ranger casts');
  const scopedSynergies = Object.values(JSON.parse(read(path.join(SITE_ROOT, 'src', 'data', 'kb-synergies.json'))).synergies);
  const mageFrostSynergies = scopedSynergies.filter(row => row.class === 'Mage' && row.spec === 'Frost');
  assert(mageFrostSynergies.length === 18 && mageFrostSynergies.every(row => row.description?.length > 30 && row.participants.every(id => kbSkills[id])), 'All 18 Frost relationships need real participants and authored explanations');
  assert(mageFrostSynergies.every(row => row.participants.every(id => !['1296585', '1296586'].includes(id))), 'Frost graph must show actual stack/proc effects instead of internal set icons');
  const survivalSynergies = scopedSynergies.filter(row => row.class === 'Hunter' && row.spec === 'Survival');
  assert(survivalSynergies.length === 16 && survivalSynergies.every(row => row.description?.length > 50 && row.participants.every(id => kbSkills[id])), 'All 16 Survival relationships need real participants and authored explanations');
  assert(survivalSynergies.every(row => row.participants.every(id => !['1296636', '1296635'].includes(id))), 'Survival graph must use actual Mongoose Fury instead of internal tier-effect placeholders');
  const marksmanshipSynergies = scopedSynergies.filter(row => row.id.startsWith('hunter_mm_'));
  assert(marksmanshipSynergies.length === 15 && marksmanshipSynergies.every(row => row.description?.length > 50 && row.participants.every(id => kbSkills[id])), 'All 15 authored Marksmanship relationships must retain real participants and descriptions');
  assert(!scopedSynergies.find(row => row.id === 'hunter_hero_sentinel_moonstorm_lunar')?.participants.includes('1264781'), 'Sentinel must not borrow Pack Leader Lethal Barbs');
  assert(scopedSynergies.find(row => row.id === 'hunter_hero_sentinel_moonstorm_lunar')?.specs.join(',') === 'Marksmanship,Survival', 'Synergy generation must preserve specialization scopes');
  assert(scopedSynergies.find(row => row.id === 'hunter_hero_dark_ranger_black_arrow_shadow')?.specs.join(',') === 'BeastMastery,Marksmanship', 'Dark Ranger synergy must retain its shared but limited scope');

  const augmentation = manuscripts['evoker-augmentation'];
  const augmentationSource = path.join(SITE_ROOT, '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base', '04-기원사', '증강', 'Meta', 'guide-12.1.json');
  if (fs.existsSync(augmentationSource)) {
    assert(JSON.stringify(JSON.parse(read(augmentationSource))) === JSON.stringify(augmentation), 'Augmentation must match its canonical 12.1 KB manuscript');
  }
  const augmentationNotes = Object.values(kbSkills).filter(skill => /[\\/]04-기원사[\\/]증강[\\/]/.test(skill.source?.kbPath || ''));
  assert(augmentationNotes.length === 42 && augmentationNotes.every(skill => skill.patch === '12.1' && skill.description?.length > 40 && !skill.description.startsWith('#')), 'All 42 Augmentation records must retain reviewed descriptions through sync');
  assert(!augmentation.extraSkills?.length, 'Augmentation spells must resolve from the canonical KB');
  for (const branch of augmentation.heroBranches) {
    assert(branch.opener.steps.length >= 6 && branch.singleTarget.priority.length >= 8 && branch.aoe.priority.length >= 8, 'Each Augmentation hero needs authored opener, ST and AoE modes');
    assert(JSON.stringify(branch.singleTarget.priority) !== JSON.stringify(branch.aoe.priority), 'Augmentation ST and AoE must retain distinct conditions');
    for (const mode of [branch.opener, branch.singleTarget, branch.aoe]) {
      for (const row of [...(mode.steps || []), ...(mode.priority || [])]) {
        assert(kbSkills[row.skillId]?.type === 'atomic-skill' && row.note.length > 25, 'Augmentation modes require actual casts and full conditions, not passive/tier/pet effects');
        assert(row.skillId !== '357210', 'The selected Breath of Eons examples must not also prescribe Deep Breath');
      }
    }
  }
  const [chronowarden, scalecommander] = augmentation.heroBranches;
  const order = (branch, id) => branch.opener.steps.findIndex(row => row.skillId === id);
  assert(order(chronowarden, '403631') < order(chronowarden, '395152') && order(scalecommander, '395152') < order(scalecommander, '403631'), 'Hero-specific Ebon/Eons opener ordering must not be merged');
  assert(!JSON.stringify(scalecommander).includes('"skillId":"404977"') && !JSON.stringify(scalecommander).includes('"skillId":"431443"'), 'Scalecommander Interwoven Threads must not borrow Time Skip or Chronowarden casts');
  assert(kbSkills['359618']?.specs.join(',') === 'Devastation' && kbSkills['396187']?.specs.join(',') === 'Augmentation', 'Essence Burst IDs must remain specialization-scoped');
  assert(kbSkills['431442']?.type === 'hero-talent' && kbSkills['431443']?.type === 'atomic-skill', 'Chrono Flame talent and real cast must remain distinct');
  assert(kbSkills['431874']?.type === 'hero-talent' && kbSkills['460688']?.type === 'buff', 'Double-time talent and separate buff must remain distinct');
  assert(kbSkills['441206']?.description.includes('1.5초') && kbSkills['1296637']?.description.includes('10초'), 'Wingleader hit reduction and S2 Upheaval reduction must retain current values');
  assert(kbSkills['1296638']?.description.includes('8초') && kbSkills['1296638']?.description.includes('45%'), 'S2 Fate Mirror damage amount must retain its separate eight-second condition');
  assert(kbSkills['1259171']?.type === 'buff' && ['1259173', '1259174', '1259175'].every(id => ['talent', 'spec-talent'].includes(kbSkills[id]?.type)), 'Duplicate buff and all three talent nodes must remain distinct');
  assert(kbSkills['357210']?.specs.includes('Augmentation') && kbSkills['375722']?.specs.includes('Augmentation'), 'Shared casts and talents must not be hidden by their original Devastation storage folder');

  const feral = manuscripts['druid-feral'];
  const feralSource = path.join(SITE_ROOT, '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base', '03-드루이드', '야성', 'Meta', 'guide-12.1.json');
  if (fs.existsSync(feralSource)) {
    assert(JSON.stringify(JSON.parse(read(feralSource))) === JSON.stringify(feral), 'Feral must match its canonical 12.1 KB manuscript');
  }
  const feralNotes = Object.values(kbSkills).filter(skill => /[\\/]03-드루이드[\\/]야성[\\/]/.test(skill.source?.kbPath || ''));
  assert(feralNotes.length === 51 && feralNotes.every(skill => skill.patch === '12.1' && skill.description?.length > 40 && !skill.description.startsWith('#')), 'All 51 Feral records must retain reviewed descriptions through sync');
  assert(!kbSkills['106830'] && kbSkills['77758']?.specs.includes('Guardian'), 'Removed cat Thrash must not remove the current Guardian cast');
  assert(kbSkills['1301600']?.name === '할라지의 격노' && kbSkills['1301600']?.type === 'buff', 'Feral tier graph must use the actual passive buff and official icon');
  assert(kbSkills['1296605']?.description.includes('유효 연계 점수') && kbSkills['1296605']?.description.includes('0.75초'), 'Feral tier must retain effective CP and conditional duration');
  assert(kbSkills['391709']?.description.includes('도려내기 대상 제한이 없'), 'Rampant Ferocity must not regain the stale Rip-only target rule');
  assert(kbSkills['155625']?.name === '달빛섬광' && kbSkills['155580']?.name === '달 바라기', 'Feral Moonfire must resolve its own cast and official talent name');
  for (const branch of feral.heroBranches) {
    assert(branch.opener.steps.length >= 6 && branch.singleTarget.priority.length >= 8 && branch.aoe.priority.length >= 8, 'Feral requires separately authored opener, ST and AoE content for each hero');
    assert(JSON.stringify(branch.singleTarget.priority) !== JSON.stringify(branch.aoe.priority), 'Feral ST and AoE must not duplicate the same priority');
    for (const mode of [branch.opener, branch.singleTarget, branch.aoe]) {
      for (const row of [...(mode.steps || []), ...(mode.priority || [])]) {
        assert(kbSkills[row.skillId]?.type === 'atomic-skill' && row.note.length > 25, 'Feral mode rows must contain real cast buttons and complete use conditions');
      }
    }
    assert(branch.singleTarget.priority.some(row => row.skillId === '1079') && branch.aoe.priority.some(row => row.skillId === '285381'), 'Feral ST Rip and AoE Primal Wrath must stay distinct');
  }
  assert(!feral.heroBranches[0].aoe.priority.some(row => row.skillId === '391528'), 'The Feral Incarnation example must not also require Convoke');
  assert(!feral.heroBranches[1].aoe.priority.some(row => row.skillId === '441591'), 'Wildstalker must not borrow Claw Ravage');
  assert(!feral.extraSkills?.length, 'Feral spells must resolve from the canonical KB');
  assert(kbSkills['1244258']?.type === 'atomic-skill' && kbSkills['1244258']?.castTime === '즉시' && kbSkills['1244258']?.cooldown === '20초', 'Chomp is an optional active, not a Claw passive');
  assert(kbSkills['1244258']?.description.includes('30%') && kbSkills['1244258']?.description.includes('2초'), 'Chomp must retain both energy and grace-period conditions');
  assert(kbSkills['441591']?.specs.join(',') === 'Feral' && kbSkills['441591']?.type === 'atomic-skill', 'Feral must use its own Ravage cast, not the hero node or Guardian attack');
  assert(kbSkills['158476']?.name === '숲의 영혼' && !kbSkills['114113'], 'Soul of the Forest must reference the current talent node');
  assert(kbSkills['274837']?.resourceCost === '기력 25' && kbSkills['1244544']?.description.includes('30초'), 'Feral Frenzy must retain its cost and conditional cooldown reduction');
  assert(kbSkills['384667']?.description.includes('직접 피해') && kbSkills['390772']?.description.includes('60%'), 'Sudden Ambush and stealth Pouncing Strikes must stay distinct');
  for (const id of ['1263827', '1263902']) {
    assert(kbSkills[id]?.type === 'buff' && kbSkills[id]?.castTime === '지속 효과', 'Unseen attacks are automatic effects, not player casts');
  }
  assert(kbSkills['1263827']?.name === '보이지 않는 서슬', 'Unseen Slash must use the official Korean name');
  assert(!feral.opener.steps.some(step => ['1244258', '441583', '441605', '1263827', '1263902'].includes(step.skillId)), 'Feral default flow must not invent Chomp selection or use passive/other-spec cast IDs');

  const bloodSource = path.join(SITE_ROOT, '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base', '01-죽음의기사', '혈기', 'Meta', 'guide-12.1.json');
  const blood = manuscripts['deathknight-blood'];
  if (fs.existsSync(bloodSource)) {
    assert(JSON.stringify(JSON.parse(read(bloodSource))) === JSON.stringify(blood), 'Blood guide must match its canonical 12.1 KB manuscript');
  }
  assert(!blood.extraSkills?.length, 'Blood guide must resolve spells from the KB, not extraSkills');
  for (const [id, name] of [['1310372', '피로 치를 빚'], ['391398', '혈안'], ['374747', '칠흑의 기사단의 인내'], ['434033', '피에 젖은 땅']]) {
    assert(kbSkills[id]?.name === name && kbSkills[id]?.patch === '12.1', `Blood 12.1 KB entry missing: ${name}`);
  }
  assert(kbSkills['1263824']?.castTime === '강화 주문' && kbSkills['1263824']?.cooldown === '45초', 'Consumption must be an empower spell with a 45-second cooldown');
  assert(kbSkills['441378']?.specs.includes('Blood') && kbSkills['441378']?.specs.includes('Frost'), 'Exterminate must support both Blood and Frost');
  assert(kbSkills['77513']?.aliases?.includes('피의 보호막'), 'Blood Shield shorthand must resolve to the official mastery entry');
  assert(kbSkills['195181']?.castTime === '지속 효과', 'Bone Shield is a buff, not an independently cast defensive');
  assert(kbSkills['195292']?.cooldown === '6초' && kbSkills['195292']?.patch === '12.1', 'Death\'s Caress must retain its current cooldown');
  assert(kbSkills['1263774']?.name === '핏빛 안개' && kbSkills['1264235']?.patch === '12.1', 'Blood Mist and Deadly Reach must use current talent IDs');
  for (const id of ['1264506', '1264405', '1264351']) {
    assert(kbSkills[id]?.name === '한밤의 춤' && kbSkills[id]?.patch === '12.1', `Blood apex rank ${id} must keep the official Korean name and current patch`);
  }
  assert(kbSkills['1264405']?.description.includes('6%') && kbSkills['1264351']?.description.includes('8초'), 'Blood apex defense and proc duration must be documented separately');
  for (const [id, name, fact] of [['317614', '피의 희열', '37.5%'], ['273953', '탐식', '15%'], ['194662', '신속한 부패', '85%'], ['391517', '흡혈의 구', '6배']]) {
    assert(kbSkills[id]?.name === name && kbSkills[id]?.specs.includes('Blood') && kbSkills[id]?.description.includes(fact), `Blood 12.1 talent must have its current tooltip effect: ${name}`);
  }
  assert(kbSkills['434157']?.specs.includes('Blood') && kbSkills['434157']?.specs.includes('Unholy') && kbSkills['434157']?.description.includes('6%'), 'Visceral Strength must retain the later Blood hotfix and distinct Unholy effect');
  const bloodSynergies = JSON.parse(read(path.join(SITE_ROOT, 'src', 'data', 'kb-synergies.json'))).synergies;
  assert(bloodSynergies['피로치를빚_골수분쇄']?.description?.includes('10중첩'), 'Blood Debt synergy must retain its authored KB mechanism through sync');
  assert(!bloodSynergies.deathknight_blood_deaths_caress_fatal_touch, 'Death\'s Caress must not link to Deadly Reach');
  assert(bloodSynergies.deathknight_blood_deadly_reach_death_strike?.participants.join(',') === '1264235,49998', 'Deadly Reach must link to Death Strike cleave');
  assert(bloodSynergies.deathknight_blood_dance_active_weapons?.participants.includes('1264405'), 'Blood apex defensive rank must connect to active weapons');
  assert(bloodSynergies.deathknight_blood_dance_rune_proc?.participants.includes('1264351'), 'Blood apex rune proc must connect to rune spenders');
  assert(bloodSynergies['진홍빛스컬지_피의희열_원초적본능의힘']?.participants.includes('434157'), 'Blood Crimson Scourge spend must connect to Visceral Strength');
  assert(bloodSynergies['피의역병_흡혈의구']?.description.includes('85%를 보호막에 곱하지'), 'Blood disease healing and Umbilicus shield must stay separate');
  assert(blood.blocks.some(section => section.paragraphs.some(text => text.includes('흡혈의 구') && text.includes('6배'))), 'Blood guide must explain the actual Blood Plague shield condition');
  assert(blood.blocks.some(section => section.paragraphs.some(text => text.includes('활성 룬 무기 하나당') && text.includes('받는 피해를 6%'))), 'Blood guide must explain the current apex defensive value');
  assert(blood.inlineTermSpellIds?.['한밤의 춤'] === '1264506', 'Blood inline tooltip must choose the base apex rank rather than a same-name later rank');
  assert(blood.blocks.some(section => section.paragraphs.some(text => text.includes('핏빛 안개') && text.includes('18%'))), 'Blood guide must explain conditional Blood Mist and Sanguinary Burst');
  assert(blood.opener.steps.some(step => step.skillId === '195182' && step.trigger.includes('10중첩')), 'Blood combat flow must include the tier-set Marrowrend condition');
  assert(!blood.opener.steps.some(step => ['1310372', '1296651', '441378'].includes(step.skillId)), 'Blood passive tier/proc effects must not be cast nodes');
  assert(blood.heroBranches[0].label === '산레인' && blood.heroBranches[0].summary.includes('쐐기'), 'Blood default hero branch must reflect Season 2 Sanlayn guidance');

  const arcaneSource = path.join(SITE_ROOT, '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base', '06-마법사', '비전', 'Meta', 'guide-12.1.json');
  const havoc = manuscripts['demonhunter-havoc'];
  const havocSource = path.join(SITE_ROOT, '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base', '02-악마사냥꾼', '파멸', 'Meta', 'guide-12.1.json');
  if (fs.existsSync(havocSource)) {
    assert(JSON.stringify(JSON.parse(read(havocSource))) === JSON.stringify(havoc), 'Havoc guide must match its canonical 12.1 KB manuscript');
  }
  assert(!havoc.extraSkills?.length, 'Havoc spells must come from the canonical KB');
  assert(!kbSkills['323639']?.specs.includes('Havoc') && !kbSkills['452490']?.specs.includes('Havoc'), 'Havoc must not use the covenant Hunt or Sigil of Doom');
  assert(kbSkills['370965']?.castTime === '1초' && kbSkills['370965']?.icon === 'inv_ability_demonhunter_thehunt', 'Havoc Hunt must use the current cast and icon');
  assert(kbSkills['188499']?.cooldown === '15초' && kbSkills['210152']?.cooldown === '9초', 'Base Blade Dance and Death Sweep cooldowns must remain distinct');
  assert(kbSkills['258860']?.resourceCost === '없음', 'Essence Break must not inherit a spender Fury cost');
  assert(kbSkills['1270901']?.description.includes('다음 칼춤 사용 시') && kbSkills['1270901']?.description.includes('초기화'), 'Apex must explain the next-cast reset, not immediate cooldown removal');
  assert(kbSkills['1296612']?.description.includes('35%') && kbSkills['1296612']?.description.includes('4초에서 6초'), 'Havoc tier set must retain its current effects through sync');
  const havocNotes = Object.values(kbSkills).filter(skill => /[\\/]02-악마사냥꾼[\\/]파멸[\\/]/.test(skill.source?.kbPath || '') && /^\d+$/.test(skill.id));
  assert(havocNotes.length === 54, 'Havoc must retain all 54 reviewed atomic notes');
  for (const skill of havocNotes) {
    assert(skill.patch === '12.1' && skill.description?.length > 40 && !skill.description.startsWith('#'), 'Havoc DB must retain real KB descriptions, not title-only parser fallbacks: ' + skill.id);
  }
  for (const id of ['258920', '442290', '442686', '452408', '452409', '452414', '452415']) {
    assert(kbSkills[id]?.description?.length > 40 && !kbSkills[id].description.startsWith('#'), 'Shared Havoc records must retain real descriptions through sync: ' + id);
  }
  assert(havoc.heroBranches[0].label === '지옥상흔' && havoc.heroBranches[1].label === '알드라치 파괴자', 'Havoc must retain distinct hero explanations and flows');
  const aldrachiSteps = havoc.heroBranches[1].opener.steps;
  assert(aldrachiSteps.findIndex(step => step.skillId === '201427') < aldrachiSteps.findIndex(step => step.skillId === '210152'), 'Aldrachi AoE flow must consume Rending Strike before Glaive Flurry');
  for (const flow of [havoc.opener, ...havoc.heroBranches.map(branch => branch.opener)]) {
    for (const step of flow.steps) {
      assert(['skill', 'atomic-skill'].includes(kbSkills[step.skillId]?.type) && !/지속 효과|패시브/.test(kbSkills[step.skillId]?.castTime || ''), 'Havoc flow nodes must be actual casts, not passive or damage-effect IDs');
      assert(step.phase && step.trigger && step.note, 'Havoc flows must retain their resource and talent conditions');
    }
  }
  assert(bloodSynergies['dh-havoc-안광-연속휩쓸기']?.description?.includes('한 번 시전한 뒤'), 'Havoc apex synergy must keep its authored reset explanation');
  const vengeance = manuscripts['demonhunter-vengeance'];
  const vengeanceSource = path.join(SITE_ROOT, '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base', '02-악마사냥꾼', '복수', 'Meta', 'guide-12.1.json');
  if (fs.existsSync(vengeanceSource)) {
    assert(JSON.stringify(JSON.parse(read(vengeanceSource))) === JSON.stringify(vengeance), 'Vengeance must match its canonical 12.1 KB manuscript');
  }
  assert(!vengeance.extraSkills?.length, 'Vengeance must resolve spells from the canonical KB');
  assert(!kbSkills['212800']?.specs.includes('Vengeance') && kbSkills['212800']?.specs.includes('Havoc') && kbSkills['212800']?.specs.includes('Devourer'), 'Blur must not leak from shared storage into Vengeance');
  assert(kbSkills['179057']?.resourceCost === '격노 25' && kbSkills['179057']?.cooldown === '45초' && kbSkills['1490']?.type === 'buff', 'DH common records must retain current costs and passive classification');
  for (const id of ['1490', '131347', '179057', '183752', '196718', '212800', '278326']) {
    assert(kbSkills[id]?.patch === '12.1' && !kbSkills[id]?.description.startsWith('#'), 'Reviewed common DH notes must have real descriptions: ' + id);
  }
  assert(kbSkills['247454']?.cooldown === '25초' && kbSkills['247454']?.resourceCost === '격노 40', 'Spirit Bomb must retain its cooldown and Fury cost');
  assert(kbSkills['228477']?.resourceCost === '격노 35' && kbSkills['212084']?.cooldown === '40초', 'Vengeance spender costs and Fel Devastation cooldown must stay current');
  assert(kbSkills['204021']?.description.includes('자신의 받는 피해를 40%'), 'Fiery Brand must describe personal damage reduction, not the old enemy-only reduction');
  assert(kbSkills['1270444']?.description.includes('직접 시전') && kbSkills['1270444']?.castTime === '지속 효과', 'Untethered Rage grants a manual Meta use, not an automatic transformation');
  assert(kbSkills['263648']?.description.includes('8%') && kbSkills['263648']?.description.includes('2%') && kbSkills['263648']?.castTime === '지속 효과', 'Soul Barrier must keep its current passive shield effect');
  assert(kbSkills['1296613']?.description.includes('주 대상') && kbSkills['1296614']?.description.includes('100%'), 'Vengeance tier effects must retain target conditions');
  assert(kbSkills['1253391']?.description.includes('3중첩') && kbSkills['1253391']?.description.includes('모든 중첩') && kbSkills['218612']?.description.includes('격노를 20'), 'Meteoric Fall and Feed the Demon must keep their actual consumption rules');
  for (const id of ['442294', '442624', '442679', '442806', '442718', '1272153', '232893']) {
    assert(kbSkills[id]?.specs.includes('Vengeance') && kbSkills[id]?.specs.includes('Havoc'), 'Shared DH spell must retain both verified spec scopes: ' + id);
  }
  const vengeanceNotes = Object.values(kbSkills).filter(skill => /[\\/]02-악마사냥꾼[\\/]복수[\\/]/.test(skill.source?.kbPath || '') && /^\d+$/.test(skill.id));
  assert(vengeanceNotes.length === 44, 'Vengeance must retain all 44 reviewed local atomic notes');
  assert(vengeanceNotes.every(skill => skill.patch === '12.1' && skill.description?.length > 40 && !skill.description.startsWith('#')), 'Vengeance descriptions must survive canonical sync');
  for (const flow of [vengeance.opener, ...vengeance.heroBranches.map(branch => branch.opener)]) {
    assert(flow.steps.every(step => ['skill', 'atomic-skill'].includes(kbSkills[step.skillId]?.type) && step.trigger && step.note), 'Vengeance flows must contain real casts and resource conditions');
  }
  const vengeanceAldrachi = vengeance.heroBranches[1].opener.steps;
  for (const branch of vengeance.heroBranches) {
    assert(branch.priority?.length > 10 && branch.priority.every(row => ['skill', 'atomic-skill'].includes(kbSkills[row.skillId]?.type) && row.note.length > 30), 'Vengeance requires authored, actionable priorities for each hero branch');
  }
  assert(!vengeance.heroBranches[0].priority.some(row => row.skillId === '442294'), 'Annihilator must not include Aldrachi Glaive in its priority');
  const aldrachiPriority = vengeance.heroBranches[1].priority;
  assert(aldrachiPriority.findIndex(row => row.skillId === '442294') < aldrachiPriority.findIndex(row => row.skillId === '263642') && aldrachiPriority.findIndex(row => row.skillId === '263642') < aldrachiPriority.findIndex(row => row.skillId === '228477'), 'Aldrachi priority must retain Glaive, empowered Fracture, empowered Soul Cleave order');
  const glaiveIndex = vengeanceAldrachi.findIndex(step => step.skillId === '442294');
  assert(vengeanceAldrachi[glaiveIndex + 1]?.skillId === '263642' && vengeanceAldrachi[glaiveIndex + 2]?.skillId === '228477', 'Vengeance Aldrachi flow must consume Fracture before Soul Cleave');
  assert(bloodSynergies['dh-vengeance-고삐풀린분노-탈태']?.description.includes('자동 변신이 아니며'), 'Vengeance apex relationship must retain its manual-use explanation');

  const guardian = manuscripts['druid-guardian'];
  const guardianSource = path.join(SITE_ROOT, '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base', '03-드루이드', '수호', 'Meta', 'guide-12.1.json');
  if (fs.existsSync(guardianSource)) {
    assert(JSON.stringify(JSON.parse(read(guardianSource))) === JSON.stringify(guardian), 'Guardian must match its canonical 12.1 KB manuscript');
  }
  assert(!guardian.extraSkills?.length, 'Guardian spells must resolve from the canonical KB');
  assert(!kbSkills['343240'] && kbSkills['50334']?.specs.includes('Guardian'), 'Guardian must use the current Berserk, not the legacy split node');
  assert(kbSkills['429539']?.description.includes('고정 20초'), 'Guardian Lunation must retain fixed cooldown reduction');
  assert(kbSkills['135288']?.description.includes('후려갈기기 또는 말살'), 'Tooth and Claw must retain the correct spender');
  assert(kbSkills['1269619']?.description.includes('시전하면') && kbSkills['1269658']?.type === 'atomic-skill', 'Wild Guardian must separate the passive charge grant from the actual button');
  for (const [id, label] of [['1269614', '야생 수호자 첫 노드'], ['1269617', '야생 수호자 중간 노드'], ['1269619', '야생 수호자 마지막 노드']]) {
    assert(kbSkills[id]?.aliases.includes(label), 'Guardian apex explanations must resolve to their own node tooltips');
  }
  assert(kbSkills['441583']?.castTime === '지속 효과' && kbSkills['441605']?.specs.join(',') === 'Guardian', 'Ravage talent and Guardian cast IDs must stay separate');
  assert(kbSkills['1251406']?.specs.join(',') === 'Guardian', 'Persistence must not leak from shared storage to other druid specs');
  assert(kbSkills['370586']?.description.includes('18%'), 'Elune healing must not retain the old June value');
  for (const branch of guardian.heroBranches) {
    assert(branch.opener.steps.length >= 10 && branch.priority.length >= 12, 'Guardian requires separate authored hero flows and priorities');
    for (const row of [...branch.opener.steps, ...branch.priority]) {
      assert(kbSkills[row.skillId]?.type === 'atomic-skill' && row.note.length > 20, 'Guardian actionable rows must be actual player casts with conditions');
    }
  }
  const guardianNotes = Object.values(kbSkills).filter(skill => /[\\/]03-드루이드[\\/]수호[\\/]/.test(skill.source?.kbPath || '') && /^\d+$/.test(skill.id));
  assert(guardianNotes.length >= 41 && guardianNotes.every(skill => skill.patch === '12.1' && skill.description?.length > 30 && !skill.description.startsWith('#')), 'Guardian descriptions must survive canonical sync');
  assert(bloodSynergies['guardian-야생수호자-생성기']?.participants.includes('33917') && !bloodSynergies['guardian-야생수호자-생성기']?.participants.includes('22842'), 'Guardian apex must connect generators, not Frenzied Regeneration');

  const unholy = manuscripts['deathknight-unholy'];
  const unholySource = path.join(SITE_ROOT, '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base', '01-죽음의기사', '부정', 'Meta', 'guide-12.1.json');
  if (fs.existsSync(unholySource)) {
    assert(JSON.stringify(JSON.parse(read(unholySource))) === JSON.stringify(unholy), 'Unholy guide must match its canonical 12.1 KB manuscript');
  }
  assert(!unholy.extraSkills?.length, 'Unholy spells must come from the canonical KB');
  assert(kbSkills['444040']?.specs.includes('Unholy') && kbSkills['444040']?.specs.includes('Frost'), 'Apocalypse Now must be available to both Rider specializations for inline spell rendering');
  assert(unholy.graphCenterSkillId === '1247378', 'Unholy graph must use the connected Putrefy cast as its center');
  assert(unholy.heroBranches[0].label === '종말의 기수' && unholy.heroBranches[0].summary.includes('레이드'), 'Unholy must explain the current Rider raid baseline');
  assert(unholy.heroBranches[1].label === '산레인' && unholy.heroBranches[1].summary.includes('쐐기'), 'Unholy must explain the current Sanlayn M+ baseline');
  assert(unholy.heroBranches[1].opener.steps.some(step => step.skillId === '433895'), 'Sanlayn needs an authored Vampiric Strike flow');
  assert(!unholy.opener.steps.some(step => step.skillId === '433895'), 'Rider opener must not borrow the Sanlayn-only strike');
  for (const flow of [unholy.opener, ...unholy.heroBranches.map(branch => branch.opener)]) {
    for (const step of flow.steps) {
      assert(kbSkills[step.skillId]?.castTime === '즉시', 'Unholy opener nodes must be actual player cast buttons');
      assert(!['63560', '455397', '1271974', '1241567', '1241569', '1297086', '1297091', '1296654', '1296655', '1256813'].includes(step.skillId), 'Unholy passive, pet and effect IDs must not become cast steps');
      assert(step.phase && step.trigger && step.note, 'Unholy flows must retain their conditions');
    }
  }
  assert(kbSkills['1241567']?.patch === '12.1' && kbSkills['1241567']?.description.includes('10%'), 'Unholy cleave must use the current passive and live chain reduction');
  assert(kbSkills['276023']?.description.includes('2.5초'), 'Harbinger must explain the summon-based Putrefy cooldown reduction');
  assert(unholy.priority.some(item => item.skillId === '207317' && item.note.includes('3대상') && item.note.includes('4대상')), 'Unholy spender thresholds must distinguish normal and apex states');
  assert(!JSON.stringify(unholy).includes('97.6%') && !JSON.stringify(unholy).includes('99.8%'), 'Old June usage percentages must not return as current Unholy evidence');
  const frost = manuscripts['deathknight-frost'];
  const frostSource = path.join(SITE_ROOT, '..', 'WoW-Meta-Knowledge', '08-직업별-Knowledge-Base', '01-죽음의기사', '냉기', 'Meta', 'guide-12.1.json');
  if (fs.existsSync(frostSource)) {
    assert(JSON.stringify(JSON.parse(read(frostSource))) === JSON.stringify(frost), 'Frost guide must match its canonical 12.1 KB manuscript');
  }
  assert(!frost.extraSkills?.length, 'Frost spells must come from the canonical KB');
  assert(!kbSkills['152279'], 'Legacy draining Breath must not remain in the current spell DB');
  assert(kbSkills['1249658']?.patch === '12.1' && kbSkills['1249658']?.description.includes('0.8초'), 'Current Breath must use the proc-extension spell ID');
  assert(kbSkills['1249658']?.cooldown === '90초', 'Current Breath has a 90-second base cooldown');
  assert(kbSkills['279302']?.cooldown === '90초', 'Frostwyrm first cast has a 90-second base cooldown, distinct from recall');
  assert(kbSkills['1297365']?.name === '얼어붙는 폭풍우' && kbSkills['1297365']?.description.includes('속도 1%'), 'Frost tier set must use the current live tooltip, not old PTR tuning');
  assert(kbSkills['377253']?.description.includes('얼음 기둥'), 'Frozen Dominion must explain automatic Winter');
  assert(kbSkills['281238']?.description.includes('무료'), 'Obliteration must include the free-spender interaction');
  assert(!collectActiveSkillRefs(frost).some(([, id]) => String(id) === '152279'), 'Current Frost guide must not link the obsolete Breath ID');
  assert(frost.heroBranches[0].flowSkillIds.every(id => kbSkills[id]?.castTime === '즉시'), 'Rider flow icons must show actual cast buttons, not its passive defining talents');
  for (const flow of [frost.opener, ...frost.heroBranches.map(branch => branch.opener).filter(Boolean)]) {
    for (const step of flow.steps) {
      assert(kbSkills[step.skillId]?.castTime === '즉시', 'Frost opener nodes must be actual cast buttons');
      assert(!['441378', '1297365', '196770', '455993', '281238'].includes(step.skillId), 'Frost passive/automatic effects must be conditions, not cast nodes');
      assert(step.phase && step.trigger && step.note, 'Frost hero flow must retain its authored conditions');
    }
  }
  assert(!frost.opener.steps.some(step => step.skillId === '439843'), 'Rider opener must not cast a Deathbringer talent');
  assert(frost.heroBranches[1].opener.steps.some(step => step.skillId === '439843'), 'Deathbringer requires its own authored Mark flow');
  if (fs.existsSync(arcaneSource)) {
    assert(JSON.stringify(JSON.parse(read(arcaneSource))) === JSON.stringify(manuscripts['mage-arcane']), 'Arcane guide must match its canonical KB manuscript');
  }
  assert(kbSkills['1295924']?.name === '오색 화살' && kbSkills['1295924']?.patch === '12.1', 'Arcane Prismatic Bolt must be synced from the 12.1 KB');
  assert(kbSkills['1296930']?.description.includes('24%'), 'Arcane tier set must use the post-tuning 24% cap');
  assert(isInactiveGuideSkill(kbSkills['1257942']), 'Touch of the Archmage must not return as an active talent');

  assert(readySpecs.length === EXPECTED_GUIDE_COUNT, `ready guide count must be ${EXPECTED_GUIDE_COUNT}, got ${readySpecs.length}`);

  readySpecs.forEach(spec => {
    const manuscript = manuscripts[spec.id];
    assert(manuscript, `${spec.id}: guide manuscript is missing`);
    if (manuscript) validateManuscript(spec, manuscript, kbSkills);
  });

  Object.keys(manuscripts).forEach(id => {
    assert(readySpecs.some(spec => spec.id === id), `${id}: manuscript is not present in ready guide registry`);
  });

  if (errors.length) {
    console.error(`Guide manuscript validation failed (${errors.length}):`);
    errors.slice(0, 80).forEach(error => console.error(`  - ${error}`));
    if (errors.length > 80) {
      console.error(`  ... and ${errors.length - 80} more`);
    }
    process.exit(1);
  }

  console.log(`Guide manuscript validation passed: ${readySpecs.length} guides`);
}

main();
