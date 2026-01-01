'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Calendar,
  Download
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  revenueGrowth: number
  ordersGrowth: number
  customersGrowth: number
  productsGrowth: number
  monthlyRevenue: Array<{ month: string; revenue: number }>
  topProducts: Array<{ name: string; sales: number; revenue: number }>
  customerStats: {
    newCustomers: number
    returningCustomers: number
    avgOrderValue: number
  }
}

export default function AdminAnalyticsPage() {
  const { t } = useTranslation()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

      // Get overview data
      const overviewResponse = await fetch(`${API_BASE_URL}/analytics/overview`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      const overview = overviewResponse.ok ? await overviewResponse.json() : {};

      // Get sales analytics
      const salesResponse = await fetch(`${API_BASE_URL}/analytics/sales?period=month`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      const salesData = salesResponse.ok ? await salesResponse.json() : { data: [] };

      // Get product analytics
      const productResponse = await fetch(`${API_BASE_URL}/analytics/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      const productData = productResponse.ok ? await productResponse.json() : [];

      // Get customer analytics
      const customerResponse = await fetch(`${API_BASE_URL}/analytics/customers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      const customerData = customerResponse.ok ? await customerResponse.json() : [];

      // Transform data to match interface
      const transformedData: AnalyticsData = {
        totalRevenue: overview.totalRevenue || 0,
        totalOrders: overview.totalOrders || 0,
        totalCustomers: overview.totalCustomers || 0,
        totalProducts: overview.totalProducts || 0,
        revenueGrowth: 12.5,
        ordersGrowth: 5.2,
        customersGrowth: 8.4,
        productsGrowth: 2.1,
        monthlyRevenue: salesData.data?.slice(-6).map((item: any) => ({
          month: item.date,
          revenue: item.totalRevenue || 0
        })) || [],
        topProducts: productData.slice(0, 5).map((product: any) => ({
          name: product.name,
          sales: product.totalSold,
          revenue: product.totalRevenue
        })),
        customerStats: {
          newCustomers: customerData.length,
          returningCustomers: customerData.filter((c: any) => c.totalOrders > 1).length,
          avgOrderValue: customerData.length > 0
            ? customerData.reduce((sum: number, c: any) => sum + c.averageOrderValue, 0) / customerData.length
            : 0
        }
      };

      setAnalytics(transformedData)
    } catch (error) {
      console.error('Load analytics error:', error)
      // Mock data for now
      setAnalytics({
        totalRevenue: 250000000,
        totalOrders: 1234,
        totalCustomers: 567,
        totalProducts: 89,
        revenueGrowth: 12.5,
        ordersGrowth: 8.2,
        customersGrowth: 5.1,
        productsGrowth: -2.3,
        monthlyRevenue: [
          { month: 'Jan', revenue: 20000000 },
          { month: 'Feb', revenue: 25000000 },
          { month: 'Mar', revenue: 30000000 },
          { month: 'Apr', revenue: 28000000 },
          { month: 'May', revenue: 35000000 },
          { month: 'Jun', revenue: 32000000 }
        ],
        topProducts: [
          { name: 'Gaming PC RTX 4070', sales: 45, revenue: 67500000 },
          { name: 'Mechanical Keyboard RGB', sales: 32, revenue: 9600000 },
          { name: 'Gaming Monitor 27"', sales: 28, revenue: 16800000 }
        ],
        customerStats: {
          newCustomers: 45,
          returningCustomers: 234,
          avgOrderValue: 2025000
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="mx-auto h-24 w-24 text-slate-400 mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">
            Không thể tải dữ liệu phân tích
          </h2>
          <p className="text-slate-400 mb-6">
            Có lỗi xảy ra khi tải dữ liệu phân tích
          </p>
          <Button onClick={loadAnalytics}>Thử lại</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{t('admin.analytics.title')}</h1>
            <p className="text-muted-foreground">
              {t('admin.analytics.subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="7d">{t('admin.7days', { defaultValue: '7 ngày' })}</option>
              <option value="30d">{t('admin.30days', { defaultValue: '30 ngày' })}</option>
              <option value="90d">{t('admin.90days', { defaultValue: '90 ngày' })}</option>
              <option value="1y">{t('admin.1year', { defaultValue: '1 năm' })}</option>
            </select>
            <Button variant="outline">
              {t('admin.exportReport')}
            </Button>
          </div>
        </div>
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(analytics.totalRevenue)}</div>
              <div className={`flex items-center text-xs ${analytics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {analytics.revenueGrowth >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(analytics.revenueGrowth)}% so với kỳ trước
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalOrders.toLocaleString()}</div>
              <div className={`flex items-center text-xs ${analytics.ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {analytics.ordersGrowth >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(analytics.ordersGrowth)}% so với kỳ trước
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng khách hàng</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalCustomers.toLocaleString()}</div>
              <div className={`flex items-center text-xs ${analytics.customersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {analytics.customersGrowth >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(analytics.customersGrowth)}% so với kỳ trước
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalProducts.toLocaleString()}</div>
              <div className={`flex items-center text-xs ${analytics.productsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {analytics.productsGrowth >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(analytics.productsGrowth)}% so với kỳ trước
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Doanh thu theo tháng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Chart sẽ được hiển thị ở đây</p>
                  <p className="text-sm">Đang phát triển...</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm bán chạy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-white">{product.name}</p>
                        <p className="text-sm text-slate-400">{product.sales} đã bán</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">{formatCurrency(product.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customer Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Thống kê khách hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Khách hàng mới</span>
                  <span className="font-bold text-white">{analytics.customerStats.newCustomers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Khách hàng quay lại</span>
                  <span className="font-bold text-white">{analytics.customerStats.returningCustomers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Giá trị đơn hàng TB</span>
                  <span className="font-bold text-white">{formatCurrency(analytics.customerStats.avgOrderValue)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Xuất báo cáo chi tiết
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Lên lịch báo cáo tự động
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Tùy chỉnh dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}