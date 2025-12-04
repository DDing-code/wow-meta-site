/**
 * Maxroll 가이드 자동 생성 통합 CLI 도구
 *
 * Maxroll URL 하나만 입력하면 완성된 가이드를 생성합니다.
 *
 * 실행 단계:
 *   1. Maxroll 스크래핑 (maxroll-parser.js)
 *   2. 스킬 리졸빙 (skill-resolver.js)
 *   3. APL 시각화 (apl-visualizer.js)
 *   4. Config 파일 생성
 *   5. Wrapper 컴포넌트 생성
 *   6. App.js 라우팅 추가
 *
 * 사용법:
 *   node generate-guide.js <Maxroll URL>
 *   예: node generate-guide.js https://maxroll.gg/wow/class-guides/fury-warrior-mythic-plus-guide
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 필요한 모듈 import
const { scrapeMaxrollGuide, analyzeComplexity: analyzeMaxrollComplexity, parseURL } = require('./maxroll-parser');
const { resolveAllSkills, generateSkillDataFile, updateInternalDB } = require('./skill-resolver');
const {
  analyzeComplexity,
  generateFlowchart,
  generateTimeline,
  generateMatrix,
  generateReactComponent
} = require('./apl-visualizer');

/**
 * Config 파일 생성
 * @param {Object} data - 최종 데이터
 * @returns {string} 생성된 Config 파일 경로
 */
function generateConfigFile(data) {
  const { metadata, data: guideData, resolvedSkills } = data;

  const className = metadata.className;
  const spec = metadata.spec;
  const specKorean = metadata.specKorean;

  // camelCase 파일명 생성
  const camelSpec = spec.charAt(0).toLowerCase() + spec.slice(1);
  const camelClass = className.charAt(0) + className.slice(1).toLowerCase();

  const configFileName = `${camelSpec}${camelClass}Config.js`;
  const configPath = path.join(__dirname, '../src/configs', configFileName);

  const skillDataImport = `${camelSpec}${camelClass}Skills`;

  // Hero Talents 매핑 (hero1, hero2)
  const heroTalents = guideData.heroTalents.slice(0, 2);
  const heroMapping = {
    hero1: heroTalents[0] ? heroTalents[0].toLowerCase().replace(/\s+/g, '') : 'hero1',
    hero2: heroTalents[1] ? heroTalents[1].toLowerCase().replace(/\s+/g, '') : 'hero2'
  };

  // Config 파일 템플릿
  let configContent = `/**
 * ${className} ${specKorean} 가이드 설정 파일
 *
 * 자동 생성됨: ${new Date().toISOString()}
 * 출처: Maxroll (${metadata.source})
 */

import { ${skillDataImport} } from '../data/${camelSpec}${camelClass}SkillData';

// 1. 직업 기본 설정
export const classConfig = {
  className: '${className}',
  spec: '${spec}',
  heroTalents: ${JSON.stringify(heroTalents, null, 2)},
  heroMapping: ${JSON.stringify(heroMapping, null, 2)}
};

// 2. 영웅 특성별 콘텐츠
export const heroContent = {
  hero1: {
    name: '${heroTalents[0] || '영웅특성1'}',
    icon: '⭐',
    tierSet: {
      twoSet: '⚠️ TODO: Maxroll에서 2세트 효과 복사',
      fourSet: '⚠️ TODO: Maxroll에서 4세트 효과 복사'
    },
    singleTarget: {
      opener: [
        // ⚠️ TODO: 오프닝 시퀀스 추가
      ],
      priority: [
`;

  // Priority 배열 생성
  guideData.rotation.singleTarget.forEach((item, index) => {
    const skillKey = item.skill ? item.skill.charAt(0).toLowerCase() + item.skill.slice(1).replace(/\s+/g, '') : `skill${index}`;

    configContent += `        {
          skill: ${skillDataImport}.${skillKey},
          desc: '${item.desc || ''}',
          conditions: ${item.conditions ? JSON.stringify(item.conditions, null, 10) : 'null'},
          priority: ${item.priority},
          why: '${item.why || ''}'
        }${index < guideData.rotation.singleTarget.length - 1 ? ',' : ''}
`;
  });

  configContent += `      ]
    },
    aoe: {
      opener: [
        // ⚠️ TODO: AoE 오프닝 시퀀스 추가
      ],
      priority: [
        // ⚠️ TODO: AoE 우선순위 추가 (단일 대상과 동일한 구조)
      ]
    },
    mechanics: [
      // ⚠️ TODO: 핵심 메커니즘 추가
      // { name: '메커니즘명', icon: '🔥', desc: '설명' }
    ]
  },
  hero2: {
    name: '${heroTalents[1] || '영웅특성2'}',
    icon: '⚡',
    tierSet: {
      twoSet: '⚠️ TODO: Maxroll에서 2세트 효과 복사',
      fourSet: '⚠️ TODO: Maxroll에서 4세트 효과 복사'
    },
    singleTarget: {
      opener: [],
      priority: []
    },
    aoe: {
      opener: [],
      priority: []
    },
    mechanics: []
  }
};

// 3. 특성 빌드
export const builds = {
  hero1: {
    'raid-single': {
      name: '레이드 단일 대상',
      description: '⚠️ TODO: 빌드 설명',
      code: '',  // ⚠️ TODO: Wowhead 빌드 코드
      icon: '🎯'
    },
    'raid-aoe': {
      name: '레이드 광역',
      description: '⚠️ TODO: 빌드 설명',
      code: '',
      icon: '💥'
    },
    'mythic-plus': {
      name: '쐐기돌',
      description: '⚠️ TODO: 빌드 설명',
      code: '',
      icon: '🗝️'
    }
  },
  hero2: {
    // ⚠️ TODO: hero2 빌드 추가
  }
};

// 4. 스탯 우선순위
export const stats = {
  hero1: {
    single: ${JSON.stringify(guideData.stats || ['haste', 'mastery', 'crit', 'versatility'], null, 6)},
    aoe: ${JSON.stringify(guideData.stats || ['haste', 'crit', 'mastery', 'versatility'], null, 6)}
  },
  hero2: {
    single: [],  // ⚠️ TODO: hero2 스탯 우선순위
    aoe: []
  }
};

export default {
  classConfig,
  skillData: ${skillDataImport},
  heroContent,
  builds,
  stats
};
`;

  fs.writeFileSync(configPath, configContent, 'utf8');
  console.log(`💾 Config 파일 생성: ${configPath}`);

  return configPath;
}

/**
 * Wrapper 컴포넌트 생성
 * @param {Object} metadata - 메타데이터
 * @returns {string} 생성된 Wrapper 파일 경로
 */
function generateWrapperComponent(metadata) {
  const className = metadata.className;
  const spec = metadata.spec;
  const specKorean = metadata.specKorean;

  // PascalCase 컴포넌트명 생성
  const pascalSpec = spec.charAt(0).toUpperCase() + spec.slice(1);
  const pascalClass = className.charAt(0) + className.slice(1).toLowerCase();

  const componentName = `${pascalSpec}${pascalClass}Guide`;
  const componentPath = path.join(__dirname, `../src/components/${componentName}.js`);

  // camelCase config 이름
  const camelSpec = spec.charAt(0).toLowerCase() + spec.slice(1);
  const camelClass = className.charAt(0) + className.slice(1).toLowerCase();
  const configName = `${camelSpec}${camelClass}Config`;

  const componentContent = `/**
 * ${className} ${specKorean} 가이드 (래퍼 컴포넌트)
 *
 * GuideTemplate과 ${configName}을 결합하여
 * ${className} ${specKorean} 가이드를 렌더링합니다.
 *
 * 자동 생성됨: ${new Date().toISOString()}
 */

import React from 'react';
import GuideTemplate from './GuideTemplate';
import ${configName} from '../configs/${configName}';

const ${componentName} = () => {
  return <GuideTemplate {...${configName}} />;
};

export default ${componentName};
`;

  fs.writeFileSync(componentPath, componentContent, 'utf8');
  console.log(`💾 Wrapper 컴포넌트 생성: ${componentPath}`);

  return { componentName, componentPath };
}

/**
 * App.js에 라우팅 추가
 * @param {string} componentName - 컴포넌트명
 * @param {string} className - 클래스명
 * @param {string} spec - 전문화명
 */
function addRouteToApp(componentName, className, spec) {
  const appJsPath = path.join(__dirname, '../src/App.js');

  if (!fs.existsSync(appJsPath)) {
    console.warn('⚠️  App.js 파일 없음 - 라우팅 수동 추가 필요');
    return;
  }

  let appContent = fs.readFileSync(appJsPath, 'utf8');

  // Import 문 추가 (중복 방지)
  const importStatement = `import ${componentName} from './components/${componentName}';`;

  if (!appContent.includes(importStatement)) {
    // 다른 Guide import 뒤에 추가
    const importPosition = appContent.lastIndexOf("import") + appContent.substring(appContent.lastIndexOf("import")).indexOf(";") + 1;
    appContent = appContent.slice(0, importPosition) + `\n${importStatement}` + appContent.slice(importPosition);
  }

  // Route 추가 (중복 방지)
  const classLower = className.toLowerCase();
  const routePath = `/guide/${classLower}/${spec}`;
  const routeStatement = `<Route path="${routePath}" element={<${componentName} />} />`;

  if (!appContent.includes(routeStatement)) {
    // </Routes> 태그 앞에 추가
    const routesEndPosition = appContent.indexOf('</Routes>');
    if (routesEndPosition !== -1) {
      appContent = appContent.slice(0, routesEndPosition) +
                   `        ${routeStatement}\n        ` +
                   appContent.slice(routesEndPosition);
    }
  }

  fs.writeFileSync(appJsPath, appContent, 'utf8');
  console.log(`💾 App.js 라우팅 추가: ${routePath}`);
}

/**
 * 메인 실행 함수
 */
async function main() {
  const url = process.argv[2];

  if (!url) {
    console.error('❌ 사용법: node generate-guide.js <Maxroll URL>');
    console.error('예: node generate-guide.js https://maxroll.gg/wow/class-guides/fury-warrior-mythic-plus-guide');
    process.exit(1);
  }

  console.log('🚀 Maxroll 가이드 자동 생성 시작!\n');
  console.log(`📄 URL: ${url}\n`);

  const startTime = Date.now();

  try {
    // ===========================================
    // Phase 1: Maxroll 스크래핑
    // ===========================================
    console.log('📊 [1/6] Maxroll 스크래핑...');
    const extractedData = await scrapeMaxrollGuide(url);

    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const extractedPath = path.join(tempDir, `extracted-${extractedData.metadata.spec}.json`);
    fs.writeFileSync(extractedPath, JSON.stringify(extractedData, null, 2), 'utf8');

    // ===========================================
    // Phase 2: 스킬 리졸빙
    // ===========================================
    console.log('\n🔍 [2/6] 스킬 리졸빙...');
    const { resolvedSkills, missingSkills, updatedRotation } = await resolveAllSkills(extractedData);

    extractedData.data.rotation = updatedRotation;
    extractedData.resolvedSkills = resolvedSkills;

    // 스킬 데이터 파일 생성
    generateSkillDataFile(resolvedSkills, extractedData.metadata.className, extractedData.metadata.spec);

    // 내부 DB 업데이트
    updateInternalDB(missingSkills, extractedData.metadata.className);

    const resolvedPath = path.join(tempDir, `extracted-${extractedData.metadata.spec}-resolved.json`);
    fs.writeFileSync(resolvedPath, JSON.stringify(extractedData, null, 2), 'utf8');

    // ===========================================
    // Phase 3: APL 시각화
    // ===========================================
    console.log('\n🎨 [3/6] APL 시각화 분석...');
    const complexity = analyzeComplexity(extractedData.data.rotation);

    console.log(`  - 조건 개수: ${complexity.conditionCount}`);
    console.log(`  - 시각화 필요: ${complexity.needsVisualization ? '✅ 예' : '❌ 아니오'}`);
    console.log(`  - 시각화 타입: ${complexity.visualizationType}`);

    if (complexity.needsVisualization) {
      let mermaidCode = '';
      let matrix = null;
      const heroName = extractedData.data.heroTalents[0] || '영웅특성1';

      if (complexity.visualizationType === 'flowchart') {
        mermaidCode = generateFlowchart(extractedData.data.rotation, heroName);
      } else if (complexity.visualizationType === 'timeline') {
        mermaidCode = generateTimeline(extractedData.data.rotation);
      } else if (complexity.visualizationType === 'matrix') {
        matrix = generateMatrix(extractedData.data.rotation);
      }

      const { componentName } = generateReactComponent(
        mermaidCode,
        complexity.visualizationType,
        extractedData.metadata.className,
        extractedData.metadata.spec,
        heroName,
        matrix
      );

      extractedData.visualizationComponent = componentName;
      extractedData.visualizationType = complexity.visualizationType;
    }

    const visualizedPath = path.join(tempDir, `extracted-${extractedData.metadata.spec}-visualized.json`);
    fs.writeFileSync(visualizedPath, JSON.stringify(extractedData, null, 2), 'utf8');

    // ===========================================
    // Phase 4: Config 파일 생성
    // ===========================================
    console.log('\n⚙️  [4/6] Config 파일 생성...');
    const configPath = generateConfigFile(extractedData);

    // ===========================================
    // Phase 5: Wrapper 컴포넌트 생성
    // ===========================================
    console.log('\n📦 [5/6] Wrapper 컴포넌트 생성...');
    const { componentName, componentPath } = generateWrapperComponent(extractedData.metadata);

    // ===========================================
    // Phase 6: App.js 라우팅 추가
    // ===========================================
    console.log('\n🔗 [6/6] App.js 라우팅 추가...');
    addRouteToApp(componentName, extractedData.metadata.className, extractedData.metadata.spec);

    // ===========================================
    // 완료!
    // ===========================================
    const endTime = Date.now();
    const elapsedSeconds = ((endTime - startTime) / 1000).toFixed(1);

    console.log('\n\n✅ ========================================');
    console.log('✅  가이드 생성 완료!');
    console.log('✅ ========================================\n');

    console.log(`⏱️  소요 시간: ${elapsedSeconds}초`);
    console.log(`📁 Config: ${configPath}`);
    console.log(`📁 Wrapper: ${componentPath}`);
    console.log(`🌐 경로: /guide/${extractedData.metadata.className.toLowerCase()}/${extractedData.metadata.spec}\n`);

    console.log('📋 다음 단계:');
    console.log('  1. Config 파일에서 ⚠️ TODO 항목 완성 (티어 세트, 오프닝, 빌드)');
    console.log('  2. npm start로 로컬 서버 시작');
    console.log('  3. 가이드 확인 및 검증');
    console.log('  4. guideLinks.js에 가이드 링크 추가\n');

  } catch (error) {
    console.error('\n❌ 실행 실패:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// 실행
if (require.main === module) {
  main();
}

module.exports = {
  generateConfigFile,
  generateWrapperComponent,
  addRouteToApp
};
