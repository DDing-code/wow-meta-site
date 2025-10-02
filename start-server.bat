@echo off
echo ========================================
echo   WoW Meta Site Server Start
echo ========================================
echo.

cd /d "%~dp0server"

echo [1/3] Changed to server directory
echo.

netstat -ano | findstr :5003 >nul
if %errorlevel% == 0 (
    echo Warning: Port 5003 is already in use!
    echo Please run stop-server.bat first.
    echo.
    pause
    exit /b 1
)

echo [2/3] Port 5003 is available
echo.

echo [3/3] Starting Express server...
echo.
echo Server logs:
echo ========================================

npm run dev

echo.
echo ========================================
echo Server stopped.
echo ========================================
pause