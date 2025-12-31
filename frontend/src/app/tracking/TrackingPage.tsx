'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';

export default function TrackingPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const [code, setCode] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = code.trim();
        if (!trimmed) return;
        router.push(`/tracking/${encodeURIComponent(trimmed)}`);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-dark p-4">
            <div className="max-w-xl w-full bg-surface-dark border border-border-dark rounded-3xl p-8 shadow-2xl">
                <h1 className="text-2xl font-black text-white mb-4">{t('tracking.title', { defaultValue: 'Tra cứu đơn hàng' })}</h1>
                <p className="text-slate-400 mb-6">{t('tracking.subtitle', { defaultValue: 'Nhập mã đơn hàng để tra cứu trạng thái' })}</p>
                <form onSubmit={handleSearch} className="flex gap-3">
                    <input value={code} onChange={(e) => setCode(e.target.value)} placeholder={t('tracking.placeholder', { defaultValue: 'Mã đơn hàng hoặc tracking code' })} className="flex-1 p-3 rounded-xl bg-background-dark border border-border-dark text-sm" />
                    <button className="px-4 py-2 bg-primary text-black font-bold rounded-xl">{t('common.next', { defaultValue: 'Go' })}</button>
                </form>
            </div>
        </div>
    );
}
