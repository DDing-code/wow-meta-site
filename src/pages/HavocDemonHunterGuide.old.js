// ============================================================
// Havoc Demon Hunter Guide Page - 파멸 악마사냥꾼 교수급 가이드 페이지
// ============================================================
// 목적: Knowledge Base 기반 교수급 가이드 (악마성 루프 심층 분석)
// 업데이트: 2025-11-16
// ============================================================

import React, { useEffect } from 'react';
import HavocDemonHunterGuideComponent from '../components/HavocDemonHunterGuide.js';

/**
 * HavocDemonHunterGuide Page Component
 *
 * 새로운 교수급 가이드 시스템:
 * - Knowledge Base 28개 특성 파일 기반
 * - 악마성 루프 수학적 분석
 * - 특성 시너지 네트워크 시각화
 * - Recharts DPS 분포 차트
 * - 스킬/특성 호버 툴팁
 * - 장비/스탯/빌드 제외, 핵심 메커니즘에 집중
 */
const HavocDemonHunterGuide = () => {
  useEffect(() => {
    // 페이지 제목 업데이트
    document.title = '파멸 악마사냥꾼 교수급 가이드 - WoW Meta Site';

    console.log('[HavocDemonHunterGuide] 교수급 가이드 로드됨:', {
      class: '악마사냥꾼',
      spec: '파멸',
      system: 'Knowledge Base 기반',
      features: ['악마성 루프 분석', 'DPS 파이차트', '특성 시너지', '호버 툴팁']
    });
  }, []);

  return <HavocDemonHunterGuideComponent />;
};

export default HavocDemonHunterGuide;
