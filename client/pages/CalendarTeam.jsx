import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendar,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaUsers,
  FaTimes,
} from "react-icons/fa";

const CalendarTeam = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [showDayView, setShowDayView] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    try {
      // Load team events from localStorage
      const storedEvents = localStorage.getItem("calendar_team_events");
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      } else {
        // Demo team events
        const demoEvents = [
          {
            _id: "1",
            title: "Team Standup",
            description: "Daily standup meeting",
            date: new Date().toISOString().split("T")[0],
            startTime: "09:00",
            endTime: "09:30",
            isTeamEvent: true,
          },
        ];
        setEvents(demoEvents);
        localStorage.setItem(
          "calendar_team_events",
          JSON.stringify(demoEvents)
        );
      }
    } catch (error) {
      console.error("Error fetching team events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    setCurrentEvent({
      title: "",
      description: "",
      date: selectedDate.toISOString().split("T")[0],
      startTime: "09:00",
      endTime: "10:00",
      attendees: [],
      isTeamEvent: true,
    });
    setShowEventModal(true);
  };

  const handleSaveEvent = () => {
    try {
      let updatedEvents;
      if (currentEvent._id) {
        // Update existing event
        updatedEvents = events.map((e) =>
          e._id === currentEvent._id ? currentEvent : e
        );
      } else {
        // Create new event
        const newEvent = {
          ...currentEvent,
          _id: Date.now().toString(),
        };
        updatedEvents = [...events, newEvent];
      }
      setEvents(updatedEvents);
      localStorage.setItem(
        "calendar_team_events",
        JSON.stringify(updatedEvents)
      );
      setShowEventModal(false);
      setCurrentEvent(null);
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Failed to save event. Please try again.");
    }
  };

  const handleDayClick = (day) => {
    if (day.events.length > 0) {
      setSelectedDayEvents(day.events);
      setShowDayView(true);
    }
  };

  const renderCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDay = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      const dayEvents = events.filter((event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getDate() === currentDay.getDate() &&
          eventDate.getMonth() === currentDay.getMonth() &&
          eventDate.getFullYear() === currentDay.getFullYear()
        );
      });

      days.push({
        date: new Date(currentDay),
        isCurrentMonth: currentDay.getMonth() === month,
        events: dayEvents,
      });

      currentDay.setDate(currentDay.getDate() + 1);
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center font-semibold py-3 text-gray-900 bg-gray-50 border-b-2 border-gray-200">
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          <div
            key={index}
            onClick={() => handleDayClick(day)}
            className={`min-h-28 p-2 border border-gray-200 rounded-lg transition-all cursor-pointer ${
              day.isCurrentMonth
                ? "bg-white hover:bg-blue-50"
                : "bg-gray-50 text-gray-400"
            } ${
              day.date.toDateString() === new Date().toDateString()
                ? "ring-2 ring-blue-600 bg-blue-50"
                : ""
            }`}>
            <div className="text-right font-semibold text-sm mb-1">
              {day.date.getDate()}
            </div>
            <div className="space-y-1 max-h-16 overflow-y-auto">
              {day.events.slice(0, 2).map((event, idx) => (
                <div
                  key={idx}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded truncate">
                  {event.title}
                </div>
              ))}
              {day.events.length > 2 && (
                <div className="text-xs text-blue-600 font-semibold">
                  +{day.events.length - 2} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaCalendar className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading team calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <FaUsers className="text-blue-600" />
                Team Calendar
              </h1>
              <p className="text-gray-500 mt-1">
                View and manage team events and meetings
              </p>
            </div>
            <button
              onClick={handleCreateEvent}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold">
              <FaPlus /> New Team Event
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-t border-gray-200 pt-4">
            <button
              onClick={() => navigate("/calendar")}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-semibold flex items-center gap-2">
              <FaCalendar /> My Calendar
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2">
              <FaUsers /> Team Calendar
            </button>
            <button
              onClick={() => navigate("/calendar/schedule")}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-semibold flex items-center gap-2">
              <FaClock /> Schedule
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setSelectedDate(
                    new Date(
                      selectedDate.getFullYear(),
                      selectedDate.getMonth() - 1,
                      1
                    )
                  )
                }
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2">
                <FaChevronLeft /> Prev
              </button>
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold">
                Today
              </button>
              <button
                onClick={() =>
                  setSelectedDate(
                    new Date(
                      selectedDate.getFullYear(),
                      selectedDate.getMonth() + 1,
                      1
                    )
                  )
                }
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2">
                Next <FaChevronRight />
              </button>
            </div>
          </div>
          {renderCalendar()}
        </div>

        {/* Event Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Team Events</p>
                <p className="text-3xl font-bold text-gray-900">
                  {events.length}
                </p>
              </div>
              <FaUsers className="text-4xl text-blue-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">This Month</p>
                <p className="text-3xl font-bold text-gray-900">
                  {
                    events.filter((e) => {
                      const d = new Date(e.date);
                      return (
                        d.getMonth() === selectedDate.getMonth() &&
                        d.getFullYear() === selectedDate.getFullYear()
                      );
                    }).length
                  }
                </p>
              </div>
              <FaClock className="text-4xl text-green-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Upcoming</p>
                <p className="text-3xl font-bold text-gray-900">
                  {events.filter((e) => new Date(e.date) > new Date()).length}
                </p>
              </div>
              <FaCalendar className="text-4xl text-amber-500 opacity-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Day View Modal */}
      {showDayView && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Team Events for this day
              </h3>
              <button
                onClick={() => setShowDayView(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                <FaTimes className="text-gray-500" />
              </button>
            </div>
            <div className="space-y-3">
              {selectedDayEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {event.startTime} - {event.endTime}
                  </p>
                  {event.description && (
                    <p className="text-sm text-gray-600 mt-2">
                      {event.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {currentEvent._id ? "Edit Team Event" : "Create Team Event"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={currentEvent.title}
                  onChange={(e) =>
                    setCurrentEvent({ ...currentEvent, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="Event title"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={currentEvent.date}
                  onChange={(e) =>
                    setCurrentEvent({ ...currentEvent, date: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={currentEvent.startTime}
                    onChange={(e) =>
                      setCurrentEvent({
                        ...currentEvent,
                        startTime: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={currentEvent.endTime}
                    onChange={(e) =>
                      setCurrentEvent({
                        ...currentEvent,
                        endTime: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Description
                </label>
                <textarea
                  value={currentEvent.description}
                  onChange={(e) =>
                    setCurrentEvent({
                      ...currentEvent,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none"
                  rows="3"
                  placeholder="Event description"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowEventModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-semibold">
                Cancel
              </button>
              <button
                onClick={handleSaveEvent}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarTeam;
