"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CartContextType {
  items: CartItem[];
  totalAmount: number;
  loading: boolean;
  activeOperations: Set<string>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  increaseQuantity: (productId: string, amount?: number) => Promise<void>;
  decreaseQuantity: (productId: string, amount?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeOperations, setActiveOperations] = useState<Set<string>>(new Set());

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    // Load cart from localStorage on mount
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        try {
          const cartData = JSON.parse(storedCart);
          setItems(cartData);
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      }
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items]);

  const addToCart = async (productId: string, quantity: number) => {
    const operationId = `add-${productId}`;
    setActiveOperations(prev => new Set(prev).add(operationId));

    try {
      setLoading(true);

      // Mock product data - in real app, fetch from API
      const mockProduct = {
        id: productId,
        name: `Product ${productId}`,
        price: 100000,
        imageUrl: `https://picsum.photos/200/200?random=${productId}`
      };

      setItems(prev => {
        const existingItem = prev.find(item => item.productId === productId);
        if (existingItem) {
          return prev.map(item =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          return [...prev, {
            id: `${productId}-${Date.now()}`,
            productId,
            name: mockProduct.name,
            price: mockProduct.price,
            quantity,
            imageUrl: mockProduct.imageUrl
          }];
        }
      });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setActiveOperations(prev => {
        const newSet = new Set(prev);
        newSet.delete(operationId);
        return newSet;
      });
      setLoading(false);
    }
  };

  const increaseQuantity = async (productId: string, amount: number = 1) => {
    const operationId = `increase-${productId}`;
    setActiveOperations(prev => new Set(prev).add(operationId));

    try {
      setItems(prev =>
        prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
      );
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error('Error increasing quantity:', error);
    } finally {
      setActiveOperations(prev => {
        const newSet = new Set(prev);
        newSet.delete(operationId);
        return newSet;
      });
    }
  };

  const decreaseQuantity = async (productId: string, amount: number = 1) => {
    const operationId = `decrease-${productId}`;
    setActiveOperations(prev => new Set(prev).add(operationId));

    try {
      setItems(prev =>
        prev.map(item =>
          item.productId === productId && item.quantity > 1
            ? { ...item, quantity: Math.max(1, item.quantity - amount) }
            : item
        )
      );
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error('Error decreasing quantity:', error);
    } finally {
      setActiveOperations(prev => {
        const newSet = new Set(prev);
        newSet.delete(operationId);
        return newSet;
      });
    }
  };

  const removeItem = async (productId: string) => {
    const operationId = `remove-${productId}`;
    setActiveOperations(prev => new Set(prev).add(operationId));

    try {
      setItems(prev => prev.filter(item => item.productId !== productId));
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setActiveOperations(prev => {
        const newSet = new Set(prev);
        newSet.delete(operationId);
        return newSet;
      });
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemQuantity = (productId: string) => {
    const item = items.find(item => item.productId === productId);
    return item?.quantity || 0;
  };

  const value: CartContextType = {
    items,
    totalAmount,
    loading,
    activeOperations,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
    getItemQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
