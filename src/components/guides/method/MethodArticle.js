// ============================================================
// Method.gg 스타일 Article Section
// ============================================================
// Method.gg의 본문 스타일 복제
// - 텍스트 중심 디자인
// - 최소한의 마진/패딩
// - 빡빡한 줄간격
// ============================================================

import styled from 'styled-components';

// ============================================================
// Article Container
// ============================================================

const MethodArticle = styled.article`
  /* 섹션 구분 */
  > section {
    padding: ${props => props.theme.spacing.section} 0;
    border-bottom: 1px solid ${props => props.theme.colors.border.default};

    &:last-child {
      border-bottom: none;
    }
  }

  /* H2 스타일 (주요 섹션 제목) */
  h2 {
    font-size: ${props => props.theme.typography.fontSize['3xl']};
    font-weight: ${props => props.theme.typography.fontWeight.bold};
    color: ${props => props.theme.colors.text.primary};
    margin: 0 0 1rem 0;
    line-height: ${props => props.theme.typography.headingLineHeight};

    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      font-size: ${props => props.theme.typography.fontSize['2xl']};
    }
  }

  /* H3 스타일 (서브섹션 제목) */
  h3 {
    font-size: ${props => props.theme.typography.fontSize.xl};
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    color: ${props => props.theme.colors.text.primary};
    margin: 1.5rem 0 0.75rem 0;
    line-height: ${props => props.theme.typography.headingLineHeight};

    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      font-size: ${props => props.theme.typography.fontSize.lg};
    }
  }

  /* H4 스타일 */
  h4 {
    font-size: ${props => props.theme.typography.fontSize.lg};
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    color: ${props => props.theme.colors.text.primary};
    margin: 1rem 0 0.5rem 0;
    line-height: ${props => props.theme.typography.headingLineHeight};
  }

  /* 단락 스타일 */
  p {
    font-size: ${props => props.theme.typography.fontSize.base};
    color: ${props => props.theme.colors.text.primary};
    line-height: 1.7;
    margin: 0 0 1rem 0;

    &:last-child {
      margin-bottom: 0;
    }
  }

  /* 리스트 스타일 */
  ul, ol {
    padding-left: 1.5rem;
    margin: 0 0 1rem 0;

    li {
      font-size: ${props => props.theme.typography.fontSize.base};
      color: ${props => props.theme.colors.text.primary};
      line-height: 1.7;
      margin: 0.5rem 0;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }

  /* 중첩 리스트 */
  ul ul, ol ol, ul ol, ol ul {
    margin: 0.5rem 0;
  }

  /* 링크 스타일 */
  a {
    color: ${props => props.theme.colors.accent.blue};
    text-decoration: none;
    transition: ${props => props.theme.transitions.fast};

    &:hover {
      color: ${props => props.theme.colors.accent.blueLight};
      text-decoration: underline;
    }
  }

  /* 강조 텍스트 */
  strong {
    font-weight: ${props => props.theme.typography.fontWeight.semibold};
    color: ${props => props.theme.colors.text.primary};
  }

  em {
    font-style: italic;
    color: ${props => props.theme.colors.text.secondary};
  }

  /* 인라인 코드 */
  code {
    font-family: ${props => props.theme.typography.fontFamily.mono};
    font-size: 0.9em;
    padding: 0.2em 0.4em;
    background: ${props => props.theme.colors.background.elevated};
    border: 1px solid ${props => props.theme.colors.border.default};
    border-radius: ${props => props.theme.borderRadius.sm};
    color: ${props => props.theme.colors.text.primary};
  }

  /* 코드 블록 */
  pre {
    font-family: ${props => props.theme.typography.fontFamily.mono};
    font-size: ${props => props.theme.typography.fontSize.sm};
    padding: 1rem;
    margin: 1rem 0;
    background: ${props => props.theme.colors.background.elevated};
    border: 1px solid ${props => props.theme.colors.border.default};
    border-radius: ${props => props.theme.borderRadius.md};
    overflow-x: auto;
    line-height: 1.5;

    code {
      padding: 0;
      background: none;
      border: none;
    }
  }

  /* 인용구 */
  blockquote {
    padding-left: 1rem;
    margin: 1rem 0;
    border-left: 3px solid ${props => props.theme.colors.accent.blue};
    color: ${props => props.theme.colors.text.secondary};
    font-style: italic;
  }

  /* 수평선 */
  hr {
    border: none;
    border-top: 1px solid ${props => props.theme.colors.border.default};
    margin: 2rem 0;
  }

  /* 테이블 스타일 */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
    font-size: ${props => props.theme.typography.fontSize.sm};

    th, td {
      padding: 0.75rem;
      text-align: left;
      border: 1px solid ${props => props.theme.colors.border.default};
    }

    th {
      background: ${props => props.theme.colors.background.elevated};
      font-weight: ${props => props.theme.typography.fontWeight.semibold};
      color: ${props => props.theme.colors.text.primary};
    }

    td {
      color: ${props => props.theme.colors.text.primary};
    }

    tr:hover td {
      background: ${props => props.theme.colors.background.surface};
    }
  }

  /* 이미지 */
  img {
    max-width: 100%;
    height: auto;
    border-radius: ${props => props.theme.borderRadius.md};
    margin: 1rem 0;
  }

  /* ============================================================
     스킬 아이콘 스타일 - Method.gg 미니멀 디자인
     ============================================================ */

  /* 아이콘 컨테이너 */
  .skill-icon {
    display: inline-block !important;
    vertical-align: middle !important;
    margin: 0 !important;
    padding: 0 !important;
    width: 18px !important;
    height: 18px !important;
    overflow: visible !important;
    border: none !important;
    border-radius: 0 !important;
    outline: none !important;
    box-shadow: none !important;
  }

  /* 아이콘 이미지 */
  .skill-icon img {
    display: block !important;
    width: 18px !important;
    height: 18px !important;
    max-width: 18px !important;
    max-height: 18px !important;
    border: none !important;
    border-radius: 0 !important;
    outline: none !important;
    box-shadow: none !important;
    opacity: 1 !important;
    margin: 0 !important;
    padding: 0 !important;
    object-fit: contain !important;
  }

  /* 아이콘+텍스트 조합 wrapper */
  span[style*="inline-flex"] {
    display: inline-flex !important;
    align-items: center !important;
    gap: 4px !important;
    vertical-align: middle !important;
  }
`;

export default MethodArticle;
