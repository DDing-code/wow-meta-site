@echo off
chcp 949 >nul
echo ========================================
echo   WoW Meta Site Status Check
echo ========================================
echo.

echo [Checking Server Status...]
echo.

echo Backend Server (Port 5003):
netstat -ano | findstr :5003 >nul
if %errorlevel% == 0 (
    echo    [OK] Running
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5003') do (
        echo    PID: %%a
        goto :frontend
    )
) else (
    echo    [X] Not Running
)

:frontend
echo.
echo Frontend (Port 3000):
netstat -ano | findstr :3000 >nul
if %errorlevel% == 0 (
    echo    [OK] Running
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
        echo    PID: %%a
        goto :summary
    )
) else (
    echo    [X] Not Running
)

:summary
echo.
echo ========================================
echo.
echo Quick Commands:
echo    start-all.bat    : Start all services
echo    stop-all.bat     : Stop all services
echo    start-server.bat : Start backend only
echo.
echo ========================================
pause