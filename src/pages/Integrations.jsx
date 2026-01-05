import { useState } from "react";
import {
  FaSlack,
  FaGithub,
  FaGoogle,
  FaTrello,
  FaJira,
  FaDiscord,
  FaPlug,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const Integrations = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: "slack",
      name: "Slack",
      icon: <FaSlack className="text-4xl" />,
      description: "Get notifications and updates in your Slack workspace",
      connected: false,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: "github",
      name: "GitHub",
      icon: <FaGithub className="text-4xl" />,
      description: "Link commits and pull requests to tasks",
      connected: false,
      color: "text-gray-800",
      bgColor: "bg-gray-50",
    },
    {
      id: "google",
      name: "Google Calendar",
      icon: <FaGoogle className="text-4xl" />,
      description: "Sync tasks and deadlines with Google Calendar",
      connected: false,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "trello",
      name: "Trello",
      icon: <FaTrello className="text-4xl" />,
      description: "Import boards and cards from Trello",
      connected: false,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      id: "jira",
      name: "Jira",
      icon: <FaJira className="text-4xl" />,
      description: "Sync issues and sprints with Jira",
      connected: false,
      color: "text-blue-700",
      bgColor: "bg-blue-50",
    },
    {
      id: "discord",
      name: "Discord",
      icon: <FaDiscord className="text-4xl" />,
      description: "Send notifications to Discord channels",
      connected: false,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ]);

  const toggleIntegration = (id) => {
    setIntegrations((prev) =>
      prev.map((int) =>
        int.id === id ? { ...int, connected: !int.connected } : int
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaPlug className="text-4xl text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Integrations</h1>
              <p className="text-gray-600">
                Connect your favorite tools and services
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Total Integrations
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {integrations.length}
                </p>
              </div>
              <FaPlug className="text-4xl text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Connected</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {integrations.filter((i) => i.connected).length}
                </p>
              </div>
              <FaCheckCircle className="text-4xl text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Available</p>
                <p className="text-3xl font-bold text-gray-600 mt-1">
                  {integrations.filter((i) => !i.connected).length}
                </p>
              </div>
              <FaTimesCircle className="text-4xl text-gray-400" />
            </div>
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`${integration.bgColor} p-3 rounded-lg`}>
                  <div className={integration.color}>{integration.icon}</div>
                </div>
                {integration.connected && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
                    <FaCheckCircle />
                    Connected
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {integration.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {integration.description}
              </p>

              <button
                onClick={() => toggleIntegration(integration.id)}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                  integration.connected
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}>
                {integration.connected ? "Disconnect" : "Connect"}
              </button>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <FaPlug className="text-blue-600 text-2xl flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">
                About Integrations
              </h3>
              <p className="text-sm text-blue-700">
                Integrations allow you to connect your project management system
                with other tools you use daily. This demo shows the integration
                interface - in production, each integration would require OAuth
                authentication and API configuration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
