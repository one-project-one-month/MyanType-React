import React from 'react';
import { Button } from "@/components/ui/button";

const TestModeSelector = ({ mode, setMode, option, setOption, language, setLanguage }) => {
    const handleModeChange = (newMode) => {
        setMode(newMode);
        // If switching to "quote" mode and language is "Myanmar," switch to "English"
        if (newMode === 'quote' && language === 'myanmar') {
            setLanguage('english');
        }
        if (newMode === 'quote' || newMode === 'custom') {
            window.history.pushState({}, '', `/${newMode}`);
        } else {
            const query = newMode === 'words' ? `count=${option}` : `time=${option}`;
            window.history.pushState({}, '', `/${newMode}?lang=${language === 'english' ? 'en' : 'mm'}&${query}`);
        }
    };

    const handleOptionChange = (value) => {
        setOption(value);
        const query = mode === 'words' ? `count=${value}` : `time=${value}`;
        window.history.pushState({}, '', `/${mode}?lang=${language === 'english' ? 'en' : 'mm'}&${query}`);
    };

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        // If switching to "Myanmar" and mode is "quote," switch to "words"
        if (lang === 'myanmar' && mode === 'quote') {
            setMode('words');
            const query = `count=${option}`;
            window.history.pushState({}, '', `/words?lang=mm&${query}`);
        } else if (mode === 'quote' || mode === 'custom') {
            window.history.pushState({}, '', `/${mode}`);
        } else {
            const query = mode === 'words' ? `count=${option}` : `time=${option}`;
            window.history.pushState({}, '', `/${mode}?lang=${lang === 'english' ? 'en' : 'mm'}&${query}`);
        }
    };

    // Styling
    const buttonBase = "rounded-md h-7 px-3 text-xs font-mono";
    const activeClass = "bg-white text-black";
    const inactiveClass = "bg-transparent text-white/50 hover:text-white hover:bg-white/10";
    const disabledClass = "bg-transparent text-white/30 cursor-not-allowed";

    return (
        <div className="mb-4 flex flex-row items-center gap-6 flex-wrap">
            {/* Language Buttons */}
            <div className="flex flex-row gap-2">
                <Button
                    onClick={() => handleLanguageChange('english')}
                    className={`${buttonBase} ${language === 'english' ? activeClass : inactiveClass}`}
                >
                    English
                </Button>
                <Button
                    onClick={() => handleLanguageChange('myanmar')}
                    disabled={mode === 'quote'}
                    className={`${buttonBase} ${language === 'myanmar' ? activeClass : mode === 'quote' ? disabledClass : inactiveClass}`}
                >
                    Myanmar
                </Button>
            </div>

            {/* Mode Buttons */}
            <div className="flex flex-row gap-2">
                {['words', 'time', 'quote', 'custom'].map((m) => (
                    <Button
                        key={m}
                        onClick={() => handleModeChange(m)}
                        disabled={m === 'quote' && language === 'myanmar'}
                        className={`${buttonBase} ${mode === m ? activeClass : m === 'quote' && language === 'myanmar' ? disabledClass : inactiveClass}`}
                    >
                        {m}
                    </Button>
                ))}
            </div>

            {/* Option Buttons */}
            {(mode === 'time' || mode === 'words') && (
                <div className="flex flex-row gap-2">
                    {[15, 30, 60, 120].map((value) => (
                        <Button
                            key={value}
                            onClick={() => handleOptionChange(value)}
                            className={`${buttonBase} ${option === value ? activeClass : inactiveClass}`}
                        >
                            {value}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TestModeSelector;