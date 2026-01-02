'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Mail,
  Phone,
  ShoppingBag,
  DollarSign
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuth } from '@/contexts/AuthContext'

interface Customer {
  id: string
  username: string
  email: string
  fullName: string
  phone?: string
  isActive: boolean
  isVerified: boolean
  createdAt: string
  totalOrders?: number
  totalSpent?: number
  lastOrderDate?: string
}

export default function AdminCustomersPage() {
  const { t } = useTranslation()
  const { accessToken } = useAuth()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCustomers, setTotalCustomers] = useState(0)
  const itemsPerPage = 10

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

      const response = await fetch(`${API_BASE_URL}/admin/customers?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`, {
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
      setCustomers(data.customers || [])
      setTotalPages(data.pagination?.pages || 1)
      setTotalCustomers(data.pagination?.total || 0)
    } catch (error) {
      console.error('Load customers error:', error)
      // Mock data for now
      setCustomers([
        {
          id: '1',
          username: 'customer1',
          email: 'customer1@example.com',
          fullName: 'Nguyễn Văn A',
          phone: '0123456789',
          isActive: true,
          isVerified: true,
          createdAt: '2024-01-10',
          totalOrders: 5,
          totalSpent: 12500000,
          lastOrderDate: '2024-01-14'
        },
        {
          id: '2',
          username: 'customer2',
          email: 'customer2@example.com',
          fullName: 'Trần Thị B',
          phone: '0987654321',
          isActive: true,
          isVerified: false,
          createdAt: '2024-01-05',
          totalOrders: 2,
          totalSpent: 3200000,
          lastOrderDate: '2024-01-12'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' ||
                         (statusFilter === 'ACTIVE' && customer.isActive) ||
                         (statusFilter === 'INACTIVE' && !customer.isActive) ||
                         (statusFilter === 'VERIFIED' && customer.isVerified) ||
                         (statusFilter === 'UNVERIFIED' && !customer.isVerified)
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">{t('admin.customers.title')}</h1>
          <p className="text-slate-400 text-sm mt-1">
            {t('admin.customers.subtitle')}
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
            <option value="ALL">Tất cả</option>
            <option value="ACTIVE">Đang hoạt động</option>
            <option value="INACTIVE">Tạm khóa</option>
            <option value="VERIFIED">Đã xác thực</option>
            <option value="UNVERIFIED">Chưa xác thực</option>
          </select>
        </div>

        {/* Customers List */}
        <div className="grid gap-4">
          {filteredCustomers.map((customer) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface-dark border border-border-dark rounded-2xl p-6 hover:border-primary/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{customer.fullName}</h3>
                    <p className="text-slate-400 text-sm">@{customer.username}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-slate-400 text-sm">
                        <Mail className="h-3 w-3" />
                        {customer.email}
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-1 text-slate-400 text-sm">
                          <Phone className="h-3 w-3" />
                          {customer.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={customer.isActive ? "default" : "destructive"}>
                        {customer.isActive ? 'Hoạt động' : 'Tạm khóa'}
                      </Badge>
                      <Badge variant={customer.isVerified ? "default" : "secondary"}>
                        {customer.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                      </Badge>
                    </div>
                    {customer.totalOrders && (
                      <div className="text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <ShoppingBag className="h-3 w-3" />
                          {customer.totalOrders} đơn hàng
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {customer.totalSpent?.toLocaleString()}đ
                        </div>
                      </div>
                    )}
                  </div>

                  <Button variant="outline" size="sm">
                    Chi tiết
                  </Button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border-dark flex justify-between text-sm text-slate-400">
                <span>Tham gia: {new Date(customer.createdAt).toLocaleDateString('vi-VN')}</span>
                {customer.lastOrderDate && (
                  <span>Đơn hàng cuối: {new Date(customer.lastOrderDate).toLocaleDateString('vi-VN')}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-20">
            <Users className="mx-auto h-24 w-24 text-slate-400 mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Không tìm thấy khách hàng
            </h2>
            <p className="text-slate-400">
              Thử tìm kiếm với từ khóa khác
            </p>
          </div>
        )}
    </div>
  )
}