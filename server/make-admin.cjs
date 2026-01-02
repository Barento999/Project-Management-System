const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/project_management"
  )
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// User model
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: String,
    isEmailVerified: Boolean,
    isActive: Boolean,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

async function makeAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.log("❌ Please provide an email address");
    console.log("Usage: node make-admin.cjs <email>");
    process.exit(1);
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`❌ User not found: ${email}`);
      process.exit(1);
    }

    console.log(`\n📧 User found: ${user.name} (${user.email})`);
    console.log(`   Current role: ${user.role}`);

    if (user.role === "ADMIN") {
      console.log("✅ User is already an ADMIN!");
    } else {
      user.role = "ADMIN";
      await user.save();
      console.log("✅ User role updated to ADMIN!");
    }

    console.log("\n🎉 Done! User can now access all features.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

makeAdmin();
