// ============================================================
// Design System - Cyberpunk Dark Theme
// ============================================================
// 생성일: 2025-01-10
// 목적: 통합 가이드 컴포넌트의 일관된 디자인 토큰 정의
// 적용 범위: HeroBanner, GuideLayout, InlineTableOfContents, GuideRotation, GuideMechanisms
// ============================================================

// ============================================================
// Color System
// ============================================================
export const colorSystem = {
  // Primary Color - Rich Purple (기존 #A330C9 대체)
  primary: {
    main: '#9333EA',        // Rich purple (더 포화도 높은 보라)
    light: '#C084FC',       // Purple 400
    dark: '#7C3AED',        // Purple 600
    glow: 'rgba(147, 51, 234, 0.2)',  // 20% opacity for borders
    subtle: 'rgba(147, 51, 234, 0.05)', // 5% opacity for backgrounds
  },

  // Secondary Color - Hell Red (악마 사냥꾼 테마)
  secondary: {
    main: '#DC2626',        // Red 600
    light: '#F87171',       // Red 400
    dark: '#991B1B',        // Red 800
    glow: 'rgba(220, 38, 38, 0.2)',
  },

  // Accent Color - Cyber Cyan (미래적 강조색)
  accent: {
    main: '#06B6D4',        // Cyan 500
    light: '#22D3EE',       // Cyan 400
    dark: '#0891B2',        // Cyan 600
  },

  // Background Colors
  background: {
    main: '#0A0E27',        // Deep navy (기존 #0a0a0f 대체)
    surface: '#1A1F3A',     // Surface level (기존 #15151f 대체)
    elevated: '#252A4A',    // Elevated surfaces (카드, 패널)
    overlay: 'rgba(10, 14, 39, 0.95)', // Modal/Dropdown 배경
  },

  // Text Colors (WCAG AA 준수)
  text: {
    primary: '#F3F4F6',     // Gray 100 (기존 #e0e0e0 대체) - 7.2:1 contrast
    secondary: '#D1D5DB',   // Gray 300 (기존 rgba(255,255,255,0.7) 대체) - 4.8:1 contrast
    tertiary: '#9CA3AF',    // Gray 400 (덜 중요한 텍스트) - 3.2:1 contrast
    muted: '#6B7280',       // Gray 500 (매우 덜 중요한 텍스트)
  },

  // Border Colors
  border: {
    default: 'rgba(147, 51, 234, 0.2)',  // Primary with 20% opacity
    muted: 'rgba(255, 255, 255, 0.08)',  // Subtle borders
    focus: 'rgba(147, 51, 234, 0.5)',    // Focus state
  },

  // Semantic Colors
  semantic: {
    success: '#10B981',     // Green 500
    warning: '#F59E0B',     // Amber 500
    error: '#EF4444',       // Red 500
    info: '#3B82F6',        // Blue 500
  },
};

// ============================================================
// Typography - Major Third Scale (1.250 ratio)
// ============================================================
export const typography = {
  // Font Sizes (Major Third Scale: 1rem = 16px 기준)
  fontSize: {
    xs: '0.64rem',      // 10.24px
    sm: '0.8rem',       // 12.8px
    base: '1rem',       // 16px (본문)
    lg: '1.25rem',      // 20px
    xl: '1.563rem',     // 25px
    '2xl': '1.953rem',  // 31.25px
    '3xl': '2.441rem',  // 39.06px (제목)
    '4xl': '3.052rem',  // 48.83px (Hero 타이틀)
  },

  // Font Weights
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Line Heights
  lineHeight: {
    tight: 1.25,        // 제목용
    normal: 1.5,        // 본문용
    relaxed: 1.75,      // 긴 문단용
  },

  // Font Family
  fontFamily: {
    base: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,
    mono: `'Courier New', Courier, monospace`,
  },
};

// ============================================================
// Spacing - 8px Grid System (Tailwind 호환)
// ============================================================
export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
};

// ============================================================
// Border Radius
// ============================================================
export const borderRadius = {
  none: '0',
  sm: '0.375rem',      // 6px (작은 요소: 버튼, 태그)
  DEFAULT: '0.5rem',   // 8px (기본: 카드, 패널)
  lg: '0.75rem',       // 12px (큰 요소: 모달, 섹션)
  full: '9999px',      // 완전한 원형
};

// ============================================================
// Shadows - Material Design Elevation
// ============================================================
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',                              // 1dp
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', // 2dp
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // 4dp
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // 8dp
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // 16dp

  // Primary Color Shadows (글로우 효과용)
  primary: '0 4px 12px rgba(147, 51, 234, 0.3)',
  primaryLg: '0 8px 20px rgba(147, 51, 234, 0.4)',
};

// ============================================================
// Transitions - Cubic Bezier Easing
// ============================================================
export const transitions = {
  // Duration
  fast: '0.15s',
  base: '0.2s',
  slow: '0.3s',

  // Easing Functions
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',  // Material Design standard
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },

  // Combined (duration + easing)
  all: {
    fast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    base: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// ============================================================
// Z-Index Scale
// ============================================================
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
};

// ============================================================
// Breakpoints (반응형 디자인용)
// ============================================================
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// ============================================================
// Animation Presets
// ============================================================
export const animations = {
  // Fade In
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },

  // Slide Up
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.2 },
  },

  // Scale
  scale: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
    transition: { duration: 0.15 },
  },
};

// ============================================================
// Motion Variants (Stripe-style)
// ============================================================

/**
 * Framer Motion variants for consistent animations across the site
 * Based on Stripe's interaction patterns - subtle, purposeful, professional
 */
export const motionVariants = {
  // Button interactions - scale + shadow elevation
  button: {
    hover: {
      scale: 1.02,
      boxShadow: '0 4px 12px rgba(147, 51, 234, 0.25)',
    },
    tap: {
      scale: 0.98,
    },
  },

  // Tab interactions - subtle scale + glow
  tab: {
    hover: {
      scale: 1.02,
      boxShadow: '0 4px 12px rgba(147, 51, 234, 0.2)',
    },
    tap: {
      scale: 0.97,
    },
  },

  // Card elevation - lift + shadow depth
  card: {
    rest: {
      y: 0,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
    },
    hover: {
      y: -4,
      boxShadow: '0 12px 24px -4px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(147, 51, 234, 0.3)',
    },
  },

  // Hero card - special elevation (higher lift)
  heroCard: {
    rest: {
      y: 0,
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
    },
    hover: {
      y: -6,
      boxShadow: '0 16px 32px -4px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(147, 51, 234, 0.4)',
    },
  },

  // Error shake animation
  errorShake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.4,
    },
  },
};

// ============================================================
// Spring Configurations (Stripe-style physics)
// ============================================================

/**
 * Spring physics configurations for natural motion
 * Stiffness: How quickly animation reaches target (100-400)
 * Damping: How much bounce/oscillation (10-30, higher = less bounce)
 */
export const springConfigs = {
  // Gentle spring - smooth, elegant (for large movements)
  gentle: {
    type: "spring",
    stiffness: 100,
    damping: 15,
  },

  // Responsive spring - balanced feel (default choice)
  responsive: {
    type: "spring",
    stiffness: 300,
    damping: 20,
  },

  // Snappy spring - quick, crisp (for buttons/tabs)
  snappy: {
    type: "spring",
    stiffness: 400,
    damping: 17,
  },
};

// ============================================================
// Utility Functions
// ============================================================

/**
 * 색상에 투명도 추가
 * @param {string} color - HEX 색상 (#RRGGBB)
 * @param {number} opacity - 투명도 (0-1)
 * @returns {string} rgba 색상
 */
export const addOpacity = (color, opacity) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * 반응형 미디어 쿼리 생성
 * @param {string} breakpoint - breakpoints 키
 * @returns {string} 미디어 쿼리 문자열
 */
export const media = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
};

// ============================================================
// Default Export (편의성)
// ============================================================
export default {
  colorSystem,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  breakpoints,
  animations,
  addOpacity,
  media,
};
