import React, { useEffect, useState } from 'react';
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
  GraduationCap,
  HeartPulse,
  KeyRound,
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
import guideManuscripts from '../data/guideManuscripts.js';
import raidGuide from '../data/raidGuide.json';
import mythicPlusGuide from '../data/mythicPlusGuide.json';

// 홈은 유튜브 첫 화면처럼 분류 칩 → 직업 심화편 줄 → 재생목록별 기본편 줄 → 레이드 가이드 줄 → 쐐기 가이드 줄 순서다.
// 한 줄은 화면 폭에 맞는 칸 수만 보이고 '모두 보기'로 펼친다. 칩으로 한 분류를 고르면 그 줄만 다 펼쳐 보인다.
// 영상은 계속 늘거나 바뀌므로 영상·편 개수는 화면에 적지 않는다(validate:home이 막는다).

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

  // $keepLabel: 링크가 둘이라 화살표만 남으면 구별이 안 되는 곳(레이드 신화·영웅)은 좁은 화면에도 글자를 둔다.
  @media (max-width: 520px) {
    span { display: ${props => (props.$keepLabel ? 'inline' : 'none')}; }
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

const CardLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 14px;
  margin-top: 2px;
`;

const GuideLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: ${GOLD};
  font-size: 0.76rem;
  font-weight: 700;

  &:hover { color: #f0d9a4; }
`;

// 다른 편 영상(기본편↔심화편, 던전 영상)으로 가는 작은 링크. 글 가이드 링크보다 한 단계 약하게 보인다.
const VideoLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #aeb8be;
  font-size: 0.76rem;
  font-weight: 650;

  svg { color: #c4302b; }
  &:hover { color: #eef1f3; }
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
const isYoutubeId = id => /^[A-Za-z0-9_-]{11}$/.test(id || '');

// 심화편 번호는 가이드 원고의 advancedVideo 하나가 정본이다(가이드 페이지의 기본편·심화편 단추와 같은 값).
const advancedIdOf = guideId => {
  const id = guideManuscripts[guideId]?.advancedVideo?.youtubeId;
  return isYoutubeId(id) ? id : null;
};

const videoShelves = youtubePlaylists.map(playlist => ({
  id: playlist.role,
  label: playlist.label,
  title: `${playlist.label} 가이드`,
  icon: ROLE_ICONS[playlist.role],
  playlist,
  items: playlist.items
    .map(([guideId, youtubeId]) => ({ guide: guideById[guideId], youtubeId, advancedId: advancedIdOf(guideId) }))
    .filter(item => item.guide),
}));

// 심화편 줄: 심화편이 있는 전문화만, 재생목록 순서(탱커 → 힐러 → 근딜 → 원딜)대로.
const advancedItems = videoShelves.flatMap(shelf => shelf.items
  .filter(item => item.advancedId)
  .map(item => ({ ...item, playlistId: shelf.playlist.playlistId })));

const raidEpisodes = (raidGuide.episodes || []).map(episode => {
  const match = JSON.stringify(episode).match(/"plan":"([\w-]+)"/);
  return { ...episode, plan: match ? match[1] : null };
});

// 쐐기 가이드 줄: 던전마다 유튜브 썸네일과 같은 픽셀아트 그림(public/images/mythicplus/thumb)과 한 줄 사실.
const dungeonCards = (mythicPlusGuide.dungeons || []).map(dungeon => ({
  ...dungeon,
  facts: `${Math.round(dungeon.timer / 60)}분 · 네임드 ${dungeon.bosses.filter(boss => !boss.major).length}곳 · 풀링 ${dungeon.pulls.length}개`,
}));

const FILTERS = [
  { id: 'all', label: '전체' },
  ...(advancedItems.length ? [{ id: 'advanced', label: '심화편', icon: GraduationCap }] : []),
  ...videoShelves.map(shelf => ({ id: shelf.id, label: shelf.label, icon: shelf.icon })),
  { id: 'raid', label: '레이드', icon: Castle },
  { id: 'mythicplus', label: '쐐기', icon: KeyRound },
];

// advanced: 심화편 줄의 칸이면 심화편 영상을 크게 보이고 기본편을 작은 링크로, 아니면 그 반대다.
function VideoCard({ guide, youtubeId, advancedId, playlistId, advanced = false }) {
  const name = `${guide.spec} ${guide.className}`;
  const mainId = advanced ? advancedId : youtubeId;
  const otherId = advanced ? youtubeId : advancedId;
  const mainLabel = advanced ? '심화편' : '기본편';
  const otherLabel = advanced ? '기본편' : '심화편';
  return (
    <Card>
      <Thumb
        href={advanced ? watchUrl(mainId) : watchUrl(mainId, playlistId)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${name} ${mainLabel} 가이드 영상 유튜브에서 보기 (새 창)`}
      >
        <img
          src={thumbnailUrl(mainId, 'mqdefault')}
          srcSet={`${thumbnailUrl(mainId, 'mqdefault')} 320w, ${thumbnailUrl(mainId, 'hqdefault')} 480w`}
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
          <CardSub>{VIDEO_SEASON_LABEL} {CURRENT_PATCH_LABEL} · {guide.roleLabel}{advanced ? ' · 심화편' : ''}</CardSub>
          <CardLinks>
            <GuideLink to={guide.path} aria-label={`${name} 글 가이드 읽기`}>
              글 가이드 <ArrowRight size={12} aria-hidden="true" />
            </GuideLink>
            {otherId && (
              <VideoLink
                href={watchUrl(otherId, advanced ? playlistId : undefined)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${name} ${otherLabel} 영상 유튜브에서 보기 (새 창)`}
                data-video-kind={advanced ? 'basic' : 'advanced'}
              >
                <Play size={11} fill="currentColor" aria-hidden="true" />{otherLabel}
              </VideoLink>
            )}
          </CardLinks>
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

function DungeonCard({ dungeon }) {
  return (
    <Card>
      <RaidThumb to={`/mythicplus/${dungeon.id}`} $color={dungeon.color} aria-label={`${dungeon.name} 쐐기 가이드 열기`}>
        <img
          src={`/images/mythicplus/thumb/${dungeon.thumbnail}-960.webp`}
          alt=""
          width="960"
          height="540"
          loading="lazy"
          decoding="async"
        />
        <RaidPlace $color={dungeon.color}>{dungeon.abbr}</RaidPlace>
      </RaidThumb>
      <MetaText>
        <CardTitle to={`/mythicplus/${dungeon.id}`}>{dungeon.name}</CardTitle>
        <Clamp>{dungeon.facts}</Clamp>
        {isYoutubeId(dungeon.video?.youtubeId) && (
          <CardLinks>
            <VideoLink
              href={watchUrl(dungeon.video.youtubeId)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${dungeon.name} 공략 영상 유튜브에서 보기 (새 창)`}
            >
              <Play size={11} fill="currentColor" aria-hidden="true" />공략 영상
            </VideoLink>
          </CardLinks>
        )}
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
          {expanded ? '접기' : `${label} 모두 보기`}
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

  return (
    <Page>
      <HiddenTitle>wowmeta 홈</HiddenTitle>

      <BeginnerLink to="/beginner">
        <Compass size={22} strokeWidth={1.75} aria-hidden="true" />
        <div>
          <strong>와우가 처음이신가요?</strong>
          <span>초보자 영상과 함께 전투 용어부터 영약·물약·파티 준비까지 차근차근 시작하세요.</span>
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
          유튜브 채널 <ExternalLink size={13} aria-hidden="true" />
        </ChannelLink>
      </ChipBar>

      {isShown('advanced') && advancedItems.length > 0 && (
        <Shelf aria-labelledby="shelf-advanced" data-shelf="advanced">
          <ShelfHead>
            <ShelfTitle id="shelf-advanced">
              <GraduationCap size={19} aria-hidden="true" />
              직업 심화편
            </ShelfTitle>
            <ShelfLinks>
              <ShelfLink
                href={YOUTUBE_CHANNEL.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${YOUTUBE_CHANNEL.name} 유튜브 채널 열기 (새 창)`}
              >
                <span>채널에서 보기</span>
                <ExternalLink size={13} aria-hidden="true" />
              </ShelfLink>
            </ShelfLinks>
          </ShelfHead>
          <ShelfGrid
            items={advancedItems}
            columns={columns}
            expanded={isExpanded('advanced')}
            locked={filter === 'advanced'}
            onToggle={() => toggle('advanced')}
            label="직업 심화편"
            renderItem={item => (
              <VideoCard
                key={item.guide.id}
                guide={item.guide}
                youtubeId={item.youtubeId}
                advancedId={item.advancedId}
                playlistId={item.playlistId}
                advanced
              />
            )}
          />
        </Shelf>
      )}

      {videoShelves.filter(shelf => isShown(shelf.id)).map(shelf => {
        const Icon = shelf.icon;
        return (
          <Shelf key={shelf.id} aria-labelledby={`shelf-${shelf.id}`} data-shelf={shelf.id}>
            <ShelfHead>
              <ShelfTitle id={`shelf-${shelf.id}`}>
                <Icon size={19} aria-hidden="true" />
                {shelf.title}
              </ShelfTitle>
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
                <VideoCard
                  key={item.guide.id}
                  guide={item.guide}
                  youtubeId={item.youtubeId}
                  advancedId={item.advancedId}
                  playlistId={shelf.playlist.playlistId}
                />
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
            <ShelfLinks>
              <ShelfLink as={Link} to="/raid/heroic" $keepLabel aria-label="영웅 난이도 레이드 가이드 열기">
                <span>영웅</span>
                <ArrowRight size={13} aria-hidden="true" />
              </ShelfLink>
              <ShelfLink as={Link} to="/raid" $keepLabel aria-label="신화 레이드 가이드 전체 보기">
                <span>신화</span>
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

      {isShown('mythicplus') && dungeonCards.length > 0 && (
        <Shelf aria-labelledby="shelf-mythicplus" data-shelf="mythicplus">
          <ShelfHead>
            <ShelfTitle id="shelf-mythicplus">
              <KeyRound size={19} aria-hidden="true" />
              쐐기 가이드
            </ShelfTitle>
            <ShelfLinks>
              <ShelfLink as={Link} to="/mythicplus">
                <span>전체 보기</span>
                <ArrowRight size={13} aria-hidden="true" />
              </ShelfLink>
            </ShelfLinks>
          </ShelfHead>
          <ShelfGrid
            items={dungeonCards}
            columns={columns}
            expanded={isExpanded('mythicplus')}
            locked={filter === 'mythicplus'}
            onToggle={() => toggle('mythicplus')}
            label="쐐기 가이드"
            renderItem={dungeon => <DungeonCard key={dungeon.id} dungeon={dungeon} />}
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
