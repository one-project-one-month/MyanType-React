import React, { createContext, useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import { fetchWords, fetchQuote, fetchTimeWords } from '../api/axiosConfig';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const location = useLocation(); 
  const [words, setWords] = useState('');
  const [quote, setQuote] = useState('');
  const [timeData, setTimeData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lang, setLang] = useState('en');
  const [mode, setMode] = useState('words');
  const [option, setOption] = useState(15);

  // Parse URL query parameters on mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlLang = searchParams.get('lang');
    const urlTime = searchParams.get('time');
    const urlPath = location.pathname.split('/')[1]; // Get the first segment of the path (e.g., 'time', 'words', 'quote')

    // Update state based on URL
    if (urlPath && ['words', 'quote', 'time', 'custom'].includes(urlPath)) {
      setMode(urlPath);
    }
    if (urlLang && ['en', 'mm'].includes(urlLang)) {
      setLang(urlLang);
    }
    if (urlTime && !isNaN(parseInt(urlTime))) {
      setOption(parseInt(urlTime));
    }
  }, [location]); // Run once on mount

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
        reloadData: loadData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);