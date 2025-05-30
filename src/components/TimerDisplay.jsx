import React from 'react';

const TimerDisplay = ({ mode, timer, hasStarted, wpm }) => {
  return (
    <div className="flex items-center gap-4 my-4">
      {mode === 'time' && <span className="text-yellow-400 text-xl">⏰ {timer}s</span>}
      {hasStarted && <span className="text-gray-500 text-xl">WPM: {wpm}</span>}
    </div>
  );
};

export default TimerDisplay;