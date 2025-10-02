// 스킬 데이터베이스 관리자
// 페르소나가 새 스킬을 학습할 때 자동으로 DB에 추가하는 시스템
const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');
import moduleEventBus from './ModuleEventBus.js';

class SkillDatabaseManager {
  constructor() {
    this.dbPath = path.join(__dirname, '../../database-builder/tww-s3-refined-database.json');
    this.cache = new Map();  // 메모리 캐시
    this.pendingFetches = new Map();  // 중복 요청 방지
    this.browser = null;
    this.page = null;

    this.initialize();
  }

  async initialize() {
    try {
      // DB 로드
      await this.loadDatabase();

      // 이벤트 리스너 설정
      this.setupEventListeners();

      // 브라우저 초기화
      await this.initBrowser();

      console.log('✅ SkillDatabaseManager 초기화 완료');
    } catch (error) {
      console.error('❌ SkillDatabaseManager 초기화 실패:', error);
    }
  }

  async initBrowser() {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true,
        args: ['--disable-blink-features=AutomationControlled']
      });

      const context = await this.browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        viewport: { width: 1920, height: 1080 }
      });

      this.page = await context.newPage();
    }
  }

  async loadDatabase() {
    try {
      const content = await fs.readFile(this.dbPath, 'utf-8');
      const database = JSON.parse(content);

      // 캐시에 로드
      for (const [id, skill] of Object.entries(database)) {
        this.cache.set(id, skill);
      }

      console.log(`📚 ${this.cache.size}개 스킬 로드 완료`);
    } catch (error) {
      console.error('DB 로드 실패:', error);
      // DB 파일이 없으면 새로 생성
      await this.saveDatabase();
    }
  }

  async saveDatabase() {
    try {
      const database = {};
      for (const [id, skill] of this.cache.entries()) {
        database[id] = skill;
      }

      // 백업 생성
      const backupPath = this.dbPath.replace('.json', `-backup-${Date.now()}.json`);
      try {
        await fs.copyFile(this.dbPath, backupPath);
      } catch (e) {
        // 원본 파일이 없을 수 있음
      }

      // DB 저장
      await fs.writeFile(this.dbPath, JSON.stringify(database, null, 2));
      console.log(`💾 DB 저장 완료 (${this.cache.size}개 스킬)`);

    } catch (error) {
      console.error('DB 저장 실패:', error);
    }
  }

  setupEventListeners() {
    // 새 스킬 발견 이벤트
    moduleEventBus.on('new-skill-discovered', async (data) => {
      await this.handleNewSkill(data);
    });

    // DB 조회 요청
    moduleEventBus.on('query-skill-db', (data) => {
      const skill = this.getSkill(data.skillId);
      if (data.callback) {
        data.callback(skill);
      }
    });

    // 프로세스 종료 시 정리
    process.on('SIGINT', async () => {
      await this.cleanup();
      process.exit(0);
    });
  }

  // 새 스킬 처리
  async handleNewSkill({ skillId, englishName, className, spec, source }) {
    console.log(`🔍 새 스킬 발견: ${englishName} (ID: ${skillId})`);

    // 이미 DB에 있는지 확인
    if (this.cache.has(skillId)) {
      console.log(`✓ 스킬 이미 DB에 존재: ${this.cache.get(skillId).koreanName}`);
      return this.cache.get(skillId);
    }

    // 이미 fetch 중인지 확인 (중복 방지)
    if (this.pendingFetches.has(skillId)) {
      console.log(`⏳ 이미 수집 중...`);
      return await this.pendingFetches.get(skillId);
    }

    // ko.wowhead.com에서 정보 수집
    const fetchPromise = this.fetchSkillFromWowhead(skillId, englishName, className, spec);
    this.pendingFetches.set(skillId, fetchPromise);

    try {
      const skillData = await fetchPromise;
      this.pendingFetches.delete(skillId);

      if (skillData) {
        // DB에 추가
        await this.addSkillToDatabase(skillData);

        // 이벤트 발생
        moduleEventBus.emit('skill-added-to-db', {
          skillId,
          skillData,
          source
        });

        return skillData;
      }
    } catch (error) {
      console.error(`❌ 스킬 수집 실패 (${skillId}):`, error);
      this.pendingFetches.delete(skillId);
      return null;
    }
  }

  // ko.wowhead.com에서 스킬 정보 수집
  async fetchSkillFromWowhead(skillId, englishName, className, spec) {
    if (!this.page) {
      await this.initBrowser();
    }

    try {
      const url = `https://ko.wowhead.com/spell=${skillId}`;
      console.log(`📡 Wowhead 접속: ${url}`);

      await this.page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });

      // 페이지 로드 대기
      await this.page.waitForTimeout(2000);

      // 한국어 스킬명 추출
      const koreanName = await this.page.evaluate(() => {
        const h1Element = document.querySelector('h1.heading-size-1');
        if (h1Element) {
          const text = h1Element.textContent.trim();
          return text.replace(/\s*\u200B*$/, '').trim();
        }

        const titleMatch = document.title.match(/^([^-]+)/);
        if (titleMatch) {
          return titleMatch[1].trim();
        }

        return null;
      });

      if (!koreanName || koreanName === 'Error' || koreanName.includes('404')) {
        throw new Error('번역을 찾을 수 없음');
      }

      // 추가 정보 수집 (설명, 재사용 대기시간 등)
      const additionalInfo = await this.page.evaluate(() => {
        const info = {
          description: '',
          cooldown: '없음',
          castTime: '즉시 시전',
          range: '자신',
          resourceCost: '없음',
          resourceGain: '없음'
        };

        // 설명 추출
        const descElement = document.querySelector('.q, .tooltip-content');
        if (descElement) {
          info.description = descElement.textContent.trim();
        }

        // 툴팁 정보에서 추가 데이터 추출
        const tooltipElements = document.querySelectorAll('table.infobox td');
        tooltipElements.forEach(td => {
          const text = td.textContent.trim();
          if (text.includes('재사용 대기시간')) {
            info.cooldown = text.replace('재사용 대기시간', '').trim();
          }
          if (text.includes('시전 시간')) {
            info.castTime = text.replace('시전 시간', '').trim();
          }
          if (text.includes('사거리')) {
            info.range = text.replace('사거리', '').trim();
          }
        });

        return info;
      });

      // 아이콘 추출 시도
      const icon = await this.page.evaluate(() => {
        const iconElement = document.querySelector('.icon-medium, .iconmedium');
        if (iconElement && iconElement.style.backgroundImage) {
          const match = iconElement.style.backgroundImage.match(/\/([^\/]+)\.jpg/);
          if (match) return match[1];
        }
        return 'inv_misc_questionmark';  // 기본 아이콘
      });

      // 완전한 스킬 데이터 구성
      const skillData = {
        id: skillId,
        koreanName: koreanName,
        englishName: englishName || koreanName,
        icon: icon,
        description: additionalInfo.description || `${koreanName} 스킬`,
        cooldown: additionalInfo.cooldown,
        castTime: additionalInfo.castTime,
        range: additionalInfo.range,
        resourceCost: additionalInfo.resourceCost,
        resourceGain: additionalInfo.resourceGain,
        type: this.determineSkillType(spec),
        spec: spec || '공용',
        level: 1,
        pvp: false,
        className: className || '공용',
        source: 'auto-collected',
        collectedAt: new Date().toISOString(),
        verified: true
      };

      console.log(`✅ 스킬 수집 완료: ${koreanName} (${englishName})`);
      return skillData;

    } catch (error) {
      console.error(`❌ Wowhead 수집 실패:`, error.message);

      // 실패 시 기본 데이터로 생성
      return {
        id: skillId,
        koreanName: englishName,  // 번역 실패 시 영문명 사용
        englishName: englishName,
        icon: 'inv_misc_questionmark',
        description: `${englishName} 스킬 (자동 수집 실패)`,
        cooldown: '알 수 없음',
        castTime: '알 수 없음',
        range: '알 수 없음',
        resourceCost: '알 수 없음',
        resourceGain: '알 수 없음',
        type: this.determineSkillType(spec),
        spec: spec || '공용',
        level: 1,
        pvp: false,
        className: className || '공용',
        source: 'auto-generated',
        collectedAt: new Date().toISOString(),
        verified: false
      };
    }
  }

  // 스킬 타입 결정
  determineSkillType(spec) {
    if (!spec) return '기본';

    const specTypes = {
      '황폐': '주요',
      '보존': '치유',
      '증강': '지원',
      '무기': '주요',
      '분노': '주요',
      '방어': '방어',
      '신성': '치유',
      '보호': '방어',
      '징벌': '주요',
      // ... 다른 전문화들
    };

    return specTypes[spec] || '기본';
  }

  // DB에 스킬 추가
  async addSkillToDatabase(skillData) {
    this.cache.set(skillData.id, skillData);

    // 정기적으로 저장 (매 10개 스킬마다)
    if (this.cache.size % 10 === 0) {
      await this.saveDatabase();
    }

    console.log(`💾 스킬 DB 추가: ${skillData.koreanName} (총 ${this.cache.size}개)`);

    // 번역 검증 이벤트
    moduleEventBus.emit('translation-verified', {
      skillId: skillData.id,
      englishName: skillData.englishName,
      koreanName: skillData.koreanName,
      verified: skillData.verified
    });
  }

  // 스킬 조회
  getSkill(skillId) {
    return this.cache.get(String(skillId));
  }

  // 스킬 검색 (이름으로)
  findSkillByName(name, language = 'korean') {
    for (const [id, skill] of this.cache.entries()) {
      if (language === 'korean' && skill.koreanName === name) {
        return skill;
      }
      if (language === 'english' && skill.englishName === name) {
        return skill;
      }
    }
    return null;
  }

  // 클래스별 스킬 조회
  getSkillsByClass(className) {
    const skills = [];
    for (const skill of this.cache.values()) {
      if (skill.className === className || skill.spec === '공용') {
        skills.push(skill);
      }
    }
    return skills;
  }

  // 정리 작업
  async cleanup() {
    console.log('🧹 SkillDatabaseManager 정리 중...');

    // 최종 저장
    await this.saveDatabase();

    // 브라우저 종료
    if (this.browser) {
      await this.browser.close();
    }

    console.log('✅ 정리 완료');
  }
}

// 싱글톤 인스턴스
const skillDatabaseManager = new SkillDatabaseManager();
export default skillDatabaseManager;