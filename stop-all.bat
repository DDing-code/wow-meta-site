@echo off
chcp 949 >nul
echo ========================================
echo   WoW Meta Site Stop All
echo   (Backend + Frontend)
echo ========================================
echo.

echo [1/2] Stopping Frontend...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    taskkill /PID %%a /F >nul 2>&1
    echo OK Frontend stopped (PID: %%a)
)

echo.
echo [2/2] Stopping Backend Server...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5003') do (
    taskkill /PID %%a /F >nul 2>&1
    echo OK Backend stopped (PID: %%a)
)

echo.
echo ========================================
echo All services stopped.
echo ========================================
echo.
pause