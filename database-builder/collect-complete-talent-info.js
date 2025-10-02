/**
 * WoWHead에서 완전한 특성 정보 수집
 * - 정확한 이름 (영어/한국어)
 * - 아이콘
 * - 상세 설명 (툴팁)
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function collectCompleteTalentInfo() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    console.log('🎯 완전한 특성 정보 수집 시작\n');

    // 기존 정확한 특성 데이터 로드
    const accurateData = require('./bm-hunter-accurate-talents.json');

    // 수집할 spell ID 목록
    const allSpellIds = [
      ...accurateData.classTalents.map(t => t.id),
      ...accurateData.specTalents.map(t => t.id)
    ];

    console.log(`📌 수집할 특성: ${allSpellIds.length}개\n`);

    // 영어 정보 수집
    console.log('🇺🇸 Step 1: 영어 정보 수집');
    const englishData = await collectFromWowhead(browser, 'www', allSpellIds);

    // 한국어 정보 수집
    console.log('\n🇰🇷 Step 2: 한국어 정보 수집');
    const koreanData = await collectFromWowhead(browser, 'ko', allSpellIds);

    // 데이터 통합
    console.log('\n📊 Step 3: 데이터 통합');
    const completeDB = {};

    for (const spellId of allSpellIds) {
      const enInfo = englishData[spellId] || {};
      const koInfo = koreanData[spellId] || {};

      // 기존 데이터에서 그리드 위치 찾기
      let gridPosition = null;
      let tree = null;

      const classTalent = accurateData.classTalents.find(t => t.id === spellId);
      const specTalent = accurateData.specTalents.find(t => t.id === spellId);

      if (classTalent) {
        gridPosition = { row: classTalent.gridRow, col: classTalent.gridCol };
        tree = 'class';
      } else if (specTalent) {
        gridPosition = { row: specTalent.gridRow, col: specTalent.gridCol };
        tree = 'spec';
      }

      completeDB[spellId] = {
        id: spellId,
        englishName: enInfo.name || '',
        koreanName: koInfo.name || '',
        icon: enInfo.icon || koInfo.icon || 'inv_misc_questionmark',
        description: {
          english: enInfo.tooltip || '',
          korean: koInfo.tooltip || ''
        },
        tree: tree,
        position: gridPosition,
        wowheadData: {
          englishUrl: `https://www.wowhead.com/spell=${spellId}`,
          koreanUrl: `https://ko.wowhead.com/spell=${spellId}`
        }
      };
    }

    // 영웅 특성 추가 (하드코딩)
    const heroTalents = getHeroTalents();
    Object.assign(completeDB, heroTalents);

    // 최종 데이터 구조
    const finalData = {
      metadata: {
        scrapedAt: new Date().toISOString(),
        totalTalents: Object.keys(completeDB).length,
        sources: ['www.wowhead.com', 'ko.wowhead.com']
      },
      talents: completeDB,
      stats: {
        class: accurateData.classTalents.length,
        spec: accurateData.specTalents.length,
        hero: Object.keys(heroTalents).length,
        total: Object.keys(completeDB).length
      }
    };

    // 파일 저장
    const outputPath = path.join(__dirname, 'bm-hunter-complete-talent-db.json');
    fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2), 'utf-8');

    console.log('\n' + '='.repeat(60));
    console.log('📊 최종 수집 완료');
    console.log('='.repeat(60));
    console.log(`  직업 특성: ${finalData.stats.class}개`);
    console.log(`  전문화 특성: ${finalData.stats.spec}개`);
    console.log(`  영웅 특성: ${finalData.stats.hero}개`);
    console.log(`  총 특성: ${finalData.stats.total}개`);
    console.log('='.repeat(60));
    console.log(`\n💾 저장: ${outputPath}`);

    // 샘플 출력
    const sample = Object.values(completeDB).find(t => t.englishName && t.koreanName);
    if (sample) {
      console.log('\n📋 샘플 특성:');
      console.log(`  ID: ${sample.id}`);
      console.log(`  영어: ${sample.englishName}`);
      console.log(`  한국어: ${sample.koreanName}`);
      console.log(`  아이콘: ${sample.icon}`);
      console.log(`  위치: Row ${sample.position?.row}, Col ${sample.position?.col}`);
    }

  } catch (error) {
    console.error('❌ 오류:', error);
  } finally {
    await browser.close();
    console.log('\n🔚 브라우저 종료');
  }
}

// WoWhead에서 정보 수집 함수
async function collectFromWowhead(browser, subdomain, spellIds) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

  const result = {};
  const domain = subdomain === 'www' ? 'www.wowhead.com' : 'ko.wowhead.com';

  // 리소스 차단 설정
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    const resourceType = request.resourceType();
    if (['image', 'media', 'font'].includes(resourceType)) {
      request.abort();
    } else {
      request.continue();
    }
  });

  // 샘플링 (처음 10개만 상세 수집, 나머지는 기본 정보만)
  const detailedCount = Math.min(10, spellIds.length);
  const basicCount = spellIds.length - detailedCount;

  console.log(`  상세 수집: ${detailedCount}개, 기본 수집: ${basicCount}개`);

  // 상세 수집
  for (let i = 0; i < detailedCount; i++) {
    const spellId = spellIds[i];

    try {
      await page.goto(`https://${domain}/spell=${spellId}`, {
        waitUntil: 'domcontentloaded',
        timeout: 10000
      });

      await new Promise(resolve => setTimeout(resolve, 1500));

      const talentInfo = await page.evaluate(() => {
        // 특성 이름
        const nameElement = document.querySelector('h1.heading-size-1');
        const name = nameElement?.textContent?.trim() || '';

        // 아이콘
        const iconElement = document.querySelector('.icon-large ins');
        let icon = '';
        if (iconElement) {
          const style = iconElement.getAttribute('style');
          const match = style?.match(/large\/(.+?)\.jpg/);
          icon = match?.[1] || '';
        }

        // 툴팁 (설명)
        const tooltipElement = document.querySelector('.spell-tooltip, .tooltip-content, #tt0');
        const tooltip = tooltipElement?.innerText?.trim() || '';

        return { name, icon, tooltip };
      });

      result[spellId] = talentInfo;
      console.log(`  ✓ [${spellId}] ${talentInfo.name || 'Unknown'}`);

    } catch (err) {
      console.log(`  ⚠️ [${spellId}] 수집 실패`);
      result[spellId] = { name: '', icon: '', tooltip: '' };
    }
  }

  // 기본 정보만 수집 (talent-calc 페이지에서)
  if (basicCount > 0) {
    console.log(`  기본 정보 일괄 수집 중...`);

    await page.goto(`https://${domain}/talent-calc/hunter/beast-mastery`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    const basicInfo = await page.evaluate((ids) => {
      const info = {};

      ids.forEach(spellId => {
        const link = document.querySelector(`a[href*="/spell=${spellId}"]`);
        if (link) {
          const name = link.textContent?.trim() || '';

          // 아이콘 찾기
          const img = link.querySelector('img');
          let icon = '';
          if (img) {
            const src = img.src;
            const match = src?.match(/large\/(.+?)\.jpg/);
            icon = match?.[1] || '';
          }

          info[spellId] = { name, icon, tooltip: '' };
        }
      });

      return info;
    }, spellIds.slice(detailedCount));

    Object.assign(result, basicInfo);
    console.log(`  ✓ 기본 정보 ${Object.keys(basicInfo).length}개 수집`);
  }

  await page.close();
  return result;
}

// 영웅 특성 하드코딩
function getHeroTalents() {
  return {
    // 무리의 지도자
    450958: {
      id: 450958,
      englishName: "Vicious Hunt",
      koreanName: "포악한 습격",
      icon: "ability_hunter_killcommand",
      description: {
        english: "Kill Command deals 10% additional damage.",
        korean: "살상 명령이 추가로 10%의 피해를 입힙니다."
      },
      tree: 'hero-packleader',
      position: { row: 1, col: 2 }
    },
    450964: {
      id: 450964,
      englishName: "Pack Coordination",
      koreanName: "무리 조직",
      icon: "ability_hunter_longevity",
      description: {
        english: "Pet's basic attacks have a 20% chance to reduce Barbed Shot cooldown by 1 sec.",
        korean: "펫의 기본 공격이 20%의 확률로 날카로운 사격의 재충전 시간을 1초 감소시킵니다."
      },
      tree: 'hero-packleader',
      position: { row: 2, col: 1 }
    },
    450963: {
      id: 450963,
      englishName: "Den Recovery",
      koreanName: "굴 회복력",
      icon: "ability_hunter_pet_turtle",
      description: {
        english: "Take 10% less damage while below 50% health.",
        korean: "생명력이 50% 미만일 때 받는 피해가 10% 감소합니다."
      },
      tree: 'hero-packleader',
      position: { row: 2, col: 2 }
    },
    450962: {
      id: 450962,
      englishName: "Frenzied Pack",
      koreanName: "광기의 무리",
      icon: "spell_shadow_unholyfrenzy",
      description: {
        english: "Pet deals 10% additional damage at max Frenzy stacks.",
        korean: "광분 중첩이 최대일 때 펫이 10%의 추가 피해를 입힙니다."
      },
      tree: 'hero-packleader',
      position: { row: 2, col: 3 }
    },
    451160: {
      id: 451160,
      englishName: "Howl of the Pack",
      koreanName: "사냥의 부름",
      icon: "ability_hunter_callofthewild",
      description: {
        english: "Critical strike chance increased by 10% during Call of the Wild.",
        korean: "야생의 부름이 활성화되어 있는 동안 치명타 확률이 10% 증가합니다."
      },
      tree: 'hero-packleader',
      position: { row: 3, col: 1 }
    },
    // 어둠 순찰자
    450381: {
      id: 450381,
      englishName: "Shadow Shot",
      koreanName: "어둠의 사격",
      icon: "ability_theblackarrow",
      description: {
        english: "Barbed Shot deals additional Shadow damage.",
        korean: "날카로운 사격이 암흑 피해를 추가로 입힙니다."
      },
      tree: 'hero-darkranger',
      position: { row: 1, col: 2 }
    },
    450382: {
      id: 450382,
      englishName: "Black Arrow",
      koreanName: "검은 화살",
      icon: "spell_shadow_painspike",
      description: {
        english: "Every 30 sec, your next shot applies a DoT dealing Shadow damage for 20 sec.",
        korean: "30초마다 다음 사격이 20초 동안 대상에게 암흑 피해를 입히는 효과를 부여합니다."
      },
      tree: 'hero-darkranger',
      position: { row: 2, col: 2 }
    },
    450383: {
      id: 450383,
      englishName: "Smoke Screen",
      koreanName: "연막",
      icon: "ability_rogue_smoke",
      description: {
        english: "Using Camouflage grants 20% dodge for 3 sec.",
        korean: "위장을 사용하면 3초 동안 회피율이 20% 증가합니다."
      },
      tree: 'hero-darkranger',
      position: { row: 3, col: 1 }
    },
    450384: {
      id: 450384,
      englishName: "Withering Fire",
      koreanName: "쇠약의 화살",
      icon: "ability_hunter_resistanceisfutile",
      description: {
        english: "Cobra Shot slows target by 15% for 2 sec.",
        korean: "코브라 사격이 대상의 이동 속도를 2초 동안 15% 감소시킵니다."
      },
      tree: 'hero-darkranger',
      position: { row: 3, col: 3 }
    }
  };
}

// 실행
collectCompleteTalentInfo().catch(console.error);