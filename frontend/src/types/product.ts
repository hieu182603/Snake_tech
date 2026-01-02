export interface ProductImage {
  id: string;
  url: string;
  originalName?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id?: string;
  _id?: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  slug: string;
  price: number;
  description: string;
  stock: number;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  images: ProductImage[];
  [key: string]: any;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  message: string;
  error?: string;
  [key: string]: any;
}

export interface LegacyApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error?: string;
}

export type ProductCategory =
  | 'laptop'
  | 'pc'
  | 'cpu'
  | 'ram'
  | 'drive'
  | 'monitor'
  | 'cooler'
  | 'psu'
  | 'case'
  | 'headset'
  | 'network-card';

export interface FilterState {
  categories: ProductCategory[];
  priceRange?: [number, number];
  brands?: string[];
  inStockOnly?: boolean;
  searchQuery?: string;
  sortOrder?: 'asc' | 'desc' | 'none';
}

// Dashboard Types
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  totalShippers: number;
  totalFeedbacks: number;
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
  orderStatusDistribution: { [key: string]: number };
  monthlyRevenue: MonthlyRevenue[];
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  itemsCount: number;
}

export interface TopProduct {
  id: string;
  name: string;
  price: number;
  totalSold: number;
  totalRevenue: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

// Analytics Types
export interface RevenueStats {
  period: 'day' | 'month' | 'year';
  data: RevenueDataPoint[];
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

// Notification Types
export enum NotificationType {
  ORDER_CREATED = 'order_created',
  ORDER_STATUS_UPDATED = 'order_status_updated',
  PAYMENT_RECEIVED = 'payment_received',
  LOW_STOCK_ALERT = 'low_stock_alert',
  NEW_CUSTOMER = 'new_customer',
  SHIPPER_ASSIGNED = 'shipper_assigned',
  SYSTEM_ALERT = 'system_alert',
  FEEDBACK_RECEIVED = 'feedback_received'
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived'
}

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  title: string;
  message: string;
  data: any;
  recipientId: string;
  isBroadcast: boolean;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  archived: number;
  byPriority: { [key in NotificationPriority]: number };
  byType: { [key in NotificationType]: number };
}

export interface CreateNotificationData {
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  data?: any;
  recipientId?: string;
  isBroadcast?: boolean;
  expiresAt?: string;
}

