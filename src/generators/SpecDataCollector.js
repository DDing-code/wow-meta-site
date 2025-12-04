import { chromium } from 'playwright';
import { getSpecMetadata, getClassMetadata } from '../data/classMetadata.js';

/**
 * SpecDataCollector - Wowhead/Maxroll 자동 데이터 수집기
 *
 * Phase 1: 데이터 수집 시스템의 핵심
 * - Playwright를 사용하여 Wowhead/Maxroll에서 자동으로 데이터 추출
 * - 영웅 특성별 로테이션, 스탯, 티어 세트 정보 수집
 * - Rate limiting 자동 적용 (2-3초)
 */

export class SpecDataCollector {
  constructor(className, specName) {
    this.className = className;
    this.specName = specName;
    this.browser = null;
    this.context = null; // Browser context with configured settings
    this.collectedData = {
      config: {},
      rotation: {},
      talents: {},
      stats: {},
      skills: {}
    };
  }

  /**
   * 메인 수집 함수 - 모든 데이터 수집
   */
  async collect() {
    console.log(`\n📥 데이터 수집 시작: ${this.className}/${this.specName}`);

    try {
      this.browser = await chromium.launch({
        headless: true,
        timeout: 60000,
        args: [
          '--disable-blink-features=AutomationControlled', // Avoid bot detection
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ]
      });

      // Create browser context with realistic fingerprint
      this.context = await this.browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        viewport: { width: 1920, height: 1080 },
        locale: 'en-US',
        timezoneId: 'America/New_York'
      });

      // Phase 1: 기본 설정 로드
      console.log('  1/5 기본 설정 로드 중...');
      await this.loadBaseConfig();

      // Phase 2: Wowhead 로테이션 데이터 수집
      console.log('  2/5 Wowhead 로테이션 데이터 수집 중...');
      await this.collectWowheadRotation();

      // Phase 3: Wowhead 티어 세트 정보 수집
      console.log('  3/5 Wowhead 티어 세트 정보 수집 중...');
      await this.collectWowheadTierSet();

      // Phase 4: Maxroll 스탯 데이터 수집
      console.log('  4/5 Maxroll 스탯 데이터 수집 중...');
      await this.collectMaxrollStats();

      // Phase 5: 특성 빌드 수집
      console.log('  5/5 특성 빌드 데이터 수집 중...');
      await this.collectTalentBuilds();

      console.log('✅ 데이터 수집 완료\n');
      return this.collectedData;

    } catch (error) {
      console.error('❌ 데이터 수집 실패:', error.message);
      throw error;
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }

  /**
   * Phase 1: 기본 설정 로드 (classMetadata에서)
   */
  async loadBaseConfig() {
    const classData = getClassMetadata(this.className);
    const specData = getSpecMetadata(this.className, this.specName);

    if (!classData || !specData) {
      throw new Error(`클래스/전문화 메타데이터를 찾을 수 없습니다: ${this.className}/${this.specName}`);
    }

    this.collectedData.config = {
      class: this.className,
      spec: this.specName,
      koreanName: `${specData.koreanName} ${classData.koreanName}`,
      englishName: `${specData.englishName} ${classData.englishName}`,
      heroTalents: specData.heroTalents || [],
      resource: {
        primary: classData.resourceType || 'unknown',
        secondary: specData.resourceNameEnglish || null,
        mechanics: specData.coreKeywords || []
      },
      meta: {
        difficulty: 'medium',
        role: specData.role || 'DPS',
        dataSource: 'wowhead',
        lastUpdated: new Date().toISOString().split('T')[0],
        patch: '11.2'
      }
    };

    console.log(`    ✓ 영웅 특성: ${this.collectedData.config.heroTalents.map(h => h.korean).join(', ')}`);
  }

  /**
   * Phase 2: Wowhead 로테이션 데이터 수집
   */
  async collectWowheadRotation() {
    // 클래스명을 하이픈 형식으로 변환 (예: demonhunter → demon-hunter)
    const classNameHyphenated = this.className.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
      .replace('demonhunter', 'demon-hunter')
      .replace('deathknight', 'death-knight');

    // Wowhead rotation page has detailed rotation data
    const url = `https://www.wowhead.com/guide/classes/${classNameHyphenated}/${this.specName}/rotation-cooldowns-pve-dps`;

    try {
      const page = await this.context.newPage(); // Use context with configured settings

      console.log(`    📡 Accessing: ${url}`);
      const response = await page.goto(url, {
        waitUntil: 'load', // Changed from 'networkidle' - Wowhead has continuous network activity (ads/scripts)
        timeout: 60000 // Increased timeout for Wowhead's heavy pages
      });

      // HTTP 상태 코드 확인
      if (!response || response.status() !== 200) {
        throw new Error(`HTTP ${response?.status() || 'TIMEOUT'} - ${url}`);
      }

      // Wait for Wowhead's dynamic content to render (custom markup processing)
      await page.waitForTimeout(3000); // Give time for JavaScript to process custom tags

      // 영웅 특성별로 섹션 파싱
      for (const heroTalent of this.collectedData.config.heroTalents) {
        console.log(`    - ${heroTalent.korean} 로테이션 수집 중...`);

        const sectionData = await this.parseRotationSection(page, heroTalent.key);
        this.collectedData.rotation[heroTalent.key] = sectionData;

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      await page.close();
      console.log(`    ✓ 로테이션 데이터 수집 완료`);

    } catch (error) {
      console.error(`    ❌ Wowhead 로테이션 수집 실패: ${error.message}`);
      console.error(`    🔗 시도한 URL: ${url}`);
      // 실패해도 계속 진행 (다른 데이터 수집 가능)
      this.collectedData.rotation = this.getDefaultRotationData();
    }
  }

  /**
   * 로테이션 섹션 파싱 (Heading 기반 Navigation)
   */
  async parseRotationSection(page, heroKey) {
    try {
      const rotationData = await page.evaluate(() => {
        // Heading 다음의 리스트 찾기 헬퍼 함수
        const getNextList = (heading) => {
          if (!heading) return null;
          let next = heading.nextElementSibling;
          while (next && next.tagName !== 'UL' && next.tagName !== 'OL') {
            const list = next.querySelector('ul, ol');
            if (list) return list;
            next = next.nextElementSibling;
            if (!next || next.tagName === 'H2' || next.tagName === 'H3') break;
          }
          return next?.tagName === 'UL' || next?.tagName === 'OL' ? next : null;
        };

        // 리스트에서 아이템 추출 (spell 링크 포함)
        const extractItems = (list) => {
          if (!list) return [];
          const items = list.querySelectorAll('li');
          return Array.from(items).map((li, idx) => {
            const skillLink = li.querySelector('a[href*="/spell="]');
            const skillName = skillLink?.textContent.trim() || '';
            const skillId = skillLink?.href?.match(/spell=(\d+)/)?.[1] || '';
            const fullText = li.textContent.trim();

            return {
              priority: idx,  // 우선순위 번호 (singleTarget/aoe 검증용)
              skillId: skillId || `skill_${idx}`,
              skillName: skillName,
              desc: fullText,
              conditions: [],  // 조건 (빈 배열)
              why: fullText,   // 이유 (전체 텍스트)
              note: fullText   // 노트 (opener용)
            };
          }).filter(item => item.skillName);
        };

        // 1. Opener 섹션 찾기
        const openerHeading = Array.from(document.querySelectorAll('h2, h3')).find(h =>
          h.textContent.includes('Opener') &&
          (h.textContent.includes('Best') || h.textContent.includes('Havoc') || h.textContent.includes('Demon Hunter'))
        );
        const opener = extractItems(getNextList(openerHeading));

        // 2. Single Target 섹션 찾기
        const stHeading = Array.from(document.querySelectorAll('h2, h3')).find(h =>
          h.textContent.includes('Single Target') && h.textContent.includes('Rotation')
        );
        const singleTarget = extractItems(getNextList(stHeading));

        // 3. AoE 섹션 찾기
        const aoeHeading = Array.from(document.querySelectorAll('h2, h3')).find(h =>
          (h.textContent.includes('AoE') || h.textContent.includes('AOE')) &&
          h.textContent.includes('Rotation')
        );
        const aoe = extractItems(getNextList(aoeHeading));

        return { opener, singleTarget, aoe };
      });

      console.log(`      ✓ Opener: ${rotationData.opener.length}개, ST: ${rotationData.singleTarget.length}개, AoE: ${rotationData.aoe.length}개 파싱됨`);
      return rotationData;

    } catch (error) {
      console.warn(`      ⚠ ${heroKey} 섹션 파싱 실패:`, error.message);
      return { opener: [], singleTarget: [], aoe: [] };
    }
  }


  /**
   * Phase 3: Wowhead 티어 세트 정보 수집
   */
  async collectWowheadTierSet() {
    // 클래스명을 하이픈 형식으로 변환
    const classNameHyphenated = this.className.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
      .replace('demonhunter', 'demon-hunter')
      .replace('deathknight', 'death-knight');

    const url = `https://www.wowhead.com/guide/classes/${classNameHyphenated}/${this.specName}/bis-gear`; // Simplified URL pattern

    try {
      const page = await this.context.newPage(); // Use context with configured settings

      console.log(`    📡 Accessing: ${url}`);
      const response = await page.goto(url, {
        waitUntil: 'load', // Changed from 'networkidle' - Wowhead has continuous network activity (ads/scripts)
        timeout: 60000 // Increased timeout for Wowhead's heavy pages
      });

      if (!response || response.status() !== 200) {
        throw new Error(`HTTP ${response?.status() || 'TIMEOUT'} - ${url}`);
      }

      const tierSet = await page.evaluate(() => {
        const section = document.querySelector('.tier-set, #tier-set') ||
                       document.querySelector('h3:has-text("Tier Set")').nextElementSibling;

        if (!section) return null;

        return {
          '2set': section.querySelector('.two-set, .2-set')?.textContent.trim() ||
                  section.querySelector('p:has-text("2-Set")')?.textContent.replace('2-Set:', '').trim() || '',
          '4set': section.querySelector('.four-set, .4-set')?.textContent.trim() ||
                  section.querySelector('p:has-text("4-Set")')?.textContent.replace('4-Set:', '').trim() || ''
        };
      });

      if (tierSet) {
        this.collectedData.config.tierSet = tierSet;
        console.log(`    ✓ 티어 세트 정보 수집 완료`);
      }

      await page.close();

    } catch (error) {
      console.error(`    ❌ 티어 세트 정보 수집 실패: ${error.message}`);
      console.error(`    🔗 시도한 URL: ${url}`);
    }
  }

  /**
   * Phase 4: Maxroll 스탯 데이터 수집
   */
  async collectMaxrollStats() {
    // 클래스명을 하이픈 형식으로 변환
    const classNameHyphenated = this.className.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
      .replace('demonhunter', 'demon-hunter')
      .replace('deathknight', 'death-knight');

    const specNameForUrl = this.specName.replace(/\s+/g, '-').toLowerCase();
    const url = `https://maxroll.gg/wow/class-guides/${classNameHyphenated}-${specNameForUrl}`;

    try {
      const page = await this.context.newPage(); // Use context with configured settings

      console.log(`    📡 Accessing: ${url}`);
      const response = await page.goto(url, {
        waitUntil: 'domcontentloaded', // Maxroll loads quickly, DOM content is sufficient
        timeout: 60000 // Increased timeout
      });

      if (!response || response.status() !== 200) {
        throw new Error(`HTTP ${response?.status() || 'TIMEOUT'} - ${url}`);
      }

      // 영웅 특성별 스탯 우선순위 수집
      for (const heroTalent of this.collectedData.config.heroTalents) {
        const statPriority = await this.parseMaxrollStats(page, heroTalent.key);

        if (!this.collectedData.stats[heroTalent.key]) {
          this.collectedData.stats[heroTalent.key] = {};
        }

        this.collectedData.stats[heroTalent.key].priority = statPriority;
      }

      await page.close();
      console.log(`    ✓ 스탯 우선순위 수집 완료`);

    } catch (error) {
      console.error(`    ❌ Maxroll 스탯 수집 실패: ${error.message}`);
      console.error(`    🔗 시도한 URL: ${url}`);
      // 기본 스탯 우선순위 사용
      this.collectedData.stats = this.getDefaultStatsData();
    }
  }

  /**
   * Maxroll 스탯 파싱
   */
  async parseMaxrollStats(page, heroKey) {
    try {
      return await page.evaluate(() => {
        const statSection = document.querySelector('.stats-priority, #stats') ||
                           document.querySelector('h3:has-text("Stat Priority")').nextElementSibling;

        if (!statSection) return [];

        const statItems = statSection.querySelectorAll('li, .stat-item');
        return Array.from(statItems).map((item, idx) => {
          const text = item.textContent.trim();
          const [statName, ...rest] = text.split(/[>=]/);

          return {
            stat: statName.trim(),
            weight: 1.0 - (idx * 0.05), // 가중치 자동 계산
            note: rest.join(' ').trim() || `${idx + 1}순위`
          };
        });
      });

    } catch (error) {
      return this.getDefaultStatPriority();
    }
  }

  /**
   * Phase 5: 특성 빌드 데이터 수집
   */
  async collectTalentBuilds() {
    // Wowhead 계산기 URL에서 특성 빌드 코드 추출
    for (const heroTalent of this.collectedData.config.heroTalents) {
      const talentData = {
        raid: {
          code: 'BUILD_CODE_PLACEHOLDER',
          description: `${heroTalent.korean} 레이드 빌드`,
          url: `https://www.wowhead.com/talent-calc/${this.className}/${this.specName}`
        },
        mythicPlus: {
          code: 'BUILD_CODE_PLACEHOLDER',
          description: `${heroTalent.korean} 쐐기돌 빌드`,
          url: `https://www.wowhead.com/talent-calc/${this.className}/${this.specName}`
        }
      };

      this.collectedData.talents[heroTalent.key] = talentData;
    }

    console.log(`    ✓ 특성 빌드 템플릿 생성 완료`);
  }

  /**
   * 기본 로테이션 데이터 (수집 실패 시)
   * 더미 데이터 생성하지 않고 빈 배열 반환
   */
  getDefaultRotationData() {
    const emptyData = {};

    for (const heroTalent of this.collectedData.config.heroTalents) {
      emptyData[heroTalent.key] = {
        opener: [],
        singleTarget: [],
        aoe: []
      };
    }

    return emptyData;
  }

  /**
   * 기본 스탯 데이터 (수집 실패 시)
   */
  getDefaultStatsData() {
    const defaultStats = {};

    for (const heroTalent of this.collectedData.config.heroTalents) {
      defaultStats[heroTalent.key] = {
        priority: this.getDefaultStatPriority(),
        breakpoints: []
      };
    }

    return defaultStats;
  }

  /**
   * 기본 스탯 우선순위
   */
  getDefaultStatPriority() {
    return [
      { stat: 'intellect', weight: 1.0, note: '주 능력치' },
      { stat: 'mastery', weight: 0.85, note: '숙련' },
      { stat: 'haste', weight: 0.80, note: '가속' },
      { stat: 'crit', weight: 0.75, note: '치명타' },
      { stat: 'versatility', weight: 0.70, note: '유연성' }
    ];
  }
}

export default SpecDataCollector;
