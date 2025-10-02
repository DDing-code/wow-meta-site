// MageSpecs.js - Phase 4: Mage 전문화 (Arcane, Fire, Frost)
// 마법사 전문화: 비전, 화염, 냉기
// 총 1,900줄 목표

import { Specialization } from '../core/Specialization.js';
import { Talent, TalentTree } from '../core/TalentTree.js';
import { Ability } from '../core/Ability.js';
import { Buff, Debuff } from '../core/Buff.js';
import { RESOURCE_TYPE, SPELL_SCHOOL, BUFF_TYPE } from '../core/Constants.js';

// ===========================
// 비전 마법사 (Arcane Mage)
// ===========================
class ArcaneMage extends Specialization {
    constructor(player) {
        super(player, '비전');

        // 비전 특화 스탯
        this.stats = {
            ...this.stats,
            manaRegen: 1.50,            // 마나 재생 증가
            arcaneCharge: 4,            // 최대 비전 충전 수
            arcanePower: 1.30,          // 비전 강화 데미지 증가
            clearcasting: 0.15          // 투명 시전 확률
        };

        // 비전 충전 시스템
        this.arcaneChargeSystem = {
            current: 0,
            max: 4,
            damagePerCharge: 0.60,      // 충전당 데미지 증가
            manaMultiplier: 1.25,       // 충전당 마나 소모 증가
            blastDamage: 12000,
            barrageBase: 4000
        };

        // 비전 메커니즘
        this.arcaneMechanics = {
            arcanePower: {
                active: false,
                damageBonus: 0.30,
                manaReduction: 0.30,
                duration: 0
            },
            evocation: {
                channeling: false,
                manaPercent: 0.25,      // 초당 25% 마나 회복
                tickCount: 0
            },
            presenceOfMind: {
                active: false,
                instantCasts: 2,
                charges: 0
            },
            arcaneOrb: {
                traveling: false,
                targets: [],
                damage: 15000,
                chargeOnHit: true
            },
            ruleOfThrees: {
                active: false,
                freeArcaneBlast: false,
                counter: 0
            }
        };

        // 투명 시전 시스템
        this.clearcastingSystem = {
            active: false,
            stacks: 0,
            maxStacks: 3,
            procChance: 0.15,
            manaCostReduction: 1.00,    // 100% 마나 비용 감소
            damageBonus: 0.15
        };

        // 타임 워프 (블러드러스트)
        this.timeWarp = {
            active: false,
            hasteBonus: 0.30,
            duration: 0,
            exhausted: false
        };

        this.initializeAbilities();
        this.initializeTalents();
        this.initializeRotation();
    }

    initializeAbilities() {
        // 비전 작렬
        this.abilities.set('arcane_blast', new Ability({
            name: '비전 작렬',
            cost: 2750,
            costType: RESOURCE_TYPE.MANA,
            damage: 12000,
            castTime: 2.25,
            execute: (target) => {
                // 비전 충전당 데미지 증가
                const chargeMultiplier = 1 + (this.arcaneChargeSystem.current * this.arcaneChargeSystem.damagePerCharge);
                let damage = this.calculateDamage(12000 * chargeMultiplier);

                // 비전 강화 효과
                if (this.arcaneMechanics.arcanePower.active) {
                    damage *= (1 + this.arcaneMechanics.arcanePower.damageBonus);
                }

                // 투명 시전 효과
                if (this.clearcastingSystem.active) {
                    damage *= (1 + this.clearcastingSystem.damageBonus);
                    this.consumeClearcasting();
                }

                this.player.dealDamage(target, damage, SPELL_SCHOOL.ARCANE);

                // 비전 충전 생성
                this.generateArcaneCharge();

                // 세 번의 규칙 체크
                this.checkRuleOfThrees();
            }
        }));

        // 비전 탄막
        this.abilities.set('arcane_barrage', new Ability({
            name: '비전 탄막',
            cost: 1500,
            costType: RESOURCE_TYPE.MANA,
            damage: 4000,
            instant: true,
            execute: (target) => {
                // 비전 충전당 데미지 증가
                const chargeMultiplier = 1 + (this.arcaneChargeSystem.current * 0.50);
                let damage = this.calculateDamage(4000 * chargeMultiplier);

                // 비전 강화 효과
                if (this.arcaneMechanics.arcanePower.active) {
                    damage *= (1 + this.arcaneMechanics.arcanePower.damageBonus);
                }

                this.player.dealDamage(target, damage, SPELL_SCHOOL.ARCANE);

                // 충전당 추가 대상
                if (this.arcaneChargeSystem.current > 0) {
                    const additionalTargets = this.getAdditionalTargets(target, this.arcaneChargeSystem.current);
                    additionalTargets.forEach(t => {
                        this.player.dealDamage(t, damage * 0.50, SPELL_SCHOOL.ARCANE);
                    });
                }

                // 비전 충전 소모
                this.consumeAllArcaneCharges();
            }
        }));

        // 비전 화살
        this.abilities.set('arcane_missiles', new Ability({
            name: '비전 화살',
            cost: 0,  // 투명 시전 시에만 사용 가능
            damage: 2500,
            channeled: true,
            channelTime: 2.5,
            requiresClearcasting: true,
            execute: (target) => {
                if (!this.clearcastingSystem.active && !this.hasTalent('arcane_missiles_talent')) {
                    return;
                }

                this.startChanneling('arcane_missiles', {
                    duration: 2.5,
                    tickInterval: 0.5,
                    ticks: 5,
                    onTick: () => this.arcaneMissilesTick(target)
                });
            }
        }));

        // 비전 강화
        this.abilities.set('arcane_power', new Ability({
            name: '비전 강화',
            cost: 0,
            cooldown: 120,
            duration: 10,
            execute: () => {
                this.arcaneMechanics.arcanePower = {
                    active: true,
                    damageBonus: 0.30,
                    manaReduction: 0.30,
                    duration: 10
                };

                this.applyBuff('arcane_power', {
                    duration: 10,
                    damageIncrease: 0.30,
                    manaCostReduction: 0.30
                });

                // 즉시 4개 충전
                this.arcaneChargeSystem.current = this.arcaneChargeSystem.max;
            }
        }));

        // 환기
        this.abilities.set('evocation', new Ability({
            name: '환기',
            cost: 0,
            cooldown: 90,
            channeled: true,
            channelTime: 4,
            execute: () => {
                this.arcaneMechanics.evocation = {
                    channeling: true,
                    manaPercent: 0.25,
                    tickCount: 0
                };

                this.startChanneling('evocation', {
                    duration: 4,
                    tickInterval: 1,
                    onTick: () => this.evocationTick(),
                    onComplete: () => this.evocationComplete()
                });
            }
        }));

        // 신비한 지능
        this.abilities.set('arcane_intellect', new Ability({
            name: '신비한 지능',
            cost: 4000,
            costType: RESOURCE_TYPE.MANA,
            instant: true,
            execute: () => {
                this.applyRaidBuff('arcane_intellect', {
                    duration: -1,  // 영구
                    intellectIncrease: 0.05,
                    critIncrease: 0.05
                });
            }
        }));

        // 정신 냉각
        this.abilities.set('presence_of_mind', new Ability({
            name: '정신 냉각',
            cost: 0,
            cooldown: 60,
            instant: true,
            execute: () => {
                this.arcaneMechanics.presenceOfMind = {
                    active: true,
                    instantCasts: 2,
                    charges: 2
                };

                this.applyBuff('presence_of_mind', {
                    duration: -1,  // 충전 소모까지
                    charges: 2,
                    instantCast: true
                });
            }
        }));

        // 비전 구슬
        this.abilities.set('arcane_orb', new Ability({
            name: '비전 구슬',
            cost: 3000,
            costType: RESOURCE_TYPE.MANA,
            damage: 15000,
            cooldown: 20,
            execute: (target) => {
                this.arcaneMechanics.arcaneOrb = {
                    traveling: true,
                    targets: [],
                    damage: 15000,
                    chargeOnHit: true
                };

                // 전방으로 이동하며 적중
                this.launchArcaneOrb(target);
            }
        }));

        // 변이
        this.abilities.set('alter_time', new Ability({
            name: '시간 돌리기',
            cost: 0,
            cooldown: 60,
            instant: true,
            execute: () => {
                // 현재 상태 저장
                this.saveAlterTimeState();

                this.applyBuff('alter_time', {
                    duration: 10,
                    onExpire: () => this.revertAlterTimeState()
                });
            }
        }));

        // 타임 워프
        this.abilities.set('time_warp', new Ability({
            name: '시간 왜곡',
            cost: 0,
            cooldown: 300,
            instant: true,
            execute: () => {
                if (this.timeWarp.exhausted) {
                    return;  // 탈진 상태
                }

                this.timeWarp = {
                    active: true,
                    hasteBonus: 0.30,
                    duration: 40,
                    exhausted: false
                };

                this.applyRaidBuff('time_warp', {
                    duration: 40,
                    hasteIncrease: 0.30,
                    onExpire: () => this.applyExhaustion()
                });
            }
        }));

        // 마법 훔치기
        this.abilities.set('spellsteal', new Ability({
            name: '마법 훔치기',
            cost: 21000,
            costType: RESOURCE_TYPE.MANA,
            instant: true,
            execute: (target) => {
                const stolenBuff = target.getStealableBuff();
                if (stolenBuff) {
                    target.removeBuff(stolenBuff);
                    this.player.applyBuff(stolenBuff);
                }
            }
        }));
    }

    initializeTalents() {
        // 15 레벨
        this.talents.addTalent('amplification', {
            row: 15,
            effects: {
                clearcastingChance: 0.30,
                missilesDamage: 1.15
            }
        });

        this.talents.addTalent('rule_of_threes', {
            row: 15,
            effects: {
                freeBlastEveryThird: true,
                arcaneChargeGeneration: 0.20
            }
        });

        this.talents.addTalent('arcane_familiar', {
            row: 15,
            effects: {
                familiarDamage: 3000,
                manaRegen: 0.10
            }
        });

        // 25 레벨
        this.talents.addTalent('shimmer', {
            row: 25,
            charges: 2,
            effects: {
                instantBlink: true,
                noCastInterrupt: true
            }
        });

        this.talents.addTalent('mana_shield', {
            row: 25,
            effects: {
                damageToMana: 0.50,
                damageReduction: 0.20
            }
        });

        this.talents.addTalent('slipstream', {
            row: 25,
            effects: {
                evocationWhileMoving: true,
                evocationCooldown: -30
            }
        });

        // 30 레벨
        this.talents.addTalent('incanter_flow', {
            row: 30,
            effects: {
                cyclicDamage: 0.20,
                cycleTime: 10
            }
        });

        this.talents.addTalent('focus_magic', {
            row: 30,
            effects: {
                allySpellCrit: 0.05,
                selfStackOnAllyCrit: 0.05
            }
        });

        this.talents.addTalent('rune_of_power', {
            row: 30,
            cooldown: 45,
            charges: 2,
            effects: {
                damageIncrease: 0.40,
                duration: 12
            }
        });

        // 35 레벨
        this.talents.addTalent('resonance', {
            row: 35,
            effects: {
                barrageTargets: 1,
                barrageDamage: 1.10
            }
        });

        this.talents.addTalent('arcane_echo', {
            row: 35,
            effects: {
                echoChance: 0.25,
                echoDamage: 0.50
            }
        });

        this.talents.addTalent('nether_tempest', {
            row: 35,
            effects: {
                dotDamage: 4000,
                spreadRadius: 10,
                duration: 12
            }
        });

        // 40 레벨
        this.talents.addTalent('chrono_shift', {
            row: 40,
            effects: {
                arcaneBarrageSpeed: 0.50,
                movementSpeed: 0.50
            }
        });

        this.talents.addTalent('ice_ward', {
            row: 40,
            cooldown: 30,
            effects: {
                freezeDuration: 2,
                damageOnBreak: 8000
            }
        });

        // 45 레벨
        this.talents.addTalent('reverberate', {
            row: 45,
            effects: {
                barrageBounce: 2,
                bounceDamage: 0.50
            }
        });

        this.talents.addTalent('arcane_orb', {
            row: 45,
            cooldown: 20,
            effects: {
                damage: 15000,
                chargeOnHit: 1
            }
        });

        this.talents.addTalent('supernova', {
            row: 45,
            cooldown: 30,
            effects: {
                damage: 10000,
                knockback: 5
            }
        });

        // 50 레벨
        this.talents.addTalent('overpowered', {
            row: 50,
            effects: {
                arcanePowerDamage: 0.30,
                arcanePowerMana: 0.30
            }
        });

        this.talents.addTalent('time_anomaly', {
            row: 50,
            effects: {
                randomProcChance: 0.05,
                possibleBuffs: ['arcane_power', 'evocation', 'presence_of_mind']
            }
        });

        this.talents.addTalent('enlightened', {
            row: 50,
            effects: {
                manaRegen: 0.25,
                arcaneChargeManaReduction: 0.10
            }
        });
    }

    initializeRotation() {
        this.rotationPriority = [
            // 비전 강화 (버스트 페이즈)
            {
                ability: 'arcane_power',
                condition: () => this.player.resources.current[RESOURCE_TYPE.MANA] /
                                this.player.resources.max[RESOURCE_TYPE.MANA] > 0.70
            },

            // 타임 워프 (레이드 버프)
            {
                ability: 'time_warp',
                condition: () => this.isBurstPhase() && !this.timeWarp.exhausted
            },

            // 비전 구슬 (특성)
            {
                ability: 'arcane_orb',
                condition: () => this.hasTalent('arcane_orb') &&
                                this.abilities.get('arcane_orb').isReady()
            },

            // 비전 화살 (투명 시전)
            {
                ability: 'arcane_missiles',
                condition: () => this.clearcastingSystem.active
            },

            // 비전 탄막 (4충전 또는 마나 부족)
            {
                ability: 'arcane_barrage',
                condition: () => this.arcaneChargeSystem.current === 4 &&
                                (this.needsMana() || this.shouldDumpCharges())
            },

            // 비전 작렬 (충전 생성)
            {
                ability: 'arcane_blast',
                condition: () => this.arcaneChargeSystem.current < 4 ||
                                this.hasRuleOfThrees()
            },

            // 환기 (마나 회복)
            {
                ability: 'evocation',
                condition: () => this.player.resources.current[RESOURCE_TYPE.MANA] /
                                this.player.resources.max[RESOURCE_TYPE.MANA] < 0.30
            }
        ];
    }

    generateArcaneCharge() {
        if (this.arcaneChargeSystem.current < this.arcaneChargeSystem.max) {
            this.arcaneChargeSystem.current++;
        }

        // 투명 시전 확률
        if (Math.random() < this.clearcastingSystem.procChance) {
            this.activateClearcasting();
        }
    }

    consumeAllArcaneCharges() {
        this.arcaneChargeSystem.current = 0;
    }

    activateClearcasting() {
        this.clearcastingSystem.active = true;
        this.clearcastingSystem.stacks = Math.min(
            this.clearcastingSystem.stacks + 1,
            this.clearcastingSystem.maxStacks
        );

        this.applyBuff('clearcasting', {
            duration: 15,
            stacks: this.clearcastingSystem.stacks,
            manaCostReduction: 1.00
        });
    }

    consumeClearcasting() {
        this.clearcastingSystem.stacks--;
        if (this.clearcastingSystem.stacks <= 0) {
            this.clearcastingSystem.active = false;
        }
    }

    arcaneMissilesTick(target) {
        const damage = this.calculateDamage(2500);
        this.player.dealDamage(target, damage, SPELL_SCHOOL.ARCANE);
    }

    evocationTick() {
        const manaToRestore = this.player.resources.max[RESOURCE_TYPE.MANA] *
                             this.arcaneMechanics.evocation.manaPercent;
        this.player.generateResource(RESOURCE_TYPE.MANA, manaToRestore);
        this.arcaneMechanics.evocation.tickCount++;
    }

    evocationComplete() {
        this.arcaneMechanics.evocation.channeling = false;

        // 즉시 투명 시전 부여
        this.activateClearcasting();
    }

    checkRuleOfThrees() {
        if (!this.hasTalent('rule_of_threes')) return;

        this.arcaneMechanics.ruleOfThrees.counter++;
        if (this.arcaneMechanics.ruleOfThrees.counter >= 3) {
            this.arcaneMechanics.ruleOfThrees.freeArcaneBlast = true;
            this.arcaneMechanics.ruleOfThrees.counter = 0;
        }
    }

    hasRuleOfThrees() {
        return this.arcaneMechanics.ruleOfThrees.freeArcaneBlast;
    }

    needsMana() {
        return this.player.resources.current[RESOURCE_TYPE.MANA] /
               this.player.resources.max[RESOURCE_TYPE.MANA] < 0.50;
    }

    shouldDumpCharges() {
        // 이동이나 타겟 변경 시 충전 소모
        return this.player.isMoving || this.targetWillDieSoon();
    }
}

// ===========================
// 화염 마법사 (Fire Mage)
// ===========================
class FireMage extends Specialization {
    constructor(player) {
        super(player, '화염');

        // 화염 특화 스탯
        this.stats = {
            ...this.stats,
            critDamage: 2.00,           // 치명타 데미지 200%
            hotStreak: 0.30,            // 연속 치명타 확률
            ignite: 0.90,               // 점화 데미지 (치명타의 90%)
            combustion: 1.00            // 연소 치명타 보너스
        };

        // 연속 작렬 시스템
        this.hotStreakSystem = {
            heating: false,             // 가열 중
            heated: false,              // 가열 완료 (1회 치명타)
            hotStreak: false,           // 연속 작렬 활성
            instantPyroblast: false,
            criticalStrikes: 0
        };

        // 점화 시스템
        this.igniteSystem = {
            targets: new Map(),         // 점화된 대상들
            spreadRadius: 8,
            maxSpread: 5,
            baseDamage: 0,
            tickInterval: 2
        };

        // 화염 메커니즘
        this.fireMechanics = {
            combustion: {
                active: false,
                critBonus: 1.00,        // 100% 치명타
                duration: 0,
                instantCasts: 0
            },
            phoenixFlames: {
                charges: 3,
                maxCharges: 3,
                damage: 8000,
                guaranteedCrit: true
            },
            blazingBarrier: {
                active: false,
                absorb: 20000,
                blazingDamage: 1500
            },
            fireBlast: {
                charges: 2,
                maxCharges: 3,
                alwaysCrit: true,
                damage: 5000
            }
        };

        // 운석 시스템
        this.meteorSystem = {
            active: false,
            impactTime: 0,
            damage: 50000,
            radius: 8,
            dotDuration: 10
        };

        this.initializeAbilities();
        this.initializeTalents();
        this.initializeRotation();
    }

    initializeAbilities() {
        // 화염구
        this.abilities.set('fireball', new Ability({
            name: '화염구',
            cost: 2000,
            costType: RESOURCE_TYPE.MANA,
            damage: 9000,
            castTime: 2.25,
            execute: (target) => {
                let damage = this.calculateDamage(9000);
                let isCrit = Math.random() < this.player.stats.crit;

                // 연소 중 100% 치명타
                if (this.fireMechanics.combustion.active) {
                    isCrit = true;
                }

                if (isCrit) {
                    damage *= this.stats.critDamage;
                    this.processHotStreak();
                    this.applyIgnite(target, damage * this.stats.ignite);
                }

                this.player.dealDamage(target, damage, SPELL_SCHOOL.FIRE);
            }
        }));

        // 화염 작렬
        this.abilities.set('pyroblast', new Ability({
            name: '화염 작렬',
            cost: 3000,
            costType: RESOURCE_TYPE.MANA,
            damage: 18000,
            castTime: 4.5,
            execute: (target) => {
                let damage = this.calculateDamage(18000);
                let isCrit = Math.random() < this.player.stats.crit;

                // 연속 작렬로 즉시 시전 시
                if (this.hotStreakSystem.instantPyroblast) {
                    this.hotStreakSystem.instantPyroblast = false;
                    isCrit = true;  // 연속 작렬 화작은 항상 치명타
                }

                // 연소 중
                if (this.fireMechanics.combustion.active) {
                    isCrit = true;
                }

                if (isCrit) {
                    damage *= this.stats.critDamage;
                    this.applyIgnite(target, damage * this.stats.ignite);
                }

                this.player.dealDamage(target, damage, SPELL_SCHOOL.FIRE);

                // 화염 작렬 DoT
                this.applyDebuff(target, 'pyroblast_dot', {
                    duration: 6,
                    tickInterval: 1,
                    tickDamage: damage * 0.10,
                    type: BUFF_TYPE.DOT
                });
            }
        }));

        // 화염 폭발
        this.abilities.set('fire_blast', new Ability({
            name: '화염 폭발',
            cost: 0,
            damage: 5000,
            instant: true,
            charges: 2,
            cooldown: 12,
            execute: (target) => {
                let damage = this.calculateDamage(5000);

                // 화염 폭발은 항상 치명타
                damage *= this.stats.critDamage;
                this.processHotStreak();
                this.applyIgnite(target, damage * this.stats.ignite);

                this.player.dealDamage(target, damage, SPELL_SCHOOL.FIRE);

                this.fireMechanics.fireBlast.charges--;
            }
        }));

        // 불사조의 불꽃
        this.abilities.set('phoenix_flames', new Ability({
            name: '불사조의 불꽃',
            cost: 0,
            damage: 8000,
            instant: true,
            charges: 3,
            cooldown: 30,
            execute: (target) => {
                let damage = this.calculateDamage(8000);

                // 불사조의 불꽃은 항상 치명타
                damage *= this.stats.critDamage;
                this.processHotStreak();
                this.applyIgnite(target, damage * this.stats.ignite);

                this.player.dealDamage(target, damage, SPELL_SCHOOL.FIRE);

                // 점화 확산
                this.spreadIgnite(target);

                this.fireMechanics.phoenixFlames.charges--;
            }
        }));

        // 연소
        this.abilities.set('combustion', new Ability({
            name: '연소',
            cost: 0,
            cooldown: 120,
            duration: 10,
            execute: () => {
                this.fireMechanics.combustion = {
                    active: true,
                    critBonus: 1.00,
                    duration: 10,
                    instantCasts: 0
                };

                this.applyBuff('combustion', {
                    duration: 10,
                    critIncrease: 1.00,
                    hasteIncrease: 0.50,
                    mastery: 0.75
                });

                // 화염 폭발 충전 회복
                this.fireMechanics.fireBlast.charges = this.fireMechanics.fireBlast.maxCharges;

                // 즉시 연속 작렬 부여
                this.activateHotStreak();
            }
        }));

        // 작열
        this.abilities.set('scorch', new Ability({
            name: '작열',
            cost: 800,
            costType: RESOURCE_TYPE.MANA,
            damage: 3000,
            castTime: 1.5,
            execute: (target) => {
                let damage = this.calculateDamage(3000);
                let isCrit = Math.random() < (this.player.stats.crit + 0.25);  // 작열은 치명타 확률 증가

                if (isCrit) {
                    damage *= this.stats.critDamage;
                    this.processHotStreak();
                    this.applyIgnite(target, damage * this.stats.ignite);
                }

                this.player.dealDamage(target, damage, SPELL_SCHOOL.FIRE);

                // 대상 체력 30% 이하 시 항상 치명타
                if (target.health / target.maxHealth < 0.30) {
                    this.processHotStreak();
                }
            }
        }));

        // 타오르는 장벽
        this.abilities.set('blazing_barrier', new Ability({
            name: '타오르는 장벽',
            cost: 3000,
            costType: RESOURCE_TYPE.MANA,
            instant: true,
            cooldown: 25,
            execute: () => {
                this.fireMechanics.blazingBarrier = {
                    active: true,
                    absorb: 20000,
                    blazingDamage: 1500
                };

                this.applyShield('blazing_barrier', {
                    absorb: 20000,
                    duration: 60,
                    onDamage: (attacker) => this.blazingBarrierDamage(attacker)
                });
            }
        }));

        // 용의 숨결
        this.abilities.set('dragon_breath', new Ability({
            name: '용의 숨결',
            cost: 4000,
            costType: RESOURCE_TYPE.MANA,
            damage: 12000,
            instant: true,
            cooldown: 20,
            execute: () => {
                const enemies = this.getEnemiesInCone(12, 45);  // 12야드, 45도 원뿔

                enemies.forEach(enemy => {
                    const damage = this.calculateDamage(12000);
                    this.player.dealDamage(enemy, damage, SPELL_SCHOOL.FIRE);

                    // 방향 감각 상실
                    this.applyDebuff(enemy, 'disoriented', {
                        duration: 4,
                        breakOnDamage: true
                    });
                });

                // 연소 중 즉시 연속 작렬
                if (this.fireMechanics.combustion.active) {
                    this.activateHotStreak();
                }
            }
        }));

        // 유성
        this.abilities.set('meteor', new Ability({
            name: '유성',
            cost: 5000,
            costType: RESOURCE_TYPE.MANA,
            damage: 50000,
            cooldown: 45,
            execute: (position) => {
                this.meteorSystem = {
                    active: true,
                    impactTime: 3,  // 3초 후 충돌
                    damage: 50000,
                    radius: 8,
                    dotDuration: 10,
                    targetPosition: position
                };

                // 3초 후 충돌
                setTimeout(() => this.meteorImpact(position), 3000);
            }
        }));

        // 화염 질주
        this.abilities.set('blast_wave', new Ability({
            name: '화염 질주',
            cost: 1500,
            costType: RESOURCE_TYPE.MANA,
            damage: 6000,
            instant: true,
            cooldown: 25,
            execute: () => {
                const enemies = this.getEnemiesInRange(8);

                enemies.forEach(enemy => {
                    const damage = this.calculateDamage(6000);
                    this.player.dealDamage(enemy, damage, SPELL_SCHOOL.FIRE);

                    // 감속
                    this.applyDebuff(enemy, 'slowed', {
                        duration: 4,
                        movementReduction: 0.70
                    });
                });

                // 자신에게 가속
                this.applyBuff('blast_wave_speed', {
                    duration: 2,
                    movementSpeed: 1.50
                });
            }
        }));
    }

    initializeTalents() {
        // 15 레벨
        this.talents.addTalent('firestarter', {
            row: 15,
            effects: {
                scorchWhileAbove90: true,
                scorchCritBonus: 0.25
            }
        });

        this.talents.addTalent('pyromaniac', {
            row: 15,
            effects: {
                hotStreakChance: 0.10,
                pyroblastCastReduction: 0.25
            }
        });

        this.talents.addTalent('searing_touch', {
            row: 15,
            effects: {
                scorchCritBelow30: 1.50,
                scorchCastTime: 0.50
            }
        });

        // 25 레벨
        this.talents.addTalent('shimmer', {
            row: 25,
            charges: 2,
            effects: {
                instantBlink: true,
                noCastInterrupt: true
            }
        });

        this.talents.addTalent('blazing_soul', {
            row: 25,
            effects: {
                blazingBarrierCooldown: -10,
                speedOnBarrier: 0.25
            }
        });

        // 30 레벨
        this.talents.addTalent('incanter_flow', {
            row: 30,
            effects: {
                cyclicDamage: 0.20,
                cycleTime: 10
            }
        });

        this.talents.addTalent('focus_magic', {
            row: 30,
            effects: {
                allySpellCrit: 0.05,
                selfStackOnAllyCrit: 0.05
            }
        });

        this.talents.addTalent('rune_of_power', {
            row: 30,
            cooldown: 45,
            charges: 2,
            effects: {
                damageIncrease: 0.40,
                duration: 12
            }
        });

        // 35 레벨
        this.talents.addTalent('flame_on', {
            row: 35,
            effects: {
                fireBlastCharges: 1,
                fireBlastCooldown: -2
            }
        });

        this.talents.addTalent('alexstraszas_fury', {
            row: 35,
            effects: {
                dragonBreathCrit: 1.00,
                dragonBreathDamage: 1.25
            }
        });

        this.talents.addTalent('from_the_ashes', {
            row: 35,
            effects: {
                phoenixFlamesRecharge: 0.25,
                phoenixFlamesTargets: 3
            }
        });

        // 40 레벨
        this.talents.addTalent('frenetic_speed', {
            row: 40,
            effects: {
                scorchWhileMoving: true,
                movementSpeed: 0.30
            }
        });

        this.talents.addTalent('ice_ward', {
            row: 40,
            cooldown: 30,
            effects: {
                freezeDuration: 2,
                damageOnBreak: 8000
            }
        });

        // 45 레벨
        this.talents.addTalent('flame_patch', {
            row: 45,
            effects: {
                flameStrikeDuration: 8,
                flameStrikeDamage: 1.35
            }
        });

        this.talents.addTalent('conflagration', {
            row: 45,
            effects: {
                fireballSlow: 0.30,
                slowDuration: 3
            }
        });

        this.talents.addTalent('living_bomb', {
            row: 45,
            cooldown: 30,
            effects: {
                explosionDamage: 10000,
                dotDamage: 2500,
                spreadOnExpire: true
            }
        });

        // 50 레벨
        this.talents.addTalent('kindling', {
            row: 50,
            effects: {
                combustionReduction: 1,  // 초당 1초 감소
                critFireSpells: true
            }
        });

        this.talents.addTalent('pyroclasm', {
            row: 50,
            effects: {
                pyroblastDamagePerStack: 0.10,
                maxStacks: 5
            }
        });

        this.talents.addTalent('meteor', {
            row: 50,
            cooldown: 45,
            effects: {
                damage: 50000,
                burnDuration: 10
            }
        });
    }

    initializeRotation() {
        this.rotationPriority = [
            // 연소 (버스트 페이즈)
            {
                ability: 'combustion',
                condition: () => this.isBurstPhase() &&
                                !this.fireMechanics.combustion.active
            },

            // 화염 작렬 (연속 작렬)
            {
                ability: 'pyroblast',
                condition: () => this.hotStreakSystem.hotStreak ||
                                this.hotStreakSystem.instantPyroblast
            },

            // 화염 폭발 (가열 중)
            {
                ability: 'fire_blast',
                condition: () => this.hotStreakSystem.heating &&
                                this.fireMechanics.fireBlast.charges > 0
            },

            // 불사조의 불꽃
            {
                ability: 'phoenix_flames',
                condition: () => this.fireMechanics.phoenixFlames.charges > 0 &&
                                (this.hotStreakSystem.heating || this.fireMechanics.combustion.active)
            },

            // 유성 (특성)
            {
                ability: 'meteor',
                condition: () => this.hasTalent('meteor') &&
                                this.abilities.get('meteor').isReady() &&
                                this.fireMechanics.combustion.active
            },

            // 용의 숨결 (연소 중)
            {
                ability: 'dragon_breath',
                condition: () => this.fireMechanics.combustion.active &&
                                this.getEnemiesInCone(12, 45).length > 0
            },

            // 작열 (이동 중 또는 처형)
            {
                ability: 'scorch',
                condition: (target) => this.player.isMoving ||
                                       target.health / target.maxHealth < 0.30
            },

            // 화염구 (기본)
            {
                ability: 'fireball',
                condition: () => true
            }
        ];
    }

    processHotStreak() {
        if (this.hotStreakSystem.heated) {
            // 두 번째 치명타 - 연속 작렬 활성
            this.activateHotStreak();
        } else {
            // 첫 번째 치명타 - 가열
            this.hotStreakSystem.heating = true;
            this.hotStreakSystem.heated = true;

            this.applyBuff('heating_up', {
                duration: 10
            });
        }
    }

    activateHotStreak() {
        this.hotStreakSystem.hotStreak = true;
        this.hotStreakSystem.instantPyroblast = true;
        this.hotStreakSystem.heating = false;
        this.hotStreakSystem.heated = false;

        this.applyBuff('hot_streak', {
            duration: 15,
            instantCast: 'pyroblast'
        });
    }

    applyIgnite(target, damage) {
        if (!this.igniteSystem.targets.has(target.id)) {
            this.igniteSystem.targets.set(target.id, {
                totalDamage: 0,
                duration: 9
            });
        }

        const ignite = this.igniteSystem.targets.get(target.id);
        ignite.totalDamage += damage;

        this.applyDebuff(target, 'ignite', {
            duration: 9,
            tickInterval: 1,
            tickDamage: ignite.totalDamage / 9,
            type: BUFF_TYPE.DOT
        });
    }

    spreadIgnite(source) {
        const ignite = this.igniteSystem.targets.get(source.id);
        if (!ignite) return;

        const nearbyEnemies = this.getEnemiesInRange(this.igniteSystem.spreadRadius, source);
        nearbyEnemies.slice(0, this.igniteSystem.maxSpread).forEach(enemy => {
            if (enemy.id !== source.id) {
                this.applyIgnite(enemy, ignite.totalDamage * 0.50);
            }
        });
    }

    meteorImpact(position) {
        const enemies = this.getEnemiesInArea(position, this.meteorSystem.radius);

        enemies.forEach(enemy => {
            const damage = this.calculateDamage(this.meteorSystem.damage);
            this.player.dealDamage(enemy, damage, SPELL_SCHOOL.FIRE);

            // 유성 화상 DoT
            this.applyDebuff(enemy, 'meteor_burn', {
                duration: this.meteorSystem.dotDuration,
                tickInterval: 1,
                tickDamage: damage * 0.10,
                type: BUFF_TYPE.DOT
            });
        });

        this.meteorSystem.active = false;
    }

    blazingBarrierDamage(attacker) {
        if (!this.fireMechanics.blazingBarrier.active) return;

        const damage = this.calculateDamage(this.fireMechanics.blazingBarrier.blazingDamage);
        this.player.dealDamage(attacker, damage, SPELL_SCHOOL.FIRE);
    }
}

// ===========================
// 냉기 마법사 (Frost Mage)
// ===========================
class FrostMage extends Specialization {
    constructor(player) {
        super(player, '냉기');

        // 냉기 특화 스탯
        this.stats = {
            ...this.stats,
            icicles: 0.75,              // 고드름 데미지 (주문 데미지의 75%)
            shatter: 3.00,              // 빙결 대상 치명타 배수
            frozenOrb: 1.25,            // 얼음 구슬 데미지 증가
            wintersChill: 0.20          // 한파 확률
        };

        // 고드름 시스템
        this.icicleSystem = {
            current: [],                // 현재 고드름 배열
            max: 5,
            damage: 2500,
            autoLaunch: true,
            glacialSpike: false
        };

        // 냉기 메커니즘
        this.frostMechanics = {
            brainFreeze: {
                active: false,
                instantFlurry: false,
                procChance: 0.25
            },
            fingersOfFrost: {
                charges: 0,
                maxCharges: 2,
                procChance: 0.15
            },
            icyVeins: {
                active: false,
                hasteBonus: 0.30,
                duration: 0
            },
            frozenOrb: {
                active: false,
                position: null,
                speed: 10,
                damage: 3000,
                radius: 10,
                duration: 0
            },
            iceBarrier: {
                active: false,
                absorb: 25000,
                chillEffect: 0.30
            }
        };

        // 한파 시스템
        this.winterChillSystem = {
            active: false,
            targets: [],
            shatterBonus: 3.00,
            duration: 0
        };

        // 소환수 시스템 (물 정령)
        this.waterElemental = {
            active: false,
            duration: 0,
            attackDamage: 1500,
            freeze: {
                cooldown: 25,
                duration: 4,
                radius: 8
            }
        };

        this.initializeAbilities();
        this.initializeTalents();
        this.initializeRotation();
    }

    initializeAbilities() {
        // 얼음 화살
        this.abilities.set('frostbolt', new Ability({
            name: '얼음 화살',
            cost: 2000,
            costType: RESOURCE_TYPE.MANA,
            damage: 8000,
            castTime: 2.0,
            execute: (target) => {
                let damage = this.calculateDamage(8000);
                let isCrit = Math.random() < this.player.stats.crit;

                // 빙결 대상 또는 냉기의 손가락
                if (target.isFrozen() || this.hasFingersOfFrost()) {
                    isCrit = true;
                    damage *= this.stats.shatter;
                }

                if (isCrit) {
                    damage *= 2;
                }

                this.player.dealDamage(target, damage, SPELL_SCHOOL.FROST);

                // 고드름 생성
                this.generateIcicle(damage * this.stats.icicles);

                // 냉기 둔화
                this.applyDebuff(target, 'chilled', {
                    duration: 8,
                    movementReduction: 0.30
                });

                // 두뇌 빙결 확률
                if (Math.random() < this.frostMechanics.brainFreeze.procChance) {
                    this.activateBrainFreeze();
                }

                // 냉기의 손가락 확률
                if (Math.random() < this.frostMechanics.fingersOfFrost.procChance) {
                    this.generateFingersOfFrost();
                }
            }
        }));

        // 서리 광선
        this.abilities.set('flurry', new Ability({
            name: '서리 광선',
            cost: 3000,
            costType: RESOURCE_TYPE.MANA,
            damage: 3500,
            castTime: 3.0,
            missiles: 3,
            execute: (target) => {
                let castTime = 3.0;

                // 두뇌 빙결로 즉시 시전
                if (this.frostMechanics.brainFreeze.instantFlurry) {
                    castTime = 0;
                    this.frostMechanics.brainFreeze.instantFlurry = false;
                    this.frostMechanics.brainFreeze.active = false;
                }

                // 3발 발사
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        const damage = this.calculateDamage(3500);
                        this.player.dealDamage(target, damage, SPELL_SCHOOL.FROST);

                        // 한파 효과
                        if (i === 0) {
                            this.applyWintersChill(target);
                        }
                    }, i * 400);
                }

                // 둔화 효과
                this.applyDebuff(target, 'flurry_slow', {
                    duration: 3,
                    movementReduction: 0.50,
                    stackable: true,
                    maxStacks: 3
                });
            }
        }));

        // 얼음 창
        this.abilities.set('ice_lance', new Ability({
            name: '얼음 창',
            cost: 1200,
            costType: RESOURCE_TYPE.MANA,
            damage: 3000,
            instant: true,
            execute: (target) => {
                let damage = this.calculateDamage(3000);

                // 빙결 대상 3배 데미지
                if (target.isFrozen() || this.hasFingersOfFrost()) {
                    damage *= 3;
                    if (this.hasFingersOfFrost()) {
                        this.consumeFingersOfFrost();
                    }
                }

                this.player.dealDamage(target, damage, SPELL_SCHOOL.FROST);
            }
        }));

        // 얼음 핏줄
        this.abilities.set('icy_veins', new Ability({
            name: '얼음 핏줄',
            cost: 0,
            cooldown: 180,
            duration: 20,
            execute: () => {
                this.frostMechanics.icyVeins = {
                    active: true,
                    hasteBonus: 0.30,
                    duration: 20
                };

                this.applyBuff('icy_veins', {
                    duration: 20,
                    hasteIncrease: 0.30,
                    noPushback: true
                });

                // 시간 왜곡과 중첩 가능
                if (this.player.hasBloodlust()) {
                    this.extendBuff('icy_veins', 10);
                }
            }
        }));

        // 얼음 구슬
        this.abilities.set('frozen_orb', new Ability({
            name: '얼음 구슬',
            cost: 4500,
            costType: RESOURCE_TYPE.MANA,
            damage: 3000,
            cooldown: 60,
            instant: true,
            execute: (direction) => {
                this.frostMechanics.frozenOrb = {
                    active: true,
                    position: this.player.position,
                    direction: direction,
                    speed: 10,
                    damage: 3000,
                    radius: 10,
                    duration: 10
                };

                this.launchFrozenOrb(direction);
            }
        }));

        // 눈보라
        this.abilities.set('blizzard', new Ability({
            name: '눈보라',
            cost: 5000,
            costType: RESOURCE_TYPE.MANA,
            damage: 2000,
            channeled: true,
            channelTime: 8,
            execute: (position) => {
                this.startChanneling('blizzard', {
                    duration: 8,
                    tickInterval: 1,
                    area: { position: position, radius: 8 },
                    onTick: () => this.blizzardTick(position)
                });
            }
        }));

        // 서리 방벽
        this.abilities.set('ice_barrier', new Ability({
            name: '서리 방벽',
            cost: 3000,
            costType: RESOURCE_TYPE.MANA,
            instant: true,
            cooldown: 25,
            execute: () => {
                this.frostMechanics.iceBarrier = {
                    active: true,
                    absorb: 25000,
                    chillEffect: 0.30
                };

                this.applyShield('ice_barrier', {
                    absorb: 25000,
                    duration: 60,
                    onDamage: (attacker) => this.iceBarrierEffect(attacker)
                });
            }
        }));

        // 얼음 회오리
        this.abilities.set('ice_nova', new Ability({
            name: '얼음 회오리',
            cost: 2500,
            costType: RESOURCE_TYPE.MANA,
            damage: 6000,
            instant: true,
            cooldown: 25,
            execute: (target) => {
                const enemies = this.getEnemiesInRange(8, target);

                enemies.forEach(enemy => {
                    const damage = this.calculateDamage(6000);
                    this.player.dealDamage(enemy, damage, SPELL_SCHOOL.FROST);

                    // 빙결
                    this.applyDebuff(enemy, 'frozen', {
                        duration: 2,
                        root: true,
                        shatterable: true
                    });
                });
            }
        }));

        // 물 정령 소환
        this.abilities.set('summon_water_elemental', new Ability({
            name: '물 정령 소환',
            cost: 0,
            cooldown: 30,
            duration: 40,
            execute: () => {
                this.waterElemental = {
                    active: true,
                    duration: 40,
                    attackDamage: 1500,
                    freeze: {
                        cooldown: 25,
                        duration: 4,
                        radius: 8
                    }
                };

                this.summonWaterElemental();
            }
        }));

        // 한파
        this.abilities.set('cold_snap', new Ability({
            name: '한파',
            cost: 0,
            cooldown: 300,
            instant: true,
            execute: () => {
                // 주요 쿨다운 초기화
                ['ice_barrier', 'frozen_orb', 'ice_nova', 'cone_of_cold'].forEach(ability => {
                    this.abilities.get(ability)?.resetCooldown();
                });

                // 냉기의 손가락 2충전
                this.frostMechanics.fingersOfFrost.charges =
                    this.frostMechanics.fingersOfFrost.maxCharges;
            }
        }));

        // 냉기 돌풍
        this.abilities.set('cone_of_cold', new Ability({
            name: '냉기 돌풍',
            cost: 4000,
            costType: RESOURCE_TYPE.MANA,
            damage: 8000,
            instant: true,
            cooldown: 12,
            execute: () => {
                const enemies = this.getEnemiesInCone(12, 90);  // 12야드, 90도

                enemies.forEach(enemy => {
                    const damage = this.calculateDamage(8000);
                    this.player.dealDamage(enemy, damage, SPELL_SCHOOL.FROST);

                    // 둔화
                    this.applyDebuff(enemy, 'cone_slow', {
                        duration: 5,
                        movementReduction: 0.50
                    });
                });

                // 냉기의 손가락 확률 증가
                if (Math.random() < 0.30) {
                    this.generateFingersOfFrost();
                }
            }
        }));

        // 빙하 쐐기 (특성)
        this.abilities.set('glacial_spike', new Ability({
            name: '빙하 쐐기',
            cost: 5000,
            costType: RESOURCE_TYPE.MANA,
            damage: 30000,
            castTime: 3.0,
            requiresIcicles: 5,
            execute: (target) => {
                if (this.icicleSystem.current.length < 5) return;

                // 모든 고드름 소모하여 거대한 쐐기 발사
                const totalDamage = this.icicleSystem.current.reduce((sum, icicle) => sum + icicle, 0);
                const damage = this.calculateDamage(30000 + totalDamage);

                this.player.dealDamage(target, damage, SPELL_SCHOOL.FROST);

                // 빙결
                this.applyDebuff(target, 'frozen', {
                    duration: 4,
                    root: true,
                    shatterable: true
                });

                // 고드름 초기화
                this.icicleSystem.current = [];
            }
        }));
    }

    initializeTalents() {
        // 15 레벨
        this.talents.addTalent('ice_nova', {
            row: 15,
            cooldown: 25,
            effects: {
                damage: 6000,
                freezeDuration: 2
            }
        });

        this.talents.addTalent('ice_floes', {
            row: 15,
            charges: 3,
            effects: {
                castWhileMoving: true,
                duration: 4
            }
        });

        this.talents.addTalent('bone_chilling', {
            row: 15,
            effects: {
                damagePerChill: 0.005,
                maxStacks: 10
            }
        });

        // 25 레벨
        this.talents.addTalent('shimmer', {
            row: 25,
            charges: 2,
            effects: {
                instantBlink: true,
                noCastInterrupt: true
            }
        });

        this.talents.addTalent('ice_ward', {
            row: 25,
            cooldown: 30,
            effects: {
                freezeDuration: 2,
                damageOnBreak: 8000
            }
        });

        // 30 레벨
        this.talents.addTalent('incanter_flow', {
            row: 30,
            effects: {
                cyclicDamage: 0.20,
                cycleTime: 10
            }
        });

        this.talents.addTalent('focus_magic', {
            row: 30,
            effects: {
                allySpellCrit: 0.05,
                selfStackOnAllyCrit: 0.05
            }
        });

        this.talents.addTalent('rune_of_power', {
            row: 30,
            cooldown: 45,
            charges: 2,
            effects: {
                damageIncrease: 0.40,
                duration: 12
            }
        });

        // 35 레벨
        this.talents.addTalent('frozen_touch', {
            row: 35,
            effects: {
                fingersOfFrostChance: 0.40,
                fingersOnFrozen: true
            }
        });

        this.talents.addTalent('chain_reaction', {
            row: 35,
            effects: {
                icicleExplosion: 0.20,
                chainTargets: 3
            }
        });

        this.talents.addTalent('ebonbolt', {
            row: 35,
            cooldown: 45,
            effects: {
                damage: 12000,
                brainFreezeGuaranteed: true
            }
        });

        // 40 레벨
        this.talents.addTalent('frigid_winds', {
            row: 40,
            effects: {
                chillSlow: 0.15,
                slowStacks: true
            }
        });

        this.talents.addTalent('ice_ward', {
            row: 40,
            cooldown: 30,
            effects: {
                freezeDuration: 2,
                damageOnBreak: 8000
            }
        });

        // 45 레벨
        this.talents.addTalent('freezing_rain', {
            row: 45,
            effects: {
                blizzardInstantFrozen: 0.15,
                blizzardRadius: 2
            }
        });

        this.talents.addTalent('splitting_ice', {
            row: 45,
            effects: {
                iceLanceSplit: 0.80,
                icicleSplit: 0.40
            }
        });

        this.talents.addTalent('comet_storm', {
            row: 45,
            cooldown: 30,
            effects: {
                comets: 7,
                damagePerComet: 5000
            }
        });

        // 50 레벨
        this.talents.addTalent('thermal_void', {
            row: 50,
            effects: {
                icyVeinsExtend: 2,  // 빙결 대상 공격 시 2초 연장
                maxExtension: 30
            }
        });

        this.talents.addTalent('ray_of_frost', {
            row: 50,
            cooldown: 60,
            channeled: true,
            effects: {
                damagePerSecond: 8000,
                slowIncrease: 0.10,
                channelTime: 5
            }
        });

        this.talents.addTalent('glacial_spike', {
            row: 50,
            effects: {
                requiresIcicles: 5,
                damage: 30000,
                freeze: 4
            }
        });
    }

    initializeRotation() {
        this.rotationPriority = [
            // 얼음 핏줄 (버스트)
            {
                ability: 'icy_veins',
                condition: () => this.isBurstPhase() &&
                                !this.frostMechanics.icyVeins.active
            },

            // 빙하 쐐기 (5개 고드름)
            {
                ability: 'glacial_spike',
                condition: () => this.hasTalent('glacial_spike') &&
                                this.icicleSystem.current.length >= 5
            },

            // 서리 광선 (두뇌 빙결)
            {
                ability: 'flurry',
                condition: () => this.frostMechanics.brainFreeze.active
            },

            // 얼음 창 (냉기의 손가락 또는 빙결)
            {
                ability: 'ice_lance',
                condition: (target) => this.hasFingersOfFrost() ||
                                       target.isFrozen() ||
                                       target.hasDebuff('winters_chill')
            },

            // 얼음 구슬 (쿨다운)
            {
                ability: 'frozen_orb',
                condition: () => this.abilities.get('frozen_orb').isReady()
            },

            // 눈보라 (AoE)
            {
                ability: 'blizzard',
                condition: () => this.getEnemiesInArea(null, 8).length >= 2
            },

            // 얼음 화살 (기본)
            {
                ability: 'frostbolt',
                condition: () => true
            }
        ];
    }

    generateIcicle(damage) {
        if (this.icicleSystem.current.length >= this.icicleSystem.max) {
            // 최대치 도달 시 가장 오래된 고드름 발사
            this.launchIcicle(0);
        }

        this.icicleSystem.current.push(damage);
    }

    launchIcicle(index, target = null) {
        if (index >= this.icicleSystem.current.length) return;

        const damage = this.icicleSystem.current[index];
        const targetEnemy = target || this.player.currentTarget;

        this.player.dealDamage(targetEnemy, damage, SPELL_SCHOOL.FROST, 'icicle');
        this.icicleSystem.current.splice(index, 1);
    }

    launchAllIcicles(target) {
        while (this.icicleSystem.current.length > 0) {
            this.launchIcicle(0, target);
        }
    }

    activateBrainFreeze() {
        this.frostMechanics.brainFreeze = {
            active: true,
            instantFlurry: true,
            procChance: 0.25
        };

        this.applyBuff('brain_freeze', {
            duration: 15,
            instantCast: 'flurry'
        });
    }

    generateFingersOfFrost() {
        this.frostMechanics.fingersOfFrost.charges = Math.min(
            this.frostMechanics.fingersOfFrost.charges + 1,
            this.frostMechanics.fingersOfFrost.maxCharges
        );

        this.applyBuff('fingers_of_frost', {
            duration: 15,
            charges: this.frostMechanics.fingersOfFrost.charges
        });
    }

    hasFingersOfFrost() {
        return this.frostMechanics.fingersOfFrost.charges > 0;
    }

    consumeFingersOfFrost() {
        if (this.frostMechanics.fingersOfFrost.charges > 0) {
            this.frostMechanics.fingersOfFrost.charges--;
        }
    }

    applyWintersChill(target) {
        this.winterChillSystem.active = true;
        this.winterChillSystem.targets.push(target);

        this.applyDebuff(target, 'winters_chill', {
            duration: 1,
            shatterEffect: true
        });
    }

    launchFrozenOrb(direction) {
        const orb = this.frostMechanics.frozenOrb;

        // 구슬이 이동하며 데미지
        const orbInterval = setInterval(() => {
            if (!orb.active || orb.duration <= 0) {
                clearInterval(orbInterval);
                return;
            }

            // 범위 내 적들에게 데미지
            const enemies = this.getEnemiesInArea(orb.position, orb.radius);
            enemies.forEach(enemy => {
                const damage = this.calculateDamage(orb.damage);
                this.player.dealDamage(enemy, damage, SPELL_SCHOOL.FROST);

                // 둔화
                this.applyDebuff(enemy, 'frozen_orb_slow', {
                    duration: 2,
                    movementReduction: 0.30
                });
            });

            // 냉기의 손가락 생성
            if (enemies.length > 0 && Math.random() < 0.10) {
                this.generateFingersOfFrost();
            }

            orb.duration--;
        }, 1000);
    }

    blizzardTick(position) {
        const enemies = this.getEnemiesInArea(position, 8);

        enemies.forEach(enemy => {
            const damage = this.calculateDamage(2000);
            this.player.dealDamage(enemy, damage, SPELL_SCHOOL.FROST);

            // 둔화
            this.applyDebuff(enemy, 'blizzard_slow', {
                duration: 3,
                movementReduction: 0.50
            });

            // 빙결 확률 (빙결의 비)
            if (this.hasTalent('freezing_rain') && Math.random() < 0.15) {
                this.applyDebuff(enemy, 'frozen', {
                    duration: 1,
                    root: true,
                    shatterable: true
                });
            }
        });
    }

    summonWaterElemental() {
        // 물 정령 소환 로직
        const elemental = {
            attackSpeed: 2.0,
            damage: this.waterElemental.attackDamage,
            freeze: this.waterElemental.freeze
        };

        this.player.summon('water_elemental', elemental);
    }

    iceBarrierEffect(attacker) {
        if (!this.frostMechanics.iceBarrier.active) return;

        // 공격자 둔화
        this.applyDebuff(attacker, 'ice_barrier_chill', {
            duration: 3,
            movementReduction: this.frostMechanics.iceBarrier.chillEffect
        });
    }
}

// 내보내기
export {
    ArcaneMage,
    FireMage,
    FrostMage
};

// 전문화 등록
export function registerMageSpecializations(registry) {
    registry.register('mage', 'arcane', ArcaneMage);
    registry.register('mage', 'fire', FireMage);
    registry.register('mage', 'frost', FrostMage);
}