'use client'

import React, { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import { useTranslation } from '@/hooks/useTranslation'

interface Product {
  id: string
  name: string
  price: number
  stock: number
  isActive: boolean
  images: Array<{ url: string }>
}

export default function AdminProductsPage() {
  const { t } = useTranslation()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for now
    setProducts([
      {
        id: '1',
        name: 'Gaming PC RTX 4070',
        price: 25000000,
        stock: 5,
        isActive: true,
        images: [{ url: '/placeholder-product.jpg' }]
      }
    ])
    setLoading(false)
  }, [])

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">{t('admin.products.title')}</h1>
            <p className="text-slate-400 text-sm mt-1">
              {t('admin.products.subtitle')}
            </p>
          </div>
          <Button>
            {t('admin.products.addProduct')}
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden shadow-sm hover:border-primary/30 transition-all group">
              <div className="aspect-square bg-slate-700/50 overflow-hidden">
                <img
                  src={product.images?.[0]?.url || '/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 line-clamp-2 text-white">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-black text-white">
                    {product.price.toLocaleString()}đ
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    {t('common.view')}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    {t('common.edit')}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">inventory_2</span>
            <h3 className="text-lg font-bold text-white mb-2">
              {t('admin.products.noProductsMatch')}
            </h3>
            <p className="text-slate-400">
              {t('admin.tryDifferentSearch', { defaultValue: 'Thử tìm kiếm với từ khóa khác' })}
            </p>
          </div>
        )}
    </div>
  )
}