// 공식 한국어 WoW 번역 데이터베이스
// 와우헤드, 와우인벤, 공식 클라이언트 기반

export const koreanTranslations = {
  // 클래스 이름
  classes: {
    warrior: '전사',
    paladin: '성기사',
    hunter: '사냥꾼',
    rogue: '도적',
    priest: '사제',
    deathknight: '죽음의 기사',
    shaman: '주술사',
    mage: '마법사',
    warlock: '흑마법사',
    monk: '수도사',
    druid: '드루이드',
    demonhunter: '악마사냥꾼',
    evoker: '기원사'
  },

  // 전문화 이름
  specializations: {
    // 전사
    arms: '무기',
    fury: '분노',
    protection_warrior: '방어',

    // 성기사
    holy_paladin: '신성',
    protection_paladin: '보호',
    retribution: '징벌',

    // 사냥꾼
    beast_mastery: '야수',
    marksmanship: '사격',
    survival: '생존',

    // 도적
    assassination: '암살',
    outlaw: '무법',
    subtlety: '잠행',

    // 사제
    discipline: '수양',
    holy_priest: '신성',
    shadow: '암흑',

    // 죽음의 기사
    blood: '혈기',
    frost_dk: '냉기',
    unholy: '부정',

    // 주술사
    elemental: '정기',
    enhancement: '고양',
    restoration_shaman: '복원',

    // 마법사
    arcane: '비전',
    fire: '화염',
    frost_mage: '냉기',

    // 흑마법사
    affliction: '고통',
    demonology: '악마',
    destruction: '파괴',

    // 수도사
    brewmaster: '양조',
    mistweaver: '운무',
    windwalker: '풍운',

    // 드루이드
    balance: '조화',
    feral: '야성',
    guardian: '수호',
    restoration_druid: '회복',

    // 악마사냥꾼
    havoc: '파멸',
    vengeance: '복수',

    // 기원사
    devastation: '황폐',
    preservation: '보존',
    augmentation: '증강'
  },

  // 전사 스킬
  warriorAbilities: {
    // 공통
    charge: '돌진',
    heroicLeap: '영웅의 도약',
    pummel: '자루 공격',
    battleShout: '전투의 외침',
    rallyingCry: '재집결의 함성',
    berserkerRage: '광폭한 분노',
    victoryRush: '연전연승',
    execute: '마무리 일격',

    // 무기
    mortalStrike: '필사의 일격',
    overpower: '제압',
    colossusSmash: '거인의 일격',
    bladestorm: '칼날폭풍',
    sweepingStrikes: '휩쓸기 일격',
    slam: '격돌',
    rend: '분쇄',
    die_by_the_sword: '최후의 저항',

    // 분노
    bloodthirst: '피의 갈증',
    ragingBlow: '분노의 강타',
    rampage: '광란',
    whirlwind: '소용돌이',
    enrage: '격노',
    recklessness: '무모한 희생',
    odynsFury: '오딘의 격노',

    // 방어
    shieldSlam: '방패 밀쳐내기',
    thunderClap: '천둥벼락',
    revenge: '복수',
    shieldBlock: '방패 막기',
    shieldWall: '방패의 벽',
    lastStand: '최후의 저항',
    spellReflection: '주문 반사',
    ignore_pain: '고통 감내',
    avatar: '투신'
  },

  // 성기사 스킬
  paladinAbilities: {
    // 공통
    handOfReckoning: '징벌의 손길',
    divineShield: '천상의 보호막',
    layOnHands: '신의 축복',
    blessingOfFreedom: '자유의 축복',
    blessingOfProtection: '보호의 축복',
    hammerOfJustice: '심판의 망치',
    flashOfLight: '빛의 섬광',

    // 신성
    holyShock: '신성 충격',
    holyLight: '성스러운 빛',
    lightOfDawn: '여명의 빛',
    beaconOfLight: '빛의 봉화',
    divineProvidence: '신의 섭리',
    avenging_wrath: '응징의 격노',
    aura_mastery: '오라 숙련',

    // 보호
    avengersShield: '복수자의 방패',
    hammerOfTheRighteous: '정의의 망치',
    consecration: '신성화',
    ardentDefender: '불타는 수호자',
    guardianOfAncientKings: '고대 왕의 수호자',
    shieldOfTheRighteous: '정의의 방패',

    // 징벌
    bladeOfJustice: '정의의 칼날',
    judgment: '심판',
    templarsVerdict: '기사단의 선고',
    divineStorm: '천상의 폭풍',
    wakeOfAshes: '잿빛 경종',
    crusade: '성전',
    finalReckoning: '최후의 심판'
  },

  // 죽음의 기사 스킬
  deathknightAbilities: {
    // 공통
    deathGrip: '죽음의 손아귀',
    deathAndDecay: '죽음과 부패',
    antiMagicShell: '대마법 보호막',
    iceboundFortitude: '얼음 결계',
    raiseAlly: '아군 되살리기',
    pathOfFrost: '서리 길',
    deathsAdvance: '죽음의 진군',

    // 혈기
    bloodBoil: '피의 소용돌이',
    deathStrike: '죽음의 일격',
    marrowrend: '골수 분쇄',
    heartStrike: '심장 강타',
    vampiricBlood: '흡혈',
    boneshield: '뼈 보호막',
    runeTap: '룬 전환',
    dancingRuneWeapon: '춤추는 룬 무기',

    // 냉기
    obliterate: '절멸',
    howlingBlast: '울부짖는 한파',
    frostStrike: '냉기 충격',
    pillarOfFrost: '서리 기둥',
    remorselessWinter: '무자비한 겨울',
    breathOfSindragosa: '신드라고사의 숨결',
    frostscythe: '서리 낫',

    // 부정
    festeringStrike: '고름 일격',
    scourgeStrike: '스컬지의 일격',
    deathCoil: '죽음의 고리',
    epidemic: '전염병',
    armyOfTheDead: '죽은 자의 군대',
    unholyFrenzy: '부정한 광란',
    darkTransformation: '어둠의 변신',
    apocalypse: '대재앙',
    soulReaper: '영혼 수확자'
  },

  // 사냥꾼 스킬
  hunterAbilities: {
    // 공통
    huntersMark: '사냥꾼의 징표',
    aspectOfTheCheetah: '치타의 상',
    disengage: '철수',
    feignDeath: '죽은 척하기',
    trap: '덫',
    flare: '조명탄',

    // 야수
    barbedShot: '날카로운 사격',
    killCommand: '살상 명령',
    bestialWrath: '야수의 격노',
    aspectOfTheWild: '야생의 상',
    direBeast: '무시무시한 야수',

    // 사격
    aimedShot: '조준 사격',
    rapidFire: '속사',
    arcaneShot: '비전 사격',
    steadyShot: '일정 사격',
    trueshot: '정조준',

    // 생존
    raptorStrike: '랩터의 일격',
    killShot: '마무리 사격',
    serpentSting: '독사 쐐기',
    wildfire_bomb: '야생불 폭탄',
    coordinated_assault: '협공'
  },

  // 도적 스킬
  rogueAbilities: {
    // 공통
    stealth: '은신',
    vanish: '소멸',
    cheapShot: '비열한 습격',
    kidneyShot: '급소 가격',
    evasion: '회피',
    cloak_of_shadows: '그림자 망토',
    shadowstep: '그림자 걸음',

    // 암살
    mutilate: '절개',
    envenom: '독살',
    rupture: '파열',
    vendetta: '원한',
    garrote: '교살',

    // 무법
    sinisterStrike: '사악한 일격',
    roll_the_bones: '뼈 주사위',
    between_the_eyes: '미간 사격',
    blade_flurry: '폭풍의 칼날',
    adrenaline_rush: '아드레날린 촉진',

    // 잠행
    shadowstrike: '그림자 일격',
    shadowdance: '어둠의 춤',
    symbols_of_death: '죽음의 상징',
    shurikenstorm: '수리검 폭풍',
    eviscerate: '절개도려내기'
  },

  // 기타 용어
  generalTerms: {
    dps: '초당 피해량',
    hps: '초당 치유량',
    tank: '방어 전담',
    healer: '치유 전담',
    damage_dealer: '공격 전담',
    item_level: '아이템 레벨',
    ilvl: '템렙',
    cooldown: '재사용 대기시간',
    global_cooldown: '전역 재사용 대기시간',
    cast_time: '시전 시간',
    instant_cast: '즉시 시전',
    buff: '강화 효과',
    debuff: '약화 효과',
    dot: '지속 피해',
    hot: '지속 치유',
    aoe: '광역',
    cleave: '연쇄',
    cc: '군중 제어',
    interrupt: '차단',
    dispel: '해제',
    purge: '정화',
    threat: '위협 수준',
    aggro: '어그로',
    taunt: '도발',

    // 던전/레이드
    dungeon: '던전',
    raid: '공격대',
    mythic_plus: '쐐기돌 던전',
    mythic_keystone: '신화 쐐기돌',
    affix: '접두사',
    boss: '우두머리',
    trash: '일반 몹',
    wipe: '전멸',
    kill: '처치',
    progression: '공략',
    parse: '분석',
    logs: '기록',

    // PvP
    arena: '투기장',
    battleground: '전장',
    honor: '명예',
    conquest: '정복',
    rating: '등급',

    // 아이템/장비
    gear: '장비',
    enchant: '마법부여',
    gem: '보석',
    socket: '홈',
    upgrade: '업그레이드',
    transmog: '형상변환',
    legendary: '전설',
    epic: '영웅',
    rare: '희귀',
    uncommon: '고급',
    common: '일반'
  }
};

// 역방향 검색을 위한 맵
export const reverseTranslations = {
  classes: Object.fromEntries(
    Object.entries(koreanTranslations.classes).map(([key, value]) => [value, key])
  ),
  specializations: Object.fromEntries(
    Object.entries(koreanTranslations.specializations).map(([key, value]) => [value, key])
  )
};

// 번역 헬퍼 함수
export const translateToKorean = (term, category = 'generalTerms') => {
  const categoryData = koreanTranslations[category];
  if (!categoryData) return term;

  // camelCase를 snake_case로 변환
  const snakeCase = term.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');

  return categoryData[term] || categoryData[snakeCase] || term;
};

export const translateToEnglish = (term, category = 'classes') => {
  const reverseData = reverseTranslations[category];
  if (!reverseData) return term;

  return reverseData[term] || term;
};

export default koreanTranslations;