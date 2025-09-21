import React from 'react';
import Head from 'next/head';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Hero from '../components/Home/Hero';
import CallToAction from '../components/Home/CallToAction';
import FeaturedRestaurants from '../components/Home/FeaturedRestaurants';
import CuisineCategories from '../components/Home/CuisineCategories';
import HowItWorks from '../components/Home/HowItWorks';

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>Afritable - Discover Amazing African Cuisine</title>
        <meta name="description" content="Find and book reservations at the best African restaurants in your city. From Ethiopian injera to Nigerian jollof rice, discover authentic African cuisine." />
        <meta name="keywords" content="African restaurants, Ethiopian food, Nigerian cuisine, Moroccan food, restaurant reservations, African cuisine" />
        <meta property="og:title" content="Afritable - Discover Amazing African Cuisine" />
        <meta property="og:description" content="Find and book reservations at the best African restaurants in your city." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Afritable - Discover Amazing African Cuisine" />
        <meta name="twitter:description" content="Find and book reservations at the best African restaurants in your city." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main>
          <Hero />
          <CallToAction />
          <FeaturedRestaurants />
          <CuisineCategories />
          <HowItWorks />
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Home;