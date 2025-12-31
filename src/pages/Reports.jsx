import React from 'react';

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600">View analytics and performance reports</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Project Reports</h3>
            <p className="text-gray-600">View project progress and metrics</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Task Reports</h3>
            <p className="text-gray-600">View task completion and performance</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Team Reports</h3>
            <p className="text-gray-600">View team productivity and activity</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;