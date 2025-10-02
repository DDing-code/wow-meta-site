// Demon Hunter Specialization Implementations
// Havoc: 근접 DPS 전문화 - 높은 기동성과 악마 변신
// Vengeance: 탱킹 전문화 - 고통 기반 방어와 자가 치유

const { Specialization } = require('../core/Specialization');
const { RESOURCE_TYPES } = require('../core/ResourceSystem');

// Havoc Demon Hunter - 파멸 악마사냥꾼
class HavocDemonHunter extends Specialization {
    constructor(player) {
        super(player, '파멸');

        // 파멸 특화: 높은 기동성과 혼돈 데미지
        this.stats = {
            ...this.stats,
            agility: 1.05,
            criticalStrike: 1.25,
            haste: 1.15,
            mastery: 1.2
        };

        // 격노 시스템
        this.resources[RESOURCE_TYPES.FURY] = {
            current: 0,
            max: 120,
            generationRate: 0
        };

        // 악마 변신 시스템
        this.metamorphosisSystem = {
            active: false,
            duration: 30,
            cooldown: 240,
            hasteBonus: 0.25,
            leechBonus: 0.25,
            damageBonus: 0.2
        };

        // 기세 시스템
        this.momentumSystem = {
            active: false,
            duration: 6,
            damageBonus: 0.15,
            triggers: ['felRush', 'vengefulRetreat']
        };

        // 악마의 일격 리필 시스템
        this.demonsBiteSystem = {
            furyGen: 20,
            furyGenVariance: 10,
            procChance: 0.25
        };

        // 혼돈의 상처 추적
        this.chaosStrikeRefund = {
            chance: 0.4,
            amount: 20
        };

        // 복수심 추적
        this.vengefulRetreatSystem = {
            cooldown: 25,
            furyGen: 0,
            damageBonus: 0
        };

        // 질풍 시스템
        this.felRushSystem = {
            charges: 2,
            maxCharges: 2,
            cooldown: 10,
            damage: 1.5
        };

        // 혼돈 폭발 시스템
        this.chaosNovaSystem = {
            cooldown: 60,
            stunDuration: 2,
            furyGen: 30
        };

        // 눈 광선 시스템
        this.eyeBeamSystem = {
            cooldown: 30,
            duration: 2,
            tickDamage: 0.8,
            furyGen: 30,
            extendMeta: 8
        };

        // 탈태 시스템
        this.blurSystem = {
            active: false,
            cooldown: 60,
            duration: 10,
            dodgeBonus: 0.5,
            damageReduction: 0.2
        };

        this.initializeAbilities();
        this.initializeTalents();
        this.initializeRotation();
    }

    initializeAbilities() {
        // 악마의 이빨
        this.abilities.demonsBite = {
            name: '악마의 이빨',
            cost: 0,
            damage: 1.2,
            cooldown: 0,
            castTime: 0,
            execute: () => {
                const furyGen = this.demonsBiteSystem.furyGen +
                    Math.floor(Math.random() * this.demonsBiteSystem.furyGenVariance);
                this.generateFury(furyGen);
                const damage = this.calculateDamage(this.abilities.demonsBite.damage);

                // 악마의 이빨 추가 타격 확률
                if (Math.random() < this.demonsBiteSystem.procChance) {
                    const bonusDamage = this.calculateDamage(this.abilities.demonsBite.damage * 0.5);
                    return damage + bonusDamage;
                }

                return damage;
            }
        };

        // 혼돈 타격
        this.abilities.chaosStrike = {
            name: '혼돈 타격',
            cost: { fury: 40 },
            damage: 2.8,
            cooldown: 0,
            castTime: 0,
            execute: () => {
                this.consumeFury(40);
                const damage = this.calculateDamage(this.abilities.chaosStrike.damage, 'chaos');

                // 격노 환급 확률
                if (Math.random() < this.chaosStrikeRefund.chance) {
                    this.generateFury(this.chaosStrikeRefund.amount);
                }

                if (this.momentumSystem.active) {
                    return damage * (1 + this.momentumSystem.damageBonus);
                }

                return damage;
            }
        };

        // 칼춤
        this.abilities.bladeDance = {
            name: '칼춤',
            cost: { fury: 35 },
            damage: 1.8,
            cooldown: 9,
            aoe: true,
            execute: () => {
                this.consumeFury(35);
                const damage = this.calculateDamage(this.abilities.bladeDance.damage);

                // 악마에게 추가 데미지
                const demonDamage = damage * 1.5;

                if (this.momentumSystem.active) {
                    return damage * (1 + this.momentumSystem.damageBonus);
                }

                return damage;
            }
        };

        // 눈 광선
        this.abilities.eyeBeam = {
            name: '눈 광선',
            cost: { fury: 30 },
            damage: 0.8,
            cooldown: 30,
            duration: 2,
            channeled: true,
            execute: () => {
                this.consumeFury(30);
                let totalDamage = 0;
                const tickCount = 10;

                for (let i = 0; i < tickCount; i++) {
                    setTimeout(() => {
                        const tickDamage = this.calculateDamage(this.abilities.eyeBeam.damage, 'chaos');
                        this.dealDamage(tickDamage);
                        totalDamage += tickDamage;
                    }, i * 200);
                }

                // 악마 변신 연장
                if (this.metamorphosisSystem.active) {
                    this.extendMetamorphosis(this.eyeBeamSystem.extendMeta);
                }

                // 눈 광선 중 격노 생성
                setTimeout(() => {
                    this.generateFury(this.eyeBeamSystem.furyGen);
                }, 2000);

                return totalDamage;
            }
        };

        // 질풍
        this.abilities.felRush = {
            name: '질풍',
            charges: 2,
            damage: 1.5,
            cooldown: 10,
            execute: () => {
                if (this.felRushSystem.charges > 0) {
                    this.felRushSystem.charges--;
                    const damage = this.calculateDamage(this.abilities.felRush.damage);
                    this.triggerMomentum();

                    // 충전 재생성
                    setTimeout(() => {
                        if (this.felRushSystem.charges < this.felRushSystem.maxCharges) {
                            this.felRushSystem.charges++;
                        }
                    }, this.abilities.felRush.cooldown * 1000);

                    return damage;
                }
                return 0;
            }
        };

        // 복수의 퇴각
        this.abilities.vengefulRetreat = {
            name: '복수의 퇴각',
            cooldown: 25,
            damage: 0.8,
            execute: () => {
                const damage = this.calculateDamage(this.abilities.vengefulRetreat.damage);
                this.triggerMomentum();

                // 위치 재조정 효과
                this.applyPositionReset();

                return damage;
            }
        };

        // 악마 변신
        this.abilities.metamorphosis = {
            name: '악마 변신',
            cooldown: 240,
            duration: 30,
            execute: () => {
                this.metamorphosisSystem.active = true;
                this.updateStats({
                    haste: 1 + this.metamorphosisSystem.hasteBonus,
                    leech: 1 + this.metamorphosisSystem.leechBonus
                });

                // 즉시 점프 공격
                const leapDamage = this.calculateDamage(3.0, 'chaos');
                this.dealDamage(leapDamage);

                setTimeout(() => {
                    this.metamorphosisSystem.active = false;
                    this.updateStats({
                        haste: 1,
                        leech: 1
                    });
                }, this.abilities.metamorphosis.duration * 1000);

                return leapDamage;
            }
        };

        // 혼돈 폭발
        this.abilities.chaosNova = {
            name: '혼돈 폭발',
            cost: { fury: 30 },
            cooldown: 60,
            stunDuration: 2,
            execute: () => {
                this.consumeFury(30);
                this.applyStun(this.abilities.chaosNova.stunDuration);
                const damage = this.calculateDamage(1.2);
                return damage;
            }
        };

        // 탈태
        this.abilities.blur = {
            name: '탈태',
            cooldown: 60,
            duration: 10,
            execute: () => {
                this.blurSystem.active = true;
                this.updateStats({
                    dodge: 1 + this.blurSystem.dodgeBonus,
                    damageReduction: 1 - this.blurSystem.damageReduction
                });

                setTimeout(() => {
                    this.blurSystem.active = false;
                    this.updateStats({
                        dodge: 1,
                        damageReduction: 1
                    });
                }, this.abilities.blur.duration * 1000);

                return true;
            }
        };

        // 어둠의 속박
        this.abilities.darkness = {
            name: '어둠의 속박',
            cooldown: 180,
            duration: 8,
            avoidChance: 0.2,
            execute: () => {
                this.applyDarknessZone(this.abilities.darkness.avoidChance);
                return true;
            }
        };

        // 악마의 낙인
        this.abilities.demonsBrand = {
            name: '악마의 낙인',
            cooldown: 90,
            duration: 30,
            execute: () => {
                const brandDamage = this.calculateDamage(2.0);
                this.applyDebuff('demonsBrand', {
                    duration: 30,
                    damageIncrease: 0.25
                });
                return brandDamage;
            }
        };
    }

    initializeTalents() {
        // 15레벨
        this.talents.blindFury = {
            name: '눈먼 격노',
            level: 15,
            effect: () => {
                this.eyeBeamSystem.furyGen = 50;
                this.abilities.eyeBeam.cost.fury = 0;
            }
        };

        this.talents.demonic = {
            name: '악마',
            level: 15,
            metaDuration: 6,
            effect: () => {
                // 눈 광선 후 악마 변신
            }
        };

        this.talents.felblade = {
            name: '지옥칼',
            level: 15,
            damage: 2.0,
            furyGen: 40,
            cooldown: 15
        };

        // 25레벨
        this.talents.insatiableHunger = {
            name: '만족할 줄 모르는 굶주림',
            level: 25,
            furyGenBonus: 0.5
        };

        this.talents.burningHatred = {
            name: '불타는 증오',
            level: 25,
            immolationAuraFury: 4
        };

        this.talents.demonBlades = {
            name: '악마 칼날',
            level: 25,
            procChance: 0.75,
            furyGen: 12
        };

        // 30레벨
        this.talents.trailOfRuin = {
            name: '파멸의 흔적',
            level: 30,
            dotDamage: 0.3,
            duration: 4
        };

        this.talents.unboundChaos = {
            name: '속박되지 않은 혼돈',
            level: 30,
            felRushDamage: 2.5
        };

        this.talents.glideSpeed = {
            name: '활공 속도',
            level: 30,
            speedIncrease: 0.5
        };

        // 35레벨
        this.talents.soulRending = {
            name: '영혼 갈취',
            level: 35,
            leechIncrease: 0.1,
            metaLeech: 0.25
        };

        this.talents.desperateInstincts = {
            name: '절박한 본능',
            level: 35,
            autoBlur: 0.35
        };

        this.talents.netherwalk = {
            name: '황천걸음',
            level: 35,
            duration: 5,
            speedBonus: 1.0,
            cooldown: 120
        };

        // 40레벨
        this.talents.cycleOfHatred = {
            name: '증오의 순환',
            level: 40,
            chaosStrikeFury: 5
        };

        this.talents.firstBlood = {
            name: '선제 공격',
            level: 40,
            bladeDanceFury: 5,
            damageBonus: 0.5
        };

        this.talents.essenceBreak = {
            name: '정수 파괴',
            level: 40,
            damage: 3.2,
            debuffDuration: 4,
            damageIncrease: 0.65,
            cooldown: 20
        };

        // 45레벨
        this.talents.unleashed = {
            name: '해방',
            level: 45,
            consumeMagic: 20
        };

        this.talents.masterOfTheGlaive = {
            name: '글레이브의 달인',
            level: 45,
            throwGlaiveCharges: 2,
            slowEffect: 0.3
        };

        this.talents.felEruption = {
            name: '지옥 분출',
            level: 45,
            damage: 2.5,
            stunDuration: 4,
            cooldown: 30
        };

        // 50레벨
        this.talents.momentum = {
            name: '기세',
            level: 50,
            implemented: true
        };

        this.talents.felBarrage = {
            name: '지옥 포화',
            level: 50,
            damage: 0.5,
            duration: 3,
            cooldown: 60
        };

        this.talents.demonic2 = {
            name: '악마 강화',
            level: 50,
            metaDurationBonus: 8,
            hasteBonus: 0.15
        };
    }

    initializeRotation() {
        this.rotation = [
            { ability: 'metamorphosis', condition: () => this.isMajorBurstWindow() },
            { ability: 'eyeBeam', condition: () => this.isOffCooldown('eyeBeam') },
            { ability: 'essenceBreak', condition: () => this.hasTalent('essenceBreak') && this.isOffCooldown('essenceBreak') },
            { ability: 'bladeDance', condition: () => this.isOffCooldown('bladeDance') && (this.isAoE() || this.resources[RESOURCE_TYPES.FURY].current >= 75) },
            { ability: 'chaosStrike', condition: () => this.resources[RESOURCE_TYPES.FURY].current >= 40 },
            { ability: 'felRush', condition: () => this.felRushSystem.charges > 1 && this.needsMomentum() },
            { ability: 'demonsBite', condition: () => this.resources[RESOURCE_TYPES.FURY].current < 70 },
            { ability: 'chaosNova', condition: () => this.needsStun() },
            { ability: 'blur', condition: () => this.needsSurvivalCooldown() }
        ];
    }

    generateFury(amount) {
        this.resources[RESOURCE_TYPES.FURY].current = Math.min(
            this.resources[RESOURCE_TYPES.FURY].current + amount,
            this.resources[RESOURCE_TYPES.FURY].max
        );
    }

    consumeFury(amount) {
        if (this.resources[RESOURCE_TYPES.FURY].current >= amount) {
            this.resources[RESOURCE_TYPES.FURY].current -= amount;
            return true;
        }
        return false;
    }

    triggerMomentum() {
        if (this.hasTalent('momentum')) {
            this.momentumSystem.active = true;
            setTimeout(() => {
                this.momentumSystem.active = false;
            }, this.momentumSystem.duration * 1000);
        }
    }

    needsMomentum() {
        return this.hasTalent('momentum') && !this.momentumSystem.active;
    }

    extendMetamorphosis(seconds) {
        if (this.metamorphosisSystem.active) {
            // 악마 변신 연장 로직
        }
    }
}

// Vengeance Demon Hunter - 복수 악마사냥꾼
class VengeanceDemonHunter extends Specialization {
    constructor(player) {
        super(player, '복수');

        // 복수 특화: 고통 기반 방어
        this.stats = {
            ...this.stats,
            stamina: 1.65,
            armor: 1.4,
            versatility: 1.1,
            damageReduction: 0.8
        };

        // 격노 시스템
        this.resources[RESOURCE_TYPES.FURY] = {
            current: 0,
            max: 120,
            generationRate: 0
        };

        // 고통 시스템
        this.resources[RESOURCE_TYPES.PAIN] = {
            current: 0,
            max: 100,
            generationRate: 0
        };

        // 악마 쐐기 시스템
        this.demonSpikesSystem = {
            charges: 2,
            maxCharges: 2,
            cooldown: 20,
            duration: 6,
            armorBonus: 0.85,
            parryBonus: 0.15
        };

        // 영혼 파편 시스템
        this.soulFragmentSystem = {
            fragments: [],
            maxFragments: 5,
            healPerFragment: 0.08,
            painPerFragment: 10
        };

        // 불타는 낙인 시스템
        this.fieryBrandSystem = {
            cooldown: 60,
            duration: 8,
            damageReduction: 0.4,
            spreadChance: 0.15
        };

        // 주입된 힘 시스템
        this.infernalStrikeSystem = {
            charges: 2,
            maxCharges: 2,
            cooldown: 20,
            damage: 1.2
        };

        // 악마 변신 시스템
        this.metamorphosisVengeanceSystem = {
            active: false,
            duration: 15,
            cooldown: 180,
            armorBonus: 1.0,
            healthBonus: 0.3,
            painGen: 7
        };

        // 영혼 방벽 시스템
        this.soulBarrierSystem = {
            active: false,
            absorb: 0,
            maxAbsorb: 0,
            duration: 12
        };

        // 악마 감옥 시스템
        this.imprisonSystem = {
            cooldown: 45,
            duration: 60,
            breakOnDamage: true
        };

        this.initializeAbilities();
        this.initializeTalents();
        this.initializeRotation();
    }

    initializeAbilities() {
        // 전단
        this.abilities.shear = {
            name: '전단',
            cost: 0,
            damage: 1.0,
            painGen: 10,
            cooldown: 0,
            castTime: 0,
            execute: () => {
                const damage = this.calculateDamage(this.abilities.shear.damage);
                this.generatePain(this.abilities.shear.painGen);

                // 영혼 파편 생성 확률
                if (Math.random() < 0.15) {
                    this.createSoulFragment();
                }

                return damage;
            }
        };

        // 영혼 베어먹기
        this.abilities.soulCleave = {
            name: '영혼 베어먹기',
            cost: { pain: 30 },
            damage: 1.8,
            cooldown: 0,
            castTime: 0,
            execute: () => {
                this.consumePain(30);
                const damage = this.calculateDamage(this.abilities.soulCleave.damage);

                // 모든 영혼 파편 소모
                const fragments = this.soulFragmentSystem.fragments.length;
                const healing = fragments * this.soulFragmentSystem.healPerFragment * this.stats.maxHealth;
                this.healSelf(healing);
                this.soulFragmentSystem.fragments = [];

                return { damage, healing };
            }
        };

        // 악마 쐐기
        this.abilities.demonSpikes = {
            name: '악마 쐐기',
            charges: 2,
            cooldown: 20,
            duration: 6,
            execute: () => {
                if (this.demonSpikesSystem.charges > 0) {
                    this.demonSpikesSystem.charges--;
                    this.updateStats({
                        armor: 1 + this.demonSpikesSystem.armorBonus,
                        parry: 1 + this.demonSpikesSystem.parryBonus
                    });

                    setTimeout(() => {
                        this.updateStats({
                            armor: 1,
                            parry: 1
                        });
                    }, this.abilities.demonSpikes.duration * 1000);

                    // 충전 재생성
                    setTimeout(() => {
                        if (this.demonSpikesSystem.charges < this.demonSpikesSystem.maxCharges) {
                            this.demonSpikesSystem.charges++;
                        }
                    }, this.abilities.demonSpikes.cooldown * 1000);

                    return true;
                }
                return false;
            }
        };

        // 주입된 힘
        this.abilities.infernalStrike = {
            name: '주입된 힘',
            charges: 2,
            cooldown: 20,
            damage: 1.2,
            execute: () => {
                if (this.infernalStrikeSystem.charges > 0) {
                    this.infernalStrikeSystem.charges--;
                    const damage = this.calculateDamage(this.abilities.infernalStrike.damage);

                    // 시길 생성
                    this.createSigil('flame', 2);

                    // 충전 재생성
                    setTimeout(() => {
                        if (this.infernalStrikeSystem.charges < this.infernalStrikeSystem.maxCharges) {
                            this.infernalStrikeSystem.charges++;
                        }
                    }, this.abilities.infernalStrike.cooldown * 1000);

                    return damage;
                }
                return 0;
            }
        };

        // 영혼 파괴
        this.abilities.spiritBomb = {
            name: '영혼 파괴',
            cost: { fragments: 4 },
            damage: 2.5,
            cooldown: 0,
            execute: () => {
                if (this.soulFragmentSystem.fragments.length >= 4) {
                    const fragments = this.soulFragmentSystem.fragments.splice(0, 4);
                    const damage = this.calculateDamage(this.abilities.spiritBomb.damage);

                    // 디버프 적용
                    this.applyDebuff('frailty', {
                        duration: 20,
                        healingIncrease: 0.15,
                        damageIncrease: 0.15
                    });

                    return damage;
                }
                return 0;
            }
        };

        // 불타는 낙인
        this.abilities.fieryBrand = {
            name: '불타는 낙인',
            cooldown: 60,
            duration: 8,
            execute: () => {
                const damage = this.calculateDamage(1.5, 'fire');
                this.applyDebuff('fieryBrand', {
                    duration: this.fieryBrandSystem.duration,
                    damageReduction: this.fieryBrandSystem.damageReduction
                });
                return damage;
            }
        };

        // 악마 변신 (복수)
        this.abilities.metamorphosisVengeance = {
            name: '악마 변신',
            cooldown: 180,
            duration: 15,
            execute: () => {
                this.metamorphosisVengeanceSystem.active = true;
                const bonusHealth = this.stats.maxHealth * this.metamorphosisVengeanceSystem.healthBonus;
                this.stats.maxHealth += bonusHealth;
                this.stats.currentHealth += bonusHealth;
                this.updateStats({
                    armor: 2.0
                });

                // 도약 충격 데미지
                const leapDamage = this.calculateDamage(4.0, 'fire');
                this.dealDamage(leapDamage);

                // 악마 변신 중 고통 생성
                const painGeneration = setInterval(() => {
                    this.generatePain(this.metamorphosisVengeanceSystem.painGen);
                }, 1000);

                setTimeout(() => {
                    clearInterval(painGeneration);
                    this.metamorphosisVengeanceSystem.active = false;
                    this.stats.maxHealth -= bonusHealth;
                    if (this.stats.currentHealth > this.stats.maxHealth) {
                        this.stats.currentHealth = this.stats.maxHealth;
                    }
                    this.updateStats({
                        armor: 1
                    });
                }, this.abilities.metamorphosisVengeance.duration * 1000);

                return leapDamage;
            }
        };

        // 시길: 화염
        this.abilities.sigilOfFlame = {
            name: '시길: 화염',
            cooldown: 30,
            damage: 1.2,
            duration: 2,
            execute: () => {
                setTimeout(() => {
                    const damage = this.calculateDamage(this.abilities.sigilOfFlame.damage, 'fire');
                    this.dealDamage(damage);
                }, 2000);
                return true;
            }
        };

        // 시길: 침묵
        this.abilities.sigilOfSilence = {
            name: '시길: 침묵',
            cooldown: 60,
            duration: 2,
            silenceDuration: 2,
            execute: () => {
                setTimeout(() => {
                    this.applySilence(this.abilities.sigilOfSilence.silenceDuration);
                }, 2000);
                return true;
            }
        };

        // 시길: 사슬
        this.abilities.sigilOfChains = {
            name: '시길: 사슬',
            cooldown: 90,
            duration: 2,
            pullRadius: 8,
            execute: () => {
                setTimeout(() => {
                    this.pullEnemies(this.abilities.sigilOfChains.pullRadius);
                    this.applySlowEffect(0.7, 3);
                }, 2000);
                return true;
            }
        };

        // 시길: 불행
        this.abilities.sigilOfMisery = {
            name: '시길: 불행',
            cooldown: 60,
            duration: 2,
            fearDuration: 2,
            execute: () => {
                setTimeout(() => {
                    this.applyFear(this.abilities.sigilOfMisery.fearDuration);
                }, 2000);
                return true;
            }
        };

        // 악마 감옥
        this.abilities.imprison = {
            name: '악마 감옥',
            cooldown: 45,
            duration: 60,
            execute: () => {
                this.applyIncapacitate(this.abilities.imprison.duration);
                return true;
            }
        };

        // 고통 소비
        this.abilities.consumeMagic = {
            name: '고통 소비',
            cooldown: 10,
            furyGen: 20,
            execute: () => {
                const dispelled = this.dispelMagic();
                if (dispelled) {
                    this.generateFury(this.abilities.consumeMagic.furyGen);
                }
                return dispelled;
            }
        };
    }

    initializeTalents() {
        // 15레벨
        this.talents.agonizingFlames = {
            name: '고통의 불길',
            level: 15,
            immolationDamage: 0.5
        };

        this.talents.razorSpikes = {
            name: '면도날 쐐기',
            level: 15,
            reflectDamage: 0.15
        };

        this.talents.feastOfSouls = {
            name: '영혼의 향연',
            level: 15,
            soulCleaveheal: 0.25
        };

        // 25레벨
        this.talents.fallout = {
            name: '낙진',
            level: 25,
            shearFragments: 0.6
        };

        this.talents.burningAlive = {
            name: '타오르는 생명',
            level: 25,
            spreadRange: 8
        };

        this.talents.charredFlesh = {
            name: '그을린 살점',
            level: 25,
            brandDuration: 2
        };

        // 30레벨
        this.talents.infernalArmor = {
            name: '지옥불 갑옷',
            level: 30,
            armorBonus: 0.2
        };

        this.talents.auraOfPain = {
            name: '고통의 오라',
            level: 30,
            cooldown: 30,
            duration: 20
        };

        this.talents.felDevastation = {
            name: '지옥 황폐',
            level: 30,
            damage: 1.0,
            channelTime: 2,
            cooldown: 60
        };

        // 35레벨
        this.talents.soulBarrier = {
            name: '영혼 방벽',
            level: 35,
            absorb: 0.12,
            duration: 12,
            cooldown: 30
        };

        this.talents.feedTheDemon = {
            name: '악마 먹이기',
            level: 35,
            cooldownReduction: 0.5
        };

        this.talents.fracture = {
            name: '골절',
            level: 35,
            damage: 0.8,
            painGen: 25,
            fragments: 2
        };

        // 40레벨
        this.talents.concentrated = {
            name: '집중된 시길',
            level: 40,
            sigilDuration: 2,
            sigilDamage: 0.5
        };

        this.talents.quickenedSigils = {
            name: '신속한 시길',
            level: 40,
            activationTime: 1
        };

        this.talents.sigilOfChains = {
            name: '시길: 사슬',
            level: 40,
            implemented: true
        };

        // 45레벨
        this.talents.gluttony = {
            name: '폭식',
            level: 45,
            cooldownReduction: 3
        };

        this.talents.spiritBomb = {
            name: '영혼 파괴',
            level: 45,
            implemented: true
        };

        this.talents.felDevastation2 = {
            name: '강화된 지옥 황폐',
            level: 45,
            healingIncrease: 0.5
        };

        // 50레벨
        this.talents.lastResort = {
            name: '최후의 수단',
            level: 50,
            triggerHealth: 0.3,
            cooldown: 180
        };

        this.talents.voidReaver = {
            name: '공허 약탈자',
            level: 50,
            debuffDuration: 12,
            damageIncrease: 0.05
        };

        this.talents.soulRending2 = {
            name: '영혼 찢기',
            level: 50,
            leechIncrease: 0.1,
            metaLeech: 0.3
        };
    }

    initializeRotation() {
        this.rotation = [
            { ability: 'demonSpikes', condition: () => this.incomingDamageHigh() && this.demonSpikesSystem.charges > 0 },
            { ability: 'metamorphosisVengeance', condition: () => this.needsMajorDefensive() },
            { ability: 'fieryBrand', condition: () => this.needsDamageReduction() },
            { ability: 'spiritBomb', condition: () => this.soulFragmentSystem.fragments.length >= 4 },
            { ability: 'soulCleave', condition: () => this.resources[RESOURCE_TYPES.PAIN].current >= 80 || this.needsHealing() },
            { ability: 'infernalStrike', condition: () => this.infernalStrikeSystem.charges === 2 },
            { ability: 'sigilOfFlame', condition: () => this.isOffCooldown('sigilOfFlame') },
            { ability: 'shear', condition: () => this.resources[RESOURCE_TYPES.PAIN].current < 70 },
            { ability: 'sigilOfChains', condition: () => this.needsGrouping() && this.hasTalent('sigilOfChains') }
        ];
    }

    generatePain(amount) {
        this.resources[RESOURCE_TYPES.PAIN].current = Math.min(
            this.resources[RESOURCE_TYPES.PAIN].current + amount,
            this.resources[RESOURCE_TYPES.PAIN].max
        );
    }

    consumePain(amount) {
        if (this.resources[RESOURCE_TYPES.PAIN].current >= amount) {
            this.resources[RESOURCE_TYPES.PAIN].current -= amount;
            return true;
        }
        return false;
    }

    createSoulFragment() {
        if (this.soulFragmentSystem.fragments.length < this.soulFragmentSystem.maxFragments) {
            this.soulFragmentSystem.fragments.push({
                created: Date.now(),
                value: 1
            });
        }
    }

    createSigil(type, delay) {
        // 시길 생성 로직
        setTimeout(() => {
            switch(type) {
                case 'flame':
                    const damage = this.calculateDamage(1.2, 'fire');
                    this.dealDamage(damage);
                    break;
                case 'silence':
                    this.applySilence(2);
                    break;
                case 'chains':
                    this.pullEnemies(8);
                    break;
                case 'misery':
                    this.applyFear(2);
                    break;
            }
        }, delay * 1000);
    }

    incomingDamageHigh() {
        // 높은 피해 감지 로직
        return this.stats.currentHealth < this.stats.maxHealth * 0.7;
    }

    needsMajorDefensive() {
        return this.stats.currentHealth < this.stats.maxHealth * 0.3;
    }

    needsDamageReduction() {
        return this.stats.currentHealth < this.stats.maxHealth * 0.5;
    }

    needsHealing() {
        return this.stats.currentHealth < this.stats.maxHealth * 0.6;
    }

    needsGrouping() {
        return this.isAoE() && this.enemyCount > 3;
    }
}

module.exports = {
    HavocDemonHunter,
    VengeanceDemonHunter
};