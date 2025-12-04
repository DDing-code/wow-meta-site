/**
 * Wowhead 아이콘 매핑 유틸리티
 * Wowhead Tooltip API를 사용하여 스킬 아이콘을 조회합니다.
 * 
 * 사용법:
 *   node scripts/wowhead-icon-mapper.js <spellId>
 *   node scripts/wowhead-icon-mapper.js 204596 198013 188499
 * 
 * API 엔드포인트: https://nether.wowhead.com/tooltip/spell/{spellId}?dataEnv=1&locale=0
 */

const https = require('https');

// Wowhead CDN URL 템플릿
const WOWHEAD_ICON_CDN = 'https://wow.zamimg.com/images/wow/icons';

/**
 * Wowhead API에서 스킬 아이콘 정보를 가져옵니다.
 * @param {number|string} spellId - 스킬 ID
 * @returns {Promise<{spellId: number, icon: string, name: string, iconUrl: string}>}
 */
function fetchSpellIcon(spellId) {
  return new Promise((resolve, reject) => {
    const url = `https://nether.wowhead.com/tooltip/spell/${spellId}?dataEnv=1&locale=0`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({
            spellId: parseInt(spellId, 10),
            icon: json.icon || null,
            name: json.name || null,
            iconUrl: json.icon ? `${WOWHEAD_ICON_CDN}/large/${json.icon}.jpg` : null
          });
        } catch (err) {
          reject(new Error(`Failed to parse response for spell ${spellId}: ${err.message}`));
        }
      });
    }).on('error', reject);
  });
}

/**
 * 여러 스킬의 아이콘 정보를 일괄 조회합니다.
 * @param {Array<number|string>} spellIds - 스킬 ID 배열
 * @param {number} delay - 요청 간 딜레이 (ms)
 * @returns {Promise<Array>}
 */
async function fetchMultipleSpellIcons(spellIds, delay = 200) {
  const results = [];
  
  for (const spellId of spellIds) {
    try {
      const result = await fetchSpellIcon(spellId);
      results.push(result);
      console.log(`✓ ${spellId}: ${result.icon || 'NOT FOUND'}`);
    } catch (err) {
      console.error(`✗ ${spellId}: ${err.message}`);
      results.push({ spellId: parseInt(spellId, 10), icon: null, name: null, error: err.message });
    }
    
    // Rate limiting
    if (delay > 0) {
      await new Promise(r => setTimeout(r, delay));
    }
  }
  
  return results;
}

/**
 * JavaScript 객체 형식으로 매핑 코드를 생성합니다.
 * @param {Array} results - fetchMultipleSpellIcons 결과
 * @returns {string}
 */
function generateMappingCode(results) {
  const lines = results
    .filter(r => r.icon)
    .map(r => `  ${r.spellId}: "${r.icon}",  // ${r.name || 'Unknown'}`);
  
  return `// Wowhead API 검증 아이콘 매핑 (${new Date().toISOString().split('T')[0]})
const spellIdToIcon = {
${lines.join('\n')}
};

module.exports = spellIdToIcon;`;
}

/**
 * 아이콘 URL을 생성합니다.
 * @param {string} iconName - 아이콘 파일명 (확장자 제외)
 * @param {string} size - 'small' | 'medium' | 'large'
 * @returns {string}
 */
function getIconUrl(iconName, size = 'large') {
  return `${WOWHEAD_ICON_CDN}/${size}/${iconName}.jpg`;
}

// CLI 실행
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node wowhead-icon-mapper.js <spellId> [spellId2] [spellId3] ...');
    console.log('Example: node wowhead-icon-mapper.js 204596 198013 188499');
    process.exit(1);
  }
  
  console.log(`\n📡 Fetching icons for ${args.length} spell(s)...\n`);
  
  fetchMultipleSpellIcons(args)
    .then(results => {
      console.log('\n--- Results ---\n');
      console.log(generateMappingCode(results));
      
      // 실패한 항목 표시
      const failed = results.filter(r => !r.icon);
      if (failed.length > 0) {
        console.log('\n⚠️  Failed to fetch:');
        failed.forEach(f => console.log(`  - ${f.spellId}: ${f.error || 'Unknown error'}`));
      }
    })
    .catch(err => {
      console.error('Fatal error:', err);
      process.exit(1);
    });
}

module.exports = {
  fetchSpellIcon,
  fetchMultipleSpellIcons,
  generateMappingCode,
  getIconUrl,
  WOWHEAD_ICON_CDN
};
