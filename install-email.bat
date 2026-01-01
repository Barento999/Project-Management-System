@echo off
echo 📧 Installing Email Features...
echo.

cd server

echo 📦 Installing nodemailer...
call npm install nodemailer

if not exist .env (
    echo 📝 Creating .env file from example...
    copy .env.example .env
    echo ✅ .env file created!
    echo.
    echo ⚠️  IMPORTANT: Edit server\.env and add your email settings
    echo    Or leave it as-is to use LOG MODE (emails logged to console)
) else (
    echo ✅ .env file already exists
)

echo.
echo 🎉 Email features installed successfully!
echo.
echo Next steps:
echo 1. Edit server\.env with your email settings (optional)
echo 2. Restart your server: cd server ^&^& npm start
echo 3. Test at http://localhost:5173/forgot-password
echo.
echo 📚 See INSTALL_EMAIL_FEATURES.md for detailed instructions
echo.
pause
