// Auth service for Next.js Snake Tech project
// Simplified version based on EXE101 auth service

export interface LoginCredentials {
  identifier: string; // Can be email or username
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface VerifyRegisterData {
  username: string;
  password: string;
  email: string;
  role: string;
  otp: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

// Mock API calls - replace with actual API calls later
const mockApiCall = async (endpoint: string, data: any): Promise<any> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock responses based on endpoint
  if (endpoint === '/auth/register') {
    return { success: true, message: 'OTP sent to email' };
  }

  if (endpoint === '/auth/verify-register') {
    return { success: true, data: { accessToken: 'mock-jwt-token' } };
  }

  if (endpoint === '/auth/login') {
    return { success: true, data: { accessToken: 'mock-jwt-token' } };
  }

  if (endpoint === '/auth/resend-otp') {
    return { success: true, message: 'OTP resent' };
  }

  if (endpoint === '/auth/forgot-password') {
    return { success: true, message: 'OTP sent for password reset' };
  }

  if (endpoint === '/auth/verify-reset-password') {
    return { success: true, message: 'Password reset successfully' };
  }

  throw new Error('Endpoint not implemented');
};

export const authService = {
  // Registration flow
  async register(userData: RegisterData): Promise<ApiResponse> {
    try {
      const response = await mockApiCall('/auth/register', {
        username: userData.username.trim(),
        email: userData.email.trim(),
        password: userData.password,
        role: userData.role || 'CUSTOMER'
      });
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  },

  async verifyRegister(verifyData: VerifyRegisterData): Promise<any> {
    try {
      const response = await mockApiCall('/auth/verify-register', verifyData);

      // Store token
      if (response.data?.accessToken) {
        localStorage.setItem('sa_token', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify({
          username: verifyData.username,
          email: verifyData.email,
          role: 'customer'
        }));
      }

      return response;
    } catch (error: any) {
      throw new Error(error.message || 'OTP verification failed');
    }
  },

  async resendOTP({ identifier }: { identifier?: string }): Promise<ApiResponse> {
    try {
      const response = await mockApiCall('/auth/resend-otp', { identifier });
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to resend OTP');
    }
  },

  // Login flow
  async login(credentials: LoginCredentials): Promise<string> {
    try {
      const response = await mockApiCall('/auth/login', credentials);

      // Store token
      if (response.data?.accessToken) {
        localStorage.setItem('sa_token', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify({
          username: credentials.identifier,
          email: credentials.identifier.includes('@') ? credentials.identifier : undefined,
          role: 'customer'
        }));
      }

      return response.data.accessToken;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  },

  // Password reset
  async requestPasswordReset(email: string): Promise<ApiResponse> {
    try {
      const response = await mockApiCall('/auth/forgot-password', { email });
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send reset email');
    }
  },

  async verifyResetPassword({ email, otp, newPassword }: { email: string, otp: string, newPassword: string }): Promise<ApiResponse> {
    try {
      const response = await mockApiCall('/auth/verify-reset-password', {
        email,
        otp,
        newPassword
      });
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to reset password');
    }
  },

  // User management
  async getUserProfile() {
    // Mock user profile
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  logout() {
    localStorage.removeItem('sa_token');
    localStorage.removeItem('user');
  },

  isAuthenticated() {
    return !!localStorage.getItem('sa_token');
  },

  getToken() {
    return localStorage.getItem('sa_token');
  },

  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};
