'use client'

import React from 'react'
import Button from '@/components/ui/Button'
import { useTranslation } from '@/hooks/useTranslation'

export default function AdminDashboard() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6 pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">{t('admin.dashboard')}</h1>
            <p className="text-slate-400 text-sm mt-1">
              {t('admin.reportDetail')}: <span className="text-primary font-bold">Tất cả thời gian</span>
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" icon="download" size="sm">{t('admin.exportReport')}</Button>
            <Button variant="primary" icon="refresh" size="sm">{t('admin.refresh')}</Button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface-dark border border-border-dark p-5 rounded-2xl">
            <p className="text-slate-400 text-xs font-bold uppercase mb-1">{t('admin.totalRevenue')}</p>
            <h3 className="text-2xl font-black text-white">250,000,000đ</h3>
          </div>
          <div className="bg-surface-dark border border-border-dark p-5 rounded-2xl">
            <p className="text-slate-400 text-xs font-bold uppercase mb-1">{t('admin.totalOrders')}</p>
            <h3 className="text-2xl font-black text-white">1,234</h3>
          </div>
          <div className="bg-surface-dark border border-border-dark p-5 rounded-2xl">
            <p className="text-slate-400 text-xs font-bold uppercase mb-1">{t('admin.avgOrderValue')}</p>
            <h3 className="text-2xl font-black text-white">2,025,000đ</h3>
          </div>
          <div className="bg-surface-dark border border-border-dark p-5 rounded-2xl">
            <p className="text-slate-400 text-xs font-bold uppercase mb-1">{t('admin.totalCustomers')}</p>
            <h3 className="text-2xl font-black text-white">567</h3>
          </div>
        </div>
    </div>
  )
}