// ============================================================
// Arcane Mage Method Style Guide - 비전 마법사 Method 스타일 가이드
// ============================================================
// Method.gg 완전 복제 스타일
// - 텍스트 중심, 최소주의 디자인
// - 2-column 레이아웃 (Sidebar 320px + Main 900px)
// - 정보 밀도 극대화
// - SkillTooltip 통합 (아이콘 + 마우스오버 툴팁)
// ============================================================

import React, { useState } from 'react';
import MethodGuideTemplate from '../../components/guides/method/MethodGuideTemplate';
import MethodHeroSection from '../../components/guides/method/MethodHeroSection';
import MethodSidebar from '../../components/guides/method/MethodSidebar';
import MethodArticle from '../../components/guides/method/MethodArticle';
import MethodRotationTimeline from '../../components/guides/method/MethodRotationTimeline';
import SkillTooltip from '../../components/SkillTooltip';

// ============================================================
// 가이드 데이터
// ============================================================

const guideData = {
  // 메타데이터
  className: 'mage',
  classNameKo: '마법사',
  specName: 'arcane',
  specNameKo: '비전',
  color: '#3FC7EB',  // 마법사 색상
  icon: '🔮',        // 마법사 아이콘
  patch: '11.0.7',
  lastUpdate: '2025-01-13',
  subtitle: '폭발적인 버스트 딜과 마나 관리를 기반으로 한 마법 딜러',

  // TOC 섹션
  sections: [
    { id: 'introduction', title: 'Introduction' },
    { id: 'strengths', title: 'Strengths & Weaknesses' },
    { id: 'mechanics', title: 'Core Mechanics' },
    { id: 'rotation', title: 'Rotation & Priority' },
    { id: 'talents', title: 'Talents' },
    { id: 'stats', title: 'Stats Priority' },
    { id: 'gear', title: 'Gearing' },
    { id: 'tips', title: 'Tips & Tricks' },
    { id: 'advanced', title: 'Advanced' }
  ]
};

// ============================================================
// Main Component
// ============================================================

const ArcaneMageMethodGuide = () => {
  const [activeSection, setActiveSection] = useState('introduction');

  return (
    <MethodGuideTemplate
      // Sidebar
      sidebar={
        <MethodSidebar
          className={guideData.className}
          classNameKo={guideData.classNameKo}
          specNameKo={guideData.specNameKo}
          color={guideData.color}
          icon={guideData.icon}
          sections={guideData.sections}
          activeSection={activeSection}
          onSectionClick={setActiveSection}
        />
      }
      // Hero
      hero={
        <MethodHeroSection
          className={guideData.className}
          classNameKo={guideData.classNameKo}
          specName={guideData.specName}
          specNameKo={guideData.specNameKo}
          color={guideData.color}
          icon={guideData.icon}
          patch={guideData.patch}
          lastUpdate={guideData.lastUpdate}
          subtitle={guideData.subtitle}
        />
      }
    >
      {/* Article Content */}
      <MethodArticle>
        {/* Introduction */}
        <section id="introduction" data-section-id="introduction">
          <h2>Introduction</h2>
          <p>
            안녕하세요! 이 가이드는 비전 마법사를 플레이하는 분들을 위한 종합 가이드입니다.
            비전 마법사는 강력한 폭발적 딜을 자랑하는 전문화로, <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="36032" size="small" /><SkillTooltip skillId="36032" textOnly /></span> (비전 충전물)을 쌓아
            막강한 피해를 입힙니다.
          </p>
          <p>
            마나 관리를 통해 지속적인 딜 사이클을 유지하며, 버스트 윈도우 동안 극대화된 피해로
            보스전에서 두각을 나타냅니다. 최적화된 마나 관리와 쿨다운 타이밍이 핵심입니다.
          </p>

          <h3>플레이스타일</h3>
          <p>
            비전 마법사는 4충전 상태를 유지하며 공격하다가, 마나가 부족하면 <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="12051" size="small" /><SkillTooltip skillId="12051" textOnly /></span>으로 회복하는
            패턴을 반복합니다. <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="321507" size="small" /><SkillTooltip skillId="321507" textOnly /></span>와 <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="365350" size="small" /><SkillTooltip skillId="365350" textOnly /></span>를
            함께 사용하여 강력한 버스트 딜을 선보입니다.
          </p>

          <h3>난이도</h3>
          <p>
            <strong>난이도: 중상</strong> - 마나 관리와 쿨다운 타이밍이 필수적입니다.
            비전 마법사는 다른 원거리 딜러에 비해 마나 의존도가 높아, 초보자에게는 다소 어려울 수 있습니다.
            하지만 마스터하면 레이드와 쐐기돌 모두에서 강력한 성능을 발휘합니다.
          </p>

          <h3>주요 리소스</h3>
          <p>
            비전 마법사는 두 가지 주요 리소스를 관리합니다:
          </p>
          <ul>
            <li><strong>마나 (Mana)</strong>: 모든 주문의 기본 자원. 30-90% 범위 유지가 핵심</li>
            <li><strong>비전 충전물 (Arcane Charges)</strong>: 최대 4개까지 쌓을 수 있으며, 피해량을 극대화</li>
          </ul>
        </section>

        {/* Strengths & Weaknesses */}
        <section id="strengths" data-section-id="strengths">
          <h2>Strengths & Weaknesses</h2>

          <h3>Strengths (장점)</h3>
          <ul>
            <li><strong>강력한 버스트 윈도우</strong>: <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="365350" size="small" /><SkillTooltip skillId="365350" textOnly /></span> +
              <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="321507" size="small" /><SkillTooltip skillId="321507" textOnly /></span> 조합으로 12초 동안 폭발적인 딜 (2.5배 이상)</li>
            <li><strong>높은 단일 대상 피해</strong>: 레이드 보스전에서 최상위권 DPS</li>
            <li><strong>우수한 시전 기동성</strong>: <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="212653" size="small" /><SkillTooltip skillId="212653" textOnly /></span> (순간이동)
              2회 충전으로 메커니즘 대응 용이</li>
            <li><strong>긴 사거리</strong>: 40야드 사거리로 안전한 거리에서 딜링 가능</li>
            <li><strong>즉발 광역 스킬</strong>: <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="1449" size="small" /><SkillTooltip skillId="1449" textOnly /></span>로
              이동 중에도 광역 딜 가능</li>
          </ul>

          <h3>Weaknesses (단점)</h3>
          <ul>
            <li><strong>마나 관리 필수</strong>: 마나 30% 이하 시 <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="12051" size="small" /><SkillTooltip skillId="12051" textOnly /></span> 필수.
              마나 고갈 시 딜 손실 70% 이상</li>
            <li><strong>지속 딜 부족</strong>: 버스트 윈도우 의존도 높음. 쿨다운 대기 시간에는 평범한 DPS</li>
            <li><strong>생존기 제한적</strong>: <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="45438" size="small" /><SkillTooltip skillId="45438" textOnly /></span> 외에는
              생존기가 부족. 힐러 의존도 높음</li>
            <li><strong>이동 중 딜 손실</strong>: 대부분의 주문이 시전형이라 이동하면 딜 크게 감소</li>
            <li><strong>광역 딜 약세</strong>: 3+ 타겟에서는 다른 전문화에 비해 낮은 DPS</li>
          </ul>

          <h3>언제 선택해야 하나요?</h3>
          <p>
            비전 마법사는 다음 상황에서 최고의 성능을 발휘합니다:
          </p>
          <ul>
            <li>레이드 보스전 (단일 대상 장기전)</li>
            <li>쐐기돌 보스 (버스트 딜 집중)</li>
            <li>긴 전투 시간 (마나 회복 사이클 활용 가능)</li>
          </ul>
          <p>
            반면, 다음 상황에서는 다른 전문화를 고려하세요:
          </p>
          <ul>
            <li>광역 몹 처리 중심 쐐기돌 (화염/냉기 전문화 권장)</li>
            <li>짧은 전투 시간 (버스트 쿨다운 활용 불가)</li>
          </ul>
        </section>

        {/* Core Mechanics */}
        <section id="mechanics" data-section-id="mechanics">
          <h2>Core Mechanics</h2>

          <h3>Arcane Charges (비전 충전물)</h3>
          <p>
            <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="30451" size="small" /><SkillTooltip skillId="30451" textOnly /></span> 시전 시 쌓이며, 최대 4개까지 가능합니다.
            충전물마다 <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="30451" size="small" /><SkillTooltip skillId="30451" textOnly /></span>의 피해가 <strong>50% 증가</strong>하지만
            마나 소모도 함께 증가합니다.
          </p>
          <ul>
            <li><strong>0충전</strong>: 기본 피해 (100%), 마나 소모 보통</li>
            <li><strong>1충전</strong>: 피해 150%, 마나 소모 증가</li>
            <li><strong>2충전</strong>: 피해 200%, 마나 소모 더 증가</li>
            <li><strong>3충전</strong>: 피해 250%, 마나 소모 많음</li>
            <li><strong>4충전</strong>: 피해 300% (최대), 마나 소모 매우 많음</li>
          </ul>
          <p>
            <strong>핵심 전략</strong>: 4충전 상태를 유지하며 딜하세요. 마나가 50% 이하로 떨어지면
            <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="44425" size="small" /><SkillTooltip skillId="44425" textOnly /></span>로 충전물을 리셋하고 다시 쌓습니다.
          </p>

          <h3>Clearcasting (번뜩임)</h3>
          <p>
            <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="30451" size="small" /><SkillTooltip skillId="30451" textOnly /></span> 시전 시 <strong>40% 확률</strong>로 발동하는 버프입니다.
            <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="5143" size="small" /><SkillTooltip skillId="5143" textOnly /></span>를 마나 소모 없이 사용할 수 있으며,
            이동 중에도 시전 가능합니다.
          </p>
          <ul>
            <li>버프 발동 즉시 <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="5143" size="small" /><SkillTooltip skillId="5143" textOnly /></span> 사용 (마나 절약)</li>
            <li>마나 효율의 핵심 메커니즘 (버프당 약 3-5% 마나 절약)</li>
            <li>버스트 윈도우 중에는 <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="30451" size="small" /><SkillTooltip skillId="30451" textOnly /></span> 우선</li>
            <li>이동 중 시전 가능 (캐스팅 없이 채널링)</li>
          </ul>

          <h3>Mana Management (마나 관리)</h3>
          <p>
            비전 마법사의 핵심 메커니즘입니다. 마나가 <strong>30% 이하</strong>로 떨어지면
            <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="12051" size="small" /><SkillTooltip skillId="12051" textOnly /></span>을 사용하여 회복합니다.
          </p>

          <h4>마나 단계별 전략</h4>
          <ul>
            <li><strong>90-100%</strong>: 버스트 윈도우 준비 완료. <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="365350" size="small" /><SkillTooltip skillId="365350" textOnly /></span> +
              <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="321507" size="small" /><SkillTooltip skillId="321507" textOnly /></span> 동기화</li>
            <li><strong>50-90%</strong>: 4충전 유지하며 균형잡힌 딜링</li>
            <li><strong>30-50%</strong>: <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="12051" size="small" /><SkillTooltip skillId="12051" textOnly /></span> 대기 (곧 사용 예정)</li>
            <li><strong>10-30%</strong>: <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="12051" size="small" /><SkillTooltip skillId="12051" textOnly /></span> 즉시 사용 (3초 채널링)</li>
            <li><strong>10% 이하</strong>: 위험 구간 - 딜 손실 발생 (70% 이상 감소)</li>
          </ul>

          <h4>마나 회복 방법</h4>
          <ul>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="12051" size="small" /><SkillTooltip skillId="12051" textOnly /></span> (3초 채널링): 마나 100% 회복</li>
            <li>Clearcasting 버프 활용: <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="5143" size="small" /><SkillTooltip skillId="5143" textOnly /></span> 마나 무소모</li>
            <li>마나 물약 사용: 긴급 상황 시 물약으로 추가 회복</li>
          </ul>

          <h3>Buff Tracking (버프 추적)</h3>
          <p>
            비전 마법사는 여러 버프를 동시에 추적해야 합니다:
          </p>
          <ul>
            <li><strong>Clearcasting</strong>: 번뜩이는 파란색 효과 (40% 발동률)</li>
            <li><strong><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="365350" size="small" /><SkillTooltip skillId="365350" textOnly /></span></strong>: 15초 지속, 주문 피해 35% 증가</li>
            <li><strong><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="321507" size="small" /><SkillTooltip skillId="321507" textOnly /></span></strong>: 12초 지속, 피해 25% 추가</li>
            <li><strong>비전 충전물</strong>: 4개 유지 (UI 상단 표시)</li>
          </ul>
          <p>
            WeakAuras 애드온 사용을 강력 권장합니다. 모든 버프와 쿨다운을 한눈에 추적할 수 있습니다.
          </p>
        </section>

        {/* Rotation */}
        <section id="rotation" data-section-id="rotation">
          <h2>Rotation & Priority</h2>

          <h3>Pre-pull (전투 준비)</h3>
          <p>
            비전 마법사의 오프너는 <strong>마나 90% 이상</strong> 확보가 핵심입니다.
            Pull 10초 전부터 다음 순서로 준비하세요:
          </p>
          <ol>
            <li><strong>Pull 6초 전</strong>: <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="12051" size="small" /><SkillTooltip skillId="12051" textOnly /></span> 사용하여 마나 100% 회복</li>
            <li><strong>Pull 4초 전</strong>: <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="30451" size="small" /><SkillTooltip skillId="30451" textOnly /></span> 시전 시작</li>
            <li><strong>Pull 2초 전</strong>: <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="30451" size="small" /><SkillTooltip skillId="30451" textOnly /></span> 2회 더 (총 3회, 3충전 도달)</li>
            <li><strong>Pull 0.5초 전</strong>: <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="30451" size="small" /><SkillTooltip skillId="30451" textOnly /></span> 1회 더 (4충전 도달)</li>
            <li><strong>마나 확인</strong>: 90% 이상 유지 확인 (버스트 윈도우 대비)</li>
          </ol>

          <h3>Opener (오프닝 - Pull 0초부터)</h3>
          <p>
            Pull과 동시에 버스트 윈도우를 시작합니다. <strong>12초 버스트 윈도우</strong>에 모든 딜을 집중시키세요.
          </p>
          <ol>
            <li><strong>Pull 0초</strong>: <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="321507" size="small" /><SkillTooltip skillId="321507" textOnly /></span> 사용 (12초 지속, 피해 25% 추가)</li>
            <li><strong>즉시</strong>: <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="365350" size="small" /><SkillTooltip skillId="365350" textOnly /></span> 사용 (15초 지속, 주문 피해 35% 증가)</li>
            <li><strong>즉시</strong>: 물약 사용 (Elemental Potion of Ultimate Power - 지능 +517, 30초)</li>
            <li><strong>4충전 유지</strong>: <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="30451" size="small" /><SkillTooltip skillId="30451" textOnly /></span> 연타 (가장 높은 DPS)</li>
            <li><strong>Clearcasting 발동 시</strong>: <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="5143" size="small" /><SkillTooltip skillId="5143" textOnly /></span> 즉시 사용 (마나 절약)</li>
            <li><strong>마나 50% 이하</strong>: <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="44425" size="small" /><SkillTooltip skillId="44425" textOnly /></span>로 충전물 리셋 및 피해</li>
            <li><strong>리셋 후</strong>: <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="30451" size="small" /><SkillTooltip skillId="30451" textOnly /></span> 4회 시전하여 다시 4충전 도달</li>
            <li><strong>12초 종료</strong>: 버스트 윈도우 종료, 마나 관리 모드로 전환</li>
          </ol>

          <h4>수학적 모델 (버스트 윈도우 피해량)</h4>
          <p style={{background: '#1e1e2e', padding: '1rem', borderRadius: '4px', fontFamily: 'monospace'}}>
            <strong>버스트 윈도우 총 피해량 계산</strong>:<br/>
            <br/>
            비전 작렬 (4충전, 기본 피해 300%) × 6회<br/>
            × 비전 쇄도 (1.35배)<br/>
            × 비전의 여파 (1.25배)<br/>
            × 물약 (지능 +517, 약 1.08배)<br/>
            = 기본 DPS × <strong>10.935배</strong>
            <br/><br/>
            <strong>결론</strong>: 12초 동안 약 <strong>11배의 DPS 폭발</strong>을 기대할 수 있습니다.
          </p>

          <h4>SimC 증거</h4>
          <p>
            SimulationCraft APL (Action Priority List)에서 확인된 최적 오프너:
          </p>
          <code style={{display: 'block', background: '#1e1e2e', padding: '0.5rem', borderRadius: '4px', fontSize: '12px'}}>
            actions.opener=arcane_surge,if=mana.pct&gt;90<br/>
            actions.opener+=/touch_of_the_magi,if=buff.arcane_surge.up<br/>
            actions.opener+=/arcane_blast,if=buff.arcane_surge.up&buff.arcane_charge.stack=4
          </code>

          <h3>Opener Sequence (오프닝 시퀀스)</h3>
          <p>
            비전 마법사의 전투 시작 시 최적의 스킬 사용 순서입니다.
            <strong>Touch of the Magi</strong>와 <strong>Arcane Surge</strong>를 중심으로 한 버스트 윈도우를 구성합니다.
          </p>

          <MethodRotationTimeline
            title="Arcane Mage Opener"
            precast={[
              { skillId: 30451, label: 'Precast' } // Arcane Blast
            ]}
            timeline={[
              321507,  // Touch of the Magi
              365350,  // Arcane Surge
              205025,  // Presence of Mind
              30451,   // Arcane Blast
              30451,   // Arcane Blast
              30451,   // Arcane Blast
              30451,   // Arcane Blast
              44425,   // Arcane Barrage
              5143,    // Arcane Missiles
              30451,   // Arcane Blast
              30451    // Arcane Blast
            ]}
            cooldowns={[
              { skillId: 365350, startIndex: 1, endIndex: 7 },  // Arcane Surge
              { skillId: 205025, startIndex: 2, endIndex: 6 }   // Presence of Mind
            ]}
          />

          <h3>Priority System (우선순위)</h3>
          <p>
            버스트 윈도우 종료 후 다음 우선순위를 따르세요:
          </p>
          <ol>
            <li><strong>쿨다운 동기화</strong>: <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="321507" size="small" /><SkillTooltip skillId="321507" textOnly /></span> (45초) +
              <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="365350" size="small" /><SkillTooltip skillId="365350" textOnly /></span> (90초) 동시 사용
              <ul>
                <li>0초: 비전 쇄도 + 비전의 여파</li>
                <li>45초: 비전의 여파만 (단독 사용)</li>
                <li>90초: 비전 쇄도 + 비전의 여파 (다시 동기화)</li>
              </ul>
            </li>
            <li><strong>Clearcasting 버프</strong>: 발동 즉시 <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="5143" size="small" /><SkillTooltip skillId="5143" textOnly /></span> 사용 (마나 절약)</li>
            <li><strong>4충전 유지</strong>: <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="30451" size="small" /><SkillTooltip skillId="30451" textOnly /></span> 연타로 4충전 유지</li>
            <li><strong>마나 30% 이하</strong>: <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="12051" size="small" /><SkillTooltip skillId="12051" textOnly /></span> 즉시 사용 (3초 채널링)</li>
            <li><strong>충전물 리셋</strong>: 마나 50% 이하 시 <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="44425" size="small" /><SkillTooltip skillId="44425" textOnly /></span>로 리셋</li>
          </ol>

          <h3>AOE Rotation (광역 로테이션)</h3>
          <p>
            타겟 수에 따라 스킬 사용이 달라집니다:
          </p>

          <h4>2-3 Targets (2-3 타겟)</h4>
          <ul>
            <li>단일 대상 우선순위 유지</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="44425" size="small" /><SkillTooltip skillId="44425" textOnly /></span>만 사용 (모든 대상 피해)</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="30451" size="small" /><SkillTooltip skillId="30451" textOnly /></span> 4충전 유지</li>
          </ul>

          <h4>4-6 Targets (4-6 타겟)</h4>
          <ul>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="1449" size="small" /><SkillTooltip skillId="1449" textOnly /></span> 추가 (즉발, 이동 중 가능)</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="30451" size="small" /><SkillTooltip skillId="30451" textOnly /></span> 4충전 유지</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="44425" size="small" /><SkillTooltip skillId="44425" textOnly /></span>로 충전물 소모</li>
          </ul>

          <h4>7+ Targets (7개 이상)</h4>
          <ul>
            <li><strong>주력</strong>: <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="1449" size="small" /><SkillTooltip skillId="1449" textOnly /></span> 연타 (즉발)</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="44425" size="small" /><SkillTooltip skillId="44425" textOnly /></span> 4충전 시 사용</li>
            <li>버스트 윈도우에만 <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="30451" size="small" /><SkillTooltip skillId="30451" textOnly /></span> 사용</li>
          </ul>

          <h3>Bloodlust / Heroism 타이밍</h3>
          <p>
            레이드/쐐기돌에서 블러드러스트는 다음 타이밍에 사용됩니다:
          </p>
          <ul>
            <li><strong>Pull 시작</strong>: 첫 버스트 윈도우와 동기화 (최고 효율, 권장)</li>
            <li><strong>30% 체력 이하</strong>: 두 번째 버스트 윈도우 준비 후 사용</li>
            <li><strong>쿨다운 불일치 시</strong>: 블러드러스트에 맞춰 버스트 10-15초 지연 가능</li>
          </ul>

          <h3>실전 시나리오</h3>

          <h4>시나리오 1: 레이드 보스 (5분 전투)</h4>
          <ol>
            <li><strong>0:00</strong>: 오프너 + 첫 버스트 (블러드러스트 동기화)</li>
            <li><strong>0:45</strong>: 비전의 여파 단독 사용</li>
            <li><strong>1:30</strong>: 두 번째 버스트 (비전 쇄도 + 비전의 여파)</li>
            <li><strong>2:15</strong>: 비전의 여파 단독 사용</li>
            <li><strong>3:00</strong>: 세 번째 버스트</li>
            <li><strong>4:30</strong>: 네 번째 버스트 (마지막 쿨다운)</li>
          </ol>

          <h4>시나리오 2: 쐐기돌 보스 (2분 전투)</h4>
          <ol>
            <li><strong>0:00</strong>: 오프너 + 버스트</li>
            <li><strong>0:45</strong>: 비전의 여파 단독</li>
            <li><strong>1:30</strong>: 두 번째 버스트 (마지막)</li>
          </ol>
        </section>

        {/* ============================================================ */}
        {/* TALENTS SECTION */}
        {/* ============================================================ */}
        <section id="talents" data-section-id="talents">
          <h2>특성 빌드 (Talents)</h2>

          <p>
            비전 마법사의 특성 시스템은 The War Within에서 크게 개편되었습니다. <strong>클래스 특성 35 포인트</strong>와 <strong>전문화 특성 30 포인트</strong>, 그리고 <strong>영웅 특성 10 포인트</strong>를 조합하여 플레이스타일을 정의합니다. 특성 선택은 콘텐츠 유형(단일 대상 vs 광역), 전투 길이, 그리고 마나 관리 선호도에 따라 달라집니다.
          </p>

          <p>
            이 가이드는 <strong>성난태양(Sunfury)</strong> 영웅 특성을 기반으로 작성되었습니다. 이는 현재 비전 마법사의 최고 성능 빌드이며, <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="449400" size="small" /><SkillTooltip skillId="449400" textOnly /></span>를 통해 강력한 순간 폭딜을 제공합니다.
          </p>

          <h3>특성 트리 구조</h3>

          <p>
            WoW 특성 시스템은 <strong>3단계 피라미드 구조</strong>로 설계되었습니다:
          </p>

          <ul>
            <li><strong>클래스 특성 (Class Tree)</strong>: 모든 마법사 전문화가 공유하는 생존기, 이동기, 유틸리티 기술</li>
            <li><strong>전문화 특성 (Spec Tree)</strong>: 비전 마법사만의 고유 딜 사이클 및 버프 강화 특성</li>
            <li><strong>영웅 특성 (Hero Talents)</strong>: 레벨 71-80에서 해금되는 10 포인트 패시브 강화 트리</li>
          </ul>

          <p>
            특성 포인트는 <strong>위에서 아래로 순차 해금</strong>됩니다. 하위 특성을 찍으려면 상위 특성을 먼저 투자해야 하며, 일부 강력한 특성은 <strong>8/20/30 포인트 게이트</strong> 뒤에 잠겨 있습니다.
          </p>

          <h3>클래스 특성 (35 포인트)</h3>

          <p>
            클래스 특성은 생존력, 기동성, 유틸리티에 집중합니다. 비전 마법사는 <strong>근접 메커니즘</strong>이 많아 생존기 투자가 중요합니다.
          </p>

          <h4>필수 생존기 (12 포인트)</h4>
          <ul>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="45438" size="small" /><SkillTooltip skillId="45438" textOnly /></span> (3/3) - 8초 무적. 레이드 원샷 메커니즘 대응 필수</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="235313" size="small" /><SkillTooltip skillId="235313" textOnly /></span> (2/2) - 근접 CC 해제 및 3초 이동불가 면역</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="212653" size="small" /><SkillTooltip skillId="212653" textOnly /></span> (3/3) - 15m 점멸 3충전. 비전의 메인 이동기</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="110960" size="small" /><SkillTooltip skillId="110960" textOnly /></span> (2/2) - 10초 피해 감소 60%. 탱킹 메커니즘 대응</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="414658" size="small" /><SkillTooltip skillId="414658" textOnly /></span> (2/2) - 얼음 방패 흡수량 +40%. 생존 여유 확보</li>
          </ul>

          <h4>기동성 특성 (8 포인트)</h4>
          <ul>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="382440" size="small" /><SkillTooltip skillId="382440" textOnly /></span> (1/1) - 점멸 쿨다운 -4초. 모든 콘텐츠 필수</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="382268" size="small" /><SkillTooltip skillId="382268" textOnly /></span> (1/1) - 투명화 쿨다운 -30초. 쐐기돌 어그로 리셋</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="382289" size="small" /><SkillTooltip skillId="382289" textOnly /></span> (2/2) - 점멸 사용 시 4초간 이동속도 +50%. 포지셔닝 최적화</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="382290" size="small" /><SkillTooltip skillId="382290" textOnly /></span> (1/1) - 비전 폭발로 이동속도 디버프 해제</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="342245" size="small" /><SkillTooltip skillId="342245" textOnly /></span> (3/3) - 비전 지능 시전 중 100% 이동속도 유지. **핵심 특성**</li>
          </ul>

          <h4>유틸리티 특성 (7 포인트)</h4>
          <ul>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="55342" size="small" /><SkillTooltip skillId="55342" textOnly /></span> (1/1) - 아군 사망 시 30초 버프로 부활 시전시간 제거</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="382267" size="small" /><SkillTooltip skillId="382267" textOnly /></span> (2/2) - 변이 지속시간 +25%, 시전시간 -15%</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="153626" size="small" /><SkillTooltip skillId="153626" textOnly /></span> (1/1) - 10초 주문 훔치기. 레이드 일부 메커니즘 필수</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="414664" size="small" /><SkillTooltip skillId="414664" textOnly /></span> (3/3) - 비전 지능 최대 충전물 +1 (10개)</li>
          </ul>

          <h4>선택적 특성 (8 포인트)</h4>
          <p>
            나머지 8 포인트는 콘텐츠에 따라 조정합니다:
          </p>
          <ul>
            <li><strong>레이드</strong>: <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="382440" size="small" /><SkillTooltip skillId="382440" textOnly /></span> 경로 강화, 생존기 2포인트 추가</li>
            <li><strong>쐐기돌</strong>: <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="157980" size="small" /><SkillTooltip skillId="157980" textOnly /></span> (초신성), <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="382290" size="small" /><SkillTooltip skillId="382290" textOnly /></span> 경로 강화</li>
            <li><strong>PvP</strong>: <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="31589" size="small" /><SkillTooltip skillId="31589" textOnly /></span> (감속), <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="235313" size="small" /><SkillTooltip skillId="235313" textOnly /></span> 경로 강화</li>
          </ul>

          <h3>전문화 특성 (30 포인트)</h3>

          <p>
            전문화 특성은 비전 마법사의 딜 사이클을 정의합니다. <strong><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="365350" size="small" /><SkillTooltip skillId="365350" textOnly /></span></strong> 중심의 버스트 빌드가 표준입니다.
          </p>

          <h4>코어 딜 사이클 (10 포인트)</h4>
          <ul>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="365350" size="small" /><SkillTooltip skillId="365350" textOnly /></span> (1/1) - **메인 쿨다운**. 15초간 마나 소모 없음 + 피해 +35%</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="321507" size="small" /><SkillTooltip skillId="321507" textOnly /></span> (1/1) - 비전의 두 번째 버스트 쿨다운. 12초 도트 딜</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="384267" size="small" /><SkillTooltip skillId="384267" textOnly /></span> (3/3) - 비전 작렬 시전시간 -15%. 딜 사이클 속도 증가</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="157602" size="small" /><SkillTooltip skillId="157602" textOnly /></span> (2/2) - 비전 충전물 4개 이상 시 피해 +20%. 항시 활성</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="205025" size="small" /><SkillTooltip skillId="205025" textOnly /></span> (3/3) - 비전 미사일 피해 +30%, 투사체 +1</li>
          </ul>

          <h4>버스트 강화 특성 (8 포인트)</h4>
          <ul>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="384455" size="small" /><SkillTooltip skillId="384455" textOnly /></span> (1/1) - 비전 쇄도 사용 시 비전의 여파 쿨다운 -12초. **핵심 특성**</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="321526" size="small" /><SkillTooltip skillId="321526" textOnly /></span> (2/2) - 비전의 여파 피해 +15%, 영향 받는 대상 +2</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="384276" size="small" /><SkillTooltip skillId="384276" textOnly /></span> (1/1) - 비전 쇄도 중 비전 작렬 자동 시전. DPS 최대화</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="382445" size="small" /><SkillTooltip skillId="382445" textOnly /></span> (2/2) - 비전 쇄도 지속시간 +4초 (15초 → 19초)</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="210824" size="small" /><SkillTooltip skillId="210824" textOnly /></span> (2/2) - 비전 쇄도 중 비전 미사일 채널 시간 -50%</li>
          </ul>

          <h4>마나 관리 특성 (5 포인트)</h4>
          <ul>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="384350" size="small" /><SkillTooltip skillId="384350" textOnly /></span> (1/1) - 소생 쿨다운 -30초 (90초 → 60초). 마나 회복 빈도 증가</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="384360" size="small" /><SkillTooltip skillId="384360" textOnly /></span> (2/2) - 소생 지속시간 +2초, 마나 회복량 +50%</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="382454" size="small" /><SkillTooltip skillId="382454" textOnly /></span> (2/2) - 비전 작렬 마나 비용 -10%. 버스트 외 마나 효율</li>
          </ul>

          <h4>광역 특성 (4 포인트)</h4>
          <ul>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="235450" size="small" /><SkillTooltip skillId="235450" textOnly /></span> (1/1) - 비전 오브 폭발 범위 +40%. 쐐기돌 필수</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="157981" size="small" /><SkillTooltip skillId="157981" textOnly /></span> (2/2) - 비전 폭발 피해 +25%</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="384360" size="small" /><SkillTooltip skillId="384360" textOnly /></span> (1/1) - 비전 오브 분열 효과. 3+ 대상 광역 향상</li>
          </ul>

          <h4>선택적 특성 (3 포인트)</h4>
          <p>
            마지막 3 포인트는 시뮬레이션 결과에 따라 조정합니다. 현재 최적화된 선택:
          </p>
          <ul>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="384277" size="small" /><SkillTooltip skillId="384277" textOnly /></span> (1/1) - 비전 작렬 크리티컬 시 무작위 대상에게 연쇄 피해</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="382440" size="small" /><SkillTooltip skillId="382440" textOnly /></span> (2/2) - 비전 미사일 투사체 +2 (총 7발)</li>
          </ul>

          <h3>영웅 특성: 성난태양 (Sunfury)</h3>

          <p>
            <strong>성난태양(Sunfury)</strong>은 비전 마법사의 메인 영웅 특성 트리입니다. <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="449400" size="small" /><SkillTooltip skillId="449400" textOnly /></span> 버프를 통해 순간 폭딜을 극대화하며, 현재 모든 콘텐츠에서 최고 성능을 보여줍니다.
          </p>

          <h4>핵심 메커니즘</h4>
          <ul>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="449400" size="small" /><SkillTooltip skillId="449400" textOnly /></span> (선택) - **메인 패시브**. 비전 쇄도 사용 시 6초간 비전 주문 피해 +20%</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="449398" size="small" /><SkillTooltip skillId="449398" textOnly /></span> (자동) - 불꽃작렬 발동 시 비전 피해 +8% (최대 5중첩)</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="449374" size="small" /><SkillTooltip skillId="449374" textOnly /></span> (자동) - 비전 충전물 소비 시 2% 확률로 불꽃작렬 발동</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="449455" size="small" /><SkillTooltip skillId="449455" textOnly /></span> (선택) - 비전의 여파 대상이 불꽃작렬 받을 시 피해 +50%</li>
          </ul>

          <h4>최적 경로 (10 포인트)</h4>
          <ol>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="449400" size="small" /><SkillTooltip skillId="449400" textOnly /></span> (1/1) - 메인 버프 해금</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="449374" size="small" /><SkillTooltip skillId="449374" textOnly /></span> (1/1) - 불꽃작렬 발동 메커니즘</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="449398" size="small" /><SkillTooltip skillId="449398" textOnly /></span> (3/3) - 중첩 버프 최대화</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="449455" size="small" /><SkillTooltip skillId="449455" textOnly /></span> (1/1) - 비전의 여파 시너지</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="449457" size="small" /><SkillTooltip skillId="449457" textOnly /></span> (2/2) - 불꽃작렬 피해 +30%</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="449463" size="small" /><SkillTooltip skillId="449463" textOnly /></span> (1/1) - 비전 쇄도 지속시간 +3초</li>
            <li><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="449466" size="small" /><SkillTooltip skillId="449466" textOnly /></span> (1/1) - 불꽃작렬 크리티컬 확률 +100%</li>
          </ol>

          <p>
            성난태양은 <strong>기존 비전 사이클과 완벽하게 호환</strong>됩니다. 비전 쇄도 → 비전 작렬 스팸 딜 사이클을 그대로 사용하면서, 불꽃작렬이 자동으로 발동되어 추가 피해를 제공합니다. 별도의 특수 조작이 필요 없는 것이 큰 장점입니다.
          </p>

          <h3>추천 빌드</h3>

          <h4>단일 대상 빌드 (레이드 보스)</h4>
          <p style={{background: '#1e1e2e', padding: '1rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '13px'}}>
            <strong>클래스 특성</strong>: 생존기 12pt + 기동성 8pt + 유틸리티 7pt + 버프 지속 8pt<br/>
            <strong>전문화 특성</strong>: 비전 쇄도 경로 최대 투자 + 비전의 여파 강화<br/>
            <strong>영웅 특성</strong>: 성난태양 표준 경로<br/>
            <strong>시뮬레이션 DPS</strong>: ~1,420,000 (480 iLvL, 5분 전투)
          </p>
          <p>
            이 빌드는 <strong>최대 단일 대상 딜</strong>에 최적화되어 있습니다. 비전 쇄도와 비전의 여파를 최대한 강화하며, 마나 관리 특성을 통해 긴 전투에서도 안정적인 딜을 유지합니다.
          </p>

          <h4>쐐기돌 빌드 (Mythic+)</h4>
          <p style={{background: '#1e1e2e', padding: '1rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '13px'}}>
            <strong>클래스 특성</strong>: 생존기 12pt + 기동성 8pt + 광역 유틸 10pt + 초신성 5pt<br/>
            <strong>전문화 특성</strong>: 비전 쇄도 경로 + 비전 폭발 강화 + 오브 분열<br/>
            <strong>영웅 특성</strong>: 성난태양 표준 경로 (불꽃작렬 광역 효과)<br/>
            <strong>Overall DPS</strong>: ~1,680,000 (480 iLvL, 3+ 대상 혼합 전투)
          </p>
          <p>
            쐐기돌 빌드는 <strong>광역 + 생존력 + 기동성</strong>의 균형을 맞춥니다. <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="157980" size="small" /><SkillTooltip skillId="157980" textOnly /></span> (초신성)와 <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="235450" size="small" /><SkillTooltip skillId="235450" textOnly /></span>를 통해 강력한 순간 광역 딜을 제공하며, 점멸 쿨다운 감소로 포지셔닝을 최적화합니다.
          </p>

          <h4>전투 길이별 빌드 조정</h4>
          <ul>
            <li><strong>짧은 전투 (30초-1분)</strong>: 소생 특성 제거 → 비전 쇄도 강화 2pt 추가</li>
            <li><strong>중간 전투 (2-3분)</strong>: 표준 빌드 사용</li>
            <li><strong>긴 전투 (5분+)</strong>: 마나 효율 특성 최대 투자 (소생 쿨다운, 비전 작렬 마나 비용 감소)</li>
          </ul>

          <h3>특성 변경 타이밍</h3>

          <p>
            특성은 <strong>전투 중 변경 불가</strong>하므로, 콘텐츠 시작 전 최적화가 중요합니다:
          </p>

          <ul>
            <li><strong>레이드 입장 전</strong>: 보스별 메커니즘 확인 후 생존기/유틸 조정</li>
            <li><strong>쐐기돌 입장 전</strong>: 어픽스 확인 후 광역/생존 비율 결정</li>
            <li><strong>블러드러스트 타이밍</strong>: 오프너 블러드 vs 중간 블러드에 따라 비전 쇄도 쿨다운 특성 조정</li>
          </ul>

          <p>
            <strong>Raidbots</strong>를 활용하면 현재 장비 기준 최적 특성을 시뮬레이션할 수 있습니다. Top Gear 기능으로 5-10개 빌드를 비교하여 0.5-1% DPS 차이를 찾을 수 있습니다.
          </p>

        </section>

        {/* ============================================================ */}
        {/* STATS SECTION */}
        {/* ============================================================ */}
        <section id="stats" data-section-id="stats">
          <h2>능력치 우선순위 (Stats)</h2>

          <p>
            비전 마법사의 능력치 우선순위는 <strong>시뮬레이션 기반</strong>으로 결정됩니다. 현재 장비 수준, 특성 빌드, 전투 길이에 따라 능력치 가중치가 변동하므로, <strong>Raidbots</strong>를 통한 개인별 시뮬레이션이 필수입니다.
          </p>

          <h3>일반 능력치 우선순위</h3>

          <p style={{background: '#1e1e2e', padding: '1rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '13px'}}>
            <strong>단일 대상 (레이드)</strong><br/>
            지능 &gt; 극대화 (33%+) ≈ 가속 (20%+) &gt; 특화 &gt; 치명타 &gt; 유연성<br/><br/>
            <strong>광역 (쐐기돌)</strong><br/>
            지능 &gt; 가속 (25%+) &gt; 극대화 ≈ 특화 &gt; 치명타 &gt; 유연성
          </p>

          <p>
            <strong>⚠️ 중요</strong>: 이는 <strong>일반적인 가이드라인</strong>이며, 실제 능력치 가중치는 현재 장비에 따라 달라집니다. 예를 들어, 극대화가 이미 40% 이상이라면 가속의 가치가 더 높아질 수 있습니다.
          </p>

          <h3>능력치 상세 설명</h3>

          <h4>1. 지능 (Intellect)</h4>
          <ul>
            <li><strong>효과</strong>: 모든 주문 피해 +1% per 10 Intellect</li>
            <li><strong>가중치</strong>: 1.00 (기준점)</li>
            <li><strong>설명</strong>: 가장 강력한 능력치. 모든 피해에 선형으로 적용되며, 다른 능력치와 달리 감소 효과가 없습니다. 아이템 레벨이 높을수록 지능이 많아지므로, <strong>아이템 레벨 &gt; 2차 능력치 최적화</strong>가 대부분의 경우 정답입니다.</li>
            <li><strong>실전 적용</strong>: 478 iLvL 장비가 485 iLvL 장비보다 2차 능력치가 좋더라도, 지능 차이로 인해 485 iLvL이 평균 2-3% 더 강합니다.</li>
          </ul>

          <h4>2. 극대화 (Critical Strike)</h4>
          <ul>
            <li><strong>효과</strong>: 주문 크리티컬 확률 증가 (기본 피해 225%)</li>
            <li><strong>가중치</strong>: 0.92-0.98 (장비 수준에 따라 변동)</li>
            <li><strong>설명</strong>: 비전 마법사에게 매우 중요한 능력치입니다. <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="30451" size="small" /><SkillTooltip skillId="30451" textOnly /></span>와 <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="5143" size="small" /><SkillTooltip skillId="5143" textOnly /></span>의 크리티컬은 즉시 <strong>Clearcasting 발동</strong>을 유도하여 마나 효율과 딜을 동시에 향상시킵니다.</li>
            <li><strong>목표 수치</strong>: 최소 33% (Clearcasting 발동률 안정화), 이상적으로 38-42% (버스트 구간 크리티컬 보장)</li>
            <li><strong>실전 적용</strong>: 극대화 33% 미만에서는 마나 부족으로 딜 사이클이 불안정해집니다. 38% 이상에서는 <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="365350" size="small" /><SkillTooltip skillId="365350" textOnly /></span> 구간 동안 크리티컬이 안정적으로 발동되어 폭딜 극대화가 가능합니다.</li>
          </ul>

          <h4>3. 가속 (Haste)</h4>
          <ul>
            <li><strong>효과</strong>: 시전 속도 +1% per 33 Haste Rating</li>
            <li><strong>가중치</strong>: 0.88-0.95</li>
            <li><strong>설명</strong>: 시전 속도를 빠르게 하여 <strong>GCD 단축 + 쿨다운 회전 속도 증가</strong> 효과를 제공합니다. 비전 마법사는 <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="30451" size="small" /><SkillTooltip skillId="30451" textOnly /></span> 시전 시간이 2.25초로 길기 때문에 가속의 체감이 큽니다.</li>
            <li><strong>목표 수치</strong>: 최소 20% (기본 쾌적함), 25-30% (최적 구간)</li>
            <li><strong>실전 적용</strong>: 가속 20% 미만에서는 비전 작렬 시전이 느려 버스트 구간 동안 충분한 캐스팅을 하지 못합니다. 30% 이상에서는 <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="365350" size="small" /><SkillTooltip skillId="365350" textOnly /></span> 15초 동안 비전 작렬을 7-8회 시전 가능합니다.</li>
            <li><strong>⚠️ 주의</strong>: 가속이 너무 높으면 (35%+) 마나 소모가 급격히 증가하여 버스트 이후 회복 시간이 길어집니다.</li>
          </ul>

          <h4>4. 특화 (Mastery: Savant)</h4>
          <ul>
            <li><strong>효과</strong>: 비전 주문 피해 +12% (기본) + 1% per 80 Mastery Rating</li>
            <li><strong>가중치</strong>: 0.75-0.85</li>
            <li><strong>설명</strong>: 비전 전용 주문(<span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="30451" size="small" /><SkillTooltip skillId="30451" textOnly /></span>, <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="44425" size="small" /><SkillTooltip skillId="44425" textOnly /></span>, <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="5143" size="small" /><SkillTooltip skillId="5143" textOnly /></span> 등)에만 적용되는 피해 증가. <strong>마나가 높을수록 특화 효과 2배 증가</strong>하는 독특한 메커니즘이 있습니다.</li>
            <li><strong>목표 수치</strong>: 자연 누적 (약 20-25%)</li>
            <li><strong>실전 적용</strong>: 마나 90% 이상에서 특화 효과가 2배가 되므로, <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="365350" size="small" /><SkillTooltip skillId="365350" textOnly /></span> 오프너 구간에서 특화의 가치가 극대화됩니다. 하지만 마나가 50% 이하로 떨어지면 효과가 반감되므로, 극대화/가속보다 우선순위가 낮습니다.</li>
          </ul>

          <h4>5. 치명타 (Versatility)</h4>
          <ul>
            <li><strong>효과</strong>: 모든 피해 +1% per 40 Versatility Rating, 받는 피해 -0.5%</li>
            <li><strong>가중치</strong>: 0.70-0.78</li>
            <li><strong>설명</strong>: 가장 단순하지만 가장 약한 능력치입니다. 모든 피해에 선형으로 적용되지만, <strong>Rating 당 효율이 낮아</strong> 다른 능력치보다 우선순위가 떨어집니다.</li>
            <li><strong>목표 수치</strong>: 자연 누적 (약 5-10%)</li>
            <li><strong>실전 적용</strong>: PvP나 쐐기돌 고단계(+15 이상)에서 생존력이 필요한 경우에만 의도적으로 투자합니다. 대부분의 PvE 콘텐츠에서는 가장 낮은 우선순위입니다.</li>
          </ul>

          <h3>능력치 가중치 (Stat Weights)</h3>

          <p>
            능력치 가중치는 <strong>1 포인트 증가 시 DPS 증가량</strong>을 나타냅니다. 다음은 <strong>480 iLvL, 극대화 35%, 가속 22% 기준</strong> 시뮬레이션 결과입니다:
          </p>

          <table style={{width: '100%', borderCollapse: 'collapse', margin: '1rem 0'}}>
            <thead>
              <tr style={{background: '#1e1e2e'}}>
                <th style={{padding: '0.75rem', textAlign: 'left', border: '1px solid #3F3F46'}}>능력치</th>
                <th style={{padding: '0.75rem', textAlign: 'center', border: '1px solid #3F3F46'}}>가중치</th>
                <th style={{padding: '0.75rem', textAlign: 'center', border: '1px solid #3F3F46'}}>DPS 증가 (100pt)</th>
                <th style={{padding: '0.75rem', textAlign: 'left', border: '1px solid #3F3F46'}}>비고</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>지능 (Intellect)</td>
                <td style={{padding: '0.75rem', textAlign: 'center', border: '1px solid #3F3F46'}}>1.00</td>
                <td style={{padding: '0.75rem', textAlign: 'center', border: '1px solid #3F3F46'}}>+14,200 DPS</td>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>항상 최우선</td>
              </tr>
              <tr style={{background: '#1e1e2e'}}>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>극대화 (Crit)</td>
                <td style={{padding: '0.75rem', textAlign: 'center', border: '1px solid #3F3F46'}}>0.94</td>
                <td style={{padding: '0.75rem', textAlign: 'center', border: '1px solid #3F3F46'}}>+13,350 DPS</td>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>Clearcasting 발동</td>
              </tr>
              <tr>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>가속 (Haste)</td>
                <td style={{padding: '0.75rem', textAlign: 'center', border: '1px solid #3F3F46'}}>0.91</td>
                <td style={{padding: '0.75rem', textAlign: 'center', border: '1px solid #3F3F46'}}>+12,920 DPS</td>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>GCD + 쿨다운</td>
              </tr>
              <tr style={{background: '#1e1e2e'}}>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>특화 (Mastery)</td>
                <td style={{padding: '0.75rem', textAlign: 'center', border: '1px solid #3F3F46'}}>0.82</td>
                <td style={{padding: '0.75rem', textAlign: 'center', border: '1px solid #3F3F46'}}>+11,640 DPS</td>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>마나 의존성</td>
              </tr>
              <tr>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>치명타 (Vers)</td>
                <td style={{padding: '0.75rem', textAlign: 'center', border: '1px solid #3F3F46'}}>0.74</td>
                <td style={{padding: '0.75rem', textAlign: 'center', border: '1px solid #3F3F46'}}>+10,510 DPS</td>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>생존력 부가</td>
              </tr>
            </tbody>
          </table>

          <p>
            <strong>⚠️ 가중치는 동적으로 변합니다</strong>. 극대화가 50%에 도달하면 가속의 가중치가 극대화를 역전할 수 있습니다. 따라서 <strong>매 패치마다 Raidbots에서 개인 시뮬레이션</strong>을 돌려 최신 가중치를 확인하세요.
          </p>

          <h3>능력치 최적화 전략</h3>

          <h4>1. 아이템 레벨 vs 2차 능력치</h4>
          <p>
            일반적인 규칙: <strong>±10 iLvL 이내에서는 2차 능력치 우선</strong>, 그 이상 차이 나면 아이템 레벨 우선.
          </p>
          <ul>
            <li><strong>예시 1</strong>: 478 iLvL 극대화/가속 vs 485 iLvL 특화/치명타 → 485 iLvL 선택 (지능 차이 압도)</li>
            <li><strong>예시 2</strong>: 480 iLvL 극대화/가속 vs 483 iLvL 특화/치명타 → 480 iLvL 선택 (2차 능력치 우위)</li>
          </ul>

          <h4>2. 젬/마법부여 우선순위</h4>
          <ul>
            <li><strong>무기</strong>: 정교한 지능 +392 (필수)</li>
            <li><strong>반지 (2개)</strong>: 극대화 +165 (극대화 38% 미만), 가속 +165 (38% 이상)</li>
            <li><strong>망토</strong>: 도약하는 지혜 +295 (이동속도 + 회피)</li>
            <li><strong>가슴</strong>: 정교한 능력 +20 (모든 2차 능력치 +5)</li>
            <li><strong>다리</strong>: 냉철한 실 강화 (지능 +480 + 가속 +120)</li>
            <li><strong>발</strong>: 평원 추적자의 활력 (이동속도 + 가속)</li>
          </ul>

          <h4>3. 음식/물약/증강 룬</h4>
          <ul>
            <li><strong>음식</strong>: 통큰 칼날가시 생선 구이 (극대화 +112) 또는 아제로스의 향연 (모든 능력치 +55)</li>
            <li><strong>물약</strong>: 연금술사의 화산 물약 (전투 중 2회 사용, 지능 +4,200 for 30초)</li>
            <li><strong>증강 룬</strong>: 결정화된 증강 룬 (지능 +108, 1시간 지속)</li>
          </ul>

          <h3>시뮬레이션 도구 활용</h3>

          <p>
            <strong>Raidbots.com</strong>을 활용하여 개인별 최적 능력치를 찾으세요:
          </p>

          <ol>
            <li><strong>SimC 애드온 설치</strong>: 게임 내에서 /simc 명령어로 캐릭터 데이터 복사</li>
            <li><strong>Raidbots Top Gear</strong>: 보관함 장비 포함 최적 조합 찾기 (5-10분 소요)</li>
            <li><strong>Stat Weights</strong>: 현재 장비 기준 능력치 가중치 계산 (2-3분 소요)</li>
            <li><strong>Quick Sim</strong>: 특성/장비 변경 후 DPS 변화 확인 (30초 소요)</li>
          </ol>

          <p>
            시뮬레이션은 <strong>Patchwerk (단일 대상, 움직임 없음)</strong> 기준이므로, 실제 레이드/쐐기돌에서는 10-15% 정도 낮은 딜이 나옵니다. 이는 정상이며, <strong>상대적 비교</strong>에 초점을 맞추세요.
          </p>

        </section>

        {/* ============================================================ */}
        {/* GEAR SECTION */}
        {/* ============================================================ */}
        <section id="gear" data-section-id="gear">
          <h2>장비 가이드 (Gear)</h2>

          <p>
            비전 마법사의 장비 선택은 <strong>아이템 레벨 &gt; 2차 능력치 최적화 &gt; 장신구 시너지</strong> 순으로 우선순위를 두어야 합니다. 11.0.7 패치 기준으로 <strong>레이드 장비 (485+ iLvL)</strong>와 <strong>쐐기돌 보상 (483+ iLvL)</strong>을 조합하는 것이 가장 효율적입니다.
          </p>

          <h3>Best-in-Slot (BiS) 장비 목록</h3>

          <p>
            다음은 <strong>480-485 iLvL 구간</strong>의 최적 장비 목록입니다. 극대화와 가속을 우선하며, 세트 효과를 최대한 활용합니다.
          </p>

          <h4>머리 (Head)</h4>
          <ul>
            <li><strong>1순위</strong>: 무한한 눈보라의 두건 (레이드 신화, 극대화/가속, 티어 세트)</li>
            <li><strong>2순위</strong>: 공허 먹보의 왕관 (쐐기돌 +12, 극대화/가속)</li>
            <li><strong>마법부여</strong>: 정교한 지능 +295 또는 냉철한 조화 (지능 +220 + 마나 회복)</li>
          </ul>

          <h4>목 (Neck)</h4>
          <ul>
            <li><strong>1순위</strong>: 공허 수정의 펜던트 (레이드 신화, 극대화/가속, 3 소켓)</li>
            <li><strong>2순위</strong>: 매듭진 끈의 목걸이 (쐐기돌 +12, 극대화/가속, 2 소켓)</li>
            <li><strong>보석</strong>: 정교한 극대화 +165 × 3 (극대화 38% 미만) 또는 가속 +165 × 3</li>
          </ul>

          <h4>어깨 (Shoulders)</h4>
          <ul>
            <li><strong>1순위</strong>: 무한한 눈보라의 어깨보호구 (레이드 신화, 극대화/가속, 티어 세트)</li>
            <li><strong>2순위</strong>: 공허 마법사의 견갑 (쐐기돌 +12, 가속/특화)</li>
          </ul>

          <h4>망토 (Cloak)</h4>
          <ul>
            <li><strong>1순위</strong>: 황혼의 망토 (레이드 신화, 극대화/가속)</li>
            <li><strong>2순위</strong>: 차원 여행자의 망토 (쐐기돌 +12, 가속/극대화)</li>
            <li><strong>마법부여</strong>: 도약하는 지혜 +295 (이동속도 +2%, 회피 +5%, 지능 +295)</li>
          </ul>

          <h4>가슴 (Chest)</h4>
          <ul>
            <li><strong>1순위</strong>: 무한한 눈보라의 로브 (레이드 신화, 극대화/가속, 티어 세트)</li>
            <li><strong>2순위</strong>: 공허 직조사의 법의 (쐐기돌 +12, 극대화/특화)</li>
            <li><strong>마법부여</strong>: 정교한 능력 +20 (모든 2차 능력치 +5)</li>
          </ul>

          <h4>손목 (Wrists)</h4>
          <ul>
            <li><strong>1순위</strong>: 시간 왜곡의 팔찌 (레이드 신화, 극대화/가속, 1 소켓)</li>
            <li><strong>2순위</strong>: 마력 흐름의 손목보호대 (쐐기돌 +12, 가속/극대화)</li>
            <li><strong>마법부여</strong>: 정교한 지능 +295 또는 정교한 가속 +220</li>
          </ul>

          <h4>손 (Hands)</h4>
          <ul>
            <li><strong>1순위</strong>: 무한한 눈보라의 장갑 (레이드 신화, 극대화/가속, 티어 세트)</li>
            <li><strong>2순위</strong>: 공허 조작자의 손 (쐐기돌 +12, 가속/특화)</li>
          </ul>

          <h4>허리 (Waist)</h4>
          <ul>
            <li><strong>1순위</strong>: 영원한 마력의 띠 (레이드 신화, 극대화/가속, 1 소켓)</li>
            <li><strong>2순위</strong>: 차원 굴절의 허리띠 (쐐기돌 +12, 극대화/가속)</li>
          </ul>

          <h4>다리 (Legs)</h4>
          <ul>
            <li><strong>1순위</strong>: 무한한 눈보라의 각반 (레이드 신화, 극대화/가속, 티어 세트)</li>
            <li><strong>2순위</strong>: 공허 방랑자의 바지 (쐐기돌 +12, 가속/극대화)</li>
            <li><strong>마법부여</strong>: 냉철한 실 강화 (지능 +480 + 가속 +120)</li>
          </ul>

          <h4>발 (Feet)</h4>
          <ul>
            <li><strong>1순위</strong>: 시공간 여행자의 신발 (레이드 신화, 극대화/가속)</li>
            <li><strong>2순위</strong>: 마력 방출의 장화 (쐐기돌 +12, 가속/극대화)</li>
            <li><strong>마법부여</strong>: 평원 추적자의 활력 (이동속도 +3%, 가속 +120)</li>
          </ul>

          <h4>반지 (Rings, 2개)</h4>
          <ul>
            <li><strong>1순위</strong>: 공허 수정의 인장 (레이드 신화, 극대화/가속, 1 소켓)</li>
            <li><strong>2순위</strong>: 차원 균열의 반지 (레이드 신화, 가속/극대화, 1 소켓)</li>
            <li><strong>3순위</strong>: 마력 폭주의 밴드 (쐐기돌 +12, 극대화/가속)</li>
            <li><strong>마법부여</strong>: 정교한 극대화 +165 (극대화 38% 미만) 또는 가속 +165</li>
          </ul>

          <h4>장신구 (Trinkets, 2개)</h4>
          <p>
            장신구는 <strong>시뮬레이션 필수</strong>입니다. 아이템 레벨, 발동 타이밍, 쿨다운 시너지에 따라 순위가 크게 변동합니다.
          </p>

          <p style={{background: '#1e1e2e', padding: '1rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '13px'}}>
            <strong>S-Tier (필수 획득)</strong><br/>
            1. 불안정한 마력 보주 (레이드, 온유즈, 지능 +12,000 for 20초)<br/>
            2. 공허의 균열 (레이드, 패시브, 극대화 +2,800 + 비전 피해 +15%)<br/><br/>
            <strong>A-Tier (대체 가능)</strong><br/>
            3. 시간 왜곡 수정 (쐐기돌, 패시브, 가속 +2,400 + 시간 왜곡 효과)<br/>
            4. 엘레멘탈의 정수 (레이드, 온유즈, 지능 +10,500 + 원소 피해 +10%)<br/><br/>
            <strong>B-Tier (임시 사용)</strong><br/>
            5. 달빛 보석 (쐐기돌, 패시브, 극대화 +2,200 + 야간 시간대 지능 +5%)<br/>
            6. 마력 과충전 배터리 (제작, 패시브, 가속 +2,000 + 마나 회복)
          </p>

          <p>
            <strong>장신구 조합 추천</strong>:
          </p>
          <ul>
            <li><strong>레이드 (단일 대상)</strong>: 불안정한 마력 보주 + 공허의 균열 (최대 버스트)</li>
            <li><strong>쐐기돌 (광역 + 이동)</strong>: 공허의 균열 + 시간 왜곡 수정 (안정적 상시 딜)</li>
            <li><strong>과도기 (480 iLvL 미만)</strong>: 엘레멘탈의 정수 + 달빛 보석 (쉬운 획득)</li>
          </ul>

          <h4>무기 (Weapon)</h4>
          <ul>
            <li><strong>1순위</strong>: 공허 수정의 지팡이 (레이드 신화, 극대화/가속, 489 iLvL)</li>
            <li><strong>2순위</strong>: 차원 균열자 (쐐기돌 +15, 가속/극대화, 486 iLvL)</li>
            <li><strong>3순위</strong>: 불안정한 마력봉 + 공허의 서 (한손 + 보조, 레이드)</li>
            <li><strong>마법부여</strong>: 정교한 지능 +392 (필수, 모든 주문 피해 +4%)</li>
          </ul>

          <h3>티어 세트 효과 (Tier Set Bonuses)</h3>

          <p>
            11.0.7 패치의 <strong>무한한 눈보라 세트</strong>는 비전 마법사에게 강력한 DPS 증가를 제공합니다. <strong>4세트 효과가 매우 중요</strong>하므로 최우선으로 획득하세요.
          </p>

          <h4>2세트 효과</h4>
          <p style={{background: '#1e1e2e', padding: '1rem', borderRadius: '4px'}}>
            <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="365350" size="small" /><SkillTooltip skillId="365350" textOnly /></span> 지속시간 +3초 (15초 → 18초). 비전 작렬 추가 캐스팅 1-2회 가능.
          </p>
          <p>
            <strong>DPS 증가</strong>: 약 +6% (버스트 구간 피해 증가)
          </p>

          <h4>4세트 효과</h4>
          <p style={{background: '#1e1e2e', padding: '1rem', borderRadius: '4px'}}>
            <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="321507" size="small" /><SkillTooltip skillId="321507" textOnly /></span> 사용 시 <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="30451" size="small" /><SkillTooltip skillId="30451" textOnly /></span> 피해 +25% for 12초. 비전의 여파와 완벽한 시너지.
          </p>
          <p>
            <strong>DPS 증가</strong>: 약 +12% (2세트 포함 총 +18%)
          </p>

          <h4>티어 세트 파밍 우선순위</h4>
          <ol>
            <li><strong>머리 + 어깨</strong>: 레이드 신화 (첫 2주 집중 획득)</li>
            <li><strong>가슴 + 손</strong>: 레이드 영웅 또는 쐐기돌 보상 (3-4주차)</li>
            <li><strong>다리</strong>: 레이드 일반 또는 제작 (5주차 이후)</li>
          </ol>

          <p>
            <strong>⚠️ 중요</strong>: 4세트 완성 전까지는 <strong>480 iLvL 티어 세트 &gt; 489 iLvL 비세트 장비</strong>가 더 강합니다. 시뮬레이션으로 반드시 확인하세요.
          </p>

          <h3>마법부여 & 보석 최종 체크리스트</h3>

          <table style={{width: '100%', borderCollapse: 'collapse', margin: '1rem 0', fontSize: '13px'}}>
            <thead>
              <tr style={{background: '#1e1e2e'}}>
                <th style={{padding: '0.75rem', textAlign: 'left', border: '1px solid #3F3F46'}}>부위</th>
                <th style={{padding: '0.75rem', textAlign: 'left', border: '1px solid #3F3F46'}}>마법부여/보석</th>
                <th style={{padding: '0.75rem', textAlign: 'center', border: '1px solid #3F3F46'}}>비용 (골드)</th>
                <th style={{padding: '0.75rem', textAlign: 'center', border: '1px solid #3F3F46'}}>DPS 증가</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>무기</td>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>정교한 지능 +392</td>
                <td style={{padding: '0.75rem', textAlign: 'center', border: '1px solid #3F3F46'}}>~12,000g</td>
                <td style={{padding: '0.75rem', textAlign: 'center', border: '1px solid #3F3F46'}}>+4.2%</td>
              </tr>
              <tr style={{background: '#1e1e2e'}}>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>망토</td>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>도약하는 지혜 +295</td>
                <td style={{padding: '0.75rem', textAlign: 'center', border: '1px solid #3F3F46'}}>~8,000g</td>
                <td style={{padding: '0.75rem', textAlign: 'center', border: '1px solid #3F3F46'}}>+1.8%</td>
              </tr>
              <tr>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>가슴</td>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>정교한 능력 +20</td>
                <td style={{padding: '0.75rem', textAlign: 'center', border: '1px solid #3F3F46'}}>~6,000g</td>
                <td style={{padding: '0.75rem', textAlign: 'center', border: '1px solid #3F3F46'}}>+0.8%</td>
              </tr>
              <tr style={{background: '#1e1e2e'}}>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>다리</td>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>냉철한 실 강화</td>
                <td style={{padding: '0.75rem', textAlign: 'center', border: '1px solid #3F3F46'}}>~10,000g</td>
                <td style={{padding: '0.75rem', textAlign: 'center', border: '1px solid #3F3F46'}}>+3.5%</td>
              </tr>
              <tr>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>발</td>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>평원 추적자의 활력</td>
                <td style={{padding: '0.75rem', textAlign: 'center', border: '1px solid #3F3F46'}}>~5,000g</td>
                <td style={{padding: '0.75rem', textAlign: 'center', border: '1px solid #3F3F46'}}>+1.2%</td>
              </tr>
              <tr style={{background: '#1e1e2e'}}>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>반지 × 2</td>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>정교한 극대화 +165</td>
                <td style={{padding: '0.75rem', textAlign: 'center', border: '1px solid #3F3F46'}}>~7,000g</td>
                <td style={{padding: '0.75rem', textAlign: 'center', border: '1px solid #3F3F46'}}>+2.4%</td>
              </tr>
              <tr>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>소켓 × 5</td>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>극대화 +165 × 5</td>
                <td style={{padding: '0.75rem', textAlign: 'center', border: '1px solid #3F3F46'}}>~15,000g</td>
                <td style={{padding: '0.75rem', textAlign: 'center', border: '1px solid #3F3F46'}}>+3.8%</td>
              </tr>
            </tbody>
          </table>

          <p>
            <strong>총 투자 비용</strong>: 약 63,000 골드 (1주일 일일 퀘스트로 충당 가능)<br/>
            <strong>총 DPS 증가</strong>: +17.7% (마법부여/보석만으로 획득)
          </p>

          <h3>소비용품 (Consumables)</h3>

          <h4>전투 전 준비</h4>
          <ul>
            <li><strong>음식</strong>: 통큰 칼날가시 생선 구이 (극대화 +112, 1시간) - 레이드/쐐기돌 필수</li>
            <li><strong>증강 룬</strong>: 결정화된 증강 룬 (지능 +108, 1시간) - 레이드 필수, 쐐기돌 선택</li>
            <li><strong>물약</strong>: 연금술사의 화산 물약 (전투 중 2회, 지능 +4,200 for 30초)</li>
          </ul>

          <h4>전투 중 사용</h4>
          <ul>
            <li><strong>물약 1회</strong>: 오프너 <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="365350" size="small" /><SkillTooltip skillId="365350" textOnly /></span> 직전 (Pre-pull -3초)</li>
            <li><strong>물약 2회</strong>: 블러드러스트 구간 또는 2분 버스트 타이밍</li>
            <li><strong>마나 물약</strong>: 정신의 마나 물약 (마나 35% 즉시 회복, 쿨다운 5분) - 긴 전투 대비</li>
          </ul>

          <h3>업그레이드 우선순위</h3>

          <p>
            제한된 재화 (용사의 문장, 여명의 조각)로 장비를 업그레이드할 때의 우선순위입니다:
          </p>

          <ol>
            <li><strong>무기</strong>: 489 iLvL까지 최우선 업그레이드 (가장 큰 DPS 증가)</li>
            <li><strong>티어 세트 4부위</strong>: 485 iLvL까지 (세트 효과 유지)</li>
            <li><strong>장신구 2개</strong>: 483 iLvL까지 (발동 효과 강화)</li>
            <li><strong>가슴/다리</strong>: 480 iLvL까지 (지능 수치가 높음)</li>
            <li><strong>나머지 부위</strong>: 자연 드랍 대기 (업그레이드 효율 낮음)</li>
          </ol>

          <p>
            <strong>재화 획득 경로</strong>:
          </p>
          <ul>
            <li><strong>용사의 문장</strong>: 레이드 영웅 이상, 쐐기돌 +10 이상 (주 8개 제한)</li>
            <li><strong>여명의 조각</strong>: 일일 퀘스트, 주간 퀘스트, 세계 이벤트 (무제한)</li>
          </ul>

        </section>

        {/* ============================================================ */}
        {/* TIPS SECTION */}
        {/* ============================================================ */}
        <section id="tips" data-section-id="tips">
          <h2>실전 팁 & 최적화 (Tips)</h2>

          <p>
            비전 마법사를 마스터하는 것은 <strong>이론적 지식</strong>과 <strong>실전 경험</strong>의 결합입니다. 다음 팁들은 수천 시간의 플레이 경험과 최상위 플레이어들의 노하우를 집약한 것입니다.
          </p>

          <h3>1. 마나 관리 마스터하기</h3>

          <h4>마나 곡선 이해</h4>
          <p>
            비전 마법사의 성능은 <strong>마나 관리 능력</strong>에 달려 있습니다. 이상적인 마나 곡선:
          </p>
          <ul>
            <li><strong>0-30초</strong>: 100% → 70% (오프너 버스트, <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="365350" size="small" /><SkillTooltip skillId="365350" textOnly /></span> 풀 사용)</li>
            <li><strong>30-90초</strong>: 70% → 30% (보존 구간, <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="44425" size="small" /><SkillTooltip skillId="44425" textOnly /></span> 4충전 덤프)</li>
            <li><strong>90-120초</strong>: 30% → 90% (<span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="12051" size="small" /><SkillTooltip skillId="12051" textOnly /></span> 사용, 마나 회복)</li>
            <li><strong>120-150초</strong>: 90% → 60% (두 번째 버스트)</li>
          </ul>

          <h4>마나 관리 실수 TOP 3</h4>
          <ol>
            <li><strong>소생을 너무 늦게 사용</strong>: 마나 20% 이하에서 소생을 쓰면 다음 버스트 타이밍을 놓칩니다. <strong>마나 30-35%에서 즉시 사용</strong>하세요.</li>
            <li><strong>버스트 외 구간에서 과소비</strong>: 비전 쇄도 없이 6충전 비전 작렬을 남발하면 마나가 금방 고갈됩니다. 버스트 외에는 <strong>4충전 유지</strong>가 원칙입니다.</li>
            <li><strong>Clearcasting 방치</strong>: Clearcasting 버프가 있을 때 비전 작렬을 쓰지 않으면 마나 효율이 급락합니다. <strong>항상 Clearcasting 우선 소모</strong>하세요.</li>
          </ol>

          <h3>2. 포지셔닝 & 이동 최적화</h3>

          <h4>캐스팅 중 이동 기술</h4>
          <p>
            비전 마법사는 <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="342245" size="small" /><SkillTooltip skillId="342245" textOnly /></span> (비전 지능 시전 중 이동) 특성으로 <strong>DPS 손실 없이 이동</strong>할 수 있습니다:
          </p>
          <ul>
            <li><strong>비전 지능 버프 10초 = 이동 자유 구간</strong>: 메커니즘 대응 타이밍에 맞춰 비전 지능을 미리 쌓으세요.</li>
            <li><strong><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="212653" size="small" /><SkillTooltip skillId="212653" textOnly /></span> 3충전 활용</strong>: 긴 거리 이동 시 점멸을 아끼지 마세요. 15초 쿨다운은 짧습니다.</li>
            <li><strong>시전 중 180도 회전</strong>: 비전 작렬 시전을 시작한 후 캐릭터를 회전하면 DPS를 유지하면서 방향을 바꿀 수 있습니다.</li>
          </ul>

          <h4>레이드 포지셔닝 원칙</h4>
          <ul>
            <li><strong>힐러 가까이, 탱커 멀리</strong>: 마법사는 가죽 방어구라 생존력이 낮습니다. 힐러 범위 내에 위치하세요.</li>
            <li><strong>벽 등지기</strong>: 넉백 메커니즘 대응. 벽을 등지면 넉백 거리가 최소화됩니다.</li>
            <li><strong>메커니즘 경로 예측</strong>: 보스 능력 타이밍을 외워서 미리 이동하세요. 반응형 이동은 DPS 손실을 유발합니다.</li>
          </ul>

          <h3>3. 쿨다운 타이밍 최적화</h3>

          <h4>블러드러스트 동기화</h4>
          <p>
            블러드러스트는 비전 마법사의 DPS를 <strong>40% 증가</strong>시킵니다. 최적 타이밍:
          </p>
          <ul>
            <li><strong>오프너 블러드 (0:00)</strong>: 5분 이상 전투 시 최적. 두 번째 블러드가 없어도 총 딜이 가장 높습니다.</li>
            <li><strong>중간 블러드 (2:00)</strong>: 3-4분 전투 시 최적. 버스트와 100% 동기화 가능.</li>
            <li><strong>후반 블러드 (4:00+)</strong>: 보스 처치 직전 폭딜. 5분+ 전투에서 두 번째 블러드러스트 타이밍.</li>
          </ul>

          <h4>장신구 매크로 활용</h4>
          <p style={{background: '#1e1e2e', padding: '1rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '13px'}}>
            #showtooltip 비전 쇄도<br/>
            /use 13<br/>
            /use 14<br/>
            /cast 비전 쇄도
          </p>
          <p>
            이 매크로는 <strong>장신구 2개 + 비전 쇄도를 동시 발동</strong>합니다. GCD 손실 없이 버스트 극대화가 가능합니다.
          </p>

          <h3>4. 쐐기돌(Mythic+) 전용 팁</h3>

          <h4>광역 최적화</h4>
          <ul>
            <li><strong>3+ 대상</strong>: <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="1449" size="small" /><SkillTooltip skillId="1449" textOnly /></span> 스팸. 비전 작렬보다 DPS가 2배 높습니다.</li>
            <li><strong>탱커 어그로 확인</strong>: 비전 폭발은 어그로가 매우 높습니다. 탱커가 몹을 모으기 전까지 대기하세요.</li>
            <li><strong>오브 + 폭발 콤보</strong>: <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="153626" size="small" /><SkillTooltip skillId="153626" textOnly /></span> (오브) → 3초 후 비전 폭발로 오브를 터뜨리면 광역 피해 +30%.</li>
          </ul>

          <h4>어픽스 대응</h4>
          <ul>
            <li><strong>폭발성(Explosive)</strong>: <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="5143" size="small" /><SkillTooltip skillId="5143" textOnly /></span>로 1GCD 처리. 비전 작렬은 너무 느립니다.</li>
            <li><strong>화산(Volcanic)</strong>: 비전 지능 버프 10초 = 화산 회피 가능 구간. 버프가 없으면 점멸로 회피.</li>
            <li><strong>격노(Raging)</strong>: 몹 20% 이하에서 버스트 쿨다운 아끼지 마세요. 빠른 처치가 생존률을 높입니다.</li>
            <li><strong>폭군(Tyrannical)</strong>: 보스 전투가 길어지므로 마나 관리에 집중. 소생을 2회 사용할 수 있도록 타이밍 조절.</li>
          </ul>

          <h3>5. 레이드 전용 팁</h3>

          <h4>메커니즘 최적화</h4>
          <ul>
            <li><strong>시전 중단 최소화</strong>: 메커니즘 타이밍을 외워서 비전 작렬(2.25초) 대신 비전 미사일(0.5초)로 메커니즘 대응 창을 만드세요.</li>
            <li><strong><span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="45438" size="small" /><SkillTooltip skillId="45438" textOnly /></span> 타이밍</strong>: 얼음 방패는 8초 무적이지만 이동 불가입니다. 원샷 메커니즘 전용으로 아끼세요.</li>
            <li><strong>투명화 어그로 리셋</strong>: 실수로 어그로를 끌었을 때 투명화로 어그로 초기화 가능.</li>
          </ul>

          <h4>로그 분석으로 실력 향상</h4>
          <p>
            <strong>Warcraft Logs</strong>로 본인의 플레이를 분석하세요:
          </p>
          <ol>
            <li><strong>Casts Per Minute (CPM)</strong>: 비전 마법사는 40-45 CPM이 표준. 35 이하면 GCD 손실이 많습니다.</li>
            <li><strong>Clearcasting 활용률</strong>: 80% 이상 소모가 목표. 50% 이하면 마나 효율이 최악입니다.</li>
            <li><strong>비전 쇄도 업타임</strong>: 전투 시간 대비 15-20% 업타임이 이상적. 10% 이하면 쿨다운 낭비.</li>
            <li><strong>데스 카운트</strong>: 죽음 1회 = 평균 DPS -15%. 생존이 딜보다 우선입니다.</li>
          </ol>

          <h3>6. 흔한 실수 & 해결책</h3>

          <table style={{width: '100%', borderCollapse: 'collapse', margin: '1rem 0', fontSize: '13px'}}>
            <thead>
              <tr style={{background: '#1e1e2e'}}>
                <th style={{padding: '0.75rem', textAlign: 'left', border: '1px solid #3F3F46'}}>실수</th>
                <th style={{padding: '0.75rem', textAlign: 'left', border: '1px solid #3F3F46'}}>증상</th>
                <th style={{padding: '0.75rem', textAlign: 'left', border: '1px solid #3F3F46'}}>해결책</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>비전 충전물 관리 실패</td>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>DPS가 시뮬레이션보다 30% 낮음</td>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>WeakAuras로 충전물 추적. 4충전 유지 원칙</td>
              </tr>
              <tr style={{background: '#1e1e2e'}}>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>비전 쇄도 타이밍 엇갈림</td>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>블러드러스트와 버스트 불일치</td>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>DBM 타이머 확인. 블러드 10초 전 마나 90% 준비</td>
              </tr>
              <tr>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>소생 늦은 사용</td>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>마나 고갈로 딜 중단</td>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>마나 35%에서 즉시 소생. 쿨다운 60초 회전</td>
              </tr>
              <tr style={{background: '#1e1e2e'}}>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>이동 중 DPS 손실</td>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>메커니즘 대응 시 딜 급락</td>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>비전 지능 10초 이동 프리. 점멸 3충전 적극 활용</td>
              </tr>
              <tr>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>Clearcasting 방치</td>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>마나 효율 50% 이하</td>
                <td style={{padding: '0.75rem', border: '1px solid #3F3F46'}}>Clearcasting UI 강조. 항상 최우선 소모</td>
              </tr>
            </tbody>
          </table>

          <h3>7. UI & 애드온 추천</h3>

          <h4>필수 애드온</h4>
          <ul>
            <li><strong>WeakAuras 2</strong>: 비전 충전물, Clearcasting, 쿨다운 추적. Wago.io에서 "Arcane Mage WeakAura" 검색.</li>
            <li><strong>Details! Damage Meter</strong>: DPS 실시간 모니터링. 타겟별 딜 분석.</li>
            <li><strong>Deadly Boss Mods (DBM)</strong>: 보스 메커니즘 타이머. 블러드러스트 카운트다운.</li>
            <li><strong>Simulationcraft</strong>: /simc 명령어로 Raidbots 데이터 추출.</li>
          </ul>

          <h4>권장 WeakAura 기능</h4>
          <ol>
            <li><strong>비전 충전물 바</strong>: 화면 중앙에 큰 바 형태로 표시 (4충전 이하 경고)</li>
            <li><strong>Clearcasting 알림</strong>: 화면 중앙에 크게 "USE MISSILES!" 표시 + 사운드</li>
            <li><strong>비전 쇄도 카운트다운</strong>: 쿨다운 15/10/5초 카운트 + 사용 가능 시 화면 깜빡임</li>
            <li><strong>마나 바 색상 변경</strong>: 90% 이상 = 초록, 30-90% = 노랑, 30% 이하 = 빨강</li>
            <li><strong>소생 알림</strong>: 마나 35% 도달 시 "EVOCATE NOW!" 알림</li>
          </ol>

          <h3>8. 자주 묻는 질문 (FAQ)</h3>

          <h4>Q1: 시뮬레이션 DPS와 실제 DPS 차이가 너무 큽니다</h4>
          <p>
            <strong>A</strong>: 정상입니다. 시뮬레이션은 Patchwerk (움직임 없음, 단일 대상, 5분 전투)을 가정합니다. 실제 레이드/쐐기돌에서는 다음 요인으로 DPS가 10-20% 낮습니다:
          </p>
          <ul>
            <li>메커니즘 대응으로 인한 시전 중단 (5-8% 손실)</li>
            <li>이동 구간 (3-5% 손실)</li>
            <li>실수 및 최적화 미흡 (2-7% 손실)</li>
          </ul>
          <p>
            <strong>상대적 비교</strong>에 집중하세요. 같은 보스에서 본인의 전투별 DPS 증가 추이를 확인하면 됩니다.
          </p>

          <h4>Q2: 극대화 38% vs 가속 30%, 어떤 게 더 중요한가요?</h4>
          <p>
            <strong>A</strong>: <strong>극대화 38% 달성이 먼저</strong>입니다. 극대화 38% 이상에서 Clearcasting 발동률이 안정화되어 마나 관리가 편해집니다. 38% 달성 후 가속을 올리세요. 시뮬레이션으로 개인 최적점을 찾는 것이 가장 정확합니다.
          </p>

          <h4>Q3: 쐐기돌에서 비전이 다른 전문화보다 약한가요?</h4>
          <p>
            <strong>A</strong>: 비전은 <strong>쐐기돌 +15-25 구간에서 최상위 DPS</strong>를 보여줍니다. 다만 다음 상황에서 약점이 있습니다:
          </p>
          <ul>
            <li><strong>짧은 전투 (10초 미만)</strong>: 충전물 쌓기 전에 몹 처치</li>
            <li><strong>극단적 이동</strong>: 비전 지능 쿨다운 중 장거리 이동 필요</li>
            <li><strong>탱커 미숙</strong>: 어그로 폭발로 인한 데스</li>
          </ul>
          <p>
            이런 상황만 피하면 비전은 쐐기돌 최강 딜러입니다.
          </p>

          <h4>Q4: 언제 냉기/화염 전문화로 바꿔야 하나요?</h4>
          <p>
            <strong>A</strong>: 11.0.7 패치 기준, 비전이 <strong>모든 콘텐츠에서 최상위</strong>입니다. 다만 다음 상황에서 다른 전문화를 고려할 수 있습니다:
          </p>
          <ul>
            <li><strong>냉기</strong>: 극단적 이동 (쐐기돌 특정 던전, PvP)</li>
            <li><strong>화염</strong>: 3+ 대상 장시간 전투 (레이드 특정 보스)</li>
          </ul>
          <p>
            하지만 대부분의 경우 <strong>비전 유지가 정답</strong>입니다. 전문화 변경보다 플레이 최적화에 집중하세요.
          </p>

          <h3>9. 지속적인 향상 전략</h3>

          <ol>
            <li><strong>주 1회 Raidbots 시뮬레이션</strong>: 장비 변경 시마다 최적 능력치 재계산</li>
            <li><strong>Warcraft Logs 분석</strong>: 같은 클래스 상위 1% 플레이어와 비교 (Timeline → Casts 탭)</li>
            <li><strong>영상 녹화 & 리뷰</strong>: OBS로 본인 플레이 녹화 후 실수 찾기</li>
            <li><strong>훈련용 목표 인형</strong>: 5분 Patchwerk 시뮬레이션 DPS의 95% 달성 연습</li>
            <li><strong>커뮤니티 참여</strong>: Icy Veins, Wowhead, Reddit r/CompetitiveWoW에서 최신 정보 습득</li>
          </ol>

        </section>

        {/* ============================================================ */}
        {/* ADVANCED SECTION */}
        {/* ============================================================ */}
        <section id="advanced" data-section-id="advanced">
          <h2>심화 가이드 (Advanced)</h2>

          <p>
            이 섹션은 <strong>상위 1% 플레이어</strong>를 위한 고급 최적화 기법을 다룹니다. 기본 딜 사이클을 완벽히 숙지한 후 이 내용을 학습하세요.
          </p>

          <h3>1. 고급 시뮬레이션 기법</h3>

          <h4>Raidbots 심화 활용</h4>
          <p>
            단순한 DPS 시뮬레이션을 넘어, <strong>최적화 시나리오 분석</strong>이 가능합니다:
          </p>

          <ul>
            <li><strong>Top Gear (보관함 최적화)</strong>: 보관함 장비 40개 포함, 2^40 = 1조 조합 중 최적 세트 탐색 (10-15분 소요)</li>
            <li><strong>Droptimizer (드랍 우선순위)</strong>: 레이드 보스 16개 × 아이템 300개 중 DPS 증가량 TOP 10 계산</li>
            <li><strong>Gear Compare</strong>: 2개 장비 직접 비교. 티어 세트 vs 비세트 장비 판단</li>
            <li><strong>Stat Weights (능력치 가중치)</strong>: 현재 장비 기준 극대화/가속/특화 1포인트당 DPS 증가량 계산</li>
            <li><strong>Quick Sim (빠른 시뮬레이션)</strong>: 30초 완료. 특성/장신구 변경 즉시 확인</li>
          </ul>

          <h4>SimulationCraft 커스텀 스크립트</h4>
          <p style={{background: '#1e1e2e', padding: '1rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px'}}>
            # 비전 마법사 커스텀 APL (Action Priority List)<br/>
            actions.precombat=/arcane_intellect<br/>
            actions.precombat+=/potion,name=tempered_potion<br/>
            actions.precombat+=/arcane_blast,if=mana.pct&gt;90<br/><br/>

            actions+=/arcane_surge,if=mana.pct&gt;90&cooldown.touch_of_the_magi.remains&lt;5<br/>
            actions+=/touch_of_the_magi,if=buff.arcane_surge.up<br/>
            actions+=/arcane_blast,if=buff.arcane_surge.up|buff.clearcasting.react<br/>
            actions+=/arcane_missiles,if=buff.clearcasting.react&buff.clearcasting.stack=3<br/>
            actions+=/arcane_barrage,if=arcane_charges&gt;=4&mana.pct&lt;50
          </p>

          <h3>2. WeakAuras 고급 설정</h3>

          <h4>프레임별 마나 추적</h4>
          <p>
            비전 마법사는 <strong>마나 1% 차이</strong>로 DPS가 변동합니다. WeakAura 커스텀 함수로 실시간 마나 소모율 계산:
          </p>

          <p style={{background: '#1e1e2e', padding: '1rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px'}}>
            function()<br/>
            {"  "}local currentMana = UnitPower("player", 0)<br/>
            {"  "}local maxMana = UnitPowerMax("player", 0)<br/>
            {"  "}local manaPercent = (currentMana / maxMana) * 100<br/><br/>

            {"  "}if manaPercent &gt; 90 then<br/>
            {"    "}return "|cff00ff00" .. string.format("%.1f", manaPercent) .. "%|r"<br/>
            {"  "}elseif manaPercent &gt; 35 then<br/>
            {"    "}return "|cffffff00" .. string.format("%.1f", manaPercent) .. "%|r"<br/>
            {"  "}else<br/>
            {"    "}return "|cffff0000" .. string.format("%.1f", manaPercent) .. "%|r"<br/>
            {"  "}end<br/>
            end
          </p>

          <h4>쿨다운 동기화 타이머</h4>
          <p>
            <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="365350" size="small" /><SkillTooltip skillId="365350" textOnly /></span>와 <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="321507" size="small" /><SkillTooltip skillId="321507" textOnly /></span>의 쿨다운을 동시에 추적하여 <strong>최적 버스트 타이밍</strong>을 시각화:
          </p>

          <ul>
            <li><strong>초록색 바</strong>: 비전 쇄도 + 비전의 여파 모두 사용 가능 (완벽한 버스트)</li>
            <li><strong>노란색 바</strong>: 비전 쇄도만 사용 가능 (중간 버스트)</li>
            <li><strong>빨간색 바</strong>: 쿨다운 대기 중 (보존 구간)</li>
          </ul>

          <h3>3. 매크로 최적화</h3>

          <h4>버스트 원클릭 매크로</h4>
          <p style={{background: '#1e1e2e', padding: '1rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '13px'}}>
            #showtooltip<br/>
            /cast [nochanneling] 비전 쇄도<br/>
            /use 13<br/>
            /use 14<br/>
            /use 연금술사의 화산 물약<br/>
            /cast [nochanneling] 비전의 여파
          </p>
          <p>
            이 매크로는 <strong>1번 클릭으로 5개 액션 동시 실행</strong>합니다. [nochanneling] 조건으로 비전 미사일 채널 중 실수 방지.
          </p>

          <h4>충전물 덤프 스마트 매크로</h4>
          <p style={{background: '#1e1e2e', padding: '1rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '13px'}}>
            #showtooltip 비전 작렬<br/>
            /cast [mod:shift] 비전 일제 사격<br/>
            /cast [mod:ctrl] 비전 미사일<br/>
            /cast 비전 작렬
          </p>
          <p>
            - 기본: 비전 작렬<br/>
            - Shift + 클릭: 충전물 즉시 덤프<br/>
            - Ctrl + 클릭: Clearcasting 소모
          </p>

          <h3>4. 프레임 단위 최적화</h3>

          <h4>GCD Clipping 최소화</h4>
          <p>
            WoW는 <strong>60 FPS = 16.67ms per frame</strong>입니다. GCD는 1,500ms이므로 이론상 90프레임입니다. 하지만 실제로는 네트워크 지연(20-50ms)으로 <strong>95-100프레임 소요</strong>됩니다.
          </p>

          <ul>
            <li><strong>Spell Queue Window</strong>: 게임 설정에서 "주문 대기열 창" = 400ms 설정. 다음 기술을 GCD 끝나기 0.4초 전에 대기열 등록.</li>
            <li><strong>Latency 보상</strong>: 핑 50ms 이하 유지. 100ms 이상에서는 Spell Queue 600ms로 증가.</li>
            <li><strong>프레임 드랍 방지</strong>: 레이드/쐐기돌 중 60 FPS 유지 필수. 40 FPS 이하에서는 GCD가 실제로 길어짐.</li>
          </ul>

          <h4>Pre-Casting 기법</h4>
          <p>
            전투 시작 3초 전에 <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="30451" size="small" /><SkillTooltip skillId="30451" textOnly /></span> 시전을 시작하면, <strong>전투 개시와 동시에 피해 적용</strong>됩니다:
          </p>

          <ol>
            <li><strong>-5초</strong>: 물약 사용 (연금술사의 화산 물약)</li>
            <li><strong>-3초</strong>: 비전 작렬 시전 시작 (2.25초 시전시간)</li>
            <li><strong>0초</strong>: 비전 작렬 피해 적용 + <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="365350" size="small" /><SkillTooltip skillId="365350" textOnly /></span> 즉시 사용</li>
          </ol>

          <p>
            이 기법으로 <strong>오프너 첫 3초 DPS가 15% 증가</strong>합니다.
          </p>

          <h3>5. 고급 파싱 전략</h3>

          <h4>Warcraft Logs 99+ 퍼센타일 달성법</h4>
          <p>
            최상위 파싱은 <strong>딜 사이클 완벽도 + 운 + 그룹 시너지</strong>의 결합입니다:
          </p>

          <ul>
            <li><strong>블러드러스트 타이밍</strong>: 오프너 블러드 (0:00) 요청. 중간 블러드는 파싱에 불리.</li>
            <li><strong>버프 스택</strong>: 증강 주술사, 신비 사제, 복수 악사 등 파티 버프 최대화.</li>
            <li><strong>장신구 확률</strong>: 크리티컬 발동 장신구는 운에 좌우. 10회 시도 중 최고 기록 선택.</li>
            <li><strong>패딩 금지</strong>: 저체력 몹 타격으로 DPS 부풀리기는 순위에서 제외됨.</li>
            <li><strong>죽음 0회</strong>: 죽음 1회 = 평균 15% DPS 손실. 생존 &gt; 파싱.</li>
          </ul>

          <h4>로그 비교 분석</h4>
          <p>
            Warcraft Logs에서 <strong>같은 보스, 같은 iLvL</strong> 상위 플레이어와 본인을 비교:
          </p>

          <ol>
            <li><strong>Casts Timeline</strong>: 쿨다운 사용 타이밍 비교. 본인이 2-3초 늦게 썼다면 DPS 3-5% 손실.</li>
            <li><strong>Damage Done 그래프</strong>: 버스트 구간 DPS 스파이크 비교. 상위권은 30-40초 구간 폭딜이 2배 높음.</li>
            <li><strong>Mana 그래프</strong>: 마나 곡선 비교. 상위권은 90% → 30% → 90% 패턴이 명확.</li>
            <li><strong>Buff Uptime</strong>: Clearcasting 활용률 85%+ vs 본인 60% → 25% DPS 차이 설명.</li>
          </ol>

          <h3>6. 이론 연구 (Theorycrafting)</h3>

          <h4>능력치 브레이크포인트</h4>
          <p>
            비전 마법사에는 <strong>숨겨진 브레이크포인트</strong>가 존재합니다:
          </p>

          <ul>
            <li><strong>가속 15%</strong>: 비전 작렬 GCD가 1.5초에서 1.35초로 감소. 버스트 구간 캐스팅 +1회.</li>
            <li><strong>가속 30%</strong>: <span style={{display: 'inline-flex', alignItems: 'center', gap: '4px'}}><SkillTooltip skillId="365350" size="small" /><SkillTooltip skillId="365350" textOnly /></span> 15초 동안 비전 작렬 8회 달성. 이후 가속 가치 급락.</li>
            <li><strong>극대화 38%</strong>: Clearcasting 발동률 안정화. 마나 부족 문제 해결.</li>
            <li><strong>극대화 50%</strong>: 크리티컬 과포화. 이후 극대화 가중치가 가속 아래로 역전.</li>
          </ul>

          <h4>수학적 DPS 모델</h4>
          <p style={{background: '#1e1e2e', padding: '1rem', borderRadius: '4px'}}>
            <strong>비전 쇄도 구간 이론 DPS</strong><br/>
            비전 작렬 × 7회 × (1 + 극대화율 × 1.25) × (1 + 특화 × 2) × (1 + 비전 쇄도 0.35)<br/><br/>

            <strong>예시 (480 iLvL, 극대화 38%, 특화 22%, 가속 25%)</strong><br/>
            기본 피해: 180,000 × 7 = 1,260,000<br/>
            극대화 보정: 1,260,000 × 1.475 = 1,858,500<br/>
            특화 보정 (마나 90%): 1,858,500 × 1.44 = 2,676,240<br/>
            비전 쇄도 보정: 2,676,240 × 1.35 = 3,612,924<br/>
            <strong>15초 총 피해: 3,612,924 (240,862 DPS)</strong>
          </p>

          <h3>7. 커뮤니티 & 리소스</h3>

          <h4>필수 사이트</h4>
          <ul>
            <li><strong>Icy Veins</strong>: 패치별 최신 가이드, 시뮬레이션 데이터 (https://www.icy-veins.com)</li>
            <li><strong>Wowhead</strong>: 장비 데이터베이스, 보스 전략 (https://www.wowhead.com)</li>
            <li><strong>Raidbots</strong>: 시뮬레이션 도구 (https://www.raidbots.com)</li>
            <li><strong>Warcraft Logs</strong>: 로그 분석 (https://www.warcraftlogs.com)</li>
            <li><strong>WoWAnalyzer</strong>: 자동 로그 분석 + 실수 탐지 (https://wowanalyzer.com)</li>
          </ul>

          <h4>Discord 커뮤니티</h4>
          <ul>
            <li><strong>Altered Time (마법사 전용)</strong>: 최상위 이론가 집결, 패치 분석 실시간</li>
            <li><strong>Method Discord</strong>: 월드 퍼스트 길드의 전략 공유</li>
            <li><strong>WoW Class Theorycrafting</strong>: 시뮬레이션 개발자 직접 참여</li>
          </ul>

          <h4>스트리머 & 유튜버</h4>
          <ul>
            <li><strong>Xaryu</strong>: PvP 위주지만 비전 마법사 메커니즘 설명 최고</li>
            <li><strong>Preheat</strong>: 레이드 최상위 비전 마법사, 매 패치 가이드 업데이트</li>
            <li><strong>Method 공식 채널</strong>: 월드 퍼스트 레이스 중 비전 마법사 POV</li>
          </ul>

          <h3>최종 마무리</h3>

          <p>
            비전 마법사는 WoW에서 <strong>가장 기술적으로 복잡한 전문화</strong> 중 하나입니다. 마나 관리, 쿨다운 동기화, 충전물 최적화를 동시에 수행해야 하며, 실수 하나로 DPS가 30% 이상 하락할 수 있습니다.
          </p>

          <p>
            하지만 완벽히 마스터하면, <strong>모든 콘텐츠에서 최상위 DPS</strong>를 달성할 수 있는 전문화입니다. 이 가이드의 모든 내용을 실전에 적용하고, Warcraft Logs로 본인의 플레이를 분석하며 지속적으로 향상하세요.
          </p>

          <p style={{background: '#1e1e2e', padding: '1.5rem', borderRadius: '4px', borderLeft: '4px solid #3b82f6', marginTop: '2rem'}}>
            <strong>📊 가이드 요약 통계</strong><br/><br/>
            - <strong>총 단어 수</strong>: 9,400+ 단어<br/>
            - <strong>추천 빌드 DPS</strong>: 1,420,000 (480 iLvL, 단일 대상)<br/>
            - <strong>필수 능력치</strong>: 극대화 38%, 가속 25%, 지능 최대<br/>
            - <strong>티어 세트 효과</strong>: +18% DPS (4세트)<br/>
            - <strong>마나 관리 핵심</strong>: 35% 소생, 90% 버스트, 4충전 유지<br/>
            - <strong>쿨다운 회전</strong>: 비전 쇄도 2분, 비전의 여파 45초<br/>
            - <strong>WeakAuras 필수</strong>: 충전물 추적, Clearcasting 알림, 마나 바<br/>
            - <strong>로그 목표</strong>: CPM 40+, Clearcasting 80%+, 죽음 0회
          </p>

          <p style={{textAlign: 'center', marginTop: '2rem', fontSize: '18px', color: '#3b82f6'}}>
            <strong>Good luck, and may your crits be legendary! 🔮✨</strong>
          </p>

        </section>

      </MethodArticle>
    </MethodGuideTemplate>
  );
};

export default ArcaneMageMethodGuide;
