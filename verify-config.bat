@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Configuration Verification
echo ========================================
echo.

REM Get IP
echo [1] Your Current IP Address:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set "IP=%%a"
    set "IP=!IP:~1!"
    echo    !IP!
    set MYIP=!IP!
)
echo.

REM Check .env
echo [2] .env Configuration:
if exist .env (
    type .env
    echo.
    findstr "localhost" .env >nul
    if !errorlevel! equ 0 (
        echo    ✗ ERROR: Still using localhost!
        echo    Run: restart-everything.bat
    ) else (
        echo    ✓ Using network IP
    )
) else (
    echo    ✗ .env file missing!
)
echo.

REM Check if servers running
echo [3] Server Status:
echo.
echo    Backend (Port 5000):
netstat -ano | findstr :5000 >nul
if %errorlevel% equ 0 (
    echo    ✓ Running
) else (
    echo    ✗ NOT running
)

echo.
echo    Frontend (Port 5173):
netstat -ano | findstr :5173 >nul
if %errorlevel% equ 0 (
    echo    ✓ Running
    echo    ⚠ If you just changed .env, you MUST restart frontend!
) else (
    echo    ✗ NOT running
)
echo.

REM Check firewall
echo [4] Firewall Rules:
echo.
netsh advfirewall firewall show rule name="Node.js Backend Port 5000" >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✓ Port 5000 allowed
) else (
    echo    ✗ Port 5000 blocked - Run: fix-firewall.bat as Admin
)

netsh advfirewall firewall show rule name="Vite Frontend Port 5173" >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✓ Port 5173 allowed
) else (
    echo    ✗ Port 5173 blocked - Run: fix-firewall.bat as Admin
)
echo.

echo ========================================
echo Access URLs
echo ========================================
echo.
echo From this computer:
echo   http://localhost:5173
echo.
echo From other devices (same WiFi):
echo   http://!MYIP!:5173
echo.
echo Backend API:
echo   http://!MYIP!:5000/api
echo.
echo ========================================
echo Next Steps
echo ========================================
echo.
echo If .env shows localhost:
echo   1. Run: restart-everything.bat
echo   2. Wait 15 seconds
echo   3. Test again
echo.
echo If firewall rules missing:
echo   1. Right-click: fix-firewall.bat
echo   2. Run as Administrator
echo.
pause
