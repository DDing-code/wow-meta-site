/**
 * skill-parser.js
 * KB 스킬 원자 노트 파싱
 * 
 * 📌 참조: WoW-Meta-Knowledge/99-META/Skill-DB-Schema.md
 */

const fs = require('fs');
const path = require('path');

/**
 * YAML frontmatter 파싱
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { frontmatter: {}, body: content };
  
  const yaml = match[1];
  const body = content.slice(match[0].length).trim();
  
  const frontmatter = {};
  const lines = yaml.split('\n');
  let currentKey = null;
  let inArray = false;
  let inNestedObject = false;
  let nestedKey = null;
  let nestedObj = {};
  
  for (const line of lines) {
    // 주석 무시
    if (line.trim().startsWith('#')) continue;
    if (line.trim() === '') continue;
    
    // 중첩 객체 내부 처리 (synergy 등)
    if (inNestedObject) {
      // 중첩 객체 종료 감지 (들여쓰기 없는 새 키)
      if (!line.startsWith(' ') && !line.startsWith('\t') && line.includes(':')) {
        frontmatter[currentKey] = nestedObj;
        inNestedObject = false;
        nestedObj = {};
      }
    }
    
    // 배열 아이템
    if (line.match(/^\s+-\s+/)) {
      const value = line.replace(/^\s+-\s+/, '').trim().replace(/^["']|["']$/g, '');
      if (inArray && currentKey) {
        if (typeof frontmatter[currentKey] === 'object' && !Array.isArray(frontmatter[currentKey])) {
          // 중첩 객체 내 배열
          if (nestedKey && Array.isArray(nestedObj[nestedKey])) {
            // id/effect 형태 파싱
            if (value.startsWith('id:')) {
              nestedObj[nestedKey].push({ id: value.replace('id:', '').trim().replace(/^["']|["']$/g, '') });
            } else {
              nestedObj[nestedKey].push(value);
            }
          }
        } else {
          frontmatter[currentKey].push(value);
        }
      }
      continue;
    }
    
    // 키: 값 쌍
    const kvMatch = line.match(/^(\s*)(\w+):\s*(.*)$/);
    if (kvMatch) {
      const indent = kvMatch[1].length;
      const key = kvMatch[2];
      let value = kvMatch[3].trim();
      
      // 최상위 키
      if (indent === 0) {
        currentKey = key;
        inNestedObject = false;
        
        // 빈 값 = 객체 또는 배열 시작
        if (value === '' || value === '[]' || value === '{}') {
          if (value === '{}' || key === 'synergy') {
            frontmatter[key] = {};
            inNestedObject = true;
            nestedObj = {};
          } else {
            frontmatter[key] = [];
            inArray = true;
          }
          continue;
        }
        
        inArray = false;
      } else if (indent > 0 && inNestedObject) {
        // 중첩 키
        nestedKey = key;
        if (value === '' || value === '[]') {
          nestedObj[key] = [];
          inArray = true;
        } else {
          nestedObj[key] = parseValue(value);
        }
        continue;
      }
      
      // 인라인 배열 [a, b, c]
      if (value.startsWith('[') && value.endsWith(']')) {
        frontmatter[key] = value
          .slice(1, -1)
          .split(',')
          .map(v => v.trim().replace(/^["']|["']$/g, ''))
          .filter(v => v);
        inArray = false;
        continue;
      }
      
      frontmatter[key] = parseValue(value);
      inArray = false;
    }
  }
  
  // 마지막 중첩 객체 저장
  if (inNestedObject && currentKey) {
    frontmatter[currentKey] = nestedObj;
  }
  
  return { frontmatter, body };
}

/**
 * 값 파싱 헬퍼
 */
function parseValue(value) {
  if (value === 'null' || value === '~') return null;
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (/^\d+$/.test(value)) return parseInt(value, 10);
  if (/^\d+\.\d+$/.test(value)) return parseFloat(value);
  return value.replace(/^["']|["']$/g, '');
}

/**
 * 스킬 노트 파싱
 * @param {string} filePath - 마크다운 파일 경로
 * @returns {Object} 파싱된 스킬 객체
 */
function parseSkillNote(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { frontmatter, body } = parseFrontmatter(content);
  
  // 필수 필드 검증
  if (!frontmatter.id) {
    throw new Error(`필수 필드 누락: id`);
  }
  if (!frontmatter.name_kr) {
    throw new Error(`필수 필드 누락: name_kr`);
  }
  
  // 스킬 객체 구성
  const skill = {
    // 기본 정보
    id: String(frontmatter.id),
    name_kr: frontmatter.name_kr,
    name_en: frontmatter.name_en || null,
    icon: frontmatter.icon || 'inv_misc_questionmark',
    
    // 직업/전문화
    class: frontmatter.class || null,
    specs: frontmatter.specs || (frontmatter.spec ? [frontmatter.spec] : []),
    skill_type: frontmatter.skill_type || frontmatter.type || 'baseline',
    hero_talent: frontmatter.hero_talent || null,
    
    // 전투 정보
    cast_time: frontmatter.cast_time || '즉시',
    cooldown: frontmatter.cooldown || '없음',
    charges: frontmatter.charges || 1,
    gcd: frontmatter.gcd !== false,
    resource_cost: frontmatter.resource_cost || '없음',
    resource_gain: frontmatter.resource_gain || null,
    range: frontmatter.range || '근접',
    duration: frontmatter.duration || null,
    
    // 효과 정보
    damage_type: frontmatter.damage_type || null,
    target_type: frontmatter.target_type || null,
    effect_summary: frontmatter.effect_summary || null,
    
    // 시너지 (있으면)
    synergy: frontmatter.synergy || null,
    
    // 태그
    tags: frontmatter.tags || [],
    
    // 메타
    patch: frontmatter.patch || '11.2.5',
    source: frontmatter.source || null,
    wowhead_url: `https://www.wowhead.com/spell=${frontmatter.id}`,
    
    // 본문에서 추출한 설명 (첫 번째 인용문)
    description: extractDescription(body),
  };
  
  return skill;
}

/**
 * 마크다운 본문에서 설명 추출
 */
function extractDescription(body) {
  // > 로 시작하는 인용문 찾기
  const quoteMatch = body.match(/^>\s*(.+)$/m);
  if (quoteMatch) {
    return quoteMatch[1].replace(/\*\*/g, '').trim();
  }
  return null;
}

module.exports = {
  parseSkillNote,
  parseFrontmatter,
};
