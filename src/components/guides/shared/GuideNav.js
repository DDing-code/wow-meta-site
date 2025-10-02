import React from 'react';
import styled from 'styled-components';

const Sidebar = styled.nav`
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 260px;
  max-height: 80vh;
  background: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.border};
  border-radius: 0 8px 8px 0;
  overflow-y: auto;
  padding: ${props => props.theme.spacing.lg} 0;
  z-index: 100;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.secondary};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 3px;
    opacity: 0.8;
  }
`;

const NavSection = styled.div`
  padding: 0 ${props => props.theme.spacing.lg};
`;

const NavItem = styled.a`
  display: block;
  padding: ${props => props.theme.spacing.md};
  margin: 0.2rem 0;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text};
  text-decoration: none;
  border-left: 3px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  background: ${props => props.active ? props.theme.colors.hover : 'transparent'};
  transition: all 0.2s ease;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: ${props => props.active ? '600' : '400'};

  &:hover {
    background: ${props => props.theme.colors.hover};
    color: ${props => props.theme.colors.primary};
  }
`;

const SubNavItem = styled.a`
  display: block;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  padding-left: ${props => props.theme.spacing.xxl};
  margin: 0.1rem 0;
  color: ${props => props.active ? props.theme.colors.accent : props.theme.colors.subtext};
  text-decoration: none;
  border-left: 2px solid ${props => props.active ? props.theme.colors.accent : 'transparent'};
  background: ${props => props.active ? 'rgba(170, 211, 114, 0.05)' : 'transparent'};
  transition: all 0.2s ease;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: ${props => props.active ? '500' : '400'};

  &:hover {
    background: rgba(170, 211, 114, 0.05);
    color: ${props => props.theme.colors.accent};
  }
`;

const GuideNav = ({
  activeSection,
  activeSubSection,
  setActiveSection,
  setActiveSubSection,
  sectionRefs,
  navItems = {
    overview: {
      title: '개요',
      subItems: [
        { key: 'overview-intro', title: '전문화 소개' },
        { key: 'overview-resource', title: '리소스 시스템' }
      ]
    },
    rotation: {
      title: '딜사이클',
      subItems: [
        { key: 'rotation-tier', title: '티어 세트' },
        { key: 'rotation-single', title: '단일 대상' },
        { key: 'rotation-aoe', title: '광역 대상' }
      ]
    },
    builds: {
      title: '특성',
      subItems: [
        { key: 'builds-talents', title: '특성 빌드' }
      ]
    },
    stats: {
      title: '스탯',
      subItems: [
        { key: 'stats-priority', title: '우선순위' },
        { key: 'stats-simc', title: 'SimC 스트링' }
      ]
    }
  }
}) => {
  const scrollToSection = (section) => {
    setActiveSection(section);
    setActiveSubSection('');
    const element = sectionRefs[section]?.current;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSubSection = (subSection) => {
    setActiveSubSection(subSection);
    const element = document.querySelector(`[ref="${subSection}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Sidebar>
      <NavSection>
        {Object.entries(navItems).map(([key, item]) => (
          <React.Fragment key={key}>
            <NavItem
              active={activeSection === key}
              onClick={() => scrollToSection(key)}
            >
              {item.title}
            </NavItem>
            {item.subItems.map(subItem => (
              <SubNavItem
                key={subItem.key}
                active={activeSubSection === subItem.key}
                onClick={() => scrollToSubSection(subItem.key)}
                style={{ display: activeSection === key ? 'block' : 'none' }}
              >
                {subItem.title}
              </SubNavItem>
            ))}
          </React.Fragment>
        ))}
      </NavSection>
    </Sidebar>
  );
};

export default GuideNav;