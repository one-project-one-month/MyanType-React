import React, { useState } from 'react';
import TypingArea from '../components/TypingArea';
import Keyboard from '../components/KeyBoard';

const TypingTestUI = () => {
  const [lastKey, setLastKey] = useState('');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-white bg-gray-900">
      <TypingArea onKeyPress={setLastKey} />
      <Keyboard activeKey={lastKey} />
    </div>
  );
};

export default TypingTestUI;