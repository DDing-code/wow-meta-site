// WoW 11.0.5 야수 사냥꾼 최종 특성 데이터
// Spell ID 기반 한국어/영어 완전 매칭
// 직업: 43개, 전문화: 38개
// 무리의 지도자: 10개, 어둠 순찰자: 5개
// 총 96개 특성

export const beastMasteryFinalData = {
  "classTalents": {
    "layout": {
      "rows": 15,
      "columns": 3,
      "totalPoints": 31
    },
    "nodes": {
      "1513": {
        "id": 1513,
        "koreanName": "야수 겁주기",
        "englishName": "Scare Beast",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 7,
          "col": 3
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "5116": {
        "id": 5116,
        "koreanName": "충격포",
        "englishName": "Concussive Shot",
        "icon": "inv_misc_questionmark",
        "description": "충격포\n특성\n40 야드 사정거리\n즉시\t5 초 재사용 대기시간\n사냥꾼 필요\n대상을 멍하게 해 6초 동안 이동 속도를 50%만큼 감소시킵니다.\n\n[코브라 사격 / 고정 사격]이 대상에게 부여된 충격포의 지속시간을 3.0초만큼 증가시킵니다.\n\t\n\t",
        "position": {
          "row": 4,
          "col": 1
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "19577": {
        "id": 19577,
        "koreanName": "위협",
        "englishName": "Intimidation",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 8,
          "col": 1
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "19801": {
        "id": 19801,
        "koreanName": "평정의 사격",
        "englishName": "Tranquilizing Shot",
        "icon": "inv_misc_questionmark",
        "description": "평정의 사격\n특성\n40 야드 사정거리\n즉시\t10 초 재사용 대기시간\n사냥꾼 필요\n적에게서 1개의 격노 효과와 1개의 마법 효과를 제거합니다. [방해탄: 효과를 무효화하는 데 성공하면 10의 집중을 생성합니다]\n\t\n\t",
        "position": {
          "row": 3,
          "col": 3
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "34477": {
        "id": 34477,
        "koreanName": "눈속임",
        "englishName": "Misdirection",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 5,
          "col": 2
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "53351": {
        "id": 53351,
        "koreanName": "마무리 사격",
        "englishName": "Kill Shot",
        "icon": "inv_misc_questionmark",
        "description": "마무리 사격\n특성\n집중 10\t40 야드 사정거리\n즉시\t10 초 재사용 대기시간\n1회 사용 가능\n사냥꾼 필요\n원거리 무기 필요\n부상당한 상대를 처치하기 위해 일격을 날려 (전투력의 320%)의 물리 피해를 입힙니다. 생명력이 20% 미만인 적에게만 사용할 수 있습니다.\n이 특성은 전문화 기본 특성입니다. 습득을 취소할 수 없습니다.\n\t\n\t",
        "position": {
          "row": 1,
          "col": 3
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "53480": {
        "id": 53480,
        "koreanName": "희생의 포효",
        "englishName": "Roar of Sacrifice",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 12,
          "col": 3
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "109215": {
        "id": 109215,
        "koreanName": "급가속",
        "englishName": "Posthaste",
        "icon": "inv_misc_questionmark",
        "description": "로딩 중…",
        "position": {
          "row": 1,
          "col": 2
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "109248": {
        "id": 109248,
        "koreanName": "구속의 사격",
        "englishName": "Binding Shot",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 8,
          "col": 2
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "147362": {
        "id": 147362,
        "koreanName": "반격의 사격",
        "englishName": "Counter Shot",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 5,
          "col": 1
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "187698": {
        "id": 187698,
        "koreanName": "타르 덫",
        "englishName": "Tar Trap",
        "icon": "inv_misc_questionmark",
        "description": "타르 덫특성40 야드 사정거리즉시30 초 재사용 대기시간사냥꾼 필요목표 위치로 타르 덫을 발사합니다. 적이 다가오면 반경 8미터의 타르 웅덩이가 30초 동안 생성되어 해당 지역 안에 있는 모든 적의 이동 속도를 50%만큼 감소시킵니다. 동시에 1명의 대상에게만 사용할 수 있습니다. 덫은 1분 동안 지속됩니다.",
        "position": {
          "row": 3,
          "col": 2
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "199483": {
        "id": 199483,
        "koreanName": "위장술",
        "englishName": "Camouflage",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 11,
          "col": 3
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "199921": {
        "id": 199921,
        "koreanName": "개척자",
        "englishName": "Trailblazer",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 12,
          "col": 2
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "264735": {
        "id": 264735,
        "koreanName": "적자생존",
        "englishName": "Survival of the Fittest",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 4,
          "col": 2
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "266921": {
        "id": 266921,
        "koreanName": "타고난 야성",
        "englishName": "Born To Be Wild",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 13,
          "col": 3
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "270581": {
        "id": 270581,
        "koreanName": "자연 치유",
        "englishName": "Natural Mending",
        "icon": "inv_misc_questionmark",
        "description": "자연 치유특성사냥꾼 필요요구 레벨 3010의 집중을 소모할 때마다 활기의 남은 재사용 대기시간이 1.0초만큼 감소합니다.",
        "position": {
          "row": 1,
          "col": 1
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "321468": {
        "id": 321468,
        "koreanName": "억제의 족쇄",
        "englishName": "Binding Shackles",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 11,
          "col": 2
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "343242": {
        "id": 343242,
        "koreanName": "야생의 약",
        "englishName": "Wilderness Medicine",
        "icon": "inv_misc_questionmark",
        "description": "야생의 약\n특성\n사냥꾼 필요\n자연 치유가 활기의 재사용 대기시간을 추가로 0.5초만큼 감소시킵니다\n\n야수 치료가 지속시간에 걸쳐 야수의 생명력을 추가로 25%만큼 치유합니다. 또한 야수를 치유할 때마다 25%의 확률로 마법 효과 하나를 무효화합니다.\n\t\n\t",
        "position": {
          "row": 3,
          "col": 1
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "343244": {
        "id": 343244,
        "koreanName": "방해탄",
        "englishName": "Disruptive Rounds",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 7,
          "col": 1
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "343247": {
        "id": 343247,
        "koreanName": "덫 연마",
        "englishName": "Improved Traps",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 14,
          "col": 2
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "343248": {
        "id": 343248,
        "koreanName": "죽음의 강타",
        "englishName": "Deathblow",
        "icon": "inv_misc_questionmark",
        "description": "죽음의 강타\n특성\n사냥꾼 필요\n살상 명령 사용 시 20%의 확률로 죽음의 강타가 부여됩니다.\n\n 죽음의 강타\n마무리 사격의 재사용 대기시간이 초기화됩니다. 다음 마무리 사격|1은;는; 대상의 현재 생명력에 상관없이 모든 대상에게 사용 가능\n\t\n\t",
        "position": {
          "row": 2,
          "col": 3
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "378002": {
        "id": 378002,
        "koreanName": "길잡이",
        "englishName": "Pathfinding",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 11,
          "col": 1
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "378004": {
        "id": 378004,
        "koreanName": "예리한 시각",
        "englishName": "Keen Eyesight",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 9,
          "col": 3
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "378771": {
        "id": 378771,
        "koreanName": "신속 장전",
        "englishName": "Quick Load",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 10,
          "col": 3
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "384799": {
        "id": 384799,
        "koreanName": "사냥꾼의 회피",
        "englishName": "Hunter's Avoidance",
        "icon": "inv_misc_questionmark",
        "description": "사냥꾼의 회피특성사냥꾼 필요광역 공격으로 받는 피해 5%만큼 감소합니다.",
        "position": {
          "row": 2,
          "col": 2
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "385539": {
        "id": 385539,
        "koreanName": "원기 회복의 바람",
        "englishName": "Rejuvenating Wind",
        "icon": "inv_misc_questionmark",
        "description": "원기 회복의 바람\n특성\n사냥꾼 필요\n최대 생명력이 8%만큼 증가합니다. 또한 활기 시전 시 8초에 걸쳐 최대 생명력의 12.0%만큼 추가로 회복합니다.\n\t\n\t",
        "position": {
          "row": 2,
          "col": 1
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "388039": {
        "id": 388039,
        "koreanName": "고독한 생존자",
        "englishName": "Lone Survivor",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 6,
          "col": 2
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "393344": {
        "id": 393344,
        "koreanName": "올가미",
        "englishName": "Entrapment",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 4,
          "col": 3
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "459450": {
        "id": 459450,
        "koreanName": "솜댄 갑옷",
        "englishName": "Padded Armor",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 6,
          "col": 1
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "459455": {
        "id": 459455,
        "koreanName": "정찰병의 본능",
        "englishName": "Scout's Instincts",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 5,
          "col": 3
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "459460": {
        "id": 459460,
        "koreanName": "타르로 뒤덮인 구속구",
        "englishName": "Tar-Coated Bindings",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 10,
          "col": 1
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "459466": {
        "id": 459466,
        "koreanName": "환경 위장복",
        "englishName": "Ghillie Suit",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 14,
          "col": 1
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "459488": {
        "id": 459488,
        "koreanName": "기회의 찰나",
        "englishName": "Moment of Opportunity",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 13,
          "col": 2
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "459502": {
        "id": 459502,
        "koreanName": "톱니날 촉",
        "englishName": "Serrated Tips",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 13,
          "col": 1
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "459506": {
        "id": 459506,
        "koreanName": "발화의 섬광",
        "englishName": "Kindling Flare",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 12,
          "col": 1
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "459507": {
        "id": 459507,
        "koreanName": "영역 본능",
        "englishName": "Territorial Instincts",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 8,
          "col": 3
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "459517": {
        "id": 459517,
        "koreanName": "비상 연고",
        "englishName": "Emergency Salve",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 14,
          "col": 3
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "459527": {
        "id": 459527,
        "koreanName": "비정상적인 원인",
        "englishName": "Unnatural Causes",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 15,
          "col": 1
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "459533": {
        "id": 459533,
        "koreanName": "고철이",
        "englishName": "Scrappy",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 10,
          "col": 2
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "459534": {
        "id": 459534,
        "koreanName": "사격 애호가",
        "englishName": "Trigger Finger",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 9,
          "col": 1
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "459542": {
        "id": 459542,
        "koreanName": "특제 무기고",
        "englishName": "Specialized Arsenal",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 6,
          "col": 3
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "459546": {
        "id": 459546,
        "koreanName": "악감정은 없다",
        "englishName": "No Hard Feelings",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 7,
          "col": 2
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      },
      "462036": {
        "id": 462036,
        "koreanName": "검은바위 탄약",
        "englishName": "Blackrock Munitions",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 9,
          "col": 2
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "class"
      }
    }
  },
  "specTalents": {
    "layout": {
      "rows": 13,
      "columns": 3,
      "totalPoints": 30
    },
    "nodes": {
      "2643": {
        "id": 2643,
        "koreanName": "일제 사격",
        "englishName": "Multi-Shot",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 3,
          "col": 3
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "19574": {
        "id": 19574,
        "koreanName": "야수의 격노",
        "englishName": "Bestial Wrath",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 8,
          "col": 2
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "34026": {
        "id": 34026,
        "koreanName": "살상 명령",
        "englishName": "Kill Command",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 1,
          "col": 1
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "115939": {
        "id": 115939,
        "koreanName": "야수의 회전베기",
        "englishName": "Beast Cleave",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 4,
          "col": 3
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "120679": {
        "id": 120679,
        "koreanName": "광포한 야수",
        "englishName": "Dire Beast",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 7,
          "col": 1
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "185789": {
        "id": 185789,
        "koreanName": "야성의 부름",
        "englishName": "Wild Call",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 6,
          "col": 3
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "191384": {
        "id": 191384,
        "koreanName": "야수의 상",
        "englishName": "Aspect of the Beast",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 2,
          "col": 2
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "193455": {
        "id": 193455,
        "koreanName": "코브라 사격",
        "englishName": "Cobra Shot",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 1,
          "col": 2
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "193532": {
        "id": 193532,
        "koreanName": "피의 향기",
        "englishName": "Scent of Blood",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 12,
          "col": 1
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "199530": {
        "id": 199530,
        "koreanName": "발구르기",
        "englishName": "Stomp",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 5,
          "col": 3
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "199532": {
        "id": 199532,
        "koreanName": "살상 코브라",
        "englishName": "Killer Cobra",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 11,
          "col": 3
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "217200": {
        "id": 217200,
        "koreanName": "날카로운 사격",
        "englishName": "Barbed Shot",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 1,
          "col": 3
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "231548": {
        "id": 231548,
        "koreanName": "날카로운 격노",
        "englishName": "Barbed Wrath",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 10,
          "col": 2
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "257944": {
        "id": 257944,
        "koreanName": "사냥의 전율",
        "englishName": "Thrill of the Hunt",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 3,
          "col": 1
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "269737": {
        "id": 269737,
        "koreanName": "우두머리 포식자",
        "englishName": "Alpha Predator",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 4,
          "col": 2
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "273887": {
        "id": 273887,
        "koreanName": "살수의 본능",
        "englishName": "Killer Instinct",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 9,
          "col": 3
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "321014": {
        "id": 321014,
        "koreanName": "무리 전술",
        "englishName": "Pack Tactics",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 2,
          "col": 1
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "321530": {
        "id": 321530,
        "koreanName": "유혈",
        "englishName": "Bloodshed",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 7,
          "col": 3
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "359844": {
        "id": 359844,
        "koreanName": "야생의 부름",
        "englishName": "Call of the Wild",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 11,
          "col": 2
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "378207": {
        "id": 378207,
        "koreanName": "살상의 회전베기",
        "englishName": "Kill Cleave",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 6,
          "col": 2
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "378209": {
        "id": 378209,
        "koreanName": "조련 전문가",
        "englishName": "Training Expert",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 5,
          "col": 1
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "378210": {
        "id": 378210,
        "koreanName": "사냥꾼의 먹잇감",
        "englishName": "Hunter's Prey",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 5,
          "col": 2
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "378743": {
        "id": 378743,
        "koreanName": "광포한 명령",
        "englishName": "Dire Command",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 9,
          "col": 1
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "385810": {
        "id": 385810,
        "koreanName": "광포한 격노",
        "englishName": "Dire Frenzy",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 11,
          "col": 1
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "386870": {
        "id": 386870,
        "koreanName": "잔혹한 동료",
        "englishName": "Brutal Companion",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 12,
          "col": 2
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "392053": {
        "id": 392053,
        "koreanName": "꿰뚫는 송곳니",
        "englishName": "Piercing Fangs",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 13,
          "col": 1
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "393933": {
        "id": 393933,
        "koreanName": "전쟁 명령",
        "englishName": "War Orders",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 2,
          "col": 3
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "424557": {
        "id": 424557,
        "koreanName": "포악성",
        "englishName": "Savagery",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 7,
          "col": 2
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "424558": {
        "id": 424558,
        "koreanName": "조련술의 거장",
        "englishName": "Master Handler",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 6,
          "col": 1
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "459550": {
        "id": 459550,
        "koreanName": "숨통 노리기",
        "englishName": "Go for the Throat",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 3,
          "col": 2
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "459552": {
        "id": 459552,
        "koreanName": "열상",
        "englishName": "Laceration",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 4,
          "col": 1
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "459693": {
        "id": 459693,
        "koreanName": "우레의 발굽",
        "englishName": "Thundering Hooves",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 10,
          "col": 3
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "459730": {
        "id": 459730,
        "koreanName": "사냥지배자의 부름",
        "englishName": "Huntmaster's Call",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 12,
          "col": 3
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "468701": {
        "id": 468701,
        "koreanName": "뱀의 박자",
        "englishName": "Serpentine Rhythm",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 10,
          "col": 1
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "469880": {
        "id": 469880,
        "koreanName": "날카로운 비늘",
        "englishName": "Barbed Scales",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 8,
          "col": 1
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "1217524": {
        "id": 1217524,
        "koreanName": "광포한 회전베기",
        "englishName": "Dire Cleave",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 9,
          "col": 2
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "1217535": {
        "id": 1217535,
        "koreanName": "독가시",
        "englishName": "Poisoned Barbs",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 8,
          "col": 3
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      },
      "1232739": {
        "id": 1232739,
        "koreanName": "자연의 교감자",
        "englishName": "Wildspeaker",
        "icon": "inv_misc_questionmark",
        "description": "",
        "position": {
          "row": 13,
          "col": 2
        },
        "maxRanks": 1,
        "currentRank": 0,
        "tree": "spec"
      }
    }
  },
  "heroTalents": {
    "packLeader": {
      "layout": {
        "rows": 5,
        "columns": 3,
        "totalPoints": 10
      },
      "nodes": {
        "450360": {
          "id": 450360,
          "koreanName": "엄호 사격",
          "englishName": "Covering Fire",
          "icon": "ability_hunter_packleader",
          "description": "엄호 사격 - 무리의 지도자 영웅 특성",
          "position": {
            "row": 3,
            "col": 3
          },
          "tree": "hero-packleader"
        },
        "450361": {
          "id": 450361,
          "koreanName": "무리의 맹위",
          "englishName": "Furious Assault",
          "icon": "ability_hunter_packleader",
          "description": "무리의 맹위 - 무리의 지도자 영웅 특성",
          "position": {
            "row": 4,
            "col": 1
          },
          "tree": "hero-packleader"
        },
        "450362": {
          "id": 450362,
          "koreanName": "짐승의 축복",
          "englishName": "Blessing of the Pack",
          "icon": "ability_hunter_packleader",
          "description": "짐승의 축복 - 무리의 지도자 영웅 특성",
          "position": {
            "row": 4,
            "col": 3
          },
          "tree": "hero-packleader"
        },
        "450363": {
          "id": 450363,
          "koreanName": "무리의 분노",
          "englishName": "Pack's Wrath",
          "icon": "ability_hunter_packleader",
          "description": "무리의 분노 - 무리의 지도자 영웅 특성",
          "position": {
            "row": 5,
            "col": 2
          },
          "tree": "hero-packleader"
        },
        "450958": {
          "id": 450958,
          "koreanName": "포악한 습격",
          "englishName": "Vicious Hunt",
          "icon": "ability_hunter_packleader",
          "description": "포악한 습격 - 무리의 지도자 영웅 특성",
          "position": {
            "row": 1,
            "col": 2
          },
          "tree": "hero-packleader"
        },
        "450962": {
          "id": 450962,
          "koreanName": "광기의 무리",
          "englishName": "Frenzied Pack",
          "icon": "ability_hunter_packleader",
          "description": "광기의 무리 - 무리의 지도자 영웅 특성",
          "position": {
            "row": 2,
            "col": 3
          },
          "tree": "hero-packleader"
        },
        "450963": {
          "id": 450963,
          "koreanName": "굴 회복력",
          "englishName": "Den Recovery",
          "icon": "ability_hunter_packleader",
          "description": "굴 회복력 - 무리의 지도자 영웅 특성",
          "position": {
            "row": 2,
            "col": 2
          },
          "tree": "hero-packleader"
        },
        "450964": {
          "id": 450964,
          "koreanName": "무리 조직",
          "englishName": "Pack Coordination",
          "icon": "ability_hunter_packleader",
          "description": "무리 조직 - 무리의 지도자 영웅 특성",
          "position": {
            "row": 2,
            "col": 1
          },
          "tree": "hero-packleader"
        },
        "451160": {
          "id": 451160,
          "koreanName": "사냥의 부름",
          "englishName": "Howl of the Pack",
          "icon": "ability_hunter_packleader",
          "description": "사냥의 부름 - 무리의 지도자 영웅 특성",
          "position": {
            "row": 3,
            "col": 1
          },
          "tree": "hero-packleader"
        },
        "451161": {
          "id": 451161,
          "koreanName": "무리 우두머리",
          "englishName": "Pack Leader",
          "icon": "ability_hunter_packleader",
          "description": "무리 우두머리 - 무리의 지도자 영웅 특성",
          "position": {
            "row": 3,
            "col": 2
          },
          "tree": "hero-packleader"
        }
      }
    },
    "darkRanger": {
      "layout": {
        "rows": 5,
        "columns": 3,
        "totalPoints": 10
      },
      "nodes": {
        "450381": {
          "id": 450381,
          "koreanName": "어둠의 사격",
          "englishName": "Shadow Shot",
          "icon": "ability_theblackarrow",
          "description": "어둠의 사격 - 어둠 순찰자 영웅 특성",
          "position": {
            "row": 1,
            "col": 2
          },
          "tree": "hero-darkranger"
        },
        "450382": {
          "id": 450382,
          "koreanName": "검은 화살",
          "englishName": "Black Arrow",
          "icon": "ability_theblackarrow",
          "description": "검은 화살 - 어둠 순찰자 영웅 특성",
          "position": {
            "row": 2,
            "col": 2
          },
          "tree": "hero-darkranger"
        },
        "450383": {
          "id": 450383,
          "koreanName": "연막",
          "englishName": "Smoke Screen",
          "icon": "ability_theblackarrow",
          "description": "연막 - 어둠 순찰자 영웅 특성",
          "position": {
            "row": 3,
            "col": 1
          },
          "tree": "hero-darkranger"
        },
        "450384": {
          "id": 450384,
          "koreanName": "쇠약의 화살",
          "englishName": "Withering Fire",
          "icon": "ability_theblackarrow",
          "description": "쇠약의 화살 - 어둠 순찰자 영웅 특성",
          "position": {
            "row": 3,
            "col": 3
          },
          "tree": "hero-darkranger"
        },
        "450385": {
          "id": 450385,
          "koreanName": "어둠의 사냥꾼",
          "englishName": "Shadow Hunter",
          "icon": "ability_theblackarrow",
          "description": "어둠의 사냥꾼 - 어둠 순찰자 영웅 특성",
          "position": {
            "row": 4,
            "col": 2
          },
          "tree": "hero-darkranger"
        }
      }
    }
  },
  "connections": []
};
