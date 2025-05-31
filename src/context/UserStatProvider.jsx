import React, { createContext, useState, useContext } from 'react';

const UserStatContext = createContext();

export const UserStatProvider = ({ children }) => {
  const [userStats, setUserStats] = useState({
    WPM: 0,
    errors: 0,
    accuracy: 100,
    history: []
  });

  const updateStats = (newStats) => {
    setUserStats((prevStats) => ({
      ...prevStats,
      ...newStats,
      history: [...prevStats.history, { ...newStats, timestamp: new Date() }]
    }));
  };

  const resetStats = () => {
    setUserStats({
      WPM: 0,
      errors: 0,
      accuracy: 100,
      history: userStats.history
    });
  };

  const clearHistory = () => {
    setUserStats((prevStats) => ({
      ...prevStats,
      history: []
    }));
  };

  return (
    <UserStatContext.Provider
      value={{
        userStats,
        updateStats,
        resetStats,
        clearHistory
      }}
    >
      {children}
    </UserStatContext.Provider>
  );
};

export const useUserStats = () => {
  const context = useContext(UserStatContext);
  if (!context) {
    throw new Error('useUserStats must be used within a UserStatProvider');
  }
  return context;
};