import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import TotalTime from "../components/TotalTime"; // Adjust the path if needed

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [activeTimers, setActiveTimers] = useState({});
  const [sessionTimers, setSessionTimers] = useState({});
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const intervalRefs = useRef({});
  const userId = localStorage.getItem("userId");
  const [activeCount, setActiveCount] = useState(0);

  // Global timer states
  const [globalTimerRunning, setGlobalTimerRunning] = useState(false);
  const [globalElapsed, setGlobalElapsed] = useState(0);
  const globalIntervalRef = useRef(null);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `https://levelling-production.up.railway.app/task/${userId}`
      );
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  const addTask = async () => {
    if (!title.trim()) return;
    try {
      await axios.post("https://levelling-production.up.railway.app/task", {
        userId,
        title,
      });
      setTitle("");
      fetchTasks();
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  const updateTime = async (taskId, seconds) => {
    try {
      await axios.patch(
        `https://levelling-production.up.railway.app/task/${taskId}`,
        { secondsWorked: seconds }
      );
      fetchTasks();
    } catch (err) {
      console.error("Failed to update time:", err);
    }
  };

  const updateTaskTitle = async (taskId) => {
    if (!editedTitle.trim()) return;
    try {
      await axios.patch(
        `https://levelling-production.up.railway.app/task/${taskId}`,
        { title: editedTitle }
      );
      setEditingTaskId(null);
      setEditedTitle("");
      fetchTasks();
    } catch (err) {
      console.error("Failed to update task title:", err);
    }
  };

  const deleteTask = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(
        `https://levelling-production.up.railway.app/task/${taskId}`
      );
      fetchTasks();
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const startGlobalTimer = () => {
    setGlobalTimerRunning(true);
    if (!globalIntervalRef.current) {
      globalIntervalRef.current = setInterval(() => {
        setGlobalElapsed((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopGlobalTimer = () => {
    setGlobalTimerRunning(false);
    if (globalIntervalRef.current) {
      clearInterval(globalIntervalRef.current);
      globalIntervalRef.current = null;
    }
  };

  const startTimer = (taskId) => {
    if (activeTimers[taskId]) return;

    setSessionTimers((prev) => ({ ...prev, [taskId]: 0 }));

    intervalRefs.current[taskId] = setInterval(() => {
      setSessionTimers((prev) => ({
        ...prev,
        [taskId]: (prev[taskId] || 0) + 1,
      }));

      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId
            ? { ...task, totalTimeWorked: task.totalTimeWorked + 1 }
            : task
        )
      );
    }, 1000);

    setActiveTimers((prev) => ({ ...prev, [taskId]: true }));

    // Increase count of active timers
    setActiveCount((count) => count + 1);
  };

  const stopTimer = (taskId) => {
    if (intervalRefs.current[taskId]) {
      clearInterval(intervalRefs.current[taskId]);

      const sessionSeconds = sessionTimers[taskId] || 0;
      if (sessionSeconds > 0) {
        updateTime(taskId, sessionSeconds);
      }

      delete intervalRefs.current[taskId];

      setActiveTimers((prev) => {
        const newTimers = { ...prev };
        delete newTimers[taskId];
        return newTimers;
      });

      setSessionTimers((prev) => {
        const updated = { ...prev };
        delete updated[taskId];
        return updated;
      });

      // Decrease count of active timers
      setActiveCount((count) => Math.max(count - 1, 0));
    }
  };

  useEffect(() => {
    fetchTasks();

    return () => {
      Object.values(intervalRefs.current).forEach(clearInterval);
      if (globalIntervalRef.current) {
        clearInterval(globalIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <TotalTime tasks={tasks} />

      {/* Global Timer Display and Controls */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Global Timer: {Math.floor(globalElapsed / 60)}m {globalElapsed % 60}s
        </h2>
        <button
          onClick={startGlobalTimer}
          disabled={globalTimerRunning}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 mr-2 disabled:opacity-50"
        >
          Start Global Timer
        </button>
        <button
          onClick={stopGlobalTimer}
          disabled={!globalTimerRunning}
          className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
        >
          Stop Global Timer
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          className="flex-1 p-3 rounded bg-gray-800 border border-gray-700"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New Task Title"
        />
        <button
          onClick={addTask}
          className="px-5 py-3 bg-purple-600 rounded hover:bg-purple-700"
        >
          Add Task
        </button>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-gray-800 p-4 rounded flex justify-between items-center"
          >
            <div className="flex-1">
              {editingTaskId === task._id ? (
                <div className="flex items-center gap-2">
                  <input
                    className="p-2 rounded bg-gray-700 border border-gray-600 text-white"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                  />
                  <button
                    onClick={() => updateTaskTitle(task._id)}
                    className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingTaskId(null);
                      setEditedTitle("");
                    }}
                    className="bg-gray-600 px-3 py-1 rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold">{task.title}</h2>
                  <p className="text-gray-400">
                    Time Worked: {Math.floor(task.totalTimeWorked / 60)}m{" "}
                    {task.totalTimeWorked % 60}s
                  </p>
                </>
              )}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => startTimer(task._id)}
                disabled={!!activeTimers[task._id]}
                className={`px-4 py-2 rounded ${
                  activeTimers[task._id]
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                Start
              </button>
              <button
                onClick={() => stopTimer(task._id)}
                disabled={!activeTimers[task._id]}
                className={`px-4 py-2 rounded ${
                  !activeTimers[task._id]
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Stop
              </button>
              <button
                onClick={() => {
                  setEditingTaskId(task._id);
                  setEditedTitle(task.title);
                }}
                className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-700"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTask(task._id)}
                className="px-4 py-2 bg-pink-600 rounded hover:bg-pink-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
