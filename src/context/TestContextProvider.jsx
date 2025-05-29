import React, { createContext, useState, useContext } from 'react';

const TestContext = createContext();

export const TestProvider = ({ children }) => {
  const [testState, setTestState] = useState({
    status: 'idle',
    timer: 0,
    accuracy: 100
  });

  const updateTestState = (newState) => {
    setTestState((prevState) => ({
      ...prevState,
      ...newState
    }));
  };

  const startTest = () => {
    setTestState({
      status: 'running',
      timer: 0,
      accuracy: 100
    });
  };

  const endTest = () => {
    setTestState((prevState) => ({
      ...prevState,
      status: 'ended'
    }));
  };

  const resetTest = () => {
    setTestState({
      status: 'idle',
      timer: 0,
      accuracy: 100
    });
  };

  return (
    <TestContext.Provider
      value={{
        testState,
        updateTestState,
        startTest,
        endTest,
        resetTest
      }}
    >
      {children}
    </TestContext.Provider>
  );
};

export const useTestContext = () => {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTestContext must be used within a TestProvider');
  }
  return context;
};