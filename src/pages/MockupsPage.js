import React, { useEffect } from 'react';
import styled from 'styled-components';
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  Clock3,
  Database,
  FileText,
  GitBranch,
  Gauge,
  Layers3,
  Map,
  Network,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Swords,
  Target,
  Zap,
} from 'lucide-react';
import kbData from '../data/kb-skills.json';

const allSkills = Object.values(kbData.skills || {});
const skillRows = allSkills
  .filter(item => item.iconUrl && item.koreanName && item.englishName)
  .slice(0, 12);

const chartIconSets = Array.from({ length: 10 }, (_, chartIndex) => (
  Array.from({ length: 4 }, (_, iconIndex) => {
    if (!skillRows.length) return null;
    return skillRows[(chartIndex * 3 + iconIndex) % skillRows.length];
  })
));

const classRows = [
  { name: '죽음의 기사', specs: '혈기 / 냉기 / 부정', color: '#C41E3A' },
  { name: '악마사냥꾼', specs: '파멸 / 복수 / 포식', color: '#A330C9' },
  { name: '드루이드', specs: '조화 / 야성 / 수호 / 회복', color: '#FF7C0A' },
  { name: '기원사', specs: '황폐 / 보존 / 증강', color: '#33937F' },
  { name: '사냥꾼', specs: '야수 / 사격 / 생존', color: '#AAD372' },
  { name: '마법사', specs: '비전 / 화염 / 냉기', color: '#3FC7EB' },
  { name: '수도사', specs: '양조 / 운무 / 풍운', color: '#00FF98' },
  { name: '성기사', specs: '신성 / 보호 / 징벌', color: '#F48CBA' },
];

const priorityRows = [
  ['01', '쿨기 정렬', '영웅 특성 발동과 주요 쿨기를 겹칩니다.'],
  ['02', '자원 관리', '분노가 넘치기 전에 핵심기를 먼저 사용합니다.'],
  ['03', '발동 효과', '짧은 지속시간 버프를 우선 소모합니다.'],
  ['04', '유지 구간', '다음 극딜 전까지 우선순위 딜사이클로 전환합니다.'],
];

const sourceRows = [
  ['Wowhead', '공식 한글명 / 툴팁'],
  ['Icy Veins', '딜사이클 설명'],
  ['직업 디스코드', '전문화 핀 글 / FAQ'],
  ['WCL', '상위 로그 검증'],
];

const openerSteps = [
  ['-2.0', '물약', 'prep'],
  ['0.0', '돌진', 'start'],
  ['1.5', '주요 쿨기', 'burst'],
  ['3.0', '핵심 발동', 'proc'],
  ['5.5', '강화기', 'burst'],
  ['8.0', '유지기', 'hold'],
];

const cooldownLanes = [
  { label: '주요 쿨기', bars: [[0, 22], [120, 22]], color: '#b8915b' },
  { label: '장신구', bars: [[4, 18], [124, 18]], color: '#78a85a' },
  { label: '영웅 특성', bars: [[18, 14], [96, 14], [174, 14]], color: '#aeb8bd' },
  { label: '물약/블러드', bars: [[0, 40]], color: '#c96442' },
];

const procRows = [
  ['발동 1개', '핵심기 강화', '즉시 소모'],
  ['발동 2개', '충돌 위험', '짧은 버프 먼저'],
  ['자원 초과', '낭비 위험', '생성기 중단'],
  ['광역 진입', '타겟 변화', '광역 소비기로 전환'],
];

const targetBars = [
  ['1', 42],
  ['2', 58],
  ['4', 76],
  ['6', 92],
  ['8+', 84],
];

const defensiveRows = [
  ['0:18', '광역 피해', '개인 생존기'],
  ['0:44', '탱크 강타', '외부 생존기'],
  ['1:12', '연속 피해', '힐 쿨기'],
  ['1:48', '위험 중첩', '면역/이동기'],
];

const rotationRailSteps = [
  { label: '자원 100까지', note: '생성기 반복', icon: 0 },
  { label: '진입기', note: '전투 시작', icon: 1 },
  { label: '광역 강화', note: '타겟 수 확인', icon: 2 },
  { label: '발동 확인', note: '버프 스택', icon: 3, stack: [8, 9] },
  { label: '주요 소비기', note: '자원 소모', icon: 4 },
  { label: '반복', note: '필러 구간', icon: 1 },
  { label: '쿨기 정렬', note: '극딜 구간', icon: 5 },
  { label: '마무리', note: '강화 소비', icon: 2 },
  { label: '복귀', note: '생성기로 전환', icon: 0 },
];

const rotationPriorityRows = [
  { text: '주요 변신/강화 상태에 진입한 뒤 핵심 소비기를 사용', icon: 5 },
  { text: '자원이 상한에 닿기 전에 가장 강한 소비기를 먼저 사용', icon: 4 },
  { text: '짧은 지속시간 발동 버프는 필러보다 우선 소모', icon: 8 },
  { text: '광역 구간에서는 타겟 수 기준으로 광역 강화기를 먼저 확인', icon: 2 },
  { text: '쿨기 구간이 끝나면 생성기와 필러 중심의 유지 딜사이클로 복귀', icon: 0 },
];

const guideTemplateStats = [
  ['난이도', '중간'],
  ['강점', '폭발적인 2분 쿨기'],
  ['약점', '발동 관리 의존'],
  ['추천 콘텐츠', '레이드 / 쐐기'],
];

const guideTemplateBuilds = [
  { label: '레이드 단일', tone: 'green', summary: '보스 한 명을 오래 치는 전투에서 쿨기 정렬과 발동 소비를 가장 강하게 잡는 표준 빌드입니다.' },
  { label: '쐐기 광역', tone: 'brass', summary: '타겟 수가 자주 변하는 던전에서 광역 강화기와 짧은 쿨기 순환을 우선하는 빌드입니다.' },
];

const guideTemplateChapters = [
  ['01', '핵심 요약', '한 화면 안에서 빌드, 강점, 약점, 우선순위를 먼저 확인합니다.'],
  ['02', '특성 선택', '레이드/쐐기/광역 상황에 따라 바꾸는 노드만 따로 강조합니다.'],
  ['03', '전투 흐름', '아이콘 노드와 우선순위 리스트를 같이 배치해 순서와 조건을 동시에 읽게 합니다.'],
  ['04', '스킬 해설', '공식 한글명, 툴팁, 시너지, 사용 위치를 KB에서 끌어와 설명합니다.'],
  ['05', '출처 검증', 'Wowhead 공식 번역과 가이드 출처, WCL 검증 상태를 끝부분에 남깁니다.'],
];

const guideTemplateSources = [
  ['S', 'ko.wowhead 공식 한글명'],
  ['A/B', 'Wowhead / Icy Veins / 직업 디스코드 교차 확인'],
  ['WCL', '상위 로그 사용률 확인'],
];

const Page = styled.div`
  min-height: 100vh;
  background:
    linear-gradient(180deg, #070a0d 0%, #0a0f12 44%, #11161a 100%),
    #070a0d;
  color: #f4efe5;
  word-break: keep-all;
  overflow-wrap: break-word;
`;

const Shell = styled.div`
  width: min(1380px, calc(100% - 32px));
  margin: 0 auto;
  padding: 34px 0 340px;
`;

const LogoSvg = styled.svg`
  width: ${props => props.$size || '46px'};
  height: ${props => props.$size || '46px'};
  flex: 0 0 auto;
`;

function WowMetaMark({ size }) {
  return (
    <LogoSvg $size={size} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M9 16 L19 48 L31 23 L43 48 L55 16" fill="none" stroke="#f4efe5" strokeWidth="6" strokeLinejoin="round" />
      <path d="M20 48 L31 23 L42 48" fill="none" stroke="#b8915b" strokeWidth="2.8" strokeLinejoin="round" />
      <path d="M18 20 C26 15 38 15 46 20" fill="none" stroke="#78a85a" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="18" cy="20" r="2.8" fill="#78a85a" />
      <circle cx="46" cy="20" r="2.8" fill="#78a85a" />
    </LogoSvg>
  );
}

const Hero = styled.header`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: 28px;
  align-items: end;
  margin-bottom: 24px;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

const BrandLine = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const MarkBox = styled.div`
  width: 68px;
  height: 68px;
  display: grid;
  place-items: center;
  border: 0;
  background: transparent;
  box-shadow: none;
`;

const Word = styled.h1`
  color: #f4efe5;
  font-size: clamp(2.1rem, 5vw, 4.2rem);
  line-height: 1;
  font-weight: 900;
  letter-spacing: 0;
`;

const Label = styled.div`
  margin-top: 12px;
  color: #b8915b;
  font-size: 0.78rem;
  font-weight: 900;
`;

const Intro = styled.p`
  max-width: 760px;
  margin-top: 12px;
  color: #c7bba7;
  font-size: 1rem;
  font-weight: 700;
`;

const Palette = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border: 1px solid rgba(184, 145, 91, 0.32);
`;

const Swatch = styled.div`
  min-height: 76px;
  padding: 12px;
  border-right: 1px solid rgba(184, 145, 91, 0.2);
  border-bottom: 1px solid rgba(184, 145, 91, 0.2);
  background: ${props => props.$color};
  color: ${props => props.$text || '#f4efe5'};
  font-size: 0.78rem;
  font-weight: 900;

  &:nth-child(2n) {
    border-right: 0;
  }

  &:nth-last-child(-n + 2) {
    border-bottom: 0;
  }
`;

const JumpBar = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 22px;
`;

const Jump = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 12px;
  border: 1px solid rgba(184, 145, 91, 0.34);
  background: rgba(17, 23, 28, 0.82);
  color: #f4efe5;
  font-size: 0.82rem;
  font-weight: 900;

  &:hover {
    border-color: #b8915b;
    color: #f7ddb1;
  }
`;

const Section = styled.section`
  scroll-margin-top: 84px;
  margin-top: 28px;
`;

const SectionHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 420px;
  gap: 24px;
  margin-bottom: 14px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const SectionTitle = styled.h2`
  color: #f4efe5;
  font-size: clamp(1.35rem, 2.2vw, 2.2rem);
  letter-spacing: 0;
`;

const SectionText = styled.p`
  max-width: 760px;
  margin-top: 7px;
  color: #aeb8bd;
  font-size: 0.92rem;
  font-weight: 700;
`;

const Notes = styled.div`
  display: grid;
  gap: 7px;
`;

const Note = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #d8cbb7;
  font-size: 0.82rem;
  font-weight: 900;
`;

const CodexFrame = styled.div`
  position: relative;
  border: 1px solid rgba(184, 145, 91, 0.42);
  background: #0d1216;
  box-shadow:
    inset 0 0 0 1px rgba(244, 239, 229, 0.035),
    0 24px 80px rgba(0, 0, 0, 0.28);

  &:before,
  &:after {
    content: '';
    position: absolute;
    width: 28px;
    height: 28px;
    border-color: #b8915b;
    pointer-events: none;
  }

  &:before {
    top: 9px;
    left: 9px;
    border-top: 1px solid;
    border-left: 1px solid;
  }

  &:after {
    right: 9px;
    bottom: 9px;
    border-right: 1px solid;
    border-bottom: 1px solid;
  }
`;

const FrameTop = styled.div`
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 18px;
  border-bottom: 1px solid rgba(184, 145, 91, 0.25);
  background: #12181e;
`;

const FrameName = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #f4efe5;
  font-size: 0.88rem;
  font-weight: 900;
`;

const FrameMeta = styled.div`
  color: #b8915b;
  font-size: 0.76rem;
  font-weight: 900;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr) 300px;
  min-height: 660px;

  @media (max-width: 1120px) {
    grid-template-columns: 1fr;
  }
`;

const DarkRail = styled.aside`
  border-right: 1px solid rgba(184, 145, 91, 0.22);
  background: #0b1014;

  @media (max-width: 1120px) {
    border-right: 0;
    border-bottom: 1px solid rgba(184, 145, 91, 0.22);
  }
`;

const RailHead = styled.div`
  padding: 16px;
  border-bottom: 1px solid rgba(184, 145, 91, 0.18);
  color: #b8915b;
  font-size: 0.78rem;
  font-weight: 900;
`;

const ClassList = styled.div`
  display: grid;

  @media (max-width: 1120px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

const ClassRow = styled.div`
  display: grid;
  grid-template-columns: 5px minmax(0, 1fr);
  min-height: 54px;
  border-bottom: 1px solid rgba(244, 239, 229, 0.07);
`;

const ClassColor = styled.div`
  background: ${props => props.$color};
`;

const ClassBody = styled.div`
  padding: 9px 11px;
`;

const ClassName = styled.div`
  color: #f4efe5;
  font-size: 0.84rem;
  font-weight: 900;
`;

const ClassSpecs = styled.div`
  margin-top: 2px;
  color: #8d9aa3;
  font-size: 0.69rem;
  font-weight: 800;
`;

const Workspace = styled.main`
  padding: 18px;
  background:
    linear-gradient(90deg, rgba(184, 145, 91, 0.035) 1px, transparent 1px),
    linear-gradient(180deg, rgba(184, 145, 91, 0.035) 1px, transparent 1px),
    #10161b;
  background-size: 34px 34px;
`;

const Toolbar = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 150px 128px;
  gap: 8px;
  margin-bottom: 14px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const Tool = styled.div`
  min-height: 38px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  border: 1px solid rgba(184, 145, 91, 0.28);
  background: #0b1014;
  color: #aeb8bd;
  font-size: 0.78rem;
  font-weight: 800;
`;

const GuideSheet = styled.div`
  border: 1px solid rgba(184, 145, 91, 0.36);
  background: #11171c;
  color: #f4efe5;
`;

const SheetHead = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  align-items: start;
  padding: 20px;
  border-bottom: 1px solid rgba(184, 145, 91, 0.26);
  background: #141b20;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

const SheetTitle = styled.h3`
  color: #f4efe5;
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  letter-spacing: 0;
`;

const SheetLead = styled.p`
  max-width: 720px;
  margin-top: 8px;
  color: #aeb8bd;
  font-size: 0.9rem;
  font-weight: 800;
`;

const RouteCard = styled.div`
  min-width: 210px;
  padding: 12px;
  border: 1px solid rgba(184, 145, 91, 0.36);
  background: #0b1014;
`;

const RouteLine = styled.div`
  display: grid;
  grid-template-columns: 10px minmax(0, 1fr);
  gap: 8px;
  align-items: center;
  min-height: 28px;
  color: #d8cbb7;
  font-size: 0.74rem;
  font-weight: 900;
`;

const Node = styled.span`
  width: 8px;
  height: 8px;
  border: 1px solid rgba(244, 239, 229, 0.44);
  background: ${props => props.$active ? '#78a85a' : '#b8915b'};
`;

const SheetBody = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 16px;
  padding: 18px;

  @media (max-width: 840px) {
    grid-template-columns: 1fr;
  }
`;

const Table = styled.div`
  border: 1px solid rgba(184, 145, 91, 0.3);
  background: #0d1216;
`;

const TableTitle = styled.div`
  min-height: 38px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border-bottom: 1px solid rgba(184, 145, 91, 0.24);
  color: #f4efe5;
  font-size: 0.8rem;
  font-weight: 900;
`;

const PriorityRow = styled.div`
  display: grid;
  grid-template-columns: 42px 150px minmax(0, 1fr);
  gap: 10px;
  min-height: 52px;
  align-items: center;
  padding: 0 12px;
  border-bottom: 1px solid rgba(244, 239, 229, 0.07);
  color: #f4efe5;
  font-size: 0.78rem;
  font-weight: 800;

  &:last-child {
    border-bottom: 0;
  }

  @media (max-width: 700px) {
    grid-template-columns: 34px minmax(0, 1fr);
    padding: 10px 12px;
  }
`;

const Rank = styled.div`
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border: 1px solid rgba(184, 145, 91, 0.5);
  background: #0b1014;
  color: #b8915b;
  font-size: 0.7rem;
  font-weight: 900;
`;

const PriorityName = styled.div`
  font-weight: 900;
`;

const PriorityText = styled.div`
  color: #aeb8bd;

  @media (max-width: 700px) {
    grid-column: 2;
  }
`;

const SkillPanel = styled.div`
  border: 1px solid rgba(184, 145, 91, 0.3);
  background: #0b1014;
  color: #f4efe5;
`;

const IconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 42px);
  gap: 9px;
  padding: 12px;
`;

const SkillIcon = styled.img`
  width: 42px;
  height: 42px;
  border: 1px solid rgba(244, 239, 229, 0.2);
  background: #080b0d;
`;

const Ledger = styled.aside`
  border-left: 1px solid rgba(184, 145, 91, 0.22);
  background: #0d1216;
  padding: 16px;

  @media (max-width: 1120px) {
    border-left: 0;
    border-top: 1px solid rgba(184, 145, 91, 0.22);
  }
`;

const LedgerTitle = styled.div`
  color: #b8915b;
  font-size: 0.78rem;
  font-weight: 900;
`;

const LedgerBlock = styled.div`
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(184, 145, 91, 0.2);
`;

const KeyValue = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  min-height: 30px;
  color: #d8cbb7;
  font-size: 0.76rem;
  font-weight: 800;
`;

const SpellList = styled.div`
  display: grid;
  gap: 8px;
`;

const SpellRow = styled.a`
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) 82px;
  gap: 10px;
  align-items: center;
  min-height: 52px;
  padding: 7px 8px;
  border: 1px solid rgba(184, 145, 91, 0.22);
  background: #10161b;
  color: #f4efe5;
`;

const SmallIcon = styled.img`
  width: 36px;
  height: 36px;
  border: 1px solid rgba(244, 239, 229, 0.16);
`;

const SpellName = styled.div`
  overflow: hidden;
  font-size: 0.8rem;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SpellMeta = styled.div`
  overflow: hidden;
  margin-top: 2px;
  color: #8d9aa3;
  font-size: 0.68rem;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SpellType = styled.div`
  justify-self: end;
  color: #78a85a;
  font-size: 0.68rem;
  font-weight: 900;
`;

const PanelRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;

  @media (max-width: 880px) {
    grid-template-columns: 1fr;
  }
`;

const SpellBoard = styled.div`
  display: grid;
  grid-template-columns: 390px minmax(0, 1fr);
  border: 1px solid rgba(184, 145, 91, 0.42);
  background: #0d1216;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.24);

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const SpellIndex = styled.div`
  border-right: 1px solid rgba(184, 145, 91, 0.24);
  background: #0a0f12;

  @media (max-width: 980px) {
    border-right: 0;
    border-bottom: 1px solid rgba(184, 145, 91, 0.24);
  }
`;

const SpellIndexTop = styled.div`
  padding: 16px;
  border-bottom: 1px solid rgba(184, 145, 91, 0.2);
`;

const SpellIndexTitle = styled.div`
  color: #f4efe5;
  font-size: 1rem;
  font-weight: 900;
`;

const SpellIndexMeta = styled.div`
  margin-top: 4px;
  color: #8d9aa3;
  font-size: 0.74rem;
  font-weight: 800;
`;

const SpellDetail = styled.div`
  padding: 18px;
  background:
    linear-gradient(90deg, rgba(184, 145, 91, 0.04) 1px, transparent 1px),
    linear-gradient(180deg, rgba(184, 145, 91, 0.04) 1px, transparent 1px),
    #10161b;
  background-size: 30px 30px;
`;

const SpellDetailPaper = styled.div`
  min-height: 430px;
  border: 1px solid rgba(184, 145, 91, 0.36);
  background: #11171c;
  color: #f4efe5;
`;

const SpellDetailHeader = styled.div`
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) auto;
  gap: 14px;
  align-items: center;
  padding: 18px;
  border-bottom: 1px solid rgba(184, 145, 91, 0.26);

  @media (max-width: 720px) {
    grid-template-columns: 56px minmax(0, 1fr);
  }
`;

const LargeSpellIcon = styled.img`
  width: 66px;
  height: 66px;
  border: 1px solid rgba(184, 145, 91, 0.42);
  background: #0b1014;

  @media (max-width: 720px) {
    width: 52px;
    height: 52px;
  }
`;

const DetailTitle = styled.h3`
  color: #f4efe5;
  font-size: clamp(1.35rem, 3vw, 2.1rem);
  letter-spacing: 0;
`;

const DetailSub = styled.div`
  margin-top: 3px;
  color: #aeb8bd;
  font-size: 0.8rem;
  font-weight: 900;
`;

const DetailCode = styled.div`
  min-width: 92px;
  padding: 7px 9px;
  border: 1px solid rgba(184, 145, 91, 0.48);
  background: #0b1014;
  color: #b8915b;
  text-align: center;
  font-size: 0.76rem;
  font-weight: 900;

  @media (max-width: 720px) {
    grid-column: 1 / -1;
    justify-self: start;
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 16px;
  padding: 18px;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

const InfoBlocks = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const InfoBlock = styled.div`
  min-height: 78px;
  padding: 10px;
  border: 1px solid rgba(184, 145, 91, 0.24);
  background: #0d1216;
`;

const InfoLabel = styled.div`
  color: #b8915b;
  font-size: 0.68rem;
  font-weight: 900;
`;

const InfoValue = styled.div`
  margin-top: 8px;
  color: #f4efe5;
  font-size: 0.88rem;
  font-weight: 900;
`;

const RouteMap = styled.div`
  margin-top: 14px;
  padding: 14px;
  border: 1px solid rgba(184, 145, 91, 0.24);
  background: #0d1216;
`;

const RouteMapTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #f4efe5;
  font-size: 0.82rem;
  font-weight: 900;
`;

const RouteSteps = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin-top: 12px;

  @media (max-width: 680px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const RouteStep = styled.div`
  min-height: 72px;
  padding: 10px;
  border: 1px solid ${props => (props.$active ? '#78a85a' : 'rgba(184, 145, 91, 0.3)')};
  background: ${props => (props.$active ? 'rgba(120, 168, 90, 0.14)' : '#11171c')};
`;

const StepNumber = styled.div`
  color: ${props => (props.$active ? '#78a85a' : '#b8915b')};
  font-size: 0.68rem;
  font-weight: 900;
`;

const StepLabel = styled.div`
  margin-top: 5px;
  color: #f4efe5;
  font-size: 0.78rem;
  font-weight: 900;
`;

const SourceStack = styled.div`
  border: 1px solid rgba(184, 145, 91, 0.3);
  background: #0b1014;
  color: #f4efe5;
`;

const SourceStackBody = styled.div`
  display: grid;
  gap: 8px;
  padding: 12px;
`;

const SourceBadge = styled.div`
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr);
  gap: 8px;
  min-height: 48px;
  align-items: center;
  padding: 8px;
  border: 1px solid rgba(184, 145, 91, 0.24);
  background: #10161b;
`;

const BadgeTier = styled.div`
  display: grid;
  place-items: center;
  min-height: 28px;
  border: 1px solid rgba(120, 168, 90, 0.54);
  color: #78a85a;
  font-size: 0.72rem;
  font-weight: 900;
`;

const BadgeText = styled.div`
  overflow: hidden;
  color: #d8cbb7;
  font-size: 0.72rem;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const GuideTemplate = styled(CodexFrame)`
  margin-bottom: 18px;
`;

const GuideHeroPanel = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 18px;
  padding: 18px;
  border-bottom: 1px solid rgba(184, 145, 91, 0.24);
  background:
    linear-gradient(90deg, rgba(120, 168, 90, 0.075), rgba(184, 145, 91, 0.045) 52%, rgba(18, 24, 30, 0)),
    #12181e;

  @media (max-width: 940px) {
    grid-template-columns: 1fr;
  }
`;

const GuideEyebrow = styled.div`
  color: #78a85a;
  font-size: 0.72rem;
  font-weight: 900;
`;

const GuideTitle = styled.h2`
  margin-top: 7px;
  color: #f4efe5;
  font-size: clamp(1.8rem, 4vw, 3.3rem);
  line-height: 1.04;
  letter-spacing: 0;
`;

const GuideSummary = styled.p`
  max-width: 860px;
  margin-top: 12px;
  color: #d8cbb7;
  font-size: 0.98rem;
  font-weight: 800;
`;

const GuideMetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
`;

const GuideMetaBox = styled.div`
  min-width: 0;
  min-height: 74px;
  padding: 10px;
  border: 1px solid rgba(184, 145, 91, 0.28);
  background: rgba(8, 11, 13, 0.58);
`;

const GuideMetaLabel = styled.div`
  color: #8d9aa3;
  font-size: 0.66rem;
  font-weight: 900;
`;

const GuideMetaValue = styled.div`
  margin-top: 7px;
  color: #f4efe5;
  font-size: 0.86rem;
  font-weight: 900;
`;

const GuideBodyGrid = styled.div`
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr) 270px;
  min-width: 0;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
  }
`;

const GuideToc = styled.nav`
  padding: 16px;
  border-right: 1px solid rgba(184, 145, 91, 0.22);
  background: #0a0f12;

  @media (max-width: 1180px) {
    border-right: 0;
    border-bottom: 1px solid rgba(184, 145, 91, 0.22);
  }
`;

const GuideTocTitle = styled.div`
  color: #b8915b;
  font-size: 0.72rem;
  font-weight: 900;
`;

const GuideTocList = styled.div`
  display: grid;
  gap: 8px;
  margin-top: 12px;

  @media (max-width: 1180px) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const GuideTocItem = styled.a`
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: 8px;
  align-items: center;
  min-height: 42px;
  padding: 7px;
  border: 1px solid rgba(184, 145, 91, 0.22);
  background: rgba(16, 22, 27, 0.86);
  color: #f4efe5;
  font-size: 0.72rem;
  font-weight: 900;
`;

const GuideTocNum = styled.span`
  display: grid;
  place-items: center;
  min-height: 26px;
  border: 1px solid rgba(120, 168, 90, 0.42);
  color: #78a85a;
  font-size: 0.64rem;
`;

const GuideArticle = styled.div`
  min-width: 0;
  padding: 18px;
  background:
    linear-gradient(90deg, rgba(184, 145, 91, 0.035) 1px, transparent 1px),
    linear-gradient(180deg, rgba(184, 145, 91, 0.035) 1px, transparent 1px),
    #10161b;
  background-size: 30px 30px;
`;

const GuideSectionBlock = styled.section`
  min-width: 0;
  padding: 16px;
  border: 1px solid rgba(184, 145, 91, 0.3);
  background: #0d1216;

  & + & {
    margin-top: 14px;
  }
`;

const GuideSectionHead = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: start;
  margin-bottom: 12px;

  @media (max-width: 620px) {
    display: grid;
  }
`;

const GuideSectionTitle = styled.h3`
  color: #f4efe5;
  font-size: 1.08rem;
  letter-spacing: 0;
`;

const GuideSectionText = styled.p`
  margin-top: 5px;
  color: #c7bba7;
  font-size: 0.82rem;
  font-weight: 800;
`;

const GuideSectionBadge = styled.div`
  flex: 0 0 auto;
  min-height: 28px;
  padding: 6px 8px;
  border: 1px solid rgba(120, 168, 90, 0.42);
  color: #78a85a;
  background: rgba(120, 168, 90, 0.08);
  font-size: 0.66rem;
  font-weight: 900;
`;

const GuideBuildGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

const GuideBuildPanel = styled.div`
  min-width: 0;
  padding: 12px;
  border: 1px solid ${props => (props.$tone === 'green' ? 'rgba(120, 168, 90, 0.5)' : 'rgba(184, 145, 91, 0.36)')};
  background:
    linear-gradient(180deg, ${props => (props.$tone === 'green' ? 'rgba(120, 168, 90, 0.12)' : 'rgba(184, 145, 91, 0.11)')} 0%, rgba(13, 18, 22, 0) 100%),
    #0b1014;
`;

const GuideBuildTitle = styled.div`
  color: #f4efe5;
  font-size: 0.92rem;
  font-weight: 900;
`;

const GuideBuildText = styled.p`
  margin-top: 7px;
  color: #c7bba7;
  font-size: 0.76rem;
  font-weight: 800;
`;

const GuideSkillLine = styled.div`
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  min-height: 54px;
  padding: 8px;
  border: 1px solid rgba(184, 145, 91, 0.22);
  background: #0b1014;
`;

const GuideSkillIcon = styled.img`
  width: 38px;
  height: 38px;
  border: 1px solid rgba(244, 239, 229, 0.16);
  background: #080b0d;
  object-fit: cover;
`;

const GuideSkillName = styled.div`
  color: #f4efe5;
  font-size: 0.82rem;
  font-weight: 900;
`;

const GuideSkillNote = styled.div`
  margin-top: 3px;
  color: #8d9aa3;
  font-size: 0.7rem;
  font-weight: 800;
`;

const GuideAside = styled.aside`
  min-width: 0;
  padding: 16px;
  border-left: 1px solid rgba(184, 145, 91, 0.22);
  background: #0a0f12;

  @media (max-width: 1180px) {
    border-left: 0;
    border-top: 1px solid rgba(184, 145, 91, 0.22);
  }
`;

const GuideAsideStack = styled.div`
  display: grid;
  gap: 10px;
`;

const GuideChecklist = styled.div`
  display: grid;
  gap: 8px;
`;

const GuideCheckRow = styled.div`
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: 8px;
  align-items: center;
  min-height: 42px;
  padding: 7px;
  border: 1px solid rgba(184, 145, 91, 0.22);
  background: #10161b;
  color: #d8cbb7;
  font-size: 0.72rem;
  font-weight: 850;
`;

const ChartLibraryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.article`
  position: relative;
  min-width: 0;
  min-height: 410px;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  border: 1px solid rgba(184, 145, 91, 0.36);
  background:
    linear-gradient(180deg, rgba(244, 239, 229, 0.025) 0%, rgba(13, 18, 22, 0) 48%),
    #0d1216;
  box-shadow:
    inset 0 1px 0 rgba(244, 239, 229, 0.04),
    0 18px 44px rgba(0, 0, 0, 0.22);
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
    background: linear-gradient(90deg, rgba(120, 168, 90, 0.95), rgba(184, 145, 91, 0.85), rgba(244, 239, 229, 0.12));
  }
`;

const ChartCardHead = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  align-items: start;
  padding: 16px;
  border-bottom: 1px solid rgba(184, 145, 91, 0.24);
  background:
    linear-gradient(90deg, rgba(120, 168, 90, 0.045), rgba(184, 145, 91, 0.04) 54%, rgba(18, 24, 30, 0)),
    #12181e;
`;

const ChartTitle = styled.h3`
  color: #f4efe5;
  font-size: 1rem;
  letter-spacing: 0;
`;

const ChartMeta = styled.div`
  margin-top: 4px;
  color: #8d9aa3;
  font-size: 0.72rem;
  font-weight: 800;
`;

const ChartNumber = styled.div`
  display: grid;
  place-items: center;
  min-width: 36px;
  height: 30px;
  border: 1px solid rgba(184, 145, 91, 0.42);
  background: rgba(8, 11, 13, 0.68);
  color: #b8915b;
  font-size: 0.78rem;
  font-weight: 900;
`;

const ChartCanvas = styled.div`
  min-width: 0;
  min-height: 306px;
  padding: 16px;
  background:
    linear-gradient(90deg, rgba(184, 145, 91, 0.035) 1px, transparent 1px),
    linear-gradient(180deg, rgba(184, 145, 91, 0.035) 1px, transparent 1px),
    #10161b;
  background-size: 28px 28px;
`;

const ChartSkillStrip = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin: 10px 0 14px;

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const SkillSlot = styled.div`
  position: relative;
  min-width: 0;
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  gap: 8px;
  align-items: center;
  min-height: 46px;
  padding: 6px;
  border: 1px solid rgba(184, 145, 91, 0.22);
  background:
    linear-gradient(90deg, rgba(120, 168, 90, 0.055), rgba(8, 11, 13, 0) 72%),
    rgba(8, 11, 13, 0.72);
  box-shadow: inset 0 1px 0 rgba(244, 239, 229, 0.035);

  &:before {
    content: '';
    position: absolute;
    left: -1px;
    top: -1px;
    bottom: -1px;
    width: 2px;
    background: rgba(120, 168, 90, 0.72);
  }
`;

const SlotIcon = styled.div`
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(244, 239, 229, 0.18);
  background: #0b1014;
  color: #b8915b;
  font-size: 0.64rem;
  font-weight: 900;
`;

const SlotImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const SlotText = styled.div`
  min-width: 0;
`;

const SlotLabel = styled.div`
  overflow: hidden;
  color: #f4efe5;
  font-size: 0.72rem;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SlotMeta = styled.div`
  overflow: hidden;
  margin-top: 2px;
  color: #8d9aa3;
  font-size: 0.62rem;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ChartFoot = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  padding: 12px 16px;
  border-top: 1px solid rgba(184, 145, 91, 0.2);
  background: rgba(8, 11, 13, 0.36);
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  padding: 0 8px;
  border: 1px solid rgba(184, 145, 91, 0.28);
  color: ${props => props.$tone === 'green' ? '#78a85a' : '#d8cbb7'};
  background: rgba(8, 11, 13, 0.56);
  font-size: 0.68rem;
  font-weight: 900;
`;

const MiniFlow = styled.div`
  display: grid;
  gap: 10px;
`;

const FlowNode = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
  min-height: 56px;
  padding: 9px 10px;
  border: 1px solid ${props => props.$active ? '#78a85a' : 'rgba(184, 145, 91, 0.26)'};
  background:
    linear-gradient(90deg, ${props => props.$active ? 'rgba(120, 168, 90, 0.16)' : 'rgba(184, 145, 91, 0.045)'} 0%, rgba(11, 16, 20, 0) 78%),
    #0b1014;
  box-shadow: inset 0 1px 0 rgba(244, 239, 229, 0.035);

  @media (max-width: 520px) {
    grid-template-columns: 34px minmax(0, 1fr);

    > svg {
      display: none;
    }
  }
`;

const FlowIcon = styled.div`
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid rgba(184, 145, 91, 0.4);
  background: rgba(8, 11, 13, 0.78);
  color: #b8915b;
`;

const FlowLabel = styled.div`
  color: #f4efe5;
  font-size: 0.82rem;
  font-weight: 900;
`;

const FlowSub = styled.div`
  color: #8d9aa3;
  font-size: 0.68rem;
  font-weight: 800;
`;

const FlowRank = styled.div`
  color: #b8915b;
  font-size: 0.62rem;
  font-weight: 900;
`;

const BranchGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const BranchBox = styled.div`
  min-height: 66px;
  padding: 10px;
  border: 1px solid ${props => props.$positive ? 'rgba(120, 168, 90, 0.5)' : 'rgba(184, 145, 91, 0.24)'};
  background:
    linear-gradient(180deg, ${props => props.$positive ? 'rgba(120, 168, 90, 0.13)' : 'rgba(184, 145, 91, 0.075)'} 0%, rgba(11, 16, 20, 0) 100%),
    #0b1014;
`;

const BranchLabel = styled.div`
  color: #b8915b;
  font-size: 0.68rem;
  font-weight: 900;
`;

const BranchText = styled.div`
  margin-top: 5px;
  color: #f4efe5;
  font-size: 0.78rem;
  font-weight: 900;
`;

const Timeline = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(6, minmax(112px, 1fr));
  border: 1px solid rgba(184, 145, 91, 0.28);
  background: #0b1014;
  overflow-x: auto;

  &:before {
    content: '';
    position: absolute;
    left: 22px;
    right: 22px;
    top: 54px;
    height: 3px;
    background: rgba(244, 239, 229, 0.14);
  }

  @media (max-width: 680px) {
    grid-template-columns: repeat(6, minmax(112px, 1fr));
  }

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
    overflow-x: visible;

    &:before {
      left: 23px;
      right: auto;
      top: 22px;
      bottom: 22px;
      width: 3px;
      height: auto;
    }
  }
`;

const TimelineStep = styled.div`
  position: relative;
  z-index: 1;
  min-height: 126px;
  padding: 10px;
  border-right: 1px solid rgba(184, 145, 91, 0.16);
  background:
    linear-gradient(180deg, ${props => props.$type === 'burst' ? 'rgba(184, 145, 91, 0.14)' : props.$type === 'proc' ? 'rgba(120, 168, 90, 0.1)' : 'rgba(8, 11, 13, 0)'} 0%, rgba(11, 16, 20, 0.72) 100%);

  &:last-child {
    border-right: 0;
  }

  @media (max-width: 680px) {
    border-right: 0;
    border-bottom: 1px solid rgba(184, 145, 91, 0.16);
  }
`;

const TimeCode = styled.div`
  color: #78a85a;
  font-size: 0.7rem;
  font-weight: 900;
`;

const TimeSkill = styled.div`
  margin-top: 9px;
  color: #f4efe5;
  font-size: 0.86rem;
  font-weight: 900;
`;

const TimelineIcon = styled.img`
  width: 38px;
  height: 38px;
  margin-top: 12px;
  border: 1px solid rgba(244, 239, 229, 0.18);
  background: #080b0d;
  object-fit: cover;
`;

const TimeType = styled.div`
  display: inline-flex;
  align-items: center;
  min-height: 21px;
  margin-top: 8px;
  padding: 0 6px;
  border: 1px solid rgba(184, 145, 91, 0.28);
  color: ${props => props.$type === 'burst' ? '#f7ddb1' : props.$type === 'proc' ? '#78a85a' : '#8d9aa3'};
  background: rgba(8, 11, 13, 0.56);
  font-size: 0.62rem;
  font-weight: 900;
`;

const LaneChart = styled.div`
  display: grid;
  gap: 10px;
`;

const Lane = styled.div`
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: 10px;
  align-items: center;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
    gap: 5px;
  }
`;

const LaneLabel = styled.div`
  color: #d8cbb7;
  font-size: 0.72rem;
  font-weight: 900;
`;

const LaneTrack = styled.div`
  position: relative;
  height: 34px;
  border: 1px solid rgba(184, 145, 91, 0.22);
  background:
    repeating-linear-gradient(90deg, rgba(244, 239, 229, 0.045) 0 1px, transparent 1px 25%),
    #0b1014;
`;

const LaneBar = styled.div`
  position: absolute;
  top: 6px;
  left: ${props => `${props.$start / 2}%`};
  width: ${props => `${props.$width / 2}%`};
  height: 20px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(244, 239, 229, 0.16);
  background: linear-gradient(90deg, ${props => props.$color}, rgba(244, 239, 229, 0.18));
  box-shadow: 0 0 12px color-mix(in srgb, ${props => props.$color} 32%, transparent);
  color: #080b0d;
  font-size: 0.56rem;
  font-weight: 900;
  opacity: 0.92;
  overflow: hidden;
  white-space: nowrap;
`;

const AxisLabels = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  margin-left: 98px;
  color: #8d9aa3;
  font-size: 0.66rem;
  font-weight: 800;

  @media (max-width: 520px) {
    margin-left: 0;
  }
`;

const ResourceChart = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 112px;
  gap: 14px;
  align-items: center;

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

const CurveSvg = styled.svg`
  width: 100%;
  height: 180px;
  border: 1px solid rgba(184, 145, 91, 0.26);
  background:
    linear-gradient(180deg, rgba(196, 100, 66, 0.08) 0 28%, rgba(11, 16, 20, 0) 28%),
    #0b1014;
`;

const MeterStack = styled.div`
  display: grid;
  gap: 8px;
`;

const MeterBox = styled.div`
  min-height: 54px;
  padding: 9px;
  border: 1px solid rgba(184, 145, 91, 0.24);
  background:
    linear-gradient(90deg, rgba(120, 168, 90, 0.08), rgba(11, 16, 20, 0)),
    #0b1014;
`;

const MeterLabel = styled.div`
  color: #8d9aa3;
  font-size: 0.66rem;
  font-weight: 900;
`;

const MeterValue = styled.div`
  margin-top: 4px;
  color: #f4efe5;
  font-size: 1rem;
  font-weight: 900;
`;

const Matrix = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  border: 1px solid rgba(184, 145, 91, 0.28);

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

const MatrixCell = styled.div`
  min-height: 72px;
  padding: 10px;
  border-right: 1px solid rgba(184, 145, 91, 0.16);
  border-bottom: 1px solid rgba(184, 145, 91, 0.16);
  background:
    linear-gradient(180deg, rgba(244, 239, 229, 0.025), rgba(11, 16, 20, 0)),
    #0b1014;

  &:nth-child(3n) {
    border-right: 0;
  }

  @media (max-width: 680px) {
    border-right: 0;
  }
`;

const MatrixHead = styled(MatrixCell)`
  min-height: 38px;
  color: #b8915b;
  font-size: 0.72rem;
  font-weight: 900;
  background: #141b20;
`;

const MatrixText = styled.div`
  color: #f4efe5;
  font-size: 0.78rem;
  font-weight: 900;
`;

const MatrixSub = styled.div`
  margin-top: 4px;
  color: #8d9aa3;
  font-size: 0.68rem;
  font-weight: 800;
`;

const MatrixBadge = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 21px;
  margin-bottom: 7px;
  padding: 0 6px;
  border: 1px solid rgba(120, 168, 90, 0.34);
  color: #78a85a;
  background: rgba(120, 168, 90, 0.08);
  font-size: 0.6rem;
  font-weight: 900;
`;

const PathMap = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  align-items: center;

  &:before {
    content: '';
    position: absolute;
    left: 8%;
    right: 8%;
    top: 50%;
    height: 2px;
    background: rgba(184, 145, 91, 0.28);
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;

    &:before {
      display: none;
    }
  }
`;

const PathNode = styled.div`
  position: relative;
  z-index: 1;
  min-height: 76px;
  display: grid;
  align-content: center;
  gap: 4px;
  padding: 10px;
  border: 1px solid ${props => props.$active ? '#78a85a' : 'rgba(184, 145, 91, 0.28)'};
  background: ${props => props.$active ? 'rgba(120, 168, 90, 0.12)' : '#0b1014'};
  color: #f4efe5;
  text-align: center;
  font-size: 0.76rem;
  font-weight: 900;
`;

const PathStepNumber = styled.div`
  color: ${props => props.$active ? '#78a85a' : '#b8915b'};
  font-size: 0.62rem;
  font-weight: 900;
`;

const PathStepLabel = styled.div`
  color: #f4efe5;
`;

const BarChart = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  align-items: end;
  height: 220px;
  padding: 12px;
  border: 1px solid rgba(184, 145, 91, 0.26);
  background:
    linear-gradient(180deg, rgba(244, 239, 229, 0.045) 1px, transparent 1px),
    #0b1014;
  background-size: 100% 25%;

  @media (max-width: 520px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    height: auto;
    min-height: 220px;
  }
`;

const TargetBar = styled.div`
  display: grid;
  align-content: end;
  gap: 7px;
  height: 100%;
`;

const BarFill = styled.div`
  min-height: 24px;
  height: ${props => `${props.$value}%`};
  border: 1px solid rgba(244, 239, 229, 0.14);
  background: ${props => props.$peak ? 'linear-gradient(180deg, #f7ddb1 0%, #78a85a 52%, #b8915b 100%)' : 'linear-gradient(180deg, #78a85a 0%, #b8915b 100%)'};
  box-shadow: ${props => props.$peak ? '0 0 18px rgba(120, 168, 90, 0.28)' : 'none'};
`;

const BarValue = styled.div`
  color: #f4efe5;
  text-align: center;
  font-size: 0.7rem;
  font-weight: 900;
`;

const BarLabel = styled.div`
  color: #d8cbb7;
  text-align: center;
  font-size: 0.72rem;
  font-weight: 900;
`;

const UptimeChart = styled.div`
  display: grid;
  gap: 10px;
`;

const UptimeLane = styled.div`
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: 10px;
  align-items: center;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
    gap: 5px;
  }
`;

const SegmentTrack = styled.div`
  position: relative;
  height: 34px;
  border: 1px solid rgba(184, 145, 91, 0.22);
  background:
    repeating-linear-gradient(90deg, rgba(244, 239, 229, 0.045) 0 1px, transparent 1px 25%),
    #0b1014;
`;

const Segment = styled.div`
  position: absolute;
  top: 6px;
  left: ${props => `${props.$start}%`};
  width: ${props => `${props.$width}%`};
  height: 20px;
  border: 1px solid rgba(244, 239, 229, 0.12);
  background: ${props => props.$color};
`;

const DefensiveList = styled.div`
  display: grid;
  gap: 8px;
`;

const DefensiveRow = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 54px minmax(0, 1fr) 128px;
  gap: 10px;
  align-items: center;
  min-height: 50px;
  padding: 8px 10px;
  border: 1px solid rgba(184, 145, 91, 0.24);
  background:
    linear-gradient(90deg, rgba(196, 100, 66, ${props => props.$danger || 0.08}) 0%, rgba(11, 16, 20, 0) 72%),
    #0b1014;

  &:before {
    content: '';
    position: absolute;
    left: -1px;
    top: -1px;
    bottom: -1px;
    width: 3px;
    background: rgba(196, 100, 66, ${props => Math.min(0.95, 0.32 + (props.$danger || 0.08))});
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

const EventTime = styled.div`
  color: #78a85a;
  font-size: 0.72rem;
  font-weight: 900;
`;

const EventName = styled.div`
  color: #f4efe5;
  font-size: 0.8rem;
  font-weight: 900;
`;

const EventAction = styled.div`
  color: #b8915b;
  font-size: 0.72rem;
  font-weight: 900;
  text-align: right;

  @media (max-width: 620px) {
    text-align: left;
  }
`;

const NetworkMap = styled.div`
  position: relative;
  min-height: 230px;
  border: 1px solid rgba(184, 145, 91, 0.26);
  background: #0b1014;

  @media (max-width: 560px) {
    min-height: auto;
    display: grid;
    gap: 8px;
    padding: 10px;
  }
`;

const NetworkLine = styled.div`
  position: absolute;
  left: ${props => props.$left};
  top: ${props => props.$top};
  width: ${props => props.$width};
  height: 1px;
  background: linear-gradient(90deg, rgba(184, 145, 91, 0), rgba(120, 168, 90, 0.68), rgba(184, 145, 91, 0));
  box-shadow: 0 0 10px rgba(120, 168, 90, 0.2);
  transform: rotate(${props => props.$rotate || '0deg'});
  transform-origin: left center;

  @media (max-width: 560px) {
    display: none;
  }
`;

const NetworkNode = styled.div`
  position: absolute;
  left: ${props => props.$left};
  top: ${props => props.$top};
  transform: translateX(-50%);
  width: 112px;
  min-height: 46px;
  display: grid;
  place-items: center;
  padding: 8px;
  border: 1px solid ${props => props.$active ? '#78a85a' : 'rgba(184, 145, 91, 0.32)'};
  background:
    linear-gradient(180deg, ${props => props.$active ? 'rgba(120, 168, 90, 0.16)' : 'rgba(184, 145, 91, 0.055)'} 0%, rgba(17, 23, 28, 0) 100%),
    #11171c;
  color: #f4efe5;
  text-align: center;
  font-size: 0.72rem;
  font-weight: 900;

  @media (max-width: 560px) {
    position: static;
    transform: none;
    width: 100%;
    min-height: 44px;
  }
`;

const RotationFeature = styled(CodexFrame)`
  scroll-margin-top: 84px;
  margin-bottom: 18px;
`;

const RotationHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 18px;
  padding: 18px;
  border-bottom: 1px solid rgba(184, 145, 91, 0.24);
  background: #12181e;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const RotationTitle = styled.h3`
  color: #f4efe5;
  font-size: clamp(1.35rem, 2.2vw, 2rem);
  letter-spacing: 0;
`;

const RotationLead = styled.p`
  max-width: 860px;
  margin-top: 8px;
  color: #c7bba7;
  font-size: 0.92rem;
  font-weight: 800;
`;

const RotationAccent = styled.span`
  color: #b56cff;
  font-weight: 900;
`;

const RotationStatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const RotationStat = styled.div`
  min-height: 58px;
  padding: 10px;
  border: 1px solid rgba(184, 145, 91, 0.24);
  background: #0b1014;
`;

const RotationStatLabel = styled.div`
  color: #8d9aa3;
  font-size: 0.66rem;
  font-weight: 900;
`;

const RotationStatValue = styled.div`
  margin-top: 5px;
  color: #f4efe5;
  font-size: 0.98rem;
  font-weight: 900;
`;

const RotationBody = styled.div`
  padding: 18px;
  background:
    linear-gradient(90deg, rgba(184, 145, 91, 0.035) 1px, transparent 1px),
    linear-gradient(180deg, rgba(184, 145, 91, 0.035) 1px, transparent 1px),
    #10161b;
  background-size: 30px 30px;
`;

const RotationRail = styled.div`
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 76px 18px 24px;
  border: 1px solid rgba(184, 145, 91, 0.28);
  background: #0b1014;
  scrollbar-width: thin;
  scrollbar-color: rgba(184, 145, 91, 0.72) rgba(244, 239, 229, 0.08);

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(244, 239, 229, 0.08);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(184, 145, 91, 0.72);
  }

  @media (max-width: 560px) {
    overflow-x: visible;
    padding: 14px;
  }
`;

const RotationTrack = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: clamp(14px, 2.2vw, 24px);
  min-width: max-content;
  padding: 0 4px;

  &:before {
    content: '';
    position: absolute;
    z-index: 0;
    left: 28px;
    right: 28px;
    top: 23px;
    height: 5px;
    border-radius: 999px;
    background: rgba(244, 239, 229, 0.16);
  }

  @media (max-width: 560px) {
    display: grid;
    gap: 12px;
    min-width: 0;
    padding: 0;

    &:before {
      left: 33px;
      right: auto;
      top: 28px;
      bottom: 28px;
      width: 4px;
      height: auto;
    }
  }
`;

const RotationStep = styled.div`
  position: relative;
  z-index: 1;
  flex: 0 0 92px;
  display: grid;
  justify-items: center;
  gap: 8px;
  text-align: center;

  @media (max-width: 560px) {
    flex: none;
    width: 100%;
    grid-template-columns: 48px minmax(0, 1fr);
    justify-items: start;
    text-align: left;
    align-items: center;
    min-height: 68px;
  }
`;

const RotationIconWrap = styled.div`
  position: relative;
  width: 48px;
  height: 48px;
`;

const RotationIcon = styled.img`
  width: 48px;
  height: 48px;
  border: 1px solid rgba(244, 239, 229, 0.18);
  background: #080b0d;
  object-fit: cover;
`;

const RotationStack = styled.div`
  position: absolute;
  left: 50%;
  bottom: 54px;
  display: grid;
  gap: 3px;
  transform: translateX(-50%);

  @media (max-width: 560px) {
    left: 54px;
    bottom: auto;
    top: 0;
    display: flex;
    transform: none;
  }
`;

const StackIcon = styled.img`
  width: 28px;
  height: 28px;
  border: 1px solid rgba(184, 145, 91, 0.42);
  background: #080b0d;
  object-fit: cover;
`;

const RotationStepText = styled.div`
  min-width: 0;
`;

const RotationStepLabel = styled.div`
  color: #f4efe5;
  font-size: 0.78rem;
  font-weight: 900;
`;

const RotationStepNote = styled.div`
  margin-top: 3px;
  color: #8d9aa3;
  font-size: 0.66rem;
  font-weight: 800;
`;

const RotationCaption = styled.div`
  display: flex;
  justify-content: center;
  gap: 4px;
  margin: 14px 0 0;
  color: #d8cbb7;
  font-size: 0.84rem;
  font-weight: 900;
  text-align: center;
`;

const RotationLower = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 310px;
  gap: 16px;
  margin-top: 16px;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

const PriorityListPanel = styled.div`
  border: 1px solid rgba(184, 145, 91, 0.3);
  background: #0d1216;
`;

const priorityGlow = rank => Math.max(0.05, 0.22 - rank * 0.035);
const priorityLine = rank => Math.max(0.18, 0.78 - rank * 0.11);

const PriorityListRow = styled.div`
  display: grid;
  grid-template-columns: 4px 34px minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  min-height: 48px;
  padding: 8px 12px;
  border-bottom: 1px solid rgba(244, 239, 229, 0.07);
  background:
    linear-gradient(
      90deg,
      rgba(120, 168, 90, ${props => priorityGlow(props.$rank)}) 0%,
      rgba(184, 145, 91, ${props => Math.max(0.03, priorityGlow(props.$rank) - 0.07)}) 46%,
      rgba(13, 18, 22, 0) 100%
    );

  &:before {
    content: '';
    width: 4px;
    height: 100%;
    min-height: 30px;
    border-radius: 999px;
    background:
      linear-gradient(
        180deg,
        rgba(120, 168, 90, ${props => priorityLine(props.$rank)}) 0%,
        rgba(184, 145, 91, ${props => Math.max(0.12, priorityLine(props.$rank) - 0.22)}) 100%
      );
    box-shadow: 0 0 ${props => Math.max(2, 12 - props.$rank * 2)}px rgba(120, 168, 90, ${props => Math.max(0, 0.25 - props.$rank * 0.04)});
  }

  &:last-child {
    border-bottom: 0;
  }
`;

const PriorityInlineIcon = styled.img`
  width: 30px;
  height: 30px;
  border: 1px solid rgba(184, 145, 91, 0.34);
  background: #080b0d;
  object-fit: cover;
`;

const PriorityListText = styled.div`
  color: #f4efe5;
  font-size: 0.82rem;
  font-weight: 850;
`;

const RotationSidePanel = styled.div`
  border: 1px solid rgba(184, 145, 91, 0.3);
  background: #0d1216;
`;

const RotationSideBody = styled.div`
  display: grid;
  gap: 8px;
  padding: 12px;
`;

function SectionNotes() {
  return (
    <Notes>
      <Note>
        <Check size={15} />
        로고의 W, 가이드북, 경로 노드를 패널 모서리와 표 구조에 반복
      </Note>
      <Note>
        <Check size={15} />
        차콜 배경 안에서 그래파이트 패널을 단계별로 쌓는 구조
      </Note>
      <Note>
        <Check size={15} />
        브라스는 정보 경계, 펠그린은 진행/최적 경로에만 사용
      </Note>
    </Notes>
  );
}

function ChartSkillSlots({ number }) {
  const iconSet = chartIconSets[Math.max(0, Number(number) - 1)] || [];

  return (
    <ChartSkillStrip aria-label={`${number}번 차트 스킬 아이콘 슬롯`}>
      {iconSet.map((skill, index) => (
        <SkillSlot key={skill?.id || `empty-${number}-${index}`}>
          <SlotIcon>
            {skill ? (
              <SlotImage src={skill.iconUrl} alt="" loading="lazy" />
            ) : (
              `S${index + 1}`
            )}
          </SlotIcon>
          <SlotText>
            <SlotLabel>{skill?.koreanName || `스킬 슬롯 ${index + 1}`}</SlotLabel>
            <SlotMeta>{skill ? `${skill.class || '공용'} / ${skill.spec || '공용'}` : '아이콘 연결 위치'}</SlotMeta>
          </SlotText>
        </SkillSlot>
      ))}
    </ChartSkillStrip>
  );
}

function getRotationSkill(index) {
  return skillRows.length ? skillRows[index % skillRows.length] : null;
}

function RotationRailMockup() {
  return (
    <RotationFeature id="rotation">
      <FrameTop>
        <FrameName>
          <Swords size={16} />
          combat flow component
        </FrameName>
        <FrameMeta>responsive / icon-first</FrameMeta>
      </FrameTop>

      <RotationHeader>
        <div>
          <RotationTitle>오프닝 전투 흐름 차트</RotationTitle>
          <RotationLead>
            오프닝은 스킬 목록이 아니라 전투 시작부터 첫 핵심 구간까지 이어지는 판단 흐름입니다.
            <RotationAccent> 전문화명</RotationAccent>과 핵심 스킬명만 갈아끼우면 딜러의 오프닝, 탱커의 진입/방어, 힐러의 첫 피해 대응에 모두 재사용할 수 있습니다.
          </RotationLead>
        </div>
        <RotationStatGrid>
          <RotationStat>
            <RotationStatLabel>사용 위치</RotationStatLabel>
            <RotationStatValue>오프닝 / 진입 / 첫 피해</RotationStatValue>
          </RotationStat>
          <RotationStat>
            <RotationStatLabel>반응형</RotationStatLabel>
            <RotationStatValue>가로 → 세로</RotationStatValue>
          </RotationStat>
        </RotationStatGrid>
      </RotationHeader>

      <RotationBody>
        <RotationRail>
          <RotationTrack>
            {rotationRailSteps.map((step, index) => {
              const skill = getRotationSkill(step.icon);
              return (
                <RotationStep key={`${step.label}-${index}`}>
                  <RotationIconWrap>
                    {step.stack && (
                      <RotationStack>
                        {step.stack.map(stackIndex => {
                          const stackSkill = getRotationSkill(stackIndex);
                          return stackSkill ? (
                            <StackIcon key={stackSkill.id} src={stackSkill.iconUrl} alt="" loading="lazy" />
                          ) : null;
                        })}
                      </RotationStack>
                    )}
                    {skill ? (
                      <RotationIcon src={skill.iconUrl} alt="" loading="lazy" />
                    ) : (
                      <SlotIcon>S{index + 1}</SlotIcon>
                    )}
                  </RotationIconWrap>
                  <RotationStepText>
                    <RotationStepLabel>{step.label}</RotationStepLabel>
                    <RotationStepNote>{step.note}</RotationStepNote>
                  </RotationStepText>
                </RotationStep>
              );
            })}
          </RotationTrack>
        </RotationRail>

        <RotationCaption>
          <RotationAccent>예시 전문화</RotationAccent>
          <span>단일 대상 오프닝 및 유지 전투 흐름</span>
        </RotationCaption>

        <RotationLower>
          <PriorityListPanel>
            <TableTitle>
              <GitBranch size={15} />
              우선순위 리스트
            </TableTitle>
            {rotationPriorityRows.map((row, index) => {
              const skill = getRotationSkill(row.icon);
              return (
                <PriorityListRow key={row.text} $rank={index}>
                  {skill ? (
                    <PriorityInlineIcon src={skill.iconUrl} alt="" loading="lazy" />
                  ) : (
                    <SlotIcon>S{index + 1}</SlotIcon>
                  )}
                  <PriorityListText>{row.text}</PriorityListText>
                </PriorityListRow>
              );
            })}
          </PriorityListPanel>

          <RotationSidePanel>
            <TableTitle>
              <ShieldCheck size={15} />
              컴포넌트 규칙
            </TableTitle>
            <RotationSideBody>
              <SourceBadge>
                <BadgeTier>01</BadgeTier>
                <BadgeText>아이콘은 Wowhead CDN URL을 그대로 연결</BadgeText>
              </SourceBadge>
              <SourceBadge>
                <BadgeTier>02</BadgeTier>
                <BadgeText>반복, 조건, 자원 기준은 짧은 라벨로 고정</BadgeText>
              </SourceBadge>
              <SourceBadge>
                <BadgeTier>03</BadgeTier>
                <BadgeText>모바일에서는 흐름 차트가 세로 순서로 접힘</BadgeText>
              </SourceBadge>
            </RotationSideBody>
          </RotationSidePanel>
        </RotationLower>
      </RotationBody>
    </RotationFeature>
  );
}

function ChartShell({ number, title, meta, icon: Icon, tags, children }) {
  return (
    <ChartCard>
      <ChartCardHead>
        <div>
          <ChartTitle>{title}</ChartTitle>
          <ChartMeta>{meta}</ChartMeta>
        </div>
        <ChartNumber>{number}</ChartNumber>
      </ChartCardHead>
      <ChartCanvas>
        <TableTitle>
          <Icon size={15} />
          {title}
        </TableTitle>
        <ChartSkillSlots number={number} />
        {children}
      </ChartCanvas>
      <ChartFoot>
        {tags.map((tag, index) => (
          <Chip key={tag} $tone={index === 0 ? 'green' : undefined}>{tag}</Chip>
        ))}
      </ChartFoot>
    </ChartCard>
  );
}

function PriorityFlowChart() {
  const flowItems = [
    { rank: '01', icon: Zap, label: '발동 버프 확인', sub: '짧은 지속시간 버프부터 먼저 판정', active: true },
    { rank: '02', icon: Gauge, label: '자원 초과 방지', sub: '상한에 닿기 전 소비기 우선' },
    { rank: '03', icon: Target, label: '타겟 수 재판정', sub: '단일, 2타겟, 광역 우선순위 분기' },
  ];

  return (
    <MiniFlow>
      {flowItems.slice(0, 1).map(item => {
        const Icon = item.icon;
        return (
          <FlowNode key={item.rank} $active={item.active}>
            <FlowIcon><Icon size={15} /></FlowIcon>
            <div>
              <FlowRank>{item.rank}</FlowRank>
              <FlowLabel>{item.label}</FlowLabel>
              <FlowSub>{item.sub}</FlowSub>
            </div>
            <ArrowRight size={15} />
          </FlowNode>
        );
      })}
      <BranchGrid>
        <BranchBox $positive>
          <BranchLabel>YES</BranchLabel>
          <BranchText>강화 소비기 즉시 사용</BranchText>
        </BranchBox>
        <BranchBox>
          <BranchLabel>NO</BranchLabel>
          <BranchText>자원 생성기로 복귀</BranchText>
        </BranchBox>
      </BranchGrid>
      {flowItems.slice(1).map((item, index) => {
        const Icon = item.icon;
        return (
          <FlowNode key={item.rank} $active={item.active}>
            <FlowIcon><Icon size={15} /></FlowIcon>
            <div>
              <FlowRank>{item.rank}</FlowRank>
              <FlowLabel>{item.label}</FlowLabel>
              <FlowSub>{item.sub}</FlowSub>
            </div>
            {index < flowItems.length - 2 && <ArrowRight size={15} />}
          </FlowNode>
        );
      })}
    </MiniFlow>
  );
}

function OpenerTimelineChart() {
  return (
    <Timeline>
      {openerSteps.map((step, index) => {
        const skill = getRotationSkill(index + 1);
        return (
          <TimelineStep key={step[0]} $type={step[2]}>
            <TimeCode>{step[0]}s</TimeCode>
            {skill && <TimelineIcon src={skill.iconUrl} alt="" loading="lazy" />}
            <TimeSkill>{step[1]}</TimeSkill>
            <TimeType $type={step[2]}>{step[2] === 'burst' ? '극딜 구간' : step[2] === 'proc' ? '발동 확인' : '정렬 단계'}</TimeType>
          </TimelineStep>
        );
      })}
    </Timeline>
  );
}

function CooldownAlignmentChart() {
  return (
    <LaneChart>
      {cooldownLanes.map(lane => (
        <Lane key={lane.label}>
          <LaneLabel>{lane.label}</LaneLabel>
          <LaneTrack>
            {lane.bars.map(bar => (
              <LaneBar key={`${lane.label}-${bar[0]}`} $start={bar[0]} $width={bar[1]} $color={lane.color}>
                {bar[1] >= 18 ? lane.label : ''}
              </LaneBar>
            ))}
          </LaneTrack>
        </Lane>
      ))}
      <AxisLabels>
        <span>0s</span>
        <span>60s</span>
        <span>120s</span>
        <span>180s</span>
        <span>240s</span>
      </AxisLabels>
    </LaneChart>
  );
}

function ResourceCurveChart() {
  return (
    <ResourceChart>
      <CurveSvg viewBox="0 0 420 180" role="img" aria-label="자원 흐름 곡선">
        <path d="M34 20 V148 H394" fill="none" stroke="rgba(184,145,91,.42)" strokeWidth="1" />
        <path d="M34 44 H394" fill="none" stroke="rgba(196,100,66,.5)" strokeWidth="1" strokeDasharray="5 5" />
        <text x="42" y="38" fill="#c96442" fontSize="11" fontWeight="800">낭비 위험</text>
        <path d="M34 112 H394" fill="none" stroke="rgba(120,168,90,.22)" strokeWidth="1" strokeDasharray="4 7" />
        <path d="M42 128 C88 102 96 56 138 76 C178 96 196 144 236 112 C278 78 294 36 332 58 C360 72 374 100 394 84" fill="none" stroke="#78a85a" strokeWidth="4" />
        <path d="M42 128 C88 102 96 56 138 76 C178 96 196 144 236 112 C278 78 294 36 332 58 C360 72 374 100 394 84" fill="none" stroke="rgba(244,239,229,.34)" strokeWidth="1" />
        {[42, 138, 236, 332, 394].map((x, index) => (
          <circle key={x} cx={x} cy={[128, 76, 112, 58, 84][index]} r="5" fill={index === 3 ? '#b8915b' : '#78a85a'} />
        ))}
        <text x="330" y="78" fill="#f4efe5" fontSize="11" fontWeight="900">소비 타이밍</text>
      </CurveSvg>
      <MeterStack>
        <MeterBox>
          <MeterLabel>평균 자원</MeterLabel>
          <MeterValue>62</MeterValue>
        </MeterBox>
        <MeterBox>
          <MeterLabel>낭비 위험</MeterLabel>
          <MeterValue>2회</MeterValue>
        </MeterBox>
        <MeterBox>
          <MeterLabel>소비 타이밍</MeterLabel>
          <MeterValue>극딜 전</MeterValue>
        </MeterBox>
      </MeterStack>
    </ResourceChart>
  );
}

function ProcMatrixChart() {
  return (
    <Matrix>
      <MatrixHead>상황</MatrixHead>
      <MatrixHead>위험</MatrixHead>
      <MatrixHead>대응</MatrixHead>
      {procRows.flatMap(row => row.map((cell, index) => (
        <MatrixCell key={`${row[0]}-${cell}`}>
          <MatrixBadge>{index === 0 ? 'TRIGGER' : index === 1 ? 'RISK' : 'ACTION'}</MatrixBadge>
          <MatrixText>{cell}</MatrixText>
          <MatrixSub>{index === 2 ? '즉시 판단' : '조건 확인'}</MatrixSub>
        </MatrixCell>
      )))}
    </Matrix>
  );
}

function HeroTalentPathChart() {
  const pathSteps = [
    ['01', '핵심 노드', true],
    ['02', '단일 강화', false],
    ['03', '공용 시너지', true],
    ['04', '광역 분기', false],
    ['05', '최종 선택', false],
  ];

  return (
    <PathMap>
      {pathSteps.map(step => (
        <PathNode key={step[0]} $active={step[2]}>
          <PathStepNumber $active={step[2]}>{step[0]}</PathStepNumber>
          <PathStepLabel>{step[1]}</PathStepLabel>
        </PathNode>
      ))}
    </PathMap>
  );
}

function TargetScalingChart() {
  const peak = Math.max(...targetBars.map(([, value]) => value));

  return (
    <BarChart>
      {targetBars.map(([label, value]) => (
        <TargetBar key={label}>
          <BarValue>{value}</BarValue>
          <BarFill $value={value} $peak={value === peak} />
          <BarLabel>{label}타겟</BarLabel>
        </TargetBar>
      ))}
    </BarChart>
  );
}

function UptimeTimelineChart() {
  const lanes = [
    { label: '핵심 버프', segments: [[0, 34, '#78a85a'], [50, 28, '#78a85a']] },
    { label: '도트 유지', segments: [[6, 42, '#b8915b'], [56, 38, '#b8915b']] },
    { label: '극딜 구간', segments: [[12, 22, '#c96442'], [72, 20, '#c96442']] },
    { label: '이동 구간', segments: [[38, 12, '#aeb8bd'], [92, 8, '#aeb8bd']] },
  ];

  return (
    <UptimeChart>
      {lanes.map(lane => (
        <UptimeLane key={lane.label}>
          <LaneLabel>{lane.label}</LaneLabel>
          <SegmentTrack>
            {lane.segments.map(segment => (
              <Segment key={`${lane.label}-${segment[0]}`} $start={segment[0]} $width={segment[1]} $color={segment[2]} />
            ))}
          </SegmentTrack>
        </UptimeLane>
      ))}
      <AxisLabels>
        <span>0s</span>
        <span>30s</span>
        <span>60s</span>
        <span>90s</span>
        <span>120s</span>
      </AxisLabels>
    </UptimeChart>
  );
}

function DefensivePlannerChart() {
  return (
    <DefensiveList>
      {defensiveRows.map((row, index) => (
        <DefensiveRow key={row[0]} $danger={[0.18, 0.28, 0.42, 0.36][index]}>
          <EventTime>{row[0]}</EventTime>
          <EventName>{row[1]}</EventName>
          <EventAction>{row[2]}</EventAction>
        </DefensiveRow>
      ))}
    </DefensiveList>
  );
}

function SynergyNetworkChart() {
  return (
    <NetworkMap>
      <NetworkLine $left="22%" $top="36%" $width="28%" $rotate="12deg" />
      <NetworkLine $left="48%" $top="45%" $width="28%" $rotate="-18deg" />
      <NetworkLine $left="32%" $top="68%" $width="36%" $rotate="-8deg" />
      <NetworkLine $left="48%" $top="34%" $width="1px" $rotate="90deg" />
      <NetworkNode $left="18%" $top="22%">핵심 스킬</NetworkNode>
      <NetworkNode $left="50%" $top="31%" $active>영웅 특성</NetworkNode>
      <NetworkNode $left="82%" $top="18%">발동 효과</NetworkNode>
      <NetworkNode $left="36%" $top="66%">세트 효과</NetworkNode>
      <NetworkNode $left="68%" $top="66%">장신구</NetworkNode>
    </NetworkMap>
  );
}

function ChartLibraryMockups() {
  return (
    <ChartLibraryGrid>
      <ChartShell number="01" title="우선순위 분기 플로우" meta="발동 대응이 많은 딜러 전문화용" icon={GitBranch} tags={['딜사이클', '발동', '조건부']}>
        <PriorityFlowChart />
      </ChartShell>
      <ChartShell number="02" title="오프닝 선형 타임라인" meta="전투 시작 10초 안의 입력 순서 정리" icon={Clock3} tags={['오프닝', '레이드', '초 단위']}>
        <OpenerTimelineChart />
      </ChartShell>
      <ChartShell number="03" title="쿨기 정렬 레인 차트" meta="2분, 90초, 장신구, 블러드 정렬 확인" icon={Activity} tags={['극딜', '쿨기', '타임라인']}>
        <CooldownAlignmentChart />
      </ChartShell>
      <ChartShell number="04" title="자원 흐름 곡선" meta="분노, 기력, 마나, 광기처럼 낭비 관리가 중요한 전문화용" icon={Gauge} tags={['자원', '낭비 방지', '곡선']}>
        <ResourceCurveChart />
      </ChartShell>
      <ChartShell number="05" title="발동 반응 매트릭스" meta="발동 효과 충돌, 버프 우선순위, 자원 초과를 한 표로 정리" icon={Zap} tags={['발동', '즉시 판단', '표']}>
        <ProcMatrixChart />
      </ChartShell>
      <ChartShell number="06" title="영웅 특성 경로 맵" meta="영웅 특성 선택 이유와 분기 지점을 시각화" icon={Map} tags={['영웅 특성', '선택 경로', '빌드']}>
        <HeroTalentPathChart />
      </ChartShell>
      <ChartShell number="07" title="타겟 수 스케일링 바 차트" meta="단일, 2타겟, 광역에서 가치가 바뀌는 스킬 설명용" icon={Target} tags={['타겟 수', '광역', '스케일링']}>
        <TargetScalingChart />
      </ChartShell>
      <ChartShell number="08" title="버프/도트 유지율 타임라인" meta="유지율이 성능을 좌우하는 딜러, 힐러, 탱커 전문화용" icon={Activity} tags={['유지율', '도트', '버프']}>
        <UptimeTimelineChart />
      </ChartShell>
      <ChartShell number="09" title="생존기/유틸 대응 플래너" meta="탱커, 힐러, 레이드 공략 가이드에 쓰는 위험 구간 계획표" icon={Shield} tags={['생존기', '유틸', '레이드']}>
        <DefensivePlannerChart />
      </ChartShell>
      <ChartShell number="10" title="스킬 시너지 네트워크" meta="특성, 세트, 장신구, 발동 효과 연결을 설명할 때 사용" icon={Network} tags={['시너지', '상호작용', 'KB 링크']}>
        <SynergyNetworkChart />
      </ChartShell>
    </ChartLibraryGrid>
  );
}

function GuideCyclePreview() {
  return (
    <RotationRail>
      <RotationTrack>
        {rotationRailSteps.slice(0, 7).map((step, index) => {
          const skill = getRotationSkill(step.icon);
          return (
            <RotationStep key={`guide-cycle-${step.label}-${index}`}>
              <RotationIconWrap>
                {skill ? (
                  <RotationIcon src={skill.iconUrl} alt="" loading="lazy" />
                ) : (
                  <SlotIcon>S{index + 1}</SlotIcon>
                )}
              </RotationIconWrap>
              <RotationStepText>
                <RotationStepLabel>{step.label}</RotationStepLabel>
                <RotationStepNote>{step.note}</RotationStepNote>
              </RotationStepText>
            </RotationStep>
          );
        })}
      </RotationTrack>
    </RotationRail>
  );
}

function GuideTemplateMockup() {
  const keySkills = [getRotationSkill(5), getRotationSkill(4), getRotationSkill(8)].filter(Boolean);

  return (
    <GuideTemplate>
      <FrameTop>
        <FrameName>
          <FileText size={16} />
          specialization guide template
        </FrameName>
        <FrameMeta>article layout / KB driven</FrameMeta>
      </FrameTop>

      <GuideHeroPanel>
        <div>
          <GuideEyebrow>12.0.5 전문화 가이드 양식</GuideEyebrow>
          <GuideTitle>파멸 악마사냥꾼 가이드</GuideTitle>
          <GuideSummary>
            모든 전문화 가이드는 첫 화면에서 결론을 먼저 보여주고, 아래로 내려가며 특성 선택 이유,
            딜사이클, 스킬 해설, 출처 검증을 순서대로 읽게 만드는 가이드형 구조를 기본으로 합니다.
          </GuideSummary>
        </div>
        <GuideMetaGrid>
          {guideTemplateStats.map(row => (
            <GuideMetaBox key={row[0]}>
              <GuideMetaLabel>{row[0]}</GuideMetaLabel>
              <GuideMetaValue>{row[1]}</GuideMetaValue>
            </GuideMetaBox>
          ))}
        </GuideMetaGrid>
      </GuideHeroPanel>

      <GuideBodyGrid>
        <GuideToc aria-label="가이드 목차">
          <GuideTocTitle>가이드 목차</GuideTocTitle>
          <GuideTocList>
            {guideTemplateChapters.map(chapter => (
              <GuideTocItem key={chapter[0]} href={`#guide-${chapter[0]}`}>
                <GuideTocNum>{chapter[0]}</GuideTocNum>
                <span>{chapter[1]}</span>
              </GuideTocItem>
            ))}
          </GuideTocList>
        </GuideToc>

        <GuideArticle>
          <GuideSectionBlock id="guide-01">
            <GuideSectionHead>
              <div>
                <GuideSectionTitle>핵심 요약</GuideSectionTitle>
                <GuideSectionText>
                  사용자는 먼저 지금 이 전문화를 왜 골라야 하는지, 어떤 상황에서 강한지, 무엇을 조심해야 하는지 확인합니다.
                </GuideSectionText>
              </div>
              <GuideSectionBadge>first viewport</GuideSectionBadge>
            </GuideSectionHead>
            <GuideBuildGrid>
              {guideTemplateBuilds.map(build => (
                <GuideBuildPanel key={build.label} $tone={build.tone}>
                  <GuideBuildTitle>{build.label}</GuideBuildTitle>
                  <GuideBuildText>{build.summary}</GuideBuildText>
                </GuideBuildPanel>
              ))}
            </GuideBuildGrid>
          </GuideSectionBlock>

          <GuideSectionBlock id="guide-02">
            <GuideSectionHead>
              <div>
                <GuideSectionTitle>특성 선택</GuideSectionTitle>
                <GuideSectionText>
                  전체 특성 트리를 길게 나열하기보다, 실제로 바꿔야 하는 분기와 그 이유를 먼저 보여줍니다.
                </GuideSectionText>
              </div>
              <GuideSectionBadge>build swap</GuideSectionBadge>
            </GuideSectionHead>
            <HeroTalentPathChart />
          </GuideSectionBlock>

          <GuideSectionBlock id="guide-03">
            <GuideSectionHead>
              <div>
                <GuideSectionTitle>딜사이클</GuideSectionTitle>
                <GuideSectionText>
                  가장 많이 쓰는 설명 블록입니다. 전투 흐름 차트는 순서를, 아래 우선순위는 조건부 판단을 담당합니다.
                </GuideSectionText>
              </div>
              <GuideSectionBadge>rotation</GuideSectionBadge>
            </GuideSectionHead>
            <GuideCyclePreview />
          </GuideSectionBlock>

          <GuideSectionBlock id="guide-04">
            <GuideSectionHead>
              <div>
                <GuideSectionTitle>스킬 해설</GuideSectionTitle>
                <GuideSectionText>
                  각 스킬은 공식 한글명, 사용 위치, 연결되는 특성/발동 효과를 한 줄 단위로 축약해 설명합니다.
                </GuideSectionText>
              </div>
              <GuideSectionBadge>wowhead linked</GuideSectionBadge>
            </GuideSectionHead>
            <GuideChecklist>
              {keySkills.map((skill, index) => (
                <GuideSkillLine key={skill.id}>
                  <GuideSkillIcon src={skill.iconUrl} alt="" loading="lazy" />
                  <div>
                    <GuideSkillName>{skill.koreanName}</GuideSkillName>
                    <GuideSkillNote>{index === 0 ? '극딜 구간에서 우선 사용' : index === 1 ? '자원 낭비 전에 소비' : '발동 상태일 때 필러보다 우선'}</GuideSkillNote>
                  </div>
                </GuideSkillLine>
              ))}
            </GuideChecklist>
          </GuideSectionBlock>
        </GuideArticle>

        <GuideAside>
          <GuideAsideStack>
            <SourceStack>
              <TableTitle>
                <ShieldCheck size={15} />
                출처 검증
              </TableTitle>
              <SourceStackBody>
                {guideTemplateSources.map(row => (
                  <SourceBadge key={row[0]}>
                    <BadgeTier>{row[0]}</BadgeTier>
                    <BadgeText>{row[1]}</BadgeText>
                  </SourceBadge>
                ))}
              </SourceStackBody>
            </SourceStack>

            <SourceStack>
              <TableTitle>
                <Check size={15} />
                작성 체크
              </TableTitle>
              <SourceStackBody>
                {['공식 한글명 사용', '스킬 아이콘 연결', '차트 유형 선택', '출처 문단 포함'].map(item => (
                  <GuideCheckRow key={item}>
                    <BadgeTier>OK</BadgeTier>
                    <span>{item}</span>
                  </GuideCheckRow>
                ))}
              </SourceStackBody>
            </SourceStack>
          </GuideAsideStack>
        </GuideAside>
      </GuideBodyGrid>
    </GuideTemplate>
  );
}

function MainSiteMockup() {
  return (
    <CodexFrame>
      <FrameTop>
        <FrameName>
          <WowMetaMark size="28px" />
          wowmeta guide console
        </FrameName>
        <FrameMeta>patch 12.0.5 / Korean KB</FrameMeta>
      </FrameTop>
      <MainGrid>
        <DarkRail>
          <RailHead>직업 색인</RailHead>
          <ClassList>
            {classRows.map(item => (
              <ClassRow key={item.name}>
                <ClassColor $color={item.color} />
                <ClassBody>
                  <ClassName>{item.name}</ClassName>
                  <ClassSpecs>{item.specs}</ClassSpecs>
                </ClassBody>
              </ClassRow>
            ))}
          </ClassList>
        </DarkRail>

        <Workspace>
          <Toolbar>
            <Tool>
              <Search size={15} />
              직업, 전문화, 스킬 검색
            </Tool>
            <Tool>역할 전체</Tool>
            <Tool>레이드 단일</Tool>
          </Toolbar>

          <GuideSheet>
            <SheetHead>
              <div>
                <SheetTitle>파멸 악마사냥꾼</SheetTitle>
                <SheetLead>
                  로고의 접힌 가이드북 형태를 설명 패널로 확장했습니다. 공략 사이트라는 인상을 위해
                  중앙에는 읽는 가이드, 주변에는 검증과 검색 도구를 배치합니다.
                </SheetLead>
              </div>
              <RouteCard>
                <RouteLine>
                  <Node $active />
                  빌드 선택
                </RouteLine>
                <RouteLine>
                  <Node />
                  오프닝 확인
                </RouteLine>
                <RouteLine>
                  <Node />
                  우선순위 적용
                </RouteLine>
              </RouteCard>
            </SheetHead>

            <SheetBody>
              <Table>
                <TableTitle>
                  <Swords size={15} />
                  단일 우선순위
                </TableTitle>
                {priorityRows.map(row => (
                  <PriorityRow key={row[0]}>
                    <Rank>{row[0]}</Rank>
                    <PriorityName>{row[1]}</PriorityName>
                    <PriorityText>{row[2]}</PriorityText>
                  </PriorityRow>
                ))}
              </Table>

              <SkillPanel>
                <TableTitle>
                  <Database size={15} />
                  핵심 스킬
                </TableTitle>
                <IconGrid>
                  {skillRows.slice(0, 8).map(item => (
                    <SkillIcon key={`skill-${item.id}`} src={item.iconUrl} alt="" loading="lazy" />
                  ))}
                </IconGrid>
              </SkillPanel>
            </SheetBody>
          </GuideSheet>
        </Workspace>

        <Ledger>
          <LedgerTitle>출처와 검증</LedgerTitle>
          <LedgerBlock>
            {sourceRows.map(row => (
              <KeyValue key={row[0]}>
                <span>{row[0]}</span>
                <strong>{row[1]}</strong>
              </KeyValue>
            ))}
          </LedgerBlock>
          <LedgerBlock>
            <KeyValue>
              <span>KB 노트</span>
              <strong>{allSkills.length.toLocaleString()}</strong>
            </KeyValue>
            <KeyValue>
              <span>시너지</span>
              <strong>243</strong>
            </KeyValue>
            <KeyValue>
              <span>상태</span>
              <strong>확인 중</strong>
            </KeyValue>
          </LedgerBlock>
        </Ledger>
      </MainGrid>
    </CodexFrame>
  );
}

function PanelSystemMockup() {
  return (
    <PanelRow>
      <CodexFrame>
        <FrameTop>
          <FrameName>
            <BookOpen size={16} />
            guide panel
          </FrameName>
          <FrameMeta>graphite inset</FrameMeta>
        </FrameTop>
        <GuideSheet>
          <SheetHead>
            <div>
              <SheetTitle>공략 핵심 패널</SheetTitle>
              <SheetLead>
                설명 영역도 어두운 그래파이트 패널로 유지하고, 브라스 라인과 아이보리 텍스트로 정보 위계를 잡습니다.
              </SheetLead>
            </div>
          </SheetHead>
          <SheetBody>
            <Table>
              <TableTitle>
                <FileText size={15} />
                작성 규칙
              </TableTitle>
              <PriorityRow>
                <Rank>01</Rank>
                <PriorityName>공식 한글명</PriorityName>
                <PriorityText>Wowhead 기준으로 스킬명을 고정합니다.</PriorityText>
              </PriorityRow>
              <PriorityRow>
                <Rank>02</Rank>
                <PriorityName>공략 용어</PriorityName>
                <PriorityText>딜사이클, 오프닝, 쐐기 용어를 통일합니다.</PriorityText>
              </PriorityRow>
            </Table>
            <SkillPanel>
              <TableTitle>
                <ShieldCheck size={15} />
                품질 게이트
              </TableTitle>
              <LedgerBlock>
                <KeyValue>
                  <span>번역</span>
                  <strong>통과</strong>
                </KeyValue>
                <KeyValue>
                  <span>툴팁</span>
                  <strong>통과</strong>
                </KeyValue>
                <KeyValue>
                  <span>출처</span>
                  <strong>검토</strong>
                </KeyValue>
              </LedgerBlock>
            </SkillPanel>
          </SheetBody>
        </GuideSheet>
      </CodexFrame>

      <CodexFrame>
        <FrameTop>
          <FrameName>
            <Database size={16} />
            spell database panel
          </FrameName>
          <FrameMeta>linked KB</FrameMeta>
        </FrameTop>
        <Workspace>
          <Toolbar>
            <Tool>
              <Search size={15} />
              스킬명 검색
            </Tool>
            <Tool>전체 직업</Tool>
            <Tool>전체 유형</Tool>
          </Toolbar>
          <SpellList>
            {skillRows.slice(0, 6).map(item => (
              <SpellRow
                key={`spell-${item.id}`}
                href={`https://ko.wowhead.com/spell=${item.id}`}
                target="_blank"
                rel="noreferrer"
              >
                <SmallIcon src={item.iconUrl} alt="" loading="lazy" />
                <div>
                  <SpellName>{item.koreanName}</SpellName>
                  <SpellMeta>
                    {item.class || '공용'} / {item.spec || '공용'} / {item.englishName}
                  </SpellMeta>
                </div>
                <SpellType>{item.type}</SpellType>
              </SpellRow>
            ))}
          </SpellList>
        </Workspace>
      </CodexFrame>
    </PanelRow>
  );
}

function SpellDataMockup() {
  const featuredSpell = skillRows[0] || allSkills[0] || {};
  const dataRows = skillRows.slice(0, 7);

  return (
    <SpellBoard>
      <SpellIndex>
        <SpellIndexTop>
          <SpellIndexTitle>스펠 데이터베이스</SpellIndexTitle>
          <SpellIndexMeta>공식 한글명, 아이콘, 분류, 가이드 링크를 한 화면에서 확인</SpellIndexMeta>
        </SpellIndexTop>
        <SpellList>
          {dataRows.map((item, index) => (
            <SpellRow
              key={`spell-index-${item.id}`}
              href={`https://ko.wowhead.com/spell=${item.id}`}
              target="_blank"
              rel="noreferrer"
            >
              <SmallIcon src={item.iconUrl} alt="" loading="lazy" />
              <div>
                <SpellName>{item.koreanName}</SpellName>
                <SpellMeta>
                  {item.class || '공용'} / {item.spec || '공용'}
                </SpellMeta>
              </div>
              <SpellType>{index === 0 ? '선택됨' : item.category || '스킬'}</SpellType>
            </SpellRow>
          ))}
        </SpellList>
      </SpellIndex>

      <SpellDetail>
        <SpellDetailPaper>
          <SpellDetailHeader>
            <LargeSpellIcon src={featuredSpell.iconUrl} alt="" loading="lazy" />
            <div>
              <DetailTitle>{featuredSpell.koreanName || '스킬명'}</DetailTitle>
              <DetailSub>{featuredSpell.englishName || 'official tooltip'} / {featuredSpell.class || '공용'} / {featuredSpell.spec || '공용'}</DetailSub>
            </div>
            <DetailCode>spell {featuredSpell.id || '0000'}</DetailCode>
          </SpellDetailHeader>

          <DetailGrid>
            <div>
              <InfoBlocks>
                <InfoBlock>
                  <InfoLabel>재사용 대기시간</InfoLabel>
                  <InfoValue>{featuredSpell.cooldown || '상황별'}</InfoValue>
                </InfoBlock>
                <InfoBlock>
                  <InfoLabel>시전</InfoLabel>
                  <InfoValue>{featuredSpell.castTime || '즉시'}</InfoValue>
                </InfoBlock>
                <InfoBlock>
                  <InfoLabel>자원</InfoLabel>
                  <InfoValue>{featuredSpell.resourceCost || '없음'}</InfoValue>
                </InfoBlock>
              </InfoBlocks>

              <RouteMap>
                <RouteMapTitle>
                  <Map size={15} />
                  가이드 연결 경로
                </RouteMapTitle>
                <RouteSteps>
                  <RouteStep $active>
                    <StepNumber $active>01</StepNumber>
                    <StepLabel>공식 툴팁</StepLabel>
                  </RouteStep>
                  <RouteStep>
                    <StepNumber>02</StepNumber>
                    <StepLabel>특성 시너지</StepLabel>
                  </RouteStep>
                  <RouteStep>
                    <StepNumber>03</StepNumber>
                    <StepLabel>딜사이클 위치</StepLabel>
                  </RouteStep>
                  <RouteStep>
                    <StepNumber>04</StepNumber>
                    <StepLabel>콘텐츠별 변경</StepLabel>
                  </RouteStep>
                </RouteSteps>
              </RouteMap>
            </div>

            <SourceStack>
              <TableTitle>
                <ShieldCheck size={15} />
                검증 패널
              </TableTitle>
              <SourceStackBody>
                <SourceBadge>
                  <BadgeTier>S</BadgeTier>
                  <BadgeText>ko.wowhead.com 공식 한글명</BadgeText>
                </SourceBadge>
                <SourceBadge>
                  <BadgeTier>A</BadgeTier>
                  <BadgeText>Wowhead / Icy Veins / 직업 디스코드 교차 확인</BadgeText>
                </SourceBadge>
                <SourceBadge>
                  <BadgeTier>WCL</BadgeTier>
                  <BadgeText>상위 로그와 빌드 사용률 비교</BadgeText>
                </SourceBadge>
              </SourceStackBody>
            </SourceStack>
          </DetailGrid>
        </SpellDetailPaper>
      </SpellDetail>
    </SpellBoard>
  );
}

function MockupsPage() {
  useEffect(() => {
    if (!window.location.hash) return;

    const scrollToHash = () => {
      const target = document.querySelector(window.location.hash);
      if (!target) return;

      window.requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
    };

    scrollToHash();
    const settleTimer = window.setTimeout(scrollToHash, 350);
    const imageTimer = window.setTimeout(scrollToHash, 900);

    return () => {
      window.clearTimeout(settleTimer);
      window.clearTimeout(imageTimer);
    };
  }, []);

  return (
    <Page>
      <Shell>
        <Hero>
          <div>
            <BrandLine>
              <MarkBox>
                <WowMetaMark />
              </MarkBox>
              <Word>wowmeta</Word>
            </BrandLine>
            <Label>logo-driven visual system</Label>
            <Intro>
              방금 잡은 로고의 색감과 의미를 기준으로 사이트 목업을 다시 구성했습니다.
              W는 접힌 가이드북, 브라스 라인은 정보의 경계, 펠그린 노드는 최적 공략 경로를 뜻합니다.
            </Intro>
          </div>

          <Palette>
            <Swatch $color="#070a0d">deep charcoal</Swatch>
            <Swatch $color="#11171c">blackened steel</Swatch>
            <Swatch $color="#151c22">soft ivory text</Swatch>
            <Swatch $color="#b8915b">muted brass</Swatch>
          </Palette>
        </Hero>

        <JumpBar aria-label="목업 바로가기">
          <Jump href="#guide-template">
            <FileText size={15} />
            가이드 양식
          </Jump>
          <Jump href="#rotation">
            <Swords size={15} />
            전투 흐름
          </Jump>
          <Jump href="#charts">
            <BarChart3 size={15} />
            차트 목업
          </Jump>
          <Jump href="#site">
            <Map size={15} />
            사이트 화면
          </Jump>
          <Jump href="#panels">
            <Layers3 size={15} />
            패널 시스템
          </Jump>
          <Jump href="#spells">
            <Sparkles size={15} />
            스펠 데이터
          </Jump>
        </JumpBar>

        <Section id="guide-template">
          <SectionHeader>
            <div>
              <SectionTitle>전문화 가이드 기본 양식</SectionTitle>
              <SectionText>
                KB와 차트 라이브러리를 실제 가이드 안에 배치하는 기준 양식입니다.
                모든 전문화는 같은 읽기 흐름을 유지하되, 차트와 스킬 해설 블록만 전문화에 맞게 교체합니다.
              </SectionText>
            </div>
            <Notes>
              <Note>
                <Check size={15} />
                첫 화면에서 결론, 빌드, 강점/약점이 바로 보임
              </Note>
              <Note>
                <Check size={15} />
                설명 영역은 목차, 가이드, 출처 검증 패널의 3단 구조
              </Note>
              <Note>
                <Check size={15} />
                모바일에서는 목차와 검증 패널이 설명 영역 위아래로 접힘
              </Note>
            </Notes>
          </SectionHeader>
          <GuideTemplateMockup />
        </Section>

        <Section id="charts">
          <SectionHeader>
            <div>
              <SectionTitle>가이드용 시각 차트 라이브러리</SectionTitle>
              <SectionText>
                전문화마다 설명해야 하는 구조가 다르기 때문에, 공략 글에 반복해서 쓸 수 있는 차트 타입을 먼저 정리했습니다.
                단순 표보다 판단 흐름, 시간축, 자원, 발동, 시너지처럼 실제 운용 이해에 필요한 형태를 우선했습니다.
              </SectionText>
            </div>
            <Notes>
              <Note>
                <Check size={15} />
                모든 차트 상단에 실제 스킬 아이콘을 넣는 4칸 슬롯 포함
              </Note>
              <Note>
                <Check size={15} />
                모바일에서는 카드, 축, 노드가 세로형으로 접히도록 설계
              </Note>
              <Note>
                <Check size={15} />
                브라스는 기준선, 펠그린은 권장 행동이나 선택 상태
              </Note>
            </Notes>
          </SectionHeader>
          <RotationRailMockup />
          <ChartLibraryMockups />
        </Section>

        <Section id="site">
          <SectionHeader>
            <div>
              <SectionTitle>1. 로고 톤을 적용한 메인 가이드 화면</SectionTitle>
              <SectionText>
                기존의 평평한 테이블 UI 대신, 로고의 가이드북 형태를 중앙 가이드 패널로 확장했습니다.
                주변에는 직업 색인, 검색, 출처 검증 패널을 배치해 공략 사이트의 성격을 바로 드러냅니다.
              </SectionText>
            </div>
            <SectionNotes />
          </SectionHeader>
          <MainSiteMockup />
        </Section>

        <Section id="panels">
          <SectionHeader>
            <div>
              <SectionTitle>2. 로고와 어울리는 패널 디자인</SectionTitle>
              <SectionText>
                차콜 프레임, 브라스 코너 라인, 그래파이트 정보면을 반복하면 전체 사이트가 같은 브랜드 안에서 움직입니다.
                스펠 DB도 같은 언어로 맞춰서 별도 페이지처럼 튀지 않게 구성했습니다.
              </SectionText>
            </div>
            <SectionNotes />
          </SectionHeader>
          <PanelSystemMockup />
        </Section>

        <Section id="spells">
          <SectionHeader>
            <div>
              <SectionTitle>3. 스펠 DB 상세 패널</SectionTitle>
              <SectionText>
                데이터베이스 화면도 같은 로고 문법을 씁니다. 왼쪽은 스펠 색인, 오른쪽은 공식 툴팁과
                가이드 연결 경로를 보여주는 가이드형 패널로 설계했습니다.
              </SectionText>
            </div>
            <Notes>
              <Note>
                <Check size={15} />
                아이콘은 실제 KB에서 빌드된 Wowhead CDN 데이터를 사용
              </Note>
              <Note>
                <Check size={15} />
                선택 상태는 펠그린, 출처 경계는 브라스로 고정
              </Note>
              <Note>
                <Check size={15} />
                스킬 상세와 가이드가 한 브랜드 구조 안에서 이어짐
              </Note>
            </Notes>
          </SectionHeader>
          <SpellDataMockup />
        </Section>
      </Shell>
    </Page>
  );
}

export default MockupsPage;
