import React, { createContext, useState } from 'react';
import { queryClient } from "@/lib/queryClient.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      await fetch('https://myantype-nodejs.onrender.com/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      queryClient.clear();
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout failed:', error);
      queryClient.clear();
      setIsLoggedIn(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;