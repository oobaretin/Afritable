import React from 'react';
import Head from 'next/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: any) {
  return (
    <>
      <Head>
        <title>Afritable - African Restaurant Reservations</title>
        <meta name="description" content="Discover and book reservations at the best African restaurants in your city" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
