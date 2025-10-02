/**
 * WoW Icon Converter and Matcher
 * TGA 아이콘을 PNG로 변환하고 스킬 DB와 매칭
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const TGA = require('tga');

// 아이콘 이름과 스킬 매칭 규칙
const iconMappings = {
    // 전사
    'warrior_arms': ['ability_warrior_savageblow', 'ability_warrior_colossussmash'],
    'warrior_fury': ['ability_warrior_rampage', 'spell_nature_bloodlust'],
    'warrior_protection': ['ability_warrior_defensivestance', 'ability_warrior_shieldwall'],

    // 성기사
    'paladin_holy': ['spell_holy_holybolt', 'spell_holy_flashheal'],
    'paladin_protection': ['spell_holy_avengersshield', 'spell_holy_righteousfury'],
    'paladin_retribution': ['spell_paladin_templarsverdict', 'ability_paladin_artofwar'],

    // 사냥꾼
    'hunter_beastmastery': ['ability_hunter_bestialdiscipline', 'ability_hunter_invigeration'],
    'hunter_marksmanship': ['ability_hunter_focusedaim', 'ability_hunter_mastermarksman'],
    'hunter_survival': ['ability_hunter_survivalbomb', 'ability_hunter_camouflage'],

    // 도적
    'rogue_assassination': ['ability_rogue_deadlybrew', 'ability_rogue_shadowstep'],
    'rogue_outlaw': ['ability_rogue_rollthebones', 'inv_sword_30'],
    'rogue_subtlety': ['ability_stealth', 'ability_rogue_shadowdance'],

    // 사제
    'priest_discipline': ['spell_holy_powerwordshield', 'spell_holy_penance'],
    'priest_holy': ['spell_holy_guardianspirit', 'spell_holy_prayerofhealing'],
    'priest_shadow': ['spell_shadow_shadowwordpain', 'spell_shadow_shadowform'],

    // 주술사
    'shaman_elemental': ['spell_nature_lightning', 'spell_shaman_lavaburst'],
    'shaman_enhancement': ['spell_shaman_improvedstormstrike', 'ability_shaman_stormstrike'],
    'shaman_restoration': ['spell_nature_magicimmunity', 'spell_shaman_spiritlink'],

    // 마법사
    'mage_arcane': ['spell_nature_wispsplode', 'spell_arcane_blast'],
    'mage_fire': ['spell_fire_firebolt02', 'spell_fire_flamebolt'],
    'mage_frost': ['spell_frost_frostbolt02', 'spell_frost_frozenorb'],

    // 흑마법사
    'warlock_affliction': ['spell_shadow_deathcoil', 'spell_shadow_abominationexplosion'],
    'warlock_demonology': ['spell_shadow_metamorphosis', 'spell_warlock_demonicempowerment'],
    'warlock_destruction': ['spell_shadow_rainoffire', 'ability_warlock_chaosbolt'],

    // 수도사
    'monk_brewmaster': ['monk_stance_drunkenox', 'ability_monk_fortifyingale'],
    'monk_windwalker': ['ability_monk_risingsunkick', 'ability_monk_tigerpalm'],
    'monk_mistweaver': ['ability_monk_soothingmists', 'ability_monk_jasmineforcetea'],

    // 드루이드
    'druid_balance': ['spell_nature_starfall', 'spell_arcane_starfire'],
    'druid_feral': ['ability_druid_catform', 'ability_druid_rake'],
    'druid_guardian': ['ability_racial_bearform', 'ability_druid_mangle'],
    'druid_restoration': ['spell_nature_healingtouch', 'inv_relics_idolofrejuvenation'],

    // 죽음의 기사
    'deathknight_blood': ['spell_deathknight_bloodpresence', 'spell_deathknight_bloodboil'],
    'deathknight_frost': ['spell_deathknight_frostpresence', 'spell_frost_arcticwinds'],
    'deathknight_unholy': ['spell_deathknight_unholypresence', 'spell_shadow_deathanddecay'],

    // 악마사냥꾼
    'demonhunter_havoc': ['ability_demonhunter_eyebeam', 'ability_demonhunter_bladedance'],
    'demonhunter_vengeance': ['ability_demonhunter_immolation', 'ability_demonhunter_spectank'],

    // 기원사
    'evoker_devastation': ['ability_evoker_dragonrage', 'ability_evoker_firebreath'],
    'evoker_preservation': ['ability_evoker_rewind', 'ability_evoker_essenceburst'],
    'evoker_augmentation': ['ability_evoker_ebon', 'ability_evoker_blessing']
};

async function convertTGAsToPNG() {
    const sourcePath = path.join('C:', 'Users', 'D2JK', '바탕화면', 'cd', '냉죽', 'ICONS');
    const targetPath = path.join(__dirname, '..', 'public', 'icons');

    // 대상 폴더 생성
    if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
    }

    // 진행 상황 추적
    const stats = {
        total: 0,
        converted: 0,
        failed: 0,
        skipped: 0
    };

    console.log('🚀 아이콘 변환 시작...\n');

    const files = fs.readdirSync(sourcePath).filter(f => f.endsWith('.tga'));
    stats.total = files.length;

    console.log(`📊 총 ${stats.total.toLocaleString()}개의 TGA 파일 발견\n`);

    const batchSize = 100;

    for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, Math.min(i + batchSize, files.length));

        await Promise.all(batch.map(async (file) => {
            const sourcefile = path.join(sourcePath, file);
            const targetFile = path.join(targetPath, file.replace('.tga', '.png'));

            // 이미 변환된 파일은 스킵
            if (fs.existsSync(targetFile)) {
                stats.skipped++;
                return;
            }

            try {
                // TGA 파일 읽기
                const tgaBuffer = fs.readFileSync(sourcefile);

                // TGA 파싱
                const tga = new TGA(tgaBuffer);

                // Canvas 데이터를 Buffer로 변환
                const imageData = Buffer.from(tga.pixels);

                // Sharp로 PNG 변환
                await sharp(imageData, {
                    raw: {
                        width: tga.width,
                        height: tga.height,
                        channels: 4
                    }
                })
                .png()
                .toFile(targetFile);

                stats.converted++;
            } catch (error) {
                // 조용히 실패 처리 (너무 많은 파일이 있으므로)
                stats.failed++;
            }
        }));

        // 진행 상황 출력
        if ((i + batchSize) % 1000 === 0 || i + batchSize >= files.length) {
            const progress = Math.min(100, Math.round((i + batchSize) / files.length * 100));
            console.log(`📈 진행: ${progress}% (변환: ${stats.converted}, 스킵: ${stats.skipped}, 실패: ${stats.failed})`);
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✨ 아이콘 변환 완료!');
    console.log('='.repeat(60));
    console.log(`총 파일: ${stats.total.toLocaleString()}`);
    console.log(`변환 성공: ${stats.converted.toLocaleString()}`);
    console.log(`스킵: ${stats.skipped.toLocaleString()}`);
    console.log(`실패: ${stats.failed.toLocaleString()}`);

    return stats;
}

async function updateSkillDatabase() {
    console.log('\n🔄 스킬 데이터베이스 업데이트 시작...\n');

    const skillsPath = path.join(__dirname, '..', 'src', 'data', 'skills');
    const iconsPath = path.join(__dirname, '..', 'public', 'icons');

    // 변환된 아이콘 목록 가져오기
    const availableIcons = new Set(
        fs.readdirSync(iconsPath)
            .filter(f => f.endsWith('.png'))
            .map(f => f.replace('.png', '').toLowerCase())
    );

    console.log(`📊 ${availableIcons.size.toLocaleString()}개의 PNG 아이콘 사용 가능\n`);

    // 스킬 파일들 업데이트
    const skillFiles = fs.readdirSync(skillsPath).filter(f => f.startsWith('wowdb') && f.endsWith('.js'));

    let totalUpdated = 0;

    for (const file of skillFiles) {
        const filePath = path.join(skillsPath, file);
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;

        // 클래스 이름 추출
        const classMatch = file.match(/wowdb([A-Z][a-z]+)Skills/);
        if (!classMatch) continue;

        const className = classMatch[1].toLowerCase();

        // 스킬 ID와 이름 추출
        const skillMatches = [...content.matchAll(/(\d+):\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g)];

        for (const match of skillMatches) {
            const skillBlock = match[0];
            const skillId = match[1];

            // 이미 아이콘이 있는지 확인
            if (skillBlock.includes('icon:')) continue;

            // 스킬 이름 추출
            const nameMatch = skillBlock.match(/name:\s*["']([^"']+)["']/);
            if (!nameMatch) continue;

            const skillName = nameMatch[1].toLowerCase().replace(/\s+/g, '');

            // 매칭 가능한 아이콘 찾기
            let iconName = null;

            // 1. 직접 매칭
            if (availableIcons.has(`ability_${className}_${skillName}`)) {
                iconName = `ability_${className}_${skillName}`;
            } else if (availableIcons.has(`spell_${className}_${skillName}`)) {
                iconName = `spell_${className}_${skillName}`;
            }

            // 2. 패턴 매칭
            if (!iconName) {
                for (const icon of availableIcons) {
                    if (icon.includes(className) && icon.includes(skillName.substring(0, 5))) {
                        iconName = icon;
                        break;
                    }
                }
            }

            // 아이콘 경로 추가
            if (iconName) {
                const newSkillBlock = skillBlock.replace(
                    /\n\s*\}/,
                    `,\n      icon: '/icons/${iconName}.png'\n    }`
                );
                content = content.replace(skillBlock, newSkillBlock);
                totalUpdated++;
            }
        }

        // 파일 저장
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ ${file} 업데이트 완료`);
        }
    }

    console.log(`\n📊 총 ${totalUpdated}개의 스킬에 아이콘 경로 추가됨`);
}

// 메인 실행
async function main() {
    try {
        // 1. TGA를 PNG로 변환
        await convertTGAsToPNG();

        // 2. 스킬 데이터베이스 업데이트
        await updateSkillDatabase();

        console.log('\n✨ 모든 작업 완료!');
    } catch (error) {
        console.error('❌ 오류 발생:', error);
    }
}

// 실행
main().catch(console.error);