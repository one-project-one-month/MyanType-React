// src/context/AuthProvider.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Initialize from localStorage to persist login state
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const login = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  // Optional: Add token validation if using JWT
  useEffect(() => {
    // Example: Validate token with API (uncomment and adapt if needed)
    /*
    const validateToken = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const { data } = await authApi.get('/auth/verify');
          if (data.isValid) {
            setIsLoggedIn(true);
          } else {
            logout();
          }
        } catch (error) {
          logout();
        }
      }
    };
    validateToken();
    */
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;