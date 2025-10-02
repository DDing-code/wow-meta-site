const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

console.log('🚀 완전한 스킬 데이터 수집 시작 (설명, 타입, 전문화 포함)...');

// 기존 데이터베이스 로드
const existingDbPath = path.join(__dirname, 'tww-s3-final-ultimate-database.json');
const existingDb = JSON.parse(fs.readFileSync(existingDbPath, 'utf8'));

// 클래스별 전문화 정보
const classSpecializations = {
  'warrior': {
    name: '전사',
    specs: {
      'arms': '무기',
      'fury': '분노',
      'protection': '방어'
    }
  },
  'paladin': {
    name: '성기사',
    specs: {
      'holy': '신성',
      'protection': '보호',
      'retribution': '징벌'
    }
  },
  'hunter': {
    name: '사냥꾼',
    specs: {
      'beast-mastery': '야수',
      'marksmanship': '사격',
      'survival': '생존'
    }
  },
  'rogue': {
    name: '도적',
    specs: {
      'assassination': '암살',
      'outlaw': '무법',
      'subtlety': '잠행'
    }
  },
  'priest': {
    name: '사제',
    specs: {
      'discipline': '수양',
      'holy': '신성',
      'shadow': '암흑'
    }
  },
  'shaman': {
    name: '주술사',
    specs: {
      'elemental': '정기',
      'enhancement': '고양',
      'restoration': '복원'
    }
  },
  'mage': {
    name: '마법사',
    specs: {
      'arcane': '비전',
      'fire': '화염',
      'frost': '냉기'
    }
  },
  'warlock': {
    name: '흑마법사',
    specs: {
      'affliction': '고통',
      'demonology': '악마',
      'destruction': '파괴'
    }
  },
  'monk': {
    name: '수도사',
    specs: {
      'brewmaster': '양조',
      'mistweaver': '운무',
      'windwalker': '풍운'
    }
  },
  'druid': {
    name: '드루이드',
    specs: {
      'balance': '조화',
      'feral': '야성',
      'guardian': '수호',
      'restoration': '회복'
    }
  },
  'demon-hunter': {
    name: '악마사냥꾼',
    specs: {
      'havoc': '파멸',
      'vengeance': '복수'
    }
  },
  'death-knight': {
    name: '죽음의기사',
    specs: {
      'blood': '혈기',
      'frost': '냉기',
      'unholy': '부정'
    }
  },
  'evoker': {
    name: '기원사',
    specs: {
      'devastation': '황폐',
      'preservation': '보존',
      'augmentation': '증강'
    }
  }
};

// 수집할 스킬 목록 생성 (기존 DB에서)
const skillsToCollect = [];
Object.entries(existingDb).forEach(([className, classSkills]) => {
  Object.entries(classSkills).forEach(([skillId, skill]) => {
    // 설명이 없거나 잘못된 스킬들만 수집
    if (!skill.description ||
        skill.description.includes('주의:') ||
        skill.description.includes('동영상') ||
        skill.description.length < 10 ||
        skill.type === '기본' && !skill.spec ||
        skill.spec === '공용') {
      skillsToCollect.push({
        id: skillId,
        className: className,
        existingData: skill
      });
    }
  });
});

console.log(`📋 수집 대상: ${skillsToCollect.length}개 스킬`);

async function collectSkillData(browser, skillId) {
  const page = await browser.newPage();

  try {
    // 한국어 Wowhead 접속
    const url = `https://ko.wowhead.com/spell=${skillId}`;
    console.log(`  📖 수집 중: ${url}`);

    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // 잠시 대기
    await page.waitForTimeout(2000);

    // 스킬 정보 추출
    const skillData = await page.evaluate(() => {
      const data = {};

      // 한글 이름 (페이지 제목에서)
      const titleElement = document.querySelector('h1.heading-size-1');
      if (titleElement) {
        data.koreanName = titleElement.textContent.trim();
      }

      // 설명 (툴팁에서)
      const tooltipElement = document.querySelector('.q, .q0, .q1, .q2, .q3, .q4, .q5');
      if (tooltipElement) {
        data.description = tooltipElement.textContent.trim()
          .replace(/\n+/g, ' ')
          .replace(/\s+/g, ' ');
      }

      // 대체 설명 찾기
      if (!data.description) {
        const descElements = document.querySelectorAll('div[id*="tooltip"] .q, .spell-tooltip .q');
        for (const el of descElements) {
          if (el.textContent && el.textContent.length > 10) {
            data.description = el.textContent.trim()
              .replace(/\n+/g, ' ')
              .replace(/\s+/g, ' ');
            break;
          }
        }
      }

      // 스킬 타입 판별 (특성인지 기본 스킬인지)
      const breadcrumbLinks = document.querySelectorAll('.breadcrumb a');
      let isBaseline = true;
      let isTalent = false;
      let specName = null;

      breadcrumbLinks.forEach(link => {
        const href = link.href || '';
        const text = link.textContent || '';

        // 특성 페이지 링크 확인
        if (href.includes('/talent-calc/') || href.includes('/talents/')) {
          isTalent = true;
          isBaseline = false;
        }

        // 전문화 이름 추출
        if (href.includes('/talent-calc/')) {
          // URL에서 전문화 추출
          const match = href.match(/\/([^\/]+)$/);
          if (match) {
            specName = match[1];
          }
        }

        // 한글 전문화명 직접 확인
        if (text.includes('무기') || text.includes('분노') || text.includes('방어')) {
          data.detectedSpec = text.trim();
        }
        if (text.includes('신성') || text.includes('보호') || text.includes('징벌')) {
          data.detectedSpec = text.trim();
        }
        // ... 다른 전문화들도 추가
      });

      data.type = isTalent ? '특성' : '기본';

      // 스킬 정보 테이블에서 추가 정보
      const infoRows = document.querySelectorAll('.infobox tr');
      infoRows.forEach(row => {
        const label = row.querySelector('th');
        const value = row.querySelector('td');
        if (label && value) {
          const labelText = label.textContent.trim();
          const valueText = value.textContent.trim();

          if (labelText.includes('재사용')) {
            data.cooldown = valueText;
          }
          if (labelText.includes('시전')) {
            data.castTime = valueText;
          }
          if (labelText.includes('사거리')) {
            data.range = valueText;
          }
          if (labelText.includes('소모')) {
            data.resourceCost = valueText;
          }
        }
      });

      // 아이콘 추출
      const iconElement = document.querySelector('.icon-medium ins, .iconlarge ins');
      if (iconElement) {
        const style = iconElement.getAttribute('style');
        if (style) {
          const match = style.match(/\/([^\/]+)\.(jpg|png)/);
          if (match) {
            data.icon = match[1];
          }
        }
      }

      return data;
    });

    return skillData;

  } catch (error) {
    console.error(`    ❌ 오류 발생 (${skillId}):`, error.message);
    return null;
  } finally {
    await page.close();
  }
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const updatedDatabase = JSON.parse(JSON.stringify(existingDb)); // 깊은 복사
  const batchSize = 5; // 동시 처리할 스킬 수

  try {
    // 배치 처리
    for (let i = 0; i < skillsToCollect.length; i += batchSize) {
      const batch = skillsToCollect.slice(i, Math.min(i + batchSize, skillsToCollect.length));

      console.log(`\n📦 배치 ${Math.floor(i/batchSize) + 1}/${Math.ceil(skillsToCollect.length/batchSize)} 처리 중...`);

      const promises = batch.map(async (skillInfo) => {
        const data = await collectSkillData(browser, skillInfo.id);
        return { skillInfo, data };
      });

      const results = await Promise.all(promises);

      // 결과 업데이트
      results.forEach(({ skillInfo, data }) => {
        if (data && updatedDatabase[skillInfo.className]) {
          const existingSkill = updatedDatabase[skillInfo.className][skillInfo.id];

          // 기존 데이터와 병합
          if (existingSkill) {
            // 설명 업데이트
            if (data.description && data.description.length > 10 && !data.description.includes('주의:')) {
              existingSkill.description = data.description;
            }

            // 타입 업데이트
            if (data.type) {
              existingSkill.type = data.type;
            }

            // 전문화 업데이트
            if (data.detectedSpec) {
              existingSkill.spec = data.detectedSpec;
            }

            // 기타 필드 업데이트
            if (data.koreanName) existingSkill.koreanName = data.koreanName;
            if (data.icon) existingSkill.icon = data.icon;
            if (data.cooldown) existingSkill.cooldown = data.cooldown;
            if (data.castTime) existingSkill.castTime = data.castTime;
            if (data.range) existingSkill.range = data.range;
            if (data.resourceCost) existingSkill.resourceCost = data.resourceCost;

            console.log(`    ✅ 업데이트: ${existingSkill.koreanName} (${data.type}, ${existingSkill.spec || '공용'})`);
          }
        }
      });

      // 중간 저장
      if (i % 20 === 0) {
        const tempPath = path.join(__dirname, 'tww-s3-complete-database-temp.json');
        fs.writeFileSync(tempPath, JSON.stringify(updatedDatabase, null, 2), 'utf8');
        console.log(`  💾 중간 저장 완료`);
      }

      // 대기 (서버 부하 방지)
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

  } catch (error) {
    console.error('❌ 수집 중 오류:', error);
  } finally {
    await browser.close();
  }

  // 최종 저장
  const outputPath = path.join(__dirname, 'tww-s3-complete-database.json');
  fs.writeFileSync(outputPath, JSON.stringify(updatedDatabase, null, 2), 'utf8');

  // 통계
  let stats = {
    total: 0,
    withDescription: 0,
    talents: 0,
    baseline: 0,
    withSpec: 0
  };

  Object.values(updatedDatabase).forEach(classSkills => {
    Object.values(classSkills).forEach(skill => {
      stats.total++;
      if (skill.description && skill.description.length > 10 && !skill.description.includes('주의:')) {
        stats.withDescription++;
      }
      if (skill.type === '특성') stats.talents++;
      if (skill.type === '기본') stats.baseline++;
      if (skill.spec && skill.spec !== '공용') stats.withSpec++;
    });
  });

  console.log('\n✅ 수집 완료!');
  console.log('📊 통계:');
  console.log(`  - 총 스킬: ${stats.total}개`);
  console.log(`  - 설명 완성: ${stats.withDescription}개 (${(stats.withDescription/stats.total*100).toFixed(1)}%)`);
  console.log(`  - 기본 스킬: ${stats.baseline}개`);
  console.log(`  - 특성: ${stats.talents}개`);
  console.log(`  - 전문화 할당: ${stats.withSpec}개 (${(stats.withSpec/stats.total*100).toFixed(1)}%)`);
  console.log(`\n💾 저장 위치: ${outputPath}`);
}

main().catch(console.error);