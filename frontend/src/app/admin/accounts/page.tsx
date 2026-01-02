'use client'

import React, { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from '@/hooks/useTranslation'

interface Account {
  id: string
  username: string
  email: string
  fullName: string
  role: 'ADMIN' | 'STAFF' | 'CUSTOMER' | 'SHIPPER'
  isActive: boolean
  isVerified: boolean
  createdAt: string
  lastLogin?: string
}

export default function AdminAccountsPage() {
  const { user, accessToken, isAuthenticated } = useAuth()
  const { t } = useTranslation()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalAccounts, setTotalAccounts] = useState(0)
  const itemsPerPage = 10

  const isAuthorized = isAuthenticated() && user && ['ADMIN'].includes(user.role)

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    try {
      setLoading(true)
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

      // Check if user is authenticated and has admin role
      if (!isAuthenticated() || !user || !['ADMIN'].includes(user.role)) {
        console.log('User not authenticated or not admin:', { isAuthenticated: isAuthenticated(), user })
        // Don't throw error, just return early - the page will show auth message
        setAccounts([])
        setTotalPages(1)
        setTotalAccounts(0)
        return
      }

      const { apiClient } = await import('@/lib/api')

      const result = await apiClient.get('/admin/accounts', {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm
      })

      if (!result.success) {
        throw new Error(result.error || 'Failed to load accounts')
      }

      const data = result.data
      setAccounts(data.accounts || [])
      setTotalPages(data.pagination?.pages || 1)
      setTotalAccounts(data.pagination?.total || 0)
    } catch (error) {
      console.error('Load accounts error:', error)
      // Mock data for now
      setAccounts([
        {
          id: '1',
          username: 'admin',
          email: 'admin@snakeshop.com',
          fullName: 'Admin User',
          role: 'ADMIN',
          isActive: true,
          isVerified: true,
          createdAt: '2024-01-01',
          lastLogin: '2024-01-15'
        },
        {
          id: '2',
          username: 'customer1',
          email: 'customer1@example.com',
          fullName: 'Nguyễn Văn A',
          role: 'CUSTOMER',
          isActive: true,
          isVerified: true,
          createdAt: '2024-01-10',
          lastLogin: '2024-01-14'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = (account.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (account.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (account.fullName || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'ALL' || account.role === roleFilter
    return matchesSearch && matchesRole
  })

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800'
      case 'STAFF': return 'bg-blue-100 text-blue-800'
      case 'CUSTOMER': return 'bg-green-100 text-green-800'
      case 'SHIPPER': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'ADMIN': return t('profile.membership.level')
      case 'STAFF': return t('nav.staff', { defaultValue: 'Nhân viên' })
      case 'CUSTOMER': return t('nav.customer', { defaultValue: 'Khách hàng' })
      case 'SHIPPER': return t('nav.shipper', { defaultValue: 'Người giao hàng' })
      default: return role
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
    <div className="space-y-6 pb-10">
        {/* Header & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">{t('admin.accounts.title', { defaultValue: 'Tài khoản' })}</h1>
            <p className="text-slate-400 text-sm mt-1">
              {t('admin.accounts.subtitle', { defaultValue: 'Quản lý tài khoản người dùng và quyền hạn' })}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" icon="download" size="sm">{t('admin.exportReport', { defaultValue: 'Xuất báo cáo' })}</Button>
            <Button variant="primary" icon="add" size="sm">{t('admin.addAccount', { defaultValue: 'Thêm tài khoản' })}</Button>
          </div>
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
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="ALL">{t('common.all')}</option>
            <option value="ADMIN">{t('profile.membership.level')}</option>
            <option value="STAFF">{t('nav.staff', { defaultValue: 'Nhân viên' })}</option>
            <option value="CUSTOMER">{t('nav.customer', { defaultValue: 'Khách hàng' })}</option>
            <option value="SHIPPER">{t('nav.shipper', { defaultValue: 'Người giao hàng' })}</option>
          </select>
        </div>

        {!isAuthorized ? (
          <div className="text-center py-20">
            <Users className="mx-auto h-24 w-24 text-slate-400 mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Yêu cầu quyền truy cập
            </h2>
            <p className="text-slate-400 mb-6">
              Bạn cần đăng nhập với tài khoản Admin để truy cập trang này.
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
            {/* Accounts Table */}
            <div className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background-dark/50 border-b border-border-dark">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Tài khoản
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Vai trò
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Ngày tạo
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Đăng nhập cuối
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
                    {filteredAccounts.map((account, index) => (
                      <tr key={account.id || account.username || `account-${index}`} className="hover:bg-background-dark/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">
                                {account.fullName}
                              </div>
                              <div className="text-xs text-slate-400">
                                @{account.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-400">
                            {account.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getRoleBadgeColor(account.role)}>
                            {getRoleDisplayName(account.role)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-400">
                            {new Date(account.createdAt).toLocaleDateString('vi-VN')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-400">
                            {account.lastLogin ? new Date(account.lastLogin).toLocaleDateString('vi-VN') : 'Chưa đăng nhập'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <Badge variant={account.isActive ? "default" : "destructive"} className="text-xs">
                              {account.isActive ? 'Hoạt động' : 'Tạm khóa'}
                            </Badge>
                            <Badge variant={account.isVerified ? "default" : "secondary"} className="text-xs">
                              {account.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                              {t('common.edit', { defaultValue: 'Sửa' })}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredAccounts.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {t('admin.noResults', { defaultValue: 'Không tìm thấy tài khoản' })}
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