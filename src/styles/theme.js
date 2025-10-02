// Enhanced Theme Configuration
export const theme = {
  colors: {
    // Primary Palette
    primary: '#0a0e1a',
    secondary: '#141823',
    tertiary: '#1c2333',
    surface: '#252a3d',
    overlay: '#2e3447',

    // Accent Colors
    accent: '#ff6b6b',
    accentAlt: '#c084fc',
    accentGlow: 'rgba(255, 107, 107, 0.2)',

    // Text Colors
    text: '#e2e8f0',
    textBright: '#f8fafc',
    subtext: '#94a3b8',
    textMuted: '#64748b',

    // Status Colors
    success: '#4ade80',
    successDark: '#22c55e',
    warning: '#fbbf24',
    warningDark: '#f59e0b',
    error: '#f87171',
    errorDark: '#ef4444',
    info: '#60a5fa',
    infoDark: '#3b82f6',

    // WoW Class Colors (Enhanced)
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
    warrior: '#C69B6D',

    // Rarity Colors
    poor: '#9d9d9d',
    common: '#ffffff',
    uncommon: '#1eff00',
    rare: '#0070dd',
    epic: '#a335ee',
    legendary: '#ff8000',
    artifact: '#e6cc80',
    heirloom: '#00ccff'
  },

  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    dark: 'linear-gradient(135deg, #0a0e1a 0%, #1c2333 100%)',
    accent: 'linear-gradient(135deg, #ff6b6b 0%, #c084fc 100%)',
    glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    epic: 'linear-gradient(135deg, #a335ee 0%, #c084fc 100%)',
    legendary: 'linear-gradient(135deg, #ff8000 0%, #fbbf24 100%)'
  },

  shadows: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.5)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.6)',
    glow: '0 0 20px rgba(255, 107, 107, 0.3)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
  },

  fonts: {
    main: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans KR', sans-serif",
    heading: "'Poppins', 'Inter', 'Noto Sans KR', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace"
  },

  breakpoints: {
    mobile: '640px',
    tablet: '768px',
    laptop: '1024px',
    desktop: '1280px',
    wide: '1536px'
  },

  animations: {
    fadeIn: 'fadeIn 0.3s ease-in-out',
    slideUp: 'slideUp 0.3s ease-out',
    slideDown: 'slideDown 0.3s ease-out',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    glow: 'glow 2s ease-in-out infinite alternate'
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem'
  },

  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px'
  },

  transitions: {
    fast: 'all 0.15s ease',
    default: 'all 0.3s ease',
    slow: 'all 0.5s ease',
    spring: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  }
};

export default theme;