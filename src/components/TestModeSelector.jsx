import React from 'react';
import { Button } from "@/components/ui/button";

const TestModeSelector = ({ mode, setMode, option, setOption, language, setLanguage }) => {
    const handleModeChange = (newMode) => {
        setMode(newMode);
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
        if (mode === 'quote' || mode === 'custom') {
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
                    className={`${buttonBase} ${language === 'myanmar' ? activeClass : inactiveClass}`}
                >
                    Myanmar
                </Button>
            </div>

            {/* Mode Buttons */}
            <div className="flex flex-row gap-2">
                {['time', 'words', 'quote', 'custom'].map((m) => (
                    <Button
                        key={m}
                        onClick={() => handleModeChange(m)}
                        className={`${buttonBase} ${mode === m ? activeClass : inactiveClass}`}
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
