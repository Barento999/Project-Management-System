const axios = require("axios");

const API_URL = "http://localhost:5000/api";

// Test user credentials
const testUser = {
  name: "Email Verification Test",
  email: "emailverify@example.com",
  password: "Test123456",
};

let authToken = "";

async function testEmailVerification() {
  console.log("🧪 Testing Email Verification Flow...\n");

  try {
    // Step 1: Register a new user (should send verification email)
    console.log(
      "1️⃣ Registering new user (should trigger verification email)..."
    );
    try {
      const registerRes = await axios.post(
        `${API_URL}/auth/register`,
        testUser
      );
      authToken = registerRes.data.token;
      console.log("✅ User registered successfully");
      console.log("   User ID:", registerRes.data.user._id);
      console.log("   Email Verified:", registerRes.data.user.isEmailVerified);
      console.log("   Message:", registerRes.data.message);
      console.log("   📧 CHECK SERVER CONSOLE for verification email!");
    } catch (error) {
      if (error.response?.data?.message?.includes("already exists")) {
        console.log("ℹ️  User already exists, logging in...");
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
          email: testUser.email,
          password: testUser.password,
        });
        authToken = loginRes.data.token;
        console.log("✅ Logged in successfully");
      } else {
        throw error;
      }
    }

    // Step 2: Test resending verification email
    console.log("\n2️⃣ Testing resend verification email...");
    const resendRes = await axios.post(
      `${API_URL}/auth/send-verification`,
      {},
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    console.log("✅ Verification email resent");
    console.log("   Response:", resendRes.data.message);
    console.log("   📧 CHECK SERVER CONSOLE for verification email!");

    // Step 3: Test Password Reset
    console.log("\n3️⃣ Testing password reset request...");
    const forgotRes = await axios.post(`${API_URL}/auth/forgot-password`, {
      email: testUser.email,
    });
    console.log("✅ Password reset email sent");
    console.log("   Response:", forgotRes.data.message);
    console.log("   📧 CHECK SERVER CONSOLE for password reset email!");

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("✅ EMAIL VERIFICATION TEST COMPLETE!");
    console.log("=".repeat(60));
    console.log("\n📋 What was tested:");
    console.log("   ✓ User registration with auto verification email");
    console.log("   ✓ Resend verification email");
    console.log("   ✓ Password reset email");
    console.log("\n💡 What to check:");
    console.log("   1. Server console should show 3 emails:");
    console.log("      - Email verification (on registration)");
    console.log("      - Email verification (resend)");
    console.log("      - Password reset");
    console.log("   2. Each email should have:");
    console.log("      - Beautiful HTML template");
    console.log("      - Verification/reset link");
    console.log("      - User name and email");
    console.log("\n🎯 Frontend Testing:");
    console.log("   1. Register at: http://localhost:5173/register");
    console.log("      → Should see success message about verification");
    console.log("      → Check server console for email");
    console.log("   2. Go to Profile page");
    console.log('      → Should see "Email Not Verified" banner');
    console.log('      → Click "Resend Verification Email"');
    console.log("      → Check server console for email");
    console.log("   3. Copy verification token from email URL");
    console.log("      → Go to: http://localhost:5173/verify-email/TOKEN");
    console.log("      → Should see success message");
    console.log("\n📧 Email Service Mode: LOG MODE (console output)");
    console.log("   To enable real emails, configure SMTP in server/.env");
  } catch (error) {
    console.error(
      "\n❌ Test failed:",
      error.response?.data?.message || error.message
    );
    if (error.response?.data) {
      console.error(
        "   Details:",
        JSON.stringify(error.response.data, null, 2)
      );
    }
    process.exit(1);
  }
}

// Run tests
console.log("🚀 Starting Email Verification Test...");
console.log("📍 API URL:", API_URL);
console.log("⚠️  Make sure the backend server is running!\n");

testEmailVerification();
