const axios = require("axios");

const API_URL = "http://localhost:5000/api";

async function testFullFlow() {
  console.log("🧪 Testing Complete Application Flow...\n");
  console.log("=".repeat(60));

  let token = "";
  let userId = "";
  let teamId = "";
  let projectId = "";
  let taskId = "";

  try {
    // Step 1: Register User
    console.log("\n1️⃣  STEP 1: Register User");
    console.log("-".repeat(60));
    const email = `testuser${Date.now()}@example.com`;
    const registerRes = await axios.post(`${API_URL}/auth/register`, {
      name: "Test User",
      email: email,
      password: "test123456",
    });

    token = registerRes.data.token;
    userId = registerRes.data.user._id;
    console.log("   ✅ User registered successfully");
    console.log("   📧 Email:", email);
    console.log("   👤 User ID:", userId);
    console.log("   🔑 Token received");

    // Step 2: Create Team
    console.log("\n2️⃣  STEP 2: Create Team");
    console.log("-".repeat(60));
    const teamRes = await axios.post(
      `${API_URL}/teams`,
      {
        name: "Development Team",
        description: "Our awesome development team",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    teamId = teamRes.data.team._id;
    console.log("   ✅ Team created successfully");
    console.log("   👥 Team Name:", teamRes.data.team.name);
    console.log("   🆔 Team ID:", teamId);

    // Step 3: Create Project
    console.log("\n3️⃣  STEP 3: Create Project");
    console.log("-".repeat(60));
    const projectRes = await axios.post(
      `${API_URL}/projects`,
      {
        name: "Website Redesign",
        description: "Complete redesign of company website",
        teamId: teamId,
        status: "active",
        priority: "high",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    projectId = projectRes.data.project._id;
    console.log("   ✅ Project created successfully");
    console.log("   📁 Project Name:", projectRes.data.project.name);
    console.log("   🆔 Project ID:", projectId);
    console.log("   📊 Status:", projectRes.data.project.status);
    console.log("   ⚡ Priority:", projectRes.data.project.priority);

    // Step 4: Create Task
    console.log("\n4️⃣  STEP 4: Create Task");
    console.log("-".repeat(60));
    const taskRes = await axios.post(
      `${API_URL}/tasks`,
      {
        title: "Design Homepage",
        description: "Create mockups for the new homepage",
        projectId: projectId, // Backend expects projectId
        status: "todo",
        priority: "high",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    taskId = taskRes.data.task._id;
    console.log("   ✅ Task created successfully");
    console.log("   ✓ Task Title:", taskRes.data.task.title);
    console.log("   🆔 Task ID:", taskId);
    console.log("   📊 Status:", taskRes.data.task.status);
    console.log("   ⚡ Priority:", taskRes.data.task.priority);

    // Step 5: Verify Data
    console.log("\n5️⃣  STEP 5: Verify All Data");
    console.log("-".repeat(60));

    const [teamsCheck, projectsCheck, tasksCheck] = await Promise.all([
      axios.get(`${API_URL}/teams`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${API_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    console.log("   ✅ Teams in database:", teamsCheck.data.teams.length);
    console.log(
      "   ✅ Projects in database:",
      projectsCheck.data.projects.length
    );
    console.log("   ✅ Tasks in database:", tasksCheck.data.tasks.length);

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("🎉 SUCCESS! Complete Flow Test Passed!");
    console.log("=".repeat(60));
    console.log("\n📊 Summary:");
    console.log("   ✅ User Registration: Working");
    console.log("   ✅ Team Creation: Working");
    console.log("   ✅ Project Creation: Working");
    console.log("   ✅ Task Creation: Working");
    console.log("   ✅ Data Retrieval: Working");
    console.log("\n🎯 Test Data Created:");
    console.log("   👤 User:", email);
    console.log("   👥 Team:", "Development Team");
    console.log("   📁 Project:", "Website Redesign");
    console.log("   ✓ Task:", "Design Homepage");
    console.log("\n✨ All backend endpoints are working correctly!");
    console.log("✨ You can now use the frontend with confidence!\n");

    return true;
  } catch (error) {
    console.error("\n❌ ERROR OCCURRED:");
    console.error("   Message:", error.message);
    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Data:", JSON.stringify(error.response.data, null, 2));
    }
    console.log("\n💡 Check:");
    console.log("   1. Backend is running on port 5000");
    console.log("   2. MongoDB is connected");
    console.log("   3. No other errors in backend logs\n");
    return false;
  }
}

testFullFlow();
