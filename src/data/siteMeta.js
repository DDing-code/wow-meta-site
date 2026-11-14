// 검색 엔진에 보일 페이지별 제목·설명·대표 주소.
// 사이트맵(public/sitemap.xml)은 scripts/generate-sitemap.cjs가 같은 가이드·레이드 목록으로 만든다.
import { CURRENT_PATCH_LABEL, getAllGuideSpecs } from './guideRegistry.js';
import raidGuide from './raidGuide.json';
import mythicPlusGuide from './mythicPlusGuide.json';

export const SITE_ORIGIN = 'https://wowmeta.vercel.app';
export const SITE_NAME = 'wowmeta';

const DEFAULT_DESCRIPTION = `월드 오브 워크래프트 ${CURRENT_PATCH_LABEL} 전문화 가이드, 신화 레이드 공략, 초보자 안내, 스펠 DB를 한국어로 정리한 사이트입니다.`;

const STATIC_PAGES = {
  '/': {
    title: `wowmeta | 와우 ${CURRENT_PATCH_LABEL} 전문화 가이드·레이드 공략`,
    description: DEFAULT_DESCRIPTION,
  },
  '/guide': {
    title: `전문화 가이드 | ${SITE_NAME}`,
    description: `탱커·근접·원거리·힐러 40개 전문화의 ${CURRENT_PATCH_LABEL} 딜사이클·특성·오프닝을 상위 로그 기준으로 정리했습니다.`,
  },
  '/beginner': {
    title: `초보자 안내 | ${SITE_NAME}`,
    description: '와우를 처음 시작할 때 알아야 할 용어, 소모품·보석·마법부여, 주문제작과 장식 장비를 그림과 함께 안내합니다.',
  },
  '/raid': {
    title: `레이드 가이드 | ${SITE_NAME}`,
    description: raidGuide.page.lead,
  },
  '/raid/heroic': {
    title: `영웅 레이드 공략 | 레이드 가이드 | ${SITE_NAME}`,
    description: raidGuide.heroic.page.lead,
  },
  '/mythicplus': {
    title: `쐐기 가이드 | ${SITE_NAME}`,
    description: mythicPlusGuide.page.lead,
  },
  '/spells': {
    title: `스펠 DB | ${SITE_NAME}`,
    description: '전문화별 스킬·특성·영웅 특성의 한국어 툴팁과 스킬 연결 지도를 찾아볼 수 있습니다.',
  },
  '/logs': {
    title: `로그 분석 | ${SITE_NAME}`,
    description: '워크래프트 로그를 바탕으로 전문화별 실제 플레이를 비교·분석한 리포트 모음입니다.',
  },
  '/news': {
    title: `소식 | ${SITE_NAME}`,
    description: DEFAULT_DESCRIPTION,
  },
  '/forever': {
    title: `와우 포에버 한눈에 보기 | ${SITE_NAME}`,
    description: '월드 오브 워크래프트: 포에버가 리테일과 무엇이 다른지 공식 한국어 공지를 바탕으로 정리했습니다. 규칙 선택, 60레벨, 새 종족·직업 조합, 유산, 캠핑, 첫 레이드 일정.',
  },
  '/forever/start': {
    title: `와우 포에버 시작하기 | ${SITE_NAME}`,
    description: '월드 오브 워크래프트: 포에버를 처음 시작하는 여섯 단계. 설치, 플레이 환경 사전 설정(클래식·강화됨), 규칙, 진영·종족·직업, 이름 짓기를 차례로 안내합니다.',
  },
  '/forever/rules': {
    title: `와우 포에버 규칙·진영 고르기 | ${SITE_NAME}`,
    description: '월드 오브 워크래프트: 포에버의 일반·PvP·롤플레이·롤플레이 PvP·하드코어 규칙 차이와 진영 제한, 친구와 같이 하려면 맞춰야 할 것을 정리했습니다.',
  },
  '/forever/leveling': {
    title: `와우 포에버 지역·던전 길잡이 | ${SITE_NAME}`,
    description: '포에버 새 지역과 신규 5인 던전 아홉 곳의 레벨·위치, 달라란 입장 퀘스트와 육성 준비를 블리자드 공식 한국어 공지로 정리했습니다.',
  },
  '/forever/growth': {
    title: `와우 포에버 캠핑·유산 성장 | ${SITE_NAME}`,
    description: '작은 모닥불과 캠핑 설비 열 종류, 전문 기술 조건, 유산 해제와 점수 획득·캐릭터별 16점 투자, 하드코어 예외를 안내합니다.',
  },
  '/forever/classes': {
    title: `와우 포에버 직업·특성 가이드 | ${SITE_NAME}`,
    description: '포에버 아홉 직업의 레벨링 특성 경로와 레벨별 배분 견본, 장비·운용 요령과 종족 조합을 따로 찾아볼 수 있습니다.',
  },
  '/forever/raids': {
    title: `와우 포에버 첫 레이드 준비 | ${SITE_NAME}`,
    description: '12월 10일 개방하는 60레벨 레이드 세 곳의 인원·위치, 오닉시아의 둥지 진영별 비룡불꽃 아뮬렛 퀘스트와 출발 전 준비를 안내합니다.',
  },
  '/forever/classes/warrior': {
    title: "포에버 전사 특성·레벨링 | wowmeta",
    description: "방패를 든 보호 경로를 먼저 살펴보세요. 혼자 하는 퀘스트와 던전 탱킹을 같은 특성으로 이어 가기 좋은 견본입니다.",
  },
  '/forever/classes/paladin': {
    title: "포에버 성기사 특성·레벨링 | wowmeta",
    description: "일반적인 혼자 퀘스트에는 징벌, 정기적으로 던전 탱킹을 한다면 보호를 비교합니다. 두 경로 모두 마나를 얼마나 남기는지가 중요합니다.",
  },
  '/forever/classes/hunter': {
    title: "포에버 사냥꾼 특성·레벨링 | wowmeta",
    description: "소환수가 먼저 적을 붙잡고 자신은 거리를 두는 야수 경로를 기본 견본으로 삼았습니다. 소환수 관리와 보급이 레벨링의 일부입니다.",
  },
  '/forever/classes/rogue': {
    title: "포에버 도적 특성·레벨링 | wowmeta",
    description: "일상적인 혼자 퀘스트에는 전투 경로를, 은신과 전투 선택권을 더 중시한다면 잠행을 비교합니다. 손에 든 무기가 전투 방식에 맞아야 합니다.",
  },
  '/forever/classes/priest': {
    title: "포에버 사제 특성·레벨링 | wowmeta",
    description: "혼자 퀘스트하는 시간이 길다면 암흑, 던전 치유를 자주 섞는다면 수양을 비교합니다. 마법봉과 회복 주기가 초반 진행에 큰 영향을 줍니다.",
  },
  '/forever/classes/shaman': {
    title: "포에버 주술사 특성·레벨링 | wowmeta",
    description: "양손 무기를 쓰는 고양 경로를 혼자 퀘스트용 견본으로 정리했습니다. 모든 토템과 주문을 매번 쓰기보다 필요한 것만 고릅니다.",
  },
  '/forever/classes/mage': {
    title: "포에버 마법사 특성·레벨링 | wowmeta",
    description: "혼자 진행하는 첫 경로에는 단일 대상 냉기를 기본 견본으로 삼았습니다. 적과의 거리를 유지하고 회복 시간을 예측하는 쪽에 초점을 둡니다.",
  },
  '/forever/classes/warlock': {
    title: "포에버 흑마법사 특성·레벨링 | wowmeta",
    description: "일반적인 혼자 퀘스트는 지속 피해와 흡수를 활용하는 고통을, 소환수 생존과 방어를 더 중시하면 악마를 비교합니다.",
  },
  '/forever/classes/druid': {
    title: "포에버 드루이드 특성·레벨링 | wowmeta",
    description: "야성 한 경로에서 표범으로 퀘스트하고 곰으로 적 무리와 던전에 대응하는 견본입니다. 변신을 배우는 직업 퀘스트가 진행의 전환점입니다.",
  },
  '/forever/leveling/human': {
    title: "포에버 인간 레벨업 길잡이 | wowmeta",
    description: "얼라이언스 인간의 출발지부터 60레벨까지 이어 가는 지역 후보입니다. 30레벨 뒤 추정 동선과 공식 던전 범위를 구분했습니다.",
  },
  '/forever/leveling/dwarf': {
    title: "포에버 드워프 레벨업 길잡이 | wowmeta",
    description: "얼라이언스 드워프의 출발지부터 60레벨까지 이어 가는 지역 후보입니다. 30레벨 뒤 추정 동선과 공식 던전 범위를 구분했습니다.",
  },
  '/forever/leveling/gnome': {
    title: "포에버 노움 레벨업 길잡이 | wowmeta",
    description: "얼라이언스 노움의 출발지부터 60레벨까지 이어 가는 지역 후보입니다. 30레벨 뒤 추정 동선과 공식 던전 범위를 구분했습니다.",
  },
  '/forever/leveling/night-elf': {
    title: "포에버 나이트 엘프 레벨업 길잡이 | wowmeta",
    description: "얼라이언스 나이트 엘프의 출발지부터 60레벨까지 이어 가는 지역 후보입니다. 30레벨 뒤 추정 동선과 공식 던전 범위를 구분했습니다.",
  },
  '/forever/leveling/orc': {
    title: "포에버 오크 레벨업 길잡이 | wowmeta",
    description: "호드 오크의 출발지부터 60레벨까지 이어 가는 지역 후보입니다. 30레벨 뒤 추정 동선과 공식 던전 범위를 구분했습니다.",
  },
  '/forever/leveling/troll': {
    title: "포에버 트롤 레벨업 길잡이 | wowmeta",
    description: "호드 트롤의 출발지부터 60레벨까지 이어 가는 지역 후보입니다. 30레벨 뒤 추정 동선과 공식 던전 범위를 구분했습니다.",
  },
  '/forever/leveling/tauren': {
    title: "포에버 타우렌 레벨업 길잡이 | wowmeta",
    description: "호드 타우렌의 출발지부터 60레벨까지 이어 가는 지역 후보입니다. 30레벨 뒤 추정 동선과 공식 던전 범위를 구분했습니다.",
  },
  '/forever/leveling/undead': {
    title: "포에버 언데드 레벨업 길잡이 | wowmeta",
    description: "호드 언데드의 출발지부터 60레벨까지 이어 가는 지역 후보입니다. 30레벨 뒤 추정 동선과 공식 던전 범위를 구분했습니다.",
  },
  '/forever/leveling/skyborne-alliance': {
    title: "포에버 고등 마법원 스카이본 레벨업 길잡이 | wowmeta",
    description: "얼라이언스 고등 마법원 스카이본의 출발지부터 60레벨까지 이어 가는 지역 후보입니다. 30레벨 뒤 추정 동선과 공식 던전 범위를 구분했습니다.",
  },
  '/forever/leveling/skyborne-horde': {
    title: "포에버 바람구체자 스카이본 레벨업 길잡이 | wowmeta",
    description: "호드 바람구체자 스카이본의 출발지부터 60레벨까지 이어 가는 지역 후보입니다. 30레벨 뒤 추정 동선과 공식 던전 범위를 구분했습니다.",
  },
};

function normalizePath(pathname) {
  const path = String(pathname || '/').split(/[?#]/)[0].replace(/\/+$/, '');
  return path || '/';
}

// 돌려주는 title이 null이면 그 페이지가 직접 제목을 정한다(로그 분석 리포트).
export function getPageMeta(pathname) {
  const path = normalizePath(pathname);
  const canonical = `${SITE_ORIGIN}${path === '/' ? '/' : path}`;

  if (STATIC_PAGES[path]) {
    return { ...STATIC_PAGES[path], canonical, index: true };
  }

  const guide = getAllGuideSpecs().find(item => item.path === path);
  if (guide) {
    return {
      title: `${guide.spec} ${guide.className} 가이드 ${CURRENT_PATCH_LABEL} | ${SITE_NAME}`,
      description: `${guide.className} ${guide.spec} 전문화 ${CURRENT_PATCH_LABEL} 가이드 — 딜사이클, 특성 견본, 오프닝, 영웅 특성. ${guide.focus}`,
      canonical,
      index: true,
    };
  }

  const heroicMatch = path.match(/^\/raid\/heroic\/([^/]+)$/);
  const heroicBoss = heroicMatch && raidGuide.heroic.bosses.find(item => item.id === heroicMatch[1]);
  if (heroicBoss) {
    return {
      title: `${heroicBoss.name} 영웅 공략 | 레이드 가이드 | ${SITE_NAME}`,
      description: `${heroicBoss.place} ${heroicBoss.name} 영웅 택틱: ${heroicBoss.principle}.`,
      canonical,
      index: true,
    };
  }

  const dungeonMatch = path.match(/^\/mythicplus\/([^/]+)$/);
  const dungeon = dungeonMatch && mythicPlusGuide.dungeons.find(item => item.id === dungeonMatch[1]);
  if (dungeon) {
    return {
      title: `${dungeon.name} 쐐기 공략 | 쐐기 가이드 | ${SITE_NAME}`,
      description: `${dungeon.name}(${dungeon.en}) 쐐기 가이드 — 가장 많이 쓴 루트의 풀링 ${dungeon.pulls.length}개, 네임드 ${dungeon.bosses.filter(boss => !boss.major).length}곳 전투 흐름, 몹별 차단·해제 표시.`,
      canonical,
      index: true,
    };
  }

  const raidMatch = path.match(/^\/raid\/([^/]+)$/);
  const episode = raidMatch && raidGuide.episodes.find(item => item.id === raidMatch[1]);
  if (episode) {
    return {
      title: `${episode.title} 신화 공략 | 레이드 가이드 | ${SITE_NAME}`,
      description: `${episode.place} ${episode.title} 신화 택틱: ${episode.principle}.`,
      canonical,
      index: true,
    };
  }

  if (path.startsWith('/logs/') || path.includes('/log-analysis')) {
    return { title: null, description: DEFAULT_DESCRIPTION, canonical, index: true };
  }

  return { title: `${SITE_NAME} | 와우 전문화 가이드`, description: DEFAULT_DESCRIPTION, canonical, index: false };
}
