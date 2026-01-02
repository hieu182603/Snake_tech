'use client'

import React, { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  RefreshCw
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

interface Report {
  id: string
  name: string
  type: 'SALES' | 'INVENTORY' | 'CUSTOMERS' | 'FINANCIAL'
  description: string
  generatedAt: string
  period: string
  downloadUrl?: string
  size?: string
}

export default function AdminReportsPage() {
  const { t } = useTranslation()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [generatingReport, setGeneratingReport] = useState<string | null>(null)

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    try {
      setLoading(true)
      // For now, generate mock reports since the API returns real-time data
      // In production, you might want to store generated reports in database
      const mockReports: Report[] = [
        {
          id: 'sales-current-month',
          name: 'Báo cáo doanh thu tháng hiện tại',
          type: 'SALES',
          description: 'Báo cáo chi tiết doanh thu và đơn hàng tháng này',
          generatedAt: new Date().toISOString(),
          period: new Date().toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }),
          size: '2.3 MB'
        },
        {
          id: 'inventory-status',
          name: 'Báo cáo tồn kho',
          type: 'INVENTORY',
          description: 'Trạng thái tồn kho và sản phẩm sắp hết',
          generatedAt: new Date().toISOString(),
          period: 'Hiện tại',
          size: '1.8 MB'
        },
        {
          id: 'customer-analysis',
          name: 'Phân tích khách hàng',
          type: 'CUSTOMERS',
          description: 'Thống kê hành vi và phân khúc khách hàng',
          generatedAt: new Date().toISOString(),
          period: '6 tháng gần nhất',
          size: '3.1 MB'
        }
      ];

      setReports(mockReports)
    } catch (error) {
      console.error('Load reports error:', error)
      // Mock data for now
      setReports([
        {
          id: '1',
          name: 'Báo cáo doanh thu tháng 1/2024',
          type: 'SALES',
          description: 'Báo cáo chi tiết doanh thu và lợi nhuận tháng 1',
          generatedAt: '2024-01-31T23:59:59Z',
          period: '2024-01',
          downloadUrl: '#',
          size: '2.3 MB'
        },
        {
          id: '2',
          name: 'Báo cáo tồn kho Q1 2024',
          type: 'INVENTORY',
          description: 'Tình trạng tồn kho tất cả sản phẩm quý 1',
          generatedAt: '2024-01-15T10:30:00Z',
          period: 'Q1 2024',
          downloadUrl: '#',
          size: '1.8 MB'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const generateReport = async (type: string) => {
    setGeneratingReport(type)
    try {
      const { apiClient } = await import('@/lib/api')

      const result = await apiClient.post('/reports/generate', {
          type,
          period: 'current_month'
      })

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate report')
      }

      const data = result.data

      // Add new report to list
      const newReport: Report = {
        id: data.report.id,
        name: data.report.name,
        type: data.report.type,
        description: data.report.description,
        generatedAt: data.report.generatedAt,
        period: data.report.period,
        downloadUrl: data.report.downloadUrl,
        size: data.report.size
      }

      setReports(prev => [newReport, ...prev])

      // Show success message
      console.log('Report generated successfully')
    } catch (error) {
      console.error('Generate report error:', error)
    } finally {
      setGeneratingReport(null)
    }
  }

  const getReportTypeDisplayName = (type: string) => {
    switch (type) {
      case 'SALES': return 'Báo cáo bán hàng'
      case 'INVENTORY': return 'Báo cáo tồn kho'
      case 'CUSTOMERS': return 'Báo cáo khách hàng'
      case 'FINANCIAL': return 'Báo cáo tài chính'
      default: return type
    }
  }

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'SALES': return 'bg-green-100 text-green-800'
      case 'INVENTORY': return 'bg-blue-100 text-blue-800'
      case 'CUSTOMERS': return 'bg-purple-100 text-purple-800'
      case 'FINANCIAL': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'SALES': return <DollarSign className="h-5 w-5" />
      case 'INVENTORY': return <Package className="h-5 w-5" />
      case 'CUSTOMERS': return <Users className="h-5 w-5" />
      case 'FINANCIAL': return <TrendingUp className="h-5 w-5" />
      default: return <FileText className="h-5 w-5" />
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
            <h1 className="text-3xl font-bold text-foreground mb-2">{t('admin.reports.title')}</h1>
            <p className="text-muted-foreground">
              {t('admin.reports.subtitle')}
            </p>
          </div>
          <Button variant="outline" onClick={loadReports}>
            {t('admin.refresh')}
          </Button>
        </div>
        {/* Generate Reports Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Tạo báo cáo mới</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { type: 'SALES', label: 'Báo cáo bán hàng', description: 'Doanh thu, đơn hàng, lợi nhuận' },
              { type: 'INVENTORY', label: 'Báo cáo tồn kho', description: 'Tình trạng hàng tồn kho' },
              { type: 'CUSTOMERS', label: 'Báo cáo khách hàng', description: 'Thống kê khách hàng' },
              { type: 'FINANCIAL', label: 'Báo cáo tài chính', description: 'Thu chi, lợi nhuận' }
            ].map((reportType) => (
              <Card key={reportType.type} className="hover:border-primary/30 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {getReportTypeIcon(reportType.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{reportType.label}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-400 mb-4">{reportType.description}</p>
                  <Button
                    className="w-full"
                    disabled={generatingReport === reportType.type}
                    onClick={() => generateReport(reportType.type)}
                  >
                    {generatingReport === reportType.type ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Tạo báo cáo
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Reports List */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6">Báo cáo đã tạo</h2>

          {reports.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="mx-auto h-24 w-24 text-slate-400 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">Chưa có báo cáo nào</h3>
              <p className="text-slate-400 mb-6">
                Tạo báo cáo đầu tiên của bạn bằng cách sử dụng các tùy chọn ở trên
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {reports.map((report, index) => (
                <div
                  key={report.id || report.name || `report-${index}`}
                  className="bg-surface-dark border border-border-dark rounded-2xl p-6 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary">
                        {getReportTypeIcon(report.type)}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">{report.name}</h3>
                        <p className="text-slate-400 text-sm">{report.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge className={getReportTypeColor(report.type)}>
                            {getReportTypeDisplayName(report.type)}
                          </Badge>
                          <span className="text-slate-400 text-sm">
                            Kỳ: {report.period}
                          </span>
                          {report.size && (
                            <span className="text-slate-400 text-sm">
                              Kích thước: {report.size}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm text-slate-400">
                        <div>Tạo: {new Date(report.generatedAt).toLocaleDateString('vi-VN')}</div>
                        <div>{new Date(report.generatedAt).toLocaleTimeString('vi-VN')}</div>
                      </div>

                      {report.downloadUrl && (
                        <Button variant="outline">
                          Tải xuống
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}