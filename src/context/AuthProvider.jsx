import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

const BASE_URL = 'https://myantype-nodejs.onrender.com/api/v1';

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const login = async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      console.log('Attempting login with:', { email, password });
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', res.status, res.statusText);
      if (res.ok) {
        const data = await res.json();
        console.log('Response data:', data);
        if (data.success) {
          // Store tokens in localStorage
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          // Store tokens in cookies
          Cookies.set('accessToken', data.accessToken, { expires: 7 }); // Expires in 7 days
          Cookies.set('refreshToken', data.refreshToken, { expires: 30 }); // Expires in 30 days
          setIsLoggedIn(true);
          localStorage.setItem('isLoggedIn', 'true');
          console.log('Tokens saved to localStorage and cookies:', {
            localStorage: {
              accessToken: localStorage.getItem('accessToken'),
              refreshToken: localStorage.getItem('refreshToken'),
            },
            cookies: {
              accessToken: Cookies.get('accessToken'),
              refreshToken: Cookies.get('refreshToken'),
            },
          });
          return data;
        } else {
          throw new Error(data.message || 'Login failed');
        }
      } else {
        const errorData = await res.json();
        console.error('Login failed with status:', res.status, 'Error:', errorData);
        throw new Error(errorData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoggedIn(false);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${BASE_URL}/auth/logout`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setIsLoggedIn(false);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggedIn(false);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;