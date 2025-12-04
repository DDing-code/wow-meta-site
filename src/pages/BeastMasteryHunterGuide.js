/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 야수 사냥꾼 전문가용 심층 가이드 v2.0
 * The War Within 시즌 3 (11.1) - 악마사냥꾼 디자인 수준 완전 적용
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 📋 데이터 출처:
 * ├── Icy Veins (Azortharion), Method (Qenjua), Wowhead
 * ├── Discord Trueshot Lodge
 * └── 99-META/TERMINOLOGY_GUIDE.md (용어 규칙)
 * 
 * 📖 용어 규칙: "버스트" → "극딜", "광역" → "광딜", "퍼널" → "깔때기 딜"
 * 📅 패치: 11.1 | ✅ 최종 검증: 2025-12-02
 * 
 * 🎯 v2.0 변경사항:
 * - 악마사냥꾼 가이드 구조 완전 복제
 * - ProcSystemDiagram SVG 빔 애니메이션
 * - 모든 MCP Magic 패턴 적용
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useKB } from '../hooks/useKB';

// ═══════════════════════════════════════════════════════════════════════════
// 📊 스킬 데이터베이스
// ═══════════════════════════════════════════════════════════════════════════
const SKILL_DB = {
  // === 핵심 스킬 (Wowhead 공식 번역명) ===
  killCommand: { id: 34026, name: "살상 명령", nameEn: "Kill Command", icon: "ability_hunter_killcommand", type: "skill" },
  barbedShot: { id: 217200, name: "날카로운 사격", nameEn: "Barbed Shot", icon: "ability_hunter_barbedshot", type: "skill" },
  bestialWrath: { id: 19574, name: "야수의 격노", nameEn: "Bestial Wrath", icon: "ability_druid_ferociousbite", type: "skill" },
  callOfTheWild: { id: 359844, name: "야생의 부름", nameEn: "Call of the Wild", icon: "ability_hunter_callofthewild", type: "skill" },
  cobraShot: { id: 193455, name: "코브라 사격", nameEn: "Cobra Shot", icon: "ability_hunter_cobrashot", type: "skill" },
  bloodshed: { id: 321530, name: "유혈", nameEn: "Bloodshed", icon: "ability_druid_primaltenacity", type: "skill" },
  multiShot: { id: 2643, name: "일제 사격", nameEn: "Multi-Shot", icon: "ability_upgrademoonglaive", type: "skill" },
  direBeast: { id: 120679, name: "광포한 야수", nameEn: "Dire Beast", icon: "ability_hunter_longevity", type: "skill" },
  barrage: { id: 120360, name: "탄막", nameEn: "Barrage", icon: "ability_hunter_rapidregeneration", type: "skill" },
  
  // === 어둠 순찰자 스킬 ===
  blackArrow: { id: 194599, name: "검은 화살", nameEn: "Black Arrow", icon: "spell_shadow_painspike", type: "skill" },
  
  // === 버프 🔵 ===
  frenzy: { id: 272790, name: "광기", nameEn: "Frenzy", icon: "ability_hunter_barbedshot", type: "buff" },
  beastCleave: { id: 118455, name: "야수의 회전베기", nameEn: "Beast Cleave", icon: "ability_hunter_sickem", type: "buff" },
  leadFromFront: { id: 472741, name: "솔선수범", nameEn: "Lead From the Front", icon: "buff_epichunter", type: "buff" },
  smokeScreen: { id: 430709, name: "연막 전술", nameEn: "Smoke Screen", icon: "spell_warlock_demonsoul", type: "buff" },
  
  // === 프록 ⚡ ===
  deathblow: { id: 343248, name: "죽음의 강타", nameEn: "Deathblow", icon: "ability_hunter_runningshot", type: "proc" },
  wildCall: { id: 185791, name: "야성의 부름", nameEn: "Wild Call", icon: "ability_hunter_masterscall", type: "proc" },
  howl: { id: 462515, name: "무리의 울음소리", nameEn: "Howl of the Pack", icon: "spell_hunter_lonewolf", type: "proc" },
  stampede: { id: 201430, name: "쇄도", nameEn: "Stampede", icon: "ability_hunter_bestialdiscipline", type: "proc" },
  stomp: { id: 201754, name: "발구르기", nameEn: "Stomp", icon: "ability_warstomp", type: "proc" },
  
  // === 디버프 🔴 ===
  bleakPowder: { id: 467911, name: "황폐의 화약", nameEn: "Bleak Powder", icon: "inv_misc_powder_tin", type: "debuff" },
  
  // === 유틸리티 스킬 ===
  survivalOfTheFittest: { id: 264735, name: "적자생존", nameEn: "Survival of the Fittest", icon: "spell_nature_spiritarmor", type: "skill" },
  exhilaration: { id: 109304, name: "활기", nameEn: "Exhilaration", icon: "ability_hunter_onewithnature", type: "skill" },
  aspectOfTheTurtle: { id: 186265, name: "거북의 상", nameEn: "Aspect of the Turtle", icon: "ability_hunter_pet_turtle", type: "skill" },
  misdirection: { id: 34477, name: "눈속임", nameEn: "Misdirection", icon: "ability_hunter_misdirection", type: "skill" },
  counterShot: { id: 147362, name: "반격의 사격", nameEn: "Counter Shot", icon: "inv_ammo_arrow_03", type: "skill" },
  intimidation: { id: 19577, name: "위협", nameEn: "Intimidation", icon: "ability_devour", type: "skill" },
  freezingTrap: { id: 187650, name: "빙결 덧", nameEn: "Freezing Trap", icon: "spell_frost_chainsofice", type: "skill" },
  bindingShot: { id: 109248, name: "구속의 사격", nameEn: "Binding Shot", icon: "spell_shaman_bindelemental", type: "skill" },
  aspectOfTheCheetah: { id: 186257, name: "치타의 상", nameEn: "Aspect of the Cheetah", icon: "ability_mount_jungletiger", type: "skill" },
  disengage: { id: 781, name: "철수", nameEn: "Disengage", icon: "ability_rogue_feint", type: "skill" },
  primalRage: { id: 264667, name: "원초적 분노", nameEn: "Primal Rage", icon: "spell_shadow_unholyfrenzy", type: "skill" },
};

const TYPE_EMOJI = {
  skill: '',
  buff: '🔵',
  debuff: '🔴',
  proc: '⚡',
  passive: '🔶',
};

// ═══════════════════════════════════════════════════════════════════════════
// 🎨 디자인 시스템
// ═══════════════════════════════════════════════════════════════════════════
const THEME = {
  primary: '#AAD372', // 사냥꾼 녹색
  darkRanger: '#DC2626', // 어둠 순찰자 레드
  packLeader: '#3B82F6', // 무리의 인도자 블루
  accent: '#ff6b6b',
  buff: '#4ecdc4',
  warning: '#ffd93d',
  success: '#4ADE80',
  info: '#60A5FA',
  danger: '#EF4444',
  bg: { primary: '#0D0D14', secondary: '#1A1A2E', card: '#1E1E32', highlight: '#252542' },
  text: { primary: '#FFFFFF', secondary: '#B8B8D0', muted: '#6B7280' }
};

// ═══════════════════════════════════════════════════════════════════════════
// 📊 데이터 정의
// ═══════════════════════════════════════════════════════════════════════════
const DARK_RANGER_ST_PRIORITY = [
  { rank: 1, skill: SKILL_DB.blackArrow, condition: "죽음의 강타 발동 시", reason: "최우선, 즉시 소비", critical: true },
  { rank: 2, skill: SKILL_DB.bestialWrath, condition: "야생의 부름 30초 이내면 홀드", reason: "쿨다운 정렬" },
  { rank: 3, skill: SKILL_DB.bloodshed, condition: "쿨다운 즉시", reason: "1분 쿨다운" },
  { rank: 4, skill: SKILL_DB.callOfTheWild, condition: "쿨다운 즉시", reason: "극딜 시작" },
  { rank: 5, skill: SKILL_DB.killCommand, condition: "충전 있을 때", reason: "죽음의 강타 20%" },
  { rank: 6, skill: SKILL_DB.barbedShot, condition: "2충전 근접 / 야성의 부름", reason: "죽음의 강타 50%" },
  { rank: 7, skill: SKILL_DB.cobraShot, condition: "집중력 캡 방지", reason: "필러, 야생의 부름 중 금지!", critical: true },
];

const DARK_RANGER_AOE_PRIORITY = [
  { rank: 1, skill: SKILL_DB.multiShot, condition: "야수의 회전베기 만료 2초 전", reason: "클리브 유지", critical: true },
  { rank: 2, skill: SKILL_DB.blackArrow, condition: "죽음의 강타 발동 시", reason: "여전히 최우선" },
  { rank: 3, skill: SKILL_DB.bestialWrath, condition: "쿨다운 즉시", reason: "펫 피해 증폭" },
  { rank: 4, skill: SKILL_DB.callOfTheWild, condition: "큰 팩에서", reason: "극딜" },
  { rank: 5, skill: SKILL_DB.barbedShot, condition: "멀티도팅 권장", reason: "발구르기 + 광기" },
  { rank: 6, skill: SKILL_DB.killCommand, condition: "야수의 회전베기 활성 중", reason: "클리브 적용" },
  { rank: 7, skill: SKILL_DB.cobraShot, condition: "집중력 캡 방지", reason: "필러" },
];

const PACK_LEADER_ST_PRIORITY = [
  { rank: 1, skill: SKILL_DB.bestialWrath, condition: "울음 ≤16초", reason: "이중 쇄도", critical: true },
  { rank: 2, skill: SKILL_DB.barbedShot, condition: "2충전 근접", reason: "충전 낭비 방지" },
  { rank: 3, skill: SKILL_DB.callOfTheWild, condition: "쿨다운 즉시", reason: "극딜" },
  { rank: 4, skill: SKILL_DB.bloodshed, condition: "쿨다운 즉시", reason: "1분 쿨다운" },
  { rank: 5, skill: SKILL_DB.killCommand, condition: "울음 임박 시 홀드", reason: "쇄도 트리거", critical: true },
  { rank: 6, skill: SKILL_DB.barbedShot, condition: "광기 유지", reason: "낮은 우선순위" },
  { rank: 7, skill: SKILL_DB.cobraShot, condition: "집중력 캡 방지", reason: "필러, 울음 감소" },
];

const PACK_LEADER_AOE_PRIORITY = [
  { rank: 1, skill: SKILL_DB.multiShot, condition: "야수의 회전베기 만료 2초 전", reason: "클리브 유지", critical: true },
  { rank: 2, skill: SKILL_DB.bestialWrath, condition: "울음 ≤16초 + 큰 팩", reason: "이중 쇄도" },
  { rank: 3, skill: SKILL_DB.callOfTheWild, condition: "큰 팩에서", reason: "최대 극딜" },
  { rank: 4, skill: SKILL_DB.barbedShot, condition: "발구르기 + 멀티도팅", reason: "광딜 피해" },
  { rank: 5, skill: SKILL_DB.killCommand, condition: "야수의 회전베기 활성 중", reason: "쇄도 트리거" },
  { rank: 6, skill: SKILL_DB.bloodshed, condition: "우선순위 대상", reason: "단일 대상" },
  { rank: 7, skill: SKILL_DB.cobraShot, condition: "집중력 캡 방지", reason: "울음 감소" },
];

const DARK_RANGER_ST_OPENER = [
  { step: 1, timing: "-2초", skill: SKILL_DB.barbedShot, note: "선풀 광기", phase: "prepull" },
  { step: 2, timing: "풀", skill: SKILL_DB.bestialWrath, note: "펫 25%↑", highlight: true, phase: "pull" },
  { step: 3, timing: "", skill: SKILL_DB.bloodshed, note: "출혈", phase: "setup" },
  { step: 4, timing: "💥", skill: SKILL_DB.callOfTheWild, note: "극딜!", highlight: true, phase: "burst" },
  { step: 5, timing: "16초", skill: SKILL_DB.blackArrow, note: "보장", phase: "burst" },
  { step: 6, timing: "", skill: SKILL_DB.killCommand, note: "", phase: "burst" },
  { step: 7, timing: "", skill: SKILL_DB.barbedShot, note: "50%", phase: "burst" },
  { step: 8, timing: "12초", skill: SKILL_DB.blackArrow, note: "보장", phase: "burst" },
  { step: 9, timing: "8초", skill: SKILL_DB.blackArrow, note: "보장", phase: "burst" },
  { step: 10, timing: "4초", skill: SKILL_DB.blackArrow, note: "보장", phase: "burst" },
  { step: 11, timing: "0초", skill: SKILL_DB.blackArrow, note: "마지막", phase: "burst" },
  { step: 12, timing: "→", skill: null, note: "우선순위", phase: "continue" },
];

const PACK_LEADER_ST_OPENER = [
  { step: 1, timing: "대기", skill: null, note: "울음 ≤16초", phase: "prepull" },
  { step: 2, timing: "-2초", skill: SKILL_DB.barbedShot, note: "선풀", phase: "prepull" },
  { step: 3, timing: "풀", skill: SKILL_DB.bestialWrath, note: "솔선수범", highlight: true, phase: "pull" },
  { step: 4, timing: "⚡", skill: SKILL_DB.howl, note: "자동", phase: "setup" },
  { step: 5, timing: "💥", skill: SKILL_DB.killCommand, note: "쇄도!", highlight: true, phase: "burst" },
  { step: 6, timing: "", skill: SKILL_DB.bloodshed, note: "출혈", phase: "burst" },
  { step: 7, timing: "", skill: SKILL_DB.callOfTheWild, note: "극딜", phase: "burst" },
  { step: 8, timing: "", skill: SKILL_DB.barbedShot, note: "광기", phase: "burst" },
  { step: 9, timing: "", skill: SKILL_DB.killCommand, note: "", phase: "burst" },
  { step: 10, timing: "", skill: SKILL_DB.cobraShot, note: "울음↓", phase: "burst" },
  { step: 11, timing: "⚡", skill: SKILL_DB.howl, note: "두번째", phase: "burst" },
  { step: 12, timing: "💥", skill: SKILL_DB.killCommand, note: "쇄도!", highlight: true, phase: "burst" },
  { step: 13, timing: "→", skill: null, note: "우선순위", phase: "continue" },
];

const DARK_RANGER_AOE_OPENER = [
  { step: 1, timing: "풀", skill: SKILL_DB.multiShot, note: "회전베기", phase: "pull" },
  { step: 2, timing: "", skill: SKILL_DB.barbedShot, note: "대상1", phase: "setup" },
  { step: 3, timing: "", skill: SKILL_DB.bestialWrath, note: "펫↑", phase: "setup" },
  { step: 4, timing: "💥", skill: SKILL_DB.callOfTheWild, note: "4+타겟", highlight: true, phase: "burst" },
  { step: 5, timing: "", skill: SKILL_DB.blackArrow, note: "프록시", phase: "burst" },
  { step: 6, timing: "", skill: SKILL_DB.killCommand, note: "", phase: "burst" },
  { step: 7, timing: "", skill: SKILL_DB.multiShot, note: "갱신", phase: "burst" },
  { step: 8, timing: "", skill: SKILL_DB.barbedShot, note: "대상2", phase: "burst" },
  { step: 9, timing: "→", skill: null, note: "반복", phase: "continue" },
];

const PACK_LEADER_AOE_OPENER = [
  { step: 1, timing: "풀", skill: SKILL_DB.multiShot, note: "회전베기", phase: "pull" },
  { step: 2, timing: "", skill: SKILL_DB.barbedShot, note: "대상1", phase: "setup" },
  { step: 3, timing: "대기", skill: null, note: "울음 ≤16초", phase: "setup" },
  { step: 4, timing: "💥", skill: SKILL_DB.bestialWrath, note: "이중!", highlight: true, phase: "burst" },
  { step: 5, timing: "", skill: SKILL_DB.killCommand, note: "쇄도", phase: "burst" },
  { step: 6, timing: "", skill: SKILL_DB.callOfTheWild, note: "4+타겟", phase: "burst" },
  { step: 7, timing: "", skill: SKILL_DB.multiShot, note: "갱신", phase: "burst" },
  { step: 8, timing: "", skill: SKILL_DB.barbedShot, note: "대상2", phase: "burst" },
  { step: 9, timing: "💥", skill: SKILL_DB.killCommand, note: "쇄도!", highlight: true, phase: "burst" },
  { step: 10, timing: "→", skill: null, note: "반복", phase: "continue" },
];

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 최상위 유저 고급 팁 데이터 (NotebookLM 분석)
// ═══════════════════════════════════════════════════════════════════════════
const PRO_TIPS_DATA = {
  darkRanger: {
    mindset: {
      title: "🎰 로또 복권 마인드",
      description: "야생의 부름이 켜지는 순간이 '당첨 기회'. 살상 명령과 날카로운 사격은 당첨 번호(검은화살)가 나오길 바라며 긁는 '복권'. 궁극적 목표는 10발의 검은화살을 터뜨리는 것!",
      icon: "🎲"
    },
    coreChanges: [
      { title: "4세트 혁명", detail: "검은화살 최대 2발 → 10발. 고점 쿨기 딜러로 완전 변화" },
      { title: "1야부 1야격", detail: "이전 80% 야격 업타임 → 야생의 부름 1회당 야수의 격노 1회" },
      { title: "저점 인정", detail: "비쿨기 구간은 택밀 수준. 오프닝 30초, 부활 직후가 최약" },
    ],
    skillPriority: [
      { rank: 1, skill: "검은화살", reason: "모든 상황 1순위. 쿨기 없을 때도 살상 명령보다 딜 높음", critical: true },
      { rank: 2, skill: "살상 명령", reason: "검은화살 뽑기권 역할. 광기 끊어져도 살상 명령 우선!", critical: true },
      { rank: 3, skill: "날카로운 사격", reason: "살상 명령 뽑는 용도. 광기 유지보다 검화 찾기 우선" },
      { rank: 4, skill: "코브라 사격", reason: "모든 스킬 없을 때만. 날사/살명 충전용" },
    ],
    burstCycle: [
      { step: 1, action: "치흙으로 부패 사격 스택 1개라도 더 쌓기" },
      { step: 2, action: "날사 사용 후 유혈 사용" },
      { step: 3, action: "야생의 부름 ON → 검화 1개 확정 획득" },
      { step: 4, action: "검화 소모 후 야수의 격노 ON" },
      { step: 5, action: "검화 쉬지 않고 누르기! 없으면 살명 → 없으면 날사" },
    ],
    criticalRule: "광기(Frenzy) 3스택 끊어져도 검은화살/살상 명령 우선이 고점 플레이!",
    weakAuras: [
      { name: "야부 시간 체크", desc: "4초마다 죽음의 강타 주는 타이밍 1초 전 알림. 평균딜 vs 고점딜 차이 핵심", critical: true },
      { name: "날사 헬퍼 (Dark Ranger 버전)", desc: "검화/살명 소진 후 날사 타이밍 + 전쟁 명령 활용 알림" },
    ],
    trinketTiming: {
      realistic: "야부 전 부패 사격 5-8중첩 확인 후 분광경 사용",
      optimal: "18중첩 타이밍(3분 주기) 맞추기 (살라다르, 디메시우스 등)"
    }
  }
};

const COMMON_MISTAKES = [
  { name: "죽음의 강타 낭비", impact: "DPS 2-4% 손실", cause: "죽음의 강타 후 검은 화살 미사용", solution: "WeakAura로 트래킹", heroTalent: "darkRanger" },
  { name: "야생의 부름 중 코브라 사격", impact: "DPS 3-5% 손실", cause: "습관적 필러 사용", solution: "야생의 부름 중에는 살상 명령/날카로운 사격만", heroTalent: "darkRanger" },
  { name: "야수의 회전베기 끊김", impact: "AOE 20-50% 손실", cause: "일제 사격 갱신 놓침", solution: "2-3 GCD마다 갱신", heroTalent: "both" },
  { name: "잘못된 야수의 격노 타이밍", impact: "DPS 8-12% 손실", cause: "울음 >16초에서 야수의 격노", solution: "울음 ≤16초 대기", heroTalent: "packLeader" },
  { name: "쿨다운 정렬 실패", impact: "DPS 3-6% 손실", cause: "즉시 사용 습관", solution: "야생의 부름 30초 내면 야수의 격노 홀드", heroTalent: "both" },
];

// ═══════════════════════════════════════════════════════════════════════════
// ⚡ 프록 시스템 데이터
// ═══════════════════════════════════════════════════════════════════════════
const PROC_CHAINS = {
  common: [
    {
      id: 'bs-frenzy',
      trigger: SKILL_DB.barbedShot,
      result: SKILL_DB.frenzy,
      type: 'guaranteed',
      description: '날카로운 사격 → 광기 스택',
      detail: '날카로운 사격 사용 시 펫에게 광기 스택 부여. 최대 3스택, 스택당 공격속도 10% 증가',
    },
    {
      id: 'ms-cleave',
      trigger: SKILL_DB.multiShot,
      result: SKILL_DB.beastCleave,
      type: 'guaranteed',
      description: '일제 사격 → 야수의 회전베기 4초',
      detail: '일제 사격 사용 시 펫의 기본 공격이 주변 적에게 75% 피해',
    },
    {
      id: 'bs-wildcall',
      trigger: SKILL_DB.barbedShot,
      result: SKILL_DB.wildCall,
      type: 'chance',
      chancePercent: 20,
      description: '날카로운 사격 → 20% 야성의 부름',
      detail: '날카로운 사격 적중 시 20% 확률로 날카로운 사격 충전 1회 회복',
    },
  ],
  
  darkRanger: [
    {
      id: 'kc-deathblow',
      trigger: SKILL_DB.killCommand,
      result: SKILL_DB.deathblow,
      type: 'chance',
      chancePercent: 20,
      description: '살상 명령 → 20% 죽음의 강타',
      detail: '살상 명령 사용 시 20% 확률로 죽음의 강타 프록',
    },
    {
      id: 'bs-deathblow',
      trigger: SKILL_DB.barbedShot,
      result: SKILL_DB.deathblow,
      type: 'chance',
      chancePercent: 50,
      description: '날카로운 사격 → 50% 죽음의 강타',
      detail: '날카로운 사격 사용 시 50% 확률로 죽음의 강타 프록',
      critical: true,
    },
    {
      id: 'cotw-deathblow',
      trigger: SKILL_DB.callOfTheWild,
      result: SKILL_DB.deathblow,
      type: 'guaranteed',
      description: '야생의 부름 → 4초마다 100% 죽음의 강타!',
      detail: '야생의 부름 16초 동안 4초마다 죽음의 강타 확정 발동! (총 5회)',
      critical: true,
    },
    {
      id: 'deathblow-arrow',
      trigger: SKILL_DB.deathblow,
      result: SKILL_DB.blackArrow,
      type: 'guaranteed',
      description: '죽음의 강타 → 검은 화살 사용!',
      detail: '죽음의 강타 프록 시 검은 화살 즉시 사용 가능',
      critical: true,
    },
    {
      id: 'smoke-screen',
      trigger: SKILL_DB.bestialWrath,
      result: SKILL_DB.smokeScreen,
      type: 'guaranteed',
      description: '야수의 격노 → 연막 방어 버프',
      detail: '어둠 순찰자의 핵심 생존기. 야수의 격노 사용 시 연막 획득',
    },
  ],
  
  packLeader: [
    {
      id: 'bw-lff',
      trigger: SKILL_DB.bestialWrath,
      result: SKILL_DB.leadFromFront,
      type: 'guaranteed',
      description: '야수의 격노 → 솔선수범',
      detail: '야수의 격노 사용 시 솔선수범 버프 활성화',
      critical: true,
    },
    {
      id: 'lff-howl',
      trigger: SKILL_DB.leadFromFront,
      result: SKILL_DB.howl,
      type: 'guaranteed',
      description: '솔선수범 중 울음 ≤16초 → 야수 소환',
      detail: '솔선수범 버프 중 울음 쿨다운 16초 이하면 야수 자동 소환',
    },
    {
      id: 'howl-stampede',
      trigger: SKILL_DB.howl,
      result: SKILL_DB.stampede,
      type: 'guaranteed',
      description: '야수 소환 → 쇄도 7초!',
      detail: '울음으로 야수 소환 시 쇄도 발동, 7초간 8타겟 피해',
      critical: true,
    },
    {
      id: 'kc-stampede',
      trigger: SKILL_DB.killCommand,
      result: SKILL_DB.stampede,
      type: 'guaranteed',
      description: '살상 명령(솔선수범 중) → 쇄도 발동',
      detail: '솔선수범 버프 중 살상 명령 사용 시 쇄도 트리거',
      critical: true,
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// 🔧 유틸리티 컴포넌트
// ═══════════════════════════════════════════════════════════════════════════
const SkillIcon = ({ skill, size = 'small', showTooltip = true }) => {
  if (!skill) return null;
  const sizeMap = { small: 24, medium: 36, large: 56 };
  const px = sizeMap[size] || 24;
  
  const imgElement = (
    <img 
      src={`https://wow.zamimg.com/images/wow/icons/${size}/${skill.icon}.jpg`}
      alt={skill.name}
      className="rounded"
      style={{ width: px, height: px }}
      onError={(e) => { e.target.src = `https://wow.zamimg.com/images/wow/icons/${size}/inv_misc_questionmark.jpg`; }}
    />
  );
  
  if (showTooltip && skill.id) {
    return (
      <a 
        href={`https://ko.wowhead.com/spell=${skill.id}`}
        data-wowhead={`spell=${skill.id}&domain=ko`}
        target="_blank"
        rel="noopener noreferrer"
        title={`${skill.name} (${skill.nameEn})`}
      >
        {imgElement}
      </a>
    );
  }
  return imgElement;
};

const InlineSpell = ({ spell, showIcon = true }) => {
  if (!spell) return null;
  const emoji = TYPE_EMOJI[spell.type] || '';
  const typeColors = {
    buff: THEME.buff,
    debuff: THEME.accent,
    proc: THEME.warning,
    passive: THEME.info,
    skill: THEME.text.primary,
  };
  const color = typeColors[spell.type] || THEME.text.primary;
  
  return (
    <span 
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded hover-scale"
      style={{ backgroundColor: color + '20' }}
    >
      {showIcon && (
        <img 
          src={`https://wow.zamimg.com/images/wow/icons/small/${spell.icon}.jpg`}
          alt={spell.name}
          className="rounded"
          style={{ width: 16, height: 16 }}
          onError={(e) => { e.target.src = 'https://wow.zamimg.com/images/wow/icons/small/inv_misc_questionmark.jpg'; }}
        />
      )}
      <span style={{ color, fontSize: '0.875rem', fontWeight: 500 }}>{spell.name}</span>
      {emoji && <span style={{ fontSize: '0.75rem' }}>{emoji}</span>}
    </span>
  );
};

const InfoBox = ({ title, children, color = THEME.info, icon = "ℹ️" }) => (
  <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: color + '15', border: `1px solid ${color}40` }}>
    <h4 className="font-bold mb-2" style={{ color }}>{icon} {title}</h4>
    <div className="text-sm" style={{ color: THEME.text.secondary }}>{children}</div>
  </div>
);

const WarningBox = ({ title, children, color = THEME.accent }) => (
  <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: color + '15', border: `1px solid ${color}40` }}>
    <h4 className="font-bold mb-2" style={{ color }}>⚠️ {title}</h4>
    <div className="text-sm" style={{ color: THEME.text.secondary }}>{children}</div>
  </div>
);

const ProTipsBox = ({ data, color }) => (
  <div className="rounded-xl p-5 mb-6" style={{ backgroundColor: color + '10', border: `2px solid ${color}` }}>
    <div className="flex items-center gap-3 mb-4">
      <span className="text-3xl">{data.mindset.icon}</span>
      <div>
        <h4 className="font-bold text-lg" style={{ color }}>{data.mindset.title}</h4>
        <p className="text-sm" style={{ color: THEME.text.secondary }}>{data.mindset.description}</p>
      </div>
    </div>
    
    <div className="grid md:grid-cols-3 gap-3 mb-4">
      {data.coreChanges.map((change, i) => (
        <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: THEME.bg.card }}>
          <h5 className="font-bold text-sm mb-1" style={{ color }}>{change.title}</h5>
          <p className="text-xs" style={{ color: THEME.text.muted }}>{change.detail}</p>
        </div>
      ))}
    </div>
    
    <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: THEME.danger + '20', border: `1px solid ${THEME.danger}` }}>
      <p className="text-sm font-bold" style={{ color: THEME.danger }}>🚨 핵심: {data.criticalRule}</p>
    </div>
    
    <div className="grid md:grid-cols-2 gap-4">
      <div className="p-3 rounded-lg" style={{ backgroundColor: THEME.bg.secondary }}>
        <h5 className="font-bold text-sm mb-2" style={{ color: THEME.warning }}>📊 필수 WeakAura</h5>
        {data.weakAuras.map((wa, i) => (
          <div key={i} className="mb-2">
            <span className="text-sm font-medium" style={{ color: wa.critical ? THEME.warning : THEME.text.primary }}>
              {wa.critical && '⭐ '}{wa.name}
            </span>
            <p className="text-xs" style={{ color: THEME.text.muted }}>{wa.desc}</p>
          </div>
        ))}
      </div>
      <div className="p-3 rounded-lg" style={{ backgroundColor: THEME.bg.secondary }}>
        <h5 className="font-bold text-sm mb-2" style={{ color: THEME.success }}>💎 장신구 타이밍</h5>
        <p className="text-xs mb-1" style={{ color: THEME.text.secondary }}><strong>현실적:</strong> {data.trinketTiming.realistic}</p>
        <p className="text-xs" style={{ color: THEME.text.muted }}><strong>최적:</strong> {data.trinketTiming.optimal}</p>
      </div>
    </div>
  </div>
);

const MathBox = ({ title, formula, result, children, color = THEME.info }) => (
  <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: color + '10', border: `1px solid ${color}40` }}>
    <h4 className="font-bold mb-2" style={{ color }}>🧮 {title}</h4>
    <div className="font-mono text-lg mb-2 p-3 rounded" style={{ backgroundColor: THEME.bg.secondary, color: THEME.text.primary }}>
      {formula} = <strong style={{ color }}>{result}</strong>
    </div>
    <div className="text-sm flex flex-wrap items-center gap-1" style={{ color: THEME.text.secondary }}>{children}</div>
  </div>
);

const ChecklistBox = ({ title, items, color = THEME.success }) => (
  <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: color + '10', border: `1px solid ${color}40` }}>
    <h4 className="font-bold mb-3" style={{ color }}>✅ {title}</h4>
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0" 
            style={{ backgroundColor: color + '30', color }}>{i + 1}</span>
          <span className="text-sm" style={{ color: THEME.text.secondary }}>{item}</span>
        </div>
      ))}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// 📊 시각자료 컴포넌트 - MCP Magic 패턴
// ═══════════════════════════════════════════════════════════════════════════
const AnimationStyles = () => (
  <style>{`
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 8px rgba(255, 107, 107, 0.4); }
      50% { box-shadow: 0 0 20px rgba(255, 107, 107, 0.8); }
    }
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slide-in-right {
      from { opacity: 0; transform: translateX(-10px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
    .animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; }
    .animate-slide-in-right { animation: slide-in-right 0.3s ease-out forwards; }
    .hover-scale { transition: all 0.2s ease; }
    .hover-scale:hover { transform: scale(1.05); box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
    .hover-lift { transition: all 0.2s ease; }
    .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.25); }
  `}</style>
);

const OpenerFlowchart = ({ data, color, title }) => {
  const phaseColors = {
    prepull: THEME.text.muted,
    pull: THEME.warning,
    setup: color,
    burst: THEME.accent,
    continue: THEME.text.secondary,
  };
  
  return (
    <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: THEME.bg.card, border: `1px solid ${color}40` }}>
      <AnimationStyles />
      <h4 className="font-bold mb-3" style={{ color }}>📊 {title}</h4>
      
      <div className="flex items-center justify-between gap-1">
        {data.map((item, idx) => {
          const phaseColor = phaseColors[item.phase] || THEME.text.muted;
          const isBurst = item.phase === 'burst';
          const isLast = idx === data.length - 1;
          
          return (
            <React.Fragment key={idx}>
              <motion.div
                className={`flex flex-col items-center shrink-0 ${isBurst ? 'animate-pulse-glow' : ''}`}
                style={{ minWidth: 28 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: idx * 0.03 }}
                title={item.skill ? `${item.skill.name} - ${item.note}` : item.note}
              >
                {item.skill ? (
                  <div className="relative">
                    {item.highlight && (
                      <div className="absolute -inset-1 rounded-full opacity-50" 
                        style={{ backgroundColor: phaseColor, filter: 'blur(4px)' }} />
                    )}
                    <div className="relative rounded-full p-0.5" 
                      style={{ backgroundColor: item.highlight ? phaseColor + '40' : 'transparent' }}>
                      <SkillIcon skill={item.skill} size="small" />
                    </div>
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                    style={{ backgroundColor: THEME.bg.secondary, color: THEME.text.muted }}>→</div>
                )}
              </motion.div>
              
              {!isLast && (
                <div className="flex-1 h-0.5 min-w-1 max-w-4 rounded-full" 
                  style={{ backgroundColor: phaseColor + '40' }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      <div className="flex flex-wrap gap-3 mt-3 justify-center">
        {Object.entries({ 프리풀: 'prepull', 풀: 'pull', 셋업: 'setup', '💥극딜': 'burst', 유지: 'continue' }).map(([label, phase]) => (
          <div key={phase} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: phaseColors[phase] }} />
            <span className="text-xs" style={{ color: phaseColors[phase] }}>{label}</span>
          </div>
        ))}
      </div>
      
      <p className="text-xs mt-2 text-center" style={{ color: THEME.text.muted }}>아이콘 호버 → 스킬명 확인</p>
    </div>
  );
};

const PriorityFlowchart = ({ color, heroSpec }) => {
  const isDarkRanger = heroSpec === 'darkRanger';
  
  const FlowNode = ({ children, type, glow }) => {
    const styles = {
      start: { bg: THEME.bg.secondary, border: THEME.text.muted, text: THEME.text.primary },
      question: { bg: THEME.accent + '20', border: THEME.accent, text: THEME.accent },
      hero: { bg: color + '20', border: color, text: color },
      action: { bg: THEME.bg.highlight, border: THEME.bg.highlight, text: THEME.text.secondary },
    };
    const s = styles[type] || styles.action;
    return (
      <motion.div className={`relative px-4 py-2 rounded-lg text-sm text-center ${glow ? 'animate-pulse-glow' : ''}`}
        style={{ backgroundColor: s.bg, border: `2px solid ${s.border}`, color: s.text }}
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}
      >
        <span className="font-medium">{children}</span>
      </motion.div>
    );
  };
  
  const SkillNode = ({ skill, label, highlight }) => (
    <motion.div className="flex items-center gap-2 px-3 py-2 rounded-lg hover-scale"
      style={{ backgroundColor: highlight ? THEME.accent + '30' : THEME.bg.highlight }}
      initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
    >
      <SkillIcon skill={skill} size="small" />
      <span className="text-sm font-medium" style={{ color: highlight ? THEME.accent : THEME.text.secondary }}>{label}</span>
    </motion.div>
  );
  
  const Connector = ({ vertical, color: lineColor }) => (
    <div className={vertical ? "w-0.5 h-4" : "h-0.5 w-6"} style={{ backgroundColor: lineColor || THEME.bg.highlight }} />
  );
  
  const BranchLabel = ({ yes }) => (
    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
      style={{ backgroundColor: yes ? THEME.success + '30' : THEME.text.muted + '30', color: yes ? THEME.success : THEME.text.muted }}
    >{yes ? 'Yes' : 'No'}</span>
  );
  
  return (
    <div className="rounded-xl p-5 mb-6" style={{ backgroundColor: THEME.bg.card, border: `1px solid ${color}40` }}>
      <AnimationStyles />
      <h4 className="font-bold mb-5" style={{ color }}>📊 핵심 분기 플로우차트</h4>
      
      <div className="flex flex-col items-center gap-3">
        <FlowNode type="start">🎮 시작</FlowNode>
        <Connector vertical color={THEME.text.muted} />
        <FlowNode type="question" glow>
          {isDarkRanger ? '죽음의 강타 발동?' : '솔선수범 활성 + 울음 ≤16초?'}
        </FlowNode>
        
        <div className="flex items-start gap-12 mt-2">
          <div className="flex flex-col items-center gap-2">
            <BranchLabel yes />
            <Connector vertical color={THEME.success} />
            <SkillNode 
              skill={isDarkRanger ? SKILL_DB.blackArrow : SKILL_DB.bestialWrath} 
              label={isDarkRanger ? "검은 화살 즉시!" : "야수의 격노 → 쇄도!"} 
              highlight 
            />
            <span className="text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: THEME.accent + '20', color: THEME.accent }}>
              {isDarkRanger ? "↓ 최우선!" : "↓ 이중 쇄도!"}
            </span>
            {isDarkRanger ? (
              <SkillNode skill={SKILL_DB.killCommand} label="살상 명령/날카로운 사격 계속" />
            ) : (
              <SkillNode skill={SKILL_DB.killCommand} label="살상 명령 2회 트리거" highlight />
            )}
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <BranchLabel />
            <Connector vertical color={THEME.text.muted} />
            <FlowNode type="hero">
              {isDarkRanger ? '야생의 부름 30초 이내?' : '광기 3스택?'}
            </FlowNode>
            
            <div className="flex items-start gap-6 mt-2">
              <div className="flex flex-col items-center gap-2">
                <BranchLabel yes />
                {isDarkRanger ? (
                  <SkillNode skill={SKILL_DB.bestialWrath} label="야수의 격노 홀드" />
                ) : (
                  <SkillNode skill={SKILL_DB.barbedShot} label="유지" />
                )}
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <BranchLabel />
                {isDarkRanger ? (
                  <SkillNode skill={SKILL_DB.bestialWrath} label="야수의 격노 사용" />
                ) : (
                  <SkillNode skill={SKILL_DB.barbedShot} label="스택 쌓기" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-xs mt-5 text-center" style={{ color: THEME.text.muted }}>호버하면 확대 | 상세 우선순위는 아래 테이블 참조</p>
    </div>
  );
};

const BurstSequenceDiagram = ({ color, heroSpec }) => {
  const isDarkRanger = heroSpec === 'darkRanger';
  
  const darkRangerSteps = [
    { actor: '야수의 격노', action: '시전', target: '버프 획득', note: '펫 25%↑', burst: false, skill: SKILL_DB.bestialWrath },
    { actor: '유혈', action: '시전', target: '대상', note: '출혈', burst: false, skill: SKILL_DB.bloodshed },
    { actor: '야생의 부름', action: '시전!', target: '극딜 시작', note: '16초', burst: true, skill: SKILL_DB.callOfTheWild },
    { actor: '검은 화살', action: '16초', target: '죽음의 강타', note: '보장', burst: true, skill: SKILL_DB.blackArrow },
    { actor: '검은 화살', action: '12초', target: '죽음의 강타', note: '보장', burst: true, skill: SKILL_DB.blackArrow },
    { actor: '검은 화살', action: '8초', target: '죽음의 강타', note: '보장', burst: true, skill: SKILL_DB.blackArrow },
    { actor: '검은 화살', action: '4초', target: '죽음의 강타', note: '보장', burst: true, skill: SKILL_DB.blackArrow },
    { actor: '검은 화살', action: '0초', target: '죽음의 강타', note: '마지막!', burst: true, skill: SKILL_DB.blackArrow },
  ];
  
  const packLeaderSteps = [
    { actor: '대기', action: '-', target: '-', note: '울음 ≤16초', burst: false, skill: null },
    { actor: '야수의 격노', action: '시전!', target: '솔선수범 시작', note: '울음 발동', burst: true, skill: SKILL_DB.bestialWrath },
    { actor: '살상 명령', action: '1번째', target: '쇄도!', note: '첫 번째', burst: true, skill: SKILL_DB.killCommand },
    { actor: '유혈', action: '시전', target: '대상', note: '출혈', burst: true, skill: SKILL_DB.bloodshed },
    { actor: '야생의 부름', action: '시전', target: '극딜', note: '16초', burst: true, skill: SKILL_DB.callOfTheWild },
    { actor: '코브라 사격', action: '스팸', target: '울음 감소', note: '쿨다운↓', burst: true, skill: SKILL_DB.cobraShot },
    { actor: '살상 명령', action: '2번째', target: '쇄도!', note: '이중!', burst: true, skill: SKILL_DB.killCommand },
  ];
  
  const steps = isDarkRanger ? darkRangerSteps : packLeaderSteps;
  const burstStartIdx = steps.findIndex(s => s.burst);
  
  return (
    <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: THEME.bg.card, border: `1px solid ${THEME.accent}40` }}>
      <AnimationStyles />
      <h4 className="font-bold mb-4" style={{ color: THEME.accent }}>📊 극딜 시퀀스 ({isDarkRanger ? '어둠 순찰자' : '무리의 인도자'})</h4>
      
      <div className="relative w-full h-2 mb-4 rounded-full overflow-hidden" style={{ backgroundColor: THEME.bg.secondary }}>
        <div className="absolute h-2 rounded-l-full" style={{ width: `${(burstStartIdx / steps.length) * 100}%`, background: `linear-gradient(90deg, ${color}60, ${color})`, left: 0 }} />
        <div className="absolute h-2 rounded-r-full animate-pulse-glow" style={{ width: `${((steps.length - burstStartIdx) / steps.length) * 100}%`, background: `linear-gradient(90deg, ${THEME.accent}, ${THEME.accent}CC)`, left: `${(burstStartIdx / steps.length) * 100}%` }} />
        <div className="absolute top-0 h-2 w-0.5 bg-white opacity-80" style={{ left: `${(burstStartIdx / steps.length) * 100}%` }} />
      </div>
      
      <div className="space-y-2">
        {steps.map((step, idx) => (
          <div key={idx} className={`flex items-center gap-3 p-2 rounded-lg hover-lift animate-slide-in-right`}
            style={{ backgroundColor: step.burst ? THEME.accent + '15' : 'transparent', border: step.burst ? `1px solid ${THEME.accent}40` : '1px solid transparent', animationDelay: `${idx * 0.05}s` }}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 hover-scale ${step.burst ? 'animate-pulse-glow' : ''}`}
              style={{ backgroundColor: step.burst ? THEME.accent : color + '30', color: step.burst ? '#fff' : color }}>{idx + 1}</span>
            {step.skill && <div className="shrink-0 hover-scale"><SkillIcon skill={step.skill} size="small" /></div>}
            <span className="w-28 text-sm truncate font-medium" style={{ color: step.burst ? THEME.accent : THEME.text.primary }}>{step.actor}</span>
            <div className="flex items-center gap-1">
              <div className="w-8 h-0.5 rounded-full" style={{ background: step.burst ? `linear-gradient(90deg, ${THEME.accent}40, ${THEME.accent})` : `linear-gradient(90deg, ${color}40, ${color}80)` }} />
              <span className="text-xs font-bold px-1" style={{ color: step.burst ? THEME.accent : color }}>{step.action}</span>
              <span style={{ color: step.burst ? THEME.accent : color }}>▸</span>
            </div>
            <span className="w-24 text-sm" style={{ color: THEME.text.secondary }}>{step.target}</span>
            <span className="text-xs px-2 py-1 rounded hover-scale" style={{ backgroundColor: step.burst ? THEME.accent + '30' : THEME.bg.secondary, color: step.burst ? THEME.accent : THEME.text.muted, fontWeight: step.burst ? 'bold' : 'normal' }}>{step.note}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: THEME.accent + '15', border: `1px solid ${THEME.accent}40` }}>
        <p className="text-sm" style={{ color: THEME.accent }}>
          <strong>💥 핵심:</strong> {isDarkRanger ? '야생의 부름 16초 동안 검은 화살 5회+ 보장 발동!' : '야수의 격노 시전 시 울음 ≤16초 확인 → 이중 쇄도!'}
        </p>
      </div>
      <p className="text-xs mt-3 text-center" style={{ color: THEME.text.muted }}>호버하면 확대됩니다 | 빨간 구간이 극딜 타이밍</p>
    </div>
  );
};

const ProcSystemDiagram = ({ heroSpec }) => {
  const isDarkRanger = heroSpec === 'darkRanger';
  const color = isDarkRanger ? THEME.darkRanger : THEME.packLeader;
  const heroProcs = isDarkRanger ? PROC_CHAINS.darkRanger : PROC_CHAINS.packLeader;
  const allProcs = [...PROC_CHAINS.common, ...heroProcs];
  
  const typeColors = {
    guaranteed: { start: '#22c55e', middle: '#4ade80', end: '#86efac' },
    'buff-consume': { start: '#eab308', middle: '#facc15', end: '#fde047' },
    fury: { start: '#3b82f6', middle: '#60a5fa', end: '#93c5fd' },
    chance: { start: '#ef4444', middle: '#f87171', end: '#fca5a5' },
  };
  const typeLabels = { guaranteed: '확정', 'buff-consume': '버프 소모', fury: '분노 기반', chance: '확률' };
  
  const AnimatedBeam = ({ type, critical, delay = 0, chancePercent }) => {
    const colors = typeColors[type] || typeColors.guaranteed;
    const gradientId = `beam-gradient-${type}-${delay}`;
    
    return (
      <div className="relative flex items-center justify-center" style={{ width: 120, height: 24 }}>
        <svg width="120" height="24" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 12 L100 12" stroke={THEME.bg.highlight} strokeWidth="2" strokeLinecap="round" />
          <motion.path
            d="M0 12 L100 12"
            stroke={`url(#${gradientId})`}
            strokeWidth={critical ? "4" : "3"}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: delay * 0.1, ease: "easeOut" }}
          />
          <motion.polygon
            points="100,12 110,6 110,18"
            fill={colors.middle}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: delay * 0.1 + 0.5 }}
          />
          <defs>
            <motion.linearGradient
              id={gradientId}
              gradientUnits="userSpaceOnUse"
              initial={{ x1: "0%", x2: "0%" }}
              animate={{ x1: ["-100%", "100%", "100%"], x2: ["-80%", "120%", "120%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, ease: "linear", delay: delay * 0.2 }}
            >
              <stop offset="0%" stopColor={colors.start} stopOpacity="0" />
              <stop offset="30%" stopColor={colors.start} stopOpacity="1" />
              <stop offset="50%" stopColor={colors.middle} stopOpacity="1" />
              <stop offset="70%" stopColor={colors.end} stopOpacity="1" />
              <stop offset="100%" stopColor={colors.end} stopOpacity="0" />
            </motion.linearGradient>
          </defs>
        </svg>
        {chancePercent && (
          <motion.span
            className="absolute text-xs font-bold px-1.5 py-0.5 rounded"
            style={{ backgroundColor: colors.start + '40', color: colors.middle, top: -8, right: 15 }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay * 0.1 + 0.3 }}
          >
            {chancePercent}%
          </motion.span>
        )}
      </div>
    );
  };
  
  const SkillNode = ({ skill, isResult, critical, color: nodeColor, delay = 0 }) => {
    if (!skill) return <span className="text-sm" style={{ color: THEME.text.muted }}>-</span>;
    const borderColor = critical ? nodeColor : THEME.bg.highlight;
    
    return (
      <motion.div
        className="flex items-center gap-2"
        style={{ minWidth: isResult ? 150 : 130 }}
        initial={{ opacity: 0, x: isResult ? 10 : -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: delay * 0.1 }}
      >
        {!isResult && (
          <>
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: borderColor }}
                animate={critical ? { scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="relative p-1 rounded-full" style={{ backgroundColor: THEME.bg.card, border: `2px solid ${borderColor}` }}>
                <SkillIcon skill={skill} size="small" />
              </div>
            </div>
            <span className="text-sm font-medium truncate" style={{ color: THEME.text.primary }}>{skill.name}</span>
          </>
        )}
        {isResult && (
          <>
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: nodeColor }}
                animate={critical ? { scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <div className="relative p-1 rounded-full" style={{ backgroundColor: THEME.bg.card, border: `2px solid ${nodeColor}` }}>
                <SkillIcon skill={skill} size="small" />
              </div>
            </div>
            <span className="text-sm font-medium truncate" style={{ color: critical ? nodeColor : THEME.text.secondary }}>
              {skill.name}
              {TYPE_EMOJI[skill.type] && <span className="ml-1">{TYPE_EMOJI[skill.type]}</span>}
            </span>
          </>
        )}
      </motion.div>
    );
  };
  
  return (
    <div className="rounded-xl p-4 mb-6 overflow-hidden" style={{ backgroundColor: THEME.bg.card, border: `1px solid ${color}40` }}>
      <h4 className="font-bold mb-4" style={{ color }}>⚡ 프록 시스템 다이어그램 ({isDarkRanger ? '어둠 순찰자' : '무리의 인도자'})</h4>
      
      <div className="flex flex-wrap gap-4 mb-4 p-3 rounded-lg" style={{ backgroundColor: THEME.bg.secondary }}>
        {Object.entries(typeLabels).map(([type, label]) => (
          <div key={type} className="flex items-center gap-2">
            <svg width="40" height="8" viewBox="0 0 40 8">
              <rect x="0" y="2" width="30" height="4" rx="2" fill={`url(#legend-${type})`} />
              <polygon points="30,4 38,0 38,8" fill={typeColors[type].middle} />
              <defs>
                <linearGradient id={`legend-${type}`}>
                  <stop offset="0%" stopColor={typeColors[type].start} />
                  <stop offset="100%" stopColor={typeColors[type].end} />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-xs" style={{ color: typeColors[type].middle }}>{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 ml-auto">
          <motion.div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: THEME.accent }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-xs" style={{ color: THEME.accent }}>⭐ 핵심</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {allProcs.map((proc, idx) => (
          <motion.div
            key={proc.id}
            className="flex items-center gap-2 p-3 rounded-lg"
            style={{
              backgroundColor: proc.critical ? color + '10' : THEME.bg.secondary,
              border: proc.critical ? `2px solid ${color}` : `1px solid ${THEME.bg.highlight}`,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
          >
            <SkillNode skill={proc.trigger} critical={proc.critical} color={color} delay={idx} />
            <AnimatedBeam type={proc.type} critical={proc.critical} delay={idx} chancePercent={proc.chancePercent} />
            <SkillNode skill={proc.result} isResult critical={proc.critical} color={typeColors[proc.type]?.middle || color} delay={idx} />
            <div className="flex-1 text-right">
              <span className="text-xs" style={{ color: THEME.text.muted }}>{proc.description}</span>
              {proc.critical && (
                <motion.span
                  className="ml-2 text-xs px-1.5 py-0.5 rounded inline-block"
                  style={{ backgroundColor: color + '30', color }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ⭐
                </motion.span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div
        className="mt-4 p-3 rounded-lg"
        style={{ backgroundColor: color + '15', border: `1px solid ${color}40` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-sm font-bold mb-2" style={{ color }}>🔗 {isDarkRanger ? '어둠 순찰자' : '무리의 인도자'} 핵심 연쇄:</p>
        <p className="text-sm flex flex-wrap items-center gap-1" style={{ color: THEME.text.secondary }}>
          {isDarkRanger ? (
            <><InlineSpell spell={SKILL_DB.callOfTheWild} /> → 4초마다 <InlineSpell spell={SKILL_DB.deathblow} /> → <InlineSpell spell={SKILL_DB.blackArrow} /> 5회+ 보장!</>
          ) : (
            <><InlineSpell spell={SKILL_DB.bestialWrath} /> (울음 ≤16초) → <InlineSpell spell={SKILL_DB.howl} /> → <InlineSpell spell={SKILL_DB.killCommand} /> → <InlineSpell spell={SKILL_DB.stampede} /> 2회!</>
          )}
        </p>
      </motion.div>
      
      <p className="text-xs mt-3 text-center" style={{ color: THEME.text.muted }}>호버하면 Wowhead 툴팁 | ⭐ = DPS 영향 큼 | 빔 애니메이션 = 프록 타입</p>
    </div>
  );
};

const ProcDetailCard = ({ proc, color }) => {
  const typeColors = { guaranteed: THEME.success, 'buff-consume': THEME.warning, fury: THEME.info, chance: THEME.accent };
  return (
    <div className="p-4 rounded-xl hover-lift" style={{ backgroundColor: THEME.bg.card, border: proc.critical ? `2px solid ${color}` : `1px solid ${THEME.bg.highlight}` }}>
      <div className="flex items-start gap-3 mb-2">
        <SkillIcon skill={proc.trigger} size="medium" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-bold" style={{ color: THEME.text.primary }}>{proc.trigger.name}</span>
            <span className="text-lg" style={{ color: typeColors[proc.type] }}>→</span>
            <span className="font-bold" style={{ color }}>{proc.result.name}</span>
            {proc.critical && <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: color + '30', color }}>⭐</span>}
          </div>
          <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: typeColors[proc.type] + '20', color: typeColors[proc.type] }}>
            {proc.type === 'chance' ? `${proc.chancePercent}%` : proc.type === 'guaranteed' ? '확정' : proc.type === 'buff-consume' ? '버프 소모' : '분노'}
          </span>
        </div>
      </div>
      <p className="text-sm" style={{ color: THEME.text.secondary }}>{proc.detail}</p>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 🔧 테이블 컴포넌트
// ═══════════════════════════════════════════════════════════════════════════
const PriorityTable = ({ data, title, color }) => (
  <div className="rounded-xl overflow-hidden mb-6" style={{ backgroundColor: THEME.bg.card, border: `1px solid ${color}40` }}>
    <div className="px-4 py-3" style={{ backgroundColor: color + '20' }}>
      <h4 className="font-bold" style={{ color }}>{title}</h4>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr style={{ backgroundColor: THEME.bg.secondary }}>
            <th className="px-3 py-2 text-left text-sm w-12" style={{ color }}>#</th>
            <th className="px-3 py-2 text-left text-sm" style={{ color: THEME.text.primary }}>스킬</th>
            <th className="px-3 py-2 text-left text-sm" style={{ color: THEME.text.primary }}>조건</th>
            <th className="px-3 py-2 text-left text-sm" style={{ color: THEME.text.primary }}>이유</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i} className="border-t" style={{ borderColor: color + '20', backgroundColor: item.critical ? color + '10' : 'transparent' }}>
              <td className="px-3 py-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold"
                  style={{ backgroundColor: i < 3 ? color : THEME.bg.secondary, color: THEME.text.primary }}>{item.rank}</span>
              </td>
              <td className="px-3 py-2">
                <div className="flex items-center gap-2">
                  <SkillIcon skill={item.skill} />
                  <span className="text-sm" style={{ color: item.critical ? color : THEME.text.primary }}>{item.skill?.name || '-'}</span>
                </div>
              </td>
              <td className="px-3 py-2 text-sm" style={{ color: THEME.text.secondary }}>{item.condition}</td>
              <td className="px-3 py-2 text-sm" style={{ color: THEME.text.muted }}>{item.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// 📦 챕터 정의
// ═══════════════════════════════════════════════════════════════════════════
const getChapters = (heroSpec) => [
  { id: 'ch1', num: 1, label: '메타 분석', icon: '📊' },
  { id: 'ch2', num: 2, label: '티어 세트', icon: '🛡️' },
  { id: 'ch3', num: 3, label: heroSpec === 'darkRanger' ? '어둠 순찰자' : '무리의 인도자', icon: heroSpec === 'darkRanger' ? '🌑' : '🐺' },
  { id: 'ch4', num: 4, label: heroSpec === 'darkRanger' ? '무리의 인도자 요약' : '어둠 순찰자 요약', icon: heroSpec === 'darkRanger' ? '🐺' : '🌑' },
  { id: 'ch5', num: 5, label: '공통 메커니즘', icon: '⚙️' },
  { id: 'ch6', num: 6, label: '콘텐츠별', icon: '🎮' },
  { id: 'ch7', num: 7, label: '고급 최적화', icon: '🚀' },
  { id: 'ch8', num: 8, label: '흔한 실수', icon: '⚠️' },
  { id: 'ch9', num: 9, label: '요약', icon: '📝' },
  { id: 'ch10', num: 10, label: '프로 팁', icon: '🎯' },
];

// ═══════════════════════════════════════════════════════════════════════════
// 📦 메인 가이드 컴포넌트
// ═══════════════════════════════════════════════════════════════════════════
export default function BeastMasteryHunterGuide() {
  const [heroSpec, setHeroSpec] = useState('darkRanger');
  const [activeChapter, setActiveChapter] = useState('ch1');
  
  // 📚 KB 연동 - Obsidian vault 데이터 사용
  const { data: kbData, loading: kbLoading, tips, macros, weakauras } = useKB('beastMasteryHunter');
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveChapter(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );
    getChapters(heroSpec).forEach(ch => {
      const el = document.getElementById(ch.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [heroSpec]);
  
  const scrollToChapter = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const currentColor = heroSpec === 'darkRanger' ? THEME.darkRanger : THEME.packLeader;
  
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: THEME.bg.primary }}>
      
      {/* 왼쪽 사이드바 */}
      <aside className="hidden lg:block fixed top-20 left-0 w-64 z-50" style={{ height: 'calc(100vh - 80px)' }}>
        <nav className="h-full overflow-y-auto p-4" style={{ backgroundColor: THEME.bg.secondary }}>
          
          <div className="mb-6">
            <p className="text-xs mb-2" style={{ color: THEME.text.muted }}>영웅 특성</p>
            <div className="flex flex-col gap-1">
              <button onClick={() => setHeroSpec('darkRanger')} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
                style={{ backgroundColor: heroSpec === 'darkRanger' ? THEME.darkRanger + '30' : 'transparent', color: heroSpec === 'darkRanger' ? THEME.darkRanger : THEME.text.secondary, border: heroSpec === 'darkRanger' ? `1px solid ${THEME.darkRanger}` : '1px solid transparent' }}>
                🌑 어둠 순찰자
              </button>
              <button onClick={() => setHeroSpec('packLeader')} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
                style={{ backgroundColor: heroSpec === 'packLeader' ? THEME.packLeader + '30' : 'transparent', color: heroSpec === 'packLeader' ? THEME.packLeader : THEME.text.secondary, border: heroSpec === 'packLeader' ? `1px solid ${THEME.packLeader}` : '1px solid transparent' }}>
                🐺 무리의 인도자
              </button>
            </div>
          </div>
          
          <div>
            <p className="text-xs mb-2" style={{ color: THEME.text.muted }}>목차</p>
            <div className="flex flex-col gap-1">
              {getChapters(heroSpec).map(ch => (
                <button key={ch.id} onClick={() => scrollToChapter(ch.id)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-left"
                  style={{ backgroundColor: activeChapter === ch.id ? THEME.primary + '30' : 'transparent', color: activeChapter === ch.id ? THEME.primary : THEME.text.secondary, borderLeft: activeChapter === ch.id ? `3px solid ${THEME.primary}` : '3px solid transparent' }}>
                  <span>{ch.icon}</span>
                  <span>{ch.num}. {ch.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-8 pt-4" style={{ borderTop: `1px solid ${THEME.primary}30` }}>
            <p className="text-xs" style={{ color: THEME.text.muted }}>패치 11.1 | v2.0</p>
            <p className="text-xs" style={{ color: THEME.text.muted }}>검증: 2025-12-02</p>
          </div>
        </nav>
      </aside>
      
      {/* 메인 콘텐츠 */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-8 lg:ml-64">
        
        {/* 헤더 */}
        <header className="mb-8 pb-4" style={{ borderBottom: `1px solid ${THEME.primary}30` }}>
          <div className="flex items-center gap-3 mb-4">
            <img 
              src="https://wow.zamimg.com/images/wow/icons/large/classicon_hunter.jpg" 
              alt="Hunter" 
              className="w-14 h-14 rounded-lg"
            />
            <div>
              <h1 className="text-2xl font-bold" style={{ color: THEME.primary }}>야수 사냥꾼</h1>
              <p className="text-sm" style={{ color: THEME.text.muted }}>TWW 시즌 3 • v2.0</p>
            </div>
          </div>
          <div className="flex gap-2 lg:hidden">
            <button onClick={() => setHeroSpec('darkRanger')} className="flex-1 py-2 rounded-lg text-sm"
              style={{ backgroundColor: heroSpec === 'darkRanger' ? THEME.darkRanger : THEME.bg.card, color: heroSpec === 'darkRanger' ? '#fff' : THEME.text.secondary }}>
              🌑 어둠 순찰자
            </button>
            <button onClick={() => setHeroSpec('packLeader')} className="flex-1 py-2 rounded-lg text-sm"
              style={{ backgroundColor: heroSpec === 'packLeader' ? THEME.packLeader : THEME.bg.card, color: heroSpec === 'packLeader' ? '#fff' : THEME.text.secondary }}>
              🐺 무리의 인도자
            </button>
          </div>
        </header>

        {/* 제1장: 메타 분석 */}
        <section id="ch1" className="mb-16 scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: THEME.primary + '30', color: THEME.primary }}>제1장</span>
            <h2 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>시즌 3 메타 분석</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="p-5 rounded-xl" style={{ backgroundColor: THEME.bg.card, border: `1px solid ${THEME.success}40` }}>
              <h3 className="font-bold mb-3" style={{ color: THEME.success }}>📊 현재 위상</h3>
              <p className="text-sm mb-3" style={{ color: THEME.text.secondary }}>
                쐐기돌 <strong style={{ color: THEME.success }}>A티어</strong>, 레이드 <strong style={{ color: THEME.warning }}>A티어</strong>.
              </p>
              <p className="text-sm" style={{ color: THEME.text.secondary }}>
                어둠 순찰자 사용률 <strong style={{ color: THEME.darkRanger }}>85%+</strong> (Icy Veins)
              </p>
            </div>
            
            <div className="p-5 rounded-xl" style={{ backgroundColor: THEME.bg.card, border: `1px solid ${THEME.info}40` }}>
              <h3 className="font-bold mb-3" style={{ color: THEME.info }}>🏆 핵심 강점</h3>
              <p className="text-sm" style={{ color: THEME.text.secondary }}>
                100% 이동 중 공격, 간단한 로테이션, 강력한 1분 극딜, 연막 방어
              </p>
            </div>
          </div>
          
          <div className="p-5 rounded-xl" style={{ backgroundColor: THEME.danger + '10', border: `1px solid ${THEME.danger}40` }}>
            <h3 className="font-bold mb-3" style={{ color: THEME.danger }}>⚠️ 핵심 약점</h3>
            <p className="text-sm" style={{ color: THEME.text.secondary }}>
              펫 의존성 (도달 시간), 극딜 타이밍 의존, 제한된 유틸리티
            </p>
          </div>
        </section>

        {/* 제2장: 티어 세트 */}
        <section id="ch2" className="mb-16 scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: THEME.primary + '30', color: THEME.primary }}>제2장</span>
            <h2 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>티어 세트</h2>
          </div>
          
          <InfoBox title="영웅 특성별 분화" color={THEME.primary}>
            시즌 3 티어 세트는 영웅 특성에 따라 완전히 다른 효과!
          </InfoBox>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl" style={{ backgroundColor: THEME.bg.card, border: `1px solid ${THEME.darkRanger}40` }}>
              <h3 className="font-bold mb-3" style={{ color: THEME.darkRanger }}>🌑 어둠 순찰자</h3>
              <p className="text-sm mb-2" style={{ color: THEME.text.secondary }}><strong>2세트:</strong> 검은 화살 +10%, <span style={{ color: THEME.accent }}>야생의 부름 쿨다운 60초 감소!</span></p>
              <p className="text-sm" style={{ color: THEME.text.secondary }}><strong>4세트:</strong> 시드는 불꽃 +50%, 죽음의 강타 시 50% 추가 발사</p>
            </div>
            
            <div className="p-5 rounded-xl" style={{ backgroundColor: THEME.bg.card, border: `1px solid ${THEME.packLeader}40` }}>
              <h3 className="font-bold mb-3" style={{ color: THEME.packLeader }}>🐺 무리의 인도자</h3>
              <p className="text-sm mb-2" style={{ color: THEME.text.secondary }}><strong>2세트:</strong> 펫 피해 +5%, 소환 야수 +15%</p>
              <p className="text-sm" style={{ color: THEME.text.secondary }}><strong>4세트:</strong> <span style={{ color: THEME.info }}>솔선수범 중 야수 소환 시 쇄도!</span></p>
            </div>
          </div>
        </section>

        {/* 제3장: 영웅특성 가이드 */}
        <section id="ch3" className="mb-16 scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: currentColor + '30', color: currentColor }}>제3장</span>
            <h2 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>
              {heroSpec === 'darkRanger' ? '🌑 어둠 순찰자' : '🐺 무리의 인도자'}
            </h2>
          </div>
          
          {heroSpec === 'darkRanger' ? (
            <>
              {/* 🎯 최상위 유저 고급 팁 */}
              <ProTipsBox data={PRO_TIPS_DATA.darkRanger} color={THEME.darkRanger} />
              
              <MathBox 
                title="야생의 부름 극딜 계산"
                formula="16초 ÷ 4초 + 1"
                result="5회 보장 죽음의 강타"
                color={THEME.darkRanger}
              >
                <InlineSpell spell={SKILL_DB.callOfTheWild} /> 16초 동안 4초마다 <InlineSpell spell={SKILL_DB.deathblow} /> 확정!
              </MathBox>
              
              <WarningBox title="야생의 부름 중 금지 사항" color={THEME.darkRanger}>
                <strong>코브라 사격 사용 금지!</strong> 살상 명령과 날카로운 사격만 사용하세요.
              </WarningBox>
              
              <h3 className="font-bold mb-4 mt-8" style={{ color: THEME.darkRanger }}>🎯 단일 대상 (ST)</h3>
              <OpenerFlowchart data={DARK_RANGER_ST_OPENER} color={THEME.darkRanger} title="어둠 순찰자 ST 오프너" />
              <PriorityFlowchart color={THEME.darkRanger} heroSpec="darkRanger" />
              <PriorityTable data={DARK_RANGER_ST_PRIORITY} title="어둠 순찰자 ST 우선순위" color={THEME.darkRanger} />
              
              <h3 className="font-bold mb-4 mt-8" style={{ color: THEME.darkRanger }}>💥 광역 (AOE)</h3>
              <InfoBox title="어둠 순찰자 광딜 핵심" color={THEME.darkRanger} icon="💡">
                야수의 회전베기 유지가 최우선! 일제 사격 2-3 GCD마다 갱신. 죽음의 강타는 여전히 최우선.
              </InfoBox>
              <OpenerFlowchart data={DARK_RANGER_AOE_OPENER} color={THEME.darkRanger} title="어둠 순찰자 AOE 오프너" />
              <PriorityTable data={DARK_RANGER_AOE_PRIORITY} title="어둠 순찰자 AOE 우선순위" color={THEME.darkRanger} />
            </>
          ) : (
            <>
              <InfoBox title="이중 쇄도 조건" color={THEME.packLeader} icon="⏰">
                울음 쿨다운 ≤16초일 때 야수의 격노 사용 → 12초 내 쇄도 2회!
              </InfoBox>
              
              <ChecklistBox 
                title="무리의 인도자 핵심 체크"
                items={["울음 ≤16초 확인 후 야수의 격노 사용", "솔선수범 중 살상 명령 홀드 (울음 임박 시)", "광기 3스택 유지", "WeakAura 필수"]}
                color={THEME.packLeader}
              />
              
              <h3 className="font-bold mb-4 mt-8" style={{ color: THEME.packLeader }}>🎯 단일 대상 (ST)</h3>
              <OpenerFlowchart data={PACK_LEADER_ST_OPENER} color={THEME.packLeader} title="무리의 인도자 ST 오프너" />
              <PriorityFlowchart color={THEME.packLeader} heroSpec="packLeader" />
              <PriorityTable data={PACK_LEADER_ST_PRIORITY} title="무리의 인도자 ST 우선순위" color={THEME.packLeader} />
              
              <h3 className="font-bold mb-4 mt-8" style={{ color: THEME.packLeader }}>💥 광역 (AOE)</h3>
              <InfoBox title="무리의 인도자 광딜 핵심" color={THEME.packLeader} icon="💡">
                이중 쇄도를 대형 팩에 적용! 야수의 회전베기 유지 + 발구르기로 광딜 피해 극대화.
              </InfoBox>
              <OpenerFlowchart data={PACK_LEADER_AOE_OPENER} color={THEME.packLeader} title="무리의 인도자 AOE 오프너" />
              <PriorityTable data={PACK_LEADER_AOE_PRIORITY} title="무리의 인도자 AOE 우선순위" color={THEME.packLeader} />
            </>
          )}
        </section>

        {/* 제4장: 다른 영웅특성 요약 */}
        <section id="ch4" className="mb-16 scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: (heroSpec === 'darkRanger' ? THEME.packLeader : THEME.darkRanger) + '30', color: heroSpec === 'darkRanger' ? THEME.packLeader : THEME.darkRanger }}>제4장</span>
            <h2 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>
              {heroSpec === 'darkRanger' ? '🐺 무리의 인도자 (요약)' : '🌑 어둠 순찰자 (요약)'}
            </h2>
          </div>
          
          {heroSpec === 'darkRanger' ? (
            <div className="p-5 rounded-xl" style={{ backgroundColor: THEME.packLeader + '10', border: `1px solid ${THEME.packLeader}40` }}>
              <p className="text-sm mb-4" style={{ color: THEME.text.secondary }}>
                무리의 인도자는 <strong style={{ color: THEME.packLeader }}>이중 쇄도</strong> 시스템으로 대형 AOE에서 강력합니다. Ara-Kara 등 대형 풀에서 고려.
              </p>
              <button onClick={() => setHeroSpec('packLeader')} className="px-4 py-2 rounded-lg text-sm font-bold"
                style={{ backgroundColor: THEME.packLeader, color: '#fff' }}>
                🐺 무리의 인도자 가이드 보기
              </button>
            </div>
          ) : (
            <div className="p-5 rounded-xl" style={{ backgroundColor: THEME.darkRanger + '10', border: `1px solid ${THEME.darkRanger}40` }}>
              <p className="text-sm mb-4" style={{ color: THEME.text.secondary }}>
                어둠 순찰자는 <strong style={{ color: THEME.darkRanger }}>죽음의 강타</strong> 시스템으로 대부분의 상황에서 6.5%+ 우위. 연막 방어력도 우수.
              </p>
              <button onClick={() => setHeroSpec('darkRanger')} className="px-4 py-2 rounded-lg text-sm font-bold"
                style={{ backgroundColor: THEME.darkRanger, color: '#fff' }}>
                🌑 어둠 순찰자 가이드 보기
              </button>
            </div>
          )}
        </section>

        {/* 제5장: 공통 메커니즘 */}
        <section id="ch5" className="mb-16 scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: THEME.primary + '30', color: THEME.primary }}>제5장</span>
            <h2 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>공통 핵심 메커니즘</h2>
          </div>
          
          <ProcSystemDiagram heroSpec={heroSpec} />
          
          <div className="mb-6">
            <h3 className="font-bold mb-4" style={{ color: currentColor }}>⚡ {heroSpec === 'darkRanger' ? '어둠 순찰자' : '무리의 인도자'} 핵심 프록</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {(heroSpec === 'darkRanger' ? PROC_CHAINS.darkRanger : PROC_CHAINS.packLeader).filter(p => p.critical).map(proc => (
                <ProcDetailCard key={proc.id} proc={proc} color={currentColor} />
              ))}
            </div>
          </div>
          
          <MathBox 
            title="광기 스택 효과"
            formula="스택 × 10%"
            result="최대 30% 공격속도"
            color={THEME.primary}
          >
            <InlineSpell spell={SKILL_DB.barbedShot} /> → <InlineSpell spell={SKILL_DB.frenzy} /> 스택 → 펫 공속↑ → <InlineSpell spell={SKILL_DB.killCommand} /> 피해↑
          </MathBox>
          
          <BurstSequenceDiagram color={currentColor} heroSpec={heroSpec} />
          
          <InfoBox title="야수의 회전베기 필수 유지" color={THEME.info} icon="🌊">
            <InlineSpell spell={SKILL_DB.multiShot} /> 사용 시 4초간 펫 기본 공격이 주변 75% 피해. <strong>2-3 GCD마다 갱신 필수!</strong>
          </InfoBox>
        </section>

        {/* 제6장: 콘텐츠별 */}
        <section id="ch6" className="mb-16 scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: THEME.primary + '30', color: THEME.primary }}>제6장</span>
            <h2 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>콘텐츠별 전략</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl" style={{ backgroundColor: THEME.bg.card, border: `1px solid ${THEME.success}40` }}>
              <h3 className="font-bold mb-3" style={{ color: THEME.success }}>🏰 레이드</h3>
              <p className="text-sm" style={{ color: THEME.text.secondary }}>선풀 -2초에 날카로운 사격, 페이즈 전환에 쿨다운 정렬, 펫 위치 확인</p>
            </div>
            <div className="p-5 rounded-xl" style={{ backgroundColor: THEME.bg.card, border: `1px solid ${THEME.warning}40` }}>
              <h3 className="font-bold mb-3" style={{ color: THEME.warning }}>⚔️ M+</h3>
              <p className="text-sm" style={{ color: THEME.text.secondary }}>소형 팩: 야수의 격노만 / 중형: 야수의 격노+유혈 / 대형+보스: 모든 쿨다운</p>
            </div>
          </div>
        </section>

        {/* 제7장: 고급 최적화 */}
        <section id="ch7" className="mb-16 scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: THEME.primary + '30', color: THEME.primary }}>제7장</span>
            <h2 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>고급 최적화</h2>
          </div>
          
          <InfoBox title="날카로운 사격 멀티도팅" color={THEME.success} icon="🎯">
            다중 대상에 날카로운 사격 분산 적용 → 광포한 야수 소환 확률↑. 4+ 타겟에서 약 +8% 효율.
          </InfoBox>
          
          <div className="p-5 rounded-xl" style={{ backgroundColor: THEME.bg.card }}>
            <h4 className="font-bold mb-3" style={{ color: THEME.text.primary }}>마우스오버 매크로</h4>
            <div className="font-mono text-sm p-3 rounded-lg" style={{ backgroundColor: THEME.bg.secondary }}>
              <div style={{ color: THEME.text.muted }}>#showtooltip 날카로운 사격</div>
              <div style={{ color: THEME.success }}>/cast [@mouseover,harm,nodead][] 날카로운 사격</div>
            </div>
          </div>
        </section>

        {/* 제8장: 흔한 실수 */}
        <section id="ch8" className="mb-16 scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: THEME.accent + '30', color: THEME.accent }}>제8장</span>
            <h2 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>흔한 실수</h2>
          </div>
          
          <div className="space-y-4">
            {COMMON_MISTAKES.filter(m => m.heroTalent === 'both' || m.heroTalent === heroSpec).map((mistake, i) => (
              <div key={i} className="p-4 rounded-xl" style={{ backgroundColor: THEME.bg.card, border: `1px solid ${THEME.accent}40` }}>
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ backgroundColor: THEME.accent + '30', color: THEME.accent }}>{i + 1}</span>
                  <div className="flex-1">
                    <h4 className="font-bold mb-1" style={{ color: THEME.accent }}>{mistake.name}</h4>
                    <p className="text-sm mb-1" style={{ color: THEME.text.secondary }}><strong>원인:</strong> {mistake.cause}</p>
                    <p className="text-sm" style={{ color: THEME.success }}><strong>해결:</strong> {mistake.solution}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: THEME.danger + '20', color: THEME.danger }}>{mistake.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 제9장: 요약 */}
        <section id="ch9" className="mb-16 scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: THEME.primary + '30', color: THEME.primary }}>제9장</span>
            <h2 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>요약</h2>
          </div>
          
          {heroSpec === 'darkRanger' ? (
            <div className="p-5 rounded-xl" style={{ backgroundColor: THEME.darkRanger + '10', border: `1px solid ${THEME.darkRanger}40` }}>
              <h3 className="font-bold mb-4" style={{ color: THEME.darkRanger }}>🌑 어둠 순찰자 핵심 5가지</h3>
              <ol className="space-y-2 text-sm" style={{ color: THEME.text.secondary }}>
                <li>1. 죽음의 강타 → 검은 화살 즉시!</li>
                <li>2. 야생의 부름 16/12/8/4/0초에 보장 죽음의 강타</li>
                <li>3. 야생의 부름 중 코브라 사격 금지</li>
                <li>4. 야생의 부름 30초 내면 야수의 격노 홀드</li>
                <li>5. 광기 만료 괜찮음</li>
              </ol>
            </div>
          ) : (
            <div className="p-5 rounded-xl" style={{ backgroundColor: THEME.packLeader + '10', border: `1px solid ${THEME.packLeader}40` }}>
              <h3 className="font-bold mb-4" style={{ color: THEME.packLeader }}>🐺 무리의 인도자 핵심 5가지</h3>
              <ol className="space-y-2 text-sm" style={{ color: THEME.text.secondary }}>
                <li>1. 울음 ≤16초에서만 야수의 격노 사용</li>
                <li>2. 솔선수범 중 살상 명령 홀드 (울음 임박 시)</li>
                <li>3. 광기 3스택 유지</li>
                <li>4. 이중 쇄도 = 12초 내 2회</li>
                <li>5. WeakAura 필수</li>
              </ol>
            </div>
          )}
        </section>

        {/* 제10장: 프로 팁 */}
        <section id="ch10" className="mb-16 scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: currentColor + '30', color: currentColor }}>제10장</span>
            <h2 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>🎯 최상위 유저 고급 팁</h2>
          </div>
          
          {heroSpec === 'darkRanger' && (
            <>
              {/* 쿨기 딜사이클 상세 */}
              <div className="p-5 rounded-xl mb-6" style={{ backgroundColor: THEME.darkRanger + '10', border: `2px solid ${THEME.darkRanger}` }}>
                <h3 className="font-bold mb-4" style={{ color: THEME.darkRanger }}>🔥 쿨기 딜사이클 (5단계)</h3>
                <div className="space-y-3">
                  {PRO_TIPS_DATA.darkRanger.burstCycle.map((step, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: THEME.bg.card }}>
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                        style={{ backgroundColor: THEME.darkRanger, color: '#fff' }}>{step.step}</span>
                      <p className="text-sm" style={{ color: THEME.text.secondary }}>{step.action}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 스킬 우선순위 상세 */}
              <div className="p-5 rounded-xl mb-6" style={{ backgroundColor: THEME.bg.card, border: `1px solid ${THEME.darkRanger}40` }}>
                <h3 className="font-bold mb-4" style={{ color: THEME.darkRanger }}>📊 진정한 스킬 우선순위 (기존 가이드와 다름!)</h3>
                <div className="space-y-2">
                  {PRO_TIPS_DATA.darkRanger.skillPriority.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg" 
                      style={{ backgroundColor: item.critical ? THEME.darkRanger + '20' : THEME.bg.secondary, border: item.critical ? `1px solid ${THEME.darkRanger}` : 'none' }}>
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ backgroundColor: i < 2 ? THEME.darkRanger : THEME.bg.highlight, color: '#fff' }}>{item.rank}</span>
                      <div className="flex-1">
                        <span className="font-bold" style={{ color: item.critical ? THEME.darkRanger : THEME.text.primary }}>{item.skill}</span>
                        <p className="text-xs" style={{ color: THEME.text.muted }}>{item.reason}</p>
                      </div>
                      {item.critical && <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: THEME.danger + '20', color: THEME.danger }}>핵심</span>}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 비쿨기 vs 쿨기 비교 */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl" style={{ backgroundColor: THEME.bg.card, border: `1px solid ${THEME.text.muted}40` }}>
                  <h4 className="font-bold mb-3" style={{ color: THEME.text.muted }}>💤 비쿨기 구간 (저점)</h4>
                  <ul className="space-y-2 text-sm" style={{ color: THEME.text.secondary }}>
                    <li>• 택밀 수준 딜 (인정하고 받아들일 것)</li>
                    <li>• 오프닝 30초, 부활 직후가 최약</li>
                    <li>• 부패 사격 스택 8중첩 목표로 모으기</li>
                    <li>• 1야부 1야경 로테이션 준수</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: THEME.darkRanger + '15', border: `1px solid ${THEME.darkRanger}` }}>
                  <h4 className="font-bold mb-3" style={{ color: THEME.darkRanger }}>🔥 쿨기 구간 (고점)</h4>
                  <ul className="space-y-2 text-sm" style={{ color: THEME.text.secondary }}>
                    <li>• <strong style={{ color: THEME.darkRanger }}>검화만 누르기!</strong> 쉬지 말고</li>
                    <li>• 광기 끊어져도 무시 (OK)</li>
                    <li>• 야부 위코라 &gt; 날사 위코라</li>
                    <li>• 4초마다 검화 확정 타이밍 집중</li>
                  </ul>
                </div>
              </div>
              
              {/* 예외 상황 */}
              <InfoBox title="예외: 야경 추가 사용 가능 시점" color={THEME.info} icon="💡">
                초블(오프닝 블러드) 직후, 야부 쿨이 35~40초 남았을 때 야경 쿨이 돌아온다면 한 번 더 사용 가능. 단, 다음 야부에 야경이 함께 돈다는 보장은 없음.
              </InfoBox>
            </>
          )}
          
          {heroSpec === 'packLeader' && (
            <div className="p-5 rounded-xl" style={{ backgroundColor: THEME.packLeader + '10', border: `1px solid ${THEME.packLeader}40` }}>
              <h3 className="font-bold mb-4" style={{ color: THEME.packLeader }}>🐺 무리의 인도자 고급 팁</h3>
              <p className="text-sm" style={{ color: THEME.text.secondary }}>
                무리의 인도자 고급 팁은 어둠 순찰자 모드에서 확인하세요. 시즌 3에서는 어둠 순찰자가 85%+ 사용률으로 대부분의 콘텐츠에서 권장됩니다.
              </p>
              <button onClick={() => setHeroSpec('darkRanger')} className="mt-4 px-4 py-2 rounded-lg text-sm font-bold"
                style={{ backgroundColor: THEME.darkRanger, color: '#fff' }}>
                🌑 어둠 순찰자 고급 팁 보기
              </button>
            </div>
          )}
        </section>

        {/* 푸터 */}
        <footer className="pt-8 mt-12 border-t" style={{ borderColor: THEME.primary + '30' }}>
          <p className="text-xs" style={{ color: THEME.text.muted }}>
            데이터: Icy Veins (Azortharion), Method (Qenjua), Discord Trueshot Lodge
          </p>
          <p className="text-xs" style={{ color: THEME.text.muted }}>
            패치 11.1 | v2.0 | 검증: 2025-12-02
          </p>
        </footer>
        
      </main>
    </div>
  );
}
