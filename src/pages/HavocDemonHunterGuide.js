/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 파멸 악마사냥꾼 전문가용 심층 가이드 v8.3
 * The War Within 시즌 3 (11.2.5) - 보고서 기반 완전판 (MCP Magic 적용)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 📋 데이터 출처:
 * ├── Icy Veins (Wordup), Method, Wowhead, Maxroll, Archon.gg
 * ├── Discord Fel Hammer - Voodoo (FRUG)
 * └── 99-META/TERMINOLOGY_GUIDE.md (용어 규칙)
 * 
 * 📖 용어 규칙: "버스트" → "극딜", "광역" → "광딜", "퍼널" → "깔때기 딜", "윈도우" → "타이밍"
 * 📅 패치: 11.2.5 | ✅ 최종 검증: 2025-12-02
 * 
 * 🎯 v8.3 변경사항:
 * - ProcSystemDiagram에 21st.dev Pulse Beams 패턴 제대로 적용
 * - framer-motion의 motion.linearGradient로 실제 빔 애니메이션 구현
 * - SkillNode 컴포넌트: 원형 배경 + 펼스 glow
 * - 타입별 그라데이션 색상 (start/middle/end 3단계)
 * - 아이콘 매핑 9개 수정 (Wowhead API 검증)
 *
 * 🎯 v8.2 변경사항:
 * - 프록 시스템 다이어그램 추가 (ProcSystemDiagram) - 21st.dev AnimatedBeam 패턴 참조
 * - 프록/버프/디버프 상세 설명 섹션 추가 (제5장 확장)
 * - 영웅 특성별 핵심 프록 연쇄 시각화
 * - 모든 프록에 Wowhead 툴팁 연동
 *
 * 🎯 v8.1 변경사항:
 * - 모든 시각자료에 MCP Magic 패턴 적용 (21st.dev 참조)
 * - BurstSequenceDiagram: 스킬 아이콘, 진행 바, 호버/애니메이션 효과
 * - Wowhead 툴팁 한국어화 (locale: koKR, domain: ko)
 * - OpenerFlowchart/PriorityFlowchart: 그라데이션, pulse-glow
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════
// 📊 스킬 데이터베이스 - Wowhead 공식 번역명 + Spell ID + Icon-Database.md 준수
// ═══════════════════════════════════════════════════════════════════════════
// 📊 스킬 데이터베이스 - type: skill | buff | debuff | proc | passive 구분
const SKILL_DB = {
  // === 액티브 스킬 ===
  essenceBreak: { id: 258860, name: "정수 파쇄", nameEn: "Essence Break", icon: "spell_shadow_ritualofsacrifice", type: "skill" },
  bladeDance: { id: 188499, name: "칼춤", nameEn: "Blade Dance", icon: "ability_demonhunter_bladedance", type: "skill" },
  deathSweep: { id: 210152, name: "죽음의 휩쓸기", nameEn: "Death Sweep", icon: "inv_glaive_1h_artifactaldrochi_d_02dual", type: "skill" },
  eyeBeam: { id: 198013, name: "안광", nameEn: "Eye Beam", icon: "ability_demonhunter_eyebeam", type: "skill" },
  chaosStrike: { id: 162794, name: "혼돈의 일격", nameEn: "Chaos Strike", icon: "ability_demonhunter_chaosstrike", type: "skill" },
  annihilation: { id: 201427, name: "파멸", nameEn: "Annihilation", icon: "inv_glaive_1h_npc_d_02", type: "skill" },
  metamorphosis: { id: 191427, name: "탈태", nameEn: "Metamorphosis", icon: "ability_demonhunter_metamorphasisdps", type: "skill" },
  immolationAura: { id: 258920, name: "제물의 오라", nameEn: "Immolation Aura", icon: "ability_demonhunter_immolation", type: "skill" },
  theHunt: { id: 323639, name: "사냥", nameEn: "The Hunt", icon: "ability_ardenweald_demonhunter", type: "skill" },
  felBlade: { id: 232893, name: "지옥칼", nameEn: "Fel Blade", icon: "ability_demonhunter_felblade", type: "skill" },
  vengefulRetreat: { id: 198793, name: "복수의 퇴각", nameEn: "Vengeful Retreat", icon: "ability_demonhunter_vengefulretreat2", type: "skill" },
  sigilOfFlame: { id: 204596, name: "불꽃의 인장", nameEn: "Sigil of Flame", icon: "ability_demonhunter_sigilofinquisition", type: "skill" },
  throwGlaive: { id: 185123, name: "글레이브 투척", nameEn: "Throw Glaive", icon: "ability_demonhunter_throwglaive", type: "skill" },
  demonsBite: { id: 162243, name: "악마의 이빨", nameEn: "Demon's Bite", icon: "inv_weapon_glave_01", type: "skill" },
  felRush: { id: 195072, name: "지옥 돌진", nameEn: "Fel Rush", icon: "ability_demonhunter_felrush", type: "skill" },
  reaversGlaive: { id: 442294, name: "파괴자의 글레이브", nameEn: "Reaver's Glaive", icon: "inv_ability_aldrachireaverdemonhunter_reaversglaive", type: "skill" },
  sigilOfDoom: { id: 452490, name: "파멸의 인장", nameEn: "Sigil of Doom", icon: "ability_bossfelorcs_necromancer_red", type: "skill" },
  abyssalGaze: { id: 452497, name: "심연의 시선", nameEn: "Abyssal Gaze", icon: "ability_demonhunter_eyebeam", type: "skill" },
  consumingFire: { id: 452486, name: "소멸의 불길", nameEn: "Consuming Fire", icon: "spell_fire_felimmolation", type: "skill" },
  
  // === 버프 (본인에게 이로운 효과) 🔵 ===
  thrillOfFight: { id: 442688, name: "전투의 전율", nameEn: "Thrill of the Fight", icon: "spell_mage_overpowered", type: "buff" },
  initiative: { id: 388108, name: "선제공격", nameEn: "Initiative", icon: "ability_rogue_surpriseattack", type: "buff" },
  inertia: { id: 427640, name: "타성", nameEn: "Inertia", icon: "inv_10_inscription3_pigments_black", type: "buff" },
  rendingStrike: { id: 442442, name: "찢는일격", nameEn: "Rending Strike", icon: "ability_bossmannoroth_glaivethrust", type: "buff" },
  glaiveFlurry: { id: 442435, name: "글레이브난무", nameEn: "Glaive Flurry", icon: "spell_holy_blessingofstrength", type: "buff" },
  studentOfSuffering: { id: 452498, name: "고통의 제자", nameEn: "Student of Suffering", icon: "inv_misc_dungeonsignetearthen02_color1", type: "buff" },
  unrestrainedFury: { id: 320770, name: "억제되지 않은 분노", nameEn: "Unrestrained Fury", icon: "ability_warrior_improveddisciplines", type: "buff" },
  
  // === 디버프 (대상에게 적용되는 효과) 🔴 ===
  reaversMark: { id: 442624, name: "파괴자의 징표", nameEn: "Reaver's Mark", icon: "ability_hunter_harass", type: "debuff" },
  essenceBreakDebuff: { id: 320338, name: "정수 파쇄", nameEn: "Essence Break", icon: "spell_shadow_ritualofsacrifice", type: "debuff" },
  chaosBrand: { id: 1490, name: "혼돈의 낙인", nameEn: "Chaos Brand", icon: "spell_shadow_demonicpact", type: "debuff" },
  woundedQuarry: { id: 444775, name: "부상당한 사냥감", nameEn: "Wounded Quarry", icon: "ability_rogue_quickrecovery", type: "debuff" },
  
  // === 프록 (발동 효과) ⚡ ===
  demonsurge: { id: 452402, name: "악마쇄도", nameEn: "Demonsurge", icon: "inv_ability_felscarreddemonhunter_demonsurge", type: "proc" },
  aldrachisWrath: { id: 444806, name: "알드라치의 격노", nameEn: "Fury of the Aldrachi", icon: "ability_glaivetoss", type: "proc" },
  aFireInside: { id: 427775, name: "내부의 화염", nameEn: "A Fire Inside", icon: "ability_demonhunter_chaoticimprint_fire", type: "proc" },
  
  // === 패시브/특성 ===
  cycleOfHatred: { id: 258887, name: "증오의 순환", nameEn: "Cycle of Hatred", icon: "ability_ironmaidens_whirlofblood", type: "passive" },
  chaoticTransformation: { id: 388112, name: "혼돈의 변형", nameEn: "Chaotic Transformation", icon: "ability_demonhunter_glide", type: "passive" },
};

// 타입별 이모지 매핑
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
  primary: '#A330C9',
  aldrachi: '#00CED1',
  felScarred: '#9400D3',
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
const ALDRACHI_ST_PRIORITY = [
  { rank: 1, skill: SKILL_DB.deathSweep, condition: "정수 파쇄 디버프 중", reason: "80% 증폭 극대화", critical: true },
  { rank: 2, skill: SKILL_DB.annihilation, condition: "정수 파쇄 디버프 중", reason: "80% 증폭 극대화", critical: true },
  { rank: 3, skill: SKILL_DB.reaversGlaive, condition: "발동 시 즉시", reason: "버프 유지 최우선", critical: true },
  { rank: 4, skill: SKILL_DB.theHunt, condition: "파괴자의 글레이브 충전 없을 때", reason: "파괴자의 글레이브 발동 + 피해" },
  { rank: 5, skill: SKILL_DB.vengefulRetreat, condition: "안광/정수 파쇄 직전", reason: "선제공격 + 타성 버프" },
  { rank: 6, skill: SKILL_DB.essenceBreak, condition: "탈태 상태 + 분노 40+", reason: "매 두 번째 안광과 동기화" },
  { rank: 7, skill: SKILL_DB.metamorphosis, condition: "안광 + 칼춤 쿨다운 시", reason: "혼돈의 변형 리셋 활용" },
  { rank: 8, skill: SKILL_DB.eyeBeam, condition: "쿨마다", reason: "악마화 발동 + 증오의 순환" },
  { rank: 9, skill: SKILL_DB.bladeDance, condition: "글레이브난무 두 번째 소모", reason: "알드라치의 격노 12회 베기" },
  { rank: 10, skill: SKILL_DB.chaosStrike, condition: "찢는일격 활성 시 먼저", reason: "파괴자의 징표 적용" },
  { rank: 11, skill: SKILL_DB.felBlade, condition: "분노 ≤ 80", reason: "분노 40 생성" },
  { rank: 12, skill: SKILL_DB.sigilOfFlame, condition: "분노 ≤ 90", reason: "분노 생성 + 지속피해" },
  { rank: 13, skill: SKILL_DB.immolationAura, condition: "필러", reason: "다른 스킬 없을 때" },
  { rank: 14, skill: SKILL_DB.throwGlaive, condition: "최후 수단", reason: "거의 사용 안 함" },
];

const FELSCARRED_ST_PRIORITY = [
  { rank: 1, skill: SKILL_DB.deathSweep, condition: "정수 파쇄 디버프 중", reason: "80% 증폭", critical: true },
  { rank: 2, skill: SKILL_DB.annihilation, condition: "정수 파쇄 디버프 중", reason: "80% 증폭", critical: true },
  { rank: 3, skill: SKILL_DB.felBlade, condition: "타성 버프 중", reason: "버프 활용" },
  { rank: 4, skill: SKILL_DB.vengefulRetreat, condition: "안광 쿨다운과 동기화", reason: "선제공격 버프" },
  { rank: 5, skill: SKILL_DB.theHunt, condition: "쿨다운 시", reason: "피해 + 분노" },
  { rank: 6, skill: SKILL_DB.sigilOfDoom, condition: "탈태 중 + 악마쇄도 충전", reason: "강화 능력 우선" },
  { rank: 7, skill: SKILL_DB.essenceBreak, condition: "악마쇄도 모두 소비 후", reason: "비동기화 규칙", critical: true },
  { rank: 8, skill: SKILL_DB.deathSweep, condition: "악마쇄도 충전 있으면 우선", reason: "강화 능력" },
  { rank: 9, skill: SKILL_DB.metamorphosis, condition: "안광 쿨다운 + 제물 0충전", reason: "혼돈의 변형 리셋" },
  { rank: 10, skill: SKILL_DB.sigilOfFlame, condition: "안광 10초 전", reason: "고통의 제자 버프" },
  { rank: 11, skill: SKILL_DB.eyeBeam, condition: "쿨마다", reason: "악마화 발동" },
  { rank: 12, skill: SKILL_DB.bladeDance, condition: "-", reason: "스펜더" },
  { rank: 13, skill: SKILL_DB.chaosStrike, condition: "-", reason: "분노 소비" },
  { rank: 14, skill: SKILL_DB.felBlade, condition: "분노 ≤ 130", reason: "분노 생성" },
  { rank: 15, skill: SKILL_DB.immolationAura, condition: "충전 쌓이면 즉시", reason: "5중첩 방지" },
  { rank: 16, skill: SKILL_DB.throwGlaive, condition: "최후 수단", reason: "필러" },
];

const ALDRACHI_OPENER = [
  { step: 1, timing: "-2초", skill: SKILL_DB.immolationAura, note: "프리풀 분노 생성", phase: "prepull" },
  { step: 2, timing: "-1초", skill: SKILL_DB.sigilOfFlame, note: "프리풀 분노 + 지속피해", phase: "prepull" },
  { step: 3, timing: "풀", skill: SKILL_DB.theHunt, note: "파괴자의 글레이브 발동", highlight: true, phase: "pull" },
  { step: 4, timing: "", skill: SKILL_DB.reaversGlaive, note: "찢는일격 + 글레이브난무", phase: "setup" },
  { step: 5, timing: "", skill: SKILL_DB.eyeBeam, note: "악마화 진입 (5초)", phase: "setup" },
  { step: 6, timing: "", skill: SKILL_DB.felBlade, note: "분노 40 보충", phase: "setup" },
  { step: 7, timing: "", skill: SKILL_DB.annihilation, note: "찢는일격 소모", phase: "setup" },
  { step: 8, timing: "💥", skill: SKILL_DB.essenceBreak, note: "4초 극딜 시작!", highlight: true, phase: "burst" },
  { step: 9, timing: "", skill: SKILL_DB.deathSweep, note: "12회 베기!", phase: "burst" },
  { step: 10, timing: "⚡", skill: SKILL_DB.vengefulRetreat, note: "Off-GCD!", highlight: true, phase: "burst" },
  { step: 11, timing: "", skill: SKILL_DB.metamorphosis, note: "혼돈의 변형 리셋", phase: "burst" },
  { step: 12, timing: "", skill: SKILL_DB.deathSweep, note: "리셋된 죽휩", phase: "burst" },
  { step: 13, timing: "", skill: SKILL_DB.annihilation, note: "파멸 스팸", phase: "burst" },
  { step: 14, timing: "", skill: SKILL_DB.annihilation, note: "파멸 스팸", phase: "burst" },
  { step: 15, timing: "", skill: SKILL_DB.felBlade, note: "분노 보충", phase: "continue" },
  { step: 16, timing: "", skill: SKILL_DB.eyeBeam, note: "리셋된 안광", phase: "continue" },
  { step: 17, timing: "→", skill: null, note: "일반 우선순위", phase: "continue" },
];

const FELSCARRED_OPENER = [
  { step: 1, timing: "-2초", skill: SKILL_DB.immolationAura, note: "프리풀 분노", phase: "prepull" },
  { step: 2, timing: "-1초", skill: SKILL_DB.sigilOfFlame, note: "고통의 제자 준비", phase: "prepull" },
  { step: 3, timing: "풀", skill: SKILL_DB.theHunt, note: "시작", highlight: true, phase: "pull" },
  { step: 4, timing: "", skill: SKILL_DB.eyeBeam, note: "악마쇄도 2충전", phase: "setup" },
  { step: 5, timing: "", skill: SKILL_DB.felBlade, note: "분노 보충", phase: "setup" },
  { step: 6, timing: "", skill: SKILL_DB.deathSweep, note: "악마쇄도 1 소비", phase: "setup" },
  { step: 7, timing: "", skill: SKILL_DB.annihilation, note: "악마쇄도 2 소비", phase: "setup" },
  { step: 8, timing: "😈", skill: SKILL_DB.vengefulRetreat, note: "Off-GCD!", highlight: true, phase: "meta" },
  { step: 9, timing: "", skill: SKILL_DB.metamorphosis, note: "악마쇄도 5충전", phase: "meta" },
  { step: 10, timing: "", skill: SKILL_DB.deathSweep, note: "5중 1", phase: "meta" },
  { step: 11, timing: "", skill: SKILL_DB.annihilation, note: "5중 2", phase: "meta" },
  { step: 12, timing: "", skill: SKILL_DB.sigilOfDoom, note: "5중 3", phase: "meta" },
  { step: 13, timing: "", skill: SKILL_DB.felBlade, note: "분노 보충", phase: "meta" },
  { step: 14, timing: "", skill: SKILL_DB.abyssalGaze, note: "5중 4", phase: "meta" },
  { step: 15, timing: "💥", skill: SKILL_DB.essenceBreak, note: "4초 극딜!", highlight: true, phase: "burst" },
  { step: 16, timing: "", skill: SKILL_DB.deathSweep, note: "80% 증폭", phase: "burst" },
  { step: 17, timing: "", skill: SKILL_DB.annihilation, note: "80% 증폭", phase: "burst" },
  { step: 18, timing: "", skill: SKILL_DB.annihilation, note: "파멸 스팸", phase: "burst" },
  { step: 19, timing: "", skill: SKILL_DB.consumingFire, note: "5중 5", phase: "burst" },
  { step: 20, timing: "→", skill: null, note: "일반 우선순위", phase: "continue" },
];

// AOE 오프너 (v8.3 신규)
const ALDRACHI_AOE_OPENER = [
  { step: 1, timing: "-2초", skill: SKILL_DB.immolationAura, note: "프리풀 분노", phase: "prepull" },
  { step: 2, timing: "-1초", skill: SKILL_DB.sigilOfFlame, note: "광딜 지속피해", phase: "prepull" },
  { step: 3, timing: "풀", skill: SKILL_DB.theHunt, note: "관통 + 글레이브 발동", highlight: true, phase: "pull" },
  { step: 4, timing: "", skill: SKILL_DB.eyeBeam, note: "광딜 핵심 + 악마화", highlight: true, phase: "burst" },
  { step: 5, timing: "", skill: SKILL_DB.reaversGlaive, note: "버프 획득", phase: "burst" },
  { step: 6, timing: "", skill: SKILL_DB.deathSweep, note: "광딜 죽휩", phase: "burst" },
  { step: 7, timing: "💥", skill: SKILL_DB.essenceBreak, note: "영구 타겟!", highlight: true, phase: "burst" },
  { step: 8, timing: "", skill: SKILL_DB.bladeDance, note: "12회 베기!", highlight: true, phase: "burst" },
  { step: 9, timing: "⚡", skill: SKILL_DB.vengefulRetreat, note: "Off-GCD", phase: "burst" },
  { step: 10, timing: "", skill: SKILL_DB.metamorphosis, note: "리셋", phase: "burst" },
  { step: 11, timing: "", skill: SKILL_DB.deathSweep, note: "리셋된 죽휩", phase: "burst" },
  { step: 12, timing: "", skill: SKILL_DB.eyeBeam, note: "리셋된 안광", phase: "continue" },
  { step: 13, timing: "→", skill: null, note: "AOE 우선순위", phase: "continue" },
];

const FELSCARRED_AOE_OPENER = [
  { step: 1, timing: "-2초", skill: SKILL_DB.immolationAura, note: "프리풀 분노", phase: "prepull" },
  { step: 2, timing: "-1초", skill: SKILL_DB.sigilOfFlame, note: "고통의 제자", phase: "prepull" },
  { step: 3, timing: "풀", skill: SKILL_DB.theHunt, note: "관통 피해", highlight: true, phase: "pull" },
  { step: 4, timing: "", skill: SKILL_DB.eyeBeam, note: "광딜 + 악마쇄도 2충", highlight: true, phase: "burst" },
  { step: 5, timing: "", skill: SKILL_DB.deathSweep, note: "강화 죽휩", phase: "burst" },
  { step: 6, timing: "", skill: SKILL_DB.bladeDance, note: "광딜 스펜더", phase: "burst" },
  { step: 7, timing: "😈", skill: SKILL_DB.vengefulRetreat, note: "Off-GCD", phase: "meta" },
  { step: 8, timing: "", skill: SKILL_DB.metamorphosis, note: "악마쇄도 5충", highlight: true, phase: "meta" },
  { step: 9, timing: "", skill: SKILL_DB.sigilOfDoom, note: "강화 인장 광딜", phase: "meta" },
  { step: 10, timing: "", skill: SKILL_DB.consumingFire, note: "강화 제물 폭발", phase: "meta" },
  { step: 11, timing: "", skill: SKILL_DB.deathSweep, note: "강화 죽휩", phase: "meta" },
  { step: 12, timing: "💥", skill: SKILL_DB.essenceBreak, note: "영구 타겟!", highlight: true, phase: "burst" },
  { step: 13, timing: "", skill: SKILL_DB.eyeBeam, note: "리셋된 안광", phase: "burst" },
  { step: 14, timing: "→", skill: null, note: "AOE 우선순위", phase: "continue" },
];

// AOE 우선순위 (v8.3 신규)
const ALDRACHI_AOE_PRIORITY = [
  { rank: 1, skill: SKILL_DB.eyeBeam, condition: "쓸마다", reason: "광딜 핵심 + 악마화", critical: true },
  { rank: 2, skill: SKILL_DB.deathSweep, condition: "정수 파쇄 디버프 중", reason: "80% 증폭 광딜", critical: true },
  { rank: 3, skill: SKILL_DB.bladeDance, condition: "글레이브난무 두 번째", reason: "12회 베기 광딜", critical: true },
  { rank: 4, skill: SKILL_DB.reaversGlaive, condition: "발동 시 즉시", reason: "버프 유지", critical: true },
  { rank: 5, skill: SKILL_DB.theHunt, condition: "파괴자 글레이브 0충전", reason: "글레이브 발동 + 관통 피해" },
  { rank: 6, skill: SKILL_DB.essenceBreak, condition: "탈태 상태 + 먽 개 이상", reason: "영구 타겟 사용" },
  { rank: 7, skill: SKILL_DB.immolationAura, condition: "쓸마다", reason: "광딜 지속피해 + 분노" },
  { rank: 8, skill: SKILL_DB.sigilOfFlame, condition: "쓸마다", reason: "광딜 지속피해" },
  { rank: 9, skill: SKILL_DB.throwGlaive, condition: "분노 부족 시", reason: "제조기의 연속치기" },
  { rank: 10, skill: SKILL_DB.chaosStrike, condition: "분노 소비", reason: "단일 대상 필러" },
];

const FELSCARRED_AOE_PRIORITY = [
  { rank: 1, skill: SKILL_DB.eyeBeam, condition: "쓸마다", reason: "악마쇄도 2충전 + 광딜", critical: true },
  { rank: 2, skill: SKILL_DB.deathSweep, condition: "악마쇄도 충전 있을 때", reason: "강화 죽휩", critical: true },
  { rank: 3, skill: SKILL_DB.bladeDance, condition: "쓸마다", reason: "광딜 스펜더" },
  { rank: 4, skill: SKILL_DB.sigilOfDoom, condition: "탈태 중 + 악마쇄도", reason: "강화 인장", critical: true },
  { rank: 5, skill: SKILL_DB.consumingFire, condition: "악마쇄도 충전", reason: "강화 제물 폭발" },
  { rank: 6, skill: SKILL_DB.immolationAura, condition: "충전 쌓이면 즉시", reason: "5중첩 방지 + 광딜" },
  { rank: 7, skill: SKILL_DB.theHunt, condition: "콀다운 시", reason: "관통 피해" },
  { rank: 8, skill: SKILL_DB.essenceBreak, condition: "3먽+ 정수 타겟", reason: "광딜 증폭" },
  { rank: 9, skill: SKILL_DB.sigilOfFlame, condition: "쓸마다", reason: "고통의 제자 + 광딜" },
  { rank: 10, skill: SKILL_DB.throwGlaive, condition: "필러", reason: "제조기의 연속치기" },
];

const COMMON_MISTAKES = [
  { name: "분노 오버캡", impact: "DPS 10-15% 손실", cause: "분노 바 주시 부족", solution: "상한 근처 즉시 스펜더", heroTalent: "both", detail: "알드라치 90, 지옥상흔 120 상한" },
  { name: "정수 파쇄 타이밍 낭비", impact: "DPS 20%+ 손실", cause: "분노 부족, 탈태 밖 시전", solution: "분노 60-80 확보, 탈태 상태 확인", heroTalent: "both", detail: "4초 타이밍에 DPS 60%+ 발생" },
  { name: "파괴자의 글레이브 쌓기", impact: "버프 업타임↓", cause: "'더 좋은 타이밍' 기다림", solution: "발동 즉시 사용", heroTalent: "aldrachi", detail: "버프 유지가 최우선" },
  { name: "제물의 오라 5중첩", impact: "GCD 강제 소비", cause: "내부의 화염 30% 리셋", solution: "4중첩 이하 유지", heroTalent: "felscarred", detail: "탈태 전 0충전+쿨다운" },
  { name: "탈태 전 안광/칼춤 미사용", impact: "혼돈의 변형 낭비", cause: "메커니즘 미이해", solution: "탈태 전 쿨다운 상태 확인", heroTalent: "both", detail: "리셋될 스킬 먼저 사용" },
];

// ═══════════════════════════════════════════════════════════════════════════
// ⚡ 프록 시스템 데이터 (v8.2) - 스킬 간 발동 연쇄 관계
// ═══════════════════════════════════════════════════════════════════════════
const PROC_CHAINS = {
  // 공통 프록 (양쪽 영웅 특성)
  common: [
    {
      id: 'eyebeam-demonic',
      trigger: SKILL_DB.eyeBeam,
      result: SKILL_DB.metamorphosis,
      type: 'guaranteed',
      description: '안광 채널 → 악마화 5초 진입',
      detail: '"악마화" 특성. 안광 채널 시작 시 자동으로 탈태(악마화) 상태 5초간 부여',
    },
    {
      id: 'fury-cycle',
      trigger: SKILL_DB.eyeBeam,
      result: SKILL_DB.cycleOfHatred,
      type: 'fury',
      description: '안광 분노 생성 → 탈태 쿨감',
      detail: '"증오의 순환" 특성. 안광으로 생성된 분노 40당 탈태 쿨다운 3초 감소',
    },
    {
      id: 'chaotic-transform',
      trigger: SKILL_DB.metamorphosis,
      result: SKILL_DB.chaoticTransformation,
      type: 'guaranteed',
      description: '탈태 시전 → 안광/칼춤 쿨다운 리셋',
      detail: '"혼돈의 변형" 특성. 탈태 시전 시 안광과 칼춤(죽휩) 쿨다운 즉시 초기화',
    },
    {
      id: 'initiative',
      trigger: SKILL_DB.vengefulRetreat,
      result: SKILL_DB.initiative,
      type: 'guaranteed',
      description: '복수의 퇴각 → 선제공격 10% 버프',
      detail: '"선제공격" 특성. 복수의 퇴각 사용 시 12초간 치명타 확률 10% 증가',
    },
    {
      id: 'inertia',
      trigger: SKILL_DB.felRush,
      result: SKILL_DB.inertia,
      type: 'guaranteed',
      description: '지옥 돌진/복퇴 → 타성 18% 버프',
      detail: '"타성" 특성. 제물의 오라 활성 중 지옥 돌진/복수의 퇴각 시 5초간 피해 18% 증가',
    },
  ],
  
  // 알드라치 전용 프록
  aldrachi: [
    {
      id: 'hunt-glaive',
      trigger: SKILL_DB.theHunt,
      result: SKILL_DB.reaversGlaive,
      type: 'guaranteed',
      description: '사냥 → 파괴자의 글레이브 발동',
      detail: '"Warglaves of the Aldrachi" 특성. 사냥 적중 시 파괴자의 글레이브 1충전 즉시 부여',
      critical: true,
    },
    {
      id: 'glaive-buffs',
      trigger: SKILL_DB.reaversGlaive,
      result: SKILL_DB.rendingStrike,
      type: 'guaranteed',
      description: '파괴자 글레이브 → 찢는일격 + 글레이브난무',
      detail: '파괴자의 글레이브 사용 시 찢는일격(혼일↑) + 글레이브난무(칼춤↑) 버프 동시 획득',
      critical: true,
    },
    {
      id: 'rending-mark',
      trigger: SKILL_DB.chaosStrike,
      result: SKILL_DB.reaversMark,
      type: 'buff-consume',
      description: '찢는일격 + 혼일 → 파괴자의 징표 15%',
      detail: '찢는일격 버프 활성 중 혼돈의 일격 적중 시 대상에게 파괴자의 징표(받피증 15%) 적용',
    },
    {
      id: 'glaive-flurry',
      trigger: SKILL_DB.bladeDance,
      result: SKILL_DB.aldrachisWrath,
      type: 'buff-consume',
      description: '글레이브난무 두 번째 소모 → 12회 베기',
      detail: '글레이브난무 2회차 칼춤/죽휩 사용 시 알드라치의 격노 발동 → 12회 추가 베기!',
      critical: true,
    },
    {
      id: 'thrill-fight',
      trigger: SKILL_DB.reaversGlaive,
      result: SKILL_DB.thrillOfFight,
      type: 'guaranteed',
      description: '파괴자 글레이브 → 전투의 전율 20%',
      detail: '파괴자의 글레이브 사용 시 10초간 공격 속도 + 피해 20% 증가. 정수 파쇄와 겹치면 116%!',
      critical: true,
    },
  ],
  
  // 지옥상흔 전용 프록
  felscarred: [
    {
      id: 'demonsurge-eye',
      trigger: SKILL_DB.eyeBeam,
      result: SKILL_DB.demonsurge,
      type: 'guaranteed',
      description: '안광 → 악마쇄도 2충전',
      detail: '안광 채널 완료 시 악마쇄도 2충전 획득. 5개 강화 능력 언락',
      critical: true,
    },
    {
      id: 'demonsurge-meta',
      trigger: SKILL_DB.metamorphosis,
      result: SKILL_DB.demonsurge,
      type: 'guaranteed',
      description: '탈태 → 악마쇄도 5충전',
      detail: '탈태 시전 시 악마쇄도 5충전 획득. 모든 강화 능력 한번씩 사용 가능',
      critical: true,
    },
    {
      id: 'student-sigil',
      trigger: SKILL_DB.sigilOfFlame,
      result: SKILL_DB.studentOfSuffering,
      type: 'guaranteed',
      description: '불꽃의 인장 → 고통의 제자 버프',
      detail: '"고통의 제자" 특성. 불꽃의 인장 폭발 시 고통의 제자 버프 획득 → 다음 안광 강화',
    },
    {
      id: 'fire-inside',
      trigger: SKILL_DB.immolationAura,
      result: SKILL_DB.aFireInside,
      type: 'chance',
      chancePercent: 30,
      description: '제물의 오라 → 30% 확률 리셋',
      detail: '"내부의 화염" 특성. 제물의 오라가 피해를 줄 때 30% 확률로 충전 리셋. 5중첩 주의!',
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
  
  if (showTooltip) {
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

// 🔗 인라인 버프/프록/디버프 표시 컴포넌트 (아이콘 + 이모지 + 툴팁)
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
    <a 
      href={`https://ko.wowhead.com/spell=${spell.id}`}
      data-wowhead={`spell=${spell.id}&domain=ko`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded hover-scale"
      style={{ backgroundColor: color + '20', textDecoration: 'none' }}
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
    </a>
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
// 📊 시각자료 컴포넌트 - MCP Magic 패턴 적용 (v8.1)
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

// 🎯 오프너 플로우차트 - 21st.dev Steps 패턴 참고 (v8.3)
// 가로 1열, 스크롤 없이 한 화면에 표시
const OpenerFlowchart = ({ data, color, title }) => {
  const phaseColors = {
    prepull: THEME.text.muted,
    pull: THEME.warning,
    setup: color,
    meta: THEME.felScarred,
    burst: THEME.accent,
    continue: THEME.text.secondary,
  };
  
  return (
    <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: THEME.bg.card, border: `1px solid ${color}40` }}>
      <AnimationStyles />
      <h4 className="font-bold mb-3" style={{ color }}>📊 {title}</h4>
      
      {/* 가로 1열 Steps 레이아웃 */}
      <div className="flex items-center justify-between gap-1">
        {data.map((item, idx) => {
          const phaseColor = phaseColors[item.phase] || THEME.text.muted;
          const isBurst = item.phase === 'burst';
          const isLast = idx === data.length - 1;
          
          return (
            <React.Fragment key={idx}>
              {/* 스킬 노드 */}
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
              
              {/* Separator */}
              {!isLast && (
                <div className="flex-1 h-0.5 min-w-1 max-w-4 rounded-full" 
                  style={{ backgroundColor: phaseColor + '40' }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* 페이즈 레전드 */}
      <div className="flex flex-wrap gap-3 mt-3 justify-center">
        {Object.entries({ 프리풀: 'prepull', 풀: 'pull', 셋업: 'setup', 탈태: 'meta', '💥극딜': 'burst', 유지: 'continue' }).map(([label, phase]) => (
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

// 🎯 우선순위 플로우차트 (TD 세로 방향) - 깔끔한 버전 (v8.3)
const PriorityFlowchart = ({ color, heroSpec }) => {
  const isAldrachi = heroSpec === 'aldrachi';
  
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
        <FlowNode type="question" glow>정수 파쇄 디버프?</FlowNode>
        
        <div className="flex items-start gap-12 mt-2">
          {/* Yes 분기 */}
          <div className="flex flex-col items-center gap-2">
            <BranchLabel yes />
            <Connector vertical color={THEME.success} />
            <SkillNode skill={SKILL_DB.deathSweep} label="죽휩 스팸!" highlight />
            <span className="text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: THEME.accent + '20', color: THEME.accent }}>↓ 80% 증폭!</span>
            <SkillNode skill={SKILL_DB.annihilation} label="파멸 스팸" highlight />
          </div>
          
          {/* No 분기 */}
          <div className="flex flex-col items-center gap-2">
            <BranchLabel />
            <Connector vertical color={THEME.text.muted} />
            <FlowNode type="hero">{isAldrachi ? '파괴자 글레이브?' : '악마쇄도 충전?'}</FlowNode>
            
            <div className="flex items-start gap-6 mt-2">
              <div className="flex flex-col items-center gap-2">
                <BranchLabel yes />
                {isAldrachi ? (
                  <SkillNode skill={SKILL_DB.reaversGlaive} label="즉시!" />
                ) : (
                  <span className="text-sm font-bold px-3 py-2 rounded-lg" style={{ backgroundColor: color + '20', color }}>강화 능력 먼저!</span>
                )}
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <BranchLabel />
                <Connector vertical color={THEME.text.muted} />
                <FlowNode type="action">탈태 상태?</FlowNode>
                
                <div className="flex items-start gap-4 mt-2">
                  <div className="flex flex-col items-center gap-1">
                    <BranchLabel yes />
                    <SkillNode skill={SKILL_DB.essenceBreak} label="정파" />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <BranchLabel />
                    <SkillNode skill={SKILL_DB.eyeBeam} label="안광" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-xs mt-5 text-center" style={{ color: THEME.text.muted }}>호버하면 확대 | 상세 우선순위는 아래 테이블 참조</p>
    </div>
  );
};

// 🎯 극딜 타이밍 시퀀스 다이어그램 - MCP Magic 완전 적용 (v8.1)
const BurstSequenceDiagram = ({ color, heroSpec }) => {
  const isAldrachi = heroSpec === 'aldrachi';
  
  const aldrachiSteps = [
    { actor: '파괴자의 글레이브', action: '발동', target: '버프 획득', note: '찢는일격+글레이브난무', burst: false, skill: SKILL_DB.reaversGlaive },
    { actor: '혼돈의 일격', action: '첫 번째', target: '찢는일격 소모', note: '파괴자의 징표 15%', burst: false, skill: SKILL_DB.chaosStrike },
    { actor: '복수의 퇴각', action: 'Off-GCD', target: '안광 직전', note: '선제공격 10%', burst: false, skill: SKILL_DB.vengefulRetreat },
    { actor: '안광', action: '채널', target: '악마화 5초', note: '탈태 진입', burst: false, skill: SKILL_DB.eyeBeam },
    { actor: '정수 파쇄', action: '시전!', target: '대상', note: '80% 4초 시작', burst: true, skill: SKILL_DB.essenceBreak },
    { actor: '죽음의 휩쓸기', action: '두 번째', target: '글레이브난무', note: '12회 베기!', burst: true, skill: SKILL_DB.deathSweep },
    { actor: '파멸', action: '스팸', target: '분노 소비', note: '80% 증폭', burst: true, skill: SKILL_DB.annihilation },
    { actor: '죽음의 휩쓸기', action: '리셋', target: '혼돈의 변형', note: '가속 충분 시', burst: true, skill: SKILL_DB.deathSweep },
  ];
  
  const felscarredSteps = [
    { actor: '안광', action: '채널', target: '악마화', note: '악마쇄도 2충전', burst: false, skill: SKILL_DB.eyeBeam },
    { actor: '죽음의 휩쓸기', action: '악마쇄도 1', target: '소비', note: '강화 피해', burst: false, skill: SKILL_DB.deathSweep },
    { actor: '파멸', action: '악마쇄도 2', target: '소비', note: '강화 피해', burst: false, skill: SKILL_DB.annihilation },
    { actor: '탈태', action: '시전', target: '진입', note: '악마쇄도 5충전', burst: false, skill: SKILL_DB.metamorphosis },
    { actor: '강화 능력들', action: '5개 모두', target: '소비', note: '죽휩/파멸/인장/시선/불길', burst: false, skill: SKILL_DB.demonsurge },
    { actor: '정수 파쇄', action: '지연 시전!', target: '대상', note: '80% 4초 시작', burst: true, skill: SKILL_DB.essenceBreak },
    { actor: '죽음의 휩쓸기', action: '즉시', target: '80% 증폭', note: '최우선', burst: true, skill: SKILL_DB.deathSweep },
    { actor: '파멸', action: '스팸', target: '80% 증폭', note: '분노 소비', burst: true, skill: SKILL_DB.annihilation },
  ];
  
  const steps = isAldrachi ? aldrachiSteps : felscarredSteps;
  const burstStartIdx = steps.findIndex(s => s.burst);
  
  return (
    <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: THEME.bg.card, border: `1px solid ${THEME.accent}40` }}>
      <AnimationStyles />
      <h4 className="font-bold mb-4" style={{ color: THEME.accent }}>📊 정수 파쇄 극딜 시퀀스 ({isAldrachi ? '알드라치' : '지옥상흔'})</h4>
      
      {/* 진행 바 - 극딜 구간 시각화 */}
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
            <div className="shrink-0 hover-scale"><SkillIcon skill={step.skill} size="small" /></div>
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
          <strong>💥 핵심:</strong> {isAldrachi ? '전투의 전율 10초 + 정수 파쇄 4초 = 116% 효과적 피해 증가!' : '악마쇄도 모두 소비 후 정수 파쇄 → 비동기화 규칙!'}
        </p>
      </div>
      <p className="text-xs mt-3 text-center" style={{ color: THEME.text.muted }}>호버하면 확대됩니다 | 빨간 구간이 극딜 타이밍</p>
    </div>
  );
};

// 🔗 프록 시스템 다이어그램 - 21st.dev Pulse Beams 패턴 적용 (v8.2)
const ProcSystemDiagram = ({ heroSpec }) => {
  const isAldrachi = heroSpec === 'aldrachi';
  const color = isAldrachi ? THEME.aldrachi : THEME.felScarred;
  const heroProcs = isAldrachi ? PROC_CHAINS.aldrachi : PROC_CHAINS.felscarred;
  const allProcs = [...PROC_CHAINS.common, ...heroProcs];
  
  const typeColors = {
    guaranteed: { start: '#22c55e', middle: '#4ade80', end: '#86efac' },
    'buff-consume': { start: '#eab308', middle: '#facc15', end: '#fde047' },
    fury: { start: '#3b82f6', middle: '#60a5fa', end: '#93c5fd' },
    chance: { start: '#ef4444', middle: '#f87171', end: '#fca5a5' },
  };
  const typeLabels = { guaranteed: '확정', 'buff-consume': '버프 소모', fury: '분노 기반', chance: '확률' };
  
  // Animated Beam 컴포넌트 (Pulse Beams 패턴)
  const AnimatedBeam = ({ type, critical, delay = 0, chancePercent }) => {
    const colors = typeColors[type] || typeColors.guaranteed;
    const gradientId = `beam-gradient-${type}-${delay}`;
    
    return (
      <div className="relative flex items-center justify-center" style={{ width: 120, height: 24 }}>
        <svg width="120" height="24" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* 배경 라인 */}
          <path d="M0 12 L100 12" stroke={THEME.bg.highlight} strokeWidth="2" strokeLinecap="round" />
          
          {/* 애니메이션 빔 */}
          <motion.path
            d="M0 12 L100 12"
            stroke={`url(#${gradientId})`}
            strokeWidth={critical ? "4" : "3"}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: delay * 0.1, ease: "easeOut" }}
          />
          
          {/* 화살표 끝 */}
          <motion.polygon
            points="100,12 110,6 110,18"
            fill={colors.middle}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: delay * 0.1 + 0.5 }}
          />
          
          {/* 그라데이션 정의 */}
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
        
        {/* 확률 표시 */}
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
  
  // 노드 컴포넌트 (스킬 아이콘 + 원형 배경)
  const SkillNode = ({ skill, isResult, critical, color: nodeColor, delay = 0 }) => {
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
      <h4 className="font-bold mb-4" style={{ color }}>⚡ 프록 시스템 다이어그램 ({isAldrachi ? '알드라치' : '지옥상흔'})</h4>
      
      {/* 범례 */}
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
      
      {/* 프록 연쇄 리스트 */}
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
            {/* 트리거 노드 */}
            <SkillNode skill={proc.trigger} critical={proc.critical} color={color} delay={idx} />
            
            {/* 애니메이션 빔 */}
            <AnimatedBeam type={proc.type} critical={proc.critical} delay={idx} chancePercent={proc.chancePercent} />
            
            {/* 결과 노드 */}
            <SkillNode skill={proc.result} isResult critical={proc.critical} color={typeColors[proc.type]?.middle || color} delay={idx} />
            
            {/* 설명 */}
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
      
      {/* 핵심 연쇄 요약 */}
      <motion.div
        className="mt-4 p-3 rounded-lg"
        style={{ backgroundColor: color + '15', border: `1px solid ${color}40` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-sm font-bold mb-2" style={{ color }}>🔗 {isAldrachi ? '알드라치' : '지옥상흔'} 핵심 연쇄:</p>
        <p className="text-sm flex flex-wrap items-center gap-1" style={{ color: THEME.text.secondary }}>
          {isAldrachi ? (
            <><InlineSpell spell={SKILL_DB.theHunt} /> → <InlineSpell spell={SKILL_DB.reaversGlaive} /> → 버프 → <InlineSpell spell={SKILL_DB.chaosStrike} /> (징표) → <InlineSpell spell={SKILL_DB.bladeDance} /> 두 번째 (12회 베기!)</>
          ) : (
            <><InlineSpell spell={SKILL_DB.eyeBeam} /> → <InlineSpell spell={SKILL_DB.demonsurge} /> 2충전 → <InlineSpell spell={SKILL_DB.metamorphosis} /> → 5충전 → 강화 능력 소비 → <InlineSpell spell={SKILL_DB.essenceBreak} /></>
          )}
        </p>
      </motion.div>
      
      <p className="text-xs mt-3 text-center" style={{ color: THEME.text.muted }}>호버하면 Wowhead 툴팁 | ⭐ = DPS 영향 큼 | 빔 애니메이션 = 프록 타입</p>
    </div>
  );
};

// 🎯 프록 상세 카드 (v8.2)
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

const OpenerTable = ({ data, title, color }) => (
  <div className="rounded-xl overflow-hidden mb-6" style={{ backgroundColor: THEME.bg.card, border: `1px solid ${color}40` }}>
    <div className="px-4 py-3" style={{ backgroundColor: color + '20' }}>
      <h4 className="font-bold" style={{ color }}>{title} - 상세 테이블</h4>
    </div>
    <table className="w-full">
      <thead>
        <tr style={{ backgroundColor: THEME.bg.secondary }}>
          <th className="px-3 py-2 text-left text-sm w-12" style={{ color }}>#</th>
          <th className="px-3 py-2 text-left text-sm w-16" style={{ color }}>타이밍</th>
          <th className="px-3 py-2 text-left text-sm" style={{ color: THEME.text.primary }}>스킬</th>
          <th className="px-3 py-2 text-left text-sm" style={{ color: THEME.text.primary }}>설명</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, i) => (
          <tr key={i} className="border-t" style={{ borderColor: color + '20', backgroundColor: item.highlight ? color + '15' : 'transparent' }}>
            <td className="px-3 py-2 text-sm font-mono" style={{ color: THEME.text.muted }}>{item.step}</td>
            <td className="px-3 py-2 text-sm font-mono" style={{ color: item.highlight ? color : THEME.text.muted }}>{item.timing}</td>
            <td className="px-3 py-2">
              <div className="flex items-center gap-2">
                {item.skill && <SkillIcon skill={item.skill} />}
                <span className="text-sm" style={{ color: item.highlight ? color : THEME.text.primary }}>{item.skill?.name || '-'}</span>
              </div>
            </td>
            <td className="px-3 py-2 text-sm" style={{ color: item.highlight ? color : THEME.text.secondary }}>{item.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// 📦 챕터 정의
// ═══════════════════════════════════════════════════════════════════════════
// 챕터 정의 (heroSpec에 따라 동적 레이블)
const getChapters = (heroSpec) => [
  { id: 'ch1', num: 1, label: '메타 분석', icon: '📊' },
  { id: 'ch2', num: 2, label: '티어 세트', icon: '🛡️' },
  { id: 'ch3', num: 3, label: heroSpec === 'aldrachi' ? '알드라치' : '지옥상흔', icon: heroSpec === 'aldrachi' ? '🗡️' : '😈' },
  { id: 'ch4', num: 4, label: heroSpec === 'aldrachi' ? '지옥상흔 요약' : '알드라치 요약', icon: heroSpec === 'aldrachi' ? '😈' : '🗡️' },
  { id: 'ch5', num: 5, label: '공통 메커니즘', icon: '⚙️' },
  { id: 'ch6', num: 6, label: '콘텐츠별', icon: '🎮' },
  { id: 'ch7', num: 7, label: '고급 최적화', icon: '🚀' },
  { id: 'ch8', num: 8, label: '흔한 실수', icon: '⚠️' },
  { id: 'ch9', num: 9, label: '요약', icon: '📝' },
];

// 기본값 (관찰자용)
const CHAPTERS = getChapters('aldrachi');

// ═══════════════════════════════════════════════════════════════════════════
// 📦 메인 가이드 컴포넌트
// ═══════════════════════════════════════════════════════════════════════════
export default function HavocDemonHunterGuide() {
  const [heroSpec, setHeroSpec] = useState('aldrachi');
  const [activeChapter, setActiveChapter] = useState('ch1');
  
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
  
  const currentColor = heroSpec === 'aldrachi' ? THEME.aldrachi : THEME.felScarred;
  
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: THEME.bg.primary }}>
      
      {/* 왼쪽 사이드바 - fixed 위치, 상단바 아래 */}
      <aside className="hidden lg:block fixed top-20 left-0 w-64 z-50" style={{ height: 'calc(100vh - 80px)' }}>
        <nav className="h-full overflow-y-auto p-4" style={{ backgroundColor: THEME.bg.secondary }}>
          
          <div className="mb-6">
            <p className="text-xs mb-2" style={{ color: THEME.text.muted }}>영웅 특성</p>
            <div className="flex flex-col gap-1">
              <button onClick={() => setHeroSpec('aldrachi')} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
                style={{ backgroundColor: heroSpec === 'aldrachi' ? THEME.aldrachi + '30' : 'transparent', color: heroSpec === 'aldrachi' ? THEME.aldrachi : THEME.text.secondary, border: heroSpec === 'aldrachi' ? `1px solid ${THEME.aldrachi}` : '1px solid transparent' }}>
                🗡️ 알드라치 파괴자
              </button>
              <button onClick={() => setHeroSpec('felscarred')} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
                style={{ backgroundColor: heroSpec === 'felscarred' ? THEME.felScarred + '30' : 'transparent', color: heroSpec === 'felscarred' ? THEME.felScarred : THEME.text.secondary, border: heroSpec === 'felscarred' ? `1px solid ${THEME.felScarred}` : '1px solid transparent' }}>
                😈 지옥상흔
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
            <p className="text-xs" style={{ color: THEME.text.muted }}>패치 11.2.5 | v8.3</p>
            <p className="text-xs" style={{ color: THEME.text.muted }}>검증: 2025-12-02</p>
          </div>
        </nav>
      </aside>
      
      {/* 메인 콘텐츠 */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-8 lg:ml-64">
        
        {/* 헤더 - 본문 최상단 */}
        <header className="mb-8 pb-4" style={{ borderBottom: `1px solid ${THEME.primary}30` }}>
          <div className="flex items-center gap-3 mb-4">
            <SkillIcon skill={SKILL_DB.metamorphosis} size="large" showTooltip={false} />
            <div>
              <h1 className="text-2xl font-bold" style={{ color: THEME.primary }}>파멸 악마사냥꾼</h1>
              <p className="text-sm" style={{ color: THEME.text.muted }}>TWW 시즌 3 • v8.3</p>
            </div>
          </div>
          <div className="flex gap-2 lg:hidden">
            <button onClick={() => setHeroSpec('aldrachi')} className="flex-1 py-2 rounded-lg text-sm"
              style={{ backgroundColor: heroSpec === 'aldrachi' ? THEME.aldrachi : THEME.bg.card, color: heroSpec === 'aldrachi' ? '#fff' : THEME.text.secondary }}>
              🗡️ 알드라치
            </button>
            <button onClick={() => setHeroSpec('felscarred')} className="flex-1 py-2 rounded-lg text-sm"
              style={{ backgroundColor: heroSpec === 'felscarred' ? THEME.felScarred : THEME.bg.card, color: heroSpec === 'felscarred' ? '#fff' : THEME.text.secondary }}>
              😈 지옥상흔
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
                쐐기돌 <strong style={{ color: THEME.success }}>S티어</strong>, 레이드 <strong style={{ color: THEME.warning }}>A티어</strong>.
              </p>
              <p className="text-sm" style={{ color: THEME.text.secondary }}>
                알드라치 파괴자 사용률 <strong style={{ color: THEME.aldrachi }}>87.7%</strong> (Archon.gg)
              </p>
            </div>
            
            <div className="p-5 rounded-xl" style={{ backgroundColor: THEME.bg.card, border: `1px solid ${THEME.info}40` }}>
              <h3 className="font-bold mb-3" style={{ color: THEME.info }}>🏆 핵심 강점</h3>
              <p className="text-sm" style={{ color: THEME.text.secondary }}>
                정수 파쇄 4초 극딜 (DPS 60%+), 최고 기동성, 혼돈의 낙인 5%↑, 깔때기 딜
              </p>
            </div>
          </div>
          
          <div className="p-5 rounded-xl" style={{ backgroundColor: THEME.danger + '10', border: `1px solid ${THEME.danger}40` }}>
            <h3 className="font-bold mb-3" style={{ color: THEME.danger }}>⚠️ 핵심 약점</h3>
            <p className="text-sm" style={{ color: THEME.text.secondary }}>
              순수 ST 약세, 높은 숙련도 요구, 정수 파쇄 의존도
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
            <div className="p-5 rounded-xl" style={{ backgroundColor: THEME.bg.card, border: `1px solid ${THEME.aldrachi}40` }}>
              <h3 className="font-bold mb-3" style={{ color: THEME.aldrachi }}>🗡️ 알드라치</h3>
              <p className="text-sm mb-2" style={{ color: THEME.text.secondary }}><strong>2세트:</strong> 파괴자의 글레이브 60%↑, 물리 30%↑</p>
              <p className="text-sm" style={{ color: THEME.text.secondary }}><strong>4세트:</strong> 알드라치의 격노 12회 베기</p>
            </div>
            
            <div className="p-5 rounded-xl" style={{ backgroundColor: THEME.bg.card, border: `1px solid ${THEME.felScarred}40` }}>
              <h3 className="font-bold mb-3" style={{ color: THEME.felScarred }}>😈 지옥상흔</h3>
              <p className="text-sm mb-2" style={{ color: THEME.text.secondary }}><strong>2세트:</strong> 제물 30%↑, 혼일 20%↑</p>
              <p className="text-sm" style={{ color: THEME.text.secondary }}><strong>4세트:</strong> 탈태 시 10초간 피해 20%↑</p>
            </div>
          </div>
        </section>

        {/* 제3장: 영웅특성 가이드 (heroSpec에 따라 표시) */}
        <section id="ch3" className="mb-16 scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: currentColor + '30', color: currentColor }}>제3장</span>
            <h2 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>
              {heroSpec === 'aldrachi' ? '🗡️ 알드라치 파괴자' : '😈 지옥상흔'}
            </h2>
          </div>
          
          {heroSpec === 'aldrachi' ? (
            <>
              <MathBox 
                title="전투의 전율 + 정수 파쇄 시너지"
                formula="(1 + 0.8) × (1 + 0.2) - 1"
                result="116% 피해 증가"
                color={THEME.aldrachi}
              />
              
              <WarningBox title="단일 대상 핵심 규칙" color={THEME.aldrachi}>
                <strong>항상 혼돈의 일격 먼저 → 칼춤 두 번째!</strong> 12회 베기 발동.
              </WarningBox>
              
              <h3 className="font-bold mb-4 mt-8" style={{ color: THEME.aldrachi }}>🎯 단일 대상 (ST)</h3>
              <OpenerFlowchart data={ALDRACHI_OPENER} color={THEME.aldrachi} title="알드라치 ST 오프너" />
              <PriorityFlowchart color={THEME.aldrachi} heroSpec="aldrachi" />
              <PriorityTable data={ALDRACHI_ST_PRIORITY} title="알드라치 ST 우선순위" color={THEME.aldrachi} />
              
              <h3 className="font-bold mb-4 mt-8" style={{ color: THEME.aldrachi }}>💥 광역 (AOE)</h3>
              <InfoBox title="알드라치 광딜 핵심" color={THEME.aldrachi} icon="💡">
                안광과 칼춤/죽휩이 핵심. 12회 베기를 다수에게 적중시키면 폭발적 피해!
              </InfoBox>
              <OpenerFlowchart data={ALDRACHI_AOE_OPENER} color={THEME.aldrachi} title="알드라치 AOE 오프너" />
              <PriorityTable data={ALDRACHI_AOE_PRIORITY} title="알드라치 AOE 우선순위" color={THEME.aldrachi} />
            </>
          ) : (
            <>
              <InfoBox title="비동기화 규칙" color={THEME.felScarred} icon="⏰">
                악마쇄도 충전을 모두 소비한 후 정수 파쇄 사용!
              </InfoBox>
              
              <ChecklistBox 
                title="5중첩 방지"
                items={["전투 중 제물 2충전 두지 않기", "탈태 전 0충전 + 쿨다운"]}
                color={THEME.warning}
              />
              
              <h3 className="font-bold mb-4 mt-8" style={{ color: THEME.felScarred }}>🎯 단일 대상 (ST)</h3>
              <OpenerFlowchart data={FELSCARRED_OPENER} color={THEME.felScarred} title="지옥상흔 ST 오프너" />
              <PriorityFlowchart color={THEME.felScarred} heroSpec="felscarred" />
              <PriorityTable data={FELSCARRED_ST_PRIORITY} title="지옥상흔 ST 우선순위" color={THEME.felScarred} />
              
              <h3 className="font-bold mb-4 mt-8" style={{ color: THEME.felScarred }}>💥 광역 (AOE)</h3>
              <InfoBox title="지옥상흔 광딜 핵심" color={THEME.felScarred} icon="💡">
                안광으로 악마쇄도 2충전 확보 후 강화 능력 발사. 제물의 오라와 소멸의 불길이 광딜 핵심!
              </InfoBox>
              <OpenerFlowchart data={FELSCARRED_AOE_OPENER} color={THEME.felScarred} title="지옥상흔 AOE 오프너" />
              <PriorityTable data={FELSCARRED_AOE_PRIORITY} title="지옥상흔 AOE 우선순위" color={THEME.felScarred} />
            </>
          )}
        </section>

        {/* 제4장: 다른 영웅특성 요약 */}
        <section id="ch4" className="mb-16 scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: (heroSpec === 'aldrachi' ? THEME.felScarred : THEME.aldrachi) + '30', color: heroSpec === 'aldrachi' ? THEME.felScarred : THEME.aldrachi }}>제4장</span>
            <h2 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>
              {heroSpec === 'aldrachi' ? '😈 지옥상흔 (요약)' : '🗡️ 알드라치 파괴자 (요약)'}
            </h2>
          </div>
          
          {heroSpec === 'aldrachi' ? (
            <div className="p-5 rounded-xl" style={{ backgroundColor: THEME.felScarred + '10', border: `1px solid ${THEME.felScarred}40` }}>
              <p className="text-sm mb-4" style={{ color: THEME.text.secondary }}>
                지옥상흔은 <strong style={{ color: THEME.felScarred }}>악마쇄도</strong> 시스템으로 강화 능력을 사용합니다. 순수 ST에서 약간 우위지만, 쐐기돌 광딜에서는 알드라치가 더 강력합니다.
              </p>
              <button onClick={() => setHeroSpec('felscarred')} className="px-4 py-2 rounded-lg text-sm font-bold"
                style={{ backgroundColor: THEME.felScarred, color: '#fff' }}>
                😈 지옥상흔 가이드 보기
              </button>
            </div>
          ) : (
            <div className="p-5 rounded-xl" style={{ backgroundColor: THEME.aldrachi + '10', border: `1px solid ${THEME.aldrachi}40` }}>
              <p className="text-sm mb-4" style={{ color: THEME.text.secondary }}>
                알드라치는 <strong style={{ color: THEME.aldrachi }}>파괴자의 글레이브</strong>와 12회 베기로 폭발적 피해를 냅니다. 쐐기돌 사용률 87.7%로 현재 메타 최강입니다.
              </p>
              <button onClick={() => setHeroSpec('aldrachi')} className="px-4 py-2 rounded-lg text-sm font-bold"
                style={{ backgroundColor: THEME.aldrachi, color: '#fff' }}>
                🗡️ 알드라치 가이드 보기
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
          
          {/* 프록 시스템 다이어그램 (v8.2 신규) */}
          <ProcSystemDiagram heroSpec={heroSpec} />
          
          {/* 프록 상세 설명 */}
          <div className="mb-6">
            <h3 className="font-bold mb-4" style={{ color: currentColor }}>⚡ {heroSpec === 'aldrachi' ? '알드라치' : '지옥상흔'} 핵심 프록</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {(heroSpec === 'aldrachi' ? PROC_CHAINS.aldrachi : PROC_CHAINS.felscarred).filter(p => p.critical).map(proc => (
                <ProcDetailCard key={proc.id} proc={proc} color={currentColor} />
              ))}
            </div>
          </div>
          
          <InfoBox title="공통 핵심 프록" color={THEME.primary} icon="🔗">
            <div className="space-y-2">
              <p><InlineSpell spell={SKILL_DB.eyeBeam} /> → 악마화 5초 + <InlineSpell spell={SKILL_DB.cycleOfHatred} /> (분노 40당 탈태 3초↓)</p>
              <p><InlineSpell spell={SKILL_DB.metamorphosis} /> → <InlineSpell spell={SKILL_DB.chaoticTransformation} /> (안광/칼춤 리셋)</p>
              <p><InlineSpell spell={SKILL_DB.vengefulRetreat} /> → <InlineSpell spell={SKILL_DB.initiative} /> (치명타 10%↑ 12초)</p>
            </div>
          </InfoBox>
          
          <BurstSequenceDiagram color={currentColor} heroSpec={heroSpec} />
          
          <ChecklistBox 
            title="정수 파쇄 필수 조건"
            items={["탈태 상태", "선제공격 버프 활성화", "분노 60-80 확보"]}
            color={THEME.accent}
          />
        </section>

        {/* 제6장: 콘텐츠별 */}
        <section id="ch6" className="mb-16 scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: THEME.primary + '30', color: THEME.primary }}>제6장</span>
            <h2 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>콘텐츠별 전략</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl" style={{ backgroundColor: THEME.bg.card, border: `1px solid ${THEME.success}40` }}>
              <h3 className="font-bold mb-3" style={{ color: THEME.success }}>🔑 쐐기돌 (S티어)</h3>
              <p className="text-sm" style={{ color: THEME.text.secondary }}>알드라치 87.7% - 깔때기 딜의 정점</p>
            </div>
            <div className="p-5 rounded-xl" style={{ backgroundColor: THEME.bg.card, border: `1px solid ${THEME.warning}40` }}>
              <h3 className="font-bold mb-3" style={{ color: THEME.warning }}>⚔️ 레이드 (A티어)</h3>
              <p className="text-sm" style={{ color: THEME.text.secondary }}>깔때기 → 알드라치, 순수 ST → 지옥상흔</p>
            </div>
          </div>
        </section>

        {/* 제7장: 고급 최적화 */}
        <section id="ch7" className="mb-16 scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: THEME.primary + '30', color: THEME.primary }}>제7장</span>
            <h2 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>고급 최적화</h2>
          </div>
          
          <MathBox 
            title="정수 파쇄 타이밍 분노 계산"
            formula="죽휩(35) + 파멸(40) + 죽휩(35) + 파멸(40)"
            result="150분노 필요"
            explanation="혼돈의 변형으로 죽휩 리셋 → 4초 내 죽휩 2회 가능"
            color={THEME.info}
          />
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
          
          {heroSpec === 'aldrachi' ? (
            <div className="p-5 rounded-xl" style={{ backgroundColor: THEME.aldrachi + '10', border: `1px solid ${THEME.aldrachi}40` }}>
              <h3 className="font-bold mb-4" style={{ color: THEME.aldrachi }}>🗡️ 알드라치 핵심 5가지</h3>
              <ol className="space-y-2 text-sm" style={{ color: THEME.text.secondary }}>
                <li>1. 파괴자의 글레이브 발동 즉시 사용</li>
                <li>2. 혼일 먼저 → 칼춤 두 번째 (12회 베기)</li>
                <li>3. 전투의 전율 + 정수 파쇄 = 116% 피해</li>
                <li>4. 90 분노 상한 엄수</li>
                <li>5. 파괴자의 징표 유지</li>
              </ol>
            </div>
          ) : (
            <div className="p-5 rounded-xl" style={{ backgroundColor: THEME.felScarred + '10', border: `1px solid ${THEME.felScarred}40` }}>
              <h3 className="font-bold mb-4" style={{ color: THEME.felScarred }}>😈 지옥상흔 핵심 5가지</h3>
              <ol className="space-y-2 text-sm" style={{ color: THEME.text.secondary }}>
                <li>1. 탈태 전 제물 0충전 + 쿨다운</li>
                <li>2. 악마쇄도 전부 소비 후 다음 형상</li>
                <li>3. 정수 파쇄 지연 사용 (비동기화)</li>
                <li>4. 120 분노 상한 활용</li>
                <li>5. 불꽃의 인장 안광 10초 전</li>
              </ol>
            </div>
          )}
        </section>

        {/* 푸터 */}
        <footer className="pt-8 mt-12 border-t" style={{ borderColor: THEME.primary + '30' }}>
          <p className="text-xs" style={{ color: THEME.text.muted }}>
            데이터: Icy Veins, Method, Wowhead, Archon.gg, Discord Fel Hammer (Voodoo/FRUG)
          </p>
          <p className="text-xs" style={{ color: THEME.text.muted }}>
            패치 11.2.5 | v8.3 | 검증: 2025-12-02
          </p>
        </footer>
        
      </main>
    </div>
  );
}
