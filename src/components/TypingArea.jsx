import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import TestModeSelector from './TestModeSelector';
import Keyboard from './KeyBoard';
import { useTheme } from '../context/ThemeProvider';
import TypingDisplay from './TypingDisplay';
import TimerDisplay from './TimerDisplay';
import PaginationControls from './PaginationControls';
import ThemeSelector from './ThemeSelector';
import InputHandler from './InputHandler';

const TypingArea = () => {
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState('words');
  const [option, setOption] = useState(30);
  const [language, setLanguage] = useState('english');
  const [sampleText, setSampleText] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [timer, setTimer] = useState(option);
  const [intervalId, setIntervalId] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [results, setResults] = useState(null);
  const [shiftActive, setShiftActive] = useState(false);
  const [activeKey, setActiveKey] = useState('');
  const [wpmHistory, setWpmHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const secondsElapsedRef = useRef(0);

  const location = useLocation();
  const inputDivRef = useRef(null);
  const navigate = useNavigate();
  const { themes, currentTheme, changeTheme } = useTheme();

  const BASE_URL = 'https://myantype-nodejs.onrender.com/api/v1';
  const CHARACTERS_PER_PAGE = 50;

  const fetchSampleText = async () => {
    setLoading(true);
    try {
      let url = '';
      if (mode === 'custom') {
        setSampleText('');
        return;
      } else if (mode === 'words') {
        url = `${BASE_URL}/word?lang=${language === 'english' ? 'en' : 'mm'}&count=${option}`;
      } else if (mode === 'quote') {
        url = `${BASE_URL}/quote`;
      } else if (mode === 'time') {
        url = `${BASE_URL}/time?lang=${language === 'english' ? 'en' : 'mm'}&time=${option}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch sample text: ${response.statusText}`);
      }

      const data = await response.json();
      if (mode === 'quote') {
        setSampleText(data.quote || '');
      } else {
        setSampleText(data.words?.join(' ') || '');
      }
    } catch (error) {
      toast.error(`Error fetching sample text: ${error.message}`);
      setSampleText('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleReset();
    fetchSampleText();
  }, [mode, option, language]);

  useEffect(() => {
    setLoading(true);
    try {
      const searchParams = new URLSearchParams(location.search);
      const path = location.pathname;
      const lang = searchParams.get('lang') || 'en';
      const count = searchParams.get('count');
      const time = searchParams.get('time');
  
      if (path === '/words' && count && mode !== 'words') {
        setMode('words');
        setOption(Number(count));
        setLanguage(lang === 'en' ? 'english' : 'myanmar');
      } else if (path === '/time' && time && mode !== 'time') {
        setMode('time');
        setOption(Number(time));
        setLanguage(lang === 'en' ? 'english' : 'myanmar');
      } else if (path === '/quote' && mode !== 'quote') {
        setMode('quote');
        setLanguage(lang === 'en' ? 'english' : 'myanmar');
      } else if (path === '/custom' && mode !== 'custom') {
        setMode('custom');
        setLanguage(lang === 'en' ? 'english' : 'myanmar');
      } else if (path === '/' || path === '') {
        setMode('words');
        setOption(30);
        setLanguage(lang === 'en' ? 'english' : 'myanmar');
      }
    } catch (error) {
      toast.error(`Error setting sample text: ${error.message}`);
      setSampleText('');
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    if (!sampleText) {
      setTotalPages(1);
      setCurrentPage(0);
      return;
    }

    const totalChars = sampleText.length;
    const pages = Math.ceil(totalChars / CHARACTERS_PER_PAGE);
    setTotalPages(pages);

    if (currentPage >= pages) {
      setCurrentPage(pages - 1);
    }
  }, [sampleText]);

  useEffect(() => {
    if (!loading && inputDivRef.current) {
      inputDivRef.current.focus();
    }
  }, [loading]);

  useEffect(() => {
    if (!hasStarted || inputText.length === 0 || !startTime) {
      setWpm(0);
      return;
    }

    const now = Date.now();
    const minutes = ((now - startTime) / 1000) / 60;
    const wordCount = inputText.trim().split(/\s+/).filter(w => w !== '').length;
    const currentWpm = minutes > 0 ? Math.round(wordCount / minutes) : 0;
    setWpm(currentWpm);

    if (mode === 'words') {
      if (wordCount % 5 === 0 && wordCount > 0) {
        setWpmHistory(prev => [
          ...prev,
          { index: wordCount, speed: currentWpm },
        ]);
      }
    }
  }, [inputText, startTime, hasStarted, mode]);

  useEffect(() => {
    if (mode === 'time' && hasStarted) {
      setTimer(option);
      setWpmHistory([]);
      secondsElapsedRef.current = 0;
      if (intervalId) clearInterval(intervalId);
      const id = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(id);
            setHasStarted(false);
            setIntervalId(null);
            console.log('Timer ended, inputText:', inputText);
            calculateResults();
            return 0;
          }
          secondsElapsedRef.current += 1;
          return prev - 1;
        });
      }, 1000);
      setIntervalId(id);
      return () => clearInterval(id);
    } else {
      if (intervalId) clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [mode, hasStarted, option]);

  useEffect(() => {
    if (mode === 'time' && hasStarted && secondsElapsedRef.current % 5 === 0 && secondsElapsedRef.current > 0) {
      const now = Date.now();
      const minutes = ((now - startTime) / 1000) / 60;
      const wordCount = inputText.trim().split(/\s+/).filter(w => w !== '').length;
      const currentWpm = minutes > 0 ? Math.round(wordCount / minutes) : 0;
      setWpmHistory(prev => [
        ...prev,
        { second: secondsElapsedRef.current, speed: currentWpm },
      ]);
      setWpm(currentWpm);
    }
  }, [secondsElapsedRef.current, inputText, startTime, hasStarted, mode]);

  useEffect(() => {
    if (results) {
      console.log('Results set, navigating to /results:', results);
      navigate('/results', { state: { results } });
    }
  }, [results, navigate]);

  const calculateResults = () => {
    const now = Date.now();
    const timeTaken = startTime ? (now - startTime) / 1000 : 0;
    const minutes = timeTaken / 60;
    const charactersTyped = inputText.length;
    const wordCount = inputText.trim().split(/\s+/).filter(w => w !== '').length;

    let correct = 0;
    let incorrect = 0;
    let extra = 0;
    let miss = 0;

    if (mode === 'time' || mode === 'words' || mode === 'quote') {
      const compareLength = Math.min(inputText.length, sampleText.length);
      for (let i = 0; i < compareLength; i++) {
        if (inputText[i] === sampleText[i]) {
          correct++;
        } else {
          incorrect++;
        }
      }
      extra = inputText.length > sampleText.length ? inputText.length - sampleText.length : 0;
      miss = sampleText.length > inputText.length ? sampleText.length - inputText.length : 0;

      if (mode === 'time') {
        correct = charactersTyped;
        incorrect = 0;
        extra = 0;
        miss = 0;
      }
    } else if (mode === 'custom') {
      correct = charactersTyped;
      incorrect = 0;
      extra = 0;
      miss = 0;
    }

    const totalChars = correct + incorrect + extra;
    const accuracy = totalChars > 0 ? (correct / totalChars) * 100 : 0;
    const rawWpm = minutes > 0 ? Math.round(wordCount / minutes) : 0;
    const consistency = Math.round(accuracy * 0.8);

    const resultData = {
      wpm: rawWpm,
      raw: rawWpm,
      accuracy: Number(accuracy.toFixed(1)),
      charactersTyped,
      correct,
      incorrect,
      extra,
      miss,
      consistency,
      timeTaken: Number(timeTaken.toFixed(1)),
      language: language === 'english' ? 'en' : 'mm',
      mode: mode.toUpperCase(),
      timeLimit: mode === 'time' ? option : null,
      wordLimit: mode === 'words' ? option : null,
      createdAt: new Date().toISOString(),
      timePerChar: { data: wpmHistory },
    };

    console.log('Calculated resultData:', resultData);
    setResults(resultData);
  };

  const getNextWordBoundary = (text, currentPosition) => {
    const remainingText = text.slice(currentPosition);
    const nextSpace = remainingText.indexOf(' ');
    if (nextSpace === -1) {
      return text.length;
    }
    return currentPosition + nextSpace + 1;
  };

  const handleKeyDown = (e) => {
    const key = e.key;

    if (mode === 'custom' && key === 'Enter' && shiftActive) {
      e.preventDefault();
      if (hasStarted && inputText.length > 0) {
        calculateResults();
      }
      return;
    }

    if (key === 'Shift') {
      setShiftActive(true);
      return;
    }

    const isFunctionKey = /^(F[1-12]|Control|Alt|Meta|Tab|CapsLock|Arrow|Escape)$/i.test(key);
    if (isFunctionKey) {
      e.preventDefault();
      return;
    }

    if (mode === 'time' && timer === 0) {
      e.preventDefault();
      return;
    }

    if (!hasStarted) {
      setHasStarted(true);
      setInputText('');
      setCursorPosition(0);
      setStartTime(Date.now());
      setActiveKey('');
      e.preventDefault();
      return;
    }

    if (key === 'Backspace') {
      if (cursorPosition > 0 || mode === 'custom') {
        setInputText(prev => prev.slice(0, -1));
        if (mode !== 'custom') {
          setCursorPosition(prev => Math.max(0, prev - 1));
        }
        setActiveKey('');
      }
      e.preventDefault();
      return;
    }

    if (mode !== 'custom' && mode !== 'time' && cursorPosition >= sampleText.length) {
      e.preventDefault();
      calculateResults();
      return;
    }

    const isPrintable = /^[a-zA-Z]|\p{Script=Myanmar}$|^[\.,'!?-]|^[\s]$/u.test(key);

    if (isPrintable) {
      if (mode === 'custom') {
        setInputText(prev => prev + key);
        setActiveKey(key);
      } else {
        const currentChar = sampleText[cursorPosition] || '';
        if (key === ' ') {
          if (currentChar === ' ' || mode === 'time') {
            const nextBoundary = getNextWordBoundary(sampleText, cursorPosition);
            setInputText(prev => prev + ' ');
            setCursorPosition(mode === 'time' ? cursorPosition + 1 : nextBoundary);
            setActiveKey(' ');
          } else {
            setInputText(prev => prev + ' ');
            setCursorPosition(prev => prev + 1);
            setActiveKey(' ');
          }
        } else {
          setInputText(prev => prev + key);
          setCursorPosition(prev => prev + 1);
          setActiveKey(key);
        }
      }

      const newPage = Math.floor(cursorPosition / CHARACTERS_PER_PAGE);
      if (newPage !== currentPage) {
        setCurrentPage(newPage);
      }

      e.preventDefault();

      if (mode !== 'custom' && mode !== 'time' && cursorPosition + 1 >= sampleText.length) {
        calculateResults();
      }
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === 'Shift') {
      setShiftActive(false);
    }
    setActiveKey('');
  };

  const handleContainerClick = () => {
    if (inputDivRef.current) {
      inputDivRef.current.focus();
    }
  };

  const handleReset = () => {
    if (intervalId) clearInterval(intervalId);
    setInputText('');
    setCursorPosition(0);
    setWpm(0);
    setWpmHistory([]);
    setHasStarted(false);
    setTimer(option);
    setStartTime(null);
    setResults(null);
    setIntervalId(null);
    setShiftActive(false);
    setActiveKey('');
    setCurrentPage(0);
    secondsElapsedRef.current = 0;
    if (inputDivRef.current) {
      inputDivRef.current.focus();
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8" onClick={handleContainerClick}>
      <div className="flex flex-col items-center">
        <TestModeSelector
          mode={mode}
          setMode={setMode}
          option={option}
          setOption={setOption}
          language={language}
          setLanguage={setLanguage}
        />
        <ThemeSelector
          themes={themes}
          currentTheme={currentTheme}
          changeTheme={changeTheme}
        />
      </div>

      <TimerDisplay mode={mode} timer={timer} hasStarted={hasStarted} wpm={wpm} />

      <p className="text-lg mb-2 flex justify-center" style={{ color: '#F4F4F5' }}>
        {loading
          ? 'Loading...'
          : !hasStarted
            ? 'Press any key to start'
            : mode === 'words'
              ? `Type the following ${option} words in ${language}:`
              : mode === 'time'
                ? `Type as many words as possible in ${option} seconds in ${language}:`
                : mode === 'quote'
                  ? `Type the following quote:`
                  : `Type anything you want (Shift+Enter to end):`}
      </p>

      {hasStarted && (
        <TypingDisplay
          sampleText={sampleText}
          inputText={inputText}
          cursorPosition={cursorPosition}
          hasStarted={hasStarted}
          currentPage={currentPage}
          totalPages={totalPages}
          mode={mode}
          themes={themes}
          currentTheme={currentTheme}
        />
      )}

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
        hasStarted={hasStarted}
        mode={mode}
      />

      <InputHandler handleKeyDown={handleKeyDown} handleKeyUp={handleKeyUp} inputDivRef={inputDivRef} />

      <div className="w-full flex justify-center pb-4 px-2 mt-8 flex-col items-center">
        <Keyboard activeKey={activeKey} layout={language} shiftActive={shiftActive} />
      </div>
    </div>
  );
};

export default TypingArea;