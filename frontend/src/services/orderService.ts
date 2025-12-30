// Mock order service for Snake_tech
export const orderService = {
  getUserOrders: async () => {
    // Mock orders data
    const mockOrders = [
      {
        id: '#ORD-001',
        status: 'delivered',
        totalAmount: 3500000,
        createdAt: '2024-12-31T10:00:00Z',
        items: [
          { name: 'Gaming Laptop RTX 4070', quantity: 1, price: 3500000 }
        ]
      },
      {
        id: '#ORD-002',
        status: 'shipping',
        totalAmount: 1200000,
        createdAt: '2024-12-30T14:30:00Z',
        items: [
          { name: 'Mechanical Keyboard RGB', quantity: 2, price: 600000 }
        ]
      }
    ];
    return { data: mockOrders };
  },

  getOrderById: async (orderId: string) => {
    // Mock single order detail
    const mockOrder = {
      id: orderId,
      status: 'delivered',
      totalAmount: 3500000,
      createdAt: '2024-12-31T10:00:00Z',
      shippingAddress: {
        name: 'Nguyễn Văn A',
        phone: '0901234567',
        address: '123 Đường ABC, Quận 1, TP.HCM'
      },
      items: [
        {
          id: '1',
          name: 'Gaming Laptop RTX 4070',
          quantity: 1,
          price: 3500000,
          imageUrl: 'https://picsum.photos/200/200?random=1'
        }
      ]
    };
    return { data: mockOrder };
  },

  createOrder: async (orderData: any) => {
    // Mock order creation
    const newOrder = {
      id: `#ORD-${Date.now()}`,
      ...orderData,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    return { data: newOrder };
  },

  trackOrder: async (orderId: string) => {
    // Mock tracking data
    const trackingData = {
      orderId,
      status: 'shipping',
      trackingNumber: 'VN123456789',
      estimatedDelivery: '2025-01-05',
      updates: [
        { status: 'confirmed', date: '2024-12-31T10:00:00Z', message: 'Đơn hàng đã được xác nhận' },
        { status: 'processing', date: '2024-12-31T14:00:00Z', message: 'Đơn hàng đang được xử lý' },
        { status: 'shipping', date: '2025-01-01T09:00:00Z', message: 'Đơn hàng đang được giao' }
      ]
    };
    return { data: trackingData };
  }
};
