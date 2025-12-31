const axios = require("axios");

const API_URL = "http://localhost:5000/api";

async function testCreateProject() {
  console.log("🧪 Testing Project Creation Flow...\n");

  let token = "";
  let teamId = "";

  try {
    // Step 1: Register/Login
    console.log("1️⃣  Registering user...");
    const registerRes = await axios.post(`${API_URL}/auth/register`, {
      name: "Test User",
      email: `test${Date.now()}@example.com`,
      password: "test123456",
    });

    token = registerRes.data.token;
    console.log("   ✅ User registered, token received\n");

    // Step 2: Create Team
    console.log("2️⃣  Creating team...");
    const teamRes = await axios.post(
      `${API_URL}/teams`,
      {
        name: "Test Team",
        description: "A test team",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    teamId = teamRes.data.team._id;
    console.log("   ✅ Team created:", teamRes.data.team.name);
    console.log("   📋 Team ID:", teamId, "\n");

    // Step 3: Create Project
    console.log("3️⃣  Creating project...");
    const projectData = {
      name: "Test Project",
      description: "A test project",
      teamId: teamId,
      status: "active",
      priority: "high",
    };

    console.log("   📤 Sending data:", JSON.stringify(projectData, null, 2));

    const projectRes = await axios.post(`${API_URL}/projects`, projectData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("   ✅ Project created successfully!");
    console.log("   📁 Project:", projectRes.data.project.name);
    console.log("   🆔 Project ID:", projectRes.data.project._id);
    console.log("\n✅ All tests passed! Backend is working correctly.\n");

    return true;
  } catch (error) {
    console.error("\n❌ Error occurred:");
    console.error("   Message:", error.message);
    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Data:", error.response.data);
    }
    return false;
  }
}

testCreateProject();
