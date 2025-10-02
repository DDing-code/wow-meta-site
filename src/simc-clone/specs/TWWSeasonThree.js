/**
 * The War Within Season 3 Updates
 * 내부전쟁 시즌 3 업데이트
 */

export class TWWSeasonThree {
    constructor() {
        this.heroTalents = this.initializeHeroTalents();
        this.seasonalSets = this.initializeSeasonalSets();
        this.newAbilities = this.initializeNewAbilities();
    }

    /**
     * 영웅 특성 초기화
     */
    initializeHeroTalents() {
        return {
            // 전사 영웅 특성
            warrior: {
                mountain_thane: {
                    name: '산의 대족장',
                    description: '천둥 능력 강화',
                    abilities: {
                        thunder_blast: {
                            name: '천둥 작렬',
                            damage: 85000,
                            cooldown: 30,
                            effect: '전방 원뿔 천둥 공격'
                        },
                        storm_shield: {
                            name: '폭풍의 보호막',
                            absorb: 150000,
                            duration: 10,
                            effect: '번개 반격 효과'
                        }
                    }
                },
                colossus: {
                    name: '거신',
                    description: '거대화 및 강력한 타격',
                    abilities: {
                        colossal_might: {
                            name: '거신의 힘',
                            damageBonus: 0.25,
                            sizeIncrease: 0.3,
                            duration: 20
                        },
                        demolish: {
                            name: '파괴',
                            damage: 120000,
                            cooldown: 45,
                            effect: '광역 분쇄'
                        }
                    }
                }
            },

            // 성기사 영웅 특성
            paladin: {
                herald_of_the_sun: {
                    name: '태양의 전령',
                    description: '신성 및 화염 능력',
                    abilities: {
                        solar_grace: {
                            name: '태양의 은총',
                            healing: 100000,
                            damage: 50000,
                            radius: 20,
                            effect: '치유와 피해 동시'
                        },
                        sun_king: {
                            name: '태양왕',
                            duration: 15,
                            effect: '모든 능력이 화염 피해 추가'
                        }
                    }
                },
                lightsmith: {
                    name: '빛대장장이',
                    description: '성스러운 무기 제작',
                    abilities: {
                        holy_armaments: {
                            name: '신성한 무장',
                            weapons: ['blessing_of_summer', 'blessing_of_autumn'],
                            duration: 60,
                            effect: '아군에게 성스러운 무기 부여'
                        },
                        sacred_weapon: {
                            name: '신성한 무기',
                            damageBonus: 0.15,
                            effect: '무기에 신성 부여'
                        }
                    }
                }
            },

            // 사냥꾼 영웅 특성
            hunter: {
                pack_leader: {
                    name: '무리 우두머리',
                    description: '야수와의 시너지 강화',
                    abilities: {
                        pack_coordination: {
                            name: '무리 협동',
                            petDamageBonus: 0.3,
                            effect: '모든 소환수 강화'
                        },
                        alpha_call: {
                            name: '우두머리의 부름',
                            summons: 3,
                            duration: 20,
                            effect: '추가 야수 소환'
                        }
                    }
                },
                dark_ranger: {
                    name: '어둠 순찰자',
                    description: '암흑 및 언데드 능력',
                    abilities: {
                        black_arrow: {
                            name: '검은 화살',
                            damage: 60000,
                            dot: 30000,
                            duration: 18,
                            effect: '언데드 소환 가능'
                        },
                        withering_fire: {
                            name: '시들음의 사격',
                            shots: 6,
                            damage: 25000,
                            effect: '즉시 다중 사격'
                        }
                    }
                }
            },

            // 도적 영웅 특성
            rogue: {
                trickster: {
                    name: '사기꾼',
                    description: '환영과 속임수',
                    abilities: {
                        unseen_blade: {
                            name: '보이지 않는 칼날',
                            illusions: 2,
                            duration: 8,
                            effect: '환영 생성하여 같이 공격'
                        },
                        coup_de_grace: {
                            name: '최후의 일격',
                            damage: 150000,
                            condition: 'target_below_35%',
                            effect: '처형 기술'
                        }
                    }
                },
                fatebound: {
                    name: '운명속박',
                    description: '운명의 동전 활용',
                    abilities: {
                        fate_coin: {
                            name: '운명의 동전',
                            stacks: 7,
                            effect: '행운과 불운 토글'
                        },
                        destiny_strike: {
                            name: '운명의 일격',
                            damage: 'variable',
                            effect: '동전 상태에 따른 효과'
                        }
                    }
                }
            },

            // 사제 영웅 특성
            priest: {
                archon: {
                    name: '대천사',
                    description: '빛과 어둠의 조화',
                    abilities: {
                        halo_of_power: {
                            name: '권능의 후광',
                            damage: 70000,
                            healing: 70000,
                            radius: 30,
                            effect: '확장 파동'
                        },
                        empyreal_blaze: {
                            name: '천상의 불꽃',
                            duration: 20,
                            effect: '주문 시전 시 폭발'
                        }
                    }
                },
                oracle: {
                    name: '예언자',
                    description: '미래 예측과 예방',
                    abilities: {
                        premonition: {
                            name: '예감',
                            preventDamage: 0.5,
                            duration: 3,
                            effect: '미래 피해 예측 및 감소'
                        },
                        clairvoyance: {
                            name: '천리안',
                            range: 'unlimited',
                            effect: '다음 3개 능력 예측'
                        }
                    }
                }
            },

            // 죽음의 기사 영웅 특성
            death_knight: {
                deathbringer: {
                    name: '죽음인도자',
                    description: '죽음의 군대 강화',
                    abilities: {
                        reapers_mark: {
                            name: '사신의 표식',
                            shadowDamageBonus: 0.35,
                            spreadOnKill: true,
                            effect: '처치 시 전파'
                        },
                        exterminate: {
                            name: '근절',
                            damage: 100000,
                            execute: true,
                            threshold: 0.35,
                            effect: '즉시 처형'
                        }
                    }
                },
                san_layn: {
                    name: '산레인',
                    description: '흡혈 능력 강화',
                    abilities: {
                        vampiric_blood: {
                            name: '흡혈의 피',
                            lifesteal: 0.5,
                            duration: 10,
                            effect: '모든 피해 흡혈'
                        },
                        gift_of_san_layn: {
                            name: '산레인의 선물',
                            essence_generation: 2,
                            effect: '정수 생성 배수'
                        }
                    }
                }
            },

            // 주술사 영웅 특성
            shaman: {
                totemic: {
                    name: '토템숭배',
                    description: '강력한 토템 소환',
                    abilities: {
                        surging_totem: {
                            name: '솟구치는 토템',
                            pulses: 'continuous',
                            damage: 30000,
                            healing: 30000,
                            radius: 40
                        },
                        totemic_projection: {
                            name: '토템 투사',
                            range: 'unlimited',
                            effect: '즉시 토템 재배치'
                        }
                    }
                },
                farseer: {
                    name: '선견자',
                    description: '정령과 조화',
                    abilities: {
                        elemental_blast: {
                            name: '원소 작렬',
                            damage: 90000,
                            stats: 'all_secondary',
                            duration: 10,
                            effect: '모든 보조 스탯 증가'
                        },
                        spiritwalkers_aegis: {
                            name: '영혼방랑자의 보호',
                            absorb: 200000,
                            effect: '이동 중 시전 가능'
                        }
                    }
                }
            },

            // 마법사 영웅 특성
            mage: {
                sunfury: {
                    name: '태양격노',
                    description: '불꽃 주문 극대화',
                    abilities: {
                        phoenix_flames: {
                            name: '불사조 화염',
                            charges: 3,
                            damage: 60000,
                            ignite: true,
                            effect: '점화 즉시 확산'
                        },
                        combustion_nova: {
                            name: '연소 신성',
                            damage: 120000,
                            radius: 20,
                            effect: '폭발적 연소'
                        }
                    }
                },
                spellslinger: {
                    name: '주문투사',
                    description: '주문 연계 전문가',
                    abilities: {
                        splinterstorm: {
                            name: '파편폭풍',
                            projectiles: 9,
                            damage: 20000,
                            effect: '추적 파편'
                        },
                        shifting_shards: {
                            name: '변화하는 파편',
                            school: 'adaptive',
                            effect: '속성 자동 변경'
                        }
                    }
                }
            },

            // 흑마법사 영웅 특성
            warlock: {
                diabolist: {
                    name: '악마숭배자',
                    description: '강력한 악마 소환',
                    abilities: {
                        diabolic_ritual: {
                            name: '악마 의식',
                            summon: 'pit_lord',
                            duration: 40,
                            effect: '구덩이 군주 소환'
                        },
                        demonic_calling: {
                            name: '악마의 부름',
                            portal: true,
                            demons_per_second: 2,
                            effect: '지속 악마 소환'
                        }
                    }
                },
                hellcaller: {
                    name: '지옥소환사',
                    description: '지옥불 전문가',
                    abilities: {
                        wither: {
                            name: '시들음',
                            damage: 40000,
                            slow: 0.7,
                            duration: 15,
                            effect: '적 약화'
                        },
                        malevolence: {
                            name: '악의',
                            shadowflame_damage: 0.5,
                            duration: 20,
                            effect: '암흑불길 강화'
                        }
                    }
                }
            },

            // 수도사 영웅 특성
            monk: {
                shado_pan: {
                    name: '음영파',
                    description: '그림자 기술 전문가',
                    abilities: {
                        flurry_strikes: {
                            name: '질풍 연타',
                            attacks: 6,
                            damage: 25000,
                            effect: '순간 다단히트'
                        },
                        wisdom_of_the_wall: {
                            name: '성벽의 지혜',
                            crit_bonus: 0.3,
                            mastery_bonus: 0.3,
                            effect: '치명타와 특화 증가'
                        }
                    }
                },
                master_of_harmony: {
                    name: '조화의 달인',
                    description: '천상의 조화',
                    abilities: {
                        celestial_conduit: {
                            name: '천상의 도관',
                            damage: 50000,
                            healing: 50000,
                            effect: '피해와 치유 연결'
                        },
                        unity_within: {
                            name: '내면의 합일',
                            stats_share: 0.2,
                            effect: '파티원과 스탯 공유'
                        }
                    }
                }
            },

            // 드루이드 영웅 특성
            druid: {
                keeper_of_the_grove: {
                    name: '숲의 수호자',
                    description: '자연의 힘 극대화',
                    abilities: {
                        force_of_nature: {
                            name: '자연의 힘',
                            treants: 3,
                            duration: 20,
                            effect: '정령 소환'
                        },
                        cenarius_guidance: {
                            name: '세나리우스의 인도',
                            formBonus: 0.15,
                            effect: '모든 형태 강화'
                        }
                    }
                },
                wildstalker: {
                    name: '야생추적자',
                    description: '야수 형태 전문화',
                    abilities: {
                        ravage: {
                            name: '휩쓸기',
                            damage: 100000,
                            bleed: 50000,
                            duration: 12,
                            effect: '강력한 출혈'
                        },
                        pack_leader: {
                            name: '무리 지도자',
                            allies_bonus: 0.1,
                            effect: '주변 아군 강화'
                        }
                    }
                }
            },

            // 악마사냥꾼 영웅 특성
            demon_hunter: {
                fel_scarred: {
                    name: '지옥상처',
                    description: '지옥 마력 극대화',
                    abilities: {
                        demonsurge: {
                            name: '악마쇄도',
                            metamorphosis_extend: 8,
                            damage_bonus: 0.4,
                            effect: '변신 연장 및 강화'
                        },
                        fel_desolation: {
                            name: '지옥 황폐',
                            damage: 80000,
                            radius: 20,
                            felfire: true,
                            effect: '지옥불 확산'
                        }
                    }
                },
                aldrachi_reaver: {
                    name: '알드라치 약탈자',
                    description: '영혼 수확 전문가',
                    abilities: {
                        reaver_glaive: {
                            name: '약탈자의 투척 검',
                            damage: 70000,
                            souls: 2,
                            effect: '영혼 생성'
                        },
                        art_of_the_glaive: {
                            name: '투척 검의 기예',
                            ricochet: 3,
                            damage_increase: 0.2,
                            effect: '연쇄 공격'
                        }
                    }
                }
            },

            // 기원사 영웅 특성
            evoker: {
                scalecommander: {
                    name: '비늘사령관',
                    description: '용족 군대 지휘',
                    abilities: {
                        bombardments: {
                            name: '폭격',
                            breath_extend: 2,
                            damage: 60000,
                            effect: '브레스 중 폭격'
                        },
                        mass_disintegrate: {
                            name: '대량 분해',
                            targets: 5,
                            damage: 100000,
                            effect: '다중 대상 분해'
                        }
                    }
                },
                chronowarden: {
                    name: '시간의 수호자',
                    description: '시간 조작 전문가',
                    abilities: {
                        temporal_burst: {
                            name: '시간 폭발',
                            rewind: 3,
                            effect: '3초 전 위치로 되돌리기'
                        },
                        time_skip: {
                            name: '시간 도약',
                            cooldown_reduction: 10,
                            effect: '모든 쿨다운 감소'
                        }
                    }
                }
            }
        };
    }

    /**
     * 시즌 세트 아이템 초기화
     */
    initializeSeasonalSets() {
        return {
            // 전사 세트
            warrior: {
                name: '불타는 격노의 전쟁용사',
                twoSet: {
                    effect: '분노의 강타가 다음 피의 갈증 피해 20% 증가',
                    stacks: 10
                },
                fourSet: {
                    effect: '피의 갈증이 격노 상태를 2초 연장',
                    procChance: 0.3
                }
            },

            // 성기사 세트
            paladin: {
                name: '광휘의 수호자',
                twoSet: {
                    effect: '심판이 신성한 힘 2중첩 생성',
                    duration: 15
                },
                fourSet: {
                    effect: '신성한 힘 소모 시 15% 확률로 복수의 격노 발동',
                    cooldownReduction: 20
                }
            },

            // 사냥꾼 세트
            hunter: {
                name: '야수왕의 유산',
                twoSet: {
                    effect: '야수의 격노가 모든 소환수에게 적용',
                    damageBonus: 0.15
                },
                fourSet: {
                    effect: '살상 명령이 추가 야수 소환',
                    duration: 8
                }
            },

            // 도적 세트
            rogue: {
                name: '그림자 암살자',
                twoSet: {
                    effect: '절개가 그림자 춤 지속시간 1초 증가',
                    maxStacks: 5
                },
                fourSet: {
                    effect: '그림자 춤 중 모든 기술 치명타율 20% 증가',
                    energyRegenBonus: 0.3
                }
            },

            // 사제 세트
            priest: {
                name: '빛과 어둠의 조화',
                twoSet: {
                    effect: '정신 분열 시전 시 어둠의 권능: 죽음 즉시 시전',
                    procChance: 0.25
                },
                fourSet: {
                    effect: '공허 폭발이 추가 촉수 2개 소환',
                    duration: 10
                }
            },

            // 죽음의 기사 세트
            death_knight: {
                name: '얼어붙은 복수자',
                twoSet: {
                    effect: '룬 무기 강화가 모든 룬 재생',
                    cooldownReduction: 15
                },
                fourSet: {
                    effect: '냉기의 기둥이 15% 확률로 즉시 재사용',
                    damageBonus: 0.25
                }
            },

            // 주술사 세트
            shaman: {
                name: '원소의 화신',
                twoSet: {
                    effect: '용암 채찍이 원소 폭발 확률 100%',
                    maelstromGeneration: 10
                },
                fourSet: {
                    effect: '원소 폭발이 모든 원소 정령 소환',
                    duration: 6
                }
            },

            // 마법사 세트
            mage: {
                name: '비전 천재',
                twoSet: {
                    effect: '비전 쇄도가 비전 충전물 소모하지 않음',
                    procChance: 0.2
                },
                fourSet: {
                    effect: '비전 힘 발동 시 모든 주문 즉시 시전',
                    duration: 5
                }
            },

            // 흑마법사 세트
            warlock: {
                name: '혼돈의 지배자',
                twoSet: {
                    effect: '혼돈의 화살이 영혼 조각 2개 생성',
                    critBonus: 0.5
                },
                fourSet: {
                    effect: '악마 폭군이 모든 악마 피해 50% 증가',
                    duration: 15
                }
            },

            // 수도사 세트
            monk: {
                name: '천상의 수도승',
                twoSet: {
                    effect: '흑우 차기가 다음 회전 학다리 차기 무료',
                    chiGeneration: 2
                },
                fourSet: {
                    effect: '폭풍과 대지와 불이 모든 기술 재사용 대기시간 초기화',
                    procChance: 0.1
                }
            },

            // 드루이드 세트
            druid: {
                name: '야생의 화신',
                twoSet: {
                    effect: '별빛 섬광이 월식과 일식 동시 발동',
                    astralPowerGeneration: 20
                },
                fourSet: {
                    effect: '화신 변신 중 모든 주문 시전시간 50% 감소',
                    duration: 20
                }
            },

            // 악마사냥꾼 세트
            demon_hunter: {
                name: '일리다리 정예병',
                twoSet: {
                    effect: '악마의 이빨이 변신 지속시간 2초 증가',
                    furyGeneration: 20
                },
                fourSet: {
                    effect: '변신 중 혼돈의 일격이 추가 공격',
                    bounces: 3
                }
            },

            // 기원사 세트
            evoker: {
                name: '용군단 지휘관',
                twoSet: {
                    effect: '심판의 불길이 정수 2개 생성',
                    cooldownReduction: 5
                },
                fourSet: {
                    effect: '용의 격노 중 모든 브레스 즉시 시전',
                    damageBonus: 0.3
                }
            }
        };
    }

    /**
     * 새로운 능력 초기화
     */
    initializeNewAbilities() {
        return {
            // 새로운 PvP 특성
            pvpTalents: {
                precognition: {
                    name: '예지',
                    effect: '군중 제어 면역 예측',
                    duration: 4,
                    cooldown: 45
                },
                soulburn_port: {
                    name: '영혼불태우기: 차원문',
                    effect: '즉시 차원문 생성',
                    cooldown: 90
                }
            },

            // 신규 종족 능력
            racialAbilities: {
                earthen: {
                    name: '대지인',
                    abilities: {
                        stoneform_enhanced: {
                            name: '강화된 석화',
                            damageReduction: 0.3,
                            duration: 8,
                            cooldown: 120
                        },
                        elemental_resistance: {
                            name: '원소 저항',
                            resistAll: 0.1,
                            passive: true
                        }
                    }
                }
            },

            // 쿨다운 감소 시스템
            cooldownReductionSystem: {
                name: '냉각 조화',
                effect: '특정 능력 사용 시 다른 능력 쿨다운 감소',
                interactions: {
                    warrior: {
                        rampage: { reduces: 'bladestorm', amount: 2 }
                    },
                    mage: {
                        frost_bolt: { reduces: 'frozen_orb', amount: 0.5 }
                    }
                }
            },

            // 새로운 자원 시스템
            newResourceMechanics: {
                combo_points_extended: {
                    maxPoints: 7, // 기존 5에서 7로 증가 (특정 특성)
                    animacharged: true
                },
                essence_overflow: {
                    maxEssence: 6,
                    overflowEffect: '초과 정수가 추가 효과'
                }
            }
        };
    }

    /**
     * 클래스별 변경사항 적용
     */
    applyClassChanges(classSpec) {
        const heroTalent = this.heroTalents[classSpec.class]?.[classSpec.heroSpec];
        const tierSet = this.seasonalSets[classSpec.class];

        // 영웅 특성 적용
        if (heroTalent) {
            classSpec.heroTalent = heroTalent;

            // 능력 추가
            for (const [abilityId, ability] of Object.entries(heroTalent.abilities)) {
                classSpec.abilities[abilityId] = ability;
            }
        }

        // 티어 세트 적용
        if (tierSet && classSpec.tierSetPieces) {
            if (classSpec.tierSetPieces >= 2) {
                classSpec.setBonus.twoSet = tierSet.twoSet;
            }
            if (classSpec.tierSetPieces >= 4) {
                classSpec.setBonus.fourSet = tierSet.fourSet;
            }
        }

        return classSpec;
    }

    /**
     * PvP 수정사항
     */
    applyPvPModifiers(ability, isPvP) {
        if (!isPvP) return ability;

        // PvP에서 피해 및 치유 감소
        const pvpModifiers = {
            damage: 0.7, // 30% 감소
            healing: 0.6, // 40% 감소
            duration: 0.75 // 25% 감소
        };

        if (ability.damage) {
            ability.damage *= pvpModifiers.damage;
        }
        if (ability.healing) {
            ability.healing *= pvpModifiers.healing;
        }
        if (ability.duration) {
            ability.duration *= pvpModifiers.duration;
        }

        return ability;
    }

    /**
     * 신화+ 던전 접사 효과
     */
    getMythicPlusAffixes(level) {
        const affixes = [];

        if (level >= 2) {
            affixes.push({
                name: '강화',
                effect: '적 체력 및 피해 20% 증가'
            });
        }

        if (level >= 5) {
            affixes.push({
                name: '고통',
                effect: '90% 이상 체력에서 주기적 피해'
            });
        }

        if (level >= 10) {
            affixes.push({
                name: '합체',
                effect: '적 사망 시 구슬 생성'
            });
        }

        return affixes;
    }

    /**
     * 시즌 밸런스 패치 적용
     */
    applySeasonalBalance() {
        return {
            // 전체적인 밸런스 조정
            globalModifiers: {
                tankMitigation: 1.1, // 탱커 피해 감소 10% 증가
                healerMana: 1.15, // 힐러 마나 재생 15% 증가
                dpsAoECap: 8 // AoE 대상 수 제한
            },

            // 클래스별 조정
            classModifiers: {
                warrior: {
                    execute: { damageBonus: 0.15 }, // 15% 증가
                    ignore_pain: { absorbBonus: 0.2 } // 20% 증가
                },
                mage: {
                    pyroblast: { damageNerf: -0.1 }, // 10% 감소
                    frost_bolt: { castTimeReduction: 0.1 } // 10% 감소
                },
                priest: {
                    shadow_word_death: { executeThreshold: 0.35 }, // 35%로 증가
                    power_word_life: { healingBonus: 0.25 } // 25% 증가
                }
            }
        };
    }
}

export default TWWSeasonThree;