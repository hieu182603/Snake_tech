// Mock auth service for Snake_tech
export const authService = {
  login: async (email: string, password: string) => {
    // Mock login - in real app, this would call API
    if (email === 'admin@techstore.vn' && password === 'admin123') {
      const user = {
        id: '1',
        username: 'admin',
        name: 'Administrator',
        email: 'admin@techstore.vn',
        role: 'ADMIN' as const,
        isVerified: true
      };
      const token = 'mock-jwt-token-' + Date.now();
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
      }
      return { user, token };
    }

    if (email === 'user@techstore.vn' && password === 'user123') {
      const user = {
        id: '2',
        username: 'user',
        name: 'Test User',
        email: 'user@techstore.vn',
        role: 'CUSTOMER' as const,
        isVerified: true
      };
      const token = 'mock-jwt-token-' + Date.now();
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
      }
      return { user, token };
    }

    throw new Error('Invalid credentials');
  },

  register: async (userData: any) => {
    // Mock registration
    const user = {
      id: Date.now().toString(),
      username: userData.username,
      name: userData.name || userData.username,
      email: userData.email,
      role: 'CUSTOMER' as const,
      isVerified: false
    };
    const token = 'mock-jwt-token-' + Date.now();
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    }
    return { user, token };
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  },

  getUser: () => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token') && !!localStorage.getItem('user');
  },

  getUserProfile: async () => {
    const user = authService.getUser();
    return { data: user };
  }
};