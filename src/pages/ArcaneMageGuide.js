// ============================================================
// Arcane Mage Guide Page - 비전 마법사 가이드 페이지
// ============================================================
// 목적: GuideTemplate + mage.json 데이터 결합
// 업데이트: 2025-01-13
// ============================================================

import React, { useEffect } from 'react';
import GuideTemplate from '../components/guides/GuideTemplate.js';
import mageData from '../data/guides/mage.json';

/**
 * ArcaneMageGuide Page Component
 *
 * 새로운 가이드 시스템:
 * - GuideTemplate + mage.json 데이터
 * - Tailwind CSS 디자인 시스템
 * - 13개 섹션 컴포넌트 통합
 */
const ArcaneMageGuide = () => {
  const classData = {
    className: mageData.className,
    classNameKo: mageData.classNameKo,
    color: mageData.color
  };

  const specData = mageData.specs.arcane;

  useEffect(() => {
    // 페이지 제목 업데이트
    document.title = `${specData.specNameKo} ${classData.classNameKo} 가이드 - WoW Meta Site`;

    console.log('[ArcaneMageGuide] 가이드 로드됨:', {
      class: classData.classNameKo,
      spec: specData.specNameKo,
      patch: specData.patch
    });
  }, [classData.classNameKo, specData.specNameKo, specData.patch]);

  return <GuideTemplate classData={classData} specData={specData} />;
};

export default ArcaneMageGuide;
