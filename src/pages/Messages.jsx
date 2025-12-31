import React from 'react';

const Messages = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600">Communicate with your team</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Inbox</h3>
            <p className="text-gray-600">View your received messages</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Sent</h3>
            <p className="text-gray-600">View your sent messages</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">New Message</h3>
            <p className="text-gray-600">Send a new message</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;