@echo off
setlocal enabledelayedexpansion

echo ========================================
echo AUTO SETUP FOR MOBILE ACCESS
echo ========================================
echo.

REM Get IP address
echo [1/4] Finding your IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set "IP=%%a"
    set "IP=!IP:~1!"
    goto :found_ip
)

:found_ip
echo Found IP: !IP!
echo.

REM Update .env file
echo [2/4] Updating .env file...
(
echo VITE_API_URL=http://!IP!:5000/api
) > .env
echo .env updated with: http://!IP!:5000/api
echo.

REM Start backend in new window
echo [3/4] Starting backend server...
start "Backend Server" cmd /k "cd server && npm start"
timeout /t 3 /nobreak >nul
echo Backend starting...
echo.

REM Start frontend in new window
echo [4/4] Starting frontend...
start "Frontend Server" cmd /k "cd client && npm run dev -- --host"
timeout /t 3 /nobreak >nul
echo Frontend starting...
echo.

echo ========================================
echo SETUP COMPLETE!
echo ========================================
echo.
echo Your IP Address: !IP!
echo.
echo Access from this computer:
echo   http://localhost:5173
echo.
echo Access from mobile/other devices (same WiFi):
echo   http://!IP!:5173
echo.
echo Backend API:
echo   http://!IP!:5000/api
echo.
echo ========================================
echo Two new windows opened:
echo   1. Backend Server (port 5000)
echo   2. Frontend Server (port 5173)
echo.
echo Close those windows to stop the servers.
echo ========================================
echo.
pause
