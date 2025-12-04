/**
 * WoW-Meta Design System Tokens
 * 직업별 색상, 타이포그래피, 스페이싱 정의
 */

// 직업별 색상
export const classColors = {
  DemonHunter: {
    primary: '#A330C9',
    secondary: '#1A1A2E',
    accent: '#FF6B6B',
    gradient: 'linear-gradient(135deg, #A330C9 0%, #6B1D84 100%)',
  },
  DeathKnight: {
    primary: '#C41E3A',
    secondary: '#1A1A2E',
    accent: '#00D1FF',
    gradient: 'linear-gradient(135deg, #C41E3A 0%, #8B1528 100%)',
  },
  Warrior: {
    primary: '#C69B6D',
    secondary: '#1A1A2E',
    accent: '#FF8C00',
    gradient: 'linear-gradient(135deg, #C69B6D 0%, #8B6914 100%)',
  },
  Paladin: {
    primary: '#F48CBA',
    secondary: '#1A1A2E',
    accent: '#FFD700',
    gradient: 'linear-gradient(135deg, #F48CBA 0%, #C46B93 100%)',
  },
  Mage: {
    primary: '#3FC7EB',
    secondary: '#1A1A2E',
    accent: '#9B59B6',
    gradient: 'linear-gradient(135deg, #3FC7EB 0%, #2980B9 100%)',
  },
  Hunter: {
    primary: '#AAD372',
    secondary: '#1A1A2E',
    accent: '#8B4513',
    gradient: 'linear-gradient(135deg, #AAD372 0%, #7CB342 100%)',
  },
  Rogue: {
    primary: '#FFF468',
    secondary: '#1A1A2E',
    accent: '#2C3E50',
    gradient: 'linear-gradient(135deg, #FFF468 0%, #F39C12 100%)',
  },
  Priest: {
    primary: '#FFFFFF',
    secondary: '#1A1A2E',
    accent: '#9B59B6',
    gradient: 'linear-gradient(135deg, #FFFFFF 0%, #BDC3C7 100%)',
  },
  Warlock: {
    primary: '#8788EE',
    secondary: '#1A1A2E',
    accent: '#2ECC71',
    gradient: 'linear-gradient(135deg, #8788EE 0%, #5B5BD6 100%)',
  },
  Shaman: {
    primary: '#0070DD',
    secondary: '#1A1A2E',
    accent: '#E74C3C',
    gradient: 'linear-gradient(135deg, #0070DD 0%, #004A94 100%)',
  },
  Monk: {
    primary: '#00FF98',
    secondary: '#1A1A2E',
    accent: '#F39C12',
    gradient: 'linear-gradient(135deg, #00FF98 0%, #00B36B 100%)',
  },
  Druid: {
    primary: '#FF7C0A',
    secondary: '#1A1A2E',
    accent: '#27AE60',
    gradient: 'linear-gradient(135deg, #FF7C0A 0%, #CC6300 100%)',
  },
  Evoker: {
    primary: '#33937F',
    secondary: '#1A1A2E',
    accent: '#E74C3C',
    gradient: 'linear-gradient(135deg, #33937F 0%, #1E5C4E 100%)',
  },
};

// 공통 색상
export const colors = {
  background: {
    primary: '#0D0D14',
    secondary: '#1A1A2E',
    tertiary: '#252542',
    card: '#1E1E32',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B8B8D0',
    muted: '#6B6B8D',
    accent: '#FFD700',
  },
  border: {
    default: '#2A2A4A',
    hover: '#3A3A6A',
    active: '#4A4A8A',
  },
  status: {
    success: '#2ECC71',
    warning: '#F39C12',
    error: '#E74C3C',
    info: '#3498DB',
  },
};

// 타이포그래피
export const typography = {
  fontFamily: {
    heading: "'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif",
    body: "'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// 스페이싱
export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
};

// 반응형 브레이크포인트
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// 그림자
export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
  md: '0 4px 6px rgba(0, 0, 0, 0.4)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.5)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.6)',
  glow: (color) => `0 0 20px ${color}40, 0 0 40px ${color}20`,
};

// 애니메이션
export const animations = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

// 아이콘 크기
export const iconSizes = {
  sm: 16,
  md: 24,
  lg: 36,
  xl: 48,
  '2xl': 64,
};

// Wowhead CDN 베이스 URL
export const WOWHEAD_ICON_URL = 'https://wow.zamimg.com/images/wow/icons';

// 아이콘 URL 생성 헬퍼
export const getIconUrl = (iconName, size = 'large') => {
  const sizeMap = {
    small: 'small',
    medium: 'medium',
    large: 'large',
  };
  return `${WOWHEAD_ICON_URL}/${sizeMap[size]}/${iconName}.jpg`;
};
