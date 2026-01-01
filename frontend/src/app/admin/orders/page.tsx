'use client'

import React, { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ShoppingCart,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Package
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuth } from '@/contexts/AuthContext'

interface Order {
  id: string
  code: string
  accountId: string
  total: number
  status: 'PENDING' | 'CONFIRMED' | 'PACKING' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED' | 'RETURNED'
  createdAt: string
  customerName?: string
  customerEmail?: string
}

export default function AdminOrdersPage() {
  const { t } = useTranslation()
  const { accessToken, user, isAuthenticated } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  const isAuthorized = isAuthenticated() && user && ['ADMIN', 'STAFF'].includes(user.role)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

      // Check if user is authenticated and has admin/staff role
      if (!isAuthenticated() || !user || !['ADMIN', 'STAFF'].includes(user.role)) {
        console.log('User not authenticated or not admin/staff:', { isAuthenticated: isAuthenticated(), user })
        // Don't throw error, just return early - the page will show auth message
        setOrders([])
        return
      }

      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
        },
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Load orders error:', error)
      // Mock data for now
      setOrders([
        {
          id: '1',
          code: 'ORD-001',
          accountId: 'user1',
          total: 25000000,
          status: 'PENDING',
          createdAt: '2024-01-15',
          customerName: 'Nguyễn Văn A',
          customerEmail: 'customer@example.com'
        },
        {
          id: '2',
          code: 'ORD-002',
          accountId: 'user2',
          total: 1200000,
          status: 'SHIPPING',
          createdAt: '2024-01-14',
          customerName: 'Trần Thị B',
          customerEmail: 'customer2@example.com'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (order.customerEmail && order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800'
      case 'PACKING': return 'bg-purple-100 text-purple-800'
      case 'SHIPPING': return 'bg-orange-100 text-orange-800'
      case 'DELIVERED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      case 'RETURNED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Chờ xử lý'
      case 'CONFIRMED': return 'Đã xác nhận'
      case 'PACKING': return 'Đang đóng gói'
      case 'SHIPPING': return 'Đang giao hàng'
      case 'DELIVERED': return 'Đã giao'
      case 'CANCELLED': return 'Đã hủy'
      case 'RETURNED': return 'Đã trả hàng'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-4 w-4" />
      case 'CONFIRMED': return <CheckCircle className="h-4 w-4" />
      case 'PACKING': return <Package className="h-4 w-4" />
      case 'SHIPPING': return <Truck className="h-4 w-4" />
      case 'DELIVERED': return <CheckCircle className="h-4 w-4" />
      case 'CANCELLED': return <XCircle className="h-4 w-4" />
      case 'RETURNED': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">{t('admin.orders.title')}</h1>
          <p className="text-slate-400 text-sm mt-1">
            {t('admin.orders.subtitle')}
          </p>
        </div>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder={t('admin.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="ALL">{t('common.all')}</option>
            <option value="PENDING">{t('order.status.pending')}</option>
            <option value="CONFIRMED">{t('order.status.confirmed')}</option>
            <option value="PACKING">{t('order.status.packing')}</option>
            <option value="SHIPPING">{t('order.status.shipping')}</option>
            <option value="DELIVERED">{t('order.status.delivered')}</option>
            <option value="CANCELLED">{t('order.status.cancelled')}</option>
            <option value="RETURNED">{t('order.status.returned')}</option>
          </select>
        </div>

        {!isAuthorized ? (
          <div className="text-center py-20">
            <ShoppingCart className="mx-auto h-24 w-24 text-slate-400 mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Yêu cầu quyền truy cập
            </h2>
            <p className="text-slate-400 mb-6">
              Bạn cần đăng nhập với tài khoản Admin hoặc Staff để truy cập trang này.
            </p>
            <button
              onClick={() => window.location.href = '/auth'}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
            >
              Đăng nhập
            </button>
          </div>
        ) : (
          <>
            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-surface-dark border border-border-dark p-6 rounded-2xl hover:border-primary/30 transition-all group">
                  <div className="p-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <ShoppingCart className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-white">{order.code}</h3>
                          <p className="text-sm text-slate-400">
                            {order.customerName} • {order.customerEmail}
                          </p>
                          <p className="text-sm text-slate-400">
                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-2xl font-black text-white">
                            {order.total.toLocaleString()}đ
                          </p>
                        </div>

                        <Badge className={getStatusBadgeColor(order.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            {getStatusDisplayName(order.status)}
                          </div>
                        </Badge>

                        <Button variant="outline" size="sm">
                          {t('common.details')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {t('order.noOrders')}
                </h3>
                <p className="text-muted-foreground">
                  {t('admin.tryDifferentSearch', { defaultValue: 'Thử tìm kiếm với từ khóa khác' })}
                </p>
              </div>
            )}
          </>
        )}
    </div>
  )
}