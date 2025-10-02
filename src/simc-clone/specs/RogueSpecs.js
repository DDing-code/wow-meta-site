// RogueSpecs.js - Phase 4: Rogue 전문화 (Assassination, Outlaw, Subtlety)
// 도적 전문화: 암살, 무법자, 잠행
// 총 1,800줄 목표

import { Specialization } from '../core/Specialization.js';
import { Talent, TalentTree } from '../core/TalentTree.js';
import { Ability } from '../core/Ability.js';
import { Buff, Debuff } from '../core/Buff.js';
import { RESOURCE_TYPE, SPELL_SCHOOL, BUFF_TYPE } from '../core/Constants.js';

// ===========================
// 암살 도적 (Assassination Rogue)
// ===========================
class AssassinationRogue extends Specialization {
    constructor(player) {
        super(player, '암살');

        // 암살 특화 스탯
        this.stats = {
            ...this.stats,
            poisonDamage: 1.25,        // 독 데미지 증가
            bleedDamage: 1.20,         // 출혈 데미지 증가
            energyRegenBonus: 0.15,     // 에너지 재생 보너스
            masterAssassin: 0.30        // 마스터 암살자 효과
        };

        // 독 시스템
        this.poisonSystem = {
            deadly: {
                stacks: 0,
                maxStacks: 10,
                damagePerStack: 850,
                procChance: 0.30
            },
            wound: {
                active: false,
                damageReduction: 0.08,
                procChance: 0.30
            },
            crippling: {
                active: false,
                slowAmount: 0.50,
                procChance: 0.30
            }
        };

        // 출혈 추적
        this.bleedTracker = {
            rupture: {
                active: false,
                duration: 0,
                comboPointsUsed: 0,
                damage: 0
            },
            garrote: {
                active: false,
                duration: 0,
                isSilencing: false,
                damage: 0
            },
            crimsonTempest: {
                active: false,
                duration: 0,
                targets: []
            }
        };

        // 암살 메커니즘
        this.assassinationMechanics = {
            vendetta: {
                active: false,
                target: null,
                damageBonus: 0.30,
                duration: 0
            },
            elaborate: {
                planning: false,
                energyReturn: 50,
                comboPointBonus: 2
            },
            shadowstep: {
                charges: 2,
                maxCharges: 2,
                teleportRange: 25,
                damageBonus: 0.10
            }
        };

        this.initializeAbilities();
        this.initializeTalents();
        this.initializeRotation();
    }

    initializeAbilities() {
        // 기본 공격
        this.abilities.set('mutilate', new Ability({
            name: '훼손',
            cost: 50,
            costType: RESOURCE_TYPE.ENERGY,
            damage: 8500,
            cooldown: 0,
            generatesComboPoints: 2,
            applyPoison: true,
            execute: (target) => {
                const damage = this.calculateDamage(8500);
                this.player.dealDamage(target, damage, SPELL_SCHOOL.PHYSICAL);
                this.generateComboPoints(2);
                this.applyPoisons(target);

                // 디스패치 가능 시 추가 콤보
                if (target.health / target.maxHealth < 0.35) {
                    this.generateComboPoints(1);
                }
            }
        }));

        this.abilities.set('envenom', new Ability({
            name: '독살',
            cost: 35,
            costType: RESOURCE_TYPE.ENERGY,
            damagePerComboPoint: 4500,
            requiresComboPoints: true,
            execute: (target) => {
                const comboPoints = this.player.resources.current[RESOURCE_TYPE.COMBO_POINTS];
                const damage = this.calculateDamage(4500 * comboPoints * this.stats.poisonDamage);

                this.player.dealDamage(target, damage, SPELL_SCHOOL.NATURE);
                this.consumeComboPoints();

                // 독살 버프 적용
                this.applyBuff('envenom_buff', {
                    duration: 1 + comboPoints,
                    critBonus: 0.30
                });

                // 독 스택 소모로 추가 데미지
                if (this.poisonSystem.deadly.stacks > 0) {
                    const poisonDamage = this.poisonSystem.deadly.stacks * 1000;
                    this.player.dealDamage(target, poisonDamage, SPELL_SCHOOL.NATURE);
                }
            }
        }));

        this.abilities.set('rupture', new Ability({
            name: '파열',
            cost: 25,
            costType: RESOURCE_TYPE.ENERGY,
            requiresComboPoints: true,
            execute: (target) => {
                const comboPoints = this.player.resources.current[RESOURCE_TYPE.COMBO_POINTS];
                const duration = 4 + (comboPoints * 4);
                const tickDamage = this.calculateDamage(3200 * comboPoints * this.stats.bleedDamage);

                this.applyDebuff(target, 'rupture', {
                    duration: duration,
                    tickInterval: 2,
                    tickDamage: tickDamage,
                    type: BUFF_TYPE.BLEED
                });

                this.bleedTracker.rupture = {
                    active: true,
                    duration: duration,
                    comboPointsUsed: comboPoints,
                    damage: tickDamage
                };

                this.consumeComboPoints();
            }
        }));

        this.abilities.set('garrote', new Ability({
            name: '목조르기',
            cost: 45,
            costType: RESOURCE_TYPE.ENERGY,
            damage: 6800,
            cooldown: 0,
            silence: true,
            execute: (target) => {
                const damage = this.calculateDamage(6800);
                this.player.dealDamage(target, damage, SPELL_SCHOOL.PHYSICAL);

                // 침묵 효과 (은신 중 사용 시)
                const silenceDuration = this.player.isStealthed ? 3 : 0;

                this.applyDebuff(target, 'garrote', {
                    duration: 18,
                    tickInterval: 2,
                    tickDamage: this.calculateDamage(2400 * this.stats.bleedDamage),
                    silence: silenceDuration > 0,
                    silenceDuration: silenceDuration,
                    type: BUFF_TYPE.BLEED
                });

                this.bleedTracker.garrote = {
                    active: true,
                    duration: 18,
                    isSilencing: silenceDuration > 0,
                    damage: 2400 * this.stats.bleedDamage
                };

                this.generateComboPoints(1);
            }
        }));

        // 독 폭탄
        this.abilities.set('poisoned_knife', new Ability({
            name: '독칼 투척',
            cost: 40,
            costType: RESOURCE_TYPE.ENERGY,
            damage: 4500,
            range: 30,
            execute: (target) => {
                const damage = this.calculateDamage(4500 * this.stats.poisonDamage);
                this.player.dealDamage(target, damage, SPELL_SCHOOL.NATURE);
                this.generateComboPoints(1);
                this.applyPoisons(target);
            }
        }));

        // 벤데타 (궁극기)
        this.abilities.set('vendetta', new Ability({
            name: '벤데타',
            cost: 0,
            cooldown: 120,
            duration: 20,
            execute: (target) => {
                this.assassinationMechanics.vendetta = {
                    active: true,
                    target: target,
                    damageBonus: 0.30,
                    duration: 20
                };

                this.applyBuff('vendetta', {
                    duration: 20,
                    damageIncrease: 0.30,
                    energyRegenBonus: 15
                });

                // 대상에게 표식
                this.applyDebuff(target, 'vendetta_mark', {
                    duration: 20,
                    damageIncrease: 0.30
                });

                this.player.emit('vendetta_activated', { target });
            }
        }));

        // 은신
        this.abilities.set('vanish', new Ability({
            name: '소멸',
            cost: 0,
            cooldown: 120,
            instant: true,
            execute: () => {
                this.player.enterStealth();
                this.clearThreat();

                this.applyBuff('vanish', {
                    duration: 3,
                    stealthLevel: 2,  // 강화된 은신
                    damageBonus: 0.50
                });

                // 마스터 암살자 활성화
                if (this.hasTalent('master_assassin')) {
                    this.applyBuff('master_assassin', {
                        duration: 3,
                        critBonus: 1.00  // 100% 치명타
                    });
                }
            }
        }));

        // 그림자 걸음
        this.abilities.set('shadowstep', new Ability({
            name: '그림자 걸음',
            cost: 0,
            cooldown: 20,
            charges: 2,
            execute: (target) => {
                this.teleportToTarget(target);

                this.applyBuff('shadowstep', {
                    duration: 2,
                    damageBonus: 0.10
                });

                this.assassinationMechanics.shadowstep.charges--;

                // 뒤에서 공격 시 추가 효과
                if (this.isBehindTarget(target)) {
                    this.generateComboPoints(2);
                }
            }
        }));
    }

    initializeTalents() {
        // 15 레벨
        this.talents.addTalent('master_poisoner', {
            row: 15,
            effects: {
                poisonDamage: 1.30,
                poisonProcChance: 1.30
            }
        });

        this.talents.addTalent('elaborate_planning', {
            row: 15,
            effects: {
                finisherDamage: 1.10,
                energyReturn: 10
            }
        });

        this.talents.addTalent('blindside', {
            row: 15,
            effects: {
                mutilateCrit: 0.30,
                executeDamage: 1.25
            }
        });

        // 25 레벨
        this.talents.addTalent('nightstalker', {
            row: 25,
            effects: {
                stealthDamage: 1.50,
                stealthSpeed: 1.20
            }
        });

        this.talents.addTalent('subterfuge', {
            row: 25,
            effects: {
                stealthDuration: 3,
                stealthAbilities: true
            }
        });

        // 30 레벨
        this.talents.addTalent('master_assassin', {
            row: 30,
            effects: {
                critAfterStealth: 1.00,
                critDuration: 3
            }
        });

        this.talents.addTalent('vigor', {
            row: 30,
            effects: {
                maxEnergy: 50,
                energyRegen: 1.10
            }
        });

        // 35 레벨
        this.talents.addTalent('leeching_poison', {
            row: 35,
            effects: {
                lifeSteal: 0.10,
                poisonHeal: true
            }
        });

        this.talents.addTalent('cheat_death', {
            row: 35,
            effects: {
                deathPrevention: true,
                healOnSave: 0.70
            }
        });

        // 40 레벨
        this.talents.addTalent('internal_bleeding', {
            row: 40,
            effects: {
                kidneyBleed: true,
                bleedDamage: 1.20
            }
        });

        this.talents.addTalent('iron_wire', {
            row: 40,
            effects: {
                garroteDamage: 1.15,
                garroteSilence: 6
            }
        });

        // 45 레벨
        this.talents.addTalent('venom_rush', {
            row: 45,
            effects: {
                energyOnPoison: 8,
                energyRegenOnBleeds: 1.05
            }
        });

        this.talents.addTalent('toxic_blade', {
            row: 45,
            cooldown: 25,
            effects: {
                poisonDamageDebuff: 1.30,
                duration: 9
            }
        });

        // 50 레벨
        this.talents.addTalent('poison_bomb', {
            row: 50,
            effects: {
                procChance: 0.04,
                areaDamage: 12000,
                radius: 10
            }
        });

        this.talents.addTalent('crimson_tempest', {
            row: 50,
            effects: {
                aoeBleed: true,
                damagePerCombo: 2500,
                duration: 8
            }
        });

        this.talents.addTalent('hidden_blades', {
            row: 50,
            effects: {
                fanProcChance: 0.20,
                fanDamage: 4000
            }
        });
    }

    initializeRotation() {
        this.rotationPriority = [
            // 벤데타 사용
            {
                ability: 'vendetta',
                condition: (target) => !this.assassinationMechanics.vendetta.active &&
                                      target.health > 1000000  // 보스급
            },

            // 소멸 (버스트)
            {
                ability: 'vanish',
                condition: () => this.hasHighComboPoints() &&
                                this.isGoodBurstWindow()
            },

            // 파열 유지
            {
                ability: 'rupture',
                condition: (target) => this.hasComboPoints(4) &&
                                       (!target.hasDebuff('rupture') ||
                                        target.debuffDuration('rupture') < 7.2)
            },

            // 목조르기 유지
            {
                ability: 'garrote',
                condition: (target) => !target.hasDebuff('garrote') ||
                                       target.debuffDuration('garrote') < 5.4
            },

            // 독살 (5콤보)
            {
                ability: 'envenom',
                condition: () => this.hasComboPoints(5) &&
                                this.needsEnvenomBuff()
            },

            // 훼손 (콤보 생성)
            {
                ability: 'mutilate',
                condition: () => this.player.resources.current[RESOURCE_TYPE.COMBO_POINTS] < 4
            },

            // 독살 (4콤보, 에너지 덤핑)
            {
                ability: 'envenom',
                condition: () => this.hasComboPoints(4) &&
                                this.player.resources.current[RESOURCE_TYPE.ENERGY] > 80
            }
        ];
    }

    applyPoisons(target) {
        // 치명적인 독
        if (Math.random() < this.poisonSystem.deadly.procChance) {
            const currentStacks = target.getDebuffStacks('deadly_poison') || 0;
            const newStacks = Math.min(currentStacks + 1, this.poisonSystem.deadly.maxStacks);

            this.applyDebuff(target, 'deadly_poison', {
                duration: 12,
                stacks: newStacks,
                tickInterval: 3,
                tickDamage: this.calculateDamage(850 * newStacks * this.stats.poisonDamage),
                type: BUFF_TYPE.POISON
            });

            this.poisonSystem.deadly.stacks = newStacks;
        }

        // 상처 독
        if (Math.random() < this.poisonSystem.wound.procChance) {
            this.applyDebuff(target, 'wound_poison', {
                duration: 12,
                healingReduction: 0.08,
                stackable: true,
                maxStacks: 3,
                type: BUFF_TYPE.POISON
            });
        }
    }

    needsEnvenomBuff() {
        return !this.player.hasBuff('envenom_buff') ||
               this.player.buffDuration('envenom_buff') < 1;
    }

    hasHighComboPoints() {
        return this.player.resources.current[RESOURCE_TYPE.COMBO_POINTS] >= 5;
    }

    isGoodBurstWindow() {
        // 버스트 타이밍 판단
        return this.assassinationMechanics.vendetta.active ||
               this.player.hasBloodlust();
    }
}

// ===========================
// 무법자 도적 (Outlaw Rogue)
// ===========================
class OutlawRogue extends Specialization {
    constructor(player) {
        super(player, '무법자');

        // 무법자 특화 스탯
        this.stats = {
            ...this.stats,
            mainGauche: 0.35,           // 왼손 공격 확률
            combatPotency: 0.75,        // 전투 잠재력
            ruthlessness: 0.20,         // 무자비 (콤보 포인트 확률)
            restlessBlades: 2.0         // 불안한 칼날 (쿨다운 감소)
        };

        // 주사위 굴리기 시스템
        this.rollTheBonesSystem = {
            buffs: {
                broadside: false,       // 넓은 면: 콤보 포인트 생성 증가
                buriedTreasure: false,  // 묻힌 보물: 에너지 재생 증가
                grandMelee: false,      // 대 난투: 공격 속도 & 리치 증가
                ruthlessPrecision: false, // 무자비한 정밀함: 치명타 증가
                skullAndCrossbones: false, // 해골과 뼈다귀: 콤보 포인트 공격 속도
                trueBearing: false     // 진정한 방위: 쿨다운 감소
            },
            duration: 0,
            rollCount: 0
        };

        // 무법자 메커니즘
        this.outlawMechanics = {
            bladeFlurry: {
                active: false,
                cleaveTargets: 4,
                cleaveDamage: 0.50,
                duration: 0
            },
            adrenalineRush: {
                active: false,
                attackSpeed: 1.60,
                energyRegen: 2.0,
                duration: 0
            },
            betweenTheEyes: {
                critBonus: 0.20,
                stunDuration: 0
            },
            opportunity: {
                procChance: 0.35,
                active: false
            }
        };

        // 권총 시스템
        this.pistolSystem = {
            concealment: false,
            quickDraw: false,
            deadShot: 0
        };

        this.initializeAbilities();
        this.initializeTalents();
        this.initializeRotation();
    }

    initializeAbilities() {
        // 사악한 일격
        this.abilities.set('sinister_strike', new Ability({
            name: '사악한 일격',
            cost: 45,
            costType: RESOURCE_TYPE.ENERGY,
            damage: 7800,
            cooldown: 0,
            generatesComboPoints: 1,
            execute: (target) => {
                let damage = this.calculateDamage(7800);

                // 기회 프로세스
                if (this.outlawMechanics.opportunity.active) {
                    damage *= 1.40;
                    this.outlawMechanics.opportunity.active = false;
                }

                this.player.dealDamage(target, damage, SPELL_SCHOOL.PHYSICAL);

                // 콤보 포인트 생성
                let comboPoints = 1;
                if (this.rollTheBonesSystem.buffs.broadside) {
                    comboPoints = Math.random() < 0.35 ? 2 : 1;
                }
                this.generateComboPoints(comboPoints);

                // 왼손 공격
                if (Math.random() < this.stats.mainGauche) {
                    this.triggerMainGauche(target);
                }

                // 기회 프로세스 체크
                if (Math.random() < this.outlawMechanics.opportunity.procChance) {
                    this.outlawMechanics.opportunity.active = true;
                }
            }
        }));

        // 급전
        this.abilities.set('dispatch', new Ability({
            name: '급전',
            cost: 35,
            costType: RESOURCE_TYPE.ENERGY,
            damagePerComboPoint: 5200,
            requiresComboPoints: true,
            execute: (target) => {
                const comboPoints = this.player.resources.current[RESOURCE_TYPE.COMBO_POINTS];
                let damage = this.calculateDamage(5200 * comboPoints);

                // 처형 범위 보너스
                if (target.health / target.maxHealth < 0.35) {
                    damage *= 1.50;
                }

                this.player.dealDamage(target, damage, SPELL_SCHOOL.PHYSICAL);
                this.consumeComboPoints();

                // 불안한 칼날 쿨다운 감소
                this.reduceAllCooldowns(this.stats.restlessBlades * comboPoints);

                // 무자비 (콤보 포인트 반환 확률)
                if (Math.random() < this.stats.ruthlessness) {
                    this.generateComboPoints(1);
                }
            }
        }));

        // 주사위 굴리기
        this.abilities.set('roll_the_bones', new Ability({
            name: '뼈다귀 굴리기',
            cost: 25,
            costType: RESOURCE_TYPE.ENERGY,
            requiresComboPoints: true,
            execute: () => {
                const comboPoints = this.player.resources.current[RESOURCE_TYPE.COMBO_POINTS];
                const duration = 30 + (comboPoints * 6);

                // 주사위 굴리기
                this.rollDice(duration);
                this.consumeComboPoints();

                // 불안한 칼날
                this.reduceAllCooldowns(this.stats.restlessBlades * comboPoints);
            }
        }));

        // 칼날 질풍
        this.abilities.set('blade_flurry', new Ability({
            name: '칼날 질풍',
            cost: 15,
            costType: RESOURCE_TYPE.ENERGY,
            cooldown: 30,
            toggleable: true,
            execute: () => {
                this.outlawMechanics.bladeFlurry.active = !this.outlawMechanics.bladeFlurry.active;

                if (this.outlawMechanics.bladeFlurry.active) {
                    this.applyBuff('blade_flurry', {
                        duration: -1,  // 토글
                        cleaveTargets: 4,
                        cleaveDamage: 0.50
                    });
                } else {
                    this.removeBuff('blade_flurry');
                }
            }
        }));

        // 미간 사격
        this.abilities.set('between_the_eyes', new Ability({
            name: '미간 사격',
            cost: 25,
            costType: RESOURCE_TYPE.ENERGY,
            damagePerComboPoint: 6500,
            requiresComboPoints: true,
            cooldown: 30,
            execute: (target) => {
                const comboPoints = this.player.resources.current[RESOURCE_TYPE.COMBO_POINTS];
                const damage = this.calculateDamage(6500 * comboPoints);

                this.player.dealDamage(target, damage, SPELL_SCHOOL.PHYSICAL);

                // 기절 효과
                const stunDuration = comboPoints;
                this.applyDebuff(target, 'between_the_eyes_stun', {
                    duration: stunDuration,
                    stun: true
                });

                // 치명타 보너스
                this.applyBuff('deadened_nerves', {
                    duration: 6,
                    critBonus: 0.20 * comboPoints
                });

                this.consumeComboPoints();
                this.reduceAllCooldowns(this.stats.restlessBlades * comboPoints);
            }
        }));

        // 아드레날린 촉진
        this.abilities.set('adrenaline_rush', new Ability({
            name: '아드레날린 촉진',
            cost: 0,
            cooldown: 180,
            duration: 20,
            execute: () => {
                this.outlawMechanics.adrenalineRush = {
                    active: true,
                    attackSpeed: 1.60,
                    energyRegen: 2.0,
                    duration: 20
                };

                this.applyBuff('adrenaline_rush', {
                    duration: 20,
                    attackSpeed: 1.60,
                    energyRegen: 2.0,
                    maxEnergy: 50
                });

                // 즉시 에너지 회복
                this.player.generateResource(RESOURCE_TYPE.ENERGY, 60);
            }
        }));

        // 권총 사격
        this.abilities.set('pistol_shot', new Ability({
            name: '권총 사격',
            cost: 40,
            costType: RESOURCE_TYPE.ENERGY,
            damage: 5500,
            range: 20,
            generatesComboPoints: 1,
            execute: (target) => {
                let damage = this.calculateDamage(5500);

                // 기회 프로세스로 무료 & 강화
                if (this.outlawMechanics.opportunity.active) {
                    this.player.generateResource(RESOURCE_TYPE.ENERGY, 40);  // 비용 환불
                    damage *= 1.50;
                    this.outlawMechanics.opportunity.active = false;
                }

                this.player.dealDamage(target, damage, SPELL_SCHOOL.PHYSICAL);
                this.generateComboPoints(1);

                // 왼손 공격 트리거
                if (Math.random() < this.stats.mainGauche) {
                    this.triggerMainGauche(target);
                }
            }
        }));

        // 고스트리 스트라이크
        this.abilities.set('ghostly_strike', new Ability({
            name: '유령의 일격',
            cost: 30,
            costType: RESOURCE_TYPE.ENERGY,
            damage: 8200,
            cooldown: 35,
            execute: (target) => {
                const damage = this.calculateDamage(8200);
                this.player.dealDamage(target, damage, SPELL_SCHOOL.PHYSICAL);

                this.applyDebuff(target, 'ghostly_strike', {
                    duration: 10,
                    damageIncrease: 0.10,
                    missChance: 0.15
                });

                this.generateComboPoints(1);
            }
        }));
    }

    initializeTalents() {
        // 15 레벨
        this.talents.addTalent('weaponmaster', {
            row: 15,
            effects: {
                sinisterStrikeProcChance: 0.15,
                comboPointChance: 0.35
            }
        });

        this.talents.addTalent('quick_draw', {
            row: 15,
            effects: {
                opportunityFreeCost: true,
                opportunityDamage: 1.50
            }
        });

        this.talents.addTalent('ghostly_strike', {
            row: 15,
            cooldown: 35,
            effects: {
                damage: 8200,
                debuffDuration: 10
            }
        });

        // 25 레벨
        this.talents.addTalent('acrobatic_strikes', {
            row: 25,
            effects: {
                meleeRange: 3,
                autoAttackRange: 3
            }
        });

        this.talents.addTalent('retractable_hook', {
            row: 25,
            effects: {
                grapplingHookCharges: 2,
                cooldownReduction: 15
            }
        });

        // 30 레벨
        this.talents.addTalent('vigor', {
            row: 30,
            effects: {
                maxEnergy: 50,
                energyRegen: 1.10
            }
        });

        this.talents.addTalent('deeper_stratagem', {
            row: 30,
            effects: {
                maxComboPoints: 1,
                finisherDamage: 1.05
            }
        });

        // 35 레벨
        this.talents.addTalent('iron_stomach', {
            row: 35,
            effects: {
                healingPotionBonus: 1.30,
                crimsonVialHealIncrease: 1.30
            }
        });

        this.talents.addTalent('cheat_death', {
            row: 35,
            effects: {
                deathPrevention: true,
                healOnSave: 0.70
            }
        });

        // 40 레벨
        this.talents.addTalent('dirty_tricks', {
            row: 40,
            effects: {
                cheapShotCostReduction: 40,
                blindCostReduction: 30
            }
        });

        this.talents.addTalent('blinding_powder', {
            row: 40,
            effects: {
                blindRadius: 5,
                blindTargets: 5
            }
        });

        // 45 레벨
        this.talents.addTalent('loaded_dice', {
            row: 45,
            effects: {
                rollMinimumBuffs: 2,
                rollDuration: 1.10
            }
        });

        this.talents.addTalent('alacrity', {
            row: 45,
            effects: {
                hastePerStack: 0.02,
                maxStacks: 20
            }
        });

        // 50 레벨
        this.talents.addTalent('dancing_steel', {
            row: 50,
            effects: {
                bladeFlurryStrikes: 3,
                bladeFlurryDamage: 1.15
            }
        });

        this.talents.addTalent('blade_rush', {
            row: 50,
            cooldown: 45,
            effects: {
                damage: 12000,
                dashDistance: 10,
                comboPoints: 1
            }
        });

        this.talents.addTalent('killing_spree', {
            row: 50,
            cooldown: 120,
            effects: {
                strikes: 6,
                damagePerStrike: 8000,
                teleport: true
            }
        });
    }

    initializeRotation() {
        this.rotationPriority = [
            // 아드레날린 촉진 (버스트)
            {
                ability: 'adrenaline_rush',
                condition: () => !this.outlawMechanics.adrenalineRush.active &&
                                this.isBurstPhase()
            },

            // 칼날 질풍 (AoE)
            {
                ability: 'blade_flurry',
                condition: () => this.player.sim.getEnemiesInRange(8).length >= 2 &&
                                !this.outlawMechanics.bladeFlurry.active
            },

            // 주사위 굴리기 유지
            {
                ability: 'roll_the_bones',
                condition: () => this.hasComboPoints(2) &&
                                (!this.hasActiveRollBuffs() ||
                                 this.rollTheBonesSystem.duration < 3)
            },

            // 미간 사격 (쿨다운)
            {
                ability: 'between_the_eyes',
                condition: (target) => this.hasComboPoints(5) &&
                                       this.abilities.get('between_the_eyes').isReady()
            },

            // 급전 (5+ 콤보)
            {
                ability: 'dispatch',
                condition: (target) => this.hasComboPoints(5) ||
                                       (this.hasComboPoints(4) &&
                                        target.health / target.maxHealth < 0.35)
            },

            // 기회 권총 사격
            {
                ability: 'pistol_shot',
                condition: () => this.outlawMechanics.opportunity.active
            },

            // 사악한 일격 (콤보 생성)
            {
                ability: 'sinister_strike',
                condition: () => this.player.resources.current[RESOURCE_TYPE.COMBO_POINTS] < 5
            }
        ];
    }

    rollDice(duration) {
        // 주사위 버프 초기화
        this.rollTheBonesSystem.buffs = {
            broadside: false,
            buriedTreasure: false,
            grandMelee: false,
            ruthlessPrecision: false,
            skullAndCrossbones: false,
            trueBearing: false
        };

        // 주사위 굴리기 (1-6개 버프)
        const buffs = Object.keys(this.rollTheBonesSystem.buffs);
        const rollCount = this.hasTalent('loaded_dice') ?
                         Math.max(2, Math.floor(Math.random() * 6) + 1) :
                         Math.floor(Math.random() * 6) + 1;

        for (let i = 0; i < rollCount; i++) {
            const randomBuff = buffs[Math.floor(Math.random() * buffs.length)];
            this.rollTheBonesSystem.buffs[randomBuff] = true;
        }

        this.rollTheBonesSystem.duration = duration;
        this.rollTheBonesSystem.rollCount = rollCount;

        // 버프 효과 적용
        this.applyRollBuffs(duration);
    }

    applyRollBuffs(duration) {
        if (this.rollTheBonesSystem.buffs.broadside) {
            this.applyBuff('broadside', {
                duration: duration,
                comboPointChance: 0.35
            });
        }

        if (this.rollTheBonesSystem.buffs.buriedTreasure) {
            this.applyBuff('buried_treasure', {
                duration: duration,
                energyRegen: 1.25
            });
        }

        if (this.rollTheBonesSystem.buffs.grandMelee) {
            this.applyBuff('grand_melee', {
                duration: duration,
                attackSpeed: 1.50,
                leechBonus: 0.25
            });
        }

        if (this.rollTheBonesSystem.buffs.ruthlessPrecision) {
            this.applyBuff('ruthless_precision', {
                duration: duration,
                critBonus: 0.20
            });
        }

        if (this.rollTheBonesSystem.buffs.skullAndCrossbones) {
            this.applyBuff('skull_and_crossbones', {
                duration: duration,
                comboPointSpeedBonus: 1.25
            });
        }

        if (this.rollTheBonesSystem.buffs.trueBearing) {
            this.applyBuff('true_bearing', {
                duration: duration,
                cooldownReduction: 0.35
            });
        }
    }

    triggerMainGauche(target) {
        const damage = this.calculateDamage(3500);
        this.player.dealDamage(target, damage, SPELL_SCHOOL.PHYSICAL, 'main_gauche');

        // 전투 잠재력 (에너지 회복)
        if (Math.random() < this.stats.combatPotency) {
            this.player.generateResource(RESOURCE_TYPE.ENERGY, 15);
        }
    }

    hasActiveRollBuffs() {
        return Object.values(this.rollTheBonesSystem.buffs).some(buff => buff);
    }

    isBurstPhase() {
        return this.player.hasBloodlust() ||
               this.rollTheBonesSystem.rollCount >= 3;
    }
}

// ===========================
// 잠행 도적 (Subtlety Rogue)
// ===========================
class SubtletyRogue extends Specialization {
    constructor(player) {
        super(player, '잠행');

        // 잠행 특화 스탯
        this.stats = {
            ...this.stats,
            shadowDamage: 1.30,         // 암흑 데미지 증가
            stealthDamage: 1.65,        // 은신 데미지 증가
            findWeakness: 0.40,         // 약점 찾기 방어 무시
            shadowTechniques: 0.25      // 암흑 기술 에너지 회복
        };

        // 암흑 시스템
        this.shadowSystem = {
            shadowDance: {
                active: false,
                charges: 2,
                maxCharges: 3,
                duration: 0,
                damageBonus: 0.15
            },
            symbols: {
                active: false,
                damage: 0,
                targets: [],
                duration: 0
            },
            shurikenStorm: {
                comboPerTarget: true,
                critFromStealth: 1.00
            }
        };

        // 잠행 메커니즘
        this.subtletyMechanics = {
            findWeakness: {
                active: false,
                armorPenetration: 0.40,
                duration: 0,
                target: null
            },
            shadowBlades: {
                active: false,
                shadowDamage: 0.50,
                comboGeneration: 1,
                duration: 0
            },
            shadowstrike: {
                teleportBehind: true,
                critBonus: 0.25,
                comboPoints: 2
            },
            masterOfShadows: {
                energyOnStealth: 30,
                energyOnDance: 30
            }
        };

        // 어둠의 비밀 스택
        this.secretTechnique = {
            charges: 0,
            maxCharges: 5,
            damagePerCharge: 8000
        };

        this.initializeAbilities();
        this.initializeTalents();
        this.initializeRotation();
    }

    initializeAbilities() {
        // 기습
        this.abilities.set('shadowstrike', new Ability({
            name: '기습',
            cost: 40,
            costType: RESOURCE_TYPE.ENERGY,
            damage: 11000,
            cooldown: 0,
            requiresStealth: true,
            execute: (target) => {
                // 대상 뒤로 순간이동
                if (this.subtletyMechanics.shadowstrike.teleportBehind) {
                    this.teleportBehindTarget(target);
                }

                let damage = this.calculateDamage(11000 * this.stats.stealthDamage);

                // 치명타 보너스
                const critChance = this.player.stats.crit + this.subtletyMechanics.shadowstrike.critBonus;
                if (Math.random() < critChance) {
                    damage *= 2;
                }

                this.player.dealDamage(target, damage, SPELL_SCHOOL.SHADOW);

                // 약점 찾기 적용
                this.applyFindWeakness(target);

                // 콤보 포인트 생성
                this.generateComboPoints(this.subtletyMechanics.shadowstrike.comboPoints);

                // 암흑 기술 에너지 회복
                if (Math.random() < this.stats.shadowTechniques) {
                    this.player.generateResource(RESOURCE_TYPE.ENERGY, 10);
                }
            }
        }));

        // 백스탭
        this.abilities.set('backstab', new Ability({
            name: '기습',
            cost: 35,
            costType: RESOURCE_TYPE.ENERGY,
            damage: 7200,
            cooldown: 0,
            requiresBehind: true,
            execute: (target) => {
                let damage = this.calculateDamage(7200);

                // 뒤에서 공격 시 추가 데미지
                if (this.isBehindTarget(target)) {
                    damage *= 1.30;
                }

                this.player.dealDamage(target, damage, SPELL_SCHOOL.PHYSICAL);
                this.generateComboPoints(1);

                // 암흑 기술
                if (Math.random() < this.stats.shadowTechniques) {
                    this.player.generateResource(RESOURCE_TYPE.ENERGY, 10);
                    this.generateComboPoints(1);  // 추가 콤보
                }
            }
        }));

        // 절개
        this.abilities.set('eviscerate', new Ability({
            name: '절개',
            cost: 35,
            costType: RESOURCE_TYPE.ENERGY,
            damagePerComboPoint: 6000,
            requiresComboPoints: true,
            execute: (target) => {
                const comboPoints = this.player.resources.current[RESOURCE_TYPE.COMBO_POINTS];
                let damage = this.calculateDamage(6000 * comboPoints);

                // 은신 중 추가 데미지
                if (this.player.isStealthed || this.shadowSystem.shadowDance.active) {
                    damage *= this.stats.stealthDamage;
                }

                // 암흑 데미지로 변환
                this.player.dealDamage(target, damage, SPELL_SCHOOL.SHADOW);
                this.consumeComboPoints();

                // 어둠의 비밀 충전
                if (this.hasTalent('secret_technique')) {
                    this.secretTechnique.charges = Math.min(
                        this.secretTechnique.charges + 1,
                        this.secretTechnique.maxCharges
                    );
                }
            }
        }));

        // 어둠의 춤
        this.abilities.set('shadow_dance', new Ability({
            name: '어둠의 춤',
            cost: 0,
            cooldown: 60,
            charges: 2,
            duration: 8,
            execute: () => {
                this.shadowSystem.shadowDance = {
                    active: true,
                    duration: 8,
                    damageBonus: 0.15,
                    charges: this.shadowSystem.shadowDance.charges - 1
                };

                this.applyBuff('shadow_dance', {
                    duration: 8,
                    stealthAbilities: true,
                    damageBonus: 0.15,
                    critBonus: 0.15
                });

                // 은신 판정 활성화
                this.player.enterPseudoStealth();

                // 그림자 대가 에너지 회복
                if (this.hasTalent('master_of_shadows')) {
                    this.player.generateResource(RESOURCE_TYPE.ENERGY,
                        this.subtletyMechanics.masterOfShadows.energyOnDance);
                }

                // 약점 찾기 활성화
                this.activateFindWeakness();
            }
        }));

        // 그림자 칼날
        this.abilities.set('shadow_blades', new Ability({
            name: '그림자 칼날',
            cost: 0,
            cooldown: 180,
            duration: 20,
            execute: () => {
                this.subtletyMechanics.shadowBlades = {
                    active: true,
                    shadowDamage: 0.50,
                    comboGeneration: 1,
                    duration: 20
                };

                this.applyBuff('shadow_blades', {
                    duration: 20,
                    shadowDamage: 0.50,
                    comboGeneration: 1
                });

                // 즉시 어둠의 춤 충전
                this.shadowSystem.shadowDance.charges = Math.min(
                    this.shadowSystem.shadowDance.charges + 1,
                    this.shadowSystem.shadowDance.maxCharges
                );
            }
        }));

        // 죽음의 상징
        this.abilities.set('symbols_of_death', new Ability({
            name: '죽음의 상징',
            cost: 0,
            cooldown: 30,
            duration: 10,
            execute: () => {
                this.shadowSystem.symbols = {
                    active: true,
                    damage: 0.15,
                    duration: 10
                };

                this.applyBuff('symbols_of_death', {
                    duration: 10,
                    damageIncrease: 0.15,
                    energyRegen: 1.40
                });

                // 즉시 에너지 회복
                this.player.generateResource(RESOURCE_TYPE.ENERGY, 40);
            }
        }));

        // 수리검 폭풍
        this.abilities.set('shuriken_storm', new Ability({
            name: '수리검 폭풍',
            cost: 35,
            costType: RESOURCE_TYPE.ENERGY,
            damage: 3500,
            radius: 10,
            aoe: true,
            execute: (target) => {
                const enemies = this.player.sim.getEnemiesInRange(10);

                enemies.forEach(enemy => {
                    let damage = this.calculateDamage(3500);

                    // 은신 중 100% 치명타
                    if (this.player.isStealthed || this.shadowSystem.shadowDance.active) {
                        damage *= 2;  // 치명타
                    }

                    this.player.dealDamage(enemy, damage, SPELL_SCHOOL.PHYSICAL);
                });

                // 각 적당 콤보 포인트
                if (this.shadowSystem.shurikenStorm.comboPerTarget) {
                    this.generateComboPoints(Math.min(enemies.length, 6));
                } else {
                    this.generateComboPoints(1);
                }
            }
        }));

        // 어둠의 비밀 기술
        this.abilities.set('secret_technique', new Ability({
            name: '어둠의 비밀 기술',
            cost: 0,
            requiresCharges: true,
            cooldown: 45,
            execute: (target) => {
                if (this.secretTechnique.charges < 5) {
                    return;  // 5개 충전 필요
                }

                const damage = this.calculateDamage(
                    this.secretTechnique.damagePerCharge * this.secretTechnique.charges *
                    this.stats.shadowDamage
                );

                // 분신들이 공격
                for (let i = 0; i < this.secretTechnique.charges; i++) {
                    setTimeout(() => {
                        this.player.dealDamage(target, damage / this.secretTechnique.charges,
                                              SPELL_SCHOOL.SHADOW, 'shadow_clone');
                    }, i * 100);
                }

                this.secretTechnique.charges = 0;

                // 어둠의 춤 충전 회복
                this.shadowSystem.shadowDance.charges = Math.min(
                    this.shadowSystem.shadowDance.charges + 1,
                    this.shadowSystem.shadowDance.maxCharges
                );
            }
        }));

        // 그림자 걸음
        this.abilities.set('shadowstep', new Ability({
            name: '그림자 걸음',
            cost: 0,
            cooldown: 20,
            execute: (target) => {
                this.teleportBehindTarget(target);

                this.applyBuff('shadowstep', {
                    duration: 2,
                    damageBonus: 0.10,
                    movementSpeed: 1.70
                });
            }
        }));
    }

    initializeTalents() {
        // 15 레벨
        this.talents.addTalent('weaponmaster', {
            row: 15,
            effects: {
                shadowstrikeProcChance: 0.10,
                backstabDamage: 1.10
            }
        });

        this.talents.addTalent('premeditation', {
            row: 15,
            effects: {
                shadowstrikeFromStealth: 1,  // 추가 콤보
                cheapShotFromStealth: 1
            }
        });

        this.talents.addTalent('gloomblade', {
            row: 15,
            effects: {
                replacesBackstab: true,
                damage: 8500,
                shadowDamage: true
            }
        });

        // 25 레벨
        this.talents.addTalent('nightstalker', {
            row: 25,
            effects: {
                stealthSpeed: 1.20,
                stealthDamage: 1.50
            }
        });

        this.talents.addTalent('shadow_focus', {
            row: 25,
            effects: {
                stealthEnergyCostReduction: 0.20,
                stealthCostReduction: 100
            }
        });

        // 30 레벨
        this.talents.addTalent('vigor', {
            row: 30,
            effects: {
                maxEnergy: 50,
                energyRegen: 1.10
            }
        });

        this.talents.addTalent('deeper_stratagem', {
            row: 30,
            effects: {
                maxComboPoints: 1,
                finisherDamage: 1.05
            }
        });

        this.talents.addTalent('marked_for_death', {
            row: 30,
            cooldown: 60,
            effects: {
                instantComboPoints: 5
            }
        });

        // 35 레벨
        this.talents.addTalent('soothing_darkness', {
            row: 35,
            effects: {
                stealthHeal: 0.03,
                healPerSecond: true
            }
        });

        this.talents.addTalent('cheat_death', {
            row: 35,
            effects: {
                deathPrevention: true,
                healOnSave: 0.70
            }
        });

        // 40 레벨
        this.talents.addTalent('shot_in_the_dark', {
            row: 40,
            effects: {
                cheapShotCritChance: 1.00,
                cheapShotRange: 10
            }
        });

        this.talents.addTalent('night_terrors', {
            row: 40,
            effects: {
                shurikenStormSlowChance: 0.50,
                slowAmount: 0.30
            }
        });

        // 45 레벨
        this.talents.addTalent('dark_shadow', {
            row: 45,
            effects: {
                shadowDanceCharges: 1,
                shadowDanceDamage: 0.25
            }
        });

        this.talents.addTalent('alacrity', {
            row: 45,
            effects: {
                hastePerStack: 0.02,
                maxStacks: 20
            }
        });

        // 50 레벨
        this.talents.addTalent('master_of_shadows', {
            row: 50,
            effects: {
                energyOnStealth: 30,
                energyOnDance: 30,
                maxEnergyBonus: 30
            }
        });

        this.talents.addTalent('secret_technique', {
            row: 50,
            cooldown: 45,
            effects: {
                shadowClones: 5,
                cloneDamage: 8000
            }
        });

        this.talents.addTalent('shuriken_tornado', {
            row: 50,
            cooldown: 60,
            effects: {
                duration: 4,
                damagePerSecond: 4500,
                radius: 15
            }
        });
    }

    initializeRotation() {
        this.rotationPriority = [
            // 그림자 칼날 (대형 쿨기)
            {
                ability: 'shadow_blades',
                condition: () => !this.subtletyMechanics.shadowBlades.active &&
                                this.isMajorBurstPhase()
            },

            // 죽음의 상징 유지
            {
                ability: 'symbols_of_death',
                condition: () => !this.shadowSystem.symbols.active ||
                                this.shadowSystem.symbols.duration < 1
            },

            // 어둠의 춤
            {
                ability: 'shadow_dance',
                condition: () => this.shadowSystem.shadowDance.charges > 0 &&
                                this.shouldUseShadowDance()
            },

            // 어둠의 비밀 기술 (5충전)
            {
                ability: 'secret_technique',
                condition: () => this.secretTechnique.charges >= 5
            },

            // 기습 (은신 중)
            {
                ability: 'shadowstrike',
                condition: () => this.player.isStealthed ||
                                this.shadowSystem.shadowDance.active
            },

            // 절개 (5+ 콤보)
            {
                ability: 'eviscerate',
                condition: () => this.hasComboPoints(5) ||
                                (this.hasComboPoints(4) && this.needsToSpendCombo())
            },

            // 수리검 폭풍 (AoE)
            {
                ability: 'shuriken_storm',
                condition: () => this.player.sim.getEnemiesInRange(10).length >= 2
            },

            // 백스탭 (콤보 생성)
            {
                ability: 'backstab',
                condition: () => this.player.resources.current[RESOURCE_TYPE.COMBO_POINTS] < 5
            }
        ];
    }

    applyFindWeakness(target) {
        this.subtletyMechanics.findWeakness = {
            active: true,
            armorPenetration: 0.40,
            duration: 10,
            target: target
        };

        this.applyDebuff(target, 'find_weakness', {
            duration: 10,
            armorReduction: 0.40
        });
    }

    activateFindWeakness() {
        this.subtletyMechanics.findWeakness.active = true;
    }

    teleportBehindTarget(target) {
        // 대상 뒤로 순간이동
        this.player.position = target.getBehindPosition();
    }

    isBehindTarget(target) {
        // 대상 뒤에 있는지 확인
        return this.player.position.isBehind(target.position);
    }

    shouldUseShadowDance() {
        // 어둠의 춤 사용 판단
        return this.shadowSystem.symbols.active &&
               this.player.resources.current[RESOURCE_TYPE.ENERGY] > 80 &&
               (!this.player.isStealthed || this.shadowSystem.shadowDance.charges >= 2);
    }

    isMajorBurstPhase() {
        return this.player.hasBloodlust() ||
               (this.shadowSystem.symbols.active &&
                this.shadowSystem.shadowDance.charges >= 1);
    }

    needsToSpendCombo() {
        // 콤보 포인트 소비 필요 판단
        return this.player.resources.current[RESOURCE_TYPE.ENERGY] > 100 ||
               this.shadowSystem.shadowDance.active;
    }

    hasComboPoints(count) {
        return this.player.resources.current[RESOURCE_TYPE.COMBO_POINTS] >= count;
    }

    generateComboPoints(amount) {
        const current = this.player.resources.current[RESOURCE_TYPE.COMBO_POINTS];
        const max = this.player.resources.max[RESOURCE_TYPE.COMBO_POINTS];
        this.player.resources.current[RESOURCE_TYPE.COMBO_POINTS] = Math.min(current + amount, max);

        // 그림자 칼날 활성 시 추가 콤보
        if (this.subtletyMechanics.shadowBlades.active) {
            this.player.resources.current[RESOURCE_TYPE.COMBO_POINTS] = Math.min(
                this.player.resources.current[RESOURCE_TYPE.COMBO_POINTS] +
                this.subtletyMechanics.shadowBlades.comboGeneration,
                max
            );
        }
    }

    consumeComboPoints() {
        this.player.resources.current[RESOURCE_TYPE.COMBO_POINTS] = 0;
    }
}

// 내보내기
export {
    AssassinationRogue,
    OutlawRogue,
    SubtletyRogue
};

// 전문화 등록
export function registerRogueSpecializations(registry) {
    registry.register('rogue', 'assassination', AssassinationRogue);
    registry.register('rogue', 'outlaw', OutlawRogue);
    registry.register('rogue', 'subtlety', SubtletyRogue);
}