@echo off
cd /d "%~dp0"
REM Instala exactamente react 18.2.0 y react-dom 18.2.0
call npm install react@18.2.0 react-dom@18.2.0
call npm install
call npm run dev
pause
