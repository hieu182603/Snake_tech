/**
 * @deprecated This service has been removed. Use direct API calls instead.
 * All mock data has been removed to force migration to proper API calls.
 */
export const orderService = {
  getUserOrders: async () => {
    throw new Error('orderService has been deprecated. Use direct API calls to /api/orders/my-orders instead.');
  },

  getOrderById: async (orderId: string) => {
    throw new Error('orderService has been deprecated. Use direct API calls to /api/orders/:id instead.');
  },

  createOrder: async (orderData: any) => {
    throw new Error('orderService has been deprecated. Use direct API calls to /api/orders instead.');
  },

  trackOrder: async (orderId: string) => {
    throw new Error('orderService has been deprecated. Use direct API calls to /api/orders/:id/tracking instead.');
  }
};
