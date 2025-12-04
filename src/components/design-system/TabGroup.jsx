import React, { useState } from 'react';
import { classColors, colors, typography, spacing } from './tokens';

/**
 * TabGroup - 상황별 탭 전환
 * 
 * 용도: ST/AOE 전환, 영웅 특성별 분리
 */

export const TabGroup = ({
  tabs = [],
  defaultTab = 0,
  classType = 'DemonHunter',
  variant = 'default', // 'default' | 'pills' | 'underline'
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const classColor = classColors[classType] || classColors.DemonHunter;

  const containerStyle = {
    background: colors.background.card,
    borderRadius: '12px',
    border: `1px solid ${colors.border.default}`,
    overflow: 'hidden',
  };

  const tabListStyle = {
    display: 'flex',
    gap: variant === 'pills' ? spacing.sm : 0,
    padding: variant === 'pills' ? spacing.sm : 0,
    background: colors.background.secondary,
    borderBottom: variant === 'underline' ? `1px solid ${colors.border.default}` : 'none',
  };

  const getTabStyle = (index) => {
    const isActive = index === activeTab;

    const baseStyle = {
      padding: `${spacing.md} ${spacing.lg}`,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: 'none',
      outline: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
    };

    if (variant === 'pills') {
      return {
        ...baseStyle,
        background: isActive ? classColor.primary : 'transparent',
        color: isActive ? colors.background.primary : colors.text.secondary,
        borderRadius: '8px',
      };
    }

    if (variant === 'underline') {
      return {
        ...baseStyle,
        background: 'transparent',
        color: isActive ? classColor.primary : colors.text.secondary,
        borderBottom: isActive ? `2px solid ${classColor.primary}` : '2px solid transparent',
        marginBottom: '-1px',
      };
    }

    // default
    return {
      ...baseStyle,
      flex: 1,
      justifyContent: 'center',
      background: isActive 
        ? colors.background.card 
        : 'transparent',
      color: isActive ? classColor.primary : colors.text.secondary,
      borderBottom: isActive 
        ? `2px solid ${classColor.primary}` 
        : `2px solid transparent`,
    };
  };

  const contentStyle = {
    padding: spacing.lg,
  };

  const tabIconStyle = {
    width: 20,
    height: 20,
    borderRadius: '4px',
  };

  return (
    <div style={containerStyle}>
      <div style={tabListStyle} role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={index === activeTab}
            style={getTabStyle(index)}
            onClick={() => setActiveTab(index)}
            onMouseEnter={(e) => {
              if (index !== activeTab) {
                e.currentTarget.style.color = classColor.primary;
                e.currentTarget.style.background = `${classColor.primary}10`;
              }
            }}
            onMouseLeave={(e) => {
              if (index !== activeTab) {
                e.currentTarget.style.color = colors.text.secondary;
                e.currentTarget.style.background = variant === 'pills' ? 'transparent' : 
                  (variant === 'underline' ? 'transparent' : 'transparent');
              }
            }}
          >
            {tab.icon && (
              typeof tab.icon === 'string' && tab.icon.length <= 2 
                ? <span>{tab.icon}</span>
                : <img src={tab.icon} alt="" style={tabIconStyle} />
            )}
            {tab.label}
          </button>
        ))}
      </div>
      <div style={contentStyle} role="tabpanel">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
};

/**
 * QuickRef - 빠른 참조 카드
 * 
 * 용도: 게임 중 빠른 확인, 핵심 규칙 요약
 */

export const QuickRef = ({
  title = '빠른 참조',
  items = [],
  classType = 'DemonHunter',
}) => {
  const classColor = classColors[classType] || classColors.DemonHunter;

  const containerStyle = {
    background: `linear-gradient(135deg, ${classColor.primary}15 0%, ${colors.background.card} 100%)`,
    borderRadius: '12px',
    border: `1px solid ${classColor.primary}40`,
    padding: spacing.lg,
  };

  const titleStyle = {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: classColor.primary,
    marginBottom: spacing.md,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
  };

  const listStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
  };

  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.sm,
    background: `${colors.background.secondary}80`,
    borderRadius: '6px',
    fontSize: typography.fontSize.sm,
  };

  const numberStyle = {
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: classColor.primary,
    color: colors.background.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    flexShrink: 0,
  };

  const textStyle = {
    color: colors.text.primary,
    flex: 1,
  };

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>
        📋 {title}
      </h3>
      <div style={listStyle}>
        {items.map((item, index) => (
          <div key={index} style={itemStyle}>
            <span style={numberStyle}>{index + 1}</span>
            <span style={textStyle}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Accordion - 접이식 섹션
 */

export const Accordion = ({
  items = [],
  classType = 'DemonHunter',
  allowMultiple = false,
}) => {
  const [openItems, setOpenItems] = useState([]);
  const classColor = classColors[classType] || classColors.DemonHunter;

  const toggleItem = (index) => {
    if (allowMultiple) {
      setOpenItems(prev => 
        prev.includes(index) 
          ? prev.filter(i => i !== index)
          : [...prev, index]
      );
    } else {
      setOpenItems(prev => 
        prev.includes(index) ? [] : [index]
      );
    }
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
  };

  const itemStyle = {
    background: colors.background.card,
    borderRadius: '8px',
    border: `1px solid ${colors.border.default}`,
    overflow: 'hidden',
  };

  const headerStyle = (isOpen) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    cursor: 'pointer',
    background: isOpen ? `${classColor.primary}10` : 'transparent',
    transition: 'all 0.2s ease',
  });

  const titleStyle = {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    margin: 0,
  };

  const arrowStyle = (isOpen) => ({
    transition: 'transform 0.2s ease',
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
    color: classColor.primary,
  });

  const contentStyle = {
    padding: spacing.md,
    paddingTop: 0,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.relaxed,
  };

  return (
    <div style={containerStyle}>
      {items.map((item, index) => {
        const isOpen = openItems.includes(index);
        return (
          <div key={index} style={itemStyle}>
            <div 
              style={headerStyle(isOpen)}
              onClick={() => toggleItem(index)}
            >
              <h4 style={titleStyle}>{item.title}</h4>
              <span style={arrowStyle(isOpen)}>▼</span>
            </div>
            {isOpen && (
              <div style={contentStyle}>
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export { TabGroup, QuickRef, Accordion };
export default TabGroup;
