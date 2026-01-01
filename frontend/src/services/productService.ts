import type { Product, Category } from "../types/product";

class ProductService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  async getAllProducts(): Promise<Product[]> {
    const response = await fetch(`${this.baseUrl}/products`);
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorMessage = `API request failed: ${response.status} ${response.statusText}`;

      // Try to get error details if response is JSON
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          errorMessage += ` - ${errorData.message || errorData.error || 'Unknown error'}`;
        } catch (e) {
          // Ignore JSON parsing errors for error responses
        }
      } else {
        // For non-JSON responses (like HTML error pages), try to get some content
        try {
          const text = await response.text();
          if (text.length < 200) { // Only include short error messages
            errorMessage += ` - ${text.substring(0, 100)}...`;
          }
        } catch (e) {
          // Ignore text parsing errors
        }
      }

      throw new Error(errorMessage);
    }
    const data = await response.json();
    return data.products || data.data?.products || [];
  }

  async getProductById(id: string): Promise<Product | null> {
    const response = await fetch(`${this.baseUrl}/products/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.product || data.data || null;
  }

  async getProductsByCategoryName(categoryName: string, limit?: number): Promise<Product[]> {
    const url = `${this.baseUrl}/products?category=${encodeURIComponent(categoryName)}${limit ? `&limit=${limit}` : ""}`;
    const response = await fetch(url);
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorMessage = `API request failed: ${response.status} ${response.statusText}`;

      // Try to get error details if response is JSON
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          errorMessage += ` - ${errorData.message || errorData.error || 'Unknown error'}`;
        } catch (e) {
          // Ignore JSON parsing errors for error responses
        }
      } else {
        // For non-JSON responses (like HTML error pages), try to get some content
        try {
          const text = await response.text();
          if (text.length < 200) { // Only include short error messages
            errorMessage += ` - ${text.substring(0, 100)}...`;
          }
        } catch (e) {
          // Ignore text parsing errors
        }
      }

      throw new Error(errorMessage);
    }
    const data = await response.json();
    return data.products || data.data?.products || [];
  }

  async getTopSellingProducts(limit: number = 8): Promise<Product[]> {
    const response = await fetch(`${this.baseUrl}/products?sortBy=createdAt&sortOrder=desc&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return (data.products || data.data?.products || []).slice(0, limit);
  }

  async getNewProducts(limit: number = 8): Promise<{ laptops: Product[]; pcs: Product[]; accessories: Product[] }> {
    const response = await fetch(`${this.baseUrl}/products?sortBy=createdAt&sortOrder=desc&limit=${limit * 3}`);
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorMessage = `API request failed: ${response.status} ${response.statusText}`;

      // Try to get error details if response is JSON
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          errorMessage += ` - ${errorData.message || errorData.error || 'Unknown error'}`;
        } catch (e) {
          // Ignore JSON parsing errors for error responses
        }
      } else {
        // For non-JSON responses (like HTML error pages), try to get some content
        try {
          const text = await response.text();
          if (text.length < 200) { // Only include short error messages
            errorMessage += ` - ${text.substring(0, 100)}...`;
          }
        } catch (e) {
          // Ignore text parsing errors
        }
      }

      throw new Error(errorMessage);
    }
    const data = await response.json();
    const products = data.products || data.data?.products || [];
    return this.categorizeProducts(products.slice(0, limit * 3));
  }

  private categorizeProducts(products: Product[]): { laptops: Product[]; pcs: Product[]; accessories: Product[] } {
    const categorized = {
      laptops: [] as Product[],
      pcs: [] as Product[],
      accessories: [] as Product[]
    };

    products.forEach(product => {
      const category = product.category?.toLowerCase() || String(product.categoryId || '').toLowerCase();
      if (category?.includes('laptop')) {
        categorized.laptops.push(product);
      } else if (category?.includes('pc') || category?.includes('desktop')) {
        categorized.pcs.push(product);
      } else {
        categorized.accessories.push(product);
      }
    });

    return categorized;
  }

  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${this.baseUrl}/products/categories`);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.categories || data.data?.categories || [];
  }
}

export const productService = new ProductService();