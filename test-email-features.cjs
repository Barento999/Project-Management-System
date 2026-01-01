const axios = require("axios");

const API_URL = "http://localhost:5000/api";

// Test user credentials
const testUser = {
  name: "Email Test User",
  email: "emailtest@example.com",
  password: "Test123456",
};

let authToken = "";

async function testEmailFeatures() {
  console.log("🧪 Testing Email Features...\n");

  try {
    // Step 1: Register a new user
    console.log("1️⃣ Registering new user...");
    try {
      const registerRes = await axios.post(
        `${API_URL}/auth/register`,
        testUser
      );
      authToken = registerRes.data.token;
      console.log("✅ User registered successfully");
      console.log("   User ID:", registerRes.data.user._id);
      console.log("   Token:", authToken.substring(0, 20) + "...");
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

    // Step 2: Test Password Reset Request
    console.log("\n2️⃣ Testing password reset request...");
    const forgotRes = await axios.post(`${API_URL}/auth/forgot-password`, {
      email: testUser.email,
    });
    console.log("✅ Password reset email sent");
    console.log("   Response:", forgotRes.data.message);
    console.log("   📧 Check server console for email content (LOG MODE)");

    // Step 3: Test Email Verification Request
    console.log("\n3️⃣ Testing email verification request...");
    const verifyRes = await axios.post(
      `${API_URL}/auth/send-verification`,
      {},
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    console.log("✅ Verification email sent");
    console.log("   Response:", verifyRes.data.message);
    console.log("   📧 Check server console for email content (LOG MODE)");

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("✅ EMAIL FEATURES TEST COMPLETE!");
    console.log("=".repeat(60));
    console.log("\n📋 What was tested:");
    console.log("   ✓ User registration");
    console.log("   ✓ Password reset email");
    console.log("   ✓ Email verification email");
    console.log("\n💡 Next Steps:");
    console.log("   1. Check server console for email logs (LOG MODE)");
    console.log("   2. Test frontend pages:");
    console.log("      - http://localhost:5173/forgot-password");
    console.log("      - http://localhost:5173/reset-password/TOKEN");
    console.log("      - http://localhost:5173/verify-email/TOKEN");
    console.log("   3. Configure SMTP in server/.env for real emails");
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
console.log("🚀 Starting Email Features Test...");
console.log("📍 API URL:", API_URL);
console.log("⚠️  Make sure the backend server is running!\n");

testEmailFeatures();
