/**
 * Wowhead에서 실제 스킬 데이터 가져오기
 * Playwright를 사용하여 한국어 Wowhead 사이트에서 실제 데이터 수집
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// 기존 데이터 로드
const basePath = path.join(__dirname, '..', 'src', 'data');
const existingData = JSON.parse(fs.readFileSync(path.join(basePath, 'wowhead-full-descriptions-complete.json'), 'utf8'));

// 주요 스킬 ID 목록 (실제 WoW 스킬들)
const importantSkills = [
  // 전사
  { id: 100, name: "돌진" },
  { id: 1680, name: "소용돌이" },
  { id: 23922, name: "방패 밀쳐내기" },
  { id: 1715, name: "무력화" },
  { id: 6552, name: "자루 공격" },
  { id: 355, name: "도발" },

  // 성기사
  { id: 62326, name: "성스러운 빛" },
  { id: 853, name: "심판의 망치" },
  { id: 633, name: "신의 축복" },
  { id: 642, name: "천상의 보호막" },
  { id: 31884, name: "응징의 격노" },

  // 사냥꾼
  { id: 883, name: "야수 부르기" },
  { id: 2643, name: "야수 무리" },
  { id: 19574, name: "야수의 격노" },
  { id: 186265, name: "살육의 면모" },
  { id: 193530, name: "야생의 면모" },

  // 도적
  { id: 1833, name: "비열한 트집" },
  { id: 1856, name: "소멸" },
  { id: 2094, name: "실명" },
  { id: 8676, name: "매복" },
  { id: 1766, name: "발차기" },

  // 사제
  { id: 585, name: "강타" },
  { id: 589, name: "어둠의 권능: 고통" },
  { id: 17, name: "신의 권능: 보호막" },
  { id: 139, name: "소생" },
  { id: 2061, name: "순간 치유" },

  // 마법사
  { id: 116, name: "서리 화살" },
  { id: 133, name: "화염구" },
  { id: 44425, name: "비전 탄막" },
  { id: 12051, name: "환기" },
  { id: 45438, name: "얼음 방패" },
  { id: 1953, name: "점멸" },

  // 흑마법사
  { id: 172, name: "부패" },
  { id: 686, name: "암흑 화살" },
  { id: 348, name: "제물" },
  { id: 1122, name: "지옥불정령 소환" },
  { id: 30283, name: "어둠의 격노" },

  // 주술사
  { id: 188196, name: "번개 화살" },
  { id: 51505, name: "용암 폭발" },
  { id: 17364, name: "폭풍의 일격" },
  { id: 61295, name: "성난 해일" },
  { id: 2008, name: "고대의 혼" },

  // 수도사
  { id: 100780, name: "범의 장풍" },
  { id: 107428, name: "해오름차기" },
  { id: 115080, name: "절명의 손길" },
  { id: 116847, name: "범의 질풍" },
  { id: 115181, name: "작열의 숨결" },

  // 드루이드
  { id: 5176, name: "천벌" },
  { id: 8921, name: "달빛섬광" },
  { id: 774, name: "회복" },
  { id: 5487, name: "곰 변신" },
  { id: 768, name: "표범 변신" },

  // 죽음의 기사
  { id: 49998, name: "죽음의 일격" },
  { id: 47541, name: "죽음의 고리" },
  { id: 55233, name: "흡혈" },
  { id: 48792, name: "얼음 같은 인내력" },
  { id: 48707, name: "대마법 보호막" },

  // 악마사냥꾼
  { id: 162794, name: "혼돈의 일격" },
  { id: 198013, name: "눈부신 빛" },
  { id: 191427, name: "탈태" },
  { id: 198589, name: "흐릿해지기" },
  { id: 183752, name: "분열" },

  // 기원사
  { id: 361469, name: "살아있는 불꽃" },
  { id: 357210, name: "심호흡" },
  { id: 355913, name: "되돌리기" },
  { id: 355916, name: "에메랄드 꽃" },
  { id: 357208, name: "화염 숨결" }
];

async function fetchSkillData() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--lang=ko-KR']
  });

  const page = await browser.newPage();
  const updatedDescriptions = { ...existingData };
  let successCount = 0;
  let errorCount = 0;

  for (const skill of importantSkills) {
    try {
      console.log(`🔍 스킬 ${skill.id} (${skill.name}) 정보 가져오는 중...`);

      // 한국어 Wowhead 페이지 접속
      await page.goto(`https://ko.wowhead.com/spell=${skill.id}`, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // 페이지 로드 대기
      await page.waitForTimeout(2000);

      // 스킬 정보 추출
      const skillData = await page.evaluate(() => {
        // 스킬 이름
        const nameElem = document.querySelector('h1.heading-size-1');
        const krName = nameElem ? nameElem.textContent.trim() : '';

        // 설명 텍스트 추출
        const tooltipElem = document.querySelector('.q, .q0, .q1, .q2, .q3, .q4, .q5');
        let description = '';
        if (tooltipElem) {
          description = tooltipElem.innerText.trim();
        } else {
          // 대체 위치에서 찾기
          const descElem = document.querySelector('.spell-tooltip-description, .tooltip-yellow, #tooltip-generic');
          if (descElem) {
            description = descElem.innerText.trim();
          }
        }

        // 사거리, 시전 시간, 재사용 대기시간 추출
        let range = '';
        let castTime = '';
        let cooldown = '';
        let resource = '';

        const detailElems = document.querySelectorAll('.spell-detail, .q, td');
        detailElems.forEach(elem => {
          const text = elem.textContent;
          if (text.includes('사정거리')) {
            range = text.replace(/.*사정거리[:：]\s*/, '').trim();
          }
          if (text.includes('시전 시간')) {
            castTime = text.replace(/.*시전 시간[:：]\s*/, '').trim();
          }
          if (text.includes('재사용 대기시간')) {
            cooldown = text.replace(/.*재사용 대기시간[:：]\s*/, '').trim();
          }
          if (text.includes('마나') || text.includes('분노') || text.includes('기력') || text.includes('룬')) {
            resource = text.trim();
          }
        });

        // 아이콘 이름 추출
        let iconName = '';
        const iconElem = document.querySelector('ins[style*="background-image"]');
        if (iconElem) {
          const bgImage = iconElem.style.backgroundImage;
          const match = bgImage.match(/\/([^\/]+)\.jpg/);
          if (match) {
            iconName = match[1];
          }
        }

        return {
          krName,
          description,
          range,
          castTime,
          cooldown,
          resource,
          iconName
        };
      });

      if (skillData.krName && skillData.description) {
        // 실제 데이터로 업데이트
        updatedDescriptions[skill.id] = {
          id: skill.id.toString(),
          krName: skillData.krName,
          description: skillData.description,
          range: skillData.range || '',
          castTime: skillData.castTime || '즉시',
          cooldown: skillData.cooldown || '',
          resource: skillData.resource || '',
          icon: skillData.iconName || ''
        };
        successCount++;
        console.log(`✅ ${skill.name} 정보 수집 완료`);
      } else {
        errorCount++;
        console.log(`⚠️ ${skill.name} 정보를 찾을 수 없음`);
      }

      // 요청 간 딜레이
      await page.waitForTimeout(1500);

    } catch (error) {
      console.error(`❌ 스킬 ${skill.id} 처리 중 오류:`, error.message);
      errorCount++;
    }
  }

  await browser.close();

  // 파일 저장
  fs.writeFileSync(
    path.join(basePath, 'wowhead-full-descriptions-complete.json'),
    JSON.stringify(updatedDescriptions, null, 2),
    'utf8'
  );

  console.log('\n===== 수집 완료 =====');
  console.log(`✅ 성공: ${successCount}개`);
  console.log(`❌ 실패: ${errorCount}개`);
  console.log(`📁 저장 위치: src/data/wowhead-full-descriptions-complete.json`);
}

// 실행
fetchSkillData().catch(console.error);