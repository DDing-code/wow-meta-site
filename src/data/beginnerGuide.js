// 특정 시즌의 아이템 추천이나 주문 툴팁 대신, 본 서버에서 쓰는 공통 개념을 설명한다.
// 글은 적게, 그림은 많이(2026-10-20 사용자 원칙): 설명·팁은 한두 줄, 카드마다 그림(icon: lucide 이름, group: 소모품 묶음의 게임 아이콘)을 둔다.
import crafting from './beginnerCrafting.json';

export const beginnerEmbellishments = crafting.catalog;
export const beginnerCraftingScreens = crafting.screens;

// KB에서 오는 주문제작 열 단계의 그림. 단계 번호 → lucide 아이콘 이름.
export const craftingStepIcons = { '01': 'Shirt', '02': 'Sparkle', '03': 'MessageCircleQuestion', '04': 'Package', '05': 'PenLine', '06': 'Star', '07': 'Send', '08': 'Mail', '09': 'RefreshCw', '10': 'Replace' };

export const beginnerSections = [
  {
    id: 'basics', title: '처음 알아둘 것', intro: '내가 어떤 역할로 싸우는지부터.',
    entries: [
      { term: '직업 · 전문화 · 특성', aliases: '클래스 스펙 빌드 영웅 특성', icon: 'Layers', description: '직업 → 전문화 → 특성 순서로 내 전투 방식이 정해집니다.', tip: '전문화가 다르면 역할과 스킬도 다릅니다.' },
      { term: '탱커', aliases: '탱 방어 담당', icon: 'Shield', description: '적의 공격을 받아 내고 앞장서서 전투를 시작합니다.', tip: '탱커가 모은 적을 함께 칩니다.' },
      { term: '힐러', aliases: '힐 치유 담당', icon: 'HeartPulse', description: '아군의 생명력을 회복하고 위험한 상태를 돌봅니다.', tip: '힐러가 있어도 피할 공격은 직접 피합니다.' },
      { term: '딜러', aliases: '딜 공격 담당 DPS', icon: 'Swords', description: '적에게 피해를 줍니다. 근접과 원거리가 있습니다.', tip: '차단·기믹 처리·생존도 함께 맡습니다.' },
      { term: '단축키 · 행동 단축바', aliases: '키 설정 키바인딩 UI 인터페이스', icon: 'Keyboard', description: '자주 쓰는 스킬과 물품을 단축바에 놓고 키를 정합니다.', tip: '차단·생존기·물약도 손이 닿는 자리에 둡니다.' },
      { term: '애드온 · 매크로', aliases: 'addon 부가 기능', icon: 'Puzzle', description: '애드온은 화면을 돕는 추가 프로그램, 매크로는 명령 묶음입니다.', tip: '처음에는 기본 화면으로 익혀도 됩니다.' },
    ],
  },
  {
    id: 'combat', title: '전투에서 쓰는 말', intro: '파티 채팅에서 자주 보는 말.',
    entries: [
      { term: '네임드 · 쫄', aliases: '보스 잡몹 추가 적', icon: 'Skull', description: '네임드는 주요 적, 쫄은 일반 적이나 추가로 나오는 적입니다.', tip: '“쫄 먼저”는 추가된 적부터 잡자는 뜻입니다.' },
      { term: '어그로 · 풀링', aliases: '위협 수준 풀 애드', icon: 'Magnet', description: '어그로는 적이 노리는 대상, 풀링은 전투 시작입니다.', tip: '탱커가 시작할 때까지 기다리면 안전합니다.' },
      { term: '단일 · 광역 · 점사', aliases: '단일딜 광딜 AoE 타깃 대상', icon: 'Crosshair', description: '단일은 적 하나, 광역은 여럿, 점사는 한 적에 공격 모으기입니다.', tip: '위험한 적부터 점사할 때가 있습니다.' },
      { term: '딜사이클 · 오프닝', aliases: '로테이션 오프너 우선순위', icon: 'Repeat', description: '딜사이클은 스킬을 쓰는 흐름, 오프닝은 시작 직후의 순서입니다.', tip: '왜 그 스킬인지 알면 상황이 바뀌어도 대응합니다.' },
      { term: '쿨타임 · 쿨기', aliases: '쿨 재사용 대기시간 쿨다운 CD', icon: 'Hourglass', description: '쿨타임은 다시 쓰기까지 기다리는 시간, 쿨기는 그런 강한 스킬입니다.', tip: '“쿨기 써 주세요”는 강한 스킬을 쓰라는 뜻입니다.' },
      { term: '글쿨', aliases: '전역 재사용 대기시간 GCD 글로벌 쿨다운', icon: 'Timer', description: '스킬 하나를 쓰면 다른 스킬도 잠깐 함께 기다리는 공통 시간입니다.', tip: '모든 스킬이 글쿨을 일으키지는 않습니다.' },
      { term: '버프 · 디버프 · 중첩', aliases: '강화 효과 약화 효과 스택', icon: 'Sparkles', description: '버프는 이로운 효과, 디버프는 해로운 효과, 중첩은 쌓인 겹수입니다.', tip: '남은 시간과 겹수를 함께 봅니다.' },
      { term: '발동 · 유지', aliases: '프록 proc 업타임', icon: 'Zap', description: '발동은 조건·확률로 생기는 효과, 유지는 효과가 끊기지 않게 하기입니다.', tip: '빛나는 스킬은 무엇이 발동했는지 보고 누릅니다.' },
      { term: '차단 · 군중 제어', aliases: '인터럽트 interrupt CC 스턴 기절', icon: 'Ban', description: '차단은 적의 시전 끊기, 군중 제어는 기절·메즈 등으로 행동 막기입니다.', tip: '던전에서 먼저 끊을 주문부터 익힙니다.' },
      { term: '메즈', aliases: 'mez 메즈기 CC 묶기 재우기 장시간 군중 제어 징표', icon: 'Lock', description: '적 하나를 오래 묶어 두는 군중 제어입니다. 대부분 피해를 받으면 풀립니다.', tip: '징표로 묶을 적을 정하고, 묶인 적은 치지 않습니다.' },
      { term: '해제', aliases: '디스펠 dispel 정화', icon: 'Eraser', description: '아군의 해로운 효과나 적의 이로운 효과를 없앱니다.', tip: '해제하면 터지는 기믹도 있으니 공략을 봅니다.' },
      { term: '생존기 · 외생기', aliases: '방어기 뎀감 피해 감소', icon: 'ShieldPlus', description: '생존기는 나를 지키는 스킬, 외생기는 아군이 나를 지켜 주는 스킬입니다.', tip: '큰 피해 전에 미리 쓰는 스킬도 있습니다.' },
      { term: '기믹 · 바닥 · 무빙', aliases: '공략 패턴 장판 이동', icon: 'Footprints', description: '기믹은 전투 규칙, 바닥은 지면 효과, 무빙은 피하거나 자리 잡기입니다.', tip: '들어가야 하는 바닥도 있습니다. 공략에서 구분합니다.' },
      { term: '전멸 · 트라이', aliases: '와이프 wipe 리트 재도전', icon: 'RotateCcw', description: '전멸은 파티가 다 쓰러진 상태, 트라이는 한 번의 도전입니다.', tip: '실패 원인을 한 가지씩 바꿔 봅니다.' },
      { term: '전투 부활', aliases: '전부 배틀 레즈 brez', icon: 'HeartHandshake', description: '전투 중 쓰러진 아군을 되살립니다. 직업·횟수 제한이 있습니다.', tip: '주변이 위험하면 바로 수락하지 않습니다.' },
      { term: 'DPS · HPS · 로그', aliases: '디피에스 초당 피해량 초당 치유량 전투 기록 미터기', icon: 'BarChart3', description: 'DPS는 초당 피해, HPS는 초당 치유, 로그는 전투 기록입니다.', tip: '숫자 하나로 잘했는지 판단하지 않습니다.' },
    ],
  },
  {
    id: 'content', title: '던전과 공격대', intro: '혼자서부터 공격대까지.',
    entries: [
      { term: '퀘스트 · 전역 퀘스트', aliases: '캠페인 대장정 일일 퀘스트 주간 퀘스트', icon: 'ScrollText', description: '퀘스트는 받은 목표 수행, 전역 퀘스트는 지도의 시간제한 목표입니다.', tip: '일일·주간 갱신 시간은 게임 안에서 확인합니다.' },
      { term: '던전 · 추종자 던전', aliases: '인던 일반 영웅 신화 0단 깡신', icon: 'DoorOpen', description: '던전은 5명이 함께, 추종자 던전은 NPC 동료와 익히는 곳입니다.', tip: '난이도와 입장 조건을 보고 신청합니다.' },
      { term: '쐐기', aliases: '신화+ 신화 플러스 M+ 신화 쐐기돌 단수 시클', icon: 'KeyRound', description: '신화 쐐기돌로 도전하는 단계별 던전. 시간 안에 완료가 목표입니다.', tip: '“시클”은 시간 안에 완료했다는 뜻입니다.' },
      { term: '공격대', aliases: '레이드 공대 공대장 공찾 공격대 찾기', icon: 'Castle', description: '큰 인원이 함께 네임드를 잡습니다. 난이도마다 인원 규칙이 다릅니다.', tip: '처음이면 모집 글을 읽고 미리 알립니다.' },
      { term: '구렁', aliases: 'delve 혼자 솔로 동료', icon: 'Compass', description: '혼자나 소규모로 가는 모험. 단계에 따라 난이도·보상이 다릅니다.', tip: '익숙하지 않으면 낮은 단계부터 갑니다.' },
      { term: '파티 찾기 · 파티 구성하기', aliases: '파찾 모집 신청 초대 던전 찾기', icon: 'UsersRound', description: '찾기는 자동 연결, 파티 구성은 모집 글을 보고 직접 신청입니다.', tip: '“학원·연습·완료” 같은 모집 목적을 확인합니다.' },
      { term: 'PvE · PvP', aliases: '플레이어 간 전투 전장 투기장', icon: 'Flag', description: 'PvE는 몬스터 상대, PvP는 플레이어 상대. 특성·장비가 달라집니다.', tip: '가이드가 어떤 콘텐츠 기준인지 확인합니다.' },
    ],
  },
  {
    id: 'equipment', title: '장비와 성장', intro: '새 장비를 얻었을 때 볼 것.',
    entries: [
      { term: '아이템 레벨', aliases: '템렙 ilvl 장비 수준', icon: 'Gauge', description: '장비 성능의 기준 숫자. 캐릭터 창에서 평균을 봅니다.', tip: '숫자만 보지 말고 내 전문화 능력치인지도 봅니다.' },
      { term: '주 능력치 · 보조 능력치', aliases: '힘 민첩 지능 치명타 가속 특화 유연', icon: 'ChartNoAxesColumn', description: '주 능력치는 힘·민첩·지능, 보조는 치명타·가속·특화·유연성입니다.', tip: '보조 능력치 우선순위는 전문화마다 다릅니다.' },
      { term: '장비 업그레이드 · 문장', aliases: '강화 재화 트랙 업글', icon: 'ArrowUpCircle', description: '업그레이드 NPC에게 재화를 내고 아이템 레벨을 올립니다.', tip: '강화 창에서 비용과 상한을 보고 정합니다.' },
      { term: '티어 세트', aliases: '세트템 2세트 4세트 세트 효과', icon: 'Shirt', description: '세트 장비를 여러 부위 끼면 추가 효과를 받습니다.', tip: '새 장비로 세트 효과가 끊기는지 확인합니다.' },
      { term: '위대한 금고', aliases: '주간 보상 금고 주간 숙제', icon: 'Vault', description: '한 주 조건을 채우면 주간 갱신 뒤 보상 하나를 고릅니다.', tip: '칸마다 하나씩 다 받는 것은 아닙니다.' },
      { term: '전문 기술 · 주문 제작', aliases: '제작 의뢰 채집 재제작', icon: 'Hammer', description: '전문 기술은 재료 모으기·만들기, 주문 제작은 제작자에게 의뢰입니다.', tip: '의뢰 전 품질·능력치·재료를 제작자와 확인합니다.' },
      { term: '마법부여 · 보석', aliases: '마부 홈 소켓 인챈트', icon: 'Gem', description: '마법부여는 장비 부위에 바르고, 보석은 보석 홈에 끼웁니다.', tip: '금방 바꿀 장비면 비용부터 비교합니다.' },
      { term: '귀속 · 경매장', aliases: '착귀 획귀 전투부대 골드 거래', icon: 'Coins', description: '귀속은 옮기거나 팔 수 있는지, 경매장은 골드 거래소입니다.', tip: '단가·수량·사용 레벨·귀속을 확인합니다.' },
    ],
  },
  {
    id: 'consumables', title: '소모품 · 보석 · 마법부여', intro: '영약은 오래, 물약은 순간, 음식은 전투 사이.',
    note: '실제 살 물품은 내 전문화 가이드에서. 지속시간·대기시간은 아이템 설명이 기준입니다.',
    entries: [
      { term: '영약', aliases: '플라스크 flask 약병', when: '던전·공격대 시작 전', group: 'flasks', description: '오래 유지하는 능력치 보완. 여러 전투에 걸쳐 씁니다.', tip: '옛 확장팩 약병과 혼동하지 않습니다.' },
      { term: '전투 물약', aliases: '공격 물약 딜 물약 포션 potion', when: '큰 효과가 필요한 순간', group: 'combat-potions', description: '짧은 시간 전투 성능을 높입니다. 쿨기와 함께 씁니다.', tip: '다른 물약과 대기시간을 공유하는지 확인합니다.' },
      { term: '회복 물약', aliases: '치유 물약 생명력 물약 힐 물약 체력 마나 물약', when: '회복이 급할 때', group: 'recovery-potions', description: '생명력이나 마나를 급히 회복합니다.', tip: '생명력용과 마나용을 구별합니다.' },
      { term: '음식 · 잔칫상', aliases: '요리 포만감 식사 밥', when: '전투 전 · 전투 사이', group: 'primary-feasts', description: '강화 음식은 능력치 효과, 잔칫상은 여러 사람이 함께 먹습니다.', tip: '먹은 뒤 효과가 떴는지 확인. 죽으면 다시 먹습니다.' },
      { term: '룬 · 무기 강화 소모품', aliases: '증강 룬 기름 숫돌 무게추 임시 강화', when: '필요한 콘텐츠에 맞춰', group: 'runes-oils', description: '룬·무기 기름 같은 보조 소모품. 시즌마다 조합이 다릅니다.', tip: '다 살 필요는 없습니다. 가이드의 준비물만.' },
      { term: '마법부여 고르기 · 다시 바르기', aliases: '인챈트 enchant 실타래 강화도구 조준경 다리 반지 무기', when: '새 장비를 얻었을 때', group: 'enchants-weapon', description: '한 부위에 하나. 장비를 바꾸면 새 장비에 다시 바릅니다.', tip: '같은 이름도 품질 단계에 따라 수치가 다릅니다.' },
      { term: '소모품 품질 · 사용 조건', aliases: '등급 별 랭크 가격 레벨', when: '경매장에서 사기 전', icon: 'BadgeCheck', description: '같은 이름도 품질·확장팩에 따라 효과가 다릅니다.', tip: '사용 레벨·효과·수량·가격을 확인합니다.' },
    ],
  },
  {
    ...crafting.section,
  },
  {
    id: 'ready', title: '첫 파티에 가기 전', intro: '다섯 가지만 먼저.',
    entries: [
      { term: '01 · 역할과 난이도 확인', icon: 'Users', description: '내 전문화의 역할을 확인하고 낮은 난이도부터 갑니다.', tip: '“처음입니다”라고 말해도 괜찮습니다.' },
      { term: '02 · 장비 수리와 가방 정리', icon: 'Wrench', description: '장비를 수리하고 가방 공간을 비웁니다.', tip: '내구도를 확인합니다.' },
      { term: '03 · 스킬과 준비물 배치', icon: 'Backpack', description: '차단·생존기·물약 위치를 확인하고 영약·음식을 챙깁니다.', tip: '쓸 물품은 단축바에 올립니다.' },
      { term: '04 · 네임드 공략 한 가지씩', icon: 'BookOpen', description: '피할 공격, 끊을 시전, 내가 맡을 일을 먼저 봅니다.', tip: '순서보다 살아서 기믹을 처리합니다.' },
      { term: '05 · 시작 신호와 동료 상태 확인', icon: 'Hand', description: '탱커가 시작할 때까지 기다리고 준비 확인에 답합니다.', tip: '자리를 비우면 먼저 채팅에 알립니다.' },
    ],
  },
];

// 영역마다 글 앞에 두는 '한눈에 보기' 그림의 자료. terms는 위 beginnerSections의 term과 글자까지 같아야 한다(검사: BeginnerPage.test.js).
export const beginnerMaps = {
  basics: {
    structure: {
      className: '직업', classExample: '예: 전사',
      specs: [{ name: '무기' }, { name: '분노' }, { name: '방어', picked: true }],
      inside: ['특성', '영웅 특성'],
      caption: '직업 → 전문화 → 특성. 가이드는 전문화마다 있습니다.',
      term: '직업 · 전문화 · 특성',
    },
    roles: [
      { id: 'tank', name: '탱커', job: '적을 붙잡고 앞장선다', term: '탱커' },
      { id: 'healer', name: '힐러', job: '아군을 회복하고 돌본다', term: '힐러' },
      { id: 'dps', name: '딜러', job: '적에게 피해를 준다', term: '딜러' },
    ],
    party: { title: '5인 파티', slots: ['tank', 'healer', 'dps', 'dps', 'dps'], caption: '탱커 1 · 힐러 1 · 딜러 3. 공격대는 인원만 늘어납니다.' },
  },
  combat: {
    stages: [
      { title: '풀링', text: '탱커가 전투를 시작합니다', terms: ['어그로 · 풀링', '네임드 · 쫄'] },
      { title: '오프닝', text: '시작 직후 정해진 순서', terms: ['딜사이클 · 오프닝', '쿨타임 · 쿨기', '글쿨'] },
      { title: '딜사이클', text: '상황에 맞춰 반복', terms: ['단일 · 광역 · 점사', '버프 · 디버프 · 중첩', '발동 · 유지'] },
      { title: '위기 대처', text: '기믹에 맞춰 반응', terms: ['차단 · 군중 제어', '메즈', '해제', '생존기 · 외생기', '기믹 · 바닥 · 무빙', '전투 부활'] },
      { title: '처치 또는 전멸', text: '기록을 보고 다시', terms: ['전멸 · 트라이', 'DPS · HPS · 로그'] },
    ],
    clock: {
      title: '12초 동안 일어나는 일',
      slots: 8,
      rows: [
        { label: '쿨기', span: 1, tail: '2분 뒤에 다시', term: '쿨타임 · 쿨기' },
        { label: '버프 유지', span: 5, tail: '끊기기 전에 다시', term: '발동 · 유지' },
      ],
      slotLabel: '글쿨 1.5초씩 · 한 칸에 스킬 하나',
      slotTerm: '글쿨',
    },
  },
  content: {
    ladder: [
      { name: '퀘스트', people: '혼자', note: '이야기와 기본 조작', term: '퀘스트 · 전역 퀘스트' },
      { name: '구렁', people: '1~5명', note: '단계별 난이도', term: '구렁' },
      { name: '던전', people: '5명', note: '일반 · 영웅 · 신화', term: '던전 · 추종자 던전' },
      { name: '쐐기', people: '5명', note: '시간 제한 · 단계', term: '쐐기' },
      { name: '공격대', people: '10~30명', note: '공격대 찾기 · 일반 · 영웅 · 신화', term: '공격대' },
    ],
    caption: '오른쪽으로 갈수록 맞출 사람이 늘어납니다. PvP는 별도의 길입니다.',
    sideTerms: ['파티 찾기 · 파티 구성하기', 'PvE · PvP'],
  },
  equipment: {
    title: '장비 설명(툴팁)에서 보는 곳',
    note: '예시 장비입니다. 이름·수치는 임의입니다.',
    callouts: [
      { n: 1, label: '아이템 레벨', term: '아이템 레벨' },
      { n: 2, label: '강화 단계와 계열', term: '장비 업그레이드 · 문장' },
      { n: 3, label: '귀속 조건', term: '귀속 · 경매장' },
      { n: 4, label: '주 능력치', term: '주 능력치 · 보조 능력치' },
      { n: 5, label: '보조 능력치', term: '주 능력치 · 보조 능력치' },
      { n: 6, label: '보석 홈 · 마법부여', term: '마법부여 · 보석' },
      { n: 7, label: '세트 효과', term: '티어 세트' },
    ],
    extraTerms: ['위대한 금고', '전문 기술 · 주문 제작'],
  },
  consumables: {
    timeline: [
      { when: '출발 전', text: '오래 가는 준비. 보석·마법부여는 미리.', terms: ['영약', '룬 · 무기 강화 소모품', '마법부여 고르기 · 다시 바르기'], groups: ['flasks', 'runes-oils', 'enchants-weapon', 'gems-peridot'] },
      { when: '전투 직전', text: '먹고 효과가 떴는지 확인.', terms: ['음식 · 잔칫상'], groups: ['primary-feasts', 'secondary-food'] },
      { when: '전투 중', text: '전투 물약은 쿨기와, 회복 물약은 급할 때.', terms: ['전투 물약', '회복 물약'], groups: ['combat-potions', 'recovery-potions'] },
      { when: '전투 사이', text: '죽었으면 다시 먹고 영약 시간 확인.', terms: ['음식 · 잔칫상', '소모품 품질 · 사용 조건'], groups: ['drinks', 'primary-food'] },
    ],
  },
  crafting: {
    phases: [
      { title: '정하기', steps: ['01', '02', '03'] },
      { title: '재료 준비', steps: ['04', '05', '06'] },
      { title: '주문 보내기', steps: ['07', '08'] },
      { title: '나중에 바꾸기', steps: ['09', '10'] },
    ],
  },
  ready: { title: '출발 준비', caption: '누르며 확인하세요. 표시는 이 화면에서만 남습니다.' },
};

export const beginnerSources = [
  ...crafting.sources,
  { title: '직업과 역할', href: 'https://worldofwarcraft.blizzard.com/ko-kr/game/classes', detail: '블리자드 직업 안내' },
  { title: '추종자 던전', href: 'https://worldofwarcraft.blizzard.com/ko-kr/news/24054790/', detail: 'NPC 동료와 던전 익히기' },
  { title: '구렁의 기본 개념', href: 'https://worldofwarcraft.blizzard.com/ko-kr/news/24025828/', detail: '블리자드 시스템 소개 · 2023년' },
  { title: '제작과 소모품 품질의 기본 개념', href: 'https://worldofwarcraft.blizzard.com/ko-kr/news/23876529/', detail: '블리자드 시스템 소개 · 2022년' },
];
