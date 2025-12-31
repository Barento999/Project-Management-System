const axios = require("axios");

async function testLogin() {
  try {
    console.log("Testing login endpoint...");

    // Test with a sample user
    const response = await axios.post("http://localhost:5000/api/auth/login", {
      email: "test@example.com",
      password: "password123",
    });

    console.log("✅ Login successful!");
    console.log("User:", response.data.user);
    console.log("Token:", response.data.token ? "Token received" : "No token");
  } catch (error) {
    if (error.response) {
      console.log("❌ Login failed");
      console.log("Status:", error.response.status);
      console.log("Message:", error.response.data.message);
    } else {
      console.log("❌ Error:", error.message);
    }
  }
}

testLogin();
