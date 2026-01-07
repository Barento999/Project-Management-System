@echo off
echo ========================================
echo Finding Your Network IP Address
echo ========================================
echo.

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set IP=%%a
    set IP=!IP:~1!
    echo Your IP Address: !IP!
)

echo.
echo ========================================
echo Use this IP to access from mobile:
echo http://YOUR_IP:5000/api
echo ========================================
echo.
pause
