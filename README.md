<div align="center">

# 🚀 Project Management System

### A Modern, Full-Stack Project Management Platform

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**[Live Demo](https://project-management-system-b.vercel.app)** • **[API Docs](#-api-documentation)** • **[Features](#-features)** • **[Installation](#-installation)**

---

### 💡 Streamline your team's workflow with powerful project management tools

Built with the **MERN stack**, this comprehensive platform enables teams to plan, execute, monitor, and collaborate on projects with advanced features like time tracking, task dependencies, budget management, and real-time notifications.

</div>

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 👥 User Management

- 🔐 JWT Authentication
- 📧 Email Verification
- 🔑 Password Reset
- 👤 Profile Management
- 🎭 4 User Roles (RBAC)
- ✅ Account Activation

</td>
<td width="50%">

### 📊 Project Management

- 📁 CRUD Operations
- 📈 Status Tracking
- ⭐ Priority Levels
- 👥 Team Assignment
- 🎯 Milestone Tracking
- 💰 Budget Management

</td>
</tr>
<tr>
<td width="50%">

### ✅ Task Management

- 📝 Task Creation & Assignment
- 🔄 Status Workflow
- 🔗 Task Dependencies
- 📎 File Attachments
- 🏷️ Tags & Labels
- ⏱️ Time Estimation

</td>
<td width="50%">

### ⏰ Time Tracking

- ⏱️ Start/Stop Timers
- ✍️ Manual Time Entry
- 📅 Timesheets
- 💵 Billable Hours
- 📊 Time Reports
- 🎯 Task-based Tracking

</td>
</tr>
<tr>
<td width="50%">

### 💬 Collaboration

- 💭 Comments System
- 🔔 @Mentions
- 📜 Activity Logs
- 📁 File Sharing
- 🔄 Real-time Updates
- 👥 Team Chat

</td>
<td width="50%">

### 🔔 Notifications

- 🔔 In-App Alerts
- 📧 Email Notifications
- ⚙️ Custom Preferences
- 📊 Unread Counter
- ✅ Mark as Read
- 🎯 Smart Filtering

</td>
</tr>
</table>

<details>
<summary><b>🎯 View All Features (Click to Expand)</b></summary>

<br>

#### User Management & Authentication

- User registration and login with JWT authentication
- Role-based access control (ADMIN, PROJECT_MANAGER, MEMBER, CLIENT)
- Password reset via email
- Email verification
- User profile management
- Account activation/deactivation
- Notification preferences

#### Project Management

- Create, update, archive, and delete projects
- Project statuses: Planned, Active, In Progress, On Hold, Completed, Cancelled
- Project priorities: Low, Medium, High, Critical
- Assign multiple users to projects
- Project milestones with due dates and completion tracking
- Budget tracking (estimated vs actual)
- Project timeline (start and end dates)

#### Task Management

- Create and manage tasks under projects
- Task statuses: To Do, In Progress, Review, Done
- Task priorities: Low, Medium, High, Critical
- Assign tasks to team members
- Task dependencies
- Subtasks support
- Start date and due date tracking
- Estimated vs actual hours tracking
- File attachments
- Tags for organization

#### Time Tracking

- Start/stop timers for tasks
- Manual time entry
- Track time per task, project, and user
- Weekly and monthly timesheets
- Billable hours tracking
- Time reports and analytics

#### Collaboration & Communication

- Comments on tasks and projects
- @mentions in comments
- Activity logs (who did what and when)
- File attachments on tasks

#### Notifications System

- In-app notifications
- Email notifications for:
  - Task assignments
  - Deadline reminders
  - Status changes
  - Comments and mentions
- Customizable notification preferences per user
- Unread notification counter

#### Team Management

- Create and manage teams
- Add/remove team members
- Team-based project organization
- Team directory

#### Admin Dashboard

- System-wide statistics
- User management
- View all projects, tasks, and teams
- Activity monitoring
- Pagination and search

#### Security

- Secure password hashing with bcrypt
- JWT token-based authentication
- Protected API routes
- Role-based authorization
- Input validation and sanitization

### 🔄 In Progress / Planned Features

- Advanced reporting and analytics
- Resource management and workload view
- Gantt charts
- Agile/Scrum support (sprints, backlogs)
- Advanced search and filtering
- Export to PDF/CSV/Excel
- Third-party integrations (Slack, Google Calendar)
- Dark mode
- Real-time updates with WebSockets

</details>

---

## 🛠️ Tech Stack

<div align="center">

### Frontend

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.19-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6.30.2-CA4245?style=flat-square&logo=react-router&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.13.2-5A29E4?style=flat-square&logo=axios&logoColor=white)

### Backend

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18.2-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7.5.0-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-7.5.0-880000?style=flat-square&logo=mongoose&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-9.0.2-000000?style=flat-square&logo=json-web-tokens&logoColor=white)

### Deployment

![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?style=flat-square&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=flat-square&logo=render&logoColor=white)
![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-Database-47A248?style=flat-square&logo=mongodb&logoColor=white)

</div>

<details>
<summary><b>📦 Complete Dependencies List</b></summary>

<br>

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend

- **React 19** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Icons** - Icons

- **ESLint** - Code linting
- **Nodemon** - Auto-restart server
- **Concurrently** - Run multiple commands

</details>

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

```bash
node --version  # v16 or higher
npm --version   # v8 or higher
mongod --version # v5 or higher
```

### Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/project-management-system.git
cd project-management-system
```

#### 2️⃣ Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies (if separate)
cd ../client
npm install
```

#### 3️⃣ Environment Setup

Create a `.env` file in the `server` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/project_management

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@yourapp.com
FROM_NAME=Project Management System

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

> 💡 **Tip:** Generate a secure JWT secret with: `openssl rand -base64 32`

#### 4️⃣ Start Development Servers

```bash
# Option 1: Run both frontend and backend together
npm run dev:full

# Option 2: Run separately
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
npm run dev
```

#### 5️⃣ Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **API Health Check:** http://localhost:5000/api

---

## 📚 API Documentation

### 🔗 Base URL

```
Development: http://localhost:5000/api
Production: https://project-management-system-5k9e.onrender.com/api
```

### 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```bash
Authorization: Bearer <your_jwt_token>
```

<details>
<summary><b>View All API Endpoints</b></summary>

<br>

### Authentication Endpoints

| Method | Endpoint                      | Description             | Auth Required |
| ------ | ----------------------------- | ----------------------- | ------------- |
| POST   | `/auth/register`              | Register new user       | No            |
| POST   | `/auth/login`                 | Login user              | No            |
| POST   | `/auth/forgot-password`       | Request password reset  | No            |
| PUT    | `/auth/reset-password/:token` | Reset password          | No            |
| GET    | `/auth/verify-email/:token`   | Verify email            | No            |
| POST   | `/auth/send-verification`     | Send verification email | Yes           |
| GET    | `/auth/profile`               | Get user profile        | Yes           |
| PUT    | `/auth/profile`               | Update profile          | Yes           |

### Project Endpoints

| Method | Endpoint                      | Description        | Auth Required |
| ------ | ----------------------------- | ------------------ | ------------- |
| POST   | `/projects`                   | Create project     | Yes           |
| GET    | `/projects`                   | Get all projects   | Yes           |
| GET    | `/projects/:id`               | Get single project | Yes           |
| PUT    | `/projects/:id`               | Update project     | Yes           |
| DELETE | `/projects/:id`               | Delete project     | Yes           |
| PUT    | `/projects/:id/add-member`    | Add member         | Yes           |
| PUT    | `/projects/:id/remove-member` | Remove member      | Yes           |

### Task Endpoints

| Method | Endpoint                    | Description          | Auth Required |
| ------ | --------------------------- | -------------------- | ------------- |
| POST   | `/tasks`                    | Create task          | Yes           |
| GET    | `/tasks`                    | Get all tasks        | Yes           |
| GET    | `/tasks/:id`                | Get single task      | Yes           |
| PUT    | `/tasks/:id`                | Update task          | Yes           |
| DELETE | `/tasks/:id`                | Delete task          | Yes           |
| GET    | `/tasks/project/:projectId` | Get tasks by project | Yes           |
| GET    | `/tasks/status/:status`     | Get tasks by status  | Yes           |

### Time Tracking Endpoints

| Method | Endpoint                   | Description       | Auth Required |
| ------ | -------------------------- | ----------------- | ------------- |
| POST   | `/time-tracking/start`     | Start timer       | Yes           |
| POST   | `/time-tracking/manual`    | Manual time entry | Yes           |
| GET    | `/time-tracking`           | Get time entries  | Yes           |
| GET    | `/time-tracking/running`   | Get running timer | Yes           |
| GET    | `/time-tracking/timesheet` | Get timesheet     | Yes           |
| PUT    | `/time-tracking/:id/stop`  | Stop timer        | Yes           |
| PUT    | `/time-tracking/:id`       | Update time entry | Yes           |
| DELETE | `/time-tracking/:id`       | Delete time entry | Yes           |

### Comment Endpoints

| Method | Endpoint                          | Description    | Auth Required |
| ------ | --------------------------------- | -------------- | ------------- |
| POST   | `/comments`                       | Create comment | Yes           |
| GET    | `/comments/:entityType/:entityId` | Get comments   | Yes           |
| PUT    | `/comments/:id`                   | Update comment | Yes           |
| DELETE | `/comments/:id`                   | Delete comment | Yes           |

### Notification Endpoints

| Method | Endpoint                      | Description         | Auth Required |
| ------ | ----------------------------- | ------------------- | ------------- |
| GET    | `/notifications`              | Get notifications   | Yes           |
| GET    | `/notifications/unread-count` | Get unread count    | Yes           |
| PUT    | `/notifications/read-all`     | Mark all as read    | Yes           |
| PUT    | `/notifications/:id/read`     | Mark as read        | Yes           |
| DELETE | `/notifications/:id`          | Delete notification | Yes           |

</details>

---

## 👥 User Roles & Permissions

<table>
<tr>
<th>Role</th>
<th>Permissions</th>
<th>Use Case</th>
</tr>
<tr>
<td><b>🔴 ADMIN</b></td>
<td>
• Full system access<br>
• Manage all users & teams<br>
• View system analytics<br>
• Access admin dashboard
</td>
<td>System administrators</td>
</tr>
<tr>
<td><b>🟡 PROJECT_MANAGER</b></td>
<td>
• Create & manage projects<br>
• Assign tasks & resources<br>
• Set deadlines & priorities<br>
• Generate reports
</td>
<td>Team leads, managers</td>
</tr>
<tr>
<td><b>🟢 MEMBER</b></td>
<td>
• View assigned projects<br>
• Update task status<br>
• Track personal time<br>
• Comment & collaborate
</td>
<td>Team members, developers</td>
</tr>
<tr>
<td><b>🔵 CLIENT</b></td>
<td>
• Read-only access<br>
• View project progress<br>
• View deliverables<br>
• Cannot modify data
</td>
<td>External clients, stakeholders</td>
</tr>
</table>

---

## 📁 Project Structure

```
project-management/
│
├── 📂 server/                    # Backend application
│   ├── 📂 controllers/          # Request handlers & business logic
│   ├── 📂 models/               # MongoDB schemas & models
│   ├── 📂 routes/               # API route definitions
│   ├── 📂 middleware/           # Custom middleware (auth, error handling)
│   ├── 📂 utils/                # Utility functions & helpers
│   ├── 📂 uploads/              # File upload directory
│   ├── 📄 server.js             # Express server entry point
│   ├── 📄 .env                  # Environment variables
│   └── 📄 package.json          # Backend dependencies
│
├── 📂 client/                    # Frontend application
│   ├── 📂 src/
│   │   ├── 📂 components/       # Reusable React components
│   │   ├── 📂 pages/            # Page components (routes)
│   │   ├── 📂 context/          # React Context API
│   │   ├── 📂 utils/            # Frontend utilities
│   │   ├── 📄 App.jsx           # Main app component
│   │   └── 📄 main.jsx          # React entry point
│   ├── 📂 public/               # Static assets
│   ├── 📄 index.html            # HTML template
│   ├── 📄 vite.config.js        # Vite configuration
│   ├── 📄 tailwind.config.js    # Tailwind CSS config
│   └── 📄 package.json          # Frontend dependencies
│
├── 📄 README.md                  # Project documentation
├── 📄 .gitignore                # Git ignore rules
└── 📄 package.json              # Root package.json
```

---

## 🧪 Testing

### Manual API Testing

Use **Postman**, **Insomnia**, or **curl** to test endpoints:

<details>
<summary><b>Example API Requests</b></summary>

<br>

**Register a New User:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

**Create a Project (with JWT token):**

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "New Project",
    "description": "Project description",
    "status": "active",
    "priority": "high"
  }'
```

</details>

### Automated Testing Scripts

The project includes test scripts in the root directory:

```bash
# Test backend health
node test-backend-health.cjs

# Test authentication flow
node test-register-login.cjs

# Test project creation
node test-create-project.cjs

# Test time tracking
node test-time-tracking.cjs

# Test notifications
node test-notifications.cjs
```

---

## 🔒 Security Best Practices

<table>
<tr>
<td width="50%">

### ✅ Implemented

- ✔️ JWT token authentication
- ✔️ Password hashing (bcrypt)
- ✔️ Environment variables
- ✔️ CORS configuration
- ✔️ Input validation
- ✔️ Protected API routes
- ✔️ Role-based access control

</td>
<td width="50%">

### 🔐 Recommendations

- 🔒 Enable HTTPS in production
- 🔒 Implement rate limiting
- 🔒 Add request sanitization
- 🔒 Use helmet.js for headers
- 🔒 Regular dependency updates
- 🔒 Enable MongoDB encryption
- 🔒 Implement 2FA (optional)

</td>
</tr>
</table>

### Security Checklist

- [x] **Never commit `.env` files** - Always in `.gitignore`
- [x] **Strong JWT secrets** - Use `openssl rand -base64 32`
- [x] **Password hashing** - bcrypt with 12 rounds
- [x] **Input validation** - Validate all user inputs
- [ ] **Rate limiting** - Prevent brute force attacks
- [ ] **HTTPS only** - Use SSL certificates in production
- [ ] **Security headers** - Implement helmet.js
- [ ] **Regular updates** - Keep dependencies updated

---

## 🐛 Troubleshooting

<details>
<summary><b>❌ MongoDB Connection Issues</b></summary>

<br>

**Check if MongoDB is running:**

```bash
mongod --version
```

**Start MongoDB service:**

```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Using MongoDB Atlas?**

- Verify connection string in `.env`
- Check IP whitelist in Atlas dashboard
- Ensure database user has correct permissions

</details>

<details>
<summary><b>❌ Port Already in Use</b></summary>

<br>

**Find process using the port:**

```bash
# Windows
netstat -ano | findstr :5000

# macOS/Linux
lsof -i :5000
```

**Kill the process:**

```bash
# Windows
taskkill /PID <PID> /F

# macOS/Linux
kill -9 <PID>
```

</details>

<details>
<summary><b>❌ Dependencies Issues</b></summary>

<br>

**Clear and reinstall:**

```bash
# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json
npm install

# Do the same for server
cd server
rm -rf node_modules package-lock.json
npm install
```

</details>

<details>
<summary><b>❌ CORS Errors</b></summary>

<br>

**Update CORS configuration in `server/server.js`:**

```javascript
app.use(
  cors({
    origin: ["http://localhost:5173", "https://your-frontend-domain.com"],
    credentials: true,
  })
);
```

</details>

<details>
<summary><b>❌ JWT Token Errors</b></summary>

<br>

**Common issues:**

- Token expired → Login again
- Invalid token → Check JWT_SECRET in `.env`
- Missing token → Include in Authorization header

**Token format:**

```
Authorization: Bearer <your_jwt_token>
```

</details>

---

## 📈 Performance Optimization

### Frontend Optimizations

- ⚡ **Code Splitting** - Lazy loading with React.lazy()
- ⚡ **Vite Build** - Lightning-fast builds and HMR
- ⚡ **Image Optimization** - Compressed and lazy-loaded images
- ⚡ **Memoization** - React.memo for expensive components
- ⚡ **Debouncing** - Optimized search and filter inputs

### Backend Optimizations

- 🚀 **Database Indexing** - Indexes on frequently queried fields
- 🚀 **Pagination** - Limit results per page (default: 10)
- 🚀 **Query Optimization** - Select only needed fields
- 🚀 **Connection Pooling** - Mongoose connection management
- 🚀 **Caching** - Response caching (recommended for production)

### Deployment Optimizations

- 🌐 **CDN** - Vercel's global CDN for frontend
- 🌐 **Compression** - Gzip compression enabled
- 🌐 **Minification** - Production builds minified
- 🌐 **Tree Shaking** - Remove unused code

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### How to Contribute

1. **Fork the repository**

   ```bash
   # Click the 'Fork' button on GitHub
   ```

2. **Clone your fork**

   ```bash
   git clone https://github.com/yourusername/project-management-system.git
   cd project-management-system
   ```

3. **Create a feature branch**

   ```bash
   git checkout -b feature/AmazingFeature
   ```

4. **Make your changes**

   - Write clean, documented code
   - Follow existing code style
   - Add tests if applicable

5. **Commit your changes**

   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

6. **Push to your branch**

   ```bash
   git push origin feature/AmazingFeature
   ```

7. **Open a Pull Request**
   - Go to the original repository
   - Click 'New Pull Request'
   - Describe your changes

### Contribution Guidelines

- ✅ Follow the existing code style
- ✅ Write clear commit messages
- ✅ Update documentation if needed
- ✅ Test your changes thoroughly
- ✅ One feature per pull request

---

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- React team for the amazing library
- Express.js community
- MongoDB team
- All contributors

## 📞 Support

For support, email support@yourapp.com or open an issue in the repository.

## 🗺️ Roadmap

See [FEATURE_ANALYSIS.md](./FEATURE_ANALYSIS.md) for detailed feature completion status and [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for implementation details.

### Q1 2024

- [ ] Advanced reporting and analytics
- [ ] Resource management dashboard
- [ ] File upload system
- [ ] Real-time notifications with WebSockets

### Q2 2024

- [ ] Gantt chart view
- [ ] Agile/Scrum features
- [ ] Mobile app (React Native)
- [ ] Third-party integrations

### Q3 2024

- [ ] AI-powered insights
- [ ] Advanced automation
- [ ] Custom workflows
- [ ] White-label options

---

**Built with ❤️ using the MERN Stack**
#   P r o j e c t - M a n a g e m e n t - S y s t e m 
 
 

<div align="center">

## ⭐ Star History

If you find this project useful, please consider giving it a star!

---

### 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/project-management-system?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/project-management-system?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/yourusername/project-management-system?style=social)

![GitHub issues](https://img.shields.io/github/issues/yourusername/project-management-system)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/project-management-system)
![GitHub last commit](https://img.shields.io/github/last-commit/yourusername/project-management-system)

---

### 💖 Built with Love using the MERN Stack

**MongoDB** • **Express.js** • **React 19** • **Node.js** • **Tailwind CSS** • **JWT** • **Vite**

---

**[⬆ Back to Top](#-project-management-system)**

</div>
