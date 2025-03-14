'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { setTokenClient, getTokenClient, removeTokenClient } from '@common/cookies';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  checkAuthStatus: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Check auth status on mount and set state
    const token = getTokenClient();
    setIsAuthenticated(!!token);
  }, []);

  const login = (token: string) => {
    setTokenClient(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    removeTokenClient();
    setIsAuthenticated(false);
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

  const value = {
    isAuthenticated,
    login,
    logout,
    checkAuthStatus,
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
