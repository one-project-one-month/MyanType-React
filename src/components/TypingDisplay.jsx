import React from 'react';

const TypingDisplay = ({ sampleText, inputText, cursorPosition, hasStarted, currentPage, totalPages, mode, themes, currentTheme }) => {
  const CHARACTERS_PER_PAGE = 50;

  const renderTextWithHighlighting = () => {
    if (!sampleText) return <span className="text-[#777C90]">No text available</span>;

    const startIndex = currentPage * CHARACTERS_PER_PAGE;
    const endIndex = Math.min(startIndex + CHARACTERS_PER_PAGE, sampleText.length);
    const chars = sampleText.slice(startIndex, endIndex).split('');

    const { correctHighlight, incorrectHighlight } = themes[currentTheme];

    return (
      <>
        {chars.map((char, index) => {
          const globalIndex = startIndex + index;
          let className = 'text-[#777C90]';
          if (globalIndex < inputText.length) {
            className = inputText[globalIndex] === char
              ? `text-[${correctHighlight}]`
              : `text-[${incorrectHighlight}]`;
          }

          const isCursor = globalIndex === cursorPosition;

          return (
            <React.Fragment key={globalIndex}>
              {isCursor && hasStarted && <span className="animate-blink">|</span>}
              <span className={className}>{char}</span>
            </React.Fragment>
          );
        })}
        {cursorPosition >= sampleText.length && hasStarted && currentPage === totalPages - 1 && (
          <span className="animate-blink">|</span>
        )}
      </>
    );
  };

  return (
    <div
      className="p-4 rounded-lg"
      style={{
        backgroundColor: 'rgba(20, 23, 35, 0.8)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      {mode === 'custom' ? (
        <p className="text-sm whitespace-pre-wrap text-[#F4F4F5]">
          {inputText || <span className="text-[#777C90]">Start typing...</span>}
          {hasStarted && <span className="animate-blink">|</span>}
        </p>
      ) : (
        <p className="text-sm whitespace-pre-wrap">{renderTextWithHighlighting()}</p>
      )}
    </div>
  );
};

export default TypingDisplay;