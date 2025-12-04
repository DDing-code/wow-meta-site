/**
 * SimC APL → rotations.js 매핑 스크립트
 *
 * Input: rotations_simc.json (SimC APL 파싱 결과)
 * Output: rotations.js (가이드 형식)
 *
 * 매핑 전략:
 * 1. SimC priority → 가이드 우선순위
 * 2. SimC conditions → 한글 조건
 * 3. Wowhead 데이터로 교차 검증
 */

const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════════
// 1. 스킬 ID → 한글명 매핑
// ═══════════════════════════════════════════════════════════════════

// SimC 내부 명령어 목록 (실제 스킬 아님 - 필터링 대상)
const SIMC_INTERNAL_COMMANDS = new Set([
  // 변수 및 로직 명령어
  'variable',
  'cycling_variable',

  // 리소스 관리
  'pool_resource',
  'pick_up_fragment',           // 조각 획득 (리소스 관리)

  // 타겟팅 및 전투 로직
  'retarget_auto_attack',        // 자동 공격 대상 변경
  'swap_action_list',
  'call_action_list',
  'run_action_list',

  // 대기 명령어
  'wait',
  'wait_for_cooldown',

  // 버프 관리
  'invoke_external_buff',
  'cancel_buff',

  // 시퀀스
  'sequence',
  'strict_sequence'
]);

const skillNameMap = {
  // Havoc DH 주요 스킬
  'eye_beam': '안광',
  'blade_dance': '칼춤',
  'death_sweep': '죽음의 휩쓸기',
  'chaos_strike': '혼돈 일격',
  'annihilation': '소멸',
  'metamorphosis': '탈태 변신',
  'vengeful_retreat': '복수의 후퇴',
  'fel_rush': '지옥 돌진',
  'felblade': '지옥칼날',
  'essence_break': '정수 붕괴',
  'reavers_glaive': '파괴자의 글레이브',
  'the_hunt': '사냥',
  'immolation_aura': '불타는 오라',
  'sigil_of_flame': '화염의 인장',
  'sigil_of_spite': '악의의 인장',
  'glaive_tempest': '글레이브 폭풍',
  'throw_glaive': '글레이브 투척',
  'demons_bite': '악마의 이빨',
  'fel_barrage': '지옥 난사',
  'chaos_nova': '혼돈 폭발',
  'elysian_decree': '엘리시안 칙령',
  'potion': '물약',
  'auto_attack': '자동 공격',
  'disrupt': '차단',
  'consume_magic': '마법 흡수'
};

// 영문 스킬명 매핑 (Wowhead 검증용)
const skillEnglishNameMap = {
  'eye_beam': 'Eye Beam',
  'blade_dance': 'Blade Dance',
  'death_sweep': 'Death Sweep',
  'chaos_strike': 'Chaos Strike',
  'annihilation': 'Annihilation',
  'metamorphosis': 'Metamorphosis',
  'vengeful_retreat': 'Vengeful Retreat',
  'fel_rush': 'Fel Rush',
  'felblade': 'Felblade',
  'essence_break': 'Essence Break',
  'reavers_glaive': "Reaver's Glaive",
  'the_hunt': 'The Hunt',
  'immolation_aura': 'Immolation Aura',
  'sigil_of_flame': 'Sigil of Flame',
  'sigil_of_spite': 'Sigil of Spite',
  'glaive_tempest': 'Glaive Tempest',
  'throw_glaive': 'Throw Glaive',
  'demons_bite': "Demon's Bite",
  'fel_barrage': 'Fel Barrage',
  'chaos_nova': 'Chaos Nova',
  'elysian_decree': 'Elysian Decree',
  'consuming_fire': 'Consuming Fire',
  'initiative': 'Initiative',
  'demon_soul': 'Demon Soul',
  'demonsurge': 'Demonsurge',
  'thrill_of_the_fight': 'Thrill of the Fight',
  'glaive_flurry': 'Glaive Flurry',
  'rending_strike': 'Rending Strike',
  'inertia': 'Inertia'
};

// ═══════════════════════════════════════════════════════════════════
// 2. 조건문 요약 (긴 조건 → 핵심 요약)
// ═══════════════════════════════════════════════════════════════════

/**
 * SimC 조건을 핵심 요약문으로 변환
 * @param {Array<string>} conditions - SimC 조건 배열
 * @returns {string} 요약된 조건
 */
function summarizeConditions(conditions) {
  if (!conditions || conditions.length === 0) return '항상';

  // 핵심 키워드 추출
  const keywords = [];

  conditions.forEach(cond => {
    const condLower = cond.toLowerCase();

    // 탈태 변신
    if (condLower.includes('탈태') || condLower.includes('metamorphosis')) {
      if (condLower.includes('활성화') || condLower.includes('.up')) {
        keywords.push('탈태 중');
      } else if (condLower.includes('쿨다운')) {
        keywords.push('탈태 쿨');
      }
    }

    // 격노
    if (condLower.includes('격노') || condLower.includes('fury')) {
      const match = condLower.match(/(\d+)/);
      if (match) {
        keywords.push(`격노 ${match[1]}+`);
      }
    }

    // 쿨다운 완료
    if (condLower.includes('쿨다운 완료') || condLower.includes('.ready') || condLower.includes('.up')) {
      const skillMatch = cond.match(/^([^\s]+)/);
      if (skillMatch && !keywords.some(k => k.includes('쿨'))) {
        keywords.push('쿨다운 완료');
      }
    }

    // 버프 활성화
    if (condLower.includes('활성화') && !condLower.includes('탈태')) {
      keywords.push('버프 활성');
    }

    // 적 수
    if (condLower.includes('활성 적') || condLower.includes('active_enemies')) {
      const match = condLower.match(/(\d+)/);
      if (match) {
        keywords.push(`적 ${match[1]}+`);
      }
    }
  });

  // 중복 제거
  const unique = [...new Set(keywords)];

  if (unique.length === 0) {
    // 조건이 있지만 키워드 추출 실패 → 첫 번째 조건 사용
    return conditions[0].substring(0, 50) + (conditions[0].length > 50 ? '...' : '');
  }

  return unique.slice(0, 3).join(' + '); // 최대 3개만
}

/**
 * 조건에서 이유(why) 추론
 * @param {Array<string>} conditions - SimC 조건 배열
 * @param {string} skillKorean - 스킬 한글명
 * @returns {string} 사용 이유
 */
function inferWhy(conditions, skillKorean) {
  const condStr = conditions.join(' ').toLowerCase();

  // 패턴 매칭으로 이유 추론
  if (condStr.includes('탈태') || condStr.includes('metamorphosis')) {
    if (condStr.includes('남은 시간') || condStr.includes('remains')) {
      return `${skillKorean}을(를) 탈태 종료 전에 사용`;
    }
    return `${skillKorean}을(를) 탈태 중 사용`;
  }

  if (condStr.includes('격노') || condStr.includes('fury')) {
    return `격노 생성/소모를 위한 ${skillKorean} 사용`;
  }

  if (condStr.includes('쿨다운') || condStr.includes('cooldown')) {
    return `${skillKorean} 쿨다운 최적화`;
  }

  if (condStr.includes('활성 적') || condStr.includes('active_enemies')) {
    return `다수 대상 상황에서 ${skillKorean} 사용`;
  }

  if (condStr.includes('디버프') || condStr.includes('debuff')) {
    return `디버프 유지를 위한 ${skillKorean} 사용`;
  }

  // 기본값
  return `${skillKorean} 우선순위 ${conditions.length}개 조건`;
}

// ═══════════════════════════════════════════════════════════════════
// 3. SimC APL → rotations.js 변환
// ═══════════════════════════════════════════════════════════════════

/**
 * SimC APL을 rotations.js 형식으로 변환
 * @param {Object} simcData - SimC APL JSON
 * @param {string} heroTalent - 영웅 특성 (aldrachireaver/felscarred)
 * @returns {Object} rotations.js 형식 데이터
 */
function mapSimCToRotations(simcData, heroTalent = 'aldrachireaver') {
  const rotations = {
    [heroTalent]: {
      singleTarget: {
        opener: [],
        priority: []
      },
      aoe: {
        opener: [],
        priority: []
      }
    }
  };

  // Opener 매핑
  if (simcData.opener && simcData.opener.length > 0) {
    rotations[heroTalent].singleTarget.opener = simcData.opener
      .filter(action => !SIMC_INTERNAL_COMMANDS.has(action.skillId)) // ✅ 내부 명령어 필터링
      .map((action, index) => {
        const koreanName = skillNameMap[action.skill] || action.skillKorean || action.skill;
        const conditionSummary = summarizeConditions(action.conditions);
        const why = inferWhy(action.conditions, koreanName);

        return {
          priority: index,
          skill: koreanName,
          skillId: action.skill,
          condition: conditionSummary,
          why: why,
          simcLine: action.lineNumber
        };
      });
  }

  // Main Priority 매핑
  if (simcData.priority && simcData.priority.length > 0) {
    // SimC priority는 이미 우선순위 순서대로 정렬됨
    rotations[heroTalent].singleTarget.priority = simcData.priority
      .filter(action => !SIMC_INTERNAL_COMMANDS.has(action.skillId)) // ✅ 내부 명령어 필터링
      .slice(0, 20) // 상위 20개만 (가독성)
      .map((action, index) => {
        const koreanName = skillNameMap[action.skill] || action.skillKorean || action.skill;
        const conditionSummary = summarizeConditions(action.conditions);
        const why = inferWhy(action.conditions, koreanName);

        return {
          priority: index,
          skill: koreanName,
          skillId: action.skill,
          condition: conditionSummary,
          why: why,
          simcLine: action.lineNumber
        };
      });
  }

  // AoE Priority (meta 섹션 사용)
  if (simcData.meta && simcData.meta.length > 0) {
    rotations[heroTalent].aoe.priority = simcData.meta
      .filter(action => !SIMC_INTERNAL_COMMANDS.has(action.skillId)) // ✅ 내부 명령어 필터링
      .slice(0, 15) // 상위 15개
      .map((action, index) => {
        const koreanName = skillNameMap[action.skill] || action.skillKorean || action.skill;
        const conditionSummary = summarizeConditions(action.conditions);
        const why = inferWhy(action.conditions, koreanName);

        return {
          priority: index,
          skill: koreanName,
          skillId: action.skill,
          condition: conditionSummary,
          why: why + ' (탈태 중)',
          simcLine: action.lineNumber
        };
      });
  }

  return rotations;
}

// ═══════════════════════════════════════════════════════════════════
// 4. Wowhead 데이터와 교차 검증
// ═══════════════════════════════════════════════════════════════════

/**
 * Wowhead 데이터로 SimC 결과 검증
 * @param {Object} simcRotations - SimC 기반 로테이션
 * @param {Object} wowheadData - Wowhead 추출 데이터
 * @returns {Object} 검증 결과
 */
function crossValidateWithWowhead(simcRotations, wowheadData) {
  const validation = {
    matches: [],
    discrepancies: [],
    missing: []
  };

  if (!wowheadData || !wowheadData.rotation || !wowheadData.rotation.found) {
    validation.missing.push('Wowhead rotation data not available');
    return validation;
  }

  // Wowhead에서 언급된 스킬 추출 (영문명으로 매칭)
  const wowheadText = JSON.stringify(wowheadData.rotation.contents);
  const wowheadSkills = new Set();

  Object.keys(skillEnglishNameMap).forEach(skillId => {
    const englishName = skillEnglishNameMap[skillId];
    // 영문명으로 검색 (대소문자 구분 없음)
    if (wowheadText.toLowerCase().includes(englishName.toLowerCase())) {
      wowheadSkills.add(skillId);
    }
  });

  console.log(`\n🔍 Wowhead에서 발견된 스킬: ${wowheadSkills.size}개`);
  console.log(`   ${Array.from(wowheadSkills).map(id => skillEnglishNameMap[id]).join(', ')}`);

  // SimC 우선순위와 비교
  const heroTalent = Object.keys(simcRotations)[0];
  const simcPriority = simcRotations[heroTalent].singleTarget.priority;

  simcPriority.forEach((action, index) => {
    // action.skillId는 한글명일 수 있으므로, 역매핑 필요
    let skillId = action.skillId;

    // 한글명이면 영문 ID로 변환
    const skillIdByKorean = Object.keys(skillNameMap).find(
      id => skillNameMap[id] === action.skillId
    );
    if (skillIdByKorean) {
      skillId = skillIdByKorean;
    }

    if (wowheadSkills.has(skillId)) {
      validation.matches.push({
        priority: index,
        skill: action.skill,
        englishName: skillEnglishNameMap[skillId] || skillId,
        status: 'verified'
      });
    } else {
      validation.discrepancies.push({
        priority: index,
        skill: action.skill,
        englishName: skillEnglishNameMap[skillId] || skillId,
        issue: 'Not mentioned in Wowhead guide',
        severity: index < 5 ? 'high' : 'low'
      });
    }
  });

  return validation;
}

// ═══════════════════════════════════════════════════════════════════
// 5. rotations.js 파일 생성
// ═══════════════════════════════════════════════════════════════════

/**
 * rotations.js 파일 생성
 * @param {Object} rotations - 로테이션 데이터
 * @param {string} className - 클래스명
 * @param {string} spec - 전문화
 */
function generateRotationsFile(rotations, className, spec) {
  const template = `/**
 * ${className.toUpperCase()} ${spec.toUpperCase()} Rotations
 * Generated from SimulationCraft APL
 *
 * Data sources:
 * - SimulationCraft APL (primary)
 * - Wowhead Guide (validation)
 * - Generated: ${new Date().toISOString()}
 */

export const rotations = ${JSON.stringify(rotations, null, 2)};

export default rotations;
`;

  const outputPath = path.join(
    __dirname,
    `../src/data/guides/${className}-${spec}/rotations.js`
  );

  // 디렉토리 생성
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, template, 'utf-8');
  console.log(`✅ Generated: ${outputPath}`);

  return outputPath;
}

// ═══════════════════════════════════════════════════════════════════
// 6. 메인 실행
// ═══════════════════════════════════════════════════════════════════

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('Usage: node map-simc-to-rotations.js <class> <spec> [hero-talent]');
    console.log('Example: node map-simc-to-rotations.js demon-hunter havoc aldrachireaver');
    process.exit(1);
  }

  const [className, spec, heroTalent = 'aldrachireaver'] = args;

  console.log('════════════════════════════════════════════════════════════');
  console.log('  SimC APL → rotations.js Mapper');
  console.log('════════════════════════════════════════════════════════════\n');
  console.log(`Class: ${className}`);
  console.log(`Spec: ${spec}`);
  console.log(`Hero Talent: ${heroTalent}\n`);

  // 1. SimC APL 데이터 로드
  const simcPath = path.join(
    __dirname,
    `../src/data/guides/${className}-${spec}/rotations_simc.json`
  );

  if (!fs.existsSync(simcPath)) {
    console.error(`❌ SimC APL file not found: ${simcPath}`);
    process.exit(1);
  }

  const simcData = JSON.parse(fs.readFileSync(simcPath, 'utf-8'));
  console.log(`✅ Loaded SimC APL: ${simcPath}`);
  console.log(`   Opener: ${simcData.opener?.length || 0} actions`);
  console.log(`   Priority: ${simcData.priority?.length || 0} actions`);
  console.log(`   Meta: ${simcData.meta?.length || 0} actions\n`);

  // 2. rotations.js 형식으로 변환
  console.log('🔄 Converting SimC → rotations.js format...');
  const rotations = mapSimCToRotations(simcData, heroTalent);

  const totalOpener = rotations[heroTalent].singleTarget.opener.length;
  const totalPriority = rotations[heroTalent].singleTarget.priority.length;
  const totalAoE = rotations[heroTalent].aoe.priority.length;

  console.log(`✅ Conversion complete:`);
  console.log(`   Opener: ${totalOpener} actions`);
  console.log(`   Single-Target Priority: ${totalPriority} actions`);
  console.log(`   AoE Priority: ${totalAoE} actions\n`);

  // 3. Wowhead 교차 검증 (선택)
  const wowheadPath = path.join(
    __dirname,
    `../database-builder/wowhead-cache/${className}-${spec}-complete.json`
  );

  if (fs.existsSync(wowheadPath)) {
    console.log('🔍 Cross-validating with Wowhead...');
    const wowheadFile = JSON.parse(fs.readFileSync(wowheadPath, 'utf-8'));
    const validation = crossValidateWithWowhead(rotations, wowheadFile.data);

    console.log(`✅ Validation complete:`);
    console.log(`   Matches: ${validation.matches.length}`);
    console.log(`   Discrepancies: ${validation.discrepancies.length}`);

    if (validation.discrepancies.length > 0) {
      console.log('\n⚠️  Discrepancies:');
      validation.discrepancies.slice(0, 5).forEach(disc => {
        console.log(`   - [P${disc.priority}] ${disc.skill}: ${disc.issue} (${disc.severity})`);
      });
    }
    console.log();
  } else {
    console.warn('⚠️  Wowhead data not found, skipping validation\n');
  }

  // 4. rotations.js 파일 생성
  console.log('📝 Generating rotations.js file...');
  const outputPath = generateRotationsFile(rotations, className, spec);

  // 5. 샘플 출력
  console.log('\n📋 Sample Opener (first 3):');
  rotations[heroTalent].singleTarget.opener.slice(0, 3).forEach(action => {
    console.log(`   ${action.priority}. ${action.skill}`);
    console.log(`      Condition: ${action.condition}`);
    console.log(`      Why: ${action.why}\n`);
  });

  console.log('📋 Sample Priority (first 3):');
  rotations[heroTalent].singleTarget.priority.slice(0, 3).forEach(action => {
    console.log(`   ${action.priority}. ${action.skill}`);
    console.log(`      Condition: ${action.condition}`);
    console.log(`      Why: ${action.why}\n`);
  });

  console.log('════════════════════════════════════════════════════════════');
  console.log('✅ Mapping complete!\n');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  mapSimCToRotations,
  crossValidateWithWowhead,
  generateRotationsFile,
  summarizeConditions,
  inferWhy
};
