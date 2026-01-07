@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Network Diagnostics
echo ========================================
echo.

REM Get IP
echo [1] Your IP Address:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set "IP=%%a"
    set "IP=!IP:~1!"
    echo    !IP!
    set MYIP=!IP!
)
echo.

REM Check servers
echo [2] Checking if servers are running...
echo.
echo    Backend (Port 5000):
netstat -ano | findstr :5000 >nul
if %errorlevel% equ 0 (
    echo    ✓ Running
) else (
    echo    ✗ NOT running - Start with: setup-and-start.bat
)

echo.
echo    Frontend (Port 5173):
netstat -ano | findstr :5173 >nul
if %errorlevel% equ 0 (
    echo    ✓ Running
) else (
    echo    ✗ NOT running - Start with: setup-and-start.bat
)
echo.

REM Check firewall rules
echo [3] Checking firewall rules...
echo.
echo    Port 5000 rule:
netsh advfirewall firewall show rule name="Node.js Backend Port 5000" >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✓ Exists
) else (
    echo    ✗ Missing - Run: fix-firewall.bat as Administrator
)

echo.
echo    Port 5173 rule:
netsh advfirewall firewall show rule name="Vite Frontend Port 5173" >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✓ Exists
) else (
    echo    ✗ Missing - Run: fix-firewall.bat as Administrator
)
echo.

REM Check .env
echo [4] Checking .env configuration...
if exist .env (
    echo    ✓ .env file exists
    findstr "VITE_API_URL" .env
) else (
    echo    ✗ .env file missing
)
echo.

REM Network info
echo [5] Network Information:
echo.
echo    Your computer: !MYIP!
echo    Backend API:   http://!MYIP!:5000/api
echo    Frontend:      http://!MYIP!:5173
echo.

echo ========================================
echo Summary
echo ========================================
echo.
echo To access from other PC (same WiFi):
echo    http://!MYIP!:5173
echo.
echo If not working:
echo    1. Make sure servers are running
echo    2. Run fix-firewall.bat as Administrator
echo    3. Verify other PC is on same WiFi
echo.
pause
