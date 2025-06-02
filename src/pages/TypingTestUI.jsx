import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import TestModeSelector from '../components/TestModeSelector';
import Keyboard from '../components/KeyBoard';
import TypingArea from '../components/TypingArea';
import ResetButton from '../components/ResetButton';
import MetricsDisplay from '../components/MetricsDisplay';
import TimerComponent from '../components/TimerComponent';
import { useData } from '../context/DataProvider';
import { useTypingTest } from '../context/TypingTestContext';
import { Home } from 'lucide-react';

const TypingTestUI = () => {
  const { words, quote, timeData, loading, error, lang, mode, option, setLang, setMode, setOption, reloadData } = useData();
  const { addResult, addWpmPoint } = useTypingTest();
  const navigate = useNavigate();
  const [currentText, setCurrentText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [activeKey, setActiveKey] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [testCompleted, setTestCompleted] = useState(false);
  const [intervals, setIntervals] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const typingAreaRef = useRef(null);
  const keyboardRef = useRef(null);

  useEffect(() => {
    setUserInput('');
    setIsTyping(false);
    setActiveKey(null);
    setStartTime(null);
    setTestCompleted(false);
    setIntervals([]);
    if (typingAreaRef.current) {
      typingAreaRef.current.focus();
    }
  }, [mode]);

  useEffect(() => {
    if (isTyping && keyboardRef.current) {
      keyboardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isTyping]);

  const isTextCompleted = (input, text, mode) => {
    if (mode === 'quote') {
      return input.length === text.length;
    } else if (mode === 'words') {
      return input.length >= text.length;
    }
    return false;
  };

  const calculateConsistency = (intervalData) => {
    if (intervalData.length < 2) return 100;
    const wpms = intervalData.map((point) => point.wpm);
    const mean = wpms.reduce((sum, val) => sum + val, 0) / wpms.length;
    const variance = wpms.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / wpms.length;
    const stdDev = Math.sqrt(variance);
    return Math.max(0, 100 - stdDev);
  };

  const isTypingDisabled = useMemo(() => {
    if (testCompleted) return true;
    if (mode === 'time' && startTime) {
      const elapsedSeconds = (Date.now() - startTime) / 1000;
      return elapsedSeconds >= option;
    }
    return false;
  }, [mode, startTime, option, testCompleted]);

  useEffect(() => {
    if (mode === 'words' || mode === 'time') {
      setCurrentText(words);
    } else if (mode === 'quote') {
      setCurrentText(quote);
    } else if (mode === 'custom') {
      setCurrentText('');
    }
  }, [mode, quote, words]);

  const calculateWPM = (correctChars, timeElapsed) => {
    if (timeElapsed === 0) return 0;
    return Math.round((correctChars / 5) / (timeElapsed / 60));
  };

  const calculateMetrics = useMemo(() => {
    if (mode === 'custom') {
      const totalChars = userInput.length;
      const elapsedSeconds = startTime ? (Date.now() - startTime) / 1000 : 0;
      const wpm = calculateWPM(totalChars, elapsedSeconds);
      return {
        wpm: Math.min(wpm, 300),
        rawWpm: Math.min(wpm, 300),
        accuracy: 100,
        correct: 0,
        incorrect: 0,
        extra: 0,
        miss: 0,
        consistency: 100,
      };
    }

    let correct = 0, incorrect = 0, extra = 0, miss = 0;
    for (let i = 0; i < Math.max(userInput.length, currentText.length); i++) {
      if (i < userInput.length && i < currentText.length) {
        if (userInput[i] === currentText[i]) correct++;
        else incorrect++;
      } else if (i < userInput.length) {
        extra++;
      } else {
        miss++;
      }
    }

    const totalChars = userInput.length;
    const accuracy = totalChars > 0 ? (correct / totalChars) * 100 : 100;
    const elapsedSeconds = startTime ? (Date.now() - startTime) / 1000 : 0;
    const wpm = calculateWPM(correct, elapsedSeconds);

    return {
      wpm: Math.min(wpm, 300),
      rawWpm: Math.min(calculateWPM(totalChars, elapsedSeconds), 300),
      accuracy: Math.round(accuracy),
      correct,
      incorrect,
      extra,
      miss,
      consistency: intervals.length > 1 ? calculateConsistency(intervals) : 100,
    };
  }, [userInput, currentText, startTime, intervals, mode]);

  useEffect(() => {
    let interval;
    if (isTyping && !startTime) {
      setStartTime(Date.now());
    }

    if (isTyping && startTime) {
      interval = setInterval(() => {
        const elapsedSeconds = (Date.now() - startTime) / 1000;
        const timeElapsed = Math.floor(elapsedSeconds);
        const { wpm, accuracy } = calculateMetrics;

        if (timeElapsed >= 2 && timeElapsed % 2 === 0) {
          const lastInterval = intervals[intervals.length - 1];
          if (!lastInterval || lastInterval.timestamp !== timeElapsed) {
            setIntervals((prev) => [
              ...prev,
              { wpm, accuracy, timestamp: timeElapsed },
            ]);
            addWpmPoint(timeElapsed, wpm, mode);
          }
        }

        const isQuoteComplete = isTextCompleted(userInput, currentText, mode);
        const shouldComplete =
          (mode === 'time' && elapsedSeconds >= option) ||
          (mode === 'words' && isQuoteComplete) ||
          (mode === 'quote' && isQuoteComplete);

        if (shouldComplete) {
          const elapsedTime = elapsedSeconds;
          const result = {
            mode: { type: mode.toLowerCase(), value: option },
            language: lang === 'en' ? 'en' : 'mm',
            wpm: calculateMetrics.wpm,
            accuracy: calculateMetrics.accuracy,
            duration: elapsedTime,
            wordsCompleted: mode === 'words' ? option : Math.floor(userInput.length / 5),
            correctChars: calculateMetrics.correct,
            incorrectChars: calculateMetrics.incorrect,
            totalChars: userInput.length,
            intervals: intervals.map((interval) => ({
              timestamp: interval.timestamp,
              wpm: interval.wpm,
              accuracy: interval.accuracy,
            })),
            createdAt: new Date().toISOString(),
            timePerChar: { data: [] },
          };
          addResult(result);
          setTestCompleted(true);
          setIsCalculating(true);
          setTimeout(() => {
            setIsCalculating(false);
            navigate('/results', { state: { result } });
          }, 2000);
          clearInterval(interval);
        }
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isTyping, startTime, mode, option, lang, userInput, currentText, calculateMetrics, intervals, addResult, addWpmPoint, navigate]);

  const handleKeyPress = (event) => {
    if (isTypingDisabled) {
      event.preventDefault();
      return;
    }

    const key = event.key;
    setActiveKey(key);

    if (mode === 'custom' && key === 'Enter' && event.shiftKey) {
      event.preventDefault();
      if (userInput.trim().length > 0) {
        const elapsedSeconds = startTime ? (Date.now() - startTime) / 1000 : 0;
        const result = {
          mode: { type: 'custom', value: null },
          language: lang === 'en' ? 'en' : 'mm',
          wpm: calculateMetrics.wpm,
          accuracy: 100,
          duration: elapsedSeconds,
          wordsCompleted: Math.floor(userInput.length / 5),
          correctChars: 0,
          incorrectChars: 0,
          totalChars: userInput.length,
          intervals: intervals.map((interval) => ({
            timestamp: interval.timestamp,
            wpm: interval.wpm,
            accuracy: interval.accuracy,
          })),
          createdAt: new Date().toISOString(),
          timePerChar: { data: [] },
        };
        addResult(result);
        setTestCompleted(true);
        setIsCalculating(true);
        setTimeout(() => {
          setIsCalculating(false);
          navigate('/results', { state: { result } });
        }, 2000);
      }
      return;
    }

    if (!isTyping) setIsTyping(true);

    if (key === 'Backspace') {
      setUserInput((prev) => prev.slice(0, -1));
    } else if (key === 'Enter' && mode !== 'custom') {
      event.preventDefault();
    } else if (key.length === 1) {
      if (key === ' ') {
        event.preventDefault();
      }
      setUserInput((prev) => prev + key);
    }
  };

  const handleKeyUp = () => {
    setActiveKey(null);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isTyping, isTypingDisabled, mode, userInput, calculateMetrics, startTime]);

  const resetTest = () => {
    console.log('Reset button clicked');
    setUserInput('');
    setIsTyping(false);
    setActiveKey(null);
    setStartTime(null);
    setTestCompleted(false);
    setIntervals([]);
    if (mode === 'custom') {
      setCurrentText('');
    }
    if (typingAreaRef.current) {
      typingAreaRef.current.focus();
    }
    if (mode !== 'custom') {
      reloadData();
    }
  };

  return (
    <div className="min-h-screen p-4 text-white flex flex-col">
      <div className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-2xl font-bold mb-5">Select your desired typing mode</h1>
        {error && <div className="text-red-400 text-lg mb-4">{error}</div>}
        {loading && <div className="text-gray-400 text-lg mb-4">Loading...</div>}
        <div className="flex flex-row gap-4 items-center mb-5">
          <TestModeSelector
            mode={mode}
            setMode={setMode}
            option={option}
            setOption={setOption}
            language={lang === 'en' ? 'english' : 'myanmar'}
            setLanguage={(lang) => setLang(lang === 'english' ? 'en' : 'mm')}
          />
          <div className="transform -translate-y-2">
            <ResetButton onReset={resetTest} />
          </div>
        </div>
        {mode === 'time' && (
          <TimerComponent
            isTyping={isTyping}
            startTime={startTime}
            timeLimit={option}
            testCompleted={testCompleted}
            mode={mode}
          />
        )}
        <MetricsDisplay wpm={calculateMetrics.wpm} accuracy={calculateMetrics.accuracy} />
        {mode === 'quote' && (
          <div className="text-center mb-2">
            <span className="text-gray-400">
              Characters: {userInput.length} / {currentText.length}
            </span>
          </div>
        )}
        {mode === 'custom' && (
          <div className="text-center mb-2">
            <span className="text-gray-400 text-sm">
              Type your custom text and press Shift+Enter when finished
            </span>
          </div>
        )}
        <TypingArea
          currentText={mode === 'custom' ? '' : currentText}
          userInput={userInput}
          onUserInput={setUserInput}
          disabled={isTypingDisabled || loading}
          ref={typingAreaRef}
        />
        {isTypingDisabled && mode === 'time' && !testCompleted && (
          <div className="text-red-400 text-lg font-semibold mt-2">
            Time's up! Processing results...
          </div>
        )}
        {testCompleted && isCalculating && (
          <div className="text-center text-lg animate-pulse mt-4 mb-7">
            Calculating result...
          </div>
        )}
        <div ref={keyboardRef}>
          <Keyboard activeKey={activeKey} layout={lang === 'en' ? 'english' : 'myanmar'} />
        </div>
        <div className="mt-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-white' : 'text-gray-400 hover:text-white transition'
            }
            title="Back to Home"
          >
            <Home size={24} />
          </NavLink>
        </div>
      </div>
      <footer className="py-4 mt-4 text-center">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} Myan-Type. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default TypingTestUI;