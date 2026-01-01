"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Update interface to match SnakeTech roles
interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'ADMIN' | 'STAFF' | 'CUSTOMER' | 'SHIPPER';
  isActive: boolean;
  isVerified: boolean;
  avatarUrl?: string;
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { username: string; email: string; password: string }) => Promise<void>;
  verifyRegister: (verifyData: { username: string; password: string; email: string; role: string; otp: string }) => Promise<void>;
  resendOTP: (data: { identifier: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  isAuthenticated: () => boolean;
  clearAuthState: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

// API functions
const loginApi = async (credentials: { email: string; password: string }) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
};

const registerApi = async (userData: { username: string; email: string; password: string }) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  return response.json();
};

const verifyRegisterApi = async (verifyData: { username: string; password: string; email: string; role: string; otp: string }) => {
  const response = await fetch('/api/auth/verify-register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(verifyData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'OTP verification failed');
  }

  return response.json();
};

const resendOTPApi = async (data: { identifier: string }) => {
  const response = await fetch('/api/auth/resend-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Resend OTP failed');
  }

  return response.json();
};

const refreshApi = async () => {
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Token refresh failed');
  }

  return response.json();
};

const logoutApi = async () => {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Logout failed');
  }

  return response.json();
};

const getMeApi = async () => {
  const response = await fetch('/api/auth/me', {
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get user data');
  }

  return response.json();
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Token refresh timeout reference
  const refreshTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Schedule token refresh before expiry (14 minutes for 15-minute tokens)
  const scheduleTokenRefresh = useCallback((token: string) => {
    try {
      // Clear existing timeout
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      // Schedule refresh 14 minutes before expiry
      const refreshDelay = 14 * 60 * 1000; // 14 minutes
      refreshTimeoutRef.current = setTimeout(async () => {
        try {
          await refreshToken();
        } catch (error) {
          console.error('Failed to refresh token:', error);
          logout();
        }
      }, refreshDelay);
    } catch (error) {
      console.error('Failed to schedule token refresh:', error);
    }
  }, []);

  // Refresh access token
  const refreshToken = useCallback(async () => {
    if (refreshing) return; // Prevent multiple concurrent refresh requests

    setRefreshing(true);
    try {
      const response = await refreshApi();
      const newToken = response.accessToken;

      setAccessToken(newToken);
      // Store new token for client-side API calls
      localStorage.setItem('snake_access_token', newToken);

      // Schedule next refresh
      scheduleTokenRefresh(newToken);

      return newToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, scheduleTokenRefresh]);

  // Bootstrap authentication state
  useEffect(() => {
    const bootstrap = async () => {
      setIsLoading(true);

      try {
        // Try to get current user info - if this succeeds, we have valid cookies
        const userData = await getMeApi();
        setUser(userData);

        // Store user role for role-based components
        if (userData?.role) {
          localStorage.setItem('snake_user_role', userData.role);
        }

        // Since we can't read httpOnly cookies, we'll trigger a refresh to get a new access token
        await refreshToken();
      } catch (error) {
        console.error('Bootstrap failed:', error);
        // Clear auth state if bootstrap fails
        setAccessToken(null);
        setUser(null);
        localStorage.removeItem('snake_access_token');
        localStorage.removeItem('snake_user_role');
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();

    // Cleanup timeout on unmount
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  // Update localStorage when access token changes
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('snake_access_token', accessToken);
      // Schedule refresh for this token
      scheduleTokenRefresh(accessToken);
    } else {
      localStorage.removeItem('snake_access_token');
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    }
  }, [accessToken, scheduleTokenRefresh]);

  const login = async (credentials: { email: string; password: string }) => {
    const data = await loginApi(credentials);

    // Set access token from login response
    setAccessToken(data.accessToken);
    setUser(data.account);

    // Store user role for role-based components
    if (data.account?.role) {
      localStorage.setItem('snake_user_role', data.account.role);
    }
  };

  const logout = async () => {
    try {
      // Call logout API to clear server-side cookies
      await logoutApi();
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with client-side cleanup even if API call fails
    }

    // Clear all client-side auth state
    setAccessToken(null);
    setUser(null);

    // Clear localStorage
    localStorage.removeItem('snake_access_token');
    localStorage.removeItem('snake_user_role');

    // Clear refresh timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
  };

  const isAuthenticated = useCallback(() => {
    return !!user && !!accessToken;
  }, [user, accessToken]);

  const clearAuthState = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('snake_access_token');
    localStorage.removeItem('snake_user_role');

    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
  };

  const register = async (userData: { username: string; email: string; password: string }) => {
    const data = await registerApi(userData);
    // Registration successful - user will need to verify OTP
    return data;
  };

  const verifyRegister = async (verifyData: { username: string; password: string; email: string; role: string; otp: string }) => {
    const data = await verifyRegisterApi(verifyData);

    // Set access token from verification response
    setAccessToken(data.accessToken);
    setUser(data.account);

    // Store user role for role-based components
    if (data.account?.role) {
      localStorage.setItem('snake_user_role', data.account.role);
    }
  };

  const resendOTP = async (data: { identifier: string }) => {
    return await resendOTPApi(data);
  };

  const value: AuthContextType = {
    user,
    accessToken,
    login,
    register,
    verifyRegister,
    resendOTP,
    logout,
    refreshToken,
    isAuthenticated,
    clearAuthState,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
