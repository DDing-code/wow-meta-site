import React from 'react';
import './SkillDetailModal.css';

const SkillDetailModal = ({ skill, isOpen, onClose, classData }) => {
  if (!isOpen || !skill) return null;

  const getIconUrl = (icon) => {
    if (!icon || icon === 'inv_misc_questionmark') {
      return 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
    }
    return `https://wow.zamimg.com/images/wow/icons/large/${icon}.jpg`;
  };

  const classColor = classData[skill.class]?.color || '#999';

  return (
    <div className="skill-modal-overlay" onClick={onClose}>
      <div className="skill-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="skill-modal-close" onClick={onClose}>×</button>

        {/* 헤더 */}
        <div className="skill-modal-header" style={{ borderColor: classColor }}>
          <div className="skill-modal-icon">
            <img
              src={getIconUrl(skill.icon)}
              alt={skill.koreanName}
              onError={(e) => {
                e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
              }}
            />
          </div>
          <div className="skill-modal-title">
            <h2>{skill.koreanName}</h2>
            <p className="skill-modal-english">{skill.englishName}</p>
            <p className="skill-modal-id">ID: {skill.id}</p>
          </div>
        </div>

        {/* 기본 정보 */}
        <div className="skill-modal-basic-info">
          <div className="skill-info-row">
            <span className="skill-info-label">직업</span>
            <span className="skill-info-value" style={{ color: classColor }}>
              {skill.class}
            </span>
          </div>
          <div className="skill-info-row">
            <span className="skill-info-label">타입</span>
            <span className="skill-info-value">{skill.type || '기본'}</span>
          </div>
          {skill.heroTalent && (
            <div className="skill-info-row">
              <span className="skill-info-label">영웅특성</span>
              <span className="skill-info-value hero-talent">{skill.heroTalent}</span>
            </div>
          )}
        </div>

        {/* 스킬 설명 */}
        {skill.description && (
          <div className="skill-modal-description">
            <h3>설명</h3>
            <p>{skill.description}</p>
          </div>
        )}

        {/* 상세 정보 */}
        <div className="skill-modal-details">
          <h3>상세 정보</h3>
          <div className="skill-details-grid">
            {skill.cooldown && skill.cooldown !== '없음' && (
              <div className="skill-detail-item">
                <span className="detail-label">재사용 대기시간</span>
                <span className="detail-value">{skill.cooldown}</span>
              </div>
            )}
            {skill.castTime && (
              <div className="skill-detail-item">
                <span className="detail-label">시전 시간</span>
                <span className="detail-value">{skill.castTime}</span>
              </div>
            )}
            {skill.range && skill.range !== '없음' && (
              <div className="skill-detail-item">
                <span className="detail-label">사거리</span>
                <span className="detail-value">{skill.range}</span>
              </div>
            )}
            {skill.resourceCost && skill.resourceCost !== '없음' && (
              <div className="skill-detail-item">
                <span className="detail-label">소모 자원</span>
                <span className="detail-value">{skill.resourceCost}</span>
              </div>
            )}
            {skill.resourceGain && skill.resourceGain !== '없음' && (
              <div className="skill-detail-item">
                <span className="detail-label">획득 자원</span>
                <span className="detail-value">{skill.resourceGain}</span>
              </div>
            )}
            {skill.duration && (
              <div className="skill-detail-item">
                <span className="detail-label">지속시간</span>
                <span className="detail-value">{skill.duration}</span>
              </div>
            )}
          </div>
        </div>

        {/* 강화된 필드 (있는 경우만) */}
        {(skill.radius || skill.maxTargets || skill.stacks || skill.charges || skill.proc) && (
          <div className="skill-modal-enhanced">
            <h3>추가 속성</h3>
            <div className="skill-details-grid">
              {skill.radius && (
                <div className="skill-detail-item">
                  <span className="detail-label">범위</span>
                  <span className="detail-value">{skill.radius}</span>
                </div>
              )}
              {skill.maxTargets && (
                <div className="skill-detail-item">
                  <span className="detail-label">최대 대상</span>
                  <span className="detail-value">{skill.maxTargets}</span>
                </div>
              )}
              {skill.stacks && (
                <div className="skill-detail-item">
                  <span className="detail-label">중첩</span>
                  <span className="detail-value">{skill.stacks}</span>
                </div>
              )}
              {skill.charges && (
                <div className="skill-detail-item">
                  <span className="detail-label">충전</span>
                  <span className="detail-value">{skill.charges}</span>
                </div>
              )}
              {skill.proc && (
                <div className="skill-detail-item">
                  <span className="detail-label">발동 확률</span>
                  <span className="detail-value">{skill.proc}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 메타 정보 */}
        <div className="skill-modal-meta">
          <span>패치: {skill.patch || '11.2'}</span>
          <span>시즌: {skill.season || 'TWW S3'}</span>
          {skill.pvp && <span className="pvp-badge">PvP</span>}
        </div>
      </div>
    </div>
  );
};

export default SkillDetailModal;