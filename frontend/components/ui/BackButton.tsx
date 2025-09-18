import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface BackButtonProps {
  href?: string;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  href, 
  onClick, 
  className = '', 
  children 
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  const buttonClasses = `
    inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 
    bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 
    transition-colors duration-200 ${className}
  `;

  if (href && !onClick) {
    return (
      <Link href={href} className={buttonClasses}>
        <svg 
          className="w-4 h-4 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M10 19l-7-7m0 0l7-7m-7 7h18" 
          />
        </svg>
        {children || 'Back'}
      </Link>
    );
  }

  return (
    <button onClick={handleClick} className={buttonClasses}>
      <svg 
        className="w-4 h-4 mr-2" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M10 19l-7-7m0 0l7-7m-7 7h18" 
        />
      </svg>
      {children || 'Back'}
    </button>
  );
};

export default BackButton;
