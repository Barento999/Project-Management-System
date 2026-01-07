import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendar,
  FaPlus,
  FaClock,
  FaMapMarkerAlt,
  FaTimes,
  FaCheckCircle,
  FaUsers,
} from "react-icons/fa";

const CalendarSchedule = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    try {
      // Load events from localStorage (same as main calendar)
      const storedEvents = localStorage.getItem("calendar_events");
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    setCurrentEvent({
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      startTime: "09:00",
      endTime: "10:00",
      location: "",
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
      localStorage.setItem("calendar_events", JSON.stringify(updatedEvents));
      setShowEventModal(false);
      setCurrentEvent(null);
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Failed to save event. Please try again.");
    }
  };

  const getTodayEvents = () => {
    const today = new Date().toISOString().split("T")[0];
    return events.filter((e) => e.date === today);
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    return events
      .filter((e) => new Date(e.date) > today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaCalendar className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading schedule...</p>
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
                <FaCalendar className="text-blue-600" />
                Schedule
              </h1>
              <p className="text-gray-500 mt-1">
                Manage your appointments and events
              </p>
            </div>
            <button
              onClick={handleCreateEvent}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold">
              <FaPlus /> Add Event
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-t border-gray-200 pt-4">
            <button
              onClick={() => navigate("/calendar")}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-semibold flex items-center gap-2">
              <FaCalendar /> My Calendar
            </button>
            <button
              onClick={() => navigate("/calendar/team")}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-semibold flex items-center gap-2">
              <FaUsers /> Team Calendar
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2">
              <FaClock /> Schedule
            </button>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaClock className="text-blue-600" />
              Today's Schedule
            </h3>
            <div className="space-y-3">
              {getTodayEvents().length > 0 ? (
                getTodayEvents().map((event, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-gray-900">
                        {event.title}
                      </span>
                      <span className="text-sm text-gray-500">
                        {event.startTime}
                      </span>
                    </div>
                    {event.location && (
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <FaMapMarkerAlt className="text-blue-600" />
                        {event.location}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FaCheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                  <p className="text-gray-500">No events today</p>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaCalendar className="text-blue-600" />
              Upcoming Events
            </h3>
            <div className="space-y-3">
              {getUpcomingEvents().length > 0 ? (
                getUpcomingEvents().map((event, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-gray-900">
                        {event.title}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    {event.location && (
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <FaMapMarkerAlt className="text-blue-600" />
                        {event.location}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FaCalendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No upcoming events</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Add Event */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaPlus className="text-blue-600" />
              Quick Add
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="Enter event title"
                  value={currentEvent?.title || ""}
                  onChange={(e) =>
                    setCurrentEvent({
                      ...currentEvent,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none"
                  value={
                    currentEvent?.date && currentEvent?.startTime
                      ? `${currentEvent.date}T${currentEvent.startTime}`
                      : ""
                  }
                  onChange={(e) => {
                    const [date, time] = e.target.value.split("T");
                    setCurrentEvent({
                      ...currentEvent,
                      date,
                      startTime: time,
                    });
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="Enter location"
                  value={currentEvent?.location || ""}
                  onChange={(e) =>
                    setCurrentEvent({
                      ...currentEvent,
                      location: e.target.value,
                    })
                  }
                />
              </div>
              <button
                onClick={handleCreateEvent}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold">
                Add Event
              </button>
            </div>
          </div>
        </div>

        {/* Event Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Events</p>
                <p className="text-3xl font-bold text-gray-900">
                  {events.length}
                </p>
              </div>
              <FaCalendar className="text-4xl text-blue-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Today</p>
                <p className="text-3xl font-bold text-gray-900">
                  {getTodayEvents().length}
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
                  {getUpcomingEvents().length}
                </p>
              </div>
              <FaMapMarkerAlt className="text-4xl text-amber-500 opacity-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {currentEvent._id ? "Edit Event" : "Create Event"}
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
                  Location
                </label>
                <input
                  type="text"
                  value={currentEvent.location}
                  onChange={(e) =>
                    setCurrentEvent({
                      ...currentEvent,
                      location: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none"
                  placeholder="Event location"
                />
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

export default CalendarSchedule;
