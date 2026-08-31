import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
  Activity,
  ArrowLeft,
  BarChart3,
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
const TIP_PREVIEW_LIMIT = 4;
const HERO_BRANCH_DETAIL_LABELS = ['공통과 달라지는 첫 흐름', '선택 기준/콘텐츠', '분기별 주의점', '로그 검수 지표'];

const roleProfiles = {
  tanks: {
    label: '탱커',
    cycleTitle: '진입/방어 전투 흐름',
    priorityTitle: '방어 우선순위',
    resourceTitle: '자원/완화 흐름',
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
    lead: '근접 위치를 유지하면서 자원 생성, 강화 구간, 강한 소비기를 하나의 흐름으로 묶습니다.',
    steps: ['전투 시작', '주요 구간 열기', '강한 기술', '자원 소모', '발동 반응', '반복 흐름', '광역 전환', '마무리'],
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
    resourceTitle: '마나/회복 흐름',
    plannerTitle: '공격대 피해 대응표',
    lead: '피해가 들어온 뒤 반응하기보다 사전 준비, 광역 회복, 외생기 배치를 타이밍표로 관리합니다.',
    steps: ['피해 전 준비', '유지 효과', '주요 회복', '광역 회복', '외생기 배치', '마나 절약', '다음 피해 대비', '정리'],
  },
  support: {
    label: '지원 딜러',
    cycleTitle: '지원 전투 흐름',
    priorityTitle: '지원 우선순위',
    resourceTitle: '강화 유지 흐름',
    plannerTitle: '파티 극딜 맞추기',
    lead: '개인 피해보다 아군 강화 유지율과 파티 극딜 구간 맞추기를 먼저 봅니다.',
    steps: ['강화 부여', '파티 구간 맞추기', '버프 유지', '대상 확인', '광역 지원', '자원 보정', '다음 강화 준비', '정리'],
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

const standaloneWindowSkillNames = uniqueBy(
  allSkills
    .map(skillName)
    .filter(name => /(^|\s)창($|\s)/.test(name))
    .sort((a, b) => b.length - a.length),
  name => name
);

const communityTermSkillNames = uniqueBy(
  [
    ...standaloneWindowSkillNames,
    ...allSkills.map(skillName).filter(name => /정렬/.test(name)),
    ...allSynergies.map(synergy => synergy?.name).filter(name => /정렬/.test(name)),
  ].sort((a, b) => b.length - a.length),
  name => name
);

function cleanText(value) {
  return String(value || '').trim();
}

function normalizeCommunityTerms(value) {
  const protectedTerms = [];
  let text = value;

  communityTermSkillNames.forEach((name, index) => {
    if (!text.includes(name)) return;
    const token = `__WOWMETA_SKILL_${index}__`;
    protectedTerms.push([token, name]);
    text = text.split(name).join(token);
  });

  text = text
    .replace(/(파티 극딜|아군 강화|극딜|피해|쿨기|강화|소비|판단|속죄|독살|일월식|균열|공허술사|집정관|발화|평온|치유|힐업|버프|파티|큰|짧은|긴|순간 치유|광역 피해|레이드|오프닝|중심|대체 큰|공통 큰|90초 큰|45초|1분 피해|피해 전환|마력 주입|공허의 형상|응징의 격노|사형 선고|얼음 기둥|악마화|정수 파쇄|뼈주사위|영혼 소집|권능|봉화|빛 주입|천상의 종|비전 쇄도|용의 분노|악마 폭군 소환|폭풍수호자|폭풍인도자|쇄도하는 토템|토템술사|선견자|승천|천신주|방패|방어|마나|회복|쐐기|딜)\s*창/g, '$1 구간')
    .replace(/(^|[^가-힣A-Za-z0-9])창(?=(?:입니다|이었다|이다|이고|이며|이라는|인|[은는이가을를에의도만과와]|마다|에서|으로|부터|까지|처럼|보다| 안| 밖| 내부| 중| 중심| 단위| 차트| 진입| 활성| 밀도| 준비| 유지| 시작| 목표| 배치| 정렬| 전| 후| 앞| 사이| 관리| 흐름| 개방| 소비| 사용| 보강| 가치| 공백| 손실| 계획| 기준| 대기| 종료| 타임라인| 루프| 설계| 확보|압축| 연장| 연결| 분기| 전환| 회수| 누수| 낭비|$|[\s.,:;!?)]))/g, '$1구간');

  protectedTerms.forEach(([token, name]) => {
    text = text.split(token).join(name);
  });

  return text;
}

function displayGuideText(value) {
  return normalizeCommunityTerms(cleanText(value)
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
    .replace(/기본 본문/g, '기본 운용')
    .replace(/공통 본문/g, '공통 운용')
    .replace(/기본 설명/g, '기본 운용')
    .replace(/공통 설명/g, '공통 운용')
    .replace(/표준 설명/g, '기본 운용')
    .replace(/본문/g, '설명')
    .replace(/별도 장/g, '별도 파트')
    .replace(/오프닝\s*딜\s*사이클/g, '오프닝 전투 흐름')
    .replace(/오프닝\s*딜사이클/g, '오프닝 전투 흐름')
    .replace(/오프닝 순서표/g, '오프닝 전투 흐름')
    .replace(/추천 전문화\+영웅 빌드/g, '추천 특성 조합')
    .replace(/전문화\+영웅 빌드/g, '특성 조합')
    .replace(/전문화\+영웅/g, '특성 조합')
    .replace(/추천 특성 조합/g, '대표 빌드')
    .replace(/특성 조합/g, '빌드 조합')
    .replace(/기본 축/g, '기본 선택')
    .replace(/기본 선택지/g, '기본 선택')
    .replace(/대상망으로/g, '대상 준비로')
    .replace(/대상망을/g, '대상 준비를')
    .replace(/대상망이/g, '대상 준비가')
    .replace(/대상망과/g, '대상 준비와')
    .replace(/대상망/g, '대상 준비')
    .replace(/(^|[^0-9])회로/g, '$1흐름')
    .replace(/\(KST\)/g, '(한국 시간)')
    .replace(/\bKST\b/g, '한국 시간')
    .replace(/Archon ([0-9]{4}-[0-9]{2}-[0-9]{2})\(한국 시간\) 확인 기준/g, 'Archon $1(한국 시간) 확인 시점')
    .replace(/([0-9]{4}-[0-9]{2}-[0-9]{2})\(한국 시간\) 확인 기준/g, '$1(한국 시간) 확인 시점')
    .replace(/확인값/g, '확인 수치')
    .replace(/공개 Discord/g, '공개 디스코드')
    .replace(/직업 Discord/g, '직업 디스코드')
    .replace(/\bDiscord\b/g, '디스코드')
    .replace(/공개 경로/g, '공개 안내 링크')
    .replace(/진입 경로/g, '안내 링크')
    .replace(/로그인\/가입/g, '로그인 또는 가입')
    .replace(/비공개 채널 원문/g, '비공개 채널 내용')
    .replace(/시각자료/g, '차트')
    .replace(/보조 자료/g, '보조 참고자료')
    .replace(/체크 포인트/g, '체크 포인트')
    .replace(/검증/g, '확인')
    .replace(/판단 도식/g, '확인용 흐름도')
    .replace(/방어 판단 도식/g, '방어 흐름도')
    .replace(/처형창/g, '처형 구간')
    .replace(/독창/g, '독 구간')
    .replace(/전투 흐름 도식/g, '전투 흐름도')
    .replace(/도식/g, '흐름도')
    .replace(/한 화면에 묶었습니다/g, '한눈에 확인할 수 있게 모았습니다')
    .replace(/한 화면에 묶은/g, '한눈에 모은')
    .replace(/한 화면에 묶어/g, '한눈에 모아')
    .replace(/한 화면에 놓기 위한/g, '한눈에 보기 위한')
    .replace(/한 화면에 놓는/g, '한눈에 보는')
    .replace(/그래프의 중앙/g, '그래프 중심')
    .replace(/중앙 표식/g, '중심 표식')
    .replace(/막대는 실제 WCL 초 단위 복사본이 아니라/g, '이 막대는 WCL 타임라인을 그대로 옮긴 것이 아니라')
    .replace(/막대는 실제 로그 초 단위 복사본이 아니라/g, '이 막대는 로그 타임라인을 그대로 옮긴 것이 아니라')
    .replace(/막대는 실제 HPS 초 단위 복사본이 아니라/g, '이 막대는 HPS 타임라인을 그대로 옮긴 것이 아니라')
    .replace(/막대는 실제 WCL 수치가 아니라/g, '이 막대는 WCL 수치표가 아니라')
    .replace(/막대는 실제 로그 수치가 아니라/g, '이 막대는 로그 수치표가 아니라')
    .replace(/막대는 실제 HPS 수치가 아니라/g, '이 막대는 HPS 수치표가 아니라')
    .replace(/막대는 실제 DTPS 수치가 아니라/g, '이 막대는 받은 피해 수치표가 아니라')
    .replace(/막대는 실제 HPS나 DPS 수치가 아니라/g, '이 막대는 HPS/DPS 수치표가 아니라')
    .replace(/정렬표/g, '맞추기 표')
    .replace(/정렬 타임라인/g, '맞추기 타임라인')
    .replace(/쿨기 정렬/g, '쿨기 맞추기')
    .replace(/파티 구간 정렬/g, '파티 구간 맞추기')
    .replace(/극딜 구간 정렬/g, '극딜 구간 맞추기')
    .replace(/피해 구간 정렬/g, '피해 구간 맞추기')
    .replace(/정렬되므로/g, '타이밍이 자연스럽게 맞으므로')
    .replace(/정렬되면/g, '타이밍이 맞으면')
    .replace(/정렬된/g, '타이밍이 맞은')
    .replace(/정렬합니다/g, '맞춥니다')
    .replace(/정렬해야/g, '맞춰야')
    .replace(/정렬하면/g, '맞추면')
    .replace(/정렬보다/g, '맞추기보다')
    .replace(/정렬을/g, '타이밍을')
    .replace(/정렬이/g, '타이밍이')
    .replace(/정렬/g, '맞추기')
    .replace(/영웅 특성 분기/g, '영웅 특성 선택지')
    .replace(/빌드 분기/g, '빌드 선택지')
    .replace(/보조 분기/g, '보조 선택지')
    .replace(/예외 분기/g, '예외 선택지')
    .replace(/실험 분기/g, '실험 선택지')
    .replace(/보류 분기/g, '보류 선택지')
    .replace(/상황 분기/g, '상황별 선택지')
    .replace(/광역 분기/g, '광역 선택지')
    .replace(/단일 분기/g, '단일 선택지')
    .replace(/분기 이름/g, '선택지 이름')
    .replace(/분기 차트/g, '선택지 차트')
    .replace(/분기 설명/g, '선택지 설명')
    .replace(/분기 표시/g, '선택지 표시')
    .replace(/분기 확인/g, '선택지 확인')
    .replace(/분기입니다/g, '선택지입니다')
    .replace(/분기이며/g, '선택지이며')
    .replace(/분기지만/g, '선택지지만')
    .replace(/분기는/g, '선택지는')
    .replace(/분기를/g, '선택지를')
    .replace(/분기로/g, '선택지로')
    .replace(/분기와/g, '선택지와')
    .replace(/분기다/g, '선택지다')
    .replace(/채널 축/g, '채널 기술')
    .replace(/생성 축/g, '생성 흐름')
    .replace(/피해 축/g, '피해 흐름')
    .replace(/보조 축/g, '보조 흐름')
    .replace(/선택 축/g, '선택 경향')
    .replace(/중심 피드백/g, '쿨기 환급 구조')
    .replace(/분기 타임라인/g, '선택 타임라인')
    .replace(/분기 창/g, '선택 구간')
    .replace(/압축 창/g, '몰아치는 구간')
    .replace(/압축 타임라인/g, '몰아넣기 타임라인')
    .replace(/피해 압축/g, '피해 몰아넣기')
    .replace(/쿨다운 압축/g, '쿨다운 몰아넣기')
    .replace(/쿨기 압축/g, '쿨기 몰아넣기')
    .replace(/마무리 일격\/칼날폭풍 압축/g, '마무리 일격/칼날폭풍 몰아넣기')
    .replace(/칼날폭풍\/마무리 일격 압축/g, '칼날폭풍/마무리 일격 몰아넣기')
    .replace(/압축하는/g, '몰아넣는')
    .replace(/압축하고/g, '몰아넣고')
    .replace(/압축한/g, '몰아넣은')
    .replace(/압축을/g, '몰아넣기를')
    .replace(/압축이/g, '몰아넣기가')
    .replace(/압축됩니다/g, '짧은 구간에 모입니다')
    .replace(/압축합니다/g, '짧은 구간에 몰아넣습니다')
    .replace(/압축/g, '몰아넣기')
    .replace(/우선 처리합니다/g, '먼저 사용합니다')
    .replace(/공개 진입 경로/g, '공개 안내 링크')
    .replace(/툴팁 API\(locale=1\)/g, '한국어 툴팁')
    .replace(/공식 툴팁 API/g, '공식 툴팁')
    .replace(/툴팁 API/g, '툴팁')
    .replace(/직접 인용하지 않습니다/g, '공개로 확인되는 내용만 반영합니다')
    .replace(/직접 인용하지 않음/g, '공개 확인 내용만 반영')
    .replace(/직접 인용/g, '비공개 내용 전재')
    .replace(/기본 해석값/g, '기본 선택지')
    .replace(/해석값/g, '선택지')
    .replace(/메커니즘/g, '작동 방식')
    .replace(/피드백형/g, '쿨기 환급형')
    .replace(/로그 링크 기반 피드백/g, '로그 링크 기반 검토')
    .replace(/로그 기반 피드백/g, '로그 기반 검토')
    .replace(/피드백/g, '검토')
    .replace(/소모 품질/g, '소모 타이밍')
    .replace(/시전 품질/g, '시전 타이밍')
    .replace(/유지 품질/g, '유지 상태')
    .replace(/출혈 품질/g, '출혈 유지')
    .replace(/대상 품질/g, '대상 선택')
    .replace(/고품질/g, '좋은')
    .replace(/고가치/g, '강한')
    .replace(/피해 기여/g, '딜 지원')
    .replace(/딜 기여/g, '딜 지원')
    .replace(/기여 주문/g, '딜 주문')
    .replace(/중심 버튼/g, '핵심 버튼')
    .replace(/중심축/g, '핵심')
    .replace(/상위 행동/g, '우선순위가 높은 스킬')
    .replace(/마나 설계/g, '마나 계획')
    .replace(/위치 설계/g, '위치 계획')
    .replace(/피해 전 설계/g, '피해 전 준비')
    .replace(/피해 주문 축/g, '피해 주문 흐름')
    .replace(/유지 축/g, '유지 흐름')
    .replace(/영웅 특성 축/g, '영웅 특성 선택지')
    .replace(/판단 축/g, '판단 기준')
    .replace(/전환 축/g, '전환 흐름')
    .replace(/복구축/g, '복구 흐름')
    .replace(/계획 처리/g, '미리 처리')
    .replace(/확인 대상/g, '볼 지점')
    .replace(/무작위 버프 패키지/g, '무작위 버프 묶음')
    .replace(/영웅 특성 패키지/g, '영웅 특성 조합')
    .replace(/패키지/g, '묶음')
    .replace(/회전 엔진/g, '운용 흐름')
    .replace(/탱킹 엔진/g, '탱킹 흐름')
    .replace(/방어 엔진/g, '방어 흐름')
    .replace(/자원 엔진/g, '자원 생성 구조')
    .replace(/생성 엔진/g, '생성 구조')
    .replace(/분노 엔진/g, '분노 생성 구조')
    .replace(/광역 엔진/g, '광역 구조')
    .replace(/근접 엔진/g, '근접 치유 흐름')
    .replace(/치유 엔진/g, '치유 흐름')
    .replace(/엔진/g, '핵심 구조')
    .replace(/쿨다운 루프/g, '쿨다운 반복 흐름')
    .replace(/딜 루프/g, '딜 반복 흐름')
    .replace(/격노 루프/g, '격노 반복 흐름')
    .replace(/폭풍 루프/g, '폭풍 반복 흐름')
    .replace(/반복 루프/g, '반복 흐름')
    .replace(/루프/g, '반복 흐름')
    .replace(/세팅값/g, '설정값')
    .replace(/세팅/g, '준비')
    .replace(/리셋 버튼/g, '초기화 버튼')
    .replace(/리셋/g, '초기화')
    .replace(/운용 판단/g, '운용 기준')
    .replace(/판단 프레임/g, '운용 기준')
    .replace(/분기 판단/g, '선택 기준')
    .replace(/분기 조건/g, '선택 조건')
    .replace(/분기 가치/g, '선택 가치')
    .replace(/주류성 근거/g, '주류 선택 근거')
    .replace(/기대값/g, '효율')
    .replace(/대조 기준/g, '확인 기준')
    .replace(/대조했습니다/g, '확인했습니다')
    .replace(/대조했고/g, '확인했고')
    .replace(/대조해/g, '확인해')
    .replace(/대조/g, '확인')
    .replace(/전역 재사용 대기시간/g, '글쿨')
    .replace(/빈 전역/g, '빈 글쿨')
    .replace(/첫 몇 전역/g, '첫 몇 글쿨')
    .replace(/매 전역/g, '매 글쿨')
    .replace(/자원 경제/g, '자원 관리')
    .replace(/영혼 파편 경제/g, '영혼 파편 관리')
    .replace(/파편 경제/g, '파편 관리')
    .replace(/제어 카드/g, '제어기')
    .replace(/방어 카드/g, '방어기')
    .replace(/축복 카드/g, '축복 스킬')
    .replace(/공격\/방어 카드/g, '공격/방어기')
    .replace(/중심 허브/g, '중심')
    .replace(/판단 허브/g, '판단 중심')
    .replace(/허브/g, '중심')
    .replace(/기본값으로/g, '기본 추천으로')
    .replace(/기본값입니다/g, '기본 추천입니다')
    .replace(/기본값은/g, '기본 추천은')
    .replace(/기본값/g, '기본 추천')
    .replace(/기본 해석/g, '기본 판단')
    .replace(/해석해야/g, '판단해야')
    .replace(/해석합니다/g, '판단합니다')
    .replace(/시간표/g, '타이밍표')
    .replace(/천체의 맞추기/g, '천체의 정렬')
    .replace(/시간 재맞추기/g, '시간 재정렬')
    .replace(/재맞추기/g, '재정렬')
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
    .replace(/\bfiller\b/gi, '필러')
    .replace(/채우기 기술/g, '필러')
    .replace(/쿨기 되먹임/g, '쿨기 환급')
    .replace(/되먹임/g, '환급')
    .replace(/영웅 특성 결산/g, '영웅 특성 보상')
    .replace(/영웅 결산/g, '영웅 특성')
    .replace(/기사단 결산/g, '기사단 핵심기')
    .replace(/거신 결산/g, '거신 핵심기')
    .replace(/큰 결산/g, '큰 피해')
    .replace(/단일 대상 결산 주문/g, '단일 대상 핵심 주문')
    .replace(/단일 결산 주문/g, '단일 핵심 주문')
    .replace(/중심 결산 타격/g, '중심 타격')
    .replace(/결산 타격/g, '핵심 타격')
    .replace(/결산 주문/g, '핵심 주문')
    .replace(/결산 버튼/g, '핵심 버튼')
    .replace(/결산 독살/g, '강화 독살')
    .replace(/결산 품질/g, '소모 타이밍')
    .replace(/단일 결산/g, '단일 소모')
    .replace(/광역 결산/g, '광역 소모')
    .replace(/조각 결산/g, '조각 소모')
    .replace(/자원 결산/g, '자원 소모')
    .replace(/고드름 결산/g, '고드름 소모')
    .replace(/창 결산/g, '구간 마무리')
    .replace(/소용돌이 결산/g, '소용돌이 소모')
    .replace(/결산해야/g, '마무리해야')
    .replace(/결산합니다/g, '마무리합니다')
    .replace(/결산/g, '마무리')
    .replace(/\bwindow\b/gi, '구간')
    .replace(/\bAnnihilator\b/g, '궤멸자')
    .replace(/\bAldrachi Reaver\b/g, '알드라치 파괴자')
    .replace(/\bVoid-Scarred\b/g, '공허상흔')
    .replace(/\bFel-Scarred\b/g, '지옥상흔')
    .replace(/\bColossus\b/g, '거신')
    .replace(/\bSlayer\b/g, '학살자')
    .replace(/\bMountain\s*Thane\b/g, '산왕')
    .replace(/\bMountainThane\b/g, '산왕')
    .replace(/\bSpec & Hero\b/g, '특성 조합')
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
    .replace(/\bOracle\b/g, '예언자'));
}

function synergyName(synergy) {
  return displayGuideText(synergy?.name || '시너지');
}

function synergyTypeLabel(synergy) {
  const raw = cleanText(synergy?.synergyType);
  const name = synergyName(synergy);
  const combined = `${raw} ${name}`;

  if (/archon|집정관|후광|공허의형상/i.test(combined)) return '집정관 구간';
  if (/voidweaver|공허술사|혼돈의균열|공허폭발/i.test(combined)) return '공허술사 구간';
  if (/execute|처형|죽음예언자/i.test(combined)) return '처형 관리';
  if (/oracle|예언자-|두 개의 시야|경건|보장된 안전|즉발적인 예측/i.test(combined)) return '예언자 보조';
  if (/mythic|쐐기/i.test(raw)) return '쐐기 유틸';
  if (/raid|공격대/i.test(raw)) return '공격대 유틸';
  if (/defensive|survival|생존/i.test(raw)) return '생존 관리';
  if (/healing|heal|치유/i.test(raw)) return '치유 구간';
  if (/damage|딜|피해/i.test(raw)) return '피해 구간';
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

function SkillIconImage({ skill, size = 36, inline = false }) {
  const [failed, setFailed] = useState(false);
  const iconUrl = getIconUrl(skill);

  if (!iconUrl || failed) {
    return inline
      ? <InlineSkillIconFallback aria-hidden="true" />
      : <IconPlaceholder $size={size} aria-hidden="true" />;
  }

  return (
    <img
      src={iconUrl}
      alt=""
      width={inline ? 18 : size}
      height={inline ? 18 : size}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function isInactiveSkillReference(skill) {
  return /legacy|removed|deprecated/i.test(cleanText(skill?.type));
}

function collectManuscriptSkillIds(value, ids = new Set()) {
  if (!value) return ids;

  if (Array.isArray(value)) {
    value.forEach(item => collectManuscriptSkillIds(item, ids));
    return ids;
  }

  if (typeof value !== 'object') return ids;

  Object.entries(value).forEach(([key, entry]) => {
    if ((key === 'skillId' || key === 'graphCenterSkillId') && entry) {
      ids.add(String(entry));
      return;
    }
    collectManuscriptSkillIds(entry, ids);
  });

  return ids;
}

function buildInlineTerms(data, manuscript) {
  const seen = new Set();
  const preferredSkillIds = collectManuscriptSkillIds(manuscript);
  const records = [
    ...(manuscript?.extraSkills || []),
    ...(data?.specSkills || []),
    ...(data?.commonSkills || []),
  ].sort((a, b) => {
    const aPreferred = preferredSkillIds.has(String(a?.id)) ? 0 : 1;
    const bPreferred = preferredSkillIds.has(String(b?.id)) ? 0 : 1;
    return aPreferred - bPreferred;
  });

  return records
    .filter(skill => !isInactiveSkillReference(skill))
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
  const hasSpecificSpecScope = listedSpecs.length > 0 && !listedSpecs.some(spec => commonSpecs.has(spec));
  if (hasSpecificSpecScope && !listedSpecs.some(spec => guide.kbSpecAliases.includes(spec))) return false;
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
    return `${centerName}과 같은 시너지 노트에 묶인 항목입니다. 그래프에서 가까운 노드일수록 같은 판단 구간에서 함께 확인합니다.`;
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
    return '자주 터지는 지점은 방어기 공백, 자원 과소비, 다음 위험 구간 직전의 쿨기 선사용입니다.';
  }
  if (guide.role === 'healers') {
    return '자주 터지는 지점은 피해 예측 실패, 광역 회복 쿨기 중복, 마나 과소모, 긴급 복구 지연입니다.';
  }
  if (guide.id === 'evoker-augmentation') {
    return '자주 터지는 지점은 파티 강화 타이밍 불일치, 개인 쿨기와 아군 쿨기 분리, 유지 효과 공백입니다.';
  }
  return '자주 터지는 지점은 자원 과잉, 주요 쿨기 지연, 발동 효과 방치, 단일/광역 전환 실패입니다.';
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
      label: '핵심 요약',
      title: `${centerName} 중심 운용`,
      body: `${centerName}은 현재 KB 그래프에서 ${centerConnectionLabel(graph.center)}을 가진 핵심 버튼입니다. 이 가이드는 ${summarizeNames(topSkills, 3) || centerName} 실행 흐름과 ${summarizeNames(topTalents, 3) || '특성 조건'} 강화 흐름을 분리해서 봅니다.`,
      chips: [centerSkill, ...topSkills.slice(0, 2), ...topTalents.slice(0, 2)].filter(Boolean),
    },
    {
      label: '실전 체크',
      title: `${profile.priorityTitle} 확인`,
      body: `${profile.lead} 실제 전투에서는 ${summarizeNames(topCooldowns, 4) || '주요 쿨기'} 타이밍과 ${summarizeNames(data.prioritySource, 4)} 우선순위가 서로 꼬이지 않는지 확인합니다.`,
      chips: [...topCooldowns.slice(0, 3), ...data.prioritySource.slice(0, 2)],
    },
    {
      label: '시너지',
      title: '스킬·특성 연결',
      body: `강한 연결은 ${topSynergies.map(synergyName).slice(0, 3).join(', ') || 'KB 시너지 노트'}에서 확인됩니다. 그래프의 금색 노드는 판단 묶음이고, 보라/푸른/청록 노드는 실제 스킬·특성·영웅 특성입니다.`,
      chips: graph.skillNodes.slice(0, 5).map(node => node.skill),
    },
    {
      label: '주의점',
      title: '전투 중 깨지는 지점',
      body: `${roleRiskModel(guide)} 그래서 차트는 고정 딜사이클 표가 아니라, 전투 중 다시 확인해야 하는 판단 지점을 빠르게 보여 주는 체크용입니다.`,
      chips: data.rotationSource.slice(0, 5),
    },
    {
      label: '출처 확인',
      title: '확인한 자료',
      body: `이 가이드는 ${data.specSkills.length}개 전문화 노트, ${data.commonSkills.length}개 공용 노트, ${data.synergies.length}개 시너지 노트와 ${sourceCount}개 명시 출처를 함께 사용합니다. 수치와 번역은 KB/Wowhead 기준을 우선하고, 디스코드·로그 자료는 교차 검증 가능한 경우에만 보조 근거로 취급합니다.`,
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
    allSkills.filter(skill => commonSpecs.has(skill.spec) && recordMatchesGuide(skill, guide, true)),
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
    return `${formatSkillMeta(skill)} 흐름을 파티 극딜 구간과 아군 강화 유지율에 맞춥니다.`;
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
      <SkillIconImage skill={skill} size={size} />
    </IconAnchor>
  );
}

function InlineSkillTerm({ skill, children }) {
  return (
    <InlineSkillAnchor
      href={wowheadUrl(skill)}
      data-wowhead={`spell=${skill.id}&domain=ko`}
      target="_blank"
      rel="noreferrer"
      aria-label={`${skillName(skill)} Wowhead tooltip`}
    >
      <SkillIconImage skill={skill} inline />
      <InlineSkillText>{children}</InlineSkillText>
    </InlineSkillAnchor>
  );
}

function skillFromManualStep(step) {
  if (!step?.skillId) return step?.skill || null;
  const skillId = String(step.skillId);
  return manualSkillById.get(skillId) || skillById.get(skillId) || step.skill || null;
}

function skillFromBranchId(skillId) {
  if (!skillId) return null;
  const id = String(skillId);
  return manualSkillById.get(id) || skillById.get(id) || null;
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

  if (/오프닝|첫\s*전투\s*흐름|전투\s*시작|첫\s*피해|첫\s*풀|진입|피해\s*대응|준비\s*흐름/i.test(title)) {
    return true;
  }

  if (guide?.role === 'tanks' && /(진입|방어|위협|풀|첫\s*피해)/.test(title) && /(흐름|순서|전투|딜사이클|타임라인)/.test(title)) {
    return true;
  }

  if (guide?.role === 'healers' && /(피해|예열|회수|복구|첫\s*피해)/.test(title) && /(흐름|순서|전투|딜사이클|타임라인)/.test(title)) {
    return true;
  }

  return /(오프닝|전투\s*시작|첫\s*버튼|첫\s*풀|첫\s*피해)/.test(sample) && /(흐름|순서|딜사이클|타임라인)/.test(sample);
}

function isPracticalTipBlock(block) {
  const title = displayGuideText(block?.title || '');
  return /실전\s*꿀팁|핵심\s*꿀팁|쐐기\s*실전\s*꿀팁/.test(title);
}

const SPECIALIST_CHARTS = {
  'warlock-affliction': {
    id: 'uptime',
    title: 'DoT와 조각 소비 타임라인',
    sectionHeading: '지속 피해와 영혼의 조각 준비',
    sectionIntro: '고통 흑마법사는 고통, 부패, 불안정한 고통을 유지하면서 영혼의 조각을 몰아 쓰는 전문화입니다. 보조 차트는 DoT 공백과 조각 과소비를 같은 시간축에서 확인하게 만듭니다.',
    caption: '실제 WCL 타임라인 복사본이 아니라, 고통/부패 유지, 불안정한 고통 투입, 영혼의 조각 소비, 악의의 환희 전환을 한 화면에 묶은 확인 흐름입니다.',
    definition: [
      ['의미', '고통과 부패는 피해 바탕이고, 불안정한 고통과 악의의 환희는 조각을 피해로 바꾸는 핵심 소비 축입니다.'],
      ['읽는 법', 'DoT가 비면 먼저 복구하고, 조각이 넘치기 전 악의의 환희나 부패의 씨앗으로 소비합니다. 쿨기 구간에는 불안정한 고통과 조각 소비가 함께 들어가야 합니다.'],
      ['체크 포인트', '고통/부패 공백, 불안정한 고통 지연, 조각 5개 방치, 악의의 환희 지연, 광역에서 부패의 씨앗 전환 누락을 봅니다.'],
    ],
  },
  'warlock-demonology': {
    id: 'uptime',
    title: '소환수 수명과 폭군 준비',
    sectionHeading: '악마 폭군 전 소환수 쌓기',
    sectionIntro: '악마 흑마법사는 영혼의 조각이라는 자원을 소환수 수명으로 바꾼 뒤 악마 폭군 소환 극딜 구간에 묶습니다. 차트는 폭군 전에 어떤 소환수가 살아 있어야 하는지, 조각 소비와 발동 회수가 어디서 맞물리는지 보여 줍니다.',
    caption: '굴단의 손, 공포사냥개 부르기, 악마의 핵, 흑마법서 계열, 악마 폭군 소환, 파열이 어느 순서로 겹쳐야 하는지 확인하는 흐름입니다.',
    definition: [
      ['의미', '악마 폭군은 누르는 순간보다 직전 소환수 수명, 조각 자원 준비, 극딜 구간으로 들어가는 순서가 더 중요합니다.'],
      ['읽는 법', '폭군 전에는 조각을 소환수로 바꾸고, 폭군 중에는 악마의 핵과 파열로 남은 조각과 발동을 회수합니다. 쿨기 정렬이 밀리면 다음 폭군 구간의 소환수 사용 횟수와 구간 완성도도 같이 떨어집니다.'],
      ['체크 포인트', '공포사냥개 지연, 조각 과충전, 폭군 전에 소환수 부족, 악마의 핵 과충전, 파열이 낮은 소환수 수에 들어간 상황, 단일/광역 전환 시 조각 소비 위치를 봅니다.'],
    ],
  },
  'warlock-destruction': {
    id: 'uptime',
    title: '조각과 혼돈의 화살 소비',
    sectionHeading: '점화, 조각, 불의 비 전환',
    sectionIntro: '파괴 흑마법사는 조각을 모은 뒤 혼돈의 화살이나 불의 비로 바꾸는 전문화입니다. 단일과 광역에서 같은 조각이라도 소비처가 달라지므로 보조 차트가 필요합니다.',
    caption: '점화 충전, 제물 유지, 혼돈의 화살, 대혼란, 불의 비 전환을 한 줄로 묶어 단일/광역 판단을 확인합니다.',
    definition: [
      ['의미', '혼돈의 화살은 단일 조각 소비기이고, 불의 비는 대상 수가 충분할 때 쓰는 광역 소비기입니다.'],
      ['읽는 법', '제물이 비면 먼저 복구하고, 조각이 넘치기 전에 단일은 혼돈의 화살, 2대상은 대혼란 혼돈의 화살, 광역은 불의 비로 전환합니다.'],
      ['체크 포인트', '제물 공백, 점화 2충전 방치, 조각 과충전, 대혼란 중 빈 구간, 불의 비 대상 수 부족을 봅니다.'],
    ],
  },
  'monk-brewmaster': {
    id: 'defensive',
    title: '시간차와 정화주 방어표',
    sectionHeading: '시간차 색상과 맥주 판단',
    sectionIntro: '양조 수도사는 피해를 한 번에 맞는 탱커가 아니라 시간차로 미루고 정화주와 천신주로 위험을 정리하는 탱커입니다. 차트는 방어기 사용 이유를 피해 색상과 다음 타이머로 묶습니다.',
    caption: '시간차 위험도, 정화주, 천신주, 맥주통 휘두르기, 후려차기, 절명의 손길과 주요 생존기 배정을 함께 보는 방어 확인표입니다.',
    definition: [
      ['의미', '시간차는 이미 받은 피해가 앞으로 들어오는 상태이고, 정화주는 그 피해를 줄이며 천신주는 다음 큰 피해를 받을 여유를 만듭니다.'],
      ['읽는 법', '시간차가 높아지는 구간에서는 정화주를 먼저 보고, 다음 큰 피해가 보이면 천신주나 강화주 같은 생존기를 미리 배정합니다.'],
      ['체크 포인트', '높은 시간차 방치, 정화주 공백, 천신주 지연, 맥주통 휘두르기 지연, 큰 피해 전에 생존기 없이 진입한 상황을 봅니다.'],
    ],
    events: [
      { phase: '평상시', skillId: '121253', action: '회전 엔진', note: '맥주통 휘두르기로 위협, 기력 소비, 맥주 충전 흐름을 동시에 열어 둡니다.' },
      { phase: '후려차기 기준점', skillId: '205523', action: '3글쿨 리듬', note: '후려차기 사이에 세 행동을 넣는 기준입니다. 밀리면 방어 회전도 같이 늦어집니다.' },
      { phase: '초록 시간차', skillId: '100780', action: '아낌', note: '상위 기술이 비면 범의 장풍으로 보정하되, 정화주는 낮은 시간차에 낭비하지 않습니다.' },
      { phase: '노랑/빨강 시간차', skillId: '119582', action: '정리', note: '큰 타격 직후 미래 피해가 커졌고 다음 피해가 이어질 때 정화주 가치가 가장 큽니다.' },
      { phase: '다음 큰 타격 전', skillId: '322507', action: '예약 방패', note: '천신주는 이미 쌓인 피해를 지우는 버튼이 아니라 다음 피해를 받아내는 방패입니다.' },
      { phase: '긴 압박/큰 풀', skillId: '132578', action: '분산', note: '흑우 니우짜오의 원령은 빈 구간보다 탱커 피해가 이어지는 15~20초 구간에 맞춥니다.' },
      { phase: '예상 밖 급락', skillId: '115203', action: '비상층', note: '강화주는 정화주와 천신주만으로 부족한 급락 또는 장기 압박에 따로 배정합니다.' },
      { phase: '광역 접촉', skillId: '116847', action: '선택 보강', note: '비취 돌풍을 선택했다면 폭발하는 맥주통과 큰 풀 접촉을 안정화하는 보조 축으로 봅니다.' },
      { phase: '쐐기 제어', skillId: '119381', action: '피해 차단', note: '팽이 차기는 시간차가 쌓인 뒤가 아니라 위험 기술이 들어오기 전 피해 자체를 줄이는 버튼입니다.' },
    ],
  },
  'monk-windwalker': {
    id: 'uptime',
    title: '기와 주요 쿨기 흐름',
    sectionHeading: '분노의 주먹과 기 소비',
    sectionIntro: '풍운 수도사는 기력과 기를 넘치지 않게 돌리면서 같은 기술 반복 금지를 지키고, 분노의 주먹과 쉬엔 같은 짧은 쿨기를 밀리지 않게 굴립니다.',
    caption: '기 생성, 기 소비, 분노의 주먹 채널, 해오름차기, 질풍차기, 평안 또는 폭풍과 대지와 불을 같은 흐름에서 확인합니다.',
    definition: [
      ['의미', '분노의 주먹은 가장 중요한 채널 기술이고, 기는 강한 기술을 끊기지 않게 넣기 위한 연료입니다.'],
      ['읽는 법', '범의 장풍으로 기를 만들고, 기가 넘치기 전에 후려차기나 해오름차기로 비우며, 분노의 주먹과 해오름차기 쿨다운을 밀지 않습니다.'],
      ['체크 포인트', '기 과충전, 기력 과충전, 같은 기술 반복, 분노의 주먹 끊김, 해오름차기 지연, 광역 전환 누락을 봅니다.'],
    ],
  },
  'monk-mistweaver': {
    id: 'uptime',
    title: '12.1 질풍차기와 천신합일 회전',
    sectionHeading: '평소 치유와 큰 피해 구간을 나누기',
    sectionIntro: '평소에는 소생의 안개, 질풍차기, 생기 충전을 굴리고, 큰 피해에는 천신합일·위론·재활 중 하나를 배정합니다. 천신합일 뒤 8초는 옥룡의 마음이 돌려주는 짧은 쿨다운을 따로 확인합니다.',
    caption: '시즌 2 질풍차기 무료 발동, 소생의 안개 대상 수, 옥룡의 마음 8초, 기의 고치와 마나 차, 위론·재활 분리 배정을 함께 보는 확인표입니다.',
    definition: [
      ['의미', '질풍차기는 시즌 2 세트와 평소 치유의 기준 버튼이고, 천신합일 종료 뒤 옥룡의 마음 8초에는 질풍차기·소생의 안개·집중의 천둥 차·기의 고치가 더 빨리 돌아옵니다.'],
      ['읽는 법', '피해 전에는 소생의 안개와 질풍차기를 굴립니다. 실제 피해에 천신합일을 맞춘 뒤 빨라진 짧은 쿨다운을 소비하고, 다음 피해에는 위론 또는 재활을 남깁니다.'],
      ['체크 포인트', '시즌 2 무료 질풍차기 누락, 천신합일 과치유, 옥룡의 마음 중 짧은 쿨다운 방치, 기의 고치 과소 사용, 위론·재활 중복을 봅니다.'],
    ],
  },
  'warrior-protection': {
    id: 'defensive',
    title: '방패 올리기와 고통 감내',
    sectionHeading: '실제 탱킹 시간 확인',
    sectionIntro: '방어 전사는 받은 피해 총합보다 방패 올리기가 실제 근접 피해 시간에 켜져 있었는지가 먼저입니다. 차트는 방패 올리기, 고통 감내, 주문 반사와 생존기를 피해 유형별로 분리합니다.',
    caption: '방패 올리기 유효 시간, 방패 밀쳐내기 분노 생성, 고통 감내 흡수막, 주문 반사와 주요 생존기 배정을 한 줄 시간표로 묶습니다.',
    definition: [
      ['의미', '방패 올리기는 기본 방어 상태이고, 고통 감내는 분노를 흡수막으로 바꾸며, 주문 반사는 마법 피해를 따로 처리합니다.'],
      ['읽는 법', '근접 피해가 이어지는 구간에는 방패 올리기를 먼저 보고, 마법이나 큰 기술은 주문 반사와 생존기로 따로 표시합니다.'],
      ['체크 포인트', '방패 올리기 공백, 고통 감내 과소비, 주문 반사 누락, 방패 밀쳐내기 지연, 생존기 중복 사용을 봅니다.'],
    ],
  },
  'warrior-arms': {
    id: 'cooldown',
    title: '필사의 일격과 극딜 정렬',
    sectionHeading: '필사의 일격 중심 구간',
    sectionIntro: '무기 전사는 필사의 일격을 중심으로 거인의 강타 또는 투신 구간, 제압 충전, 마무리 일격 발동을 맞추는 전문화입니다.',
    caption: '필사의 일격 주기, 거인의 강타/투신, 제압 충전, 마무리 일격, 칼날폭풍 또는 전쟁파괴자를 같은 구간에서 확인합니다.',
    definition: [
      ['의미', '필사의 일격은 중심 공격이고, 큰 쿨기 구간은 그 공격과 강한 소비기를 몰아넣는 시간입니다.'],
      ['읽는 법', '필사의 일격 지연을 먼저 보고, 그 주변에 제압 충전과 마무리 일격 발동, 광역 쿨기가 들어갔는지 확인합니다.'],
      ['체크 포인트', '필사의 일격 지연, 제압 2충전 방치, 거인의 강타 중 약한 소비, 마무리 일격 발동 낭비, 광역 쿨기 위치 손실을 봅니다.'],
    ],
  },
  'warrior-fury': {
    id: 'uptime',
    title: '광란과 격노 유지 흐름',
    sectionHeading: '격노 공백과 분노 소비',
    sectionIntro: '분노 전사는 광란으로 격노를 켜고 그 안에서 분노 생성기와 강한 소비기를 계속 이어 가는 전문화입니다. 보조 차트는 격노 공백과 분노 낭비를 함께 봅니다.',
    caption: '광란, 격노, 피의 갈증, 분노의 강타, 무모한 희생, 투신, 오딘의 격노, 광역 전환을 한 흐름으로 확인합니다.',
    definition: [
      ['의미', '광란은 분노를 피해로 바꾸면서 격노를 여는 중심 버튼입니다. 격노가 비면 같은 기술도 가치가 떨어집니다.'],
      ['읽는 법', '분노가 충분하면 광란으로 격노를 유지하고, 격노 중에는 강한 생성기와 쿨기를 끊기지 않게 넣습니다.'],
      ['체크 포인트', '광란 지연, 격노 공백, 분노 과충전, 피의 갈증/분노의 강타 충전 방치, 광역 쿨기 없는 광란을 봅니다.'],
    ],
  },
  'rogue-assassination': {
    id: 'uptime',
    title: '목조르기와 파열 유지',
    sectionHeading: '출혈 기반 독살 구간',
    sectionIntro: '암살 도적은 목조르기와 파열을 유지하고 독살로 독 피해를 강화하는 전문화입니다. 차트는 출혈 공백과 독살 구간의 완성도를 함께 보여 줍니다.',
    caption: '목조르기, 파열, 독살, 죽음표식, 왕의 파멸, 혈폭풍 또는 죽음추적자 보상을 한 화면에 묶습니다.',
    definition: [
      ['의미', '목조르기와 파열은 피해 바탕이고, 독살은 그 위에 독 피해와 발동을 올리는 마무리 기술입니다.'],
      ['읽는 법', '출혈이 비기 전에 갱신하고, 독살 구간에는 왕의 파멸과 강한 발동이 들어가는지 확인합니다.'],
      ['체크 포인트', '목조르기/파열 공백, 독살 중 출혈 누락, 연계 점수 과충전, 왕의 파멸 지연, 광역 출혈 전환 누락을 봅니다.'],
    ],
  },
  'rogue-outlaw': {
    id: 'uptime',
    title: '마무리 기술과 쿨기 환급',
    sectionHeading: '잠들지 않는 칼날 흐름',
    sectionIntro: '무법 도적은 마무리 기술이 끝이 아니라 다음 쿨기를 앞당기는 전문화입니다. 차트는 연계 점수 소비와 쿨기 환급이 실제로 이어지는지 보여 줍니다.',
    caption: '사악한 일격/권총 사격 생성, 5~6점 마무리 기술, 뼈주사위, 미간 적중, 아드레날린 촉진, 폭풍의 칼날 전환을 확인합니다.',
    definition: [
      ['의미', '잠들지 않는 칼날은 무법의 쿨기 환급 구조입니다. 연계 점수 소비가 다음 쿨기 구간을 앞당깁니다.'],
      ['읽는 법', '마무리 기술 빈도와 연계 점수 과충전을 먼저 보고, 미간 적중과 아드레날린 촉진이 늦어졌는지 이어서 봅니다.'],
      ['체크 포인트', '연계 점수 과충전, 6점 방치, 미간 적중 지연, 뼈주사위 공백, 폭풍의 칼날 대상 수 손실을 봅니다.'],
    ],
  },
  'rogue-subtlety': {
    id: 'cooldown',
    title: '어둠의 춤 극딜 묶음',
    sectionHeading: '은밀한 기술과 춤 구간',
    sectionIntro: '잠행 도적은 어둠의 춤 안에 은밀한 기술, 그림자 일격, 절개, 고대의 기술을 짧게 몰아넣는 전문화입니다. 차트는 춤 안에 들어간 기술을 확인합니다.',
    caption: '어둠의 춤, 어둠의 칼날, 은밀한 기술, 절개, 고대의 기술, 표창 폭풍/검은 화약 전환을 같은 극딜 흐름으로 봅니다.',
    definition: [
      ['의미', '어둠의 춤은 은밀한 기술과 강한 마무리 기술을 넣는 짧은 극딜 구간입니다.'],
      ['읽는 법', '춤을 눌렀는지보다 춤 안에 은밀한 기술과 충분한 마무리 기술이 들어갔는지 먼저 봅니다.'],
      ['체크 포인트', '은밀한 기술이 춤 밖으로 밀림, 연계 점수 과충전, 어둠의 칼날 중 마무리 부족, 광역 전환 누락을 봅니다.'],
    ],
  },
  'shaman-elemental': {
    id: 'resource',
    title: '선조 반응과 소용돌이 소비',
    sectionHeading: '12.1 선견자 주문 흐름',
    sectionIntro: '정기 주술사는 화염 충격과 용암 폭발을 바탕으로 소용돌이를 만들고, 폭풍수호자와 선조의 신속함이 부르는 선조에게 단일·광역 주문을 구분해 보여 줍니다.',
    caption: '화염 충격, 용암 폭발, 선조의 부름, 폭풍수호자, 승천, 소용돌이 소비와 시즌 2 무료 소비기를 함께 확인합니다.',
    definition: [
      ['의미', '선조는 실제 단일 주문에 용암 폭발로, 광역 주문에 연쇄 번개로 반응합니다. 소용돌이는 대지 충격·정기 작렬·지진으로 비웁니다.'],
      ['읽는 법', '화염 충격과 용암 폭발을 먼저 확인하고, 선조가 남아 있는 동안 전투 대상 수에 맞는 주문을 시전한 뒤 소용돌이와 무료 소비기를 넘치기 전에 씁니다.'],
      ['체크 포인트', '화염 충격 공백, 용암 폭발 충전 낭비, 선조 중 잘못된 단일·광역 주문, 소용돌이 과충전, 시즌 2 무료 소비기 손실을 봅니다.'],
    ],
  },
  'shaman-restoration': {
    id: 'cooldown',
    title: '토템 위치와 피해 파도 회수',
    sectionHeading: '피해 파도별 회수와 쿨기 배정',
    sectionIntro: '복원 주술사는 성난 해일 대상과 치유의 비/쇄도하는 토템 위치를 먼저 잡고, 마나를 과하게 태우지 않는 예열로 피해 파도를 받습니다. 폭우와 연쇄 치유로 짧은 피해를 회수한 뒤 치유의 해일 토템, 승천, 정신의 고리 토템을 서로 다른 피해 파도에 나눠 씁니다.',
    caption: '성난 해일 대상, 치유의 비/쇄도하는 토템 위치, 치유의 토템 충전, 폭풍의 흐름 토템, 폭우, 연쇄 치유, 치유의 해일 토템, 정신의 고리 토템, 승천을 한 피해 타임라인에서 확인합니다.',
    definition: [
      ['의미', '폭우는 구버전 저장형 버튼이 아니라 치유의 비나 쇄도하는 토템 위치 위에서 예고 피해를 낮은 비용으로 회복하는 짧은 광역 구간입니다.'],
      ['읽는 법', '피해가 오기 전에 성난 해일 대상과 지역 힐 위치를 준비하고, 마나가 무너지지 않는 선에서 폭우/연쇄 치유/폭풍의 흐름 토템으로 회수한 뒤 큰 피해는 해일 토템/고리/승천을 따로 배정합니다.'],
      ['체크 포인트', '성난 해일 대상 부족, 치유의 비 위치 손실, 폭우와 실제 피해 불일치, 마나 과소비, 폭풍의 흐름 토템 충전 낭비, 큰 쿨기 중복을 봅니다.'],
    ],
  },
  'shaman-enhancement': {
    id: 'resource',
    title: '소용돌이치는 무기와 극딜',
    sectionHeading: '10중첩 소비와 큰 기술',
    sectionIntro: '고양 주술사는 근접 기술로 소용돌이치는 무기를 쌓고, 그 중첩을 번개 화살, 연쇄 번개, 정기 작렬 같은 강한 주문으로 바꿉니다.',
    caption: '소용돌이치는 무기, 폭풍의 일격, 용암 채찍, 야수 정령, 파멸의 바람, 승천, 광역 연쇄 번개 전환을 확인합니다.',
    definition: [
      ['의미', '소용돌이치는 무기는 주문을 즉시 강하게 쓰기 위한 중첩이고, 극딜 구간은 그 중첩을 큰 주문에 맞추는 시간입니다.'],
      ['읽는 법', '중첩이 10에 가까워지면 소비를 먼저 보고, 야수 정령이나 승천 구간에는 강한 주문 소비가 밀리지 않게 둡니다.'],
      ['체크 포인트', '10중첩 방치, 폭풍의 일격 지연, 야수 정령 중 약한 소비, 광역에서 연쇄 번개 전환 누락을 봅니다.'],
    ],
  },
  'paladin-protection': {
    id: 'defensive',
    title: '정의의 방패와 방어 공백',
    sectionHeading: '신성한 힘 방어 배정',
    sectionIntro: '보호 성기사는 신성한 힘을 정의의 방패와 영광의 서약에 배정하며, 마법 피해와 큰 탱버스터는 주문 수호의 축복과 생존기로 따로 처리합니다.',
    caption: '응징의 방패, 심판, 신성한 힘 생성, 정의의 방패 유지, 영광의 서약, 헌신적인 수호자와 주요 축복을 확인합니다.',
    definition: [
      ['의미', '정의의 방패는 기본 방어 상태이고, 영광의 서약은 남은 피해를 회복으로 바꾸는 비상 수단입니다.'],
      ['읽는 법', '근접 피해 전에는 정의의 방패를 먼저 보고, 큰 마법 피해나 급사는 축복과 생존기로 별도 표시합니다.'],
      ['체크 포인트', '정의의 방패 공백, 신성한 힘 과충전, 영광의 서약 과소비, 축복 지연, 생존기 중복을 봅니다.'],
    ],
  },
  'paladin-holy': {
    id: 'cooldown',
    title: '신성 충격과 12.1 봉화 회복',
    sectionHeading: '생성, 9초 봉화, 큰 피해 준비',
    sectionIntro: '신성 충격으로 신성한 힘과 빛 주입을 만들고, 단일 소비기를 기본으로 사용합니다. 쐐기에서는 고결의 봉화 9초, 공격대에서는 새벽빛과 큰 치유 기술이 실제 피해에 겹치는지 확인합니다.',
    caption: '신성 충격, 빛 주입, 신성한 힘 소비, 고결의 봉화, 태양의 사자 새벽빛, 오라 숙련과 천상의 울림, 응징의 격노에 자동 발동하는 티르의 해방, 빛대장장이 무장을 함께 봅니다.',
    definition: [
      ['의미', '신성 충격은 회복과 자원 생성의 시작점이고, 봉화는 직접 치유를 지속 피해 대상 또는 9초 동안 파티에 전달하는 구조입니다.'],
      ['읽는 법', '신성한 힘 5에서 생성기를 쓰지 않고, 한 명이 위험하면 영광의 서약이나 영원의 불꽃을 먼저 사용합니다. 여명의 빛은 여러 명이 비슷하게 다쳤을 때 선택합니다.'],
      ['체크 포인트', '신성 충격 충전 방치, 신성한 힘 과잉, 빛 주입 미소비, 고결의 봉화 지연, 오라 숙련 전 자원 손실, 응징의 격노 뒤 직접 치유를 봅니다.'],
    ],
  },
  'paladin-retribution': {
    id: 'cooldown',
    title: '응징의 격노와 신성한 힘',
    sectionHeading: '극딜 안 신성한 힘 소비',
    sectionIntro: '징벌 성기사는 신성한 힘을 만들고 기사단의 선고나 천상의 폭풍으로 비우며, 응징의 격노와 파멸의 재 구간에 강한 소비기를 몰아넣습니다.',
    caption: '심판, 파멸의 재, 응징의 격노, 신성한 힘 생성, 기사단의 선고, 천상의 폭풍, 사형 선고를 확인합니다.',
    definition: [
      ['의미', '응징의 격노는 큰 피해 구간이고, 신성한 힘은 그 안에서 강한 마무리 기술로 바뀌는 자원입니다.'],
      ['읽는 법', '심판과 파멸의 재로 준비한 뒤 응징의 격노 안에 신성한 힘 소비기가 최대한 들어가는지 확인합니다.'],
      ['체크 포인트', '신성한 힘 과충전, 응징의 격노 중 약한 글쿨, 사형 선고 지연, 광역에서 천상의 폭풍 전환 누락을 봅니다.'],
    ],
  },
  'mage-frost': {
    id: 'uptime',
    title: '산산조각과 얼음창 소비',
    sectionHeading: '빙결 중첩과 소비기',
    sectionIntro: '냉기 마법사는 빙결 중첩과 발동을 얼음창, 진눈깨비, 혜성 폭풍, 혹한의 쐐기로 소비해 산산조각 피해를 만드는 전문화입니다.',
    caption: '서리의 손가락, 두뇌 빙결, 진눈깨비, 얼음창, 얼어붙은 구슬, 서리 광선, 혜성 폭풍을 같은 소비 흐름에서 봅니다.',
    definition: [
      ['의미', '얼음창은 빈 필러가 아니라 산산조각을 반복 발생시키는 주 소비기입니다.'],
      ['읽는 법', '발동이 2중첩에 가까워지면 얼음창으로 정리하고, 진눈깨비 직후에는 강한 소비기가 이어지는지 봅니다.'],
      ['체크 포인트', '서리의 손가락 과충전, 두뇌 빙결 방치, 낮은 중첩 얼음창, 서리 광선 끊김, 구슬 경로 손실을 봅니다.'],
    ],
  },
  'priest-shadow': {
    id: 'resource',
    title: '광기와 지속 피해 관리',
    sectionHeading: '흡혈의 손길과 광기 소비',
    sectionIntro: '암흑 사제는 흡혈의 손길과 어둠의 권능: 고통을 유지하면서 광기를 만들고, 어둠의 권능: 광기와 공허의 격류 구간에 소비합니다.',
    caption: '흡혈의 손길, 어둠의 권능: 고통, 정신 분열, 어둠의 권능: 광기, 공허의 형상, 공허 연사, 공허의 격류를 확인합니다.',
    definition: [
      ['의미', '광기는 강한 소비기로 바뀌는 자원이고, 지속 피해는 광기 생성과 피해 바탕을 유지합니다.'],
      ['읽는 법', '지속 피해가 비면 먼저 복구하고, 광기가 넘치기 전에 어둠의 권능: 광기로 소비합니다. 공허의 형상 중에는 공허 연사와 정신 분열을 밀지 않습니다.'],
      ['체크 포인트', '흡혈의 손길 공백, 광기 과충전, 공허의 형상 중 약한 소비, 정신 분열 지연, 쐐기에서 차단/스톱 누락을 봅니다.'],
    ],
  },
  'demonhunter-havoc': {
    id: 'cooldown',
    title: '안광과 정수 파쇄 구간',
    sectionHeading: '악마화와 짧은 극딜',
    sectionIntro: '파멸 악마사냥꾼은 안광으로 악마화 구간을 열고 정수 파쇄, 죽음의 휩쓸기, 탈태 초기화를 짧은 피해 구간에 맞춥니다.',
    caption: '안광, 정수 파쇄, 죽음의 휩쓸기, 칼춤, 탈태, 사냥, 파괴자의 글레이브를 같은 극딜 흐름으로 봅니다.',
    definition: [
      ['의미', '안광은 악마화 구간을 여는 버튼이고, 정수 파쇄는 그 안의 강한 소비기를 더 가치 있게 만듭니다.'],
      ['읽는 법', '안광 전후에 분노와 칼춤/죽음의 휩쓸기 쿨을 보고, 탈태 초기화가 약한 글쿨에 묻히지 않게 둡니다.'],
      ['체크 포인트', '안광 지연, 정수 파쇄 밖 죽음의 휩쓸기, 분노 과충전, 탈태 초기화 손실, 사냥과 글레이브 충돌을 봅니다.'],
    ],
  },
  'demonhunter-vengeance': {
    id: 'defensive',
    title: '영혼 파편과 방어기 배정',
    sectionHeading: '탱킹 안정화 흐름',
    sectionIntro: '복수 악마사냥꾼은 영혼 파편과 격노를 방어와 피해로 바꾸며, 악마 쐐기, 불타는 낙인, 탈태를 실제 위험 구간에 배정합니다.',
    caption: '악마 쐐기, 균열, 영혼 파편, 영혼 폭탄, 영혼 베어내기, 불타는 낙인, 탈태와 인장 제어를 확인합니다.',
    definition: [
      ['의미', '영혼 파편은 회복과 피해를 동시에 여는 자원이고, 악마 쐐기와 낙인은 실제 피해 유형에 맞춰야 합니다.'],
      ['읽는 법', '풀 진입 전 악마 쐐기를 보고, 파편이 넘치기 전에 소비하며, 큰 단일 피해는 불타는 낙인이나 탈태로 따로 표시합니다.'],
      ['체크 포인트', '악마 쐐기 공백, 파편 과충전, 불타는 낙인 대상 오류, 탈태 중복, 인장 제어 지연을 봅니다.'],
    ],
  },
  'demonhunter-devourer': {
    id: 'resource',
    title: '영혼 파편과 공허 탈태',
    sectionHeading: '흡수에서 공허 광선까지',
    sectionIntro: '포식 악마사냥꾼은 흡수로 격노와 영혼 파편을 만들고, 공허 탈태와 공허 광선 구간에서 그 자원을 피해로 바꿉니다.',
    caption: '흡수, 격노, 영혼 파편, 공허 탈태, 공허 광선, 박멸, 붕괴하는 별을 한 흐름으로 확인합니다.',
    definition: [
      ['의미', '공허 탈태는 시작부터 누르는 쿨기가 아니라 영혼 파편을 모아 여는 상태 전환입니다.'],
      ['읽는 법', '파편과 격노가 넘치기 전에 정리하고, 공허 탈태 안에는 공허 광선과 강한 소비기가 들어가는지 봅니다.'],
      ['체크 포인트', '파편 과충전, 공허 탈태 지연, 공허 광선 누락, 박멸 반응 지연, 붕괴하는 별 밖 소비를 봅니다.'],
    ],
  },
  'deathknight-frost': {
    id: 'cooldown',
    title: '절멸과 신드라고사 구간',
    sectionHeading: '룬과 룬 마력 정리',
    sectionIntro: '냉기 죽음의 기사는 절멸, 도살기, 서리낫, 서리의 일격을 룬/룬 마력 상태에 맞춰 쓰고, 신드라고사의 숨결 또는 말살 구간을 따로 관리합니다.',
    caption: '룬, 룬 마력, 도살기, 절멸, 서리의 일격, 냉기의 기둥, 신드라고사의 숨결을 함께 봅니다.',
    definition: [
      ['의미', '도살기와 절멸은 냉기의 중심 피해이고, 룬과 룬 마력은 그 피해가 끊기지 않게 만드는 연료입니다.'],
      ['읽는 법', '룬이 비지 않게 생성기를 돌리고, 룬 마력이 넘치기 전 서리의 일격으로 비웁니다. 쿨기 구간에는 도살기 절멸이 밀리지 않아야 합니다.'],
      ['체크 포인트', '도살기 낭비, 룬 공백, 룬 마력 과충전, 냉기의 기둥 지연, 신드라고사의 숨결 조기 종료를 봅니다.'],
    ],
  },
  'deathknight-unholy': {
    id: 'cooldown',
    title: '질병, 부패, 소환수 구간',
    sectionHeading: '악성 역병과 어둠의 변신',
    sectionIntro: '부정 죽음의 기사는 악성 역병을 깔고 고름 일격으로 하급 구울 재료를 만든 뒤, 사자의 군대와 어둠의 변신 안에서 부패와 영혼 수확자를 회수합니다.',
    caption: '악성 역병, 하급 구울 준비, 사자의 군대, 어둠의 변신, 부패, 영혼 수확자, 죽음의 고리와 전염병/괴저 고리/무덤 전환을 확인합니다.',
    definition: [
      ['의미', '하급 구울 재료와 부패 충전은 소환수 구간을 완성하기 위한 준비 상태이고, 사자의 군대와 어둠의 변신은 그 준비를 피해로 바꾸는 축입니다.'],
      ['읽는 법', '악성 역병이 비면 먼저 복구하고, 고름 일격으로 하급 구울 재료를 만든 뒤 어둠의 변신 안에서 부패와 영혼 수확자를 밀리지 않게 회수합니다. 대상 수와 금단의 지식 상태에 따라 죽음의 고리, 전염병, 괴저 고리, 무덤을 바꿉니다.'],
      ['체크 포인트', '악성 역병 공백, 하급 구울 준비 부족, 어둠의 변신 중 부패 충전 낭비, 영혼 수확자 지연, 죽음과 부패 위치 손실, 금단의 지식 소비기 전환 오류를 봅니다.'],
    ],
  },
  'deathknight-blood': {
    id: 'defensive',
    title: '죽음의 일격과 뼈의 보호막',
    sectionHeading: '맞기 전 준비와 맞은 뒤 회복',
    sectionIntro: '혈기 죽음의 기사는 맞고 나서 죽음의 일격으로 회복하지만, 실제 실력 차이는 맞기 전에 뼈의 보호막, 룬, 룬 마력, 춤추는 룬 무기를 준비하는 데 있습니다.',
    caption: '뼈의 보호막, 죽음의 일격, 룬 마력, 춤추는 룬 무기, 흡혈, 대마법 보호막을 피해 타이머와 묶습니다.',
    definition: [
      ['의미', '죽음의 일격은 피해를 받은 뒤 회복하는 핵심 생존기이고, 뼈의 보호막은 그 전에 깔아두는 기본 방어입니다.'],
      ['읽는 법', '큰 피해 전에는 뼈의 보호막과 룬 마력을 확보하고, 피해 직후 죽음의 일격이 들어갈 여지를 남깁니다.'],
      ['체크 포인트', '뼈의 보호막 5중첩 미만, 룬 마력 부족, 죽음의 일격 선사용, 춤추는 룬 무기 지연, 마법 피해 대응 누락을 봅니다.'],
    ],
  },
  'druid-balance': {
    id: 'resource',
    title: '일월식과 천공의 힘',
    sectionHeading: '월식/일식 진입과 소비',
    sectionIntro: '조화 드루이드는 월식과 일식 상태에 맞춰 별빛섬광, 천벌, 별빛쇄도, 별똥별을 선택하고 천공의 힘을 넘치지 않게 비웁니다.',
    caption: '달빛섬광/태양섬광, 일월식, 천공의 힘, 별빛쇄도, 별똥별, 천체의 정렬과 영혼 소집을 확인합니다.',
    definition: [
      ['의미', '일월식은 어떤 주문이 강해지는지 정하는 상태이고, 천공의 힘은 별빛쇄도나 별똥별로 바뀌는 자원입니다.'],
      ['읽는 법', 'DoT를 먼저 유지하고, 일월식에 맞는 생성기로 천공의 힘을 만든 뒤 단일은 별빛쇄도, 광역은 별똥별로 소비합니다.'],
      ['체크 포인트', '일월식 없는 시전, 천공의 힘 과충전, DoT 공백, 천체의 정렬 지연, 광역 별똥별 전환 누락을 봅니다.'],
    ],
  },
  'druid-restoration': {
    id: 'uptime',
    title: '12.1 첫 피해 대응 타임라인',
    sectionHeading: '풍요 재생과 상록숲 만개',
    sectionIntro: '회복 드루이드는 회복 5개로 풍요를 켠 뒤 재생을 반복하고, 피어나는 생명 대상에 신속한 치유를 사용해 상록숲 3연속 만개를 일으킵니다. 큰 치유 기술은 이 두 반복 위에 피해 시간에 맞춰 올립니다.',
    caption: '피어나는 생명 유지, 회복 5개, 신속한 치유와 상록숲 만개, 급속 성장, 풍요 재생, 자연의 신속함-재생, 평온 준비를 한 흐름으로 확인합니다.',
    definition: [
      ['의미', '유지 주문, 풍요 조건, 직접 치유, 큰 피해 대응이 어떤 순서로 이어지는지 보여 줍니다.'],
      ['읽는 법', '피어나는 생명과 꽃피우기를 먼저 고정하고, 회복 5개로 풍요를 켠 뒤 신속한 치유·급속 성장·재생을 실제 피해에 맞춥니다.'],
      ['체크 포인트', '피어나는 생명 공백, 회복 5개 미달, 신속한 치유 충전 방치, 피해 없는 급속 성장, 풍요 없이 쓴 재생을 봅니다.'],
    ],
  },
  'druid-guardian': {
    id: 'defensive',
    title: '첫 풀 방어 흐름',
    sectionHeading: '위협과 완화 배정',
    sectionIntro: '수호 드루이드는 체력으로 버티는 탱커가 아니라 첫 풀부터 다음 피해 유형에 맞춰 위협, 무쇠가죽, 광포한 재생력, 생존기를 배정하는 탱커입니다.',
    caption: '난타, 달빛섬광, 무쇠가죽, 광포한 재생력, 생존 본능, 나무 껍질과 군중 제어를 한 흐름으로 확인합니다.',
    definition: [
      ['의미', '무쇠가죽은 물리 피해 완화, 광포한 재생력은 이미 받은 피해 회복, 생존기는 큰 위험 구간 대응입니다.'],
      ['읽는 법', '풀 진입에는 위협과 무쇠가죽을 먼저 보고, 마법이나 출혈 피해는 나무 껍질과 생존기로 따로 배정합니다.'],
      ['체크 포인트', '첫 풀 무쇠가죽 공백, 광포한 재생력 과소비, 생존기 중복, 달빛섬광 위치 손실, 큰 피해 전 방어기 없음 상태를 봅니다.'],
    ],
  },
  'druid-feral': {
    id: 'uptime',
    title: '출혈 유지와 호랑이의 분노',
    sectionHeading: '강화 출혈과 발동 전환',
    sectionIntro: '야성 드루이드는 갈퀴 발톱, 도려내기, 원시 분노를 어떤 강화 상태로 유지하는지와 호랑이의 분노 구간이 어떻게 겹치는지가 핵심입니다.',
    caption: '갈퀴 발톱, 도려내기, 원시 분노, 호랑이의 분노, 광폭화, 흉포한 이빨, 쐐기 발톱 전환을 확인합니다.',
    definition: [
      ['의미', '출혈은 야성의 피해 바탕이고, 호랑이의 분노와 광폭화는 그 출혈과 마무리 기술 가치를 끌어올리는 구간입니다.'],
      ['읽는 법', '출혈이 끊기기 전에 갱신하고, 강한 구간에는 흉포한 이빨이나 원시 분노가 낮은 가치로 빠지지 않는지 봅니다.'],
      ['체크 포인트', '갈퀴 발톱/도려내기 공백, 호랑이의 분노 지연, 기력 과충전, 연계 점수 과충전, 광역 원시 분노 누락을 봅니다.'],
    ],
  },
  'hunter-beastmastery': {
    id: 'uptime',
    title: '야수의 격노와 광역 준비',
    sectionHeading: '야수의 격노 유지 흐름',
    sectionIntro: '야수 사냥꾼은 야수의 격노 구간을 자주 열고, 살상 명령, 날카로운 사격, 야수의 회전베기 조건을 같은 시간에 맞춥니다.',
    caption: '야수의 격노, 살상 명령, 날카로운 사격, 야생의 부름, 야수의 회전베기, 마구 쏘기와 영웅 특성 보상을 확인합니다.',
    definition: [
      ['의미', '야수의 격노는 중심 피해 구간이고, 날카로운 사격과 살상 명령은 그 구간을 자주 여는 입력입니다.'],
      ['읽는 법', '날카로운 사격 충전을 낭비하지 않고, 광역에서는 야수의 회전베기가 켜진 상태에서 야수의 격노가 들어가는지 봅니다.'],
      ['체크 포인트', '야수의 격노 지연, 날카로운 사격 2충전 방치, 살상 명령 지연, 광역 회전베기 공백, 영웅 특성 보상 누락을 봅니다.'],
    ],
  },
  'hunter-marksmanship': {
    id: 'uptime',
    title: '조준 사격과 정밀 사격',
    sectionHeading: '큰 시전과 발동 소비',
    sectionIntro: '사격 사냥꾼은 조준 사격 충전, 속사, 정밀 사격 소비, 교묘한 사격 광역 조건이 같은 시간에 어떻게 겹치는지 봐야 합니다.',
    caption: '조준 사격, 속사, 정밀 사격, 교묘한 사격, 정조준, 검은 화살, 달빛 회전 표창과 울부짖는 화살을 확인합니다.',
    definition: [
      ['의미', '조준 사격은 중심 시전이고, 정밀 사격은 다음 큰 시전을 더 강하게 만드는 발동입니다.'],
      ['읽는 법', '조준 사격 충전이 넘치지 않게 쓰고, 속사 뒤 정밀 사격을 다음 조준 사격 전에 소비합니다. 광역은 교묘한 사격 조건을 먼저 봅니다.'],
      ['체크 포인트', '조준 사격 2충전 방치, 정밀 사격 낭비, 속사 지연, 정조준 중 약한 시전, 광역 교묘한 사격 누락을 봅니다.'],
    ],
  },
  'hunter-survival': {
    id: 'resource',
    title: '창끝 생성과 소비',
    sectionHeading: '창끝과 제압 타이밍',
    sectionIntro: '생존 사냥꾼은 살상 명령으로 창끝을 만들고, 창끝을 제압, 야생불 폭탄, 붐스틱, 랩터 계열 소비기에 배정합니다.',
    caption: '살상 명령, 창끝, 제압, 야생불 폭탄, 붐스틱, 랩터의 일격/휩쓸기, 무리의 지도자 보상을 확인합니다.',
    definition: [
      ['의미', '창끝은 다음 직접 피해를 강화하는 핵심 버프이고, 살상 명령은 창끝과 집중을 만드는 생성기입니다.'],
      ['읽는 법', '제압 전 창끝과 강한 소비기를 준비하고, 광역에서는 전방 기술이 실제 대상에게 맞는지 함께 봅니다.'],
      ['체크 포인트', '창끝 3중첩 방치, 살상 명령 지연, 제압 전 준비 부족, 야생불 폭탄 2충전, 붐스틱 각도 손실을 봅니다.'],
    ],
  },
  'mage-fire': {
    id: 'cooldown',
    title: '발화와 몰아치는 열기',
    sectionHeading: '발동 상태와 극딜 흐름',
    sectionIntro: '화염 마법사는 발화, 열기, 몰아치는 열기!, 불사조의 불길, 화염 작렬 충전이 같은 구간 안에서 끊기지 않는지 봐야 합니다.',
    caption: '발화, 열기, 몰아치는 열기!, 화염 작렬, 불사조의 불길, 불기둥 광역 전환과 생존기 보존을 확인합니다.',
    definition: [
      ['의미', '발화는 화염의 중심 극딜 구간이고, 몰아치는 열기!는 그 안에서 즉시 강한 주문으로 바뀌는 상태입니다.'],
      ['읽는 법', '발화 전에 화염 작렬 충전과 열기를 준비하고, 발화 중에는 열기를 몰아치는 열기!로 바꾸는 흐름이 끊기지 않게 봅니다.'],
      ['체크 포인트', '발화 지연, 열기 손실, 화염 작렬 과충전, 몰아치는 열기 방치, 광역 불기둥 전환 누락을 봅니다.'],
    ],
  },
  'mage-arcane': {
    id: 'resource',
    title: '비전 쇄도와 마나 소비',
    sectionHeading: '마나와 큰 구간 흐름',
    sectionIntro: '비전 마법사는 비전 쇄도, 비전의 여파, 비전 보주, 비전 탄막, 비전 연사를 같은 구간에 배치하고 마나를 극딜 연료로 씁니다.',
    caption: '비전 쇄도 예열, 비전의 여파 45초 구간, 비전 보주, 비전 탄막, 마나 회복과 비전 연사 소비를 확인합니다.',
    definition: [
      ['의미', '비전 쇄도는 큰 피해 구간을 여는 버튼이고, 마나는 그 안에서 강한 주문을 밀어 넣기 위한 연료입니다.'],
      ['읽는 법', '큰 구간 전에는 마나와 충전물을 준비하고, 구간 안에서는 비전 보주와 발동을 비전 연사/탄막으로 정리합니다.'],
      ['체크 포인트', '비전 쇄도 지연, 비전의 여파 어긋남, 마나 부족, 비전 보주 충전 방치, 비전 연사 과소비를 봅니다.'],
    ],
  },
  'evoker-devastation': {
    id: 'resource',
    title: '용의 분노와 해방된 불길',
    sectionHeading: '극딜과 종료 뒤 4회 소비',
    sectionIntro: '황폐 기원사는 용의 분노 안에서 강화 주문으로 지속시간을 늘리고 정수 폭발을 비운 뒤, 종료 후 분노 상승이 남은 동안 해방된 불길 4회를 자원 상태에 맞춰 소비합니다.',
    caption: '깊은 숨결, 용의 분노, 불의 숨결, 영원의 쇄도, 하늘빛 휩쓸기, 대규모 파열, 정수 폭발, 해방된 불길을 하나의 전투 흐름으로 확인합니다.',
    definition: [
      ['의미', '용의 분노는 정수 폭발을 계속 만들고, 적개심은 불의 숨결과 영원의 쇄도로 지속시간을 늘립니다. 해방된 불길은 종료 뒤 정수 폭발을 직접 만드는 후속 버튼입니다.'],
      ['읽는 법', '용의 분노 전 자원을 비우고 강화 주문을 준비합니다. 종료 뒤에는 정수가 4 미만이고 정수 폭발이 없을 때 해방된 불길을 눌러 새 소비기로 이어 갑니다.'],
      ['체크 포인트', '용의 분노 전 정수 과충전, 강화 주문 지연, 하늘빛 휩쓸기 방치, 대규모 파열 채널 손실, 해방된 불길 4회 미소비, 광역 기염 전환 누락을 봅니다.'],
    ],
  },
  'priest-discipline': {
    id: 'defensive',
    title: '속죄 예열과 피해 회수',
    sectionHeading: '속죄 준비와 외생기 배정',
    sectionIntro: '수양 사제는 피해 전에 속죄와 보호막을 깔고, 피해 직후 회개와 정신 분열로 회수하는 선제형 힐러입니다. 구버전 보호막 강화 스킬명을 현재 쓰는 스킬처럼 보지 말고, 사도, 광휘, 공허의 보호막, 직접 복구 흐름을 기준으로 판단합니다.',
    caption: '신의 권능: 보호막, 공허의 보호막, 신의 권능: 광휘, 사도, 회개, 정신 분열, 궁극의 참회, 방벽과 외생기 배정을 확인합니다.',
    definition: [
      ['의미', '속죄는 피해 주문을 치유로 바꾸는 준비 상태이고, 보호막과 외생기는 큰 피해 전에 먼저 들어가야 합니다.'],
      ['읽는 법', '피해 전에는 속죄 대상 수와 광휘 충전을 보고, 피해 직후에는 회개와 정신 분열이 속죄가 남은 동안 들어가는지 확인합니다.'],
      ['체크 포인트', '속죄 예열 늦음, 광휘 과소비, 보호막 누락, 궁극의 참회와 사도 중복, 방벽 배정 오류를 봅니다.'],
    ],
  },
  'priest-holy': {
    id: 'cooldown',
    title: '평온-축도 복구와 큰 힐 배정',
    sectionHeading: '평온에서 시작하는 12.1 복구 흐름',
    sectionIntro: '신성 사제는 평온으로 위험 대상을 살리고, 평온이 만든 축도와 우주의 파장, 빛술사 치유의 기원으로 남은 파티 피해를 정리합니다. 공격대 집정관은 후광과 절정을, 쐐기 예언자는 회복의 기원 2충전과 궁극의 평온을 이 흐름에 맞춥니다.',
    caption: '빛의 권능: 평온, 축도, 우주의 파장, 빛술사, 치유의 기원, 회복의 기원, 절정, 후광, 천상의 찬가와 수호 영혼의 관계를 확인합니다.',
    definition: [
      ['의미', '평온은 단일 치유에 그치지 않고 다음 축도를 확정 생성합니다. 축도는 우주의 파장과 빛술사를 만들어 단일 복구를 광역 복구로 이어 줍니다.'],
      ['읽는 법', '평온 다음에 축도가 실제로 시전됐는지, 축도 뒤 빛술사 치유의 기원이 이어졌는지 봅니다. 집정관은 후광-절정, 예언자는 회복의 기원-궁극의 평온을 따로 확인합니다.'],
      ['체크 포인트', '평온과 축도 시전 수 차이, 축도 2중첩 방치, 강화 없는 치유의 기원, 절정 안 평온 횟수, 회복의 기원 최대 충전, 수호 영혼과 자기 생존기 시점을 봅니다.'],
    ],
  },
  'evoker-preservation': {
    id: 'uptime',
    title: '꿈의 숨결-축복-꽃 반복',
    sectionHeading: '12.1의 짧은 회복 반복',
    sectionIntro: '꿈의 숨결로 지속 치유와 메리스라의 축복을 먼저 만들고, 시간 변칙과 직접 메아리로 피해 대상을 준비한 뒤 축복으로 회수합니다. 정수 폭발은 무료 에메랄드 꽃에 써 다음 쌍둥이 메아리를 만듭니다.',
    caption: '꿈의 숨결, 시간 변칙, 직접 메아리, 메리스라의 축복, 정수 폭발 에메랄드 꽃, 화염 흡수와 대형 쿨다운의 관계를 확인합니다.',
    definition: [
      ['의미', '12.1 보존의 기본 단위는 꿈의 숨결 지속 치유, 메아리 준비, 메리스라의 축복 회수, 무료 꽃과 쌍둥이 메아리의 네 단계입니다.'],
      ['읽는 법', '꿈의 숨결은 메아리보다 먼저, 시간 변칙과 직접 메아리는 피해 직전, 축복은 피해가 시작된 뒤, 정수 폭발 꽃은 실제로 다친 대상에게 사용합니다.'],
      ['체크 포인트', '꿈의 숨결 충전 정체, 축복 발동 미사용, 잘못된 메아리 대상, 자연 정수 꽃, 쌍둥이 메아리 2중첩 손실, 화염 흡수 유효 치유를 봅니다.'],
    ],
  },
  'evoker-augmentation': {
    id: 'uptime',
    title: '칠흑의 힘과 예지 유지',
    sectionHeading: '파티 버프와 강화 구간',
    sectionIntro: '증강 기원사는 개인 DPS보다 칠흑의 힘, 예지, 영겁의 숨결, 파티 극딜 타이밍이 맞는지가 더 중요합니다.',
    caption: '칠흑의 힘, 예지, 영겁의 숨결, 분출, 강화 주문, 아군 쿨기와 탱커 지원을 함께 확인합니다.',
    definition: [
      ['의미', '증강의 핵심 데이터는 개인 딜이 아니라 버프가 누구에게, 언제, 얼마나 유지됐는지입니다.'],
      ['읽는 법', '칠흑의 힘 유지율을 먼저 보고, 예지 대상과 영겁의 숨결이 파티 극딜 구간에 맞았는지 확인합니다.'],
      ['체크 포인트', '칠흑의 힘 공백, 예지 대상 오류, 영겁의 숨결이 파티 쿨기와 어긋남, 분출 지연, 탱커 지원 누락을 봅니다.'],
    ],
  },
};

function getInlineChartPlan(guide, data) {
  const plan = [
    {
      id: 'rotation',
      title: getFlowChartTitle(guide),
      caption: '본문에서 설명한 첫 전투 흐름, 진입, 피해 대응 판단을 시간 순서로 정리한 차트입니다.',
    },
    {
      id: 'priority',
      title: '우선순위 판단',
      caption: '위에서 설명한 조건을 전투 중 어떤 순서로 확인해야 하는지 정리합니다.',
    },
  ];

  const specialistChart = SPECIALIST_CHARTS[guide.id];
  if (specialistChart) {
    plan.push(specialistChart);
    return plan;
  }

  if (guide.role === 'healers') {
    plan.push({
      id: 'defensive',
      title: '피해 대응 배치',
      sectionHeading: '피해 타이머별 회복 계획',
      sectionIntro: '힐러는 고정 순서보다 피해 타이머에 맞춘 준비와 복구가 중요합니다. 이 차트는 큰 피해 전후에 어떤 회복 수단을 배정해야 하는지 보여 줍니다.',
      caption: '피해 전 준비, 피해 직후 복구, 단일 대상 외생기, 큰 쿨기 분배를 확인하는 차트입니다.',
      definition: [
        ['의미', '회복 수단을 한 피해에 모두 겹치지 않고 다음 피해까지 남기는 계획표입니다.'],
        ['읽는 법', '피해 전 준비와 피해 후 복구를 나눠 보고, 큰 쿨기가 같은 파도에 몰렸는지 확인합니다.'],
        ['체크 포인트', '예열 부족, 쿨기 중복, 외생기 지연, 마나 과소비를 봅니다.'],
      ],
    });
    return plan;
  }

  if (guide.role === 'tanks') {
    plan.push({
      id: 'defensive',
      title: '생존기 배치',
      sectionHeading: '다음 큰 피해 기준 방어 계획',
      sectionIntro: '탱커는 받은 피해를 보고 누르는 것이 아니라 다음 위험 구간에 맞춰 방어기를 나눠야 합니다. 이 차트는 방어 공백을 찾는 용도입니다.',
      caption: '기본 완화, 큰 생존기, 자원형 방어기, 마법/물리 대응을 구분해 확인합니다.',
      definition: [
        ['의미', '방어기는 쿨마다 쓰는 기술이 아니라 다음 위험 구간을 덮는 안전장치입니다.'],
        ['읽는 법', '큰 피해 전 기본 완화가 켜졌는지 보고, 생존기가 같은 구간에 중복됐는지 확인합니다.'],
        ['체크 포인트', '방어 공백, 생존기 중복, 자원 부족, 마법 피해 대응 누락을 봅니다.'],
      ],
    });
    return plan;
  }

  plan.push({
    id: 'resource',
    title: '자원 흐름',
    sectionHeading: '생성, 보존, 소비 판단',
    sectionIntro: '딜러는 강한 기술을 언제 쓰는지만큼 자원을 언제 비워야 하는지도 중요합니다. 이 차트는 과충전과 약한 소비를 찾는 보조표입니다.',
    caption: '자원 생성, 발동 처리, 강한 소비기, 광역 전환을 같은 흐름에서 확인합니다.',
    definition: [
      ['의미', '자원은 강한 기술을 쓰기 위한 재료이고, 넘치거나 낮은 가치로 소비하면 손실이 납니다.'],
      ['읽는 법', '자원이 넘치기 전 소비하고, 큰 쿨기 구간에는 강한 소비기가 들어가는지 봅니다.'],
      ['체크 포인트', '자원 과충전, 발동 방치, 쿨기 지연, 광역 전환 누락을 봅니다.'],
    ],
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
              <span>{renderGuideText(label, inlineTerms)}</span>
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
  const healerPhases = ['사전 배치', '피해 직전', '힐업 구간', '복구/안정화'];
  const tankPhases = ['진입', '방어 기반', '자원 확보', '안정화'];
  const damagePhases = ['진입', '기반 준비', '극딜 구간', '순환 전환'];
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
  if (/극딜/.test(phase)) return '쿨기·자원 소비 구간';
  if (index >= total - 1) return '우선순위 흐름으로 전환';
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

function getDefaultOpenerFlowSteps(data, profile, guide) {
  const source = (data?.rotationSource?.length ? data.rotationSource : data?.featuredSkills || [])
    .slice(0, OPENER_FLOW_MAX_STEPS);

  return source.map((skill, index) => {
    const phase = getFlowPhaseLabel(guide, index, Math.max(source.length, 1));
    return {
      key: `default-flow-${skill.id}-${index}`,
      skill,
      label: profile.steps[index] || `${index + 1}단계`,
      note: skillName(skill),
      stage: phase,
      phase,
      trigger: getFlowTriggerLabel(guide, phase, index, Math.max(source.length, 1)),
    };
  });
}

function getFlowCardTitle(guide) {
  if (guide?.role === 'healers') return '피해 대응 전투 흐름';
  if (guide?.role === 'tanks') return '풀링/방어 전투 흐름';
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
      middle: '위협 → 방어 수단 → 생존기 배정',
      end: '다음 위험',
      keys: ['진입 버튼', '방어 조건', '위험 대응'],
    };
  }

  if (guide?.role === 'support') {
    return {
      start: '준비',
      middle: '강화 → 대상 확인 → 파티 구간',
      end: '다음 강화',
      keys: ['강화 시작', '대상 조건', '파티 구간'],
    };
  }

  return {
    start: '전투 시작',
    middle: '준비 → 큰 구간 → 우선순위 흐름',
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
        <span>{displayGuideText(mapCopy.start)}</span>
        <strong>{displayGuideText(mapCopy.middle)}</strong>
        <span>{displayGuideText(mapCopy.end)}</span>
      </OpenerFlowMapHeader>
      <OpenerFlowKey aria-label="전투 흐름 기준">
        {mapCopy.keys.map(item => (
          <span key={item}>{displayGuideText(item)}</span>
        ))}
      </OpenerFlowKey>
      {stageLegend.length > 1 && (
        <OpenerFlowPhaseLegend aria-label="전투 흐름 단계">
          {stageLegend.map(phase => (
            <span key={phase}>{displayGuideText(phase)}</span>
          ))}
        </OpenerFlowPhaseLegend>
      )}
      <OpenerFlowList $color={guide.color} aria-label={chartLabel} data-opener-flow-rail>
        {flowItems.map((step, index) => (
          <li key={step.key}>
            <OpenerStepTop>
              <OpenerStepNumber>{String(index + 1).padStart(2, '0')}</OpenerStepNumber>
              <SkillIconLink skill={step.skill} size={46} />
            </OpenerStepTop>
            <OpenerStepBody>
              <OpenerPhase>{displayGuideText(step.phase)}</OpenerPhase>
              <strong>{displayGuideText(step.label)}</strong>
              <OpenerTrigger>{displayGuideText(step.trigger)}</OpenerTrigger>
              {!!step.note && <p>{renderGuideText(step.note, inlineTerms)}</p>}
            </OpenerStepBody>
          </li>
        ))}
      </OpenerFlowList>
    </OpenerFlowViewport>
  );
}

function NarrativeGuideSection({ guide, manuscript, data, profile, chartPlan, inlineTerms }) {
  const [tipsExpanded, setTipsExpanded] = useState(false);
  const [activeHeroBranchIndex, setActiveHeroBranchIndex] = useState(0);

  useEffect(() => {
    setTipsExpanded(false);
    setActiveHeroBranchIndex(0);
  }, [guide?.id]);

  if (!manuscript) return null;

  const contentBlocks = (manuscript.blocks || []).filter(block => !isMetaChartBlock(block));
  const openerBlocks = contentBlocks.filter(block => isOpenerNarrativeBlock(block, guide));
  const openerBlock = openerBlocks[0];
  const bodyBlocks = contentBlocks.filter(block => !isOpenerNarrativeBlock(block, guide));
  const [rotationChart, priorityChart, specialistChart] = chartPlan;
  const digestBlocks = bodyBlocks;
  const manualOpenerFlowSteps = getOpenerFlowSteps(manuscript, profile, guide);
  const openerFallbackItems = openerBlocks
    .flatMap(block => [
      ...(block.bullets || []),
      ...(block.paragraphs || []),
    ])
    .slice(0, OPENER_FLOW_MAX_STEPS);
  const defaultOpenerFlowSteps = !manualOpenerFlowSteps.length && !openerFallbackItems.length
    ? getDefaultOpenerFlowSteps(data, profile, guide)
    : [];
  const openerFlowSteps = manualOpenerFlowSteps.length ? manualOpenerFlowSteps : defaultOpenerFlowSteps;
  const openerIntroTitle = manuscript.opener?.title || openerBlock?.title || profile.cycleTitle;
  const openerIntroSummary = manuscript.opener?.summary || openerBlock?.paragraphs?.[0] || profile.lead;
  const tipItems = manuscript.tips?.length
    ? manuscript.tips
    : bodyBlocks.flatMap(block => block.bullets || []).slice(0, 5);
  const visibleTipItems = tipsExpanded ? tipItems : tipItems.slice(0, TIP_PREVIEW_LIMIT);
  const hiddenTipCount = Math.max(tipItems.length - visibleTipItems.length, 0);
  const heroBranches = (manuscript.heroBranches || []).filter(branch => branch?.label || branch?.summary);
  const activeHeroBranch = heroBranches[activeHeroBranchIndex] || heroBranches[0];
  const heroBranchComparisonRows = HERO_BRANCH_DETAIL_LABELS
    .map((label, detailIndex) => ({
      label,
      cells: heroBranches
        .map(branch => ({
          branchLabel: branch.label,
          text: branch.bullets?.[detailIndex],
        }))
        .filter(cell => cell.text),
    }))
    .filter(row => row.cells.length);
  const hasOpenerGuide = !!openerFlowSteps.length || !!openerFallbackItems.length;
  const hasSupportCards = !!manuscript.playstyle?.length || !!tipItems?.length;

  return (
    <SectionBlock id="guide-core">
      <SectionHead>
        <SectionIcon><BookOpen size={17} /></SectionIcon>
        <div>
          <SectionKicker>guide</SectionKicker>
          <SectionTitle>공략 핵심</SectionTitle>
        </div>
      </SectionHead>

      <PaperLead $color={guide.color}>
        <div>
          <ManuscriptStatus>먼저 기억할 것</ManuscriptStatus>
          <p>{renderGuideText(manuscript.playstyle?.[0]?.text || manuscript.summary, inlineTerms)}</p>
        </div>
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
            <FlowCardHeadText>
              <strong>{getFlowChartTitle(guide)}</strong>
              {!!openerIntroTitle && (
                <span>{renderGuideText(openerIntroTitle, inlineTerms)}</span>
              )}
            </FlowCardHeadText>
          </FieldGuideCardHead>
          <OpenerFlowPreview guide={guide} steps={openerFlowSteps} fallbackItems={openerFallbackItems} inlineTerms={inlineTerms} />
          {!!openerIntroSummary && (
            <OpenerFlowIntro>
              <strong>차트 읽는 법</strong>
              <p>{renderGuideText(openerIntroSummary, inlineTerms)}</p>
            </OpenerFlowIntro>
          )}
        </OpenerFlowCard>
      )}

      {hasSupportCards && (
        <FieldGuideGrid $color={guide.color}>
          {!!manuscript.playstyle?.length && (
            <FieldGuideCard $color={guide.color} $wide="full">
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
            <TipGuideCard $color={guide.color} $wide="full" data-guide-block="tip-summary">
              <FieldGuideCardHead>
                <Sparkles size={15} />
                <strong>실전 꿀팁</strong>
              </FieldGuideCardHead>
              <TipList $compact={!tipsExpanded && hiddenTipCount > 0} $expanded={tipsExpanded}>
                {visibleTipItems.map(item => (
                  <li key={item}>{renderGuideText(item, inlineTerms)}</li>
                ))}
              </TipList>
              {tipItems.length > TIP_PREVIEW_LIMIT && (
                <TipListControls>
                  <TipExpandButton
                    type="button"
                    aria-expanded={tipsExpanded}
                    onClick={() => setTipsExpanded(current => !current)}
                  >
                    {tipsExpanded ? '접기' : `${hiddenTipCount}개 더 보기`}
                  </TipExpandButton>
                </TipListControls>
              )}
            </TipGuideCard>
          )}
        </FieldGuideGrid>
      )}

      {!!heroBranches.length && (
        <HeroBranchSection $color={guide.color} data-guide-block="hero-branches">
          <HeroBranchSectionHead>
            <FieldGuideCardHead>
              <Sparkles size={15} />
              <div>
                <strong>영웅특성별 개별 운용 가이드</strong>
                <span>실제 빌드에 맞는 영웅 특성을 선택해 시작 흐름, 우선순위와 로그 확인 기준을 따로 읽습니다.</span>
              </div>
            </FieldGuideCardHead>
          </HeroBranchSectionHead>
          {heroBranches.length > 1 && (
            <HeroBranchTabs role="group" aria-label="영웅 특성 선택">
              {heroBranches.map((branch, index) => (
                <HeroBranchTab
                  key={`${branch.label}-tab`}
                  type="button"
                  aria-pressed={activeHeroBranchIndex === index}
                  $active={activeHeroBranchIndex === index}
                  $color={guide.color}
                  onClick={() => setActiveHeroBranchIndex(index)}
                >
                  {renderGuideText(branch.label, inlineTerms)}
                </HeroBranchTab>
              ))}
            </HeroBranchTabs>
          )}
          <HeroBranchGrid $color={guide.color}>
            {[activeHeroBranch].filter(Boolean).map(branch => {
              const branchSkills = (branch.skillIds || []).map(skillFromBranchId).filter(Boolean);
              const branchFlowNote = branch.bullets?.[0];
              const branchFocusItems = branch.bullets?.slice(1) || [];
              const branchFlowSkills = branchSkills.slice(0, 5);
              return (
                <HeroBranchCard
                  key={`${branch.label}-${branch.summary}`}
                  $color={guide.color}
                  aria-label={`${branch.label} 영웅특성 운용 가이드`}
                  role="region"
                >
                  <HeroBranchCardTop>
                    <FieldGuideCardHead>
                      <Sparkles size={15} />
                      <HeroBranchTitle>
                        <span>분기별 운용</span>
                        <strong>{renderGuideText(branch.label, inlineTerms)}</strong>
                      </HeroBranchTitle>
                    </FieldGuideCardHead>
                    {!!branch.summary && (
                      <HeroBranchReason>
                        <span>선택 기준</span>
                        <p>{renderGuideText(branch.summary, inlineTerms)}</p>
                      </HeroBranchReason>
                    )}
                  </HeroBranchCardTop>
                  {!!branchSkills.length && (
                    <HeroBranchSkillBlock>
                      <span>분기 핵심 스킬/특성</span>
                      <HeroBranchSkillList>
                        {branchSkills.map(skill => (
                          <li key={`${branch.label}-${skill.id}`}>
                            <SkillIconLink skill={skill} size={28} />
                            <span>{renderGuideText(skillName(skill), inlineTerms)}</span>
                          </li>
                        ))}
                      </HeroBranchSkillList>
                    </HeroBranchSkillBlock>
                  )}
                  {!!branchFlowNote && (
                    <HeroBranchFlowStrip $color={guide.color}>
                      <div>
                        <span>공통과 달라지는 첫 흐름</span>
                        {!!branchFlowSkills.length && (
                          <HeroBranchFlowIcons aria-label={`${branch.label} 핵심 흐름 스킬`}>
                            {branchFlowSkills.map(skill => (
                              <SkillIconLink key={`${branch.label}-flow-${skill.id}`} skill={skill} size={30} />
                            ))}
                          </HeroBranchFlowIcons>
                        )}
                      </div>
                      <p>{renderGuideText(branchFlowNote, inlineTerms)}</p>
                    </HeroBranchFlowStrip>
                  )}
                  {!!branchFocusItems.length && (
                    <HeroBranchFocusList>
                      {branchFocusItems.map((item, itemIndex) => (
                        <li key={item}>
                          <b>{HERO_BRANCH_DETAIL_LABELS[itemIndex + 1] || HERO_BRANCH_DETAIL_LABELS[HERO_BRANCH_DETAIL_LABELS.length - 1]}</b>
                          <p>{renderGuideText(item, inlineTerms)}</p>
                        </li>
                      ))}
                    </HeroBranchFocusList>
                  )}
                </HeroBranchCard>
              );
            })}
          </HeroBranchGrid>
          {!!heroBranchComparisonRows.length && heroBranches.length > 1 && (
            <HeroBranchComparison $color={guide.color} aria-label="영웅특성 분기 비교">
              <HeroBranchComparisonHead>
                <strong>영웅특성별 차이 빠르게 보기</strong>
                <span>첫 흐름, 선택 기준, 주의점, 로그 검수 지표를 같은 축으로 비교합니다.</span>
              </HeroBranchComparisonHead>
              <HeroBranchComparisonBody>
                {heroBranchComparisonRows.map(row => (
                  <HeroBranchComparisonRow key={row.label}>
                    <HeroBranchComparisonAxis>{row.label}</HeroBranchComparisonAxis>
                    <HeroBranchComparisonCells $columns={Math.max(row.cells.length, 1)}>
                      {row.cells.map(cell => (
                        <HeroBranchComparisonCell key={`${row.label}-${cell.branchLabel}`}>
                          <b>{renderGuideText(cell.branchLabel, inlineTerms)}</b>
                          <p>{renderGuideText(cell.text, inlineTerms)}</p>
                        </HeroBranchComparisonCell>
                      ))}
                    </HeroBranchComparisonCells>
                  </HeroBranchComparisonRow>
                ))}
              </HeroBranchComparisonBody>
            </HeroBranchComparison>
          )}
        </HeroBranchSection>
      )}

      {!!digestBlocks.length && (
        <GuideDigestGrid aria-label="세부 공략 목차">
          {digestBlocks.map((block, index) => {
            const digest = block.bullets?.[0] || block.paragraphs?.[0];
            return (
              <GuideDigestCard key={`${block.title}-${index}`} href={`#guide-section-${index + 1}`}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{displayGuideText(block.title.replace(/^\d+\.\s*/, ''))}</strong>
                {!!digest && <p>{displayGuideText(digest)}</p>}
              </GuideDigestCard>
            );
          })}
        </GuideDigestGrid>
      )}

      <PaperBody>
        {bodyBlocks.map((block, index) => {
          const primaryBullets = block.bullets?.slice(0, 2) || [];
          const detailBullets = block.bullets?.slice(2) || [];
          const allBullets = block.bullets || [];
          const practicalTipBlock = isPracticalTipBlock(block);

          if (practicalTipBlock) {
            return (
              <React.Fragment key={`${block.title}-${index}`}>
                <PaperSection id={`guide-section-${index + 1}`} $fullWidth>
                  <PracticalTipSection $color={guide.color} data-guide-block="practical-tips">
                    <PracticalTipHeader>
                      <div>
                        <SectionNumber>{String(index + 1).padStart(2, '0')}</SectionNumber>
                        <h3>{renderGuideText(block.title, inlineTerms)}</h3>
                      </div>
                      {!!block.paragraphs?.length && (
                        <PracticalTipIntro>
                          {block.paragraphs.map(paragraph => (
                            <p key={paragraph}>{renderGuideText(paragraph, inlineTerms)}</p>
                          ))}
                        </PracticalTipIntro>
                      )}
                    </PracticalTipHeader>

                    {!!allBullets.length && (
                      <PracticalTipGrid>
                        {allBullets.map((item, bulletIndex) => (
                          <PracticalTipItem
                            key={item}
                            $color={guide.color}
                            $primary={bulletIndex < 2}
                            data-primary-tip={bulletIndex < 2 ? 'true' : undefined}
                          >
                            <span>{bulletIndex < 2 ? '핵심' : `TIP ${bulletIndex - 1}`}</span>
                            <p>{renderGuideText(item, inlineTerms)}</p>
                          </PracticalTipItem>
                        ))}
                      </PracticalTipGrid>
                    )}
                  </PracticalTipSection>
                </PaperSection>

                {index === 0 && rotationChart && !hasOpenerGuide && (
                  <InlineFigure chart={rotationChart} guide={guide} data={data} profile={profile} manuscript={manuscript} inlineTerms={inlineTerms} />
                )}
              </React.Fragment>
            );
          }

          return (
          <React.Fragment key={`${block.title}-${index}`}>
            <PaperSection id={`guide-section-${index + 1}`} $fullWidth={practicalTipBlock}>
              <PaperSectionBody $wide={practicalTipBlock}>
                <SectionNumber>{String(index + 1).padStart(2, '0')}</SectionNumber>
                <h3>{renderGuideText(block.title, inlineTerms)}</h3>
                {block.paragraphs?.map(paragraph => (
                  <p key={paragraph}>{renderGuideText(paragraph, inlineTerms)}</p>
                ))}
                {!!detailBullets.length && (
                  <ManuscriptList $columns={practicalTipBlock}>
                    {detailBullets.map(item => (
                      <li key={item}>{renderGuideText(item, inlineTerms)}</li>
                    ))}
                  </ManuscriptList>
                )}
              </PaperSectionBody>

              {!!primaryBullets.length && (
                <TakeawayPanel $color={guide.color} $wide={practicalTipBlock}>
                  <TakeawayLabel>핵심 체크</TakeawayLabel>
                  <TakeawayList $columns={practicalTipBlock}>
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
            <h3>{renderGuideText(specialistChart.sectionHeading || '핵심 흐름도', inlineTerms)}</h3>
            <p>
              {renderGuideText(
                specialistChart.sectionIntro || '위 설명에서 다룬 관계를 실제 전투에서 다시 확인할 수 있게 한눈에 모았습니다.',
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
  const guideNavBlocks = (manuscript?.blocks || [])
    .filter(block => !isMetaChartBlock(block))
    .filter(block => !isOpenerNarrativeBlock(block, guide));
  const playstyleItem = pattern => manuscript?.playstyle?.find(item => pattern.test(item.label));
  const overviewItems = [
    {
      label: '핵심 루프',
      text: playstyleItem(/한 줄|핵심/)?.text || manuscript?.playstyle?.[0]?.text || profile.lead,
    },
    {
      label: '공격대',
      text: playstyleItem(/레이드|공격대/)?.text || '공격대 피해 타이밍에 맞춰 주요 쿨기와 회복 수단을 배치합니다.',
    },
    {
      label: '쐐기',
      text: playstyleItem(/쐐기/)?.text || '파티 생존과 유틸 사용을 우선하며 다음 위험 구간을 준비합니다.',
    },
    {
      label: '로그에서 볼 것',
      text: playstyleItem(/확인|로그/)?.text || manuscript?.caveats?.[0] || '핵심 기술의 사용 횟수와 쿨다운 공백을 먼저 확인합니다.',
    },
  ];

  return (
    <Page>
      <Hero $color={guide.color} $tone={`${guide.color}18`}>
        <HeroTop>
          <BackLink to="/guide">
            <ArrowLeft size={16} />
            가이드 목록
          </BackLink>
          <HeroTopActions>
            {guide.id === 'evoker-preservation' && (
              <LogReportLink to="/guide/evoker/preservation/log-analysis">
                <BarChart3 size={15} aria-hidden="true" />
                <span>로그 분석</span>
              </LogReportLink>
            )}
            <PatchBadge>{manuscript ? `${manuscript.patch} · ${manuscript.status}` : CURRENT_PATCH_LABEL}</PatchBadge>
          </HeroTopActions>
        </HeroTop>
        <HeroGrid>
          <div>
            <HeroEyebrow>{guide.className} · {profile.label}</HeroEyebrow>
            <HeroTitle>{guide.spec} {guide.className} 가이드</HeroTitle>
            <HeroLead>
              {renderGuideText(
                manuscript?.playstyle?.[0]?.text || manuscript?.summary || `${guide.focus} ${profile.lead}`,
                inlineTerms
              )}
            </HeroLead>
          </div>
          <HeroStats>
            <HeroStat>
              <span>패치</span>
              <strong>{manuscript?.patch || CURRENT_PATCH_LABEL}</strong>
            </HeroStat>
            <HeroStat>
              <span>포지션</span>
              <strong>{profile.label}</strong>
            </HeroStat>
            <HeroStat>
              <span>업데이트</span>
              <strong>{manuscript?.researchedAt || '확인 중'}</strong>
            </HeroStat>
            <HeroStat>
              <span>출처</span>
              <strong>{manuscript?.sources?.length || 0}개</strong>
            </HeroStat>
          </HeroStats>
        </HeroGrid>
      </Hero>

      <GuideLayout>
        <GuideNav aria-label="가이드 목차">
          <GuideNavTitle>목차</GuideNavTitle>
          {[
            ['overview', '운용 요약'],
            ...(manuscript ? [['guide-core', '공략 핵심']] : []),
            ['skills', '핵심 스킬'],
            ['synergies', '시너지'],
            ['sources', '출처'],
          ].map(([id, label]) => (
            <GuideNavLink key={id} href={`#${id}`}>
              <span>{label}</span>
            </GuideNavLink>
          ))}
          {!!guideNavBlocks.length && (
            <GuideNavChapterGroup>
              <GuideNavGroupLabel>세부 공략</GuideNavGroupLabel>
              {guideNavBlocks.map((block, index) => (
                <GuideNavLink key={`${block.title}-${index}`} href={`#guide-section-${index + 1}`} $chapter>
                  <small>{String(index + 1).padStart(2, '0')}</small>
                  <span>{displayGuideText(block.title.replace(/^\d+\.\s*/, ''))}</span>
                </GuideNavLink>
              ))}
            </GuideNavChapterGroup>
          )}
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
              {overviewItems.map(item => (
                <SummaryItem key={item.label}>
                  <SummaryLabel>{item.label}</SummaryLabel>
                  <SummaryText>{renderGuideText(item.text, inlineTerms)}</SummaryText>
                </SummaryItem>
              ))}
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
                      <SkillIconImage skill={skill} inline />
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
                  <strong>가이드 교차 확인</strong>
                  <span>Wowhead, Icy Veins, WCL/Archon, 직업 디스코드 공개 자료를 KB 시너지 노트로 연결합니다.</span>
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
      { id: 'cooldown', title: '파티 극딜 맞추기', short: '쿨기 맞추기', meta: '아군 강화와 주요 쿨기 타이밍', icon: Clock3 },
      { id: 'uptime', title: '강화 유지율', short: '유지율', meta: '버프/강화 공백 관리', icon: Activity },
      { id: 'target', title: '대상 수 가치 변화', short: '대상 수', meta: '단일, 2대상, 광역 전환', icon: Target },
      { id: 'network', title: '시너지 네트워크', short: '시너지', meta: '스킬 연결 관계', icon: Link2 },
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
      { id: 'cooldown', title: '힐링 쿨기 맞추기', short: '쿨기 맞추기', meta: '광역 피해 구간별 쿨기', icon: Clock3 },
      { id: 'uptime', title: '유지 효과 타임라인', short: '유지율', meta: '도트/버프형 회복 관리', icon: Activity },
      { id: 'network', title: '시너지 네트워크', short: '시너지', meta: '회복 스킬 연결', icon: Link2 },
    ];
  }

  return [
    { id: 'cooldown', title: '쿨기 타이밍 표', short: '쿨기 맞추기', meta: '극딜 구간과 핵심 기술 동기화', icon: Clock3 },
    { id: 'resource', title: '자원 흐름 곡선', short: '자원 곡선', meta: '생성, 보존, 소모 구간', icon: Gauge },
    { id: 'target', title: '대상 수별 가치', short: '대상 수', meta: '단일/광역 가치 변화', icon: Target },
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
                  aria-label={`${synergyName(node.synergy)}: ${node.linkedCount}개 연결`}
                >
                  <rect
                    className="node-hitbox"
                    x="-72"
                    y={-(node.r + 15)}
                    width="144"
                    height={node.major ? node.r + 72 : node.r + 42}
                    rx="12"
                  />
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
                  aria-label={`${skillNodeKindLabel(node.skill)} ${skillName(node.skill)}: ${node.connectionCount}개 시너지 연결`}
                >
                  <g
                    className={`graph-node graph-skill-node graph-kind-${node.nodeKind} ${node.major ? 'graph-major' : 'graph-secondary'}`}
                    transform={`translate(${node.x} ${node.y})`}
                  >
                    <rect
                      className="node-hitbox"
                      x="-72"
                      y={-(node.r + 18)}
                      width="144"
                      height={node.major ? node.r + 95 : node.r + 64}
                      rx="12"
                    />
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
      return <DefensivePlannerChart guide={guide} data={data} profile={profile} chart={chart} />;
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
        <span>{guide.spec} {guide.className} {profile.label} 핵심 흐름</span>
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
            <strong>{displayGuideText(row.name)}</strong>
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
      <CurveSvg viewBox="0 0 420 150" role="img" aria-label={`${displayGuideText(profile.resourceTitle)} 차트`}>
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
          <strong>{displayGuideText(profile.resourceTitle)}</strong>
        </MeterBox>
      </MeterGrid>
    </ResourceChart>
  );
}

function DefensivePlannerChart({ guide, data, profile, chart }) {
  if (chart?.events?.length) {
    return (
      <DefensiveList>
        {chart.events.map((event, index) => {
          const skill = findSkillByIds(data, [event.skillId]);
          return (
            <DefensiveRow key={`${event.phase}-${event.skillId || index}`} $detailed>
              <EventTime>{displayGuideText(event.phase)}</EventTime>
              <EventName>
                <SkillIconLink skill={skill} size={30} />
                <EventNameStack>
                  <strong>{displayGuideText(event.label || (skill ? skillName(skill) : event.phase))}</strong>
                  {event.note && <EventNote>{renderGuideText(event.note)}</EventNote>}
                </EventNameStack>
              </EventName>
              <EventAction>{displayGuideText(event.action)}</EventAction>
            </DefensiveRow>
          );
        })}
      </DefensiveList>
    );
  }

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
              <EventNameStack>
                <strong>{skill ? skillName(skill) : profile.plannerTitle}</strong>
              </EventNameStack>
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

function findSkillByIds(data, ids) {
  return ids
    .map(id => String(id))
    .map(id => data.scopedSkills.find(skill => String(skill.id) === id) || manualSkillById.get(id) || skillById.get(id))
    .find(Boolean);
}

function getDisciplinePriestUptimeRows(data) {
  return [
    {
      label: '중심 버프',
      skill: findSkillByIds(data, ['81749']),
      note: '모든 예열과 피해 전환 치유가 지나는 중앙 노드입니다. 대상 수와 남은 시간을 가장 먼저 봅니다.',
      segments: [[6, 14], [28, 14], [50, 14], [72, 14]],
    },
    {
      label: '광역 준비',
      skill: findSkillByIds(data, ['194509']),
      note: '다수 속죄를 피해 직전에 맞추는 충전 기술입니다. 너무 빠르면 속죄 시간이 새고, 너무 늦으면 사망이 납니다.',
      segments: [[14, 8], [38, 8], [62, 8], [86, 8]],
    },
    {
      label: '사도 예열',
      skill: findSkillByIds(data, ['472433']),
      note: '현재 사도는 속죄 연장 스킬이 아니라 5명 속죄를 직접 적용하고 다음 광휘 2회를 즉시화해 예열을 빠르게 완성하는 스킬입니다.',
      segments: [[20, 14], [70, 14]],
    },
    {
      label: '보호막 관리',
      skill: findSkillByIds(data, ['1253593', '17']),
      note: '공허의 보호막과 신의 권능: 보호막은 속죄 적용과 유효 체력을 동시에 만듭니다. 회개 전 공허의 보호막 발동 낭비를 확인합니다.',
      segments: [[4, 10], [24, 10], [44, 10], [64, 10], [84, 10]],
    },
    {
      label: '피해 복구',
      skill: findSkillByIds(data, ['47540']),
      note: '속죄가 살아 있을 때 회개가 실제 치유량을 되돌려 줍니다. 아군 회개와 적 회개는 상황에 따라 용도가 다릅니다.',
      segments: [[23, 8], [33, 7], [73, 8], [83, 7]],
    },
    {
      label: '지속 피해',
      skill: findSkillByIds(data, ['1250218', '589']),
      note: '사악의 정화나 어둠의 권능: 고통은 속죄 회수 구간의 바탕입니다. 회개 전이 조건과 지속 시간을 같이 봅니다.',
      segments: [[2, 94]],
    },
    {
      label: '예언자 안정성',
      skill: findSkillByNames(data, ['두 개의 시야', '경건', '보장된 안전', '대천사']),
      note: '현재 레이드와 쐐기 로그의 기본 영웅 특성 선택입니다. 회개 보강과 보호막 보조로 큰 쿨다운 사이 빈 구간을 메웁니다.',
      segments: [[16, 10], [46, 10], [76, 10]],
    },
    {
      label: '공허술사 피해 구간',
      skill: findSkillByNames(data, ['혼돈의 균열', '공허 폭발']),
      note: '선택 시 잦은 피해 구간을 속죄 대상에게 돌리는 분기입니다. 속죄 없는 균열은 낭비입니다.',
      segments: [[30, 12], [80, 12]],
    },
    {
      label: '대형 복구',
      skill: findSkillByIds(data, ['421453']),
      note: '궁극의 참회는 사도와 같은 피해에 겹치기보다 별도 이벤트에 배정할 때 쿨다운 분배가 안정됩니다.',
      segments: [[54, 18]],
    },
    {
      label: '외생기',
      skill: findSkillByIds(data, ['33206', '62618']),
      note: '탱커 급락, 위치 고정 공대 피해, 보호막 분배를 서로 다른 위험 구간에 나눕니다.',
      segments: [[34, 12], [58, 12], [88, 10]],
    },
    {
      label: '직접 복구',
      skill: findSkillByIds(data, ['1252215', '2061']),
      note: '한 명이 죽기 직전인 상황에서는 속죄 예열보다 직접 치유와 외생기 판단이 먼저입니다.',
      segments: [[18, 7], [42, 7], [66, 7], [90, 7]],
    },
    {
      label: '해제/유틸',
      skill: findSkillByIds(data, ['527', '528', '32375']),
      note: '위험 주문과 디버프를 제거하면 뒤따라와야 할 복구량 자체가 줄어듭니다.',
      segments: [[12, 6], [36, 6], [60, 6], [82, 6]],
    },
  ];
}

function getUptimeRows(guide, data) {
  if (guide.id === 'priest-discipline') {
    return getDisciplinePriestUptimeRows(data);
  }

  if (guide.id === 'druid-restoration') {
    return [
      {
        label: '피어나는 생명',
        skill: findSkillByIds(data, ['33763']),
        note: '공격대에서는 자신, 쐐기에서는 고정 대상에 3중첩을 유지해 상록숲과 꽃피우기 기반을 지킵니다.',
        segments: [[0, 96]],
      },
      {
        label: '상록숲 3중첩',
        skill: findSkillByIds(data, ['392167']),
        note: '피어나는 생명이 5초마다 쌓이는 상태를 유지하고, 신속한 치유 때 발생할 3연속 만개를 준비합니다.',
        segments: [[6, 20], [34, 20], [64, 20]],
      },
      {
        label: '꽃피우기 위치',
        skill: findSkillByIds(data, ['145205']),
        note: '파티원 세 명 이상이 실제로 머무는 위치에 유지하고 탱커 이동에 따라 다시 배치합니다.',
        segments: [[2, 34], [42, 34], [78, 18]],
      },
      {
        label: '회복 5개',
        skill: findSkillByIds(data, ['774']),
        note: '피해 4~6초 전에 짧게 묶어 풍요의 재생 마나 60% 감소와 치명타 및 극대화율 60% 증가를 켭니다.',
        segments: [[10, 18], [48, 18], [80, 14]],
      },
      {
        label: '신속한 치유',
        skill: findSkillByIds(data, ['18562']),
        note: '상록숲 3연속 만개와 대드루이드의 힘, 숲의 영혼, 숲 수호자 패시브 발동을 만듭니다.',
        segments: [[24, 8], [56, 8], [86, 8]],
      },
      {
        label: '광역 피해',
        skill: findSkillByIds(data, ['48438']),
        note: '여러 명이 실제로 피해를 받는 시작점에 사용하며, 위험하지 않은 구간에는 마나를 위해 아낍니다.',
        segments: [[28, 9], [60, 9], [90, 7]],
      },
      {
        label: '풍요 재생',
        skill: findSkillByIds(data, ['8936']),
        note: '풍요가 켜진 뒤 가장 다친 대상부터 직접 치유하고 번뜩임 재생도 실제 피해자에게 소비합니다.',
        segments: [[32, 16], [66, 16], [92, 6]],
      },
      {
        label: '과성장 복구',
        skill: findSkillByIds(data, ['132158']),
        note: '자연의 신속함 다음 재생을 직접 사용해 급사 대상에게 즉시 치유와 세 가지 지속 치유를 함께 줍니다.',
        segments: [[40, 10], [72, 10]],
      },
      {
        label: '영혼 소집',
        skill: findSkillByIds(data, ['391528']),
        note: '치유 목적이면 시전자 형태에서 실제 피해 시작에 맞추고 이후 풍요 재생으로 복구를 이어 갑니다.',
        segments: [[36, 14], [76, 14]],
      },
      {
        label: '평온 준비',
        skill: findSkillByIds(data, ['740']),
        note: '배정 피해 15~20초 전부터 급속 성장과 여러 재생 지속 치유를 만든 뒤 채널 중 연장합니다.',
        segments: [[44, 18], [80, 18]],
      },
      {
        label: '단일 피해 예방',
        skill: findSkillByIds(data, ['102342']),
        note: '탱커나 지정 대상이 맞을 큰 피해 전에 사용해 자연의 신속함-재생을 쓰기 전 급사부터 막습니다.',
        segments: [[18, 8], [52, 8], [80, 8]],
      },
      {
        label: '쐐기 해제',
        skill: findSkillByIds(data, ['88423']),
        note: '제거 가능한 독·저주·마법은 추가 치유로 버티기 전에 자연의 치유력을 먼저 사용합니다.',
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
        label: '흡수막',
        skill: findSkillByNames(data, ['고통 감내']),
        note: '방패 올리기 대체가 아니라 그 위에 얹는 흡수막입니다. 마법/지속 피해와 분노 과잉을 처리합니다.',
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
        note: '투신과 우레 작렬은 공격 구간이지만, 방패 올리기 기반이 무너지면 먼저 누를 이유가 줄어듭니다.',
        segments: [[30, 16], [76, 16]],
      },
      {
        label: '방패 타이밍 맞추기',
        skill: findSkillByNames(data, ['방패 돌격']),
        note: '방패 올리기와 방패 기술 피해 구간을 함께 열어 공격과 방어 리듬을 다시 맞춥니다.',
        segments: [[36, 10], [68, 10]],
      },
      {
        label: '풀 제어',
        skill: findSkillByNames(data, ['훼방의 외침', '충격파', '폭풍망치']),
        note: '캐스터 풀에서는 광역 차단과 제어가 딜 스킬보다 먼저 계획표에 올라갈 수 있습니다.',
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
        note: '독 발동 확률, 왕의 파멸 성장, 운명의 손 보상을 여는 중심 마무리 기술입니다.',
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
        note: '왕의 파멸 중에는 독살 구간과 독칼이 비지 않아야 14초 독 피해가 커집니다.',
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
        note: '우선 대상 자연 피해가 주변으로 전이되는 구간입니다. 대상 위치와 독살 구간을 같이 봅니다.',
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
        label: '영웅 특성',
        skill: findSkillByNames(data, ['운명의 손', '죽음추적자의 징표']),
        note: '운명결속은 강화 독살, 죽음추적자는 표식 대상 관리가 핵심입니다.',
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
        note: '근접 접촉 시간이 끊기면 독살과 왕의 파멸 구간도 같이 무너집니다.',
        segments: [[24, 6], [62, 6], [86, 6]],
      },
    ];
  }

  if (guide.id === 'mage-fire') {
    return [
      {
        label: '중심 구간',
        skill: findSkillByNames(data, ['발화']),
        note: '모든 치명타 보장과 몰아치는 열기! 흐름이 이 구간에 모입니다.',
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
        note: '3대상 이상에서는 불기둥과 특화: 작열 적중 수를 함께 봅니다.',
        segments: [[42, 12], [92, 6]],
      },
      {
        label: '보정/보존',
        skill: findSkillByNames(data, ['불태우기', '이글거리는 방벽']),
        note: '이동과 피해가 발화 구간의 전환 흐름을 끊지 않게 합니다.',
        segments: [[48, 10], [94, 5]],
      },
    ];
  }

  if (guide.id === 'mage-arcane') {
    return [
      {
        label: '중심 자원',
        skill: findSkillByNames(data, ['비전 연사']),
        note: '비전 탄막 소비 타이밍을 결정하므로 큰 구간 전 예열과 구간 안 소비를 같이 봅니다.',
        segments: [[4, 18], [26, 20], [52, 18], [78, 16]],
      },
      {
        label: '큰 구간',
        skill: findSkillByNames(data, ['비전 쇄도']),
        note: '90초 기준 피해와 마나 회복을 동시에 여는 구간입니다.',
        segments: [[18, 20], [76, 18]],
      },
      {
        label: '45초 구간',
        skill: findSkillByNames(data, ['비전의 여파']),
        note: '비전 쇄도와 겹치는 큰 구간, 그 사이 소형 구간을 모두 확인합니다.',
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
        note: '번뜩임을 버리지 않되 비전 탄막과 큰 구간을 밀지 않게 처리합니다.',
        segments: [[14, 9], [34, 9], [62, 9], [82, 9]],
      },
      {
        label: '광역 전환',
        skill: findSkillByNames(data, ['신비한 폭발', '비전 파동']),
        note: '3대상 이상에서는 충전물 생성과 비전 파동 타이밍을 따로 봅니다.',
        segments: [[36, 12], [66, 12]],
      },
      {
        label: '복구/보존',
        skill: findSkillByNames(data, ['환기', '오색 방벽']),
        note: '환기는 다음 큰 구간 마나를 복구하고, 오색 방벽은 구간 안 시전을 보존합니다.',
        segments: [[44, 10], [90, 8]],
      },
    ];
  }

  if (guide.id === 'shaman-elemental') {
    return [
      {
        label: '중심 반응',
        skill: findSkillByNames(data, ['용암 폭발']),
        note: '화염 충격, 소용돌이의 힘, 원소의 대가와 선조의 단일 주문 반응이 모이는 12.1 중심 기술입니다.',
        segments: [[5, 10], [20, 10], [36, 10], [53, 10], [70, 10], [87, 10]],
      },
      {
        label: '화염 기반',
        skill: findSkillByNames(data, ['화염 충격']),
        note: '용암 폭발과 화염 코어의 전제 조건입니다. 주요 대상 공백을 먼저 봅니다.',
        segments: [[2, 94]],
      },
      {
        label: '짧은 쿨기',
        skill: findSkillByNames(data, ['폭풍수호자']),
        note: '강화 번개 주문과 선조 소환을 함께 여는 1분 쿨기입니다. 승천이 임박해도 보통 10초 넘게 미루지 않습니다.',
        segments: [[8, 16], [50, 16], [84, 12]],
      },
      {
        label: '선견자',
        skill: findSkillByNames(data, ['선조의 신속함', '선조의 부름']),
        note: '12.1 레이드와 쐐기의 기본 영웅 특성입니다. 선조가 남아 있을 때 대상 수에 맞는 실제 주문을 계속 시전합니다.',
        segments: [[13, 12], [45, 12], [76, 12]],
      },
      {
        label: '큰 구간',
        skill: findSkillByNames(data, ['승천']),
        note: '폭풍수호자 뒤에 사용해 선조와 강화 주문을 함께 활용하되, 12.1에는 과부하 보너스가 줄었다는 점을 반영합니다.',
        segments: [[22, 18], [72, 18]],
      },
      {
        label: '단일 생성',
        skill: findSkillByNames(data, ['번개 화살']),
        note: '기본 필러이면서 폭풍수호자 강화 단일 자연 주문입니다.',
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
        label: '화염 전환',
        skill: findSkillByNames(data, ['전격의 불길', '정화의 불길']),
        note: '여러 대상에 화염 충격을 퍼뜨리고 다음 용암 폭발 반응을 준비합니다. 승천 직전 전격의 불길을 먼저 씁니다.',
        segments: [[13, 12], [48, 12], [83, 10]],
      },
      {
        label: '폭풍인도자 대안',
        skill: findSkillByNames(data, ['폭풍', '초자력 충전']),
        note: '현재는 취향이나 큰 광역을 위한 대안입니다. 초자력 충전은 과부하 피해를 10% 올리지만 선견자 기본 빌드를 대신하지 않습니다.',
        segments: [[26, 10], [56, 10], [86, 9]],
      },
      {
        label: '이동 보존',
        skill: findSkillByNames(data, ['영혼나그네의 은총', '자연의 신속함']),
        note: '폭풍수호자/승천 구간을 이동 패턴과 충돌하지 않게 보존합니다.',
        segments: [[38, 12], [78, 12]],
      },
      {
        label: '쐐기 유틸',
        skill: findSkillByNames(data, ['날카로운 바람', '축전 토템', '진동의 토템']),
        note: '차단과 제어는 큰 피해 구간보다 우선될 수 있는 실패 방지 행동입니다.',
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
        skill: findSkillByIds(data, ['61295']),
        note: '성난 해일 대상, 굽이치는 물결, 선조 발동, 연쇄 치유 첫 대상을 묶는 중앙 노드입니다.',
        segments: [[4, 12], [22, 12], [40, 12], [58, 12], [76, 12]],
      },
      {
        label: '준비 버프',
        skill: findSkillByIds(data, ['52127']),
        note: '전투 전 유지가 비면 이후 모든 복구 주문의 비용이 커집니다.',
        segments: [[0, 98]],
      },
      {
        label: '지역 기반',
        skill: findSkillByIds(data, ['444995']),
        note: '파티가 머무는 위치에 맞아야 토템술사 가치가 살아납니다.',
        segments: [[8, 26], [42, 26], [72, 22]],
      },
      {
        label: '토템 충전',
        skill: findSkillByIds(data, ['5394']),
        note: '치유의 토템 충전 낭비를 막고, 폭풍의 흐름 토템 가능 상태와 함께 봅니다.',
        segments: [[12, 9], [30, 9], [50, 9], [70, 9], [90, 7]],
      },
      {
        label: '폭풍 회수',
        skill: findSkillByIds(data, ['1267016']),
        note: '폭풍의 흐름 토템은 치유의 토템 충전, 성난 해일 대상, 신속함 계열 소비 계획과 같이 판단합니다.',
        segments: [[18, 8], [48, 8], [78, 8]],
      },
      {
        label: '예고 광역',
        skill: findSkillByIds(data, ['462486']),
        note: '피해 뒤에 급하게 찾는 버튼이 아니라 예고 피해를 낮은 비용으로 회수하는 짧은 광역 구간입니다.',
        segments: [[20, 10], [54, 10], [84, 9]],
      },
      {
        label: '광역 회수',
        skill: findSkillByIds(data, ['1064']),
        note: '성난 해일이 묻은 대상과 거리 조건이 맞을 때 가장 먼저 가치가 올라갑니다.',
        segments: [[25, 8], [46, 8], [66, 8], [88, 8]],
      },
      {
        label: '단일 효율',
        skill: findSkillByIds(data, ['77472']),
        note: '한두 명만 위험할 때 쓰는 효율 직접 치유입니다.',
        segments: [[15, 7], [36, 7], [61, 7], [80, 7]],
      },
      {
        label: '큰 회수',
        skill: findSkillByIds(data, ['108280']),
        note: '긴 광역 피해 또는 피해 직후 안정화에 배정합니다.',
        segments: [[34, 18], [78, 18]],
      },
      {
        label: '체력 평준화',
        skill: findSkillByIds(data, ['98008']),
        note: '사후 힐이 아니라 큰 피해 직전 피해 감소와 체력 재분배를 노립니다.',
        segments: [[48, 12], [86, 10]],
      },
      {
        label: '증폭 구간',
        skill: findSkillByIds(data, ['114052']),
        note: '연쇄 치유와 치유의 물결을 실제로 많이 넣을 수 있는 피해 구간에 맞춥니다.',
        segments: [[56, 18]],
      },
      {
        label: '선견자 구간',
        skill: findSkillByIds(data, ['443454']),
        note: '대상 선택형 회복을 강화하고 선조 주문을 실제 피해 구간에 맞춥니다.',
        segments: [[18, 10], [44, 10], [74, 10]],
      },
      {
        label: '쐐기 유틸',
        skill: findSkillByIds(data, ['57994']),
        note: '피해를 회복하기 전에 위험 주문과 디버프를 제거합니다.',
        segments: [[14, 7], [38, 7], [62, 7], [82, 7]],
      },
      {
        label: '이동 보존',
        skill: findSkillByIds(data, ['79206']),
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
        note: '폭풍의 일격과 용암 채찍의 복제 딜, 폭풍 해방, 광역 전환을 여는 상태입니다.',
        segments: [[24, 16], [54, 16], [80, 16]],
      },
      {
        label: '폭풍 타격',
        skill: findSkillByNames(data, ['폭풍의 일격']),
        note: '폭풍인도자와 승천 구간에서 밀리면 전체 소용돌이 흐름이 느려집니다.',
        segments: [[7, 7], [22, 7], [38, 7], [54, 7], [70, 7], [88, 7]],
      },
      {
        label: '화염 타격',
        skill: findSkillByNames(data, ['용암 채찍']),
        note: '토템술사와 뜨거운 손 중에는 일반 필러보다 높은 가치가 됩니다.',
        segments: [[10, 7], [26, 7], [44, 7], [62, 7], [78, 7], [94, 5]],
      },
      {
        label: '토템술사 구간',
        skill: findSkillByNames(data, ['쇄도하는 토템']),
        note: '1분 피해 구간의 기준점입니다. 토템 위치와 대상 생존 시간을 같이 봅니다.',
        segments: [[4, 22], [56, 22]],
      },
      {
        label: '화염 발동',
        skill: findSkillByNames(data, ['뜨거운 손']),
        note: '용암 채찍 쿨다운과 피해를 바꾸므로 토템술사에서 별도 추적합니다.',
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
        note: '질풍의 무기와 근접 타격 횟수가 중요한 1분 구간입니다.',
        segments: [[6, 14], [57, 14]],
      },
      {
        label: '승천 구간',
        skill: findSkillByNames(data, ['승천', '바람의 일격']),
        note: '바람의 일격 공백과 폭풍/낙뢰 맞추기를 확인하는 큰 구간입니다.',
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
        note: '근접 이탈과 큰 피해 패턴을 파멸의 바람/승천 구간과 충돌하지 않게 배치합니다.',
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
        label: '90초 큰 구간',
        skill: findSkillByNames(data, ['어둠의 칼날']),
        note: '어둠의 칼날 안에 두 번의 어둠의 춤과 첫 은밀한 기술을 몰아넣습니다.',
        segments: [[3, 18], [72, 18]],
      },
      {
        label: '춤 구간',
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
        note: '그림자 기술 중첩을 복제된 그림자와 다음 마무리 기술로 연결합니다.',
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
        note: '다중 대상 기본 마무리 기술이지만, 최후의 일격/어둡고 어두운 밤 절개 예외를 같이 봅니다.',
        segments: [[36, 8], [66, 8], [90, 7]],
      },
      {
        label: '기만자',
        skill: findSkillByNames(data, ['무형검', '최후의 일격']),
        note: '현재 로그 주류입니다. 최후의 일격 절개와 구름 덮개 구간을 별도로 추적합니다.',
        segments: [[8, 20], [42, 20], [74, 20]],
      },
      {
        label: '죽음추적자',
        skill: findSkillByNames(data, ['죽음추적자의 징표', '어둡고 어두운 밤']),
        note: '단일 전투 보조 선택지입니다. 징표 적용, 중첩 소비, 대상 이동을 확인합니다.',
        segments: [[11, 16], [50, 16], [86, 12]],
      },
      {
        label: '생존/차단',
        skill: findSkillByNames(data, ['교란', '그림자 망토', '발차기']),
        note: '쐐기에서는 은밀한 기술 구간보다 먼저 생존과 차단이 필요한 순간이 있습니다.',
        segments: [[22, 10], [55, 10], [80, 10]],
      },
    ];
  }

  if (guide.id === 'rogue-outlaw') {
    return [
      {
        label: '중심 환급',
        skill: findSkillByNames(data, ['잠들지 않는 칼날']),
        note: '5~6점 마무리 기술이 다음 쿨기 구간을 앞당기는 무법의 쿨기 환급 구조입니다.',
        segments: [[7, 8], [22, 8], [38, 8], [54, 8], [70, 8], [86, 8]],
      },
      {
        label: '속도 구간',
        skill: findSkillByNames(data, ['아드레날린 촉진']),
        note: '기력 회복과 공격 속도를 올려 더 많은 생성기와 마무리 기술을 가능하게 합니다.',
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
        note: '숨겨진 기회와 배포가 있을 때 사악한 일격보다 강한 생성 흐름으로 들어옵니다.',
        segments: [[24, 8], [61, 8]],
      },
      {
        label: '큰 마무리',
        skill: findSkillByNames(data, ['미간 적중']),
        note: '쿨다운 손실을 막아야 하는 중요한 마무리 기술입니다.',
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
        note: '쿨다운 지연 없이 써야 하는 피해/이동 보강 쿨기입니다.',
        segments: [[14, 8], [48, 8], [84, 8]],
      },
      {
        label: '처형 쿨기',
        skill: findSkillByNames(data, ['광기의 학살자']),
        note: '기만자 선택지에서 고연계 점수 소비와 기력 과충전을 함께 보는 구간입니다.',
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
        note: '5점 이상 마무리 기술이 동전 횟수와 행운 주화 기대값을 만듭니다.',
        segments: [[18, 18], [52, 18], [86, 12]],
      },
    ];
  }

  if (guide.id === 'warlock-destruction') {
    return [
      {
        label: '유지 기반',
        skill: findSkillByNames(data, ['쇠퇴', '제물']),
        note: '지옥소환사는 쇠퇴, 비-지옥소환사는 제물을 유지해 조각 관리를 시작합니다.',
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
        note: '조각 과충전 전에 넣는 단일 대상 핵심 주문입니다.',
        segments: [[24, 10], [44, 10], [66, 10], [90, 7]],
      },
      {
        label: '2대상 복제',
        skill: findSkillByNames(data, ['대혼란']),
        note: '두 번째 대상이 의미 있을 때 혼돈의 화살 가치를 올립니다.',
        segments: [[22, 16], [64, 16]],
      },
      {
        label: '광역 소비',
        skill: findSkillByNames(data, ['불의 비']),
        note: '3대상 이상과 대상 생존 시간을 확인한 뒤 전환합니다.',
        segments: [[35, 13], [76, 13]],
      },
      {
        label: '큰 구간',
        skill: findSkillByNames(data, ['지옥불정령 소환']),
        note: '조각 생성과 소비 횟수를 동시에 여는 구간입니다.',
        segments: [[20, 24], [72, 22]],
      },
      {
        label: '보조 쿨기',
        skill: findSkillByNames(data, ['대재앙', '악마불 집중']),
        note: '유지 주문 확산 또는 구간 사이 피해 보강으로 씁니다.',
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
        note: '악마 화살을 빠르게 시전해 폭군 구간의 조각 복구를 돕습니다.',
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
        note: '악마학자 구간에서 폭군 주변에 배치할 선택 쿨다운입니다.',
        segments: [[22, 16], [72, 16]],
      },
      {
        label: '폭군 구간',
        skill: findSkillByNames(data, ['악마 폭군 소환']),
        note: '소환수 수명과 조각 준비가 완성된 뒤 들어가는 중심 구간입니다.',
        segments: [[28, 20], [78, 18]],
      },
      {
        label: '파멸 축',
        skill: findSkillByNames(data, ['파멸수호병 소환', '아르거스의 지배자']),
        note: '다중 대상 또는 큰 구간에서 별도 피해 흐름으로 확인합니다.',
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
        note: '주 대상 피해 구간을 여는 증폭 기준선입니다.',
        segments: [[7, 12], [40, 12], [70, 12]],
      },
      {
        label: '수확 구간',
        skill: findSkillByNames(data, ['암흑의 수확']),
        note: '영혼 수확자 기준 조각 회복과 짧은 피해 구간을 함께 만듭니다.',
        segments: [[23, 9], [57, 9], [86, 9]],
      },
      {
        label: '소환 구간',
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
        note: '우선순위가 비거나 일몰이 뜰 때 다음 소비 구간을 준비합니다.',
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
        note: '다음 큰 물리 피해나 연속 타격 전에 보호막 구간을 예약합니다.',
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
        note: '광역 피해와 순간 위협, 위험 풀 제어를 함께 보는 구간입니다.',
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
        note: '자동 공격과 정점 구간이 실제 대상 수와 겹쳤는지 봅니다.',
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
        label: '정점 구간',
        skill: findSkillByNames(data, ['호안주', '등선']),
        note: '호안주/등선 구간은 큰 기술을 모으지만 과도한 대기는 손실입니다.',
        segments: [[24, 14], [64, 14]],
      },
      {
        label: '큰 타격',
        skill: findSkillByNames(data, ['바람의 군주의 일격']),
        note: '강화 구간에 넣되 분노의 주먹과 해오름차기를 지나치게 밀지 않습니다.',
        segments: [[28, 10], [72, 10]],
      },
      {
        label: '쿨기 분신',
        skill: findSkillByNames(data, ['폭풍과 대지와 불']),
        note: '고피해 기술이 이어지는 구간에 배치하는 큰 쿨기입니다.',
        segments: [[16, 22], [62, 22]],
      },
      {
        label: '소환 구간',
        skill: findSkillByNames(data, ['백호 쉬엔의 원령']),
        note: '전투 길이와 큰 구간에 맞춰 전투 내 사용 횟수를 잃지 않습니다.',
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
        note: '음영파는 질풍격 누적, 천신합일은 옥룡의 마음 쿨다운 회전을 봅니다.',
        segments: [[26, 12], [66, 12]],
      },
    ];
  }

  if (guide.id === 'monk-mistweaver') {
    return [
      {
        label: '소생 대상 준비',
        skill: findSkillByNames(data, ['소생의 안개']),
        note: '시즌 1 무료 소생 효과가 사라졌으므로 충전이 가득 차기 전에 직접 대상에게 퍼뜨립니다.',
        segments: [[3, 28], [35, 28], [68, 26]],
      },
      {
        label: '질풍차기와 무료 발동',
        skill: findSkillByNames(data, ['질풍차기']),
        note: '기본 쿨다운, 옥룡의 마음, 시즌 2 4세트 무료 발동을 각각 놓치지 않습니다.',
        segments: [[8, 8], [22, 8], [38, 8], [54, 8], [70, 8], [86, 8]],
      },
      {
        label: '생기 충전 회수',
        skill: findSkillByNames(data, ['생기 충전']),
        note: '소생의 안개 대상 여러 명이 실제로 다친 순간 평소 광역 피해를 회수합니다.',
        segments: [[18, 11], [44, 11], [73, 11], [89, 8]],
      },
      {
        label: '차로 구간 시작',
        skill: findSkillByNames(data, ['집중의 천둥 차']),
        note: '다음 소생의 안개 또는 포용의 안개 목적을 정하고 옥룡의 마음을 시작합니다.',
        segments: [[12, 8], [48, 8], [80, 8]],
      },
      {
        label: '옥룡의 마음 8초',
        skill: findSkillByNames(data, ['옥룡의 마음', '내면의 단결']),
        note: '질풍차기, 소생의 안개, 집중의 천둥 차와 기의 고치를 평소보다 빠르게 다시 씁니다.',
        segments: [[20, 14], [57, 14], [86, 12]],
      },
      {
        label: '실제 피해 천신합일',
        skill: findSkillByNames(data, ['천신합일']),
        note: '근거리 다수 부상과 지속 피해에 맞춥니다. 과치유가 크면 구간 선택부터 바꿉니다.',
        segments: [[18, 20], [66, 20]],
      },
      {
        label: '기의 고치와 마나',
        skill: findSkillByNames(data, ['기의 고치']),
        note: '예고된 단일 피해를 막고 원기 회복으로 얻은 마나 차 중첩을 안전한 순간에 마십니다.',
        segments: [[27, 13], [58, 13], [88, 10]],
      },
      {
        label: '위론 포용 구간',
        skill: findSkillByNames(data, ['옥룡 위론의 원령', '포용의 안개', '영혼의 샘']),
        note: '천신합일과 다른 긴 피해에 위론을 배정하고 포용의 안개를 부상자에게 나눕니다.',
        segments: [[40, 22], [78, 20]],
      },
      {
        label: '별도 광역 재활',
        skill: findSkillByNames(data, ['재활']),
        note: '천신합일과 위론이 없는 다음 광역 피해를 즉시 회수하도록 따로 남깁니다.',
        segments: [[46, 14], [90, 8]],
      },
      {
        label: '쐐기 공격 치유',
        skill: findSkillByNames(data, ['비취불꽃의 가르침', '해오름차기', '고대의 가르침']),
        note: '회전 학다리차기만 반복하지 않고 단일 공격과 직접 치유를 피해 강도에 맞춰 섞습니다.',
        segments: [[5, 32], [42, 25], [72, 26]],
      },
    ];
  }

  if (guide.id === 'warrior-arms') {
    return [
      {
        label: '중심 타격',
        skill: findSkillByNames(data, ['필사의 일격']),
        note: '무기 전사의 중심 타격입니다. 지연과 분노 고갈을 가장 먼저 봅니다.',
        segments: [[8, 7], [24, 7], [40, 7], [56, 7], [73, 7], [90, 6]],
      },
      {
        label: '피해 구간',
        skill: findSkillByNames(data, ['거인의 강타', '전쟁파괴자']),
        note: '필사의 일격, 칼날폭풍, 쇄파, 마무리 일격을 높은 값으로 묶는 시간표입니다.',
        segments: [[14, 18], [58, 18]],
      },
      {
        label: '제압 충전',
        skill: findSkillByNames(data, ['제압']),
        note: '2충전 방치를 막되 필사의 일격을 밀지 않도록 구간 안팎을 조절합니다.',
        segments: [[4, 6], [20, 6], [34, 6], [50, 6], [66, 6], [83, 6]],
      },
      {
        label: '분쇄 기준',
        skill: findSkillByNames(data, ['분쇄']),
        note: '분쇄는 오래 사는 대상에 먼저 깔아 두는 출혈 기준선입니다. 치명상은 이 행의 결과로 로그에서 따로 확인합니다.',
        segments: [[2, 94]],
      },
      {
        label: '처형 전환',
        skill: findSkillByNames(data, ['마무리 일격', '급살']),
        note: '급살 발동과 35% 이하 처형 구간을 분리해서 분노 고갈을 확인합니다.',
        segments: [[29, 8], [46, 8], [78, 18]],
      },
      {
        label: '학살자 몰아넣기',
        skill: findSkillByNames(data, ['칼날폭풍', '학살자의 지배']),
        note: '거인의 강타 초반에 칼날폭풍을 겹치고, 다중 대상에서는 제압 우선순위 상승을 봅니다.',
        segments: [[18, 14], [63, 14]],
      },
      {
        label: '거신 핵심기',
        skill: findSkillByNames(data, ['쇄파', '거신의 지배']),
        note: '쇄파는 구간 안에서 방향과 적 밀집 상태를 맞춰 채널해야 합니다.',
        segments: [[22, 12], [68, 12]],
      },
      {
        label: '광역 소비',
        skill: findSkillByNames(data, ['회전베기']),
        note: '3대상 이상에서 단일 우선순위를 광역 구간으로 확장하는 중심 소비기입니다.',
        segments: [[36, 10], [52, 10], [82, 10]],
      },
      {
        label: '2대상 복제',
        skill: findSkillByNames(data, ['휩쓸기 일격']),
        note: '두 대상이 의미 있게 살아 있을 때 단일 우선순위를 복제하는 선택지입니다.',
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
        note: '평균 유지율보다 무모한 희생/투신 구간 안에서 비는 시간을 먼저 봅니다.',
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
        label: '분노 구간',
        skill: findSkillByNames(data, ['무모한 희생']),
        note: '광란 반복을 가장 많이 몰아넣어야 하는 분노/치명타 구간입니다.',
        segments: [[10, 18], [58, 18]],
      },
      {
        label: '투신 구간',
        skill: findSkillByNames(data, ['투신']),
        note: '기본은 공격력 구간이며, 산왕 선택 시 우레 작렬 2중첩과 천둥벼락 초기화를 함께 봅니다.',
        segments: [[11, 20], [60, 20]],
      },
      {
        label: '큰 피해',
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
        label: '학살자 몰아넣기',
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
        note: '6초마다 신성한 힘 1을 만들고 10% 확률로 빛 주입을 여는 중심 생성기입니다.',
        segments: [[5, 7], [20, 7], [36, 7], [53, 7], [71, 7], [88, 7]],
      },
      {
        label: '영구 봉화',
        skill: findSkillByNames(data, ['빛의 봉화', '신념의 봉화', '구세주의 봉화']),
        note: '지속 피해 대상과 현재 생명력이 가장 낮은 대상에게 직접 치유를 전달합니다.',
        segments: [[0, 100]],
      },
      {
        label: '9초 봉화',
        skill: findSkillByNames(data, ['고결의 봉화', '빛의 기둥']),
        note: '쐐기 광역 피해 직전에 켜고 직접 치유와 소비기를 9초 안에 넣습니다.',
        segments: [[12, 18], [45, 18], [76, 18]],
      },
      {
        label: '빛 주입 소비',
        skill: findSkillByNames(data, ['빛 주입']),
        note: '급한 회복은 빛의 섬광, 여유 구간은 심판으로 빠르게 소비합니다.',
        segments: [[18, 8], [40, 8], [63, 8], [84, 8]],
      },
      {
        label: '단일 소비',
        skill: findSkillByNames(data, ['영광의 서약', '영원의 불꽃']),
        note: '12.1 기본 소비기입니다. 한 명이 죽을 위험일 때 가장 먼저 사용합니다.',
        segments: [[26, 9], [59, 9], [82, 9]],
      },
      {
        label: '조건부 광역',
        skill: findSkillByNames(data, ['여명의 빛']),
        note: '단일 소비기가 크게 넘칠 만큼 여러 명이 비슷하게 다쳤을 때 사용합니다.',
        segments: [[32, 11], [66, 11], [90, 8]],
      },
      {
        label: '태양의 사자',
        skill: findSkillByNames(data, ['천상의 종', '신성한 반사', '새벽빛']),
        note: '천상의 종 또는 신성한 반사 뒤 다음 두 소비기로 새벽빛을 적용합니다.',
        segments: [[14, 12], [48, 12], [78, 12]],
      },
      {
        label: '피해 전 완화',
        skill: findSkillByNames(data, ['오라 숙련', '천상의 울림']),
        note: '큰 피해 전에 사용하고 자동 천상의 종의 신성한 힘까지 계산합니다.',
        segments: [[30, 10], [76, 10]],
      },
      {
        label: '격노와 티르',
        skill: findSkillByNames(data, ['응징의 격노', '티르의 해방']),
        note: '티르의 해방은 별도 버튼이 아니라 응징의 격노에 자동 발동합니다.',
        segments: [[22, 24], [68, 24]],
      },
      {
        label: '빛대장장이',
        skill: findSkillByNames(data, ['신성한 무기', '신성한 보루', '천상의 인도']),
        note: '무장을 피해 전에 배치하고 신성한 힘 소비 뒤 강화 신성화를 사용합니다.',
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
        note: '비는 글쿨에 신성한 힘 흐름을 보강합니다.',
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
        note: '광역 위협, 차단 보조, 생성 흐름을 동시에 여는 구간입니다.',
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
        note: '기사단은 큰 공격 구간, 빛대장장이는 보호/지원 구간으로 나눠 확인합니다.',
        segments: [[22, 14], [62, 14]],
      },
    ];
  }

  if (guide.id === 'paladin-retribution') {
    return [
      {
        label: '큰 구간 기준',
        skill: findSkillByNames(data, ['사형 선고']),
        note: '응징의 격노와 강한 피해가 모이는 피해 몰아넣기 기준점입니다.',
        segments: [[14, 18], [62, 18]],
      },
      {
        label: '날개 구간',
        skill: findSkillByNames(data, ['응징의 격노']),
        note: '사형 선고와 파멸의 재와 빛의 망치를 함께 묶는 강화 구간입니다.',
        segments: [[10, 24], [58, 24]],
      },
      {
        label: '재 폭발',
        skill: findSkillByNames(data, ['파멸의 재']),
        note: '피해와 신성한 힘 공급이 동시에 들어가는 구간 전환 버튼입니다.',
        segments: [[18, 9], [66, 9]],
      },
      {
        label: '기사단 핵심기',
        skill: findSkillByNames(data, ['빛의 망치']),
        note: '기사단 빌드에서 사형 선고 안에 우선 넣는 큰 핵심 버튼입니다.',
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
        label: '단일 소모',
        skill: findSkillByNames(data, ['최후의 선고', '기사단의 선고']),
        note: '사형 선고 대상이나 보스 단일에서 신성한 힘을 비우는 소모기입니다.',
        segments: [[26, 10], [41, 8], [74, 10], [88, 8]],
      },
      {
        label: '광역 소모',
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
        label: '산산조각 열기',
        skill: findSkillByNames(data, ['진눈깨비']),
        note: '두뇌 빙결로 산산조각 소비 구간을 열어 줍니다.',
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
        note: '3대상 이상과 빗발치는 냉기 조건에서 우선순위가 올라갑니다.',
        segments: [[2, 12], [48, 14], [90, 8]],
      },
      {
        label: '큰 소비기',
        skill: findSkillByNames(data, ['혹한의 쐐기', '혜성 폭풍']),
        note: '고드름과 산산조각 구간이 맞을 때 큰 소비기로 정리합니다.',
        segments: [[52, 12], [92, 6]],
      },
    ];
  }

  if (guide.id === 'druid-balance') {
    return [
      {
        label: '달빛섬광 기반',
        skill: findSkillByNames(data, ['달빛섬광']),
        note: '일월식 전에 갱신해 일월식 내부 글쿨을 비웁니다.',
        segments: [[4, 30], [48, 32], [82, 14]],
      },
      {
        label: '태양섬광 전파',
        skill: findSkillByNames(data, ['태양섬광']),
        note: '다중 대상 발동과 별똥별 기반을 만드는 도트입니다.',
        segments: [[8, 34], [54, 30]],
      },
      {
        label: '일월식 소비 구간',
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
        label: '숲의 수호자 구간',
        skill: findSkillByNames(data, ['자연의 군대']),
        note: '레이드 숲의 수호자 빌드는 자연의 군대를 일월식/천체의 정렬과 맞추는지 봅니다.',
        segments: [[16, 13], [64, 13]],
      },
      {
        label: '엘룬의 대행자 구간',
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
        label: '중심 구간',
        skill: findSkillByNames(data, ['야수의 격노']),
        note: '구간 안 살상 명령, 세트 효과, 영웅 특성 발동 횟수를 봅니다.',
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
        note: '2충전 방치를 막고 정조준 안에서는 가능한 많은 좋은 시전을 넣습니다.',
        segments: [[6, 14], [28, 14], [52, 14], [76, 14]],
      },
      {
        label: '속사 준비',
        skill: findSkillByNames(data, ['속사']),
        note: '조준하기와 총알 세례를 통해 다음 조준 사격 회복과 피해 타이밍을 만듭니다.',
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
        label: '정조준 구간',
        skill: findSkillByNames(data, ['정조준']),
        note: '우선순위를 바꾸는 버튼이 아니라 조준 사격과 속사를 몰아넣는 구간입니다.',
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
        note: '레이드 파수꾼은 표식/달빛 회전 표창, 쐐기 어둠 순찰자는 검은 화살/울부짖는 화살을 별도 선택지로 봅니다.',
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
        note: '강한 소비기 전에 1~3중첩을 맞춰 소비 타이밍을 정합니다.',
        segments: [[10, 18], [34, 18], [58, 18], [82, 12]],
      },
      {
        label: '제압 구간',
        skill: findSkillByNames(data, ['제압']),
        note: '제압 전에 폭탄, 붐스틱, 무리의 지도자 살상 명령을 준비합니다.',
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
        label: '숨결 지속 치유',
        skill: findSkillByNames(data, ['꿈의 숨결']),
        note: '평소 1단계로 16초 지속 치유를 남기고 메리스라의 축복을 확정합니다.',
        segments: [[2, 28], [42, 26], [78, 20]],
      },
      {
        label: '광역 준비',
        skill: findSkillByNames(data, ['시간 변칙']),
        note: '피해 직전에 흡수와 최대 다섯 명의 약한 메아리를 경로에 배치합니다.',
        segments: [[12, 14], [50, 14], [84, 12]],
      },
      {
        label: '우선 대상',
        skill: findSkillByNames(data, ['메아리']),
        note: '탱커, 치유 흡수, 위험 디버프 대상에 직접 메아리를 더합니다.',
        segments: [[18, 16], [56, 16], [88, 10]],
      },
      {
        label: '축복 회수',
        skill: findSkillByNames(data, ['메리스라의 축복']),
        note: '되감기 자리에 나타난 실제 주문을 눌러 각 메아리에서 전체 튕김과 되감기 효과를 반복합니다.',
        segments: [[28, 12], [66, 12], [92, 7]],
      },
      {
        label: '무료 꽃',
        skill: findSkillByNames(data, ['에메랄드 꽃']),
        note: '정수 폭발로 다친 아군에게 사용해 시즌 세트와 쌍둥이 메아리를 연결합니다.',
        segments: [[34, 13], [72, 13]],
      },
      {
        label: '화염 흡수',
        skill: findSkillByNames(data, ['화염 흡수']),
        note: '꽃, 묘목, 신록의 품이 꿈의 숨결 지속시간 일부를 해당 대상의 즉시 회복으로 바꿉니다.',
        segments: [[36, 18], [74, 18]],
      },
      {
        label: '저장과 방출',
        skill: findSkillByNames(data, ['정지장']),
        note: '꿈의 숨결, 시간 변칙, 축복을 미리 저장하고 다음 큰 피해에 같은 순서로 방출합니다.',
        segments: [[8, 8], [46, 8]],
      },
      {
        label: '대형 복구',
        skill: findSkillByNames(data, ['되돌리기', '꿈의 비행']),
        note: '되돌리기는 지난 5초 피해 직후, 꿈의 비행은 안전한 경로로 실제 피해자를 가로지를 때 사용합니다.',
        segments: [[58, 12], [88, 10]],
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
        note: '다음 큰 피해 구간을 가진 딜러에게 미리 유지되어야 합니다.',
        segments: [[8, 34], [50, 34]],
      },
      {
        label: '파티 극딜',
        skill: findSkillByNames(data, ['영겁의 숨결']),
        note: '좋은 파티 피해 구간과 겹치되, 복제 가치 때문에 지나친 보류는 피합니다.',
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
        note: '강화 단계보다 칠흑의 힘 공백과 파티 구간 맞추기를 먼저 봅니다.',
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
        label: '집정관 구간',
        skill: findSkillByNames(data, ['후광', '공허의 형상', '마력 주입']),
        note: '집정관은 후광 각도와 공허의 형상, 마력 주입이 같은 긴 피해 구간으로 묶이는지 봅니다.',
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
        label: '갈퀴 발톱 강화',
        skill: findSkillByNames(data, ['갈퀴 발톱']),
        note: '숨기 또는 호랑이의 분노 조건에서 새로 적용할 때 피해가 강해집니다.',
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
        label: '호랑이의 분노 구간',
        skill: findSkillByNames(data, ['호랑이의 분노']),
        note: '기력 과잉 없이 사용하고, 구간 안에서 새 출혈 또는 큰 소비기를 배치합니다.',
        segments: [[8, 13], [45, 13], [82, 13]],
      },
      {
        label: '발톱 전환',
        skill: findSkillByNames(data, ['물어뜯기', '찢어발기기']),
        note: '쐐기 발톱의 드루이드 빌드는 출혈 유지 뒤 직접 피해 구간을 얹습니다.',
        segments: [[30, 18], [63, 20]],
      },
      {
        label: '단일 소모',
        skill: findSkillByNames(data, ['흉포한 이빨', '최상위 포식자의 갈망']),
        note: '도려내기 유지 뒤 5연계 점수와 충분한 기력에서 우선 대상에 마무리합니다.',
        segments: [[34, 10], [58, 10], [86, 8]],
      },
      {
        label: '쿨다운 몰아넣기',
        skill: findSkillByNames(data, ['광폭화', '영혼 소집', '야성의 광기']),
        note: '출혈이 준비된 뒤 사용하되, 기다리느라 전투 전체 사용 횟수를 잃지 않는 것이 기준입니다.',
        segments: [[18, 18], [60, 18]],
      },
      {
        label: '쐐기 유틸',
        skill: findSkillByNames(data, ['나무 껍질', '두개골 강타', '달래기', '쇄도의 포효']),
        note: '첫 광역 구간보다 위협, 차단, 격노 해제, 파티 이동이 먼저인 구간을 분리합니다.',
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
            <span>{row.skill ? skillName(row.skill) : displayGuideText(row.label)}</span>
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
            <span>{displayGuideText(row.label)}</span>
            <strong>{displayGuideText(row.note)}</strong>
          </UptimeNote>
        </UptimeLane>
      ))}
      <ChartDataFootnote>
        실제 전투 로그의 유지율 퍼센트가 아니라, 가이드 설명에서 “언제 확인해야 하는가”를 읽기 쉽게 만든 확인 지도입니다.
      </ChartDataFootnote>
    </UptimeChart>
  );
}

function TargetScalingChart({ guide, skills }) {
  const labels = ['단일', '2대상', '광역', '우선 대상'];
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
  width: min(1240px, calc(100vw - 40px));
  max-width: calc(100vw - 40px);
  margin: 0 auto;
  padding: 28px 0 104px;
  overflow-x: hidden;
  min-width: 0;

  @media (max-width: 560px) {
    width: calc(100vw - 20px);
    max-width: calc(100vw - 20px);
    padding-top: 20px;
  }
`;

const Hero = styled.header`
  min-width: 0;
  overflow: hidden;
  border-top: 3px solid ${props => props.$color};
  border-bottom: 1px solid rgba(168, 178, 188, 0.16);
  background:
    linear-gradient(110deg, ${props => props.$tone} 0%, rgba(13, 18, 22, 0) 58%),
    rgba(13, 18, 22, 0.58);
`;

const HeroTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  padding: 13px 4px;
  border-bottom: 1px solid rgba(168, 178, 188, 0.11);
  min-width: 0;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  color: #c7bba7;
  font-size: 0.82rem;
  font-weight: 650;

  &:focus-visible {
    outline: 2px solid #d5b97d;
    outline-offset: 4px;
  }
`;

const PatchBadge = styled.div`
  flex: 0 0 auto;
  color: #d6dde2;
  font-size: 0.78rem;
  font-weight: 700;
`;

const HeroTopActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
  min-width: 0;
`;

const LogReportLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 30px;
  color: #75bda9;
  font-size: 0.76rem;
  font-weight: 700;
  border-bottom: 1px solid rgba(117, 189, 169, 0.4);

  &:hover {
    color: #a2d5c7;
    border-bottom-color: #a2d5c7;
  }

  @media (max-width: 460px) {
    span { display: none; }
  }
`;

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(240px, 300px);
  gap: clamp(24px, 5vw, 64px);
  padding: clamp(28px, 5vw, 52px) 4px;
  min-width: 0;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

const HeroEyebrow = styled.div`
  color: #d2b373;
  font-size: 0.78rem;
  font-weight: 750;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const HeroTitle = styled.h1`
  margin-top: 8px;
  color: #f2f4f5;
  font-size: clamp(2rem, 4vw, 3.35rem);
  line-height: 1.12;
  letter-spacing: 0;
  word-break: keep-all;
  text-wrap: balance;
`;

const HeroLead = styled.p`
  max-width: 72ch;
  margin-top: 16px;
  color: #c3cbd1;
  font-size: 1rem;
  font-weight: 480;
  line-height: 1.78;
  word-break: keep-all;
  overflow-wrap: anywhere;
  text-wrap: pretty;
`;

const HeroStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0;
  min-width: 0;
  align-self: end;
  border-top: 1px solid rgba(168, 178, 188, 0.16);
  border-left: 1px solid rgba(168, 178, 188, 0.16);

`;

const HeroStat = styled.div`
  min-width: 0;
  min-height: 70px;
  padding: 12px 14px;
  border-right: 1px solid rgba(168, 178, 188, 0.16);
  border-bottom: 1px solid rgba(168, 178, 188, 0.16);
  background: rgba(8, 13, 17, 0.48);

  span {
    color: #8e9aa3;
    font-size: 0.72rem;
    font-weight: 650;
    text-transform: uppercase;
  }

  strong {
    display: block;
    margin-top: 7px;
    color: #eef1f3;
    font-size: 0.88rem;
    font-weight: 720;
    line-height: 1.3;
    overflow-wrap: anywhere;
  }
`;

const GuideLayout = styled.div`
  display: grid;
  grid-template-columns: 210px minmax(0, 930px);
  justify-content: center;
  gap: clamp(28px, 4vw, 52px);
  margin-top: 36px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const GuideNav = styled.nav`
  position: sticky;
  top: 78px;
  align-self: start;
  display: grid;
  gap: 2px;
  max-height: calc(100vh - 100px);
  padding: 2px 14px 12px 0;
  overflow-y: auto;
  border-right: 1px solid rgba(168, 178, 188, 0.14);
  background: transparent;

  @media (max-width: 980px) {
    position: static;
    display: flex;
    gap: 0;
    max-width: 100%;
    padding: 0 0 10px;
    overflow-x: auto;
    overflow-y: hidden;
    border-right: 0;
    border-bottom: 1px solid rgba(168, 178, 188, 0.14);
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const GuideNavTitle = styled.div`
  margin-bottom: 8px;
  color: #eef1f3;
  font-size: 0.76rem;
  font-weight: 750;

  @media (max-width: 980px) {
    display: none;
  }
`;

const GuideNavLink = styled.a`
  display: grid;
  grid-template-columns: ${props => props.$chapter ? '24px minmax(0, 1fr)' : 'minmax(0, 1fr)'};
  align-items: baseline;
  gap: 6px;
  min-width: 0;
  padding: ${props => props.$chapter ? '6px 0' : '8px 0'};
  color: ${props => props.$chapter ? '#919da6' : '#cbd2d7'};
  font-size: ${props => props.$chapter ? '0.72rem' : '0.8rem'};
  font-weight: ${props => props.$chapter ? 540 : 700};
  border-left: 2px solid transparent;
  word-break: keep-all;
  line-height: 1.42;

  small {
    color: #7d8991;
    font-size: 0.64rem;
    font-variant-numeric: tabular-nums;
  }

  &:hover,
  &:focus-visible {
    color: #f2f4f5;
    border-left-color: #d2b373;
    padding-left: 8px;
  }

  &:focus-visible {
    outline: 2px solid #d2b373;
    outline-offset: 2px;
  }

  @media (max-width: 980px) {
    display: inline-flex;
    flex: 0 0 auto;
    padding: 7px 12px;
    border-left: 0;
    border-bottom: 2px solid transparent;
    white-space: nowrap;

    &:hover,
    &:focus-visible {
      padding-left: 12px;
      border-left-color: transparent;
      border-bottom-color: #d2b373;
    }

    small {
      display: none;
    }
  }
`;

const GuideNavChapterGroup = styled.div`
  display: grid;
  gap: 0;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(168, 178, 188, 0.1);

  @media (max-width: 980px) {
    display: contents;
  }
`;

const GuideNavGroupLabel = styled.div`
  margin-bottom: 5px;
  color: #75818a;
  font-size: 0.65rem;
  font-weight: 720;

  @media (max-width: 980px) {
    display: none;
  }
`;

const Article = styled.article`
  display: grid;
  gap: 0;
  min-width: 0;
`;

const SectionBlock = styled.section`
  min-width: 0;
  scroll-margin-top: clamp(96px, 14vh, 150px);
  padding: 34px 0 42px;
  border-bottom: 1px solid rgba(168, 178, 188, 0.13);

  &:first-child {
    padding-top: 0;
  }

  &#guide-core {
    display: flex;
    flex-direction: column;
  }
`;

const SectionHead = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 24px;
`;

const SectionIcon = styled.div`
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  color: #d9bd7b;
  border: 1px solid rgba(168, 178, 188, 0.18);
  background: rgba(13, 18, 22, 0.66);
`;

const SectionKicker = styled.div`
  color: #95a1a9;
  font-size: 0.68rem;
  font-weight: 680;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const SectionTitle = styled.h2`
  color: #eef1f3;
  font-size: clamp(1.28rem, 2.4vw, 1.72rem);
  letter-spacing: 0;
  text-wrap: balance;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 28px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryItem = styled.div`
  min-width: 0;
  padding: 16px 0 18px;
  border-top: 1px solid rgba(168, 178, 188, 0.13);
`;

const SummaryLabel = styled.div`
  color: #d2b373;
  font-size: 0.72rem;
  font-weight: 720;
`;

const SummaryText = styled.p`
  margin-top: 10px;
  color: #c7cfd4;
  font-size: 0.92rem;
  font-weight: 470;
  line-height: 1.72;
  word-break: keep-all;
  text-wrap: pretty;
`;

const ManuscriptStatus = styled.div`
  display: inline-flex;
  width: max-content;
  max-width: 100%;
  color: #d2b373;
  font-size: 0.72rem;
  font-weight: 720;
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
    color: #aeb8be;
    border-bottom: 1px solid rgba(168, 178, 188, 0.14);
    background: transparent;
    font-size: 0.72rem;
    font-weight: 620;
  }
`;

const PaperLead = styled.div`
  order: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 24px;
  align-items: start;
  min-width: 0;
  padding: 18px 20px;
  border-left: 3px solid ${props => props.$color};
  background: ${props => `${props.$color}0d`};

  p {
    margin-top: 8px;
    color: #e3e7e9;
    font-size: 1rem;
    font-weight: 520;
    line-height: 1.76;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const PaperBody = styled.div`
  order: 6;
  display: grid;
  gap: 0;
  margin-top: 38px;
`;

const PaperSection = styled.section`
  display: grid;
  grid-template-columns: ${props => props.$fullWidth ? 'minmax(0, 1fr)' : 'minmax(0, 1fr) minmax(220px, 286px)'};
  gap: clamp(20px, 3vw, 36px);
  min-width: 0;
  padding: 38px 0;
  border-top: 1px solid rgba(168, 178, 188, 0.12);
  scroll-margin-top: clamp(96px, 14vh, 150px);

  &:first-child {
    padding-top: 0;
    border-top: 0;
  }

  h3 {
    scroll-margin-top: clamp(96px, 14vh, 150px);
    color: #eef1f3;
    font-size: clamp(1.15rem, 2vw, 1.48rem);
    line-height: 1.38;
    letter-spacing: 0;
    text-wrap: balance;
  }

  p {
    margin-top: 12px;
    max-width: 74ch;
    color: #c7cfd4;
    font-size: 1rem;
    font-weight: 450;
    line-height: 1.9;
    word-break: keep-all;
    text-wrap: pretty;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const GuideDigestGrid = styled.div`
  order: 5;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 26px;
  margin-top: 28px;
  border-top: 1px solid rgba(168, 178, 188, 0.13);

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const GuideDigestCard = styled.a`
  min-width: 0;
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  column-gap: 10px;
  padding: 13px 0;
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid rgba(168, 178, 188, 0.1);
  transition: color 160ms ease, border-color 160ms ease;

  span {
    grid-row: 1 / 3;
    color: #88949c;
    font-size: 0.68rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  strong {
    display: block;
    color: #dfe4e7;
    font-size: 0.88rem;
    font-weight: 680;
    line-height: 1.42;
    word-break: keep-all;
  }

  p {
    display: -webkit-box;
    margin-top: 4px;
    overflow: hidden;
    color: #89959d;
    font-size: 0.73rem;
    font-weight: 450;
    line-height: 1.48;
    word-break: keep-all;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  &:hover {
    border-color: #d2b373;

    strong {
      color: #ffffff;
    }
  }

  &:focus-visible {
    outline: 2px solid #d2b373;
    outline-offset: 3px;
  }
`;

const PaperSectionBody = styled.div`
  min-width: 0;
  max-width: ${props => props.$wide ? 'none' : '74ch'};
`;

const PracticalTipSection = styled.div`
  min-width: 0;
  width: 100%;
  padding: 0;
  border-top: 2px solid ${props => props.$color};
  background: transparent;
  container-type: inline-size;
`;

const PracticalTipHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 10px;
  align-items: start;
  padding: 18px 0 16px;
  border-bottom: 1px solid rgba(168, 178, 188, 0.12);

  > div {
    min-width: 0;
  }

  > div:first-child {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 12px;
  }

  h3 {
    margin: 0;
  }

  @container (min-width: 900px) {
    gap: 11px;

    > div:first-child {
      align-items: baseline;
    }
  }

  @container (min-width: 760px) and (max-width: 899px) {
    gap: 10px;
  }
`;

const PracticalTipIntro = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
  gap: 8px;
  min-width: 0;

  @container (min-width: 640px) and (max-width: 899px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px 12px;
  }

  @container (min-width: 900px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px 12px;
  }

  @container (min-width: 1180px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 8px 12px;
  }

  p {
    display: -webkit-box;
    margin: 0;
    max-width: none;
    overflow: hidden;
    color: #d8cbb7;
    font-size: 0.84rem;
    font-weight: 720;
    line-height: 1.52;
    word-break: keep-all;
    overflow-wrap: anywhere;
    text-wrap: pretty;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }

  @container (max-width: 520px) {
    p {
      display: block;
      overflow: visible;
      font-size: 0.84rem;
      line-height: 1.58;
      -webkit-line-clamp: initial;
    }
  }
`;

const PracticalTipGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  grid-auto-flow: row;
  grid-auto-rows: auto;
  align-items: stretch;
  gap: 10px;
  margin-top: 14px;

  @container (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

const PracticalTipItem = styled.article`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
  column-gap: 9px;
  row-gap: 4px;
  min-width: 0;
  min-height: 0;
  padding: 13px 2px 14px;
  border-bottom: 1px solid ${props => props.$primary ? `${props.$color}66` : 'rgba(168, 178, 188, 0.12)'};
  background: transparent;

  @container (min-width: 1080px) {
    grid-template-columns: 72px minmax(0, 1fr);
    column-gap: 12px;
  }

  @container (min-width: 780px) {
    &[data-primary-tip='true'] {
      grid-column: span 1;
    }
  }

  span {
    width: max-content;
    max-width: 100%;
    display: inline-flex;
    align-items: center;
    margin-top: 2px;
    min-height: 20px;
    padding: 0 7px;
    color: #d5b97d;
    border: 0;
    border-left: 2px solid ${props => props.$primary ? props.$color : '#68757e'};
    background: transparent;
    font-size: 0.62rem;
    font-weight: 950;
    line-height: 1;
    letter-spacing: 0.05em;
  }

  p {
    margin: 0;
    color: #d7dde0;
    font-size: 0.87rem;
    font-weight: 500;
    line-height: 1.68;
    word-break: keep-all;
    overflow-wrap: anywhere;
    text-wrap: pretty;
  }

  @container (max-width: 520px) {
    grid-template-columns: minmax(0, 1fr);
    padding: 11px 12px;
    row-gap: 6px;

    span {
      min-height: 0;
      margin-top: 0;
    }

    p {
      font-size: 0.8rem;
      line-height: 1.54;
    }
  }
`;

const SectionNumber = styled.div`
  margin-bottom: 8px;
  color: #b8915b;
  font-size: 0.72rem;
  font-weight: 950;
  letter-spacing: 0.1em;
`;

const TakeawayPanel = styled.aside`
  grid-column: ${props => props.$wide ? '1 / -1' : 'auto'};
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
  grid-template-columns: ${props => props.$columns ? 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))' : '1fr'};
  gap: ${props => props.$columns ? '10px 14px' : '9px'};
  margin: 10px 0 0;
  padding: 0;
  list-style: none;

  li {
    position: relative;
    min-width: 0;
    padding-left: 13px;
    color: #efe4d4;
    font-size: 0.82rem;
    font-weight: 760;
    line-height: 1.58;
    word-break: keep-all;
    overflow-wrap: anywhere;
    text-wrap: pretty;
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

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: 9px;
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
  order: 4;
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

const TipGuideCard = styled(FieldGuideCard)`
  grid-column: 1 / -1;
  width: 100%;
  container-type: inline-size;

  > div:first-child {
    padding: 10px 12px;
  }

  @media (max-width: 980px) {
    grid-column: 1 / -1;
  }
`;

const HeroBranchSection = styled.section`
  order: 2;
  min-width: 0;
  grid-column: 1 / -1;
  margin: 34px 0 8px;
  overflow: hidden;
  border-top: 2px solid ${props => props.$color || 'rgba(184, 145, 91, 0.72)'};
  border-bottom: 1px solid rgba(168, 178, 188, 0.12);
  background: transparent;
  container-type: inline-size;
`;

const HeroBranchSectionHead = styled.div`
  border-bottom: 1px solid rgba(168, 178, 188, 0.1);

  span {
    display: block;
    margin-top: 4px;
    color: #9da6ad;
    font-size: 0.76rem;
    font-weight: 760;
    line-height: 1.45;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }
`;

const HeroBranchTabs = styled.div`
  display: flex;
  gap: 0;
  padding: 14px 14px 0;
  overflow-x: auto;
  border-bottom: 1px solid rgba(168, 178, 188, 0.12);
`;

const HeroBranchTab = styled.button`
  flex: 0 0 auto;
  min-height: 44px;
  padding: 0 18px;
  border: 0;
  border-bottom: 2px solid ${props => props.$active ? props.$color : 'transparent'};
  background: transparent;
  color: ${props => props.$active ? '#f2f4f5' : '#8f9aa2'};
  font-size: 0.86rem;
  font-weight: ${props => props.$active ? 740 : 560};
  transition: color 160ms ease, border-color 160ms ease;

  &:hover {
    color: #f2f4f5;
  }

  &:focus-visible {
    outline: 2px solid #d2b373;
    outline-offset: -2px;
  }
`;

const HeroBranchGrid = styled(FieldGuideGrid)`
  grid-template-columns: minmax(0, 1fr);
  gap: 0;
  margin: 0;
  padding: 18px 14px 14px;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
    padding: 12px;
  }
`;

const HeroBranchCard = styled.article`
  display: grid;
  align-content: start;
  gap: 12px;
  min-width: 0;
  border: 1px solid rgba(168, 178, 188, 0.12);
  border-left: 3px solid ${props => props.$color || '#b8915b'};
  padding-bottom: 0;
  overflow: hidden;
  background: rgba(10, 15, 19, 0.46);
`;

const HeroBranchCardTop = styled.div`
  display: grid;
  gap: 8px;
  min-width: 0;
`;

const HeroBranchTitle = styled.div`
  display: grid;
  gap: 2px;
  min-width: 0;

  span {
    color: #9da6ad;
    font-size: 0.62rem;
    font-weight: 950;
    line-height: 1.15;
  }

  strong {
    color: #f4efe5;
    font-size: clamp(0.98rem, 1.6vw, 1.18rem);
    font-weight: 980;
    line-height: 1.18;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }
`;

const HeroBranchReason = styled.div`
  display: grid;
  gap: 6px;
  margin: 0 14px;
  padding: 10px;
  border-left: 2px solid rgba(210, 179, 115, 0.42);
  background: transparent;

  span {
    color: #b8915b;
    font-size: 0.68rem;
    font-weight: 950;
  }

  p {
    margin: 0;
    color: #c7cfd4;
    font-size: 0.82rem;
    font-weight: 480;
    line-height: 1.68;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }
`;

const HeroBranchSkillBlock = styled.div`
  display: grid;
  gap: 8px;
  padding: 0 14px;

  > span {
    color: #9da6ad;
    font-size: 0.68rem;
    font-weight: 950;
  }
`;

const HeroBranchSkillList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    min-width: 0;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    max-width: 100%;
    padding: 5px 9px 5px 6px;
    border: 1px solid rgba(244, 239, 229, 0.1);
    background: rgba(8, 13, 17, 0.42);
  }

  span {
    min-width: 0;
    color: #f4efe5;
    font-size: 0.76rem;
    font-weight: 900;
    line-height: 1.25;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }
`;

const HeroBranchFlowStrip = styled.div`
  display: grid;
  gap: 9px;
  margin: 0 14px;
  padding: 11px 12px;
  border: 1px solid ${props => `${props.$color || '#b8915b'}55`};
  background:
    linear-gradient(90deg, ${props => `${props.$color || '#b8915b'}22`}, rgba(8, 13, 17, 0.1)),
    rgba(8, 13, 17, 0.48);

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    min-width: 0;
  }

  span {
    color: #f4efe5;
    font-size: 0.72rem;
    font-weight: 980;
    line-height: 1.2;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }

  p {
    margin: 0;
    color: #efe4d4;
    font-size: 0.82rem;
    font-weight: 780;
    line-height: 1.58;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }

  @container (max-width: 520px) {
    > div {
      display: grid;
      justify-content: stretch;
    }
  }
`;

const HeroBranchFlowIcons = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 6px;
  min-width: 0;

  @container (max-width: 520px) {
    justify-content: flex-start;
  }
`;

const HeroBranchFocusList = styled.ul`
  display: grid;
  gap: 1px;
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid rgba(244, 239, 229, 0.08);

  li {
    display: grid;
    grid-template-columns: minmax(88px, 0.24fr) minmax(0, 1fr);
    gap: 10px;
    min-width: 0;
    padding: 11px 14px;
    background: rgba(8, 13, 17, 0.34);
  }

  b {
    color: #b8915b;
    font-size: 0.7rem;
    font-weight: 950;
    line-height: 1.35;
    word-break: keep-all;
  }

  p {
    margin: 0;
    color: #e8decd;
    font-size: 0.8rem;
    font-weight: 760;
    line-height: 1.55;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }

  @container (max-width: 520px) {
    li {
      grid-template-columns: 1fr;
      gap: 5px;
    }
  }
`;

const HeroBranchComparison = styled.div`
  display: grid;
  gap: 12px;
  margin: 0 14px 14px;
  padding: 13px;
  border: 1px solid rgba(244, 239, 229, 0.1);
  border-top: 2px solid ${props => props.$color || '#b8915b'};
  background:
    linear-gradient(135deg, ${props => `${props.$color || '#b8915b'}16`}, rgba(8, 13, 17, 0.12) 68%),
    rgba(8, 13, 17, 0.5);
`;

const HeroBranchComparisonHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;

  strong {
    color: #f4efe5;
    font-size: 0.94rem;
    font-weight: 980;
    line-height: 1.25;
    word-break: keep-all;
  }

  span {
    color: #9da6ad;
    font-size: 0.72rem;
    font-weight: 780;
    line-height: 1.45;
    text-align: right;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }

  @container (max-width: 720px) {
    display: grid;

    span {
      text-align: left;
    }
  }
`;

const HeroBranchComparisonBody = styled.div`
  display: grid;
  gap: 8px;
`;

const HeroBranchComparisonRow = styled.div`
  display: grid;
  grid-template-columns: minmax(108px, 0.18fr) minmax(0, 1fr);
  gap: 10px;
  min-width: 0;
  align-items: stretch;

  @container (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const HeroBranchComparisonAxis = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  padding: 9px 10px;
  border-left: 3px solid rgba(184, 145, 91, 0.55);
  background: rgba(244, 239, 229, 0.04);
  color: #d9b97a;
  font-size: 0.72rem;
  font-weight: 960;
  line-height: 1.35;
  word-break: keep-all;
`;

const HeroBranchComparisonCells = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.$columns || 2}, minmax(0, 1fr));
  gap: 8px;
  min-width: 0;

  @container (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

const HeroBranchComparisonCell = styled.div`
  min-width: 0;
  padding: 10px 11px;
  border: 1px solid rgba(244, 239, 229, 0.08);
  background: rgba(8, 13, 17, 0.48);

  b {
    display: block;
    margin-bottom: 5px;
    color: #f4efe5;
    font-size: 0.8rem;
    font-weight: 960;
    line-height: 1.3;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }

  p {
    margin: 0;
    color: #d8cbb7;
    font-size: 0.78rem;
    font-weight: 740;
    line-height: 1.58;
    word-break: keep-all;
    overflow-wrap: anywhere;
    text-wrap: pretty;
  }
`;

const OpenerFlowCard = styled(FieldGuideCard)`
  order: 3;
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
  border-top: 1px solid rgba(244, 239, 229, 0.08);
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

const FlowCardHeadText = styled.div`
  display: grid;
  gap: 3px;
  min-width: 0;

  strong,
  span {
    min-width: 0;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }

  span {
    color: #d9b97a;
    font-size: 0.72rem;
    font-weight: 850;
    line-height: 1.35;
  }
`;

const FieldGuideList = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 24px;
  margin: 0;
  padding: 13px;
  list-style: none;

  li {
    min-width: 0;
    padding: 10px 0;
    border-bottom: 1px solid rgba(244, 239, 229, 0.07);
  }

  span {
    display: block;
    color: #d2b373;
    font-size: 0.7rem;
    font-weight: 720;
  }

  p {
    margin-top: 4px;
    color: #cbd2d7;
    font-size: 0.86rem;
    font-weight: 480;
    line-height: 1.68;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const OpenerFlowViewport = styled.div`
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  border-top: 1px solid rgba(244, 239, 229, 0.07);
  border-bottom: 1px solid rgba(244, 239, 229, 0.07);
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
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  grid-auto-flow: column;
  grid-auto-columns: clamp(220px, 22cqw, 278px);
  align-items: start;
  gap: 22px;
  margin: 0;
  padding: 24px 20px 24px;
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
    box-sizing: border-box;
    border: 0;
    background: transparent;
    box-shadow: none;
    scroll-snap-align: start;
    overflow: hidden;
    text-align: center;
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
    grid-auto-flow: row;
    grid-template-columns: minmax(0, 1fr);
    grid-auto-columns: initial;
    gap: 13px;
    overflow-x: hidden;
    overflow-y: visible;
    padding: 17px 14px 20px;
    scroll-snap-type: none;
    scroll-padding-inline: 0;

    &::before {
      display: block;
      top: 38px;
      bottom: 38px;
      left: 40px;
      right: auto;
      width: 2px;
      height: auto;
      background: linear-gradient(180deg, rgba(184, 145, 91, 0.08), var(--flow-line), rgba(184, 145, 91, 0.12));
    }

    li {
      grid-template-columns: 60px minmax(0, 1fr);
      grid-template-rows: auto;
      justify-items: start;
      gap: 12px;
      min-height: 0;
      padding: 0;
      align-items: start;
      overflow: visible;
      text-align: left;
    }

    li::before {
      left: 60px;
      right: auto;
      top: 27px;
      bottom: auto;
      width: 14px;
      height: 2px;
      background: linear-gradient(90deg, var(--flow-color), rgba(184, 145, 91, 0.08));
    }

    li:not(:last-child)::after {
      content: '';
      top: auto;
      right: auto;
      bottom: -10px;
      left: 34px;
      width: 0;
      height: 0;
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      border-top: 9px solid var(--flow-color);
      border-bottom: 0;
      background: transparent;
      transform: none;
    }

    li:last-child::before {
      display: none;
    }
  }

  @container (max-width: 640px) {
    grid-auto-flow: row;
    grid-template-columns: minmax(0, 1fr);
    grid-auto-columns: initial;
    gap: 13px;
    overflow-x: hidden;
    overflow-y: visible;
    padding: 17px 14px 20px;
    scroll-snap-type: none;
    scroll-padding-inline: 0;

    &::before {
      display: block;
      top: 38px;
      bottom: 38px;
      left: 40px;
      right: auto;
      width: 2px;
      height: auto;
      background: linear-gradient(180deg, rgba(184, 145, 91, 0.08), var(--flow-line), rgba(184, 145, 91, 0.12));
    }

    li {
      grid-template-columns: 60px minmax(0, 1fr);
      grid-template-rows: auto;
      justify-items: start;
      gap: 12px;
      min-height: 0;
      padding: 0;
      align-items: start;
      overflow: visible;
    }

    li::before {
      left: 60px;
      right: auto;
      top: 27px;
      bottom: auto;
      width: 14px;
      height: 2px;
      background: linear-gradient(90deg, var(--flow-color), rgba(184, 145, 91, 0.08));
    }

    li:not(:last-child)::after {
      content: '';
      top: auto;
      right: auto;
      bottom: -10px;
      left: 34px;
      width: 0;
      height: 0;
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      border-top: 9px solid var(--flow-color);
      border-bottom: 0;
      background: transparent;
      transform: none;
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
  overflow-wrap: anywhere;

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
    grid-row: auto;
    align-self: start;
    box-sizing: border-box;
    width: 60px;
    height: 60px;
    box-shadow:
      0 0 0 4px rgba(8, 13, 17, 0.9),
      0 0 0 5px rgba(184, 145, 91, 0.14);

    &::before {
      inset: 6px;
    }

    &::after {
      inset: 0;
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
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
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
    min-width: 0;
    max-width: 100%;
    color: #f4efe5;
    font-size: 0.86rem;
    font-weight: 950;
    line-height: 1.32;
    word-break: keep-all;
    overflow-wrap: anywhere;
    text-wrap: pretty;
  }

  p {
    display: -webkit-box;
    min-width: 0;
    max-width: 100%;
    margin: 0;
    overflow: hidden;
    color: #b8c2c8;
    font-size: 0.72rem;
    font-weight: 760;
    line-height: 1.5;
    word-break: keep-all;
    overflow-wrap: anywhere;
    text-wrap: pretty;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  @media (max-width: 560px) {
    grid-column: auto;
    grid-row: auto;
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
  box-sizing: border-box;
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
  top: -5px;
  left: -5px;
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
    top: -4px;
    left: -4px;
    width: 22px;
    height: 22px;
    font-size: 0.62rem;
  }
`;

const TipList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
  grid-auto-flow: row;
  grid-auto-rows: auto;
  align-items: stretch;
  align-content: start;
  gap: 10px;
  margin: 0;
  padding: ${props => props.$compact ? '11px 11px 8px' : '11px'};
  max-height: none;
  overflow-y: visible;
  overscroll-behavior: contain;
  scrollbar-color: rgba(184, 145, 91, 0.52) rgba(8, 13, 17, 0.48);
  scrollbar-width: thin;
  list-style: none;

  li {
    position: relative;
    display: ${props => props.$expanded ? 'block' : '-webkit-box'};
    min-width: 0;
    min-height: 0;
    padding: 11px 6px 12px 18px;
    overflow: ${props => props.$expanded ? 'visible' : 'hidden'};
    border-bottom: 1px solid rgba(168, 178, 188, 0.11);
    background: transparent;
    color: #cbd2d7;
    font-size: 0.86rem;
    font-weight: 480;
    line-height: 1.68;
    word-break: keep-all;
    overflow-wrap: anywhere;
    text-wrap: pretty;
    -webkit-line-clamp: ${props => props.$expanded ? 'initial' : 4};
    -webkit-box-orient: vertical;
  }

  li::before {
    content: '';
    position: absolute;
    top: 21px;
    left: 5px;
    width: 4px;
    height: 4px;
    border-radius: 999px;
    background: #d9b97a;
    box-shadow: 0 0 0 3px rgba(184, 145, 91, 0.12);
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(8, 13, 17, 0.48);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(184, 145, 91, 0.46);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 11px;
  }

  @container (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 11px;

    li {
      display: block;
      padding: 9px 10px 9px 17px;
      font-size: 0.84rem;
      line-height: 1.66;
      overflow: visible;
      -webkit-line-clamp: initial;
    }
  }
`;

const TipListControls = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 12px 12px;
`;

const TipExpandButton = styled.button`
  min-height: 34px;
  padding: 0 14px;
  color: #f4efe5;
  border: 1px solid rgba(184, 145, 91, 0.34);
  background:
    linear-gradient(180deg, rgba(184, 145, 91, 0.16), rgba(8, 13, 17, 0.48)),
    #10161b;
  font-size: 0.76rem;
  font-weight: 900;
  line-height: 1;
  cursor: pointer;
  transition: border-color 160ms ease, background 160ms ease;

  &:hover {
    border-color: rgba(184, 145, 91, 0.62);
    background:
      linear-gradient(180deg, rgba(184, 145, 91, 0.24), rgba(8, 13, 17, 0.56)),
      #121a20;
  }

  &:focus-visible {
    outline: 2px solid rgba(244, 239, 229, 0.74);
    outline-offset: 2px;
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
  grid-template-columns: ${props => props.$columns ? 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))' : '1fr'};
  gap: ${props => props.$columns ? '10px 16px' : '8px'};
  margin: 12px 0 0;
  padding-left: 18px;
  color: #b7c0c6;
  font-size: 0.86rem;
  font-weight: 460;
  line-height: 1.72;
  word-break: keep-all;

  li {
    min-width: 0;
    overflow-wrap: anywhere;
    text-wrap: pretty;
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
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
  color: #e7c46f;
  font-weight: 680;
  line-height: 1.35;
  text-decoration: none;
  vertical-align: -0.18em;
  white-space: nowrap;
  word-break: keep-all;
  overflow-wrap: normal;
  border-bottom: 1px solid rgba(231, 196, 111, 0.22);

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
    color: #f7dda0;
    border-bottom-color: rgba(247, 221, 160, 0.76);
  }

  &:focus-visible {
    outline: 2px solid #d2b373;
    outline-offset: 2px;
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
  grid-template-columns: ${props => props.$detailed ? 'minmax(96px, 128px) minmax(0, 1fr) minmax(92px, 126px)' : '110px minmax(0, 1fr) 86px'};
  gap: 10px;
  align-items: ${props => props.$detailed ? 'start' : 'center'};
  min-height: 48px;
  padding: ${props => props.$detailed ? '11px 12px' : '9px'};
  border: 1px solid rgba(244, 239, 229, 0.08);
  background: ${props => props.$detailed ? 'linear-gradient(135deg, rgba(184, 145, 91, 0.08), rgba(8, 13, 17, 0.92))' : '#080d11'};

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const EventTime = styled.div`
  color: #b8915b;
  font-size: 0.74rem;
  font-weight: 900;
`;

const EventName = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  min-width: 0;
  color: #f4efe5;
  font-size: 0.82rem;
  font-weight: 900;

  strong,
  span {
    overflow-wrap: anywhere;
  }
`;

const EventNameStack = styled.div`
  display: grid;
  gap: 4px;
  min-width: 0;

  strong {
    color: #f4efe5;
    font-size: 0.84rem;
    font-weight: 950;
    line-height: 1.25;
    word-break: keep-all;
    overflow-wrap: anywhere;
  }
`;

const EventNote = styled.span`
  display: block;
  color: #c7bba7;
  font-size: 0.72rem;
  font-weight: 760;
  line-height: 1.48;
  word-break: keep-all;
  overflow-wrap: anywhere;
  text-wrap: pretty;
`;

const EventAction = styled.div`
  color: #c7bba7;
  font-size: 0.72rem;
  font-weight: 850;
  line-height: 1.38;
  word-break: keep-all;
  overflow-wrap: anywhere;
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

  .graph-synergy-node .node-hitbox {
    fill: rgba(8, 13, 17, 0.001);
    stroke: none;
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

  .graph-skill-node .node-hitbox {
    fill: rgba(8, 13, 17, 0.001);
    stroke: none;
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

    .graph-skill-node .skill-label {
      display: none;
    }

    .center-meta {
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
