// Death Knight Specialization Implementations
// Blood: 탱킹 전문화 - 자가 치유와 룬 관리
// Frost: 근접 DPS 전문화 - 듀얼 웨폰과 냉기 데미지
// Unholy: 근접 DPS 전문화 - 질병과 언데드 소환

const { Specialization } = require('../core/Specialization');
const { RESOURCE_TYPES } = require('../core/ResourceSystem');

// Blood Death Knight - 혈기 죽음의 기사
class BloodDeathKnight extends Specialization {
    constructor(player) {
        super(player, '혈기');

        // 혈기 특화: 흡혈과 방어
        this.stats = {
            ...this.stats,
            stamina: 1.45,
            armor: 1.3,
            healingDone: 1.0,
            damageReduction: 0.85
        };

        // 룬 시스템
        this.runeSystem = {
            bloodRunes: 2,
            frostRunes: 2,
            unholyRunes: 2,
            maxRunes: 6,
            runeRegenTime: 10,
            runeRegenTimers: {
                blood: [0, 0],
                frost: [0, 0],
                unholy: [0, 0]
            }
        };

        // 룬 파워 시스템
        this.resources[RESOURCE_TYPES.RUNIC_POWER] = {
            current: 0,
            max: 115,
            generationRate: 10
        };

        // 뼈 방패 시스템
        this.boneShieldSystem = {
            charges: 0,
            maxCharges: 10,
            damageReduction: 0.04,
            bonusDamagePerCharge: 0.02,
            duration: 30
        };

        // 피의 보호막 시스템
        this.bloodShieldSystem = {
            active: false,
            absorb: 0,
            maxAbsorb: 0,
            duration: 10
        };

        // 흡혈 시스템
        this.vampiricBloodSystem = {
            active: false,
            healingIncrease: 1.35,
            healthIncrease: 1.3,
            duration: 10,
            cooldown: 90
        };

        // 혈기 역병 추적
        this.bloodPlagueTargets = new Map();

        this.initializeAbilities();
        this.initializeTalents();
        this.initializeRotation();
    }

    initializeAbilities() {
        // 죽음의 일격
        this.abilities.deathStrike = {
            name: '죽음의 일격',
            cost: { runicPower: 45 },
            damage: 2.8,
            heal: 0.25,
            cooldown: 0,
            castTime: 0,
            execute: () => {
                const damage = this.calculateDamage(this.abilities.deathStrike.damage);
                const healing = damage * this.abilities.deathStrike.heal;
                this.dealDamage(damage);
                this.healSelf(healing);
                this.applyBloodShield(healing * 0.3);
                return { damage, healing };
            }
        };

        // 피의 소용돌이
        this.abilities.bloodBoil = {
            name: '피의 소용돌이',
            cost: { runes: 1 },
            damage: 1.4,
            cooldown: 0,
            castTime: 0,
            aoe: true,
            execute: () => {
                this.consumeRune('blood');
                const damage = this.calculateDamage(this.abilities.bloodBoil.damage);
                this.generateRunicPower(10);
                this.applyBloodPlague();
                return damage;
            }
        };

        // 심장 강타
        this.abilities.heartStrike = {
            name: '심장 강타',
            cost: { runes: 1 },
            damage: 2.2,
            cooldown: 0,
            castTime: 0,
            cleave: 2,
            execute: () => {
                this.consumeRune('blood');
                const damage = this.calculateDamage(this.abilities.heartStrike.damage);
                this.generateRunicPower(15);
                this.reduceDamageIntake(0.05, 8);
                return damage;
            }
        };

        // 흡혈
        this.abilities.vampiricBlood = {
            name: '흡혈',
            cooldown: 90,
            duration: 10,
            execute: () => {
                this.vampiricBloodSystem.active = true;
                this.updateStats({ healingReceived: 1.35, maxHealth: 1.3 });
                setTimeout(() => {
                    this.vampiricBloodSystem.active = false;
                    this.updateStats({ healingReceived: 1, maxHealth: 1 });
                }, this.vampiricBloodSystem.duration * 1000);
                return true;
            }
        };

        // 전쟁의 춤
        this.abilities.dancingRuneWeapon = {
            name: '전쟁의 춤',
            cooldown: 120,
            duration: 8,
            execute: () => {
                this.updateStats({ parry: 1.4 });
                const weaponDamage = setInterval(() => {
                    this.dealDamage(this.calculateDamage(0.8));
                }, 1000);
                setTimeout(() => {
                    clearInterval(weaponDamage);
                    this.updateStats({ parry: 1 });
                }, this.abilities.dancingRuneWeapon.duration * 1000);
                return true;
            }
        };

        // 뼈 폭풍
        this.abilities.bonestorm = {
            name: '뼈 폭풍',
            cost: { runicPower: 10 },
            damage: 0.5,
            cooldown: 60,
            channeled: true,
            maxDuration: 10,
            execute: () => {
                const duration = Math.min(this.resources[RESOURCE_TYPES.RUNIC_POWER].current / 10, 10);
                this.consumeRunicPower(duration * 10);
                const tickDamage = () => {
                    const damage = this.calculateDamage(this.abilities.bonestorm.damage);
                    this.dealDamage(damage);
                    this.healSelf(damage * 0.03);
                };
                const bonestormTick = setInterval(tickDamage, 1000);
                setTimeout(() => clearInterval(bonestormTick), duration * 1000);
                return duration;
            }
        };

        // 고어핀드의 손아귀
        this.abilities.gorefiendsGrasp = {
            name: '고어핀드의 손아귀',
            cooldown: 120,
            range: 20,
            execute: () => {
                this.pullEnemies(20);
                return true;
            }
        };

        // 대마법 지대
        this.abilities.antiMagicZone = {
            name: '대마법 지대',
            cooldown: 120,
            duration: 10,
            absorb: 1.5,
            execute: () => {
                this.createAbsorptionZone(this.abilities.antiMagicZone.absorb);
                return true;
            }
        };
    }

    initializeTalents() {
        // 15레벨
        this.talents.heartbreaker = {
            name: '심장파괴자',
            level: 15,
            effect: () => {
                this.abilities.heartStrike.runicPowerGen = 2;
            }
        };

        this.talents.blooddrinker = {
            name: '피의 술꾼',
            level: 15,
            channeled: true,
            damage: 3.5,
            heal: 1.0
        };

        this.talents.tombstone = {
            name: '묘비',
            level: 15,
            absorb: 0.3,
            duration: 8,
            cooldown: 60
        };

        // 25레벨
        this.talents.rapidDecomposition = {
            name: '급속 부패',
            level: 25,
            effect: () => {
                this.abilities.deathAndDecay.runicPowerGen = 1;
            }
        };

        this.talents.hemostasis = {
            name: '지혈',
            level: 25,
            stackMax: 5,
            damagePerStack: 0.08
        };

        this.talents.consumption = {
            name: '소비',
            level: 25,
            damage: 1.5,
            heal: 1.0,
            cooldown: 45
        };

        // 30레벨
        this.talents.foulsCarapace = {
            name: '오염된 갑각',
            level: 30,
            damageReduction: 0.1
        };

        this.talents.relishInBlood = {
            name: '피의 향연',
            level: 30,
            healingIncrease: 0.15
        };

        this.talents.bloodTap = {
            name: '피의 전환',
            level: 30,
            charges: 2,
            cooldown: 60
        };

        // 35레벨
        this.talents.willOfTheNecropolis = {
            name: '네크로폴리스의 의지',
            level: 35,
            threshold: 0.3,
            reduction: 0.15
        };

        this.talents.antiMagicBarrier = {
            name: '대마법 방벽',
            level: 35,
            absorbIncrease: 0.25,
            cooldownReduction: 15
        };

        this.talents.markOfBlood = {
            name: '피의 징표',
            level: 35,
            heal: 0.02,
            duration: 15,
            cooldown: 6
        };

        // 40레벨
        this.talents.grip = {
            name: '죽음의 손아귀 강화',
            level: 40,
            cooldownReduction: 15
        };

        this.talents.tighteningGrasp = {
            name: '단단한 손아귀',
            level: 40,
            slow: 0.7,
            duration: 5
        };

        this.talents.wraith = {
            name: '망령 보행',
            level: 40,
            speedIncrease: 0.7,
            duration: 4
        };

        // 45레벨
        this.talents.voracious = {
            name: '탐욕스런 피',
            level: 45,
            leechIncrease: 0.15
        };

        this.talents.bloodworms = {
            name: '피벌레',
            level: 45,
            procChance: 0.15,
            wormHeal: 0.15
        };

        this.talents.deathPact = {
            name: '죽음의 계약',
            level: 45,
            heal: 0.5,
            absorb: 0.15,
            cooldown: 120
        };

        // 50레벨
        this.talents.purgatory = {
            name: '연옥',
            level: 50,
            cooldown: 240,
            duration: 3
        };

        this.talents.redThirst = {
            name: '붉은 갈증',
            level: 50,
            cooldownReduction: 2
        };

        this.talents.bonestorm = {
            name: '뼈 폭풍',
            level: 50,
            implemented: true
        };
    }

    initializeRotation() {
        this.rotation = [
            { ability: 'bloodBoil', condition: () => !this.hasBloodPlague() },
            { ability: 'deathStrike', condition: () => this.resources[RESOURCE_TYPES.RUNIC_POWER].current >= 45 },
            { ability: 'heartStrike', condition: () => this.hasAvailableRune('blood') },
            { ability: 'bloodBoil', condition: () => this.hasAvailableRune('blood') && this.isAoE() },
            { ability: 'bonestorm', condition: () => this.resources[RESOURCE_TYPES.RUNIC_POWER].current >= 100 && this.isAoE() },
            { ability: 'vampiricBlood', condition: () => this.needsSurvivalCooldown() },
            { ability: 'dancingRuneWeapon', condition: () => this.isBurstWindow() }
        ];
    }

    consumeRune(type) {
        const runeTypes = ['blood', 'frost', 'unholy'];
        const runeIndex = runeTypes.indexOf(type);

        if (this.runeSystem[`${type}Runes`] > 0) {
            this.runeSystem[`${type}Runes`]--;
            this.startRuneRegeneration(type);
            return true;
        }

        // Death rune system - any rune can be used
        for (const runeType of runeTypes) {
            if (runeType !== type && this.runeSystem[`${runeType}Runes`] > 0) {
                this.runeSystem[`${runeType}Runes`]--;
                this.startRuneRegeneration(runeType);
                return true;
            }
        }

        return false;
    }

    hasAvailableRune(type) {
        return this.runeSystem[`${type}Runes`] > 0 ||
               this.runeSystem.frostRunes > 0 ||
               this.runeSystem.unholyRunes > 0;
    }

    startRuneRegeneration(type) {
        setTimeout(() => {
            if (this.runeSystem[`${type}Runes`] < 2) {
                this.runeSystem[`${type}Runes`]++;
            }
        }, this.runeSystem.runeRegenTime * 1000);
    }

    applyBloodShield(amount) {
        this.bloodShieldSystem.absorb = Math.min(
            this.bloodShieldSystem.absorb + amount,
            this.stats.maxHealth * 0.3
        );
        this.bloodShieldSystem.active = true;
    }

    applyBloodPlague() {
        this.bloodPlagueTargets.set(this.currentTarget, {
            duration: 24,
            damage: 0.3
        });
    }

    hasBloodPlague() {
        return this.bloodPlagueTargets.has(this.currentTarget);
    }
}

// Frost Death Knight - 냉기 죽음의 기사
class FrostDeathKnight extends Specialization {
    constructor(player) {
        super(player, '냉기');

        // 냉기 특화: 듀얼 웨폰과 냉기 강화
        this.stats = {
            ...this.stats,
            haste: 1.15,
            criticalStrike: 1.2,
            mastery: 1.25
        };

        // 룬 시스템
        this.runeSystem = {
            bloodRunes: 2,
            frostRunes: 2,
            unholyRunes: 2,
            maxRunes: 6,
            runeRegenTime: 10
        };

        // 룬 파워 시스템
        this.resources[RESOURCE_TYPES.RUNIC_POWER] = {
            current: 0,
            max: 100,
            generationRate: 10
        };

        // 살육 머신 시스템
        this.killingMachineSystem = {
            active: false,
            procChance: 0.25,
            critBonus: 1.0
        };

        // 혹한의 바람 시스템
        this.rimeSystem = {
            active: false,
            procChance: 0.45,
            instantCast: true
        };

        // 필멸의 한기 시스템
        this.pillarOfFrostSystem = {
            active: false,
            strengthBonus: 0.25,
            duration: 15,
            cooldown: 60
        };

        // 냉기 열병 추적
        this.frostFeverTargets = new Map();

        // 룬 무기 역능 시스템
        this.empowerRuneWeaponSystem = {
            active: false,
            runeRegenRate: 10,
            cooldown: 120,
            duration: 20
        };

        this.initializeAbilities();
        this.initializeTalents();
        this.initializeRotation();
    }

    initializeAbilities() {
        // 절멸
        this.abilities.obliterate = {
            name: '절멸',
            cost: { runes: 2 },
            damage: 3.8,
            cooldown: 0,
            castTime: 0,
            execute: () => {
                this.consumeRune('frost');
                this.consumeRune('unholy');
                const damage = this.calculateDamage(
                    this.abilities.obliterate.damage,
                    this.killingMachineSystem.active ? 2.0 : 1.0
                );
                this.generateRunicPower(20);
                this.triggerKillingMachine();
                this.killingMachineSystem.active = false;
                return damage;
            }
        };

        // 냉기 강타
        this.abilities.frostStrike = {
            name: '냉기 강타',
            cost: { runicPower: 25 },
            damage: 2.3,
            cooldown: 0,
            castTime: 0,
            execute: () => {
                const damage = this.calculateDamage(this.abilities.frostStrike.damage);
                this.consumeRunicPower(25);
                this.triggerRime();
                return damage;
            }
        };

        // 울부짖는 돌풍
        this.abilities.howlingBlast = {
            name: '울부짖는 돌풍',
            cost: { runes: 1 },
            damage: 1.6,
            cooldown: 0,
            castTime: 3,
            aoe: true,
            execute: () => {
                if (!this.rimeSystem.active) {
                    this.consumeRune('frost');
                } else {
                    this.rimeSystem.active = false;
                }
                const damage = this.calculateDamage(this.abilities.howlingBlast.damage);
                this.generateRunicPower(10);
                this.applyFrostFever();
                return damage;
            }
        };

        // 사멸
        this.abilities.remorselessWinter = {
            name: '사멸',
            cost: { runes: 1 },
            damage: 0.8,
            cooldown: 20,
            duration: 8,
            aoe: true,
            execute: () => {
                this.consumeRune('frost');
                const tickDamage = () => {
                    const damage = this.calculateDamage(this.abilities.remorselessWinter.damage);
                    this.dealDamage(damage);
                    this.applySlowEffect(0.5);
                };
                const winterTick = setInterval(tickDamage, 1000);
                setTimeout(() => clearInterval(winterTick), this.abilities.remorselessWinter.duration * 1000);
                this.generateRunicPower(10);
                return true;
            }
        };

        // 필멸의 한기
        this.abilities.pillarOfFrost = {
            name: '필멸의 한기',
            cooldown: 60,
            duration: 15,
            execute: () => {
                this.pillarOfFrostSystem.active = true;
                this.updateStats({ strength: 1.25 });
                setTimeout(() => {
                    this.pillarOfFrostSystem.active = false;
                    this.updateStats({ strength: 1 });
                }, this.abilities.pillarOfFrost.duration * 1000);
                return true;
            }
        };

        // 룬 무기 역능
        this.abilities.empowerRuneWeapon = {
            name: '룬 무기 역능',
            cooldown: 120,
            duration: 20,
            execute: () => {
                this.empowerRuneWeaponSystem.active = true;
                this.runeSystem.bloodRunes = 2;
                this.runeSystem.frostRunes = 2;
                this.runeSystem.unholyRunes = 2;
                this.resources[RESOURCE_TYPES.RUNIC_POWER].current =
                    Math.min(this.resources[RESOURCE_TYPES.RUNIC_POWER].current + 25,
                           this.resources[RESOURCE_TYPES.RUNIC_POWER].max);
                setTimeout(() => {
                    this.empowerRuneWeaponSystem.active = false;
                }, this.abilities.empowerRuneWeapon.duration * 1000);
                return true;
            }
        };

        // 얼음 발걸음
        this.abilities.pathOfFrost = {
            name: '얼음 발걸음',
            cooldown: 0,
            duration: 600,
            execute: () => {
                this.applyWaterWalking();
                return true;
            }
        };

        // 얼음 사슬
        this.abilities.chainsOfIce = {
            name: '얼음 사슬',
            cost: { runes: 1 },
            cooldown: 0,
            slow: 0.7,
            duration: 8,
            execute: () => {
                this.consumeRune('frost');
                this.applySlowEffect(this.abilities.chainsOfIce.slow,
                                   this.abilities.chainsOfIce.duration);
                return true;
            }
        };

        // 얼음같은 인내
        this.abilities.iceboundFortitude = {
            name: '얼음같은 인내',
            cooldown: 180,
            duration: 8,
            damageReduction: 0.3,
            execute: () => {
                this.applyDamageReduction(this.abilities.iceboundFortitude.damageReduction);
                setTimeout(() => {
                    this.removeDamageReduction();
                }, this.abilities.iceboundFortitude.duration * 1000);
                return true;
            }
        };

        // 냉혹한 겨울 바람
        this.abilities.breathOfSindragosa = {
            name: '냉혹한 겨울 바람',
            cost: { runicPower: 15 },
            damage: 2.0,
            cooldown: 120,
            channeled: true,
            execute: () => {
                const tickDamage = () => {
                    if (this.resources[RESOURCE_TYPES.RUNIC_POWER].current >= 15) {
                        const damage = this.calculateDamage(this.abilities.breathOfSindragosa.damage);
                        this.consumeRunicPower(15);
                        this.dealDamage(damage);
                        return true;
                    }
                    return false;
                };
                const breathTick = setInterval(() => {
                    if (!tickDamage()) {
                        clearInterval(breathTick);
                    }
                }, 1000);
                return true;
            }
        };
    }

    initializeTalents() {
        // 15레벨
        this.talents.coldHeart = {
            name: '차가운 심장',
            level: 15,
            stacks: 0,
            maxStacks: 20,
            damagePerStack: 0.1
        };

        this.talents.runicAttenuation = {
            name: '룬 마력 감쇠',
            level: 15,
            runicPowerGen: 5
        };

        this.talents.icyTalons = {
            name: '얼음 발톱',
            level: 15,
            hastePerStack: 0.03,
            maxStacks: 3
        };

        // 25레벨
        this.talents.hornOfWinter = {
            name: '겨울의 뿔피리',
            level: 25,
            runicPowerGen: 10,
            runeGen: 2,
            cooldown: 45
        };

        this.talents.frozenPulse = {
            name: '얼어붙은 파동',
            level: 25,
            damage: 0.4,
            tickRate: 1
        };

        this.talents.avalanche = {
            name: '눈사태',
            level: 25,
            procChance: 0.15,
            damage: 0.8
        };

        // 30레벨
        this.talents.deathsReach = {
            name: '죽음의 손길',
            level: 30,
            rangeIncrease: 5
        };

        this.talents.asphyxiate = {
            name: '질식',
            level: 30,
            stunDuration: 5,
            cooldown: 45
        };

        this.talents.blindingSleet = {
            name: '실명의 진눈깨비',
            level: 30,
            disorientDuration: 3,
            cooldown: 60
        };

        // 35레벨
        this.talents.inexorableAssault = {
            name: '무자비한 공격',
            level: 35,
            autoAttackDamage: 0.25
        };

        this.talents.frostscythe = {
            name: '냉기 낫',
            level: 35,
            damage: 1.0,
            critBonus: 0.45
        };

        this.talents.gatheredStorm = {
            name: '모여든 폭풍',
            level: 35,
            damagePerStack: 0.1,
            maxStacks: 10
        };

        // 40레벨
        this.talents.permafrost = {
            name: '영구 동토',
            level: 40,
            damageReduction: 0.3
        };

        this.talents.deathPact = {
            name: '죽음의 계약',
            level: 40,
            heal: 0.5,
            cooldown: 120
        };

        this.talents.wraith = {
            name: '망령 보행',
            level: 40,
            speedIncrease: 0.7,
            duration: 4
        };

        // 45레벨
        this.talents.murderousEfficiency = {
            name: '살인적인 효율성',
            level: 45,
            procChance: 0.5
        };

        this.talents.frozenTemper = {
            name: '얼어붙은 성질',
            level: 45,
            runicPowerGen: 5
        };

        this.talents.shatteringStrikes = {
            name: '산산조각 공격',
            level: 45,
            debuff: 0.04,
            duration: 10
        };

        // 50레벨
        this.talents.icecap = {
            name: '빙관',
            level: 50,
            cooldownReduction: 3
        };

        this.talents.obliteration = {
            name: '말살',
            level: 50,
            duration: 10,
            cooldown: 90
        };

        this.talents.breathOfSindragosa = {
            name: '신드라고사의 숨결',
            level: 50,
            implemented: true
        };
    }

    initializeRotation() {
        this.rotation = [
            { ability: 'howlingBlast', condition: () => !this.hasFrostFever() || this.rimeSystem.active },
            { ability: 'remorselessWinter', condition: () => this.isOffCooldown('remorselessWinter') },
            { ability: 'pillarOfFrost', condition: () => this.isBurstWindow() },
            { ability: 'obliterate', condition: () => this.killingMachineSystem.active },
            { ability: 'frostStrike', condition: () => this.resources[RESOURCE_TYPES.RUNIC_POWER].current >= 75 },
            { ability: 'obliterate', condition: () => this.hasAvailableRune('frost') && this.hasAvailableRune('unholy') },
            { ability: 'frostStrike', condition: () => this.resources[RESOURCE_TYPES.RUNIC_POWER].current >= 25 },
            { ability: 'howlingBlast', condition: () => this.hasAvailableRune('frost') && this.isAoE() }
        ];
    }

    triggerKillingMachine() {
        if (Math.random() < this.killingMachineSystem.procChance) {
            this.killingMachineSystem.active = true;
        }
    }

    triggerRime() {
        if (Math.random() < this.rimeSystem.procChance) {
            this.rimeSystem.active = true;
        }
    }

    applyFrostFever() {
        this.frostFeverTargets.set(this.currentTarget, {
            duration: 24,
            damage: 0.25
        });
    }

    hasFrostFever() {
        return this.frostFeverTargets.has(this.currentTarget);
    }
}

// Unholy Death Knight - 부정 죽음의 기사
class UnholyDeathKnight extends Specialization {
    constructor(player) {
        super(player, '부정');

        // 부정 특화: 질병과 언데드 소환
        this.stats = {
            ...this.stats,
            haste: 1.1,
            mastery: 1.3,
            shadowDamage: 1.15
        };

        // 룬 시스템
        this.runeSystem = {
            bloodRunes: 2,
            frostRunes: 2,
            unholyRunes: 2,
            maxRunes: 6,
            runeRegenTime: 10
        };

        // 룬 파워 시스템
        this.resources[RESOURCE_TYPES.RUNIC_POWER] = {
            current: 0,
            max: 100,
            generationRate: 10
        };

        // 고름 상처 시스템
        this.festringWoundSystem = {
            stacks: 0,
            maxStacks: 6,
            damagePerBurst: 0.25,
            applyChance: 0.5
        };

        // 언데드 군대 시스템
        this.armyOfTheDeadSystem = {
            active: false,
            ghoulCount: 0,
            maxGhouls: 8,
            duration: 40,
            cooldown: 480
        };

        // 어둠 변신 시스템
        this.darkTransformationSystem = {
            active: false,
            energy: 0,
            maxEnergy: 100,
            duration: 60,
            damageBonus: 0.5
        };

        // 악성 역병 추적
        this.virulentPlagueTargets = new Map();

        // 구울 시스템
        this.ghoulSystem = {
            active: true,
            health: 1.0,
            damage: 1.0,
            duration: 'permanent'
        };

        // 불사의 의지 시스템
        this.unholyPresenceSystem = {
            active: true,
            hasteBonus: 0.1,
            movementSpeed: 0.15
        };

        this.initializeAbilities();
        this.initializeTalents();
        this.initializeRotation();
    }

    initializeAbilities() {
        // 고름 일격
        this.abilities.festeringStrike = {
            name: '고름 일격',
            cost: { runes: 2 },
            damage: 2.4,
            cooldown: 0,
            castTime: 0,
            execute: () => {
                this.consumeRune('frost');
                this.consumeRune('unholy');
                const damage = this.calculateDamage(this.abilities.festeringStrike.damage);
                this.generateRunicPower(20);
                this.applyFesteringWounds(2 + Math.floor(Math.random() * 3));
                return damage;
            }
        };

        // 스컬지 일격
        this.abilities.scourgeStrike = {
            name: '스컬지 일격',
            cost: { runes: 1 },
            damage: 2.2,
            cooldown: 0,
            castTime: 0,
            execute: () => {
                this.consumeRune('unholy');
                const physicalDamage = this.calculateDamage(this.abilities.scourgeStrike.damage * 0.5);
                const shadowDamage = this.calculateDamage(this.abilities.scourgeStrike.damage * 0.5, 'shadow');
                this.generateRunicPower(15);
                this.burstFesteringWounds(1);
                return physicalDamage + shadowDamage;
            }
        };

        // 죽음의 고리
        this.abilities.deathCoil = {
            name: '죽음의 고리',
            cost: { runicPower: 30 },
            damage: 1.8,
            cooldown: 0,
            castTime: 0,
            execute: () => {
                const damage = this.calculateDamage(this.abilities.deathCoil.damage, 'shadow');
                this.consumeRunicPower(30);
                this.energizeGhoul(10);
                return damage;
            }
        };

        // 전염병 일격
        this.abilities.outbreak = {
            name: '전염병 일격',
            cost: { runes: 1 },
            damage: 0.8,
            cooldown: 0,
            castTime: 0,
            execute: () => {
                this.consumeRune('unholy');
                const damage = this.calculateDamage(this.abilities.outbreak.damage, 'shadow');
                this.applyVirulentPlague();
                this.generateRunicPower(10);
                return damage;
            }
        };

        // 죽음과 부패
        this.abilities.deathAndDecay = {
            name: '죽음과 부패',
            cost: { runes: 1 },
            damage: 0.4,
            cooldown: 30,
            duration: 10,
            aoe: true,
            execute: () => {
                this.consumeRune('unholy');
                const tickDamage = () => {
                    const damage = this.calculateDamage(this.abilities.deathAndDecay.damage, 'shadow');
                    this.dealDamage(damage);
                    if (this.ghoulSystem.active) {
                        this.energizeGhoul(2);
                    }
                };
                const decayTick = setInterval(tickDamage, 1000);
                setTimeout(() => clearInterval(decayTick), this.abilities.deathAndDecay.duration * 1000);
                this.generateRunicPower(10);
                return true;
            }
        };

        // 언데드 군대
        this.abilities.armyOfTheDead = {
            name: '언데드 군대',
            cooldown: 480,
            duration: 40,
            execute: () => {
                this.armyOfTheDeadSystem.active = true;
                this.armyOfTheDeadSystem.ghoulCount = 8;
                const armyDamage = setInterval(() => {
                    const damage = this.calculateDamage(0.3 * this.armyOfTheDeadSystem.ghoulCount);
                    this.dealDamage(damage);
                }, 1000);
                setTimeout(() => {
                    clearInterval(armyDamage);
                    this.armyOfTheDeadSystem.active = false;
                    this.armyOfTheDeadSystem.ghoulCount = 0;
                }, this.abilities.armyOfTheDead.duration * 1000);
                return true;
            }
        };

        // 어둠 변신
        this.abilities.darkTransformation = {
            name: '어둠 변신',
            cooldown: 60,
            duration: 60,
            execute: () => {
                if (this.darkTransformationSystem.energy >= 100) {
                    this.darkTransformationSystem.active = true;
                    this.ghoulSystem.damage *= 1.5;
                    setTimeout(() => {
                        this.darkTransformationSystem.active = false;
                        this.ghoulSystem.damage /= 1.5;
                        this.darkTransformationSystem.energy = 0;
                    }, this.abilities.darkTransformation.duration * 1000);
                    return true;
                }
                return false;
            }
        };

        // 묵시의 종말
        this.abilities.apocalypse = {
            name: '묵시의 종말',
            cooldown: 75,
            execute: () => {
                const wounds = this.festringWoundSystem.stacks;
                this.burstFesteringWounds(wounds);
                this.summonApocalypseGhouls(wounds);
                return wounds;
            }
        };

        // 구울 되살리기
        this.abilities.raiseAlly = {
            name: '구울 되살리기',
            cooldown: 600,
            execute: () => {
                this.ressurectAlly();
                return true;
            }
        };

        // 대마법 보호막
        this.abilities.antiMagicShell = {
            name: '대마법 보호막',
            cooldown: 60,
            duration: 5,
            absorb: 0.3,
            execute: () => {
                this.applyMagicAbsorb(this.abilities.antiMagicShell.absorb);
                setTimeout(() => {
                    this.removeMagicAbsorb();
                }, this.abilities.antiMagicShell.duration * 1000);
                return true;
            }
        };
    }

    initializeTalents() {
        // 15레벨
        this.talents.infectedClaws = {
            name: '감염된 발톱',
            level: 15,
            effect: () => {
                this.ghoulSystem.bleedChance = 0.3;
            }
        };

        this.talents.allWillServe = {
            name: '모두가 섬기리라',
            level: 15,
            additionalMinion: true
        };

        this.talents.clawingShadows = {
            name: '그림자 발톱',
            level: 15,
            rangeIncrease: 10,
            shadowDamage: 0.3
        };

        // 25레벨
        this.talents.burstingSores = {
            name: '폭발하는 염증',
            level: 25,
            damage: 0.15,
            radius: 10
        };

        this.talents.epidemicField = {
            name: '전염병 지대',
            level: 25,
            damage: 0.1,
            duration: 10,
            cooldown: 30
        };

        this.talents.unholyBlight = {
            name: '부정한 역병',
            level: 25,
            damage: 0.5,
            dotDuration: 14,
            cooldown: 45
        };

        // 30레벨
        this.talents.deathsReach = {
            name: '죽음의 손길',
            level: 30,
            rangeIncrease: 5
        };

        this.talents.asphyxiate = {
            name: '질식',
            level: 30,
            stunDuration: 5,
            cooldown: 45
        };

        this.talents.gripOfTheDead = {
            name: '죽음의 손아귀',
            level: 30,
            slow: 0.5,
            duration: 3
        };

        // 35레벨
        this.talents.pestilence = {
            name: '흑사병',
            level: 35,
            spreadRadius: 10
        };

        this.talents.harbigerOfDoom = {
            name: '파멸의 선구자',
            level: 35,
            tickRate: 1.5
        };

        this.talents.soulReaper = {
            name: '영혼 수확자',
            level: 35,
            damage: 2.5,
            executeThreshold: 0.35,
            cooldown: 6
        };

        // 40레벨
        this.talents.spellEater = {
            name: '마법 포식자',
            level: 40,
            absorb: 0.2,
            runicPowerGen: 5
        };

        this.talents.wraithWalk = {
            name: '망령 보행',
            level: 40,
            speedIncrease: 0.7,
            duration: 4
        };

        this.talents.deathPact = {
            name: '죽음의 계약',
            level: 40,
            heal: 0.5,
            cooldown: 120
        };

        // 45레벨
        this.talents.pestilentPustules = {
            name: '고름 농포',
            level: 45,
            runeRefund: true,
            threshold: 3
        };

        this.talents.blightedRuneWeapon = {
            name: '부패한 룬 무기',
            level: 45,
            procChance: 0.33
        };

        this.talents.unholyFrenzy = {
            name: '부정한 격노',
            level: 45,
            hasteBonus: 0.15,
            duration: 12,
            cooldown: 75
        };

        // 50레벨
        this.talents.armyOfTheDamned = {
            name: '저주받은 군대',
            level: 50,
            cooldownReduction: 5,
            additionalMinions: 1
        };

        this.talents.summonGargoyle = {
            name: '가고일 소환',
            level: 50,
            damage: 0.5,
            duration: 30,
            cooldown: 180
        };

        this.talents.unholyAssault = {
            name: '부정한 습격',
            level: 50,
            damage: 1.8,
            duration: 20,
            cooldown: 75
        };
    }

    initializeRotation() {
        this.rotation = [
            { ability: 'outbreak', condition: () => !this.hasVirulentPlague() },
            { ability: 'darkTransformation', condition: () => this.darkTransformationSystem.energy >= 100 },
            { ability: 'deathAndDecay', condition: () => this.isOffCooldown('deathAndDecay') && this.isAoE() },
            { ability: 'festeringStrike', condition: () => this.festringWoundSystem.stacks < 4 },
            { ability: 'apocalypse', condition: () => this.festringWoundSystem.stacks >= 4 && this.isBurstWindow() },
            { ability: 'deathCoil', condition: () => this.resources[RESOURCE_TYPES.RUNIC_POWER].current >= 80 },
            { ability: 'scourgeStrike', condition: () => this.festringWoundSystem.stacks >= 1 },
            { ability: 'deathCoil', condition: () => this.resources[RESOURCE_TYPES.RUNIC_POWER].current >= 30 },
            { ability: 'armyOfTheDead', condition: () => this.isMajorBurstWindow() }
        ];
    }

    applyFesteringWounds(count) {
        this.festringWoundSystem.stacks = Math.min(
            this.festringWoundSystem.stacks + count,
            this.festringWoundSystem.maxStacks
        );
    }

    burstFesteringWounds(count) {
        const woundsToBurst = Math.min(count, this.festringWoundSystem.stacks);
        for (let i = 0; i < woundsToBurst; i++) {
            const damage = this.calculateDamage(this.festringWoundSystem.damagePerBurst, 'shadow');
            this.dealDamage(damage);
        }
        this.festringWoundSystem.stacks -= woundsToBurst;
        return woundsToBurst;
    }

    applyVirulentPlague() {
        this.virulentPlagueTargets.set(this.currentTarget, {
            duration: 'infinite',
            damage: 0.3,
            tickRate: 1
        });
    }

    hasVirulentPlague() {
        return this.virulentPlagueTargets.has(this.currentTarget);
    }

    energizeGhoul(amount) {
        if (this.ghoulSystem.active) {
            this.darkTransformationSystem.energy = Math.min(
                this.darkTransformationSystem.energy + amount,
                this.darkTransformationSystem.maxEnergy
            );
        }
    }

    summonApocalypseGhouls(count) {
        // 묵시의 종말 구울 소환
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const ghoulDamage = this.calculateDamage(0.5);
                this.dealDamage(ghoulDamage);
            }, i * 500);
        }
    }
}

module.exports = {
    BloodDeathKnight,
    FrostDeathKnight,
    UnholyDeathKnight
};