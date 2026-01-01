// Get verification token from database for a user
const mongoose = require("mongoose");
require("dotenv").config({ path: "./server/.env" });

const User = require("./server/models/User");

const email = process.argv[2] || "barentohashum11@gmail.com";

console.log("🔍 Looking up verification token for:", email);
console.log(
  "📍 Database:",
  process.env.MONGODB_URI?.split("@")[1]?.split("/")[0] || "checking..."
);
console.log("");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("✅ Connected to database\n");

    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found with email:", email);
      console.log(
        "\n💡 Try running: node get-verification-token.cjs YOUR_EMAIL"
      );
      process.exit(1);
    }

    console.log("✅ User found!");
    console.log("   Name:", user.name);
    console.log("   Email:", user.email);
    console.log("   Email Verified:", user.isEmailVerified);
    console.log("");

    if (user.isEmailVerified) {
      console.log("✅ Email is already verified! No action needed.");
      process.exit(0);
    }

    if (!user.emailVerificationToken) {
      console.log("⚠️  No verification token found.");
      console.log("");
      console.log("💡 Solutions:");
      console.log(
        '   1. Go to profile page and click "Resend Verification Email"'
      );
      console.log("   2. Or register a new account");
      process.exit(1);
    }

    // The token in database is HASHED, we can't reverse it
    console.log("⚠️  Token is hashed in database (for security)");
    console.log(
      "   Hashed token:",
      user.emailVerificationToken.substring(0, 20) + "..."
    );
    console.log("");
    console.log("💡 To get the verification link:");
    console.log("   1. Go to: http://localhost:5173/profile");
    console.log('   2. Click "Resend Verification Email"');
    console.log("   3. Check backend console for the link");
    console.log("");
    console.log("   OR register a new user and check console immediately");

    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Database error:", error.message);
    process.exit(1);
  });
