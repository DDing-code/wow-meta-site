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
  '/forever/races': {
    title: `와우 포에버 종족별 레벨링 가이드 | ${SITE_NAME}`,
    description: '포에버 열 종족의 출발지부터 60레벨까지 지역 후보와 출발 지도, 길에서 묶어 갈 새 5인 던전을 종족별 페이지로 정리했습니다.',
  },
  '/forever/raids': {
    title: `와우 포에버 첫 레이드 준비 | ${SITE_NAME}`,
    description: '12월 10일 개방하는 60레벨 레이드 세 곳의 인원·위치, 오닉시아의 둥지 진영별 비룡불꽃 아뮬렛 퀘스트와 출발 전 준비를 안내합니다.',
  },
  '/forever/classes/warrior': {
    title: "포에버 전사 전문화 선택 | wowmeta",
    description: "전사의 전문화를 골라 별도 페이지에서 추천 특성 순서·선택 이유·한국어 효과 설명을 확인하세요.",
  },
  '/forever/classes/paladin': {
    title: "포에버 성기사 전문화 선택 | wowmeta",
    description: "성기사의 전문화를 골라 별도 페이지에서 추천 특성 순서·선택 이유·한국어 효과 설명을 확인하세요.",
  },
  '/forever/classes/hunter': {
    title: "포에버 사냥꾼 전문화 선택 | wowmeta",
    description: "사냥꾼의 전문화를 골라 별도 페이지에서 추천 특성 순서·선택 이유·한국어 효과 설명을 확인하세요.",
  },
  '/forever/classes/rogue': {
    title: "포에버 도적 전문화 선택 | wowmeta",
    description: "도적의 전문화를 골라 별도 페이지에서 추천 특성 순서·선택 이유·한국어 효과 설명을 확인하세요.",
  },
  '/forever/classes/priest': {
    title: "포에버 사제 전문화 선택 | wowmeta",
    description: "사제의 전문화를 골라 별도 페이지에서 추천 특성 순서·선택 이유·한국어 효과 설명을 확인하세요.",
  },
  '/forever/classes/shaman': {
    title: "포에버 주술사 전문화 선택 | wowmeta",
    description: "주술사의 전문화를 골라 별도 페이지에서 추천 특성 순서·선택 이유·한국어 효과 설명을 확인하세요.",
  },
  '/forever/classes/mage': {
    title: "포에버 마법사 전문화 선택 | wowmeta",
    description: "마법사의 전문화를 골라 별도 페이지에서 추천 특성 순서·선택 이유·한국어 효과 설명을 확인하세요.",
  },
  '/forever/classes/warlock': {
    title: "포에버 흑마법사 전문화 선택 | wowmeta",
    description: "흑마법사의 전문화를 골라 별도 페이지에서 추천 특성 순서·선택 이유·한국어 효과 설명을 확인하세요.",
  },
  '/forever/classes/druid': {
    title: "포에버 드루이드 전문화 선택 | wowmeta",
    description: "드루이드의 전문화를 골라 별도 페이지에서 추천 특성 순서·선택 이유·한국어 효과 설명을 확인하세요.",
  },
  '/forever/classes/warrior/arms': {
    title: "포에버 무기 전사 특성 가이드 | wowmeta",
    description: "양손 무기로 퀘스트를 진행할 때 고릅니다. 둘 이상을 상대하는 상황과 한 대상 전투를 모두 준비하는 방향입니다.",
  },
  '/forever/classes/warrior/fury': {
    title: "포에버 분노 전사 특성 가이드 | wowmeta",
    description: "쌍수 무기를 갖추고 근접 공격을 이어 가는 선택입니다. 무기 교체가 늦어지면 현재 장비로 사냥이 편한지부터 확인하세요.",
  },
  '/forever/classes/warrior/protection': {
    title: "포에버 방어 전사 특성 가이드 | wowmeta",
    description: "던전에서 탱커를 맡을 때 추천합니다. 혼자 퀘스트를 할 시간과 파티를 기다릴 시간을 함께 고려하세요.",
  },
  '/forever/classes/paladin/holy': {
    title: "포에버 신성 성기사 특성 가이드 | wowmeta",
    description: "회복 담당자로 던전을 자주 갈 때 고릅니다. 혼자 사냥하는 시간이 길다면 징벌 안내와 비교하세요.",
  },
  '/forever/classes/paladin/protection': {
    title: "포에버 보호 성기사 특성 가이드 | wowmeta",
    description: "방패를 들고 던전 탱커를 맡는 경로입니다. 파티 사냥을 계속할 수 있을 때 우선 고려합니다.",
  },
  '/forever/classes/paladin/retribution': {
    title: "포에버 징벌 성기사 특성 가이드 | wowmeta",
    description: "혼자 퀘스트를 진행하는 기본 추천입니다. 양손 무기와 근접 전투를 중심으로 준비합니다.",
  },
  '/forever/classes/hunter/beast-mastery': {
    title: "포에버 야수 사냥꾼 특성 가이드 | wowmeta",
    description: "소환수와 함께 혼자 퀘스트를 진행하는 기본 추천입니다. 소환수의 생존과 이동을 꾸준히 관리하세요.",
  },
  '/forever/classes/hunter/marksmanship': {
    title: "포에버 사격 사냥꾼 특성 가이드 | wowmeta",
    description: "자신의 원거리 공격을 중심으로 성장하는 경로입니다. 포에버에서는 이 경로에서도 소환수를 함께 운용합니다.",
  },
  '/forever/classes/hunter/survival': {
    title: "포에버 생존 사냥꾼 특성 가이드 | wowmeta",
    description: "근접 무기 중심으로 사냥하려는 경우의 선택입니다. 야수·사격과 장비와 전투 거리가 다릅니다.",
  },
  '/forever/classes/rogue/assassination': {
    title: "포에버 암살 도적 특성 가이드 | wowmeta",
    description: "독과 근접 공격을 중심으로 성장하는 경로입니다. 두 손의 무기를 함께 마련할 계획으로 선택하세요.",
  },
  '/forever/classes/rogue/combat': {
    title: "포에버 전투 도적 특성 가이드 | wowmeta",
    description: "혼자 퀘스트를 하거나 던전을 함께 도는 기본 추천입니다. 정면 근접전을 안정적으로 이어 가는 방향입니다.",
  },
  '/forever/classes/rogue/subtlety': {
    title: "포에버 잠행 도적 특성 가이드 | wowmeta",
    description: "은신 진입과 전투 위치를 직접 조절하는 플레이에 맞습니다. 정면 사냥을 반복한다면 전투 경로부터 비교하세요.",
  },
  '/forever/classes/priest/discipline': {
    title: "포에버 수양 사제 특성 가이드 | wowmeta",
    description: "마법봉 사냥과 던전 치유를 함께 하는 선택입니다. 치유 장비와 사냥 장비를 함께 준비하세요.",
  },
  '/forever/classes/priest/holy': {
    title: "포에버 신성 사제 특성 가이드 | wowmeta",
    description: "던전 치유에 집중하는 경로입니다. 혼자 퀘스트를 마치는 속도보다 파티 운영을 우선할 때 고릅니다.",
  },
  '/forever/classes/priest/shadow': {
    title: "포에버 암흑 사제 특성 가이드 | wowmeta",
    description: "혼자 퀘스트를 진행하는 기본 추천입니다. 파티 치유를 자주 맡는다면 형상을 완성하기 전에 역할부터 정하세요.",
  },
  '/forever/classes/shaman/elemental': {
    title: "포에버 정기 주술사 특성 가이드 | wowmeta",
    description: "원거리 주문 중심으로 성장하는 경로입니다. 주문 장비와 물을 준비할 수 있을 때 고려하세요.",
  },
  '/forever/classes/shaman/enhancement': {
    title: "포에버 고양 주술사 특성 가이드 | wowmeta",
    description: "근접 무기로 퀘스트를 진행하는 기본 추천입니다. 현재 무기의 품질을 확인하며 성장하세요.",
  },
  '/forever/classes/shaman/restoration': {
    title: "포에버 복원 주술사 특성 가이드 | wowmeta",
    description: "던전에서 회복을 맡는 경로입니다. 퀘스트를 혼자 진행하는 시간도 많다면 고양과 비교하세요.",
  },
  '/forever/classes/mage/arcane': {
    title: "포에버 비전 마법사 특성 가이드 | wowmeta",
    description: "주문을 묶어서 쓰는 운용을 익히고 싶은 경우의 선택입니다. 긴 전투에서 자원이 충분한지 먼저 살피세요.",
  },
  '/forever/classes/mage/fire': {
    title: "포에버 화염 마법사 특성 가이드 | wowmeta",
    description: "화염 주문 중심으로 성장하려는 선택입니다. 적과 거리를 유지할 수 있는 사냥터에서 시작하세요.",
  },
  '/forever/classes/mage/frost': {
    title: "포에버 냉기 마법사 특성 가이드 | wowmeta",
    description: "처음 혼자 퀘스트를 할 때의 기본 추천입니다. 여러 적을 모으는 사냥은 지형과 적의 종류를 익힌 뒤 시도하세요.",
  },
  '/forever/classes/warlock/affliction': {
    title: "포에버 고통 흑마법사 특성 가이드 | wowmeta",
    description: "지속 피해를 중심으로 혼자 퀘스트를 진행하는 기본 추천입니다. 무리하게 여러 적을 끌어오지 말고 자원 회복 흐름부터 익히세요.",
  },
  '/forever/classes/warlock/demonology': {
    title: "포에버 악마 흑마법사 특성 가이드 | wowmeta",
    description: "소환수와 함께 안정적인 전투를 준비하는 경로입니다. 소환수의 상태를 계속 살피는 플레이에 맞습니다.",
  },
  '/forever/classes/warlock/destruction': {
    title: "포에버 파괴 흑마법사 특성 가이드 | wowmeta",
    description: "직접 시전하는 화염 주문을 중심으로 성장하는 선택입니다. 안전하게 시전할 거리와 자원 준비가 필요합니다.",
  },
  '/forever/classes/druid/balance': {
    title: "포에버 조화 드루이드 특성 가이드 | wowmeta",
    description: "원거리 주문 중심으로 성장하는 경로입니다. 주문용 장비와 마나 준비를 전제로 선택하세요.",
  },
  '/forever/classes/druid/feral': {
    title: "포에버 야성 드루이드 특성 가이드 | wowmeta",
    description: "표범으로 혼자 사냥하고 곰으로 던전 탱커도 맡는 기본 추천입니다. 포에버의 야성 분야 안에서 두 역할을 함께 준비합니다.",
  },
  '/forever/classes/druid/restoration': {
    title: "포에버 복원 드루이드 특성 가이드 | wowmeta",
    description: "던전 회복 담당자로 성장하는 선택입니다. 혼자 퀘스트를 오래 할 계획이라면 야성 경로와 비교하세요.",
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
