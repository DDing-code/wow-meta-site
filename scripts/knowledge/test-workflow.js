#!/usr/bin/env node

/**
 * test-workflow.js - 지식 구조화 → 가이드 생성 전체 워크플로우 테스트
 *
 * Purpose: 야수 사냥꾼 케이스로 전체 시스템 검증
 *
 * Test Workflow:
 * 1. 샘플 Wowhead 데이터 준비 (야수 사냥꾼)
 * 2. KnowledgeStructurer로 Obsidian 노트 생성
 * 3. GuideGenerator로 React 가이드 자동 생성
 * 4. 결과 검증 및 리포트 출력
 */

import KnowledgeStructurer from '../../src/ai/personas/KnowledgeStructurer.js';
import GuideGenerator from '../../src/ai/personas/GuideGenerator.js';
import fs from 'fs-extra';
import path from 'path';

// ============================================================================
// 샘플 데이터: 야수 사냥꾼 (Wowhead 시뮬레이션)
// ============================================================================

const SAMPLE_WOWHEAD_DATA = {
  source: 'Wowhead',
  url: 'https://www.wowhead.com/guide/classes/hunter/beast-mastery/rotation-cooldowns-pve-dps',
  content: `
# Beast Mastery Hunter Guide

## 개요
야수 사냥꾼은 강력한 애완동물과 함께 싸우는 원거리 딜러입니다.

## 핵심 스킬

### Barbed Shot (날카로운 사격)
- ID: 217200
- 재사용 대기시간: 12초 (충전 2회)
- 집중 소모: 없음
- 집중 획득: 20
- 설명: 대상에게 피해를 입히고 애완동물의 공격 속도를 40% 증가시킵니다.
- 타입: core

### Kill Command (야수의 명령)
- ID: 34026
- 재사용 대기시간: 7.5초
- 집중 소모: 30
- 설명: 애완동물이 대상을 공격하도록 명령합니다.
- 타입: core

### Bestial Wrath (야수의 격노)
- ID: 19574
- 재사용 대기시간: 90초
- 집중 소모: 없음
- 설명: 15초 동안 애완동물의 피해가 25% 증가합니다.
- 타입: cooldown

### Cobra Shot (코브라 사격)
- ID: 193455
- 재사용 대기시간: 없음
- 집중 소모: 35
- 설명: 대상에게 독 피해를 입힙니다.
- 타입: core

## 영웅 특성

### Pack Leader (무리의 지도자)
- 애완동물 관련 버프 강화
- 야수의 격노 효과 증가

### Dark Ranger (어둠 순찰자)
- 그림자 피해 추가
- 원거리 딜 강화

## 로테이션 (무리의 지도자)

### 단일 대상
1. Bestial Wrath (쿨다운마다)
2. Barbed Shot (야수의 격노 중 사용, Frenzy 중첩 유지)
3. Kill Command (집중 충분할 때)
4. Cobra Shot (집중 회복용)

### 다수 대상 (3+ 타겟)
1. Bestial Wrath (쿨다운마다)
2. Barbed Shot (Frenzy 유지)
3. Multi-Shot (집중 소모)
4. Kill Command (보조)

## 스탯 우선순위 (무리의 지도자)
1. 민첩성
2. 치명타
3. 가속
4. 특화
5. 유연

## 특성 빌드

### 레이드 빌드 (무리의 지도자)
- 용도: 단일 대상 딜
- 코드: BWDAAAAAAAAAAAAAAAAAAAAAAAAAMzMzMzMzMmZmZmxMz2MzMGzMzMzMzMzMzMjBAgFgZmhA

### 쐐기돌 빌드 (무리의 지도자)
- 용도: 다수 대상 딜
- 코드: BWDAAAAAAAAAAAAAAAAAAAAAAAAAMzMzMzMzMmZmZmxMz2MzMGzMzMzMzMzMzMjBAQFgZmhA

## 메커니즘

### Frenzy (광기)
- 애완동물의 공격 속도 버프
- Barbed Shot 사용 시 중첩 (최대 3중첩)
- 지속시간: 8초

### Call of the Wild (야생의 부름)
- 주요 쿨다운 리셋 메커니즘
- Barbed Shot 사용 시 확률적 발동
`
};

// ============================================================================
// 테스트 실행
// ============================================================================

async function runWorkflowTest() {
  console.log('============================================================');
  console.log('  지식 구조화 → 가이드 생성 워크플로우 테스트');
  console.log('============================================================\n');

  console.log('📌 테스트 케이스: 야수 사냥꾼 (Beast Mastery Hunter)');
  console.log('📌 데이터 소스: Wowhead (시뮬레이션)\n');

  try {
    // Step 1: KnowledgeStructurer 초기화
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Step 1: KnowledgeStructurer 초기화');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const persona = {
      classEng: 'hunter',
      specEng: 'beast-mastery',
      class: '사냥꾼',
      spec: '야수'
    };

    const structurer = new KnowledgeStructurer(persona);

    // Step 2: 지식 구조화 실행
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Step 2: 지식 구조화 실행 (KnowledgeStructurer)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const structureResult = await structurer.structureKnowledge(SAMPLE_WOWHEAD_DATA);

    console.log('\n✅ Step 2 완료');
    console.log(`   생성된 노트: ${structureResult.notesCreated}개`);

    // Step 3: GuideGenerator 초기화 및 실행
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Step 3: React 가이드 자동 생성 (GuideGenerator)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const generator = new GuideGenerator();
    const guideResult = await generator.generateGuide('hunter', 'beast-mastery');

    console.log('\n✅ Step 3 완료');
    console.log(`   가이드 파일: ${guideResult.path}`);
    console.log(`   사용된 지식:`);
    console.log(`     - 스킬: ${guideResult.knowledgeUsed.skills}개`);
    console.log(`     - 로테이션: ${guideResult.knowledgeUsed.rotations}개`);
    console.log(`     - 빌드: ${guideResult.knowledgeUsed.builds}개`);
    console.log(`     - 메커니즘: ${guideResult.knowledgeUsed.mechanics}개`);

    // Step 4: 결과 검증
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Step 4: 결과 검증');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Obsidian 노트 확인
    const PROJECT_ROOT = path.resolve(process.cwd(), '../..');
    const knowledgeBasePath = path.join(PROJECT_ROOT, 'knowledge-base');

    const skillsPath = path.join(knowledgeBasePath, 'Skills/hunter');
    const rotationsPath = path.join(knowledgeBasePath, 'Rotations/hunter/beast-mastery');
    const statsPath = path.join(knowledgeBasePath, 'Stats/hunter/beast-mastery.md');
    const buildsPath = path.join(knowledgeBasePath, 'Builds/hunter/beast-mastery');
    const mechanicsPath = path.join(knowledgeBasePath, 'Mechanics/hunter');

    let validationErrors = 0;

    // 스킬 노트 검증
    if (await fs.pathExists(skillsPath)) {
      const skillFiles = await fs.readdir(skillsPath);
      console.log(`✅ Skills/ 폴더: ${skillFiles.length}개 파일`);
    } else {
      console.log('❌ Skills/ 폴더 없음');
      validationErrors++;
    }

    // 로테이션 노트 검증
    if (await fs.pathExists(rotationsPath)) {
      const rotationFiles = await fs.readdir(rotationsPath);
      console.log(`✅ Rotations/ 폴더: ${rotationFiles.length}개 파일`);
    } else {
      console.log('❌ Rotations/ 폴더 없음');
      validationErrors++;
    }

    // 스탯 노트 검증
    if (await fs.pathExists(statsPath)) {
      console.log('✅ Stats/ 파일 존재');
    } else {
      console.log('❌ Stats/ 파일 없음');
      validationErrors++;
    }

    // 빌드 노트 검증
    if (await fs.pathExists(buildsPath)) {
      const buildFiles = await fs.readdir(buildsPath);
      console.log(`✅ Builds/ 폴더: ${buildFiles.length}개 파일`);
    } else {
      console.log('❌ Builds/ 폴더 없음');
      validationErrors++;
    }

    // 메커니즘 노트 검증
    if (await fs.pathExists(mechanicsPath)) {
      const mechanicsFiles = await fs.readdir(mechanicsPath);
      console.log(`✅ Mechanics/ 폴더: ${mechanicsFiles.filter(f => f.endsWith('.md')).length}개 파일`);
    } else {
      console.log('❌ Mechanics/ 폴더 없음');
      validationErrors++;
    }

    // React 가이드 파일 검증
    if (await fs.pathExists(guideResult.path)) {
      const componentCode = await fs.readFile(guideResult.path, 'utf8');
      console.log(`✅ React 가이드 파일 존재 (${componentCode.length} bytes)`);

      // 필수 import 확인
      const hasSkillIcon = componentCode.includes('import SkillIcon');
      const hasStyled = componentCode.includes('import styled');
      const hasReact = componentCode.includes('import React');

      console.log(`   - React import: ${hasReact ? '✅' : '❌'}`);
      console.log(`   - styled-components: ${hasStyled ? '✅' : '❌'}`);
      console.log(`   - SkillIcon: ${hasSkillIcon ? '✅' : '❌'}`);

      if (!hasReact || !hasStyled || !hasSkillIcon) {
        validationErrors++;
      }
    } else {
      console.log('❌ React 가이드 파일 없음');
      validationErrors++;
    }

    // 최종 리포트
    console.log('\n============================================================');
    console.log('  테스트 결과 요약');
    console.log('============================================================\n');

    if (validationErrors === 0) {
      console.log('🎉 모든 테스트 통과!');
      console.log('\n✅ 워크플로우 완전 작동:');
      console.log('   1. Wowhead 데이터 입력');
      console.log('   2. KnowledgeStructurer → Obsidian 노트 생성');
      console.log('   3. GuideGenerator → React 가이드 생성');
      console.log('   4. 모든 파일 검증 통과\n');
    } else {
      console.log(`⚠️  ${validationErrors}개 검증 실패`);
      console.log('   일부 파일이 생성되지 않았거나 형식이 잘못되었습니다.\n');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('다음 단계:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('1. App.js에 라우트 추가:');
    console.log('   <Route path="/guide/hunter/beast-mastery-auto" element={<BeastMasteryHunterGuideAuto />} />');
    console.log('\n2. 브라우저에서 확인:');
    console.log('   http://localhost:3002/guide/hunter/beast-mastery-auto');
    console.log('\n3. 추가 전문화 가이드 생성:');
    console.log('   node scripts/knowledge/test-workflow.js [className] [specName]\n');

  } catch (error) {
    console.error('\n❌ 테스트 실패:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// 실행
runWorkflowTest();
