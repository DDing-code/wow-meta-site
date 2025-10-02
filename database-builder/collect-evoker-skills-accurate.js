// 기원사 스킬 정확한 번역 수집 스크립트
// ko.wowhead.com에서 직접 수집

const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

// 기원사 주요 스킬 ID 목록 (SimC APL과 가이드에서 추출)
const EVOKER_SKILLS = {
  // 황폐 (Devastation) 핵심 스킬
  devastation: [
    { id: 357208, englishName: 'Fire Breath' },
    { id: 359073, englishName: 'Eternity Surge' },
    { id: 357211, englishName: 'Pyre' },
    { id: 361500, englishName: 'Living Flame' },
    { id: 362969, englishName: 'Azure Strike' },
    { id: 356995, englishName: 'Disintegrate' },
    { id: 368970, englishName: 'Firestorm' },
    { id: 375087, englishName: 'Dragonrage' },
    { id: 357210, englishName: 'Deep Breath' },
    { id: 370452, englishName: 'Shattering Star' },
    { id: 443328, englishName: 'Engulf' },
    { id: 408092, englishName: 'Essence Burst' },
    { id: 369297, englishName: 'Ruby Essence Burst' },
    { id: 396006, englishName: 'Iridescence' },
    { id: 370960, englishName: 'Emerald Communion' }
  ],

  // 보존 (Preservation) 핵심 스킬
  preservation: [
    { id: 355913, englishName: 'Emerald Blossom' },
    { id: 366155, englishName: 'Reversion' },
    { id: 367226, englishName: 'Spiritbloom' },
    { id: 370960, englishName: 'Emerald Communion' },
    { id: 363534, englishName: 'Dream Flight' },
    { id: 360827, englishName: 'Verdant Embrace' },
    { id: 364343, englishName: 'Echo' },
    { id: 373861, englishName: 'Temporal Anomaly' },
    { id: 357170, englishName: 'Time Dilation' },
    { id: 374939, englishName: 'Lifebind' },
    { id: 376788, englishName: 'Cycle of Life' },
    { id: 370537, englishName: 'Stasis' },
    { id: 374227, englishName: 'Rewind' },
    { id: 359816, englishName: 'Dream Breath' },
    { id: 377509, englishName: 'Dream Projection' }
  ],

  // 증강 (Augmentation) 핵심 스킬
  augmentation: [
    { id: 395160, englishName: 'Ebon Might' },
    { id: 409311, englishName: 'Prescience' },
    { id: 403631, englishName: 'Breath of Eons' },
    { id: 396286, englishName: 'Upheaval' },
    { id: 404972, englishName: 'Eruption' },
    { id: 410256, englishName: 'Aspects\' Favor' },
    { id: 404977, englishName: 'Time Skip' },
    { id: 406732, englishName: 'Spatial Paradox' },
    { id: 403299, englishName: 'Interwoven Threads' },
    { id: 395152, englishName: 'Fate Mirror' },
    { id: 360806, englishName: 'Blistering Scales' },
    { id: 404269, englishName: 'Pupil of Alexstrasza' },
    { id: 407837, englishName: 'Overlord' },
    { id: 443204, englishName: 'Mass Eruption' },
    { id: 409423, englishName: 'Molten Embers' }
  ],

  // 공통 스킬
  common: [
    { id: 358267, englishName: 'Hover' },
    { id: 363916, englishName: 'Obsidian Scales' },
    { id: 374348, englishName: 'Renewing Blaze' },
    { id: 364342, englishName: 'Blessing of the Bronze' },
    { id: 357214, englishName: 'Wing Buffet' },
    { id: 374251, englishName: 'Cauterizing Flame' },
    { id: 360995, englishName: 'Verdant Embrace' },
    { id: 351338, englishName: 'Quell' },
    { id: 365585, englishName: 'Expunge' },
    { id: 370665, englishName: 'Rescue' },
    { id: 360823, englishName: 'Naturalize' },
    { id: 378441, englishName: 'Time Spiral' },
    { id: 378464, englishName: 'Zephyr' },
    { id: 374227, englishName: 'Landslide' },
    { id: 370553, englishName: 'Tip the Scales' }
  ]
};

async function collectEvokerSkillTranslations() {
  const browser = await chromium.launch({
    headless: false
  });

  const results = {};
  const errors = [];

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('🐉 기원사 스킬 번역 수집 시작...');

    for (const [spec, skills] of Object.entries(EVOKER_SKILLS)) {
      console.log(`\n📚 ${spec} 전문화 스킬 수집 중...`);
      results[spec] = {};

      for (const skill of skills) {
        try {
          // ko.wowhead.com 스킬 페이지 접속
          const url = `https://ko.wowhead.com/spell=${skill.id}`;
          await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

          // 페이지 로드 대기
          await page.waitForTimeout(1000);

          // 한국어 스킬명 추출 (여러 방법 시도)
          const koreanName = await page.evaluate(() => {
            // 방법 1: 페이지 제목
            const titleElement = document.querySelector('h1.heading-size-1');
            if (titleElement) return titleElement.textContent.trim();

            // 방법 2: 메타 태그
            const metaTitle = document.querySelector('meta[property="og:title"]');
            if (metaTitle) {
              const title = metaTitle.getAttribute('content');
              if (title && !title.includes('Wowhead')) {
                return title.split('-')[0].trim();
              }
            }

            // 방법 3: tooltip
            const tooltipTitle = document.querySelector('.q0 b, .q1 b, .q2 b, .q3 b, .q4 b, .q5 b');
            if (tooltipTitle) return tooltipTitle.textContent.trim();

            return null;
          });

          if (koreanName) {
            results[spec][skill.id] = {
              id: skill.id,
              englishName: skill.englishName,
              koreanName: koreanName
            };
            console.log(`✅ ${skill.englishName} → ${koreanName}`);
          } else {
            errors.push({
              id: skill.id,
              englishName: skill.englishName,
              reason: '번역을 찾을 수 없음'
            });
            console.log(`❌ ${skill.englishName} - 번역 실패`);
          }

          // 요청 간격
          await page.waitForTimeout(1500);

        } catch (error) {
          console.error(`❌ 스킬 ${skill.id} 수집 실패:`, error.message);
          errors.push({
            id: skill.id,
            englishName: skill.englishName,
            reason: error.message
          });
        }
      }
    }

    // 결과 저장
    const outputPath = path.join(__dirname, 'evoker-skills-accurate-translations.json');
    await fs.writeFile(
      outputPath,
      JSON.stringify({
        collectedAt: new Date().toISOString(),
        source: 'ko.wowhead.com',
        patch: '11.2 TWW Season 3',
        results: results,
        errors: errors,
        stats: {
          total: Object.values(results).reduce((acc, spec) => acc + Object.keys(spec).length, 0),
          bySpec: {
            devastation: Object.keys(results.devastation || {}).length,
            preservation: Object.keys(results.preservation || {}).length,
            augmentation: Object.keys(results.augmentation || {}).length,
            common: Object.keys(results.common || {}).length
          },
          errors: errors.length
        }
      }, null, 2)
    );

    console.log(`\n✅ 수집 완료! 파일 저장: ${outputPath}`);
    console.log(`📊 통계: ${Object.values(results).reduce((acc, spec) => acc + Object.keys(spec).length, 0)}개 스킬 수집, ${errors.length}개 오류`);

  } catch (error) {
    console.error('❌ 수집 중 오류:', error);
  } finally {
    await browser.close();
  }

  return results;
}

// 수동 번역 (ko.wowhead.com에 없는 경우 대비)
const MANUAL_TRANSLATIONS = {
  // 영웅 특성 스킬들
  'Mass Eruption': '대규모 분출',
  'Molten Embers': '녹아내린 불씨',
  'Pupil of Alexstrasza': '알렉스트라자의 제자',
  'Overlord': '대군주',
  'Aspects\' Favor': '위상의 은총',
  'Spatial Paradox': '공간 역설',
  'Interwoven Threads': '뒤엉킨 실타래',
  'Fate Mirror': '운명의 거울'
};

// 실행
if (require.main === module) {
  collectEvokerSkillTranslations()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Fatal error:', err);
      process.exit(1);
    });
}

module.exports = { collectEvokerSkillTranslations, EVOKER_SKILLS };