// WarlockSpecs.js - Phase 4: Warlock 전문화 (Affliction, Demonology, Destruction)
// 흑마법사 전문화: 고통, 악마, 파괴
// 총 1,950줄 목표

import { Specialization } from '../core/Specialization.js';
import { Talent, TalentTree } from '../core/TalentTree.js';
import { Ability } from '../core/Ability.js';
import { Buff, Debuff } from '../core/Buff.js';
import { RESOURCE_TYPE, SPELL_SCHOOL, BUFF_TYPE } from '../core/Constants.js';

// ===========================
// 고통 흑마법사 (Affliction Warlock)
// ===========================
class AfflictionWarlock extends Specialization {
    constructor(player) {
        super(player, '고통');

        // 고통 특화 스탯
        this.stats = {
            ...this.stats,
            dotDamage: 1.35,            // DoT 데미지 증가
            soulShardGen: 1.20,         // 영혼 조각 생성 증가
            corruptionSpeed: 0.20,      // 부패 시전 속도 증가
            mastery: 1.25               // 특화: 강력한 고통
        };

        // 영혼 조각 시스템
        this.soulShardSystem = {
            current: 3,
            max: 5,
            fragments: 0,               // 10개 조각 = 1개 영혼조각
            maxFragments: 10,
            generationRate: 0.10        // DoT 틱당 생성 확률
        };

        // DoT 관리 시스템
        this.dotManagement = {
            agony: new Map(),           // 고뇌 스택 관리
            corruption: new Map(),      // 부패 대상
            unstableAffliction: new Map(), // 불안정한 고통
            siphonLife: new Map(),      // 생명력 착취
            seedOfCorruption: new Map() // 부패의 씨앗
        };

        // 고통 메커니즘
        this.afflictionMechanics = {
            darkglare: {
                active: false,
                duration: 0,
                dotExtension: 8,        // DoT 8초 연장
                damageBonus: 0.30
            },
            haunt: {
                active: false,
                target: null,
                damageIncrease: 0.35,
                duration: 0
            },
            darkSoulMisery: {
                active: false,
                hasteBonus: 0.30,
                duration: 0
            },
            phantomSingularity: {
                active: false,
                position: null,
                damage: 5000,
                radius: 8,
                duration: 0
            }
        };

        // 고뇌 시스템
        this.agonySystem = {
            maxStacks: 10,
            damagePerStack: 500,
            rampUpTime: 0.8,            // 스택당 0.8초
            shardChancePerStack: 0.02
        };

        // 악마의 지배 (펫)
        this.demonicCircle = {
            placed: false,
            position: null,
            teleportReady: true
        };

        this.initializeAbilities();
        this.initializeTalents();
        this.initializeRotation();
    }

    initializeAbilities() {
        // 고뇌
        this.abilities.set('agony', new Ability({
            name: '고뇌',
            cost: 1000,
            costType: RESOURCE_TYPE.MANA,
            damage: 500,
            instant: true,
            execute: (target) => {
                // 고뇌 스택 초기화 또는 갱신
                if (!this.dotManagement.agony.has(target.id)) {
                    this.dotManagement.agony.set(target.id, {
                        stacks: 1,
                        duration: 18
                    });
                } else {
                    const agony = this.dotManagement.agony.get(target.id);
                    agony.duration = 18;  // 갱신
                }

                this.applyDebuff(target, 'agony', {
                    duration: 18,
                    tickInterval: 2,
                    tickDamage: this.calculateAgonyDamage(target),
                    onTick: () => this.agonyTick(target),
                    type: BUFF_TYPE.DOT,
                    pandemic: true  // 30% 대유행 효과
                });
            }
        }));

        // 부패
        this.abilities.set('corruption', new Ability({
            name: '부패',
            cost: 800,
            costType: RESOURCE_TYPE.MANA,
            damage: 400,
            instant: true,
            execute: (target) => {
                const tickDamage = this.calculateDamage(400 * this.stats.dotDamage);

                this.applyDebuff(target, 'corruption', {
                    duration: 14,
                    tickInterval: 2,
                    tickDamage: tickDamage,
                    onTick: () => this.corruptionTick(target),
                    type: BUFF_TYPE.DOT,
                    pandemic: true
                });

                this.dotManagement.corruption.set(target.id, {
                    duration: 14,
                    damage: tickDamage
                });
            }
        }));

        // 불안정한 고통
        this.abilities.set('unstable_affliction', new Ability({
            name: '불안정한 고통',
            cost: 1,
            costType: RESOURCE_TYPE.SOUL_SHARDS,
            damage: 800,
            castTime: 1.5,
            execute: (target) => {
                if (!this.hasEnoughSoulShards(1)) return;

                const tickDamage = this.calculateDamage(800 * this.stats.dotDamage);

                // 최대 5개 스택
                const currentStacks = target.getDebuffStacks('unstable_affliction') || 0;
                if (currentStacks < 5) {
                    this.applyDebuff(target, 'unstable_affliction', {
                        duration: 8,
                        tickInterval: 2,
                        tickDamage: tickDamage,
                        stacks: currentStacks + 1,
                        maxStacks: 5,
                        onDispel: () => this.unstableAfflictionDispel(target),
                        type: BUFF_TYPE.DOT,
                        pandemic: true
                    });
                }

                this.consumeSoulShards(1);

                this.dotManagement.unstableAffliction.set(target.id, {
                    duration: 8,
                    stacks: Math.min(currentStacks + 1, 5)
                });
            }
        }));

        // 흡수
        this.abilities.set('drain_soul', new Ability({
            name: '흡수',
            cost: 0,
            damage: 1000,
            channeled: true,
            channelTime: 5,
            execute: (target) => {
                this.startChanneling('drain_soul', {
                    duration: 5,
                    tickInterval: 1,
                    onTick: () => this.drainSoulTick(target),
                    onComplete: () => this.drainSoulComplete(target)
                });
            }
        }));

        // 어둠의 시선
        this.abilities.set('summon_darkglare', new Ability({
            name: '어둠의 시선 소환',
            cost: 0,
            cooldown: 180,
            instant: true,
            execute: () => {
                this.afflictionMechanics.darkglare = {
                    active: true,
                    duration: 20,
                    dotExtension: 8,
                    damageBonus: 0.30
                };

                // 모든 DoT 8초 연장
                this.extendAllDoTs(8);

                // 어둠의 시선 소환
                this.summonDarkglare();

                this.applyBuff('darkglare', {
                    duration: 20,
                    damageIncrease: 0.30
                });
            }
        }));

        // 혼절
        this.abilities.set('haunt', new Ability({
            name: '혼절',
            cost: 1,
            costType: RESOURCE_TYPE.SOUL_SHARDS,
            damage: 5000,
            cooldown: 15,
            execute: (target) => {
                if (!this.hasEnoughSoulShards(1)) return;

                const damage = this.calculateDamage(5000);
                this.player.dealDamage(target, damage, SPELL_SCHOOL.SHADOW);

                this.afflictionMechanics.haunt = {
                    active: true,
                    target: target,
                    damageIncrease: 0.35,
                    duration: 15
                };

                this.applyDebuff(target, 'haunt', {
                    duration: 15,
                    damageIncrease: 0.35,
                    onExpire: () => this.hauntReturn()
                });

                this.consumeSoulShards(1);
            }
        }));

        // 부패의 씨앗
        this.abilities.set('seed_of_corruption', new Ability({
            name: '부패의 씨앗',
            cost: 1,
            costType: RESOURCE_TYPE.SOUL_SHARDS,
            damage: 3000,
            castTime: 2.5,
            execute: (target) => {
                if (!this.hasEnoughSoulShards(1)) return;

                this.dotManagement.seedOfCorruption.set(target.id, {
                    damage: 0,
                    threshold: 10000,
                    radius: 10
                });

                this.applyDebuff(target, 'seed_of_corruption', {
                    duration: 18,
                    tickInterval: 2,
                    tickDamage: 300,
                    onDamage: (damage) => this.seedDamageAccumulation(target, damage),
                    onExpire: () => this.seedExplosion(target),
                    type: BUFF_TYPE.DOT
                });

                this.consumeSoulShards(1);
            }
        }));

        // 어둠의 영혼: 불행
        this.abilities.set('dark_soul_misery', new Ability({
            name: '어둠의 영혼: 불행',
            cost: 0,
            cooldown: 120,
            duration: 20,
            execute: () => {
                this.afflictionMechanics.darkSoulMisery = {
                    active: true,
                    hasteBonus: 0.30,
                    duration: 20
                };

                this.applyBuff('dark_soul_misery', {
                    duration: 20,
                    hasteIncrease: 0.30
                });

                // 즉시 영혼 조각 1개 생성
                this.generateSoulShard(1);
            }
        }));

        // 생명력 착취
        this.abilities.set('siphon_life', new Ability({
            name: '생명력 착취',
            cost: 1200,
            costType: RESOURCE_TYPE.MANA,
            damage: 350,
            instant: true,
            execute: (target) => {
                const tickDamage = this.calculateDamage(350 * this.stats.dotDamage);

                this.applyDebuff(target, 'siphon_life', {
                    duration: 15,
                    tickInterval: 3,
                    tickDamage: tickDamage,
                    healReturn: 0.30,  // 데미지의 30% 치유
                    type: BUFF_TYPE.DOT,
                    pandemic: true
                });

                this.dotManagement.siphonLife.set(target.id, {
                    duration: 15,
                    damage: tickDamage
                });
            }
        }));

        // 유령 특이점
        this.abilities.set('phantom_singularity', new Ability({
            name: '유령 특이점',
            cost: 0,
            cooldown: 45,
            instant: true,
            execute: (position) => {
                this.afflictionMechanics.phantomSingularity = {
                    active: true,
                    position: position,
                    damage: 5000,
                    radius: 8,
                    duration: 16
                };

                this.createSingularity(position);
            }
        }));

        // 악의의 굴레
        this.abilities.set('vile_taint', new Ability({
            name: '악의의 굴레',
            cost: 1,
            costType: RESOURCE_TYPE.SOUL_SHARDS,
            damage: 8000,
            cooldown: 20,
            instant: true,
            execute: (position) => {
                if (!this.hasEnoughSoulShards(1)) return;

                const enemies = this.getEnemiesInArea(position, 10);

                enemies.forEach(enemy => {
                    const damage = this.calculateDamage(8000);
                    this.player.dealDamage(enemy, damage, SPELL_SCHOOL.SHADOW);

                    // 고뇌 자동 적용
                    this.abilities.get('agony').execute(enemy);
                });

                this.consumeSoulShards(1);
            }
        }));

        // 저주 (다양한 저주)
        this.abilities.set('curse_of_weakness', new Ability({
            name: '무력의 저주',
            cost: 500,
            costType: RESOURCE_TYPE.MANA,
            instant: true,
            execute: (target) => {
                this.applyDebuff(target, 'curse_of_weakness', {
                    duration: 120,
                    attackPowerReduction: 0.20
                });
            }
        }));

        this.abilities.set('curse_of_tongues', new Ability({
            name: '언어의 저주',
            cost: 500,
            costType: RESOURCE_TYPE.MANA,
            instant: true,
            execute: (target) => {
                this.applyDebuff(target, 'curse_of_tongues', {
                    duration: 30,
                    castTimeIncrease: 0.30
                });
            }
        }));

        this.abilities.set('curse_of_exhaustion', new Ability({
            name: '피로의 저주',
            cost: 500,
            costType: RESOURCE_TYPE.MANA,
            instant: true,
            execute: (target) => {
                this.applyDebuff(target, 'curse_of_exhaustion', {
                    duration: 12,
                    movementReduction: 0.50
                });
            }
        }));
    }

    initializeTalents() {
        // 15 레벨
        this.talents.addTalent('nightfall', {
            row: 15,
            effects: {
                instantShadowBolt: 0.20,
                damageBonus: 1.25
            }
        });

        this.talents.addTalent('drain_soul', {
            row: 15,
            effects: {
                executeDamage: 1.50,
                executeThreshold: 0.20
            }
        });

        this.talents.addTalent('haunt', {
            row: 15,
            cooldown: 15,
            effects: {
                damage: 5000,
                damageIncrease: 0.35
            }
        });

        // 25 레벨
        this.talents.addTalent('writhe_in_agony', {
            row: 25,
            effects: {
                agonyMaxStacks: 5,  // 추가 스택
                agonyDamage: 1.15
            }
        });

        this.talents.addTalent('absolute_corruption', {
            row: 25,
            effects: {
                corruptionPermanent: true,
                corruptionDamage: 1.15
            }
        });

        this.talents.addTalent('siphon_life', {
            row: 25,
            effects: {
                healReturn: 0.30,
                dotDamage: 350
            }
        });

        // 30 레벨
        this.talents.addTalent('demon_skin', {
            row: 30,
            effects: {
                soulLeechAbsorb: 1.50,
                passiveAbsorb: 0.01
            }
        });

        this.talents.addTalent('burning_rush', {
            row: 30,
            effects: {
                movementSpeed: 0.50,
                healthCost: 0.04  // 초당 4% 체력
            }
        });

        this.talents.addTalent('dark_pact', {
            row: 30,
            cooldown: 60,
            effects: {
                shield: 0.20,  // 최대 체력의 20%
                sacrificePet: 0.20
            }
        });

        // 35 레벨
        this.talents.addTalent('sow_the_seeds', {
            row: 35,
            effects: {
                seedTargets: 2,  // 추가 대상
                explosionDamage: 1.20
            }
        });

        this.talents.addTalent('phantom_singularity', {
            row: 35,
            cooldown: 45,
            effects: {
                damage: 5000,
                radius: 8,
                duration: 16
            }
        });

        this.talents.addTalent('vile_taint', {
            row: 35,
            cooldown: 20,
            effects: {
                damage: 8000,
                applyAgony: true
            }
        });

        // 40 레벨
        this.talents.addTalent('darkfury', {
            row: 40,
            effects: {
                stunCooldown: -15,
                fearCooldown: -15
            }
        });

        this.talents.addTalent('mortal_coil', {
            row: 40,
            cooldown: 45,
            effects: {
                damage: 0.20,  // 최대 체력의 20%
                heal: 0.20
            }
        });

        this.talents.addTalent('demonic_circle', {
            row: 40,
            effects: {
                teleportRange: 40,
                speedBonus: 0.30
            }
        });

        // 45 레벨
        this.talents.addTalent('shadow_embrace', {
            row: 45,
            effects: {
                damageReduction: 0.03,  // 스택당 3%
                maxStacks: 3
            }
        });

        this.talents.addTalent('malefic_affliction', {
            row: 45,
            effects: {
                unstableDamage: 0.25,
                maleficRapture: true
            }
        });

        this.talents.addTalent('focused_malignancy', {
            row: 45,
            effects: {
                maleficRaptureDamage: 1.75,
                unstableAfflictionBonus: 0.15
            }
        });

        // 50 레벨
        this.talents.addTalent('soul_conduit', {
            row: 50,
            effects: {
                shardRefund: 0.15
            }
        });

        this.talents.addTalent('creeping_death', {
            row: 50,
            effects: {
                dotTickRate: 0.15  // 15% 빠른 틱
            }
        });

        this.talents.addTalent('dark_soul_misery', {
            row: 50,
            cooldown: 120,
            effects: {
                hasteIncrease: 0.30,
                duration: 20
            }
        });
    }

    initializeRotation() {
        this.rotationPriority = [
            // 어둠의 시선 (대형 쿨기)
            {
                ability: 'summon_darkglare',
                condition: () => this.hasAllDoTsActive() &&
                                !this.afflictionMechanics.darkglare.active
            },

            // 어둠의 영혼: 불행
            {
                ability: 'dark_soul_misery',
                condition: () => this.isBurstPhase() &&
                                !this.afflictionMechanics.darkSoulMisery.active
            },

            // 혼절 (특성)
            {
                ability: 'haunt',
                condition: (target) => this.hasTalent('haunt') &&
                                       !target.hasDebuff('haunt') &&
                                       this.hasEnoughSoulShards(1)
            },

            // 유령 특이점 (특성)
            {
                ability: 'phantom_singularity',
                condition: () => this.hasTalent('phantom_singularity') &&
                                this.abilities.get('phantom_singularity').isReady()
            },

            // 고뇌 유지
            {
                ability: 'agony',
                condition: (target) => !target.hasDebuff('agony') ||
                                       target.debuffDuration('agony') < 5.4
            },

            // 부패 유지
            {
                ability: 'corruption',
                condition: (target) => !target.hasDebuff('corruption') ||
                                       target.debuffDuration('corruption') < 4.2
            },

            // 생명력 착취 유지 (특성)
            {
                ability: 'siphon_life',
                condition: (target) => this.hasTalent('siphon_life') &&
                                       (!target.hasDebuff('siphon_life') ||
                                        target.debuffDuration('siphon_life') < 4.5)
            },

            // 불안정한 고통 (영혼 조각 소비)
            {
                ability: 'unstable_affliction',
                condition: (target) => this.hasEnoughSoulShards(1) &&
                                       target.getDebuffStacks('unstable_affliction') < 5
            },

            // 부패의 씨앗 (AoE)
            {
                ability: 'seed_of_corruption',
                condition: () => this.getEnemiesInRange(10).length >= 3 &&
                                this.hasEnoughSoulShards(1)
            },

            // 흡수 (필러)
            {
                ability: 'drain_soul',
                condition: () => true
            }
        ];
    }

    agonyTick(target) {
        const agony = this.dotManagement.agony.get(target.id);
        if (!agony) return;

        // 스택 증가
        if (agony.stacks < this.agonySystem.maxStacks) {
            agony.stacks++;
        }

        // 데미지 계산
        const damage = this.calculateDamage(
            this.agonySystem.damagePerStack * agony.stacks * this.stats.dotDamage
        );
        this.player.dealDamage(target, damage, SPELL_SCHOOL.SHADOW);

        // 영혼 조각 생성 확률
        if (Math.random() < this.agonySystem.shardChancePerStack * agony.stacks) {
            this.generateSoulShardFragment();
        }
    }

    corruptionTick(target) {
        // 영혼 조각 생성 확률
        if (Math.random() < this.soulShardSystem.generationRate) {
            this.generateSoulShardFragment();
        }
    }

    drainSoulTick(target) {
        const damage = this.calculateDamage(1000);
        this.player.dealDamage(target, damage, SPELL_SCHOOL.SHADOW);

        // 처형 범위에서 데미지 증가
        if (target.health / target.maxHealth < 0.20) {
            this.player.dealDamage(target, damage * 0.50, SPELL_SCHOOL.SHADOW);
        }

        // 영혼 조각 생성
        if (Math.random() < 0.30) {
            this.generateSoulShardFragment();
        }
    }

    drainSoulComplete(target) {
        // 대상 사망 시 영혼 조각 보너스
        if (target.isDead) {
            this.generateSoulShard(1);
        }
    }

    seedDamageAccumulation(target, damage) {
        const seed = this.dotManagement.seedOfCorruption.get(target.id);
        if (!seed) return;

        seed.damage += damage;

        // 임계치 도달 시 폭발
        if (seed.damage >= seed.threshold) {
            this.seedExplosion(target);
        }
    }

    seedExplosion(target) {
        const seed = this.dotManagement.seedOfCorruption.get(target.id);
        if (!seed) return;

        const enemies = this.getEnemiesInRange(seed.radius, target);
        const explosionDamage = this.calculateDamage(12000);

        enemies.forEach(enemy => {
            this.player.dealDamage(enemy, explosionDamage, SPELL_SCHOOL.SHADOW);

            // 부패 확산
            if (enemy.id !== target.id) {
                this.abilities.get('corruption').execute(enemy);
            }
        });

        this.dotManagement.seedOfCorruption.delete(target.id);
    }

    unstableAfflictionDispel(target) {
        // 해제 시 침묵 4초
        this.applyDebuff(target, 'unstable_affliction_silence', {
            duration: 4,
            silence: true
        });
    }

    extendAllDoTs(seconds) {
        // 모든 활성 DoT 연장
        this.player.activeTargets.forEach(target => {
            ['agony', 'corruption', 'unstable_affliction', 'siphon_life'].forEach(dot => {
                if (target.hasDebuff(dot)) {
                    target.extendDebuff(dot, seconds);
                }
            });
        });
    }

    hauntReturn() {
        // 혼절 종료 시 영혼 조각 반환
        if (Math.random() < 0.30) {
            this.generateSoulShard(1);
        }
    }

    calculateAgonyDamage(target) {
        const agony = this.dotManagement.agony.get(target.id) || { stacks: 1 };
        return this.calculateDamage(
            this.agonySystem.damagePerStack * agony.stacks * this.stats.dotDamage
        );
    }

    hasAllDoTsActive() {
        const target = this.player.currentTarget;
        return target.hasDebuff('agony') &&
               target.hasDebuff('corruption') &&
               target.hasDebuff('unstable_affliction');
    }
}

// ===========================
// 악마 흑마법사 (Demonology Warlock)
// ===========================
class DemonologyWarlock extends Specialization {
    constructor(player) {
        super(player, '악마');

        // 악마 특화 스탯
        this.stats = {
            ...this.stats,
            demonDamage: 1.35,          // 악마 데미지 증가
            impEnergy: 100,             // 임프 에너지
            demonicCore: 0.20,          // 악마의 핵 확률
            mastery: 1.50               // 특화: 악마 지배
        };

        // 악마 군단 시스템
        this.demonArmySystem = {
            imps: [],                   // 활성 임프들
            maxImps: 20,
            impDuration: 40,
            vilefiend: null,
            grimoire: null,
            tyrant: null
        };

        // 악마의 핵 시스템
        this.demonicCoreSystem = {
            stacks: 0,
            maxStacks: 4,
            procChance: 0.20,
            instantCast: true
        };

        // 악마 메커니즘
        this.demonologyMechanics = {
            demonicTyrant: {
                active: false,
                duration: 0,
                damageBonus: 0.15,
                demonExtension: 15      // 악마 지속시간 15초 증가
            },
            netherPortal: {
                active: false,
                position: null,
                summonTimer: 0,
                duration: 0
            },
            powerSiphon: {
                impsConsumed: 0,
                damagePerImp: 3000,
                coreGeneration: 2
            },
            callDreadstalkers: {
                count: 2,
                duration: 12,
                damage: 2500
            }
        };

        // Hand of Gul'dan 시스템
        this.handOfGuldanSystem = {
            castTime: 1.5,
            damage: 5000,
            impsPerShard: 1,
            maxShards: 3
        };

        // 악마 강화 버프
        this.demonEmpowerment = {
            health: 0.20,
            damage: 0.50,
            hasteReduction: 0.30
        };

        this.initializeAbilities();
        this.initializeTalents();
        this.initializeRotation();
    }

    initializeAbilities() {
        // 암흑 화살
        this.abilities.set('shadow_bolt', new Ability({
            name: '암흑 화살',
            cost: 2000,
            costType: RESOURCE_TYPE.MANA,
            damage: 6000,
            castTime: 2.0,
            execute: (target) => {
                let damage = this.calculateDamage(6000);

                // 악마의 핵으로 즉시 시전
                if (this.demonicCoreSystem.stacks > 0) {
                    damage *= 1.20;
                    this.consumeDemonicCore();
                }

                this.player.dealDamage(target, damage, SPELL_SCHOOL.SHADOW);

                // 영혼 조각 생성
                this.generateSoulShardFragment(3);

                // 악마의 핵 생성 확률
                if (Math.random() < this.demonicCoreSystem.procChance) {
                    this.generateDemonicCore();
                }
            }
        }));

        // 악마 화살
        this.abilities.set('demonbolt', new Ability({
            name: '악마 화살',
            cost: 2500,
            costType: RESOURCE_TYPE.MANA,
            damage: 10000,
            castTime: 2.5,
            requiresDemonicCore: true,
            execute: (target) => {
                if (this.demonicCoreSystem.stacks <= 0) return;

                const damage = this.calculateDamage(10000);
                this.player.dealDamage(target, damage, SPELL_SCHOOL.SHADOW);

                this.consumeDemonicCore();

                // 추가 임프 소환 확률
                if (Math.random() < 0.30) {
                    this.summonImp();
                }
            }
        }));

        // 굴단의 손
        this.abilities.set('hand_of_guldan', new Ability({
            name: '굴단의 손',
            cost: 1,
            costType: RESOURCE_TYPE.SOUL_SHARDS,
            damage: 5000,
            castTime: 1.5,
            maxCharges: 3,
            execute: (target) => {
                const shardsToUse = Math.min(this.soulShardSystem.current, 3);
                if (shardsToUse === 0) return;

                // 영혼 조각당 피해 증가
                const damage = this.calculateDamage(5000 * shardsToUse);
                this.player.dealDamage(target, damage, SPELL_SCHOOL.SHADOW);

                // 영혼 조각당 임프 소환
                for (let i = 0; i < shardsToUse; i++) {
                    this.summonImp();
                }

                this.consumeSoulShards(shardsToUse);

                // 운석 충돌 효과
                this.applyDebuff(target, 'hand_of_guldan_impact', {
                    duration: 3,
                    movementReduction: 0.30
                });
            }
        }));

        // 공포사냥개 소환
        this.abilities.set('call_dreadstalkers', new Ability({
            name: '공포사냥개 소환',
            cost: 2,
            costType: RESOURCE_TYPE.SOUL_SHARDS,
            cooldown: 20,
            instant: true,
            execute: () => {
                if (!this.hasEnoughSoulShards(2)) return;

                this.summonDreadstalkers();
                this.consumeSoulShards(2);

                // 악마의 핵 생성
                this.generateDemonicCore();
            }
        }));

        // 악마 폭군 소환
        this.abilities.set('summon_demonic_tyrant', new Ability({
            name: '악마 폭군 소환',
            cost: 0,
            cooldown: 90,
            instant: true,
            execute: () => {
                this.demonologyMechanics.demonicTyrant = {
                    active: true,
                    duration: 15,
                    damageBonus: 0.15,
                    demonExtension: 15
                };

                // 모든 악마 지속시간 15초 증가
                this.extendAllDemons(15);

                // 폭군 소환
                this.summonDemonicTyrant();

                // 악마 강화
                this.empowerDemons();

                this.applyBuff('demonic_tyrant', {
                    duration: 15,
                    demonDamage: 0.15
                });
            }
        }));

        // 내파
        this.abilities.set('implosion', new Ability({
            name: '내파',
            cost: 0,
            instant: true,
            execute: (target) => {
                if (this.demonArmySystem.imps.length === 0) return;

                const impCount = this.demonArmySystem.imps.length;
                const damagePerImp = this.calculateDamage(3000);

                // 모든 임프 폭발
                this.demonArmySystem.imps.forEach(imp => {
                    this.player.dealDamage(target, damagePerImp, SPELL_SCHOOL.SHADOW);
                });

                // 임프 제거
                this.demonArmySystem.imps = [];

                // 악마의 핵 생성 (임프 5마리당 1개)
                const coresGenerated = Math.floor(impCount / 5);
                for (let i = 0; i < coresGenerated; i++) {
                    this.generateDemonicCore();
                }
            }
        }));

        // 마그테리돈의 마책: 사악한 마귀
        this.abilities.set('grimoire_felguard', new Ability({
            name: '마그테리돈의 마책: 지옥수호병',
            cost: 1,
            costType: RESOURCE_TYPE.SOUL_SHARDS,
            cooldown: 120,
            instant: true,
            execute: () => {
                if (!this.hasEnoughSoulShards(1)) return;

                this.summonGrimoireFelguard();
                this.consumeSoulShards(1);
            }
        }));

        // 악마의 힘
        this.abilities.set('demonic_strength', new Ability({
            name: '악마의 힘',
            cost: 0,
            cooldown: 60,
            instant: true,
            execute: () => {
                // 지옥수호병 강화
                if (this.player.pet && this.player.pet.type === 'felguard') {
                    this.player.pet.empowerAbility('felstorm', {
                        damage: 2.0,
                        radius: 8,
                        duration: 8
                    });
                }

                this.applyBuff('demonic_strength', {
                    duration: 20,
                    petDamage: 4.00,
                    petHealth: 0.20
                });
            }
        }));

        // 힘 착취
        this.abilities.set('power_siphon', new Ability({
            name: '힘 착취',
            cost: 0,
            cooldown: 30,
            instant: true,
            execute: () => {
                const impsToConsume = Math.min(this.demonArmySystem.imps.length, 2);
                if (impsToConsume === 0) return;

                // 임프 소모
                for (let i = 0; i < impsToConsume; i++) {
                    this.demonArmySystem.imps.pop();
                }

                // 악마의 핵 생성
                for (let i = 0; i < impsToConsume * 2; i++) {
                    this.generateDemonicCore();
                }

                // 즉시 시전 버프
                this.applyBuff('demonic_calling', {
                    duration: 20,
                    instantCast: true,
                    charges: impsToConsume
                });
            }
        }));

        // 황천의 문
        this.abilities.set('nether_portal', new Ability({
            name: '황천의 문',
            cost: 1,
            costType: RESOURCE_TYPE.SOUL_SHARDS,
            cooldown: 180,
            castTime: 2.5,
            execute: (position) => {
                if (!this.hasEnoughSoulShards(1)) return;

                this.demonologyMechanics.netherPortal = {
                    active: true,
                    position: position,
                    summonTimer: 0,
                    duration: 15
                };

                this.createNetherPortal(position);
                this.consumeSoulShards(1);
            }
        }));

        // 악마변신
        this.abilities.set('demonic_consumption', new Ability({
            name: '악마 흡수',
            cost: 0,
            cooldown: 30,
            instant: true,
            execute: () => {
                const impCount = this.demonArmySystem.imps.length;
                if (impCount === 0) return;

                // 모든 임프 흡수
                this.demonArmySystem.imps = [];

                // 체력 증가
                const healthGain = impCount * 0.02 * this.player.maxHealth;
                this.player.heal(healthGain);

                // 악마 형상 버프
                this.applyBuff('demonic_consumption', {
                    duration: 15,
                    healthIncrease: 0.15,
                    damageIncrease: impCount * 0.03
                });
            }
        }));
    }

    initializeTalents() {
        // 15 레벨
        this.talents.addTalent('dreadlash', {
            row: 15,
            effects: {
                dreadstalkerDamage: 1.25,
                dreadstalkerCleave: true
            }
        });

        this.talents.addTalent('bilescourge_bombers', {
            row: 15,
            cooldown: 30,
            effects: {
                damage: 2000,
                duration: 6,
                radius: 8
            }
        });

        this.talents.addTalent('demonic_strength', {
            row: 15,
            cooldown: 60,
            effects: {
                felguardDamage: 4.00,
                felguardHealth: 0.20
            }
        });

        // 25 레벨
        this.talents.addTalent('demonic_calling', {
            row: 25,
            effects: {
                dreadstalkersFree: 0.20,
                instantCast: true
            }
        });

        this.talents.addTalent('power_siphon', {
            row: 25,
            cooldown: 30,
            effects: {
                consumeImps: 2,
                coresPerImp: 2
            }
        });

        this.talents.addTalent('doom', {
            row: 25,
            effects: {
                doomDamage: 20000,
                doomDelay: 30,
                shardOnExpire: 3
            }
        });

        // 30 레벨
        this.talents.addTalent('demon_skin', {
            row: 30,
            effects: {
                soulLeechAbsorb: 1.50,
                passiveAbsorb: 0.01
            }
        });

        this.talents.addTalent('burning_rush', {
            row: 30,
            effects: {
                movementSpeed: 0.50,
                healthCost: 0.04
            }
        });

        this.talents.addTalent('dark_pact', {
            row: 30,
            cooldown: 60,
            effects: {
                shield: 0.20,
                sacrificePet: 0.20
            }
        });

        // 35 레벨
        this.talents.addTalent('from_the_shadows', {
            row: 35,
            effects: {
                dreadstalkersDuration: 2,
                dreadstalkersInitialDamage: 1.20
            }
        });

        this.talents.addTalent('soul_strike', {
            row: 35,
            cooldown: 10,
            effects: {
                petAbility: true,
                damage: 5000,
                shardGeneration: 1
            }
        });

        this.talents.addTalent('summon_vilefiend', {
            row: 35,
            cooldown: 45,
            effects: {
                damage: 3000,
                duration: 15,
                bileSpitDamage: 2000
            }
        });

        // 40 레벨
        this.talents.addTalent('darkfury', {
            row: 40,
            effects: {
                stunCooldown: -15,
                fearCooldown: -15
            }
        });

        this.talents.addTalent('mortal_coil', {
            row: 40,
            cooldown: 45,
            effects: {
                damage: 0.20,
                heal: 0.20
            }
        });

        this.talents.addTalent('howl_of_terror', {
            row: 40,
            cooldown: 40,
            effects: {
                fearDuration: 1.5,
                radius: 10
            }
        });

        // 45 레벨
        this.talents.addTalent('soul_conduit', {
            row: 45,
            effects: {
                shardRefund: 0.15
            }
        });

        this.talents.addTalent('inner_demons', {
            row: 45,
            effects: {
                randomDemons: 0.10,
                demonTypes: ['imp', 'dreadstalker', 'bilescourge']
            }
        });

        this.talents.addTalent('grimoire_felguard', {
            row: 45,
            cooldown: 120,
            effects: {
                damage: 5000,
                duration: 17
            }
        });

        // 50 레벨
        this.talents.addTalent('sacrificed_souls', {
            row: 50,
            effects: {
                damagePerDemon: 0.05,
                maxBonus: 0.50
            }
        });

        this.talents.addTalent('demonic_consumption', {
            row: 50,
            cooldown: 30,
            effects: {
                consumeImps: true,
                healthPerImp: 0.02
            }
        });

        this.talents.addTalent('nether_portal', {
            row: 50,
            cooldown: 180,
            effects: {
                portalDuration: 15,
                summonRate: 2
            }
        });
    }

    initializeRotation() {
        this.rotationPriority = [
            // 악마 폭군 (악마가 많을 때)
            {
                ability: 'summon_demonic_tyrant',
                condition: () => this.getDemonCount() >= 6 &&
                                !this.demonologyMechanics.demonicTyrant.active
            },

            // 황천의 문 (특성)
            {
                ability: 'nether_portal',
                condition: () => this.hasTalent('nether_portal') &&
                                this.abilities.get('nether_portal').isReady()
            },

            // 공포사냥개 소환
            {
                ability: 'call_dreadstalkers',
                condition: () => this.hasEnoughSoulShards(2)
            },

            // 굴단의 손 (3 영혼조각)
            {
                ability: 'hand_of_guldan',
                condition: () => this.soulShardSystem.current >= 3
            },

            // 악마 화살 (악마의 핵)
            {
                ability: 'demonbolt',
                condition: () => this.demonicCoreSystem.stacks > 0
            },

            // 빌스커지 폭격수 (특성)
            {
                ability: 'bilescourge_bombers',
                condition: () => this.hasTalent('bilescourge_bombers') &&
                                this.abilities.get('bilescourge_bombers').isReady()
            },

            // 힘 착취 (특성)
            {
                ability: 'power_siphon',
                condition: () => this.hasTalent('power_siphon') &&
                                this.demonArmySystem.imps.length >= 2
            },

            // 굴단의 손 (1-2 영혼조각)
            {
                ability: 'hand_of_guldan',
                condition: () => this.soulShardSystem.current >= 1
            },

            // 암흑 화살 (영혼조각 생성)
            {
                ability: 'shadow_bolt',
                condition: () => true
            }
        ];
    }

    summonImp() {
        const imp = {
            id: Date.now() + Math.random(),
            duration: this.demonArmySystem.impDuration,
            damage: 1500,
            energy: 100,
            attackSpeed: 1.5
        };

        this.demonArmySystem.imps.push(imp);

        // 최대 임프 수 제한
        if (this.demonArmySystem.imps.length > this.demonArmySystem.maxImps) {
            this.demonArmySystem.imps.shift();
        }

        this.player.summon('imp', imp);
    }

    summonDreadstalkers() {
        const dreadstalkers = {
            count: this.demonologyMechanics.callDreadstalkers.count,
            duration: this.demonologyMechanics.callDreadstalkers.duration,
            damage: this.demonologyMechanics.callDreadstalkers.damage
        };

        this.player.summon('dreadstalkers', dreadstalkers);
    }

    summonDemonicTyrant() {
        const tyrant = {
            duration: 15,
            damage: 10000,
            demonfire: 3000,  // AoE 데미지
            auraRadius: 40
        };

        this.demonArmySystem.tyrant = tyrant;
        this.player.summon('demonic_tyrant', tyrant);
    }

    summonGrimoireFelguard() {
        const grimoire = {
            duration: 17,
            damage: 5000,
            felstormDamage: 2000,
            axeTossDamage: 8000
        };

        this.demonArmySystem.grimoire = grimoire;
        this.player.summon('grimoire_felguard', grimoire);
    }

    generateDemonicCore() {
        if (this.demonicCoreSystem.stacks < this.demonicCoreSystem.maxStacks) {
            this.demonicCoreSystem.stacks++;

            this.applyBuff('demonic_core', {
                duration: 20,
                stacks: this.demonicCoreSystem.stacks,
                instantCast: true
            });
        }
    }

    consumeDemonicCore() {
        if (this.demonicCoreSystem.stacks > 0) {
            this.demonicCoreSystem.stacks--;
        }
    }

    extendAllDemons(seconds) {
        // 임프 연장
        this.demonArmySystem.imps.forEach(imp => {
            imp.duration += seconds;
        });

        // 다른 악마들도 연장
        if (this.demonArmySystem.vilefiend) {
            this.demonArmySystem.vilefiend.duration += seconds;
        }
        if (this.demonArmySystem.grimoire) {
            this.demonArmySystem.grimoire.duration += seconds;
        }
    }

    empowerDemons() {
        // 모든 악마 강화
        this.applyBuff('demonic_empowerment', {
            duration: 12,
            health: this.demonEmpowerment.health,
            damage: this.demonEmpowerment.damage,
            hasteReduction: this.demonEmpowerment.hasteReduction
        });
    }

    createNetherPortal(position) {
        // 황천의 문 생성 로직
        const portal = this.demonologyMechanics.netherPortal;

        // 주기적으로 랜덤 악마 소환
        const portalInterval = setInterval(() => {
            if (!portal.active || portal.duration <= 0) {
                clearInterval(portalInterval);
                return;
            }

            // 랜덤 악마 소환
            const demons = ['imp', 'dreadstalker', 'bilescourge'];
            const randomDemon = demons[Math.floor(Math.random() * demons.length)];

            switch (randomDemon) {
                case 'imp':
                    this.summonImp();
                    break;
                case 'dreadstalker':
                    this.summonDreadstalkers();
                    break;
                case 'bilescourge':
                    // 빌스커지 소환 로직
                    break;
            }

            portal.duration--;
        }, 2000);
    }

    getDemonCount() {
        let count = this.demonArmySystem.imps.length;
        if (this.demonArmySystem.vilefiend) count++;
        if (this.demonArmySystem.grimoire) count++;
        if (this.player.pet) count++;
        return count;
    }
}

// ===========================
// 파괴 흑마법사 (Destruction Warlock)
// ===========================
class DestructionWarlock extends Specialization {
    constructor(player) {
        super(player, '파괴');

        // 파괴 특화 스탯
        this.stats = {
            ...this.stats,
            chaosBolt: 2.50,            // 혼돈의 화살 데미지 배수
            conflagrate: 0.15,          // 점화 치명타 보너스
            havoc: 0.60,                // 대혼란 데미지 전이
            mastery: 1.50               // 특화: 혼돈의 불길
        };

        // 파괴 메커니즘
        this.destructionMechanics = {
            havoc: {
                active: false,
                target: null,
                duration: 0,
                cleavePercent: 0.60
            },
            infernal: {
                active: false,
                duration: 0,
                meteorDamage: 15000,
                immolationDamage: 2000
            },
            channelDemonfire: {
                active: false,
                bolts: 15,
                damage: 3000
            },
            darkSoulInstability: {
                active: false,
                critBonus: 0.30,
                duration: 0
            }
        };

        // 백드래프트 시스템
        this.backdraftSystem = {
            stacks: 0,
            maxStacks: 2,
            castTimeReduction: 0.30,
            procOnConflagrate: true
        };

        // 제물 시스템
        this.immolateSystem = {
            targets: new Map(),
            tickDamage: 800,
            tickInterval: 3,
            critBonus: 0.50
        };

        // 역화 시스템
        this.reverseEntropySystem = {
            active: false,
            critFromFire: 0.05,
            maxStacks: 15
        };

        this.initializeAbilities();
        this.initializeTalents();
        this.initializeRotation();
    }

    initializeAbilities() {
        // 소각
        this.abilities.set('incinerate', new Ability({
            name: '소각',
            cost: 2000,
            costType: RESOURCE_TYPE.MANA,
            damage: 7000,
            castTime: 2.0,
            execute: (target) => {
                let damage = this.calculateDamage(7000);
                let castTime = 2.0;

                // 백드래프트 효과
                if (this.backdraftSystem.stacks > 0) {
                    castTime *= (1 - this.backdraftSystem.castTimeReduction);
                    this.backdraftSystem.stacks--;
                }

                this.player.dealDamage(target, damage, SPELL_SCHOOL.FIRE);

                // 영혼 조각 생성
                this.generateSoulShardFragment(2);

                // 대혼란 대상에게도 데미지
                if (this.destructionMechanics.havoc.active &&
                    this.destructionMechanics.havoc.target) {
                    this.player.dealDamage(
                        this.destructionMechanics.havoc.target,
                        damage * this.destructionMechanics.havoc.cleavePercent,
                        SPELL_SCHOOL.FIRE
                    );
                }
            }
        }));

        // 제물
        this.abilities.set('immolate', new Ability({
            name: '제물',
            cost: 1500,
            costType: RESOURCE_TYPE.MANA,
            damage: 1500,
            castTime: 1.5,
            execute: (target) => {
                const initialDamage = this.calculateDamage(1500);
                this.player.dealDamage(target, initialDamage, SPELL_SCHOOL.FIRE);

                const tickDamage = this.calculateDamage(this.immolateSystem.tickDamage);

                this.applyDebuff(target, 'immolate', {
                    duration: 18,
                    tickInterval: this.immolateSystem.tickInterval,
                    tickDamage: tickDamage,
                    onTick: () => this.immolateTick(target),
                    type: BUFF_TYPE.DOT,
                    pandemic: true
                });

                this.immolateSystem.targets.set(target.id, {
                    duration: 18,
                    damage: tickDamage
                });

                // 대혼란 복사
                this.copyToHavocTarget('immolate', target);
            }
        }));

        // 점화
        this.abilities.set('conflagrate', new Ability({
            name: '점화',
            cost: 0,
            damage: 5000,
            instant: true,
            charges: 2,
            cooldown: 13,
            execute: (target) => {
                if (!target.hasDebuff('immolate')) return;

                let damage = this.calculateDamage(5000);

                // 항상 치명타
                damage *= 2;

                this.player.dealDamage(target, damage, SPELL_SCHOOL.FIRE);

                // 백드래프트 생성
                this.generateBackdraft(2);

                // 폭발 속도 버프
                this.applyBuff('conflagrate_speed', {
                    duration: 5,
                    movementSpeed: 1.30
                });

                // 대혼란 복사
                this.copyToHavocTarget('conflagrate', target);
            }
        }));

        // 혼돈의 화살
        this.abilities.set('chaos_bolt', new Ability({
            name: '혼돈의 화살',
            cost: 2,
            costType: RESOURCE_TYPE.SOUL_SHARDS,
            damage: 20000,
            castTime: 3.0,
            execute: (target) => {
                if (!this.hasEnoughSoulShards(2)) return;

                let damage = this.calculateDamage(20000 * this.stats.chaosBolt);
                let castTime = 3.0;

                // 백드래프트 효과
                if (this.backdraftSystem.stacks > 0) {
                    castTime *= (1 - this.backdraftSystem.castTimeReduction);
                    this.backdraftSystem.stacks--;
                }

                // 항상 치명타
                damage *= 2;

                this.player.dealDamage(target, damage, SPELL_SCHOOL.CHAOS);
                this.consumeSoulShards(2);

                // 대혼란 대상에게도 전체 데미지
                if (this.destructionMechanics.havoc.active &&
                    this.destructionMechanics.havoc.target) {
                    this.player.dealDamage(
                        this.destructionMechanics.havoc.target,
                        damage,  // 혼돈의 화살은 100% 복사
                        SPELL_SCHOOL.CHAOS
                    );
                }
            }
        }));

        // 대혼란
        this.abilities.set('havoc', new Ability({
            name: '대혼란',
            cost: 0,
            instant: true,
            cooldown: 45,
            duration: 10,
            execute: (target) => {
                this.destructionMechanics.havoc = {
                    active: true,
                    target: target,
                    duration: 10,
                    cleavePercent: 0.60
                };

                this.applyDebuff(target, 'havoc', {
                    duration: 10,
                    icon: 'havoc'
                });
            }
        }));

        // 지옥불정령 소환
        this.abilities.set('summon_infernal', new Ability({
            name: '지옥불정령 소환',
            cost: 1,
            costType: RESOURCE_TYPE.SOUL_SHARDS,
            cooldown: 180,
            instant: true,
            execute: (position) => {
                if (!this.hasEnoughSoulShards(1)) return;

                this.destructionMechanics.infernal = {
                    active: true,
                    duration: 30,
                    meteorDamage: 15000,
                    immolationDamage: 2000
                };

                // 운석 충돌
                const enemies = this.getEnemiesInArea(position, 8);
                enemies.forEach(enemy => {
                    const damage = this.calculateDamage(15000);
                    this.player.dealDamage(enemy, damage, SPELL_SCHOOL.FIRE);

                    // 기절
                    this.applyDebuff(enemy, 'infernal_stun', {
                        duration: 2,
                        stun: true
                    });
                });

                this.summonInfernal(position);
                this.consumeSoulShards(1);
            }
        }));

        // 암흑불길: 불안정
        this.abilities.set('dark_soul_instability', new Ability({
            name: '암흑불길: 불안정',
            cost: 0,
            cooldown: 120,
            duration: 20,
            execute: () => {
                this.destructionMechanics.darkSoulInstability = {
                    active: true,
                    critBonus: 0.30,
                    duration: 20
                };

                this.applyBuff('dark_soul_instability', {
                    duration: 20,
                    critIncrease: 0.30
                });
            }
        }));

        // 악마의 불 집중
        this.abilities.set('channel_demonfire', new Ability({
            name: '악마의 불 집중',
            cost: 0,
            cooldown: 25,
            channeled: true,
            channelTime: 3,
            execute: () => {
                this.destructionMechanics.channelDemonfire = {
                    active: true,
                    bolts: 15,
                    damage: 3000
                };

                this.startChanneling('channel_demonfire', {
                    duration: 3,
                    tickInterval: 0.2,
                    ticks: 15,
                    onTick: () => this.channelDemonfireTick()
                });
            }
        }));

        // 화염 비
        this.abilities.set('rain_of_fire', new Ability({
            name: '화염 비',
            cost: 3,
            costType: RESOURCE_TYPE.SOUL_SHARDS,
            damage: 1500,
            channeled: true,
            channelTime: 8,
            execute: (position) => {
                if (!this.hasEnoughSoulShards(3)) return;

                this.startChanneling('rain_of_fire', {
                    duration: 8,
                    tickInterval: 1,
                    area: { position: position, radius: 8 },
                    onTick: () => this.rainOfFireTick(position)
                });

                this.consumeSoulShards(3);
            }
        }));

        // 암흑연소
        this.abilities.set('shadowburn', new Ability({
            name: '암흑연소',
            cost: 1,
            costType: RESOURCE_TYPE.SOUL_SHARDS,
            damage: 8000,
            instant: true,
            cooldown: 12,
            execute: (target) => {
                if (!this.hasEnoughSoulShards(1)) return;

                const damage = this.calculateDamage(8000);
                this.player.dealDamage(target, damage, SPELL_SCHOOL.SHADOW);

                // 대상 사망 시 영혼 조각 2개 환급
                if (target.health <= damage) {
                    this.generateSoulShard(2);
                }

                this.consumeSoulShards(1);

                // 대혼란 복사
                this.copyToHavocTarget('shadowburn', target);
            }
        }));

        // 대재앙
        this.abilities.set('cataclysm', new Ability({
            name: '대재앙',
            cost: 0,
            cooldown: 30,
            instant: true,
            execute: (position) => {
                const enemies = this.getEnemiesInArea(position, 8);

                enemies.forEach(enemy => {
                    const damage = this.calculateDamage(10000);
                    this.player.dealDamage(enemy, damage, SPELL_SCHOOL.FIRE);

                    // 제물 자동 적용
                    this.abilities.get('immolate').execute(enemy);
                });

                // 불타는 지면 생성
                this.createBurningGround(position, {
                    duration: 12,
                    tickDamage: 1500,
                    radius: 8
                });
            }
        }));
    }

    initializeTalents() {
        // 15 레벨
        this.talents.addTalent('flashover', {
            row: 15,
            effects: {
                conflagrateCharges: 1,
                backdraftStacks: 1
            }
        });

        this.talents.addTalent('eradication', {
            row: 15,
            effects: {
                debuffDamage: 0.10,
                debuffDuration: 7
            }
        });

        this.talents.addTalent('soul_fire', {
            row: 15,
            cooldown: 45,
            effects: {
                damage: 15000,
                shardGeneration: 1
            }
        });

        // 25 레벨
        this.talents.addTalent('reverse_entropy', {
            row: 25,
            effects: {
                critFromFire: 0.05,
                maxStacks: 15
            }
        });

        this.talents.addTalent('internal_combustion', {
            row: 25,
            effects: {
                immolateExplosion: true,
                explosionDamage: 0.30
            }
        });

        this.talents.addTalent('shadowburn', {
            row: 25,
            cooldown: 12,
            effects: {
                damage: 8000,
                shardRefundOnKill: 2
            }
        });

        // 30 레벨
        this.talents.addTalent('demon_skin', {
            row: 30,
            effects: {
                soulLeechAbsorb: 1.50,
                passiveAbsorb: 0.01
            }
        });

        this.talents.addTalent('burning_rush', {
            row: 30,
            effects: {
                movementSpeed: 0.50,
                healthCost: 0.04
            }
        });

        this.talents.addTalent('dark_pact', {
            row: 30,
            cooldown: 60,
            effects: {
                shield: 0.20,
                sacrificePet: 0.20
            }
        });

        // 35 레벨
        this.talents.addTalent('inferno', {
            row: 35,
            effects: {
                rainOfFireDamage: 0.20,
                infernalSpawn: 0.15
            }
        });

        this.talents.addTalent('fire_and_brimstone', {
            row: 35,
            effects: {
                incinerateCleave: 0.40,
                maxTargets: 3
            }
        });

        this.talents.addTalent('cataclysm', {
            row: 35,
            cooldown: 30,
            effects: {
                damage: 10000,
                applyImmolate: true
            }
        });

        // 40 레벨
        this.talents.addTalent('darkfury', {
            row: 40,
            effects: {
                stunCooldown: -15,
                fearCooldown: -15
            }
        });

        this.talents.addTalent('mortal_coil', {
            row: 40,
            cooldown: 45,
            effects: {
                damage: 0.20,
                heal: 0.20
            }
        });

        this.talents.addTalent('demonic_circle', {
            row: 40,
            effects: {
                teleportRange: 40,
                speedBonus: 0.30
            }
        });

        // 45 레벨
        this.talents.addTalent('roaring_blaze', {
            row: 45,
            effects: {
                conflagrateStackIncrease: 0.25,
                maxStacks: 3
            }
        });

        this.talents.addTalent('rain_of_chaos', {
            row: 45,
            effects: {
                shardSpentInfernal: 0.20,
                infernalDuration: 8
            }
        });

        this.talents.addTalent('grimoire_of_sacrifice', {
            row: 45,
            effects: {
                petSacrifice: true,
                damageBonus: 0.15
            }
        });

        // 50 레벨
        this.talents.addTalent('soul_conduit', {
            row: 50,
            effects: {
                shardRefund: 0.15
            }
        });

        this.talents.addTalent('channel_demonfire', {
            row: 50,
            cooldown: 25,
            effects: {
                bolts: 15,
                damage: 3000
            }
        });

        this.talents.addTalent('dark_soul_instability', {
            row: 50,
            cooldown: 120,
            effects: {
                critIncrease: 0.30,
                duration: 20
            }
        });
    }

    initializeRotation() {
        this.rotationPriority = [
            // 지옥불정령 소환 (버스트)
            {
                ability: 'summon_infernal',
                condition: () => this.isBurstPhase() &&
                                !this.destructionMechanics.infernal.active
            },

            // 암흑불길: 불안정 (버스트)
            {
                ability: 'dark_soul_instability',
                condition: () => this.isBurstPhase() &&
                                !this.destructionMechanics.darkSoulInstability.active
            },

            // 대혼란
            {
                ability: 'havoc',
                condition: (target) => this.hasSecondaryTarget() &&
                                       !this.destructionMechanics.havoc.active
            },

            // 제물 유지
            {
                ability: 'immolate',
                condition: (target) => !target.hasDebuff('immolate') ||
                                       target.debuffDuration('immolate') < 5.4
            },

            // 점화 (백드래프트 생성)
            {
                ability: 'conflagrate',
                condition: (target) => target.hasDebuff('immolate') &&
                                       this.abilities.get('conflagrate').charges > 0
            },

            // 혼돈의 화살 (영혼 조각 소비)
            {
                ability: 'chaos_bolt',
                condition: () => this.soulShardSystem.current >= 2
            },

            // 악마의 불 집중 (특성)
            {
                ability: 'channel_demonfire',
                condition: () => this.hasTalent('channel_demonfire') &&
                                this.abilities.get('channel_demonfire').isReady()
            },

            // 대재앙 (특성, AoE)
            {
                ability: 'cataclysm',
                condition: () => this.hasTalent('cataclysm') &&
                                this.abilities.get('cataclysm').isReady() &&
                                this.getEnemiesInRange(8).length >= 3
            },

            // 화염 비 (AoE)
            {
                ability: 'rain_of_fire',
                condition: () => this.getEnemiesInRange(8).length >= 3 &&
                                this.soulShardSystem.current >= 3
            },

            // 소각 (기본)
            {
                ability: 'incinerate',
                condition: () => true
            }
        ];
    }

    immolateTick(target) {
        // 영혼 조각 생성 확률
        if (Math.random() < 0.15) {
            this.generateSoulShardFragment();
        }
    }

    generateBackdraft(stacks) {
        this.backdraftSystem.stacks = Math.min(
            this.backdraftSystem.stacks + stacks,
            this.backdraftSystem.maxStacks
        );

        this.applyBuff('backdraft', {
            duration: 10,
            stacks: this.backdraftSystem.stacks,
            castTimeReduction: this.backdraftSystem.castTimeReduction
        });
    }

    copyToHavocTarget(spell, originalTarget) {
        if (!this.destructionMechanics.havoc.active ||
            !this.destructionMechanics.havoc.target) return;

        const havocTarget = this.destructionMechanics.havoc.target;
        if (havocTarget.id === originalTarget.id) return;

        // 주문 복사
        setTimeout(() => {
            this.abilities.get(spell)?.execute(havocTarget);
        }, 100);
    }

    channelDemonfireTick() {
        if (this.destructionMechanics.channelDemonfire.bolts <= 0) return;

        // 랜덤 적에게 화살
        const enemies = this.player.sim.getAllEnemies();
        if (enemies.length > 0) {
            const target = enemies[Math.floor(Math.random() * enemies.length)];
            const damage = this.calculateDamage(this.destructionMechanics.channelDemonfire.damage);
            this.player.dealDamage(target, damage, SPELL_SCHOOL.FIRE);
        }

        this.destructionMechanics.channelDemonfire.bolts--;
    }

    rainOfFireTick(position) {
        const enemies = this.getEnemiesInArea(position, 8);

        enemies.forEach(enemy => {
            const damage = this.calculateDamage(1500);
            this.player.dealDamage(enemy, damage, SPELL_SCHOOL.FIRE);
        });

        // 지옥불 조각 소환 확률 (특성)
        if (this.hasTalent('inferno') && Math.random() < 0.15) {
            this.summonInfernalFragment(position);
        }
    }

    summonInfernal(position) {
        const infernal = {
            duration: 30,
            immolationDamage: this.destructionMechanics.infernal.immolationDamage,
            attackDamage: 4000,
            radius: 8
        };

        this.player.summon('infernal', infernal);
    }

    summonInfernalFragment(position) {
        const fragment = {
            duration: 8,
            damage: 1000,
            radius: 5
        };

        this.player.summon('infernal_fragment', fragment);
    }

    createBurningGround(position, options) {
        // 불타는 지면 효과
        this.player.sim.createGroundEffect('burning_ground', {
            position: position,
            radius: options.radius,
            duration: options.duration,
            tickInterval: 1,
            tickDamage: options.tickDamage,
            school: SPELL_SCHOOL.FIRE
        });
    }

    hasSecondaryTarget() {
        return this.player.sim.getAllEnemies().length >= 2;
    }
}

// 내보내기
export {
    AfflictionWarlock,
    DemonologyWarlock,
    DestructionWarlock
};

// 전문화 등록
export function registerWarlockSpecializations(registry) {
    registry.register('warlock', 'affliction', AfflictionWarlock);
    registry.register('warlock', 'demonology', DemonologyWarlock);
    registry.register('warlock', 'destruction', DestructionWarlock);
}