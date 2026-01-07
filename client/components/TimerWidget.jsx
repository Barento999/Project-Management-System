import React, { useState, useEffect, useCallback } from "react";
import { FaPlay, FaStop, FaClock } from "react-icons/fa";
import { timeTrackingAPI } from "../services/api";

const TimerWidget = ({ taskId }) => {
  const [runningTimer, setRunningTimer] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loading, setLoading] = useState(false);

  const checkRunningTimer = useCallback(async () => {
    try {
      const res = await timeTrackingAPI.getRunning();
      if (res.data.timeEntry && res.data.timeEntry.task._id === taskId) {
        setRunningTimer(res.data.timeEntry);
        const start = new Date(res.data.timeEntry.startTime);
        const now = new Date();
        setElapsedTime(Math.floor((now - start) / 1000));
      }
    } catch (error) {
      console.error("Error checking timer:", error);
    }
  }, [taskId]);

  useEffect(() => {
    checkRunningTimer();
  }, [checkRunningTimer]);

  useEffect(() => {
    let interval;
    if (runningTimer && runningTimer.task._id === taskId) {
      interval = setInterval(() => {
        const start = new Date(runningTimer.startTime);
        const now = new Date();
        const diff = Math.floor((now - start) / 1000);
        setElapsedTime(diff);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [runningTimer, taskId]);

  const startTimer = async () => {
    setLoading(true);
    try {
      const res = await timeTrackingAPI.start({ taskId, description: "" });
      setRunningTimer(res.data.timeEntry);
      setElapsedTime(0);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to start timer");
    } finally {
      setLoading(false);
    }
  };

  const stopTimer = async () => {
    if (!runningTimer) return;
    setLoading(true);
    try {
      await timeTrackingAPI.stop(runningTimer._id);
      setRunningTimer(null);
      setElapsedTime(0);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to stop timer");
    } finally {
      setLoading(false);
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

  const isRunning = runningTimer && runningTimer.task._id === taskId;

  return (
    <div className="flex items-center gap-2">
      {isRunning ? (
        <>
          <div className="flex items-center gap-2 bg-green-100 px-3 py-1.5 rounded-lg">
            <FaClock className="text-green-600 animate-pulse" />
            <span className="text-sm font-mono font-bold text-green-700">
              {formatTime(elapsedTime)}
            </span>
          </div>
          <button
            onClick={stopTimer}
            disabled={loading}
            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all disabled:opacity-50"
            title="Stop Timer">
            <FaStop />
          </button>
        </>
      ) : (
        <button
          onClick={startTimer}
          disabled={loading}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center gap-1"
          title="Start Timer">
          <FaPlay className="text-xs" />
        </button>
      )}
    </div>
  );
};

export default TimerWidget;
