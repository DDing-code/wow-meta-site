// ============================================================
// ResourcesSection Component - 다크 아카데믹 스타일 참고 자료 섹션
// ============================================================
// styled-components 기반 재구축
// 외부 자료 링크 카드 그리드
// ============================================================

import React from 'react';
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

const ResourcesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ResourceLink = styled.a`
  background: ${props => props.theme.colors.background.surface};
  border-left: 4px solid ${props => props.borderColor};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.card};
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  text-decoration: none;
  transition: ${props => props.theme.transitions.default};
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.cardHover};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 1rem;
  }
`;

const ResourceIcon = styled.span`
  font-size: 1.75rem;
  line-height: 1;
  flex-shrink: 0;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`;

const ResourceContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ResourceHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const ResourceName = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
  flex: 1;
`;

const ExternalIcon = styled.span`
  color: ${props => props.color};
  font-size: ${props => props.theme.typography.fontSize.lg};
  flex-shrink: 0;
`;

const ResourceDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  line-height: ${props => props.theme.typography.baseLineHeight};
  margin: 0;
`;

// ============================================================
// Main Component
// ============================================================

/**
 * ResourcesSection - 다크 아카데믹 스타일 참고 자료 섹션
 *
 * @param {Array} resources - 자료 배열 (name, url, type, description)
 * @param {string} color - WoW 클래스 색상
 * @param {number} sectionNumber - 섹션 번호 (Icy Veins 스타일)
 */
const ResourcesSection = ({ resources, color, sectionNumber }) => {
  if (!resources || resources.length === 0) {
    return null;
  }

  const typeIcons = {
    guide: '📖',
    video: '🎥',
    tool: '🛠️',
    discord: '💬',
    website: '🌐',
    addon: '🔌'
  };

  return (
    <>
      <SectionTitle>
        <span>🔗</span>
        {sectionNumber && `${sectionNumber}. `}참고 자료
      </SectionTitle>

      <ResourcesGrid>
        {resources.map((resource, index) => (
          <ResourceLink
            key={index}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            borderColor={color}
          >
            <ResourceIcon>
              {typeIcons[resource.type] || '📌'}
            </ResourceIcon>

            <ResourceContent>
              <ResourceHeader>
                <ResourceName>{resource.name}</ResourceName>
                <ExternalIcon color={color}>→</ExternalIcon>
              </ResourceHeader>

              {resource.description && (
                <ResourceDescription>{resource.description}</ResourceDescription>
              )}
            </ResourceContent>
          </ResourceLink>
        ))}
      </ResourcesGrid>
    </>
  );
};

ResourcesSection.propTypes = {
  resources: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      type: PropTypes.string,
      description: PropTypes.string
    })
  ),
  color: PropTypes.string.isRequired
};

export default ResourcesSection;
