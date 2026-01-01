const nodemailer = require("nodemailer");

// Create transporter
const createTransporter = () => {
  // Check if email is enabled
  if (
    process.env.ENABLE_EMAIL_VERIFICATION === "false" &&
    process.env.ENABLE_PASSWORD_RESET === "false" &&
    process.env.ENABLE_NOTIFICATION_EMAILS === "false"
  ) {
    return null;
  }

  // For development/testing - log emails instead of sending
  if (process.env.NODE_ENV === "development" && !process.env.SMTP_HOST) {
    console.log("📧 Email service running in LOG MODE (no SMTP configured)");
    return null;
  }

  // Create real transporter with SMTP
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: parseInt(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log("✅ Email service configured with SMTP");
    return transporter;
  } catch (error) {
    console.error("❌ Email service configuration error:", error.message);
    return null;
  }
};

const transporter = createTransporter();

// Send email function
const sendEmail = async (options) => {
  // If no transporter, just log the email
  if (!transporter) {
    console.log("\n📧 ========== EMAIL (LOG MODE) ==========");
    console.log("To:", options.to);
    console.log("Subject:", options.subject);

    // Extract verification/reset URL from the message
    const urlMatch = options.message.match(/http:\/\/[^\s"<]+/);
    if (urlMatch) {
      console.log("\n🔗 VERIFICATION/RESET LINK:");
      console.log(urlMatch[0]);
      console.log("");
    }

    console.log("Message:", options.message.substring(0, 200) + "...");
    console.log("=========================================\n");
    return true;
  }

  try {
    const mailOptions = {
      from: `${process.env.FROM_NAME || "ProjectFlow"} <${
        process.env.FROM_EMAIL
      }>`,
      to: options.to,
      subject: options.subject,
      html: options.message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Email sending error:", error.message);
    // Don't throw error - just log it
    return false;
  }
};

// Email templates
const sendTaskAssignedEmail = async (user, task, project) => {
  if (process.env.ENABLE_NOTIFICATION_EMAILS === "false") return;

  const message = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .task-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 New Task Assigned</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>You have been assigned a new task:</p>
          
          <div class="task-card">
            <h2>${task.title}</h2>
            <p><strong>Project:</strong> ${project.name}</p>
            <p><strong>Priority:</strong> <span style="color: ${
              task.priority === "high"
                ? "#f56565"
                : task.priority === "medium"
                ? "#ed8936"
                : "#48bb78"
            };">${task.priority.toUpperCase()}</span></p>
            ${
              task.dueDate
                ? `<p><strong>Due Date:</strong> ${new Date(
                    task.dueDate
                  ).toLocaleDateString()}</p>`
                : ""
            }
            ${
              task.description
                ? `<p><strong>Description:</strong> ${task.description}</p>`
                : ""
            }
          </div>
          
          <a href="${process.env.FRONTEND_URL}/tasks/${
    task._id
  }" class="button">View Task Details</a>
          
          <div class="footer">
            <p>This is an automated email from ProjectFlow</p>
            <p>You can manage your notification preferences in your profile settings</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: user.email,
    subject: `New Task Assigned: ${task.title}`,
    message,
  });
};

const sendTaskDueReminderEmail = async (user, task, project) => {
  if (process.env.ENABLE_NOTIFICATION_EMAILS === "false") return;

  const message = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .task-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f5576c; }
        .button { display: inline-block; padding: 12px 30px; background: #f5576c; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏰ Task Due Soon</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>This is a reminder that the following task is due soon:</p>
          
          <div class="task-card">
            <h2>${task.title}</h2>
            <p><strong>Project:</strong> ${project.name}</p>
            <p><strong>Due Date:</strong> ${new Date(
              task.dueDate
            ).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${task.status}</p>
          </div>
          
          <a href="${process.env.FRONTEND_URL}/tasks/${
    task._id
  }" class="button">Update Task</a>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: user.email,
    subject: `⏰ Task Due Soon: ${task.title}`,
    message,
  });
};

const sendPasswordResetEmail = async (user, resetToken) => {
  if (process.env.ENABLE_PASSWORD_RESET === "false") return;

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const message = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>You requested a password reset for your ProjectFlow account.</p>
          <p>Click the button below to reset your password:</p>
          
          <a href="${resetUrl}" class="button">Reset Password</a>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
          
          <div class="warning">
            <p><strong>⚠️ Important:</strong></p>
            <ul>
              <li>This link will expire in <strong>1 hour</strong></li>
              <li>If you didn't request this, please ignore this email</li>
              <li>Your password won't change until you create a new one</li>
            </ul>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: user.email,
    subject: "Password Reset Request - ProjectFlow",
    message,
  });
};

const sendEmailVerification = async (user, verificationToken) => {
  if (process.env.ENABLE_EMAIL_VERIFICATION === "false") return;

  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

  const message = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #48bb78; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .info { background: #e6fffa; border-left: 4px solid #48bb78; padding: 15px; margin: 20px 0; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✉️ Verify Your Email</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>Welcome to ProjectFlow! 🎉</p>
          <p>Please verify your email address to activate your account:</p>
          
          <a href="${verifyUrl}" class="button">Verify Email Address</a>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #667eea;">${verifyUrl}</p>
          
          <div class="info">
            <p><strong>ℹ️ Note:</strong></p>
            <ul>
              <li>This link will expire in <strong>24 hours</strong></li>
              <li>You can request a new verification email from your profile</li>
            </ul>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: user.email,
    subject: "Verify Your Email - ProjectFlow",
    message,
  });
};

const sendWelcomeEmail = async (user) => {
  const message = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 Welcome to ProjectFlow!</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>Thank you for joining ProjectFlow! We're excited to have you on board.</p>
          <p>Here's what you can do:</p>
          <ul>
            <li>✅ Create and manage projects</li>
            <li>✅ Assign tasks to team members</li>
            <li>✅ Track time on tasks</li>
            <li>✅ Collaborate with comments</li>
            <li>✅ Get real-time notifications</li>
          </ul>
          
          <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Get Started</a>
          
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Happy project managing! 🎯</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: user.email,
    subject: "Welcome to ProjectFlow! 🚀",
    message,
  });
};

module.exports = {
  sendEmail,
  sendTaskAssignedEmail,
  sendTaskDueReminderEmail,
  sendPasswordResetEmail,
  sendEmailVerification,
  sendWelcomeEmail,
};
