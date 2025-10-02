// PriestSpecs.js - Phase 4: Priest 전문화 (Discipline, Holy, Shadow)
// 사제 전문화: 수양, 신성, 암흑
// 총 1,850줄 목표

import { Specialization } from '../core/Specialization.js';
import { Talent, TalentTree } from '../core/TalentTree.js';
import { Ability } from '../core/Ability.js';
import { Buff, Debuff } from '../core/Buff.js';
import { RESOURCE_TYPE, SPELL_SCHOOL, BUFF_TYPE } from '../core/Constants.js';

// ===========================
// 수양 사제 (Discipline Priest)
// ===========================
class DisciplinePriest extends Specialization {
    constructor(player) {
        super(player, '수양');

        // 수양 특화 스탯
        this.stats = {
            ...this.stats,
            atonement: 0.50,            // 속죄 치유 전환율
            shieldAbsorb: 1.25,         // 보호막 흡수량 증가
            shadowMend: 1.15,           // 어둠의 치유 효율
            graceHealing: 0.30          // 은총 치유 증가
        };

        // 속죄 시스템
        this.atonementSystem = {
            targets: new Map(),         // 속죄 대상들
            maxTargets: 5,
            duration: 15,
            healingTransfer: 0.50,      // 데미지의 50% 치유 전환
            directHeal: 0.60,           // 직접 치유시 속죄 전환
            spreadRadius: 40
        };

        // 보호막 추적
        this.shieldTracker = {
            powerWordShield: new Map(),
            powerWordBarrier: {
                active: false,
                position: null,
                radius: 10,
                reduction: 0.25,
                duration: 0
            },
            spiritShell: {
                active: false,
                absorb: 0,
                maxAbsorb: 0,
                duration: 0
            }
        };

        // 수양 메커니즘
        this.disciplineMechanics = {
            evangelism: {
                active: false,
                atonementExtension: 6,
                healingBonus: 0.10,
                duration: 0
            },
            rapture: {
                active: false,
                shieldBonus: 2.0,
                instantCast: true,
                duration: 0
            },
            schism: {
                active: false,
                damageIncrease: 0.25,
                duration: 0,
                target: null
            },
            painSuppression: {
                active: false,
                damageReduction: 0.40,
                duration: 0,
                target: null
            }
        };

        // 레디언스 시스템
        this.radianceSystem = {
            instant: false,
            targetCount: 3,
            atonementDuration: 0.60,    // 60% 지속시간
            smartTargeting: true
        };

        this.initializeAbilities();
        this.initializeTalents();
        this.initializeRotation();
    }

    initializeAbilities() {
        // 응징
        this.abilities.set('smite', new Ability({
            name: '응징',
            cost: 2000,
            costType: RESOURCE_TYPE.MANA,
            damage: 6800,
            castTime: 1.5,
            execute: (target) => {
                const damage = this.calculateDamage(6800);
                this.player.dealDamage(target, damage, SPELL_SCHOOL.HOLY);

                // 속죄를 통한 치유
                this.triggerAtonementHealing(damage);

                // 신의 분노 스택
                if (this.hasTalent('wrath_unleashed')) {
                    this.addWrathStack();
                }
            }
        }));

        // 신의 권능: 보호막
        this.abilities.set('power_word_shield', new Ability({
            name: '신의 권능: 보호막',
            cost: 2500,
            costType: RESOURCE_TYPE.MANA,
            absorb: 15000,
            cooldown: 0,
            weakenedSoul: true,
            execute: (target) => {
                let absorb = this.calculateAbsorb(15000 * this.stats.shieldAbsorb);

                // 환희 효과
                if (this.disciplineMechanics.rapture.active) {
                    absorb *= this.disciplineMechanics.rapture.shieldBonus;
                    this.player.resources.current[RESOURCE_TYPE.MANA] += 2500;  // 마나 환불
                }

                this.applyShield(target, 'power_word_shield', {
                    absorb: absorb,
                    duration: 15,
                    weakenedSoul: !this.disciplineMechanics.rapture.active
                });

                // 속죄 적용
                this.applyAtonement(target);

                this.shieldTracker.powerWordShield.set(target.id, {
                    absorb: absorb,
                    remaining: absorb,
                    duration: 15
                });
            }
        }));

        // 어둠의 치유
        this.abilities.set('shadow_mend', new Ability({
            name: '어둠의 치유',
            cost: 3000,
            costType: RESOURCE_TYPE.MANA,
            healing: 18000,
            castTime: 1.5,
            execute: (target) => {
                const healing = this.calculateHealing(18000 * this.stats.shadowMend);
                this.player.healTarget(target, healing);

                // 속죄 적용
                this.applyAtonement(target);

                // 어둠의 치유 디버프 (전투 중 데미지)
                if (this.player.inCombat) {
                    this.applyDebuff(target, 'shadow_mend_dot', {
                        duration: 10,
                        tickInterval: 2,
                        tickDamage: healing * 0.10,
                        removeOnDamage: true
                    });
                }
            }
        }));

        // 고통
        this.abilities.set('pain', new Ability({
            name: '고통',
            cost: 1800,
            costType: RESOURCE_TYPE.MANA,
            damage: 4200,
            instant: true,
            execute: (target) => {
                const damage = this.calculateDamage(4200);
                this.player.dealDamage(target, damage, SPELL_SCHOOL.SHADOW);

                this.applyDebuff(target, 'pain', {
                    duration: 16,
                    tickInterval: 2,
                    tickDamage: this.calculateDamage(2100),
                    type: BUFF_TYPE.DOT
                });

                // 속죄 치유
                this.triggerAtonementHealing(damage);

                // 정화된 그림자 프로세스
                if (this.hasTalent('purged_by_discipline')) {
                    this.generatePurgedShadow();
                }
            }
        }));

        // 정화
        this.abilities.set('purge_the_wicked', new Ability({
            name: '사악한 정화',
            cost: 2200,
            costType: RESOURCE_TYPE.MANA,
            damage: 5500,
            instant: true,
            spreads: true,
            execute: (target) => {
                const damage = this.calculateDamage(5500);
                this.player.dealDamage(target, damage, SPELL_SCHOOL.FIRE);

                this.applyDebuff(target, 'purge_the_wicked', {
                    duration: 20,
                    tickInterval: 2,
                    tickDamage: this.calculateDamage(2800),
                    spreadOnDeath: true,
                    spreadRadius: 8,
                    type: BUFF_TYPE.DOT
                });

                // 속죄 치유
                this.triggerAtonementHealing(damage);
            }
        }));

        // 신의 권능: 광휘
        this.abilities.set('power_word_radiance', new Ability({
            name: '신의 권능: 광휘',
            cost: 6500,
            costType: RESOURCE_TYPE.MANA,
            healing: 8000,
            castTime: 2.5,
            charges: 2,
            execute: () => {
                const targets = this.selectRadianceTargets(this.radianceSystem.targetCount);

                targets.forEach(target => {
                    const healing = this.calculateHealing(8000);
                    this.player.healTarget(target, healing);

                    // 속죄 적용 (감소된 지속시간)
                    this.applyAtonement(target,
                        this.atonementSystem.duration * this.radianceSystem.atonementDuration);
                });

                // 복음화 준비
                if (this.hasTalent('evangelism')) {
                    this.prepareEvangelism();
                }
            }
        }));

        // 고통 억제
        this.abilities.set('pain_suppression', new Ability({
            name: '고통 억제',
            cost: 1800,
            costType: RESOURCE_TYPE.MANA,
            cooldown: 120,
            instant: true,
            execute: (target) => {
                this.disciplineMechanics.painSuppression = {
                    active: true,
                    damageReduction: 0.40,
                    duration: 8,
                    target: target
                };

                this.applyBuff('pain_suppression', {
                    target: target,
                    duration: 8,
                    damageReduction: 0.40
                });

                // 속죄 적용
                this.applyAtonement(target);
            }
        }));

        // 분열
        this.abilities.set('schism', new Ability({
            name: '분열',
            cost: 2400,
            costType: RESOURCE_TYPE.MANA,
            damage: 12000,
            castTime: 2.0,
            cooldown: 24,
            execute: (target) => {
                const damage = this.calculateDamage(12000);
                this.player.dealDamage(target, damage, SPELL_SCHOOL.SHADOW);

                this.disciplineMechanics.schism = {
                    active: true,
                    damageIncrease: 0.25,
                    duration: 9,
                    target: target
                };

                this.applyDebuff(target, 'schism', {
                    duration: 9,
                    damageIncrease: 0.25
                });

                // 속죄 치유 (증폭된)
                this.triggerAtonementHealing(damage * 1.25);
            }
        }));

        // 환희
        this.abilities.set('rapture', new Ability({
            name: '환희',
            cost: 0,
            cooldown: 90,
            duration: 10,
            execute: () => {
                this.disciplineMechanics.rapture = {
                    active: true,
                    shieldBonus: 2.0,
                    instantCast: true,
                    duration: 10
                };

                this.applyBuff('rapture', {
                    duration: 10,
                    shieldBonus: 2.0,
                    instantShields: true,
                    manaReturn: true
                });
            }
        }));

        // 신의 권능: 장벽
        this.abilities.set('power_word_barrier', new Ability({
            name: '신의 권능: 장벽',
            cost: 4000,
            costType: RESOURCE_TYPE.MANA,
            cooldown: 180,
            instant: true,
            execute: (position) => {
                this.shieldTracker.powerWordBarrier = {
                    active: true,
                    position: position,
                    radius: 10,
                    reduction: 0.25,
                    duration: 10
                };

                this.createBarrierField(position, {
                    duration: 10,
                    radius: 10,
                    damageReduction: 0.25,
                    healingIncrease: 0.10
                });
            }
        }));

        // 그림자 마귀
        this.abilities.set('shadowfiend', new Ability({
            name: '그림자 마귀',
            cost: 0,
            cooldown: 180,
            duration: 15,
            execute: (target) => {
                this.summonShadowfiend(target);

                // 마나 회복
                this.player.generateResource(RESOURCE_TYPE.MANA,
                    this.player.resources.max[RESOURCE_TYPE.MANA] * 0.01 * 15);
            }
        }));

        // 복음화
        this.abilities.set('evangelism', new Ability({
            name: '복음화',
            cost: 0,
            cooldown: 90,
            instant: true,
            execute: () => {
                // 모든 속죄 연장
                this.atonementSystem.targets.forEach((atonement, targetId) => {
                    atonement.duration += this.disciplineMechanics.evangelism.atonementExtension;
                });

                this.disciplineMechanics.evangelism = {
                    active: true,
                    healingBonus: 0.10,
                    duration: 15
                };

                this.applyBuff('evangelism', {
                    duration: 15,
                    healingIncrease: 0.10
                });
            }
        }));
    }

    initializeTalents() {
        // 15 레벨
        this.talents.addTalent('castigation', {
            row: 15,
            effects: {
                penanceHits: 1,
                smiteDamage: 1.10
            }
        });

        this.talents.addTalent('twist_of_fate', {
            row: 15,
            effects: {
                damageVsLowHealth: 1.20,
                threshold: 0.35
            }
        });

        this.talents.addTalent('schism', {
            row: 15,
            cooldown: 24,
            effects: {
                damage: 12000,
                debuffDuration: 9
            }
        });

        // 25 레벨
        this.talents.addTalent('body_and_soul', {
            row: 25,
            effects: {
                shieldSpeed: 0.40,
                speedDuration: 3
            }
        });

        this.talents.addTalent('masochism', {
            row: 25,
            effects: {
                damageReduction: 0.10,
                healOnDamage: 0.10
            }
        });

        this.talents.addTalent('angelic_feather', {
            row: 25,
            charges: 3,
            effects: {
                speedBonus: 0.40,
                duration: 5
            }
        });

        // 30 레벨
        this.talents.addTalent('shield_discipline', {
            row: 30,
            effects: {
                shieldCooldown: -2,
                shieldRotation: true
            }
        });

        this.talents.addTalent('mindbender', {
            row: 30,
            cooldown: 60,
            effects: {
                damageIncrease: 1.25,
                manaReturn: 0.015
            }
        });

        this.talents.addTalent('power_word_solace', {
            row: 30,
            cooldown: 15,
            effects: {
                damage: 7000,
                manaReturn: 0.01
            }
        });

        // 35 레벨
        this.talents.addTalent('psychic_voice', {
            row: 35,
            effects: {
                screamRadius: 5,
                screamTargets: 5
            }
        });

        this.talents.addTalent('dominant_mind', {
            row: 35,
            effects: {
                mindControlSpeed: 0.40,
                controlDuration: 1.5
            }
        });

        this.talents.addTalent('shining_force', {
            row: 35,
            cooldown: 45,
            effects: {
                knockback: 20,
                slowDuration: 3
            }
        });

        // 40 레벨
        this.talents.addTalent('sins_of_the_many', {
            row: 40,
            effects: {
                damagePerAtonement: 0.03,
                maxBonus: 0.30
            }
        });

        this.talents.addTalent('contrition', {
            row: 40,
            effects: {
                atonementHealOverTime: true,
                healPerTick: 1500
            }
        });

        this.talents.addTalent('shadow_covenant', {
            row: 40,
            cooldown: 30,
            effects: {
                instantHeal: 20000,
                shadowAbsorb: 0.50
            }
        });

        // 45 레벨
        this.talents.addTalent('purge_the_wicked', {
            row: 45,
            effects: {
                replacesPain: true,
                spreadOnDeath: true,
                damage: 5500
            }
        });

        this.talents.addTalent('divine_star', {
            row: 45,
            cooldown: 15,
            effects: {
                damage: 4000,
                healing: 5000,
                returnDamage: 4000
            }
        });

        this.talents.addTalent('halo', {
            row: 45,
            cooldown: 40,
            effects: {
                damage: 8000,
                healing: 10000,
                radius: 30
            }
        });

        // 50 레벨
        this.talents.addTalent('lenience', {
            row: 50,
            effects: {
                atonementDamageReduction: 0.07
            }
        });

        this.talents.addTalent('evangelism', {
            row: 50,
            cooldown: 90,
            effects: {
                atonementExtension: 6,
                healingBonus: 0.10
            }
        });

        this.talents.addTalent('luminous_barrier', {
            row: 50,
            cooldown: 180,
            effects: {
                absorb: 125000,
                duration: 10,
                radius: 40
            }
        });
    }

    initializeRotation() {
        this.rotationPriority = [
            // 환희 (위기 상황)
            {
                ability: 'rapture',
                condition: () => this.isRaidDamageIncoming() &&
                                !this.disciplineMechanics.rapture.active
            },

            // 신의 권능: 장벽 (공대 데미지)
            {
                ability: 'power_word_barrier',
                condition: () => this.isMajorRaidDamage()
            },

            // 복음화 (속죄 연장)
            {
                ability: 'evangelism',
                condition: () => this.atonementSystem.targets.size >= 5 &&
                                this.hasTalent('evangelism')
            },

            // 분열 (버스트)
            {
                ability: 'schism',
                condition: (target) => !target.hasDebuff('schism') &&
                                       this.atonementSystem.targets.size >= 3
            },

            // 신의 권능: 광휘 (속죄 퍼뜨리기)
            {
                ability: 'power_word_radiance',
                condition: () => this.atonementSystem.targets.size < 3
            },

            // 신의 권능: 보호막 (속죄 적용)
            {
                ability: 'power_word_shield',
                condition: (target) => !target.hasDebuff('weakened_soul') &&
                                       !this.hasAtonement(target)
            },

            // 정화/고통 (DoT 유지)
            {
                ability: this.hasTalent('purge_the_wicked') ? 'purge_the_wicked' : 'pain',
                condition: (target) => !target.hasDebuff('purge_the_wicked') &&
                                       !target.hasDebuff('pain')
            },

            // 그림자 마귀 (마나 & 데미지)
            {
                ability: 'shadowfiend',
                condition: () => this.player.resources.current[RESOURCE_TYPE.MANA] /
                                this.player.resources.max[RESOURCE_TYPE.MANA] < 0.7
            },

            // 응징 (속죄 치유)
            {
                ability: 'smite',
                condition: () => this.atonementSystem.targets.size > 0
            }
        ];
    }

    applyAtonement(target, duration = null) {
        const atonementDuration = duration || this.atonementSystem.duration;

        this.atonementSystem.targets.set(target.id, {
            target: target,
            duration: atonementDuration,
            appliedTime: this.player.sim.currentTime
        });

        this.applyBuff('atonement', {
            target: target,
            duration: atonementDuration,
            icon: 'atonement'
        });
    }

    triggerAtonementHealing(damage) {
        const healingAmount = damage * this.atonementSystem.healingTransfer;

        this.atonementSystem.targets.forEach((atonement) => {
            let healing = healingAmount;

            // 복음화 보너스
            if (this.disciplineMechanics.evangelism.active) {
                healing *= (1 + this.disciplineMechanics.evangelism.healingBonus);
            }

            // 은총 효과
            if (atonement.target.hasBuff('grace')) {
                healing *= (1 + this.stats.graceHealing);
            }

            this.player.healTarget(atonement.target, healing);
        });
    }

    hasAtonement(target) {
        return this.atonementSystem.targets.has(target.id);
    }

    selectRadianceTargets(count) {
        // 지능적 대상 선택 (가장 낮은 HP 우선)
        return this.player.raid.members
            .filter(member => !this.hasAtonement(member))
            .sort((a, b) => (a.health / a.maxHealth) - (b.health / b.maxHealth))
            .slice(0, count);
    }

    summonShadowfiend(target) {
        // 그림자 마귀 소환 로직
        const shadowfiend = {
            duration: 15,
            attackSpeed: 1.5,
            damage: 3500,
            manaReturn: 0.01
        };

        this.player.summon('shadowfiend', shadowfiend);
    }
}

// ===========================
// 신성 사제 (Holy Priest)
// ===========================
class HolyPriest extends Specialization {
    constructor(player) {
        super(player, '신성');

        // 신성 특화 스탯
        this.stats = {
            ...this.stats,
            echoOfLight: 0.60,          // 빛의 메아리 HoT
            serenity: 2.25,             // 평온 치유 증폭
            sanctuary: 0.20,            // 치유의 마법진 보너스
            divineProvidence: 0.10      // 신성한 섭리 치유 증가
        };

        // 신성한 언어 시스템
        this.holyWordsSystem = {
            serenity: {
                cooldown: 60,
                reduction: 6,               // 치유 시 쿨 감소
                instantCast: true
            },
            sanctify: {
                cooldown: 60,
                reduction: 6,               // 기원 시 쿨 감소
                radius: 10
            },
            salvation: {
                cooldown: 720,              // 12분
                reduction: 30,              // 신성한 언어 사용 시 감소
                instantRevive: true
            },
            chastise: {
                cooldown: 60,
                reduction: 4,               // 응징 시 쿨 감소
                stun: 4
            }
        };

        // 치유 메커니즘
        this.holyMechanics = {
            spiritOfRedemption: {
                active: false,
                duration: 0,
                freeCasting: true
            },
            guardianSpirit: {
                active: false,
                target: null,
                healOnSave: 0.50,
                duration: 0
            },
            divineHymn: {
                channeling: false,
                tickCount: 0,
                maxTicks: 5,
                healPerTick: 35000
            },
            apotheosis: {
                active: false,
                instantCasts: true,
                holyWordReduction: 3,
                duration: 0
            }
        };

        // 차크라 시스템 (구버전 특성)
        this.chakraSystem = {
            state: null,                   // serenity, sanctuary, chastise
            bonuses: {
                serenity: { singleTargetHealing: 0.25 },
                sanctuary: { aoeHealing: 0.25 },
                chastise: { damage: 0.50 }
            }
        };

        // 빛의 메아리 추적
        this.echoTracker = new Map();

        this.initializeAbilities();
        this.initializeTalents();
        this.initializeRotation();
    }

    initializeAbilities() {
        // 치유
        this.abilities.set('heal', new Ability({
            name: '치유',
            cost: 2000,
            costType: RESOURCE_TYPE.MANA,
            healing: 12000,
            castTime: 2.5,
            execute: (target) => {
                const healing = this.calculateHealing(12000);
                this.player.healTarget(target, healing);

                // 빛의 메아리
                this.applyEchoOfLight(target, healing);

                // 신성한 언어: 평온 쿨다운 감소
                this.reduceHolyWordCooldown('serenity', 6);
            }
        }));

        // 소생
        this.abilities.set('flash_heal', new Ability({
            name: '소생',
            cost: 3800,
            costType: RESOURCE_TYPE.MANA,
            healing: 18000,
            castTime: 1.5,
            execute: (target) => {
                const healing = this.calculateHealing(18000);
                this.player.healTarget(target, healing);

                // 빛의 메아리
                this.applyEchoOfLight(target, healing);

                // 서지 오브 라이트 프로세스
                if (this.hasTalent('surge_of_light')) {
                    if (Math.random() < 0.25) {
                        this.applyBuff('surge_of_light', {
                            duration: 15,
                            stacks: 2,
                            instantFlashHeal: true
                        });
                    }
                }

                // 신성한 언어: 평온 쿨 감소
                this.reduceHolyWordCooldown('serenity', 6);
            }
        }));

        // 치유의 기원
        this.abilities.set('prayer_of_healing', new Ability({
            name: '치유의 기원',
            cost: 4500,
            costType: RESOURCE_TYPE.MANA,
            healing: 8000,
            castTime: 2.0,
            targetCount: 5,
            execute: (target) => {
                const group = this.getGroupMembers(target);
                const healing = this.calculateHealing(8000);

                group.forEach(member => {
                    this.player.healTarget(member, healing);
                    this.applyEchoOfLight(member, healing);
                });

                // 신성한 언어: 성화 쿨 감소
                this.reduceHolyWordCooldown('sanctify', 6);
            }
        }));

        // 치유의 마법진
        this.abilities.set('circle_of_healing', new Ability({
            name: '치유의 마법진',
            cost: 3200,
            costType: RESOURCE_TYPE.MANA,
            healing: 10000,
            cooldown: 15,
            instant: true,
            targetCount: 5,
            execute: (target) => {
                const targets = this.getSmartHealTargets(5);
                const healing = this.calculateHealing(10000 * (1 + this.stats.sanctuary));

                targets.forEach(t => {
                    this.player.healTarget(t, healing);
                    this.applyEchoOfLight(t, healing);
                });

                // 신성한 언어: 성화 쿨 감소
                this.reduceHolyWordCooldown('sanctify', 6);
            }
        }));

        // 신성한 언어: 평온
        this.abilities.set('holy_word_serenity', new Ability({
            name: '신성한 언어: 평온',
            cost: 4000,
            costType: RESOURCE_TYPE.MANA,
            healing: 45000,
            cooldown: 60,
            instant: true,
            execute: (target) => {
                const healing = this.calculateHealing(45000 * this.stats.serenity);
                this.player.healTarget(target, healing);

                // 빛의 메아리 (강화)
                this.applyEchoOfLight(target, healing * 1.5);

                // 신성한 언어: 구원 쿨 감소
                this.reduceHolyWordCooldown('salvation', 30);
            }
        }));

        // 신성한 언어: 성화
        this.abilities.set('holy_word_sanctify', new Ability({
            name: '신성한 언어: 성화',
            cost: 5000,
            costType: RESOURCE_TYPE.MANA,
            healing: 12000,
            cooldown: 60,
            instant: true,
            radius: 10,
            execute: (position) => {
                const targets = this.getTargetsInArea(position, 10);
                const healing = this.calculateHealing(12000);

                targets.forEach(target => {
                    this.player.healTarget(target, healing);
                    this.applyEchoOfLight(target, healing);
                });

                // 치유의 장 생성
                this.createSanctuaryField(position, {
                    duration: 30,
                    radius: 10,
                    healPerTick: 2000,
                    tickInterval: 2
                });

                // 구원 쿨 감소
                this.reduceHolyWordCooldown('salvation', 30);
            }
        }));

        // 신성한 언어: 구원
        this.abilities.set('holy_word_salvation', new Ability({
            name: '신성한 언어: 구원',
            cost: 8000,
            costType: RESOURCE_TYPE.MANA,
            healing: 75000,
            cooldown: 720,
            instant: true,
            execute: () => {
                const allTargets = this.player.raid.members;
                const healing = this.calculateHealing(75000);

                allTargets.forEach(target => {
                    this.player.healTarget(target, healing);

                    // 즉시 부활 (사망자)
                    if (target.isDead && this.holyWordsSystem.salvation.instantRevive) {
                        this.instantRevive(target);
                    }
                });

                // 레이드 버프
                this.applyRaidBuff('salvation', {
                    duration: 15,
                    damageReduction: 0.30,
                    healingIncrease: 0.30
                });
            }
        }));

        // 수호 영혼
        this.abilities.set('guardian_spirit', new Ability({
            name: '수호 영혼',
            cost: 2000,
            costType: RESOURCE_TYPE.MANA,
            cooldown: 180,
            instant: true,
            execute: (target) => {
                this.holyMechanics.guardianSpirit = {
                    active: true,
                    target: target,
                    healOnSave: 0.50,
                    duration: 10
                };

                this.applyBuff('guardian_spirit', {
                    target: target,
                    duration: 10,
                    deathPrevention: true,
                    healOnSave: 0.50
                });
            }
        }));

        // 천상의 찬가
        this.abilities.set('divine_hymn', new Ability({
            name: '천상의 찬가',
            cost: 6000,
            costType: RESOURCE_TYPE.MANA,
            cooldown: 180,
            channeled: true,
            channelTime: 8,
            execute: () => {
                this.holyMechanics.divineHymn = {
                    channeling: true,
                    tickCount: 0,
                    maxTicks: 5,
                    healPerTick: 35000
                };

                this.startChanneling('divine_hymn', {
                    duration: 8,
                    tickInterval: 2,
                    onTick: () => this.divineHymnTick()
                });
            }
        }));

        // 천상의 별
        this.abilities.set('divine_star', new Ability({
            name: '천상의 별',
            cost: 2800,
            costType: RESOURCE_TYPE.MANA,
            damage: 4500,
            healing: 6000,
            cooldown: 15,
            instant: true,
            execute: (direction) => {
                // 전방 발사
                const targetsForward = this.getTargetsInPath(direction, 24);
                targetsForward.forEach(target => {
                    if (target.isEnemy) {
                        const damage = this.calculateDamage(4500);
                        this.player.dealDamage(target, damage, SPELL_SCHOOL.HOLY);
                    } else {
                        const healing = this.calculateHealing(6000);
                        this.player.healTarget(target, healing);
                    }
                });

                // 복귀
                setTimeout(() => {
                    const targetsReturn = this.getTargetsInPath(direction.reverse(), 24);
                    targetsReturn.forEach(target => {
                        if (target.isEnemy) {
                            const damage = this.calculateDamage(4500);
                            this.player.dealDamage(target, damage, SPELL_SCHOOL.HOLY);
                        } else {
                            const healing = this.calculateHealing(6000);
                            this.player.healTarget(target, healing);
                        }
                    });
                }, 1500);
            }
        }));

        // 회복
        this.abilities.set('renew', new Ability({
            name: '회복',
            cost: 1800,
            costType: RESOURCE_TYPE.MANA,
            healing: 3000,
            instant: true,
            execute: (target) => {
                this.applyBuff('renew', {
                    target: target,
                    duration: 15,
                    tickInterval: 3,
                    tickHealing: this.calculateHealing(3000),
                    type: BUFF_TYPE.HOT
                });

                // 축복받은 회복
                if (this.hasTalent('benediction')) {
                    if (Math.random() < 0.25) {
                        const additionalTarget = this.getLowestHealthAlly();
                        this.applyBuff('renew', {
                            target: additionalTarget,
                            duration: 15,
                            tickInterval: 3,
                            tickHealing: this.calculateHealing(3000),
                            type: BUFF_TYPE.HOT
                        });
                    }
                }
            }
        }));

        // 빛샘
        this.abilities.set('lightwell', new Ability({
            name: '빛샘',
            cost: 3000,
            costType: RESOURCE_TYPE.MANA,
            cooldown: 180,
            instant: true,
            execute: (position) => {
                this.createLightwell(position, {
                    duration: 180,
                    charges: 15,
                    healPerCharge: 20000,
                    autoHealRadius: 20
                });
            }
        }));
    }

    initializeTalents() {
        // 15 레벨
        this.talents.addTalent('enlightenment', {
            row: 15,
            effects: {
                manaRegen: 1.10,
                spiritBonus: 0.25
            }
        });

        this.talents.addTalent('trail_of_light', {
            row: 15,
            effects: {
                flashHealBounce: 0.40,
                healBounce: 0.35
            }
        });

        this.talents.addTalent('renewed_faith', {
            row: 15,
            effects: {
                renewBonus: 1.15,
                renewJump: 0.35
            }
        });

        // 25 레벨
        this.talents.addTalent('angels_mercy', {
            row: 25,
            effects: {
                desperatePrayerCooldown: -30,
                damageReduction: 0.20
            }
        });

        this.talents.addTalent('body_and_mind', {
            row: 25,
            effects: {
                shieldSpeed: 0.40,
                speedDuration: 3
            }
        });

        this.talents.addTalent('angelic_feather', {
            row: 25,
            charges: 3,
            effects: {
                speedBonus: 0.40,
                duration: 5
            }
        });

        // 30 레벨
        this.talents.addTalent('cosmic_ripple', {
            row: 30,
            effects: {
                holyWordAreaHeal: 5000,
                radius: 20
            }
        });

        this.talents.addTalent('guardian_angel', {
            row: 30,
            effects: {
                guardianSpiritCooldown: -60,
                castWhileDead: true
            }
        });

        this.talents.addTalent('afterlife', {
            row: 30,
            effects: {
                spiritDuration: 15,
                instantRevive: true
            }
        });

        // 35 레벨
        this.talents.addTalent('psychic_voice', {
            row: 35,
            effects: {
                screamRadius: 5,
                screamTargets: 5
            }
        });

        this.talents.addTalent('censure', {
            row: 35,
            effects: {
                chastiseStun: 5,
                holyWordChastiseCooldown: -30
            }
        });

        this.talents.addTalent('shining_force', {
            row: 35,
            cooldown: 45,
            effects: {
                knockback: 20,
                slowDuration: 3
            }
        });

        // 40 레벨
        this.talents.addTalent('surge_of_light', {
            row: 40,
            effects: {
                flashHealProcChance: 0.25,
                instantCastStacks: 2
            }
        });

        this.talents.addTalent('binding_heal', {
            row: 40,
            effects: {
                selfHeal: 1.00,
                targetHeal: 1.00
            }
        });

        this.talents.addTalent('piety', {
            row: 40,
            effects: {
                prayerOfHealingCooldown: -2,
                holyWordCooldownReduction: 1.5
            }
        });

        // 45 레벨
        this.talents.addTalent('divine_star', {
            row: 45,
            cooldown: 15,
            effects: {
                damage: 4500,
                healing: 6000,
                returnDamage: 4500
            }
        });

        this.talents.addTalent('halo', {
            row: 45,
            cooldown: 40,
            effects: {
                damage: 9000,
                healing: 12000,
                radius: 30
            }
        });

        // 50 레벨
        this.talents.addTalent('benediction', {
            row: 50,
            effects: {
                renewJumpChance: 0.25,
                renewHealing: 1.50
            }
        });

        this.talents.addTalent('divine_providence', {
            row: 50,
            effects: {
                prayerTargets: 10,
                circleTargets: 6
            }
        });

        this.talents.addTalent('apotheosis', {
            row: 50,
            cooldown: 120,
            effects: {
                instantCasts: true,
                holyWordReduction: 3,
                duration: 20
            }
        });
    }

    initializeRotation() {
        this.rotationPriority = [
            // 천상의 찬가 (공대 위기)
            {
                ability: 'divine_hymn',
                condition: () => this.isRaidCritical() &&
                                !this.holyMechanics.divineHymn.channeling
            },

            // 신성한 언어: 구원 (대규모 치유)
            {
                ability: 'holy_word_salvation',
                condition: () => this.isRaidWideDamage() &&
                                this.abilities.get('holy_word_salvation').isReady()
            },

            // 수호 영혼 (탱커 보호)
            {
                ability: 'guardian_spirit',
                condition: (target) => target.role === 'tank' &&
                                       target.health / target.maxHealth < 0.30
            },

            // 신성한 언어: 평온 (단일 대상 위급)
            {
                ability: 'holy_word_serenity',
                condition: (target) => target.health / target.maxHealth < 0.40
            },

            // 신성한 언어: 성화 (그룹 치유)
            {
                ability: 'holy_word_sanctify',
                condition: () => this.getInjuredInArea(10).length >= 3
            },

            // 치유의 마법진 (그룹 치유)
            {
                ability: 'circle_of_healing',
                condition: () => this.getInjuredAllies().length >= 3
            },

            // 소생 (긴급 치유)
            {
                ability: 'flash_heal',
                condition: (target) => target.health / target.maxHealth < 0.60
            },

            // 회복 (유지)
            {
                ability: 'renew',
                condition: (target) => !target.hasBuff('renew') &&
                                       target.health / target.maxHealth < 0.90
            },

            // 치유의 기원 (그룹 데미지)
            {
                ability: 'prayer_of_healing',
                condition: () => this.getInjuredInGroup().length >= 3
            },

            // 치유 (효율적 치유)
            {
                ability: 'heal',
                condition: (target) => target.health / target.maxHealth < 0.80
            }
        ];
    }

    applyEchoOfLight(target, healingAmount) {
        const echoHealing = healingAmount * this.stats.echoOfLight;

        if (this.echoTracker.has(target.id)) {
            // 기존 메아리에 추가
            const existing = this.echoTracker.get(target.id);
            existing.amount += echoHealing;
        } else {
            // 새 메아리 생성
            this.echoTracker.set(target.id, {
                amount: echoHealing,
                duration: 6,
                tickInterval: 1
            });

            this.applyBuff('echo_of_light', {
                target: target,
                duration: 6,
                tickInterval: 1,
                tickHealing: echoHealing / 6,
                type: BUFF_TYPE.HOT
            });
        }
    }

    reduceHolyWordCooldown(holyWord, seconds) {
        const ability = this.abilities.get(`holy_word_${holyWord}`);
        if (ability) {
            ability.reduceCooldown(seconds);
        }

        // 천상화 보너스
        if (this.holyMechanics.apotheosis.active) {
            ability.reduceCooldown(this.holyMechanics.apotheosis.holyWordReduction);
        }
    }

    divineHymnTick() {
        const targets = this.getSmartHealTargets(5);
        const healing = this.calculateHealing(this.holyMechanics.divineHymn.healPerTick);

        targets.forEach(target => {
            this.player.healTarget(target, healing);
            this.applyEchoOfLight(target, healing);
        });

        this.holyMechanics.divineHymn.tickCount++;

        if (this.holyMechanics.divineHymn.tickCount >= this.holyMechanics.divineHymn.maxTicks) {
            this.holyMechanics.divineHymn.channeling = false;
        }
    }
}

// ===========================
// 암흑 사제 (Shadow Priest)
// ===========================
class ShadowPriest extends Specialization {
    constructor(player) {
        super(player, '암흑');

        // 암흑 특화 스탯
        this.stats = {
            ...this.stats,
            shadowDamage: 1.25,         // 암흑 데미지 증가
            dotDamage: 1.30,            // DoT 데미지 증가
            voidFormHaste: 0.01,        // 공허 형상 가속 (스택당)
            insanityGeneration: 1.20    // 광기 생성 증가
        };

        // 광기 & 공허 형상 시스템
        this.insanitySystem = {
            current: 0,
            max: 100,
            drainRate: 6,              // 초당 감소
            drainAcceleration: 0.5,     // 가속 감소
            voidForm: {
                active: false,
                stacks: 0,
                maxStacks: 100,
                duration: 0,
                hastePerStack: 0.01,
                critPerStack: 0.002
            }
        };

        // DoT 추적
        this.dotTracker = {
            shadowWordPain: new Map(),
            vampiricTouch: new Map(),
            devouringPlague: new Map()
        };

        // 암흑 메커니즘
        this.shadowMechanics = {
            voidEruption: {
                ready: false,
                damage: 25000,
                instantDoTs: true
            },
            voidBolt: {
                charges: 0,
                maxCharges: 2,
                extendDoTs: 3,
                damage: 12000
            },
            shadowfiend: {
                active: false,
                duration: 0,
                attacks: 10
            },
            dispersion: {
                active: false,
                damageReduction: 0.75,
                duration: 0
            },
            surrender: {
                active: false,
                deathTimer: 0,
                insanityBonus: 2.0
            }
        };

        // 마음 분쇄 & 마음 폭발
        this.mindSystem = {
            blast: {
                charges: 2,
                maxCharges: 2,
                rechargeTime: 7.5,
                damage: 8500
            },
            flay: {
                channeling: false,
                tickCount: 0,
                insanityPerTick: 3
            },
            sear: {
                channeling: false,
                targets: [],
                insanityPerTarget: 2
            }
        };

        this.initializeAbilities();
        this.initializeTalents();
        this.initializeRotation();
    }

    initializeAbilities() {
        // 정신 분열
        this.abilities.set('mind_blast', new Ability({
            name: '정신 분열',
            cost: 0,
            damage: 8500,
            castTime: 1.5,
            charges: 2,
            rechargeTime: 7.5,
            execute: (target) => {
                const damage = this.calculateDamage(8500 * this.stats.shadowDamage);
                this.player.dealDamage(target, damage, SPELL_SCHOOL.SHADOW);

                // 광기 생성
                this.generateInsanity(8);

                // 공허 형상 중 추가 효과
                if (this.insanitySystem.voidForm.active) {
                    this.generateInsanity(4);  // 추가 광기
                    this.extendVoidFormDuration(1);
                }

                this.mindSystem.blast.charges--;
            }
        }));

        // 어둠의 권능: 고통
        this.abilities.set('shadow_word_pain', new Ability({
            name: '어둠의 권능: 고통',
            cost: 0,
            damage: 2500,
            instant: true,
            execute: (target) => {
                const tickDamage = this.calculateDamage(2500 * this.stats.dotDamage);

                this.applyDebuff(target, 'shadow_word_pain', {
                    duration: 16,
                    tickInterval: 2,
                    tickDamage: tickDamage,
                    type: BUFF_TYPE.DOT
                });

                this.dotTracker.shadowWordPain.set(target.id, {
                    duration: 16,
                    damage: tickDamage
                });

                // 광기 생성
                this.generateInsanity(4);
            }
        }));

        // 흡혈의 손길
        this.abilities.set('vampiric_touch', new Ability({
            name: '흡혈의 손길',
            cost: 0,
            damage: 3200,
            castTime: 1.5,
            execute: (target) => {
                const tickDamage = this.calculateDamage(3200 * this.stats.dotDamage);

                this.applyDebuff(target, 'vampiric_touch', {
                    duration: 21,
                    tickInterval: 3,
                    tickDamage: tickDamage,
                    healingReturn: 0.50,
                    type: BUFF_TYPE.DOT
                });

                this.dotTracker.vampiricTouch.set(target.id, {
                    duration: 21,
                    damage: tickDamage
                });

                // 광기 생성
                this.generateInsanity(6);
            }
        }));

        // 파멸의 역병
        this.abilities.set('devouring_plague', new Ability({
            name: '파멸의 역병',
            cost: 0,
            requiresInsanity: 50,
            damage: 5000,
            instant: true,
            execute: (target) => {
                if (this.insanitySystem.current < 50) return;

                const tickDamage = this.calculateDamage(5000 * this.stats.dotDamage);

                this.applyDebuff(target, 'devouring_plague', {
                    duration: 12,
                    tickInterval: 2,
                    tickDamage: tickDamage,
                    healingReturn: 0.30,
                    type: BUFF_TYPE.DOT
                });

                this.dotTracker.devouringPlague.set(target.id, {
                    duration: 12,
                    damage: tickDamage
                });

                // 광기 소모
                this.consumeInsanity(50);
            }
        }));

        // 정신의 채찍
        this.abilities.set('mind_flay', new Ability({
            name: '정신의 채찍',
            cost: 0,
            damage: 2000,
            channeled: true,
            channelTime: 3,
            execute: (target) => {
                this.mindSystem.flay = {
                    channeling: true,
                    tickCount: 0,
                    target: target
                };

                this.startChanneling('mind_flay', {
                    duration: 3,
                    tickInterval: 0.75,
                    onTick: () => this.mindFlayTick(target)
                });
            }
        }));

        // 공허 폭발
        this.abilities.set('void_eruption', new Ability({
            name: '공허 폭발',
            cost: 0,
            requiresInsanity: 90,
            damage: 25000,
            instant: true,
            execute: () => {
                if (this.insanitySystem.current < 90) return;

                // AoE 데미지
                const enemies = this.player.sim.getAllEnemies();
                enemies.forEach(enemy => {
                    const damage = this.calculateDamage(25000 * this.stats.shadowDamage);
                    this.player.dealDamage(enemy, damage, SPELL_SCHOOL.SHADOW);

                    // 모든 DoT 즉시 적용
                    if (this.shadowMechanics.voidEruption.instantDoTs) {
                        this.applyInstantDoTs(enemy);
                    }
                });

                // 공허 형상 진입
                this.enterVoidForm();
            }
        }));

        // 공허 화살
        this.abilities.set('void_bolt', new Ability({
            name: '공허 화살',
            cost: 0,
            damage: 12000,
            instant: true,
            charges: 2,
            requiresVoidForm: true,
            execute: (target) => {
                if (!this.insanitySystem.voidForm.active) return;

                const damage = this.calculateDamage(
                    12000 * this.stats.shadowDamage *
                    (1 + this.insanitySystem.voidForm.stacks * 0.02)
                );
                this.player.dealDamage(target, damage, SPELL_SCHOOL.SHADOW);

                // DoT 연장
                this.extendDoTs(target, this.shadowMechanics.voidBolt.extendDoTs);

                // 광기 생성
                this.generateInsanity(10);

                this.shadowMechanics.voidBolt.charges--;
            }
        }));

        // 어둠의 마귀
        this.abilities.set('shadowfiend', new Ability({
            name: '어둠의 마귀',
            cost: 0,
            cooldown: 180,
            instant: true,
            execute: (target) => {
                this.shadowMechanics.shadowfiend = {
                    active: true,
                    duration: 15,
                    attacks: 10,
                    target: target
                };

                this.summonShadowfiend(target);

                // 공허 형상 중 추가 효과
                if (this.insanitySystem.voidForm.active) {
                    this.extendVoidFormDuration(5);
                }
            }
        }));

        // 소멸
        this.abilities.set('dispersion', new Ability({
            name: '소멸',
            cost: 0,
            cooldown: 120,
            instant: true,
            duration: 6,
            execute: () => {
                this.shadowMechanics.dispersion = {
                    active: true,
                    damageReduction: 0.75,
                    duration: 6
                };

                this.applyBuff('dispersion', {
                    duration: 6,
                    damageReduction: 0.75,
                    castWhileMoving: true,
                    immuneToInterrupt: true
                });

                // 공허 형상 중 광기 감소 중지
                if (this.insanitySystem.voidForm.active) {
                    this.pauseInsanityDrain(6);
                }
            }
        }));

        // 정신의 쇄도
        this.abilities.set('mind_sear', new Ability({
            name: '정신의 쇄도',
            cost: 0,
            damage: 1500,
            channeled: true,
            channelTime: 3,
            aoe: true,
            execute: () => {
                this.mindSystem.sear = {
                    channeling: true,
                    targets: this.player.sim.getEnemiesInRange(10)
                };

                this.startChanneling('mind_sear', {
                    duration: 3,
                    tickInterval: 0.75,
                    onTick: () => this.mindSearTick()
                });
            }
        }));

        // 항복
        this.abilities.set('surrender_to_madness', new Ability({
            name: '광기에 굴복',
            cost: 0,
            cooldown: 600,
            instant: true,
            execute: () => {
                this.shadowMechanics.surrender = {
                    active: true,
                    deathTimer: 180,  // 3분
                    insanityBonus: 2.0
                };

                // 즉시 공허 형상 & 100 광기
                this.insanitySystem.current = 100;
                this.enterVoidForm();

                this.applyBuff('surrender_to_madness', {
                    duration: -1,  // 죽을 때까지
                    insanityGeneration: 2.0,
                    castSpeed: 2.0
                });

                // 타이머 시작
                this.startDeathTimer();
            }
        }));

        // 어둠의 권능: 죽음
        this.abilities.set('shadow_word_death', new Ability({
            name: '어둠의 권능: 죽음',
            cost: 0,
            damage: 15000,
            instant: true,
            cooldown: 10,
            execute: (target) => {
                let damage = this.calculateDamage(15000 * this.stats.shadowDamage);

                // 처형 범위 보너스
                if (target.health / target.maxHealth < 0.20) {
                    damage *= 2;
                    this.abilities.get('shadow_word_death').resetCooldown();  // 쿨 초기화
                }

                this.player.dealDamage(target, damage, SPELL_SCHOOL.SHADOW);

                // 광기 생성
                this.generateInsanity(15);

                // 반사 데미지 (대상이 죽지 않으면)
                if (target.health > 0) {
                    this.player.takeDamage(damage * 0.20);
                }
            }
        }));
    }

    initializeTalents() {
        // 15 레벨
        this.talents.addTalent('fortress_of_the_mind', {
            row: 15,
            effects: {
                mindBlastDamage: 1.10,
                mindFlayDamage: 1.10,
                insanityGeneration: 1.20
            }
        });

        this.talents.addTalent('shadowy_insight', {
            row: 15,
            effects: {
                mindBlastInstantChance: 0.12,
                instantCastProc: true
            }
        });

        this.talents.addTalent('shadow_word_void', {
            row: 15,
            cooldown: 20,
            effects: {
                damage: 10000,
                charges: 2,
                insanity: 15
            }
        });

        // 25 레벨
        this.talents.addTalent('body_and_soul', {
            row: 25,
            effects: {
                shieldSpeed: 0.40,
                speedDuration: 3
            }
        });

        this.talents.addTalent('sanlayn', {
            row: 25,
            effects: {
                vampiricEmbraceIncrease: 0.25,
                selfHealing: 0.50
            }
        });

        this.talents.addTalent('intangibility', {
            row: 25,
            effects: {
                dispersionHeal: 0.50,
                dispersionSpeed: 0.50
            }
        });

        // 30 레벨
        this.talents.addTalent('twist_of_fate', {
            row: 30,
            effects: {
                damageVsLowHealth: 1.20,
                threshold: 0.35
            }
        });

        this.talents.addTalent('misery', {
            row: 30,
            effects: {
                vampiricTouchAppliesSwP: true,
                dotDuration: 1.50
            }
        });

        this.talents.addTalent('dark_void', {
            row: 30,
            cooldown: 30,
            effects: {
                damage: 5000,
                radius: 10,
                appliesSwP: true
            }
        });

        // 35 레벨
        this.talents.addTalent('last_word', {
            row: 35,
            effects: {
                silenceCooldown: -15,
                silenceInterrupt: true
            }
        });

        this.talents.addTalent('mind_bomb', {
            row: 35,
            cooldown: 30,
            effects: {
                stunDuration: 4,
                replacesPsychicScream: true
            }
        });

        this.talents.addTalent('psychic_horror', {
            row: 35,
            cooldown: 45,
            effects: {
                stunDuration: 4,
                disarmDuration: 4
            }
        });

        // 40 레벨
        this.talents.addTalent('auspicious_spirits', {
            row: 40,
            effects: {
                shadowyApparitionDamage: 1.25,
                insanityPerSpirit: 2
            }
        });

        this.talents.addTalent('shadow_word_death', {
            row: 40,
            cooldown: 10,
            effects: {
                damage: 15000,
                executeThreshold: 0.20
            }
        });

        this.talents.addTalent('shadow_crash', {
            row: 40,
            cooldown: 30,
            effects: {
                damage: 20000,
                radius: 8,
                insanity: 20
            }
        });

        // 45 레벨
        this.talents.addTalent('lingering_insanity', {
            row: 45,
            effects: {
                voidFormHasteLinger: 0.50,
                lingerDuration: 2
            }
        });

        this.talents.addTalent('mindbender', {
            row: 45,
            cooldown: 60,
            effects: {
                damageIncrease: 1.50,
                insanityGeneration: 2
            }
        });

        this.talents.addTalent('void_torrent', {
            row: 45,
            cooldown: 30,
            channeled: true,
            effects: {
                damage: 35000,
                dotExtension: 3,
                channelTime: 3
            }
        });

        // 50 레벨
        this.talents.addTalent('legacy_of_the_void', {
            row: 50,
            effects: {
                voidEruptionRequirement: 60,
                voidFormDrain: 0.85
            }
        });

        this.talents.addTalent('dark_ascension', {
            row: 50,
            cooldown: 60,
            effects: {
                instantVoidForm: true,
                voidFormStacks: 15,
                instantInsanity: 50
            }
        });

        this.talents.addTalent('surrender_to_madness', {
            row: 50,
            cooldown: 600,
            effects: {
                insanityGeneration: 2.00,
                castingSpeed: 2.00,
                deathOnEnd: true
            }
        });
    }

    initializeRotation() {
        this.rotationPriority = [
            // 공허 폭발 (공허 형상 진입)
            {
                ability: 'void_eruption',
                condition: () => this.insanitySystem.current >= 90 &&
                                !this.insanitySystem.voidForm.active
            },

            // 공허 화살 (공허 형상 중)
            {
                ability: 'void_bolt',
                condition: () => this.insanitySystem.voidForm.active &&
                                this.shadowMechanics.voidBolt.charges > 0
            },

            // 파멸의 역병 (50 광기)
            {
                ability: 'devouring_plague',
                condition: (target) => this.insanitySystem.current >= 50 &&
                                       (!target.hasDebuff('devouring_plague') ||
                                        this.shouldRefreshDevouringPlague(target))
            },

            // 어둠의 권능: 죽음 (처형)
            {
                ability: 'shadow_word_death',
                condition: (target) => target.health / target.maxHealth < 0.20
            },

            // 정신 분열
            {
                ability: 'mind_blast',
                condition: () => this.mindSystem.blast.charges > 0
            },

            // 어둠의 권능: 고통 유지
            {
                ability: 'shadow_word_pain',
                condition: (target) => !target.hasDebuff('shadow_word_pain') ||
                                       target.debuffDuration('shadow_word_pain') < 4.8
            },

            // 흡혈의 손길 유지
            {
                ability: 'vampiric_touch',
                condition: (target) => !target.hasDebuff('vampiric_touch') ||
                                       target.debuffDuration('vampiric_touch') < 6.3
            },

            // 정신의 쇄도 (AoE)
            {
                ability: 'mind_sear',
                condition: () => this.player.sim.getEnemiesInRange(10).length >= 3
            },

            // 정신의 채찍 (필러)
            {
                ability: 'mind_flay',
                condition: () => true
            }
        ];
    }

    generateInsanity(amount) {
        let insanity = amount * this.stats.insanityGeneration;

        // 항복 보너스
        if (this.shadowMechanics.surrender.active) {
            insanity *= this.shadowMechanics.surrender.insanityBonus;
        }

        this.insanitySystem.current = Math.min(
            this.insanitySystem.current + insanity,
            this.insanitySystem.max
        );
    }

    consumeInsanity(amount) {
        this.insanitySystem.current = Math.max(0, this.insanitySystem.current - amount);
    }

    enterVoidForm() {
        this.insanitySystem.voidForm = {
            active: true,
            stacks: 0,
            duration: -1,  // 광기 소진까지
            hastePerStack: 0.01,
            critPerStack: 0.002
        };

        this.applyBuff('void_form', {
            duration: -1,
            stackable: true,
            maxStacks: 100
        });

        // 공허 화살 충전
        this.shadowMechanics.voidBolt.charges = this.shadowMechanics.voidBolt.maxCharges;
    }

    extendVoidFormDuration(seconds) {
        // 공허 형상 연장 (광기 추가)
        this.generateInsanity(seconds * 5);
    }

    extendDoTs(target, seconds) {
        // DoT 연장
        ['shadow_word_pain', 'vampiric_touch', 'devouring_plague'].forEach(dot => {
            if (target.hasDebuff(dot)) {
                target.extendDebuff(dot, seconds);
            }
        });
    }

    mindFlayTick(target) {
        const damage = this.calculateDamage(2000 * this.stats.shadowDamage);
        this.player.dealDamage(target, damage, SPELL_SCHOOL.SHADOW);

        // 광기 생성
        this.generateInsanity(this.mindSystem.flay.insanityPerTick);

        this.mindSystem.flay.tickCount++;
    }

    mindSearTick() {
        this.mindSystem.sear.targets.forEach(target => {
            const damage = this.calculateDamage(1500 * this.stats.shadowDamage);
            this.player.dealDamage(target, damage, SPELL_SCHOOL.SHADOW);
        });

        // 광기 생성 (대상당)
        this.generateInsanity(this.mindSystem.sear.insanityPerTarget *
                              this.mindSystem.sear.targets.length);
    }

    shouldRefreshDevouringPlague(target) {
        // 대유행 시점 판단
        return target.debuffDuration('devouring_plague') < 3.6 &&
               this.insanitySystem.current >= 70;
    }
}

// 내보내기
export {
    DisciplinePriest,
    HolyPriest,
    ShadowPriest
};

// 전문화 등록
export function registerPriestSpecializations(registry) {
    registry.register('priest', 'discipline', DisciplinePriest);
    registry.register('priest', 'holy', HolyPriest);
    registry.register('priest', 'shadow', ShadowPriest);
}