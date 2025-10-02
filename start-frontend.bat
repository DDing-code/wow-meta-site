@echo off
echo ========================================
echo   WoW Meta Site 프론트엔드 시작
echo ========================================
echo.

REM 프로젝트 루트 디렉토리로 이동
cd /d "C:\Users\D2JK\바탕화면\cd\냉죽\wow-meta-site"

echo [1/3] 프로젝트 디렉토리로 이동 완료
echo.

REM 이미 실행 중인지 확인
netstat -ano | findstr :3000 >nul
if %errorlevel% == 0 (
    echo ⚠️ 포트 3000이 이미 사용 중입니다!
    echo 기존 프론트엔드를 종료하시려면 stop-frontend.bat을 실행하세요.
    echo.
    echo 브라우저에서 열기: http://localhost:3000
    start http://localhost:3000
    pause
    exit /b 1
)

echo [2/3] 포트 3000 사용 가능 확인
echo.

echo [3/3] React 개발 서버 시작 중... (포트: 3000)
echo.
echo 잠시 후 브라우저가 자동으로 열립니다.
echo 수동으로 열려면: http://localhost:3000
echo.
echo ========================================
echo Ctrl+C를 눌러 종료할 수 있습니다.
echo ========================================
echo.

REM React 개발 서버 시작
npm start

REM 서버가 종료되면
echo.
echo ========================================
echo 프론트엔드가 종료되었습니다.
echo ========================================
pause