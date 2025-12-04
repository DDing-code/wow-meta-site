// ============================================================
// TalentsSection Component - 특성 빌드 섹션
// ============================================================

import React, { useState } from 'react';
import PropTypes from 'prop-types';

const TalentsSection = ({ talents, color }) => {
  const [activeBuild, setActiveBuild] = useState('single');

  if (!talents) {
    return null;
  }

  const builds = [
    { id: 'single', label: '단일 대상', icon: '🎯', data: talents.single },
    { id: 'mythicPlus', label: '쐐기', icon: '🗝️', data: talents.mythicPlus },
    { id: 'raid', label: '레이드', icon: '🏰', data: talents.raid }
  ].filter(build => build.data);

  return (
    <section id="talents" className="mb-6">
      <h2 className="section-title">특성 빌드</h2>

      {/* Build Type Selector */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {builds.map((build) => (
          <button
            key={build.id}
            onClick={() => setActiveBuild(build.id)}
            className={`
              px-4 py-2 rounded font-medium
              transition-all duration-200
              ${
                activeBuild === build.id
                  ? 'shadow-sm'
                  : 'bg-gray-100 hover:bg-gray-200'
              }
            `}
            style={
              activeBuild === build.id
                ? {
                    backgroundColor: `${color}30`,
                    color: color,
                    border: `1px solid ${color}`
                  }
                : {}
            }
          >
            <div className="text-xl mb-0.5">{build.icon}</div>
            <div className="text-xs">{build.label}</div>
          </button>
        ))}
      </div>

      {/* Build Content */}
      {builds.map((build) => {
        if (activeBuild !== build.id) return null;

        const buildData = build.data;

        return (
          <div key={build.id} className="space-y-6">
            {/* Build Description */}
            {buildData.description && (
              <div className="card bg-gradient-to-br from-bg-surface to-bg-elevated">
                <p className="text-text-secondary leading-relaxed">
                  {buildData.description}
                </p>
              </div>
            )}

            {/* Talent Rows */}
            {buildData.talents && buildData.talents.length > 0 && (
              <div className="card">
                <h3 className="font-bold text-lg mb-4">추천 특성</h3>
                <div className="space-y-3">
                  {buildData.talents.map((talent, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-bg-elevated/50"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                        style={{
                          backgroundColor: `${color}20`,
                          border: `2px solid ${color}`
                        }}
                      >
                        ⭐
                      </div>
                      <span className="text-text-primary font-semibold">{talent}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wowhead Link */}
            {buildData.wowheadLink && (
              <div className="card">
                <a
                  href={buildData.wowheadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-primary-400 hover:text-primary-300 transition-colors"
                >
                  <span className="text-2xl">🔗</span>
                  <span className="font-semibold">Wowhead에서 전체 빌드 보기</span>
                  <span className="ml-auto">→</span>
                </a>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
};

TalentsSection.propTypes = {
  talents: PropTypes.shape({
    single: PropTypes.shape({
      description: PropTypes.string,
      talents: PropTypes.arrayOf(PropTypes.string),
      wowheadLink: PropTypes.string
    }),
    mythicPlus: PropTypes.shape({
      description: PropTypes.string,
      talents: PropTypes.arrayOf(PropTypes.string),
      wowheadLink: PropTypes.string
    }),
    raid: PropTypes.shape({
      description: PropTypes.string,
      talents: PropTypes.arrayOf(PropTypes.string),
      wowheadLink: PropTypes.string
    })
  }),
  color: PropTypes.string.isRequired
};

export default TalentsSection;
