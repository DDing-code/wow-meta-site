@echo off
echo WoW 아이콘 복사 중...

REM 대표 아이콘만 먼저 복사 (용량이 크므로 선택적으로)
set SOURCE_DIR=C:\Users\D2JK\바탕화면\cd\냉죽\ICONS
set DEST_DIR=C:\Users\D2JK\바탕화면\cd\냉죽\wow-meta-site\public\icons

REM 기본 아이콘 복사
copy "%SOURCE_DIR%\inv_misc_questionmark.tga" "%DEST_DIR%\" >nul 2>&1

REM 클래스 아이콘 복사
copy "%SOURCE_DIR%\crest_warrior.tga" "%DEST_DIR%\" >nul 2>&1
copy "%SOURCE_DIR%\ability_Paladin_Veneration.tga" "%DEST_DIR%\" >nul 2>&1
copy "%SOURCE_DIR%\ability_rogue_combatreadiness.tga" "%DEST_DIR%\" >nul 2>&1
copy "%SOURCE_DIR%\ability_deathknight_boneshield.tga" "%DEST_DIR%\" >nul 2>&1
copy "%SOURCE_DIR%\ability_mage_GreaterInvisibility.tga" "%DEST_DIR%\" >nul 2>&1
copy "%SOURCE_DIR%\ability_monk_dragonkick.tga" "%DEST_DIR%\" >nul 2>&1
copy "%SOURCE_DIR%\ability_warlock_ancientgrimoire.tga" "%DEST_DIR%\" >nul 2>&1

REM 주요 스킬 아이콘 복사
copy "%SOURCE_DIR%\ability_warrior_*.tga" "%DEST_DIR%\" >nul 2>&1
copy "%SOURCE_DIR%\ability_paladin_*.tga" "%DEST_DIR%\" >nul 2>&1
copy "%SOURCE_DIR%\ability_rogue_*.tga" "%DEST_DIR%\" >nul 2>&1
copy "%SOURCE_DIR%\ability_deathknight_*.tga" "%DEST_DIR%\" >nul 2>&1
copy "%SOURCE_DIR%\ability_mage_*.tga" "%DEST_DIR%\" >nul 2>&1
copy "%SOURCE_DIR%\ability_monk_*.tga" "%DEST_DIR%\" >nul 2>&1
copy "%SOURCE_DIR%\ability_warlock_*.tga" "%DEST_DIR%\" >nul 2>&1
copy "%SOURCE_DIR%\ability_druid_*.tga" "%DEST_DIR%\" >nul 2>&1
copy "%SOURCE_DIR%\ability_demonhunter_*.tga" "%DEST_DIR%\" >nul 2>&1
copy "%SOURCE_DIR%\spell_*.tga" "%DEST_DIR%\" >nul 2>&1
copy "%SOURCE_DIR%\inv_*.tga" "%DEST_DIR%\" >nul 2>&1

echo 아이콘 복사 완료!
echo 복사된 아이콘 개수:
dir "%DEST_DIR%\*.tga" /b 2>nul | find /c ".tga"

pause