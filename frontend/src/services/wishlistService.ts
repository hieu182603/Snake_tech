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
  private api = new (await import('@/lib/api')).ApiClient();

  async getWishlist(): Promise<Wishlist> {
    const result = await this.api.get<Wishlist>('/wishlist');
    if (!result.success) {
      throw new Error(result.error || 'Failed to get wishlist');
    }
    return result.data!;
  }

  async addToWishlist(productId: string): Promise<Wishlist> {
    const result = await this.api.post<Wishlist>('/wishlist', { productId });
    if (!result.success) {
      throw new Error(result.error || 'Failed to add to wishlist');
    }
    return result.data!;
  }

  async removeFromWishlist(productId: string): Promise<Wishlist> {
    const result = await this.api.delete<Wishlist>(`/wishlist/${productId}`);
    if (!result.success) {
      throw new Error(result.error || 'Failed to remove from wishlist');
    }
    return result.data!;
  }
}

export const wishlistService = new WishlistService();
