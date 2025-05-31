import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchWords, fetchQuote, fetchTimeWords } from '../api/axiosConfig';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [words, setWords] = useState('');
  const [quote, setQuote] = useState('');
  const [timeData, setTimeData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lang, setLang] = useState('en');
  const [mode, setMode] = useState('words');
  const [option, setOption] = useState(15);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (mode === 'quote') {
        const data = await fetchQuote();
        setQuote(data.quote || '');
        setWords('');
        setTimeData('');
      } else if (mode === 'words') {
        const data = await fetchWords(lang, option);
        setWords(data.words ? data.words.join(' ') : '');
        setQuote('');
        setTimeData('');
      } else if (mode === 'time') {
        const data = await fetchTimeWords(lang, option);
        setWords(data.words ? data.words.join(' ') : '');
        setQuote('');
        setTimeData('');
      } else if (mode === 'custom') {
        setWords('');
        setQuote('');
        setTimeData('');
      }
    } catch (err) {
      setError(`Failed to load data: ${err.message}`);
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, mode, option]);

  return (
    <DataContext.Provider
      value={{
        words,
        quote,
        timeData,
        loading,
        error,
        lang,
        mode,
        option,
        setLang,
        setMode,
        setOption,
        reloadData: loadData, // Expose the reload function
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);