import type { Product, Category } from "../types/product";

class ProductService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  private normalizeProduct(product: any) {
    if (!product || typeof product !== 'object') return product;

    const id = product.id || product._id || (product._id && String(product._id)) || undefined;
    const images = product.images || (product.image ? (Array.isArray(product.image) ? product.image : [{ url: product.image }]) : []);
    const name = product.name || product.title || '';
    const price = typeof product.price === 'number' ? product.price : (product.price ? Number(product.price) : 0);
    const originalPrice = product.originalPrice || product.oldPrice || 0;
    const stock = typeof product.stock === 'number' ? product.stock : (product.stock ? parseInt(product.stock, 10) || 0 : 0);
    const category = (product.category && (typeof product.category === 'string' ? product.category : product.category.name)) || (product.categoryId && (typeof product.categoryId === 'string' ? product.categoryId : product.categoryId.name)) || '';

    return {
      ...product,
      id,
      images,
      name,
      price,
      originalPrice,
      stock,
      category
    };
  }

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
    const raw = data.products || data.data?.products || [];
    return Array.isArray(raw) ? raw.map((p: any) => this.normalizeProduct(p)) : [];
  }

  async getProductById(id: string): Promise<Product | null> {
    const url = `${this.baseUrl}/products/${id}`;
    try {
      // log for easier debugging in dev console
      if (typeof window !== 'undefined' && (window as any).console) {
        console.debug(`[ProductService] fetching product by id: ${id}`, { url });
      }

      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) return null;
        const text = await response.text().catch(() => '');
        throw new Error(`API request failed: ${response.status} ${response.statusText}${text ? ` - ${text.slice(0, 200)}` : ''}`);
      }

      const data = await response.json().catch((e) => {
        throw new Error(`Failed to parse JSON from ${url}: ${e?.message || e}`);
      });

      // Normalize product before returning
      const product = data || null;
      return product ? (this.normalizeProduct(product) as Product) : null;
    } catch (err: any) {
      // Network errors (e.g. failed to fetch / CORS / server down) surface as TypeError
      const message = err?.message || String(err);
      // Attach the URL to make debugging easier
      const enriched = new Error(`[ProductService] Failed to fetch ${url} — ${message}`);
      // preserve original stack if present
      if (err?.stack) enriched.stack = `${enriched.stack}\nCaused by: ${err.stack}`;
      throw enriched;
    }
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
    const raw = data.products || data.data?.products || [];
    return Array.isArray(raw) ? raw.map((p: any) => this.normalizeProduct(p)) : [];
  }

  async getTopSellingProducts(limit: number = 8): Promise<Product[]> {
    const response = await fetch(`${this.baseUrl}/products?sortBy=createdAt&sortOrder=desc&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    const raw = data.products || data.data?.products || [];
    const arr = Array.isArray(raw) ? raw.map((p: any) => this.normalizeProduct(p)) : [];
    return arr.slice(0, limit);
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
    const normalized = Array.isArray(products) ? products.map((p: any) => this.normalizeProduct(p)) : [];
    return this.categorizeProducts(normalized.slice(0, limit * 3));
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