import React from 'react';
import { classColors, colors, typography, spacing, shadows, getIconUrl } from './tokens';

/**
 * SkillCard - 스킬 표시 컴포넌트
 * 
 * 용도: 핵심 스킬 소개, 스킬 목록
 * 크기: small (인라인), medium (목록), large (강조)
 */

const sizeStyles = {
  small: {
    container: {
      padding: spacing.sm,
      gap: spacing.sm,
    },
    icon: 24,
    title: typography.fontSize.sm,
    description: typography.fontSize.xs,
  },
  medium: {
    container: {
      padding: spacing.md,
      gap: spacing.md,
    },
    icon: 36,
    title: typography.fontSize.base,
    description: typography.fontSize.sm,
  },
  large: {
    container: {
      padding: spacing.lg,
      gap: spacing.lg,
    },
    icon: 56,
    title: typography.fontSize.xl,
    description: typography.fontSize.base,
  },
};

export const SkillCard = ({
  skill,
  size = 'medium',
  classType = 'DemonHunter',
  showDescription = true,
  showCooldown = true,
  highlight = false,
  onClick,
}) => {
  const classColor = classColors[classType] || classColors.DemonHunter;
  const sizeStyle = sizeStyles[size];

  const containerStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: sizeStyle.container.gap,
    padding: sizeStyle.container.padding,
    background: highlight 
      ? `linear-gradient(135deg, ${classColor.primary}15 0%, ${colors.background.card} 100%)`
      : colors.background.card,
    border: `1px solid ${highlight ? classColor.primary : colors.border.default}`,
    borderRadius: '8px',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.2s ease',
    boxShadow: highlight ? shadows.glow(classColor.primary) : shadows.sm,
  };

  const iconContainerStyle = {
    width: sizeStyle.icon,
    height: sizeStyle.icon,
    borderRadius: '6px',
    overflow: 'hidden',
    border: `2px solid ${classColor.primary}`,
    flexShrink: 0,
    boxShadow: `0 0 10px ${classColor.primary}40`,
  };

  const iconStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const contentStyle = {
    flex: 1,
    minWidth: 0,
  };

  const titleStyle = {
    fontSize: sizeStyle.title,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    margin: 0,
    marginBottom: spacing.xs,
  };

  const descriptionStyle = {
    fontSize: sizeStyle.description,
    color: colors.text.secondary,
    margin: 0,
    lineHeight: typography.lineHeight.normal,
  };

  const metaStyle = {
    display: 'flex',
    gap: spacing.sm,
    marginTop: spacing.xs,
    fontSize: typography.fontSize.xs,
    color: colors.text.muted,
  };

  const tagStyle = {
    background: `${classColor.primary}20`,
    color: classColor.primary,
    padding: `2px ${spacing.sm}`,
    borderRadius: '4px',
    fontSize: typography.fontSize.xs,
  };

  return (
    <div 
      style={containerStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = classColor.primary;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = highlight ? classColor.primary : colors.border.default;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={iconContainerStyle}>
        <img 
          src={getIconUrl(skill.icon, size === 'small' ? 'medium' : 'large')}
          alt={skill.name_kr}
          style={iconStyle}
          onError={(e) => {
            e.target.src = getIconUrl('inv_misc_questionmark', 'large');
          }}
        />
      </div>
      
      <div style={contentStyle}>
        <h4 style={titleStyle}>{skill.name_kr}</h4>
        
        {showDescription && skill.effect_summary && (
          <p style={descriptionStyle}>{skill.effect_summary}</p>
        )}
        
        {showCooldown && (skill.cooldown || skill.cast_time) && (
          <div style={metaStyle}>
            {skill.cooldown && <span style={tagStyle}>⏱ {skill.cooldown}</span>}
            {skill.cast_time && <span style={tagStyle}>⚡ {skill.cast_time}</span>}
            {skill.resource_cost && skill.resource_cost !== '없음' && (
              <span style={tagStyle}>💢 {skill.resource_cost}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * SkillCardGrid - 스킬 카드 그리드 레이아웃
 */
export const SkillCardGrid = ({ 
  skills, 
  columns = 2, 
  size = 'medium',
  classType = 'DemonHunter',
}) => {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: spacing.md,
  };

  return (
    <div style={gridStyle}>
      {skills.map((skill, index) => (
        <SkillCard 
          key={skill.id || index}
          skill={skill}
          size={size}
          classType={classType}
        />
      ))}
    </div>
  );
};

export default SkillCard;
