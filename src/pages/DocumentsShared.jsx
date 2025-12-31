import React from 'react';

const DocumentsShared = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900">Shared Documents</h1>
        <p className="text-gray-600">Documents shared with you by your team</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <span className="text-blue-600 text-xl">📁</span>
              </div>
              <div className="ml-3">
                <h3 className="font-semibold">Design Assets</h3>
                <p className="text-sm text-gray-600">Shared by: Jane Smith</p>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Updated: Jan 18</span>
              <span>Folder</span>
            </div>
            <div className="mt-3 flex space-x-2">
              <button className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200">Open</button>
              <button className="text-xs px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200">Download</button>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <span className="text-green-600 text-xl">📋</span>
              </div>
              <div className="ml-3">
                <h3 className="font-semibold">Budget Plan</h3>
                <p className="text-sm text-gray-600">Shared by: Mike Johnson</p>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Updated: Jan 16</span>
              <span>Excel</span>
            </div>
            <div className="mt-3 flex space-x-2">
              <button className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200">Open</button>
              <button className="text-xs px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200">Download</button>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <span className="text-yellow-600 text-xl">🖼️</span>
              </div>
              <div className="ml-3">
                <h3 className="font-semibold">Logo Variations</h3>
                <p className="text-sm text-gray-600">Shared by: Alex Chen</p>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Updated: Jan 14</span>
              <span>Images</span>
            </div>
            <div className="mt-3 flex space-x-2">
              <button className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200">Open</button>
              <button className="text-xs px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200">Download</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsShared;