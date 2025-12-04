/**
 * priority-parser.js
 * KB 우선순위 노트 파싱
 * 
 * 📌 참조: WoW-Meta-Knowledge/99-META/Skill-DB-Schema.md
 */

const fs = require('fs');
const path = require('path');
const { parseFrontmatter } = require('./skill-parser');

/**
 * 마크다운 테이블 파싱
 */
function parseMarkdownTable(body) {
  const lines = body.split('\n');
  const tables = [];
  let currentTable = null;
  let headers = [];
  
  for (const line of lines) {
    // 테이블 헤더 감지
    if (line.includes('|') && !line.match(/^\|[-:]+\|/)) {
      const cells = line.split('|').map(c => c.trim()).filter(c => c);
      
      // 헤더 행 (# 스킬 조건 이유 등)
      if (cells.some(c => c === '#' || c === '스킬' || c === 'Skill')) {
        if (currentTable && currentTable.rows.length > 0) {
          tables.push(currentTable);
        }
        headers = cells;
        currentTable = { headers, rows: [] };
      } else if (currentTable && cells.length >= 2) {
        // 데이터 행
        const row = {};
        headers.forEach((h, i) => {
          row[h] = cells[i] || '';
        });
        currentTable.rows.push(row);
      }
    }
    
    // 구분선 무시
    if (line.match(/^\|[-:]+\|/)) continue;
  }
  
  if (currentTable && currentTable.rows.length > 0) {
    tables.push(currentTable);
  }
  
  return tables;
}

/**
 * 스킬 이름에서 [[]] 제거
 */
function cleanSkillName(name) {
  return name.replace(/\[\[|\]\]/g, '').trim();
}

/**
 * 우선순위 노트 파싱
 * @param {string} filePath - 마크다운 파일 경로
 * @returns {Object} 파싱된 우선순위 객체
 */
function parsePriorityNote(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { frontmatter, body } = parseFrontmatter(content);
  
  // 필수 필드 검증
  if (!frontmatter.class || !frontmatter.spec) {
    throw new Error('필수 필드 누락: class, spec');
  }
  
  // 파일명에서 정보 추출 (예: Aldrachi-ST-Priority.md)
  const fileName = path.basename(filePath, '.md');
  const parts = fileName.split('-');
  const heroTree = parts[0] || frontmatter.hero_talent;
  const situation = parts[1] || 'ST';
  
  // 테이블 파싱
  const tables = parseMarkdownTable(body);
  
  // 우선순위 테이블 찾기
  const priorityTable = tables.find(t => 
    t.headers.some(h => h === '#' || h.includes('순위') || h.includes('Priority'))
  );
  
  // 우선순위 항목 추출
  const priorities = [];
  if (priorityTable) {
    for (const row of priorityTable.rows) {
      const priority = parseInt(row['#'] || row['순위'] || priorities.length + 1, 10);
      const skillName = cleanSkillName(row['스킬'] || row['Skill'] || '');
      const condition = row['조건'] || row['Condition'] || '';
      const reason = row['이유'] || row['Reason'] || '';
      
      if (skillName) {
        priorities.push({
          priority,
          skillName,
          condition: condition || null,
          reason: reason || null,
        });
      }
    }
  }
  
  // 오프너 시퀀스 추출 (코드 블록에서)
  const openerMatch = body.match(/```[\s\S]*?((?:파괴자|혼돈|복수|안광|정수|죽음|칼춤|지옥|제물|탈태|사냥)[\s\S]*?)```/);
  let opener = [];
  if (openerMatch) {
    const openerText = openerMatch[1];
    // → 또는 줄바꿈으로 분리
    const steps = openerText.split(/→|\n/).map(s => s.trim()).filter(s => s && !s.startsWith('//'));
    opener = steps.map((step, idx) => {
      // 괄호 안 내용 추출
      const noteMatch = step.match(/\(([^)]+)\)/);
      const skillName = cleanSkillName(step.replace(/\([^)]+\)/, '').trim());
      return {
        step: idx + 1,
        skillName,
        note: noteMatch ? noteMatch[1] : null,
      };
    });
  }
  
  // 결과 객체
  const result = {
    // 기본 정보
    class: frontmatter.class,
    spec: frontmatter.spec,
    heroTree: heroTree || frontmatter.hero_talent || null,
    situation: situation.toUpperCase(),
    targetCount: situation.toUpperCase() === 'AOE' ? '3+' : '1',
    
    // 우선순위
    priorities,
    
    // 오프너
    opener,
    
    // 메타
    patch: frontmatter.patch || '11.2.5',
    source: frontmatter.source || null,
    tags: frontmatter.tags || [],
    
    // 파일 키 생성 (예: demonhunter-havoc-aldrachi-st)
    key: `${frontmatter.class.toLowerCase()}-${frontmatter.spec.toLowerCase()}-${(heroTree || 'default').toLowerCase()}-${situation.toLowerCase()}`,
  };
  
  return result;
}

module.exports = {
  parsePriorityNote,
  parseMarkdownTable,
};
