import React from 'react';

const DocumentsMy = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
        <p className="text-gray-600">Documents assigned to you</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <span className="text-blue-600 text-xl">📄</span>
              </div>
              <div className="ml-3">
                <h3 className="font-semibold">Project Plan</h3>
                <p className="text-sm text-gray-600">Website Redesign</p>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Updated: Jan 15</span>
              <span>2.4 MB</span>
            </div>
            <div className="mt-3 flex space-x-2">
              <button className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200">View</button>
              <button className="text-xs px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200">Download</button>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <span className="text-green-600 text-xl">📊</span>
              </div>
              <div className="ml-3">
                <h3 className="font-semibold">Q1 Report</h3>
                <p className="text-sm text-gray-600">Marketing Campaign</p>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Updated: Jan 12</span>
              <span>1.8 MB</span>
            </div>
            <div className="mt-3 flex space-x-2">
              <button className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200">View</button>
              <button className="text-xs px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200">Download</button>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <span className="text-purple-600 text-xl">📝</span>
              </div>
              <div className="ml-3">
                <h3 className="font-semibold">Meeting Notes</h3>
                <p className="text-sm text-gray-600">Team Sync</p>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Updated: Jan 10</span>
              <span>0.5 MB</span>
            </div>
            <div className="mt-3 flex space-x-2">
              <button className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200">View</button>
              <button className="text-xs px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200">Download</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsMy;