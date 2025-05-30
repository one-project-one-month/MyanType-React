import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import TestModeSelector from './TestModeSelector';
import Keyboard from './KeyBoard';

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

  const location = useLocation();
  const inputDivRef = useRef(null);
  const navigate = useNavigate();

  const dummyData = {
    english: {
      words: [
        'the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog', 'sun', 'rises',
        'in', 'morning', 'birds', 'sing', 'trees', 'grow', 'rivers', 'flow', 'stars', 'shine',
        'moon', 'glows', 'wind', 'blows', 'clouds', 'drift', 'sky', 'blue', 'grass', 'green',
        'house', 'stands', 'people', 'walk', 'cars', 'drive', 'books', 'read', 'pens', 'write',
        'time', 'passes', 'life', 'moves', 'day', 'turns', 'night', 'falls', 'dreams', 'begin',
        'hope', 'lives', 'love', 'grows', 'friends', 'meet', 'family', 'cares', 'world', 'spins',
        'earth', 'orbits', 'sun', 'sets', 'colors', 'fade', 'music', 'plays', 'hearts', 'beat',
        'joy', 'spreads', 'peace', 'calms', 'mind', 'thinks', 'hands', 'build', 'feet', 'run',
        'eyes', 'see', 'ears', 'hear', 'voice', 'speaks', 'words', 'connect', 'ideas', 'form',
        'future', 'waits', 'past', 'teaches', 'present', 'lives', 'moment', 'matters', 'smile', 'heals'
      ],
      quote: 'The only way to do great work is to love what you do.'
    },
    myanmar: {
      words: [
        'သစ်ပင်', 'မြစ်ချောင်း', 'နေ', 'လ', 'လေထု', 'တိမ်တိုက်', 'ကောင်းကင်', 'မြက်ခင်း', 'အိမ်', 'လူများ',
        'လမ်းလျှောက်', 'ကား', 'စာအုပ်', 'ဖတ်', 'ဘောပင်', 'ရေး', 'အချိန်', 'ဖြတ်သန်း', 'ဘဝ', 'ရွေ့လျား',
        'နေ့', 'ည', 'အိပ်မက်', 'စတင်', 'မျှော်လင့်', 'ချစ်ခြင်း', 'သူငယ်ချင်း', 'မိသားစု', 'ကမ္ဘာ', 'လှည့်ပတ်',
        'မြေကြီး', 'လှည့်ပတ်', 'အရောင်', 'မှိန်ဖျော့', 'ဂီတ', 'ဖွင့်', 'နှလုံး', 'ခုန်', 'ပျော်ရွှင်', 'ပျံ့နှံ့',
        'အေးချမ်းသာယာ', 'စိတ်', 'တွေးခေါ်', 'လက်', 'တည်ဆောက်', 'ခြေ', 'ပြေး', 'မျက်လုံး', 'မြင်', 'နား',
        'ကြား', 'အသံ', 'ပြော', 'စကားလုံး', 'ချိတ်ဆက်', 'အကြံ', 'ဖြစ်ပေါ်', 'အနာဂတ်', 'စောင့်ဆိုင်း',
        'အတိတ်', 'သင်ကြား', 'ပစ္စုပ္ပန်', 'အရေးကြီး', 'အပြုံး', 'ပျောက်�ကင်း', 'ခရီး', 'စတင်', 'အဆုံး', 'ရောက်ရှိ',
        'အောင်မြင်', 'ရည်မှန်း', 'အားထုတ်', 'ယုံကြည်', 'စွမ်းအား', 'ပြည့်စုံ', 'သဘာဝ', 'လှပ', 'အသက်', 'ရှင်သန်'
      ],
      quote: 'အောင်မြင်ရန် တစ်ခုတည်းသောနည်းလမ်းမှာ သင်လုပ်သည်ကို ချစ်ခြင်းဖြစ်သည်။'
    }
  };

  // Reset test when mode, option, or language changes
  useEffect(() => {
    handleReset();
    const data = dummyData[language];
    if (mode === 'quote') {
      setSampleText(data.quote);
    } else if (mode === 'custom') {
      setSampleText('');
    } else {
      const wordCount = mode === 'words' ? option : 100;
      setSampleText(data.words.slice(0, wordCount).join(' '));
    }
  }, [mode, option, language]);

  // Update sample text based on route changes
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
        setSampleText(dummyData['english'].words.slice(0, 30).join(' '));
      }
    } catch (error) {
      toast.error(`Error setting sample text: ${error.message}`);
      setSampleText('');
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    if (!loading && inputDivRef.current) {
      inputDivRef.current.focus();
    }
  }, [loading]);

  // Calculate WPM
  useEffect(() => {
    if (!hasStarted || inputText.length === 0 || !startTime) {
      setWpm(0);
      return;
    }
    const now = Date.now();
    const minutes = ((now - startTime) / 1000) / 60;
    const wordCount = inputText.trim().split(/\s+/).filter(w => w !== '').length;
    setWpm(minutes > 0 ? Math.round(wordCount / minutes) : 0);
  }, [inputText, startTime, hasStarted]);

  // Navigate when results are set
  useEffect(() => {
    if (results) {
      navigate('/results', { state: { results } });
    }
  }, [results, navigate]);

  // Handle timer for time mode
  useEffect(() => {
    if (mode === 'time' && hasStarted) {
      setTimer(option);
      if (intervalId) clearInterval(intervalId);
      const id = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(id);
            setHasStarted(false);
            setIntervalId(null);
            calculateResults();
            return 0;
          }
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

  // Calculate results when test ends
  const calculateResults = () => {
    const now = Date.now();
    const timeTaken = startTime ? (now - startTime) / 1000 : 0;
    const minutes = timeTaken / 60;
    const charactersTyped = inputText.length;
    const wordCount = inputText.trim().split(/\s+/).filter(w => w !== '').length;

    let resultData;

    if (mode === 'custom') {
      // Custom mode: no reference text, so no accuracy or error tracking
      const rawWpm = minutes > 0 ? Math.round((charactersTyped / 5) / minutes) : 0;
      resultData = {
        wpm: wpm,
        raw: rawWpm,
        accuracy: 100,
        charactersTyped,
        correct: charactersTyped,
        incorrect: 0,
        extra: 0,
        miss: 0,
        consistency: 100,
        timeTaken: Number(timeTaken.toFixed(1)),
        language: language === 'english' ? 'en' : 'mm',
        mode: mode.toUpperCase(),
        timeLimit: null,
        wordLimit: null,
        createdAt: new Date().toISOString()
      };
    } else {
      // Other modes: compare with sampleText
      let correct = 0;
      let incorrect = 0;
      let extra = 0;
      let miss = 0;

      for (let i = 0; i < sampleText.length; i++) {
        if (i < inputText.length) {
          if (inputText[i] === sampleText[i]) {
            correct++;
          } else {
            incorrect++;
          }
        } else {
          miss++;
        }
      }
      extra = inputText.length > sampleText.length ? inputText.length - sampleText.length : 0;

      const accuracy = sampleText.length > 0 ? (correct / sampleText.length) * 100 : 0;
      const rawWpm = minutes > 0 ? Math.round((charactersTyped / 5) / minutes) : 0;
      const consistency = Math.round(accuracy * 0.8);

      resultData = {
        wpm,
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
        createdAt: new Date().toISOString()
      };
    }

    setResults(resultData);
  };

  // Helper function to find word boundaries
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

    // Handle Shift+Enter for custom mode
    if (mode === 'custom' && key === 'Enter' && shiftActive) {
      e.preventDefault();
      if (hasStarted && inputText.length > 0) {
        calculateResults();
      }
      return;
    }

    // Handle Shift key
    if (key === 'Shift') {
      setShiftActive(true);
      return;
    }

    // Ignore function keys and other non-printable keys (except Enter for custom mode)
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
          setCursorPosition(prev => prev - 1);
        }
        setActiveKey('');
      }
      e.preventDefault();
      return;
    }

    if (mode !== 'custom' && cursorPosition >= sampleText.length) {
      e.preventDefault();
      if (mode !== 'time') {
        calculateResults();
      }
      return;
    }

    const isPrintable = /^[a-zA-Z]|\p{Script=Myanmar}$|^[\.,'!?-]|^[\s]$/u.test(key);

    if (isPrintable) {
      if (mode === 'custom') {
        setInputText(prev => prev + key);
        setActiveKey(key);
      } else {
        const currentChar = sampleText[cursorPosition];
        if (key === ' ') {
          if (currentChar === ' ') {
            const nextBoundary = getNextWordBoundary(sampleText, cursorPosition);
            setInputText(prev => prev + ' ');
            setCursorPosition(nextBoundary);
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
    setHasStarted(false);
    setTimer(option);
    setStartTime(null);
    setResults(null);
    setIntervalId(null);
    setShiftActive(false);
    setActiveKey('');
    if (inputDivRef.current) {
      inputDivRef.current.focus();
    }
  };

  const renderTextWithHighlighting = () => {
    if (!sampleText) return <span className="text-[#777C90]">No text available</span>;

    const chars = sampleText.split('');
    return (
      <>
        {chars.map((char, index) => {
          let className = 'text-[#777C90]';
          if (index < inputText.length) {
            className = inputText[index] === char ? 'text-green-500' : 'text-red-500';
          }

          const isCursor = index === cursorPosition;

          return (
            <React.Fragment key={index}>
              {isCursor && hasStarted && <span className="animate-blink">|</span>}
              <span className={className}>{char}</span>
            </React.Fragment>
          );
        })}
        {cursorPosition === sampleText.length && hasStarted && (
          <span className="animate-blink">|</span>
        )}
      </>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8" onClick={handleContainerClick}>
      <div className="flex justify-center">
        <TestModeSelector
          mode={mode}
          setMode={setMode}
          option={option}
          setOption={setOption}
          language={language}
          setLanguage={setLanguage}
        />
      </div>

      <div className="flex items-center gap-4 my-4">
        {mode === 'time' && (
          <span className="text-yellow-400 text-xl">⏰ {timer}s</span>
        )}
        {hasStarted && (
          <span className="text-green-500 text-xl">WPM: {wpm}</span>
        )}
      </div>

      <p
        className="text-lg mb-2 flex justify-center"
        style={{ color: '#F4F4F5' }}
      >
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
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: 'rgba(20, 23, 35, 0.8)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        >
          {mode === 'custom' ? (
            <p className="text-sm whitespace-pre-wrap text-[#F4F4F5]">
              {inputText || <span className="text-[#777C90]">Start typing...</span>}
              {hasStarted && <span className="animate-blink">|</span>}
            </p>
          ) : (
            <p className="text-sm whitespace-pre-wrap">
              {renderTextWithHighlighting()}
            </p>
          )}
        </div>
      )}

      <div
        ref={inputDivRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        style={{
          opacity: 0,
          position: 'absolute',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }}
        aria-hidden="true"
      />

      <div className="w-full flex justify-center pb-4 px-2 mt-8">
        <Keyboard activeKey={activeKey} layout={language} shiftActive={shiftActive} />
      </div>
    </div>
  );
};

export default TypingArea;