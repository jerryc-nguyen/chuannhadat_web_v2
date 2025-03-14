'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@common/auth/AuthContext';
import apiClient from '@common/api/apiClient';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    // Add any other user fields returned by your API
  };
  frontendToken?: string;
}

export default function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);

    try {
      // Make API call to login endpoint
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials);

      // Extract data from response
      const { token, user, frontendToken } = response.data;

      // Use AuthContext login method with all available data
      login(token, frontendToken, user);

      // Check if we need to redirect after login
      try {
        const redirectPath = sessionStorage.getItem('redirectAfterLogin');
        if (redirectPath) {
          sessionStorage.removeItem('redirectAfterLogin');
          router.push(redirectPath);
        } else {
          // Default redirect after login (e.g., dashboard)
          router.push('/dashboard');
        }
      } catch (e) {
        console.error('Error handling redirect:', e);
        router.push('/dashboard');
      }

      // Refresh the page to update server-rendered content
      router.refresh();

      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    login: handleLogin,
  };
} 
