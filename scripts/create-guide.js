#!/usr/bin/env node

import { SpecDataCollector } from '../src/generators/SpecDataCollector.js';
import { ValidationPipeline } from '../src/generators/ValidationPipeline.js';
import { GuideGenerator, AppRouter } from '../src/generators/GuideGenerator.js';
import { SkillAutoResolver } from '../src/generators/SkillAutoResolver.js';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * create-guide.js - WoW 가이드 자동 생성 CLI
 *
 * 사용법:
 *   node scripts/create-guide.js <className> <specName> [options]
 *
 * 옵션:
 *   --update         기존 가이드 업데이트 (덮어쓰기)
 *   --validate-only  검증만 수행 (파일 생성 안 함)
 *   --dry-run        시뮬레이션 (파일 생성 안 함)
 *   --skip-build     빌드 테스트 건너뛰기
 *   --verbose        상세 출력
 *
 * 예시:
 *   node scripts/create-guide.js mage arcane
 *   node scripts/create-guide.js deathknight frost --update
 *   node scripts/create-guide.js hunter beast-mastery --validate-only
 */

class CreateGuideOrchestrator {
  constructor(className, specName, options = {}) {
    this.className = className;
    this.specName = specName;
    this.options = options;
    this.startTime = Date.now();
  }

  /**
   * 메인 실행 함수
   */
  async run() {
    try {
      this.printHeader();

      // Phase 0: 사전 체크
      console.log('\n📋 Phase 0/6: 사전 체크');
      await this.preflightCheck();

      if (this.options.dryRun) {
        console.log('\n🔍 [DRY RUN] 시뮬레이션 모드 - 파일 생성 안 함');
      }

      // Phase 1: 데이터 수집
      console.log('\n📥 Phase 1/6: 데이터 수집 (Wowhead/Maxroll)');
      const collectedData = await this.collectData();

      // Phase 2: 스킬 자동 해결
      console.log('\n🔍 Phase 2/6: 스킬 자동 해결');
      await this.resolveSkills(collectedData);

      // Phase 3: 데이터 검증
      console.log('\n✅ Phase 3/6: 5단계 검증');
      const validationResult = await this.validateData(collectedData);

      if (!validationResult.success && !this.options.update) {
        console.error('\n❌ 검증 실패 - 가이드 생성 중단');
        this.printValidationSummary(validationResult);
        process.exit(1);
      }

      if (this.options.validateOnly) {
        console.log('\n✅ 검증 완료 (--validate-only 모드)');
        this.printValidationSummary(validationResult);
        return;
      }

      // Phase 4: 파일 생성
      console.log('\n📝 Phase 4/6: 가이드 파일 생성');
      if (!this.options.dryRun) {
        await this.generateFiles(collectedData);
      } else {
        console.log('  🔍 [DRY RUN] 파일 생성 건너뜀');
      }

      // Phase 5: 라우팅 추가
      console.log('\n🔗 Phase 5/6: App.js 라우팅 추가');
      if (!this.options.dryRun) {
        await this.addRouting();
      } else {
        console.log('  🔍 [DRY RUN] 라우팅 추가 건너뜀');
      }

      // Phase 6: 빌드 테스트
      if (!this.options.skipBuild && !this.options.dryRun) {
        console.log('\n🔨 Phase 6/6: 빌드 테스트');
        await this.buildTest();
      } else {
        console.log('\n⏭️  Phase 6/6: 빌드 테스트 건너뜀');
      }

      this.printSuccess();

    } catch (error) {
      this.printError(error);
      process.exit(1);
    }
  }

  /**
   * Phase 0: 사전 체크
   */
  async preflightCheck() {
    // 1. 클래스/전문화 유효성 검증
    console.log(`  - 클래스/전문화: ${this.className}/${this.specName}`);

    try {
      const { getSpecMetadata } = await import('../src/data/classMetadata.js');
      const specData = getSpecMetadata(this.className, this.specName);

      if (!specData) {
        throw new Error(`유효하지 않은 클래스/전문화: ${this.className}/${this.specName}`);
      }

      console.log(`  ✓ 영웅 특성: ${specData.heroTalents.map(h => h.korean).join(', ')}`);

    } catch (error) {
      throw new Error(`메타데이터 로드 실패: ${error.message}`);
    }

    // 2. 출력 디렉토리 존재 확인
    const outputDir = path.join(process.cwd(), 'src', 'specs', this.className, this.specName);
    try {
      await fs.access(outputDir);
      if (!this.options.update) {
        throw new Error(`가이드가 이미 존재합니다: ${outputDir}\n  --update 플래그를 사용하여 덮어쓰기`);
      }
      console.log(`  ⚠️  기존 가이드 업데이트 모드`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      console.log(`  ✓ 신규 가이드 생성`);
    }

    // 3. 필수 디렉토리 확인
    const requiredDirs = [
      'src/specs',
      'src/generators',
      'database-builder'
    ];

    for (const dir of requiredDirs) {
      try {
        await fs.access(dir);
      } catch {
        throw new Error(`필수 디렉토리 없음: ${dir}`);
      }
    }

    console.log(`  ✓ 모든 사전 체크 통과`);
  }

  /**
   * Phase 1: 데이터 수집
   */
  async collectData() {
    const collector = new SpecDataCollector(this.className, this.specName);

    if (this.options.verbose) {
      console.log('  - Wowhead 로테이션 가이드 수집 중...');
      console.log('  - Maxroll 스탯 데이터 수집 중...');
    }

    const collectedData = await collector.collect();

    console.log(`  ✓ 데이터 수집 완료`);
    console.log(`    - 영웅 특성: ${Object.keys(collectedData.rotation).length}개`);
    console.log(`    - 수집된 스킬: ${Object.keys(collectedData.skills).length}개`);

    return collectedData;
  }

  /**
   * Phase 2: 스킬 자동 해결
   */
  async resolveSkills(collectedData) {
    const resolver = new SkillAutoResolver(this.className);
    await resolver.initialize();

    // 로테이션에서 사용된 모든 스킬 추출
    const usedSkills = new Set();
    for (const heroData of Object.values(collectedData.rotation)) {
      heroData.opener?.forEach(item => {
        if (item.skillId && !collectedData.skills[item.skillId]) {
          usedSkills.add(item.skillName);
        }
      });
      heroData.singleTarget?.forEach(item => {
        if (item.skillId && !collectedData.skills[item.skillId]) {
          usedSkills.add(item.skillName);
        }
      });
      heroData.aoe?.forEach(item => {
        if (item.skillId && !collectedData.skills[item.skillId]) {
          usedSkills.add(item.skillName);
        }
      });
    }

    if (usedSkills.size === 0) {
      console.log(`  ✓ 모든 스킬 데이터 존재`);
      return;
    }

    console.log(`  - 누락된 스킬 ${usedSkills.size}개 자동 검색 중...`);

    // 배치 처리로 스킬 검색
    const resolvedSkills = await resolver.resolveBatch([...usedSkills]);

    // collectedData.skills에 추가
    for (const [skillName, skillData] of resolvedSkills) {
      if (skillData) {
        collectedData.skills[skillData.id] = skillData;
      }
    }

    await resolver.cleanup();

    console.log(`  ✓ 스킬 자동 해결 완료 (${resolvedSkills.size}/${usedSkills.size})`);
  }

  /**
   * Phase 3: 데이터 검증
   */
  async validateData(collectedData) {
    const validator = new ValidationPipeline(collectedData);
    const result = await validator.validate();

    if (this.options.verbose) {
      validator.printReport();
    } else {
      console.log(`  - 치명적 오류: ${result.summary.criticalErrors}개`);
      console.log(`  - 경고: ${result.summary.totalWarnings}개`);
    }

    if (result.success) {
      console.log(`  ✓ 모든 검증 통과`);
    } else {
      console.log(`  ⚠️  ${result.summary.criticalErrors}개 오류 발견`);
    }

    return result;
  }

  /**
   * Phase 4: 파일 생성
   */
  async generateFiles(collectedData) {
    const generator = new GuideGenerator(this.className, this.specName, collectedData);
    await generator.generate();
    console.log(`  ✓ 6개 파일 생성 완료`);
  }

  /**
   * Phase 5: 라우팅 추가
   */
  async addRouting() {
    const router = new AppRouter(this.className, this.specName);
    await router.addRoute();
    console.log(`  ✓ 라우팅 추가 안내 출력 (수동 추가 필요)`);
  }

  /**
   * Phase 6: 빌드 테스트
   */
  async buildTest() {
    return new Promise((resolve, reject) => {
      console.log('  - npm run build 실행 중...');

      const buildProcess = spawn('npm', ['run', 'build'], {
        cwd: process.cwd(),
        stdio: 'pipe',
        shell: true
      });

      let output = '';

      buildProcess.stdout.on('data', (data) => {
        output += data.toString();
        if (this.options.verbose) {
          process.stdout.write(data);
        }
      });

      buildProcess.stderr.on('data', (data) => {
        output += data.toString();
        if (this.options.verbose) {
          process.stderr.write(data);
        }
      });

      buildProcess.on('close', (code) => {
        if (code === 0) {
          console.log('  ✓ 빌드 성공');

          // 빌드 크기 확인
          const sizeMatch = output.match(/(\d+\.\d+\s+\w+)/);
          if (sizeMatch) {
            console.log(`    - 빌드 크기: ${sizeMatch[0]}`);
          }

          resolve();
        } else {
          console.error('  ❌ 빌드 실패');
          reject(new Error(`빌드 실패 (exit code: ${code})`));
        }
      });
    });
  }

  /**
   * 헤더 출력
   */
  printHeader() {
    console.log('======================================================================');
    console.log('  WoW 가이드 자동 생성 시스템');
    console.log('======================================================================');
    console.log(`클래스: ${this.className}`);
    console.log(`전문화: ${this.specName}`);
    console.log(`모드: ${this.options.dryRun ? 'DRY RUN' : this.options.validateOnly ? 'VALIDATE ONLY' : '전체 생성'}`);
    console.log('======================================================================\n');
  }

  /**
   * 검증 결과 요약
   */
  printValidationSummary(result) {
    console.log('\n══════════════════════════════════════════════════════════');
    console.log('  검증 결과 요약');
    console.log('══════════════════════════════════════════════════════════\n');

    if (result.success) {
      console.log('✅ 모든 검증 통과! 문제 없음.\n');
    } else {
      console.log(`❌ 치명적 오류: ${result.summary.criticalErrors}개`);
      console.log(`⚠️  경고: ${result.summary.totalWarnings}개\n`);

      if (result.errors.length > 0) {
        console.log('주요 오류:');
        result.errors.slice(0, 5).forEach((err, idx) => {
          console.log(`  ${idx + 1}. [${err.type}] ${err.message}`);
        });
        if (result.errors.length > 5) {
          console.log(`  ... 그 외 ${result.errors.length - 5}개 오류`);
        }
        console.log();
      }

      if (result.warnings.length > 0) {
        console.log('주요 경고:');
        result.warnings.slice(0, 3).forEach((warn, idx) => {
          console.log(`  ${idx + 1}. [${warn.type}] ${warn.message}`);
        });
        if (result.warnings.length > 3) {
          console.log(`  ... 그 외 ${result.warnings.length - 3}개 경고`);
        }
        console.log();
      }
    }

    console.log('══════════════════════════════════════════════════════════\n');
  }

  /**
   * 성공 메시지
   */
  printSuccess() {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);

    console.log('\n\n');
    console.log('══════════════════════════════════════════════════════════');
    console.log('  ✅ 가이드 생성 완료!');
    console.log('══════════════════════════════════════════════════════════\n');
    console.log(`소요 시간: ${elapsed}초`);
    console.log(`출력 위치: src/specs/${this.className}/${this.specName}/`);
    console.log(`\n가이드 확인:`);
    console.log(`  http://localhost:3002/guide/${this.className}/${this.specName}`);
    console.log('\n다음 단계:');
    console.log('  1. App.js에 라우트 추가 (위 콘솔 출력 참조)');
    console.log('  2. npm start로 개발 서버 시작');
    console.log('  3. 브라우저에서 가이드 확인\n');
    console.log('══════════════════════════════════════════════════════════\n');
  }

  /**
   * 에러 메시지
   */
  printError(error) {
    console.error('\n\n');
    console.error('══════════════════════════════════════════════════════════');
    console.error('  ❌ 가이드 생성 실패');
    console.error('══════════════════════════════════════════════════════════\n');
    console.error(`오류: ${error.message}`);
    if (this.options.verbose && error.stack) {
      console.error(`\n스택 트레이스:\n${error.stack}`);
    }
    console.error('\n══════════════════════════════════════════════════════════\n');
  }
}

/**
 * CLI 인자 파싱
 */
function parseArgs(args) {
  const [className, specName, ...flags] = args;

  if (!className || !specName) {
    console.error('사용법: node scripts/create-guide.js <className> <specName> [options]');
    console.error('\n예시:');
    console.error('  node scripts/create-guide.js mage arcane');
    console.error('  node scripts/create-guide.js deathknight frost --update');
    console.error('  node scripts/create-guide.js hunter beast-mastery --validate-only');
    console.error('\n옵션:');
    console.error('  --update         기존 가이드 업데이트');
    console.error('  --validate-only  검증만 수행');
    console.error('  --dry-run        시뮬레이션 (파일 생성 안 함)');
    console.error('  --skip-build     빌드 테스트 건너뛰기');
    console.error('  --verbose        상세 출력');
    process.exit(1);
  }

  const options = {
    update: flags.includes('--update'),
    validateOnly: flags.includes('--validate-only'),
    dryRun: flags.includes('--dry-run'),
    skipBuild: flags.includes('--skip-build'),
    verbose: flags.includes('--verbose')
  };

  return { className, specName, options };
}

/**
 * 메인 실행
 */
async function main() {
  const { className, specName, options } = parseArgs(process.argv.slice(2));
  const orchestrator = new CreateGuideOrchestrator(className, specName, options);
  await orchestrator.run();
}

// 실행
main().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
