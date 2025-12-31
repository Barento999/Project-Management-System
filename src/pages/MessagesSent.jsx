import React from 'react';

const MessagesSent = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900">Sent Messages</h1>
        <p className="text-gray-600">Messages you have sent to your team</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">Project Update</h3>
                <p className="text-sm text-gray-600">To: Development Team</p>
              </div>
              <span className="text-xs text-gray-500">Jan 18, 10:30 AM</span>
            </div>
            <p className="mt-2 text-gray-700">Hi team, just wanted to update you on the progress of the website redesign project...</p>
            <div className="mt-3 flex space-x-2">
              <button className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200">View</button>
              <button className="text-xs px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200">Reply</button>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">Meeting Reminder</h3>
                <p className="text-sm text-gray-600">To: Marketing Team</p>
              </div>
              <span className="text-xs text-gray-500">Jan 17, 2:15 PM</span>
            </div>
            <p className="mt-2 text-gray-700">Don't forget about our team meeting tomorrow at 3 PM in Conference Room A...</p>
            <div className="mt-3 flex space-x-2">
              <button className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200">View</button>
              <button className="text-xs px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200">Reply</button>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">New Feature Request</h3>
                <p className="text-sm text-gray-600">To: Product Team</p>
              </div>
              <span className="text-xs text-gray-500">Jan 15, 4:45 PM</span>
            </div>
            <p className="mt-2 text-gray-700">I've been thinking about adding a dark mode to our application. Here are some thoughts...</p>
            <div className="mt-3 flex space-x-2">
              <button className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200">View</button>
              <button className="text-xs px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200">Reply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesSent;