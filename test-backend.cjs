const axios = require("axios");

const API_URL = "http://localhost:5000/api";
let authToken = "";
let userId = "";
let teamId = "";
let projectId = "";
let taskId = "";

const testUser = {
  name: "Test User",
  email: `test${Date.now()}@example.com`,
  password: "test123456",
};

console.log("🚀 Starting Backend API Tests...\n");

const request = async (method, endpoint, data = null, useAuth = false) => {
  try {
    const config = {
      method,
      url: `${API_URL}${endpoint}`,
      headers: useAuth ? { Authorization: `Bearer ${authToken}` } : {},
    };

    if (data) config.data = data;

    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

const runTests = async () => {
  let passed = 0;
  let total = 0;

  // 1. Register
  console.log("1️⃣  Testing User Registration...");
  total++;
  let result = await request("POST", "/auth/register", testUser);
  if (result.success) {
    authToken = result.data.token;
    userId = result.data.user._id;
    console.log("   ✅ Registration successful");
    passed++;
  } else {
    console.log("   ❌ Failed:", result.error);
    return;
  }

  // 2. Login
  console.log("\n2️⃣  Testing User Login...");
  total++;
  result = await request("POST", "/auth/login", {
    email: testUser.email,
    password: testUser.password,
  });
  if (result.success) {
    console.log("   ✅ Login successful");
    passed++;
  } else {
    console.log("   ❌ Failed:", result.error);
  }

  // 3. Get Profile
  console.log("\n3️⃣  Testing Get Profile...");
  total++;
  result = await request("GET", "/auth/profile", null, true);
  if (result.success) {
    console.log("   ✅ Profile retrieved");
    console.log(`   👤 Name: ${result.data.user.name}`);
    passed++;
  } else {
    console.log("   ❌ Failed:", result.error);
  }

  // 4. Create Team (must be before project)
  console.log("\n4️⃣  Testing Create Team...");
  total++;
  result = await request(
    "POST",
    "/teams",
    {
      name: "Test Team",
      description: "This is a test team",
    },
    true
  );
  if (result.success) {
    teamId = result.data.team._id;
    console.log("   ✅ Team created");
    console.log(`   👥 Team ID: ${teamId}`);
    passed++;
  } else {
    console.log("   ❌ Failed:", result.error);
  }

  // 5. Create Project
  console.log("\n5️⃣  Testing Create Project...");
  total++;
  result = await request(
    "POST",
    "/projects",
    {
      name: "Test Project",
      description: "This is a test project",
      team: teamId,
      status: "active",
      priority: "high",
    },
    true
  );
  if (result.success) {
    projectId = result.data.project._id;
    console.log("   ✅ Project created");
    console.log(`   📁 Project ID: ${projectId}`);
    passed++;
  } else {
    console.log("   ❌ Failed:", result.error);
  }

  // 6. Get Projects
  console.log("\n6️⃣  Testing Get Projects...");
  total++;
  result = await request("GET", "/projects", null, true);
  if (result.success) {
    console.log("   ✅ Projects retrieved");
    console.log(`   📊 Total projects: ${result.data.projects.length}`);
    passed++;
  } else {
    console.log("   ❌ Failed:", result.error);
  }

  // 7. Create Task
  console.log("\n7️⃣  Testing Create Task...");
  total++;
  result = await request(
    "POST",
    "/tasks",
    {
      title: "Test Task",
      description: "This is a test task",
      project: projectId,
      status: "todo",
      priority: "medium",
    },
    true
  );
  if (result.success) {
    taskId = result.data.task._id;
    console.log("   ✅ Task created");
    console.log(`   ✓ Task ID: ${taskId}`);
    passed++;
  } else {
    console.log("   ❌ Failed:", result.error);
  }

  // 8. Get Tasks
  console.log("\n8️⃣  Testing Get Tasks...");
  total++;
  result = await request("GET", "/tasks", null, true);
  if (result.success) {
    console.log("   ✅ Tasks retrieved");
    console.log(`   📋 Total tasks: ${result.data.tasks.length}`);
    passed++;
  } else {
    console.log("   ❌ Failed:", result.error);
  }

  // 9. Create Comment
  console.log("\n9️⃣  Testing Create Comment...");
  total++;
  result = await request(
    "POST",
    "/comments",
    {
      content: "This is a test comment",
      entityType: "Task",
      entityId: taskId,
    },
    true
  );
  if (result.success) {
    console.log("   ✅ Comment created");
    passed++;
  } else {
    console.log("   ❌ Failed:", result.error);
  }

  // 10. Get Notifications
  console.log("\n🔟 Testing Get Notifications...");
  total++;
  result = await request("GET", "/notifications", null, true);
  if (result.success) {
    console.log("   ✅ Notifications retrieved");
    console.log(
      `   🔔 Total notifications: ${result.data.notifications.length}`
    );
    passed++;
  } else {
    console.log("   ❌ Failed:", result.error);
  }

  // 11. Time Tracking
  console.log("\n1️⃣1️⃣  Testing Time Tracking...");
  total++;
  result = await request(
    "POST",
    "/time-tracking/start",
    {
      task: taskId,
      description: "Working on test task",
    },
    true
  );
  if (result.success) {
    console.log("   ✅ Time tracking started");
    passed++;
  } else {
    console.log("   ❌ Failed:", result.error);
  }

  // 12. Activity Logs
  console.log("\n1️⃣2️⃣  Testing Activity Logs...");
  total++;
  result = await request("GET", "/activity-logs", null, true);
  if (result.success) {
    console.log("   ✅ Activity logs retrieved");
    console.log(`   📝 Total logs: ${result.data.logs.length}`);
    passed++;
  } else {
    console.log("   ❌ Failed:", result.error);
  }

  console.log("\n" + "=".repeat(50));
  console.log(`\n📊 Test Results: ${passed}/${total} tests passed`);

  if (passed === total) {
    console.log("🎉 All backend endpoints are working!\n");
  } else {
    console.log(
      `⚠️  ${total - passed} test(s) failed. Check the output above.\n`
    );
  }
};

runTests().catch(console.error);
