'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Image,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Upload
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

interface Banner {
  id: string
  title: string
  description?: string
  imageUrl: string
  position: 'HOME_TOP' | 'HOME_MID' | 'CATEGORY_TOP'
  isActive: boolean
  order: number
  link?: string
  createdAt: string
  updatedAt: string
}

export default function AdminBannersPage() {
  const { t } = useTranslation()
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [positionFilter, setPositionFilter] = useState<string>('ALL')

  useEffect(() => {
    loadBanners()
  }, [])

  const loadBanners = async () => {
    try {
      setLoading(true)
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

      const response = await fetch(`${API_BASE_URL}/banners`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      setBanners(data.banners || [])
    } catch (error) {
      console.error('Load banners error:', error)
      // Mock data for now
      setBanners([
        {
          id: '1',
          title: 'Gaming PC Sale',
          description: 'Giảm giá lên đến 30% cho PC gaming',
          imageUrl: '/placeholder-banner.jpg',
          position: 'HOME_TOP',
          isActive: true,
          order: 1,
          link: '/products?category=pc',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-15'
        },
        {
          id: '2',
          title: 'New Laptop Arrivals',
          description: 'Bộ sưu tập laptop mới nhất 2024',
          imageUrl: '/placeholder-banner.jpg',
          position: 'HOME_MID',
          isActive: false,
          order: 2,
          link: '/products?category=laptop',
          createdAt: '2024-01-05',
          updatedAt: '2024-01-10'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredBanners = banners.filter(banner => {
    const matchesSearch = banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (banner.description && banner.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesPosition = positionFilter === 'ALL' || banner.position === positionFilter
    return matchesSearch && matchesPosition
  })

  const getPositionDisplayName = (position: string) => {
    switch (position) {
      case 'HOME_TOP': return 'Trang chủ - Trên cùng'
      case 'HOME_MID': return 'Trang chủ - Giữa'
      case 'CATEGORY_TOP': return 'Danh mục - Trên cùng'
      default: return position
    }
  }

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'HOME_TOP': return 'bg-blue-100 text-blue-800'
      case 'HOME_MID': return 'bg-green-100 text-green-800'
      case 'CATEGORY_TOP': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{t('admin.banners.title')}</h1>
            <p className="text-muted-foreground">
              {t('admin.banners.subtitle')}
            </p>
          </div>
          <Button>
            {t('admin.addNew', { defaultValue: 'Thêm mới' })}
          </Button>
        </div>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Tìm kiếm banner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-dark border border-border-dark text-white placeholder-slate-400 focus:border-primary focus:outline-none"
            />
          </div>
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="px-4 py-3 rounded-xl bg-surface-dark border border-border-dark text-white focus:border-primary focus:outline-none"
          >
            <option value="ALL">Tất cả vị trí</option>
            <option value="HOME_TOP">Trang chủ - Trên cùng</option>
            <option value="HOME_MID">Trang chủ - Giữa</option>
            <option value="CATEGORY_TOP">Danh mục - Trên cùng</option>
          </select>
        </div>

        {/* Banners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBanners.map((banner) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden hover:border-primary/30 transition-all group"
            >
              {/* Banner Image */}
              <div className="aspect-video bg-background-dark overflow-hidden relative">
                <img
                  src={banner.imageUrl || '/placeholder-banner.jpg'}
                  alt={banner.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Badge variant={banner.isActive ? "default" : "secondary"}>
                    {banner.isActive ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                    {banner.isActive ? 'Hiển thị' : 'Ẩn'}
                  </Badge>
                </div>
                <div className="absolute bottom-2 left-2">
                  <Badge className={getPositionColor(banner.position)}>
                    {getPositionDisplayName(banner.position)}
                  </Badge>
                </div>
              </div>

              {/* Banner Info */}
              <div className="p-4">
                <h3 className="font-bold text-white text-lg line-clamp-2 mb-2">
                  {banner.title}
                </h3>
                {banner.description && (
                  <p className="text-slate-400 text-sm line-clamp-2 mb-3">
                    {banner.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                  <span>Thứ tự: {banner.order}</span>
                  {banner.link && (
                    <span className="truncate max-w-[120px]" title={banner.link}>
                      Link: {banner.link}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    Xem
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Sửa
                  </Button>
                </div>

                {/* Update Info */}
                <div className="mt-4 pt-4 border-t border-border-dark text-xs text-slate-500">
                  <div>Cập nhật: {new Date(banner.updatedAt).toLocaleDateString('vi-VN')}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add New Banner Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-dark border border-dashed border-border-dark rounded-2xl p-8 hover:border-primary/30 transition-all cursor-pointer group"
        >
          <div className="text-center">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-bold text-white text-lg mb-2">Thêm banner mới</h3>
            <p className="text-slate-400 text-sm">
              Tải lên hình ảnh và tạo banner quảng cáo mới
            </p>
          </div>
        </motion.div>

        {filteredBanners.length === 0 && (
          <div className="text-center py-20">
            <Image className="mx-auto h-24 w-24 text-slate-400 mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Không tìm thấy banner
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