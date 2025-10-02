// Monk Specialization Implementations
// Brewmaster: 탱킹 전문화 - 시간차 피해와 양조
// Windwalker: 근접 DPS 전문화 - 기 와 연계 기술
// Mistweaver: 치유 전문화 - 안개와 차 치유

const { Specialization } = require('../core/Specialization');
const { RESOURCE_TYPES } = require('../core/ResourceSystem');

// Brewmaster Monk - 양조 수도사
class BrewmasterMonk extends Specialization {
    constructor(player) {
        super(player, '양조');

        // 양조 특화: 시간차 피해
        this.stats = {
            ...this.stats,
            stamina: 1.45,
            armor: 1.1,
            versatility: 1.15,
            damageReduction: 0.8
        };

        // 기력 시스템
        this.resources[RESOURCE_TYPES.ENERGY] = {
            current: 100,
            max: 100,
            regenRate: 10
        };

        // 시간차 시스템
        this.staggerSystem = {
            currentStagger: 0,
            maxStagger: 0,
            lightThreshold: 0.3,
            moderateThreshold: 0.6,
            heavyThreshold: 0.9,
            duration: 10,
            tickRate: 0.5
        };

        // 양조 시스템
        this.brewSystem = {
            ironskinCharges: 3,
            purifyingCharges: 3,
            maxCharges: 3,
            chargeTime: 15
        };

        // 천둥차 시스템
        this.kegSmashSystem = {
            cooldown: 8,
            damage: 2.5,
            brewReduction: 3,
            threatModifier: 4
        };

        // 옥 불꽃 시스템
        this.jadeFireSystem = {
            active: false,
            stacks: 0,
            maxStacks: 5,
            damageReduction: 0.03
        };

        // 기의 샘 시스템
        this.energyRegenSystem = {
            base: 10,
            hasteMultiplier: 1.0,
            bonusRegen: 0
        };

        // 술안개 도트 추적
        this.breathOfFireTargets = new Map();

        // 천국의 불꽃 시스템
        this.celestialFlamesSystem = {
            active: false,
            duration: 6,
            damageBonus: 0.3
        };

        // 흑우 시스템
        this.blackOxBrewSystem = {
            stacks: 0,
            maxStacks: 200,
            healPerStack: 0.01
        };

        this.initializeAbilities();
        this.initializeTalents();
        this.initializeRotation();
    }

    initializeAbilities() {
        // 범의 장풍
        this.abilities.tigerPalm = {
            name: '범의 장풍',
            cost: { energy: 25 },
            damage: 1.2,
            brewReduction: 1,
            execute: () => {
                this.consumeEnergy(25);
                const damage = this.calculateDamage(this.abilities.tigerPalm.damage);
                this.reduceBrew(this.abilities.tigerPalm.brewReduction);
                return damage;
            }
        };

        // 맥주통 휘두르기
        this.abilities.kegSmash = {
            name: '맥주통 휘두르기',
            cooldown: 8,
            damage: 2.5,
            radius: 8,
            brewReduction: 3,
            execute: () => {
                const damage = this.calculateDamage(this.abilities.kegSmash.damage);
                this.reduceBrew(this.kegSmashSystem.brewReduction);
                this.applySlowEffect(0.2, 15);
                this.generateThreat(damage * this.kegSmashSystem.threatModifier);
                return damage;
            }
        };

        // 후려차기
        this.abilities.blackoutKick = {
            name: '후려차기',
            cost: { energy: 30 },
            damage: 1.8,
            brewReduction: 1,
            shuffleDuration: 3,
            execute: () => {
                this.consumeEnergy(30);
                const damage = this.calculateDamage(this.abilities.blackoutKick.damage);
                this.reduceBrew(1);
                this.applyShuffle(this.abilities.blackoutKick.shuffleDuration);
                return damage;
            }
        };

        // 불의 숨결
        this.abilities.breathOfFire = {
            name: '불의 숨결',
            cooldown: 15,
            damage: 1.5,
            dotDamage: 0.2,
            duration: 12,
            execute: () => {
                const damage = this.calculateDamage(this.abilities.breathOfFire.damage, 'fire');
                this.applyBreathOfFireDoT();

                // 맥주통 휘두르기 대상에게 추가 디버프
                if (this.hasKegSmashDebuff()) {
                    this.applyFireDebuff(0.05, 12);
                }

                return damage;
            }
        };

        // 강철 가죽
        this.abilities.ironskinBrew = {
            name: '강철 가죽',
            charges: 3,
            cooldown: 15,
            duration: 7,
            staggerBonus: 0.4,
            execute: () => {
                if (this.brewSystem.ironskinCharges > 0) {
                    this.brewSystem.ironskinCharges--;
                    this.increaseStaggerCap(this.abilities.ironskinBrew.staggerBonus);

                    setTimeout(() => {
                        this.resetStaggerCap();
                    }, this.abilities.ironskinBrew.duration * 1000);

                    // 충전 재생성
                    setTimeout(() => {
                        if (this.brewSystem.ironskinCharges < this.brewSystem.maxCharges) {
                            this.brewSystem.ironskinCharges++;
                        }
                    }, this.abilities.ironskinBrew.cooldown * 1000);

                    return true;
                }
                return false;
            }
        };

        // 정화주
        this.abilities.purifyingBrew = {
            name: '정화주',
            charges: 3,
            cooldown: 15,
            purifyPercent: 0.5,
            execute: () => {
                if (this.brewSystem.purifyingCharges > 0) {
                    this.brewSystem.purifyingCharges--;
                    const purified = this.staggerSystem.currentStagger * this.abilities.purifyingBrew.purifyPercent;
                    this.staggerSystem.currentStagger -= purified;

                    // 충전 재생성
                    setTimeout(() => {
                        if (this.brewSystem.purifyingCharges < this.brewSystem.maxCharges) {
                            this.brewSystem.purifyingCharges++;
                        }
                    }, this.abilities.purifyingBrew.cooldown * 1000);

                    return purified;
                }
                return 0;
            }
        };

        // 천상의 양조
        this.abilities.celestialBrew = {
            name: '천상의 양조',
            cooldown: 60,
            absorb: 0.35,
            duration: 8,
            execute: () => {
                const absorbAmount = this.stats.maxHealth * this.abilities.celestialBrew.absorb;
                this.applyAbsorb(absorbAmount);

                // 흑우 중첩 기반 추가 흡수
                if (this.blackOxBrewSystem.stacks > 0) {
                    const bonusAbsorb = this.blackOxBrewSystem.stacks * this.blackOxBrewSystem.healPerStack * this.stats.maxHealth;
                    this.applyAbsorb(bonusAbsorb);
                    this.blackOxBrewSystem.stacks = 0;
                }

                return absorbAmount;
            }
        };

        // 선의 요새
        this.abilities.fortifyingBrew = {
            name: '선의 요새',
            cooldown: 360,
            duration: 15,
            damageReduction: 0.2,
            healthBonus: 0.2,
            execute: () => {
                const bonusHealth = this.stats.maxHealth * this.abilities.fortifyingBrew.healthBonus;
                this.stats.maxHealth += bonusHealth;
                this.stats.currentHealth += bonusHealth;
                this.applyDamageReduction(this.abilities.fortifyingBrew.damageReduction);

                setTimeout(() => {
                    this.stats.maxHealth -= bonusHealth;
                    if (this.stats.currentHealth > this.stats.maxHealth) {
                        this.stats.currentHealth = this.stats.maxHealth;
                    }
                    this.removeDamageReduction();
                }, this.abilities.fortifyingBrew.duration * 1000);

                return true;
            }
        };

        // 해오름 차기
        this.abilities.risingSunKick = {
            name: '해오름 차기',
            cost: { energy: 40 },
            damage: 2.8,
            cooldown: 10,
            debuffDuration: 15,
            execute: () => {
                this.consumeEnergy(40);
                const damage = this.calculateDamage(this.abilities.risingSunKick.damage);
                this.applyMortalStrike(0.1, this.abilities.risingSunKick.debuffDuration);
                return damage;
            }
        };

        // 회전 학다리차기
        this.abilities.spinningCraneKick = {
            name: '회전 학다리차기',
            cost: { energy: 25 },
            damage: 1.0,
            channelTime: 1.5,
            aoe: true,
            execute: () => {
                this.consumeEnergy(25);
                let totalDamage = 0;
                const ticks = 4;

                for (let i = 0; i < ticks; i++) {
                    setTimeout(() => {
                        const damage = this.calculateDamage(this.abilities.spinningCraneKick.damage / ticks);
                        this.dealDamage(damage);
                        totalDamage += damage;

                        // 범위 내 적마다 셔플 지속시간 증가
                        this.extendShuffle(0.5);
                    }, i * 375);
                }

                return totalDamage;
            }
        };

        // 폭발 술통
        this.abilities.explodingKeg = {
            name: '폭발 술통',
            cooldown: 60,
            damage: 3.0,
            radius: 8,
            execute: () => {
                const damage = this.calculateDamage(this.abilities.explodingKeg.damage, 'fire');
                this.applyFireDebuff(0.1, 3);
                this.applySlowEffect(0.5, 3);
                return damage;
            }
        };
    }

    initializeTalents() {
        // 15레벨
        this.talents.eyeOfTheTiger = {
            name: '범의 눈',
            level: 15,
            dotDamage: 0.05,
            hotHeal: 0.05,
            duration: 8
        };

        this.talents.chiWave = {
            name: '기의 파동',
            level: 15,
            damage: 1.0,
            heal: 1.0,
            bounces: 7,
            cooldown: 15
        };

        this.talents.chiBurst = {
            name: '기 폭발',
            level: 15,
            damage: 1.5,
            heal: 1.2,
            cooldown: 30
        };

        // 25레벨
        this.talents.celerity = {
            name: '쾌속',
            level: 25,
            rollCharges: 1,
            cooldownReduction: 5
        };

        this.talents.chiTorpedo = {
            name: '기 어뢰',
            level: 25,
            damage: 0.5,
            speedBonus: 0.3,
            duration: 10
        };

        this.talents.tigersLust = {
            name: '범의 욕망',
            level: 25,
            speedBonus: 0.7,
            duration: 6,
            cooldown: 30
        };

        // 30레벨
        this.talents.lightBrewing = {
            name: '경량 양조',
            level: 30,
            cooldownReduction: 3,
            chargeBonus: 1
        };

        this.talents.spitfire = {
            name: '뱉어내는 불꽃',
            level: 30,
            breathOfFireReset: 0.25
        };

        this.talents.blackOxBrew = {
            name: '흑우 맥주',
            level: 30,
            instantRecharge: true,
            cooldown: 120
        };

        // 35레벨
        this.talents.tigerTailSweep = {
            name: '범꼬리 휘둘러치기',
            level: 35,
            rangeBonus: 2,
            speedBonus: 0.2
        };

        this.talents.summonBlackOxStatue = {
            name: '흑우 조각상 소환',
            level: 35,
            tauntPulse: 8,
            threatBonus: 0.5,
            duration: 900
        };

        this.talents.ringOfPeace = {
            name: '평화의 고리',
            level: 35,
            knockback: 5,
            duration: 5,
            cooldown: 45
        };

        // 40레벨
        this.talents.bobAndWeave = {
            name: '몸 흔들기',
            level: 40,
            staggerBonus: 0.1,
            dodgeBonus: 0.05
        };

        this.talents.healingElixir = {
            name: '치유의 비약',
            level: 40,
            heal: 0.15,
            charges: 2,
            cooldown: 30
        };

        this.talents.dampenHarm = {
            name: '피해 감쇠',
            level: 40,
            damageReduction: 0.2,
            charges: 3,
            duration: 10,
            cooldown: 120
        };

        // 45레벨
        this.talents.rushingJadeWind = {
            name: '질풍 취옥장',
            level: 45,
            damage: 0.3,
            duration: 6,
            cooldown: 6
        };

        this.talents.invokeNiuzao = {
            name: '니우짜오 소환',
            level: 45,
            duration: 25,
            damageAbsorb: 0.25,
            cooldown: 180
        };

        this.talents.specialDelivery = {
            name: '특별 배송',
            level: 45,
            procChance: 0.3,
            damage: 1.0
        };

        // 50레벨
        this.talents.highTolerance = {
            name: '높은 내성',
            level: 50,
            staggerCap: 0.05,
            hastePerStagger: 0.03
        };

        this.talents.celestialFlames = {
            name: '천상의 불꽃',
            level: 50,
            implemented: true
        };

        this.talents.blackoutCombo = {
            name: '후려차기 연계',
            level: 50,
            comboEffects: true
        };
    }

    initializeRotation() {
        this.rotation = [
            { ability: 'kegSmash', condition: () => this.isOffCooldown('kegSmash') },
            { ability: 'blackoutKick', condition: () => !this.hasShuffle() || this.needsShuffleRefresh() },
            { ability: 'breathOfFire', condition: () => this.isOffCooldown('breathOfFire') && this.hasKegSmashDebuff() },
            { ability: 'purifyingBrew', condition: () => this.staggerIsHeavy() },
            { ability: 'ironskinBrew', condition: () => this.brewSystem.ironskinCharges >= 2 },
            { ability: 'tigerPalm', condition: () => this.resources[RESOURCE_TYPES.ENERGY].current >= 25 },
            { ability: 'spinningCraneKick', condition: () => this.isAoE() },
            { ability: 'celestialBrew', condition: () => this.needsAbsorb() },
            { ability: 'fortifyingBrew', condition: () => this.needsMajorDefensive() }
        ];
    }

    consumeEnergy(amount) {
        if (this.resources[RESOURCE_TYPES.ENERGY].current >= amount) {
            this.resources[RESOURCE_TYPES.ENERGY].current -= amount;
            return true;
        }
        return false;
    }

    reduceBrew(seconds) {
        // 양조 재충전 시간 감소
    }

    applyShuffle(duration) {
        // 셔플 버프 적용 (시간차 효율 증가)
    }

    extendShuffle(duration) {
        // 셔플 지속시간 연장
    }

    hasShuffle() {
        return false; // 더미 값
    }

    needsShuffleRefresh() {
        return true; // 더미 값
    }

    increaseStaggerCap(amount) {
        this.staggerSystem.maxStagger *= (1 + amount);
    }

    resetStaggerCap() {
        this.staggerSystem.maxStagger = this.stats.maxHealth;
    }

    staggerIsHeavy() {
        return this.staggerSystem.currentStagger > this.staggerSystem.maxStagger * this.staggerSystem.heavyThreshold;
    }

    hasKegSmashDebuff() {
        return true; // 더미 값
    }

    applyBreathOfFireDoT() {
        this.breathOfFireTargets.set(this.currentTarget, {
            duration: 12,
            damage: 0.2
        });
    }

    applyFireDebuff(reduction, duration) {
        // 화염 디버프 적용
    }

    needsAbsorb() {
        return this.stats.currentHealth < this.stats.maxHealth * 0.6;
    }

    needsMajorDefensive() {
        return this.stats.currentHealth < this.stats.maxHealth * 0.3;
    }
}

// Windwalker Monk - 풍운 수도사
class WindwalkerMonk extends Specialization {
    constructor(player) {
        super(player, '풍운');

        // 풍운 특화: 기와 연계 기술
        this.stats = {
            ...this.stats,
            agility: 1.05,
            criticalStrike: 1.2,
            haste: 1.15,
            mastery: 1.25
        };

        // 기력 시스템
        this.resources[RESOURCE_TYPES.ENERGY] = {
            current: 100,
            max: 100,
            regenRate: 10
        };

        // 기 시스템
        this.resources[RESOURCE_TYPES.CHI] = {
            current: 0,
            max: 5
        };

        // 연계 타격 시스템
        this.comboStrikesSystem = {
            active: true,
            lastAbility: null,
            damageBonus: 0.12
        };

        // 폭풍, 대지, 불 시스템
        this.stormEarthFireSystem = {
            active: false,
            clones: 0,
            duration: 15,
            cooldown: 90,
            damagePercent: 0.45
        };

        // 업화 킥 시스템
        this.touchOfDeathSystem = {
            cooldown: 180,
            execute: true,
            threshold: 0.15
        };

        // 분노의 주먹 시스템
        this.fistsOfFurySystem = {
            damage: 4.0,
            channelTime: 4,
            stunDuration: 4,
            cost: 3
        };

        // 범의 분노 시스템
        this.xeunTheTigerSystem = {
            active: false,
            duration: 24,
            cooldown: 120,
            damageBonus: 0.25
        };

        // 업장 시스템
        this.touchOfKarmaSystem = {
            active: false,
            absorb: 0.5,
            redirect: 0.7,
            duration: 10,
            cooldown: 90
        };

        // 학타격 시스템
        this.cracklingJadeLightningSystem = {
            damage: 0.3,
            channelTime: 4,
            chiGen: 1
        };

        // 승천 용 시스템
        this.whirlingDragonPunchSystem = {
            damage: 3.5,
            cooldown: 24,
            radius: 8
        };

        this.initializeAbilities();
        this.initializeTalents();
        this.initializeRotation();
    }

    initializeAbilities() {
        // 범의 장풍
        this.abilities.tigerPalm = {
            name: '범의 장풍',
            cost: { energy: 50 },
            damage: 1.2,
            chiGen: 2,
            execute: () => {
                this.consumeEnergy(50);
                const damage = this.calculateDamage(
                    this.abilities.tigerPalm.damage,
                    this.checkComboStrikes('tigerPalm')
                );
                this.generateChi(this.abilities.tigerPalm.chiGen);
                this.updateComboStrikes('tigerPalm');
                return damage;
            }
        };

        // 후려차기
        this.abilities.blackoutKick = {
            name: '후려차기',
            cost: { chi: 1 },
            damage: 2.2,
            execute: () => {
                if (!this.consumeChi(1)) return 0;
                const damage = this.calculateDamage(
                    this.abilities.blackoutKick.damage,
                    this.checkComboStrikes('blackoutKick')
                );
                this.updateComboStrikes('blackoutKick');
                return damage;
            }
        };

        // 해오름 차기
        this.abilities.risingSunKick = {
            name: '해오름 차기',
            cost: { chi: 2 },
            damage: 3.5,
            cooldown: 10,
            debuffDuration: 15,
            execute: () => {
                if (!this.consumeChi(2)) return 0;
                const damage = this.calculateDamage(
                    this.abilities.risingSunKick.damage,
                    this.checkComboStrikes('risingSunKick')
                );
                this.applyMortalStrike(0.1, this.abilities.risingSunKick.debuffDuration);
                this.updateComboStrikes('risingSunKick');
                return damage;
            }
        };

        // 분노의 주먹
        this.abilities.fistsOfFury = {
            name: '분노의 주먹',
            cost: { chi: 3 },
            damage: 4.0,
            channelTime: 4,
            cooldown: 24,
            execute: () => {
                if (!this.consumeChi(3)) return 0;
                let totalDamage = 0;
                const ticks = 5;

                for (let i = 0; i < ticks; i++) {
                    setTimeout(() => {
                        const tickDamage = this.calculateDamage(
                            this.abilities.fistsOfFury.damage / ticks,
                            this.checkComboStrikes('fistsOfFury')
                        );
                        this.dealDamage(tickDamage);
                        totalDamage += tickDamage;

                        if (i === 0) {
                            this.applyStun(4);
                        }
                    }, i * 800);
                }

                this.updateComboStrikes('fistsOfFury');
                return totalDamage;
            }
        };

        // 회전 학다리차기
        this.abilities.spinningCraneKick = {
            name: '회전 학다리차기',
            cost: { chi: 2 },
            damage: 1.5,
            channelTime: 1.5,
            aoe: true,
            execute: () => {
                if (!this.consumeChi(2)) return 0;
                let totalDamage = 0;
                const ticks = 4;

                for (let i = 0; i < ticks; i++) {
                    setTimeout(() => {
                        const damage = this.calculateDamage(
                            this.abilities.spinningCraneKick.damage / ticks,
                            this.checkComboStrikes('spinningCraneKick')
                        );
                        this.dealDamage(damage);
                        totalDamage += damage;

                        // 학 중첩
                        this.applyCraneStack();
                    }, i * 375);
                }

                this.updateComboStrikes('spinningCraneKick');
                return totalDamage;
            }
        };

        // 폭풍, 대지, 불
        this.abilities.stormEarthFire = {
            name: '폭풍, 대지, 불',
            cooldown: 90,
            duration: 15,
            execute: () => {
                this.stormEarthFireSystem.active = true;
                this.stormEarthFireSystem.clones = 2;

                // 분신 소환
                const cloneDamage = setInterval(() => {
                    const damage = this.calculateDamage(0.45);
                    this.dealDamage(damage * 2); // 2개 분신
                }, 1000);

                setTimeout(() => {
                    clearInterval(cloneDamage);
                    this.stormEarthFireSystem.active = false;
                    this.stormEarthFireSystem.clones = 0;
                }, this.abilities.stormEarthFire.duration * 1000);

                return true;
            }
        };

        // 업화킥
        this.abilities.touchOfDeath = {
            name: '업화킥',
            cooldown: 180,
            execute: () => {
                const targetHealth = this.getTargetHealth();
                if (targetHealth < this.stats.maxHealth) {
                    // 즉사
                    const damage = targetHealth;
                    this.dealDamage(damage);
                    return damage;
                } else {
                    // 35% 고정 피해
                    const damage = this.stats.maxHealth * 0.35;
                    this.dealDamage(damage);
                    return damage;
                }
            }
        };

        // 학의 은총
        this.abilities.touchOfKarma = {
            name: '학의 은총',
            cooldown: 90,
            duration: 10,
            execute: () => {
                this.touchOfKarmaSystem.active = true;
                const maxAbsorb = this.stats.maxHealth * this.touchOfKarmaSystem.absorb;

                setTimeout(() => {
                    this.touchOfKarmaSystem.active = false;
                }, this.abilities.touchOfKarma.duration * 1000);

                return maxAbsorb;
            }
        };

        // 기절시키기
        this.abilities.paralysis = {
            name: '기절시키기',
            cost: { energy: 20 },
            duration: 60,
            cooldown: 15,
            execute: () => {
                this.consumeEnergy(20);
                this.applyIncapacitate(this.abilities.paralysis.duration);
                return true;
            }
        };

        // 구르기
        this.abilities.roll = {
            name: '구르기',
            charges: 2,
            cooldown: 20,
            distance: 15,
            execute: () => {
                this.dash(this.abilities.roll.distance);
                return true;
            }
        };

        // 비취 번개
        this.abilities.cracklingJadeLightning = {
            name: '비취 번개',
            damage: 0.3,
            channelTime: 4,
            chiGen: 1,
            execute: () => {
                let totalDamage = 0;
                const ticks = 4;

                for (let i = 0; i < ticks; i++) {
                    setTimeout(() => {
                        const damage = this.calculateDamage(this.abilities.cracklingJadeLightning.damage);
                        this.dealDamage(damage);
                        totalDamage += damage;

                        if (i === ticks - 1) {
                            this.generateChi(1);
                        }
                    }, i * 1000);
                }

                return totalDamage;
            }
        };

        // 환영 차기
        this.abilities.flyingSerpentKick = {
            name: '환영 차기',
            cooldown: 25,
            damage: 1.0,
            slowDuration: 4,
            execute: () => {
                const damage = this.calculateDamage(this.abilities.flyingSerpentKick.damage);
                this.applySlowEffect(0.5, this.abilities.flyingSerpentKick.slowDuration);
                return damage;
            }
        };
    }

    initializeTalents() {
        // 15레벨
        this.talents.eyeOfTheTiger = {
            name: '범의 눈',
            level: 15,
            dotDamage: 0.05,
            hotHeal: 0.05,
            duration: 8
        };

        this.talents.chiWave = {
            name: '기의 파동',
            level: 15,
            damage: 1.0,
            heal: 1.0,
            bounces: 7,
            cooldown: 15
        };

        this.talents.chiBurst = {
            name: '기 폭발',
            level: 15,
            damage: 1.5,
            heal: 1.2,
            cooldown: 30
        };

        // 25레벨
        this.talents.celerity = {
            name: '쾌속',
            level: 25,
            rollCharges: 1,
            cooldownReduction: 5
        };

        this.talents.chiTorpedo = {
            name: '기 어뢰',
            level: 25,
            damage: 0.5,
            speedBonus: 0.3,
            duration: 10
        };

        this.talents.tigersLust = {
            name: '범의 욕망',
            level: 25,
            speedBonus: 0.7,
            duration: 6,
            cooldown: 30
        };

        // 30레벨
        this.talents.ascension = {
            name: '승천',
            level: 30,
            chiMax: 1,
            energyRegen: 0.1
        };

        this.talents.fistOfTheWhiteTiger = {
            name: '백호의 주먹',
            level: 30,
            damage: 2.5,
            chiGen: 3,
            energyCost: 40
        };

        this.talents.energizingElixir = {
            name: '활력의 비약',
            level: 30,
            chiGen: 2,
            energyGen: 75,
            cooldown: 60
        };

        // 35레벨
        this.talents.tigerTailSweep = {
            name: '범꼬리 휘둘러치기',
            level: 35,
            rangeBonus: 2,
            speedBonus: 0.2
        };

        this.talents.goodKarma = {
            name: '선업',
            level: 35,
            karmaHeal: 0.5
        };

        this.talents.ringOfPeace = {
            name: '평화의 고리',
            level: 35,
            knockback: 5,
            duration: 5,
            cooldown: 45
        };

        // 40레벨
        this.talents.innerStrength = {
            name: '내면의 힘',
            level: 40,
            chiCostReduction: 1,
            duration: 5
        };

        this.talents.diffuseMagic = {
            name: '마법 해소',
            level: 40,
            magicReduction: 0.6,
            duration: 6,
            cooldown: 90
        };

        this.talents.dampenHarm = {
            name: '피해 감쇠',
            level: 40,
            damageReduction: 0.2,
            charges: 3,
            duration: 10,
            cooldown: 120
        };

        // 45레벨
        this.talents.hitCombo = {
            name: '연타',
            level: 45,
            damagePerStack: 0.01,
            maxStacks: 6
        };

        this.talents.rushingJadeWind = {
            name: '질풍 취옥장',
            level: 45,
            damage: 0.4,
            duration: 6,
            cooldown: 6,
            chiCost: 1
        };

        this.talents.danceOfChiji = {
            name: '치지의 춤',
            level: 45,
            spinBonus: 2,
            procChance: 0.15
        };

        // 50레벨
        this.talents.spiritualFocus = {
            name: '영적 집중',
            level: 50,
            cancelChance: 0.3
        };

        this.talents.whirlingDragonPunch = {
            name: '소용돌이 용의 주먹',
            level: 50,
            damage: 3.5,
            cooldown: 24
        };

        this.talents.serenity = {
            name: '평온',
            level: 50,
            duration: 12,
            cooldown: 90,
            freeAbilities: true
        };
    }

    initializeRotation() {
        this.rotation = [
            { ability: 'touchOfDeath', condition: () => this.canExecute() },
            { ability: 'stormEarthFire', condition: () => this.isBurstWindow() },
            { ability: 'fistsOfFury', condition: () => this.resources[RESOURCE_TYPES.CHI].current >= 3 },
            { ability: 'risingSunKick', condition: () => this.resources[RESOURCE_TYPES.CHI].current >= 2 },
            { ability: 'spinningCraneKick', condition: () => this.resources[RESOURCE_TYPES.CHI].current >= 2 && this.isAoE() },
            { ability: 'blackoutKick', condition: () => this.resources[RESOURCE_TYPES.CHI].current >= 1 },
            { ability: 'tigerPalm', condition: () => this.resources[RESOURCE_TYPES.ENERGY].current >= 50 && this.resources[RESOURCE_TYPES.CHI].current < 4 },
            { ability: 'cracklingJadeLightning', condition: () => this.resources[RESOURCE_TYPES.ENERGY].current < 50 && this.resources[RESOURCE_TYPES.CHI].current === 0 },
            { ability: 'touchOfKarma', condition: () => this.incomingDamageHigh() }
        ];
    }

    consumeEnergy(amount) {
        if (this.resources[RESOURCE_TYPES.ENERGY].current >= amount) {
            this.resources[RESOURCE_TYPES.ENERGY].current -= amount;
            return true;
        }
        return false;
    }

    generateChi(amount) {
        this.resources[RESOURCE_TYPES.CHI].current = Math.min(
            this.resources[RESOURCE_TYPES.CHI].current + amount,
            this.resources[RESOURCE_TYPES.CHI].max
        );
    }

    consumeChi(amount) {
        if (this.resources[RESOURCE_TYPES.CHI].current >= amount) {
            this.resources[RESOURCE_TYPES.CHI].current -= amount;
            return true;
        }
        return false;
    }

    checkComboStrikes(ability) {
        if (this.comboStrikesSystem.lastAbility !== ability) {
            return 1 + this.comboStrikesSystem.damageBonus;
        }
        return 1;
    }

    updateComboStrikes(ability) {
        this.comboStrikesSystem.lastAbility = ability;
    }

    applyCraneStack() {
        // 학 중첩 적용
    }

    canExecute() {
        return this.getTargetHealthPercent() < 0.15 || this.getTargetHealth() < this.stats.maxHealth;
    }

    getTargetHealth() {
        return 100000; // 더미 값
    }

    getTargetHealthPercent() {
        return 0.5; // 더미 값
    }

    incomingDamageHigh() {
        return false; // 더미 값
    }
}

// Mistweaver Monk - 운무 수도사
class MistweaverMonk extends Specialization {
    constructor(player) {
        super(player, '운무');

        // 운무 특화: 안개 치유
        this.stats = {
            ...this.stats,
            intellect: 1.05,
            criticalStrike: 1.15,
            haste: 1.2,
            mastery: 1.25,
            healingDone: 1.1
        };

        // 마나 시스템
        this.resources[RESOURCE_TYPES.MANA] = {
            current: 1.0,
            max: 1.0,
            regenRate: 0.02
        };

        // 소생의 안개 시스템
        this.renewingMistSystem = {
            targets: new Map(),
            maxTargets: 20,
            jumpRange: 20,
            healPerTick: 0.15,
            duration: 20
        };

        // 포용의 안개 시스템
        this.envelopingMistSystem = {
            targets: new Map(),
            healingBonus: 0.3,
            duration: 6
        };

        // 정수의 샘 시스템
        this.essenceFontSystem = {
            active: false,
            targets: 6,
            hotDuration: 8,
            hotHeal: 0.1,
            boltHeal: 0.8
        };

        // 생기 충만 시스템
        this.lifeCocoonSystem = {
            cooldown: 120,
            absorb: 1.5,
            healingBonus: 0.5,
            duration: 12
        };

        // 비취 바람 시스템
        this.yuLonSystem = {
            active: false,
            duration: 25,
            cooldown: 180,
            healingBonus: 0.3,
            soothingBreath: 0.25
        };

        // 번개 차 시스템
        this.thunderFocusTeaSystem = {
            active: false,
            charges: 1,
            maxCharges: 1,
            cooldown: 30,
            instantCast: true
        };

        // 후려차기 교육 시스템
        this.teachingsOfTheMonasterySystem = {
            stacks: 0,
            maxStacks: 3,
            damageBonus: 0.15,
            healingBonus: 0.65
        };

        // 상쾌한 비취 바람
        this.refreshingJadeWindSystem = {
            active: false,
            duration: 9,
            tickHeal: 0.15,
            radius: 10
        };

        this.initializeAbilities();
        this.initializeTalents();
        this.initializeRotation();
    }

    initializeAbilities() {
        // 소생의 안개
        this.abilities.renewingMist = {
            name: '소생의 안개',
            cost: { mana: 0.018 },
            hotHeal: 0.15,
            duration: 20,
            charges: 2,
            cooldown: 9,
            execute: () => {
                this.consumeMana(0.018);
                this.applyRenewingMist();
                return this.calculateHealing(this.abilities.renewingMist.hotHeal);
            }
        };

        // 포용의 안개
        this.abilities.envelopingMist = {
            name: '포용의 안개',
            cost: { mana: 0.052 },
            heal: 2.0,
            hotHeal: 0.3,
            duration: 6,
            castTime: 2,
            execute: () => {
                this.consumeMana(0.052);
                const healing = this.calculateHealing(this.abilities.envelopingMist.heal);
                this.applyEnvelopingMist();
                return healing;
            }
        };

        // 생기활
        this.abilities.vivify = {
            name: '생기활',
            cost: { mana: 0.035 },
            heal: 1.85,
            castTime: 1.5,
            cleave: true,
            execute: () => {
                this.consumeMana(0.035);
                const mainHeal = this.calculateHealing(this.abilities.vivify.heal);

                // 소생의 안개 대상 추가 치유
                const cleaveHeal = mainHeal * 0.4;
                const renewingTargets = this.renewingMistSystem.targets.size;

                return mainHeal + (cleaveHeal * Math.min(renewingTargets, 5));
            }
        };

        // 정수의 샘
        this.abilities.essenceFont = {
            name: '정수의 샘',
            cost: { mana: 0.072 },
            boltHeal: 0.8,
            hotHeal: 0.1,
            channelTime: 3,
            cooldown: 12,
            execute: () => {
                this.consumeMana(0.072);
                this.essenceFontSystem.active = true;
                let totalHealing = 0;

                // 채널링 중 볼트 치유
                const boltTicks = 6;
                for (let i = 0; i < boltTicks; i++) {
                    setTimeout(() => {
                        const healing = this.calculateHealing(this.abilities.essenceFont.boltHeal);
                        this.healMultipleTargets(healing, 6);
                        totalHealing += healing * 6;

                        // HoT 적용
                        if (i === boltTicks - 1) {
                            this.applyEssenceFontHoT();
                        }
                    }, i * 500);
                }

                setTimeout(() => {
                    this.essenceFontSystem.active = false;
                }, this.abilities.essenceFont.channelTime * 1000);

                return totalHealing;
            }
        };

        // 해독의 안개
        this.abilities.soothingMist = {
            name: '해독의 안개',
            cost: 0,
            heal: 0.3,
            channeled: true,
            execute: () => {
                const tickHeal = this.calculateHealing(this.abilities.soothingMist.heal);

                // 채널링 중 즉시 시전 가능
                this.enableInstantCast();

                return tickHeal;
            }
        };

        // 생기 충만
        this.abilities.lifeCocoon = {
            name: '생기 충만',
            cooldown: 120,
            duration: 12,
            execute: () => {
                const absorbAmount = this.stats.maxHealth * this.lifeCocoonSystem.absorb;
                this.applyAbsorbToTarget(absorbAmount);
                this.applyHealingBonusToTarget(this.lifeCocoonSystem.healingBonus,
                                               this.lifeCocoonSystem.duration);
                return absorbAmount;
            }
        };

        // 소생
        this.abilities.revival = {
            name: '소생',
            cost: { mana: 0.0429 },
            heal: 3.0,
            cooldown: 180,
            instant: true,
            execute: () => {
                this.consumeMana(0.0429);
                const healing = this.calculateHealing(this.abilities.revival.heal);
                this.healAllAllies(healing);
                this.dispelAllDebuffs();
                return healing;
            }
        };

        // 비취 바람 소환
        this.abilities.invokeYulon = {
            name: '비취 바람 소환',
            cooldown: 180,
            duration: 25,
            execute: () => {
                this.yuLonSystem.active = true;
                this.updateStats({ healingDone: 1.3 });

                // 비취 바람의 숨결 치유
                const breathHeal = setInterval(() => {
                    const healing = this.calculateHealing(0.25);
                    this.healLowestHealth(healing);
                }, 1000);

                setTimeout(() => {
                    clearInterval(breathHeal);
                    this.yuLonSystem.active = false;
                    this.updateStats({ healingDone: 1 });
                }, this.abilities.invokeYulon.duration * 1000);

                return true;
            }
        };

        // 번개 차
        this.abilities.thunderFocusTea = {
            name: '번개 차',
            cooldown: 30,
            execute: () => {
                this.thunderFocusTeaSystem.active = true;
                this.thunderFocusTeaSystem.charges = 1;

                // 다음 주문 강화
                return true;
            }
        };

        // 범의 장풍
        this.abilities.tigerPalm = {
            name: '범의 장풍',
            cost: 0,
            damage: 0.8,
            execute: () => {
                const damage = this.calculateDamage(this.abilities.tigerPalm.damage);

                // 후려차기 교육 중첩
                this.teachingsOfTheMonasterySystem.stacks = Math.min(
                    this.teachingsOfTheMonasterySystem.stacks + 1,
                    this.teachingsOfTheMonasterySystem.maxStacks
                );

                return damage;
            }
        };

        // 후려차기
        this.abilities.blackoutKick = {
            name: '후려차기',
            cost: { mana: 0.015 },
            damage: 1.5,
            heal: 0,
            execute: () => {
                this.consumeMana(0.015);
                const damage = this.calculateDamage(this.abilities.blackoutKick.damage);

                // 후려차기 교육 소비
                if (this.teachingsOfTheMonasterySystem.stacks > 0) {
                    const bonusHeal = this.calculateHealing(
                        this.teachingsOfTheMonasterySystem.healingBonus * this.teachingsOfTheMonasterySystem.stacks
                    );
                    this.healTarget(bonusHeal);
                    this.teachingsOfTheMonasterySystem.stacks = 0;
                    return { damage, healing: bonusHeal };
                }

                return damage;
            }
        };

        // 해오름 차기
        this.abilities.risingSunKick = {
            name: '해오름 차기',
            cost: { mana: 0.012 },
            damage: 2.0,
            cooldown: 10,
            execute: () => {
                this.consumeMana(0.012);
                const damage = this.calculateDamage(this.abilities.risingSunKick.damage);

                // 소생의 안개 확산
                this.spreadRenewingMist();

                return damage;
            }
        };

        // 기의 고치
        this.abilities.chiCocoon = {
            name: '기의 고치',
            cooldown: 30,
            absorb: 0.4,
            duration: 10,
            execute: () => {
                const absorbAmount = this.stats.intellect * 12;
                this.applyAbsorb(absorbAmount);
                return absorbAmount;
            }
        };
    }

    initializeTalents() {
        // 15레벨
        this.talents.mistWrap = {
            name: '안개 감싸기',
            level: 15,
            envelopingBonus: 0.1,
            renewingSpeed: 0.1
        };

        this.talents.chiWave = {
            name: '기의 파동',
            level: 15,
            heal: 1.0,
            bounces: 7,
            cooldown: 15
        };

        this.talents.chiBurst = {
            name: '기 폭발',
            level: 15,
            heal: 1.2,
            cooldown: 30
        };

        // 25레벨
        this.talents.celerity = {
            name: '쾌속',
            level: 25,
            rollCharges: 1,
            cooldownReduction: 5
        };

        this.talents.chiTorpedo = {
            name: '기 어뢰',
            level: 25,
            heal: 0.5,
            speedBonus: 0.3,
            duration: 10
        };

        this.talents.tigersLust = {
            name: '범의 욕망',
            level: 25,
            speedBonus: 0.7,
            duration: 6,
            cooldown: 30
        };

        // 30레벨
        this.talents.lifecycles = {
            name: '생명 순환',
            level: 30,
            vivifyCost: 0.25,
            envelopingCost: 0.25
        };

        this.talents.spiritOfTheCrane = {
            name: '학의 정신',
            level: 30,
            manaReturn: 0.005,
            blackoutKickHeal: true
        };

        this.talents.mistWrapped = {
            name: '안개로 싸인',
            level: 30,
            singleTargetBonus: 0.4
        };

        // 35레벨
        this.talents.tigerTailSweep = {
            name: '범꼬리 휘둘러치기',
            level: 35,
            rangeBonus: 2,
            speedBonus: 0.2
        };

        this.talents.songOfChiJi = {
            name: '치지의 노래',
            level: 35,
            cooldownReduction: 0.5,
            duration: 20
        };

        this.talents.ringOfPeace = {
            name: '평화의 고리',
            level: 35,
            knockback: 5,
            duration: 5,
            cooldown: 45
        };

        // 40레벨
        this.talents.healingElixir = {
            name: '치유의 비약',
            level: 40,
            heal: 0.15,
            charges: 2,
            cooldown: 30
        };

        this.talents.diffuseMagic = {
            name: '마법 해소',
            level: 40,
            magicReduction: 0.6,
            duration: 6,
            cooldown: 90
        };

        this.talents.dampenHarm = {
            name: '피해 감쇠',
            level: 40,
            damageReduction: 0.2,
            charges: 3,
            duration: 10,
            cooldown: 120
        };

        // 45레벨
        this.talents.summonJadeSerpentStatue = {
            name: '비취 뱀 조각상 소환',
            level: 45,
            duration: 900,
            soothingRange: 40,
            healEcho: 0.25
        };

        this.talents.refreshingJadeWind = {
            name: '상쾌한 비취 바람',
            level: 45,
            implemented: true
        };

        this.talents.invokeChiji = {
            name: '치지 소환',
            level: 45,
            duration: 25,
            cooldown: 180,
            envelopingReduction: 1
        };

        // 50레벨
        this.talents.focusedThunder = {
            name: '집중된 천둥',
            level: 50,
            thunderCharges: 1,
            effectBonus: 0.1
        };

        this.talents.upwelling = {
            name: '용솟음',
            level: 50,
            essenceFontOverflow: 0.18,
            maxOverflow: 18
        };

        this.talents.risingMist = {
            name: '피어오르는 안개',
            level: 50,
            renewingExtend: 2,
            envelopingExtend: 2
        };
    }

    initializeRotation() {
        this.rotation = [
            { ability: 'renewingMist', condition: () => !this.hasRenewingMist() },
            { ability: 'essenceFont', condition: () => this.groupNeedsHeal() },
            { ability: 'vivify', condition: () => this.targetNeedsQuickHeal() },
            { ability: 'envelopingMist', condition: () => this.targetNeedsSustainedHeal() },
            { ability: 'lifeCocoon', condition: () => this.targetCritical() },
            { ability: 'revival', condition: () => this.raidCritical() },
            { ability: 'invokeYulon', condition: () => this.heavyHealingPhase() },
            { ability: 'thunderFocusTea', condition: () => this.needsEnhancement() },
            { ability: 'tigerPalm', condition: () => this.teachingsOfTheMonasterySystem.stacks < 3 },
            { ability: 'blackoutKick', condition: () => this.teachingsOfTheMonasterySystem.stacks === 3 }
        ];
    }

    consumeMana(amount) {
        if (this.resources[RESOURCE_TYPES.MANA].current >= amount) {
            this.resources[RESOURCE_TYPES.MANA].current -= amount;
            return true;
        }
        return false;
    }

    applyRenewingMist() {
        this.renewingMistSystem.targets.set(this.currentTarget, {
            duration: 20,
            healPerTick: 0.15
        });
    }

    applyEnvelopingMist() {
        this.envelopingMistSystem.targets.set(this.currentTarget, {
            duration: 6,
            healingBonus: 0.3
        });
    }

    applyEssenceFontHoT() {
        // 정수의 샘 HoT 적용
        for (let i = 0; i < 6; i++) {
            this.essenceFontSystem[`target_${i}`] = {
                duration: 8,
                healPerTick: 0.1
            };
        }
    }

    spreadRenewingMist() {
        // 소생의 안개 확산
        const currentTargets = this.renewingMistSystem.targets.size;
        if (currentTargets > 0 && currentTargets < this.renewingMistSystem.maxTargets) {
            const newTarget = `spread_${Date.now()}`;
            this.renewingMistSystem.targets.set(newTarget, {
                duration: 20,
                healPerTick: 0.15
            });
        }
    }

    enableInstantCast() {
        // 해독의 안개 중 즉시 시전
    }

    hasRenewingMist() {
        return this.renewingMistSystem.targets.size > 0;
    }

    targetNeedsQuickHeal() {
        return true; // 더미 값
    }

    targetNeedsSustainedHeal() {
        return false; // 더미 값
    }

    targetCritical() {
        return false; // 더미 값
    }

    groupNeedsHeal() {
        return false; // 더미 값
    }

    raidCritical() {
        return false; // 더미 값
    }

    heavyHealingPhase() {
        return false; // 더미 값
    }

    needsEnhancement() {
        return this.thunderFocusTeaSystem.charges === 0;
    }
}

module.exports = {
    BrewmasterMonk,
    WindwalkerMonk,
    MistweaverMonk
};