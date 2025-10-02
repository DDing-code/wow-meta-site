@echo off
chcp 65001 >nul 2>&1
echo ========================================
echo   WoW Meta Site Start All
echo   Backend + Frontend
echo ========================================
echo.

echo [1/3] Starting Backend Server...

cd /d "%~dp0"
start "WoW Meta Backend" cmd /c "cd server && npm run dev"

ping localhost -n 4 >nul

echo OK Backend Server Started Port 5003
echo.

echo [2/3] Starting Frontend...

cd /d "%~dp0"
start "WoW Meta Frontend" cmd /c "npm start"

echo OK Frontend Started Port 3000
echo.

echo [3/3] Complete!
echo ========================================
echo.
echo Running Services:
echo    Backend:    http://localhost:5003
echo    Frontend:   http://localhost:3000
echo.
echo To Stop: Use stop-all.bat
echo.
echo ========================================

ping localhost -n 6 >nul
start http://localhost:3000

pause