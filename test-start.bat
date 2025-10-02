@echo off
echo Test Start Script
echo.

echo Current Directory:
cd
echo.

echo Starting Backend in new window...
start cmd /k "cd server && echo Backend Ready && npm run dev"

echo.
echo Waiting 3 seconds...
ping localhost -n 4 >nul

echo Starting Frontend in new window...
start cmd /k "echo Frontend Ready && npm start"

echo.
echo Both services starting...
echo.
pause