import React from 'react';
import { classColors, colors, typography, spacing, shadows } from './tokens';

/**
 * ComparisonCard - 영웅 특성 비교 카드
 * 
 * 용도: 알드라치 vs 지옥상흔 등 2개 옵션 비교
 */

export const ComparisonCard = ({
  left,
  right,
  classType = 'DemonHunter',
  highlightSide = null, // 'left' | 'right' | null
}) => {
  const classColor = classColors[classType] || classColors.DemonHunter;

  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    gap: spacing.md,
    background: colors.background.card,
    borderRadius: '16px',
    border: `1px solid ${colors.border.default}`,
    overflow: 'hidden',
  };

  const sideStyle = (side) => ({
    padding: spacing.lg,
    background: highlightSide === side 
      ? `linear-gradient(135deg, ${classColor.primary}15 0%, transparent 100%)`
      : 'transparent',
    borderLeft: side === 'right' ? `1px solid ${colors.border.default}` : 'none',
    borderRight: side === 'left' ? `1px solid ${colors.border.default}` : 'none',
  });

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottom: `1px solid ${colors.border.default}`,
  };

  const iconStyle = {
    width: 48,
    height: 48,
    borderRadius: '8px',
    background: colors.background.tertiary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
  };

  const titleStyle = {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    margin: 0,
  };

  const subtitleStyle = {
    fontSize: typography.fontSize.sm,
    color: colors.text.muted,
    margin: 0,
  };

  const listStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  };

  const listItemStyle = (type) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: `${spacing.sm} 0`,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    borderBottom: `1px solid ${colors.border.default}20`,
  });

  const bulletStyle = (type) => ({
    flexShrink: 0,
    width: 6,
    height: 6,
    borderRadius: '50%',
    marginTop: '6px',
    background: type === 'pro' 
      ? colors.status.success 
      : type === 'con' 
        ? colors.status.error 
        : classColor.primary,
  });

  const vsStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    background: colors.background.secondary,
  };

  const vsBadgeStyle = {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: classColor.primary,
    color: colors.background.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.sm,
    boxShadow: shadows.glow(classColor.primary),
  };

  const renderSide = (data, side) => (
    <div style={sideStyle(side)}>
      <div style={headerStyle}>
        <div style={iconStyle}>{data.icon || '⚔️'}</div>
        <div>
          <h3 style={titleStyle}>{data.name}</h3>
          {data.subtitle && <p style={subtitleStyle}>{data.subtitle}</p>}
        </div>
      </div>

      {data.description && (
        <p style={{ 
          fontSize: typography.fontSize.sm, 
          color: colors.text.secondary,
          marginBottom: spacing.md,
          lineHeight: typography.lineHeight.relaxed,
        }}>
          {data.description}
        </p>
      )}

      {data.pros && data.pros.length > 0 && (
        <div style={{ marginBottom: spacing.md }}>
          <h4 style={{ 
            fontSize: typography.fontSize.sm, 
            color: colors.status.success,
            marginBottom: spacing.sm,
            fontWeight: typography.fontWeight.semibold,
          }}>
            ✓ 장점
          </h4>
          <ul style={listStyle}>
            {data.pros.map((pro, i) => (
              <li key={i} style={listItemStyle('pro')}>
                <span style={bulletStyle('pro')} />
                {pro}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.cons && data.cons.length > 0 && (
        <div style={{ marginBottom: spacing.md }}>
          <h4 style={{ 
            fontSize: typography.fontSize.sm, 
            color: colors.status.error,
            marginBottom: spacing.sm,
            fontWeight: typography.fontWeight.semibold,
          }}>
            ✗ 단점
          </h4>
          <ul style={listStyle}>
            {data.cons.map((con, i) => (
              <li key={i} style={listItemStyle('con')}>
                <span style={bulletStyle('con')} />
                {con}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.bestFor && (
        <div style={{
          background: `${classColor.primary}15`,
          padding: spacing.md,
          borderRadius: '8px',
          marginTop: spacing.md,
        }}>
          <h4 style={{ 
            fontSize: typography.fontSize.sm, 
            color: classColor.primary,
            marginBottom: spacing.xs,
            fontWeight: typography.fontWeight.semibold,
          }}>
            추천 상황
          </h4>
          <p style={{ 
            fontSize: typography.fontSize.sm, 
            color: colors.text.secondary,
            margin: 0,
          }}>
            {data.bestFor}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div style={containerStyle}>
      {renderSide(left, 'left')}
      <div style={vsStyle}>
        <div style={vsBadgeStyle}>VS</div>
      </div>
      {renderSide(right, 'right')}
    </div>
  );
};

/**
 * ComparisonTable - 항목별 비교 테이블
 */
export const ComparisonTable = ({
  leftName,
  rightName,
  items = [],
  classType = 'DemonHunter',
}) => {
  const classColor = classColors[classType] || classColors.DemonHunter;

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    background: colors.background.card,
    borderRadius: '12px',
    overflow: 'hidden',
    border: `1px solid ${colors.border.default}`,
  };

  const thStyle = {
    padding: spacing.md,
    background: colors.background.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    textAlign: 'center',
    borderBottom: `2px solid ${classColor.primary}`,
  };

  const tdStyle = {
    padding: spacing.md,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    borderBottom: `1px solid ${colors.border.default}`,
  };

  const categoryStyle = {
    ...tdStyle,
    textAlign: 'left',
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    background: `${colors.background.tertiary}30`,
  };

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={{ ...thStyle, textAlign: 'left', width: '30%' }}>항목</th>
          <th style={{ ...thStyle, width: '35%', color: classColor.primary }}>{leftName}</th>
          <th style={{ ...thStyle, width: '35%', color: classColor.primary }}>{rightName}</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={index}>
            <td style={categoryStyle}>{item.category}</td>
            <td style={tdStyle}>{item.left}</td>
            <td style={tdStyle}>{item.right}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ComparisonCard;
