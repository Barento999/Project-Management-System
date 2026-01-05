import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendar,
  FaChevronLeft,
  FaChevronRight,
  FaTasks,
  FaExclamationTriangle,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import { taskAPI } from "../services/api";

const CalendarTasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [draggedTask, setDraggedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await taskAPI.getAll();
      setTasks(response.data.tasks || response.data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Calendar navigation
  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get calendar days
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate).toISOString().split("T")[0];
      return taskDate === dateStr;
    });
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Check if date is overdue
  const isOverdue = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Drag and drop handlers
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, date) => {
    e.preventDefault();
    if (!draggedTask) return;

    try {
      // Update task due date
      const newDueDate = date.toISOString();
      await taskAPI.update(draggedTask._id, {
        ...draggedTask,
        dueDate: newDueDate,
      });

      // Update local state
      setTasks(
        tasks.map((t) =>
          t._id === draggedTask._id ? { ...t, dueDate: newDueDate } : t
        )
      );

      setDraggedTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task date");
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <FaCheckCircle className="text-green-600" />;
      case "in-progress":
        return <FaClock className="text-yellow-600" />;
      default:
        return <FaTasks className="text-gray-600" />;
    }
  };

  const days = getDaysInMonth();
  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaCalendar className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-xl">
                <FaCalendar className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Task Calendar
                </h1>
                <p className="text-gray-500 mt-1">
                  View and schedule tasks by due date
                </p>
              </div>
            </div>
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
              Today
            </button>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all">
              <FaChevronLeft className="text-gray-600" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900">{monthName}</h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all">
              <FaChevronRight className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border-2 border-blue-600 rounded"></div>
              <span className="text-sm text-gray-600">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border-2 border-red-600 rounded"></div>
              <span className="text-sm text-gray-600">Overdue</span>
            </div>
            <div className="flex items-center gap-2">
              <FaExclamationTriangle className="text-red-600" />
              <span className="text-sm text-gray-600">High Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-600" />
              <span className="text-sm text-gray-600">Completed</span>
            </div>
            <div className="text-sm text-gray-500 italic">
              💡 Drag and drop tasks to reschedule
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              const dayTasks = getTasksForDate(day.date);
              const isCurrentDay = isToday(day.date);
              const isOverdueDay =
                isOverdue(day.date) &&
                dayTasks.some((t) => t.status !== "completed");

              return (
                <div
                  key={index}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, day.date)}
                  className={`min-h-[120px] p-2 border-2 rounded-lg transition-all ${
                    !day.isCurrentMonth
                      ? "bg-gray-50 opacity-50"
                      : isCurrentDay
                      ? "bg-blue-50 border-blue-600"
                      : isOverdueDay
                      ? "bg-red-50 border-red-600"
                      : "bg-white border-gray-200 hover:border-blue-300"
                  } ${draggedTask ? "hover:bg-blue-100" : ""}`}>
                  {/* Date number */}
                  <div
                    className={`text-sm font-semibold mb-2 ${
                      isCurrentDay
                        ? "text-blue-600"
                        : isOverdueDay
                        ? "text-red-600"
                        : !day.isCurrentMonth
                        ? "text-gray-400"
                        : "text-gray-900"
                    }`}>
                    {day.date.getDate()}
                  </div>

                  {/* Tasks */}
                  <div className="space-y-1">
                    {dayTasks.slice(0, 3).map((task) => (
                      <div
                        key={task._id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        onClick={() => navigate(`/tasks/${task._id}`)}
                        className={`text-xs p-1.5 rounded border cursor-move hover:shadow-md transition-all ${getPriorityColor(
                          task.priority
                        )}`}
                        title={task.title}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(task.status)}
                          <span className="truncate flex-1">{task.title}</span>
                        </div>
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayTasks.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Task Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <FaExclamationTriangle className="text-red-600 text-2xl" />
              <h3 className="text-lg font-semibold text-gray-900">
                Overdue Tasks
              </h3>
            </div>
            <p className="text-3xl font-bold text-red-600">
              {
                tasks.filter(
                  (t) =>
                    t.dueDate &&
                    new Date(t.dueDate) < new Date() &&
                    t.status !== "completed"
                ).length
              }
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <FaClock className="text-yellow-600 text-2xl" />
              <h3 className="text-lg font-semibold text-gray-900">
                Due This Week
              </h3>
            </div>
            <p className="text-3xl font-bold text-yellow-600">
              {
                tasks.filter((t) => {
                  if (!t.dueDate) return false;
                  const dueDate = new Date(t.dueDate);
                  const weekFromNow = new Date();
                  weekFromNow.setDate(weekFromNow.getDate() + 7);
                  return dueDate <= weekFromNow && dueDate >= new Date();
                }).length
              }
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <FaCheckCircle className="text-green-600 text-2xl" />
              <h3 className="text-lg font-semibold text-gray-900">Completed</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">
              {tasks.filter((t) => t.status === "completed").length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarTasks;
