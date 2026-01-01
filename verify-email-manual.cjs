// Manual email verification tool
// This bypasses the token and directly verifies an email in the database

const mongoose = require("mongoose");
require("dotenv").config({ path: "./server/.env" });

const User = require("./server/models/User");

const email = process.argv[2];

if (!email) {
  console.log("❌ Please provide an email address");
  console.log("Usage: node verify-email-manual.cjs YOUR_EMAIL");
  console.log(
    "Example: node verify-email-manual.cjs barentohashum11@gmail.com"
  );
  process.exit(1);
}

console.log("🔧 Manual Email Verification Tool");
console.log("📧 Email:", email);
console.log("");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("✅ Connected to database\n");

    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found with email:", email);
      process.exit(1);
    }

    console.log("✅ User found!");
    console.log("   Name:", user.name);
    console.log("   Email:", user.email);
    console.log(
      "   Current Status:",
      user.isEmailVerified ? "✅ VERIFIED" : "❌ NOT VERIFIED"
    );
    console.log("");

    if (user.isEmailVerified) {
      console.log("✅ Email is already verified! Nothing to do.");
      process.exit(0);
    }

    // Manually verify the email
    console.log("🔧 Manually verifying email...");
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    console.log("✅ Email verified successfully!");
    console.log("");
    console.log("🎉 Done! The user can now login without verification.");

    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Database error:", error.message);
    process.exit(1);
  });
