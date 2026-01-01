export interface ValidationError {
  fieldErrors?: Record<string, string>;
  message?: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    user: {
      id: string;
      fullName: string;
      email: string;
      role: string;
    };
    accessToken: string;
  };
}

export interface AuthCredentials {
  email: string;
  password: string;
}
