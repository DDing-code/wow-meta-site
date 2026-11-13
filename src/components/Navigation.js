import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { BookOpen, Castle, Compass, Database, Flag, Home, KeyRound, Menu, Newspaper, X } from 'lucide-react';
import { EDITIONS, getEdition, getEditionSwitchPath } from '../data/gameEditions.js';

// 버전별 강조색: 리테일은 금색, 포에버는 초록(ForeverPage.js의 FOREVER_ACCENT와 같다).
const EDITION_ACCENT = { retail: '#d2b373', forever: '#8dbb6c' };

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: 1px solid rgba(168, 178, 188, 0.14);
  background: rgba(9, 12, 15, 0.94);
  backdrop-filter: blur(12px);

  &[data-edition="forever"] {
    background: #101a15;
    border-bottom-color: #364438;
    #primary-navigation { background: #101a15; }
    #primary-navigation a { color: #becab9; }
    #primary-navigation a[aria-current="page"] { color: #f0d59b; }
    #primary-navigation a:hover { color: #f2eddd; }
  }
`;

const NavInner = styled.div`
  width: min(1280px, calc(100% - 32px));
  min-height: 58px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;

  @media (max-width: 900px) {
    gap: 12px;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;

  @media (max-width: 420px) {
    gap: 10px;
  }
`;

// 리테일/포에버 토글. 다크·라이트 모드 토글처럼 어느 화면에서나 보이고, 누르면 주소도 그 버전으로 바뀐다.
const EditionToggle = styled.div`
  flex: 0 0 auto;
  display: inline-flex;
  border: 1px solid rgba(168, 178, 188, 0.24);
`;

const EditionOption = styled(Link)`
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 11px;
  background: ${props => (props.$active ? props.$accent : 'transparent')};
  color: ${props => (props.$active ? '#090c0f' : '#8f9aa2')};
  font-size: 0.78rem;
  font-weight: ${props => (props.$active ? 780 : 620)};
  white-space: nowrap;

  &:hover {
    color: ${props => (props.$active ? '#090c0f' : '#eef1f3')};
  }

  &:focus-visible {
    outline-offset: 2px;
  }

  @media (max-width: 900px) {
    min-height: 32px;
  }

  @media (max-width: 360px) {
    padding: 0 9px;
  }
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

  /* 토글이 들어갈 자리를 내려고 좁은 폭에서는 뺀다. */
  @media (max-width: 1040px) {
    display: none;
  }
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;

  /* 메뉴가 한 줄에 다 들어가지 않는 중간 폭은 아이콘을 빼고 간격을 줄인다. */
  @media (min-width: 901px) and (max-width: 1160px) {
    gap: 14px;

    svg {
      display: none;
    }
  }

  @media (max-width: 900px) {
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
  border-bottom: 2px solid ${props => (props.$active ? props.$accent : 'transparent')};
  color: ${props => (props.$active ? '#eef1f3' : '#8f9aa2')};
  background: transparent;
  font-size: 0.84rem;
  font-weight: ${props => (props.$active ? 700 : 560)};
  white-space: nowrap;

  &:hover {
    color: #eef1f3;
  }

  &:focus-visible {
    outline-offset: 1px;
  }

  @media (max-width: 900px) {
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

  @media (max-width: 900px) {
    display: grid;
    place-items: center;
  }
`;

const retailNavItems = [
  { path: '/', label: '홈', icon: Home, exact: true },
  { path: '/beginner', label: '초보자 안내', icon: Compass },
  { path: '/guide', label: '직업 가이드', icon: BookOpen },
  { path: '/raid', label: '레이드 가이드', icon: Castle },
  { path: '/mythicplus', label: '쐐기 가이드', icon: KeyRound },
  { path: '/spells', label: '스펠 DB', icon: Database },
  { path: '/news', label: '소식', icon: Newspaper },
];

// 포에버 메뉴. 포에버 자료가 늘면 여기에 더한다(리테일 메뉴와 섞지 않는다).
const foreverNavItems = [
  { path: '/forever', label: '포에버 홈', icon: Home, exact: true },
  { path: '/forever/start', label: '시작하기', icon: Compass },
  { path: '/forever/rules', label: '규칙·진영', icon: Flag },
  { path: '/forever/leveling', label: '지역·던전', icon: Compass },
  { path: '/forever/growth', label: '캠핑·유산', icon: KeyRound },
  { path: '/forever/classes', label: '직업 선택', icon: BookOpen },
  { path: '/forever/raids', label: '레이드 준비', icon: Castle },
];

const NAV_ITEMS = { retail: retailNavItems, forever: foreverNavItems };

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
  const edition = getEdition(location.pathname);
  const accent = EDITION_ACCENT[edition];
  const home = EDITIONS.find(item => item.id === edition).home;

  return (
    <Nav data-edition={edition}>
      <NavInner>
        <Left>
          <Brand to={home} onClick={() => setOpen(false)}>
            <BrandMark>
              <WowMetaMark />
            </BrandMark>
            <Wordmark>wowmeta</Wordmark>
            <Patch>GUIDES</Patch>
          </Brand>

          <EditionToggle role="group" aria-label="게임 버전">
            {EDITIONS.map(item => {
              const active = item.id === edition;
              return (
                <EditionOption
                  key={item.id}
                  to={getEditionSwitchPath(location.pathname, item.id)}
                  $active={active}
                  $accent={EDITION_ACCENT[item.id]}
                  aria-current={active ? 'true' : undefined}
                  data-edition={item.id}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </EditionOption>
              );
            })}
          </EditionToggle>
        </Left>

        <Links id="primary-navigation" $open={open}>
          {NAV_ITEMS[edition].map(item => {
            const Icon = item.icon;
            // 로그 분석(/logs, /guide/.../log-analysis)은 메뉴에 없고 링크로만 연다. 그 화면에서는 어느 탭도 켜지 않는다.
            const isLogReport = location.pathname.includes('/log-analysis');
            const active = item.exact
              ? location.pathname === item.path || location.pathname === `${item.path}/`
              : !isLogReport && (location.pathname === item.path || location.pathname.startsWith(`${item.path}/`));
            return (
              <NavItem
                key={item.path}
                to={item.path}
                $active={active}
                $accent={accent}
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
