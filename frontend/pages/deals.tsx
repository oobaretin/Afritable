import React from 'react';
import Head from 'next/head';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

const Deals: React.FC = () => {
  const deals = [
    {
      id: 1,
      title: 'Weekend Brunch Special',
      description: 'Enjoy 20% off your entire brunch order at participating Ethiopian restaurants',
      discount: '20% OFF',
      validUntil: 'Dec 31, 2024',
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
      restaurants: 15
    },
    {
      id: 2,
      title: 'Nigerian Jollof Rice Deal',
      description: 'Buy one jollof rice, get one free at select Nigerian restaurants',
      discount: 'BOGO',
      validUntil: 'Jan 15, 2025',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      restaurants: 8
    },
    {
      id: 3,
      title: 'Moroccan Tagine Tuesday',
      description: '50% off all tagine dishes every Tuesday at Moroccan restaurants',
      discount: '50% OFF',
      validUntil: 'Ongoing',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
      restaurants: 6
    },
    {
      id: 4,
      title: 'West African Suya Special',
      description: 'Free appetizer with any main course order at West African restaurants',
      discount: 'FREE APP',
      validUntil: 'Feb 28, 2025',
      image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop',
      restaurants: 12
    },
    {
      id: 5,
      title: 'East African Samosa Deal',
      description: 'Get 3 samosas for the price of 2 at East African restaurants',
      discount: '3 FOR 2',
      validUntil: 'Mar 10, 2025',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
      restaurants: 7
    },
    {
      id: 6,
      title: 'Somali Tea & Pastry Combo',
      description: 'Enjoy a traditional Somali tea with any pastry for just $5',
      discount: '$5 COMBO',
      validUntil: 'Apr 20, 2025',
      image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=300&fit=crop',
      restaurants: 4
    }
  ];

  return (
    <>
      <Head>
        <title>Special Deals - Afritable</title>
        <meta name="description" content="Discover amazing deals and special offers at African restaurants. Save money while exploring authentic African cuisine in your city." />
        <meta name="keywords" content="African restaurant deals, food discounts, restaurant specials, African cuisine offers" />
        <meta property="og:title" content="Special Deals - Afritable" />
        <meta property="og:description" content="Discover amazing deals and special offers at African restaurants. Save money while exploring authentic African cuisine in your city." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Special Deals - Afritable" />
        <meta name="twitter:description" content="Discover amazing deals and special offers at African restaurants. Save money while exploring authentic African cuisine in your city." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />

        <main>
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Special Deals & Offers
              </h1>
              <p className="text-xl text-orange-100 max-w-3xl mx-auto">
                Save money while exploring the best African cuisine in your city. 
                Discover exclusive deals and special offers from our partner restaurants.
              </p>
            </div>
          </section>

          {/* Deals Grid */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Current Deals
                </h2>
                <p className="text-lg text-gray-600">
                  Limited time offers from your favorite African restaurants
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {deals.map((deal) => (
                  <div key={deal.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="relative h-48">
                      <img
                        src={deal.image}
                        alt={deal.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {deal.discount}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {deal.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {deal.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-500">
                          {deal.restaurants} restaurants
                        </span>
                        <span className="text-sm text-orange-600 font-medium">
                          Valid until {deal.validUntil}
                        </span>
                      </div>
                      <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors duration-200 font-medium">
                        View Restaurants
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  How It Works
                </h2>
                <p className="text-lg text-gray-600">
                  Getting great deals is simple and easy
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-orange-600 text-2xl font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Browse Deals
                  </h3>
                  <p className="text-gray-600">
                    Explore our collection of special offers and discounts from African restaurants in your area.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-orange-600 text-2xl font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Make a Reservation
                  </h3>
                  <p className="text-gray-600">
                    Book your table at the restaurant offering the deal you're interested in.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-orange-600 text-2xl font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Enjoy & Save
                  </h3>
                  <p className="text-gray-600">
                    Visit the restaurant and enjoy your meal with the special discount applied automatically.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Newsletter Signup */}
          <section className="py-16 bg-orange-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Never Miss a Deal
              </h2>
              <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter and be the first to know about new deals, 
                special offers, and exclusive discounts from African restaurants.
              </p>
              <div className="max-w-md mx-auto flex gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-md border-0 focus:ring-2 focus:ring-orange-300 focus:outline-none"
                />
                <button className="bg-white text-orange-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-200">
                  Subscribe
                </button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Deals;
