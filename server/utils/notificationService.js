const Notification = require("../models/Notification");
const {
  sendTaskAssignedEmail,
  sendTaskDueReminderEmail,
} = require("./emailService");

// Create notification helper
const createNotification = async (data) => {
  try {
    const notification = await Notification.create(data);

    // Send email if user has email notifications enabled
    if (data.recipient && data.recipient.notificationPreferences?.email) {
      const emailEnabled =
        data.recipient.notificationPreferences.email[
          getEmailPreferenceKey(data.type)
        ];

      if (emailEnabled) {
        await sendEmailNotification(data);
      }
    }

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

// Get email preference key from notification type
const getEmailPreferenceKey = (type) => {
  const mapping = {
    TASK_ASSIGNED: "taskAssigned",
    TASK_DUE: "taskDue",
    TASK_COMPLETED: "taskCompleted",
    TASK_UPDATED: "projectUpdates",
    PROJECT_UPDATED: "projectUpdates",
    COMMENT_ADDED: "projectUpdates",
    MENTION: "mentions",
    TEAM_INVITE: "projectUpdates",
    PROJECT_INVITE: "projectUpdates",
  };

  return mapping[type] || "projectUpdates";
};

// Send email notification based on type
const sendEmailNotification = async (data) => {
  try {
    switch (data.type) {
      case "TASK_ASSIGNED":
        if (data.task && data.project && data.recipient) {
          await sendTaskAssignedEmail(data.recipient, data.task, data.project);
        }
        break;
      case "TASK_DUE":
        if (data.task && data.project && data.recipient) {
          await sendTaskDueReminderEmail(
            data.recipient,
            data.task,
            data.project
          );
        }
        break;
      // Add more cases as needed
    }
  } catch (error) {
    console.error("Error sending email notification:", error);
  }
};

// Notify task assignment
const notifyTaskAssignment = async (task, assignedUser, assignedBy) => {
  await createNotification({
    recipient: assignedUser._id,
    sender: assignedBy._id,
    type: "TASK_ASSIGNED",
    title: "New Task Assigned",
    message: `${assignedBy.name} assigned you a task: ${task.title}`,
    entityType: "Task",
    entityId: task._id,
    task,
    recipient: assignedUser,
  });
};

// Notify task due soon
const notifyTaskDue = async (task, user, project) => {
  await createNotification({
    recipient: user._id,
    type: "TASK_DUE",
    title: "Task Due Soon",
    message: `Task "${task.title}" is due soon`,
    entityType: "Task",
    entityId: task._id,
    task,
    project,
    recipient: user,
  });
};

// Notify task completion
const notifyTaskCompletion = async (task, completedBy, projectOwner) => {
  if (completedBy._id.toString() !== projectOwner._id.toString()) {
    await createNotification({
      recipient: projectOwner._id,
      sender: completedBy._id,
      type: "TASK_COMPLETED",
      title: "Task Completed",
      message: `${completedBy.name} completed task: ${task.title}`,
      entityType: "Task",
      entityId: task._id,
    });
  }
};

// Notify comment with mention
const notifyMention = async (comment, mentionedUser, author) => {
  await createNotification({
    recipient: mentionedUser._id,
    sender: author._id,
    type: "MENTION",
    title: "You were mentioned",
    message: `${author.name} mentioned you in a comment`,
    entityType: "Comment",
    entityId: comment._id,
  });
};

module.exports = {
  createNotification,
  notifyTaskAssignment,
  notifyTaskDue,
  notifyTaskCompletion,
  notifyMention,
};
