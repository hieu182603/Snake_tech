import React, { useState } from 'react';

interface AuthInputProps {
  icon: string;
  type?: string;
  placeholder: string;
  showEye?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AuthInput = ({ icon, type = "text", placeholder, showEye = false, value, onChange }: AuthInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showEye ? (showPassword ? "text" : "password") : type;

  return (
    <div className="relative w-full mb-3 group">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-purple-600 transition-colors pointer-events-none">
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      </div>
      <input
        type={inputType}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-10 pl-10 pr-4 bg-surface-accent border border-transparent text-text-main text-sm font-medium rounded-lg focus:ring-2 focus:ring-purple-500 focus:bg-surface outline-none transition-all placeholder:text-text-muted"
      />
      {showEye && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          aria-pressed={showPassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-purple-600 cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility' : 'visibility_off'}</span>
        </button>
      )}
    </div>
  );
};

export default AuthInput;
