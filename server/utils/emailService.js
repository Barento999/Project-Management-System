// Email service utility
// This is a placeholder implementation. In production, use services like:
// - SendGrid
// - AWS SES
// - Nodemailer with SMTP

const sendEmail = async (options) => {
  // For development, just log the email
  console.log("📧 Email would be sent:");
  console.log("To:", options.to);
  console.log("Subject:", options.subject);
  console.log("Message:", options.message);

  // In production, implement actual email sending:
  /*
  const nodemailer = require('nodemailer');
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: options.to,
    subject: options.subject,
    html: options.message
  };

  await transporter.sendMail(mailOptions);
  */

  return true;
};

const sendTaskAssignedEmail = async (user, task, project) => {
  const message = `
    <h2>New Task Assigned</h2>
    <p>Hi ${user.name},</p>
    <p>You have been assigned a new task:</p>
    <h3>${task.title}</h3>
    <p><strong>Project:</strong> ${project.name}</p>
    <p><strong>Priority:</strong> ${task.priority}</p>
    <p><strong>Due Date:</strong> ${
      task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Not set"
    }</p>
    <p>Please log in to view more details.</p>
  `;

  await sendEmail({
    to: user.email,
    subject: "New Task Assigned",
    message,
  });
};

const sendTaskDueReminderEmail = async (user, task, project) => {
  const message = `
    <h2>Task Due Soon</h2>
    <p>Hi ${user.name},</p>
    <p>This is a reminder that the following task is due soon:</p>
    <h3>${task.title}</h3>
    <p><strong>Project:</strong> ${project.name}</p>
    <p><strong>Due Date:</strong> ${new Date(
      task.dueDate
    ).toLocaleDateString()}</p>
    <p>Please log in to update the task status.</p>
  `;

  await sendEmail({
    to: user.email,
    subject: "Task Due Soon",
    message,
  });
};

const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const message = `
    <h2>Password Reset Request</h2>
    <p>Hi ${user.name},</p>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  await sendEmail({
    to: user.email,
    subject: "Password Reset Request",
    message,
  });
};

const sendEmailVerification = async (user, verificationToken) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

  const message = `
    <h2>Email Verification</h2>
    <p>Hi ${user.name},</p>
    <p>Thank you for registering! Please verify your email by clicking the link below:</p>
    <a href="${verifyUrl}">${verifyUrl}</a>
    <p>This link will expire in 24 hours.</p>
  `;

  await sendEmail({
    to: user.email,
    subject: "Verify Your Email",
    message,
  });
};

module.exports = {
  sendEmail,
  sendTaskAssignedEmail,
  sendTaskDueReminderEmail,
  sendPasswordResetEmail,
  sendEmailVerification,
};
