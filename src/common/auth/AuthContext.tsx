'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { setTokenClient, getTokenClient, removeTokenClient, getFrontendTokenClient, setFrontendToken } from '@common/cookies';
import { useRouter } from 'next/navigation';
import { AuthUtils } from '@common/auth';
import { ILoginResponse } from '@mobile/auth/types';
import { CustomerGender } from '@common/types';
import { useAtom } from 'jotai';
import { currentUserAtom } from '@mobile/auth/states';

interface AuthContextType {
  // Core authentication state
  isAuthenticated: boolean;
  currentUser: ILoginResponse | null;

  // New AuthContext methods
  login: (token: string, userData: ILoginResponse) => void;
  logout: () => void;
  checkAuthStatus: () => boolean;
  getUserInfo: () => ILoginResponse | null;
  updateUserInfo: (userData: Partial<ILoginResponse>) => void;

  // Old useAuth methods (for backward compatibility)
  handleSignIn: (userData: ILoginResponse) => void;
  handleSignOut: () => void;
  updateCurrentUser: (userData: ILoginResponse) => void;
  bankTransferNote: string;
}

// Create a default auth context value for safety
const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  currentUser: null,
  login: () => console.warn('Auth context not initialized'),
  logout: () => console.warn('Auth context not initialized'),
  checkAuthStatus: () => false,
  getUserInfo: () => null,
  updateUserInfo: () => console.warn('Auth context not initialized'),
  // Old methods
  handleSignIn: () => console.warn('Auth context not initialized'),
  handleSignOut: () => console.warn('Auth context not initialized'),
  updateCurrentUser: () => console.warn('Auth context not initialized'),
  bankTransferNote: '',
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const router = useRouter();

  useEffect(() => {
    // Check auth status on mount and set state
    const hasValidToken = checkAuthStatus();
    console.log("🔍 AuthContext init - Token exists:", hasValidToken);

    // Only run localStorage operations in the browser
    if (typeof window !== 'undefined') {
      // Try to load user data from localStorage if available
      try {
        const savedUserData = localStorage.getItem('user_data');
        if (savedUserData && !currentUser) {
          console.log("📋 Loading user data from localStorage");
          const userData = JSON.parse(savedUserData);

          // If we have a token but no current user, restore the user from localStorage
          if (hasValidToken) {
            setCurrentUser(userData);
            console.log("👤 User restored from localStorage");
          } else {
            console.warn("⚠️ Found user data but no valid token - may need to login again");
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
  }, [setCurrentUser, currentUser]);

  // Helper function to ensure we have a valid ILoginResponse
  const ensureValidUserData = (data: Partial<ILoginResponse>): ILoginResponse => {
    // Create a basic structure that satisfies ILoginResponse
    const baseUser: ILoginResponse = {
      id: typeof data.id === 'string' ? parseInt(data.id, 10) : (data.id || 0),
      full_name: data.full_name || '',
      api_token: data.api_token || '',
      post_token: data.post_token || '',
      avatar_url: data.avatar_url || '',
      description: data.description || null,
      formatted_badges: data.formatted_badges || null,
      formatted_joined_at: data.formatted_joined_at || '',
      gender: data.gender || CustomerGender.Male,
      job_title: data.job_title || null,
      referral_code: data.referral_code || '',
      phone: data.phone || '',
      posts_count: data.posts_count || 0,
      profile_tags: data.profile_tags || [],
      slug: data.slug || '',
      address: data.address || '',
      // Copy any other properties from the original object
      ...data
    };

    // Handle name field if present in the input data
    const anyData = data as any;
    if (anyData.name && !baseUser.full_name) {
      baseUser.full_name = anyData.name;
    }

    return baseUser;
  };

  // New login method (takes ILoginResponse for userData)
  const login = (token: string, userData: ILoginResponse) => {
    // Set token in client cookie (secure storage)
    setTokenClient(token);

    // Extract and set frontend token if available in userData
    if (userData.post_token) {
      setFrontendToken(userData.post_token);
    }

    setIsAuthenticated(true);

    // Format userData to ensure it's a valid ILoginResponse
    const enhancedUserData = ensureValidUserData({
      ...userData,
      api_token: token,
    });

    // Create a copy of user data without sensitive tokens for localStorage
    const userDataForStorage = {
      ...enhancedUserData,
      // Remove tokens from localStorage data (they are stored in cookies)
      api_token: '', // Don't store actual token in localStorage
      post_token: '', // Don't store actual token in localStorage
    };

    setCurrentUser(enhancedUserData);

    // Save to AuthUtils (for backward compatibility)
    AuthUtils.updateCurrentUser(enhancedUserData);

    // Save user data to localStorage for persistence
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('user_data', JSON.stringify(userDataForStorage));
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    }
  };

  // New logout method
  const logout = () => {
    removeTokenClient();
    setIsAuthenticated(false);
    setCurrentUser(null);

    // Clean up AuthUtils storage
    AuthUtils.removeCurrentUser();

    // Clear user data from localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('user_data');
      } catch (error) {
        console.error('Error removing user data:', error);
      }
    }

    // Optional: redirect to login or home page
    router.push('/');
    // Refresh to update server-rendered content
    router.refresh();
  };

  // Check auth status
  const checkAuthStatus = () => {
    const token = getTokenClient();
    const authStatus = !!token;
    setIsAuthenticated(authStatus);
    return authStatus;
  };

  // Get user info
  const getUserInfo = () => {
    return currentUser;
  };

  // Update user info (enhanced to handle both formats)
  const updateUserInfo = (userData: Partial<ILoginResponse>) => {
    setCurrentUser((prev) => {
      if (!prev) return ensureValidUserData(userData);

      const updated = { ...prev, ...userData };

      // Check for name property in the userData (it might be passed as any)
      const anyUserData = userData as any;
      if (anyUserData.name && !userData.full_name) {
        updated.full_name = anyUserData.name;
      }

      return updated;
    });

    // Update localStorage
    if (typeof window !== 'undefined' && currentUser) {
      try {
        // Create a copy without sensitive token data for localStorage
        const updatedUser = {
          ...currentUser,
          ...userData,
          // Preserve empty string for tokens in localStorage
          api_token: '',
          post_token: '',
        };

        localStorage.setItem('user_data', JSON.stringify(updatedUser));

        // For AuthUtils, keep the tokens (it might need them)
        const updatedUserWithTokens = { ...currentUser, ...userData };
        AuthUtils.updateCurrentUser(updatedUserWithTokens);
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    }
  };

  // Old methods for backward compatibility
  const handleSignIn = (userData: ILoginResponse) => {
    // Extract token from the user data (old format)
    const token = userData.api_token || '';

    // Call the new login method with the user data
    login(token, userData);
  };

  const handleSignOut = () => {
    logout();
  };

  const updateCurrentUser = (userData: ILoginResponse) => {
    updateUserInfo(userData);
  };

  // Calculate bankTransferNote 
  const bankTransferNote = currentUser?.id?.toString() || '';

  const value = {
    isAuthenticated,
    currentUser,
    login,
    logout,
    checkAuthStatus,
    getUserInfo,
    updateUserInfo,
    // Old methods for backward compatibility
    handleSignIn,
    handleSignOut,
    updateCurrentUser,
    bankTransferNote,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
