import React from 'react';

const CalendarTeam = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900">Team Calendar</h1>
        <p className="text-gray-600">View events and meetings for your team</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">January 2025</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300">Prev</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Today</button>
            <button className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300">Next</button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-medium py-2 text-gray-600">{day}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }, (_, i) => {
            const day = i - 5; // Start from the 6th day to align with January
            const date = day > 0 && day <= 31 ? day : '';
            const hasEvent = [5, 12, 15, 22, 28].includes(day); // Example event days
            
            return (
              <div key={i} className="min-h-24 p-1 border rounded">
                <div className={`text-right ${date ? 'font-medium' : 'text-gray-300'}`}>
                  {date}
                </div>
                {hasEvent && (
                  <div className="mt-1 text-xs bg-blue-100 text-blue-800 p-1 rounded truncate">
                    Team Meeting
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarTeam;