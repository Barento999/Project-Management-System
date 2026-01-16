# 🚀 Project Management System (PMS)

<div align="center">

**A comprehensive, production-ready project management system built with the MERN stack**

![MERN Stack](https://img.shields.io/badge/Stack-MERN-brightgreen)
![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-18-green)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success)

*Streamline project planning, execution, and team collaboration with role-based access control*

</div>

## 📋 Table of Contents

- [✨ Features](#✨-features)
  - [✅ Implemented Features](#✅-implemented-features)
  - [🔄 In Progress](#🔄-in-progress--planned-features)
- [🏗️ Tech Stack](#🏗️-tech-stack)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Development Tools](#development-tools)
- [🚀 Quick Start](#🚀-quick-start)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [⚙️ Configuration](#⚙️-configuration)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
- [🎮 Running the Application](#🎮-running-the-application)
  - [Development Mode](#development-mode)
  - [Production Mode](#production-mode)
- [📚 API Documentation](#📚-api-documentation)
- [👥 User Roles](#👥-user-roles--permissions)
- [📁 Project Structure](#📁-project-structure)
  - [Root Directory](#root-directory)
  - [Backend Structure](#backend-structure)
  - [Frontend Structure](#frontend-structure)
- [🔧 Testing](#🧪-testing)
- [🔒 Security](#🔒-security-best-practices)
- [🐛 Troubleshooting](#🐛-troubleshooting)
- [📈 Performance](#📈-performance-optimization)
- [🤝 Contributing](#🤝-contributing)
- [📄 License](#📄-license)
- [🗺️ Roadmap](#🗺️-roadmap)

## ✨ Features

### ✅ Implemented Features

| Category | Features | Status |
|----------|----------|--------|
| **Authentication** | JWT Auth, Email Verification, Password Reset, Role-based Access | 🟢 Complete |
| **User Management** | Profile Management, Notification Preferences, Account Control | 🟢 Complete |
| **Project Management** | CRUD Operations, Milestones, Budget Tracking, Timeline | 🟢 Complete |
| **Task Management** | Subtasks, Dependencies, Priorities, File Attachments | 🟢 Complete |
| **Time Tracking** | Timer, Manual Entry, Timesheets, Analytics | 🟢 Complete |
| **Collaboration** | Comments, @Mentions, Activity Logs, File Sharing | 🟢 Complete |
| **Notifications** | In-app & Email, Custom Preferences, Unread Counter | 🟢 Complete |
| **Team Management** | Team Creation, Member Management, Organization | 🟢 Complete |
| **Admin Dashboard** | System Statistics, User Management, Monitoring | 🟢 Complete |

### 🔄 In Progress / Planned Features

| Feature | Priority | Estimated Release |
|---------|----------|-------------------|
| **Advanced Analytics** | 🔴 High | Q1 2024 |
| **Resource Management** | 🔴 High | Q1 2024 |
| **Gantt Charts** | 🟡 Medium | Q2 2024 |
| **Agile/Scrum Support** | 🟡 Medium | Q2 2024 |
| **Real-time WebSockets** | 🔴 High | Q1 2024 |
| **Dark Mode** | 🟢 Low | Q3 2024 |
| **Third-party Integrations** | 🟡 Medium | Q2 2024 |

## 🏗️ Tech Stack

### Backend

<div align="center">

| Technology | Purpose | Version |
|------------|---------|---------|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) | Runtime Environment | 18+ |
| ![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) | Web Framework | 4.18+ |
| ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white) | Database | 7.0+ |
| ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white) | ODM | 8.0+ |
| ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white) | Authentication | 9.0+ |
| ![Bcrypt](https://img.shields.io/badge/Bcrypt-FF6C37?style=for-the-badge) | Password Hashing | 5.1+ |

</div>

### Frontend

<div align="center">

| Technology | Purpose | Version |
|------------|---------|---------|
| ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) | UI Library | 19 |
| ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) | Navigation | 6.22+ |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) | Styling | 3.4+ |
| ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white) | HTTP Client | 1.6+ |
| ![React Icons](https://img.shields.io/badge/React_Icons-F7DF1E?style=for-the-badge&logo=react&logoColor=black) | Icons | 5.0+ |

</div>

### Development Tools

- **Vite** - Fast build tool and development server
- **ESLint** - Code quality and consistency
- **Nodemon** - Automatic server restart during development
- **Concurrently** - Run multiple commands in parallel

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-management
