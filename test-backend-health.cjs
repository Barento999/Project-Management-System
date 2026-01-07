const http = require("http");

console.log("🔍 Testing Backend Health...\n");

// Test local backend
function testBackend(host, port, path = "/") {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: host,
      port: port,
      path: path,
      method: "GET",
      timeout: 5000,
    };

    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        resolve({
          status: res.statusCode,
          data: data,
        });
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });

    req.end();
  });
}

async function runTests() {
  // Test 1: Check if backend is running locally
  console.log("1️⃣ Testing Local Backend (http://localhost:5000)...");
  try {
    const result = await testBackend("localhost", 5000, "/");
    console.log("✅ Backend is running!");
    console.log(`   Status: ${result.status}`);
    console.log(`   Response: ${result.data}`);
  } catch (error) {
    console.log("❌ Backend is NOT running locally");
    console.log(`   Error: ${error.message}`);
    console.log("\n💡 To start backend:");
    console.log("   cd server");
    console.log("   npm start");
  }

  console.log(
    "\n2️⃣ Testing API Endpoint (http://localhost:5000/api/auth/login)..."
  );
  try {
    const result = await testBackend("localhost", 5000, "/api/auth/login");
    console.log(`   Status: ${result.status}`);
    if (result.status === 404) {
      console.log("⚠️  Login endpoint returns 404 - checking routes...");
    } else if (result.status === 405) {
      console.log("✅ Login endpoint exists (needs POST request)");
    }
  } catch (error) {
    console.log(`❌ Cannot reach API endpoint: ${error.message}`);
  }

  console.log("\n3️⃣ Checking Environment Configuration...");
  const fs = require("fs");
  const path = require("path");

  const envPath = path.join(__dirname, "server", ".env");
  if (fs.existsSync(envPath)) {
    console.log("✅ server/.env file exists");
    const envContent = fs.readFileSync(envPath, "utf8");

    const checks = [
      { key: "MONGODB_URI", found: envContent.includes("MONGODB_URI=") },
      { key: "JWT_SECRET", found: envContent.includes("JWT_SECRET=") },
      { key: "PORT", found: envContent.includes("PORT=") },
    ];

    checks.forEach((check) => {
      if (check.found) {
        console.log(`   ✅ ${check.key} is configured`);
      } else {
        console.log(`   ❌ ${check.key} is missing`);
      }
    });
  } else {
    console.log("❌ server/.env file not found");
  }

  console.log("\n4️⃣ Checking Server Files...");
  const serverFiles = [
    "server/server.js",
    "server/routes/auth.js",
    "server/controllers/authController.js",
    "server/models/User.js",
  ];

  serverFiles.forEach((file) => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      console.log(`   ✅ ${file} exists`);
    } else {
      console.log(`   ❌ ${file} missing`);
    }
  });

  console.log("\n" + "=".repeat(60));
  console.log("📋 SUMMARY");
  console.log("=".repeat(60));
  console.log("\nIf backend is NOT running:");
  console.log("  1. Open a new terminal");
  console.log("  2. cd server");
  console.log("  3. npm install (if not done)");
  console.log("  4. npm start");
  console.log("\nIf backend IS running but has errors:");
  console.log("  - Check MongoDB connection");
  console.log("  - Check server/.env configuration");
  console.log("  - Check console for error messages");
  console.log("\nFor deployment:");
  console.log("  - Deploy backend to Render.com");
  console.log("  - Update .env.production with backend URL");
  console.log("  - Redeploy frontend to Vercel");
}

runTests();
