import React, { useState, useEffect } from 'react';

const TimerComponent = ({ isTyping, startTime, timeLimit, testCompleted }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    if (!isTyping || !startTime || testCompleted) {
      setTimeLeft(timeLimit);
      return;
    }

    const interval = setInterval(() => {
      const elapsedSeconds = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, timeLimit - elapsedSeconds);
      setTimeLeft(Math.ceil(remaining));

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [isTyping, startTime, timeLimit, testCompleted]);

  return (
    <div className="text-2xl font-bold text-[#F4F4F5] mb-4">
      Time Left: {timeLeft}s
    </div>
  );
};

export default TimerComponent;