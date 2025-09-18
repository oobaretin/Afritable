import React from 'react';
import Header from './Header';
import Footer from './Footer';
import BackButton from '../ui/BackButton';

interface PageLayoutProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  backButtonHref?: string;
  backButtonText?: string;
  backButtonOnClick?: () => void;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  showBackButton = true,
  backButtonHref,
  backButtonText,
  backButtonOnClick,
  className = ''
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className={`flex-1 ${className}`}>
        {showBackButton && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <BackButton 
              href={backButtonHref}
              onClick={backButtonOnClick}
            >
              {backButtonText}
            </BackButton>
          </div>
        )}
        
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default PageLayout;
