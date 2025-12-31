# Project Management System (PMS)

A comprehensive, production-ready project management system built with the MERN stack (MongoDB, Express.js, React, Node.js). This system supports real-world project planning, execution, monitoring, and team collaboration with role-based access control.

## 🚀 Features

### ✅ Implemented Features

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

## 🏗️ Tech Stack

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

### Development Tools

- **Vite** - Build tool
- **ESLint** - Code linting
- **Nodemon** - Auto-restart server
- **Concurrently** - Run multiple commands

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Clone Repository

```bash
git clone <repository-url>
cd project-management
```

### Install Dependencies

#### Install root dependencies

```bash
npm install
```

#### Install server dependencies

```bash
cd server
npm install
cd ..
```

### Environment Configuration

Create a `.env` file in the `server` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/project_management
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/project_management

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Bcrypt
BCRYPT_ROUNDS=12

# Email Configuration (for production)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@yourapp.com
FROM_NAME=Project Management System

# Frontend URL
FRONTEND_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### Database Setup

If using local MongoDB:

```bash
# Start MongoDB service
mongod
```

If using MongoDB Atlas:

1. Create a cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Update `MONGODB_URI` in `.env`

## 🚀 Running the Application

### Development Mode

#### Run both frontend and backend concurrently:

```bash
npm run dev:full
```

#### Or run separately:

**Backend only:**

```bash
npm run server
# or
cd server && npm run dev
```

**Frontend only:**

```bash
npm run client
# or
npm run dev
```

### Production Mode

#### Build frontend:

```bash
npm run build
```

#### Start backend:

```bash
cd server
npm start
```

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

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

## 🎯 User Roles & Permissions

### ADMIN

- Full system access
- Manage all users, teams, projects, and tasks
- View system-wide analytics
- Access admin dashboard

### PROJECT_MANAGER

- Create and manage projects
- Assign tasks and resources
- Set deadlines and priorities
- Track progress and generate reports

### MEMBER

- View assigned projects and tasks
- Update task status and time spent
- Comment and collaborate
- Track personal time

### CLIENT

- Read-only access to assigned projects
- View project progress and deliverables
- Cannot modify data

## 📁 Project Structure

```
project-management/
├── server/
│   ├── controllers/       # Request handlers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   ├── server.js         # Entry point
│   └── .env              # Environment variables
├── src/
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── context/         # React context
│   ├── utils/           # Frontend utilities
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── public/              # Static files
└── package.json         # Dependencies
```

## 🧪 Testing

### Test API Endpoints

Use tools like Postman, Insomnia, or curl:

```bash
# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## 🔒 Security Best Practices

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use strong JWT secrets** - Generate with `openssl rand -base64 32`
3. **Enable CORS properly** - Configure for production domains
4. **Rate limiting** - Implement to prevent abuse
5. **Input validation** - Always validate and sanitize inputs
6. **HTTPS in production** - Use SSL certificates
7. **Regular updates** - Keep dependencies updated

## 🐛 Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB service
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Port Already in Use

```bash
# Find process using port 5000
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000

# Kill the process
# Windows: taskkill /PID <PID> /F
# Mac/Linux: kill -9 <PID>
```

### Dependencies Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Do the same for server
cd server
rm -rf node_modules package-lock.json
npm install
```

## 📈 Performance Optimization

1. **Database Indexing** - Create indexes on frequently queried fields
2. **Pagination** - Implemented on all list endpoints
3. **Caching** - Consider Redis for session management
4. **Query Optimization** - Use `.select()` to limit fields
5. **Lazy Loading** - Load data on demand in frontend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

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
#   P r o j e c t - M a n a g e m e n t - S y s t e m  
 