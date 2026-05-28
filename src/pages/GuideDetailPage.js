import React, { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
  Activity,
  ArrowLeft,
  BookOpen,
  Clock3,
  Gauge,
  Link2,
  Map as MapIcon,
  Shield,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';
import {
  CURRENT_PATCH_LABEL,
  getAllGuideSpecs,
} from '../data/guideRegistry.js';
import guideManuscripts from '../data/guideManuscripts.js';
import kbSkills from '../data/kb-skills.json';
import kbSynergies from '../data/kb-synergies.json';

const allGuides = getAllGuideSpecs();
const allSkills = Object.values(kbSkills.skills || {});
const allSynergies = Object.values(kbSynergies.synergies || {});
const skillById = new Map(allSkills.map(skill => [String(skill.id), skill]));
const manualSkills = Object.values(guideManuscripts).flatMap(manuscript => manuscript.extraSkills || []);
const manualSkillById = new Map(manualSkills.map(skill => [String(skill.id), skill]));
const commonSpecs = new Set(['공용', 'Common']);
const OPENER_FLOW_MAX_STEPS = 12;

const roleProfiles = {
  tanks: {
    label: '탱커',
    cycleTitle: '진입/방어 전투 흐름',
    priorityTitle: '방어 우선순위',
    resourceTitle: '자원/완화 곡선',
    plannerTitle: '생존기 대응 플래너',
    lead: '큰 피해 전 완화 기술을 먼저 배치하고, 받은 피해 회복과 유틸은 다음 위험 구간을 기준으로 남깁니다.',
    steps: ['풀링 전 완충', '초기 위협', '주 방어 유지', '마법/물리 대응', '자원 회수', '광역 제어', '다음 피해 준비', '정리'],
  },
  melee: {
    label: '근접 딜러',
    cycleTitle: '오프닝 전투 흐름',
    priorityTitle: '딜사이클 우선순위',
    resourceTitle: '자원 흐름',
    plannerTitle: '위험 구간 대응',
    lead: '근접 위치를 유지하면서 자원 생성, 강화 창, 고가치 소모 기술을 한 루프로 묶습니다.',
    steps: ['전투 시작', '주요 창 열기', '고가치 기술', '자원 소모', '발동 반응', '반복 루프', '광역 전환', '마무리'],
  },
  ranged: {
    label: '원거리 딜러',
    cycleTitle: '오프닝 전투 흐름',
    priorityTitle: '딜사이클 우선순위',
    resourceTitle: '자원/시전 흐름',
    plannerTitle: '이동 구간 대응',
    lead: '시전 손실을 줄이면서 핵심 쿨기와 자원 소모 기술을 대상 수 변화에 맞춰 전환합니다.',
    steps: ['전투 시작', '강화 준비', '주요 시전', '자원 소모', '발동 반응', '대상 전환', '광역 전환', '마무리'],
  },
  healers: {
    label: '힐러',
    cycleTitle: '피해 대응 전투 흐름',
    priorityTitle: '힐링 우선순위',
    resourceTitle: '마나/회복 곡선',
    plannerTitle: '공격대 피해 대응표',
    lead: '피해가 들어온 뒤 반응하기보다 사전 작업, 광역 회복, 외생기 배치를 시간표로 관리합니다.',
    steps: ['피해 전 준비', '유지 효과', '주요 회복', '광역 회복', '외생기 배치', '마나 절약', '다음 피해 대비', '정리'],
  },
  support: {
    label: '지원 딜러',
    cycleTitle: '지원 전투 흐름',
    priorityTitle: '지원 우선순위',
    resourceTitle: '강화 유지 흐름',
    plannerTitle: '파티 극딜 정렬표',
    lead: '개인 피해보다 아군 강화 유지율과 파티 극딜 창 정렬을 먼저 봅니다.',
    steps: ['강화 부여', '파티 창 정렬', '버프 유지', '대상 확인', '광역 지원', '자원 보정', '다음 강화 준비', '정리'],
  },
};

const defensivePattern = /보호|방패|방벽|방어|생존|회피|무쇠|껍질|보루|희생|축복|대마법|마법|흡혈|인내|요새|결의|고통|쐐기|재생|수호|어둠|흐릿/i;
const healPattern = /치유|회복|소생|빛|신성|구원|기도|평온|해일|만개|꽃|안개|보호막|고치|재생|해방|정화/i;
const utilityPattern = /차단|침묵|해제|정화|기절|감속|도발|이동|질주|돌진|축복|관문|해방|마법|군중|제어|인장|토템/i;

function normalizePath(path) {
  return path.replace(/\/+$/, '');
}

function uniqueBy(items, keyFn) {
  const seen = new Set();
  const result = [];

  items.forEach(item => {
    const key = keyFn(item);
    if (!key || seen.has(key)) return;
    seen.add(key);
    result.push(item);
  });

  return result;
}

function skillName(skill) {
  return skill?.koreanName || skill?.name || skill?.englishName || '스킬';
}

function cleanText(value) {
  return String(value || '').trim();
}

function displayGuideText(value) {
  return cleanText(value)
    .replace(/특성 문서/g, '특성 가이드')
    .replace(/운용 문서/g, '운용 가이드')
    .replace(/딜사이클 문서/g, '딜사이클 가이드')
    .replace(/회전 문서/g, '딜사이클 가이드')
    .replace(/개요 문서/g, '개요 가이드')
    .replace(/본 문서/g, '이 가이드')
    .replace(/이 문서/g, '이 가이드')
    .replace(/문서에서는/g, '가이드에서는')
    .replace(/문서에서/g, '가이드에서')
    .replace(/문서의/g, '가이드의')
    .replace(/문서가/g, '가이드가')
    .replace(/문서/g, '가이드')
    .replace(/이 페이지/g, '이 가이드')
    .replace(/기본 본문/g, '기본 설명')
    .replace(/공통 본문/g, '공통 설명')
    .replace(/본문/g, '설명')
    .replace(/별도 장/g, '별도 파트')
    .replace(/오프닝 딜사이클/g, '오프닝 전투 흐름')
    .replace(/오프닝 순서표/g, '오프닝 전투 흐름')
    .replace(/시각자료/g, '차트')
    .replace(/보조 자료/g, '확인용 차트')
    .replace(/직접 인용하지 않습니다/g, '공개로 확인되는 내용만 반영합니다')
    .replace(/회복HoT/g, '회복 지속 치유')
    .replace(/\bHoT\b/g, '지속 치유')
    .replace(/\bDoT\b/g, '지속 피해')
    .replace(/\bRotation Guide\b/g, '운용 가이드')
    .replace(/\bRotation\b/g, '딜사이클')
    .replace(/\bOpener\b/g, '오프닝')
    .replace(/\bMythic\+ high keys\b/gi, '쐐기 고단')
    .replace(/\bMythic\+\b/g, '쐐기')
    .replace(/\bHigh Keys\b/g, '쐐기 고단')
    .replace(/\bMythic All Bosses\b/g, '신화 전체 보스')
    .replace(/\bMythic Raid\b/g, '신화 레이드')
    .replace(/\bAll Dungeons\b/g, '전체 던전')
    .replace(/고정 딜사이클/g, '고정 순서')
    .replace(/\bBurst\b/g, '극딜')
    .replace(/\bProc\b/g, '발동')
    .replace(/\bUptime\b/g, '유지율')
    .replace(/\bbuilder-spender\b/gi, '생성-소비')
    .replace(/\bspender\b/gi, '소비기')
    .replace(/\bfiller\b/gi, '채우기 기술')
    .replace(/\bwindow\b/gi, '창')
    .replace(/\bAnnihilator\b/g, '궤멸자')
    .replace(/\bAldrachi Reaver\b/g, '알드라치 파괴자')
    .replace(/\bVoid-Scarred\b/g, '공허상흔')
    .replace(/\bFel-Scarred\b/g, '지옥상흔')
    .replace(/\bColossus\b/g, '거신')
    .replace(/\bSlayer\b/g, '학살자')
    .replace(/\bMountain\s*Thane\b/g, '산왕')
    .replace(/\bMountainThane\b/g, '산왕')
    .replace(/\bSpec & Hero\b/g, '전문화+영웅 빌드')
    .replace(/\bKeystone\b/g, '쐐기돌')
    .replace(/\bparses\b/gi, '파싱')
    .replace(/\bStormbringer\b/g, '폭풍인도자')
    .replace(/\bFarseer\b/g, '선견자')
    .replace(/\bTotemic\b/g, '토템술사')
    .replace(/\bMidnight\b/g, '한밤')
    .replace(/오프닝\s*(딜사이클|레일)/g, '오프닝 전투 흐름')
    .replace(/첫\s*전투\s*딜사이클/g, '첫 전투 흐름')
    .replace(/진입\s*딜사이클/g, '진입 전투 흐름')
    .replace(/피해\s*대응\s*딜사이클/g, '피해 대응 전투 흐름')
    .replace(/준비 레일/g, '준비 전투 흐름')
    .replace(/레일/g, '흐름도')
    .replace(/\bGrove Guardians\b/g, '숲 수호자')
    .replace(/\bSwiftmend\b/g, '신속한 치유')
    .replace(/\bRegrowth\b/g, '재생')
    .replace(/\bFlourish\b/g, '번성')
    .replace(/\bCommon\b/g, '공용')
    .replace(/번성하는성장물/g, '번성하는 성장물')
    .replace(/\bSpellslinger\b/g, '주문술사')
    .replace(/\bSunfury\b/g, '성난태양')
    .replace(/\bFrostfire\b/g, '서리불꽃')
    .replace(/\bSoul Harvester\b/g, '영혼 수확자')
    .replace(/\bHellcaller\b/g, '지옥소환사')
    .replace(/\bDiabolist\b/g, '악마학자')
    .replace(/\bLightsmith\b/g, '빛대장장이')
    .replace(/\bMidnight\b/g, '한밤')
    .replace(/\bStage\s*1\b/g, '1단계')
    .replace(/\bStage\s*2\b/g, '2단계')
    .replace(/\bStage\s*3\b/g, '3단계')
    .replace(/\bVoidweaver\b/g, '공허술사')
    .replace(/\bOracle\b/g, '예언자');
}

function synergyName(synergy) {
  return displayGuideText(synergy?.name || '시너지');
}

function synergyTypeLabel(synergy) {
  const raw = cleanText(synergy?.synergyType);
  const name = synergyName(synergy);
  const combined = `${raw} ${name}`;

  if (/archon|집정관|후광|공허의형상/i.test(combined)) return '집정관 창';
  if (/voidweaver|공허술사|혼돈의균열|공허폭발/i.test(combined)) return '공허술사 창';
  if (/execute|처형|죽음예언자/i.test(combined)) return '처형 관리';
  if (/oracle|예언자-|두 개의 시야|경건|보장된 안전|즉발적인 예측/i.test(combined)) return '예언자 보조';
  if (/mythic|쐐기/i.test(raw)) return '쐐기 유틸';
  if (/raid|공격대/i.test(raw)) return '공격대 유틸';
  if (/defensive|survival|생존/i.test(raw)) return '생존 관리';
  if (/healing|heal|치유/i.test(raw)) return '치유 창';
  if (/damage|딜|피해/i.test(raw)) return '피해 창';
  return '연결 시스템';
}

function isNone(value) {
  return !value || /^(없음|none|0|0초|-|n\/a)$/i.test(cleanText(value));
}

function hasCooldown(skill) {
  return !isNone(skill?.cooldown);
}

function hasResource(skill) {
  return !isNone(skill?.resourceCost);
}

function hasCast(skill) {
  return !isNone(skill?.castTime);
}

function getIconUrl(skill, size = 'medium') {
  return skill?.iconUrls?.[size] || skill?.iconUrl || (skill?.icon ? `https://wow.zamimg.com/images/wow/icons/${size}/${skill.icon}.jpg` : '');
}

function wowheadUrl(skill) {
  return `https://ko.wowhead.com/spell=${skill.id}`;
}

function buildInlineTerms(data, manuscript) {
  const seen = new Set();
  const records = [
    ...(data?.specSkills || []),
    ...(data?.commonSkills || []),
    ...(data?.classSkills || []),
    ...(manuscript?.extraSkills || []),
  ];

  return records
    .flatMap(skill => {
      const labels = [skillName(skill), skill?.koreanName, skill?.name, skill?.englishName, ...(skill?.aliases || [])]
        .map(cleanText)
        .filter(Boolean);

      return labels.map(label => ({ label, skill }));
    })
    .filter(({ label, skill }) => {
      if (!skill?.id || label.length < 2 || /^https?:\/\//i.test(label)) return false;
      const key = label.toLocaleLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => b.label.length - a.label.length);
}

const inlineWordCharPattern = /[A-Za-z0-9가-힣]/;
const koreanParticlePattern = /^(은|는|이|가|을|를|에|의|와|과|도|만|로|으로|부터|까지|보다|처럼|라도|이라도|라면|이면|이며|이고|이나|나|랑|하고|께서)/;

function hasInlineTermBoundary(text, index, label) {
  const prev = text[index - 1];
  if (prev && inlineWordCharPattern.test(prev)) return false;

  const nextIndex = index + label.length;
  const next = text[nextIndex];
  if (!next || !inlineWordCharPattern.test(next)) return true;

  return koreanParticlePattern.test(text.slice(nextIndex, nextIndex + 4));
}

function findInlineTerm(text, terms, startIndex) {
  let best = null;

  terms.forEach(term => {
    const index = text.indexOf(term.label, startIndex);
    if (index === -1) return;
    if (!hasInlineTermBoundary(text, index, term.label)) return;
    if (
      !best ||
      index < best.index ||
      (index === best.index && term.label.length > best.term.label.length)
    ) {
      best = { index, term };
    }
  });

  return best;
}

function renderGuideText(value, terms) {
  const text = displayGuideText(value);
  if (!text || !terms?.length) return text;

  const nodes = [];
  let cursor = 0;

  while (cursor < text.length) {
    const match = findInlineTerm(text, terms, cursor);
    if (!match) {
      nodes.push(text.slice(cursor));
      break;
    }

    if (match.index > cursor) {
      nodes.push(text.slice(cursor, match.index));
    }

    const label = text.slice(match.index, match.index + match.term.label.length);
    nodes.push(
      <InlineSkillTerm key={`${match.term.skill.id}-${match.index}-${nodes.length}`} skill={match.term.skill}>
        {label}
      </InlineSkillTerm>
    );
    cursor = match.index + match.term.label.length;
  }

  return nodes;
}

function formatSkillMeta(skill) {
  const parts = [
    hasCooldown(skill) ? `쿨 ${skill.cooldown}` : '',
    hasResource(skill) ? skill.resourceCost : '',
    hasCast(skill) ? skill.castTime : '',
  ].filter(Boolean);

  return parts.length ? parts.join(' · ') : '상황별 사용';
}

function parseCooldownSeconds(skill) {
  const value = cleanText(skill?.cooldown);
  const minute = value.match(/(\d+(?:\.\d+)?)\s*분/);
  if (minute) return Number(minute[1]) * 60;

  const second = value.match(/(\d+(?:\.\d+)?)\s*초/);
  if (second) return Number(second[1]);

  const plain = value.match(/(\d+(?:\.\d+)?)/);
  return plain ? Number(plain[1]) : 0;
}

function scoreSkill(skill, guide) {
  const name = skillName(skill);
  let score = 0;

  if (hasCooldown(skill)) score += 5;
  if (hasResource(skill)) score += 3;
  if (hasCast(skill)) score += 1;
  if (skill.spec !== '공용' && skill.spec !== 'Common') score += 4;
  score += Number(skill?.quality?.synergyCount || 0);
  score += Number(skill?.quality?.wikilinkCount || 0) / 4;

  if (guide.role === 'tanks' && defensivePattern.test(name)) score += 6;
  if (guide.role === 'healers' && healPattern.test(name)) score += 6;
  if (utilityPattern.test(name)) score += 2;

  return score;
}

function recordMatchesGuide(record, guide, includeCommon = true) {
  if (!record || record.class !== guide.kbClass) return false;
  const listedSpecs = Array.isArray(record.specs) ? record.specs.map(spec => String(spec)) : [];
  if (listedSpecs.some(spec => guide.kbSpecAliases.includes(spec))) return true;
  if (includeCommon && commonSpecs.has(record.spec)) return true;
  return guide.kbSpecAliases.includes(record.spec);
}

function normalizeSkillLookupText(value) {
  return cleanText(value)
    .replace(/\\/g, '/')
    .replace(/\.md$/i, '')
    .split('/')
    .pop()
    .replace(/[-_\s'’]/g, '')
    .toLocaleLowerCase();
}

function skillLookupKeys(skill) {
  return [
    skillName(skill),
    skill?.koreanName,
    skill?.name,
    skill?.englishName,
    skill?.source?.kbPath,
  ]
    .map(normalizeSkillLookupText)
    .filter(Boolean);
}

function getSynergySkills(synergy, scopedSkills) {
  const byId = (synergy.participants || [])
    .map(id => skillById.get(String(id)))
    .filter(Boolean);

  const byLink = (synergy.linkedSkills || [])
    .map(link => {
      const key = normalizeSkillLookupText(link);
      if (!key) return null;
      return scopedSkills.find(skill => skillLookupKeys(skill).includes(key));
    })
    .filter(Boolean);

  if (byId.length || byLink.length) {
    return uniqueBy([...byId, ...byLink], skill => String(skill.id));
  }

  const name = normalizeSkillLookupText(synergy.name);
  return scopedSkills
    .filter(skill => skillLookupKeys(skill).some(key => key && name.includes(key)))
    .slice(0, 5);
}

function synergyImportance(synergy) {
  const value = Number(synergy?.importance || 0);
  return Number.isFinite(value) && value > 0 ? Math.min(value, 10) : 3;
}

function synergyLinkedCount(synergy, scopedSkills) {
  const linkedSkills = getSynergySkills(synergy, scopedSkills);
  return linkedSkills.length || synergy?.linkedSkills?.length || synergy?.participants?.length || 0;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getGuideCoreSkillIds(guide) {
  const manuscript = guideManuscripts[guide.id];
  const ids = [];

  manuscript?.priority?.forEach(item => {
    if (item?.skillId) ids.push(String(item.skillId));
  });

  manuscript?.opener?.steps?.forEach(step => {
    if (step?.skillId) ids.push(String(step.skillId));
  });

  return new Set(ids);
}

function getSynergyGraphCenter(data, guide) {
  const manuscript = guideManuscripts[guide.id];
  const scopedIds = new Set((data.scopedSkills || []).map(skill => String(skill.id)));
  const coreSkillIds = getGuideCoreSkillIds(guide);
  const scores = new Map();

  (data.synergies || []).forEach(synergy => {
    const linkedSkills = uniqueBy(
      getSynergySkills(synergy, data.scopedSkills)
        .filter(skill => scopedIds.has(String(skill.id))),
      skill => String(skill.id)
    );
    const importance = synergyImportance(synergy);

    linkedSkills.forEach(skill => {
      const key = String(skill.id);
      const current = scores.get(key) || {
        skill,
        connectionCount: 0,
        weightedScore: 0,
        synergies: [],
      };

      current.connectionCount += 1;
      current.weightedScore += importance * 3 + Math.min(linkedSkills.length, 12) + scoreSkill(skill, guide) / 8;
      current.synergies.push(synergy);
      scores.set(key, current);
    });
  });

  const ranked = [...scores.values()].sort((a, b) => (
    b.connectionCount - a.connectionCount ||
    b.weightedScore - a.weightedScore ||
    scoreSkill(b.skill, guide) - scoreSkill(a.skill, guide)
  ));

  const guideCoreRanked = ranked.filter(record => coreSkillIds.has(String(record.skill.id)));
  const preferredCenterId = manuscript?.graphCenterSkillId ? String(manuscript.graphCenterSkillId) : '';
  const preferredCenter = ranked.find(record => String(record.skill.id) === preferredCenterId);
  if (preferredCenter) return preferredCenter;
  if (guideCoreRanked[0]) return guideCoreRanked[0];
  if (ranked[0]) return ranked[0];

  const fallback = data.featuredSkills?.[0] || data.scopedSkills?.[0];
  return fallback ? {
    skill: fallback,
    connectionCount: Number(fallback?.quality?.synergyCount || 0),
    weightedScore: scoreSkill(fallback, guide),
    synergies: [],
  } : null;
}

function graphElementId(prefix, value, fallbackIndex = 0) {
  const raw = String(value || '');
  const safe = raw.replace(/[^a-zA-Z0-9_-]/g, '');
  const suffix = Number.isFinite(Number(fallbackIndex)) ? `-${fallbackIndex}` : '';
  if (safe) return `${prefix}-${safe}${suffix}`;

  let hash = 0;
  for (let index = 0; index < raw.length; index += 1) {
    hash = ((hash << 5) - hash + raw.charCodeAt(index)) | 0;
  }

  return `${prefix}-${Math.abs(hash).toString(36)}${suffix}`;
}

function graphLabelLines(value, maxChars = 9) {
  const text = cleanText(value).replace(/\s+/g, ' ');
  if (!text) return [];
  if (text.length <= maxChars) return [text];

  const separators = ['-', '·', ':', ' '];
  const splitAt = separators
    .map(separator => text.lastIndexOf(separator, maxChars + 2))
    .filter(index => index > 2)
    .sort((a, b) => b - a)[0];

  if (splitAt) {
    return [
      text.slice(0, splitAt).replace(/[-·:\s]+$/g, ''),
      text.slice(splitAt + 1, splitAt + 1 + maxChars).replace(/^[-·:\s]+/g, ''),
    ].filter(Boolean);
  }

  return [text.slice(0, maxChars), text.slice(maxChars, maxChars * 2)].filter(Boolean);
}

function getSynergyGraphModel(data, guide) {
  const width = 1000;
  const height = 660;
  const centerPoint = { x: 500, y: 330 };
  const center = getSynergyGraphCenter(data, guide);
  const centerId = center?.skill?.id ? String(center.skill.id) : '';
  const scopedIds = new Set((data.scopedSkills || []).map(skill => String(skill.id)));

  const synergyRecords = (data.synergies || [])
    .map(synergy => {
      const allLinkedSkills = uniqueBy(
        getSynergySkills(synergy, data.scopedSkills)
          .filter(skill => scopedIds.has(String(skill.id))),
        skill => String(skill.id)
      );
      const linkedToCenter = !!centerId && allLinkedSkills.some(skill => String(skill.id) === centerId);
      const linkedSkills = allLinkedSkills.filter(skill => String(skill.id) !== centerId).slice(0, 5);
      const importance = synergyImportance(synergy);
      const linkedCount = allLinkedSkills.length || synergyLinkedCount(synergy, data.scopedSkills);
      const weight = importance * 2 + linkedCount + (linkedToCenter ? 10 : 0);
      return {
        synergy,
        allLinkedSkills,
        linkedSkills,
        linkedCount,
        linkedToCenter,
        importance,
        weight,
        size: Math.min(132, 68 + importance * 6 + Math.min(linkedCount, 36) * 1.2 + (linkedToCenter ? 8 : 0)),
      };
    })
    .filter(node => node.linkedCount > 0)
    .sort((a, b) => (
      Number(b.linkedToCenter) - Number(a.linkedToCenter) ||
      b.weight - a.weight ||
      b.linkedCount - a.linkedCount
    ))
    .slice(0, 11);

  const skillScores = new Map();
  synergyRecords.forEach(record => {
    record.linkedSkills.forEach(skill => {
      const key = String(skill.id);
      const current = skillScores.get(key) || {
        skill,
        connectionCount: 0,
        weightedScore: 0,
        synergies: [],
      };

      current.connectionCount += 1;
      current.weightedScore += record.weight + scoreSkill(skill, guide) / 7;
      current.synergies.push(record.synergy);
      skillScores.set(key, current);
    });
  });

  const skillRecords = [...skillScores.values()]
    .sort((a, b) => (
      b.connectionCount - a.connectionCount ||
      b.weightedScore - a.weightedScore ||
      scoreSkill(b.skill, guide) - scoreSkill(a.skill, guide)
    ))
    .slice(0, 14);

  const synergyCount = Math.max(synergyRecords.length, 1);
  const synergyNodes = synergyRecords.map((record, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / synergyCount + (index % 2 ? 0.09 : -0.05);
    const radiusX = record.linkedToCenter ? 305 : 355;
    const radiusY = record.linkedToCenter ? 188 : 222;

    return {
      ...record,
      id: graphElementId('synergy', `${record.synergy.id || synergyName(record.synergy)}-${index}`, index),
      x: Math.round(centerPoint.x + Math.cos(angle) * radiusX),
      y: Math.round(centerPoint.y + Math.sin(angle) * radiusY),
      r: clamp(11 + record.importance * 1.8 + record.linkedCount * 0.28, 16, 28),
      major: record.linkedToCenter || index < 6,
    };
  });

  const synergyById = new Map(synergyNodes.map(node => [node.synergy.id, node]));
  const skillCount = Math.max(skillRecords.length, 1);
  const skillNodes = skillRecords.map((record, index) => {
    const related = record.synergies
      .map(synergy => synergyById.get(synergy.id))
      .filter(Boolean);
    const fallbackAngle = -Math.PI / 2 + (Math.PI * 2 * index) / skillCount + 0.18;
    const average = related.length
      ? related.reduce((acc, node) => ({ x: acc.x + node.x, y: acc.y + node.y }), { x: 0, y: 0 })
      : { x: centerPoint.x + Math.cos(fallbackAngle) * 345, y: centerPoint.y + Math.sin(fallbackAngle) * 225 };
    const baseX = related.length ? average.x / related.length : average.x;
    const baseY = related.length ? average.y / related.length : average.y;
    const vectorX = baseX - centerPoint.x;
    const vectorY = baseY - centerPoint.y;
    const length = Math.hypot(vectorX, vectorY) || 1;
    const spreadX = ((index % 3) - 1) * 34;
    const spreadY = (((index + 1) % 3) - 1) * 26;

    return {
      id: graphElementId('skill', record.skill.id),
      skill: record.skill,
      x: Math.round(clamp(baseX + (vectorX / length) * 72 + spreadX, 76, width - 76)),
      y: Math.round(clamp(baseY + (vectorY / length) * 52 + spreadY, 78, height - 78)),
      r: clamp(15 + record.connectionCount * 3.2, 18, 34),
      connectionCount: record.connectionCount,
      weightedScore: record.weightedScore,
      nodeKind: skillNodeKind(record.skill),
      major: index < 8 || record.connectionCount > 1,
      synergyIds: record.synergies.map(synergy => synergy.id),
    };
  });

  const skillNodeBySkillId = new Map(skillNodes.map(node => [String(node.skill.id), node]));
  const edges = [];

  synergyNodes.forEach(node => {
    edges.push({
      id: `edge-center-${node.id}`,
      from: centerPoint,
      to: node,
      strength: node.linkedToCenter ? 3 : 1,
      center: node.linkedToCenter,
    });

    node.linkedSkills.forEach(skill => {
      const skillNode = skillNodeBySkillId.get(String(skill.id));
      if (!skillNode) return;
      edges.push({
        id: `edge-${node.id}-${skillNode.id}`,
        from: node,
        to: skillNode,
        strength: Math.max(1, Math.min(3, node.importance)),
        center: false,
      });
    });
  });

  return {
    width,
    height,
    center,
    centerPoint,
    synergyNodes,
    skillNodes,
    edges,
    totalNodes: 1 + synergyNodes.length + skillNodes.length,
  };
}

function centerConnectionLabel(center) {
  if (!center?.skill) return '연결 없음';
  return `${center.connectionCount}개 시너지 연결`;
}

function skillNodeKind(skill) {
  const type = cleanText(skill?.type).toLowerCase();
  if (type.includes('hero')) return 'hero';
  if (type.includes('talent')) return 'talent';
  if (type.includes('passive') || type.includes('proc')) return 'passive';
  return 'skill';
}

function skillNodeKindLabel(skill) {
  const kind = skillNodeKind(skill);
  if (kind === 'hero') return '영웅 특성';
  if (kind === 'talent') return '특성';
  if (kind === 'passive') return '지속 효과';
  return '스킬';
}

function relationParticipants(record, centerSkill) {
  const centerId = centerSkill?.id ? String(centerSkill.id) : '';
  return uniqueBy(
    [
      ...(centerSkill ? [centerSkill] : []),
      ...(record.allLinkedSkills || record.linkedSkills || []),
    ].filter(skill => skill?.id && (!centerId || String(skill.id) === centerId || String(skill.id) !== centerId)),
    skill => String(skill.id)
  ).slice(0, 8);
}

function splitRelationParticipants(record, centerSkill) {
  const participants = relationParticipants(record, centerSkill);
  const centerId = centerSkill?.id ? String(centerSkill.id) : '';
  const nonCenter = participants.filter(skill => String(skill.id) !== centerId);
  const skillItems = uniqueBy(
    nonCenter.filter(skill => skillNodeKind(skill) === 'skill'),
    skill => skillName(skill)
  );
  const talentItems = uniqueBy(
    nonCenter.filter(skill => skillNodeKind(skill) !== 'skill'),
    skill => skillName(skill)
  );

  return {
    center: centerSkill || participants[0],
    skills: skillItems.slice(0, 4),
    talents: talentItems.slice(0, 4),
  };
}

function describeSynergyRecord(record, centerSkill) {
  const relation = splitRelationParticipants(record, centerSkill);
  const centerName = relation.center ? skillName(relation.center) : '중심 스킬';
  const skillNames = relation.skills.map(skillName);
  const talentNames = relation.talents.map(skillName);
  const pieces = [];

  if (skillNames.length) pieces.push(`스킬: ${skillNames.join(', ')}`);
  if (talentNames.length) pieces.push(`특성: ${talentNames.join(', ')}`);

  if (!pieces.length) {
    return `${centerName}과 같은 시너지 노트에 묶인 항목입니다. 그래프에서 가까운 노드일수록 같은 판단 창에서 함께 확인합니다.`;
  }

  return `${centerName} 기준으로 함께 보는 연결입니다: ${pieces.join(' / ')}. ${synergyTypeLabel(record.synergy)} 상황에서 우선적으로 확인합니다.`;
}

function summarizeNames(items, limit = 4) {
  return uniqueBy(items.filter(Boolean), item => item?.id ? String(item.id) : skillName(item))
    .slice(0, limit)
    .map(skillName)
    .join(', ');
}

function roleRiskModel(guide) {
  if (guide.role === 'tanks') {
    return '방어기 공백, 자원 과소비, 다음 위험 구간 직전의 쿨기 선사용이 핵심 실패 모드입니다.';
  }
  if (guide.role === 'healers') {
    return '피해 예측 실패, 광역 회복 쿨기 중복, 마나 소모 과속, 긴급 복구 수단의 지연이 핵심 실패 모드입니다.';
  }
  if (guide.id === 'evoker-augmentation') {
    return '파티 강화 창 불일치, 개인 쿨기와 아군 쿨기 분리, 유지 효과 공백이 핵심 실패 모드입니다.';
  }
  return '자원 과잉, 주요 쿨기 지연, 발동 효과 방치, 단일/광역 전환 실패가 핵심 실패 모드입니다.';
}

function getResearchPanels(guide, data, manuscript, profile) {
  const graph = getSynergyGraphModel(data, guide);
  const centerSkill = graph.center?.skill || data.featuredSkills[0];
  const centerName = centerSkill ? skillName(centerSkill) : guide.spec;
  const topSkills = data.featuredSkills.filter(skill => skillNodeKind(skill) === 'skill');
  const topTalents = data.scopedSkills
    .filter(skill => skillNodeKind(skill) !== 'skill')
    .sort((a, b) => scoreSkill(b, guide) - scoreSkill(a, guide));
  const topCooldowns = data.cooldownSkills.length ? data.cooldownSkills : data.featuredSkills.filter(hasCooldown);
  const topSynergies = graph.synergyNodes.slice(0, 4).map(node => node.synergy);
  const sourceCount = manuscript?.sources?.length || 0;

  return [
    {
      label: '핵심 명제',
      title: `${centerName} 중심 운용 모델`,
      body: `${centerName}은 현재 KB 그래프에서 ${centerConnectionLabel(graph.center)}을 가진 중심 노드입니다. 이 전문화의 해석은 ${summarizeNames(topSkills, 3) || centerName} 실행축과 ${summarizeNames(topTalents, 3) || '특성 조건'} 증폭축을 분리해서 읽어야 합니다.`,
      chips: [centerSkill, ...topSkills.slice(0, 2), ...topTalents.slice(0, 2)].filter(Boolean),
    },
    {
      label: '운용 변수',
      title: `${profile.priorityTitle} 검증`,
      body: `${profile.lead} 실제 판단에서는 ${summarizeNames(topCooldowns, 4) || '주요 쿨기'}의 배치와 ${summarizeNames(data.prioritySource, 4)}의 우선순위가 서로 충돌하지 않는지 확인합니다.`,
      chips: [...topCooldowns.slice(0, 3), ...data.prioritySource.slice(0, 2)],
    },
    {
      label: '상호작용',
      title: '스킬·특성 시너지 축',
      body: `강한 연결은 ${topSynergies.map(synergyName).slice(0, 3).join(', ') || 'KB 시너지 노트'}에서 확인됩니다. 그래프의 금색 노드는 판단 묶음이고, 보라/푸른/청록 노드는 실제 스킬·특성·영웅 특성입니다.`,
      chips: graph.skillNodes.slice(0, 5).map(node => node.skill),
    },
    {
      label: '실패 모드',
      title: '전투 중 깨지는 지점',
      body: `${roleRiskModel(guide)} 따라서 차트는 고정 딜사이클 표가 아니라, 전투 중 다시 확인해야 하는 판단 지점을 빠르게 드러내기 위한 보조 자료입니다.`,
      chips: data.rotationSource.slice(0, 5),
    },
    {
      label: '검증 범위',
      title: '출처와 한계',
      body: `이 페이지는 ${data.specSkills.length}개 전문화 노트, ${data.commonSkills.length}개 공용 노트, ${data.synergies.length}개 시너지 노트와 ${sourceCount}개 명시 출처를 함께 사용합니다. 수치와 번역은 KB/Wowhead 기준을 우선하고, Discord·로그 자료는 교차 검증 가능한 경우에만 보조 근거로 취급합니다.`,
      chips: data.featuredSkills.slice(0, 5),
    },
  ];
}

function buildGuideData(guide) {
  const specSkills = uniqueBy(
    allSkills.filter(skill => recordMatchesGuide(skill, guide, false)),
    skill => `${skill.id}:${skill.spec}`
  );
  const commonSkills = uniqueBy(
    allSkills.filter(skill => skill.class === guide.kbClass && commonSpecs.has(skill.spec)),
    skill => `${skill.id}:${skill.spec}`
  );
  const classSkills = uniqueBy(
    allSkills.filter(skill => skill.class === guide.kbClass),
    skill => `${skill.id}:${skill.spec}`
  );
  const scopedSkills = uniqueBy([...specSkills, ...commonSkills], skill => `${skill.id}:${skill.spec}`);
  const synergies = uniqueBy(
    allSynergies.filter(synergy => recordMatchesGuide(synergy, guide, true)),
    synergy => synergy.id
  ).sort((a, b) => Number(b.importance || 0) - Number(a.importance || 0));

  const sortedSpecSkills = [...specSkills].sort((a, b) => scoreSkill(b, guide) - scoreSkill(a, guide));
  const sortedCommonSkills = [...commonSkills].sort((a, b) => scoreSkill(b, guide) - scoreSkill(a, guide));
  const featuredSkills = uniqueBy([...sortedSpecSkills, ...sortedCommonSkills], skill => String(skill.id)).slice(0, 12);
  const defensiveSkills = uniqueBy(scopedSkills.filter(skill => defensivePattern.test(skillName(skill))), skill => String(skill.id)).slice(0, 6);
  const healingSkills = uniqueBy(scopedSkills.filter(skill => healPattern.test(skillName(skill))), skill => String(skill.id)).slice(0, 6);
  const utilitySkills = uniqueBy(scopedSkills.filter(skill => utilityPattern.test(skillName(skill))), skill => String(skill.id)).slice(0, 6);
  const cooldownSkills = featuredSkills.filter(hasCooldown).slice(0, 5);

  const importantSynergy = synergies.find(synergy => getSynergySkills(synergy, scopedSkills).length >= 3);
  const synergySkills = importantSynergy ? getSynergySkills(importantSynergy, scopedSkills) : [];
  const rotationSource = uniqueBy([...synergySkills, ...featuredSkills], skill => String(skill.id)).slice(0, 8);
  const prioritySource = uniqueBy([...featuredSkills, ...synergySkills], skill => String(skill.id)).slice(0, 8);

  return {
    specSkills,
    commonSkills,
    classSkills,
    scopedSkills,
    synergies,
    featuredSkills,
    defensiveSkills,
    healingSkills,
    utilitySkills,
    cooldownSkills,
    rotationSource,
    prioritySource,
    importantSynergy,
  };
}

function getProfile(guide) {
  if (guide.id === 'evoker-augmentation') return roleProfiles.support;
  return roleProfiles[guide.role] || roleProfiles.ranged;
}

function getPriorityNote(guide, skill) {
  if (guide.role === 'tanks') {
    return `${formatSkillMeta(skill)} 조건을 확인하고 큰 피해 직전 또는 직후에 배치합니다.`;
  }
  if (guide.role === 'healers') {
    return `${formatSkillMeta(skill)} 기준으로 피해 예측과 마나 압박을 함께 봅니다.`;
  }
  if (guide.id === 'evoker-augmentation') {
    return `${formatSkillMeta(skill)} 흐름을 파티 극딜 창과 아군 강화 유지율에 맞춥니다.`;
  }
  return `${formatSkillMeta(skill)} 조건이 맞으면 위 순서대로 우선 처리합니다.`;
}

function resourceLabel(skills, guide) {
  const resourceSkill = skills.find(hasResource);
  if (!resourceSkill) {
    if (guide.role === 'healers') return '마나';
    if (guide.role === 'tanks') return '방어 자원';
    return '전투 자원';
  }

  return cleanText(resourceSkill.resourceCost)
    .replace(/\d+/g, '')
    .replace(/[.:]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 3)
    .join(' ') || '전투 자원';
}

function SkillIconLink({ skill, size = 36, stacked = false }) {
  if (!skill) {
    return <IconPlaceholder $size={size} aria-hidden="true" />;
  }

  return (
    <IconAnchor
      href={wowheadUrl(skill)}
      data-wowhead={`spell=${skill.id}&domain=ko`}
      target="_blank"
      rel="noreferrer"
      $size={size}
      $stacked={stacked}
      aria-label={`${skillName(skill)} Wowhead 열기`}
    >
      <img src={getIconUrl(skill)} alt="" loading="lazy" />
    </IconAnchor>
  );
}

function InlineSkillTerm({ skill, children }) {
  const iconUrl = getIconUrl(skill);

  return (
    <InlineSkillAnchor
      href={wowheadUrl(skill)}
      data-wowhead={`spell=${skill.id}&domain=ko`}
      target="_blank"
      rel="noreferrer"
      aria-label={`${skillName(skill)} Wowhead tooltip`}
    >
      {iconUrl ? <img src={iconUrl} alt="" loading="lazy" /> : <InlineSkillIconFallback aria-hidden="true" />}
      <InlineSkillText>{children}</InlineSkillText>
    </InlineSkillAnchor>
  );
}

function skillFromManualStep(step) {
  if (!step?.skillId) return step?.skill || null;
  const skillId = String(step.skillId);
  return manualSkillById.get(skillId) || skillById.get(skillId) || step.skill || null;
}

function isMetaChartBlock(block) {
  const title = block?.title || '';
  return /차트\s*설계|시각자료\s*구성|차트는\s*어디에|차트\s*사용|차트를\s*읽는\s*법|차트\s*읽는\s*순서|차트\s*구성|빌드별\s*차트\s*분리|지원\s*딜러\s*차트|힐링\s*차트|chart/i.test(title);
}

function isOpenerNarrativeBlock(block, guide) {
  const title = displayGuideText(block?.title || '');
  const sample = displayGuideText([
    title,
    ...(block?.paragraphs || []).slice(0, 1),
    ...(block?.bullets || []).slice(0, 2),
  ].join(' '));

  if (/오프닝|첫\s*전투\s*흐름|전투\s*시작|첫\s*피해\s*대응|첫\s*풀(?:링|흐름)?|풀링|풀\s*진입|진입\/방어|준비\s*전투\s*흐름/i.test(title)) {
    return true;
  }

  if (guide?.role === 'tanks' && /(진입|방어|위협|풀)/.test(title) && /(흐름|순서|전투|딜사이클)/.test(title)) {
    return true;
  }

  if (guide?.role === 'healers' && /(피해|예열|회수|복구)/.test(title) && /(대응|흐름|순서|전투|딜사이클)/.test(title)) {
    return true;
  }

  return /(오프닝|전투\s*시작|첫\s*버튼|첫\s*풀|첫\s*피해)/.test(sample) && /(흐름|순서|딜사이클|레일)/.test(sample);
}

function getInlineChartPlan(guide, data) {
  const plan = [
    {
      id: 'rotation',
      title: getFlowChartTitle(guide),
      caption: '위 설명에서 다룬 첫 전투 흐름, 진입, 피해 대응 판단을 시간 흐름으로 압축한 차트입니다.',
    },
    {
      id: 'priority',
      title: '우선순위 판단',
      caption: '위에서 설명한 조건을 전투 중 가장 먼저 확인할 순서로 정리합니다.',
    },
  ];

  if (guide.id === 'warlock-affliction') {
    plan.push({
      id: 'uptime',
      title: 'DoT-조각-수확 정렬 타임라인',
      sectionHeading: '지속 피해와 조각 소비 창',
      sectionIntro:
        '고통 흑마법사는 고통과 부패를 유지하면서 불안정한 고통과 부패의 씨앗으로 영혼의 조각을 비우고, 암흑의 수확과 암흑시선 소환을 그 위에 겹칩니다.',
      caption:
        '막대는 실제 WCL 초 단위 복사본이 아니라 고통, 부패, 불안정한 고통, 유령 출몰, 암흑의 수확, 암흑시선 소환, 부패의 씨앗 전환을 한 화면에 묶은 판단 도식입니다.',
      definition: [
        ['의미', '고통과 부패는 피해 바닥이고, 불안정한 고통은 영혼의 조각을 피해와 암흑의 수확 주기로 바꾸는 중심 소비기입니다.'],
        ['읽는 법', '암흑시선 소환 전에는 유지 피해와 조각 상태를 정리하고, 암흑의 수확 안에서는 불안정한 고통 또는 부패의 씨앗으로 조각을 과충전 없이 소비합니다.'],
        ['검수 포인트', '고통/부패 누락, 불안정한 고통 비활성, 5조각 과충전, 암흑의 수확 지연, 암흑시선 소환 전 지속 피해 부족을 함께 봅니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'warlock-demonology') {
    plan.push({
      id: 'uptime',
      title: '소환수-폭군 정렬 타임라인',
      sectionHeading: '소환수 수명과 폭군 창',
      sectionIntro:
        '악마 흑마법사는 영혼의 조각을 소환수 수명으로 바꾼 뒤 악마 폭군 소환으로 그 수명을 피해 창에 묶습니다. 이 차트는 굴단의 손, 공포사냥개 부르기, 악마의 핵, 흑마법서 계열, 파멸수호병 소환, 파열이 어떤 순서로 겹쳐야 하는지 보여 줍니다.',
      caption:
        '막대는 실제 WCL 초 단위 복사본이 아니라 조각 준비, 공포사냥개 부르기, 굴단의 손 임프 생성, 큰 악마 쿨다운, 악마 폭군 소환, 파열 광역 전환을 한 화면에 묶은 판단 도식입니다.',
      definition: [
        ['의미', '악마 폭군 소환은 독립 쿨다운이 아니라 직전 소환수 수명과 조각 준비 상태를 검사하는 중심 창입니다.'],
        ['읽는 법', '폭군 전에는 공포사냥개 부르기와 굴단의 손으로 재료를 만들고, 폭군 중에는 악마의 핵과 악마 화살로 조각을 복구해 후속 굴단의 손을 이어갑니다.'],
        ['검수 포인트', '낮은 조각 굴단의 손, 공포사냥개 부르기 지연, 악마의 핵 과충전, 소환수 없는 악마 폭군 소환, 임프 수 부족 파열을 함께 봅니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'warlock-destruction') {
    plan.push({
      id: 'uptime',
      title: '조각-소모기 분기 타임라인',
      sectionHeading: '혼돈의 화살과 불의 비 분기',
      sectionIntro:
        '파괴 흑마법사는 유지 주문으로 조각 경제를 시작하고, 점화와 소각으로 만든 영혼의 조각을 혼돈의 화살, 대혼란, 불의 비 중 어디에 쓸지 고르는 전문화입니다.',
      caption:
        '막대는 실제 WCL 초 단위 복사본이 아니라 제물/쇠퇴 유지, 점화와 역류, 혼돈의 화살, 대혼란, 불의 비, 지옥불정령 소환을 한 화면에 묶은 판단 도식입니다.',
      definition: [
        ['의미', '혼돈의 화살은 단일 결산이고, 불의 비는 대상 수와 생존 시간이 맞을 때 쓰는 광역 소비기입니다.'],
        ['읽는 법', '유지 주문이 비면 먼저 복구하고, 조각이 넘치기 전 단일은 혼돈의 화살, 2타깃은 대혼란 중 혼돈의 화살, 광역은 불의 비로 전환합니다.'],
        ['검수 포인트', '제물/쇠퇴 공백, 점화 2충전 방치, 역류가 긴 시전과 어긋난 구간, 대혼란 안 빈 창, 불의 비 적중 시간 부족을 함께 봅니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'monk-brewmaster') {
    plan.push({
      id: 'uptime',
      title: '시간차-맥주 방어 보드',
      sectionHeading: '시간차 색상과 맥주 판단',
      sectionIntro:
        '양조 수도사는 받은 피해를 시간차로 미루고, 정화주로 위험한 시간차를 줄이며, 천신주로 다음 큰 피해를 예약하는 탱커입니다.',
      caption:
        '막대는 실제 WCL 초 단위 복사본이 아니라 시간차 위험도, 정화주, 천신주, 맥주통 휘두르기, 후려차기, 흑우 니우짜오의 원령을 한 화면에 묶은 방어 판단 도식입니다.',
      definition: [
        ['의미', '시간차는 이미 맞은 피해가 앞으로 들어올 형태이고, 정화주는 그 미래 피해를 줄이며, 천신주는 다음 큰 타격을 흡수하는 예약 방패입니다.'],
        ['읽는 법', '시간차가 노랑/빨강으로 올라가는 구간에서 정화주를 판단하고, 예고된 큰 타격 전에는 천신주와 큰 생존기를 먼저 배치합니다.'],
        ['검수 포인트', '높은 시간차 방치, 낮은 시간차 정화주 낭비, 천신주 지연, 맥주통 휘두르기 지연, 흑우 니우짜오의 원령이 빈 구간에 들어간 상황을 봅니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'monk-windwalker') {
    plan.push({
      id: 'uptime',
      title: '기-쿨기 압축 타임라인',
      sectionHeading: '분노의 주먹과 자원 잠금',
      sectionIntro:
        '풍운 수도사는 기력과 기를 과충전하지 않으면서 같은 기술 반복 금지 규칙을 지키고, 분노의 주먹과 해오름차기 같은 짧은 쿨기를 밀리지 않게 굴리는 근접 딜러입니다.',
      caption:
        '막대는 실제 WCL 초 단위 복사본이 아니라 기 생성, 기 소비, 분노의 주먹 채널, 정점/호안주, 폭풍과 대지와 불, 백호 쉬엔의 원령, 광역 전환을 한 화면에 묶은 판단 도식입니다.',
      definition: [
        ['의미', '분노의 주먹은 풍운의 가장 큰 채널 축이고, 해오름차기와 바람의 군주의 일격은 짧은 쿨기 손실을 만들며, 회전 학다리차기는 대상 수가 충분할 때만 올라오는 광역 분기입니다.'],
        ['읽는 법', '범의 장풍으로 기를 만들고, 기가 넘치기 전에 후려차기나 핵심 소모기로 비우되, 분노의 주먹과 해오름차기 쿨다운을 밀지 않습니다.'],
        ['검수 포인트', '기 과충전, 기력 과충전, 같은 기술 반복, 분노의 주먹 채널 끊김, 해오름차기 지연, 회전 학다리차기 대상 수 오류를 봅니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'monk-mistweaver') {
    plan.push({
      id: 'uptime',
      title: '피해 예고-안개 커버리지 타임라인',
      sectionHeading: '소생의 안개와 피해 회수 창',
      sectionIntro:
        '운무 수도사는 소생의 안개로 생기 충전 대상망을 만들고, 피해 예고에 맞춰 생기 충전, 마나 차, 천신합일, 재활, 기의 고치를 분산하는 힐러입니다.',
      caption:
        '막대는 실제 HPS 수치가 아니라 소생의 안개 커버리지, 생기 충전 회수, 근접 치유 엔진, 마나 차, 단일 대상 외부 생존기, 대형 공대 쿨기를 한 화면에 묶은 힐러 판단 도식입니다.',
      definition: [
        ['의미', '소생의 안개는 생기 충전이 여러 대상을 치유하게 만드는 대상망이고, 생기 충전은 피해가 들어온 뒤 그 대상망을 통해 회수하는 핵심 주문입니다.'],
        ['읽는 법', '피해 전에는 소생의 안개와 마나 차를 준비하고, 피해 직후에는 생기 충전 또는 재활/천신합일을 배정하며, 단일 대상 위험은 포용의 안개와 기의 고치로 분리합니다.'],
        ['검수 포인트', '소생의 안개 충전 과충전, 생기 충전 대상망 부족, 마나 차 스택 방치, 질풍차기 근접 공백, 재활/천신합일 중복, 기의 고치 지연을 봅니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'warrior-protection') {
    plan.push({
      id: 'uptime',
      title: '방패 올리기-분노 완화 타임라인',
      sectionHeading: '방패 올리기와 실제 탱킹 시간',
      sectionIntro:
        '방어 전사는 받은 피해 총합보다 방패 올리기가 실제로 맞는 시간에 켜져 있었는지가 먼저입니다. 이 차트는 방패 올리기 유효 유지율, 방패 밀쳐내기 분노 생성, 고통 감내 흡수층, 주문 반사와 주요 생존기 배정을 한 줄 시간표로 묶어 보여줍니다.',
      caption:
        '막대는 실제 WCL 수치를 복사한 것이 아니라 전투 분석 순서를 시각화한 것입니다. 먼저 방패 올리기 공백을 보고, 그 공백에 고통 감내·주문 반사·사기의 외침·방패의 벽이 덮였는지 확인한 뒤 산왕 또는 거신 피해 창을 읽습니다.',
      definition: [
        ['의미', '방패 올리기는 중심 방어 상태이고, 방패 밀쳐내기와 천둥벼락은 다음 방어 행동을 여는 분노 엔진입니다.'],
        ['읽는 법', '상단 방패 시간이 비어 있는 곳에서 실제 근접 피해를 맞았는지 확인하고, 그 아래 흡수층과 생존기 배정이 이어지는지 봅니다.'],
        ['검수 포인트', '방패 올리기 유효 유지율, 고통 감내 낭비, 주문 반사 누락, 복수 과다 소비, 생존기 중복 사용을 순서대로 봅니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'warrior-arms') {
    plan.push({
      id: 'uptime',
      title: '필사의 일격-피해 창 타임라인',
      sectionHeading: '필사의 일격과 피해 창 정렬',
      sectionIntro:
        '무기 전사는 필사의 일격을 중심으로 거인의 강타 또는 전쟁파괴자 창, 제압 충전, 마무리 일격 전환, 칼날폭풍 또는 쇄파를 맞춥니다. 이 타임라인은 단일 피해 창과 광역 분기가 어느 순간에 갈라지는지 보여줍니다.',
      caption:
        '막대는 실제 WCL 초 단위 복사본이 아니라 로그를 읽는 순서입니다. 필사의 일격 지연을 먼저 보고, 그 앞뒤로 거인의 강타/전쟁파괴자, 제압 충전, 분쇄/죽음의 상처, 학살자 칼날폭풍, 거신 쇄파가 맞물렸는지 확인합니다.',
      definition: [
        ['의미', '필사의 일격은 중심 결산 타격이고, 거인의 강타와 전쟁파괴자는 그 타격과 후속 고가치 기술을 압축하는 피해 창입니다.'],
        ['읽는 법', '상단의 필사의 일격 주기를 기준으로 제압 과충전, 마무리 일격 발동, 칼날폭풍 또는 쇄파 위치가 창 안에 들어오는지 봅니다.'],
        ['검수 포인트', '필사의 일격 지연, 거인의 강타 안 빈 전역, 제압 2충전 방치, 처형 구간 분노 고갈, 쇄파 위치 손실, 학살자 광역 제압 우선순위 오류를 함께 봅니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'warrior-fury') {
    plan.push({
      id: 'uptime',
      title: '광란-격노 분노 경제 타임라인',
      sectionHeading: '광란과 격노 손실 구간',
      sectionIntro:
        '분노 전사는 광란을 중심으로 격노 상태, 분노 생성기, 무모한 희생/투신 창, 학살자 또는 산왕 분기를 동시에 읽어야 합니다. 이 타임라인은 광란이 언제 단순 소비기가 아니라 상태 전환과 광역 발동 조건이 되는지 보여줍니다.',
      caption:
        '막대는 실제 WCL 초 단위 복사본이 아니라 로그를 검수하는 순서입니다. 광란 지연과 격노 공백을 먼저 보고, 그 아래 피의 갈증, 분노의 강타, 무모한 희생, 투신, 우레 작렬, 소용돌이 연마, 학살자 마무리 일격/칼날폭풍이 같은 창에 들어왔는지 확인합니다.',
      definition: [
        ['의미', '광란은 분노를 피해로 바꾸는 버튼이면서 격노를 켜고 12.0.5 학살자 광역 발동까지 연결하는 중심 노드입니다.'],
        ['읽는 법', '상단의 광란 주기를 기준으로 격노 공백, 분노 과충전, 생성기 지연, 무모한 희생/투신 창, 우레 작렬 2중첩, 소용돌이 연마 공백을 차례대로 봅니다.'],
        ['검수 포인트', '광란 지연, 격노가 창 안에서 빠진 시간, 피의 갈증/분노의 강타 충전 낭비, 우레 작렬 과충전, 소용돌이 연마 없는 광역 광란, 학살자 칼날폭풍 지연을 함께 봅니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'rogue-assassination') {
    plan.push({
      id: 'uptime',
      title: '독살-출혈-왕의 파멸 타임라인',
      sectionHeading: '독살 창과 출혈 기반',
      sectionIntro:
        '암살 도적은 목조르기와 파열 유지표만으로 설명하면 핵심을 놓칩니다. 이 타임라인은 독살을 중심으로 출혈 기반, 죽음표식과 왕의 파멸, 독칼과 부식성 분사, 운명의 손 또는 죽음추적자의 징표가 어떻게 같은 창에 묶이는지 보여줍니다.',
      caption:
        '막대는 실제 WCL 초 단위 복사본이 아니라 로그를 검수하는 순서입니다. 먼저 목조르기와 파열이 죽음표식 전에 깔렸는지 보고, 그 다음 독살 창이 왕의 파멸 14초 동안 비지 않았는지, 독칼과 부식성 분사, 혈폭풍 광역 복제가 올바른 대상에 들어갔는지 확인합니다.',
      definition: [
        ['의미', '독살은 연계 점수를 소비하는 마무리 일격이면서 독 발동 확률, 왕의 파멸 ramp, 운명의 손 동전 루프를 여는 중심 노드입니다.'],
        ['읽는 법', '상단의 독살 주기를 기준으로 목조르기/파열 공백, 죽음표식-왕의 파멸 정렬, 독칼, 부식성 분사, 혈폭풍 복제, 영웅 특성 결산을 차례대로 봅니다.'],
        ['검수 포인트', '죽음표식 대상 사망, 왕의 파멸 중 독살 공백, 5938 독칼과 185565 독 칼 혼동, 출혈 없는 혈폭풍, 표식 대상이 아닌 어둡고 어두운 밤 독살을 함께 잡습니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'rogue-outlaw') {
    plan.push({
      id: 'uptime',
      title: '잠들지 않는 칼날 환급 타임라인',
      sectionHeading: '마무리 일격과 쿨기 되먹임',
      sectionIntro:
        '무법 도적은 생성기와 마무리 일격의 단순 반복이 아니라, 마무리 일격이 잠들지 않는 칼날을 통해 다음 아드레날린 촉진, 미간 적중, 폭풍의 칼날, 질풍 칼날, 광기의 학살자, 뼈주사위 창을 앞당기는 구조입니다. 이 타임라인은 연계 점수 생성, 5~6점 소비, 뼈주사위 단계, 폭풍의 칼날 전환, 기만자와 운명결속 보정이 한 전투 안에서 어떻게 맞물리는지 보여줍니다.',
      caption:
        '막대는 실제 WCL 초 단위 복사본이 아니라 로그를 검수하는 순서입니다. 먼저 마무리 일격 빈도와 연계 점수 과충전을 보고, 그 다음 미간 적중 지연, 아드레날린 촉진과 준비 되감기, 폭풍의 칼날 다중 대상 적중, 무형검/최후의 일격 또는 운명의 손/행운 주화 분기를 확인합니다.',
      definition: [
        ['의미', '잠들지 않는 칼날은 무법의 중심 피드백입니다. 연계 점수 소비가 끝이 아니라 다음 쿨기 창을 앞당기는 시작점입니다.'],
        ['읽는 법', '상단의 마무리 일격 주기를 기준으로 사악한 일격/권총 사격 생성, 미간 적중/속결 소비, 뼈주사위 단계, 준비 되감기, 폭풍의 칼날 확산, 영웅 특성 보정을 차례대로 봅니다.'],
        ['검수 포인트', '연계 점수 과충전, 기회 6중첩 방치, 미간 적중 지연, 준비 조기 사용, 폭풍의 칼날 없는 다중 대상, 최후의 일격 속결 지연, 행운 주화 중 마무리 일격 손실을 함께 잡습니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'rogue-subtlety') {
    plan.push({
      id: 'uptime',
      title: '은밀한 기술 90초 극딜 타임라인',
      sectionHeading: '은밀한 기술과 어둠의 칼날 창',
      sectionIntro:
        '잠행 도적은 어둠의 춤을 많이 쓰는 전문화가 아니라 은밀한 기술을 기준으로 어둠의 춤, 어둠의 칼날, 그림자 일격, 절개, 고대의 기술 후속 소비를 압축하는 전문화입니다. 이 타임라인은 90초 큰 창 안에 첫 은밀한 기술, 두 번의 어둠의 춤, 기만자/죽음추적자 보정, 광역 전환이 어떤 관계로 들어가는지 보여줍니다.',
      caption:
        '막대는 실제 WCL 초 단위 복사본이 아니라 로그 검수 순서입니다. 먼저 은밀한 기술이 어둠의 춤 안에 들어갔는지 보고, 그 다음 어둠의 칼날 안 두 번째 춤, 연계 점수 과충전, 표창 폭풍/검은 화약 전환, 최후의 일격 또는 죽음추적자의 징표 보상을 확인합니다.',
      definition: [
        ['의미', '은밀한 기술은 잠행 그래프의 중앙 마무리 일격이고, 어둠의 춤은 그 버튼을 넣는 짧은 창입니다.'],
        ['읽는 법', '어둠의 칼날이 켜진 큰 창 안에 첫 은밀한 기술과 두 번의 어둠의 춤이 들어갔는지를 가장 먼저 봅니다.'],
        ['검수 포인트', '기력 고갈, 연계 점수 과충전, 최후의 일격 절개 지연, 죽음추적자의 징표 대상 오류, 광역 전환 누락을 함께 확인합니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'shaman-elemental') {
    plan.push({
      id: 'uptime',
      title: '폭풍수호자-폭풍 압축 타임라인',
      sectionHeading: '폭풍수호자와 폭풍인도자 창',
      sectionIntro:
        '정기 주술사는 화염 충격과 용암 폭발을 기반으로 하지만, 현재 구조의 중심은 폭풍수호자입니다. 이 타임라인은 화염 코어 정리, 폭풍수호자 강화 주문, 폭풍 발동, 승천, 소용돌이 소비, 이동 보존, 쐐기 유틸을 한 줄에 묶어 창 진입 전후의 판단 순서를 보여줍니다.',
      caption:
        '막대는 실제 로그 초 단위 복사본이 아니라 검수 순서입니다. 먼저 화염 충격/용암 폭발/소용돌이 상태를 정리하고, 그 다음 폭풍수호자 강화 번개 화살 또는 연쇄 번개, 폭풍, 대지 충격/정기 작렬/지진, 이동 보존과 차단을 확인합니다.',
      definition: [
        ['의미', '폭풍수호자는 강화 자연 주문을 여는 버튼이면서 폭풍인도자 폭풍 루프, 승천 창, 소용돌이 소비 선택을 한꺼번에 묶는 중심 노드입니다.'],
        ['읽는 법', '상단의 폭풍수호자 줄을 기준으로 화염 충격 유지와 용암 폭발 충전이 준비됐는지, 폭풍과 강화 주문이 낭비 없이 들어갔는지, 단일/광역 소비기가 올바르게 갈렸는지 봅니다.'],
        ['검수 포인트', '화염 충격 공백, 용암 폭발 충전 낭비, 소용돌이 과충전, 폭풍수호자 강화 주문 미소비, 폭풍 방치, 이동 중 큰 창 손실, 날카로운 바람 누락을 함께 확인합니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'shaman-restoration') {
    plan.push({
      id: 'uptime',
      title: '성난 해일-피해 회수 타임라인',
      sectionHeading: '성난 해일과 공대 쿨기 배정',
      sectionIntro:
        '복원 주술사는 고정 딜사이클이 아니라 피해 예고에 맞춰 성난 해일 대상망, 치유의 비/쇄도하는 토템 위치, 폭우와 연쇄 치유 회수, 치유의 해일 토템/승천/정신의 고리 토템 배정을 겹치는 힐러입니다.',
      caption:
        '막대는 실제 HPS 초 단위 복사본이 아니라 로그 검수 순서입니다. 먼저 성난 해일 대상망과 위치 기반 힐을 보고, 그 다음 폭우/연쇄 치유 회수, 큰 공대 쿨기, 차단/해제를 확인합니다.',
      definition: [
        ['의미', '성난 해일은 복원 그래프의 중앙 표식이고, 연쇄 치유와 치유의 물결은 그 표식을 실제 회복으로 바꾸는 회수 주문입니다.'],
        ['읽는 법', '피해 전에는 물의 보호막, 대지의 보호막, 성난 해일, 치유의 비 또는 쇄도하는 토템을 준비하고, 피해 직후에는 폭우와 연쇄 치유로 회수합니다.'],
        ['검수 포인트', '성난 해일 대상 중복, 쇄도하는 토템 위치 손실, 폭우 지연, 연쇄 치유 첫 대상 오류, 정신의 고리 토템 사후 사용, 날카로운 바람 누락을 함께 봅니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'shaman-enhancement') {
    plan.push({
      id: 'uptime',
      title: '소용돌이치는 무기 환급 타임라인',
      sectionHeading: '소용돌이 소비와 영웅 특성 분기',
      sectionIntro:
        '고양 주술사는 소용돌이치는 무기를 비운 뒤 정기의 속도로 돌아온 폭풍의 일격과 용암 채찍을 다시 굴리는 전문화입니다. 이 타임라인은 소용돌이 소비, 낙뢰 강화, 토템술사 1분 창, 폭풍인도자 폭풍 창, 쐐기 유틸을 한 화면에서 분리해 보여줍니다.',
      caption:
        '막대는 실제 WCL 초 단위 복사본이 아니라 로그 검수 순서입니다. 먼저 소용돌이치는 무기 과충전과 소비 간격을 보고, 그 다음 폭풍의 일격/용암 채찍 환급, 낙뢰 광역 전환, 쇄도하는 토템 또는 폭풍 창을 확인합니다.',
      definition: [
        ['의미', '소용돌이치는 무기는 고양의 중심 노드입니다. 소비는 피해 주문이면서 정기의 속도 환급을 통해 다음 근접 타격기를 여는 행동입니다.'],
        ['읽는 법', '상단의 소용돌이 소비 줄을 기준으로 단일 번개 화살, 광역 연쇄 번개, 낙뢰 강화, 토템술사/폭풍인도자 창이 같은 시간에 맞는지 봅니다.'],
        ['검수 포인트', '9~10중첩 과충전, 폭풍의 일격/용암 채찍 지연, 낙뢰 없는 광역 소비, 쇄도하는 토템 위치 손실, 승천 중 바람의 일격 공백, 날카로운 바람 누락을 함께 확인합니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'paladin-protection') {
    plan.push({
      id: 'uptime',
      title: '방어 공백-신성한 힘 타임라인',
      sectionHeading: '정의의 방패와 위치 방어',
      sectionIntro:
        '보호 성기사는 신성화 안에서 신성한 힘을 만들고, 큰 평타와 물리 피해 전에 정의의 방패 공백을 줄이며, 피해 후에는 영광의 서약과 생존기로 회수하는 탱커입니다.',
      caption:
        '막대는 실제 DTPS 수치가 아니라 신성화 위치, 정의의 방패 완화, 신성한 힘 생성, 영광의 서약 복구, 천상의 종 광역 창, 주요 생존기 분산을 한 화면에 묶은 탱커 판단 도식입니다.',
      definition: [
        ['의미', '정의의 방패는 보호 성기사의 중심 방어 시간이고, 신성화는 그 방어가 성립하는 위치 조건입니다.'],
        ['읽는 법', '피해 전에는 신성화 위치와 신성한 힘을 확인하고, 피해 직전 정의의 방패를 유지하며, 피해 후에는 영광의 서약이나 생존기를 배정합니다.'],
        ['검수 포인트', '신성화 밖 탱킹, 정의의 방패 공백, 신성한 힘 과충전, 영광의 서약 과소/과다, 헌신적인 수호자와 고대 왕의 수호자 중복을 봅니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'paladin-holy') {
    plan.push({
      id: 'uptime',
      title: '신성 충격-봉화망 트리아지 타임라인',
      sectionHeading: '신성 충격과 봉화 대상망',
      sectionIntro:
        '신성 성기사는 신성 충격으로 신성한 힘과 빛 주입을 만들고, 봉화 대상망으로 치유를 분배한 뒤, 단일 위험과 광역 피해에 서로 다른 소비기와 쿨다운을 배정하는 힐러입니다.',
      caption:
        '막대는 실제 HPS 복사본이 아니라 신성 충격 충전, 빛 주입 소비, 빛의 봉화/구세주의 봉화 대상망, 영광의 서약/영원의 불꽃 단일 결산, 여명의 빛 광역 결산, 오라 숙련과 티르의 해방 선배정을 한 화면에 묶은 판단 도식입니다.',
      definition: [
        ['의미', '신성 충격은 신성 성기사의 중심 생성기이고, 봉화 대상망은 그 치유가 실제로 도착하는 경로입니다.'],
        ['읽는 법', '피해 전에는 봉화 대상과 신성 충격 충전을 확인하고, 피해 직후 단일 위험은 영광의 서약/영원의 불꽃, 넓은 피해는 여명의 빛과 천상의 종으로 회수합니다.'],
        ['검수 포인트', '신성 충격 충전 방치, 신성한 힘 과충전, 빛 주입 소비 오류, 봉화 대상 오류, 오라 숙련 사후 사용, 티르의 해방과 응징의 격노 중복을 봅니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'paladin-retribution') {
    plan.push({
      id: 'uptime',
      title: '사형 선고-신성한 힘 압축 타임라인',
      sectionHeading: '사형 선고와 기사단 창',
      sectionIntro:
        '징벌 성기사는 신성한 힘을 넘치지 않게 비우면서 사형 선고 안에 응징의 격노, 파멸의 재, 빛의 망치, 천벌의 망치, 최후의 선고를 압축하는 근접 딜러입니다.',
      caption:
        '막대는 실제 WCL 초 단위 복사본이 아니라 사형 선고 피해 창, 응징의 격노, 파멸의 재, 빛의 망치, 신성한 힘 생성/소비, 천상의 폭풍 광역 전환을 한 화면에 묶은 판단 도식입니다.',
      definition: [
        ['의미', '사형 선고는 징벌의 피해 압축 기준이고, 신성한 힘은 그 창에 고가치 소모기를 넣기 위해 비워 두는 자원입니다.'],
        ['읽는 법', '큰 창 전에는 신성한 힘을 과충전하지 않게 정리하고, 사형 선고가 열린 뒤에는 파멸의 재와 빛의 망치와 최후의 선고를 우선 넣습니다.'],
        ['검수 포인트', '사형 선고와 응징의 격노 분리, 파멸의 재 지연, 빛의 망치 누락, 전쟁의 기술 발동 방치, 단일/광역 소모기 전환 오류를 봅니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'mage-frost') {
    plan.push({
      id: 'uptime',
      title: '산산조각-빙결 소비 타임라인',
      sectionHeading: '산산조각과 빙결 중첩 흐름',
      sectionIntro:
        '냉기는 산산조각, 빙결 중첩, 두뇌 빙결, 서리의 손가락, 서리 광선, 얼어붙은 구슬이 같은 시간축에서 겹치는지를 봐야 합니다.',
      caption:
        '막대는 실제 WCL 수치가 아니라 산산조각 중심으로 빙결 중첩 생성, 얼음창 소비, 진눈깨비 창, 서리 광선 채널, 얼어붙은 구슬/눈보라 광역 전환을 한 화면에 묶은 판단 도식입니다.',
      definition: [
        ['의미', '산산조각은 냉기의 중심 판정이고, 빙결 중첩은 얼음창·혜성 폭풍·혹한의 쐐기가 실제 피해로 전환될 준비 상태입니다.'],
        ['읽는 법', '서리 광선과 얼어붙은 구슬 전에는 필요한 만큼 중첩과 발동을 비우고, 이후 새로 생긴 중첩을 얼음창이나 큰 소비기로 정리합니다.'],
        ['검수 포인트', '낮은 중첩 얼음창, 서리의 손가락 과충전, 두뇌 빙결 방치, 서리 광선 중 이동 손실, 얼어붙은 구슬/눈보라 대상 수 부족을 함께 봅니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'priest-shadow') {
    plan.push({
      id: 'uptime',
      title: '지속 피해 갱신 체크라인',
      sectionHeading: '지속 피해와 광기 소비 체크',
      sectionIntro:
        '암흑 사제의 지속 피해 유지는 흡혈의 손길과 어둠의 권능: 고통을 오래 살 대상에게 끊기지 않게 두고, 그 위에 어둠의 권능: 광기와 정신 분열 피해를 회수하는 준비 작업입니다.',
      caption: '이 차트는 실측 로그 점수가 아니라 Wowhead/Icy Veins/KB에서 공통으로 확인한 유지, 갱신, 소비 판단을 시간축으로 바꾼 도식입니다.',
      definition: [
        ['의미', '지속 피해 유지는 흡혈의 손길과 어둠의 권능: 고통이 오래 사는 대상에게 끊기지 않도록 보는 체크입니다.'],
        ['읽는 법', '막대가 비는 구간은 실제 공백 시간이 아니라 다시 확인해야 하는 갱신/소모 판단 지점입니다.'],
        ['검수 포인트', '흡혈의 손길 공백, 어둠의 권능: 고통 누락, 어둠의 권능: 광기 지연, 정신 분열 충전 방치, 광역 대상 지속 피해 과투자를 함께 봅니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'demonhunter-havoc') {
    plan.push({
      id: 'cooldown',
      title: '악마화-정수 파쇄 압축 창',
      sectionHeading: '악마화 창 배정',
      sectionIntro: '파멸은 긴 쿨다운 하나보다 안광, 정수 파쇄, 죽음의 휩쓸기, 탈태 초기화를 짧은 창에 얼마나 촘촘히 넣는지가 핵심입니다.',
      caption: '막대는 실제 로그 수치가 아니라 안광 악마화, 정수 파쇄 디버프, 죽음의 휩쓸기/파멸 소비, 탈태 초기화 순서를 한 화면에 묶은 판단 도식입니다.',
      definition: [
        ['의미', '정수 파쇄 전에는 분노와 악마화 상태를 준비하고, 창 안에서는 직접 강화되는 소비기만 우선합니다.'],
        ['읽는 법', '안광으로 악마화에 들어간 뒤 정수 파쇄를 쓰고, 죽음의 휩쓸기와 파멸을 먼저 넣은 다음 탈태 초기화 가치를 확인합니다.'],
        ['검수 포인트', '복수의 퇴각과 지옥칼은 피해 증폭 수단이지만, 안전한 복귀 경로가 없으면 창 자체가 실패합니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'demonhunter-vengeance') {
    plan.push({
      id: 'defensive',
      title: '영혼 파편과 방어기 흐름',
      sectionHeading: '방어 자원 배정',
      sectionIntro: '복수는 단일 딜사이클보다 다음 피해를 어떤 방어층으로 받고, 영혼 파편을 언제 회복/위협/방벽으로 바꿀지 보는 탱커입니다.',
      caption: '막대는 실제 로그 수치가 아니라 악마 쐐기, 불타는 낙인, 지옥 황폐, 탈태, 영혼 파편 소비를 한 전투 타임라인에 놓는 방어 판단 도식입니다.',
      definition: [
        ['의미', '탱버스터와 대형 풀 전에는 방어기를 먼저 배정하고, 안정 구간에는 균열과 영혼 폭탄으로 자원과 위협을 정리합니다.'],
        ['읽는 법', '피해 전에는 악마 쐐기/불타는 낙인/탈태 공백을 보고, 피해 후에는 영혼 폭탄과 영혼 베어내기 소비가 늦지 않았는지 확인합니다.'],
        ['검수 포인트', '침묵의 인장과 불행의 인장은 딜 버튼이 아니라 던전 위험 주문을 묶는 제어 타임라인으로 따로 봅니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'demonhunter-devourer') {
    plan.push({
      id: 'resource',
      title: '공허 탈태 상태 전환',
      sectionHeading: '공허 창 전환',
      sectionIntro: '포식은 전투 시작부터 공허 탈태를 누르는 전문화가 아니라, 격노와 영혼 파편을 모아 공허 탈태 안팎의 우선순위를 바꾸는 전문화입니다.',
      caption: '막대는 실제 로그 수치가 아니라 흡수/영혼 제물 자원 램프, 최대 파편 수확, 공허 광선, 박멸 반응, 공허 탈태 진입, 붕괴하는 별 내부 소비를 한 화면에 묶은 상태 전환 도식입니다.',
      definition: [
        ['의미', '공허 탈태 밖에서는 자원과 발동을 준비하고, 안에서는 붕괴하는 별과 조건부 소비기를 먼저 확인합니다.'],
        ['읽는 법', '영혼 파편이 50에 가까우면 공허 탈태 진입을 준비하고, 수확/도태는 최대 파편 회수와 충전 과충전 방지를 같이 봅니다.'],
        ['검수 포인트', '궤멸자는 공허내림-수확 루프, 공허상흔은 안전한 근접 진입과 공허쇄도 첫 발동 적중을 따로 봅니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'deathknight-frost') {
    plan.push({
      id: 'cooldown',
      title: '얼음 기둥 창 압축',
      sectionHeading: '극딜 창 배정',
      sectionIntro: '냉기는 고정 순서를 외우는 전문화가 아니라, 얼음 기둥 안에 사신의 징표, 몰살 회수, 도살기 절멸/서리낫, 숨결 유지 자원을 얼마나 밀도 있게 넣는지가 핵심입니다.',
      caption: '막대는 실제 DPS 수치가 아니라 룬 무기 강화 충전, 사신의 징표, 얼음 기둥, 숨결, 서리고룡 회수, 도살기 소비를 한 창 안에 놓는 운용 도식입니다.',
      definition: [
        ['의미', '얼음 기둥을 기준으로 사신의 징표와 룬 무기 강화, 도살기 소비, 신드라고사의 숨결 유지, 서리고룡 회수 시점을 함께 봅니다.'],
        ['읽는 법', '단일은 도살기 절멸, 3타겟 이상은 도살기 서리낫과 빙하 진군으로 치환하고, 숨결 빌드는 룬 마력 소비보다 전방 유지 시간을 먼저 봅니다.'],
        ['검수 포인트', '룬 무기 강화 2충전 방치, 사신의 징표 대상 사망, 도살기 2중첩 손실, 서리고룡의 격노를 얼음 기둥 밖에 쓴 로그를 확인합니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'deathknight-unholy') {
    plan.push({
      id: 'resource',
      title: '하급 구울 상태 전환',
      sectionHeading: '소환수 창 준비',
      sectionIntro: '부정은 버튼을 일렬로 외우기보다, 악성 역병 유지와 하급 구울 스택, 부패 충전, 어둠의 변신/사자의 군대 창이 어느 상태인지 먼저 봐야 합니다.',
      caption: '막대는 실제 DPS 수치가 아니라 질병 적용, 하급 구울 준비, 소환수 강화, 금단의 지식 소비기 전환을 한 화면에 놓는 운용 도식입니다.',
      definition: [
        ['의미', '돌발 열병으로 악성 역병을 깔고, 고름 일격과 부패의 낫으로 하급 구울 루프를 준비한 뒤, 어둠의 변신과 사자의 군대 창에서 소비합니다.'],
        ['읽는 법', '질병이 없으면 첫 단계로 돌아가고, 하급 구울 스택이 부족하면 고름 일격, 금단의 지식 중에는 괴저 고리/무덤 전환을 먼저 봅니다.'],
        ['검수 포인트', '악성 역병 누락, 어둠의 변신 전 하급 구울 부족, 영혼 수확자 처형 지연, 죽음과 부패 밖 광역 소비를 함께 확인합니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'deathknight-blood') {
    plan.push({
      id: 'defensive',
      title: '죽음의 일격 방어 경제',
      sectionHeading: '방어 흐름 배정',
      sectionIntro: '혈기는 고정 딜사이클보다 다음 피해를 어떤 층으로 받고, 그 직후 죽음의 일격을 쓸 자원이 있는지를 보는 탱커입니다.',
      caption: '막대는 실제 로그 수치가 아니라 죽음의 마수-죽음과 부패 진입, 사신의 징표/춤추는 룬 무기 순서, 죽음의 일격 회수 타이밍을 한 타임라인에 놓는 방어 판단 도식입니다.',
      definition: [
        ['의미', '피해 전에는 뼈의 보호막, 위치, 생존기 배정을 보고, 피해 직후에는 죽음의 일격을 쓸 룬 마력이 남았는지 확인합니다.'],
        ['읽는 법', '죽음의 인도자는 사신의 징표를 춤추는 룬 무기 앞에 두고, 산레인은 룬 무기 안 피의 소용돌이와 흡혈의 일격으로 창을 이어갑니다.'],
        ['검수 포인트', '죽음과 부패 위치 손실, 죽음의 일격 선소모, 룬 무기 창 안 빈 전역, 원거리 몹 정리 실패를 함께 확인합니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'druid-balance') {
    plan.push({
      id: 'uptime',
      title: '일월식 소비 창 지도',
      sectionHeading: '일월식 창과 영웅 특성 분기',
      sectionIntro:
        '조화는 일월식 자체보다 일월식 초반에 어떤 소비기와 준비 버튼이 들어갔는지가 중요합니다. 레이드 숲의 수호자는 자연의 군대와 짧은 창 정렬을, 쐐기 엘룬의 대행자는 엘룬의 분노와 달 계열 지속 광역을 같이 봅니다.',
      caption:
        '막대는 실제 WCL 유지율이 아니라 일월식 충전, 도트 갱신, 천공의 힘, 별재봉사/우주의 손길 무료 소비기, 자연의 군대, 엘룬의 분노를 한 화면에 놓는 판단 도식입니다.',
      definition: [
        ['의미', '일월식은 유지 버프가 아니라 별빛쇄도와 별똥별을 넣기 위한 짧은 피해 창이고, 영웅 특성은 그 창에 붙는 준비 버튼을 바꿉니다.'],
        ['읽는 법', '도트와 자연의 군대/엘룬의 분노는 창 전에, 별빛쇄도/별똥별/영혼 소집은 창 안에 들어가도록 봅니다.'],
        ['검수 포인트', '일월식 2충전 방치, 천공의 힘 과충전, 별재봉사/우주의 손길 발동 방치, 도트 창 내부 갱신, 쐐기 풀링 위협을 확인합니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'druid-restoration') {
    plan.push({
      id: 'uptime',
      title: '첫 피해 대응 흐름',
      sectionHeading: '피해 전 준비와 피해 후 복구',
      sectionIntro:
        '회복은 피해가 뜬 뒤 버튼을 찾는 힐러가 아니라, 피해 전에 회복 대상을 미리 만들어 두는 힐러입니다.',
      caption:
        '이 차트는 HPS 예측표가 아니라 회복, 피어나는 생명, 꽃피우기, 급속 성장, 신속한 치유, 평온을 첫 피해 타이머에 맞춰 배치하는 흐름입니다.',
      definition: [
        ['의미', '피해 전 준비, 피해 순간 대응, 피해 후 복구가 한 줄로 이어져야 합니다.'],
        ['읽는 법', '회복과 피어나는 생명은 먼저 깔고, 급속 성장/신속한 치유는 피해가 들어오는 순간에 맞춥니다. 숲 수호자는 그 시전에서 따라오는 보조 치유입니다.'],
        ['검수 포인트', '피해 후 회복 난사, 피어나는 생명 공백, 꽃피우기 위치 이탈, 신속한 치유 후속 주문 누락, 평온 이동 끊김을 봅니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'druid-guardian') {
    plan.push({
      id: 'defensive',
      title: '첫 풀 방어 흐름',
      sectionHeading: '위협과 완화 배정',
      sectionIntro: '수호는 딜 버튼을 일렬로 외우는 탱커가 아니라, 첫 접촉부터 다음 피해 유형에 맞춰 위협, 무쇠가죽, 광포한 재생력, 생존기, 차단을 배정하는 전문화입니다.',
      caption: '막대는 실제 HPS나 DPS 수치가 아니라 달빛섬광 풀링, 난타 위협, 무쇠가죽 선적용, 달 광선 위치 고정, 생존기/차단 분기를 한 화면에 놓는 전투 흐름 도식입니다.',
      definition: [
        ['의미', '달빛섬광과 난타로 첫 위협을 잡고, 물리 피해 전에는 무쇠가죽, 마법/출혈 구간에는 나무 껍질이나 생존 본능, 피해 후에는 광포한 재생력을 배정합니다.'],
        ['읽는 법', '엘룬의 선택은 난타/달빛섬광/삭망월로 달 광선을 빨리 돌리고, 공격 소비기는 무쇠가죽 예산이 남을 때 말살이나 후려갈기기로 전환합니다.'],
        ['검수 포인트', '첫 평타 전 무쇠가죽 공백, 달 광선 위치 손실, 두개골 강타로 끊을 수 있던 마법 피해, 공격 소비기가 방어 분노를 먹은 구간을 함께 확인합니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'druid-feral') {
    plan.push({
      id: 'uptime',
      title: '출혈 스냅샷 흐름',
      sectionHeading: '출혈 품질과 발톱 전환',
      sectionIntro: '야성은 오프닝 차트로 첫 전투 흐름을 잡고, 보조 차트에서는 갈퀴 발톱, 도려내기, 원시 분노가 어떤 강화 상태로 유지되는지와 쐐기 발톱의 드루이드 직접 피해 전환이 어디에 얹히는지를 봅니다.',
      caption: '막대는 실제 로그 유지율 퍼센트가 아니라 호랑이의 분노 스냅샷, 팬데믹 갱신, 원시 분노 광역 갱신, 물어뜯기/찢어발기기 전환, 흉포한 이빨 소비 조건을 한 화면에 놓는 판단 도식입니다.',
      definition: [
        ['의미', '레이드 야생추적자는 갈퀴 발톱과 도려내기 품질을, 쐐기 발톱의 드루이드는 출혈 기반 위에 직접 피해 창을 얹는지를 확인합니다.'],
        ['읽는 법', '출혈 막대가 갱신 구간에 들어오면 연계 점수와 호랑이의 분노 대기시간을 보고, 쐐기에서는 원시 분노 뒤 물어뜯기와 찢어발기기 전환을 확인합니다.'],
        ['검수 포인트', '도려내기 공백, 원시 분노 지연, 호랑이의 분노 기력 과잉, 광폭화 중 연계 점수 과충전, 첫 풀 탱커 위협을 함께 확인합니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'hunter-beastmastery') {
    plan.push({
      id: 'uptime',
      title: '야수의 격노-광역 준비 타임라인',
      sectionHeading: '야수의 격노와 광역 흐름',
      sectionIntro:
        '야수는 단일 우선순위와 광역 유지 조건이 같은 순간에 겹칩니다. 야수의 격노 전에는 날카로운 사격 충전, 살상 명령 준비, 야수의 회전베기 활성 여부를 같이 확인해야 합니다.',
      caption:
        '막대는 실제 WCL 수치가 아니라 야수의 격노 창, 날카로운 사격 충전 정리, 자연의 동맹 살상 명령, 마구잡이 난타/야수의 회전베기, 어둠 순찰자 분기 창을 한 화면에 묶은 판단 도식입니다.',
      definition: [
        ['의미', '야수의 격노는 중심 창이고, 날카로운 사격과 살상 명령은 창 안 밀도를 만드는 입력입니다.'],
        ['읽는 법', '다중 대상에서는 야수의 회전베기 흐름이 켜진 뒤 야수의 격노가 들어가는지 보고, 어둠 순찰자는 부패의 사격과 울부짖는 화살을 별도 분기로 봅니다.'],
        ['검수 포인트', '야수의 격노 사용 횟수, 날카로운 사격 2충전 방치, 살상 명령 두 번 연속 입력, 광역 야수의 회전베기 공백을 함께 확인합니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'hunter-marksmanship') {
    plan.push({
      id: 'uptime',
      title: '조준 사격-정밀 사격 소비 타임라인',
      sectionHeading: '조준 사격과 발동 소비 흐름',
      sectionIntro:
        '사격은 버튼 순서보다 조준 사격 충전, 속사 준비, 정밀 사격 소비, 광역 교묘한 사격 조건이 같은 순간에 어떻게 겹치는지를 봐야 합니다.',
      caption:
        '막대는 실제 WCL 수치가 아니라 조준 사격 충전 관리, 속사/총알 세례 준비, 정밀 사격 소비, 교묘한 사격 광역 조건, 정조준 창, 파수꾼/어둠 순찰자 후속 버튼을 한 화면에 묶은 판단 도식입니다.',
      definition: [
        ['의미', '조준 사격은 중심 노드이고, 정밀 사격과 속사는 다음 조준 사격의 위치와 품질을 정하는 입력입니다.'],
        ['읽는 법', '단일은 신비한 사격으로 정밀 사격을 소비하고, 광역은 일제 사격으로 교묘한 사격을 켠 뒤 조준 사격과 속사를 넣는지 봅니다.'],
        ['검수 포인트', '조준 사격 2충전 방치, 속사 지연, 정밀 사격 과소비/미소비, 정조준 전 총알 세례 준비, 영웅 특성 후속 버튼 배치를 함께 확인합니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'hunter-survival') {
    plan.push({
      id: 'uptime',
      title: '창끝 생성-소비 타임라인',
      sectionHeading: '창끝과 제압 창 흐름',
      sectionIntro:
        '생존은 살상 명령으로 창끝을 만들고, 제압, 야생불 폭탄, 붐스틱, 랩터 계열 소비기에 배정하는지를 같은 시간축에서 봐야 합니다.',
      caption:
        '막대는 실제 WCL 수치가 아니라 살상 명령 충전, 창끝 중첩, 제압 창, 야생불 폭탄 충전, 붐스틱 전방 각도, 랩터의 휩쓸기 광역 조건, 무리의 지도자/파수꾼 분기를 한 화면에 묶은 판단 도식입니다.',
      definition: [
        ['의미', '창끝은 생존의 중심 버프이며, 살상 명령은 창끝과 집중을 만드는 생성기입니다.'],
        ['읽는 법', '제압 전에 창끝과 폭탄/붐스틱 준비를 확인하고, 광역에서는 전방 부채꼴 기술이 실제 대상에게 맞는지 봅니다.'],
        ['검수 포인트', '살상 명령 충전 낭비, 창끝 3중첩 방치, 제압 전 준비 부족, 야생불 폭탄 2충전, 붐스틱/랩터의 휩쓸기 방향 손실을 함께 확인합니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'mage-fire') {
    plan.push({
      id: 'uptime',
      title: '발화-몰아치는 열기 전환 타임라인',
      sectionHeading: '발화와 발동 상태 흐름',
      sectionIntro:
        '화염은 발화, 열기, 화염 작렬 충전, 몰아치는 열기!, 불덩이 작렬/불기둥 소비가 같은 창 안에서 끊기지 않는지를 시간축으로 봐야 합니다.',
      caption:
        '막대는 실제 WCL 수치가 아니라 발화 창, 유성 착탄, 화염 작렬 충전, 몰아치는 열기! 소비, 불기둥 광역 전환, 생존기 보존을 한 화면에 묶은 판단 도식입니다.',
      definition: [
        ['의미', '발화는 화염의 중심 창이고, 몰아치는 열기!는 그 창 안에서 불덩이 작렬 또는 불기둥으로 바로 소비해야 하는 상태입니다.'],
        ['읽는 법', '발화 전에 화염 작렬 충전과 유성 착탄을 준비하고, 발화 안에서는 열기를 몰아치는 열기!로 바꾼 뒤 소비기를 끊지 않습니다.'],
        ['검수 포인트', '발화 지연, 유성 착탄 이탈, 화염 작렬 과충전, 몰아치는 열기! 방치, 불기둥 대상 수 부족, 이동으로 인한 발화 창 손실을 함께 봅니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'mage-arcane') {
    plan.push({
      id: 'uptime',
      title: '비전 연사-탄막 소비 타임라인',
      sectionHeading: '비전 연사와 큰 창 흐름',
      sectionIntro:
        '비전은 비전 쇄도, 비전의 여파, 비전 연사, 비전 탄막, 비전 보주가 같은 창을 가리키는지를 시간축으로 봐야 합니다.',
      caption:
        '막대는 실제 WCL 수치가 아니라 비전 연사 예열, 비전 쇄도 90초 창, 비전의 여파 45초 창, 비전 보주 재충전, 비전 탄막 소비, 환기 복구를 한 화면에 묶은 판단 도식입니다.',
      definition: [
        ['의미', '비전 연사는 비전 탄막 소비 품질을 정하는 중심 자원이고, 비전 쇄도와 비전의 여파는 그 소비를 넣을 시간표입니다.'],
        ['읽는 법', '큰 창 전에는 비전 연사와 마나를 준비하고, 창 안에서는 비전 보주와 신비한 화살 발동을 소비한 뒤 비전 탄막으로 정리합니다.'],
        ['검수 포인트', '비전 쇄도 지연, 비전의 여파 45초 간격 붕괴, 낮은 비전 연사 탄막, 마나 부족 탄막 과다, 비전 보주 4충전 낭비를 함께 봅니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'evoker-devastation') {
    plan.push({
      id: 'resource',
      title: '용의 분노-정수 소비 창',
      sectionHeading: '용의 분노와 정수 경제',
      sectionIntro:
        '황폐는 쿨다운을 누르는 순서보다 용의 분노 창 안에 강화 주문, 정수 폭발, 파열/기염, 하늘빛 휩쓸기를 얼마나 손실 없이 넣는지가 핵심입니다.',
      caption:
        '막대는 실제 DPS 수치가 아니라 용의 분노, 불의 숨결, 영원의 쇄도, 정수 폭발, 파열/기염, 하늘빛 휩쓸기를 한 화면에 놓는 판단 도식입니다.',
      definition: [
        ['의미', '용의 분노는 2분 쿨다운 자체보다 그 안에 들어가는 강화 주문과 정수 소비 밀도로 평가합니다.'],
        ['읽는 법', '불의 숨결과 영원의 쇄도는 창을 열고, 산산이 부서지는 별 뒤에는 정수 폭발과 파열/기염을 밀어 넣습니다.'],
        ['검수 포인트', '정수 과충전, 정수 폭발 2중첩 방치, 하늘빛 휩쓸기 충전 방치, 부양 없는 이동 손실을 확인합니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'priest-discipline') {
    plan.push({
      id: 'defensive',
      title: '속죄 램프와 피해 대응',
      sectionHeading: '속죄 램프와 외생기 배정',
      sectionIntro:
        '수양은 힐 버튼을 많이 누르는 전문화가 아니라, 피해 전에 속죄와 보호막을 깔고 피해 직후 회개/정신 분열로 회수하는 전문화입니다. 이 차트는 속죄 준비, 피해 전 보호막, 피해 후 회수, 외생기 분배가 서로 다른 판단이라는 것을 보여주는 용도입니다.',
      caption: '수양은 고정 순서보다 피해가 들어오기 전 몇 초에 속죄를 깔고 어떤 쿨다운을 남길지 보는 타임라인이 중요합니다.',
      definition: [
        ['의미', '막대는 실제 로그 수치가 아니라 피해 예고, 속죄 준비, 사도/광휘 창, 외생기 분배를 한 화면에 놓기 위한 판단 도식입니다.'],
        ['읽는 법', '피해 전에는 속죄 수와 신의 권능: 광휘 충전을 보고, 피해 직후에는 회개와 정신 분열이 속죄 창 안에 들어갔는지 확인합니다.'],
        ['검수 포인트', '고통 억제, 신의 권능: 방벽, 궁극의 참회, 보호막 분배가 같은 피해에 겹치지 않도록 구간을 나누는 것이 목표입니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'priest-holy') {
    plan.push({
      id: 'cooldown',
      title: '빛의 권능과 대형 쿨다운 창',
      sectionHeading: '권능과 쿨다운 배정',
      sectionIntro:
        '신성 사제는 큰 피해가 오기 전에 빛의 권능 충전, 절정, 후광, 천상의 찬가, 수호 영혼을 어떻게 나눌지 먼저 정해야 합니다.',
      caption:
        '신성은 고정 순서보다 빛의 권능 두 충전 낭비를 막고, 빛의 쇄도 순간 치유, 빛술사 치유의 기원, 절정, 후광, 천상의 찬가, 수호 영혼을 피해 타이머에 나누는 판단이 핵심입니다.',
      definition: [
        ['의미', '막대는 실제 로그 수치가 아니라 빛의 권능 충전, 빛의 쇄도 순간 치유 소비, 빛술사 이후 치유의 기원 소비, 절정 압축 창, 후광 위치 창, 천상의 찬가 채널, 수호 영혼 배정을 한 화면에 놓는 도식입니다.'],
        ['읽는 법', '빛의 권능이 두 충전에 가까우면 먼저 비우고, 다음 피해가 짧으면 절정/후광, 길고 넓으면 천상의 찬가를 우선 검토합니다.'],
        ['검수 포인트', '회복의 기원은 전투 내내 굴리고, 빛의 쇄도는 순간 치유로 소비했는지, 빛술사 없이 치유의 기원을 남발해 마나를 망가뜨리지 않았는지 함께 봅니다.'],
      ],
    });
    return plan;
  }

  if (guide.id === 'evoker-preservation') {
    plan.push({
      id: 'uptime',
      title: '메아리-피해 파동 준비 타임라인',
      sectionHeading: '피해 전 준비와 피해 후 복구',
      sectionIntro:
        '보존은 피해가 들어온 뒤 힐을 찾는 힐러가 아니라, 메아리와 시간 변칙으로 대상 기반을 미리 만들고 피해 후 되돌리기와 꿈의 비행을 따로 배정하는 힐러입니다.',
      caption:
        '막대는 실제 HPS 수치가 아니라 메아리, 시간 변칙, 메리스라의 축복, 되감기, 정지장, 되돌리기, 꿈의 비행을 피해 타이머에 놓는 판단 도식입니다.',
      definition: [
        ['의미', '피해 전에는 메아리 기반을 만들고, 피해 직전에는 소비 주문을 정하며, 피해 후에는 복구 쿨다운을 배정합니다.'],
        ['읽는 법', '시간 변칙과 메아리는 앞쪽 준비 흐름, 메리스라의 축복과 신록의 품은 소비 흐름, 되돌리기와 꿈의 비행은 후속 복구 흐름으로 봅니다.'],
        ['검수 포인트', '에메랄드 꽃은 메아리 소비기가 아니며, 되감기와 되돌리기는 각각 지속 회복과 피해 후 복구로 분리해 확인합니다.'],
      ],
    });
    return plan;
  }

  if (guide.role === 'healers') {
    plan.push({
      id: 'defensive',
      title: '피해 대응 배치',
      caption: '힐러는 고정 순서보다 피해 타이머에 맞춘 준비와 복구가 중요합니다.',
    });
    return plan;
  }

  if (guide.role === 'tanks') {
    plan.push({
      id: 'defensive',
      title: '생존기 배치',
      caption: '탱커는 받은 피해와 다음 위험 구간을 기준으로 생존기를 나눕니다.',
    });
    return plan;
  }

  if (guide.id === 'evoker-augmentation') {
    plan.push({
      id: 'uptime',
      title: '칠흑의 힘-예지 유지 타임라인',
      sectionHeading: '지원 버프 유지와 파티 창',
      sectionIntro:
        '증강은 개인 딜사이클보다 칠흑의 힘 유지, 예지 대상, 영겁의 숨결 파티 창, 분출 소비가 서로 맞물리는지가 중요합니다.',
      caption:
        '막대는 실제 WCL 수치가 아니라 칠흑의 힘, 예지, 영겁의 숨결, 분출/강화 주문, 탱커 지원을 한 화면에 놓는 지원 판단 도식입니다.',
      definition: [
        ['의미', '증강의 핵심 데이터는 개인 DPS가 아니라 버프가 누구에게, 언제, 얼마나 유지됐는지입니다.'],
        ['읽는 법', '칠흑의 힘은 전투 전반의 중심 흐름, 예지는 대상 선정 흐름, 영겁의 숨결은 파티 극딜 흐름으로 따로 봅니다.'],
        ['검수 포인트', '칠흑의 힘 공백, 잘못된 예지 대상, 영겁의 숨결 장거리 비행, 버프 밖 분출 소비를 확인합니다.'],
      ],
    });
    return plan;
  }

  plan.push({
    id: 'resource',
    title: '자원 흐름',
    caption: '소모 기술을 언제 미루고 언제 털어야 하는지 핵심 판단을 보조합니다.',
  });
  return plan;
}

function renderInlineChart(chart, guide, data, profile, manuscript, inlineTerms) {
  switch (chart.id) {
    case 'rotation':
      return (
        <RotationRailChart
          guide={guide}
          profile={profile}
          skills={data.rotationSource}
          synergy={data.importantSynergy}
          manualOpener={manuscript?.opener}
          inlineTerms={inlineTerms}
        />
      );
    case 'priority':
      return (
        <PriorityListChart
          guide={guide}
          title={profile.priorityTitle}
          skills={data.prioritySource}
          manualPriority={manuscript?.priority}
          inlineTerms={inlineTerms}
        />
      );
    default:
      return renderChart(chart.id, guide, data, profile, chart);
  }
}

function InlineFigure({ chart, guide, data, profile, manuscript, inlineTerms }) {
  return (
    <InlineChartFigure>
      <InlineChartHead>
        <strong>{renderGuideText(chart.title, inlineTerms)}</strong>
        <span>{renderGuideText(chart.caption, inlineTerms)}</span>
      </InlineChartHead>
      {!!chart.definition?.length && (
        <ChartDefinitionGrid>
          {chart.definition.map(([label, text]) => (
            <ChartDefinitionItem key={label}>
              <span>{label}</span>
              <strong>{renderGuideText(text, inlineTerms)}</strong>
            </ChartDefinitionItem>
          ))}
        </ChartDefinitionGrid>
      )}
      {renderInlineChart(chart, guide, data, profile, manuscript, inlineTerms)}
    </InlineChartFigure>
  );
}

function getFlowPhaseLabel(guide, index, total) {
  const healerPhases = ['사전 배치', '피해 직전', '힐업 창', '복구/안정화'];
  const tankPhases = ['진입', '방어 기반', '자원 확보', '안정화'];
  const damagePhases = ['진입', '기반 세팅', '극딜 창', '순환 전환'];
  const phases = guide?.role === 'healers'
    ? healerPhases
    : guide?.role === 'tanks'
    ? tankPhases
    : damagePhases;
  const phaseIndex = Math.min(phases.length - 1, Math.floor((index / Math.max(total, 1)) * phases.length));
  return phases[phaseIndex];
}

function getFlowTriggerLabel(guide, phase, index, total, step = {}) {
  if (step.trigger) return step.trigger;

  if (guide?.role === 'healers') {
    if (/사전/.test(phase)) return '피해 예고 전';
    if (/직전/.test(phase)) return '피해 3-6초 전';
    if (/힐업/.test(phase)) return '피해 발생 직후';
    return '다음 피해 전 안정화';
  }

  if (guide?.role === 'tanks') {
    if (/진입/.test(phase)) return '풀링/위치 고정';
    if (/방어/.test(phase)) return '첫 큰 피해 전';
    if (/자원/.test(phase)) return '분노·위협 확보';
    return '다음 탱 버스터 대비';
  }

  if (/진입/.test(phase)) return '전투 시작';
  if (/기반/.test(phase)) return '버프·지속 효과 준비';
  if (/극딜/.test(phase)) return '쿨기·자원 소비 창';
  if (index >= total - 1) return '우선순위 루프로 전환';
  return '발동·대상 수 확인';
}

function getOpenerFlowSteps(manuscript, profile, guide) {
  const rawSteps = manuscript?.opener?.steps?.slice(0, OPENER_FLOW_MAX_STEPS) || [];
  return rawSteps.map((step, index) => {
    const skill = skillFromManualStep(step);
    const stage = getFlowPhaseLabel(guide, index, rawSteps.length);
    const phase = step.phase || getFlowPhaseLabel(guide, index, rawSteps.length);
    return {
      key: `${step.skillId || 'opener'}-${index}`,
      skill,
      label: step.label || profile.steps[index] || `${index + 1}단계`,
      note: step.note || (skill ? skillName(skill) : ''),
      stage,
      phase,
      trigger: getFlowTriggerLabel(guide, phase, index, rawSteps.length, step),
    };
  });
}

function getFlowCardTitle(guide) {
  if (guide?.role === 'healers') return '피해 대응 전투 흐름';
  if (guide?.role === 'tanks') return '진입/방어 전투 흐름';
  return '오프닝 전투 흐름';
}

function getFlowChartTitle(guide) {
  return `${getFlowCardTitle(guide)} 차트`;
}

function getFlowMapCopy(guide) {
  if (guide?.role === 'healers') {
    return {
      start: '피해 예고',
      middle: '예열 → 회수 → 안정화',
      end: '다음 피해',
      keys: ['사전 예열', '피해 순간', '복구 판단'],
    };
  }

  if (guide?.role === 'tanks') {
    return {
      start: '풀링',
      middle: '위협 → 방어층 → 생존기 배정',
      end: '다음 위험',
      keys: ['진입 버튼', '방어 조건', '위험 대응'],
    };
  }

  if (guide?.role === 'support') {
    return {
      start: '준비',
      middle: '강화 → 대상 확인 → 파티 창',
      end: '다음 강화',
      keys: ['강화 시작', '대상 조건', '파티 창'],
    };
  }

  return {
    start: '전투 시작',
    middle: '준비 → 큰 창 → 우선순위 루프',
    end: '반복 판단',
    keys: ['첫 버튼', '사용 조건', '손실 방지'],
  };
}

function fallbackFlowStepFromText(item, index, total, guide, inlineTerms) {
  const text = displayGuideText(item);
  const [candidateLabel, ...rest] = text.split(/[:：]/);
  const label = cleanText(candidateLabel).replace(/^[\d\s.)-]+/, '');
  const hasExplicitLabel = !!rest.length && label.length > 1 && label.length <= 30;
  const skillTerm = inlineTerms?.find(term => (
    label === term.label ||
    label.startsWith(`${term.label} `) ||
    text.startsWith(term.label)
  ));

  const phase = getFlowPhaseLabel(guide, index, total);
  return {
    key: `fallback-opener-${index}`,
    skill: skillTerm?.skill || null,
    label: hasExplicitLabel ? label : `${index + 1}단계`,
    note: hasExplicitLabel ? rest.join(':').trim() : text,
    stage: phase,
    phase,
    trigger: getFlowTriggerLabel(guide, phase, index, total),
  };
}

function OpenerFlowPreview({ guide, steps, fallbackItems, inlineTerms }) {
  const flowItems = steps.length
    ? steps
    : fallbackItems.map((item, index) => fallbackFlowStepFromText(item, index, fallbackItems.length, guide, inlineTerms));
  const chartLabel = getFlowChartTitle(guide);
  const stageLegend = [...new Set(flowItems.map(item => item.stage || item.phase).filter(Boolean))];
  const mapCopy = getFlowMapCopy(guide);

  if (!flowItems.length) return null;

  return (
    <OpenerFlowViewport>
      <OpenerFlowMapHeader>
        <span>{mapCopy.start}</span>
        <strong>{mapCopy.middle}</strong>
        <span>{mapCopy.end}</span>
      </OpenerFlowMapHeader>
      <OpenerFlowKey aria-label="전투 흐름 기준">
        {mapCopy.keys.map(item => (
          <span key={item}>{item}</span>
        ))}
      </OpenerFlowKey>
      {stageLegend.length > 1 && (
        <OpenerFlowPhaseLegend aria-label="전투 흐름 단계">
          {stageLegend.map(phase => (
            <span key={phase}>{phase}</span>
          ))}
        </OpenerFlowPhaseLegend>
      )}
      <OpenerFlowList $color={guide.color} aria-label={chartLabel}>
        {flowItems.map((step, index) => (
          <li key={step.key}>
            <OpenerStepTop>
              <OpenerStepNumber>{String(index + 1).padStart(2, '0')}</OpenerStepNumber>
              <SkillIconLink skill={step.skill} size={46} />
            </OpenerStepTop>
            <OpenerStepBody>
              <OpenerPhase>{step.phase}</OpenerPhase>
              <strong>{step.label}</strong>
              <OpenerTrigger>{step.trigger}</OpenerTrigger>
              {!!step.note && <p>{renderGuideText(step.note, inlineTerms)}</p>}
            </OpenerStepBody>
          </li>
        ))}
      </OpenerFlowList>
    </OpenerFlowViewport>
  );
}

function NarrativeGuideSection({ guide, manuscript, data, profile, chartPlan, inlineTerms }) {
  if (!manuscript) return null;

  const contentBlocks = (manuscript.blocks || []).filter(block => !isMetaChartBlock(block));
  const openerBlocks = contentBlocks.filter(block => isOpenerNarrativeBlock(block, guide));
  const openerBlock = openerBlocks[0];
  const bodyBlocks = contentBlocks.filter(block => !isOpenerNarrativeBlock(block, guide));
  const [rotationChart, priorityChart, specialistChart] = chartPlan;
  const digestBlocks = bodyBlocks.slice(0, 4);
  const openerFlowSteps = getOpenerFlowSteps(manuscript, profile, guide);
  const openerFallbackItems = openerBlocks
    .flatMap(block => [
      ...(block.bullets || []),
      ...(block.paragraphs || []),
    ])
    .slice(0, OPENER_FLOW_MAX_STEPS);
  const openerIntroTitle = manuscript.opener?.title || openerBlock?.title;
  const openerIntroSummary = manuscript.opener?.summary || openerBlock?.paragraphs?.[0];
  const tipItems = manuscript.tips?.length
    ? manuscript.tips
    : bodyBlocks.flatMap(block => block.bullets || []).slice(0, 5);
  const hasOpenerGuide = !!openerFlowSteps.length || !!openerFallbackItems.length;
  const hasSupportCards = !!manuscript.playstyle?.length || !!tipItems?.length;

  return (
    <SectionBlock id="manuscript">
      <SectionHead>
        <SectionIcon><BookOpen size={17} /></SectionIcon>
        <div>
          <SectionKicker>guide</SectionKicker>
          <SectionTitle>공략 핵심</SectionTitle>
        </div>
      </SectionHead>

      <PaperLead $color={guide.color}>
        <ManuscriptStatus>{manuscript.status}</ManuscriptStatus>
        <p>{renderGuideText(manuscript.summary, inlineTerms)}</p>
        <ManuscriptMeta>
          <span>패치 {manuscript.patch}</span>
          <span>조사 {manuscript.researchedAt}</span>
        </ManuscriptMeta>
      </PaperLead>

      {hasOpenerGuide && (
        <OpenerFlowCard
          $color={guide.color}
          aria-label={getFlowChartTitle(guide)}
          data-guide-chart="opener-flow"
        >
          <FieldGuideCardHead>
            <Clock3 size={15} />
            <strong>{getFlowChartTitle(guide)}</strong>
          </FieldGuideCardHead>
          {!!(openerIntroTitle || openerIntroSummary) && (
            <OpenerFlowIntro>
              {!!openerIntroTitle && (
                <strong>{renderGuideText(openerIntroTitle, inlineTerms)}</strong>
              )}
              {!!openerIntroSummary && (
                <p>{renderGuideText(openerIntroSummary, inlineTerms)}</p>
              )}
            </OpenerFlowIntro>
          )}
          <OpenerFlowPreview guide={guide} steps={openerFlowSteps} fallbackItems={openerFallbackItems} inlineTerms={inlineTerms} />
        </OpenerFlowCard>
      )}

      {hasSupportCards && (
        <FieldGuideGrid $color={guide.color}>
          {!!manuscript.playstyle?.length && (
            <FieldGuideCard $color={guide.color}>
              <FieldGuideCardHead>
                <Target size={15} />
                <strong>먼저 이렇게 이해</strong>
              </FieldGuideCardHead>
              <FieldGuideList>
                {manuscript.playstyle.map(item => (
                  <li key={`${item.label}-${item.text}`}>
                    <span>{renderGuideText(item.label, inlineTerms)}</span>
                    <p>{renderGuideText(item.text, inlineTerms)}</p>
                  </li>
                ))}
              </FieldGuideList>
            </FieldGuideCard>
          )}

          {!!tipItems?.length && (
            <FieldGuideCard $color={guide.color}>
              <FieldGuideCardHead>
                <Sparkles size={15} />
                <strong>실전 꿀팁</strong>
              </FieldGuideCardHead>
              <TipList>
                {tipItems.map(item => (
                  <li key={item}>{renderGuideText(item, inlineTerms)}</li>
                ))}
              </TipList>
            </FieldGuideCard>
          )}
        </FieldGuideGrid>
      )}

      {!!digestBlocks.length && (
        <GuideDigestGrid aria-label="가이드 빠른 요약">
          {digestBlocks.map((block, index) => {
            const digest = block.bullets?.[0] || block.paragraphs?.[0];
            return (
              <GuideDigestCard key={`${block.title}-${index}`}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{renderGuideText(block.title.replace(/^\d+\.\s*/, ''), inlineTerms)}</strong>
                {!!digest && <p>{renderGuideText(digest, inlineTerms)}</p>}
              </GuideDigestCard>
            );
          })}
        </GuideDigestGrid>
      )}

      <PaperBody>
        {bodyBlocks.map((block, index) => {
          const primaryBullets = block.bullets?.slice(0, 2) || [];
          const detailBullets = block.bullets?.slice(2) || [];

          return (
          <React.Fragment key={`${block.title}-${index}`}>
            <PaperSection id={`guide-section-${index + 1}`}>
              <PaperSectionBody>
                <SectionNumber>{String(index + 1).padStart(2, '0')}</SectionNumber>
                <h3>{renderGuideText(block.title, inlineTerms)}</h3>
                {block.paragraphs?.map(paragraph => (
                  <p key={paragraph}>{renderGuideText(paragraph, inlineTerms)}</p>
                ))}
                {!!detailBullets.length && (
                  <ManuscriptList>
                    {detailBullets.map(item => (
                      <li key={item}>{renderGuideText(item, inlineTerms)}</li>
                    ))}
                  </ManuscriptList>
                )}
              </PaperSectionBody>

              {!!primaryBullets.length && (
                <TakeawayPanel $color={guide.color}>
                  <TakeawayLabel>핵심 체크</TakeawayLabel>
                  <TakeawayList>
                    {primaryBullets.map(item => (
                      <li key={item}>{renderGuideText(item, inlineTerms)}</li>
                    ))}
                  </TakeawayList>
                </TakeawayPanel>
              )}
            </PaperSection>

            {index === 0 && rotationChart && !hasOpenerGuide && (
              <InlineFigure chart={rotationChart} guide={guide} data={data} profile={profile} manuscript={manuscript} inlineTerms={inlineTerms} />
            )}
          </React.Fragment>
          );
        })}

        {priorityChart && (
          <PaperSection>
            <h3>실전 우선순위</h3>
            <p>
              위 내용을 전투 중 판단 순서로 줄이면 아래와 같습니다. 숫자가 앞에 있을수록 먼저 확인해야 하는 조건입니다.
            </p>
            <InlineFigure chart={priorityChart} guide={guide} data={data} profile={profile} manuscript={manuscript} inlineTerms={inlineTerms} />
          </PaperSection>
        )}

        {specialistChart && (
          <PaperSection>
            <h3>{specialistChart.sectionHeading || '핵심 판단 도식'}</h3>
            <p>
              {renderGuideText(
                specialistChart.sectionIntro || '위 설명에서 다룬 관계를 실제 전투에서 다시 확인할 수 있게 한 화면에 묶었습니다.',
                inlineTerms
              )}
            </p>
            <InlineFigure chart={specialistChart} guide={guide} data={data} profile={profile} manuscript={manuscript} inlineTerms={inlineTerms} />
          </PaperSection>
        )}

        <EvidenceGrid>
          <EvidencePanel>
            <h3>참고한 자료</h3>
            <ManuscriptList>
              {manuscript.evidence?.map(item => (
                <li key={item}>{renderGuideText(item, inlineTerms)}</li>
              ))}
            </ManuscriptList>
          </EvidencePanel>
          <EvidencePanel>
            <h3>주의할 점</h3>
            <ManuscriptList>
              {manuscript.caveats?.map(item => (
                <li key={item}>{renderGuideText(item, inlineTerms)}</li>
              ))}
            </ManuscriptList>
          </EvidencePanel>
        </EvidenceGrid>
      </PaperBody>
    </SectionBlock>
  );
}

function GuideDetailPage() {
  const location = useLocation();
  const guide = useMemo(() => {
    const currentPath = normalizePath(location.pathname);
    return allGuides.find(item => normalizePath(item.path) === currentPath);
  }, [location.pathname]);

  const data = useMemo(() => (guide ? buildGuideData(guide) : null), [guide]);
  const manuscript = guide ? guideManuscripts[guide.id] : null;
  const inlineTerms = useMemo(() => buildInlineTerms(data, manuscript), [data, manuscript]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const timer = window.setTimeout(() => {
      try {
        const power = window.$WowheadPower;
        if (power?.refreshLinks) power.refreshLinks();
        if (window.WH?.Tooltips?.refreshLinks) window.WH.Tooltips.refreshLinks();
      } catch (error) {
        // Wowhead tooltip refresh is best-effort; links still work without it.
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [location.pathname, guide?.id, inlineTerms.length]);

  if (!guide || !data) {
    return (
      <Page>
        <EmptyState>
          <h1>가이드를 찾을 수 없습니다</h1>
          <p>등록된 전문화 목록에서 다시 선택하세요.</p>
          <BackLink to="/guide">
            <ArrowLeft size={16} />
            가이드 목록
          </BackLink>
        </EmptyState>
      </Page>
    );
  }

  const profile = getProfile(guide);
  const inlineChartPlan = getInlineChartPlan(guide, data);

  return (
    <Page>
      <Hero $color={guide.color} $tone={`${guide.color}18`}>
        <HeroTop>
          <BackLink to="/guide">
            <ArrowLeft size={16} />
            가이드 목록
          </BackLink>
          <PatchBadge>{manuscript ? `${CURRENT_PATCH_LABEL} · ${manuscript.status}` : CURRENT_PATCH_LABEL}</PatchBadge>
        </HeroTop>
        <HeroGrid>
          <div>
            <HeroEyebrow>{guide.className} · {profile.label}</HeroEyebrow>
            <HeroTitle>{guide.spec} {guide.className} 가이드</HeroTitle>
            <HeroLead>{renderGuideText(manuscript?.summary || `${guide.focus} ${profile.lead}`, inlineTerms)}</HeroLead>
          </div>
          <HeroStats>
            <HeroStat>
              <span>스킬</span>
              <strong>{data.specSkills.length}</strong>
            </HeroStat>
            <HeroStat>
              <span>공용</span>
              <strong>{data.commonSkills.length}</strong>
            </HeroStat>
            <HeroStat>
              <span>시너지</span>
              <strong>{data.synergies.length}</strong>
            </HeroStat>
            <HeroStat>
              <span>차트</span>
              <strong>{inlineChartPlan.length}</strong>
            </HeroStat>
          </HeroStats>
        </HeroGrid>
      </Hero>

      <GuideLayout>
        <GuideNav aria-label="가이드 목차">
          <GuideNavTitle>목차</GuideNavTitle>
          {[
            ['overview', '운용 요약'],
            ...(manuscript ? [['manuscript', '공략 핵심']] : []),
            ['skills', '핵심 스킬'],
            ['synergies', '시너지'],
            ['sources', '출처'],
          ].map(([id, label]) => (
            <GuideNavLink key={id} href={`#${id}`}>
              <span>{label}</span>
            </GuideNavLink>
          ))}
        </GuideNav>

        <Article>
          <SectionBlock id="overview">
            <SectionHead>
              <SectionIcon><BookOpen size={17} /></SectionIcon>
              <div>
                <SectionKicker>overview</SectionKicker>
                <SectionTitle>운용 요약</SectionTitle>
              </div>
            </SectionHead>
            <SummaryGrid>
              <SummaryItem>
                <SummaryLabel>핵심 판단</SummaryLabel>
                <SummaryText>{renderGuideText(profile.lead, inlineTerms)}</SummaryText>
              </SummaryItem>
              <SummaryItem>
                <SummaryLabel>데이터 기준</SummaryLabel>
                <SummaryText>
                  {renderGuideText(
                    manuscript?.sourceNote ||
                      `${data.specSkills.length}개 전문화 스킬, ${data.commonSkills.length}개 공용 스킬, ${data.synergies.length}개 시너지 노트를 같은 그래프 안에서 묶었습니다.`,
                    inlineTerms
                  )}
                </SummaryText>
              </SummaryItem>
              <SummaryItem>
                <SummaryLabel>읽기 전 체크</SummaryLabel>
                <SummaryText>
                  {renderGuideText(
                    manuscript?.caveats?.[0] || '확인된 출처와 KB 연결을 기준으로 정리하고, 미검증 항목은 설명에서 분리합니다.',
                    inlineTerms
                  )}
                </SummaryText>
              </SummaryItem>
            </SummaryGrid>
          </SectionBlock>

          <NarrativeGuideSection
            guide={guide}
            manuscript={manuscript}
            data={data}
            profile={profile}
            chartPlan={inlineChartPlan}
            inlineTerms={inlineTerms}
          />

          <SectionBlock id="skills">
            <SectionHead>
              <SectionIcon><Zap size={17} /></SectionIcon>
              <div>
                <SectionKicker>스킬 데이터</SectionKicker>
                <SectionTitle>핵심 스킬</SectionTitle>
              </div>
            </SectionHead>
            <SkillTable>
              {data.featuredSkills.map(skill => (
                <SkillRow key={`${skill.id}-${skill.spec}`}>
                  <SkillIconLink skill={skill} size={38} />
                  <SkillMain>
                    <SkillName href={wowheadUrl(skill)} data-wowhead={`spell=${skill.id}&domain=ko`} target="_blank" rel="noreferrer">
                      <img src={getIconUrl(skill)} alt="" loading="lazy" />
                      <span>{skillName(skill)}</span>
                    </SkillName>
                    <SkillSub>{displayGuideText(skill.spec || skill.category || 'KB 스킬')}</SkillSub>
                  </SkillMain>
                  <SkillMeta>{formatSkillMeta(skill)}</SkillMeta>
                </SkillRow>
              ))}
            </SkillTable>
          </SectionBlock>

          <SectionBlock id="synergies">
            <SectionHead>
              <SectionIcon><Link2 size={17} /></SectionIcon>
              <div>
                <SectionKicker>시너지 그래프</SectionKicker>
                <SectionTitle>시너지 연결</SectionTitle>
              </div>
            </SectionHead>
            <SynergyGraphView guide={guide} data={data} />
          </SectionBlock>

          <SectionBlock id="sources">
            <SectionHead>
              <SectionIcon><MapIcon size={17} /></SectionIcon>
              <div>
                <SectionKicker>출처 검증</SectionKicker>
                <SectionTitle>출처와 검증 기준</SectionTitle>
              </div>
            </SectionHead>
            <SourceGrid>
              {manuscript?.sources?.map(source => (
                <SourceBox key={`${guide.id}-${source.label}`} as="a" href={source.url} target="_blank" rel="noreferrer">
                  <SourceTier>{source.tier}</SourceTier>
                  <SourceBody>
                    <strong>{displayGuideText(source.label)}</strong>
                    <span>{displayGuideText(source.updated)} · {displayGuideText(source.note)}</span>
                  </SourceBody>
                </SourceBox>
              ))}
              <SourceBox>
                <SourceTier>S</SourceTier>
                <SourceBody>
                  <strong>ko.wowhead.com 툴팁</strong>
                  <span>스킬명과 아이콘은 KB에 저장된 Wowhead 한국어 기준 데이터를 사용합니다.</span>
                </SourceBody>
              </SourceBox>
              <SourceBox>
                <SourceTier>A</SourceTier>
                <SourceBody>
                  <strong>가이드 교차 검증</strong>
                  <span>Wowhead, Icy Veins, WCL/Archon, 직업 Discord 공개 자료를 KB 시너지 노트로 연결합니다.</span>
                </SourceBody>
              </SourceBox>
              <SourceBox>
                <SourceTier>KB</SourceTier>
                <SourceBody>
                  <strong>Obsidian 그래프</strong>
                  <span>{guide.className}/{guide.spec} 노트와 공용 노트를 함께 읽어 페이지를 구성합니다.</span>
                </SourceBody>
              </SourceBox>
            </SourceGrid>
          </SectionBlock>
        </Article>
      </GuideLayout>
    </Page>
  );
}

function getChartSet(guide) {
  if (guide.id === 'evoker-augmentation') {
    return [
      { id: 'cooldown', title: '파티 극딜 정렬', short: '쿨기 정렬', meta: '아군 강화와 주요 쿨기 타이밍', icon: Clock3 },
      { id: 'uptime', title: '강화 유지율', short: '유지율', meta: '버프/강화 공백 관리', icon: Activity },
      { id: 'target', title: '대상 수 가치 변화', short: '타겟 스케일', meta: '단일, 2타겟, 광역 전환', icon: Target },
      { id: 'network', title: '시너지 네트워크', short: '시너지', meta: 'KB 링크 기반 상호작용', icon: Link2 },
    ];
  }

  if (guide.role === 'tanks') {
    return [
      { id: 'defensive', title: '생존기 대응 플래너', short: '생존기', meta: '큰 피해 구간별 대응', icon: Shield },
      { id: 'resource', title: '자원/완화 곡선', short: '자원 곡선', meta: '생성, 유지, 회복 흐름', icon: Gauge },
      { id: 'uptime', title: '방어 유지율 타임라인', short: '유지율', meta: '완화 공백 확인', icon: Activity },
      { id: 'network', title: '시너지 네트워크', short: '시너지', meta: '방어 기술 연결', icon: Link2 },
    ];
  }

  if (guide.role === 'healers') {
    return [
      { id: 'defensive', title: '공격대 피해 대응표', short: '피해 대응', meta: '사전 작업과 외생기 배치', icon: Shield },
      { id: 'cooldown', title: '힐링 쿨기 정렬', short: '쿨기 정렬', meta: '광역 피해 구간별 쿨기', icon: Clock3 },
      { id: 'uptime', title: '유지 효과 타임라인', short: '유지율', meta: '도트/버프형 회복 관리', icon: Activity },
      { id: 'network', title: '시너지 네트워크', short: '시너지', meta: '회복 스킬 연결', icon: Link2 },
    ];
  }

  return [
    { id: 'cooldown', title: '쿨기 정렬 레인', short: '쿨기 정렬', meta: '극딜 창과 핵심 기술 동기화', icon: Clock3 },
    { id: 'resource', title: '자원 흐름 곡선', short: '자원 곡선', meta: '생성, 보존, 소모 구간', icon: Gauge },
    { id: 'target', title: '타겟 수 스케일링', short: '타겟 스케일', meta: '단일/광역 가치 변화', icon: Target },
    { id: 'network', title: '시너지 네트워크', short: '시너지', meta: '특성/스킬 연결', icon: Link2 },
  ];
}

function SynergyGraphView({ guide, data }) {
  const graph = getSynergyGraphModel(data, guide);
  const centerSkill = graph.center?.skill;

  if (!graph.synergyNodes.length) {
    return <EmptyState>이 전문화에 연결된 KB 시너지 노트가 아직 없습니다.</EmptyState>;
  }

  const centerName = centerSkill ? skillName(centerSkill) : guide.spec;
  const centerLines = graphLabelLines(centerName, 10);

  return (
    <SynergyGraphPanel>
      <SynergyGraphIntro>
        <div>
          <strong>중요도 기반 그래프</strong>
        <span>옵시디언 그래프처럼 스킬 노드, 시너지 노드, 연결선을 함께 보여줍니다. 가운데는 이 전문화 운용을 해석할 때 가장 먼저 보는 핵심 스킬입니다.</span>
        </div>
        <SynergyGraphLegend>
          <span>가운데 = 중심 스킬</span>
          <span>보라 = 스킬</span>
          <span>푸른색 = 특성</span>
          <span>청록색 = 영웅 특성</span>
          <span>금색 = 시너지 노드</span>
          <span>선 굵기 = 연결 강도</span>
        </SynergyGraphLegend>
      </SynergyGraphIntro>

      <SynergyGraphStats>
        <span>중심 <b>{centerName}</b></span>
        <span>{centerConnectionLabel(graph.center)}</span>
        <span>{graph.totalNodes}개 노드</span>
        <span>{graph.edges.length}개 연결선</span>
      </SynergyGraphStats>

      <SynergyGraphCanvas>
        <SynergyGraphSvg
          viewBox={`0 0 ${graph.width} ${graph.height}`}
          role="img"
          aria-label={`${guide.spec} ${guide.className} 시너지 그래프`}
          $color={guide.color}
        >
          <defs>
            <radialGradient id="synergy-graph-center-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={guide.color} stopOpacity="0.32" />
              <stop offset="62%" stopColor={guide.color} stopOpacity="0.08" />
              <stop offset="100%" stopColor={guide.color} stopOpacity="0" />
            </radialGradient>
          </defs>

          <g className="graph-orbits" aria-hidden="true">
            <ellipse cx={graph.centerPoint.x} cy={graph.centerPoint.y} rx="305" ry="188" />
            <ellipse cx={graph.centerPoint.x} cy={graph.centerPoint.y} rx="405" ry="252" />
          </g>

          <g className="graph-edges" aria-hidden="true">
            {graph.edges.map(edge => (
              <line
                key={edge.id}
                className={edge.center ? 'graph-edge graph-edge-center' : 'graph-edge'}
                x1={edge.from.x}
                y1={edge.from.y}
                x2={edge.to.x}
                y2={edge.to.y}
                strokeWidth={edge.center ? 2 + edge.strength * 0.7 : 0.7 + edge.strength * 0.45}
              />
            ))}
          </g>

          <g className="graph-synergies">
            {graph.synergyNodes.map(node => {
              const lines = graphLabelLines(synergyName(node.synergy), 12);
              return (
                <g
                  key={node.id}
                  className={`graph-node graph-synergy-node ${node.major ? 'graph-major' : 'graph-secondary'}`}
                  transform={`translate(${node.x} ${node.y})`}
                >
                  <title>{`${synergyName(node.synergy)} · ${node.linkedCount}개 연결`}</title>
                  <circle className="node-glow" r={node.r + 13} />
                  <circle className="node-body" r={node.r} />
                  <circle className="node-core" r={Math.max(5, node.r * 0.36)} />
                  {node.major && (
                    <text className="graph-label synergy-label" textAnchor="middle" y={node.r + 19}>
                      {lines.slice(0, 2).map((line, index) => (
                        <tspan key={line} x="0" dy={index ? 13 : 0}>{line}</tspan>
                      ))}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          <g className="graph-skills">
            {graph.skillNodes.map(node => {
              const iconUrl = getIconUrl(node.skill, 'medium');
              const labelLines = graphLabelLines(skillName(node.skill), 9);
              const clipId = `${node.id}-clip`;
              return (
                <a
                  key={node.id}
                  href={wowheadUrl(node.skill)}
                  data-wowhead={`spell=${node.skill.id}&domain=ko`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <g
                    className={`graph-node graph-skill-node graph-kind-${node.nodeKind} ${node.major ? 'graph-major' : 'graph-secondary'}`}
                    transform={`translate(${node.x} ${node.y})`}
                  >
                    <title>{`${skillNodeKindLabel(node.skill)} · ${skillName(node.skill)} · ${node.connectionCount}개 시너지 연결`}</title>
                    <clipPath id={clipId}>
                      <circle cx="0" cy="0" r={Math.max(9, node.r - 4)} />
                    </clipPath>
                    <circle className="skill-halo" r={node.r + 10} />
                    <circle className="skill-frame" r={node.r} />
                    {iconUrl ? (
                      <image
                        href={iconUrl}
                        x={-(node.r - 4)}
                        y={-(node.r - 4)}
                        width={(node.r - 4) * 2}
                        height={(node.r - 4) * 2}
                        clipPath={`url(#${clipId})`}
                        preserveAspectRatio="xMidYMid slice"
                      />
                    ) : (
                      <circle className="skill-fallback" r={Math.max(8, node.r - 6)} />
                    )}
                    <text className="graph-label skill-label" textAnchor="middle" y={node.r + 19}>
                      {labelLines.slice(0, 2).map((line, index) => (
                        <tspan key={line} x="0" dy={index ? 13 : 0}>{line}</tspan>
                      ))}
                    </text>
                    {node.major && (
                      <text className="graph-label kind-label" textAnchor="middle" y={node.r + 47}>
                        {skillNodeKindLabel(node.skill)}
                      </text>
                    )}
                  </g>
                </a>
              );
            })}
          </g>

          <g className="graph-center-node" transform={`translate(${graph.centerPoint.x} ${graph.centerPoint.y})`}>
            <circle className="center-outer" r="96" />
            <circle className="center-glow" r="72" />
            <circle className="center-frame" r="48" />
            {centerSkill && (
              <a
                href={wowheadUrl(centerSkill)}
                data-wowhead={`spell=${centerSkill.id}&domain=ko`}
                target="_blank"
                rel="noreferrer"
              >
                <clipPath id="graph-center-icon-clip">
                  <circle cx="0" cy="0" r="38" />
                </clipPath>
                <image
                  href={getIconUrl(centerSkill, 'medium')}
                  x="-38"
                  y="-38"
                  width="76"
                  height="76"
                  clipPath="url(#graph-center-icon-clip)"
                  preserveAspectRatio="xMidYMid slice"
                />
              </a>
            )}
            <text className="center-kicker" textAnchor="middle" y="-70">중심 스킬</text>
            <text className="center-name" textAnchor="middle" y="72">
              {centerLines.slice(0, 2).map((line, index) => (
                <tspan key={line} x="0" dy={index ? 17 : 0}>{line}</tspan>
              ))}
            </text>
            <text className="center-meta" textAnchor="middle" y="110">{centerConnectionLabel(graph.center)}</text>
          </g>

          <g className="graph-corner-note" aria-hidden="true">
            <text x="34" y="42">OBSIDIAN-LIKE NETWORK</text>
            <text x="34" y="66">skill ↔ synergy ↔ skill</text>
          </g>
        </SynergyGraphSvg>
      </SynergyGraphCanvas>

      <SynergyRelationBoard graph={graph} centerSkill={centerSkill} guide={guide} />
    </SynergyGraphPanel>
  );
}

function RelationChip({ skill, tone = 'skill' }) {
  if (!skill) return null;

  return (
    <RelationChipItem $tone={tone}>
      <SkillIconLink skill={skill} size={24} stacked />
      <span>{skillName(skill)}</span>
      <small>{skillNodeKindLabel(skill)}</small>
    </RelationChipItem>
  );
}

function SynergyRelationBoard({ graph, centerSkill, guide }) {
  const records = graph.synergyNodes
    .filter(node => node.linkedToCenter || node.major)
    .slice(0, 6);

  if (!records.length) return null;

  return (
    <SynergyRelationGrid>
      {records.map(record => {
        const relation = splitRelationParticipants(record, centerSkill);
        return (
          <SynergyRelationCard key={`relation-${record.id}`} $color={guide.color}>
            <RelationCardHeader>
              <div>
                <span>{synergyTypeLabel(record.synergy)}</span>
                <strong>{synergyName(record.synergy)}</strong>
              </div>
              <b>{record.linkedCount} 연결</b>
            </RelationCardHeader>

            <RelationFlow>
              <RelationChip skill={relation.center} tone="center" />
              {!!relation.skills.length && (
                <>
                  <RelationArrow>→</RelationArrow>
                  <RelationGroup>
                    <em>스킬</em>
                    {relation.skills.map(skill => (
                      <RelationChip key={`${record.synergy.id}-skill-${skill.id}`} skill={skill} tone="skill" />
                    ))}
                  </RelationGroup>
                </>
              )}
              {!!relation.talents.length && (
                <>
                  <RelationArrow>+</RelationArrow>
                  <RelationGroup>
                    <em>특성</em>
                    {relation.talents.map(skill => (
                      <RelationChip key={`${record.synergy.id}-talent-${skill.id}`} skill={skill} tone={skillNodeKind(skill)} />
                    ))}
                  </RelationGroup>
                </>
              )}
            </RelationFlow>

            <RelationExplain>{describeSynergyRecord(record, centerSkill)}</RelationExplain>
          </SynergyRelationCard>
        );
      })}
    </SynergyRelationGrid>
  );
}

function renderChart(id, guide, data, profile, chart) {
  switch (id) {
    case 'cooldown':
      return <CooldownLaneChart skills={data.cooldownSkills} guide={guide} />;
    case 'resource':
      return <ResourceCurveChart guide={guide} skills={data.featuredSkills} profile={profile} />;
    case 'defensive':
      return <DefensivePlannerChart guide={guide} data={data} profile={profile} />;
    case 'uptime':
      return <UptimeTimelineChart guide={guide} data={data} chart={chart} />;
    case 'target':
      return <TargetScalingChart guide={guide} skills={data.featuredSkills} />;
    case 'network':
      return <SynergyNetworkChart guide={guide} data={data} />;
    default:
      return null;
  }
}

function RotationRailChart({ guide, profile, skills, synergy, manualOpener, inlineTerms }) {
  const openerSteps = manualOpener?.steps?.slice(0, OPENER_FLOW_MAX_STEPS) || [];
  const manualSteps = openerSteps.map((step, index) => {
    const skill = skillFromManualStep(step);
    const stage = getFlowPhaseLabel(guide, index, openerSteps.length);
    const phase = step.phase || getFlowPhaseLabel(guide, index, openerSteps.length);
    return {
      key: `${step.skillId || 'manual'}-${index}`,
      skill,
      label: step.label || profile.steps[index] || `${index + 1}순위`,
      note: step.note || (skill ? skillName(skill) : '공략 단계'),
      stage,
      phase,
      trigger: getFlowTriggerLabel(guide, phase, index, openerSteps.length, step),
    };
  });
  const visibleSteps = manualSteps.length
    ? manualSteps
    : skills.slice(0, OPENER_FLOW_MAX_STEPS).map((skill, index) => {
      const phase = getFlowPhaseLabel(guide, index, Math.max(skills.length, 1));
      return {
        key: `${skill.id}-${index}`,
        skill,
        label: profile.steps[index] || `${index + 1}순위`,
        note: skillName(skill),
        stage: phase,
        phase,
        trigger: getFlowTriggerLabel(guide, phase, index, Math.max(skills.length, 1)),
      };
    });

  return (
    <RotationFeature $color={guide.color}>
      <RotationHeader>
        <div>
          <RotationTitle>{renderGuideText(getFlowChartTitle(guide), inlineTerms)}</RotationTitle>
          {!!(manualOpener?.title || profile.cycleTitle) && (
            <RotationFlowSubtitle>
              {renderGuideText(manualOpener?.title || profile.cycleTitle, inlineTerms)}
            </RotationFlowSubtitle>
          )}
          <RotationLead>
            {renderGuideText(manualOpener?.summary || (synergy ? `${synergyName(synergy)} 시너지를 기준으로 핵심 스킬을 배치했습니다.` : profile.lead), inlineTerms)}
          </RotationLead>
        </div>
        <RotationStats>
          <RotationStat>
            <span>포지션</span>
            <strong>{profile.label}</strong>
          </RotationStat>
          <RotationStat>
            <span>스텝</span>
            <strong>{Math.max(visibleSteps.length, 1)}</strong>
          </RotationStat>
        </RotationStats>
      </RotationHeader>
      <RotationFlowWrap>
        <OpenerFlowPreview guide={guide} steps={visibleSteps} fallbackItems={[]} inlineTerms={inlineTerms} />
      </RotationFlowWrap>
      <RotationCaption>
        <Sparkles size={15} />
        <span>{guide.spec} {guide.className} {profile.label} 핵심 루프</span>
      </RotationCaption>
    </RotationFeature>
  );
}

function PriorityListChart({ guide, title, skills, manualPriority, inlineTerms }) {
  const rows = manualPriority?.length
    ? manualPriority.map((item, index) => {
      const skill = skillFromManualStep(item);
      return {
        key: `${item.skillId || 'manual'}-${index}`,
        skill,
        name: item.label || (skill ? skillName(skill) : ''),
        note: item.note,
      };
    })
    : skills.map((skill, index) => ({
      key: `${skill.id}-${skill.spec}-${index}`,
      skill,
      name: skillName(skill),
      note: getPriorityNote(guide, skill),
    }));

  return (
    <PriorityPanel>
      <PriorityPanelTitle>{renderGuideText(title, inlineTerms)}</PriorityPanelTitle>
      {rows.map((row, index) => (
        <PriorityRow key={row.key} $rank={index}>
          <PriorityRank>{index + 1}</PriorityRank>
          <SkillIconLink skill={row.skill} size={32} />
          <PriorityText>
            <strong>{row.name}</strong>
            <span>{renderGuideText(row.note, inlineTerms)}</span>
          </PriorityText>
        </PriorityRow>
      ))}
    </PriorityPanel>
  );
}

function CooldownLaneChart({ skills, guide }) {
  const lanes = skills.length ? skills : [];

  return (
    <LaneChart>
      {lanes.map((skill, index) => {
        const seconds = parseCooldownSeconds(skill);
        const start = 4 + ((index * 17) % 44);
        const width = Math.max(22, Math.min(72, seconds ? 88 - seconds / 2.5 : 38));
        return (
          <Lane key={`${skill.id}-${index}`}>
            <LaneLabel>
              <SkillIconLink skill={skill} size={28} />
              <span>{skillName(skill)}</span>
            </LaneLabel>
            <LaneTrack>
              <LaneBar $start={start} $width={width} $color={guide.color} />
            </LaneTrack>
          </Lane>
        );
      })}
      <AxisLabels>
        <span>0초</span>
        <span>30초</span>
        <span>60초</span>
        <span>90초+</span>
      </AxisLabels>
    </LaneChart>
  );
}

function ResourceCurveChart({ guide, skills, profile }) {
  const label = resourceLabel(skills, guide);

  return (
    <ResourceChart>
      <CurveSvg viewBox="0 0 420 150" role="img" aria-label={`${profile.resourceTitle} 차트`}>
        <path d="M18 118 C72 106, 92 52, 150 66 C206 79, 221 28, 276 36 C332 44, 345 100, 402 76" fill="none" stroke="rgba(244,239,229,0.16)" strokeWidth="14" strokeLinecap="round" />
        <path d="M18 118 C72 106, 92 52, 150 66 C206 79, 221 28, 276 36 C332 44, 345 100, 402 76" fill="none" stroke={guide.color} strokeWidth="5" strokeLinecap="round" />
        <circle cx="150" cy="66" r="8" fill="#b8915b" />
        <circle cx="276" cy="36" r="8" fill={guide.color} />
      </CurveSvg>
      <MeterGrid>
        <MeterBox>
          <span>관리 대상</span>
          <strong>{label}</strong>
        </MeterBox>
        <MeterBox>
          <span>운용 방식</span>
          <strong>{profile.resourceTitle}</strong>
        </MeterBox>
      </MeterGrid>
    </ResourceChart>
  );
}

function DefensivePlannerChart({ guide, data, profile }) {
  const pool = guide.role === 'healers'
    ? uniqueBy([...data.healingSkills, ...data.defensiveSkills, ...data.utilitySkills], skill => String(skill.id))
    : uniqueBy([...data.defensiveSkills, ...data.utilitySkills, ...data.featuredSkills], skill => String(skill.id));
  const labels = guide.role === 'healers'
    ? ['피해 8초 전', '피해 직전', '피해 중', '피해 후 회복']
    : ['위험 기술 전', '피해 진입', '피해 중', '다음 구간 준비'];

  return (
    <DefensiveList>
      {labels.map((label, index) => {
        const skill = pool[index % Math.max(pool.length, 1)];
        return (
          <DefensiveRow key={label}>
            <EventTime>{label}</EventTime>
            <EventName>
              <SkillIconLink skill={skill} size={30} />
              <span>{skill ? skillName(skill) : profile.plannerTitle}</span>
            </EventName>
            <EventAction>{index < 2 ? '선배치' : '후속 대응'}</EventAction>
          </DefensiveRow>
        );
      })}
    </DefensiveList>
  );
}

function findSkillByNames(data, names) {
  const normalizedNames = names.map(normalizeSkillLookupText).filter(Boolean);
  const exactMatch = data.scopedSkills.find(skill => {
    const keys = skillLookupKeys(skill);
    return normalizedNames.some(name => keys.includes(name));
  });

  if (exactMatch) return exactMatch;

  return data.scopedSkills.find(skill => {
    const keys = skillLookupKeys(skill);
    return normalizedNames.some(name => keys.some(key => key.includes(name)));
  });
}

function getUptimeRows(guide, data) {
  if (guide.id === 'priest-discipline') {
    return [
      {
        label: '중심 버프',
        skill: findSkillByNames(data, ['속죄']),
        note: '모든 램프와 피해 전환 치유가 지나가는 중앙 노드입니다. 대상 수와 남은 시간을 가장 먼저 봅니다.',
        segments: [[6, 14], [28, 14], [50, 14], [72, 14]],
      },
      {
        label: '광역 준비',
        skill: findSkillByNames(data, ['신의 권능: 광휘']),
        note: '다수 속죄를 피해 직전에 맞추는 충전 기술입니다. 너무 빠르면 속죄 시간이 새고, 너무 늦으면 회수가 늦습니다.',
        segments: [[14, 8], [38, 8], [62, 8], [86, 8]],
      },
      {
        label: '램프 압축',
        skill: findSkillByNames(data, ['사도']),
        note: '광휘 램프를 빠르게 여는 핵심 쿨다운입니다. 피해 이벤트와 밀착시키고, 직후 피해 주문을 비우지 않습니다.',
        segments: [[20, 14], [70, 14]],
      },
      {
        label: '보호막 경제',
        skill: findSkillByNames(data, ['공허의 보호막', '신의 권능: 보호막']),
        note: '12.0.5 보호막 중심 조정의 핵심입니다. 강하지만 마나와 다음 램프 준비 시간을 같이 봐야 합니다.',
        segments: [[4, 10], [24, 10], [44, 10], [64, 10], [84, 10]],
      },
      {
        label: '피해 회수',
        skill: findSkillByNames(data, ['회개', '정신 분열']),
        note: '속죄 창 안에서 실제 치유량을 돌려주는 피해 주문 축입니다. 속죄가 없으면 가치가 크게 줄어듭니다.',
        segments: [[23, 8], [33, 7], [73, 8], [83, 7]],
      },
      {
        label: '지속 피해',
        skill: findSkillByNames(data, ['어둠의 권능: 고통', '사악의 정화']),
        note: '램프 중 피해 전환을 뒷받침하는 유지 축입니다. 회개 확산과 대속 판단까지 같이 봅니다.',
        segments: [[2, 94]],
      },
      {
        label: '예언자 안정',
        skill: findSkillByNames(data, ['두 개의 시야', '경건', '보장된 안전', '회개']),
        note: '현재 레이드/쐐기 로그 표본의 기본 영웅 특성 축입니다. 회개 보강과 보호막 보조로 큰 쿨다운 사이 빈 구간을 메웁니다.',
        segments: [[16, 10], [46, 10], [76, 10]],
      },
      {
        label: '공허술사 피해 창',
        skill: findSkillByNames(data, ['혼돈의 균열', '공허의 폭발']),
        note: '선택 시 암흑 피해 창을 속죄 대상에게 돌려야 의미가 있습니다. 속죄 없는 균열은 낭비입니다.',
        segments: [[30, 12], [80, 12]],
      },
      {
        label: '대형 복구',
        skill: findSkillByNames(data, ['궁극의 참회']),
        note: '사도와 같은 피해에 겹치기보다 별도 이벤트에 배정할 때 쿨다운 분배가 안정됩니다.',
        segments: [[54, 18]],
      },
      {
        label: '외생기',
        skill: findSkillByNames(data, ['고통 억제', '신의 권능: 방벽', '신의 권능: 보호막']),
        note: '한 대상 급사, 위치형 공대 피해, 보호막 분배를 서로 다른 위험 구간에 나눕니다.',
        segments: [[34, 12], [58, 12], [88, 10]],
      },
      {
        label: '직접 복구',
        skill: findSkillByNames(data, ['어둠의 치유', '순간 치유', '간청']),
        note: '쐐기나 사망 직전 상황에서는 예쁜 램프보다 한 명을 살리는 판단이 먼저입니다.',
        segments: [[18, 7], [42, 7], [66, 7], [90, 7]],
      },
      {
        label: '쐐기 유틸',
        skill: findSkillByNames(data, ['정화', '마법 무효화', '신의의 도약']),
        note: '위험 주문과 디버프를 제거하면 애초에 복구해야 할 피해량이 줄어듭니다.',
        segments: [[12, 6], [36, 6], [60, 6], [82, 6]],
      },
    ];
  }

  if (guide.id === 'druid-restoration') {
    return [
      {
        label: '유지 기반',
        skill: findSkillByNames(data, ['피어나는 생명']),
        note: '피어나는 생명은 탱커나 중심 대상에 남아 있어야 상록숲, 꽃피우기 이동, 후속 복구 판단이 안정됩니다.',
        segments: [[0, 96]],
      },
      {
        label: '위치 기반',
        skill: findSkillByNames(data, ['꽃피우기']),
        note: '레이드 지정 뭉침 위치나 쐐기 탱커 고정 위치에 깔려야 이후 광역 회복의 바닥이 생깁니다.',
        segments: [[2, 34], [42, 34], [78, 18]],
      },
      {
        label: '피해 전 예열',
        skill: findSkillByNames(data, ['회복']),
        note: '피해 10~12초 전부터 넓게 깔아 풍요 중첩과 재생 회수 기반을 만듭니다.',
        segments: [[8, 24], [48, 24], [78, 14]],
      },
      {
        label: '중심 연결',
        skill: findSkillByNames(data, ['신속한 치유']),
        note: '숲의 영혼, 대드루이드의 힘, 신록 주입, 숲 수호자 발동이 갈라지는 중심 버튼입니다.',
        segments: [[24, 8], [56, 8], [86, 8]],
      },
      {
        label: '광역 확장',
        skill: findSkillByNames(data, ['급속 성장']),
        note: '실제 광역 피해가 시작될 때 들어가야 숲 수호자 발동과 회복 네트워크가 같이 커집니다.',
        segments: [[28, 9], [60, 9], [90, 7]],
      },
      {
        label: '큰 회복 창',
        skill: findSkillByNames(data, ['평온']),
        note: '예열된 지속 치유가 깔린 뒤 배정 피해에 맞춰야 번성 효과로 시간을 벌 수 있습니다.',
        segments: [[36, 16], [82, 14]],
      },
      {
        label: '대체 큰 창',
        skill: findSkillByNames(data, ['영혼 소집']),
        note: '치유 목적이면 시전자 형태에서 실제 피해와 겹치게 쓰고, 숲의 수호자 분기에서는 발동 수를 같이 봅니다.',
        segments: [[34, 14], [76, 14]],
      },
      {
        label: '잔여 복구',
        skill: findSkillByNames(data, ['재생']),
        note: '풍요가 높을 때 남은 체력을 싸게 정리하는 출구입니다. 낮은 풍요 상태의 연속 시전은 마나 손실입니다.',
        segments: [[40, 10], [66, 10], [92, 6]],
      },
      {
        label: '단일 급사 대응',
        skill: findSkillByNames(data, ['무쇠껍질', '자연의 신속함']),
        note: '탱커나 위험 대상이 죽는 구간에는 광역 회복보다 외생기와 즉시 재생 판단이 먼저입니다.',
        segments: [[18, 8], [52, 8], [80, 8]],
      },
      {
        label: '쐐기 유틸',
        skill: findSkillByNames(data, ['자연의 치유력', '쇄도의 포효']),
        note: '해제와 이동 보조는 회복량으로 덮기 전에 피해 자체를 줄이는 버튼입니다.',
        segments: [[14, 6], [44, 6], [70, 6], [88, 6]],
      },
    ];
  }

  if (guide.id === 'warrior-protection') {
    return [
      {
        label: '중심 방어',
        skill: findSkillByNames(data, ['방패 올리기']),
        note: '전체 유지율보다 실제 탱킹 중 근접 피해와 막을 수 있는 기술을 맞는 순간에 켜져 있었는지를 봅니다.',
        segments: [[2, 18], [24, 18], [48, 18], [72, 18]],
      },
      {
        label: '분노 엔진',
        skill: findSkillByNames(data, ['방패 밀쳐내기']),
        note: '분노, 위협, 피해를 여는 첫 엔진입니다. 지연되면 고통 감내와 다음 방패 올리기 예산도 같이 늦어집니다.',
        segments: [[8, 7], [26, 7], [44, 7], [62, 7], [80, 7]],
      },
      {
        label: '광역 고정',
        skill: findSkillByNames(data, ['천둥벼락']),
        note: '분쇄 적용, 광역 위협, 산왕 우레 작렬 루프를 같이 엽니다.',
        segments: [[12, 8], [34, 8], [56, 8], [78, 8]],
      },
      {
        label: '흡수층',
        skill: findSkillByNames(data, ['고통 감내']),
        note: '방패 올리기 대체가 아니라 그 위에 얹는 흡수층입니다. 마법/지속 피해와 분노 과잉을 처리합니다.',
        segments: [[18, 10], [42, 10], [66, 10], [88, 8]],
      },
      {
        label: '마법 대응',
        skill: findSkillByNames(data, ['주문 반사']),
        note: '반사 가능한 주문이나 큰 마법 피해는 방패 올리기와 별도 줄로 예약합니다.',
        segments: [[22, 8], [58, 8], [86, 7]],
      },
      {
        label: '광역 소비',
        skill: findSkillByNames(data, ['복수']),
        note: '위협을 굳히는 광역 분노 소비입니다. 큰 물리 피해가 곧 오면 방패 올리기 분노를 먼저 남깁니다.',
        segments: [[28, 8], [52, 8], [84, 8]],
      },
      {
        label: '산왕 가속',
        skill: findSkillByNames(data, ['투신', '우레 작렬']),
        note: '투신과 우레 작렬은 공격 창이지만, 방패 올리기 기반이 무너지면 먼저 누를 이유가 줄어듭니다.',
        segments: [[30, 16], [76, 16]],
      },
      {
        label: '방패 창 정렬',
        skill: findSkillByNames(data, ['방패 돌격']),
        note: '방패 올리기와 방패 기술 피해 창을 함께 열어 공격과 방어 리듬을 재정렬합니다.',
        segments: [[36, 10], [68, 10]],
      },
      {
        label: '풀 제어',
        skill: findSkillByNames(data, ['훼방의 외침', '충격파', '폭풍망치']),
        note: '캐스터 풀에서는 광역 차단과 제어가 딜 버튼보다 먼저 계획표에 올라갈 수 있습니다.',
        segments: [[14, 7], [46, 7], [74, 7]],
      },
      {
        label: '큰 완화',
        skill: findSkillByNames(data, ['사기의 외침']),
        note: '탱 버스터나 대형 풀 전에 미리 깔아 들어오는 피해량을 낮춥니다.',
        segments: [[40, 12], [82, 12]],
      },
      {
        label: '비상 벽',
        skill: findSkillByNames(data, ['방패의 벽', '최후의 저항']),
        note: '방패 올리기와 고통 감내로 덮이지 않는 폭발 피해나 최위험 구간을 담당합니다.',
        segments: [[54, 14], [90, 9]],
      },
      {
        label: '파티 보호',
        skill: findSkillByNames(data, ['재집결의 함성']),
        note: '개인 방어와 분리해 파티/공대 전체 위험 구간에 배정합니다.',
        segments: [[60, 10]],
      },
    ];
  }

  if (guide.id === 'rogue-assassination') {
    return [
      {
        label: '출혈 기반',
        skill: findSkillByNames(data, ['목조르기', '파열']),
        note: '목조르기와 파열은 맹독 상처 기력 회수, 죽음표식 복제, 혈폭풍 광역 확장의 바닥입니다.',
        segments: [[2, 94]],
      },
      {
        label: '중심 소비',
        skill: findSkillByNames(data, ['독살']),
        note: '독 발동 확률, 왕의 파멸 성장, 운명의 손 결산을 여는 중심 마무리 일격입니다.',
        segments: [[10, 8], [26, 8], [42, 8], [58, 8], [74, 8], [90, 7]],
      },
      {
        label: '쿨기 표식',
        skill: findSkillByNames(data, ['죽음표식']),
        note: '곧 죽을 대상이 아니라 오래 살 우선 대상에 출혈과 치명독 기반을 묶어야 합니다.',
        segments: [[18, 12], [76, 12]],
      },
      {
        label: '독 성장',
        skill: findSkillByNames(data, ['왕의 파멸']),
        note: '왕의 파멸 중에는 독살 창과 독칼이 비지 않아야 14초 독 피해가 커집니다.',
        segments: [[22, 14], [80, 14]],
      },
      {
        label: '자연 보강',
        skill: findSkillByNames(data, ['독칼']),
        note: '5938 독칼 기준입니다. 이름이 비슷한 다른 독 칼과 섞이지 않게 아이콘과 툴팁을 같이 봅니다.',
        segments: [[28, 8], [84, 8]],
      },
      {
        label: '전이 피해',
        skill: findSkillByNames(data, ['부식성 분사']),
        note: '우선 대상 자연 피해가 주변으로 전이되는 창입니다. 대상 위치와 독살 창을 같이 봅니다.',
        segments: [[32, 10], [88, 8]],
      },
      {
        label: '광역 생성',
        skill: findSkillByNames(data, ['칼날 부채']),
        note: '2명 이상에서 연계 점수를 만드는 광역 생성기입니다. 출혈 복제 역할과 구분합니다.',
        segments: [[36, 7], [54, 7], [72, 7], [92, 6]],
      },
      {
        label: '출혈 복제',
        skill: findSkillByNames(data, ['혈폭풍']),
        note: '목조르기와 파열을 보조 대상에 확장하는 버튼입니다. 출혈 없는 혈폭풍은 가치가 크게 내려갑니다.',
        segments: [[44, 12], [82, 12]],
      },
      {
        label: '영웅 결산',
        skill: findSkillByNames(data, ['운명의 손', '죽음추적자의 징표']),
        note: '운명결속은 독살 결산, 죽음추적자는 표식 대상 관리가 핵심입니다.',
        segments: [[16, 10], [48, 10], [78, 10]],
      },
      {
        label: '은신 재강화',
        skill: findSkillByNames(data, ['소멸', '목조르기']),
        note: '소멸-목조르기 강화 구간은 단순 유지율보다 강화 출혈이 실제 우선 대상에 들어갔는지 봅니다.',
        segments: [[50, 10], [90, 8]],
      },
      {
        label: '생존 보존',
        skill: findSkillByNames(data, ['교란', '그림자 망토', '회피']),
        note: '근접 접촉 시간이 끊기면 독살과 왕의 파멸 창도 같이 무너집니다.',
        segments: [[24, 6], [62, 6], [86, 6]],
      },
    ];
  }

  if (guide.id === 'mage-fire') {
    return [
      {
        label: '중심 창',
        skill: findSkillByNames(data, ['발화']),
        note: '모든 치명타 보장과 몰아치는 열기! 루프가 이 창에 모입니다.',
        segments: [[16, 18], [72, 18]],
      },
      {
        label: '착탄 정렬',
        skill: findSkillByNames(data, ['유성']),
        note: '유성은 누른 순간보다 발화 안에 떨어졌는지를 봅니다.',
        segments: [[12, 10], [68, 10]],
      },
      {
        label: '전환 연료',
        skill: findSkillByNames(data, ['화염 작렬']),
        note: '열기를 몰아치는 열기!로 바꾸되 충전 과잉을 막습니다.',
        segments: [[8, 8], [22, 8], [36, 8], [64, 8], [78, 8], [90, 6]],
      },
      {
        label: '중간 발동',
        skill: findSkillByNames(data, ['열기']),
        note: '열기 상태는 소비가 아니라 화염 작렬로 승격해야 하는 신호입니다.',
        segments: [[6, 8], [30, 8], [58, 8], [86, 8]],
      },
      {
        label: '소비 상태',
        skill: findSkillByNames(data, ['몰아치는 열기!']),
        note: '방치하지 않고 불덩이 작렬 또는 불기둥으로 바로 소비합니다.',
        segments: [[20, 10], [34, 10], [76, 10], [88, 8]],
      },
      {
        label: '단일 소비',
        skill: findSkillByNames(data, ['불덩이 작렬']),
        note: '단일에서는 몰아치는 열기!를 불덩이 작렬로 소비하고 착탄을 조율합니다.',
        segments: [[24, 8], [38, 8], [80, 8]],
      },
      {
        label: '광역 소비',
        skill: findSkillByNames(data, ['불기둥', '특화: 작열']),
        note: '3타겟 이상에서는 불기둥과 특화: 작열 적중 수를 함께 봅니다.',
        segments: [[42, 12], [92, 6]],
      },
      {
        label: '보정/보존',
        skill: findSkillByNames(data, ['불태우기', '이글거리는 방벽']),
        note: '이동과 피해가 발화 창의 전환 루프를 끊지 않게 합니다.',
        segments: [[48, 10], [94, 5]],
      },
    ];
  }

  if (guide.id === 'mage-arcane') {
    return [
      {
        label: '중심 자원',
        skill: findSkillByNames(data, ['비전 연사']),
        note: '비전 탄막 소비 품질을 결정하므로 큰 창 전 예열과 창 안 소비를 같이 봅니다.',
        segments: [[4, 18], [26, 20], [52, 18], [78, 16]],
      },
      {
        label: '큰 창',
        skill: findSkillByNames(data, ['비전 쇄도']),
        note: '90초 기준 피해와 마나 회복을 동시에 여는 창입니다.',
        segments: [[18, 20], [76, 18]],
      },
      {
        label: '45초 창',
        skill: findSkillByNames(data, ['비전의 여파']),
        note: '비전 쇄도와 겹치는 큰 창, 그 사이 소형 창을 모두 확인합니다.',
        segments: [[22, 14], [54, 14], [84, 12]],
      },
      {
        label: '탄막 소비',
        skill: findSkillByNames(data, ['비전 탄막']),
        note: '고중첩 비전 연사 소비와 마나 리셋용 탄막을 구분합니다.',
        segments: [[30, 8], [58, 8], [88, 8]],
      },
      {
        label: '보주 재충전',
        skill: findSkillByNames(data, ['비전 보주']),
        note: '0~2충전에서 충전물과 주문술사 쇄편 루프를 복구합니다.',
        segments: [[10, 10], [40, 10], [70, 10]],
      },
      {
        label: '발동 처리',
        skill: findSkillByNames(data, ['신비한 화살', '번뜩임']),
        note: '번뜩임을 버리지 않되 비전 탄막과 큰 창을 밀지 않게 처리합니다.',
        segments: [[14, 9], [34, 9], [62, 9], [82, 9]],
      },
      {
        label: '광역 전환',
        skill: findSkillByNames(data, ['신비한 폭발', '비전 파동']),
        note: '3타겟 이상에서는 충전물 생성과 비전 파동 타이밍을 따로 봅니다.',
        segments: [[36, 12], [66, 12]],
      },
      {
        label: '복구/보존',
        skill: findSkillByNames(data, ['환기', '오색 방벽']),
        note: '환기는 다음 큰 창 마나를 복구하고, 오색 방벽은 창 안 시전을 보존합니다.',
        segments: [[44, 10], [90, 8]],
      },
    ];
  }

  if (guide.id === 'shaman-elemental') {
    return [
      {
        label: '중심 창',
        skill: findSkillByNames(data, ['폭풍수호자']),
        note: '강화 자연 주문, 폭풍, 승천, 소용돌이 소비를 묶는 정기 그래프의 중앙 노드입니다.',
        segments: [[4, 18], [50, 18], [84, 12]],
      },
      {
        label: '화염 기반',
        skill: findSkillByNames(data, ['화염 충격']),
        note: '용암 폭발과 화염 코어의 전제 조건입니다. 주요 대상 공백을 먼저 봅니다.',
        segments: [[2, 94]],
      },
      {
        label: '화염 반응',
        skill: findSkillByNames(data, ['용암 폭발']),
        note: '충전 낭비와 발동 방치를 막아야 폭풍수호자 전 자원 흐름이 안정됩니다.',
        segments: [[8, 7], [24, 7], [40, 7], [58, 7], [75, 7], [92, 5]],
      },
      {
        label: '폭풍인도자',
        skill: findSkillByNames(data, ['폭풍', '초자력 충전']),
        note: 'Archon 최근 표본의 기본 영웅 특성 축입니다. 폭풍 가능 상태를 방치하지 않습니다.',
        segments: [[16, 12], [46, 12], [76, 12]],
      },
      {
        label: '큰 창',
        skill: findSkillByNames(data, ['승천']),
        note: '폭풍수호자, 장신구, 피의 욕망/영웅심과 맞을 때 가장 큰 단일 창이 됩니다.',
        segments: [[22, 18], [72, 18]],
      },
      {
        label: '단일 생성',
        skill: findSkillByNames(data, ['번개 화살']),
        note: '기본 채우기 기술이면서 폭풍수호자 강화 단일 자연 주문입니다.',
        segments: [[11, 8], [31, 8], [53, 8], [81, 8]],
      },
      {
        label: '광역 생성',
        skill: findSkillByNames(data, ['연쇄 번개']),
        note: '대상 수가 올라가면 생성 흐름이 연쇄 번개로 전환됩니다.',
        segments: [[28, 9], [61, 9], [88, 8]],
      },
      {
        label: '단일 소비',
        skill: findSkillByNames(data, ['대지 충격', '정기 작렬']),
        note: '단일 소용돌이 소비입니다. 정기 작렬 빌드는 능력치 강화 유지까지 함께 봅니다.',
        segments: [[18, 8], [43, 8], [66, 8], [94, 5]],
      },
      {
        label: '광역 소비',
        skill: findSkillByNames(data, ['지진']),
        note: '대상 수와 위치가 맞을 때 쓰는 광역 소용돌이 출구입니다.',
        segments: [[35, 12], [68, 12], [90, 8]],
      },
      {
        label: '화염/자연 브리지',
        skill: findSkillByNames(data, ['전격의 불길', '정화의 불길']),
        note: '화염 코어와 자연 피해 창 사이의 발동/강화 연결점입니다.',
        segments: [[13, 12], [48, 12], [83, 10]],
      },
      {
        label: '선견자 보조',
        skill: findSkillByNames(data, ['선조의 신속함', '선조의 부름']),
        note: '기본값은 폭풍인도자지만 이동과 즉시시전 보정에서 별도 의미가 있습니다.',
        segments: [[26, 10], [56, 10], [86, 9]],
      },
      {
        label: '이동 보존',
        skill: findSkillByNames(data, ['영혼나그네의 은총', '자연의 신속함']),
        note: '폭풍수호자/승천 창을 이동 패턴과 충돌하지 않게 보존합니다.',
        segments: [[38, 12], [78, 12]],
      },
      {
        label: '쐐기 유틸',
        skill: findSkillByNames(data, ['날카로운 바람', '축전 토템', '진동의 토템']),
        note: '차단과 제어는 큰 피해 창보다 우선될 수 있는 실패 방지 행동입니다.',
        segments: [[20, 8], [52, 8], [74, 8]],
      },
      {
        label: '생존',
        skill: findSkillByNames(data, ['영혼 이동', '늑대 정령']),
        note: '큰 피해 패턴과 이동 복구를 분리해 배정합니다.',
        segments: [[44, 10], [82, 10]],
      },
    ];
  }

  if (guide.id === 'shaman-restoration') {
    return [
      {
        label: '중심 표식',
        skill: findSkillByNames(data, ['성난 해일']),
        note: '대상망, 굽이치는 물결, 선조 발동, 연쇄 치유 첫 대상을 묶는 중앙 노드입니다.',
        segments: [[4, 12], [22, 12], [40, 12], [58, 12], [76, 12]],
      },
      {
        label: '준비 버프',
        skill: findSkillByNames(data, ['물의 보호막', '대지의 보호막', '대지생명의 무기']),
        note: '전투 전 유지가 비면 이후 모든 회수 주문의 비용이 커집니다.',
        segments: [[0, 98]],
      },
      {
        label: '지역 기반',
        skill: findSkillByNames(data, ['치유의 비', '쇄도하는 토템']),
        note: '파티가 머무는 위치에 맞아야 토템술사 가치가 살아납니다.',
        segments: [[8, 26], [42, 26], [72, 22]],
      },
      {
        label: '토템 회복',
        skill: findSkillByNames(data, ['치유의 토템', '폭풍의 흐름 토템']),
        note: '충전 낭비와 폭풍의 흐름 토템 가능 상태를 함께 봅니다.',
        segments: [[12, 9], [30, 9], [50, 9], [70, 9], [90, 7]],
      },
      {
        label: '예고 광역',
        skill: findSkillByNames(data, ['폭우']),
        note: '저장 게이지가 아니라 예고 피해를 낮은 비용으로 회수하는 짧은 광역 창입니다.',
        segments: [[20, 10], [54, 10], [84, 9]],
      },
      {
        label: '광역 회수',
        skill: findSkillByNames(data, ['연쇄 치유']),
        note: '성난 해일 대상망과 거리 조건이 맞을 때 가장 먼저 가치가 올라갑니다.',
        segments: [[25, 8], [46, 8], [66, 8], [88, 8]],
      },
      {
        label: '단일 효율',
        skill: findSkillByNames(data, ['치유의 물결']),
        note: '한두 명만 위험할 때 쓰는 효율 직접 치유입니다.',
        segments: [[15, 7], [36, 7], [61, 7], [80, 7]],
      },
      {
        label: '큰 회수',
        skill: findSkillByNames(data, ['치유의 해일 토템']),
        note: '긴 광역 피해 또는 피해 직후 안정화에 배정합니다.',
        segments: [[34, 18], [78, 18]],
      },
      {
        label: '체력 평준화',
        skill: findSkillByNames(data, ['정신의 고리 토템']),
        note: '사후 힐이 아니라 큰 피해 직전 피해 감소와 체력 재분배를 노립니다.',
        segments: [[48, 12], [86, 10]],
      },
      {
        label: '증폭 창',
        skill: findSkillByNames(data, ['승천']),
        note: '연쇄 치유와 치유의 물결을 실제로 많이 넣을 수 있는 피해 창에 맞춥니다.',
        segments: [[56, 18]],
      },
      {
        label: '선견자 창',
        skill: findSkillByNames(data, ['생명 폭발', '선조의 신속함', '선조의 부름']),
        note: '대상 선택형 회복을 강화하고 선조 주문을 실제 피해 구간에 맞춥니다.',
        segments: [[18, 10], [44, 10], [74, 10]],
      },
      {
        label: '쐐기 유틸',
        skill: findSkillByNames(data, ['날카로운 바람', '정화', '영혼 정화']),
        note: '피해를 회복하기 전에 위험 주문과 디버프를 제거합니다.',
        segments: [[14, 7], [38, 7], [62, 7], [82, 7]],
      },
      {
        label: '이동 보존',
        skill: findSkillByNames(data, ['영혼나그네의 은총', '돌풍', '바람 질주 토템']),
        note: '위치 기반 힐과 긴 시전을 이동 패턴과 충돌하지 않게 보존합니다.',
        segments: [[28, 10], [68, 10]],
      },
    ];
  }

  if (guide.id === 'shaman-enhancement') {
    return [
      {
        label: '중심 자원',
        skill: findSkillByNames(data, ['소용돌이치는 무기']),
        note: '9~10중첩 낭비와 소비 간격을 가장 먼저 봅니다.',
        segments: [[5, 9], [20, 8], [36, 9], [52, 8], [68, 9], [84, 8]],
      },
      {
        label: '단일 소비',
        skill: findSkillByNames(data, ['번개 화살']),
        note: '단일 대상 소용돌이 소비와 정기의 속도 환급 출구입니다.',
        segments: [[12, 8], [42, 8], [72, 8], [92, 6]],
      },
      {
        label: '광역 소비',
        skill: findSkillByNames(data, ['연쇄 번개']),
        note: '낙뢰 이후 광역 상황에서 소용돌이치는 무기를 비우는 주문입니다.',
        segments: [[29, 9], [59, 9], [86, 8]],
      },
      {
        label: '광역 관문',
        skill: findSkillByNames(data, ['낙뢰']),
        note: '폭풍의 일격과 용암 채찍의 cleave, 폭풍 해방, 광역 전환을 여는 상태입니다.',
        segments: [[24, 16], [54, 16], [80, 16]],
      },
      {
        label: '폭풍 타격',
        skill: findSkillByNames(data, ['폭풍의 일격']),
        note: '폭풍인도자와 승천 창에서 밀리면 전체 소용돌이 순환이 느려집니다.',
        segments: [[7, 7], [22, 7], [38, 7], [54, 7], [70, 7], [88, 7]],
      },
      {
        label: '화염 타격',
        skill: findSkillByNames(data, ['용암 채찍']),
        note: '토템술사와 뜨거운 손 중에는 일반 채우기 기술보다 높은 가치가 됩니다.',
        segments: [[10, 7], [26, 7], [44, 7], [62, 7], [78, 7], [94, 5]],
      },
      {
        label: '토템술사 창',
        skill: findSkillByNames(data, ['쇄도하는 토템']),
        note: '1분 피해 창의 기준점입니다. 토템 위치와 대상 생존 시간을 같이 봅니다.',
        segments: [[4, 22], [56, 22]],
      },
      {
        label: '화염 발동',
        skill: findSkillByNames(data, ['뜨거운 손']),
        note: '용암 채찍 재사용 대기시간과 피해를 바꾸므로 토템술사에서 별도 추적합니다.',
        segments: [[14, 12], [58, 12], [82, 10]],
      },
      {
        label: '폭풍인도자',
        skill: findSkillByNames(data, ['폭풍', '초자력 충전']),
        note: '폭풍과 초자력 충전은 소용돌이 소비 빈도와 큰 풀 타이머를 함께 봅니다.',
        segments: [[18, 12], [48, 12], [78, 12]],
      },
      {
        label: '근접 쿨기',
        skill: findSkillByNames(data, ['파멸의 바람']),
        note: '질풍의 무기와 근접 타격 밀도가 중요한 1분 창입니다.',
        segments: [[6, 14], [57, 14]],
      },
      {
        label: '승천 창',
        skill: findSkillByNames(data, ['승천', '바람의 일격']),
        note: '바람의 일격 공백과 폭풍/낙뢰 정렬을 확인하는 큰 창입니다.',
        segments: [[32, 18], [82, 16]],
      },
      {
        label: '전방 트리거',
        skill: findSkillByNames(data, ['세계의 분리', '태고의 폭풍']),
        note: '토템술사 대지 보상과 실제 대상 적중 시간을 함께 확인합니다.',
        segments: [[34, 12], [64, 12], [90, 8]],
      },
      {
        label: '쐐기 유틸',
        skill: findSkillByNames(data, ['날카로운 바람', '축전 토템', '진동의 토템']),
        note: '차단과 제어는 딜 우선순위보다 실패 비용이 큰 순간이 있습니다.',
        segments: [[16, 8], [46, 8], [74, 8]],
      },
      {
        label: '생존',
        skill: findSkillByNames(data, ['영혼 이동', '늑대 정령']),
        note: '근접 이탈과 큰 피해 패턴을 파멸의 바람/승천 창과 충돌하지 않게 배치합니다.',
        segments: [[40, 10], [76, 10]],
      },
    ];
  }

  if (guide.id === 'rogue-subtlety') {
    return [
      {
        label: '중앙 마무리',
        skill: findSkillByNames(data, ['은밀한 기술']),
        note: '잠행 쿨기 정렬의 기준점입니다. 춤 안에 들어갔는지를 가장 먼저 확인합니다.',
        segments: [[9, 8], [48, 8], [88, 8]],
      },
      {
        label: '90초 큰 창',
        skill: findSkillByNames(data, ['어둠의 칼날']),
        note: '어둠의 칼날 안에 두 번의 어둠의 춤과 첫 은밀한 기술을 압축합니다.',
        segments: [[3, 18], [72, 18]],
      },
      {
        label: '춤 창',
        skill: findSkillByNames(data, ['어둠의 춤']),
        note: '은밀한 기술 준비 또는 어둠의 칼날 중일 때 열어야 가치가 큽니다.',
        segments: [[5, 7], [17, 7], [44, 7], [76, 7], [88, 7]],
      },
      {
        label: '춤 생성',
        skill: findSkillByNames(data, ['그림자 일격']),
        note: '춤 안 핵심 생성기입니다. 어둠의 칼날 중에는 연계 점수 과충전을 조심합니다.',
        segments: [[6, 6], [18, 6], [45, 6], [77, 6], [89, 6]],
      },
      {
        label: '후속 소비',
        skill: findSkillByNames(data, ['절개']),
        note: '은밀한 기술 이후의 단일 소비이며, 기만자와 죽음추적자 보상의 출구입니다.',
        segments: [[13, 7], [24, 7], [52, 7], [84, 7], [94, 5]],
      },
      {
        label: '중첩 엔진',
        skill: findSkillByNames(data, ['고대의 기술', '그림자 기술']),
        note: '그림자 기술 중첩을 복제된 그림자와 다음 마무리 일격으로 연결합니다.',
        segments: [[10, 12], [46, 12], [86, 10]],
      },
      {
        label: '광역 생성',
        skill: findSkillByNames(data, ['표창 폭풍']),
        note: '2대상 이상에서 광역 연계 점수 생성 흐름으로 전환합니다.',
        segments: [[30, 7], [60, 7], [82, 7]],
      },
      {
        label: '광역 소비',
        skill: findSkillByNames(data, ['검은 화약']),
        note: '다중 대상 기본 마무리 일격이지만, 최후의 일격/어둡고 어두운 밤 절개 예외를 같이 봅니다.',
        segments: [[36, 8], [66, 8], [90, 7]],
      },
      {
        label: '기만자',
        skill: findSkillByNames(data, ['무형검', '최후의 일격']),
        note: '현재 로그 주류입니다. 최후의 일격 절개와 구름 덮개 창을 별도로 추적합니다.',
        segments: [[8, 20], [42, 20], [74, 20]],
      },
      {
        label: '죽음추적자',
        skill: findSkillByNames(data, ['죽음추적자의 징표', '어둡고 어두운 밤']),
        note: '순수 단일 보조 분기입니다. 징표 적용, 중첩 소비, 대상 이동을 확인합니다.',
        segments: [[11, 16], [50, 16], [86, 12]],
      },
      {
        label: '생존/차단',
        skill: findSkillByNames(data, ['교란', '그림자 망토', '발차기']),
        note: '쐐기에서는 은밀한 기술 창보다 먼저 생존과 차단이 필요한 순간이 있습니다.',
        segments: [[22, 10], [55, 10], [80, 10]],
      },
    ];
  }

  if (guide.id === 'rogue-outlaw') {
    return [
      {
        label: '중심 환급',
        skill: findSkillByNames(data, ['잠들지 않는 칼날']),
        note: '5~6점 마무리 일격이 다음 쿨기 창을 앞당기는 무법의 중심 피드백입니다.',
        segments: [[7, 8], [22, 8], [38, 8], [54, 8], [70, 8], [86, 8]],
      },
      {
        label: '속도 창',
        skill: findSkillByNames(data, ['아드레날린 촉진']),
        note: '기력 회복과 공격 속도를 올려 더 많은 생성기와 마무리 일격을 가능하게 합니다.',
        segments: [[0, 18], [46, 18], [84, 14]],
      },
      {
        label: '상태 판정',
        skill: findSkillByNames(data, ['뼈주사위']),
        note: '1/2/3단계에 따라 생성, 피해, 잠들지 않는 칼날 회복 속도 가치가 달라집니다.',
        segments: [[2, 30], [36, 30], [70, 26]],
      },
      {
        label: '상태 보존',
        skill: findSkillByNames(data, ['도박의 연속']),
        note: '좋은 뼈주사위 단계가 있을 때 유지 시간을 늘려 엔진을 안정화합니다.',
        segments: [[18, 10], [58, 10]],
      },
      {
        label: '기본 생성',
        skill: findSkillByNames(data, ['사악한 일격']),
        note: '기회 발동과 연계 점수 생성을 여는 기본 생성기입니다.',
        segments: [[5, 6], [16, 6], [28, 6], [40, 6], [52, 6], [64, 6], [76, 6], [88, 6]],
      },
      {
        label: '발동 처리',
        skill: findSkillByNames(data, ['권총 사격']),
        note: '기회 6중첩 또는 낮은 연계 점수의 3중첩 상황에서 우선 처리합니다.',
        segments: [[12, 7], [34, 7], [57, 7], [80, 7]],
      },
      {
        label: '은신 생성',
        skill: findSkillByNames(data, ['매복', '숨겨진 기회']),
        note: '숨겨진 기회와 배포가 있을 때 사악한 일격보다 강한 생성 축으로 들어옵니다.',
        segments: [[24, 8], [61, 8]],
      },
      {
        label: '큰 마무리',
        skill: findSkillByNames(data, ['미간 적중']),
        note: '재사용 대기시간 손실을 막아야 하는 고가치 마무리 일격입니다.',
        segments: [[20, 9], [51, 9], [82, 9]],
      },
      {
        label: '주 소비기',
        skill: findSkillByNames(data, ['속결']),
        note: '잠들지 않는 칼날 환급을 꾸준히 돌리는 가장 반복적인 소비 출구입니다.',
        segments: [[29, 7], [43, 7], [66, 7], [91, 7]],
      },
      {
        label: '되감기',
        skill: findSkillByNames(data, ['준비']),
        note: '아드레날린 촉진, 미간 적중, 폭풍의 칼날, 질풍 칼날, 광기의 학살자를 실제로 되감습니다.',
        segments: [[42, 10], [78, 10]],
      },
      {
        label: '광역 게이트',
        skill: findSkillByNames(data, ['폭풍의 칼날']),
        note: '단일 우선순위를 다중 대상에 확산하는 전환 상태입니다.',
        segments: [[9, 15], [37, 15], [67, 15]],
      },
      {
        label: '돌진 쿨기',
        skill: findSkillByNames(data, ['질풍 칼날']),
        note: '재사용 대기시간 지연 없이 써야 하는 피해/이동 보강 쿨기입니다.',
        segments: [[14, 8], [48, 8], [84, 8]],
      },
      {
        label: '처형 쿨기',
        skill: findSkillByNames(data, ['광기의 학살자']),
        note: '기만자 분기에서 고연계 점수 소비와 기력 과충전을 함께 보는 창입니다.',
        segments: [[31, 12], [73, 12]],
      },
      {
        label: '기만자',
        skill: findSkillByNames(data, ['무형검', '최후의 일격']),
        note: '무형검 4회 이후 최후의 일격 속결을 별도 가치로 추적합니다.',
        segments: [[11, 20], [45, 20], [79, 18]],
      },
      {
        label: '운명결속',
        skill: findSkillByNames(data, ['운명의 손', '행운 주화']),
        note: '5점 이상 마무리 일격이 동전 횟수와 행운 주화 기대값을 만듭니다.',
        segments: [[18, 18], [52, 18], [86, 12]],
      },
    ];
  }

  if (guide.id === 'warlock-destruction') {
    return [
      {
        label: '유지 기반',
        skill: findSkillByNames(data, ['쇠퇴', '제물']),
        note: '지옥소환사는 쇠퇴, 비-지옥소환사는 제물을 유지해 조각 경제를 시작합니다.',
        segments: [[3, 92]],
      },
      {
        label: '생성 충전',
        skill: findSkillByNames(data, ['점화']),
        note: '조각과 역류 흐름을 열며 2충전 방치를 막습니다.',
        segments: [[9, 8], [28, 8], [48, 8], [70, 8], [88, 8]],
      },
      {
        label: '역류 보정',
        skill: findSkillByNames(data, ['역류']),
        note: '혼돈의 화살과 소각의 긴 시전을 보정하는 상태입니다.',
        segments: [[13, 12], [32, 12], [54, 12], [74, 12]],
      },
      {
        label: '기본 생성',
        skill: findSkillByNames(data, ['소각']),
        note: '다른 우선순위가 비었을 때 조각을 만드는 생성기입니다.',
        segments: [[18, 10], [38, 10], [62, 10], [82, 8]],
      },
      {
        label: '단일 소비',
        skill: findSkillByNames(data, ['혼돈의 화살']),
        note: '조각 과충전 전에 넣는 단일 대상 결산 주문입니다.',
        segments: [[24, 10], [44, 10], [66, 10], [90, 7]],
      },
      {
        label: '2타깃 복제',
        skill: findSkillByNames(data, ['대혼란']),
        note: '두 번째 대상이 의미 있을 때 혼돈의 화살 가치를 올립니다.',
        segments: [[22, 16], [64, 16]],
      },
      {
        label: '광역 소비',
        skill: findSkillByNames(data, ['불의 비']),
        note: '3타깃 이상과 대상 생존 시간을 확인한 뒤 전환합니다.',
        segments: [[35, 13], [76, 13]],
      },
      {
        label: '큰 창',
        skill: findSkillByNames(data, ['지옥불정령 소환']),
        note: '조각 생성과 소모 밀도를 동시에 여는 창입니다.',
        segments: [[20, 24], [72, 22]],
      },
      {
        label: '보조 쿨기',
        skill: findSkillByNames(data, ['대재앙', '악마불 집중']),
        note: '유지 주문 확산 또는 창 사이 피해 보강으로 씁니다.',
        segments: [[12, 12], [52, 12], [84, 10]],
      },
    ];
  }

  if (guide.id === 'warlock-demonology') {
    return [
      {
        label: '조각 준비',
        skill: findSkillByNames(data, ['악마 화살', '어둠의 화살']),
        note: '폭군 전후 굴단의 손을 이어가기 위한 조각 생성 흐름입니다.',
        segments: [[4, 12], [33, 12], [62, 12], [86, 10]],
      },
      {
        label: '핵 발동',
        skill: findSkillByNames(data, ['악마의 핵']),
        note: '악마 화살을 빠르게 시전해 폭군 창의 조각 복구를 돕습니다.',
        segments: [[11, 10], [39, 10], [68, 10]],
      },
      {
        label: '주 소환수',
        skill: findSkillByNames(data, ['공포사냥개 부르기']),
        note: '악마 폭군 소환이 받을 핵심 소환수 재료입니다.',
        segments: [[8, 15], [42, 15], [76, 15]],
      },
      {
        label: '임프 생성',
        skill: findSkillByNames(data, ['굴단의 손']),
        note: '4~5조각을 야생 임프로 바꿔 폭군과 파열의 재료를 만듭니다.',
        segments: [[18, 12], [31, 10], [55, 12], [70, 10]],
      },
      {
        label: '큰 악마',
        skill: findSkillByNames(data, ['흑마법서: 임프 군주', '흑마법서: 지옥 유린자']),
        note: '악마학자 창에서 폭군 주변에 배치할 선택 쿨다운입니다.',
        segments: [[22, 16], [72, 16]],
      },
      {
        label: '폭군 창',
        skill: findSkillByNames(data, ['악마 폭군 소환']),
        note: '소환수 수명과 조각 준비가 완성된 뒤 들어가는 중심 창입니다.',
        segments: [[28, 20], [78, 18]],
      },
      {
        label: '파멸 축',
        skill: findSkillByNames(data, ['파멸수호병 소환', '아르거스의 지배자']),
        note: '다중 대상 또는 큰 창에서 별도 피해 축으로 검수합니다.',
        segments: [[30, 15], [80, 15]],
      },
      {
        label: '광역 소비',
        skill: findSkillByNames(data, ['파열']),
        note: '가능하면 6마리 야생 임프와 실제 대상 수를 확인한 뒤 소비합니다.',
        segments: [[36, 10], [59, 10], [91, 7]],
      },
    ];
  }

  if (guide.id === 'warlock-affliction') {
    return [
      {
        label: '유지 바닥',
        skill: findSkillByNames(data, ['고통']),
        note: '오래 살아남는 대상과 우선 대상에 먼저 유지하는 조각 흐름의 시작점입니다.',
        segments: [[3, 92]],
      },
      {
        label: '보조 유지',
        skill: findSkillByNames(data, ['부패', '쇠퇴']),
        note: '영혼 수확자는 부패, 지옥소환사는 쇠퇴 가지로 같은 유지 칸에서 읽습니다.',
        segments: [[5, 88]],
      },
      {
        label: '중심 소비',
        skill: findSkillByNames(data, ['불안정한 고통']),
        note: '영혼의 조각을 피해와 암흑의 수확 주기로 전환하는 중심 소비기입니다.',
        segments: [[14, 16], [43, 18], [75, 18]],
      },
      {
        label: '우선 대상',
        skill: findSkillByNames(data, ['유령 출몰']),
        note: '주 대상 피해 창을 여는 증폭 기준선입니다.',
        segments: [[7, 12], [40, 12], [70, 12]],
      },
      {
        label: '수확 창',
        skill: findSkillByNames(data, ['암흑의 수확']),
        note: '영혼 수확자 기준 조각 회복과 짧은 피해 창을 함께 만듭니다.',
        segments: [[23, 9], [57, 9], [86, 9]],
      },
      {
        label: '소환 창',
        skill: findSkillByNames(data, ['암흑시선 소환']),
        note: '고통, 부패, 불안정한 고통이 준비된 뒤 사용해야 가치가 올라갑니다.',
        segments: [[29, 18], [78, 18]],
      },
      {
        label: '광역 소비',
        skill: findSkillByNames(data, ['부패의 씨앗']),
        note: '밀집 대상에서는 조각 소비와 광역 전염을 담당합니다.',
        segments: [[27, 12], [50, 12], [82, 12]],
      },
      {
        label: '필러/발동',
        skill: findSkillByNames(data, ['영혼 흡수', '일몰']),
        note: '우선순위가 비거나 일몰이 뜰 때 다음 소비 창을 준비합니다.',
        segments: [[12, 8], [37, 8], [65, 8], [94, 5]],
      },
    ];
  }

  if (guide.id === 'monk-brewmaster') {
    return [
      {
        label: '피해 유입',
        skill: findSkillByNames(data, ['시간차']),
        note: '체력바보다 먼저 봐야 하는 미래 피해 상태입니다.',
        segments: [[4, 90]],
      },
      {
        label: '정화 판단',
        skill: findSkillByNames(data, ['정화주']),
        note: '노랑/빨강 시간차나 큰 연속 피해 뒤에 미래 피해를 줄입니다.',
        segments: [[18, 10], [44, 10], [72, 10]],
      },
      {
        label: '흡수 예약',
        skill: findSkillByNames(data, ['천신주']),
        note: '다음 큰 물리 피해나 연속 타격 전에 보호막 창을 예약합니다.',
        segments: [[26, 14], [66, 14]],
      },
      {
        label: '회전 엔진',
        skill: findSkillByNames(data, ['맥주통 휘두르기']),
        note: '피해 기술이면서 맥주 회전과 방어 템포를 여는 핵심 버튼입니다.',
        segments: [[8, 8], [24, 8], [40, 8], [56, 8], [72, 8], [88, 8]],
      },
      {
        label: '기준 GCD',
        skill: findSkillByNames(data, ['후려차기']),
        note: '후려차기 사이 행동을 계획하는 우선순위 기준점입니다.',
        segments: [[12, 7], [31, 7], [50, 7], [69, 7], [88, 7]],
      },
      {
        label: '화염 유지',
        skill: findSkillByNames(data, ['불의 숨결']),
        note: '맥주통 휘두르기 이후 화염 유지와 피해 감소/위협 흐름을 보강합니다.',
        segments: [[16, 13], [48, 13], [80, 13]],
      },
      {
        label: '장기 압박',
        skill: findSkillByNames(data, ['흑우 니우짜오의 원령']),
        note: '긴 피해 구간이나 힐러 압박 구간에 맞추는 큰 쿨다운입니다.',
        segments: [[30, 22], [76, 18]],
      },
      {
        label: '광역 제어',
        skill: findSkillByNames(data, ['폭발하는 맥주통']),
        note: '광역 피해와 순간 위협, 위험 풀 제어를 함께 보는 창입니다.',
        segments: [[22, 10], [62, 10]],
      },
      {
        label: '조화 저장',
        skill: findSkillByNames(data, ['조화의 형', '조화의 쇄도']),
        note: '저장한 피해/치유량을 정화주와 천신주 판단에 맞춰 방출합니다.',
        segments: [[34, 12], [74, 12]],
      },
      {
        label: '음영파 압박',
        skill: findSkillByNames(data, ['질풍격', '예측 훈련']),
        note: '자동 공격과 정점 창이 실제 대상 수와 겹쳤는지 봅니다.',
        segments: [[28, 14], [58, 14], [86, 10]],
      },
    ];
  }

  if (guide.id === 'monk-windwalker') {
    return [
      {
        label: '기 생성',
        skill: findSkillByNames(data, ['범의 장풍']),
        note: '기력이 넘치기 전에 기로 바꾸되 핵심 쿨기 직전에는 과소비하지 않습니다.',
        segments: [[4, 8], [22, 8], [41, 8], [60, 8], [80, 8]],
      },
      {
        label: '기 정리',
        skill: findSkillByNames(data, ['후려차기']),
        note: '기 과충전과 같은 기술 반복을 막는 기본 소모기입니다.',
        segments: [[10, 8], [30, 8], [49, 8], [68, 8], [88, 8]],
      },
      {
        label: '중심 채널',
        skill: findSkillByNames(data, ['분노의 주먹']),
        note: '채널이 끊기면 단일과 광역 모두 큰 손실이 나는 중심 기술입니다.',
        segments: [[18, 16], [56, 16]],
      },
      {
        label: '짧은 쿨기',
        skill: findSkillByNames(data, ['해오름차기']),
        note: '쿨마다 가까이 쓰되 자원 잠금 때문에 밀리지 않게 봅니다.',
        segments: [[14, 8], [34, 8], [54, 8], [74, 8], [92, 6]],
      },
      {
        label: '정점 창',
        skill: findSkillByNames(data, ['호안주', '등선']),
        note: '호안주/등선 창은 큰 기술을 모으지만 과도한 대기는 손실입니다.',
        segments: [[24, 14], [64, 14]],
      },
      {
        label: '큰 타격',
        skill: findSkillByNames(data, ['바람의 군주의 일격']),
        note: '창 안에 넣되 분노의 주먹과 해오름차기를 지나치게 밀지 않습니다.',
        segments: [[28, 10], [72, 10]],
      },
      {
        label: '쿨기 분신',
        skill: findSkillByNames(data, ['폭풍과 대지와 불']),
        note: '고피해 기술이 이어지는 구간에 배치하는 큰 창입니다.',
        segments: [[16, 22], [62, 22]],
      },
      {
        label: '소환 창',
        skill: findSkillByNames(data, ['백호 쉬엔의 원령']),
        note: '전투 길이와 큰 창에 맞춰 전투 내 사용 횟수를 잃지 않습니다.',
        segments: [[20, 20], [76, 18]],
      },
      {
        label: '광역 전환',
        skill: findSkillByNames(data, ['회전 학다리차기']),
        note: '대상 수와 츠지의 춤 발동이 맞을 때만 우선순위가 올라옵니다.',
        segments: [[38, 12], [82, 12]],
      },
      {
        label: '영웅 특성',
        skill: findSkillByNames(data, ['질풍격', '옥룡의 마음']),
        note: '음영파는 질풍격 누적, 천신합일은 옥룡의 마음 쿨다운 압축을 봅니다.',
        segments: [[26, 12], [66, 12]],
      },
    ];
  }

  if (guide.id === 'monk-mistweaver') {
    return [
      {
        label: '안개 커버리지',
        skill: findSkillByNames(data, ['소생의 안개']),
        note: '생기 충전 확산의 대상망입니다. 충전이 넘치기 전에 피해 전 대상 수를 확보합니다.',
        segments: [[3, 28], [35, 28], [68, 26]],
      },
      {
        label: '피해 회수',
        skill: findSkillByNames(data, ['생기 충전']),
        note: '피해 직후 소생의 안개 대상망을 통해 광역 회복을 회수합니다.',
        segments: [[18, 10], [43, 10], [74, 10], [90, 7]],
      },
      {
        label: '근접 치유',
        skill: findSkillByNames(data, ['질풍차기', '해오름차기']),
        note: '안전한 근접 구간에서는 공격 행동이 지속 치유 엔진을 유지합니다.',
        segments: [[10, 16], [38, 16], [66, 16]],
      },
      {
        label: '마나 창',
        skill: findSkillByNames(data, ['마나 차', '평안의 차']),
        note: '마나가 바닥난 뒤가 아니라 비싼 치유 창 전에 비용을 낮춥니다.',
        segments: [[14, 12], [58, 12]],
      },
      {
        label: '강화 차',
        skill: findSkillByNames(data, ['집중의 천둥 차']),
        note: '소생의 안개 확산 또는 주요 회복 주문 강화 타이밍을 고릅니다.',
        segments: [[8, 8], [48, 8], [82, 8]],
      },
      {
        label: '단일 복구',
        skill: findSkillByNames(data, ['포용의 안개']),
        note: '탱커나 위험 대상에게 지속 복구 창을 만듭니다.',
        segments: [[24, 12], [62, 12], [86, 10]],
      },
      {
        label: '외부 생존기',
        skill: findSkillByNames(data, ['기의 고치']),
        note: '죽기 직전이 아니라 예고된 대상 피해 전에 예약합니다.',
        segments: [[28, 14], [76, 14]],
      },
      {
        label: '공대 복구',
        skill: findSkillByNames(data, ['재활']),
        note: '큰 광역 피해 뒤 즉시 회수하는 대형 쿨기입니다.',
        segments: [[46, 16], [90, 8]],
      },
      {
        label: '천신 창',
        skill: findSkillByNames(data, ['천신합일', '옥룡의 마음']),
        note: '소생의 안개와 생기 충전 준비가 있을 때 큰 피해 파동에 맞춥니다.',
        segments: [[20, 20], [70, 18]],
      },
      {
        label: '저장 치유',
        skill: findSkillByNames(data, ['조화의 형', '셰이룬의 선물', '영혼의 샘']),
        note: '조화의 형/셰이룬 계열은 저장한 회복량을 어느 피해 파동에 풀지 봅니다.',
        segments: [[32, 14], [78, 14]],
      },
    ];
  }

  if (guide.id === 'warrior-arms') {
    return [
      {
        label: '중심 타격',
        skill: findSkillByNames(data, ['필사의 일격']),
        note: '무기 전사의 중심 결산 타격입니다. 지연과 분노 고갈을 가장 먼저 봅니다.',
        segments: [[8, 7], [24, 7], [40, 7], [56, 7], [73, 7], [90, 6]],
      },
      {
        label: '피해 창',
        skill: findSkillByNames(data, ['거인의 강타', '전쟁파괴자']),
        note: '필사의 일격, 칼날폭풍, 쇄파, 마무리 일격을 높은 값으로 묶는 시간표입니다.',
        segments: [[14, 18], [58, 18]],
      },
      {
        label: '제압 충전',
        skill: findSkillByNames(data, ['제압']),
        note: '2충전 방치를 막되 필사의 일격을 밀지 않도록 창 안팎을 조절합니다.',
        segments: [[4, 6], [20, 6], [34, 6], [50, 6], [66, 6], [83, 6]],
      },
      {
        label: '분쇄 기준',
        skill: findSkillByNames(data, ['분쇄']),
        note: '분쇄는 오래 사는 대상에 먼저 깔아 두는 출혈 기준선입니다. 치명상은 이 행의 결과로 로그에서 따로 검수합니다.',
        segments: [[2, 94]],
      },
      {
        label: '처형 전환',
        skill: findSkillByNames(data, ['마무리 일격', '급살']),
        note: '급살 발동과 35% 이하 처형 구간을 분리해서 분노 고갈을 확인합니다.',
        segments: [[29, 8], [46, 8], [78, 18]],
      },
      {
        label: '학살자 압축',
        skill: findSkillByNames(data, ['칼날폭풍', '학살자의 지배']),
        note: '거인의 강타 초반에 칼날폭풍을 겹치고, 다중 대상에서는 제압 우선순위 상승을 봅니다.',
        segments: [[18, 14], [63, 14]],
      },
      {
        label: '거신 결산',
        skill: findSkillByNames(data, ['쇄파', '거신의 지배']),
        note: '쇄파는 창 안에서 방향과 적 밀집 상태를 맞춰 채널해야 합니다.',
        segments: [[22, 12], [68, 12]],
      },
      {
        label: '광역 소비',
        skill: findSkillByNames(data, ['회전베기']),
        note: '3타깃 이상에서 단일 우선순위를 광역 창으로 확장하는 중심 소비기입니다.',
        segments: [[36, 10], [52, 10], [82, 10]],
      },
      {
        label: '2타깃 복제',
        skill: findSkillByNames(data, ['휩쓸기 일격']),
        note: '두 대상이 의미 있게 살아 있을 때 단일 우선순위를 복제하는 분기입니다.',
        segments: [[12, 12], [54, 12]],
      },
    ];
  }

  if (guide.id === 'warrior-fury') {
    return [
      {
        label: '중심 소비',
        skill: findSkillByNames(data, ['광란']),
        note: '분노 과충전과 격노 만료를 동시에 막는 중심 노드입니다.',
        segments: [[7, 7], [22, 7], [38, 7], [54, 7], [70, 7], [88, 7]],
      },
      {
        label: '격노 상태',
        skill: findSkillByNames(data, ['격노']),
        note: '평균 유지율보다 무모한 희생/투신 창 안에서 비는 시간을 먼저 봅니다.',
        segments: [[5, 27], [35, 27], [66, 27]],
      },
      {
        label: '분노 생성',
        skill: findSkillByNames(data, ['피의 갈증']),
        note: '분노 생성, 격노 보험, 회복을 동시에 맡는 안정 축입니다.',
        segments: [[12, 6], [28, 6], [44, 6], [60, 6], [78, 6], [94, 5]],
      },
      {
        label: '강타 충전',
        skill: findSkillByNames(data, ['분노의 강타']),
        note: '광란 이후 충전 환급과 초기화가 다음 광란 속도를 바꿉니다.',
        segments: [[15, 6], [30, 6], [47, 6], [63, 6], [80, 6]],
      },
      {
        label: '보강 생성',
        skill: findSkillByNames(data, ['맹공']),
        note: '강한 생성기지만 광란과 격노 갱신을 밀지 않는 선에서 사용합니다.',
        segments: [[18, 8], [50, 8], [84, 8]],
      },
      {
        label: '분노 창',
        skill: findSkillByNames(data, ['무모한 희생']),
        note: '광란 반복을 가장 많이 압축해야 하는 분노/치명타 창입니다.',
        segments: [[10, 18], [58, 18]],
      },
      {
        label: '투신 창',
        skill: findSkillByNames(data, ['투신']),
        note: '기본은 공격력 창이며, 산왕 선택 시 우레 작렬 2중첩과 천둥벼락 초기화를 함께 봅니다.',
        segments: [[11, 20], [60, 20]],
      },
      {
        label: '큰 결산',
        skill: findSkillByNames(data, ['오딘의 격노']),
        note: '격노 시작과 큰 피해를 겹치되 전체 사용 횟수를 잃지 않게 배정합니다.',
        segments: [[8, 9], [52, 9], [89, 8]],
      },
      {
        label: '광역 조건',
        skill: findSkillByNames(data, ['소용돌이 연마', '소용돌이', '고기칼']),
        note: '광역은 새 순서가 아니라 핵심 기술을 확산시키는 조건 유지입니다.',
        segments: [[3, 16], [34, 16], [66, 16], [88, 10]],
      },
      {
        label: '번개 분기',
        skill: findSkillByNames(data, ['우레 작렬', '폭풍의 화신', '벼락']),
        note: '산왕을 선택했을 때만 우레 작렬 과충전과 천둥벼락 전환을 별도로 추적합니다.',
        segments: [[24, 10], [42, 10], [62, 10], [82, 10]],
      },
      {
        label: '학살자 압축',
        skill: findSkillByNames(data, ['마무리 일격', '칼날폭풍', '학살자의 지배']),
        note: '마무리 일격과 칼날폭풍을 광란 루프 밖으로 밀지 않는지 확인합니다.',
        segments: [[20, 13], [57, 13], [86, 10]],
      },
      {
        label: '생존 보존',
        skill: findSkillByNames(data, ['격노의 재생력']),
        note: '죽지 않는 것뿐 아니라 피의 갈증 회복과 근접 시간을 보존하는 줄입니다.',
        segments: [[40, 12], [76, 12]],
      },
    ];
  }

  if (guide.id === 'paladin-holy') {
    return [
      {
        label: '중심 생성',
        skill: findSkillByNames(data, ['신성 충격']),
        note: '신성한 힘과 빛 주입을 여는 중심 생성기입니다.',
        segments: [[5, 7], [20, 7], [36, 7], [53, 7], [71, 7], [88, 7]],
      },
      {
        label: '봉화망',
        skill: findSkillByNames(data, ['빛의 봉화', '신념의 봉화']),
        note: '실제 피해 분포와 특화 거리 조건에 맞는 치유 전달 경로입니다.',
        segments: [[0, 100]],
      },
      {
        label: '자동 봉화',
        skill: findSkillByNames(data, ['구세주의 봉화']),
        note: '낮은 체력 대상을 따라가며 단일 사고를 줄이는 보조 봉화입니다.',
        segments: [[10, 18], [42, 20], [72, 20]],
      },
      {
        label: '발동 분기',
        skill: findSkillByNames(data, ['빛 주입']),
        note: '치유 압박은 빛의 섬광, 안정 구간은 심판으로 소비합니다.',
        segments: [[18, 8], [40, 8], [63, 8], [84, 8]],
      },
      {
        label: '단일 결산',
        skill: findSkillByNames(data, ['영광의 서약', '영원의 불꽃']),
        note: '한 명이 죽을 위험일 때 신성한 힘을 즉시 치유로 비웁니다.',
        segments: [[26, 9], [59, 9], [82, 9]],
      },
      {
        label: '광역 결산',
        skill: findSkillByNames(data, ['여명의 빛']),
        note: '넓은 피해 직후 여러 대상을 회수하는 신성한 힘 소비기입니다.',
        segments: [[32, 11], [66, 11], [90, 8]],
      },
      {
        label: '새벽빛 창',
        skill: findSkillByNames(data, ['천상의 종', '신성한 반사', '새벽빛']),
        note: '태양의 사자에서 새벽빛과 태양의 화신 대상망을 여는 짧은 쿨다운입니다.',
        segments: [[14, 12], [48, 12], [78, 12]],
      },
      {
        label: '피해 감소',
        skill: findSkillByNames(data, ['오라 숙련']),
        note: '큰 피해 직전에 예약해야 하는 방어 쿨다운입니다.',
        segments: [[30, 10], [76, 10]],
      },
      {
        label: '장기 회복',
        skill: findSkillByNames(data, ['티르의 해방']),
        note: '큰 피해 전후의 후속 치유를 길게 만드는 창입니다.',
        segments: [[38, 20], [84, 14]],
      },
      {
        label: '날개 창',
        skill: findSkillByNames(data, ['응징의 격노', '응징의 성전사']),
        note: '치유량 강화 또는 심판/성전사의 일격 회복 전환 창입니다.',
        segments: [[22, 24], [68, 24]],
      },
      {
        label: '무장 분기',
        skill: findSkillByNames(data, ['신성한 무기', '신성한 보루']),
        note: '빛대장장이 선택 시 대상 보호와 치유/피해 보조, 신성한 힘 생성을 함께 봅니다.',
        segments: [[16, 12], [52, 12], [80, 12]],
      },
    ];
  }

  if (guide.id === 'paladin-protection') {
    return [
      {
        label: '위치 방어',
        skill: findSkillByNames(data, ['신성화']),
        note: '현재 탱킹 좌표의 방어 전제입니다. 이동 후 비는 시간을 가장 먼저 봅니다.',
        segments: [[3, 28], [34, 28], [66, 28]],
      },
      {
        label: '중심 완화',
        skill: findSkillByNames(data, ['정의의 방패']),
        note: '큰 평타와 물리 피해 전에 유지해야 하는 핵심 방어 시간입니다.',
        segments: [[12, 14], [32, 14], [52, 14], [72, 14], [90, 8]],
      },
      {
        label: '방패 생성',
        skill: findSkillByNames(data, ['응징의 방패']),
        note: '풀링, 차단 보조, 위협, 신성한 힘 흐름을 여는 원거리 축입니다.',
        segments: [[6, 10], [30, 10], [55, 10], [80, 10]],
      },
      {
        label: '판결 생성',
        skill: findSkillByNames(data, ['심판']),
        note: '짧은 쿨 생성기이자 우선 대상 압박입니다.',
        segments: [[10, 7], [25, 7], [40, 7], [55, 7], [70, 7], [85, 7]],
      },
      {
        label: '기본 생성',
        skill: findSkillByNames(data, ['정의의 망치', '축복받은 망치']),
        note: '비는 전역 재사용 시간에 신성한 힘 흐름을 보강합니다.',
        segments: [[16, 8], [36, 8], [58, 8], [78, 8]],
      },
      {
        label: '복구 분기',
        skill: findSkillByNames(data, ['영광의 서약']),
        note: '정의의 방패와 같은 신성한 힘을 쓰므로 피해 후 복구가 필요한지 판단합니다.',
        segments: [[28, 10], [64, 10], [88, 8]],
      },
      {
        label: '광역 풀링',
        skill: findSkillByNames(data, ['천상의 종', '응징의 방패']),
        note: '광역 위협, 차단 보조, 생성 흐름을 동시에 여는 창입니다.',
        segments: [[20, 18], [68, 18]],
      },
      {
        label: '죽음 방지',
        skill: findSkillByNames(data, ['헌신적인 수호자']),
        note: '급사 위험 전에 예약하는 보험 생존기입니다.',
        segments: [[38, 14], [84, 12]],
      },
      {
        label: '큰 물리',
        skill: findSkillByNames(data, ['고대 왕의 수호자']),
        note: '가장 강한 물리 압박이나 장기 위험 구간에 배정합니다.',
        segments: [[48, 18]],
      },
      {
        label: '영웅 특성',
        skill: findSkillByNames(data, ['빛의 망치', '신성한 보루', '신성한 무기']),
        note: '기사단은 큰 공격 창, 빛대장장이는 보호/지원 창으로 나눠 검수합니다.',
        segments: [[22, 14], [62, 14]],
      },
    ];
  }

  if (guide.id === 'paladin-retribution') {
    return [
      {
        label: '큰 창 기준',
        skill: findSkillByNames(data, ['사형 선고']),
        note: '응징의 격노와 고가치 피해가 모이는 피해 압축 기준점입니다.',
        segments: [[14, 18], [62, 18]],
      },
      {
        label: '날개 창',
        skill: findSkillByNames(data, ['응징의 격노']),
        note: '사형 선고와 파멸의 재와 빛의 망치를 함께 묶는 강화 구간입니다.',
        segments: [[10, 24], [58, 24]],
      },
      {
        label: '재 폭발',
        skill: findSkillByNames(data, ['파멸의 재']),
        note: '피해와 신성한 힘 공급이 동시에 들어가는 창 전환 버튼입니다.',
        segments: [[18, 9], [66, 9]],
      },
      {
        label: '기사단 결산',
        skill: findSkillByNames(data, ['빛의 망치']),
        note: '기사단 빌드에서 사형 선고 안에 우선 넣는 큰 결산 버튼입니다.',
        segments: [[22, 10], [70, 10]],
      },
      {
        label: '처형 생성',
        skill: findSkillByNames(data, ['천벌의 망치']),
        note: '처형 조건이나 응징의 격노 중 열리는 피해 겸 생성기입니다.',
        segments: [[24, 8], [44, 8], [72, 8], [91, 7]],
      },
      {
        label: '검 생성',
        skill: findSkillByNames(data, ['심판의 칼날']),
        note: '전쟁의 기술 발동과 신성한 힘 공급을 회수하는 중심 생성기입니다.',
        segments: [[6, 8], [31, 8], [51, 8], [83, 8]],
      },
      {
        label: '판결 압박',
        skill: findSkillByNames(data, ['심판']),
        note: '짧은 쿨다운으로 우선 대상 압박과 자원 흐름을 정리합니다.',
        segments: [[4, 7], [28, 7], [48, 7], [78, 7]],
      },
      {
        label: '단일 결산',
        skill: findSkillByNames(data, ['최후의 선고', '기사단의 선고']),
        note: '사형 선고 대상이나 보스 단일에서 신성한 힘을 비우는 소모기입니다.',
        segments: [[26, 10], [41, 8], [74, 10], [88, 8]],
      },
      {
        label: '광역 결산',
        skill: findSkillByNames(data, ['천상의 폭풍']),
        note: '대상 수와 생존 시간이 충분할 때 신성한 힘을 광역 피해로 전환합니다.',
        segments: [[35, 10], [54, 10], [84, 10]],
      },
      {
        label: '발동 회수',
        skill: findSkillByNames(data, ['전쟁의 기술']),
        note: '심판의 칼날 재사용을 앞당기므로 신성한 힘 빈칸을 먼저 확인합니다.',
        segments: [[30, 9], [50, 9], [82, 9]],
      },
      {
        label: '기사단 보정',
        skill: findSkillByNames(data, ['구세의 빛', '최고천의 망치']),
        note: '빛의 망치 처리 순서와 사형 선고 종료 시간을 함께 봅니다.',
        segments: [[20, 13], [68, 13]],
      },
    ];
  }

  if (guide.id === 'mage-frost') {
    return [
      {
        label: '중심 판정',
        skill: findSkillByNames(data, ['산산조각']),
        note: '빙결 중첩을 실제 피해로 바꾸는 냉기의 중심 판정입니다.',
        segments: [[4, 90]],
      },
      {
        label: '소비 스킬',
        skill: findSkillByNames(data, ['얼음창']),
        note: '주문술사 기준 6중첩 이상 또는 서리의 손가락을 소비합니다.',
        segments: [[10, 8], [24, 8], [44, 8], [62, 8], [82, 8]],
      },
      {
        label: '창 열기',
        skill: findSkillByNames(data, ['진눈깨비']),
        note: '두뇌 빙결로 산산조각 소비 창을 열어 줍니다.',
        segments: [[8, 10], [34, 10], [70, 10]],
      },
      {
        label: '발동 신호',
        skill: findSkillByNames(data, ['두뇌 빙결', '서리의 손가락']),
        note: '방치하거나 과충전하지 않고 소비 순서를 정합니다.',
        segments: [[14, 12], [38, 10], [66, 12], [86, 8]],
      },
      {
        label: '주 쿨기',
        skill: findSkillByNames(data, ['서리 광선']),
        note: '중첩을 먼저 비운 뒤 채널이 끊기지 않는 구간에 넣습니다.',
        segments: [[20, 16], [76, 16]],
      },
      {
        label: '광역 엔진',
        skill: findSkillByNames(data, ['얼어붙은 구슬']),
        note: '광역 피해와 발동/쇄편 흐름을 다시 만듭니다.',
        segments: [[30, 14], [72, 14]],
      },
      {
        label: '광역 전환',
        skill: findSkillByNames(data, ['눈보라', '빗발치는 냉기']),
        note: '3타겟 이상과 빗발치는 냉기 조건에서 우선순위가 올라갑니다.',
        segments: [[2, 12], [48, 14], [90, 8]],
      },
      {
        label: '큰 소비기',
        skill: findSkillByNames(data, ['혹한의 쐐기', '혜성 폭풍']),
        note: '고드름과 산산조각 창이 맞을 때 큰 소비기로 정리합니다.',
        segments: [[52, 12], [92, 6]],
      },
    ];
  }

  if (guide.id === 'druid-balance') {
    return [
      {
        label: '달빛섬광 기반',
        skill: findSkillByNames(data, ['달빛섬광']),
        note: '창 전에 갱신해 일월식 내부 전역을 비웁니다.',
        segments: [[4, 30], [48, 32], [82, 14]],
      },
      {
        label: '태양섬광 전파',
        skill: findSkillByNames(data, ['태양섬광']),
        note: '다중 대상 발동과 별똥별 기반을 만드는 도트입니다.',
        segments: [[8, 34], [54, 30]],
      },
      {
        label: '일월식 소비 창',
        skill: findSkillByNames(data, ['일월식 (태양)', '일월식 (달)']),
        note: '2충전을 방치하지 않고, 진입 직후 소비기 3회를 봅니다.',
        segments: [[18, 18], [58, 18]],
      },
      {
        label: '별빛쇄도/별똥별',
        skill: findSkillByNames(data, ['별빛쇄도']),
        note: '단일은 별빛쇄도, 광역은 별똥별로 천공의 힘을 과충전 없이 씁니다.',
        segments: [[22, 12], [42, 12], [62, 12], [82, 10]],
      },
      {
        label: '별재봉사/우주의 손길',
        skill: findSkillByNames(data, ['별재봉사', '우주의 손길']),
        note: '무료 소비기 발동은 천공의 힘 상한과 별도로 처리합니다.',
        segments: [[30, 10], [68, 12]],
      },
      {
        label: '숲의 수호자 창',
        skill: findSkillByNames(data, ['자연의 군대']),
        note: '레이드 숲의 수호자 빌드는 자연의 군대를 일월식/천체의 정렬과 맞추는지 봅니다.',
        segments: [[16, 13], [64, 13]],
      },
      {
        label: '엘룬의 대행자 창',
        skill: findSkillByNames(data, ['엘룬의 분노']),
        note: '쐐기 고단 엘룬의 대행자 빌드는 엘룬의 분노와 달 계열 지속 광역을 같이 봅니다.',
        segments: [[28, 18], [72, 18]],
      },
    ];
  }

  if (guide.id === 'hunter-beastmastery') {
    return [
      {
        label: '우선 대상',
        skill: findSkillByNames(data, ['사냥꾼의 징표']),
        note: '오래 사는 보스나 위험 몹에 먼저 유지합니다.',
        segments: [[2, 92]],
      },
      {
        label: '충전 정리',
        skill: findSkillByNames(data, ['날카로운 사격']),
        note: '2충전 방치를 막고 야수의 격노 직전 충전을 비웁니다.',
        segments: [[8, 14], [31, 12], [55, 14], [82, 10]],
      },
      {
        label: '중심 창',
        skill: findSkillByNames(data, ['야수의 격노']),
        note: '창 안 살상 명령, 세트 효과, 영웅 특성 발동 밀도를 봅니다.',
        segments: [[18, 18], [60, 18]],
      },
      {
        label: '핵심 명령',
        skill: findSkillByNames(data, ['살상 명령']),
        note: '가능하면 자연의 동맹을 받은 상태로 반복합니다.',
        segments: [[22, 9], [38, 9], [63, 9], [79, 9]],
      },
      {
        label: '강화 조건',
        skill: findSkillByNames(data, ['자연의 동맹']),
        note: '살상 명령 사이에 비살상 명령을 끼워 넣는 기준입니다.',
        segments: [[14, 16], [34, 14], [58, 16], [77, 12]],
      },
      {
        label: '광역 진입',
        skill: findSkillByNames(data, ['마구잡이 난타']),
        note: '다중 대상이면 야수의 회전베기를 켜는 출발점입니다.',
        segments: [[12, 10], [52, 10], [84, 8]],
      },
      {
        label: '광역 유지',
        skill: findSkillByNames(data, ['야수의 회전베기']),
        note: '야수의 격노가 이 흐름 안에 들어가는지 확인합니다.',
        segments: [[12, 30], [52, 30]],
      },
      {
        label: '어둠 분기',
        skill: findSkillByNames(data, ['부패의 사격', '검은 화살']),
        note: '어둠 순찰자에서는 야수의 격노 초반 검은 화살과 말미 울부짖는 화살을 봅니다.',
        segments: [[18, 10], [68, 10]],
      },
    ];
  }

  if (guide.id === 'hunter-marksmanship') {
    return [
      {
        label: '우선 대상',
        skill: findSkillByNames(data, ['사냥꾼의 징표']),
        note: '오래 사는 대상에 먼저 유지해 조준 사격과 속사의 기준 대상을 고정합니다.',
        segments: [[2, 92]],
      },
      {
        label: '중심 충전',
        skill: findSkillByNames(data, ['조준 사격']),
        note: '2충전 방치를 막고 정조준 안에서는 가능한 많은 고품질 시전을 넣습니다.',
        segments: [[6, 14], [28, 14], [52, 14], [76, 14]],
      },
      {
        label: '속사 준비',
        skill: findSkillByNames(data, ['속사']),
        note: '조준하기와 총알 세례를 통해 다음 조준 사격 회복과 피해 품질을 만듭니다.',
        segments: [[16, 10], [46, 10], [72, 10]],
      },
      {
        label: '발동 소비',
        skill: findSkillByNames(data, ['정밀 사격']),
        note: '다음 조준 사격/속사 전에 신비한 사격 또는 일제 사격으로 발동을 소비합니다.',
        segments: [[20, 8], [36, 8], [60, 8], [86, 8]],
      },
      {
        label: '광역 조건',
        skill: findSkillByNames(data, ['교묘한 사격', '일제 사격']),
        note: '다중 대상에서는 조준 사격과 속사 전에 교묘한 사격 상태를 먼저 확인합니다.',
        segments: [[10, 18], [50, 18], [80, 12]],
      },
      {
        label: '정조준 창',
        skill: findSkillByNames(data, ['정조준']),
        note: '우선순위를 바꾸는 버튼이 아니라 조준 사격과 속사를 압축하는 창입니다.',
        segments: [[38, 22], [82, 14]],
      },
      {
        label: '보조 발동',
        skill: findSkillByNames(data, ['폭발 사격', '실탄 장전']),
        note: '파편 사격 선택 시 폭발 사격이 실탄 장전 조준 사격으로 이어지는지 봅니다.',
        segments: [[24, 10], [64, 10]],
      },
      {
        label: '영웅 분기',
        skill: findSkillByNames(data, ['검은 화살', '달빛 회전 표창', '울부짖는 화살']),
        note: '레이드 파수꾼은 표식/달빛 회전 표창, 쐐기 어둠 순찰자는 검은 화살/울부짖는 화살을 별도 분기로 봅니다.',
        segments: [[42, 12], [72, 14]],
      },
    ];
  }

  if (guide.id === 'hunter-survival') {
    return [
      {
        label: '우선 대상',
        skill: findSkillByNames(data, ['사냥꾼의 징표']),
        note: '오래 사는 보스나 위험 몹에 먼저 유지합니다.',
        segments: [[2, 92]],
      },
      {
        label: '생성 충전',
        skill: findSkillByNames(data, ['살상 명령']),
        note: '창끝과 집중을 만들되 2충전 방치와 3중첩 과잉을 막습니다.',
        segments: [[6, 10], [26, 10], [48, 10], [70, 10], [88, 8]],
      },
      {
        label: '중심 버프',
        skill: findSkillByNames(data, ['창끝']),
        note: '강한 소비기 전까지 1~3중첩 품질을 관리합니다.',
        segments: [[10, 18], [34, 18], [58, 18], [82, 12]],
      },
      {
        label: '제압 창',
        skill: findSkillByNames(data, ['제압']),
        note: '창 진입 전 폭탄, 붐스틱, 무리의 지도자 살상 명령을 준비합니다.',
        segments: [[24, 18], [72, 18]],
      },
      {
        label: '폭탄 충전',
        skill: findSkillByNames(data, ['야생불 폭탄']),
        note: '2충전 임박, 광역 적중 수, 파수꾼 표식 소비를 함께 봅니다.',
        segments: [[12, 10], [36, 10], [62, 10], [84, 10]],
      },
      {
        label: '전방 채널',
        skill: findSkillByNames(data, ['붐스틱']),
        note: '창끝을 먹이고 전방 20미터에 대상이 모였는지 확인합니다.',
        segments: [[30, 14], [76, 12]],
      },
      {
        label: '랩터 소비',
        skill: findSkillByNames(data, ['랩터의 휩쓸기', '랩터의 일격']),
        note: '광역은 휩쓸기 방향, 단일은 일격 집중 정리를 구분합니다.',
        segments: [[18, 9], [44, 9], [66, 9], [90, 7]],
      },
      {
        label: '영웅 분기',
        skill: findSkillByNames(data, ['무리의 지도자의 포효', '달빛 회전 표창']),
        note: '무리의 지도자는 포효/쇄도 살상 명령, 파수꾼은 제압 후 달빛 회전 표창과 표식 폭탄을 봅니다.',
        segments: [[28, 12], [72, 14]],
      },
    ];
  }

  if (guide.id === 'evoker-preservation') {
    return [
      {
        label: '사전 기반',
        skill: findSkillByNames(data, ['시간 변칙']),
        note: '피해 전에 메아리 기반과 흡수 준비를 만드는 출발점입니다.',
        segments: [[6, 18], [46, 18], [78, 14]],
      },
      {
        label: '중심 스킬',
        skill: findSkillByNames(data, ['메아리']),
        note: '다음 핵심 치유를 받을 대상을 미리 정하는 보존의 중심 흐름입니다.',
        segments: [[12, 32], [52, 30]],
      },
      {
        label: '핵심 소비',
        skill: findSkillByNames(data, ['메리스라의 축복']),
        note: '준비된 메아리를 가장 높은 가치로 소비하는 후보입니다.',
        segments: [[26, 12], [66, 12]],
      },
      {
        label: '지속 안정',
        skill: findSkillByNames(data, ['되감기']),
        note: '반복 피해 대상과 은총의 시간 계열 안정성을 만듭니다.',
        segments: [[18, 36], [60, 30]],
      },
      {
        label: '전방 치유',
        skill: findSkillByNames(data, ['꿈의 숨결']),
        note: '각도와 강화 단계가 맞을 때 광역 회복 창이 됩니다.',
        segments: [[30, 14], [70, 14]],
      },
      {
        label: '저장 쿨기',
        skill: findSkillByNames(data, ['정지장']),
        note: '저장 순서와 방출 시점이 피해 타이머와 맞아야 합니다.',
        segments: [[10, 10], [38, 10], [58, 10]],
      },
      {
        label: '피해 후 복구',
        skill: findSkillByNames(data, ['되돌리기']),
        note: '큰 피해가 실제로 들어온 뒤 쓰는 대형 복구 버튼입니다.',
        segments: [[42, 12], [86, 10]],
      },
      {
        label: '경로 회복',
        skill: findSkillByNames(data, ['꿈의 비행']),
        note: '아군이 지나는 경로와 공대 생존기 순서를 보고 배정합니다.',
        segments: [[72, 18]],
      },
    ];
  }

  if (guide.id === 'evoker-augmentation') {
    return [
      {
        label: '중심 버프',
        skill: findSkillByNames(data, ['칠흑의 힘']),
        note: '증강의 가장 중요한 유지 흐름입니다. 공백 구간은 개인 피해보다 먼저 수정합니다.',
        segments: [[2, 42], [48, 42]],
      },
      {
        label: '대상 선정',
        skill: findSkillByNames(data, ['예지']),
        note: '다음 큰 피해 창을 가진 딜러에게 미리 유지되어야 합니다.',
        segments: [[8, 34], [50, 34]],
      },
      {
        label: '파티 극딜',
        skill: findSkillByNames(data, ['영겁의 숨결']),
        note: '좋은 파티 피해 창과 겹치되, 복제 가치 때문에 지나친 보류는 피합니다.',
        segments: [[18, 16], [64, 16]],
      },
      {
        label: '정수 소비',
        skill: findSkillByNames(data, ['분출']),
        note: '정수와 정수 폭발은 칠흑의 힘 안에서 분출로 소비합니다.',
        segments: [[24, 12], [40, 12], [72, 12], [88, 10]],
      },
      {
        label: '강화 주문',
        skill: findSkillByNames(data, ['지각 변동', '불의 숨결']),
        note: '강화 단계보다 칠흑의 힘 공백과 파티 창 정렬을 먼저 봅니다.',
        segments: [[14, 14], [56, 14]],
      },
      {
        label: '탱커 지원',
        skill: findSkillByNames(data, ['끓어오르는 비늘']),
        note: '큰 물리 피해가 오는 탱커에게 유지되는지 확인합니다.',
        segments: [[4, 38], [52, 36]],
      },
    ];
  }

  if (guide.id === 'priest-shadow') {
    return [
      {
        label: '흡혈 기반',
        skill: findSkillByNames(data, ['흡혈의 손길']),
        note: '오래 사는 대상에게 유지하는 기본 지속 피해이자 영혼의 연결 회수 기반입니다.',
        segments: [[5, 40], [51, 42]],
      },
      {
        label: '고통 확장',
        skill: findSkillByNames(data, ['어둠의 권능: 고통']),
        note: '흡혈의 손길과 함께 끊김 여부를 먼저 확인하되 짧게 죽는 대상에는 과투자하지 않습니다.',
        segments: [[3, 44], [54, 39]],
      },
      {
        label: '광기 유지',
        skill: findSkillByNames(data, ['어둠의 권능: 광기']),
        note: '광기가 넘치기 전 소모하고 유지 시간이 낮으면 우선순위를 올립니다.',
        segments: [[22, 18], [60, 20]],
      },
      {
        label: '광기 생성',
        skill: findSkillByNames(data, ['정신 분열']),
        note: '짧은 쿨다운 사용 횟수를 잃으면 광기와 영혼의 연결 회수가 같이 밀립니다.',
        segments: [[14, 14], [43, 13], [73, 13]],
      },
      {
        label: '집정관 창',
        skill: findSkillByNames(data, ['후광', '공허의 형상', '마력 주입']),
        note: '집정관은 후광 각도와 공허의 형상, 마력 주입이 같은 긴 피해 창으로 묶이는지 봅니다.',
        segments: [[18, 20], [70, 18]],
      },
      {
        label: '공허 균열',
        skill: findSkillByNames(data, ['공허의 격류', '혼돈의 균열', '공허의 폭발']),
        note: '공허술사는 이동 없는 구간에 공허의 격류를 넣고 균열 안 공허의 폭발을 확인합니다.',
        segments: [[28, 16], [78, 14]],
      },
      {
        label: '주 대상 회수',
        skill: findSkillByNames(data, ['영혼의 연결']),
        note: '주 대상 피해가 지속 피해 대상에게 회수되는 구조라 대상 선택과 풀 수명을 같이 봅니다.',
        segments: [[10, 34], [52, 34]],
      },
      {
        label: '이동/처형',
        skill: findSkillByNames(data, ['어둠의 권능: 죽음', '분산']),
        note: '이동 전 광기를 비우고, 처형/위험 구간에서는 즉시시전과 생존 판단을 분리합니다.',
        segments: [[36, 10], [66, 10], [90, 6]],
      },
    ];
  }

  if (guide.id === 'druid-feral') {
    return [
      {
        label: '갈퀴 발톱 품질',
        skill: findSkillByNames(data, ['갈퀴 발톱']),
        note: '숨기 또는 호랑이의 분노 조건에서 새로 적용할 때 품질이 올라갑니다.',
        segments: [[4, 28], [43, 30], [78, 16]],
      },
      {
        label: '도려내기/팬데믹',
        skill: findSkillByNames(data, ['도려내기']),
        note: '5연계 점수와 팬데믹 범위, 호랑이의 분노 대기시간을 함께 봅니다.',
        segments: [[12, 38], [58, 34]],
      },
      {
        label: '원시 분노 대상수',
        skill: findSkillByNames(data, ['원시 분노']),
        note: '다수 대상 도려내기를 갱신하고 최상위 포식자의 갈망 발동 기반을 넓히는 구간입니다.',
        segments: [[22, 20], [55, 22], [83, 12]],
      },
      {
        label: '호랑이의 분노 창',
        skill: findSkillByNames(data, ['호랑이의 분노']),
        note: '기력 과잉 없이 사용하고, 창 안에서 새 출혈 또는 큰 소비기를 배치합니다.',
        segments: [[8, 13], [45, 13], [82, 13]],
      },
      {
        label: '발톱 전환',
        skill: findSkillByNames(data, ['물어뜯기', '찢어발기기']),
        note: '쐐기 발톱의 드루이드 빌드는 출혈 유지 뒤 직접 피해 창을 얹습니다.',
        segments: [[30, 18], [63, 20]],
      },
      {
        label: '단일 결산',
        skill: findSkillByNames(data, ['흉포한 이빨', '최상위 포식자의 갈망']),
        note: '도려내기 유지 뒤 5연계 점수와 충분한 기력에서 우선 대상에 결산합니다.',
        segments: [[34, 10], [58, 10], [86, 8]],
      },
      {
        label: '쿨다운 압축',
        skill: findSkillByNames(data, ['광폭화', '영혼 소집', '야성의 광기']),
        note: '출혈이 준비된 뒤 사용하되, 기다리느라 전투 전체 사용 횟수를 잃지 않는 것이 기준입니다.',
        segments: [[18, 18], [60, 18]],
      },
      {
        label: '쐐기 유틸',
        skill: findSkillByNames(data, ['나무 껍질', '두개골 강타', '달래기', '쇄도의 포효']),
        note: '첫 광역 창보다 위협, 차단, 격노 해제, 파티 이동이 먼저인 구간을 분리합니다.',
        segments: [[14, 8], [48, 8], [74, 8], [90, 6]],
      },
    ];
  }

  const pool = uniqueBy([...data.featuredSkills, ...data.defensiveSkills, ...data.healingSkills], skill => String(skill.id)).slice(0, 4);
  return pool.map((skill, index) => ({
    label: index < 2 ? '유지 효과' : '재확인',
    skill,
    note: `${skillName(skill)} 유지/재사용 판단을 전투 흐름에 맞춰 확인합니다.`,
    segments: [[4 + index * 5, 38], [52 + index * 3, 28]],
  }));
}

function UptimeTimelineChart({ guide, data }) {
  const rows = getUptimeRows(guide, data);

  return (
    <UptimeChart>
      {rows.map((row, index) => (
        <UptimeLane key={`${row.skill?.id || row.label}-${index}`}>
          <LaneLabel>
            <SkillIconLink skill={row.skill} size={28} />
            <span>{row.skill ? skillName(row.skill) : row.label}</span>
          </LaneLabel>
          <SegmentTrack>
            {row.segments.map(([left, width], segmentIndex) => (
              <Segment
                key={`${left}-${width}`}
                $left={left}
                $width={width}
                $color={segmentIndex % 2 ? '#b8915b' : guide.color}
              />
            ))}
          </SegmentTrack>
          <UptimeNote>
            <span>{row.label}</span>
            <strong>{row.note}</strong>
          </UptimeNote>
        </UptimeLane>
      ))}
      <ChartDataFootnote>
        실제 전투 로그의 유지율 퍼센트가 아니라, 가이드 설명에서 “언제 확인해야 하는가”를 읽기 쉽게 만든 판단 지도입니다.
      </ChartDataFootnote>
    </UptimeChart>
  );
}

function TargetScalingChart({ guide, skills }) {
  const labels = ['단일', '2타겟', '광역', '우선 타겟'];
  const values = guide.id === 'evoker-augmentation' ? [82, 88, 74, 94] : [92, 78, 86, 70];

  return (
    <BarChart>
      {labels.map((label, index) => (
        <TargetBar key={label}>
          <BarLabel>
            <SkillIconLink skill={skills[index % Math.max(skills.length, 1)]} size={28} />
            <span>{label}</span>
          </BarLabel>
          <BarTrack>
            <BarFill $value={values[index]} $color={index % 2 ? '#b8915b' : guide.color} />
          </BarTrack>
          <BarValue>{values[index]}</BarValue>
        </TargetBar>
      ))}
    </BarChart>
  );
}

function SynergyNetworkChart({ guide, data }) {
  const synergies = data.synergies.slice(0, 5);

  return (
    <NetworkMap>
      <NetworkCenter $color={guide.color}>
        <span>{guide.spec}</span>
        <strong>{guide.className}</strong>
      </NetworkCenter>
      <NetworkNodes>
        {synergies.map((synergy, index) => (
          <NetworkNode key={`${synergy.id || synergyName(synergy)}-${index}`} $color={index % 2 ? '#b8915b' : guide.color}>
            <span>{synergyTypeLabel(synergy)}</span>
            <strong>{synergyName(synergy)}</strong>
          </NetworkNode>
        ))}
      </NetworkNodes>
    </NetworkMap>
  );
}

const Page = styled.div`
  width: min(1320px, calc(100vw - 32px));
  max-width: calc(100vw - 32px);
  margin: 0 auto;
  padding: 34px 0 92px;
  overflow-x: hidden;

  @media (max-width: 560px) {
    width: calc(100vw - 20px);
    max-width: calc(100vw - 20px);
  }
`;

const Hero = styled.header`
  min-width: 0;
  overflow: hidden;
  border: 1px solid rgba(184, 145, 91, 0.25);
  border-left: 4px solid ${props => props.$color};
  background:
    linear-gradient(135deg, ${props => props.$tone} 0%, rgba(13, 18, 22, 0) 52%),
    #0d1216;
`;

const HeroTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(184, 145, 91, 0.2);
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #c7bba7;
  font-size: 0.82rem;
  font-weight: 900;
`;

const PatchBadge = styled.div`
  color: #f4efe5;
  font-size: 0.78rem;
  font-weight: 900;
`;

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: 24px;
  padding: clamp(18px, 4vw, 34px);

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

const HeroEyebrow = styled.div`
  color: #b8915b;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const HeroTitle = styled.h1`
  margin-top: 8px;
  color: #f4efe5;
  font-size: clamp(2rem, 5vw, 4rem);
  letter-spacing: 0;
  word-break: keep-all;
`;

const HeroLead = styled.p`
  max-width: 850px;
  margin-top: 14px;
  color: #d8cbb7;
  font-size: 1rem;
  font-weight: 750;
  word-break: keep-all;
`;

const HeroStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
`;

const HeroStat = styled.div`
  min-height: 82px;
  padding: 14px;
  border: 1px solid rgba(184, 145, 91, 0.24);
  background: #0a0f13;

  span {
    color: #8d9aa3;
    font-size: 0.72rem;
    font-weight: 900;
    text-transform: uppercase;
  }

  strong {
    display: block;
    margin-top: 8px;
    color: #f4efe5;
    font-size: 1.55rem;
    line-height: 1;
  }
`;

const GuideLayout = styled.div`
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 20px;
  margin-top: 22px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const GuideNav = styled.nav`
  position: sticky;
  top: 86px;
  align-self: start;
  display: grid;
  gap: 6px;
  padding: 14px;
  border: 1px solid rgba(184, 145, 91, 0.22);
  background: #0d1216;

  @media (max-width: 980px) {
    position: static;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
`;

const GuideNavTitle = styled.div`
  color: #f4efe5;
  font-size: 0.84rem;
  font-weight: 900;

  @media (max-width: 980px) {
    grid-column: 1 / -1;
  }
`;

const GuideNavLink = styled.a`
  min-width: 0;
  padding: 8px 0;
  color: #c7bba7;
  font-size: 0.82rem;
  font-weight: 850;
  border-top: 1px solid rgba(244, 239, 229, 0.06);
  word-break: keep-all;
`;

const Article = styled.article`
  display: grid;
  gap: 18px;
  min-width: 0;
`;

const SectionBlock = styled.section`
  min-width: 0;
  scroll-margin-top: clamp(96px, 14vh, 150px);
  padding: clamp(16px, 3vw, 22px);
  border: 1px solid rgba(184, 145, 91, 0.22);
  background:
    linear-gradient(90deg, rgba(184, 145, 91, 0.035) 1px, transparent 1px),
    linear-gradient(180deg, rgba(184, 145, 91, 0.035) 1px, transparent 1px),
    #10161b;
  background-size: 32px 32px;
`;

const SectionHead = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
`;

const SectionIcon = styled.div`
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  color: #f4efe5;
  border: 1px solid rgba(184, 145, 91, 0.32);
  background: #0a0f13;
`;

const SectionKicker = styled.div`
  color: #b8915b;
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const SectionTitle = styled.h2`
  color: #f4efe5;
  font-size: clamp(1.24rem, 3vw, 1.8rem);
  letter-spacing: 0;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryItem = styled.div`
  min-height: 132px;
  padding: 14px;
  border: 1px solid rgba(184, 145, 91, 0.2);
  background: #0d1216;
`;

const SummaryLabel = styled.div`
  color: #b8915b;
  font-size: 0.72rem;
  font-weight: 900;
`;

const SummaryText = styled.p`
  margin-top: 10px;
  color: #d8cbb7;
  font-size: 0.9rem;
  font-weight: 750;
  word-break: keep-all;
`;

const ManuscriptStatus = styled.div`
  display: inline-flex;
  width: max-content;
  max-width: 100%;
  color: #b8915b;
  font-size: 0.72rem;
  font-weight: 950;
  line-height: 1.2;
  white-space: nowrap;
  text-transform: uppercase;
`;

const ManuscriptMeta = styled.div`
  display: grid;
  gap: 6px;
  min-width: 144px;

  span {
    padding: 7px 9px;
    color: #d8cbb7;
    border: 1px solid rgba(244, 239, 229, 0.1);
    background: rgba(8, 13, 17, 0.72);
    font-size: 0.72rem;
    font-weight: 900;
  }
`;

const PaperLead = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
  align-items: start;
  padding: clamp(16px, 3vw, 22px);
  border-left: 4px solid ${props => props.$color};
  background:
    linear-gradient(135deg, ${props => props.$color}1a 0%, rgba(13, 18, 22, 0.94) 58%),
    #0d1216;

  p {
    margin-top: 8px;
    color: #f4efe5;
    font-size: clamp(0.98rem, 2vw, 1.08rem);
    font-weight: 780;
    line-height: 1.8;
    word-break: keep-all;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const PaperBody = styled.div`
  display: grid;
  gap: 26px;
  margin-top: 26px;
`;

const PaperSection = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 286px);
  gap: clamp(14px, 2vw, 22px);
  min-width: 0;
  padding-top: 22px;
  border-top: 1px solid rgba(244, 239, 229, 0.08);
  scroll-margin-top: clamp(96px, 14vh, 150px);

  &:first-child {
    padding-top: 0;
    border-top: 0;
  }

  h3 {
    scroll-margin-top: clamp(96px, 14vh, 150px);
    color: #f4efe5;
    font-size: clamp(1.08rem, 2.4vw, 1.42rem);
    line-height: 1.28;
    letter-spacing: 0;
  }

  p {
    margin-top: 12px;
    color: #d8cbb7;
    font-size: 0.96rem;
    font-weight: 720;
    line-height: 1.86;
    word-break: keep-all;
    text-wrap: pretty;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const GuideDigestGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-top: 14px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const GuideDigestCard = styled.article`
  min-width: 0;
  padding: 12px;
  color: inherit;
  text-decoration: none;
  border: 1px solid rgba(184, 145, 91, 0.18);
  background: rgba(11, 16, 20, 0.74);
  transition: border-color 160ms ease, background 160ms ease, transform 160ms ease;

  span {
    display: inline-flex;
    color: #b8915b;
    font-size: 0.68rem;
    font-weight: 950;
    letter-spacing: 0.08em;
  }

  strong {
    display: block;
    margin-top: 8px;
    color: #f4efe5;
    font-size: 0.86rem;
    line-height: 1.35;
    word-break: keep-all;
  }

  p {
    display: -webkit-box;
    margin-top: 8px;
    overflow: hidden;
    color: #a99e91;
    font-size: 0.74rem;
    font-weight: 720;
    line-height: 1.5;
    word-break: keep-all;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(184, 145, 91, 0.42);
    background: rgba(15, 22, 27, 0.88);
  }
`;

const PaperSectionBody = styled.div`
  min-width: 0;
  max-width: 82ch;
`;

const SectionNumber = styled.div`
  margin-bottom: 8px;
  color: #b8915b;
  font-size: 0.72rem;
  font-weight: 950;
  letter-spacing: 0.1em;
`;

const TakeawayPanel = styled.aside`
  align-self: start;
  min-width: 0;
  padding: 13px;
  border: 1px solid rgba(244, 239, 229, 0.08);
  border-left: 3px solid ${props => props.$color};
  background:
    linear-gradient(180deg, ${props => props.$color}12 0%, rgba(11, 16, 20, 0.74) 72%),
    rgba(11, 16, 20, 0.82);

  @media (max-width: 900px) {
    padding: 12px;
  }
`;

const TakeawayLabel = styled.div`
  color: #b8915b;
  font-size: 0.72rem;
  font-weight: 950;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const TakeawayList = styled.ul`
  display: grid;
  gap: 9px;
  margin: 10px 0 0;
  padding: 0;
  list-style: none;

  li {
    position: relative;
    padding-left: 13px;
    color: #efe4d4;
    font-size: 0.82rem;
    font-weight: 760;
    line-height: 1.58;
    word-break: keep-all;
  }

  li::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.72em;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #b8915b;
  }
`;

const InlineChartFigure = styled.figure`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  margin: 4px 0 8px;
  padding: clamp(12px, 2vw, 16px);
  border: 1px solid rgba(184, 145, 91, 0.2);
  background: #0b1014;
`;

const InlineChartHead = styled.figcaption`
  display: grid;
  gap: 5px;
  width: 100%;
  min-width: 0;
  max-width: 100%;

  strong {
    color: #f4efe5;
    font-size: 0.92rem;
    font-weight: 950;
    min-width: 0;
    overflow-wrap: anywhere;
  }

  span {
    min-width: 0;
    color: #b9ad9d;
    font-size: 0.8rem;
    font-weight: 760;
    line-height: 1.55;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }
`;

const ChartDefinitionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

const ChartDefinitionItem = styled.div`
  min-width: 0;
  padding: 10px;
  border: 1px solid rgba(244, 239, 229, 0.08);
  background: rgba(8, 13, 17, 0.76);

  span {
    display: block;
    color: #b8915b;
    font-size: 0.68rem;
    font-weight: 950;
  }

  strong {
    display: block;
    margin-top: 6px;
    color: #d8cbb7;
    font-size: 0.78rem;
    font-weight: 760;
    line-height: 1.55;
    word-break: keep-all;
  }
`;

const FieldGuideGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin: 14px 0 16px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const FieldGuideCard = styled.div`
  min-width: 0;
  grid-column: ${props => props.$wide === 'full' ? '1 / -1' : props.$wide ? 'span 2' : 'auto'};
  border: 1px solid rgba(184, 145, 91, 0.24);
  border-top: 3px solid ${props => props.$color || 'rgba(184, 145, 91, 0.72)'};
  background:
    linear-gradient(180deg, rgba(244, 239, 229, 0.035), rgba(8, 13, 17, 0.18)),
    #0d1216;

  @media (max-width: 980px) {
    grid-column: auto;
  }
`;

const OpenerFlowCard = styled(FieldGuideCard)`
  grid-column: 1 / -1;
  margin: 14px 0 16px;
  overflow: hidden;
  container-type: inline-size;
  width: 100%;
  border-top-width: 4px;
  box-shadow:
    inset 0 1px 0 rgba(244, 239, 229, 0.06),
    0 18px 34px rgba(0, 0, 0, 0.18);
`;

const OpenerFlowIntro = styled.div`
  display: grid;
  gap: 6px;
  padding: 13px 16px;
  border-bottom: 1px solid rgba(244, 239, 229, 0.08);
  background:
    linear-gradient(90deg, rgba(184, 145, 91, 0.1), rgba(184, 145, 91, 0)),
    rgba(8, 13, 17, 0.48);

  strong {
    color: #f4efe5;
    font-size: 0.96rem;
    font-weight: 950;
    line-height: 1.35;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }

  p {
    margin: 0;
    color: #d8cbb7;
    font-size: 0.82rem;
    font-weight: 760;
    line-height: 1.62;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }
`;

const FieldGuideCardHead = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 13px;
  border-bottom: 1px solid rgba(244, 239, 229, 0.08);
  color: #f4efe5;

  svg {
    color: #b8915b;
    flex: 0 0 auto;
  }

  strong {
    font-size: 0.92rem;
    font-weight: 950;
    letter-spacing: 0;
  }
`;

const FieldGuideList = styled.ul`
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 13px;
  list-style: none;

  li {
    min-width: 0;
  }

  span {
    display: block;
    color: #b8915b;
    font-size: 0.7rem;
    font-weight: 950;
  }

  p {
    margin-top: 4px;
    color: #efe4d4;
    font-size: 0.82rem;
    font-weight: 760;
    line-height: 1.58;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }
`;

const OpenerFlowViewport = styled.div`
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  border-top: 1px solid rgba(244, 239, 229, 0.07);
  background: rgba(8, 13, 17, 0.46);
`;

const OpenerFlowMapHeader = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
  padding: 10px 16px 0;
  color: #d8cbb7;
  font-size: 0.68rem;
  font-weight: 950;
  letter-spacing: 0;

  span {
    display: inline-flex;
    align-items: center;
    min-height: 22px;
    padding: 3px 7px;
    border: 1px solid rgba(184, 145, 91, 0.28);
    background: rgba(184, 145, 91, 0.08);
    color: #d9b97a;
  }

  strong {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-width: 0;
    color: #efe4d4;
    font-size: 0.78rem;
    font-weight: 950;
    line-height: 1.35;
    text-align: center;
    word-break: keep-all;
    overflow-wrap: anywhere;

    &::before,
    &::after {
      content: '';
      flex: 1 1 28px;
      min-width: 18px;
      max-width: 80px;
      height: 1px;
      background: linear-gradient(90deg, rgba(184, 145, 91, 0.08), rgba(184, 145, 91, 0.68));
    }

    &::after {
      background: linear-gradient(90deg, rgba(184, 145, 91, 0.68), rgba(184, 145, 91, 0.08));
    }
  }

  @media (max-width: 560px) {
    grid-template-columns: auto minmax(0, 1fr);

    span:last-child {
      display: none;
    }

    strong {
      display: block;
      text-align: left;

      &::before,
      &::after {
        display: none;
      }
    }
  }
`;

const OpenerFlowKey = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  padding: 11px 16px 0;
  color: #c7bba7;

  span {
    display: inline-flex;
    align-items: center;
    min-height: 24px;
    padding: 4px 9px;
    border: 1px solid rgba(244, 239, 229, 0.08);
    background: rgba(244, 239, 229, 0.045);
    font-size: 0.68rem;
    font-weight: 950;
    line-height: 1.2;
    word-break: keep-all;
  }

  span:first-child {
    border-color: rgba(184, 145, 91, 0.45);
    color: #f4efe5;
    background: rgba(184, 145, 91, 0.12);
  }

  @media (max-width: 560px) {
    padding-inline: 12px;
  }
`;

const OpenerFlowPhaseLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 10px 16px 2px;
  color: #d9b97a;

  span {
    display: inline-flex;
    align-items: center;
    min-height: 22px;
    padding: 3px 8px;
    border: 1px solid rgba(184, 145, 91, 0.26);
    border-radius: 999px;
    background: rgba(184, 145, 91, 0.075);
    font-size: 0.68rem;
    font-weight: 950;
    line-height: 1.2;
    white-space: nowrap;
  }
`;

const OpenerFlowList = styled.ol`
  --flow-color: ${props => props.$color || '#b8915b'};
  --flow-soft: ${props => `${props.$color || '#b8915b'}22`};
  --flow-line: ${props => `${props.$color || '#b8915b'}70`};
  position: relative;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: clamp(178px, 17cqw, 224px);
  align-items: start;
  gap: 24px;
  margin: 0;
  padding: 24px 22px 24px;
  list-style: none;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x proximity;
  scroll-padding-inline: 20px;
  scrollbar-width: thin;
  scrollbar-color: rgba(184, 145, 91, 0.72) rgba(244, 239, 229, 0.08);
  background:
    linear-gradient(90deg, rgba(184, 145, 91, 0.08) 0 1px, transparent 1px 100%) 0 0 / 44px 44px,
    linear-gradient(180deg, rgba(184, 145, 91, 0.06) 0 1px, transparent 1px 100%) 0 0 / 44px 44px,
    linear-gradient(135deg, rgba(8, 13, 17, 0.96), rgba(11, 18, 23, 0.86));

  &::before {
    content: '';
    position: absolute;
    top: 57px;
    left: 58px;
    right: 58px;
    height: 3px;
    background:
      linear-gradient(90deg, rgba(184, 145, 91, 0.08), var(--flow-line), rgba(184, 145, 91, 0.12));
    box-shadow: 0 0 14px rgba(184, 145, 91, 0.18);
    pointer-events: none;
  }

  li {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-rows: 74px minmax(0, 1fr);
    justify-items: center;
    gap: 13px;
    min-width: 0;
    min-height: 206px;
    padding: 0;
    border: 0;
    background: transparent;
    box-shadow: none;
    scroll-snap-align: start;
    overflow: visible;
  }

  li::before {
    content: '';
    position: absolute;
    z-index: 2;
    top: 56px;
    left: calc(50% + 35px);
    width: calc(50% + 24px);
    height: 3px;
    background: linear-gradient(90deg, var(--flow-line), rgba(184, 145, 91, 0.14));
    pointer-events: none;
  }

  li:last-child::before {
    display: none;
  }

  li:not(:last-child)::after {
    content: '';
    position: absolute;
    z-index: 2;
    top: 50px;
    right: -18px;
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-left: 10px solid var(--flow-line);
  }

  @media (max-width: 640px) {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-flow: row;
    grid-auto-columns: auto;
    gap: 12px;
    overflow: visible;
    padding: 12px;

    &::before {
      display: none;
    }

    li {
      display: grid;
      grid-template-columns: 58px minmax(0, 1fr);
      column-gap: 12px;
      min-height: 0;
      padding: 0;
      align-items: start;
      justify-items: stretch;
      overflow: visible;
    }

    li::before {
      left: 28px;
      right: auto;
      top: 58px;
      bottom: -14px;
      width: 2px;
      height: auto;
      background: linear-gradient(180deg, var(--flow-color), rgba(184, 145, 91, 0.08));
    }

    li:not(:last-child)::after {
      content: '';
      top: auto;
      right: auto;
      left: 21px;
      bottom: 4px;
      width: 14px;
      height: 14px;
      border-style: solid;
      border-width: 0 2px 2px 0;
      border-color: var(--flow-color);
      background: transparent;
      transform: rotate(45deg);
    }

    li:last-child::before {
      display: none;
    }
  }

  @container (max-width: 640px) {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-flow: row;
    grid-auto-columns: auto;
    gap: 12px;
    overflow: visible;
    padding: 12px;

    &::before {
      display: none;
    }

    li {
      display: grid;
      grid-template-columns: 58px minmax(0, 1fr);
      column-gap: 12px;
      min-height: 0;
      padding: 0;
      align-items: start;
      justify-items: stretch;
      overflow: visible;
    }

    li::before {
      left: 28px;
      right: auto;
      top: 58px;
      bottom: -14px;
      width: 2px;
      height: auto;
      background: linear-gradient(180deg, var(--flow-color), rgba(184, 145, 91, 0.08));
    }

    li:not(:last-child)::after {
      content: '';
      top: auto;
      right: auto;
      left: 21px;
      bottom: 4px;
      width: 14px;
      height: 14px;
      border-style: solid;
      border-width: 0 2px 2px 0;
      border-color: var(--flow-color);
      background: transparent;
      transform: rotate(45deg);
    }

    li:last-child::before {
      display: none;
    }
  }
`;

const OpenerPhase = styled.div`
  position: relative;
  z-index: 1;
  width: fit-content;
  max-width: 100%;
  padding: 3px 6px;
  border: 1px solid rgba(184, 145, 91, 0.28);
  color: #dcb879;
  background: rgba(184, 145, 91, 0.09);
  font-size: 0.64rem;
  font-weight: 950;
  line-height: 1.1;
  word-break: keep-all;

  @media (max-width: 560px) {
    font-size: 0.62rem;
  }
`;

const OpenerStepTop = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  align-self: start;
  width: 72px;
  height: 72px;
  border: 1px solid rgba(244, 239, 229, 0.14);
  border-radius: 50%;
  background:
    radial-gradient(circle at 50% 48%, rgba(244, 239, 229, 0.1), rgba(8, 13, 17, 0.88) 62%),
    linear-gradient(180deg, rgba(184, 145, 91, 0.22), rgba(8, 13, 17, 0.78));
  box-shadow:
    0 0 0 5px rgba(8, 13, 17, 0.9),
    0 0 0 6px rgba(184, 145, 91, 0.16),
    0 16px 28px rgba(0, 0, 0, 0.28);
  isolation: isolate;

  &::before {
    content: '';
    position: absolute;
    inset: 8px;
    border: 1px solid rgba(244, 239, 229, 0.12);
    border-radius: 50%;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    inset: -11px;
    border: 1px solid rgba(184, 145, 91, 0.08);
    border-radius: 50%;
    pointer-events: none;
  }

  > a,
  > span[aria-hidden='true'] {
    position: relative;
    z-index: 1;
    border-radius: 12px;
    overflow: hidden;
    box-shadow:
      0 0 0 1px rgba(8, 13, 17, 0.96),
      0 0 16px rgba(184, 145, 91, 0.18);
  }

  img {
    border-radius: 11px;
  }

  > span[aria-hidden='true'] {
    display: inline-grid;
    place-items: center;
  }

  @media (max-width: 560px) {
    grid-row: 1 / span 2;
    align-self: start;
    width: 54px;
    height: 54px;
    box-shadow:
      0 0 0 4px rgba(8, 13, 17, 0.9),
      0 0 0 5px rgba(184, 145, 91, 0.14);

    &::before {
      inset: 6px;
    }

    &::after {
      inset: -8px;
    }

    > a,
    > span[aria-hidden='true'] {
      width: 34px;
      height: 34px;
      border-radius: 9px;
    }

    img {
      border-radius: 8px;
    }
  }
`;

const OpenerStepBody = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  gap: 7px;
  width: 100%;
  min-width: 0;
  padding: 11px;
  border: 1px solid rgba(244, 239, 229, 0.11);
  border-top-color: rgba(184, 145, 91, 0.32);
  border-radius: 6px;
  background:
    linear-gradient(180deg, var(--flow-soft), rgba(8, 13, 17, 0.08)),
    rgba(8, 13, 17, 0.9);
  box-shadow:
    inset 0 1px 0 rgba(244, 239, 229, 0.05),
    0 12px 24px rgba(0, 0, 0, 0.16);

  &::before {
    content: '';
    position: absolute;
    top: -13px;
    left: 50%;
    width: 1px;
    height: 13px;
    background: linear-gradient(180deg, var(--flow-line), rgba(184, 145, 91, 0.12));
  }

  strong {
    display: block;
    color: #f4efe5;
    font-size: 0.86rem;
    font-weight: 950;
    line-height: 1.32;
    word-break: keep-all;
    overflow-wrap: break-word;
    text-wrap: pretty;
  }

  p {
    display: -webkit-box;
    margin: 0;
    overflow: hidden;
    color: #b8c2c8;
    font-size: 0.72rem;
    font-weight: 760;
    line-height: 1.5;
    word-break: keep-all;
    overflow-wrap: break-word;
    text-wrap: pretty;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  @media (max-width: 560px) {
    grid-column: 2;
    grid-row: 1 / span 2;
    padding: 10px;

    &::before {
      top: 26px;
      left: -12px;
      width: 12px;
      height: 1px;
      background: linear-gradient(90deg, var(--flow-line), rgba(184, 145, 91, 0.12));
    }

    p {
      -webkit-line-clamp: 4;
    }
  }
`;

const OpenerTrigger = styled.span`
  display: inline-flex;
  width: fit-content;
  max-width: 100%;
  padding: 4px 7px;
  border: 1px solid rgba(244, 239, 229, 0.1);
  border-left-color: rgba(184, 145, 91, 0.42);
  background: rgba(244, 239, 229, 0.045);
  color: #d9b97a;
  font-size: 0.66rem;
  font-weight: 950;
  line-height: 1.25;
  word-break: keep-all;
  overflow-wrap: anywhere;
`;

const OpenerStepNumber = styled.span`
  position: absolute;
  z-index: 2;
  top: -8px;
  left: -8px;
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border: 1px solid rgba(184, 145, 91, 0.42);
  color: #f4efe5;
  background: rgba(184, 145, 91, 0.14);
  font-size: 0.68rem;
  font-weight: 950;

  @media (max-width: 560px) {
    top: -6px;
    left: -6px;
    width: 22px;
    height: 22px;
    font-size: 0.62rem;
  }
`;

const TipList = styled.ul`
  display: grid;
  gap: 9px;
  margin: 0;
  padding: 13px 13px 13px 28px;

  li {
    color: #efe4d4;
    font-size: 0.82rem;
    font-weight: 780;
    line-height: 1.58;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }

  li::marker {
    color: #b8915b;
  }
`;

const ManuscriptPanel = styled.div`
  min-width: 0;
  padding: 15px;
  border: 1px solid rgba(184, 145, 91, 0.22);
  background: #0d1216;

  h3 {
    color: #f4efe5;
    font-size: 0.98rem;
  }

  p {
    margin-top: 10px;
    color: #d8cbb7;
    font-size: 0.84rem;
    font-weight: 760;
    line-height: 1.7;
    word-break: keep-all;
  }
`;

const ManuscriptList = styled.ul`
  display: grid;
  gap: 8px;
  margin: 12px 0 0;
  padding-left: 18px;
  color: #c7bba7;
  font-size: 0.8rem;
  font-weight: 760;
  line-height: 1.6;
  word-break: keep-all;
`;

const EvidenceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 12px;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

const EvidencePanel = styled(ManuscriptPanel)`
  h3 {
    color: #b8915b;
  }
`;

const RotationFeature = styled.div`
  border: 1px solid rgba(184, 145, 91, 0.26);
  border-left: 3px solid ${props => props.$color};
  background: #0d1216;
`;

const RotationHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 240px;
  gap: 14px;
  padding: 16px;
  border-bottom: 1px solid rgba(184, 145, 91, 0.18);

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const RotationTitle = styled.h3`
  color: #f4efe5;
  font-size: 1.22rem;
`;

const RotationFlowSubtitle = styled.div`
  width: fit-content;
  max-width: 100%;
  margin-top: 8px;
  padding: 5px 8px;
  border: 1px solid rgba(184, 145, 91, 0.24);
  background: rgba(184, 145, 91, 0.08);
  color: #d9b97a;
  font-size: 0.78rem;
  font-weight: 950;
  line-height: 1.35;
  word-break: keep-all;
  overflow-wrap: anywhere;
`;

const RotationLead = styled.p`
  margin-top: 7px;
  color: #c7bba7;
  font-size: 0.88rem;
  font-weight: 750;
  word-break: keep-all;
`;

const RotationStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
`;

const RotationStat = styled.div`
  padding: 10px;
  border: 1px solid rgba(244, 239, 229, 0.08);
  background: #080d11;

  span {
    display: block;
    color: #8d9aa3;
    font-size: 0.68rem;
    font-weight: 900;
  }

  strong {
    display: block;
    margin-top: 5px;
    color: #f4efe5;
    font-size: 0.9rem;
  }
`;

const RotationFlowWrap = styled.div`
  min-width: 0;
  max-width: 100%;
  padding: 0 0 2px;
  container-type: inline-size;

  ${OpenerFlowList} {
    border-top: 1px solid rgba(244, 239, 229, 0.08);
  }
`;

const RotationCaption = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  padding: 0 14px 16px;
  color: #d8cbb7;
  font-size: 0.82rem;
  font-weight: 900;
  text-align: center;
`;

const PriorityPanel = styled.div`
  margin-top: 14px;
  border: 1px solid rgba(184, 145, 91, 0.26);
  background: #0d1216;
`;

const PriorityPanelTitle = styled.h3`
  padding: 12px 14px;
  color: #f4efe5;
  font-size: 1rem;
  border-bottom: 1px solid rgba(244, 239, 229, 0.08);
`;

const priorityGlow = rank => Math.max(0.04, 0.24 - rank * 0.028);
const priorityLine = rank => Math.max(0.16, 0.78 - rank * 0.075);

const PriorityRow = styled.div`
  display: grid;
  grid-template-columns: 30px 32px minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  min-height: 58px;
  padding: 10px 14px;
  border-bottom: 1px solid rgba(244, 239, 229, 0.07);
  background:
    linear-gradient(
      90deg,
      rgba(120, 168, 90, ${props => priorityGlow(props.$rank)}) 0%,
      rgba(184, 145, 91, ${props => Math.max(0.03, priorityGlow(props.$rank) - 0.08)}) 42%,
      rgba(13, 18, 22, 0) 100%
    );

  &:before {
    content: '';
    width: 4px;
    height: 32px;
    grid-column: 1;
    grid-row: 1;
    justify-self: start;
    border-radius: 999px;
    background:
      linear-gradient(
        180deg,
        rgba(120, 168, 90, ${props => priorityLine(props.$rank)}) 0%,
        rgba(184, 145, 91, ${props => Math.max(0.12, priorityLine(props.$rank) - 0.22)}) 100%
      );
  }

  &:last-child {
    border-bottom: 0;
  }
`;

const PriorityRank = styled.div`
  grid-column: 1;
  grid-row: 1;
  justify-self: end;
  color: #f4efe5;
  font-size: 0.8rem;
  font-weight: 900;
`;

const PriorityText = styled.div`
  min-width: 0;
  color: #f4efe5;

  strong {
    display: block;
    font-size: 0.9rem;
    overflow-wrap: anywhere;
  }

  span {
    display: block;
    margin-top: 3px;
    color: #c7bba7;
    font-size: 0.76rem;
    font-weight: 750;
    word-break: keep-all;
  }
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const ChartPanel = styled.div`
  min-width: 0;
  border: 1px solid rgba(184, 145, 91, 0.24);
  background: #0d1216;
`;

const ChartHeader = styled.div`
  padding: 12px 14px;
  border-bottom: 1px solid rgba(244, 239, 229, 0.08);
`;

const ChartTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #f4efe5;
  font-size: 0.98rem;
`;

const ChartMeta = styled.div`
  margin-top: 5px;
  color: #8d9aa3;
  font-size: 0.72rem;
  font-weight: 850;
`;

const IconAnchor = styled.a`
  flex: 0 0 auto;
  display: inline-grid;
  place-items: center;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  border: 1px solid rgba(244, 239, 229, 0.16);
  background: #080d11;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  > span {
    display: none !important;
  }
`;

const IconPlaceholder = styled.span`
  flex: 0 0 auto;
  display: inline-block;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  border: 1px solid rgba(244, 239, 229, 0.12);
  background: rgba(244, 239, 229, 0.05);
`;

const InlineSkillAnchor = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
  margin: 0 1px;
  color: #ffd166;
  font-weight: 900;
  line-height: 1.25;
  text-decoration: none;
  vertical-align: -0.18em;
  white-space: nowrap;
  word-break: keep-all;
  overflow-wrap: normal;
  border-bottom: 1px solid rgba(255, 209, 102, 0.42);

  img {
    flex: 0 0 auto;
    width: 1.05em;
    height: 1.05em;
    object-fit: cover;
    border: 1px solid rgba(255, 209, 102, 0.38);
    border-radius: 3px;
    box-shadow: 0 0 0 1px rgba(8, 13, 17, 0.9);
  }

  &:hover {
    color: #fff1b8;
    border-bottom-color: rgba(255, 241, 184, 0.84);
  }
`;

const InlineSkillText = styled.em`
  display: inline-block;
  min-width: 0;
  font-style: normal;
  white-space: nowrap;
  word-break: keep-all;
  overflow-wrap: normal;
`;

const InlineSkillIconFallback = styled.span`
  flex: 0 0 auto;
  width: 1.05em;
  height: 1.05em;
  border: 1px solid rgba(255, 209, 102, 0.38);
  border-radius: 3px;
  background: rgba(255, 209, 102, 0.18);
`;

const LaneChart = styled.div`
  display: grid;
  gap: 10px;
  padding: 14px;
`;

const Lane = styled.div`
  display: grid;
  grid-template-columns: minmax(120px, 180px) minmax(0, 1fr);
  gap: 10px;
  align-items: center;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const LaneLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  color: #f4efe5;
  font-size: 0.78rem;
  font-weight: 900;

  span {
    min-width: 0;
    overflow-wrap: anywhere;
  }
`;

const LaneTrack = styled.div`
  position: relative;
  height: 28px;
  background: rgba(244, 239, 229, 0.07);
  overflow: hidden;
`;

const LaneBar = styled.div`
  position: absolute;
  left: ${props => props.$start}%;
  top: 6px;
  width: min(${props => props.$width}%, calc(100% - ${props => props.$start}%));
  height: 16px;
  background: linear-gradient(90deg, ${props => props.$color}, #b8915b);
`;

const AxisLabels = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: #8d9aa3;
  font-size: 0.68rem;
  font-weight: 850;
`;

const ResourceChart = styled.div`
  display: grid;
  gap: 12px;
  padding: 14px;
`;

const CurveSvg = styled.svg`
  width: 100%;
  height: auto;
  min-height: 120px;
  background: #080d11;
  border: 1px solid rgba(244, 239, 229, 0.08);
`;

const MeterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const MeterBox = styled.div`
  padding: 10px;
  border: 1px solid rgba(244, 239, 229, 0.08);
  background: #080d11;

  span {
    color: #8d9aa3;
    font-size: 0.68rem;
    font-weight: 900;
  }

  strong {
    display: block;
    margin-top: 5px;
    color: #f4efe5;
    font-size: 0.9rem;
    overflow-wrap: anywhere;
  }
`;

const DefensiveList = styled.div`
  display: grid;
  gap: 8px;
  padding: 14px;
`;

const DefensiveRow = styled.div`
  display: grid;
  grid-template-columns: 110px minmax(0, 1fr) 86px;
  gap: 10px;
  align-items: center;
  min-height: 48px;
  padding: 9px;
  border: 1px solid rgba(244, 239, 229, 0.08);
  background: #080d11;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const EventTime = styled.div`
  color: #b8915b;
  font-size: 0.74rem;
  font-weight: 900;
`;

const EventName = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  color: #f4efe5;
  font-size: 0.82rem;
  font-weight: 900;

  span {
    overflow-wrap: anywhere;
  }
`;

const EventAction = styled.div`
  color: #c7bba7;
  font-size: 0.72rem;
  font-weight: 850;
`;

const UptimeChart = styled.div`
  display: grid;
  gap: 10px;
  padding: 14px;
`;

const UptimeLane = styled.div`
  display: grid;
  grid-template-columns: minmax(128px, 178px) minmax(0, 1fr) minmax(170px, 250px);
  gap: 10px;
  align-items: center;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const SegmentTrack = styled.div`
  position: relative;
  height: 26px;
  background: rgba(244, 239, 229, 0.07);
  overflow: hidden;
`;

const Segment = styled.div`
  position: absolute;
  left: ${props => props.$left}%;
  width: ${props => props.$width}%;
  top: 5px;
  height: 16px;
  background: ${props => props.$color};
`;

const UptimeNote = styled.div`
  min-width: 0;

  span {
    display: block;
    color: #b8915b;
    font-size: 0.68rem;
    font-weight: 950;
  }

  strong {
    display: block;
    margin-top: 4px;
    color: #c7bba7;
    font-size: 0.76rem;
    font-weight: 760;
    line-height: 1.45;
    word-break: keep-all;
  }
`;

const ChartDataFootnote = styled.div`
  padding-top: 8px;
  color: #8d9aa3;
  border-top: 1px solid rgba(244, 239, 229, 0.08);
  font-size: 0.72rem;
  font-weight: 820;
  line-height: 1.5;
  word-break: keep-all;
`;

const BarChart = styled.div`
  display: grid;
  gap: 10px;
  padding: 14px;
`;

const TargetBar = styled.div`
  display: grid;
  grid-template-columns: 116px minmax(0, 1fr) 34px;
  gap: 10px;
  align-items: center;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const BarLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  color: #f4efe5;
  font-size: 0.78rem;
  font-weight: 900;
`;

const BarTrack = styled.div`
  height: 24px;
  background: rgba(244, 239, 229, 0.07);
`;

const BarFill = styled.div`
  width: ${props => props.$value}%;
  height: 100%;
  background: linear-gradient(90deg, ${props => props.$color}, rgba(244, 239, 229, 0.4));
`;

const BarValue = styled.div`
  color: #c7bba7;
  font-size: 0.78rem;
  font-weight: 900;
`;

const NetworkMap = styled.div`
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr);
  gap: 12px;
  padding: 14px;

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

const NetworkCenter = styled.div`
  display: grid;
  place-items: center;
  min-height: 140px;
  padding: 12px;
  text-align: center;
  border: 1px solid ${props => props.$color};
  background: rgba(244, 239, 229, 0.04);

  span {
    color: #b8915b;
    font-size: 0.74rem;
    font-weight: 900;
  }

  strong {
    color: #f4efe5;
    font-size: 1rem;
  }
`;

const NetworkNodes = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 8px;
`;

const NetworkNode = styled.div`
  min-height: 66px;
  padding: 10px;
  border: 1px solid rgba(184, 145, 91, 0.22);
  border-left: 3px solid ${props => props.$color};
  background: #080d11;

  span {
    display: block;
    color: #8d9aa3;
    font-size: 0.66rem;
    font-weight: 900;
  }

  strong {
    display: block;
    margin-top: 5px;
    color: #f4efe5;
    font-size: 0.78rem;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }
`;

const SynergyGraphPanel = styled.div`
  display: grid;
  gap: 12px;
  min-width: 0;
  padding: clamp(12px, 2vw, 16px);
  border: 1px solid rgba(184, 145, 91, 0.22);
  background:
    linear-gradient(180deg, rgba(244, 239, 229, 0.035), rgba(8, 13, 17, 0.9)),
    #0b1014;
`;

const SynergyGraphIntro = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;

  strong {
    display: block;
    color: #f4efe5;
    font-size: 0.95rem;
    font-weight: 950;
  }

  span {
    display: block;
    margin-top: 5px;
    color: #a99e91;
    font-size: 0.78rem;
    font-weight: 760;
    line-height: 1.5;
    word-break: keep-all;
  }

  @media (max-width: 760px) {
    display: grid;
  }
`;

const SynergyGraphLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 6px;

  span {
    margin: 0;
    padding: 6px 8px;
    color: #d8cbb7;
    border: 1px solid rgba(244, 239, 229, 0.08);
    background: rgba(8, 13, 17, 0.78);
    font-size: 0.68rem;
    font-weight: 900;
  }

  @media (max-width: 760px) {
    justify-content: flex-start;
  }
`;

const SynergyGraphStats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 14px 0 12px;

  span {
    padding: 7px 9px;
    color: #aeb8bd;
    border: 1px solid rgba(244, 239, 229, 0.08);
    background: rgba(8, 13, 17, 0.72);
    font-size: 0.72rem;
    font-weight: 850;
  }

  b {
    color: #f4efe5;
    font-weight: 950;
  }
`;

const SynergyGraphCanvas = styled.div`
  position: relative;
  min-height: 560px;
  overflow: hidden;
  border: 1px solid rgba(244, 239, 229, 0.08);
  background:
    linear-gradient(rgba(244, 239, 229, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(244, 239, 229, 0.035) 1px, transparent 1px),
    radial-gradient(circle at center, rgba(184, 145, 91, 0.13), transparent 58%),
    #080d11;
  background-size: 42px 42px, 42px 42px, auto, auto;

  @media (max-width: 760px) {
    min-height: 620px;
  }

  @media (max-width: 520px) {
    min-height: 360px;
    overflow: hidden;
    background:
      radial-gradient(circle at top, rgba(184, 145, 91, 0.12), transparent 52%),
      #080d11;
  }
`;

const SynergyGraphSvg = styled.svg`
  display: block;
  width: 100%;
  height: 100%;
  min-height: inherit;

  .graph-orbits ellipse {
    fill: none;
    stroke: rgba(244, 239, 229, 0.07);
    stroke-width: 1;
    stroke-dasharray: 7 10;
  }

  .graph-edge {
    stroke: rgba(169, 158, 145, 0.36);
    stroke-linecap: round;
  }

  .graph-edge-center {
    stroke: ${props => props.$color};
    opacity: 0.82;
  }

  .graph-node {
    transition: opacity 160ms ease, filter 160ms ease, transform 160ms ease;
  }

  .graph-synergy-node .node-glow {
    fill: rgba(184, 145, 91, 0.12);
  }

  .graph-synergy-node .node-body {
    fill: rgba(184, 145, 91, 0.82);
    stroke: rgba(244, 239, 229, 0.55);
    stroke-width: 1.2;
  }

  .graph-synergy-node .node-core {
    fill: #080d11;
    opacity: 0.72;
  }

  .graph-skill-node .skill-halo {
    fill: ${props => props.$color}22;
  }

  .graph-skill-node .skill-frame {
    fill: rgba(8, 13, 17, 0.95);
    stroke: ${props => props.$color};
    stroke-width: 2;
  }

  .graph-kind-talent .skill-halo {
    fill: rgba(77, 163, 255, 0.18);
  }

  .graph-kind-talent .skill-frame {
    stroke: #4da3ff;
  }

  .graph-kind-hero .skill-halo {
    fill: rgba(64, 214, 184, 0.18);
  }

  .graph-kind-hero .skill-frame {
    stroke: #40d6b8;
  }

  .graph-kind-passive .skill-halo {
    fill: rgba(216, 203, 183, 0.14);
  }

  .graph-kind-passive .skill-frame {
    stroke: #d8cbb7;
  }

  .graph-skill-node .skill-fallback {
    fill: ${props => props.$color}55;
  }

  .graph-skills a:hover .graph-skill-node,
  .graph-skills a:focus .graph-skill-node {
    filter: drop-shadow(0 0 14px ${props => props.$color}88);
  }

  .graph-label {
    pointer-events: none;
    paint-order: stroke;
    stroke: rgba(8, 13, 17, 0.94);
    stroke-width: 4px;
    stroke-linejoin: round;
    fill: #f4efe5;
    font-weight: 900;
  }

  .synergy-label {
    fill: #d8cbb7;
    font-size: 12px;
  }

  .skill-label {
    fill: #f4efe5;
    font-size: 12px;
  }

  .kind-label {
    fill: #8d9aa3;
    font-size: 10px;
  }

  .graph-secondary {
    opacity: 0.76;
  }

  .graph-center-node .center-outer {
    fill: url(#synergy-graph-center-glow);
  }

  .graph-center-node .center-glow {
    fill: ${props => props.$color}26;
    stroke: ${props => props.$color}66;
    stroke-width: 1.5;
  }

  .graph-center-node .center-frame {
    fill: rgba(8, 13, 17, 0.96);
    stroke: ${props => props.$color};
    stroke-width: 3;
  }

  .center-kicker,
  .center-name,
  .center-meta,
  .graph-corner-note text {
    pointer-events: none;
    paint-order: stroke;
    stroke: rgba(8, 13, 17, 0.95);
    stroke-width: 5px;
    stroke-linejoin: round;
    font-weight: 950;
  }

  .center-kicker {
    fill: #b8915b;
    font-size: 14px;
  }

  .center-name {
    fill: #f4efe5;
    font-size: 18px;
  }

  .center-meta {
    fill: #aeb8bd;
    font-size: 12px;
  }

  .graph-corner-note text {
    fill: rgba(174, 184, 189, 0.46);
    font-size: 11px;
    letter-spacing: 0;
  }

  @media (max-width: 760px) {
    .graph-secondary .graph-label,
    .graph-secondary.skill-label {
      display: none;
    }

    .synergy-label,
    .skill-label {
      font-size: 13px;
    }

    .kind-label {
      display: none;
    }
  }

  @media (max-width: 520px) {
    width: 100%;
    max-width: 100%;
    height: 360px;
    min-height: 360px;

    .graph-secondary {
      opacity: 0.42;
    }

    .graph-secondary .graph-label,
    .synergy-label {
      display: none;
    }

    .graph-edge:not(.graph-edge-center) {
      opacity: 0.42;
    }

    .graph-corner-note {
      display: none;
    }

    .center-name {
      font-size: 20px;
    }
  }
`;

const SynergyRelationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 12px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const SynergyRelationCard = styled.article`
  display: grid;
  gap: 12px;
  padding: 13px;
  border: 1px solid rgba(244, 239, 229, 0.09);
  background:
    linear-gradient(135deg, ${props => props.$color}12, transparent 44%),
    rgba(8, 13, 17, 0.88);
`;

const RelationCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;

  span {
    display: block;
    color: #b8915b;
    font-size: 0.68rem;
    font-weight: 950;
  }

  strong {
    display: block;
    margin-top: 3px;
    color: #f4efe5;
    font-size: 0.92rem;
    font-weight: 950;
    line-height: 1.25;
  }

  b {
    flex: 0 0 auto;
    align-self: start;
    padding: 5px 7px;
    color: #080d11;
    background: #d8cbb7;
    font-size: 0.68rem;
    font-weight: 950;
  }
`;

const RelationFlow = styled.div`
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
  overflow-x: visible;
  padding-bottom: 2px;

  @media (max-width: 520px) {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    overflow-x: visible;
    gap: 7px;
  }
`;

const RelationArrow = styled.span`
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  color: #b8915b;
  font-size: 1rem;
  font-weight: 950;

  @media (max-width: 520px) {
    place-items: start;
    width: 100%;
    min-height: 16px;
    padding-left: 2px;
  }
`;

const RelationGroup = styled.div`
  display: grid;
  gap: 6px;
  flex: 1 1 120px;
  min-width: 0;

  em {
    color: #8d9aa3;
    font-size: 0.64rem;
    font-style: normal;
    font-weight: 950;
  }

  @media (max-width: 520px) {
    min-width: 0;
  }
`;

const RelationChipItem = styled.div`
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  grid-template-rows: auto auto;
  column-gap: 7px;
  align-items: center;
  min-width: 148px;
  padding: 7px;
  border: 1px solid ${props => {
    if (props.$tone === 'center') return 'rgba(244, 239, 229, 0.24)';
    if (props.$tone === 'talent') return 'rgba(77, 163, 255, 0.36)';
    if (props.$tone === 'hero') return 'rgba(64, 214, 184, 0.36)';
    return 'rgba(163, 48, 201, 0.34)';
  }};
  background: ${props => {
    if (props.$tone === 'center') return 'rgba(244, 239, 229, 0.08)';
    if (props.$tone === 'talent') return 'rgba(77, 163, 255, 0.1)';
    if (props.$tone === 'hero') return 'rgba(64, 214, 184, 0.1)';
    return 'rgba(163, 48, 201, 0.1)';
  }};
  width: 100%;

  a {
    grid-row: 1 / span 2;
  }

  span {
    overflow: visible;
    color: #f4efe5;
    font-size: 0.75rem;
    font-weight: 950;
    line-height: 1.2;
    overflow-wrap: anywhere;
    text-overflow: clip;
    white-space: normal;
  }

  small {
    color: #8d9aa3;
    font-size: 0.62rem;
    font-weight: 850;
  }

  @media (max-width: 520px) {
    width: 100%;
    min-width: 0;
  }
`;

const RelationExplain = styled.p`
  margin: 0;
  color: #cfc6b8;
  font-size: 0.78rem;
  font-weight: 750;
  line-height: 1.6;
`;

const SynergyGraphEdges = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.9;

  @media (max-width: 520px) {
    display: none;
  }
`;

const SynergyGraphCore = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 132px;
  height: 132px;
  padding: 14px;
  text-align: center;
  border-radius: 50%;
  border: 1px solid ${props => props.$color};
  background:
    radial-gradient(circle, ${props => props.$color}22 0%, rgba(8, 13, 17, 0.96) 70%),
    #080d11;
  box-shadow: 0 0 0 8px rgba(244, 239, 229, 0.03);
  transform: translate(-50%, -50%);

  span {
    color: #b8915b;
    font-size: 0.72rem;
    font-weight: 950;
  }

  a {
    margin: 5px 0 4px;
  }

  strong {
    display: block;
    max-width: 100%;
    overflow: hidden;
    color: #f4efe5;
    font-size: 0.92rem;
    font-weight: 950;
    line-height: 1.2;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  small {
    display: block;
    max-width: 100%;
    overflow: hidden;
    color: #8d9aa3;
    font-size: 0.68rem;
    font-weight: 850;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (max-width: 520px) {
    position: static;
    width: auto;
    height: auto;
    min-height: 76px;
    border-radius: 8px;
    transform: none;

    strong,
    small {
      white-space: normal;
    }
  }
`;

const SynergyGraphNode = styled.div`
  position: absolute;
  z-index: 3;
  display: grid;
  align-content: center;
  justify-items: center;
  box-sizing: border-box;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  padding: 12px;
  overflow: hidden;
  text-align: center;
  border-radius: 50%;
  border: 1px solid ${props => props.$color};
  background:
    radial-gradient(circle at 50% 28%, ${props => props.$color}22, transparent 58%),
    rgba(11, 16, 20, 0.95);
  box-shadow: 0 8px 24px rgba(0, 0, 0, ${props => Math.min(0.38, 0.16 + props.$weight / 60)});
  transform: translate(-50%, -50%);

  strong {
    display: -webkit-box;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    color: #f4efe5;
    font-size: clamp(0.68rem, 1vw, 0.82rem);
    font-weight: 950;
    line-height: 1.2;
    word-break: keep-all;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  > span {
    display: block;
    max-width: 100%;
    margin-top: 4px;
    overflow: hidden;
    color: #a99e91;
    font-size: 0.62rem;
    font-weight: 850;
    line-height: 1.25;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (max-width: 520px) {
    position: static;
    justify-items: start;
    width: auto;
    height: auto;
    min-height: 74px;
    padding: 11px;
    overflow: visible;
    text-align: left;
    border-radius: 8px;
    transform: none;

    > span {
      white-space: normal;
    }
  }
`;

const SynergyNodeScore = styled.div`
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  margin-bottom: 5px;
  color: #080d11;
  border-radius: 50%;
  background: #f4efe5;
  font-size: 0.72rem;
  font-weight: 950;
`;

const SynergyNodeIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: 3px;
  max-width: 100%;
  margin-top: 6px;
  overflow: hidden;

  @media (max-width: 520px) {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
`;

const SkillTable = styled.div`
  display: grid;
  border: 1px solid rgba(184, 145, 91, 0.2);
  background: #0d1216;
`;

const SkillRow = styled.div`
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) minmax(140px, 220px);
  gap: 12px;
  align-items: center;
  min-height: 64px;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(244, 239, 229, 0.07);

  &:last-child {
    border-bottom: 0;
  }

  @media (max-width: 640px) {
    grid-template-columns: 38px minmax(0, 1fr);
  }
`;

const SkillMain = styled.div`
  min-width: 0;
`;

const SkillName = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 100%;
  color: #f4efe5;
  font-size: 0.92rem;
  font-weight: 900;
  overflow-wrap: anywhere;
  text-decoration: none;

  img {
    flex: 0 0 auto;
    width: 1.15em;
    height: 1.15em;
    object-fit: cover;
    border: 1px solid rgba(255, 209, 102, 0.32);
    border-radius: 3px;
  }

  span {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  &:hover {
    color: #ffd166;
  }
`;

const SkillSub = styled.div`
  margin-top: 3px;
  color: #8d9aa3;
  font-size: 0.72rem;
  font-weight: 800;
`;

const SkillMeta = styled.div`
  color: #c7bba7;
  font-size: 0.76rem;
  font-weight: 850;
  overflow-wrap: anywhere;

  @media (max-width: 640px) {
    grid-column: 2;
  }
`;

const SynergyList = styled.div`
  display: grid;
  gap: 8px;
`;

const SynergyRow = styled.div`
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) minmax(90px, auto);
  gap: 10px;
  align-items: center;
  min-height: 58px;
  padding: 10px;
  border: 1px solid rgba(184, 145, 91, 0.2);
  background: #0d1216;

  @media (max-width: 620px) {
    grid-template-columns: 34px minmax(0, 1fr);
  }
`;

const SynergyScore = styled.div`
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  color: #080d11;
  background: #b8915b;
  font-size: 0.82rem;
  font-weight: 950;
`;

const SynergyBody = styled.div`
  min-width: 0;
`;

const SynergyName = styled.div`
  color: #f4efe5;
  font-size: 0.86rem;
  font-weight: 900;
  overflow-wrap: anywhere;
`;

const SynergyMeta = styled.div`
  margin-top: 3px;
  color: #8d9aa3;
  font-size: 0.7rem;
  font-weight: 850;
`;

const SynergyIcons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 4px;

  @media (max-width: 620px) {
    grid-column: 2;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
`;

const SourceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const SourceBox = styled.div`
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  gap: 10px;
  padding: 12px;
  border: 1px solid rgba(184, 145, 91, 0.2);
  background: #0d1216;
  color: inherit;
  text-decoration: none;

  &:hover {
    border-color: rgba(184, 145, 91, 0.48);
  }

  > span {
    display: none !important;
  }
`;

const SourceTier = styled.div`
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  color: #080d11;
  background: #f4efe5;
  font-size: 0.8rem;
  font-weight: 950;
`;

const SourceBody = styled.div`
  min-width: 0;

  strong {
    display: block;
    color: #f4efe5;
    font-size: 0.84rem;
    overflow-wrap: anywhere;
  }

  span {
    display: block;
    margin-top: 5px;
    color: #c7bba7;
    font-size: 0.74rem;
    font-weight: 750;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }
`;

const EmptyState = styled.div`
  display: grid;
  gap: 12px;
  place-items: start;
  padding: 32px;
  border: 1px solid rgba(184, 145, 91, 0.22);
  background: #0d1216;

  h1 {
    color: #f4efe5;
  }

  p {
    color: #c7bba7;
  }
`;

export default GuideDetailPage;
