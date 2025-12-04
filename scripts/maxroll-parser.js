/**
 * Maxroll 가이드 파서
 *
 * Maxroll.gg WoW 가이드 페이지를 스크래핑하여
 * GuideTemplate에서 사용할 수 있는 JSON 데이터로 변환합니다.
 *
 * 사용법:
 *   node maxroll-parser.js <URL>
 *   예: node maxroll-parser.js https://maxroll.gg/wow/class-guides/fury-warrior-mythic-plus-guide
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// 클래스명 매핑 (URL → 내부 클래스명)
const CLASS_NAME_MAP = {
  'warrior': 'WARRIOR',
  'paladin': 'PALADIN',
  'hunter': 'HUNTER',
  'rogue': 'ROGUE',
  'priest': 'PRIEST',
  'shaman': 'SHAMAN',
  'mage': 'MAGE',
  'warlock': 'WARLOCK',
  'monk': 'MONK',
  'druid': 'DRUID',
  'demon-hunter': 'DEMONHUNTER',
  'death-knight': 'DEATHKNIGHT',
  'evoker': 'EVOKER'
};

// 전문화명 매핑 (영어 → 한글)
const SPEC_NAME_MAP = {
  // Warrior
  'fury': '분노',
  'arms': '무기',
  'protection': '방어',
  // Mage
  'arcane': '비전',
  'fire': '화염',
  'frost': '냉기',
  // Hunter
  'beast-mastery': '야수',
  'marksmanship': '사격',
  'survival': '생존',
  // ... 추가 전문화
};

/**
 * URL에서 클래스와 전문화 정보 추출
 * @param {string} url - Maxroll 가이드 URL
 * @returns {Object} { className, spec, contentType }
 */
function parseURL(url) {
  const urlPattern = /class-guides\/([a-z-]+)-([a-z-]+)-(mythic-plus|raid)-guide/;
  const match = url.match(urlPattern);

  if (!match) {
    throw new Error('Invalid Maxroll URL format. Expected: /class-guides/{spec}-{class}-{mythic-plus|raid}-guide');
  }

  const [, spec, className, contentType] = match;

  return {
    className: CLASS_NAME_MAP[className] || className.toUpperCase(),
    spec: spec,
    specKorean: SPEC_NAME_MAP[spec] || spec,
    contentType: contentType === 'mythic-plus' ? 'M+' : 'Raid'
  };
}

/**
 * Maxroll 가이드 페이지 스크래핑
 * @param {string} url - Maxroll 가이드 URL
 * @returns {Object} 추출된 가이드 데이터
 */
async function scrapeMaxrollGuide(url) {
  console.log('🌐 Maxroll 가이드 스크래핑 시작:', url);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // 페이지 로드 (DOM 로드 시점에서 진행)
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    console.log('✅ 페이지 로드 완료');

    // 콘텐츠 섹션들이 렌더링될 때까지 대기
    try {
      await page.waitForSelector('#overview-header', { timeout: 15000 });
      await page.waitForSelector('#rotation-header', { timeout: 5000 });
      console.log('✅ 콘텐츠 렌더링 확인');
    } catch (e) {
      console.log('⚠️ 일부 섹션 대기 타임아웃, 계속 진행');
    }

    // 추가 대기 (JavaScript 실행 및 동적 콘텐츠 로드)
    await page.waitForTimeout(10000);

    // URL 파싱
    const { className, spec, specKorean, contentType } = parseURL(url);
    console.log(`📊 감지된 정보: ${className} - ${specKorean} (${contentType})`);

    // 데이터 추출
    const guideData = await page.evaluate(() => {
      const data = {
        overview: '',
        heroTalents: [],
        rotation: {
          singleTarget: [],
          aoe: []
        },
        talents: [],
        stats: []
      };

      // Helper: ID로 섹션 컨테이너 찾기
      const findSectionById = (sectionId) => {
        // 1. 정확한 ID로 찾기
        let section = document.getElementById(sectionId);
        if (section) return section;

        // 2. ID에 sectionId가 포함된 요소 찾기
        const elements = document.querySelectorAll(`[id*="${sectionId}"]`);
        for (const el of elements) {
          if (el.id !== `${sectionId}-header`) {
            return el;
          }
        }

        // 3. data-section 속성으로 찾기
        section = document.querySelector(`[data-section="${sectionId}"]`);
        if (section) return section;

        return null;
      };

      // 1. 개요 추출 (Overview 섹션)
      const overviewSection = findSectionById('overview');
      if (overviewSection) {
        const paragraphs = [];
        const textElements = overviewSection.querySelectorAll('p, div');

        textElements.forEach(el => {
          const text = el.textContent.trim();
          if (text && text.length > 20 && !el.querySelector('h1, h2, h3')) {
            paragraphs.push(text);
          }
        });

        data.overview = paragraphs.slice(0, 5).join('\n\n');
      }

      // 2. Hero Talents 추출
      const heroSection = findSectionById('hero-talents');
      if (heroSection) {
        const heroNames = heroSection.querySelectorAll('h3, h4, strong');
        heroNames.forEach(name => {
          const text = name.textContent.trim();
          if (text && text.length < 50 && !text.includes('Talent')) {
            data.heroTalents.push(text);
          }
        });
      }

      // 3. Rotation 추출 (Priority List)
      const rotationSection = findSectionById('rotation');
      if (rotationSection) {
        const lists = rotationSection.querySelectorAll('ol, ul');
        let priorityIndex = 0;

        lists.forEach(list => {
          const items = list.querySelectorAll('li');

          items.forEach((li) => {
            const text = li.textContent.trim();
            if (!text || text.length < 10) return;

            // 스킬명 추출 (첫 번째 단어 또는 볼드체)
            const skillMatch = text.match(/^([A-Z][a-z\s]+)/);
            const skill = skillMatch ? skillMatch[1].trim() : '';

            // 조건 추출 ("if", "when", "while" 패턴)
            const conditions = [];
            const conditionPatterns = [
              /if ([^,\.]+)/gi,
              /when ([^,\.]+)/gi,
              /while ([^,\.]+)/gi
            ];

            conditionPatterns.forEach(pattern => {
              const matches = text.matchAll(pattern);
              for (const match of matches) {
                conditions.push(match[1].trim());
              }
            });

            // Priority 객체 생성
            const priority = {
              skill: skill,
              desc: text,
              conditions: conditions.length > 0 ? conditions : null,
              priority: priorityIndex++,
              why: ''
            };

            data.rotation.singleTarget.push(priority);
          });
        });
      }

      // 4. Stat Priority 추출
      const statSection = findSectionById('stat-priority');
      if (statSection) {
        const lists = statSection.querySelectorAll('ol, ul');

        lists.forEach(list => {
          const items = list.querySelectorAll('li');
          items.forEach(li => {
            const statText = li.textContent.trim();
            if (!statText) return;

            // "Haste > Mastery > Critical Strike" 형태 파싱
            if (statText.includes('>')) {
              const stats = statText.split('>').map(s => s.trim().toLowerCase());
              data.stats.push(...stats);
            } else {
              data.stats.push(statText.toLowerCase().trim());
            }
          });
        });
      }

      // 5. Talent Builds 추출
      const talentSection = findSectionById('talents');
      if (talentSection) {
        const paragraphs = talentSection.querySelectorAll('p, div');
        paragraphs.forEach(p => {
          const text = p.textContent.trim();
          if (text && text.length > 20) {
            data.talents.push(text);
          }
        });
      }

      return data;
    });

    // 메타데이터 추가
    const result = {
      metadata: {
        source: url,
        className: className,
        spec: spec,
        specKorean: specKorean,
        contentType: contentType,
        scrapedAt: new Date().toISOString()
      },
      data: guideData
    };

    await browser.close();
    console.log('✅ 스크래핑 완료');

    return result;

  } catch (error) {
    await browser.close();
    console.error('❌ 스크래핑 실패:', error.message);
    throw error;
  }
}

/**
 * 추출된 데이터를 JSON 파일로 저장
 * @param {Object} data - 가이드 데이터
 * @param {string} outputPath - 출력 파일 경로
 */
function saveToJSON(data, outputPath) {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`💾 데이터 저장 완료: ${outputPath}`);
}

/**
 * 복잡도 분석 (APL 시각화 필요 여부 판단)
 * @param {Object} rotationData - Rotation 데이터
 * @returns {Object} 복잡도 분석 결과
 */
function analyzeComplexity(rotationData) {
  const complexity = {
    conditionCount: 0,
    branchingDepth: 0,
    cooldownTracking: 0,
    resourceThresholds: 0,
    needsVisualization: false
  };

  rotationData.singleTarget.forEach(item => {
    // 조건 개수
    if (item.conditions) {
      complexity.conditionCount += item.conditions.length;

      // OR/AND 분기 깊이
      item.conditions.forEach(cond => {
        if (cond.includes('OR') || cond.includes('AND')) {
          complexity.branchingDepth++;
        }
      });
    }

    // 쿨다운 추적
    if (item.desc.toLowerCase().includes('cooldown') ||
        item.desc.toLowerCase().includes('재사용')) {
      complexity.cooldownTracking++;
    }

    // 리소스 임계값
    if (/\d+/.test(item.desc)) {  // 숫자 포함 시 리소스 임계값으로 간주
      complexity.resourceThresholds++;
    }
  });

  // 복잡도 임계값: 조건 8개 이상 OR 분기 3개 이상
  complexity.needsVisualization =
    complexity.conditionCount >= 8 ||
    complexity.branchingDepth >= 3;

  return complexity;
}

// CLI 실행
async function main() {
  const url = process.argv[2];

  if (!url) {
    console.error('❌ 사용법: node maxroll-parser.js <Maxroll URL>');
    process.exit(1);
  }

  try {
    // 1. 스크래핑
    const data = await scrapeMaxrollGuide(url);

    // 2. 복잡도 분석
    const complexity = analyzeComplexity(data.data.rotation);
    data.complexity = complexity;

    console.log('\n📊 복잡도 분석:');
    console.log(`  - 조건 개수: ${complexity.conditionCount}`);
    console.log(`  - 분기 깊이: ${complexity.branchingDepth}`);
    console.log(`  - 쿨다운 추적: ${complexity.cooldownTracking}`);
    console.log(`  - 리소스 임계값: ${complexity.resourceThresholds}`);
    console.log(`  - 시각화 필요: ${complexity.needsVisualization ? '✅ 예' : '❌ 아니오'}\n`);

    // 3. JSON 저장
    const outputPath = path.join(__dirname, `../temp/extracted-${data.metadata.spec}-${data.metadata.contentType}.json`);
    saveToJSON(data, outputPath);

    console.log('✅ Maxroll 파싱 완료!');
    console.log(`📁 출력 파일: ${outputPath}`);

  } catch (error) {
    console.error('❌ 실행 실패:', error.message);
    process.exit(1);
  }
}

// 모듈로 사용할 경우
if (require.main === module) {
  main();
} else {
  module.exports = {
    scrapeMaxrollGuide,
    analyzeComplexity,
    parseURL
  };
}
