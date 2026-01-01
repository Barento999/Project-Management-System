// Direct test of email service
process.env.NODE_ENV = "development";
process.env.ENABLE_EMAIL_VERIFICATION = "true";
process.env.FRONTEND_URL = "http://localhost:5173";

console.log("🔍 Testing Email Service Directly...\n");

const { sendEmailVerification } = require("./server/utils/emailService");

const testUser = {
  name: "Test User",
  email: "test@example.com",
};

const testToken = "abc123def456test";

console.log("📧 Calling sendEmailVerification...\n");

sendEmailVerification(testUser, testToken)
  .then(() => {
    console.log("\n✅ SUCCESS! Email service is working!");
    console.log("\n📋 Verification URL that should appear above:");
    console.log(`http://localhost:5173/verify-email/${testToken}`);
  })
  .catch((error) => {
    console.error("\n❌ FAILED! Error in email service:");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
  });
