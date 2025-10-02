/**
 * Korean WoW Database Integration Script
 * 공식 한국 번역 DB를 프로젝트 스킬 DB와 통합
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Lua 파일을 JavaScript로 파싱하는 함수
function parseLuaToJS(luaContent) {
    // Lua 테이블을 JavaScript 객체로 변환
    let jsContent = luaContent
        .replace(/MultiLanguageSpellData\['ko'\]/g, 'koreanSpells')
        .replace(/\[(\d+)\]/g, '[$1]')
        .replace(/= \{/g, '= {')
        .replace(/nil/g, 'null')
        .replace(/additional_info = "(.*?)"/g, (match, p1) => {
            // 이스케이프 처리
            return `additional_info: "${p1.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`
        })
        .replace(/name = "(.*?)"/g, 'name: "$1"')
        .replace(/additional_info = null/g, 'additional_info: null');

    // JavaScript 객체로 변환
    const sandbox = { koreanSpells: {} };
    const script = `${jsContent}`;

    try {
        // 안전한 실행 환경에서 실행
        const lines = script.split('\n');
        for (const line of lines) {
            if (line.includes('koreanSpells[')) {
                // 각 라인을 개별적으로 파싱
                const match = line.match(/koreanSpells\[(\d+)\] = \{(.*)\}/);
                if (match) {
                    const id = parseInt(match[1]);
                    const dataStr = match[2];

                    // name과 additional_info 추출
                    const nameMatch = dataStr.match(/name: "(.*?)"/);
                    const infoMatch = dataStr.match(/additional_info: (null|"(.*?)")/);

                    sandbox.koreanSpells[id] = {
                        name: nameMatch ? nameMatch[1] : '',
                        additional_info: infoMatch && infoMatch[2] ? infoMatch[2] : null
                    };
                }
            }
        }
    } catch (error) {
        console.error('Error parsing Lua:', error);
    }

    return sandbox.koreanSpells;
}

// 메인 통합 함수
async function integrateKoreanDatabase() {
    console.log('🚀 한국 WoW 번역 DB 통합 시작...\n');

    // 1. 한국 DB 파일들 로드
    const dbPath = path.join('C:', 'Users', 'D2JK', '바탕화면', 'cd', '냉죽', 'Database', 'Spells');
    const spellFiles = [
        'spellsOne.lua',
        'spellsTwo.lua',
        'spellsThree.lua',
        'spellsFour.lua',
        'spellsFive.lua',
        'spellsSix.lua',
        'spellsSeven.lua',
        'spellsEight.lua'
    ];

    const koreanSpells = {};
    let totalLoaded = 0;

    for (const file of spellFiles) {
        const filePath = path.join(dbPath, file);
        if (fs.existsSync(filePath)) {
            console.log(`📖 ${file} 로딩 중...`);
            const content = fs.readFileSync(filePath, 'utf8');
            const spells = parseLuaToJS(content);
            Object.assign(koreanSpells, spells);
            const count = Object.keys(spells).length;
            totalLoaded += count;
            console.log(`   ✅ ${count.toLocaleString()}개 스킬 로드 완료`);
        }
    }

    console.log(`\n📊 총 ${totalLoaded.toLocaleString()}개의 한국어 스킬 데이터 로드 완료\n`);

    // 2. 우리 프로젝트의 스킬 DB 파일들 업데이트
    const projectPath = path.join(__dirname, '..', 'src', 'data', 'skills');
    const skillFiles = fs.readdirSync(projectPath).filter(f => f.startsWith('wowdb') && f.endsWith('.js'));

    console.log('🔄 프로젝트 스킬 DB 업데이트 시작...\n');

    const updateStats = {
        totalSkills: 0,
        updated: 0,
        new: 0,
        unchanged: 0
    };

    for (const file of skillFiles) {
        const filePath = path.join(projectPath, file);
        console.log(`📝 ${file} 처리 중...`);

        // 파일 읽기
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;

        // 스킬 ID 추출 및 업데이트
        // 정규식 수정: 중첩된 객체 구조 처리
        const skillMatches = [...content.matchAll(/(\d+):\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g)];
        let updatedCount = 0;
        let newCount = 0;

        for (const match of skillMatches) {
            const skillId = parseInt(match[1]);
            updateStats.totalSkills++;

            // 한국 DB에서 해당 스킬 찾기
            if (koreanSpells[skillId]) {
                const koreanData = koreanSpells[skillId];
                const skillBlock = match[0];

                // 현재 스킬 데이터에서 kr 필드 찾기
                const krMatch = skillBlock.match(/kr:\s*["']([^"']+)["']/);
                const currentKr = krMatch ? krMatch[1] : '';

                // 한국어 이름이 있고 다르면 업데이트
                if (koreanData.name && koreanData.name !== currentKr) {
                    let newSkillBlock;

                    if (krMatch) {
                        // kr 필드가 이미 있으면 교체
                        newSkillBlock = skillBlock.replace(
                            /kr:\s*["'][^"']+["']/,
                            `kr: '${koreanData.name}'`
                        );
                        updatedCount++;
                        updateStats.updated++;
                    } else {
                        // kr 필드가 없으면 name 필드 다음에 추가
                        const nameMatch = skillBlock.match(/name:\s*["'][^"']+["']/);
                        if (nameMatch) {
                            newSkillBlock = skillBlock.replace(
                                nameMatch[0],
                                `${nameMatch[0]},\n      kr: '${koreanData.name}'`
                            );
                            newCount++;
                            updateStats.new++;
                        } else {
                            newSkillBlock = skillBlock;
                            updateStats.unchanged++;
                        }
                    }

                    // additional_info가 있으면 description 필드 추가/업데이트
                    if (koreanData.additional_info && newSkillBlock !== skillBlock) {
                        const cleanInfo = koreanData.additional_info
                            .replace(/\\/g, '\\\\')
                            .replace(/'/g, "\\'")
                            .replace(/"/g, '\\"')
                            .replace(/\n/g, '\\n');

                        if (newSkillBlock.includes('description:')) {
                            // description이 있으면 교체
                            newSkillBlock = newSkillBlock.replace(
                                /description:\s*["'][^"']*["']/,
                                `description: '${cleanInfo}'`
                            );
                        } else if (!newSkillBlock.includes('type:')) {
                            // description이 없으면 추가 (type 필드 앞에)
                            newSkillBlock = newSkillBlock.replace(
                                /\n\s*\}/,
                                `,\n      description: '${cleanInfo}'\n    }`
                            );
                        }
                    }

                    if (newSkillBlock && newSkillBlock !== skillBlock) {
                        content = content.replace(skillBlock, newSkillBlock);
                    }
                } else {
                    updateStats.unchanged++;
                }
            }
        }

        // 파일이 변경되었으면 저장
        if (content !== originalContent) {
            // 백업 생성
            const backupPath = filePath.replace('.js', '.backup.js');
            fs.writeFileSync(backupPath, originalContent, 'utf8');

            // 업데이트된 내용 저장
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`   ✅ ${updatedCount}개 업데이트, ${newCount}개 신규 추가`);
        } else {
            console.log(`   ⏭️ 변경사항 없음`);
        }
    }

    // 3. 통합 결과 리포트
    console.log('\n' + '='.repeat(60));
    console.log('📊 통합 완료 리포트');
    console.log('='.repeat(60));
    console.log(`총 처리된 스킬: ${updateStats.totalSkills.toLocaleString()}개`);
    console.log(`업데이트됨: ${updateStats.updated.toLocaleString()}개`);
    console.log(`신규 추가: ${updateStats.new.toLocaleString()}개`);
    console.log(`변경 없음: ${updateStats.unchanged.toLocaleString()}개`);

    // 4. 검증 샘플 출력
    console.log('\n📋 샘플 검증 (무작위 10개):');
    const sampleIds = Object.keys(koreanSpells).sort(() => Math.random() - 0.5).slice(0, 10);

    for (const id of sampleIds) {
        const spell = koreanSpells[id];
        console.log(`  ID ${id}: ${spell.name}`);
    }

    console.log('\n✨ 한국 WoW 번역 DB 통합 완료!');
}

// 중요 스킬 ID 매핑 (전사 예시)
const importantSkillMappings = {
    // 전사 스킬
    100: '돌진',
    355: '도발',
    1680: '소용돌이',
    12323: '필사의 일격',
    23920: '주문 반사',
    871: '방패의 벽',
    1160: '사기의 외침',

    // 성기사 스킬
    853: '심판의 망치',
    633: '신의 축복',
    1044: '자유의 축복',
    642: '천상의 보호막',

    // 사냥꾼 스킬
    19434: '조준 사격',
    193455: '코브라 사격',
    19801: '평정',

    // 도적 스킬
    1856: '소멸',
    408: '급소 가격',
    1766: '발차기',

    // 사제 스킬
    17: '신의 권능: 보호막',
    139: '소생',
    589: '암흑의 권능: 고통',

    // 마법사 스킬
    116: '얼음 화살',
    122: '얼음 회오리',
    133: '화염구',

    // 흑마법사 스킬
    348: '제물',
    172: '부패',

    // 주술사 스킬
    8042: '대지 충격',
    51505: '용암 폭발',

    // 드루이드 스킬
    339: '휘감는 뿌리',
    99: '행동 불가의 포효',

    // 죽음의 기사 스킬
    49998: '죽음의 일격',
    47528: '정신 얼리기',

    // 수도사 스킬
    100784: '흑우 차기',
    115080: '기의 고리',

    // 악마사냥꾼 스킬
    198589: '흐릿해지기',
    188499: '칼날 춤',

    // 기원사 스킬
    358733: '일렁이는 불길',
    357208: '불의 숨결'
};

// 실행
integrateKoreanDatabase().catch(console.error);