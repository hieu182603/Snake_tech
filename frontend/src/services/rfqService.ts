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
  private api = new (await import('@/lib/api')).ApiClient();

  async createRFQ(rfqData: CreateRFQData): Promise<{ success: boolean; rfqId: string; message: string }> {
    const result = await this.api.post<{ success: boolean; rfqId: string; message: string }>('/rfq', rfqData);
    if (!result.success) {
      throw new Error(result.error || 'Failed to create RFQ');
    }
    return result.data!;
  }

  async getMyRFQs(page: number = 1, limit: number = 10): Promise<RFQsResponse> {
    const result = await this.api.get<RFQsResponse>('/rfq/my', { page, limit });
    if (!result.success) {
      throw new Error(result.error || 'Failed to get RFQs');
    }
    return result.data!;
  }

  async getRFQById(rfqId: string): Promise<RFQ> {
    const result = await this.api.get<RFQ>(`/rfq/${rfqId}`);
    if (!result.success) {
      throw new Error(result.error || 'Failed to get RFQ');
    }
    return result.data!;
  }
}

export const rfqService = new RFQService();
