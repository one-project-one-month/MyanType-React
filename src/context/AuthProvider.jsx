import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const BASE_URL = 'https://myantype-nodejs.onrender.com/api/v1';

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('accessToken');
  });

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('accessToken'));
  }, []);

  const login = async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      console.log('Attempting login with:', { email });
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Send/receive HttpOnly cookies
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response status:', res.status);
      const data = await res.json();
      console.log('Login response data:', data);

      if (res.ok && data.success && data.accessToken && data.refreshToken) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        setIsLoggedIn(true);
        console.log('Tokens stored in localStorage:', {
          accessToken: localStorage.getItem('accessToken')?.substring(0, 20) + '...',
          refreshToken: localStorage.getItem('refreshToken')?.substring(0, 20) + '...',
        });
        return data;
      } else {
        throw new Error(data.message || 'Login failed: Invalid response');
      }
    } catch (error) {
      console.error('Login error:', error.message);
      setIsLoggedIn(false);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      throw error;
    }
  };

  const logout = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        await fetch(`${BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: 'include', // Send HttpOnly refreshToken cookie
        });
      }
      setIsLoggedIn(false);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggedIn(false);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;