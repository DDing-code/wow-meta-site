const fs = require('fs');
const path = require('path');

// TWW Season 3 (11.0.5) 현재 활성화된 스킬만 포함
// PvP 특성 제거, 삭제된 스킬 제거

const TWW_SEASON3_SKILLS = {
  // 전사 (Warrior)
  warrior: {
    baseline: {
      // Core abilities
      1464: { name: 'Slam', kr: '적중' },
      23922: { name: 'Shield Slam', kr: '방패 밀쳐내기' },
      6343: { name: 'Thunder Clap', kr: '천둥벼락' },
      100: { name: 'Charge', kr: '돌진' },
      355: { name: 'Taunt', kr: '도발' },
      1160: { name: 'Demoralizing Shout', kr: '사기의 외침' },
      6673: { name: 'Battle Shout', kr: '전투의 외침' },
      18499: { name: 'Berserker Rage', kr: '광전사의 격노' },
      2565: { name: 'Shield Block', kr: '방패 막기' },

      // Spec abilities
      12294: { name: 'Mortal Strike', kr: '필사의 일격', spec: 'Arms' },
      772: { name: 'Rend', kr: '분쇄', spec: 'Arms' },
      227847: { name: 'Bladestorm', kr: '칼폭풍', spec: 'Arms' },
      152277: { name: 'Ravager', kr: '쇄도', spec: 'Arms' },
      167105: { name: 'Colossus Smash', kr: '거인의 강타', spec: 'Arms' },

      23881: { name: 'Bloodthirst', kr: '피의 갈증', spec: 'Fury' },
      184367: { name: 'Rampage', kr: '격앙', spec: 'Fury' },
      85288: { name: 'Raging Blow', kr: '성난 타격', spec: 'Fury' },
      1719: { name: 'Recklessness', kr: '무모한 희생', spec: 'Fury' },

      23922: { name: 'Shield Slam', kr: '방패 밀쳐내기', spec: 'Protection' },
      6572: { name: 'Revenge', kr: '복수', spec: 'Protection' },
      871: { name: 'Shield Wall', kr: '방패의 벽', spec: 'Protection' },
      12975: { name: 'Last Stand', kr: '최후의 저항', spec: 'Protection' }
    },
    heroTalents: {
      // Mountain Thane
      436147: { name: 'Thunder Blast', kr: '천둥 폭발', tree: 'Mountain Thane' },
      436152: { name: 'Crashing Thunder', kr: '격돌하는 천둥', tree: 'Mountain Thane' },

      // Colossus
      440989: { name: 'Colossal Might', kr: '거대한 힘', tree: 'Colossus' },
      440993: { name: 'Demolish', kr: '파괴', tree: 'Colossus' },

      // Slayer
      444770: { name: "Slayer's Dominance", kr: '학살자의 지배', tree: 'Slayer' },
      444775: { name: 'Overwhelming Blades', kr: '압도적인 칼날', tree: 'Slayer' }
    }
  },

  // 성기사 (Paladin)
  paladin: {
    baseline: {
      // Core abilities
      19750: { name: 'Flash of Light', kr: '빛의 섬광' },
      82326: { name: 'Holy Light', kr: '성스러운 빛' },
      633: { name: 'Lay on Hands', kr: '신의 축복' },
      642: { name: 'Divine Shield', kr: '천상의 보호막' },
      853: { name: 'Hammer of Justice', kr: '심판의 망치' },
      1044: { name: 'Blessing of Freedom', kr: '자유의 축복' },
      1022: { name: 'Blessing of Protection', kr: '보호의 축복' },
      6940: { name: 'Blessing of Sacrifice', kr: '희생의 축복' },

      // Holy
      20473: { name: 'Holy Shock', kr: '신성 충격', spec: 'Holy' },
      53563: { name: 'Beacon of Light', kr: '빛의 봉화', spec: 'Holy' },
      31884: { name: 'Avenging Wrath', kr: '응징의 격노', spec: 'Holy' },
      85222: { name: 'Light of Dawn', kr: '여명의 빛', spec: 'Holy' },
      31821: { name: 'Aura Mastery', kr: '오라 숙련', spec: 'Holy' },

      // Protection
      31935: { name: "Avenger's Shield", kr: '응징의 방패', spec: 'Protection' },
      26573: { name: 'Consecration', kr: '신성화', spec: 'Protection' },
      53600: { name: 'Shield of the Righteous', kr: '정의의 방패', spec: 'Protection' },
      86659: { name: 'Guardian of Ancient Kings', kr: '고대 왕의 수호자', spec: 'Protection' },
      31850: { name: 'Ardent Defender', kr: '헌신적인 수호자', spec: 'Protection' },

      // Retribution
      85256: { name: "Templar's Verdict", kr: '기사단의 선고', spec: 'Retribution' },
      184575: { name: 'Blade of Justice', kr: '정의의 칼날', spec: 'Retribution' },
      255937: { name: 'Wake of Ashes', kr: '파멸의 재', spec: 'Retribution' },
      53385: { name: 'Divine Storm', kr: '천상의 폭풍', spec: 'Retribution' }
    },
    heroTalents: {
      // Herald of the Sun
      432459: { name: 'Dawnlight', kr: '여명빛', tree: 'Herald of the Sun' },
      432467: { name: "Sun's Avatar", kr: '태양의 화신', tree: 'Herald of the Sun' },

      // Lightsmith
      432578: { name: 'Holy Bulwark', kr: '신성한 방벽', tree: 'Lightsmith' },

      // Templar
      427453: { name: 'Hammer of Light', kr: '빛의 망치', tree: 'Templar' }
    }
  },

  // 사냥꾼 (Hunter)
  hunter: {
    baseline: {
      // Core
      56641: { name: 'Steady Shot', kr: '일정 사격' },
      185358: { name: 'Arcane Shot', kr: '비전 사격' },
      257044: { name: 'Rapid Fire', kr: '속사' },
      19434: { name: 'Aimed Shot', kr: '조준 사격' },
      186265: { name: 'Aspect of the Turtle', kr: '거북의 상' },
      109304: { name: 'Exhilaration', kr: '활기' },
      187650: { name: 'Freezing Trap', kr: '얼음 덫' },

      // Beast Mastery
      34026: { name: 'Kill Command', kr: '살상 명령', spec: 'Beast Mastery' },
      193530: { name: 'Aspect of the Wild', kr: '야생의 상', spec: 'Beast Mastery' },
      19574: { name: 'Bestial Wrath', kr: '야수의 격노', spec: 'Beast Mastery' },
      217200: { name: 'Barbed Shot', kr: '날카로운 사격', spec: 'Beast Mastery' },

      // Marksmanship
      257620: { name: 'Multi-Shot', kr: '다중 사격', spec: 'Marksmanship' },
      260402: { name: 'Double Tap', kr: '연타', spec: 'Marksmanship' },
      288613: { name: 'Trueshot', kr: '정조준', spec: 'Marksmanship' },

      // Survival
      259495: { name: 'Wildfire Bomb', kr: '야생불 폭탄', spec: 'Survival' },
      259489: { name: 'Kill Command', kr: '살상 명령', spec: 'Survival' },
      266779: { name: 'Coordinated Assault', kr: '협공', spec: 'Survival' }
    },
    heroTalents: {
      // Dark Ranger
      439518: { name: 'Black Arrow', kr: '검은 화살', tree: 'Dark Ranger' },

      // Pack Leader
      445701: { name: 'Pack Coordination', kr: '무리 조율', tree: 'Pack Leader' },

      // Sentinel
      450373: { name: "Sentinel's Watch", kr: '파수병의 감시', tree: 'Sentinel' }
    }
  },

  // 도적 (Rogue)
  rogue: {
    baseline: {
      // Core
      1752: { name: 'Sinister Strike', kr: '사악한 일격' },
      196819: { name: 'Eviscerate', kr: '절개' },
      1966: { name: 'Feint', kr: '교란' },
      185311: { name: 'Crimson Vial', kr: '진홍색 약병' },
      1856: { name: 'Vanish', kr: '소멸' },
      2983: { name: 'Sprint', kr: '전력 질주' },
      408: { name: 'Kidney Shot', kr: '급소 가격' },

      // Assassination
      1329: { name: 'Mutilate', kr: '훼손', spec: 'Assassination' },
      32645: { name: 'Envenom', kr: '독살', spec: 'Assassination' },
      703: { name: 'Garrote', kr: '목조르기', spec: 'Assassination' },
      1943: { name: 'Rupture', kr: '파열', spec: 'Assassination' },

      // Outlaw
      193315: { name: 'Roll the Bones', kr: '뼈 주사위', spec: 'Outlaw' },
      315508: { name: 'Roll the Bones', kr: '뼈 주사위', spec: 'Outlaw' },
      13750: { name: 'Adrenaline Rush', kr: '아드레날린 촉진', spec: 'Outlaw' },

      // Subtlety
      185438: { name: 'Shadowstrike', kr: '그림자 일격', spec: 'Subtlety' },
      280719: { name: 'Secret Technique', kr: '비밀 기술', spec: 'Subtlety' },
      121471: { name: 'Shadow Blades', kr: '그림자 칼날', spec: 'Subtlety' }
    },
    heroTalents: {
      // Trickster
      441403: { name: 'Unseen Blade', kr: '보이지 않는 칼날', tree: 'Trickster' },

      // Fatebound
      452068: { name: 'Hand of Fate', kr: '운명의 손', tree: 'Fatebound' },

      // Deathstalker
      457033: { name: 'Hunt Them Down', kr: '사냥 개시', tree: 'Deathstalker' }
    }
  },

  // 사제 (Priest)
  priest: {
    baseline: {
      // Core
      585: { name: 'Smite', kr: '성스러운 일격' },
      2061: { name: 'Flash Heal', kr: '순간 치유' },
      2060: { name: 'Heal', kr: '치유' },
      17: { name: 'Power Word: Shield', kr: '신의 권능: 보호막' },
      139: { name: 'Renew', kr: '소생' },
      527: { name: 'Purify', kr: '정화' },

      // Discipline
      47540: { name: 'Penance', kr: '고해', spec: 'Discipline' },
      194509: { name: 'Power Word: Radiance', kr: '신의 권능: 광휘', spec: 'Discipline' },
      47536: { name: 'Rapture', kr: '환희', spec: 'Discipline' },

      // Holy
      2050: { name: 'Holy Word: Serenity', kr: '신성한 언령: 평온', spec: 'Holy' },
      34861: { name: 'Holy Word: Sanctify', kr: '신성한 언령: 성화', spec: 'Holy' },
      64843: { name: 'Divine Hymn', kr: '천상의 찬가', spec: 'Holy' },

      // Shadow
      8092: { name: 'Mind Blast', kr: '정신 분열', spec: 'Shadow' },
      15407: { name: 'Mind Flay', kr: '정신 채찍', spec: 'Shadow' },
      228260: { name: 'Void Eruption', kr: '공허 분출', spec: 'Shadow' },
      32379: { name: 'Shadow Word: Death', kr: '어둠의 권능: 죽음', spec: 'Shadow' }
    },
    heroTalents: {
      // Archon
      453570: { name: 'Perfected Form', kr: '완성된 형태', tree: 'Archon' },

      // Oracle
      449882: { name: 'Premonition', kr: '예감', tree: 'Oracle' },

      // Voidweaver
      447444: { name: 'Entropic Rift', kr: '엔트로피 균열', tree: 'Voidweaver' }
    }
  },

  // 죽음의 기사 (Death Knight)
  deathknight: {
    baseline: {
      // Core
      49998: { name: 'Death Strike', kr: '죽음의 일격' },
      49576: { name: 'Death Grip', kr: '죽음의 손아귀' },
      43265: { name: 'Death and Decay', kr: '죽음과 부패' },
      48707: { name: 'Anti-Magic Shell', kr: '대마법 보호막' },
      48792: { name: 'Icebound Fortitude', kr: '얼음같은 인내력' },

      // Blood
      206930: { name: 'Heart Strike', kr: '심장 강타', spec: 'Blood' },
      50842: { name: 'Blood Boil', kr: '피의 소용돌이', spec: 'Blood' },
      55233: { name: 'Vampiric Blood', kr: '흡혈', spec: 'Blood' },
      49028: { name: 'Dancing Rune Weapon', kr: '춤추는 룬 무기', spec: 'Blood' },
      195182: { name: 'Marrowrend', kr: '골수분쇄', spec: 'Blood' },

      // Frost
      49020: { name: 'Obliterate', kr: '절멸', spec: 'Frost' },
      49184: { name: 'Howling Blast', kr: '울부짖는 한파', spec: 'Frost' },
      49143: { name: 'Frost Strike', kr: '냉기의 일격', spec: 'Frost' },
      51271: { name: 'Pillar of Frost', kr: '얼음 기둥', spec: 'Frost' },
      196770: { name: 'Remorseless Winter', kr: '냉혹한 겨울', spec: 'Frost' },

      // Unholy
      85948: { name: 'Festering Strike', kr: '고름 일격', spec: 'Unholy' },
      47541: { name: 'Death Coil', kr: '죽음의 고리', spec: 'Unholy' },
      207317: { name: 'Epidemic', kr: '전염병', spec: 'Unholy' },
      42650: { name: 'Army of the Dead', kr: '사자의 군대', spec: 'Unholy' },
      63560: { name: 'Dark Transformation', kr: '어둠의 변신', spec: 'Unholy' }
    },
    heroTalents: {
      // Deathbringer
      440029: { name: "Reaper's Mark", kr: '사신의 표식', tree: 'Deathbringer' },

      // San'layn
      433891: { name: 'Vampiric Blood', kr: '흡혈귀의 피', tree: "San'layn" },

      // Rider of the Apocalypse
      444008: { name: 'Apocalypse Now', kr: '종말의 때', tree: 'Rider of the Apocalypse' }
    }
  },

  // 주술사 (Shaman)
  shaman: {
    baseline: {
      // Core
      188196: { name: 'Lightning Bolt', kr: '번개 화살' },
      188443: { name: 'Chain Lightning', kr: '연쇄 번개' },
      51505: { name: 'Lava Burst', kr: '용암 폭발' },
      8004: { name: 'Healing Surge', kr: '치유의 급류' },
      1064: { name: 'Chain Heal', kr: '연쇄 치유' },
      2008: { name: 'Ancestral Spirit', kr: '고대의 영혼' },

      // Elemental
      51490: { name: 'Thunderstorm', kr: '천둥폭풍', spec: 'Elemental' },
      114074: { name: 'Lava Beam', kr: '용암 광선', spec: 'Elemental' },
      198067: { name: 'Fire Elemental', kr: '불의 정령', spec: 'Elemental' },
      192249: { name: 'Storm Elemental', kr: '폭풍의 정령', spec: 'Elemental' },

      // Enhancement
      187874: { name: 'Crash Lightning', kr: '벼락 강타', spec: 'Enhancement' },
      60103: { name: 'Lava Lash', kr: '용암 채찍', spec: 'Enhancement' },
      17364: { name: 'Stormstrike', kr: '폭풍의 일격', spec: 'Enhancement' },
      51533: { name: 'Feral Spirit', kr: '야성의 정령', spec: 'Enhancement' },

      // Restoration
      61295: { name: 'Riptide', kr: '성난 해일', spec: 'Restoration' },
      77472: { name: 'Healing Wave', kr: '치유의 물결', spec: 'Restoration' },
      73920: { name: 'Healing Rain', kr: '치유의 비', spec: 'Restoration' },
      98008: { name: 'Spirit Link Totem', kr: '정신 고리 토템', spec: 'Restoration' }
    },
    heroTalents: {
      // Totemic
      455438: { name: 'Surging Totem', kr: '쇄도하는 토템', tree: 'Totemic' },

      // Farseer
      426936: { name: 'Elemental Reverb', kr: '정령 잔향', tree: 'Farseer' },

      // Stormbringer
      454009: { name: 'Tempest', kr: '폭풍우', tree: 'Stormbringer' }
    }
  },

  // 마법사 (Mage)
  mage: {
    baseline: {
      // Core
      116: { name: 'Frostbolt', kr: '얼음 화살' },
      133: { name: 'Fireball', kr: '화염구' },
      5143: { name: 'Arcane Missiles', kr: '신비한 화살' },
      2139: { name: 'Counterspell', kr: '마법 차단' },
      1953: { name: 'Blink', kr: '점멸' },
      45438: { name: 'Ice Block', kr: '얼음 방패' },

      // Arcane
      30451: { name: 'Arcane Blast', kr: '비전 작렬', spec: 'Arcane' },
      44425: { name: 'Arcane Barrage', kr: '비전 탄막', spec: 'Arcane' },
      365350: { name: 'Arcane Surge', kr: '비전 쇄도', spec: 'Arcane' },
      1449: { name: 'Arcane Explosion', kr: '신비한 폭발', spec: 'Arcane' },

      // Fire
      2948: { name: 'Scorch', kr: '불태우기', spec: 'Fire' },
      11366: { name: 'Pyroblast', kr: '불덩이 작렬', spec: 'Fire' },
      190319: { name: 'Combustion', kr: '연소', spec: 'Fire' },
      2120: { name: 'Flamestrike', kr: '불기둥', spec: 'Fire' },

      // Frost
      84714: { name: 'Frozen Orb', kr: '서리 구슬', spec: 'Frost' },
      12472: { name: 'Icy Veins', kr: '얼음 핏줄', spec: 'Frost' },
      120: { name: 'Cone of Cold', kr: '냉기 돌풍', spec: 'Frost' },
      122: { name: 'Frost Nova', kr: '서리 회오리', spec: 'Frost' }
    },
    heroTalents: {
      // Sunfury
      449914: { name: 'Glorious Incandescence', kr: '영광스러운 백열', tree: 'Sunfury' },

      // Frostfire
      431177: { name: 'Frostfire Bolt', kr: '서리화염 화살', tree: 'Frostfire' },

      // Spellslinger
      443739: { name: 'Splinterstorm', kr: '파편 폭풍', tree: 'Spellslinger' }
    }
  },

  // 흑마법사 (Warlock)
  warlock: {
    baseline: {
      // Core
      686: { name: 'Shadow Bolt', kr: '어둠의 화살' },
      172: { name: 'Corruption', kr: '부패' },
      702: { name: 'Curse of Weakness', kr: '무력화 저주' },
      5782: { name: 'Fear', kr: '공포' },
      104773: { name: 'Unending Resolve', kr: '불굴의 결의' },

      // Affliction
      980: { name: 'Agony', kr: '고통', spec: 'Affliction' },
      316099: { name: 'Unstable Affliction', kr: '불안정한 고통', spec: 'Affliction' },
      30108: { name: 'Unstable Affliction', kr: '불안정한 고통', spec: 'Affliction' },
      198590: { name: 'Drain Soul', kr: '영혼 흡수', spec: 'Affliction' },
      205180: { name: 'Summon Darkglare', kr: '암흑시선 소환', spec: 'Affliction' },

      // Demonology
      264178: { name: 'Demonbolt', kr: '악마 화살', spec: 'Demonology' },
      105174: { name: 'Hand of Guldan', kr: '굴단의 손', spec: 'Demonology' },
      264119: { name: 'Summon Vilefiend', kr: '사악한 마귀 소환', spec: 'Demonology' },
      265187: { name: 'Summon Demonic Tyrant', kr: '악마 전제군주 소환', spec: 'Demonology' },

      // Destruction
      116858: { name: 'Chaos Bolt', kr: '혼돈의 화살', spec: 'Destruction' },
      17962: { name: 'Conflagrate', kr: '점화', spec: 'Destruction' },
      348: { name: 'Immolate', kr: '제물', spec: 'Destruction' },
      1122: { name: 'Summon Infernal', kr: '지옥불정령 소환', spec: 'Destruction' }
    },
    heroTalents: {
      // Diabolist
      428344: { name: 'Diabolic Ritual', kr: '악마 의식', tree: 'Diabolist' },

      // Hellcaller
      440045: { name: 'Wither', kr: '시들다', tree: 'Hellcaller' },

      // Soul Harvester
      449612: { name: 'Demonic Soul', kr: '악마의 영혼', tree: 'Soul Harvester' }
    }
  },

  // 수도사 (Monk)
  monk: {
    baseline: {
      // Core
      100780: { name: 'Tiger Palm', kr: '범의 장풍' },
      100784: { name: 'Blackout Kick', kr: '후려차기' },
      322109: { name: 'Touch of Death', kr: '절명의 손길' },
      115203: { name: 'Fortifying Brew', kr: '강화주' },
      109132: { name: 'Roll', kr: '구르기' },

      // Brewmaster
      121253: { name: 'Keg Smash', kr: '통 휘두르기', spec: 'Brewmaster' },
      115181: { name: 'Breath of Fire', kr: '불의 숨결', spec: 'Brewmaster' },
      119582: { name: 'Purifying Brew', kr: '정화주', spec: 'Brewmaster' },
      322507: { name: 'Celestial Brew', kr: '천신주', spec: 'Brewmaster' },

      // Mistweaver
      124682: { name: 'Enveloping Mist', kr: '포용의 안개', spec: 'Mistweaver' },
      115151: { name: 'Renewing Mist', kr: '소생의 안개', spec: 'Mistweaver' },
      116680: { name: 'Thunder Focus Tea', kr: '천둥 집중의 차', spec: 'Mistweaver' },
      115310: { name: 'Revival', kr: '소생', spec: 'Mistweaver' },

      // Windwalker
      113656: { name: 'Fists of Fury', kr: '분노의 주먹', spec: 'Windwalker' },
      101545: { name: 'Flying Serpent Kick', kr: '비룡차기', spec: 'Windwalker' },
      152175: { name: 'Whirling Dragon Punch', kr: '소용돌이 용의 주먹', spec: 'Windwalker' },
      137639: { name: 'Storm, Earth, and Fire', kr: '폭풍과 대지, 불', spec: 'Windwalker' }
    },
    heroTalents: {
      // Conduit of the Celestials
      443028: { name: 'Celestial Conduit', kr: '천신의 도관', tree: 'Conduit of the Celestials' },

      // Master of Harmony
      450508: { name: 'Aspect of Harmony', kr: '조화의 양상', tree: 'Master of Harmony' },

      // Shado-Pan
      451233: { name: 'Flurry Strikes', kr: '질풍 타격', tree: 'Shado-Pan' }
    }
  },

  // 드루이드 (Druid)
  druid: {
    baseline: {
      // Core
      5176: { name: 'Wrath', kr: '천벌' },
      8921: { name: 'Moonfire', kr: '달빛섬광' },
      774: { name: 'Rejuvenation', kr: '회복' },
      5221: { name: 'Shred', kr: '칼퀴 발톱' },
      6807: { name: 'Maul', kr: '후려갈기기' },
      22812: { name: 'Barkskin', kr: '나무 껍질' },

      // Balance
      190984: { name: 'Solar Wrath', kr: '태양의 진노', spec: 'Balance' },
      194153: { name: 'Lunar Strike', kr: '달의 일격', spec: 'Balance' },
      78674: { name: 'Starsurge', kr: '별빛쇄도', spec: 'Balance' },
      191034: { name: 'Starfall', kr: '별똥별', spec: 'Balance' },
      194223: { name: 'Celestial Alignment', kr: '천체의 정렬', spec: 'Balance' },

      // Feral
      1079: { name: 'Rip', kr: '도려내기', spec: 'Feral' },
      1822: { name: 'Rake', kr: '갈퀴 발톱', spec: 'Feral' },
      22568: { name: 'Ferocious Bite', kr: '사나운 이빨', spec: 'Feral' },
      106951: { name: 'Berserk', kr: '광폭화', spec: 'Feral' },

      // Guardian
      33917: { name: 'Mangle', kr: '짓이기기', spec: 'Guardian' },
      77758: { name: 'Thrash', kr: '난타', spec: 'Guardian' },
      192081: { name: 'Ironfur', kr: '무쇠가죽', spec: 'Guardian' },
      22842: { name: 'Frenzied Regeneration', kr: '광란의 재생력', spec: 'Guardian' },

      // Restoration
      18562: { name: 'Swiftmend', kr: '신속한 치유', spec: 'Restoration' },
      48438: { name: 'Wild Growth', kr: '급속 성장', spec: 'Restoration' },
      33891: { name: 'Incarnation: Tree of Life', kr: '화신: 생명의 나무', spec: 'Restoration' },
      740: { name: 'Tranquility', kr: '평온', spec: 'Restoration' }
    },
    heroTalents: {
      // Wildstalker
      439880: { name: 'Thriving Growth', kr: '무성한 성장', tree: 'Wildstalker' },

      // Druid of the Claw
      441598: { name: 'Ravage', kr: '유린', tree: 'Druid of the Claw' },

      // Keeper of the Grove
      428889: { name: 'Dream Surge', kr: '꿈의 쇄도', tree: 'Keeper of the Grove' }
    }
  },

  // 악마사냥꾼 (Demon Hunter)
  demonhunter: {
    baseline: {
      // Core
      162794: { name: 'Chaos Strike', kr: '혼돈의 일격' },
      162243: { name: "Demon's Bite", kr: '악마의 이빨' },
      195072: { name: 'Fel Rush', kr: '지옥 질주' },
      198013: { name: 'Eye Beam', kr: '안광' },
      188501: { name: 'Spectral Sight', kr: '영혼 시야' },

      // Havoc
      185123: { name: 'Throw Glaive', kr: '글레이브 투척', spec: 'Havoc' },
      201427: { name: 'Annihilation', kr: '파멸', spec: 'Havoc' },
      191427: { name: 'Metamorphosis', kr: '탈태', spec: 'Havoc' },
      258920: { name: 'Immolation Aura', kr: '제물의 오라', spec: 'Havoc' },

      // Vengeance
      203782: { name: 'Shear', kr: '칼날 베기', spec: 'Vengeance' },
      228477: { name: 'Soul Cleave', kr: '영혼 베어내기', spec: 'Vengeance' },
      204596: { name: 'Sigil of Flame', kr: '화염의 인장', spec: 'Vengeance' },
      187827: { name: 'Metamorphosis', kr: '탈태', spec: 'Vengeance' }
    },
    heroTalents: {
      // Aldrachi Reaver
      442290: { name: 'Art of the Glaive', kr: '글레이브의 기술', tree: 'Aldrachi Reaver' },

      // Fel-Scarred
      452415: { name: 'Demonsurge', kr: '악마 쇄도', tree: 'Fel-Scarred' }
    }
  },

  // 기원사 (Evoker)
  evoker: {
    baseline: {
      // Core
      361469: { name: 'Living Flame', kr: '살아있는 불꽃' },
      362969: { name: 'Azure Strike', kr: '하늘빛 일격' },
      357210: { name: 'Deep Breath', kr: '깊은 숨결' },
      368432: { name: 'Hover', kr: '부양' },
      365585: { name: 'Expunge', kr: '제거' },

      // Devastation
      356995: { name: 'Disintegrate', kr: '분해', spec: 'Devastation' },
      353759: { name: 'Pyre', kr: '화장', spec: 'Devastation' },
      358385: { name: 'Eternity Surge', kr: '영원의 쇄도', spec: 'Devastation' },
      359073: { name: 'Firestorm', kr: '화염폭풍', spec: 'Devastation' },
      375087: { name: 'Dragonrage', kr: '용의 분노', spec: 'Devastation' },

      // Preservation
      364343: { name: 'Echo', kr: '메아리', spec: 'Preservation' },
      366155: { name: 'Reversion', kr: '역전', spec: 'Preservation' },
      367364: { name: 'Rewind', kr: '되감기', spec: 'Preservation' },
      370960: { name: 'Emerald Blossom', kr: '비취빛 꽃', spec: 'Preservation' },

      // Augmentation
      395152: { name: 'Ebon Might', kr: '흑요석 권능', spec: 'Augmentation' },
      403631: { name: 'Breath of Eons', kr: '영겁의 숨결', spec: 'Augmentation' },
      395160: { name: 'Eruption', kr: '분출', spec: 'Augmentation' }
    },
    heroTalents: {
      // Chronowarden
      431984: { name: 'Chronoflame', kr: '시간의 불꽃', tree: 'Chronowarden' },

      // Flameshaper
      455848: { name: 'Engulf', kr: '휩싸기', tree: 'Flameshaper' },

      // Scalecommander
      442325: { name: 'Mass Eruption', kr: '대규모 분출', tree: 'Scalecommander' }
    }
  }
};

// 파일 시스템 업데이트
function updateAllSkillFiles() {
  const classFiles = [
    { file: 'wowdbWarriorSkillsComplete.js', class: 'warrior', kr: '전사' },
    { file: 'wowdbPaladinSkillsComplete.js', class: 'paladin', kr: '성기사' },
    { file: 'wowdbHunterSkillsComplete.js', class: 'hunter', kr: '사냥꾼' },
    { file: 'wowdbRogueSkillsComplete.js', class: 'rogue', kr: '도적' },
    { file: 'wowdbPriestSkillsComplete.js', class: 'priest', kr: '사제' },
    { file: 'wowdbDeathKnightSkillsComplete.js', class: 'deathknight', kr: '죽음의 기사' },
    { file: 'wowdbShamanSkillsComplete.js', class: 'shaman', kr: '주술사' },
    { file: 'wowdbMageSkillsComplete.js', class: 'mage', kr: '마법사' },
    { file: 'wowdbWarlockSkillsComplete.js', class: 'warlock', kr: '흑마법사' },
    { file: 'wowdbMonkSkillsComplete.js', class: 'monk', kr: '수도사' },
    { file: 'wowdbDruidSkillsComplete.js', class: 'druid', kr: '드루이드' },
    { file: 'wowdbDemonHunterSkillsComplete.js', class: 'demonhunter', kr: '악마사냥꾼' },
    { file: 'wowdbEvokerSkillsComplete.js', class: 'evoker', kr: '기원사' }
  ];

  classFiles.forEach(({ file, class: className, kr }) => {
    const filePath = path.join(__dirname, 'src', 'data', 'skills', file);
    const varName = file.replace('.js', '');
    const classNameCap = varName.replace('wowdb', '').replace('SkillsComplete', '');

    const classData = TWW_SEASON3_SKILLS[className] || { baseline: {}, heroTalents: {} };

    // 스킬 분류
    const baseline = {};
    const specs = {};
    const heroTalents = {};

    // baseline과 spec 분리
    Object.entries(classData.baseline || {}).forEach(([id, skill]) => {
      if (skill.spec) {
        const specKey = skill.spec.toLowerCase().replace(/\s+/g, '');
        if (!specs[specKey]) specs[specKey] = {};
        specs[specKey][id] = {
          name: skill.name,
          kr: skill.kr,
          level: 10,
          type: 'ability'
        };
      } else {
        baseline[id] = {
          name: skill.name,
          kr: skill.kr,
          level: 1,
          type: 'ability'
        };
      }
    });

    // Hero Talents
    Object.entries(classData.heroTalents || {}).forEach(([id, skill]) => {
      heroTalents[id] = {
        name: skill.name,
        kr: skill.kr,
        tree: skill.tree,
        level: 70,
        type: 'heroTalent'
      };
    });

    let content = `// TWW Season 3 ${kr} 스킬 데이터
// The War Within 11.0.5 - 시즌 3
// PvP 특성 제외, 현재 활성화된 스킬만 포함

export const ${varName} = {
  // 기본 스킬
  baseline: ${JSON.stringify(baseline, null, 2)},
`;

    // 전문화별 스킬 추가
    Object.entries(specs).forEach(([specKey, specSkills]) => {
      content += `
  // ${getSpecKoreanName(className, specKey)}
  ${specKey}: ${JSON.stringify(specSkills, null, 2)},
`;
    });

    // Hero Talents 추가
    content += `
  // The War Within Hero Talents
  heroTalents: ${JSON.stringify(heroTalents, null, 2)}
};

// 스킬 검색 함수
export function getWowDB${classNameCap}Skill(skillId) {
  const categories = Object.keys(${varName});

  for (const category of categories) {
    if (${varName}[category] && ${varName}[category][skillId]) {
      return {
        ...${varName}[category][skillId],
        category,
        id: skillId
      };
    }
  }

  return null;
}

// 전체 스킬 개수
export function get${classNameCap}SkillCount() {
  let count = 0;
  const categories = Object.keys(${varName});

  categories.forEach(category => {
    if (${varName}[category]) {
      count += Object.keys(${varName}[category]).length;
    }
  });

  return count;
}

// 전문화별 스킬 필터링
export function get${classNameCap}SkillsBySpec(spec) {
  const specKey = spec?.toLowerCase().replace(/\\s+/g, '');
  if (!${varName}[specKey]) {
    return [];
  }

  return Object.entries(${varName}[specKey]).map(([id, skill]) => ({
    ...skill,
    id: parseInt(id),
    category: specKey
  }));
}
`;

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${kr} (${file}) 업데이트 완료`);
  });
}

// 전문화 한글명
function getSpecKoreanName(className, specKey) {
  const specNames = {
    warrior: {
      arms: '무기 전문화',
      fury: '분노 전문화',
      protection: '방어 전문화'
    },
    paladin: {
      holy: '신성 전문화',
      protection: '보호 전문화',
      retribution: '징벌 전문화'
    },
    hunter: {
      beastmastery: '야수 전문화',
      marksmanship: '사격 전문화',
      survival: '생존 전문화'
    },
    rogue: {
      assassination: '암살 전문화',
      outlaw: '무법 전문화',
      subtlety: '잠행 전문화'
    },
    priest: {
      discipline: '수양 전문화',
      holy: '신성 전문화',
      shadow: '암흑 전문화'
    },
    deathknight: {
      blood: '혈기 전문화',
      frost: '냉기 전문화',
      unholy: '부정 전문화'
    },
    shaman: {
      elemental: '정기 전문화',
      enhancement: '고양 전문화',
      restoration: '복원 전문화'
    },
    mage: {
      arcane: '비전 전문화',
      fire: '화염 전문화',
      frost: '냉기 전문화'
    },
    warlock: {
      affliction: '고통 전문화',
      demonology: '악마 전문화',
      destruction: '파괴 전문화'
    },
    monk: {
      brewmaster: '양조 전문화',
      mistweaver: '운무 전문화',
      windwalker: '풍운 전문화'
    },
    druid: {
      balance: '조화 전문화',
      feral: '야성 전문화',
      guardian: '수호 전문화',
      restoration: '회복 전문화'
    },
    demonhunter: {
      havoc: '파멸 전문화',
      vengeance: '복수 전문화'
    },
    evoker: {
      devastation: '황폐 전문화',
      preservation: '보존 전문화',
      augmentation: '증강 전문화'
    }
  };

  return specNames[className]?.[specKey] || specKey;
}

// 실행
updateAllSkillFiles();
console.log('\n✅ TWW Season 3 스킬 데이터베이스 업데이트 완료!');
console.log('📊 PvP 특성 제거, 삭제된 스킬 제거, 현재 활성화된 스킬만 포함');