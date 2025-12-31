const axios = require("axios");

async function testRegisterAndLogin() {
  try {
    console.log("1. Testing registration...");

    // Register a new user
    const registerResponse = await axios.post(
      "http://localhost:5000/api/auth/register",
      {
        name: "Test User",
        email: "testuser@example.com",
        password: "Test123456",
      }
    );

    console.log("✅ Registration successful!");
    console.log("User:", registerResponse.data.user);

    console.log("\n2. Testing login with registered user...");

    // Login with the registered user
    const loginResponse = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        email: "testuser@example.com",
        password: "Test123456",
      }
    );

    console.log("✅ Login successful!");
    console.log("User:", loginResponse.data.user);
    console.log("Token received:", !!loginResponse.data.token);
  } catch (error) {
    if (error.response) {
      console.log("❌ Error:", error.response.data.message);
      console.log("Status:", error.response.status);
    } else {
      console.log("❌ Error:", error.message);
    }
  }
}

testRegisterAndLogin();
