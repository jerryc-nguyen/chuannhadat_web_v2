'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { setTokenClient, getTokenClient, removeTokenClient, getFrontendTokenClient, setFrontendToken } from '@common/cookies';
import { useRouter } from 'next/navigation';

// Define a basic user type - expand this based on your user data structure
interface User {
  id?: string;
  name?: string;
  email?: string;
  // Add other user properties as needed
}

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (token: string, frontendToken?: string, userData?: User) => void;
  logout: () => void;
  checkAuthStatus: () => boolean;
  getUserInfo: () => User | null;
  updateUserInfo: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check auth status on mount and set state
    checkAuthStatus();

    // Try to load user data from localStorage if available
    try {
      const savedUserData = localStorage.getItem('user_data');
      if (savedUserData) {
        setCurrentUser(JSON.parse(savedUserData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, []);

  const login = (token: string, frontendToken?: string, userData?: User) => {
    setTokenClient(token);
    if (frontendToken) {
      setFrontendToken(frontendToken);
    }

    setIsAuthenticated(true);

    if (userData) {
      setCurrentUser(userData);
      // Save user data to localStorage for persistence
      try {
        localStorage.setItem('user_data', JSON.stringify(userData));
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    }
  };

  const logout = () => {
    removeTokenClient();
    setIsAuthenticated(false);
    setCurrentUser(null);

    // Clear user data from localStorage
    try {
      localStorage.removeItem('user_data');
    } catch (error) {
      console.error('Error removing user data:', error);
    }

    // Optional: redirect to login or home page
    router.push('/');
    // Refresh to update server-rendered content
    router.refresh();
  };

  const checkAuthStatus = () => {
    const token = getTokenClient();
    const authStatus = !!token;
    setIsAuthenticated(authStatus);
    return authStatus;
  };

  const getUserInfo = () => {
    return currentUser;
  };

  const updateUserInfo = (userData: User) => {
    setCurrentUser((prev) => ({ ...prev, ...userData }));

    // Update localStorage
    try {
      localStorage.setItem('user_data', JSON.stringify({ ...currentUser, ...userData }));
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const value = {
    isAuthenticated,
    currentUser,
    login,
    logout,
    checkAuthStatus,
    getUserInfo,
    updateUserInfo
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 
