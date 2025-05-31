import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import TestModeSelector from '../components/TestModeSelector';
import Keyboard from '../components/KeyBoard';
import wordsData from '../data/wordsData.json';
import TypingArea from '../components/TypingArea';
import ResetButton from '../components/ResetButton';
import MetricsDisplay from '../components/MetricsDisplay';
import TimerComponent from '../components/TimerComponent';
import { useTypingTest } from '../context/TypingTestContext';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Home } from 'lucide-react';

const TypingTestUI = () => {
  const { addResult, addWpmPoint, wpmHistory, results } = useTypingTest();
  const navigate = useNavigate();
  const [mode, setMode] = useState('words');
  const [option, setOption] = useState(15);
  const [language, setLanguage] = useState('english');
  const [currentText, setCurrentText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [activeKey, setActiveKey] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [testCompleted, setTestCompleted] = useState(false);
  const [intervals, setIntervals] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);

  // Helper function to count actual words typed correctly
  const countWordsTyped = (input, text) => {
    const inputWords = input.trim().split(/\s+/).filter(word => word.length > 0);
    const textWords = text.trim().split(/\s+/).filter(word => word.length > 0);
    let correctWords = 0;
    for (let i = 0; i < inputWords.length && i < textWords.length; i++) {
      if (inputWords[i] === textWords[i]) {
        correctWords++;
      }
    }
    return correctWords;
  };

  // Helper function to check if quote/text is completely typed
  const isTextCompleted = (input, text, mode) => {
    if (mode === 'quote') {
      return input.length >= text.length && input === text;
    }
    return false;
  };

  // Calculate consistency
  const calculateConsistency = (intervalData) => {
    if (intervalData.length < 2) return 100;
    const wpms = intervalData.map((point) => point.wpm);
    const mean = wpms.reduce((sum, val) => sum + val, 0) / wpms.length;
    const variance = wpms.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / wpms.length;
    const stdDev = Math.sqrt(variance);
    return Math.max(0, 100 - stdDev);
  };

  // Check if typing should be disabled (for time mode)
  const isTypingDisabled = useMemo(() => {
    if (testCompleted) return true;
    if (mode === 'time' && startTime) {
      const elapsedSeconds = (Date.now() - startTime) / 1000;
      return elapsedSeconds >= option;
    }
    return false;
  }, [mode, startTime, option, testCompleted]);

  // Generate random words based on language and option for non-custom modes
  useEffect(() => {
    if (mode === 'quote') {
      const sampleQuotes = [
        "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
        "Innovation distinguishes between a leader and a follower. Your time is limited, so don't waste it living someone else's life.",
        "Stay hungry, stay foolish. The people in the crazy enough to think they can change the world are the ones who do.",
        "Success is not final, failure is not fatal: it is the courage to continue that counts. Never give up on a dream just because of the time it will take to accomplish it.",
        "The future belongs to those who believe in the beauty of their dreams. Don't watch the clock; do what it does. Keep going."
      ];
      const randomQuote = sampleQuotes[Math.floor(Math.random() * sampleQuotes.length)];
      setCurrentText(randomQuote);
      resetTest();
    } else if (mode !== 'custom') {
      const selectedLanguageData = wordsData.find((data) => data.language === language);
      const words = selectedLanguageData.words;
      const randomWords = Array.from({ length: option }, () =>
        words[Math.floor(Math.random() * words.length)]
      ).join(' ');
      setCurrentText(randomWords);
      resetTest();
    } else {
      resetTest();
    }
  }, [language, option, mode]);

  // Calculate WPM
  const calculateWPM = (correctChars, timeElapsed) => {
    if (timeElapsed === 0) return 0;
    return Math.round((correctChars / 5) / (timeElapsed / 60));
  };

  // Calculate metrics (WPM, accuracy, etc.)
  const calculateMetrics = useMemo(() => {
    if (mode === 'custom') {
      const totalChars = userInput.length;
      const elapsedSeconds = startTime ? (Date.now() - startTime) / 1000 : 0;
      const wpm = calculateWPM(totalChars, elapsedSeconds);
      return {
        wpm: Math.min(wpm, 300), // Cap at reasonable maximum
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

  // Monitor typing and test completion
  useEffect(() => {
    let interval;
    if (isTyping && !startTime) {
      setStartTime(Date.now());
    }

    if (isTyping && startTime) {
      interval = setInterval(() => {
        const elapsedSeconds = (Date.now() - startTime) / 1000;
        const timeElapsed = Math.floor(elapsedSeconds);
        const { wpm, accuracy, correct } = calculateMetrics;

        // Record intervals every 2 seconds
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

        // Check for test completion
        const actualWordsTyped = countWordsTyped(userInput, currentText);
        const isQuoteComplete = isTextCompleted(userInput, currentText, mode);
        const shouldComplete =
          (mode === 'time' && elapsedSeconds >= option) ||
          (mode === 'words' && actualWordsTyped >= option) ||
          (mode === 'quote' && isQuoteComplete);

        if (shouldComplete) {
          const elapsedTime = elapsedSeconds;
          const result = {
            id: uuidv4(),
            userID: '910ffb6d-360c-4226-8640-ffe6af726732',
            mode: { type: mode.toUpperCase(), value: option },
            language,
            wpm: calculateMetrics.wpm,
            accuracy: calculateMetrics.accuracy,
            duration: elapsedTime,
            wordsCompleted: mode === 'words' ? actualWordsTyped : Math.floor(userInput.length / 5),
            correctChars: calculateMetrics.correct,
            incorrectChars: calculateMetrics.incorrect,
            totalChars: userInput.length,
            intervals: intervals.map(interval => ({
              timestamp: interval.timestamp,
              wpm: interval.wpm,
              accuracy: interval.accuracy,
            })),
            createdAt: new Date().toISOString(),
            timePerChar: { data: wpmHistory },
          };
          addResult(result);
          setTestCompleted(true);
          setIsCalculating(true);
          setTimeout(() => {
            setIsCalculating(false);
            navigate('/results');
          }, 2000);
          clearInterval(interval);
        }
      }, 100); // Updates every 100ms for real-time metrics
    }

    return () => clearInterval(interval);
  }, [isTyping, startTime, mode, option, language, userInput, currentText, calculateMetrics, intervals, addResult, addWpmPoint, wpmHistory, navigate]);

  // Handle key press for typing
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
          id: uuidv4(),
          userID: '910ffb6d-360c-4226-8640-ffe6af726732',
          mode: { type: 'CUSTOM', value: null },
          language,
          wpm: calculateMetrics.wpm,
          accuracy: 100,
          duration: elapsedSeconds,
          wordsCompleted: Math.floor(userInput.length / 5),
          correctChars: 0,
          incorrectChars: 0,
          totalChars: userInput.length,
          intervals: intervals.map(interval => ({
            timestamp: interval.timestamp,
            wpm: interval.wpm,
            accuracy: interval.accuracy,
          })),
          createdAt: new Date().toISOString(),
          timePerChar: { data: wpmHistory },
        };
        addResult(result);
        setTestCompleted(true);
        setIsCalculating(true);
        setTimeout(() => {
          setIsCalculating(false);
          navigate('/results');
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
      setUserInput((prev) => prev + key);
    }
  };

  // Handle key up to clear active key
  const handleKeyUp = () => {
    setActiveKey(null);
  };

  // Add event listeners for typing
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isTyping, isTypingDisabled, mode, userInput, calculateMetrics, startTime]);

  // Reset the test
  const resetTest = () => {
    if (mode === 'quote') {
      // Keep the current quote text, don't regenerate
    } else if (mode !== 'custom') {
      const selectedLanguageData = wordsData.find((data) => data.language === language);
      const words = selectedLanguageData.words;
      const randomWords = Array.from({ length: option }, () =>
        words[Math.floor(Math.random() * words.length)]
      ).join(' ');
      setCurrentText(randomWords);
    } else {
      setCurrentText('');
    }
    setUserInput('');
    setIsTyping(false);
    setActiveKey(null);
    setStartTime(null);
    setTestCompleted(false);
    setIntervals([]);
  };

  return (
    <div className="min-h-screen p-4 text-white flex flex-col">
      <div className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-2xl font-bold mb-8">Select your desired typing mode</h1>
        <div className="flex flex-row gap-4 items-center mb-8">
          <TestModeSelector
            mode={mode}
            setMode={setMode}
            option={option}
            setOption={setOption}
            language={language}
            setLanguage={setLanguage}
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
          />
        )}
        <MetricsDisplay wpm={calculateMetrics.wpm} accuracy={calculateMetrics.accuracy} />

        {/* Show word progress for word mode */}
        {mode === 'words' && (
          <div className="text-center mb-2">
            <span className="text-gray-400">
              Words completed: {countWordsTyped(userInput, currentText)} / {option}
            </span>
          </div>
        )}

        {/* Show quote progress for quote mode */}
        {mode === 'quote' && (
          <div className="text-center mb-2">
            <span className="text-gray-400">
              Characters: {userInput.length} / {currentText.length}
            </span>
          </div>
        )}

        {/* Show custom mode instructions */}
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
          disabled={isTypingDisabled}
        />
        {isTypingDisabled && mode === 'time' && !testCompleted && (
          <div className="text-red-400 text-lg font-semibold mt-2">
            Time's up! Processing results...
          </div>
        )}
        <div className="flex gap-4 mt-4">
          {testCompleted && !isCalculating && (
            <Button
              onClick={() => navigate('/results')}
              className="bg-[#141723] text-[#F4F4F5] border-[#777C90] hover:bg-[#777C90]"
            >
              See Your Results
            </Button>
          )}
          {testCompleted && isCalculating && (
            <div className="text-center text-lg animate-pulse mb-7">
              Calculating result .....
            </div>
          )}
        </div>
        <Keyboard activeKey={activeKey} layout={language} />
        <div className="mt-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? 'text-white'
                : 'text-gray-400 hover:text-white transition'
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