/**
 * @deprecated This service has been removed. Use AuthContext instead for real API integration.
 * All mock data has been removed to force migration to proper API calls.
 */
export const authService = {
  login: async (credentials: { identifier: string; password: string }) => {
    throw new Error('authService has been deprecated. Use AuthContext.login() instead.');
  },

  register: async (userData: any) => {
    throw new Error('authService has been deprecated. Use AuthContext.register() instead.');
  },

  verifyRegister: async (verifyData: { username: string; password: string; email: string; role: string; otp: string }) => {
    throw new Error('authService has been deprecated. Use AuthContext.verifyRegister() instead.');
  },

  logout: () => {
    throw new Error('authService has been deprecated. Use AuthContext.logout() instead.');
  },

  getUser: () => {
    throw new Error('authService has been deprecated. Use AuthContext.user instead.');
  },

  getToken: () => {
    throw new Error('authService has been deprecated. Use AuthContext.accessToken instead.');
  },

  isAuthenticated: () => {
    throw new Error('authService has been deprecated. Use AuthContext.isAuthenticated() instead.');
  },

  getUserProfile: async () => {
    throw new Error('authService has been deprecated. Use AuthContext.user instead.');
  }
};