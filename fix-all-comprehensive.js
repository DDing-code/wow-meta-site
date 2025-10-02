const fs = require('fs');
const path = require('path');

// 포괄적인 수정 스크립트
const dbPath = path.join(__dirname, 'src/data/koreanSpellDatabase.js');
let content = fs.readFileSync(dbPath, 'utf8');

// 스킬명 기반 클래스 매핑
const nameToClass = {
  "성스러운|치유|신의 권능|정화|소생|회복|신성|빛의|축복|정신|암흑": "PRIEST",
  "돌진|방패|복수|전쟁|사기|방어 태세|영웅의|주문 반사|칼날폭풍|천둥|압도": "WARRIOR",
  "죽음의|룬|서리|부정|피의|얼음|대마법|어둠|시체|역병|죽음과 부패": "DEATHKNIGHT",
  "은신|그림자|절개|독|암살|잠행|소매치기|매복|연막|도적": "ROGUE",
  "신성한|응징|성전사|심판|보호의|자유의|천상의|정의|빛의 망치|신의 축복": "PALADIN",
  "화염|냉기|비전|얼음|변이|마법|점멸|환기|시간|불기둥": "MAGE",
  "악마|지옥|영혼|저주|부패|공포|제물|어둠|혼돈|파괴": "WARLOCK",
  "야생|변신|회복|자연|태양|달|별|나무|곰|표범|까마귀": "DRUID",
  "토템|번개|용암|대지|정령|치유의|폭풍|원소|선조|늑대": "SHAMAN",
  "야수|사냥|조준|생존|덫|추적|표식|독사|살상|탄막": "HUNTER",
  "악마 사냥꾼|복수|혼돈|지옥|글레이브|악마 변신|마법 소모|눈보라": "DEMONHUNTER",
  "호랑이|학다리|양조|옥룡|기|명상|구르기|비취|소생의 안개": "MONK",
  "용족|숨결|비상|시간|청동|붉은|푸른|검은|황동|영원": "EVOKER"
};

let stats = {
  iconFixed: 0,
  classFixed: 0,
  typeFixed: 0
};

// 모든 스킬 순회하여 수정
const skillRegex = /"(\d+)":\s*{([^}]+)}/g;
let matches;

while ((matches = skillRegex.exec(content)) !== null) {
  const id = matches[1];
  let skillContent = matches[2];
  const originalLength = skillContent.length;

  // 1. icon 필드 확인 및 추가
  if (!skillContent.includes('"icon"') && !skillContent.includes('"iconName"')) {
    // 기본 아이콘 추가
    const nameMatch = skillContent.match(/"koreanName":\s*"([^"]+)"/);
    if (nameMatch) {
      skillContent = skillContent.replace(
        /"koreanName":\s*"([^"]+)"/,
        '"koreanName": "$1",\n    "icon": "inv_misc_questionmark"'
      );
      stats.iconFixed++;
    }
  }

  // 2. class 필드 확인 및 추가
  if (!skillContent.includes('"class"')) {
    const nameMatch = skillContent.match(/"koreanName":\s*"([^"]+)"/);
    if (nameMatch) {
      const skillName = nameMatch[1];
      let foundClass = "UNKNOWN";

      // 이름에서 클래스 추측
      for (const [pattern, className] of Object.entries(nameToClass)) {
        const regex = new RegExp(pattern, 'i');
        if (regex.test(skillName)) {
          foundClass = className;
          break;
        }
      }

      // class 필드 추가
      skillContent = skillContent.replace(
        /"koreanName":\s*"([^"]+)"/,
        '"koreanName": "$1",\n    "class": "' + foundClass + '"'
      );
      stats.classFixed++;
    }
  }

  // 3. type 필드 확인 및 추가
  if (!skillContent.includes('"type"')) {
    // 기본값은 active로 설정
    const type = skillContent.includes('지속효과') ? 'passive' : 'active';
    skillContent = skillContent.replace(
      /"koreanName":\s*"([^"]+)"/,
      '"koreanName": "$1",\n    "type": "' + type + '"'
    );
    stats.typeFixed++;
  }

  // 변경사항이 있으면 content 업데이트
  if (skillContent.length !== originalLength) {
    const newSkillBlock = `"${id}": {${skillContent}}`;
    const oldSkillBlock = `"${id}": {${matches[2]}}`;
    content = content.replace(oldSkillBlock, newSkillBlock);
  }
}

// 구문 오류 수정
content = content.replace(/,\s*,/g, ','); // 중복 쉼표 제거
content = content.replace(/}\s*"/g, '},\n  "'); // 객체 사이 쉼표 추가
content = content.replace(/,\s*}/g, '\n  }'); // 마지막 쉼표 제거

// 파일 저장
fs.writeFileSync(dbPath, content, 'utf8');

console.log('✅ 포괄적 수정 완료!');
console.log(`  - 아이콘 추가: ${stats.iconFixed}개`);
console.log(`  - 클래스 추가: ${stats.classFixed}개`);
console.log(`  - 타입 추가: ${stats.typeFixed}개`);