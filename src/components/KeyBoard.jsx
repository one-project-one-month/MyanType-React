import React from 'react';

// Define keyboard layouts
const layouts = {
  english: {
    normal: [
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
      ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
    ],
  },
  myanmar: {
    normal: [
      // Row 1: Burmese digits
      ['၁', '၂', '၃', '၄', '၅', '၆', '၇', '၈', '၉', '၀'],
      // Row 2: Consonants and common characters (QWERTY equivalent: q, w, e, r, t, y, u, i, o, p)
      ['ဆ', 'တ', 'မ', 'န', 'အ', 'ပ', 'က', 'သ', 'င', 'ရ'],
      // Row 3: Vowels, diacritics, and consonants (QWERTY equivalent: a, s, d, f, g, h, j, k, l)
      ['စ', 'ဟ', 'ိ', 'ူ', 'း', 'ဖ', 'ခ', 'ါ', 'ည'],
      // Row 4: Additional consonants and virama (QWERTY equivalent: z, x, c, v, b, n, m)
      ['ယ', 'ွ', '့', 'ဒ', 'ဗ', 'လ', '္'],
    ],
    shift: [
      // Row 1: Shift state for Burmese digits (symbols or alternate digits)
      ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'],
      // Row 2: Shift state (QWERTY equivalent: q, w, e, r, t, y, u, i, o, p)
      ['ဧ', 'ဂ', 'ံ', 'ဏ', 'ဢ', 'ဘ', 'ဃ', 'ဿ', 'ဤ', 'ရွ'],
      // Row 3: Shift state (QWERTY equivalent: a, s, d, f, g, h, j, k, l)
      ['ဈ', 'ှ', 'ီ', 'ဳ', 'ျ', 'ဇ', 'ဋ', 'ာ', 'ဉ'],
      // Row 4: Shift state (QWERTY equivalent: z, x, c, v, b, n, m)
      ['ဿ', 'ဲ', 'ဍ', 'ဓ', 'ဘ', 'ဠ', '်'],
    ],
  },
};

const Keyboard = ({ activeKey, layout = 'english', shiftActive = false }) => {
  // Select the appropriate layout based on layout and shift state
  const keyboardLayout = layout === 'myanmar' && shiftActive
    ? layouts.myanmar.shift
    : layouts[layout]?.normal || layouts.english.normal;

  return (
    <div className="w-full max-w-2xl">
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-2 mb-2">
          {row.map((key) => (
            <div
              key={key}
              className="px-4 py-2 rounded-lg text-center cursor-pointer transition"
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