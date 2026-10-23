import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  ArrowRight,
  BookOpen,
  Castle,
  ChevronDown,
  Compass,
  Crosshair,
  Database,
  ExternalLink,
  HeartPulse,
  Newspaper,
  Play,
  Shield,
  Swords,
} from 'lucide-react';
import SpecializationIcon from '../components/SpecializationIcon.js';
import { CURRENT_PATCH_LABEL, getAllGuideSpecs } from '../data/guideRegistry.js';
import {
  VIDEO_SEASON_LABEL,
  YOUTUBE_CHANNEL,
  playlistUrl,
  thumbnailUrl,
  watchUrl,
  youtubePlaylists,
} from '../data/youtubePlaylists.js';
import raidGuide from '../data/raidGuide.json';

// 홈은 유튜브 첫 화면처럼 분류 칩 → 재생목록별 영상 줄 → 레이드 가이드 줄 순서다.
// 한 줄은 화면 폭에 맞는 칸 수만 보이고 '모두 보기'로 펼친다. 칩으로 한 분류를 고르면 그 줄만 다 펼쳐 보인다.

const GOLD = '#d2b373';
const LINE = 'rgba(168, 178, 188, 0.14)';

const ROLE_ICONS = { tanks: Shield, healers: HeartPulse, melee: Swords, ranged: Crosshair };

// 칸 수는 아래 Grid의 미디어 쿼리와 같아야 한다. 639px 이하는 두 칸이고, 접힌 줄은 두 줄(4개)까지 보인다.
const COLUMN_QUERIES = [
  ['(min-width: 1180px)', 5],
  ['(min-width: 900px)', 4],
  ['(min-width: 640px)', 3],
];
const MIN_COLUMNS = 2;

function readColumns() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 5;
  const match = COLUMN_QUERIES.find(([query]) => window.matchMedia(query).matches);
  return match ? match[1] : MIN_COLUMNS;
}

function useColumns() {
  const [columns, setColumns] = useState(readColumns);
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const lists = COLUMN_QUERIES.map(([query]) => window.matchMedia(query));
    const update = () => setColumns(readColumns());
    lists.forEach(list => list.addEventListener?.('change', update));
    return () => lists.forEach(list => list.removeEventListener?.('change', update));
  }, []);
  return columns;
}

const Page = styled.div`
  width: min(1280px, calc(100% - 32px));
  margin: 0 auto;
  padding: 22px 0 96px;

  @media (max-width: 560px) {
    width: calc(100% - 24px);
    padding-top: 14px;
  }
`;

const HiddenTitle = styled.h1`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
`;

const BeginnerLink = styled(Link)`
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) auto;
  gap: 16px;
  align-items: center;
  padding: 16px 18px;
  border: 1px solid rgba(168, 178, 188, 0.18);
  border-left: 3px solid ${GOLD};
  background: rgba(13, 18, 22, 0.62);
  > svg:first-child { justify-self: center; color: ${GOLD}; }
  > svg:last-child { color: ${GOLD}; transition: transform 160ms ease; }
  > div { display: grid; gap: 2px; min-width: 0; }
  strong { color: #eef1f3; font-size: 0.98rem; }
  span { color: #aeb8be; font-size: 0.88rem; word-break: keep-all; }
  &:hover { background: rgba(168, 178, 188, 0.045); }
  &:hover span { color: #eef1f3; }
  &:hover > svg:last-child { transform: translateX(3px); }

  @media (max-width: 560px) {
    grid-template-columns: 32px minmax(0, 1fr);
    padding: 14px 14px;
    > svg:last-child { display: none; }
  }
`;

const ChipBar = styled.div`
  position: sticky;
  top: 58px;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 18px;
  padding: 12px 0;
  border-bottom: 1px solid ${LINE};
  background: rgba(9, 12, 15, 0.96);
`;

const Chips = styled.div`
  display: flex;
  gap: 8px;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const Chip = styled.button`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 34px;
  padding: 0 13px;
  border: 1px solid ${props => (props.$active ? '#eef1f3' : 'rgba(168, 178, 188, 0.2)')};
  background: ${props => (props.$active ? '#eef1f3' : 'rgba(168, 178, 188, 0.06)')};
  color: ${props => (props.$active ? '#090c0f' : '#cdd4d8')};
  font-size: 0.84rem;
  font-weight: ${props => (props.$active ? 750 : 600)};
  white-space: nowrap;

  &:hover {
    background: ${props => (props.$active ? '#eef1f3' : 'rgba(168, 178, 188, 0.12)')};
  }
`;

const ChannelLink = styled.a`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  color: #8f9aa2;
  font-size: 0.8rem;
  font-weight: 650;
  white-space: nowrap;

  &:hover { color: #eef1f3; }

  @media (max-width: 720px) {
    display: none;
  }
`;

const Shelf = styled.section`
  padding: 26px 0 24px;
  border-bottom: 1px solid ${LINE};
`;

const ShelfHead = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
`;

const ShelfTitle = styled.h2`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
  color: #eef1f3;
  font-size: 1.16rem;
  line-height: 1.3;

  svg { flex: 0 0 auto; color: ${props => props.$color || GOLD}; }
`;

const ShelfCount = styled.span`
  color: #7f8b94;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
`;

const ShelfLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-left: auto;
`;

const ShelfLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #8f9aa2;
  font-size: 0.8rem;
  font-weight: 650;
  white-space: nowrap;

  &:hover { color: #eef1f3; }

  @media (max-width: 520px) {
    span { display: none; }
  }
`;

const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 26px 16px;
  margin: 0;
  padding: 0;
  list-style: none;

  @media (max-width: 1179px) { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  @media (max-width: 899px) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  @media (max-width: 639px) { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px 10px; }
`;

const Card = styled.li`
  display: grid;
  align-content: start;
  gap: 10px;
  min-width: 0;
`;

const Thumb = styled.a`
  position: relative;
  display: block;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #11161a;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 200ms ease;
  }

  &:hover img { transform: scale(1.03); }

  &:focus-visible {
    outline-offset: 2px;
  }
`;

// 썸네일 오른쪽 아래의 wowmeta 글자를 가리지 않게, 재생 표시는 마우스를 올리거나 키보드로 고를 때만 가운데에 뜬다.
const PlayBadge = styled.span`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(9, 12, 15, 0.42);
  color: #fff;
  opacity: 0;
  transition: opacity 160ms ease;

  > span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 12px;
    background: #c4302b;
    font-size: 0.78rem;
    font-weight: 750;
  }

  ${Thumb}:hover &,
  ${Thumb}:focus-visible & {
    opacity: 1;
  }
`;

const Meta = styled.div`
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  gap: 10px;

  @media (max-width: 639px) {
    grid-template-columns: 28px minmax(0, 1fr);
    gap: 8px;
  }
  align-items: start;
  min-width: 0;
`;

const Avatar = styled.span`
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 1px solid ${props => `${props.$color}66`};
  background: ${props => `${props.$color}1f`};
  color: ${props => props.$color};
  --spec-icon-size: 24px;

  @media (max-width: 639px) {
    width: 28px;
    height: 28px;
    --spec-icon-size: 20px;
  }

  svg[data-spec-icon] { opacity: 0.92; }
`;

const MetaText = styled.div`
  display: grid;
  gap: 3px;
  min-width: 0;
`;

const CardTitle = styled(Link)`
  color: #eef1f3;
  font-size: 0.92rem;
  font-weight: 700;
  line-height: 1.35;
  word-break: keep-all;

  &:hover { color: ${GOLD}; }
`;

const CardSub = styled.span`
  color: #8f9aa2;
  font-size: 0.76rem;
  font-weight: 520;
  line-height: 1.45;
  word-break: keep-all;
`;

const GuideLink = styled(Link)`
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
  color: ${GOLD};
  font-size: 0.76rem;
  font-weight: 700;

  &:hover { color: #f0d9a4; }
`;

const RaidThumb = styled(Link)`
  position: relative;
  display: block;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-bottom: 2px solid ${props => props.$color};
  background: #11161a;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 200ms ease;
  }

  &:hover img { transform: scale(1.03); }
`;

const RaidPlace = styled.span`
  position: absolute;
  left: 6px;
  top: 6px;
  padding: 3px 6px;
  background: rgba(9, 12, 15, 0.86);
  color: ${props => props.$color};
  font-size: 0.68rem;
  font-weight: 700;
`;

const Clamp = styled(CardSub)`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MoreButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 34px;
  margin: 18px auto 0;
  padding: 0 16px;
  border: 1px solid rgba(168, 178, 188, 0.18);
  background: transparent;
  color: #cdd4d8;
  font-size: 0.82rem;
  font-weight: 650;

  svg { transition: transform 160ms ease; transform: rotate(${props => (props.$open ? '180deg' : '0deg')}); }

  &:hover { background: rgba(168, 178, 188, 0.06); color: #eef1f3; }
`;

const Shortcuts = styled.nav`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 30px;
  border-top: 1px solid ${LINE};
  border-left: 1px solid ${LINE};

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Shortcut = styled(Link)`
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  padding: 16px 16px;
  border-right: 1px solid ${LINE};
  border-bottom: 1px solid ${LINE};
  > svg:first-child { color: ${props => props.$color}; }
  > svg:last-child { color: #5f6a72; transition: transform 160ms ease; }
  > div { display: grid; gap: 2px; min-width: 0; }
  strong { color: #e7ebed; font-size: 0.92rem; }
  span { color: #8f9aa2; font-size: 0.8rem; word-break: keep-all; }
  &:hover { background: rgba(168, 178, 188, 0.035); }
  &:hover > svg:last-child { color: #eef1f3; transform: translateX(3px); }
`;

const guideById = Object.fromEntries(getAllGuideSpecs().map(spec => [spec.id, spec]));

const videoShelves = youtubePlaylists.map(playlist => ({
  id: playlist.role,
  label: playlist.label,
  title: `${playlist.label} 가이드`,
  icon: ROLE_ICONS[playlist.role],
  playlist,
  items: playlist.items
    .map(([guideId, youtubeId]) => ({ guide: guideById[guideId], youtubeId }))
    .filter(item => item.guide),
}));

const raidEpisodes = (raidGuide.episodes || []).map(episode => {
  const match = JSON.stringify(episode).match(/"plan":"([\w-]+)"/);
  return { ...episode, plan: match ? match[1] : null };
});

const FILTERS = [
  { id: 'all', label: '전체' },
  ...videoShelves.map(shelf => ({ id: shelf.id, label: shelf.label, icon: shelf.icon })),
  { id: 'raid', label: '레이드', icon: Castle },
];

function VideoCard({ guide, youtubeId, playlistId }) {
  const name = `${guide.spec} ${guide.className}`;
  return (
    <Card>
      <Thumb
        href={watchUrl(youtubeId, playlistId)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${name} 가이드 영상 유튜브에서 보기 (새 창)`}
      >
        <img
          src={thumbnailUrl(youtubeId, 'mqdefault')}
          srcSet={`${thumbnailUrl(youtubeId, 'mqdefault')} 320w, ${thumbnailUrl(youtubeId, 'hqdefault')} 480w`}
          sizes="(max-width: 639px) 50vw, 260px"
          alt=""
          width="320"
          height="180"
          loading="lazy"
          decoding="async"
        />
        <PlayBadge aria-hidden="true"><span><Play size={13} fill="currentColor" />유튜브에서 보기</span></PlayBadge>
      </Thumb>
      <Meta>
        <Avatar $color={guide.color}>
          <SpecializationIcon $specId={guide.id} />
        </Avatar>
        <MetaText>
          <CardTitle to={guide.path}>{name}</CardTitle>
          <CardSub>{VIDEO_SEASON_LABEL} {CURRENT_PATCH_LABEL} · {guide.roleLabel}</CardSub>
          <GuideLink to={guide.path} aria-label={`${name} 글 가이드 읽기`}>
            글 가이드 <ArrowRight size={12} aria-hidden="true" />
          </GuideLink>
        </MetaText>
      </Meta>
    </Card>
  );
}

function RaidCard({ episode }) {
  return (
    <Card>
      <RaidThumb to={`/raid/${episode.id}`} $color={episode.color} aria-label={`${episode.title} 레이드 가이드 열기`}>
        {episode.plan && (
          <img
            src={`/images/raid/plan/${episode.plan}-960.webp`}
            alt=""
            width="960"
            height="540"
            loading="lazy"
            decoding="async"
          />
        )}
        <RaidPlace $color={episode.color}>{episode.place}</RaidPlace>
      </RaidThumb>
      <MetaText>
        <CardTitle to={`/raid/${episode.id}`}>{episode.title}</CardTitle>
        <Clamp>{episode.principle}</Clamp>
      </MetaText>
    </Card>
  );
}

// locked: 칩으로 이 분류만 고른 상태라 늘 다 펼쳐 두고 접기 버튼을 두지 않는다.
function ShelfGrid({ items, columns, expanded, locked, onToggle, label, renderItem }) {
  const limit = columns <= MIN_COLUMNS ? columns * 2 : columns;
  const collapsible = !locked && items.length > limit;
  const visible = locked || expanded || !collapsible ? items : items.slice(0, limit);
  return (
    <>
      <Grid>{visible.map(renderItem)}</Grid>
      {collapsible && (
        <MoreButton type="button" $open={expanded} aria-expanded={expanded} onClick={onToggle}>
          {expanded ? '접기' : `${label} 모두 보기 (${items.length})`}
          <ChevronDown size={15} aria-hidden="true" />
        </MoreButton>
      )}
    </>
  );
}

function HomePage() {
  const columns = useColumns();
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState({});
  const isShown = id => filter === 'all' || filter === id;
  const isExpanded = id => !!open[id];
  const toggle = id => setOpen(state => ({ ...state, [id]: !state[id] }));
  const totalVideos = useMemo(() => videoShelves.reduce((sum, shelf) => sum + shelf.items.length, 0), []);

  return (
    <Page>
      <HiddenTitle>wowmeta 홈</HiddenTitle>

      <BeginnerLink to="/beginner">
        <Compass size={22} strokeWidth={1.75} aria-hidden="true" />
        <div>
          <strong>와우가 처음이신가요?</strong>
          <span>전투 용어부터 영약·물약·파티 준비까지, 초보자 안내에서 시작하세요.</span>
        </div>
        <ArrowRight size={18} aria-hidden="true" />
      </BeginnerLink>

      <ChipBar>
        <Chips role="group" aria-label="분류">
          {FILTERS.map(item => {
            const Icon = item.icon;
            return (
              <Chip
                key={item.id}
                type="button"
                $active={filter === item.id}
                aria-pressed={filter === item.id}
                onClick={() => setFilter(item.id)}
              >
                {Icon && <Icon size={14} aria-hidden="true" />}
                {item.label}
              </Chip>
            );
          })}
        </Chips>
        <ChannelLink href={YOUTUBE_CHANNEL.url} target="_blank" rel="noopener noreferrer">
          유튜브 채널 · 영상 {totalVideos}편 <ExternalLink size={13} aria-hidden="true" />
        </ChannelLink>
      </ChipBar>

      {videoShelves.filter(shelf => isShown(shelf.id)).map(shelf => {
        const Icon = shelf.icon;
        return (
          <Shelf key={shelf.id} aria-labelledby={`shelf-${shelf.id}`} data-shelf={shelf.id}>
            <ShelfHead>
              <ShelfTitle id={`shelf-${shelf.id}`}>
                <Icon size={19} aria-hidden="true" />
                {shelf.title}
              </ShelfTitle>
              <ShelfCount>영상 {shelf.items.length}편</ShelfCount>
              <ShelfLinks>
                <ShelfLink
                  href={playlistUrl(shelf.playlist.playlistId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${shelf.playlist.title} 재생목록 유튜브에서 열기 (새 창)`}
                >
                  <Play size={13} aria-hidden="true" />
                  <span>재생목록 전체 재생</span>
                </ShelfLink>
              </ShelfLinks>
            </ShelfHead>
            <ShelfGrid
              items={shelf.items}
              columns={columns}
              expanded={isExpanded(shelf.id)}
              locked={filter === shelf.id}
              onToggle={() => toggle(shelf.id)}
              label={shelf.title}
              renderItem={item => (
                <VideoCard key={item.guide.id} guide={item.guide} youtubeId={item.youtubeId} playlistId={shelf.playlist.playlistId} />
              )}
            />
          </Shelf>
        );
      })}

      {isShown('raid') && raidEpisodes.length > 0 && (
        <Shelf aria-labelledby="shelf-raid" data-shelf="raid">
          <ShelfHead>
            <ShelfTitle id="shelf-raid">
              <Castle size={19} aria-hidden="true" />
              레이드 가이드
            </ShelfTitle>
            <ShelfCount>{raidEpisodes.length}편</ShelfCount>
            <ShelfLinks>
              <ShelfLink as={Link} to="/raid">
                <span>전체 보기</span>
                <ArrowRight size={13} aria-hidden="true" />
              </ShelfLink>
            </ShelfLinks>
          </ShelfHead>
          <ShelfGrid
            items={raidEpisodes}
            columns={columns}
            expanded={isExpanded('raid')}
            locked={filter === 'raid'}
            onToggle={() => toggle('raid')}
            label="레이드 가이드"
            renderItem={episode => <RaidCard key={episode.id} episode={episode} />}
          />
        </Shelf>
      )}

      <Shortcuts aria-label="바로가기">
        <Shortcut to="/guide" $color="#C69B6D">
          <BookOpen size={20} aria-hidden="true" />
          <div>
            <strong>전문화 가이드 목록</strong>
            <span>역할과 직업으로 40개 전문화를 찾습니다.</span>
          </div>
          <ArrowRight size={16} aria-hidden="true" />
        </Shortcut>
        <Shortcut to="/spells" $color="#3FC7EB">
          <Database size={20} aria-hidden="true" />
          <div>
            <strong>스펠 DB</strong>
            <span>공식 한국어 이름으로 스킬과 특성을 찾습니다.</span>
          </div>
          <ArrowRight size={16} aria-hidden="true" />
        </Shortcut>
        <Shortcut to="/news" $color="#AAD372">
          <Newspaper size={20} aria-hidden="true" />
          <div>
            <strong>소식</strong>
            <span>패치 변경과 가이드 갱신 내역을 봅니다.</span>
          </div>
          <ArrowRight size={16} aria-hidden="true" />
        </Shortcut>
      </Shortcuts>
    </Page>
  );
}

export default HomePage;
