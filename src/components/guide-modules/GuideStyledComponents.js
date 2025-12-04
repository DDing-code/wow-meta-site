/**
 * GuideStyledComponents.js - 학술 논문 스타일 버전
 * WoW 전문화 가이드 공통 Styled Components
 *
 * 목적: 모든 가이드에서 중복되는 styled-components를 한 곳에서 관리
 * 스타일: 학술 논문 + 게임 가이드 하이브리드 디자인
 * 업데이트: 2025-11-14
 */

import styled, { createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';

// ============================================
// 레이아웃 컴포넌트
// ============================================

export const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${props => props.theme.colors.background || '#0a0a0f'};  /* 다크 배경 */
  color: ${props => props.theme.colors.text};
  position: relative;
`;

export const Sidebar = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  width: 260px;
  height: 100vh;
  background: ${props => props.theme.colors.surface};  /* 연한 회색 */
  border-right: 1px solid ${props => props.theme.colors.border};
  border-radius: 0;  /* 각진 모서리 */
  overflow-y: auto;
  padding: ${props => props.theme.spacing.lg} 0;
  z-index: 100;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.tertiary};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.borderDark};
  }

  /* 모바일에서 숨기기 */
  @media (max-width: 768px) {
    display: none;
  }
`;

export const MainContent = styled.main`
  margin-left: 260px;
  width: calc(100% - 260px);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: ${props => props.theme.spacing.md} 0;

  /* 모바일에서 전체 화면 사용 */
  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    padding: ${props => props.theme.spacing.sm} 0;
  }
`;

/**
 * ContentContainer - 학술 논문 스타일 컨텐츠 너비
 * 기존 3000px에서 1000px로 축소 (읽기 최적화)
 */
export const ContentContainer = styled.div`
  width: 100%;
  max-width: 1000px;  /* 학술 논문 너비 */
  padding: 0 3rem;    /* 넉넉한 패딩 */
  margin: 0 auto;

  /* 모바일에서 패딩 조정 */
  @media (max-width: 768px) {
    max-width: 100%;
    padding: 0 1.5rem;
  }
`;

// ============================================
// 네비게이션 컴포넌트
// ============================================

export const NavSection = styled.div`
  padding: 0 ${props => props.theme.spacing.lg};
  margin-bottom: 1.5rem;
`;

export const NavItem = styled.a`
  display: block;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  margin: 0.2rem 0;
  color: ${props => props.active ? props.theme.colors.accent : props.theme.colors.text};
  text-decoration: none;
  border-left: 3px solid ${props => props.active ? props.theme.colors.accent : 'transparent'};
  background: ${props => props.active ? props.theme.colors.hover : 'transparent'};
  transition: ${props => props.theme.transitions.fast};
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: ${props => props.active ? '600' : '400'};
  font-family: ${props => props.theme.fonts.heading};  /* Inter */

  &:hover {
    background: ${props => props.theme.colors.hover};
    color: ${props => props.theme.colors.accent};
  }
`;

export const SubNavItem = styled.a`
  display: block;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  padding-left: 2rem;
  margin: 0.1rem 0;
  color: ${props => props.active ? props.theme.colors.accent : props.theme.colors.subtext};
  text-decoration: none;
  border-left: 2px solid ${props => props.active ? props.theme.colors.accent : 'transparent'};
  background: ${props => props.active ? props.theme.colors.accentLight : 'transparent'};
  transition: ${props => props.theme.transitions.fast};
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: ${props => props.active ? '500' : '400'};
  font-family: ${props => props.theme.fonts.heading};

  &:hover {
    background: ${props => props.theme.colors.accentLight};
    color: ${props => props.theme.colors.accent};
  }
`;

// ============================================
// 섹션 컴포넌트 (학술 논문 스타일)
// ============================================

export const Section = styled.section`
  width: 100%;
  margin-bottom: 4rem;  /* 큰 섹션 간격 */
  scroll-margin-top: 120px;
`;

/**
 * SectionHeader - 학술 논문 스타일 섹션 헤더
 * 그라디언트 배경 제거 → 하단 테두리
 */
export const SectionHeader = styled.div`
  border-bottom: 2px solid ${props => props.theme.colors.border};  /* 하단 테두리 */
  padding-bottom: 0.5rem;
  margin-top: ${props => props.theme.spacing.section};  /* 4rem */
  margin-bottom: 1.5rem;
`;

/**
 * SectionTitle - 섹션 번호 매기기 지원
 * 학술 논문 스타일 제목
 */
export const SectionTitle = styled.h2`
  font-size: 2rem;  /* 32px */
  color: ${props => props.theme.colors.textBright};  /* 순검정 */
  margin: 0;
  font-weight: 600;  /* 덜 굵게 */
  font-family: ${props => props.theme.fonts.heading};  /* Inter */

  /* 모바일에서 폰트 사이즈 조정 */
  @media (max-width: 768px) {
    font-size: 1.75rem;  /* 28px */
  }
`;

// ============================================
// 카드 컴포넌트 (학술 논문 스타일)
// ============================================

/**
 * Card - 학술 논문 스타일 카드
 * 배경: 연한 회색, 테두리: 명확한 회색, 그림자: 없음/최소
 */
export const Card = styled.div`
  background: ${props => props.theme.colors.surface};  /* #f5f5f5 */
  border: 1px solid ${props => props.theme.colors.border};  /* #e0e0e0 */
  border-radius: 4px;  /* 덜 둥글게 */
  padding: 2rem 2.5rem;  /* 넉넉한 패딩 */
  margin-bottom: 2rem;  /* 큰 간격 */
  width: 100%;
  max-width: 100%;
  box-shadow: none;  /* 그림자 제거 */
  font-family: ${props => props.theme.fonts.main};  /* 세리프 */

  /* 모바일에서 패딩 조정 */
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 2px;
    margin-bottom: 1.5rem;
  }
`;

/**
 * HeroCard - 영웅 특성별 카드 (학술 스타일로 단순화)
 * 그라디언트 배경 최소화, 클래스 색상은 테두리로만 표시
 */
export const HeroCard = styled(Card)`
  background: ${props => props.theme.colors.surface};  /* 단색 배경 */

  border-left: 4px solid ${props => {
    if (!props.heroColors || !props.heroType) {
      return props.theme.colors.accent};
    const colors = props.heroColors[props.heroType];
    return colors?.border || props.theme.colors.accent;
  }};

  position: relative;
  overflow: hidden;

  /* 상단 그라디언트 라인 제거 (학술 스타일에 맞지 않음) */
`;

// ============================================
// 토스트 알림 컴포넌트
// ============================================

export const CopyToast = styled(motion.div)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: ${props => props.theme.colors.success};
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 6px;
  box-shadow: ${props => props.theme.shadows.card};
  font-weight: 500;
  font-family: ${props => props.theme.fonts.heading};
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '✓';
    font-size: 1.2rem;
    font-weight: bold;
  }
`;

export const UpdateToast = styled(motion.div)`
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: ${props => props.theme.colors.accent};
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 6px;
  box-shadow: ${props => props.theme.shadows.card};
  font-weight: 500;
  font-family: ${props => props.theme.fonts.heading};
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '🔄';
    font-size: 1.2rem;
  }
`;

// ============================================
// 학술 논문 스타일 추가 컴포넌트
// ============================================

/**
 * Table - 학술 논문 스타일 표
 */
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 2rem 0;
  font-family: ${props => props.theme.fonts?.main || 'inherit'};
  font-size: 0.95rem;
  background: ${props => props.theme.colors.surface || '#15151f'};  /* 다크 서피스 */
`;

export const TableHeader = styled.thead`
  background: ${props => props.theme.colors.secondary || '#1a1a2e'};  /* 다크 헤더 */
  border-top: 2px solid ${props => props.theme.colors.border || '#2a2a3e'};
  border-bottom: 2px solid ${props => props.theme.colors.border || '#2a2a3e'};
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.borderLight};

  &:hover {
    background: ${props => props.theme.colors.hover};  /* 미묘한 호버 */
  }
`;

export const TableCell = styled.td`
  padding: 1rem;
  text-align: left;
  border-right: 1px solid ${props => props.theme.colors.borderLight};

  &:last-child {
    border-right: none;
  }
`;

export const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.heading};
  border-right: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-right: none;
  }
`;

/**
 * Figure - 학술 논문 스타일 그림
 */
export const Figure = styled.figure`
  margin: 3rem auto;
  text-align: center;
  max-width: 100%;

  img {
    max-width: 100%;
    height: auto;
    border: 1px solid ${props => props.theme.colors.border};
  }
`;

export const FigureCaption = styled.figcaption`
  font-size: 0.9rem;
  font-style: italic;
  color: ${props => props.theme.colors.subtext};
  margin-top: 0.75rem;
  text-align: center;
  font-family: ${props => props.theme.fonts.caption};
`;

/**
 * SectionDivider - 섹션 구분선
 */
export const SectionDivider = styled.div`
  width: 100%;
  height: 1px;
  background: ${props => props.theme.colors.divider};  /* #d0d0d0 */
  margin: 3rem 0;
`;

// ============================================
// 글로벌 스타일 (애니메이션 최소화)
// ============================================

export const GlobalStyle = createGlobalStyle`
  /* 부드러운 페이드 애니메이션만 유지 */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* 무한 반복 애니메이션 제거 (학술 논문 스타일) */
`;

/**
 * 사용 예시:
 *
 * import { ThemeProvider } from 'styled-components';
 * import {
 *   PageWrapper,
 *   Sidebar,
 *   MainContent,
 *   ContentContainer,
 *   Section,
 *   SectionHeader,
 *   SectionTitle,
 *   Card,
 *   Table,
 *   GlobalStyle
 * } from './guide-modules/GuideStyledComponents.js';
 *
 * <ThemeProvider theme={theme}>
 *   <GlobalStyle />
 *   <PageWrapper>
 *     <Sidebar>...</Sidebar>
 *     <MainContent>
 *       <ContentContainer>
 *         <Section>
 *           <SectionHeader>
 *             <SectionTitle>1. 개요</SectionTitle>
 *           </SectionHeader>
 *           <Card>...</Card>
 *         </Section>
 *       </ContentContainer>
 *     </MainContent>
 *   </PageWrapper>
 * </ThemeProvider>
 */
