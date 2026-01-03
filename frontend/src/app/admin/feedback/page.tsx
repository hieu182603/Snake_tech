'use client'

import React, { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Pagination from '@/components/ui/Pagination'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  MessageSquare,
  Search,
  Filter,
  Star,
  CheckCircle,
  XCircle,
  Eye,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

interface Feedback {
  id: string
  productId: string
  productName?: string
  accountId: string
  customerName: string
  rating: number
  title: string
  content: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  images?: string[]
  helpful?: number
  notHelpful?: number
}

export default function AdminFeedbackPage() {
  const { t } = useTranslation()
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [ratingFilter, setRatingFilter] = useState<string>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 5

  useEffect(() => {
    loadFeedbacks()
  }, [])

  const loadFeedbacks = async () => {
    try {
      setLoading(true)
      const { apiClient } = await import('@/lib/api')

      const result = await apiClient.get('/feedback', {
        page: 1,
        limit: 100,
        search: searchTerm,
        status: statusFilter,
        rating: ratingFilter
      })

      if (!result.success) {
        throw new Error(result.error || 'Failed to load feedbacks')
      }

      const data = result.data
      setFeedbacks(data?.feedbacks || [])
    } catch (error) {
      console.error('Load feedbacks error:', error)
      // Fallback to mock data only when all authentication attempts fail
      console.log('Using mock data due to API failure')
      setFeedbacks([
        {
          id: '1',
          productId: 'prod1',
          productName: 'Gaming PC RTX 4070',
          accountId: 'user1',
          customerName: 'Nguyễn Văn A',
          rating: 5,
          title: 'Sản phẩm tuyệt vời!',
          content: 'Máy chạy rất mượt, thiết kế đẹp, giao hàng nhanh. Rất hài lòng!',
          status: 'APPROVED',
          createdAt: '2024-01-15',
          images: [],
          helpful: 12,
          notHelpful: 1
        },
        {
          id: '2',
          productId: 'prod2',
          productName: 'Mechanical Keyboard RGB',
          accountId: 'user2',
          customerName: 'Trần Thị B',
          rating: 2,
          title: 'Không như mong đợi',
          content: 'Bàn phím bị lỗi một số phím, âm thanh gõ không êm.',
          status: 'PENDING',
          createdAt: '2024-01-14',
          images: [],
          helpful: 3,
          notHelpful: 8
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (feedback.productName && feedback.productName.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'ALL' || feedback.status === statusFilter
    const matchesRating = ratingFilter === 'ALL' || feedback.rating.toString() === ratingFilter
    return matchesSearch && matchesStatus && matchesRating
  })

  useEffect(() => {
    setCurrentPage(1)
  }, [filteredFeedbacks.length])

  const totalPagesComputed = Math.max(1, Math.ceil(filteredFeedbacks.length / ITEMS_PER_PAGE))
  const paginatedFeedbacks = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredFeedbacks.slice(start, start + ITEMS_PER_PAGE)
  }, [currentPage, filteredFeedbacks])

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Chờ duyệt'
      case 'APPROVED': return 'Đã duyệt'
      case 'REJECTED': return 'Từ chối'
      default: return status
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400'}`}
      />
    ))
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('admin.feedback.title')}</h1>
          <p className="text-muted-foreground">
            {t('admin.feedback.subtitle')}
          </p>
        </div>
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Tìm kiếm đánh giá..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-dark border border-border-dark text-white placeholder-slate-400 focus:border-primary focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl bg-surface-dark border border-border-dark text-white focus:border-primary focus:outline-none"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PENDING">Chờ duyệt</option>
            <option value="APPROVED">Đã duyệt</option>
            <option value="REJECTED">Từ chối</option>
          </select>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-4 py-3 rounded-xl bg-surface-dark border border-border-dark text-white focus:border-primary focus:outline-none"
          >
            <option value="ALL">Tất cả sao</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </select>
        </div>

        {/* Feedbacks Table */}
        <div className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-dark/50 border-b border-border-dark">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Đánh giá
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Đánh giá
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark">
                {paginatedFeedbacks.map((feedback, index) => (
                  <tr key={feedback.id || feedback.customerName || `feedback-${index}`} className="hover:bg-background-dark/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-white text-sm truncate">{feedback.title}</h3>
                          <div className="flex items-center gap-1">
                            {renderStars(feedback.rating)}
                          </div>
                        </div>
                        <p className="text-slate-400 text-xs line-clamp-2">{feedback.content}</p>
                        {feedback.helpful !== undefined && (
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              {feedback.helpful}
                            </div>
                            <div className="flex items-center gap-1">
                              <ThumbsDown className="h-3 w-3" />
                              {feedback.notHelpful}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-400 max-w-xs truncate">
                        {feedback.productName || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-400">
                        {feedback.customerName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-white">{feedback.rating}</span>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-400">
                        {new Date(feedback.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusBadgeColor(feedback.status)}>
                        {getStatusDisplayName(feedback.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                          <Eye className="h-4 w-4 mr-1" />
                          Chi tiết
                        </Button>
                        {feedback.status === 'PENDING' && (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="text-green-400 hover:text-white p-1">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-400 hover:text-white p-1">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPagesComputed}
          onPageChange={setCurrentPage}
        />

        {filteredFeedbacks.length === 0 && (
          <div className="text-center py-20">
            <MessageSquare className="mx-auto h-24 w-24 text-slate-400 mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Không tìm thấy đánh giá
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