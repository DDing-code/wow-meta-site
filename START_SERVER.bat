@echo off
echo Starting WoW Meta Site Server on port 3002...
cd /d "%~dp0"
set PORT=3002
npm start
pause