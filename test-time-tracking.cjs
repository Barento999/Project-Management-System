const axios = require("axios");

const API_URL = "http://localhost:5000/api";
let token = "";
let userId = "";
let taskId = "";
let timeEntryId = "";

// Helper function to wait
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function testTimeTracking() {
  console.log("🧪 Testing Time Tracking System...\n");

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

    // Step 2: Get a task
    console.log("2️⃣ Fetching tasks...");
    const tasksRes = await axios.get(`${API_URL}/tasks`);
    if (tasksRes.data.tasks.length === 0) {
      console.log("❌ No tasks found. Please create a task first.");
      return;
    }
    taskId = tasksRes.data.tasks[0]._id;
    console.log(`✅ Found task: ${tasksRes.data.tasks[0].title}\n`);

    // Step 3: Start timer
    console.log("3️⃣ Starting timer...");
    const startRes = await axios.post(`${API_URL}/time-tracking/start`, {
      taskId: taskId,
      description: "Testing time tracking feature",
    });
    timeEntryId = startRes.data.timeEntry._id;
    console.log("✅ Timer started!");
    console.log(`   Entry ID: ${timeEntryId}`);
    console.log(`   Task: ${startRes.data.timeEntry.task.title}`);
    console.log(
      `   Started at: ${new Date(
        startRes.data.timeEntry.startTime
      ).toLocaleString()}\n`
    );

    // Step 4: Check running timer
    console.log("4️⃣ Checking running timer...");
    const runningRes = await axios.get(`${API_URL}/time-tracking/running`);
    if (runningRes.data.timeEntry) {
      console.log("✅ Running timer found!");
      console.log(`   Task: ${runningRes.data.timeEntry.task.title}`);
      console.log(`   Running: ${runningRes.data.timeEntry.isRunning}\n`);
    }

    // Step 5: Wait 3 seconds
    console.log("5️⃣ Waiting 3 seconds...");
    await wait(3000);
    console.log("✅ Wait complete\n");

    // Step 6: Stop timer
    console.log("6️⃣ Stopping timer...");
    const stopRes = await axios.put(
      `${API_URL}/time-tracking/${timeEntryId}/stop`
    );
    console.log("✅ Timer stopped!");
    console.log(`   Duration: ${stopRes.data.timeEntry.duration} minutes`);
    console.log(
      `   Started: ${new Date(
        stopRes.data.timeEntry.startTime
      ).toLocaleString()}`
    );
    console.log(
      `   Ended: ${new Date(stopRes.data.timeEntry.endTime).toLocaleString()}\n`
    );

    // Step 7: Create manual entry
    console.log("7️⃣ Creating manual time entry...");
    const manualRes = await axios.post(`${API_URL}/time-tracking/manual`, {
      taskId: taskId,
      description: "Manual entry for testing",
      duration: 30, // 30 minutes
    });
    console.log("✅ Manual entry created!");
    console.log(`   Duration: ${manualRes.data.timeEntry.duration} minutes\n`);

    // Step 8: Get all time entries
    console.log("8️⃣ Fetching all time entries...");
    const entriesRes = await axios.get(`${API_URL}/time-tracking`);
    console.log("✅ Time entries retrieved!");
    console.log(`   Total entries: ${entriesRes.data.count}`);
    console.log(`   Total hours: ${entriesRes.data.totalHours}h`);
    console.log(
      `   Total duration: ${entriesRes.data.totalDuration} minutes\n`
    );

    // Step 9: Get timesheet
    console.log("9️⃣ Fetching timesheet report...");
    const timesheetRes = await axios.get(`${API_URL}/time-tracking/timesheet`);
    console.log("✅ Timesheet retrieved!");
    console.log(`   Total hours: ${timesheetRes.data.totalHours}h`);
    console.log(
      `   Projects: ${Object.keys(timesheetRes.data.byProject).length}`
    );

    // Show breakdown by project
    Object.values(timesheetRes.data.byProject).forEach((projectData) => {
      console.log(
        `   - ${projectData.project.name}: ${(
          projectData.totalDuration / 60
        ).toFixed(2)}h (${projectData.entries.length} entries)`
      );
    });
    console.log("");

    // Step 10: Delete test entries
    console.log("🔟 Cleaning up test entries...");
    for (const entry of entriesRes.data.timeEntries) {
      await axios.delete(`${API_URL}/time-tracking/${entry._id}`);
    }
    console.log("✅ Test entries deleted\n");

    // Success summary
    console.log("🎉 SUCCESS! Time Tracking System Test Passed!\n");
    console.log("📊 Summary:");
    console.log("   ✅ Start Timer: Working");
    console.log("   ✅ Stop Timer: Working");
    console.log("   ✅ Running Timer Check: Working");
    console.log("   ✅ Manual Entry: Working");
    console.log("   ✅ Get Time Entries: Working");
    console.log("   ✅ Timesheet Report: Working");
    console.log("   ✅ Delete Entry: Working");
    console.log("\n✨ All time tracking features are working correctly!");
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
testTimeTracking();
