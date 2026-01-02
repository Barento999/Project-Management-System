import { useState, useEffect, useCallback } from "react";
import {
  FaClock,
  FaPlay,
  FaStop,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCalendar,
  FaChartBar,
} from "react-icons/fa";
import { timeTrackingAPI, taskAPI } from "../services/api";

const TimeTrackingBeautiful = () => {
  const [runningTimer, setRunningTimer] = useState(null);
  const [timeEntries, setTimeEntries] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showManualForm, setShowManualForm] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [filter] = useState({
    startDate: "",
    endDate: "",
    taskId: "",
  });

  // Manual entry form
  const [manualEntry, setManualEntry] = useState({
    taskId: "",
    description: "",
    duration: "",
    startTime: "",
    endTime: "",
  });

  // Timer form
  const [timerForm, setTimerForm] = useState({
    taskId: "",
    description: "",
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [runningRes, entriesRes, tasksRes] = await Promise.all([
        timeTrackingAPI.getRunning(),
        timeTrackingAPI.getAll(filter),
        taskAPI.getAll(),
      ]);

      setRunningTimer(runningRes.data.timeEntry);
      setTimeEntries(entriesRes.data.timeEntries || []);
      setTasks(tasksRes.data.tasks || []);

      if (runningRes.data.timeEntry) {
        const start = new Date(runningRes.data.timeEntry.startTime);
        const now = new Date();
        setElapsedTime(Math.floor((now - start) / 1000));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    let interval;
    if (runningTimer) {
      interval = setInterval(() => {
        const start = new Date(runningTimer.startTime);
        const now = new Date();
        const diff = Math.floor((now - start) / 1000);
        setElapsedTime(diff);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [runningTimer]);

  const startTimer = async () => {
    if (!timerForm.taskId) {
      alert("Please select a task");
      return;
    }

    try {
      const res = await timeTrackingAPI.start(timerForm);
      setRunningTimer(res.data.timeEntry);
      setTimerForm({ taskId: "", description: "" });
      alert("Timer started!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to start timer");
    }
  };

  const stopTimer = async () => {
    if (!runningTimer) return;

    try {
      await timeTrackingAPI.stop(runningTimer._id);
      setRunningTimer(null);
      setElapsedTime(0);
      fetchData();
      alert("Timer stopped!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to stop timer");
    }
  };

  const createManualEntry = async () => {
    if (!manualEntry.taskId || !manualEntry.duration) {
      alert("Please fill in task and duration");
      return;
    }

    try {
      await timeTrackingAPI.createManual({
        ...manualEntry,
        duration: parseInt(manualEntry.duration),
      });
      setShowManualForm(false);
      setManualEntry({
        taskId: "",
        description: "",
        duration: "",
        startTime: "",
        endTime: "",
      });
      fetchData();
      alert("Time entry created!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create entry");
    }
  };

  const deleteEntry = async (id) => {
    if (!confirm("Delete this time entry?")) return;

    try {
      await timeTrackingAPI.delete(id);
      fetchData();
      alert("Time entry deleted!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete entry");
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDuration = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  const totalHours =
    timeEntries.reduce((sum, entry) => sum + entry.duration, 0) / 60;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaClock className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading time tracking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            ⏱️ Time Tracking
          </h1>
          <p className="text-gray-500">Track your time and manage timesheets</p>
        </div>

        {/* Running Timer Card */}
        {runningTimer ? (
          <div className="mb-8 bg-green-600 rounded-3xl p-8 shadow-2xl text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <FaClock className="w-6 h-6 animate-pulse" />
                  <h2 className="text-2xl font-bold">Timer Running</h2>
                </div>
                <p className="text-lg opacity-90">{runningTimer.task?.title}</p>
                {runningTimer.description && (
                  <p className="text-sm opacity-75 mt-1">
                    {runningTimer.description}
                  </p>
                )}
              </div>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-mono font-bold mb-4">
                  {formatTime(elapsedTime)}
                </div>
                <button
                  onClick={stopTimer}
                  className="bg-white text-red-600 border-2 border-red-600 px-8 py-3 rounded-xl font-semibold hover:bg-red-50 transition-all flex items-center gap-2 mx-auto">
                  <FaStop /> Stop Timer
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8 bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaPlay className="text-blue-600" /> Start Timer
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={timerForm.taskId}
                onChange={(e) =>
                  setTimerForm({ ...timerForm, taskId: e.target.value })
                }
                className="px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none transition-all">
                <option value="">Select Task</option>
                {tasks.map((task) => (
                  <option key={task._id} value={task._id}>
                    {task.title}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Description (optional)"
                value={timerForm.description}
                onChange={(e) =>
                  setTimerForm({ ...timerForm, description: e.target.value })
                }
                className="px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              />
              <button
                onClick={startTimer}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                <FaPlay /> Start Timer
              </button>
            </div>
          </div>
        )}

        {/* Stats and Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Hours</p>
                <p className="text-3xl font-bold text-blue-600">
                  {totalHours.toFixed(1)}h
                </p>
              </div>
              <FaClock className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Entries</p>
                <p className="text-3xl font-bold text-blue-600">
                  {timeEntries.length}
                </p>
              </div>
              <FaCalendar className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
          <button
            onClick={() => setShowManualForm(!showManualForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 font-semibold">
            <FaPlus className="w-6 h-6" />
            Add Manual Entry
          </button>
        </div>

        {/* Manual Entry Form */}
        {showManualForm && (
          <div className="mb-8 bg-white rounded-3xl p-8 shadow-xl border border-gray-200 animate-slide-down">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Add Manual Time Entry
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <select
                value={manualEntry.taskId}
                onChange={(e) =>
                  setManualEntry({ ...manualEntry, taskId: e.target.value })
                }
                className="px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none transition-all">
                <option value="">Select Task *</option>
                {tasks.map((task) => (
                  <option key={task._id} value={task._id}>
                    {task.title}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Duration (minutes) *"
                value={manualEntry.duration}
                onChange={(e) =>
                  setManualEntry({ ...manualEntry, duration: e.target.value })
                }
                className="px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              />
            </div>
            <textarea
              placeholder="Description (optional)"
              value={manualEntry.description}
              onChange={(e) =>
                setManualEntry({ ...manualEntry, description: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 outline-none transition-all mb-4"
              rows="3"
            />
            <div className="flex gap-3">
              <button
                onClick={createManualEntry}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
                Create Entry
              </button>
              <button
                onClick={() => setShowManualForm(false)}
                className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Time Entries List */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FaChartBar className="text-blue-600" /> Time Entries
          </h2>

          {timeEntries.length === 0 ? (
            <div className="text-center py-12">
              <FaClock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No time entries yet</p>
              <p className="text-gray-400">Start tracking your time!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {timeEntries.map((entry) => (
                <div
                  key={entry._id}
                  className="bg-gray-50 rounded-2xl p-6 border-l-4 border-blue-600 hover:shadow-lg transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">
                        {entry.task?.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {entry.project?.name}
                      </p>
                      {entry.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {entry.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(entry.startTime).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          {formatDuration(entry.duration)}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteEntry(entry._id)}
                        className="p-3 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TimeTrackingBeautiful;
