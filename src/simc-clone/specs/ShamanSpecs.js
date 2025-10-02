// Shaman Specialization Implementations
// Elemental: 원거리 DPS 전문화 - 원소의 힘
// Enhancement: 근접 DPS 전문화 - 강화와 폭풍
// Restoration: 치유 전문화 - 토템과 물 치유

const { Specialization } = require('../core/Specialization');
const { RESOURCE_TYPES } = require('../core/ResourceSystem');

// Elemental Shaman - 정기 주술사
class ElementalShaman extends Specialization {
    constructor(player) {
        super(player, '정기');

        // 정기 특화: 원소의 과부하
        this.stats = {
            ...this.stats,
            intellect: 1.05,
            criticalStrike: 1.2,
            haste: 1.15,
            mastery: 1.25
        };

        // 소용돌이 값 시스템
        this.resources[RESOURCE_TYPES.MAELSTROM] = {
            current: 0,
            max: 100,
            generationRate: 0
        };

        // 화염 충격 도트 추적
        this.flameShockTargets = new Map();

        // 원소 정령 시스템
        this.elementalSystem = {
            fireElemental: {
                active: false,
                duration: 30,
                cooldown: 150,
                damageBonus: 0.3
            },
            stormElemental: {
                active: false,
                duration: 30,
                cooldown: 150,
                damageBonus: 0.3
            },
            earthElemental: {
                active: false,
                duration: 60,
                cooldown: 300,
                taunt: true
            }
        };

        // 운명의 메아리 시스템
        this.echoesOfGreatSunderingSystem = {
            active: false,
            charges: 0,
            maxCharges: 2,
            damageBonus: 0.5
        };

        // 상급 정령 시스템
        this.ascendanceSystem = {
            active: false,
            duration: 15,
            cooldown: 180,
            lavaBurstBonus: 2.0
        };

        // 번개 막대 시스템
        this.lightningRodSystem = {
            active: false,
            target: null,
            damageEcho: 0.2
        };

        // 폭풍의 수호자 시스템
        this.stormkeeperSystem = {
            active: false,
            charges: 2,
            instantCast: true,
            damageBonus: 1.5,
            cooldown: 60
        };

        // 원소 폭발 시스템
        this.elementalBlastSystem = {
            cooldown: 12,
            stats: ['haste', 'crit', 'mastery'],
            buffDuration: 10,
            buffValue: 0.16
        };

        // 대지의 정령 시스템
        this.earthShockSystem = {
            damage: 2.8,
            cost: 60,
            execute: 'builder'
        };

        this.initializeAbilities();
        this.initializeTalents();
        this.initializeRotation();
    }

    initializeAbilities() {
        // 번개 화살
        this.abilities.lightningBolt = {
            name: '번개 화살',
            cost: 0,
            damage: 1.5,
            castTime: 2,
            maelstromGen: 8,
            execute: () => {
                const damage = this.calculateDamage(this.abilities.lightningBolt.damage, 'nature');
                this.generateMaelstrom(this.abilities.lightningBolt.maelstromGen);

                // 폭풍의 수호자 소비
                if (this.stormkeeperSystem.charges > 0) {
                    this.stormkeeperSystem.charges--;
                    return damage * this.stormkeeperSystem.damageBonus;
                }

                return damage;
            }
        };

        // 연쇄 번개
        this.abilities.chainLightning = {
            name: '연쇄 번개',
            cost: 0,
            damage: 0.8,
            castTime: 2,
            maelstromGen: 4,
            jumps: 3,
            execute: () => {
                const damage = this.calculateDamage(this.abilities.chainLightning.damage, 'nature');
                this.generateMaelstrom(this.abilities.chainLightning.maelstromGen * this.abilities.chainLightning.jumps);

                // 폭풍의 수호자 소비
                if (this.stormkeeperSystem.charges > 0) {
                    this.stormkeeperSystem.charges--;
                    return damage * this.abilities.chainLightning.jumps * this.stormkeeperSystem.damageBonus;
                }

                return damage * this.abilities.chainLightning.jumps;
            }
        };

        // 용암 폭발
        this.abilities.lavaBurst = {
            name: '용암 폭발',
            cooldown: 8,
            charges: 2,
            damage: 2.2,
            castTime: 2,
            maelstromGen: 10,
            execute: () => {
                const damage = this.calculateDamage(
                    this.abilities.lavaBurst.damage,
                    'fire',
                    this.hasFlameShock() ? 2.0 : 1.0 // 화염 충격 대상에게 치명타
                );
                this.generateMaelstrom(this.abilities.lavaBurst.maelstromGen);

                // 상급 정령 시 추가 용암 폭발
                if (this.ascendanceSystem.active) {
                    return damage * this.ascendanceSystem.lavaBurstBonus;
                }

                return damage;
            }
        };

        // 화염 충격
        this.abilities.flameShock = {
            name: '화염 충격',
            cost: 0,
            damage: 0.5,
            dotDamage: 0.15,
            duration: 18,
            maelstromGen: 0,
            execute: () => {
                const damage = this.calculateDamage(this.abilities.flameShock.damage, 'fire');
                this.applyFlameShock();
                return damage;
            }
        };

        // 대지 충격
        this.abilities.earthShock = {
            name: '대지 충격',
            cost: { maelstrom: 60 },
            damage: 2.8,
            execute: () => {
                if (!this.consumeMaelstrom(60)) return 0;
                const damage = this.calculateDamage(this.abilities.earthShock.damage, 'nature');
                return damage;
            }
        };

        // 원소 폭발
        this.abilities.elementalBlast = {
            name: '원소 폭발',
            cooldown: 12,
            damage: 3.0,
            castTime: 2,
            execute: () => {
                const damage = this.calculateDamage(this.abilities.elementalBlast.damage, 'elemental');

                // 랜덤 스탯 버프
                const randomStat = this.elementalBlastSystem.stats[Math.floor(Math.random() * 3)];
                this.applyStatBuff(randomStat, this.elementalBlastSystem.buffValue,
                                  this.elementalBlastSystem.buffDuration);

                return damage;
            }
        };

        // 지진
        this.abilities.earthquake = {
            name: '지진',
            cost: { maelstrom: 60 },
            damage: 0.3,
            duration: 6,
            radius: 8,
            execute: () => {
                if (!this.consumeMaelstrom(60)) return 0;

                const tickDamage = () => {
                    const damage = this.calculateDamage(this.abilities.earthquake.damage, 'nature');
                    this.dealDamage(damage);
                    this.applyKnockdown(0.1); // 10% 넘어뜨리기
                };

                const earthquakeTick = setInterval(tickDamage, 1000);
                setTimeout(() => clearInterval(earthquakeTick), this.abilities.earthquake.duration * 1000);

                return true;
            }
        };

        // 폭풍의 수호자
        this.abilities.stormkeeper = {
            name: '폭풍의 수호자',
            cooldown: 60,
            charges: 2,
            execute: () => {
                this.stormkeeperSystem.active = true;
                this.stormkeeperSystem.charges = 2;
                return true;
            }
        };

        // 상급 정령
        this.abilities.ascendance = {
            name: '상급 정령',
            cooldown: 180,
            duration: 15,
            execute: () => {
                this.ascendanceSystem.active = true;
                this.updateStats({ haste: 1.15 });

                // 용암 폭발 즉시 시전
                this.abilities.lavaBurst.castTime = 0;

                setTimeout(() => {
                    this.ascendanceSystem.active = false;
                    this.updateStats({ haste: 1 });
                    this.abilities.lavaBurst.castTime = 2;
                }, this.abilities.ascendance.duration * 1000);

                return true;
            }
        };

        // 불의 정령
        this.abilities.fireElemental = {
            name: '불의 정령',
            cooldown: 150,
            duration: 30,
            execute: () => {
                this.elementalSystem.fireElemental.active = true;

                const elementalDamage = setInterval(() => {
                    const damage = this.calculateDamage(0.5, 'fire');
                    this.dealDamage(damage);
                }, 1000);

                setTimeout(() => {
                    clearInterval(elementalDamage);
                    this.elementalSystem.fireElemental.active = false;
                }, this.abilities.fireElemental.duration * 1000);

                return true;
            }
        };

        // 대지의 정령
        this.abilities.earthElemental = {
            name: '대지의 정령',
            cooldown: 300,
            duration: 60,
            execute: () => {
                this.elementalSystem.earthElemental.active = true;

                // 도발 효과
                this.tauntTarget();

                setTimeout(() => {
                    this.elementalSystem.earthElemental.active = false;
                }, this.abilities.earthElemental.duration * 1000);

                return true;
            }
        };

        // 천둥폭풍
        this.abilities.thunderstorm = {
            name: '천둥폭풍',
            cooldown: 45,
            damage: 1.0,
            knockback: 20,
            execute: () => {
                const damage = this.calculateDamage(this.abilities.thunderstorm.damage, 'nature');
                this.applyKnockback(this.abilities.thunderstorm.knockback);
                return damage;
            }
        };

        // 정화의 영혼
        this.abilities.spiritWalk = {
            name: '정화의 영혼',
            cooldown: 60,
            duration: 8,
            execute: () => {
                this.removeMovementImpairment();
                this.applyFreedom(this.abilities.spiritWalk.duration);
                return true;
            }
        };
    }

    initializeTalents() {
        // 15레벨
        this.talents.earthenRage = {
            name: '대지의 격노',
            level: 15,
            damage: 0.08,
            procChance: 0.2
        };

        this.talents.echoOfTheElements = {
            name: '원소의 메아리',
            level: 15,
            doublecastChance: 0.1
        };

        this.talents.elementalBlast2 = {
            name: '원소 폭발',
            level: 15,
            implemented: true
        };

        // 25레벨
        this.talents.aftershock = {
            name: '여진',
            level: 25,
            refundChance: 0.25
        };

        this.talents.callTheThunder = {
            name: '천둥 소환',
            level: 25,
            maelstromOnKill: 15
        };

        this.talents.totemMastery = {
            name: '토템 숙련',
            level: 25,
            totems: 4,
            buffs: ['haste', 'damage', 'maelstrom', 'crit']
        };

        // 30레벨
        this.talents.spiritWolf = {
            name: '늑대 정령',
            level: 30,
            damageReduction: 0.2,
            speedBonus: 0.2
        };

        this.talents.earthShield = {
            name: '대지의 보호막',
            level: 30,
            charges: 9,
            heal: 0.1,
            damageReduction: 0.1
        };

        this.talents.staticCharge = {
            name: '전하 충전',
            level: 30,
            capacitorReduction: 5,
            damageBonus: 0.3
        };

        // 35레벨
        this.talents.masterOfTheElements = {
            name: '원소의 대가',
            level: 35,
            damageBonus: 0.2,
            procOnLavaBurst: true
        };

        this.talents.stormElemental = {
            name: '폭풍의 정령',
            level: 35,
            duration: 30,
            cooldown: 150
        };

        this.talents.liquidMagmaTotem = {
            name: '용암 폭발 토템',
            level: 35,
            damage: 0.5,
            duration: 15,
            cooldown: 60
        };

        // 40레벨
        this.talents.naturesGuardian = {
            name: '자연의 수호자',
            level: 40,
            autoHeal: 0.2,
            threshold: 0.35
        };

        this.talents.ancestralGuidance = {
            name: '고대의 인도',
            level: 40,
            healConversion: 0.6,
            duration: 10,
            cooldown: 120
        };

        this.talents.windRushTotem = {
            name: '질풍 토템',
            level: 40,
            speedBonus: 0.6,
            duration: 15,
            cooldown: 120
        };

        // 45레벨
        this.talents.surgeOfPower = {
            name: '힘의 쇄도',
            level: 45,
            nextSpellBonus: 1,
            bonusType: 'instant'
        };

        this.talents.primalElementalist = {
            name: '원시 정령술사',
            level: 45,
            elementalBonus: 0.8,
            controlAbilities: true
        };

        this.talents.icefury = {
            name: '얼음격노',
            level: 45,
            damage: 2.0,
            frostShockCharges: 4,
            maelstromGen: 25
        };

        // 50레벨
        this.talents.unlimitedPower = {
            name: '무한한 힘',
            level: 50,
            hastePerStack: 0.02,
            maxStacks: 10
        };

        this.talents.stormkeeper2 = {
            name: '폭풍의 수호자',
            level: 50,
            implemented: true
        };

        this.talents.ascendance2 = {
            name: '상급 정령',
            level: 50,
            implemented: true
        };
    }

    initializeRotation() {
        this.rotation = [
            { ability: 'flameShock', condition: () => !this.hasFlameShock() },
            { ability: 'fireElemental', condition: () => this.isBurstWindow() },
            { ability: 'stormkeeper', condition: () => this.isOffCooldown('stormkeeper') },
            { ability: 'ascendance', condition: () => this.isBurstWindow() && this.isOffCooldown('ascendance') },
            { ability: 'lavaBurst', condition: () => this.hasFlameShock() },
            { ability: 'earthShock', condition: () => this.resources[RESOURCE_TYPES.MAELSTROM].current >= 60 },
            { ability: 'earthquake', condition: () => this.resources[RESOURCE_TYPES.MAELSTROM].current >= 60 && this.isAoE() },
            { ability: 'elementalBlast', condition: () => this.hasTalent('elementalBlast') && this.isOffCooldown('elementalBlast') },
            { ability: 'chainLightning', condition: () => this.isAoE() },
            { ability: 'lightningBolt', condition: () => true }
        ];
    }

    generateMaelstrom(amount) {
        this.resources[RESOURCE_TYPES.MAELSTROM].current = Math.min(
            this.resources[RESOURCE_TYPES.MAELSTROM].current + amount,
            this.resources[RESOURCE_TYPES.MAELSTROM].max
        );
    }

    consumeMaelstrom(amount) {
        if (this.resources[RESOURCE_TYPES.MAELSTROM].current >= amount) {
            this.resources[RESOURCE_TYPES.MAELSTROM].current -= amount;
            return true;
        }
        return false;
    }

    applyFlameShock() {
        this.flameShockTargets.set(this.currentTarget, {
            duration: 18,
            damage: 0.15,
            tickRate: 2
        });
    }

    hasFlameShock() {
        return this.flameShockTargets.has(this.currentTarget);
    }

    applyStatBuff(stat, value, duration) {
        // 스탯 버프 적용
    }
}

// Enhancement Shaman - 고양 주술사
class EnhancementShaman extends Specialization {
    constructor(player) {
        super(player, '고양');

        // 고양 특화: 소용돌이 무기
        this.stats = {
            ...this.stats,
            agility: 1.05,
            criticalStrike: 1.2,
            haste: 1.15,
            mastery: 1.25
        };

        // 소용돌이 값 시스템
        this.resources[RESOURCE_TYPES.MAELSTROM] = {
            current: 0,
            max: 100,
            generationRate: 0
        };

        // 소용돌이 무기 시스템
        this.maelstromWeaponSystem = {
            stacks: 0,
            maxStacks: 10,
            instantCastStacks: 5,
            damageBonus: 0.2
        };

        // 무기 강화 시스템
        this.weaponEnhancementSystem = {
            mainHand: 'windfury',
            offHand: 'flametongue',
            windfuryProc: 0.2,
            flametongueDamage: 0.1
        };

        // 늑대 정령 시스템
        this.feralSpiritSystem = {
            active: false,
            wolves: 2,
            duration: 15,
            cooldown: 120,
            damagePercent: 0.3
        };

        // 뜨거운 손 시스템
        this.hotHandSystem = {
            active: false,
            procChance: 0.05,
            resetChance: 1.0
        };

        // 정령 걷기 시스템
        this.spiritWalkSystem = {
            active: false,
            duration: 8,
            cooldown: 60
        };

        // 폭풍의 일격 시스템
        this.stormstrikeSystem = {
            damage: 2.8,
            cost: 30,
            cooldown: 9,
            debuffDuration: 15
        };

        // 용암 채찍 시스템
        this.lavaLashSystem = {
            damage: 1.8,
            cost: 20,
            hotHandDamage: 2.0
        };

        // 번개 화살/연쇄 번개 즉시 시전
        this.instantCastSystem = {
            available: false,
            stacks: 0
        };

        // 화염 충격 도트 추적
        this.flameShockTargets = new Map();

        // 충돌 시스템
        this.crashLightningSystem = {
            damage: 1.5,
            cost: 20,
            radius: 8,
            buffDuration: 10
        };

        this.initializeAbilities();
        this.initializeTalents();
        this.initializeRotation();
    }

    initializeAbilities() {
        // 폭풍의 일격
        this.abilities.stormstrike = {
            name: '폭풍의 일격',
            cost: { maelstrom: 30 },
            damage: 2.8,
            cooldown: 9,
            execute: () => {
                if (!this.consumeMaelstrom(30)) return 0;
                const damage = this.calculateDamage(this.abilities.stormstrike.damage);

                // 폭풍의 일격 디버프
                this.applyStormstrikeDebuff();

                return damage;
            }
        };

        // 용암 채찍
        this.abilities.lavaLash = {
            name: '용암 채찍',
            cost: { maelstrom: 20 },
            damage: 1.8,
            execute: () => {
                if (!this.consumeMaelstrom(20)) return 0;

                let damage = this.abilities.lavaLash.damage;
                if (this.hotHandSystem.active) {
                    damage = this.lavaLashSystem.hotHandDamage;
                    this.hotHandSystem.active = false;
                }

                return this.calculateDamage(damage, 'fire');
            }
        };

        // 번개 화살
        this.abilities.lightningBolt = {
            name: '번개 화살',
            cost: 0,
            damage: 1.2,
            castTime: 2.5,
            maelstromGen: 8,
            execute: () => {
                // 소용돌이 무기로 즉시 시전
                if (this.maelstromWeaponSystem.stacks >= 5) {
                    this.maelstromWeaponSystem.stacks -= 5;
                    const damage = this.calculateDamage(
                        this.abilities.lightningBolt.damage * (1 + this.maelstromWeaponSystem.damageBonus),
                        'nature'
                    );
                    return damage;
                }

                const damage = this.calculateDamage(this.abilities.lightningBolt.damage, 'nature');
                this.generateMaelstrom(this.abilities.lightningBolt.maelstromGen);
                return damage;
            }
        };

        // 연쇄 번개
        this.abilities.chainLightning = {
            name: '연쇄 번개',
            cost: 0,
            damage: 0.6,
            castTime: 2,
            jumps: 3,
            maelstromGen: 4,
            execute: () => {
                // 소용돌이 무기로 즉시 시전
                if (this.maelstromWeaponSystem.stacks >= 5) {
                    this.maelstromWeaponSystem.stacks -= 5;
                    const damage = this.calculateDamage(
                        this.abilities.chainLightning.damage * (1 + this.maelstromWeaponSystem.damageBonus),
                        'nature'
                    );
                    return damage * this.abilities.chainLightning.jumps;
                }

                const damage = this.calculateDamage(this.abilities.chainLightning.damage, 'nature');
                this.generateMaelstrom(this.abilities.chainLightning.maelstromGen * this.abilities.chainLightning.jumps);
                return damage * this.abilities.chainLightning.jumps;
            }
        };

        // 충돌
        this.abilities.crashLightning = {
            name: '충돌',
            cost: { maelstrom: 20 },
            damage: 1.5,
            radius: 8,
            execute: () => {
                if (!this.consumeMaelstrom(20)) return 0;
                const damage = this.calculateDamage(this.abilities.crashLightning.damage, 'nature');

                // 충돌 버프
                this.applyCrashLightningBuff();

                return damage;
            }
        };

        // 늑대 정령
        this.abilities.feralSpirit = {
            name: '늑대 정령',
            cooldown: 120,
            duration: 15,
            execute: () => {
                this.feralSpiritSystem.active = true;

                const wolvesDamage = setInterval(() => {
                    const damage = this.calculateDamage(0.3);
                    this.dealDamage(damage * this.feralSpiritSystem.wolves);
                }, 1000);

                setTimeout(() => {
                    clearInterval(wolvesDamage);
                    this.feralSpiritSystem.active = false;
                }, this.abilities.feralSpirit.duration * 1000);

                return true;
            }
        };

        // 정령 걷기
        this.abilities.spiritWalk = {
            name: '정령 걷기',
            cooldown: 60,
            duration: 8,
            execute: () => {
                this.spiritWalkSystem.active = true;
                this.removeMovementImpairment();
                this.applyFreedom(this.abilities.spiritWalk.duration);

                setTimeout(() => {
                    this.spiritWalkSystem.active = false;
                }, this.abilities.spiritWalk.duration * 1000);

                return true;
            }
        };

        // 화염 충격
        this.abilities.flameShock = {
            name: '화염 충격',
            cost: 0,
            damage: 0.5,
            dotDamage: 0.12,
            duration: 18,
            execute: () => {
                const damage = this.calculateDamage(this.abilities.flameShock.damage, 'fire');
                this.applyFlameShock();
                return damage;
            }
        };

        // 무기 마법부여 갱신
        this.abilities.flametongueWeapon = {
            name: '화염 혀 무기',
            execute: () => {
                this.weaponEnhancementSystem.offHand = 'flametongue';
                return true;
            }
        };

        this.abilities.windfuryWeapon = {
            name: '질풍 무기',
            execute: () => {
                this.weaponEnhancementSystem.mainHand = 'windfury';
                return true;
            }
        };

        // 원소 폭발
        this.abilities.elementalBlast = {
            name: '원소 폭발',
            cooldown: 60,
            damage: 4.0,
            execute: () => {
                const damage = this.calculateDamage(this.abilities.elementalBlast.damage, 'elemental');
                this.generateMaelstromWeaponStacks(2);
                return damage;
            }
        };

        // 대지의 정령
        this.abilities.earthElemental = {
            name: '대지의 정령',
            cooldown: 300,
            duration: 60,
            execute: () => {
                // 도발 효과
                this.tauntTarget();
                return true;
            }
        };

        // 선대의 인도
        this.abilities.ancestralGuidance = {
            name: '선대의 인도',
            cooldown: 120,
            duration: 10,
            healConversion: 0.6,
            execute: () => {
                // 피해의 60%를 치유로 전환
                this.enableHealingConversion(this.abilities.ancestralGuidance.healConversion,
                                            this.abilities.ancestralGuidance.duration);
                return true;
            }
        };
    }

    initializeTalents() {
        // 15레벨
        this.talents.lashingShields = {
            name: '후려치는 방패',
            level: 15,
            lightningShield: true,
            damage: 0.2
        };

        this.talents.elementalWeapons = {
            name: '원소 무기',
            level: 15,
            flametongueBonus: 0.05,
            windfuryProc: 0.05
        };

        this.talents.hotHand = {
            name: '뜨거운 손',
            level: 15,
            procChance: 0.05,
            lavaLashReset: true
        };

        // 25레벨
        this.talents.crashLightning2 = {
            name: '충돌',
            level: 25,
            implemented: true
        };

        this.talents.fireNova = {
            name: '화염 회오리',
            level: 25,
            damage: 1.0,
            flameShockSpread: true
        };

        this.talents.elementalBlast3 = {
            name: '원소 폭발',
            level: 25,
            implemented: true
        };

        // 30레벨
        this.talents.spiritWolf = {
            name: '늑대 정령',
            level: 30,
            damageReduction: 0.2,
            speedBonus: 0.2
        };

        this.talents.earthShield = {
            name: '대지의 보호막',
            level: 30,
            charges: 9,
            heal: 0.1,
            damageReduction: 0.1
        };

        this.talents.staticCharge = {
            name: '전하 충전',
            level: 30,
            capacitorReduction: 5,
            damageBonus: 0.3
        };

        // 35레벨
        this.talents.elementalBlast4 = {
            name: '원소 격발',
            level: 35,
            maelstromGen: 3
        };

        this.talents.hailstorm = {
            name: '우박폭풍',
            level: 35,
            frostWeapon: true,
            damageBonus: 0.15
        };

        this.talents.primalSpirits = {
            name: '원시 정령',
            level: 35,
            additionalWolf: 1,
            durationBonus: 0.15
        };

        // 40레벨
        this.talents.naturesGuardian = {
            name: '자연의 수호자',
            level: 40,
            autoHeal: 0.2,
            threshold: 0.35
        };

        this.talents.ancestralGuidance2 = {
            name: '선대의 인도',
            level: 40,
            implemented: true
        };

        this.talents.windRushTotem = {
            name: '질풍 토템',
            level: 40,
            speedBonus: 0.6,
            duration: 15,
            cooldown: 120
        };

        // 45레벨
        this.talents.crazingCurrts = {
            name: '강화 해류',
            level: 45,
            hasteBonus: 0.03,
            duration: 15
        };

        this.talents.alphaWolf = {
            name: '우두머리 늑대',
            level: 45,
            crashLightningLeap: true,
            damageBonus: 0.15
        };

        this.talents.elementalSpirits = {
            name: '원소 정령',
            level: 45,
            wolfElement: 'random',
            bonusEffect: true
        };

        // 50레벨
        this.talents.earthenSpike = {
            name: '대지의 쐐기',
            level: 50,
            damage: 2.0,
            debuffDuration: 10,
            damageIncrease: 0.2
        };

        this.talents.sundering = {
            name: '분쇄',
            level: 50,
            damage: 3.5,
            cooldown: 40,
            radius: 11
        };

        this.talents.elementalSpirits2 = {
            name: '정령들',
            level: 50,
            procChance: 0.2,
            bonusStats: true
        };
    }

    initializeRotation() {
        this.rotation = [
            { ability: 'flameShock', condition: () => !this.hasFlameShock() },
            { ability: 'feralSpirit', condition: () => this.isBurstWindow() },
            { ability: 'stormstrike', condition: () => this.resources[RESOURCE_TYPES.MAELSTROM].current >= 30 },
            { ability: 'crashLightning', condition: () => this.isAoE() && this.resources[RESOURCE_TYPES.MAELSTROM].current >= 20 },
            { ability: 'lavaLash', condition: () => this.resources[RESOURCE_TYPES.MAELSTROM].current >= 20 },
            { ability: 'lightningBolt', condition: () => this.maelstromWeaponSystem.stacks >= 5 },
            { ability: 'chainLightning', condition: () => this.maelstromWeaponSystem.stacks >= 5 && this.isAoE() },
            { ability: 'spiritWalk', condition: () => this.needsFreedom() },
            { ability: 'ancestralGuidance', condition: () => this.groupNeedsHealing() }
        ];
    }

    generateMaelstrom(amount) {
        this.resources[RESOURCE_TYPES.MAELSTROM].current = Math.min(
            this.resources[RESOURCE_TYPES.MAELSTROM].current + amount,
            this.resources[RESOURCE_TYPES.MAELSTROM].max
        );
    }

    consumeMaelstrom(amount) {
        if (this.resources[RESOURCE_TYPES.MAELSTROM].current >= amount) {
            this.resources[RESOURCE_TYPES.MAELSTROM].current -= amount;
            return true;
        }
        return false;
    }

    generateMaelstromWeaponStacks(amount) {
        this.maelstromWeaponSystem.stacks = Math.min(
            this.maelstromWeaponSystem.stacks + amount,
            this.maelstromWeaponSystem.maxStacks
        );
    }

    applyStormstrikeDebuff() {
        // 폭풍의 일격 디버프
    }

    applyCrashLightningBuff() {
        // 충돌 버프
    }

    applyFlameShock() {
        this.flameShockTargets.set(this.currentTarget, {
            duration: 18,
            damage: 0.12,
            tickRate: 2
        });
    }

    hasFlameShock() {
        return this.flameShockTargets.has(this.currentTarget);
    }

    needsFreedom() {
        return false; // 더미 값
    }

    groupNeedsHealing() {
        return false; // 더미 값
    }
}

// Restoration Shaman - 복원 주술사
class RestorationShaman extends Specialization {
    constructor(player) {
        super(player, '복원');

        // 복원 특화: 깊은 치유
        this.stats = {
            ...this.stats,
            intellect: 1.05,
            criticalStrike: 1.25,
            haste: 1.15,
            mastery: 1.2,
            healingDone: 1.1
        };

        // 마나 시스템
        this.resources[RESOURCE_TYPES.MANA] = {
            current: 1.0,
            max: 1.0,
            regenRate: 0.02
        };

        // 성난 해일 시스템
        this.riptideSystem = {
            targets: new Map(),
            hotHeal: 0.15,
            duration: 18,
            instantChainHeal: true
        };

        // 치유의 비 시스템
        this.healingRainSystem = {
            active: false,
            position: null,
            radius: 10,
            duration: 10,
            tickHeal: 0.1
        };

        // 치유의 파도 토템 시스템
        this.healingStreamTotemSystem = {
            active: false,
            duration: 15,
            tickHeal: 0.08,
            cooldown: 30
        };

        // 치유의 물결 시스템
        this.healingTideTotemSystem = {
            active: false,
            duration: 10,
            healPercent: 0.25,
            cooldown: 180
        };

        // 정령 조화 시스템
        this.spiritLinkTotemSystem = {
            active: false,
            duration: 6,
            healthBalance: true,
            damageReduction: 0.1,
            cooldown: 180
        };

        // 물의 보호막 시스템
        this.waterShieldSystem = {
            active: true,
            manaReturn: 0.008,
            charges: 3
        };

        // 대지의 보호막 시스템
        this.earthShieldSystem = {
            target: null,
            charges: 9,
            healPerCharge: 0.1
        };

        // 선대의 물 시스템
        this.ancestralWatersSystem = {
            active: false,
            healingBonus: 0.25,
            cooldown: 30
        };

        // 정화의 샘 토템
        this.cloudburstTotemSystem = {
            active: false,
            storedHealing: 0,
            maxStore: 0.25,
            duration: 15,
            cooldown: 30
        };

        this.initializeAbilities();
        this.initializeTalents();
        this.initializeRotation();
    }

    initializeAbilities() {
        // 치유의 파도
        this.abilities.healingWave = {
            name: '치유의 파도',
            cost: { mana: 0.09 },
            heal: 2.8,
            castTime: 2.5,
            execute: () => {
                this.consumeMana(0.09);
                const healing = this.calculateHealing(this.abilities.healingWave.heal);
                return healing;
            }
        };

        // 치유의 급류
        this.abilities.healingSurge = {
            name: '치유의 급류',
            cost: { mana: 0.2 },
            heal: 2.0,
            castTime: 1.5,
            execute: () => {
                this.consumeMana(0.2);
                const healing = this.calculateHealing(this.abilities.healingSurge.heal);
                return healing;
            }
        };

        // 연쇄 치유
        this.abilities.chainHeal = {
            name: '연쇄 치유',
            cost: { mana: 0.225 },
            heal: 1.8,
            castTime: 2.5,
            jumps: 4,
            execute: () => {
                this.consumeMana(0.225);
                let totalHealing = 0;
                let currentHeal = this.abilities.chainHeal.heal;

                // 성난 해일 대상 즉시 시전
                if (this.hasRiptideOnTarget()) {
                    this.abilities.chainHeal.castTime = 0;
                }

                for (let i = 0; i < this.abilities.chainHeal.jumps; i++) {
                    const healing = this.calculateHealing(currentHeal);
                    totalHealing += healing;
                    currentHeal *= 0.7; // 연쇄마다 30% 감소
                }

                return totalHealing;
            }
        };

        // 성난 해일
        this.abilities.riptide = {
            name: '성난 해일',
            cost: { mana: 0.08 },
            heal: 1.0,
            hotHeal: 0.15,
            duration: 18,
            instant: true,
            execute: () => {
                this.consumeMana(0.08);
                const initialHeal = this.calculateHealing(this.abilities.riptide.heal);
                this.applyRiptide();
                return initialHeal;
            }
        };

        // 치유의 비
        this.abilities.healingRain = {
            name: '치유의 비',
            cost: { mana: 0.216 },
            tickHeal: 0.1,
            radius: 10,
            duration: 10,
            cooldown: 10,
            execute: () => {
                this.consumeMana(0.216);
                this.healingRainSystem.active = true;
                this.healingRainSystem.position = this.currentPosition;

                const rainTick = setInterval(() => {
                    const healing = this.calculateHealing(this.abilities.healingRain.tickHeal);
                    this.healAreaTargets(healing, this.healingRainSystem.radius);
                }, 2000);

                setTimeout(() => {
                    clearInterval(rainTick);
                    this.healingRainSystem.active = false;
                }, this.abilities.healingRain.duration * 1000);

                return true;
            }
        };

        // 치유의 파도 토템
        this.abilities.healingStreamTotem = {
            name: '치유의 파도 토템',
            cooldown: 30,
            duration: 15,
            execute: () => {
                this.healingStreamTotemSystem.active = true;

                const totemHeal = setInterval(() => {
                    const healing = this.calculateHealing(this.healingStreamTotemSystem.tickHeal);
                    this.healLowestHealth(healing);
                }, 2000);

                setTimeout(() => {
                    clearInterval(totemHeal);
                    this.healingStreamTotemSystem.active = false;
                }, this.abilities.healingStreamTotem.duration * 1000);

                return true;
            }
        };

        // 치유의 물결 토템
        this.abilities.healingTideTotem = {
            name: '치유의 물결 토템',
            cooldown: 180,
            duration: 10,
            execute: () => {
                this.healingTideTotemSystem.active = true;

                const tideHeal = setInterval(() => {
                    const healing = this.calculateHealing(this.stats.maxHealth * this.healingTideTotemSystem.healPercent);
                    this.healAllAllies(healing);
                }, 2000);

                setTimeout(() => {
                    clearInterval(tideHeal);
                    this.healingTideTotemSystem.active = false;
                }, this.abilities.healingTideTotem.duration * 1000);

                return true;
            }
        };

        // 정령 조화 토템
        this.abilities.spiritLinkTotem = {
            name: '정령 조화 토템',
            cooldown: 180,
            duration: 6,
            execute: () => {
                this.spiritLinkTotemSystem.active = true;
                this.applyGroupDamageReduction(this.spiritLinkTotemSystem.damageReduction);

                // 체력 균등화
                const balanceHealth = setInterval(() => {
                    this.balanceGroupHealth();
                }, 1000);

                setTimeout(() => {
                    clearInterval(balanceHealth);
                    this.spiritLinkTotemSystem.active = false;
                    this.removeGroupDamageReduction();
                }, this.abilities.spiritLinkTotem.duration * 1000);

                return true;
            }
        };

        // 대지의 보호막
        this.abilities.earthShield = {
            name: '대지의 보호막',
            cost: { mana: 0.1 },
            charges: 9,
            healPerCharge: 0.1,
            execute: () => {
                this.consumeMana(0.1);
                this.earthShieldSystem.target = this.currentTarget;
                this.earthShieldSystem.charges = 9;
                return true;
            }
        };

        // 정화
        this.abilities.purify = {
            name: '정화',
            cost: { mana: 0.065 },
            cooldown: 8,
            execute: () => {
                this.consumeMana(0.065);
                this.dispelDebuff();
                return true;
            }
        };

        // 선대의 보호
        this.abilities.ancestralProtection = {
            name: '선대의 보호',
            cooldown: 300,
            execute: () => {
                // 죽음 방지
                this.applyDeathPrevention();
                return true;
            }
        };

        // 물의 보호막
        this.abilities.waterShield = {
            name: '물의 보호막',
            execute: () => {
                this.waterShieldSystem.active = true;
                this.waterShieldSystem.charges = 3;
                return true;
            }
        };

        // 먹구름 폭발
        this.abilities.unleashLife = {
            name: '먹구름 폭발',
            cooldown: 15,
            healBonus: 0.35,
            execute: () => {
                // 다음 치유 주문 35% 증가
                this.nextHealBonus = 0.35;
                return true;
            }
        };
    }

    initializeTalents() {
        // 15레벨
        this.talents.torrent = {
            name: '격류',
            level: 15,
            riptideBonus: 0.2
        };

        this.talents.undulation = {
            name: '물결',
            level: 15,
            wavePattern: [1.0, 1.5, 1.0],
            currentWave: 0
        };

        this.talents.unleashLife = {
            name: '생명 해방',
            level: 15,
            implemented: true
        };

        // 25레벨
        this.talents.echoOfTheElements = {
            name: '원소의 메아리',
            level: 25,
            doublecastChance: 0.2
        };

        this.talents.delugeTotem = {
            name: '급류 토템',
            level: 25,
            healingRainBonus: 0.2
        };

        this.talents.surgeOfEarth = {
            name: '대지의 쇄도',
            level: 25,
            earthShieldHeal: 0.15,
            spreadHeal: true
        };

        // 30레벨
        this.talents.spiritWolf = {
            name: '늑대 정령',
            level: 30,
            damageReduction: 0.2,
            speedBonus: 0.2
        };

        this.talents.earthShield2 = {
            name: '대지의 보호막',
            level: 30,
            implemented: true
        };

        this.talents.staticCharge = {
            name: '전하 충전',
            level: 30,
            capacitorReduction: 5,
            damageBonus: 0.3
        };

        // 35레벨
        this.talents.ancestralVigor = {
            name: '선대의 활력',
            level: 35,
            healthBonus: 0.1
        };

        this.talents.earthenWallTotem = {
            name: '대지벽 토템',
            level: 35,
            absorb: 0.15,
            duration: 15,
            cooldown: 60
        };

        this.talents.ancestralProtectionTotem = {
            name: '선대의 보호 토템',
            level: 35,
            deathPrevention: true,
            cooldown: 300
        };

        // 40레벨
        this.talents.naturesGuardian = {
            name: '자연의 수호자',
            level: 40,
            autoHeal: 0.2,
            threshold: 0.35
        };

        this.talents.gracefulSpirit = {
            name: '우아한 정령',
            level: 40,
            spiritWalkCooldown: 20,
            speedBonus: 0.2
        };

        this.talents.windRushTotem = {
            name: '질풍 토템',
            level: 40,
            speedBonus: 0.6,
            duration: 15,
            cooldown: 120
        };

        // 45레벨
        this.talents.flashFlood = {
            name: '급류',
            level: 45,
            hasteBonus: 0.2,
            duration: 10
        };

        this.talents.downpour = {
            name: '폭우',
            level: 45,
            heal: 3.0,
            targets: 6,
            cooldown: 35
        };

        this.talents.cloudburstTotem = {
            name: '정화의 샘 토템',
            level: 45,
            storePercent: 0.25,
            duration: 15,
            cooldown: 30
        };

        // 50레벨
        this.talents.highTide = {
            name: '만조',
            level: 50,
            chainHealBounces: 1,
            chainHealBonus: 0.2
        };

        this.talents.wellspring = {
            name: '샘솟기',
            level: 50,
            heal: 2.0,
            targets: 6,
            cooldown: 20
        };

        this.talents.ascendance3 = {
            name: '상급 정령',
            level: 50,
            healDuplication: 1.0,
            duration: 15,
            cooldown: 180
        };
    }

    initializeRotation() {
        this.rotation = [
            { ability: 'riptide', condition: () => !this.hasRiptideOnTarget() },
            { ability: 'healingRain', condition: () => this.groupNeedsAreaHeal() },
            { ability: 'healingTideTotem', condition: () => this.raidCritical() },
            { ability: 'spiritLinkTotem', condition: () => this.groupCriticalDamage() },
            { ability: 'chainHeal', condition: () => this.multipleTargetsNeedHeal() },
            { ability: 'healingSurge', condition: () => this.targetCritical() },
            { ability: 'healingWave', condition: () => this.targetNeedsHeal() },
            { ability: 'healingStreamTotem', condition: () => !this.healingStreamTotemSystem.active },
            { ability: 'earthShield', condition: () => this.tankNeedsShield() }
        ];
    }

    consumeMana(amount) {
        if (this.resources[RESOURCE_TYPES.MANA].current >= amount) {
            this.resources[RESOURCE_TYPES.MANA].current -= amount;
            return true;
        }
        return false;
    }

    applyRiptide() {
        this.riptideSystem.targets.set(this.currentTarget, {
            duration: 18,
            healPerTick: 0.15
        });
    }

    hasRiptideOnTarget() {
        return this.riptideSystem.targets.has(this.currentTarget);
    }

    balanceGroupHealth() {
        // 그룹 체력 균등화
    }

    targetNeedsHeal() {
        return true; // 더미 값
    }

    targetCritical() {
        return false; // 더미 값
    }

    multipleTargetsNeedHeal() {
        return false; // 더미 값
    }

    groupNeedsAreaHeal() {
        return false; // 더미 값
    }

    groupCriticalDamage() {
        return false; // 더미 값
    }

    raidCritical() {
        return false; // 더미 값
    }

    tankNeedsShield() {
        return false; // 더미 값
    }
}

module.exports = {
    ElementalShaman,
    EnhancementShaman,
    RestorationShaman
};