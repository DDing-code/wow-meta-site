import React from 'react';
import { classColors, colors, typography, spacing, shadows, getIconUrl } from './tokens';

/**
 * Timeline - 오프너/콤보 시퀀스 타임라인
 * 
 * 용도: 오프너 순서, 버스트 윈도우 콤보 표시
 * 방향: horizontal (가로), vertical (세로)
 */

export const Timeline = ({
  steps = [],
  classType = 'DemonHunter',
  direction = 'horizontal',
  showNumbers = true,
  showNotes = true,
  compact = false,
}) => {
  const classColor = classColors[classType] || classColors.DemonHunter;
  const isHorizontal = direction === 'horizontal';

  const containerStyle = {
    display: 'flex',
    flexDirection: isHorizontal ? 'row' : 'column',
    gap: compact ? spacing.sm : spacing.md,
    padding: spacing.lg,
    background: colors.background.card,
    borderRadius: '12px',
    border: `1px solid ${colors.border.default}`,
    overflowX: isHorizontal ? 'auto' : 'visible',
  };

  const stepStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing.sm,
    position: 'relative',
    minWidth: compact ? '60px' : '80px',
  };

  const iconContainerStyle = {
    position: 'relative',
    width: compact ? 40 : 56,
    height: compact ? 40 : 56,
  };

  const iconStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '8px',
    border: `2px solid ${classColor.primary}`,
    boxShadow: `0 0 15px ${classColor.primary}40`,
    transition: 'all 0.2s ease',
  };

  const numberBadgeStyle = {
    position: 'absolute',
    top: -8,
    left: -8,
    width: 24,
    height: 24,
    background: classColor.primary,
    color: colors.background.primary,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    boxShadow: shadows.md,
  };

  const skillNameStyle = {
    fontSize: compact ? typography.fontSize.xs : typography.fontSize.sm,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
    maxWidth: compact ? '70px' : '100px',
  };

  const noteStyle = {
    fontSize: typography.fontSize.xs,
    color: colors.text.muted,
    textAlign: 'center',
    fontStyle: 'italic',
    maxWidth: '100px',
  };

  const arrowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: classColor.primary,
    fontSize: isHorizontal ? '20px' : '16px',
    transform: isHorizontal ? 'none' : 'rotate(90deg)',
    opacity: 0.7,
  };

  const connectorStyle = {
    position: 'absolute',
    background: `linear-gradient(${isHorizontal ? '90deg' : '180deg'}, ${classColor.primary} 0%, ${classColor.primary}40 100%)`,
    ...(isHorizontal 
      ? { 
          height: '2px', 
          width: '100%', 
          top: compact ? 20 : 28,
          left: '50%',
        }
      : { 
          width: '2px', 
          height: '100%', 
          left: compact ? 20 : 28,
          top: '50%',
        }
    ),
  };

  return (
    <div style={containerStyle}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div style={stepStyle}>
            <div style={iconContainerStyle}>
              {showNumbers && (
                <div style={numberBadgeStyle}>{step.step || index + 1}</div>
              )}
              <img 
                src={getIconUrl(step.icon, compact ? 'medium' : 'large')}
                alt={step.skillName}
                style={iconStyle}
                onError={(e) => {
                  e.target.src = getIconUrl('inv_misc_questionmark', 'large');
                }}
              />
            </div>
            <span style={skillNameStyle}>{step.skillName}</span>
            {showNotes && step.note && (
              <span style={noteStyle}>{step.note}</span>
            )}
          </div>
          
          {index < steps.length - 1 && (
            <div style={arrowStyle}>→</div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

/**
 * BurstWindow - 버스트 윈도우 타임라인 (특수)
 * 정수파쇄 등 버프 지속시간 동안의 스킬 시퀀스
 */
export const BurstWindow = ({
  windowName = '정수 파쇄',
  windowDuration = '4초',
  windowIcon,
  steps = [],
  classType = 'DemonHunter',
}) => {
  const classColor = classColors[classType] || classColors.DemonHunter;

  const containerStyle = {
    background: colors.background.card,
    borderRadius: '12px',
    border: `1px solid ${classColor.primary}`,
    overflow: 'hidden',
  };

  const headerStyle = {
    background: `linear-gradient(135deg, ${classColor.primary}30 0%, ${colors.background.secondary} 100%)`,
    padding: spacing.md,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    borderBottom: `1px solid ${classColor.primary}40`,
  };

  const headerIconStyle = {
    width: 40,
    height: 40,
    borderRadius: '6px',
    border: `2px solid ${classColor.primary}`,
  };

  const headerTextStyle = {
    flex: 1,
  };

  const windowTitleStyle = {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: classColor.primary,
    margin: 0,
  };

  const windowDurationStyle = {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    margin: 0,
  };

  const progressBarStyle = {
    height: '4px',
    background: `linear-gradient(90deg, ${classColor.primary} 0%, ${classColor.primary}40 100%)`,
  };

  const bodyStyle = {
    padding: spacing.lg,
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        {windowIcon && (
          <img 
            src={getIconUrl(windowIcon, 'medium')}
            alt={windowName}
            style={headerIconStyle}
          />
        )}
        <div style={headerTextStyle}>
          <h4 style={windowTitleStyle}>{windowName} 윈도우</h4>
          <p style={windowDurationStyle}>지속시간: {windowDuration}</p>
        </div>
      </div>
      <div style={progressBarStyle} />
      <div style={bodyStyle}>
        <Timeline 
          steps={steps}
          classType={classType}
          direction="horizontal"
          showNumbers={true}
          compact={true}
        />
      </div>
    </div>
  );
};

export default Timeline;
