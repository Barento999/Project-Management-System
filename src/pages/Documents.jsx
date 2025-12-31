import React from 'react';

const Documents = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <p className="text-gray-600">Manage and share project documents</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">All Documents</h3>
            <p className="text-gray-600">View all project documents</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">My Documents</h3>
            <p className="text-gray-600">View documents assigned to you</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Shared Documents</h3>
            <p className="text-gray-600">View documents shared with you</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;