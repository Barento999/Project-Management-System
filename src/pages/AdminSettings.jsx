import { useState } from "react";
import { FaSave, FaCog, FaShieldAlt, FaBell, FaDatabase } from "react-icons/fa";

const AdminSettings = () => {
  const [settings, setSettings] = useState(() => {
    // Load settings from localStorage on initial render
    const savedSettings = localStorage.getItem("admin_settings");
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
    return {
      emailNotifications: true,
      twoFactorAuth: false,
      passwordPolicy: true,
      sessionTimeout: "30",
      allowRegistration: true,
      requireEmailVerification: true,
      maxFileSize: "10",
      allowedFileTypes: "pdf,doc,docx,xls,xlsx,jpg,png,gif",
    };
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem("admin_settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
            <p className="text-gray-600">
              Manage system settings and configurations
            </p>
          </div>
          {saved && (
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg flex items-center">
              <FaSave className="mr-2" />
              Settings saved successfully!
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="space-y-8">
          {/* General Settings */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaCog className="mr-2 text-blue-600" />
              General Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-600">
                    Enable or disable email notifications for all users
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.emailNotifications}
                    onChange={() => handleToggle("emailNotifications")}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Allow User Registration</h3>
                  <p className="text-sm text-gray-600">
                    Allow new users to register accounts
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.allowRegistration}
                    onChange={() => handleToggle("allowRegistration")}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Require Email Verification</h3>
                  <p className="text-sm text-gray-600">
                    Users must verify their email before accessing the system
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.requireEmailVerification}
                    onChange={() => handleToggle("requireEmailVerification")}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaShieldAlt className="mr-2 text-red-600" />
              Security Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600">
                    Require 2FA for all admin users
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.twoFactorAuth}
                    onChange={() => handleToggle("twoFactorAuth")}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Strong Password Policy</h3>
                  <p className="text-sm text-gray-600">
                    Enforce strong password requirements (min 8 chars,
                    uppercase, lowercase, numbers)
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.passwordPolicy}
                    onChange={() => handleToggle("passwordPolicy")}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">Session Timeout</h3>
                  <p className="text-sm text-gray-600">
                    Auto-logout users after period of inactivity
                  </p>
                </div>
                <select
                  value={settings.sessionTimeout}
                  onChange={(e) =>
                    handleChange("sessionTimeout", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="0">Never</option>
                </select>
              </div>
            </div>
          </div>

          {/* File Upload Settings */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaDatabase className="mr-2 text-green-600" />
              File Upload Settings
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block">
                  <h3 className="font-medium mb-2">Maximum File Size (MB)</h3>
                  <input
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) =>
                      handleChange("maxFileSize", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    max="100"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Maximum size for uploaded files
                  </p>
                </label>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block">
                  <h3 className="font-medium mb-2">Allowed File Types</h3>
                  <input
                    type="text"
                    value={settings.allowedFileTypes}
                    onChange={(e) =>
                      handleChange("allowedFileTypes", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="pdf,doc,docx,jpg,png"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Comma-separated list of allowed file extensions
                  </p>
                </label>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaBell className="mr-2 text-purple-600" />
              System Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-700">System Version</h3>
                <p className="text-2xl font-bold text-gray-900">v1.0.0</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-700">Database Status</h3>
                <p className="text-2xl font-bold text-green-600">Connected</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-700">API Status</h3>
                <p className="text-2xl font-bold text-green-600">Online</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-700">Last Backup</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors duration-200">
              <FaSave className="mr-2" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
