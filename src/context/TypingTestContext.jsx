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
        [mode === 'time' ? 'second' : 'word']: Number(timeOrWords), // Convert to number
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