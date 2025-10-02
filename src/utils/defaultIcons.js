// 기본 SVG 아이콘들 - WoW 아이콘 로드 실패 시 사용
export const defaultIcons = {
  // 기본 검 아이콘
  sword: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 17v2h2l3-3-2-2-3 3zm12.5-11.5L21 11V3h-8l5.5 5.5zM7.5 8.5L3 13l7 7 4.5-4.5L7.5 8.5z"/>
  </svg>`,

  // 방패 아이콘
  shield: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
  </svg>`,

  // 마법 아이콘
  magic: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.5 5.6L10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7zm12 9.8L17 14l1.4 2.5L17 19l2.5-1.4L22 19l-1.4-2.5L22 14zM22 2l-1.4 2.5L18 3l2.5 1.4L19 7l2.5-1.4L24 7l-1.4-2.5L24 2zM13.34 12.78l-2.12-2.12L2 19.88 4.12 22l9.22-9.22z"/>
  </svg>`,

  // 활 아이콘
  bow: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.71 2.29a1 1 0 0 0-1.42 0L2.29 20.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l18-18a1 1 0 0 0 0-1.42z"/>
    <path d="M7 2a5 5 0 0 0-5 5 1 1 0 0 0 2 0 3 3 0 0 1 3-3 1 1 0 0 0 0-2zM17 20a3 3 0 0 1-3-3 1 1 0 0 0-2 0 5 5 0 0 0 5 5 1 1 0 0 0 0-2z"/>
  </svg>`,

  // 치유 아이콘
  heal: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 2v8H2v4h8v8h4v-8h8v-4h-8V2z"/>
  </svg>`,

  // 탱크 아이콘
  tank: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l9 4v6c0 5.5-3.84 10.74-9 12-5.16-1.26-9-6.45-9-12V6l9-4zm0 3.18L5 8.3v3.7c0 3.53 2.16 6.82 5 8.28V5.18z"/>
  </svg>`,

  // DPS 아이콘
  dps: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.92 5H5l9 9 1.92-1.92L6.92 5zM19.71 4.29L15.41 8.59 14 7.17l5.59-5.59c.39-.39 1.02-.39 1.41 0 .39.39.39 1.03 0 1.42zM3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/>
  </svg>`,

  // 퀘스트 아이콘
  quest: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>
  </svg>`,

  // 업적 아이콘
  achievement: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L14.09 8.26L21 9L16 14L17.45 21L12 17.77L6.55 21L8 14L3 9L9.91 8.26L12 2Z"/>
  </svg>`,

  // 인스턴트 캐스트 아이콘
  instant: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
  </svg>`,

  // 레이드 아이콘
  raid: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
  </svg>`,

  // 에픽 아이콘
  epic: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
  </svg>`,

  // 전설 아이콘
  legendary: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.02-1.17l15.74-6.07c.71-.27 1.35.33 1.13 1.05l-2.68 12.77c-.19.91-.74 1.13-1.5.71L12.6 16.9l-1.83 1.76c-.2.19-.36.35-.74.35z"/>
  </svg>`
};

// 기본 아이콘을 SVG 요소로 렌더링하는 함수
export const renderDefaultIcon = (iconKey, size = 24, color = '#cdd6f4') => {
  const iconSvg = defaultIcons[iconKey] || defaultIcons.sword;

  return `
    <div style="
      width: ${size}px;
      height: ${size}px;
      color: ${color};
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      ${iconSvg}
    </div>
  `;
};