import React from 'react';

const Keyboard = ({ activeKey }) => {
  const keyboardLayout = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  ];

  return (
    <div className="w-full max-w-2xl">
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-2 mb-2">
          {row.map((key) => (
            <div
              key={key}
              className={`px-4 py-2 rounded-lg text-center cursor-pointer transition`}
              style={{
                backgroundColor: activeKey === key ? '#777C90' : '#141723',
                color: '#F4F4F5',
              }}
            >
              {key}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;