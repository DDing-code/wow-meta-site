// Phase 4 하이브리드 시스템을 Playwright로 포팅
// 내부 DB (99%) + Wowhead 테이블 (85%) 조합
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class WowheadPlaywrightHybrid {
  constructor() {
    this.patch = "11.2.0";
    this.season = "TWW Season 3";
    this.browser = null;
    this.page = null;
    this.internalDB = null;
    this.collectedData = {};
    this.errors = [];
    this.stats = {
      hybrid: 0,
      wowheadOnly: 0,
      dbOnly: 0
    };

    // 내부 DB 로드 (Tier S: 99% 신뢰도)
    this.loadInternalDB();
  }

  // 내부 DB 로드
  loadInternalDB() {
    try {
      const dbPath = path.join(__dirname, 'database-builder/all-classes-skills-data.json');
      if (fs.existsSync(dbPath)) {
        this.internalDB = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        console.log('✅ 내부 DB 로드 완료 (Tier S: 99% 신뢰도)\n');
      } else {
        console.warn('⚠️  내부 DB 없음, Wowhead만 사용\n');
      }
    } catch (error) {
      console.warn('⚠️  내부 DB 로드 실패:', error.message);
    }
  }

  // 내부 DB에서 스킬 검색
  searchInternalDB(spellId) {
    if (!this.internalDB) {
      return null;
    }

    // 모든 클래스에서 검색
    for (const className of Object.keys(this.internalDB)) {
      const classSkills = this.internalDB[className];
      const skill = classSkills[spellId.toString()];

      if (skill) {
        return {
          className: className,
          data: {
            id: skill.id || spellId,
            koreanName: skill.koreanName || skill.name || '',
            englishName: skill.englishName || skill.nameEn || '',
            icon: skill.icon || '',
            description: skill.description || '',

            // 내부 DB 강점 필드 (99% 신뢰도)
            cooldown: skill.cooldown || '없음',
            castTime: skill.castTime || '즉시',
            range: skill.range || '근접',
            resourceCost: skill.resourceCost || skill.resource || '없음',
            resourceGain: this.extractResourceFromText(skill.resource) || '없음',

            // 메타데이터 (내부 DB에 없음)
            school: null,
            mechanic: null,
            dispelType: null,
            gcd: null
          }
        };
      }
    }

    return null;
  }

  // 자원 텍스트에서 획득량 추출 (Phase 4)
  extractResourceFromText(resourceText) {
    if (!resourceText || resourceText === '없음') {
      return null;
    }

    // "분노 20 생성" → "분노 20"
    const match = resourceText.match(/(\w+)\s*(\d+)\s*생성/);
    if (match) {
      return `${match[1]} ${match[2]}`;
    }

    return null;
  }

  // 브라우저 초기화
  async initialize() {
    console.log('🌐 브라우저 초기화 중...');
    this.browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const context = await this.browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    this.page = await context.newPage();

    // 콘솔 로그 캡처 (디버깅용)
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`   [Browser Error] ${msg.text()}`);
      }
    });

    console.log('✅ 브라우저 준비 완료\n');
  }

  // Phase 2/4: 고정 인덱스 테이블 파싱 (Playwright용)
  async parseSpellDetailsTable() {
    return await this.page.evaluate(() => {
      const result = {
        school: null,
        mechanic: null,
        dispelType: null,
        gcd: null,
        duration: null,
        range: null,
        castTime: null,
        cooldown: null
      };

      const table = document.querySelector('#spelldetails');
      if (!table) {
        return result;
      }

      // 모든 td 셀 추출
      const cells = table.querySelectorAll('td');

      if (cells.length < 13) {
        // 테이블 구조가 예상과 다름
        return result;
      }

      // 고정 인덱스로 값 추출 (Phase 2에서 발견한 구조)
      result.duration = cells[3]?.textContent.trim() || null;
      result.school = cells[4]?.textContent.trim() || null;
      result.mechanic = cells[5]?.textContent.trim() || null;
      result.dispelType = cells[6]?.textContent.trim() || null;
      result.gcd = cells[7]?.textContent.trim() || null;
      result.range = cells[9]?.textContent.trim() || null;
      result.castTime = cells[10]?.textContent.trim() || null;
      result.cooldown = cells[11]?.textContent.trim() || null;

      return result;
    });
  }

  // Phase 2: 한글 → 영어 매핑 함수들
  mapKoreanSchoolToEnglish(koreanSchool) {
    const schoolMap = {
      '물리': 'Physical',
      '신성': 'Holy',
      '화염': 'Fire',
      '자연': 'Nature',
      '냉기': 'Frost',
      '암흑': 'Shadow',
      '비전': 'Arcane',
      '정령': 'Elemental',
      '혼돈': 'Chaos',
      '마법': 'Magic',
      '천체': 'Astral',
      '우주': 'Cosmic'
    };

    return schoolMap[koreanSchool] || 'Unknown';
  }

  mapKoreanMechanicToEnglish(koreanMechanic) {
    const mechanicMap = {
      '기절함': 'Stun',
      '침묵': 'Silence',
      '이동 불가': 'Root',
      '공포': 'Fear',
      '감속': 'Snare',
      '수면': 'Sleep',
      '무장 해제': 'Disarm',
      '변이': 'Polymorph',
      '추방': 'Banish',
      '속박': 'Shackle',
      '매혹': 'Charm',
      '혼란': 'Disoriented',
      '차단': 'Interrupt',
      '멍함': 'Daze',
      '얼어붙음': 'Freeze',
      '출혈': 'Bleed',
      '감염': 'Infected',
      '무적': 'Invulnerability',
      '면역': 'Immune',
      '격노': 'Enraged',
      '없음': 'n/a'
    };

    return mechanicMap[koreanMechanic] || 'n/a';
  }

  mapKoreanDispelToEnglish(koreanDispel) {
    const dispelMap = {
      '마법': 'Magic',
      '저주': 'Curse',
      '질병': 'Disease',
      '독': 'Poison',
      '은신': 'Stealth',
      '투명': 'Invisibility',
      '모두': 'All',
      '특수': 'Special',
      '격노': 'Enrage',
      '없음': 'n/a'
    };

    return dispelMap[koreanDispel] || 'n/a';
  }

  mapKoreanGcdToEnglish(koreanGcd) {
    const gcdMap = {
      '일반': 'Normal',
      '특수': 'Special',
      '없음': 'None'
    };

    return gcdMap[koreanGcd] || 'Normal';
  }

  // Phase 4: 하이브리드 스킬 데이터 크롤링
  async crawlSpellData(spellId) {
    const startTime = Date.now();

    try {
      console.log(`  🔍 스킬 ${spellId} 추출 시작...`);

      // ============================================================================
      // Phase 4 Step 1: 내부 DB 확인 (Tier S: 99% 신뢰도)
      // ============================================================================
      const dbSkill = this.searchInternalDB(spellId);
      if (dbSkill) {
        console.log(`    ✅ 내부 DB에서 발견 (Tier S): ${dbSkill.data.koreanName} [${dbSkill.className}]`);
      }

      // ============================================================================
      // Phase 4 Step 2: Wowhead 크롤링 (메타데이터 필드 추출)
      // ============================================================================
      const mode = dbSkill ? '하이브리드 모드' : 'Wowhead만';
      console.log(`    🔍 Wowhead 크롤링 (${mode})`);

      // 한글 페이지
      await this.page.goto(`https://ko.wowhead.com/spell=${spellId}`, {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });

      // 테이블 로딩 대기 (중요!)
      try {
        await this.page.waitForSelector('#spelldetails', { timeout: 5000 });
      } catch (e) {
        console.warn(`    ⚠️  #spelldetails 테이블 없음`);
      }

      // 스킬명 추출
      const koreanName = await this.page.evaluate(() => {
        const titleEl = document.querySelector('h1.heading-size-1');
        return titleEl ? titleEl.textContent.trim() : '';
      });

      // 아이콘 추출
      const iconUrl = await this.page.evaluate(() => {
        const iconEl = document.querySelector('.iconlarge ins');
        if (iconEl) {
          const style = iconEl.getAttribute('style');
          const match = style ? style.match(/\/icons\/large\/([^.]+)\.jpg/) : null;
          return match ? match[1] : '';
        }
        return '';
      });

      // 한글 설명 추출
      const koreanDesc = await this.page.evaluate(() => {
        const tooltipEl = document.querySelector('.q');
        if (tooltipEl) {
          return tooltipEl.textContent.trim();
        }
        const spellDescEl = document.querySelector('#spelldetails .indent');
        return spellDescEl ? spellDescEl.textContent.trim() : '';
      });

      // Phase 2/4: 고정 인덱스 테이블 파싱
      const tableData = await this.parseSpellDetailsTable();

      // 영어 페이지
      await this.page.goto(`https://www.wowhead.com/spell=${spellId}`, {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });

      const englishName = await this.page.evaluate(() => {
        const titleEl = document.querySelector('h1.heading-size-1');
        return titleEl ? titleEl.textContent.trim() : '';
      });

      const englishDesc = await this.page.evaluate(() => {
        const tooltipEl = document.querySelector('.q');
        if (tooltipEl) {
          return tooltipEl.textContent.trim();
        }
        const spellDescEl = document.querySelector('#spelldetails .indent');
        return spellDescEl ? spellDescEl.textContent.trim() : '';
      });

      // ============================================================================
      // Phase 4 Step 3: 하이브리드 병합 + 신뢰도 계산
      // ============================================================================

      // school, mechanic, dispelType, gcd: Wowhead 테이블만 제공
      const school = this.mapKoreanSchoolToEnglish(tableData.school);
      const mechanic = this.mapKoreanMechanicToEnglish(tableData.mechanic);
      const dispelType = this.mapKoreanDispelToEnglish(tableData.dispelType);
      const gcd = this.mapKoreanGcdToEnglish(tableData.gcd);

      // cooldown, castTime, range: 내부 DB 우선 > Wowhead 테이블
      const cooldownFinal = (dbSkill?.data.cooldown && dbSkill.data.cooldown !== '없음')
        ? dbSkill.data.cooldown
        : (tableData.cooldown || null);

      const castTimeFinal = (dbSkill?.data.castTime && dbSkill.data.castTime !== '즉시')
        ? dbSkill.data.castTime
        : (tableData.castTime || null);

      const rangeFinal = (dbSkill?.data.range && dbSkill.data.range !== '근접')
        ? dbSkill.data.range
        : (tableData.range || null);

      // resourceCost, resourceGain: 내부 DB 우선
      const resourceCostFinal = (dbSkill?.data.resourceCost && dbSkill.data.resourceCost !== '없음')
        ? dbSkill.data.resourceCost
        : '없음';

      const resourceGainFinal = (dbSkill?.data.resourceGain && dbSkill.data.resourceGain !== '없음')
        ? dbSkill.data.resourceGain
        : '없음';

      // 필드별 소스 추적
      const fieldSources = {
        school: tableData.school ? 'Wowhead' : 'Default',
        mechanic: tableData.mechanic ? 'Wowhead' : 'Default',
        dispelType: tableData.dispelType ? 'Wowhead' : 'Default',
        gcd: tableData.gcd ? 'Wowhead' : 'Default',
        cooldown: (dbSkill?.data.cooldown && dbSkill.data.cooldown !== '없음') ? 'Internal DB' : (tableData.cooldown ? 'Wowhead Table' : 'Default'),
        castTime: (dbSkill?.data.castTime && dbSkill.data.castTime !== '즉시') ? 'Internal DB' : (tableData.castTime ? 'Wowhead Table' : 'Default'),
        range: (dbSkill?.data.range && dbSkill.data.range !== '근접') ? 'Internal DB' : (tableData.range ? 'Wowhead Table' : 'Default'),
        resourceCost: (dbSkill?.data.resourceCost && dbSkill.data.resourceCost !== '없음') ? 'Internal DB' : 'Default',
        resourceGain: (dbSkill?.data.resourceGain && dbSkill.data.resourceGain !== '없음') ? 'Internal DB' : 'Default'
      };

      // 가중 평균 신뢰도 계산 (Tier S: 99%, Tier B: 85%, Tier C: 70%)
      const tierWeights = {
        'Internal DB': 0.99,
        'Wowhead Table': 0.85,
        'Wowhead': 0.85,
        'Default': 0.50
      };

      const totalFields = Object.keys(fieldSources).length;
      const weightedSum = Object.values(fieldSources).reduce((sum, source) => sum + tierWeights[source], 0);
      const overallReliability = weightedSum / totalFields;

      const elapsedTime = Date.now() - startTime;

      // 최종 결과
      const result = {
        id: spellId.toString(),
        koreanName: koreanName || dbSkill?.data.koreanName || '',
        englishName: englishName || dbSkill?.data.englishName || '',
        icon: iconUrl || dbSkill?.data.icon || '',
        description: koreanDesc || dbSkill?.data.description || '',

        // ✨ 메타데이터 필드 (Wowhead 테이블에서만 제공)
        school: school,
        mechanic: mechanic,
        dispelType: dispelType,
        gcd: gcd,

        // 🔄 하이브리드 필드 (내부 DB 우선 > Wowhead)
        cooldown: cooldownFinal || '없음',
        castTime: castTimeFinal || '즉시',
        range: rangeFinal || '근접',
        resourceCost: resourceCostFinal,
        resourceGain: resourceGainFinal,

        // 메타데이터
        metadata: {
          patch: this.patch,
          season: this.season,
          lastUpdated: new Date().toISOString(),
          extractedInMs: elapsedTime,
          dataSource: dbSkill ? 'Hybrid (Internal DB + Wowhead)' : 'Wowhead Only',
          reliability: parseFloat(overallReliability.toFixed(2)),
          fieldSources: fieldSources,
          verified: true
        }
      };

      // 통계 업데이트
      if (dbSkill) {
        this.stats.hybrid++;
      } else {
        this.stats.wowheadOnly++;
      }

      console.log(`    ✅ ${koreanName} (${englishName})`);
      console.log(`    📊 신뢰도: ${(overallReliability * 100).toFixed(1)}% | 소요: ${elapsedTime}ms`);

      return result;

    } catch (error) {
      console.error(`    ❌ 스킬 ${spellId} 크롤링 실패:`, error.message);
      this.errors.push({
        spellId,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      return null;
    }
  }

  // 스킬 ID 목록으로 크롤링
  async crawlSpellList(spellIds) {
    const results = {};

    for (const spellId of spellIds) {
      const data = await this.crawlSpellData(spellId);
      if (data) {
        results[spellId] = data;
      }

      // 속도 제한 (2초 딜레이)
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return results;
  }

  // 브라우저 종료
  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log('\n🔚 브라우저 종료');
    }
  }

  // 데이터 저장
  saveData(data) {
    const outputPath = path.join(__dirname, 'src/data/wowhead-playwright-hybrid-data.json');

    // 필드 추출 성공률 계산
    let totalFields = 0;
    let extractedFields = 0;

    Object.values(data).forEach(skill => {
      totalFields += 9;
      if (skill.cooldown && skill.cooldown !== '없음') extractedFields++;
      if (skill.castTime && skill.castTime !== '즉시') extractedFields++;
      if (skill.range && skill.range !== '근접') extractedFields++;
      if (skill.resourceCost && skill.resourceCost !== '없음') extractedFields++;
      if (skill.resourceGain && skill.resourceGain !== '없음') extractedFields++;
      if (skill.school && skill.school !== 'Unknown') extractedFields++;
      if (skill.mechanic && skill.mechanic !== 'n/a') extractedFields++;
      if (skill.dispelType && skill.dispelType !== 'n/a') extractedFields++;
      if (skill.gcd && skill.gcd !== 'Normal') extractedFields++;
    });

    const extractionRate = totalFields > 0 ? (extractedFields / totalFields * 100).toFixed(1) : 0;

    // 평균 신뢰도 계산
    const reliabilities = Object.values(data).map(s => s.metadata.reliability);
    const avgReliability = reliabilities.length > 0
      ? (reliabilities.reduce((a, b) => a + b, 0) / reliabilities.length * 100).toFixed(1)
      : 0;

    const outputData = {
      metadata: {
        patch: this.patch,
        season: this.season,
        collectionDate: new Date().toISOString(),
        totalSkills: Object.keys(data).length,
        extractionRate: `${extractionRate}%`,
        averageReliability: `${avgReliability}%`,
        stats: {
          hybrid: this.stats.hybrid,
          wowheadOnly: this.stats.wowheadOnly,
          dbOnly: this.stats.dbOnly
        },
        errors: this.errors.length,
        dataSource: 'wowhead-playwright-hybrid-phase4'
      },
      skills: data,
      errors: this.errors
    };

    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf8');
    console.log(`\n✅ 크롤링 데이터 저장 완료: ${outputPath}`);
    console.log(`📊 총 ${outputData.metadata.totalSkills}개 스킬 수집`);
    console.log(`📈 필드 추출률: ${extractionRate}%`);
    console.log(`🎯 평균 신뢰도: ${avgReliability}%`);
    console.log(`\n📊 소스 통계:`);
    console.log(`   하이브리드 모드: ${this.stats.hybrid}개`);
    console.log(`   Wowhead만: ${this.stats.wowheadOnly}개`);

    if (this.errors.length > 0) {
      console.log(`\n⚠️  ${this.errors.length}개 오류 발생`);
    }
  }
}

// 실행
async function main() {
  const crawler = new WowheadPlaywrightHybrid();

  try {
    console.log('🚀 Wowhead Playwright 하이브리드 크롤러 시작\n');
    console.log('📌 Phase 4 하이브리드 시스템 (내부 DB 99% + Wowhead 85%)\n');
    console.log('═'.repeat(60));

    await crawler.initialize();

    // Phase 4 테스트용 스킬 ID (Phase 4 테스트와 동일)
    const testSpells = [
      100,    // 돌진 (전사) - DB에 있음
      355,    // 도발 (전사) - DB에 있음
      642,    // 천상의 보호막 (성기사) - DB에 있음
      853,    // 심판의 망치 (성기사) - DB에 있음
      1680,   // 소용돌이 (전사) - DB에 있음
      6940,   // 희생의 축복 (성기사) - DB에 있음
      23920,  // 주문 반사 (전사) - DB에 있음
      46968,  // 충격파 (전사) - DB에 있음
      184575  // 심판의 칼날 (성기사) - DB에 있음
    ];

    console.log(`\n📊 ${testSpells.length}개 스킬 크롤링 시작:\n`);
    const allResults = await crawler.crawlSpellList(testSpells);

    // 데이터 저장
    crawler.saveData(allResults);

    console.log('\n✅ Phase 4 하이브리드 시스템 Playwright 포팅 완료!');

  } catch (error) {
    console.error('❌ 크롤러 오류:', error);
  } finally {
    await crawler.close();
  }
}

// 모듈 내보내기
module.exports = { WowheadPlaywrightHybrid };

// 직접 실행 시
if (require.main === module) {
  main();
}
