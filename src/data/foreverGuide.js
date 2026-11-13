// 포에버(월드 오브 워크래프트: 포에버) 안내 페이지의 글. 화면은 src/pages/ForeverPage.js가 그린다.
// 공식 사실은 블리자드 한국어 공지, 추천 경로는 실제 확인한 포에버 전용 가이드를 근거로 항목마다 sources를 단다.
// 리테일 KB·kb-skills.json과 섞지 않는다(리테일 KB는 주문 번호 하나로 색인해서 포에버 자료가 들어가면 서로 덮어쓴다).
// 검사: npm run validate:forever (scripts/validate-forever-guide.cjs), src/pages/ForeverPage.test.js

export const FOREVER_NAME = '월드 오브 워크래프트: 포에버';
export const FOREVER_CHECKED_AT = '2026-11-14';

// 그림(art): 블리자드 공식 아트·공지 스크린샷을 바탕으로 도트로 다시 그린 것. 파일은 public/images/forever/<id>-<폭>.webp
// (kind 'hero' 768·1536, 'square' 512·1024, 나머지 640·1280). focus는 잘라 보일 때 남길 자리(object-position).
// 만드는 도구: artifacts/forever-art-20261114/gen.py(그림 생성) → build.py(사이트용 변환). 검사가 파일과 alt를 확인한다.
export const FOREVER_ART_NOTE = '그림은 블리자드 공식 아트와 공지 스크린샷을 바탕으로 도트로 다시 그린 것이며, 실제 게임 화면과 다릅니다.';

export const foreverSources = {
  launch: {
    label: '월드 오브 워크래프트: 포에버가 출시되었습니다!',
    date: '2026-11-05',
    url: 'https://worldofwarcraft.blizzard.com/ko-kr/news/24315820',
  },
  compare: {
    label: 'WoW: 포에버 - 새로운 것과 익숙한 것',
    date: '2026-11-04',
    url: 'https://worldofwarcraft.blizzard.com/ko-kr/news/24315821',
  },
  newPlayer: {
    label: '신규 플레이어 입문 안내서',
    date: '2026-10-29',
    url: 'https://worldofwarcraft.blizzard.com/ko-kr/news/24315280',
  },
  rules: {
    label: '월드 오브 워크래프트: 포에버에서 나만의 규칙을 선택하세요',
    date: '2026-09-22',
    url: 'https://worldofwarcraft.blizzard.com/ko-kr/news/24302070',
  },
  raids: {
    label: '월드 오브 워크래프트: 포에버 공격대 개요',
    url: 'https://news.blizzard.com/ko-kr/article/24303009/',
  },
  access: {
    label: '월드 오브 워크래프트: 포에버 업그레이드 안내',
    url: 'https://news.blizzard.com/ko-kr/article/24301508/',
  },
  dungeons: {
    label: '월드 오브 워크래프트: 포에버의 새로운 던전들을 탐험하세요',
    date: '2026-10-21',
    url: 'https://worldofwarcraft.blizzard.com/ko-kr/news/24301455',
  },
  camping: {
    label: '월드 오브 워크래프트: 포에버에서 모닥불 주위에 둘러앉으세요',
    date: '2026-10-22',
    url: 'https://worldofwarcraft.blizzard.com/ko-kr/news/24301516',
  },
  legacy: {
    label: '월드 오브 워크래프트: 포에버의 유산 시스템 소개',
    date: '2026-09-24',
    url: 'https://worldofwarcraft.blizzard.com/ko-kr/news/24307383',
  },
};

export const foreverPages = [
  { id: 'home', path: '/forever', label: '포에버 홈' },
  { id: 'start', path: '/forever/start', label: '시작하기' },
  { id: 'rules', path: '/forever/rules', label: '규칙·진영' },
  { id: 'leveling', path: '/forever/leveling', label: '지역·던전' },
  { id: 'growth', path: '/forever/growth', label: '캠핑·유산' },
  { id: 'classes', path: '/forever/classes', label: '직업 선택' },
  { id: 'raids', path: '/forever/raids', label: '레이드 준비' },
];

// 입장 준비와 육성 안내. 레벨 범위는 공식 소개의 범위이며 최소 입장 레벨이나 최단 육성 동선이 아니다.
export const foreverGuides = {
  leveling: {
    title: '포에버 지역·던전 길잡이',
    lead: '내 레벨에 맞는 새 지역과 5인 던전을 찾아보세요. 아래 레벨은 공식 소개의 콘텐츠 범위입니다. 기존 지역·던전 전체 목록이나 최단 육성 동선은 아닙니다.',
    art: { id: 'diff-zones', alt: '안개 낀 깊은 숲속 마을을 도트로 다시 그린 그림' },
    sections: [
      {
        id: 'zones', title: '새 지역에서 이어 가는 1~60레벨',
        lead: '동부 왕국과 칼림도어에 새 퀘스트 1,000여 개가 더해졌습니다. 출발지는 종족에 따라 다릅니다.',
        items: [
          { title: '1~12레벨 · 제프라스 섬', body: '스카이본의 시작 지역입니다. 호드·얼라이언스 어느 쪽 스카이본이든 여기서 출발하며, 이 종족을 고르려면 영웅 꾸러미 이상의 업그레이드가 필요합니다.' },
          { title: '30레벨 중반~40레벨 중반 · 강물터', body: '강과 초원, 교역로가 이어지는 지역으로, 새 퀘스트 150개 이상이 있습니다. 40~45레벨용 크롤도크 보루도 이곳에 있습니다.' },
          { title: '하이잘 산', body: '아키몬드가 패배한 이후의 땅과 검은속삭임 협곡을 탐험합니다. 60레벨 레이드인 하이잘 정상과 지하 심굴로 이어지지만, 야외 지역 전체의 레벨 범위는 출시 공지에 따로 적혀 있지 않습니다.' },
          { title: '셴드랄라스', body: '멀고어와 잊혀진 땅 사이에서 셴드랄라·엘드레탈라스·혈투의 전장·켄타우로스 부족의 이야기를 만납니다. 출시 공지는 이 지역의 레벨 범위를 따로 제시하지 않습니다.' },
        ],
        sources: ['launch', 'newPlayer', 'dungeons'],
      },
      {
        id: 'dungeons', title: '새 5인 던전 아홉 곳',
        art: { id: 'basic-dungeon', kind: 'square', focus: '50% 36%', alt: '던전 입구 앞에서 출발을 준비하는 다섯 명의 모험가' },
        lead: '보통 탱커 한 명·힐러 한 명·딜러 세 명이 함께합니다. 영주의 전당과 로데론의 폐허는 상대 진영 영토를 지나야 할 수 있으니, 출발 전에 입구까지 가는 길도 확인하세요.',
        table: {
          columns: ['던전 · 레벨', '위치', '출발 전에 확인'],
          rows: [
            ['영주의 전당 · 13~18', '동부 왕국 · 던 모로, 아이언포지 아래', '호드는 얼라이언스 영토를 가로질러 이동합니다.'],
            ['로데론의 폐허 · 15~20', '동부 왕국 · 티리스팔 숲, 언더시티 위 폐허', '얼라이언스는 호드 영토로 들어가야 합니다.'],
            ['발굴 현장 · 24~29', '동부 왕국 · 저습지, 웰가르의 발굴현장 위', '텔겐 바위굴·던 알가즈 근처에서 찾아갑니다.'],
            ['달라란 · 28~33', '동부 왕국 · 알터랙 산맥', '진영별 입장 연계 퀘스트를 먼저 시작합니다.'],
            ['가라앉은 도시 · 35~40', '동부 왕국 · 가시덤불 골짜기 앞바다, 그롬골 서쪽', '물속으로 들어가 입구를 찾는 던전입니다.'],
            ['크롤도크 보루 · 40~45', '동부 왕국 · 강물터', '강물터 퀘스트를 진행하면서 파티 일정을 잡아 보세요.'],
            ['알카즈 감옥 · 48~53', '칼림도어 · 먼지진흙 습지대, 알카즈 섬', '섬까지 이동하는 시간을 잡아 두세요.'],
            ['검은아귀 요새 · 55~60', '칼림도어 · 아즈샤라', '여러 경로가 있는 고레벨 던전입니다. 지하 심굴로 이어지는 길도 있습니다.'],
            ['구체자의 정원 · 58~60', '칼림도어 · 운고로 분화구 북쪽 언덕', '운고로에서 모은 마력의 수정을 내부 제어장치에 사용합니다.'],
          ],
        },
        sources: ['dungeons', 'newPlayer'],
      },
      {
        id: 'dalaran', title: '달라란은 입장 퀘스트부터',
        items: [
          { title: '얼라이언스 · 사우스쇼어', body: '사절 자크에게서 「다급한 요청」을 받아 연계 퀘스트를 시작합니다.' },
          { title: '호드 · 타렌 밀농장', body: '학자 워딘 보이드글레어에게서 「도시로 통하는 열쇠」와 「감옥 습격」을 받아 시작합니다.' },
          { title: '퀘스트를 마친 뒤 하수도로', body: '키린 토의 신뢰를 얻은 뒤 하수도를 통해 도시로 들어갑니다. 파티를 모으기 전에 각자의 진행 상황을 맞춰 두세요.' },
        ],
        sources: ['dungeons'],
      },
      {
        id: 'journey', title: '마을을 떠날 때 네 가지',
        art: { id: 'tips-flight', focus: '50% 40%', alt: '언덕 위 비행 조련사와 그리핀, 멀리 날아가는 또 한 마리' },
        items: [
          { title: '상급자 · 새 능력 배우기', body: '레벨이 오르면 직업 상급자에게 들르고, 마법책(P)에서 배운 능력을 확인해 단축바에 놓습니다.' },
          { title: '수리 · 가방 · 회복 음식', body: '모루 표시가 있는 상인에게 수리하고, 필요 없는 물건을 팔아 가방 공간을 비웁니다. 음식과 음료로 전투 사이에 회복하세요.' },
          { title: '귀환석 · 비행 경로', body: '여관에서 귀환 장소를 정하고, 비행 조련사를 만나 경로를 배워 둡니다.' },
          { title: '파티 · 퀘스트 진행', body: '규칙과 진영이 맞는 동료를 모으고, 퀘스트 목록(L)의 목표를 비교하세요. 어려운 퀘스트는 도움을 구해 함께 진행할 수 있습니다.' },
        ],
        sources: ['newPlayer', 'rules'],
      },
    ],
  },
  growth: {
    title: '포에버 캠핑·유산 성장',
    lead: '캠핑은 다음 전투를 준비하는 휴식이고, 유산은 계정이 함께 쌓는 성장입니다. 설비를 놓는 조건과 점수를 얻고 투자하는 순서부터 정리했습니다.',
    art: { id: 'diff-camping', alt: '천막 옆에 모닥불을 피운 숲속 캠프를 도트로 다시 그린 그림' },
    sections: [
      {
        id: 'camping', title: '모닥불 → 설비 → 1분 쉬기',
        items: [
          { title: '1 · 요리로 작은 모닥불 피우기', body: '요리 기술 1부터 작은 모닥불을 만들 수 있습니다. 모닥불이 캠프 거점이 되고, 설비를 쓸 때도 곁에 모닥불이 있어야 합니다.' },
          { title: '2 · 한 사람에 설비 하나씩 놓기', body: '작은 모닥불에는 최대 세 개를 놓습니다. 설비는 전문 기술로 만들며, 모든 캠핑 설비가 1시간의 재사용 대기시간을 공유합니다. 나중에 배우는 향상된 모닥불은 다섯·열 개까지 놓을 수 있습니다.' },
          { title: '3 · 주위에서 1분 동안 앉거나 제작하기', body: '조건을 채우면 설비의 이로운 효과를 받습니다. 해당 직업이 주는 같은 계열의 강화 효과와는 함께 적용되지 않는 설비가 있으니, 중복으로 더 강해진다고 생각하지 마세요.' },
          { title: '4 · 안전한 곳에서 쉬기', body: '캠프에서도 주변의 위험은 남아 있습니다. PvP 규칙에서는 상대 진영 플레이어도 살펴야 합니다.' },
        ],
        sources: ['camping'],
      },
      {
        id: 'facilities', title: '첫 캠핑 설비 고르기',
        lead: '아래는 공식 소개의 첫 설비입니다. 요리용 모닥불을 제외한 표의 설비는 기술 레벨 20부터 배우며, 시작 지역 퀘스트나 기술 전문가를 통해 제작법을 얻습니다. 효과 수치는 레벨에 따라 달라질 수 있습니다.',
        table: {
          columns: ['전문 기술', '첫 설비', '용도·주의점'],
          rows: [
            ['응급치료', '응급치료 도구', '체력 강화 · 같은 계열 직업 강화 효과와 중복 불가'],
            ['낚시', '낚시 그릇', '능력치 8% 강화 · 같은 계열 직업 강화 효과와 중복 불가'],
            ['연금술', '마나 우물', '주기적인 마나 회복 · 같은 계열 직업 강화 효과와 중복 불가'],
            ['대장기술', '연마 바퀴', '힘 강화 · 같은 계열 직업 강화 효과와 중복 불가'],
            ['마법부여', '마력 깃든 류트', '방어도·능력치·저항력 강화 · 같은 계열 직업 강화 효과와 중복 불가'],
            ['기계공학', '재료 로봇', '주변 플레이어가 재료를 살 수 있는 편의 설비'],
            ['약초채집', '향기 나는 양초', '지능 강화 · 같은 계열 직업 강화 효과와 중복 불가'],
            ['가죽세공', '캠핑 텐트', '휴식 경험치를 현재 레벨의 5%까지 · 이미 넘었다면 효과 없음'],
            ['무두질', '캠핑 의자', '치명타·극대화율 2% 강화 · 같은 계열 직업 강화 효과와 중복 불가'],
            ['재봉술', '진영 깃발', '같은 진영 플레이어의 정신력 강화 · 같은 계열 직업 강화 효과와 중복 불가'],
          ],
        },
        sources: ['camping'],
      },
      {
        id: 'professions', title: '전문 기술을 함께 키우려면',
        items: [
          { title: '주 전문 기술은 두 개', body: '채집·제작 기술 가운데 두 개를 고릅니다. 요리·낚시·응급치료는 보조 기술이라 세 개를 모두 배울 수 있습니다. 전문 기술 창(K)에서 기술 레벨과 제작법·재료를 확인하세요.' },
          { title: '기술 레벨과 캐릭터 레벨 구분하기', body: '설비 표의 20은 전문 기술 레벨입니다. 기술 레벨 140 이상이 필요한 캠핑 아이템은 던전·레이드에서 전리품으로 얻을 수 있습니다.' },
        ],
        sources: ['camping', 'newPlayer'],
      },
      {
        id: 'legacy', title: '유산은 언제 열리나요?',
        art: { id: 'diff-legacy', alt: '산호 해변 위에 떠 있는 유산 도전 창을 도트로 다시 그린 그림' },
        items: [
          { title: '처음 점수를 얻을 때 해제', body: '대부분 첫 캐릭터가 25레벨이 될 때 열립니다. 채집 계열이 아닌 주 전문 기술 숙련도 150 달성이나 세계 지도 전체 탐험으로 먼저 열 수도 있습니다. 해제 뒤에는 메뉴의 방패 모양 아이콘이나 기본 단축키 Y로 엽니다.' },
          { title: '도전 완료 → 점수 획득', body: '유산 도전 하나를 끝내면 1점을 얻고, Battle.net 계정이 공유합니다. 출시 기준 도전은 직업·전문 기술·PvP·모험·던전·레이드 여섯 범주에 총 65개입니다.' },
          { title: '캐릭터별로 최대 16점 투자', body: '출시 기준 사용 한도는 캐릭터마다 16점입니다. 계정에 모인 점수를 각 캐릭터가 다른 곳에 투자할 수 있고, 다른 캐릭터의 배분에는 영향을 주지 않습니다. 한 캐릭터로도 한도를 채울 수 있어 부캐는 필수가 아닙니다.' },
          { title: '꾸미기 보상도 별도로 해제', body: '계정에 누적한 유산 점수로 장난감·애완동물·휘장·탈것 보상을 해제합니다. 보상을 위한 누적 점수와 한 캐릭터가 투자할 수 있는 16점은 서로 다른 기준입니다.' },
        ],
        sources: ['legacy', 'compare'],
      },
      {
        id: 'legacy-challenges', title: '점수는 어디서 모으나요?',
        table: {
          columns: ['범주', '출시 기준 점수', '도전 내용'],
          rows: [
            ['직업', '총 27점', '각 직업으로 25·45·60레벨 달성'],
            ['전문 기술', '총 18점', '채집을 제외한 주 전문 기술별 숙련도 150·225·300 달성'],
            ['PvP', '총 12점', '계급·전장 평판·시즌 여정 퀘스트 도전'],
            ['모험', '총 2점', '한 캐릭터로 세계 지도 전체 탐험 / 군주 발타라크 던전 세트 연계 퀘스트 완료'],
            ['던전', '총 3점', '15~25·26~45·46~60레벨 구간별 모든 던전의 마지막 네임드 처치'],
            ['레이드', '총 3점', '오닉시아 / 하이잘 정상 13마리 전부 / 지하 심굴 8마리 전부 처치'],
          ],
        },
        sources: ['legacy'],
      },
      {
        id: 'legacy-perks', title: '특전 세 분야와 하드코어 예외',
        items: [
          { title: '전문 기술', body: '숙련도 성장, 채집 재료, 상인 구매, 요리·낚시처럼 제작·생활 활동을 돕는 분야입니다.' },
          { title: '모험', body: '휴식 경험치, 야외 활동, 캠핑과 이동 등을 돕는 분야입니다.' },
          { title: '지혜', body: '음식·강화 효과, 내구도, 명예·평판 등 모험의 유지 비용과 편의에 관련된 분야입니다.' },
          { title: '하드코어는 출시 뒤 추가 예정', body: '일반 규칙의 유산 도전을 하드코어로 가져갈 수 없습니다. 반대로 하드코어의 성과는 다른 규칙에도 반영됩니다. 하드코어용 도전은 별도 안내를 확인하세요.' },
        ],
        sources: ['legacy', 'launch'],
      },
    ],
  },
  classes: {
    title: '포에버 직업·특성 가이드',
    lead: '직업 이름이 같아도 리테일의 특성과 딜사이클이 그대로 맞지는 않습니다. 원하는 전투 방식과 종족 조합을 고른 뒤 포에버에서 배우는 능력을 읽어 보세요.',
    art: { id: 'diff-classes', alt: '전투 중에 덫을 놓는 사냥꾼과 멧돼지에게 달려드는 늑대 소환수' },
    sections: [
      {
        id: 'class-choice', title: '플레이 방식부터 고르세요',
        items: [
          { title: '거리와 역할', body: '붙어서 싸울지, 멀리서 공격할지, 주문을 쓸지 생각해 보세요. 파티를 보호하거나 치유하는 역할을 원하는지도 정하고, 캐릭터 생성 화면의 직업 설명을 읽어 봅니다.' },
          { title: '친구와 규칙·진영 맞추기', body: '함께할 사람과 규칙·진영을 먼저 맞춥니다. 같은 규칙·진영이어야 파티와 길드를 만들고 던전·레이드를 함께할 수 있습니다.' },
          { title: '배우는 능력으로 전투 익히기', body: '레벨이 오르면 상급자를 방문하고, 마법책(P)의 능력을 단축바에 놓습니다. 툴팁을 읽고 자원과 회복 수단도 확인하세요. 공식 소개는 원작 기반의 특성·능력 개편을 안내하며, 현재 리테일의 빌드를 복사하도록 안내하지 않습니다.' },
        ],
        sources: ['newPlayer', 'compare'],
      },
      {
        id: 'hunter', title: '공식 예시 · 사냥꾼',
        items: [
          { title: '전투 중 덫 사용', body: '원작의 기억과 달리 포에버 사냥꾼은 전투 중에 덫을 사용할 수 있습니다.' },
          { title: '장비와 소환수 성장', body: '소환수 능력치는 장비에 따라 증가하며, 소환수 종류별 능력도 있습니다. 장비를 바꿀 때 자신의 공격만 보지 말고 소환수도 확인해 보세요.' },
        ],
        sources: ['compare'],
      },
      {
        id: 'combinations', title: '새 종족·직업 조합 여섯 가지',
        table: {
          columns: ['진영', '종족', '새 직업 선택지'],
          rows: [
            ['얼라이언스', '드워프', '주술사'],
            ['얼라이언스', '노움', '사제'],
            ['얼라이언스', '인간', '사냥꾼'],
            ['호드', '언데드', '성기사'],
            ['호드', '오크', '마법사'],
            ['호드', '트롤', '흑마법사'],
          ],
        },
        sources: ['launch', 'compare'],
      },
      {
        id: 'skyborne', title: '스카이본을 고른다면',
        art: { id: 'diff-races', focus: '50% 35%', alt: '마을 앞에 선 새 종족 스카이본 모험가를 도트로 다시 그린 그림' },
        items: [
          { title: '호드 · 바람구체자 스카이본', body: '호드에 합류하면 주술사를 선택할 수 있습니다.' },
          { title: '얼라이언스 · 고등 마법원 스카이본', body: '얼라이언스에 합류하면 마법사를 선택할 수 있습니다.' },
          { title: '공통 출발지와 이용 조건', body: '두 진영 모두 제프라스 섬의 1~12레벨 여정에서 시작합니다. 스카이본은 영웅 꾸러미 이상의 업그레이드가 필요합니다. 포에버 자체를 이용하는 구독·게임 시간 조건과 구분해서 확인하세요.' },
        ],
        sources: ['newPlayer', 'launch'],
      },
      {
        id: 'builds', title: '특성 견본을 고르기 전에',
        lead: '직업별 페이지에는 혼자 퀘스트할 때의 추천 경로와 레벨별 특성 견본을 담았습니다. 레이드·PvP 최종 특성이나 장비 순위와는 목적이 다릅니다.',
        items: [
          { title: '게임 버전 확인', body: '상단에 포에버가 선택되어 있는지 확인하세요. 리테일의 직업 가이드와 스펠 DB는 별도 버전의 자료입니다.' },
          { title: '능력 설명을 기준으로', body: '캐릭터 생성 화면과 게임 안 툴팁에서 실제 능력을 확인합니다. 직업이나 종족의 이름이 같다는 이유로 리테일의 수치·우선순위를 적용하지 마세요.' },
        ],
        sources: ['compare', 'newPlayer'],
      },
    ],
  },
  raids: {
    title: '포에버 첫 레이드 준비',
    lead: '2026년 12월 10일, 60레벨 레이드 세 곳이 열립니다. 모집 인원과 이동 경로를 맞추고, 오닉시아의 둥지 입장 퀘스트를 미리 진행하세요. 지금은 개방 전 입장 준비 안내입니다.',
    art: { id: 'diff-raids', alt: '용암이 흐르는 동굴 한가운데 검은 용이 웅크린 오닉시아의 둥지를 도트로 다시 그린 그림' },
    sections: [
      {
        id: 'raid-overview', title: '어디로, 몇 명이 가나요?',
        table: {
          columns: ['레이드 · 인원', '입구·위치', '공식 소개'],
          rows: [
            ['지하 심굴 · 10인', '하이잘 산 내부 · 하이잘 산·여명의 설원·검은아귀 요새에서 연결', '60레벨 · 네임드 8마리'],
            ['하이잘 정상 · 20인', '하이잘 산 꼭대기, 세계수 놀드랏실 근처', '60레벨 · 네임드 13마리, 여러 진행 경로'],
            ['오닉시아의 둥지 · 40인', '먼지진흙 습지대', '60레벨 · 각자 비룡불꽃 아뮬렛 필요'],
          ],
        },
        sources: ['raids'],
      },
      {
        id: 'attunement', title: '오닉시아 · 아뮬렛은 전원 준비',
        items: [
          { title: '공대장 한 명이 아니라 각자', body: '진영별 연계 퀘스트를 완료해 비룡불꽃 아뮬렛을 얻어야 합니다. 입장할 때 소지품에 있으면 되고, 장착할 필요는 없습니다.' },
          { title: '던전을 여러 번 갈 시간 확보', body: '공식 안내는 연계 퀘스트를 일찍 시작하고, 정예 퀘스트를 도울 동료와 고레벨 던전을 여러 번 방문할 시간을 잡으라고 합니다.' },
          { title: '화염 저항 준비', body: '공식 공격대 소개는 화염 저항을 갖추도록 안내합니다. 필요한 저항 수치나 장비 조합은 그 공지에 없으므로, 특정 수치를 입장 조건으로 제시하지 않습니다.' },
        ],
        sources: ['raids'],
      },
      {
        id: 'alliance-attunement', title: '얼라이언스 · 불타는 평원에서 시작',
        items: [
          { title: '1 · 헬렌디스 리버혼', body: '불타는 평원에서 「용혈족의 위협」을 받고, 「진정한 지도자」 연계 퀘스트를 따라 모건의 망루의 치안대장 맥스웰을 찾아갑니다.' },
          { title: '2 · 검은바위 나락의 윈저', body: '「치안대장 윈저」와 「실망」을 진행한 뒤, 나락의 적에게서 꼬깃꼬깃한 쪽지를 찾아 감방의 윈저에게 가져갑니다. 「잔존하는 희망」에서 잃어버린 단서를 회수하고 「탈옥!」을 마친 뒤 맥스웰에게 돌아갑니다.' },
          { title: '3 · 스톰윈드 회합', body: '「스톰윈드 회합」으로 도시 성문의 수습기사 로우를 만나고, 동료를 모아 「대단한 가장무도회」를 진행합니다. 윈저가 보이지 않으면 로우와 대화하세요.' },
          { title: '4 · 용의 눈 → 아뮬렛', body: '볼바르 폴드라곤의 「용의 눈」을 이어서 진행합니다. 마지막 「비룡불꽃 아뮬렛」 단계는 검은바위 첨탑 상층의 사령관 드라키사스에게서 검은용 용사의 피를 가져오는 일입니다.' },
        ],
        sources: ['raids'],
      },
      {
        id: 'horde-attunement', title: '호드 · 황야의 땅에서 시작',
        items: [
          { title: '1 · 카르가스의 장군 고어투스', body: '황야의 땅 카르가스에서 「피와 번개」로 시작하고, 「장군의 명령」을 따라 검은바위 첨탑으로 갑니다. 이후 오그리마에서 아이트리그와 스랄을 만납니다.' },
          { title: '2 · 스랄 → 렉사르 → 미란다', body: '「호드를 위하여!」를 마치고 「바람이 전해 온 소식」·「호드의 용사」를 따라 잊혀진 땅의 렉사르를 찾습니다. 「렉사르의 유언」으로 서부 역병지대의 노파 미란다를 만나 「눈동자의 환영」을 진행합니다.' },
          { title: '3 · 엠버스트라이프의 해골 시험', body: '용족 파멸의 아뮬렛으로 먼지진흙 습지대의 엠버스트라이프를 만나고, 네 마리 용의 해골을 회수하는 시험을 진행합니다. 「진급」에서 받은 흐릿한 비룡불꽃 아뮬렛을 렉사르에게 가져갑니다.' },
          { title: '4 · 검은용 용사의 피', body: '렉사르의 마지막 퀘스트로 검은바위 첨탑 상층의 사령관 드라키사스에게서 검은용 용사의 피를 얻습니다. 렉사르에게 돌아가 비룡불꽃 아뮬렛을 받으면 입장 준비가 끝납니다.' },
        ],
        sources: ['raids'],
      },
      {
        id: 'raid-checklist', title: '출발 전 같이 확인할 것',
        art: { id: 'together', focus: '50% 40%', alt: '끊어진 다리를 사이에 두고 푸른 깃발 일행과 붉은 깃발 일행이 마주 선 모습' },
        items: [
          { title: '규칙·진영·인원', body: '함께할 사람들의 규칙과 진영을 맞추고, 선택한 레이드의 10·20·40인 규모에 맞춰 모집합니다.' },
          { title: '60레벨·입장 아이템·이동 경로', body: '세 레이드 모두 60레벨입니다. 오닉시아는 모두 소지품의 아뮬렛을 확인하고, 지하 심굴은 여러 입구 가운데 모일 장소를 정하세요.' },
          { title: '수리·음식·음료', body: '손상된 장비를 수리하고 회복용 보급품을 준비합니다. 자신의 역할과 배운 능력을 확인하고 동료들과 진행 계획을 맞추세요.' },
          { title: '주간 일정', body: '세 레이드는 모두 매주 초기화될 예정입니다. 공식 소개에는 한국의 정확한 초기화 요일·시각이 없으므로, 실제 게임의 귀속 정보를 확인해 일정을 잡으세요.' },
        ],
        sources: ['raids', 'newPlayer', 'rules'],
      },
    ],
  },
};

export const foreverHome = {
  title: '포에버 한눈에 보기',
  lead: '리테일·클래식과 따로 운영되는 새 버전입니다. 동부 왕국과 칼림도어에서 60레벨까지 키우고, 직업 이름은 같아도 특성과 능력이 달라 리테일 공략을 그대로 쓸 수 없습니다.',
  art: { id: 'hero-home', kind: 'hero', focus: '50% 62%', alt: '밤 숲속 거대한 나무 아래에서 모험가 다섯 명이 모닥불에 둘러앉아 쉬는 모습. 포에버 공식 대표 그림을 도트로 다시 그렸다.' },
  facts: [
    { label: '출시', value: '2026년 11월 5일', note: '오전 8시(한국 시간)', sources: ['launch', 'access'] },
    { label: '무대와 레벨', value: '1~60레벨', note: '동부 왕국·칼림도어', sources: ['launch'] },
    { label: '이용 조건', value: '와우 구독·게임 시간', note: '리테일과 함께 이용', sources: ['access', 'compare'] },
    { label: '첫 레이드', value: '12월 10일', note: '세 곳이 함께 열림', sources: ['raids'] },
  ],
  differencesTitle: '리테일과 다른 점',
  differences: [
    {
      topic: '서버 고르기',
      art: { id: 'diff-rules', alt: '규칙 네 가지가 나란히 걸려 있는 규칙 선택 화면을 도트로 다시 그린 그림' },
      forever: '서버 목록이 없고 규칙을 고릅니다. 출시 때는 일반·PvP·롤플레이·롤플레이 PvP 네 가지입니다.',
      note: '하드코어는 출시 뒤에 추가될 예정입니다. 친구와 함께하려면 규칙과 진영을 먼저 맞추세요.',
      link: { path: '/forever/rules', label: '규칙·진영 고르기' },
      sources: ['launch', 'rules'],
    },
    {
      topic: '레벨과 지역',
      art: { id: 'diff-zones', alt: '안개 낀 깊은 숲속 마을을 도트로 다시 그린 그림' },
      forever: '최고 레벨은 60입니다. 하이잘 산·셴드랄라스·강물터·제프라스 섬 같은 새 지역과 새 퀘스트 1,000여 개가 더해졌습니다.',
      note: '강물터는 30레벨 중반~40레벨 중반, 제프라스 섬은 1~12레벨 시작 지역입니다.',
      link: { path: '/forever/leveling', label: '레벨별 지역·던전 보기' },
      sources: ['launch'],
    },
    {
      topic: '직업',
      art: { id: 'diff-classes', alt: '전투 중에 덫을 놓는 사냥꾼과 멧돼지에게 달려드는 늑대 소환수' },
      forever: '직업 이름은 익숙해도 특성과 능력은 원작 와우를 바탕으로 새로 손봤습니다.',
      note: '사냥꾼은 전투 중에 덫을 쓰고, 소환수가 장비에 따라 강해집니다. 리테일의 딜사이클과 특성은 그대로 맞지 않습니다.',
      link: { path: '/forever/classes', label: '직업 선택 전에 읽기' },
      sources: ['compare'],
    },
    {
      topic: '종족과 직업 조합',
      art: { id: 'diff-races', alt: '마을 앞에 선 새 종족 스카이본 모험가를 도트로 다시 그린 그림' },
      forever: '새 조합 여섯 가지가 생겼습니다: 언데드 성기사, 드워프 주술사, 노움 사제, 인간 사냥꾼, 오크 마법사, 트롤 흑마법사. 새 종족 스카이본도 있습니다.',
      note: '스카이본은 호드 쪽이면 주술사를, 얼라이언스 쪽이면 마법사를 고를 수 있습니다. 스카이본을 하려면 영웅 꾸러미 이상이 필요합니다.',
      sources: ['launch', 'newPlayer'],
    },
    {
      topic: '던전과 레이드',
      art: { id: 'diff-raids', alt: '용암이 흐르는 동굴 한가운데 검은 용이 웅크린 오닉시아의 둥지를 도트로 다시 그린 그림' },
      forever: '13~60레벨용 새 5인 던전 아홉 곳이 있습니다. 12월 10일에는 60레벨 레이드 세 곳이 열립니다: 지하 심굴 10인, 하이잘 정상 20인, 오닉시아의 둥지 40인.',
      note: '오닉시아의 둥지는 소지품에 비룡불꽃 아뮬렛이 있어야 들어갑니다. 레이드는 매주 초기화됩니다.',
      link: { path: '/forever/raids', label: '첫 레이드 입장 준비' },
      sources: ['launch', 'raids'],
    },
    {
      topic: '유산',
      art: { id: 'diff-legacy', alt: '산호 해변 위에 떠 있는 유산 도전 창을 도트로 다시 그린 그림' },
      forever: '계정 전체가 함께 크는 성장입니다. 유산 도전·유산 특전·유산 보상 세 가지로 이루어지고, 출시 때는 캐릭터마다 유산 점수를 16점까지 넣을 수 있습니다.',
      note: '캐릭터 하나로도 한도까지 채울 수 있어 부캐가 꼭 필요하지는 않습니다.',
      link: { path: '/forever/growth#legacy', label: '유산 해제·점수 알아보기' },
      sources: ['launch', 'compare'],
    },
    {
      topic: '캠핑',
      art: { id: 'diff-camping', alt: '천막 옆에 모닥불을 피운 숲속 캠프를 도트로 다시 그린 그림' },
      forever: '요리로 피운 작은 모닥불이 캠프 거점이 됩니다. 주위 플레이어가 전문 기술로 만든 캠핑 설비를 한 사람에 하나씩, 모두 세 개까지 놓습니다. 향상된 모닥불은 다섯·열 개까지 놓을 수 있습니다.',
      note: '거점 주위에서 1분 동안 앉아 있거나 제작을 하면 설비의 이로운 효과를 받습니다.',
      link: { path: '/forever/growth#camping', label: '캠핑 설비와 사용 조건' },
      sources: ['launch', 'camping'],
    },
    {
      topic: '화면과 조작',
      art: { id: 'diff-controls', alt: '게임 화면 앞에 놓인 게임패드와 키보드' },
      forever: "처음 로그인할 때 플레이 환경 사전 설정 '클래식'과 '강화됨' 중 하나를 고릅니다. 게임패드도 쓸 수 있습니다(베타).",
      note: '사전 설정은 화면 표시만 바꾸고 규칙에는 영향을 주지 않습니다. 대화 같은 기능에는 여전히 키보드가 필요합니다.',
      link: { path: '/forever/start#step-3', label: '사전 설정 비교' },
      sources: ['compare', 'launch'],
    },
  ],
  next: [
    { path: '/forever/start', title: '시작하기', body: '설치부터 첫 캐릭터까지 여섯 단계', art: { id: 'hero-start', kind: 'hero', alt: '' } },
    { path: '/forever/rules', title: '규칙·진영 고르기', body: '친구와 같이 하려면 먼저 맞출 것', art: { id: 'hero-rules', kind: 'hero', alt: '' } },
    { path: '/forever/leveling', title: '지역·던전', body: '새 지역과 5인 던전 아홉 곳의 레벨·입장 준비', art: { id: 'diff-zones', alt: '' } },
    { path: '/forever/growth', title: '캠핑·유산', body: '설비를 놓는 법부터 유산 점수 투자까지', art: { id: 'diff-camping', alt: '' } },
    { path: '/forever/classes', title: '직업 선택', body: '새 종족 조합과 리테일과 달라진 점', art: { id: 'diff-classes', alt: '' } },
    { path: '/forever/raids', title: '첫 레이드 준비', body: '12월 10일 전에 진영별 입장 퀘스트 확인', art: { id: 'diff-raids', alt: '' } },
  ],
  notice: '직업별 레벨링 특성 견본은 직업 선택에서, 종족별 출발 동선은 지역·던전에서 확인하세요. 레이드 네임드별 실전 전투 공략은 개방 뒤 다룹니다.',
};

export const foreverStart = {
  title: '포에버 시작하기',
  lead: '설치부터 첫 캐릭터까지 여섯 단계입니다. 규칙은 나중에 옮길 수 없으니 4단계만큼은 함께할 친구와 먼저 맞추세요.',
  art: { id: 'hero-start', kind: 'hero', focus: '50% 58%', alt: '금빛 해가 떠오르는 바다와 얕은 물에 걸린 난파선. 입문 안내 공지의 대표 그림을 도트로 다시 그렸다.' },
  steps: [
    {
      short: '계정·이용권',
      art: { id: 'step-account', alt: '여관 탁자 위에 놓인 여행 증서와 모래시계, 열쇠, 귀환석' },
      title: '계정과 이용권 준비',
      body: 'Battle.net 계정을 만들고 와우 구독이나 게임 시간을 준비합니다. 리테일을 하고 있다면 그 구독·게임 시간으로 포에버도 할 수 있습니다.',
      sources: ['newPlayer', 'compare'],
    },
    {
      short: '설치',
      art: { id: 'step-install', alt: '모닥불 장면이 뜬 모니터와 거의 다 찬 설치 진행 막대' },
      title: '설치하고 버전 고르기',
      body: "Battle.net 앱에서 월드 오브 워크래프트를 설치한 뒤, 게임 버전에서 '월드 오브 워크래프트: 포에버'를 고릅니다. Windows와 Mac에서 할 수 있습니다.",
      sources: ['newPlayer'],
    },
    {
      short: '사전 설정',
      art: { id: 'step-preset', alt: '드워프 한 명을 가운데 선으로 나눠 왼쪽은 단순한 옛 모델로, 오른쪽은 세밀한 모델로 그린 그림' },
      title: '플레이 환경 사전 설정 고르기',
      body: "처음 로그인하면 '클래식'과 '강화됨' 중 하나를 고릅니다. 화면 표시만 달라지고 규칙에는 영향이 없습니다. 공식 안내는 잘 모르겠으면 '강화됨'으로 시작하라고 합니다. 나중에 게임 메뉴 > 설정에서 항목별로 바꿀 수 있고, 이 화면은 처음 로그인할 때만 나옵니다.",
      presets: true,
      sources: ['launch', 'compare'],
    },
    {
      short: '규칙',
      art: { id: 'step-rules', alt: '네 갈래 길 이정표 앞에 선 여행자' },
      title: '규칙 고르기',
      body: '서버 대신 규칙을 고릅니다. 다른 규칙에서 하려면 그 규칙에서 캐릭터를 새로 만들어야 합니다. 공식 안내는 어디서 시작할지 모르겠다면 일반 규칙을 추천합니다.',
      link: { path: '/forever/rules', label: '규칙별 차이 보기' },
      sources: ['newPlayer', 'rules'],
    },
    {
      short: '진영·종족·직업',
      art: { id: 'step-faction', alt: '푸른 깃발 아래 얼라이언스 모험가들과 붉은 깃발 아래 호드 모험가들이 다리를 사이에 두고 마주 선 모습' },
      title: '진영·종족·직업 고르기',
      body: '진영(얼라이언스·호드)은 함께할 공동체와 도시·이야기를, 종족은 외모와 시작 위치·종족 능력을, 직업은 싸우는 방식을 정합니다. 캐릭터 모델은 고해상도(HD)와 표준 해상도(SD) 중에 고르는데, 외형만 달라지고 나중에 설정이나 미용실에서 바꿀 수 있습니다.',
      sources: ['newPlayer'],
    },
    {
      short: '이름',
      art: { id: 'step-name', alt: '붉은 사막 캠프의 모닥불 곁 모험가들 머리 위에 이름표가 떠 있는 모습' },
      title: '이름 짓기',
      body: '주 이름과 보조 이름, 두 개를 씁니다. 두 이름을 합친 것이 지역 안에서 하나뿐이면 됩니다. 보조 이름은 설정 > 이름표 > 내 보조 이름에서 숨길 수 있지만 대화에는 표시됩니다.',
      sources: ['newPlayer', 'launch'],
    },
  ],
  presets: {
    columns: ['처음 설정', '클래식', '강화됨'],
    rows: [
      ['캐릭터 모델', '표준 해상도', '고해상도'],
      ['퀘스트 관심 지점·목표 표시', '끔', '켬'],
      ['가방 통합', '끔', '켬'],
      ['형상변환', '끔', '켬'],
      ['기본 이동 단축키', '카메라 회전', '횡이동'],
      ['화면 구성', '클래식 화면', '중앙 집중'],
    ],
  },
  firstTitle: '들어가서 처음 알아둘 것',
  keys: [
    { key: 'L', label: '퀘스트 목록' },
    { key: 'M', label: '세계 지도' },
    { key: 'P', label: '마법책' },
    { key: 'C', label: '캐릭터 창' },
    { key: 'K', label: '전문 기술' },
    { key: 'Esc', label: '게임 메뉴·설정' },
  ],
  basics: [
    { title: '퀘스트', art: { id: 'basic-quest', kind: 'square', alt: '머리 위에 느낌표와 물음표가 뜬 마을 사람들' }, body: '머리 위에 느낌표가 뜬 캐릭터가 퀘스트를 주고, 물음표가 뜨면 완료해서 보고할 수 있습니다.' },
    { title: '새 능력', art: { id: 'basic-trainer', kind: 'square', alt: '빛나는 마법책을 건네는 직업 상급자' }, body: '레벨이 오르면 직업 상급자를 찾아가 새 능력을 배웁니다.' },
    { title: '죽었을 때', art: { id: 'basic-death', kind: 'square', alt: '무덤가에 떠 있는 영혼의 치유사와 영혼이 된 모험가' }, body: '근처 무덤에서 영혼으로 깨어나 시체까지 가서 부활합니다. 영혼의 치유사에게 부활하면 장비 내구도가 떨어지고 부활 후유증이 생길 수 있습니다.' },
    { title: '전문 기술', art: { id: 'basic-professions', kind: 'square', alt: '모루와 곡괭이, 약초, 낚싯대, 요리 솥' }, body: '주 전문 기술은 두 개까지, 보조 기술(요리·낚시·응급치료)은 세 개 모두 배울 수 있습니다.' },
    { title: '던전', art: { id: 'basic-dungeon', kind: 'square', alt: '던전 입구 앞에 선 다섯 명 파티' }, body: '보통 다섯 명이 갑니다. 탱커 한 명, 힐러 한 명, 나머지는 딜러입니다.' },
  ],
  basicsSources: ['newPlayer'],
  tipsTitle: '공식 안내의 첫 모험 팁 다섯 가지',
  tipsArt: { id: 'tips-flight', alt: '언덕 위 비행 조련사와 그리핀, 멀리 날아가는 또 한 마리' },
  tips: [
    '능력 툴팁과 퀘스트 글을 읽어 보세요.',
    '귀환석을 챙기고, 비행 조련사를 찾아 비행 경로를 배우세요.',
    '장비를 수리하고 필요 없는 아이템은 팔아서, 가방·훈련비·여비에 쓸 돈을 모으세요.',
    '퀘스트가 어려우면 도움을 청하세요.',
    '처음 고른 직업이 안 맞으면 다른 직업도 해 보세요.',
  ],
};

export const foreverRules = {
  title: '규칙과 진영 고르기',
  lead: '포에버에는 서버 목록이 없습니다. 캐릭터를 만들기 전에 규칙을 고르고, 규칙과 진영이 같은 사람끼리만 파티와 길드를 맺습니다.',
  art: { id: 'hero-rules', kind: 'hero', focus: '50% 55%', alt: '달빛이 비치는 숲속 나이트 엘프 도시의 돌길. 규칙 안내 공지의 대표 그림을 도트로 다시 그렸다.' },
  pickerTitle: '이럴 땐 이 규칙',
  picker: [
    { when: '처음이라 어디서 시작할지 모르겠다', rule: '일반', note: '공식 안내의 추천' },
    { when: '야외에서 상대 진영과 싸우고 싶다', rule: 'PvP' },
    { when: '캐릭터 역할에 몰입하고 싶다', rule: '롤플레이' },
    { when: '역할 몰입과 야외 싸움을 둘 다 원한다', rule: '롤플레이 PvP' },
  ],
  rulesTitle: '규칙 다섯 가지',
  rules: [
    {
      name: '일반',
      art: { id: 'rule-normal', alt: '해 질 녘 얕은 강을 건너는 모험가' },
      body: '모험하며 몬스터와 싸우는 데 초점이 있습니다. 플레이어 간 전투는 원할 때만 합니다.',
      faction: '양쪽 진영 모두 만들 수 있음',
      sources: ['newPlayer', 'rules'],
    },
    {
      name: 'PvP',
      art: { id: 'rule-pvp', alt: '눈 덮인 전장에서 맞붙은 두 진영' },
      body: '플레이어 간 전투에 초점이 있습니다. 야외의 상당 부분에서 상대 진영 플레이어에게 공격받을 수 있습니다.',
      faction: '한쪽 진영만 만들 수 있음',
      sources: ['newPlayer', 'rules', 'compare'],
    },
    {
      name: '롤플레이',
      art: { id: 'rule-rp', alt: '여관 벽난로 곁 탁자에 둘러앉아 이야기하는 모험가들' },
      body: '판타지 세계의 캐릭터 역할에 몰입해 롤플레잉을 즐기는 규칙입니다.',
      faction: '양쪽 진영 모두 만들 수 있음',
      sources: ['newPlayer', 'rules'],
    },
    {
      name: '롤플레이 PvP',
      art: { id: 'rule-rppvp', alt: '전쟁 천막 안에서 지도를 놓고 작전을 짜는 지휘관들' },
      body: '롤플레이 커뮤니티에 참여하면서, 야외에서는 상대 진영과의 싸움에 휘말릴 수 있습니다.',
      faction: '한쪽 진영만으로 보고 고르기',
      sources: ['newPlayer', 'rules'],
    },
    {
      name: '하드코어',
      art: { id: 'rule-hardcore', alt: '횃불 하나를 들고 죽은 늪으로 걸어 들어가는 모험가' },
      tag: '출시 뒤 추가 예정',
      body: '모든 결정이 중요하고, 캐릭터의 여정이 죽음으로 끝날 수 있는 도전입니다. 일정은 아직 공개되지 않았습니다.',
      faction: '양쪽 진영 모두 만들 수 있음',
      sources: ['newPlayer', 'rules'],
    },
  ],
  factionNote: "공식 공지는 '전쟁 규칙'에서는 한쪽 진영의 캐릭터만 만들 수 있고, 일반·롤플레이·하드코어 규칙에서는 양쪽 진영을 모두 만들 수 있다고 안내합니다. 롤플레이 PvP는 양쪽 모두 만들 수 있는 규칙 목록에 없습니다.",
  togetherTitle: '친구와 같이 하려면',
  togetherArt: { id: 'together', focus: '50% 40%', alt: '끊어진 다리를 사이에 두고 푸른 깃발 일행과 붉은 깃발 일행이 마주 선 모습' },
  together: [
    { ok: true, text: '규칙과 진영이 같으면 파티·길드·던전·레이드를 함께할 수 있습니다.' },
    { ok: false, text: '다른 규칙의 플레이어와는 파티를 맺을 수 없습니다.' },
    { ok: false, text: '호드와 얼라이언스는 같은 파티가 될 수 없습니다.' },
    { ok: true, text: '전장에서는 다른 규칙의 플레이어도 만날 수 있습니다(하드코어 제외).' },
  ],
  togetherSources: ['rules', 'newPlayer'],
  limitsTitle: '고른 뒤에 바꿀 수 있나요?',
  limits: [
    { title: '규칙은 옮길 수 없습니다', body: '다른 규칙에서 하려면 그 규칙에서 캐릭터를 새로 만들어야 합니다.' },
    { title: '수집품과 유산 점수는 이어집니다', body: '규칙이 달라도 계정 전체가 공유합니다. 하드코어만 예외로, 하드코어의 성과는 다른 규칙에 반영되지만 다른 규칙의 성과를 하드코어로 가져올 수는 없습니다.' },
    { title: '진영을 못 고를 때가 있습니다', body: '전쟁 규칙에는 호드와 얼라이언스 인구를 비슷하게 맞추는 장치가 있어, 한쪽 진영의 캐릭터 생성이 잠시 막힐 수 있습니다.' },
    { title: '같은 언어끼리 만나기', body: "Esc > 옵션 > 시스템 > 언어와 소셜의 '선호 온라인 언어'에서 고릅니다. 계정의 모든 캐릭터에 적용되고, 24시간 뒤에 다시 바꿀 수 있습니다." },
  ],
  limitsSources: ['rules'],
};

// 직업별 특성 견본과 종족별 동선은 포에버 자료로만 관리한다.
// 추천과 확정 사실을 구분하며, 리테일 KB에는 넣지 않는다.
Object.assign(foreverSources, {
  "tavern-warrior": {"label":"Forever Tavern · 전사 레벨링 (영문)","url":"https://forever-tavern.com/guides/warrior-leveling-guide/"},
  "tavern-paladin": {"label":"Forever Tavern · 성기사 레벨링 (영문)","url":"https://forever-tavern.com/guides/paladin-leveling-guide/"},
  "tavern-hunter": {"label":"Forever Tavern · 사냥꾼 레벨링 (영문)","url":"https://forever-tavern.com/guides/hunter-leveling-guide/"},
  "tavern-rogue": {"label":"Forever Tavern · 도적 레벨링 (영문)","url":"https://forever-tavern.com/guides/rogue-leveling-guide/"},
  "tavern-priest": {"label":"Forever Tavern · 사제 레벨링 (영문)","url":"https://forever-tavern.com/guides/priest-leveling-guide/"},
  "tavern-shaman": {"label":"Forever Tavern · 주술사 레벨링 (영문)","url":"https://forever-tavern.com/guides/shaman-leveling-guide/"},
  "tavern-mage": {"label":"Forever Tavern · 마법사 레벨링 (영문)","url":"https://forever-tavern.com/guides/mage-leveling-guide/"},
  "tavern-warlock": {"label":"Forever Tavern · 흑마법사 레벨링 (영문)","url":"https://forever-tavern.com/guides/warlock-leveling-guide/"},
  "tavern-druid": {"label":"Forever Tavern · 드루이드 레벨링 (영문)","url":"https://forever-tavern.com/guides/druid-leveling-guide/"},
  "routes": {"label":"ForeverDB · 종족별 레벨링 경로·자료 한계 (영문)","url":"https://foreverdb.net/guide/leveling"},
  "start-northshire-valley": {"label":"ForeverDB · 북녘골 시작 안내 (영문)","url":"https://foreverdb.net/guide/northshire-valley"},
  "start-coldridge-valley": {"label":"ForeverDB · 눈마루 골짜기 시작 안내 (영문)","url":"https://foreverdb.net/guide/coldridge-valley"},
  "start-shadowglen": {"label":"ForeverDB · 그늘 협곡 시작 안내 (영문)","url":"https://foreverdb.net/guide/shadowglen"},
  "start-valley-of-trials": {"label":"ForeverDB · 시험의 골짜기 시작 안내 (영문)","url":"https://foreverdb.net/guide/valley-of-trials"},
  "start-camp-narache": {"label":"ForeverDB · 나라체 야영지 시작 안내 (영문)","url":"https://foreverdb.net/guide/camp-narache"},
  "start-deathknell": {"label":"ForeverDB · 죽음의 종소리 마을 시작 안내 (영문)","url":"https://foreverdb.net/guide/deathknell"},
  "start-zephras-isle": {"label":"ForeverDB · 제프라스 섬 시작 안내 (영문)","url":"https://foreverdb.net/guide/zephras-isle"}
});

export const foreverDetailGuides = {
  "classes/warrior": {
    "title": "포에버 전사 특성·레벨링",
    "label": "전사",
    "parent": "classes",
    "lead": "방패를 든 보호 경로를 먼저 살펴보세요. 혼자 하는 퀘스트와 던전 탱킹을 같은 특성으로 이어 가기 좋은 견본입니다.",
    "art": {"id":"basic-trainer","kind":"square","alt":"마법책을 펼친 모험가에게 직업 상급자가 능력을 가르치는 도트 그림"},
    "sections": [
      {
        "id": "path",
        "title": "내 활동에 맞는 특성 경로",
        "lead": "아래 추천은 Forever Tavern의 레벨링 견본을 추린 것입니다. 레이드·PvP의 최종 순위나 모든 상황의 정답을 뜻하지 않습니다.",
        "items": [
          {"title":"보호 · 방패와 반격","body":"방어 행동에서 분노를 얻고 반격하는 경로입니다. 던전을 자주 가거나 여러 적에게 둘러싸였을 때의 여유를 원한다면 먼저 비교하세요."},
          {"title":"무기 · 양손 무기","body":"큰 단발 공격을 선호할 때 살펴봅니다. 공격이 빗나가 분노가 모자랄 때의 전투 흐름도 익혀야 합니다."},
          {"title":"분노 · 쌍수","body":"공격적인 경로입니다. 빠른 처치만 보지 말고 전투 뒤 체력 회복에 드는 시간까지 비교하세요."}
        ],
        "sources": ["tavern-warrior"]
      },
      {
        "id": "talents",
        "title": "보호 특성 배분 견본",
        "lead": "표는 유산으로 특성 점수를 앞당기지 않은 기준입니다. 배분 숫자는 무기 / 분노 / 보호 순서이며 각 분야의 누적 점수입니다. 같은 합계여도 세부 배치가 다를 수 있으니, 해당 레벨의 계산기에서 찍는 순서와 각 효과를 함께 확인하세요.",
        "table": {"columns":["레벨","무기 / 분노 / 보호","총 투자"],"rows":[["20레벨","0 / 0 / 11","11점"],["30레벨","0 / 0 / 21","21점"],["40레벨","0 / 0 / 31","31점"],["60레벨","7 / 10 / 34","51점"]]},
        "links": [
          {
            "label": "20레벨 보호 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6IldhcnJpb3IiLCJsZXZlbCI6MjAsImxlZ2FjeSI6MCwiZGF0YVJldmlzaW9uIjoiY2xpZW50LXJlZmVyZW5jZS0yMDI2LTExLTA0IiwidGFsZW50cyI6W1tdLFtdLFtbIlNoaWVsZCBTcGVjaWFsaXphdGlvbiIsNV0sWyJJbXByb3ZlZCBSZXZlbmdlIiwzXSxbIkltcHJvdmVkIFRodW5kZXIgQ2xhcCIsMl0sWyJNYXN0ZXIgb2YgRGVmZW5zZSIsMV1dXX0"
          },
          {
            "label": "30레벨 보호 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6IldhcnJpb3IiLCJsZXZlbCI6MzAsImxlZ2FjeSI6MCwiZGF0YVJldmlzaW9uIjoiY2xpZW50LXJlZmVyZW5jZS0yMDI2LTExLTA0IiwidGFsZW50cyI6W1tdLFtdLFtbIlNoaWVsZCBTcGVjaWFsaXphdGlvbiIsNV0sWyJJbXByb3ZlZCBSZXZlbmdlIiwzXSxbIkltcHJvdmVkIFRodW5kZXIgQ2xhcCIsM10sWyJMYXN0IFN0YW5kIiwxXSxbIk1hc3RlciBvZiBEZWZlbnNlIiwyXSxbIkRlZmlhbmNlIiwzXSxbIkltcHJvdmVkIFN1bmRlciBBcm1vciIsMl0sWyJWYW5ndWFyZCIsMV0sWyJDb25jdXNzaW9uIEJsb3ciLDFdXV19"
          },
          {
            "label": "40레벨 보호 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6IldhcnJpb3IiLCJsZXZlbCI6NDAsImxlZ2FjeSI6MCwiZGF0YVJldmlzaW9uIjoiY2xpZW50LXJlZmVyZW5jZS0yMDI2LTExLTA0IiwidGFsZW50cyI6W1tdLFtdLFtbIlNoaWVsZCBTcGVjaWFsaXphdGlvbiIsNV0sWyJJbXByb3ZlZCBSZXZlbmdlIiwzXSxbIkltcHJvdmVkIFRodW5kZXIgQ2xhcCIsM10sWyJMYXN0IFN0YW5kIiwxXSxbIk1hc3RlciBvZiBEZWZlbnNlIiwyXSxbIkRlZmlhbmNlIiwzXSxbIkltcHJvdmVkIFN1bmRlciBBcm1vciIsM10sWyJWYW5ndWFyZCIsMV0sWyJDb25jdXNzaW9uIEJsb3ciLDFdLFsiRm9jdXNlZCBSYWdlIiwzXSxbIkJhc3Rpb24iLDVdLFsiU2hpZWxkIFNsYW0iLDFdXV19"
          },
          {
            "label": "60레벨 보호 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6IldhcnJpb3IiLCJsZXZlbCI6NjAsImxlZ2FjeSI6MCwiZGF0YVJldmlzaW9uIjoiY2xpZW50LXJlZmVyZW5jZS0yMDI2LTExLTA0IiwidGFsZW50cyI6W1tbIkRlZmxlY3Rpb24iLDVdLFsiSW1wcm92ZWQgQ2hhcmdlIiwyXV0sW1siQ3J1ZWx0eSIsNV0sWyJVbmJyaWRsZWQgV3JhdGgiLDVdXSxbWyJJbXByb3ZlZCBCbG9vZHJhZ2UiLDFdLFsiU2hpZWxkIFNwZWNpYWxpemF0aW9uIiw1XSxbIkltcHJvdmVkIFJldmVuZ2UiLDNdLFsiSW1wcm92ZWQgVGh1bmRlciBDbGFwIiwzXSxbIkxhc3QgU3RhbmQiLDFdLFsiTWFzdGVyIG9mIERlZmVuc2UiLDJdLFsiRGVmaWFuY2UiLDNdLFsiSW1wcm92ZWQgU3VuZGVyIEFybW9yIiwzXSxbIlZhbmd1YXJkIiwxXSxbIkltcHJvdmVkIFNoaWVsZCBXYWxsIiwyXSxbIkNvbmN1c3Npb24gQmxvdyIsMV0sWyJGb2N1c2VkIFJhZ2UiLDNdLFsiQmFzdGlvbiIsNV0sWyJTaGllbGQgU2xhbSIsMV1dXX0"
          }
        ],
        "sources": ["tavern-warrior"]
      },
      {
        "id": "practice",
        "title": "육성 중 먼저 익힐 것",
        "items": [
          {"title":"무기부터 비교","body":"무기의 초당 공격력과 사용 가능한 무기 종류를 먼저 확인합니다. 보호는 방패의 방어도와 피해 방어량도 비교하세요."},
          {"title":"태세와 장비 준비","body":"10레벨과 30레벨의 직업 퀘스트를 상급자에게 확인합니다. 다른 경로를 골라도 한손 무기와 방패를 보관하면 대응 수단이 늘어납니다."},
          {"title":"분노를 다 쓰지 않기","body":"다음 공격과 방어에 필요한 자원을 남깁니다. 위험한 적은 원거리에서 한 마리씩 유인하고 시야를 끊어 가까이 오게 하세요."}
        ],
        "sources": ["tavern-warrior","newPlayer"]
      },
      {
        "id": "next",
        "title": "다음 지역과 던전 준비",
        "items": [{"title":"훈련비와 보급품","body":"새 레벨에서는 상급자와 마법책을 확인하고, 음식·음료·수리·이동 비용을 남겨 둡니다. 장비는 자신의 직업과 무기에 맞는지 비교하세요."}],
        "links": [{"label":"종족별 레벨업 동선","path":"/forever/leveling#race-guides"},{"label":"캠핑·유산으로 성장 이어 가기","path":"/forever/growth"}],
        "sources": ["newPlayer","camping","legacy"]
      }
    ]
  },
  "classes/paladin": {
    "title": "포에버 성기사 특성·레벨링",
    "label": "성기사",
    "parent": "classes",
    "lead": "일반적인 혼자 퀘스트에는 징벌, 정기적으로 던전 탱킹을 한다면 보호를 비교합니다. 두 경로 모두 마나를 얼마나 남기는지가 중요합니다.",
    "art": {"id":"basic-trainer","kind":"square","alt":"마법책을 펼친 모험가에게 직업 상급자가 능력을 가르치는 도트 그림"},
    "sections": [
      {
        "id": "path",
        "title": "내 활동에 맞는 특성 경로",
        "lead": "아래 추천은 Forever Tavern의 레벨링 견본을 추린 것입니다. 레이드·PvP의 최종 순위나 모든 상황의 정답을 뜻하지 않습니다.",
        "items": [
          {"title":"징벌 · 혼자 퀘스트","body":"양손 무기를 중심으로 진행하는 견본입니다. 매번 주문을 추가하기보다 다음 일반 공격으로 마무리할 수 있는지 판단합니다."},
          {"title":"보호 · 던전 탱킹","body":"한손 무기와 방패를 사용하며 힐러와 호흡을 맞춥니다. 작은 무리부터 시작하고 필요한 위협 수준에 맞춰 마나를 씁니다."}
        ],
        "sources": ["tavern-paladin"]
      },
      {
        "id": "talents",
        "title": "징벌 특성 배분 견본",
        "lead": "표는 유산으로 특성 점수를 앞당기지 않은 기준입니다. 배분 숫자는 신성 / 보호 / 징벌 순서이며 각 분야의 누적 점수입니다. 같은 합계여도 세부 배치가 다를 수 있으니, 해당 레벨의 계산기에서 찍는 순서와 각 효과를 함께 확인하세요.",
        "table": {
          "columns": ["레벨","신성 / 보호 / 징벌","총 투자"],
          "rows": [["19레벨","0 / 0 / 10","10점"],["29레벨","0 / 0 / 20","20점"],["39레벨","0 / 0 / 30","30점"],["49레벨","0 / 0 / 40","40점"],["60레벨","11 / 0 / 40","51점"]]
        },
        "links": [
          {
            "label": "19레벨 징벌 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6IlBhbGFkaW4iLCJsZXZlbCI6MTksImxlZ2FjeSI6MCwiZGF0YVJldmlzaW9uIjoiY2xpZW50LXJlZmVyZW5jZS0yMDI2LTExLTA0IiwidGFsZW50cyI6W1tdLFtdLFtbIkJlbmVkaWN0aW9uIiw1XSxbIkltcHJvdmVkIEp1ZGdlbWVudCIsMl0sWyJDb252aWN0aW9uIiwzXV1dfQ"
          },
          {
            "label": "29레벨 징벌 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6IlBhbGFkaW4iLCJsZXZlbCI6MjksImxlZ2FjeSI6MCwiZGF0YVJldmlzaW9uIjoiY2xpZW50LXJlZmVyZW5jZS0yMDI2LTExLTA0IiwidGFsZW50cyI6W1tdLFtdLFtbIkJlbmVkaWN0aW9uIiw1XSxbIkltcHJvdmVkIEp1ZGdlbWVudCIsMl0sWyJDb252aWN0aW9uIiwzXSxbIlNhbmN0aWZpZWQgSnVkZ2VtZW50IiwzXSxbIlNlYWwgb2YgQ29tbWFuZCIsMV0sWyJQdXJzdWl0IG9mIEp1c3RpY2UiLDJdLFsiU2FjcmVkIEFyYml0ZXIiLDFdLFsiVHdvLUhhbmRlZCBXZWFwb24gU3BlY2lhbGl6YXRpb24iLDNdXV19"
          },
          {
            "label": "39레벨 징벌 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6IlBhbGFkaW4iLCJsZXZlbCI6MzksImxlZ2FjeSI6MCwiZGF0YVJldmlzaW9uIjoiY2xpZW50LXJlZmVyZW5jZS0yMDI2LTExLTA0IiwidGFsZW50cyI6W1tdLFtdLFtbIkJlbmVkaWN0aW9uIiw1XSxbIkltcHJvdmVkIEp1ZGdlbWVudCIsMl0sWyJDb252aWN0aW9uIiwzXSxbIlNhbmN0aWZpZWQgSnVkZ2VtZW50IiwzXSxbIlZpbmRpY2F0aW9uIiwxXSxbIlNlYWwgb2YgQ29tbWFuZCIsMV0sWyJQdXJzdWl0IG9mIEp1c3RpY2UiLDJdLFsiU2FjcmVkIEFyYml0ZXIiLDFdLFsiVHdvLUhhbmRlZCBXZWFwb24gU3BlY2lhbGl6YXRpb24iLDNdLFsiUmVwZW50YW5jZSIsMV0sWyJWZW5nZWFuY2UiLDNdLFsiQ2hhbXBpb24gb2YgdGhlIExpZ2h0Iiw1XV1dfQ"
          },
          {
            "label": "49레벨 징벌 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6IlBhbGFkaW4iLCJsZXZlbCI6NDksImxlZ2FjeSI6MCwiZGF0YVJldmlzaW9uIjoiY2xpZW50LXJlZmVyZW5jZS0yMDI2LTExLTA0IiwidGFsZW50cyI6W1tdLFtdLFtbIkRlZmxlY3Rpb24iLDVdLFsiQmVuZWRpY3Rpb24iLDVdLFsiSW1wcm92ZWQgSnVkZ2VtZW50IiwyXSxbIkNvbnZpY3Rpb24iLDNdLFsiU2FuY3RpZmllZCBKdWRnZW1lbnQiLDNdLFsiVmluZGljYXRpb24iLDNdLFsiVW55aWVsZGluZyBGYWl0aCIsMl0sWyJTZWFsIG9mIENvbW1hbmQiLDFdLFsiUHVyc3VpdCBvZiBKdXN0aWNlIiwyXSxbIlNhY3JlZCBBcmJpdGVyIiwxXSxbIlR3by1IYW5kZWQgV2VhcG9uIFNwZWNpYWxpemF0aW9uIiwzXSxbIlJlcGVudGFuY2UiLDFdLFsiVmVuZ2VhbmNlIiwzXSxbIkNoYW1waW9uIG9mIHRoZSBMaWdodCIsNV0sWyJVbnNlYWxlZCBXcmF0aCIsMV1dXX0"
          },
          {
            "label": "60레벨 징벌 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6IlBhbGFkaW4iLCJsZXZlbCI6NjAsImxlZ2FjeSI6MCwiZGF0YVJldmlzaW9uIjoiY2xpZW50LXJlZmVyZW5jZS0yMDI2LTExLTA0IiwidGFsZW50cyI6W1tbIlNwaXJpdHVhbCBGb2N1cyIsNV0sWyJEaXZpbmUgU3RyZW5ndGgiLDVdLFsiSW1wcm92ZWQgU2VhbHMiLDFdXSxbXSxbWyJEZWZsZWN0aW9uIiw1XSxbIkJlbmVkaWN0aW9uIiw1XSxbIkltcHJvdmVkIEp1ZGdlbWVudCIsMl0sWyJDb252aWN0aW9uIiwzXSxbIlNhbmN0aWZpZWQgSnVkZ2VtZW50IiwzXSxbIlZpbmRpY2F0aW9uIiwzXSxbIlVueWllbGRpbmcgRmFpdGgiLDJdLFsiU2VhbCBvZiBDb21tYW5kIiwxXSxbIlB1cnN1aXQgb2YgSnVzdGljZSIsMl0sWyJTYWNyZWQgQXJiaXRlciIsMV0sWyJUd28tSGFuZGVkIFdlYXBvbiBTcGVjaWFsaXphdGlvbiIsM10sWyJSZXBlbnRhbmNlIiwxXSxbIlZlbmdlYW5jZSIsM10sWyJDaGFtcGlvbiBvZiB0aGUgTGlnaHQiLDVdLFsiVW5zZWFsZWQgV3JhdGgiLDFdXV19"
          }
        ],
        "sources": ["tavern-paladin"]
      },
      {
        "id": "practice",
        "title": "육성 중 먼저 익힐 것",
        "items": [
          {"title":"처치와 회복을 함께 계산","body":"주문 한 번이 전투를 줄이는지, 마나만 소모하는지 비교합니다. 다음 전투와 비상 치유에 쓸 마나를 남기세요."},
          {"title":"장비는 역할에 맞게","body":"징벌로 퀘스트할 무기와 방패를 드는 탱킹 장비를 구분합니다. 품질 색상보다 무기 호환성과 역할에 필요한 효과를 확인하세요."},
          {"title":"40레벨 이후 역할 분리","body":"원문은 40레벨 이후 두 역할을 준비하는 경로를 안내합니다. 주로 하는 활동을 먼저 정하고 다른 역할용 장비를 따로 모으세요."}
        ],
        "sources": ["tavern-paladin","newPlayer"]
      },
      {
        "id": "next",
        "title": "다음 지역과 던전 준비",
        "items": [{"title":"훈련비와 보급품","body":"새 레벨에서는 상급자와 마법책을 확인하고, 음식·음료·수리·이동 비용을 남겨 둡니다. 장비는 자신의 직업과 무기에 맞는지 비교하세요."}],
        "links": [{"label":"종족별 레벨업 동선","path":"/forever/leveling#race-guides"},{"label":"캠핑·유산으로 성장 이어 가기","path":"/forever/growth"}],
        "sources": ["newPlayer","camping","legacy"]
      }
    ]
  },
  "classes/hunter": {
    "title": "포에버 사냥꾼 특성·레벨링",
    "label": "사냥꾼",
    "parent": "classes",
    "lead": "소환수가 먼저 적을 붙잡고 자신은 거리를 두는 야수 경로를 기본 견본으로 삼았습니다. 소환수 관리와 보급이 레벨링의 일부입니다.",
    "art": {"id":"basic-trainer","kind":"square","alt":"마법책을 펼친 모험가에게 직업 상급자가 능력을 가르치는 도트 그림"},
    "sections": [
      {
        "id": "path",
        "title": "내 활동에 맞는 특성 경로",
        "lead": "아래 추천은 Forever Tavern의 레벨링 견본을 추린 것입니다. 레이드·PvP의 최종 순위나 모든 상황의 정답을 뜻하지 않습니다.",
        "items": [
          {"title":"야수 · 소환수 중심","body":"소환수의 생존과 공격을 강화하는 경로입니다. 혼자 퀘스트하며 전투 사이 회복 부담을 줄이는 방향입니다."},
          {"title":"사격 · 원거리 공격","body":"자신의 원거리 공격을 강화합니다. 레벨링 중에는 소환수가 먼저 적을 붙잡도록 하는 운용을 함께 유지합니다."},
          {"title":"생존 · 근접 전투","body":"근접 무기와 제어를 활용합니다. 원거리 경로와 장비 요구가 다르므로 무기 교체와 전투 거리를 따로 익히세요."}
        ],
        "sources": ["tavern-hunter"]
      },
      {
        "id": "talents",
        "title": "야수 특성 배분 견본",
        "lead": "표는 유산으로 특성 점수를 앞당기지 않은 기준입니다. 배분 숫자는 야수 / 사격 / 생존 순서이며 각 분야의 누적 점수입니다. 같은 합계여도 세부 배치가 다를 수 있으니, 해당 레벨의 계산기에서 찍는 순서와 각 효과를 함께 확인하세요.",
        "table": {"columns":["레벨","야수 / 사격 / 생존","총 투자"],"rows":[["20레벨","11 / 0 / 0","11점"],["30레벨","21 / 0 / 0","21점"],["40레벨","31 / 0 / 0","31점"],["60레벨","34 / 17 / 0","51점"]]},
        "links": [
          {
            "label": "20레벨 야수 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6Ikh1bnRlciIsImxldmVsIjoyMCwibGVnYWN5IjowLCJkYXRhUmV2aXNpb24iOiJjbGllbnQtcmVmZXJlbmNlLTIwMjYtMTEtMDQiLCJ0YWxlbnRzIjpbW1siRGVhZGx5IEFzcGVjdHMiLDNdLFsiRW5kdXJhbmNlIFRyYWluaW5nIiw1XSxbIkZvY3VzZWQgRmlyZSIsMl0sWyJVbmxlYXNoZWQgRnVyeSIsMV1dLFtdLFtdXX0"
          },
          {
            "label": "30레벨 야수 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6Ikh1bnRlciIsImxldmVsIjozMCwibGVnYWN5IjowLCJkYXRhUmV2aXNpb24iOiJjbGllbnQtcmVmZXJlbmNlLTIwMjYtMTEtMDQiLCJ0YWxlbnRzIjpbW1siRGVhZGx5IEFzcGVjdHMiLDNdLFsiRW5kdXJhbmNlIFRyYWluaW5nIiw1XSxbIkZvY3VzZWQgRmlyZSIsMl0sWyJCZXN0aWFsIFN3aWZ0bmVzcyIsMV0sWyJVbmxlYXNoZWQgRnVyeSIsNV0sWyJGZXJvY2l0eSIsM10sWyJTdW1tb24gSGF3ayIsMV0sWyJJbnRpbWlkYXRpb24iLDFdXSxbXSxbXV19"
          },
          {
            "label": "40레벨 야수 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6Ikh1bnRlciIsImxldmVsIjo0MCwibGVnYWN5IjowLCJkYXRhUmV2aXNpb24iOiJjbGllbnQtcmVmZXJlbmNlLTIwMjYtMTEtMDQiLCJ0YWxlbnRzIjpbW1siRGVhZGx5IEFzcGVjdHMiLDNdLFsiRW5kdXJhbmNlIFRyYWluaW5nIiw1XSxbIkZvY3VzZWQgRmlyZSIsMl0sWyJCZXN0aWFsIFN3aWZ0bmVzcyIsMV0sWyJVbmxlYXNoZWQgRnVyeSIsNV0sWyJGZXJvY2l0eSIsNV0sWyJTdW1tb24gSGF3ayIsMV0sWyJJbnRpbWlkYXRpb24iLDFdLFsiQmVzdGlhbCBEaXNjaXBsaW5lIiwyXSxbIkZyZW56eSIsNV0sWyJCZXN0aWFsIFdyYXRoIiwxXV0sW10sW11dfQ"
          },
          {
            "label": "60레벨 야수 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6Ikh1bnRlciIsImxldmVsIjo2MCwibGVnYWN5IjowLCJkYXRhUmV2aXNpb24iOiJjbGllbnQtcmVmZXJlbmNlLTIwMjYtMTEtMDQiLCJ0YWxlbnRzIjpbW1siRGVhZGx5IEFzcGVjdHMiLDRdLFsiRW5kdXJhbmNlIFRyYWluaW5nIiw1XSxbIkZvY3VzZWQgRmlyZSIsMl0sWyJCZXN0aWFsIFN3aWZ0bmVzcyIsMV0sWyJVbmxlYXNoZWQgRnVyeSIsNV0sWyJGZXJvY2l0eSIsNV0sWyJTdW1tb24gSGF3ayIsMV0sWyJTcGlyaXQgQm9uZCIsMl0sWyJJbnRpbWlkYXRpb24iLDFdLFsiQmVzdGlhbCBEaXNjaXBsaW5lIiwyXSxbIkZyZW56eSIsNV0sWyJCZXN0aWFsIFdyYXRoIiwxXV0sW1siTGV0aGFsIEF0dGFja3MiLDVdLFsiRWZmaWNpZW5jeSIsNV0sWyJDYXJlZnVsIEFpbSIsNV0sWyJSYXBpZCBLaWxsaW5nIiwyXV0sW11dfQ"
          }
        ],
        "sources": ["tavern-hunter"]
      },
      {
        "id": "practice",
        "title": "육성 중 먼저 익힐 것",
        "items": [
          {"title":"10레벨 직업 퀘스트","body":"소환수 관련 직업 퀘스트를 상급자에게 확인합니다. 새 종족의 시작 경로를 옛 클래식 퀘스트와 같다고 단정하지 않습니다."},
          {"title":"소환수 먼저, 공격은 뒤에","body":"소환수가 적의 주의를 붙잡을 시간을 줍니다. 체력과 위치를 확인하고 위험할 때는 공격을 멈추거나 물러나게 하세요."},
          {"title":"보급과 무기","body":"원거리 무기에 맞는 탄약과 소환수 음식을 챙깁니다. 근접해 온 적에 대응할 무기도 준비하고, 생존 경로라면 근접 무기를 우선 비교합니다."}
        ],
        "sources": ["tavern-hunter","newPlayer"]
      },
      {
        "id": "next",
        "title": "다음 지역과 던전 준비",
        "items": [{"title":"훈련비와 보급품","body":"새 레벨에서는 상급자와 마법책을 확인하고, 음식·음료·수리·이동 비용을 남겨 둡니다. 장비는 자신의 직업과 무기에 맞는지 비교하세요."}],
        "links": [{"label":"종족별 레벨업 동선","path":"/forever/leveling#race-guides"},{"label":"캠핑·유산으로 성장 이어 가기","path":"/forever/growth"}],
        "sources": ["newPlayer","camping","legacy"]
      }
    ]
  },
  "classes/rogue": {
    "title": "포에버 도적 특성·레벨링",
    "label": "도적",
    "parent": "classes",
    "lead": "일상적인 혼자 퀘스트에는 전투 경로를, 은신과 전투 선택권을 더 중시한다면 잠행을 비교합니다. 손에 든 무기가 전투 방식에 맞아야 합니다.",
    "art": {"id":"basic-trainer","kind":"square","alt":"마법책을 펼친 모험가에게 직업 상급자가 능력을 가르치는 도트 그림"},
    "sections": [
      {
        "id": "path",
        "title": "내 활동에 맞는 특성 경로",
        "lead": "아래 추천은 Forever Tavern의 레벨링 견본을 추린 것입니다. 레이드·PvP의 최종 순위나 모든 상황의 정답을 뜻하지 않습니다.",
        "items": [
          {"title":"전투 · 꾸준한 퀘스트","body":"현재 쓸 수 있는 좋은 주무기를 중심으로 하는 경로입니다. 정면에서 싸울 일이 많고 던전 공격도 병행할 때 비교합니다."},
          {"title":"잠행 · 은신과 제어","body":"싸울 적과 시점을 고르는 데 초점을 둡니다. 단검을 요구하는 시작 공격을 쓰려면 무기와 위치 조건을 함께 맞춰야 합니다."}
        ],
        "sources": ["tavern-rogue"]
      },
      {
        "id": "talents",
        "title": "전투 특성 배분 견본",
        "lead": "표는 유산으로 특성 점수를 앞당기지 않은 기준입니다. 배분 숫자는 암살 / 전투 / 잠행 순서이며 각 분야의 누적 점수입니다. 같은 합계여도 세부 배치가 다를 수 있으니, 해당 레벨의 계산기에서 찍는 순서와 각 효과를 함께 확인하세요.",
        "table": {
          "columns": ["레벨","암살 / 전투 / 잠행","총 투자"],
          "rows": [["19레벨","0 / 10 / 0","10점"],["29레벨","0 / 20 / 0","20점"],["39레벨","0 / 30 / 0","30점"],["49레벨","5 / 35 / 0","40점"],["60레벨","16 / 35 / 0","51점"]]
        },
        "links": [
          {
            "label": "19레벨 전투 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6IlJvZ3VlIiwibGV2ZWwiOjE5LCJsZWdhY3kiOjAsImRhdGFSZXZpc2lvbiI6ImNsaWVudC1yZWZlcmVuY2UtMjAyNi0xMS0wNCIsInRhbGVudHMiOltbXSxbWyJDb3VwIGRlIEdyYWNlIiwzXSxbIkVmZmljaWVudCBTdHJpa2VzIiwyXSxbIkRlZmxlY3Rpb24iLDNdLFsiUHJlY2lzaW9uIiwyXV0sW11dfQ"
          },
          {
            "label": "29레벨 전투 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6IlJvZ3VlIiwibGV2ZWwiOjI5LCJsZWdhY3kiOjAsImRhdGFSZXZpc2lvbiI6ImNsaWVudC1yZWZlcmVuY2UtMjAyNi0xMS0wNCIsInRhbGVudHMiOltbXSxbWyJDb3VwIGRlIEdyYWNlIiwzXSxbIkVmZmljaWVudCBTdHJpa2VzIiwyXSxbIkRlZmxlY3Rpb24iLDNdLFsiUHJlY2lzaW9uIiwzXSxbIkVuZHVyYW5jZSIsMl0sWyJSaXBvc3RlIiwxXSxbIkNvbXBvc3VyZSIsMV0sWyJGbGF3bGVzcyBFeGVjdXRpb24iLDFdLFsiV2VhcG9uIEV4cGVydGlzZSIsMV0sWyJBZ2dyZXNzaW9uIiwzXV0sW11dfQ"
          },
          {
            "label": "39레벨 전투 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6IlJvZ3VlIiwibGV2ZWwiOjM5LCJsZWdhY3kiOjAsImRhdGFSZXZpc2lvbiI6ImNsaWVudC1yZWZlcmVuY2UtMjAyNi0xMS0wNCIsInRhbGVudHMiOltbXSxbWyJDb3VwIGRlIEdyYWNlIiwzXSxbIkVmZmljaWVudCBTdHJpa2VzIiwyXSxbIkRlZmxlY3Rpb24iLDNdLFsiUHJlY2lzaW9uIiwzXSxbIkVuZHVyYW5jZSIsMl0sWyJSaXBvc3RlIiwxXSxbIkNvbXBvc3VyZSIsMV0sWyJGbGF3bGVzcyBFeGVjdXRpb24iLDFdLFsiV2VhcG9uIEV4cGVydGlzZSIsMV0sWyJBZ2dyZXNzaW9uIiwzXSxbIkR1YWwgV2llbGQgU3BlY2lhbGl6YXRpb24iLDJdLFsiQmxhZGUgRmx1cnJ5IiwxXSxbIkhhY2sgYW5kIFNsYXNoIiw1XSxbIkZsYXNoIG9mIFN0ZWVsIiwyXV0sW11dfQ"
          },
          {
            "label": "49레벨 전투 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6IlJvZ3VlIiwibGV2ZWwiOjQ5LCJsZWdhY3kiOjAsImRhdGFSZXZpc2lvbiI6ImNsaWVudC1yZWZlcmVuY2UtMjAyNi0xMS0wNCIsInRhbGVudHMiOltbWyJNYWxpY2UiLDVdXSxbWyJDb3VwIGRlIEdyYWNlIiwzXSxbIkVmZmljaWVudCBTdHJpa2VzIiwyXSxbIkRlZmxlY3Rpb24iLDNdLFsiUHJlY2lzaW9uIiwzXSxbIkVuZHVyYW5jZSIsMl0sWyJSaXBvc3RlIiwxXSxbIkNvbXBvc3VyZSIsMV0sWyJGbGF3bGVzcyBFeGVjdXRpb24iLDFdLFsiV2VhcG9uIEV4cGVydGlzZSIsMl0sWyJBZ2dyZXNzaW9uIiwzXSxbIkR1YWwgV2llbGQgU3BlY2lhbGl6YXRpb24iLDJdLFsiQmxhZGUgRmx1cnJ5IiwxXSxbIkhhY2sgYW5kIFNsYXNoIiw1XSxbIkZsYXNoIG9mIFN0ZWVsIiw1XSxbIkFkcmVuYWxpbmUgUnVzaCIsMV1dLFtdXX0"
          },
          {
            "label": "60레벨 전투 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6IlJvZ3VlIiwibGV2ZWwiOjYwLCJsZWdhY3kiOjAsImRhdGFSZXZpc2lvbiI6ImNsaWVudC1yZWZlcmVuY2UtMjAyNi0xMS0wNCIsInRhbGVudHMiOltbWyJSZW1vcnNlbGVzcyBBdHRhY2tzIiwyXSxbIk1hbGljZSIsNV0sWyJSdXRobGVzc25lc3MiLDNdLFsiSW1wcm92ZWQgU2xpY2UgYW5kIERpY2UiLDNdLFsiQmxvb2QgU3BsYXR0ZXIiLDFdLFsiTGV0aGFsaXR5IiwyXV0sW1siQ291cCBkZSBHcmFjZSIsM10sWyJFZmZpY2llbnQgU3RyaWtlcyIsMl0sWyJEZWZsZWN0aW9uIiwzXSxbIlByZWNpc2lvbiIsM10sWyJFbmR1cmFuY2UiLDJdLFsiUmlwb3N0ZSIsMV0sWyJDb21wb3N1cmUiLDFdLFsiRmxhd2xlc3MgRXhlY3V0aW9uIiwxXSxbIldlYXBvbiBFeHBlcnRpc2UiLDJdLFsiQWdncmVzc2lvbiIsM10sWyJEdWFsIFdpZWxkIFNwZWNpYWxpemF0aW9uIiwyXSxbIkJsYWRlIEZsdXJyeSIsMV0sWyJIYWNrIGFuZCBTbGFzaCIsNV0sWyJGbGFzaCBvZiBTdGVlbCIsNV0sWyJBZHJlbmFsaW5lIFJ1c2giLDFdXSxbXV19"
          }
        ],
        "sources": ["tavern-rogue"]
      },
      {
        "id": "practice",
        "title": "육성 중 먼저 익힐 것",
        "items": [
          {"title":"한 무리씩 분리","body":"은신은 모든 적을 건너뛰기 위한 보증이 아닙니다. 싸움을 시작할 곳과 빠져나갈 곳을 먼저 확인하세요."},
          {"title":"자원을 모아 쓰기","body":"기력과 연계 점수를 보고 공격을 이어 갑니다. 곧 끝날 적에게 긴 준비를 하기보다 다음 적에 쓸 자원을 남깁니다."},
          {"title":"무기와 독 준비","body":"자주 쓰는 공격의 무기 조건을 확인합니다. 20레벨 무렵에는 독과 전투 초기화 수단을 배우는 경로도 점검하세요."}
        ],
        "sources": ["tavern-rogue","newPlayer"]
      },
      {
        "id": "next",
        "title": "다음 지역과 던전 준비",
        "items": [{"title":"훈련비와 보급품","body":"새 레벨에서는 상급자와 마법책을 확인하고, 음식·음료·수리·이동 비용을 남겨 둡니다. 장비는 자신의 직업과 무기에 맞는지 비교하세요."}],
        "links": [{"label":"종족별 레벨업 동선","path":"/forever/leveling#race-guides"},{"label":"캠핑·유산으로 성장 이어 가기","path":"/forever/growth"}],
        "sources": ["newPlayer","camping","legacy"]
      }
    ]
  },
  "classes/priest": {
    "title": "포에버 사제 특성·레벨링",
    "label": "사제",
    "parent": "classes",
    "lead": "혼자 퀘스트하는 시간이 길다면 암흑, 던전 치유를 자주 섞는다면 수양을 비교합니다. 마법봉과 회복 주기가 초반 진행에 큰 영향을 줍니다.",
    "art": {"id":"basic-trainer","kind":"square","alt":"마법책을 펼친 모험가에게 직업 상급자가 능력을 가르치는 도트 그림"},
    "sections": [
      {
        "id": "path",
        "title": "내 활동에 맞는 특성 경로",
        "lead": "아래 추천은 Forever Tavern의 레벨링 견본을 추린 것입니다. 레이드·PvP의 최종 순위나 모든 상황의 정답을 뜻하지 않습니다.",
        "items": [
          {"title":"암흑 · 혼자 퀘스트","body":"처치 후 마나 회복과 지속 피해를 활용하는 경로입니다. 견본은 초반부터 암흑에 투자하고 40레벨의 전환점을 향합니다."},
          {"title":"수양 · 퀘스트와 치유 병행","body":"초반 마법봉 활용과 파티 치유를 함께 고려합니다. 던전에서는 입장 전에 공격과 치유 중 맡을 역할을 정하세요."}
        ],
        "sources": ["tavern-priest"]
      },
      {
        "id": "talents",
        "title": "암흑 특성 배분 견본",
        "lead": "표는 유산으로 특성 점수를 앞당기지 않은 기준입니다. 배분 숫자는 수양 / 신성 / 암흑 순서이며 각 분야의 누적 점수입니다. 같은 합계여도 세부 배치가 다를 수 있으니, 해당 레벨의 계산기에서 찍는 순서와 각 효과를 함께 확인하세요.",
        "table": {
          "columns": ["레벨","수양 / 신성 / 암흑","총 투자"],
          "rows": [["19레벨","0 / 0 / 10","10점"],["29레벨","0 / 0 / 20","20점"],["39레벨","0 / 0 / 30","30점"],["49레벨","0 / 0 / 40","40점"],["60레벨","10 / 0 / 41","51점"]]
        },
        "links": [
          {
            "label": "19레벨 암흑 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6IlByaWVzdCIsImxldmVsIjoxOSwibGVnYWN5IjowLCJkYXRhUmV2aXNpb24iOiJjbGllbnQtcmVmZXJlbmNlLTIwMjYtMTEtMDQiLCJ0YWxlbnRzIjpbW10sW10sW1siU2hhZG93IEZvY3VzIiw1XSxbIlNwaXJpdCBUYXAiLDVdXV19"
          },
          {
            "label": "29레벨 암흑 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6IlByaWVzdCIsImxldmVsIjoyOSwibGVnYWN5IjowLCJkYXRhUmV2aXNpb24iOiJjbGllbnQtcmVmZXJlbmNlLTIwMjYtMTEtMDQiLCJ0YWxlbnRzIjpbW10sW10sW1siU2hhZG93IEZvY3VzIiw1XSxbIlNwaXJpdCBUYXAiLDVdLFsiSW1wcm92ZWQgU2hhZG93IFdvcmQ6IFBhaW4iLDJdLFsiTWluZCBGbGF5IiwxXSxbIkltcHJvdmVkIE1pbmQgRmxheSIsMl0sWyJEYXJrIEluc3BpcmF0aW9uIiwxXSxbIlZhbXBpcmljIEVtYnJhY2UiLDFdLFsiU2hhZG93IFdlYXZpbmciLDNdXV19"
          },
          {
            "label": "39레벨 암흑 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6IlByaWVzdCIsImxldmVsIjozOSwibGVnYWN5IjowLCJkYXRhUmV2aXNpb24iOiJjbGllbnQtcmVmZXJlbmNlLTIwMjYtMTEtMDQiLCJ0YWxlbnRzIjpbW10sW10sW1siU2hhZG93IEZvY3VzIiw1XSxbIlNwaXJpdCBUYXAiLDVdLFsiSW1wcm92ZWQgU2hhZG93IFdvcmQ6IFBhaW4iLDJdLFsiTWluZCBGbGF5IiwxXSxbIkltcHJvdmVkIE1pbmQgRmxheSIsMl0sWyJEYXJrIEluc3BpcmF0aW9uIiw0XSxbIlZhbXBpcmljIEVtYnJhY2UiLDFdLFsiU2hhZG93IFdlYXZpbmciLDNdLFsiRGV2b3VyaW5nIENvbnRhZ2lvbiIsMl0sWyJEYXJrbmVzcyIsNV1dXX0"
          },
          {
            "label": "49레벨 암흑 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6IlByaWVzdCIsImxldmVsIjo0OSwibGVnYWN5IjowLCJkYXRhUmV2aXNpb24iOiJjbGllbnQtcmVmZXJlbmNlLTIwMjYtMTEtMDQiLCJ0YWxlbnRzIjpbW10sW10sW1siU2hhZG93IEZvY3VzIiw1XSxbIlNwaXJpdCBUYXAiLDVdLFsiSW1wcm92ZWQgTWluZCBCbGFzdCIsNV0sWyJJbXByb3ZlZCBTaGFkb3cgV29yZDogUGFpbiIsMl0sWyJTaGFkb3cgUmVhY2giLDFdLFsiTWluZCBGbGF5IiwxXSxbIkltcHJvdmVkIE1pbmQgRmxheSIsMl0sWyJEYXJrIEluc3BpcmF0aW9uIiw1XSxbIlZhbXBpcmljIEVtYnJhY2UiLDFdLFsiU2hhZG93IFdlYXZpbmciLDNdLFsiRGV2b3VyaW5nIENvbnRhZ2lvbiIsMl0sWyJFYXJseSBEZW1pc2UiLDJdLFsiRGFya25lc3MiLDVdLFsiU2hhZG93Zm9ybSIsMV1dXX0"
          },
          {
            "label": "60레벨 암흑 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6IlByaWVzdCIsImxldmVsIjo2MCwibGVnYWN5IjowLCJkYXRhUmV2aXNpb24iOiJjbGllbnQtcmVmZXJlbmNlLTIwMjYtMTEtMDQiLCJ0YWxlbnRzIjpbW1siUG93ZXIgaW4gTGlnaHQiLDJdLFsiV2FuZCBTcGVjaWFsaXphdGlvbiIsMl0sWyJUd2luIERpc2NpcGxpbmVzIiw1XSxbIk1lbnRhbCBTdHJlbmd0aCIsMV1dLFtdLFtbIlNoYWRvdyBGb2N1cyIsNV0sWyJTcGlyaXQgVGFwIiw1XSxbIkltcHJvdmVkIE1pbmQgQmxhc3QiLDVdLFsiSW1wcm92ZWQgU2hhZG93IFdvcmQ6IFBhaW4iLDJdLFsiU2hhZG93IFJlYWNoIiwyXSxbIk1pbmQgRmxheSIsMV0sWyJJbXByb3ZlZCBNaW5kIEZsYXkiLDJdLFsiRGFyayBJbnNwaXJhdGlvbiIsNV0sWyJWYW1waXJpYyBFbWJyYWNlIiwxXSxbIlNoYWRvdyBXZWF2aW5nIiwzXSxbIkRldm91cmluZyBDb250YWdpb24iLDJdLFsiRWFybHkgRGVtaXNlIiwyXSxbIkRhcmtuZXNzIiw1XSxbIlNoYWRvd2Zvcm0iLDFdXV19"
          }
        ],
        "sources": ["tavern-priest"]
      },
      {
        "id": "practice",
        "title": "육성 중 먼저 익힐 것",
        "items": [
          {"title":"마법봉 확인","body":"사용 가능한 마법봉을 구하면 낮은 체력의 적을 추가 마나 소모 없이 마무리할 수 있습니다. 장비 교체 때도 함께 비교하세요."},
          {"title":"짧은 전투에는 짧은 준비","body":"지속 피해가 충분히 적용될 적인지 판단합니다. 곧 죽을 적에게 주문을 더 쌓으면 다음 전투의 마나가 줄어듭니다."},
          {"title":"다른 트리의 비용","body":"초반 점수를 다른 분야에 쓰면 암흑 핵심 단계가 그만큼 늦어집니다. 표의 한 경로를 따르며 변경 이유를 분명히 하세요."}
        ],
        "sources": ["tavern-priest","newPlayer"]
      },
      {
        "id": "next",
        "title": "다음 지역과 던전 준비",
        "items": [{"title":"훈련비와 보급품","body":"새 레벨에서는 상급자와 마법책을 확인하고, 음식·음료·수리·이동 비용을 남겨 둡니다. 장비는 자신의 직업과 무기에 맞는지 비교하세요."}],
        "links": [{"label":"종족별 레벨업 동선","path":"/forever/leveling#race-guides"},{"label":"캠핑·유산으로 성장 이어 가기","path":"/forever/growth"}],
        "sources": ["newPlayer","camping","legacy"]
      }
    ]
  },
  "classes/shaman": {
    "title": "포에버 주술사 특성·레벨링",
    "label": "주술사",
    "parent": "classes",
    "lead": "양손 무기를 쓰는 고양 경로를 혼자 퀘스트용 견본으로 정리했습니다. 모든 토템과 주문을 매번 쓰기보다 필요한 것만 고릅니다.",
    "art": {"id":"basic-trainer","kind":"square","alt":"마법책을 펼친 모험가에게 직업 상급자가 능력을 가르치는 도트 그림"},
    "sections": [
      {
        "id": "path",
        "title": "내 활동에 맞는 특성 경로",
        "lead": "아래 추천은 Forever Tavern의 레벨링 견본을 추린 것입니다. 레이드·PvP의 최종 순위나 모든 상황의 정답을 뜻하지 않습니다.",
        "items": [
          {"title":"고양 · 근접 퀘스트","body":"느리고 유용한 양손 무기를 중심으로 진행하며, 평소 마나 지출을 줄이고 치유할 여유를 남기는 경로입니다."},
          {"title":"정기 · 원거리 주문","body":"거리를 확보하고 주문으로 싸웁니다. 제어와 음료를 통한 회복 시간을 포함해 자신의 진행 속도를 비교하세요."},
          {"title":"복원 · 파티 치유","body":"정기적인 던전 치유나 동료와 함께하는 육성에 맞춰 비교합니다. 혼자 전투하는 비중이 크면 다른 경로도 살펴보세요."}
        ],
        "sources": ["tavern-shaman"]
      },
      {
        "id": "talents",
        "title": "고양 특성 배분 견본",
        "lead": "표는 유산으로 특성 점수를 앞당기지 않은 기준입니다. 배분 숫자는 정기 / 고양 / 복원 순서이며 각 분야의 누적 점수입니다. 같은 합계여도 세부 배치가 다를 수 있으니, 해당 레벨의 계산기에서 찍는 순서와 각 효과를 함께 확인하세요.",
        "table": {"columns":["레벨","정기 / 고양 / 복원","총 투자"],"rows":[["20레벨","0 / 11 / 0","11점"],["30레벨","0 / 21 / 0","21점"],["40레벨","0 / 31 / 0","31점"],["60레벨","0 / 40 / 11","51점"]]},
        "links": [
          {
            "label": "20레벨 고양 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6IlNoYW1hbiIsImxldmVsIjoyMCwibGVnYWN5IjowLCJkYXRhUmV2aXNpb24iOiJjbGllbnQtcmVmZXJlbmNlLTIwMjYtMTEtMDQiLCJ0YWxlbnRzIjpbW10sW1siVGh1bmRlcmluZyBTdHJpa2VzIiw1XSxbIk1lbnRhbCBEZXh0ZXJpdHkiLDNdLFsiSW1wcm92ZWQgTGlnaHRuaW5nIFNoaWVsZCIsMl0sWyJTaGFtYW5pc3RpYyBGb2N1cyIsMV1dLFtdXX0"
          },
          {
            "label": "30레벨 고양 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6IlNoYW1hbiIsImxldmVsIjozMCwibGVnYWN5IjowLCJkYXRhUmV2aXNpb24iOiJjbGllbnQtcmVmZXJlbmNlLTIwMjYtMTEtMDQiLCJ0YWxlbnRzIjpbW10sW1siVGh1bmRlcmluZyBTdHJpa2VzIiw1XSxbIk1lbnRhbCBEZXh0ZXJpdHkiLDNdLFsiSW1wcm92ZWQgTGlnaHRuaW5nIFNoaWVsZCIsM10sWyJFbGVtZW50YWwgV2VhcG9ucyIsM10sWyJTaGFtYW5pc3RpYyBGb2N1cyIsMV0sWyJGbHVycnkiLDJdLFsiU3Rvcm1zdHJpa2UiLDFdLFsiSW1wcm92ZWQgR2hvc3QgV29sZiIsMl0sWyJJbXByb3ZlZCBTdG9ybXN0cmlrZSIsMV1dLFtdXX0"
          },
          {
            "label": "40레벨 고양 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6IlNoYW1hbiIsImxldmVsIjo0MCwibGVnYWN5IjowLCJkYXRhUmV2aXNpb24iOiJjbGllbnQtcmVmZXJlbmNlLTIwMjYtMTEtMDQiLCJ0YWxlbnRzIjpbW10sW1siVGh1bmRlcmluZyBTdHJpa2VzIiw1XSxbIk1lbnRhbCBEZXh0ZXJpdHkiLDNdLFsiSW1wcm92ZWQgTGlnaHRuaW5nIFNoaWVsZCIsM10sWyJFbGVtZW50YWwgV2VhcG9ucyIsM10sWyJTaGFtYW5pc3RpYyBGb2N1cyIsMV0sWyJGbHVycnkiLDJdLFsiU3Rvcm1zdHJpa2UiLDFdLFsiSW1wcm92ZWQgR2hvc3QgV29sZiIsMl0sWyJTcGlyaXQgV2VhcG9ucyIsMV0sWyJNZW50YWwgUXVpY2tuZXNzIiwyXSxbIkltcHJvdmVkIFN0b3Jtc3RyaWtlIiwyXSxbIk1hZWxzdHJvbSBXZWFwb24iLDVdLFsiUmFnZSBvZiB0aGUgRmFyc2VlciIsMV1dLFtdXX0"
          },
          {
            "label": "60레벨 고양 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6IlNoYW1hbiIsImxldmVsIjo2MCwibGVnYWN5IjowLCJkYXRhUmV2aXNpb24iOiJjbGllbnQtcmVmZXJlbmNlLTIwMjYtMTEtMDQiLCJ0YWxlbnRzIjpbW10sW1siVGh1bmRlcmluZyBTdHJpa2VzIiw1XSxbIk1lbnRhbCBEZXh0ZXJpdHkiLDNdLFsiSW1wcm92ZWQgTGlnaHRuaW5nIFNoaWVsZCIsM10sWyJFbGVtZW50YWwgV2VhcG9ucyIsM10sWyJTaGFtYW5pc3RpYyBGb2N1cyIsMV0sWyJBbnRpY2lwYXRpb24iLDFdLFsiVG91Z2huZXNzIiw1XSxbIkZsdXJyeSIsNV0sWyJTdG9ybXN0cmlrZSIsMV0sWyJJbXByb3ZlZCBHaG9zdCBXb2xmIiwyXSxbIlNwaXJpdCBXZWFwb25zIiwxXSxbIk1lbnRhbCBRdWlja25lc3MiLDJdLFsiSW1wcm92ZWQgU3Rvcm1zdHJpa2UiLDJdLFsiTWFlbHN0cm9tIFdlYXBvbiIsNV0sWyJSYWdlIG9mIHRoZSBGYXJzZWVyIiwxXV0sW1siVGlkYWwgRm9jdXMiLDVdLFsiTWluZGZ1bG5lc3MiLDNdLFsiVG90ZW1pYyBGb2N1cyIsMl0sWyJXYXRlciBTaGllbGQiLDFdXV19"
          }
        ],
        "sources": ["tavern-shaman"]
      },
      {
        "id": "practice",
        "title": "육성 중 먼저 익힐 것",
        "items": [
          {"title":"토템 퀘스트 확인","body":"4·10·20·30레벨 무렵 상급자에게 직업 퀘스트를 확인합니다. 종족마다 실제로 제시되는 경로를 따르세요."},
          {"title":"치유할 마나 남기기","body":"원거리에서 적을 유인한 뒤 근접으로 마무리하는 흐름을 익힙니다. 주문을 다 쓰고 나서 회복 수단을 찾지 않도록 합니다."},
          {"title":"한 전투에 필요한 설비만","body":"토템을 놓는 비용과 전투 시간을 함께 봅니다. 짧은 전투마다 전부 다시 놓기보다 필요한 효과를 선택하세요."}
        ],
        "sources": ["tavern-shaman","newPlayer"]
      },
      {
        "id": "next",
        "title": "다음 지역과 던전 준비",
        "items": [{"title":"훈련비와 보급품","body":"새 레벨에서는 상급자와 마법책을 확인하고, 음식·음료·수리·이동 비용을 남겨 둡니다. 장비는 자신의 직업과 무기에 맞는지 비교하세요."}],
        "links": [{"label":"종족별 레벨업 동선","path":"/forever/leveling#race-guides"},{"label":"캠핑·유산으로 성장 이어 가기","path":"/forever/growth"}],
        "sources": ["newPlayer","camping","legacy"]
      }
    ]
  },
  "classes/mage": {
    "title": "포에버 마법사 특성·레벨링",
    "label": "마법사",
    "parent": "classes",
    "lead": "혼자 진행하는 첫 경로에는 단일 대상 냉기를 기본 견본으로 삼았습니다. 적과의 거리를 유지하고 회복 시간을 예측하는 쪽에 초점을 둡니다.",
    "art": {"id":"basic-trainer","kind":"square","alt":"마법책을 펼친 모험가에게 직업 상급자가 능력을 가르치는 도트 그림"},
    "sections": [
      {
        "id": "path",
        "title": "내 활동에 맞는 특성 경로",
        "lead": "아래 추천은 Forever Tavern의 레벨링 견본을 추린 것입니다. 레이드·PvP의 최종 순위나 모든 상황의 정답을 뜻하지 않습니다.",
        "items": [
          {"title":"냉기 · 한 마리씩","body":"둔화와 빙결로 주문을 시전할 공간을 만드는 경로입니다. 퀘스트와 던전을 섞는 일상적인 진행부터 익히세요."},
          {"title":"냉기 · 광역","body":"근접 적을 한곳에 모아 이동시키는 경로입니다. 비슷한 레벨의 적, 넓은 공간, 확실한 퇴로가 반복해서 확보될 때 비교합니다."}
        ],
        "sources": ["tavern-mage"]
      },
      {
        "id": "talents",
        "title": "냉기 · 단일 특성 배분 견본",
        "lead": "표는 유산으로 특성 점수를 앞당기지 않은 기준입니다. 배분 숫자는 비전 / 화염 / 냉기 순서이며 각 분야의 누적 점수입니다. 같은 합계여도 세부 배치가 다를 수 있으니, 해당 레벨의 계산기에서 찍는 순서와 각 효과를 함께 확인하세요.",
        "table": {
          "columns": ["레벨","비전 / 화염 / 냉기","총 투자"],
          "rows": [["19레벨","0 / 0 / 10","10점"],["29레벨","0 / 0 / 20","20점"],["39레벨","0 / 0 / 30","30점"],["49레벨","3 / 0 / 37","40점"],["60레벨","14 / 0 / 37","51점"]]
        },
        "links": [
          {
            "label": "19레벨 냉기 · 단일 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6Ik1hZ2UiLCJsZXZlbCI6MTksImxlZ2FjeSI6MCwiZGF0YVJldmlzaW9uIjoiY2xpZW50LXJlZmVyZW5jZS0yMDI2LTExLTA0IiwidGFsZW50cyI6W1tdLFtdLFtbIkltcHJvdmVkIEZyb3N0Ym9sdCIsNV0sWyJQcmVjaXNpb24iLDNdLFsiUGVybWFmcm9zdCIsMl1dXX0"
          },
          {
            "label": "29레벨 냉기 · 단일 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6Ik1hZ2UiLCJsZXZlbCI6MjksImxlZ2FjeSI6MCwiZGF0YVJldmlzaW9uIjoiY2xpZW50LXJlZmVyZW5jZS0yMDI2LTExLTA0IiwidGFsZW50cyI6W1tdLFtdLFtbIkltcHJvdmVkIEZyb3N0Ym9sdCIsNV0sWyJQcmVjaXNpb24iLDNdLFsiUGVybWFmcm9zdCIsM10sWyJGcm9zdCBDaGFubmVsaW5nIiwzXSxbIkljZSBMYW5jZSIsMV0sWyJBcmN0aWMgUmVhY2giLDJdLFsiSWNlIEJsb2NrIiwxXSxbIlNoYXR0ZXIiLDJdXV19"
          },
          {
            "label": "39레벨 냉기 · 단일 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6Ik1hZ2UiLCJsZXZlbCI6MzksImxlZ2FjeSI6MCwiZGF0YVJldmlzaW9uIjoiY2xpZW50LXJlZmVyZW5jZS0yMDI2LTExLTA0IiwidGFsZW50cyI6W1tdLFtdLFtbIkltcHJvdmVkIEZyb3N0Ym9sdCIsNV0sWyJQcmVjaXNpb24iLDNdLFsiSWNlIFNoYXJkcyIsM10sWyJGcm9zdGJpdGUiLDNdLFsiUGVybWFmcm9zdCIsM10sWyJGcm9zdCBDaGFubmVsaW5nIiwzXSxbIkljZSBMYW5jZSIsMV0sWyJBcmN0aWMgUmVhY2giLDJdLFsiSWNlIEJsb2NrIiwxXSxbIlNoYXR0ZXIiLDNdLFsiQ29sZCBTbmFwIiwxXSxbIkZpbmdlcnMgb2YgRnJvc3QiLDJdXV19"
          },
          {
            "label": "49레벨 냉기 · 단일 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6Ik1hZ2UiLCJsZXZlbCI6NDksImxlZ2FjeSI6MCwiZGF0YVJldmlzaW9uIjoiY2xpZW50LXJlZmVyZW5jZS0yMDI2LTExLTA0IiwidGFsZW50cyI6W1tbIkFyY2FuZSBSZXNpbGllbmNlIiwzXV0sW10sW1siRnJvc3QgV2FyZGluZyIsMl0sWyJJbXByb3ZlZCBGcm9zdGJvbHQiLDVdLFsiUHJlY2lzaW9uIiwzXSxbIkljZSBTaGFyZHMiLDVdLFsiRnJvc3RiaXRlIiwzXSxbIkltcHJvdmVkIEZyb3N0IE5vdmEiLDJdLFsiUGVybWFmcm9zdCIsM10sWyJGcm9zdCBDaGFubmVsaW5nIiwzXSxbIkljZSBMYW5jZSIsMV0sWyJBcmN0aWMgUmVhY2giLDJdLFsiSWNlIEJsb2NrIiwxXSxbIlNoYXR0ZXIiLDNdLFsiQ29sZCBTbmFwIiwxXSxbIkZpbmdlcnMgb2YgRnJvc3QiLDJdLFsiSWNlIEJhcnJpZXIiLDFdXV19"
          },
          {
            "label": "60레벨 냉기 · 단일 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6Ik1hZ2UiLCJsZXZlbCI6NjAsImxlZ2FjeSI6MCwiZGF0YVJldmlzaW9uIjoiY2xpZW50LXJlZmVyZW5jZS0yMDI2LTExLTA0IiwidGFsZW50cyI6W1tbIkltcHJvdmVkIENoYW5uZWxpbmciLDJdLFsiQXJjYW5lIFJlc2lsaWVuY2UiLDNdLFsiQXJjYW5lIFN1YnRsZXR5IiwyXSxbIk1hZ2ljIEFic29ycHRpb24iLDJdLFsiQXJjYW5lIENvbmNlbnRyYXRpb24iLDVdXSxbXSxbWyJGcm9zdCBXYXJkaW5nIiwyXSxbIkltcHJvdmVkIEZyb3N0Ym9sdCIsNV0sWyJQcmVjaXNpb24iLDNdLFsiSWNlIFNoYXJkcyIsNV0sWyJGcm9zdGJpdGUiLDNdLFsiSW1wcm92ZWQgRnJvc3QgTm92YSIsMl0sWyJQZXJtYWZyb3N0IiwzXSxbIkZyb3N0IENoYW5uZWxpbmciLDNdLFsiSWNlIExhbmNlIiwxXSxbIkFyY3RpYyBSZWFjaCIsMl0sWyJJY2UgQmxvY2siLDFdLFsiU2hhdHRlciIsM10sWyJDb2xkIFNuYXAiLDFdLFsiRmluZ2VycyBvZiBGcm9zdCIsMl0sWyJJY2UgQmFycmllciIsMV1dXX0"
          }
        ],
        "sources": ["tavern-mage"]
      },
      {
        "id": "practice",
        "title": "육성 중 먼저 익힐 것",
        "items": [
          {"title":"마나와 퇴로 확인","body":"공격을 시작하기 전에 물러날 방향과 주변 적을 확인합니다. 큰 무리를 모을수록 계획이 깨졌을 때의 비용도 커집니다."},
          {"title":"광역과 단일 견본 구분","body":"단일 대상 견본의 배분을 광역 전용 경로라고 생각하지 않습니다. 아래 표와 계산기는 단일 대상 냉기 경로입니다."},
          {"title":"회복 시간을 일정에 포함","body":"피해량만으로 속도를 판단하지 않습니다. 음료를 챙기고 제어에 쓸 마나를 남겨 위험한 연속 전투를 피하세요."}
        ],
        "sources": ["tavern-mage","newPlayer"]
      },
      {
        "id": "next",
        "title": "다음 지역과 던전 준비",
        "items": [{"title":"훈련비와 보급품","body":"새 레벨에서는 상급자와 마법책을 확인하고, 음식·음료·수리·이동 비용을 남겨 둡니다. 장비는 자신의 직업과 무기에 맞는지 비교하세요."}],
        "links": [{"label":"종족별 레벨업 동선","path":"/forever/leveling#race-guides"},{"label":"캠핑·유산으로 성장 이어 가기","path":"/forever/growth"}],
        "sources": ["newPlayer","camping","legacy"]
      }
    ]
  },
  "classes/warlock": {
    "title": "포에버 흑마법사 특성·레벨링",
    "label": "흑마법사",
    "parent": "classes",
    "lead": "일반적인 혼자 퀘스트는 지속 피해와 흡수를 활용하는 고통을, 소환수 생존과 방어를 더 중시하면 악마를 비교합니다.",
    "art": {"id":"basic-trainer","kind":"square","alt":"마법책을 펼친 모험가에게 직업 상급자가 능력을 가르치는 도트 그림"},
    "sections": [
      {
        "id": "path",
        "title": "내 활동에 맞는 특성 경로",
        "lead": "아래 추천은 Forever Tavern의 레벨링 견본을 추린 것입니다. 레이드·PvP의 최종 순위나 모든 상황의 정답을 뜻하지 않습니다.",
        "items": [
          {"title":"고통 · 지속 피해와 흡수","body":"지속 피해가 돌아가는 동안 체력과 마나를 관리하는 경로입니다. 약한 적에게 긴 준비를 하면 오히려 자원이 낭비됩니다."},
          {"title":"악마 · 소환수와 생존","body":"소환수를 유지하며 싸우는 경로입니다. PvP 규칙이나 생존 여유를 더 원하는 경우 비교할 수 있습니다."}
        ],
        "sources": ["tavern-warlock"]
      },
      {
        "id": "talents",
        "title": "고통 특성 배분 견본",
        "lead": "표는 유산으로 특성 점수를 앞당기지 않은 기준입니다. 배분 숫자는 고통 / 악마 / 파괴 순서이며 각 분야의 누적 점수입니다. 같은 합계여도 세부 배치가 다를 수 있으니, 해당 레벨의 계산기에서 찍는 순서와 각 효과를 함께 확인하세요.",
        "table": {
          "columns": ["레벨","고통 / 악마 / 파괴","총 투자"],
          "rows": [["19레벨","10 / 0 / 0","10점"],["29레벨","20 / 0 / 0","20점"],["39레벨","30 / 0 / 0","30점"],["49레벨","31 / 9 / 0","40점"],["60레벨","31 / 20 / 0","51점"]]
        },
        "links": [
          {
            "label": "19레벨 고통 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6IldhcmxvY2siLCJsZXZlbCI6MTksImxlZ2FjeSI6MCwiZGF0YVJldmlzaW9uIjoiY2xpZW50LXJlZmVyZW5jZS0yMDI2LTExLTA0IiwidGFsZW50cyI6W1tbIkltcHJvdmVkIExpZmUgVGFwIiwyXSxbIkltcHJvdmVkIENvcnJ1cHRpb24iLDVdLFsiSW1wcm92ZWQgRHJhaW5zIiwzXV0sW10sW11dfQ"
          },
          {
            "label": "29레벨 고통 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6IldhcmxvY2siLCJsZXZlbCI6MjksImxlZ2FjeSI6MCwiZGF0YVJldmlzaW9uIjoiY2xpZW50LXJlZmVyZW5jZS0yMDI2LTExLTA0IiwidGFsZW50cyI6W1tbIkltcHJvdmVkIExpZmUgVGFwIiwyXSxbIlN1cHByZXNzaW9uIiwxXSxbIkltcHJvdmVkIENvcnJ1cHRpb24iLDVdLFsiR3JpbSBSZWFjaCIsMl0sWyJTb3VsIEhhcnZlc3QiLDJdLFsiSW1wcm92ZWQgRHJhaW5zIiwzXSxbIkZlbCBDb25jZW50cmF0aW9uIiwzXSxbIk5pZ2h0ZmFsbCIsMl1dLFtdLFtdXX0"
          },
          {
            "label": "39레벨 고통 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6IldhcmxvY2siLCJsZXZlbCI6MzksImxlZ2FjeSI6MCwiZGF0YVJldmlzaW9uIjoiY2xpZW50LXJlZmVyZW5jZS0yMDI2LTExLTA0IiwidGFsZW50cyI6W1tbIkltcHJvdmVkIExpZmUgVGFwIiwyXSxbIlN1cHByZXNzaW9uIiwyXSxbIkltcHJvdmVkIENvcnJ1cHRpb24iLDVdLFsiR3JpbSBSZWFjaCIsMl0sWyJTb3VsIEhhcnZlc3QiLDJdLFsiSW1wcm92ZWQgRHJhaW5zIiwzXSxbIkZlbCBDb25jZW50cmF0aW9uIiwzXSxbIk5pZ2h0ZmFsbCIsMl0sWyJTaXBob24gTGlmZSIsMV0sWyJTb3VsIFNpcGhvbiIsM10sWyJTaGFkb3cgTWFzdGVyeSIsNV1dLFtdLFtdXX0"
          },
          {
            "label": "49레벨 고통 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6IldhcmxvY2siLCJsZXZlbCI6NDksImxlZ2FjeSI6MCwiZGF0YVJldmlzaW9uIjoiY2xpZW50LXJlZmVyZW5jZS0yMDI2LTExLTA0IiwidGFsZW50cyI6W1tbIkltcHJvdmVkIExpZmUgVGFwIiwyXSxbIlN1cHByZXNzaW9uIiwyXSxbIkltcHJvdmVkIENvcnJ1cHRpb24iLDVdLFsiR3JpbSBSZWFjaCIsMl0sWyJTb3VsIEhhcnZlc3QiLDJdLFsiSW1wcm92ZWQgRHJhaW5zIiwzXSxbIkZlbCBDb25jZW50cmF0aW9uIiwzXSxbIk5pZ2h0ZmFsbCIsMl0sWyJTaXBob24gTGlmZSIsMV0sWyJTb3VsIFNpcGhvbiIsM10sWyJTaGFkb3cgTWFzdGVyeSIsNV0sWyJXcmFjayIsMV1dLFtbIkRlbW9uaWMgRW1icmFjZSIsNV0sWyJGZWwgVml0YWxpdHkiLDJdLFsiRGVtb25pYyBFbmVyZ2llcyIsMl1dLFtdXX0"
          },
          {
            "label": "60레벨 고통 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6IldhcmxvY2siLCJsZXZlbCI6NjAsImxlZ2FjeSI6MCwiZGF0YVJldmlzaW9uIjoiY2xpZW50LXJlZmVyZW5jZS0yMDI2LTExLTA0IiwidGFsZW50cyI6W1tbIkltcHJvdmVkIExpZmUgVGFwIiwyXSxbIlN1cHByZXNzaW9uIiwyXSxbIkltcHJvdmVkIENvcnJ1cHRpb24iLDVdLFsiR3JpbSBSZWFjaCIsMl0sWyJTb3VsIEhhcnZlc3QiLDJdLFsiSW1wcm92ZWQgRHJhaW5zIiwzXSxbIkZlbCBDb25jZW50cmF0aW9uIiwzXSxbIk5pZ2h0ZmFsbCIsMl0sWyJTaXBob24gTGlmZSIsMV0sWyJTb3VsIFNpcGhvbiIsM10sWyJTaGFkb3cgTWFzdGVyeSIsNV0sWyJXcmFjayIsMV1dLFtbIkRlbW9uaWMgRW1icmFjZSIsNV0sWyJVbmhvbHkgUG93ZXIiLDVdLFsiSW1wcm92ZWQgVm9pZHdhbGtlciIsMl0sWyJGZWwgVml0YWxpdHkiLDNdLFsiRGVtb25pYyBFbmVyZ2llcyIsMl0sWyJNYXN0ZXIgU3VtbW9uZXIiLDJdLFsiRmVsIERvbWluYXRpb24iLDFdXSxbXV19"
          }
        ],
        "sources": ["tavern-warlock"]
      },
      {
        "id": "practice",
        "title": "육성 중 먼저 익힐 것",
        "items": [
          {"title":"소환수 퀘스트부터","body":"시작 지역과 이후 상급자가 주는 직업 퀘스트를 확인합니다. 악마를 얻는 절차와 특성 투자는 서로 다른 조건입니다."},
          {"title":"체력도 자원","body":"체력·마나·소환수 상태를 함께 봅니다. 다음 전투와 회복에 필요한 여유를 남기고 음식과 음료를 챙깁니다."},
          {"title":"조각과 가방 관리","body":"영혼의 조각과 소환수 교체에 필요한 공간을 확보합니다. 약한 적에게는 지속 피해를 모두 쌓기보다 적은 자원으로 마무리하세요."}
        ],
        "sources": ["tavern-warlock","newPlayer"]
      },
      {
        "id": "next",
        "title": "다음 지역과 던전 준비",
        "items": [{"title":"훈련비와 보급품","body":"새 레벨에서는 상급자와 마법책을 확인하고, 음식·음료·수리·이동 비용을 남겨 둡니다. 장비는 자신의 직업과 무기에 맞는지 비교하세요."}],
        "links": [{"label":"종족별 레벨업 동선","path":"/forever/leveling#race-guides"},{"label":"캠핑·유산으로 성장 이어 가기","path":"/forever/growth"}],
        "sources": ["newPlayer","camping","legacy"]
      }
    ]
  },
  "classes/druid": {
    "title": "포에버 드루이드 특성·레벨링",
    "label": "드루이드",
    "parent": "classes",
    "lead": "야성 한 경로에서 표범으로 퀘스트하고 곰으로 적 무리와 던전에 대응하는 견본입니다. 변신을 배우는 직업 퀘스트가 진행의 전환점입니다.",
    "art": {"id":"basic-trainer","kind":"square","alt":"마법책을 펼친 모험가에게 직업 상급자가 능력을 가르치는 도트 그림"},
    "sections": [
      {
        "id": "path",
        "title": "내 활동에 맞는 특성 경로",
        "lead": "아래 추천은 Forever Tavern의 레벨링 견본을 추린 것입니다. 레이드·PvP의 최종 순위나 모든 상황의 정답을 뜻하지 않습니다.",
        "items": [
          {"title":"야성 · 퀘스트와 탱킹","body":"20레벨 이전에는 주문과 곰을 활용하고, 이후 표범과 곰을 상황에 맞게 바꿉니다. 한 견본으로 두 형태를 운용합니다."},
          {"title":"다른 역할도 준비","body":"주문 공격이나 치유를 자주 한다면 그 역할에 맞는 특성과 장비를 별도로 비교하세요. 여기의 배분은 야성 레벨링 견본입니다."}
        ],
        "sources": ["tavern-druid"]
      },
      {
        "id": "talents",
        "title": "야성 특성 배분 견본",
        "lead": "표는 유산으로 특성 점수를 앞당기지 않은 기준입니다. 배분 숫자는 조화 / 야성 / 복원 순서이며 각 분야의 누적 점수입니다. 같은 합계여도 세부 배치가 다를 수 있으니, 해당 레벨의 계산기에서 찍는 순서와 각 효과를 함께 확인하세요.",
        "table": {"columns":["레벨","조화 / 야성 / 복원","총 투자"],"rows":[["20레벨","0 / 11 / 0","11점"],["29레벨","0 / 20 / 0","20점"],["39레벨","0 / 30 / 0","30점"],["60레벨","9 / 32 / 10","51점"]]},
        "links": [
          {
            "label": "20레벨 야성 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6IkRydWlkIiwibGV2ZWwiOjIwLCJsZWdhY3kiOjAsImRhdGFSZXZpc2lvbiI6ImNsaWVudC1yZWZlcmVuY2UtMjAyNi0xMS0wNCIsInRhbGVudHMiOltbXSxbWyJGZXJvY2l0eSIsMl0sWyJGdXJvciIsNV0sWyJGZXJhbCBTd2lmdG5lc3MiLDJdLFsiQnJ1dGFsIEltcGFjdCIsMl1dLFtdXX0"
          },
          {
            "label": "29레벨 야성 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6IkRydWlkIiwibGV2ZWwiOjI5LCJsZWdhY3kiOjAsImRhdGFSZXZpc2lvbiI6ImNsaWVudC1yZWZlcmVuY2UtMjAyNi0xMS0wNCIsInRhbGVudHMiOltbXSxbWyJGZXJvY2l0eSIsMl0sWyJGdXJvciIsNV0sWyJGZXJhbCBTd2lmdG5lc3MiLDJdLFsiQnJ1dGFsIEltcGFjdCIsMl0sWyJTYXZhZ2UgRnVyeSIsMl0sWyJGZXJhbCBDaGFyZ2UiLDFdLFsiU2hhcnBlbmVkIENsYXdzIiwyXSxbIlByZWRhdG9yeSBTdHJpa2VzIiwzXSxbIlByZWRhdG9yeSBEaXNjaXBsaW5lIiwxXV0sW11dfQ"
          },
          {
            "label": "39레벨 야성 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6IkRydWlkIiwibGV2ZWwiOjM5LCJsZWdhY3kiOjAsImRhdGFSZXZpc2lvbiI6ImNsaWVudC1yZWZlcmVuY2UtMjAyNi0xMS0wNCIsInRhbGVudHMiOltbXSxbWyJGZXJvY2l0eSIsMl0sWyJGdXJvciIsNV0sWyJGZXJhbCBTd2lmdG5lc3MiLDJdLFsiQnJ1dGFsIEltcGFjdCIsMl0sWyJTYXZhZ2UgRnVyeSIsMl0sWyJGZXJhbCBDaGFyZ2UiLDFdLFsiU2hhcnBlbmVkIENsYXdzIiwyXSxbIlByZWRhdG9yeSBTdHJpa2VzIiwzXSxbIlByZWRhdG9yeSBEaXNjaXBsaW5lIiwxXSxbIkJsb29kIEZyZW56eSIsMl0sWyJMZWFkZXIgb2YgdGhlIFBhY2siLDFdLFsiTmF0dXJhbCBJbnN0aW5jdCIsMl0sWyJSZW5kIGFuZCBUZWFyIiw1XV0sW11dfQ"
          },
          {
            "label": "60레벨 야성 견본 ↗",
            "path": "https://forever-tavern.com/talents/?build=v3.eyJ2IjozLCJjbGFzcyI6IkRydWlkIiwibGV2ZWwiOjYwLCJsZWdhY3kiOjAsImRhdGFSZXZpc2lvbiI6ImNsaWVudC1yZWZlcmVuY2UtMjAyNi0xMS0wNCIsInRhbGVudHMiOltbWyJHZW5lc2lzIiw1XSxbIk5hdHVyZSdzIE1hamVzdHkiLDJdLFsiTmF0dXJlJ3MgUmVhY2giLDJdXSxbWyJGZXJvY2l0eSIsM10sWyJGdXJvciIsNV0sWyJGZXJhbCBTd2lmdG5lc3MiLDJdLFsiQnJ1dGFsIEltcGFjdCIsMl0sWyJTYXZhZ2UgRnVyeSIsMl0sWyJGZXJhbCBDaGFyZ2UiLDFdLFsiU2hhcnBlbmVkIENsYXdzIiwyXSxbIlByZWRhdG9yeSBTdHJpa2VzIiwzXSxbIlByZWRhdG9yeSBEaXNjaXBsaW5lIiwxXSxbIkJsb29kIEZyZW56eSIsMl0sWyJMZWFkZXIgb2YgdGhlIFBhY2siLDFdLFsiTmF0dXJhbCBJbnN0aW5jdCIsMl0sWyJSZW5kIGFuZCBUZWFyIiw1XSxbIlNoaWZ0aW5nIFBvd2VyIiwxXV0sW1siSGVhcnQgb2YgdGhlIFdpbGQiLDVdLFsiTmF0dXJhbGlzdCIsNV1dXX0"
          }
        ],
        "sources": ["tavern-druid"]
      },
      {
        "id": "practice",
        "title": "육성 중 먼저 익힐 것",
        "items": [
          {"title":"10·20레벨 직업 퀘스트","body":"곰과 표범을 배우는 과정을 상급자에게 확인합니다. 유산으로 특성 점수를 빨리 얻어도 변신 퀘스트가 자동으로 완료되지는 않습니다."},
          {"title":"변신 뒤에도 무기 확인","body":"포에버 야성은 무기의 초당 공격력을 비교해야 합니다. 옛 클래식의 무기 선택 조언을 그대로 적용하지 않습니다."},
          {"title":"변신과 치유 비용","body":"한 전투에서 형태를 자주 바꾸면 마나를 씁니다. 다음 치유와 변신에 필요한 여유를 남기고, 여러 적을 상대할 때는 방어 형태를 검토하세요."}
        ],
        "sources": ["tavern-druid","newPlayer"]
      },
      {
        "id": "next",
        "title": "다음 지역과 던전 준비",
        "items": [{"title":"훈련비와 보급품","body":"새 레벨에서는 상급자와 마법책을 확인하고, 음식·음료·수리·이동 비용을 남겨 둡니다. 장비는 자신의 직업과 무기에 맞는지 비교하세요."}],
        "links": [{"label":"종족별 레벨업 동선","path":"/forever/leveling#race-guides"},{"label":"캠핑·유산으로 성장 이어 가기","path":"/forever/growth"}],
        "sources": ["newPlayer","camping","legacy"]
      }
    ]
  },
  "leveling/human": {
    "title": "포에버 인간 레벨업 길잡이",
    "label": "인간",
    "parent": "leveling",
    "lead": "얼라이언스 인간의 출발지부터 30레벨 안팎까지 이어 가는 지역 후보입니다. 시작 지역에서 훈련과 정비를 익힌 뒤 가까운 다음 지역으로 옮깁니다.",
    "art": {"id":"diff-zones","alt":"숲속 마을에서 다음 모험을 준비하는 풍경을 도트로 그린 그림"},
    "sections": [
      {
        "id": "start",
        "title": "처음 도착한 곳에서",
        "items": [{"title":"엘윈 숲","body":"북녘골 → 골드샤이어 순서로 시작 퀘스트를 이어 갑니다. 직업 상급자와 상인·여관을 확인하고, 다음 지역으로 떠나기 전에 배운 능력을 단축바에 놓으세요."}],
        "links": [{"label":"출발지 지도·주변 시설 보기 (영문) ↗","path":"https://foreverdb.net/guide/northshire-valley"}],
        "sources": ["start-northshire-valley","newPlayer"]
      },
      {
        "id": "route",
        "title": "다음 지역을 고르는 순서",
        "lead": "구간은 대략적인 이동 시점입니다. 적과 퀘스트의 실제 레벨에 맞추고, 종족 목록 위의 자료 범위 안내도 확인하세요.",
        "table": {"columns":["구간","지역 후보","거점·이동"],"rows":[["시작~10 안팎","엘윈 숲","북녘골 → 골드샤이어"],["10~20 안팎","서부 몰락지대","감시의 언덕"],["20~30 안팎","붉은마루 산맥 → 저습지·그늘숲","쉬운 퀘스트가 남아 있으면 마무리한 뒤 이동"]]},
        "sources": ["routes","newPlayer"]
      },
      {
        "id": "dungeons",
        "title": "길에서 묶어 갈 새 던전",
        "items": [{"title":"동부 왕국·칼림도어 이동","body":"영주의 전당은 던 모로, 발굴 현장은 저습지에 있습니다. 달라란은 사우스쇼어에서 입장 연계를 시작합니다. 현재 대륙과 퀘스트 진행을 맞춰 파티 일정을 잡으세요."}],
        "links": [{"label":"신규 던전 아홉 곳 · 레벨·입장 준비","path":"/forever/leveling#dungeons"},{"label":"직업별 특성·운용 고르기","path":"/forever/classes#class-guides"}],
        "sources": ["dungeons"]
      },
      {
        "id": "after-30",
        "title": "30레벨 뒤에는",
        "items": [
          {"title":"새 지역과 60레벨까지","body":"공식 소개의 강물터는 30레벨 중반~40레벨 중반입니다. 이후에는 현재 받은 퀘스트와 고레벨 던전 안내를 확인하며 60레벨까지 이어 가세요."},
          {"title":"이동보다 현재 난이도 먼저","body":"레벨 조정이 없는 세계이므로 더 높은 지역으로 옮기는 것만으로 성장이 빨라지지는 않습니다. 주변 적의 레벨과 퀘스트 진행을 보고, 어려운 퀘스트는 동료와 함께하세요."}
        ],
        "links": [{"label":"새 지역과 고레벨 던전 확인","path":"/forever/leveling#zones"}],
        "sources": ["launch","routes","newPlayer"]
      }
    ]
  },
  "leveling/dwarf": {
    "title": "포에버 드워프 레벨업 길잡이",
    "label": "드워프",
    "parent": "leveling",
    "lead": "얼라이언스 드워프의 출발지부터 30레벨 안팎까지 이어 가는 지역 후보입니다. 시작 지역에서 훈련과 정비를 익힌 뒤 가까운 다음 지역으로 옮깁니다.",
    "art": {"id":"diff-zones","alt":"숲속 마을에서 다음 모험을 준비하는 풍경을 도트로 그린 그림"},
    "sections": [
      {
        "id": "start",
        "title": "처음 도착한 곳에서",
        "items": [{"title":"던 모로","body":"눈마루 골짜기 → 카라노스 순서로 시작 퀘스트를 이어 갑니다. 직업 상급자와 상인·여관을 확인하고, 다음 지역으로 떠나기 전에 배운 능력을 단축바에 놓으세요."}],
        "links": [{"label":"출발지 지도·주변 시설 보기 (영문) ↗","path":"https://foreverdb.net/guide/coldridge-valley"}],
        "sources": ["start-coldridge-valley","newPlayer"]
      },
      {
        "id": "route",
        "title": "다음 지역을 고르는 순서",
        "lead": "구간은 대략적인 이동 시점입니다. 적과 퀘스트의 실제 레벨에 맞추고, 종족 목록 위의 자료 범위 안내도 확인하세요.",
        "table": {"columns":["구간","지역 후보","거점·이동"],"rows":[["시작~10 안팎","던 모로","눈마루 골짜기 → 카라노스"],["10~20 안팎","모단 호수","텔사마"],["20~30 안팎","붉은마루 산맥 → 저습지·그늘숲","쉬운 퀘스트가 남아 있으면 마무리한 뒤 이동"]]},
        "sources": ["routes","newPlayer"]
      },
      {
        "id": "dungeons",
        "title": "길에서 묶어 갈 새 던전",
        "items": [{"title":"동부 왕국·칼림도어 이동","body":"영주의 전당은 던 모로, 발굴 현장은 저습지에 있습니다. 달라란은 사우스쇼어에서 입장 연계를 시작합니다. 현재 대륙과 퀘스트 진행을 맞춰 파티 일정을 잡으세요."}],
        "links": [{"label":"신규 던전 아홉 곳 · 레벨·입장 준비","path":"/forever/leveling#dungeons"},{"label":"직업별 특성·운용 고르기","path":"/forever/classes#class-guides"}],
        "sources": ["dungeons"]
      },
      {
        "id": "after-30",
        "title": "30레벨 뒤에는",
        "items": [
          {"title":"새 지역과 60레벨까지","body":"공식 소개의 강물터는 30레벨 중반~40레벨 중반입니다. 이후에는 현재 받은 퀘스트와 고레벨 던전 안내를 확인하며 60레벨까지 이어 가세요."},
          {"title":"이동보다 현재 난이도 먼저","body":"레벨 조정이 없는 세계이므로 더 높은 지역으로 옮기는 것만으로 성장이 빨라지지는 않습니다. 주변 적의 레벨과 퀘스트 진행을 보고, 어려운 퀘스트는 동료와 함께하세요."}
        ],
        "links": [{"label":"새 지역과 고레벨 던전 확인","path":"/forever/leveling#zones"}],
        "sources": ["launch","routes","newPlayer"]
      }
    ]
  },
  "leveling/gnome": {
    "title": "포에버 노움 레벨업 길잡이",
    "label": "노움",
    "parent": "leveling",
    "lead": "얼라이언스 노움의 출발지부터 30레벨 안팎까지 이어 가는 지역 후보입니다. 시작 지역에서 훈련과 정비를 익힌 뒤 가까운 다음 지역으로 옮깁니다.",
    "art": {"id":"diff-zones","alt":"숲속 마을에서 다음 모험을 준비하는 풍경을 도트로 그린 그림"},
    "sections": [
      {
        "id": "start",
        "title": "처음 도착한 곳에서",
        "items": [{"title":"던 모로","body":"눈마루 골짜기 → 카라노스 순서로 시작 퀘스트를 이어 갑니다. 직업 상급자와 상인·여관을 확인하고, 다음 지역으로 떠나기 전에 배운 능력을 단축바에 놓으세요."}],
        "links": [{"label":"출발지 지도·주변 시설 보기 (영문) ↗","path":"https://foreverdb.net/guide/coldridge-valley"}],
        "sources": ["start-coldridge-valley","newPlayer"]
      },
      {
        "id": "route",
        "title": "다음 지역을 고르는 순서",
        "lead": "구간은 대략적인 이동 시점입니다. 적과 퀘스트의 실제 레벨에 맞추고, 종족 목록 위의 자료 범위 안내도 확인하세요.",
        "table": {"columns":["구간","지역 후보","거점·이동"],"rows":[["시작~10 안팎","던 모로","눈마루 골짜기 → 카라노스"],["10~20 안팎","모단 호수","텔사마"],["20~30 안팎","모단 호수·붉은마루 산맥 → 저습지","쉬운 퀘스트가 남아 있으면 마무리한 뒤 이동"]]},
        "sources": ["routes","newPlayer"]
      },
      {
        "id": "dungeons",
        "title": "길에서 묶어 갈 새 던전",
        "items": [{"title":"동부 왕국·칼림도어 이동","body":"영주의 전당은 던 모로, 발굴 현장은 저습지에 있습니다. 달라란은 사우스쇼어에서 입장 연계를 시작합니다. 현재 대륙과 퀘스트 진행을 맞춰 파티 일정을 잡으세요."}],
        "links": [{"label":"신규 던전 아홉 곳 · 레벨·입장 준비","path":"/forever/leveling#dungeons"},{"label":"직업별 특성·운용 고르기","path":"/forever/classes#class-guides"}],
        "sources": ["dungeons"]
      },
      {
        "id": "after-30",
        "title": "30레벨 뒤에는",
        "items": [
          {"title":"새 지역과 60레벨까지","body":"공식 소개의 강물터는 30레벨 중반~40레벨 중반입니다. 이후에는 현재 받은 퀘스트와 고레벨 던전 안내를 확인하며 60레벨까지 이어 가세요."},
          {"title":"이동보다 현재 난이도 먼저","body":"레벨 조정이 없는 세계이므로 더 높은 지역으로 옮기는 것만으로 성장이 빨라지지는 않습니다. 주변 적의 레벨과 퀘스트 진행을 보고, 어려운 퀘스트는 동료와 함께하세요."}
        ],
        "links": [{"label":"새 지역과 고레벨 던전 확인","path":"/forever/leveling#zones"}],
        "sources": ["launch","routes","newPlayer"]
      }
    ]
  },
  "leveling/night-elf": {
    "title": "포에버 나이트 엘프 레벨업 길잡이",
    "label": "나이트 엘프",
    "parent": "leveling",
    "lead": "얼라이언스 나이트 엘프의 출발지부터 30레벨 안팎까지 이어 가는 지역 후보입니다. 시작 지역에서 훈련과 정비를 익힌 뒤 가까운 다음 지역으로 옮깁니다.",
    "art": {"id":"diff-zones","alt":"숲속 마을에서 다음 모험을 준비하는 풍경을 도트로 그린 그림"},
    "sections": [
      {
        "id": "start",
        "title": "처음 도착한 곳에서",
        "items": [{"title":"텔드랏실","body":"그늘 협곡 → 돌라나르 순서로 시작 퀘스트를 이어 갑니다. 직업 상급자와 상인·여관을 확인하고, 다음 지역으로 떠나기 전에 배운 능력을 단축바에 놓으세요."}],
        "links": [{"label":"출발지 지도·주변 시설 보기 (영문) ↗","path":"https://foreverdb.net/guide/shadowglen"}],
        "sources": ["start-shadowglen","newPlayer"]
      },
      {
        "id": "route",
        "title": "다음 지역을 고르는 순서",
        "lead": "구간은 대략적인 이동 시점입니다. 적과 퀘스트의 실제 레벨에 맞추고, 종족 목록 위의 자료 범위 안내도 확인하세요.",
        "table": {"columns":["구간","지역 후보","거점·이동"],"rows":[["시작~10 안팎","텔드랏실","그늘 협곡 → 돌라나르"],["10~20 안팎","어둠해안","아우버다인"],["20~30 안팎","잿빛 골짜기 · 아스트라나르","쉬운 퀘스트가 남아 있으면 마무리한 뒤 이동"]]},
        "sources": ["routes","newPlayer"]
      },
      {
        "id": "dungeons",
        "title": "길에서 묶어 갈 새 던전",
        "items": [{"title":"동부 왕국·칼림도어 이동","body":"영주의 전당은 던 모로, 발굴 현장은 저습지에 있습니다. 달라란은 사우스쇼어에서 입장 연계를 시작합니다. 현재 대륙과 퀘스트 진행을 맞춰 파티 일정을 잡으세요."}],
        "links": [{"label":"신규 던전 아홉 곳 · 레벨·입장 준비","path":"/forever/leveling#dungeons"},{"label":"직업별 특성·운용 고르기","path":"/forever/classes#class-guides"}],
        "sources": ["dungeons"]
      },
      {
        "id": "after-30",
        "title": "30레벨 뒤에는",
        "items": [
          {"title":"새 지역과 60레벨까지","body":"공식 소개의 강물터는 30레벨 중반~40레벨 중반입니다. 이후에는 현재 받은 퀘스트와 고레벨 던전 안내를 확인하며 60레벨까지 이어 가세요."},
          {"title":"이동보다 현재 난이도 먼저","body":"레벨 조정이 없는 세계이므로 더 높은 지역으로 옮기는 것만으로 성장이 빨라지지는 않습니다. 주변 적의 레벨과 퀘스트 진행을 보고, 어려운 퀘스트는 동료와 함께하세요."}
        ],
        "links": [{"label":"새 지역과 고레벨 던전 확인","path":"/forever/leveling#zones"}],
        "sources": ["launch","routes","newPlayer"]
      }
    ]
  },
  "leveling/orc": {
    "title": "포에버 오크 레벨업 길잡이",
    "label": "오크",
    "parent": "leveling",
    "lead": "호드 오크의 출발지부터 30레벨 안팎까지 이어 가는 지역 후보입니다. 시작 지역에서 훈련과 정비를 익힌 뒤 가까운 다음 지역으로 옮깁니다.",
    "art": {"id":"diff-zones","alt":"숲속 마을에서 다음 모험을 준비하는 풍경을 도트로 그린 그림"},
    "sections": [
      {
        "id": "start",
        "title": "처음 도착한 곳에서",
        "items": [{"title":"듀로타","body":"시험의 골짜기 → 센진 마을·칼바위 언덕 순서로 시작 퀘스트를 이어 갑니다. 직업 상급자와 상인·여관을 확인하고, 다음 지역으로 떠나기 전에 배운 능력을 단축바에 놓으세요."}],
        "links": [{"label":"출발지 지도·주변 시설 보기 (영문) ↗","path":"https://foreverdb.net/guide/valley-of-trials"}],
        "sources": ["start-valley-of-trials","newPlayer"]
      },
      {
        "id": "route",
        "title": "다음 지역을 고르는 순서",
        "lead": "구간은 대략적인 이동 시점입니다. 적과 퀘스트의 실제 레벨에 맞추고, 종족 목록 위의 자료 범위 안내도 확인하세요.",
        "table": {"columns":["구간","지역 후보","거점·이동"],"rows":[["시작~10 안팎","듀로타","시험의 골짜기 → 센진 마을·칼바위 언덕"],["10~20 안팎","불모의 땅","크로스로드"],["20~30 안팎","돌발톱 산맥 → 잿빛 골짜기","쉬운 퀘스트가 남아 있으면 마무리한 뒤 이동"]]},
        "sources": ["routes","newPlayer"]
      },
      {
        "id": "dungeons",
        "title": "길에서 묶어 갈 새 던전",
        "items": [{"title":"파티와 입장 경로","body":"로데론의 폐허는 티리스팔 숲에 있습니다. 달라란은 타렌 밀농장에서 입장 연계를 시작합니다. 다른 진영 영토를 지날 던전은 입구까지 가는 길부터 맞추세요."}],
        "links": [{"label":"신규 던전 아홉 곳 · 레벨·입장 준비","path":"/forever/leveling#dungeons"},{"label":"직업별 특성·운용 고르기","path":"/forever/classes#class-guides"}],
        "sources": ["dungeons"]
      },
      {
        "id": "after-30",
        "title": "30레벨 뒤에는",
        "items": [
          {"title":"새 지역과 60레벨까지","body":"공식 소개의 강물터는 30레벨 중반~40레벨 중반입니다. 이후에는 현재 받은 퀘스트와 고레벨 던전 안내를 확인하며 60레벨까지 이어 가세요."},
          {"title":"이동보다 현재 난이도 먼저","body":"레벨 조정이 없는 세계이므로 더 높은 지역으로 옮기는 것만으로 성장이 빨라지지는 않습니다. 주변 적의 레벨과 퀘스트 진행을 보고, 어려운 퀘스트는 동료와 함께하세요."}
        ],
        "links": [{"label":"새 지역과 고레벨 던전 확인","path":"/forever/leveling#zones"}],
        "sources": ["launch","routes","newPlayer"]
      }
    ]
  },
  "leveling/troll": {
    "title": "포에버 트롤 레벨업 길잡이",
    "label": "트롤",
    "parent": "leveling",
    "lead": "호드 트롤의 출발지부터 30레벨 안팎까지 이어 가는 지역 후보입니다. 시작 지역에서 훈련과 정비를 익힌 뒤 가까운 다음 지역으로 옮깁니다.",
    "art": {"id":"diff-zones","alt":"숲속 마을에서 다음 모험을 준비하는 풍경을 도트로 그린 그림"},
    "sections": [
      {
        "id": "start",
        "title": "처음 도착한 곳에서",
        "items": [{"title":"듀로타","body":"시험의 골짜기 → 센진 마을·칼바위 언덕 순서로 시작 퀘스트를 이어 갑니다. 직업 상급자와 상인·여관을 확인하고, 다음 지역으로 떠나기 전에 배운 능력을 단축바에 놓으세요."}],
        "links": [{"label":"출발지 지도·주변 시설 보기 (영문) ↗","path":"https://foreverdb.net/guide/valley-of-trials"}],
        "sources": ["start-valley-of-trials","newPlayer"]
      },
      {
        "id": "route",
        "title": "다음 지역을 고르는 순서",
        "lead": "구간은 대략적인 이동 시점입니다. 적과 퀘스트의 실제 레벨에 맞추고, 종족 목록 위의 자료 범위 안내도 확인하세요.",
        "table": {"columns":["구간","지역 후보","거점·이동"],"rows":[["시작~10 안팎","듀로타","시험의 골짜기 → 센진 마을·칼바위 언덕"],["10~20 안팎","불모의 땅","크로스로드"],["20~30 안팎","돌발톱 산맥 → 잿빛 골짜기","쉬운 퀘스트가 남아 있으면 마무리한 뒤 이동"]]},
        "sources": ["routes","newPlayer"]
      },
      {
        "id": "dungeons",
        "title": "길에서 묶어 갈 새 던전",
        "items": [{"title":"파티와 입장 경로","body":"로데론의 폐허는 티리스팔 숲에 있습니다. 달라란은 타렌 밀농장에서 입장 연계를 시작합니다. 다른 진영 영토를 지날 던전은 입구까지 가는 길부터 맞추세요."}],
        "links": [{"label":"신규 던전 아홉 곳 · 레벨·입장 준비","path":"/forever/leveling#dungeons"},{"label":"직업별 특성·운용 고르기","path":"/forever/classes#class-guides"}],
        "sources": ["dungeons"]
      },
      {
        "id": "after-30",
        "title": "30레벨 뒤에는",
        "items": [
          {"title":"새 지역과 60레벨까지","body":"공식 소개의 강물터는 30레벨 중반~40레벨 중반입니다. 이후에는 현재 받은 퀘스트와 고레벨 던전 안내를 확인하며 60레벨까지 이어 가세요."},
          {"title":"이동보다 현재 난이도 먼저","body":"레벨 조정이 없는 세계이므로 더 높은 지역으로 옮기는 것만으로 성장이 빨라지지는 않습니다. 주변 적의 레벨과 퀘스트 진행을 보고, 어려운 퀘스트는 동료와 함께하세요."}
        ],
        "links": [{"label":"새 지역과 고레벨 던전 확인","path":"/forever/leveling#zones"}],
        "sources": ["launch","routes","newPlayer"]
      }
    ]
  },
  "leveling/tauren": {
    "title": "포에버 타우렌 레벨업 길잡이",
    "label": "타우렌",
    "parent": "leveling",
    "lead": "호드 타우렌의 출발지부터 30레벨 안팎까지 이어 가는 지역 후보입니다. 시작 지역에서 훈련과 정비를 익힌 뒤 가까운 다음 지역으로 옮깁니다.",
    "art": {"id":"diff-zones","alt":"숲속 마을에서 다음 모험을 준비하는 풍경을 도트로 그린 그림"},
    "sections": [
      {
        "id": "start",
        "title": "처음 도착한 곳에서",
        "items": [{"title":"멀고어","body":"나라체 야영지 → 블러드후프 마을 순서로 시작 퀘스트를 이어 갑니다. 직업 상급자와 상인·여관을 확인하고, 다음 지역으로 떠나기 전에 배운 능력을 단축바에 놓으세요."}],
        "links": [{"label":"출발지 지도·주변 시설 보기 (영문) ↗","path":"https://foreverdb.net/guide/camp-narache"}],
        "sources": ["start-camp-narache","newPlayer"]
      },
      {
        "id": "route",
        "title": "다음 지역을 고르는 순서",
        "lead": "구간은 대략적인 이동 시점입니다. 적과 퀘스트의 실제 레벨에 맞추고, 종족 목록 위의 자료 범위 안내도 확인하세요.",
        "table": {"columns":["구간","지역 후보","거점·이동"],"rows":[["시작~10 안팎","멀고어","나라체 야영지 → 블러드후프 마을"],["10~20 안팎","불모의 땅","크로스로드"],["20~30 안팎","돌발톱 산맥 → 잿빛 골짜기·버섯구름 봉우리","쉬운 퀘스트가 남아 있으면 마무리한 뒤 이동"]]},
        "sources": ["routes","newPlayer"]
      },
      {
        "id": "dungeons",
        "title": "길에서 묶어 갈 새 던전",
        "items": [{"title":"파티와 입장 경로","body":"로데론의 폐허는 티리스팔 숲에 있습니다. 달라란은 타렌 밀농장에서 입장 연계를 시작합니다. 다른 진영 영토를 지날 던전은 입구까지 가는 길부터 맞추세요."}],
        "links": [{"label":"신규 던전 아홉 곳 · 레벨·입장 준비","path":"/forever/leveling#dungeons"},{"label":"직업별 특성·운용 고르기","path":"/forever/classes#class-guides"}],
        "sources": ["dungeons"]
      },
      {
        "id": "after-30",
        "title": "30레벨 뒤에는",
        "items": [
          {"title":"새 지역과 60레벨까지","body":"공식 소개의 강물터는 30레벨 중반~40레벨 중반입니다. 이후에는 현재 받은 퀘스트와 고레벨 던전 안내를 확인하며 60레벨까지 이어 가세요."},
          {"title":"이동보다 현재 난이도 먼저","body":"레벨 조정이 없는 세계이므로 더 높은 지역으로 옮기는 것만으로 성장이 빨라지지는 않습니다. 주변 적의 레벨과 퀘스트 진행을 보고, 어려운 퀘스트는 동료와 함께하세요."}
        ],
        "links": [{"label":"새 지역과 고레벨 던전 확인","path":"/forever/leveling#zones"}],
        "sources": ["launch","routes","newPlayer"]
      }
    ]
  },
  "leveling/undead": {
    "title": "포에버 언데드 레벨업 길잡이",
    "label": "언데드",
    "parent": "leveling",
    "lead": "호드 언데드의 출발지부터 30레벨 안팎까지 이어 가는 지역 후보입니다. 시작 지역에서 훈련과 정비를 익힌 뒤 가까운 다음 지역으로 옮깁니다.",
    "art": {"id":"diff-zones","alt":"숲속 마을에서 다음 모험을 준비하는 풍경을 도트로 그린 그림"},
    "sections": [
      {
        "id": "start",
        "title": "처음 도착한 곳에서",
        "items": [{"title":"티리스팔 숲","body":"죽음의 종소리 마을 → 브릴 순서로 시작 퀘스트를 이어 갑니다. 직업 상급자와 상인·여관을 확인하고, 다음 지역으로 떠나기 전에 배운 능력을 단축바에 놓으세요."}],
        "links": [{"label":"출발지 지도·주변 시설 보기 (영문) ↗","path":"https://foreverdb.net/guide/deathknell"}],
        "sources": ["start-deathknell","newPlayer"]
      },
      {
        "id": "route",
        "title": "다음 지역을 고르는 순서",
        "lead": "구간은 대략적인 이동 시점입니다. 적과 퀘스트의 실제 레벨에 맞추고, 종족 목록 위의 자료 범위 안내도 확인하세요.",
        "table": {"columns":["구간","지역 후보","거점·이동"],"rows":[["시작~10 안팎","티리스팔 숲","죽음의 종소리 마을 → 브릴"],["10~20 안팎","은빛소나무 숲","공동묘지"],["20~30 안팎","불모의 땅 또는 힐스브래드 구릉지","쉬운 퀘스트가 남아 있으면 마무리한 뒤 이동"]]},
        "sources": ["routes","newPlayer"]
      },
      {
        "id": "dungeons",
        "title": "길에서 묶어 갈 새 던전",
        "items": [{"title":"파티와 입장 경로","body":"로데론의 폐허는 티리스팔 숲에 있습니다. 달라란은 타렌 밀농장에서 입장 연계를 시작합니다. 다른 진영 영토를 지날 던전은 입구까지 가는 길부터 맞추세요."}],
        "links": [{"label":"신규 던전 아홉 곳 · 레벨·입장 준비","path":"/forever/leveling#dungeons"},{"label":"직업별 특성·운용 고르기","path":"/forever/classes#class-guides"}],
        "sources": ["dungeons"]
      },
      {
        "id": "after-30",
        "title": "30레벨 뒤에는",
        "items": [
          {"title":"새 지역과 60레벨까지","body":"공식 소개의 강물터는 30레벨 중반~40레벨 중반입니다. 이후에는 현재 받은 퀘스트와 고레벨 던전 안내를 확인하며 60레벨까지 이어 가세요."},
          {"title":"이동보다 현재 난이도 먼저","body":"레벨 조정이 없는 세계이므로 더 높은 지역으로 옮기는 것만으로 성장이 빨라지지는 않습니다. 주변 적의 레벨과 퀘스트 진행을 보고, 어려운 퀘스트는 동료와 함께하세요."}
        ],
        "links": [{"label":"새 지역과 고레벨 던전 확인","path":"/forever/leveling#zones"}],
        "sources": ["launch","routes","newPlayer"]
      }
    ]
  },
  "leveling/skyborne-alliance": {
    "title": "포에버 고등 마법원 스카이본 레벨업 길잡이",
    "label": "고등 마법원 스카이본",
    "parent": "leveling",
    "lead": "얼라이언스 고등 마법원 스카이본의 출발지부터 30레벨 안팎까지 이어 가는 지역 후보입니다. 두 진영 모두 제프라스 섬에서 시작합니다.",
    "art": {"id":"diff-races","alt":"스카이본 모험가가 마을 앞에 서 있는 도트 그림"},
    "sections": [
      {
        "id": "start",
        "title": "처음 도착한 곳에서",
        "items": [
          {"title":"제프라스 섬","body":"제프라스 섬의 시작 퀘스트 순서로 시작 퀘스트를 이어 갑니다. 직업 상급자와 상인·여관을 확인하고, 다음 지역으로 떠나기 전에 배운 능력을 단축바에 놓으세요."},
          {"title":"섬을 떠날 때","body":"영웅 꾸러미 이상의 이용 조건을 확인하세요. 섬의 마지막 퀘스트가 안내하는 이동을 따릅니다. 참고 자료가 진영별 최종 도착지를 확정하지 않으므로 특정 배편을 고정 경로로 제시하지 않습니다."}
        ],
        "links": [{"label":"출발지 지도·주변 시설 보기 (영문) ↗","path":"https://foreverdb.net/guide/zephras-isle"}],
        "sources": ["start-zephras-isle","newPlayer"]
      },
      {
        "id": "route",
        "title": "다음 지역을 고르는 순서",
        "lead": "구간은 대략적인 이동 시점입니다. 적과 퀘스트의 실제 레벨에 맞추고, 종족 목록 위의 자료 범위 안내도 확인하세요.",
        "table": {
          "columns": ["구간","지역 후보","거점·이동"],
          "rows": [["1~12","제프라스 섬","제프라스 섬의 시작 퀘스트"],["10~20 안팎","얼라이언스의 10~20레벨 지역","도착한 지역의 여관"],["20~30 안팎","모단 호수·어둠해안 → 잿빛 골짜기·저습지","쉬운 퀘스트가 남아 있으면 마무리한 뒤 이동"]]
        },
        "sources": ["routes","newPlayer"]
      },
      {
        "id": "dungeons",
        "title": "길에서 묶어 갈 새 던전",
        "items": [{"title":"동부 왕국·칼림도어 이동","body":"영주의 전당은 던 모로, 발굴 현장은 저습지에 있습니다. 달라란은 사우스쇼어에서 입장 연계를 시작합니다. 현재 대륙과 퀘스트 진행을 맞춰 파티 일정을 잡으세요."}],
        "links": [{"label":"신규 던전 아홉 곳 · 레벨·입장 준비","path":"/forever/leveling#dungeons"},{"label":"직업별 특성·운용 고르기","path":"/forever/classes#class-guides"}],
        "sources": ["dungeons"]
      },
      {
        "id": "after-30",
        "title": "30레벨 뒤에는",
        "items": [
          {"title":"새 지역과 60레벨까지","body":"공식 소개의 강물터는 30레벨 중반~40레벨 중반입니다. 이후에는 현재 받은 퀘스트와 고레벨 던전 안내를 확인하며 60레벨까지 이어 가세요."},
          {"title":"이동보다 현재 난이도 먼저","body":"레벨 조정이 없는 세계이므로 더 높은 지역으로 옮기는 것만으로 성장이 빨라지지는 않습니다. 주변 적의 레벨과 퀘스트 진행을 보고, 어려운 퀘스트는 동료와 함께하세요."}
        ],
        "links": [{"label":"새 지역과 고레벨 던전 확인","path":"/forever/leveling#zones"}],
        "sources": ["launch","routes","newPlayer"]
      }
    ]
  },
  "leveling/skyborne-horde": {
    "title": "포에버 바람구체자 스카이본 레벨업 길잡이",
    "label": "바람구체자 스카이본",
    "parent": "leveling",
    "lead": "호드 바람구체자 스카이본의 출발지부터 30레벨 안팎까지 이어 가는 지역 후보입니다. 두 진영 모두 제프라스 섬에서 시작합니다.",
    "art": {"id":"diff-races","alt":"스카이본 모험가가 마을 앞에 서 있는 도트 그림"},
    "sections": [
      {
        "id": "start",
        "title": "처음 도착한 곳에서",
        "items": [
          {"title":"제프라스 섬","body":"제프라스 섬의 시작 퀘스트 순서로 시작 퀘스트를 이어 갑니다. 직업 상급자와 상인·여관을 확인하고, 다음 지역으로 떠나기 전에 배운 능력을 단축바에 놓으세요."},
          {"title":"섬을 떠날 때","body":"영웅 꾸러미 이상의 이용 조건을 확인하세요. 섬의 마지막 퀘스트가 안내하는 이동을 따릅니다. 참고 자료가 진영별 최종 도착지를 확정하지 않으므로 특정 배편을 고정 경로로 제시하지 않습니다."}
        ],
        "links": [{"label":"출발지 지도·주변 시설 보기 (영문) ↗","path":"https://foreverdb.net/guide/zephras-isle"}],
        "sources": ["start-zephras-isle","newPlayer"]
      },
      {
        "id": "route",
        "title": "다음 지역을 고르는 순서",
        "lead": "구간은 대략적인 이동 시점입니다. 적과 퀘스트의 실제 레벨에 맞추고, 종족 목록 위의 자료 범위 안내도 확인하세요.",
        "table": {"columns":["구간","지역 후보","거점·이동"],"rows":[["1~12","제프라스 섬","제프라스 섬의 시작 퀘스트"],["10~20 안팎","호드의 10~20레벨 지역","도착한 지역의 여관"],["20~30 안팎","은빛소나무 숲·불모의 땅 → 잿빛 골짜기","쉬운 퀘스트가 남아 있으면 마무리한 뒤 이동"]]},
        "sources": ["routes","newPlayer"]
      },
      {
        "id": "dungeons",
        "title": "길에서 묶어 갈 새 던전",
        "items": [{"title":"파티와 입장 경로","body":"로데론의 폐허는 티리스팔 숲에 있습니다. 달라란은 타렌 밀농장에서 입장 연계를 시작합니다. 다른 진영 영토를 지날 던전은 입구까지 가는 길부터 맞추세요."}],
        "links": [{"label":"신규 던전 아홉 곳 · 레벨·입장 준비","path":"/forever/leveling#dungeons"},{"label":"직업별 특성·운용 고르기","path":"/forever/classes#class-guides"}],
        "sources": ["dungeons"]
      },
      {
        "id": "after-30",
        "title": "30레벨 뒤에는",
        "items": [
          {"title":"새 지역과 60레벨까지","body":"공식 소개의 강물터는 30레벨 중반~40레벨 중반입니다. 이후에는 현재 받은 퀘스트와 고레벨 던전 안내를 확인하며 60레벨까지 이어 가세요."},
          {"title":"이동보다 현재 난이도 먼저","body":"레벨 조정이 없는 세계이므로 더 높은 지역으로 옮기는 것만으로 성장이 빨라지지는 않습니다. 주변 적의 레벨과 퀘스트 진행을 보고, 어려운 퀘스트는 동료와 함께하세요."}
        ],
        "links": [{"label":"새 지역과 고레벨 던전 확인","path":"/forever/leveling#zones"}],
        "sources": ["launch","routes","newPlayer"]
      }
    ]
  }
};

foreverGuides.classes.sections.unshift({
  id: 'class-guides', title: '직업별 특성·레벨링 가이드',
  lead: '직업을 골라 추천 경로와 레벨별 특성 배분, 장비·운용 요령을 확인하세요. 각 페이지에 원문과 특성 계산기를 연결했습니다.',
  links: Object.entries(foreverDetailGuides).filter(([, page]) => page.parent === 'classes').map(([id, page]) => ({ label: page.label, path: '/forever/' + id })),
  sources: ["tavern-warrior","tavern-paladin","tavern-hunter","tavern-rogue","tavern-priest","tavern-shaman","tavern-mage","tavern-warlock","tavern-druid"],
});
foreverGuides.leveling.sections.unshift({
  id: 'race-guides', title: '종족별 레벨업 가이드',
  lead: '종족별로 첫 30레벨의 지역 후보와 다음 거점을 정리했습니다. ForeverDB의 범위는 옛 클래식 퀘스트 레벨을 대조한 참고값이며 새 퀘스트 전체를 검증한 요구 레벨은 아닙니다. 30레벨 이후 원문에는 추정·미확인이 남아 있어 확정 동선으로 옮기지 않았습니다. 스카이본은 선택한 진영의 페이지를 읽으세요.',
  links: Object.entries(foreverDetailGuides).filter(([, page]) => page.parent === 'leveling').map(([id, page]) => ({ label: page.label, path: '/forever/' + id })),
  sources: ['routes', 'newPlayer'],
});
