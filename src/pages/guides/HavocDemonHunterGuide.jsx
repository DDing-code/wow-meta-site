/**
 * 파멸 악마사냥꾼 종합 가이드 v1.0
 * 
 * 데이터 출처:
 * - KB: WoW-Meta-Knowledge/01-ATOMIC/Skills/DemonHunter/
 * - KB: WoW-Meta-Knowledge/03-PRIORITY/DemonHunter/Havoc/
 * - Magic MCP: Dark Grid, Priority Selector 스타일 참조
 * 
 * 용어 규칙: TERMINOLOGY_GUIDE.md 준수
 * - 버스트 → 극딜
 * - 윈도우 → 타이밍
 * - 광역 → 광딜
 * - 퍼널 → 깔때기 딜
 * 
 * 출처: Voodoo (FRUG), Discord Fel Hammer
 * 패치: 11.2.5
 * 최종 검증: 2025-12-01
 */

import React, { useState } from 'react';

// =====================================
// 📊 KB 기반 스킬 데이터
// =====================================
const SKILLS = {
  essenceBreak: {
    id: "258860",
    name_kr: "정수 파쇄",
    name_en: "Essence Break",
    icon: "spell_shadow_ritualofsacrifice",
    cooldown: "40초",
    resource: "없음",
    effect: "4초간 혼돈 피해 80% 증가",
    priority: 1,
    tags: ["core", "burst", "amplifier"]
  },
  bladeDance: {
    id: "188499",
    name_kr: "칼춤",
    name_en: "Blade Dance",
    icon: "ability_demonhunter_bladedance",
    cooldown: "9초",
    resource: "35 분노",
    effect: "광역 물리 피해",
    priority: 2,
    tags: ["spender", "aoe"]
  },
  eyeBeam: {
    id: "198013",
    name_kr: "안광",
    name_en: "Eye Beam",
    icon: "ability_demonhunter_eyebeam",
    cooldown: "40초",
    resource: "30 분노",
    effect: "전방 광역 혼돈 피해 + 악마화",
    priority: 1,
    tags: ["cooldown", "channel", "aoe"]
  },
  chaosStrike: {
    id: "162794",
    name_kr: "혼돈의 일격",
    name_en: "Chaos Strike",
    icon: "ability_demonhunter_chaosstrike",
    cooldown: "없음",
    resource: "40 분노",
    effect: "단일 대상 혼돈 피해",
    priority: 3,
    tags: ["spender", "core"]
  },
  metamorphosis: {
    id: "191427",
    name_kr: "탈태",
    name_en: "Metamorphosis",
    icon: "ability_demonhunter_metamorphasisdps",
    cooldown: "3분",
    resource: "없음",
    effect: "변신 + 스킬 강화",
    priority: 1,
    tags: ["cooldown", "burst", "transformation"]
  },
  reaversGlaive: {
    id: "442294",
    name_kr: "파괴자의 글레이브",
    name_en: "Reaver's Glaive",
    icon: "inv_ability_aldrachireaverdemonhunter_reaversglaive",
    cooldown: "9초 (2충전)",
    resource: "없음",
    effect: "전투의 전율 + 파괴자의 징표 적용",
    priority: 1,
    tags: ["aldrachi", "hero-talent", "buff"]
  },
  thrillOfTheFight: {
    id: "442688",
    name_kr: "전투의 전율",
    name_en: "Thrill of the Fight",
    icon: "spell_mage_overpowered",
    duration: "10초",
    effect: "15% 피해 증가",
    tags: ["aldrachi", "buff", "passive"]
  },
  felBlade: {
    id: "232893",
    name_kr: "지옥칼",
    name_en: "Fel Blade",
    icon: "ability_demonhunter_felblade",
    cooldown: "15초",
    resource: "+40 분노",
    effect: "분노 생성 + 돌진",
    priority: 4,
    tags: ["builder", "gap-closer"]
  },
  immolationAura: {
    id: "258920",
    name_kr: "제물의 오라",
    name_en: "Immolation Aura",
    icon: "ability_demonhunter_immolation",
    cooldown: "30초",
    resource: "+8 분노/초",
    effect: "주변 화염 피해",
    priority: 5,
    tags: ["builder", "aoe", "dot"]
  },
  theHunt: {
    id: "323639",
    name_kr: "사냥",
    name_en: "The Hunt",
    icon: "ability_ardenweald_druid_thorns",
    cooldown: "90초",
    resource: "+50 분노",
    effect: "돌진 + 큰 피해 + 분노 생성",
    priority: 2,
    tags: ["cooldown", "gap-closer"]
  }
};

// =====================================
// 🎨 디자인 시스템 (Magic MCP Dark Grid 참조)
// =====================================
const THEME = {
  primary: '#A330C9',
  secondary: '#6B1D84',
  accent: '#FF6B6B',
  background: {
    primary: '#0D0D14',
    secondary: '#1A1A2E',
    card: '#1E1E32'
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B8B8D0',
    muted: '#6B7280'
  }
};

// =====================================
// 📦 컴포넌트: 스킬 카드
// =====================================
const SkillCard = ({ skill, showPriority = false }) => {
  const iconUrl = `https://wow.zamimg.com/images/wow/icons/large/${skill.icon}.jpg`;
  
  return (
    <div 
      className="group relative overflow-visible rounded-xl p-4 transition-all duration-300 hover:-translate-y-1"
      style={{
        backgroundColor: THEME.background.card,
        border: `1px solid ${THEME.primary}40`,
      }}
    >
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ boxShadow: `0 0 20px ${THEME.primary}30` }}
      />
      
      <div className="pointer-events-none absolute inset-0 hidden group-hover:block">
        <div className="absolute -left-1 -top-1 h-2 w-2" style={{ backgroundColor: THEME.primary }} />
        <div className="absolute -right-1 -top-1 h-2 w-2" style={{ backgroundColor: THEME.primary }} />
        <div className="absolute -left-1 -bottom-1 h-2 w-2" style={{ backgroundColor: THEME.primary }} />
        <div className="absolute -right-1 -bottom-1 h-2 w-2" style={{ backgroundColor: THEME.primary }} />
      </div>
      
      <div className="relative z-10 flex items-start gap-4">
        <div 
          className="shrink-0 rounded-lg overflow-hidden"
          style={{ 
            border: `2px solid ${THEME.primary}`,
            boxShadow: `0 0 10px ${THEME.primary}40`
          }}
        >
          <img 
            src={iconUrl} 
            alt={skill.name_kr}
            className="w-12 h-12"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold" style={{ color: THEME.text.primary }}>
              {skill.name_kr}
            </h3>
            {showPriority && skill.priority && (
              <span 
                className="px-2 py-0.5 text-xs font-bold rounded"
                style={{ backgroundColor: THEME.primary, color: THEME.text.primary }}
              >
                #{skill.priority}
              </span>
            )}
          </div>
          <p className="text-sm mb-2" style={{ color: THEME.text.secondary }}>
            {skill.name_en}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-2">
            {skill.cooldown && skill.cooldown !== "없음" && (
              <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#2D2D4A', color: THEME.text.muted }}>
                ⏱️ {skill.cooldown}
              </span>
            )}
            {skill.resource && skill.resource !== "없음" && (
              <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#2D2D4A', color: THEME.text.muted }}>
                ⚡ {skill.resource}
              </span>
            )}
          </div>
          
          <p className="text-sm" style={{ color: THEME.text.secondary }}>
            {skill.effect}
          </p>
        </div>
      </div>
    </div>
  );
};

// =====================================
// 📦 컴포넌트: 우선순위 테이블
// =====================================
const PriorityTable = ({ priorities }) => {
  return (
    <div 
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: THEME.background.card, border: `1px solid ${THEME.primary}40` }}
    >
      <table className="w-full">
        <thead>
          <tr style={{ backgroundColor: THEME.primary + '20' }}>
            <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: THEME.primary }}>#</th>
            <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: THEME.text.primary }}>스킬</th>
            <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: THEME.text.primary }}>조건</th>
            <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: THEME.text.primary }}>이유</th>
          </tr>
        </thead>
        <tbody>
          {priorities.map((item, index) => (
            <tr 
              key={index}
              className="border-t transition-colors hover:bg-white/5"
              style={{ borderColor: THEME.primary + '20' }}
            >
              <td className="px-4 py-3">
                <span 
                  className="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold"
                  style={{ 
                    backgroundColor: index < 3 ? THEME.primary : THEME.background.secondary,
                    color: THEME.text.primary
                  }}
                >
                  {index + 1}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <img 
                    src={`https://wow.zamimg.com/images/wow/icons/small/${item.icon}.jpg`}
                    alt={item.skill}
                    className="w-6 h-6 rounded"
                  />
                  <span style={{ color: THEME.text.primary }}>{item.skill}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm" style={{ color: THEME.text.secondary }}>
                {item.condition || "-"}
              </td>
              <td className="px-4 py-3 text-sm" style={{ color: THEME.text.muted }}>
                {item.reason}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// =====================================
// 📦 컴포넌트: 정수 파쇄 타이밍 콤보
// =====================================
const EssenceBreakWindow = () => {
  const sequence = [
    { skill: "파괴자의 글레이브", icon: "inv_ability_aldrachireaverdemonhunter_reaversglaive", note: "충전 있으면" },
    { skill: "혼돈의 일격", icon: "ability_demonhunter_chaosstrike", note: "안광 쿨 대기" },
    { skill: "복수의 퇴각 + 안광", icon: "ability_demonhunter_eyebeam", note: "동시 사용" },
    { skill: "지옥칼", icon: "ability_demonhunter_felblade", note: "타성 없을 때" },
    { skill: "정수 파쇄", icon: "spell_shadow_ritualofsacrifice", note: "⭐ 타이밍 시작" },
    { skill: "죽음의 휩쓸기", icon: "ability_demonhunter_deathsweep", note: "" },
    { skill: "칼춤", icon: "ability_demonhunter_bladedance", note: "" },
    { skill: "칼춤", icon: "ability_demonhunter_bladedance", note: "2회 필수" },
  ];
  
  return (
    <div 
      className="rounded-xl p-6"
      style={{ backgroundColor: THEME.background.card, border: `1px solid ${THEME.primary}40` }}
    >
      <h3 className="text-xl font-bold mb-4" style={{ color: THEME.primary }}>
        ⚡ 정수 파쇄 타이밍 콤보 (4초)
      </h3>
      
      <div className="flex flex-wrap gap-2 items-center">
        {sequence.map((item, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div 
                className="relative rounded-lg overflow-hidden mb-1"
                style={{ 
                  border: item.skill === "정수 파쇄" ? `3px solid ${THEME.accent}` : `2px solid ${THEME.primary}60`,
                  boxShadow: item.skill === "정수 파쇄" ? `0 0 15px ${THEME.accent}50` : 'none'
                }}
              >
                <img 
                  src={`https://wow.zamimg.com/images/wow/icons/medium/${item.icon}.jpg`}
                  alt={item.skill}
                  className="w-10 h-10"
                />
              </div>
              <span className="text-xs text-center max-w-16" style={{ color: THEME.text.secondary }}>
                {item.skill}
              </span>
              {item.note && (
                <span className="text-xs mt-1" style={{ color: THEME.text.muted }}>
                  {item.note}
                </span>
              )}
            </div>
            {index < sequence.length - 1 && (
              <span className="text-xl" style={{ color: THEME.primary }}>→</span>
            )}
          </React.Fragment>
        ))}
      </div>
      
      <div 
        className="mt-4 p-3 rounded-lg"
        style={{ backgroundColor: THEME.accent + '20', border: `1px solid ${THEME.accent}40` }}
      >
        <p className="text-sm" style={{ color: THEME.accent }}>
          ⚠️ 주의: 4초밖에 없음! 타이밍 전 분노 40 이상 확보 필수
        </p>
      </div>
    </div>
  );
};

// =====================================
// 📦 컴포넌트: 영웅 특성 비교
// =====================================
const HeroTalentComparison = () => {
  const heroSpecs = [
    {
      name: "알드라치 파괴자",
      name_en: "Aldrachi Reaver",
      icon: "inv_ability_aldrachireaverdemonhunter_reaversglaive",
      color: THEME.primary,
      pros: ["안정적인 DPS", "쉬운 플레이", "ST/클리브 강함"],
      cons: ["광딜 약함", "기동성 낮음"],
      recommended: ["레이드 ST", "M+ 저쐐기"],
      keyMechanic: "파괴자의 글레이브로 전투의 전율(15%) 업타임 유지"
    },
    {
      name: "지옥상흔",
      name_en: "Fel-Scarred",
      icon: "ability_demonhunter_metamorphasisdps",
      color: "#FF6B6B",
      pros: ["높은 극딜", "광딜 강함", "탈태 연장"],
      cons: ["복잡한 플레이", "극딜 의존"],
      recommended: ["레이드 광딜", "M+ 고쐐기"],
      keyMechanic: "악마쇄도 스택으로 탈태 극딜 극대화"
    }
  ];
  
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {heroSpecs.map((spec, index) => (
        <div 
          key={index}
          className="rounded-xl p-6 transition-all hover:-translate-y-1"
          style={{ backgroundColor: THEME.background.card, border: `1px solid ${spec.color}40` }}
        >
          <div className="flex items-center gap-3 mb-4">
            <img 
              src={`https://wow.zamimg.com/images/wow/icons/large/${spec.icon}.jpg`}
              alt={spec.name}
              className="w-12 h-12 rounded-lg"
              style={{ border: `2px solid ${spec.color}` }}
            />
            <div>
              <h3 className="text-xl font-bold" style={{ color: spec.color }}>{spec.name}</h3>
              <p className="text-sm" style={{ color: THEME.text.muted }}>{spec.name_en}</p>
            </div>
          </div>
          
          <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: spec.color + '15' }}>
            <p className="text-sm" style={{ color: THEME.text.secondary }}>
              💡 {spec.keyMechanic}
            </p>
          </div>
          
          <div className="mb-3">
            <h4 className="text-sm font-semibold mb-2" style={{ color: '#4ADE80' }}>✅ 강점</h4>
            <ul className="space-y-1">
              {spec.pros.map((pro, i) => (
                <li key={i} className="text-sm" style={{ color: THEME.text.secondary }}>• {pro}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-3">
            <h4 className="text-sm font-semibold mb-2" style={{ color: THEME.accent }}>❌ 약점</h4>
            <ul className="space-y-1">
              {spec.cons.map((con, i) => (
                <li key={i} className="text-sm" style={{ color: THEME.text.secondary }}>• {con}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-2" style={{ color: THEME.primary }}>🎯 추천 콘텐츠</h4>
            <div className="flex flex-wrap gap-2">
              {spec.recommended.map((rec, i) => (
                <span 
                  key={i}
                  className="text-xs px-2 py-1 rounded"
                  style={{ backgroundColor: spec.color + '30', color: spec.color }}
                >
                  {rec}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// =====================================
// 🎮 메인 가이드 컴포넌트
// =====================================
export default function HavocDemonHunterGuide() {
  const aldrachiPriorities = [
    { skill: "파괴자의 글레이브", icon: "inv_ability_aldrachireaverdemonhunter_reaversglaive", condition: "전투의 전율 4초 미만", reason: "버프 갱신" },
    { skill: "사냥", icon: "ability_ardenweald_druid_thorns", condition: "-", reason: "분노 생성 + 피해" },
    { skill: "혼돈의 일격", icon: "ability_demonhunter_chaosstrike", condition: "불의 낙인 버프 시", reason: "버프 활용" },
    { skill: "정수 파쇄", icon: "spell_shadow_ritualofsacrifice", condition: "안광과 동기화", reason: "타이밍 시작" },
    { skill: "지옥칼", icon: "ability_demonhunter_felblade", condition: "글레이브 충전 없을 때", reason: "분노 생성" },
    { skill: "칼춤", icon: "ability_demonhunter_bladedance", condition: "-", reason: "스펜더" },
    { skill: "안광", icon: "ability_demonhunter_eyebeam", condition: "불의 낙인과 페어링", reason: "악마화" },
    { skill: "혼돈의 일격", icon: "ability_demonhunter_chaosstrike", condition: "-", reason: "스펜더" },
    { skill: "지옥칼", icon: "ability_demonhunter_felblade", condition: "80 분노 미만", reason: "분노 생성" },
    { skill: "제물의 오라", icon: "ability_demonhunter_immolation", condition: "-", reason: "필러" },
  ];
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: THEME.background.primary }}>
      {/* 헤더 */}
      <header 
        className="py-12 px-6"
        style={{ background: `linear-gradient(180deg, ${THEME.primary}20 0%, transparent 100%)` }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <img 
              src="https://wow.zamimg.com/images/wow/icons/large/classicon_demonhunter.jpg"
              alt="Demon Hunter"
              className="w-16 h-16 rounded-xl"
              style={{ border: `3px solid ${THEME.primary}` }}
            />
            <div>
              <h1 className="text-4xl font-bold" style={{ color: THEME.primary }}>
                파멸 악마사냥꾼
              </h1>
              <p className="text-lg" style={{ color: THEME.text.secondary }}>
                Havoc Demon Hunter Guide
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <span className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: THEME.primary + '30', color: THEME.primary }}>
              패치 11.2.5
            </span>
            <span className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: '#4ADE8030', color: '#4ADE80' }}>
              Melee DPS
            </span>
            <span className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: THEME.text.muted + '30', color: THEME.text.secondary }}>
              출처: Voodoo (FRUG)
            </span>
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        
        {/* 섹션 1: 직업 개요 */}
        <section>
          <h2 className="text-2xl font-bold mb-6" style={{ color: THEME.text.primary }}>
            📋 직업 개요
          </h2>
          <div 
            className="rounded-xl p-6"
            style={{ backgroundColor: THEME.background.card, border: `1px solid ${THEME.primary}40` }}
          >
            <p className="text-lg mb-4" style={{ color: THEME.text.secondary }}>
              파멸 악마사냥꾼은 <strong style={{ color: THEME.primary }}>정수 파쇄 타이밍</strong>에 
              폭발적인 피해를 집중하는 근접 딜러입니다. 뛰어난 기동성과 자체 회복력을 갖추고 있으며, 
              <strong style={{ color: THEME.primary }}> 4초 극딜 타이밍</strong>을 마스터하는 것이 핵심입니다.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#4ADE8020' }}>
                <h4 className="font-semibold mb-2" style={{ color: '#4ADE80' }}>✅ 강점</h4>
                <ul className="text-sm space-y-1" style={{ color: THEME.text.secondary }}>
                  <li>• 높은 기동성</li>
                  <li>• 강력한 극딜</li>
                  <li>• 자체 회복력</li>
                  <li>• 넓은 광딜</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: THEME.accent + '20' }}>
                <h4 className="font-semibold mb-2" style={{ color: THEME.accent }}>❌ 약점</h4>
                <ul className="text-sm space-y-1" style={{ color: THEME.text.secondary }}>
                  <li>• 극딜 의존도 높음</li>
                  <li>• 타이밍 실수 시 DPS 급락</li>
                  <li>• 생존기 쿨다운 긴 편</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: THEME.primary + '20' }}>
                <h4 className="font-semibold mb-2" style={{ color: THEME.primary }}>🎯 추천 콘텐츠</h4>
                <ul className="text-sm space-y-1" style={{ color: THEME.text.secondary }}>
                  <li>• ⭐ 레이드 (ST/클리브)</li>
                  <li>• ⭐ 쐐기돌 던전</li>
                  <li>• PvP (적당)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* 섹션 2: 분노 시스템 */}
        <section>
          <h2 className="text-2xl font-bold mb-6" style={{ color: THEME.text.primary }}>
            ⚡ 분노 시스템
          </h2>
          <div 
            className="rounded-xl p-6"
            style={{ backgroundColor: THEME.background.card, border: `1px solid ${THEME.primary}40` }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-4 flex-1 rounded-full overflow-hidden" style={{ backgroundColor: THEME.background.secondary }}>
                <div 
                  className="h-full rounded-full"
                  style={{ width: '75%', background: `linear-gradient(90deg, ${THEME.primary}, ${THEME.accent})` }}
                />
              </div>
              <span className="text-lg font-bold" style={{ color: THEME.primary }}>75/100</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#4ADE80' }}>🔋 빌더 (분노 생성)</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <img src={`https://wow.zamimg.com/images/wow/icons/small/${SKILLS.felBlade.icon}.jpg`} className="w-6 h-6 rounded" alt="" />
                    <span style={{ color: THEME.text.secondary }}>지옥칼 (+40 분노)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <img src={`https://wow.zamimg.com/images/wow/icons/small/${SKILLS.immolationAura.icon}.jpg`} className="w-6 h-6 rounded" alt="" />
                    <span style={{ color: THEME.text.secondary }}>제물의 오라 (+8/초)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <img src={`https://wow.zamimg.com/images/wow/icons/small/${SKILLS.theHunt.icon}.jpg`} className="w-6 h-6 rounded" alt="" />
                    <span style={{ color: THEME.text.secondary }}>사냥 (+50 분노)</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3" style={{ color: THEME.accent }}>💥 스펜더 (분노 소비)</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <img src={`https://wow.zamimg.com/images/wow/icons/small/${SKILLS.chaosStrike.icon}.jpg`} className="w-6 h-6 rounded" alt="" />
                    <span style={{ color: THEME.text.secondary }}>혼돈의 일격 (40 분노)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <img src={`https://wow.zamimg.com/images/wow/icons/small/${SKILLS.bladeDance.icon}.jpg`} className="w-6 h-6 rounded" alt="" />
                    <span style={{ color: THEME.text.secondary }}>칼춤 (35 분노)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <img src={`https://wow.zamimg.com/images/wow/icons/small/${SKILLS.eyeBeam.icon}.jpg`} className="w-6 h-6 rounded" alt="" />
                    <span style={{ color: THEME.text.secondary }}>안광 (30 분노)</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-3 rounded-lg" style={{ backgroundColor: THEME.primary + '15' }}>
              <p className="text-sm" style={{ color: THEME.text.secondary }}>
                💡 <strong>팁:</strong> 정수 파쇄 타이밍 전 분노 40+ 확보 필수! 캡 방지를 위해 100 분노에서 스펜더 사용
              </p>
            </div>
          </div>
        </section>
        
        {/* 섹션 3: 핵심 스킬 */}
        <section>
          <h2 className="text-2xl font-bold mb-6" style={{ color: THEME.text.primary }}>
            ⚔️ 핵심 스킬 가이드
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <SkillCard skill={SKILLS.essenceBreak} showPriority />
            <SkillCard skill={SKILLS.eyeBeam} showPriority />
            <SkillCard skill={SKILLS.bladeDance} showPriority />
            <SkillCard skill={SKILLS.chaosStrike} showPriority />
            <SkillCard skill={SKILLS.metamorphosis} showPriority />
            <SkillCard skill={SKILLS.reaversGlaive} showPriority />
          </div>
        </section>
        
        {/* 섹션 4: 영웅 특성 비교 */}
        <section>
          <h2 className="text-2xl font-bold mb-6" style={{ color: THEME.text.primary }}>
            🦸 영웅 특성 비교
          </h2>
          <HeroTalentComparison />
        </section>
        
        {/* 섹션 5: 알드라치 ST 우선순위 */}
        <section>
          <h2 className="text-2xl font-bold mb-6" style={{ color: THEME.text.primary }}>
            📊 알드라치 파괴자 - ST 우선순위
          </h2>
          <PriorityTable priorities={aldrachiPriorities} />
        </section>
        
        {/* 섹션 6: 정수 파쇄 타이밍 */}
        <section>
          <h2 className="text-2xl font-bold mb-6" style={{ color: THEME.text.primary }}>
            🔥 정수 파쇄 타이밍 마스터
          </h2>
          <EssenceBreakWindow />
          
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div 
              className="p-4 rounded-lg"
              style={{ backgroundColor: THEME.background.card, border: `1px solid ${THEME.primary}40` }}
            >
              <h4 className="font-semibold mb-3" style={{ color: '#4ADE80' }}>✅ 타이밍 전 체크리스트</h4>
              <ul className="text-sm space-y-2" style={{ color: THEME.text.secondary }}>
                <li>☑️ 파괴자의 징표 최소 1스택</li>
                <li>☑️ 전투의 전율 버프 활성</li>
                <li>☑️ 안광 쿨다운 준비됨</li>
                <li>☑️ 분노 40 이상 확보</li>
              </ul>
            </div>
            <div 
              className="p-4 rounded-lg"
              style={{ backgroundColor: THEME.background.card, border: `1px solid ${THEME.accent}40` }}
            >
              <h4 className="font-semibold mb-3" style={{ color: THEME.accent }}>⚠️ 주의사항</h4>
              <ul className="text-sm space-y-2" style={{ color: THEME.text.secondary }}>
                <li>❌ 타이밍 내 글레이브 투척 금지</li>
                <li>❌ 파괴자의 글레이브 충전 없으면 홀드 X</li>
                <li>❌ 칼춤 x2 못 넣으면 DPS 손실</li>
              </ul>
            </div>
          </div>
        </section>
        
        {/* 푸터: 출처 */}
        <footer className="pt-8 border-t" style={{ borderColor: THEME.primary + '30' }}>
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <p className="text-sm" style={{ color: THEME.text.muted }}>
                출처: Voodoo (FRUG), Discord Fel Hammer
              </p>
              <p className="text-sm" style={{ color: THEME.text.muted }}>
                패치 11.2.5 | 최종 검증: 2025-12-01
              </p>
            </div>
            <div className="flex gap-3">
              <a 
                href="https://discord.gg/zGGkNGC" 
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: THEME.primary, color: THEME.text.primary }}
              >
                Discord Fel Hammer
              </a>
            </div>
          </div>
        </footer>
        
      </main>
    </div>
  );
}
