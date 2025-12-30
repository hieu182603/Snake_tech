'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthInput from '@/components/ui/AuthInput';
import OTPModal from '@/components/ui/OTPModal';
import { authService } from '@/services/authService';
import { useToast } from '@/contexts/ToastContext';

interface AuthPageProps {
  initialSignUp?: boolean;
}

const AuthPage: React.FC<AuthPageProps> = ({ initialSignUp = false }) => {
  const router = useRouter();
  const toast = useToast();
  const [isSignUp, setIsSignUp] = useState(initialSignUp);
  const [isAnimating, setIsAnimating] = useState(false);

  // State for Sign Up Form
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationData, setRegistrationData] = useState<{
    username: string;
    email: string;
    password: string;
  } | null>(null);

  // State for Sign In Form
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Password Validation Logic
  const hasLength = password.length >= 8;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  // Calculate Strength Score (0 to 4)
  const strengthScore = [hasLength, hasLower, hasUpper, hasNumber].filter(Boolean).length;
  const showValidation = password.length > 0;

  useEffect(() => {
    setIsSignUp(initialSignUp);
  }, [initialSignUp]);

  // Handle redirection after successful login based on user role
  useEffect(() => {
    if (authService.isAuthenticated()) {
      // Redirect to home page for now
      router.push('/');
    }
  }, []);

  const handleToggle = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsSignUp(!isSignUp);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await authService.login({ identifier: loginIdentifier, password: loginPassword });
      toast.showSuccess('Login successful!');
      router.push('/');
    } catch (error: any) {
      toast.showError(error.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      toast.showWarning('Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.showError('Passwords do not match');
      return;
    }

    if (!hasLength || !hasLower || !hasUpper || !hasNumber) {
      toast.showError('Password does not meet requirements');
      return;
    }

    try {
      setIsSubmitting(true);

      // Validate username format
      const usernameRegex = /^[a-zA-Z0-9_-]+$/;
      if (!usernameRegex.test(username.trim())) {
        toast.showError('Username can only contain letters, numbers, underscores, and hyphens');
        return;
      }

      if (username.trim().length < 3 || username.trim().length > 30) {
        toast.showError('Username must be between 3 and 30 characters');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        toast.showError('Please enter a valid email address');
        return;
      }

      // Call register API
      await authService.register({
        username: username.trim(),
        email: email.trim(),
        password: password,
        role: 'CUSTOMER'
      });

      // Save registration data for OTP verification
      setRegistrationData({
        username: username.trim(),
        email: email.trim(),
        password: password
      });

      // Show success message
      toast.showSuccess('OTP sent to your email');

      // Show OTP Modal
      setShowOTP(true);
    } catch (error: any) {
      toast.showError(error.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    if (!registrationData) {
      throw new Error('Registration data not found');
    }

    try {
      setIsSubmitting(true);
      await authService.verifyRegister({
        username: registrationData.username,
        password: registrationData.password,
        email: registrationData.email,
        role: 'CUSTOMER',
        otp: otp
      });

      // Registration successful
      setShowOTP(false);
      toast.showSuccess('Registration successful!');
      router.push('/');
    } catch (error: any) {
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    if (!registrationData) return;

    try {
      await authService.resendOTP({
        identifier: registrationData.email
      });
      toast.showSuccess('OTP resent successfully');
    } catch (error: any) {
      toast.showError(error.message || 'Failed to resend OTP');
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0c29] flex items-center justify-center p-4 relative overflow-hidden font-display">

      {/* --- BACK TO HOME BUTTON --- */}
      <Link href="/" className="absolute top-8 left-8 z-50 flex items-center gap-2 text-white/40 hover:text-white transition-all group">
        <div className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all backdrop-blur-md">
          <span className="material-symbols-outlined text-sm group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
        </div>
        <span className="text-xs font-bold tracking-widest uppercase hidden sm:block">Back to Home</span>
      </Link>

      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* Main Container */}
      <div className="relative bg-[#1a1a2e] rounded-[24px] shadow-2xl shadow-black/50 overflow-hidden w-full max-w-[850px] min-h-[520px] z-10 border border-white/5">

        {/* --- OTP MODAL OVERLAY --- */}
        <OTPModal
          isOpen={showOTP}
          onClose={() => setShowOTP(false)}
          onVerify={handleVerifyOTP}
          email={registrationData?.email}
          onResend={handleResendOTP}
        />

        {/* --- SIGN UP FORM CONTAINER --- */}
        <div className={`absolute top-0 h-full transition-all duration-700 ease-in-out left-0 w-1/2 ${isSignUp ? 'translate-x-[100%] opacity-100 z-50' : 'opacity-0 z-10'}`}>
          <form onSubmit={handleSignUpSubmit} className="bg-[#151525] flex flex-col items-center justify-center h-full px-8 text-center relative">
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2 tracking-tight">Create Account</h1>
            <p className="text-slate-400 text-[11px] mb-6">Join Snake Tech today</p>

            <div className="w-full space-y-2">
              <AuthInput
                icon="account_circle"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <AuthInput
                icon="mail"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <AuthInput
                icon="lock"
                placeholder="Password"
                showEye={true}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Password Strength Visual - Only Show When Typing */}
              <div className={`transition-all duration-300 overflow-hidden ${showValidation ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
                {/* Strength Bars */}
                <div className="flex gap-1 mb-2 px-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-0.5 flex-1 rounded-full transition-colors duration-300 ${i <= strengthScore ? 'bg-emerald-500' : 'bg-slate-700'
                        }`}
                    ></div>
                  ))}
                </div>

                {/* Validation Rules */}
                <div className="flex justify-between px-1 mb-3 flex-wrap gap-y-1">
                  <span className={`text-[9px] flex items-center gap-1 transition-colors ${hasLength ? 'text-emerald-500' : 'text-slate-500'}`}>
                    <span className="material-symbols-outlined text-[10px]">{hasLength ? 'check' : 'circle'}</span> 8+ chars
                  </span>
                  <span className={`text-[9px] flex items-center gap-1 transition-colors ${hasLower ? 'text-emerald-500' : 'text-slate-500'}`}>
                    <span className="material-symbols-outlined text-[10px]">{hasLower ? 'check' : 'circle'}</span> Lowercase
                  </span>
                  <span className={`text-[9px] flex items-center gap-1 transition-colors ${hasUpper ? 'text-emerald-500' : 'text-slate-500'}`}>
                    <span className="material-symbols-outlined text-[10px]">{hasUpper ? 'check' : 'circle'}</span> Uppercase
                  </span>
                  <span className={`text-[9px] flex items-center gap-1 transition-colors ${hasNumber ? 'text-emerald-500' : 'text-slate-500'}`}>
                    <span className="material-symbols-outlined text-[10px]">{hasNumber ? 'check' : 'circle'}</span> Number
                  </span>
                </div>
              </div>

              <AuthInput
                icon="lock_reset"
                placeholder="Confirm Password"
                showEye={true}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-xs rounded-xl uppercase tracking-widest shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="mt-5 pt-5 border-t border-white/5 w-full">
              <p className="text-[11px] text-slate-500">
                Already have an account?
                <button type="button" onClick={handleToggle} className="text-purple-400 font-bold ml-1 hover:underline outline-none">Sign In</button>
              </p>
            </div>
          </form>
        </div>

        {/* --- SIGN IN FORM CONTAINER --- */}
        <div className={`absolute top-0 h-full transition-all duration-700 ease-in-out left-0 w-1/2 z-20 ${isSignUp ? 'translate-x-[100%] opacity-0' : 'translate-x-0 opacity-100'}`}>
          <form onSubmit={handleSignInSubmit} className="bg-[#151525] flex flex-col items-center justify-center h-full px-10 text-center">

              <div className="mb-5 size-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <title>Snake</title>
                  <path d="M3 12c1.5-4 6-6 9-6 2 0 3.5.8 4.5 2 .6.8.6 1.8 0 2.6-.5.6-1.4.8-2 .3-.7-.6-1.6-1-2.8-1-2.2 0-4.5 1.6-6 4-1 1.5-1 3 .5 3.8.6.4 1.4.3 2-.2.6-.5 1-1 2-1 1.2 0 2 .6 3 1 .6.3 1 .5 1.6.5 1.8 0 3-1 4-2 1.5-1.5 3.5-1 4.5 0" />
                </svg>
              </div>

            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-slate-400 text-xs mb-8">Sign in to your Snake Tech account</p>

            <div className="w-full space-y-3">
              <AuthInput
                icon="account_circle"
                placeholder="Email or Username"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
              />
              <AuthInput
                icon="lock"
                placeholder="Password"
                showEye={true}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>

            <div className="w-full flex justify-between items-center mt-3 mb-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="rounded border-slate-700 bg-slate-800 text-purple-600 focus:ring-purple-500/50 size-3.5" />
                <span className="text-[11px] text-slate-400 group-hover:text-white transition-colors">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-[11px] font-bold text-purple-400 hover:text-purple-300 transition-colors">Forgot Password?</Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-xs rounded-xl uppercase tracking-widest shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="mt-6 pt-6 border-t border-white/5 w-full">
              <p className="text-[11px] text-slate-500">
                Don&apos;t have an account?
                <button type="button" onClick={handleToggle} className="text-purple-400 font-bold ml-1 hover:underline outline-none">Create Account</button>
              </p>
            </div>
          </form>
        </div>

        {/* --- OVERLAY CONTAINER (The Moving Image) --- */}
        <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-[100] ${isSignUp ? '-translate-x-full' : ''} ${showOTP ? 'z-[10]' : ''}`}>

          <div className={`relative -left-full h-full w-[200%] transform transition-transform duration-700 ease-in-out ${isSignUp ? 'translate-x-1/2' : 'translate-x-0'}`}>

            {/* Background Image for Overlay */}
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?q=80&w=2000&auto=format&fit=crop')" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-[#1a1a2e]/60 to-purple-900/90 mix-blend-multiply"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-transparent to-transparent"></div>
            </div>

            {/* Overlay Panel: Left (Visible when Sign Up is Active) */}
            <div className={`absolute top-0 flex flex-col items-center justify-center w-1/2 h-full px-8 text-center transform transition-transform duration-700 ease-in-out ${isSignUp ? 'translate-x-0' : '-translate-x-[20%]'}`}>
              <div className="relative">
                <div className="absolute -top-10 -left-10 size-20 bg-purple-500 rounded-full blur-[50px] opacity-50"></div>
                <div className="relative z-10">
                  <h1 className="text-4xl font-black text-white mb-2 tracking-tighter drop-shadow-lg">Snake Tech<span className="text-purple-400">.</span></h1>
                  <p className="text-sm text-slate-200 font-medium tracking-wide uppercase opacity-90">Premium Gear for Pros</p>
                </div>
              </div>

              <div className="mt-12 space-y-4 text-left max-w-xs mx-auto">
                <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="size-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300">
                    <span className="material-symbols-outlined">rocket_launch</span>
                  </div>
                  <div>
                    <p className="text-white font-bold text-xs">Fast Shipping</p>
                    <p className="text-[10px] text-slate-400">Nationwide delivery within 24h</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="size-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-300">
                    <span className="material-symbols-outlined">verified_user</span>
                  </div>
                  <div>
                    <p className="text-white font-bold text-xs">Genuine Product</p>
                    <p className="text-[10px] text-slate-400">100% Authentic Warranty</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlay Panel: Right (Visible when Sign In is Active) */}
            <div className={`absolute top-0 right-0 flex flex-col items-center justify-center w-1/2 h-full px-8 text-center transform transition-transform duration-700 ease-in-out ${isSignUp ? 'translate-x-[20%]' : 'translate-x-0'}`}>
              <div className="relative">
                <div className="absolute -bottom-10 -right-10 size-20 bg-pink-500 rounded-full blur-[50px] opacity-50"></div>
                <div className="relative z-10">
                  <h1 className="text-4xl font-black text-white mb-2 tracking-tighter drop-shadow-lg">Join Us<span className="text-pink-400">.</span></h1>
                  <p className="text-sm text-slate-200 font-medium tracking-wide uppercase opacity-90">Level Up Your Setup</p>
                </div>
              </div>

              <div className="mt-12 p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 w-full max-w-xs">
                <p className="text-slate-300 text-xs leading-relaxed italic">
                  "Snake Tech provided me with the best workstation setup I could imagine. The quality is unmatched."
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <img src="https://picsum.photos/50/50" alt="User" className="size-8 rounded-full border border-white/20" />
                  <div className="text-left">
                    <p className="text-white font-bold text-[10px]">Alex Designer</p>
                    <div className="flex text-yellow-400 text-[10px]">
                      <span className="material-symbols-outlined text-[10px] fill">star</span>
                      <span className="material-symbols-outlined text-[10px] fill">star</span>
                      <span className="material-symbols-outlined text-[10px] fill">star</span>
                      <span className="material-symbols-outlined text-[10px] fill">star</span>
                      <span className="material-symbols-outlined text-[10px] fill">star</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

const LoginPage: React.FC = () => {
  return <AuthPage initialSignUp={false} />;
};

export default LoginPage;
