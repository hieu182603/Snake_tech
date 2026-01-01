interface RFQItem {
  productId?: string;
  productName?: string;
  specs?: Record<string, any>;
  qty: number;
}

interface RFQCustomer {
  name: string;
  email?: string;
  phone: string;
}

interface CreateRFQData {
  items: RFQItem[];
  customer: RFQCustomer;
  type?: 'CUSTOM_PC' | 'BULK_ORDER' | 'SPECIAL_PRODUCT';
  title: string;
  description: string;
  expectedBudget?: number;
  total: number;
}

interface RFQ {
  _id: string;
  code: string;
  accountId: string;
  type: string;
  title: string;
  description: string;
  items: RFQItem[];
  attachments: string[];
  expectedBudget?: number;
  status: string;
  quotation?: any;
  relatedOrderId?: string;
  createdAt: string;
  updatedAt: string;
}

interface RFQsResponse {
  rfqs: RFQ[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class RFQService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  async createRFQ(rfqData: CreateRFQData): Promise<{ success: boolean; rfqId: string; message: string }> {
    const response = await fetch(`${this.baseUrl}/rfq`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(rfqData)
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
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

    return await response.json();
  }

  async getMyRFQs(page: number = 1, limit: number = 10): Promise<RFQsResponse> {
    const response = await fetch(`${this.baseUrl}/rfq/my?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
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

    return await response.json();
  }

  async getRFQById(rfqId: string): Promise<RFQ> {
    const response = await fetch(`${this.baseUrl}/rfq/${rfqId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
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

    return await response.json();
  }
}

export const rfqService = new RFQService();
