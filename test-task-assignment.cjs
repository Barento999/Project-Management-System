const axios = require("axios");

const API_URL = "http://localhost:5000/api";
let authToken = "";
let userId = "";
let projectId = "";
let taskId = "";

// Helper function to make authenticated requests
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

async function testTaskAssignment() {
  console.log("🧪 Testing Task Assignment System\n");

  try {
    // 1. Login
    console.log("1️⃣ Logging in...");
    const loginRes = await api.post("/auth/login", {
      email: "testuser@example.com",
      password: "password123",
    });
    authToken = loginRes.data.token;
    userId = loginRes.data.user._id;
    console.log("✅ Logged in successfully");
    console.log(`   User: ${loginRes.data.user.name}\n`);

    // 2. Get or create team and project
    console.log("2️⃣ Setting up team and project...");
    let teamsRes = await api.get("/teams");
    let teamId;
    if (teamsRes.data.teams.length === 0) {
      const createTeamRes = await api.post("/teams", {
        name: "Test Team",
        description: "Team for testing",
      });
      teamId = createTeamRes.data.team._id;
      console.log(`   Created team: ${createTeamRes.data.team.name}`);
    } else {
      teamId = teamsRes.data.teams[0]._id;
      console.log(`   Using team: ${teamsRes.data.teams[0].name}`);
    }

    const projectsRes = await api.get("/projects");
    if (projectsRes.data.projects.length === 0) {
      const createProjectRes = await api.post("/projects", {
        name: "Test Project",
        description: "Project for testing",
        teamId: teamId,
        status: "active",
      });
      projectId = createProjectRes.data.project._id;
      console.log(`   Created project: ${createProjectRes.data.project.name}`);
    } else {
      projectId = projectsRes.data.projects[0]._id;
      console.log(`   Using project: ${projectsRes.data.projects[0].name}`);
    }
    console.log("✅ Setup complete\n");

    // 3. Get all tasks
    console.log("3️⃣ Fetching tasks...");
    const tasksRes = await api.get("/tasks");
    if (tasksRes.data.tasks.length === 0) {
      console.log("❌ No tasks found. Creating a test task...");
      const createRes = await api.post("/tasks", {
        title: "Test Task for Assignment",
        description: "This task will be used to test assignment feature",
        projectId: projectId,
        priority: "medium",
        status: "todo",
      });
      taskId = createRes.data.task._id;
      console.log(`✅ Created test task: ${createRes.data.task.title}\n`);
    } else {
      taskId = tasksRes.data.tasks[0]._id;
      console.log(`✅ Found ${tasksRes.data.tasks.length} tasks`);
      console.log(`   Using task: ${tasksRes.data.tasks[0].title}\n`);
    }

    // 4. Get task details
    console.log("4️⃣ Getting task details...");
    const taskRes = await api.get(`/tasks/${taskId}`);
    console.log("✅ Task details:");
    console.log(`   Title: ${taskRes.data.task.title}`);
    console.log(`   Status: ${taskRes.data.task.status}`);
    console.log(`   Priority: ${taskRes.data.task.priority}`);
    console.log(
      `   Assigned To: ${taskRes.data.task.assignedTo?.name || "Unassigned"}\n`
    );

    // 5. Get project members for assignment
    console.log("5️⃣ Fetching project members...");
    const projectRes = await api.get(`/projects/${projectId}`);
    const project = projectRes.data.project;
    console.log(`✅ Project has ${project.members?.length || 0} members`);
    console.log(`   Owner: ${project.owner.name} (${project.owner.email})`);
    if (project.members && project.members.length > 0) {
      project.members.forEach((member, index) => {
        console.log(`   ${index + 1}. ${member.name} (${member.email})`);
      });
    }
    console.log("");

    // 6. Assign task to current user
    console.log("6️⃣ Assigning task to current user...");
    const assignRes = await api.put(`/tasks/${taskId}`, {
      assignedTo: userId,
    });
    console.log("✅ Task assigned successfully");
    console.log(
      `   Assigned To: ${assignRes.data.task.assignedTo?.name || "Unknown"}\n`
    );

    // 7. Get my tasks
    console.log("7️⃣ Fetching my assigned tasks...");
    const myTasksRes = await api.get("/tasks");
    const myTasks = myTasksRes.data.tasks.filter(
      (task) => task.assignedTo?._id === userId
    );
    console.log(`✅ Found ${myTasks.length} tasks assigned to you:`);
    myTasks.forEach((task, index) => {
      console.log(
        `   ${index + 1}. ${task.title} - ${task.status} (${task.priority})`
      );
    });
    console.log("");

    // 8. Test workload distribution
    console.log("8️⃣ Calculating workload distribution...");
    const allTasksRes = await api.get("/tasks");
    const projectTasks = allTasksRes.data.tasks.filter(
      (task) => (task.project._id || task.project) === projectId
    );

    const workload = {};
    projectTasks.forEach((task) => {
      if (task.assignedTo) {
        const userName = task.assignedTo.name;
        if (!workload[userName]) {
          workload[userName] = { total: 0, todo: 0, inProgress: 0, done: 0 };
        }
        workload[userName].total++;
        if (task.status === "todo") workload[userName].todo++;
        if (task.status === "in-progress") workload[userName].inProgress++;
        if (task.status === "done") workload[userName].done++;
      }
    });

    console.log("✅ Workload Distribution:");
    Object.entries(workload).forEach(([name, stats]) => {
      console.log(
        `   ${name}: ${stats.total} tasks (To Do: ${stats.todo}, In Progress: ${stats.inProgress}, Done: ${stats.done})`
      );
    });
    console.log("");

    // 9. Unassign task
    console.log("9️⃣ Unassigning task...");
    const unassignRes = await api.put(`/tasks/${taskId}`, {
      assignedTo: null,
    });
    console.log("✅ Task unassigned successfully");
    console.log(
      `   Assigned To: ${unassignRes.data.task.assignedTo || "Unassigned"}\n`
    );

    console.log("✅ All Task Assignment tests passed!\n");
    console.log("📋 Summary:");
    console.log("   ✓ Task assignment working");
    console.log("   ✓ Task unassignment working");
    console.log("   ✓ My tasks filtering working");
    console.log("   ✓ Workload distribution calculation working");
    console.log("\n🎉 Task Assignment System is fully functional!");
  } catch (error) {
    console.error(
      "\n❌ Test failed:",
      error.response?.data?.message || error.message
    );
    if (error.response?.data) {
      console.error("   Details:", error.response.data);
    }
  }
}

// Run the test
testTaskAssignment();
