import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Import pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardBeautiful from "./pages/DashboardBeautiful";
import Profile from "./pages/Profile";
import ProfileBeautiful from "./pages/ProfileBeautiful";
import Teams from "./pages/Teams";
import TeamsBeautiful from "./pages/TeamsBeautiful";
import Projects from "./pages/Projects";
import ProjectsSimple from "./pages/ProjectsSimple";
import ProjectsBeautiful from "./pages/ProjectsBeautiful";
import Tasks from "./pages/Tasks";
import TasksBeautiful from "./pages/TasksBeautiful";
import TaskDetailsBeautiful from "./pages/TaskDetailsBeautiful";
import ProjectDetailsBeautiful from "./pages/ProjectDetailsBeautiful";
import TimeTrackingBeautiful from "./pages/TimeTrackingBeautiful";
import TimesheetBeautiful from "./pages/TimesheetBeautiful";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Calendar from "./pages/Calendar";
import Reports from "./pages/Reports";
import Documents from "./pages/Documents";
import Messages from "./pages/Messages";
import ProjectsCreate from "./pages/ProjectsCreate";
import TasksCreate from "./pages/TasksCreate";
import TeamsCreate from "./pages/TeamsCreate";
import TasksMy from "./pages/TasksMy";
import TasksBoard from "./pages/TasksBoard";
import TeamsDirectory from "./pages/TeamsDirectory";
import ProjectsTemplates from "./pages/ProjectsTemplates";
import CalendarTeam from "./pages/CalendarTeam";
import CalendarSchedule from "./pages/CalendarSchedule";
import ReportsProjects from "./pages/ReportsProjects";
import ReportsTasks from "./pages/ReportsTasks";
import ReportsTeams from "./pages/ReportsTeams";
import DocumentsMy from "./pages/DocumentsMy";
import DocumentsShared from "./pages/DocumentsShared";
import MessagesSent from "./pages/MessagesSent";
import MessagesNew from "./pages/MessagesNew";
import AdminSettings from "./pages/AdminSettings";
import AdminLogs from "./pages/AdminLogs";
import AdminUsers from "./pages/AdminUsers";
import LandingPage from "./pages/LandingPage";

// Import layout components
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes - no header or sidebar */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes - with header and sidebar */}
          <Route
            path="/*"
            element={
              <>
                <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                <div className="flex flex-1">
                  {/* Mobile overlay */}
                  {sidebarOpen && (
                    <div
                      className="fixed inset-0 bg-black/50 z-30 md:hidden"
                      onClick={() => setSidebarOpen(false)}
                    />
                  )}

                  {/* Sidebar */}
                  <div
                    className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 z-40 transform transition-transform duration-300 ease-in-out ${
                      sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0`}>
                    <Sidebar onClose={() => setSidebarOpen(false)} />
                  </div>

                  {/* Main content */}
                  <main className="flex-1 p-4 sm:p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen md:ml-64 pt-20 md:pt-16">
                    <div className="max-w-[1600px] mx-auto">
                      <Routes>
                        <Route
                          path="/dashboard"
                          element={
                            <ProtectedRoute>
                              <DashboardBeautiful />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/profile"
                          element={
                            <ProtectedRoute>
                              <ProfileBeautiful />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/teams"
                          element={
                            <ProtectedRoute>
                              <TeamsBeautiful />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/teams/create"
                          element={
                            <ProtectedRoute>
                              <TeamsCreate />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/teams/directory"
                          element={
                            <ProtectedRoute>
                              <TeamsDirectory />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/projects"
                          element={
                            <ProtectedRoute>
                              <ProjectsBeautiful />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/projects/:id"
                          element={
                            <ProtectedRoute>
                              <ProjectDetailsBeautiful />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/projects/create"
                          element={
                            <ProtectedRoute>
                              <ProjectsCreate />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/projects/templates"
                          element={
                            <ProtectedRoute>
                              <ProjectsTemplates />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/tasks"
                          element={
                            <ProtectedRoute>
                              <TasksBeautiful />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/tasks/:id"
                          element={
                            <ProtectedRoute>
                              <TaskDetailsBeautiful />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/tasks/my"
                          element={
                            <ProtectedRoute>
                              <TasksMy />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/tasks/create"
                          element={
                            <ProtectedRoute>
                              <TasksCreate />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/tasks/board"
                          element={
                            <ProtectedRoute>
                              <TasksBoard />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/time-tracking"
                          element={
                            <ProtectedRoute>
                              <TimeTrackingBeautiful />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/timesheet"
                          element={
                            <ProtectedRoute>
                              <TimesheetBeautiful />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/calendar"
                          element={
                            <ProtectedRoute>
                              <Calendar />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/calendar/team"
                          element={
                            <ProtectedRoute>
                              <CalendarTeam />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/calendar/schedule"
                          element={
                            <ProtectedRoute>
                              <CalendarSchedule />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/reports"
                          element={
                            <ProtectedRoute>
                              <Reports />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/reports/projects"
                          element={
                            <ProtectedRoute>
                              <ReportsProjects />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/reports/tasks"
                          element={
                            <ProtectedRoute>
                              <ReportsTasks />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/reports/teams"
                          element={
                            <ProtectedRoute>
                              <ReportsTeams />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/documents"
                          element={
                            <ProtectedRoute>
                              <Documents />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/documents/my"
                          element={
                            <ProtectedRoute>
                              <DocumentsMy />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/documents/shared"
                          element={
                            <ProtectedRoute>
                              <DocumentsShared />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/messages"
                          element={
                            <ProtectedRoute>
                              <Messages />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/messages/sent"
                          element={
                            <ProtectedRoute>
                              <MessagesSent />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/messages/new"
                          element={
                            <ProtectedRoute>
                              <MessagesNew />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/settings"
                          element={
                            <ProtectedRoute>
                              <Profile />
                            </ProtectedRoute>
                          }
                        />

                        {/* Admin routes */}
                        <Route
                          path="/admin"
                          element={
                            <AdminRoute>
                              <AdminDashboard />
                            </AdminRoute>
                          }
                        />
                        <Route
                          path="/admin/users"
                          element={
                            <AdminRoute>
                              <AdminUsers />
                            </AdminRoute>
                          }
                        />
                        <Route
                          path="/admin/settings"
                          element={
                            <AdminRoute>
                              <AdminSettings />
                            </AdminRoute>
                          }
                        />
                        <Route
                          path="/admin/logs"
                          element={
                            <AdminRoute>
                              <AdminLogs />
                            </AdminRoute>
                          }
                        />

                        {/* 404 route */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </div>
                  </main>
                </div>
              </>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
