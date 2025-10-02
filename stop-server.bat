@echo off
echo ========================================
echo   WoW Meta Site 서버 종료
echo ========================================
echo.

REM 포트 5003을 사용하는 프로세스 찾기
echo [1/2] 포트 5003 사용 프로세스 검색 중...
echo.

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5003') do (
    set PID=%%a
    goto :found
)

echo ❌ 포트 5003에서 실행 중인 서버가 없습니다.
echo.
pause
exit /b 0

:found
echo ✅ 프로세스 발견 (PID: %PID%)
echo.

REM 프로세스 종료
echo [2/2] 서버 종료 중...
taskkill /PID %PID% /F >nul 2>&1

if %errorlevel% == 0 (
    echo ✅ 서버가 성공적으로 종료되었습니다.
) else (
    echo ❌ 서버 종료 실패. 관리자 권한이 필요할 수 있습니다.
)

echo.
echo ========================================
pause