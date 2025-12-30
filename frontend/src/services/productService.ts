import type { Product, Category } from "../types/product";

class ProductService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}/products`);

      // Check if the response is ok
      if (!response.ok) {
        console.warn(`API endpoint not available (status: ${response.status}). Returning mock data.`);
        return this.getMockAllProducts();
      }

      const data = await response.json();
      return data.products || data.data?.products || [];
    } catch (error) {
      console.warn("Backend not available. Returning mock data for all products:", error);
      return this.getMockAllProducts();
    }
  }

  // Mock data method for all products when backend is not available
  private getMockAllProducts(): Product[] {
    return [
      {
        id: "1",
        _id: "1",
        name: "Gaming Laptop Pro RTX 4060",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
        slug: "gaming-laptop-pro-rtx-4060",
        price: 2599000,
        description: "Laptop gaming cao cấp với card đồ họa RTX 4060, CPU Intel i7, RAM 16GB DDR5",
        stock: 15,
        categoryId: "laptops",
        category: {
          id: "laptops",
          name: "Laptops",
          slug: "laptops"
        },
        images: [{ id: "1", url: "/api/placeholder/300/300" }]
      },
      {
        id: "2",
        _id: "2",
        name: "Gaming Laptop Ultra RTX 4070",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
        slug: "gaming-laptop-ultra-rtx-4070",
        price: 3299000,
        description: "Laptop gaming đỉnh cao với RTX 4070 và màn hình 165Hz QHD",
        stock: 8,
        categoryId: "laptops",
        category: {
          id: "laptops",
          name: "Laptops",
          slug: "laptops"
        },
        images: [{ id: "2", url: "/api/placeholder/300/300" }]
      },
      {
        id: "3",
        _id: "3",
        name: "PC Gaming RGB Setup",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
        slug: "pc-gaming-rgb-setup",
        price: 1899000,
        description: "PC gaming hoàn chỉnh với RGB lighting, RTX 4060 Ti, i5 12400F",
        stock: 12,
        categoryId: "pcs",
        category: {
          id: "pcs",
          name: "Gaming PCs",
          slug: "pcs"
        },
        images: [{ id: "3", url: "/api/placeholder/300/300" }]
      },
      {
        id: "4",
        _id: "4",
        name: "Mechanical Keyboard RGB",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
        slug: "mechanical-keyboard-rgb",
        price: 149000,
        description: "Bàn phím cơ RGB với switch Blue, hot-swappable, PBT keycaps",
        stock: 25,
        categoryId: "accessories",
        category: {
          id: "accessories",
          name: "Accessories",
          slug: "accessories"
        },
        images: [{ id: "4", url: "/api/placeholder/300/300" }]
      },
      {
        id: "5",
        _id: "5",
        name: "Gaming Mouse Wireless",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
        slug: "gaming-mouse-wireless",
        price: 79000,
        description: "Chuột gaming không dây với DPI lên đến 16000, RGB lighting",
        stock: 30,
        categoryId: "accessories",
        category: {
          id: "accessories",
          name: "Accessories",
          slug: "accessories"
        },
        images: [{ id: "5", url: "/api/placeholder/300/300" }]
      },
      {
        id: "6",
        _id: "6",
        name: "Gaming Monitor 27inch 144Hz",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
        slug: "gaming-monitor-27inch-144hz",
        price: 349000,
        description: "Màn hình gaming 27inch với tần số quét 144Hz, IPS panel, 1ms response time",
        stock: 18,
        categoryId: "monitors",
        category: {
          id: "monitors",
          name: "Monitors",
          slug: "monitors"
        },
        images: [{ id: "6", url: "/api/placeholder/300/300" }]
      }
    ];
  }

  async getProductsByCategoryName(categoryName: string, limit?: number): Promise<Product[]> {
    try {
      const url = `${this.baseUrl}/products/category-name/${categoryName}${limit ? `?limit=${limit}` : ""}`;
      const response = await fetch(url);

      // Check if the response is ok
      if (!response.ok) {
        console.warn(`API endpoint not available (status: ${response.status}). Returning mock data for category: ${categoryName}.`);
        return this.getMockProductsByCategory(categoryName, limit);
      }

      const data = await response.json();
      return data.products || data.data?.products || [];
    } catch (error) {
      console.warn("Backend not available. Returning mock data for category:", categoryName, error);
      return this.getMockProductsByCategory(categoryName, limit);
    }
  }

  // Mock data method for when backend is not available
  private getMockProductsByCategory(categoryName: string, limit?: number): Product[] {
    // Normalize category name for matching
    const normalizedCategory = categoryName.toLowerCase();

    let mockProducts: Product[] = [];

    // Generate different products based on category
    if (normalizedCategory.includes('laptop') || normalizedCategory.includes('pc')) {
      mockProducts = [
        {
          id: "1",
          name: "Gaming Laptop Pro RTX 4060",
          price: 2599000,
          originalPrice: 2999000,
          images: ["/api/placeholder/300/300"],
          category: "laptops",
          rating: 4.8,
          reviews: 124,
          inStock: true,
          description: "Laptop gaming cao cấp với card đồ họa RTX 4060"
        },
        {
          id: "2",
          name: "Gaming Laptop Ultra RTX 4070",
          price: 3299000,
          originalPrice: 3699000,
          images: ["/api/placeholder/300/300"],
          category: "laptops",
          rating: 4.9,
          reviews: 89,
          inStock: true,
          description: "Laptop gaming đỉnh cao với RTX 4070 và màn hình 165Hz"
        },
        {
          id: "3",
          name: "PC Gaming RGB Setup",
          price: 1899000,
          originalPrice: 2199000,
          images: ["/api/placeholder/300/300"],
          category: "pcs",
          rating: 4.7,
          reviews: 156,
          inStock: true,
          description: "PC gaming hoàn chỉnh với RGB lighting"
        }
      ];
    } else if (normalizedCategory.includes('accessories') || normalizedCategory.includes('phụ kiện')) {
      mockProducts = [
        {
          id: "4",
          name: "Mechanical Keyboard RGB",
          price: 149000,
          originalPrice: 179000,
          images: ["/api/placeholder/300/300"],
          category: "accessories",
          rating: 4.6,
          reviews: 203,
          inStock: true,
          description: "Bàn phím cơ RGB với switch Blue"
        },
        {
          id: "5",
          name: "Gaming Mouse Wireless",
          price: 79000,
          originalPrice: 99000,
          images: ["/api/placeholder/300/300"],
          category: "accessories",
          rating: 4.7,
          reviews: 312,
          inStock: true,
          description: "Chuột gaming không dây với DPI lên đến 16000"
        },
        {
          id: "6",
          name: "Gaming Headset RGB",
          price: 129000,
          originalPrice: 159000,
          images: ["/api/placeholder/300/300"],
          category: "accessories",
          rating: 4.5,
          reviews: 178,
          inStock: true,
          description: "Tai nghe gaming với micro khử ồn và RGB"
        }
      ];
    } else {
      // Default products for any other category
      mockProducts = [
        {
          id: "7",
          name: "Gaming Monitor 27inch 144Hz",
          price: 349000,
          originalPrice: 399000,
          images: ["/api/placeholder/300/300"],
          category: categoryName,
          rating: 4.8,
          reviews: 95,
          inStock: true,
          description: "Màn hình gaming 27inch với tần số quét 144Hz"
        },
        {
          id: "8",
          name: "Gaming Chair Ergonomic",
          price: 129000,
          originalPrice: 159000,
          images: ["/api/placeholder/300/300"],
          category: categoryName,
          rating: 4.6,
          reviews: 67,
          inStock: true,
          description: "Ghế gaming ergonomic với đệm lưng và cổ"
        }
      ];
    }

    return limit ? mockProducts.slice(0, limit) : mockProducts;
  }

  async getTopSellingProducts(limit: number = 8): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}/products/top-selling?limit=${limit}`);

      // Check if the response is ok
      if (!response.ok) {
        console.warn(`API endpoint not available (status: ${response.status}). Returning mock data.`);
        return this.getMockTopSellingProducts(limit);
      }

      const data = await response.json();
      return data.products || data.data?.products || [];
    } catch (error) {
      console.warn("Backend not available. Returning mock data for top selling products:", error);
      return this.getMockTopSellingProducts(limit);
    }
  }

  // Mock data method for when backend is not available
  private getMockTopSellingProducts(limit: number): Product[] {
    return [
      {
        id: "1",
        name: "Gaming Laptop Pro",
        price: 1299.99,
        originalPrice: 1499.99,
        images: ["/api/placeholder/300/300"],
        category: "laptops",
        rating: 4.8,
        reviews: 124,
        inStock: true,
        description: "High-performance gaming laptop with latest RTX graphics"
      },
      {
        id: "2",
        name: "Mechanical Keyboard RGB",
        price: 149.99,
        originalPrice: 179.99,
        images: ["/api/placeholder/300/300"],
        category: "accessories",
        rating: 4.6,
        reviews: 89,
        inStock: true,
        description: "Premium mechanical keyboard with customizable RGB lighting"
      },
      {
        id: "3",
        name: "Wireless Gaming Mouse",
        price: 79.99,
        originalPrice: 99.99,
        images: ["/api/placeholder/300/300"],
        category: "accessories",
        rating: 4.7,
        reviews: 156,
        inStock: true,
        description: "Ergonomic wireless gaming mouse with precision sensor"
      }
    ].slice(0, limit);
  }

  async getNewProducts(limit: number = 8): Promise<{ laptops: Product[]; pcs: Product[]; accessories: Product[] }> {
    try {
      const response = await fetch(`${this.baseUrl}/products/new?limit=${limit}`);

      // Check if the response is ok
      if (!response.ok) {
        console.warn(`API endpoint not available (status: ${response.status}). Returning mock data.`);
        return this.getMockNewProducts(limit);
      }

      const data = await response.json();

      if (data.products || data.data?.products) {
        const products = data.products || data.data.products;
        // If API returns flat array, categorize the products
        if (Array.isArray(products)) {
          return this.categorizeProducts(products);
        }
        // If API returns categorized object, return as-is
        return products;
      }

      return { laptops: [], pcs: [], accessories: [] };
    } catch (error) {
      console.warn("Backend not available. Returning mock data for new products:", error);
      return this.getMockNewProducts(limit);
    }
  }

  // Mock data method for when backend is not available
  private getMockNewProducts(limit: number): { laptops: Product[]; pcs: Product[]; accessories: Product[] } {
    const mockProducts: Product[] = [
      {
        id: "1",
        name: "Gaming Laptop Pro",
        price: 1299.99,
        originalPrice: 1499.99,
        images: ["/api/placeholder/300/300"],
        category: "laptops",
        rating: 4.8,
        reviews: 124,
        inStock: true,
        description: "High-performance gaming laptop with latest RTX graphics"
      },
      {
        id: "2",
        name: "Desktop PC Ultimate",
        price: 1799.99,
        originalPrice: 1999.99,
        images: ["/api/placeholder/300/300"],
        category: "pcs",
        rating: 4.9,
        reviews: 89,
        inStock: true,
        description: "Powerful desktop PC for gaming and productivity"
      },
      {
        id: "3",
        name: "Mechanical Keyboard RGB",
        price: 149.99,
        originalPrice: 179.99,
        images: ["/api/placeholder/300/300"],
        category: "accessories",
        rating: 4.6,
        reviews: 156,
        inStock: true,
        description: "Premium mechanical keyboard with customizable RGB lighting"
      },
      {
        id: "4",
        name: "Wireless Gaming Mouse",
        price: 79.99,
        originalPrice: 99.99,
        images: ["/api/placeholder/300/300"],
        category: "accessories",
        rating: 4.7,
        reviews: 203,
        inStock: true,
        description: "Ergonomic wireless gaming mouse with precision sensor"
      }
    ].slice(0, limit);

    return this.categorizeProducts(mockProducts);
  }

  // Helper method to categorize products by type
  private categorizeProducts(products: Product[]): { laptops: Product[]; pcs: Product[]; accessories: Product[] } {
    const categorized = {
      laptops: [] as Product[],
      pcs: [] as Product[],
      accessories: [] as Product[]
    };

    products.forEach(product => {
      const category = product.category?.toLowerCase();
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
    try {
      const response = await fetch(`${this.baseUrl}/products/categories/all`);

      // Check if the response is ok
      if (!response.ok) {
        console.warn(`API endpoint not available (status: ${response.status}). Returning mock data.`);
        return this.getMockCategories();
      }

      const data = await response.json();
      return data.categories || data.data?.categories || [];
    } catch (error) {
      console.warn("Backend not available. Returning mock data for categories:", error);
      return this.getMockCategories();
    }
  }

  // Mock data method for categories when backend is not available
  private getMockCategories(): Category[] {
    return [
      {
        id: "laptops",
        name: "Laptops",
        slug: "laptops",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "pcs",
        name: "Gaming PCs",
        slug: "pcs",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "accessories",
        name: "Accessories",
        slug: "accessories",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "monitors",
        name: "Monitors",
        slug: "monitors",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "components",
        name: "Components",
        slug: "components",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "keyboards",
        name: "Keyboards",
        slug: "keyboards",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "mice",
        name: "Mice",
        slug: "mice",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "headsets",
        name: "Headsets",
        slug: "headsets",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }
}

export const productService = new ProductService();
