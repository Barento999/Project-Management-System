@echo off
echo ========================================
echo Checking Server Status
echo ========================================
echo.

echo [1] Checking if backend is running on port 5000...
netstat -ano | findstr :5000
if %errorlevel% equ 0 (
    echo ✓ Backend is running on port 5000
) else (
    echo ✗ Backend is NOT running on port 5000
    echo   You need to start the backend server!
)
echo.

echo [2] Checking if frontend is running on port 5173...
netstat -ano | findstr :5173
if %errorlevel% equ 0 (
    echo ✓ Frontend is running on port 5173
) else (
    echo ✗ Frontend is NOT running on port 5173
    echo   You need to start the frontend server!
)
echo.

echo [3] Your IP Address:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set "IP=%%a"
    setlocal enabledelayedexpansion
    set "IP=!IP:~1!"
    echo   !IP!
    endlocal
)
echo.

echo ========================================
echo Recommendations:
echo ========================================
echo.
echo If servers are NOT running, run:
echo   setup-and-start.bat
echo.
echo Or start manually:
echo   Terminal 1: cd server ^&^& npm start
echo   Terminal 2: cd client ^&^& npm run dev -- --host
echo.
pause
