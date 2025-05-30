import React from 'react';

const InputHandler = ({ handleKeyDown, handleKeyUp, inputDivRef }) => {
  return (
    <div
      ref={inputDivRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      className="sr-only"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
    />
  );
};

export default InputHandler;