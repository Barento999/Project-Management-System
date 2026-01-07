import React, { useState } from "react";
import { FaBook, FaCode, FaKey, FaCopy, FaCheckCircle } from "react-icons/fa";

const APIDocs = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const apiEndpoints = [
    {
      category: "Authentication",
      endpoints: [
        {
          method: "POST",
          path: "/api/auth/register",
          description: "Register a new user",
          body: {
            name: "string",
            email: "string",
            password: "string",
          },
          response: {
            token: "string",
            user: { id: "string", name: "string", email: "string" },
          },
        },
        {
          method: "POST",
          path: "/api/auth/login",
          description: "Login user",
          body: {
            email: "string",
            password: "string",
          },
          response: {
            token: "string",
            user: { id: "string", name: "string", email: "string" },
          },
        },
      ],
    },
    {
      category: "Projects",
      endpoints: [
        {
          method: "GET",
          path: "/api/projects",
          description: "Get all projects",
          headers: { Authorization: "Bearer {token}" },
          response: {
            projects: [
              {
                _id: "string",
                name: "string",
                description: "string",
                status: "string",
              },
            ],
          },
        },
        {
          method: "POST",
          path: "/api/projects",
          description: "Create a new project",
          headers: { Authorization: "Bearer {token}" },
          body: {
            name: "string",
            description: "string",
            startDate: "date",
            endDate: "date",
          },
          response: {
            project: { _id: "string", name: "string", description: "string" },
          },
        },
        {
          method: "PUT",
          path: "/api/projects/:id",
          description: "Update a project",
          headers: { Authorization: "Bearer {token}" },
          body: {
            name: "string",
            description: "string",
            status: "string",
          },
          response: {
            project: { _id: "string", name: "string", description: "string" },
          },
        },
        {
          method: "DELETE",
          path: "/api/projects/:id",
          description: "Delete a project",
          headers: { Authorization: "Bearer {token}" },
          response: {
            message: "Project deleted successfully",
          },
        },
      ],
    },
    {
      category: "Tasks",
      endpoints: [
        {
          method: "GET",
          path: "/api/tasks",
          description: "Get all tasks",
          headers: { Authorization: "Bearer {token}" },
          query: {
            project: "string (optional)",
            status: "string (optional)",
            priority: "string (optional)",
          },
          response: {
            tasks: [
              {
                _id: "string",
                title: "string",
                description: "string",
                status: "string",
                priority: "string",
              },
            ],
          },
        },
        {
          method: "POST",
          path: "/api/tasks",
          description: "Create a new task",
          headers: { Authorization: "Bearer {token}" },
          body: {
            title: "string",
            description: "string",
            project: "string",
            priority: "string",
            dueDate: "date",
          },
          response: {
            task: { _id: "string", title: "string", description: "string" },
          },
        },
      ],
    },
    {
      category: "Teams",
      endpoints: [
        {
          method: "GET",
          path: "/api/teams",
          description: "Get all teams",
          headers: { Authorization: "Bearer {token}" },
          response: {
            teams: [
              {
                _id: "string",
                name: "string",
                description: "string",
                members: ["string"],
              },
            ],
          },
        },
        {
          method: "POST",
          path: "/api/teams",
          description: "Create a new team",
          headers: { Authorization: "Bearer {token}" },
          body: {
            name: "string",
            description: "string",
          },
          response: {
            team: { _id: "string", name: "string", description: "string" },
          },
        },
      ],
    },
  ];

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const generateCurlExample = (endpoint) => {
    let curl = `curl -X ${endpoint.method} \\\n  ${window.location.origin}${endpoint.path}`;

    if (endpoint.headers) {
      curl += ` \\\n  -H "Authorization: Bearer YOUR_TOKEN"`;
    }

    curl += ` \\\n  -H "Content-Type: application/json"`;

    if (endpoint.body) {
      curl += ` \\\n  -d '${JSON.stringify(endpoint.body, null, 2)}'`;
    }

    return curl;
  };

  const getMethodColor = (method) => {
    const colors = {
      GET: "bg-blue-100 text-blue-800",
      POST: "bg-green-100 text-green-800",
      PUT: "bg-yellow-100 text-yellow-800",
      DELETE: "bg-red-100 text-red-800",
    };
    return colors[method] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaBook className="text-4xl text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                API Documentation
              </h1>
              <p className="text-gray-600">
                Complete reference for the Project Management API
              </p>
            </div>
          </div>
        </div>

        {/* API Key Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <FaKey className="text-blue-600 text-2xl flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-800 mb-2">
                Authentication
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                All API requests require authentication using a Bearer token.
                Include your token in the Authorization header:
              </p>
              <div className="bg-white rounded-lg p-3 font-mono text-sm">
                Authorization: Bearer YOUR_TOKEN_HERE
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Endpoints List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sticky top-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Endpoints
              </h2>
              <div className="space-y-4">
                {apiEndpoints.map((category, idx) => (
                  <div key={idx}>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      {category.category}
                    </h3>
                    <div className="space-y-1">
                      {category.endpoints.map((endpoint, endIdx) => (
                        <button
                          key={endIdx}
                          onClick={() => setSelectedEndpoint(endpoint)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedEndpoint === endpoint
                              ? "bg-blue-100 text-blue-800"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}>
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-medium mr-2 ${getMethodColor(
                              endpoint.method
                            )}`}>
                            {endpoint.method}
                          </span>
                          <span className="text-xs">{endpoint.path}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Endpoint Details */}
          <div className="lg:col-span-2">
            {selectedEndpoint ? (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`px-3 py-1 rounded-lg text-sm font-bold ${getMethodColor(
                      selectedEndpoint.method
                    )}`}>
                    {selectedEndpoint.method}
                  </span>
                  <code className="text-lg font-mono text-gray-800">
                    {selectedEndpoint.path}
                  </code>
                </div>

                <p className="text-gray-600 mb-6">
                  {selectedEndpoint.description}
                </p>

                {/* Headers */}
                {selectedEndpoint.headers && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Headers
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <pre className="text-sm">
                        {JSON.stringify(selectedEndpoint.headers, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Query Parameters */}
                {selectedEndpoint.query && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Query Parameters
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <pre className="text-sm">
                        {JSON.stringify(selectedEndpoint.query, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Request Body */}
                {selectedEndpoint.body && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Request Body
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <pre className="text-sm">
                        {JSON.stringify(selectedEndpoint.body, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Response */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Response
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <pre className="text-sm">
                      {JSON.stringify(selectedEndpoint.response, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* cURL Example */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      cURL Example
                    </h3>
                    <button
                      onClick={() =>
                        copyCode(generateCurlExample(selectedEndpoint))
                      }
                      className="flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                      {copiedCode ? (
                        <>
                          <FaCheckCircle className="text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <FaCopy />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-green-400">
                      {generateCurlExample(selectedEndpoint)}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
                <FaCode className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  Select an endpoint to view documentation
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIDocs;
