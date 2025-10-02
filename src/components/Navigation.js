import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { gameIcons, WowIcon } from '../utils/wowIcons';
import { FaBars, FaTimes } from 'react-icons/fa';

const Nav = styled.nav`
  background: rgba(20, 24, 35, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.lg};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: ${props => props.theme.transitions.default};

  &:hover {
    box-shadow: ${props => props.theme.shadows.xl};
  }
`;

const NavContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 900;
  font-family: ${props => props.theme.fonts.heading};
  background: ${props => props.theme.gradients.accent};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  transition: ${props => props.theme.transitions.spring};
  position: relative;

  &:hover {
    transform: scale(1.05);
  }

  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: ${props => props.theme.gradients.accent};
    transition: ${props => props.theme.transitions.default};
  }

  &:hover:after {
    width: 100%;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: ${props => props.theme.colors.secondary};
    flex-direction: column;
    padding: 1rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  font-family: ${props => props.theme.fonts.main};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.lg};
  transition: ${props => props.theme.transitions.spring};
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${props => props.theme.gradients.accent};
    opacity: 0;
    transition: ${props => props.theme.transitions.default};
    z-index: -1;
  }

  img {
    opacity: 0.8;
    transition: ${props => props.theme.transitions.fast};
  }

  &:hover {
    color: ${props => props.theme.colors.textBright};
    transform: translateY(-2px);

    &:before {
      opacity: 0.1;
    }

    img {
      opacity: 1;
      transform: scale(1.1);
    }
  }

  ${props => props.active && `
    color: ${props.theme.colors.accent};
    background: rgba(255, 107, 107, 0.1);
    box-shadow: ${props.theme.shadows.md};

    &:before {
      opacity: 0.15;
    }
  `}
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const PatchBadge = styled(motion.span)`
  background: ${props => props.theme.gradients.accent};
  color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 0.8rem;
  font-weight: 700;
  margin-left: ${props => props.theme.spacing.sm};
  box-shadow: ${props => props.theme.shadows.glow};
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`;

function Navigation() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: '/', iconUrl: gameIcons.quest, label: '홈' },
    { path: '/news', iconUrl: gameIcons.info, label: '뉴스' },
    { path: '/guide', iconUrl: gameIcons.sword, label: '직업 가이드' },
    { path: '/spells', iconUrl: gameIcons.instant, label: '스킬 DB' },
    { path: '/log-analyzer', iconUrl: gameIcons.search, label: '로그 분석' }
  ];

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">
          WoW Meta
          <PatchBadge>11.2</PatchBadge>
        </Logo>

        <NavLinks isOpen={isOpen}>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              active={location.pathname === item.path}
              onClick={() => setIsOpen(false)}
            >
              <WowIcon icon={item.iconUrl} size={20} />
              {item.label}
            </NavLink>
          ))}
        </NavLinks>

        <MobileMenuButton onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </MobileMenuButton>
      </NavContainer>
    </Nav>
  );
}

export default Navigation;