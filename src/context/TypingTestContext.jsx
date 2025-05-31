import { useContext, createContext, useState } from 'react';

export const TypingTestContext = createContext();

export const TypingTestProvider = ({ children }) => {
  const [results, setResults] = useState([]);
  const [wpmHistory, setWpmHistory] = useState([]);

  const addResult = (result) => {
    setResults((prev) => [...prev, result]);
  };

  const addWpmPoint = (timeOrWords, wpm, mode) => {
    setWpmHistory((prev) => [
      ...prev,
      {
        [mode === 'time' ? 'second' : 'word']: Number(timeOrWords),
        speed: wpm,
      },
    ]);
  };

  return (
    <TypingTestContext.Provider value={{ results, addResult, wpmHistory, addWpmPoint }}>
      {children}
    </TypingTestContext.Provider>
  );
};

// ✅ Add this custom hook and export it
export const useTypingTest = () => {
  return useContext(TypingTestContext);
};
