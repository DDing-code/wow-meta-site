// ============================================================
// StatsSection Component - 스탯 우선순위 섹션
// ============================================================

import React from 'react';
import PropTypes from 'prop-types';

const StatsSection = ({ stats, color }) => {
  if (!stats) {
    return null;
  }

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
    <section id="stats" className="mb-12">
      <h2 className="section-title">스탯 우선순위</h2>

      {/* Priority List */}
      {stats.priority && stats.priority.length > 0 && (
        <div className="card mb-6" style={{ borderLeft: `4px solid ${color}` }}>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span>📊</span>
            <span>우선순위</span>
          </h3>
          <div className="space-y-3">
            {stats.priority.map((stat, index) => {
              const statName = typeof stat === 'string' ? stat : stat.name;
              const statValue = typeof stat === 'object' ? stat.value : null;

              return (
                <div key={index} className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 font-bold"
                    style={{
                      backgroundColor: `${color}${30 - index * 5}`,
                      color: color,
                      border: `2px solid ${color}`
                    }}
                  >
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {statIcons[statName] || '📈'}
                      </span>
                      <span className="font-semibold text-text-primary">
                        {statName}
                      </span>
                      {statValue && (
                        <span className="text-sm text-text-muted">
                          ({statValue})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Soft Caps */}
      {stats.softCaps && stats.softCaps.length > 0 && (
        <div className="card">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span>⚠️</span>
            <span>소프트 캡</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.softCaps.map((cap, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-bg-elevated"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{statIcons[cap.stat] || '📊'}</span>
                  <span className="font-semibold text-text-primary">
                    {cap.stat}
                  </span>
                </div>
                <div className="text-sm text-text-secondary">
                  <div className="mb-1">
                    <span className="text-text-muted">목표: </span>
                    <span className="font-semibold" style={{ color }}>
                      {cap.value}
                    </span>
                  </div>
                  {cap.reason && (
                    <p className="text-xs text-text-muted mt-2">{cap.reason}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {stats.notes && (
        <div className="mt-6 p-4 rounded-lg bg-bg-elevated/50 border border-border-default">
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <p className="text-sm text-text-secondary leading-relaxed">
              {stats.notes}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

StatsSection.propTypes = {
  stats: PropTypes.shape({
    priority: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          value: PropTypes.string
        })
      ])
    ),
    softCaps: PropTypes.arrayOf(
      PropTypes.shape({
        stat: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        reason: PropTypes.string
      })
    ),
    notes: PropTypes.string
  }),
  color: PropTypes.string.isRequired
};

export default StatsSection;
