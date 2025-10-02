@echo off
echo ============================================
echo WoW Meta 사이트 Vercel 배포
echo ============================================
echo.
echo 1. 브라우저가 열리면 Vercel 로그인하세요
echo 2. 로그인 완료 후 이 창으로 돌아오세요
echo 3. 배포가 자동으로 시작됩니다
echo.
pause

cd /d "%~dp0"

echo.
echo [1/3] Vercel 로그인 중...
vercel login

echo.
echo [2/3] 프로덕션 배포 중...
vercel --prod

echo.
echo ============================================
echo 배포 완료!
echo ============================================
echo.
echo 무료 URL: https://wowmeta-ai.vercel.app
echo.
echo 다음 단계:
echo 1. 위 URL로 사이트 확인
echo 2. wowmeta.ai 도메인 연결 (안내 받으세요)
echo.
pause
