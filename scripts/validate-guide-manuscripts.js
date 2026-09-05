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
  ['priest-holy', '12.1'],
  ['druid-restoration', '12.1'],
  ['paladin-holy', '12.1'],
  ['evoker-preservation', '12.1'],
  ['monk-mistweaver', '12.1'],
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
  'evoker-augmentation:1259173',
  'evoker-augmentation:396187',
  'warlock-demonology:1276222',
  'monk-brewmaster:115069',
  'monk-brewmaster:450508',
  'monk-brewmaster:450615',
  'rogue-outlaw:381989',
  'rogue-outlaw:1277933',
  'rogue-subtlety:1268932',
  'priest-holy:114255',
  'priest-holy:390992',
  'priest-holy:392988',
  'priest-shadow:1242173',
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
const PRACTICAL_TIP_CONTEXT_PATTERN = /\uB808\uC774\uB4DC|\uC3D0\uAE30|\uB2E8\uC77C|\uAD11\uC5ED|\uD480|\uBCF4\uC2A4|\uD30C\uD2F0|\uACF5\uB300|\uB85C\uADF8|\uC804\uD22C/u;
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
    date: '2026-06-02',
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
    !GENERAL_AWKWARD_COPY_PATTERN.test(text),
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
  if (requiredHotfix) {
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
  assert(/Discord|Dreamgrove|Fel Hammer|Acherus|Skyhold|Ravenholdt|Earthshrine|Warcraft Priests|Peak of Serenity|Wyrmrest|Ancestral Guidance/i.test(sourceText), `${prefix}: class Discord/public community evidence is missing`);
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
