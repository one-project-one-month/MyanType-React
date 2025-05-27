import React, { useState } from 'react';

const TypingArea = ({ onKeyPress }) => {
  const [inputText, setInputText] = useState('');
  const sampleText = 'become then tell group well than increase feel small those will out stand how give move just problem again here now these he high what word part after';

  const handleKeyPress = (e) => {
    const key = e.key.toLowerCase();
    if (/^[a-z]$/.test(key)) {
      onKeyPress(key);
    }
  };

  return (
    <div className="w-full max-w-2xl mb-8">
      <p className="mb-2 text-lg" style={{ color: '#F4F4F5' }}>
        Type the following text:
      </p>
      <div className="p-4 rounded-lg" style={{ backgroundColor: '#141723' }}>
        <p className="text-sm">
          {sampleText.split(' ').map((word, index) => (
            <span
              key={index}
              className={inputText.split(' ')[index] === word ? 'text-green-500' : ''}
              style={{ color: inputText.split(' ')[index] === word ? '' : '#777C90' }}
            >
              {word}{' '}
            </span>
          ))}
        </p>
      </div>
      <textarea
        className="w-full p-2 mt-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        style={{ backgroundColor: '#0E0F15', color: '#F4F4F5' }}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Start typing here..."
        rows="4"
      />
    </div>
  );
};

export default TypingArea;