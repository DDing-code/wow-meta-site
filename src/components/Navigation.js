import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { BarChart3, BookOpen, Database, Home, Menu, Newspaper, X } from 'lucide-react';

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: 1px solid rgba(168, 178, 188, 0.14);
  background: rgba(9, 12, 15, 0.94);
  backdrop-filter: blur(12px);
`;

const NavInner = styled.div`
  width: min(1280px, calc(100% - 32px));
  min-height: 58px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: #eef1f3;
  font-weight: 750;
  letter-spacing: 0;
`;

const BrandMark = styled.span`
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border: 0;
  background: transparent;
`;

const LogoSvg = styled.svg`
  width: 27px;
  height: 27px;
`;

const Wordmark = styled.span`
  color: #eef1f3;
  font-size: 0.96rem;
  font-weight: 750;
`;

const Patch = styled.span`
  margin-left: 5px;
  color: #88949c;
  font-size: 0.64rem;
  font-weight: 650;
  letter-spacing: 0.04em;
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;

  @media (max-width: 780px) {
    position: absolute;
    top: 58px;
    right: 0;
    left: 0;
    display: ${props => (props.$open ? 'grid' : 'none')};
    gap: 0;
    padding: 8px 16px 16px;
    border-bottom: 1px solid rgba(168, 178, 188, 0.14);
    background: rgba(9, 12, 15, 0.99);
  }
`;

const NavItem = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 2px;
  border-bottom: 2px solid ${props => (props.$active ? '#d2b373' : 'transparent')};
  color: ${props => (props.$active ? '#eef1f3' : '#8f9aa2')};
  background: transparent;
  font-size: 0.84rem;
  font-weight: ${props => (props.$active ? 700 : 560)};

  &:hover {
    color: #eef1f3;
  }

  &:focus-visible {
    outline-offset: 1px;
  }

  @media (max-width: 780px) {
    justify-content: flex-start;
    min-height: 44px;
    padding: 0 6px;
    border-bottom-color: rgba(168, 178, 188, 0.09);
  }
`;

const MenuButton = styled.button`
  display: none;
  width: 38px;
  height: 38px;
  border: 1px solid rgba(168, 178, 188, 0.22);
  background: transparent;
  color: #eef1f3;

  @media (max-width: 780px) {
    display: grid;
    place-items: center;
  }
`;

const navItems = [
  { path: '/', label: '홈', icon: Home },
  { path: '/guide', label: '가이드', icon: BookOpen },
  { path: '/logs', label: '로그 분석', icon: BarChart3 },
  { path: '/spells', label: '스펠 DB', icon: Database },
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
          <Patch>GUIDES</Patch>
        </Brand>

        <Links id="primary-navigation" $open={open}>
          {navItems.map(item => {
            const Icon = item.icon;
            const active = item.path === '/'
              ? location.pathname === '/'
              : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
            return (
              <NavItem
                key={item.path}
                to={item.path}
                $active={active}
                aria-current={active ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                <Icon size={16} aria-hidden="true" />
                {item.label}
              </NavItem>
            );
          })}
        </Links>

        <MenuButton
          type="button"
          aria-label="메뉴"
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen(value => !value)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </MenuButton>
      </NavInner>
    </Nav>
  );
}

export default Navigation;
