import React from 'react';

const TasksMy = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
        <p className="text-gray-600">Tasks assigned to you</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">To Do</h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium">Design Homepage</h4>
                <p className="text-sm text-gray-600">Website Redesign</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Medium</span>
                  <span className="text-xs text-gray-500">Due: Today</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">In Progress</h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium">Implement API</h4>
                <p className="text-sm text-gray-600">Mobile App</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">High</span>
                  <span className="text-xs text-gray-500">Due: Tomorrow</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Completed</h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium">Update Documentation</h4>
                <p className="text-sm text-gray-600">Website Redesign</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Low</span>
                  <span className="text-xs text-gray-500">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksMy;