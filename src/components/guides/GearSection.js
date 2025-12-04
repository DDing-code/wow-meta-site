// ============================================================
// GearSection Component - 장비 추천 섹션
// ============================================================

import React from 'react';
import PropTypes from 'prop-types';

const GearSection = ({ gear, color }) => {
  if (!gear) return null;

  return (
    <section id="gear" className="mb-12">
      <h2 className="section-title">장비 추천</h2>

      {/* Best in Slot */}
      {gear.bis && (
        <div className="card mb-6" style={{ borderLeft: `4px solid ${color}` }}>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span>👑</span>
            <span>최적 장비 (BiS)</span>
          </h3>
          <div className="space-y-2">
            {Object.entries(gear.bis).map(([slot, item]) => (
              <div key={slot} className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-elevated transition-colors">
                <span className="text-sm text-text-muted w-24">{slot}</span>
                <span className="text-text-primary font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trinkets */}
      {gear.trinkets && (
        <div className="card mb-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span>💎</span>
            <span>추천 장신구</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gear.trinkets.map((trinket, index) => (
              <div key={index} className="p-4 rounded-lg bg-bg-elevated">
                <div className="font-semibold text-text-primary mb-2">{trinket.name}</div>
                <div className="text-sm text-text-secondary">{trinket.source}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enchants & Gems */}
      {(gear.enchants || gear.gems) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gear.enchants && (
            <div className="card">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <span>✨</span>
                <span>마법부여</span>
              </h3>
              <ul className="space-y-2">
                {Object.entries(gear.enchants).map(([slot, enchant]) => (
                  <li key={slot} className="text-sm">
                    <span className="text-text-muted">{slot}:</span>{' '}
                    <span className="text-text-primary">{enchant}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {gear.gems && (
            <div className="card">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <span>💎</span>
                <span>보석</span>
              </h3>
              <ul className="space-y-2">
                {gear.gems.map((gem, index) => (
                  <li key={index} className="text-sm text-text-primary">{gem}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

GearSection.propTypes = {
  gear: PropTypes.shape({
    bis: PropTypes.object,
    trinkets: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      source: PropTypes.string
    })),
    enchants: PropTypes.object,
    gems: PropTypes.arrayOf(PropTypes.string)
  }),
  color: PropTypes.string.isRequired
};

export default GearSection;
