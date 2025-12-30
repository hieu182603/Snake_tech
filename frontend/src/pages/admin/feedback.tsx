import React from 'react';
import Button from '@/components/ui/Button';

const AdminFeedback: React.FC = () => {
  const feedbacks = [
    {
      id: 1,
      customer: 'Nguyễn Văn A',
      product: 'Gaming Laptop RTX 4070',
      rating: 5,
      comment: 'Sản phẩm rất tốt, giao hàng nhanh, chất lượng tuyệt vời!',
      date: '2024-12-31',
      status: 'published'
    },
    {
      id: 2,
      customer: 'Trần Thị B',
      product: 'Mechanical Keyboard RGB',
      rating: 4,
      comment: 'Bàn phím đẹp, led đẹp, chỉ có giá hơi cao một chút.',
      date: '2024-12-30',
      status: 'pending'
    },
    {
      id: 3,
      customer: 'Lê Văn C',
      product: 'Gaming Mouse Wireless',
      rating: 3,
      comment: 'Chuột ổn nhưng pin tụt nhanh, hy vọng cải thiện.',
      date: '2024-12-29',
      status: 'published'
    }
  ];

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={`material-symbols-outlined text-sm ${i < rating ? 'text-yellow-400 fill' : 'text-text-muted'}`}>
        star
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-[1440px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-text-main tracking-tight">Quản lý phản hồi</h1>
            <p className="text-text-muted mt-2">Xem và quản lý đánh giá từ khách hàng</p>
          </div>
          <div className="flex gap-3">
            <select className="bg-surface border border-border rounded-xl px-4 py-2 text-text-main">
              <option>Tất cả</option>
              <option>Chưa duyệt</option>
              <option>Đã duyệt</option>
              <option>Đã ẩn</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="bg-surface border border-border rounded-3xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="size-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">person</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-text-main">{feedback.customer}</h3>
                    <p className="text-sm text-text-muted">{feedback.product}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex">{renderStars(feedback.rating)}</div>
                      <span className="text-sm text-text-muted">{feedback.date}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  feedback.status === 'published'
                    ? 'bg-emerald-500/10 text-emerald-500'
                    : 'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {feedback.status === 'published' ? 'Đã duyệt' : 'Chờ duyệt'}
                </span>
              </div>

              <p className="text-text-main mb-4 pl-16">{feedback.comment}</p>

              <div className="flex gap-3 pl-16">
                {feedback.status === 'pending' && (
                  <>
                    <Button size="sm">Duyệt</Button>
                    <Button size="sm" variant="outline">Từ chối</Button>
                  </>
                )}
                {feedback.status === 'published' && (
                  <Button size="sm" variant="outline">Ẩn đánh giá</Button>
                )}
                <Button size="sm" variant="outline">Trả lời</Button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          <div className="bg-surface border border-border rounded-3xl p-6 text-center">
            <div className="text-2xl font-black text-text-main mb-2">4.8</div>
            <p className="text-text-muted text-sm">Đánh giá trung bình</p>
          </div>
          <div className="bg-surface border border-border rounded-3xl p-6 text-center">
            <div className="text-2xl font-black text-text-main mb-2">245</div>
            <p className="text-text-muted text-sm">Tổng đánh giá</p>
          </div>
          <div className="bg-surface border border-border rounded-3xl p-6 text-center">
            <div className="text-2xl font-black text-text-main mb-2">12</div>
            <p className="text-text-muted text-sm">Chờ duyệt</p>
          </div>
          <div className="bg-surface border border-border rounded-3xl p-6 text-center">
            <div className="text-2xl font-black text-text-main mb-2">98%</div>
            <p className="text-text-muted text-sm">Đánh giá tích cực</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFeedback;
