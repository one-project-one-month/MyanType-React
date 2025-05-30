import React from 'react';
import { useTheme } from '../context/ThemeProvider';

// Define keyboard layouts
const layouts = {
  english: {
    normal: [
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
      ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
      [' '] // Spacebar
    ],
  },
  myanmar: {
    normal: [
      ['၁', '၂', '၃', '၄', '၅', '၆', '၇', '၈', '၉', '၀'],
      ['ဆ', 'တ', 'မ', 'န', 'အ', 'ပ', 'က', 'သ', 'င', 'ရ'],
      ['စ', 'ဟ', 'ိ', 'ူ', 'း', 'ဖ', 'ခ', 'ါ', 'ည'],
      ['ယ', 'ွ', '့', 'ဒ', 'ဗ', 'လ', '္'],
      [' '] // Spacebar
    ],
    shift: [
      ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'],
      ['ဧ', 'ဂ', 'ံ', 'ဏ', 'ဢ', 'ဘ', 'ဃ', 'ဿ', 'ဤ', 'ရွ'],
      ['ဈ', 'ှ', 'ီ', 'ဳ', 'ျ', 'ဇ', 'ဋ', 'ာ', 'ဉ'],
      ['ဿ', 'ဲ', 'ဍ', 'ဓ', 'ဘ', 'ဠ', '်'],
      [' '] // Spacebar
    ],
  },
};

const Keyboard = ({ activeKey, layout = 'english', shiftActive = false }) => {
  const { themes, currentTheme } = useTheme();

  // Select the appropriate layout based on layout and shift state
  const keyboardLayout = layout === 'myanmar' && shiftActive
    ? layouts.myanmar.shift
    : layouts[layout]?.normal || layouts.english.normal;

  // Normalize activeKey for case-insensitive matching (for English)
  const normalizedActiveKey = activeKey ? activeKey.toLowerCase() : null;

  return (
    <div className="w-full max-w-2xl">
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-2 mb-2">
          {row.map((key) => (
            <div
              key={key}
              className="px-4 py-2 rounded-lg text-center cursor-pointer transition"
              style={{
                backgroundColor:
                  normalizedActiveKey === key.toLowerCase() || activeKey === key
                    ? '#777C90' // Active key highlight (unchanged)
                    : themes[currentTheme].keyboard,
                color: '#F4F4F5',
                width: key === ' ' ? '200px' : '40px',
                height: key === ' ' ? '40px' : '40px',
                lineHeight: '40px',
                borderRadius: key === ' ' ? '8px' : '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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

export default React.memo(Keyboard);