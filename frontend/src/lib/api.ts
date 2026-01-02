import { authenticatedFetch } from '@/contexts/AuthContext';

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api');
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      let errorMessage = `API request failed: ${response.status} ${response.statusText}`;

      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          errorMessage += ` - ${errorData.message || errorData.error || 'Unknown error'}`;
        } catch (e) {
          // Ignore JSON parsing errors
        }
      }

      throw new Error(errorMessage);
    }

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return {
        ...data,
        success: response.ok
      } as ApiResponse<T>;
    }

    // For non-JSON responses, return success status only
    return {
      success: response.ok
    } as ApiResponse<T>;
  }

  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key]);
        }
      });
    }

    const response = await authenticatedFetch(url.toString(), {
      method: 'GET'
    });

    return this.handleResponse<T>(response);
  }

  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await authenticatedFetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });

    return this.handleResponse<T>(response);
  }

  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response = await authenticatedFetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });

    return this.handleResponse<T>(response);
  }

  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await authenticatedFetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE'
    });

    return this.handleResponse<T>(response);
  }
}

// Default instance
export const apiClient = new ApiClient();

// Legacy support - direct authenticated fetch
export { authenticatedFetch };
