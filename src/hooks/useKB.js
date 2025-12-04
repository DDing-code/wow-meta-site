/**
 * useKB Hook
 * KB (Knowledge Base) 데이터를 React 컴포넌트에서 사용하기 위한 훅
 * 
 * 사용법:
 * const { data, tips, macros, getSection } = useKB('beastMasteryHunter');
 */

import { useState, useEffect, useMemo } from 'react';

// KB 데이터 동적 import
const KB_MODULES = {
  beastMasteryHunter: () => import('../data/kb/bm-hunter-kb.json'),
  // 추후 다른 가이드 추가
};

/**
 * KB 데이터를 로드하고 사용하기 쉬운 형태로 제공
 */
export function useKB(guideKey) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadKB = async () => {
      if (!KB_MODULES[guideKey]) {
        setError(`Unknown KB: ${guideKey}`);
        setLoading(false);
        return;
      }

      try {
        const module = await KB_MODULES[guideKey]();
        setData(module.default || module);
        setLoading(false);
      } catch (err) {
        console.warn(`KB load failed for ${guideKey}:`, err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    loadKB();
  }, [guideKey]);

  // 메모이즈된 헬퍼 함수들
  const helpers = useMemo(() => {
    if (!data) return {
      tips: [],
      darkRangerTips: [],
      packLeaderTips: [],
      macros: [],
      weakauras: [],
      priorities: [],
      meta: {},
      heroSpec: () => null,
      statPriority: () => '',
      codeBlocks: [],
      syncInfo: {}
    };

    return {
      // 고수 팁 (중요도순 정렬)
      tips: (data.structured?.common?.tips || [])
        .sort((a, b) => b.importance - a.importance),

      // Dark Ranger 팁
      darkRangerTips: data.structured?.darkRanger?.tips || [],

      // Pack Leader 팁
      packLeaderTips: data.structured?.packLeader?.tips || [],

      // 매크로
      macros: data.structured?.common?.macros || [],

      // WeakAura 링크
      weakauras: data.structured?.common?.weakauras || [],

      // 우선순위
      priorities: data.structured?.common?.priorities || [],

      // 메타 정보
      meta: data.meta || {},

      // 영웅 특성별 데이터
      heroSpec: (spec) => {
        if (spec === 'darkRanger') return data.structured?.darkRanger;
        if (spec === 'packLeader') return data.structured?.packLeader;
        return null;
      },

      // 스탯 우선순위
      statPriority: (spec) => {
        return data.structured?.meta?.statPriority?.[spec] || '';
      },

      // 코드블록 (로테이션 등)
      codeBlocks: data.codeBlocks || [],

      // 동기화 정보
      syncInfo: {
        syncedAt: data.meta?.syncedAt,
        sourceFile: data.meta?.sourceFile
      }
    };
  }, [data]);

  return {
    data,
    loading,
    error,
    ...helpers
  };
}

export default useKB;
