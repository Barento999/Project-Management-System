import React, { useState, useEffect } from "react";
import {
  FaCog,
  FaBuilding,
  FaClock,
  FaGlobe,
  FaSave,
  FaUndo,
} from "react-icons/fa";

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    // Organization Profile
    organizationName: "",
    organizationEmail: "",
    organizationPhone: "",
    organizationAddress: "",
    organizationWebsite: "",
    organizationLogo: "",

    // Working Hours
    workingDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    },
    workStartTime: "09:00",
    workEndTime: "17:00",
    lunchBreakStart: "12:00",
    lunchBreakEnd: "13:00",

    // Timezone
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: "monday",
  });

  const [activeTab, setActiveTab] = useState("organization");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const savedSettings = localStorage.getItem("systemSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const handleSave = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem("systemSettings", JSON.stringify(settings));
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 500);
  };

  const handleReset = () => {
    if (confirm("Reset all settings to default?")) {
      localStorage.removeItem("systemSettings");
      window.location.reload();
    }
  };

  const handleWorkingDayToggle = (day) => {
    setSettings({
      ...settings,
      workingDays: {
        ...settings.workingDays,
        [day]: !settings.workingDays[day],
      },
    });
  };

  const timezones = [
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "America/Anchorage",
    "Pacific/Honolulu",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Europe/Moscow",
    "Asia/Dubai",
    "Asia/Kolkata",
    "Asia/Shanghai",
    "Asia/Tokyo",
    "Asia/Singapore",
    "Australia/Sydney",
    "Pacific/Auckland",
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <FaCog className="text-4xl text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">
                System Settings
              </h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <FaUndo />
                Reset
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                <FaSave />
                {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
              </button>
            </div>
          </div>
          <p className="text-gray-600">
            Configure organization profile, working hours, and timezone settings
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-xl shadow-md border border-gray-200 border-b-0">
          <div className="flex gap-2 p-2">
            <button
              onClick={() => setActiveTab("organization")}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === "organization"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}>
              <FaBuilding />
              Organization Profile
            </button>
            <button
              onClick={() => setActiveTab("working-hours")}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === "working-hours"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}>
              <FaClock />
              Working Hours
            </button>
            <button
              onClick={() => setActiveTab("timezone")}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === "timezone"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}>
              <FaGlobe />
              Timezone & Format
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-xl shadow-md border border-gray-200 p-8">
          {activeTab === "organization" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Organization Profile
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    value={settings.organizationName}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        organizationName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Acme Corporation"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={settings.organizationEmail}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        organizationEmail: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="contact@acme.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={settings.organizationPhone}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        organizationPhone: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={settings.organizationWebsite}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        organizationWebsite: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://acme.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={settings.organizationAddress}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      organizationAddress: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="123 Main Street, Suite 100, City, State 12345"
                />
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Organization profile information will
                  be displayed on reports, invoices, and public-facing pages.
                </p>
              </div>
            </div>
          )}

          {activeTab === "working-hours" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Working Hours Configuration
              </h2>

              {/* Working Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Working Days
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {Object.entries(settings.workingDays).map(
                    ([day, isWorking]) => (
                      <button
                        key={day}
                        onClick={() => handleWorkingDayToggle(day)}
                        className={`px-4 py-3 rounded-lg font-medium transition-all ${
                          isWorking
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}>
                        {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Work Hours */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Start Time
                  </label>
                  <input
                    type="time"
                    value={settings.workStartTime}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        workStartTime: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work End Time
                  </label>
                  <input
                    type="time"
                    value={settings.workEndTime}
                    onChange={(e) =>
                      setSettings({ ...settings, workEndTime: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Lunch Break */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lunch Break Start
                  </label>
                  <input
                    type="time"
                    value={settings.lunchBreakStart}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        lunchBreakStart: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lunch Break End
                  </label>
                  <input
                    type="time"
                    value={settings.lunchBreakEnd}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        lunchBreakEnd: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Working Hours Summary
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <strong>Working Days:</strong>{" "}
                    {Object.entries(settings.workingDays)
                      .filter(([, isWorking]) => isWorking)
                      .map(
                        ([day]) => day.charAt(0).toUpperCase() + day.slice(1)
                      )
                      .join(", ")}
                  </p>
                  <p>
                    <strong>Work Hours:</strong> {settings.workStartTime} -{" "}
                    {settings.workEndTime}
                  </p>
                  <p>
                    <strong>Lunch Break:</strong> {settings.lunchBreakStart} -{" "}
                    {settings.lunchBreakEnd}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Working hours configuration affects
                  scheduling, availability calculations, and time tracking
                  features.
                </p>
              </div>
            </div>
          )}

          {activeTab === "timezone" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Timezone & Format Settings
              </h2>

              {/* Timezone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) =>
                    setSettings({ ...settings, timezone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  {timezones.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-2">
                  Current time:{" "}
                  {new Date().toLocaleString("en-US", {
                    timeZone: settings.timezone,
                  })}
                </p>
              </div>

              {/* Date Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Format
                </label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) =>
                    setSettings({ ...settings, dateFormat: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</option>
                  <option value="DD MMM YYYY">DD MMM YYYY (31 Dec 2024)</option>
                </select>
              </div>

              {/* Time Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Format
                </label>
                <select
                  value={settings.timeFormat}
                  onChange={(e) =>
                    setSettings({ ...settings, timeFormat: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="12h">12-hour (3:30 PM)</option>
                  <option value="24h">24-hour (15:30)</option>
                </select>
              </div>

              {/* First Day of Week */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Day of Week
                </label>
                <select
                  value={settings.firstDayOfWeek}
                  onChange={(e) =>
                    setSettings({ ...settings, firstDayOfWeek: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="sunday">Sunday</option>
                  <option value="monday">Monday</option>
                  <option value="saturday">Saturday</option>
                </select>
              </div>

              {/* Preview */}
              <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Format Preview
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <strong>Date:</strong>{" "}
                    {settings.dateFormat === "MM/DD/YYYY"
                      ? "12/31/2024"
                      : settings.dateFormat === "DD/MM/YYYY"
                      ? "31/12/2024"
                      : settings.dateFormat === "YYYY-MM-DD"
                      ? "2024-12-31"
                      : "31 Dec 2024"}
                  </p>
                  <p>
                    <strong>Time:</strong>{" "}
                    {settings.timeFormat === "12h" ? "3:30 PM" : "15:30"}
                  </p>
                  <p>
                    <strong>Week starts on:</strong>{" "}
                    {settings.firstDayOfWeek.charAt(0).toUpperCase() +
                      settings.firstDayOfWeek.slice(1)}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Timezone and format settings affect how
                  dates and times are displayed throughout the application.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
