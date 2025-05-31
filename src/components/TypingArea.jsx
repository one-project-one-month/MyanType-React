import React from 'react';

const TypingArea = ({ currentText, userInput, onUserInput }) => {
  return (
    <div className="w-3/4 max-w-2xl mb-6">
      <style>
        {`
          @keyframes blink {
            0%, 100% {
              border-right: 1px solid white;
              box-shadow: 0 0 4px 1px rgba(255, 255, 255, 0.8);
            }
            50% {
              border-right: 1px solid transparent;
              box-shadow: none;
            }
          }

          .animate-blink {
            animation: blink 0.8s step-end infinite;
            border-right: 1px solid transparent;
            padding-right: 1px;
          }
        `}
      </style>
      <div className="bg-[#0e0f15] border border-gray-600 rounded-lg p-4 text-lg font-mono text-gray-200 min-h-[100px] flex flex-col">
        <div className="mb-2">
          {currentText ? (
            currentText.split('').map((char, index) => {
              const userChar = userInput[index];
              let colorClass = 'text-gray-500';
              let cursorClass = '';
              if (index < userInput.length) {
                colorClass = userChar === char ? 'text-green-500' : 'text-red-500';
              }
              if (index === userInput.length) {
                cursorClass = 'animate-blink'; // Apply glowing cursor to the current character
              }
              // Use a combination of index and char to ensure uniqueness
              return (
                <span key={`${char}-${index}`} className={`${colorClass} ${cursorClass}`}>
                  {char}
                </span>
              );
            })
          ) : (
            <span className="text-white">{userInput || 'Start typing...'}</span>
          )}
        </div>
        <input
          type="text"
          value={userInput}
          readOnly // Prevent direct input to avoid conflicts with global keypress
          className="bg-transparent border-none outline-none text-transparent caret-transparent"
          autoFocus
        />
      </div>
    </div>
  );
};

export default TypingArea;