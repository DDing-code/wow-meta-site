// Druid Specialization Implementations
// Balance: 원거리 DPS 전문화 - 태양과 달의 균형
// Feral: 근접 DPS 전문화 - 표범과 표범 형태
// Guardian: 탱킹 전문화 - 곰 형태와 방어
// Restoration: 치유 전문화 - 자연 마법 치유

const { Specialization } = require('../core/Specialization');
const { RESOURCE_TYPES } = require('../core/ResourceSystem');

// Balance Druid - 조화 드루이드
class BalanceDruid extends Specialization {
    constructor(player) {
        super(player, '조화');

        // 조화 특화: 천공의 힘
        this.stats = {
            ...this.stats,
            intellect: 1.05,
            criticalStrike: 1.2,
            haste: 1.15,
            mastery: 1.25
        };

        // 천공의 힘 시스템
        this.resources[RESOURCE_TYPES.ASTRAL_POWER] = {
            current: 0,
            max: 100,
            generationRate: 0
        };

        // 일월식 시스템
        this.eclipseSystem = {
            solarEclipse: false,
            lunarEclipse: false,
            solarStacks: 0,
            lunarStacks: 0,
            maxStacks: 2,
            damageBonus: 0.15
        };

        // 별빛섬광 시스템
        this.starfallSystem = {
            active: false,
            duration: 8,
            damage: 0.3,
            area: 15
        };

        // 천공의 정렬 시스템
        this.celestialAlignmentSystem = {
            active: false,
            duration: 20,
            cooldown: 180,
            hasteBonus: 0.15,
            critBonus: 0.15
        };

        // 달빛짐승 형태
        this.moonkinFormSystem = {
            active: true,
            armorBonus: 1.25,
            spellDamageBonus: 0.1
        };

        // 달빛 불꽃과 태양 불꽃 추적
        this.moonfireTargets = new Map();
        this.sunfireTargets = new Map();

        // 별빛 쇄도 시스템
        this.starsurgeSystem = {
            empowermentStacks: 0,
            maxEmpowerment: 3
        };

        // 화신 시스템
        this.incarnationSystem = {
            active: false,
            duration: 30,
            cooldown: 180,
            form: 'chosen'  // 선택된 엘룬 또는 태양의 화신
        };

        this.initializeAbilities();
        this.initializeTalents();
        this.initializeRotation();
    }

    initializeAbilities() {
        // 천벌
        this.abilities.wrath = {
            name: '천벌',
            cost: 0,
            damage: 1.5,
            castTime: 1.5,
            astralPowerGen: 8,
            execute: () => {
                const damage = this.calculateDamage(
                    this.abilities.wrath.damage,
                    this.eclipseSystem.solarEclipse ? 1.15 : 1.0
                );
                this.generateAstralPower(this.abilities.wrath.astralPowerGen);
                this.progressEclipse('solar');
                return damage;
            }
        };

        // 별빛섬광
        this.abilities.starfire = {
            name: '별빛섬광',
            cost: 0,
            damage: 2.2,
            castTime: 2.25,
            astralPowerGen: 10,
            cleave: true,
            execute: () => {
                const damage = this.calculateDamage(
                    this.abilities.starfire.damage,
                    this.eclipseSystem.lunarEclipse ? 1.15 : 1.0
                );
                this.generateAstralPower(this.abilities.starfire.astralPowerGen);
                this.progressEclipse('lunar');
                return damage;
            }
        };

        // 별빛쇄도
        this.abilities.starsurge = {
            name: '별빛쇄도',
            cost: { astralPower: 30 },
            damage: 3.2,
            castTime: 0,
            execute: () => {
                this.consumeAstralPower(30);
                const damage = this.calculateDamage(this.abilities.starsurge.damage);
                this.grantEmpowerment();
                return damage;
            }
        };

        // 별똥별
        this.abilities.starfall = {
            name: '별똥별',
            cost: { astralPower: 50 },
            damage: 0.3,
            duration: 8,
            cooldown: 0,
            aoe: true,
            execute: () => {
                this.consumeAstralPower(50);
                this.starfallSystem.active = true;

                const tickDamage = setInterval(() => {
                    const damage = this.calculateDamage(this.abilities.starfall.damage);
                    this.dealDamage(damage);
                }, 1000);

                setTimeout(() => {
                    clearInterval(tickDamage);
                    this.starfallSystem.active = false;
                }, this.abilities.starfall.duration * 1000);

                return true;
            }
        };

        // 달빛 불꽃
        this.abilities.moonfire = {
            name: '달빛 불꽃',
            cost: 0,
            damage: 0.8,
            dotDamage: 0.2,
            duration: 22,
            astralPowerGen: 6,
            execute: () => {
                const initialDamage = this.calculateDamage(this.abilities.moonfire.damage);
                this.generateAstralPower(this.abilities.moonfire.astralPowerGen);
                this.applyMoonfire();
                return initialDamage;
            }
        };

        // 태양 불꽃
        this.abilities.sunfire = {
            name: '태양 불꽃',
            cost: 0,
            damage: 0.6,
            dotDamage: 0.18,
            duration: 18,
            astralPowerGen: 6,
            aoe: true,
            execute: () => {
                const initialDamage = this.calculateDamage(this.abilities.sunfire.damage);
                this.generateAstralPower(this.abilities.sunfire.astralPowerGen);
                this.applySunfire();
                return initialDamage;
            }
        };

        // 천공의 정렬
        this.abilities.celestialAlignment = {
            name: '천공의 정렬',
            cooldown: 180,
            duration: 20,
            execute: () => {
                this.celestialAlignmentSystem.active = true;
                this.eclipseSystem.solarEclipse = true;
                this.eclipseSystem.lunarEclipse = true;
                this.updateStats({
                    haste: 1.15,
                    criticalStrike: 1.15
                });

                setTimeout(() => {
                    this.celestialAlignmentSystem.active = false;
                    this.eclipseSystem.solarEclipse = false;
                    this.eclipseSystem.lunarEclipse = false;
                    this.updateStats({
                        haste: 1,
                        criticalStrike: 1
                    });
                }, this.abilities.celestialAlignment.duration * 1000);

                return true;
            }
        };

        // 태양 광선
        this.abilities.solarBeam = {
            name: '태양 광선',
            cooldown: 60,
            duration: 8,
            damage: 1.0,
            execute: () => {
                const damage = this.calculateDamage(this.abilities.solarBeam.damage);
                this.applySilence(this.abilities.solarBeam.duration);
                return damage;
            }
        };

        // 나무 껍질
        this.abilities.barkskin = {
            name: '나무 껍질',
            cooldown: 60,
            duration: 12,
            damageReduction: 0.2,
            execute: () => {
                this.applyDamageReduction(this.abilities.barkskin.damageReduction);
                setTimeout(() => {
                    this.removeDamageReduction();
                }, this.abilities.barkskin.duration * 1000);
                return true;
            }
        };

        // 휘감는 뿌리
        this.abilities.entanglingRoots = {
            name: '휘감는 뿌리',
            castTime: 1.5,
            duration: 30,
            execute: () => {
                this.applyRoot(this.abilities.entanglingRoots.duration);
                return true;
            }
        };

        // 급속 성장
        this.abilities.wildGrowth = {
            name: '급속 성장',
            cooldown: 10,
            heal: 1.5,
            targets: 5,
            execute: () => {
                const healing = this.calculateHealing(this.abilities.wildGrowth.heal);
                this.healMultipleTargets(healing, this.abilities.wildGrowth.targets);
                return healing;
            }
        };
    }

    initializeTalents() {
        // 15레벨
        this.talents.natureBalance = {
            name: '자연의 균형',
            level: 15,
            effect: () => {
                this.eclipseSystem.passiveGeneration = 2;
            }
        };

        this.talents.warriorOfElune = {
            name: '엘룬의 전사',
            level: 15,
            charges: 3,
            cooldown: 45,
            instantCast: true
        };

        this.talents.forceOfNature = {
            name: '자연의 군대',
            level: 15,
            treants: 3,
            duration: 10,
            cooldown: 60
        };

        // 25레벨
        this.talents.tigerDash = {
            name: '호랑이 질주',
            level: 25,
            speedBonus: 2.0,
            duration: 5,
            cooldown: 45
        };

        this.talents.renewal = {
            name: '소생',
            level: 25,
            heal: 0.3,
            cooldown: 90
        };

        this.talents.wildCharge = {
            name: '야생의 돌진',
            level: 25,
            cooldown: 15
        };

        // 30레벨
        this.talents.feralAffinity = {
            name: '야성 친화',
            level: 30,
            damageBonus: 0.15,
            abilities: ['rake', 'rip', 'swipe']
        };

        this.talents.guardian = {
            name: '수호 친화',
            level: 30,
            damageReduction: 0.1,
            abilities: ['thrash', 'swipe', 'frenziedRegeneration']
        };

        this.talents.restoration = {
            name: '회복 친화',
            level: 30,
            healingBonus: 0.1,
            abilities: ['rejuvenation', 'regrowth', 'swiftmend']
        };

        // 35레벨
        this.talents.mightyBash = {
            name: '강력한 강타',
            level: 35,
            stunDuration: 5,
            cooldown: 50
        };

        this.talents.massEntanglement = {
            name: '대규모 휘감기',
            level: 35,
            rootDuration: 30,
            cooldown: 30
        };

        this.talents.heartOfTheWild = {
            name: '야생의 심장',
            level: 35,
            bonusStats: 0.3,
            duration: 45,
            cooldown: 300
        };

        // 40레벨
        this.talents.soulOfTheForest = {
            name: '숲의 영혼',
            level: 40,
            astralPowerBonus: 0.15
        };

        this.talents.starlord = {
            name: '별군주',
            level: 40,
            hastePerStack: 0.04,
            maxStacks: 3,
            duration: 20
        };

        this.talents.incarnation = {
            name: '화신: 선택된 엘룬',
            level: 40,
            duration: 30,
            cooldown: 180
        };

        // 45레벨
        this.talents.stellarDrift = {
            name: '별의 표류',
            level: 45,
            starfallRadius: 0.3,
            movementCast: true
        };

        this.talents.twinMoons = {
            name: '쌍둥이 달',
            level: 45,
            additionalTarget: 1
        };

        this.talents.stellarFlare = {
            name: '항성 섬광',
            level: 45,
            damage: 2.5,
            dotDamage: 0.4,
            duration: 24,
            astralPowerCost: 15
        };

        // 50레벨
        this.talents.solstice = {
            name: '지점',
            level: 50,
            dotDuration: 6
        };

        this.talents.furyOfElune = {
            name: '엘룬의 격노',
            level: 50,
            damage: 0.6,
            duration: 8,
            cooldown: 60,
            astralPowerGen: 40
        };

        this.talents.newMoon = {
            name: '초승달',
            level: 50,
            damage: 1.5,
            charges: 3,
            cooldown: 25
        };
    }

    initializeRotation() {
        this.rotation = [
            { ability: 'moonfire', condition: () => !this.hasMoonfire() },
            { ability: 'sunfire', condition: () => !this.hasSunfire() },
            { ability: 'celestialAlignment', condition: () => this.isBurstWindow() },
            { ability: 'starsurge', condition: () => this.resources[RESOURCE_TYPES.ASTRAL_POWER].current >= 40 },
            { ability: 'starfall', condition: () => this.resources[RESOURCE_TYPES.ASTRAL_POWER].current >= 50 && this.isAoE() },
            { ability: 'wrath', condition: () => this.starsurgeSystem.empowermentStacks > 0 || !this.eclipseSystem.lunarEclipse },
            { ability: 'starfire', condition: () => this.isAoE() || !this.eclipseSystem.solarEclipse },
            { ability: 'solarBeam', condition: () => this.needsInterrupt() }
        ];
    }

    generateAstralPower(amount) {
        this.resources[RESOURCE_TYPES.ASTRAL_POWER].current = Math.min(
            this.resources[RESOURCE_TYPES.ASTRAL_POWER].current + amount,
            this.resources[RESOURCE_TYPES.ASTRAL_POWER].max
        );
    }

    consumeAstralPower(amount) {
        if (this.resources[RESOURCE_TYPES.ASTRAL_POWER].current >= amount) {
            this.resources[RESOURCE_TYPES.ASTRAL_POWER].current -= amount;
            return true;
        }
        return false;
    }

    progressEclipse(type) {
        if (type === 'solar' && !this.eclipseSystem.solarEclipse) {
            this.eclipseSystem.solarStacks++;
            if (this.eclipseSystem.solarStacks >= this.eclipseSystem.maxStacks) {
                this.eclipseSystem.solarEclipse = true;
                this.eclipseSystem.solarStacks = 0;
            }
        } else if (type === 'lunar' && !this.eclipseSystem.lunarEclipse) {
            this.eclipseSystem.lunarStacks++;
            if (this.eclipseSystem.lunarStacks >= this.eclipseSystem.maxStacks) {
                this.eclipseSystem.lunarEclipse = true;
                this.eclipseSystem.lunarStacks = 0;
            }
        }
    }

    grantEmpowerment() {
        this.starsurgeSystem.empowermentStacks = Math.min(
            this.starsurgeSystem.empowermentStacks + 1,
            this.starsurgeSystem.maxEmpowerment
        );
    }

    applyMoonfire() {
        this.moonfireTargets.set(this.currentTarget, {
            duration: 22,
            damage: 0.2,
            tickRate: 2
        });
    }

    applySunfire() {
        this.sunfireTargets.set(this.currentTarget, {
            duration: 18,
            damage: 0.18,
            tickRate: 2
        });
    }

    hasMoonfire() {
        return this.moonfireTargets.has(this.currentTarget);
    }

    hasSunfire() {
        return this.sunfireTargets.has(this.currentTarget);
    }
}

// Feral Druid - 야성 드루이드
class FeralDruid extends Specialization {
    constructor(player) {
        super(player, '야성');

        // 야성 특화: 표범 형태 근접 전투
        this.stats = {
            ...this.stats,
            agility: 1.05,
            criticalStrike: 1.25,
            haste: 1.1,
            mastery: 1.2
        };

        // 기력 시스템
        this.resources[RESOURCE_TYPES.ENERGY] = {
            current: 100,
            max: 100,
            regenRate: 10
        };

        // 연계 점수 시스템
        this.resources[RESOURCE_TYPES.COMBO_POINTS] = {
            current: 0,
            max: 5
        };

        // 표범 형태
        this.catFormSystem = {
            active: true,
            damageBonus: 0.4,
            speedBonus: 0.3
        };

        // 피의 발톱 시스템
        this.bloodtalonsSystem = {
            active: false,
            stacks: 0,
            maxStacks: 2,
            damageBonus: 0.25
        };

        // 포악 시스템
        this.savageRoarSystem = {
            active: false,
            duration: 0,
            damageBonus: 0.15
        };

        // 광폭화 시스템
        this.berserkSystem = {
            active: false,
            duration: 20,
            cooldown: 180,
            energyCostReduction: 0.5
        };

        // 도려내기 출혈 추적
        this.rakeTargets = new Map();
        // 칼날 발톱 출혈 추적
        this.ripTargets = new Map();
        // 날카로운 발톱 추적
        this.thrashTargets = new Map();

        // 호랑이의 분노 시스템
        this.tigersFurySystem = {
            active: false,
            duration: 10,
            cooldown: 30,
            damageBonus: 0.15,
            energyGain: 60
        };

        // 달빛짐승 형태 추적
        this.moonkinFormAvailable = false;

        this.initializeAbilities();
        this.initializeTalents();
        this.initializeRotation();
    }

    initializeAbilities() {
        // 갈퀴 발톱
        this.abilities.rake = {
            name: '갈퀴 발톱',
            cost: { energy: 35 },
            damage: 1.0,
            dotDamage: 0.25,
            duration: 15,
            comboPoints: 1,
            execute: () => {
                this.consumeEnergy(35);
                const damage = this.calculateDamage(this.abilities.rake.damage);
                this.generateComboPoints(1);
                this.applyRake();
                return damage;
            }
        };

        // 갈퀴 발톱
        this.abilities.shred = {
            name: '갈퀴 발톱',
            cost: { energy: 40 },
            damage: 2.5,
            comboPoints: 1,
            critBonus: 2.0,
            execute: () => {
                this.consumeEnergy(40);
                const damage = this.calculateDamage(
                    this.abilities.shred.damage,
                    this.bloodtalonsSystem.active ? 1.25 : 1.0
                );
                this.generateComboPoints(1);
                if (this.bloodtalonsSystem.stacks > 0) {
                    this.bloodtalonsSystem.stacks--;
                }
                return damage;
            }
        };

        // 칼날 발톱
        this.abilities.rip = {
            name: '칼날 발톱',
            cost: { energy: 30, comboPoints: 1 },
            damage: 0,
            dotDamage: 0.3,
            duration: 24,
            execute: () => {
                if (this.resources[RESOURCE_TYPES.COMBO_POINTS].current < 1) return 0;

                this.consumeEnergy(30);
                const comboPoints = this.resources[RESOURCE_TYPES.COMBO_POINTS].current;
                const duration = 4 + (comboPoints * 4);
                const damage = comboPoints * 0.3;

                this.applyRip(damage, duration);
                this.resources[RESOURCE_TYPES.COMBO_POINTS].current = 0;

                return damage;
            }
        };

        // 흉포한 이빨
        this.abilities.ferociousBite = {
            name: '흉포한 이빨',
            cost: { energy: 25, comboPoints: 1 },
            damage: 3.0,
            maxEnergyBonus: 25,
            execute: () => {
                if (this.resources[RESOURCE_TYPES.COMBO_POINTS].current < 1) return 0;

                const baseEnergy = 25;
                const bonusEnergy = Math.min(this.resources[RESOURCE_TYPES.ENERGY].current - baseEnergy, 25);
                this.consumeEnergy(baseEnergy + bonusEnergy);

                const comboPoints = this.resources[RESOURCE_TYPES.COMBO_POINTS].current;
                const damage = this.calculateDamage(
                    this.abilities.ferociousBite.damage * comboPoints * (1 + bonusEnergy / 25)
                );

                this.resources[RESOURCE_TYPES.COMBO_POINTS].current = 0;

                // 칼날 발톱 새로고침 (표적 체력 25% 이하)
                if (this.targetHealthPercent() < 0.25) {
                    this.refreshRip();
                }

                return damage;
            }
        };

        // 휘둘러치기
        this.abilities.swipeCat = {
            name: '휘둘러치기',
            cost: { energy: 35 },
            damage: 1.5,
            comboPoints: 1,
            aoe: true,
            execute: () => {
                this.consumeEnergy(35);
                const damage = this.calculateDamage(this.abilities.swipeCat.damage);
                this.generateComboPoints(1);
                return damage;
            }
        };

        // 날카로운 발톱
        this.abilities.thrash = {
            name: '날카로운 발톱',
            cost: { energy: 40 },
            damage: 1.2,
            dotDamage: 0.15,
            duration: 15,
            comboPoints: 1,
            aoe: true,
            execute: () => {
                this.consumeEnergy(40);
                const damage = this.calculateDamage(this.abilities.thrash.damage);
                this.generateComboPoints(1);
                this.applyThrash();
                return damage;
            }
        };

        // 호랑이의 분노
        this.abilities.tigersFury = {
            name: '호랑이의 분노',
            cooldown: 30,
            duration: 10,
            execute: () => {
                this.tigersFurySystem.active = true;
                this.generateEnergy(this.tigersFurySystem.energyGain);
                this.updateStats({ damage: 1.15 });

                setTimeout(() => {
                    this.tigersFurySystem.active = false;
                    this.updateStats({ damage: 1 });
                }, this.abilities.tigersFury.duration * 1000);

                return true;
            }
        };

        // 광폭화
        this.abilities.berserk = {
            name: '광폭화',
            cooldown: 180,
            duration: 20,
            execute: () => {
                this.berserkSystem.active = true;

                setTimeout(() => {
                    this.berserkSystem.active = false;
                }, this.abilities.berserk.duration * 1000);

                return true;
            }
        };

        // 도발
        this.abilities.maim = {
            name: '도발',
            cost: { energy: 35, comboPoints: 1 },
            damage: 2.0,
            stunDuration: 1,
            execute: () => {
                if (this.resources[RESOURCE_TYPES.COMBO_POINTS].current < 1) return 0;

                this.consumeEnergy(35);
                const comboPoints = this.resources[RESOURCE_TYPES.COMBO_POINTS].current;
                const damage = this.calculateDamage(this.abilities.maim.damage * comboPoints);
                const stunDuration = comboPoints;

                this.applyStun(stunDuration);
                this.resources[RESOURCE_TYPES.COMBO_POINTS].current = 0;

                return damage;
            }
        };

        // 생존 본능
        this.abilities.survivalInstincts = {
            name: '생존 본능',
            charges: 2,
            cooldown: 120,
            duration: 6,
            damageReduction: 0.5,
            execute: () => {
                this.applyDamageReduction(this.abilities.survivalInstincts.damageReduction);

                setTimeout(() => {
                    this.removeDamageReduction();
                }, this.abilities.survivalInstincts.duration * 1000);

                return true;
            }
        };
    }

    initializeTalents() {
        // 15레벨
        this.talents.predator = {
            name: '포식자',
            level: 15,
            tigersFuryReset: true
        };

        this.talents.sabertooth = {
            name: '검치 호랑이',
            level: 15,
            ripDuration: 5
        };

        this.talents.lunarInspiration = {
            name: '달빛 영감',
            level: 15,
            moonfireInCat: true
        };

        // 25레벨
        this.talents.tigerDash = {
            name: '호랑이 질주',
            level: 25,
            speedBonus: 2.0,
            duration: 5,
            cooldown: 45
        };

        this.talents.renewal = {
            name: '소생',
            level: 25,
            heal: 0.3,
            cooldown: 90
        };

        this.talents.wildCharge = {
            name: '야생의 돌진',
            level: 25,
            cooldown: 15
        };

        // 30레벨
        this.talents.balance = {
            name: '조화 친화',
            level: 30,
            rangeIncrease: 5,
            abilities: ['moonfire', 'sunfire', 'starsurge']
        };

        this.talents.guardian = {
            name: '수호 친화',
            level: 30,
            damageReduction: 0.1,
            abilities: ['thrash', 'swipe', 'frenziedRegeneration']
        };

        this.talents.restoration = {
            name: '회복 친화',
            level: 30,
            healingBonus: 0.1,
            abilities: ['rejuvenation', 'regrowth', 'swiftmend']
        };

        // 35레벨
        this.talents.mightyBash = {
            name: '강력한 강타',
            level: 35,
            stunDuration: 5,
            cooldown: 50
        };

        this.talents.massEntanglement = {
            name: '대규모 휘감기',
            level: 35,
            rootDuration: 30,
            cooldown: 30
        };

        this.talents.typhoon = {
            name: '태풍',
            level: 35,
            damage: 0.6,
            knockback: 20,
            cooldown: 30
        };

        // 40레벨
        this.talents.soulOfTheForest = {
            name: '숲의 영혼',
            level: 40,
            energyRegen: 5
        };

        this.talents.savageRoar = {
            name: '야수의 포효',
            level: 40,
            damageBonus: 0.15,
            duration: 36
        };

        this.talents.incarnation = {
            name: '화신: 아샤마네의 화신',
            level: 40,
            duration: 30,
            cooldown: 180
        };

        // 45레벨
        this.talents.scentOfBlood = {
            name: '피 냄새',
            level: 45,
            thrashDamage: 0.3,
            agility: 0.1
        };

        this.talents.brutalSlash = {
            name: '잔혹한 베기',
            level: 45,
            damage: 2.0,
            charges: 3,
            cooldown: 8
        };

        this.talents.primalWrath = {
            name: '원시의 분노',
            level: 45,
            damage: 1.5,
            applyRip: true
        };

        // 50레벨
        this.talents.momentOfClarity = {
            name: '명료한 순간',
            level: 50,
            procChance: 0.15,
            freeAbilities: true
        };

        this.talents.bloodtalons = {
            name: '피의 발톱',
            level: 50,
            implemented: true
        };

        this.talents.feralFrenzy = {
            name: '야성의 격노',
            level: 50,
            damage: 5.0,
            comboPoints: 5,
            cooldown: 45
        };
    }

    initializeRotation() {
        this.rotation = [
            { ability: 'tigersFury', condition: () => this.resources[RESOURCE_TYPES.ENERGY].current < 40 },
            { ability: 'berserk', condition: () => this.isBurstWindow() },
            { ability: 'rake', condition: () => !this.hasRake() || this.shouldRefreshRake() },
            { ability: 'thrash', condition: () => this.isAoE() && (!this.hasThrash() || this.shouldRefreshThrash()) },
            { ability: 'rip', condition: () => this.resources[RESOURCE_TYPES.COMBO_POINTS].current >= 5 && (!this.hasRip() || this.shouldRefreshRip()) },
            { ability: 'ferociousBite', condition: () => this.resources[RESOURCE_TYPES.COMBO_POINTS].current >= 5 },
            { ability: 'swipeCat', condition: () => this.isAoE() && this.resources[RESOURCE_TYPES.COMBO_POINTS].current < 5 },
            { ability: 'shred', condition: () => this.resources[RESOURCE_TYPES.COMBO_POINTS].current < 5 },
            { ability: 'survivalInstincts', condition: () => this.needsSurvivalCooldown() }
        ];
    }

    generateEnergy(amount) {
        this.resources[RESOURCE_TYPES.ENERGY].current = Math.min(
            this.resources[RESOURCE_TYPES.ENERGY].current + amount,
            this.resources[RESOURCE_TYPES.ENERGY].max
        );
    }

    consumeEnergy(amount) {
        if (this.berserkSystem.active) {
            amount *= 0.5;
        }
        if (this.resources[RESOURCE_TYPES.ENERGY].current >= amount) {
            this.resources[RESOURCE_TYPES.ENERGY].current -= amount;
            return true;
        }
        return false;
    }

    generateComboPoints(amount) {
        this.resources[RESOURCE_TYPES.COMBO_POINTS].current = Math.min(
            this.resources[RESOURCE_TYPES.COMBO_POINTS].current + amount,
            this.resources[RESOURCE_TYPES.COMBO_POINTS].max
        );
    }

    applyRake() {
        const snapshotDamage = this.tigersFurySystem.active ? 1.15 : 1.0;
        this.rakeTargets.set(this.currentTarget, {
            duration: 15,
            damage: 0.25,
            snapshot: snapshotDamage
        });
    }

    applyRip(damage, duration) {
        const snapshotDamage = this.tigersFurySystem.active ? 1.15 : 1.0;
        this.ripTargets.set(this.currentTarget, {
            duration: duration,
            damage: damage,
            snapshot: snapshotDamage
        });
    }

    applyThrash() {
        this.thrashTargets.set(this.currentTarget, {
            duration: 15,
            damage: 0.15
        });
    }

    hasRake() {
        return this.rakeTargets.has(this.currentTarget);
    }

    hasRip() {
        return this.ripTargets.has(this.currentTarget);
    }

    hasThrash() {
        return this.thrashTargets.has(this.currentTarget);
    }

    shouldRefreshRake() {
        const rake = this.rakeTargets.get(this.currentTarget);
        return rake && rake.duration <= 4.5;
    }

    shouldRefreshRip() {
        const rip = this.ripTargets.get(this.currentTarget);
        return rip && rip.duration <= 7.2;
    }

    shouldRefreshThrash() {
        const thrash = this.thrashTargets.get(this.currentTarget);
        return thrash && thrash.duration <= 4.5;
    }

    refreshRip() {
        const rip = this.ripTargets.get(this.currentTarget);
        if (rip) {
            rip.duration = 24;
        }
    }

    targetHealthPercent() {
        return 0.5; // 더미 값
    }
}

// Guardian Druid - 수호 드루이드
class GuardianDruid extends Specialization {
    constructor(player) {
        super(player, '수호');

        // 수호 특화: 곰 형태 탱킹
        this.stats = {
            ...this.stats,
            stamina: 1.55,
            armor: 2.2,
            versatility: 1.1,
            damageReduction: 0.75
        };

        // 분노 시스템
        this.resources[RESOURCE_TYPES.RAGE] = {
            current: 0,
            max: 100,
            generationRate: 0
        };

        // 곰 형태
        this.bearFormSystem = {
            active: true,
            armorBonus: 2.2,
            staminaBonus: 0.55,
            damageReduction: 0.1
        };

        // 무쇠가죽 시스템
        this.ironfurSystem = {
            stacks: 0,
            maxStacks: 3,
            armorPerStack: 0.7,
            duration: 7
        };

        // 광란의 재생력 시스템
        this.frenziedRegenerationSystem = {
            active: false,
            charges: 2,
            maxCharges: 2,
            cooldown: 24,
            healPercent: 0.24,
            duration: 3
        };

        // 야생의 징표 시스템
        this.markOfUrsalSystem = {
            active: false,
            damageReduction: 0.25,
            duration: 6
        };

        // 불덩이 시스템
        this.barkSkinSystem = {
            active: false,
            damageReduction: 0.2,
            duration: 12,
            cooldown: 90
        };

        // 생존 본능
        this.survivalInstinctsSystem = {
            charges: 2,
            maxCharges: 2,
            cooldown: 240,
            damageReduction: 0.5,
            duration: 6
        };

        // 달빛 섬광 도트 추적
        this.moonfireTargets = new Map();
        // 날카로운 발톱 도트 추적
        this.thrashTargets = new Map();

        // 치유 비약
        this.pulverizeSystem = {
            damageBonus: 0.35,
            consumeThrash: 2
        };

        this.initializeAbilities();
        this.initializeTalents();
        this.initializeRotation();
    }

    initializeAbilities() {
        // 짓이기기
        this.abilities.mangle = {
            name: '짓이기기',
            cost: 0,
            damage: 2.5,
            rageGen: 8,
            cooldown: 0,
            execute: () => {
                const damage = this.calculateDamage(this.abilities.mangle.damage);
                this.generateRage(this.abilities.mangle.rageGen);
                return damage;
            }
        };

        // 휘둘러치기
        this.abilities.swipe = {
            name: '휘둘러치기',
            cost: 0,
            damage: 1.2,
            rageGen: 4,
            cooldown: 0,
            aoe: true,
            execute: () => {
                const damage = this.calculateDamage(this.abilities.swipe.damage);
                this.generateRage(this.abilities.swipe.rageGen);
                return damage;
            }
        };

        // 날카로운 발톱
        this.abilities.thrash = {
            name: '날카로운 발톱',
            cost: 0,
            damage: 1.5,
            dotDamage: 0.2,
            duration: 15,
            rageGen: 5,
            cooldown: 6,
            aoe: true,
            execute: () => {
                const damage = this.calculateDamage(this.abilities.thrash.damage);
                this.generateRage(this.abilities.thrash.rageGen);
                this.applyThrash();
                return damage;
            }
        };

        // 무쇠가죽
        this.abilities.ironfur = {
            name: '무쇠가죽',
            cost: { rage: 40 },
            duration: 7,
            cooldown: 0,
            execute: () => {
                if (!this.consumeRage(40)) return false;

                if (this.ironfurSystem.stacks < this.ironfurSystem.maxStacks) {
                    this.ironfurSystem.stacks++;
                }

                this.updateArmor();

                setTimeout(() => {
                    if (this.ironfurSystem.stacks > 0) {
                        this.ironfurSystem.stacks--;
                        this.updateArmor();
                    }
                }, this.abilities.ironfur.duration * 1000);

                return true;
            }
        };

        // 광란의 재생력
        this.abilities.frenziedRegeneration = {
            name: '광란의 재생력',
            cost: { rage: 10 },
            charges: 2,
            cooldown: 24,
            duration: 3,
            execute: () => {
                if (!this.consumeRage(10)) return false;
                if (this.frenziedRegenerationSystem.charges <= 0) return false;

                this.frenziedRegenerationSystem.charges--;
                this.frenziedRegenerationSystem.active = true;

                // HoT 효과
                const healPerTick = this.stats.maxHealth * 0.08;
                const healTick = setInterval(() => {
                    this.healSelf(healPerTick);
                }, 1000);

                setTimeout(() => {
                    clearInterval(healTick);
                    this.frenziedRegenerationSystem.active = false;
                }, this.abilities.frenziedRegeneration.duration * 1000);

                // 충전 재생성
                setTimeout(() => {
                    if (this.frenziedRegenerationSystem.charges < this.frenziedRegenerationSystem.maxCharges) {
                        this.frenziedRegenerationSystem.charges++;
                    }
                }, this.abilities.frenziedRegeneration.cooldown * 1000);

                return true;
            }
        };

        // 달빛섬광
        this.abilities.moonfire = {
            name: '달빛섬광',
            cost: 0,
            damage: 0.8,
            dotDamage: 0.15,
            duration: 16,
            cooldown: 0,
            execute: () => {
                const damage = this.calculateDamage(this.abilities.moonfire.damage, 'arcane');
                this.applyMoonfire();
                return damage;
            }
        };

        // 생존 본능
        this.abilities.survivalInstincts = {
            name: '생존 본능',
            charges: 2,
            cooldown: 240,
            duration: 6,
            execute: () => {
                if (this.survivalInstinctsSystem.charges <= 0) return false;

                this.survivalInstinctsSystem.charges--;
                this.applyDamageReduction(this.survivalInstinctsSystem.damageReduction);

                setTimeout(() => {
                    this.removeDamageReduction();
                }, this.abilities.survivalInstincts.duration * 1000);

                // 충전 재생성
                setTimeout(() => {
                    if (this.survivalInstinctsSystem.charges < this.survivalInstinctsSystem.maxCharges) {
                        this.survivalInstinctsSystem.charges++;
                    }
                }, this.abilities.survivalInstincts.cooldown * 1000);

                return true;
            }
        };

        // 나무 껍질
        this.abilities.barkskin = {
            name: '나무 껍질',
            cooldown: 90,
            duration: 12,
            execute: () => {
                this.barkSkinSystem.active = true;
                this.applyDamageReduction(this.barkSkinSystem.damageReduction);

                setTimeout(() => {
                    this.barkSkinSystem.active = false;
                    this.removeDamageReduction();
                }, this.abilities.barkskin.duration * 1000);

                return true;
            }
        };

        // 두개골 강타
        this.abilities.skullBash = {
            name: '두개골 강타',
            cooldown: 15,
            damage: 0.5,
            execute: () => {
                const damage = this.calculateDamage(this.abilities.skullBash.damage);
                this.interruptCast();
                return damage;
            }
        };

        // 포효
        this.abilities.growl = {
            name: '포효',
            cooldown: 8,
            execute: () => {
                this.forceTaunt();
                return true;
            }
        };

        // 광포한 포효
        this.abilities.stampedingRoar = {
            name: '광포한 포효',
            cooldown: 120,
            duration: 8,
            speedBonus: 0.6,
            execute: () => {
                this.applyGroupSpeed(this.abilities.stampedingRoar.speedBonus,
                                   this.abilities.stampedingRoar.duration);
                return true;
            }
        };

        // 화신: 우르속의 수호자
        this.abilities.incarnation = {
            name: '화신: 우르속의 수호자',
            cooldown: 180,
            duration: 30,
            execute: () => {
                this.updateStats({
                    armor: 1.3,
                    health: 1.3,
                    damageReduction: 0.85
                });

                setTimeout(() => {
                    this.updateStats({
                        armor: 1,
                        health: 1,
                        damageReduction: 1
                    });
                }, this.abilities.incarnation.duration * 1000);

                return true;
            }
        };
    }

    initializeTalents() {
        // 15레벨
        this.talents.brambles = {
            name: '가시',
            level: 15,
            reflectDamage: 0.2
        };

        this.talents.bloodFrenzy = {
            name: '피의 광란',
            level: 15,
            rageGen: 2,
            damageBonus: 0.1
        };

        this.talents.bristlingFur = {
            name: '뻣뻣한 털',
            level: 15,
            rageGen: 8,
            duration: 8,
            cooldown: 40
        };

        // 25레벨
        this.talents.tigerDash = {
            name: '호랑이 질주',
            level: 25,
            speedBonus: 2.0,
            duration: 5,
            cooldown: 45
        };

        this.talents.renewal = {
            name: '소생',
            level: 25,
            heal: 0.3,
            cooldown: 90
        };

        this.talents.wildCharge = {
            name: '야생의 돌진',
            level: 25,
            cooldown: 15
        };

        // 30레벨
        this.talents.balance = {
            name: '조화 친화',
            level: 30,
            rangeIncrease: 5,
            abilities: ['moonfire', 'sunfire', 'starsurge']
        };

        this.talents.feral = {
            name: '야성 친화',
            level: 30,
            damageBonus: 0.15,
            abilities: ['rake', 'rip', 'swipe']
        };

        this.talents.restoration = {
            name: '회복 친화',
            level: 30,
            healingBonus: 0.1,
            abilities: ['rejuvenation', 'regrowth', 'swiftmend']
        };

        // 35레벨
        this.talents.mightyBash = {
            name: '강력한 강타',
            level: 35,
            stunDuration: 5,
            cooldown: 50
        };

        this.talents.massEntanglement = {
            name: '대규모 휘감기',
            level: 35,
            rootDuration: 30,
            cooldown: 30
        };

        this.talents.heartOfTheWild = {
            name: '야생의 심장',
            level: 35,
            bonusStats: 0.3,
            duration: 45,
            cooldown: 300
        };

        // 40레벨
        this.talents.galacticGuardian = {
            name: '은하수 수호자',
            level: 40,
            moonfireProc: 0.15,
            damageBonus: 3.0
        };

        this.talents.incarnation2 = {
            name: '화신: 우르속의 수호자',
            level: 40,
            implemented: true
        };

        this.talents.earthwarden = {
            name: '대지의 감시자',
            level: 40,
            damageReduction: 0.3,
            stacks: 3
        };

        // 45레벨
        this.talents.gutteralRoars = {
            name: '낮은 포효',
            level: 45,
            cooldownReduction: 0.5,
            duration: 0.5
        };

        this.talents.intimidatingRoar = {
            name: '위협의 포효',
            level: 45,
            fearDuration: 3,
            cooldown: 30
        };

        this.talents.toothAndClaw = {
            name: '이빨과 발톱',
            level: 45,
            damageReduction: 0.15,
            autoAttackBonus: 0.5
        };

        // 50레벨
        this.talents.rendAndTear = {
            name: '도려내고 찢기',
            level: 50,
            damageBonus: 0.2,
            debuffStacks: 3
        };

        this.talents.lunarBeam = {
            name: '달빛 광선',
            level: 50,
            damage: 0.5,
            duration: 8,
            cooldown: 75
        };

        this.talents.pulverize = {
            name: '분쇄',
            level: 50,
            damageBonus: 0.35,
            duration: 20
        };
    }

    initializeRotation() {
        this.rotation = [
            { ability: 'thrash', condition: () => !this.hasThrash() || this.shouldRefreshThrash() },
            { ability: 'moonfire', condition: () => !this.hasMoonfire() },
            { ability: 'ironfur', condition: () => this.resources[RESOURCE_TYPES.RAGE].current >= 40 && this.needsPhysicalMitigation() },
            { ability: 'frenziedRegeneration', condition: () => this.needsHealing() && this.frenziedRegenerationSystem.charges > 0 },
            { ability: 'survivalInstincts', condition: () => this.needsMajorDefensive() },
            { ability: 'barkskin', condition: () => this.needsDefensive() },
            { ability: 'mangle', condition: () => this.resources[RESOURCE_TYPES.RAGE].current < 80 },
            { ability: 'swipe', condition: () => this.isAoE() },
            { ability: 'incarnation', condition: () => this.isMajorBurstWindow() }
        ];
    }

    generateRage(amount) {
        this.resources[RESOURCE_TYPES.RAGE].current = Math.min(
            this.resources[RESOURCE_TYPES.RAGE].current + amount,
            this.resources[RESOURCE_TYPES.RAGE].max
        );
    }

    consumeRage(amount) {
        if (this.resources[RESOURCE_TYPES.RAGE].current >= amount) {
            this.resources[RESOURCE_TYPES.RAGE].current -= amount;
            return true;
        }
        return false;
    }

    updateArmor() {
        const armorMultiplier = 1 + (this.ironfurSystem.stacks * this.ironfurSystem.armorPerStack);
        this.updateStats({ armor: armorMultiplier });
    }

    applyThrash() {
        this.thrashTargets.set(this.currentTarget, {
            duration: 15,
            damage: 0.2,
            stacks: Math.min(3, (this.thrashTargets.get(this.currentTarget)?.stacks || 0) + 1)
        });
    }

    applyMoonfire() {
        this.moonfireTargets.set(this.currentTarget, {
            duration: 16,
            damage: 0.15
        });
    }

    hasThrash() {
        return this.thrashTargets.has(this.currentTarget);
    }

    hasMoonfire() {
        return this.moonfireTargets.has(this.currentTarget);
    }

    shouldRefreshThrash() {
        const thrash = this.thrashTargets.get(this.currentTarget);
        return thrash && thrash.duration <= 4.5;
    }

    needsPhysicalMitigation() {
        return !this.ironfurSystem.stacks || this.incomingPhysicalDamageHigh();
    }

    needsHealing() {
        return this.stats.currentHealth < this.stats.maxHealth * 0.6;
    }

    needsMajorDefensive() {
        return this.stats.currentHealth < this.stats.maxHealth * 0.3;
    }

    needsDefensive() {
        return this.stats.currentHealth < this.stats.maxHealth * 0.5;
    }

    incomingPhysicalDamageHigh() {
        return true; // 더미 값
    }
}

// Restoration Druid - 회복 드루이드
class RestorationDruid extends Specialization {
    constructor(player) {
        super(player, '회복');

        // 회복 특화: 자연 치유
        this.stats = {
            ...this.stats,
            intellect: 1.05,
            criticalStrike: 1.15,
            haste: 1.2,
            mastery: 1.25,
            healingDone: 1.1
        };

        // 생명의 나무 형태
        this.treeOfLifeSystem = {
            active: false,
            duration: 30,
            cooldown: 180,
            healingBonus: 0.15,
            instantRegrowth: true
        };

        // 활력 시스템
        this.rejuvenationTargets = new Map();
        // 재생 시스템
        this.regrowthTargets = new Map();
        // 회복 시스템
        this.lifeboomTargets = new Map();
        // 야생의 성장 시스템
        this.wildGrowthTargets = new Map();

        // 정수 활성화 시스템
        this.efflorescenceSystem = {
            active: false,
            position: null,
            radius: 10,
            healPerTick: 0.15,
            duration: 30
        };

        // 세나리우스의 가르침
        this.cenariusGuidanceSystem = {
            active: false,
            healingBonus: 0.2
        };

        // 무리의 본능 시스템
        this.tranquilitySystem = {
            active: false,
            cooldown: 180,
            duration: 8,
            healPerTick: 1.5
        };

        // 피어나는 생명 시스템
        this.flourishSystem = {
            cooldown: 90,
            duration: 6,
            hotExtension: 8
        };

        this.initializeAbilities();
        this.initializeTalents();
        this.initializeRotation();
    }

    initializeAbilities() {
        // 회복
        this.abilities.rejuvenation = {
            name: '회복',
            cost: { mana: 0.10 },
            heal: 0,
            hotHeal: 0.25,
            duration: 15,
            castTime: 0,
            execute: () => {
                this.consumeMana(0.10);
                this.applyRejuvenation();
                return this.calculateHealing(this.abilities.rejuvenation.hotHeal);
            }
        };

        // 재생
        this.abilities.regrowth = {
            name: '재생',
            cost: { mana: 0.14 },
            heal: 1.8,
            hotHeal: 0.15,
            duration: 12,
            castTime: 1.5,
            execute: () => {
                this.consumeMana(0.14);
                const directHeal = this.calculateHealing(this.abilities.regrowth.heal);
                this.applyRegrowth();
                return directHeal;
            }
        };

        // 치유의 손길
        this.abilities.healingTouch = {
            name: '치유의 손길',
            cost: { mana: 0.09 },
            heal: 2.5,
            castTime: 2.5,
            execute: () => {
                this.consumeMana(0.09);
                return this.calculateHealing(this.abilities.healingTouch.heal);
            }
        };

        // 피어나는 생명
        this.abilities.lifebloom = {
            name: '피어나는 생명',
            cost: { mana: 0.08 },
            hotHeal: 0.2,
            bloomHeal: 1.5,
            duration: 15,
            maxStacks: 1,
            execute: () => {
                this.consumeMana(0.08);
                this.applyLifebloom();
                return this.calculateHealing(this.abilities.lifebloom.hotHeal);
            }
        };

        // 신속한 치유
        this.abilities.swiftmend = {
            name: '신속한 치유',
            cost: { mana: 0.08 },
            heal: 2.0,
            cooldown: 15,
            instant: true,
            execute: () => {
                if (!this.hasRejuvenation() && !this.hasRegrowth()) return 0;

                this.consumeMana(0.08);
                const healing = this.calculateHealing(this.abilities.swiftmend.heal);

                // 정수 활성화 생성
                if (this.hasTalent('soulOfTheForest')) {
                    this.createEfflorescence();
                }

                return healing;
            }
        };

        // 급속 성장
        this.abilities.wildGrowth = {
            name: '급속 성장',
            cost: { mana: 0.22 },
            heal: 0.15,
            targets: 5,
            duration: 7,
            cooldown: 10,
            execute: () => {
                this.consumeMana(0.22);
                const healPerTick = this.calculateHealing(this.abilities.wildGrowth.heal);
                this.applyWildGrowth(this.abilities.wildGrowth.targets);
                return healPerTick * this.abilities.wildGrowth.targets;
            }
        };

        // 평온
        this.abilities.tranquility = {
            name: '평온',
            cost: { mana: 0.18 },
            heal: 1.5,
            duration: 8,
            cooldown: 180,
            channeled: true,
            execute: () => {
                this.consumeMana(0.18);
                this.tranquilitySystem.active = true;

                const tickHeal = setInterval(() => {
                    const healing = this.calculateHealing(this.abilities.tranquility.heal);
                    this.healAllAllies(healing);
                }, 2000);

                setTimeout(() => {
                    clearInterval(tickHeal);
                    this.tranquilitySystem.active = false;
                }, this.abilities.tranquility.duration * 1000);

                return true;
            }
        };

        // 무쇠나무 껍질
        this.abilities.ironbark = {
            name: '무쇠나무 껍질',
            cooldown: 90,
            duration: 12,
            damageReduction: 0.2,
            execute: () => {
                this.applyTargetDamageReduction(this.abilities.ironbark.damageReduction,
                                               this.abilities.ironbark.duration);
                return true;
            }
        };

        // 자연의 신속함
        this.abilities.naturesSwiftness = {
            name: '자연의 신속함',
            cooldown: 60,
            execute: () => {
                this.nextCastInstant = true;
                this.nextCastManaCost = 0;
                return true;
            }
        };

        // 정수 활성화
        this.abilities.efflorescence = {
            name: '정수 활성화',
            cost: { mana: 0.17 },
            heal: 0.15,
            radius: 10,
            duration: 30,
            execute: () => {
                this.consumeMana(0.17);
                this.createEfflorescence();
                return true;
            }
        };

        // 화신: 생명의 나무
        this.abilities.incarnation = {
            name: '화신: 생명의 나무',
            cooldown: 180,
            duration: 30,
            execute: () => {
                this.treeOfLifeSystem.active = true;
                this.updateStats({ healingDone: 1.15 });

                // 즉시 시전 재생
                this.abilities.regrowth.castTime = 0;

                setTimeout(() => {
                    this.treeOfLifeSystem.active = false;
                    this.updateStats({ healingDone: 1 });
                    this.abilities.regrowth.castTime = 1.5;
                }, this.abilities.incarnation.duration * 1000);

                return true;
            }
        };

        // 꽃피우기
        this.abilities.flourish = {
            name: '꽃피우기',
            cooldown: 90,
            execute: () => {
                // 모든 HoT 8초 연장
                this.extendAllHoTs(8);
                return true;
            }
        };
    }

    initializeTalents() {
        // 15레벨
        this.talents.cenarion = {
            name: '세나리온 수호물',
            level: 15,
            instantHeal: 0.3,
            hotBonus: 1.0
        };

        this.talents.abundance = {
            name: '풍요',
            level: 15,
            castTimeReduction: 0.06,
            maxStacks: 10
        };

        this.talents.nourish = {
            name: '양분',
            level: 15,
            heal: 2.0,
            hotBonus: 0.5,
            castTime: 2.0
        };

        // 25레벨
        this.talents.tigerDash = {
            name: '호랑이 질주',
            level: 25,
            speedBonus: 2.0,
            duration: 5,
            cooldown: 45
        };

        this.talents.renewal = {
            name: '소생',
            level: 25,
            heal: 0.3,
            cooldown: 90
        };

        this.talents.wildCharge = {
            name: '야생의 돌진',
            level: 25,
            cooldown: 15
        };

        // 30레벨
        this.talents.balance = {
            name: '조화 친화',
            level: 30,
            damageBonus: 0.1,
            abilities: ['moonfire', 'sunfire', 'starsurge']
        };

        this.talents.feral = {
            name: '야성 친화',
            level: 30,
            damageBonus: 0.15,
            abilities: ['rake', 'rip', 'swipe']
        };

        this.talents.guardian = {
            name: '수호 친화',
            level: 30,
            damageReduction: 0.1,
            abilities: ['thrash', 'swipe', 'frenziedRegeneration']
        };

        // 35레벨
        this.talents.mightyBash = {
            name: '강력한 강타',
            level: 35,
            stunDuration: 5,
            cooldown: 50
        };

        this.talents.massEntanglement = {
            name: '대규모 휘감기',
            level: 35,
            rootDuration: 30,
            cooldown: 30
        };

        this.talents.typhoon = {
            name: '태풍',
            level: 35,
            damage: 0.6,
            knockback: 20,
            cooldown: 30
        };

        // 40레벨
        this.talents.soulOfTheForest = {
            name: '숲의 영혼',
            level: 40,
            swiftmendBonus: 2.0
        };

        this.talents.cultivation = {
            name: '재배',
            level: 40,
            threshold: 0.6,
            hotHeal: 0.1,
            duration: 6
        };

        this.talents.incarnation2 = {
            name: '화신: 생명의 나무',
            level: 40,
            implemented: true
        };

        // 45레벨
        this.talents.innerPeace = {
            name: '내면의 평화',
            level: 45,
            cooldownReduction: 60
        };

        this.talents.springBlossoms = {
            name: '봄꽃',
            level: 45,
            efflorescenceHot: 0.1
        };

        this.talents.overgrowth = {
            name: '과성장',
            level: 45,
            instant: true,
            applyAll: true,
            cooldown: 45
        };

        // 50레벨
        this.talents.photosynthesis = {
            name: '광합성',
            level: 50,
            lifebloomBonus: 0.15,
            hotRate: 0.2
        };

        this.talents.germination = {
            name: '발아',
            level: 50,
            doubleRejuv: true
        };

        this.talents.flourish2 = {
            name: '꽃피우기',
            level: 50,
            implemented: true
        };
    }

    initializeRotation() {
        this.rotation = [
            { ability: 'lifebloom', condition: () => !this.hasLifebloom() },
            { ability: 'rejuvenation', condition: () => this.targetNeedsHeal() && !this.hasRejuvenation() },
            { ability: 'wildGrowth', condition: () => this.groupNeedsHeal() },
            { ability: 'swiftmend', condition: () => this.targetCriticalHealth() && (this.hasRejuvenation() || this.hasRegrowth()) },
            { ability: 'regrowth', condition: () => this.targetLowHealth() },
            { ability: 'tranquility', condition: () => this.raidCriticalHealth() },
            { ability: 'incarnation', condition: () => this.heavyHealingNeeded() },
            { ability: 'flourish', condition: () => this.manyActiveHoTs() },
            { ability: 'ironbark', condition: () => this.targetTakingDamage() }
        ];
    }

    applyRejuvenation() {
        this.rejuvenationTargets.set(this.currentTarget, {
            duration: 15,
            healPerTick: 0.25,
            tickRate: 3
        });
    }

    applyRegrowth() {
        this.regrowthTargets.set(this.currentTarget, {
            duration: 12,
            healPerTick: 0.15,
            tickRate: 2
        });
    }

    applyLifebloom() {
        this.lifeboomTargets.set(this.currentTarget, {
            duration: 15,
            healPerTick: 0.2,
            bloomHeal: 1.5,
            tickRate: 1
        });
    }

    applyWildGrowth(targetCount) {
        for (let i = 0; i < targetCount; i++) {
            this.wildGrowthTargets.set(`target_${i}`, {
                duration: 7,
                healPerTick: 0.15,
                tickRate: 1
            });
        }
    }

    createEfflorescence() {
        this.efflorescenceSystem.active = true;
        this.efflorescenceSystem.position = this.currentPosition;

        setTimeout(() => {
            this.efflorescenceSystem.active = false;
        }, 30000);
    }

    extendAllHoTs(seconds) {
        // 모든 HoT 지속시간 연장
        this.rejuvenationTargets.forEach(hot => {
            hot.duration += seconds;
        });
        this.regrowthTargets.forEach(hot => {
            hot.duration += seconds;
        });
        this.lifeboomTargets.forEach(hot => {
            hot.duration += seconds;
        });
        this.wildGrowthTargets.forEach(hot => {
            hot.duration += seconds;
        });
    }

    hasRejuvenation() {
        return this.rejuvenationTargets.has(this.currentTarget);
    }

    hasRegrowth() {
        return this.regrowthTargets.has(this.currentTarget);
    }

    hasLifebloom() {
        return this.lifeboomTargets.has(this.currentTarget);
    }

    targetNeedsHeal() {
        return true; // 더미 값
    }

    targetLowHealth() {
        return true; // 더미 값
    }

    targetCriticalHealth() {
        return true; // 더미 값
    }

    groupNeedsHeal() {
        return false; // 더미 값
    }

    raidCriticalHealth() {
        return false; // 더미 값
    }

    heavyHealingNeeded() {
        return false; // 더미 값
    }

    manyActiveHoTs() {
        return this.rejuvenationTargets.size + this.regrowthTargets.size +
               this.lifeboomTargets.size + this.wildGrowthTargets.size > 10;
    }

    targetTakingDamage() {
        return false; // 더미 값
    }
}

module.exports = {
    BalanceDruid,
    FeralDruid,
    GuardianDruid,
    RestorationDruid
};