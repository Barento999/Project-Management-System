import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaExclamationTriangle,
  FaChartBar,
  FaSpinner,
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaUserClock,
} from "react-icons/fa";
import { taskAPI, userAPI, projectAPI } from "../services/api";

const ResourceManagement = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, overloaded, available
  const [sortBy, setSortBy] = useState("workload"); // workload, name, availability

  useEffect(() => {
    fetchResourceData();
  }, []);

  const fetchResourceData = async () => {
    try {
      setLoading(true);

      // Fetch all users, tasks, and projects
      const [usersRes, tasksRes, projectsRes] = await Promise.all([
        userAPI.getAll(),
        taskAPI.getAll(),
        projectAPI.getAll(),
      ]);

      const users = usersRes.data.users;
      const tasks = tasksRes.data.tasks;
      const projects = projectsRes.data.projects;

      // Calculate resource data for each user
      const resourceData = users.map((user) => {
        // Get user's tasks
        const userTasks = tasks.filter(
          (task) => task.assignedTo?._id === user._id
        );

        // Calculate task breakdown
        const todoTasks = userTasks.filter((t) => t.status === "todo");
        const inProgressTasks = userTasks.filter(
          (t) => t.status === "in-progress"
        );
        const doneTasks = userTasks.filter((t) => t.status === "done");

        // Calculate priority breakdown
        const highPriorityTasks = userTasks.filter(
          (t) => t.priority === "high" && t.status !== "done"
        );
        const mediumPriorityTasks = userTasks.filter(
          (t) => t.priority === "medium" && t.status !== "done"
        );
        const lowPriorityTasks = userTasks.filter(
          (t) => t.priority === "low" && t.status !== "done"
        );

        // Calculate overdue tasks
        const overdueTasks = userTasks.filter(
          (t) =>
            t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done"
        );

        // Get user's projects
        const userProjects = projects.filter(
          (p) =>
            p.owner?._id === user._id ||
            p.members?.some((m) => (m._id || m) === user._id)
        );

        // Calculate workload score (weighted by priority and status)
        const workloadScore =
          highPriorityTasks.length * 3 +
          mediumPriorityTasks.length * 2 +
          lowPriorityTasks.length * 1 +
          inProgressTasks.length * 2;

        // Determine if overloaded (more than 10 active tasks or workload score > 20)
        const isOverloaded =
          todoTasks.length + inProgressTasks.length > 10 || workloadScore > 20;

        // Calculate capacity (inverse of workload, 0-100%)
        const maxCapacity = 30; // Assume max 30 points before 0% capacity
        const capacity = Math.max(
          0,
          Math.min(100, 100 - (workloadScore / maxCapacity) * 100)
        );

        return {
          user,
          totalTasks: userTasks.length,
          activeTasks: todoTasks.length + inProgressTasks.length,
          todoTasks: todoTasks.length,
          inProgressTasks: inProgressTasks.length,
          doneTasks: doneTasks.length,
          highPriorityTasks: highPriorityTasks.length,
          mediumPriorityTasks: mediumPriorityTasks.length,
          lowPriorityTasks: lowPriorityTasks.length,
          overdueTasks: overdueTasks.length,
          projects: userProjects.length,
          workloadScore,
          isOverloaded,
          capacity: Math.round(capacity),
        };
      });

      setResources(resourceData);
    } catch (error) {
      console.error("Failed to fetch resource data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredResources = () => {
    let filtered = [...resources];

    // Apply filter
    if (filter === "overloaded") {
      filtered = filtered.filter((r) => r.isOverloaded);
    } else if (filter === "available") {
      filtered = filtered.filter((r) => !r.isOverloaded && r.capacity > 50);
    }

    // Apply sort
    if (sortBy === "workload") {
      filtered.sort((a, b) => b.workloadScore - a.workloadScore);
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.user.name.localeCompare(b.user.name));
    } else if (sortBy === "availability") {
      filtered.sort((a, b) => b.capacity - a.capacity);
    }

    return filtered;
  };

  const getCapacityColor = (capacity) => {
    if (capacity >= 70) return "text-green-600 bg-green-100";
    if (capacity >= 40) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getCapacityBarColor = (capacity) => {
    if (capacity >= 70) return "bg-green-500";
    if (capacity >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const filteredResources = getFilteredResources();

  // Calculate summary stats
  const totalUsers = resources.length;
  const overloadedUsers = resources.filter((r) => r.isOverloaded).length;
  const availableUsers = resources.filter(
    (r) => !r.isOverloaded && r.capacity > 50
  ).length;
  const avgCapacity =
    resources.length > 0
      ? Math.round(
          resources.reduce((sum, r) => sum + r.capacity, 0) / resources.length
        )
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="text-6xl text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaUsers className="text-4xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Resource Management
            </h1>
          </div>
          <p className="text-gray-600">
            Monitor team workload, detect over-allocation, and plan capacity
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <FaUsers className="text-3xl text-blue-600" />
              <span className="text-3xl font-bold text-gray-800">
                {totalUsers}
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium">
              Total Team Members
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <FaExclamationTriangle className="text-3xl text-red-600" />
              <span className="text-3xl font-bold text-red-600">
                {overloadedUsers}
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Overloaded</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <FaCheckCircle className="text-3xl text-green-600" />
              <span className="text-3xl font-bold text-green-600">
                {availableUsers}
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Available</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <FaChartBar className="text-3xl text-purple-600" />
              <span className="text-3xl font-bold text-purple-600">
                {avgCapacity}%
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Avg Capacity</p>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="all">All Team Members</option>
                <option value="overloaded">Overloaded Only</option>
                <option value="available">Available Only</option>
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="workload">Workload (High to Low)</option>
                <option value="name">Name (A-Z)</option>
                <option value="availability">Availability (High to Low)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resource List */}
        {filteredResources.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-md border border-gray-200 text-center">
            <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No team members found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredResources.map((resource) => (
              <div
                key={resource.user._id}
                className={`bg-white rounded-xl p-6 shadow-md border-2 transition-all hover:shadow-lg ${
                  resource.isOverloaded
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200"
                }`}>
                {/* User Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                    {resource.user.name?.charAt(0)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-gray-800">
                        {resource.user.name}
                      </h3>
                      {resource.isOverloaded && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                          <FaExclamationTriangle />
                          OVERLOADED
                        </span>
                      )}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getCapacityColor(
                          resource.capacity
                        )}`}>
                        {resource.capacity}% Capacity
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {resource.user.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      Role:{" "}
                      <span className="font-semibold">
                        {resource.user.role}
                      </span>
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-600">
                      {resource.activeTasks}
                    </p>
                    <p className="text-xs text-gray-600">Active Tasks</p>
                  </div>
                </div>

                {/* Capacity Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Capacity Available
                    </span>
                    <span className="text-sm font-bold text-gray-800">
                      {resource.capacity}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getCapacityBarColor(
                        resource.capacity
                      )} transition-all duration-500`}
                      style={{ width: `${resource.capacity}%` }}></div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-2 mb-1">
                      <FaTasks className="text-gray-600" />
                      <span className="text-xs text-gray-600">To Do</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                      {resource.todoTasks}
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <FaClock className="text-blue-600" />
                      <span className="text-xs text-blue-600">In Progress</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      {resource.inProgressTasks}
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <FaCheckCircle className="text-green-600" />
                      <span className="text-xs text-green-600">Done</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {resource.doneTasks}
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <div className="flex items-center gap-2 mb-1">
                      <FaUserClock className="text-purple-600" />
                      <span className="text-xs text-purple-600">Projects</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">
                      {resource.projects}
                    </p>
                  </div>
                </div>

                {/* Priority Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <span className="text-sm font-medium text-red-700">
                      High Priority
                    </span>
                    <span className="text-lg font-bold text-red-700">
                      {resource.highPriorityTasks}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <span className="text-sm font-medium text-yellow-700">
                      Medium Priority
                    </span>
                    <span className="text-lg font-bold text-yellow-700">
                      {resource.mediumPriorityTasks}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-sm font-medium text-blue-700">
                      Low Priority
                    </span>
                    <span className="text-lg font-bold text-blue-700">
                      {resource.lowPriorityTasks}
                    </span>
                  </div>
                </div>

                {/* Overdue Warning */}
                {resource.overdueTasks > 0 && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center gap-2">
                    <FaExclamationTriangle className="text-red-600" />
                    <span className="text-sm font-medium text-red-700">
                      {resource.overdueTasks} overdue task
                      {resource.overdueTasks !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceManagement;
