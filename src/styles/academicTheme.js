// ============================================================
// Academic Theme - 다크 아카데믹 스타일 디자인 시스템
// ============================================================
// styled-components 전용 테마
// WoW 가이드 페이지를 위한 논문 스타일 + 다크 배경
// ============================================================

export const academicTheme = {
  // ========================================
  // 레이아웃 시스템 (Method/Liquid 스타일)
  // ========================================
  layout: {
    maxContentWidth: '1200px',     // Method 스타일 넓은 콘텐츠 영역
    maxWideWidth: '1400px',        // 표/차트용 초광폭 영역
    maxUltraWide: '1600px',        // 특수 레이아웃용
    sidebarWidth: '280px'          // Method 스타일 사이드바 (약간 더 넓게)
  },

  // ========================================
  // Method/Liquid 스타일 간격 시스템 (공간 활용 최적화)
  // ========================================
  spacing: {
    section: '6rem',               // 96px - 주 섹션 간격 (Method 넓은 간격)
    subsection: '4rem',            // 64px - 하위 섹션 간격
    paragraph: '2rem',             // 32px - 단락 간격
    listItem: '1rem',              // 16px - 리스트 항목 간격
    cardPadding: '2rem',           // 32px - 카드 내부 여백 (Method 스타일)
    cardPaddingLarge: '3rem'       // 48px - 큰 카드 여백
  },

  // ========================================
  // 색상 시스템 (Method/Liquid 스타일)
  // ========================================
  colors: {
    // Method 스타일: 더 어두운 배경 (Zinc 계열)
    background: {
      main: '#18181B',             // 메인 배경 (Zinc 900) - 거의 검정
      surface: '#27272A',          // 카드/패널 (Zinc 800)
      elevated: '#3F3F46',         // 강조 요소 (Zinc 700)
      overlay: '#52525B'           // 오버레이 (Zinc 600)
    },

    // 텍스트 색상 (Method 가독성 최적화)
    text: {
      primary: '#FAFAFA',          // Zinc 50 - 더 밝은 주 텍스트
      secondary: '#A1A1AA',        // Zinc 400 - 부 텍스트
      tertiary: '#71717A',         // Zinc 500 - 덜 중요
      muted: '#52525B'             // Zinc 600 - 매우 덜 중요
    },

    // 테두리 (Method 미세한 구분선)
    border: {
      default: '#3F3F46',          // Zinc 700
      muted: '#52525B',            // Zinc 600
      emphasis: '#71717A'          // Zinc 500
    },

    // Method 브랜드 컬러: 오렌지 팔레트
    accent: {
      orange: '#FF7700',           // Method 메인 오렌지
      orangeLight: '#FF9500',      // 밝은 오렌지
      orangeDark: '#E66A00',       // 어두운 오렌지
      orangeGlow: 'rgba(255, 119, 0, 0.3)'  // Glow 효과용
    },

    // WoW 클래스 색상 (13개)
    classColors: {
      deathknight: '#C41E3A',      // 죽음의기사 - 진홍
      demonhunter: '#A330C9',      // 악마사냥꾼 - 보라
      druid: '#FF7C0A',            // 드루이드 - 주황
      evoker: '#33937F',           // 기원사 - 청록
      hunter: '#AAD372',           // 사냥꾼 - 연두
      mage: '#3FC7EB',             // 마법사 - 하늘색
      monk: '#00FF98',             // 수도사 - 민트
      paladin: '#F48CBA',          // 성기사 - 분홍
      priest: '#FFFFFF',           // 사제 - 흰색
      rogue: '#FFF468',            // 도적 - 노랑
      shaman: '#0070DD',           // 주술사 - 파랑
      warlock: '#8788EE',          // 흑마법사 - 연보라
      warrior: '#C69B6D'           // 전사 - 갈색
    },

    // 상태 색상
    status: {
      success: '#4ade80',          // 초급 난이도
      warning: '#fbbf24',          // 중급 난이도
      error: '#f87171',            // 상급 난이도
      info: '#60a5fa'              // 정보
    }
  },

  // ========================================
  // 타이포그래피 시스템 (Method/Liquid 스타일 최적화)
  // ========================================
  typography: {
    // Method 스타일: 큰 폰트 + 적정 line-height (가독성 우선)
    baseFontSize: '1rem',          // 16px - Method 표준 크기
    baseLineHeight: 1.6,           // Method 스타일 줄간격 (더 타이트하고 프로페셔널)
    headingLineHeight: 1.3,        // 제목 줄간격

    // 폰트 패밀리
    fontFamily: {
      base: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans KR', sans-serif",
      heading: "'Poppins', 'Inter', 'Noto Sans KR', sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace"
    },

    // 폰트 크기 (Method 스타일 - 명확한 계층 구조)
    fontSize: {
      xs: '0.75rem',               // 12px
      sm: '0.875rem',              // 14px
      base: '1rem',                // 16px
      lg: '1.125rem',              // 18px
      xl: '1.25rem',               // 20px
      '2xl': '1.5rem',             // 24px (h3)
      '3xl': '2rem',               // 32px (h2) - Method 스타일
      '4xl': '3rem'                // 48px (h1) - Method 대형 헤딩
    },

    // 폰트 굵기
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    }
  },

  // ========================================
  // 그림자 시스템 (Method/Liquid 스타일 - 더 강한 그림자)
  // ========================================
  shadows: {
    card: '0 2px 8px rgba(0, 0, 0, 0.3)',           // Method 스타일 카드 그림자
    cardHover: '0 4px 12px rgba(0, 0, 0, 0.4)',     // 호버 시 더 강한 그림자
    glow: (color, opacity = 0.3) => `0 0 15px ${color}${Math.round(opacity * 255).toString(16)}`,
    glowStrong: (color) => `0 0 20px ${color}`,
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
  },

  // ========================================
  // 전환/애니메이션
  // ========================================
  transitions: {
    fast: 'all 0.15s ease',
    default: 'all 0.2s ease',
    slow: 'all 0.3s ease',
    spring: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  },

  // ========================================
  // Border Radius (Method/Liquid 스타일 - 12px 기본)
  // ========================================
  borderRadius: {
    sm: '0.5rem',                  // 8px
    md: '0.75rem',                 // 12px - Method 표준 radius
    lg: '1rem',                    // 16px
    xl: '1.5rem',                  // 24px
    full: '9999px'                 // 원형
  },

  // ========================================
  // 반응형 브레이크포인트
  // ========================================
  breakpoints: {
    mobile: '640px',
    tablet: '768px',
    laptop: '1024px',
    desktop: '1280px',
    wide: '1536px'
  },

  // ========================================
  // Z-Index 시스템
  // ========================================
  zIndex: {
    base: 1,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modalBackdrop: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600
  }
};

export default academicTheme;
