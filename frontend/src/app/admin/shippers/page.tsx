'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Truck,
  Search,
  Filter,
  Phone,
  MapPin,
  Star,
  Package
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuth } from '@/contexts/AuthContext'

interface Shipper {
  id: string
  username: string
  email: string
  fullName: string
  phone?: string
  isActive: boolean
  isVerified: boolean
  createdAt: string
  rating?: number
  totalDeliveries?: number
  currentLocation?: string
  vehicleType?: string
  licensePlate?: string
}

export default function AdminShippersPage() {
  const { t } = useTranslation()
  const { accessToken } = useAuth()
  const [shippers, setShippers] = useState<Shipper[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  useEffect(() => {
    loadShippers()
  }, [])

  const loadShippers = async () => {
    try {
      setLoading(true)
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

      const response = await fetch(`${API_BASE_URL}/admin/accounts?role=SHIPPER&page=1&limit=100`, {
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
      setShippers(data.accounts || [])
    } catch (error) {
      console.error('Load shippers error:', error)
      // Mock data for now
      setShippers([
        {
          id: '1',
          username: 'shipper1',
          email: 'shipper1@example.com',
          fullName: 'Lê Văn C',
          phone: '0123456789',
          isActive: true,
          isVerified: true,
          createdAt: '2024-01-01',
          rating: 4.8,
          totalDeliveries: 156,
          currentLocation: 'Quận 1, TP.HCM',
          vehicleType: 'Xe máy',
          licensePlate: '59A-12345'
        },
        {
          id: '2',
          username: 'shipper2',
          email: 'shipper2@example.com',
          fullName: 'Phạm Thị D',
          phone: '0987654321',
          isActive: false,
          isVerified: true,
          createdAt: '2024-01-05',
          rating: 4.5,
          totalDeliveries: 89,
          currentLocation: 'Quận 7, TP.HCM',
          vehicleType: 'Xe máy',
          licensePlate: '59B-67890'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredShippers = shippers.filter(shipper => {
    const matchesSearch = (shipper.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (shipper.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (shipper.fullName || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' ||
                         (statusFilter === 'ACTIVE' && shipper.isActive) ||
                         (statusFilter === 'INACTIVE' && !shipper.isActive) ||
                         (statusFilter === 'AVAILABLE' && shipper.isActive) ||
                         (statusFilter === 'BUSY' && !shipper.isActive)
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('admin.shippers.title')}</h1>
          <p className="text-muted-foreground">
            {t('admin.shippers.subtitle')}
          </p>
        </div>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm shipper..."
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
            <option value="AVAILABLE">Sẵn sàng</option>
            <option value="BUSY">Đang bận</option>
            <option value="INACTIVE">Tạm nghỉ</option>
          </select>
        </div>

        {/* Shippers List */}
        <div className="grid gap-4">
          {filteredShippers.map((shipper) => (
            <motion.div
              key={shipper.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface-dark border border-border-dark rounded-2xl p-6 hover:border-primary/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{shipper.fullName}</h3>
                    <p className="text-slate-400 text-sm">@{shipper.username}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-slate-400 text-sm">
                        <Phone className="h-3 w-3" />
                        {shipper.phone}
                      </div>
                      {shipper.currentLocation && (
                        <div className="flex items-center gap-1 text-slate-400 text-sm">
                          <MapPin className="h-3 w-3" />
                          {shipper.currentLocation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={shipper.isActive ? "default" : "secondary"}>
                        {shipper.isActive ? 'Hoạt động' : 'Tạm nghỉ'}
                      </Badge>
                      <Badge variant={shipper.isVerified ? "default" : "secondary"}>
                        {shipper.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                      </Badge>
                    </div>
                    {shipper.rating && (
                      <div className="text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {shipper.rating} • {shipper.totalDeliveries} giao hàng
                        </div>
                        <div className="text-xs">
                          {shipper.vehicleType} • {shipper.licensePlate}
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
                <span>Tham gia: {new Date(shipper.createdAt).toLocaleDateString('vi-VN')}</span>
                <span>Đánh giá: {shipper.rating || 'N/A'}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredShippers.length === 0 && (
          <div className="text-center py-20">
            <Truck className="mx-auto h-24 w-24 text-slate-400 mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Không tìm thấy shipper
            </h2>
            <p className="text-slate-400">
              Thử tìm kiếm với từ khóa khác
            </p>
          </div>
        )}
      </div>
    </div>
  )
}