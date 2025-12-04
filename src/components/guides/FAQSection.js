// ============================================================
// FAQSection Component - 다크 아카데믹 스타일 FAQ 섹션
// ============================================================
// styled-components 기반 재구축
// 아코디언 형태의 자주 묻는 질문
// ============================================================

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// ============================================================
// Styled Components
// ============================================================

const SectionTitle = styled.h2`
  font-family: ${props => props.theme.typography.fontFamily.heading};
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 ${props => props.theme.spacing.subsection} 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: ${props => props.theme.typography.fontSize.xl};
  }
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FAQItem = styled.div`
  background: ${props => props.theme.colors.background.surface};
  border-left: 4px solid ${props => props.borderColor};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.card};
  overflow: hidden;
  transition: ${props => props.theme.transitions.default};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.cardHover};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 1rem;
  }
`;

const QuestionButton = styled.button`
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  color: inherit;
`;

const QuestionContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex: 1;
`;

const QuestionIcon = styled.span`
  font-size: 1.5rem;
  line-height: 1;
  flex-shrink: 0;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.25rem;
  }
`;

const QuestionText = styled.span`
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  line-height: ${props => props.theme.typography.baseLineHeight};
  flex: 1;
`;

const ToggleIcon = styled.span`
  font-size: 1.25rem;
  line-height: 1;
  flex-shrink: 0;
  transition: transform ${props => props.theme.transitions.default};
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  color: ${props => props.theme.colors.text.tertiary};
`;

const AnswerContainer = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.border.default};
`;

const AnswerText = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  line-height: ${props => props.theme.typography.baseLineHeight};
  margin: 0;
`;

// ============================================================
// Main Component
// ============================================================

/**
 * FAQSection - 다크 아카데믹 스타일 FAQ 섹션
 *
 * @param {Array} faq - FAQ 배열 (question, answer)
 * @param {string} color - WoW 클래스 색상
 * @param {number} sectionNumber - 섹션 번호 (Icy Veins 스타일)
 */
const FAQSection = ({ faq, color, sectionNumber }) => {
  const [openIndex, setOpenIndex] = useState(null);

  if (!faq || faq.length === 0) {
    return null;
  }

  return (
    <>
      <SectionTitle>
        <span>❓</span>
        {sectionNumber && `${sectionNumber}. `}자주 묻는 질문 (FAQ)
      </SectionTitle>

      <FAQList>
        {faq.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <FAQItem key={index} borderColor={color}>
              <QuestionButton onClick={() => setOpenIndex(isOpen ? null : index)}>
                <QuestionContent>
                  <QuestionIcon>❓</QuestionIcon>
                  <QuestionText>{item.question}</QuestionText>
                </QuestionContent>
                <ToggleIcon isOpen={isOpen}>▼</ToggleIcon>
              </QuestionButton>

              {isOpen && (
                <AnswerContainer>
                  <AnswerText>{item.answer}</AnswerText>
                </AnswerContainer>
              )}
            </FAQItem>
          );
        })}
      </FAQList>
    </>
  );
};

FAQSection.propTypes = {
  faq: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      answer: PropTypes.string.isRequired
    })
  ),
  color: PropTypes.string.isRequired
};

export default FAQSection;
