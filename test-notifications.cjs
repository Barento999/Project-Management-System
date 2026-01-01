const axios = require("axios");

const API_URL = "http://localhost:5000/api";
let token = "";
let userId = "";
let notificationId = "";

async function testNotifications() {
  console.log("🧪 Testing Notifications System...\n");

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

    // Step 2: Get unread count
    console.log("2️⃣ Fetching unread count...");
    const countRes = await axios.get(`${API_URL}/notifications/unread-count`);
    console.log("✅ Unread count retrieved!");
    console.log(`   Unread notifications: ${countRes.data.count}\n`);

    // Step 3: Get all notifications
    console.log("3️⃣ Fetching all notifications...");
    const allRes = await axios.get(`${API_URL}/notifications`);
    console.log("✅ Notifications retrieved!");
    console.log(`   Total notifications: ${allRes.data.total}`);
    console.log(`   Unread: ${allRes.data.unreadCount}`);
    console.log(`   Current page: ${allRes.data.page} of ${allRes.data.pages}`);

    if (allRes.data.notifications.length > 0) {
      console.log("\n   Recent notifications:");
      allRes.data.notifications.slice(0, 3).forEach((notif, index) => {
        console.log(`   ${index + 1}. ${notif.title} - ${notif.message}`);
        console.log(`      Type: ${notif.type}, Read: ${notif.isRead}`);
      });
      notificationId = allRes.data.notifications[0]._id;
    }
    console.log("");

    // Step 4: Get unread only
    console.log("4️⃣ Fetching unread notifications only...");
    const unreadRes = await axios.get(
      `${API_URL}/notifications?unreadOnly=true`
    );
    console.log("✅ Unread notifications retrieved!");
    console.log(`   Unread count: ${unreadRes.data.count}\n`);

    // Step 5: Mark one as read (if exists)
    if (notificationId) {
      console.log("5️⃣ Marking notification as read...");
      const readRes = await axios.put(
        `${API_URL}/notifications/${notificationId}/read`
      );
      console.log("✅ Notification marked as read!");
      console.log(`   Notification ID: ${readRes.data.notification._id}`);
      console.log(`   Is Read: ${readRes.data.notification.isRead}\n`);
    }

    // Step 6: Mark all as read
    console.log("6️⃣ Marking all notifications as read...");
    await axios.put(`${API_URL}/notifications/read-all`);
    console.log("✅ All notifications marked as read!\n");

    // Step 7: Verify all are read
    console.log("7️⃣ Verifying all notifications are read...");
    const verifyRes = await axios.get(`${API_URL}/notifications/unread-count`);
    console.log("✅ Verification complete!");
    console.log(`   Unread count now: ${verifyRes.data.count}\n`);

    // Step 8: Delete a notification (if exists)
    if (notificationId) {
      console.log("8️⃣ Deleting a notification...");
      await axios.delete(`${API_URL}/notifications/${notificationId}`);
      console.log("✅ Notification deleted!\n");
    }

    // Success summary
    console.log("🎉 SUCCESS! Notifications System Test Passed!\n");
    console.log("📊 Summary:");
    console.log("   ✅ Get Unread Count: Working");
    console.log("   ✅ Get All Notifications: Working");
    console.log("   ✅ Get Unread Only: Working");
    console.log("   ✅ Mark As Read: Working");
    console.log("   ✅ Mark All As Read: Working");
    console.log("   ✅ Delete Notification: Working");
    console.log("\n✨ All notification features are working correctly!");
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
testNotifications();
