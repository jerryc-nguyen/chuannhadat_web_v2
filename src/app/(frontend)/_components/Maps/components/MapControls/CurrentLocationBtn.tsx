'use client';

import { Button } from '@components/ui/button';
import { Crosshair } from 'lucide-react';

interface CurrentLocationBtnProps {
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'desktop' | 'mobile';
}

/**
 * Reusable Current Location Button component
 * Used for both desktop and mobile map controls
 */
const CurrentLocationBtn: React.FC<CurrentLocationBtnProps> = ({
  onClick = () => { },
  className = '',
  size = 'md',
  variant = 'desktop',
}) => {
  // Size configurations
  const sizeClasses = {
    sm: 'h-[30px] w-[30px] p-1',
    md: 'h-[34px] w-[34px] p-1',
    lg: 'h-[56px] w-[56px] p-4',
  };

  // Variant-specific classes
  const variantClasses = {
    desktop: 'bg-white hover:bg-gray-100 shadow-md hover:shadow-lg c-mapBtn',
    mobile: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl',
  };

  // Icon size based on button size
  const iconSize = size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';
  const iconColor = variant === 'mobile' ? '' : 'text-gray-600';

  return (
    <Button
      className={`${variantClasses[variant]} ${sizeClasses[size]} rounded-lg border border-gray-200 transition-all duration-200 ${className}`}
      onClick={onClick}
      title="Vị trí của tôi"
    >
      <Crosshair className={`${iconSize} ${iconColor}`} />
    </Button>
  );
};

export default CurrentLocationBtn;
