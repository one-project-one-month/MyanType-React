import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const defaultTheme = {
    keyboard: '#141723',
    correctHighlight: '#10B981', // Default green-500
    incorrectHighlight: '#EF4444', // Default red-500
  };

  const themes = {
    default: { ...defaultTheme },
    darkBlue: {
      keyboard: '#1E293B',
      correctHighlight: '#22D3EE',
      incorrectHighlight: '#F472B6',
    },
    lightPurple: {
      keyboard: '#6B46C1',
      correctHighlight: '#ED64A6',
      incorrectHighlight: '#CBD5E0',
    },
    emeraldGreen: {
      keyboard: '#2D3748',
      correctHighlight: '#48BB78',
      incorrectHighlight: '#F56565',
    },
    sunsetOrange: {
      keyboard: '#744210',
      correctHighlight: '#F6AD55',
      incorrectHighlight: '#E53E3E',
    },
    oceanBlue: {
      keyboard: '#2A4365',
      correctHighlight: '#63B3ED',
      incorrectHighlight: '#FCA5A5',
    },
    tealGlow: {
      keyboard: '#234E52',
      correctHighlight: '#38B2AC',
      incorrectHighlight: '#F6AD55',
    },
    lavenderDream: {
      keyboard: '#5A67D8',
      correctHighlight: '#9F7AEA',
      incorrectHighlight: '#FEB2B2',
    },
    midnightCyan: {
      keyboard: '#1A202C',
      correctHighlight: '#81E6D9',
      incorrectHighlight: '#F56565',
    },
    stormGray: {
      keyboard: '#2D3748',
      correctHighlight: '#A0AEC0',
      incorrectHighlight: '#E53E3E',
    },
  };

  const [currentTheme, setCurrentTheme] = useState('default');

  const changeTheme = (themeName) => {
    setCurrentTheme(themeName);
  };

  return (
    <ThemeContext.Provider value={{ themes, currentTheme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);