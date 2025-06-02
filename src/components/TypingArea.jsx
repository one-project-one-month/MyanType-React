import React, { useState, useEffect } from 'react';

const TypingArea = ({ currentText, userInput, onUserInput }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const wordsPerPage = 38; // Number of words per page
  const autoAdvanceThreshold = 1; // Advance when 90% of the page is typed

  // Split the currentText into words
  const words = currentText ? currentText.split(' ') : [];
  const totalWords = words.length;
  const totalPages = Math.ceil(totalWords / wordsPerPage);

  // Calculate the words for the current page
  const startIndex = (currentPage - 1) * wordsPerPage;
  const endIndex = startIndex + wordsPerPage;
  const currentPageWords = words.slice(startIndex, endIndex).join(' ');

  // Calculate the character indices for the current page
  const charStartIndex = words.slice(0, startIndex).join(' ').length + (startIndex > 0 ? 1 : 0); // Add 1 for the space
  const charEndIndex = charStartIndex + currentPageWords.length;

  // Handle page navigation
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Auto-advance to the next page based on typing progress
  useEffect(() => {
    if (currentPage < totalPages) {
      const typedCharsOnPage = userInput.slice(charStartIndex, charEndIndex).length;
      const pageLength = currentPageWords.length;
      const progress = typedCharsOnPage / pageLength;

      if (progress >= autoAdvanceThreshold) {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
      }
    }
  }, [userInput, currentPage, totalPages, charStartIndex, charEndIndex, currentPageWords, autoAdvanceThreshold]);

  return (
    <div className="w-11/12 max-w-4xl mb-6"> {/* Increased width */}
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
          {currentPageWords ? (
            currentPageWords.split('').map((char, index) => {
              const globalIndex = charStartIndex + index; // Map to global index in the full text
              const userChar = userInput[globalIndex];
              let colorClass = 'text-gray-500';
              let cursorClass = '';
              if (globalIndex < userInput.length) {
                colorClass = userChar === char ? 'text-green-500' : 'text-red-500';
              }
              if (globalIndex === userInput.length) {
                cursorClass = 'animate-blink'; // Apply glowing cursor
              }
              return (
                <span
                  key={`${char}-${globalIndex}`}
                  className={`${colorClass} ${cursorClass}`}
                >
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
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between mt-2">
        </div>
      )}
    </div>
  );
};

export default TypingArea;