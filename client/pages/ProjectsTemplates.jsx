import React from 'react';

const ProjectsTemplates = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900">Project Templates</h1>
        <p className="text-gray-600">Use templates to quickly create new projects</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-2xl">📝</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Basic Project</h3>
            <p className="text-gray-600 mb-4">A simple project template with basic tasks</p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              Use Template
            </button>
          </div>
          <div className="border rounded-lg p-4">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-2xl">🚀</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Agile Sprint</h3>
            <p className="text-gray-600 mb-4">A template for agile development sprints</p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              Use Template
            </button>
          </div>
          <div className="border rounded-lg p-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <span className="text-white text-2xl">📊</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Marketing Campaign</h3>
            <p className="text-gray-600 mb-4">A template for marketing campaign projects</p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              Use Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsTemplates;