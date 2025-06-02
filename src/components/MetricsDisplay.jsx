import React from 'react';

const MetricsDisplay = ({ wpm, accuracy }) => {
  return (
    <div className="mt-8 mb-10">
      <style>
        {`
          .glow-box {
            box-shadow: 0 0 8px 2px rgba(255, 255, 255, 0.8);
          }
        `}
      </style>
      <div className="p-4 border border-gray-600 rounded-lg bg-[#0e0f15] glow-box">
        <div className="flex space-x-6 text-lg font-mono text-white">
          <span>WPM: {wpm}</span>
          <span>Accuracy: {accuracy}%</span>
        </div>
      </div>
    </div>
  );
};

export default MetricsDisplay;