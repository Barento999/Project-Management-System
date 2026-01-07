@echo off
echo ========================================
echo Windows Firewall Configuration
echo ========================================
echo.
echo This will add firewall rules to allow:
echo   - Port 5000 (Backend API)
echo   - Port 5173 (Frontend)
echo.
echo You may need to run this as Administrator!
echo.
pause

echo.
echo Adding firewall rule for port 5000 (Backend)...
netsh advfirewall firewall add rule name="Node.js Backend Port 5000" dir=in action=allow protocol=TCP localport=5000
if %errorlevel% equ 0 (
    echo ✓ Port 5000 rule added successfully
) else (
    echo ✗ Failed to add port 5000 rule
    echo   Please run this script as Administrator
)

echo.
echo Adding firewall rule for port 5173 (Frontend)...
netsh advfirewall firewall add rule name="Vite Frontend Port 5173" dir=in action=allow protocol=TCP localport=5173
if %errorlevel% equ 0 (
    echo ✓ Port 5173 rule added successfully
) else (
    echo ✗ Failed to add port 5173 rule
    echo   Please run this script as Administrator
)

echo.
echo ========================================
echo Firewall Configuration Complete!
echo ========================================
echo.
echo Now try accessing from other PC:
echo   http://10.232.229.123:5173
echo.
pause
