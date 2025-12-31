 'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => Promise<void>;
  email?: string;
  onResend?: () => Promise<void>;
}

const OTPModal = ({
  isOpen,
  onClose,
  onVerify,
  email,
  onResend
}: OTPModalProps) => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Reset OTP when modal opens
      setOtp(['', '', '', '', '', '']);
      setError(null);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take last character
    setOtp(newOtp);
    setError(null);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError(t('auth.otp.enterOtp', { defaultValue: 'Please enter complete OTP' }));
      return;
    }

    setIsVerifying(true);
    setError(null);
    try {
      await onVerify(otpCode);
    } catch (err: any) {
      setError(err.message || t('auth.otp.invalidOtp', { defaultValue: 'Invalid OTP' }));
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!onResend) return;
    setIsResending(true);
    setError(null);
    try {
      await onResend();
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      setError(err.message || t('auth.otp.resendFailed', { defaultValue: 'Failed to resend OTP' }));
    } finally {
      setIsResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[#1a1a2e] border border-white/10 rounded-2xl p-8 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200 text-center">
        <div className="size-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-400">
          <span className="material-symbols-outlined text-3xl">lock_open</span>
        </div>
        <h2 className="text-2xl font-black text-white mb-2">{t('auth.otp.title')}</h2>
        <p className="text-slate-400 text-xs mb-8">
          {t('auth.otp.subtitle', { email: email || '' })}
        </p>

        <div className="flex justify-center gap-3 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="size-12 rounded-xl bg-slate-800 border border-slate-700 text-center text-xl font-bold text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
            />
          ))}
        </div>

        {error && (
          <p className="text-red-400 text-xs mb-4">{error}</p>
        )}

        <button
          onClick={handleVerify}
          disabled={otp.some(d => !d) || isVerifying}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-xs rounded-xl uppercase tracking-widest shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isVerifying ? t('auth.otp.verifying', { defaultValue: 'Verifying...' }) : t('auth.otp.verify', { defaultValue: 'Verify' })}
        </button>

        {onResend && (
          <p className="mt-6 text-[10px] text-slate-500">
            {t('auth.otp.noCodeQuestion', { defaultValue: "Didn't receive code?" })}
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-purple-400 font-bold hover:underline disabled:opacity-50"
            >
              {isResending ? t('auth.otp.resending', { defaultValue: 'Resending...' }) : t('auth.otp.resend', { defaultValue: 'Resend' })}
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default OTPModal;
