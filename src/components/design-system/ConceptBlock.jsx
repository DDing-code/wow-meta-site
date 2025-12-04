import React from 'react';
import { classColors, colors, typography, spacing, shadows, getIconUrl } from './tokens';

/**
 * ConceptBlock - 개념 설명 블록
 * 
 * 용도: 핵심 메커니즘, 버프 효과 설명
 */

export const ConceptBlock = ({
  title,
  icon,
  iconType = 'emoji', // 'emoji' | 'skill' | 'custom'
  children,
  classType = 'DemonHunter',
  variant = 'default', // 'default' | 'highlight' | 'warning'
}) => {
  const classColor = classColors[classType] || classColors.DemonHunter;

  const variantStyles = {
    default: {
      border: colors.border.default,
      headerBg: colors.background.secondary,
      iconBg: colors.background.tertiary,
    },
    highlight: {
      border: classColor.primary,
      headerBg: `${classColor.primary}20`,
      iconBg: classColor.primary,
    },
    warning: {
      border: colors.status.warning,
      headerBg: `${colors.status.warning}20`,
      iconBg: colors.status.warning,
    },
  };

  const style = variantStyles[variant];

  const containerStyle = {
    background: colors.background.card,
    borderRadius: '12px',
    border: `1px solid ${style.border}`,
    overflow: 'hidden',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    background: style.headerBg,
    borderBottom: `1px solid ${style.border}`,
  };

  const iconContainerStyle = {
    width: 40,
    height: 40,
    borderRadius: '8px',
    background: iconType === 'emoji' ? style.iconBg : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    overflow: 'hidden',
  };

  const iconImgStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '6px',
    border: `2px solid ${classColor.primary}`,
  };

  const titleStyle = {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: variant === 'highlight' ? classColor.primary : colors.text.primary,
    margin: 0,
  };

  const bodyStyle = {
    padding: spacing.lg,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.relaxed,
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={iconContainerStyle}>
          {iconType === 'skill' ? (
            <img 
              src={getIconUrl(icon, 'medium')}
              alt={title}
              style={iconImgStyle}
            />
          ) : iconType === 'custom' ? (
            icon
          ) : (
            icon || '📖'
          )}
        </div>
        <h3 style={titleStyle}>{title}</h3>
      </div>
      <div style={bodyStyle}>
        {children}
      </div>
    </div>
  );
};

/**
 * TipBox - 팁/주의/정보 박스
 * 
 * 용도: 팁, 주의사항, 중요 정보 강조
 */

export const TipBox = ({
  type = 'tip', // 'tip' | 'warning' | 'error' | 'info' | 'success'
  title,
  children,
  classType = 'DemonHunter',
}) => {
  const classColor = classColors[classType] || classColors.DemonHunter;

  const typeStyles = {
    tip: {
      icon: '💡',
      color: classColor.primary,
      bg: `${classColor.primary}15`,
      border: `${classColor.primary}40`,
      defaultTitle: '팁',
    },
    warning: {
      icon: '⚠️',
      color: colors.status.warning,
      bg: `${colors.status.warning}15`,
      border: `${colors.status.warning}40`,
      defaultTitle: '주의',
    },
    error: {
      icon: '❌',
      color: colors.status.error,
      bg: `${colors.status.error}15`,
      border: `${colors.status.error}40`,
      defaultTitle: '하지 마세요',
    },
    info: {
      icon: 'ℹ️',
      color: colors.status.info,
      bg: `${colors.status.info}15`,
      border: `${colors.status.info}40`,
      defaultTitle: '참고',
    },
    success: {
      icon: '✅',
      color: colors.status.success,
      bg: `${colors.status.success}15`,
      border: `${colors.status.success}40`,
      defaultTitle: '추천',
    },
  };

  const style = typeStyles[type];

  const containerStyle = {
    display: 'flex',
    gap: spacing.md,
    padding: spacing.md,
    background: style.bg,
    borderRadius: '8px',
    border: `1px solid ${style.border}`,
    borderLeft: `4px solid ${style.color}`,
  };

  const iconStyle = {
    fontSize: '20px',
    flexShrink: 0,
  };

  const contentStyle = {
    flex: 1,
  };

  const titleStyle = {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: style.color,
    margin: 0,
    marginBottom: spacing.xs,
  };

  const bodyStyle = {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    margin: 0,
    lineHeight: typography.lineHeight.normal,
  };

  return (
    <div style={containerStyle}>
      <span style={iconStyle}>{style.icon}</span>
      <div style={contentStyle}>
        <h4 style={titleStyle}>{title || style.defaultTitle}</h4>
        <div style={bodyStyle}>{children}</div>
      </div>
    </div>
  );
};

/**
 * DosDonts - Do/Don't 비교 박스
 */
export const DosDonts = ({
  dos = [],
  donts = [],
  classType = 'DemonHunter',
}) => {
  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: spacing.md,
  };

  const columnStyle = (type) => ({
    background: colors.background.card,
    borderRadius: '12px',
    border: `1px solid ${type === 'do' ? colors.status.success : colors.status.error}`,
    overflow: 'hidden',
  });

  const headerStyle = (type) => ({
    padding: spacing.md,
    background: type === 'do' ? `${colors.status.success}20` : `${colors.status.error}20`,
    borderBottom: `1px solid ${type === 'do' ? colors.status.success : colors.status.error}40`,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
  });

  const headerTitleStyle = (type) => ({
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: type === 'do' ? colors.status.success : colors.status.error,
    margin: 0,
  });

  const listStyle = {
    listStyle: 'none',
    padding: spacing.md,
    margin: 0,
  };

  const itemStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: `${spacing.sm} 0`,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    borderBottom: `1px solid ${colors.border.default}20`,
  };

  return (
    <div style={containerStyle}>
      <div style={columnStyle('do')}>
        <div style={headerStyle('do')}>
          <span>✅</span>
          <h4 style={headerTitleStyle('do')}>이렇게 하세요</h4>
        </div>
        <ul style={listStyle}>
          {dos.map((item, i) => (
            <li key={i} style={itemStyle}>{item}</li>
          ))}
        </ul>
      </div>
      <div style={columnStyle('dont')}>
        <div style={headerStyle('dont')}>
          <span>❌</span>
          <h4 style={headerTitleStyle('dont')}>하지 마세요</h4>
        </div>
        <ul style={listStyle}>
          {donts.map((item, i) => (
            <li key={i} style={itemStyle}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export { ConceptBlock, TipBox, DosDonts };
export default ConceptBlock;
