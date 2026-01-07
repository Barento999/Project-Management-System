@echo off
echo ========================================
echo Restarting Dev Server with Clean Cache
echo ========================================
echo.

echo Step 1: Cleaning Vite cache...
if exist "client\node_modules\.vite" (
    rmdir /s /q "client\node_modules\.vite"
    echo ✅ Cache cleared
) else (
    echo ℹ️  No cache found
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

echo Step 3: Starting dev server...
echo.
echo ========================================
echo Server starting... Press Ctrl+C to stop
echo ========================================
echo.

cd client
npm run dev
