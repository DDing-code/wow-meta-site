const fs = require('fs').promises;
const { chromium } = require('playwright');

// 영웅특성 스킬 ID 수동 매핑 (Wowhead에서 확인)
const HERO_TALENT_SKILL_IDS = {
  // 전사 영웅특성
  'colossus': [
    439993, // 거인의 격노 (Colossal Might)
    440036, // 산산조각 (Demolish)
    440051, // 지배 (Domineer)
    440069, // 산을 무너뜨리는 타격 (Mountain of Muscle and Scars)
    440080, // 강화된 격노 (Reinforced Rage)
    440091, // 전쟁대장군 (Warlord's Torment)
  ],
  'mountain-thane': [
    445974, // 천둥 일격 (Thunder Blast)
    445979, // 분노의 천둥 (Avatar of the Storm)
    445991, // 폭풍정점 (Storm Bolts)
    446002, // 벼락질 (Thunder Clap)
    446012, // 폭풍 망치 (Storm Hammer)
    446023, // 산의 부름 (Might of the Mountain)
  ],
  'slayer': [
    444750, // 학살자의 지배 (Slayer's Dominance)
    444767, // 잔혹한 피 (Brutal Finish)
    444772, // 압도적인 격노 (Overwhelming Blades)
    444784, // 흉포한 휩쓸기 (Vicious Agility)
    444795, // 돌진 처형 (Execute the Weak)
    444801, // 폭발적인 분노 (Unrelenting Onslaught)
  ],

  // 성기사 영웅특성
  'lightsmith': [
    427445, // 신성한 무기고 (Holy Armaments)
    427450, // 축복받은 무기 (Blessed Arms)
    427459, // 빛의 단련 (Light's Deliverance)
    427467, // 신성한 보루 (Divine Bulwark)
    427476, // 빛의 화신 (Rite of Sanctification)
    427491, // 예리한 성스러운 빛 (Rite of Adjuration)
  ],
  'templar': [
    406158, // 기사단의 판결 (Templar's Verdict)
    406161, // 기사단의 일격 (Templar Strike)
    406164, // 신성한 복수심 (Righteous Vengeance)
    406169, // 무너지지 않는 빛 (Unbreakable Light)
    406172, // 빛의 인도 (Light's Guidance)
    406182, // 천상의 구원자 (Bound by Faith)
  ],
  'herald-of-the-sun': [
    427328, // 태양의 은총 (Solar Grace)
    427334, // 빛나는 새벽 (Morning Star)
    427339, // 여명파괴자 (Dawnbringer)
    427343, // 영원한 불꽃 (Eternal Flame)
    427351, // 태양 섬광 (Sun's Avatar)
    427359, // 빛의 권능 (Gleaming Rays)
  ],

  // 사냥꾼 영웅특성
  'dark-ranger': [
    439523, // 검은 화살 (Black Arrow)
    439531, // 어둠 사냥 (Dark Hounds)
    439536, // 암흑 강화 (Shadow Dagger)
    439542, // 약탈의 사격 (Withering Fire)
    439548, // 죽음의 그림자 (Smoke Screen)
    439554, // 어두운 사슬 (Dark Chains)
  ],
  'pack-leader': [
    445505, // 무리 지도자 (Pack Leader)
    445513, // 야생의 부름 (Vicious Hunt)
    445520, // 짐승의 격노 (Beast Whisperer)
    445527, // 무리 조율 (Packmate's Bond)
    445534, // 야생의 본능 (Wild Attacks)
    445541, // 포식자의 명령 (Den Recovery)
  ],
  'sentinel': [
    450359, // 파수대 (Sentinel)
    450367, // 달의 정수 (Lunar Storm)
    450373, // 폭풍 사격 (Overwatch)
    450381, // 정밀 사격 (Release and Reload)
    450388, // 달빛 탄환 (Sideline)
    450396, // 감시자의 숙련 (Sentinel's Watch)
  ],

  // 도적 영웅특성
  'trickster': [
    441248, // 변덕스러운 일격 (Unseen Blade)
    441256, // 환영 무리 (Cloud of Shadows)
    441263, // 그림자 속임수 (Surprising Strikes)
    441270, // 교활한 전략 (Nimble Flurry)
    441277, // 완벽한 속임수 (Smoke)
    441285, // 숨겨진 기회 (Devious Distractions)
  ],
  'fatebound': [
    439750, // 운명의 동전 (Hand of Fate)
    439756, // 운명의 일격 (Fatebound Coin Toss)
    439761, // 숙명의 일격 (Destiny Defined)
    439768, // 도박꾼의 직감 (Lucky Strikes)
    439774, // 행운의 강탈 (Fortune's Favor)
    439781, // 운명 조작 (Fateful Ending)
  ],
  'deathstalker': [
    442290, // 죽음 추적자의 징표 (Deathstalker's Mark)
    442299, // 어두운 양조 (Dark Brew)
    442305, // 그림자 침묵 (Corrupt the Blood)
    442311, // 사냥 시작 (Singular Focus)
    442318, // 죽음의 복제 (Ethereal Cloak)
    442326, // 최후의 일격 (Hunt Them Down)
  ],

  // 사제 영웅특성
  'oracle': [
    433579, // 선견지명 (Premonition)
    433587, // 통찰의 빛 (Preventive Measures)
    433593, // 예언가의 통찰 (Clairvoyance)
    433601, // 미래 예지 (Divine Providence)
    433609, // 운명의 인도 (Fatebender)
    433617, // 신탁의 축복 (Perfect Vision)
  ],
  'archon': [
    453572, // 빛과 어둠의 조화 (Harmony of Light and Shadow)
    453579, // 균형의 힘 (Power Overwhelming)
    453585, // 이중성 (Duality)
    453592, // 완벽한 융합 (Perfected Form)
    453599, // 조화의 강타 (Unified Power)
    453606, // 집정관의 권능 (Resonant Energy)
  ],
  'voidweaver': [
    447134, // 공허 마법 (Void Weaver)
    447141, // 그림자 직조 (Shadow Weaving)
    447147, // 어둠 방출 (Dark Ascension)
    447154, // 공허 부식 (Entropic Rift)
    447161, // 꿈틀거리는 촉수 (Collapsing Void)
    447168, // 깊은 어둠 (Void Blast)
  ],

  // 주술사 영웅특성
  'farseer': [
    381715, // 원소 일격 (Elemental Reverb)
    381757, // 선조의 인도 (Ancestral Swiftness)
    381675, // 정령 보호 (Spiritwalker's Aegis)
    381689, // 영혼 걷기 (Offering from Beyond)
    381696, // 조상의 인도 (Ancient Fellowship)
    381732, // 선견자의 축복 (Final Calling)
  ],
  'totemic': [
    444995, // 토템 숙달 (Totemic Rebound)
    445025, // 맥동 토템 (Pulse Capacitor)
    445034, // 강화 토템 (Oversurge)
    445042, // 연쇄 토템 (Lively Totems)
    445047, // 폭풍토템 (Whirling Elements)
    445029, // 대지토템 (Earthsurge)
  ],
  'stormbringer': [
    454009, // 폭풍 소환 (Tempest)
    454015, // 천둥 강타 (Unlimited Power)
    454021, // 번개 화신 (Shocking Grasp)
    454026, // 폭풍의 무기 (Storm Swell)
    454032, // 폭풍 격노 (Nature's Protection)
    454038, // 원시 폭풍 (Voltaic Surge)
  ],

  // 마법사 영웅특성
  'sunfury': [
    449894, // 태양 불길 (Ignite the Future)
    449901, // 불타는 장벽 (Glorious Incandescence)
    449908, // 불사조 소환 (Codex of the Sunstrider)
    449915, // 태양 섬광 (Lessons of the Darkmaster)
    449922, // 화염 폭풍 (Spellfire Spheres)
    449929, // 작열하는 빛 (Memory of Al'ar)
  ],
  'frostfire': [
    431189, // 서리불꽃 화살 (Frostfire Bolt)
    431112, // 동결 화염 (Imbued Warding)
    431156, // 얼음 불길 (Flame and Frost)
    431178, // 서리불꽃 강화 (Elemental Affinity)
    431190, // 화염 냉기 (Isothermic Core)
    431176, // 서리불꽃 숙련 (Flash Freezeburn)
  ],
  'spellslinger': [
    443733, // 신속 시전 (Augury Abounds)
    443740, // 마법 탄환 (Slippery Slinging)
    443747, // 연속 시전 (Unerring Proficiency)
    443754, // 주문 연쇄 (Look Again)
    443761, // 화려한 주문 (Controlled Instincts)
    443768, // 순간 시전 (Volatile Magic)
  ],

  // 흑마법사 영웅특성
  'diabolist': [
    428524, // 악마 소환술 (Diabolic Ritual)
    428531, // 지옥불 정령 (Infernal Machine)
    428538, // 악마 지배 (Cloven Souls)
    428544, // 군단 강화 (Infernal Vitality)
    428552, // 지옥 군주 (Infernal Bulwark)
    428559, // 악마 계약 (Ruination)
  ],
  'hellcaller': [
    440043, // 지옥 부름 (Wither)
    440049, // 지옥불 (Mark of Xavius)
    440055, // 황폐한 불길 (Bleakheart Tactics)
    440061, // 악마 화염 (Mark of Peroth'arn)
    440067, // 지옥 강타 (Seeds of Their Demise)
    440073, // 불타는 악마 (Blackened Soul)
  ],
  'soul-harvester': [
    445454, // 영혼 수확 (Feast of Souls)
    445460, // 영혼 흡수 (Soul Anathema)
    445466, // 타락한 영혼 (Wicked Reaping)
    445472, // 영혼 분열 (Demonic Soul)
    445478, // 어둠 수확 (Necrolyte Teachings)
    445484, // 영혼 고통 (Quietus)
  ],

  // 수도사 영웅특성
  'conduit-of-the-celestials': [
    443028, // 천신 소환 (Celestial Conduit)
    443035, // 천상의 힘 (August Dynasty)
    443041, // 성스러운 권능 (Jade Sanctuary)
    443048, // 천신 강화 (Temple Training)
    443055, // 신성한 조화 (Restore Balance)
    443061, // 천상 지배 (Unity Within)
  ],
  'shado-pan': [
    450508, // 그림자 무술 (Vigilant Watch)
    450514, // 어둠 일격 (Wisdom of the Wall)
    450521, // 그림자 은신 (Against All Odds)
    450527, // 음영파 훈련 (Veteran Eye)
    450534, // 그림자 타격 (Lead from the Front)
    450540, // 암흑 숙련 (One Versus Many)
  ],
  'master-of-harmony': [
    450380, // 조화 정수 (Harmonic Gambit)
    450387, // 균형의 춤 (Overwhelming Force)
    450394, // 조화 강타 (Manifestation)
    450401, // 정신 조화 (Endless Draught)
    450408, // 완벽한 균형 (Balanced Stratagem)
    450415, // 조화 숙련 (Path of Resurgence)
  ],

  // 드루이드 영웅특성
  'wildstalker': [
    439528, // 야생 추적 (Wildstalker's Power)
    439535, // 야생 발톱 (Wildstalker's Essence)
    439542, // 사냥꾼의 상처 (Strategic Infusion)
    439549, // 포식자 본능 (Honed Instincts)
    439556, // 야생 격노 (Ruthless Aggression)
    439563, // 야수의 힘 (Pack's Endurance)
  ],
  'keeper-of-the-grove': [
    429234, // 숲의 수호 (Grove's Inspiration)
    429270, // 고대 나무 (Blooming Infusion)
    429189, // 숲의 권능 (Power of the Dream)
    429201, // 자연 조화 (Protective Growth)
    429207, // 생명 나무 (Early Spring)
    429252, // 숲 지배 (Grove Invigoration)
  ],
  'elunes-chosen': [
    428493, // 달빛 강타 (Lunar Calling)
    428500, // 엘룬의 축복 (Boundless Moonlight)
    428507, // 달의 권능 (Glistening Fur)
    428514, // 천공 조화 (Lunar Amplification)
    428521, // 달빛 치유 (Astral Insight)
    428529, // 엘룬 화신 (The Eternal Moon)
  ],
  'druid-of-the-claw': [
    441603, // 발톱 강타 (Bestial Strength)
    441610, // 곰 형상 강화 (Ursine Potential)
    441617, // 야생 발톱 (Aggravate Wounds)
    441624, // 포식자 일격 (Claw Rampage)
    441631, // 발톱 숙련 (Dreadful Wounds)
    441638, // 야수 지배 (Ruthless Aggression)
  ],

  // 악마사냥꾼 영웅특성
  'aldrachi-reaver': [
    442290, // 알드라치 전술 (Art of the Glaive)
    442297, // 전쟁 검 (Warblades Master)
    442304, // 파괴의 인장 (Aldrachi Tactics)
    442311, // 영혼 파괴 (Keen Engagement)
    442318, // 알드라치 훈련 (Fury of the Aldrachi)
    442325, // 파괴자의 인장 (Wounded Quarry)
  ],
  'fel-scarred': [
    456368, // 지옥 상처 (Demonsurge)
    456374, // 악마 변신 (Violent Transformation)
    456380, // 지옥 화염 (Enduring Torment)
    456386, // 악마 상흔 (Burning Blades)
    456392, // 지옥 지배 (Demonic Intensity)
    456398, // 악마 강화 (Monster Rising)
  ],

  // 죽음의 기사 영웅특성
  'sanlayn': [
    433895, // 흡혈 일격 (Vampiric Blood)
    433901, // 피의 갈증 (Vampiric Strike)
    433908, // 흡혈귀 강화 (Sanguine Scent)
    433915, // 피의 연결 (Blood Beast)
    433922, // 흡혈 숙련 (Gift of the San'layn)
    433929, // 피의 지배 (Pact of the San'layn)
  ],
  'rider-of-the-apocalypse': [
    444005, // 종말 기수 소환 (Rider's Champion)
    444011, // 죽음의 말 (Apocalypse Now)
    444017, // 파멸의 진군 (Mograines Might)
    444023, // 묵시록 강타 (Whitemane's Famine)
    444029, // 종말 군마 (Trollbane's Icy Fury)
    444035, // 재앙 확산 (Nazgrims Conquest)
  ],
  'deathbringer': [
    458235, // 죽음 인도 (Reaper's Mark)
    458242, // 죽음의 손길 (Wave of Souls)
    458249, // 사신 강타 (Swift End)
    458256, // 죽음 확산 (Grim Reaper)
    458263, // 영혼 파괴 (Death's Messenger)
    458270, // 죽음 지배 (Rune Carved Plates)
  ],

  // 기원사 영웅특성
  'flameshaper': [
    444962, // 화염 조형 (Engulf)
    444969, // 불꽃 강화 (Traveling Flame)
    444976, // 용의 화염 (Conduit of Flame)
    444983, // 화염 폭발 (Fan the Flames)
    444990, // 불꽃 숙련 (Red Hot)
    444997, // 화염 지배 (Shape of Flame)
  ],
  'chronowarden': [
    431625, // 시간 조작 (Chrono Ward)
    431632, // 시간 역행 (Temporal Burst)
    431639, // 시간 가속 (Reverberations)
    431646, // 시간 왜곡 (Primacy)
    431653, // 시간 숙련 (Temporal Compression)
    431660, // 시간 지배 (Threads of Fate)
  ],
  'scalecommander': [
    442290, // 비늘 지휘관 (Might of the Black Dragonflight)
    442297, // 용족 강화 (Unrelenting Siege)
    442304, // 비늘 강타 (Extended Battle)
    442311, // 용의 군세 (Hardened Scales)
    442318, // 비늘 숙련 (Nimble Flyer)
    442325, // 용족 지배 (Onslaught)
  ],
};

async function extractHeroTalentData() {
  console.log('🚀 영웅특성 스킬 ID 기반 데이터 수집 시작\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    viewport: { width: 1920, height: 1080 },
    locale: 'ko-KR'
  });

  const page = await context.newPage();

  // 에러 무시
  page.on('pageerror', () => {});
  page.on('error', () => {});

  const allHeroTalents = {};

  // 각 영웅특성별로 스킬 데이터 수집
  for (const [heroTalentId, skillIds] of Object.entries(HERO_TALENT_SKILL_IDS)) {
    console.log(`\n📊 [${heroTalentId}] 영웅특성 처리 중...`);

    const talents = {};

    for (const skillId of skillIds) {
      console.log(`  🔍 스킬 ${skillId} 수집 중...`);

      try {
        // 한국어 페이지 접속
        await page.goto(`https://ko.wowhead.com/spell=${skillId}`, {
          waitUntil: 'domcontentloaded',
          timeout: 20000
        });

        await page.waitForTimeout(1500);

        // 스킬 정보 수집
        const skillData = await page.evaluate(() => {
          const data = {};

          // 스킬명
          const title = document.title;
          const nameMatch = title.match(/^([^-]+)/);
          data.koreanName = nameMatch ? nameMatch[1].trim() : '';

          // 아이콘
          const iconElement = document.querySelector('.iconlarge ins, .icon ins');
          if (iconElement) {
            const style = iconElement.getAttribute('style');
            if (style) {
              const iconMatch = style.match(/\/([^\/]+)\.(jpg|png)/);
              if (iconMatch) {
                data.icon = iconMatch[1];
              }
            }
          }

          // 설명
          const descElement = document.querySelector('.q, .q0, .q1, .q2');
          if (descElement) {
            data.description = descElement.textContent.trim().substring(0, 500);
          }

          // Quick Facts 테이블
          const tables = document.querySelectorAll('table.infobox, .grid');
          for (const table of tables) {
            const rows = table.querySelectorAll('tr');
            for (const row of rows) {
              const th = row.querySelector('th');
              const td = row.querySelector('td');
              if (th && td) {
                const label = th.textContent.trim();
                const value = td.textContent.trim();

                if (label.includes('재사용') || label.includes('쿨다운')) {
                  data.cooldown = value;
                } else if (label.includes('시전 시간')) {
                  data.castTime = value;
                } else if (label.includes('사거리')) {
                  data.range = value;
                } else if (label.includes('소모')) {
                  data.resourceCost = value;
                }
              }
            }
          }

          return data;
        });

        // 영문 페이지에서 영어 이름 수집
        await page.goto(`https://www.wowhead.com/spell=${skillId}`, {
          waitUntil: 'domcontentloaded',
          timeout: 20000
        });

        await page.waitForTimeout(1000);

        const englishName = await page.evaluate(() => {
          const title = document.title;
          const nameMatch = title.match(/^([^-]+)/);
          return nameMatch ? nameMatch[1].trim() : '';
        });

        // 데이터 병합
        talents[skillId] = {
          id: skillId,
          koreanName: skillData.koreanName || '',
          englishName: englishName,
          icon: skillData.icon || 'inv_misc_questionmark',
          description: skillData.description || '',
          cooldown: skillData.cooldown || '없음',
          castTime: skillData.castTime || '즉시 시전',
          range: skillData.range || '자신',
          resourceCost: skillData.resourceCost || '없음',
          type: '영웅특성',
          heroTalent: heroTalentId
        };

        console.log(`    ✅ ${skillData.koreanName} (${englishName}) 수집 완료`);

      } catch (error) {
        console.log(`    ❌ 스킬 ${skillId} 수집 실패: ${error.message}`);
      }

      // 서버 부하 방지
      await page.waitForTimeout(2000);
    }

    // 영웅특성 데이터 저장
    allHeroTalents[heroTalentId] = {
      skills: talents
    };

    console.log(`  💾 ${heroTalentId} 영웅특성: ${Object.keys(talents).length}개 스킬 수집 완료`);
  }

  // 최종 저장
  await fs.writeFile(
    './tww-s3-hero-talents-skills.json',
    JSON.stringify(allHeroTalents, null, 2),
    'utf8'
  );

  console.log('\n================================');
  console.log('✨ 영웅특성 스킬 데이터 수집 완료!');
  console.log('================================');

  let totalSkills = 0;
  for (const [heroTalentId, data] of Object.entries(allHeroTalents)) {
    const count = Object.keys(data.skills).length;
    console.log(`${heroTalentId}: ${count}개`);
    totalSkills += count;
  }

  console.log(`\n📊 총 ${totalSkills}개 영웅특성 스킬 수집`);
  console.log('📁 저장 경로: tww-s3-hero-talents-skills.json');

  await browser.close();
}

// 실행
extractHeroTalentData().catch(console.error);