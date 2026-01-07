import React from 'react';

const TeamsDirectory = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900">Team Directory</h1>
        <p className="text-gray-600">Browse all teams in the organization</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-12 h-12 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">DT</span>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-lg">Development Team</h3>
                <p className="text-sm text-gray-600">12 members</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Responsible for all development projects</p>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200">View</button>
              <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200">Join</button>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-12 h-12 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">MT</span>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-lg">Marketing Team</h3>
                <p className="text-sm text-gray-600">8 members</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Handles all marketing and promotional activities</p>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200">View</button>
              <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200">Join</button>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 w-12 h-12 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">DT</span>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-lg">Design Team</h3>
                <p className="text-sm text-gray-600">6 members</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Responsible for UI/UX and visual design</p>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200">View</button>
              <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200">Join</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamsDirectory;