const axios = require("axios");

const API_URL = "http://localhost:5000/api";
let token = "";
let userId = "";
let taskId = "";
let projectId = "";
let commentId = "";

async function testCommentsAndActivity() {
  console.log("🧪 Testing Comments & Activity Log System...\n");

  try {
    // Step 1: Login
    console.log("1️⃣ Logging in...");
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: "test@example.com",
      password: "password123",
    });
    token = loginRes.data.token;
    userId = loginRes.data.user._id;
    console.log("✅ Logged in successfully\n");

    // Set default headers
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Step 2: Get a task and project
    console.log("2️⃣ Fetching tasks and projects...");
    const [tasksRes, projectsRes] = await Promise.all([
      axios.get(`${API_URL}/tasks`),
      axios.get(`${API_URL}/projects`),
    ]);

    if (tasksRes.data.tasks.length === 0) {
      console.log("❌ No tasks found. Please create a task first.");
      return;
    }
    if (projectsRes.data.projects.length === 0) {
      console.log("❌ No projects found. Please create a project first.");
      return;
    }

    taskId = tasksRes.data.tasks[0]._id;
    projectId = projectsRes.data.projects[0]._id;
    console.log(`✅ Found task: ${tasksRes.data.tasks[0].title}`);
    console.log(`✅ Found project: ${projectsRes.data.projects[0].name}\n`);

    // Step 3: Create comment on task
    console.log("3️⃣ Creating comment on task...");
    const commentRes = await axios.post(`${API_URL}/comments`, {
      content: "This is a test comment! Great work on this task. 🎉",
      entityType: "Task",
      entityId: taskId,
    });
    commentId = commentRes.data.comment._id;
    console.log("✅ Comment created!");
    console.log(`   Comment ID: ${commentId}`);
    console.log(`   Content: ${commentRes.data.comment.content}`);
    console.log(`   Author: ${commentRes.data.comment.author.name}\n`);

    // Step 4: Get comments for task
    console.log("4️⃣ Fetching comments for task...");
    const taskCommentsRes = await axios.get(
      `${API_URL}/comments/Task/${taskId}`
    );
    console.log("✅ Comments retrieved!");
    console.log(`   Total comments: ${taskCommentsRes.data.count}`);
    taskCommentsRes.data.comments.forEach((comment, index) => {
      console.log(
        `   ${index + 1}. ${comment.author.name}: ${comment.content.substring(
          0,
          50
        )}...`
      );
    });
    console.log("");

    // Step 5: Create comment on project
    console.log("5️⃣ Creating comment on project...");
    const projectCommentRes = await axios.post(`${API_URL}/comments`, {
      content: "Project is progressing well! Keep up the good work. 💪",
      entityType: "Project",
      entityId: projectId,
    });
    console.log("✅ Project comment created!");
    console.log(`   Content: ${projectCommentRes.data.comment.content}\n`);

    // Step 6: Update comment
    console.log("6️⃣ Updating comment...");
    const updateRes = await axios.put(`${API_URL}/comments/${commentId}`, {
      content: "This is an UPDATED test comment! Excellent work! ⭐",
    });
    console.log("✅ Comment updated!");
    console.log(`   New content: ${updateRes.data.comment.content}`);
    console.log(`   Is edited: ${updateRes.data.comment.isEdited}\n`);

    // Step 7: Get activity logs for task
    console.log("7️⃣ Fetching activity logs for task...");
    const taskActivityRes = await axios.get(
      `${API_URL}/activity-logs/Task/${taskId}`
    );
    console.log("✅ Activity logs retrieved!");
    console.log(`   Total activities: ${taskActivityRes.data.count}`);
    taskActivityRes.data.logs.slice(0, 5).forEach((log, index) => {
      console.log(
        `   ${index + 1}. ${log.user.name} - ${log.action}: ${log.description}`
      );
    });
    console.log("");

    // Step 8: Get activity logs for project
    console.log("8️⃣ Fetching activity logs for project...");
    const projectActivityRes = await axios.get(
      `${API_URL}/activity-logs/Project/${projectId}`
    );
    console.log("✅ Activity logs retrieved!");
    console.log(`   Total activities: ${projectActivityRes.data.count}`);
    projectActivityRes.data.logs.slice(0, 5).forEach((log, index) => {
      console.log(
        `   ${index + 1}. ${log.user.name} - ${log.action}: ${log.description}`
      );
    });
    console.log("");

    // Step 9: Get all activity logs for user
    console.log("9️⃣ Fetching all activity logs...");
    const allActivityRes = await axios.get(`${API_URL}/activity-logs?limit=10`);
    console.log("✅ All activity logs retrieved!");
    console.log(`   Total activities: ${allActivityRes.data.count}`);
    console.log(
      `   Page: ${allActivityRes.data.page} of ${allActivityRes.data.pages}`
    );
    console.log("");

    // Step 10: Delete test comment
    console.log("🔟 Cleaning up test comment...");
    await axios.delete(`${API_URL}/comments/${commentId}`);
    console.log("✅ Test comment deleted\n");

    // Success summary
    console.log("🎉 SUCCESS! Comments & Activity Log System Test Passed!\n");
    console.log("📊 Summary:");
    console.log("   ✅ Create Comment: Working");
    console.log("   ✅ Get Comments: Working");
    console.log("   ✅ Update Comment: Working");
    console.log("   ✅ Delete Comment: Working");
    console.log("   ✅ Activity Logs (Task): Working");
    console.log("   ✅ Activity Logs (Project): Working");
    console.log("   ✅ Activity Logs (All): Working");
    console.log(
      "\n✨ All comments and activity features are working correctly!"
    );
  } catch (error) {
    console.error(
      "\n❌ ERROR:",
      error.response?.data?.message || error.message
    );
    if (error.response?.data) {
      console.error("Details:", error.response.data);
    }
    process.exit(1);
  }
}

// Run the test
testCommentsAndActivity();
