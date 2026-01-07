@echo off
echo ========================================
echo Fixing Tailwind CSS - Clean Restart
echo ========================================
echo.

echo Step 1: Cleaning Vite cache...
if exist "client\node_modules\.vite" (
    rmdir /s /q "client\node_modules\.vite"
    echo ✅ Vite cache cleared
) else (
    echo ℹ️  No Vite cache found
)
echo.

echo Step 2: Cleaning dist folder...
if exist "client\dist" (
    rmdir /s /q "client\dist"
    echo ✅ Dist cleared
) else (
    echo ℹ️  No dist found
)
echo.

echo Step 3: Verifying Tailwind config...
if exist "client\tailwind.config.js" (
    echo ✅ Tailwind config found in client/
) else (
    echo ❌ Tailwind config missing!
)

if exist "client\postcss.config.js" (
    echo ✅ PostCSS config found in client/
) else (
    echo ❌ PostCSS config missing!
)
echo.

echo Step 4: Starting dev server...
echo.
echo ========================================
echo Tailwind should now work!
echo Press Ctrl+C to stop
echo ========================================
echo.

cd client
npm run dev
