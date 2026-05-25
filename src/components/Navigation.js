import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { BookOpen, Database, Home, Layers3, Menu, Newspaper, X } from 'lucide-react';

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: 1px solid rgba(184, 145, 91, 0.22);
  background: rgba(8, 11, 13, 0.94);
  backdrop-filter: blur(14px);
`;

const NavInner = styled.div`
  width: min(1280px, calc(100% - 32px));
  min-height: 64px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 11px;
  color: #f4efe5;
  font-weight: 900;
  letter-spacing: 0;
`;

const BrandMark = styled.span`
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 0;
  background: transparent;
`;

const LogoSvg = styled.svg`
  width: 30px;
  height: 30px;
`;

const Wordmark = styled.span`
  color: #f4efe5;
  font-size: 1rem;
  font-weight: 900;
`;

const Patch = styled.span`
  margin-left: 6px;
  color: #b8915b;
  font-size: 0.76rem;
  font-weight: 900;
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  @media (max-width: 780px) {
    position: absolute;
    top: 64px;
    right: 0;
    left: 0;
    display: ${props => (props.$open ? 'grid' : 'none')};
    gap: 0;
    padding: 8px 16px 16px;
    border-bottom: 1px solid rgba(184, 145, 91, 0.22);
    background: rgba(8, 11, 13, 0.98);
  }
`;

const NavItem = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 12px;
  border: 1px solid ${props => (props.$active ? 'rgba(184, 145, 91, 0.35)' : 'transparent')};
  color: ${props => (props.$active ? '#f4efe5' : '#9aa6b2')};
  background: ${props => (props.$active ? 'rgba(184, 145, 91, 0.1)' : 'transparent')};
  font-size: 0.9rem;
  font-weight: 800;

  &:hover {
    color: #f4efe5;
    border-color: rgba(184, 145, 91, 0.28);
    background: rgba(244, 239, 229, 0.05);
  }
`;

const MenuButton = styled.button`
  display: none;
  width: 38px;
  height: 38px;
  border: 1px solid rgba(184, 145, 91, 0.32);
  background: #11171c;
  color: #f4efe5;

  @media (max-width: 780px) {
    display: grid;
    place-items: center;
  }
`;

const navItems = [
  { path: '/', label: '홈', icon: Home },
  { path: '/guide', label: '가이드', icon: BookOpen },
  { path: '/spells', label: '스펠 DB', icon: Database },
  { path: '/mockups', label: '목업', icon: Layers3 },
  { path: '/news', label: '소식', icon: Newspaper },
];

function WowMetaMark() {
  return (
    <LogoSvg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M9 16 L19 48 L31 23 L43 48 L55 16" fill="none" stroke="#f4efe5" strokeWidth="6" strokeLinejoin="round" />
      <path d="M20 48 L31 23 L42 48" fill="none" stroke="#b8915b" strokeWidth="2.8" strokeLinejoin="round" />
      <path d="M18 20 C26 15 38 15 46 20" fill="none" stroke="#78a85a" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="18" cy="20" r="2.8" fill="#78a85a" />
      <circle cx="46" cy="20" r="2.8" fill="#78a85a" />
    </LogoSvg>
  );
}

function Navigation() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <Nav>
      <NavInner>
        <Brand to="/" onClick={() => setOpen(false)}>
          <BrandMark>
            <WowMetaMark />
          </BrandMark>
          <Wordmark>wowmeta</Wordmark>
          <Patch>12.0.5</Patch>
        </Brand>

        <Links $open={open}>
          {navItems.map(item => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <NavItem key={item.path} to={item.path} $active={active} onClick={() => setOpen(false)}>
                <Icon size={16} aria-hidden="true" />
                {item.label}
              </NavItem>
            );
          })}
        </Links>

        <MenuButton type="button" onClick={() => setOpen(value => !value)} aria-label="메뉴">
          {open ? <X size={18} /> : <Menu size={18} />}
        </MenuButton>
      </NavInner>
    </Nav>
  );
}

export default Navigation;
