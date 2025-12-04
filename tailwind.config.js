/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // WoW Primary Colors (Gold + Blue)
        primary: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',  // Main WoW Gold
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        secondary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',  // Alliance Blue
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        accent: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#DC2626',  // Horde Red
          600: '#B91C1C',
          700: '#991B1B',
          800: '#7F1D1D',
          900: '#7C2D12',
        },

        // WoW Class Colors
        'class-deathknight': '#C41E3A',
        'class-demonhunter': '#A330C9',
        'class-druid': '#FF7C0A',
        'class-evoker': '#33937F',
        'class-hunter': '#AAD372',
        'class-mage': '#3FC7EB',
        'class-monk': '#00FF98',
        'class-paladin': '#F48CBA',
        'class-priest': '#FFFFFF',
        'class-rogue': '#FFF468',
        'class-shaman': '#0070DD',
        'class-warlock': '#8788EE',
        'class-warrior': '#C69B6D',

        // Background System (Azeroth Dark)
        'bg-main': '#0F172A',      // Slate 900
        'bg-surface': '#1E293B',   // Slate 800
        'bg-elevated': '#334155',  // Slate 700
        'bg-overlay': '#475569',   // Slate 600

        // Text System
        'text-primary': '#F1F5F9',   // Slate 100
        'text-secondary': '#CBD5E1', // Slate 300
        'text-tertiary': '#94A3B8',  // Slate 400
        'text-muted': '#64748B',     // Slate 500

        // Border System
        'border-default': '#334155', // Slate 700
        'border-muted': '#475569',   // Slate 600
        'border-emphasis': '#64748B', // Slate 500
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Alegreya Sans', 'Inter', 'system-ui'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },

      fontSize: {
        'xs': ['0.64rem', { lineHeight: '1rem' }],      // 10.24px
        'sm': ['0.8rem', { lineHeight: '1.25rem' }],    // 12.8px
        'base': ['1rem', { lineHeight: '1.5rem' }],     // 16px
        'lg': ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
        'xl': ['1.563rem', { lineHeight: '2rem' }],     // 25px
        '2xl': ['1.953rem', { lineHeight: '2.25rem' }], // 31.25px
        '3xl': ['2.441rem', { lineHeight: '2.5rem' }],  // 39.06px
        '4xl': ['3.052rem', { lineHeight: '3rem' }],    // 48.83px
      },

      spacing: {
        '18': '4.5rem',  // 72px
        '88': '22rem',   // 352px
        '128': '32rem',  // 512px
        // 논문 스타일 간격 (theme.js academic 설정과 동기화)
        'section': '5rem',      // 80px - 주 섹션 간격
        'subsection': '3rem',   // 48px - 하위 섹션 간격
        'paragraph': '2rem',    // 32px - 단락 간격
      },

      maxWidth: {
        // 논문 스타일 컨텐츠 너비 (theme.js academic 설정과 동기화)
        'academic': '800px',     // 좁은 읽기 영역 (가독성 최적화)
        'academic-wide': '1200px', // 넓은 논문 너비 (표/차트용)
      },

      boxShadow: {
        'glow-gold': '0 0 20px rgba(245, 158, 11, 0.5)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-class': '0 0 20px var(--class-glow-color, rgba(59, 130, 246, 0.5))',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-wow-gold': 'linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%)',
        'gradient-wow-blue': 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
      },

      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(245, 158, 11, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(245, 158, 11, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },

      borderRadius: {
        'wow': '0.75rem', // 12px - WoW UI 스타일
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
