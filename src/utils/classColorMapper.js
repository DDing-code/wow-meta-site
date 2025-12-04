/**
 * WoW 직업별 색상 자동 배정 시스템
 *
 * 13개 직업의 공식 클래스 색상을 기반으로
 * 가이드 테마 색상을 자동 생성합니다.
 */

// WoW 공식 클래스 색상 (Hex)
export const CLASS_COLORS = {
  WARRIOR: '#C69B6D',       // 전사
  PALADIN: '#F58CBA',       // 성기사
  HUNTER: '#AAD372',        // 사냥꾼
  ROGUE: '#FFF569',         // 도적
  PRIEST: '#FFFFFF',        // 사제
  SHAMAN: '#0070DE',        // 주술사
  MAGE: '#3FC6EA',          // 마법사
  WARLOCK: '#9482C9',       // 흑마법사
  MONK: '#00FF96',          // 수도사
  DRUID: '#FF7D0A',         // 드루이드
  DEMONHUNTER: '#A330C9',   // 악마사냥꾼
  DEATHKNIGHT: '#C41E3A',   // 죽음의 기사
  EVOKER: '#33937F'         // 기원사
};

/**
 * Hex 색상을 RGB 값으로 변환
 * @param {string} hex - Hex 색상 코드 (예: '#C69B6D')
 * @returns {string} RGB 값 (예: '198, 155, 109')
 */
function hexToRgb(hex) {
  // # 제거
  const cleanHex = hex.replace('#', '');

  // RGB 값 추출
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return `${r}, ${g}, ${b}`;
}

/**
 * 클래스명에 따라 완전한 테마 색상 객체를 생성
 * @param {string} className - 클래스명 (대문자, 예: 'WARRIOR', 'MAGE')
 * @returns {object} 테마 색상 객체
 */
export function getClassColors(className) {
  // 클래스명을 대문자로 변환
  const upperClassName = className.toUpperCase();

  // 클래스 색상 가져오기 (없으면 기본값: 전사)
  const primaryColor = CLASS_COLORS[upperClassName] || CLASS_COLORS.WARRIOR;

  // RGB 값 생성
  const primaryRgb = hexToRgb(primaryColor);

  // 완전한 테마 색상 객체 반환
  return {
    // 클래스 고유 색상
    primary: primaryColor,
    primaryRgb: primaryRgb,
    accent: primaryColor,  // primary와 동일
    hover: `rgba(${primaryRgb}, 0.1)`,

    // 공통 색상 (모든 가이드 동일)
    secondary: '#1a1a2e',
    background: '#0a0a0f',
    surface: '#15151f',
    text: '#e0e0e0',
    subtext: '#a0a0a0',
    border: '#2a2a3e',
    success: '#4caf50',
    danger: '#f44336',
    warning: '#ff9800',
  };
}

/**
 * 클래스명이 유효한지 검증
 * @param {string} className - 클래스명
 * @returns {boolean} 유효 여부
 */
export function isValidClassName(className) {
  return Object.keys(CLASS_COLORS).includes(className.toUpperCase());
}

/**
 * 모든 클래스 목록 가져오기
 * @returns {string[]} 클래스명 배열
 */
export function getAllClassNames() {
  return Object.keys(CLASS_COLORS);
}

/**
 * 클래스별 색상 미리보기 (개발/디버깅용)
 * @returns {object} 클래스명: 색상 매핑
 */
export function getColorPreview() {
  const preview = {};

  Object.keys(CLASS_COLORS).forEach(className => {
    preview[className] = {
      hex: CLASS_COLORS[className],
      rgb: hexToRgb(CLASS_COLORS[className]),
      fullTheme: getClassColors(className)
    };
  });

  return preview;
}

/**
 * 사용 예시:
 *
 * import { getClassColors } from '../utils/classColorMapper.js';
 *
 * const GuideTemplate = ({ classConfig }) => {
 *   const colors = getClassColors(classConfig.className);
 *   const theme = { colors, ...otherThemeProps };
 *
 *   return (
 *     <ThemeProvider theme={theme}>
 *       <div style={{ color: colors.primary }}>...</div>
 *     </ThemeProvider>
 *   );
 * };
 */

// 기본 export
export default getClassColors;
