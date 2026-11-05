"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/current-user', {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch user');
      }

      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.error('Fetch User Error', err);
      setUser(null);
    }
  };

  const checkAuthState = async () => {
    try {
      const res = await fetch('/api/auth/check-auth', {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Auth Check failed');
      }

      const data = await res.json();
      setIsAuthenticated(data.isAuthenticated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('isAuthenticated', data.isAuthenticated);
      }

      if (data.isAuthenticated) {
        await fetchCurrentUser();
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Auth check error:', err);
      setIsAuthenticated(false);
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('isAuthenticated');
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, firstName, lastName, role) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, firstName, lastName, role }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok || data.errors) {
        return { success: false, errors: data.errors || { general: data.message || 'Registration failed' } };
      }

      return { success: true };
    } catch (err) {
      console.error('Registration Error', err);
      return { success: false, errors: { general: 'Registration failed' } };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok || data.errors) {
        return { success: false, errors: data.errors || { general: 'Login failed' } };
      }

      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('isAuthenticated', 'true');
      }
      await fetchCurrentUser();

      return { success: true, role: data.role || null };
    } catch (err) {
      console.error('Login Error:', err);
      return { success: false, errors: { general: 'Login failed' } };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('isAuthenticated');
      }
    }
  };

  useEffect(() => {
    checkAuthState();
    const interval = setInterval(checkAuthState, 300000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    fetchCurrentUser,
    checkAuthState,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
