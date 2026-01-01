interface WishlistItem {
  productId: {
    _id: string;
    name: string;
    price: number;
    images: Array<{
      url: string;
      publicId: string;
    }>;
    categoryId: {
      _id: string;
      name: string;
    };
    brandId: {
      _id: string;
      name: string;
    };
    isActive: boolean;
    stock: number;
  };
  addedAt: string;
}

interface Wishlist {
  userId: string;
  items: WishlistItem[];
  totalItems: number;
}

class WishlistService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  async getWishlist(): Promise<Wishlist> {
    const response = await fetch(`${this.baseUrl}/wishlist`, {
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

  async addToWishlist(productId: string): Promise<Wishlist> {
    const response = await fetch(`${this.baseUrl}/wishlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ productId })
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

  async removeFromWishlist(productId: string): Promise<Wishlist> {
    const response = await fetch(`${this.baseUrl}/wishlist/${productId}`, {
      method: 'DELETE',
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

export const wishlistService = new WishlistService();
