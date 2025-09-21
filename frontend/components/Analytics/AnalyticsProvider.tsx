import React from 'react';
import GoogleAnalytics from './GoogleAnalytics';
import PerformanceMonitor from './PerformanceMonitor';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <>
      {measurementId && <GoogleAnalytics measurementId={measurementId} />}
      <PerformanceMonitor />
      {children}
    </>
  );
};

export default AnalyticsProvider;

