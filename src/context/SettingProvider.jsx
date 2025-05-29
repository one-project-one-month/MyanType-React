import React, { createContext, useState, useContext } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    testMode: 'timeBased', // 'timeBased' or 'wordBased'
    timeDuration: 30, // Default: 30 seconds (options: 15, 30, 60, 120)
    wordCount: 30, // Default: 30 words (options: 30, 60, 120)
    language: 'English' // 'English' or 'Myanmar'
  });

  const updateSettings = (newSettings) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      ...newSettings
    }));
  };

  const resetSettings = () => {
    setSettings({
      testMode: 'timeBased',
      timeDuration: 30,
      wordCount: 30,
      language: 'English'
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};