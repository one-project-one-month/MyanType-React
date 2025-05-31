import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import TestModeSelector from '../components/TestModeSelector';
import Keyboard from '../components/Keyboard';
import wordsData from '../data/wordsData.json';
import TypingArea from '../components/TypingArea';
import ResetButton from '../components/ResetButton';
import MetricsDisplay from '../components/MetricsDisplay';
import TimerComponent from '../components/TimerComponent';
import { useTypingTest } from '../context/TypingTestContext';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";

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
  const [intervalWpm, setIntervalWpm] = useState([]);
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
      // For quote mode, check if user has typed the entire text correctly
      return input.length >= text.length && input === text;
    }
    return false;
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
      // For quote mode, you can add your quotes data here
      // For now, using a sample quote - replace with your quotes data
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
  useEffect(() => {
    let interval;
    if (isTyping && !startTime) {
      setStartTime(Date.now());
    }
  
    if (isTyping && startTime) {
      interval = setInterval(() => {
        const elapsedSeconds = (Math.floor((Date.now() - startTime) / 1000));
        const elapsedMinutes = elapsedSeconds / 60;
        const wordCount = calculateMetrics.correct / 5;
  
        // Track WPM at intervals (every 5 seconds or 5 words)
        const intervalMark = mode === 'time' ? elapsedSeconds - (elapsedSeconds % 5) : Math.floor(wordCount / 5) * 5;
        if (intervalMark >= 0 && !intervalWpm.some((point) => point.timeOrWords === intervalMark)) {
          setIntervalWpm((prev) => [...prev, { timeOrWords: intervalMark, wpm: calculateMetrics.wpm }]);
          addWpmPoint(intervalMark, calculateMetrics.wpm, mode);
        }
  
        // Check for test completion
        const actualWordsTyped = countWordsTyped(userInput, currentText);
        const isQuoteComplete = isTextCompleted(userInput, currentText, mode);
        const shouldComplete =
          (mode === 'time' && elapsedSeconds >= option) ||
          (mode === 'words' && actualWordsTyped >= option) ||
          (mode === 'quote' && isQuoteComplete);
  
        if (shouldComplete) {
          const result = {
            id: uuidv4(),
            userID: '910ffb6d-360c-4226-8640-ffe6af726732',
            mode: mode.toUpperCase(),
            language,
            timeLimit: mode === 'time' ? option : null,
            wordLimit: mode === 'words' ? option : null,
            wpm: calculateMetrics.wpm,
            raw: calculateMetrics.rawWpm,
            accuracy: calculateMetrics.accuracy,
            charactersTyped: userInput.length,
            correct: calculateMetrics.correct,
            incorrect: calculateMetrics.incorrect,
            extra: calculateMetrics.extra,
            miss: calculateMetrics.miss,
            consistency: calculateMetrics.consistency,
            timeTaken: elapsedSeconds,
            createdAt: new Date().toISOString(),
            timePerChar: { data: wpmHistory },
          };
          addResult(result);
          setTestCompleted(true);
          setIsCalculating(true);
          setTimeout(() => {
            setIsCalculating(false);
            navigate('/results', { state: { results: result } });
          }, 2000);
          clearInterval(interval);
        }
      }, 100); // Reduced interval for more responsive checking
    }
  
    return () => clearInterval(interval);
  }, [isTyping, startTime, mode, option, language, addResult, addWpmPoint, wpmHistory, navigate, userInput, currentText]);
  // Calculate consistency
  const calculateConsistency = (wpmPoints) => {
    if (wpmPoints.length < 2) return 100;
    const wpms = wpmPoints.map((point) => point.wpm);
    const mean = wpms.reduce((sum, val) => sum + val, 0) / wpms.length;
    const variance = wpms.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / wpms.length;
    const stdDev = Math.sqrt(variance);
    return Math.max(0, 100 - stdDev);
  };

  // Calculate metrics using useMemo to avoid re-renders
  const calculateMetrics = useMemo(() => {
    // Custom mode: simplified calculations
    if (mode === 'custom') {
      const totalChars = userInput.length;
      const elapsedSeconds = startTime ? (Date.now() - startTime) / 1000 : 0;
      const elapsedMinutes = elapsedSeconds / 60;
      const wordCount = totalChars / 5; // Standard: 5 characters = 1 word
      const calculatedWpm = elapsedMinutes > 0 ? Math.round(wordCount / elapsedMinutes) : 0;
      
      return {
        wpm: calculatedWpm,
        rawWpm: calculatedWpm, // Same as WPM for custom mode
        accuracy: 100, // Default 100% accuracy for custom mode
        correct: 0,
        incorrect: 0,
        extra: 0,
        miss: 0,
        consistency: 100, // Default 100% consistency for custom mode
      };
    }

    // Regular mode: detailed calculations
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
    const calculatedAccuracy = totalChars > 0 ? (correct / totalChars) * 100 : 100;
    const elapsedSeconds = startTime ? (Date.now() - startTime) / 1000 : 0;
    const elapsedMinutes = elapsedSeconds / 60;
    const wordCount = correct / 5;
    const rawWordCount = totalChars / 5;
    const calculatedWpm = elapsedMinutes > 0 ? Math.round(wordCount / elapsedMinutes) : 0;
    const rawWpm = elapsedMinutes > 0 ? Math.round(rawWordCount / elapsedMinutes) : 0;
    const consistencyScore = calculateConsistency(intervalWpm);
    return {
      wpm: calculatedWpm,
      rawWpm,
      accuracy: Math.round(calculatedAccuracy),
      correct,
      incorrect,
      extra,
      miss,
      consistency: Math.round(consistencyScore),
    };
  }, [userInput, currentText, startTime, intervalWpm, mode]);

  // Handle key press for typing
  const handleKeyPress = (event) => {
    // Prevent typing if disabled
    if (isTypingDisabled) {
      event.preventDefault();
      return;
    }

    const key = event.key;
    setActiveKey(key);
    
    // Handle Shift+Enter for custom mode
    if (mode === 'custom' && key === 'Enter' && event.shiftKey) {
      event.preventDefault();
      if (userInput.trim().length > 0) {
        // Complete the custom test
        const result = {
          id: uuidv4(),
          userID: '910ffb6d-360c-4226-8640-ffe6af726732',
          mode: 'CUSTOM',
          language,
          timeLimit: null,
          wordLimit: null,
          wpm: calculateMetrics.wpm,
          raw: calculateMetrics.rawWpm,
          accuracy: 100, // Always 100% for custom mode
          charactersTyped: userInput.length,
          correct: 0, // Set to 0 for custom mode
          incorrect: 0, // Set to 0 for custom mode
          extra: 0, // Set to 0 for custom mode
          miss: 0, // Set to 0 for custom mode
          consistency: 100, // Always 100% for custom mode
          timeTaken: startTime ? (Date.now() - startTime) / 1000 : 0,
          createdAt: new Date().toISOString(),
          timePerChar: { data: wpmHistory },
        };
        addResult(result);
        setTestCompleted(true);
        setIsCalculating(true);
        setTimeout(() => {
          setIsCalculating(false);
          navigate('/results', { state: { results: result } });
        }, 2000);
      }
      return;
    }

    if (!isTyping) setIsTyping(true);
    
    if (key === 'Backspace') {
      setUserInput((prev) => prev.slice(0, -1));
    } else if (key === 'Enter' && mode !== 'custom') {
      // Prevent Enter in non-custom modes
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
  }, [isTyping, isTypingDisabled, mode, userInput, calculateMetrics, startTime]); // Added dependencies

  // Reset the test
  const resetTest = () => {
    if (mode === 'quote') {
      // Keep the current quote text, don't regenerate
      // Quote text is already set in the useEffect above
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
    setIntervalWpm([]);
  };

  return (
    <div className="min-h-screen p-4 text-white flex flex-col">
      <div className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-2xl font-bold mb-8">Select your desired typing mode</h1>
        <TestModeSelector
          mode={mode}
          setMode={setMode}
          option={option}
          setOption={setOption}
          language={language}
          setLanguage={setLanguage}
        />
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
          disabled={isTypingDisabled} // Pass disabled state to TypingArea
        />
        {isTypingDisabled && mode === 'time' && !testCompleted && (
          <div className="text-red-400 text-lg font-semibold mt-2">
            Time's up! Processing results...
          </div>
        )}
        <div className="flex gap-4 mt-4">
          <ResetButton onReset={resetTest} />
          {testCompleted && !isCalculating && (
            <Button
              onClick={() => navigate('/results', { state: { results: results[results.length - 1] } })}
              className="bg-[#141723] text-[#F4F4F5] border-[#777C90] hover:bg-[#777C90]"
            >
              See Your Results
            </Button>
          )}
          {testCompleted && isCalculating && (
            <div className="text-center text-lg animate-pulse">
              Calculating result .....
            </div>
          )}
        </div>
        <Keyboard activeKey={activeKey} layout={language} />
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