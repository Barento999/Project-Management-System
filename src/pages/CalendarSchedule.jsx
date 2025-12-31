import React from 'react';

const CalendarSchedule = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
        <p className="text-gray-600">Manage your appointments and events</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-4">Today's Schedule</h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">Team Standup</span>
                  <span className="text-sm text-gray-600">9:00 AM</span>
                </div>
                <p className="text-sm text-gray-600">Conference Room A</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">Project Review</span>
                  <span className="text-sm text-gray-600">2:00 PM</span>
                </div>
                <p className="text-sm text-gray-600">Conference Room B</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">Client Call</span>
                  <span className="text-sm text-gray-600">4:30 PM</span>
                </div>
                <p className="text-sm text-gray-600">Video Conference</p>
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">Team Lunch</span>
                  <span className="text-sm text-gray-600">Jan 15</span>
                </div>
                <p className="text-sm text-gray-600">Restaurant</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">Product Launch</span>
                  <span className="text-sm text-gray-600">Jan 20</span>
                </div>
                <p className="text-sm text-gray-600">Main Hall</p>
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-4">Add Event</h3>
            <form className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Enter event title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Enter location"
                />
              </div>
              <button
                type="button"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Add Event
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarSchedule;