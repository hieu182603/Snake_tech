'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  ShoppingCart,
  Package,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { AccountRole } from '@/constants/roles'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Mock data - in real app this would come from API
  const stats = [
    {
      title: 'Tổng đơn hàng',
      value: '1,234',
      change: '+12.5%',
      changeType: 'positive',
      icon: ShoppingCart,
      color: 'text-blue-600'
    },
    {
      title: 'Doanh thu',
      value: '89.2M',
      change: '+8.2%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Khách hàng',
      value: '567',
      change: '+5.1%',
      changeType: 'positive',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Sản phẩm',
      value: '89',
      change: '+2.3%',
      changeType: 'positive',
      icon: Package,
      color: 'text-orange-600'
    }
  ]

  const recentOrders = [
    { id: '#1234', customer: 'Nguyễn Văn A', amount: '2.5M', status: 'completed', date: '2024-01-15' },
    { id: '#1235', customer: 'Trần Thị B', amount: '1.8M', status: 'processing', date: '2024-01-15' },
    { id: '#1236', customer: 'Lê Văn C', amount: '3.2M', status: 'pending', date: '2024-01-14' },
    { id: '#1237', customer: 'Phạm Thị D', amount: '950K', status: 'completed', date: '2024-01-14' }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">Đang xử lý</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ xử lý</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      logout()
    } catch (error) {
      console.error('Logout failed:', error)
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-foreground">Snake Tech Admin</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{user?.name}</p>
                  <Badge className="bg-red-100 text-red-800">
                    {user?.role === AccountRole.ADMIN ? 'Quản trị viên' : 'Nhân viên'}
                  </Badge>
                </div>
                <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-primary-foreground">
            <h2 className="text-2xl font-bold mb-2">
              Chào mừng, {user?.name}!
            </h2>
            <p className="text-primary-foreground/80">
              Đây là bảng điều khiển quản trị của Snake Tech. Theo dõi hiệu suất và quản lý cửa hàng của bạn.
            </p>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Link href="/admin/products">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-medium">Quản lý sản phẩm</h3>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/orders">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-medium">Đơn hàng</h3>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/customers">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-medium">Khách hàng</h3>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/analytics">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-medium">Thống kê</h3>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} so với tháng trước
                </p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Recent Orders & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Đơn hàng gần đây</CardTitle>
                <CardDescription>
                  Các đơn hàng được đặt gần nhất
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.customer}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{order.amount}</p>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Xem tất cả đơn hàng
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Trạng thái hệ thống</CardTitle>
                <CardDescription>
                  Giám sát hoạt động của hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Server Status</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Database</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Kết nối tốt</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                    <span>Backup</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Lên lịch</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                    <span>Disk Space</span>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">78% used</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
