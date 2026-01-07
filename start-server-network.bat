@echo off
echo ========================================
echo Starting Backend Server on Network
echo ========================================
echo.
echo Finding your IP address...
echo.

REM Get IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set "IP=%%a"
    setlocal enabledelayedexpansion
    set "IP=!IP:~1!"
    echo Your Network IP: !IP!
    echo.
    echo Backend will be accessible at:
    echo   Local:   http://localhost:5000/api
    echo   Network: http://!IP!:5000/api
    echo.
    echo Update your .env file with:
    echo   VITE_API_URL=http://!IP!:5000/api
    echo.
    endlocal
)

echo ========================================
echo Starting server...
echo ========================================
echo.

cd server
npm start
