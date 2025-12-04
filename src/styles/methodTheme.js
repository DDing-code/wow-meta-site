// ============================================================
// Method.gg 스타일 테마 - 완전 복제
// ============================================================
// Method.gg의 실제 디자인 시스템을 정확히 재현
// - 매우 어두운 배경 (#0a0a0f ~ #1a1a2e)
// - 최소주의 디자인
// - 텍스트 중심, 정보 밀도 극대화
// ============================================================

export const methodTheme = {
  // ========================================
  // 레이아웃 시스템
  // ========================================
  layout: {
    sidebarWidth: '320px',         // 좌측 Sidebar
    mainContentWidth: '900px',     // 메인 콘텐츠
    maxWidth: '1280px',            // 전체 최대 너비
    gap: '40px'                    // Sidebar-Main 간격
  },

  // ========================================
  // 색상 시스템 (Method.gg 실제 값)
  // ========================================
  colors: {
    // 배경 (매우 어두운 톤)
    background: {
      main: '#0a0a0f',             // 페이지 메인 배경
      surface: '#1e1e2e',          // 카드/패널
      elevated: '#2a2a3a',         // 호버/강조
      sidebar: '#14141f'           // 사이드바 배경
    },

    // 텍스트
    text: {
      primary: '#e0e0e0',          // 주 텍스트
      secondary: '#a0a0a0',        // 부 텍스트
      tertiary: '#6a6a7a',         // 덜 중요한 텍스트
      muted: '#4a4a5a'             // 매우 흐린 텍스트
    },

    // 테두리
    border: {
      default: 'rgba(255, 255, 255, 0.1)',
      muted: 'rgba(255, 255, 255, 0.05)',
      emphasis: 'rgba(255, 255, 255, 0.15)'
    },

    // 강조 색상 (Method 파란색)
    accent: {
      blue: '#3b82f6',             // Method 메인 블루
      blueLight: '#60a5fa',        // 밝은 블루 (호버)
      blueDark: '#2563eb'          // 어두운 블루
    },

    // WoW 클래스 색상 (최소 사용)
    classColors: {
      deathknight: '#C41E3A',
      demonhunter: '#A330C9',
      druid: '#FF7C0A',
      evoker: '#33937F',
      hunter: '#AAD372',
      mage: '#3FC7EB',
      monk: '#00FF98',
      paladin: '#F48CBA',
      priest: '#FFFFFF',
      rogue: '#FFF468',
      shaman: '#0070DD',
      warlock: '#8788EE',
      warrior: '#C69B6D'
    },

    // 상태 색상
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    }
  },

  // ========================================
  // 타이포그래피 (Method.gg 실제 값)
  // ========================================
  typography: {
    // 작은 폰트 (정보 밀도 극대화)
    baseFontSize: '14px',          // Method 표준
    baseLineHeight: 1.6,           // 빡빡한 줄간격
    headingLineHeight: 1.3,

    // 폰트 패밀리 (시스템 폰트)
    fontFamily: {
      base: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      heading: 'inherit',
      mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace'
    },

    // 폰트 크기 (Method 스타일 - 작고 빡빡함)
    fontSize: {
      xs: '11px',                  // 10-11px
      sm: '12px',                  // 12px
      base: '14px',                // 14px (표준)
      md: '15px',                  // 15px
      lg: '16px',                  // 16px
      xl: '18px',                  // 18px
      '2xl': '20px',               // 20px
      '3xl': '24px',               // 24px (h2)
      '4xl': '32px',               // 32px (h1)
      '5xl': '40px'                // 40px (Hero)
    },

    // 폰트 굵기
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    }
  },

  // ========================================
  // 간격 시스템 (Method - 빡빡함)
  // ========================================
  spacing: {
    section: '2rem',               // 32px - 섹션 간격
    subsection: '1.5rem',          // 24px - 서브섹션
    paragraph: '1rem',             // 16px - 단락
    listItem: '0.5rem',            // 8px - 리스트
    cardPadding: '1rem',           // 16px - 카드 패딩
    cardPaddingLarge: '1.5rem'     // 24px - 큰 카드
  },

  // ========================================
  // Border Radius (Method - 최소)
  // ========================================
  borderRadius: {
    none: '0',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    full: '9999px'
  },

  // ========================================
  // 그림자 (Method - 미세)
  // ========================================
  shadows: {
    none: 'none',
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 2px 4px rgba(0, 0, 0, 0.3)',
    lg: '0 4px 8px rgba(0, 0, 0, 0.4)',
    inner: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)'
  },

  // ========================================
  // 전환/애니메이션
  // ========================================
  transitions: {
    fast: 'all 0.1s ease',
    default: 'all 0.2s ease',
    slow: 'all 0.3s ease'
  },

  // ========================================
  // 반응형 브레이크포인트
  // ========================================
  breakpoints: {
    mobile: '640px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
    ultrawide: '1536px'
  },

  // ========================================
  // Z-Index 레이어
  // ========================================
  zIndex: {
    base: 0,
    dropdown: 100,
    sticky: 200,
    fixed: 300,
    modal: 400,
    tooltip: 500
  }
};

export default methodTheme;
