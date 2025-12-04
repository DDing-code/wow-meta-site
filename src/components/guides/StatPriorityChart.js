// ============================================================
// StatPriorityChart Component - 스탯 우선순위 차트
// ============================================================
// 목적: 스탯 우선순위를 차트 형태로 시각화
// 디자인: Tailwind CSS + 바 차트
// ============================================================

import React from 'react';
import PropTypes from 'prop-types';

/**
 * StatPriorityChart Component
 *
 * 스탯 우선순위를 바 차트로 시각화
 * - 스탯별 상대적 가치 표시
 * - 애니메이션 효과
 * - 반응형 디자인
 *
 * @param {Object} props
 * @param {Array} props.stats - 스탯 데이터 [{ name, value, color }]
 * @param {string} props.color - 클래스 색상
 */
const StatPriorityChart = ({ stats, color }) => {
  if (!stats || stats.length === 0) {
    return null;
  }

  // 최대값 계산 (정규화를 위해)
  const maxValue = Math.max(...stats.map(s => s.value || 100));

  const statIcons = {
    Intellect: '🧠',
    Strength: '💪',
    Agility: '🏃',
    Haste: '⚡',
    Crit: '🎯',
    Mastery: '⭐',
    Versatility: '🛡️',
    '치명타': '🎯',
    '가속': '⚡',
    '숙련': '⭐',
    '특화': '💎',
    '유연성': '🛡️'
  };

  return (
    <div className="card p-6 mb-8">
      <h3 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
        <span>📊</span>
        <span>스탯 우선순위 차트</span>
      </h3>

      <div className="space-y-4">
        {stats.map((stat, index) => {
          const percentage = ((stat.value || 100) / maxValue) * 100;
          const statName = stat.name || stat;
          const statValue = stat.value || 100;

          return (
            <div key={index} className="group">
              {/* Stat Label */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {statIcons[statName] || '📈'}
                  </span>
                  <span className="font-semibold text-text-primary">
                    {statName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm font-bold"
                    style={{ color }}
                  >
                    {statValue}%
                  </span>
                  <span className="text-xs text-text-muted">
                    #{index + 1}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-8 bg-bg-elevated rounded-lg overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-lg transition-all duration-1000 ease-out group-hover:brightness-110"
                  style={{
                    width: `${percentage}%`,
                    background: `linear-gradient(to right, ${color}80, ${color})`,
                    boxShadow: `0 0 10px ${color}40`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer"></div>
                </div>

                {/* Value Label */}
                <div className="absolute inset-0 flex items-center px-3">
                  <span
                    className="text-xs font-bold mix-blend-difference"
                    style={{ color: '#FFFFFF' }}
                  >
                    {statValue}% 상대적 가치
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-border-default">
        <div className="text-xs text-text-muted space-y-1">
          <p>💡 값은 상대적 가치를 나타냅니다. (100% = 최고 우선순위)</p>
          <p>⚠️ 실제 수치는 장비 레벨과 시뮬레이션 결과에 따라 달라질 수 있습니다.</p>
        </div>
      </div>
    </div>
  );
};

StatPriorityChart.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired
      })
    ])
  ).isRequired,
  color: PropTypes.string.isRequired
};

export default StatPriorityChart;
