import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils'; // Jika tidak ada, buat fungsi sederhana

// Fungsi cn sederhana jika belum ada
// const cn = (...classes) => classes.filter(Boolean).join(' ');

const Alert = ({ 
  children, 
  variant = 'default', 
  className,
  show = false,
  onClose,
  autoClose = true,
  duration = 3000,
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
    
    if (show && autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) {
          setTimeout(() => onClose(), 300); // Delay untuk animasi
        }
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, autoClose, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(() => onClose(), 300);
    }
  };

  const variants = {
    default: 'bg-white border-gray-200 text-gray-800',
    success: 'bg-purple-50 border-purple-200 text-purple-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const iconVariants = {
    default: (
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    success: (
      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 max-w-sm w-full",
        "transform transition-all duration-300 ease-in-out",
        isVisible 
          ? "translate-x-0 opacity-100" 
          : "translate-x-full opacity-0",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "flex items-start gap-3 p-4 rounded-lg border shadow-lg",
          "backdrop-blur-sm",
          variants[variant]
        )}
      >
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {iconVariants[variant]}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 ml-2 p-1 rounded-md hover:bg-gray-100 transition-colors"
        >
          <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const AlertTitle = ({ children, className, ...props }) => (
  <h4 className={cn("font-medium text-sm", className)} {...props}>
    {children}
  </h4>
);

const AlertDescription = ({ children, className, ...props }) => (
  <p className={cn("text-sm opacity-90 mt-1", className)} {...props}>
    {children}
  </p>
);

export { Alert, AlertTitle, AlertDescription };