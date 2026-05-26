export const CURRENT_PATCH_LABEL = '12.0.5';

export const classColors = {
  warrior: '#C69B6D',
  paladin: '#F48CBA',
  hunter: '#AAD372',
  rogue: '#FFF468',
  priest: '#FFFFFF',
  deathknight: '#C41E3A',
  shaman: '#0070DD',
  mage: '#3FC7EB',
  warlock: '#8788EE',
  monk: '#00FF98',
  druid: '#FF7C0A',
  demonhunter: '#A330C9',
  evoker: '#33937F',
};

export const classMeta = {
  warrior: { className: '전사', kbClass: 'Warrior' },
  paladin: { className: '성기사', kbClass: 'Paladin' },
  hunter: { className: '사냥꾼', kbClass: 'Hunter' },
  rogue: { className: '도적', kbClass: 'Rogue' },
  priest: { className: '사제', kbClass: 'Priest' },
  deathknight: { className: '죽음의 기사', kbClass: 'DeathKnight' },
  shaman: { className: '주술사', kbClass: 'Shaman' },
  mage: { className: '마법사', kbClass: 'Mage' },
  warlock: { className: '흑마법사', kbClass: 'Warlock' },
  monk: { className: '수도사', kbClass: 'Monk' },
  druid: { className: '드루이드', kbClass: 'Druid' },
  demonhunter: { className: '악마사냥꾼', kbClass: 'DemonHunter' },
  evoker: { className: '기원사', kbClass: 'Evoker' },
};

export const guideRoles = [
  { id: 'all', label: '전체' },
  { id: 'tanks', label: '탱커' },
  { id: 'melee', label: '근접' },
  { id: 'ranged', label: '원거리' },
  { id: 'healers', label: '힐러' },
];

export const roleLabels = {
  tanks: '탱커',
  melee: '근접 딜러',
  ranged: '원거리 딜러',
  healers: '힐러',
};

export const classOrder = [
  '전사',
  '성기사',
  '사냥꾼',
  '도적',
  '사제',
  '죽음의 기사',
  '주술사',
  '마법사',
  '흑마법사',
  '수도사',
  '드루이드',
  '악마사냥꾼',
  '기원사',
];

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function spec(id, classKey, specName, kbSpec, role, path, options = {}) {
  const meta = classMeta[classKey];

  return {
    id,
    classKey,
    className: meta.className,
    kbClass: meta.kbClass,
    spec: specName,
    kbSpec,
    kbSpecAliases: unique([kbSpec, specName, ...(options.kbSpecAliases || [])]),
    role,
    roleLabel: roleLabels[role],
    color: classColors[classKey],
    ready: true,
    status: '가이드 작성 완료',
    path,
    focus: options.focus || '핵심 스킬과 시너지를 기준으로 전투 흐름을 정리합니다.',
  };
}

export const guideSpecsByRole = {
  tanks: [
    spec('warrior-protection', 'warrior', '방어', 'Protection', 'tanks', '/guide/warrior/protection', {
      kbSpecAliases: ['방어'],
      focus: '방패 기반 완화와 큰 피해 구간 생존기 분배가 핵심입니다.',
    }),
    spec('paladin-protection', 'paladin', '보호', '보호', 'tanks', '/guide/paladin/protection', {
      kbSpecAliases: ['Protection'],
      focus: '신성한 힘 운용과 파티 유틸을 함께 묶어 방어 창을 유지합니다.',
    }),
    spec('deathknight-blood', 'deathknight', '혈기', '혈기', 'tanks', '/guide/deathknight/blood', {
      kbSpecAliases: ['Blood'],
      focus: '받은 피해를 회복 자원으로 되돌리는 타이밍 관리가 중심입니다.',
    }),
    spec('monk-brewmaster', 'monk', '양조', '양조', 'tanks', '/guide/monk/brewmaster', {
      kbSpecAliases: ['Brewmaster'],
      focus: '시간차 관리와 정화 타이밍을 피해 패턴에 맞춥니다.',
    }),
    spec('druid-guardian', 'druid', '수호', '수호', 'tanks', '/guide/druid/guardian', {
      kbSpecAliases: ['Guardian'],
      focus: '방어 유지율과 광역 위협 확보를 함께 관리합니다.',
    }),
    spec('demonhunter-vengeance', 'demonhunter', '복수', '복수', 'tanks', '/guide/demonhunter/vengeance', {
      kbSpecAliases: ['Vengeance'],
      focus: '영혼 파편, 인장, 악마 쐐기를 큰 피해 구간에 맞춥니다.',
    }),
  ],
  melee: [
    spec('warrior-arms', 'warrior', '무기', 'Arms', 'melee', '/guide/warrior/arms', {
      kbSpecAliases: ['무기'],
      focus: '강한 단일 기술과 처형 구간 우선순위를 분리해 운용합니다.',
    }),
    spec('warrior-fury', 'warrior', '분노', 'Fury', 'melee', '/guide/warrior/fury', {
      kbSpecAliases: ['분노'],
      focus: '분노 생성과 소모를 끊기지 않게 이어 광란 흐름을 유지합니다.',
    }),
    spec('paladin-retribution', 'paladin', '징벌', '징벌', 'melee', '/guide/paladin/retribution', {
      kbSpecAliases: ['Retribution'],
      focus: '신성한 힘을 극딜 창에 모아 폭발적으로 소모합니다.',
    }),
    spec('rogue-assassination', 'rogue', '암살', '암살', 'melee', '/guide/rogue/assassination', {
      kbSpecAliases: ['Assassination'],
      focus: '출혈과 독 유지율을 바탕으로 독살 창을 정렬합니다.',
    }),
    spec('rogue-outlaw', 'rogue', '무법', '무법', 'melee', '/guide/rogue/outlaw', {
      kbSpecAliases: ['Outlaw'],
      focus: '기력, 연계 점수, 발동 기술을 빠르게 순환시킵니다.',
    }),
    spec('rogue-subtlety', 'rogue', '잠행', '잠행', 'melee', '/guide/rogue/subtlety', {
      kbSpecAliases: ['Subtlety'],
      focus: '은신 계열 강화 창에 고가치 기술을 압축합니다.',
    }),
    spec('deathknight-frost', 'deathknight', '냉기', '냉기', 'melee', '/guide/deathknight/frost', {
      kbSpecAliases: ['Frost'],
      focus: '룬과 룬 마력을 얼음 기둥 창에 맞춰 소모합니다.',
    }),
    spec('deathknight-unholy', 'deathknight', '부정', '부정', 'melee', '/guide/deathknight/unholy', {
      kbSpecAliases: ['Unholy'],
      focus: '질병, 소환수, 광역 확산을 극딜 창에 연결합니다.',
    }),
    spec('monk-windwalker', 'monk', '풍운', '풍운', 'melee', '/guide/monk/windwalker', {
      kbSpecAliases: ['Windwalker'],
      focus: '같은 기술 반복을 피하며 기력과 기를 리듬 있게 순환합니다.',
    }),
    spec('druid-feral', 'druid', '야성', '야성', 'melee', '/guide/druid/feral', {
      kbSpecAliases: ['Feral'],
      focus: '출혈 유지율과 흉포한 이빨 소모 타이밍을 분리합니다.',
    }),
    spec('demonhunter-havoc', 'demonhunter', '파멸', '파멸', 'melee', '/guide/demonhunter/havoc', {
      kbSpecAliases: ['Havoc'],
      focus: '분노 생성, 이동형 강화, 극딜 창을 순서대로 겹칩니다.',
    }),
    spec('shaman-enhancement', 'shaman', '고양', '고양', 'melee', '/guide/shaman/enhancement', {
      kbSpecAliases: ['Enhancement'],
      focus: '소용돌이치는 무기와 원소 강화 발동을 낭비 없이 사용합니다.',
    }),
    spec('hunter-survival', 'hunter', '생존', '생존', 'melee', '/guide/hunter/survival', {
      kbSpecAliases: ['Survival'],
      focus: '근접 폭탄 루프와 소환수 연계를 광역 상황에 맞춥니다.',
    }),
  ],
  ranged: [
    spec('hunter-beastmastery', 'hunter', '야수', '야수', 'ranged', '/guide/hunter/beast-mastery', {
      kbSpecAliases: ['BeastMastery', 'Beast Mastery'],
      focus: '소환수 강화 유지와 집중 소모를 이동 중에도 안정적으로 이어갑니다.',
    }),
    spec('hunter-marksmanship', 'hunter', '사격', '사격', 'ranged', '/guide/hunter/marksmanship', {
      kbSpecAliases: ['Marksmanship'],
      focus: '조준 사격 창과 정밀 사격 소모를 우선순위로 관리합니다.',
    }),
    spec('priest-shadow', 'priest', '암흑', '암흑', 'ranged', '/guide/priest/shadow', {
      kbSpecAliases: ['Shadow'],
      focus: '광기 소모와 도트 유지율을 공허 강화 창에 맞춥니다.',
    }),
    spec('demonhunter-devourer', 'demonhunter', '포식', '포식', 'ranged', '/guide/demonhunter/devourer', {
      kbSpecAliases: ['Devourer'],
      focus: '25야드 공허 주문과 영혼 파편을 공허 탈태 창에 맞춥니다.',
    }),
    spec('shaman-elemental', 'shaman', '정기', '정기', 'ranged', '/guide/shaman/elemental', {
      kbSpecAliases: ['Elemental'],
      focus: '소용돌이와 원소 발동을 단일/광역 상황별로 분기합니다.',
    }),
    spec('mage-arcane', 'mage', '비전', '비전', 'ranged', '/guide/mage/arcane', {
      kbSpecAliases: ['Arcane'],
      focus: '마나와 비전 충전물을 극딜 창 전후로 나눠 사용합니다.',
    }),
    spec('mage-fire', 'mage', '화염', '화염', 'ranged', '/guide/mage/fire', {
      kbSpecAliases: ['Fire'],
      focus: '몰아치는 열기와 발화 창을 기준으로 즉시 시전 기술을 정렬합니다.',
    }),
    spec('mage-frost', 'mage', '냉기', '냉기', 'ranged', '/guide/mage/frost', {
      kbSpecAliases: ['Frost'],
      focus: '얼음창 계열 발동과 주문술사의 흐름을 낭비하지 않습니다.',
    }),
    spec('warlock-affliction', 'warlock', '고통', 'Affliction', 'ranged', '/guide/warlock/affliction', {
      kbSpecAliases: ['고통'],
      focus: '도트 유지율과 조각 소모를 단일/광역 압박에 맞춥니다.',
    }),
    spec('warlock-demonology', 'warlock', '악마', 'Demonology', 'ranged', '/guide/warlock/demonology', {
      kbSpecAliases: ['악마'],
      focus: '소환수 누적과 악마 폭군 창을 하나의 빌드업으로 묶습니다.',
    }),
    spec('warlock-destruction', 'warlock', '파괴', 'Destruction', 'ranged', '/guide/warlock/destruction', {
      kbSpecAliases: ['파괴'],
      focus: '영혼의 조각을 혼돈의 화살과 광역 소모 창에 배치합니다.',
    }),
    spec('druid-balance', 'druid', '조화', '조화', 'ranged', '/guide/druid/balance', {
      kbSpecAliases: ['Balance'],
      focus: '천공의 힘과 일월식 흐름을 별똥별/별빛쇄도 선택에 연결합니다.',
    }),
    spec('evoker-devastation', 'evoker', '황폐', '황폐', 'ranged', '/guide/evoker/devastation', {
      kbSpecAliases: ['Devastation'],
      focus: '정수와 강화 주문을 짧은 폭발 창에 정렬합니다.',
    }),
    spec('evoker-augmentation', 'evoker', '증강', '증강', 'ranged', '/guide/evoker/augmentation', {
      kbSpecAliases: ['Augmentation'],
      focus: '아군 강화 유지율과 파티 극딜 창 정렬을 최우선으로 봅니다.',
    }),
  ],
  healers: [
    spec('paladin-holy', 'paladin', '신성', '신성', 'healers', '/guide/paladin/holy', {
      kbSpecAliases: ['Holy'],
      focus: '신성한 힘과 봉화 대상을 큰 피해 구간에 맞춥니다.',
    }),
    spec('priest-discipline', 'priest', '수양', '수양', 'healers', '/guide/priest/discipline', {
      kbSpecAliases: ['Discipline'],
      focus: '속죄 사전 작업과 피해형 회복 창을 계획적으로 배치합니다.',
    }),
    spec('priest-holy', 'priest', '신성', '신성', 'healers', '/guide/priest/holy', {
      kbSpecAliases: ['Holy'],
      focus: '성스러운 권능 기술을 피해 패턴에 맞춰 순환합니다.',
    }),
    spec('shaman-restoration', 'shaman', '복원', '복원', 'healers', '/guide/shaman/restoration', {
      kbSpecAliases: ['Restoration'],
      focus: '성난 해일, 토템, 연쇄 치유를 피해 밀도에 맞춥니다.',
    }),
    spec('monk-mistweaver', 'monk', '운무', '운무', 'healers', '/guide/monk/mistweaver', {
      kbSpecAliases: ['Mistweaver'],
      focus: '안개 유지와 근접 힐링 루프를 상황별로 분리합니다.',
    }),
    spec('druid-restoration', 'druid', '회복', '회복', 'healers', '/guide/druid/restoration', {
      kbSpecAliases: ['Restoration'],
      focus: '지속 회복 사전 작업과 광역 쿨기를 피해 구간에 맞춥니다.',
    }),
    spec('evoker-preservation', 'evoker', '보존', '보존', 'healers', '/guide/evoker/preservation', {
      kbSpecAliases: ['Preservation'],
      focus: '메아리, 강화 주문, 시간 계열 회복을 짧은 사거리 안에서 정렬합니다.',
    }),
  ],
};

export function getAllGuideSpecs() {
  return [
    ...guideSpecsByRole.tanks,
    ...guideSpecsByRole.melee,
    ...guideSpecsByRole.ranged,
    ...guideSpecsByRole.healers,
  ];
}

export function getReadyGuideSpecs() {
  return getAllGuideSpecs().filter(item => item.ready);
}

export function getGroupedGuideSpecs(specs = getAllGuideSpecs()) {
  const grouped = specs.reduce((result, item) => {
    if (!result[item.className]) {
      result[item.className] = {
        name: item.className,
        color: item.color,
        specs: [],
      };
    }
    result[item.className].specs.push(item);
    return result;
  }, {});

  return classOrder
    .filter(className => grouped[className])
    .map(className => grouped[className]);
}
