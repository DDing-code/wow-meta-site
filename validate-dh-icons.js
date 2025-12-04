const https = require('https');

// 검증할 악마사냥꾼 스킬들
const dhSkills = [
  { id: 204596, name: '불꽃의 인장', currentIcon: 'ability_demonhunter_sigilofinquisition' },
  { id: 258860, name: '정수 파쇄', currentIcon: 'spell_shadow_ritualofsacrifice' },
  { id: 442688, name: '전투의 전율', currentIcon: 'spell_nature_bloodlust' },
  { id: 442624, name: '파괴자의 징표', currentIcon: 'ability_demonhunter_hatefulstrike' },
  { id: 442294, name: '파괴자의 글레이브', currentIcon: 'inv_glaive_1h_artifactaldrochi_d_03dual' },
  { id: 444806, name: '알드라치의 격노', currentIcon: 'inv_glaive_1h_artifactaldrochi_d_02dual' },
  { id: 452402, name: '악마쇄도', currentIcon: 'ability_demonhunter_metamorphasisdps' },
  { id: 162794, name: '혼돈의 일격', currentIcon: 'ability_demonhunter_chaosstrike' },
  { id: 188499, name: '칼춤', currentIcon: 'ability_demonhunter_bladedance' },
  { id: 198013, name: '안광', currentIcon: 'ability_demonhunter_eyebeam' },
  { id: 191427, name: '탈태', currentIcon: 'ability_demonhunter_metamorphasisdps' },
  { id: 210152, name: '죽음의 휩쓸기', currentIcon: 'inv_glaive_1h_artifactaldrochi_d_02dual' },
  { id: 258920, name: '제물의 오라', currentIcon: 'ability_demonhunter_immolation' },
  { id: 232893, name: '지옥칼', currentIcon: 'ability_demonhunter_felblade' },
  { id: 195072, name: '지옥 돌진', currentIcon: 'ability_demonhunter_felrush' },
  { id: 198793, name: '복수의 퇴각', currentIcon: 'ability_demonhunter_vengefulretreat2' },
  { id: 323639, name: '사냥', currentIcon: 'ability_ardenweald_demonhunter' },
  { id: 162243, name: '악마의 이빨', currentIcon: 'ability_demonhunter_demonsbite' },
  { id: 185123, name: '글레이브 투척', currentIcon: 'ability_demonhunter_throwglaive' },
  { id: 201427, name: '파멸', currentIcon: 'ability_demonhunter_chaosstrike' },
];

// 아이콘 CDN에서 이미지 존재 여부 확인
function checkIconExists(iconName) {
  return new Promise((resolve) => {
    const url = `https://wow.zamimg.com/images/wow/icons/medium/${iconName}.jpg`;
    
    https.get(url, (res) => {
      resolve({
        icon: iconName,
        exists: res.statusCode === 200,
        status: res.statusCode
      });
    }).on('error', (err) => {
      resolve({
        icon: iconName,
        exists: false,
        error: err.message
      });
    });
  });
}

// Wowhead에서 스펠 정보 가져오기
function fetchWowheadSpell(spellId) {
  return new Promise((resolve) => {
    const url = `https://www.wowhead.com/tooltip/spell/${spellId}`;
    
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          // tooltip에서 아이콘 이름 추출
          const iconMatch = data.match(/icon":"([^"]+)"/);
          resolve({
            spellId,
            icon: iconMatch ? iconMatch[1] : null,
            raw: json
          });
        } catch (e) {
          // HTML 응답에서 아이콘 추출 시도
          const iconMatch = data.match(/Icon\.create\('([^']+)'/);
          resolve({
            spellId,
            icon: iconMatch ? iconMatch[1] : null,
            raw: data.substring(0, 500)
          });
        }
      });
    }).on('error', (err) => {
      resolve({
        spellId,
        error: err.message
      });
    });
  });
}

async function main() {
  console.log('=== 악마사냥꾼 아이콘 검증 ===\n');
  
  const results = [];
  
  for (const skill of dhSkills) {
    // 1. 현재 아이콘이 CDN에 있는지 확인
    const iconCheck = await checkIconExists(skill.currentIcon);
    
    // 2. Wowhead에서 실제 아이콘 가져오기
    const wowheadData = await fetchWowheadSpell(skill.id);
    
    const result = {
      id: skill.id,
      name: skill.name,
      currentIcon: skill.currentIcon,
      currentIconExists: iconCheck.exists,
      wowheadIcon: wowheadData.icon,
      needsUpdate: !iconCheck.exists || (wowheadData.icon && wowheadData.icon !== skill.currentIcon)
    };
    
    results.push(result);
    
    const status = iconCheck.exists ? '✅' : '❌';
    const wowheadStatus = wowheadData.icon ? `→ Wowhead: ${wowheadData.icon}` : '';
    console.log(`${status} ${skill.id}: ${skill.name}`);
    console.log(`   현재: ${skill.currentIcon}`);
    if (wowheadData.icon && wowheadData.icon !== skill.currentIcon) {
      console.log(`   ⚠️ Wowhead: ${wowheadData.icon}`);
    }
    console.log('');
    
    // 요청 간 딜레이
    await new Promise(r => setTimeout(r, 300));
  }
  
  // 결과 저장
  const fs = require('fs');
  fs.writeFileSync('dh-icon-validation-result.json', JSON.stringify(results, null, 2));
  
  console.log('\n=== 요약 ===');
  const broken = results.filter(r => !r.currentIconExists);
  const mismatch = results.filter(r => r.wowheadIcon && r.wowheadIcon !== r.currentIcon);
  
  console.log(`총 스킬: ${results.length}개`);
  console.log(`깨진 아이콘: ${broken.length}개`);
  console.log(`Wowhead와 불일치: ${mismatch.length}개`);
  
  if (broken.length > 0) {
    console.log('\n=== 깨진 아이콘 ===');
    broken.forEach(r => console.log(`- ${r.name}: ${r.currentIcon}`));
  }
  
  if (mismatch.length > 0) {
    console.log('\n=== 수정 필요 ===');
    mismatch.forEach(r => console.log(`- ${r.name}: ${r.currentIcon} → ${r.wowheadIcon}`));
  }
}

main().catch(console.error);
