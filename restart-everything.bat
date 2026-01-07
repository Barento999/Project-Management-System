@echo off
setlocal enabledelayedexpansion

echo ========================================
echo RESTART EVERYTHING WITH NETWORK ACCESS
echo ========================================
echo.

REM Get IP
echo [1/5] Finding your IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set "IP=%%a"
    set "IP=!IP:~1!"
    goto :found_ip
)

:found_ip
echo Found IP: !IP!
echo.

REM Update .env
echo [2/5] Updating .env file...
(
echo VITE_API_URL=http://!IP!:5000/api
) > .env
echo Updated: VITE_API_URL=http://!IP!:5000/api
echo.

REM Kill existing processes
echo [3/5] Stopping any existing servers...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
    taskkill /PID %%a /F >nul 2>&1
)
echo Stopped old servers
timeout /t 2 /nobreak >nul
echo.

REM Start backend
echo [4/5] Starting backend server...
start "Backend Server - Port 5000" cmd /k "cd server && echo Starting backend on !IP!:5000 && npm start"
timeout /t 3 /nobreak >nul
echo Backend starting...
echo.

REM Start frontend
echo [5/5] Starting frontend with network access...
start "Frontend Server - Port 5173" cmd /k "cd client && echo Starting frontend on !IP!:5173 && npm run dev -- --host"
timeout /t 3 /nobreak >nul
echo Frontend starting...
echo.

echo ========================================
echo SERVERS RESTARTED!
echo ========================================
echo.
echo Your IP: !IP!
echo.
echo Access from this computer:
echo   http://localhost:5173
echo.
echo Access from other devices (same WiFi):
echo   http://!IP!:5173
echo.
echo Backend API:
echo   http://!IP!:5000/api
echo.
echo ========================================
echo IMPORTANT: Wait 10-15 seconds for servers
echo to fully start before testing!
echo ========================================
echo.
echo Two new windows opened:
echo   1. Backend Server
echo   2. Frontend Server
echo.
echo If you see errors, check those windows.
echo.
pause
