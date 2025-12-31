'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Shield, Truck, RotateCcw, Headphones } from 'lucide-react';

export default function PolicyPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'warranty';

  const policies = [
    {
      id: 'warranty',
      title: 'Chính sách bảo hành',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-foreground">Chính sách bảo hành sản phẩm</h3>
          <div className="space-y-3 text-muted-foreground">
            <p>
              Snake Tech cam kết cung cấp sản phẩm chất lượng cao với chính sách bảo hành tốt nhất cho khách hàng.
            </p>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Thời gian bảo hành:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Laptop, máy tính: 12 tháng</li>
                <li>Điện thoại, tablet: 12 tháng</li>
                <li>Phụ kiện (chuột, bàn phím, tai nghe): 6 tháng</li>
                <li>Thiết bị gaming: 12 tháng</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Điều kiện bảo hành:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Còn trong thời hạn bảo hành</li>
                <li>Có phiếu bảo hành và hóa đơn mua hàng</li>
                <li>Lỗi do nhà sản xuất</li>
                <li>Không có dấu hiệu tự ý can thiệp sửa chữa</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'shipping',
      title: 'Chính sách giao hàng',
      icon: Truck,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-foreground">Chính sách giao hàng tận nơi</h3>
          <div className="space-y-3 text-muted-foreground">
            <p>
              Chúng tôi cam kết giao hàng nhanh chóng và an toàn đến tay khách hàng trên toàn quốc.
            </p>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Thời gian giao hàng:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Nội thành Hà Nội, TP.HCM: 1-2 ngày</li>
                <li>Các tỉnh thành khác: 2-5 ngày</li>
                <li>Khu vực khó khăn: 5-7 ngày</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Phí giao hàng:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Miễn phí cho đơn hàng từ 500,000đ</li>
                <li>Đơn dưới 500,000đ: 30,000đ</li>
                <li>Giao hàng hỏa tốc: phụ thu 50,000đ</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'return',
      title: 'Chính sách đổi trả',
      icon: RotateCcw,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-foreground">Chính sách đổi trả hàng</h3>
          <div className="space-y-3 text-muted-foreground">
            <p>
              Khách hàng có thể đổi trả sản phẩm trong vòng 30 ngày kể từ ngày nhận hàng.
            </p>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Điều kiện đổi trả:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Sản phẩm còn nguyên vẹn, chưa qua sử dụng</li>
                <li>Còn đầy đủ bao bì, tem mác, phụ kiện</li>
                <li>Có hóa đơn mua hàng</li>
                <li>Lỗi do nhà sản xuất hoặc giao sai hàng</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Không áp dụng đổi trả:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Sản phẩm đã qua sử dụng</li>
                <li>Hư hỏng do tác động bên ngoài</li>
                <li>Thiếu phụ kiện, bao bì</li>
                <li>Đặt hàng theo yêu cầu đặc biệt</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'support',
      title: 'Hỗ trợ khách hàng',
      icon: Headphones,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-foreground">Dịch vụ hỗ trợ khách hàng</h3>
          <div className="space-y-3 text-muted-foreground">
            <p>
              Đội ngũ chăm sóc khách hàng của Snake Tech luôn sẵn sàng hỗ trợ bạn 24/7.
            </p>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Thông tin liên hệ:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Hotline: 1900 XXX XXX</li>
                <li>Email: support@snaketech.vn</li>
                <li>Chat trực tuyến: Website</li>
                <li>Fanpage: fb.com/snaketech</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Thời gian hỗ trợ:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Hotline: 8:00 - 22:00 hàng ngày</li>
                <li>Chat online: 8:00 - 22:00 hàng ngày</li>
                <li>Email: 24/7 (trả lời trong 24h)</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  ];

  const activePolicy = policies.find(p => p.id === tab) || policies[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Quay lại trang chủ
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-foreground mt-4">Chính sách & Điều khoản</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Danh mục</h2>
              <div className="space-y-2">
                {policies.map((policy) => {
                  const Icon = policy.icon;
                  return (
                    <Link
                      key={policy.id}
                      href={`/policy?tab=${policy.id}`}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        tab === policy.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted text-foreground'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{policy.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-card border border-border rounded-lg p-8">
              {activePolicy.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
