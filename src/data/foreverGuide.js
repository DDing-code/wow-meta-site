// 포에버(월드 오브 워크래프트: 포에버) 안내 페이지의 글. 화면은 src/pages/ForeverPage.js가 그린다.
// 모든 내용은 블리자드 한국어 공지에서 확인한 것만 적고, 항목마다 sources에 근거 공지를 단다.
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
};

export const foreverPages = [
  { id: 'home', path: '/forever', label: '포에버 홈' },
  { id: 'start', path: '/forever/start', label: '시작하기' },
  { id: 'rules', path: '/forever/rules', label: '규칙·진영' },
];

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
      sources: ['launch'],
    },
    {
      topic: '직업',
      art: { id: 'diff-classes', alt: '전투 중에 덫을 놓는 사냥꾼과 멧돼지에게 달려드는 늑대 소환수' },
      forever: '직업 이름은 익숙해도 특성과 능력은 원작 와우를 바탕으로 새로 손봤습니다.',
      note: '사냥꾼은 전투 중에 덫을 쓰고, 소환수가 장비에 따라 강해집니다. 리테일의 딜사이클과 특성은 그대로 맞지 않습니다.',
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
      sources: ['launch', 'raids'],
    },
    {
      topic: '유산',
      art: { id: 'diff-legacy', alt: '산호 해변 위에 떠 있는 유산 도전 창을 도트로 다시 그린 그림' },
      forever: '계정 전체가 함께 크는 성장입니다. 유산 도전·유산 특전·유산 보상 세 가지로 이루어지고, 출시 때는 캐릭터마다 유산 점수를 16점까지 넣을 수 있습니다.',
      note: '캐릭터 하나로도 한도까지 채울 수 있어 부캐가 꼭 필요하지는 않습니다.',
      sources: ['launch', 'compare'],
    },
    {
      topic: '캠핑',
      art: { id: 'diff-camping', alt: '천막 옆에 모닥불을 피운 숲속 캠프를 도트로 다시 그린 그림' },
      forever: '요리로 피운 모닥불이 캠프 거점이 됩니다. 주위 플레이어가 전문 기술로 만든 캠핑 설비를 한 사람에 하나씩, 모두 세 개까지 놓습니다.',
      note: '거점 주위에서 1분 동안 앉아 있거나 제작을 하면 설비의 이로운 효과를 받습니다.',
      sources: ['launch'],
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
  ],
  notice: '포에버 직업·던전·레이드 공략은 아직 없습니다. 리테일 가이드의 딜사이클과 특성은 포에버에 맞지 않으니 섞어 보지 마세요.',
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
