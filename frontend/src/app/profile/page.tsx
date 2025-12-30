'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { useToast } from '@/contexts/ToastContext';
import { useTranslation } from '@/hooks/useTranslation';

interface Address {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  detail: string;
  isDefault: boolean;
}

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showSuccess, showError } = useToast();

  // State quản lý chế độ chỉnh sửa thông tin chung
  const [isEditing, setIsEditing] = useState(false);

  // State quản lý Modal địa chỉ
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // State quản lý Modal Đổi mật khẩu
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Password Validation Logic for Modal
  const hasLength = passwordForm.newPassword.length >= 8;
  const hasLower = /[a-z]/.test(passwordForm.newPassword);
  const hasUpper = /[A-Z]/.test(passwordForm.newPassword);
  const hasNumber = /[0-9]/.test(passwordForm.newPassword);
  const strengthScore = [hasLength, hasLower, hasUpper, hasNumber].filter(Boolean).length;
  const showValidation = passwordForm.newPassword.length > 0;

  // Dữ liệu người dùng
  const [user, setUser] = useState({
    name: '',
    memberId: '',
    joinDate: '',
    email: '',
    phone: '',
    avatar: 'https://picsum.photos/200/200?random=user'
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  // Load user profile and recent orders
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);

        // Load user profile
        const userProfile = await authService.getUserProfile();
        const userData = userProfile.data || userProfile;

        if (userData) {
          setUser({
            name: userData.name || userData.username || 'User',
            memberId: `#${userData.id?.substring(0, 5) || '00000'}`,
            joinDate: userData.createdAt
              ? new Date(userData.createdAt).toLocaleDateString('vi-VN')
              : 'N/A',
            email: userData.email || '',
            phone: userData.phone || '',
            avatar: 'https://picsum.photos/200/200?random=user'
          });
        }

        // Mock recent orders for now
        setRecentOrders([
          {
            id: 'ORD-001',
            date: new Date().toLocaleDateString('vi-VN'),
            total: '2,500,000₫',
            status: 'DELIVERED'
          },
          {
            id: 'ORD-002',
            date: new Date(Date.now() - 86400000).toLocaleDateString('vi-VN'),
            total: '1,200,000₫',
            status: 'SHIPPING'
          }
        ]);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Danh sách địa chỉ (Address Book)
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      label: 'Nhà riêng',
      recipientName: 'Nguyễn Văn A',
      phone: '0123456789',
      detail: '123 Đường ABC, Quận 1, TP.HCM',
      isDefault: true
    }
  ]);

  // Form state cho địa chỉ mới/sửa
  const [addressForm, setAddressForm] = useState<Partial<Address>>({});

  const [tempUser, setTempUser] = useState(user);

  // Transform recent orders for display
  const recentOrdersDisplay = recentOrders.map((order: any) => ({
    id: order.id,
    date: order.date,
    total: order.total,
    status: order.status,
    variant: order.status === 'DELIVERED' ? 'success' :
      order.status === 'CANCELLED' ? 'danger' :
        order.status === 'SHIPPING' ? 'warning' : 'info'
  }));

  const handleLogout = () => {
    authService.logout();
    router.push('/auth/login');
  };

  // --- Logic Thông tin chung ---
  const startEditing = () => {
    setTempUser(user);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setTempUser(user);
  };

  const saveChanges = () => {
    setUser(tempUser);
    setIsEditing(false);
    showSuccess('Thông tin đã được cập nhật');
  };

  const handleChange = (field: keyof typeof user, value: string) => {
    setTempUser(prev => ({ ...prev, [field]: value }));
  };

  const handleChangePassword = () => {
    // Validate logic could go here
    setIsChangePasswordModalOpen(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    showSuccess('Mật khẩu đã được thay đổi');
  };

  // --- Logic Avatar ---
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setUser(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Logic Địa chỉ ---
  const openAddressModal = (addr?: Address) => {
    if (addr) {
      setEditingAddress(addr);
      setAddressForm(addr);
    } else {
      setEditingAddress(null);
      setAddressForm({
        label: 'Nhà riêng',
        recipientName: user.name,
        phone: user.phone,
        detail: '',
        isDefault: false
      });
    }
    setIsAddressModalOpen(true);
  };

  const saveAddress = () => {
    if (!addressForm.recipientName || !addressForm.phone || !addressForm.detail) {
      showError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    let updatedAddresses = [...addresses];

    // Nếu đặt là mặc định, bỏ mặc định các địa chỉ khác
    if (addressForm.isDefault) {
      updatedAddresses = updatedAddresses.map(a => ({ ...a, isDefault: false }));
    }

    if (editingAddress) {
      // Cập nhật
      updatedAddresses = updatedAddresses.map(a =>
        a.id === editingAddress.id ? { ...addressForm, id: editingAddress.id } as Address : a
      );
    } else {
      // Thêm mới
      const newAddr = {
        ...addressForm,
        id: Math.random().toString(36).substr(2, 9),
        // Nếu là địa chỉ đầu tiên, luôn set mặc định
        isDefault: addresses.length === 0 ? true : (addressForm.isDefault || false)
      } as Address;
      updatedAddresses.push(newAddr);
    }

    setAddresses(updatedAddresses);
    setIsAddressModalOpen(false);
  };

  const deleteAddress = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
      const addrToDelete = addresses.find(a => a.id === id);
      const remaining = addresses.filter(a => a.id !== id);

      // Nếu xóa địa chỉ mặc định, set địa chỉ đầu tiên còn lại làm mặc định
      if (addrToDelete?.isDefault && remaining.length > 0) {
        remaining[0].isDefault = true;
      }

      setAddresses(remaining);
    }
  };

  const setDefaultAddress = (id: string) => {
    const updated = addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    setAddresses(updated);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'text-green-400 bg-green-400/10';
      case 'SHIPPING': return 'text-yellow-400 bg-yellow-400/10';
      case 'CANCELLED': return 'text-red-400 bg-red-400/10';
      default: return 'text-blue-400 bg-blue-400/10';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'Đã giao';
      case 'SHIPPING': return 'Đang giao';
      case 'CANCELLED': return 'Đã hủy';
      default: return 'Đang xử lý';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-[1000px]">
      <div className="bg-surface-dark border border-border-dark rounded-3xl overflow-hidden shadow-2xl">

        {/* Banner Background */}
        <div className="h-40 bg-gradient-to-r from-primary/30 via-primary/5 to-transparent relative">
          <div className="absolute -bottom-12 left-8 group">
            <div
              className="size-28 rounded-3xl bg-surface-dark border-4 border-surface-dark overflow-hidden shadow-2xl relative cursor-pointer"
              onClick={handleAvatarClick}
            >
              <img src={user.avatar} className="w-full h-full object-cover" alt="Avatar" />

              {/* Overlay Camera Icon */}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
              </div>
            </div>
            {/* Hidden Input File */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>
        </div>

        <div className="pt-20 px-8 pb-12 space-y-12">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="w-full md:w-auto">
              {isEditing ? (
                <div className="mb-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Tên hiển thị</label>
                  <input
                    value={tempUser.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="text-2xl font-black text-white bg-background-dark border border-primary rounded-lg px-3 py-1 w-full md:w-[300px] outline-none"
                  />
                </div>
              ) : (
                <h1 className="text-3xl font-black text-white tracking-tight">{user.name}</h1>
              )}
              <p className="text-slate-500 text-sm font-medium">Thành viên từ: {user.joinDate} • <span className="text-primary font-bold">ID: {user.memberId}</span></p>
            </div>

            <div className="flex gap-3 flex-wrap">
              {isEditing ? (
                <>
                  <button onClick={cancelEditing} className="px-6 py-2.5 border border-border-dark rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all">Hủy</button>
                  <button onClick={saveChanges} className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all shadow-lg shadow-primary/20">Lưu thay đổi</button>
                </>
              ) : (
                <>
                  <button onClick={startEditing} className="px-5 py-2.5 border border-border-dark rounded-xl text-sm font-bold text-white hover:bg-white/5 transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">edit</span> Chỉnh sửa
                  </button>
                  <button onClick={() => setIsChangePasswordModalOpen(true)} className="px-5 py-2.5 border border-border-dark rounded-xl text-sm font-bold text-white hover:bg-white/5 transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">lock_reset</span> Đổi mật khẩu
                  </button>
                  <button onClick={handleLogout} className="px-5 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column: Personal Info & Membership */}
            <div className="space-y-10">

              {/* Personal Info */}
              <div className="space-y-6">
                <h3 className="font-black text-white uppercase text-[10px] tracking-[0.2em] border-b border-border-dark pb-2">THÔNG TIN CÁ NHÂN</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Email</p>
                    {isEditing ? (
                      <input value={tempUser.email} onChange={(e) => handleChange('email', e.target.value)} className="w-full bg-background-dark border border-border-dark focus:border-primary rounded-lg px-3 py-2 text-white outline-none" />
                    ) : (
                      <p className="text-white font-medium">{user.email}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Số điện thoại</p>
                    {isEditing ? (
                      <input value={tempUser.phone} onChange={(e) => handleChange('phone', e.target.value)} className="w-full bg-background-dark border border-border-dark focus:border-primary rounded-lg px-3 py-2 text-white outline-none" />
                    ) : (
                      <p className="text-white font-medium">{user.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Membership Section */}
              <div className="space-y-6">
                <h3 className="font-black text-white uppercase text-[10px] tracking-[0.2em] border-b border-border-dark pb-2">THÀNH VIÊN</h3>
                <div className="bg-background-dark/50 border border-border-dark rounded-2xl p-6 flex items-center gap-5 group hover:border-primary/30 transition-all">
                  <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <span className="material-symbols-outlined text-3xl fill">stars</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-end mb-1">
                      <p className="text-lg font-black text-white">Hạng thành viên</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">1,500 / 2,000 điểm</p>
                    </div>
                    <div className="h-2 w-full bg-border-dark rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[75%] rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-wider">Cần 500 điểm nữa</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Address Book & Orders */}
            <div className="space-y-10">

              {/* Address Book Section */}
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-border-dark pb-2">
                  <h3 className="font-black text-white uppercase text-[10px] tracking-[0.2em]">SỔ ĐỊA CHỈ</h3>
                  <button onClick={() => openAddressModal()} className="text-[10px] font-black text-primary uppercase hover:underline flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">add</span> Thêm địa chỉ
                  </button>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                  {addresses.map((addr) => (
                    <div key={addr.id} className={`p-4 rounded-xl border ${addr.isDefault ? 'bg-primary/5 border-primary/50' : 'bg-background-dark/30 border-border-dark'} hover:bg-background-dark transition-all group relative`}>
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{addr.label}</span>
                          {addr.isDefault && <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-md">Mặc định</span>}
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!addr.isDefault && (
                            <button onClick={() => setDefaultAddress(addr.id)} className="text-[10px] font-bold text-slate-400 hover:text-white" title="Đặt làm mặc định">Mặc định</button>
                          )}
                          <button onClick={() => openAddressModal(addr)} className="text-blue-400 hover:text-blue-300"><span className="material-symbols-outlined text-[16px]">edit</span></button>
                          <button onClick={() => deleteAddress(addr.id)} className="text-red-400 hover:text-red-300"><span className="material-symbols-outlined text-[16px]">delete</span></button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 font-bold mb-0.5">{addr.recipientName} <span className="text-slate-500 font-normal">| {addr.phone}</span></p>
                      <p className="text-xs text-slate-400 line-clamp-2">{addr.detail}</p>
                    </div>
                  ))}
                  {addresses.length === 0 && (
                    <div className="text-center py-6 border border-dashed border-border-dark rounded-xl text-slate-500 text-xs">
                      Chưa có địa chỉ nào
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Orders Section */}
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-border-dark pb-2">
                  <h3 className="font-black text-white uppercase text-[10px] tracking-[0.2em]">ĐƠN HÀNG GẦN ĐÂY</h3>
                  <Link href="/history" className="text-[10px] font-black text-primary uppercase hover:underline flex items-center gap-1">
                    Xem tất cả <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
                <div className="grid gap-3">
                  {recentOrdersDisplay.length > 0 ? (
                    recentOrdersDisplay.map((order) => (
                      <Link key={order.id} href="/history" className="flex items-center justify-between p-4 bg-background-dark/30 border border-border-dark rounded-xl hover:border-primary/40 hover:bg-white/5 transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-lg bg-surface-dark border border-border-dark flex items-center justify-center text-slate-500">
                            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm group-hover:text-primary transition-colors">{order.id}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">{order.date}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <span className="material-symbols-outlined text-3xl mb-2 block">receipt_long</span>
                      <p className="text-sm">Chưa có đơn hàng nào</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Nhãn</label>
                  <input
                    value={addressForm.label || ''}
                    onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                    className="w-full bg-background-dark border border-border-dark rounded-lg px-3 py-2 text-white outline-none"
                    placeholder="Nhà riêng, Công ty..."
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Số điện thoại</label>
                  <input
                    value={addressForm.phone || ''}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="w-full bg-background-dark border border-border-dark rounded-lg px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Tên người nhận</label>
                <input
                  value={addressForm.recipientName || ''}
                  onChange={(e) => setAddressForm({ ...addressForm, recipientName: e.target.value })}
                  className="w-full bg-background-dark border border-border-dark rounded-lg px-3 py-2 text-white outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Địa chỉ chi tiết</label>
                <textarea
                  value={addressForm.detail || ''}
                  onChange={(e) => setAddressForm({ ...addressForm, detail: e.target.value })}
                  className="w-full bg-background-dark border border-border-dark rounded-lg px-3 py-2 text-white outline-none min-h-[80px]"
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer group w-fit">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault || false}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="size-4 rounded bg-background-dark border-border-dark text-primary focus:ring-primary cursor-pointer"
                />
                <span className="text-sm text-slate-400 group-hover:text-white transition-colors">Đặt làm địa chỉ mặc định</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="flex-1 px-4 py-2 border border-border-dark rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={saveAddress}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Đổi mật khẩu</h3>
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu hiện tại"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full bg-background-dark border border-border-dark rounded-lg px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Mật khẩu mới</label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu mới"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full bg-background-dark border border-border-dark rounded-lg px-3 py-2 text-white outline-none"
                />

                {/* Visual Validation for New Password */}
                <div className={`transition-all duration-300 overflow-hidden ${showValidation ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="flex gap-1 mb-2 px-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-0.5 flex-1 rounded-full transition-colors duration-300 ${i <= strengthScore ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                    ))}
                  </div>
                  <div className="flex justify-between px-1 mb-1 flex-wrap gap-y-1">
                    <span className={`text-[9px] flex items-center gap-1 transition-colors ${hasLength ? 'text-emerald-500' : 'text-slate-500'}`}>
                      <span className="material-symbols-outlined text-[10px]">{hasLength ? 'check' : 'circle'}</span> Tối thiểu 8 ký tự
                    </span>
                    <span className={`text-[9px] flex items-center gap-1 transition-colors ${hasLower ? 'text-emerald-500' : 'text-slate-500'}`}>
                      <span className="material-symbols-outlined text-[10px]">{hasLower ? 'check' : 'circle'}</span> Chữ thường
                    </span>
                    <span className={`text-[9px] flex items-center gap-1 transition-colors ${hasUpper ? 'text-emerald-500' : 'text-slate-500'}`}>
                      <span className="material-symbols-outlined text-[10px]">{hasUpper ? 'check' : 'circle'}</span> Chữ hoa
                    </span>
                    <span className={`text-[9px] flex items-center gap-1 transition-colors ${hasNumber ? 'text-emerald-500' : 'text-slate-500'}`}>
                      <span className="material-symbols-outlined text-[10px]">{hasNumber ? 'check' : 'circle'}</span> Số
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  placeholder="Nhập lại mật khẩu mới"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full bg-background-dark border border-border-dark rounded-lg px-3 py-2 text-white outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsChangePasswordModalOpen(false)}
                className="flex-1 px-4 py-2 border border-border-dark rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleChangePassword}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;
