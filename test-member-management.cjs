const axios = require("axios");

const API_URL = "http://localhost:5000/api";

// Test configuration
let authToken1 = "";
let authToken2 = "";
let user1Id = "";
let user2Id = "";
let teamId = "";
let projectId = "";
let taskId = "";

const testUser1 = {
  name: "Team Owner",
  email: `owner${Date.now()}@test.com`,
  password: "test123",
};

const testUser2 = {
  name: "Team Member",
  email: `member${Date.now()}@test.com`,
  password: "test123",
};

// Helper function for API calls
const api = (token) =>
  axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

// Test functions
async function test1_RegisterUsers() {
  console.log("\n📝 TEST 1: Register Two Users");
  console.log("=".repeat(50));

  try {
    // Register user 1
    const res1 = await api().post("/auth/register", testUser1);
    authToken1 = res1.data.token;
    user1Id = res1.data.user._id;
    console.log("✅ User 1 registered:", testUser1.email);

    // Register user 2
    const res2 = await api().post("/auth/register", testUser2);
    authToken2 = res2.data.token;
    user2Id = res2.data.user._id;
    console.log("✅ User 2 registered:", testUser2.email);

    return true;
  } catch (error) {
    console.error("❌ Failed:", error.response?.data || error.message);
    return false;
  }
}

async function test2_SearchUsers() {
  console.log("\n🔍 TEST 2: Search Users (Non-Admin Access)");
  console.log("=".repeat(50));

  try {
    const res = await api(authToken1).get("/users/search");
    console.log("✅ User search successful");
    console.log(`   Found ${res.data.count} users`);
    console.log(`   Users: ${res.data.users.map((u) => u.name).join(", ")}`);
    return true;
  } catch (error) {
    console.error("❌ Failed:", error.response?.data || error.message);
    return false;
  }
}

async function test3_CreateTeam() {
  console.log("\n👥 TEST 3: Create Team");
  console.log("=".repeat(50));

  try {
    const res = await api(authToken1).post("/teams", {
      name: "Test Team",
      description: "Testing member management",
    });
    teamId = res.data.team._id;
    console.log("✅ Team created:", res.data.team.name);
    console.log(`   Team ID: ${teamId}`);
    console.log(`   Owner: ${res.data.team.owner.name}`);
    return true;
  } catch (error) {
    console.error("❌ Failed:", error.response?.data || error.message);
    return false;
  }
}

async function test4_AddMemberToTeam() {
  console.log("\n➕ TEST 4: Add Member to Team");
  console.log("=".repeat(50));

  try {
    const res = await api(authToken1).put(`/teams/${teamId}/add-member`, {
      userId: user2Id,
    });
    console.log("✅ Member added to team");
    console.log(`   Team: ${res.data.team.name}`);
    console.log(`   Members count: ${res.data.team.members.length}`);
    return true;
  } catch (error) {
    console.error("❌ Failed:", error.response?.data || error.message);
    return false;
  }
}

async function test5_GetTeamDetails() {
  console.log("\n📋 TEST 5: Get Team Details");
  console.log("=".repeat(50));

  try {
    const res = await api(authToken1).get(`/teams/${teamId}`);
    console.log("✅ Team details retrieved");
    console.log(`   Name: ${res.data.team.name}`);
    console.log(`   Owner: ${res.data.team.owner.name}`);
    console.log(`   Members: ${res.data.team.members.length}`);
    res.data.team.members.forEach((m) => {
      console.log(`     - ${m.name} (${m.email})`);
    });
    return true;
  } catch (error) {
    console.error("❌ Failed:", error.response?.data || error.message);
    return false;
  }
}

async function test6_CreateProject() {
  console.log("\n📁 TEST 6: Create Project");
  console.log("=".repeat(50));

  try {
    const res = await api(authToken1).post("/projects", {
      name: "Test Project",
      description: "Testing project member management",
      teamId: teamId,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    projectId = res.data.project._id;
    console.log("✅ Project created:", res.data.project.name);
    console.log(`   Project ID: ${projectId}`);
    console.log(`   Team: ${res.data.project.team.name || teamId}`);
    return true;
  } catch (error) {
    console.error("❌ Failed:", error.response?.data || error.message);
    return false;
  }
}

async function test7_AddMemberToProject() {
  console.log("\n➕ TEST 7: Add Member to Project");
  console.log("=".repeat(50));

  try {
    const res = await api(authToken1).put(`/projects/${projectId}/add-member`, {
      userId: user2Id,
      role: "MEMBER",
    });
    console.log("✅ Member added to project");
    console.log(`   Project: ${res.data.project.name}`);
    console.log(`   Members count: ${res.data.project.members.length}`);
    return true;
  } catch (error) {
    console.error("❌ Failed:", error.response?.data || error.message);
    return false;
  }
}

async function test8_GetProjectDetails() {
  console.log("\n📋 TEST 8: Get Project Details");
  console.log("=".repeat(50));

  try {
    const res = await api(authToken1).get(`/projects/${projectId}`);
    console.log("✅ Project details retrieved");
    console.log(`   Name: ${res.data.project.name}`);
    console.log(`   Owner: ${res.data.project.owner.name}`);
    console.log(`   Members: ${res.data.project.members.length}`);
    res.data.project.members.forEach((m) => {
      console.log(`     - ${m.name} (${m.email})`);
    });
    return true;
  } catch (error) {
    console.error("❌ Failed:", error.response?.data || error.message);
    return false;
  }
}

async function test9_CreateTask() {
  console.log("\n✅ TEST 9: Create Task");
  console.log("=".repeat(50));

  try {
    const res = await api(authToken1).post("/tasks", {
      title: "Test Task",
      description: "Testing task assignment",
      projectId: projectId,
      priority: "medium",
      status: "todo",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    taskId = res.data.task._id;
    console.log("✅ Task created:", res.data.task.title);
    console.log(`   Task ID: ${taskId}`);
    return true;
  } catch (error) {
    console.error("❌ Failed:", error.response?.data || error.message);
    return false;
  }
}

async function test10_AssignTask() {
  console.log("\n👤 TEST 10: Assign Task to Member");
  console.log("=".repeat(50));

  try {
    const res = await api(authToken1).put(`/tasks/${taskId}`, {
      assignedTo: user2Id,
    });
    console.log("✅ Task assigned");
    console.log(`   Task: ${res.data.task.title}`);
    console.log(`   Assigned to: ${res.data.task.assignedTo?.name || user2Id}`);
    return true;
  } catch (error) {
    console.error("❌ Failed:", error.response?.data || error.message);
    return false;
  }
}

async function test11_GetMyTasks() {
  console.log("\n📝 TEST 11: Get My Tasks (User 2)");
  console.log("=".repeat(50));

  try {
    const res = await api(authToken2).get("/tasks", {
      params: { assignedTo: user2Id },
    });
    console.log("✅ Tasks retrieved");
    console.log(`   Found ${res.data.count} assigned tasks`);
    res.data.tasks.forEach((t) => {
      console.log(`     - ${t.title} (${t.status})`);
    });
    return true;
  } catch (error) {
    console.error("❌ Failed:", error.response?.data || error.message);
    return false;
  }
}

async function test12_RemoveMemberFromProject() {
  console.log("\n➖ TEST 12: Remove Member from Project");
  console.log("=".repeat(50));

  try {
    const res = await api(authToken1).put(
      `/projects/${projectId}/remove-member`,
      {
        userId: user2Id,
      }
    );
    console.log("✅ Member removed from project");
    console.log(`   Remaining members: ${res.data.project.members.length}`);
    return true;
  } catch (error) {
    console.error("❌ Failed:", error.response?.data || error.message);
    return false;
  }
}

async function test13_RemoveMemberFromTeam() {
  console.log("\n➖ TEST 13: Remove Member from Team");
  console.log("=".repeat(50));

  try {
    const res = await api(authToken1).put(`/teams/${teamId}/remove-member`, {
      userId: user2Id,
    });
    console.log("✅ Member removed from team");
    console.log(`   Remaining members: ${res.data.team.members.length}`);
    return true;
  } catch (error) {
    console.error("❌ Failed:", error.response?.data || error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log("\n");
  console.log("🧪 MEMBER MANAGEMENT END-TO-END TEST");
  console.log("=".repeat(50));
  console.log("Testing: Team & Project Member Management + Task Assignment");
  console.log("=".repeat(50));

  const tests = [
    test1_RegisterUsers,
    test2_SearchUsers,
    test3_CreateTeam,
    test4_AddMemberToTeam,
    test5_GetTeamDetails,
    test6_CreateProject,
    test7_AddMemberToProject,
    test8_GetProjectDetails,
    test9_CreateTask,
    test10_AssignTask,
    test11_GetMyTasks,
    test12_RemoveMemberFromProject,
    test13_RemoveMemberFromTeam,
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await test();
    if (result) {
      passed++;
    } else {
      failed++;
      console.log("\n⚠️  Test failed, stopping execution");
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log("\n");
  console.log("=".repeat(50));
  console.log("📊 TEST RESULTS");
  console.log("=".repeat(50));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(
    `📈 Success Rate: ${((passed / tests.length) * 100).toFixed(1)}%`
  );
  console.log("=".repeat(50));

  if (passed === tests.length) {
    console.log(
      "\n🎉 ALL TESTS PASSED! Member management is working correctly!"
    );
  } else {
    console.log("\n⚠️  Some tests failed. Check the errors above.");
  }
}

// Run tests
runAllTests().catch((error) => {
  console.error("\n💥 Test suite crashed:", error.message);
  process.exit(1);
});
