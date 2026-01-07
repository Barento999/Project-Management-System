import React from 'react';

const TasksBoard = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
        <p className="text-gray-600">Visualize your tasks in a Kanban board</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">To Do</h3>
              <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full">3</span>
            </div>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-lg shadow-sm border">
                <h4 className="font-medium">Design Homepage</h4>
                <p className="text-sm text-gray-600 mt-1">Website Redesign</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Medium</span>
                  <span className="text-xs text-gray-500">Due: Today</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">In Progress</h3>
              <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full">2</span>
            </div>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-lg shadow-sm border">
                <h4 className="font-medium">Implement API</h4>
                <p className="text-sm text-gray-600 mt-1">Mobile App</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">High</span>
                  <span className="text-xs text-gray-500">Due: Tomorrow</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Review</h3>
              <span className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full">1</span>
            </div>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-lg shadow-sm border">
                <h4 className="font-medium">Update Documentation</h4>
                <p className="text-sm text-gray-600 mt-1">Website Redesign</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Low</span>
                  <span className="text-xs text-gray-500">Due: Today</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Done</h3>
              <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full">4</span>
            </div>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-lg shadow-sm border">
                <h4 className="font-medium">Setup Project</h4>
                <p className="text-sm text-gray-600 mt-1">Mobile App</p>
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

export default TasksBoard;