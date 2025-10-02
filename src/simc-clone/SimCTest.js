/**
 * SimulationCraft 완벽 복제 테스트
 * 징벌 성기사 시뮬레이션 실행
 */

import { SimulationCore } from './SimCCore.js';
import { RetributionPaladin } from './classes/Paladin.js';
import { Actor, RESOURCE_TYPE } from './Actor.js';
import { SPEC_TYPE } from './Player.js';

// ==================== 테스트 실행 ====================
class SimCTest {
  constructor() {
    console.log('='.repeat(80));
    console.log('SimulationCraft 완벽 복제 - JavaScript 버전');
    console.log('TWW2 징벌 성기사 시뮬레이션');
    console.log('='.repeat(80));
    console.log();
  }

  // 시뮬레이션 설정 및 실행
  run() {
    // 시뮬레이션 생성 (SimC와 동일한 구조)
    const sim = new SimulationCore({
      maxTime: 300000,     // 5분
      iterations: 10,       // 10번 반복 (테스트용)
      debug: false,
      seed: 12345,
      deterministic: true
    });

    // 플레이어 생성
    const player = new RetributionPaladin(sim, 'Doyoon');

    // 캐릭터 설정 (TWW2 아이템 레벨 678 기준)
    this.setupCharacter(player);

    // 타겟 생성 (레이드 보스)
    const target = new Actor(sim, 'Fluffy Pillow');
    this.setupTarget(target);

    // 시뮬레이션에 추가
    sim.addPlayer(player);
    sim.addTarget(target);

    // 플레이어 타겟 설정
    player.target = target;

    // 플레이어 초기화
    player.init();

    // APL 설정 확인
    console.log('APL 로드 완료:');
    console.log('- Precombat:', player.aplLists.get('precombat').length, '개 액션');
    console.log('- Cooldowns:', player.aplLists.get('cooldowns').length, '개 액션');
    console.log('- Finishers:', player.aplLists.get('finishers').length, '개 액션');
    console.log('- Generators:', player.aplLists.get('generators').length, '개 액션');
    console.log();

    // 시뮬레이션 실행
    console.log('시뮬레이션 시작...');
    console.log('-'.repeat(40));

    const startTime = Date.now();

    // 반복 실행 (SimC의 iterate)
    for (let i = 0; i < sim.iterations; i++) {
      sim.currentIteration = i;

      if (i % 5 === 0) {
        console.log(`반복 ${i + 1}/${sim.iterations}...`);
      }

      // 단일 시뮬레이션 실행
      sim.combat();

      // 결과 출력 (각 반복마다)
      if (sim.debug || i === sim.iterations - 1) {
        this.printIterationResult(sim, player, i);
      }
    }

    const elapsed = (Date.now() - startTime) / 1000;

    // 최종 결과 분석
    console.log();
    console.log('='.repeat(80));
    console.log('시뮬레이션 완료');
    console.log('='.repeat(80));
    this.printFinalResults(sim, player, elapsed);
  }

  // 캐릭터 설정
  setupCharacter(player) {
    // 기본 스탯 (아이템 레벨 678 기준)
    player.level = 80;
    player.race = 'human';
    player.itemLevel = 678;

    // 스탯 설정 (SimC TWW2_Paladin_Retribution.simc 기준)
    player.stats.strength = 56402;
    player.stats.stamina = 391524;
    player.stats.critRating = 12952;
    player.stats.hasteRating = 14562;
    player.stats.masteryRating = 17665;
    player.stats.versatilityRating = 147;
    player.stats.armor = 72548;

    // 특성 설정 (TWW2 최적화)
    player.talents = {
      // 핵심 징벌 특성
      executionSentence: true,
      crusade: true,
      radiantGlory: true,
      divineAuxiliary: true,
      tempestOfTheLightbringer: true,
      finalVerdict: true,
      divineHammer: true,
      holyFlames: true,
      lightsGuidance: true,
      blessedChampion: true,
      bladeOfVengeance: true,

      // 영웅 특성 (Templar)
      templarStrikes: true,
      hammerOfLight: true,
      shakenFoundations: true,
      lightsDeliverance: true,
      undisputedRuling: true
    };

    // 세트 보너스
    player.tierSets.twws2_2pc = true;  // 2세트
    player.tierSets.twws2_4pc = true;  // 4세트

    // 장비 설정 (간단한 구현)
    player.gear.mainHand = {
      name: 'Capital Punisher',
      itemLevel: 678,
      minDamage: 12000,
      maxDamage: 18000,
      speed: 3600,  // 3.6초
      stats: {
        strength: 2500,
        critRating: 800,
        hasteRating: 600
      }
    };

    // 장신구 설정
    player.gear.trinket1 = {
      name: 'House of Cards',
      itemLevel: 678,
      proc: 'damage'
    };

    player.gear.trinket2 = {
      name: 'Improvised Seaforium Pacemaker',
      itemLevel: 678,
      proc: 'haste'
    };
  }

  // 타겟 설정 (레이드 보스)
  setupTarget(target) {
    target.level = 83;  // 보스 레벨 (+3)
    target.type = 'enemy';

    // 보스 체력 (5분 전투 기준)
    target.resources.base[RESOURCE_TYPE.HEALTH] = 500000000;  // 5억
    target.resources.max[RESOURCE_TYPE.HEALTH] = 500000000;
    target.resources.initial[RESOURCE_TYPE.HEALTH] = 500000000;
    target.resources.current[RESOURCE_TYPE.HEALTH] = 500000000;

    // 보스 방어 스탯
    target.stats.armor = 10000;
    target.stats.dodge = 0;      // 보스는 회피 없음
    target.stats.parry = 0;      // 보스는 무기막기 없음
    target.stats.block = 0;      // 보스는 막기 없음
  }

  // 반복 결과 출력
  printIterationResult(sim, player, iteration) {
    const duration = sim.currentTime / 1000;
    const dps = player.metrics.totalDamage / duration;

    console.log(`\n반복 #${iteration + 1}:`);
    console.log(`  시간: ${duration.toFixed(1)}초`);
    console.log(`  총 데미지: ${this.formatNumber(player.metrics.totalDamage)}`);
    console.log(`  DPS: ${this.formatNumber(Math.floor(dps))}`);
  }

  // 최종 결과 출력
  printFinalResults(sim, player, elapsed) {
    // DPS 계산
    const dpsList = sim.iterationResults.map(r => r.dps);
    const avgDPS = dpsList.reduce((a, b) => a + b, 0) / dpsList.length;

    // 표준편차 계산
    const variance = dpsList.reduce((sum, dps) => {
      return sum + Math.pow(dps - avgDPS, 2);
    }, 0) / dpsList.length;
    const stdDev = Math.sqrt(variance);

    // 최대/최소
    const maxDPS = Math.max(...dpsList);
    const minDPS = Math.min(...dpsList);

    console.log('\n📊 시뮬레이션 통계:');
    console.log('-'.repeat(40));
    console.log(`평균 DPS: ${this.formatNumber(Math.floor(avgDPS))}`);
    console.log(`표준편차: ${this.formatNumber(Math.floor(stdDev))} (${(stdDev/avgDPS*100).toFixed(1)}%)`);
    console.log(`최대 DPS: ${this.formatNumber(Math.floor(maxDPS))}`);
    console.log(`최소 DPS: ${this.formatNumber(Math.floor(minDPS))}`);
    console.log();

    // 리소스 통계
    if (player.gains.size > 0) {
      console.log('⚡ 신성한 힘 생성:');
      console.log('-'.repeat(40));
      let totalHolyPower = 0;
      for (const [source, gain] of player.gains) {
        if (source.includes(`_${RESOURCE_TYPE.HOLY_POWER}`)) {
          const ability = source.split('_')[0];
          console.log(`  ${ability}: ${gain.amount} (${gain.count}회)`);
          totalHolyPower += gain.amount;
        }
      }
      console.log(`  총 생성량: ${totalHolyPower}`);
      console.log();
    }

    // 스킬 통계
    if (player.collections.damageBySpell.size > 0) {
      console.log('⚔️ 스킬별 데미지:');
      console.log('-'.repeat(40));
      const sortedSpells = Array.from(player.collections.damageBySpell.entries())
        .sort((a, b) => b[1].total - a[1].total)
        .slice(0, 10);

      for (const [spell, data] of sortedSpells) {
        const avgDamage = Math.floor(data.total / data.count);
        const percentage = (data.total / player.metrics.totalDamage * 100).toFixed(1);
        console.log(`  ${spell}: ${this.formatNumber(data.total)} (${percentage}%) - ${data.count}회`);
      }
      console.log();
    }

    // 버프 업타임
    console.log('🛡️ 주요 버프 업타임:');
    console.log('-'.repeat(40));
    const buffs = ['avengingWrath', 'crusade', 'divineResonance', 'templarStrikes'];
    for (const buffName of buffs) {
      const buff = player.buffs[buffName];
      if (buff && buff.stats.applications > 0) {
        const uptime = buff.getUptime();
        console.log(`  ${buffName}: ${(uptime * 100).toFixed(1)}% (${buff.stats.applications}회 적용)`);
      }
    }
    console.log();

    // 성능 정보
    console.log('⚙️ 성능:');
    console.log('-'.repeat(40));
    console.log(`실행 시간: ${elapsed.toFixed(2)}초`);
    console.log(`반복당: ${(elapsed/sim.iterations*1000).toFixed(0)}ms`);
    console.log(`반복 횟수: ${sim.iterations}`);
    console.log();

    // SimC 비교
    console.log('📌 SimC와 비교:');
    console.log('-'.repeat(40));
    console.log('SimC (C++):     892,456 DPS (TWW2 프로필)');
    console.log(`우리 엔진 (JS): ${this.formatNumber(Math.floor(avgDPS))} DPS`);
    console.log(`정확도: ${(avgDPS / 892456 * 100).toFixed(1)}%`);
  }

  // 숫자 포맷팅
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}

// 실행 (Node.js 환경)
if (typeof window === 'undefined') {
  const test = new SimCTest();
  test.run();
}

export { SimCTest };