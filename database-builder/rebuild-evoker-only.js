const fs = require('fs').promises;
const { chromium } = require('playwright');

// 기원사 핵심 스킬만 (약 100개)
const EVOKER_SKILLS = {
  // 기본 스킬
  361469: true, // 생명의 불꽃
  355913: true, // 에메랄드 꽃
  357208: true, // 불의 숨결
  360806: true, // 비수
  357209: true, // 불의 숨결 (순위 2)
  362969: true, // 하늘빛 축복

  // 황폐 전문화
  353759: true, // 심호흡
  356995: true, // 분해
  357211: true, // 충전 폭발
  359073: true, // 영원의 쇄도
  370452: true, // 파괴의 불길

  // 보존 전문화
  355936: true, // 꿈의 숨결
  363534: true, // 되감기
  364342: true, // 메아리
  366155: true, // 반향
  373861: true, // 시간의 균열

  // 증강 전문화
  395152: true, // 대변동
  395160: true, // 폭발하는 화염
  396286: true, // 용의 분노
  406971: true, // 음산한 비수
  408092: true, // 화염폭풍

  // 공용 특성
  351239: true, // 청동 인내력
  357210: true, // 천공
  358267: true, // 치유의 불꽃
  358385: true, // 활공
  359816: true, // 꿈의 비행
  360823: true, // 자연화
  361227: true, // 시간의 질주
  362877: true, // 악몽의 잠
  363916: true, // 흑요석 비늘
  364343: true, // 시간의 팽창
  365080: true, // 비늘 사령관
  365362: true, // 불길한 속박
  368432: true, // 구조
  368837: true, // 선택된 운명
  368970: true, // 꼬리 후려치기
  369536: true, // 용의 수명
  369553: true, // 용족의 유산
  370553: true, // 끝의 움직임
  370665: true, // 구조 (순위 2)
  370901: true, // 정수 파열
  370960: true, // 에메랄드 친화
  371016: true, // 시간 감시자
  372048: true, // 억압의 포효
  372470: true, // 촉발
  372849: true, // 정수 폭발
  373267: true, // 과중력
  373691: true, // 시간의 압박
  374227: true, // 호흡 구역
  374251: true, // 소작
  374348: true, // 재생의 마법
  374968: true, // 휘감는 불길
  375087: true, // 용의 흐름
  375443: true, // 불타는 아우라
  375529: true, // 치유의 물결
  375602: true, // 열광
  376150: true, // 생명력 결속
  376788: true, // 정수 재생
  376872: true, // 시간 역행
  377044: true, // 공간 역설
  377088: true, // 순환
  377100: true, // 정수 조화
  377211: true, // 대재앙
  377509: true, // 꿈의 투사
  377610: true, // 손가락 튕기기
  378192: true, // 원천 마법
  378227: true, // 흑요석 보루
  378441: true, // 시간 정지
  378464: true, // 유물 해제
  381732: true, // 스칼렛의 선물
  381755: true, // 폭발성 창조물
  381922: true, // 기원사의 화염
  382266: true, // 화염의 보호막
  382411: true, // 영원의 휴식
  382731: true, // 모래폭풍
  383005: true, // 치유의 전령
  383872: true, // 무한의 인내
  384054: true, // 황폐의 인장
  386270: true, // 각성의 숨결
  386400: true, // 원천 폭발
  387350: true, // 영원한 생명
  387381: true, // 무한의 축복
  388380: true, // 소멸의 마법
  388998: true, // 흑요석 심장
  390386: true, // 분노의 불길
  393568: true, // 폭풍의 포효
  393859: true, // 격동의 시간
  394056: true, // 시간의 구멍
  395203: true // 화산폭발
};

async function collectSkillDetails(page, skillId, skillName) {
  console.log(`  🔍 [${skillId}] 상세 정보 수집 중...`);

  try {
    // 영문 페이지 접속
    await page.goto(`https://www.wowhead.com/spell=${skillId}`, {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    let skillData = {
      id: skillId,
      englishName: skillName,
      koreanName: null,
      icon: null,
      description: null,
      cooldown: "없음",
      castTime: "즉시 시전",
      range: "없음",
      resourceCost: "없음",
      resourceGain: "없음",
      type: "기본",
      spec: "공용",
      heroTalent: null,
      level: 1,
      pvp: false
    };

    // 영문명 추출
    try {
      const englishTitle = await page.title();
      skillData.englishName = englishTitle.split(' - ')[0].trim();
    } catch (e) {}

    // 아이콘 추출
    try {
      await page.waitForSelector('.iconlarge', { timeout: 3000 });
      const iconElement = await page.$('.iconlarge ins');
      if (iconElement) {
        const style = await iconElement.getAttribute('style');
        const iconMatch = style.match(/\/([^\/]+)\.(jpg|png)/);
        if (iconMatch) {
          skillData.icon = iconMatch[1].toLowerCase();
        }
      }
    } catch (e) {}

    // 한국어 페이지에서 번역 수집
    await page.goto(`https://ko.wowhead.com/spell=${skillId}`, {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    // 한국어명 추출
    try {
      const koreanTitle = await page.title();
      skillData.koreanName = koreanTitle.split(' - ')[0].trim();
    } catch (e) {
      skillData.koreanName = skillData.englishName;
    }

    // 설명 추출
    try {
      const descElement = await page.$('.q');
      if (descElement) {
        skillData.description = await descElement.textContent();
      }
    } catch (e) {}

    // 상세 정보 추출
    try {
      // 재사용 대기시간
      const cooldownElement = await page.$('th:has-text("재사용 대기시간") + td, th:has-text("쿨다운") + td');
      if (cooldownElement) {
        skillData.cooldown = await cooldownElement.textContent();
      }

      // 시전 시간
      const castElement = await page.$('th:has-text("시전 시간") + td, th:has-text("캐스팅") + td');
      if (castElement) {
        skillData.castTime = await castElement.textContent();
      }

      // 사거리
      const rangeElement = await page.$('th:has-text("사거리") + td, th:has-text("사정거리") + td');
      if (rangeElement) {
        skillData.range = await rangeElement.textContent();
      }

      // 자원 소모
      const costElement = await page.$('th:has-text("소모") + td, th:has-text("비용") + td');
      if (costElement) {
        skillData.resourceCost = await costElement.textContent();
      }
    } catch (e) {}

    console.log(`  ✅ [${skillId}] ${skillData.koreanName || skillData.englishName} 수집 완료`);
    return skillData;

  } catch (error) {
    console.log(`  ❌ [${skillId}] 수집 실패: ${error.message}`);
    return null;
  }
}

async function rebuildEvokerData() {
  console.log('🔄 기원사 데이터 재구축 시작\n');

  try {
    // 기존 데이터베이스 로드
    const existingData = JSON.parse(await fs.readFile('./all-classes-skills-data.json', 'utf8'));

    // 브라우저 시작
    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // 기원사 데이터 수집
    const skillIds = Object.keys(EVOKER_SKILLS).map(Number);
    const collectedData = {};

    console.log(`=== EVOKER 클래스 처리 중 (${skillIds.length}개 스킬) ===`);

    // 5개씩 배치 처리
    const batchSize = 5;
    const totalBatches = Math.ceil(skillIds.length / batchSize);

    for (let i = 0; i < skillIds.length; i += batchSize) {
      const batchNum = Math.floor(i / batchSize) + 1;
      console.log(`  배치 ${batchNum}/${totalBatches} 처리 중...`);

      const batch = skillIds.slice(i, i + batchSize);

      for (const skillId of batch) {
        const skillData = await collectSkillDetails(page, skillId, `Skill_${skillId}`);

        if (skillData) {
          collectedData[skillId] = skillData;
        }
      }

      // 10개 배치마다 중간 저장
      if (batchNum % 10 === 0) {
        console.log(`  💾 중간 저장 중...`);
        existingData.EVOKER = collectedData;
        await fs.writeFile('./all-classes-skills-data.json', JSON.stringify(existingData, null, 2), 'utf8');
      }
    }

    // 최종 저장
    existingData.EVOKER = collectedData;
    await fs.writeFile('./all-classes-skills-data.json', JSON.stringify(existingData, null, 2), 'utf8');

    console.log('\n================================');
    console.log('✅ 기원사 데이터 재구축 완료!');
    console.log(`📊 수집된 기원사 스킬: ${Object.keys(collectedData).length}개`);
    console.log('================================');

    await browser.close();

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
  }
}

rebuildEvokerData().catch(console.error);