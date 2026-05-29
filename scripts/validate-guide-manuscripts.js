#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SITE_ROOT = path.resolve(__dirname, '..');
const REGISTRY_PATH = path.join(SITE_ROOT, 'src', 'data', 'guideRegistry.js');
const MANUSCRIPT_PATH = path.join(SITE_ROOT, 'src', 'data', 'guideManuscripts.js');
const SKILLS_PATH = path.join(SITE_ROOT, 'src', 'data', 'kb-skills.json');
const EXPECTED_PATCH = process.env.WOWMETA_EXPECTED_PATCH || '12.0.5';
const EXPECTED_GUIDE_COUNT = Number(process.env.WOWMETA_EXPECTED_GUIDE_COUNT || 40);

const MINIMUMS = {
  sources: 7,
  openerSteps: 6,
  priorityItems: 6,
  evidenceItems: 4,
  blockItems: 6,
  tipItems: 4,
};

const TRUST_TIERS = new Set(['S', 'A', 'B', 'C']);
const OPENER_FLOW_PATTERN = /전투 흐름|피해 대응|진입|풀링|지원 구간|지원 창|상태 전환/i;
const LIST_LIKE_OPENER_PATTERN = /오프닝 딜사이클|오프닝 순서표|오프닝 목록|아이콘 레일|레일 컴포넌트/i;
const INTERNAL_COPY_PATTERN = /원고|프로토타입|내부 문서|이 문서|문서에서|문서에서는|시각화 배치 기준|이 페이지의 시각화|보조 시각화|차트 배치/i;
const PRIEST_AWKWARD_COPY_PATTERN = /고가치|피해 기여|딜 기여|중심축|상위 행동|판단 축|복구축|전환 축|피해 주문 축|유지 축|영웅 특성 축|영웅 특성 분기|예열 압축|품질/i;
const LOG_SOURCE_PATTERN = /Archon|WCL|Warcraft Logs/i;
const COMMUNITY_SOURCE_PATTERN = /Discord|Dreamgrove|Fel Hammer|Acherus|Death's Advance|Skyhold|Ravenholdt|Earthshrine|Warcraft Priests|Peak of Serenity|Wyrmrest|Ancestral Guidance|Altered Time|Trueshot Lodge|공개 서버|공개 경로|컴펜디엄/i;
const LOG_EVIDENCE_PATTERN = /표본|parses?|DPS|HPS|쐐기돌|사용률|채택률|추천 .*빌드|상위 50%|상위 5%|최근 14일/i;
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

function validateSource(spec, source, index) {
  const prefix = `${spec.id}.sources[${index}]`;

  assert(TRUST_TIERS.has(source.tier), `${prefix}: tier must be one of S/A/B/C`);
  assert(source.label, `${prefix}: label is missing`);
  assert(source.url && /^https?:\/\//.test(source.url), `${prefix}: url must be an absolute web URL`);
  assert(source.updated, `${prefix}: updated date/context is missing`);
  assert(source.note && source.note.length >= 12, `${prefix}: note is too thin`);
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
}

function validateSkillReferences(spec, manuscript, kbSkills) {
  const extraSkills = new Set((manuscript.extraSkills || []).map(skill => String(skill.id)));
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

  skillRefs.forEach(([field, value]) => {
    const id = String(value || '');
    assert(id, `${spec.id}.${field}: skill id is missing`);
    assert(kbSkills[id] || extraSkills.has(id), `${spec.id}.${field}: skill id ${id} is not in KB or extraSkills`);
  });
}

function validateSpecSpecificCurrentPatchRules(spec, manuscript) {
  const prefix = spec.id;
  const text = combinedManuscriptText(manuscript);

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

  if (spec.id === 'druid-restoration') {
    assert(text.includes('상록숲'), `${prefix}: must cover 상록숲/Everbloom Apex talent`);
    assert(
      (manuscript.sources || []).some(source => /상록숲|392167/.test(sourceText(source))),
      `${prefix}: sources[] must include official 상록숲 392167 tooltip evidence`
    );
    assert(
      (manuscript.priority || []).some(item => String(item.skillId) === '392167'),
      `${prefix}: priority must include 상록숲 392167`
    );
    assert(
      /숲 수호자.{0,120}(패시브|발동)/.test(text),
      `${prefix}: must frame 숲 수호자 as a passive/proc, not an active opener button`
    );
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
  const openerText = [
    manuscript.opener?.title,
    manuscript.opener?.summary,
  ].filter(Boolean).join(' ');

  assert(manuscript.patch === EXPECTED_PATCH, `${prefix}: patch must be ${EXPECTED_PATCH}`);
  assert(manuscript.researchedAt, `${prefix}: researchedAt is missing`);
  assert(manuscript.summary && manuscript.summary.length >= 80, `${prefix}: summary is too thin`);
  assert(manuscript.sourceNote && manuscript.sourceNote.length >= 120, `${prefix}: sourceNote is too thin`);
  assert(!INTERNAL_COPY_PATTERN.test(manuscriptText), `${prefix}: contains internal/prototype copy`);
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
    assert(step.label, `${stepPrefix}: label is missing`);
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
  validateSpecSpecificCurrentPatchRules(spec, manuscript);
}

function main() {
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
