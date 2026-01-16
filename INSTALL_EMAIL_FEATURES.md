# 📧 Install Email Features

## Quick Installation

Run these commands to enable email features:

### Step 1: Install Nodemailer

```bash
cd server
npm install nodemailer
```

### Step 2: Configure Environment Variables

Copy the example and edit with your settings:

```bash
cp .env.example .env
```

Then edit `server/.env` and add:

```env
# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5173

# Email Configuration - Choose one:

# Option 1: Gmail (Easy for development)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
FROM_NAME=ProjectFlow

# Enable Email Features
ENABLE_EMAIL_VERIFICATION=true
ENABLE_PASSWORD_RESET=true
ENABLE_NOTIFICATION_EMAILS=false
```

### Step 3: Restart Server

```bash
npm start
```

## ✅ That's It!

Email features are now active:

- ✅ Password reset works
- ✅ Email verification works
- ✅ Notification emails ready

## 🧪 Test Without SMTP

If you don't configure SMTP, emails will be logged to console (perfect for development):

```
📧 ========== EMAIL (LOG MODE) ==========
To: user@example.com
Subject: Password Reset Request
Message: Hi John, You requested...
=========================================
```

## 📚 Full Setup Guide

See `EMAIL_SETUP_GUIDE.md` for:

- Gmail setup instructions
- SendGrid configuration
- AWS SES setup
- Troubleshooting

## 🚀 Quick Test

1. Go to http://localhost:5173/login
2. Click "Forgot your password?"
3. Enter your email
4. Check console logs (or email if SMTP configured)
5. Click the reset link
6. Set new password

**It works!** 🎉
