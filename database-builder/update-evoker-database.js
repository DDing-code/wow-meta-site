// 기원사 데이터베이스 업데이트 스크립트
const fs = require('fs').promises;
const path = require('path');

async function updateEvokerDatabase() {
  try {
    console.log('📚 기원사 데이터베이스 업데이트 시작...');

    // 1. 현재 데이터베이스 로드
    const dbPath = path.join(__dirname, 'tww-s3-refined-database.json');
    const dbContent = await fs.readFile(dbPath, 'utf-8');
    const database = JSON.parse(dbContent);

    // 2. 검증된 번역 데이터 로드
    const translationsPath = path.join(__dirname, 'evoker-translations-verified.json');
    const translationsContent = await fs.readFile(translationsPath, 'utf-8');
    const translations = JSON.parse(translationsContent);

    // 3. 기원사 스킬 업데이트 매핑 (수동 검증 완료)
    const evokerSkillUpdates = {
      // 황폐 (Devastation)
      '356995': { koreanName: '파열' }, // Disintegrate - 확인됨
      '357208': { koreanName: '불의 숨결' }, // Fire Breath - 확인됨
      '357211': { koreanName: '기염' }, // Pyre - 확인됨
      '359073': { koreanName: '영원의 쇄도' }, // Eternity Surge
      '361500': { koreanName: '살아있는 불꽃' }, // Living Flame
      '362969': { koreanName: '하늘빛 일격' }, // Azure Strike - 확인됨
      '368970': { koreanName: '화염 폭풍' }, // Firestorm
      '375087': { koreanName: '용의 분노' }, // Dragonrage
      '357210': { koreanName: '깊은 숨결' }, // Deep Breath
      '370452': { koreanName: '산산이 부서지는 별' }, // Shattering Star
      '443328': { koreanName: '휩싸기' }, // Engulf
      '408092': { koreanName: '정수 폭발' }, // Essence Burst
      '369297': { koreanName: '루비 정수 폭발' }, // Ruby Essence Burst

      // 보존 (Preservation)
      '355913': { koreanName: '에메랄드 꽃' }, // Emerald Blossom - 확인됨
      '366155': { koreanName: '역행' }, // Reversion
      '367226': { koreanName: '영혼꽃' }, // Spiritbloom
      '363534': { koreanName: '꿈 비행' }, // Dream Flight
      '360827': { koreanName: '신록의 품' }, // Verdant Embrace
      '364343': { koreanName: '메아리' }, // Echo
      '373861': { koreanName: '시간의 변칙' }, // Temporal Anomaly
      '357170': { koreanName: '시간 팽창' }, // Time Dilation
      '370960': { koreanName: '에메랄드 교감' }, // Emerald Communion
      '374939': { koreanName: '생명 결속' }, // Lifebind
      '370537': { koreanName: '정체' }, // Stasis
      '374227': { koreanName: '되감기' }, // Rewind (보존)
      '359816': { koreanName: '꿈의 숨결' }, // Dream Breath

      // 증강 (Augmentation)
      '395160': { koreanName: '칠흑의 힘' }, // Ebon Might - 확인됨 (실제 ID 확인 필요)
      '404972': { koreanName: '분출' }, // Eruption - 확인됨
      '409311': { koreanName: '예지' }, // Prescience
      '403631': { koreanName: '영겁의 숨결' }, // Breath of Eons
      '396286': { koreanName: '대격변' }, // Upheaval
      '410256': { koreanName: '위상의 은총' }, // Aspects' Favor
      '404977': { koreanName: '시간 도약' }, // Time Skip
      '406732': { koreanName: '공간의 역설' }, // Spatial Paradox
      '403299': { koreanName: '뒤엉킨 실타래' }, // Interwoven Threads
      '395152': { koreanName: '운명의 거울' }, // Fate Mirror
      '360806': { koreanName: '타오르는 비늘' }, // Blistering Scales
      '443204': { koreanName: '대규모 분출' }, // Mass Eruption

      // 공통 (Common)
      '358267': { koreanName: '부양' }, // Hover
      '363916': { koreanName: '흑요석 비늘' }, // Obsidian Scales
      '374348': { koreanName: '소생의 화염' }, // Renewing Blaze
      '364342': { koreanName: '청동용의 축복' }, // Blessing of the Bronze
      '357214': { koreanName: '날개 치기' }, // Wing Buffet
      '374251': { koreanName: '소작의 불꽃' }, // Cauterizing Flame
      '360995': { koreanName: '신록의 품' }, // Verdant Embrace
      '351338': { koreanName: '진압' }, // Quell
      '365585': { koreanName: '제거' }, // Expunge
      '370665': { koreanName: '구조' }, // Rescue
      '360823': { koreanName: '자연화' }, // Naturalize
      '378441': { koreanName: '시간의 나선' }, // Time Spiral
      '378464': { koreanName: '서풍' }, // Zephyr
      '370553': { koreanName: '균형 붕괴' }, // Tip the Scales
    };

    // 4. 데이터베이스 업데이트
    let updateCount = 0;
    let notFoundCount = 0;
    const notFoundSkills = [];

    for (const [skillId, updates] of Object.entries(evokerSkillUpdates)) {
      if (database[skillId]) {
        // 기존 스킬 업데이트
        const before = database[skillId].koreanName;
        database[skillId].koreanName = updates.koreanName;

        if (before !== updates.koreanName) {
          console.log(`✅ ${skillId}: ${before} → ${updates.koreanName}`);
          updateCount++;
        }
      } else {
        // 스킬이 데이터베이스에 없는 경우
        notFoundSkills.push(skillId);
        notFoundCount++;
      }
    }

    if (notFoundSkills.length > 0) {
      console.log(`\n⚠️ 데이터베이스에 없는 스킬 ID: ${notFoundSkills.join(', ')}`);
    }

    // 5. 업데이트된 데이터베이스 저장
    const outputPath = path.join(__dirname, 'tww-s3-refined-database-evoker-updated.json');
    await fs.writeFile(outputPath, JSON.stringify(database, null, 2));

    console.log(`\n📊 업데이트 통계:`);
    console.log(`- 업데이트된 스킬: ${updateCount}개`);
    console.log(`- 찾을 수 없는 스킬: ${notFoundCount}개`);
    console.log(`- 저장 위치: ${outputPath}`);

    // 6. 원본 파일 백업
    const backupPath = path.join(__dirname, `tww-s3-refined-database-backup-${Date.now()}.json`);
    await fs.copyFile(dbPath, backupPath);
    console.log(`\n📦 원본 파일 백업: ${backupPath}`);

    // 7. 원본 파일 교체 (주의: 확인 후 실행)
    // await fs.copyFile(outputPath, dbPath);
    // console.log('✅ 원본 데이터베이스 업데이트 완료!');

    return { updateCount, notFoundCount, notFoundSkills };

  } catch (error) {
    console.error('❌ 업데이트 실패:', error);
    throw error;
  }
}

// 실행
if (require.main === module) {
  updateEvokerDatabase()
    .then(result => {
      console.log('\n✨ 기원사 데이터베이스 업데이트 완료!');
      process.exit(0);
    })
    .catch(err => {
      console.error('Fatal error:', err);
      process.exit(1);
    });
}

module.exports = { updateEvokerDatabase };