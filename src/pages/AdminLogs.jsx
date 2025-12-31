import React from 'react';

const AdminLogs = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
        <p className="text-gray-600">View system activity and user actions</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <div className="flex space-x-2">
            <input
              type="date"
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
            <select className="px-3 py-2 border border-gray-300 rounded-lg">
              <option>All Events</option>
              <option>Login</option>
              <option>Logout</option>
              <option>Project Created</option>
              <option>Task Updated</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Filter
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-8 h-8 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">JD</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">John Doe</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Login
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">User logged in successfully</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jan 18, 2025 10:30 AM</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-8 h-8 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">JS</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Jane Smith</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    Task Created
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">Created task 'Update Documentation'</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jan 18, 2025 9:45 AM</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-600 w-8 h-8 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">MJ</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Mike Johnson</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Project Updated
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">Updated project 'Website Redesign'</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jan 17, 2025 4:20 PM</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminLogs;