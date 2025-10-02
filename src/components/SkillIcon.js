// 스킬 아이콘 컴포넌트
import React, { useState, useEffect } from 'react';
import { getSkillIcon } from '../data/skillIcons';
import { getVerifiedIconUrl, getSmartIconUrl } from '../utils/wowheadIconFetcher';
import { wowheadIconMapping } from '../data/wowheadIconMapping';
import './SkillIcon.css';

// 기본 Wowhead 아이콘 URL (폴백용)
const WOWHEAD_ICON_BASE = 'https://wow.zamimg.com/images/wow/icons';

// 아이콘 크기 매핑
const ICON_SIZES = {
  small: 18,   // 18x18
  medium: 36,  // 36x36
  large: 56,   // 56x56
  xlarge: 64   // 커스텀 크기
};

const SkillIcon = ({
  skillId,
  skillName,  // 영문 스킬 이름 추가
  iconName,
  size = 'large',
  className = '',
  classType = 'warrior',  // 클래스 타입 추가
  tooltip = true,
  onClick,
  bordered = true
}) => {
  const [iconUrl, setIconUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    loadIcon();
  }, [skillId, skillName, iconName, size, classType]);

  // 아이콘 로드
  const loadIcon = async () => {
    setLoading(true);
    setError(false);

    try {
      let finalIconUrl = '';

      // 1. 먼저 wowheadIconMapping에서 찾기 (가장 완전한 매핑 - 760개)
      if (skillId && wowheadIconMapping[skillId]) {
        const cleanIconName = wowheadIconMapping[skillId].toLowerCase();
        finalIconUrl = `https://wow.zamimg.com/images/wow/icons/large/${cleanIconName}.jpg`;
      }
      // 2. wowheadIconMapping에 없으면 getVerifiedIconUrl로 찾기 (iconMapping.json - 437개)
      else if (skillId) {
        // skillId를 숫자로 변환 시도 (문자열로 된 ID도 처리)
        const numericSkillId = typeof skillId === 'string' ? parseInt(skillId) : skillId;

        if (!isNaN(numericSkillId)) {
          finalIconUrl = getVerifiedIconUrl(numericSkillId);

          // 3. 검증된 아이콘이 없으면 스킬 이름으로 스마트 매칭
          if (finalIconUrl.includes('inv_misc_questionmark') && skillName) {
            finalIconUrl = getSmartIconUrl(numericSkillId, skillName, classType);
          }

          // 4. 그래도 없으면 기존 매핑 사용
          if (finalIconUrl.includes('inv_misc_questionmark')) {
            const iconMapping = getSkillIcon(classType, numericSkillId);
            if (iconMapping && iconMapping !== 'inv_misc_questionmark.tga') {
              const cleanIconName = iconMapping.replace('.tga', '').toLowerCase();
              finalIconUrl = `https://wow.zamimg.com/images/wow/icons/large/${cleanIconName}.jpg`;
            }
          }
        }

        // 5. 여전히 물음표면 iconName으로 시도
        if ((!finalIconUrl || finalIconUrl.includes('inv_misc_questionmark')) && iconName && iconName !== 'inv_misc_questionmark') {
          const cleanIconName = iconName.replace('.tga', '').toLowerCase();
          finalIconUrl = `https://wow.zamimg.com/images/wow/icons/large/${cleanIconName}.jpg`;
        }
      } else if (iconName && iconName !== 'inv_misc_questionmark') {
        // 직접 아이콘 이름으로 로드 (Wowhead URL 사용)
        const cleanIconName = iconName.replace('.tga', '').toLowerCase();
        finalIconUrl = `https://wow.zamimg.com/images/wow/icons/large/${cleanIconName}.jpg`;
      } else {
        // 기본 아이콘 (Wowhead URL)
        finalIconUrl = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
      }

      setIconUrl(finalIconUrl);
    } catch (err) {
      console.error('아이콘 로드 실패:', err);
      setIconUrl('https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Wowhead URL 직접 생성
  const getWowheadUrl = (name) => {
    const sizeFolder = size === 'small' ? 'small' : size === 'medium' ? 'medium' : 'large';
    return `${WOWHEAD_ICON_BASE}/${sizeFolder}/${name}.jpg`;
  };

  // 아이콘 크기 계산
  const iconSize = ICON_SIZES[size] || 56;

  // 에러 시 기본 아이콘 표시
  const handleImageError = () => {
    setIconUrl('https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg');
    setError(true);
  };

  return (
    <div
      className={`skill-icon ${className} ${bordered ? 'bordered' : ''} ${loading ? 'loading' : ''}`}
      style={{ width: iconSize, height: iconSize }}
      onClick={onClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {loading ? (
        <div className="skill-icon-loading">
          <div className="spinner"></div>
        </div>
      ) : (
        <img
          src={iconUrl}
          alt={skillId || iconName || 'skill'}
          onError={handleImageError}
          style={{ width: '100%', height: '100%' }}
        />
      )}

      {error && (
        <div className="skill-icon-error">
          <span>?</span>
        </div>
      )}

      {tooltip && showTooltip && (skillId || iconName) && (
        <div className="skill-icon-tooltip">
          {skillId || iconName}
        </div>
      )}
    </div>
  );
};

// 스킬 아이콘 그룹 컴포넌트
export const SkillIconGroup = ({ skills, size = 'medium', maxDisplay = 5 }) => {
  const displaySkills = skills.slice(0, maxDisplay);
  const remaining = skills.length - maxDisplay;

  return (
    <div className="skill-icon-group">
      {displaySkills.map((skill, index) => (
        <SkillIcon
          key={skill.id || index}
          skillId={skill.id}
          iconName={skill.icon}
          size={size}
          tooltip={true}
        />
      ))}
      {remaining > 0 && (
        <div className="skill-icon-more" style={{ width: ICON_SIZES[size], height: ICON_SIZES[size] }}>
          <span>+{remaining}</span>
        </div>
      )}
    </div>
  );
};

// 클래스 아이콘 컴포넌트
export const ClassIcon = ({ className, size = 'large', bordered = false }) => {
  const [iconUrl, setIconUrl] = useState('');

  useEffect(() => {
    loadClassIcon();
  }, [className, size]);

  const loadClassIcon = async () => {
    try {
      const response = await fetch(`/api/icons/class/${className}?size=${size}&format=url`);
      const data = await response.json();

      if (data.success) {
        setIconUrl(data.url);
      }
    } catch (err) {
      console.error('클래스 아이콘 로드 실패:', err);
      // 폴백 URL 사용
      const classIconMap = {
        warrior: 'classicon_warrior',
        paladin: 'classicon_paladin',
        hunter: 'classicon_hunter',
        rogue: 'classicon_rogue',
        priest: 'classicon_priest',
        deathknight: 'classicon_deathknight',
        shaman: 'classicon_shaman',
        mage: 'classicon_mage',
        warlock: 'classicon_warlock',
        monk: 'classicon_monk',
        druid: 'classicon_druid',
        demonhunter: 'classicon_demonhunter',
        evoker: 'classicon_evoker'
      };

      const iconName = classIconMap[className.toLowerCase()] || 'classicon_warrior';
      setIconUrl(`${WOWHEAD_ICON_BASE}/large/${iconName}.jpg`);
    }
  };

  const iconSize = ICON_SIZES[size] || 56;

  return (
    <div
      className={`class-icon ${bordered ? 'bordered' : ''}`}
      style={{ width: iconSize, height: iconSize }}
    >
      <img
        src={iconUrl}
        alt={className}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default SkillIcon;