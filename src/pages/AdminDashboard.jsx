import React, { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import { FaUser, FaUsers, FaProjectDiagram, FaTasks, FaChartBar, FaBell, FaCog, FaSearch, FaFilter, FaSortAmountDown } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalTeams: 0,
    totalProjects: 0,
    activeProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0
  });
  const [recentActivity, setRecentActivity] = useState({
    recentTasks: [],
    recentProjects: [],
    recentTeams: [],
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'MEMBER'
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Fetch admin stats
      const statsResponse = await adminAPI.getStats();
      setStats(statsResponse.data.stats);

      // Fetch recent activity
      const activityResponse = await adminAPI.getRecentActivity();
      setRecentActivity(activityResponse.data.activity);

      // Fetch all data for management tabs
      const [usersResponse, projectsResponse, tasksResponse, teamsResponse] = await Promise.all([
        adminAPI.getAllUsers(),
        adminAPI.getAllProjects(),
        adminAPI.getAllTasks(),
        adminAPI.getAllTeams()
      ]);

      setUsers(usersResponse.data.users || []);
      setProjects(projectsResponse.data.projects || []);
      setTasks(tasksResponse.data.tasks || []);
      setTeams(teamsResponse.data.teams || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserUpdate = async (userId, userData) => {
    try {
      await adminAPI.updateUser(userId, userData);
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleUserDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(userId);
        fetchAdminData(); // Refresh data
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createUser(newUser);
      setNewUser({ name: '', email: '', password: '', role: 'MEMBER' });
      setShowCreateUserForm(false);
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-xl shadow-lg text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-blue-100">Manage your project management system</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === 'overview' ? 'bg-white text-blue-600' : 'bg-blue-500/20 text-white hover:bg-blue-500/30'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === 'users' ? 'bg-white text-blue-600' : 'bg-blue-500/20 text-white hover:bg-blue-500/30'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === 'projects' ? 'bg-white text-blue-600' : 'bg-blue-500/20 text-white hover:bg-blue-500/30'
              }`}
            >
              Projects
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">
                  <FaUser className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600">
                  <FaUsers className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-600">
                  <FaProjectDiagram className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-600">
                  <FaTasks className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTasks}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-gradient-to-r from-red-500 to-rose-600">
                  <FaTasks className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Progress Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inProgressTasks}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600">
                  <FaChartBar className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedTasks}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600">
                  <FaProjectDiagram className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Tasks */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaTasks className="mr-2 text-blue-500" /> Recent Tasks
              </h2>
              {recentActivity.recentTasks.length > 0 ? (
                <ul className="space-y-3">
                  {recentActivity.recentTasks.slice(0, 5).map((task) => (
                    <li key={task._id} className="border-b pb-3 last:border-b-0 last:pb-0">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <p className="text-sm text-gray-600">Project: {task.project?.name}</p>
                      <div className="mt-1 flex items-center text-xs text-gray-500">
                        <span className={`px-2 py-1 rounded-full ${
                          task.status === 'todo' ? 'bg-gray-100 text-gray-800' :
                          task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.status}
                        </span>
                        <span className="ml-2">{new Date(task.createdAt).toLocaleDateString()}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No recent tasks</p>
              )}
            </div>

            {/* Recent Projects */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaProjectDiagram className="mr-2 text-purple-500" /> Recent Projects
              </h2>
              {recentActivity.recentProjects.length > 0 ? (
                <ul className="space-y-3">
                  {recentActivity.recentProjects.slice(0, 5).map((project) => (
                    <li key={project._id} className="border-b pb-3 last:border-b-0 last:pb-0">
                      <h3 className="font-medium text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-600">Team: {project.team?.name}</p>
                      <div className="mt-1 flex items-center text-xs text-gray-500">
                        <span className={`px-2 py-1 rounded-full ${
                          project.status === 'active' ? 'bg-green-100 text-green-800' :
                          project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          project.status === 'on-hold' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {project.status}
                        </span>
                        <span className="ml-2">{new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No recent projects</p>
              )}
            </div>

            {/* Recent Teams */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaUsers className="mr-2 text-green-500" /> Recent Teams
              </h2>
              {recentActivity.recentTeams.length > 0 ? (
                <ul className="space-y-3">
                  {recentActivity.recentTeams.slice(0, 5).map((team) => (
                    <li key={team._id} className="border-b pb-3 last:border-b-0 last:pb-0">
                      <h3 className="font-medium text-gray-900">{team.name}</h3>
                      <p className="text-sm text-gray-600">Owner: {team.owner?.name}</p>
                      <div className="mt-1 text-xs text-gray-500">
                        {team.members?.length} members
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No recent teams</p>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
            <div className="flex space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <button
                onClick={() => setShowCreateUserForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                + Create User
              </button>
            </div>
          </div>

          {showCreateUserForm && (
            <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Create New User</h3>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="MEMBER">Member</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Create User
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateUserForm(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-10 h-10 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{user.name.charAt(0)}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) => handleUserUpdate(user._id, { ...user, role: e.target.value })}
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.role === 'ADMIN'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        <option value="MEMBER">Member</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.isActive
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleUserUpdate(user._id, { ...user, isActive: !user.isActive })}
                        className={`mr-3 ${
                          user.isActive
                            ? 'text-red-600 hover:text-red-900'
                            : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleUserDelete(user._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Project Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 6).map((project) => (
              <div key={project._id} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg">{project.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className={`px-2 py-1 rounded-full ${
                    project.status === 'active' ? 'bg-green-100 text-green-800' :
                    project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    project.status === 'on-hold' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {project.status}
                  </span>
                  <span className="text-gray-500">{project.members?.length} members</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;