import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

/**
 * SkillAutoResolver - 개선된 스킬 자동 검색 시스템
 *
 * 개선 사항:
 * - 배치 처리 최적화 (병렬 DB 조회, 순차 Wowhead 검색)
 * - 캐시 시스템 (세션 내 중복 검색 방지)
 * - 브라우저 재사용 (성능 향상)
 * - 부분 실패 허용 (일부 스킬 실패해도 계속 진행)
 * - DB 자동 추가 (tww-s3-complete-database-enhanced.json)
 */

export class SkillAutoResolver {
  constructor(className) {
    this.className = className;
    this.masterDBPath = path.join(process.cwd(), 'database-builder', 'tww-s3-complete-database-enhanced.json');
    this.masterDB = null;
    this.browser = null;
    this.cache = new Map(); // 세션 내 캐시
  }

  /**
   * 초기화 - DB 로드
   */
  async initialize() {
    try {
      const dbContent = await fs.readFile(this.masterDBPath, 'utf8');
      this.masterDB = JSON.parse(dbContent);
      console.log(`  ✓ 스킬 DB 로드 완료 (${Object.keys(this.masterDB[this.className] || {}).length}개 스킬)`);
    } catch (error) {
      console.warn(`  ⚠ 스킬 DB 로드 실패: ${error.message}`);
      this.masterDB = {};
    }
  }

  /**
   * 단일 스킬 해결
   */
  async resolve(skillName) {
    // 초기화 확인
    if (!this.masterDB) {
      await this.initialize();
    }

    // 1단계: 내부 DB 확인
    const dbSkill = this.findInDB(skillName);
    if (dbSkill) {
      console.log(`    ✅ ${skillName}: DB에서 발견`);
      return dbSkill;
    }

    // 2단계: 캐시 확인
    if (this.cache.has(skillName)) {
      console.log(`    ✅ ${skillName}: 캐시에서 발견`);
      return this.cache.get(skillName);
    }

    // 3단계: Wowhead 자동 검색
    console.log(`    🔍 ${skillName}: Wowhead 검색 중...`);
    try {
      const skillData = await this.searchWowhead(skillName);
      if (skillData) {
        // DB에 자동 추가
        await this.addToDB(skillData);
        this.cache.set(skillName, skillData);
        console.log(`    ✅ ${skillName}: 자동 추가 완료`);
        return skillData;
      }
    } catch (error) {
      console.warn(`    ⚠️ ${skillName}: 자동 검색 실패 - ${error.message}`);
      return null;
    }
  }

  /**
   * 배치 처리 - 여러 스킬 동시 해결
   */
  async resolveBatch(skillNames) {
    if (!this.masterDB) {
      await this.initialize();
    }

    const results = new Map();
    const needSearch = [];

    // 병렬 처리: DB 조회
    console.log(`\n  📦 배치 처리 시작: ${skillNames.length}개 스킬`);

    for (const name of skillNames) {
      const dbSkill = this.findInDB(name);
      if (dbSkill) {
        results.set(name, dbSkill);
      } else if (this.cache.has(name)) {
        results.set(name, this.cache.get(name));
      } else {
        needSearch.push(name);
      }
    }

    console.log(`    ✓ DB/캐시에서 발견: ${results.size}개`);
    console.log(`    🔍 검색 필요: ${needSearch.length}개`);

    // 순차 처리: Wowhead 검색 (Rate limiting)
    if (needSearch.length > 0) {
      // 브라우저 초기화 (한 번만)
      if (!this.browser) {
        this.browser = await chromium.launch({
          headless: true,
          timeout: 60000
        });
      }

      for (const name of needSearch) {
        try {
          const skillData = await this.resolve(name);
          if (skillData) {
            results.set(name, skillData);
          }

          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 3000));

        } catch (error) {
          console.warn(`    ⚠️ ${name}: 검색 실패 - ${error.message}`);
        }
      }
    }

    console.log(`  ✅ 배치 처리 완료: ${results.size}/${skillNames.length}개 성공\n`);
    return results;
  }

  /**
   * 내부 DB에서 스킬 검색
   */
  findInDB(skillName) {
    const classSkills = this.masterDB[this.className] || {};

    // 영문명, 한글명, 키 모두 검색
    for (const [key, skill] of Object.entries(classSkills)) {
      if (
        skill.englishName?.toLowerCase() === skillName.toLowerCase() ||
        skill.koreanName === skillName ||
        key === skillName.toLowerCase().replace(/\s+/g, '')
      ) {
        return { id: key, ...skill };
      }
    }

    return null;
  }

  /**
   * Wowhead에서 스킬 검색
   */
  async searchWowhead(skillName) {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true,
        timeout: 60000
      });
    }

    try {
      // Step 1: 스킬 ID 검색
      const skillId = await this.searchSkillId(skillName);
      if (!skillId) {
        console.warn(`      ⚠ ${skillName}: 스킬 ID를 찾을 수 없음`);
        return null;
      }

      console.log(`      ✓ 스킬 ID 찾음: ${skillId}`);

      // Step 2: 한글 페이지에서 데이터 추출
      const koreanData = await this.extractSkillData(skillId, 'ko');

      // Step 3: 영문 페이지에서 영문명 추출
      const englishData = await this.extractSkillData(skillId, 'en');

      // Step 4: 데이터 조합
      const skillData = {
        id: skillId,
        koreanName: koreanData.name || skillName,
        englishName: englishData.name || skillName,
        icon: koreanData.icon || 'unknown',
        description: koreanData.description || '',
        cooldown: koreanData.cooldown || '없음',
        castTime: koreanData.castTime || '즉시',
        range: koreanData.range || '근접',
        resourceCost: koreanData.resourceCost || '없음',
        resourceGain: koreanData.resourceGain || '없음',
        type: koreanData.type || '기본',
        spec: koreanData.spec || '공용',
        level: koreanData.level || 1,
        pvp: false
      };

      return skillData;

    } catch (error) {
      console.error(`      ❌ Wowhead 검색 실패: ${error.message}`);
      return null;
    }
  }

  /**
   * 스킬 ID 검색
   */
  async searchSkillId(skillName) {
    const page = await this.browser.newPage();

    try {
      // Wowhead 검색 페이지
      const searchUrl = `https://www.wowhead.com/search?q=${encodeURIComponent(skillName)}`;
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });

      // 첫 번째 스킬 결과에서 ID 추출
      const skillId = await page.evaluate(() => {
        const firstSpellLink = document.querySelector('a[href*="/spell="]');
        if (!firstSpellLink) return null;

        const match = firstSpellLink.href.match(/spell=(\d+)/);
        return match ? match[1] : null;
      });

      await page.close();
      return skillId;

    } catch (error) {
      await page.close();
      throw error;
    }
  }

  /**
   * 스킬 데이터 추출 (한글 또는 영문)
   */
  async extractSkillData(skillId, lang = 'ko') {
    const page = await this.browser.newPage();

    try {
      const baseUrl = lang === 'ko' ? 'https://ko.wowhead.com' : 'https://www.wowhead.com';
      const url = `${baseUrl}/spell=${skillId}`;

      await page.goto(url, { waitUntil: 'load', timeout: 60000 });

      const data = await page.evaluate(() => {
        const name = document.querySelector('.heading-size-1')?.textContent.trim() || '';

        const description = document.querySelector('.wowhead-tooltip-text')?.textContent.trim() || '';

        // 아이콘 추출
        const iconElement = document.querySelector('img[src*="icon"]');
        const iconUrl = iconElement?.src || '';
        const iconMatch = iconUrl.match(/icons\/([^.]+)/);
        const icon = iconMatch ? iconMatch[1] : 'unknown';

        // 세부 정보 테이블
        const infoRows = document.querySelectorAll('.infobox tr');
        const details = {};
        infoRows.forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length >= 2) {
            const key = cells[0]?.textContent.trim();
            const value = cells[1]?.textContent.trim();
            if (key && value) {
              details[key] = value;
            }
          }
        });

        return {
          name,
          description,
          icon,
          cooldown: details['재사용 대기시간'] || details['Cooldown'] || '없음',
          castTime: details['시전 시간'] || details['Cast time'] || '즉시',
          range: details['사거리'] || details['Range'] || '근접',
          resourceCost: details['자원 소모'] || '없음',
          resourceGain: details['자원 생성'] || '없음',
          type: '기본',
          spec: '공용',
          level: 1
        };
      });

      await page.close();
      return data;

    } catch (error) {
      await page.close();
      throw error;
    }
  }

  /**
   * DB에 스킬 추가
   */
  async addToDB(skillData) {
    try {
      if (!this.masterDB[this.className]) {
        this.masterDB[this.className] = {};
      }

      const skillKey = skillData.englishName.toLowerCase().replace(/\s+/g, '');
      this.masterDB[this.className][skillKey] = {
        koreanName: skillData.koreanName,
        englishName: skillData.englishName,
        icon: skillData.icon,
        description: skillData.description,
        cooldown: skillData.cooldown,
        castTime: skillData.castTime,
        range: skillData.range,
        resourceCost: skillData.resourceCost,
        resourceGain: skillData.resourceGain,
        type: skillData.type,
        spec: skillData.spec,
        level: skillData.level,
        pvp: skillData.pvp
      };

      // DB 파일 저장
      await fs.writeFile(
        this.masterDBPath,
        JSON.stringify(this.masterDB, null, 2),
        'utf8'
      );

      console.log(`      ✓ DB에 추가됨: ${skillData.koreanName} (${this.className}/${skillKey})`);

    } catch (error) {
      console.error(`      ❌ DB 추가 실패: ${error.message}`);
    }
  }

  /**
   * 정리 - 브라우저 종료
   */
  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export default SkillAutoResolver;
