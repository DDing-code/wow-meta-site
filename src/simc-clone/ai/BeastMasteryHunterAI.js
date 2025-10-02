/**
 * Beast Mastery Hunter AI System
 * TWW 11.2 Season 3
 *
 * APL 기반 야수 사냥꾼 AI 시스템
 * SimulationCraft 로직과 최신 가이드 통합
 */

import { BaseAI } from './BaseAI.js';
import { APLParser } from '../apl/APLParser.js';
import { APLExecutor } from '../apl/APLExecutor.js';

class BeastMasteryHunterAI extends BaseAI {
    constructor(hunter) {
        super(hunter);

        this.spec = 'beast_mastery';
        this.name = '야수 사냥꾼 AI';

        // 핵심 리소스
        this.resources = {
            focus: {
                current: 100,
                max: 100,
                regenRate: 10, // 초당 집중 재생
                spending: 0,
                generation: 0
            },
            frenzyStacks: 0,
            frenzyMaxStacks: 3,
            beastCleaveActive: false,
            callOfTheWildActive: false
        };

        // 쿨다운 추적
        this.cooldowns = new Map([
            ['bestial_wrath', { duration: 90, remaining: 0, charges: 1 }],
            ['barbed_shot', { duration: 12, remaining: 0, charges: 2, maxCharges: 2 }],
            ['kill_command', { duration: 10, remaining: 0, charges: 1 }],
            ['call_of_the_wild', { duration: 180, remaining: 0, charges: 1 }],
            ['dire_beast', { duration: 20, remaining: 0, charges: 1 }],
            ['aspect_of_the_wild', { duration: 120, remaining: 0, charges: 1 }]
        ]);

        // 버프/디버프 추적
        this.buffs = new Map([
            ['frenzy', { stacks: 0, duration: 0, maxStacks: 3 }],
            ['beast_cleave', { active: false, duration: 0 }],
            ['bestial_wrath', { active: false, duration: 0 }],
            ['call_of_the_wild', { active: false, duration: 0 }],
            ['wild_call', { active: false, procChance: 0.20 }]
        ]);

        // 타겟 추적
        this.targets = {
            primary: null,
            secondary: [],
            count: 1,
            inMeleeRange: 0,
            inRangedRange: 0
        };

        // APL 정의
        this.apl = this.defineAPL();
        this.aplParser = new APLParser();
        this.aplExecutor = new APLExecutor(this);

        // 성능 메트릭
        this.metrics = {
            totalDamage: 0,
            totalCasts: 0,
            focusWasted: 0,
            frenzyUptime: 0,
            beastCleaveUptime: 0,
            gcdUsage: 0
        };

        this.initializeAPL();
    }

    /**
     * APL (Action Priority List) 정의
     * SimC 스타일 우선순위 시스템
     */
    defineAPL() {
        return {
            // 오프너 시퀀스
            opener: [
                { action: 'bestial_wrath', condition: 'combat_start' },
                { action: 'barbed_shot', condition: 'charges>=2' },
                { action: 'call_of_the_wild', condition: 'bestial_wrath.active' },
                { action: 'kill_command', condition: 'focus>=30' },
                { action: 'barbed_shot', condition: 'charges>=1' },
                { action: 'cobra_shot', condition: 'focus>=35' }
            ],

            // 단일 타겟 우선순위
            single_target: [
                // 1. 야수의 격노 사용 (쿨다운마다)
                {
                    action: 'bestial_wrath',
                    condition: '!buff.bestial_wrath.up&cooldown.bestial_wrath.ready'
                },

                // 2. 날카로운 사격 - 광란 유지
                {
                    action: 'barbed_shot',
                    condition: 'pet.buff.frenzy.remains<gcd&charges>=1'
                },

                // 3. 야생의 부름 (최대 버스트)
                {
                    action: 'call_of_the_wild',
                    condition: 'cooldown.call_of_the_wild.ready&buff.bestial_wrath.up'
                },

                // 4. 살상 명령
                {
                    action: 'kill_command',
                    condition: 'cooldown.kill_command.ready&focus>=30'
                },

                // 5. 날카로운 사격 - 충전 관리
                {
                    action: 'barbed_shot',
                    condition: '(charges>=2|(charges>=1&buff.wild_call.up))&buff.frenzy.stacks<3'
                },

                // 6. 무쇠덫
                {
                    action: 'steel_trap',
                    condition: 'cooldown.steel_trap.ready'
                },

                // 7. 광포한 야수
                {
                    action: 'dire_beast',
                    condition: 'cooldown.dire_beast.ready'
                },

                // 8. 코브라 사격 - 집중 소비
                {
                    action: 'cobra_shot',
                    condition: '(focus>=50&cooldown.kill_command.remains>gcd)|focus>=90'
                },

                // 9. 신비한 사격 (필러)
                {
                    action: 'arcane_shot',
                    condition: 'focus>=40&!cooldown.kill_command.ready'
                }
            ],

            // AoE (3+ 타겟) 우선순위
            aoe: [
                // 1. 야수 쪼개기 유지
                {
                    action: 'multi_shot',
                    condition: '!buff.beast_cleave.up|buff.beast_cleave.remains<gcd'
                },

                // 2. 야수의 격노
                {
                    action: 'bestial_wrath',
                    condition: '!buff.bestial_wrath.up'
                },

                // 3. 날카로운 사격 - 다중 DoT
                {
                    action: 'barbed_shot',
                    condition: 'charges>=1&target.debuff.barbed_shot.remains<2'
                },

                // 4. 야생의 부름
                {
                    action: 'call_of_the_wild',
                    condition: 'buff.bestial_wrath.up&active_enemies>=3'
                },

                // 5. 다중 사격 - 야수 쪼개기 갱신
                {
                    action: 'multi_shot',
                    condition: 'buff.beast_cleave.remains<1.5'
                },

                // 6. 살상 명령
                {
                    action: 'kill_command',
                    condition: 'focus>=30'
                },

                // 7. 폭발 덫
                {
                    action: 'explosive_trap',
                    condition: 'cooldown.explosive_trap.ready'
                },

                // 8. 날카로운 사격 - 충전 소비
                {
                    action: 'barbed_shot',
                    condition: 'charges>=2'
                },

                // 9. 다중 사격 - 집중 소비
                {
                    action: 'multi_shot',
                    condition: 'focus>=40'
                },

                // 10. 코브라 사격
                {
                    action: 'cobra_shot',
                    condition: 'focus>=35'
                }
            ],

            // 쪼개기 (2 타겟)
            cleave: [
                {
                    action: 'multi_shot',
                    condition: 'buff.beast_cleave.remains<gcd'
                },
                {
                    action: 'barbed_shot',
                    condition: 'charges>=1'
                },
                {
                    action: 'kill_command',
                    condition: 'focus>=30'
                },
                {
                    action: 'multi_shot',
                    condition: 'buff.beast_cleave.remains<2'
                },
                {
                    action: 'cobra_shot',
                    condition: 'focus>=35'
                }
            ],

            // 쿨다운 관리
            cooldowns: [
                {
                    action: 'use_trinket',
                    condition: 'buff.bestial_wrath.up|buff.call_of_the_wild.up'
                },
                {
                    action: 'use_potion',
                    condition: 'buff.call_of_the_wild.up&buff.bestial_wrath.up'
                },
                {
                    action: 'aspect_of_the_wild',
                    condition: 'buff.bestial_wrath.up&(target.time_to_die>15|boss_fight)'
                },
                {
                    action: 'berserking',
                    condition: 'buff.bestial_wrath.up' // 종족 특성
                },
                {
                    action: 'blood_fury',
                    condition: 'buff.bestial_wrath.up' // 종족 특성
                }
            ]
        };
    }

    /**
     * APL 초기화
     */
    initializeAPL() {
        // APL 파싱
        this.aplParser.parse(this.apl);

        // 조건 함수 등록
        this.registerConditions();

        // 액션 함수 등록
        this.registerActions();
    }

    /**
     * 조건 평가 함수 등록
     */
    registerConditions() {
        const conditions = {
            'combat_start': () => this.combatTime < 2,
            'buff.bestial_wrath.up': () => this.buffs.get('bestial_wrath').active,
            'buff.bestial_wrath.remains': () => this.buffs.get('bestial_wrath').duration,
            'buff.frenzy.stacks': () => this.buffs.get('frenzy').stacks,
            'buff.frenzy.remains': () => this.buffs.get('frenzy').duration,
            'pet.buff.frenzy.remains': () => this.buffs.get('frenzy').duration,
            'buff.beast_cleave.up': () => this.buffs.get('beast_cleave').active,
            'buff.beast_cleave.remains': () => this.buffs.get('beast_cleave').duration,
            'buff.wild_call.up': () => Math.random() < this.buffs.get('wild_call').procChance,
            'buff.call_of_the_wild.up': () => this.buffs.get('call_of_the_wild').active,
            'cooldown.bestial_wrath.ready': () => this.cooldowns.get('bestial_wrath').remaining <= 0,
            'cooldown.barbed_shot.ready': () => this.cooldowns.get('barbed_shot').remaining <= 0,
            'cooldown.kill_command.ready': () => this.cooldowns.get('kill_command').remaining <= 0,
            'cooldown.kill_command.remains': () => this.cooldowns.get('kill_command').remaining,
            'cooldown.call_of_the_wild.ready': () => this.cooldowns.get('call_of_the_wild').remaining <= 0,
            'cooldown.dire_beast.ready': () => this.cooldowns.get('dire_beast').remaining <= 0,
            'cooldown.steel_trap.ready': () => this.cooldowns.get('steel_trap')?.remaining <= 0 || false,
            'cooldown.explosive_trap.ready': () => this.cooldowns.get('explosive_trap')?.remaining <= 0 || false,
            'charges': (ability) => this.cooldowns.get(ability)?.charges || 0,
            'focus': () => this.resources.focus.current,
            'gcd': () => 1.5 / (1 + this.player.stats.haste / 100),
            'active_enemies': () => this.targets.count,
            'target.health': () => this.targets.primary?.health || 0,
            'target.time_to_die': () => this.estimateTimeToDie(),
            'target.debuff.barbed_shot.remains': () => this.getDebuffRemaining('barbed_shot'),
            'boss_fight': () => this.targets.primary?.isBoss || false
        };

        this.aplExecutor.registerConditions(conditions);
    }

    /**
     * 액션 실행 함수 등록
     */
    registerActions() {
        const actions = {
            'bestial_wrath': () => this.castBestialWrath(),
            'barbed_shot': () => this.castBarbedShot(),
            'kill_command': () => this.castKillCommand(),
            'cobra_shot': () => this.castCobraShot(),
            'multi_shot': () => this.castMultiShot(),
            'arcane_shot': () => this.castArcaneShot(),
            'call_of_the_wild': () => this.castCallOfTheWild(),
            'dire_beast': () => this.castDireBeast(),
            'aspect_of_the_wild': () => this.castAspectOfTheWild(),
            'steel_trap': () => this.castSteelTrap(),
            'explosive_trap': () => this.castExplosiveTrap(),
            'use_trinket': () => this.useTrinket(),
            'use_potion': () => this.usePotion(),
            'berserking': () => this.castRacial('berserking'),
            'blood_fury': () => this.castRacial('blood_fury')
        };

        this.aplExecutor.registerActions(actions);
    }

    /**
     * 메인 의사결정 함수
     */
    async makeDecision(gameState) {
        // 게임 상태 업데이트
        this.updateGameState(gameState);

        // 글로벌 쿨다운 체크
        if (this.isOnGCD()) {
            return null;
        }

        // 타겟 선택
        if (!this.selectTarget()) {
            return { action: 'idle', reason: 'No valid target' };
        }

        // 상황별 APL 선택
        const activeAPL = this.selectAPL();

        // APL 실행
        const action = await this.aplExecutor.execute(activeAPL);

        // 메트릭 업데이트
        this.updateMetrics(action);

        return action;
    }

    /**
     * 상황에 맞는 APL 선택
     */
    selectAPL() {
        // 전투 시작 2초 이내: 오프너
        if (this.combatTime < 2) {
            return this.apl.opener;
        }

        // 3+ 타겟: AoE
        if (this.targets.count >= 3) {
            return this.apl.aoe;
        }

        // 2 타겟: 쪼개기
        if (this.targets.count === 2) {
            return this.apl.cleave;
        }

        // 단일 타겟
        return this.apl.single_target;
    }

    /**
     * 야수의 격노 시전
     */
    castBestialWrath() {
        if (!this.canCast('bestial_wrath')) return false;

        this.buffs.set('bestial_wrath', {
            active: true,
            duration: 15
        });

        this.cooldowns.get('bestial_wrath').remaining = 90;

        // 펫 버프도 적용
        if (this.player.pet) {
            this.player.pet.applyBuff('bestial_wrath', 15);
        }

        this.triggerGCD();
        return {
            action: 'bestial_wrath',
            success: true,
            damage: 0,
            cost: 0
        };
    }

    /**
     * 날카로운 사격 시전
     */
    castBarbedShot() {
        if (!this.canCast('barbed_shot')) return false;

        const cd = this.cooldowns.get('barbed_shot');
        if (cd.charges < 1) return false;

        // 충전 소비
        cd.charges--;
        if (cd.charges === 0) {
            cd.remaining = 12;
        }

        // 집중 생성
        this.resources.focus.current = Math.min(
            this.resources.focus.current + 20,
            this.resources.focus.max
        );

        // 광란 스택 적용/갱신
        const frenzy = this.buffs.get('frenzy');
        if (frenzy.stacks < 3) {
            frenzy.stacks++;
        }
        frenzy.duration = 8;

        // 펫 공격 속도 증가
        if (this.player.pet) {
            this.player.pet.stats.attackSpeed *= 1.1;
        }

        // DoT 적용
        this.applyDebuff('barbed_shot', 8, this.targets.primary);

        this.triggerGCD();
        return {
            action: 'barbed_shot',
            success: true,
            damage: this.calculateDamage(15000),
            cost: 0,
            focusGain: 20
        };
    }

    /**
     * 살상 명령 시전
     */
    castKillCommand() {
        if (!this.canCast('kill_command')) return false;
        if (this.resources.focus.current < 30) return false;

        this.resources.focus.current -= 30;
        this.cooldowns.get('kill_command').remaining = 10;

        // 코브라 사격으로 쿨다운 감소 적용
        const reduction = this.getKillCommandCDR();
        this.cooldowns.get('kill_command').remaining -= reduction;

        const damage = this.calculateDamage(45000);

        this.triggerGCD();
        return {
            action: 'kill_command',
            success: true,
            damage: damage,
            cost: 30
        };
    }

    /**
     * 코브라 사격 시전
     */
    castCobraShot() {
        if (!this.canCast('cobra_shot')) return false;
        if (this.resources.focus.current < 35) return false;

        this.resources.focus.current -= 35;

        // 살상 명령 쿨다운 1초 감소
        const kcCD = this.cooldowns.get('kill_command');
        if (kcCD.remaining > 0) {
            kcCD.remaining = Math.max(0, kcCD.remaining - 1);
        }

        const damage = this.calculateDamage(12000);

        this.triggerGCD();
        return {
            action: 'cobra_shot',
            success: true,
            damage: damage,
            cost: 35
        };
    }

    /**
     * 다중 사격 시전
     */
    castMultiShot() {
        if (!this.canCast('multi_shot')) return false;
        if (this.resources.focus.current < 40) return false;

        this.resources.focus.current -= 40;

        // 야수 쪼개기 버프 적용
        this.buffs.set('beast_cleave', {
            active: true,
            duration: 4
        });

        const damage = this.calculateDamage(8000) * this.targets.count;

        this.triggerGCD();
        return {
            action: 'multi_shot',
            success: true,
            damage: damage,
            cost: 40,
            targetsHit: this.targets.count
        };
    }

    /**
     * 야생의 부름 시전
     */
    castCallOfTheWild() {
        if (!this.canCast('call_of_the_wild')) return false;

        this.buffs.set('call_of_the_wild', {
            active: true,
            duration: 20
        });

        this.cooldowns.get('call_of_the_wild').remaining = 180;

        // 추가 펫 소환 효과
        this.summonAdditionalPets(5);

        return {
            action: 'call_of_the_wild',
            success: true,
            damage: 0,
            cost: 0
        };
    }

    /**
     * 데미지 계산
     */
    calculateDamage(baseDamage) {
        let damage = baseDamage;

        // 야수의 격노 버프
        if (this.buffs.get('bestial_wrath').active) {
            damage *= 1.25;
        }

        // 야생의 부름 버프
        if (this.buffs.get('call_of_the_wild').active) {
            damage *= 1.20;
        }

        // 광란 스택당 펫 데미지 증가
        const frenzyStacks = this.buffs.get('frenzy').stacks;
        if (frenzyStacks > 0) {
            damage *= (1 + frenzyStacks * 0.05);
        }

        // 특화 효과
        damage *= (1 + this.player.stats.mastery / 100);

        // 치명타 확률
        if (Math.random() < this.player.stats.critical / 100) {
            damage *= 2;
        }

        return Math.floor(damage);
    }

    /**
     * 업데이트 함수 (매 프레임 호출)
     */
    update(deltaTime) {
        // 쿨다운 업데이트
        this.updateCooldowns(deltaTime);

        // 버프 업데이트
        this.updateBuffs(deltaTime);

        // 집중 재생
        this.regenerateFocus(deltaTime);

        // 펫 업데이트
        if (this.player.pet) {
            this.player.pet.update(deltaTime);
        }

        // 전투 시간 업데이트
        this.combatTime += deltaTime;
    }

    /**
     * 집중 재생
     */
    regenerateFocus(deltaTime) {
        const regenRate = 10 * (1 + this.player.stats.haste / 100);
        this.resources.focus.current = Math.min(
            this.resources.focus.current + regenRate * deltaTime,
            this.resources.focus.max
        );
    }

    /**
     * 쿨다운 업데이트
     */
    updateCooldowns(deltaTime) {
        for (const [name, cd] of this.cooldowns) {
            if (cd.remaining > 0) {
                cd.remaining = Math.max(0, cd.remaining - deltaTime);

                // 충전식 스킬 충전 회복
                if (cd.remaining === 0 && cd.charges < (cd.maxCharges || 1)) {
                    cd.charges++;
                    if (cd.charges < cd.maxCharges) {
                        cd.remaining = cd.duration;
                    }
                }
            }
        }
    }

    /**
     * 버프 업데이트
     */
    updateBuffs(deltaTime) {
        for (const [name, buff] of this.buffs) {
            if (buff.active && buff.duration > 0) {
                buff.duration = Math.max(0, buff.duration - deltaTime);
                if (buff.duration === 0) {
                    buff.active = false;

                    // 광란 스택 리셋
                    if (name === 'frenzy') {
                        buff.stacks = 0;
                    }
                }
            }
        }
    }

    /**
     * 성능 메트릭 출력
     */
    getMetrics() {
        return {
            ...this.metrics,
            focusEfficiency: 100 - (this.metrics.focusWasted / (this.metrics.totalCasts * 40) * 100),
            frenzyUptime: (this.metrics.frenzyUptime / this.combatTime * 100).toFixed(1) + '%',
            beastCleaveUptime: (this.metrics.beastCleaveUptime / this.combatTime * 100).toFixed(1) + '%',
            averageDamagePerCast: Math.floor(this.metrics.totalDamage / this.metrics.totalCasts)
        };
    }
}

export default BeastMasteryHunterAI;