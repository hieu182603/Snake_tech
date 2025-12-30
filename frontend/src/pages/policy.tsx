import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

const Policy: React.FC = () => {
  const { t } = useTranslation();

  const policies = [
    {
      title: 'Chính sách bảo hành',
      icon: 'verified_user',
      content: 'Tất cả sản phẩm đều được bảo hành chính hãng với thời hạn từ 12-36 tháng. Bảo hành bao gồm lỗi kỹ thuật và linh kiện.'
    },
    {
      title: 'Chính sách đổi trả',
      icon: 'assignment_return',
      content: 'Đổi trả miễn phí trong 15 ngày đầu tiên với sản phẩm còn nguyên seal. Áp dụng cho lỗi nhà sản xuất và không đúng mô tả.'
    },
    {
      title: 'Vận chuyển & giao nhận',
      icon: 'local_shipping',
      content: 'Miễn phí vận chuyển cho đơn hàng từ 2.000.000đ. Giao hàng trong 24h tại các tỉnh thành và 2-3 ngày cho vùng xa.'
    },
    {
      title: 'Chính sách thanh toán',
      icon: 'payments',
      content: 'Chấp nhận thanh toán COD, chuyển khoản, thẻ tín dụng và các ví điện tử. Thanh toán an toàn qua cổng VNPay.'
    }
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-[1000px]">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black text-text-main tracking-tight mb-4">Chính sách & Điều khoản</h1>
          <p className="text-text-muted">Cam kết của chúng tôi với khách hàng</p>
        </div>

        {/* Policy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {policies.map((policy, index) => (
            <div key={index} className="bg-surface border border-border rounded-3xl p-6 hover:border-primary/50 transition-all">
              <div className="flex items-start gap-4">
                <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-xl">{policy.icon}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-main mb-2">{policy.title}</h3>
                  <p className="text-text-muted leading-relaxed">{policy.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Policies */}
        <div className="space-y-8">
          {/* Warranty Policy */}
          <section className="bg-surface border border-border rounded-3xl p-8">
            <h2 className="text-2xl font-black text-text-main mb-6">Chi tiết chính sách bảo hành</h2>
            <div className="space-y-4 text-text-muted">
              <p>• Sản phẩm được bảo hành chính hãng theo quy định của nhà sản xuất</p>
              <p>• Thời hạn bảo hành: 12 tháng cho linh kiện, 24-36 tháng cho laptop/PC</p>
              <p>• Bảo hành bao gồm: Lỗi kỹ thuật, linh kiện hỏng, không hoạt động</p>
              <p>• Không bảo hành: Hư hỏng do tác động bên ngoài, sử dụng sai cách, thiên tai</p>
              <p>• Quy trình bảo hành: Liên hệ hotline hoặc mang đến cửa hàng</p>
            </div>
          </section>

          {/* Return Policy */}
          <section className="bg-surface border border-border rounded-3xl p-8">
            <h2 className="text-2xl font-black text-text-main mb-6">Chi tiết chính sách đổi trả</h2>
            <div className="space-y-4 text-text-muted">
              <p>• Thời hạn đổi trả: 15 ngày kể từ ngày nhận hàng</p>
              <p>• Điều kiện: Sản phẩm còn nguyên seal, tem mác, phụ kiện đầy đủ</p>
              <p>• Áp dụng cho: Lỗi nhà sản xuất, giao sai sản phẩm, không đúng mô tả</p>
              <p>• Không đổi trả: Sản phẩm đã qua sử dụng, hư hỏng do khách hàng</p>
              <p>• Phí vận chuyển: Miễn phí đổi trả, khách hàng chịu phí gửi về</p>
            </div>
          </section>

          {/* Shipping Policy */}
          <section className="bg-surface border border-border rounded-3xl p-8">
            <h2 className="text-2xl font-black text-text-main mb-6">Chính sách vận chuyển</h2>
            <div className="space-y-4 text-text-muted">
              <p>• Miễn phí vận chuyển cho đơn hàng từ 2.000.000đ</p>
              <p>• Phí vận chuyển: 30.000đ cho đơn dưới 2 triệu, áp dụng cho khu vực nội thành</p>
              <p>• Thời gian giao hàng: 1-2 ngày cho nội thành, 2-5 ngày cho ngoại tỉnh</p>
              <p>• Đơn vị vận chuyển: Giao Hàng Nhanh, Viettel Post, Grab</p>
              <p>• Theo dõi đơn hàng: Cung cấp mã vận đơn để tra cứu</p>
            </div>
          </section>

          {/* Payment Policy */}
          <section className="bg-surface border border-border rounded-3xl p-8">
            <h2 className="text-2xl font-black text-text-main mb-6">Chính sách thanh toán</h2>
            <div className="space-y-4 text-text-muted">
              <p>• Phương thức thanh toán: COD, chuyển khoản, thẻ tín dụng, ví điện tử</p>
              <p>• Thanh toán an toàn qua cổng VNPay - chứng nhận PCI DSS</p>
              <p>• Xác nhận thanh toán: Email và SMS thông báo ngay sau khi thanh toán</p>
              <p>• Hoàn tiền: Trong vòng 3-5 ngày làm việc cho trường hợp hủy đơn</p>
              <p>• Bảo mật: Thông tin thanh toán được mã hóa và bảo vệ tuyệt đối</p>
            </div>
          </section>
        </div>

        {/* Contact Support */}
        <div className="text-center mt-12">
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-text-main mb-4">Cần hỗ trợ thêm?</h3>
            <p className="text-text-muted mb-6">Liên hệ với chúng tôi để được tư vấn chi tiết</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">phone</span>
                <span className="font-bold text-text-main">1900 1234</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">email</span>
                <span className="font-bold text-text-main">support@techstore.vn</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Policy;
