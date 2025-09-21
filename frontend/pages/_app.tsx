import React from 'react';
import Head from 'next/head';
import '../styles/globals.css';
import AnalyticsProvider from '../components/Analytics/AnalyticsProvider';

function MyApp({ Component, pageProps }: any) {
  return (
    <AnalyticsProvider>
      <Head>
        <title>Afritable - African Restaurant Reservations</title>
        <meta name="description" content="Discover and book reservations at the best African restaurants in your city" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* SEO Meta Tags */}
        <meta property="og:title" content="Afritable - African Restaurant Reservations" />
        <meta property="og:description" content="Discover and book reservations at the best African restaurants in your city" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://afritable.com" />
        <meta property="og:image" content="https://afritable.com/og-image.jpg" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Afritable - African Restaurant Reservations" />
        <meta name="twitter:description" content="Discover and book reservations at the best African restaurants in your city" />
        <meta name="twitter:image" content="https://afritable.com/og-image.jpg" />
        
        {/* Performance Hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
      </Head>
      <Component {...pageProps} />
    </AnalyticsProvider>
  );
}

export default MyApp;
