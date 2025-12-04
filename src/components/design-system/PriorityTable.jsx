import React from 'react';
import { classColors, colors, typography, spacing, getIconUrl } from './tokens';

/**
 * PriorityTable - 조건부 우선순위 테이블
 * 
 * 용도: ST/AOE 우선순위 표시
 * 컬럼: # | 스킬 | 조건 | 이유
 */

export const PriorityTable = ({
  priorities = [],
  classType = 'DemonHunter',
  showConditions = true,
  showReasons = true,
  compact = false,
}) => {
  const classColor = classColors[classType] || classColors.DemonHunter;

  const containerStyle = {
    background: colors.background.card,
    borderRadius: '12px',
    overflow: 'hidden',
    border: `1px solid ${colors.border.default}`,
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const headerStyle = {
    background: `linear-gradient(135deg, ${classColor.primary}20 0%, ${colors.background.secondary} 100%)`,
    borderBottom: `2px solid ${classColor.primary}`,
  };

  const thStyle = {
    padding: compact ? spacing.sm : spacing.md,
    textAlign: 'left',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const tdStyle = {
    padding: compact ? spacing.sm : spacing.md,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    borderBottom: `1px solid ${colors.border.default}`,
    verticalAlign: 'middle',
  };

  const rankStyle = {
    ...tdStyle,
    width: '50px',
    textAlign: 'center',
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.lg,
    color: classColor.primary,
  };

  const skillCellStyle = {
    ...tdStyle,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
  };

  const iconStyle = {
    width: 28,
    height: 28,
    borderRadius: '4px',
    border: `1px solid ${classColor.primary}40`,
  };

  const conditionStyle = {
    ...tdStyle,
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.text.muted,
    background: `${colors.background.tertiary}50`,
  };

  const reasonStyle = {
    ...tdStyle,
    fontStyle: 'italic',
    color: colors.text.muted,
    fontSize: typography.fontSize.xs,
  };

  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr style={headerStyle}>
            <th style={{ ...thStyle, width: '50px', textAlign: 'center' }}>#</th>
            <th style={thStyle}>스킬</th>
            {showConditions && <th style={thStyle}>조건</th>}
            {showReasons && <th style={thStyle}>이유</th>}
          </tr>
        </thead>
        <tbody>
          {priorities.map((item, index) => (
            <tr 
              key={index}
              style={{
                background: index % 2 === 0 ? 'transparent' : `${colors.background.tertiary}30`,
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${classColor.primary}10`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = index % 2 === 0 ? 'transparent' : `${colors.background.tertiary}30`;
              }}
            >
              <td style={rankStyle}>{item.priority || index + 1}</td>
              <td style={tdStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                  {item.icon && (
                    <img 
                      src={getIconUrl(item.icon, 'medium')}
                      alt={item.skillName}
                      style={iconStyle}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <span style={{ color: colors.text.primary, fontWeight: typography.fontWeight.medium }}>
                    {item.skillName}
                  </span>
                </div>
              </td>
              {showConditions && (
                <td style={conditionStyle}>
                  {item.condition || '-'}
                </td>
              )}
              {showReasons && (
                <td style={reasonStyle}>
                  {item.reason || '-'}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * QuickPriority - 압축된 우선순위 (한 줄)
 */
export const QuickPriority = ({
  priorities = [],
  classType = 'DemonHunter',
  label = 'ST',
}) => {
  const classColor = classColors[classType] || classColors.DemonHunter;

  const containerStyle = {
    background: colors.background.card,
    padding: spacing.md,
    borderRadius: '8px',
    border: `1px solid ${colors.border.default}`,
  };

  const labelStyle = {
    display: 'inline-block',
    background: classColor.primary,
    color: colors.background.primary,
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: '4px',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    marginRight: spacing.md,
  };

  const listStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  };

  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
  };

  const arrowStyle = {
    color: colors.text.muted,
    fontSize: typography.fontSize.xs,
  };

  const iconStyle = {
    width: 20,
    height: 20,
    borderRadius: '3px',
  };

  return (
    <div style={containerStyle}>
      <span style={labelStyle}>{label}</span>
      <span style={listStyle}>
        {priorities.map((item, index) => (
          <React.Fragment key={index}>
            <span style={itemStyle}>
              {item.icon && (
                <img 
                  src={getIconUrl(item.icon, 'small')}
                  alt={item.skillName}
                  style={iconStyle}
                />
              )}
              {item.skillName}
            </span>
            {index < priorities.length - 1 && (
              <span style={arrowStyle}>→</span>
            )}
          </React.Fragment>
        ))}
      </span>
    </div>
  );
};

export default PriorityTable;
