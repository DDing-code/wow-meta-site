/**
 * WoW 전문화별 가이드 링크 데이터베이스
 * TWW 시즌 3 (11.2 패치) 기준
 *
 * 구조:
 * - 클래스 > 전문화 > 가이드 사이트별 링크
 * - 각 링크는 최신 업데이트 날짜 포함
 * - 한국어/영어 버전 구분
 */

const guideLinks = {
  // 전사 (Warrior)
  warrior: {
    arms: {
      name: '무기 전사',
      nameEng: 'Arms Warrior',
      role: 'DPS',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/warrior/arms/overview-pve-dps',
          en: 'https://www.wowhead.com/guide/classes/warrior/arms/overview-pve-dps'
        },
        icyVeins: 'https://www.icy-veins.com/wow/arms-warrior-pve-dps-guide',
        maxroll: 'https://maxroll.gg/wow/guides/arms-warrior',
        archon: 'https://www.archon.gg/wow/builds/arms-warrior-dps-raid-the-war-within',
        method: 'https://www.method.gg/guides/arms-warrior',
        wowMeta: 'https://www.wowmeta.com/guides/arms-warrior'
      }
    },
    fury: {
      name: '분노 전사',
      nameEng: 'Fury Warrior',
      role: 'DPS',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/warrior/fury/overview-pve-dps',
          en: 'https://www.wowhead.com/guide/classes/warrior/fury/overview-pve-dps'
        },
        icyVeins: 'https://www.icy-veins.com/wow/fury-warrior-pve-dps-guide',
        maxroll: 'https://maxroll.gg/wow/guides/fury-warrior',
        archon: 'https://www.archon.gg/wow/builds/fury-warrior-dps-raid-the-war-within',
        method: 'https://www.method.gg/guides/fury-warrior'
      }
    },
    protection: {
      name: '방어 전사',
      nameEng: 'Protection Warrior',
      role: 'Tank',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/warrior/protection/overview-pve-tank',
          en: 'https://www.wowhead.com/guide/classes/warrior/protection/overview-pve-tank'
        },
        icyVeins: 'https://www.icy-veins.com/wow/protection-warrior-pve-tank-guide',
        maxroll: 'https://maxroll.gg/wow/guides/protection-warrior',
        archon: 'https://www.archon.gg/wow/builds/protection-warrior-tank-raid-the-war-within'
      }
    }
  },

  // 성기사 (Paladin)
  paladin: {
    holy: {
      name: '신성 성기사',
      nameEng: 'Holy Paladin',
      role: 'Healer',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/paladin/holy/overview-pve-healer',
          en: 'https://www.wowhead.com/guide/classes/paladin/holy/overview-pve-healer'
        },
        icyVeins: 'https://www.icy-veins.com/wow/holy-paladin-pve-healing-guide',
        maxroll: 'https://maxroll.gg/wow/guides/holy-paladin',
        archon: 'https://www.archon.gg/wow/builds/holy-paladin-healer-raid-the-war-within'
      }
    },
    protection: {
      name: '보호 성기사',
      nameEng: 'Protection Paladin',
      role: 'Tank',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/paladin/protection/overview-pve-tank',
          en: 'https://www.wowhead.com/guide/classes/paladin/protection/overview-pve-tank'
        },
        icyVeins: 'https://www.icy-veins.com/wow/protection-paladin-pve-tank-guide',
        maxroll: 'https://maxroll.gg/wow/guides/protection-paladin',
        archon: 'https://www.archon.gg/wow/builds/protection-paladin-tank-raid-the-war-within'
      }
    },
    retribution: {
      name: '징벌 성기사',
      nameEng: 'Retribution Paladin',
      role: 'DPS',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/paladin/retribution/overview-pve-dps',
          en: 'https://www.wowhead.com/guide/classes/paladin/retribution/overview-pve-dps'
        },
        icyVeins: 'https://www.icy-veins.com/wow/retribution-paladin-pve-dps-guide',
        maxroll: 'https://maxroll.gg/wow/guides/retribution-paladin',
        archon: 'https://www.archon.gg/wow/builds/retribution-paladin-dps-raid-the-war-within',
        method: 'https://www.method.gg/guides/retribution-paladin'
      }
    }
  },

  // 사냥꾼 (Hunter)
  hunter: {
    'beast-mastery': {
      name: '야수 사냥꾼',
      nameEng: 'Beast Mastery Hunter',
      role: 'DPS',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/hunter/beast-mastery/overview-pve-dps',
          en: 'https://www.wowhead.com/guide/classes/hunter/beast-mastery/overview-pve-dps'
        },
        icyVeins: 'https://www.icy-veins.com/wow/beast-mastery-hunter-pve-dps-guide',
        maxroll: 'https://maxroll.gg/wow/guides/beast-mastery-hunter-guide',
        archon: 'https://www.archon.gg/wow/builds/beast-mastery-hunter-dps-raid-the-war-within',
        method: 'https://www.method.gg/guides/beast-mastery-hunter',
        wowMeta: 'https://www.wowmeta.com/guides/beast-mastery-hunter'
      }
    },
    marksmanship: {
      name: '사격 사냥꾼',
      nameEng: 'Marksmanship Hunter',
      role: 'DPS',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/hunter/marksmanship/overview-pve-dps',
          en: 'https://www.wowhead.com/guide/classes/hunter/marksmanship/overview-pve-dps'
        },
        icyVeins: 'https://www.icy-veins.com/wow/marksmanship-hunter-pve-dps-guide',
        maxroll: 'https://maxroll.gg/wow/guides/marksmanship-hunter',
        archon: 'https://www.archon.gg/wow/builds/marksmanship-hunter-dps-raid-the-war-within',
        method: 'https://www.method.gg/guides/marksmanship-hunter'
      }
    },
    survival: {
      name: '생존 사냥꾼',
      nameEng: 'Survival Hunter',
      role: 'DPS',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/hunter/survival/overview-pve-dps',
          en: 'https://www.wowhead.com/guide/classes/hunter/survival/overview-pve-dps'
        },
        icyVeins: 'https://www.icy-veins.com/wow/survival-hunter-pve-dps-guide',
        maxroll: 'https://maxroll.gg/wow/guides/survival-hunter',
        archon: 'https://www.archon.gg/wow/builds/survival-hunter-dps-raid-the-war-within'
      }
    }
  },

  // 도적 (Rogue)
  rogue: {
    assassination: {
      name: '암살 도적',
      nameEng: 'Assassination Rogue',
      role: 'DPS',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/rogue/assassination/overview-pve-dps',
          en: 'https://www.wowhead.com/guide/classes/rogue/assassination/overview-pve-dps'
        },
        icyVeins: 'https://www.icy-veins.com/wow/assassination-rogue-pve-dps-guide',
        maxroll: 'https://maxroll.gg/wow/guides/assassination-rogue',
        archon: 'https://www.archon.gg/wow/builds/assassination-rogue-dps-raid-the-war-within'
      }
    },
    outlaw: {
      name: '무법 도적',
      nameEng: 'Outlaw Rogue',
      role: 'DPS',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/rogue/outlaw/overview-pve-dps',
          en: 'https://www.wowhead.com/guide/classes/rogue/outlaw/overview-pve-dps'
        },
        icyVeins: 'https://www.icy-veins.com/wow/outlaw-rogue-pve-dps-guide',
        maxroll: 'https://maxroll.gg/wow/guides/outlaw-rogue',
        archon: 'https://www.archon.gg/wow/builds/outlaw-rogue-dps-raid-the-war-within'
      }
    },
    subtlety: {
      name: '잠행 도적',
      nameEng: 'Subtlety Rogue',
      role: 'DPS',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/rogue/subtlety/overview-pve-dps',
          en: 'https://www.wowhead.com/guide/classes/rogue/subtlety/overview-pve-dps'
        },
        icyVeins: 'https://www.icy-veins.com/wow/subtlety-rogue-pve-dps-guide',
        maxroll: 'https://maxroll.gg/wow/guides/subtlety-rogue',
        archon: 'https://www.archon.gg/wow/builds/subtlety-rogue-dps-raid-the-war-within'
      }
    }
  },

  // 사제 (Priest)
  priest: {
    discipline: {
      name: '수양 사제',
      nameEng: 'Discipline Priest',
      role: 'Healer',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/priest/discipline/overview-pve-healer',
          en: 'https://www.wowhead.com/guide/classes/priest/discipline/overview-pve-healer'
        },
        icyVeins: 'https://www.icy-veins.com/wow/discipline-priest-pve-healing-guide',
        maxroll: 'https://maxroll.gg/wow/guides/discipline-priest',
        archon: 'https://www.archon.gg/wow/builds/discipline-priest-healer-raid-the-war-within'
      }
    },
    holy: {
      name: '신성 사제',
      nameEng: 'Holy Priest',
      role: 'Healer',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/priest/holy/overview-pve-healer',
          en: 'https://www.wowhead.com/guide/classes/priest/holy/overview-pve-healer'
        },
        icyVeins: 'https://www.icy-veins.com/wow/holy-priest-pve-healing-guide',
        maxroll: 'https://maxroll.gg/wow/guides/holy-priest',
        archon: 'https://www.archon.gg/wow/builds/holy-priest-healer-raid-the-war-within'
      }
    },
    shadow: {
      name: '암흑 사제',
      nameEng: 'Shadow Priest',
      role: 'DPS',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/priest/shadow/overview-pve-dps',
          en: 'https://www.wowhead.com/guide/classes/priest/shadow/overview-pve-dps'
        },
        icyVeins: 'https://www.icy-veins.com/wow/shadow-priest-pve-dps-guide',
        maxroll: 'https://maxroll.gg/wow/guides/shadow-priest',
        archon: 'https://www.archon.gg/wow/builds/shadow-priest-dps-raid-the-war-within',
        method: 'https://www.method.gg/guides/shadow-priest'
      }
    }
  },

  // 죽음의 기사 (Death Knight)
  'death-knight': {
    blood: {
      name: '혈기 죽음의 기사',
      nameEng: 'Blood Death Knight',
      role: 'Tank',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/death-knight/blood/overview-pve-tank',
          en: 'https://www.wowhead.com/guide/classes/death-knight/blood/overview-pve-tank'
        },
        icyVeins: 'https://www.icy-veins.com/wow/blood-death-knight-pve-tank-guide',
        maxroll: 'https://maxroll.gg/wow/guides/blood-death-knight',
        archon: 'https://www.archon.gg/wow/builds/blood-death-knight-tank-raid-the-war-within'
      }
    },
    frost: {
      name: '냉기 죽음의 기사',
      nameEng: 'Frost Death Knight',
      role: 'DPS',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/death-knight/frost/overview-pve-dps',
          en: 'https://www.wowhead.com/guide/classes/death-knight/frost/overview-pve-dps'
        },
        icyVeins: 'https://www.icy-veins.com/wow/frost-death-knight-pve-dps-guide',
        maxroll: 'https://maxroll.gg/wow/guides/frost-death-knight',
        archon: 'https://www.archon.gg/wow/builds/frost-death-knight-dps-raid-the-war-within'
      }
    },
    unholy: {
      name: '부정 죽음의 기사',
      nameEng: 'Unholy Death Knight',
      role: 'DPS',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/death-knight/unholy/overview-pve-dps',
          en: 'https://www.wowhead.com/guide/classes/death-knight/unholy/overview-pve-dps'
        },
        icyVeins: 'https://www.icy-veins.com/wow/unholy-death-knight-pve-dps-guide',
        maxroll: 'https://maxroll.gg/wow/guides/unholy-death-knight',
        archon: 'https://www.archon.gg/wow/builds/unholy-death-knight-dps-raid-the-war-within'
      }
    }
  },

  // 주술사 (Shaman)
  shaman: {
    elemental: {
      name: '정기 주술사',
      nameEng: 'Elemental Shaman',
      role: 'DPS',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/shaman/elemental/overview-pve-dps',
          en: 'https://www.wowhead.com/guide/classes/shaman/elemental/overview-pve-dps'
        },
        icyVeins: 'https://www.icy-veins.com/wow/elemental-shaman-pve-dps-guide',
        maxroll: 'https://maxroll.gg/wow/guides/elemental-shaman',
        archon: 'https://www.archon.gg/wow/builds/elemental-shaman-dps-raid-the-war-within',
        method: 'https://www.method.gg/guides/elemental-shaman'
      }
    },
    enhancement: {
      name: '고양 주술사',
      nameEng: 'Enhancement Shaman',
      role: 'DPS',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/shaman/enhancement/overview-pve-dps',
          en: 'https://www.wowhead.com/guide/classes/shaman/enhancement/overview-pve-dps'
        },
        icyVeins: 'https://www.icy-veins.com/wow/enhancement-shaman-pve-dps-guide',
        maxroll: 'https://maxroll.gg/wow/guides/enhancement-shaman',
        archon: 'https://www.archon.gg/wow/builds/enhancement-shaman-dps-raid-the-war-within'
      }
    },
    restoration: {
      name: '복원 주술사',
      nameEng: 'Restoration Shaman',
      role: 'Healer',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/shaman/restoration/overview-pve-healer',
          en: 'https://www.wowhead.com/guide/classes/shaman/restoration/overview-pve-healer'
        },
        icyVeins: 'https://www.icy-veins.com/wow/restoration-shaman-pve-healing-guide',
        maxroll: 'https://maxroll.gg/wow/guides/restoration-shaman',
        archon: 'https://www.archon.gg/wow/builds/restoration-shaman-healer-raid-the-war-within'
      }
    }
  },

  // 마법사 (Mage)
  mage: {
    arcane: {
      name: '비전 마법사',
      nameEng: 'Arcane Mage',
      role: 'DPS',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/mage/arcane/overview-pve-dps',
          en: 'https://www.wowhead.com/guide/classes/mage/arcane/overview-pve-dps'
        },
        icyVeins: 'https://www.icy-veins.com/wow/arcane-mage-pve-dps-guide',
        maxroll: 'https://maxroll.gg/wow/guides/arcane-mage',
        archon: 'https://www.archon.gg/wow/builds/arcane-mage-dps-raid-the-war-within',
        method: 'https://www.method.gg/guides/arcane-mage'
      }
    },
    fire: {
      name: '화염 마법사',
      nameEng: 'Fire Mage',
      role: 'DPS',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/mage/fire/overview-pve-dps',
          en: 'https://www.wowhead.com/guide/classes/mage/fire/overview-pve-dps'
        },
        icyVeins: 'https://www.icy-veins.com/wow/fire-mage-pve-dps-guide',
        maxroll: 'https://maxroll.gg/wow/guides/fire-mage',
        archon: 'https://www.archon.gg/wow/builds/fire-mage-dps-raid-the-war-within',
        method: 'https://www.method.gg/guides/fire-mage'
      }
    },
    frost: {
      name: '냉기 마법사',
      nameEng: 'Frost Mage',
      role: 'DPS',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/mage/frost/overview-pve-dps',
          en: 'https://www.wowhead.com/guide/classes/mage/frost/overview-pve-dps'
        },
        icyVeins: 'https://www.icy-veins.com/wow/frost-mage-pve-dps-guide',
        maxroll: 'https://maxroll.gg/wow/guides/frost-mage',
        archon: 'https://www.archon.gg/wow/builds/frost-mage-dps-raid-the-war-within'
      }
    }
  },

  // 흑마법사 (Warlock)
  warlock: {
    affliction: {
      name: '고통 흑마법사',
      nameEng: 'Affliction Warlock',
      role: 'DPS',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/warlock/affliction/overview-pve-dps',
          en: 'https://www.wowhead.com/guide/classes/warlock/affliction/overview-pve-dps'
        },
        icyVeins: 'https://www.icy-veins.com/wow/affliction-warlock-pve-dps-guide',
        maxroll: 'https://maxroll.gg/wow/guides/affliction-warlock',
        archon: 'https://www.archon.gg/wow/builds/affliction-warlock-dps-raid-the-war-within'
      }
    },
    demonology: {
      name: '악마 흑마법사',
      nameEng: 'Demonology Warlock',
      role: 'DPS',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/warlock/demonology/overview-pve-dps',
          en: 'https://www.wowhead.com/guide/classes/warlock/demonology/overview-pve-dps'
        },
        icyVeins: 'https://www.icy-veins.com/wow/demonology-warlock-pve-dps-guide',
        maxroll: 'https://maxroll.gg/wow/guides/demonology-warlock',
        archon: 'https://www.archon.gg/wow/builds/demonology-warlock-dps-raid-the-war-within'
      }
    },
    destruction: {
      name: '파괴 흑마법사',
      nameEng: 'Destruction Warlock',
      role: 'DPS',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/warlock/destruction/overview-pve-dps',
          en: 'https://www.wowhead.com/guide/classes/warlock/destruction/overview-pve-dps'
        },
        icyVeins: 'https://www.icy-veins.com/wow/destruction-warlock-pve-dps-guide',
        maxroll: 'https://maxroll.gg/wow/guides/destruction-warlock',
        archon: 'https://www.archon.gg/wow/builds/destruction-warlock-dps-raid-the-war-within',
        method: 'https://www.method.gg/guides/destruction-warlock'
      }
    }
  },

  // 수도사 (Monk)
  monk: {
    brewmaster: {
      name: '양조 수도사',
      nameEng: 'Brewmaster Monk',
      role: 'Tank',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/monk/brewmaster/overview-pve-tank',
          en: 'https://www.wowhead.com/guide/classes/monk/brewmaster/overview-pve-tank'
        },
        icyVeins: 'https://www.icy-veins.com/wow/brewmaster-monk-pve-tank-guide',
        maxroll: 'https://maxroll.gg/wow/guides/brewmaster-monk',
        archon: 'https://www.archon.gg/wow/builds/brewmaster-monk-tank-raid-the-war-within'
      }
    },
    mistweaver: {
      name: '운무 수도사',
      nameEng: 'Mistweaver Monk',
      role: 'Healer',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/monk/mistweaver/overview-pve-healer',
          en: 'https://www.wowhead.com/guide/classes/monk/mistweaver/overview-pve-healer'
        },
        icyVeins: 'https://www.icy-veins.com/wow/mistweaver-monk-pve-healing-guide',
        maxroll: 'https://maxroll.gg/wow/guides/mistweaver-monk',
        archon: 'https://www.archon.gg/wow/builds/mistweaver-monk-healer-raid-the-war-within'
      }
    },
    windwalker: {
      name: '풍운 수도사',
      nameEng: 'Windwalker Monk',
      role: 'DPS',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/monk/windwalker/overview-pve-dps',
          en: 'https://www.wowhead.com/guide/classes/monk/windwalker/overview-pve-dps'
        },
        icyVeins: 'https://www.icy-veins.com/wow/windwalker-monk-pve-dps-guide',
        maxroll: 'https://maxroll.gg/wow/guides/windwalker-monk',
        archon: 'https://www.archon.gg/wow/builds/windwalker-monk-dps-raid-the-war-within'
      }
    }
  },

  // 드루이드 (Druid)
  druid: {
    balance: {
      name: '조화 드루이드',
      nameEng: 'Balance Druid',
      role: 'DPS',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/druid/balance/overview-pve-dps',
          en: 'https://www.wowhead.com/guide/classes/druid/balance/overview-pve-dps'
        },
        icyVeins: 'https://www.icy-veins.com/wow/balance-druid-pve-dps-guide',
        maxroll: 'https://maxroll.gg/wow/guides/balance-druid',
        archon: 'https://www.archon.gg/wow/builds/balance-druid-dps-raid-the-war-within',
        method: 'https://www.method.gg/guides/balance-druid'
      }
    },
    feral: {
      name: '야성 드루이드',
      nameEng: 'Feral Druid',
      role: 'DPS',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/druid/feral/overview-pve-dps',
          en: 'https://www.wowhead.com/guide/classes/druid/feral/overview-pve-dps'
        },
        icyVeins: 'https://www.icy-veins.com/wow/feral-druid-pve-dps-guide',
        maxroll: 'https://maxroll.gg/wow/guides/feral-druid',
        archon: 'https://www.archon.gg/wow/builds/feral-druid-dps-raid-the-war-within'
      }
    },
    guardian: {
      name: '수호 드루이드',
      nameEng: 'Guardian Druid',
      role: 'Tank',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/druid/guardian/overview-pve-tank',
          en: 'https://www.wowhead.com/guide/classes/druid/guardian/overview-pve-tank'
        },
        icyVeins: 'https://www.icy-veins.com/wow/guardian-druid-pve-tank-guide',
        maxroll: 'https://maxroll.gg/wow/guides/guardian-druid',
        archon: 'https://www.archon.gg/wow/builds/guardian-druid-tank-raid-the-war-within'
      }
    },
    restoration: {
      name: '회복 드루이드',
      nameEng: 'Restoration Druid',
      role: 'Healer',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/druid/restoration/overview-pve-healer',
          en: 'https://www.wowhead.com/guide/classes/druid/restoration/overview-pve-healer'
        },
        icyVeins: 'https://www.icy-veins.com/wow/restoration-druid-pve-healing-guide',
        maxroll: 'https://maxroll.gg/wow/guides/restoration-druid',
        archon: 'https://www.archon.gg/wow/builds/restoration-druid-healer-raid-the-war-within'
      }
    }
  },

  // 악마사냥꾼 (Demon Hunter)
  'demon-hunter': {
    havoc: {
      name: '파멸 악마사냥꾼',
      nameEng: 'Havoc Demon Hunter',
      role: 'DPS',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/demon-hunter/havoc/overview-pve-dps',
          en: 'https://www.wowhead.com/guide/classes/demon-hunter/havoc/overview-pve-dps'
        },
        icyVeins: 'https://www.icy-veins.com/wow/havoc-demon-hunter-pve-dps-guide',
        maxroll: 'https://maxroll.gg/wow/guides/havoc-demon-hunter',
        archon: 'https://www.archon.gg/wow/builds/havoc-demon-hunter-dps-raid-the-war-within',
        method: 'https://www.method.gg/guides/havoc-demon-hunter'
      }
    },
    vengeance: {
      name: '복수 악마사냥꾼',
      nameEng: 'Vengeance Demon Hunter',
      role: 'Tank',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/demon-hunter/vengeance/overview-pve-tank',
          en: 'https://www.wowhead.com/guide/classes/demon-hunter/vengeance/overview-pve-tank'
        },
        icyVeins: 'https://www.icy-veins.com/wow/vengeance-demon-hunter-pve-tank-guide',
        maxroll: 'https://maxroll.gg/wow/guides/vengeance-demon-hunter',
        archon: 'https://www.archon.gg/wow/builds/vengeance-demon-hunter-tank-raid-the-war-within'
      }
    }
  },

  // 기원사 (Evoker)
  evoker: {
    devastation: {
      name: '황폐 기원사',
      nameEng: 'Devastation Evoker',
      role: 'DPS',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/evoker/devastation/overview-pve-dps',
          en: 'https://www.wowhead.com/guide/classes/evoker/devastation/overview-pve-dps'
        },
        icyVeins: 'https://www.icy-veins.com/wow/devastation-evoker-pve-dps-guide',
        maxroll: 'https://maxroll.gg/wow/guides/devastation-evoker',
        archon: 'https://www.archon.gg/wow/builds/devastation-evoker-dps-raid-the-war-within',
        method: 'https://www.method.gg/guides/devastation-evoker',
        wowMeta: 'https://www.wowmeta.com/guides/devastation-evoker'
      }
    },
    preservation: {
      name: '보존 기원사',
      nameEng: 'Preservation Evoker',
      role: 'Healer',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/evoker/preservation/overview-pve-healer',
          en: 'https://www.wowhead.com/guide/classes/evoker/preservation/overview-pve-healer'
        },
        icyVeins: 'https://www.icy-veins.com/wow/preservation-evoker-pve-healing-guide',
        maxroll: 'https://maxroll.gg/wow/guides/preservation-evoker',
        archon: 'https://www.archon.gg/wow/builds/preservation-evoker-healer-raid-the-war-within'
      }
    },
    augmentation: {
      name: '증강 기원사',
      nameEng: 'Augmentation Evoker',
      role: 'DPS',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/evoker/augmentation/overview-pve-dps',
          en: 'https://www.wowhead.com/guide/classes/evoker/augmentation/overview-pve-dps'
        },
        icyVeins: 'https://www.icy-veins.com/wow/augmentation-evoker-pve-dps-guide',
        maxroll: 'https://maxroll.gg/wow/guides/augmentation-evoker',
        archon: 'https://www.archon.gg/wow/builds/augmentation-evoker-dps-raid-the-war-within',
        method: 'https://www.method.gg/guides/augmentation-evoker'
      }
    }
  }
};

// 유틸리티 함수들
export const getGuideLinks = (className, specName) => {
  return guideLinks[className]?.[specName] || null;
};

export const getAllClasses = () => {
  return Object.keys(guideLinks);
};

export const getSpecsByClass = (className) => {
  return Object.keys(guideLinks[className] || {});
};

export const getSpecsByRole = (role) => {
  const specs = [];
  Object.entries(guideLinks).forEach(([className, classSpecs]) => {
    Object.entries(classSpecs).forEach(([specName, specData]) => {
      if (specData.role === role) {
        specs.push({
          className,
          specName,
          ...specData
        });
      }
    });
  });
  return specs;
};

// 링크 유효성 검증 함수
export const validateLink = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error(`링크 검증 실패: ${url}`, error);
    return false;
  }
};

// 패치 버전 정보
export const patchInfo = {
  current: '11.2',
  season: 'TWW Season 3',
  lastUpdated: '2025-09-27'
};

export default guideLinks;