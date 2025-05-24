// components/TotalTime.jsx
import React from 'react';

export default function TotalTime({ tasks }) {
  const totalSeconds = tasks.reduce((sum, task) => sum + task.totalTimeWorked, 0);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return (
    <div className="bg-purple-900 p-4 rounded-xl shadow mb-6 text-white text-center">
      <h2 className="text-xl font-semibold">Total Time Spent on Preperation</h2>
      <p className="text-2xl font-bold">
        {minutes} min {seconds} sec
      </p>
    </div>
  );
}
