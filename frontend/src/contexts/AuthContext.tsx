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
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: { email: string; otp: string; newPassword: string }) => Promise<void>;
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
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const loginApi = async (credentials: { email: string; password: string }) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorMessage = 'Login failed';

    if (contentType && contentType.includes('application/json')) {
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch (e) {
        // Ignore JSON parsing errors
      }
    }

    throw new Error(errorMessage);
  }

  return response.json();
};

const registerApi = async (userData: { username: string; email: string; password: string }) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorMessage = 'Registration failed';

    if (contentType && contentType.includes('application/json')) {
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch (e) {
        // Ignore JSON parsing errors
      }
    }

    throw new Error(errorMessage);
  }

  return response.json();
};

const verifyRegisterApi = async (verifyData: { username: string; password: string; email: string; role: string; otp: string }) => {
  const response = await fetch(`${API_BASE_URL}/auth/verify-register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(verifyData),
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorMessage = 'OTP verification failed';

    if (contentType && contentType.includes('application/json')) {
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch (e) {
        // Ignore JSON parsing errors
      }
    }

    throw new Error(errorMessage);
  }

  return response.json();
};

const resendOTPApi = async (data: { identifier: string }) => {
  const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorMessage = 'Resend OTP failed';

    if (contentType && contentType.includes('application/json')) {
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch (e) {
        // Ignore JSON parsing errors
      }
    }

    throw new Error(errorMessage);
  }

  return response.json();
};

const forgotPasswordApi = async (email: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorMessage = 'Forgot password request failed';

    if (contentType && contentType.includes('application/json')) {
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch (e) {
        // Ignore JSON parsing errors
      }
    }

    throw new Error(errorMessage);
  }

  return response.json();
};

const resetPasswordApi = async (data: { email: string; otp: string; newPassword: string }) => {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorMessage = 'Password reset failed';

    if (contentType && contentType.includes('application/json')) {
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch (e) {
        // Ignore JSON parsing errors
      }
    }

    throw new Error(errorMessage);
  }

  return response.json();
};

const refreshApi = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorMessage = 'Token refresh failed';

    if (contentType && contentType.includes('application/json')) {
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch (e) {
        // Ignore JSON parsing errors
      }
    }

    throw new Error(errorMessage);
  }

  return response.json();
};

const logoutApi = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorMessage = 'Logout failed';

    if (contentType && contentType.includes('application/json')) {
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch (e) {
        // Ignore JSON parsing errors
      }
    }

    throw new Error(errorMessage);
  }

  return response.json();
};

const getMeApi = async () => {
  const token = localStorage.getItem('snake_access_token');
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    credentials: 'include',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorMessage = 'Failed to get user data';

    if (contentType && contentType.includes('application/json')) {
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch (e) {
        // Ignore JSON parsing errors
      }
    }

    // For authentication errors (401), throw a specific error that bootstrap can handle
    if (response.status === 401) {
      throw new Error(errorMessage);
    }

    throw new Error(errorMessage);
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
        // Try to get current user info - if this succeeds, we have valid authentication
        const userData = await getMeApi();
        setUser(userData);

        // Store user role for role-based components
        if (userData?.role) {
          localStorage.setItem('snake_user_role', userData.role);
        }

        // Since we can't read httpOnly cookies, we'll trigger a refresh to get a new access token
        await refreshToken();
      } catch (error: any) {
        // Handle authentication failures gracefully - this is expected when user is not logged in
        if (error.message?.includes('No authentication token') ||
            error.message?.includes('Access token expired') ||
            error.message?.includes('Invalid access token')) {
          // User is not authenticated - this is normal, not an error
          console.log('User not authenticated');
        } else {
          console.error('Bootstrap failed:', error);
        }

        // Clear auth state if bootstrap fails (whether due to auth or other errors)
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

  const forgotPassword = async (email: string) => {
    return await forgotPasswordApi(email);
  };

  const resetPassword = async (data: { email: string; otp: string; newPassword: string }) => {
    return await resetPasswordApi(data);
  };

  const value: AuthContextType = {
    user,
    accessToken,
    login,
    register,
    verifyRegister,
    resendOTP,
    forgotPassword,
    resetPassword,
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
