'use client';
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@components/ui/input';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  showPassword: boolean;
  onToggleVisibility: () => void;
  error?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder,
  showPassword,
  onToggleVisibility,
  error,
}) => {
  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        className="pr-10"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        onClick={onToggleVisibility}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default PasswordInput;
