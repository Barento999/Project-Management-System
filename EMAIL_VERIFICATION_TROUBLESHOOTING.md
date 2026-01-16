# 🔧 Email Verification Troubleshooting

## ❌ "Failed to send verification email" Error

### Common Causes & Solutions

#### 1. **Email Already Verified**

If your email is already verified, you'll get an error.

**Solution:**

- The verification banner only shows for unverified emails
- If you don't see the banner, your email is already verified ✅
- No action needed!

#### 2. **Not Logged In**

The resend verification requires authentication.

**Solution:**

- Make sure you're logged in
- Refresh the page
- Try logging out and back in

#### 3. **Backend Not Running**

The API call fails if the backend is down.

**Solution:**

```bash
cd server
npm start
```

---

## ✅ How to Test Email Verification (Fresh Start)

### Step 1: Create a New Test User

```bash
# Register with a NEW email that hasn't been used before
Email: newtest@example.com
Password: Test123456
```

### Step 2: Check Backend Console

After registration, look at your backend terminal:

```
📧 ========== EMAIL (LOG MODE) ==========
To: newtest@example.com
Subject: Verify Your Email - ProjectFlow
Message: ...
http://localhost:5173/verify-email/[TOKEN_HERE]
=========================================
```

### Step 3: Find the Verification Link

Scroll through the email HTML and find the URL:

```
http://localhost:5173/verify-email/abc123def456...
```

### Step 4: Copy the Token

The token is the long string after `/verify-email/`:

```
abc123def456789...
```

### Step 5: Verify

Go to:

```
http://localhost:5173/verify-email/PASTE_TOKEN_HERE
```

---

## 🧪 Quick Test Script

Run this to test the complete flow:

```bash
node test-email-verification.cjs
```

This will:

1. Register a test user
2. Show the verification email in console
3. Test resending verification
4. Show you the verification URL

---

## 📧 Email Already Sent?

If you already registered and saw the email but lost the token:

### Option 1: Check Backend Console History

Scroll up in your backend terminal to find the previous email log.

### Option 2: Resend from Profile

1. Login with your account
2. Go to: http://localhost:5173/profile
3. If you see "Email Not Verified" banner:
   - Click "Resend Verification Email"
   - Check backend console for new email
4. If you DON'T see the banner:
   - Your email is already verified! ✅

### Option 3: Register New User

Use a different email address to test fresh.

---

## 🔍 Debug: Check User Status

Want to see if your email is verified? Check the database or use this test:

```bash
# In MongoDB or your database tool, find your user:
# Look for field: isEmailVerified: true/false
```

---

## 💡 Pro Tips

### Tip 1: Keep Backend Console Visible

Always have your backend terminal visible when testing email features.

### Tip 2: Use Unique Emails

For testing, use different emails:

- test1@example.com
- test2@example.com
- test3@example.com

### Tip 3: Copy Full Token

Make sure to copy the ENTIRE token from the URL, not just part of it.

### Tip 4: Token Expires

Verification tokens expire after 24 hours. If expired, request a new one.

---

## 🎯 Expected Behavior

### On Registration:

1. User fills form and submits
2. Success message: "Registration successful! Please check your email..."
3. Backend console shows email with verification link
4. User can login immediately (verification optional)

### On Profile Page:

1. If email NOT verified: Yellow banner appears
2. If email IS verified: No banner (all good!)
3. Click "Resend": New email sent to console

### On Verification:

1. User clicks link or goes to `/verify-email/TOKEN`
2. Success message appears
3. Email marked as verified in database
4. Banner disappears from profile

---

## 🚀 Working Example

```bash
# 1. Start backend
cd server
npm start

# 2. Start frontend (in another terminal)
npm run dev

# 3. Register new user
# Go to: http://localhost:5173/register
# Email: demo@example.com
# Password: Demo123456

# 4. Check backend console - you'll see:
📧 ========== EMAIL (LOG MODE) ==========
To: demo@example.com
...
http://localhost:5173/verify-email/a1b2c3d4e5f6...
=========================================

# 5. Copy token: a1b2c3d4e5f6...

# 6. Go to: http://localhost:5173/verify-email/a1b2c3d4e5f6...

# 7. Success! ✅
```

---

## ❓ Still Having Issues?

### Check These:

- [ ] Backend server is running
- [ ] Frontend server is running
- [ ] You're using a NEW email (not already registered)
- [ ] You copied the COMPLETE token
- [ ] Token hasn't expired (< 24 hours old)
- [ ] You're logged in (for resend feature)

### Get More Info:

1. Open browser console (F12)
2. Try resending verification
3. Check for error messages
4. Share the error details

---

**Last Updated:** Just now
**Status:** Email verification is working - follow steps above
