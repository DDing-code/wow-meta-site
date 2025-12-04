// ============================================================
// RotationTimeline Component - 딜사이클 타임라인 시각화
// ============================================================
// 목적: 딜사이클을 타임라인 형태로 시각화
// 디자인: Tailwind CSS + 애니메이션
// ============================================================

import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * RotationTimeline Component
 *
 * 딜사이클을 타임라인 형태로 시각화하여 표시
 * - 시간 기반 스킬 표시
 * - 재사용 대기시간 표시
 * - 리소스 변화 표시
 * - 인터랙티브 애니메이션
 *
 * @param {Object} props
 * @param {Array} props.timeline - 타임라인 데이터 [{ time, skill, resource }]
 * @param {string} props.color - 클래스 색상
 */
const RotationTimeline = ({ timeline, color }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  if (!timeline || timeline.length === 0) {
    return null;
  }

  const maxTime = Math.max(...timeline.map(item => item.time)) + 5;

  const handlePlay = () => {
    setIsPlaying(true);
    setCurrentTime(0);

    // 애니메이션 시뮬레이션
    const duration = maxTime * 100; // 100ms per second
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCurrentTime(progress * maxTime);

      if (progress < 1 && isPlaying) {
        requestAnimationFrame(animate);
      } else {
        setIsPlaying(false);
      }
    };

    animate();
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  return (
    <div className="card p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-bold text-xl flex items-center gap-2">
          <span>⏱️</span>
          <span>딜사이클 타임라인</span>
        </h3>

        <div className="flex gap-2">
          <button
            onClick={handlePlay}
            disabled={isPlaying}
            className="btn px-4 py-2 rounded-lg font-semibold text-sm transition-all"
            style={{
              backgroundColor: isPlaying ? '#4B5563' : `${color}30`,
              color: isPlaying ? '#9CA3AF' : color,
              border: `2px solid ${isPlaying ? '#6B7280' : color}`,
              opacity: isPlaying ? 0.5 : 1
            }}
          >
            ▶ 재생
          </button>
          <button
            onClick={handleReset}
            className="btn px-4 py-2 rounded-lg font-semibold text-sm bg-bg-elevated border-2 border-border-default hover:bg-bg-surface transition-all"
          >
            ↻ 리셋
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Time axis */}
        <div className="relative h-2 bg-bg-elevated rounded-full overflow-hidden mb-8">
          {/* Progress indicator */}
          <div
            className="absolute top-0 left-0 h-full transition-all"
            style={{
              width: `${(currentTime / maxTime) * 100}%`,
              backgroundColor: color,
              boxShadow: `0 0 10px ${color}`
            }}
          ></div>
        </div>

        {/* Time markers */}
        <div className="relative mb-8">
          <div className="flex justify-between text-xs text-text-muted">
            {[...Array(Math.ceil(maxTime / 5) + 1)].map((_, i) => (
              <span key={i}>{i * 5}s</span>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-4">
          {timeline.map((item, index) => {
            const position = (item.time / maxTime) * 100;
            const isPassed = currentTime >= item.time;

            return (
              <div key={index} className="relative">
                <div
                  className="absolute top-0 transition-all duration-300"
                  style={{
                    left: `${position}%`,
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div
                    className={`
                      w-12 h-12 rounded-lg flex items-center justify-center text-xl
                      border-2 transition-all duration-300
                      ${isPassed ? 'scale-110' : 'scale-100'}
                    `}
                    style={{
                      backgroundColor: isPassed ? `${color}40` : `${color}20`,
                      borderColor: color,
                      boxShadow: isPassed ? `0 0 15px ${color}` : 'none'
                    }}
                  >
                    {item.icon || '⚔️'}
                  </div>
                  <div className="mt-2 text-xs text-center whitespace-nowrap">
                    <div className="font-semibold text-text-primary">
                      {item.skill}
                    </div>
                    <div className="text-text-muted">{item.time}s</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-16 pt-4 border-t border-border-default">
        <div className="text-xs text-text-muted text-center">
          💡 타임라인은 이상적인 상황을 기준으로 합니다. 실전에서는 상황에 따라 조정이 필요합니다.
        </div>
      </div>
    </div>
  );
};

RotationTimeline.propTypes = {
  timeline: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.number.isRequired,
      skill: PropTypes.string.isRequired,
      icon: PropTypes.string,
      resource: PropTypes.number
    })
  ).isRequired,
  color: PropTypes.string.isRequired
};

export default RotationTimeline;
