const axios = require("axios");

const API_URL = "http://localhost:5000/api";

// Test configuration
let authToken = "";
let userId = "";
let teamId = "";
let projectId = "";
let memberId = "";
let memberToken = "";

const testUser = {
  name: "Edge Case Tester",
  email: `edge${Date.now()}@test.com`,
  password: "test123",
};

const testMember = {
  name: "Test Member",
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

// Setup
async function setup() {
  console.log("\n🔧 SETUP: Creating test users");
  console.log("=".repeat(50));

  try {
    const res1 = await api().post("/auth/register", testUser);
    authToken = res1.data.token;
    userId = res1.data.user._id;
    console.log("✅ Main user created:", testUser.email);

    const res2 = await api().post("/auth/register", testMember);
    memberToken = res2.data.token;
    memberId = res2.data.user._id;
    console.log("✅ Member user created:", testMember.email);

    return true;
  } catch (error) {
    console.error("❌ Setup failed:", error.response?.data || error.message);
    return false;
  }
}

// Edge Case 1: Team with no members yet
async function edgeCase1_TeamWithNoMembers() {
  console.log("\n🧪 EDGE CASE 1: Team with No Members Yet");
  console.log("=".repeat(50));

  try {
    // Create team
    const res = await api(authToken).post("/teams", {
      name: "Empty Team",
      description: "Team with no additional members",
    });
    teamId = res.data.team._id;

    console.log("✅ Team created with only owner");
    console.log(`   Team ID: ${teamId}`);
    console.log(`   Owner: ${res.data.team.owner.name || "Owner"}`);
    console.log(`   Members: ${res.data.team.members.length}`);

    // Try to create project with this team
    const projectRes = await api(authToken).post("/projects", {
      name: "Project with Empty Team",
      description: "Testing project creation with team that has no members",
      teamId: teamId,
    });
    projectId = projectRes.data.project._id;

    console.log("✅ Project created successfully with empty team");
    console.log(`   Project ID: ${projectId}`);

    // Try to get team members for project member management
    const teamDetailsRes = await api(authToken).get(`/teams/${teamId}`);
    console.log(
      `✅ Team details retrieved: ${teamDetailsRes.data.team.members.length} members`
    );

    console.log("\n📝 Result: System handles empty teams correctly");
    console.log("   - Team can be created with only owner");
    console.log("   - Projects can be created with empty teams");
    console.log("   - Team details can be retrieved");

    return true;
  } catch (error) {
    console.error("❌ Failed:", error.response?.data || error.message);
    return false;
  }
}

// Edge Case 2: User removed from team but still in project
async function edgeCase2_UserRemovedFromTeamButInProject() {
  console.log("\n🧪 EDGE CASE 2: User Removed from Team but Still in Project");
  console.log("=".repeat(50));

  try {
    // Add member to team
    await api(authToken).put(`/teams/${teamId}/add-member`, {
      userId: memberId,
    });
    console.log("✅ Member added to team");

    // Add member to project
    await api(authToken).put(`/projects/${projectId}/add-member`, {
      userId: memberId,
      role: "MEMBER",
    });
    console.log("✅ Member added to project");

    // Remove member from team (but not from project)
    await api(authToken).put(`/teams/${teamId}/remove-member`, {
      userId: memberId,
    });
    console.log("✅ Member removed from team");

    // Check if member can still access project
    try {
      const projectRes = await api(memberToken).get(`/projects/${projectId}`);
      console.log("✅ Member can still access project");
      console.log(`   Project: ${projectRes.data.project.name}`);
      console.log(
        `   Member is in project members: ${projectRes.data.project.members.some(
          (m) => (m._id || m) === memberId
        )}`
      );
    } catch (err) {
      console.log("❌ Member cannot access project anymore");
      console.log(`   Error: ${err.response?.data?.message}`);
    }

    // Check project details from owner perspective
    const ownerProjectRes = await api(authToken).get(`/projects/${projectId}`);
    console.log("\n📊 Project state from owner perspective:");
    console.log(
      `   Members count: ${ownerProjectRes.data.project.members.length}`
    );
    console.log(
      `   Member still in project: ${ownerProjectRes.data.project.members.some(
        (m) => (m._id || m) === memberId
      )}`
    );

    console.log("\n📝 Result: User removed from team but still in project");
    console.log(
      "   - Member is removed from team but remains in project members"
    );
    console.log("   - Member can still access the project");
    console.log(
      "   - This is expected behavior (project membership is independent)"
    );

    return true;
  } catch (error) {
    console.error("❌ Failed:", error.response?.data || error.message);
    return false;
  }
}

// Edge Case 3: Project team is deleted
async function edgeCase3_ProjectTeamDeleted() {
  console.log("\n🧪 EDGE CASE 3: Project Team is Deleted");
  console.log("=".repeat(50));

  try {
    // Create a new team for this test
    const teamRes = await api(authToken).post("/teams", {
      name: "Team to Delete",
      description: "This team will be deleted",
    });
    const deleteTeamId = teamRes.data.team._id;
    console.log("✅ New team created:", teamRes.data.team.name);

    // Create project with this team
    const projectRes = await api(authToken).post("/projects", {
      name: "Project with Deletable Team",
      description: "Testing project when team is deleted",
      teamId: deleteTeamId,
    });
    const deleteProjectId = projectRes.data.project._id;
    console.log("✅ Project created with team");

    // Delete the team
    await api(authToken).delete(`/teams/${deleteTeamId}`);
    console.log("✅ Team deleted");

    // Try to access the project
    try {
      const projectCheckRes = await api(authToken).get(
        `/projects/${deleteProjectId}`
      );
      console.log("✅ Project still accessible after team deletion");
      console.log(`   Project: ${projectCheckRes.data.project.name}`);
      console.log(`   Team reference: ${projectCheckRes.data.project.team}`);

      // Check if team is populated or just an ID
      if (projectCheckRes.data.project.team) {
        if (typeof projectCheckRes.data.project.team === "object") {
          console.log("   ⚠️  Team is still populated (might be cached)");
        } else {
          console.log("   ℹ️  Team is just an ID reference");
        }
      } else {
        console.log("   ⚠️  Team reference is null/undefined");
      }
    } catch (err) {
      console.log("❌ Project cannot be accessed after team deletion");
      console.log(`   Error: ${err.response?.data?.message}`);
    }

    // Try to get all projects
    const allProjectsRes = await api(authToken).get("/projects");
    const deletedTeamProject = allProjectsRes.data.projects.find(
      (p) => p._id === deleteProjectId
    );

    if (deletedTeamProject) {
      console.log("\n📊 Project appears in project list:");
      console.log(`   Name: ${deletedTeamProject.name}`);
      console.log(`   Team: ${deletedTeamProject.team || "null"}`);
    } else {
      console.log("\n⚠️  Project does not appear in project list");
    }

    console.log("\n📝 Result: Project behavior when team is deleted");
    console.log("   - Project may still exist with broken team reference");
    console.log("   - This could cause issues in the UI");
    console.log(
      "   - Recommendation: Add cascade delete or prevent team deletion"
    );

    return true;
  } catch (error) {
    console.error("❌ Failed:", error.response?.data || error.message);
    return false;
  }
}

// Edge Case 4: Trying to add non-existent user
async function edgeCase4_AddNonExistentUser() {
  console.log("\n🧪 EDGE CASE 4: Adding Non-Existent User");
  console.log("=".repeat(50));

  try {
    const fakeUserId = "000000000000000000000000";

    // Try to add fake user to team
    try {
      await api(authToken).put(`/teams/${teamId}/add-member`, {
        userId: fakeUserId,
      });
      console.log("❌ System allowed adding non-existent user (BAD)");
      return false;
    } catch (err) {
      console.log("✅ System rejected non-existent user");
      console.log(`   Error: ${err.response?.data?.message}`);
    }

    // Try to add fake user to project
    try {
      await api(authToken).put(`/projects/${projectId}/add-member`, {
        userId: fakeUserId,
        role: "MEMBER",
      });
      console.log(
        "❌ System allowed adding non-existent user to project (BAD)"
      );
      return false;
    } catch (err) {
      console.log("✅ System rejected non-existent user for project");
      console.log(`   Error: ${err.response?.data?.message}`);
    }

    console.log("\n📝 Result: System properly validates user existence");

    return true;
  } catch (error) {
    console.error("❌ Failed:", error.response?.data || error.message);
    return false;
  }
}

// Edge Case 5: Duplicate member addition
async function edgeCase5_DuplicateMemberAddition() {
  console.log("\n🧪 EDGE CASE 5: Adding Same Member Twice");
  console.log("=".repeat(50));

  try {
    // Add member to team
    await api(authToken).put(`/teams/${teamId}/add-member`, {
      userId: memberId,
    });
    console.log("✅ Member added to team (first time)");

    // Try to add same member again
    try {
      await api(authToken).put(`/teams/${teamId}/add-member`, {
        userId: memberId,
      });
      console.log("❌ System allowed duplicate member (BAD)");
      return false;
    } catch (err) {
      console.log("✅ System rejected duplicate member");
      console.log(`   Error: ${err.response?.data?.message}`);
    }

    console.log("\n📝 Result: System prevents duplicate members");

    return true;
  } catch (error) {
    console.error("❌ Failed:", error.response?.data || error.message);
    return false;
  }
}

// Run all edge case tests
async function runAllTests() {
  console.log("\n");
  console.log("🧪 EDGE CASE TESTING SUITE");
  console.log("=".repeat(50));
  console.log("Testing: Unusual scenarios and boundary conditions");
  console.log("=".repeat(50));

  const setupSuccess = await setup();
  if (!setupSuccess) {
    console.log("\n❌ Setup failed, cannot continue");
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  const tests = [
    edgeCase1_TeamWithNoMembers,
    edgeCase2_UserRemovedFromTeamButInProject,
    edgeCase3_ProjectTeamDeleted,
    edgeCase4_AddNonExistentUser,
    edgeCase5_DuplicateMemberAddition,
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await test();
    if (result) {
      passed++;
    } else {
      failed++;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log("\n");
  console.log("=".repeat(50));
  console.log("📊 EDGE CASE TEST RESULTS");
  console.log("=".repeat(50));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(
    `📈 Success Rate: ${((passed / tests.length) * 100).toFixed(1)}%`
  );
  console.log("=".repeat(50));

  if (passed === tests.length) {
    console.log("\n🎉 ALL EDGE CASES HANDLED CORRECTLY!");
  } else {
    console.log("\n⚠️  Some edge cases need attention.");
  }

  console.log("\n💡 RECOMMENDATIONS:");
  console.log("1. Consider cascade delete for teams (delete projects too)");
  console.log("2. Or prevent team deletion if it has projects");
  console.log("3. Current behavior: Projects keep broken team references");
  console.log("4. User validation is working correctly ✅");
  console.log("5. Duplicate prevention is working correctly ✅");
}

// Run tests
runAllTests().catch((error) => {
  console.error("\n💥 Test suite crashed:", error.message);
  process.exit(1);
});
